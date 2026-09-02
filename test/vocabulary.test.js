import test from "node:test";
import assert from "node:assert/strict";

import { DECKS, FREQUENCY_1_WORDS, JLPT_SAMPLE_GROUPS, KANJI, KANJI_BY_WORD, itemKey } from "../src/vocabulary.js";

test("the assembled library keeps every unique study card", () => {
  assert.equal(KANJI.length, 1057);
  assert.equal(new Set(KANJI.map(itemKey)).size, KANJI.length);
});

test("counter overview teaches bare suffixes", () => {
  const words = DECKS["numbers-counter-types"].words
    .map((key) => KANJI_BY_WORD.get(key)?.word);
  assert.deepEqual(words, ["つ", "本", "杯", "人", "匹", "台", "枚", "冊", "歳", "階"]);
});

test("core generated decks remain complete", () => {
  assert.equal(FREQUENCY_1_WORDS.length, 150);
  assert.equal(DECKS.all.words.length, 150);
  assert.equal(new Set(DECKS.all.words).size, 150);
  assert.ok(DECKS.all.words.every((word) => KANJI_BY_WORD.has(word)));
  assert.deepEqual(FREQUENCY_1_WORDS.slice(0, 4), ["人", "一", "大きな", "日本"]);
  assert.deepEqual(DECKS["31-40"].words, ["地域", "気", "事業", "学校", "利用", "前", "規定", "体", "理由", "活動"]);
  assert.equal(KANJI_BY_WORD.get("人").reading, "ひと");
  assert.equal(KANJI_BY_WORD.get("活動").frequency1SourceLabel, "LEVEL 1 · 031—040");
  assert.equal(DECKS["n5-all"].words.length, 396);
  assert.equal(DECKS["n5-all"].setLabel, "REAL KANA · N5 WORDS · ALL 396");
  assert.equal(DECKS["n5-391-396"].words.length, 6);
  assert.equal(KANJI_BY_WORD.get("女の子").n5SourceLabel, "REAL KANA N5 · 391—396");
  assert.equal(DECKS["frequency-2-all"].words.length, 150);
  assert.equal(DECKS["frequency-3-all"].words.length, 150);
  assert.equal(DECKS["frequency-3-141-150"].words.length, 10);
  assert.deepEqual([DECKS["frequency-3-all"].words[0], DECKS["frequency-3-all"].words.at(-1)], ["家族", "七十"]);
  assert.equal(DECKS["frequency-4-all"].words.length, 50);
  assert.equal(DECKS["frequency-4-41-50"].words.length, 10);
  assert.deepEqual([DECKS["frequency-4-all"].words[0], DECKS["frequency-4-all"].words.at(-1)], ["報道", "支配"]);
  assert.equal(KANJI_BY_WORD.get("支配").frequency4SourceLabel, "LEVEL 1:4 · 041—050");
  assert.equal(DECKS["level-2-all"].words.length, 10);
  assert.deepEqual(JLPT_SAMPLE_GROUPS.map((group) => [group.level, group.words.length]), [
    ["N1", 10],
    ["N2", 10],
    ["N3", 10],
  ]);
});
