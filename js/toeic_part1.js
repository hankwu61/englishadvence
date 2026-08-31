// ============================================================
//  📷 多益 Part 1 照片描述 - 題庫
//  情境圖:優先載入 img 指定的圖片檔;檔案不存在時自動改用內建 SVG 佔位圖
//  prompt 為生圖提示詞(給 AI 產圖用),產好的圖放到 images/part1/<id>.jpg 即自動替換
//  opts[0] 永遠是正解;why 與 opts 一一對應,說明對/錯的理由
//  正式考試不印出四個描述,因此畫面只給 A/B/C/D,作答後才揭露句子
// ============================================================

const TOEIC_PART1 = [
  { id: "p1a", title: "辦公桌前工作", voice: "W",
    img: "images/part1/p1a.jpg",
    prompt: "A photorealistic office photo: a woman in a blue blouse sits at a wooden desk, typing on a keyboard with both hands, looking at a desktop monitor. She is already wearing her clothes (no jacket being put on). A small potted plant sits on the right side of the desk and a whiteboard hangs on the wall behind her. Nobody else is in the room; nothing is being carried or moved. Natural daylight, clean modern office, eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#EAF0F8"/>
      <rect x="0" y="152" width="320" height="48" fill="#D6DEEA"/>
      <rect x="18" y="26" width="84" height="56" rx="4" fill="#FFF" stroke="#B9C4D6" stroke-width="2"/>
      <line x1="28" y1="42" x2="90" y2="42" stroke="#C9D3E2" stroke-width="3"/>
      <line x1="28" y1="54" x2="78" y2="54" stroke="#C9D3E2" stroke-width="3"/>
      <line x1="28" y1="66" x2="88" y2="66" stroke="#C9D3E2" stroke-width="3"/>
      <rect x="62" y="106" width="8" height="46" fill="#6E7887"/>
      <rect x="62" y="146" width="42" height="7" rx="2" fill="#6E7887"/>
      <circle cx="96" cy="82" r="15" fill="#F2C9A0"/>
      <path d="M81 80 a15 15 0 0 1 30 0 q-15 -9 -30 0 z" fill="#5B4636"/>
      <path d="M80 152 L80 112 q16 -13 32 0 L112 152 z" fill="#5356E4"/>
      <rect x="108" y="106" width="48" height="9" rx="4" fill="#F2C9A0"/>
      <rect x="118" y="118" width="176" height="8" rx="2" fill="#A9764E"/>
      <rect x="126" y="126" width="9" height="26" fill="#8C6140"/>
      <rect x="278" y="126" width="9" height="26" fill="#8C6140"/>
      <rect x="140" y="110" width="46" height="8" rx="2" fill="#C9D3E2" stroke="#AEBACB"/>
      <rect x="206" y="70" width="66" height="42" rx="3" fill="#3B4A61"/>
      <rect x="211" y="75" width="56" height="32" fill="#7FA8D9"/>
      <rect x="234" y="112" width="10" height="6" fill="#3B4A61"/>
      <rect x="296" y="96" width="16" height="22" rx="3" fill="#B98A62"/>
      <path d="M304 96 q-13 -17 0 -24 q13 7 0 24" fill="#4FAE74"/>
    </svg>`,
    zh: "一位女子坐在辦公桌前,面前有一台電腦螢幕與鍵盤。",
    opts: [
      "A woman is working at a desk.",
      "A woman is putting on a jacket.",
      "The desk is being moved into an office.",
      "Some documents are being handed out.",
    ],
    why: [
      "✅ 主詞、動作、地點都符合:女子正在辦公桌前工作。",
      "❌ put on 是「穿上」的動作,照片中的人已經穿好衣服(wearing),不是正在穿。",
      "❌ 現在進行被動 is being moved 表示「正被搬動」,照片中沒有人在搬桌子。",
      "❌ 照片中沒有分發文件的動作,是憑空想像的內容。",
    ],
    note: "Part 1 最常見的陷阱:put on(正在穿)vs. wear(已穿著);以及沒有人執行的「is being + p.p.」。" },

  { id: "p1b", title: "卸貨作業", voice: "M",
    img: "images/part1/p1b.jpg",
    prompt: "A photorealistic warehouse loading photo: a male worker wearing a yellow hard hat and green work vest lifts a cardboard box toward the open back of a blue delivery truck. Several sealed cardboard boxes are stacked inside the truck and one box sits on the ground beside him. The truck is intact and nobody is repairing it; no bicycles in the frame. Daylight, outdoor loading dock, eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#E3EDF5"/>
      <rect x="0" y="152" width="320" height="48" fill="#C4CBD4"/>
      <rect x="150" y="60" width="130" height="70" rx="4" fill="#4E6E9E"/>
      <rect x="96" y="82" width="56" height="48" rx="4" fill="#6C8CBB"/>
      <rect x="104" y="92" width="26" height="20" fill="#CBE0F2"/>
      <circle cx="120" cy="140" r="14" fill="#3A3F49"/><circle cx="120" cy="140" r="6" fill="#8B929C"/>
      <circle cx="240" cy="140" r="14" fill="#3A3F49"/><circle cx="240" cy="140" r="6" fill="#8B929C"/>
      <rect x="158" y="86" width="34" height="30" fill="#C68B48" stroke="#A56F35" stroke-width="2"/>
      <rect x="196" y="86" width="34" height="30" fill="#C68B48" stroke="#A56F35" stroke-width="2"/>
      <rect x="40" y="118" width="34" height="30" fill="#C68B48" stroke="#A56F35" stroke-width="2"/>
      <circle cx="86" cy="76" r="13" fill="#E8B98D"/>
      <path d="M73 74 h26 a13 13 0 0 0 -26 0" fill="#F5A623"/>
      <rect x="72" y="90" width="30" height="34" fill="#4FAE74"/>
      <rect x="66" y="96" width="12" height="26" rx="5" fill="#E8B98D" transform="rotate(-25 72 96)"/>
      <rect x="72" y="124" width="12" height="28" fill="#3B4A61"/>
      <rect x="90" y="124" width="12" height="28" fill="#3B4A61"/>
    </svg>`,
    zh: "一名戴安全帽的工人正把箱子搬上卡車。",
    opts: [
      "A man is loading boxes onto a truck.",
      "The truck is being repaired.",
      "A man is riding a bicycle.",
      "The boxes have all been unpacked.",
    ],
    why: [
      "✅ 動作(loading)、物件(boxes)、地點(onto a truck)全部相符。",
      "❌ 照片中沒有維修的動作;不要因為看到卡車就選跟卡車有關的任何句子。",
      "❌ 完全無關的動作,屬於「有人但動作錯」的典型干擾項。",
      "❌ unpacked(已拆封)與畫面中箱子仍封著、正在搬運不符。",
    ],
    note: "看到人時,先鎖定「他正在做什麼動作」;含 truck 的句子不一定就是答案。" },

  { id: "p1c", title: "候車亭", voice: "W",
    img: "images/part1/p1c.jpg",
    prompt: "A photorealistic street photo: two people sit side by side on a bench inside a covered bus shelter with a glass panel and a flat roof. They are seated and waiting, not standing or boarding. No bus is present at the stop and nobody is crossing the street or installing anything. A green street sign stands nearby. Overcast daylight, city sidewalk, eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#DCEAF6"/>
      <rect x="0" y="150" width="320" height="50" fill="#B8BFC8"/>
      <rect x="0" y="140" width="320" height="10" fill="#9AA3AE"/>
      <rect x="60" y="52" width="180" height="8" rx="3" fill="#5A6472"/>
      <rect x="64" y="60" width="8" height="86" fill="#5A6472"/>
      <rect x="228" y="60" width="8" height="86" fill="#5A6472"/>
      <rect x="72" y="60" width="156" height="52" fill="#CFE3F3" opacity="0.7"/>
      <rect x="80" y="118" width="140" height="8" fill="#8A6A46"/>
      <rect x="86" y="126" width="8" height="20" fill="#6E533A"/>
      <rect x="206" y="126" width="8" height="20" fill="#6E533A"/>
      <circle cx="120" cy="84" r="12" fill="#F2C9A0"/>
      <path d="M108 84 q12 -20 24 0 z" fill="#3B3026"/>
      <rect x="110" y="96" width="20" height="24" fill="#E8556D"/>
      <rect x="112" y="120" width="7" height="24" fill="#3B4A61"/>
      <rect x="122" y="120" width="7" height="24" fill="#3B4A61"/>
      <circle cx="176" cy="84" r="12" fill="#D9A87C"/>
      <path d="M164 84 q12 -18 24 0 z" fill="#6B4A2F"/>
      <rect x="166" y="96" width="20" height="24" fill="#4A7FC1"/>
      <rect x="168" y="120" width="7" height="24" fill="#4B4438"/>
      <rect x="178" y="120" width="7" height="24" fill="#4B4438"/>
      <rect x="248" y="40" width="6" height="106" fill="#7A828D"/>
      <rect x="238" y="34" width="26" height="18" rx="3" fill="#4FAE74"/>
    </svg>`,
    zh: "兩個人坐在有頂棚的候車亭長椅上。",
    opts: [
      "Some people are seated under a shelter.",
      "They are boarding a bus.",
      "A bench is being installed.",
      "The people are crossing the street.",
    ],
    why: [
      "✅ seated(坐著的狀態)與 under a shelter(在遮蔽物下)都符合畫面。",
      "❌ boarding(正在上車)需要有車與上車動作,畫面中都沒有。",
      "❌ is being installed 需要有人正在安裝長椅,畫面中無人施工。",
      "❌ 畫面中的人是坐著的,不是在過馬路。",
    ],
    note: "be seated / be sitting 描述「狀態」,常搭配 under、at、across from 等介係詞;正式測驗很愛考這組。" },

  { id: "p1d", title: "商品上架", voice: "M",
    img: "images/part1/p1d.jpg",
    prompt: "A photorealistic retail photo: a man in a blue apron places a boxed product onto a wooden shop shelf, holding one item in his hand. The shelves are already partly filled with colorful boxes, so they are not empty. A cardboard carton sits on the floor next to him. No customers, no counter, no queue, no broom in the frame. Bright store lighting, eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#F3EFE6"/>
      <rect x="0" y="156" width="320" height="44" fill="#DDD3C2"/>
      <rect x="30" y="24" width="150" height="132" fill="#C9B79A"/>
      <rect x="34" y="30" width="142" height="8" fill="#A8916F"/>
      <rect x="34" y="70" width="142" height="8" fill="#A8916F"/>
      <rect x="34" y="110" width="142" height="8" fill="#A8916F"/>
      <rect x="34" y="150" width="142" height="6" fill="#A8916F"/>
      <rect x="42" y="44" width="18" height="26" fill="#E8556D"/><rect x="66" y="44" width="18" height="26" fill="#4A7FC1"/>
      <rect x="90" y="44" width="18" height="26" fill="#4FAE74"/><rect x="114" y="44" width="18" height="26" fill="#F5A623"/>
      <rect x="42" y="84" width="18" height="26" fill="#4FAE74"/><rect x="66" y="84" width="18" height="26" fill="#F5A623"/>
      <rect x="90" y="84" width="18" height="26" fill="#E8556D"/>
      <rect x="42" y="124" width="18" height="26" fill="#4A7FC1"/><rect x="66" y="124" width="18" height="26" fill="#E8556D"/>
      <circle cx="230" cy="60" r="14" fill="#E8B98D"/>
      <path d="M216 58 q14 -22 28 0 z" fill="#2F2A26"/>
      <rect x="216" y="76" width="30" height="42" fill="#5356E4"/>
      <rect x="196" y="80" width="24" height="10" rx="5" fill="#E8B98D" transform="rotate(-20 208 85)"/>
      <rect x="188" y="70" width="16" height="20" fill="#F5A623"/>
      <rect x="218" y="118" width="12" height="38" fill="#3B4A61"/>
      <rect x="234" y="118" width="12" height="38" fill="#3B4A61"/>
      <rect x="266" y="120" width="34" height="36" fill="#C68B48" stroke="#A56F35" stroke-width="2"/>
    </svg>`,
    zh: "一名男子正把商品放到店內的貨架上。",
    opts: [
      "A man is stocking shelves with merchandise.",
      "The shelves are completely empty.",
      "Customers are waiting in line at a counter.",
      "A man is sweeping the floor.",
    ],
    why: [
      "✅ stock shelves 是「把商品上架」的固定用法,與畫面一致。",
      "❌ 貨架上明顯有商品,empty 與畫面矛盾。",
      "❌ 畫面中沒有排隊的顧客,也沒有櫃檯。",
      "❌ 動作錯誤:男子手上拿的是商品,不是掃把。",
    ],
    note: "職場照片題常用 stock(v. 上架)、arrange(排列)、display(陳列)等動詞,先背這幾個動作字。" },

  { id: "p1e", title: "戶外咖啡座", voice: "W",
    img: "images/part1/p1e.jpg",
    prompt: "A photorealistic outdoor cafe photo: two round wooden tables stand on a terrace, each shaded by a large open patio umbrella (umbrellas are open, not folded). Two customers sit at the tables with cups in front of them. No waiter is taking an order and no chairs are stacked against a wall. Sunny afternoon, casual street cafe, slightly elevated eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#DFF0E6"/>
      <rect x="0" y="150" width="320" height="50" fill="#CBBFA8"/>
      <rect x="0" y="20" width="320" height="40" fill="#C9DDE8"/>
      <rect x="20" y="20" width="120" height="40" fill="#A8C6D8"/>
      <path d="M60 40 h80 l-40 -26 z" fill="#E8556D"/>
      <rect x="96" y="40" width="8" height="70" fill="#8A8A8A"/>
      <ellipse cx="100" cy="112" rx="46" ry="8" fill="#8A6A46"/>
      <rect x="96" y="112" width="8" height="34" fill="#6E533A"/>
      <path d="M228 42 h80 l-40 -26 z" fill="#4A7FC1"/>
      <rect x="264" y="42" width="8" height="70" fill="#8A8A8A"/>
      <ellipse cx="268" cy="112" rx="46" ry="8" fill="#8A6A46"/>
      <rect x="264" y="112" width="8" height="34" fill="#6E533A"/>
      <circle cx="62" cy="118" r="10" fill="#F2C9A0"/>
      <rect x="54" y="128" width="16" height="20" fill="#4FAE74"/>
      <circle cx="138" cy="118" r="10" fill="#D9A87C"/>
      <rect x="130" y="128" width="16" height="20" fill="#F5A623"/>
      <rect x="88" y="104" width="10" height="8" fill="#FFF" stroke="#B9C4D6"/>
      <rect x="106" y="104" width="10" height="8" fill="#FFF" stroke="#B9C4D6"/>
    </svg>`,
    zh: "遮陽傘下的戶外座位區,兩人坐在桌邊。",
    opts: [
      "Some tables are shaded by umbrellas.",
      "The umbrellas have been folded up.",
      "A waiter is taking an order.",
      "The chairs have been stacked against a wall.",
    ],
    why: [
      "✅ be shaded by(被…遮蔭)描述狀態,與撐開的遮陽傘相符。",
      "❌ folded up(收起來)與畫面中撐開的傘相反。",
      "❌ 畫面中沒有服務生點餐的動作。",
      "❌ stacked(疊放)、against a wall(靠牆)都與畫面不符。",
    ],
    note: "無人物的照片多半考「狀態」:be shaded / be stacked / be piled / be lined up,重點在有沒有那個狀態。" },

  { id: "p1f", title: "會議簡報", voice: "M",
    img: "images/part1/p1f.jpg",
    prompt: "A photorealistic meeting room photo: three colleagues are seated around a long conference table, facing a presentation screen mounted on the wall. The screen is already hanging on the wall — nobody is installing or hanging it. Notebooks and cups are on the table. The room is occupied and nobody is standing near the doorway. Bright office lighting, wide eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#EDEFF6"/>
      <rect x="0" y="158" width="320" height="42" fill="#D4D8E4"/>
      <rect x="176" y="26" width="120" height="76" rx="3" fill="#FFF" stroke="#A9B3C7" stroke-width="2"/>
      <rect x="186" y="38" width="46" height="10" fill="#5356E4"/>
      <rect x="186" y="56" width="80" height="6" fill="#C3CBDD"/>
      <rect x="186" y="68" width="66" height="6" fill="#C3CBDD"/>
      <rect x="186" y="80" width="74" height="6" fill="#C3CBDD"/>
      <ellipse cx="150" cy="132" rx="110" ry="20" fill="#A9764E"/>
      <ellipse cx="150" cy="128" rx="110" ry="20" fill="#C08E5E"/>
      <circle cx="70" cy="98" r="13" fill="#F2C9A0"/>
      <path d="M57 98 q13 -20 26 0 z" fill="#3B3026"/>
      <rect x="58" y="112" width="26" height="20" fill="#E8556D"/>
      <circle cx="122" cy="98" r="13" fill="#D9A87C"/>
      <path d="M109 96 q13 -20 26 0 z" fill="#5B4636"/>
      <rect x="110" y="112" width="26" height="20" fill="#4A7FC1"/>
      <circle cx="196" cy="128" r="13" fill="#E8B98D"/>
      <path d="M183 126 q13 -20 26 0 z" fill="#2F2A26"/>
      <rect x="184" y="142" width="26" height="18" fill="#3D4B7A"/>
      <rect x="60" y="124" width="20" height="6" fill="#FFF" stroke="#B9C4D6"/>
      <rect x="112" y="124" width="20" height="6" fill="#FFF" stroke="#B9C4D6"/>
    </svg>`,
    zh: "數人圍坐在會議桌旁,牆上有一面投影螢幕。",
    opts: [
      "A group of people is gathered around a table.",
      "The room is unoccupied.",
      "They are hanging a screen on the wall.",
      "Everyone is standing near the doorway.",
    ],
    why: [
      "✅ gathered around a table(圍著桌子聚集)精準描述整體畫面。",
      "❌ unoccupied(無人使用)與畫面中有人開會矛盾。",
      "❌ hanging a screen 需要有人正在掛螢幕,畫面中螢幕已經掛好。",
      "❌ 畫面中的人是坐著的,不是站在門邊。",
    ],
    note: "多人照片先描述「整體」:a group of people、several people are seated;細節動作反而少考。" },

  { id: "p1g", title: "施工現場", voice: "W",
    img: "images/part1/p1g.jpg",
    prompt: "A photorealistic construction site photo: a worker in a green safety vest is already wearing a yellow hard hat on his head (the helmet is on, not being put on). Behind him a yellow crane lifts a wooden crate above a partly built concrete building with scaffolding. The building is under construction, not demolished. Nobody carries materials by hand. Daylight, wide eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#DDE7F0"/>
      <rect x="0" y="154" width="320" height="46" fill="#C2B49A"/>
      <rect x="180" y="40" width="90" height="114" fill="#B7BCC4"/>
      <rect x="188" y="52" width="22" height="22" fill="#8E959F"/><rect x="220" y="52" width="22" height="22" fill="#8E959F"/>
      <rect x="188" y="86" width="22" height="22" fill="#8E959F"/><rect x="220" y="86" width="22" height="22" fill="#8E959F"/>
      <rect x="176" y="36" width="98" height="8" fill="#8E959F"/>
      <line x1="180" y1="40" x2="270" y2="154" stroke="#9AA3AE" stroke-width="3"/>
      <line x1="270" y1="40" x2="180" y2="154" stroke="#9AA3AE" stroke-width="3"/>
      <rect x="60" y="24" width="8" height="130" fill="#F5A623"/>
      <rect x="60" y="24" width="86" height="8" fill="#F5A623"/>
      <line x1="142" y1="32" x2="142" y2="72" stroke="#6B7280" stroke-width="3"/>
      <rect x="128" y="72" width="30" height="24" fill="#C68B48" stroke="#A56F35" stroke-width="2"/>
      <circle cx="96" cy="112" r="12" fill="#E8B98D"/>
      <path d="M83 110 h26 a13 13 0 0 0 -26 0" fill="#F5A623"/>
      <rect x="84" y="124" width="24" height="30" fill="#4FAE74"/>
      <rect x="86" y="154" width="8" height="0" fill="#3B4A61"/>
      <rect x="24" y="130" width="20" height="24" fill="#E8556D"/>
      <path d="M24 130 h20 l-10 -10 z" fill="#C9425A"/>
    </svg>`,
    zh: "工地現場有起重機吊著貨物,一名戴安全帽的工人站在旁邊。",
    opts: [
      "A worker is wearing a hard hat.",
      "A worker is putting on a hard hat.",
      "The building has been demolished.",
      "Some materials are being carried by hand.",
    ],
    why: [
      "✅ wearing 描述「已穿戴的狀態」,與畫面中戴著安全帽相符。",
      "❌ putting on 是「正在戴上」的動作,畫面中安全帽已經在頭上。",
      "❌ demolished(已拆除)與畫面中正在興建的建物相反。",
      "❌ 材料是由起重機吊掛,不是用手搬運。",
    ],
    note: "wear vs. put on 幾乎每次考試都出現;看到人已經穿戴好,就選 wearing / has on。" },

  { id: "p1h", title: "碼頭貨櫃", voice: "M",
    img: "images/part1/p1h.jpg",
    prompt: "A photorealistic harbor photo: colorful shipping containers are stacked two high on a concrete dock beside the water. A cargo boat floats on the water next to the dock. No truck is present and no containers are being loaded; nobody is painting anything and no people are visible. Clear daylight, calm water, wide eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#D8EAF4"/>
      <rect x="0" y="146" width="320" height="54" fill="#7FA8C4"/>
      <rect x="0" y="140" width="320" height="8" fill="#A9927A"/>
      <rect x="24" y="104" width="56" height="18" fill="#E8556D" stroke="#C9425A" stroke-width="2"/>
      <rect x="24" y="122" width="56" height="18" fill="#4A7FC1" stroke="#3D6BA6" stroke-width="2"/>
      <rect x="86" y="122" width="56" height="18" fill="#4FAE74" stroke="#3E9260" stroke-width="2"/>
      <rect x="86" y="104" width="56" height="18" fill="#F5A623" stroke="#D28C15" stroke-width="2"/>
      <path d="M170 140 h130 l-16 24 h-98 z" fill="#42556E"/>
      <rect x="196" y="114" width="52" height="26" fill="#E6EAF0"/>
      <rect x="204" y="122" width="12" height="10" fill="#7FA8D9"/>
      <rect x="224" y="122" width="12" height="10" fill="#7FA8D9"/>
      <rect x="256" y="102" width="6" height="38" fill="#8E959F"/>
      <rect x="254" y="96" width="10" height="8" fill="#E8556D"/>
      <path d="M0 168 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#6C97B5" stroke-width="3" fill="none"/>
    </svg>`,
    zh: "碼頭邊堆放著彩色貨櫃,水面上停著一艘船。",
    opts: [
      "Containers are stacked near the water.",
      "The containers are being loaded onto a truck.",
      "The boat has been pulled out of the water.",
      "Workers are painting the containers.",
    ],
    why: [
      "✅ stacked(堆疊)與 near the water(靠水邊)都與畫面相符。",
      "❌ 畫面中沒有卡車,也沒有裝載動作。",
      "❌ 船在水上,不是被拖出水面。",
      "❌ 畫面中沒有人,更沒有油漆的動作。",
    ],
    note: "無人照片若出現「人做的動作」(workers are painting),通常就是錯的——先確認畫面裡到底有沒有人。" },

  { id: "p1i", title: "餐廳廚房", voice: "W",
    img: "images/part1/p1i.jpg",
    prompt: "A photorealistic restaurant kitchen photo: a chef in a white uniform and hat stands at a stainless steel counter preparing food, with a pot on the stove beside him. The pots are on the stove, not in a sink being washed. No dining table with stacked dishes and no customer with a menu in the frame. Bright kitchen lighting, eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#F0EEE9"/>
      <rect x="0" y="150" width="320" height="50" fill="#D8D2C6"/>
      <rect x="20" y="112" width="280" height="14" fill="#B9BEC6"/>
      <rect x="20" y="126" width="280" height="24" fill="#9AA1AB"/>
      <rect x="40" y="40" width="120" height="10" fill="#A9B0BA"/>
      <rect x="52" y="50" width="14" height="22" fill="#C9CDD4"/>
      <rect x="76" y="50" width="14" height="22" fill="#C9CDD4"/>
      <rect x="100" y="50" width="14" height="22" fill="#C9CDD4"/>
      <ellipse cx="80" cy="108" rx="26" ry="8" fill="#6B7280"/>
      <rect x="54" y="94" width="52" height="16" fill="#8B929C"/>
      <path d="M72 92 q8 -12 16 0" stroke="#C9D3E2" stroke-width="3" fill="none"/>
      <ellipse cx="150" cy="110" rx="18" ry="6" fill="#6B7280"/>
      <circle cx="236" cy="76" r="14" fill="#F2C9A0"/>
      <rect x="220" y="52" width="32" height="14" rx="6" fill="#FFF" stroke="#D8D2C6"/>
      <rect x="220" y="92" width="32" height="34" fill="#FFF" stroke="#D8D2C6" stroke-width="2"/>
      <rect x="204" y="98" width="20" height="10" rx="5" fill="#F2C9A0" transform="rotate(-15 214 103)"/>
      <rect x="192" y="100" width="18" height="6" fill="#B9BEC6"/>
    </svg>`,
    zh: "廚師在流理台前備餐,爐上有鍋子。",
    opts: [
      "A chef is preparing food in a kitchen.",
      "The pots are being washed in a sink.",
      "Dishes are stacked on a dining table.",
      "A customer is looking at a menu.",
    ],
    why: [
      "✅ preparing food(備餐)、in a kitchen(在廚房)都符合。",
      "❌ 鍋子在爐上,不是在水槽被清洗。",
      "❌ 畫面是廚房工作檯,不是餐桌上的碗盤堆疊。",
      "❌ 畫面中沒有顧客,也沒有菜單。",
    ],
    note: "同一情境會出現多個相關名詞(pot、sink、dish),要聽清楚「哪個東西」配「哪個動作」。" },

  { id: "p1j", title: "圖書館書架", voice: "M",
    img: "images/part1/p1j.jpg",
    prompt: "A photorealistic library photo: tall wooden shelves are neatly filled with rows of colorful books (books already arranged, nobody shelving them). A man sits at a wooden table reading an open book. No boxes are being packed, the shelves are fully assembled, and there is no queue at a checkout desk. Warm indoor lighting, quiet library, eye-level shot.",
    svg: `<svg viewBox="0 0 320 200" class="p1-svg">
      <rect width="320" height="200" fill="#F1EDE4"/>
      <rect x="0" y="158" width="320" height="42" fill="#D9CFBC"/>
      <rect x="18" y="20" width="128" height="138" fill="#A9764E"/>
      <rect x="22" y="26" width="120" height="8" fill="#8C6140"/>
      <rect x="22" y="70" width="120" height="8" fill="#8C6140"/>
      <rect x="22" y="114" width="120" height="8" fill="#8C6140"/>
      <rect x="22" y="150" width="120" height="8" fill="#8C6140"/>
      <rect x="28" y="40" width="9" height="30" fill="#E8556D"/><rect x="39" y="40" width="9" height="30" fill="#4A7FC1"/>
      <rect x="50" y="40" width="9" height="30" fill="#4FAE74"/><rect x="61" y="40" width="9" height="30" fill="#F5A623"/>
      <rect x="72" y="40" width="9" height="30" fill="#8C6ED1"/>
      <rect x="28" y="84" width="9" height="30" fill="#4FAE74"/><rect x="39" y="84" width="9" height="30" fill="#E8556D"/>
      <rect x="50" y="84" width="9" height="30" fill="#F5A623"/>
      <rect x="28" y="128" width="9" height="22" fill="#4A7FC1"/><rect x="39" y="128" width="9" height="22" fill="#8C6ED1"/>
      <rect x="176" y="126" width="128" height="8" fill="#B98A62"/>
      <rect x="184" y="134" width="8" height="24" fill="#96703F"/>
      <rect x="288" y="134" width="8" height="24" fill="#96703F"/>
      <circle cx="226" cy="94" r="13" fill="#D9A87C"/>
      <path d="M213 92 q13 -20 26 0 z" fill="#3B3026"/>
      <rect x="214" y="108" width="26" height="20" fill="#4A7FC1"/>
      <path d="M206 122 h40 l-6 8 h-28 z" fill="#FFF" stroke="#C9CDD4"/>
      <rect x="264" y="112" width="26" height="14" rx="2" fill="#4FAE74"/>
    </svg>`,
    zh: "書架上放滿書,一個人坐在桌前看著攤開的書。",
    opts: [
      "Books have been arranged on the shelves.",
      "A man is putting books into a box.",
      "The shelves are being assembled.",
      "People are lining up at a checkout desk.",
    ],
    why: [
      "✅ have been arranged(已被排放好)描述書架的現狀,與畫面一致。",
      "❌ 畫面中沒有箱子,也沒有把書裝箱的動作。",
      "❌ is being assembled 需要有人正在組裝書架,畫面中書架早已完成。",
      "❌ 畫面中只有一個人在閱讀,沒有排隊的人群。",
    ],
    note: "「have been + p.p.」講已完成的狀態(合理),「is being + p.p.」講正在被做(需要有人在動作)——這組時態是 Part 1 最高頻的判斷點。" },
];
