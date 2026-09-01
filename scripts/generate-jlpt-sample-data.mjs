import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REAL_KANA_URL = "https://realkana.com/kanji/jlpt/words";
const configs = [
  { key: "jlpt-n1-1-10", level: "N1", tableIndex: 26 },
  { key: "jlpt-n2-1-10", level: "N2", tableIndex: 20 },
  { key: "jlpt-n3-1-10", level: "N3", tableIndex: 7 },
];

const kanaMap = {
  あ: "a", い: "i", う: "u", え: "e", お: "o", か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go", さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo", た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do", な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po", ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo", ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro", わ: "wa", を: "o", ん: "n",
};
const digraphs = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo", しゃ: "sha", しゅ: "shu", しょ: "sho", ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo", みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo", じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
};

function romanize(reading) {
  let result = "";
  let doubled = false;
  for (let index = 0; index < reading.length; index += 1) {
    if (reading[index] === "っ") { doubled = true; continue; }
    const pair = reading.slice(index, index + 2);
    let syllable = digraphs[pair];
    if (syllable) index += 1;
    else syllable = kanaMap[reading[index]] ?? reading[index];
    if (doubled && syllable) { syllable = `${syllable[0]}${syllable}`; doubled = false; }
    result += syllable;
  }
  return result;
}

async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "ink-run-kanji-data-generator/1.0" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 400));
    }
  }
  throw lastError;
}

async function loadRealKanaData() {
  const response = await fetch(REAL_KANA_URL, { headers: { "User-Agent": "ink-run-kanji-data-generator/1.0" } });
  if (!response.ok) throw new Error(`Real Kana returned ${response.status}`);
  const html = await response.text();
  const marker = "window.__REAL_DATA_SEED__ = ";
  const start = html.indexOf(marker);
  const end = html.indexOf(";</script>", start);
  if (start < 0 || end < 0) throw new Error("Could not locate Real Kana's embedded data seed");
  return JSON.parse(html.slice(start + marker.length, end)).data;
}

function firstTenCards(data, tableIndex) {
  return data.cardColumnTables[tableIndex][0].map((card) => ({
    word: card.question,
    readings: card.answers,
    annotations: card.segments?.[0]?.annotations?.[0] ?? [],
  }));
}

async function loadMeaning(word, reading) {
  const payload = await fetchJson(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`);
  const exact = payload.data.find((entry) => entry.japanese.some((form) => form.word === word && form.reading === reading))
    ?? payload.data.find((entry) => entry.japanese.some((form) => form.word === word))
    ?? payload.data[0];
  return [...new Set(exact?.senses?.flatMap((sense) => sense.english_definitions ?? []) ?? [])].slice(0, 6).join("; ");
}

function buildBreakdown(card, meaning, kanjiMeanings) {
  const characters = [...card.word];
  const readingCharacters = [...card.readings[0]];
  const lengths = card.annotations;
  const irregular = lengths.length !== characters.length
    || lengths.reduce((sum, length) => sum + length, 0) !== readingCharacters.length
    || characters.some((character, index) => /\p{Script=Han}/u.test(character) && lengths[index] === 0);
  if (irregular) return [[card.word, card.readings[0], meaning]];

  let offset = 0;
  const parts = characters.map((character, index) => {
    const partReading = readingCharacters.slice(offset, offset + lengths[index]).join("");
    offset += lengths[index];
    const isKanji = /\p{Script=Han}/u.test(character);
    return [character, partReading, isKanji ? kanjiMeanings.get(character) || "kanji" : "kana", isKanji];
  });
  return parts.reduce((grouped, [character, partReading, definition, isKanji]) => {
    const previous = grouped.at(-1);
    if (!isKanji && previous?.[3] === false) {
      previous[0] += character;
      previous[1] += partReading;
    } else grouped.push([character, partReading, definition, isKanji]);
    return grouped;
  }, []).map(([character, partReading, definition]) => [character, partReading, definition]);
}

const data = await loadRealKanaData();
const groups = configs.map((config) => {
  const cards = firstTenCards(data, config.tableIndex);
  if (cards.length !== 10) throw new Error(`${config.level} returned ${cards.length} starter words`);
  return { ...config, cards };
});
const allCards = groups.flatMap((group) => group.cards);
const uniqueKanji = [...new Set(allCards.flatMap((card) => [...card.word].filter((character) => /\p{Script=Han}/u.test(character))))];
const kanjiMeanings = new Map();
for (const character of uniqueKanji) {
  try {
    const payload = await fetchJson(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(character)}`);
    kanjiMeanings.set(character, (payload.meanings ?? []).slice(0, 4).join("; "));
  } catch {
    kanjiMeanings.set(character, "kanji");
  }
}

const imports = [];
const missingMeanings = [];
for (let index = 0; index < allCards.length; index += 1) {
  const card = allCards[index];
  let meaning = "";
  try { meaning = await loadMeaning(card.word, card.readings[0]); } catch { /* Reported below. */ }
  if (!meaning) {
    meaning = `Japanese word read ${card.readings[0]}`;
    missingMeanings.push(card.word);
  }
  const breakdown = buildBreakdown(card, meaning, kanjiMeanings);
  imports.push({
    word: card.word,
    reading: card.readings.join("、"),
    ...(card.readings.length > 1 ? { kana: card.readings } : {}),
    romaji: card.readings.map(romanize),
    meaning,
    breakdown,
    memory: breakdown.length === 1 && breakdown[0][0] === card.word
      ? `Treat ${card.word} as one reading unit: ${card.readings[0]}.`
      : `Read ${breakdown.map(([character, part]) => `${character} as ${part}`).join(" + ")}: ${card.readings[0]}.`,
  });
  console.log(`Loaded ${index + 1}/${allCards.length}: ${card.word}`);
}

const generatedGroups = groups.map(({ key, level, cards }) => ({
  key,
  level,
  words: cards.map((card) => card.word),
  audioReadings: cards.map((card) => card.readings[0]),
}));
const output = `// Generated from the first ten words on Real Kana's JLPT N1, N2, and N3 pages.\n`
  + `// Readings: Real Kana. Meanings: Jisho/JMdict. Character meanings: KanjiAPI/KANJIDIC.\n`
  + `export const JLPT_SAMPLE_GROUPS = ${JSON.stringify(generatedGroups, null, 2)};\n\n`
  + `export const JLPT_SAMPLE_IMPORTS = ${JSON.stringify(imports, null, 2)};\n`;
writeFileSync(join(projectRoot, "jlpt-sample-data.js"), output);
console.log(`Generated ${imports.length} JLPT starter cards.`);
if (missingMeanings.length) console.log(`Missing dictionary meanings: ${missingMeanings.join(", ")}`);
