import test from "node:test";
import assert from "node:assert/strict";

import {
  dailyReviewChunkKey,
  dailyReviewChunkRanges,
  dailyReviewChunkStart,
  formatDailyReviewRange,
} from "../src/daily-review-decks.js";

test("daily review ranges split a live stack into chunks of ten", () => {
  assert.deepEqual(dailyReviewChunkRanges(23), [
    { start: 1, end: 10, key: "daily-review-chunk-1" },
    { start: 11, end: 20, key: "daily-review-chunk-11" },
    { start: 21, end: 23, key: "daily-review-chunk-21" },
  ]);
});

test("daily review chunk keys round-trip and reject invalid starts", () => {
  assert.equal(dailyReviewChunkKey(11), "daily-review-chunk-11");
  assert.equal(dailyReviewChunkStart("daily-review-chunk-11"), 11);
  assert.equal(dailyReviewChunkStart("daily-review-chunk-12"), null);
  assert.equal(dailyReviewChunkStart("daily-review"), null);
});

test("daily review ranges use stable three-digit labels", () => {
  assert.equal(formatDailyReviewRange(1, 10), "001—010");
  assert.equal(formatDailyReviewRange(121, 123), "121—123");
});
