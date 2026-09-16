import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FREQUENCY_REFERENCE_GROUPS } from "../frequency-reference-data.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const level3 = FREQUENCY_REFERENCE_GROUPS.find(({ group }) => group === "LEVEL 3");
if (!level3) throw new Error("Frequency Level 3 reference data is unavailable");

const sourceCards = level3.pages.flatMap(({ cards }) => cards);
const words = sourceCards.map(({ word }) => word);
const imports = sourceCards.map(({ word, readings, romaji, meaning, breakdown, memory }) => ({
  word,
  reading: readings.join("、"),
  ...(readings.length > 1 ? { kana: readings } : {}),
  romaji,
  meaning,
  meanings: [...new Set(meaning.split("; "))],
  breakdown,
  memory,
}));

if (
  sourceCards.length !== 500
  || new Set(words).size !== 500
  || words[0] !== "保障"
  || words.at(-1) !== "財"
) {
  throw new Error("Frequency Level 3 reference order or totals changed unexpectedly");
}

const output = `// Complete Real Kana Frequency Level 3 study data generated from the dormant reference dictionary.\n`
  + `// Definitions: JMdict. Character meanings: KANJIDIC2. Electronic Dictionary Research and Development Group, CC BY-SA 4.0.\n`
  + `export const LEVEL_3_WORDS = ${JSON.stringify(words, null, 2)};\n\n`
  + `export const LEVEL_3_IMPORTS = ${JSON.stringify(imports, null, 2)};\n`;

writeFileSync(join(projectRoot, "level3-data.js"), output);
console.log(`Generated ${imports.length} unique Frequency Level 3 study cards.`);
