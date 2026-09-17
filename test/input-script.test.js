import test from "node:test";
import assert from "node:assert/strict";

import {
  HIRAGANA_INPUT,
  INPUT_SCRIPT_STORAGE_KEY,
  KATAKANA_INPUT,
  convertReadingInput,
  loadInputScript,
  saveInputScript,
  toggleInputScript,
} from "../src/input-script.js";

function memoryStorage(initialValue = null) {
  const values = new Map(initialValue == null ? [] : [[INPUT_SCRIPT_STORAGE_KEY, initialValue]]);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("input script preference persists and defaults to hiragana", () => {
  const storage = memoryStorage();
  assert.equal(loadInputScript(storage), HIRAGANA_INPUT);
  saveInputScript(KATAKANA_INPUT, storage);
  assert.equal(loadInputScript(storage), KATAKANA_INPUT);
  assert.equal(toggleInputScript(KATAKANA_INPUT), HIRAGANA_INPUT);
});

test("reading input converts romaji and existing kana into the selected script", () => {
  assert.equal(convertReadingInput("watashi", HIRAGANA_INPUT, true), "わたし");
  assert.equal(convertReadingInput("watashi", KATAKANA_INPUT, true), "ワタシ");
  assert.equal(convertReadingInput("わたし", KATAKANA_INPUT), "ワタシ");
  assert.equal(convertReadingInput("ワタシ", HIRAGANA_INPUT), "わたし");
});
