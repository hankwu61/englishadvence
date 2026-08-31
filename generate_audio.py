# -*- coding: utf-8 -*-
"""用 Edge TTS 預先產生所有發音檔。

- 單字        js/words.js         -> audio/<word>.mp3            (語速 -10%)
- 語塊        js/collocations.js  -> audio/c_<slug>.mp3          (語速 -10%)
- 例句(正常) js/collocations.js  -> audio/s_<slug>.mp3          (語速 +0%)
- 例句(慢速) js/collocations.js  -> audio/s_<slug>_slow.mp3     (語速 -30%,跟讀用)

用法: python generate_audio.py    (已存在的檔案自動跳過)
"""
import asyncio
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "audio"
VOICE = "en-US-JennyNeural"
CONCURRENCY = 8


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", text.lower())


def load_tasks() -> list[tuple[str, str, str]]:
    """回傳 (要念的文字, 檔名, 語速) 清單"""
    tasks: list[tuple[str, str, str]] = []

    words_js = (ROOT / "js" / "words.js").read_text(encoding="utf-8")
    for w in re.findall(r'\{ w: "([^"]+)"', words_js):
        tasks.append((w, f"{w}.mp3", "-10%"))

    vowels_js = (ROOT / "js" / "vowels.js").read_text(encoding="utf-8")
    for m in re.finditer(r'\["([A-Za-z]+)", "([A-Za-z]+)"\]', vowels_js):
        for w in m.groups():
            tasks.append((w, f"{w.lower()}.mp3", "-10%"))

    for lesson_file in sorted((ROOT / "js").glob("lessons*.js")):
        lessons_js = lesson_file.read_text(encoding="utf-8")
        # 課文(原速 + 慢速)
        for aid, en in re.findall(r'aid: "(p_\w+)",\s*title: "[^"]*",\s*en: "((?:[^"\\]|\\.)*)"', lessons_js):
            text = en.replace('\\"', '"').replace("\\'", "'")
            tasks.append((text, f"{aid}.mp3", "+0%"))
            tasks.append((text, f"{aid}_slow.mp3", "-25%"))
        # 發音練習的播放單字(可能含新字)
        for w in re.findall(r'\{ play: "([A-Za-z\']+)"', lessons_js):
            tasks.append((w, f"{w.lower()}.mp3", "-10%"))
        # 課文中每一個單字(點字彈窗的發音用)
        for _aid, en in re.findall(r'aid: "(p_\w+)",\s*title: "[^"]*",\s*en: "((?:[^"\\]|\\.)*)"', lessons_js):
            text = en.replace('\\"', '"').replace("\\'", "'")
            for token in re.findall(r"[A-Za-z][A-Za-z']*", text):
                token = token.rstrip("'").lower()
                if len(token) >= 1:
                    tasks.append((token, f"{token}.mp3", "-10%"))

    # 影片名句(原速 + 慢速)+ 句中每個單字
    def add_sentence(yt: str, i: int, text: str):
        tasks.append((text, f"v_{yt}_{i}.mp3", "+0%"))
        tasks.append((text, f"v_{yt}_{i}_slow.mp3", "-25%"))
        for token in re.findall(r"[A-Za-z][A-Za-z']*", text):
            token = token.rstrip("'").lower()
            tasks.append((token, f"{token}.mp3", "-10%"))

    videos_js = (ROOT / "js" / "videos.js").read_text(encoding="utf-8")
    for m in re.finditer(r'yt: "([\w-]+)".*?sentences: \[(.*?)\]\s*,?\s*\}', videos_js, re.S):
        yt, block = m.group(1), m.group(2)
        for i, sm in enumerate(re.finditer(r'\{ en: "((?:[^"\\]|\\.)*)"', block)):
            add_sentence(yt, i, sm.group(1).replace('\\"', '"').replace("\\'", "'"))

    # 從字幕擷取的名句(build_video_sentences.py 產生)
    vs_path = ROOT / "js" / "video_sentences.js"
    if vs_path.exists():
        import json as _json
        m = re.search(r"const VIDEO_SENTENCES = (\{.*\});", vs_path.read_text(encoding="utf-8"), re.S)
        if m:
            for yt, items in _json.loads(m.group(1)).items():
                for i, it in enumerate(items):
                    add_sentence(yt, i, it["en"])

    conn_js = (ROOT / "js" / "connected.js").read_text(encoding="utf-8")
    for cid, s in re.findall(r'\{ id: "(conn_\d+)", mech: "\w+", s: "((?:[^"\\]|\\.)*)"', conn_js):
        text = s.replace('\\"', '"').replace("\\'", "'")
        tasks.append((text, f"m_{cid}.mp3", "+0%"))
        tasks.append((text, f"m_{cid}_slow.mp3", "-30%"))

    colloc_js = (ROOT / "js" / "collocations.js").read_text(encoding="utf-8")
    for v, rest, ex in re.findall(
        r'\{ v: "([^"]+)", rest: "([^"]+)",.*?ex: "((?:[^"\\]|\\.)*)"', colloc_js
    ):
        chunk = f"{v} {rest}"
        s = slug(chunk)
        ex_text = ex.replace('\\"', '"').replace("\\'", "'")
        tasks.append((chunk, f"c_{s}.mp3", "-10%"))
        tasks.append((ex_text, f"s_{s}.mp3", "+0%"))
        tasks.append((ex_text, f"s_{s}_slow.mp3", "-30%"))


    # 多益 TOEIC:單字、Part 2 問答(問題=男聲/回應=女聲)、聽力段落(M=Guy、W=Jenny)
    toeic_path = ROOT / "js" / "toeic_data.js"
    if toeic_path.exists():
        tj = toeic_path.read_text(encoding="utf-8")
        for w in re.findall(r'\{ w: "([A-Za-z]+)"', tj):
            tasks.append((w, f"{w.lower()}.mp3", "-10%"))
        p2 = re.search(r"TOEIC_PART2 = \[(.*?)\n\];", tj, re.S)
        if p2:
            for i, m2 in enumerate(re.finditer(r'q: "((?:[^"\\]|\\.)*)",\s*r: \[(.*?)\]', p2.group(1), re.S)):
                tasks.append((m2.group(1), f"t2q_{i}.mp3", "+0%", "en-US-GuyNeural"))
                for j, resp in enumerate(re.findall(r'"((?:[^"\\]|\\.)*)"', m2.group(2))):
                    tasks.append((resp, f"t2r_{i}_{j}.mp3", "+0%", "en-US-JennyNeural"))
        for sm in re.finditer(r'id: "(\w+)", part:.*?lines: \[(.*?)\],\s*questions', tj, re.S):
            sid, block = sm.group(1), sm.group(2)
            for k, lm in enumerate(re.finditer(r'\{ sp: "([MW])", en: "((?:[^"\\]|\\.)*)"', block)):
                v = "en-US-GuyNeural" if lm.group(1) == "M" else "en-US-JennyNeural"
                tasks.append((lm.group(2), f"t3_{sid}_{k}.mp3", "+0%", v))


    # 托福 TOEFL:學術字彙、聽力逐句(M=Guy、W=Jenny)、口說示範回答、閱讀文章逐字
    toefl_path = ROOT / "js" / "toefl_data.js"
    if toefl_path.exists():
        fj = toefl_path.read_text(encoding="utf-8")
        for w in re.findall(r'\{ w: "([A-Za-z]+)"', fj):
            tasks.append((w, f"{w.lower()}.mp3", "-10%"))
        for sm in re.finditer(r'id: "(\w+)", kind:.*?lines: \[(.*?)\],\s*questions', fj, re.S):
            sid, block = sm.group(1), sm.group(2)
            for k, lm in enumerate(re.finditer(r'\{ sp: "([MW])", en: "((?:[^"\\]|\\.)*)"', block)):
                v = "en-US-GuyNeural" if lm.group(1) == "M" else "en-US-JennyNeural"
                tasks.append((lm.group(2).replace('\\"', '"'), f"tf3_{sid}_{k}.mp3", "+0%", v))
        for sm in re.finditer(r'id: "(sp\d+)".*?sample: "((?:[^"\\]|\\.)*)"', fj, re.S):
            tasks.append((sm.group(2).replace('\\"', '"'), f"tfs_{sm.group(1)}.mp3", "+0%"))
        for pm in re.finditer(r'id: "(rd\d+)".*?text: "((?:[^"\\]|\\.)*)"', fj, re.S):
            text = pm.group(2).replace("\\n", " ").replace('\\"', '"')
            for token in re.findall(r"[A-Za-z][A-Za-z']*", text):
                token = token.rstrip("'").lower()
                tasks.append((token, f"{token}.mp3", "-10%"))


    # 雅思 IELTS:核心字彙、聽力逐句(M=Guy、W=Jenny)、Part 2 示範回答、閱讀文章逐字
    ielts_path = ROOT / "js" / "ielts_data.js"
    if ielts_path.exists():
        ij = ielts_path.read_text(encoding="utf-8")
        for w in re.findall(r'\{ w: "([A-Za-z]+)"', ij):
            tasks.append((w, f"{w.lower()}.mp3", "-10%"))
        for sm in re.finditer(r'id: "(\w+)", section:.*?lines: \[(.*?)\],\s*questions', ij, re.S):
            sid, block = sm.group(1), sm.group(2)
            for k, lm in enumerate(re.finditer(r'\{ sp: "([MW])", en: "((?:[^"\\]|\\.)*)"', block)):
                v = "en-US-GuyNeural" if lm.group(1) == "M" else "en-US-JennyNeural"
                tasks.append((lm.group(2).replace('\\"', '"'), f"ie3_{sid}_{k}.mp3", "+0%", v))
        for sm in re.finditer(r'id: "(cue\d+)".*?sample: "((?:[^"\\]|\\.)*)"', ij, re.S):
            tasks.append((sm.group(2).replace('\\"', '"'), f"ies_{sm.group(1)}.mp3", "+0%"))
        for pm in re.finditer(r'id: "(ir\d+)".*?text: "((?:[^"\\]|\\.)*)"', ij, re.S):
            text = pm.group(2).replace("\\n", " ").replace('\\"', '"')
            for token in re.findall(r"[A-Za-z][A-Za-z']*", text):
                token = token.rstrip("'").lower()
                tasks.append((token, f"{token}.mp3", "-10%"))

    # 去重(單字可能跨表重複)
    seen: set[str] = set()
    out = []
    for t in tasks:
        if t[1] not in seen:
            seen.add(t[1])
            out.append(t)
    return out


async def gen_one(sem: asyncio.Semaphore, text: str, fname: str, rate: str, voice: str = VOICE):
    dest = AUDIO_DIR / fname
    if dest.exists() and dest.stat().st_size > 0:
        return None
    async with sem:
        for attempt in range(3):
            try:
                tts = edge_tts.Communicate(text, voice, rate=rate)
                await tts.save(str(dest))
                if dest.stat().st_size > 0:
                    return fname
            except Exception as e:
                if attempt == 2:
                    print(f"FAILED {fname}: {e}", flush=True)
                    return None
                await asyncio.sleep(1 + attempt)
    return None


async def main() -> None:
    AUDIO_DIR.mkdir(exist_ok=True)
    tasks = load_tasks()
    print(f"total files: {len(tasks)}", flush=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    done = 0
    for coro in asyncio.as_completed([gen_one(sem, *t) for t in tasks]):
        result = await coro
        done += 1
        if result:
            print(f"[{done}/{len(tasks)}] {result}", flush=True)
    missing = [t[1] for t in tasks if not (AUDIO_DIR / t[1]).exists()]
    print(f"done. missing: {len(missing)} {missing}", flush=True)


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
