# 多益 Part 1 照片描述 — 生圖提示詞清單

本檔由 `js/toeic_part1.js` 自動整理。用任何生圖 AI 產出圖片後,
**以指定檔名放進 `images/part1/`,重新整理頁面即自動取代內建的 SVG 佔位圖**(不需要改任何程式碼)。

## 產圖規格

| 項目 | 規格 |
|---|---|
| 尺寸比例 | **8:5**(建議 1200 × 750 px,與畫面框相同,可避免裁切)|
| 檔案格式 | `.jpg`(檔名須與下表完全相同,全部小寫)|
| 存放位置 | `images/part1/` |
| 風格 | 寫實照片風、平視角、自然光,近似真實多益試題照片 |
| 務必避免 | 圖中出現**文字或商標**;出現提示詞中標明不可出現的元素 |

> ⚠️ 每張圖的**正解句**與**三個干擾句**都綁定畫面內容。例如 p1g 的正解是「工人**已戴著**安全帽」,干擾句是「**正在戴上**安全帽」——若生成的圖畫成工人手拿安全帽正要戴,這題就會變成沒有正確答案。產圖後請對照每題的「畫面必須成立的條件」檢查一次。

---

## `p1a` — 辦公桌前工作

- **檔名**:`images/part1/p1a.jpg`
- **中文情境**:一位女子坐在辦公桌前,面前有一台電腦螢幕與鍵盤。
- **正解句(畫面必須成立的條件)**:`A woman is working at a desk.`
- **不可出現在畫面中**(這些是干擾選項):
  - `A woman is putting on a jacket.`
  - `The desk is being moved into an office.`
  - `Some documents are being handed out.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic office photo: a woman in a blue blouse sits at a wooden desk, typing on a keyboard with both hands, looking at a desktop monitor. She is already wearing her clothes (no jacket being put on). A small potted plant sits on the right side of the desk and a whiteboard hangs on the wall behind her. Nobody else is in the room; nothing is being carried or moved. Natural daylight, clean modern office, eye-level shot.
```

## `p1b` — 卸貨作業

- **檔名**:`images/part1/p1b.jpg`
- **中文情境**:一名戴安全帽的工人正把箱子搬上卡車。
- **正解句(畫面必須成立的條件)**:`A man is loading boxes onto a truck.`
- **不可出現在畫面中**(這些是干擾選項):
  - `The truck is being repaired.`
  - `A man is riding a bicycle.`
  - `The boxes have all been unpacked.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic warehouse loading photo: a male worker wearing a yellow hard hat and green work vest lifts a cardboard box toward the open back of a blue delivery truck. Several sealed cardboard boxes are stacked inside the truck and one box sits on the ground beside him. The truck is intact and nobody is repairing it; no bicycles in the frame. Daylight, outdoor loading dock, eye-level shot.
```

## `p1c` — 候車亭

- **檔名**:`images/part1/p1c.jpg`
- **中文情境**:兩個人坐在有頂棚的候車亭長椅上。
- **正解句(畫面必須成立的條件)**:`Some people are seated under a shelter.`
- **不可出現在畫面中**(這些是干擾選項):
  - `They are boarding a bus.`
  - `A bench is being installed.`
  - `The people are crossing the street.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic street photo: two people sit side by side on a bench inside a covered bus shelter with a glass panel and a flat roof. They are seated and waiting, not standing or boarding. No bus is present at the stop and nobody is crossing the street or installing anything. A green street sign stands nearby. Overcast daylight, city sidewalk, eye-level shot.
```

## `p1d` — 商品上架

- **檔名**:`images/part1/p1d.jpg`
- **中文情境**:一名男子正把商品放到店內的貨架上。
- **正解句(畫面必須成立的條件)**:`A man is stocking shelves with merchandise.`
- **不可出現在畫面中**(這些是干擾選項):
  - `The shelves are completely empty.`
  - `Customers are waiting in line at a counter.`
  - `A man is sweeping the floor.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic retail photo: a man in a blue apron places a boxed product onto a wooden shop shelf, holding one item in his hand. The shelves are already partly filled with colorful boxes, so they are not empty. A cardboard carton sits on the floor next to him. No customers, no counter, no queue, no broom in the frame. Bright store lighting, eye-level shot.
```

## `p1e` — 戶外咖啡座

- **檔名**:`images/part1/p1e.jpg`
- **中文情境**:遮陽傘下的戶外座位區,兩人坐在桌邊。
- **正解句(畫面必須成立的條件)**:`Some tables are shaded by umbrellas.`
- **不可出現在畫面中**(這些是干擾選項):
  - `The umbrellas have been folded up.`
  - `A waiter is taking an order.`
  - `The chairs have been stacked against a wall.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic outdoor cafe photo: two round wooden tables stand on a terrace, each shaded by a large open patio umbrella (umbrellas are open, not folded). Two customers sit at the tables with cups in front of them. No waiter is taking an order and no chairs are stacked against a wall. Sunny afternoon, casual street cafe, slightly elevated eye-level shot.
```

## `p1f` — 會議簡報

- **檔名**:`images/part1/p1f.jpg`
- **中文情境**:數人圍坐在會議桌旁,牆上有一面投影螢幕。
- **正解句(畫面必須成立的條件)**:`A group of people is gathered around a table.`
- **不可出現在畫面中**(這些是干擾選項):
  - `The room is unoccupied.`
  - `They are hanging a screen on the wall.`
  - `Everyone is standing near the doorway.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic meeting room photo: three colleagues are seated around a long conference table, facing a presentation screen mounted on the wall. The screen is already hanging on the wall — nobody is installing or hanging it. Notebooks and cups are on the table. The room is occupied and nobody is standing near the doorway. Bright office lighting, wide eye-level shot.
```

## `p1g` — 施工現場

- **檔名**:`images/part1/p1g.jpg`
- **中文情境**:工地現場有起重機吊著貨物,一名戴安全帽的工人站在旁邊。
- **正解句(畫面必須成立的條件)**:`A worker is wearing a hard hat.`
- **不可出現在畫面中**(這些是干擾選項):
  - `A worker is putting on a hard hat.`
  - `The building has been demolished.`
  - `Some materials are being carried by hand.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic construction site photo: a worker in a green safety vest is already wearing a yellow hard hat on his head (the helmet is on, not being put on). Behind him a yellow crane lifts a wooden crate above a partly built concrete building with scaffolding. The building is under construction, not demolished. Nobody carries materials by hand. Daylight, wide eye-level shot.
```

## `p1h` — 碼頭貨櫃

- **檔名**:`images/part1/p1h.jpg`
- **中文情境**:碼頭邊堆放著彩色貨櫃,水面上停著一艘船。
- **正解句(畫面必須成立的條件)**:`Containers are stacked near the water.`
- **不可出現在畫面中**(這些是干擾選項):
  - `The containers are being loaded onto a truck.`
  - `The boat has been pulled out of the water.`
  - `Workers are painting the containers.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic harbor photo: colorful shipping containers are stacked two high on a concrete dock beside the water. A cargo boat floats on the water next to the dock. No truck is present and no containers are being loaded; nobody is painting anything and no people are visible. Clear daylight, calm water, wide eye-level shot.
```

## `p1i` — 餐廳廚房

- **檔名**:`images/part1/p1i.jpg`
- **中文情境**:廚師在流理台前備餐,爐上有鍋子。
- **正解句(畫面必須成立的條件)**:`A chef is preparing food in a kitchen.`
- **不可出現在畫面中**(這些是干擾選項):
  - `The pots are being washed in a sink.`
  - `Dishes are stacked on a dining table.`
  - `A customer is looking at a menu.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic restaurant kitchen photo: a chef in a white uniform and hat stands at a stainless steel counter preparing food, with a pot on the stove beside him. The pots are on the stove, not in a sink being washed. No dining table with stacked dishes and no customer with a menu in the frame. Bright kitchen lighting, eye-level shot.
```

## `p1j` — 圖書館書架

- **檔名**:`images/part1/p1j.jpg`
- **中文情境**:書架上放滿書,一個人坐在桌前看著攤開的書。
- **正解句(畫面必須成立的條件)**:`Books have been arranged on the shelves.`
- **不可出現在畫面中**(這些是干擾選項):
  - `A man is putting books into a box.`
  - `The shelves are being assembled.`
  - `People are lining up at a checkout desk.`

**English prompt(直接貼給生圖 AI):**

```
A photorealistic library photo: tall wooden shelves are neatly filled with rows of colorful books (books already arranged, nobody shelving them). A man sits at a wooden table reading an open book. No boxes are being packed, the shelves are fully assembled, and there is no queue at a checkout desk. Warm indoor lighting, quiet library, eye-level shot.
```
