// ============ 英語冒險王 - 遊戲邏輯 ============
"use strict";

const TOTAL_STAGES = 10;      // 每關 10 場戰鬥,最後一場是 Boss
const PLAYER_MAX_HP = 100;
const DMG_NORMAL = 15;        // 答錯被一般怪攻擊
const DMG_BOSS = 25;          // 答錯被 Boss 攻擊
const BOSS_HP = 3;            // Boss 需答對 3 題
const SHADOW_COUNT = 8;       // 跟讀特訓每次句數
const OUTPUT_COUNT = 6;       // 輸出挑戰每次題數

const MONSTER_NAMES = ["單字小妖", "文法幽靈", "語塊史萊姆", "字根蝙蝠", "音節毒蛛", "拼字怨靈", "搭配詞魔", "翻譯魅影", "聽力遊魂"];

const $ = (sel) => document.querySelector(sel);

const state = {
  levelId: null,
  stage: 0,
  hp: PLAYER_MAX_HP,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correct: 0,
  answered: 0,
  bossHp: BOSS_HP,
  question: null,
  wrongList: [],     // {text, sub, audio} 結算複習用
  locked: false,
  quizWords: [],     // 本次冒險抽出的單字(8 個:5 一般 + 3 Boss)
  quizChunks: [],    // 本次冒險抽出的語塊(4 個)
};

const audioPlayer = new Audio();

function playAudio(src, btn) {
  audioPlayer.pause();
  audioPlayer.src = src;
  if (btn) {
    btn.classList.add("playing");
    audioPlayer.onended = () => btn.classList.remove("playing");
  } else {
    audioPlayer.onended = null;
  }
  audioPlayer.play().catch(() => { /* 使用者尚未互動時瀏覽器可能擋自動播放 */ });
}
const wordAudio = (w) => `audio/${w}.mp3`;
const chunkAudio = (item) => `audio/c_${chunkSlug(item)}.mp3`;
const sentAudio = (item, slow) => `audio/s_${chunkSlug(item)}${slow ? "_slow" : ""}.mp3`;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============ 畫面切換 ============
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  document.body.classList.toggle("in-activity", id !== "#screen-title");
  window.scrollTo(0, 0);
}

// ============ 底部分頁 ============
function switchTab(name) {
  document.querySelectorAll(".tabview").forEach((v) => v.classList.toggle("active", v.id === "tab-" + name));
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  window.scrollTo(0, 0);
}

function renderHomeAll() {
  renderTitle();
  renderDojo();
  renderConnBest();
  renderExplore();
  renderToday();
  renderProgressTab();
  if (typeof updateNbBadges === "function") updateNbBadges();
  if (typeof updateSettingsSummary === "function") updateSettingsSummary();
}

// ============ 標題畫面 ============
function bestKey(levelId) { return `ea_best_${levelId}`; }

function renderTitle() {
  const grid = $("#level-grid");
  grid.innerHTML = "";
  for (const id of LEVEL_ORDER) {
    const lv = WORD_BANK[id];
    const total = LESSON_BANK[id].length;
    const done = lessonDoneCount(id);
    const best = JSON.parse(localStorage.getItem(bestKey(id)) || "null");
    const card = document.createElement("div");
    card.className = "level-card";
    card.innerHTML = `
      <div class="lv-top">
        <span class="lv-emoji">${lv.emoji}</span>
        <span class="lv-info">
          <div class="lv-name">${lv.name}<small>${lv.title}</small></div>
          <div class="lv-desc">${lv.words.length} 單字・${COLLOC_BANK[id].length} 語塊・${total} 課</div>
        </span>
        <span class="lv-best">${best ? `${"★".repeat(best.stars)}<br>${best.score} 分` : '<span class="no-record">冒險未挑戰</span>'}</span>
      </div>
      <div class="lv-progress">
        <div class="pbar"><i style="width:${Math.round((done / total) * 100)}%"></i></div>
        <span>${done} / ${total} 課</span>
      </div>
      <div class="mode-btns">
        <button class="btn-mode btn-mode-main" data-mode="lesson">📚 上課程</button>
        <button class="btn-mode" data-mode="adventure">⚔️ 打冒險</button>
      </div>`;
    card.querySelector('[data-mode="lesson"]').addEventListener("click", () => startLesson(id));
    card.querySelector('[data-mode="adventure"]').addEventListener("click", () => startAdventure(id));
    grid.appendChild(card);
  }
}

// 探索分頁:冒險等級 + 跟讀 / 輸出入口
function renderExplore() {
  const adv = $("#adv-grid");
  adv.innerHTML = "";
  for (const id of LEVEL_ORDER) {
    const lv = WORD_BANK[id];
    const best = JSON.parse(localStorage.getItem(bestKey(id)) || "null");
    const btn = document.createElement("button");
    btn.className = "dojo-chip";
    btn.innerHTML = `<span class="dj-emoji">${lv.emoji}</span><span class="dj-name">${lv.name}</span>` +
      `<span class="dj-tag">${lv.title}</span>` +
      `<span class="dj-best">${best ? `${"★".repeat(best.stars)} ${best.score} 分` : "未挑戰"}</span>`;
    btn.addEventListener("click", () => startAdventure(id));
    adv.appendChild(btn);
  }
  const makePills = (sel, fn) => {
    const box = $(sel);
    box.innerHTML = "";
    for (const id of LEVEL_ORDER) {
      const p = document.createElement("button");
      p.className = "level-pill";
      p.textContent = `${WORD_BANK[id].emoji} ${WORD_BANK[id].name}`;
      p.addEventListener("click", () => fn(id));
      box.appendChild(p);
    }
  };
  makePills("#shadow-pills", startShadow);
  makePills("#output-pills", startOutput);
}

// 今日分頁:總進度 + 推薦任務
function totalLessonsDone() {
  return LEVEL_ORDER.reduce((n, id) => n + lessonDoneCount(id), 0);
}

function renderToday() {
  const total = LEVEL_ORDER.reduce((n, id) => n + LESSON_BANK[id].length, 0);
  const done = totalLessonsDone();
  $("#today-pbar").style.width = `${Math.round((done / total) * 100)}%`;
  $("#today-pv").textContent = `${done} / ${total} 課`;

  const box = $("#today-tasks");
  box.innerHTML = "";
  const tasks = [];

  // 任務 1:繼續下一堂未修畢的課
  outer: for (const id of LEVEL_ORDER) {
    const lessons = LESSON_BANK[id];
    for (let i = 0; i < lessons.length; i++) {
      if (lessonSecCount(id, i) < 5) {
        tasks.push({
          icon: "📖", cls: "i1",
          t: `繼續課程《${lessons[i].passage.title}》`,
          s: `${WORD_BANK[id].name}・第 ${i + 1} 課`,
          go: () => { startLesson(id); openLessonUnit(i); },
        });
        break outer;
      }
    }
  }

  // 任務 2:星數最低的等級去打冒險
  let advId = LEVEL_ORDER[0], minStars = 99;
  for (const id of LEVEL_ORDER) {
    const b = JSON.parse(localStorage.getItem(bestKey(id)) || "null");
    const s = b ? b.stars : -1;
    if (s < minStars) { minStars = s; advId = id; }
  }
  tasks.push({
    icon: "⚔️", cls: "i2",
    t: `${WORD_BANK[advId].name}冒險`,
    s: minStars < 0 ? "還沒挑戰過,去打第一場!" : `目前 ${"★".repeat(Math.max(1, minStars))},朝三星邁進`,
    go: () => startAdventure(advId),
  });

  // 任務 3:未達 90% 的母音道場,否則 AI 對話
  const dojoTarget = VOWEL_BANK.find((g) => (JSON.parse(localStorage.getItem(`ea_vowel_${g.id}`) || "null")?.acc || 0) < 90);
  if (dojoTarget) {
    tasks.push({ icon: "👂", cls: "i3", t: `母音道場 ${dojoTarget.name}`, s: dojoTarget.tagline, go: () => startDojo(dojoTarget) });
  } else {
    tasks.push({ icon: "🤖", cls: "i3", t: "和 AI 聊 10 分鐘", s: "把今天學的句型用出來", go: () => startAIChat(advId) });
  }

  for (const t of tasks) {
    const el = document.createElement("button");
    el.className = "task-card";
    el.innerHTML = `<span class="task-icon ${t.cls}">${t.icon}</span>` +
      `<span class="task-info"><b>${t.t}</b><span>${t.s}</span></span><span class="task-go">›</span>`;
    el.addEventListener("click", t.go);
    box.appendChild(el);
  }
}

// 進度分頁
function renderProgressTab() {
  const totalStars = LEVEL_ORDER.reduce((n, id) => n + (JSON.parse(localStorage.getItem(bestKey(id)) || "null")?.stars || 0), 0);
  const connBest = JSON.parse(localStorage.getItem("ea_conn") || "null");
  const dojoDone = VOWEL_BANK.filter((g) => localStorage.getItem(`ea_vowel_${g.id}`)).length;
  $("#stat-grid").innerHTML = `
    <div class="stat-card"><div class="sv">${totalLessonsDone()}<small>/105</small></div><div class="sl">修畢課程</div></div>
    <div class="stat-card"><div class="sv">${totalStars}<small>/15</small></div><div class="sl">冒險星數</div></div>
    <div class="stat-card"><div class="sv">${dojoDone}<small>/6</small></div><div class="sl">母音道場修行</div></div>
    <div class="stat-card"><div class="sv">${connBest ? connBest.acc + "%" : "—"}</div><div class="sl">連音聽寫最佳</div></div>`;
  const list = $("#progress-list");
  list.innerHTML = "";
  for (const id of LEVEL_ORDER) {
    const lv = WORD_BANK[id];
    const b = JSON.parse(localStorage.getItem(bestKey(id)) || "null");
    const row = document.createElement("div");
    row.className = "prow";
    row.innerHTML = `<span class="pe">${lv.emoji}</span><span class="pn">${lv.name}</span>` +
      `<span class="pd">課程 ${lessonDoneCount(id)}/${LESSON_BANK[id].length}${b ? `・冒險 <b>${"★".repeat(b.stars)}</b> ${b.score} 分` : "・冒險未挑戰"}</span>`;
    list.appendChild(row);
  }
}

function renderDojo() {
  const grid = $("#dojo-grid");
  grid.innerHTML = "";
  for (const g of VOWEL_BANK) {
    const best = JSON.parse(localStorage.getItem(`ea_vowel_${g.id}`) || "null");
    const btn = document.createElement("button");
    btn.className = "dojo-chip";
    btn.innerHTML = `<span class="dj-emoji">${g.emoji}</span><span class="dj-name">${g.name}</span>` +
      `<span class="dj-tag">${g.tagline}</span>` +
      `<span class="dj-best">${best ? `最佳 ${best.acc}%` : "未修行"}</span>`;
    btn.addEventListener("click", () => startDojo(g));
    grid.appendChild(btn);
  }
}

function goHome() {
  stopMic();
  renderHomeAll();
  showScreen("#screen-title");
}

// ============================================================
//  冒險模式(戰鬥)
// ============================================================
function startAdventure(levelId) {
  const lv = WORD_BANK[levelId];
  Object.assign(state, {
    levelId, stage: 0, hp: PLAYER_MAX_HP, score: 0, combo: 0, maxCombo: 0,
    correct: 0, answered: 0, bossHp: BOSS_HP, wrongList: [], locked: false,
    quizWords: shuffle(lv.words).slice(0, 5 + BOSS_HP),      // 一般字戰 5 + Boss 3
    quizChunks: shuffle(COLLOC_BANK[levelId]).slice(0, 4),   // 語塊戰 4
  });
  $("#hud-level-name").textContent = `${lv.emoji} ${lv.name}・${lv.title}`;
  renderProgress();
  updateHud();
  showScreen("#screen-battle");
  nextBattle();
}

function isBossStage() { return state.stage === TOTAL_STAGES - 1; }
// 第 2/4/6/8 戰(索引 1,3,5,7)是語塊戰
function isChunkStage(stage) { return stage < TOTAL_STAGES - 1 && stage % 2 === 1; }

function renderProgress() {
  const map = $("#progress-map");
  map.innerHTML = "";
  for (let i = 0; i < TOTAL_STAGES; i++) {
    const node = document.createElement("div");
    node.className = "node" + (i < state.stage ? " cleared" : i === state.stage ? " current" : "");
    map.appendChild(node);
  }
}

function updateHud() {
  $("#hud-stage").textContent = isBossStage() ? "👑 BOSS 戰!" : `第 ${state.stage + 1} / ${TOTAL_STAGES} 戰`;
  $("#hud-score").textContent = `💰 ${state.score}`;
  $("#hud-combo").textContent = state.combo >= 2 ? `🔥 ${state.combo} 連擊` : "";
  const pct = Math.max(0, (state.hp / PLAYER_MAX_HP) * 100);
  const fill = $("#php-fill");
  fill.style.width = pct + "%";
  fill.classList.toggle("low", pct <= 35);
  $("#php-text").textContent = `${Math.max(0, state.hp)} / ${PLAYER_MAX_HP}`;
}

function nextBattle() {
  const lv = WORD_BANK[state.levelId];
  renderProgress();

  const boss = isBossStage();
  const monsterEl = $("#monster");
  monsterEl.className = "monster" + (boss ? " boss" : "");
  monsterEl.textContent = boss ? lv.boss : lv.monsters[state.stage % lv.monsters.length];
  $("#monster-name").textContent = boss
    ? `${lv.name}關主 · 需連續答對 ${BOSS_HP} 題`
    : MONSTER_NAMES[state.stage % MONSTER_NAMES.length];
  $("#mhp-bar").style.display = boss ? "block" : "none";
  if (boss) $("#mhp-fill").style.width = (state.bossHp / BOSS_HP) * 100 + "%";

  makeQuestion();
  updateHud();
}

function makeQuestion() {
  if (isChunkStage(state.stage)) makeChunkQuestion();
  else makeWordQuestion();
  state.locked = false;
  renderQuestion();
}

function makeWordQuestion() {
  const lv = WORD_BANK[state.levelId];
  const boss = isBossStage();
  // 一般字戰(索引 0,2,4,6,8)依序取第 0..4 個字;Boss 取第 5..7 個
  const idx = boss ? 5 + (BOSS_HP - state.bossHp) : state.stage / 2;
  const word = state.quizWords[idx];

  let type;
  if (boss && state.bossHp === 1) type = "spell";
  else {
    const types = ["listen", "e2c", "c2e"];
    type = types[(state.stage + BOSS_HP - state.bossHp) % types.length];
  }
  const others = shuffle(lv.words.filter((x) => x.w !== word.w)).slice(0, 3);
  state.question = {
    kind: "word", type, item: word,
    options: shuffle([word, ...others]),
    correctLabel: type === "c2e" ? word.w : word.c,
    review: { text: word.w, sub: `${word.p} ${word.c}`, audio: wordAudio(word.w) },
  };
}

function makeChunkQuestion() {
  const bank = COLLOC_BANK[state.levelId];
  const item = state.quizChunks[(state.stage - 1) / 2];
  const type = state.stage === 1 || state.stage === 5 ? "fill" : "engdef";

  let options, correctLabel;
  if (type === "fill") {
    const verbs = [...new Set(bank.map((x) => x.v))]
      .filter((v) => v !== item.v && !(item.ban || []).includes(v));
    options = shuffle([item.v, ...shuffle(verbs).slice(0, 3)]);
    correctLabel = item.v;
  } else {
    const others = shuffle(bank.filter((x) => x !== item)).slice(0, 3);
    options = shuffle([item, ...others]).map(chunkOf);
    correctLabel = chunkOf(item);
  }
  state.question = {
    kind: "chunk", type, item, options, correctLabel,
    review: { text: chunkOf(item), sub: `${item.c} — ${item.def}`, audio: chunkAudio(item) },
  };
}

function renderQuestion() {
  const q = state.question;
  const tag = $("#q-type-tag");
  const qText = $("#q-text");
  const qHint = $("#q-hint");
  const audioBtn = $("#btn-audio");
  const optBox = $("#options");
  const spellZone = $("#spell-zone");
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#feedback-def").textContent = "";
  optBox.innerHTML = "";
  spellZone.style.display = "none";
  optBox.style.display = "grid";

  const renderOptions = (labels) => {
    for (const label of labels) {
      const btn = document.createElement("button");
      btn.className = "opt-btn";
      btn.textContent = label;
      btn.addEventListener("click", () => answerChoice(label, btn));
      optBox.appendChild(btn);
    }
  };

  if (q.kind === "chunk") {
    if (q.type === "fill") {
      tag.textContent = "🧩 語塊填空";
      qText.innerHTML = `<span class="blank">___</span> ${q.item.rest}<span class="pos">「${q.item.c}」</span>`;
      qHint.textContent = "選出正確的搭配動詞 — 記語塊,不要死背單字!";
      audioBtn.style.display = "none";
      renderOptions(q.options);
    } else {
      tag.textContent = "📖 英英釋義";
      qText.innerHTML = `“${q.item.def}”`;
      qText.classList.add("def-question");
      qHint.textContent = "讀懂英英釋義,選出對應的語塊";
      audioBtn.style.display = "none";
      renderOptions(q.options);
    }
    return;
  }
  qText.classList.remove("def-question");

  const word = q.item;
  if (q.type === "listen") {
    tag.textContent = "🎧 聽音辨義";
    qText.innerHTML = "仔細聽發音,選出正確的中文意思";
    qHint.textContent = "點喇叭可重複播放";
    audioBtn.style.display = "inline-block";
    renderOptions(q.options.map((o) => o.c));
    playAudio(wordAudio(word.w), audioBtn);
  } else if (q.type === "e2c") {
    tag.textContent = "📖 英翻中";
    qText.innerHTML = `${word.w}<span class="pos">${word.p}</span>`;
    qHint.textContent = "選出正確的中文意思";
    audioBtn.style.display = "inline-block";
    renderOptions(q.options.map((o) => o.c));
    playAudio(wordAudio(word.w), audioBtn);
  } else if (q.type === "c2e") {
    tag.textContent = "✍️ 中翻英";
    qText.innerHTML = `「${word.c}」<span class="pos">${word.p}</span>`;
    qHint.textContent = "選出對應的英文單字";
    audioBtn.style.display = "none";
    renderOptions(q.options.map((o) => o.w));
  } else if (q.type === "spell") {
    tag.textContent = "⚔️ 終極拼字";
    qText.innerHTML = `「${word.c}」<span class="pos">${word.p}</span>`;
    qHint.textContent = `聽發音,拼出這個單字(${word.w.length} 個字母)`;
    audioBtn.style.display = "inline-block";
    optBox.style.display = "none";
    spellZone.style.display = "flex";
    const input = $("#spell-input");
    input.value = "";
    input.className = "spell-input";
    input.disabled = false;
    input.focus();
    playAudio(wordAudio(word.w), audioBtn);
  }
}

// ============ 判定 ============
function answerChoice(label, btn) {
  if (state.locked) return;
  state.locked = true;
  const q = state.question;
  const isRight = label === q.correctLabel;

  document.querySelectorAll(".opt-btn").forEach((b) => {
    b.disabled = true;
    if (b.textContent === q.correctLabel) b.classList.add("correct");
    else if (b === btn) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  settle(isRight);
}

function answerSpell() {
  if (state.locked) return;
  const input = $("#spell-input");
  const guess = input.value.trim().toLowerCase();
  if (!guess) { input.focus(); return; }
  state.locked = true;
  input.disabled = true;
  const word = state.question.item;
  const isRight = guess === word.w.toLowerCase();
  input.classList.add(isRight ? "correct" : "wrong");
  if (!isRight) input.value = `${guess} → ${word.w}`;
  settle(isRight);
}

function settle(isRight) {
  const q = state.question;
  const boss = isBossStage();
  const fb = $("#feedback");
  state.answered++;

  const display = q.kind === "chunk"
    ? `${chunkOf(q.item)}「${q.item.c}」`
    : `${q.item.w}「${q.item.c}」`;

  if (isRight) {
    state.correct++;
    state.combo++;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    const base = q.type === "spell" ? 200 : q.kind === "chunk" ? 120 : 100;
    const gained = base + (state.combo - 1) * 10;
    state.score += gained;
    fb.textContent = `✅ 正確!${display} +${gained} 分`;
    fb.className = "feedback good";
    hitMonster(boss);
  } else {
    state.combo = 0;
    state.hp -= boss ? DMG_BOSS : DMG_NORMAL;
    state.wrongList.push(q.review);
    fb.textContent = `❌ 答錯!正確答案:${display} -${boss ? DMG_BOSS : DMG_NORMAL} HP`;
    fb.className = "feedback bad";
    playerHurt();
  }
  // 答題後播發音強化記憶;語塊題附上英英釋義
  playAudio(q.kind === "chunk" ? chunkAudio(q.item) : wordAudio(q.item.w));
  if (q.kind === "chunk") $("#feedback-def").textContent = `“${q.item.def}”`;
  updateHud();

  setTimeout(() => {
    if (state.hp <= 0) return endAdventure(false);
    if (isRight) {
      if (boss) {
        state.bossHp--;
        $("#mhp-fill").style.width = (state.bossHp / BOSS_HP) * 100 + "%";
        if (state.bossHp <= 0) return killMonster(() => endAdventure(true));
        makeQuestion();
        updateHud();
      } else {
        killMonster(() => { state.stage++; nextBattle(); });
      }
    } else {
      if (boss) {
        makeQuestion();   // Boss 戰答錯:同一單字重出,直到答對或陣亡
      } else {
        state.stage++;
        nextBattle();
      }
    }
  }, 1800);
}

function hitMonster(isBossHit) {
  const m = $("#monster");
  m.classList.add("hit");
  setTimeout(() => m.classList.remove("hit"), 500);
  floatText(isBossHit ? "-1" : "💥", "#ffd54f");
}

function killMonster(cb) {
  const m = $("#monster");
  m.classList.add("dead");
  setTimeout(cb, 650);
}

function playerHurt() {
  const arena = $("#arena");
  arena.classList.add("player-hurt");
  setTimeout(() => arena.classList.remove("player-hurt"), 550);
}

function floatText(text, color) {
  const el = document.createElement("div");
  el.className = "float-dmg";
  el.style.color = color;
  el.textContent = text;
  $("#arena").appendChild(el);
  setTimeout(() => el.remove(), 950);
}

// ============ 結算 ============
function endAdventure(win) {
  const lv = WORD_BANK[state.levelId];
  const acc = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  let stars = 0;
  if (win) {
    stars = 1;
    if (acc >= 80) stars = 2;
    if (acc >= 95 && state.hp === PLAYER_MAX_HP) stars = 3;
  }

  $("#result-emoji").textContent = win ? "🏆" : "💀";
  const title = $("#result-title");
  title.textContent = win ? `${lv.name}關卡制霸!` : "冒險失敗…";
  title.className = "result-title " + (win ? "win" : "lose");
  $("#result-stars").textContent = win ? "★".repeat(stars) + "☆".repeat(3 - stars) : "";
  $("#stat-score").textContent = state.score;
  $("#stat-acc").textContent = acc + "%";
  $("#stat-combo").textContent = state.maxCombo;

  const newRecordEl = $("#new-record");
  newRecordEl.style.display = "none";
  if (win) {
    const prev = JSON.parse(localStorage.getItem(bestKey(state.levelId)) || "null");
    if (!prev || state.score > prev.score) {
      localStorage.setItem(bestKey(state.levelId), JSON.stringify({ score: state.score, stars: Math.max(stars, prev?.stars || 0) }));
      newRecordEl.style.display = "block";
    } else if (stars > prev.stars) {
      localStorage.setItem(bestKey(state.levelId), JSON.stringify({ score: prev.score, stars }));
    }
  }

  const box = $("#review-box");
  const uniq = [...new Map(state.wrongList.map((r) => [r.text, r])).values()];
  if (uniq.length) {
    box.style.display = "block";
    const list = $("#review-list");
    list.innerHTML = "";
    for (const r of uniq) {
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `<span class="rw">${r.text}</span><span class="rc">${r.sub}</span>`;
      const btn = document.createElement("button");
      btn.className = "btn-mini-audio";
      btn.textContent = "🔊";
      btn.addEventListener("click", () => playAudio(r.audio, btn));
      item.appendChild(btn);
      list.appendChild(item);
    }
  } else {
    box.style.display = "none";
  }

  showScreen("#screen-result");
}

// ============================================================
//  跟讀特訓(Shadowing)
// ============================================================
const shadow = { levelId: null, items: [], idx: 0, recorder: null, stream: null, myUrl: null, recChunks: [] };

function startShadow(levelId) {
  shadow.levelId = levelId;
  shadow.items = shuffle(COLLOC_BANK[levelId]).slice(0, SHADOW_COUNT);
  shadow.idx = 0;
  const lv = WORD_BANK[levelId];
  $("#sh-level").textContent = `${lv.emoji} ${lv.name}・跟讀特訓`;
  showScreen("#screen-shadow");
  renderShadow();
}

function renderShadow() {
  const item = shadow.items[shadow.idx];
  $("#sh-progress").textContent = `第 ${shadow.idx + 1} / ${shadow.items.length} 句`;
  $("#sh-chunk").textContent = chunkOf(item);
  $("#sh-cn").textContent = item.c;
  $("#sh-def").textContent = `“${item.def}”`;
  $("#sh-sentence").textContent = item.ex;
  $("#sh-msg").textContent = "";
  resetRecordingUI();
  $("#sh-next").textContent = shadow.idx === shadow.items.length - 1 ? "完成特訓 🎉" : "下一句 →";
  playAudio(sentAudio(item, false), $("#sh-play"));
}

function resetRecordingUI() {
  if (shadow.myUrl) { URL.revokeObjectURL(shadow.myUrl); shadow.myUrl = null; }
  const recBtn = $("#sh-rec");
  recBtn.textContent = "🎙️ 錄下我的跟讀";
  recBtn.classList.remove("recording");
  $("#sh-myplay").disabled = true;
}

async function toggleRecording() {
  const recBtn = $("#sh-rec");
  if (shadow.recorder && shadow.recorder.state === "recording") {
    shadow.recorder.stop();
    return;
  }
  try {
    if (!shadow.stream) {
      shadow.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    shadow.recChunks = [];
    shadow.recorder = new MediaRecorder(shadow.stream);
    shadow.recorder.ondataavailable = (e) => shadow.recChunks.push(e.data);
    shadow.recorder.onstop = () => {
      if (shadow.myUrl) URL.revokeObjectURL(shadow.myUrl);
      shadow.myUrl = URL.createObjectURL(new Blob(shadow.recChunks, { type: shadow.recorder.mimeType }));
      recBtn.textContent = "🎙️ 重錄一次";
      recBtn.classList.remove("recording");
      $("#sh-myplay").disabled = false;
      $("#sh-msg").textContent = "錄好了!點「聽我的錄音」和原音比對語調與連音。";
    };
    shadow.recorder.start();
    recBtn.textContent = "⏹ 停止錄音";
    recBtn.classList.add("recording");
    $("#sh-msg").textContent = "錄音中…請跟著唸出整句!";
  } catch {
    $("#sh-msg").textContent = "⚠️ 無法使用麥克風(未授權或無裝置)。仍可開口跟讀,不影響練習!";
  }
}

function stopMic() {
  if (shadow.recorder && shadow.recorder.state === "recording") shadow.recorder.stop();
  if (shadow.stream) {
    shadow.stream.getTracks().forEach((t) => t.stop());
    shadow.stream = null;
  }
  if (shadow.myUrl) { URL.revokeObjectURL(shadow.myUrl); shadow.myUrl = null; }
}

// ============================================================
//  輸出挑戰(聽例句 → 用語塊造句)
// ============================================================
const out = { levelId: null, items: [], idx: 0, score: 0, answered: false };

// 不規則動詞的常見變化(造句檢查用)
const VERB_FORMS = {
  do: ["do", "does", "did", "doing", "done"],
  go: ["go", "goes", "went", "going", "gone"],
  have: ["have", "has", "had", "having"],
  take: ["take", "takes", "took", "taking", "taken"],
  make: ["make", "makes", "made", "making"],
  tell: ["tell", "tells", "told", "telling"],
  keep: ["keep", "keeps", "kept", "keeping"],
  ride: ["ride", "rides", "rode", "riding", "ridden"],
  run: ["run", "runs", "ran", "running"],
  lose: ["lose", "loses", "lost", "losing"],
  pay: ["pay", "pays", "paid", "paying"],
  meet: ["meet", "meets", "met", "meeting"],
  draw: ["draw", "draws", "drew", "drawing", "drawn"],
  set: ["set", "sets", "setting"],
  undergo: ["undergo", "undergoes", "underwent", "undergoing", "undergone"],
};

function startOutput(levelId) {
  out.levelId = levelId;
  out.items = shuffle(COLLOC_BANK[levelId]).slice(0, OUTPUT_COUNT);
  out.idx = 0;
  out.score = 0;
  out.answered = false;
  const lv = WORD_BANK[levelId];
  $("#out-level").textContent = `${lv.emoji} ${lv.name}・輸出挑戰`;
  $("#out-finish").style.display = "none";
  $("#out-main").style.display = "block";
  showScreen("#screen-output");
  renderOutput();
}

function renderOutput() {
  const item = out.items[out.idx];
  out.answered = false;
  $("#out-progress").textContent = `第 ${out.idx + 1} / ${out.items.length} 題 ・ 💰 ${out.score}`;
  $("#out-chunk").textContent = chunkOf(item);
  $("#out-cn").textContent = item.c;
  $("#out-def").textContent = `“${item.def}”`;
  $("#out-reveal").style.display = "none";
  $("#out-fb").textContent = "";
  $("#out-fb").className = "feedback";
  const ta = $("#out-input");
  ta.value = "";
  ta.disabled = false;
  $("#out-submit").style.display = "inline-block";
  $("#out-next").style.display = "none";
  playAudio(sentAudio(item, false), $("#out-play"));
}

function verbMatched(text, v) {
  const forms = VERB_FORMS[v];
  if (forms) return forms.some((f) => new RegExp(`\\b${f}\\b`).test(text));
  const stem = v.replace(/e$/, "").toLowerCase();
  return text.includes(stem);
}

function submitOutput() {
  if (out.answered) return;
  const item = out.items[out.idx];
  const raw = $("#out-input").value.trim();
  if (!raw) { $("#out-input").focus(); return; }
  out.answered = true;
  $("#out-input").disabled = true;

  const text = raw.toLowerCase();
  const keyNoun = item.rest.split(" ").pop().replace(/[^a-z']/gi, "").toLowerCase();
  const wordCount = raw.split(/\s+/).length;
  const usedChunk = verbMatched(text, item.v) && text.includes(keyNoun);
  const isCopy = text.replace(/[^a-z]/g, "") === item.ex.toLowerCase().replace(/[^a-z]/g, "");
  const ok = usedChunk && wordCount >= 6 && !isCopy;

  const fb = $("#out-fb");
  if (ok) {
    out.score += 150;
    fb.textContent = "✅ 太棒了!你成功用這個語塊輸出了自己的句子!+150 分";
    fb.className = "feedback good";
  } else if (isCopy) {
    fb.textContent = "🤏 不能照抄例句喔,試著換個情境造出自己的句子。";
    fb.className = "feedback bad";
  } else if (!usedChunk) {
    fb.textContent = `❌ 句子裡沒有用到「${chunkOf(item)}」(動詞可以變化時態)。看看範例怎麼用!`;
    fb.className = "feedback bad";
  } else {
    fb.textContent = "🤏 句子太短了,至少寫 6 個字,把情境說清楚。";
    fb.className = "feedback bad";
  }

  // 揭示原句對照
  const rev = $("#out-reveal");
  rev.style.display = "block";
  $("#out-example").textContent = item.ex;
  $("#out-progress").textContent = `第 ${out.idx + 1} / ${out.items.length} 題 ・ 💰 ${out.score}`;
  $("#out-submit").style.display = "none";
  const next = $("#out-next");
  next.style.display = "inline-block";
  next.textContent = out.idx === out.items.length - 1 ? "看結果 🎉" : "下一題 →";
}

function nextOutput() {
  if (out.idx < out.items.length - 1) {
    out.idx++;
    renderOutput();
  } else {
    $("#out-main").style.display = "none";
    const fin = $("#out-finish");
    fin.style.display = "block";
    $("#out-final-score").textContent = `${out.score} 分(滿分 ${out.items.length * 150}`.concat(" 分)");
    $("#out-final-msg").textContent = out.score >= out.items.length * 150 * 0.8
      ? "輸出力驚人!語塊已經內化成你的表達了 💪"
      : "多聽多說,下次挑戰把每個語塊都用出來!";
  }
}

// ============================================================
//  母音道場(最小對比詞聽辨)
// ============================================================
const DOJO_ROUNDS = 10;
const dojo = { group: null, round: 0, score: 0, correct: 0, streak: 0, pair: null, target: 0, locked: false };
const vowelAudio = (w) => `audio/${w.toLowerCase()}.mp3`;

function startDojo(group) {
  Object.assign(dojo, { group, round: 0, score: 0, correct: 0, streak: 0, locked: false });
  $("#vw-name").textContent = `${group.emoji} ${group.name} 道場`;
  const side = (p, el) => {
    $(`#vw-${p}sym`).textContent = el.sym;
    $(`#vw-${p}label`).textContent = el.label;
    $(`#vw-${p}mouth`).textContent = el.mouth;
    $(`#vw-${p}tongue`).textContent = el.tongue;
    $(`#vw-${p}tip`).textContent = el.tip;
  };
  side("l", group.left);
  side("r", group.right);
  $("#vw-finish").style.display = "none";
  $("#vw-main").style.display = "block";
  showScreen("#screen-vowel");
  nextDojoRound();
}

function nextDojoRound() {
  const g = dojo.group;
  dojo.pair = g.pairs[Math.floor(Math.random() * g.pairs.length)];
  dojo.target = Math.floor(Math.random() * 2);
  dojo.locked = false;
  $("#vw-progress").textContent = `第 ${dojo.round + 1} / ${DOJO_ROUNDS} 題 ・ 💰 ${dojo.score}`;
  $("#vw-fb").textContent = "";
  $("#vw-fb").className = "feedback";
  $("#vw-compare").style.display = "none";
  [0, 1].forEach((i) => {
    const btn = $(`#vw-opt${i}`);
    btn.disabled = false;
    btn.className = "opt-btn vw-opt";
    btn.innerHTML = `${dojo.pair[i]}<small>${i === 0 ? g.left.sym : g.right.sym}</small>`;
  });
  playAudio(vowelAudio(dojo.pair[dojo.target]), $("#vw-play"));
}

function dojoAnswer(idx) {
  if (dojo.locked) return;
  dojo.locked = true;
  const isRight = idx === dojo.target;
  const answer = dojo.pair[dojo.target];
  [0, 1].forEach((i) => {
    const btn = $(`#vw-opt${i}`);
    btn.disabled = true;
    if (i === dojo.target) btn.classList.add("correct");
    else if (i === idx) btn.classList.add("wrong");
    else btn.classList.add("dim");
  });

  const fb = $("#vw-fb");
  if (isRight) {
    dojo.correct++;
    dojo.streak++;
    const gained = 100 + (dojo.streak - 1) * 10;
    dojo.score += gained;
    fb.textContent = `✅ 沒錯,是 ${answer}!+${gained} 分`;
    fb.className = "feedback good";
  } else {
    dojo.streak = 0;
    fb.textContent = `❌ 剛剛唸的是 ${answer}。點下面兩顆按鈕成對比對,抓住長短與鬆緊的差別!`;
    fb.className = "feedback bad";
  }
  // 成對比對按鈕
  const cmp = $("#vw-compare");
  cmp.style.display = "flex";
  [0, 1].forEach((i) => {
    const btn = $(`#vw-cmp${i}`);
    btn.textContent = `🔊 ${dojo.pair[i]}`;
    btn.onclick = () => playAudio(vowelAudio(dojo.pair[i]), btn);
  });

  $("#vw-progress").textContent = `第 ${dojo.round + 1} / ${DOJO_ROUNDS} 題 ・ 💰 ${dojo.score}`;
  setTimeout(() => {
    dojo.round++;
    if (dojo.round >= DOJO_ROUNDS) endDojo();
    else nextDojoRound();
  }, isRight ? 1700 : 3200);   // 答錯多留時間讓玩家比對
}

function endDojo() {
  const acc = Math.round((dojo.correct / DOJO_ROUNDS) * 100);
  $("#vw-final-score").textContent = dojo.score;
  $("#vw-final-acc").textContent = acc + "%";
  $("#vw-final-msg").textContent = acc >= 90
    ? "耳朵已經升級!接著去跟讀特訓把它唸出來 🎤"
    : acc >= 70
      ? "有感覺了!多用成對比對聽出長短與鬆緊的差別。"
      : "別灰心,先看訣竅卡再聽一輪,專注「鬆 vs 緊」的對比。";
  const key = `ea_vowel_${dojo.group.id}`;
  const prev = JSON.parse(localStorage.getItem(key) || "null");
  if (!prev || acc > prev.acc) localStorage.setItem(key, JSON.stringify({ acc, score: dojo.score }));
  $("#vw-main").style.display = "none";
  $("#vw-finish").style.display = "block";
}

// ============================================================
//  課程系統(課文 / 字詞 / 發音 / 聽力 / 文法)
// ============================================================
const lesson = { levelId: null, idx: 0, section: "text", view: "list" };
const lessonKey = (id, idx) => `ea_lesson_${id}` + (idx ? `_${idx}` : "");
const lessonDone = (id, idx) => JSON.parse(localStorage.getItem(lessonKey(id, idx)) || "{}");
const lessonSecCount = (id, idx) => Object.values(lessonDone(id, idx)).filter(Boolean).length;
// 已「完整修完(5/5 單元)」的課數
const lessonDoneCount = (id) => LESSON_BANK[id].reduce((n, _, i) => n + (lessonSecCount(id, i) >= 5 ? 1 : 0), 0);

function markLessonDone(sectionKey) {
  const done = lessonDone(lesson.levelId, lesson.idx);
  if (done[sectionKey]) return;
  done[sectionKey] = true;
  localStorage.setItem(lessonKey(lesson.levelId, lesson.idx), JSON.stringify(done));
  renderLessonTabs();
}

function startLesson(levelId) {
  lesson.levelId = levelId;
  lesson.view = "list";
  const lv = WORD_BANK[levelId];
  $("#ls-level").textContent = `${lv.emoji} ${lv.name}・課程`;
  showScreen("#screen-lesson");
  renderLessonList();
}

function renderLessonList() {
  lesson.view = "list";
  audioPlayer.pause();
  stopReadAlong();
  $("#ls-tabs").innerHTML = "";
  $("#ls-progress").textContent = `修畢 ${lessonDoneCount(lesson.levelId)} / ${LESSON_BANK[lesson.levelId].length} 課`;
  const box = $("#ls-content");
  box.innerHTML = `<div class="steps-tip">選一課開始:每課含 課文/字詞/發音/聽力/文法 五單元,五單元全完成即修畢該課。</div>`;
  LESSON_BANK[lesson.levelId].forEach((L, i) => {
    const n = lessonSecCount(lesson.levelId, i);
    const item = document.createElement("button");
    item.className = "lesson-row" + (n >= 5 ? " done" : "");
    item.innerHTML = `<span class="lr-no">${String(i + 1).padStart(2, "0")}</span>
      <span class="lr-title">${L.passage.title}</span>
      <span class="lr-badge">${n >= 5 ? "修畢 ✅" : `${n}/5`}</span>`;
    item.addEventListener("click", () => openLessonUnit(i));
    box.appendChild(item);
  });
}

function openLessonUnit(idx) {
  lesson.idx = idx;
  lesson.section = "text";
  lesson.view = "unit";
  renderLessonTabs();
  renderLessonSection();
}

function renderLessonTabs() {
  const done = lessonDone(lesson.levelId, lesson.idx);
  const L = LESSON_BANK[lesson.levelId][lesson.idx];
  $("#ls-progress").textContent = `第 ${lesson.idx + 1} 課《${L.passage.title}》 ・ ${lessonSecCount(lesson.levelId, lesson.idx)} / 5 單元`;
  const tabs = $("#ls-tabs");
  tabs.innerHTML = "";
  const back = document.createElement("button");
  back.className = "ls-tab";
  back.textContent = "☰ 課程列表";
  back.addEventListener("click", renderLessonList);
  tabs.appendChild(back);
  for (const sec of LESSON_SECTIONS) {
    const btn = document.createElement("button");
    btn.className = "ls-tab" + (lesson.section === sec.key ? " active" : "");
    btn.textContent = `${sec.emoji} ${sec.name}${done[sec.key] ? " ✅" : ""}`;
    btn.addEventListener("click", () => { lesson.section = sec.key; renderLessonTabs(); renderLessonSection(); });
    tabs.appendChild(btn);
  }
}

// ============ 課文互動:逐字 highlight 與點字彈窗 ============
const readAlong = { spans: [], marks: [], raf: 0, key: "" };
const normWord = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

function renderInteractivePassage(container, L) {
  const parts = L.passage.en.split(/([A-Za-z][A-Za-z']*)/g);
  container.innerHTML = parts
    .map((t) => (/^[A-Za-z][A-Za-z']*$/.test(t) ? `<span class="pw">${t}</span>` : t.replace(/</g, "&lt;")))
    .join("");
  readAlong.spans = [...container.querySelectorAll(".pw")];
  readAlong.spans.forEach((s) => s.addEventListener("click", () => showWordModal(s.textContent, L)));
}

function stopReadAlong() {
  clearInterval(readAlong.raf);
  readAlong.raf = 0;
  readAlong.marks = [];
  readAlong.key = "";
  readAlong.spans.forEach((s) => s.classList.remove("reading"));
}

function playPassage(L, slow) {
  const key = L.passage.aid + (slow ? "_slow" : "");
  playAudio(`audio/${key}.mp3`, $(slow ? "#ls-slow" : "#ls-play"));
  startReadAlong(key);
}

function startReadAlong(key) {
  stopReadAlong();
  const track = typeof PASSAGE_TIMINGS !== "undefined" ? PASSAGE_TIMINGS[key] : null;
  if (!track || !readAlong.spans.length) return;
  // 貪婪對齊:時間戳的字逐一對到畫面上的 span(數字/連字號不一致時往後找)
  const aligned = [];
  let si = 0;
  for (const [ms, word] of track) {
    const target = normWord(word);
    for (let j = si; j < Math.min(si + 4, readAlong.spans.length); j++) {
      if (normWord(readAlong.spans[j].textContent) === target) {
        aligned.push([ms, j]);
        si = j + 1;
        break;
      }
    }
  }
  readAlong.marks = aligned;
  readAlong.key = key;
  let cur = -1;
  readAlong.raf = setInterval(() => {
    if (readAlong.key !== key) return;
    // 換播其他音檔(如點字聽發音)或播畢 → 停止高亮
    if (!audioPlayer.src.endsWith(`${key}.mp3`) || audioPlayer.ended) return stopReadAlong();
    const t = audioPlayer.currentTime * 1000;
    let next = -1;
    for (const [ms, idx] of readAlong.marks) {
      if (t >= ms) next = idx;
      else break;
    }
    if (next !== cur) {
      if (cur >= 0) readAlong.spans[cur]?.classList.remove("reading");
      if (next >= 0) readAlong.spans[next]?.classList.add("reading");
      cur = next;
    }
  }, 60);
}

// 在五級字庫中查詢單字(含簡單詞形還原)
function bankLookup(word) {
  const lw = word.toLowerCase();
  const cands = [lw];
  if (lw.endsWith("ies")) cands.push(lw.slice(0, -3) + "y");
  if (lw.endsWith("es")) cands.push(lw.slice(0, -2));
  if (lw.endsWith("s")) cands.push(lw.slice(0, -1));
  if (lw.endsWith("ing")) cands.push(lw.slice(0, -3), lw.slice(0, -3) + "e");
  if (lw.endsWith("ed")) cands.push(lw.slice(0, -2), lw.slice(0, -1));
  for (const c of cands) {
    for (const id of LEVEL_ORDER) {
      const hit = WORD_BANK[id].words.find((x) => x.w.toLowerCase() === c);
      if (hit) return { ...hit, level: WORD_BANK[id].name };
    }
  }
  return null;
}

// 高頻字注釋庫查詢(同樣做簡單詞形還原)
function glossaryLookup(word) {
  if (typeof GLOSSARY === "undefined") return null;
  const lw = word.toLowerCase();
  const cands = [lw];
  if (lw.endsWith("ies")) cands.push(lw.slice(0, -3) + "y");
  if (lw.endsWith("es")) cands.push(lw.slice(0, -2));
  if (lw.endsWith("s")) cands.push(lw.slice(0, -1));
  if (lw.endsWith("ing")) cands.push(lw.slice(0, -3), lw.slice(0, -3) + "e");
  if (lw.endsWith("ed")) cands.push(lw.slice(0, -2), lw.slice(0, -1));
  for (const c of cands) if (GLOSSARY[c]) return GLOSSARY[c];
  return null;
}

let wmSeq = 0;
let wmDefFails = 0;
// 彈窗專用播放器:單字發音不干擾課文播放器的進度
const wordPlayer = new Audio();
let modalResume = false;   // 關閉彈窗後是否續播課文

function playWordAudio(src, btn, word) {
  wordPlayer.pause();
  wordPlayer.src = src;
  if (btn) {
    btn.classList.add("playing");
    wordPlayer.onended = () => btn.classList.remove("playing");
  } else {
    wordPlayer.onended = null;
  }
  // 沒有預錄音檔的字(如影片字幕的生字)→ 瀏覽器 TTS 後援
  wordPlayer.onerror = () => {
    btn?.classList.remove("playing");
    if (word && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "en-US";
      u.rate = 0.85;
      speechSynthesis.speak(u);
    }
  };
  wordPlayer.play().catch(() => {});
}

function closeWordModal() {
  $("#word-modal").style.display = "none";
  wordPlayer.pause();
  if (modalResume) {
    modalResume = false;
    audioPlayer.play().catch(() => {});   // 從暫停處續播課文,高亮自動接續
  }
}

function showWordModal(word, L) {
  // 課文朗讀中 → 暫停(保留進度與高亮),關閉彈窗後續播
  if (readAlong.key && !audioPlayer.paused && !audioPlayer.ended) {
    modalResume = true;
    audioPlayer.pause();
  }
  $("#word-modal").style.display = "flex";
  $("#wm-word").textContent = word;
  const lw = word.toLowerCase().replace(/'+$/, "");
  $("#wm-play").onclick = () => playWordAudio(`audio/${lw}.mp3`, $("#wm-play"), lw);
  playWordAudio(`audio/${lw}.mp3`, null, lw);
  const seq = ++wmSeq;

  // ⭐ 收藏到單字單句本(帶中文、英英釋義與出處例句)
  const star = $("#wm-star");
  const syncStar = () => {
    const on = nbHasWord(word);
    star.textContent = on ? "⭐ 已收藏" : "☆ 收藏";
    star.classList.toggle("on", on);
  };
  syncStar();
  star.onclick = () => {
    nbToggleWord({
      w: word,
      zh: $("#wm-bank").textContent.trim(),
      def: $("#wm-def").textContent.trim().replace(/離線詞典・WordNet$/, "").trim(),
      sentence: $("#wm-sentence").textContent.trim(),
    });
    syncStar();
  };

  // 三層中文說明:五級字庫 → 高頻字注釋庫 → 線上翻譯
  const bank = bankLookup(word);
  const gloss = bank ? null : glossaryLookup(word);
  const bankBox = $("#wm-bank");
  if (bank) {
    bankBox.innerHTML = `<span class="wm-pos">${bank.p}</span> ${bank.c}<span class="wm-level">${bank.level}級字彙</span>`;
  } else if (gloss) {
    bankBox.innerHTML = `<span class="wm-pos">常用字</span> ${gloss}`;
  } else {
    bankBox.textContent = "查詢中文翻譯中…";
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(lw)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        if (seq !== wmSeq) return;
        const zh = j?.[0]?.[0]?.[0];
        bankBox.innerHTML = zh ? `<span class="wm-pos">中文</span> ${zh}<span class="wm-level">線上翻譯</span>` : "";
      })
      .catch(() => { if (seq === wmSeq) bankBox.textContent = ""; });
  }

  const sentences = L.passage.en.match(/[^.!?]+[.!?]+['"”]?/g) || [L.passage.en];
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "i");
  const sent = (sentences.find((s) => re.test(s)) || "").trim();
  $("#wm-sentence").innerHTML = sent.replace(re, (m) => `<mark>${m}</mark>`);

  const defBox = $("#wm-def");
  // 優先:全離線英英詞典(WordNet,涵蓋所有課文單字)
  const offline = typeof OFFLINE_DICT !== "undefined" && (OFFLINE_DICT[lw] || OFFLINE_DICT[word.toLowerCase()]);
  if (offline) {
    defBox.style.display = "block";
    defBox.innerHTML = offline
      .map(([pos, def, ex]) =>
        `<div class="wm-meaning"><span class="wm-pos">${pos}</span> ${def}` +
        (ex ? `<div class="wm-ex">“${ex}”</div>` : "") + `</div>`)
      .join("") + `<div class="wm-src">離線詞典・WordNet</div>`;
    return;
  }
  // 後援:線上詞典(dictionaryapi.dev 不穩定:連續失敗 3 次後,本次瀏覽不再嘗試)
  if (wmDefFails >= 3) { defBox.style.display = "none"; return; }
  defBox.style.display = "block";
  defBox.textContent = "查詢英英釋義中…";
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lw)}`)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      wmDefFails = 0;
      if (seq !== wmSeq) return;
      const phon = data[0]?.phonetic || "";
      const meanings = (data[0]?.meanings || []).slice(0, 2);
      defBox.innerHTML = meanings.length
        ? (phon ? `<div class="wm-phon">${phon}</div>` : "") +
          meanings
            .map((m) => {
              const d = m.definitions?.[0] || {};
              return `<div class="wm-meaning"><span class="wm-pos">${m.partOfSpeech}</span> ${d.definition || ""}` +
                (d.example ? `<div class="wm-ex">“${d.example}”</div>` : "") + `</div>`;
            })
            .join("")
        : "(查無英英釋義)";
    })
    .catch(() => {
      wmDefFails++;
      if (seq === wmSeq) {
        if (wmDefFails >= 3) defBox.style.display = "none";
        else defBox.textContent = "(離線或查無此字,暫無英英釋義)";
      }
    });
}

// 通用測驗渲染:items 的 opts[0] 是正解,顯示時洗牌;全部作答後呼叫 onComplete
function renderQuizInto(box, items, onComplete) {
  let answered = 0, correctCount = 0;
  items.forEach((item, qi) => {
    const block = document.createElement("div");
    block.className = "quiz-block";
    block.innerHTML = `<div class="quiz-q">${qi + 1}. ${item.q}</div>`;
    const optBox = document.createElement("div");
    optBox.className = "options quiz-opts";
    const note = document.createElement("div");
    note.className = "feedback-def";
    for (const label of shuffle(item.opts)) {
      const btn = document.createElement("button");
      btn.className = "opt-btn quiz-opt";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        optBox.querySelectorAll("button").forEach((b) => {
          b.disabled = true;
          if (b.textContent === item.opts[0]) b.classList.add("correct");
          else if (b === btn) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        if (label === item.opts[0]) correctCount++;
        if (item.note) note.textContent = "📌 " + item.note;
        answered++;
        if (answered === items.length) onComplete(correctCount);
      });
      optBox.appendChild(btn);
    }
    block.appendChild(optBox);
    block.appendChild(note);
    box.appendChild(block);
  });
}

function renderLessonSection() {
  const L = LESSON_BANK[lesson.levelId][lesson.idx];
  const box = $("#ls-content");
  box.innerHTML = "";
  audioPlayer.pause();
  stopReadAlong();
  readAlong.spans = [];
  const sec = lesson.section;

  const addDoneBtn = (label = "✓ 完成這個單元") => {
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = label;
    btn.style.marginTop = "14px";
    btn.addEventListener("click", () => { markLessonDone(sec); btn.textContent = "已完成 ✅"; btn.disabled = true; });
    box.appendChild(btn);
    return btn;
  };
  const sectionDoneBanner = (correct, total) => {
    const div = document.createElement("div");
    div.className = "feedback good";
    div.style.marginTop = "12px";
    div.textContent = `🎉 單元完成!答對 ${correct} / ${total} 題,已記錄進度。`;
    box.appendChild(div);
  };

  if (sec === "text") {
    box.innerHTML = `
      <div class="chunk-line"><span class="chunk-big">${L.passage.title}</span></div>
      <div class="steps-tip">▶ 播放時朗讀到的單字會亮起;點課文中任何單字,可聽發音並查看解說與例句。</div>
      <div class="shadow-controls">
        <button id="ls-play" class="btn-audio">▶ 課文朗讀</button>
        <button id="ls-slow" class="btn-audio slow">🐢 慢速</button>
        <button id="ls-zh-toggle" class="btn-audio mine">🀄 中文翻譯</button>
      </div>
      <div id="ls-passage" class="sentence-box passage"></div>
      <div id="ls-zh" class="sentence-box passage zh" style="display:none">${L.passage.zh}</div>`;
    renderInteractivePassage($("#ls-passage"), L);
    $("#ls-play")?.addEventListener("click", () => playPassage(L, false));
    $("#ls-slow")?.addEventListener("click", () => playPassage(L, true));
    $("#ls-zh-toggle")?.addEventListener("click", () => {
      const zh = $("#ls-zh");
      zh.style.display = zh.style.display === "none" ? "block" : "none";
    });
    addDoneBtn("✓ 我讀完課文了");
  } else if (sec === "vocab") {
    box.innerHTML = `<div class="chunk-line"><span class="chunk-big">課文核心字詞</span></div>
      <div class="steps-tip">點 🔊 聽發音,唸出來再看中文;這些字都會出現在冒險戰鬥裡。</div>`;
    for (const w of L.vocab) {
      const entry = WORD_BANK[lesson.levelId].words.find((x) => x.w === w);
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `<span class="rw">${entry.w}</span><span class="rc">${entry.p} ${entry.c}</span>`;
      const btn = document.createElement("button");
      btn.className = "btn-mini-audio";
      btn.textContent = "🔊";
      btn.addEventListener("click", () => playAudio(wordAudio(entry.w), btn));
      item.appendChild(btn);
      box.appendChild(item);
    }
    addDoneBtn("✓ 字詞都認識了");
  } else if (sec === "pron") {
    box.innerHTML = `<div class="chunk-line"><span class="chunk-big">${L.pron.title}</span></div>
      <div class="steps-tip">${L.pron.tip}</div>
      <div class="quiz-q" style="margin-bottom:8px">🎧 聽音辨認(共 ${L.pron.drills.length} 題):</div>`;
    const items = L.pron.drills.map((d) => ({ q: "", opts: d.opts, note: d.note, play: d.play }));
    // 每題附播放鈕
    let answered = 0, correctCount = 0;
    items.forEach((item, qi) => {
      const block = document.createElement("div");
      block.className = "quiz-block";
      const playBtn = document.createElement("button");
      playBtn.className = "btn-audio";
      playBtn.textContent = `🔊 第 ${qi + 1} 題`;
      playBtn.addEventListener("click", () => playAudio(wordAudio(item.play.toLowerCase()), playBtn));
      block.appendChild(playBtn);
      const optBox = document.createElement("div");
      optBox.className = "options quiz-opts";
      const note = document.createElement("div");
      note.className = "feedback-def";
      for (const label of shuffle(item.opts)) {
        const btn = document.createElement("button");
        btn.className = "opt-btn quiz-opt";
        btn.textContent = label;
        btn.addEventListener("click", () => {
          optBox.querySelectorAll("button").forEach((b) => {
            b.disabled = true;
            if (b.textContent === item.opts[0]) b.classList.add("correct");
            else if (b === btn) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          if (label === item.opts[0]) correctCount++;
          note.textContent = "📌 " + item.note;
          answered++;
          if (answered === items.length) { markLessonDone("pron"); sectionDoneBanner(correctCount, items.length); }
        });
        optBox.appendChild(btn);
      }
      block.appendChild(optBox);
      block.appendChild(note);
      box.appendChild(block);
    });
    playAudio(wordAudio(items[0].play.toLowerCase()));
  } else if (sec === "listen") {
    box.innerHTML = `<div class="chunk-line"><span class="chunk-big">聽力理解:${L.passage.title}</span></div>
      <div class="steps-tip">先重聽課文(建議不看文字),再回答下面 ${L.listening.length} 個問題。</div>
      <div class="shadow-controls">
        <button id="ls-listen-play" class="btn-audio">▶ 播放課文</button>
        <button id="ls-listen-slow" class="btn-audio slow">🐢 慢速</button>
      </div>`;
    $("#ls-listen-play")?.addEventListener("click", () => playAudio(`audio/${L.passage.aid}.mp3`, $("#ls-listen-play")));
    $("#ls-listen-slow")?.addEventListener("click", () => playAudio(`audio/${L.passage.aid}_slow.mp3`, $("#ls-listen-slow")));
    renderQuizInto(box, L.listening, (c) => { markLessonDone("listen"); sectionDoneBanner(c, L.listening.length); });
  } else if (sec === "grammar") {
    box.innerHTML = `<div class="chunk-line"><span class="chunk-big">${L.grammar.title}</span></div>
      <ul class="grammar-points">${L.grammar.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      ${L.grammar.examples.map((e) => `<div class="sentence-box">✒️ ${e.en}<div class="conn-trans">${e.zh}</div></div>`).join("")}
      <div class="quiz-q" style="margin:10px 0 8px">📝 小試身手(共 ${L.grammar.quiz.length} 題):</div>`;
    renderQuizInto(box, L.grammar.quiz, (c) => { markLessonDone("grammar"); sectionDoneBanner(c, L.grammar.quiz.length); });
  }
}

// ============================================================
//  商務連音特訓(連音 / 閃音 / 弱讀 聽寫)
// ============================================================
const CONN_ROUNDS = 8;
const conn = { items: [], idx: 0, score: 0, correct: 0, answered: false };
const connAudio = (item, slow) => `audio/m_${item.id}${slow ? "_slow" : ""}.mp3`;

function connNormalize(text) {
  return text.toLowerCase().replace(/’/g, "'").replace(/[^a-z' ]/g, "").replace(/\s+/g, " ").trim();
}

function renderConnBest() {
  const best = JSON.parse(localStorage.getItem("ea_conn") || "null");
  $("#conn-best").textContent = best ? `最佳 ${best.acc}%` : "未特訓";
}

function startConn() {
  Object.assign(conn, { items: shuffle(CONN_BANK).slice(0, CONN_ROUNDS), idx: 0, score: 0, correct: 0, answered: false });
  $("#cn-finish").style.display = "none";
  $("#cn-main").style.display = "block";
  showScreen("#screen-conn");
  renderConn();
}

function renderConn() {
  const item = conn.items[conn.idx];
  conn.answered = false;
  $("#cn-progress").textContent = `第 ${conn.idx + 1} / ${conn.items.length} 句 ・ 💰 ${conn.score}`;
  // 挖空 focus
  const blanks = item.focus.split(" ").map(() => "____").join(" ");
  $("#cn-cloze").innerHTML = item.s.replace(new RegExp(item.focus, "i"), `<span class="blank">${blanks}</span>`);
  $("#cn-fb").textContent = "";
  $("#cn-fb").className = "feedback";
  $("#cn-reveal").style.display = "none";
  const input = $("#cn-input");
  input.value = "";
  input.disabled = false;
  input.className = "spell-input conn-input";
  $("#cn-submit").style.display = "inline-block";
  input.focus();
  playAudio(connAudio(item, false), $("#cn-play"));
}

function submitConn() {
  if (conn.answered) return;
  const input = $("#cn-input");
  const guess = connNormalize(input.value);
  if (!guess) { input.focus(); return; }
  conn.answered = true;
  input.disabled = true;

  const item = conn.items[conn.idx];
  const accepted = [item.focus, ...(item.alt || [])].map(connNormalize);
  const isRight = accepted.includes(guess);

  const fb = $("#cn-fb");
  if (isRight) {
    conn.correct++;
    conn.score += 150;
    input.classList.add("correct");
    fb.textContent = "✅ 聽出來了!你的耳朵跟上母語人士的節奏了 +150 分";
    fb.className = "feedback good";
  } else {
    input.classList.add("wrong");
    fb.textContent = `❌ 答案是「${item.focus}」。看下面的機制說明,再聽一次抓感覺!`;
    fb.className = "feedback bad";
  }

  // 揭示機制
  const mech = CONN_MECHS[item.mech];
  $("#cn-mech").textContent = `${mech.emoji} ${mech.name} — ${mech.desc}`;
  $("#cn-full").innerHTML = item.s.replace(new RegExp(item.focus, "i"), (m) => `<mark>${m}</mark>`);
  $("#cn-phon").textContent = item.phon;
  $("#cn-note").textContent = "📌 " + item.note;
  $("#cn-cn").textContent = "🀄 " + item.cn;
  $("#cn-reveal").style.display = "block";
  $("#cn-submit").style.display = "none";
  $("#cn-next").textContent = conn.idx === conn.items.length - 1 ? "看結果 🎉" : "下一句 →";
  $("#cn-progress").textContent = `第 ${conn.idx + 1} / ${conn.items.length} 句 ・ 💰 ${conn.score}`;
  playAudio(connAudio(item, false));   // 答完再聽一次自然語速
}

function nextConn() {
  if (conn.idx < conn.items.length - 1) {
    conn.idx++;
    renderConn();
  } else {
    const acc = Math.round((conn.correct / conn.items.length) * 100);
    $("#cn-final-score").textContent = conn.score;
    $("#cn-final-acc").textContent = acc + "%";
    $("#cn-final-msg").textContent = acc >= 85
      ? "會議聽力無死角!下次開英文會直接跟上節奏 💼"
      : acc >= 60
        ? "節奏感出來了!答錯的句子多用慢速比對,再跟讀三次。"
        : "先聽慢速抓清楚每個字,再切自然語速感受它們怎麼黏在一起。";
    const prev = JSON.parse(localStorage.getItem("ea_conn") || "null");
    if (!prev || acc > prev.acc) localStorage.setItem("ea_conn", JSON.stringify({ acc, score: conn.score }));
    $("#cn-main").style.display = "none";
    $("#cn-finish").style.display = "block";
  }
}

// ============ 事件綁定 ============
document.addEventListener("DOMContentLoaded", () => {
  renderHomeAll();

  // 底部分頁與快速開始
  document.querySelectorAll(".tab-btn").forEach((b) =>
    b.addEventListener("click", () => switchTab(b.dataset.tab)));
  document.querySelectorAll(".quick-btn[data-goto]").forEach((b) =>
    b.addEventListener("click", () => switchTab(b.dataset.goto)));
  $("#quick-notebook")?.addEventListener("click", () => openNotebook());
  $("#nb-entry")?.addEventListener("click", () => openNotebook());

  // 課程系統(單元內按離開 → 回課程列表;列表按離開 → 回地圖)
  $("#ls-exit")?.addEventListener("click", () => {
    if (lesson.view === "unit") renderLessonList();
    else goHome();
  });

  // 單字彈窗(關閉時續播課文)
  $("#wm-close")?.addEventListener("click", closeWordModal);
  $("#word-modal")?.addEventListener("click", (e) => {
    if (e.target === $("#word-modal")) closeWordModal();
  });

  // 商務連音特訓
  $("#btn-conn-start")?.addEventListener("click", startConn);
  $("#cn-play")?.addEventListener("click", () => playAudio(connAudio(conn.items[conn.idx], false), $("#cn-play")));
  $("#cn-slow")?.addEventListener("click", () => playAudio(connAudio(conn.items[conn.idx], true), $("#cn-slow")));
  $("#cn-submit")?.addEventListener("click", submitConn);
  $("#cn-input")?.addEventListener("keydown", (e) => { if (e.key === "Enter") submitConn(); });
  $("#cn-next")?.addEventListener("click", nextConn);
  $("#cn-retry")?.addEventListener("click", startConn);
  $("#cn-home")?.addEventListener("click", goHome);
  $("#cn-exit")?.addEventListener("click", goHome);

  // 母音道場
  $("#vw-opt0")?.addEventListener("click", () => dojoAnswer(0));
  $("#vw-opt1")?.addEventListener("click", () => dojoAnswer(1));
  $("#vw-play")?.addEventListener("click", () => playAudio(vowelAudio(dojo.pair[dojo.target]), $("#vw-play")));
  $("#vw-retry")?.addEventListener("click", () => startDojo(dojo.group));
  $("#vw-home")?.addEventListener("click", goHome);
  $("#vw-exit")?.addEventListener("click", goHome);

  // 冒險
  $("#btn-audio")?.addEventListener("click", () => {
    const q = state.question;
    if (q) playAudio(q.kind === "chunk" ? chunkAudio(q.item) : wordAudio(q.item.w), $("#btn-audio"));
  });
  $("#btn-spell-submit")?.addEventListener("click", answerSpell);
  $("#spell-input")?.addEventListener("keydown", (e) => { if (e.key === "Enter") answerSpell(); });
  $("#btn-quit")?.addEventListener("click", goHome);
  $("#btn-retry")?.addEventListener("click", () => startAdventure(state.levelId));
  $("#btn-home")?.addEventListener("click", goHome);

  // 跟讀
  $("#sh-play")?.addEventListener("click", () => playAudio(sentAudio(shadow.items[shadow.idx], false), $("#sh-play")));
  $("#sh-slow")?.addEventListener("click", () => playAudio(sentAudio(shadow.items[shadow.idx], true), $("#sh-slow")));
  $("#sh-chunk-play")?.addEventListener("click", () => playAudio(chunkAudio(shadow.items[shadow.idx]), $("#sh-chunk-play")));
  $("#sh-rec")?.addEventListener("click", toggleRecording);
  $("#sh-myplay")?.addEventListener("click", () => { if (shadow.myUrl) playAudio(shadow.myUrl, $("#sh-myplay")); });
  $("#sh-next")?.addEventListener("click", () => {
    if (shadow.idx < shadow.items.length - 1) { shadow.idx++; renderShadow(); }
    else goHome();
  });
  $("#sh-exit")?.addEventListener("click", goHome);

  // 輸出
  $("#out-play")?.addEventListener("click", () => playAudio(sentAudio(out.items[out.idx], false), $("#out-play")));
  $("#out-slow")?.addEventListener("click", () => playAudio(sentAudio(out.items[out.idx], true), $("#out-slow")));
  $("#out-submit")?.addEventListener("click", submitOutput);
  $("#out-next")?.addEventListener("click", nextOutput);
  $("#out-exit")?.addEventListener("click", goHome);
  $("#out-home")?.addEventListener("click", goHome);
});
