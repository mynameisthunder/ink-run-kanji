const CARDS_PER_PAGE = 10;

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

function renderBreakdown(item) {
  if (!item.breakdown?.length) return "";
  return `<div class="breakdown">${item.breakdown.map(([character, reading]) => (
    `<span><b>${escapeHtml(character)}</b> ${escapeHtml(reading)}</span>`
  )).join("")}</div>`;
}

function renderCard(item, index, sourceLabel) {
  const readings = item.kana ?? [item.reading];
  return `<article class="card">
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
}) {
  const totalPages = Math.max(1, Math.ceil(items.length / CARDS_PER_PAGE));
  const visibleDeckLabels = deckLabels.length > 4
    ? [...deckLabels.slice(0, 3), `+ ${deckLabels.length - 3} MORE`]
    : deckLabels;
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
    .cards { height: 221mm; margin-top: 4mm; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(5, minmax(0, 1fr)); gap: 3mm 4mm; }
    .guide-page:first-child .cards { height: 198mm; }
    .card { position: relative; min-width: 0; padding: 3mm 3.5mm 5mm; overflow: hidden; border: .35mm solid var(--line); border-top: 1mm solid var(--ink); background: rgba(255,255,255,.24); break-inside: avoid; }
    .card-top { display: flex; align-items: baseline; gap: 3mm; }
    .number { color: var(--red); font-size: 6.5pt; font-weight: 800; }
    .word { min-width: 0; font: 800 20pt/1.05 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; overflow-wrap: anywhere; }
    .reading { margin: 1.4mm 0 1.6mm 10mm; color: var(--blue); font: 700 10.5pt/1.2 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; }
    .meaning { margin: 0 0 1.5mm 10mm; font: 7.6pt/1.32 ui-sans-serif, system-ui, -apple-system, "Noto Sans JP", sans-serif; }
    .breakdown { margin-left: 10mm; display: flex; flex-wrap: wrap; gap: 1mm 2.5mm; color: #4e4a44; }
    .breakdown span { font: 6.8pt/1.25 "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; }
    .breakdown b { color: var(--ink); font-size: 8pt; }
    .source { position: absolute; right: 3.5mm; bottom: 2mm; left: 3.5mm; color: #847e74; font-size: 5.2pt; font-weight: 700; letter-spacing: .025em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    footer { position: absolute; right: 11mm; bottom: 5mm; left: 11mm; min-height: 6mm; padding-top: 2.5mm; display: flex; justify-content: space-between; color: #6f6a62; font-size: 6.5pt; font-weight: 700; letter-spacing: .08em; }
    @page { size: Letter portrait; margin: 0; }
    @media print {
      html, body { background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .print-toolbar { display: none; }
      .guide-page { margin: 0; }
    }
  </style>
</head>
<body>
  <nav class="print-toolbar" aria-label="PDF controls">
    <button type="button" onclick="window.print()">SAVE / PRINT PDF</button>
    <button type="button" onclick="window.close()">CLOSE</button>
  </nav>
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

export { CARDS_PER_PAGE };
