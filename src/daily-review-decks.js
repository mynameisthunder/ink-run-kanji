export const DAILY_REVIEW_CHUNK_SIZE = 10;

const DAILY_REVIEW_CHUNK_PREFIX = "daily-review-chunk-";

export function dailyReviewChunkKey(start) {
  return `${DAILY_REVIEW_CHUNK_PREFIX}${start}`;
}

export function dailyReviewChunkStart(key) {
  if (!key.startsWith(DAILY_REVIEW_CHUNK_PREFIX)) return null;
  const start = Number.parseInt(key.slice(DAILY_REVIEW_CHUNK_PREFIX.length), 10);
  return Number.isInteger(start) && start > 0 && (start - 1) % DAILY_REVIEW_CHUNK_SIZE === 0
    ? start
    : null;
}

export function dailyReviewChunkRanges(count) {
  const safeCount = Math.max(0, Number.parseInt(count, 10) || 0);
  return Array.from({ length: Math.ceil(safeCount / DAILY_REVIEW_CHUNK_SIZE) }, (_, index) => {
    const start = index * DAILY_REVIEW_CHUNK_SIZE + 1;
    return {
      start,
      end: Math.min(start + DAILY_REVIEW_CHUNK_SIZE - 1, safeCount),
      key: dailyReviewChunkKey(start),
    };
  });
}

export function formatDailyReviewRange(start, end) {
  const width = Math.max(3, String(end).length);
  return `${String(start).padStart(width, "0")}—${String(end).padStart(width, "0")}`;
}
