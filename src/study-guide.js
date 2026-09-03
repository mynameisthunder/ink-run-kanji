const CARDS_PER_PAGE = 6;
const PDF_FONT_NAME = "InkRunJapanese";
const PDF_FONT_FILE = "InkRunJapanese.ttf";
const COLORS = {
  ink: [23, 23, 20],
  paper: [247, 242, 232],
  blue: [36, 73, 255],
  red: [242, 68, 55],
  line: [201, 193, 178],
  muted: [111, 106, 98],
};
let japaneseFontPromise;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printableTitle(selectionLabel) {
  return `Ink Run - ${selectionLabel.replaceAll("·", "-")} - Study Guide`;
}

function condensedDeckLabels(deckLabels) {
  return deckLabels.length > 4
    ? [...deckLabels.slice(0, 3), `+ ${deckLabels.length - 3} MORE`]
    : deckLabels;
}

function truncateToWidth(doc, value, width) {
  const text = String(value ?? "");
  if (doc.getTextWidth(text) <= width) return text;
  let shortened = text;
  while (shortened && doc.getTextWidth(`${shortened}…`) > width) shortened = shortened.slice(0, -1);
  return `${shortened}…`;
}

function limitedLines(doc, value, width, maximum) {
  const lines = doc.splitTextToSize(String(value ?? ""), width);
  if (lines.length <= maximum) return lines;
  const visible = lines.slice(0, maximum);
  visible[maximum - 1] = truncateToWidth(doc, `${visible[maximum - 1]}…`, width);
  return visible;
}

function fitFontSize(doc, value, width, preferred, minimum) {
  let size = preferred;
  doc.setFontSize(size);
  while (size > minimum && doc.getTextWidth(value) > width) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  return size;
}

function formatBreakdownPart([character, reading, meaning]) {
  return `${character} (${reading})${meaning ? `: ${meaning}` : ""}`;
}

function lookupUrls(word) {
  const encodedWord = encodeURIComponent(word);
  return {
    jisho: `https://jisho.org/search/${encodedWord}`,
    kana: `https://www.romajidesu.com/kanji/${encodedWord}`,
  };
}

function drawPdfLookupIcons(doc, word, x, y, width) {
  const urls = lookupUrls(word);
  const size = 6.5;
  const gap = 1.5;
  const firstX = x + width - size * 2 - gap - 3;
  [
    { label: "辞", url: urls.jisho, color: COLORS.blue },
    { label: "あ", url: urls.kana, color: COLORS.red },
  ].forEach(({ label, url, color }, index) => {
    const iconX = firstX + index * (size + gap);
    doc.setFillColor(250, 247, 240);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.35);
    doc.roundedRect(iconX, y + 3, size, size, 1, 1, "FD");
    doc.setTextColor(...color);
    doc.setFontSize(6.2);
    doc.text(label, iconX + size / 2, y + 7.7, { align: "center" });
    doc.link(iconX, y + 3, size, size, { url });
  });
}

function drawPdfHeader(doc, { selectionLabel, wordCount, generatedLabel, pageNumber, totalPages }) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setTextColor(...COLORS.red);
  doc.setFontSize(7.5);
  doc.text("INK RUN / STUDY GUIDE", 12, 16);

  doc.setTextColor(...COLORS.ink);
  fitFontSize(doc, selectionLabel, 151, 17, 10);
  doc.text(selectionLabel, 12, 27);

  doc.setTextColor(...COLORS.blue);
  doc.setFontSize(8.5);
  doc.text(`${wordCount} ${wordCount === 1 ? "WORD" : "WORDS"}`, pageWidth - 12, 15, { align: "right" });
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(6.5);
  doc.text(generatedLabel, pageWidth - 12, 22, { align: "right" });

  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(1.2);
  doc.line(12, 34, pageWidth - 12, 34);

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(6.2);
  doc.text("墨  INK RUN", 12, 274);
  doc.text(`${pageNumber} / ${totalPages}`, pageWidth - 12, 274, { align: "right" });
}

function drawPdfSelection(doc, deckLabels) {
  const labels = condensedDeckLabels(deckLabels).join(" + ");
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.3);
  doc.rect(12, 39, 191.9, 16);
  doc.setTextColor(...COLORS.red);
  doc.setFontSize(6.2);
  doc.text("SELECTED DECKS", 16, 45);
  doc.setTextColor(...COLORS.ink);
  doc.setFontSize(7);
  doc.text(truncateToWidth(doc, labels, 147), 54, 45);
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(6.2);
  doc.text("Cover the blue reading, recall it aloud, then check the meaning and breakdown.", 16, 51);
}

function drawPdfCard(doc, item, index, sourceLabel, x, y, width, height) {
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.25);
  doc.rect(x, y, width, height, "FD");
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.9);
  doc.line(x, y, x + width, y);

  doc.setTextColor(...COLORS.red);
  doc.setFontSize(5.8);
  doc.text(String(index + 1).padStart(3, "0"), x + 3, y + 8);

  doc.setTextColor(...COLORS.ink);
  fitFontSize(doc, item.word, width - 35, 18, 10);
  doc.text(item.word, x + 12, y + 9);
  drawPdfLookupIcons(doc, item.word, x, y, width);

  const reading = (item.kana ?? [item.reading]).join(" / ");
  doc.setTextColor(...COLORS.blue);
  doc.setFontSize(9.5);
  doc.text(truncateToWidth(doc, reading, width - 17), x + 12, y + 16);

  doc.setTextColor(...COLORS.ink);
  doc.setFontSize(6.7);
  const meaningLines = limitedLines(doc, item.meaning, width - 17, 4);
  doc.text(meaningLines, x + 12, y + 22, { lineHeightFactor: 1.25 });

  const breakdown = item.breakdown?.map(formatBreakdownPart).join("  /  ") ?? "";
  if (breakdown) {
    const breakdownLabelY = y + 24 + meaningLines.length * 2.6;
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.25);
    doc.line(x + 12, breakdownLabelY - 2, x + width - 4, breakdownLabelY - 2);
    doc.setTextColor(...COLORS.red);
    doc.setFontSize(4.8);
    doc.text("CHARACTER BREAKDOWN", x + 12, breakdownLabelY);

    doc.setTextColor(...COLORS.ink);
    doc.setFontSize(8.2);
    const breakdownY = breakdownLabelY + 3.5;
    const lineHeight = 3.5;
    const breakdownBottom = y + height - 6;
    const maximumLines = Math.max(1, Math.floor((breakdownBottom - breakdownY) / lineHeight) + 1);
    doc.text(limitedLines(doc, breakdown, width - 17, maximumLines), x + 12, breakdownY, { lineHeightFactor: 1.15 });
  }

  if (sourceLabel) {
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(4.7);
    doc.text(truncateToWidth(doc, sourceLabel, width - 6), x + 3, y + height - 2.5);
  }
}

export function createStudyGuidePdfDocument({
  jsPDFClass,
  fontBase64,
  selectionLabel,
  deckLabels,
  items,
  sourceLabelFor = () => "",
  generatedLabel = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date()),
}) {
  if (!jsPDFClass) throw new Error("jsPDF is unavailable");
  if (!fontBase64) throw new Error("The Japanese PDF font is unavailable");
  const doc = new jsPDFClass({ orientation: "portrait", unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  doc.addFileToVFS(PDF_FONT_FILE, fontBase64);
  doc.addFont(PDF_FONT_FILE, PDF_FONT_NAME, "normal");
  doc.setFont(PDF_FONT_NAME, "normal");
  doc.setProperties({
    title: printableTitle(selectionLabel),
    subject: `${items.length}-word Japanese study guide`,
    author: "Ink Run",
    creator: "Ink Run with jsPDF",
  });

  const totalPages = Math.max(1, Math.ceil(items.length / CARDS_PER_PAGE));
  const pageWidth = doc.internal.pageSize.getWidth();
  const gapX = 4;
  const gapY = 3;
  const rowsPerPage = Math.ceil(CARDS_PER_PAGE / 2);
  const cardWidth = (pageWidth - 24 - gapX) / 2;
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    if (pageIndex > 0) doc.addPage("letter", "portrait");
    doc.setFillColor(...COLORS.paper);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");
    drawPdfHeader(doc, {
      selectionLabel,
      wordCount: items.length,
      generatedLabel,
      pageNumber: pageIndex + 1,
      totalPages,
    });
    if (pageIndex === 0) drawPdfSelection(doc, deckLabels);

    const startY = pageIndex === 0 ? 60 : 40;
    const endY = 267;
    const cardHeight = (endY - startY - gapY * (rowsPerPage - 1)) / rowsPerPage;
    const pageItems = items.slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE);
    pageItems.forEach((item, itemIndex) => {
      const column = itemIndex % 2;
      const row = Math.floor(itemIndex / 2);
      const x = 12 + column * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY);
      drawPdfCard(doc, item, pageIndex * CARDS_PER_PAGE + itemIndex, sourceLabelFor(item), x, y, cardWidth, cardHeight);
    });
  }
  return doc;
}

async function loadJapaneseFontBase64() {
  if (globalThis.INK_RUN_PDF_FONT_BASE64) return globalThis.INK_RUN_PDF_FONT_BASE64;
  japaneseFontPromise ??= fetch(new URL("../assets/fonts/InkRunJapanese.ttf?v=1", import.meta.url)).then(async (response) => {
    if (!response.ok) throw new Error(`Japanese font failed to load (${response.status})`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return window.btoa(binary);
  });
  return japaneseFontPromise;
}

function filenameForStudyGuide(selectionLabel) {
  const slug = selectionLabel.toLowerCase()
    .replaceAll("·", "-")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  return `ink-run-${slug || "study-guide"}.pdf`;
}

export async function downloadStudyGuidePdf(options) {
  const fontBase64 = await loadJapaneseFontBase64();
  const doc = createStudyGuidePdfDocument({
    ...options,
    jsPDFClass: window.jspdf?.jsPDF,
    fontBase64,
  });
  doc.save(filenameForStudyGuide(options.selectionLabel));
}

function renderBreakdown(item) {
  if (!item.breakdown?.length) return "";
  return `<div class="breakdown">
    <strong class="breakdown-label">CHARACTER BREAKDOWN</strong>
    <div class="breakdown-parts">${item.breakdown.map(([character, reading, meaning]) => (
      `<span><b>${escapeHtml(character)}</b> <em>${escapeHtml(reading)}</em>${meaning ? ` — ${escapeHtml(meaning)}` : ""}</span>`
    )).join("")}</div>
  </div>`;
}

function renderCard(item, index, sourceLabel) {
  const readings = item.kana ?? [item.reading];
  const urls = lookupUrls(item.word);
  return `<article class="card">
    <nav class="card-links" aria-label="Look up ${escapeHtml(item.word)}">
      <a class="card-lookup jisho-lookup" href="${urls.jisho}" target="_blank" rel="noopener noreferrer" aria-label="Look up ${escapeHtml(item.word)} on Jisho" title="Jisho dictionary"><span aria-hidden="true">辞</span></a>
      <a class="card-lookup kana-lookup" href="${urls.kana}" target="_blank" rel="noopener noreferrer" aria-label="Look up ${escapeHtml(item.word)} reading on RomajiDesu" title="Kana and reading lookup"><span aria-hidden="true">あ</span></a>
    </nav>
    <div class="card-top"><span class="number">${String(index + 1).padStart(3, "0")}</span><strong class="word">${escapeHtml(item.word)}</strong></div>
    <div class="reading">${readings.map(escapeHtml).join(" / ")}</div>
    <p class="meaning">${escapeHtml(item.meaning)}</p>
    ${renderBreakdown(item)}
    ${sourceLabel ? `<div class="source">${escapeHtml(sourceLabel)}</div>` : ""}
  </article>`;
}

export function createStudyGuideHtml({
  selectionLabel,
  deckLabels,
  items,
  sourceLabelFor = () => "",
  generatedLabel = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date()),
  viewMode = "print",
}) {
  const screenView = viewMode === "screen";
  const totalPages = Math.max(1, Math.ceil(items.length / CARDS_PER_PAGE));
  const visibleDeckLabels = condensedDeckLabels(deckLabels);
  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const pageItems = items.slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE);
    const cards = pageItems.map((item, itemIndex) => (
      renderCard(item, pageIndex * CARDS_PER_PAGE + itemIndex, sourceLabelFor(item))
    )).join("");
    return `<section class="guide-page">
      <header class="page-header">
        <div><span class="kicker">INK RUN / STUDY GUIDE</span><h1>${escapeHtml(selectionLabel)}</h1></div>
        <div class="page-meta"><strong>${items.length} ${items.length === 1 ? "WORD" : "WORDS"}</strong><span>${escapeHtml(generatedLabel)}</span></div>
      </header>
      ${pageIndex === 0 ? `<div class="selection"><span>SELECTED DECKS</span><strong>${visibleDeckLabels.map(escapeHtml).join(" + ")}</strong><p>Read the word first. Cover the blue reading line to test yourself, then check the meaning and character breakdown.</p></div>` : ""}
      <div class="cards">${cards}</div>
      <footer><span>墨 INK RUN</span><span>${pageIndex + 1} / ${totalPages}</span></footer>
    </section>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(printableTitle(selectionLabel))}</title>
  <style>
    :root { color-scheme: light; --ink:#171714; --paper:#f7f2e8; --blue:#2449ff; --red:#f24437; --line:#c9c1b2; }
    * { box-sizing: border-box; }
    html, body { margin: 0; color: var(--ink); background: #ddd8cf; }
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .print-toolbar { position: sticky; z-index: 10; top: 0; padding: 12px; display: flex; justify-content: center; gap: 10px; background: rgba(23,23,20,.92); }
    .print-toolbar button { padding: 11px 16px; border: 1px solid white; background: white; color: var(--ink); font: 700 12px inherit; cursor: pointer; }
    .print-toolbar button:first-child { background: #ffd931; border-color: #ffd931; }
    .guide-page { position: relative; width: 215.9mm; height: 278mm; margin: 12px auto; padding: 11mm 11mm 9mm; overflow: hidden; background: var(--paper); page-break-after: always; break-after: page; }
    .guide-page:last-child { page-break-after: auto; break-after: auto; }
    .page-header { min-height: 24mm; padding-bottom: 4mm; display: flex; align-items: flex-start; justify-content: space-between; gap: 12mm; border-bottom: 1.2mm solid var(--ink); }
    .kicker { color: var(--red); font-size: 7.5pt; font-weight: 800; letter-spacing: .12em; }
    h1 { max-width: 145mm; margin: 2.5mm 0 0; font: 800 18pt/1.08 ui-sans-serif, system-ui, -apple-system, "Noto Sans JP", sans-serif; text-transform: uppercase; }
    .page-meta { padding-top: 1mm; display: flex; flex-direction: column; align-items: flex-end; gap: 1.5mm; white-space: nowrap; }
    .page-meta strong { color: var(--blue); font-size: 9pt; }
    .page-meta span { color: #6f6a62; font-size: 7pt; }
    .selection { margin-top: 4mm; padding: 3.5mm 4mm; display: grid; grid-template-columns: 31mm 1fr; gap: 1.5mm 4mm; border: .35mm solid var(--ink); }
    .selection span { color: var(--red); font-size: 6.5pt; font-weight: 800; letter-spacing: .08em; }
    .selection strong { font-size: 7.5pt; line-height: 1.3; }
    .selection p { grid-column: 1 / -1; margin: 0; color: #625e57; font: 7.2pt/1.35 ui-sans-serif, system-ui, -apple-system, "Noto Sans JP", sans-serif; }
    .cards { height: 221mm; margin-top: 4mm; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 3mm 4mm; }
    .guide-page:first-child .cards { height: 198mm; }
    .card { position: relative; min-width: 0; padding: 3mm 3.5mm 5mm; overflow: hidden; border: .35mm solid var(--line); border-top: 1mm solid var(--ink); background: rgba(255,255,255,.24); break-inside: avoid; }
    .card-links { position: absolute; z-index: 2; top: 3mm; right: 3mm; display: flex; gap: 1.2mm; }
    .card-lookup { width: 7mm; height: 7mm; display: grid; place-items: center; border: .35mm solid currentColor; border-radius: 1.5mm; background: #faf7f0; text-decoration: none; font: 800 9pt/1 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; }
    .jisho-lookup { color: var(--blue); }
    .kana-lookup { color: var(--red); }
    .card-lookup:hover, .card-lookup:focus-visible { background: currentColor; outline: none; }
    .jisho-lookup:hover span, .jisho-lookup:focus-visible span { color: white; }
    .kana-lookup:hover span, .kana-lookup:focus-visible span { color: white; }
    .card-top { display: flex; align-items: baseline; gap: 3mm; }
    .number { color: var(--red); font-size: 6.5pt; font-weight: 800; }
    .word { min-width: 0; font: 800 20pt/1.05 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; overflow-wrap: anywhere; }
    .reading { margin: 1.4mm 0 1.6mm 10mm; color: var(--blue); font: 700 10.5pt/1.2 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; }
    .meaning { margin: 0 0 1.5mm 10mm; font: 7.6pt/1.32 ui-sans-serif, system-ui, -apple-system, "Noto Sans JP", sans-serif; }
    .breakdown { margin: 2mm 0 0 10mm; padding-top: 1.2mm; border-top: .25mm solid var(--line); color: var(--ink); }
    .breakdown-label { display: block; margin-bottom: 1mm; color: var(--red); font: 700 5.5pt/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: .05em; }
    .breakdown-parts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1mm 2.5mm; }
    .breakdown span { min-width: 0; font: 8.4pt/1.3 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; }
    .breakdown b { color: var(--ink); font-size: 11pt; }
    .breakdown em { color: var(--blue); font-style: normal; }
    .source { position: absolute; right: 3.5mm; bottom: 2mm; left: 3.5mm; color: #847e74; font-size: 5.2pt; font-weight: 700; letter-spacing: .025em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    footer { position: absolute; right: 11mm; bottom: 5mm; left: 11mm; min-height: 6mm; padding-top: 2.5mm; display: flex; justify-content: space-between; color: #6f6a62; font-size: 6.5pt; font-weight: 700; letter-spacing: .08em; }
    .study-view .print-toolbar { justify-content: space-between; padding: 10px max(16px, calc((100vw - 1180px) / 2)); color: white; }
    .study-view .toolbar-title { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 800; letter-spacing: .08em; }
    .study-view .toolbar-title b { color: #ffd931; }
    .study-view .print-toolbar button:first-of-type { background: white; border-color: white; }
    .study-view main { padding: 6px 0 24px; }
    .study-view .guide-page { width: min(1180px, calc(100% - 32px)); height: auto; min-height: 0; padding: 42px; overflow: visible; page-break-after: auto; break-after: auto; }
    .study-view .page-header { min-height: 0; padding-bottom: 20px; }
    .study-view h1 { max-width: 820px; }
    .study-view .selection { margin-top: 20px; padding: 14px 16px; grid-template-columns: 150px 1fr; gap: 8px 18px; }
    .study-view .cards, .study-view .guide-page:first-child .cards { height: auto; margin-top: 20px; grid-template-rows: none; grid-auto-rows: minmax(245px, auto); gap: 16px; }
    .study-view .card { min-height: 245px; padding: 18px 20px 36px; overflow: visible; }
    .study-view .card-links { top: 16px; right: 16px; gap: 7px; }
    .study-view .card-lookup { width: 34px; height: 34px; border-width: 1.5px; border-radius: 7px; font-size: 16px; }
    .study-view .word { font-size: 30px; }
    .study-view .reading { margin: 10px 0 12px 48px; font-size: 16px; }
    .study-view .meaning { margin: 0 0 10px 48px; font-size: 12px; }
    .study-view .breakdown { margin: 12px 0 0 48px; padding-top: 8px; }
    .study-view .breakdown-label { margin-bottom: 8px; font-size: 9px; }
    .study-view .breakdown span { font-size: 14px; }
    .study-view .breakdown b { font-size: 18px; }
    .study-view footer { position: static; margin-top: 20px; padding-top: 12px; }
    @media (max-width: 760px) {
      .study-view .guide-page { width: min(100% - 20px, 560px); margin: 10px auto; padding: 24px 18px; }
      .study-view .page-header { gap: 16px; }
      .study-view h1 { font-size: 22px; }
      .study-view .selection { grid-template-columns: 1fr; }
      .study-view .selection p { grid-column: 1; }
      .study-view .cards { grid-template-columns: 1fr; }
      .study-view .breakdown-parts { grid-template-columns: 1fr; }
      .study-view .toolbar-title span { display: none; }
    }
    @page { size: Letter portrait; margin: 0; }
    @media print {
      html, body { background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .print-toolbar { display: none; }
      .guide-page { margin: 0; }
    }
  </style>
</head>
<body class="${screenView ? "study-view" : "print-view"}">
  ${screenView ? `<nav class="print-toolbar" aria-label="Study view controls">
    <div class="toolbar-title"><b>INK RUN</b><span>ALL-CARDS STUDY VIEW · ${items.length} ${items.length === 1 ? "WORD" : "WORDS"}</span></div>
    <button type="button" onclick="window.close()">CLOSE</button>
  </nav>` : `<nav class="print-toolbar" aria-label="PDF controls">
    <button type="button" onclick="window.print()">SAVE / PRINT PDF</button>
    <button type="button" onclick="window.close()">CLOSE</button>
  </nav>`}
  <main>${pages}</main>
</body>
</html>`;
}

export function openStudyGuidePrint(options) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;
  printWindow.document.open();
  printWindow.document.write(createStudyGuideHtml(options));
  printWindow.document.close();
  const openPrintDialog = () => {
    printWindow.focus();
    printWindow.print();
  };
  if (printWindow.document.fonts?.ready) {
    printWindow.document.fonts.ready.then(() => printWindow.setTimeout(openPrintDialog, 150));
  } else {
    printWindow.setTimeout(openPrintDialog, 300);
  }
  return true;
}

export function openStudyGuideView(options) {
  const studyWindow = window.open("", "_blank");
  if (!studyWindow) return false;
  studyWindow.document.open();
  studyWindow.document.write(createStudyGuideHtml({ ...options, viewMode: "screen" }));
  studyWindow.document.close();
  return true;
}

export { CARDS_PER_PAGE };
