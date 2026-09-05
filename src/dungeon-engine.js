import { answerIsCorrect, romajiToHiragana } from "./kana.js";

export const MAX_PLAYER_HP = 5;
export const MAX_ENEMY_HP = 2;

const ARTICLES = /^(?:(?:a|an|the|one's)\s+)+/;
const LEADING_INFINITIVE = /^to\s+/;
const PARENTHETICAL = /\(([^()]*)\)/g;
const PARENTHETICAL_ALIAS = /^(?:(?:i\.e|esp|especially|lit|literally)\.?\s+)(.+)$/i;
const IRREGULAR_NOUNS = new Map([
  ["children", "child"], ["feet", "foot"], ["geese", "goose"], ["men", "man"],
  ["mice", "mouse"], ["people", "person"], ["teeth", "tooth"], ["women", "woman"],
]);
const UNCOUNTABLE_OR_SINGULAR_S = new Set([
  "analysis", "basis", "business", "clothes", "economics", "glass", "headquarters",
  "means", "news", "series", "species", "status",
]);

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
    .replace(/[^\p{Letter}\p{Number}'\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(ARTICLES, "")
    .replace(LEADING_INFINITIVE, "");
}

export function acceptedMeanings(item) {
  const aliases = Array.isArray(item.meanings) ? item.meanings : [item.meanings];
  return [item.meaning, ...aliases]
    .flatMap((meaning) => String(meaning ?? "").split(";"))
    .map((meaning) => meaning.trim())
    .filter((meaning, index, meanings) => meaning && meanings.indexOf(meaning) === index);
}

function singularizeWord(word) {
  if (IRREGULAR_NOUNS.has(word)) return IRREGULAR_NOUNS.get(word);
  if (UNCOUNTABLE_OR_SINGULAR_S.has(word) || word.length < 4) return word;
  if (/(?:ches|shes|sses|xes|zes)$/.test(word)) return word.slice(0, -2);
  if (/[^aeiou]ies$/.test(word)) return `${word.slice(0, -3)}y`;
  if (/s$/.test(word) && !/(?:ss|us|is|ics|ness|ous|as)$/.test(word)) return word.slice(0, -1);
  return word;
}

function canonicalMeaning(value) {
  return normalizeMeaningAnswer(value)
    .split(" ")
    .map(singularizeWord)
    .join(" ");
}

function addAlternativeSegments(variants, value) {
  const normalized = normalizeMeaningAnswer(value);
  if (!normalized) return;
  variants.add(normalized);

  const alternatives = normalized.split(/\s+or\s+/);
  if (alternatives.length > 1 && alternatives.every((part) => part.split(" ").length <= 5)) {
    alternatives.forEach((part) => variants.add(part));
  }
}

function meaningVariants(meaning) {
  const variants = new Set();
  addAlternativeSegments(variants, meaning);
  addAlternativeSegments(variants, meaning.replace(PARENTHETICAL, ""));

  for (const match of meaning.matchAll(PARENTHETICAL)) {
    const alias = match[1].match(PARENTHETICAL_ALIAS)?.[1];
    if (!alias) continue;
    alias
      .split(/,|\s+or\s+/)
      .forEach((part) => addAlternativeSegments(variants, part));
  }

  [...variants].forEach((variant) => variants.add(canonicalMeaning(variant)));
  return variants;
}

export function meaningAnswerIsCorrect(value, item) {
  const answer = normalizeMeaningAnswer(value);
  if (!answer) return false;
  const answerForms = new Set([answer, canonicalMeaning(answer)]);
  return acceptedMeanings(item).some((meaning) => {
    const variants = meaningVariants(meaning);
    return [...answerForms].some((form) => variants.has(form));
  });
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
