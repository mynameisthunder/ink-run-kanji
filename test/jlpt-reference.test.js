import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { JLPT_REFERENCE_LEVELS } from "../jlpt-reference-data.js";

test("complete JLPT reference data includes every Real Kana level", () => {
  assert.deepEqual(
    JLPT_REFERENCE_LEVELS.map(({ level, sourceEntryCount, uniqueWordCount, pages }) => [level, sourceEntryCount, uniqueWordCount, pages.length]),
    [
      ["N5", 396, 396, 3],
      ["N4", 501, 499, 4],
      ["N3", 1956, 1956, 13],
      ["N2", 853, 849, 6],
      ["N1", 1709, 1709, 12],
    ],
  );
  assert.equal(JLPT_REFERENCE_LEVELS.reduce((total, level) => total + level.sourceEntryCount, 0), 5415);
  assert.ok(JLPT_REFERENCE_LEVELS.every((level) => level.pages.flatMap((page) => page.cards)
    .every((card) => card.word && card.readings.length && Array.isArray(card.annotations))));
});

test("JLPT reference data remains dormant instead of becoming app decks", () => {
  const runtimeFiles = ["../app.js", "../src/vocabulary.js", "../index.html"];
  runtimeFiles.forEach((path) => {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /jlpt-reference-data|JLPT_REFERENCE_LEVELS/);
  });
});
