create table public.user_word_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null check (char_length(word) between 1 and 32),
  favorite boolean not null default false,
  correct_count bigint not null default 0 check (correct_count >= 0),
  wrong_count bigint not null default 0 check (wrong_count >= 0),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, word)
);

alter table public.user_word_progress enable row level security;

create policy "Users can read their own word progress"
on public.user_word_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

grant select on public.user_word_progress to authenticated;

create or replace function public.set_word_favorite(p_word text, p_favorite boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.user_word_progress (user_id, word, favorite, updated_at)
  values (auth.uid(), p_word, p_favorite, now())
  on conflict (user_id, word) do update
    set favorite = excluded.favorite, updated_at = now();
end;
$$;

create or replace function public.record_word_attempt(p_word text, p_correct boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.user_word_progress (user_id, word, correct_count, wrong_count, last_reviewed_at, updated_at)
  values (auth.uid(), p_word, case when p_correct then 1 else 0 end, case when p_correct then 0 else 1 end, now(), now())
  on conflict (user_id, word) do update
    set correct_count = public.user_word_progress.correct_count + case when p_correct then 1 else 0 end,
        wrong_count = public.user_word_progress.wrong_count + case when p_correct then 0 else 1 end,
        last_reviewed_at = now(), updated_at = now();
end;
$$;

revoke all on function public.set_word_favorite(text, boolean) from public;
revoke all on function public.record_word_attempt(text, boolean) from public;
grant execute on function public.set_word_favorite(text, boolean) to authenticated;
grant execute on function public.record_word_attempt(text, boolean) to authenticated;

create index user_word_progress_reviewed_idx
on public.user_word_progress (user_id, last_reviewed_at desc);
