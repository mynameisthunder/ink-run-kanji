(() => {
  const config = window.INK_RUN_CLOUD_CONFIG;
  const sdk = window.supabase;
  const client = config?.url && config?.publishableKey && sdk?.createClient
    ? sdk.createClient(config.url, config.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
    : null;

  let currentUser = null;
  let authSubscription = null;
  let exactProgressSyncAvailable = true;

  async function init(onUserChange) {
    if (!client) {
      await onUserChange(null, new Error("Cloud sync is unavailable. Local save is still active."));
      return false;
    }

    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user ?? null;
    await onUserChange(currentUser, null);

    const authListener = client.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      if (nextUser?.id === currentUser?.id) return;
      currentUser = nextUser;
      window.setTimeout(() => onUserChange(currentUser, null), 0);
    });
    authSubscription = authListener.data.subscription;
    return true;
  }

  async function signIn(email) {
    if (!client) throw new Error("Cloud sync is unavailable.");
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    if (error) throw error;
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function loadProgress() {
    if (!client || !currentUser) return [];
    const result = await client
      .from("user_word_progress")
      .select("word,favorite,correct_count,wrong_count,correct_streak,review_required,review_dismissed,last_reviewed_at,progress_updated_at,updated_at");
    if (!result.error) {
      exactProgressSyncAvailable = true;
      return result.data ?? [];
    }
    const migrationPending = result.error.code === "42703"
      || /column .* does not exist|schema cache/i.test(result.error.message ?? "");
    if (!migrationPending) throw result.error;

    exactProgressSyncAvailable = false;
    const legacyResult = await client
      .from("user_word_progress")
      .select("word,favorite,correct_count,wrong_count,last_reviewed_at,updated_at");
    if (legacyResult.error) throw legacyResult.error;
    return (legacyResult.data ?? []).map((row) => ({
      ...row,
      correct_streak: 0,
      review_required: false,
      review_dismissed: false,
      progress_updated_at: null,
    }));
  }

  async function setFavorite(word, favorite) {
    if (!client || !currentUser) return false;
    const { error } = await client.rpc("set_word_favorite", { p_word: word, p_favorite: favorite });
    if (error) throw error;
    return true;
  }

  async function setFavorites(changes) {
    for (const { word, favorite } of changes) await setFavorite(word, favorite);
  }

  async function recordAttempt(word, correct) {
    if (!client || !currentUser) return false;
    const { error } = await client.rpc("record_word_attempt", { p_word: word, p_correct: correct });
    if (error) throw error;
    return true;
  }

  async function dismissReview(word) {
    if (!client || !currentUser || !exactProgressSyncAvailable) return false;
    const { error } = await client.rpc("dismiss_word_review", { p_word: word });
    if (error) throw error;
    return true;
  }

  async function syncProgress(progress) {
    if (!client || !currentUser || !exactProgressSyncAvailable || progress.length === 0) return false;
    const { error } = await client.rpc("sync_word_progress", { p_progress: progress });
    if (error) throw error;
    return true;
  }

  function destroy() {
    authSubscription?.unsubscribe();
    authSubscription = null;
  }

  function supportsExactProgressSync() {
    return exactProgressSyncAvailable;
  }

  window.inkRunCloud = Object.freeze({
    available: Boolean(client), init, signIn, signOut, loadProgress, setFavorite, setFavorites,
    recordAttempt, dismissReview, syncProgress, supportsExactProgressSync, destroy,
  });
})();
