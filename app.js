import {
  BUNDLED_AUDIO_ITEMS,
  DECKS,
  FREQUENCY_3_WORDS,
  FREQUENCY_4_WORDS,
  KANJI,
  KANJI_BY_WORD,
  JLPT_SAMPLE_GROUPS,
  NUMBER_GROUPS,
  REAL_KANA_N5_WORDS,
  itemKey,
  sourceDeckLabel,
} from "./src/vocabulary.js";
import { createAudio } from "./src/audio.js";
import { createCloudSync } from "./src/cloud-sync.js";
import { dynamicDeckIsDisabled } from "./src/deck-selection.js";
import { burst } from "./src/effects.js";
import { answerIsCorrect, romajiToHiragana } from "./src/kana.js";
import {
  NEEDS_WORK_ENTRY_ACCURACY,
  RECALLS_PER_WORD,
  applyAttempt,
  emptyProgress,
  formatProgressLabel,
  needsDailyReview,
  needsWork,
  progressIsMastered,
} from "./src/progress.js";
import { parseRoute, selectionUrl, studyUrl } from "./src/routes.js";
import { createStorage } from "./src/storage.js";
const BATCH_SIZE = 3;
const TOTAL_BATCHES = Math.ceil(KANJI.length / BATCH_SIZE);
const DYNAMIC_DECK_KEYS = new Set(["favorites", "done", "daily-review", "needs-work"]);
let restoringRoute = false;

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
const elements = {
  intro: $("#introScreen"), game: $("#gameScreen"), result: $("#resultScreen"),
  home: $("#homeLink"),
  start: $("#startButton"), study: $("#studyButton"), studyStarred: $("#studyStarredButton"), replay: $("#replayButton"), review: $("#reviewButton"),
  search: $("#searchButton"), deckButton: $("#deckButton"), deckDialog: $("#deckDialog"), deckList: $("#deckList"), closeDeck: $("#closeDeckButton"),
  deckSearch: $("#deckSearchInput"), clearDeckSearch: $("#clearDeckSearchButton"), deckSearchStatus: $("#deckSearchStatus"), libraryWordCount: $("#libraryWordCount"),
  account: $("#accountButton"), accountLabel: $("#accountButton span"), accountDialog: $("#accountDialog"), closeAccount: $("#closeAccountButton"),
  signedOutPanel: $("#signedOutPanel"), signedInPanel: $("#signedInPanel"), signInForm: $("#signInForm"), emailInput: $("#emailInput"),
  accountEmail: $("#accountEmail"), cloudStatus: $("#cloudStatus"), syncNow: $("#syncNowButton"), signOut: $("#signOutButton"),
  favorite: $("#favoriteButton"),
  dialogStudy: $("#dialogStudyButton"), deckDialogTitle: $("#deckDialogTitle"), introSetLabel: $("#introSetLabel"),
  selectedDeckSummary: $("#selectedDeckSummary"), starredStudyCount: $("#starredStudyCount"),
  sound: $("#soundButton"), score: $("#score"), streak: $("#streak"), roundLabel: $("#roundLabel"), progress: $("#progressBar"),
  questionCount: $("#questionCount"), kanji: $("#kanjiPrompt"), jishoLink: $("#jishoLink"), hint: $("#hintButton"), meaning: $("#meaning"),
  studyCard: $("#studyCard"), studyReading: $("#studyReading"), studyLookup: $("#romajiDesuLink"), studyPronounce: $("#studyPronounceButton"), studyMeaning: $("#studyMeaning"), studyBreakdown: $("#studyBreakdown"),
  memoryHook: $("#memoryHook"), studyNext: $("#studyNextButton"), recallForm: $("#recallForm"), readingInput: $("#readingInput"),
  feedback: $("#feedback"), feedbackTitle: $("#feedbackTitle"), feedbackReading: $("#feedbackReading"), feedbackLookup: $("#feedbackRomajiDesuLink"),
  pronounce: $("#pronounceButton"), feedbackMeaning: $("#feedbackMeaning"), feedbackBreakdown: $("#feedbackBreakdown"), next: $("#nextButton"),
  finalScore: $("#finalScore"), accuracy: $("#accuracy"), bestStreak: $("#bestStreak"), hintsUsed: $("#hintsUsed"),
};

elements.libraryWordCount.textContent = String(KANJI.length);

const {
  loadCloudProgressSnapshot,
  loadCloudSnapshot,
  loadFavoriteWords,
  loadWordProgress,
  saveCloudProgressSnapshot,
  saveCloudSnapshot,
  saveFavoriteWords,
  saveWordProgress,
  updateCloudProgressSnapshot,
} = createStorage({ KANJI, itemKey, NEEDS_WORK_ENTRY_ACCURACY });

const state = {
  selectedDeckKeys: new Set(["all"]),
  favoriteWords: loadFavoriteWords(),
  wordProgress: loadWordProgress(),
  deck: KANJI.slice(0, 110),
  mode: "study",
  batchIndex: 0,
  studyIndex: 0,
  batch: [],
  queue: [],
  current: null,
  mastery: new Map(),
  mastered: new Set(),
  finalMastered: new Set(),
  streak: 0,
  bestStreak: 0,
  recalls: 0,
  reteaches: 0,
  locked: false,
  sound: true,
  cloudUser: null,
  studyLabel: "L1 ALL 110",
  sharedWordView: false,
  routeStudy: true,
};

const { cancelPronunciation, playTone, pronounceItem } = createAudio({
  KANJI,
  BUNDLED_AUDIO_ITEMS,
  isSoundEnabled: () => state.sound,
});

function progressFor(word) {
  return state.wordProgress.get(word) ?? emptyProgress();
}

function markWordSeen(word) {
  const stats = progressFor(word);
  state.wordProgress.set(word, {
    ...stats,
    seenCount: stats.seenCount + 1,
    lastReviewedAt: new Date().toISOString(),
  });
  saveWordProgress(state.wordProgress);
}

function recordLocalAttempt(word, correct) {
  const stats = progressFor(word);
  const nextStats = applyAttempt(stats, correct);
  state.wordProgress.set(word, nextStats);
  saveWordProgress(state.wordProgress);
  updateProgressControls();
  return nextStats;
}

function progressLabel(item) {
  return formatProgressLabel(progressFor(itemKey(item)));
}

function wordIsMastered(item) {
  return progressIsMastered(progressFor(itemKey(item)));
}

function deckIsMastered(key) {
  if (DYNAMIC_DECK_KEYS.has(key)) return false;
  const items = itemsForDeck(key);
  return items.length > 0 && items.every(wordIsMastered);
}

function dismissNeedsWork(item) {
  const key = itemKey(item);
  const stats = progressFor(key);
  state.wordProgress.set(key, {
    ...stats,
    reviewRequired: false,
    reviewDismissed: true,
    progressUpdatedAt: new Date().toISOString(),
  });
  saveWordProgress(state.wordProgress);
  queueCloudDismiss(key);
  updateProgressControls();
  populateDeck();
}

const {
  initializeCloudSync,
  queueCloudAttempt,
  queueCloudDismiss,
  queueFavoriteSync,
  setCloudStatus,
  synchronizeCloudProgress,
} = createCloudSync({
  state,
  elements,
  KANJI,
  itemKey,
  NEEDS_WORK_ENTRY_ACCURACY,
  loadCloudProgressSnapshot,
  loadCloudSnapshot,
  progressFor,
  renderDeckSelection,
  saveCloudProgressSnapshot,
  saveCloudSnapshot,
  saveFavoriteWords,
  saveWordProgress,
  updateCloudProgressSnapshot,
  updateProgressControls,
});

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function orderedSelectedDeckKeys() {
  return Object.keys(DECKS).filter((key) => state.selectedDeckKeys.has(key));
}

function routePath(url) {
  return `${url.pathname}${url.search}${url.hash}`;
}

function writeRoute(url, method = "replaceState") {
  if (restoringRoute) return;
  window.history[method]({}, "", routePath(url));
}

function writeSelectionRoute(method = "replaceState") {
  writeRoute(selectionUrl(window.location.href, orderedSelectedDeckKeys()), method);
}

function writeStudyRoute(method = "replaceState") {
  writeRoute(studyUrl(window.location.href, orderedSelectedDeckKeys(), state.studyIndex), method);
}

function itemsForDeck(key) {
  if (key === "favorites") return KANJI.filter((item) => state.favoriteWords.has(itemKey(item)));
  if (key === "done") return KANJI.filter((item) => progressFor(itemKey(item)).seenCount > 0)
    .sort((a, b) => progressFor(itemKey(b)).lastReviewedAt.localeCompare(progressFor(itemKey(a)).lastReviewedAt));
  if (key === "daily-review") return KANJI.filter((item) => needsDailyReview(progressFor(itemKey(item))))
    .sort((a, b) => {
      const aStats = progressFor(itemKey(a));
      const bStats = progressFor(itemKey(b));
      const aAttempts = aStats.correctCount + aStats.wrongCount;
      const bAttempts = bStats.correctCount + bStats.wrongCount;
      const aRate = aStats.correctCount / aAttempts;
      const bRate = bStats.correctCount / bAttempts;
      return bStats.wrongCount - aStats.wrongCount
        || aRate - bRate
        || aStats.lastReviewedAt.localeCompare(bStats.lastReviewedAt);
    });
  if (key === "needs-work") return KANJI.filter((item) => needsWork(progressFor(itemKey(item))))
    .sort((a, b) => {
      const aStats = progressFor(itemKey(a));
      const bStats = progressFor(itemKey(b));
      const aRate = aStats.correctCount / (aStats.correctCount + aStats.wrongCount);
      const bRate = bStats.correctCount / (bStats.correctCount + bStats.wrongCount);
      return aRate - bRate || bStats.wrongCount - aStats.wrongCount;
    });
  const deck = DECKS[key];
  if (deck?.words) return deck.words.map((word) => KANJI_BY_WORD.get(word)).filter(Boolean);
  return deck ? KANJI.slice(deck.start, deck.end) : [];
}

function selectedDeck() {
  if (state.selectedDeckKeys.has("all")) return itemsForDeck("all");
  const seen = new Set();
  return orderedSelectedDeckKeys().flatMap(itemsForDeck).filter((item) => {
    const key = itemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function selectedDeckMeta() {
  const keys = orderedSelectedDeckKeys();
  const wordCount = selectedDeck().length;
  if (keys.length === 1) {
    const deck = DECKS[keys[0]];
    if (keys[0] === "favorites") {
      return {
        summary: `★ FAVORITES · ${wordCount}`,
        setLabel: `FAVORITES · ${wordCount} ${wordCount === 1 ? "WORD" : "WORDS"}`,
        studyLabel: `★ FAVORITES · ${wordCount}`,
        wordCount,
      };
    }
    if (["done", "daily-review", "needs-work"].includes(keys[0])) {
      const label = DECKS[keys[0]].label;
      return {
        summary: `${label} · ${wordCount}`,
        setLabel: `RECALL HISTORY · ${label} · ${wordCount}`,
        studyLabel: `${label} · ${wordCount}`,
        wordCount,
      };
    }
    return { summary: deck.label, setLabel: deck.setLabel, studyLabel: deck.label, wordCount };
  }
  return {
    summary: `${keys.length} DECKS · ${wordCount} WORDS`,
    setLabel: `CUSTOM LOADOUT · ${wordCount} WORDS`,
    studyLabel: `${keys.length} DECKS · ${wordCount} WORDS`,
    wordCount,
  };
}

function updateFavoriteButton(button, item) {
  if (!button) return;
  const active = Boolean(item && state.favoriteWords.has(itemKey(item)));
  button.disabled = !item;
  button.textContent = active ? "★" : "☆";
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", item ? `${active ? "Remove" : "Add"} ${item.word} ${active ? "from" : "to"} favorites` : "Add this word to favorites");
  button.title = active ? "Remove from favorites" : "Add to favorites";
}

function updateFavoriteControls() {
  const count = state.favoriteWords.size;
  document.querySelectorAll("[data-favorite-count]").forEach((node) => { node.textContent = String(count); });
  document.querySelectorAll('[data-deck-choice="favorites"]').forEach((button) => {
    const selected = state.selectedDeckKeys.has("favorites");
    button.disabled = dynamicDeckIsDisabled(count, selected);
    button.title = count === 0
      ? selected ? "Remove empty Favorites deck from selection" : "Star words to build this deck"
      : `Study ${count} favorite ${count === 1 ? "word" : "words"}`;
  });
  elements.studyStarred.disabled = count === 0;
  elements.studyStarred.title = count === 0 ? "Star words during a run to study them here" : `Study ${count} starred ${count === 1 ? "word" : "words"}`;
  elements.studyStarred.setAttribute("aria-label", elements.studyStarred.title);
  elements.starredStudyCount.textContent = `${count} ${count === 1 ? "WORD" : "WORDS"} SAVED`;
  updateFavoriteButton(elements.favorite, state.current);
}

function updateProgressControls() {
  const doneCount = itemsForDeck("done").length;
  const dailyReviewCount = itemsForDeck("daily-review").length;
  const needsWorkCount = itemsForDeck("needs-work").length;
  document.querySelectorAll("[data-done-count]").forEach((node) => { node.textContent = String(doneCount); });
  document.querySelectorAll("[data-daily-review-count]").forEach((node) => { node.textContent = String(dailyReviewCount); });
  document.querySelectorAll("[data-needs-work-count]").forEach((node) => { node.textContent = String(needsWorkCount); });
  document.querySelectorAll('[data-deck-choice="done"]').forEach((button) => {
    const selected = state.selectedDeckKeys.has("done");
    button.disabled = dynamicDeckIsDisabled(doneCount, selected);
    button.title = doneCount
      ? `Review ${doneCount} seen ${doneCount === 1 ? "word" : "words"}`
      : selected ? "Remove empty Done deck from selection" : "Complete recalls to build this deck";
  });
  document.querySelectorAll('[data-deck-choice="daily-review"]').forEach((button) => {
    const selected = state.selectedDeckKeys.has("daily-review");
    button.disabled = dynamicDeckIsDisabled(dailyReviewCount, selected);
    button.title = dailyReviewCount
      ? `Daily practice for ${dailyReviewCount} repeatedly missed ${dailyReviewCount === 1 ? "word" : "words"}`
      : selected ? "Remove empty Daily Review deck from selection" : "Words missed at least twice will appear here";
  });
  document.querySelectorAll('[data-deck-choice="needs-work"]').forEach((button) => {
    const selected = state.selectedDeckKeys.has("needs-work");
    button.disabled = dynamicDeckIsDisabled(needsWorkCount, selected);
    button.title = needsWorkCount
      ? `Practice ${needsWorkCount} ${needsWorkCount === 1 ? "word" : "words"} at 60% recall or lower`
      : selected ? "Remove empty Needs Work deck from selection" : "Words at 60% recall or lower will appear here";
  });
  document.querySelectorAll("[data-deck-choice]").forEach((button) => {
    const key = button.dataset.deckChoice;
    const mastered = deckIsMastered(key);
    button.classList.toggle("mastered", mastered);
    if (mastered) {
      button.title = `${DECKS[key].label} mastered`;
      button.setAttribute("aria-label", `${DECKS[key].label}, mastered`);
    } else if (!DYNAMIC_DECK_KEYS.has(key)) {
      button.removeAttribute("title");
      button.removeAttribute("aria-label");
    }
  });
}

function renderDeckSelection() {
  const meta = selectedDeckMeta();
  document.querySelectorAll("[data-deck-choice]").forEach((button) => {
    const active = state.selectedDeckKeys.has(button.dataset.deckChoice);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-deck-range-toggle]").forEach((toggle) => {
    const prefix = toggle.dataset.deckRangeToggle;
    if ([...state.selectedDeckKeys].some((key) => key.startsWith(`${prefix}-`) && key !== `${prefix}-all`)) {
      setDeckRangeExpanded(toggle, true);
    }
  });
  elements.selectedDeckSummary.textContent = meta.summary;
  elements.introSetLabel.textContent = meta.setLabel;
  elements.deckDialogTitle.textContent = meta.setLabel;
  elements.deckButton.innerHTML = `DECK <span>${meta.wordCount}</span>`;
  updateFavoriteControls();
  updateProgressControls();
  populateDeck();
}

function setDeckSelection(keys, { updateRoute = true } = {}) {
  const validKeys = keys.filter((key) => DECKS[key]);
  state.selectedDeckKeys = new Set(validKeys.length ? validKeys : ["all"]);
  if (state.selectedDeckKeys.has("all") && state.selectedDeckKeys.size > 1) state.selectedDeckKeys = new Set(["all"]);
  renderDeckSelection();
  if (updateRoute) writeSelectionRoute();
}

function toggleDeckSelection(key) {
  if (!DECKS[key]) return;
  if (key === "favorites" && dynamicDeckIsDisabled(state.favoriteWords.size, state.selectedDeckKeys.has(key))) return;
  if (["done", "daily-review", "needs-work"].includes(key)
    && dynamicDeckIsDisabled(itemsForDeck(key).length, state.selectedDeckKeys.has(key))) return;
  if (key === "all") {
    setDeckSelection(["all"]);
    return;
  }

  const next = new Set(state.selectedDeckKeys);
  next.delete("all");
  if (next.has(key)) next.delete(key);
  else next.add(key);
  setDeckSelection([...next]);
}

function toggleFavorite(item) {
  if (!item) return;
  const key = itemKey(item);
  if (state.favoriteWords.has(key)) state.favoriteWords.delete(key);
  else state.favoriteWords.add(key);
  const favorite = state.favoriteWords.has(key);
  saveFavoriteWords(state.favoriteWords);
  queueFavoriteSync(key, favorite);

  let selectionChanged = false;
  if (state.favoriteWords.size === 0 && state.selectedDeckKeys.has("favorites")) {
    const next = new Set(state.selectedDeckKeys);
    next.delete("favorites");
    state.selectedDeckKeys = next.size ? next : new Set(["all"]);
    selectionChanged = true;
  }
  renderDeckSelection();
  if (selectionChanged) writeSelectionRoute();
  updateFavoriteButton(elements.favorite, state.current);
}

function startStarredStudy() {
  if (state.favoriteWords.size === 0) return;
  setDeckSelection(["favorites"]);
  startStudyDeck();
}

function showScreen(target) {
  screens.forEach((screen) => screen.classList.toggle("active", screen === target));
}

function returnHome(event) {
  event?.preventDefault();
  elements.feedback.classList.remove("show");
  elements.deckDialog.close();
  elements.accountDialog.close();
  cancelPronunciation();
  state.locked = false;
  state.current = null;
  state.sharedWordView = false;
  renderDeckSelection();
  showScreen(elements.intro);
  writeSelectionRoute("pushState");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyCurrentRoute() {
  const route = parseRoute(window.location.href, Object.keys(DECKS));
  restoringRoute = true;
  try {
    setDeckSelection(route.decks, { updateRoute: false });
    elements.feedback.classList.remove("show");
    if (elements.deckDialog.open) elements.deckDialog.close();
    cancelPronunciation();

    const sharedItem = route.word ? KANJI_BY_WORD.get(route.word) : null;
    if (sharedItem) {
      prepareRun("study", [sharedItem], `SHARED WORD · ${sharedItem.word}`, false);
      state.sharedWordView = true;
      showStudyCard({ trackSeen: false });
      return;
    }

    if (route.view === "study") {
      const deck = selectedDeck();
      if (deck.length > 0) {
        prepareRun("study");
        state.studyIndex = Math.min(route.card, deck.length - 1);
        showStudyCard();
        return;
      }
    }

    state.current = null;
    state.sharedWordView = false;
    showScreen(elements.intro);
  } finally {
    restoringRoute = false;
  }
}

function renderWord(item) {
  state.current = item;
  updateFavoriteButton(elements.favorite, item);
  elements.kanji.textContent = item.word;
  elements.kanji.classList.toggle("long", item.word.length > 1);
  elements.jishoLink.href = `https://jisho.org/search/${encodeURIComponent(item.word)}`;
  elements.jishoLink.setAttribute("aria-label", `Look up ${item.word} on Jisho`);
  elements.kanji.parentElement.classList.remove("swap");
  void elements.kanji.parentElement.offsetWidth;
  elements.kanji.parentElement.classList.add("swap");
}

function prepareRun(mode, deckOverride = null, studyLabelOverride = null, routeStudyOverride = null) {
  const deck = deckOverride ? [...deckOverride] : selectedDeck();
  Object.assign(state, {
    mode, deck, batchIndex: 0, studyIndex: 0, batch: deck, queue: mode === "finalRecall" ? shuffle(deck) : [], current: null,
    mastery: new Map(deck.map((item) => [itemKey(item), 0])), mastered: new Set(), finalMastered: new Set(),
    streak: 0, bestStreak: 0, recalls: 0, reteaches: 0, locked: false,
    studyLabel: studyLabelOverride ?? selectedDeckMeta().studyLabel,
    sharedWordView: false,
    routeStudy: routeStudyOverride ?? deckOverride === null,
  });
  elements.progress.style.background = "var(--red)";
  elements.feedback.classList.remove("show");
  showScreen(elements.game);
}

function startGame() {
  prepareRun("finalRecall");
  writeSelectionRoute();
  nextRecall();
}

function startStudyDeck() {
  if (elements.deckDialog.open) elements.deckDialog.close();
  if (selectedDeck().length === 0) return;
  prepareRun("study");
  writeStudyRoute("pushState");
  showStudyCard();
}

function startDialogStudy() {
  const query = elements.deckSearch.value.trim();
  if (!query) {
    startStudyDeck();
    return;
  }
  const results = searchKanji(query);
  if (results.length === 0) return;
  elements.deckDialog.close();
  prepareRun("study", results, `SEARCH · ${results.length} ${results.length === 1 ? "RESULT" : "RESULTS"}`, false);
  showStudyCard();
}

function startBatch() {
  if (state.batchIndex >= TOTAL_BATCHES) {
    beginFinalRecall();
    return;
  }
  const start = state.batchIndex * BATCH_SIZE;
  state.batch = KANJI.slice(start, start + BATCH_SIZE);
  state.studyIndex = 0;
  state.mode = "study";
  showStudyCard();
}

function buildParts(item, target, className) {
  target.replaceChildren(...item.breakdown.map(([character, reading, definition]) => {
    const part = document.createElement("div");
    part.className = className;
    part.innerHTML = `<strong>${character} · ${reading}</strong><span>${definition}</span>`;
    return part;
  }));
}

function showStudyCard({ trackSeen = true } = {}) {
  const item = state.deck[state.studyIndex];
  if (!item) return;
  if (trackSeen) markWordSeen(itemKey(item));
  renderWord(item);
  elements.feedback.classList.remove("show");
  elements.studyCard.classList.remove("hidden");
  elements.recallForm.classList.add("hidden");
  elements.hint.classList.add("hidden");
  elements.meaning.textContent = "";
  elements.roundLabel.textContent = `STUDY ${state.studyLabel}`;
  elements.questionCount.textContent = `CARD ${String(state.studyIndex + 1).padStart(2, "0")} / ${String(state.deck.length).padStart(2, "0")}`;
  elements.studyReading.textContent = item.reading;
  elements.studyLookup.href = `https://www.romajidesu.com/kanji/${encodeURIComponent(item.word)}`;
  elements.studyLookup.setAttribute("aria-label", `Look up ${item.word} on RomajiDesu`);
  elements.studyPronounce.setAttribute("aria-label", `Pronounce ${item.word}: ${(item.kana ?? [item.reading])[0]}`);
  elements.studyMeaning.textContent = item.meaning;
  elements.memoryHook.textContent = item.memory;
  buildParts(item, elements.studyBreakdown, "study-part");
  elements.studyNext.firstChild.textContent = state.studyIndex === state.deck.length - 1 ? "START RECALL RUN " : "NEXT STUDY CARD ";
  if (state.routeStudy) writeStudyRoute();
  updateStatus();
}

function advanceStudy() {
  if (state.mode !== "study") return;
  state.studyIndex += 1;
  if (state.studyIndex < state.deck.length) showStudyCard();
  else beginFinalRecall();
}

function retreatStudy() {
  if (state.mode !== "study" || state.studyIndex === 0) return;
  state.studyIndex -= 1;
  showStudyCard();
}

function beginBatchRecall() {
  state.mode = "batchRecall";
  state.queue = shuffle(state.batch);
  nextRecall();
}

function beginFinalRecall() {
  state.mode = "finalRecall";
  state.queue = shuffle(state.deck);
  state.finalMastered = new Set();
  elements.progress.style.background = "var(--red)";
  if (state.routeStudy) writeSelectionRoute();
  nextRecall();
}

function remainingBatchRecalls() {
  return state.batch.reduce((total, item) => total + Math.max(0, RECALLS_PER_WORD - state.mastery.get(itemKey(item))), 0);
}

function nextRecall() {
  elements.feedback.classList.remove("show");
  state.locked = false;

  if (state.queue.length === 0) {
    if (state.mode === "batchRecall") {
      state.batchIndex += 1;
      startBatch();
    } else {
      finishGame();
    }
    return;
  }

  const item = state.queue.shift();
  renderWord(item);
  elements.studyCard.classList.add("hidden");
  elements.recallForm.classList.remove("hidden");
  elements.hint.classList.remove("hidden");
  elements.hint.disabled = false;
  elements.meaning.textContent = "";
  elements.readingInput.value = "";
  elements.readingInput.classList.remove("input-wrong", "input-correct");
  elements.readingInput.placeholder = "romaji → ひらがな";

  if (state.mode === "batchRecall") {
    elements.roundLabel.textContent = `PROVE ${state.batchIndex + 1}/${TOTAL_BATCHES}`;
    elements.questionCount.textContent = `${remainingBatchRecalls()} RECALLS LEFT`;
  } else {
    elements.roundLabel.textContent = "RECALL RUN";
    elements.questionCount.textContent = `${state.finalMastered.size} / ${state.deck.length} PROVED`;
  }
  updateStatus();
  requestAnimationFrame(() => elements.readingInput.focus({ preventScroll: true }));
}


function convertReadingInput(event) {
  if (event.isComposing) return;
  const converted = romajiToHiragana(elements.readingInput.value);
  if (converted !== elements.readingInput.value) {
    elements.readingInput.value = converted;
    elements.readingInput.setSelectionRange(converted.length, converted.length);
  }
}


function checkRecall(event) {
  event.preventDefault();
  if (state.locked || !["batchRecall", "finalRecall"].includes(state.mode)) return;
  const value = romajiToHiragana(elements.readingInput.value, true);
  elements.readingInput.value = value;
  if (!value.trim()) {
    elements.readingInput.placeholder = "try a reading — or press H";
    elements.readingInput.focus();
    return;
  }
  if (answerIsCorrect(value, state.current)) recordCorrectRecall();
  else reteachCurrent();
}

function recordCorrectRecall() {
  state.locked = true;
  state.recalls += 1;
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  const key = itemKey(state.current);
  recordLocalAttempt(key, true);
  queueCloudAttempt(key, true);
  elements.readingInput.classList.add("input-correct");

  let title;
  if (state.mode === "batchRecall") {
    const level = Math.min(RECALLS_PER_WORD, state.mastery.get(key) + 1);
    state.mastery.set(key, level);
    if (level < RECALLS_PER_WORD) state.queue.push(state.current);
    else state.mastered.add(key);
    title = `RECALLED ${level}/${RECALLS_PER_WORD}`;
  } else {
    state.finalMastered.add(key);
    title = "FINAL RECALL LOCKED";
  }

  showFeedback(title, state.current, false);
  updateStatus();
  playTone("correct");
}

function reteachCurrent() {
  if (state.locked || !["batchRecall", "finalRecall"].includes(state.mode)) return;
  state.locked = true;
  state.reteaches += 1;
  state.streak = 0;
  const key = itemKey(state.current);
  recordLocalAttempt(key, false);
  queueCloudAttempt(key, false);
  elements.readingInput.classList.add("input-wrong");

  if (state.mode === "batchRecall") {
    state.mastery.set(key, 0);
    state.mastered.delete(key);
  }
  state.queue.push(state.current);
  showFeedback("NOT YET — REBUILD IT", state.current, true);
  updateStatus();
  playTone("wrong");
}

function showFeedback(title, item, includeBreakdown) {
  elements.feedbackTitle.textContent = title;
  elements.feedbackReading.textContent = item.reading;
  elements.feedbackLookup.href = `https://www.romajidesu.com/kanji/${encodeURIComponent(item.word)}`;
  elements.feedbackLookup.setAttribute("aria-label", `Look up ${item.word} on RomajiDesu`);
  elements.pronounce.setAttribute("aria-label", `Pronounce ${item.word}: ${(item.kana ?? [item.reading])[0]}`);
  elements.feedbackMeaning.textContent = item.meaning;
  elements.feedback.classList.add("detailed");
  buildParts(item, elements.feedbackBreakdown, "breakdown-item");
  elements.feedbackBreakdown.querySelectorAll(".breakdown-item strong").forEach((node) => node.className = "breakdown-char");
  elements.feedbackBreakdown.querySelectorAll(".breakdown-item span").forEach((node) => node.className = "breakdown-definition");
  elements.next.firstChild.textContent = includeBreakdown ? "STUDY, THEN TRY AGAIN LATER " : "NEXT RECALL ";
  elements.feedback.classList.add("show");
  elements.next.focus({ preventScroll: true });
}

function pronounceCurrentWord() { pronounceItem(state.current, elements.pronounce); }
function pronounceStudyWord() { pronounceItem(state.current, elements.studyPronounce); }

function updateStatus() {
  const completed = state.mode === "finalRecall" ? state.finalMastered.size : state.mastered.size;
  elements.score.textContent = `${completed}/${state.deck.length}`;
  elements.streak.textContent = state.streak;
  elements.progress.style.width = `${(completed / state.deck.length) * 100}%`;
}

function finishGame() {
  elements.finalScore.textContent = `${state.finalMastered.size}/${state.deck.length}`;
  elements.accuracy.textContent = String(state.recalls);
  elements.bestStreak.textContent = `${state.bestStreak}×`;
  elements.hintsUsed.textContent = String(state.reteaches);
  showScreen(elements.result);
  burst();
  playTone("finish");
}

function normalizeSearchText(value) {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase();
}

function searchKanji(query) {
  const terms = normalizeSearchText(query).trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return selectedDeck();
  return KANJI.filter((item) => {
    const breakdownText = item.breakdown.flat().join(" ");
    const searchable = normalizeSearchText([
      item.word,
      item.reading,
      ...(item.romaji ?? []),
      item.meaning,
      item.memory,
      breakdownText,
    ].join(" "));
    return terms.every((term) => searchable.includes(term));
  });
}

function populateDeck() {
  const query = elements.deckSearch.value.trim();
  const items = query ? searchKanji(query) : selectedDeck();
  const rows = items.map((item) => {
    const row = document.createElement("div");
    const hasCharacterBreakdown = item.breakdown.length > 1;
    const trackedProgress = progressLabel(item);
    const itemNeedsWork = needsWork(progressFor(itemKey(item)));
    row.className = `deck-item${hasCharacterBreakdown ? " deck-item-detailed" : ""}`;
    const breakdown = hasCharacterBreakdown
      ? `<span class="deck-breakdown-label">CHARACTER BREAKDOWN</span><span class="deck-breakdown">${item.breakdown.map(([character, reading, definition]) => `<span class="deck-breakdown-part"><b>${character}</b> ${reading}<small>${definition}</small></span>`).join("")}</span>`
      : "";
    row.innerHTML = `<span class="deck-kanji">${item.word}</span><button class="favorite-button deck-favorite-button" type="button" aria-pressed="false">☆</button><span class="deck-details"><span class="deck-reading">${item.reading}</span><span class="deck-meaning">${item.meaning}</span>${breakdown}</span>${trackedProgress ? `<span class="deck-progress${itemNeedsWork ? " needs-work" : ""}">${trackedProgress}</span>` : ""}${itemNeedsWork ? `<button class="deck-review-dismiss" type="button" aria-label="Remove ${item.word} from Needs Work" title="Remove from Needs Work">REMOVE ×</button>` : ""}<span class="deck-source">${sourceDeckLabel(item)}</span>`;
    const favoriteButton = row.querySelector(".deck-favorite-button");
    updateFavoriteButton(favoriteButton, item);
    favoriteButton.addEventListener("click", () => toggleFavorite(item));
    row.querySelector(".deck-review-dismiss")?.addEventListener("click", () => dismissNeedsWork(item));
    return row;
  });

  if (rows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "deck-empty";
    empty.textContent = "NO MATCHES YET · TRY A KANJI, READING, ROMAJI, OR ENGLISH MEANING";
    rows.push(empty);
  }

  elements.deckList.replaceChildren(...rows);
  elements.clearDeckSearch.classList.toggle("hidden", !query);
  elements.deckSearchStatus.textContent = query
    ? `SEARCHING ALL ${KANJI.length} WORDS · ${items.length} ${items.length === 1 ? "MATCH" : "MATCHES"}`
    : `SHOWING ${selectedDeckMeta().summary}`;
  elements.dialogStudy.disabled = items.length === 0;
  elements.dialogStudy.firstChild.textContent = query
    ? `STUDY ${items.length} ${items.length === 1 ? "RESULT" : "RESULTS"} `
    : "STUDY SELECTION ";
}

function openDeckDialog(focusSearch = false) {
  elements.deckSearch.value = "";
  populateDeck();
  elements.deckDialog.showModal();
  if (focusSearch) window.requestAnimationFrame(() => elements.deckSearch.focus());
}

function setDeckRangeExpanded(toggle, expanded) {
  const rangeContainer = document.getElementById(toggle.getAttribute("aria-controls"));
  if (!rangeContainer) return;
  const count = toggle.dataset.rangeCount;
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.textContent = `${expanded ? "HIDE" : "SHOW"} ${count} SMALL DECKS ${expanded ? "−" : "+"}`;
  rangeContainer.hidden = !expanded;
}

function appendGeneratedDeckButtons() {
  document.querySelectorAll(".deck-options, .dialog-deck-options").forEach((container, containerIndex) => {
    const n5Keys = ["n5-all", ...Array.from({ length: Math.ceil(REAL_KANA_N5_WORDS.length / 10) }, (_, index) => {
      const start = index * 10 + 1;
      return `n5-${start}-${Math.min(start + 9, REAL_KANA_N5_WORDS.length)}`;
    })];
    const frequency2Keys = ["frequency-2-all", ...Array.from({ length: 15 }, (_, index) => {
      const start = index * 10 + 1;
      return `frequency-2-${start}-${start + 9}`;
    })];
    const frequency3Keys = ["frequency-3-all", ...Array.from({ length: Math.ceil(FREQUENCY_3_WORDS.length / 10) }, (_, index) => {
      const start = index * 10 + 1;
      return `frequency-3-${start}-${Math.min(start + 9, FREQUENCY_3_WORDS.length)}`;
    })];
    const frequency4Keys = ["frequency-4-all", ...Array.from({ length: Math.ceil(FREQUENCY_4_WORDS.length / 10) }, (_, index) => {
      const start = index * 10 + 1;
      return `frequency-4-${start}-${Math.min(start + 9, FREQUENCY_4_WORDS.length)}`;
    })];
    const level2Keys = ["level-2-all", "level-2-1-10"];
    const numberKeys = ["numbers-all", ...NUMBER_GROUPS.map((group) => `numbers-${group.key}`)];
    [
      { label: "REAL KANA · FREQUENCY LEVEL 1:2", keys: frequency2Keys, className: "frequency-2-deck-option" },
      { label: "REAL KANA · FREQUENCY LEVEL 1:3", keys: frequency3Keys, className: "frequency-3-deck-option", collapsibleRanges: true, rangeKey: "frequency-3" },
      { label: "REAL KANA · FREQUENCY LEVEL 1:4", keys: frequency4Keys, className: "frequency-4-deck-option", collapsibleRanges: true, rangeKey: "frequency-4" },
      { label: "REAL KANA · FREQUENCY LEVEL 2", keys: level2Keys, className: "level-2-deck-option" },
      { label: `REAL KANA · N5 WORDS · ${REAL_KANA_N5_WORDS.length}`, keys: n5Keys, className: "n5-deck-option", collapsibleRanges: true, rangeKey: "n5" },
      { label: "REAL KANA · JLPT N1 / N2 / N3 STARTERS", keys: JLPT_SAMPLE_GROUPS.map((group) => group.key), className: "jlpt-sample-deck-option" },
      {
        label: "REAL KANA · NUMBERS + COUNTERS",
        keys: numberKeys,
        className: "number-deck-option",
        guideUrl: "https://strommeninc.com/the-ultimate-guide-to-japanese-counters-from-hitotsu-to-ippon-bottles-people-and-everything-in-between-japanese-lesson-3/",
      },
    ].forEach(({ label, keys, className, guideUrl, collapsibleRanges = false, rangeKey = "" }) => {
      const groupLabel = document.createElement("span");
      groupLabel.className = "deck-group-label";
      if (guideUrl) {
        groupLabel.innerHTML = `${label} <a class="deck-guide-link" href="${guideUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open the complete Japanese counters guide">COUNTER GUIDE ↗</a>`;
      } else {
        groupLabel.textContent = label;
      }
      container.append(groupLabel);

      const appendDeckButton = (parent, key) => {
        const button = document.createElement("button");
        button.className = `deck-option ${className}`;
        button.type = "button";
        button.dataset.deckChoice = key;
        button.setAttribute("aria-pressed", "false");
        button.textContent = DECKS[key].label;
        parent.append(button);
      };

      if (!collapsibleRanges) {
        keys.forEach((key) => appendDeckButton(container, key));
        return;
      }

      appendDeckButton(container, keys[0]);
      const rangeContainer = document.createElement("div");
      rangeContainer.className = "deck-range-options";
      rangeContainer.id = `${rangeKey.replace(/-/g, "")}DeckRanges${containerIndex}`;
      rangeContainer.hidden = true;
      keys.slice(1).forEach((key) => appendDeckButton(rangeContainer, key));

      const toggle = document.createElement("button");
      toggle.className = "deck-option deck-range-toggle";
      toggle.type = "button";
      toggle.dataset.deckRangeToggle = rangeKey;
      toggle.dataset.rangeCount = String(keys.length - 1);
      toggle.setAttribute("aria-controls", rangeContainer.id);
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", () => {
        setDeckRangeExpanded(toggle, toggle.getAttribute("aria-expanded") !== "true");
      });
      container.append(toggle, rangeContainer);
      setDeckRangeExpanded(toggle, false);
    });
  });
}

appendGeneratedDeckButtons();

document.querySelectorAll("[data-deck-choice]").forEach((button) => button.addEventListener("click", () => toggleDeckSelection(button.dataset.deckChoice)));
elements.home.addEventListener("click", returnHome);
elements.start.addEventListener("click", startGame);
elements.study.addEventListener("click", startStudyDeck);
elements.studyStarred.addEventListener("click", startStarredStudy);
elements.replay.addEventListener("click", () => {
  const replayDeck = [...state.deck];
  const replayLabel = state.studyLabel;
  prepareRun("finalRecall", replayDeck, replayLabel);
  nextRecall();
});
elements.studyNext.addEventListener("click", advanceStudy);
elements.readingInput.addEventListener("input", convertReadingInput);
elements.recallForm.addEventListener("submit", checkRecall);
elements.hint.addEventListener("click", reteachCurrent);
elements.next.addEventListener("click", nextRecall);
elements.pronounce.addEventListener("click", pronounceCurrentWord);
elements.studyPronounce.addEventListener("click", pronounceStudyWord);
elements.favorite.addEventListener("click", () => toggleFavorite(state.current));
elements.review.addEventListener("click", () => openDeckDialog());
elements.search.addEventListener("click", () => openDeckDialog(true));
elements.deckButton.addEventListener("click", () => openDeckDialog());
elements.deckSearch.addEventListener("input", populateDeck);
elements.clearDeckSearch.addEventListener("click", () => {
  elements.deckSearch.value = "";
  populateDeck();
  elements.deckSearch.focus();
});
elements.account.addEventListener("click", () => elements.accountDialog.showModal());
elements.closeAccount.addEventListener("click", () => elements.accountDialog.close());
elements.accountDialog.addEventListener("click", (event) => {
  if (event.target === elements.accountDialog) elements.accountDialog.close();
});
elements.signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = elements.signInForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setCloudStatus("SENDING YOUR PRIVATE SIGN-IN LINK…", "syncing");
  try {
    await window.inkRunCloud.signIn(elements.emailInput.value.trim());
    elements.emailInput.value = "";
    setCloudStatus("LINK SENT · CHECK YOUR EMAIL · THIS WINDOW CAN STAY OPEN", "success");
  } catch (error) {
    setCloudStatus(`COULD NOT SEND LINK · ${error.message}`, "error");
  } finally {
    submitButton.disabled = false;
  }
});
elements.syncNow.addEventListener("click", () => synchronizeCloudProgress());
elements.signOut.addEventListener("click", async () => {
  elements.signOut.disabled = true;
  setCloudStatus("SIGNING OUT…", "syncing");
  try {
    await window.inkRunCloud.signOut();
  } catch (error) {
    setCloudStatus(`COULD NOT SIGN OUT · ${error.message}`, "error");
  } finally {
    elements.signOut.disabled = false;
  }
});
elements.dialogStudy.addEventListener("click", startDialogStudy);
elements.closeDeck.addEventListener("click", () => elements.deckDialog.close());
elements.deckDialog.addEventListener("click", (event) => {
  if (event.target === elements.deckDialog) elements.deckDialog.close();
});
elements.sound.addEventListener("click", () => {
  state.sound = !state.sound;
  elements.sound.textContent = state.sound ? "音 ON" : "音 OFF";
  elements.sound.setAttribute("aria-pressed", String(state.sound));
});

window.addEventListener("keydown", (event) => {
  if (elements.deckDialog.open) return;
  if (event.target.closest?.("button, a, input, textarea, select, summary")) return;
  if (event.key === "ArrowRight" && state.mode === "study" && elements.game.classList.contains("active")) {
    event.preventDefault();
    elements.studyNext.click();
    return;
  }
  if (event.key === "ArrowLeft" && state.mode === "study" && elements.game.classList.contains("active")) {
    event.preventDefault();
    retreatStudy();
    return;
  }
  if (event.key.toLowerCase() === "h" && event.target !== elements.readingInput && !elements.hint.classList.contains("hidden")) reteachCurrent();
  if (event.key === "Enter" && elements.feedback.classList.contains("show")) {
    event.preventDefault();
    elements.next.click();
  } else if (event.key === "Enter" && state.mode === "study" && elements.game.classList.contains("active")) {
    elements.studyNext.click();
  } else if (event.key === "Enter" && elements.intro.classList.contains("active")) {
    startGame();
  }
});

window.addEventListener("popstate", applyCurrentRoute);

applyCurrentRoute();
initializeCloudSync().then(() => {
  const route = parseRoute(window.location.href, Object.keys(DECKS));
  if (route.view === "study" && elements.intro.classList.contains("active") && selectedDeck().length > 0) applyCurrentRoute();
});
