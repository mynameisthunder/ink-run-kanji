import test from "node:test";
import assert from "node:assert/strict";

import { isNeedsWorkOnlySelection, shouldRequeueMiss } from "../src/review-run.js";

test("Needs Work is recognized only when it is the complete selection", () => {
  assert.equal(isNeedsWorkOnlySelection(["needs-work"]), true);
  assert.equal(isNeedsWorkOnlySelection(["needs-work", "daily-review"]), false);
  assert.equal(isNeedsWorkOnlySelection(["daily-review"]), false);
});

test("Needs Work final recall misses wait for the next run", () => {
  assert.equal(shouldRequeueMiss("finalRecall", true), false);
  assert.equal(shouldRequeueMiss("finalRecall", false), true);
  assert.equal(shouldRequeueMiss("batchRecall", true), true);
});
