alter table public.user_word_progress
  add column if not exists correct_streak bigint not null default 0 check (correct_streak >= 0),
  add column if not exists review_required boolean not null default false,
  add column if not exists review_dismissed boolean not null default false,
  add column if not exists progress_updated_at timestamptz;

-- Existing cloud rows do not contain streak history. Seed only the state that can
-- be derived safely; the first signed-in client sync supplies its exact local state.
update public.user_word_progress
set review_required = wrong_count > 0
    and correct_count::double precision / nullif(correct_count + wrong_count, 0) <= .6,
    progress_updated_at = coalesce(progress_updated_at, last_reviewed_at)
where progress_updated_at is null;

create or replace function public.record_word_attempt(p_word text, p_correct boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.user_word_progress (
    user_id, word, correct_count, wrong_count, correct_streak,
    review_required, review_dismissed, last_reviewed_at, progress_updated_at, updated_at
  )
  values (
    auth.uid(), p_word,
    case when p_correct then 1 else 0 end,
    case when p_correct then 0 else 1 end,
    case when p_correct then 1 else 0 end,
    not p_correct, false, now(), now(), now()
  )
  on conflict (user_id, word) do update
    set correct_count = public.user_word_progress.correct_count + case when p_correct then 1 else 0 end,
        wrong_count = public.user_word_progress.wrong_count + case when p_correct then 0 else 1 end,
        correct_streak = case when p_correct then public.user_word_progress.correct_streak + 1 else 0 end,
        review_required = case
          when p_correct then
            public.user_word_progress.review_required
            and not public.user_word_progress.review_dismissed
            and public.user_word_progress.correct_streak < 3
            and public.user_word_progress.correct_count + public.user_word_progress.wrong_count > 0
            and public.user_word_progress.correct_count::double precision
              / nullif(public.user_word_progress.correct_count + public.user_word_progress.wrong_count, 0) < .75
            and not (
              public.user_word_progress.correct_streak + 1 >= 3
              or (public.user_word_progress.correct_count + 1)::double precision
                / (public.user_word_progress.correct_count + public.user_word_progress.wrong_count + 1) >= .75
            )
          else
            (
              public.user_word_progress.review_required
              and not public.user_word_progress.review_dismissed
              and public.user_word_progress.correct_streak < 3
              and public.user_word_progress.correct_count + public.user_word_progress.wrong_count > 0
              and public.user_word_progress.correct_count::double precision
                / nullif(public.user_word_progress.correct_count + public.user_word_progress.wrong_count, 0) < .75
            )
            or public.user_word_progress.correct_count::double precision
              / (public.user_word_progress.correct_count + public.user_word_progress.wrong_count + 1) <= .6
        end,
        review_dismissed = case
          when p_correct then public.user_word_progress.review_dismissed
          when public.user_word_progress.correct_count::double precision
            / (public.user_word_progress.correct_count + public.user_word_progress.wrong_count + 1) <= .6 then false
          else public.user_word_progress.review_dismissed
        end,
        last_reviewed_at = now(), progress_updated_at = now(), updated_at = now();
end;
$$;

create or replace function public.dismiss_word_review(p_word text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.user_word_progress (
    user_id, word, review_required, review_dismissed, progress_updated_at, updated_at
  )
  values (auth.uid(), p_word, false, true, now(), now())
  on conflict (user_id, word) do update
    set review_required = false,
        review_dismissed = true,
        progress_updated_at = now(),
        updated_at = now();
end;
$$;

create or replace function public.sync_word_progress(p_progress jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
  item_word text;
  correct_delta bigint;
  wrong_delta bigint;
  item_progress_updated_at timestamptz;
  item_last_reviewed_at timestamptz;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(p_progress) <> 'array' then raise exception 'Progress must be an array'; end if;

  for item in select value from jsonb_array_elements(p_progress)
  loop
    item_word := item ->> 'word';
    if item_word is null or char_length(item_word) not between 1 and 32 then
      raise exception 'Invalid word';
    end if;

    correct_delta := greatest(0, coalesce((item ->> 'correct_delta')::bigint, 0));
    wrong_delta := greatest(0, coalesce((item ->> 'wrong_delta')::bigint, 0));
    item_progress_updated_at := nullif(item ->> 'progress_updated_at', '')::timestamptz;
    item_last_reviewed_at := nullif(item ->> 'last_reviewed_at', '')::timestamptz;

    insert into public.user_word_progress (
      user_id, word, correct_count, wrong_count, correct_streak,
      review_required, review_dismissed, last_reviewed_at, progress_updated_at, updated_at
    )
    values (
      auth.uid(), item_word, correct_delta, wrong_delta,
      greatest(0, coalesce((item ->> 'correct_streak')::bigint, 0)),
      coalesce((item ->> 'review_required')::boolean, false),
      coalesce((item ->> 'review_dismissed')::boolean, false),
      item_last_reviewed_at, item_progress_updated_at, now()
    )
    on conflict (user_id, word) do update
      set correct_count = public.user_word_progress.correct_count + correct_delta,
          wrong_count = public.user_word_progress.wrong_count + wrong_delta,
          correct_streak = case
            when item_progress_updated_at is not null
              and (public.user_word_progress.progress_updated_at is null
                or item_progress_updated_at > public.user_word_progress.progress_updated_at)
              then greatest(0, coalesce((item ->> 'correct_streak')::bigint, 0))
            else public.user_word_progress.correct_streak
          end,
          review_required = case
            when item_progress_updated_at is not null
              and (public.user_word_progress.progress_updated_at is null
                or item_progress_updated_at > public.user_word_progress.progress_updated_at)
              then coalesce((item ->> 'review_required')::boolean, false)
            else public.user_word_progress.review_required
          end,
          review_dismissed = case
            when item_progress_updated_at is not null
              and (public.user_word_progress.progress_updated_at is null
                or item_progress_updated_at > public.user_word_progress.progress_updated_at)
              then coalesce((item ->> 'review_dismissed')::boolean, false)
            else public.user_word_progress.review_dismissed
          end,
          last_reviewed_at = case
            when public.user_word_progress.last_reviewed_at is null then item_last_reviewed_at
            when item_last_reviewed_at is null then public.user_word_progress.last_reviewed_at
            else greatest(public.user_word_progress.last_reviewed_at, item_last_reviewed_at)
          end,
          progress_updated_at = case
            when public.user_word_progress.progress_updated_at is null then item_progress_updated_at
            when item_progress_updated_at is null then public.user_word_progress.progress_updated_at
            else greatest(public.user_word_progress.progress_updated_at, item_progress_updated_at)
          end,
          updated_at = now();
  end loop;
end;
$$;

revoke all on function public.record_word_attempt(text, boolean) from public;
revoke all on function public.dismiss_word_review(text) from public;
revoke all on function public.sync_word_progress(jsonb) from public;
grant execute on function public.record_word_attempt(text, boolean) to authenticated;
grant execute on function public.dismiss_word_review(text) to authenticated;
grant execute on function public.sync_word_progress(jsonb) to authenticated;
