import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { FREQUENCY_REFERENCE_GROUPS } from "../frequency-reference-data.js";

test("complete frequency reference data includes every Real Kana group", () => {
  assert.deepEqual(
    FREQUENCY_REFERENCE_GROUPS.map(({ group, sourceEntryCount, pages }) => [group, sourceEntryCount, pages.length]),
    [
      ["LEVEL 1", 500, 4], ["LEVEL 2", 500, 4], ["LEVEL 3", 500, 4], ["LEVEL 4", 500, 4],
      ["EXTRA 1", 500, 4], ["EXTRA 2", 500, 4], ["EXTRA 3", 500, 4], ["EXTRA 4", 500, 4],
      ["EXTRA 5", 500, 4], ["EXTRA 6", 500, 4],
    ],
  );
  assert.equal(FREQUENCY_REFERENCE_GROUPS.reduce((total, group) => total + group.sourceEntryCount, 0), 5000);
  assert.ok(FREQUENCY_REFERENCE_GROUPS.every((group) => group.pages.flatMap((page) => page.cards)
    .every((card) => card.word
      && card.readings.length
      && card.romaji.length === card.readings.length
      && card.meaning
      && card.breakdown.length
      && card.breakdown.every((part) => part.length === 3 && part.every(Boolean))
      && card.memory
      && Array.isArray(card.annotations))));
  assert.ok(FREQUENCY_REFERENCE_GROUPS.flatMap((group) => group.pages.flatMap((page) => page.cards))
    .every((card) => !card.meaning.startsWith("Japanese word read")));
});

test("frequency reference data remains dormant instead of becoming app decks", () => {
  const runtimeFiles = ["../app.js", "../src/vocabulary.js", "../index.html"];
  runtimeFiles.forEach((path) => {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /frequency-reference-data|FREQUENCY_REFERENCE_GROUPS/);
  });
});
