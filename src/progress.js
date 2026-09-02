export const RECALLS_PER_WORD = 2;
export const RECOVERY_STREAK = 2;
export const NEEDS_WORK_ENTRY_ACCURACY = .6;
export const NEEDS_WORK_EXIT_ACCURACY = .75;
export const DAILY_REVIEW_MIN_MISSES = 2;
export const DAILY_REVIEW_RECOVERY_STREAK = 3;
export const DAILY_REVIEW_EXIT_ACCURACY = .85;

export function emptyProgress() {
  return {
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    correctStreak: 0,
    reviewRequired: false,
    reviewDismissed: false,
    lastResult: "",
    lastReviewedAt: "",
    progressUpdatedAt: "",
  };
}

export function needsWork(stats) {
  const attempts = stats.correctCount + stats.wrongCount;
  if (!attempts || !stats.reviewRequired || stats.reviewDismissed) return false;
  return stats.correctStreak < RECOVERY_STREAK
    && stats.correctCount / attempts < NEEDS_WORK_EXIT_ACCURACY;
}

export function needsDailyReview(stats) {
  const attempts = stats.correctCount + stats.wrongCount;
  if (!attempts || stats.wrongCount < DAILY_REVIEW_MIN_MISSES) return false;
  return stats.correctStreak < DAILY_REVIEW_RECOVERY_STREAK
    && stats.correctCount / attempts < DAILY_REVIEW_EXIT_ACCURACY;
}

export function applyAttempt(stats, correct, reviewedAt = new Date().toISOString()) {
  const correctCount = stats.correctCount + (correct ? 1 : 0);
  const wrongCount = stats.wrongCount + (correct ? 0 : 1);
  const correctStreak = correct ? stats.correctStreak + 1 : 0;
  const accuracy = correctCount / (correctCount + wrongCount);
  const currentlyNeedsWork = needsWork(stats);
  const graduated = correctStreak >= RECOVERY_STREAK || accuracy >= NEEDS_WORK_EXIT_ACCURACY;
  const reviewRequired = correct
    ? currentlyNeedsWork && !graduated
    : currentlyNeedsWork || accuracy <= NEEDS_WORK_ENTRY_ACCURACY;

  return {
    ...stats,
    seenCount: Math.max(1, stats.seenCount),
    correctCount,
    wrongCount,
    correctStreak,
    reviewRequired,
    reviewDismissed: correct || accuracy > NEEDS_WORK_ENTRY_ACCURACY ? stats.reviewDismissed : false,
    lastResult: correct ? "correct" : "wrong",
    lastReviewedAt: reviewedAt,
    progressUpdatedAt: reviewedAt,
  };
}

export function formatProgressLabel(stats) {
  const attempts = stats.correctCount + stats.wrongCount;
  if (!attempts) return stats.seenCount ? "SEEN · NOT TESTED" : "";
  const accuracy = Math.round((stats.correctCount / attempts) * 100);
  const recovery = needsWork(stats)
    ? ` · NEEDS WORK · ${stats.correctStreak}/${RECOVERY_STREAK} RECOVERY`
    : "";
  return `${stats.correctCount}/${attempts} CORRECT · ${accuracy}%${recovery}`;
}

export function progressIsMastered(stats) {
  return stats.correctCount >= RECALLS_PER_WORD + 1 && !needsWork(stats);
}
