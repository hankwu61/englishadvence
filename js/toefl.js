// ============================================================
//  🎓 托福 TOEFL 專區 - 邏輯
//  學術字彙 / Reading / Listening / Speaking(計時口說)/ Writing(學術討論)
//  四大分項各 30 分 → 預估總分 0–120 與程度帶
// ============================================================
"use strict";

const toefl = { view: "hub", timer: null, rec: null, recording: false };

// ---------- 成績儲存 ----------
function toeflData() {
  try { return JSON.parse(localStorage.getItem("ea_toefl") || "{}"); } catch { return {}; }
}
function toeflSave(key, pct) {
  const d = toeflData();
  if (!(d[key] >= pct)) d[key] = pct;
  try { localStorage.setItem("ea_toefl", JSON.stringify(d)); } catch { /* ignore */ }
  updateToeflEntry();
}
const avgOf = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : undefined);

// 各分項平均正確率(0–100),未練習則為 undefined
function toeflSectionPcts() {
  const d = toeflData();
  const pick = (list, prefix) => avgOf(list.map((x) => d[prefix + x.id]).filter((v) => v !== undefined));
  const rd = pick(TOEFL_READING, "rd_");
  const reading = avgOf([rd, d.voc].filter((v) => v !== undefined));
  return {
    reading,
    listening: pick(TOEFL_LISTENING, "ls_"),
    speaking: pick(TOEFL_SPEAKING, "sp_"),
    writing: pick(TOEFL_WRITING, "wr_"),
  };
}

// 依已練習分項的平均,粗估 TOEFL 總分(每項 30 分,滿分 120)
function toeflEstimate() {
  const s = toeflSectionPcts();
  const done = Object.values(s).filter((v) => v !== undefined);
  if (!done.length) return null;
  const pct = avgOf(done);
  const total = Math.round((pct / 100) * 120);
  const band = total >= 100 ? { name: "頂尖名校門檻", color: "#C9A227", note: "多數美國前段大學要求 100 分以上" }
    : total >= 80 ? { name: "大學／研究所門檻", color: "#2563EB", note: "多數大學部與研究所要求 80 分上下" }
    : total >= 60 ? { name: "中階", color: "#16A34A", note: "可申請部分大學與語言中心銜接課程" }
    : total >= 40 ? { name: "基礎", color: "#92600A", note: "先把學術字彙與聽力打穩" }
    : { name: "入門", color: "#EA7317", note: "從學術字彙與短篇閱讀開始累積" };
  return { pct: Math.round(pct), total, band, sections: s, partsDone: done.length };
}

function updateToeflEntry() {
  const el = $("#toefl-entry-best");
  if (!el) return;
  const est = toeflEstimate();
  el.textContent = est ? `預估 ${est.total} 分・${est.band.name}` : "尚未練習";
}

// ---------- 畫面骨架 ----------
function toeflStop() {
  clearInterval(toefl.timer);
  toefl.timer = null;
  if (toefl.recording) { toefl.recording = false; try { toefl.rec?.stop(); } catch { /* ignore */ } }
  audioPlayer.pause();
}

function openTOEFL() {
  toefl.view = "hub";
  showScreen("#screen-toefl");
  renderToeflHub();
}

function toeflBack() {
  toeflStop();
  if (toefl.view === "hub") { goHome(); switchTab("learn"); }
  else renderToeflHub();
}

const toeflBox = () => $("#toefl-content");

// ---------- Hub ----------
function renderToeflHub() {
  toeflStop();
  toefl.view = "hub";
  $("#toefl-sub").textContent = "四大分項,任選一項開始";
  const d = toeflData();
  const est = toeflEstimate();
  const secScore = (pct) => (pct === undefined ? "—" : Math.round((pct / 100) * 30));
  const s = est ? est.sections : {};

  toeflBox().innerHTML = `
    <div class="card toefl-band" ${est ? `style="border-left:6px solid ${est.band.color}"` : ""}>
      ${est
      ? `<div class="tb-score" style="color:${est.band.color}">${est.total} <small>/ 120</small></div>
           <div class="tb-band">預估落點:<b style="color:${est.band.color}">${est.band.name}</b>・平均正確率 ${est.pct}%(已練 ${est.partsDone} / 4 個分項)</div>
           <div class="tfl-secgrid">
             <div class="tfl-sec"><span>📖 閱讀</span><b>${secScore(s.reading)}</b></div>
             <div class="tfl-sec"><span>🎧 聽力</span><b>${secScore(s.listening)}</b></div>
             <div class="tfl-sec"><span>🗣️ 口說</span><b>${secScore(s.speaking)}</b></div>
             <div class="tfl-sec"><span>✍️ 寫作</span><b>${secScore(s.writing)}</b></div>
           </div>
           <div class="fb-note">${est.band.note}。未練習的分項以已練成績推估,多練幾項會更準;實際成績以正式測驗為準。</div>`
      : `<div class="tb-band"><b>還沒有練習紀錄</b></div>
           <div class="fb-note">TOEFL iBT 四大分項各 30 分,總分 120。完成任一項練習後,這裡會顯示你的分項與總分預估。</div>`}
    </div>
    <div id="toefl-parts"></div>`;

  const cnt = (list, prefix) => list.filter((x) => d[prefix + x.id] !== undefined).length;
  const parts = [
    { icon: "🎓", t: "學術字彙", s: "6 大學術主題 × 10 字,附測驗", b: d.voc !== undefined ? `最佳 ${d.voc}%` : "未練習", go: renderToeflVoc },
    { icon: "📖", t: "Reading 學術閱讀", s: "主旨／細節／推論／詞彙四大題型", b: `完成 ${cnt(TOEFL_READING, "rd_")}/${TOEFL_READING.length} 篇`, go: renderToeflReadList },
    { icon: "🎧", t: "Listening 對話與講座", s: "校園對話 + 學術講座,聽完答題", b: `完成 ${cnt(TOEFL_LISTENING, "ls_")}/${TOEFL_LISTENING.length} 組`, go: renderToeflLCList },
    { icon: "🗣️", t: "Speaking 獨立口說", s: "15 秒準備 + 45 秒作答,自動評分", b: `完成 ${cnt(TOEFL_SPEAKING, "sp_")}/${TOEFL_SPEAKING.length} 題`, go: renderToeflSpeakList },
    { icon: "✍️", t: "Writing 學術討論", s: "回應教授提問與同學貼文(100 字以上)", b: `完成 ${cnt(TOEFL_WRITING, "wr_")}/${TOEFL_WRITING.length} 題`, go: renderToeflWriteList },
  ];
  const box = $("#toefl-parts");
  for (const p of parts) {
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${p.icon}</span>
      <span class="task-info"><b>${p.t}</b><span>${p.s}</span></span>
      <span class="toefl-best">${p.b}</span><span class="task-go">›</span>`;
    el.addEventListener("click", p.go);
    box.appendChild(el);
  }
}

// ---------- 學術字彙 ----------
function renderToeflVoc() {
  toeflStop();
  toefl.view = "voc";
  $("#toefl-sub").textContent = "🎓 學術字彙";
  const box = toeflBox();
  box.innerHTML = `
    <div class="steps-tip">TOEFL 的字彙題考的是「在文章脈絡中的同義字」,先熟悉這 60 個高頻學術字。點字聽發音、點 ⭐ 收藏,背完做 10 題測驗。</div>
    <div id="tfv-themes"></div>
    <div class="practice-actions"><button id="tfv-quiz" class="btn-primary">📝 字彙測驗(10 題)</button></div>
    <div id="tfv-quiz-box" style="margin-top:14px"></div>`;
  const themes = $("#tfv-themes");
  for (const t of TOEFL_WORDS) {
    const panel = document.createElement("div");
    panel.className = "card";
    panel.innerHTML = `<div class="card-title">${t.emoji} ${t.theme}</div><div class="tv-words"></div>`;
    const wrap = panel.querySelector(".tv-words");
    for (const item of t.list) {
      const chip = document.createElement("span");
      chip.className = "tv-word";
      chip.innerHTML = `<button class="tvw-play"><b>${item.w}</b> <i>${item.pos}</i> ${item.zh}</button>
        <button class="tvw-star ${nbHasWord(item.w) ? "on" : ""}">${nbHasWord(item.w) ? "⭐" : "☆"}</button>`;
      chip.querySelector(".tvw-play").addEventListener("click", (e) =>
        playWordAudio(`audio/${item.w.toLowerCase()}.mp3`, e.currentTarget, item.w));
      chip.querySelector(".tvw-star").addEventListener("click", (e) => {
        const added = nbToggleWord({ w: item.w, zh: `${item.pos} ${item.zh}`, sentence: `TOEFL ${t.theme}學術字彙` });
        e.target.textContent = added ? "⭐" : "☆";
        e.target.classList.toggle("on", added);
      });
      wrap.appendChild(chip);
    }
    themes.appendChild(panel);
  }
  $("#tfv-quiz").addEventListener("click", () => {
    const all = TOEFL_WORDS.flatMap((t) => t.list);
    const picked = shuffle(all).slice(0, 10);
    const items = picked.map((it) => ({
      q: `${it.w}(${it.pos})的意思是?`,
      opts: [it.zh, ...shuffle(all.filter((x) => x.w !== it.w)).slice(0, 3).map((x) => x.zh)],
      note: `${it.w} = ${it.zh}`,
    }));
    const qb = $("#tfv-quiz-box");
    qb.innerHTML = `<div class="card-title" style="margin-bottom:10px">📝 字彙測驗</div>`;
    renderQuizInto(qb, items, (c) => {
      const pct = Math.round((c / items.length) * 100);
      toeflSave("voc", pct);
      qb.insertAdjacentHTML("beforeend",
        `<div class="feedback ${pct >= 80 ? "good" : "bad"}">測驗完成:${c}/${items.length}(${pct}%),已計入閱讀分項。</div>`);
    });
    qb.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ---------- Reading ----------
function renderToeflReadList() {
  toeflStop();
  toefl.view = "rd-list";
  $("#toefl-sub").textContent = "📖 Reading 學術閱讀";
  const d = toeflData();
  const box = toeflBox();
  box.innerHTML = `<div class="steps-tip">TOEFL 閱讀是學術文章,不需要背景知識,答案一定在文中。文章裡任何單字都可以點擊查發音與英英釋義。</div>`;
  for (const p of TOEFL_READING) {
    const b = d["rd_" + p.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i2">${p.icon}</span>
      <span class="task-info"><b>${p.title}</b><span>${p.field}・${p.questions.length} 題</span></span>
      <span class="toefl-best">${b !== undefined ? `最佳 ${b}%` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeflReading(p));
    box.appendChild(el);
  }
}

function openToeflReading(p) {
  toeflStop();
  toefl.view = "rd";
  $("#toefl-sub").textContent = `📖 ${p.title}`;
  const box = toeflBox();
  const html = p.text.split("\n").map((line) =>
    line.split(/([A-Za-z][A-Za-z']*)/g)
      .map((t) => (/^[A-Za-z][A-Za-z']*$/.test(t) ? `<span class="pw">${t}</span>` : t.replace(/</g, "&lt;")))
      .join("")).join("<br>");
  box.innerHTML = `
    <div class="practice-panel">
      <div class="tfl-field">${p.icon} ${p.field}</div>
      <div class="sentence-box passage tp7-text">${html}</div>
      <div id="tfr-quiz"></div>
    </div>`;
  box.querySelectorAll(".pw").forEach((w) =>
    w.addEventListener("click", () => showWordModal(w.textContent, { passage: { en: p.text.replace(/\n/g, " ") } })));
  renderQuizInto($("#tfr-quiz"), p.questions, (c) => {
    const pct = Math.round((c / p.questions.length) * 100);
    toeflSave("rd_" + p.id, pct);
    $("#tfr-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 75 ? "good" : "bad"}">本篇 ${c}/${p.questions.length}(${pct}%),已記錄最佳成績。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderToeflReadList()">回閱讀清單</button></div>`);
  });
}

// ---------- Listening ----------
function playToeflSeq(files, btn) {
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

function renderToeflLCList() {
  toeflStop();
  toefl.view = "ls-list";
  $("#toefl-sub").textContent = "🎧 Listening 對話與講座";
  const d = toeflData();
  const box = toeflBox();
  box.innerHTML = `<div class="steps-tip">TOEFL 聽力可以做筆記。先聽完整段再作答;答完會顯示逐字稿,逐句重聽把沒聽懂的地方補起來。</div>`;
  for (const set of TOEFL_LISTENING) {
    const b = d["ls_" + set.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i3">${set.icon}</span>
      <span class="task-info"><b>${set.kind}:${set.title}</b><span>${set.lines.length} 句・${set.questions.length} 題</span></span>
      <span class="toefl-best">${b !== undefined ? `最佳 ${b}%` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeflLC(set));
    box.appendChild(el);
  }
}

function openToeflLC(set) {
  toeflStop();
  toefl.view = "ls";
  $("#toefl-sub").textContent = `🎧 ${set.kind}:${set.title}`;
  const files = set.lines.map((_, k) => `audio/tf3_${set.id}_${k}.mp3`);
  const box = toeflBox();
  box.innerHTML = `
    <div class="practice-panel">
      <button id="tfl-play" class="btn-audio">▶ 播放整段(${set.lines.length} 句)</button>
      <div class="q-hint">TOEFL 的實戰做法:邊聽邊記關鍵字,聽完再作答。</div>
      <div id="tfl-quiz"></div>
      <div id="tfl-script" style="display:none">
        <div class="card-title" style="margin:14px 0 8px">📜 逐字稿(點 🔊 逐句精聽)</div>
        <div id="tfl-lines"></div>
      </div>
    </div>`;
  $("#tfl-play").addEventListener("click", () => playToeflSeq(files, $("#tfl-play")));
  playToeflSeq(files, $("#tfl-play"));

  renderQuizInto($("#tfl-quiz"), set.questions, (c) => {
    const pct = Math.round((c / set.questions.length) * 100);
    toeflSave("ls_" + set.id, pct);
    audioPlayer.pause();
    const sc = $("#tfl-script");
    sc.style.display = "block";
    const lines = $("#tfl-lines");
    const solo = set.lines.every((l) => l.sp === set.lines[0].sp);
    set.lines.forEach((ln, k) => {
      const row = document.createElement("div");
      row.className = "tlc-line";
      const label = solo ? (ln.sp === "M" ? "👨 教授" : "👩 教授") : (ln.sp === "M" ? "👨 M" : "👩 W");
      row.innerHTML = `<span class="tlc-sp ${ln.sp === "M" ? "m" : "w"}">${label}</span>
        <span class="tlc-en">${ln.en}</span>
        <button class="btn-mini-audio">🔊</button>`;
      row.querySelector("button").addEventListener("click", (e) => playAudio(files[k], e.target));
      lines.appendChild(row);
    });
    $("#tfl-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 66 ? "good" : "bad"}">本組 ${c}/${set.questions.length}(${pct}%),已記錄最佳成績。逐字稿在下方,答錯的題目回去找出對應句子。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderToeflLCList()">回聽力清單</button></div>`);
  });
}

// ---------- Speaking:評分規則 ----------
const TFL_TRANSITIONS = ["first", "first of all", "second", "third", "finally", "to begin with", "because", "since",
  "for example", "for instance", "in addition", "besides", "moreover", "what's more", "also", "however", "although",
  "while", "so", "therefore", "as a result", "that's why", "what makes", "another reason", "for these reasons",
  "on the other hand", "in my opinion", "in fact", "overall", "in conclusion", "whenever", "when i"];

// 關鍵詞比對:容許常見字尾變化(reason/reasons、concentrate/concentrated、study/studying)
function tflHas(lower, k) {
  const esc = k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${esc}(s|es|ed|d|ing)?\\b`).test(lower);
}

function toeflScoreSpeech(text, task) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const has = (k) => tflHas(lower, k);
  const target = Math.round((task.speak / 45) * 100);          // 45 秒約 100 字
  const lenPct = Math.min(1, words.length / target);
  const hits = task.keys.filter((g) => g.some(has));
  const trans = [...new Set(TFL_TRANSITIONS.filter(has))];
  const score = Math.round(lenPct * 45 + (hits.length / task.keys.length) * 35 + Math.min(trans.length, 4) / 4 * 20);
  return { score: Math.min(100, score), words: words.length, target, hits: hits.length, keyTotal: task.keys.length, trans };
}

// ---------- Speaking ----------
function renderToeflSpeakList() {
  toeflStop();
  toefl.view = "sp-list";
  $("#toefl-sub").textContent = "🗣️ Speaking 獨立口說";
  const d = toeflData();
  const box = toeflBox();
  box.innerHTML = `<div class="steps-tip">TOEFL 獨立口說:看到題目後 15 秒準備、45 秒作答。系統會依「說話長度、內容涵蓋、連接詞使用」自動評分,並提供示範回答。<br><b>需要麥克風權限,建議使用 Chrome 或 Edge。</b></div>`;
  for (const t of TOEFL_SPEAKING) {
    const b = d["sp_" + t.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${t.icon}</span>
      <span class="task-info"><b>${t.type}</b><span>${t.zh}</span></span>
      <span class="toefl-best">${b !== undefined ? `最佳 ${b} 分` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeflSpeak(t));
    box.appendChild(el);
  }
}

function openToeflSpeak(task) {
  toeflStop();
  toefl.view = "sp";
  $("#toefl-sub").textContent = `🗣️ ${task.type}`;
  toeflBox().innerHTML = `
    <div class="practice-panel">
      <div class="tfl-prompt">
        <div class="tfl-prompt-en">${task.prompt}</div>
        <div class="conn-trans">${task.zh}</div>
      </div>
      <div id="tfs-stage" class="tfl-timer">準備好了嗎?</div>
      <div class="practice-actions">
        <button id="tfs-start" class="btn-primary">▶ 開始(${task.prep} 秒準備)</button>
        <button id="tfs-skip" class="btn-secondary">跳過準備,直接說</button>
      </div>
      <div class="q-hint">💡 ${task.tips[0]}</div>
      <div id="tfs-result"></div>
    </div>`;
  $("#tfs-start").addEventListener("click", () => toeflSpeakPrep(task));
  $("#tfs-skip").addEventListener("click", () => toeflSpeakRecord(task));
}

function toeflSpeakPrep(task) {
  const stage = $("#tfs-stage");
  $("#tfs-start").disabled = true;
  let left = task.prep;
  stage.className = "tfl-timer prep";
  stage.textContent = `⏱ 準備中… ${left} 秒(想好兩個理由和一個例子)`;
  clearInterval(toefl.timer);
  toefl.timer = setInterval(() => {
    left--;
    if (left <= 0) { clearInterval(toefl.timer); toeflSpeakRecord(task); return; }
    stage.textContent = `⏱ 準備中… ${left} 秒(想好兩個理由和一個例子)`;
  }, 1000);
}

function toeflSpeakRecord(task) {
  clearInterval(toefl.timer);
  const stage = $("#tfs-stage");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  $("#tfs-start").disabled = true;
  $("#tfs-skip").disabled = true;
  if (!SR) {
    stage.className = "tfl-timer";
    stage.textContent = "⚠️ 此瀏覽器不支援語音辨識,請改用 Chrome 或 Edge。";
    toeflShowSample(task, null);
    return;
  }
  audioPlayer.pause();
  speechSynthesis?.cancel?.();

  let heard = "";
  const rec = new SR();
  toefl.rec = rec;
  rec.lang = "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++)
      if (e.results[i].isFinal) heard += e.results[i][0].transcript + " ";
  };
  rec.onerror = (e) => {
    if (e.error === "no-speech") return;                       // 停頓不算錯誤,繼續等
    finish(`⚠️ ${{ "not-allowed": "麥克風未授權,請允許權限後再試。", "network": "語音辨識服務無法連線,請改用 Chrome/Edge。" }[e.error] || `辨識錯誤(${e.error})。`}`);
  };
  rec.onend = () => { if (toefl.recording) finish(); };

  let left = task.speak;
  const tick = () => {
    stage.className = "tfl-timer rec" + (left <= 10 ? " warn" : "");
    stage.textContent = `🔴 作答中… 剩 ${left} 秒`;
  };
  toefl.recording = true;
  tick();
  clearInterval(toefl.timer);
  toefl.timer = setInterval(() => {
    left--;
    if (left <= 0) { clearInterval(toefl.timer); try { rec.stop(); } catch { finish(); } return; }
    tick();
  }, 1000);

  let done = false;
  function finish(errMsg) {
    if (done) return;
    done = true;
    toefl.recording = false;
    clearInterval(toefl.timer);
    try { rec.stop(); } catch { /* ignore */ }
    stage.className = "tfl-timer";
    const said = heard.trim();
    if (errMsg || !said) {
      stage.textContent = errMsg || "⚠️ 沒有辨識到內容,可以再試一次。";
      toeflShowSample(task, null);
      return;
    }
    stage.textContent = "✅ 作答結束";
    toeflShowSpeakResult(task, said);
  }

  try { rec.start(); } catch { finish("⚠️ 無法啟動麥克風,請確認權限。"); }
}

function toeflShowSpeakResult(task, said) {
  const r = toeflScoreSpeech(said, task);
  toeflSave("sp_" + task.id, r.score);
  const grade = r.score >= 85 ? "🌟 很完整!" : r.score >= 70 ? "✅ 不錯,再補一點細節" : r.score >= 50 ? "💪 內容偏短,多說一個例子" : "🔁 再挑戰一次,目標說滿 45 秒";
  const box = $("#tfs-result");
  box.innerHTML = `
    <div class="vs-score">${grade} <b>${r.score} 分</b></div>
    <div class="tfl-metrics">
      <span class="tfl-metric">📏 說話長度 ${r.words} 字<i>目標 ${r.target}</i></span>
      <span class="tfl-metric">🎯 內容涵蓋 ${r.hits}/${r.keyTotal}<i>題目重點</i></span>
      <span class="tfl-metric">🔗 連接詞 ${r.trans.length} 個<i>${r.trans.slice(0, 4).join("、") || "尚未使用"}</i></span>
    </div>
    <div class="vs-heard">🎧 辨識聽到:「${said.replace(/</g, "&lt;")}」</div>
    <div class="practice-actions">
      <button class="btn-mini-audio tfs-ai">🤖 AI 講評</button>
      <button class="btn-secondary" onclick="openToeflSpeak(TOEFL_SPEAKING.find(t=>t.id==='${task.id}'))">再說一次</button>
    </div>
    <div class="vs-ai-out tfs-ai-out"></div>`;
  box.querySelector(".tfs-ai").addEventListener("click", (e) =>
    toeflAIFeedback("speaking", task, said, box.querySelector(".tfs-ai-out"), e.target));
  toeflShowSample(task, said);
}

function toeflShowSample(task, said) {
  const box = $("#tfs-result");
  box.insertAdjacentHTML("beforeend", `
    <div class="card" style="margin-top:14px">
      <div class="card-title">💡 答題訣竅</div>
      <ul class="grammar-points">${task.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="card-title" style="margin-top:10px">🎧 示範回答</div>
      <div class="sentence-box">${task.sample}
        <div class="practice-actions"><button class="btn-mini-audio tfs-sample">🔊 聽示範</button></div>
      </div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderToeflSpeakList()">回口說清單</button></div>
    </div>`);
  box.querySelector(".tfs-sample").addEventListener("click", (e) =>
    playWordAudio(`audio/tfs_${task.id}.mp3`, e.target, task.sample));
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (said === null) return;
}

// ---------- Writing ----------
function renderToeflWriteList() {
  toeflStop();
  toefl.view = "wr-list";
  $("#toefl-sub").textContent = "✍️ Writing 學術討論";
  const d = toeflData();
  const box = toeflBox();
  box.innerHTML = `<div class="steps-tip">TOEFL 寫作的學術討論題:教授提問、兩位同學已發言,你要在 10 分鐘內寫出至少 100 字的回應——表明立場、回應同學、加入新的理由或例子。</div>`;
  for (const t of TOEFL_WRITING) {
    const b = d["wr_" + t.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i2">${t.icon}</span>
      <span class="task-info"><b>${t.course}</b><span>${t.zh.split(":")[0]}</span></span>
      <span class="toefl-best">${b !== undefined ? `最佳 ${b} 分` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openToeflWrite(t));
    box.appendChild(el);
  }
}

function openToeflWrite(task) {
  toeflStop();
  toefl.view = "wr";
  $("#toefl-sub").textContent = `✍️ ${task.course}`;
  toeflBox().innerHTML = `
    <div class="practice-panel">
      <div class="tfl-prompt">
        <div class="tfl-who">👨‍🏫 Professor</div>
        <div class="tfl-prompt-en">${task.professor}</div>
      </div>
      ${task.posts.map((p) => `
        <div class="tfl-op">
          <div class="tfl-who">🧑‍🎓 ${p.who}</div>
          <div>${p.text}</div>
        </div>`).join("")}
      <div class="conn-trans" style="margin:10px 0">${task.zh}</div>
      <textarea id="tfw-input" class="tfl-editor" rows="9" placeholder="Write your response here… (至少 ${task.minWords} 字)"></textarea>
      <div class="tfl-count"><span id="tfw-count">0</span> 字 / 目標 ${task.minWords} 字</div>
      <div class="practice-actions">
        <button id="tfw-submit" class="btn-primary">送出並評分</button>
        <button class="btn-secondary" onclick="renderToeflWriteList()">回寫作清單</button>
      </div>
      <div id="tfw-result"></div>
    </div>`;
  const input = $("#tfw-input");
  const countWords = () => input.value.trim().split(/\s+/).filter(Boolean).length;
  input.addEventListener("input", () => { $("#tfw-count").textContent = countWords(); });
  $("#tfw-submit").addEventListener("click", () => {
    const text = input.value.trim();
    if (countWords() < 30) {
      $("#tfw-result").innerHTML = `<div class="feedback bad">內容太短了,先寫到 ${task.minWords} 字左右再送出評分。</div>`;
      return;
    }
    toeflShowWriteResult(task, text);
  });
}

const TFL_STANCE = ["i agree", "i disagree", "i think", "i believe", "in my opinion", "i would", "i side with", "my view", "i'd argue"];
const TFL_EXAMPLE = ["for example", "for instance", "such as", "in my own", "last year", "when i", "in my country", "at my school"];

function toeflScoreWriting(text, task) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const has = (k) => tflHas(lower, k);
  const lenPct = Math.min(1, words.length / task.minWords);
  const stance = TFL_STANCE.some(has);
  // 具體例子:明講 for example…,或給出年份、百分比等可查證的細節
  const example = TFL_EXAMPLE.some(has) || /\b(19|20)\d{2}\b/.test(text) || /\b\d+(\s?%|\s?percent)/.test(lower);
  const trans = [...new Set(TFL_TRANSITIONS.filter(has))];
  const hits = task.keys.filter((g) => g.some(has));
  const score = Math.round(lenPct * 40 + (stance ? 15 : 0) + (example ? 15 : 0)
    + Math.min(trans.length, 3) / 3 * 15 + (hits.length / task.keys.length) * 15);
  return { score: Math.min(100, score), words: words.length, stance, example, trans, hits: hits.length, keyTotal: task.keys.length };
}

function toeflShowWriteResult(task, text) {
  const r = toeflScoreWriting(text, task);
  toeflSave("wr_" + task.id, r.score);
  const grade = r.score >= 85 ? "🌟 結構完整!" : r.score >= 70 ? "✅ 不錯,再補強一項" : r.score >= 50 ? "💪 立場或例子還不夠明確" : "🔁 先把字數與立場補上";
  const yn = (ok) => (ok ? "✅" : "❌");
  const box = $("#tfw-result");
  box.innerHTML = `
    <div class="vs-score">${grade} <b>${r.score} 分</b></div>
    <div class="tfl-metrics">
      <span class="tfl-metric">📏 字數 ${r.words}<i>目標 ${task.minWords}</i></span>
      <span class="tfl-metric">${yn(r.stance)} 明確立場<i>I agree / I think…</i></span>
      <span class="tfl-metric">${yn(r.example)} 具體例子<i>For example…</i></span>
      <span class="tfl-metric">🔗 連接詞 ${r.trans.length}<i>${r.trans.slice(0, 4).join("、") || "尚未使用"}</i></span>
      <span class="tfl-metric">🎯 主題涵蓋 ${r.hits}/${r.keyTotal}<i>討論重點</i></span>
    </div>
    <div class="practice-actions"><button class="btn-mini-audio tfw-ai">🤖 AI 講評</button></div>
    <div class="vs-ai-out tfw-ai-out"></div>
    <div class="card" style="margin-top:14px">
      <div class="card-title">💡 高分要點</div>
      <ul class="grammar-points">${task.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="card-title" style="margin-top:10px">📝 參考範文</div>
      <div class="sentence-box">${task.sample}</div>
    </div>`;
  box.querySelector(".tfw-ai").addEventListener("click", (e) =>
    toeflAIFeedback("writing", task, text, box.querySelector(".tfw-ai-out"), e.target));
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- AI 講評(共用設定中的供應商)----------
async function toeflAIFeedback(kind, task, text, out, btn) {
  if (typeof callAI !== "function") { out.textContent = "AI 功能尚未載入。"; return; }
  btn.disabled = true;
  out.textContent = "AI 講評中…";
  const system = "You are an experienced TOEFL iBT rater. Reply in Traditional Chinese, no markdown, under 120 words.";
  const user = kind === "speaking"
    ? `這是 TOEFL 獨立口說的練習。
題目:"${task.prompt}"
學生口說(語音辨識稿,可能有辨識誤差):"${text}"
請:1) 依 TOEFL 口說 0–4 級距給一個級分與換算分數;2) 指出一個最該改的問題(內容發展/組織/用字/文法);3) 給一句可以直接照用的改寫示範。`
    : `這是 TOEFL 學術討論寫作。
教授提問:"${task.professor}"
同學意見:${task.posts.map((p) => `${p.who}: "${p.text}"`).join(" / ")}
學生回應:"${text}"
請:1) 依 TOEFL 寫作 0–5 級距給一個級分;2) 指出是否有效回應同學並加入新論點;3) 給兩個具體修改建議(含文法或用字錯誤)。`;
  try {
    const reply = await callAI(system, [{ role: "user", content: user }]);
    out.textContent = reply.trim();
  } catch (e) {
    out.textContent = e.status === 429 ? "請求太頻繁,等幾秒再按一次。"
      : e.status === 401 ? "API 金鑰未設定或無效,請到「設定」分頁填入。"
        : "AI 講評暫時無法使用,稍後再試。";
  }
  btn.disabled = false;
}

// ---------- 綁定 ----------
document.addEventListener("DOMContentLoaded", () => {
  updateToeflEntry();
  $("#btn-toefl")?.addEventListener("click", openTOEFL);
  $("#toefl-exit")?.addEventListener("click", toeflBack);
});
