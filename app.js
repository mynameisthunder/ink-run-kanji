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
];

const DECKS = {
  all: { label: "ALL 110", setLabel: "SET 041—150", start: 0, end: 110 },
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
};

const BATCH_SIZE = 3;
const RECALLS_PER_WORD = 2;
const TOTAL_BATCHES = Math.ceil(KANJI.length / BATCH_SIZE);

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
const elements = {
  intro: $("#introScreen"), game: $("#gameScreen"), result: $("#resultScreen"),
  start: $("#startButton"), study: $("#studyButton"), replay: $("#replayButton"), review: $("#reviewButton"),
  deckButton: $("#deckButton"), deckDialog: $("#deckDialog"), deckList: $("#deckList"), closeDeck: $("#closeDeckButton"),
  dialogStudy: $("#dialogStudyButton"), deckDialogTitle: $("#deckDialogTitle"), introSetLabel: $("#introSetLabel"),
  selectedDeckSummary: $("#selectedDeckSummary"),
  sound: $("#soundButton"), score: $("#score"), streak: $("#streak"), roundLabel: $("#roundLabel"), progress: $("#progressBar"),
  questionCount: $("#questionCount"), kanji: $("#kanjiPrompt"), jishoLink: $("#jishoLink"), hint: $("#hintButton"), meaning: $("#meaning"),
  studyCard: $("#studyCard"), studyReading: $("#studyReading"), studyPronounce: $("#studyPronounceButton"), studyMeaning: $("#studyMeaning"), studyBreakdown: $("#studyBreakdown"),
  memoryHook: $("#memoryHook"), studyNext: $("#studyNextButton"), recallForm: $("#recallForm"), readingInput: $("#readingInput"),
  feedback: $("#feedback"), feedbackTitle: $("#feedbackTitle"), feedbackReading: $("#feedbackReading"),
  pronounce: $("#pronounceButton"), feedbackMeaning: $("#feedbackMeaning"), feedbackBreakdown: $("#feedbackBreakdown"), next: $("#nextButton"),
  finalScore: $("#finalScore"), accuracy: $("#accuracy"), bestStreak: $("#bestStreak"), hintsUsed: $("#hintsUsed"),
};

const state = {
  selectedDeckKey: "all",
  deck: KANJI,
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

function selectedDeck() {
  const deck = DECKS[state.selectedDeckKey];
  return KANJI.slice(deck.start, deck.end);
}

function selectDeck(key) {
  if (!DECKS[key]) return;
  state.selectedDeckKey = key;
  const deck = DECKS[key];
  document.querySelectorAll("[data-deck-choice]").forEach((button) => {
    const active = button.dataset.deckChoice === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.selectedDeckSummary.textContent = deck.label;
  elements.introSetLabel.textContent = deck.setLabel;
  elements.deckDialogTitle.textContent = deck.setLabel;
  elements.deckButton.innerHTML = `DECK <span>${deck.end - deck.start}</span>`;
  populateDeck();
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

function prepareRun(mode) {
  const deck = selectedDeck();
  Object.assign(state, {
    mode, deck, batchIndex: 0, studyIndex: 0, batch: deck, queue: mode === "finalRecall" ? shuffle(deck) : [], current: null,
    mastery: new Map(deck.map((item) => [item.word, 0])), mastered: new Set(), finalMastered: new Set(),
    streak: 0, bestStreak: 0, recalls: 0, reteaches: 0, locked: false,
  });
  elements.progress.style.background = "var(--red)";
  elements.feedback.classList.remove("show");
  showScreen(elements.game);
}

function startGame() {
  prepareRun("finalRecall");
  nextRecall();
}

function startStudyDeck() {
  if (elements.deckDialog.open) elements.deckDialog.close();
  prepareRun("study");
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

function showStudyCard() {
  const item = state.deck[state.studyIndex];
  renderWord(item);
  elements.feedback.classList.remove("show");
  elements.studyCard.classList.remove("hidden");
  elements.recallForm.classList.add("hidden");
  elements.hint.classList.add("hidden");
  elements.meaning.textContent = "";
  elements.roundLabel.textContent = `STUDY ${DECKS[state.selectedDeckKey].label}`;
  elements.questionCount.textContent = `CARD ${String(state.studyIndex + 1).padStart(2, "0")} / ${String(state.deck.length).padStart(2, "0")}`;
  elements.studyReading.textContent = item.reading;
  elements.studyPronounce.setAttribute("aria-label", `Pronounce ${item.word}: ${(item.kana ?? [item.reading])[0]}`);
  elements.studyMeaning.textContent = item.meaning;
  elements.memoryHook.textContent = item.memory;
  buildParts(item, elements.studyBreakdown, "study-part");
  elements.studyNext.firstChild.textContent = state.studyIndex === state.deck.length - 1 ? "START DECK RECALL " : "NEXT STUDY CARD ";
  updateStatus();
}

function advanceStudy() {
  if (state.mode !== "study") return;
  state.studyIndex += 1;
  if (state.studyIndex < state.deck.length) showStudyCard();
  else beginFinalRecall();
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
    elements.questionCount.textContent = `${state.finalMastered.size} / ${state.deck.length} PROVED`;
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
  const acceptedKana = item.kana ?? [item.reading];
  return acceptedKana.some((version) => answer === normalizeAnswer(version))
    || item.romaji.some((version) => answer === normalizeAnswer(romajiToHiragana(version, true)));
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
  elements.pronounce.setAttribute("aria-label", `Pronounce ${item.word}: ${(item.kana ?? [item.reading])[0]}`);
  elements.feedbackMeaning.textContent = item.meaning;
  elements.feedback.classList.toggle("detailed", includeBreakdown);
  buildParts(item, elements.feedbackBreakdown, "breakdown-item");
  elements.feedbackBreakdown.querySelectorAll(".breakdown-item strong").forEach((node) => node.className = "breakdown-char");
  elements.feedbackBreakdown.querySelectorAll(".breakdown-item span").forEach((node) => node.className = "breakdown-definition");
  elements.next.firstChild.textContent = includeBreakdown ? "STUDY, THEN TRY AGAIN LATER " : "NEXT RECALL ";
  elements.feedback.classList.add("show");
  elements.next.focus({ preventScroll: true });
}

let pronunciationAudio;
let activePronounceButton;

function speakWithBrowserVoice(reading, button) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  const utterance = new SpeechSynthesisUtterance(reading);
  const japaneseVoice = window.speechSynthesis.getVoices().find((voice) => /^ja(?:-|_)/i.test(voice.lang));
  utterance.lang = "ja-JP";
  utterance.rate = 0.78;
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
  const audioNumber = KANJI.indexOf(item) + 41;
  pronunciationAudio?.pause();
  activePronounceButton?.classList.remove("speaking");
  activePronounceButton = button;
  pronunciationAudio = new Audio(`audio/${audioNumber}.wav`);
  pronunciationAudio.addEventListener("play", () => button.classList.add("speaking"));
  pronunciationAudio.addEventListener("ended", () => button.classList.remove("speaking"));
  pronunciationAudio.addEventListener("error", () => {
    button.classList.remove("speaking");
    speakWithBrowserVoice(reading, button);
  }, { once: true });
  pronunciationAudio.play().catch(() => speakWithBrowserVoice(reading, button));
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
  elements.deckList.replaceChildren(...selectedDeck().map((item) => {
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

document.querySelectorAll("[data-deck-choice]").forEach((button) => button.addEventListener("click", () => selectDeck(button.dataset.deckChoice)));
elements.start.addEventListener("click", startGame);
elements.study.addEventListener("click", startStudyDeck);
elements.replay.addEventListener("click", startGame);
elements.studyNext.addEventListener("click", advanceStudy);
elements.readingInput.addEventListener("input", convertReadingInput);
elements.recallForm.addEventListener("submit", checkRecall);
elements.hint.addEventListener("click", reteachCurrent);
elements.next.addEventListener("click", nextRecall);
elements.pronounce.addEventListener("click", pronounceCurrentWord);
elements.studyPronounce.addEventListener("click", pronounceStudyWord);
elements.review.addEventListener("click", () => { populateDeck(); elements.deckDialog.showModal(); });
elements.deckButton.addEventListener("click", () => { populateDeck(); elements.deckDialog.showModal(); });
elements.dialogStudy.addEventListener("click", startStudyDeck);
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

selectDeck("all");
