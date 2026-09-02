import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";

import { DECKS, KANJI_BY_WORD, sourceDeckLabel } from "../src/vocabulary.js";
import { createStudyGuidePdfDocument } from "../src/study-guide.js";
import "../vendor/ink-run-japanese-font.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const deckKey = process.argv[2] ?? "1-10";
const deck = DECKS[deckKey];
if (!deck?.words) throw new Error(`Choose a static deck with a word list. Unknown deck: ${deckKey}`);

const items = deck.words.map((word) => KANJI_BY_WORD.get(word)).filter(Boolean);
const doc = createStudyGuidePdfDocument({
  jsPDFClass: jsPDF,
  fontBase64: globalThis.INK_RUN_PDF_FONT_BASE64,
  selectionLabel: deck.setLabel,
  deckLabels: [deck.label],
  items,
  sourceLabelFor: sourceDeckLabel,
  generatedLabel: "Sep 2, 2026",
});
const outputDirectory = resolve(projectRoot, "output/pdf");
const filename = deckKey === "1-10" ? "ink-run-study-guide-sample.pdf" : `ink-run-study-guide-${deckKey}.pdf`;
const outputPath = resolve(outputDirectory, filename);
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
console.log(outputPath);
