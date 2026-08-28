# -*- coding: utf-8 -*-
"""用 yt-dlp 抓取 videos.js 中每支影片的英文字幕(優先人工字幕,無則自動字幕),
解析 json3 為逐行時間軸,輸出 js/transcripts.js:
  const VIDEO_TRANSCRIPTS = { "<ytid>": [[startMs, durMs, "text"], ...], ... };

用法: python fetch_transcripts.py   (需 pip install yt-dlp)
"""
import json
import re
import sys
import time
from pathlib import Path

import yt_dlp

ROOT = Path(__file__).parent


def load_video_ids() -> list[str]:
    text = (ROOT / "js" / "videos.js").read_text(encoding="utf-8")
    return re.findall(r'yt: "([\w-]+)"', text)


def parse_json3(data: dict) -> list[list]:
    lines = []
    for ev in data.get("events", []):
        if ev.get("aAppend"):          # ASR 滾動視窗的附加事件,略過
            continue
        segs = ev.get("segs")
        if not segs:
            continue
        text = "".join(s.get("utf8", "") for s in segs)
        text = re.sub(r"\s+", " ", text).strip()
        if not text or text in ("[Music]", "[Applause]", "[Laughter]"):
            continue
        lines.append([int(ev.get("tStartMs", 0)), int(ev.get("dDurationMs", 0)), text])
    return lines


def fetch_one(ytid: str) -> list[list] | None:
    opts = {
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en", "en-orig"],
        "subtitlesformat": "json3",
        "quiet": True,
        "no_warnings": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={ytid}", download=False)
    # 優先人工字幕,其次自動字幕
    for source in (info.get("subtitles") or {}, info.get("automatic_captions") or {}):
        for lang in ("en", "en-orig"):
            for fmt in source.get(lang, []):
                if fmt.get("ext") == "json3":
                    import urllib.request
                    req = urllib.request.Request(fmt["url"], headers={"User-Agent": "Mozilla/5.0"})
                    for attempt in range(4):
                        try:
                            with urllib.request.urlopen(req, timeout=30) as r:
                                body = r.read().decode("utf-8", "ignore")
                            if body:
                                return parse_json3(json.loads(body))
                        except Exception as e:
                            print(f"  {ytid} {lang} attempt {attempt}: {e}", flush=True)
                            time.sleep(4 * (attempt + 1))
    return None


def main() -> None:
    ids = load_video_ids()
    out: dict[str, list] = {}
    for ytid in ids:
        print(f"fetching {ytid} ...", flush=True)
        try:
            lines = fetch_one(ytid)
        except Exception as e:
            print(f"  FAILED: {e}", flush=True)
            lines = None
        if lines:
            out[ytid] = lines
            print(f"  ok: {len(lines)} lines", flush=True)
        else:
            print(f"  no transcript for {ytid}", flush=True)
        time.sleep(3)   # 避開 429

    payload = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    (ROOT / "js" / "transcripts.js").write_text(
        "// 自動產生:影片英文字幕時間軸(ms)— fetch_transcripts.py(yt-dlp)\n"
        f"const VIDEO_TRANSCRIPTS = {payload};\n",
        encoding="utf-8",
    )
    size_kb = (ROOT / "js" / "transcripts.js").stat().st_size // 1024
    print(f"done. {len(out)}/{len(ids)} videos, {size_kb} KB", flush=True)


if __name__ == "__main__":
    sys.exit(main())
