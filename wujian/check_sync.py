# -*- coding: utf-8 -*-
"""
wujian/check_sync.py  —  物件列表同步閘門（40-0904-01 建）

擋什麼：新案建了 wujian/<slug>/ 頁面、也登進了 listings.json，
        但沒有人把它加進 data.js，於是客人在 /wujian/ 列表點不到。
        （2026-09-04 實害：曼哈頓13樓事務所 088 頁面上線但列表漏收）

真相源分兩軸（這是本閘門的前提，改規則前先讀）：
  ① 名單／價格／狀態 → listings.json 是唯一真相源（機器可判，本檔擋得住）
  ② 文案（sell／honest／sp／code／img）→ data.js 是人工撰寫層
     🔴 honest＝缺點揭露，listings.json 沒有這些欄位，
        og:description 也產不出來。硬用程式產＝憑空幫物件寫缺點，
        違反 feedback_never_invent_defects_not_on_the_sheet。
        所以本閘門只驗「有沒有這筆」與「價格對不對」，不驗文案內容。

用法：
    python check_sync.py            # 從 repo 的 wujian/ 底下跑
    python check_sync.py <wujian目錄>

回傳碼：0=PASS  1=FAIL（印出差集）
"""

import io
import json
import os
import re
import sys

CHECKS = []


def add(code, name, ok, detail=""):
    CHECKS.append((code, name, ok, detail))


def parse_data_js(path):
    """把 data.js 的 window.AHLISTINGS 陣列拆成一個個物件片段。

    data.js 是 JS 不是 JSON（欄位名沒引號、字串用單引號），
    所以不走 json.loads，改用「掃描最外層大括號」切塊，
    再用 regex 逐欄取值。物件文案裡不會出現大括號，
    真的出現時本函式會丟例外而不是靜默少算——寧可壞掉也不要假綠燈。
    """
    src = io.open(path, encoding="utf-8").read()
    start = src.index("window.AHLISTINGS")
    body = src[src.index("[", start):]
    entries = []
    depth = 0
    buf = []
    in_str = False
    quote = ""
    for ch in body:
        if in_str:
            buf.append(ch)
            if ch == quote:
                in_str = False
            continue
        if ch in ("'", '"'):
            in_str = True
            quote = ch
            if depth > 0:
                buf.append(ch)
            continue
        if ch == "{":
            depth += 1
            if depth == 1:
                buf = ["{"]
                continue
        if ch == "}":
            depth -= 1
            if depth == 0:
                buf.append("}")
                entries.append("".join(buf))
                buf = []
                continue
        if depth > 0:
            buf.append(ch)
    if depth != 0:
        raise ValueError("data.js 大括號不平衡，解析失敗：%s" % path)
    out = []
    for e in entries:
        rec = {}
        for key in ("slug", "id", "n", "pt", "code", "img", "grade", "r"):
            m = re.search(key + r"\s*:\s*'((?:[^'])*)'", e)
            rec[key] = m.group(1) if m else None
        m = re.search(r"\bp\s*:\s*([0-9.]+)", e)
        rec["p"] = float(m.group(1)) if m else None
        out.append(rec)
    return out


def main():
    here = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
    here = here.replace("\\", "/")
    lj = os.path.join(here, "listings.json")
    dj = os.path.join(here, "data.js")

    doc = json.load(io.open(lj, encoding="utf-8"))
    items = doc["物件"]
    on_sale = {}
    off = {}
    for x in items:
        (on_sale if x.get("status") == "在售" else off)[x["slug"]] = x

    rows = parse_data_js(dj)

    # ── G-S1 每筆都要有 slug，否則兩邊對不起來 ────────────────
    noslug = [r.get("id") for r in rows if not r.get("slug")]
    add("G-S1", "data.js 每筆都有 slug 欄位", not noslug,
        "缺 slug 的 id：%s" % ", ".join(str(i) for i in noslug) if noslug else
        "共 %d 筆全部有 slug" % len(rows))

    js_slugs = set(r["slug"] for r in rows if r.get("slug"))

    # ── G-S2 在售名單必須完全一致（漏案就是死在這裡）─────────
    missing = sorted(set(on_sale) - js_slugs)
    extra = sorted(js_slugs - set(on_sale))
    add("G-S2", "listings.json 在售 == data.js 收錄", not missing and not extra,
        "listings.json 有但 data.js 漏收：%s ／ data.js 有但不在在售名單：%s"
        % (missing or "無", extra or "無"))

    # ── G-S3 價格以 listings.json 為準 ──────────────────────
    bad = []
    for r in rows:
        s = r.get("slug")
        if s in on_sale:
            want = on_sale[s].get("開價萬")
            if want is not None and r.get("p") is not None and float(want) != r["p"]:
                bad.append("%s(listings=%s / data.js=%s)" % (s, want, int(r["p"])))
    add("G-S3", "價格與 listings.json 一致", not bad,
        "不符：%s" % ", ".join(bad) if bad else "逐筆相符")

    # ── G-S4 已售出／已下架不得留在列表上 ────────────────────
    ghost = sorted(js_slugs & set(off))
    add("G-S4", "已售出／已下架不在 data.js", not ghost,
        "還掛在列表上：%s" % ", ".join(ghost) if ghost else "無")

    # ── G-S5 每筆都要有實際頁面 ─────────────────────────────
    nopage = [s for s in sorted(js_slugs)
              if not os.path.isfile(os.path.join(here, s, "index.html"))]
    add("G-S5", "每筆 slug 都有 wujian/<slug>/index.html", not nopage,
        "找不到頁面：%s" % ", ".join(nopage) if nopage else "逐筆存在")

    # ── G-S6 img 指到真的存在的檔（不要指到空路徑）───────────
    root = os.path.dirname(here.rstrip("/"))
    badimg = []
    for r in rows:
        img = r.get("img")
        if img:
            p = os.path.join(root, img.lstrip("/").replace("/", os.sep))
            if not os.path.isfile(p):
                badimg.append("%s -> %s" % (r.get("slug"), img))
    add("G-S6", "img 路徑檔案存在", not badimg,
        "找不到圖檔：%s" % ", ".join(badimg) if badimg else "逐筆存在")

    fails = [c for c in CHECKS if not c[2]]
    print("=" * 62)
    print("物件列表同步閘門 check_sync.py｜listings.json %d 筆（在售 %d）｜data.js %d 筆"
          % (len(items), len(on_sale), len(rows)))
    print("=" * 62)
    for code, name, ok, detail in CHECKS:
        print("%s %s %s" % ("PASS" if ok else "FAIL", code, name))
        print("     %s" % detail)
    print("-" * 62)
    print("檢查 %d 項／PASS %d／FAIL %d" % (len(CHECKS), len(CHECKS) - len(fails), len(fails)))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
