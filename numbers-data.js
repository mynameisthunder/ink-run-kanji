// RealKana number and counter combinations, organized by the thing being counted.
(() => {
  const numerals = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  const values = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  const counterGroup = (key, label, counter, counterMeaning, readings, prefixReadings, meaning) => ({
    key,
    label,
    words: readings.map((reading, index) => ({
      word: `${numerals[index]}${counter}`,
      reading,
      meaning: meaning(index + 1),
      breakdown: [
        [numerals[index], prefixReadings[index], values[index]],
        [counter, reading.slice(prefixReadings[index].length), counterMeaning],
      ],
    })),
  });

  const groups = [
    counterGroup(
      "general",
      "つ · GENERAL",
      "つ",
      "general counter",
      ["ひとつ", "ふたつ", "みっつ", "よっつ", "いつつ", "むっつ", "ななつ", "やっつ", "ここのつ"],
      ["ひと", "ふた", "みっ", "よっ", "いつ", "むっ", "なな", "やっ", "ここの"],
      (number) => `${number} ${number === 1 ? "thing" : "things"}; general counter`,
    ),
    counterGroup(
      "small-objects",
      "個 · SMALL OBJECTS",
      "個",
      "small-item counter",
      ["いっこ", "にこ", "さんこ", "よんこ", "ごこ", "ろっこ", "ななこ", "はっこ", "きゅうこ", "じゅっこ"],
      ["いっ", "に", "さん", "よん", "ご", "ろっ", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number} small ${number === 1 ? "object" : "objects"}; ${number} ${number === 1 ? "item" : "items"}`,
    ),
    counterGroup(
      "long-objects",
      "本 · LONG OBJECTS",
      "本",
      "long-object counter",
      ["いっぽん", "にほん", "さんぼん", "よんほん", "ごほん", "ろっぽん", "ななほん", "はっぽん", "きゅうほん", "じゅっぽん"],
      ["いっ", "に", "さん", "よん", "ご", "ろっ", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number} long or cylindrical ${number === 1 ? "object" : "objects"}`,
    ),
    counterGroup(
      "flat-objects",
      "枚 · FLAT OBJECTS",
      "枚",
      "flat-object counter",
      ["いちまい", "にまい", "さんまい", "よんまい", "ごまい", "ろくまい", "ななまい", "はちまい", "きゅうまい", "じゅうまい"],
      ["いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"],
      (number) => `${number} flat ${number === 1 ? "object" : "objects"}; ${number} ${number === 1 ? "sheet" : "sheets"}`,
    ),
    counterGroup(
      "people",
      "人 · PEOPLE",
      "人",
      "person counter",
      ["ひとり", "ふたり", "さんにん", "よにん", "ごにん", "ろくにん", "ななにん", "はちにん", "きゅうにん", "じゅうにん"],
      ["ひと", "ふた", "さん", "よ", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"],
      (number) => `${number} ${number === 1 ? "person" : "people"}`,
    ),
    counterGroup(
      "age",
      "歳 · AGE",
      "歳",
      "years-of-age counter",
      ["いっさい", "にさい", "さんさい", "よんさい", "ごさい", "ろくさい", "ななさい", "はっさい", "きゅうさい", "じゅっさい"],
      ["いっ", "に", "さん", "よん", "ご", "ろく", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number} ${number === 1 ? "year" : "years"} old`,
    ),
    counterGroup(
      "floors",
      "階 · FLOORS",
      "階",
      "floor counter",
      ["いっかい", "にかい", "さんがい", "よんかい", "ごかい", "ろっかい", "ななかい", "はっかい", "きゅうかい", "じゅっかい"],
      ["いっ", "に", "さん", "よん", "ご", "ろっ", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number}${number === 1 ? "st" : number === 2 ? "nd" : number === 3 ? "rd" : "th"} floor; floor ${number}`,
    ),
    counterGroup(
      "books",
      "冊 · BOOKS",
      "冊",
      "bound-volume counter",
      ["いっさつ", "にさつ", "さんさつ", "よんさつ", "ごさつ", "ろくさつ", "ななさつ", "はっさつ", "きゅうさつ", "じゅっさつ"],
      ["いっ", "に", "さん", "よん", "ご", "ろく", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number} ${number === 1 ? "book" : "books"}; ${number} bound ${number === 1 ? "volume" : "volumes"}`,
    ),
    counterGroup(
      "cups",
      "杯 · CUPS",
      "杯",
      "cupful counter",
      ["いっぱい", "にはい", "さんばい", "よんはい", "ごはい", "ろっぱい", "ななはい", "はっぱい", "きゅうはい", "じゅっぱい"],
      ["いっ", "に", "さん", "よん", "ご", "ろっ", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number} ${number === 1 ? "cup or glass" : "cups or glasses"}`,
    ),
    counterGroup(
      "occurrences",
      "回 · OCCURRENCES",
      "回",
      "occurrence counter",
      ["いっかい", "にかい", "さんかい", "よんかい", "ごかい", "ろっかい", "ななかい", "はっかい", "きゅうかい", "じゅっかい"],
      ["いっ", "に", "さん", "よん", "ご", "ろっ", "なな", "はっ", "きゅう", "じゅっ"],
      (number) => `${number} ${number === 1 ? "time" : "times"}; ${number} ${number === 1 ? "occurrence" : "occurrences"}`,
    ),
  ];

  const numberDefinitions = { 一: "one", 二: "two", 三: "three", 四: "four", 五: "five", 六: "six", 七: "seven", 八: "eight", 九: "nine", 十: "ten" };
  const compoundParts = (parts, counter, counterReading, counterMeaning) => [
    ...parts.map(([character, reading]) => [character, reading, numberDefinitions[character]]),
    [counter, counterReading, counterMeaning],
  ];

  groups.push({
    key: "minutes",
    label: "分 · MINUTES",
    words: [
      ["一分", "いっぷん", [["一", "いっ"]], "ぷん", "1 minute"],
      ["二分", "にふん", [["二", "に"]], "ふん", "2 minutes"],
      ["三分", "さんぷん", [["三", "さん"]], "ぷん", "3 minutes"],
      ["四分", "よんぷん", [["四", "よん"]], "ぷん", "4 minutes"],
      ["五分", "ごふん", [["五", "ご"]], "ふん", "5 minutes"],
      ["六分", "ろっぷん", [["六", "ろっ"]], "ぷん", "6 minutes"],
      ["七分", "ななふん", [["七", "なな"]], "ふん", "7 minutes"],
      ["八分", "はっぷん", [["八", "はっ"]], "ぷん", "8 minutes"],
      ["九分", "きゅうふん", [["九", "きゅう"]], "ふん", "9 minutes"],
      ["十分", "じゅっぷん", [["十", "じゅっ"]], "ぷん", "10 minutes"],
      ["二十分", "にじゅっぷん", [["二", "に"], ["十", "じゅっ"]], "ぷん", "20 minutes"],
      ["三十分", "さんじゅっぷん", [["三", "さん"], ["十", "じゅっ"]], "ぷん", "30 minutes"],
      ["四十分", "よんじゅっぷん", [["四", "よん"], ["十", "じゅっ"]], "ぷん", "40 minutes"],
      ["五十分", "ごじゅっぷん", [["五", "ご"], ["十", "じゅっ"]], "ぷん", "50 minutes"],
    ].map(([word, reading, parts, suffix, meaning]) => ({ word, reading, meaning, breakdown: compoundParts(parts, "分", suffix, "minute counter") })),
  });

  groups.push({
    key: "hours",
    label: "時 · HOURS",
    words: [
      ["一時", "いちじ", [["一", "いち"]], "1 o'clock"], ["二時", "にじ", [["二", "に"]], "2 o'clock"],
      ["三時", "さんじ", [["三", "さん"]], "3 o'clock"], ["四時", "よじ", [["四", "よ"]], "4 o'clock"],
      ["五時", "ごじ", [["五", "ご"]], "5 o'clock"], ["六時", "ろくじ", [["六", "ろく"]], "6 o'clock"],
      ["七時", "しちじ", [["七", "しち"]], "7 o'clock"], ["八時", "はちじ", [["八", "はち"]], "8 o'clock"],
      ["九時", "くじ", [["九", "く"]], "9 o'clock"], ["十時", "じゅうじ", [["十", "じゅう"]], "10 o'clock"],
      ["十一時", "じゅういちじ", [["十", "じゅう"], ["一", "いち"]], "11 o'clock"],
      ["十二時", "じゅうにじ", [["十", "じゅう"], ["二", "に"]], "12 o'clock"],
    ].map(([word, reading, parts, meaning]) => ({ word, reading, meaning, breakdown: compoundParts(parts, "時", "じ", "hour; o'clock") })),
  });

  groups.push({
    key: "calendar-days",
    label: "日 · CALENDAR DAYS",
    words: [
      ["一日", "ついたち", [["一", "つい"], ["日", "たち", "first day; day"]], "first day of the month"],
      ["二日", "ふつか", [["二", "ふつ"], ["日", "か", "day"]], "second day of the month; two days"],
      ["三日", "みっか", [["三", "みっ"], ["日", "か", "day"]], "third day of the month; three days"],
      ["四日", "よっか", [["四", "よっ"], ["日", "か", "day"]], "fourth day of the month; four days"],
      ["五日", "いつか", [["五", "いつ"], ["日", "か", "day"]], "fifth day of the month; five days"],
      ["六日", "むいか", [["六", "むい"], ["日", "か", "day"]], "sixth day of the month; six days"],
      ["七日", "なのか", [["七", "なの"], ["日", "か", "day"]], "seventh day of the month; seven days"],
      ["八日", "ようか", [["八", "よう"], ["日", "か", "day"]], "eighth day of the month; eight days"],
      ["九日", "ここのか", [["九", "ここの"], ["日", "か", "day"]], "ninth day of the month; nine days"],
      ["十日", "とおか", [["十", "とお"], ["日", "か", "day"]], "tenth day of the month; ten days"],
      ["十四日", "じゅうよっか", [["十", "じゅう"], ["四", "よっ"], ["日", "か", "day"]], "fourteenth day of the month; fourteen days"],
      ["二十日", "はつか", [["二", "はつ"], ["十", ""], ["日", "か", "day"]], "twentieth day of the month; twenty days"],
      ["二十四日", "にじゅうよっか", [["二", "に"], ["十", "じゅう"], ["四", "よっ"], ["日", "か", "day"]], "twenty-fourth day of the month; twenty-four days"],
    ].map(([word, reading, parts, meaning]) => ({
      word, reading, meaning,
      breakdown: parts.map(([character, partReading, definition]) => [character, partReading, definition ?? numberDefinitions[character]]),
    })),
  });

  const months = [
    ["一月", "いちがつ", "January", "いち"], ["二月", "にがつ", "February", "に"],
    ["三月", "さんがつ", "March", "さん"], ["四月", "しがつ", "April", "し"],
    ["五月", "ごがつ", "May", "ご"], ["六月", "ろくがつ", "June", "ろく"],
    ["七月", "しちがつ", "July", "しち"], ["八月", "はちがつ", "August", "はち"],
    ["九月", "くがつ", "September", "く"], ["十月", "じゅうがつ", "October", "じゅう"],
    ["十一月", "じゅういちがつ", "November", null], ["十二月", "じゅうにがつ", "December", null],
  ];
  groups.push({
    key: "months",
    label: "月 · MONTHS",
    words: months.map(([word, reading, meaning, prefix]) => {
      let parts;
      if (word === "十一月") parts = [["十", "じゅう", "ten"], ["一", "いち", "one"]];
      else if (word === "十二月") parts = [["十", "じゅう", "ten"], ["二", "に", "two"]];
      else parts = [[word[0], prefix, numberDefinitions[word[0]]]];
      return { word, reading, meaning, breakdown: [...parts, ["月", "がつ", "month"]] };
    }),
  });

  groups.find((group) => group.key === "general").words.push({
    word: "十",
    reading: "とお",
    meaning: "ten things; general count",
    breakdown: [["十", "とお", "ten"]],
  });
  groups.find((group) => group.key === "age").words.push({
    word: "二十歳",
    reading: "はたち",
    meaning: "20 years old",
    breakdown: [["二", "は", "two"], ["十", "た", "ten"], ["歳", "ち", "years of age; special reading"]],
  });

  const kanaMap = { あ: "a", い: "i", う: "u", え: "e", お: "o", か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko", が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go", さ: "sa", し: "shi", す: "su", せ: "se", そ: "so", ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo", た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to", だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do", な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no", は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo", ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po", ま: "ma", み: "mi", む: "mu", め: "me", も: "mo", や: "ya", ゆ: "yu", よ: "yo", ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro", わ: "wa", を: "o", ん: "n" };
  const digraphs = { きゃ: "kya", きゅ: "kyu", きょ: "kyo", しゃ: "sha", しゅ: "shu", しょ: "sho", ちゃ: "cha", ちゅ: "chu", ちょ: "cho", にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo", みゃ: "mya", みゅ: "myu", みょ: "myo", りゃ: "rya", りゅ: "ryu", りょ: "ryo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo", じゃ: "ja", じゅ: "ju", じょ: "jo", びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo" };
  const romanize = (reading) => {
    let result = "";
    let doubled = false;
    for (let index = 0; index < reading.length; index += 1) {
      if (reading[index] === "っ") { doubled = true; continue; }
      const pair = reading.slice(index, index + 2);
      let syllable = digraphs[pair];
      if (syllable) index += 1;
      else syllable = kanaMap[reading[index]] ?? reading[index];
      if (doubled) { syllable = `${syllable[0]}${syllable}`; doubled = false; }
      result += syllable;
    }
    return result;
  };

  groups.forEach((group) => group.words.forEach((item, index) => {
    item.audioSrc = `audio/numbers/${group.key}-${String(index + 1).padStart(2, "0")}.wav`;
  }));

  // Keep genuinely exceptional readings in the app. Routine counter variations
  // are represented once and covered by the linked counter guide.
  const specialIndexes = {
    general: "all",
    people: [0, 1],
    age: [0, 10],
    floors: [0, 2],
    hours: [0, 3, 6, 8],
    "calendar-days": "all",
    months: [0, 3, 6, 8],
  };
  groups.forEach((group) => {
    const indexes = specialIndexes[group.key];
    if (indexes === "all") return;
    group.words = Array.isArray(indexes)
      ? indexes.map((index) => group.words[index])
      : group.words.slice(0, 1);
  });

  groups.forEach((group) => group.words.forEach((item, index) => {
    item.romaji = [romanize(item.reading)];
    item.memory = `${item.breakdown.map(([character, part]) => `${character} is ${part || "part of the special reading"}`).join(" and ")}: ${item.reading}.`;
  }));

  window.INK_RUN_NUMBER_GROUPS = groups.map(({ key, label, words }) => ({ key, label, words: words.map((item) => item.word) }));
  window.INK_RUN_NUMBER_WORDS = groups.flatMap((group) => group.words.map((item) => item.word));
  window.INK_RUN_NUMBER_IMPORTS = groups.flatMap((group) => group.words);
})();
