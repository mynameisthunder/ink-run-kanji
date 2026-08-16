const KANJI = [
  {
    word: "三", reading: "さん", romaji: ["san"], meaning: "the number three",
    breakdown: [["三", "さん", "three"]],
    memory: "三 has three strokes. When you see three, say さん (san).",
  },
  {
    word: "法", reading: "ほう", romaji: ["hou", "hoo", "ho"], meaning: "law; rule; method; doctrine",
    breakdown: [["法", "ほう", "law; rule; method"]],
    memory: "Think: “HO! That is the law.” Stretch ほ into ほう (hou).",
  },
  {
    word: "性", reading: "せい", romaji: ["sei", "sey"], meaning: "nature; characteristic; quality; gender or sex",
    breakdown: [["性", "せい", "nature; character; gender"]],
    memory: "Your nature is what you SAY: せい (sei).",
  },
  {
    word: "目", reading: "め", romaji: ["me"], meaning: "eye; look; item; ordinal marker",
    breakdown: [["目", "め", "eye; item; ordinal marker"]],
    memory: "目 looks like an eye. One short sound: め (me).",
  },
  {
    word: "後", reading: "あと", romaji: ["ato"], meaning: "after; later; behind; the remainder",
    breakdown: [["後", "あと", "after; behind; later"]],
    memory: "Ask “what comes after?” Answer with あと (ato).",
  },
  {
    word: "部", reading: "ぶ", romaji: ["bu"], meaning: "part; section; department; club",
    breakdown: [["部", "ぶ", "part; section; department"]],
    memory: "One part or section gets one short beat: ぶ (bu).",
  },
  {
    word: "実際", reading: "じっさい", romaji: ["jissai", "jitsusai"], meaning: "reality or actuality; in fact; actually",
    breakdown: [["実", "じっ", "truth; reality; actual"], ["際", "さい", "occasion; edge; circumstances"]],
    memory: "実 becomes じっ before 際 (さい): じっ + さい = じっさい.",
  },
  {
    word: "対する", reading: "たいする", romaji: ["taisuru"], meaning: "to face; to oppose; to be directed toward; regarding",
    breakdown: [["対", "たい", "opposite; toward; versus"], ["する", "する", "to do; creates the verb form"]],
    memory: "対 is たい. Add する (“to do”): たい + する = たいする.",
  },
  {
    word: "私", reading: "わたし", romaji: ["watashi"], meaning: "I; me; oneself; private",
    breakdown: [["私", "わたし", "I; me; private"]],
    memory: "The everyday Japanese word for “I/me” is わたし (watashi).",
  },
  {
    word: "社会", reading: "しゃかい", romaji: ["shakai", "syakai"], meaning: "society; community; the public",
    breakdown: [["社", "しゃ", "company; shrine; association"], ["会", "かい", "meet; gather; association"]],
    memory: "社 is しゃ and 会 is かい: しゃ + かい = しゃかい.",
  },
  {
    word: "家", reading: "いえ", romaji: ["ie"], meaning: "house; home; family",
    breakdown: [["家", "いえ", "house; home; family"]],
    memory: "The everyday word for your house or home is いえ (ie).",
  },
  {
    word: "必要", reading: "ひつよう", romaji: ["hitsuyou", "hitsuyo", "hitsuyoo"], meaning: "necessary; needed; essential; necessity",
    breakdown: [["必", "ひつ", "certain; inevitable; must"], ["要", "よう", "need; essential; main point"]],
    memory: "必 is ひつ and 要 is よう: ひつ + よう = ひつよう.",
  },
  {
    word: "力", reading: "ちから", romaji: ["chikara", "tikara"], meaning: "power; strength; force; ability",
    breakdown: [["力", "ちから", "power; strength; ability"]],
    memory: "Power and strength are ちから (chikara).",
  },
  {
    word: "立つ", reading: "たつ", romaji: ["tatsu", "tatu"], meaning: "to stand; to rise; to be established",
    breakdown: [["立", "た", "stand; rise; establish"], ["つ", "つ", "verb ending"]],
    memory: "立 gives た and the ending is つ: た + つ = たつ.",
  },
  {
    word: "物", reading: "もの", romaji: ["mono"], meaning: "thing; object; matter; material",
    breakdown: [["物", "もの", "thing; object; matter"]],
    memory: "A thing or object is もの (mono).",
  },
  {
    word: "下さる", reading: "くださる", romaji: ["kudasaru"], meaning: "to give; to bestow; to kindly do for someone (honorific)",
    breakdown: [["下", "くだ", "down; give in this honorific verb"], ["さる", "さる", "honorific verb ending"]],
    memory: "下 gives くだ; add さる: くだ + さる = くださる.",
  },
  {
    word: "関係", reading: "かんけい", romaji: ["kankei"], meaning: "relationship; connection; relation; involvement",
    breakdown: [["関", "かん", "connection; barrier; concern"], ["係", "けい", "connection; relation; person in charge"]],
    memory: "関 is かん and 係 is けい: かん + けい = かんけい.",
  },
  {
    word: "度", reading: "ど", romaji: ["do"], meaning: "degree; extent; occurrence; time counter",
    breakdown: [["度", "ど", "degree; extent; occurrence"]],
    memory: "A degree or occurrence is one short beat: ど (do).",
  },
  {
    word: "意味", reading: "いみ", romaji: ["imi"], meaning: "meaning; significance; sense",
    breakdown: [["意", "い", "thought; intention; meaning"], ["味", "み", "taste; flavor; nuance"]],
    memory: "意 is い and 味 is み: い + み = いみ.",
  },
  {
    word: "当たる", reading: "あたる", romaji: ["ataru"], meaning: "to hit; to strike; to be correct; to win; to correspond",
    breakdown: [["当", "あ", "hit; correct; correspond"], ["たる", "たる", "verb ending"]],
    memory: "当 starts with あ; add たる: あ + たる = あたる.",
  },
];

const BATCH_SIZE = 3;
const RECALLS_PER_WORD = 2;
const TOTAL_BATCHES = Math.ceil(KANJI.length / BATCH_SIZE);

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
const elements = {
  intro: $("#introScreen"), game: $("#gameScreen"), result: $("#resultScreen"),
  start: $("#startButton"), replay: $("#replayButton"), review: $("#reviewButton"),
  deckButton: $("#deckButton"), deckDialog: $("#deckDialog"), deckList: $("#deckList"), closeDeck: $("#closeDeckButton"),
  sound: $("#soundButton"), score: $("#score"), streak: $("#streak"), roundLabel: $("#roundLabel"), progress: $("#progressBar"),
  questionCount: $("#questionCount"), kanji: $("#kanjiPrompt"), jishoLink: $("#jishoLink"), hint: $("#hintButton"), meaning: $("#meaning"),
  studyCard: $("#studyCard"), studyReading: $("#studyReading"), studyMeaning: $("#studyMeaning"), studyBreakdown: $("#studyBreakdown"),
  memoryHook: $("#memoryHook"), studyNext: $("#studyNextButton"), recallForm: $("#recallForm"), readingInput: $("#readingInput"),
  feedback: $("#feedback"), feedbackTitle: $("#feedbackTitle"), feedbackReading: $("#feedbackReading"),
  feedbackMeaning: $("#feedbackMeaning"), feedbackBreakdown: $("#feedbackBreakdown"), next: $("#nextButton"),
  finalScore: $("#finalScore"), accuracy: $("#accuracy"), bestStreak: $("#bestStreak"), hintsUsed: $("#hintsUsed"),
};

const state = {
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
};

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function showScreen(target) {
  screens.forEach((screen) => screen.classList.toggle("active", screen === target));
}

function renderWord(item) {
  state.current = item;
  elements.kanji.textContent = item.word;
  elements.kanji.classList.toggle("long", item.word.length > 1);
  elements.jishoLink.href = `https://jisho.org/search/${encodeURIComponent(item.word)}`;
  elements.jishoLink.setAttribute("aria-label", `Look up ${item.word} on Jisho`);
  elements.kanji.parentElement.classList.remove("swap");
  void elements.kanji.parentElement.offsetWidth;
  elements.kanji.parentElement.classList.add("swap");
}

function startGame() {
  Object.assign(state, {
    mode: "finalRecall", batchIndex: 0, studyIndex: 0, batch: [], queue: shuffle(KANJI), current: null,
    mastery: new Map(KANJI.map((item) => [item.word, 0])), mastered: new Set(), finalMastered: new Set(),
    streak: 0, bestStreak: 0, recalls: 0, reteaches: 0, locked: false,
  });
  elements.progress.style.background = "var(--red)";
  elements.feedback.classList.remove("show");
  showScreen(elements.game);
  nextRecall();
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

function showStudyCard() {
  const item = state.batch[state.studyIndex];
  renderWord(item);
  elements.feedback.classList.remove("show");
  elements.studyCard.classList.remove("hidden");
  elements.recallForm.classList.add("hidden");
  elements.hint.classList.add("hidden");
  elements.meaning.textContent = "";
  elements.roundLabel.textContent = `LEARN ${state.batchIndex + 1}/${TOTAL_BATCHES}`;
  elements.questionCount.textContent = `CARD ${String(state.studyIndex + 1).padStart(2, "0")} / ${String(state.batch.length).padStart(2, "0")}`;
  elements.studyReading.textContent = item.reading;
  elements.studyMeaning.textContent = item.meaning;
  elements.memoryHook.textContent = item.memory;
  buildParts(item, elements.studyBreakdown, "study-part");
  updateStatus();
}

function advanceStudy() {
  if (state.mode !== "study") return;
  state.studyIndex += 1;
  if (state.studyIndex < state.batch.length) showStudyCard();
  else beginBatchRecall();
}

function beginBatchRecall() {
  state.mode = "batchRecall";
  state.queue = shuffle(state.batch);
  nextRecall();
}

function beginFinalRecall() {
  state.mode = "finalRecall";
  state.queue = shuffle(KANJI);
  state.finalMastered = new Set();
  elements.progress.style.background = "var(--red)";
  nextRecall();
}

function remainingBatchRecalls() {
  return state.batch.reduce((total, item) => total + Math.max(0, RECALLS_PER_WORD - state.mastery.get(item.word)), 0);
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
    elements.questionCount.textContent = `${state.finalMastered.size} / ${KANJI.length} PROVED`;
  }
  updateStatus();
  requestAnimationFrame(() => elements.readingInput.focus({ preventScroll: true }));
}

function toHiragana(value) {
  return [...value].map((character) => {
    const code = character.charCodeAt(0);
    return code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : character;
  }).join("");
}

const ROMAJI_TO_HIRAGANA = {
  kya: "きゃ", kyu: "きゅ", kyo: "きょ", gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", sya: "しゃ", syu: "しゅ", syo: "しょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", jya: "じゃ", jyu: "じゅ", jyo: "じょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ", hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ", pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ", rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  sa: "さ", shi: "し", si: "し", su: "す", se: "せ", so: "そ",
  za: "ざ", ji: "じ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ta: "た", chi: "ち", ti: "ち", tsu: "つ", tu: "つ", te: "て", to: "と",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", hu: "ふ", he: "へ", ho: "ほ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を",
};

function romajiToHiragana(value, finalize = false) {
  const source = value.normalize("NFKC").toLowerCase();
  let result = "";
  let index = 0;

  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];

    if (!/[a-z]/.test(current)) {
      result += current;
      index += 1;
      continue;
    }

    if (current === next && /[bcdfghjklmpqrstvwxyz]/.test(current) && current !== "n") {
      result += "っ";
      index += 1;
      continue;
    }

    if (current === "n") {
      if (next === "'") {
        result += "ん";
        index += 2;
        continue;
      }
      if (!next) {
        result += finalize ? "ん" : "n";
        index += 1;
        continue;
      }
      if (!/[aeiouy]/.test(next)) {
        result += "ん";
        index += 1;
        continue;
      }
    }

    let matched = false;
    for (const length of [3, 2, 1]) {
      const syllable = source.slice(index, index + length);
      if (ROMAJI_TO_HIRAGANA[syllable]) {
        result += ROMAJI_TO_HIRAGANA[syllable];
        index += length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += current;
      index += 1;
    }
  }

  return result;
}

function convertReadingInput(event) {
  if (event.isComposing) return;
  const converted = romajiToHiragana(elements.readingInput.value);
  if (converted !== elements.readingInput.value) {
    elements.readingInput.value = converted;
    elements.readingInput.setSelectionRange(converted.length, converted.length);
  }
}

function normalizeAnswer(value) {
  return toHiragana(value.normalize("NFKC").toLowerCase())
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s.'’_-]/g, "");
}

function answerIsCorrect(value, item) {
  const answer = normalizeAnswer(value);
  return answer === normalizeAnswer(item.reading) || item.romaji.some((version) => answer === normalizeAnswer(version));
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
  elements.readingInput.classList.add("input-correct");

  let title;
  if (state.mode === "batchRecall") {
    const level = Math.min(RECALLS_PER_WORD, state.mastery.get(state.current.word) + 1);
    state.mastery.set(state.current.word, level);
    if (level < RECALLS_PER_WORD) state.queue.push(state.current);
    else state.mastered.add(state.current.word);
    title = `RECALLED ${level}/${RECALLS_PER_WORD}`;
  } else {
    state.finalMastered.add(state.current.word);
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
  elements.readingInput.classList.add("input-wrong");

  if (state.mode === "batchRecall") {
    state.mastery.set(state.current.word, 0);
    state.mastered.delete(state.current.word);
  }
  state.queue.push(state.current);
  showFeedback("NOT YET — REBUILD IT", state.current, true);
  updateStatus();
  playTone("wrong");
}

function showFeedback(title, item, includeBreakdown) {
  elements.feedbackTitle.textContent = title;
  elements.feedbackReading.textContent = item.reading;
  elements.feedbackMeaning.textContent = item.meaning;
  elements.feedback.classList.toggle("detailed", includeBreakdown);
  buildParts(item, elements.feedbackBreakdown, "breakdown-item");
  elements.feedbackBreakdown.querySelectorAll(".breakdown-item strong").forEach((node) => node.className = "breakdown-char");
  elements.feedbackBreakdown.querySelectorAll(".breakdown-item span").forEach((node) => node.className = "breakdown-definition");
  elements.next.firstChild.textContent = includeBreakdown ? "STUDY, THEN TRY AGAIN LATER " : "NEXT RECALL ";
  elements.feedback.classList.add("show");
  elements.next.focus({ preventScroll: true });
}

function updateStatus() {
  const completed = state.mode === "finalRecall" ? state.finalMastered.size : state.mastered.size;
  elements.score.textContent = `${completed}/${KANJI.length}`;
  elements.streak.textContent = state.streak;
  elements.progress.style.width = `${(completed / KANJI.length) * 100}%`;
}

function finishGame() {
  elements.finalScore.textContent = `${state.finalMastered.size}/${KANJI.length}`;
  elements.accuracy.textContent = String(state.recalls);
  elements.bestStreak.textContent = `${state.bestStreak}×`;
  elements.hintsUsed.textContent = String(state.reteaches);
  showScreen(elements.result);
  burst();
  playTone("finish");
}

function burst() {
  const colors = ["#f04b2f", "#284fef", "#f2c94c", "#24825f", "#171714"];
  for (let index = 0; index < 38; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${-20 - Math.random() * 180}px`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - .5) * 260}px`);
    piece.style.setProperty("--r", `${(Math.random() - .5) * 900}deg`);
    piece.style.animationDelay = `${Math.random() * 260}ms`;
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 1500);
  }
}

let audioContext;
function playTone(kind) {
  if (!state.sound) return;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;
  audioContext ??= new AudioEngine();
  const notes = kind === "correct" ? [440, 660] : kind === "wrong" ? [180, 135] : [330, 440, 660];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.045, audioContext.currentTime + index * .08);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .1 + index * .08);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + index * .08);
    oscillator.stop(audioContext.currentTime + .11 + index * .08);
  });
}

function populateDeck() {
  elements.deckList.replaceChildren(...KANJI.map((item) => {
    const row = document.createElement("div");
    const hasCharacterBreakdown = item.breakdown.length > 1;
    row.className = `deck-item${hasCharacterBreakdown ? " deck-item-detailed" : ""}`;
    const breakdown = hasCharacterBreakdown
      ? `<span class="deck-breakdown-label">CHARACTER BREAKDOWN</span><span class="deck-breakdown">${item.breakdown.map(([character, reading, definition]) => `<span class="deck-breakdown-part"><b>${character}</b> ${reading}<small>${definition}</small></span>`).join("")}</span>`
      : "";
    row.innerHTML = `<span class="deck-kanji">${item.word}</span><span class="deck-details"><span class="deck-reading">${item.reading}</span><span class="deck-meaning">${item.meaning}</span>${breakdown}</span>`;
    return row;
  }));
}

elements.start.addEventListener("click", startGame);
elements.replay.addEventListener("click", startGame);
elements.studyNext.addEventListener("click", advanceStudy);
elements.readingInput.addEventListener("input", convertReadingInput);
elements.recallForm.addEventListener("submit", checkRecall);
elements.hint.addEventListener("click", reteachCurrent);
elements.next.addEventListener("click", nextRecall);
elements.review.addEventListener("click", () => elements.deckDialog.showModal());
elements.deckButton.addEventListener("click", () => elements.deckDialog.showModal());
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

populateDeck();
