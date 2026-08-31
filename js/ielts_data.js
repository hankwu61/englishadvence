// ============================================================
//  🌏 雅思 IELTS 專區 - 題庫資料(Academic 學術組)
//  核心字彙 / Listening 填空與選擇 / Reading 判斷題 / Speaking Part 2 / Writing Task 1+2
//  題型:opts 選擇題(第 0 個為正解,顯示時洗牌);a 填空題(可接受答案陣列)
// ============================================================

// ---------- 雅思核心字彙(6 主題 × 10 字,與多益/托福字庫不重複)----------
const IELTS_WORDS = [
  { theme: "圖表趨勢", emoji: "📈", list: [
    { w: "soar", zh: "急遽上升", pos: "v." },
    { w: "plummet", zh: "暴跌", pos: "v." },
    { w: "fluctuate", zh: "波動;起伏", pos: "v." },
    { w: "peak", zh: "達到高峰", pos: "v./n." },
    { w: "decline", zh: "下降;衰退", pos: "v./n." },
    { w: "steady", zh: "平穩的", pos: "adj." },
    { w: "gradual", zh: "逐漸的", pos: "adj." },
    { w: "dramatic", zh: "劇烈的", pos: "adj." },
    { w: "proportion", zh: "比例", pos: "n." },
    { w: "majority", zh: "多數", pos: "n." },
  ]},
  { theme: "環境永續", emoji: "🌍", list: [
    { w: "emission", zh: "排放(物)", pos: "n." },
    { w: "renewable", zh: "可再生的", pos: "adj." },
    { w: "depletion", zh: "耗竭", pos: "n." },
    { w: "conservation", zh: "保育;保存", pos: "n." },
    { w: "pollutant", zh: "污染物", pos: "n." },
    { w: "sustainable", zh: "永續的", pos: "adj." },
    { w: "deforestation", zh: "森林砍伐", pos: "n." },
    { w: "carbon", zh: "碳", pos: "n." },
    { w: "habitat", zh: "棲地", pos: "n." },
    { w: "landfill", zh: "掩埋場", pos: "n." },
  ]},
  { theme: "教育議題", emoji: "🏫", list: [
    { w: "curriculum", zh: "課程(總稱)", pos: "n." },
    { w: "literacy", zh: "識字能力;素養", pos: "n." },
    { w: "vocational", zh: "職業的;技職的", pos: "adj." },
    { w: "compulsory", zh: "義務的;強制的", pos: "adj." },
    { w: "assessment", zh: "評量", pos: "n." },
    { w: "motivation", zh: "動機", pos: "n." },
    { w: "discipline", zh: "紀律;學科", pos: "n." },
    { w: "graduate", zh: "畢業生;畢業", pos: "n./v." },
    { w: "peer", zh: "同儕", pos: "n." },
    { w: "aptitude", zh: "性向;天分", pos: "n." },
  ]},
  { theme: "科技社會", emoji: "💻", list: [
    { w: "automation", zh: "自動化", pos: "n." },
    { w: "innovation", zh: "創新", pos: "n." },
    { w: "surveillance", zh: "監控", pos: "n." },
    { w: "algorithm", zh: "演算法", pos: "n." },
    { w: "digital", zh: "數位的", pos: "adj." },
    { w: "obsolete", zh: "過時的", pos: "adj." },
    { w: "breakthrough", zh: "突破", pos: "n." },
    { w: "privacy", zh: "隱私", pos: "n." },
    { w: "infrastructure", zh: "基礎建設", pos: "n." },
    { w: "disruption", zh: "顛覆;中斷", pos: "n." },
  ]},
  { theme: "健康醫療", emoji: "🩺", list: [
    { w: "obesity", zh: "肥胖(症)", pos: "n." },
    { w: "nutrition", zh: "營養", pos: "n." },
    { w: "sedentary", zh: "久坐不動的", pos: "adj." },
    { w: "epidemic", zh: "流行病", pos: "n." },
    { w: "therapy", zh: "治療;療法", pos: "n." },
    { w: "immune", zh: "免疫的", pos: "adj." },
    { w: "chronic", zh: "慢性的", pos: "adj." },
    { w: "wellbeing", zh: "身心健康", pos: "n." },
    { w: "diagnosis", zh: "診斷", pos: "n." },
    { w: "lifespan", zh: "壽命", pos: "n." },
  ]},
  { theme: "都市與交通", emoji: "🚇", list: [
    { w: "congestion", zh: "壅塞", pos: "n." },
    { w: "commute", zh: "通勤", pos: "v./n." },
    { w: "pedestrian", zh: "行人", pos: "n." },
    { w: "suburb", zh: "郊區", pos: "n." },
    { w: "density", zh: "密度", pos: "n." },
    { w: "residential", zh: "住宅的", pos: "adj." },
    { w: "affordable", zh: "負擔得起的", pos: "adj." },
    { w: "sprawl", zh: "(都市)蔓延", pos: "n./v." },
    { w: "amenity", zh: "生活機能設施", pos: "n." },
    { w: "hub", zh: "樞紐;中心", pos: "n." },
  ]},
];

// ---------- Reading:True / False / Not Given + 句子填空 ----------
// tfng:statements 的 ans 為 "True" | "False" | "Not Given"
const IELTS_READING = [
  { id: "ir1", field: "都市交通", icon: "🚋", title: "The Return of the Urban Tram",
    text: "By the middle of the twentieth century, the tram had almost vanished from Western cities. Systems that had carried millions were dismantled within a decade, often with public support, because trams were seen as slow obstacles to the private car. Rails were paved over, and the space they had occupied was given to traffic lanes.\n\nThe reversal began in the 1980s in medium-sized European cities. Nantes reopened a line in 1985, and Strasbourg followed in 1994 with a system deliberately routed through its historic centre. Neither city argued that trams were faster than cars; the case was made on capacity and on the character of the street. A single tram can carry the passengers of roughly three buses, and because the route is fixed and visible, shops and housing tend to cluster along it.\n\nEvaluations of these projects are mixed. Ridership targets were met in Strasbourg but missed in several French cities that copied the model without restricting parking in the centre. Where cars retained free access, the tram simply absorbed former bus passengers rather than drivers. The lesson repeated by transport researchers is that a tram changes travel behaviour only when it is introduced together with measures that make driving less convenient.",
    tfng: [
      { s: "Tram systems were removed in the twentieth century despite strong public opposition.", ans: "False", note: "文中說拆除 often with public support(常有民眾支持),與「強烈反對」矛盾 → False。" },
      { s: "Strasbourg's tram line was planned to pass through the old city centre.", ans: "True", note: "a system deliberately routed through its historic centre → True。" },
      { s: "Trams in Nantes are more expensive to operate than buses.", ans: "Not Given", note: "全文沒有比較營運成本,只比較載客量 → Not Given(沒提到 ≠ 錯誤)。" },
      { s: "Some French cities failed to reach their passenger targets.", ans: "True", note: "missed in several French cities that copied the model → True。" },
      { s: "Researchers believe trams alone are enough to reduce car use.", ans: "False", note: "研究者說必須搭配讓開車變不方便的措施 → 與「單靠電車就夠」相反。" },
    ],
    gaps: [
      { q: "One tram can carry about as many passengers as three ______.", a: ["buses", "bus"], note: "A single tram can carry the passengers of roughly three buses。" },
      { q: "Where cities did not restrict ______ in the centre, drivers did not switch to the tram.", a: ["parking"], note: "without restricting parking in the centre → 答案照抄原文單字。" },
    ]},

  { id: "ir2", field: "健康科學", icon: "😴", title: "Sleep and the Teenage Brain",
    text: "Adolescents are often described as lazy for sleeping late, but the pattern has a biological basis. During puberty the release of melatonin, the hormone that signals the onset of sleep, shifts later by about two hours. A teenager who feels alert at eleven at night is not being difficult; the internal clock has moved.\n\nThis creates a conflict with school timetables. Most secondary schools begin between half past seven and eight, which requires students to wake during the phase when their bodies are least prepared. Sleep researchers estimate that adolescents need between eight and ten hours a night, and surveys in several countries suggest that a majority obtain fewer than seven on school days.\n\nA number of districts have tested later starting times. In Seattle, schools that moved the first lesson from 7:50 to 8:45 recorded an average gain of thirty-four minutes of sleep per student, together with improved attendance and higher grades in the first period. Critics point out that later starts complicate transport schedules and after-school employment, and that the effect on grades has not been measured over more than a few years. The evidence on sleep itself, however, is now consistent across studies.",
    tfng: [
      { s: "The timing of melatonin release changes during adolescence.", ans: "True", note: "the release of melatonin … shifts later by about two hours → True。" },
      { s: "Most teenagers sleep for the recommended eight to ten hours on school nights.", ans: "False", note: "調查顯示多數人上學日睡不到七小時 → 與敘述相反。" },
      { s: "The Seattle study found students gained over an hour of extra sleep.", ans: "False", note: "實際為平均 34 分鐘,不到一小時。" },
      { s: "Later school starts are more expensive for local governments.", ans: "Not Given", note: "文中只提交通與打工安排變複雜,沒有談成本 → Not Given。" },
      { s: "The long-term effect of later starts on grades is still uncertain.", ans: "True", note: "the effect on grades has not been measured over more than a few years → True。" },
    ],
    gaps: [
      { q: "During puberty, the body clock moves later by roughly ______ hours.", a: ["two", "2"], note: "shifts later by about two hours。" },
      { q: "In Seattle the first lesson was moved to ______.", a: ["8:45", "845"], note: "moved the first lesson from 7:50 to 8:45。" },
    ]},

  { id: "ir3", field: "農業科技", icon: "🥬", title: "Vertical Farming: Promise and Limits",
    text: "Vertical farms grow crops on stacked trays inside sealed buildings, under lights tuned to the wavelengths plants actually use. Because the environment is controlled, harvests are unaffected by weather, and water can be recycled: producers commonly report using less than five per cent of the water required by open fields for the same yield.\n\nThe constraint is energy. Sunlight is free, and replacing it with electricity is expensive enough to shape the entire business. Nearly all commercial vertical farms therefore grow leafy greens and herbs, which are light in weight, sell at a high price per kilogram, and mature in weeks. Staple crops such as wheat and rice, which need far more light per calorie produced, remain uneconomic by a wide margin.\n\nAdvocates argue that the calculation will change as renewable electricity becomes cheaper and as land near cities becomes scarcer. Sceptics reply that the same cheap electricity would deliver larger environmental gains if used to replace fossil fuels elsewhere, and that transporting lettuce is not a major source of emissions in the first place. Both sides agree that vertical farming is best understood not as a replacement for agriculture but as a supplement located where fresh produce is otherwise difficult to obtain.",
    tfng: [
      { s: "Vertical farms use less water than conventional fields.", ans: "True", note: "using less than five per cent of the water required by open fields → True。" },
      { s: "Most commercial vertical farms grow a wide variety of staple crops.", ans: "False", note: "文中說幾乎都種葉菜與香草,主食作物仍不符經濟效益。" },
      { s: "Vertical farms employ fewer workers than traditional farms.", ans: "Not Given", note: "全文未提到人力 → Not Given。" },
      { s: "Critics say cheap electricity could produce bigger benefits in other sectors.", ans: "True", note: "Sceptics reply that the same cheap electricity would deliver larger environmental gains … elsewhere → True。" },
      { s: "Supporters and critics disagree about whether vertical farming can replace agriculture.", ans: "False", note: "Both sides agree 它是補充而非取代 → 雙方在此點上一致。" },
    ],
    gaps: [
      { q: "The main limitation on vertical farming is the cost of ______.", a: ["energy", "electricity"], note: "The constraint is energy;後文說電力昂貴。" },
      { q: "Leafy greens are grown because they mature in ______.", a: ["weeks", "week"], note: "mature in weeks。" },
    ]},
];

// ---------- Listening:Section 1–4(填空題 + 選擇題混合)----------
const IELTS_LISTENING = [
  { id: "s1", section: "Section 1", kind: "社交對話", title: "租屋詢問", icon: "🏠",
    lines: [
      { sp: "W", en: "Good morning, Riverside Lettings. How can I help you?" },
      { sp: "M", en: "Hi, I'm calling about the two-bedroom flat advertised on Mill Street. Is it still available?" },
      { sp: "W", en: "It is. The rent is four hundred and eighty pounds a month, and that includes water but not electricity." },
      { sp: "M", en: "And is there a deposit?" },
      { sp: "W", en: "Yes, six hundred pounds, refundable at the end of the tenancy. We can arrange a viewing on Thursday afternoon." },
      { sp: "M", en: "Thursday works. My name is Daniel Hart, and my mobile number is oh seven nine double one, three four two six." },
    ],
    questions: [
      { q: "The flat is on ______ Street.", a: ["mill"], note: "the two-bedroom flat advertised on Mill Street。填空題只寫題目要求的字數。" },
      { q: "Monthly rent: £______", a: ["480", "four hundred and eighty"], note: "four hundred and eighty pounds a month。數字題直接寫阿拉伯數字最保險。" },
      { q: "The rent includes ______ but not electricity.", a: ["water"], note: "includes water but not electricity。" },
      { q: "Deposit: £______", a: ["600", "six hundred"], note: "six hundred pounds, refundable。" },
      { q: "When will the viewing take place?", opts: ["On Thursday afternoon", "On Tuesday morning", "On Friday evening", "On Wednesday afternoon"], note: "We can arrange a viewing on Thursday afternoon。" },
    ]},

  { id: "s2", section: "Section 2", kind: "獨白", title: "社區中心導覽", icon: "🏛️",
    lines: [
      { sp: "W", en: "Welcome to the Eastgate Community Centre. I'll take a few minutes to explain what we offer before the tour begins." },
      { sp: "W", en: "The main hall on the ground floor is used for exercise classes on weekday mornings and for markets at the weekend." },
      { sp: "W", en: "Upstairs you'll find two rooms available for hire. The larger one seats forty people and must be booked at least a week in advance." },
      { sp: "W", en: "Our most popular service is the free advice desk, which now opens on Tuesdays and Thursdays rather than only on Tuesdays as before." },
      { sp: "W", en: "Please note the car park behind the building is reserved for staff. Visitors should use the public car park on Cannon Road." },
      { sp: "W", en: "Finally, membership costs twelve pounds a year, but it's free for anyone under eighteen or over sixty-five." },
    ],
    questions: [
      { q: "What has recently changed about the advice desk?", opts: ["It is open on more days than before", "It has moved to the ground floor", "It now charges a small fee", "It is only for members"], note: "now opens on Tuesdays and Thursdays rather than only on Tuesdays as before → 開放天數增加。" },
      { q: "The larger upstairs room must be booked at least ______ in advance.", a: ["a week", "one week", "week"], note: "must be booked at least a week in advance。" },
      { q: "Where should visitors park?", opts: ["In the public car park on Cannon Road", "Behind the building", "In the main hall car park", "On Eastgate Street"], note: "後方停車場保留給員工,訪客用 Cannon Road 的公共停車場。" },
      { q: "Annual membership costs £______ for most people.", a: ["12", "twelve"], note: "membership costs twelve pounds a year。" },
    ]},

  { id: "s3", section: "Section 3", kind: "學術討論", title: "報告分工討論", icon: "🎓",
    lines: [
      { sp: "M", en: "So, for the group report on urban green space, I think we should split it into three parts rather than four." },
      { sp: "W", en: "Agreed. If we each take a section, we can spend the last week editing instead of writing." },
      { sp: "M", en: "I'll do the literature review, since I've already read most of the papers Dr. Okafor recommended." },
      { sp: "W", en: "Then I'll handle the survey data. But we still need someone for the case study of the Fairfield park redevelopment." },
      { sp: "M", en: "Let's ask Priya. She grew up in that area, and she interviewed two of the planners last term." },
      { sp: "W", en: "Good idea. One more thing — the tutor said the word limit is strict, so we should agree on three thousand words total before we start." },
    ],
    questions: [
      { q: "Why do the students decide on three sections?", opts: ["To leave time for editing at the end", "Because one member has dropped out", "Because the tutor requires three sections", "To reduce the amount of reading"], note: "we can spend the last week editing instead of writing。" },
      { q: "The man will write the ______ review.", a: ["literature"], note: "I'll do the literature review。" },
      { q: "Why do they suggest Priya for the case study?", opts: ["She has already interviewed planners involved", "She has the most free time", "She lives near the university", "She has written case studies before"], note: "she interviewed two of the planners last term(且在當地長大)。" },
      { q: "The total word limit is ______ words.", a: ["3000", "3,000", "three thousand"], note: "three thousand words total。" },
    ]},

  { id: "s4", section: "Section 4", kind: "學術講座", title: "講座:城市綠地與降溫", icon: "🌳",
    lines: [
      { sp: "M", en: "In today's lecture I want to examine how vegetation affects temperature in dense urban areas." },
      { sp: "M", en: "Cities are typically warmer than the surrounding countryside, an effect known as the urban heat island. In large cities the difference can reach five degrees at night." },
      { sp: "M", en: "Trees reduce this in two ways. The obvious one is shade, which keeps surfaces from absorbing heat during the day." },
      { sp: "M", en: "The second mechanism is evaporation. Water released through the leaves cools the surrounding air, much as sweating cools the skin." },
      { sp: "M", en: "The practical implication is that scattered street trees often outperform a single large park, because the cooling effect extends only about thirty metres from the canopy." },
      { sp: "M", en: "For planners, then, the priority is distribution rather than total area — a point that is still frequently overlooked in city design." },
    ],
    questions: [
      { q: "The temperature difference between a large city and the countryside at night can reach ______ degrees.", a: ["five", "5"], note: "the difference can reach five degrees at night。" },
      { q: "Apart from shade, trees cool cities through ______.", a: ["evaporation"], note: "The second mechanism is evaporation。" },
      { q: "Why does the lecturer say street trees can be more effective than one large park?", opts: ["The cooling effect reaches only a short distance", "Street trees are cheaper to plant", "Parks are usually built outside the city", "Street trees grow faster in cities"], note: "cooling effect extends only about thirty metres from the canopy → 分散比集中有效。" },
      { q: "For planners the priority should be ______ rather than total area.", a: ["distribution"], note: "the priority is distribution rather than total area。" },
    ]},
];

// ---------- Speaking Part 2:Cue Card(1 分鐘準備 + 2 分鐘作答)----------
const IELTS_SPEAKING = [
  { id: "cue1", topic: "人物", icon: "🧑‍🏫",
    title: "Describe a person who taught you something important",
    bullets: ["who this person is", "what they taught you", "how they taught it", "and explain why it was important to you"],
    zh: "描述一位教會你重要事情的人:他是誰、教了你什麼、怎麼教的,並說明為何重要。",
    prep: 60, speak: 120,
    keys: [["person", "teacher", "coach", "uncle", "aunt", "friend", "manager"], ["taught", "teach", "showed", "learn"], ["because", "since", "reason", "why"], ["example", "instance", "remember", "one day", "when i"], ["important", "changed", "influence", "still", "now"]],
    part3: ["Do you think the most important lessons are learned inside or outside school?", "How has the role of teachers changed in the last twenty years?", "Should older people be encouraged to keep learning new skills?"],
    tips: ["用 60 秒把四個 bullet 各寫兩個字的筆記,答題時照順序走就不會卡住。", "2 分鐘很長:每個 bullet 至少講 3 句,最後一個 bullet(why)講最多。", "說一個具體事件比形容詞更有效:不要只說 he was kind,要說他做了什麼。", "沒話說時用 What I mean is… / To give you an example… 自然延伸,不要停頓超過 3 秒。"],
    sample: "I'd like to talk about my high school chemistry teacher, Mr. Chen. What he taught me wasn't really chemistry — it was how to be wrong without giving up. In my second year I failed a test badly, and I expected him to tell me to work harder. Instead, he asked me to explain my wrong answers out loud, question by question. It took nearly an hour. He kept asking why I had chosen each answer, and by the end I could see that most of my mistakes came from one misunderstanding about balancing equations, not from ten separate gaps. He did this with anyone who asked, usually after school in an empty classroom. This mattered to me because it changed what a mistake meant. Before that, a low mark just felt like proof that I wasn't clever enough. Afterwards, I started treating errors as information about what to fix next. I still do this at university — whenever I lose marks, I go through the paper and sort the mistakes into groups. So although I've forgotten most of the chemistry, that habit has stayed with me for years." },

  { id: "cue2", topic: "地點", icon: "🏙️",
    title: "Describe a place in your city that has changed a lot",
    bullets: ["where it is", "what it was like before", "how it has changed", "and explain how you feel about the change"],
    zh: "描述你所在城市中改變很大的地方:位置、以前的樣子、如何改變,以及你對這個改變的感受。",
    prep: 60, speak: 120,
    keys: [["place", "area", "district", "street", "station", "market", "river"], ["before", "used to", "previously", "years ago"], ["changed", "change", "become", "now", "rebuilt", "developed"], ["example", "instance", "remember", "when i"], ["feel", "think", "mixed", "glad", "sad", "prefer"]],
    part3: ["Do you think cities change too quickly nowadays?", "Who should decide how a neighbourhood is developed?", "What are the disadvantages of building new housing in old areas?"],
    tips: ["過去與現在的對比是這題的核心,大量使用 used to / would / whereas now。", "感受不要只說 I like it,要說出取捨:方便了什麼、失去了什麼。", "把時間軸講清楚:ten years ago → after the renovation → these days。", "如果詞窮,就多描述一個細節場景(氣味、店家、人潮)撐時間。"],
    sample: "I'd like to describe the area around the old railway station in my city, which is about fifteen minutes from where I live. When I was a child, it was honestly a place my parents told me to avoid after dark. There were a lot of empty warehouses, the lighting was poor, and apart from a few noodle shops that opened early for railway workers, almost nothing was there. About eight years ago the city moved the freight yard out and redeveloped the whole area. Now the warehouses have been converted into cafés, a public library and a small design market that opens at weekends. They also widened the pavements and planted trees along the main road, so people actually walk there in the evening. My feelings about it are mixed, to be honest. I'm glad the area is safe and useful now, and I go to that library almost every week. But the rents have risen sharply, and most of the original noodle shops have closed. So while I think the change was necessary overall, I do think the city could have protected the older businesses better." },

  { id: "cue3", topic: "經驗", icon: "🧩",
    title: "Describe a difficult decision you had to make",
    bullets: ["what the decision was", "what the options were", "how you decided", "and explain whether it was the right choice"],
    zh: "描述你曾做過的一個困難決定:是什麼決定、有哪些選項、你如何做決定,以及是否是對的選擇。",
    prep: 60, speak: 120,
    keys: [["decision", "decide", "choice", "choose"], ["option", "either", "alternative", "instead"], ["because", "since", "reason", "why"], ["example", "instance", "when i", "at that time"], ["right", "wrong", "regret", "looking back", "now"]],
    part3: ["Do young people today face more difficult decisions than in the past?", "Is it better to make decisions quickly or slowly?", "How much should parents influence a young person's career choice?"],
    tips: ["先用一句話說清楚決定本身,再展開,不要讓考官聽半天還不知道你在選什麼。", "兩個選項要各講清楚利弊,這是展現 comparison 語言的機會。", "「怎麼決定」講方法(問了誰、列了什麼),不要只說 I just felt it。", "最後一段用 Looking back / In hindsight 做評價,展示反思能力。"],
    sample: "The decision I want to talk about was whether to change my major at the end of my first year at university. I had started in business management, mainly because my family expected it, but I had taken one elective in statistics and found it far more interesting than anything in my own department. So the two options were fairly clear. I could stay in business, finish comfortably with good marks and a familiar path, or I could switch to data science, which meant repeating some first-year courses and graduating a year later. The financial side worried me most, because the extra year wasn't cheap. What helped me decide was talking to people rather than thinking alone. I asked three students in the data science programme what their week actually looked like, and I asked my part-time manager what skills his company struggled to hire. Both conversations pointed the same way. Looking back, I'm fairly confident it was the right choice. The extra year was hard, and I did lose contact with my original classmates. But I now work in an area I find genuinely interesting, and I doubt I would have said that about management." },

  { id: "cue4", topic: "物品", icon: "📱",
    title: "Describe a piece of technology you find useful",
    bullets: ["what it is", "how often you use it", "what you use it for", "and explain why it is useful to you"],
    zh: "描述一項你覺得有用的科技產品:是什麼、多常使用、用來做什麼,以及為何對你有用。",
    prep: 60, speak: 120,
    keys: [["technology", "app", "phone", "device", "software", "computer", "watch"], ["use", "using", "every day", "daily", "often"], ["because", "since", "reason", "why"], ["example", "instance", "when i", "for instance"], ["useful", "save", "help", "easier", "without it"]],
    part3: ["Do you think people rely on technology too much?", "How has technology changed the way families communicate?", "Should schools limit students' use of devices in class?"],
    tips: ["選一個你真的每天用的東西,細節才講得出來。", "「多常用」不要只說 every day,說出使用情境(通勤時、睡前、上課前)。", "用一個「沒有它會怎樣」的假設句展現文法:Without it, I would probably…", "最後回到 why,並連到具體好處(省時間、減少焦慮、幫助學習)。"],
    sample: "The piece of technology I'd like to describe is a note-taking app called Obsidian, which I've been using for about two years. I use it every single day, usually first thing in the morning and again before I go to bed. Essentially it's a place where I keep everything I read: lecture notes, articles, quotations, and half-formed ideas for essays. What makes it different from a normal notebook is that I can link notes to each other, so when I open a note about, say, urban planning, I can immediately see every other note I've connected to it. I mainly use it for university work. When I write an essay, I search my own notes first, and quite often I find something I read six months earlier and had completely forgotten. It's useful to me for two reasons. First, it saves a huge amount of time, because I'm no longer rereading the same articles. Second, and more importantly, it reduces the anxiety of starting something new — I always begin with material I already have. Without it, I think my writing process would be far more chaotic than it is." },
];

// ---------- Writing Task 1(圖表描述,150 字)+ Task 2(議論文,250 字)----------
const IELTS_WRITING = [
  { id: "wt1", task: 1, icon: "📊", minWords: 150, minutes: 20,
    title: "Household energy use by source",
    prompt: "The chart below shows the percentage of household energy in one country supplied by four sources in 2005 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    zh: "Task 1(20 分鐘・150 字):描述圖表主要特徵並做比較。切記:只描述數據,不要解釋原因,也不要加入個人意見。",
    chart: { unit: "%", categories: ["Coal", "Natural gas", "Wind", "Solar"], series: [{ name: "2005", values: [52, 30, 12, 6] }, { name: "2023", values: [18, 27, 34, 21] }] },
    keys: [["coal"], ["gas"], ["wind"], ["solar"], ["2005", "2023"]],
    tips: ["結構:1 句改寫題目 → 1 段 overview(2 句,講最大趨勢)→ 2 段細節數據。", "Overview 是評分關鍵,一定要有,而且不能出現任何數字以外的猜測原因。", "數據要選寫不要全抄:最高、最低、變化最大、交叉點。", "用 compared with / whereas / while 做對比,並變換表達:rose to / a rise of / an increase in。"],
    sample: "The chart compares the proportion of household energy supplied by four sources in one country in 2005 and 2023.\n\nOverall, the country moved away from fossil fuels towards renewable sources over the period. While coal was by far the dominant source in 2005, it had fallen to the smallest share of the four by 2023, and wind had replaced it as the leading source.\n\nIn 2005, coal accounted for 52% of household energy, followed by natural gas at 30%. Wind and solar together supplied less than a fifth of the total, at 12% and 6% respectively.\n\nBy 2023 the picture had changed considerably. Coal had dropped by 34 percentage points to just 18%, while wind had almost tripled to 34%, making it the largest single source. Solar showed the greatest proportional growth, rising from 6% to 21%. Natural gas was the most stable source, declining only slightly from 30% to 27%." },

  { id: "wt2", task: 1, icon: "📈", minWords: 150, minutes: 20,
    title: "Journeys to work in a European city",
    prompt: "The chart below shows how people in a European city travelled to work in 2000, 2012 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    zh: "Task 1(20 分鐘・150 字):三個年份的比較。有三組數據時,更要挑重點寫,不要逐格朗讀。",
    chart: { unit: "%", categories: ["Car", "Public transport", "Cycling", "Walking"], series: [{ name: "2000", values: [61, 24, 6, 9] }, { name: "2012", values: [48, 30, 13, 9] }, { name: "2024", values: [33, 34, 24, 9] }] },
    keys: [["car"], ["public transport", "transport"], ["cycling", "bicycle", "bike"], ["walking"], ["2000", "2012", "2024"]],
    tips: ["三個年份時,先看整體方向再看個別:哪個持續上升?哪個持平?", "持平的項目也要寫進 overview(此題 walking 全期不變,是個好對比點)。", "描述交叉:public transport overtook the car between 2012 and 2024。", "小心時態:過去年份用過去式,不要寫成現在式。"],
    sample: "The chart illustrates the means of transport used to commute to work in a European city in 2000, 2012 and 2024.\n\nOverall, car use declined sharply across the period while cycling and public transport both grew, so that by 2024 no single mode was clearly dominant. Walking, in contrast, remained completely unchanged throughout.\n\nIn 2000, the car was the dominant choice, accounting for 61% of journeys, roughly two and a half times the share of public transport at 24%. Cycling was marginal at only 6%.\n\nOver the following 24 years, car use fell steadily to 48% and then to just 33%. Public transport rose more gradually, from 24% to 34%, overtaking the car by 2024. The most striking change was in cycling, which quadrupled from 6% to 24% and by 2024 had almost caught up with the car. Walking, by contrast, accounted for exactly 9% of journeys in all three years, making it the only mode that did not change at all over the period." },

  { id: "wt3", task: 2, icon: "✍️", minWords: 250, minutes: 40,
    title: "Working from home",
    prompt: "Some people believe that allowing employees to work from home benefits both companies and workers. Others argue that it damages teamwork and career development. Discuss both views and give your own opinion.",
    zh: "Task 2(40 分鐘・250 字):討論雙方觀點並提出自己的立場。必須真的寫兩邊,且立場要從頭到尾一致。",
    keys: [["home", "remote"], ["company", "companies", "employer", "business"], ["employee", "worker", "staff"], ["teamwork", "collaboration", "career", "promotion", "training"], ["opinion", "view", "believe", "argue"]],
    tips: ["Discuss both views 題型必須兩邊都寫成一段,只寫自己那邊會嚴重扣分。", "四段結構:引言(改寫題目+表明立場)→ 第一種觀點 → 第二種觀點 → 結論。", "每段一個主題句 + 2 個支持句 + 1 個例子,不要一段塞三個論點。", "立場可以是「有條件同意」,但引言與結論的立場必須一致。"],
    sample: "Since the pandemic, remote work has moved from an exception to a standard option in many industries. While some regard it as a benefit for employers and staff alike, others warn that it weakens collaboration and slows career progression. In my view, both effects are real, and the outcome depends largely on how remote work is organised.\n\nThose who support home working point to measurable gains on both sides. Employees save the time and cost of commuting, which in large cities can amount to two hours a day, and they gain flexibility to manage family responsibilities. Employers, meanwhile, reduce spending on office space and can recruit from a far wider geographical area. A software company in my country, for example, closed two of its four offices after moving to a hybrid model and reported no fall in output.\n\nCritics, however, raise a genuine concern about development rather than productivity. Junior employees in particular learn by overhearing conversations, asking quick questions and observing how senior colleagues handle problems, and none of this happens easily through scheduled video calls. There is also evidence that people who are physically present are promoted more often, which may disadvantage those who work remotely.\n\nIn conclusion, I believe home working benefits organisations and experienced staff, but carries real risks for those at the start of their careers. The sensible response is not to choose between the two models but to require regular in-person time for training and mentoring, while leaving routine tasks to be done wherever the employee works best." },

  { id: "wt4", task: 2, icon: "🎒", minWords: 250, minutes: 40,
    title: "Compulsory subjects at school",
    prompt: "Some people think that all school subjects should be compulsory until students leave school. Others believe students should be allowed to choose their own subjects from the age of fifteen. Discuss both views and give your own opinion.",
    zh: "Task 2(40 分鐘・250 字):教育類題目。注意「必修 vs 選修」的年齡界線是題目給的重點,不要忽略。",
    keys: [["compulsory", "required", "core"], ["choose", "choice", "optional", "elective"], ["students", "pupils", "school"], ["subject", "subjects", "curriculum"], ["opinion", "view", "believe", "argue"]],
    tips: ["注意題目給的年齡(fifteen),論述要扣住這個界線,不要泛談教育。", "教育題最好舉學科例子(數學、母語、藝術),抽象論述容易空洞。", "承認對方觀點的合理處再反駁,比全盤否定更能拿高分。", "結論不要引入新論點,只總結並重申立場。"],
    sample: "Whether teenagers should follow a fixed curriculum or select their own subjects is a long-standing debate in education policy. Supporters of compulsory study argue that breadth protects students from premature choices, while others believe that allowing specialisation from the age of fifteen produces deeper learning and higher motivation. I believe a limited core combined with genuine choice is the strongest arrangement.\n\nThe argument for keeping subjects compulsory rests on the unpredictability of adolescence. A fifteen-year-old rarely knows which field will interest them at twenty-five, and dropping mathematics or a second language at that age can close doors permanently. Broad study also produces citizens who can read a statistical claim or a historical argument critically, which benefits society rather than only the individual.\n\nThose in favour of choice respond that compulsory subjects are often studied without engagement, and that time spent resenting a subject teaches very little. For example, a student who abandons chemistry in order to study economics, music and history seriously is likely to develop stronger analytical habits than one who covers eight subjects superficially. Motivation, they argue, is itself a condition for learning rather than a luxury.\n\nIn my opinion, both positions identify something correct, and the disagreement is really about how large the core should be. I would keep the national language, mathematics and one science compulsory to the end of school, since these underpin almost all later study, and allow students to choose everything else from fifteen. This preserves the essential foundations while acknowledging that genuine interest, not obligation, is what makes teenagers work hard." },
];
