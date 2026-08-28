// ============================================================
//  📺 看影片學英文 AI 口說(參考 VoiceTube)
//  看影片 → 逐句聽發音 → 🎙️ 口說挑戰(逐字比對評分)→ 🤖 AI 講評
// ============================================================
"use strict";

const vid = { video: null, rec: null, recording: false, activeIdx: -1, player: null, syncTimer: 0, tsLines: [], tsActive: -1 };

// ---------- YouTube IFrame API(供文字稿同步/點句跳轉)----------
let ytApiPromise = null;
function loadYTApi() {
  if (window.YT?.Player) return Promise.resolve(true);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 6000);
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); resolve(true); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = () => { clearTimeout(timeout); resolve(false); };
    document.head.appendChild(s);
  });
  return ytApiPromise;
}

const vidBestKey = (yt, i) => `ea_video_${yt}_${i}`;
const vidAudio = (yt, i, slow) => `audio/v_${yt}_${i}${slow ? "_slow" : ""}.mp3`;

// 名句來源:手寫(舊影片)或從真實字幕擷取(build_video_sentences.py)
function vidSentences(v) {
  if (v.sentences?.length) return v.sentences;
  return (typeof VIDEO_SENTENCES !== "undefined" && VIDEO_SENTENCES[v.yt]) || [];
}

// ---------- 逐字比對評分(LCS 對齊)----------
function scoreSpeech(target, said) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
  const t = norm(target), s = norm(said);
  const dp = Array.from({ length: t.length + 1 }, () => Array(s.length + 1).fill(0));
  for (let i = 1; i <= t.length; i++)
    for (let j = 1; j <= s.length; j++)
      dp[i][j] = t[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const matched = Array(t.length).fill(false);
  let i = t.length, j = s.length;
  while (i > 0 && j > 0) {
    if (t[i - 1] === s[j - 1]) { matched[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return { score: t.length ? Math.round((dp[t.length][s.length] / t.length) * 100) : 0, matched, words: t };
}

// ---------- 探索分頁:影片清單(CEFR 分級 + 主題篩選)----------
const vfilter = { cefr: "all", tag: "all" };

function renderVideoFilters() {
  const bar = $("#video-filters");
  if (!bar) return;
  const cefrs = ["all", ...new Set(VIDEO_BANK.map((v) => v.cefr))].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b)));
  const tags = ["all", ...new Set(VIDEO_BANK.flatMap((v) => v.tags || []))];
  bar.innerHTML = "";
  const mkRow = (label, items, key) => {
    const row = document.createElement("div");
    row.className = "vf-row";
    row.innerHTML = `<span class="vf-label">${label}</span>`;
    for (const it of items) {
      const b = document.createElement("button");
      b.className = "vf-pill" + (vfilter[key] === it ? " on" : "");
      b.textContent = it === "all" ? "全部" : it;
      b.addEventListener("click", () => { vfilter[key] = it; renderVideoFilters(); renderVideos(); });
      row.appendChild(b);
    }
    bar.appendChild(row);
  };
  mkRow("難度", cefrs, "cefr");
  mkRow("主題", tags, "tag");
}

function renderVideos() {
  const grid = $("#video-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const list = VIDEO_BANK.filter((v) =>
    (vfilter.cefr === "all" || v.cefr === vfilter.cefr) &&
    (vfilter.tag === "all" || (v.tags || []).includes(vfilter.tag)));
  if (!list.length) {
    grid.innerHTML = `<div class="nb-empty">這個組合沒有影片,換個篩選條件試試。</div>`;
    return;
  }
  for (const v of list) {
    const lv = WORD_BANK[v.level];
    const sents = vidSentences(v);
    const done = sents.filter((_, i) => +(localStorage.getItem(vidBestKey(v.yt, i)) || 0) >= 80).length;
    const hasTs = typeof VIDEO_TRANSCRIPTS !== "undefined" && VIDEO_TRANSCRIPTS[v.yt];
    const card = document.createElement("button");
    card.className = "video-card";
    card.innerHTML = `
      <span class="vc-thumb-wrap">
        <img class="vc-thumb" src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="" loading="lazy" />
        <span class="vc-cefr">${v.cefr}</span>
      </span>
      <span class="vc-info">
        <b>${v.title}</b>
        <span class="vc-zh">${v.zh}</span>
        <span class="vc-tags">${(v.tags || []).map((t) => `<i>#${t}</i>`).join("")}${hasTs ? '<i class="on">✔ 字幕</i>' : ""}</span>
        <span class="vc-meta">${lv.emoji} ${lv.name}・${sents.length ? `${sents.length} 句挑戰・已達標 ${done}/${sents.length}` : "字幕逐句挑戰"}</span>
      </span>`;
    card.addEventListener("click", () => openVideo(v));
    grid.appendChild(card);
  }
}

// ---------- 影片頁 ----------
function openVideo(v) {
  vid.video = v;
  vid.activeIdx = -1;
  $("#vd-title").textContent = v.title;
  // lite-embed:先顯示封面與自家播放鈕(頁面層級的點擊,手機/觸控環境可靠),
  // 點擊後才載入帶 autoplay 的 YouTube 播放器
  const frame = $("#vd-frame");
  frame.innerHTML = `
    <button class="vd-cover" aria-label="播放影片">
      <img src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="${v.title}" />
      <span class="vd-playbtn">▶</span>
      <span class="vd-cover-hint">點我播放</span>
    </button>`;
  frame.querySelector(".vd-cover").addEventListener("click", async () => {
    frame.innerHTML = `<div id="yt-player"></div>`;
    const apiOk = await loadYTApi();
    if (apiOk && window.YT?.Player) {
      // 用 IFrame API 建播放器 → 可同步文字稿、點句跳轉、自家控制列
      vid.player = new YT.Player("yt-player", {
        videoId: v.yt,
        host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: () => { $("#vd-controls").style.display = "flex"; },
          onStateChange: (e) => updatePlayBtn(e.data),
        },
      });
      startTsSync();
    } else {
      // API 載入失敗 → 一般 iframe(文字稿仍可讀,只是不同步)
      frame.innerHTML =
        `<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&playsinline=1&rel=0" title="${v.title}"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    }
  });
  $("#vd-open-yt").href = `https://youtu.be/${v.yt}`;
  $("#vd-controls").style.display = "none";
  vid.speed = 1;
  vid.loopIdx = -1;
  $("#vd-loop-bar").style.display = "none";
  $("#vd-speed").textContent = "⚡ 1.0x";
  renderTranscript(v);
  renderVideoSentences();
  showScreen("#screen-video");
}

// ---------- 自家播放控制列(點擊發生在我們頁面,觸控環境可靠)----------
function updatePlayBtn(state) {
  // YT.PlayerState: 1 = 播放中
  $("#vd-play").textContent = state === 1 ? "⏸ 暫停" : "▶ 播放";
}

function togglePlay() {
  const p = vid.player;
  if (!p?.getPlayerState) return;
  if (p.getPlayerState() === 1) p.pauseVideo();
  else p.playVideo();
}

function seekBy(sec) {
  const p = vid.player;
  if (!p?.getCurrentTime) return;
  p.seekTo(Math.max(0, p.getCurrentTime() + sec), true);
}

function cycleSpeed() {
  const p = vid.player;
  if (!p?.setPlaybackRate) return;
  const order = [1, 0.75, 0.5];
  vid.speed = order[(order.indexOf(vid.speed) + 1) % order.length];
  p.setPlaybackRate(vid.speed);
  $("#vd-speed").textContent = `⚡ ${vid.speed.toFixed(2).replace(/0$/, "")}x`;
}

// ============================================================
//  📜 同步文字稿 + 文法詞態
// ============================================================
const fmtTime = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function renderTranscript(v) {
  const card = $("#vd-ts-card");
  const box = $("#vd-transcript");
  const lines = (typeof VIDEO_TRANSCRIPTS !== "undefined" && VIDEO_TRANSCRIPTS[v.yt]) || null;
  vid.tsLines = lines || [];
  vid.tsActive = -1;
  if (!lines) { card.style.display = "none"; return; }
  card.style.display = "block";
  box.innerHTML = "";
  lines.forEach(([t, _d, text], i) => {
    const row = document.createElement("div");
    row.className = "ts-line";
    row.dataset.i = i;
    const wordsHtml = text.split(/([A-Za-z][A-Za-z']*)/g)
      .map((w) => (/^[A-Za-z][A-Za-z']*$/.test(w) ? `<span class="pw">${w}</span>` : w.replace(/</g, "&lt;")))
      .join("");
    row.innerHTML = `
      <button class="ts-time">${fmtTime(t)}</button>
      <span class="ts-text">${wordsHtml}</span>
      <span class="ts-tools">
        <button class="ts-tool ts-loop" title="單句循環">🔁</button>
        <button class="ts-tool ts-mic" title="這句口說挑戰">🎙️</button>
        <button class="ts-tool ts-star ${nbHasSentence(text) ? "on" : ""}" title="收藏這句">${nbHasSentence(text) ? "⭐" : "☆"}</button>
        <button class="ts-tool ts-gram" title="文法詞態解析">✍️</button>
      </span>
      <div class="ts-challenge" style="display:none"></div>`;
    row.querySelector(".ts-time").addEventListener("click", () => seekToLine(i));
    row.querySelectorAll(".pw").forEach((w) =>
      w.addEventListener("click", (e) => { e.stopPropagation(); showWordModal(w.textContent, { passage: { en: text } }); }));
    row.querySelector(".ts-gram").addEventListener("click", () => toggleGrammar(row, text));
    row.querySelector(".ts-loop").addEventListener("click", () => toggleLoop(i));
    row.querySelector(".ts-mic").addEventListener("click", (e) => {
      const box2 = row.querySelector(".ts-challenge");
      box2.style.display = "block";
      challengeSentence(text, box2, e.target);
    });
    row.querySelector(".ts-star").addEventListener("click", (e) => {
      const added = nbToggleSentence({
        en: text, zh: "", from: `${vid.video.title}・${fmtTime(t)}`,
        yt: vid.video.yt, t,
      });
      e.target.textContent = added ? "⭐" : "☆";
      e.target.classList.toggle("on", added);
    });
    box.appendChild(row);
  });
}

// 跳到某句(單句循環時同步切換循環目標)
function seekToLine(i) {
  const line = vid.tsLines[i];
  if (!line) return;
  vid.player?.seekTo?.(line[0] / 1000, true);
  vid.player?.playVideo?.();
}

// 🔁 單句循環:重複播放同一句直到關閉
function toggleLoop(i) {
  const box = $("#vd-transcript");
  const wasOn = vid.loopIdx === i;
  box.querySelectorAll(".ts-loop.on").forEach((b) => { b.classList.remove("on"); b.textContent = "🔁"; });
  if (wasOn) {
    vid.loopIdx = -1;
    $("#vd-loop-bar").style.display = "none";
    return;
  }
  vid.loopIdx = i;
  const btn = box.querySelector(`.ts-line[data-i="${i}"] .ts-loop`);
  if (btn) { btn.classList.add("on"); btn.textContent = "🔂"; }
  $("#vd-loop-bar").style.display = "flex";
  $("#vd-loop-text").textContent = `🔂 單句循環中:${vid.tsLines[i][2].slice(0, 42)}${vid.tsLines[i][2].length > 42 ? "…" : ""}`;
  seekToLine(i);
}

function stopLoop() {
  vid.loopIdx = -1;
  $("#vd-loop-bar").style.display = "none";
  $("#vd-transcript").querySelectorAll(".ts-loop.on").forEach((b) => { b.classList.remove("on"); b.textContent = "🔁"; });
}

// 播放同步:每 300ms 對時,亮起目前句、自動捲動
function startTsSync() {
  clearInterval(vid.syncTimer);
  if (!vid.tsLines.length) return;
  vid.syncTimer = setInterval(() => {
    const p = vid.player;
    if (!p?.getCurrentTime) return;
    const t = p.getCurrentTime() * 1000;
    // 單句循環:超出該句結尾就跳回句首
    if (vid.loopIdx >= 0) {
      const [start, dur] = vid.tsLines[vid.loopIdx];
      const end = start + (dur || 3000);
      if (t >= end || t < start - 500) { p.seekTo(start / 1000, true); return; }
    }
    let cur = -1;
    for (let i = 0; i < vid.tsLines.length; i++) {
      if (vid.tsLines[i][0] <= t) cur = i;
      else break;
    }
    if (cur !== vid.tsActive) {
      const box = $("#vd-transcript");
      box.querySelector(".ts-line.active")?.classList.remove("active");
      const row = box.querySelector(`.ts-line[data-i="${cur}"]`);
      if (row) {
        row.classList.add("active");
        if ($("#vd-follow").checked) row.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      vid.tsActive = cur;
    }
  }, 300);
}

// ---------- 詞態分析(離線)----------
const LEMMA_IRREG = {
  went: "go", gone: "go", was: "be", were: "be", is: "be", are: "be", am: "be", been: "be", being: "be",
  had: "have", has: "have", did: "do", does: "do", done: "do", said: "say", says: "say", made: "make",
  took: "take", taken: "take", got: "get", gotten: "get", came: "come", knew: "know", known: "know",
  thought: "think", found: "find", gave: "give", given: "give", told: "tell", became: "become",
  left: "leave", felt: "feel", kept: "keep", began: "begin", begun: "begin", brought: "bring",
  bought: "buy", saw: "see", seen: "see", ran: "run", spoke: "speak", spoken: "speak", wrote: "write",
  written: "write", stood: "stand", lost: "lose", met: "meet", paid: "pay", sat: "sit", spent: "spend",
  taught: "teach", grew: "grow", grown: "grow", drew: "draw", drawn: "draw", fell: "fall", fallen: "fall",
  held: "hold", heard: "hear", meant: "mean", led: "lead", built: "build", sent: "send", won: "win",
  wore: "wear", worn: "wear", chose: "choose", chosen: "choose", broke: "break", broken: "break",
  showed: "show", shown: "show", children: "child", men: "man", women: "woman",
  better: "good", best: "good", worse: "bad", worst: "bad",
};

function wordFormChips(text) {
  const dict = typeof OFFLINE_DICT !== "undefined" ? OFFLINE_DICT : {};
  const chips = [];
  const seen = new Set();
  for (const w of text.match(/[A-Za-z][A-Za-z']*/g) || []) {
    const lw = w.toLowerCase().replace(/'+$/, "");
    if (seen.has(lw)) continue;
    seen.add(lw);
    let base = LEMMA_IRREG[lw], why = base ? "不規則變化" : "";
    if (!base) {
      if (/ies$/.test(lw) && dict[lw.slice(0, -3) + "y"]) { base = lw.slice(0, -3) + "y"; why = "複數/三單 -ies"; }
      else if (/([a-z])\1ing$/.test(lw) && dict[lw.slice(0, -4)]) { base = lw.slice(0, -4); why = "V-ing(重複字尾)"; }
      else if (/ing$/.test(lw) && (dict[lw.slice(0, -3)] || dict[lw.slice(0, -3) + "e"])) { base = dict[lw.slice(0, -3)] ? lw.slice(0, -3) : lw.slice(0, -3) + "e"; why = "V-ing"; }
      else if (/ied$/.test(lw) && dict[lw.slice(0, -3) + "y"]) { base = lw.slice(0, -3) + "y"; why = "過去式 -ied"; }
      else if (/([a-z])\1ed$/.test(lw) && dict[lw.slice(0, -3)]) { base = lw.slice(0, -3); why = "過去式(重複字尾)"; }
      else if (/ed$/.test(lw) && (dict[lw.slice(0, -2)] || dict[lw.slice(0, -1)])) { base = dict[lw.slice(0, -2)] ? lw.slice(0, -2) : lw.slice(0, -1); why = "過去式/過去分詞 -ed"; }
      else if (/es$/.test(lw) && dict[lw.slice(0, -2)]) { base = lw.slice(0, -2); why = "複數/三單 -es"; }
      else if (/s$/.test(lw) && lw.length > 3 && dict[lw.slice(0, -1)]) { base = lw.slice(0, -1); why = "複數/三單 -s"; }
      else if (/est$/.test(lw) && (dict[lw.slice(0, -3)] || dict[lw.slice(0, -2)])) { base = dict[lw.slice(0, -3)] ? lw.slice(0, -3) : lw.slice(0, -2); why = "最高級 -est"; }
      else if (/er$/.test(lw) && dict[lw.slice(0, -2)] && dict[lw.slice(0, -2)].some((m) => m[0] === "adj.")) { base = lw.slice(0, -2); why = "比較級 -er"; }
    }
    if (base && base !== lw) {
      const pos = dict[base]?.[0]?.[0] || "";
      chips.push({ w, base, pos, why });
    }
  }
  return chips;
}

// ---------- 文法解析面板(離線詞態 + AI 深度解析,結果快取)----------
const hashStr = (s) => { let h = 5381; for (const c of s) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h.toString(36); };

function toggleGrammar(row, text) {
  let panel = row.nextElementSibling;
  if (panel?.classList.contains("ts-gram-panel")) {
    panel.remove();
    return;
  }
  panel = document.createElement("div");
  panel.className = "ts-gram-panel";
  const chips = wordFormChips(text);
  const chipsHtml = chips.length
    ? chips.map((c) => `<span class="wf-chip"><b>${c.w}</b> → ${c.base}<i>${c.pos ? c.pos + "・" : ""}${c.why}</i></span>`).join("")
    : `<span class="wf-none">此句沒有偵測到詞形變化(都是原形)</span>`;
  panel.innerHTML = `
    <div class="wf-label">🔤 詞態變化(離線分析)</div>
    <div class="wf-chips">${chipsHtml}</div>
    <button class="btn-mini-audio ts-ai-btn">🤖 AI 文法解析</button>
    <div class="ts-ai-out"></div>`;
  const cached = localStorage.getItem("ea_gram_" + hashStr(text));
  if (cached) panel.querySelector(".ts-ai-out").textContent = cached;
  panel.querySelector(".ts-ai-btn").addEventListener("click", (e) => aiGrammar(text, panel.querySelector(".ts-ai-out"), e.target));
  row.after(panel);
}

async function aiGrammar(text, outEl, btn) {
  const key = "ea_gram_" + hashStr(text);
  const cached = localStorage.getItem(key);
  if (cached) { outEl.textContent = cached; return; }
  btn.disabled = true;
  outEl.textContent = "AI 解析中…";
  const sys = "你是英語文法老師,對台灣學習者說明。回覆繁體中文,精簡條列(用 1) 2) 3) 開頭),不用 markdown 符號。";
  const user = `請解析這個英文句子:\n"${text}"\n1) 時態與句型結構(主詞、動詞、子句)\n2) 詞態變化:列出句中每個有變化的字(原形 → 變化形,並說明原因)\n3) 值得記的片語或搭配詞。每點最多兩行。`;
  try {
    const reply = (await callAI(sys, [{ role: "user", content: user }])).trim();
    outEl.textContent = reply;
    try { localStorage.setItem(key, reply); } catch { /* 空間滿就不快取 */ }
  } catch (e) {
    outEl.textContent = e.status === 429 ? "請求太頻繁,等幾秒再按一次。" : "AI 解析暫時無法使用,稍後再試。";
  }
  btn.disabled = false;
}

function renderVideoSentences() {
  const v = vid.video;
  const box = $("#vd-sentences");
  box.innerHTML = "";
  vidSentences(v).forEach((s, i) => {
    const best = +(localStorage.getItem(vidBestKey(v.yt, i)) || 0);
    const card = document.createElement("div");
    card.className = "vs-card";
    card.dataset.idx = i;
    // 句子逐字可點(共用單字彈窗)
    const wordsHtml = s.en.split(/([A-Za-z][A-Za-z']*)/g)
      .map((t) => (/^[A-Za-z][A-Za-z']*$/.test(t) ? `<span class="pw">${t}</span>` : t.replace(/</g, "&lt;")))
      .join("");
    card.innerHTML = `
      <div class="vs-en">${wordsHtml}</div>
      <div class="vs-zh">${s.zh}</div>
      <div class="vs-row">
        <button class="btn-mini-audio vs-play">🔊 原速</button>
        <button class="btn-mini-audio vs-slow">🐢 慢速</button>
        ${typeof s.t === "number" ? `<button class="btn-mini-audio vs-jump">▶ 影片 ${fmtTime(s.t)}</button>` : ""}
        <button class="btn-mini-audio vs-rec">🎙️ 口說挑戰</button>
        <button class="btn-mini-audio vs-star ${nbHasSentence(s.en) ? "on" : ""}">${nbHasSentence(s.en) ? "⭐" : "☆"} 收藏</button>
        <span class="vs-best ${best >= 80 ? "pass" : ""}">${best ? `最佳 ${best} 分${best >= 80 ? " ✅" : ""}` : ""}</span>
      </div>
      <div class="vs-result" style="display:none"></div>`;
    card.querySelectorAll(".pw").forEach((w) =>
      w.addEventListener("click", () => showWordModal(w.textContent, { passage: { en: s.en } })));
    card.querySelector(".vs-play").addEventListener("click", (e) => playAudio(vidAudio(v.yt, i, false), e.target));
    card.querySelector(".vs-slow").addEventListener("click", (e) => playAudio(vidAudio(v.yt, i, true), e.target));
    card.querySelector(".vs-rec").addEventListener("click", () => startSpeechChallenge(i));
    card.querySelector(".vs-jump")?.addEventListener("click", () => {
      vid.player?.seekTo?.(s.t / 1000, true);
      vid.player?.playVideo?.();
      $("#vd-frame").scrollIntoView({ block: "start", behavior: "smooth" });
    });
    card.querySelector(".vs-star").addEventListener("click", (e) => {
      const added = nbToggleSentence({
        en: s.en, zh: s.zh, from: `${v.title}・名句`, yt: v.yt, audio: vidAudio(v.yt, i, false),
      });
      e.target.textContent = added ? "⭐ 收藏" : "☆ 收藏";
      e.target.classList.toggle("on", added);
    });
    box.appendChild(card);
  });
}

// ---------- 口說挑戰 ----------
// 通用口說挑戰引擎:名句卡、字幕任一句、收藏句都共用
// opts: { bestKey, videoTitle, onScore }
function challengeSentence(target, resultBox, btn, opts = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const say = (msg) => { resultBox.style.display = "block"; resultBox.innerHTML = `<div class="vs-heard">${msg}</div>`; };
  if (!SR) { say("此瀏覽器不支援語音辨識,請改用 Chrome 或 Edge。"); return; }
  if (vid.recording) { vid.rec?.stop(); return; }

  audioPlayer.pause();
  speechSynthesis?.cancel?.();
  const label = btn.textContent;
  const setRec = (on) => {
    btn.textContent = on ? "⏹ 說完按我" : label;
    btn.classList.toggle("recording", on);
  };
  vid.recording = true;
  setRec(true);
  say("🔴 聆聽中…請唸出這句話(唸完停頓即結束)。");

  vid.rec = new SR();
  vid.rec.lang = "en-US";
  vid.rec.interimResults = false;
  vid.rec.maxAlternatives = 1;
  let heard = "";
  vid.rec.onresult = (e) => { heard = [...e.results].map((r) => r[0].transcript).join(" ").trim(); };
  vid.rec.onerror = (e) => {
    vid.recording = false;
    setRec(false);
    say(`⚠️ ${{ "not-allowed": "麥克風未授權,請允許權限後再試。", "no-speech": "沒有聽到聲音,再試一次。",
      "network": "語音辨識服務無法連線,請改用 Chrome/Edge。" }[e.error] || `辨識錯誤(${e.error})。`}`);
  };
  vid.rec.onend = () => {
    if (!vid.recording) return;
    vid.recording = false;
    setRec(false);
    if (!heard) { say("⚠️ 沒有辨識到內容,再按一次試試。"); return; }
    renderChallengeResult(target, heard, resultBox, opts);
  };
  try { vid.rec.start(); } catch { vid.recording = false; setRec(false); }
}

function renderChallengeResult(target, heard, box, opts) {
  const { score, matched, words } = scoreSpeech(target, heard);
  let prev = 0;
  if (opts.bestKey) {
    prev = +(localStorage.getItem(opts.bestKey) || 0);
    if (score > prev) localStorage.setItem(opts.bestKey, String(score));
  }
  const colored = words.map((w, k) => `<span class="${matched[k] ? "vw-ok" : "vw-miss"}">${w}</span>`).join(" ");
  const grade = score >= 90 ? "🌟 完美!" : score >= 80 ? "✅ 很好!" : score >= 60 ? "💪 再練一下" : "🔁 多聽幾次再挑戰";
  box.style.display = "block";
  box.innerHTML = `
    <div class="vs-score">${grade} <b>${score} 分</b>${opts.bestKey && score > prev ? '<span class="vs-new">新紀錄</span>' : ""}</div>
    <div class="vs-words">${colored}</div>
    <div class="vs-heard">🎧 辨識聽到:「${heard.replace(/</g, "&lt;")}」</div>
    <button class="btn-mini-audio vs-ai">🤖 AI 講評</button>
    <div class="vs-ai-out"></div>`;
  box.querySelector(".vs-ai").addEventListener("click", (e) =>
    aiSpeechFeedback(target, heard, box.querySelector(".vs-ai-out"), e.target, opts.videoTitle));
  opts.onScore?.(Math.max(score, prev));
}

// 名句卡的挑戰(帶最佳分數紀錄)
function startSpeechChallenge(i) {
  const v = vid.video;
  const card = $(`#vd-sentences .vs-card[data-idx="${i}"]`);
  const box = card.querySelector(".vs-result");
  challengeSentence(vidSentences(v)[i].en, box, card.querySelector(".vs-rec"), {
    bestKey: vidBestKey(v.yt, i),
    videoTitle: v.title,
    onScore: (best) => {
      const el = card.querySelector(".vs-best");
      el.textContent = `最佳 ${best} 分${best >= 80 ? " ✅" : ""}`;
      el.classList.toggle("pass", best >= 80);
    },
  });
}

// ---------- AI 口說講評(KIMI)----------
async function aiSpeechFeedback(target, heard, out, btn, videoTitle) {
  btn.disabled = true;
  out.textContent = "AI 講評中…";
  const system = "You are a friendly American English pronunciation coach for Taiwanese learners. Reply in Traditional Chinese, 2-4 short sentences, no markdown.";
  const user = `學習者正在跟讀${videoTitle ? `影片《${videoTitle}》的` : ""}句子。
目標句:"${target}"
語音辨識聽到:"${heard}"
請比較兩者:1) 指出可能唸錯或漏掉的字,給 KK 音標與嘴型/舌位建議;2) 一句具體的鼓勵。若兩者幾乎一致,稱讚並給一個讓語調更自然的小提示。`;
  try {
    const reply = await callAI(system, [{ role: "user", content: user }]);
    out.textContent = reply.trim();
  } catch (e) {
    out.textContent = e.status === 429 ? "請求太頻繁,等幾秒再按一次。" : "AI 講評暫時無法使用,稍後再試。";
  }
  btn.disabled = false;
}

// ---------- 綁定 ----------
document.addEventListener("DOMContentLoaded", () => {
  renderVideoFilters();
  renderVideos();
  $("#vd-loop-stop")?.addEventListener("click", stopLoop);
  $("#vd-play")?.addEventListener("click", togglePlay);
  $("#vd-back5")?.addEventListener("click", () => seekBy(-5));
  $("#vd-fwd5")?.addEventListener("click", () => seekBy(5));
  $("#vd-speed")?.addEventListener("click", cycleSpeed);
  $("#vd-exit")?.addEventListener("click", () => {
    vid.rec?.abort?.();
    vid.recording = false;
    clearInterval(vid.syncTimer);
    vid.player = null;
    vid.loopIdx = -1;
    $("#vd-loop-bar").style.display = "none";
    $("#vd-controls").style.display = "none";
    $("#vd-frame").innerHTML = "";   // 停止影片播放
    renderVideos();                   // 更新達標數
    goHome();
    switchTab("explore");
  });
});
