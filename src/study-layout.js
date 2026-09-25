export const SINGLE_CARD_STUDY = 1;
export const FOUR_CARD_STUDY = 4;

export function normalizeStudyPageSize(value) {
  return Number(value) === FOUR_CARD_STUDY ? FOUR_CARD_STUDY : SINGLE_CARD_STUDY;
}

export function alignStudyIndex(index, pageSize) {
  const size = normalizeStudyPageSize(pageSize);
  return Math.floor(Math.max(0, index) / size) * size;
}

export function studyPage(deck, index, pageSize) {
  const start = alignStudyIndex(index, pageSize);
  return {
    start,
    items: deck.slice(start, start + normalizeStudyPageSize(pageSize)),
  };
}
