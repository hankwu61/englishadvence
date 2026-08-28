# -*- coding: utf-8 -*-
"""為 videos.js 中 sentences 為空的影片,從真實字幕擷取 5 句口說練習句,
用 KIMI 翻成繁體中文,輸出 js/video_sentences.js:
  const VIDEO_SENTENCES = { "<ytid>": [{en, zh, t}], ... };

好處:句子是影片真實說過的話(附時間戳可跳轉),不會出現憑印象誤引的情況。
用法: python build_video_sentences.py
"""
import json
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
API_URL = "https://api.moonshot.cn/v1/chat/completions"
API_KEY = os.environ.get("KIMI_API_KEY", "")   # 執行前先設定環境變數 KIMI_API_KEY
MODEL = "kimi-k2.6"
PER_VIDEO = 5           # 每支影片擷取的練習句數(維持精簡)
MIN_WORDS, MAX_WORDS = 7, 16


def load_json_block(path: Path, varname: str) -> dict:
    text = path.read_text(encoding="utf-8")
    m = re.search(rf"const {varname} = (\{{.*\}});\s*$", text, re.S)
    return json.loads(m.group(1)) if m else {}


def load_targets() -> list[tuple[str, str]]:
    """回傳 sentences 為空的 (ytid, title)"""
    text = (ROOT / "js" / "videos.js").read_text(encoding="utf-8")
    out = []
    # (?:(?!yt: ).)*? 確保比對不跨越到下一筆影片
    pattern = r'yt: "([\w-]+)"(?:(?!yt: ).)*?title: "([^"]+)"(?:(?!yt: ).)*?sentences: \[\s*\]'
    for m in re.finditer(pattern, text, re.S):
        out.append((m.group(1), m.group(2)))
    return out


def extract_sentences(lines: list) -> list[tuple[int, str]]:
    """把字幕行接成完整句子,挑出長度適中、適合口說練習的句子(平均分散全片)"""
    buf, sentences = "", []          # sentences: (startMs, text)
    start = lines[0][0] if lines else 0
    for t, _d, text in lines:
        text = re.sub(r"\[[^\]]*\]", " ", text).strip()   # 去掉 [Music] 等標記
        if not text:
            continue
        if not buf:
            start = t
        buf = (buf + " " + text).strip()
        while True:
            m = re.search(r"[.!?]+[\"']?\s", buf + " ")
            if not m:
                break
            sent = buf[: m.end()].strip()
            buf = buf[m.end():].strip()
            sentences.append((start, sent))
            start = t

    good = []
    for t, s in sentences:
        s = re.sub(r"\s+", " ", s).strip()
        words = s.split()
        if not (MIN_WORDS <= len(words) <= MAX_WORDS):
            continue
        if not re.match(r"^[A-Z]", s) or not re.search(r"[.!?]$", s):
            continue
        if re.search(r"\b(applause|laughter|music)\b", s, re.I):
            continue
        if s.count(",") > 2:                       # 太複雜的長句不利跟讀
            continue
        good.append((t, s))

    # 備援:自動字幕常無標點,改用固定長度切塊
    if not good:
        chunk_words, chunk_start = [], None
        for t, _d, text in lines:
            text = re.sub(r"\[[^\]]*\]", " ", text).strip()
            if not text:
                continue
            if chunk_start is None:
                chunk_start = t
            chunk_words += text.split()
            if len(chunk_words) >= 11:
                s = " ".join(chunk_words[:11])
                good.append((chunk_start, s[0].upper() + s[1:] + ("" if s.endswith((".", "!", "?")) else ".")))
                chunk_words, chunk_start = [], None

    if len(good) <= PER_VIDEO:
        return good
    step = len(good) / PER_VIDEO                    # 平均分散於全片
    return [good[int(i * step)] for i in range(PER_VIDEO)]


def translate(title: str, sents: list[str]) -> list[str]:
    numbered = "\n".join(f"{i+1}. {s}" for i, s in enumerate(sents))
    body = {
        "model": MODEL,
        "max_tokens": 2000,
        "thinking": {"type": "disabled"},
        "messages": [
            {"role": "system", "content": "你是英翻中譯者。只輸出 JSON 陣列,不要解釋。"},
            {"role": "user", "content":
                f"以下是影片《{title}》的句子,請翻成自然的繁體中文(台灣用語),"
                f"輸出 JSON 字串陣列,順序與編號一致:\n{numbered}"},
        ],
    }
    req = urllib.request.Request(
        API_URL, data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                content = json.loads(r.read())["choices"][0]["message"]["content"]
            m = re.search(r"\[.*\]", content, re.S)
            arr = json.loads(m.group(0)) if m else []
            if len(arr) == len(sents):
                return [str(x) for x in arr]
            print(f"    translation count mismatch ({len(arr)}/{len(sents)}), retry", flush=True)
        except Exception as e:
            print(f"    translate attempt {attempt}: {e}", flush=True)
        time.sleep(25)                              # 組織限速 3 RPM
    return [""] * len(sents)


def main() -> None:
    if not API_KEY:
        print("請先設定環境變數 KIMI_API_KEY(或改用其他 OpenAI 相容服務的金鑰)後再執行。", flush=True)
        return 1
    transcripts = load_json_block(ROOT / "js" / "transcripts.js", "VIDEO_TRANSCRIPTS")
    targets = load_targets()
    out_path = ROOT / "js" / "video_sentences.js"
    existing = load_json_block(out_path, "VIDEO_SENTENCES") if out_path.exists() else {}
    result = dict(existing)

    for ytid, title in targets:
        if ytid in result and result[ytid]:
            print(f"skip {ytid} (already built)", flush=True)
            continue
        lines = transcripts.get(ytid)
        if not lines:
            print(f"{ytid}: no transcript, skipped", flush=True)
            continue
        picked = extract_sentences(lines)
        if not picked:
            print(f"{ytid}: no suitable sentence", flush=True)
            continue
        print(f"{ytid} ({title}): {len(picked)} sentences → translating", flush=True)
        zhs = translate(title, [s for _t, s in picked])
        result[ytid] = [{"en": s, "zh": zh, "t": t} for (t, s), zh in zip(picked, zhs)]
        for (t, s), zh in zip(picked, zhs):
            print(f"    [{t//60000}:{t//1000%60:02d}] {s[:56]} | {zh[:30]}", flush=True)
        payload = json.dumps(result, ensure_ascii=False, separators=(",", ":"))
        out_path.write_text(
            "// 自動產生:從影片字幕擷取的口說練習句(附時間戳)— build_video_sentences.py\n"
            f"const VIDEO_SENTENCES = {payload};\n", encoding="utf-8")
        time.sleep(22)                              # 避開 3 RPM 限速

    print(f"done. {len(result)} videos with sentences", flush=True)


if __name__ == "__main__":
    sys.exit(main())
