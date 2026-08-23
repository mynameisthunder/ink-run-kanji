import test from "node:test";
import assert from "node:assert/strict";

import { answerIsCorrect, romajiToHiragana, toHiragana } from "../src/kana.js";

test("romaji input handles long sounds, doubled consonants, and final n", () => {
  assert.equal(romajiToHiragana("kyou", true), "きょう");
  assert.equal(romajiToHiragana("gakkou", true), "がっこう");
  assert.equal(romajiToHiragana("hon", true), "ほん");
});

test("katakana normalizes to hiragana", () => {
  assert.equal(toHiragana("カタカナ"), "かたかな");
});

test("answers accept both kana and romaji", () => {
  const item = { reading: "きょう", kana: ["きょう"], romaji: ["kyou", "kyo"] };
  assert.equal(answerIsCorrect("きょう", item), true);
  assert.equal(answerIsCorrect(romajiToHiragana("kyou", true), item), true);
  assert.equal(answerIsCorrect("ashita", item), false);
});
