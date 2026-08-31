// ============================================================
//  📷 多益 Part 1 照片描述 - 作答流程
//  依實測形式:四個描述只播不印,選 A/B/C/D;作答後才揭露句子與陷阱分析
// ============================================================
"use strict";

const tp1 = { queue: [], idx: 0, score: 0, order: [], answered: false };

function startToeicP1() {
  audioPlayer.pause();
  if (typeof stopReadAlong === "function") stopReadAlong();
  toeic.view = "p1";
  tp1.queue = shuffle(TOEIC_PART1.slice()).slice(0, 6);
  tp1.idx = 0;
  tp1.score = 0;
  renderToeicP1();
}

// 依畫面上的 A/B/C/D 順序依序播放四個描述
function playP1Sequence(item, btn) {
  const files = tp1.order.map((j) => `audio/t1_${item.id}_${j}.mp3`);
  let i = 0;
  btn?.classList.add("playing");
  const marks = [...document.querySelectorAll(".p1-opt")];
  const next = () => {
    marks.forEach((m) => m.classList.remove("now"));
    if (i >= files.length) { btn?.classList.remove("playing"); audioPlayer.onended = null; return; }
    marks[i]?.classList.add("now");
    audioPlayer.src = files[i++];
    audioPlayer.onended = next;
    audioPlayer.play().catch(() => { btn?.classList.remove("playing"); });
  };
  audioPlayer.pause();
  next();
}

function renderToeicP1() {
  const item = tp1.queue[tp1.idx];
  tp1.order = shuffle([0, 1, 2, 3]);
  tp1.answered = false;
  $("#toeic-sub").textContent = `📷 Part 1 照片描述・第 ${tp1.idx + 1} / ${tp1.queue.length} 題`;
  const letters = ["A", "B", "C", "D"];
  toeicBox().innerHTML = `
    <div class="practice-panel">
      <div class="steps-tip">看照片,聽四個描述(<b>正式考試不會印出句子</b>),選出最貼切的一句。可重播,也可單獨重聽某一個選項。</div>
      <div class="p1-photo" id="p1-photo">${item.svg}</div>
      <div class="practice-actions"><button id="p1-play" class="btn-audio">🔊 播放四個描述</button></div>
      <div id="p1-opts" class="p1-opts">
        ${letters.map((L, k) => `
          <div class="p1-opt" data-k="${k}">
            <button class="p1-pick">${L}</button>
            <button class="btn-mini-audio p1-listen">🔊</button>
            <div class="p1-text"></div>
            <div class="p1-why"></div>
          </div>`).join("")}
      </div>
      <div id="p1-fb" class="feedback"></div>
      <div id="p1-note" class="feedback-def"></div>
      <div class="practice-actions"><button id="p1-next" class="btn-primary" style="display:none">下一題 →</button></div>
    </div>`;

  // 若 images/part1/<id>.jpg 存在就換成真實照片,否則保留 SVG 佔位圖
  if (item.img) {
    const probe = new Image();
    probe.onload = () => {
      const box = $("#p1-photo");
      if (box && toeic.view === "p1" && tp1.queue[tp1.idx]?.id === item.id) {
        box.innerHTML = `<img class="p1-img" src="${item.img}" alt="${item.zh}">`;
      }
    };
    probe.src = item.img;
  }

  $("#p1-play").addEventListener("click", () => playP1Sequence(item, $("#p1-play")));
  playP1Sequence(item, $("#p1-play"));

  const rows = [...document.querySelectorAll(".p1-opt")];
  rows.forEach((row, k) => {
    const j = tp1.order[k];                       // 該位置對應的原始選項索引
    row.querySelector(".p1-listen").addEventListener("click", (e) =>
      playAudio(`audio/t1_${item.id}_${j}.mp3`, e.target));
    row.querySelector(".p1-pick").addEventListener("click", () => {
      if (tp1.answered) return;
      tp1.answered = true;
      audioPlayer.pause();
      const right = j === 0;
      if (right) tp1.score++;
      rows.forEach((r, k2) => {
        const j2 = tp1.order[k2];
        r.querySelector(".p1-pick").disabled = true;
        r.classList.remove("now");
        r.classList.add(j2 === 0 ? "correct" : (r === row ? "wrong" : "dim"));
        r.querySelector(".p1-text").textContent = item.opts[j2];
        r.querySelector(".p1-why").textContent = item.why[j2];
      });
      $("#p1-fb").textContent = right ? "✅ 正確!" : `❌ 正解:${item.opts[0]}`;
      $("#p1-fb").className = "feedback " + (right ? "good" : "bad");
      $("#p1-note").textContent = "📌 " + item.note;
      $("#p1-next").style.display = "inline-block";
    });
  });

  $("#p1-next").addEventListener("click", () => {
    tp1.idx++;
    if (tp1.idx < tp1.queue.length) renderToeicP1();
    else {
      audioPlayer.pause();
      const pct = Math.round((tp1.score / tp1.queue.length) * 100);
      toeicSave("p1", pct);
      toeicBox().innerHTML = `
        <div class="result-panel">
          <div class="result-emoji">${pct >= 80 ? "🏆" : "📷"}</div>
          <div class="result-title ${pct >= 60 ? "win" : "lose"}">${pct}%</div>
          <div class="game-subtitle">答對 ${tp1.score} / ${tp1.queue.length} 題,已記錄最佳成績</div>
          <div class="result-actions">
            <button class="btn-primary" onclick="startToeicP1()">再練一輪</button>
            <button class="btn-secondary" onclick="renderToeicHub()">回多益專區</button>
          </div>
        </div>`;
    }
  });
}
