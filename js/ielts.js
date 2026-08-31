// ============================================================
//  🌏 雅思 IELTS 專區 - 邏輯
//  核心字彙 / Listening(填空+選擇)/ Reading(True-False-Not Given)
//  Speaking Part 2 Cue Card / Writing Task 1 圖表 + Task 2 議論文
//  四大分項各自換算 Band 0–9,總分取平均後四捨五入至 0.5
// ============================================================
"use strict";

const ielts = { view: "hub", timer: null, rec: null, recording: false };

// ---------- 成績儲存 ----------
function ieltsData() {
  try { return JSON.parse(localStorage.getItem("ea_ielts") || "{}"); } catch { return {}; }
}
function ieltsSave(key, pct) {
  const d = ieltsData();
  if (!(d[key] >= pct)) d[key] = pct;
  try { localStorage.setItem("ea_ielts", JSON.stringify(d)); } catch { /* ignore */ }
  updateIeltsEntry();
}
const ieAvg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : undefined);

// 正確率 → Band(依 Academic 原始分數換算表的落點設計)
function ieltsBand(pct) {
  const table = [[98, 9], [93, 8.5], [88, 8], [83, 7.5], [75, 7], [68, 6.5], [58, 6],
    [50, 5.5], [40, 5], [30, 4.5], [23, 4], [15, 3.5], [0, 3]];
  for (const [p, b] of table) if (pct >= p) return b;
  return 3;
}
const halfRound = (x) => Math.round(x * 2) / 2;
const bandText = (b) => (Number.isInteger(b) ? `${b}.0` : String(b));

function ieltsSectionPcts() {
  const d = ieltsData();
  const pick = (list, prefix) => ieAvg(list.map((x) => d[prefix + x.id]).filter((v) => v !== undefined));
  const rd = pick(IELTS_READING, "rd_");
  return {
    listening: pick(IELTS_LISTENING, "ls_"),
    reading: ieAvg([rd, d.voc].filter((v) => v !== undefined)),
    speaking: pick(IELTS_SPEAKING, "sp_"),
    writing: pick(IELTS_WRITING, "wr_"),
  };
}

function ieltsEstimate() {
  const s = ieltsSectionPcts();
  const done = Object.entries(s).filter(([, v]) => v !== undefined);
  if (!done.length) return null;
  const bands = done.map(([, v]) => ieltsBand(v));
  const overall = halfRound(ieAvg(bands));
  const level = overall >= 8.5 ? { name: "專家使用者", color: "#C9A227", note: "已達頂尖大學與專業執照的標準" }
    : overall >= 7.5 ? { name: "優秀使用者", color: "#2563EB", note: "多數研究所與英美名校要求 7.0 以上" }
      : overall >= 6.5 ? { name: "良好使用者", color: "#16A34A", note: "多數大學部門檻落在 6.0–6.5" }
        : overall >= 5.5 ? { name: "普通使用者", color: "#92600A", note: "可申請部分課程,離大學門檻還差一個 band" }
          : { name: "有限使用者", color: "#EA7317", note: "先從核心字彙與聽力填空穩定累積" };
  return { overall, level, sections: s, bands: Object.fromEntries(done.map(([k, v]) => [k, ieltsBand(v)])), partsDone: done.length };
}

function updateIeltsEntry() {
  const el = $("#ielts-entry-best");
  if (!el) return;
  const est = ieltsEstimate();
  el.textContent = est ? `預估 Band ${bandText(est.overall)}・${est.level.name}` : "尚未練習";
}

// ---------- 畫面骨架 ----------
function ieltsStop() {
  clearInterval(ielts.timer);
  ielts.timer = null;
  if (ielts.recording) { ielts.recording = false; try { ielts.rec?.stop(); } catch { /* ignore */ } }
  audioPlayer.pause();
}

function openIELTS() {
  ielts.view = "hub";
  showScreen("#screen-ielts");
  renderIeltsHub();
}

function ieltsBack() {
  ieltsStop();
  if (ielts.view === "hub") { goHome(); switchTab("learn"); }
  else renderIeltsHub();
}

const ieltsBox = () => $("#ielts-content");

// ---------- 混合題型作答器(選擇題 / 填空題 / True-False-Not Given)----------
const ieNorm = (s) => s.toLowerCase().trim()
  .replace(/[.,!?;:'"£$%]/g, "").replace(/^(the|a|an)\s+/, "").replace(/\s+/g, " ");

function renderIeltsQuiz(box, items, onComplete) {
  let answered = 0, correct = 0;
  const done = () => { if (++answered === items.length) onComplete(correct); };

  items.forEach((item, qi) => {
    const block = document.createElement("div");
    block.className = "quiz-block";
    const note = document.createElement("div");
    note.className = "feedback-def";

    if (item.ans) {
      // True / False / Not Given:選項固定順序
      block.innerHTML = `<div class="quiz-q">${qi + 1}. ${item.s}</div>`;
      const opts = document.createElement("div");
      opts.className = "options quiz-opts ie-tfng";
      for (const label of ["True", "False", "Not Given"]) {
        const btn = document.createElement("button");
        btn.className = "opt-btn quiz-opt";
        btn.textContent = label;
        btn.addEventListener("click", () => {
          opts.querySelectorAll("button").forEach((b) => {
            b.disabled = true;
            if (b.textContent === item.ans) b.classList.add("correct");
            else if (b === btn) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          if (label === item.ans) correct++;
          note.textContent = "📌 " + item.note;
          done();
        });
        opts.appendChild(btn);
      }
      block.appendChild(opts);
    } else if (item.a) {
      // 填空題:輸入答案後檢查
      block.innerHTML = `<div class="quiz-q">${qi + 1}. ${item.q}</div>`;
      const row = document.createElement("div");
      row.className = "ie-gaprow";
      row.innerHTML = `<input class="ie-gap" type="text" placeholder="輸入答案…" autocomplete="off">
        <button class="btn-secondary ie-gapbtn">檢查</button>`;
      const input = row.querySelector(".ie-gap");
      const btn = row.querySelector(".ie-gapbtn");
      const check = () => {
        if (input.disabled) return;
        const ok = item.a.some((ans) => ieNorm(ans) === ieNorm(input.value));
        input.disabled = true;
        btn.disabled = true;
        input.classList.add(ok ? "ok" : "miss");
        if (ok) correct++;
        note.textContent = `${ok ? "✅ 正確" : `❌ 正解:${item.a[0]}`}　📌 ${item.note}`;
        done();
      };
      btn.addEventListener("click", check);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
      block.appendChild(row);
    } else {
      // 一般選擇題:第 0 個為正解,顯示時洗牌
      block.innerHTML = `<div class="quiz-q">${qi + 1}. ${item.q}</div>`;
      const opts = document.createElement("div");
      opts.className = "options quiz-opts";
      for (const label of shuffle(item.opts)) {
        const btn = document.createElement("button");
        btn.className = "opt-btn quiz-opt";
        btn.textContent = label;
        btn.addEventListener("click", () => {
          opts.querySelectorAll("button").forEach((b) => {
            b.disabled = true;
            if (b.textContent === item.opts[0]) b.classList.add("correct");
            else if (b === btn) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          if (label === item.opts[0]) correct++;
          note.textContent = "📌 " + item.note;
          done();
        });
        opts.appendChild(btn);
      }
      block.appendChild(opts);
    }
    block.appendChild(note);
    box.appendChild(block);
  });
}

// ---------- Hub ----------
function renderIeltsHub() {
  ieltsStop();
  ielts.view = "hub";
  $("#ielts-sub").textContent = "Academic 學術組・四大分項";
  const d = ieltsData();
  const est = ieltsEstimate();
  const sec = (k) => (est?.bands[k] !== undefined ? bandText(est.bands[k]) : "—");

  ieltsBox().innerHTML = `
    <div class="card ielts-band" ${est ? `style="border-left:6px solid ${est.level.color}"` : ""}>
      ${est
      ? `<div class="tb-score" style="color:${est.level.color}">Band ${bandText(est.overall)} <small>/ 9.0</small></div>
           <div class="tb-band">預估落點:<b style="color:${est.level.color}">${est.level.name}</b>(已練 ${est.partsDone} / 4 個分項)</div>
           <div class="tfl-secgrid">
             <div class="tfl-sec"><span>🎧 聽力</span><b>${sec("listening")}</b></div>
             <div class="tfl-sec"><span>📖 閱讀</span><b>${sec("reading")}</b></div>
             <div class="tfl-sec"><span>🗣️ 口說</span><b>${sec("speaking")}</b></div>
             <div class="tfl-sec"><span>✍️ 寫作</span><b>${sec("writing")}</b></div>
           </div>
           <div class="fb-note">${est.level.note}。總分為四項平均後四捨五入至 0.5;未練習的分項以已練成績推估,實際成績以正式測驗為準。</div>`
      : `<div class="tb-band"><b>還沒有練習紀錄</b></div>
           <div class="fb-note">IELTS 四大分項各自評 Band 0–9,總分取平均並四捨五入至 0.5。完成任一項練習後,這裡會顯示你的 Band 預估。</div>`}
    </div>
    <div id="ielts-parts"></div>`;

  const cnt = (list, prefix) => list.filter((x) => d[prefix + x.id] !== undefined).length;
  const parts = [
    { icon: "🔤", t: "核心字彙", s: "圖表趨勢、環境、教育、科技、健康、都市", b: d.voc !== undefined ? `最佳 ${d.voc}%` : "未練習", go: renderIeltsVoc },
    { icon: "🎧", t: "Listening 填空與選擇", s: "Section 1–4:表格填空 + 選擇題", b: `完成 ${cnt(IELTS_LISTENING, "ls_")}/${IELTS_LISTENING.length} 組`, go: renderIeltsLCList },
    { icon: "📖", t: "Reading 判斷題", s: "True / False / Not Given + 句子填空", b: `完成 ${cnt(IELTS_READING, "rd_")}/${IELTS_READING.length} 篇`, go: renderIeltsReadList },
    { icon: "🗣️", t: "Speaking Part 2", s: "Cue Card:1 分鐘準備 + 2 分鐘獨白", b: `完成 ${cnt(IELTS_SPEAKING, "sp_")}/${IELTS_SPEAKING.length} 題`, go: renderIeltsSpeakList },
    { icon: "✍️", t: "Writing Task 1・2", s: "圖表描述 150 字 + 議論文 250 字", b: `完成 ${cnt(IELTS_WRITING, "wr_")}/${IELTS_WRITING.length} 題`, go: renderIeltsWriteList },
  ];
  const box = $("#ielts-parts");
  for (const p of parts) {
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i3">${p.icon}</span>
      <span class="task-info"><b>${p.t}</b><span>${p.s}</span></span>
      <span class="ielts-best">${p.b}</span><span class="task-go">›</span>`;
    el.addEventListener("click", p.go);
    box.appendChild(el);
  }
}

// ---------- 核心字彙 ----------
function renderIeltsVoc() {
  ieltsStop();
  ielts.view = "voc";
  $("#ielts-sub").textContent = "🔤 核心字彙";
  const box = ieltsBox();
  box.innerHTML = `
    <div class="steps-tip">雅思寫作 Task 1 幾乎每題都用得到「圖表趨勢」這組字;其餘五組是 Task 2 與口說最常出現的主題字。點字聽發音、⭐ 收藏,背完做 10 題測驗。</div>
    <div id="iev-themes"></div>
    <div class="practice-actions"><button id="iev-quiz" class="btn-primary">📝 字彙測驗(10 題)</button></div>
    <div id="iev-quiz-box" style="margin-top:14px"></div>`;
  const themes = $("#iev-themes");
  for (const t of IELTS_WORDS) {
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
        const added = nbToggleWord({ w: item.w, zh: `${item.pos} ${item.zh}`, sentence: `IELTS ${t.theme}主題字彙` });
        e.target.textContent = added ? "⭐" : "☆";
        e.target.classList.toggle("on", added);
      });
      wrap.appendChild(chip);
    }
    themes.appendChild(panel);
  }
  $("#iev-quiz").addEventListener("click", () => {
    const all = IELTS_WORDS.flatMap((t) => t.list);
    const picked = shuffle(all).slice(0, 10);
    const items = picked.map((it) => ({
      q: `${it.w}(${it.pos})的意思是?`,
      opts: [it.zh, ...shuffle(all.filter((x) => x.w !== it.w)).slice(0, 3).map((x) => x.zh)],
      note: `${it.w} = ${it.zh}`,
    }));
    const qb = $("#iev-quiz-box");
    qb.innerHTML = `<div class="card-title" style="margin-bottom:10px">📝 字彙測驗</div>`;
    renderIeltsQuiz(qb, items, (c) => {
      const pct = Math.round((c / items.length) * 100);
      ieltsSave("voc", pct);
      qb.insertAdjacentHTML("beforeend",
        `<div class="feedback ${pct >= 80 ? "good" : "bad"}">測驗完成:${c}/${items.length}(${pct}%),已計入閱讀分項。</div>`);
    });
    qb.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ---------- Listening ----------
function playIeltsSeq(files, btn) {
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

function renderIeltsLCList() {
  ieltsStop();
  ielts.view = "ls-list";
  $("#ielts-sub").textContent = "🎧 Listening 填空與選擇";
  const d = ieltsData();
  const box = ieltsBox();
  box.innerHTML = `<div class="steps-tip">雅思聽力只播一次,而且填空題要照原文拼字。作答時注意題目要求的字數上限,數字直接寫阿拉伯數字。</div>`;
  for (const set of IELTS_LISTENING) {
    const b = d["ls_" + set.id];
    const gaps = set.questions.filter((q) => q.a).length;
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i2">${set.icon}</span>
      <span class="task-info"><b>${set.section}:${set.title}</b><span>${set.kind}・填空 ${gaps} 題 + 選擇 ${set.questions.length - gaps} 題</span></span>
      <span class="ielts-best">${b !== undefined ? `最佳 ${b}%` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openIeltsLC(set));
    box.appendChild(el);
  }
}

function openIeltsLC(set) {
  ieltsStop();
  ielts.view = "ls";
  $("#ielts-sub").textContent = `🎧 ${set.section}:${set.title}`;
  const files = set.lines.map((_, k) => `audio/ie3_${set.id}_${k}.mp3`);
  const box = ieltsBox();
  box.innerHTML = `
    <div class="practice-panel">
      <button id="iel-play" class="btn-audio">▶ 播放整段(${set.lines.length} 句)</button>
      <div class="q-hint">正式考試只播一次;練習時可以重播,但建議第一次先只聽一遍作答。</div>
      <div id="iel-quiz"></div>
      <div id="iel-script" style="display:none">
        <div class="card-title" style="margin:14px 0 8px">📜 逐字稿(點 🔊 逐句精聽)</div>
        <div id="iel-lines"></div>
      </div>
    </div>`;
  $("#iel-play").addEventListener("click", () => playIeltsSeq(files, $("#iel-play")));
  playIeltsSeq(files, $("#iel-play"));

  renderIeltsQuiz($("#iel-quiz"), set.questions, (c) => {
    const pct = Math.round((c / set.questions.length) * 100);
    ieltsSave("ls_" + set.id, pct);
    audioPlayer.pause();
    const sc = $("#iel-script");
    sc.style.display = "block";
    const lines = $("#iel-lines");
    const solo = set.lines.every((l) => l.sp === set.lines[0].sp);
    set.lines.forEach((ln, k) => {
      const row = document.createElement("div");
      row.className = "tlc-line";
      const label = solo ? "🎙️ 說話者" : (ln.sp === "M" ? "👨 M" : "👩 W");
      row.innerHTML = `<span class="tlc-sp ${ln.sp === "M" ? "m" : "w"}">${label}</span>
        <span class="tlc-en">${ln.en}</span>
        <button class="btn-mini-audio">🔊</button>`;
      row.querySelector("button").addEventListener("click", (e) => playAudio(files[k], e.target));
      lines.appendChild(row);
    });
    $("#iel-quiz").insertAdjacentHTML("beforeend", `
      <div class="feedback ${pct >= 66 ? "good" : "bad"}">本組 ${c}/${set.questions.length}(${pct}%)→ Band ${bandText(ieltsBand(pct))},已記錄最佳成績。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderIeltsLCList()">回聽力清單</button></div>`);
  });
}

// ---------- Reading(True / False / Not Given)----------
function renderIeltsReadList() {
  ieltsStop();
  ielts.view = "rd-list";
  $("#ielts-sub").textContent = "📖 Reading 判斷題";
  const d = ieltsData();
  const box = ieltsBox();
  box.innerHTML = `<div class="steps-tip">雅思閱讀最難的題型是 <b>True / False / Not Given</b>:<br>
    <b>True</b> = 文中明確支持;<b>False</b> = 文中明確相反;<b>Not Given</b> = 文中沒提到或無法判斷。<br>
    關鍵原則:「文章沒說」不等於「錯」,不要用常識推論。</div>`;
  for (const p of IELTS_READING) {
    const b = d["rd_" + p.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${p.icon}</span>
      <span class="task-info"><b>${p.title}</b><span>${p.field}・判斷 ${p.tfng.length} 題 + 填空 ${p.gaps.length} 題</span></span>
      <span class="ielts-best">${b !== undefined ? `最佳 ${b}%` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openIeltsReading(p));
    box.appendChild(el);
  }
}

function openIeltsReading(p) {
  ieltsStop();
  ielts.view = "rd";
  $("#ielts-sub").textContent = `📖 ${p.title}`;
  const box = ieltsBox();
  const html = p.text.split("\n").map((line) =>
    line.split(/([A-Za-z][A-Za-z']*)/g)
      .map((t) => (/^[A-Za-z][A-Za-z']*$/.test(t) ? `<span class="pw">${t}</span>` : t.replace(/</g, "&lt;")))
      .join("")).join("<br>");
  box.innerHTML = `
    <div class="practice-panel">
      <div class="tfl-field">${p.icon} ${p.field}</div>
      <div class="sentence-box passage tp7-text">${html}</div>
      <div class="card-title" style="margin:14px 0 4px">Questions 1–${p.tfng.length}:True / False / Not Given</div>
      <div id="ier-tfng"></div>
      <div class="card-title" style="margin:14px 0 4px">Questions ${p.tfng.length + 1}–${p.tfng.length + p.gaps.length}:句子填空(ONE WORD ONLY)</div>
      <div id="ier-gaps"></div>
      <div id="ier-done"></div>
    </div>`;
  box.querySelectorAll(".pw").forEach((w) =>
    w.addEventListener("click", () => showWordModal(w.textContent, { passage: { en: p.text.replace(/\n/g, " ") } })));

  const total = p.tfng.length + p.gaps.length;
  let score = 0, finished = 0;
  const part = (c) => {
    score += c;
    if (++finished < 2) return;
    const pct = Math.round((score / total) * 100);
    ieltsSave("rd_" + p.id, pct);
    $("#ier-done").innerHTML = `
      <div class="feedback ${pct >= 66 ? "good" : "bad"}">本篇 ${score}/${total}(${pct}%)→ Band ${bandText(ieltsBand(pct))},已記錄最佳成績。</div>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderIeltsReadList()">回閱讀清單</button></div>`;
  };
  renderIeltsQuiz($("#ier-tfng"), p.tfng, part);
  renderIeltsQuiz($("#ier-gaps"), p.gaps, part);
}

// ---------- 口說 / 寫作共用的關鍵詞比對 ----------
function ieHas(lower, k) {
  const esc = k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${esc}(s|es|ed|d|ing)?\\b`).test(lower);
}
const IE_TRANSITIONS = ["first", "first of all", "to begin with", "second", "then", "after that", "finally",
  "because", "since", "so", "however", "although", "while", "whereas", "for example", "for instance",
  "in addition", "besides", "actually", "to be honest", "what i mean", "in fact", "overall", "in conclusion",
  "on the other hand", "looking back", "in my opinion", "that's why", "as a result"];

// ---------- Speaking Part 2 ----------
function ieltsScoreSpeech(text, task) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const has = (k) => ieHas(lower, k);
  const target = Math.round((task.speak / 60) * 100);           // 2 分鐘約 200 字(考生實際語速)
  const lenPct = Math.min(1, words.length / target);
  const hits = task.keys.filter((g) => g.some(has));
  const trans = [...new Set(IE_TRANSITIONS.filter(has))];
  const score = Math.round(lenPct * 45 + (hits.length / task.keys.length) * 35 + Math.min(trans.length, 5) / 5 * 20);
  return { score: Math.min(100, score), words: words.length, target, hits: hits.length, keyTotal: task.keys.length, trans };
}

function renderIeltsSpeakList() {
  ieltsStop();
  ielts.view = "sp-list";
  $("#ielts-sub").textContent = "🗣️ Speaking Part 2";
  const d = ieltsData();
  const box = ieltsBox();
  box.innerHTML = `<div class="steps-tip">Part 2 是雅思口說最長的一段:拿到 cue card 後有 <b>1 分鐘準備</b>(可寫筆記),接著要 <b>連續講 2 分鐘</b>。撐滿 2 分鐘本身就是評分重點。<br><b>需要麥克風權限,建議使用 Chrome 或 Edge。</b></div>`;
  for (const t of IELTS_SPEAKING) {
    const b = d["sp_" + t.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i1">${t.icon}</span>
      <span class="task-info"><b>${t.title}</b><span>${t.topic}・${t.zh.split(":")[0]}</span></span>
      <span class="ielts-best">${b !== undefined ? `最佳 ${b} 分` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openIeltsSpeak(t));
    box.appendChild(el);
  }
}

function openIeltsSpeak(task) {
  ieltsStop();
  ielts.view = "sp";
  $("#ielts-sub").textContent = `🗣️ ${task.topic}`;
  ieltsBox().innerHTML = `
    <div class="practice-panel">
      <div class="ie-cuecard">
        <div class="ie-cue-title">${task.title}</div>
        <div class="ie-cue-sub">You should say:</div>
        <ul class="ie-cue-list">${task.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
        <div class="conn-trans">${task.zh}</div>
      </div>
      <div id="ies-stage" class="tfl-timer">準備好了嗎?</div>
      <div class="practice-actions">
        <button id="ies-start" class="btn-primary">▶ 開始(${task.prep} 秒準備)</button>
        <button id="ies-skip" class="btn-secondary">跳過準備,直接說</button>
      </div>
      <div class="q-hint">💡 ${task.tips[0]}</div>
      <div id="ies-result"></div>
    </div>`;
  $("#ies-start").addEventListener("click", () => ieltsSpeakPrep(task));
  $("#ies-skip").addEventListener("click", () => ieltsSpeakRecord(task));
}

function ieltsSpeakPrep(task) {
  const stage = $("#ies-stage");
  $("#ies-start").disabled = true;
  let left = task.prep;
  const show = () => { stage.textContent = `⏱ 準備中… ${left} 秒(把四個 bullet 各寫兩個關鍵字)`; };
  stage.className = "tfl-timer prep";
  show();
  clearInterval(ielts.timer);
  ielts.timer = setInterval(() => {
    left--;
    if (left <= 0) { clearInterval(ielts.timer); ieltsSpeakRecord(task); return; }
    show();
  }, 1000);
}

function ieltsSpeakRecord(task) {
  clearInterval(ielts.timer);
  const stage = $("#ies-stage");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  $("#ies-start").disabled = true;
  $("#ies-skip").disabled = true;
  if (!SR) {
    stage.className = "tfl-timer";
    stage.textContent = "⚠️ 此瀏覽器不支援語音辨識,請改用 Chrome 或 Edge。";
    ieltsShowSample(task);
    return;
  }
  audioPlayer.pause();
  speechSynthesis?.cancel?.();

  let heard = "";
  const rec = new SR();
  ielts.rec = rec;
  rec.lang = "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++)
      if (e.results[i].isFinal) heard += e.results[i][0].transcript + " ";
  };
  rec.onerror = (e) => {
    if (e.error === "no-speech") return;
    finish(`⚠️ ${{ "not-allowed": "麥克風未授權,請允許權限後再試。", "network": "語音辨識服務無法連線,請改用 Chrome/Edge。" }[e.error] || `辨識錯誤(${e.error})。`}`);
  };
  rec.onend = () => { if (ielts.recording) finish(); };

  let left = task.speak;
  const tick = () => {
    const m = Math.floor(left / 60), s = String(left % 60).padStart(2, "0");
    stage.className = "tfl-timer rec" + (left <= 15 ? " warn" : "");
    stage.textContent = `🔴 作答中… 剩 ${m}:${s}`;
  };
  ielts.recording = true;
  tick();
  clearInterval(ielts.timer);
  ielts.timer = setInterval(() => {
    left--;
    if (left <= 0) { clearInterval(ielts.timer); try { rec.stop(); } catch { finish(); } return; }
    tick();
  }, 1000);

  let done = false;
  function finish(errMsg) {
    if (done) return;
    done = true;
    ielts.recording = false;
    clearInterval(ielts.timer);
    try { rec.stop(); } catch { /* ignore */ }
    stage.className = "tfl-timer";
    const said = heard.trim();
    if (errMsg || !said) {
      stage.textContent = errMsg || "⚠️ 沒有辨識到內容,可以再試一次。";
      ieltsShowSample(task);
      return;
    }
    stage.textContent = "✅ 作答結束";
    ieltsShowSpeakResult(task, said);
  }

  try { rec.start(); } catch { finish("⚠️ 無法啟動麥克風,請確認權限。"); }
}

function ieltsShowSpeakResult(task, said) {
  const r = ieltsScoreSpeech(said, task);
  ieltsSave("sp_" + task.id, r.score);
  const grade = r.score >= 85 ? "🌟 撐滿兩分鐘,內容完整!" : r.score >= 70 ? "✅ 不錯,再多延伸一個 bullet"
    : r.score >= 50 ? "💪 長度不夠,兩分鐘還有空間" : "🔁 再試一次,目標是講到時間結束";
  const box = $("#ies-result");
  box.innerHTML = `
    <div class="vs-score">${grade} <b>${r.score} 分</b>(約 Band ${bandText(ieltsBand(r.score))})</div>
    <div class="tfl-metrics">
      <span class="tfl-metric">📏 說話長度 ${r.words} 字<i>兩分鐘目標 ${r.target}</i></span>
      <span class="tfl-metric">🎯 涵蓋 bullet ${r.hits}/${r.keyTotal}<i>cue card 要點</i></span>
      <span class="tfl-metric">🔗 連貫語 ${r.trans.length} 個<i>${r.trans.slice(0, 4).join("、") || "尚未使用"}</i></span>
    </div>
    <div class="vs-heard">🎧 辨識聽到:「${said.replace(/</g, "&lt;")}」</div>
    <div class="practice-actions">
      <button class="btn-mini-audio ies-ai">🤖 AI 講評</button>
      <button class="btn-secondary" onclick="openIeltsSpeak(IELTS_SPEAKING.find(t=>t.id==='${task.id}'))">再說一次</button>
    </div>
    <div class="vs-ai-out ies-ai-out"></div>`;
  box.querySelector(".ies-ai").addEventListener("click", (e) =>
    ieltsAIFeedback("speaking", task, said, box.querySelector(".ies-ai-out"), e.target));
  ieltsShowSample(task);
}

function ieltsShowSample(task) {
  const box = $("#ies-result");
  box.insertAdjacentHTML("beforeend", `
    <div class="card" style="margin-top:14px">
      <div class="card-title">💡 答題訣竅</div>
      <ul class="grammar-points">${task.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="card-title" style="margin-top:10px">🎧 示範回答</div>
      <div class="sentence-box">${task.sample}
        <div class="practice-actions"><button class="btn-mini-audio ies-sample">🔊 聽示範</button></div>
      </div>
      <div class="card-title" style="margin-top:10px">🔎 Part 3 延伸問題(考官接著會問)</div>
      <ul class="grammar-points">${task.part3.map((q) => `<li>${q}</li>`).join("")}</ul>
      <div class="practice-actions"><button class="btn-secondary" onclick="renderIeltsSpeakList()">回口說清單</button></div>
    </div>`);
  box.querySelector(".ies-sample").addEventListener("click", (e) =>
    playWordAudio(`audio/ies_${task.id}.mp3`, e.target, task.sample));
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- Writing ----------
function ieltsChartHTML(chart) {
  const max = Math.max(...chart.series.flatMap((s) => s.values));
  const colors = ["var(--primary)", "var(--accent)", "var(--sky)"];
  const cats = chart.categories.map((cat, ci) => `
    <div class="ie-cat">
      <div class="ie-bargroup">
        ${chart.series.map((s, si) => `
          <div class="ie-bar" style="height:${Math.round((s.values[ci] / max) * 130)}px;background:${colors[si % colors.length]}">
            <span>${s.values[ci]}</span>
          </div>`).join("")}
      </div>
      <div class="ie-catlabel">${cat}</div>
    </div>`).join("");
  const rows = chart.categories.map((cat, ci) =>
    `<tr><td>${cat}</td>${chart.series.map((s) => `<td>${s.values[ci]}${chart.unit}</td>`).join("")}</tr>`).join("");
  return `
    <div class="ie-chart">
      <div class="ie-legend">${chart.series.map((s, si) =>
    `<span><i style="background:${colors[si % colors.length]}"></i>${s.name}</span>`).join("")}
        <span class="ie-unit">單位:${chart.unit}</span></div>
      <div class="ie-bars">${cats}</div>
      <table class="ie-table"><tr><th></th>${chart.series.map((s) => `<th>${s.name}</th>`).join("")}</tr>${rows}</table>
    </div>`;
}

function renderIeltsWriteList() {
  ieltsStop();
  ielts.view = "wr-list";
  $("#ielts-sub").textContent = "✍️ Writing Task 1・2";
  const d = ieltsData();
  const box = ieltsBox();
  box.innerHTML = `<div class="steps-tip">正式考試 60 分鐘要寫完兩篇:Task 1(圖表,150 字,20 分鐘)+ Task 2(議論文,250 字,40 分鐘)。Task 2 佔總分三分之二,時間要留給它。</div>`;
  for (const t of IELTS_WRITING) {
    const b = d["wr_" + t.id];
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon i${t.task === 1 ? "2" : "1"}">${t.icon}</span>
      <span class="task-info"><b>Task ${t.task}:${t.title}</b><span>${t.minWords} 字・${t.minutes} 分鐘</span></span>
      <span class="ielts-best">${b !== undefined ? `最佳 ${b} 分` : "未練習"}</span><span class="task-go">›</span>`;
    el.addEventListener("click", () => openIeltsWrite(t));
    box.appendChild(el);
  }
}

function openIeltsWrite(task) {
  ieltsStop();
  ielts.view = "wr";
  $("#ielts-sub").textContent = `✍️ Task ${task.task}:${task.title}`;
  ieltsBox().innerHTML = `
    <div class="practice-panel">
      <div class="tfl-prompt">
        <div class="tfl-who">📝 Writing Task ${task.task}・${task.minutes} minutes</div>
        <div class="tfl-prompt-en">${task.prompt}</div>
      </div>
      ${task.chart ? ieltsChartHTML(task.chart) : ""}
      <div class="conn-trans" style="margin:10px 0">${task.zh}</div>
      <textarea id="iew-input" class="tfl-editor" rows="12" placeholder="Write your answer here… (至少 ${task.minWords} 字)"></textarea>
      <div class="tfl-count"><span id="iew-count">0</span> 字 / 目標 ${task.minWords} 字</div>
      <div class="practice-actions">
        <button id="iew-submit" class="btn-primary">送出並評分</button>
        <button class="btn-secondary" onclick="renderIeltsWriteList()">回寫作清單</button>
      </div>
      <div id="iew-result"></div>
    </div>`;
  const input = $("#iew-input");
  const countWords = () => input.value.trim().split(/\s+/).filter(Boolean).length;
  input.addEventListener("input", () => { $("#iew-count").textContent = countWords(); });
  $("#iew-submit").addEventListener("click", () => {
    if (countWords() < Math.round(task.minWords * 0.3)) {
      $("#iew-result").innerHTML = `<div class="feedback bad">內容太短了,先寫到 ${task.minWords} 字左右再送出評分(字數不足在正式考試會直接扣分)。</div>`;
      return;
    }
    ieltsShowWriteResult(task, input.value.trim());
  });
}

const IE_OVERVIEW = ["overall", "in general", "it is clear", "generally speaking", "the most striking", "overview"];
const IE_COMPARE = ["compared with", "compared to", "whereas", "while", "than", "highest", "lowest", "the same",
  "more than", "less than", "twice", "double", "respectively", "followed by"];
const IE_STANCE = ["i believe", "i think", "in my opinion", "in my view", "i would argue", "i agree", "i disagree", "my own view"];
const IE_BOTHSIDES = ["those who", "those in favour", "those against", "supporters", "critics", "opponents",
  "proponents", "advocates", "on the other hand", "others argue", "others believe", "others claim",
  "some people", "in favour of", "however", "by contrast", "conversely", "the opposing view"];
const IE_EXAMPLE = ["for example", "for instance", "such as", "a case in point", "in my country", "in my own"];

function ieltsScoreWriting(text, task) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const has = (k) => ieHas(lower, k);
  const lenPct = Math.min(1, words.length / task.minWords);
  const hits = task.keys.filter((g) => g.some(has));
  const nums = (text.match(/\d+(\.\d+)?\s?%?/g) || []).length;

  if (task.task === 1) {
    const overview = IE_OVERVIEW.some(has);
    const compare = [...new Set(IE_COMPARE.filter(has))];
    const score = Math.min(100, Math.round(lenPct * 35 + (overview ? 20 : 0) + Math.min(nums, 6) / 6 * 20
      + Math.min(compare.length, 3) / 3 * 15 + (hits.length / task.keys.length) * 10));
    return { task: 1, score, words: words.length, overview, nums, compare, hits: hits.length, keyTotal: task.keys.length };
  }
  const stance = IE_STANCE.some(has);
  const both = [...new Set(IE_BOTHSIDES.filter(has))];
  const example = IE_EXAMPLE.some(has);
  const trans = [...new Set(IE_TRANSITIONS.filter(has))];
  const score = Math.min(100, Math.round(lenPct * 30 + (stance ? 15 : 0) + Math.min(both.length, 3) / 3 * 20
    + (example ? 15 : 0) + Math.min(trans.length, 4) / 4 * 10 + (hits.length / task.keys.length) * 10));
  return { task: 2, score, words: words.length, stance, both, example, trans, hits: hits.length, keyTotal: task.keys.length };
}

function ieltsShowWriteResult(task, text) {
  const r = ieltsScoreWriting(text, task);
  ieltsSave("wr_" + task.id, r.score);
  const yn = (ok) => (ok ? "✅" : "❌");
  const grade = r.score >= 85 ? "🌟 結構與資料都到位!" : r.score >= 70 ? "✅ 不錯,再補強一項"
    : r.score >= 50 ? "💪 骨架有了,細節不足" : "🔁 先把字數與結構補上";
  const metrics = r.task === 1
    ? `<span class="tfl-metric">📏 字數 ${r.words}<i>目標 ${task.minWords}</i></span>
       <span class="tfl-metric">${yn(r.overview)} Overview 段<i>Overall, …</i></span>
       <span class="tfl-metric">🔢 數據引用 ${r.nums} 處<i>至少 6 處</i></span>
       <span class="tfl-metric">⚖️ 比較語言 ${r.compare.length}<i>${r.compare.slice(0, 3).join("、") || "尚未使用"}</i></span>
       <span class="tfl-metric">🎯 涵蓋項目 ${r.hits}/${r.keyTotal}<i>圖表類別</i></span>`
    : `<span class="tfl-metric">📏 字數 ${r.words}<i>目標 ${task.minWords}</i></span>
       <span class="tfl-metric">${yn(r.stance)} 明確立場<i>In my opinion…</i></span>
       <span class="tfl-metric">⚖️ 雙方論點 ${r.both.length}<i>${r.both.slice(0, 3).join("、") || "只寫了一邊"}</i></span>
       <span class="tfl-metric">${yn(r.example)} 具體例子<i>For example…</i></span>
       <span class="tfl-metric">🔗 連接詞 ${r.trans.length}<i>${r.trans.slice(0, 3).join("、") || "尚未使用"}</i></span>`;
  const box = $("#iew-result");
  box.innerHTML = `
    <div class="vs-score">${grade} <b>${r.score} 分</b>(約 Band ${bandText(ieltsBand(r.score))})</div>
    <div class="tfl-metrics">${metrics}</div>
    <div class="practice-actions"><button class="btn-mini-audio iew-ai">🤖 AI 講評</button></div>
    <div class="vs-ai-out iew-ai-out"></div>
    <div class="card" style="margin-top:14px">
      <div class="card-title">💡 高分要點</div>
      <ul class="grammar-points">${task.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="card-title" style="margin-top:10px">📝 參考範文(Band 8 水準)</div>
      <div class="sentence-box">${task.sample.replace(/\n\n/g, "<br><br>")}</div>
    </div>`;
  box.querySelector(".iew-ai").addEventListener("click", (e) =>
    ieltsAIFeedback("writing", task, text, box.querySelector(".iew-ai-out"), e.target));
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- AI 講評 ----------
async function ieltsAIFeedback(kind, task, text, out, btn) {
  if (typeof callAI !== "function") { out.textContent = "AI 功能尚未載入。"; return; }
  btn.disabled = true;
  out.textContent = "AI 講評中…";
  const system = "You are an experienced IELTS examiner. Reply in Traditional Chinese, no markdown, under 130 words.";
  const user = kind === "speaking"
    ? `這是 IELTS 口說 Part 2 的練習。
Cue card:"${task.title}" — ${task.bullets.join("; ")}
考生回答(語音辨識稿,可能有辨識誤差):"${text}"
請:1) 依 Fluency、Lexical Resource、Grammatical Range、Pronunciation 四項給一個總 Band(可用 .5);2) 指出最該改善的一項並說明原因;3) 給一句可直接照用的升級句型。`
    : `這是 IELTS 寫作 Task ${task.task} 的練習。
題目:"${task.prompt}"
考生作文:"${text}"
請:1) 依 Task Achievement、Coherence and Cohesion、Lexical Resource、Grammatical Range 四項各給 Band 並算總 Band;2) 指出兩個具體問題(含文法或用字錯誤,引用原句);3) 給一個改寫示範。${task.task === 1 ? "特別檢查是否有 overview 段落、是否誤加原因或個人意見。" : "特別檢查是否兩種觀點都討論、立場是否前後一致。"}`;
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
  updateIeltsEntry();
  $("#btn-ielts")?.addEventListener("click", openIELTS);
  $("#ielts-exit")?.addEventListener("click", ieltsBack);
});
