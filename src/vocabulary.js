import { FREQUENCY_2_IMPORTS, FREQUENCY_2_WORDS } from "../frequency2-data.js";
import { LEVEL_2_IMPORTS, LEVEL_2_WORDS } from "../level2-data.js";
import { N5_IMPORTS as REAL_KANA_N5_IMPORTS, N5_WORDS as REAL_KANA_N5_WORDS } from "../n5-data.js";
import { NUMBER_GROUPS, NUMBER_IMPORTS, NUMBER_WORDS } from "../numbers-data.js";

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
  {
    word: "同じ", reading: "おなじ", romaji: ["onaji"], meaning: "same; identical; equal",
    breakdown: [["同", "おな", "same; identical"], ["じ", "じ", "adjectival ending"]],
    memory: "同 gives おな; add じ: おな + じ = おなじ.",
  },
  {
    word: "十", reading: "じゅう", romaji: ["juu", "ju", "jyu", "jyuu"], meaning: "ten",
    breakdown: [["十", "じゅう", "ten"]],
    memory: "The number ten is じゅう (juu).",
  },
  {
    word: "成る", reading: "なる", romaji: ["naru"], meaning: "to become; to result in; to consist of",
    breakdown: [["成", "な", "become; accomplish"], ["る", "る", "verb ending"]],
    memory: "成 gives な; add る: な + る = なる.",
  },
  {
    word: "開発", reading: "かいはつ", romaji: ["kaihatsu"], meaning: "development; exploitation; opening up",
    breakdown: [["開", "かい", "open; unfold; develop"], ["発", "はつ", "departure; emit; start"]],
    memory: "開 is かい and 発 is はつ: かい + はつ = かいはつ.",
  },
  {
    word: "長い", reading: "ながい", romaji: ["nagai"], meaning: "long; lengthy; lasting",
    breakdown: [["長", "なが", "long; leader"], ["い", "い", "adjective ending"]],
    memory: "長 gives なが; add い: なが + い = ながい.",
  },
  {
    word: "金", reading: "かね", romaji: ["kane"], meaning: "money; metal; gold",
    breakdown: [["金", "かね", "money; metal; gold"]],
    memory: "Money or metal is かね (kane).",
  },
  {
    word: "時代", reading: "じだい", romaji: ["jidai", "zidai"], meaning: "era; period; age; generation",
    breakdown: [["時", "じ", "time; hour"], ["代", "だい", "era; generation; substitute"]],
    memory: "時 is じ and 代 is だい: じ + だい = じだい.",
  },
  {
    word: "作る", reading: "つくる", romaji: ["tsukuru", "tukuru"], meaning: "to make; to create; to produce",
    breakdown: [["作", "つく", "make; create; produce"], ["る", "る", "verb ending"]],
    memory: "作 gives つく; add る: つく + る = つくる.",
  },
  {
    word: "彼女", reading: "かのじょ", romaji: ["kanojo"], meaning: "she; her; girlfriend",
    breakdown: [["彼", "かの", "he; that person"], ["女", "じょ", "woman; female"]],
    memory: "彼 is かの here and 女 is じょ: かの + じょ = かのじょ.",
  },
  {
    word: "心", reading: "こころ", romaji: ["kokoro"], meaning: "heart; mind; spirit; feelings",
    breakdown: [["心", "こころ", "heart; mind; spirit"]],
    memory: "Heart and mind are both こころ (kokoro).",
  },
  {
    word: "彼", reading: "かれ", romaji: ["kare"], meaning: "he; him; boyfriend",
    breakdown: [["彼", "かれ", "he; him; boyfriend"]],
    memory: "He or him is かれ (kare).",
  },
  {
    word: "文化", reading: "ぶんか", romaji: ["bunka"], meaning: "culture; civilization",
    breakdown: [["文", "ぶん", "writing; sentence; culture"], ["化", "か", "change; transform"]],
    memory: "文 is ぶん and 化 is か: ぶん + か = ぶんか.",
  },
  {
    word: "何", reading: "なに・なん", kana: ["なに", "なん"], romaji: ["nani", "nan"], meaning: "what; which; how many",
    breakdown: [["何", "なに・なん", "what; which"]],
    memory: "何 can be read なに or なん depending on what follows.",
  },
  {
    word: "月", reading: "つき", romaji: ["tsuki", "tuki"], meaning: "moon; month",
    breakdown: [["月", "つき", "moon; month"]],
    memory: "The moon or a month is つき (tsuki).",
  },
  {
    word: "高い", reading: "たかい", romaji: ["takai"], meaning: "high; tall; expensive",
    breakdown: [["高", "たか", "high; tall; expensive"], ["い", "い", "adjective ending"]],
    memory: "高 gives たか; add い: たか + い = たかい.",
  },
  {
    word: "書く", reading: "かく", romaji: ["kaku"], meaning: "to write; to compose; to draw",
    breakdown: [["書", "か", "write; book"], ["く", "く", "verb ending"]],
    memory: "書 gives か; add く: か + く = かく.",
  },
  {
    word: "取る", reading: "とる", romaji: ["toru"], meaning: "to take; to get; to remove; to obtain",
    breakdown: [["取", "と", "take; get; obtain"], ["る", "る", "verb ending"]],
    memory: "取 gives と; add る: と + る = とる.",
  },
  {
    word: "内", reading: "うち", romaji: ["uchi", "uti"], meaning: "inside; within; among; home",
    breakdown: [["内", "うち", "inside; within; home"]],
    memory: "Inside or home is うち (uchi).",
  },
  {
    word: "現在", reading: "げんざい", romaji: ["genzai"], meaning: "the present; current; currently; now",
    breakdown: [["現", "げん", "present; actual; appear"], ["在", "ざい", "exist; be located"]],
    memory: "現 is げん and 在 is ざい: げん + ざい = げんざい.",
  },
  {
    word: "通り", reading: "とおり", romaji: ["toori", "tori"], meaning: "way; street; passage; as; in accordance with",
    breakdown: [["通", "とお", "pass through; way; commute"], ["り", "り", "noun ending"]],
    memory: "通 gives とお; add り: とお + り = とおり.",
  },
  {
    word: "説明", reading: "せつめい", romaji: ["setsumei"], meaning: "explanation; description; exposition",
    breakdown: [["説", "せつ", "explain; theory"], ["明", "めい", "bright; clear"]],
    memory: "説 is せつ and 明 is めい: せつ + めい = せつめい.",
  },
  {
    word: "考える", reading: "かんがえる", romaji: ["kangaeru"], meaning: "to think; to consider; to reflect on",
    breakdown: [["考", "かんが", "think; consider"], ["える", "える", "verb ending"]],
    memory: "考 gives かんが; add える: かんが + える = かんがえる.",
  },
  {
    word: "知る", reading: "しる", romaji: ["shiru", "siru"], meaning: "to know; to understand; to learn",
    breakdown: [["知", "し", "know; wisdom"], ["る", "る", "verb ending"]],
    memory: "知 gives し; add る: し + る = しる.",
  },
  {
    word: "話", reading: "はなし", romaji: ["hanashi"], meaning: "talk; story; conversation; speech",
    breakdown: [["話", "はなし", "talk; story; conversation"]],
    memory: "A talk, story, or conversation is はなし (hanashi).",
  },
  {
    word: "所", reading: "ところ", romaji: ["tokoro"], meaning: "place; spot; point; part",
    breakdown: [["所", "ところ", "place; point; part"]],
    memory: "A place or point is ところ (tokoro).",
  },
  {
    word: "小", reading: "しょう", romaji: ["shou", "sho", "syou"], meaning: "small; little; minor",
    breakdown: [["小", "しょう", "small; little; minor"]],
    memory: "The on-reading for small is しょう (shou).",
  },
  {
    word: "主義", reading: "しゅぎ", romaji: ["shugi", "syugi"], meaning: "principle; doctrine; ideology",
    breakdown: [["主", "しゅ", "main; master; principal"], ["義", "ぎ", "justice; principle; meaning"]],
    memory: "主 is しゅ and 義 is ぎ: しゅ + ぎ = しゅぎ.",
  },
  {
    word: "持つ", reading: "もつ", romaji: ["motsu", "motu"], meaning: "to hold; to have; to carry; to possess",
    breakdown: [["持", "も", "hold; have; possess"], ["つ", "つ", "verb ending"]],
    memory: "持 gives も; add つ: も + つ = もつ.",
  },
  {
    word: "来る", reading: "くる", romaji: ["kuru"], meaning: "to come; to arrive; to approach",
    breakdown: [["来", "く", "come; arrive"], ["る", "る", "verb ending"]],
    memory: "来 gives く here; add る: く + る = くる.",
  },
  {
    word: "感じる", reading: "かんじる", romaji: ["kanjiru"], meaning: "to feel; to sense; to experience",
    breakdown: [["感", "かん", "feeling; sensation"], ["じる", "じる", "verb ending"]],
    memory: "感 is かん; add じる: かん + じる = かんじる.",
  },
  {
    word: "多い", reading: "おおい", romaji: ["ooi"], meaning: "many; numerous; a lot",
    breakdown: [["多", "おお", "many; much"], ["い", "い", "adjective ending"]],
    memory: "多 gives おお; add い: おお + い = おおい.",
  },
  {
    word: "不安", reading: "ふあん", romaji: ["fuan"], meaning: "anxiety; uneasiness; insecurity",
    breakdown: [["不", "ふ", "not; non-; negative"], ["安", "あん", "peace; safety; ease"]],
    memory: "不 is ふ and 安 is あん: ふ + あん = ふあん.",
  },
  {
    word: "教える", reading: "おしえる", romaji: ["oshieru", "osieru"], meaning: "to teach; to tell; to inform",
    breakdown: [["教", "おし", "teach; instruct"], ["える", "える", "verb ending"]],
    memory: "教 gives おし; add える: おし + える = おしえる.",
  },
  {
    word: "最初", reading: "さいしょ", romaji: ["saisho", "saisyo"], meaning: "the beginning; first; outset",
    breakdown: [["最", "さい", "most; utmost"], ["初", "しょ", "first; beginning"]],
    memory: "最 is さい and 初 is しょ: さい + しょ = さいしょ.",
  },
  {
    word: "全く", reading: "まったく", romaji: ["mattaku"], meaning: "entirely; completely; truly; not at all",
    breakdown: [["全", "まった", "all; whole; complete"], ["く", "く", "adverb ending"]],
    memory: "全 becomes まった here; add く: まった + く = まったく.",
  },
  {
    word: "数", reading: "かず", romaji: ["kazu"], meaning: "number; amount; quantity",
    breakdown: [["数", "かず", "number; amount; quantity"]],
    memory: "A number or amount is かず (kazu).",
  },
  {
    word: "今", reading: "いま", romaji: ["ima"], meaning: "now; the present; this moment",
    breakdown: [["今", "いま", "now; present"]],
    memory: "Right now is いま (ima).",
  },
  {
    word: "文字", reading: "もじ", romaji: ["moji"], meaning: "letter; character; writing",
    breakdown: [["文", "も", "writing; sentence"], ["字", "じ", "character; letter"]],
    memory: "文 is も here and 字 is じ: も + じ = もじ.",
  },
  {
    word: "表", reading: "ひょう", romaji: ["hyou", "hyo"], meaning: "table; chart; list; surface",
    breakdown: [["表", "ひょう", "table; chart; surface"]],
    memory: "A table, chart, or surface is ひょう (hyou).",
  },
  {
    word: "第一", reading: "だいいち", romaji: ["daiichi", "daiiti"], meaning: "first; foremost; number one",
    breakdown: [["第", "だい", "ordinal-number prefix"], ["一", "いち", "one"]],
    memory: "第 is だい and 一 is いち: だい + いち = だいいち.",
  },
  {
    word: "五", reading: "ご", romaji: ["go"], meaning: "five",
    breakdown: [["五", "ご", "five"]],
    memory: "The number five is ご (go).",
  },
  {
    word: "新しい", reading: "あたらしい", romaji: ["atarashii", "atarasii"], meaning: "new; fresh; novel",
    breakdown: [["新", "あたら", "new; fresh"], ["しい", "しい", "adjective ending"]],
    memory: "新 gives あたら; add しい: あたら + しい = あたらしい.",
  },
  {
    word: "以降", reading: "いこう", romaji: ["ikou", "iko"], meaning: "after; from then on; since",
    breakdown: [["以", "い", "from; by means of"], ["降", "こう", "descend; afterward"]],
    memory: "以 is い and 降 is こう: い + こう = いこう.",
  },
  {
    word: "世界", reading: "せかい", romaji: ["sekai"], meaning: "the world; society; sphere",
    breakdown: [["世", "せ", "world; generation"], ["界", "かい", "world; boundary"]],
    memory: "世 is せ and 界 is かい: せ + かい = せかい.",
  },
  {
    word: "変わる", reading: "かわる", romaji: ["kawaru"], meaning: "to change; to be transformed; to vary",
    breakdown: [["変", "か", "change; unusual"], ["わる", "わる", "verb ending"]],
    memory: "変 starts with か here; add わる: か + わる = かわる.",
  },
  {
    word: "外", reading: "そと", romaji: ["soto"], meaning: "outside; exterior; outdoors",
    breakdown: [["外", "そと", "outside; exterior"]],
    memory: "Outside is そと (soto).",
  },
  {
    word: "機", reading: "き", romaji: ["ki"], meaning: "machine; mechanism; opportunity; occasion",
    breakdown: [["機", "き", "machine; opportunity; occasion"]],
    memory: "A machine or opportunity gets the reading き (ki).",
  },
  {
    word: "問題", reading: "もんだい", romaji: ["mondai"], meaning: "problem; question; issue",
    breakdown: [["問", "もん", "question; ask"], ["題", "だい", "topic; title; problem"]],
    memory: "問 is もん and 題 is だい: もん + だい = もんだい.",
  },
  {
    word: "四", reading: "し", kana: ["し", "よん"], romaji: ["shi", "si", "yon"], meaning: "four",
    breakdown: [["四", "し", "four"]],
    memory: "The on-reading for four is し (shi); よん is also common.",
  },
  {
    word: "経済", reading: "けいざい", romaji: ["keizai"], meaning: "economy; economics; finance",
    breakdown: [["経", "けい", "manage; pass through"], ["済", "ざい", "settle; finish; economy"]],
    memory: "経 is けい and 済 is ざい: けい + ざい = けいざい.",
  },
  {
    word: "使う", reading: "つかう", romaji: ["tsukau", "tukau"], meaning: "to use; to employ; to spend",
    breakdown: [["使", "つか", "use; employ"], ["う", "う", "verb ending"]],
    memory: "使 gives つか; add う: つか + う = つかう.",
  },
  {
    word: "名前", reading: "なまえ", romaji: ["namae"], meaning: "name; full name; given name",
    breakdown: [["名", "な", "name; reputation"], ["前", "まえ", "front; before"]],
    memory: "名 is な here and 前 is まえ: な + まえ = なまえ.",
  },
  {
    word: "九", reading: "きゅう", romaji: ["kyuu", "kyu"], meaning: "nine",
    breakdown: [["九", "きゅう", "nine"]],
    memory: "The number nine is きゅう (kyuu).",
  },
  {
    word: "先ず", reading: "まず", romaji: ["mazu"], meaning: "first of all; to begin with; probably",
    breakdown: [["先", "ま", "first; ahead"], ["ず", "ず", "adverb ending"]],
    memory: "先 is read ま here; add ず: ま + ず = まず.",
  },
  {
    word: "保険", reading: "ほけん", romaji: ["hoken"], meaning: "insurance; guarantee",
    breakdown: [["保", "ほ", "protect; preserve"], ["険", "けん", "risk; danger"]],
    memory: "保 is ほ and 険 is けん: ほ + けん = ほけん.",
  },
  {
    word: "可能", reading: "かのう", romaji: ["kanou", "kano"], meaning: "possible; feasible; potential",
    breakdown: [["可", "か", "possible; permitted"], ["能", "のう", "ability; capability"]],
    memory: "可 is か and 能 is のう: か + のう = かのう.",
  },
  {
    word: "身", reading: "み", romaji: ["mi"], meaning: "body; oneself; one's position",
    breakdown: [["身", "み", "body; oneself"]],
    memory: "Your body or self is one short sound: み (mi).",
  },
  {
    word: "面白い", reading: "おもしろい", romaji: ["omoshiroi", "omosiroi"], meaning: "interesting; amusing; enjoyable",
    breakdown: [["面白", "おもしろ", "interesting; amusing"], ["い", "い", "adjective ending"]],
    memory: "面白 gives おもしろ; add い: おもしろ + い = おもしろい.",
  },
  {
    word: "開く", reading: "ひらく、あく", kana: ["ひらく", "あく"], romaji: ["hiraku", "aku"], meaning: "to open; to unfold; to become open",
    breakdown: [["開", "ひら・あ", "open; unfold"], ["く", "く", "verb ending"]],
    memory: "開く can be read ひらく or あく depending on how something opens.",
  },
  {
    word: "相手", reading: "あいて", romaji: ["aite"], meaning: "companion; partner; opponent; the other party",
    breakdown: [["相", "あい", "mutual; together"], ["手", "て", "hand; person"]],
    memory: "相 is あい and 手 is て: あい + て = あいて.",
  },
  {
    word: "結果", reading: "けっか", romaji: ["kekka"], meaning: "result; outcome; consequence",
    breakdown: [["結", "けっ", "tie; conclude"], ["果", "か", "result; fruit"]],
    memory: "結 becomes けっ before 果 (か): けっ + か = けっか.",
  },
  {
    word: "戦争", reading: "せんそう", romaji: ["sensou", "senso"], meaning: "war; warfare",
    breakdown: [["戦", "せん", "war; battle"], ["争", "そう", "conflict; contend"]],
    memory: "戦 is せん and 争 is そう: せん + そう = せんそう.",
  },
  {
    word: "理解", reading: "りかい", romaji: ["rikai"], meaning: "understanding; comprehension",
    breakdown: [["理", "り", "reason; logic"], ["解", "かい", "solve; understand"]],
    memory: "理 is り and 解 is かい: り + かい = りかい.",
  },
  {
    word: "向かう", reading: "むかう", romaji: ["mukau"], meaning: "to face; to head toward; to oppose",
    breakdown: [["向", "むか", "face; head toward"], ["う", "う", "verb ending"]],
    memory: "向 gives むか; add う: むか + う = むかう.",
  },
  {
    word: "必ず", reading: "かならず", romaji: ["kanarazu"], meaning: "always; certainly; without fail",
    breakdown: [["必", "かなら", "certain; inevitable"], ["ず", "ず", "adverb ending"]],
    memory: "必 gives かなら; add ず: かなら + ず = かならず.",
  },
  {
    word: "時期", reading: "じき", romaji: ["jiki", "ziki"], meaning: "time; season; period",
    breakdown: [["時", "じ", "time; hour"], ["期", "き", "period; term"]],
    memory: "時 is じ and 期 is き: じ + き = じき.",
  },
  {
    word: "活用", reading: "かつよう", romaji: ["katsuyou", "katuyou", "katsuyo"], meaning: "practical use; application; conjugation",
    breakdown: [["活", "かつ", "active; live"], ["用", "よう", "use; purpose"]],
    memory: "活 is かつ and 用 is よう: かつ + よう = かつよう.",
  },
  {
    word: "道", reading: "みち", romaji: ["michi", "miti"], meaning: "road; path; way",
    breakdown: [["道", "みち", "road; path; way"]],
    memory: "A road, path, or way is みち (michi).",
  },
  {
    word: "権利", reading: "けんり", romaji: ["kenri"], meaning: "right; privilege",
    breakdown: [["権", "けん", "right; authority"], ["利", "り", "benefit; advantage"]],
    memory: "権 is けん and 利 is り: けん + り = けんり.",
  },
  {
    word: "山", reading: "やま", romaji: ["yama"], meaning: "mountain; hill",
    breakdown: [["山", "やま", "mountain; hill"]],
    memory: "A mountain or hill is やま (yama).",
  },
  {
    word: "少し", reading: "すこし", romaji: ["sukoshi", "sukosi"], meaning: "a little; a few; a short time",
    breakdown: [["少", "すこ", "few; little"], ["し", "し", "word ending"]],
    memory: "少 gives すこ; add し: すこ + し = すこし.",
  },
  {
    word: "政府", reading: "せいふ", romaji: ["seifu"], meaning: "government; administration",
    breakdown: [["政", "せい", "government; politics"], ["府", "ふ", "government office; administration"]],
    memory: "政 is せい and 府 is ふ: せい + ふ = せいふ.",
  },
  {
    word: "生産", reading: "せいさん", romaji: ["seisan"], meaning: "production; manufacture",
    breakdown: [["生", "せい", "life; produce"], ["産", "さん", "produce; give birth"]],
    memory: "生 is せい and 産 is さん: せい + さん = せいさん.",
  },
  {
    word: "語", reading: "ご", romaji: ["go"], meaning: "language; word; speech",
    breakdown: [["語", "ご", "language; word"]],
    memory: "A language or word gets the short on-reading ご (go).",
  },
  {
    word: "重要", reading: "じゅうよう", romaji: ["juuyou", "juyou", "jyuuyou"], meaning: "important; essential; significant",
    breakdown: [["重", "じゅう", "heavy; important"], ["要", "よう", "need; essential"]],
    memory: "重 is じゅう and 要 is よう: じゅう + よう = じゅうよう.",
  },
  {
    word: "正しい", reading: "ただしい", romaji: ["tadashii", "tadasii"], meaning: "correct; right; proper",
    breakdown: [["正", "ただ", "correct; right"], ["しい", "しい", "adjective ending"]],
    memory: "正 gives ただ; add しい: ただ + しい = ただしい.",
  },
  {
    word: "神", reading: "かみ", romaji: ["kami"], meaning: "god; deity; spirit",
    breakdown: [["神", "かみ", "god; deity; spirit"]],
    memory: "A god, deity, or spirit is かみ (kami).",
  },
  {
    word: "受ける", reading: "うける", romaji: ["ukeru"], meaning: "to receive; to accept; to take",
    breakdown: [["受", "う", "receive; accept"], ["ける", "ける", "verb ending"]],
    memory: "受 gives う; add ける: う + ける = うける.",
  },
  {
    word: "食べる", reading: "たべる", romaji: ["taberu"], meaning: "to eat",
    breakdown: [["食", "た", "eat; food"], ["べる", "べる", "verb ending"]],
    memory: "食 gives た; add べる: た + べる = たべる.",
  },
  {
    word: "美味しい", reading: "おいしい", romaji: ["oishii", "oisii"], meaning: "delicious; tasty",
    breakdown: [["美味", "おい", "delicious; tasty"], ["しい", "しい", "adjective ending"]],
    memory: "美味しい is the everyday word おいしい: delicious or tasty.",
  },
  {
    word: "切る", reading: "きる", romaji: ["kiru"], meaning: "to cut; to sever; to turn off",
    breakdown: [["切", "き", "cut; sever"], ["る", "る", "verb ending"]],
    memory: "切 gives き; add る: き + る = きる.",
  },
  {
    word: "回", reading: "かい", romaji: ["kai"], meaning: "time; occurrence; round; counter for times",
    breakdown: [["回", "かい", "time; round; occurrence"]],
    memory: "A round or occurrence is かい (kai).",
  },
  {
    word: "国民", reading: "こくみん", romaji: ["kokumin"], meaning: "citizens; people of a country; nation",
    breakdown: [["国", "こく", "country; nation"], ["民", "みん", "people; citizens"]],
    memory: "国 is こく and 民 is みん: こく + みん = こくみん.",
  },
  {
    word: "決める", reading: "きめる", romaji: ["kimeru"], meaning: "to decide; to determine; to set",
    breakdown: [["決", "き", "decide; determine"], ["める", "める", "verb ending"]],
    memory: "決 gives き; add める: き + める = きめる.",
  },
  {
    word: "原因", reading: "げんいん", romaji: ["genin", "gennin"], meaning: "cause; origin; source",
    breakdown: [["原", "げん", "origin; source"], ["因", "いん", "cause; factor"]],
    memory: "原 is げん and 因 is いん: げん + いん = げんいん.",
  },
  {
    word: "課題", reading: "かだい", romaji: ["kadai"], meaning: "task; assignment; issue; challenge",
    breakdown: [["課", "か", "lesson; section; task"], ["題", "だい", "topic; problem"]],
    memory: "課 is か and 題 is だい: か + だい = かだい.",
  },
  {
    word: "特に", reading: "とくに", romaji: ["tokuni"], meaning: "especially; particularly",
    breakdown: [["特", "とく", "special; particular"], ["に", "に", "adverb ending"]],
    memory: "特 is とく; add に: とく + に = とくに.",
  },
  {
    word: "存在", reading: "そんざい", romaji: ["sonzai"], meaning: "existence; being",
    breakdown: [["存", "そん", "exist; preserve"], ["在", "ざい", "exist; be located"]],
    memory: "存 is そん and 在 is ざい: そん + ざい = そんざい.",
  },
  {
    word: "最近", reading: "さいきん", romaji: ["saikin"], meaning: "recently; lately; most recent",
    breakdown: [["最", "さい", "most; utmost"], ["近", "きん", "near; recent"]],
    memory: "最 is さい and 近 is きん: さい + きん = さいきん.",
  },
  {
    word: "情報", reading: "じょうほう", romaji: ["jouhou", "joho", "jyouhou"], meaning: "information; news; intelligence",
    breakdown: [["情", "じょう", "feeling; circumstances"], ["報", "ほう", "report; information"]],
    memory: "情 is じょう and 報 is ほう: じょう + ほう = じょうほう.",
  },
  {
    word: "出す", reading: "だす", romaji: ["dasu"], meaning: "to take out; to put out; to submit; to send",
    breakdown: [["出", "だ", "take out; put out"], ["す", "す", "verb ending"]],
    memory: "出 gives だ here; add す: だ + す = だす.",
  },
  {
    word: "二人", reading: "ふたり", romaji: ["futari"], meaning: "two people; a pair; a couple",
    breakdown: [["二", "ふた", "two"], ["人", "り", "person counter here"]],
    memory: "Two people use the special reading ふたり (futari).",
  },
  {
    word: "大", reading: "だい", romaji: ["dai"], meaning: "big; large; major",
    breakdown: [["大", "だい", "big; large; major"]],
    memory: "The on-reading for big or major is だい (dai).",
  },
  {
    word: "に対して", reading: "にたいして", romaji: ["nitaishite", "nitaisite"], meaning: "toward; against; regarding; in contrast to",
    breakdown: [["に", "に", "direction or target particle"], ["対", "たい", "opposite; toward; versus"], ["して", "して", "conjunctive form of する"]],
    memory: "に marks the target, 対 is たい, and して completes the expression: にたいして.",
  },
  {
    word: "一人", reading: "ひとり", romaji: ["hitori"], meaning: "one person; alone; by oneself",
    breakdown: [["一", "ひと", "one"], ["人", "り", "person counter here"]],
    memory: "One person uses the special reading ひとり (hitori).",
  },
  {
    word: "分", reading: "ふん", romaji: ["fun"], meaning: "minute; part; portion",
    breakdown: [["分", "ふん", "minute; part; portion"]],
    memory: "A minute or portion gets the reading ふん (fun).",
  },
  {
    word: "人々", reading: "ひとびと", romaji: ["hitobito"], meaning: "people; everyone; each person",
    breakdown: [["人", "ひと", "person; people"], ["々", "びと", "repetition mark with sound change"]],
    memory: "Repeat 人 (ひと) with a sound change: ひと + びと = ひとびと.",
  },
  {
    word: "生きる", reading: "いきる", romaji: ["ikiru"], meaning: "to live; to exist; to make a living",
    breakdown: [["生", "い", "live; life"], ["きる", "きる", "verb ending"]],
    memory: "生 starts with い here; add きる: い + きる = いきる.",
  },
  {
    word: "生", reading: "なま", romaji: ["nama"], meaning: "raw; fresh; unprocessed; live",
    breakdown: [["生", "なま", "raw; fresh; unprocessed"]],
    memory: "Raw or fresh is なま (nama).",
  },
  {
    word: "会う", reading: "あう", romaji: ["au"], meaning: "to meet; to see; to encounter",
    breakdown: [["会", "あ", "meet; encounter"], ["う", "う", "verb ending"]],
    memory: "会 gives あ; add う: あ + う = あう.",
  },
  {
    word: "見せる", reading: "みせる", romaji: ["miseru"], meaning: "to show; to display; to let someone see",
    breakdown: [["見", "み", "see; look"], ["せる", "せる", "verb ending meaning show"]],
    memory: "見 gives み; add せる: み + せる = みせる.",
  },
  {
    word: "三百", reading: "さんびゃく", romaji: ["sanbyaku"], meaning: "three hundred",
    breakdown: [["三", "さん", "three"], ["百", "びゃく", "hundred with sound change"]],
    memory: "Three hundred changes 百 from ひゃく to びゃく: さんびゃく.",
  },
  {
    word: "生まれる", reading: "うまれる", romaji: ["umareru"], meaning: "to be born; to arise; to come into existence",
    breakdown: [["生", "う", "be born; life"], ["まれる", "まれる", "verb ending"]],
    memory: "生 starts with う here; add まれる: う + まれる = うまれる.",
  },
  {
    word: "地方", reading: "ちほう", romaji: ["chihou", "chiho", "tihou"], meaning: "region; locality; countryside",
    breakdown: [["地", "ち", "ground; area"], ["方", "ほう", "direction; side"]],
    memory: "地 is ち and 方 is ほう: ち + ほう = ちほう.",
  },
  {
    word: "用いる", reading: "もちいる", romaji: ["mochiiru", "motiiru"], meaning: "to use; to employ; to adopt",
    breakdown: [["用", "もち", "use; employ"], ["いる", "いる", "verb ending"]],
    memory: "用 gives もち; add いる: もち + いる = もちいる.",
  },
  {
    word: "小さい", reading: "ちいさい", romaji: ["chiisai", "tiisai"], meaning: "small; little; tiny",
    breakdown: [["小", "ちい", "small; little"], ["さい", "さい", "adjective ending"]],
    memory: "小 gives ちい; add さい: ちい + さい = ちいさい.",
  },
  {
    word: "実", reading: "じつ", romaji: ["jitsu", "zitu"], meaning: "truth; reality; actuality; fruit",
    breakdown: [["実", "じつ", "truth; reality; actuality"]],
    memory: "Truth or reality gets the reading じつ (jitsu).",
  },
  {
    word: "中々", reading: "なかなか", romaji: ["nakanaka"], meaning: "quite; considerably; not easily",
    breakdown: [["中", "なか", "middle; inside"], ["々", "なか", "repetition mark"]],
    memory: "Repeat なか: なか + なか = なかなか.",
  },
  {
    word: "二つ", reading: "ふたつ", romaji: ["futatsu", "futatu"], meaning: "two things; two; a pair",
    breakdown: [["二", "ふた", "two"], ["つ", "つ", "general counter"]],
    memory: "二 gives ふた; add the counter つ: ふた + つ = ふたつ.",
  },
  {
    word: "実は", reading: "じつは", romaji: ["jitsuha", "jitsuwa"], meaning: "actually; in fact; to tell the truth",
    breakdown: [["実", "じつ", "truth; reality"], ["は", "は", "topic particle, pronounced わ"]],
    memory: "実 is じつ; add the written particle は: じつは, pronounced じつわ.",
  },
  {
    word: "十分", reading: "じゅうぶん", romaji: ["juubun", "jubun"], meaning: "enough; sufficient; ample; fully",
    breakdown: [["十", "じゅう", "ten; complete"], ["分", "ぶん", "part; amount"]],
    memory: "十 is じゅう and 分 is ぶん: じゅう + ぶん = じゅうぶん.",
  },
  {
    word: "気付く", reading: "きづく", romaji: ["kizuku", "kiduku"], meaning: "to notice; to realize; to become aware",
    breakdown: [["気", "き", "attention; feeling"], ["付く", "づく", "attach; notice, with sound change"]],
    memory: "気 is き and 付く becomes づく: き + づく = きづく.",
  },
  {
    word: "一部", reading: "いちぶ", romaji: ["ichibu"], meaning: "one part; a portion; a section; some",
    breakdown: [["一", "いち", "one"], ["部", "ぶ", "part; section"]],
    memory: "一 is いち and 部 is ぶ: いち + ぶ = いちぶ.",
  },
  {
    word: "四百", reading: "よんひゃく", romaji: ["yonhyaku"], meaning: "four hundred",
    breakdown: [["四", "よん", "four"], ["百", "ひゃく", "hundred"]],
    memory: "Four is よん and hundred is ひゃく: よんひゃく.",
  },
  {
    word: "業", reading: "ぎょう", romaji: ["gyou", "gyo"], meaning: "business; industry; work; karma",
    breakdown: [["業", "ぎょう", "business; industry; work"]],
    memory: "Business or industry gets the reading ぎょう (gyou).",
  },
  {
    word: "様子", reading: "ようす", romaji: ["yousu", "yosu"], meaning: "state; appearance; situation; manner",
    breakdown: [["様", "よう", "appearance; manner"], ["子", "す", "state element here"]],
    memory: "様 is よう and 子 is す here: よう + す = ようす.",
  },
  {
    word: "十月", reading: "じゅうがつ", romaji: ["juugatsu", "jugatsu"], meaning: "October",
    breakdown: [["十", "じゅう", "ten"], ["月", "がつ", "month"]],
    memory: "The tenth month is じゅう + がつ = じゅうがつ.",
  },
  {
    word: "上がる", reading: "あがる", romaji: ["agaru"], meaning: "to rise; to go up; to increase",
    breakdown: [["上", "あ", "up; rise"], ["がる", "がる", "verb ending"]],
    memory: "上 gives あ; add がる: あ + がる = あがる.",
  },
  {
    word: "学", reading: "がく", romaji: ["gaku"], meaning: "learning; study; scholarship",
    breakdown: [["学", "がく", "learning; study"]],
    memory: "Learning or study gets the reading がく (gaku).",
  },
  {
    word: "何方", reading: "どなた", romaji: ["donata"], meaning: "who; which person (polite)",
    breakdown: [["何", "ど", "what; which"], ["方", "なた", "person element in this polite word"]],
    memory: "The polite way to ask who is どなた (donata).",
  },
  {
    word: "九月", reading: "くがつ", romaji: ["kugatsu"], meaning: "September",
    breakdown: [["九", "く", "nine"], ["月", "がつ", "month"]],
    memory: "The ninth month is く + がつ = くがつ.",
  },
  {
    word: "四月", reading: "しがつ", romaji: ["shigatsu", "sigatsu"], meaning: "April",
    breakdown: [["四", "し", "four"], ["月", "がつ", "month"]],
    memory: "The fourth month uses し: し + がつ = しがつ.",
  },
  {
    word: "事実", reading: "じじつ", romaji: ["jijitsu"], meaning: "fact; truth; reality",
    breakdown: [["事", "じ", "matter; thing"], ["実", "じつ", "truth; reality"]],
    memory: "事 is じ and 実 is じつ: じ + じつ = じじつ.",
  },
  {
    word: "同様", reading: "どうよう", romaji: ["douyou", "doyo"], meaning: "the same; similar; likewise",
    breakdown: [["同", "どう", "same"], ["様", "よう", "manner; way"]],
    memory: "同 is どう and 様 is よう: どう + よう = どうよう.",
  },
  {
    word: "十二月", reading: "じゅうにがつ", romaji: ["juunigatsu", "junigatsu"], meaning: "December",
    breakdown: [["十", "じゅう", "ten"], ["二", "に", "two"], ["月", "がつ", "month"]],
    memory: "The twelfth month is じゅう + に + がつ = じゅうにがつ.",
  },
  {
    word: "日本人", reading: "にほんじん", romaji: ["nihonjin"], meaning: "a Japanese person; Japanese people",
    breakdown: [["日", "に", "sun; Japan here"], ["本", "ほん", "origin; Japan here"], ["人", "じん", "person; nationality suffix"]],
    memory: "日本 is にほん; add 人 じん: にほんじん.",
  },
  {
    word: "年間", reading: "ねんかん", romaji: ["nenkan"], meaning: "yearly; annual; a period of years",
    breakdown: [["年", "ねん", "year"], ["間", "かん", "interval; period"]],
    memory: "年 is ねん and 間 is かん: ねん + かん = ねんかん.",
  },
  {
    word: "動く", reading: "うごく", romaji: ["ugoku"], meaning: "to move; to operate; to work",
    breakdown: [["動", "うご", "move; operate"], ["く", "く", "verb ending"]],
    memory: "動 gives うご; add く: うご + く = うごく.",
  },
  {
    word: "一月", reading: "いちがつ", romaji: ["ichigatsu"], meaning: "January",
    breakdown: [["一", "いち", "one"], ["月", "がつ", "month"]],
    memory: "The first month is いち + がつ = いちがつ.",
  },
  {
    word: "六月", reading: "ろくがつ", romaji: ["rokugatsu"], meaning: "June",
    breakdown: [["六", "ろく", "six"], ["月", "がつ", "month"]],
    memory: "The sixth month is ろく + がつ = ろくがつ.",
  },
  {
    word: "行動", reading: "こうどう", romaji: ["koudou", "kodo"], meaning: "action; conduct; behavior",
    breakdown: [["行", "こう", "go; act"], ["動", "どう", "move; action"]],
    memory: "行 is こう and 動 is どう: こう + どう = こうどう.",
  },
  {
    word: "意見", reading: "いけん", romaji: ["iken"], meaning: "opinion; view; point of view",
    breakdown: [["意", "い", "idea; intention"], ["見", "けん", "view; see"]],
    memory: "意 is い and 見 is けん: い + けん = いけん.",
  },
  {
    word: "自動", reading: "じどう", romaji: ["jidou", "jido"], meaning: "automatic; self-operating",
    breakdown: [["自", "じ", "self"], ["動", "どう", "move; operate"]],
    memory: "Self-moving is 自 じ + 動 どう = じどう.",
  },
  {
    word: "大変", reading: "たいへん", romaji: ["taihen"], meaning: "serious; difficult; terrible; very",
    breakdown: [["大", "たい", "great; major"], ["変", "へん", "change; unusual"]],
    memory: "大 is たい and 変 is へん: たい + へん = たいへん.",
  },
  {
    word: "所謂", reading: "いわゆる", romaji: ["iwayuru"], meaning: "so-called; what is called",
    breakdown: [["所謂", "いわゆる", "idiomatic whole-word reading; so-called"]],
    memory: "This is a special whole-word reading: 所謂 = いわゆる.",
  },
  {
    word: "八月", reading: "はちがつ", romaji: ["hachigatsu"], meaning: "August",
    breakdown: [["八", "はち", "eight"], ["月", "がつ", "month"]],
    memory: "The eighth month is はち + がつ = はちがつ.",
  },
  {
    word: "関わる", reading: "かかわる", romaji: ["kakawaru"], meaning: "to be involved; to relate; to concern",
    breakdown: [["関", "かか", "connect; relate"], ["わる", "わる", "verb ending"]],
    memory: "関 gives かか; add わる: かか + わる = かかわる.",
  },
  {
    word: "十一月", reading: "じゅういちがつ", romaji: ["juuichigatsu", "juichigatsu"], meaning: "November",
    breakdown: [["十", "じゅう", "ten"], ["一", "いち", "one"], ["月", "がつ", "month"]],
    memory: "The eleventh month is じゅう + いち + がつ = じゅういちがつ.",
  },
  {
    word: "今度", reading: "こんど", romaji: ["kondo"], meaning: "this time; next time; recently",
    breakdown: [["今", "こん", "now; this"], ["度", "ど", "time; occurrence"]],
    memory: "今 is こん and 度 is ど: こん + ど = こんど.",
  },
  {
    word: "経つ", reading: "たつ", romaji: ["tatsu", "tatu"], meaning: "to pass; to elapse (time)",
    breakdown: [["経", "た", "pass; elapse"], ["つ", "つ", "verb ending"]],
    memory: "経 gives た; add つ: た + つ = たつ.",
  },
  {
    word: "人生", reading: "じんせい", romaji: ["jinsei"], meaning: "life; human life; one's life",
    breakdown: [["人", "じん", "person; human"], ["生", "せい", "life; living"]],
    memory: "人 is じん and 生 is せい: じん + せい = じんせい.",
  },
  {
    word: "二月", reading: "にがつ", romaji: ["nigatsu"], meaning: "February",
    breakdown: [["二", "に", "two"], ["月", "がつ", "month"]],
    memory: "The second month is に + がつ = にがつ.",
  },
  {
    word: "無", reading: "む", romaji: ["mu"], meaning: "nothing; absence; without; non-",
    breakdown: [["無", "む", "nothing; absence; without"]],
    memory: "Nothing or absence gets the reading む (mu).",
  },
  {
    word: "立場", reading: "たちば", romaji: ["tachiba"], meaning: "position; standpoint; situation",
    breakdown: [["立", "たち", "stand; position"], ["場", "ば", "place; situation"]],
    memory: "立 is たち and 場 is ば: たち + ば = たちば.",
  },
  {
    word: "決まる", reading: "きまる", romaji: ["kimaru"], meaning: "to be decided; to be determined; to be settled",
    breakdown: [["決", "き", "decide; settle"], ["まる", "まる", "intransitive verb ending"]],
    memory: "決 gives き; add まる: き + まる = きまる.",
  },
  {
    word: "表わす", reading: "あらわす", romaji: ["arawasu"], meaning: "to express; to represent; to show",
    breakdown: [["表", "あらわ", "express; reveal"], ["す", "す", "verb ending"]],
    memory: "表 gives あらわ; add す: あらわ + す = あらわす.",
  },
  {
    word: "今後", reading: "こんご", romaji: ["kongo"], meaning: "from now on; hereafter; in the future",
    breakdown: [["今", "こん", "now"], ["後", "ご", "after; later"]],
    memory: "今 is こん and 後 is ご: こん + ご = こんご.",
  },
  {
    word: "一日", reading: "いちにち、ついたち", kana: ["いちにち", "ついたち"], romaji: ["ichinichi", "tsuitachi"], meaning: "one day; all day; the first day of the month",
    breakdown: [["一", "いち／つい", "one; first"], ["日", "にち／たち", "day"]],
    memory: "一日 is いちにち for one day, but ついたち for the first of the month.",
  },
  {
    word: "何度", reading: "なんど", romaji: ["nando"], meaning: "how many times; how often; how many degrees",
    breakdown: [["何", "なん", "what; how many"], ["度", "ど", "time; degree"]],
    memory: "何 is なん and 度 is ど: なん + ど = なんど.",
  },
  {
    word: "市場", reading: "いちば", romaji: ["ichiba"], meaning: "market; marketplace",
    breakdown: [["市", "いち", "market; city"], ["場", "ば", "place"]],
    memory: "市 is いち and 場 is ば here: いち + ば = いちば.",
  },
];

// The numbered WAV files cover the original word set only. Later imports,
// including generated number/counter cards, use the browser's Japanese voice.
const BUNDLED_AUDIO_ITEMS = new Set(KANJI);

KANJI.push(...REAL_KANA_N5_IMPORTS);
KANJI.push(...FREQUENCY_2_IMPORTS);
KANJI.push(...LEVEL_2_IMPORTS);
const importedItems = new Map(KANJI.map((item) => [item.word, item]));
const NUMBER_DECK_KEYS = new Map();
NUMBER_IMPORTS.forEach((item) => {
  if (item.studyKey) {
    KANJI.push(item);
    importedItems.set(item.studyKey, item);
    return;
  }
  const existing = importedItems.get(item.word);
  if (!existing) {
    KANJI.push(item);
    importedItems.set(item.word, item);
    NUMBER_DECK_KEYS.set(item.word, item.word);
  } else if (existing.reading === item.reading) {
    existing.audioSrc ??= item.audioSrc;
    NUMBER_DECK_KEYS.set(item.word, item.word);
  } else {
    item.studyKey = `numbers:${item.word}`;
    KANJI.push(item);
    NUMBER_DECK_KEYS.set(item.word, item.studyKey);
  }
});

const itemKey = (item) => item.studyKey ?? item.word;
const KANJI_BY_WORD = new Map();
KANJI.forEach((item) => {
  if (!KANJI_BY_WORD.has(item.word)) KANJI_BY_WORD.set(item.word, item);
  KANJI_BY_WORD.set(itemKey(item), item);
});
REAL_KANA_N5_WORDS.forEach((word, index) => {
  const item = KANJI_BY_WORD.get(word);
  if (!item) return;
  const start = Math.floor(index / 10) * 10 + 1;
  item.n5SourceLabel = `N5 · ${String(start).padStart(3, "0")}—${String(start + 9).padStart(3, "0")}`;
});
FREQUENCY_2_WORDS.forEach((word, index) => {
  const item = KANJI_BY_WORD.get(word);
  if (!item) return;
  const start = Math.floor(index / 10) * 10 + 1;
  item.frequency2SourceLabel = `LEVEL 1:2 · ${String(start).padStart(3, "0")}—${String(start + 9).padStart(3, "0")}`;
});
LEVEL_2_WORDS.forEach((word, index) => {
  const item = KANJI_BY_WORD.get(word);
  if (!item) return;
  const start = Math.floor(index / 10) * 10 + 1;
  item.level2SourceLabel = `LEVEL 2 · ${String(start).padStart(3, "0")}—${String(start + 9).padStart(3, "0")}`;
});
NUMBER_GROUPS.forEach((group) => {
  group.words.forEach((word) => {
    const item = KANJI_BY_WORD.get(NUMBER_DECK_KEYS.get(word) ?? word);
    if (item) item.numberSourceLabel = `NUMBERS · ${group.label}`;
  });
});

function sourceDeckLabel(item) {
  const index = KANJI.indexOf(item);
  if (index < 0) return "";
  let originalLabel = "";
  if (index < 110) {
    const start = 41 + Math.floor(index / 10) * 10;
    originalLabel = `LEVEL 1 · ${String(start).padStart(3, "0")}—${String(start + 9).padStart(3, "0")}`;
  } else if (index < 170) {
    const start = 1 + Math.floor((index - 110) / 10) * 10;
    originalLabel = `EXTRA 1 · ${String(start).padStart(2, "0")}—${String(start + 9).padStart(2, "0")}`;
  }
  return [originalLabel, item.n5SourceLabel, item.frequency2SourceLabel, item.level2SourceLabel, item.numberSourceLabel]
    .filter(Boolean)
    .join(" · ");
}

const DECKS = {
  all: { label: "ALL 110", setLabel: "SET 041—150", start: 0, end: 110 },
  favorites: { label: "★ FAVORITES", setLabel: "FAVORITES", dynamic: true },
  done: { label: "DONE", setLabel: "RECALL HISTORY · DONE", dynamic: true },
  "needs-work": { label: "NEEDS WORK", setLabel: "RECALL HISTORY · NEEDS WORK", dynamic: true },
  "41-50": { label: "41—50", setLabel: "SET 041—050", start: 0, end: 10 },
  "51-60": { label: "51—60", setLabel: "SET 051—060", start: 10, end: 20 },
  "61-70": { label: "61—70", setLabel: "SET 061—070", start: 20, end: 30 },
  "71-80": { label: "71—80", setLabel: "SET 071—080", start: 30, end: 40 },
  "81-90": { label: "81—90", setLabel: "SET 081—090", start: 40, end: 50 },
  "91-100": { label: "91—100", setLabel: "SET 091—100", start: 50, end: 60 },
  "101-110": { label: "101—110", setLabel: "SET 101—110", start: 60, end: 70 },
  "111-120": { label: "111—120", setLabel: "SET 111—120", start: 70, end: 80 },
  "121-130": { label: "121—130", setLabel: "SET 121—130", start: 80, end: 90 },
  "131-140": { label: "131—140", setLabel: "SET 131—140", start: 90, end: 100 },
  "141-150": { label: "141—150", setLabel: "SET 141—150", start: 100, end: 110 },
  "extra-1-10": { label: "EXTRA 01—10", setLabel: "EXTRA 1 · 01—10", start: 110, end: 120 },
  "extra-11-20": { label: "EXTRA 11—20", setLabel: "EXTRA 1 · 11—20", start: 120, end: 130 },
  "extra-21-30": { label: "EXTRA 21—30", setLabel: "EXTRA 1 · 21—30", start: 130, end: 140 },
  "extra-31-40": { label: "EXTRA 31—40", setLabel: "EXTRA 1 · 31—40", start: 140, end: 150 },
  "extra-41-50": { label: "EXTRA 41—50", setLabel: "EXTRA 1 · 41—50", start: 150, end: 160 },
  "extra-51-60": { label: "EXTRA 51—60", setLabel: "EXTRA 1 · 51—60", start: 160, end: 170 },
};

DECKS["n5-all"] = { label: "N5 ALL 150", setLabel: "JLPT N5 · ALL 150", words: REAL_KANA_N5_WORDS };
for (let index = 0; index < REAL_KANA_N5_WORDS.length; index += 10) {
  const start = index + 1;
  const end = Math.min(index + 10, REAL_KANA_N5_WORDS.length);
  const key = `n5-${start}-${end}`;
  const range = `${String(start).padStart(3, "0")}—${String(end).padStart(3, "0")}`;
  DECKS[key] = { label: `N5 ${range}`, setLabel: `JLPT N5 · ${range}`, words: REAL_KANA_N5_WORDS.slice(index, end) };
}

DECKS["frequency-2-all"] = { label: "L1:2 ALL 150", setLabel: "FREQUENCY · LEVEL 1:2 · ALL 150", words: FREQUENCY_2_WORDS };
for (let index = 0; index < FREQUENCY_2_WORDS.length; index += 10) {
  const start = index + 1;
  const end = Math.min(index + 10, FREQUENCY_2_WORDS.length);
  const key = `frequency-2-${start}-${end}`;
  const range = `${String(start).padStart(3, "0")}—${String(end).padStart(3, "0")}`;
  DECKS[key] = { label: `L1:2 ${range}`, setLabel: `FREQUENCY · LEVEL 1:2 · ${range}`, words: FREQUENCY_2_WORDS.slice(index, end) };
}

DECKS["level-2-all"] = { label: `L2 ALL ${LEVEL_2_WORDS.length}`, setLabel: `FREQUENCY · LEVEL 2 · ALL ${LEVEL_2_WORDS.length}`, words: LEVEL_2_WORDS };
for (let index = 0; index < LEVEL_2_WORDS.length; index += 10) {
  const start = index + 1;
  const end = Math.min(index + 10, LEVEL_2_WORDS.length);
  const key = `level-2-${start}-${end}`;
  const range = `${String(start).padStart(3, "0")}—${String(end).padStart(3, "0")}`;
  DECKS[key] = { label: `L2 ${range}`, setLabel: `FREQUENCY · LEVEL 2 · ${range}`, words: LEVEL_2_WORDS.slice(index, end) };
}

DECKS["numbers-all"] = { label: `NUM ALL ${NUMBER_WORDS.length}`, setLabel: `NUMBERS · ALL ${NUMBER_WORDS.length}`, words: NUMBER_WORDS.map((word) => NUMBER_DECK_KEYS.get(word) ?? word) };
NUMBER_GROUPS.forEach((group) => {
  DECKS[`numbers-${group.key}`] = {
    label: group.key === "counter-types"
      ? `COUNTER TYPES ${group.words.length}`
      : `NUM ${group.label.split(" · ")[0]} ${group.words.length}`,
    setLabel: group.key === "counter-types"
      ? "COUNTER TYPES · QUICK GUIDE"
      : `NUMBERS · ${group.label}`,
    words: group.words.map((word) => NUMBER_DECK_KEYS.get(word) ?? word),
  };
});


export {
  BUNDLED_AUDIO_ITEMS,
  DECKS,
  FREQUENCY_2_WORDS,
  KANJI,
  KANJI_BY_WORD,
  LEVEL_2_WORDS,
  NUMBER_GROUPS,
  REAL_KANA_N5_WORDS,
  itemKey,
  sourceDeckLabel,
};
