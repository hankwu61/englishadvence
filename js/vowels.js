// 英語冒險王 - 母音道場資料庫
// 台灣學習者最易混淆的美式母音對比
// pairs: 最小對比詞 [左側母音的字, 右側母音的字](聽辨二選一用)
const VOWEL_BANK = [
  {
    id: "ih_ee", name: "/ɪ/ vs /i/", tagline: "ship 🆚 sheep", emoji: "🐑",
    left: {
      sym: "/ɪ/", label: "短鬆音",
      mouth: "放鬆、微開,嘴角不用力",
      tongue: "比 /i/ 略低略後,舌肌放鬆",
      tip: "介於「一」和「ㄝ」之間:先說「一」,整張臉放鬆、下巴微掉,又短又懶",
    },
    right: {
      sym: "/i/", label: "長緊音",
      mouth: "嘴角往兩側拉緊,像微笑「一——」",
      tongue: "舌面前部抬到最高最前",
      tip: "拉長、緊繃的「一——」,嘴角用力",
    },
    pairs: [["sit", "seat"], ["bit", "beat"], ["fill", "feel"], ["chip", "cheap"], ["ship", "sheep"], ["hit", "heat"]],
  },
  {
    id: "eh_ae", name: "/ɛ/ vs /æ/", tagline: "bed 🆚 bad", emoji: "🛏️",
    left: {
      sym: "/ɛ/", label: "半開",
      mouth: "半開,近似「ㄝ」",
      tongue: "舌前中高",
      tip: "就是自然的「ㄝ」",
    },
    right: {
      sym: "/æ/", label: "大開扁平",
      mouth: "下巴大幅下拉,開口是 /ɛ/ 的兩倍",
      tongue: "舌前壓到最低,舌尖抵下齒背",
      tip: "先說「ㄝ」再把下巴誇張往下掉,發出介於「ㄝ」和「啊」之間被壓扁的音,拉長一點",
    },
    pairs: [["bed", "bad"], ["men", "man"], ["pen", "pan"], ["send", "sand"], ["bet", "bat"], ["guess", "gas"]],
  },
  {
    id: "uh_ah", name: "/ʌ/ vs /ɑ/", tagline: "cup 🆚 cop", emoji: "☕",
    left: {
      sym: "/ʌ/", label: "短鈍音",
      mouth: "微開、完全放鬆、不圓唇",
      tongue: "舌身中央中低,幾乎是預設位置",
      tip: "像被打到肚子的「呃!」,又短又鈍。拼字是 u 的短母音幾乎都是它",
    },
    right: {
      sym: "/ɑ/", label: "大開響亮",
      mouth: "嘴張到最大,像看醫生「啊——」",
      tongue: "舌身後部壓低",
      tip: "完整響亮的「啊」",
    },
    pairs: [["cup", "cop"], ["luck", "lock"], ["nut", "not"], ["cut", "cot"], ["duck", "dock"], ["hut", "hot"]],
  },
  {
    id: "uu_oo", name: "/ʊ/ vs /u/", tagline: "full 🆚 fool", emoji: "🌕",
    left: {
      sym: "/ʊ/", label: "短鬆音",
      mouth: "唇微圓但放鬆,幾乎不突出",
      tongue: "舌後部中高、放鬆",
      tip: "介於「ㄨ」和「ㄜ」之間:先說「ㄨ」再把嘴唇鬆掉不要噘,變短變含糊。book、good、could 都是它",
    },
    right: {
      sym: "/u/", label: "長緊音",
      mouth: "圓唇用力向前噘,像吹蠟燭「ㄨ——」",
      tongue: "舌後部抬到最高",
      tip: "用力噘嘴的長「ㄨ——」",
    },
    pairs: [["full", "fool"], ["pull", "pool"], ["look", "Luke"], ["soot", "suit"]],
  },
  {
    id: "oh_aw", name: "/oʊ/ vs /ɔ/", tagline: "coat 🆚 caught", emoji: "🧥",
    left: {
      sym: "/oʊ/", label: "雙母音",
      mouth: "從「ㄛ」滑到「ㄨ」,嘴唇越收越圓",
      tongue: "中後 → 高後(有滑動)",
      tip: "一定要滑動!no 不是「ㄋㄛ」而是「ㄋㄛㄨ」,結尾嘴一定要收圓",
    },
    right: {
      sym: "/ɔ/", label: "定住不動",
      mouth: "開口較大、唇微圓,保持不動",
      tongue: "中低偏後(定住)",
      tip: "許多美國人 /ɔ/ 已和 /ɑ/ 合併,聽不出差別不用焦慮,但左邊的滑動不能省",
    },
    pairs: [["coat", "caught"], ["low", "law"], ["boat", "bought"], ["woke", "walk"], ["bowl", "ball"], ["flow", "flaw"]],
  },
  {
    id: "er", name: "/ɝ/ 捲舌母音", tagline: "work 🆚 walk", emoji: "🐦",
    left: {
      sym: "/ɝ/", label: "捲舌",
      mouth: "微開、唇稍圓",
      tongue: "舌身中央,舌尖後捲、不碰任何地方,從頭捲到尾",
      tip: "接近「ㄦ」但更緊、捲更久。work 沒捲舌就會變成 walk",
    },
    right: {
      sym: "/ɔ, ɑ/", label: "無捲舌",
      mouth: "開口較大",
      tongue: "舌平放、不捲",
      tip: "對比感受:捲舌從母音一開始就要捲",
    },
    pairs: [["bird", "bored"], ["work", "walk"], ["hurt", "hot"], ["shirt", "short"], ["firm", "form"], ["curl", "call"]],
  },
];
