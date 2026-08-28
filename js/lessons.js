// 英語冒險王 - 完整課程系統(國中 → 博士)
// 每級一課:passage 課文(附音檔)/ vocab 字詞(取自該級字庫)/
// pron 發音重點 / listening 聽力理解 / grammar 文法
// quiz 選項規則:opts[0] 永遠是正解,畫面顯示時再洗牌
const LESSON_BANK = {
  junior: [{
    passage: {
      aid: "p_junior",
      title: "A Day at the Museum",
      en: "Last Saturday, my family decided to visit the famous museum in the city. We took a bus and arrived at ten o'clock. My sister loves art, so she took many pictures of the old paintings. I borrowed an audio guide from the front desk and learned about the history of Taiwan. At noon, we had lunch at a restaurant near the museum. The food was delicious! Before we left, I bought a small gift at the museum shop to celebrate the wonderful day. We were tired but happy when we finally got home.",
      zh: "上週六,我們一家決定去參觀市裡有名的博物館。我們搭公車在十點抵達。姊姊熱愛藝術,所以拍了許多古畫的照片。我在服務台借了語音導覽,認識了台灣的歷史。中午我們在博物館附近的餐廳吃午餐,食物非常美味!離開前,我在博物館商店買了個小禮物來慶祝這美好的一天。回到家時我們累壞了,卻很開心。",
    },
    vocab: ["museum", "decide", "famous", "arrive", "borrow", "restaurant", "delicious", "celebrate"],
    pron: {
      title: "發音重點:/ɪ/ vs /i/ 與 ee / ea 拼字",
      tip: "自然發音線索:短 i 唸鬆短的 /ɪ/(嘴放鬆);ee、ea 唸長緊的 /i/(嘴角用力微笑)。課文裡的 city、visit 是 /ɪ/,we、leave 是 /i/。",
      drills: [
        { play: "sit", opts: ["sit", "seat"], note: "短又鬆 → 是 sit /sɪt/" },
        { play: "sheep", opts: ["sheep", "ship"], note: "長又緊、有微笑嘴 → 是 sheep /ʃip/" },
        { play: "feel", opts: ["feel", "fill"], note: "ee 拼字唸長 /i/ → feel" },
      ],
    },
    listening: [
      { q: "How did the family go to the museum?", opts: ["By bus", "By car", "By train", "On foot"] },
      { q: "What did the sister take pictures of?", opts: ["The old paintings", "The restaurant", "The gift shop", "The bus"] },
      { q: "When did they have lunch?", opts: ["At noon", "At ten o'clock", "In the evening", "Before they arrived"] },
    ],
    grammar: {
      title: "文法:過去簡單式(Past Simple)",
      points: [
        "描述過去發生、已結束的事:動詞加 -ed(arrived、celebrated)。",
        "常用不規則變化要背:take→took、have→had、buy→bought、is/are→was/were。",
        "常見時間標記:yesterday、last Saturday、two days ago。",
      ],
      examples: [
        { en: "We took a bus and arrived at ten.", zh: "我們搭公車,十點抵達。" },
        { en: "I bought a small gift before we left.", zh: "離開前我買了一個小禮物。" },
      ],
      quiz: [
        { q: "We ___ a bus to the museum yesterday.", opts: ["took", "take", "takes", "taking"], note: "yesterday → 過去式,take 的過去式是 took。" },
        { q: "They ___ at ten o'clock last Saturday.", opts: ["arrived", "arrive", "arrives", "arriving"], note: "規則動詞加 -ed → arrived。" },
        { q: "The food ___ delicious!", opts: ["was", "is", "were", "are"], note: "整段是過去的事,food 是單數 → was。" },
        { q: "I ___ a gift at the shop before we left.", opts: ["bought", "buy", "buyed", "buying"], note: "buy 是不規則動詞 → bought(沒有 buyed!)。" },
      ],
    },
  }],
  senior: [{
    passage: {
      aid: "p_senior",
      title: "The Power of Attitude",
      en: "When Emily entered senior high school, she was anxious about almost everything. She would hesitate to raise her hand, even when she knew the answer. Her teacher noticed this and told her, 'Your attitude decides how far you will go.' Emily decided to change. She made an effort to join the debate club, where she learned to analyze problems and express her opinions with confidence. Little by little, she accomplished things she had never imagined. By the end of the year, she had not only won a speech contest but also contributed to her community as a volunteer. Emily finally understood that a positive attitude turns every challenge into an opportunity.",
      zh: "Emily 剛上高中時,對幾乎所有事情都感到焦慮。即使知道答案,她也會猶豫要不要舉手。老師注意到了,告訴她:「你的態度決定你能走多遠。」Emily 決定改變。她努力加入辯論社,在那裡學會分析問題、有自信地表達意見。一點一滴地,她完成了從未想像過的事。到了年底,她不僅贏得演講比賽,還以志工身分為社區貢獻。Emily 終於明白:正向的態度能把每個挑戰變成機會。",
    },
    vocab: ["anxious", "hesitate", "attitude", "confidence", "analyze", "accomplish", "contribute", "challenge"],
    pron: {
      title: "發音重點:/ɛ/ vs /æ/",
      tip: "國語沒有 /æ/!唸 attitude、analyze、challenge 的 a 時,先說「ㄝ」再把下巴誇張往下拉,發出被壓扁的音。debate、effort 的 e 則是自然的 /ɛ/。",
      drills: [
        { play: "bad", opts: ["bad", "bed"], note: "下巴大開、扁平拉長 → bad /bæd/" },
        { play: "men", opts: ["men", "man"], note: "開口小、像「ㄝ」→ men /mɛn/" },
        { play: "pan", opts: ["pan", "pen"], note: "開口是 pen 的兩倍 → pan /pæn/" },
      ],
    },
    listening: [
      { q: "How did Emily feel when she entered senior high school?", opts: ["Anxious", "Confident", "Excited", "Bored"] },
      { q: "Which club did Emily join?", opts: ["The debate club", "The art club", "The music club", "The science club"] },
      { q: "What did Emily win by the end of the year?", opts: ["A speech contest", "A writing prize", "A singing contest", "A scholarship"] },
    ],
    grammar: {
      title: "文法:關係子句(Relative Clauses)",
      points: [
        "who 指人、which 指物(多可用 that 代替)、whose 表所有、where 指地點。",
        "課文例:the debate club, where she learned to analyze problems。",
        "關係詞在子句中當主詞時不可省略;當受詞時可省略。",
      ],
      examples: [
        { en: "Emily is the student who won the speech contest.", zh: "Emily 就是贏得演講比賽的那位學生。" },
        { en: "She joined a club where students practice debating.", zh: "她加入了一個讓學生練習辯論的社團。" },
      ],
      quiz: [
        { q: "The debate club is a place ___ students learn to express opinions.", opts: ["where", "which", "who", "whom"], note: "先行詞是地點、子句結構完整 → where。" },
        { q: "Emily is the student ___ won the contest.", opts: ["who", "which", "where", "whose"], note: "先行詞是人、當主詞 → who。" },
        { q: "The contest ___ she won was held in June.", opts: ["which", "who", "where", "when"], note: "先行詞是物(contest)→ which(當受詞,亦可省略)。" },
        { q: "A person ___ attitude is positive sees chances everywhere.", opts: ["whose", "who", "which", "where"], note: "「他的態度」表所有格 → whose。" },
      ],
    },
  }],
  college: [{
    passage: {
      aid: "p_college",
      title: "Social Media and Public Opinion",
      en: "Social media has become a dominant force in shaping public opinion. Every day, algorithms decide what billions of users perceive as important, a phenomenon that raises awareness of both opportunities and risks. On one hand, online platforms can facilitate democratic participation and bridge the gap between citizens and governments. On the other hand, they may manipulate emotions through ambiguous information, making it crucial for users to interpret content rationally. Recent studies assess the impact of this technology on young people and draw a clear distinction between healthy engagement and addiction. The evidence suggests that media literacy education is not an alternative but a fundamental requirement. Unless schools implement effective policies, the next generation will struggle to distinguish facts from manufactured consensus.",
      zh: "社群媒體已成為塑造輿論的主導力量。演算法每天決定數十億使用者「感知」到什麼是重要的——這個現象讓人們同時意識到機會與風險。一方面,線上平台能促進民主參與、弭平公民與政府間的差距;另一方面,它們可能透過模糊的資訊操縱情緒,因此理性詮釋內容變得至關重要。近期研究評估這項科技對年輕人的影響,並清楚區分健康參與和成癮。證據顯示,媒體素養教育不是選項,而是根本要求。除非學校實施有效政策,否則下一代將難以分辨事實與被製造出來的共識。",
    },
    vocab: ["dominant", "perceive", "phenomenon", "facilitate", "manipulate", "ambiguous", "interpret", "fundamental"],
    pron: {
      title: "發音重點:/ʌ/ vs /ɑ/",
      tip: "fundamental、public、struggle 的 u 都是短鈍的 /ʌ/(像被打到肚子的「呃」);dominant、policy 的 o 是大開的 /ɑ/(看醫生的「啊」)。",
      drills: [
        { play: "cup", opts: ["cup", "cop"], note: "短鈍「呃」→ cup /kʌp/" },
        { play: "lock", opts: ["lock", "luck"], note: "嘴大開「啊」→ lock /lɑk/" },
        { play: "not", opts: ["not", "nut"], note: "響亮的「啊」→ not /nɑt/" },
      ],
    },
    listening: [
      { q: "What decides what users perceive as important?", opts: ["Algorithms", "Teachers", "Governments", "Journalists"] },
      { q: "What can online platforms do on the positive side?", opts: ["Facilitate democratic participation", "Manipulate emotions", "Create addiction", "Replace schools"] },
      { q: "What does the evidence suggest is a fundamental requirement?", opts: ["Media literacy education", "Banning social media", "Better algorithms", "Longer screen time"] },
    ],
    grammar: {
      title: "文法:分詞構句(Participle Clauses)",
      points: [
        "主動關係用 V-ing:making it crucial for users to...(課文原句)。",
        "被動關係用 V-ed:Guided by algorithms, users often see similar opinions.",
        "分詞構句讓學術寫作更精煉:兩句合併、去掉重複主詞。",
      ],
      examples: [
        { en: "They may manipulate emotions, making it crucial to interpret content rationally.", zh: "它們可能操縱情緒,使理性詮釋內容變得至關重要。" },
        { en: "Conducted last year, the study assessed the impact on teens.", zh: "這項去年進行的研究評估了對青少年的影響。" },
      ],
      quiz: [
        { q: "___ by algorithms, users often see only similar opinions.", opts: ["Guided", "Guiding", "Guide", "To guide"], note: "使用者「被」演算法引導 → 被動用過去分詞 Guided。" },
        { q: "The report analyzed the data, ___ a clear pattern.", opts: ["revealing", "revealed", "reveals", "to revealed"], note: "報告主動「揭示」→ 現在分詞 revealing。" },
        { q: "___ the risks, many schools now teach media literacy.", opts: ["Recognizing", "Recognized", "Recognize", "Being recognize"], note: "學校主動「意識到」→ Recognizing。" },
        { q: "The study, ___ in 2025, assessed the impact on teens.", opts: ["conducted", "conducting", "conducts", "to conduct"], note: "研究「被」執行 → conducted。" },
      ],
    },
  }],
  master: [{
    passage: {
      aid: "p_master",
      title: "How to Read a Research Paper",
      en: "Reading a research paper efficiently is a skill that graduate students must acquire early. Before examining the details, scan the abstract to grasp the paradigm the authors work within and the hypothesis they intend to test. Next, scrutinize the method section: was the sample heterogeneous or homogeneous, and are the measures rigorous enough to substantiate the claims? Empirical results should be read with a meticulous eye for discrepancies between tables and text. Strong authors delineate the scope of their study, mitigate threats to validity, and reconcile their findings with previous literature. Finally, ask whether the conclusions are plausible and whether the evidence is truly exhaustive. A paper that synthesizes prior work and articulates its contribution clearly deserves your citation; one that merely proliferates jargon does not.",
      zh: "有效率地閱讀研究論文,是研究生必須及早習得的技能。在檢視細節之前,先掃讀摘要,掌握作者所處的典範與欲檢驗的假說。接著,仔細檢查方法段:樣本是異質還是同質?測量是否嚴謹到足以證實其主張?閱讀實證結果時,要以一絲不苟的眼光找出表格與內文間的差異。優秀的作者會界定研究範圍、降低效度威脅,並將發現與既有文獻調和。最後,問問結論是否合理、證據是否真正詳盡。能統整前人研究並清楚闡述貢獻的論文值得你引用;只會堆砌術語的則不值得。",
    },
    vocab: ["paradigm", "scrutinize", "heterogeneous", "rigorous", "substantiate", "empirical", "meticulous", "plausible"],
    pron: {
      title: "發音重點:/ɝ/ 捲舌母音",
      tip: "research、early、work 的 er/ear/or 都是捲舌的 /ɝ/:舌尖後捲、不碰任何地方、從頭捲到尾。不捲的話 work 會變成 walk!",
      drills: [
        { play: "work", opts: ["work", "walk"], note: "有捲舌 → work /wɝk/" },
        { play: "bored", opts: ["bored", "bird"], note: "bored 是 /ɔr/(先「ㄛ」再捲),bird 從頭捲到尾" },
        { play: "shirt", opts: ["shirt", "short"], note: "全程捲舌、無「ㄛ」音 → shirt /ʃɝt/" },
      ],
    },
    listening: [
      { q: "What should you scan first when reading a paper?", opts: ["The abstract", "The references", "The tables", "The acknowledgments"] },
      { q: "What should you check in the method section?", opts: ["Whether the measures are rigorous", "Whether the title is catchy", "How many authors there are", "The journal's ranking"] },
      { q: "Which kind of paper deserves your citation?", opts: ["One that synthesizes prior work clearly", "One that proliferates jargon", "One with the most tables", "The longest one"] },
    ],
    grammar: {
      title: "文法:名詞化與學術文體(Nominalization)",
      points: [
        "把動詞/形容詞轉成名詞,是學術寫作的正式感來源:analyze → analysis、fail → failure、conclude → conclusion。",
        "名詞化讓句子能承載更多資訊:We analyzed the data carefully. → A careful analysis of the data was conducted.",
        "注意別過度使用,否則文章會變得抽象難讀(這正是博士課文要討論的問題!)。",
      ],
      examples: [
        { en: "The failure of the model to converge suggests a specification problem.", zh: "模型無法收斂,顯示設定可能有問題。" },
        { en: "This distinction between the two paradigms underpins our argument.", zh: "兩種典範間的這個區分支撐了我們的論點。" },
      ],
      quiz: [
        { q: "口語:We analyzed the data carefully. → 學術:A careful ___ of the data was conducted.", opts: ["analysis", "analyze", "analyzing", "analyst"], note: "動詞 analyze 名詞化 → analysis。" },
        { q: "The theory fails to explain X. → The ___ of the theory to explain X is well documented.", opts: ["failure", "fail", "failed", "failing"], note: "fail → failure。" },
        { q: "We concluded that the effect is small. → This ___ is supported by the evidence.", opts: ["conclusion", "conclude", "concluding", "conclusive"], note: "conclude → conclusion。" },
        { q: "The two models differ. → There is a clear ___ between the two models.", opts: ["difference", "differ", "different", "differently"], note: "differ → difference。" },
      ],
    },
  }],
  phd: [{
    passage: {
      aid: "p_phd",
      title: "The Zeitgeist of Contemporary Scholarship",
      en: "Contemporary scholarship inhabits a curious zeitgeist. The ubiquitous pressure to publish has engendered debate about whether academic writing has become needlessly abstruse. Critics argue that grandiloquent prose and esoteric terminology serve as gatekeeping, reinforcing the hegemony of established schools of thought. Defenders reply that some ideas are genuinely complex, and that what appears to be circumlocution may in fact be precision. An erudite scholar, they suggest, should be able to distill the essence of an argument without flattening its nuance. Perhaps the truth is not equivocal: pernicious jargon obfuscates, while necessary jargon clarifies. The perspicacious reader learns to tell the difference, to interrogate assumptions, to resist intellectual sycophants, and to remain sanguine about the inexorable vicissitudes of academic fashion.",
      zh: "當代學術置身於一種奇特的時代精神中。無所不在的發表壓力,引發了學術寫作是否已變得不必要地深奧的爭論。批評者主張,浮誇的文風與只有內行才懂的術語成了守門機制,鞏固既有學派的霸權。辯護者則回應:有些思想本來就複雜,看似迂迴的說法其實可能是精確。他們認為,博學的學者應當能提煉論證的精髓,而不抹平其細微差異。也許真相並不模稜兩可:有害的術語使人混淆,必要的術語使人清晰。敏銳的讀者要學會分辨兩者——批判檢視假設、抵抗學術諂媚者,並對學術風潮不可阻擋的興衰保持樂觀。",
    },
    vocab: ["zeitgeist", "ubiquitous", "abstruse", "grandiloquent", "hegemony", "erudite", "obfuscate", "perspicacious"],
    pron: {
      title: "發音重點:多音節重音與 schwa 弱化",
      tip: "學術長字的關鍵是「重音音節唸滿,其餘弱化成 /ə/」。重音位置錯,母語人士就聽不懂:epistemology 重音在 -MOL-,hegemony 在 -GEM-,ubiquitous 在 -BIQ-。",
      drills: [
        { play: "epistemology", opts: ["e·pis·te·MOL·o·gy", "e·PIS·te·mol·o·gy"], note: "重音在第四音節 MOL,其餘全弱化。" },
        { play: "hegemony", opts: ["he·GEM·o·ny", "HE·ge·mo·ny"], note: "美式重音在 GEM(/hɪˈdʒɛməni/)。" },
        { play: "ubiquitous", opts: ["u·BIQ·ui·tous", "u·bi·QUI·tous"], note: "重音在 BIQ,字尾 -tous 弱化成 /təs/。" },
      ],
    },
    listening: [
      { q: "What has the ubiquitous pressure to publish engendered?", opts: ["Debate about abstruse writing", "More research funding", "Shorter papers", "Fewer journals"] },
      { q: "According to critics, what does esoteric terminology serve as?", opts: ["Gatekeeping", "Clarity", "Entertainment", "Translation"] },
      { q: "What should the perspicacious reader learn to do?", opts: ["Tell necessary jargon from pernicious jargon", "Avoid all jargon completely", "Imitate grandiloquent prose", "Publish as fast as possible"] },
    ],
    grammar: {
      title: "文法:模糊限制語 Hedging(學術謹慎表達)",
      points: [
        "學術寫作避免過度斷言:用 may、appear to、suggest、arguably 為主張留餘地。",
        "課文例:what appears to be circumlocution may in fact be precision。",
        "Hedging 不是軟弱,而是精確標示證據強度——這是審稿人最在意的能力之一。",
      ],
      examples: [
        { en: "The data suggest a modest effect, though confounds remain.", zh: "資料顯示效果不大,但混淆變項仍未排除。" },
        { en: "Arguably, this framework offers a more parsimonious account.", zh: "可以說,這個框架提供了更簡約的解釋。" },
      ],
      quiz: [
        { q: "過度斷言:This proves the theory. → 謹慎改寫:This ___ that the theory may be correct.", opts: ["suggests", "proves", "confirms", "guarantees"], note: "suggest + may 是標準 hedging 組合。" },
        { q: "The data ___ to support a causal link, though confounds remain.", opts: ["appear", "prove", "must", "certainly"], note: "appear to 為主張保留餘地。" },
        { q: "哪一句是最恰當的學術表達?", opts: ["Our findings may indicate a modest effect.", "Our findings prove a huge effect.", "Everyone knows this effect exists.", "The effect is absolutely certain."], note: "may indicate + modest:謹慎且精確。" },
        { q: "___, this framework offers a better account of the phenomenon.", opts: ["Arguably", "Definitely", "Obviously", "Undoubtedly"], note: "Arguably 承認有討論空間,是學術慣用的開頭。" },
      ],
    },
  }],
};

const LESSON_SECTIONS = [
  { key: "text", name: "課文", emoji: "📖" },
  { key: "vocab", name: "字詞", emoji: "📝" },
  { key: "pron", name: "發音", emoji: "🔊" },
  { key: "listen", name: "聽力", emoji: "🎧" },
  { key: "grammar", name: "文法", emoji: "✍️" },
];
