import test from "node:test";
import assert from "node:assert/strict";

import { DAY_OF_WEEK_WORDS, DECKS, FREQUENCY_1_WORDS, JLPT_SAMPLE_GROUPS, KANJI, KANJI_BY_WORD, LOOK_ALIKE_DECKS, LOOK_ALIKE_GROUPS, LOOK_ALIKE_WORDS, itemKey } from "../src/vocabulary.js";

test("the assembled library keeps every unique study card", () => {
  assert.equal(KANJI.length, 1492);
  assert.equal(new Set(KANJI.map(itemKey)).size, KANJI.length);
});

test("counter overview teaches bare suffixes", () => {
  const words = DECKS["numbers-counter-types"].words
    .map((key) => KANJI_BY_WORD.get(key)?.word);
  assert.deepEqual(words, ["つ", "本", "杯", "人", "匹", "台", "枚", "冊", "歳", "階"]);
});

test("number cards include natural dungeon meaning answers", () => {
  assert.ok(KANJI_BY_WORD.get("三本").meanings.includes("three bottles"));
  assert.ok(KANJI_BY_WORD.get("二日").meanings.includes("second"));
  assert.ok(KANJI_BY_WORD.get("一日").meanings.includes("first"));
  assert.ok(KANJI_BY_WORD.get("counter-types:冊").meanings.includes("books"));
});

test("days of the week are available as one ordered deck", () => {
  assert.deepEqual(DAY_OF_WEEK_WORDS, ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"]);
  assert.deepEqual(DECKS["days-of-week"].words, DAY_OF_WEEK_WORDS);
  assert.equal(DECKS["days-of-week"].setLabel, "ESSENTIALS · DAYS OF THE WEEK");
  assert.ok(DAY_OF_WEEK_WORDS.every((word) => KANJI_BY_WORD.has(word)));
  assert.equal(KANJI_BY_WORD.get("木曜日").reading, "もくようび");
});

test("look-alike practice is split into small thematic decks without duplicate cards", () => {
  assert.equal(LOOK_ALIKE_WORDS.length, 103);
  assert.equal(new Set(LOOK_ALIKE_WORDS).size, LOOK_ALIKE_WORDS.length);
  assert.equal(LOOK_ALIKE_DECKS.length, 10);
  assert.ok(LOOK_ALIKE_DECKS.every(({ words }) => words.length >= 8 && words.length <= 12));
  assert.equal(LOOK_ALIKE_DECKS.reduce((total, { words }) => total + words.length, 0), LOOK_ALIKE_WORDS.length);
  assert.ok(LOOK_ALIKE_GROUPS.every((group) => group.length >= 2));
  assert.ok(LOOK_ALIKE_WORDS.every((word) => KANJI_BY_WORD.has(word)));
  assert.deepEqual(LOOK_ALIKE_GROUPS[0], ["意味", "意見", "意識"]);
  assert.ok(LOOK_ALIKE_GROUPS.some((group) => group.join("・") === "現在・存在"));
  assert.ok(LOOK_ALIKE_GROUPS.some((group) => group.join("・") === "切る・着る・着く"));
  LOOK_ALIKE_DECKS.forEach(({ key, label, words }) => {
    assert.deepEqual(DECKS[key].words, words);
    assert.equal(DECKS[key].label, label);
  });
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
  assert.equal(DECKS["level-2-all"].words.length, 500);
  assert.equal(DECKS["level-2-491-500"].words.length, 10);
  assert.deepEqual([DECKS["level-2-all"].words[0], DECKS["level-2-all"].words.at(-1)], ["頭", "病"]);
  assert.ok(DECKS["level-2-all"].words.every((word) => KANJI_BY_WORD.has(word)));
  assert.ok(DECKS["level-2-all"].words.every((word) => !KANJI_BY_WORD.get(word).meaning.startsWith("Japanese word read")));
  assert.equal(KANJI_BY_WORD.get("病").level2SourceLabel, "LEVEL 2 · 491—500");
  assert.deepEqual(JLPT_SAMPLE_GROUPS.map((group) => [group.level, group.words.length]), [
    ["N1", 10],
    ["N2", 10],
    ["N3", 10],
  ]);
});
