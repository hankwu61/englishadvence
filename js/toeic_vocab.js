// ============================================================
//  📕 多益 13 大主題字彙庫 - 介面邏輯
//  主題心智圖 / 字彙卡(同反義・片語・解析・字根圖解)/ 混合題型測驗
//  字根字首總表(圖解)
// ============================================================
"use strict";

const tvoc = { theme: null };

// ---------- 主題清單 ----------
function renderToeicVocabList() {
  audioPlayer.pause();
  if (typeof stopReadAlong === "function") stopReadAlong();
  toeic.view = "vc-list";
  $("#toeic-sub").textContent = "📕 13 大主題字彙庫";
  const d = toeicData();
  const total = TOEIC_VOCAB.reduce((a, t) => a + t.list.length, 0);
  const box = toeicBox();
  box.innerHTML = `
    <div class="steps-tip">依多益 13 大情境分類的 <b>${total} 個必考字</b>。每個字都附英英釋義、同反義字、重點片語與用法解析,部分字附<b>字根字首拆解</b>。點卡片展開細節,背完做混合題型測驗。</div>
    <button id="vc-affix" class="task-card vc-affix-card">
      <span class="task-icon i2">🧬</span>
      <span class="task-info"><b>字根字首字尾總表</b><span>用構詞邏輯一次記住整組字,不再死背</span></span>
      <span class="task-go">›</span>
    </button>
    <div id="vc-themes"></div>`;
  const list = $("#vc-themes");
  for (const t of TOEIC_VOCAB) {
    const b = d["vc_" + t.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${t.icon}</span>
      <span class="task-info"><b><span class="ts-no">${t.no}</span>${t.name}<small>${t.en}</small></b><span>${t.list.length} 個必考字・${t.map.branches.length} 大分類</span></span>
      <span class="toeic-best">${b !== undefined ? `最佳 ${b}%` : "未測驗"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeicVocabTheme(t));
    list.appendChild(el);
  }
  $("#vc-affix").addEventListener("click", renderToeicAffixes);
}

// ---------- 主題心智圖 ----------
function vocabMapHTML(t) {
  const colors = ["var(--primary)", "var(--accent)", "var(--sky)", "var(--good)", "var(--gold)"];
  return `
    <div class="vc-map">
      <div class="vc-map-center">${t.icon} ${t.map.center}</div>
      <div class="vc-map-branches">
        ${t.map.branches.map((b, i) => `
          <div class="vc-branch" style="--bc:${colors[i % colors.length]}">
            <div class="vc-branch-label">${b.label}</div>
            <div class="vc-branch-words">${b.ws.map((w) => `<span class="vc-mw" data-w="${w}">${w}</span>`).join("")}</div>
          </div>`).join("")}
      </div>
    </div>`;
}

// ---------- 字根圖解:把 "re-(再) + nov(新) + -ate → 使再變新" 畫成色塊 ----------
function rootDiagramHTML(r) {
  const [parts, meaning] = r.split("→").map((s) => s.trim());
  const chips = parts.split("+").map((p, i) => {
    const m = p.trim().match(/^(.+?)\s*\((.+)\)$/);
    const cls = ["pre", "root", "suf"][Math.min(i, 2)];
    return m
      ? `<span class="vc-chip ${cls}"><b>${m[1]}</b><i>${m[2]}</i></span>`
      : `<span class="vc-chip ${cls}"><b>${p.trim()}</b></span>`;
  }).join('<span class="vc-plus">+</span>');
  return `<div class="vc-root">${chips}${meaning ? `<span class="vc-arrow">→</span><span class="vc-root-mean">${meaning}</span>` : ""}</div>`;
}

// ---------- 字彙卡 ----------
function vocabCardHTML(it, themeName) {
  const tags = [];
  if (it.syn?.length) tags.push(`<div class="vc-line"><span class="vc-tag syn">同義</span>${it.syn.join("、")}</div>`);
  if (it.ant?.length) tags.push(`<div class="vc-line"><span class="vc-tag ant">反義</span>${it.ant.join("、")}</div>`);
  if (it.ph?.length) tags.push(`<div class="vc-line"><span class="vc-tag ph">片語</span><span class="vc-phs">${
    it.ph.map(([en, zh]) => `<span class="vc-ph"><b>${en}</b> ${zh}</span>`).join("")}</span></div>`);
  if (it.n) tags.push(`<div class="vc-line"><span class="vc-tag note">解析</span>${it.n}</div>`);
  if (it.r) tags.push(`<div class="vc-line"><span class="vc-tag root">字根</span>${rootDiagramHTML(it.r)}</div>`);
  return `
    <div class="vc-card" data-w="${it.w}">
      <div class="vc-head">
        <button class="vc-play">🔊</button>
        <div class="vc-title"><b>${it.w}</b> <i>${it.p}</i></div>
        <div class="vc-zh">${it.zh}</div>
        <button class="vc-star ${nbHasWord(it.w) ? "on" : ""}">${nbHasWord(it.w) ? "⭐" : "☆"}</button>
        <button class="vc-toggle">▾</button>
      </div>
      <div class="vc-def">${it.d}</div>
      <div class="vc-body">${tags.join("")}</div>
    </div>`;
}

function openToeicVocabTheme(t) {
  audioPlayer.pause();
  toeic.view = "vc";
  tvoc.theme = t;
  $("#toeic-sub").textContent = `${t.icon} ${t.name}`;
  const box = toeicBox();
  box.innerHTML = `
    <div class="practice-panel">
      <div class="ts-head">
        <span class="ts-badge">主題 ${t.no} · ${t.en}</span>
        <span class="ts-doc">${t.list.length} 字</span>
      </div>
      ${vocabMapHTML(t)}
      <div class="steps-tip">點 🔊 聽發音、點卡片展開<b>同反義字・重點片語・用法解析・字根圖解</b>,點 ☆ 收藏到單字單句本。</div>
      <div class="practice-actions">
        <button id="vc-expand" class="btn-secondary">全部展開</button>
        <button id="vc-quiz-btn" class="btn-primary">📝 主題測驗(15 題)</button>
      </div>
      <div id="vc-cards">${t.list.map((it) => vocabCardHTML(it, t.name)).join("")}</div>
      <div id="vc-quiz-box" style="margin-top:14px"></div>
    </div>`;

  // 心智圖的字 → 捲到該字卡並展開
  box.querySelectorAll(".vc-mw").forEach((s) =>
    s.addEventListener("click", () => {
      const card = box.querySelector(`.vc-card[data-w="${s.dataset.w}"]`);
      if (!card) return;
      card.classList.add("open");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("flash");
      setTimeout(() => card.classList.remove("flash"), 900);
    }));

  box.querySelectorAll(".vc-card").forEach((card) => {
    const w = card.dataset.w;
    const item = t.list.find((x) => x.w === w);
    card.querySelector(".vc-play").addEventListener("click", (e) => {
      e.stopPropagation();
      playWordAudio(`audio/${w.toLowerCase().replace(/[^a-z]/g, "")}.mp3`, e.currentTarget, w);
    });
    card.querySelector(".vc-star").addEventListener("click", (e) => {
      e.stopPropagation();
      const added = nbToggleWord({ w, zh: `${item.p} ${item.zh}`, sentence: `TOEIC ${t.name}主題字彙` });
      e.target.textContent = added ? "⭐" : "☆";
      e.target.classList.toggle("on", added);
    });
    const toggle = () => card.classList.toggle("open");
    card.querySelector(".vc-toggle").addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
    card.querySelector(".vc-head").addEventListener("click", toggle);
  });

  let expanded = false;
  $("#vc-expand").addEventListener("click", (e) => {
    expanded = !expanded;
    box.querySelectorAll(".vc-card").forEach((c) => c.classList.toggle("open", expanded));
    e.target.textContent = expanded ? "全部收合" : "全部展開";
  });
  $("#vc-quiz-btn").addEventListener("click", () => startVocabQuiz(t));
}

// ---------- 混合題型測驗:中→英 / 英英釋義 / 片語填空 / 同反義 ----------
function startVocabQuiz(t) {
  const all = TOEIC_VOCAB.flatMap((x) => x.list);
  const pool = shuffle(t.list.slice());
  const items = [];
  const otherZh = (self) => shuffle(all.filter((x) => x.zh !== self.zh)).slice(0, 3).map((x) => x.zh);
  const otherW = (self) => shuffle(all.filter((x) => x.w !== self.w)).slice(0, 3).map((x) => x.w);

  for (const it of pool) {
    if (items.length >= 15) break;
    const kinds = [];
    kinds.push(() => ({ q: `<span class="vc-qt zh">中譯英</span>「${it.zh}」的英文是?`, opts: [it.w, ...otherW(it)], note: `${it.w}(${it.p})${it.zh}` }));
    kinds.push(() => ({ q: `<span class="vc-qt def">英英</span>${it.d}`, opts: [it.w, ...otherW(it)], note: `${it.w} = ${it.zh}` }));
    if (it.ph?.length) {
      const [en, zh] = it.ph[0];
      const blanked = en.replace(new RegExp(it.w, "i"), "______");
      if (blanked !== en) kinds.push(() => ({ q: `<span class="vc-qt ph">片語</span>${blanked}(${zh})`, opts: [it.w, ...otherW(it)], note: `${en} = ${zh}` }));
    }
    if (it.syn?.length) kinds.push(() => ({ q: `<span class="vc-qt syn">同義</span>與 <b>${it.w}</b> 意思最接近的是?`, opts: [it.syn[0], ...otherW(it)], note: `${it.w} ≈ ${it.syn.join("、")}` }));
    if (it.ant?.length) kinds.push(() => ({ q: `<span class="vc-qt ant">反義</span>與 <b>${it.w}</b> 意思相反的是?`, opts: [it.ant[0], ...otherW(it)], note: `${it.w} ↔ ${it.ant.join("、")}` }));
    items.push(shuffle(kinds)[0]());
  }

  const qb = $("#vc-quiz-box");
  qb.innerHTML = `<div class="card-title" style="margin-bottom:10px">📝 ${t.name}・主題測驗</div>
    <div class="fb-note" style="margin-bottom:10px">題型隨機混合:中譯英、英英釋義、片語填空、同義字、反義字。</div>`;
  renderQuizInto(qb, items, (c) => {
    const pct = Math.round((c / items.length) * 100);
    toeicSave("vc_" + t.id, pct);
    qb.insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 80 ? "good" : "bad"}">測驗完成:${c}/${items.length}(${pct}%),已記錄最佳成績。</div>
      <div class="practice-actions">
        <button class="btn-primary" onclick="startVocabQuiz(TOEIC_VOCAB.find(x=>x.id==='${t.id}'))">再測一輪</button>
        <button class="btn-secondary" onclick="renderToeicVocabList()">回主題清單</button>
      </div>`);
  });
  qb.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- 字根字首字尾總表 ----------
function renderToeicAffixes() {
  audioPlayer.pause();
  toeic.view = "vc-affix";
  $("#toeic-sub").textContent = "🧬 字根字首字尾";
  const box = toeicBox();
  box.innerHTML = `
    <div class="steps-tip">多益字彙有大量「同一組零件拼出來」的字。認得零件,遇到沒背過的字也能猜出方向——這是閱讀速度的關鍵。</div>
    <div class="vc-legend">
      <span><i class="vc-chip pre"></i>字首:方向與否定</span>
      <span><i class="vc-chip root"></i>字根:核心語意</span>
      <span><i class="vc-chip suf"></i>字尾:詞性與角色</span>
    </div>
    <div id="vc-affix-groups"></div>`;
  const groups = $("#vc-affix-groups");
  for (const g of TOEIC_AFFIXES) {
    const panel = document.createElement("div");
    panel.className = "card";
    panel.innerHTML = `<div class="card-title" style="color:${g.color}">${g.type}(${g.items.length} 組)</div>
      <div class="vc-affix-list">${g.items.map((it) => `
        <div class="vc-affix" style="--ac:${g.color}">
          <div class="vc-affix-head"><b>${it.a}</b><span>${it.m}</span></div>
          <div class="vc-affix-ex">${it.ex.map((e) => `<span>${e}</span>`).join("")}</div>
        </div>`).join("")}</div>`;
    groups.appendChild(panel);
  }
  box.insertAdjacentHTML("beforeend",
    `<div class="practice-actions"><button class="btn-secondary" onclick="renderToeicVocabList()">回主題清單</button></div>`);
}
