import test from "node:test";
import assert from "node:assert/strict";

import { applyAttempt, emptyProgress, needsDailyReview, needsWork, progressIsMastered } from "../src/progress.js";

test("a miss enters Needs Work and three correct recalls recover it", () => {
  let stats = applyAttempt(emptyProgress(), false, "2026-08-23T00:00:00Z");
  assert.equal(needsWork(stats), true);

  stats = applyAttempt(stats, true);
  stats = applyAttempt(stats, true);
  assert.equal(needsWork(stats), true);

  stats = applyAttempt(stats, true);
  assert.equal(needsWork(stats), false);
  assert.equal(progressIsMastered(stats), true);
});

test("75% accuracy graduates a word from Needs Work", () => {
  let stats = applyAttempt(emptyProgress(), false);
  stats = applyAttempt(stats, true);
  stats = applyAttempt(stats, true);
  stats = applyAttempt(stats, true);
  assert.equal(stats.correctCount / (stats.correctCount + stats.wrongCount), .75);
  assert.equal(needsWork(stats), false);
});

test("a high-accuracy word does not remain in Needs Work", () => {
  let stats = emptyProgress();
  for (let index = 0; index < 8; index += 1) stats = applyAttempt(stats, true);
  stats = applyAttempt(stats, false);
  assert.equal(stats.correctCount, 8);
  assert.equal(stats.wrongCount, 1);
  assert.equal(needsWork(stats), false);
});

test("two misses add a recurring problem word to Daily Review", () => {
  let stats = applyAttempt(emptyProgress(), false);
  assert.equal(needsDailyReview(stats), false);

  stats = applyAttempt(stats, false);
  assert.equal(needsDailyReview(stats), true);
});

test("Daily Review requires both a strong streak and 85% lifetime accuracy", () => {
  let stats = applyAttempt(emptyProgress(), false);
  stats = applyAttempt(stats, false);
  for (let index = 0; index < 5; index += 1) stats = applyAttempt(stats, true);
  assert.equal(stats.correctStreak, 5);
  assert.equal(needsDailyReview(stats), true);

  for (let index = 0; index < 7; index += 1) stats = applyAttempt(stats, true);
  assert.ok(stats.correctCount / (stats.correctCount + stats.wrongCount) >= .85);
  assert.equal(needsDailyReview(stats), false);

  stats = applyAttempt(stats, false);
  assert.equal(needsDailyReview(stats), true);
});
