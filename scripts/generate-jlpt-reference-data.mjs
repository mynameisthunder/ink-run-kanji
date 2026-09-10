import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REAL_KANA_URL = "https://realkana.com/kanji/jlpt/words";
const LEVEL_CONFIGS = [
  { level: "N5", firstTable: 0, pageCount: 3 },
  { level: "N4", firstTable: 3, pageCount: 4 },
  { level: "N3", firstTable: 7, pageCount: 13 },
  { level: "N2", firstTable: 20, pageCount: 6 },
  { level: "N1", firstTable: 26, pageCount: 12 },
];

async function loadRealKanaData() {
  const response = await fetch(REAL_KANA_URL, {
    headers: { "User-Agent": "ink-run-kanji-data-generator/1.0" },
  });
  if (!response.ok) throw new Error(`Real Kana returned ${response.status}`);

  const html = await response.text();
  const marker = "window.__REAL_DATA_SEED__ = ";
  const start = html.indexOf(marker);
  const end = html.indexOf(";</script>", start);
  if (start < 0 || end < 0) throw new Error("Could not locate Real Kana's embedded data seed");
  return JSON.parse(html.slice(start + marker.length, end)).data;
}

function cardsForTable(table) {
  return table.flat().map((card) => ({
    word: card.question,
    readings: card.answers,
    annotations: card.segments?.[0]?.annotations?.[0] ?? [],
  }));
}

const data = await loadRealKanaData();
const expectedTableCount = LEVEL_CONFIGS.reduce((total, level) => total + level.pageCount, 0);
if (data.cardColumnTables.length !== expectedTableCount) {
  throw new Error(`Expected ${expectedTableCount} JLPT pages, received ${data.cardColumnTables.length}`);
}

const levels = LEVEL_CONFIGS.map(({ level, firstTable, pageCount }) => {
  const pages = Array.from({ length: pageCount }, (_, pageIndex) => {
    const tableIndex = firstTable + pageIndex;
    const cards = cardsForTable(data.cardColumnTables[tableIndex]);
    return { page: pageIndex + 1, tableIndex, cards };
  });
  const cards = pages.flatMap((page) => page.cards);
  return {
    level,
    sourceEntryCount: cards.length,
    uniqueWordCount: new Set(cards.map((card) => card.word)).size,
    pages,
  };
});

const output = `// Complete Real Kana JLPT reference data. This module is intentionally not loaded by the app or registered as decks.\n`
  + `// Source: ${REAL_KANA_URL}\n`
  + `export const JLPT_REFERENCE_LEVELS = ${JSON.stringify(levels, null, 2)};\n`;

writeFileSync(join(projectRoot, "jlpt-reference-data.js"), output);
levels.forEach(({ level, sourceEntryCount, uniqueWordCount }) => {
  console.log(`${level}: ${sourceEntryCount} source entries · ${uniqueWordCount} unique words`);
});
