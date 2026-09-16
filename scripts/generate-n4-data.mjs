import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JLPT_REFERENCE_LEVELS } from "../jlpt-reference-data.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const n4 = JLPT_REFERENCE_LEVELS.find(({ level }) => level === "N4");
if (!n4) throw new Error("N4 reference data is unavailable");

const sourceCards = n4.pages.flatMap(({ cards }) => cards);
const cardsByWord = new Map();
sourceCards.forEach((card) => {
  const variants = cardsByWord.get(card.word) ?? [];
  variants.push(card);
  cardsByWord.set(card.word, variants);
});

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function mergeBreakdowns(variants) {
  const breakdowns = variants.map(({ breakdown }) => breakdown ?? []);
  const characters = breakdowns[0]?.map(([character]) => character) ?? [];
  const aligned = breakdowns.every((breakdown) => (
    breakdown.length === characters.length
    && breakdown.every(([character], index) => character === characters[index])
  ));
  if (!aligned) {
    return [[
      variants[0].word,
      unique(variants.flatMap(({ readings }) => readings)).join("・"),
      "multiple readings; meaning depends on context",
    ]];
  }
  return characters.map((character, index) => [
    character,
    unique(breakdowns.map((breakdown) => breakdown[index][1])).join("・"),
    unique(breakdowns.map((breakdown) => breakdown[index][2])).join("; "),
  ]);
}

function mergeCards(word, variants) {
  const readings = unique(variants.flatMap(({ readings: values }) => values));
  const romaji = unique(variants.flatMap(({ romaji: values }) => values ?? []));
  const meanings = unique(variants.flatMap(({ meaning }) => meaning.split("; ")));
  const readingNotes = variants.map(({ readings: values, meaning }) => (
    `${values.join("・")} (${meaning.split("; ")[0]})`
  ));
  return {
    word,
    reading: readings.join("、"),
    ...(readings.length > 1 ? { kana: readings } : {}),
    romaji,
    meaning: meanings.join("; "),
    meanings,
    breakdown: variants.length === 1 ? variants[0].breakdown : mergeBreakdowns(variants),
    memory: variants.length === 1
      ? variants[0].memory
      : `${word} has context-dependent readings: ${readingNotes.join("; ")}.`,
  };
}

const words = [...cardsByWord.keys()];
const imports = [...cardsByWord].map(([word, variants]) => mergeCards(word, variants));
if (sourceCards.length !== 501 || words.length !== 499 || imports.length !== 499) {
  throw new Error(`Unexpected N4 totals: ${sourceCards.length} source cards, ${words.length} unique words`);
}

const output = `// Complete Real Kana JLPT N4 study data generated from the dormant reference dictionary.\n`
  + `// Definitions: JMdict. Character meanings: KANJIDIC2. Electronic Dictionary Research and Development Group, CC BY-SA 4.0.\n`
  + `export const N4_WORDS = ${JSON.stringify(words, null, 2)};\n\n`
  + `export const N4_IMPORTS = ${JSON.stringify(imports, null, 2)};\n`;

writeFileSync(join(projectRoot, "n4-data.js"), output);
console.log(`Generated ${imports.length} unique N4 study cards from ${sourceCards.length} source entries.`);
