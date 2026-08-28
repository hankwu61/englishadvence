// ============================================================
//  📒 單字單句本(參考 VoiceTube)
//  收藏單字與句子 → 複習、聽發音、AI 造句練習
// ============================================================
"use strict";

const NB_KEY = "ea_notebook";
const nbState = { view: "words" };

function nbLoad() {
  try {
    const d = JSON.parse(localStorage.getItem(NB_KEY) || "{}");
    return { words: d.words || [], sentences: d.sentences || [] };
  } catch { return { words: [], sentences: [] }; }
}

function nbSave(data) {
  try { localStorage.setItem(NB_KEY, JSON.stringify(data)); } catch { /* 空間滿 */ }
  updateNbBadges();
}

const nbHasWord = (w) => nbLoad().words.some((x) => x.w.toLowerCase() === w.toLowerCase());
const nbHasSentence = (en) => nbLoad().sentences.some((x) => x.en === en);

// 加入 / 移除:單字
function nbToggleWord(entry) {
  const data = nbLoad();
  const i = data.words.findIndex((x) => x.w.toLowerCase() === entry.w.toLowerCase());
  if (i >= 0) data.words.splice(i, 1);
  else data.words.unshift({ ...entry, at: Date.now() });
  nbSave(data);
  return i < 0;   // true = 已加入
}

// 加入 / 移除:句子
function nbToggleSentence(entry) {
  const data = nbLoad();
  const i = data.sentences.findIndex((x) => x.en === entry.en);
  if (i >= 0) data.sentences.splice(i, 1);
  else data.sentences.unshift({ ...entry, at: Date.now() });
  nbSave(data);
  return i < 0;
}

function updateNbBadges() {
  const d = nbLoad();
  const el = $("#nb-count");
  if (el) el.textContent = `${d.words.length} 單字・${d.sentences.length} 句子`;
}

// ---------- 收藏本畫面 ----------
function openNotebook(view) {
  nbState.view = view || nbState.view;
  showScreen("#screen-notebook");
  renderNotebook();
}

function renderNotebook() {
  const d = nbLoad();
  $("#nb-tab-words").classList.toggle("active", nbState.view === "words");
  $("#nb-tab-sents").classList.toggle("active", nbState.view === "sentences");
  $("#nb-tab-words").textContent = `📗 單字 ${d.words.length}`;
  $("#nb-tab-sents").textContent = `📘 句子 ${d.sentences.length}`;
  const box = $("#nb-list");
  box.innerHTML = "";

  const items = nbState.view === "words" ? d.words : d.sentences;
  if (!items.length) {
    box.innerHTML = `<div class="nb-empty">還沒有收藏。<br>在課文、影片字幕或單字彈窗中點 ⭐ 即可加入這裡。</div>`;
    return;
  }

  items.forEach((it) => {
    const card = document.createElement("div");
    card.className = "nb-card";
    if (nbState.view === "words") {
      card.innerHTML = `
        <div class="nb-head">
          <span class="nb-word">${it.w}</span>
          <button class="btn-mini-audio nb-play">🔊</button>
          <button class="nb-del" title="移除">✕</button>
        </div>
        ${it.zh ? `<div class="nb-zh">${it.zh}</div>` : ""}
        ${it.def ? `<div class="nb-def">${it.def}</div>` : ""}
        ${it.sentence ? `<div class="nb-src">“${it.sentence}”</div>` : ""}`;
      card.querySelector(".nb-play").addEventListener("click", (e) =>
        playWordAudio(`audio/${it.w.toLowerCase()}.mp3`, e.target, it.w));
      card.querySelector(".nb-del").addEventListener("click", () => {
        nbToggleWord({ w: it.w }); renderNotebook();
      });
    } else {
      card.innerHTML = `
        <div class="nb-head">
          <span class="nb-sent">${it.en}</span>
          <button class="nb-del" title="移除">✕</button>
        </div>
        ${it.zh ? `<div class="nb-zh">${it.zh}</div>` : ""}
        <div class="nb-src">${it.from || ""}</div>
        <div class="nb-actions">
          <button class="btn-mini-audio nb-speak">🔊 朗讀</button>
          <button class="btn-mini-audio nb-shadow">🎙️ 跟讀挑戰</button>
        </div>
        <div class="nb-result"></div>`;
      card.querySelector(".nb-del").addEventListener("click", () => {
        nbToggleSentence({ en: it.en }); renderNotebook();
      });
      card.querySelector(".nb-speak").addEventListener("click", (e) => {
        if (it.audio) playAudio(it.audio, e.target);
        else speakEn(it.en);
      });
      card.querySelector(".nb-shadow").addEventListener("click", (e) =>
        challengeSentence(it.en, card.querySelector(".nb-result"), e.target));
    }
    box.appendChild(card);
  });
}

// 瀏覽器 TTS 朗讀(收藏句可能沒有預錄音檔)
function speakEn(text, btn) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.92;
  if (btn) { btn.classList.add("playing"); u.onend = () => btn.classList.remove("playing"); }
  speechSynthesis.speak(u);
}

document.addEventListener("DOMContentLoaded", () => {
  updateNbBadges();
  $("#nb-tab-words")?.addEventListener("click", () => { nbState.view = "words"; renderNotebook(); });
  $("#nb-tab-sents")?.addEventListener("click", () => { nbState.view = "sentences"; renderNotebook(); });
  $("#nb-exit")?.addEventListener("click", goHome);
});
