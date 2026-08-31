# -*- coding: utf-8 -*-
"""重新產生所有課文音檔,同時擷取 Edge TTS 的 WordBoundary 事件,
輸出 js/timings.js(const PASSAGE_TIMINGS = {aid: [[ms, word], ...]}),
供課文朗讀時逐字 highlight 使用。

音檔與時間戳在同一次串流中產生,保證完全同步。
用法: python generate_timings.py
"""
import asyncio
import json
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "audio"
VOICE = "en-US-JennyNeural"
CONCURRENCY = 8


def load_passages() -> list[tuple[str, str]]:
    out = []
    for f in sorted((ROOT / "js").glob("lessons*.js")):
        text = f.read_text(encoding="utf-8")
        for aid, en in re.findall(r'aid: "(p_\w+)",\s*title: "[^"]*",\s*en: "((?:[^"\\]|\\.)*)"', text):
            out.append((aid, en.replace('\\"', '"').replace("\\'", "'")))
    # 多益 13 大情境課文(aid = p_ts_<id>)
    scenes = ROOT / "js" / "toeic_scenes.js"
    if scenes.exists():
        text = scenes.read_text(encoding="utf-8")
        for sid, en in re.findall(r'id: "(\w+)", no: \d+,.*?text: "((?:[^"\\]|\\.)*)"', text, re.S):
            out.append((f"p_ts_{sid}", en.replace('\\"', '"').replace("\\'", "'")))
    return out


def load_existing() -> dict:
    """讀入既有的 js/timings.js,讓本次只補產缺少的軌道。"""
    path = ROOT / "js" / "timings.js"
    if not path.exists():
        return {}
    m = re.search(r"const PASSAGE_TIMINGS = (\{.*\});", path.read_text(encoding="utf-8"), re.S)
    return json.loads(m.group(1)) if m else {}


async def gen_one(sem: asyncio.Semaphore, key: str, text: str, rate: str):
    """回傳 (key, [[ms, word], ...]);同時寫出 audio/<key>.mp3"""
    async with sem:
        for attempt in range(3):
            try:
                tts = edge_tts.Communicate(text, VOICE, rate=rate, boundary="WordBoundary")
                audio = bytearray()
                marks = []
                async for chunk in tts.stream():
                    if chunk["type"] == "audio":
                        audio.extend(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        marks.append([round(chunk["offset"] / 10000), chunk["text"]])
                if audio and marks:
                    (AUDIO_DIR / f"{key}.mp3").write_bytes(bytes(audio))
                    return key, marks
            except Exception as e:
                if attempt == 2:
                    print(f"FAILED {key}: {e}", flush=True)
                    return key, None
                await asyncio.sleep(1 + attempt)
    return key, None


async def main() -> None:
    AUDIO_DIR.mkdir(exist_ok=True)
    passages = load_passages()
    jobs = []
    for aid, en in passages:
        jobs.append((aid, en, "+0%"))
        jobs.append((f"{aid}_slow", en, "-25%"))
    print(f"total tracks: {len(jobs)}", flush=True)

    # 增量產生:已有時間戳且音檔存在的軌道直接沿用
    timings: dict[str, list] = load_existing()
    keep = {k: v for k, v in timings.items() if (AUDIO_DIR / f"{k}.mp3").exists()}
    jobs = [j for j in jobs if j[0] not in keep]
    timings = keep
    print(f"reusing: {len(keep)} tracks | to generate: {len(jobs)}", flush=True)

    sem = asyncio.Semaphore(CONCURRENCY)
    done = 0
    for coro in asyncio.as_completed([gen_one(sem, k, t, r) for k, t, r in jobs]):
        key, marks = await coro
        done += 1
        if marks:
            timings[key] = marks
            print(f"[{done}/{len(jobs)}] {key} ({len(marks)} words)", flush=True)

    payload = json.dumps(timings, ensure_ascii=False, separators=(",", ":"))
    (ROOT / "js" / "timings.js").write_text(
        "// 自動產生:課文逐字時間戳(ms)— generate_timings.py\n"
        f"const PASSAGE_TIMINGS = {payload};\n",
        encoding="utf-8",
    )
    missing = [k for k, _, _ in jobs if k not in timings]
    print(f"done. missing: {len(missing)} {missing}", flush=True)


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
