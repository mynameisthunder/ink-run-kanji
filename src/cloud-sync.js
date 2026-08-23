export function createCloudSync({
  state,
  elements,
  KANJI,
  itemKey,
  NEEDS_WORK_ENTRY_ACCURACY,
  loadCloudProgressSnapshot,
  loadCloudSnapshot,
  progressFor,
  renderDeckSelection,
  saveCloudProgressSnapshot,
  saveCloudSnapshot,
  saveFavoriteWords,
  saveWordProgress,
  updateCloudProgressSnapshot,
  updateProgressControls,
}) {
  let cloudWriteQueue = Promise.resolve();
  let activeCloudSync = null;
  
  function setCloudStatus(message, tone = "") {
    elements.cloudStatus.textContent = message;
    elements.cloudStatus.classList.toggle("success", tone === "success");
    elements.cloudStatus.classList.toggle("error", tone === "error");
    elements.account.classList.toggle("syncing", tone === "syncing");
    elements.account.classList.toggle("synced", tone === "success");
    elements.account.classList.toggle("error", tone === "error");
  }
  
  function updateAccountUI() {
    const signedIn = Boolean(state.cloudUser);
    elements.accountLabel.textContent = signedIn ? "SYNCED" : "SIGN IN";
    elements.signedOutPanel.classList.toggle("hidden", signedIn);
    elements.signedInPanel.classList.toggle("hidden", !signedIn);
    elements.accountEmail.textContent = state.cloudUser?.email ?? "";
    if (!signedIn) setCloudStatus("LOCAL SAVE ACTIVE · SIGN IN TO SYNC DEVICES");
  }
  
  function updateSnapshotWord(userId, word, favorite) {
    const snapshot = loadCloudSnapshot(userId) ?? new Set();
    if (favorite) snapshot.add(word);
    else snapshot.delete(word);
    saveCloudSnapshot(userId, snapshot);
  }
  
  async function synchronizeCloudProgress() {
    if (!state.cloudUser || !window.inkRunCloud?.available) return;
    if (activeCloudSync) return activeCloudSync;
  
    const userId = state.cloudUser.id;
    activeCloudSync = (async () => {
      setCloudStatus("SYNCING LOCAL + CLOUD PROGRESS…", "syncing");
      await cloudWriteQueue.catch(() => {});
      let rows = await window.inkRunCloud.loadProgress();
      const exactProgressSync = window.inkRunCloud.supportsExactProgressSync?.() !== false;
      const validWords = new Set(KANJI.map(itemKey));
      const remoteByWord = new Map(rows.filter((row) => validWords.has(row.word)).map((row) => [row.word, row]));
      const previousProgressSnapshot = loadCloudProgressSnapshot(userId);
      const progressChanges = [...state.wordProgress.entries()]
        .filter(([word, stats]) => validWords.has(word) && (
          stats.correctCount || stats.wrongCount || stats.reviewRequired || stats.reviewDismissed
        ))
        .map(([word, stats]) => {
          const remote = remoteByWord.get(word);
          const baseline = previousProgressSnapshot?.get(word) ?? {
            correctCount: Math.max(0, Number(remote?.correct_count) || 0),
            wrongCount: Math.max(0, Number(remote?.wrong_count) || 0),
          };
          return {
            word,
            correct_delta: Math.max(0, stats.correctCount - baseline.correctCount),
            wrong_delta: Math.max(0, stats.wrongCount - baseline.wrongCount),
            correct_streak: stats.correctStreak,
            review_required: stats.reviewRequired,
            review_dismissed: stats.reviewDismissed,
            last_reviewed_at: stats.lastReviewedAt || null,
            progress_updated_at: stats.progressUpdatedAt || stats.lastReviewedAt || null,
          };
        });
      if (exactProgressSync && progressChanges.length) {
        await window.inkRunCloud.syncProgress(progressChanges);
        rows = await window.inkRunCloud.loadProgress();
      }
  
      const cloudProgressSnapshot = new Map();
      rows.filter((row) => validWords.has(row.word)).forEach((row) => {
        const local = progressFor(row.word);
        const remoteCorrect = Math.max(0, Number(row.correct_count) || 0);
        const remoteWrong = Math.max(0, Number(row.wrong_count) || 0);
        const remoteAttempts = remoteCorrect + remoteWrong;
        const correctCount = Math.max(local.correctCount, remoteCorrect);
        const wrongCount = Math.max(local.wrongCount, remoteWrong);
        cloudProgressSnapshot.set(row.word, { correctCount: remoteCorrect, wrongCount: remoteWrong });
        state.wordProgress.set(row.word, {
          ...local,
          seenCount: Math.max(local.seenCount, remoteAttempts ? 1 : 0),
          correctCount,
          wrongCount,
          correctStreak: exactProgressSync ? Math.max(0, Number(row.correct_streak) || 0) : local.correctStreak,
          reviewRequired: exactProgressSync
            ? Boolean(row.review_required)
            : local.reviewRequired || (!local.reviewDismissed && remoteWrong > 0
              && remoteCorrect / remoteAttempts <= NEEDS_WORK_ENTRY_ACCURACY),
          reviewDismissed: exactProgressSync ? Boolean(row.review_dismissed) : local.reviewDismissed,
          lastReviewedAt: [local.lastReviewedAt, row.last_reviewed_at].filter(Boolean).sort().at(-1) ?? "",
          progressUpdatedAt: row.progress_updated_at || local.progressUpdatedAt || "",
        });
      });
      saveWordProgress(state.wordProgress);
      saveCloudProgressSnapshot(userId, cloudProgressSnapshot);
      const remoteFavorites = new Set(rows.filter((row) => row.favorite && validWords.has(row.word)).map((row) => row.word));
      const localFavorites = new Set([...state.favoriteWords].filter((word) => validWords.has(word)));
      const previousSnapshot = loadCloudSnapshot(userId);
      const localAdds = previousSnapshot
        ? [...localFavorites].filter((word) => !previousSnapshot.has(word))
        : [...localFavorites];
      const localRemovals = previousSnapshot
        ? [...previousSnapshot].filter((word) => !localFavorites.has(word))
        : [];
  
      const changes = [
        ...localAdds.map((word) => ({ word, favorite: true })),
        ...localRemovals.map((word) => ({ word, favorite: false })),
      ];
      if (changes.length) await window.inkRunCloud.setFavorites(changes);
  
      const mergedFavorites = new Set(remoteFavorites);
      localAdds.forEach((word) => mergedFavorites.add(word));
      localRemovals.forEach((word) => mergedFavorites.delete(word));
      state.favoriteWords = mergedFavorites;
      saveFavoriteWords(mergedFavorites);
      saveCloudSnapshot(userId, mergedFavorites);
      renderDeckSelection();
      updateProgressControls();
      setCloudStatus(
        exactProgressSync
          ? `SYNCED · ${mergedFavorites.size} STARRED · NEEDS WORK UP TO DATE`
          : `SYNCED · ${mergedFavorites.size} STARRED · DATABASE UPGRADE PENDING`,
        "success",
      );
    })().catch((error) => {
      setCloudStatus(`SYNC PAUSED · ${error.message} · LOCAL SAVE IS SAFE`, "error");
    }).finally(() => {
      activeCloudSync = null;
    });
  
    return activeCloudSync;
  }
  
  function queueFavoriteSync(word, favorite) {
    const user = state.cloudUser;
    if (!user || !window.inkRunCloud?.available) return;
    setCloudStatus("SYNCING STAR…", "syncing");
    cloudWriteQueue = cloudWriteQueue.catch(() => {}).then(async () => {
      await window.inkRunCloud.setFavorite(word, favorite);
      updateSnapshotWord(user.id, word, favorite);
      setCloudStatus(`SYNCED · ${state.favoriteWords.size} STARRED · RECALL HISTORY ON`, "success");
    }).catch((error) => {
      setCloudStatus(`STAR SAVED LOCALLY · ${error.message}`, "error");
    });
  }
  
  function queueCloudAttempt(word, correct) {
    const user = state.cloudUser;
    if (!user || !window.inkRunCloud?.available) return;
    const stats = { ...progressFor(word) };
    cloudWriteQueue = cloudWriteQueue.catch(() => {}).then(async () => {
      await window.inkRunCloud.recordAttempt(word, correct);
      updateCloudProgressSnapshot(user.id, word, stats);
    }).catch((error) => {
      setCloudStatus(`RECALL SAVED LOCALLY ONLY · ${error.message}`, "error");
    });
  }
  
  function queueCloudDismiss(word) {
    if (!state.cloudUser || !window.inkRunCloud?.available) return;
    cloudWriteQueue = cloudWriteQueue.catch(() => {}).then(() => window.inkRunCloud.dismissReview(word)).catch((error) => {
      setCloudStatus(`REMOVAL SAVED LOCALLY ONLY · ${error.message}`, "error");
    });
  }
  
  async function handleCloudUser(user, startupError) {
    if (startupError) {
      state.cloudUser = null;
      updateAccountUI();
      setCloudStatus(startupError.message, "error");
      return;
    }
    state.cloudUser = user;
    updateAccountUI();
    if (user) await synchronizeCloudProgress();
  }
  
  async function initializeCloudSync() {
    if (!window.inkRunCloud?.available) {
      updateAccountUI();
      setCloudStatus("CLOUD UNAVAILABLE · LOCAL SAVE ACTIVE", "error");
      return;
    }
    try {
      await window.inkRunCloud.init(handleCloudUser);
    } catch (error) {
      await handleCloudUser(null, error);
    }
  }

  return {
    initializeCloudSync,
    queueCloudAttempt,
    queueCloudDismiss,
    queueFavoriteSync,
    setCloudStatus,
    synchronizeCloudProgress,
  };
}
