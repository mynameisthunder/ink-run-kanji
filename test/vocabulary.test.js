import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { FREQUENCY_2_IMPORTS } from "../frequency2-data.js";
import { DECKS, JLPT_SAMPLE_GROUPS, KANJI, KANJI_BY_WORD, itemKey } from "../src/vocabulary.js";

test("the assembled library keeps every unique study card", () => {
  assert.equal(KANJI.length, 852);
  assert.equal(new Set(KANJI.map(itemKey)).size, KANJI.length);
});

test("counter overview teaches bare suffixes", () => {
  const words = DECKS["numbers-counter-types"].words
    .map((key) => KANJI_BY_WORD.get(key)?.word);
  assert.deepEqual(words, ["つ", "本", "杯", "人", "匹", "台", "枚", "冊", "歳", "階"]);
});

test("core generated decks remain complete", () => {
  assert.equal(DECKS["n5-all"].words.length, 396);
  assert.equal(DECKS["n5-391-396"].words.length, 6);
  assert.equal(KANJI_BY_WORD.get("女の子").n5SourceLabel, "N5 · 391—396");
  assert.equal(DECKS["frequency-2-all"].words.length, 150);
  assert.equal(DECKS["level-2-all"].words.length, 10);
  assert.deepEqual(JLPT_SAMPLE_GROUPS.map((group) => [group.level, group.words.length]), [
    ["N1", 10],
    ["N2", 10],
    ["N3", 10],
  ]);
});

test("every imported Frequency Level 1:2 card has bundled pronunciation audio", () => {
  FREQUENCY_2_IMPORTS.forEach((item) => {
    assert.ok(item.audioSrc, `${item.word} is missing an audio path`);
    assert.ok(existsSync(new URL(`../${item.audioSrc}`, import.meta.url)), `${item.word} is missing its audio file`);
  });
});

test("every N5 card has bundled pronunciation audio", () => {
  DECKS["n5-all"].words.forEach((word) => {
    const item = KANJI_BY_WORD.get(word);
    assert.ok(item?.audioSrc, `${word} is missing an audio path`);
    assert.ok(existsSync(new URL(`../${item.audioSrc}`, import.meta.url)), `${word} is missing its audio file`);
  });
});

test("every JLPT starter card has bundled pronunciation audio", () => {
  JLPT_SAMPLE_GROUPS.forEach((group) => group.words.forEach((word) => {
    const item = KANJI_BY_WORD.get(word);
    assert.ok(item?.audioSrc, `${word} is missing an audio path`);
    assert.ok(existsSync(new URL(`../${item.audioSrc}`, import.meta.url)), `${word} is missing its audio file`);
  }));
});
