# -*- coding: utf-8 -*-
"""建置全離線英英詞典 js/dictionary.js。

- 掃描所有課文(js/lessons*.js)的單字
- 用 WordNet(morphy 詞形還原)取每字最多 3 個義項:[詞性, 英英釋義, 例句?]
- WordNet 不收的功能詞(冠詞、介係詞、助動詞…)用內建補充定義
- 直接以「課文中出現的表層字形」為 key(bought、women 都查得到)

用法: python build_dictionary.py   (需 pip install nltk)
"""
import json
import re
import sys
from pathlib import Path

import nltk

nltk.download("wordnet", quiet=True)
from nltk.corpus import wordnet as wn  # noqa: E402

ROOT = Path(__file__).parent
POS_LABEL = {"n": "n.", "v": "v.", "a": "adj.", "s": "adj.", "r": "adv."}

# WordNet 不涵蓋的功能詞/高頻詞(手寫英英定義)
FUNCTION_WORDS = {
    "the": [["art.", "used before a noun to refer to a specific person or thing", "the book on the table"]],
    "a": [["art.", "used before a noun to refer to one thing, not a specific one", "a friend of mine"]],
    "an": [["art.", "the form of 'a' used before a vowel sound", "an apple"]],
    "of": [["prep.", "belonging to, relating to, or made from something", "the sound of music"]],
    "to": [["prep.", "in the direction of; also used before a verb to form the infinitive", "go to school; to learn"]],
    "and": [["conj.", "used to join words or parts of sentences", "bread and butter"]],
    "or": [["conj.", "used to connect possibilities or choices", "tea or coffee"]],
    "but": [["conj.", "used to introduce something contrasting with what was said", "small but strong"]],
    "if": [["conj.", "introducing a condition", "if it rains, we stay home"]],
    "because": [["conj.", "for the reason that", "she left because she was tired"]],
    "although": [["conj.", "in spite of the fact that", "although it rained, we went out"]],
    "though": [["conj.", "although; however", "though young, she is wise"]],
    "than": [["conj.", "used to introduce the second part of a comparison", "taller than me"]],
    "as": [["conj.", "used in comparisons; while; because", "as busy as a bee"]],
    "so": [["conj.", "therefore; to such a degree", "it was late, so we left"]],
    "at": [["prep.", "used to show an exact position, point in time, or level", "at noon; at school"]],
    "by": [["prep.", "through the action of; beside; not later than", "written by her; by the door"]],
    "for": [["prep.", "intended to be given to; because of; during", "a gift for you"]],
    "from": [["prep.", "showing the point where something starts", "from Monday to Friday"]],
    "in": [["prep.", "inside; within a place, time, or state", "in the box; in March"]],
    "into": [["prep.", "to the inside of; expressing change of state", "walk into the room"]],
    "on": [["prep.", "touching the surface of; about; at the time of", "on the desk; on Friday"]],
    "with": [["prep.", "accompanied by; using", "come with me; cut with a knife"]],
    "whether": [["conj.", "expressing a choice between possibilities", "I wonder whether it is true"]],
    "while": [["conj.", "during the time that; although", "he read while she slept"]],
    "since": [["prep.", "from a time in the past until now; because", "since 2020"]],
    "unless": [["conj.", "except if", "unless you hurry, you will be late"]],
    "until": [["prep.", "up to a point in time", "wait until noon"]],
    "during": [["prep.", "throughout the length of a period of time", "during the summer"]],
    "this": [["det.", "referring to the person or thing near the speaker", "this book here"]],
    "that": [["det.", "referring to a person or thing further away; also introduces a clause", "that house over there"]],
    "these": [["det.", "plural of 'this'", "these shoes"]],
    "those": [["det.", "plural of 'that'", "those mountains"]],
    "i": [["pron.", "the speaker or writer referring to himself or herself", "I am a student"]],
    "you": [["pron.", "the person or people being spoken to", "you are welcome"]],
    "he": [["pron.", "a male person already mentioned", "he is my brother"]],
    "she": [["pron.", "a female person already mentioned", "she sings well"]],
    "it": [["pron.", "a thing already mentioned; also used as an empty subject", "it is raining"]],
    "we": [["pron.", "the speaker and one or more other people", "we are a team"]],
    "they": [["pron.", "people or things already mentioned", "they arrived early"]],
    "me": [["pron.", "object form of 'I'", "call me later"]],
    "him": [["pron.", "object form of 'he'", "I saw him"]],
    "her": [["pron.", "object form of 'she'; belonging to her", "her idea"]],
    "us": [["pron.", "object form of 'we'", "join us"]],
    "them": [["pron.", "object form of 'they'", "help them"]],
    "my": [["det.", "belonging to me", "my family"]],
    "your": [["det.", "belonging to you", "your turn"]],
    "his": [["det.", "belonging to him", "his car"]],
    "its": [["det.", "belonging to it", "the dog wagged its tail"]],
    "our": [["det.", "belonging to us", "our school"]],
    "their": [["det.", "belonging to them", "their house"]],
    "who": [["pron.", "which person; used to introduce a clause about a person", "the girl who won"]],
    "whom": [["pron.", "object form of 'who' (formal)", "to whom it may concern"]],
    "whose": [["det.", "belonging to which person", "whose bag is this?"]],
    "which": [["pron.", "asking or telling about a choice among things", "which color do you like?"]],
    "what": [["pron.", "asking for information about something", "what happened?"]],
    "when": [["adv.", "at what time; at the time that", "when does it start?"]],
    "where": [["adv.", "in or to what place", "where do you live?"]],
    "why": [["adv.", "for what reason", "why are you late?"]],
    "how": [["adv.", "in what way; to what degree", "how does it work?"]],
    "not": [["adv.", "used to make a word or sentence negative", "it is not true"]],
    "no": [["det.", "not any; used to refuse or deny", "no time; no, thanks"]],
    "yes": [["adv.", "used to agree or accept", "yes, please"]],
    "must": [["aux.", "used to say something is necessary or certain", "you must stop"]],
    "can": [["aux.", "to be able to; to be allowed to", "she can swim"]],
    "could": [["aux.", "past form of 'can'; used for polite requests or possibility", "could you help?"]],
    "may": [["aux.", "used to express possibility or permission", "it may rain"]],
    "might": [["aux.", "used to express a smaller possibility", "we might be late"]],
    "will": [["aux.", "used to form the future tense", "I will call you"]],
    "would": [["aux.", "past form of 'will'; used for polite requests or imagined situations", "would you mind?"]],
    "shall": [["aux.", "used with 'I' and 'we' to form the future (formal)", "shall we begin?"]],
    "should": [["aux.", "used to give advice or say what is right", "you should rest"]],
    "ought": [["aux.", "used with 'to' to say what is right or expected", "you ought to apologize"]],
    "cannot": [["aux.", "the negative form of 'can'", "I cannot agree"]],
    "am": [["v.", "the form of 'be' used with 'I'", "I am ready"]],
    "is": [["v.", "the form of 'be' used with he, she, and it", "she is here"]],
    "are": [["v.", "the form of 'be' used with you, we, and they", "they are happy"]],
    "was": [["v.", "past form of 'is' and 'am'", "he was tired"]],
    "were": [["v.", "past form of 'are'", "we were young"]],
    "been": [["v.", "past participle of 'be'", "I have been busy"]],
    "being": [["v.", "the -ing form of 'be'", "being honest matters"]],
    "does": [["aux.", "the form of 'do' used with he, she, and it", "does she know?"]],
    "did": [["aux.", "past form of 'do'", "did you see it?"]],
    "nor": [["conj.", "and not; used after 'neither'", "neither hot nor cold"]],
    "per": [["prep.", "for each", "per person"]],
    "via": [["prep.", "by way of; by means of", "fly via Tokyo"]],
    "versus": [["prep.", "against; in contrast to", "quality versus speed"]],
    "etc": [["abbr.", "and other similar things (et cetera)", "pens, books, etc."]],
    "toward": [["prep.", "in the direction of", "walk toward the door"]],
    "onto": [["prep.", "to a position on the surface of", "climb onto the roof"]],
    "upon": [["prep.", "on (formal)", "once upon a time"]],
    "albeit": [["conj.", "although (formal)", "useful, albeit expensive"]],
    "notwithstanding": [["prep.", "in spite of (formal)", "notwithstanding the risks"]],
    "herein": [["adv.", "in this document or matter (formal)", "the ideas herein"]],
    "whoever": [["pron.", "any person who", "whoever comes is welcome"]],
    "whatever": [["det.", "anything or everything that; no matter what", "do whatever you like"]],
    "ok": [["adj.", "all right; acceptable", "is that ok?"]],
    "mr": [["n.", "a title used before a man's family name", "Mr. Lin"]],
    "dr": [["n.", "a title for a doctor or holder of a doctorate", "Dr. Chen"]],
    "against": [["prep.", "in opposition to; touching for support", "against the rules"]],
    "among": [["prep.", "in the middle of; included in a group", "among friends"]],
    "beside": [["prep.", "next to", "sit beside me"]],
    "without": [["prep.", "not having; not doing", "without water"]],
    "whereas": [["conj.", "in contrast to the fact that", "he is shy, whereas she is bold"]],
    "else": [["adv.", "other; different; in addition", "what else?"]],
    "else's": [["adv.", "belonging to another person ('someone else's')", "someone else's idea"]],
    "itself": [["pron.", "the thing already mentioned, used for emphasis", "the door closed by itself"]],
    "myself": [["pron.", "the speaker as the object of the action", "I taught myself"]],
    "ourselves": [["pron.", "we or us, used for emphasis or as an object", "we did it ourselves"]],
    "themselves": [["pron.", "they or them, used for emphasis or as an object", "they blamed themselves"]],
    "anyone": [["pron.", "any person", "anyone can join"]],
    "anything": [["pron.", "any thing", "anything is possible"]],
    "everyone": [["pron.", "every person", "everyone agreed"]],
    "everything": [["pron.", "all things", "everything changed"]],
    "something": [["pron.", "a thing that is not named", "something smells good"]],
    "others": [["pron.", "other people or things", "help others"]],
    "ours": [["pron.", "belonging to us", "the choice is ours"]],
    "didn't": [["aux.", "short form of 'did not'", "she didn't come"]],
    "app": [["n.", "a computer program, especially for a phone", "a learning app"]],
    "apps": [["n.", "plural of 'app'", "useful apps"]],
    "chatbot": [["n.", "a computer program that talks with people", "the chatbot answered instantly"]],
    "covid": [["n.", "the disease caused by the coronavirus (COVID-19)", "during the COVID pandemic"]],
    "mrt": [["n.", "Mass Rapid Transit; an urban metro system", "take the MRT"]],
    "emily": [["n.", "a female given name", "Emily joined the club"]],
    "kaohsiung": [["n.", "a major city in southern Taiwan", "a teenager in Kaohsiung"]],
    "tainan": [["n.", "a historic city in southern Taiwan", "old streets of Tainan"]],
    "polanyi": [["n.", "Michael Polanyi, philosopher known for the idea of tacit knowledge", "following Polanyi"]],
    "mentorship": [["n.", "guidance given by an experienced person", "mentorship shapes careers"]],
    "meta": [["adj.", "referring to itself or to work about the same kind of work", "a meta-analysis"]],
    "multi": [["prefix", "many; more than one", "multi-layered"]],
    "pre": [["prefix", "before", "pre-pandemic"]],
    "foundational": [["adj.", "forming a base of central importance", "a foundational text"]],
    "testable": [["adj.", "able to be tested or checked", "a testable claim"]],
    "funders": [["n.", "people or organizations that provide money", "research funders"]],
    "gatekeeping": [["n.", "controlling who is allowed in or accepted", "jargon as gatekeeping"]],
    "generalizability": [["n.", "the degree to which findings apply beyond the studied sample", "limited generalizability"]],
    "preregistration": [["n.", "publicly recording a study plan before doing the study", "preregistration reduces bias"]],
    "preregister": [["v.", "to record a study plan before carrying it out", "labs should preregister metrics"]],
    "preregistered": [["adj.", "recorded in advance as a study plan", "preregistered protocols"]],
    "subfields": [["n.", "smaller areas within a field of study", "entire subfields"]],
    "subtypes": [["n.", "smaller categories within a type", "two subtypes"]],
    "survivorship": [["n.", "the state of having survived; bias from seeing only survivors", "survivorship bias"]],
    "confounders": [["n.", "hidden factors that distort a cause-effect relationship", "unmeasured confounders"]],
    "anonymized": [["adj.", "with identifying information removed", "anonymized records"]],
    "anonymization": [["n.", "the removal of identifying information", "anonymization procedures"]],
    "resubmission": [["n.", "sending something in again after revision", "resubmission within three months"]],
    "paywalls": [["n.", "systems that block content until payment is made", "locked behind paywalls"]],
    "renewables": [["n.", "energy sources that do not run out, like solar and wind", "investing in renewables"]],
    "methodologists": [["n.", "experts in research methods", "some methodologists disagree"]],
    "interpretivists": [["n.", "researchers who focus on meaning and interpretation", "interpretivists value context"]],
    "operationalized": [["v.", "defined in a measurable way for research", "the concept is operationalized"]],
    "uncredited": [["adj.", "used without giving credit to the source", "uncredited labor"]],
    "unlearnable": [["adj.", "impossible to learn", "no rule is unlearnable"]],
    "patchwriting": [["n.", "rewriting a source too closely by swapping words", "patchwriting is plagiarism"]],
    "tacitness": [["n.", "the quality of being known but hard to put into words", "measuring tacitness"]],
    "contingently": [["adv.", "in a way that depends on conditions", "contingently assembled"]],
    "egregiously": [["adv.", "in a shockingly bad way", "egregiously wrong"]],
    "instrumentally": [["adv.", "as a useful tool or means", "instrumentally successful"]],
    "aspirational": [["adj.", "expressing a hope or goal rather than reality", "an aspirational claim"]],
    "defeasibly": [["adv.", "in a way open to being overturned by new evidence", "counts defeasibly as evidence"]],
    "revisably": [["adv.", "in a way that can be revised", "conclusions held revisably"]],
    "disaggregated": [["adj.", "separated into component parts", "disaggregated by demographic"]],
    "curation": [["n.", "the careful selection and organization of things", "the curation of sources"]],
    "everybody": [["pron.", "every person", "everybody loves music"]],
    "everybody's": [["pron.", "belonging to every person; also short for 'everybody is'", "it's everybody's duty"]],
    "aren't": [["aux.", "short form of 'are not'", "they aren't here"]],
    "isn't": [["aux.", "short form of 'is not'", "it isn't true"]],
    "wasn't": [["aux.", "short form of 'was not'", "he wasn't ready"]],
    "weren't": [["aux.", "short form of 'were not'", "we weren't told"]],
    "doesn't": [["aux.", "short form of 'does not'", "she doesn't know"]],
    "don't": [["aux.", "short form of 'do not'", "don't worry"]],
    "couldn't": [["aux.", "short form of 'could not'", "I couldn't sleep"]],
    "wouldn't": [["aux.", "short form of 'would not'", "he wouldn't say"]],
    "shouldn't": [["aux.", "short form of 'should not'", "you shouldn't smoke"]],
    "hasn't": [["aux.", "short form of 'has not'", "she hasn't arrived"]],
    "hadn't": [["aux.", "short form of 'had not'", "we hadn't met"]],
    "can't": [["aux.", "short form of 'cannot'", "I can't hear you"]],
    "won't": [["aux.", "short form of 'will not'", "it won't work"]],
    "himself": [["pron.", "he or him, used for emphasis or as an object", "he taught himself"]],
    "yourself": [["pron.", "you, used for emphasis or as an object", "help yourself"]],
    "yourselves": [["pron.", "plural of 'yourself'", "enjoy yourselves"]],
    "whenever": [["conj.", "at any time that; every time that", "come whenever you like"]],
    "towards": [["prep.", "in the direction of (= toward)", "walk towards the light"]],
    "anybody": [["pron.", "any person", "anybody can learn"]],
    "gotta": [["aux.", "informal spoken form of 'have got to' (must)", "I gotta go"]],
    "gosh": [["int.", "an exclamation of surprise", "gosh, that's amazing"]],
    "uh": [["int.", "a hesitation sound while thinking", "uh, let me see"]],
    "ah": [["int.", "an exclamation of realization or pleasure", "ah, I see"]],
}


def load_tokens() -> set[str]:
    tokens = set()
    for f in sorted((ROOT / "js").glob("lessons*.js")):
        t = f.read_text(encoding="utf-8")
        for _aid, en in re.findall(r'aid: "(p_\w+)",\s*title: "[^"]*",\s*en: "((?:[^"\\]|\\.)*)"', t):
            for tok in re.findall(r"[A-Za-z][A-Za-z']*", en):
                tokens.add(tok.rstrip("'").lower())
    # 影片名句的單字(點字彈窗用)
    videos = ROOT / "js" / "videos.js"
    if videos.exists():
        t = videos.read_text(encoding="utf-8")
        for en in re.findall(r'\{ en: "((?:[^"\\]|\\.)*)"', t):
            for tok in re.findall(r"[A-Za-z][A-Za-z']*", en):
                tokens.add(tok.rstrip("'").lower())
    # 影片字幕 + 擷取名句的單字(同步文字稿點字用)
    for name in ("transcripts.js", "video_sentences.js", "toeic_data.js", "toefl_data.js", "ielts_data.js"):
        p = ROOT / "js" / name
        if p.exists():
            t = p.read_text(encoding="utf-8")
            for tok in re.findall(r"[A-Za-z][A-Za-z']*", t.split("= ", 1)[-1]):
                tokens.add(tok.rstrip("'").lower())
    return tokens


def wordnet_entry(word: str):
    """回傳最多 3 個義項:[pos, definition, example]"""
    base = word.replace("'", "")
    meanings = []
    seen_pos = set()
    # wn.synsets 會自動做 morphy 還原(含不規則變化)
    for syn in wn.synsets(base):
        pos = syn.pos()
        if pos in seen_pos:
            continue
        seen_pos.add(pos)
        ex = next(iter(syn.examples()), "")
        meanings.append([POS_LABEL.get(pos, pos), syn.definition(), ex])
        if len(meanings) >= 3:
            break
    return meanings or None


def main() -> None:
    tokens = load_tokens()
    dictionary = {}
    misses = []
    for w in sorted(tokens):
        if w in FUNCTION_WORDS:
            dictionary[w] = FUNCTION_WORDS[w]
            continue
        entry = wordnet_entry(w)
        if entry:
            dictionary[w] = entry
        else:
            # 縮寫還原再試:don't→do、it's→it、year's→year
            stripped = w.split("'")[0]
            if stripped != w and (stripped in FUNCTION_WORDS or wordnet_entry(stripped)):
                dictionary[w] = FUNCTION_WORDS.get(stripped) or wordnet_entry(stripped)
            else:
                misses.append(w)

    payload = json.dumps(dictionary, ensure_ascii=False, separators=(",", ":"))
    (ROOT / "js" / "dictionary.js").write_text(
        "// 自動產生:全離線英英詞典(WordNet + 功能詞補充)— build_dictionary.py\n"
        f"const OFFLINE_DICT = {payload};\n",
        encoding="utf-8",
    )
    size_kb = (ROOT / "js" / "dictionary.js").stat().st_size // 1024
    print(f"tokens: {len(tokens)} | covered: {len(dictionary)} ({len(dictionary)*100//len(tokens)}%) | size: {size_kb} KB")
    print(f"misses ({len(misses)}): {' '.join(misses)}")


if __name__ == "__main__":
    sys.exit(main())
