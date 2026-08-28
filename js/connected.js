// 英語冒險王 - 商務連音特訓資料庫(Connected Speech)
// 三種機制:link 連音 / flap 閃音 / weak 弱讀
// s = 商務會議例句, focus = 聽寫填空目標(機制發生處), phon = 實際聽起來的樣子,
// alt = 也算對的拼法(口語縮寫), cn = 中文, note = 機制說明
const CONN_MECHS = {
  link: { name: "連音 Linking", emoji: "🔗", desc: "子音結尾+母音開頭 → 黏在一起唸:move on → mo‿von" },
  flap: { name: "閃音 Flap T", emoji: "⚡", desc: "夾在母音中間的 t 變成輕快的 d:meeting → mee‿ding" },
  weak: { name: "弱讀 Reduction", emoji: "🪶", desc: "功能詞被壓縮:can→kən、going to→gonna、them→'em" },
};

const CONN_BANK = [
  // ---- 連音 Linking ----
  { id: "conn_01", mech: "link", s: "Let's move on to the next item.", focus: "move on to", phon: "mo‿von‿tu", alt: [],
    cn: "我們進到下一個議題。", note: "move 的 v 接 on 的 o、on 的 n 接 to,三個字黏成一串。" },
  { id: "conn_02", mech: "link", s: "Can you fill us in on the details?", focus: "fill us in", phon: "fi‿lu‿sin", alt: [],
    cn: "可以跟我們說明一下細節嗎?", note: "fill 的 l 滑進 us、us 的 s 滑進 in,聽起來像一個字。" },
  { id: "conn_03", mech: "link", s: "We need to work it out before the call.", focus: "work it out", phon: "wor‿ki‿dout", alt: [],
    cn: "我們得在電話會議前把它解決。", note: "k 連 it、it 的 t 夾在母音間閃音成 d 再連 out(連音+閃音合體)。" },
  { id: "conn_04", mech: "link", s: "Let me check it out and get back to you.", focus: "check it out", phon: "che‿ki‿dout", alt: [],
    cn: "讓我確認一下再回覆你。", note: "經典三連:check‿it‿out,t 閃音變 d。" },
  { id: "conn_05", mech: "link", s: "Our team will take over the account.", focus: "take over", phon: "tei‿kou‿ver", alt: [],
    cn: "我們團隊會接手這個客戶。", note: "take 的 k 直接接 over 的 o,中間完全不斷開。" },
  { id: "conn_06", mech: "link", s: "Please hand it in by end of day.", focus: "hand it in", phon: "han‿di‿din", alt: [],
    cn: "請在今天下班前交出來。", note: "d 連 it、t 閃音連 in;end of day 也連成 en‿dov‿day。" },
  // ---- 閃音 Flap T ----
  { id: "conn_07", mech: "flap", s: "Let's get it done before the deadline.", focus: "get it done", phon: "ge‿di‿dun", alt: [],
    cn: "我們在期限前把它完成吧。", note: "get 和 it 的 t 都夾在母音間 → 全部變成輕快的 d。" },
  { id: "conn_08", mech: "flap", s: "The bottom line is we're over budget.", focus: "bottom line", phon: "bah‿dom line", alt: [],
    cn: "重點是我們超出預算了。", note: "bottom 的 tt 夾在母音間 → 閃音 d:「巴登」不是「巴騰」。" },
  { id: "conn_09", mech: "flap", s: "Can we set up a meeting for Monday?", focus: "a meeting", phon: "ə mee‿ding", alt: [],
    cn: "我們可以約週一開會嗎?", note: "meeting 的 t 閃音 → mee-ding;set up 也連成 se‿dup。" },
  { id: "conn_10", mech: "flap", s: "We have a lot of feedback from the client.", focus: "a lot of", phon: "ə‿lah‿duv", alt: ["a lotta"],
    cn: "客戶給了我們很多回饋。", note: "lot 的 t 夾在母音間閃音,of 弱讀成 /əv/ → 整串唸「ə-lah-duv」。" },
  { id: "conn_11", mech: "flap", s: "Let's not put it off any longer.", focus: "put it off", phon: "pu‿di‿doff", alt: [],
    cn: "別再拖延了。", note: "put 和 it 的 t 都閃音變 d,三個字一口氣唸完。" },
  { id: "conn_12", mech: "flap", s: "I'll send you the updated report later.", focus: "updated", phon: "up‿day‿did", alt: [],
    cn: "我稍後把更新版報告寄給你。", note: "updated 兩個 t 都夾在母音間 → up-day-did;later → lay-der。" },
  // ---- 弱讀 Reduction ----
  { id: "conn_13", mech: "weak", s: "Can you walk us through the numbers?", focus: "can you", phon: "kən‿yə", alt: [],
    cn: "可以帶我們看一遍這些數字嗎?", note: "肯定句的 can 幾乎都弱讀成 /kən/;重讀的反而是 can't。" },
  { id: "conn_14", mech: "weak", s: "We should have finished the draft by now.", focus: "should have", phon: "shoulda", alt: ["should've", "shoulda"],
    cn: "我們現在早該完成草稿了。", note: "have 弱讀成 /əv/ → should've,快速口語再變 shoulda。" },
  { id: "conn_15", mech: "weak", s: "I'm going to follow up with them tomorrow.", focus: "going to", phon: "gonna", alt: ["gonna"],
    cn: "我明天會跟他們追進度。", note: "going to(未來式)→ gonna;with them → with 'em。" },
  { id: "conn_16", mech: "weak", s: "Do you want to schedule a quick call?", focus: "want to", phon: "wanna", alt: ["wanna"],
    cn: "要不要約個簡短的電話會議?", note: "want to → wanna;Do you 也常縮成 D'ya。" },
  { id: "conn_17", mech: "weak", s: "We're waiting for approval from the board.", focus: "waiting for", phon: "way‿ding fɚ", alt: [],
    cn: "我們在等董事會核准。", note: "for 弱讀成 /fɚ/ 輕輕帶過;waiting 的 t 同時閃音。" },
  { id: "conn_18", mech: "weak", s: "Could you send them the agenda?", focus: "send them", phon: "sen‿dem", alt: ["send 'em", "send em"],
    cn: "可以把議程寄給他們嗎?", note: "them 弱讀掉 th → 'em,黏在 send 後面:sen-dem。" },
];
