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
const TOO_BROAD_FOR_PARTIAL_MATCH = new Set([
  "act", "action", "bad", "come", "do", "get", "go", "good", "kind", "make",
  "counter", "part", "person", "place", "state", "thing", "type", "use", "way", "work",
]);
const MEANING_EQUIVALENTS = [
  ["aid", "assist", "help"],
  ["automobile", "car"],
  ["begin", "start"],
  ["big", "large"],
  ["buy", "purchase"],
  ["child", "kid"],
  ["choose", "select"],
  ["correct", "right"],
  ["create", "make", "produce"],
  ["difficult", "hard"],
  ["easy", "simple"],
  ["end", "finish"],
  ["fast", "quick", "rapid"],
  ["fix", "repair"],
  ["ill", "sick"],
  ["job", "occupation", "employment"],
  ["labor", "labour", "work"],
  ["physician", "doctor"],
  ["pretty", "beautiful"],
  ["reside", "live"],
  ["shop", "store"],
  ["show", "display"],
  ["tell", "inform"],
  ["use", "utilize", "utilise"],
  ["wrong", "incorrect"],
];
const CANONICAL_EQUIVALENT = new Map(MEANING_EQUIVALENTS.flatMap((group) => group.map((word) => [word, group[0]])));
const SPELLING_EQUIVALENTS = new Map([
  ["behaviour", "behavior"], ["centre", "center"], ["colour", "color"],
  ["favourite", "favorite"], ["honour", "honor"], ["organisation", "organization"],
  ["recognise", "recognize"], ["theatre", "theater"],
]);
const JAPANESE_DIGIT_VALUES = new Map([
  ["〇", 0], ["零", 0], ["一", 1], ["二", 2], ["三", 3], ["四", 4],
  ["五", 5], ["六", 6], ["七", 7], ["八", 8], ["九", 9],
]);
const JAPANESE_SMALL_UNITS = new Map([["十", 10], ["百", 100], ["千", 1000]]);
const JAPANESE_LARGE_UNITS = new Map([["万", 10_000], ["億", 100_000_000], ["兆", 1_000_000_000_000]]);
const ENGLISH_NUMBER_VALUES = new Map([
  ["zero", 0], ["one", 1], ["two", 2], ["three", 3], ["four", 4], ["five", 5],
  ["six", 6], ["seven", 7], ["eight", 8], ["nine", 9], ["ten", 10],
  ["eleven", 11], ["twelve", 12], ["thirteen", 13], ["fourteen", 14],
  ["fifteen", 15], ["sixteen", 16], ["seventeen", 17], ["eighteen", 18], ["nineteen", 19],
  ["twenty", 20], ["thirty", 30], ["forty", 40], ["fifty", 50],
  ["sixty", 60], ["seventy", 70], ["eighty", 80], ["ninety", 90],
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
    .map((word) => SPELLING_EQUIVALENTS.get(word) ?? word)
    .map(singularizeWord)
    .map((word) => CANONICAL_EQUIVALENT.get(word) ?? word)
    .join(" ");
}

function japaneseNumeralValue(word) {
  if (!word || !/^[〇零一二三四五六七八九十百千万億兆]+$/.test(word)) return null;
  let total = 0;
  let section = 0;
  let digit = 0;

  for (const character of word) {
    if (JAPANESE_DIGIT_VALUES.has(character)) {
      digit = JAPANESE_DIGIT_VALUES.get(character);
    } else if (JAPANESE_SMALL_UNITS.has(character)) {
      section += (digit || 1) * JAPANESE_SMALL_UNITS.get(character);
      digit = 0;
    } else {
      const sectionValue = section + digit || 1;
      total += sectionValue * JAPANESE_LARGE_UNITS.get(character);
      section = 0;
      digit = 0;
    }
  }

  return total + section + digit;
}

function englishNumberValue(value) {
  const normalized = normalizeMeaningAnswer(value).replace(/^number\s+/, "");
  if (/^\d+$/.test(normalized)) return Number(normalized);
  const words = normalized.split(" ").filter((word) => word !== "and");
  if (!words.length) return null;

  let total = 0;
  let section = 0;
  for (const word of words) {
    if (ENGLISH_NUMBER_VALUES.has(word)) {
      section += ENGLISH_NUMBER_VALUES.get(word);
    } else if (word === "hundred") {
      section = (section || 1) * 100;
    } else if (word === "thousand" || word === "million" || word === "billion" || word === "trillion") {
      const unit = { thousand: 1_000, million: 1_000_000, billion: 1_000_000_000, trillion: 1_000_000_000_000 }[word];
      total += (section || 1) * unit;
      section = 0;
    } else {
      return null;
    }
  }
  return total + section;
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

function isQualifiedDefinitionMatch(answer, variant) {
  const answerWords = answer.split(" ");
  if (answerWords.length === 1) {
    const [word] = answerWords;
    if (word.length < 5 || TOO_BROAD_FOR_PARTIAL_MATCH.has(word)) return false;
  }
  if (!variant.startsWith(`${answer} `)) return false;
  const qualifier = variant.slice(answer.length + 1);
  return /^(?:of|for|in|at|from|work|labor)\b/.test(qualifier);
}

export function meaningAnswerIsCorrect(value, item) {
  const answer = normalizeMeaningAnswer(value);
  if (!answer) return false;
  const numeralValue = japaneseNumeralValue(item?.word);
  if (numeralValue !== null && englishNumberValue(answer) === numeralValue) return true;
  const answerForms = new Set([answer, canonicalMeaning(answer)]);
  return acceptedMeanings(item).some((meaning) => {
    const variants = meaningVariants(meaning);
    const partialVariants = meaningVariants(meaning.replace(PARENTHETICAL, ""));
    return [...answerForms].some((form) => variants.has(form)
      || [...partialVariants].some((variant) => isQualifiedDefinitionMatch(canonicalMeaning(form), canonicalMeaning(variant))));
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
