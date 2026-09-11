import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { enrichReferenceGroups, REFERENCE_DICTIONARY_ATTRIBUTION } from "./reference-enrichment.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const songWords = [
  "見下ろす", "青い", "色", "飛び交う", "無数", "感情", "聞こえる", "争い", "song:側", "笑い声",
  "全て", "広がる", "瞬間", "悲しみ", "笑顔", "同時", "数え切れない", "眺める", "人々", "今日",
  "誰", "比べる", "日々", "隠れる", "生きる", "見つける", "溢れる", "変わり", "見上げる", "造る",
  "僕ら", "退屈", "踏み出す", "歩幅", "居場所", "触れ合う", "重なる", "過ごす", "地上", "夜",
  "華やぐ", "不思議", "切ない", "すれ違う", "通る", "通り過ぎる", "素直", "気持ち", "守り続ける", "伝わる",
  "想い", "夜空", "果てない", "闇", "儚い", "夢", "輝く", "見渡す", "次々", "叫ぶ",
  "星", "負ける", "光る", "街", "向ける", "地球", "刻む",
];

const newCards = [
  { word: "見下ろす", readings: ["みおろす"], annotations: [1, 1, 1, 1], meaning: "to overlook; to command a view of; to look down on" },
  { word: "飛び交う", readings: ["とびかう"], annotations: [1, 1, 1, 1], meaning: "to fly about; to flit around; to cross through the air" },
  { word: "無数", readings: ["むすう"], annotations: [1, 2], meaning: "countless; innumerable" },
  { word: "感情", readings: ["かんじょう"], annotations: [2, 3], meaning: "emotion; feeling; sentiment" },
  { word: "争い", readings: ["あらそい"], annotations: [3, 1], meaning: "conflict; dispute; argument; struggle" },
  { studyKey: "song:側", word: "側", readings: ["そば"], annotations: [2], meaning: "side; vicinity; nearby" },
  { word: "笑い声", readings: ["わらいごえ"], annotations: [2, 1, 2], meaning: "laughter; laughing voice" },
  { word: "瞬間", readings: ["しゅんかん"], annotations: [3, 2], meaning: "moment; instant" },
  { word: "悲しみ", readings: ["かなしみ"], annotations: [2, 1, 1], meaning: "sadness; sorrow; grief" },
  { word: "数え切れない", readings: ["かぞえきれない"], annotations: [2, 1, 1, 1, 1, 1], meaning: "countless; too many to count" },
  { word: "眺める", readings: ["ながめる"], annotations: [2, 1, 1], meaning: "to look at; to gaze at; to view" },
  { word: "日々", readings: ["ひび"], annotations: [1, 1], meaning: "daily; every day; days" },
  { word: "隠れる", readings: ["かくれる"], annotations: [2, 1, 1], meaning: "to hide; to be hidden; to disappear" },
  { word: "見つける", readings: ["みつける"], annotations: [1, 1, 1, 1], meaning: "to find; to discover" },
  { word: "溢れる", readings: ["あふれる"], annotations: [2, 1, 1], meaning: "to overflow; to brim over; to be flooded" },
  { word: "変わり", readings: ["かわり"], annotations: [1, 1, 1], meaning: "change; difference; variation" },
  { word: "見上げる", readings: ["みあげる"], annotations: [1, 1, 1, 1], meaning: "to look up at; to admire" },
  { word: "造る", readings: ["つくる"], annotations: [2, 1], meaning: "to make; to create; to manufacture" },
  { word: "僕ら", readings: ["ぼくら"], annotations: [2, 1], meaning: "we; us" },
  { word: "退屈", readings: ["たいくつ"], annotations: [2, 2], meaning: "boredom; tedium; boring" },
  { word: "踏み出す", readings: ["ふみだす"], annotations: [1, 1, 1, 1], meaning: "to step forward; to take a step" },
  { word: "歩幅", readings: ["ほはば"], annotations: [1, 2], meaning: "stride; step length" },
  { word: "居場所", readings: ["いばしょ"], annotations: [1, 1, 2], meaning: "whereabouts; place where one belongs" },
  { word: "触れ合う", readings: ["ふれあう"], annotations: [1, 1, 1, 1], meaning: "to touch each other; to come into contact; to interact" },
  { word: "重なる", readings: ["かさなる"], annotations: [2, 1, 1], meaning: "to overlap; to coincide; to pile up" },
  { word: "過ごす", readings: ["すごす"], annotations: [1, 1, 1], meaning: "to spend time; to pass time" },
  { word: "地上", readings: ["ちじょう"], annotations: [1, 3], meaning: "above ground; on the ground; Earth" },
  { word: "華やぐ", readings: ["はなやぐ"], annotations: [2, 1, 1], meaning: "to become brilliant; to brighten up; to become lively" },
  { word: "切ない", readings: ["せつない"], annotations: [2, 1, 1], meaning: "painful; heartrending; bittersweet" },
  { word: "すれ違う", readings: ["すれちがう"], annotations: [1, 1, 2, 1], meaning: "to pass each other; to miss one another" },
  { word: "通る", readings: ["とおる"], annotations: [2, 1], meaning: "to pass through; to go along; to be understood" },
  { word: "通り過ぎる", readings: ["とおりすぎる"], annotations: [2, 1, 1, 1, 1], meaning: "to pass by; to go past" },
  { word: "素直", readings: ["すなお"], annotations: [1, 2], meaning: "honest; straightforward; obedient" },
  { word: "守り続ける", readings: ["まもりつづける"], annotations: [2, 1, 2, 1, 1], meaning: "to continue protecting; to keep defending" },
  { word: "想い", readings: ["おもい"], annotations: [2, 1], meaning: "thought; feeling; emotion; affection" },
  { word: "夜空", readings: ["よぞら"], annotations: [1, 2], meaning: "night sky" },
  { word: "果てない", readings: ["はてない"], annotations: [1, 1, 1, 1], meaning: "endless; boundless" },
  { word: "闇", readings: ["やみ"], annotations: [2], meaning: "darkness; the dark" },
  { word: "儚い", readings: ["はかない"], annotations: [3, 1], meaning: "fleeting; transient; ephemeral" },
  { word: "夢", readings: ["ゆめ"], annotations: [2], meaning: "dream" },
  { word: "輝く", readings: ["かがやく"], annotations: [3, 1], meaning: "to shine; to sparkle; to glow" },
  { word: "見渡す", readings: ["みわたす"], annotations: [1, 2, 1], meaning: "to look out over; to survey" },
  { word: "叫ぶ", readings: ["さけぶ"], annotations: [2, 1], meaning: "to shout; to cry out" },
  { word: "星", readings: ["ほし"], annotations: [2], meaning: "star" },
  { word: "街", readings: ["まち"], annotations: [2], meaning: "town; city street; neighborhood" },
  { word: "地球", readings: ["ほし", "ちきゅう"], annotations: [], meaning: "Earth; the globe" },
  { word: "刻む", readings: ["きざむ"], annotations: [2, 1], meaning: "to carve; to engrave; to mark time" },
];

const enriched = await enrichReferenceGroups([{
  key: "song-lyrics",
  pages: [{ index: 1, cards: newCards }],
}]);
const imports = enriched[0].pages[0].cards.map(({ readings, annotations, ...card }) => {
  const item = {
    ...card,
    reading: readings.join("、"),
    ...(readings.length > 1 ? { kana: readings } : {}),
  };
  if (item.word === "地球") {
    item.memory = "In this song, 地球 is sung ほし (a poetic ‘world/star’ reading). Its normal dictionary reading is ちきゅう.";
  }
  return item;
});
const names = ["SKY", "WORLD", "PEOPLE", "PATHS", "NIGHT", "DREAMS", "LIGHT"];
const groups = Array.from({ length: Math.ceil(songWords.length / 10) }, (_, index) => {
  const words = songWords.slice(index * 10, index * 10 + 10);
  return {
    key: `song-lyrics-${index + 1}`,
    label: `SORA ${String(index + 1).padStart(2, "0")} · ${names[index]}`,
    words,
  };
});

const output = `// Vocabulary encountered in user-provided song lyrics.\n`
  + `// ${REFERENCE_DICTIONARY_ATTRIBUTION}\n`
  + `export const SONG_LYRIC_GROUPS = ${JSON.stringify(groups, null, 2)};\n\n`
  + `export const SONG_LYRIC_IMPORTS = ${JSON.stringify(imports, null, 2)};\n`;

writeFileSync(join(projectRoot, "song-lyrics-data.js"), output);
console.log(`Generated ${imports.length} new cards across ${groups.length} song decks (${songWords.length} total words).`);
