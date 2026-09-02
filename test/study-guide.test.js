import test from "node:test";
import assert from "node:assert/strict";
import { jsPDF } from "jspdf";

import { CARDS_PER_PAGE, createStudyGuideHtml, createStudyGuidePdfDocument } from "../src/study-guide.js";
import "../vendor/ink-run-japanese-font.js";

const fontBase64 = globalThis.INK_RUN_PDF_FONT_BASE64;

const item = (index) => ({
  word: `語${index}`,
  reading: `ご${index}`,
  meaning: `word ${index}`,
  breakdown: [["語", "ご", `character meaning ${index}`]],
});

test("study guide paginates cards and labels every printed page", () => {
  const items = Array.from({ length: CARDS_PER_PAGE + 1 }, (_, index) => item(index + 1));
  const html = createStudyGuideHtml({
    selectionLabel: "FREQUENCY · LEVEL 1 · 001—010",
    deckLabels: ["1—10"],
    items,
    sourceLabelFor: () => "LEVEL 1 · 001—010",
    generatedLabel: "Sep 2, 2026",
  });

  assert.equal((html.match(/class="guide-page"/g) ?? []).length, 2);
  assert.match(html, /001/);
  assert.match(html, /009/);
  assert.match(html, /1 \/ 2/);
  assert.match(html, /2 \/ 2/);
  assert.match(html, /LEVEL 1 · 001—010/);
  assert.match(html, /character meaning 1/);
});

test("study guide escapes card and heading content", () => {
  const html = createStudyGuideHtml({
    selectionLabel: "<Selected>",
    deckLabels: ["A & B"],
    items: [{ word: "<語>", reading: "ご", meaning: "one & two" }],
    generatedLabel: "Sep 2, 2026",
  });

  assert.match(html, /&lt;Selected&gt;/);
  assert.match(html, /A &amp; B/);
  assert.match(html, /&lt;語&gt;/);
  assert.match(html, /one &amp; two/);
  assert.doesNotMatch(html, /<Selected>/);
});

test("jsPDF study guide contains Japanese cards across numbered pages", () => {
  const items = Array.from({ length: CARDS_PER_PAGE + 1 }, (_, index) => item(index + 1));
  const doc = createStudyGuidePdfDocument({
    jsPDFClass: jsPDF,
    fontBase64,
    selectionLabel: "FREQUENCY · LEVEL 1 · 001—020",
    deckLabels: ["1—10", "11—20"],
    items,
    sourceLabelFor: () => "LEVEL 1 · 001—020",
    generatedLabel: "Sep 2, 2026",
  });
  const bytes = new Uint8Array(doc.output("arraybuffer"));
  const pdfText = new TextDecoder("latin1").decode(bytes);

  assert.equal(doc.getNumberOfPages(), 2);
  assert.equal(new TextDecoder().decode(bytes.slice(0, 5)), "%PDF-");
  assert.match(pdfText, /InkRunJapanese/);
  assert.match(pdfText, /\/Subtype \/Type0/);
  assert.match(pdfText, /\/ToUnicode/);
});
