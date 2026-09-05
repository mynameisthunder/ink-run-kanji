import { answerIsCorrect, romajiToHiragana } from "./kana.js";

export const MAX_PLAYER_HP = 5;
export const MAX_ENEMY_HP = 2;

const ARTICLES = /^(?:a|an|the)\s+/;
const LEADING_INFINITIVE = /^to\s+/;

function wordKey(item) {
  return item.studyKey ?? item.word;
}

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function normalizeMeaningAnswer(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\p{Letter}\p{Number}'\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(ARTICLES, "")
    .replace(LEADING_INFINITIVE, "");
}

export function acceptedMeanings(item) {
  return String(item.meaning ?? "")
    .split(";")
    .map((meaning) => meaning.trim())
    .filter(Boolean);
}

function meaningVariants(meaning) {
  return new Set([
    normalizeMeaningAnswer(meaning),
    normalizeMeaningAnswer(meaning.replace(/\([^)]*\)/g, "")),
  ].filter(Boolean));
}

export function meaningAnswerIsCorrect(value, item) {
  const answer = normalizeMeaningAnswer(value);
  return acceptedMeanings(item).some((meaning) => meaningVariants(meaning).has(answer));
}

function uniqueWords(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = wordKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function loadNextEnemy(state) {
  const [currentWord = null, ...queue] = state.queue;
  return {
    ...state,
    currentWord,
    queue,
    enemyHp: currentWord ? MAX_ENEMY_HP : 0,
    phase: "reading",
    hintRevealed: false,
    floor: state.floor + (currentWord ? 1 : 0),
  };
}

function loseHp(state) {
  const playerHp = Math.max(0, state.playerHp - 1);
  return { ...state, playerHp, combo: 0, status: playerHp === 0 ? "lost" : state.status };
}

function recordMiss(state) {
  const key = wordKey(state.currentWord);
  return {
    ...state,
    misses: { ...state.misses, [key]: (state.misses[key] ?? 0) + 1 },
    queue: [...state.queue, state.currentWord],
    totalMisses: state.totalMisses + 1,
  };
}

function increaseCombo(state) {
  const combo = state.combo + 1;
  return { ...state, combo, highestCombo: Math.max(state.highestCombo, combo) };
}

export function createDungeonState(items, random = Math.random) {
  const words = uniqueWords(items);
  return loadNextEnemy({
    words,
    queue: shuffle(words, random),
    currentWord: null,
    playerHp: MAX_PLAYER_HP,
    maxPlayerHp: MAX_PLAYER_HP,
    enemyHp: 0,
    phase: "reading",
    combo: 0,
    highestCombo: 0,
    floor: 0,
    defeated: [],
    defeatedKeys: new Set(),
    misses: {},
    totalMisses: 0,
    hintRevealed: false,
    status: words.length ? "playing" : "empty",
  });
}

export function attackDungeon(state, answer) {
  if (state.status !== "playing" || !state.currentWord) return { state, event: { kind: "ignored" } };
  const correct = state.phase === "reading"
    ? answerIsCorrect(romajiToHiragana(answer, true), state.currentWord)
    : meaningAnswerIsCorrect(answer, state.currentWord);

  if (!correct) {
    const next = loseHp(recordMiss(state));
    return { state: next, event: { kind: "miss", phase: state.phase, lost: next.status === "lost" } };
  }

  const comboState = increaseCombo(state);
  if (state.phase === "reading") {
    return {
      state: { ...comboState, phase: "meaning", enemyHp: 1 },
      event: { kind: "reading-hit" },
    };
  }

  const key = wordKey(state.currentWord);
  const firstDefeat = !state.defeatedKeys.has(key);
  const defeatedKeys = new Set(state.defeatedKeys);
  defeatedKeys.add(key);
  const defeated = firstDefeat ? [...state.defeated, state.currentWord] : state.defeated;
  const defeatedState = { ...comboState, enemyHp: 0, defeatedKeys, defeated };
  if (defeatedKeys.size === state.words.length) {
    return { state: { ...defeatedState, status: "won" }, event: { kind: "victory", firstDefeat } };
  }
  return { state: loadNextEnemy(defeatedState), event: { kind: "enemy-defeated", firstDefeat } };
}

export function useDungeonHint(state) {
  if (state.status !== "playing" || !state.currentWord || state.hintRevealed) {
    return { state, event: { kind: "ignored" } };
  }
  const next = loseHp({ ...state, hintRevealed: true });
  return { state: next, event: { kind: "hint", lost: next.status === "lost" } };
}

export function fleeDungeon(state) {
  if (state.status !== "playing" || !state.currentWord) return { state, event: { kind: "ignored" } };
  const damaged = loseHp(recordMiss(state));
  if (damaged.status === "lost") return { state: damaged, event: { kind: "fled", lost: true } };
  return { state: loadNextEnemy(damaged), event: { kind: "fled", lost: false } };
}

export function restartDungeon(state, random = Math.random) {
  return createDungeonState(state.words, random);
}

export function dungeonWordKey(item) {
  return wordKey(item);
}
