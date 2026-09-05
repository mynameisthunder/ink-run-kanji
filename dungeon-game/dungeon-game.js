import { createAudio } from "../src/audio.js";
import {
  attackDungeon,
  acceptedMeanings,
  createDungeonState,
  dungeonWordKey,
  fleeDungeon,
  restartDungeon,
  useDungeonHint,
} from "../src/dungeon-engine.js?v=counter-meanings-1";
import { romajiToHiragana } from "../src/kana.js";
import { NEEDS_WORK_ENTRY_ACCURACY, applyAttempt, emptyProgress, needsDailyReview, needsWork } from "../src/progress.js";
import { createStorage } from "../src/storage.js";
import { BUNDLED_AUDIO_ITEMS, DECKS, KANJI, KANJI_BY_WORD, itemKey } from "../src/vocabulary.js?v=counter-meanings-1";

/* ANIMATION STORYBOARD
 *
 *    0ms  hit / hurt / defeat feedback begins
 *  220ms  a defeated or fled enemy is replaced
 *  250ms  the answer input regains focus
 */
const TIMING = {
  nextEnemy: 220,
  refocus: 250,
};

const STARTER_WORDS = ["経済", "権利", "情報", "存在", "文章", "結果", "原因"];
const $ = (selector) => document.querySelector(selector);
const elements = {
  shell: $(".dungeon-shell"),
  battle: $("#battle"),
  ledger: $(".run-ledger"),
  deckLabel: $("#deckLabel"),
  floor: $("#floor"),
  combo: $("#combo"),
  playerHpLabel: $("#playerHpLabel"),
  playerHealthBar: $("#playerHealthBar"),
  playerHealthTrack: $(".player-health .health-track"),
  enemyHpLabel: $("#enemyHpLabel"),
  enemyHealthBar: $("#enemyHealthBar"),
  enemyHealthTrack: $(".enemy-health .health-track"),
  enemyStage: $("#enemyStage"),
  enemyWord: $("#enemyWord"),
  enemyRank: $("#enemyRank"),
  enemyNumber: $("#enemyNumber"),
  phaseLabel: $("#phaseLabel"),
  feedback: $("#combatFeedback"),
  form: $("#attackForm"),
  input: $("#attackInput"),
  attack: $("#attackButton"),
  hint: $("#hintButton"),
  flee: $("#fleeButton"),
  hintPanel: $("#hintPanel"),
  hintBreakdown: $("#hintBreakdown"),
  defeatedCount: $("#defeatedCount"),
  defeatedList: $("#defeatedList"),
  missCount: $("#missCount"),
  dangerList: $("#dangerList"),
  endState: $("#endState"),
  endKanji: $("#endKanji"),
  endEyebrow: $("#endEyebrow"),
  endTitle: $("#endTitle"),
  endSummary: $("#endSummary"),
  finalHp: $("#finalHp"),
  finalCombo: $("#finalCombo"),
  finalMisses: $("#finalMisses"),
  restart: $("#restartButton"),
  sound: $("#soundToggle"),
  exitLinks: [$("#exitLink"), $("#topExitLink"), $("#endExitLink")],
};

const storage = createStorage({ KANJI, itemKey, NEEDS_WORK_ENTRY_ACCURACY });
let progress = storage.loadWordProgress();
const favorites = storage.loadFavoriteWords();
let cloudUser = null;
let dungeon = null;
let dungeonItems = [];
let selectedDeckKeys = [];
let locked = false;
let soundEnabled = true;

const { playTone } = createAudio({ KANJI, BUNDLED_AUDIO_ITEMS, isSoundEnabled: () => soundEnabled });

function progressFor(key) {
  return progress.get(key) ?? emptyProgress();
}

function itemsForDeck(key) {
  if (key === "favorites") return KANJI.filter((item) => favorites.has(itemKey(item)));
  if (key === "done") return KANJI.filter((item) => progressFor(itemKey(item)).seenCount > 0);
  if (key === "daily-review") return KANJI.filter((item) => needsDailyReview(progressFor(itemKey(item))));
  if (key === "needs-work") return KANJI.filter((item) => needsWork(progressFor(itemKey(item))));
  const deck = DECKS[key];
  if (deck?.words) return deck.words.map((word) => KANJI_BY_WORD.get(word)).filter(Boolean);
  return deck ? KANJI.slice(deck.start, deck.end) : [];
}

function selectedItems(keys) {
  const seen = new Set();
  return keys.flatMap(itemsForDeck).filter((item) => {
    const key = itemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function routeSelection() {
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("decks") ?? "").split(",").filter((key) => DECKS[key]);
  if (requested.includes("all")) return ["all"];
  if (requested.length) return [...new Set(requested)];
  return itemsForDeck("needs-work").length ? ["needs-work"] : [];
}

function deckLabel(keys, items) {
  if (!keys.length) return "STARTER CHAMBER · 7 WORDS";
  if (keys.length === 1) return `${DECKS[keys[0]].label} · ${items.length} ${items.length === 1 ? "WORD" : "WORDS"}`;
  return `${keys.length} DECKS · ${items.length} WORDS`;
}

function updateExitLinks() {
  const url = new URL("../", window.location.href);
  if (selectedDeckKeys.length && !(selectedDeckKeys.length === 1 && selectedDeckKeys[0] === "all")) {
    url.searchParams.set("decks", selectedDeckKeys.join(","));
  }
  elements.exitLinks.forEach((link) => { link.href = url.href; });
}

async function hydrateCloudProgress() {
  if (!window.inkRunCloud?.available) return;
  try {
    await window.inkRunCloud.init(async (user) => {
      cloudUser = user;
      if (!user) return;
      const rows = await window.inkRunCloud.loadProgress();
      rows.forEach((row) => {
        if (!KANJI_BY_WORD.has(row.word)) return;
        const local = progressFor(row.word);
        const correctCount = Math.max(local.correctCount, Number(row.correct_count) || 0);
        const wrongCount = Math.max(local.wrongCount, Number(row.wrong_count) || 0);
        progress.set(row.word, {
          ...local,
          seenCount: Math.max(local.seenCount, correctCount + wrongCount ? 1 : 0),
          correctCount,
          wrongCount,
          correctStreak: Math.max(0, Number(row.correct_streak) || 0),
          reviewRequired: Boolean(row.review_required),
          reviewDismissed: Boolean(row.review_dismissed),
          lastReviewedAt: [local.lastReviewedAt, row.last_reviewed_at].filter(Boolean).sort().at(-1) ?? "",
          progressUpdatedAt: row.progress_updated_at || local.progressUpdatedAt || "",
        });
      });
      storage.saveWordProgress(progress);
    });
  } catch (error) {
    console.warn("Dungeon cloud sync unavailable; local progress remains active.", error);
  }
}

function recordProgress(item, correct) {
  const key = itemKey(item);
  const current = progressFor(key);
  const next = applyAttempt({ ...current, seenCount: Math.max(1, current.seenCount) }, correct);
  progress.set(key, next);
  storage.saveWordProgress(progress);
  if (cloudUser) window.inkRunCloud.recordAttempt(key, correct).catch(() => {});
}

function setFeedback(message, tone = "") {
  elements.feedback.textContent = message;
  elements.feedback.dataset.tone = tone;
}

function renderBreakdown(item) {
  elements.hintBreakdown.replaceChildren();
  (item?.breakdown ?? []).forEach(([character, reading, meaning]) => {
    const line = document.createElement("div");
    line.className = "hint-part";
    const kanji = document.createElement("b");
    kanji.textContent = character;
    const kana = document.createElement("em");
    kana.textContent = `(${reading})`;
    line.append(kanji, kana, document.createTextNode(meaning ? ` - ${meaning}` : ""));
    elements.hintBreakdown.append(line);
  });
}

function renderWordList(container, items, emptyText, withCounts = false) {
  container.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("em");
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }
  items.forEach(({ item, count }) => {
    const token = document.createElement("span");
    token.className = "word-token";
    token.textContent = item.word;
    if (withCounts) {
      const tally = document.createElement("b");
      tally.textContent = `×${count}`;
      token.append(tally);
    }
    container.append(token);
  });
}

function dangerItems() {
  return Object.entries(dungeon.misses)
    .map(([key, count]) => ({ item: dungeon.words.find((word) => dungeonWordKey(word) === key), count }))
    .filter(({ item }) => item)
    .sort((a, b) => b.count - a.count || a.item.word.localeCompare(b.item.word, "ja"));
}

function renderLedger() {
  elements.defeatedCount.textContent = `${dungeon.defeated.length} / ${dungeon.words.length}`;
  elements.missCount.textContent = `${dungeon.totalMisses} ${dungeon.totalMisses === 1 ? "MISS" : "MISSES"}`;
  renderWordList(elements.defeatedList, dungeon.defeated.map((item) => ({ item })), "None yet.");
  renderWordList(elements.dangerList, dangerItems(), "Nothing has hit you yet.", true);
}

function renderHealth() {
  const playerPercent = dungeon.playerHp / dungeon.maxPlayerHp * 100;
  const enemyPercent = dungeon.enemyHp / 2 * 100;
  elements.playerHpLabel.textContent = `${dungeon.playerHp} / ${dungeon.maxPlayerHp} HP`;
  elements.playerHealthBar.style.width = `${playerPercent}%`;
  elements.playerHealthTrack.setAttribute("aria-valuenow", String(dungeon.playerHp));
  elements.enemyHpLabel.textContent = `${dungeon.enemyHp} / 2 HP`;
  elements.enemyHealthBar.style.width = `${enemyPercent}%`;
  elements.enemyHealthTrack.setAttribute("aria-valuenow", String(dungeon.enemyHp));
}

function renderEnemy({ preserveFeedback = false } = {}) {
  const item = dungeon.currentWord;
  if (!item) return;
  elements.floor.textContent = String(dungeon.floor).padStart(2, "0");
  elements.combo.textContent = String(dungeon.combo);
  elements.enemyWord.textContent = item.word;
  elements.enemyWord.classList.toggle("long", [...item.word].length > 4);
  elements.enemyNumber.textContent = `ENEMY ${String(dungeon.floor).padStart(3, "0")}`;
  const misses = dungeon.misses[dungeonWordKey(item)] ?? 0;
  elements.enemyRank.textContent = misses ? `DANGER ×${misses}` : "UNMARKED";
  elements.phaseLabel.textContent = dungeon.phase === "reading" ? "READING ATTACK" : "MEANING FINISHER";
  elements.input.placeholder = dungeon.phase === "reading" ? "type reading" : "type meaning";
  elements.input.lang = dungeon.phase === "reading" ? "ja" : "en";
  elements.input.value = "";
  elements.hintPanel.hidden = !dungeon.hintRevealed;
  elements.hint.disabled = dungeon.hintRevealed || locked;
  renderBreakdown(item);
  renderHealth();
  renderLedger();
  if (!preserveFeedback) setFeedback(dungeon.phase === "reading" ? "Type the reading to strike." : "Finish it with one accepted meaning.");
  window.setTimeout(() => elements.input.focus(), TIMING.refocus - TIMING.nextEnemy);
}

function renderEnd() {
  const won = dungeon.status === "won";
  const empty = dungeon.status === "empty";
  elements.shell.classList.add("is-ended");
  elements.battle.hidden = true;
  elements.endState.hidden = false;
  elements.endKanji.textContent = empty ? "空" : won ? "勝" : "敗";
  elements.endEyebrow.textContent = empty ? "EMPTY CHAMBER" : won ? "DUNGEON CLEARED" : "RUN ENDED";
  elements.endTitle.textContent = empty ? "NO ENEMIES HERE." : won ? "YOU SURVIVED." : "YOU DIED.";
  elements.endSummary.textContent = empty
    ? "This deck has no words right now. Return to Ink Run and choose another deck."
    : won
      ? `Every enemy in ${elements.deckLabel.textContent} was defeated at least once.`
      : "Your danger list shows exactly which enemies broke the run. Study them, then descend again.";
  elements.finalHp.textContent = String(dungeon.playerHp);
  elements.finalCombo.textContent = String(dungeon.highestCombo);
  elements.finalMisses.textContent = String(dungeon.totalMisses);
  elements.restart.hidden = empty;
  renderLedger();
}

function render() {
  if (dungeon.status !== "playing") {
    renderEnd();
    return;
  }
  elements.shell.classList.remove("is-ended");
  elements.battle.hidden = false;
  elements.endState.hidden = true;
  elements.form.classList.toggle("is-locked", locked);
  elements.input.disabled = locked;
  elements.attack.disabled = locked;
  elements.flee.disabled = locked;
  renderEnemy();
}

function animate(className, target = elements.enemyStage) {
  target.classList.remove(className);
  void target.offsetWidth;
  target.classList.add(className);
  window.setTimeout(() => target.classList.remove(className), TIMING.nextEnemy);
}

function readingAnswer(item) {
  return (item.kana ?? [item.reading]).join(" / ");
}

function transitionTo(nextState, message, tone, animationClass, target = elements.enemyStage) {
  locked = true;
  elements.input.disabled = true;
  elements.attack.disabled = true;
  setFeedback(message, tone);
  animate(animationClass, target);
  window.setTimeout(() => {
    dungeon = nextState;
    locked = false;
    render();
    if (dungeon.status === "playing") animate("is-entering");
  }, TIMING.nextEnemy);
}

function submitAttack(event) {
  event.preventDefault();
  if (locked || dungeon.status !== "playing") return;
  const answer = elements.input.value.trim();
  if (!answer) {
    setFeedback("Your attack needs an answer.", "miss");
    elements.input.focus();
    return;
  }
  const enemy = dungeon.currentWord;
  const phase = dungeon.phase;
  const result = attackDungeon(dungeon, answer);

  if (result.event.kind === "miss") {
    dungeon = result.state;
    recordProgress(enemy, false);
    playTone("wrong");
    const correction = phase === "reading" ? readingAnswer(enemy) : acceptedMeanings(enemy).join(" / ");
    setFeedback(`Miss. ${correction}. Type it correctly to continue.`, "miss");
    renderEnemy({ preserveFeedback: true });
    animate("is-hurt", elements.battle);
    if (dungeon.status !== "playing") renderEnd();
    return;
  }

  if (result.event.kind === "reading-hit") {
    dungeon = result.state;
    playTone("correct");
    renderEnemy({ preserveFeedback: true });
    setFeedback(`Hit. ${readingAnswer(enemy)}. Now finish it with the meaning.`, "hit");
    animate("is-hit");
    return;
  }

  if (["enemy-defeated", "victory"].includes(result.event.kind)) {
    recordProgress(enemy, true);
    playTone("complete");
    transitionTo(result.state, `Enemy defeated. ${enemy.word} = ${acceptedMeanings(enemy)[0]}.`, "hit", "is-defeated");
  }
}

function useHint() {
  if (locked) return;
  const result = useDungeonHint(dungeon);
  if (result.event.kind === "ignored") return;
  dungeon = result.state;
  playTone("wrong");
  renderEnemy({ preserveFeedback: true });
  setFeedback("The enemy anatomy is exposed. Your combo is broken.", "miss");
  animate("is-hurt", elements.battle);
  if (dungeon.status !== "playing") renderEnd();
}

function flee() {
  if (locked) return;
  const enemy = dungeon.currentWord;
  const result = fleeDungeon(dungeon);
  recordProgress(enemy, false);
  playTone("wrong");
  if (result.state.status === "lost") {
    dungeon = result.state;
    renderEnd();
    return;
  }
  transitionTo(result.state, `${enemy.word} returns deeper in the dungeon.`, "miss", "is-hurt", elements.battle);
}

function restart() {
  dungeon = restartDungeon(dungeon);
  locked = false;
  elements.shell.classList.remove("is-ended");
  render();
  animate("is-entering");
}

function convertReadingInput(event) {
  if (event.isComposing || dungeon?.phase !== "reading") return;
  const converted = romajiToHiragana(elements.input.value);
  if (converted === elements.input.value) return;
  elements.input.value = converted;
  elements.input.setSelectionRange(converted.length, converted.length);
}

async function boot() {
  await hydrateCloudProgress();
  selectedDeckKeys = routeSelection();
  dungeonItems = selectedDeckKeys.length
    ? selectedItems(selectedDeckKeys)
    : STARTER_WORDS.map((word) => KANJI_BY_WORD.get(word)).filter(Boolean);
  elements.deckLabel.textContent = deckLabel(selectedDeckKeys, dungeonItems);
  updateExitLinks();
  dungeon = createDungeonState(dungeonItems);
  render();
  if (dungeon.status === "playing") animate("is-entering");
}

elements.form.addEventListener("submit", submitAttack);
elements.input.addEventListener("input", convertReadingInput);
elements.hint.addEventListener("click", useHint);
elements.flee.addEventListener("click", flee);
elements.restart.addEventListener("click", restart);
elements.sound.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  elements.sound.textContent = soundEnabled ? "音 ON" : "音 OFF";
  elements.sound.setAttribute("aria-pressed", String(soundEnabled));
});

window.addEventListener("load", boot, { once: true });
