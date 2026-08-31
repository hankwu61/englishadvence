// ============================================================
//  💼 多益 TOEIC 13 大情境課文
//  每篇:情境短文(逐字高亮朗讀 + 點字彈窗)、核心字彙、常用句、理解測驗
//  aid 使用 p_ts_<id>,時間戳由 generate_timings.py 一併產生
// ============================================================

const TOEIC_SCENES = [
  { id: "corp", no: 1, name: "企業發展", en: "Corporate Development", icon: "🏗️", doc: "公司公告",
    title: "A Quiet Merger",
    text: "When Halden Systems announced that it would acquire Brightline Analytics, most employees learned about it from a two-paragraph press release. The acquisition had been negotiated for eleven months, but only nine people knew before the announcement. Under the terms of the agreement, Brightline will operate as a subsidiary for two years and keep its own brand. Its founder will join the board of the parent company. Halden expects the deal to close by the end of the third quarter, once regulators approve it. The stated reason for the purchase is access to Brightline's patents rather than its customers. Analysts noted that Halden had spent four years trying to develop similar technology in house without success. For staff at both companies, the practical questions are simpler: which office will remain open, and whether the two engineering teams will be merged.",
    zh: "當 Halden Systems 宣布收購 Brightline Analytics 時,多數員工是從一則兩段的新聞稿得知的。這樁併購談了十一個月,但公布前只有九個人知情。依協議條件,Brightline 將以子公司形式運作兩年並保留自有品牌,創辦人將加入母公司董事會。只要主管機關核准,Halden 預計第三季底完成交易。收購的公開理由是取得 Brightline 的專利,而非其客戶。分析師指出,Halden 曾花四年自行研發類似技術卻未成功。對兩家公司的員工而言,關心的問題更實際:哪個辦公室會保留、兩邊的工程團隊會不會合併。",
    words: [
      { w: "acquire", zh: "收購;取得", pos: "v." }, { w: "merger", zh: "合併;併購案", pos: "n." },
      { w: "subsidiary", zh: "子公司", pos: "n." }, { w: "patent", zh: "專利", pos: "n." },
      { w: "regulator", zh: "主管機關", pos: "n." }, { w: "quarter", zh: "季(三個月)", pos: "n." },
    ],
    phrases: [
      { en: "Under the terms of the agreement", zh: "依協議條件" },
      { en: "The deal is expected to close by the end of the quarter.", zh: "這筆交易預計於本季底完成。" },
      { en: "pending regulatory approval", zh: "有待主管機關核准" },
    ],
    questions: [
      { q: "How did most employees find out about the acquisition?", opts: ["From a short press release", "From their supervisors", "At a company meeting", "From the founder directly"], note: "most employees learned about it from a two-paragraph press release。" },
      { q: "What will happen to Brightline after the deal closes?", opts: ["It will run as a subsidiary and keep its brand", "It will be closed immediately", "It will be renamed after Halden", "It will be sold to another company"], note: "operate as a subsidiary for two years and keep its own brand。" },
      { q: "Why did Halden buy the company?", opts: ["To obtain its patents", "To gain its customer list", "To reduce its own staff costs", "To enter a new country"], note: "access to Brightline's patents rather than its customers。" },
    ]},

  { id: "office", no: 2, name: "辦公室", en: "Offices", icon: "🏢", doc: "內部通知",
    title: "The Meeting That Became an Email",
    text: "The operations team used to hold a status meeting every Monday at nine. Twelve people attended, and it usually ran forty minutes past its scheduled end. Last spring the department head tried an experiment: for one month, anything that could be written down would be written down instead. Each member now posts a short update in a shared document before Monday noon, and the meeting itself is limited to items that genuinely need discussion. The change was not popular at first. Several people said they missed hearing what other teams were doing, and two complained that reading updates took as long as listening to them. After three months, however, the meeting averages eighteen minutes, and attendance is optional for anyone with nothing on the agenda. The conference room is now free for most of Monday morning, which other teams have quickly claimed.",
    zh: "營運團隊過去每週一上午九點開進度會議,十二人與會,通常會超時四十分鐘。去年春天部門主管做了個實驗:一個月內,凡是能寫下來的就用寫的。現在每位成員在週一中午前於共用文件貼上簡短進度,會議只保留真正需要討論的事項。這個改變起初並不受歡迎:好幾個人說懷念聽別的團隊在做什麼,兩位抱怨讀進度跟聽一樣花時間。不過三個月後,會議平均只剩十八分鐘,議程上沒有事項的人可自由選擇是否參加。會議室週一上午多半空著,很快就被其他團隊預訂走了。",
    words: [
      { w: "status", zh: "狀態;進度", pos: "n." }, { w: "update", zh: "最新進度", pos: "n./v." },
      { w: "optional", zh: "可選擇的;非強制的", pos: "adj." }, { w: "average", zh: "平均為", pos: "v./n." },
      { w: "claim", zh: "占用;要求", pos: "v." }, { w: "shared", zh: "共用的", pos: "adj." },
    ],
    phrases: [
      { en: "Let's take that offline.", zh: "這件事我們會後再談。" },
      { en: "Could you circulate the agenda beforehand?", zh: "可以先把議程傳給大家嗎?" },
      { en: "I'll follow up with you after the meeting.", zh: "會後我再跟你追蹤這件事。" },
    ],
    questions: [
      { q: "What change did the department head introduce?", opts: ["Written updates instead of spoken ones", "Longer weekly meetings", "Meetings on a different day", "Removing the meeting completely"], note: "anything that could be written down would be written down instead。" },
      { q: "How did people react at first?", opts: ["Some disliked the change", "Everyone welcomed it", "Nobody noticed the difference", "Most refused to take part"], note: "The change was not popular at first。" },
      { q: "What is the result after three months?", opts: ["Meetings are much shorter", "Attendance is now compulsory", "The team meets twice a week", "The conference room was removed"], note: "the meeting averages eighteen minutes(原本約 40 分鐘以上)。" },
    ]},

  { id: "hr", no: 3, name: "人事與招募", en: "Personnel / Recruitment", icon: "👔", doc: "人資通訊",
    title: "Hiring Without the Résumé",
    text: "For its junior developer positions, Kestrel Software no longer reads résumés at the first stage. Applicants are given a small programming task instead, and the submissions are reviewed without names, schools or previous employers attached. Only candidates who pass this stage have their applications opened. The head of recruitment says the aim was not fairness in the abstract but a practical problem: the company kept hiring people from the same three universities and kept getting the same ideas. Two years into the policy, the proportion of new hires without a computer science degree has risen from four per cent to nearly a third. Retention has also improved slightly. The approach has costs, however. Reviewing the tasks takes senior engineers about six hours a week, and some strong applicants withdraw rather than complete an unpaid exercise before any interview.",
    zh: "在招募初階開發人員時,Kestrel Software 第一階段不再看履歷。應徵者改為完成一個小型程式任務,審查時不附姓名、學校與過往雇主,只有通過這關的人履歷才會被打開。招募主管說,目的不是抽象的公平,而是個實際問題:公司一直從同樣那三所大學招人,也一直得到同樣的想法。政策實施兩年後,非資工背景的新進員工比例從 4% 升到將近三分之一,留任率也略有改善。不過這做法有代價:審查任務讓資深工程師每週花掉約六小時,也有些優秀應徵者不願在面試前做無償測驗而退出。",
    words: [
      { w: "applicant", zh: "應徵者", pos: "n." }, { w: "candidate", zh: "候選人", pos: "n." },
      { w: "recruitment", zh: "招募", pos: "n." }, { w: "retention", zh: "留任率", pos: "n." },
      { w: "withdraw", zh: "退出;撤回", pos: "v." }, { w: "proportion", zh: "比例", pos: "n." },
    ],
    phrases: [
      { en: "We'd like to move you forward to the next round.", zh: "我們想讓你進入下一輪。" },
      { en: "The position has been filled internally.", zh: "這個職缺已由內部人員遞補。" },
      { en: "Could you tell me about your notice period?", zh: "能否說明你的離職預告期?" },
    ],
    questions: [
      { q: "What is unusual about Kestrel's hiring process?", opts: ["Résumés are not read at the first stage", "Interviews are held before any test", "Only graduates may apply", "Candidates are hired without any assessment"], note: "no longer reads résumés at the first stage。" },
      { q: "What problem was the policy meant to solve?", opts: ["Hiring people with very similar backgrounds", "A shortage of applicants", "High salary costs", "Slow interview scheduling"], note: "kept hiring people from the same three universities and kept getting the same ideas。" },
      { q: "What drawback is mentioned?", opts: ["It takes senior engineers considerable time", "It increased hiring costs sharply", "It reduced the number of qualified hires", "It made retention worse"], note: "Reviewing the tasks takes senior engineers about six hours a week。" },
    ]},

  { id: "fin", no: 4, name: "財務預算", en: "Finance & Budgeting", icon: "💰", doc: "財務備忘",
    title: "Reading the Budget Line",
    text: "Every department at Marlow Publishing receives a budget each January, and every December some of them rush to spend what is left. The finance director calls this the use-it-or-lose-it problem, and last year she changed the rule that caused it. Departments may now carry forward up to fifteen per cent of an unspent budget into the following year, provided they explain what it is for. The effect was immediate. Equipment orders in December fell by roughly half, and three teams postponed purchases until prices dropped after the holiday season. The policy is not without risk: an accountant pointed out that carried-forward funds can hide poor planning, since a department that consistently overestimates its needs will simply accumulate money. To address this, any amount carried forward for two consecutive years is returned to the central account.",
    zh: "Marlow 出版社每個部門一月都會拿到預算,而每年十二月總有些部門急著把剩下的花掉。財務長把這叫做「不用就沒了」的問題,去年她改掉了造成這現象的規定。現在部門只要說明用途,就可將未動支預算的 15% 以內結轉到隔年。效果立竿見影:十二月的設備採購約減半,三個團隊把採購延到假期後降價再買。這政策並非沒有風險:一位會計師指出,結轉款可能掩蓋規劃不佳的問題,因為長期高估需求的部門只會不斷累積資金。為此,連續兩年結轉的金額會被收回中央帳戶。",
    words: [
      { w: "budget", zh: "預算", pos: "n./v." }, { w: "accountant", zh: "會計師", pos: "n." },
      { w: "overestimate", zh: "高估", pos: "v." }, { w: "consecutive", zh: "連續的", pos: "adj." },
      { w: "allocate", zh: "分配(預算)", pos: "v." }, { w: "unspent", zh: "未動支的", pos: "adj." },
    ],
    phrases: [
      { en: "That expense is over budget this quarter.", zh: "那筆支出這季超出預算了。" },
      { en: "Could you break down these figures for me?", zh: "可以幫我拆解一下這些數字嗎?" },
      { en: "We'll need approval before we release the funds.", zh: "撥款前需要先取得核准。" },
    ],
    questions: [
      { q: "What problem did the new rule address?", opts: ["Departments spending money quickly at year end", "Late payment of invoices", "Departments running out of money in January", "Errors in the accounting software"], note: "the use-it-or-lose-it problem — 年底趕著把錢花完。" },
      { q: "What may departments now do with unspent money?", opts: ["Carry forward up to 15% with an explanation", "Keep all of it automatically", "Transfer it to another department", "Use it only for equipment"], note: "carry forward up to fifteen per cent … provided they explain what it is for。" },
      { q: "What happens to funds carried forward twice in a row?", opts: ["They go back to the central account", "They are doubled the next year", "They must be spent in January", "They are shared between teams"], note: "any amount carried forward for two consecutive years is returned to the central account。" },
    ]},

  { id: "purch", no: 5, name: "採購", en: "Purchasing", icon: "📦", doc: "採購紀錄",
    title: "One Supplier or Three?",
    text: "For eight years, Verity Foods bought all of its packaging from a single supplier. The price was good, the invoices were predictable, and the purchasing team spent very little time on the account. Then a fire at the supplier's plant stopped deliveries for six weeks, and Verity discovered that finding a replacement at short notice costs far more than the discount it had been enjoying. The company now splits its packaging orders between three suppliers, with no single one handling more than half. Unit costs rose by about four per cent. The purchasing manager describes this as insurance rather than waste, and points out that having alternatives has improved her position in every negotiation since. Suppliers who know they can be replaced tend to confirm delivery dates more carefully and are quicker to resolve disputes over damaged goods.",
    zh: "八年來 Verity Foods 所有包裝材料都向單一供應商採購:價格好、發票金額可預期,採購團隊幾乎不用花時間管理這個帳戶。後來供應商廠房失火,供貨中斷六週,Verity 才發現臨時找替代供應商的成本,遠高於原本享有的折扣。公司現在把包裝訂單分給三家供應商,任何一家都不超過一半。單位成本上升約 4%。採購經理形容這是保險而非浪費,並指出手上有替代方案後,她在每次談判中的位置都更有利。知道自己可被取代的供應商,通常會更謹慎確認交期,遇到貨品受損的爭議也處理得更快。",
    words: [
      { w: "supplier", zh: "供應商", pos: "n." }, { w: "packaging", zh: "包裝(材料)", pos: "n." },
      { w: "delivery", zh: "交貨;配送", pos: "n." }, { w: "dispute", zh: "爭議", pos: "n./v." },
      { w: "replacement", zh: "替代者;更換", pos: "n." }, { w: "unit", zh: "單位;單件", pos: "n." },
    ],
    phrases: [
      { en: "Could you send us a revised quotation?", zh: "可以寄一份修訂後的報價單給我們嗎?" },
      { en: "The order was placed on the fifth and shipped on the ninth.", zh: "訂單五號下的,九號出貨。" },
      { en: "We're still waiting on the invoice for last month's order.", zh: "上個月訂單的發票我們還沒收到。" },
    ],
    questions: [
      { q: "What caused Verity Foods to change its purchasing policy?", opts: ["A fire that stopped deliveries", "A sharp rise in packaging prices", "A complaint from customers", "A change of purchasing manager"], note: "a fire at the supplier's plant stopped deliveries for six weeks。" },
      { q: "What is the company's current arrangement?", opts: ["Orders are divided among three suppliers", "One supplier handles everything", "Packaging is produced in house", "Suppliers change every year"], note: "splits its packaging orders between three suppliers。" },
      { q: "What benefit does the manager mention besides security?", opts: ["A stronger position in negotiations", "Lower unit costs", "Faster payment terms", "Fewer purchase orders"], note: "having alternatives has improved her position in every negotiation。" },
    ]},

  { id: "tech", no: 6, name: "技術領域", en: "Technical Areas", icon: "🔧", doc: "技術支援單",
    title: "The Ticket Nobody Could Close",
    text: "The support ticket had been open for five weeks. Users in the Lisbon office reported that the inventory system became unusable every afternoon, but the engineers in Dublin could never reproduce the fault. Logs showed nothing unusual, and the servers were running well below capacity. The problem was eventually solved not by a developer but by an intern who visited Lisbon for an unrelated project. She noticed that the office ran a full backup at two o'clock local time, which saturated the shared network connection. Dublin was testing at ten in the morning, an hour when the connection was quiet. Moving the backup to midnight resolved the issue within a day. The team later added a note to its troubleshooting guide: before examining the software, confirm what else is running on the same network at the same hour.",
    zh: "這張支援單開了五週。里斯本辦公室的使用者回報,庫存系統每天下午就變得無法使用,但都柏林的工程師怎麼都重現不了。日誌看不出異常,伺服器負載也遠低於上限。最後解決問題的不是開發人員,而是一位因別的專案到里斯本出差的實習生。她注意到該辦公室在當地時間兩點執行完整備份,把共用網路連線佔滿了;而都柏林測試的時間是上午十點,那時連線很空閒。把備份改到午夜後,問題一天內就解決。團隊後來在除錯指南加上一條:檢查軟體之前,先確認同一時段同一網路上還有什麼在跑。",
    words: [
      { w: "reproduce", zh: "重現(問題)", pos: "v." }, { w: "capacity", zh: "容量;產能", pos: "n." },
      { w: "backup", zh: "備份", pos: "n." }, { w: "network", zh: "網路", pos: "n." },
      { w: "troubleshooting", zh: "疑難排解", pos: "n." }, { w: "inventory", zh: "庫存", pos: "n." },
    ],
    phrases: [
      { en: "I can't reproduce the issue on my machine.", zh: "我這台機器重現不了這個問題。" },
      { en: "The system will be down for maintenance on Sunday.", zh: "系統週日會停機維護。" },
      { en: "Let me escalate this to the second-level team.", zh: "我把這件事升級給二線團隊處理。" },
    ],
    questions: [
      { q: "Why could the Dublin engineers not find the fault?", opts: ["They tested at a time when the network was quiet", "They had no access to the system", "The logs had been deleted", "The servers were overloaded"], note: "Dublin was testing at ten in the morning, an hour when the connection was quiet。" },
      { q: "What was causing the problem?", opts: ["A backup that filled the network connection", "A faulty server in Lisbon", "An error in the inventory software", "Too many users logging in"], note: "a full backup at two o'clock … saturated the shared network connection。" },
      { q: "What did the team do afterwards?", opts: ["Added advice to the troubleshooting guide", "Replaced the inventory system", "Moved the servers to Lisbon", "Hired more engineers"], note: "added a note to its troubleshooting guide。" },
    ]},

  { id: "manu", no: 7, name: "製造業", en: "Manufacturing", icon: "🏭", doc: "廠務報告",
    title: "Stopping the Line",
    text: "At the Weston assembly plant, any worker may stop the production line. A yellow cord runs the length of the floor, and pulling it halts everything within seconds. New employees are often reluctant to use it, since a single stoppage can cost several thousand euros an hour. The plant manager tells them the opposite is true: a defect that continues down the line costs far more to correct later, and a defect that reaches a customer costs more still. Records support him. In the two years after the cord was introduced, stoppages rose sharply while warranty claims fell by nearly forty per cent. Most stoppages last under three minutes. The plant now tracks how many are called each week and treats a falling number as a warning sign rather than an improvement, since it usually means workers have stopped reporting small problems.",
    zh: "在 Weston 組裝廠,任何一位作業員都可以停下生產線。一條黃色拉繩貫穿整個廠房,一拉幾秒內全線停止。新進員工常不敢用,因為停線一小時可能損失數千歐元。廠長告訴他們事實相反:瑕疵繼續往下流,後段修正成本高得多;若流到客戶手上,代價更大。數據支持他的說法:拉繩導入後兩年,停線次數大增,保固索賠卻下降近四成。多數停線不到三分鐘。工廠現在會統計每週被拉停幾次,並把次數下降視為警訊而非進步,因為那通常代表作業員不再回報小問題了。",
    words: [
      { w: "assembly", zh: "組裝", pos: "n." }, { w: "defect", zh: "瑕疵;缺陷", pos: "n." },
      { w: "stoppage", zh: "停工;停線", pos: "n." }, { w: "warranty", zh: "保固", pos: "n." },
      { w: "reluctant", zh: "不情願的", pos: "adj." }, { w: "plant", zh: "工廠;廠房", pos: "n." },
    ],
    phrases: [
      { en: "The line is running behind schedule.", zh: "產線進度落後了。" },
      { en: "We've had to scrap the whole batch.", zh: "我們得把整批報廢。" },
      { en: "Safety goggles must be worn on the shop floor.", zh: "在廠區內必須配戴護目鏡。" },
    ],
    questions: [
      { q: "Why are new employees hesitant to pull the cord?", opts: ["Stopping the line is expensive", "They are not allowed to use it", "The cord is difficult to reach", "They must report to the manager first"], note: "a single stoppage can cost several thousand euros an hour。" },
      { q: "What happened after the cord was introduced?", opts: ["Warranty claims dropped substantially", "Production costs doubled", "Stoppages became less frequent", "Defects increased"], note: "warranty claims fell by nearly forty per cent。" },
      { q: "Why does the plant worry when stoppages decrease?", opts: ["Workers may be hiding small problems", "It means production has slowed", "The cord may be broken", "Customers may complain less"], note: "it usually means workers have stopped reporting small problems。" },
    ]},

  { id: "travel", no: 8, name: "旅遊", en: "Travel", icon: "✈️", doc: "出差行程",
    title: "A Delay in Frankfurt",
    text: "Ms. Okonjo's connection in Frankfurt was cancelled forty minutes before boarding. The airline offered a seat on a flight leaving nine hours later, which would have made her miss the conference entirely. Instead of joining the queue at the service desk, she called the corporate travel agency her company uses. The agent found two seats on a competitor's afternoon flight and rebooked her within four minutes, while roughly two hundred passengers were still waiting in line. Because the original ticket was fully refundable, the change cost the company nothing beyond a small fare difference. Her hotel reservation in Vienna had to be adjusted as well, since she would now arrive after the desk closed. The agency handled that too, and left a message with the front desk asking them to hold the room and leave a key at reception.",
    zh: "Okonjo 女士在法蘭克福的轉機班次於登機前四十分鐘取消。航空公司提供九小時後的班機,那會讓她整場研討會都趕不上。她沒有去服務櫃檯排隊,而是打給公司合作的商務旅行社。專員在四分鐘內為她找到另一家航空公司下午班機的兩個座位並完成改票,此時仍有約兩百名旅客在排隊。由於原機票可全額退票,這次更改除了小額票價差額外,公司沒有額外支出。她在維也納的訂房也得調整,因為抵達時櫃檯已關。旅行社一併處理了,並留言請櫃檯保留房間、在接待處留一把鑰匙。",
    words: [
      { w: "connection", zh: "轉機班次;銜接", pos: "n." }, { w: "boarding", zh: "登機", pos: "n." },
      { w: "rebook", zh: "改訂;重新訂位", pos: "v." }, { w: "refundable", zh: "可退款的", pos: "adj." },
      { w: "fare", zh: "票價", pos: "n." }, { w: "reception", zh: "接待處", pos: "n." },
    ],
    phrases: [
      { en: "I'd like to check in for the eight o'clock flight to Vienna.", zh: "我要辦八點飛維也納的班機報到。" },
      { en: "Is there an earlier connection available?", zh: "有沒有更早的轉機班次?" },
      { en: "Could I have a late check-out, please?", zh: "可以幫我延後退房嗎?" },
    ],
    questions: [
      { q: "What did Ms. Okonjo do when her flight was cancelled?", opts: ["She contacted her company's travel agency", "She waited at the service desk", "She booked a hotel in Frankfurt", "She returned home"], note: "she called the corporate travel agency her company uses。" },
      { q: "Why did the change cost the company almost nothing?", opts: ["The original ticket was fully refundable", "The airline paid compensation", "The agency waived its fee", "She used loyalty points"], note: "Because the original ticket was fully refundable。" },
      { q: "What problem did her late arrival create?", opts: ["The hotel desk would already be closed", "Her luggage would be delayed", "The conference had been cancelled", "Her visa would expire"], note: "she would now arrive after the desk closed。" },
    ]},

  { id: "ent", no: 9, name: "娛樂與藝文", en: "Entertainment & Media", icon: "🎭", doc: "藝文報導",
    title: "The Exhibition That Moved Twice",
    text: "The Ashworth Gallery had planned its autumn exhibition around forty photographs borrowed from a private collection in Milan. Six weeks before the opening, the lender withdrew half of them without explanation. Rather than cancel, the curator rebuilt the show around what remained, adding work by three photographers who live in the city. Critics who saw both versions of the plan agree the second was stronger. Ticket sales were slow in the first fortnight, partly because the gallery had already printed publicity naming the Milan collection. Attendance improved after a local newspaper ran an interview with one of the added photographers, and the closing weekend sold out. The gallery has since changed its practice: no publicity now names a specific work until the loan agreement has been signed and the pieces are physically in the building.",
    zh: "Ashworth 藝廊原本以向米蘭一位私人收藏家商借的四十張攝影作品為核心規劃秋季展。開幕前六週,出借者未說明原因就撤回其中一半。策展人沒有取消,而是以留下的作品重建展覽,再加入三位在地攝影師的創作。看過兩版規劃的評論者都認為第二版更好。前兩週售票不佳,部分原因是藝廊已印好標明米蘭收藏的宣傳品。當地報紙刊出其中一位新加入攝影師的專訪後,參觀人數回升,閉幕週末更是完售。藝廊自此改變做法:在借展合約簽署、作品實際入館前,宣傳品不再具名任何一件作品。",
    words: [
      { w: "exhibition", zh: "展覽", pos: "n." }, { w: "curator", zh: "策展人", pos: "n." },
      { w: "gallery", zh: "藝廊;美術館", pos: "n." }, { w: "publicity", zh: "宣傳", pos: "n." },
      { w: "attendance", zh: "參觀人數;出席", pos: "n." }, { w: "critic", zh: "評論者", pos: "n." },
    ],
    phrases: [
      { en: "The performance has been sold out for weeks.", zh: "這場演出票已經賣光好幾週了。" },
      { en: "Doors open at seven; the show starts at half past.", zh: "七點開放入場,七點半開演。" },
      { en: "The exhibition runs through the end of November.", zh: "展覽展至十一月底。" },
    ],
    questions: [
      { q: "What went wrong before the exhibition opened?", opts: ["The lender took back half the photographs", "The gallery lost its funding", "The curator resigned", "The building was damaged"], note: "the lender withdrew half of them without explanation。" },
      { q: "How did the curator respond?", opts: ["By adding work from local photographers", "By postponing the exhibition", "By borrowing from another museum", "By cancelling the show"], note: "adding work by three photographers who live in the city。" },
      { q: "What rule did the gallery adopt afterwards?", opts: ["Not to name works in publicity before loans are confirmed", "To stop borrowing from private collections", "To print publicity later than usual", "To sell tickets only at the door"], note: "no publicity now names a specific work until the loan agreement has been signed。" },
    ]},

  { id: "health", no: 10, name: "健康保健", en: "Health Care", icon: "🏥", doc: "診所通知",
    title: "The Fifteen-Minute Appointment",
    text: "Riverbank Clinic used to book every appointment for fifteen minutes, regardless of the reason for the visit. Patients with a simple prescription renewal finished early, while those with complicated conditions ran over, and by mid-morning the waiting room was always behind schedule. Two years ago the clinic began asking patients to describe their concern briefly when booking online. A nurse reviews these notes each morning and adjusts the day's schedule, giving some patients thirty minutes and others five. Average waiting time has fallen from thirty-four minutes to eleven. Not everyone approves. Some patients dislike explaining their symptoms to a booking form, and the clinic has had to make clear that the notes are read only by clinical staff and are covered by the same confidentiality rules as the rest of the medical record.",
    zh: "Riverbank 診所過去不論看診原因,每個門診都排十五分鐘。只是續領處方的病人提早結束,病情複雜的則超時,到了上午十點多候診室永遠在拖延。兩年前診所開始請病人線上預約時簡述問題,護理師每天早上檢視這些備註並調整當天時程,有些病人給三十分鐘,有些只給五分鐘。平均候診時間從 34 分鐘降到 11 分鐘。並非人人贊成:有些病人不喜歡對著預約表單說明症狀,診所因此必須說明這些備註只有臨床人員會看,且與其他病歷適用相同的保密規定。",
    words: [
      { w: "appointment", zh: "門診預約", pos: "n." }, { w: "prescription", zh: "處方", pos: "n." },
      { w: "symptom", zh: "症狀", pos: "n." }, { w: "confidentiality", zh: "保密", pos: "n." },
      { w: "clinic", zh: "診所", pos: "n." }, { w: "condition", zh: "病況", pos: "n." },
    ],
    phrases: [
      { en: "I'd like to make an appointment with Dr. Alvarez.", zh: "我想預約 Alvarez 醫師的門診。" },
      { en: "Does my insurance cover this procedure?", zh: "我的保險有給付這項療程嗎?" },
      { en: "Take one tablet twice a day after meals.", zh: "一天兩次,飯後各服一錠。" },
    ],
    questions: [
      { q: "What was the problem with the old system?", opts: ["Appointments were all the same length", "The clinic opened too late", "There were too few doctors", "Patients could not book online"], note: "book every appointment for fifteen minutes, regardless of the reason。" },
      { q: "Who adjusts the daily schedule?", opts: ["A nurse", "The receptionist", "Each doctor", "A computer system"], note: "A nurse reviews these notes each morning and adjusts the day's schedule。" },
      { q: "What concern did some patients raise?", opts: ["Privacy of the information they provide", "The cost of appointments", "The length of the forms", "The clinic's opening hours"], note: "Some patients dislike explaining their symptoms to a booking form → 隱私顧慮。" },
    ]},

  { id: "house", no: 11, name: "房屋與地產", en: "Housing & Property", icon: "🏠", doc: "租賃說明",
    title: "Moving the Office Downstairs",
    text: "When the lease on Lambert Design's fourth-floor office expired, the partners considered moving to a larger space across town. Instead they took two floors in the same building, one of which had been vacant for a year, and negotiated a rent reduction in exchange for a five-year term. The landlord agreed to repaint and replace the flooring before the move. The renovation ran three weeks late, so the studio worked from home for most of April. What convinced the partners to stay was not the rent but the commute: nearly two-thirds of their staff live within twenty minutes of the current building, and a survey suggested that a move across town would have cost them several senior designers. The new layout has fewer private offices and two additional meeting rooms, a change the partners describe as overdue.",
    zh: "Lambert Design 四樓辦公室租約到期時,合夥人考慮搬到市區另一頭更大的空間。最後他們選擇承租同一棟大樓的兩層樓,其中一層已空置一年,並以簽五年約換取租金折讓。房東同意在搬遷前重新粉刷並更換地板。裝修延誤三週,工作室四月大部分時間都在家上班。讓合夥人決定留下的不是租金而是通勤:近三分之二的員工住在距現址二十分鐘內,調查顯示搬到市區另一頭會讓他們流失幾位資深設計師。新配置減少了獨立辦公室,增加兩間會議室,合夥人形容這是早該做的改變。",
    words: [
      { w: "lease", zh: "租約", pos: "n./v." }, { w: "landlord", zh: "房東", pos: "n." },
      { w: "vacant", zh: "空置的", pos: "adj." }, { w: "renovation", zh: "裝修;翻新", pos: "n." },
      { w: "tenant", zh: "承租人", pos: "n." }, { w: "layout", zh: "配置;格局", pos: "n." },
    ],
    phrases: [
      { en: "The lease is up for renewal in March.", zh: "租約三月要續約。" },
      { en: "Utilities are included in the monthly rent.", zh: "水電等公用事業費用含在月租內。" },
      { en: "We're looking for a space with good access to public transport.", zh: "我們想找交通方便的空間。" },
    ],
    questions: [
      { q: "What did the partners decide to do?", opts: ["Rent two floors in the same building", "Move to another part of the city", "Buy the building", "Reduce the size of the office"], note: "they took two floors in the same building。" },
      { q: "What did the company receive in return for a five-year term?", opts: ["A lower rent", "Free parking", "An extra floor at no cost", "A shorter notice period"], note: "negotiated a rent reduction in exchange for a five-year term。" },
      { q: "What was the main reason for staying?", opts: ["Staff would not have to change their commute", "The rent was the lowest available", "The building was newly built", "The landlord offered free renovation"], note: "What convinced the partners to stay was not the rent but the commute。" },
    ]},

  { id: "dining", no: 12, name: "餐廳與飲食", en: "Dining Out", icon: "🍽️", doc: "餐飲評論",
    title: "A Table for Fourteen",
    text: "Booking a table for fourteen people on a Friday evening is harder than it sounds. The first restaurant Daniel called could seat the group but only at six or at nine. The second required a set menu chosen a week in advance and a deposit for the whole party. The third, a small place near the station, agreed to seven thirty and asked only that anyone with dietary restrictions let them know by Wednesday. On the night, two guests did not appear, and the restaurant charged for twelve rather than fourteen, which it was not obliged to do. The service was slower than usual, and one main course arrived cold and had to be replaced. The manager removed it from the bill without being asked. Daniel has since booked the same restaurant twice, mostly because of how the complaint was handled.",
    zh: "週五晚上訂十四人的位子,比想像中難。Daniel 打的第一家餐廳能容納這麼多人,但只有六點或九點。第二家要求一週前選定套餐,並就全部人數付訂金。第三家是車站附近的小店,答應七點半,只要求有飲食禁忌的人週三前告知。當晚有兩位客人沒出現,餐廳只收十二人的費用——這並非它的義務。當晚出餐比平常慢,有一道主菜上桌時是冷的,必須重做。經理沒等人開口就把那道菜從帳單上扣掉。Daniel 後來又訂了同一家兩次,主要就是因為對方處理客訴的方式。",
    words: [
      { w: "reservation", zh: "訂位", pos: "n." }, { w: "deposit", zh: "訂金", pos: "n." },
      { w: "dietary", zh: "飲食的", pos: "adj." }, { w: "restriction", zh: "限制", pos: "n." },
      { w: "complaint", zh: "客訴;抱怨", pos: "n." }, { w: "bill", zh: "帳單", pos: "n." },
    ],
    phrases: [
      { en: "I'd like to book a table for four at seven.", zh: "我想訂七點四人的位子。" },
      { en: "Could we have the bill, please?", zh: "麻煩結帳。" },
      { en: "I'm afraid this isn't what I ordered.", zh: "不好意思,這不是我點的。" },
    ],
    questions: [
      { q: "Why did Daniel choose the third restaurant?", opts: ["It offered the time he wanted with few conditions", "It was the cheapest option", "It was closest to his office", "It had the best reviews"], note: "agreed to seven thirty and asked only that anyone with dietary restrictions let them know。" },
      { q: "What did the restaurant do when two guests were absent?", opts: ["It charged for twelve people only", "It kept the full deposit", "It charged for all fourteen", "It offered a discount voucher"], note: "the restaurant charged for twelve rather than fourteen。" },
      { q: "Why does Daniel continue to use the restaurant?", opts: ["He was impressed by how the problem was handled", "The food is the best in the city", "It is the only place that takes large groups", "It gives him a regular discount"], note: "mostly because of how the complaint was handled。" },
    ]},

  { id: "shop", no: 13, name: "購物", en: "Shopping", icon: "🛍️", doc: "零售政策",
    title: "The Cost of Free Returns",
    text: "Northgate Retail introduced free returns in 2019 and saw online sales rise by a quarter within a year. What the finance team had not modelled was the return rate, which reached thirty-one per cent for clothing. Some customers routinely ordered three sizes of the same item intending to send two back. Each returned parcel costs the company about seven euros to process, and roughly one garment in eight cannot be resold at full price. The company considered charging for returns but concluded that customers would simply buy elsewhere. Instead it invested in size guides, photographs of the same item on different body types, and a chat service staffed by people who have handled the products. Returns for clothing have since fallen to twenty-two per cent, and the customers who use the chat service before ordering return goods less than half as often.",
    zh: "Northgate 零售在 2019 年推出免費退貨,一年內線上銷售成長四分之一。財務團隊沒算進去的是退貨率——服飾類達到 31%。有些顧客習慣同一件商品訂三個尺寸,打算退回兩件。每件退貨包裹的處理成本約七歐元,而大約每八件衣物就有一件無法以原價再售。公司考慮過收取退貨費,但結論是顧客會直接去別家買。於是改為投資尺寸指南、同一商品在不同體型上的照片,以及由實際接觸過商品的人員提供的線上客服。此後服飾退貨率降到 22%,而下單前使用客服的顧客,退貨頻率不到其他人的一半。",
    words: [
      { w: "retail", zh: "零售", pos: "n./adj." }, { w: "refund", zh: "退款", pos: "n./v." },
      { w: "garment", zh: "衣物", pos: "n." }, { w: "resell", zh: "轉售;再售", pos: "v." },
      { w: "parcel", zh: "包裹", pos: "n." }, { w: "guide", zh: "指南", pos: "n." },
    ],
    phrases: [
      { en: "Do you have this in a smaller size?", zh: "這件有小一號的嗎?" },
      { en: "I'd like to exchange this for a different colour.", zh: "我想換成別的顏色。" },
      { en: "Is the sale price valid until the end of the month?", zh: "特價到月底都有效嗎?" },
    ],
    questions: [
      { q: "What did the finance team fail to anticipate?", opts: ["How many items would be returned", "How fast sales would grow", "The cost of advertising", "A shortage of stock"], note: "What the finance team had not modelled was the return rate。" },
      { q: "Why did the company decide against charging for returns?", opts: ["Customers would shop with competitors", "It would be illegal", "The cost was too low to matter", "Staff opposed the idea"], note: "concluded that customers would simply buy elsewhere。" },
      { q: "What effect did the chat service have?", opts: ["Its users return goods far less often", "It increased the number of orders", "It replaced the size guides", "It reduced staffing costs"], note: "customers who use the chat service before ordering return goods less than half as often。" },
    ]},
];
