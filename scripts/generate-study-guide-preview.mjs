import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { DECKS, KANJI_BY_WORD, sourceDeckLabel } from "../src/vocabulary.js";
import { createStudyGuideHtml } from "../src/study-guide.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const deckKey = process.argv[2] ?? "1-10";
const deck = DECKS[deckKey];
if (!deck?.words) throw new Error(`Choose a static deck with a word list. Unknown deck: ${deckKey}`);

const items = deck.words.map((word) => KANJI_BY_WORD.get(word)).filter(Boolean);
const html = createStudyGuideHtml({
  selectionLabel: deck.setLabel,
  deckLabels: [deck.label],
  items,
  sourceLabelFor: sourceDeckLabel,
  generatedLabel: "Sep 2, 2026",
});
const outputDirectory = resolve(projectRoot, "tmp/pdfs");
const outputPath = resolve(outputDirectory, `study-guide-${deckKey}.html`);
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputPath, html);
console.log(outputPath);
