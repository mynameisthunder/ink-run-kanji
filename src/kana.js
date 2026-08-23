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

function normalizeAnswer(value) {
  return toHiragana(value.normalize("NFKC").toLowerCase())
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s.'’_-]/g, "");
}

function answerIsCorrect(value, item) {
  const answer = normalizeAnswer(value);
  const acceptedKana = item.kana ?? [item.reading];
  return acceptedKana.some((version) => answer === normalizeAnswer(version))
    || item.romaji.some((version) => answer === normalizeAnswer(romajiToHiragana(version, true)));
}

export { answerIsCorrect, normalizeAnswer, romajiToHiragana, toHiragana };
