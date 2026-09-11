import { gunzipSync } from "node:zlib";

import { KANJI } from "../src/vocabulary.js";

const JMDICT_URL = "https://www.edrdg.org/pub/Nihongo/JMdict_e.gz";
const KANJIDIC_URL = "https://www.edrdg.org/pub/Nihongo/kanjidic2.xml.gz";

const KANA = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", ゐ: "wi", ゑ: "we", を: "o", ん: "n", ゔ: "vu",
};
const DIGRAPHS = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho", じゃ: "ja", じゅ: "ju", じょ: "jo",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho", ぢゃ: "ja", ぢゅ: "ju", ぢょ: "jo",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo", りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  いぇ: "ye", うぃ: "wi", うぇ: "we", うぉ: "wo",
  しぇ: "she", じぇ: "je", ちぇ: "che",
  てぃ: "ti", てゅ: "tyu", とぅ: "tu", でぃ: "di", でゅ: "dyu", どぅ: "du",
  ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo", ふゅ: "fyu",
  ゔぁ: "va", ゔぃ: "vi", ゔぇ: "ve", ゔぉ: "vo", ゔゅ: "vyu",
};
const SMALL_VOWELS = { ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o" };
const XML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const SPECIAL_CHARACTER_MEANINGS = new Map([
  ["々", "iteration mark; repeats the previous kanji"],
]);

function toHiragana(value) {
  return [...value].map((character) => {
    const code = character.charCodeAt(0);
    return code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : character;
  }).join("");
}

function romanize(reading) {
  const source = toHiragana(reading);
  let result = "";
  let doubled = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === "っ") {
      doubled = true;
      continue;
    }
    if (character === "ー") {
      const vowel = result.match(/[aeiou]$/)?.[0];
      if (vowel) result += vowel;
      continue;
    }
    if (character === "ん") {
      result += /^[あいうえおやゆよ]/.test(source[index + 1] ?? "") ? "n'" : "n";
      continue;
    }

    const pair = source.slice(index, index + 2);
    let syllable = DIGRAPHS[pair];
    if (syllable) index += 1;
    else syllable = KANA[character] ?? SMALL_VOWELS[character] ?? character;
    if (doubled && /^[a-z]/.test(syllable)) {
      syllable = `${syllable[0]}${syllable}`;
      doubled = false;
    }
    result += syllable;
  }
  return result.replace(/[^a-z0-9'-]/gi, "");
}

function decodeXml(value) {
  return value.replace(/&#x([0-9a-f]+);|&#([0-9]+);|&(amp|lt|gt|quot|apos);/gi, (_, hex, decimal, named) => {
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
    return XML_ENTITIES[named.toLowerCase()];
  });
}

function valuesFor(xml, tag) {
  const expression = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "g");
  return [...xml.matchAll(expression)].map((match) => decodeXml(match[1].trim()));
}

async function fetchGzipText(url) {
  const response = await fetch(url, { headers: { "User-Agent": "ink-run-kanji-data-generator/1.0" } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return gunzipSync(Buffer.from(await response.arrayBuffer())).toString("utf8");
}

function buildDictionaryIndex(xml, targetWords) {
  const index = new Map();
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entryXml = match[1];
    const writtenForms = valuesFor(entryXml, "keb");
    const readingForms = [...entryXml.matchAll(/<r_ele>([\s\S]*?)<\/r_ele>/g)].map((readingMatch) => ({
      reading: valuesFor(readingMatch[1], "reb")[0],
      restrictions: valuesFor(readingMatch[1], "re_restr"),
    }));
    const matchedForms = [...writtenForms, ...readingForms.map(({ reading }) => reading)].filter((form) => targetWords.has(form));
    if (!matchedForms.length) continue;

    const senses = [...entryXml.matchAll(/<sense>([\s\S]*?)<\/sense>/g)].map((senseMatch) => {
      const senseXml = senseMatch[1];
      return {
        writtenRestrictions: valuesFor(senseXml, "stagk"),
        readingRestrictions: valuesFor(senseXml, "stagr"),
        glosses: [...senseXml.matchAll(/<gloss(?:\s+([^>]*))?>([\s\S]*?)<\/gloss>/g)]
          .filter((glossMatch) => !glossMatch[1] || /xml:lang=["']eng["']/.test(glossMatch[1]))
          .map((glossMatch) => decodeXml(glossMatch[2].trim())),
      };
    });
    const entry = { writtenForms, readingForms, senses };
    [...new Set(matchedForms)].forEach((form) => {
      const entries = index.get(form) ?? [];
      entries.push(entry);
      index.set(form, entries);
    });
  }
  return index;
}

function definitionsFor(card, dictionaryIndex) {
  const candidates = dictionaryIndex.get(card.word) ?? [];
  const exact = candidates.filter((entry) => entry.readingForms.some(({ reading, restrictions }) => (
    card.readings.includes(reading) && (!restrictions.length || restrictions.includes(card.word))
  )));
  const entries = exact.length ? exact : candidates;
  const glosses = entries.flatMap((entry) => entry.senses
    .filter((sense) => (!sense.writtenRestrictions.length || sense.writtenRestrictions.includes(card.word))
      && (!sense.readingRestrictions.length || sense.readingRestrictions.some((reading) => card.readings.includes(reading))))
    .flatMap((sense) => sense.glosses));
  return [...new Set(glosses)].slice(0, 6);
}

function buildKanjiMeaningIndex(xml, targetKanji) {
  const meanings = new Map();
  for (const match of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const characterXml = match[1];
    const literal = valuesFor(characterXml, "literal")[0];
    if (!targetKanji.has(literal)) continue;
    const english = [...characterXml.matchAll(/<meaning(?:\s+([^>]*))?>([\s\S]*?)<\/meaning>/g)]
      .filter((meaningMatch) => !meaningMatch[1] || /m_lang=["']en["']/.test(meaningMatch[1]))
      .map((meaningMatch) => decodeXml(meaningMatch[2].trim()));
    meanings.set(literal, [...new Set(english)].slice(0, 4).join("; "));
  }
  return meanings;
}

function buildBreakdown(card, meaning, kanjiMeanings) {
  const characters = [...card.word];
  const readingCharacters = [...card.readings[0]];
  const lengths = card.annotations;
  const irregular = lengths.length !== characters.length
    || lengths.reduce((sum, length) => sum + length, 0) !== readingCharacters.length
    || characters.some((character, index) => /\p{Script=Han}/u.test(character) && lengths[index] === 0);
  if (irregular) return [[card.word, card.readings[0], meaning.split(";")[0]]];

  let offset = 0;
  const parts = characters.map((character, index) => {
    const partReading = readingCharacters.slice(offset, offset + lengths[index]).join("");
    offset += lengths[index];
    const isKanji = /\p{Script=Han}/u.test(character);
    return [character, partReading, isKanji ? kanjiMeanings.get(character) ?? SPECIAL_CHARACTER_MEANINGS.get(character) : "kana", isKanji];
  });
  return parts.reduce((grouped, [character, partReading, definition, isKanji]) => {
    const previous = grouped.at(-1);
    if (!isKanji && previous?.[3] === false) {
      previous[0] += character;
      previous[1] += partReading;
    } else {
      grouped.push([character, partReading, definition, isKanji]);
    }
    return grouped;
  }, []).map(([character, partReading, definition]) => [character, partReading, definition]);
}

function memoryFor(card, breakdown, meaning) {
  const reading = card.readings[0];
  const definition = meaning.split(";")[0];
  if (breakdown.length === 1 && breakdown[0][0] === card.word) {
    return `Connect ${card.word} (${definition}) directly to ${reading}.`;
  }
  const pieces = breakdown.map(([character, partReading, partMeaning]) => `${character} (${partMeaning}) as ${partReading}`).join(" + ");
  return `${pieces}. Together: ${reading} — ${definition}.`;
}

const existingCards = new Map(KANJI.map((item) => [item.word, item]));

export async function enrichReferenceGroups(groups) {
  const cards = groups.flatMap((group) => group.pages.flatMap((page) => page.cards));
  const targetWords = new Set(cards.map((card) => card.word));
  const targetKanji = new Set(cards.flatMap((card) => [...card.word].filter((character) => /\p{Script=Han}/u.test(character))));

  console.log(`Downloading JMdict and KANJIDIC2 for ${targetWords.size} words and ${targetKanji.size} kanji...`);
  const [dictionaryXml, kanjiXml] = await Promise.all([fetchGzipText(JMDICT_URL), fetchGzipText(KANJIDIC_URL)]);
  const dictionaryIndex = buildDictionaryIndex(dictionaryXml, targetWords);
  const kanjiMeanings = buildKanjiMeaningIndex(kanjiXml, targetKanji);
  const missingDefinitions = new Set();
  const missingKanjiMeanings = new Set([...targetKanji]
    .filter((character) => !kanjiMeanings.has(character) && !SPECIAL_CHARACTER_MEANINGS.has(character)));

  const enrichedGroups = groups.map((group) => ({
    ...group,
    pages: group.pages.map((page) => ({
      ...page,
      cards: page.cards.map((card) => {
        const dictionaryMeanings = definitionsFor(card, dictionaryIndex);
        const fallback = card.meaning ?? existingCards.get(card.word)?.meaning;
        const meaning = dictionaryMeanings.join("; ") || fallback || "";
        if (!meaning) missingDefinitions.add(`${card.word} (${card.readings.join(" / ")})`);
        const breakdown = buildBreakdown(card, meaning, kanjiMeanings);
        return {
          ...card,
          romaji: card.readings.map(romanize),
          meaning,
          breakdown,
          memory: memoryFor(card, breakdown, meaning),
        };
      }),
    })),
  }));

  if (missingDefinitions.size || missingKanjiMeanings.size) {
    const messages = [];
    if (missingDefinitions.size) messages.push(`Missing definitions: ${[...missingDefinitions].join(", ")}`);
    if (missingKanjiMeanings.size) messages.push(`Missing kanji meanings: ${[...missingKanjiMeanings].join(", ")}`);
    throw new Error(messages.join("\n"));
  }
  return enrichedGroups;
}

export const REFERENCE_DICTIONARY_ATTRIBUTION = "Definitions: JMdict. Character meanings: KANJIDIC2. Electronic Dictionary Research and Development Group, CC BY-SA 4.0.";
