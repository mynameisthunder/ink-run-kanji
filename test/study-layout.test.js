import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  FOUR_CARD_STUDY,
  SINGLE_CARD_STUDY,
  alignStudyIndex,
  normalizeStudyPageSize,
  studyPage,
} from "../src/study-layout.js";

test("study page size accepts only the one-card and four-card layouts", () => {
  assert.equal(normalizeStudyPageSize(FOUR_CARD_STUDY), FOUR_CARD_STUDY);
  assert.equal(normalizeStudyPageSize("4"), FOUR_CARD_STUDY);
  assert.equal(normalizeStudyPageSize(2), SINGLE_CARD_STUDY);
});

test("four-card study pages stay aligned and keep a shorter final group", () => {
  const cards = Array.from({ length: 10 }, (_, index) => `card-${index + 1}`);
  assert.equal(alignStudyIndex(6, FOUR_CARD_STUDY), 4);
  assert.deepEqual(studyPage(cards, 6, FOUR_CARD_STUDY), {
    start: 4,
    items: ["card-5", "card-6", "card-7", "card-8"],
  });
  assert.deepEqual(studyPage(cards, 9, FOUR_CARD_STUDY), {
    start: 8,
    items: ["card-9", "card-10"],
  });
});

test("the study screen exposes an accessible one-or-four-card control", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const script = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /id="studyPageSizeToggle"[^>]+aria-pressed="false"[^>]+aria-label="Show four study cards at a time"/);
  assert.match(html, /id="studyGrid"[^>]+aria-label="Four study cards"/);
  assert.match(script, /page\.items\.forEach\(\(visibleItem\) => markWordSeen/);
  assert.match(script, /state\.studyIndex \+= effectiveStudyPageSize\(\)/);
});
