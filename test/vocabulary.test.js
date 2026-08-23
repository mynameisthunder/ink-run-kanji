import test from "node:test";
import assert from "node:assert/strict";

import { DECKS, KANJI, KANJI_BY_WORD, itemKey } from "../src/vocabulary.js";

test("the assembled library keeps every unique study card", () => {
  assert.equal(KANJI.length, 623);
  assert.equal(new Set(KANJI.map(itemKey)).size, KANJI.length);
});

test("counter overview teaches bare suffixes", () => {
  const words = DECKS["numbers-counter-types"].words
    .map((key) => KANJI_BY_WORD.get(key)?.word);
  assert.deepEqual(words, ["つ", "本", "杯", "人", "匹", "台", "枚", "冊", "歳", "階"]);
});

test("core generated decks remain complete", () => {
  assert.equal(DECKS["n5-all"].words.length, 150);
  assert.equal(DECKS["frequency-2-all"].words.length, 150);
  assert.equal(DECKS["level-2-all"].words.length, 10);
});
