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
    const { data, error } = await client
      .from("user_word_progress")
      .select("word,favorite,correct_count,wrong_count,last_reviewed_at,updated_at");
    if (error) throw error;
    return data ?? [];
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

  function destroy() {
    authSubscription?.unsubscribe();
    authSubscription = null;
  }

  window.inkRunCloud = Object.freeze({
    available: Boolean(client), init, signIn, signOut, loadProgress, setFavorite, setFavorites, recordAttempt, destroy,
  });
})();
