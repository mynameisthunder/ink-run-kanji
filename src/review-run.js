export function isNeedsWorkOnlySelection(deckKeys) {
  return deckKeys.length === 1 && deckKeys[0] === "needs-work";
}

export function shouldRequeueMiss(mode, singlePassNeedsWork) {
  return mode === "batchRecall" || !singlePassNeedsWork;
}
