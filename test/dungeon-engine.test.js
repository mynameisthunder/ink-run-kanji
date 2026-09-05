import test from "node:test";
import assert from "node:assert/strict";

import {
  attackDungeon,
  createDungeonState,
  fleeDungeon,
  meaningAnswerIsCorrect,
  normalizeMeaningAnswer,
  useDungeonHint,
} from "../src/dungeon-engine.js";

const words = [
  {
    word: "経済",
    reading: "けいざい",
    romaji: ["keizai"],
    meaning: "economy; economics; finance",
    breakdown: [["経", "けい", "manage"], ["済", "ざい", "settle"]],
  },
  {
    word: "結果",
    reading: "けっか",
    romaji: ["kekka"],
    meaning: "result; outcome; consequence",
    breakdown: [["結", "けっ", "conclude"], ["果", "か", "result"]],
  },
];

const noShuffle = () => .999;

test("meaning matching accepts listed synonyms but not related guesses", () => {
  assert.equal(normalizeMeaningAnswer(" The Economy "), "economy");
  assert.equal(meaningAnswerIsCorrect("finance", words[0]), true);
  assert.equal(meaningAnswerIsCorrect("money", words[0]), false);
});

test("meaning matching accepts ordinary English inflections and alternatives", () => {
  assert.equal(meaningAnswerIsCorrect("rights", { meaning: "right; privilege" }), true);
  assert.equal(meaningAnswerIsCorrect("privileges", { meaning: "right; privilege" }), true);
  assert.equal(meaningAnswerIsCorrect("people", { meaning: "person" }), true);
  assert.equal(meaningAnswerIsCorrect("sex", { meaning: "nature; characteristic; gender or sex" }), true);
  assert.equal(meaningAnswerIsCorrect("university student", { meaning: "student (esp. a university student)" }), true);
  assert.equal(meaningAnswerIsCorrect("right answer", { meaning: "right; privilege" }), false);
  assert.equal(meaningAnswerIsCorrect("company", { meaning: "business" }), false);
  assert.equal(meaningAnswerIsCorrect("animal", { meaning: "activity (of a person, organization, animal, volcano, etc.)" }), false);
});

test("meaning matching accepts expanded counter and calendar aliases", () => {
  const counter = { word: "三本", meaning: "3 long or cylindrical objects", meanings: ["three bottles", "3 long objects"] };
  const day = { word: "二日", meaning: "second day of the month; two days", meanings: ["second", "2nd", "second day"] };
  assert.equal(meaningAnswerIsCorrect("three bottles", counter), true);
  assert.equal(meaningAnswerIsCorrect("3 long objects", counter), true);
  assert.equal(meaningAnswerIsCorrect("the second", day), true);
  assert.equal(meaningAnswerIsCorrect("2nd", day), true);
  assert.equal(meaningAnswerIsCorrect("twenty fourth", { meaning: "twenty-fourth" }), true);
  assert.equal(meaningAnswerIsCorrect("Tuesday", day), false);
});

test("reading damages the enemy and meaning defeats it", () => {
  let state = createDungeonState([words[0]], noShuffle);
  ({ state } = attackDungeon(state, "keizai"));
  assert.equal(state.phase, "meaning");
  assert.equal(state.enemyHp, 1);
  assert.equal(state.combo, 1);

  const result = attackDungeon(state, "economy");
  assert.equal(result.event.kind, "victory");
  assert.equal(result.state.status, "won");
  assert.equal(result.state.enemyHp, 0);
  assert.equal(result.state.highestCombo, 2);
});

test("a wrong answer costs HP, forces correction, and adds a weighted repeat", () => {
  let state = createDungeonState(words, noShuffle);
  const current = state.currentWord;
  ({ state } = attackDungeon(state, "wrong"));
  assert.equal(state.currentWord, current);
  assert.equal(state.phase, "reading");
  assert.equal(state.playerHp, 4);
  assert.equal(state.queue.at(-1), current);
  assert.equal(state.misses[current.word], 1);
});

test("hint costs HP without counting as a miss", () => {
  const state = createDungeonState(words, noShuffle);
  const result = useDungeonHint(state);
  assert.equal(result.state.playerHp, 4);
  assert.equal(result.state.hintRevealed, true);
  assert.equal(result.state.totalMisses, 0);
});

test("flee costs HP, counts as a miss, and loads another enemy", () => {
  const state = createDungeonState(words, noShuffle);
  const fled = state.currentWord;
  const result = fleeDungeon(state);
  assert.equal(result.state.playerHp, 4);
  assert.equal(result.state.totalMisses, 1);
  assert.notEqual(result.state.currentWord, fled);
  assert.equal(result.state.queue.at(-1), fled);
});

test("the player loses at zero HP", () => {
  let state = createDungeonState([words[0]], noShuffle);
  for (let index = 0; index < 5; index += 1) ({ state } = attackDungeon(state, "wrong"));
  assert.equal(state.playerHp, 0);
  assert.equal(state.status, "lost");
  assert.equal(attackDungeon(state, "keizai").event.kind, "ignored");
});
