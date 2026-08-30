const PREFERRED_JAPANESE_VOICES = [
  /\bkyoko\b/i,
  /\botoya\b/i,
  /google.*(?:日本語|japanese)/i,
  /microsoft.*(?:nanami|haruka|ayumi)/i,
  /siri.*(?:日本語|japanese)/i,
];

const NOVELTY_JAPANESE_VOICES = /^(?:eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)(?:\s|$)/i;

export function pickJapaneseVoice(voices) {
  const japaneseVoices = voices.filter((voice) => /^ja(?:-|_)/i.test(voice.lang));
  for (const preferred of PREFERRED_JAPANESE_VOICES) {
    const match = japaneseVoices.find((voice) => preferred.test(`${voice.name} ${voice.voiceURI ?? ""}`));
    if (match) return match;
  }
  return japaneseVoices.find((voice) => !NOVELTY_JAPANESE_VOICES.test(voice.name)) ?? japaneseVoices[0];
}

export function createAudio({ KANJI, BUNDLED_AUDIO_ITEMS, isSoundEnabled }) {
  let pronunciationAudio;
  let activePronounceButton;
  let audioContext;

  function speakWithBrowserVoice(reading, button) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    const utterance = new SpeechSynthesisUtterance(reading);
    const japaneseVoice = pickJapaneseVoice(window.speechSynthesis.getVoices());
    utterance.lang = "ja-JP";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    if (japaneseVoice) utterance.voice = japaneseVoice;
    utterance.addEventListener("start", () => button.classList.add("speaking"));
    utterance.addEventListener("end", () => button.classList.remove("speaking"));
    utterance.addEventListener("error", () => button.classList.remove("speaking"));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function pronounceItem(item, button) {
    if (!item) return;
    const reading = (item.kana ?? [item.reading])[0];
    pronunciationAudio?.pause();
    activePronounceButton?.classList.remove("speaking");
    activePronounceButton = button;
    if (!item.audioSrc && !BUNDLED_AUDIO_ITEMS.has(item)) {
      pronunciationAudio = null;
      speakWithBrowserVoice(reading, button);
      return;
    }
    const audioNumber = KANJI.indexOf(item) + 41;
    pronunciationAudio = new Audio(item.audioSrc ?? `audio/${audioNumber}.wav`);
    pronunciationAudio.addEventListener("play", () => button.classList.add("speaking"));
    pronunciationAudio.addEventListener("ended", () => button.classList.remove("speaking"));
    pronunciationAudio.addEventListener("error", () => {
      button.classList.remove("speaking");
      speakWithBrowserVoice(reading, button);
    }, { once: true });
    pronunciationAudio.play().catch(() => speakWithBrowserVoice(reading, button));
  }

  function playTone(kind) {
    if (!isSoundEnabled()) return;
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

  function cancelPronunciation() {
    pronunciationAudio?.pause();
    pronunciationAudio = null;
    activePronounceButton?.classList.remove("speaking");
    activePronounceButton = null;
    window.speechSynthesis?.cancel();
  }

  return { cancelPronunciation, playTone, pronounceItem };
}
