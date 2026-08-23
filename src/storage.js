export function createStorage({ KANJI, itemKey, NEEDS_WORK_ENTRY_ACCURACY }) {
  const FAVORITES_STORAGE_KEY = "ink-run-favorites-v1";
  const WORD_PROGRESS_STORAGE_KEY = "ink-run-word-progress-v1";
  const CLOUD_SNAPSHOT_PREFIX = "ink-run-cloud-snapshot-v1:";
  const CLOUD_PROGRESS_SNAPSHOT_PREFIX = "ink-run-cloud-progress-snapshot-v2:";
  const LEGACY_PROGRESS_MIGRATION_TIME = new Date().toISOString();
  
  function loadFavoriteWords() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
      const validWords = new Set(KANJI.map(itemKey));
      return new Set(Array.isArray(stored) ? stored.filter((word) => validWords.has(word)) : []);
    } catch {
      return new Set();
    }
  }
  
  function saveFavoriteWords(words) {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...words]));
    } catch {
      // Favorites still work for this session when storage is unavailable.
    }
  }
  
  function loadWordProgress() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(WORD_PROGRESS_STORAGE_KEY) ?? "{}");
      const validWords = new Set(KANJI.map(itemKey));
      return new Map(Object.entries(stored).filter(([word]) => validWords.has(word)).map(([word, value]) => {
        const correctCount = Math.max(0, Number(value?.correctCount) || 0);
        const wrongCount = Math.max(0, Number(value?.wrongCount) || 0);
        const attempts = correctCount + wrongCount;
        const reviewDismissed = Boolean(value?.reviewDismissed);
        const reviewRequired = Boolean(value?.reviewRequired)
          || (!reviewDismissed && wrongCount > 0 && correctCount / attempts <= NEEDS_WORK_ENTRY_ACCURACY);
        const progressUpdatedAt = value?.progressUpdatedAt
          || (attempts || reviewRequired || reviewDismissed ? LEGACY_PROGRESS_MIGRATION_TIME : "");
        return [word, {
          seenCount: Math.max(0, Number(value?.seenCount) || 0),
          correctCount,
          wrongCount,
          correctStreak: Math.max(0, Number(value?.correctStreak) || 0),
          reviewRequired,
          reviewDismissed,
          lastResult: value?.lastResult === "correct" || value?.lastResult === "wrong" ? value.lastResult : "",
          lastReviewedAt: value?.lastReviewedAt || "",
          progressUpdatedAt,
        }];
      }));
    } catch {
      return new Map();
    }
  }
  
  function saveWordProgress(progress) {
    try {
      window.localStorage.setItem(WORD_PROGRESS_STORAGE_KEY, JSON.stringify(Object.fromEntries(progress)));
    } catch {
      // Recall tracking still works for this session when storage is unavailable.
    }
  }
  
  function loadCloudSnapshot(userId) {
    try {
      const stored = window.localStorage.getItem(`${CLOUD_SNAPSHOT_PREFIX}${userId}`);
      if (stored === null) return null;
      const words = JSON.parse(stored);
      return new Set(Array.isArray(words) ? words : []);
    } catch {
      return null;
    }
  }
  
  function saveCloudSnapshot(userId, words) {
    try {
      window.localStorage.setItem(`${CLOUD_SNAPSHOT_PREFIX}${userId}`, JSON.stringify([...words]));
    } catch {
      // Cloud sync still works when local snapshot storage is unavailable.
    }
  }
  
  function loadCloudProgressSnapshot(userId) {
    try {
      const stored = window.localStorage.getItem(`${CLOUD_PROGRESS_SNAPSHOT_PREFIX}${userId}`);
      if (stored === null) return null;
      const snapshot = JSON.parse(stored);
      return new Map(Object.entries(snapshot).map(([word, value]) => [word, {
        correctCount: Math.max(0, Number(value?.correctCount) || 0),
        wrongCount: Math.max(0, Number(value?.wrongCount) || 0),
      }]));
    } catch {
      return null;
    }
  }
  
  function saveCloudProgressSnapshot(userId, progress) {
    try {
      window.localStorage.setItem(
        `${CLOUD_PROGRESS_SNAPSHOT_PREFIX}${userId}`,
        JSON.stringify(Object.fromEntries(progress)),
      );
    } catch {
      // A later sync can safely reconcile from the current cloud totals.
    }
  }
  
  function updateCloudProgressSnapshot(userId, word, stats) {
    const snapshot = loadCloudProgressSnapshot(userId) ?? new Map();
    snapshot.set(word, { correctCount: stats.correctCount, wrongCount: stats.wrongCount });
    saveCloudProgressSnapshot(userId, snapshot);
  }

  return {
    loadCloudProgressSnapshot,
    loadCloudSnapshot,
    loadFavoriteWords,
    loadWordProgress,
    saveCloudProgressSnapshot,
    saveCloudSnapshot,
    saveFavoriteWords,
    saveWordProgress,
    updateCloudProgressSnapshot,
  };
}
