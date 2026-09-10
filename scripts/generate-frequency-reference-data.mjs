import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { enrichReferenceGroups, REFERENCE_DICTIONARY_ATTRIBUTION } from "./reference-enrichment.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REAL_KANA_URL = "https://realkana.com/kanji/frequency/words";
const GROUP_CONFIGS = [
  "LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4",
  "EXTRA 1", "EXTRA 2", "EXTRA 3", "EXTRA 4", "EXTRA 5", "EXTRA 6",
].map((group, index) => ({ group, firstTable: index * 4, pageCount: 4 }));

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
const expectedTableCount = GROUP_CONFIGS.reduce((total, group) => total + group.pageCount, 0);
if (data.cardColumnTables.length !== expectedTableCount) {
  throw new Error(`Expected ${expectedTableCount} frequency pages, received ${data.cardColumnTables.length}`);
}

const groups = GROUP_CONFIGS.map(({ group, firstTable, pageCount }) => {
  const pages = Array.from({ length: pageCount }, (_, pageIndex) => {
    const tableIndex = firstTable + pageIndex;
    const cards = cardsForTable(data.cardColumnTables[tableIndex]);
    return { page: pageIndex + 1, tableIndex, cards };
  });
  const cards = pages.flatMap((page) => page.cards);
  return {
    group,
    sourceEntryCount: cards.length,
    uniqueWordCount: new Set(cards.map((card) => card.word)).size,
    pages,
  };
});

const enrichedGroups = await enrichReferenceGroups(groups);
const output = `// Complete Real Kana frequency reference data. This module is intentionally not loaded by the app or registered as decks.\n`
  + `// Source: ${REAL_KANA_URL}\n`
  + `// ${REFERENCE_DICTIONARY_ATTRIBUTION}\n`
  + `export const FREQUENCY_REFERENCE_GROUPS = ${JSON.stringify(enrichedGroups, null, 2)};\n`;

writeFileSync(join(projectRoot, "frequency-reference-data.js"), output);
groups.forEach(({ group, sourceEntryCount, uniqueWordCount }) => {
  console.log(`${group}: ${sourceEntryCount} source entries · ${uniqueWordCount} unique words`);
});
