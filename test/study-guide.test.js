import test from "node:test";
import assert from "node:assert/strict";

import { CARDS_PER_PAGE, createStudyGuideHtml } from "../src/study-guide.js";

const item = (index) => ({
  word: `語${index}`,
  reading: `ご${index}`,
  meaning: `word ${index}`,
  breakdown: [["語", "ご", "word"]],
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
