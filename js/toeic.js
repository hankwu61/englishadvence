// ============================================================
//  💼 多益 TOEIC 專區 - 邏輯
//  高頻單字 / Part 2 應答 / Part 5 填空 / Part 3・4 聽力 / Part 7 閱讀
//  各部最佳成績 → 預估分數帶(金/藍/綠色證書)
// ============================================================
"use strict";

const toeic = { view: "hub", p2queue: [], p2idx: 0, p2score: 0 };

// ---------- 成績儲存與估分 ----------
function toeicData() {
  try { return JSON.parse(localStorage.getItem("ea_toeic") || "{}"); } catch { return {}; }
}
function toeicSave(key, pct) {
  const d = toeicData();
  if (!(d[key] >= pct)) d[key] = pct;
  try { localStorage.setItem("ea_toeic", JSON.stringify(d)); } catch { /* ignore */ }
  updateToeicEntry();
}

// 依已練習部分的平均正確率,粗估 TOEIC 分數帶
function toeicEstimate() {
  const d = toeicData();
  const parts = [];
  if (d.p1 !== undefined) parts.push(d.p1);
  if (d.p2 !== undefined) parts.push(d.p2);
  if (d.p5 !== undefined) parts.push(d.p5);
  if (d.voc !== undefined) parts.push(d.voc);
  const lc = TOEIC_LC.map((s) => d["lc_" + s.id]).filter((x) => x !== undefined);
  if (lc.length) parts.push(lc.reduce((a, b) => a + b, 0) / lc.length);
  const p7 = TOEIC_PART7.map((p) => d["p7_" + p.id]).filter((x) => x !== undefined);
  if (p7.length) parts.push(p7.reduce((a, b) => a + b, 0) / p7.length);
  const sc = TOEIC_SCENES.map((s) => d["sc_" + s.id]).filter((x) => x !== undefined);
  if (sc.length) parts.push(sc.reduce((a, b) => a + b, 0) / sc.length);
  const vc = TOEIC_VOCAB.map((t) => d["vc_" + t.id]).filter((x) => x !== undefined);
  if (vc.length) parts.push(vc.reduce((a, b) => a + b, 0) / vc.length);
  if (!parts.length) return null;
  const pct = parts.reduce((a, b) => a + b, 0) / parts.length;
  const score = Math.round((pct / 100) * 990 / 5) * 5;
  const band = score >= 860 ? { name: "金色證書", color: "#C9A227" }
    : score >= 730 ? { name: "藍色證書", color: "#2563EB" }
    : score >= 470 ? { name: "綠色證書", color: "#16A34A" }
    : score >= 220 ? { name: "棕色證書", color: "#92600A" }
    : { name: "橘色證書", color: "#EA7317" };
  return { pct: Math.round(pct), score, band, partsDone: parts.length };
}

function updateToeicEntry() {
  const el = $("#toeic-entry-best");
  if (!el) return;
  const est = toeicEstimate();
  el.textContent = est ? `預估 ${est.score} 分・${est.band.name}` : "尚未練習";
}

// ---------- 畫面骨架 ----------
function openTOEIC() {
  toeic.view = "hub";
  showScreen("#screen-toeic");
  renderToeicHub();
}

function toeicBack() {
  audioPlayer.pause();
  if (typeof stopReadAlong === "function") stopReadAlong();
  if (toeic.view === "hub") { goHome(); switchTab("learn"); }
  else { toeic.view = "hub"; renderToeicHub(); }
}

const toeicBox = () => $("#toeic-content");

// ---------- Hub ----------
function renderToeicHub() {
  toeic.view = "hub";
  $("#toeic-sub").textContent = "選一個部分開始練習";
  const d = toeicData();
  const est = toeicEstimate();
  const best = (k) => (d[k] !== undefined ? `最佳 ${d[k]}%` : "未練習");
  const lcDone = TOEIC_LC.filter((s) => d["lc_" + s.id] !== undefined).length;
  const p7Done = TOEIC_PART7.filter((p) => d["p7_" + p.id] !== undefined).length;

  toeicBox().innerHTML = `
    <div class="card toeic-band" ${est ? `style="border-left:6px solid ${est.band.color}"` : ""}>
      ${est
        ? `<div class="tb-score" style="color:${est.band.color}">${est.score} <small>/ 990</small></div>
           <div class="tb-band">預估落點:<b style="color:${est.band.color}">${est.band.name}</b>・平均正確率 ${est.pct}%(已練 ${est.partsDone} 個部分)</div>
           <div class="fb-note">依練習正確率粗估,多練幾個部分會更準;實際成績以正式測驗為準。</div>`
        : `<div class="tb-band"><b>還沒有練習紀錄</b></div>
           <div class="fb-note">完成任一部分的練習後,這裡會出現你的預估分數帶(金/藍/綠色證書)。</div>`}
    </div>
    <div id="toeic-parts"></div>`;

  const vcTotal = TOEIC_VOCAB.reduce((a, t) => a + t.list.length, 0);
  const vcDone = TOEIC_VOCAB.filter((t) => d["vc_" + t.id] !== undefined).length;
  const scDone = TOEIC_SCENES.filter((s) => d["sc_" + s.id] !== undefined).length;
  const parts = [
    { icon: "📚", t: "13 大情境課文", s: "官方歸納的職場與生活情境,朗讀跟讀 + 理解測驗", b: `完成 ${scDone}/${TOEIC_SCENES.length} 篇`, go: renderToeicSceneList },
    { icon: "📕", t: "13 大主題字彙庫", s: `${vcTotal} 個必考字:同反義字、片語、解析、字根圖解`, b: `測驗 ${vcDone}/${TOEIC_VOCAB.length} 主題`, go: renderToeicVocabList },
    { icon: "📷", t: "Part 1 照片描述", s: "看圖聽四句描述,選出最貼切的(6 題/輪)", b: best("p1"), go: startToeicP1 },
    { icon: "🎧", t: "Part 2 應答問題", s: "聽問題,選出最合適的回應(8 題/輪)", b: best("p2"), go: startToeicP2 },
    { icon: "🗣️", t: "Part 3・4 對話與獨白", s: "雙聲道對話 + 廣播獨白,聽完答題", b: `完成 ${lcDone}/${TOEIC_LC.length} 組`, go: renderToeicLCList },
    { icon: "✏️", t: "Part 5 句子填空", s: "文法與詞彙選擇題(10 題/輪)", b: best("p5"), go: startToeicP5 },
    { icon: "📄", t: "Part 7 閱讀測驗", s: "商務書信、公告、廣告閱讀", b: `完成 ${p7Done}/${TOEIC_PART7.length} 篇`, go: renderToeicP7List },
  ];
  const box = $("#toeic-parts");
  for (const p of parts) {
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${p.icon}</span>
      <span class="task-info"><b>${p.t}</b><span>${p.s}</span></span>
      <span class="toeic-best">${p.b}</span><span class="task-go">›</span>`;
    el.addEventListener("click", p.go);
    box.appendChild(el);
  }
}

// ---------- Part 2 應答問題(一次 8 題,音檔為主)----------
function startToeicP2() {
  toeic.view = "p2";
  toeic.p2queue = shuffle(TOEIC_PART2.map((_, i) => i)).slice(0, 8);
  toeic.p2idx = 0;
  toeic.p2score = 0;
  renderToeicP2();
}

function renderToeicP2() {
  $("#toeic-sub").textContent = `🎧 Part 2 應答問題・第 ${toeic.p2idx + 1} / ${toeic.p2queue.length} 題`;
  const qi = toeic.p2queue[toeic.p2idx];
  const item = TOEIC_PART2[qi];
  const order = shuffle([0, 1, 2]);
  const box = toeicBox();
  box.innerHTML = `
    <div class="practice-panel">
      <div class="steps-tip">先聽問題(可重播),再從三個回應中選出最合適的;每個回應也可以點 🔊 聽。</div>
      <button id="tp2-play" class="btn-audio">🔊 播放問題</button>
      <div id="tp2-opts"></div>
      <div id="tp2-fb" class="feedback"></div>
      <div id="tp2-note" class="feedback-def"></div>
      <div class="practice-actions"><button id="tp2-next" class="btn-primary" style="display:none">下一題 →</button></div>
    </div>`;
  const play = () => playAudio(`audio/t2q_${qi}.mp3`, $("#tp2-play"));
  $("#tp2-play").addEventListener("click", play);
  play();

  const optsBox = $("#tp2-opts");
  let answered = false;
  order.forEach((j, k) => {
    const row = document.createElement("div");
    row.className = "tp2-row";
    row.innerHTML = `
      <button class="opt-btn tp2-opt">${String.fromCharCode(65 + k)}. ${item.r[j]}</button>
      <button class="btn-mini-audio tp2-listen">🔊</button>`;
    row.querySelector(".tp2-listen").addEventListener("click", (e) =>
      playAudio(`audio/t2r_${qi}_${j}.mp3`, e.target));
    row.querySelector(".tp2-opt").addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const right = j === 0;
      if (right) toeic.p2score++;
      optsBox.querySelectorAll(".tp2-opt").forEach((b, idx2) => {
        b.disabled = true;
        if (order[idx2] === 0) b.classList.add("correct");
        else if (b === row.querySelector(".tp2-opt")) b.classList.add("wrong");
        else b.classList.add("dim");
      });
      $("#tp2-fb").textContent = right ? "✅ 正確!" : `❌ 正解:${item.r[0]}`;
      $("#tp2-fb").className = "feedback " + (right ? "good" : "bad");
      $("#tp2-note").textContent = "📌 " + item.note;
      $("#tp2-next").style.display = "inline-block";
    });
    optsBox.appendChild(row);
  });

  $("#tp2-next").addEventListener("click", () => {
    toeic.p2idx++;
    if (toeic.p2idx < toeic.p2queue.length) renderToeicP2();
    else {
      const pct = Math.round((toeic.p2score / toeic.p2queue.length) * 100);
      toeicSave("p2", pct);
      toeicBox().innerHTML = `
        <div class="result-panel">
          <div class="result-emoji">${pct >= 80 ? "🏆" : "🎧"}</div>
          <div class="result-title ${pct >= 60 ? "win" : "lose"}">${pct}%</div>
          <div class="game-subtitle">答對 ${toeic.p2score} / ${toeic.p2queue.length} 題,已記錄最佳成績</div>
          <div class="result-actions">
            <button class="btn-primary" onclick="startToeicP2()">再練一輪</button>
            <button class="btn-secondary" onclick="renderToeicHub()">回多益專區</button>
          </div>
        </div>`;
    }
  });
}

// ---------- Part 5 句子填空 ----------
function startToeicP5() {
  toeic.view = "p5";
  $("#toeic-sub").textContent = "✏️ Part 5 句子填空";
  const picked = shuffle(TOEIC_PART5).slice(0, 10);
  const items = picked.map((it) => ({ q: it.s, opts: it.opts, note: it.note }));
  const box = toeicBox();
  box.innerHTML = `
    <div class="steps-tip">TOEIC 最經典的文法題型:選出最適合填入空格的字。每題作答後立即顯示解析。</div>
    <div id="tp5-quiz" class="practice-panel"></div>`;
  renderQuizInto($("#tp5-quiz"), items, (c) => {
    const pct = Math.round((c / items.length) * 100);
    toeicSave("p5", pct);
    $("#tp5-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 70 ? "good" : "bad"}">本輪 ${c}/${items.length}(${pct}%),已記錄最佳成績。</div>
      <div class="practice-actions">
        <button class="btn-primary" onclick="startToeicP5()">再練一輪</button>
        <button class="btn-secondary" onclick="renderToeicHub()">回多益專區</button>
      </div>`);
  });
}

// ---------- Part 3・4 聽力 ----------
function renderToeicLCList() {
  toeic.view = "lc-list";
  $("#toeic-sub").textContent = "🗣️ Part 3・4 對話與獨白";
  const d = toeicData();
  const box = toeicBox();
  box.innerHTML = `<div class="steps-tip">先聽完整段(男女雙聲道),邊聽邊作答;答完會顯示逐字稿供精聽複習。</div>`;
  for (const set of TOEIC_LC) {
    const b = d["lc_" + set.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i2">${set.icon}</span>
      <span class="task-info"><b>${set.part}:${set.title}</b><span>${set.lines.length} 句・${set.questions.length} 題</span></span>
      <span class="toeic-best">${b !== undefined ? `最佳 ${b}%` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeicLC(set));
    box.appendChild(el);
  }
}

function playToeicSeq(files, btn) {
  let i = 0;
  btn?.classList.add("playing");
  const next = () => {
    if (i >= files.length) { btn?.classList.remove("playing"); audioPlayer.onended = null; return; }
    audioPlayer.src = files[i++];
    audioPlayer.onended = next;
    audioPlayer.play().catch(() => { btn?.classList.remove("playing"); });
  };
  audioPlayer.pause();
  next();
}

function openToeicLC(set) {
  toeic.view = "lc";
  $("#toeic-sub").textContent = `🗣️ ${set.part}:${set.title}`;
  const files = set.lines.map((_, k) => `audio/t3_${set.id}_${k}.mp3`);
  const box = toeicBox();
  box.innerHTML = `
    <div class="practice-panel">
      <button id="tlc-play" class="btn-audio">▶ 播放整段(${set.lines.length} 句)</button>
      <div class="q-hint">可以邊聽邊看下面的題目作答——這正是 TOEIC 的實戰技巧。</div>
      <div id="tlc-quiz"></div>
      <div id="tlc-script" style="display:none">
        <div class="card-title" style="margin:14px 0 8px">📜 逐字稿(點 🔊 逐句精聽)</div>
        <div id="tlc-lines"></div>
      </div>
    </div>`;
  $("#tlc-play").addEventListener("click", () => playToeicSeq(files, $("#tlc-play")));
  playToeicSeq(files, $("#tlc-play"));

  renderQuizInto($("#tlc-quiz"), set.questions, (c) => {
    const pct = Math.round((c / set.questions.length) * 100);
    toeicSave("lc_" + set.id, pct);
    audioPlayer.pause();
    // 顯示逐字稿
    const sc = $("#tlc-script");
    sc.style.display = "block";
    const lines = $("#tlc-lines");
    set.lines.forEach((ln, k) => {
      const row = document.createElement("div");
      row.className = "tlc-line";
      row.innerHTML = `<span class="tlc-sp ${ln.sp === "M" ? "m" : "w"}">${ln.sp === "M" ? "👨 M" : "👩 W"}</span>
        <span class="tlc-en">${ln.en}</span>
        <button class="btn-mini-audio">🔊</button>`;
      row.querySelector("button").addEventListener("click", (e) => playAudio(files[k], e.target));
      lines.appendChild(row);
    });
    $("#tlc-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 66 ? "good" : "bad"}">本組 ${c}/${set.questions.length}(${pct}%),已記錄最佳成績。逐字稿在下方,建議把答錯那題對應的句子多聽幾次。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderToeicLCList()">回聽力清單</button></div>`);
  });
}

// ---------- Part 7 閱讀 ----------
function renderToeicP7List() {
  toeic.view = "p7-list";
  $("#toeic-sub").textContent = "📄 Part 7 閱讀測驗";
  const d = toeicData();
  const box = toeicBox();
  box.innerHTML = `<div class="steps-tip">TOEIC 常見的商務文件:先掃讀題目再回文章找答案。文章中任何單字都可以點擊查釋義。</div>`;
  for (const p of TOEIC_PART7) {
    const b = d["p7_" + p.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i3">${p.icon}</span>
      <span class="task-info"><b>${p.type}:${p.title}</b><span>${p.questions.length} 題</span></span>
      <span class="toeic-best">${b !== undefined ? `最佳 ${b}%` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeicP7(p));
    box.appendChild(el);
  }
}

function openToeicP7(p) {
  toeic.view = "p7";
  $("#toeic-sub").textContent = `📄 ${p.type}:${p.title}`;
  const box = toeicBox();
  // 逐字包成可點擊(共用單字彈窗)
  const html = p.text.split("\n").map((line) =>
    line.split(/([A-Za-z][A-Za-z']*)/g)
      .map((t) => (/^[A-Za-z][A-Za-z']*$/.test(t) ? `<span class="pw">${t}</span>` : t.replace(/</g, "&lt;")))
      .join("")).join("<br>");
  box.innerHTML = `
    <div class="practice-panel">
      <div class="sentence-box passage tp7-text">${html}</div>
      <div id="tp7-quiz"></div>
    </div>`;
  box.querySelectorAll(".pw").forEach((w) =>
    w.addEventListener("click", () => showWordModal(w.textContent, { passage: { en: p.text.replace(/\n/g, " ") } })));
  renderQuizInto($("#tp7-quiz"), p.questions, (c) => {
    const pct = Math.round((c / p.questions.length) * 100);
    toeicSave("p7_" + p.id, pct);
    $("#tp7-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 50 ? "good" : "bad"}">本篇 ${c}/${p.questions.length}(${pct}%),已記錄最佳成績。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderToeicP7List()">回閱讀清單</button></div>`);
  });
}

// ---------- 13 大情境課文 ----------
function renderToeicSceneList() {
  audioPlayer.pause();
  if (typeof stopReadAlong === "function") stopReadAlong();
  toeic.view = "sc-list";
  $("#toeic-sub").textContent = "📚 13 大情境課文";
  const d = toeicData();
  const box = toeicBox();
  box.innerHTML = `<div class="steps-tip">多益的題目都落在這 13 個情境裡。每篇課文都是該情境的真實職場文本:<b>朗讀時單字會逐字亮起</b>,點課文中任何單字可查發音與英英釋義,讀完做 3 題理解測驗。</div>`;
  for (const sc of TOEIC_SCENES) {
    const b = d["sc_" + sc.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${sc.icon}</span>
      <span class="task-info"><b><span class="ts-no">${sc.no}</span>${sc.name}<small>${sc.en}</small></b><span>${sc.doc}《${sc.title}》</span></span>
      <span class="toeic-best">${b !== undefined ? `最佳 ${b}%` : "未讀"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeicScene(sc));
    box.appendChild(el);
  }
}

function openToeicScene(sc) {
  toeic.view = "sc";
  $("#toeic-sub").textContent = `${sc.icon} ${sc.name}`;
  // 組成課文物件,直接沿用課程系統的逐字高亮與點字彈窗
  const L = { passage: { aid: `p_ts_${sc.id}`, title: sc.title, en: sc.text, zh: sc.zh } };
  const box = toeicBox();
  box.innerHTML = `
    <div class="practice-panel">
      <div class="ts-head">
        <span class="ts-badge">情境 ${sc.no} · ${sc.en}</span>
        <span class="ts-doc">${sc.doc}</span>
      </div>
      <div class="chunk-line"><span class="chunk-big">${sc.title}</span></div>
      <div class="shadow-controls">
        <button id="ts-play" class="btn-audio">▶ 課文朗讀</button>
        <button id="ts-slow" class="btn-audio slow">🐢 慢速</button>
        <button id="ts-zh-toggle" class="btn-audio mine">🀄 中文翻譯</button>
      </div>
      <div id="ts-passage" class="sentence-box passage"></div>
      <div id="ts-zh" class="sentence-box passage zh" style="display:none">${sc.zh}</div>

      <div class="card-title" style="margin:16px 0 8px">🔑 情境核心字</div>
      <div class="tv-words" id="ts-words"></div>

      <div class="card-title" style="margin:16px 0 8px">💬 情境常用句</div>
      <div id="ts-phrases"></div>

      <div class="card-title" style="margin:16px 0 8px">📝 理解測驗(${sc.questions.length} 題)</div>
      <div id="ts-quiz"></div>
    </div>`;

  renderInteractivePassage($("#ts-passage"), L);
  $("#ts-play").addEventListener("click", () => playPassage(L, false));
  $("#ts-slow").addEventListener("click", () => playPassage(L, true));
  $("#ts-zh-toggle").addEventListener("click", () => {
    const zh = $("#ts-zh");
    zh.style.display = zh.style.display === "none" ? "block" : "none";
  });

  const wrap = $("#ts-words");
  for (const item of sc.words) {
    const chip = document.createElement("span");
    chip.className = "tv-word";
    chip.innerHTML = `<button class="tvw-play"><b>${item.w}</b> <i>${item.pos}</i> ${item.zh}</button>
      <button class="tvw-star ${nbHasWord(item.w) ? "on" : ""}">${nbHasWord(item.w) ? "⭐" : "☆"}</button>`;
    chip.querySelector(".tvw-play").addEventListener("click", (e) =>
      playWordAudio(`audio/${item.w.toLowerCase()}.mp3`, e.currentTarget, item.w));
    chip.querySelector(".tvw-star").addEventListener("click", (e) => {
      const added = nbToggleWord({ w: item.w, zh: `${item.pos} ${item.zh}`, sentence: `TOEIC 情境:${sc.name}` });
      e.target.textContent = added ? "⭐" : "☆";
      e.target.classList.toggle("on", added);
    });
    wrap.appendChild(chip);
  }

  const pbox = $("#ts-phrases");
  sc.phrases.forEach((p, k) => {
    const row = document.createElement("div");
    row.className = "sentence-box ts-phrase";
    row.innerHTML = `<span class="ts-phrase-en">${p.en}</span>
      <button class="btn-mini-audio">🔊</button>
      <div class="conn-trans">${p.zh}</div>`;
    row.querySelector("button").addEventListener("click", (e) =>
      playWordAudio(`audio/ts_${sc.id}_p${k}.mp3`, e.target, p.en));
    pbox.appendChild(row);
  });

  renderQuizInto($("#ts-quiz"), sc.questions, (c) => {
    const pct = Math.round((c / sc.questions.length) * 100);
    toeicSave("sc_" + sc.id, pct);
    $("#ts-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 66 ? "good" : "bad"}">本篇 ${c}/${sc.questions.length}(${pct}%),已記錄最佳成績。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderToeicSceneList()">回情境清單</button></div>`);
  });
}

// ---------- 綁定 ----------
document.addEventListener("DOMContentLoaded", () => {
  updateToeicEntry();
  $("#btn-toeic")?.addEventListener("click", openTOEIC);
  $("#toeic-exit")?.addEventListener("click", toeicBack);
});
