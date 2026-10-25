# Needs network access to Amazon and the brand stores: python3 -I scripts/gear-fetch/fetch.py
# Opens each gear link, collects the product's photos
# and saves a few candidates (500px) to scripts/gear-fetch/out, with a manifest of where each came from.
import json, os, re, sys, time, urllib.request, http.cookiejar, html

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
here = os.path.dirname(__file__)
out = os.path.join(here, "out")
os.makedirs(out, exist_ok=True)
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
HEAD = {"User-Agent": UA, "Accept-Language": "en-GB,en;q=0.9", "Accept": "text/html,application/xhtml+xml,application/json,*/*"}


def get(url):
    r = opener.open(urllib.request.Request(url, headers=HEAD), timeout=30)
    return r.geturl(), r.read()


def amazon(final, body):
    t = body.decode("utf-8", "ignore")
    title = re.search(r'id="productTitle"[^>]*>\s*([^<]+)', t)
    urls = re.findall(r'"hiRes":"(https://m\.media-amazon\.com/images/I/[^"]+)"', t)
    urls += re.findall(r'"large":"(https://m\.media-amazon\.com/images/I/[^"]+)"', t)
    urls += re.findall(r'data-old-hires="(https://[^"]+)"', t)
    seen, keep = set(), []
    for u in urls:
        base = re.sub(r"\._[^/]*_\.", ".", u)
        if base not in seen:
            seen.add(base)
            keep.append(base.replace(".jpg", "._AC_SL500_.jpg"))
    return (html.unescape(title.group(1).strip()) if title else ("CAPTCHA" if "captcha" in t.lower() else "?")), keep


def shopify(url):
    if "/collections/" in url and "/products/" not in url:
        _, b = get(url.rstrip("/") + "/products.json?limit=5")
        p = json.loads(b)["products"][0]
    else:
        _, b = get(url.rstrip("/") + ".json")
        p = json.loads(b)["product"]
    return p["title"], [i["src"].split("?")[0] + "?width=500" for i in p["images"]]


items = json.load(open(os.path.join(here, sys.argv[1] if len(sys.argv) > 1 else "items.json")))
manifest = []
for it in items:
    rec = {"slug": it["slug"], "name": it["name"], "link": it["url"]}
    try:
        if it.get("images"):
            rec["title"], imgs = "direct", it["images"]
        elif "amazon" in it["url"] or "amzn" in it["url"]:
            for attempt in range(3):
                final, body = get(it["url"])
                rec["page"] = final
                rec["title"], imgs = amazon(final, body)
                if imgs:
                    break
                time.sleep(4 + attempt * 4)
        else:
            rec["page"] = it["url"]
            rec["title"], imgs = shopify(it["url"])
        rec["images"] = []
        for n, u in enumerate(imgs[:4]):
            _, data = get(u)
            name = f"{it['slug']}-{n}.jpg"
            open(os.path.join(out, name), "wb").write(data)
            rec["images"].append({"file": name, "src": u})
    except Exception as e:
        rec["error"] = str(e)
    print(json.dumps(rec)[:300], flush=True)
    manifest.append(rec)
    time.sleep(1.5)
json.dump(manifest, open(os.path.join(out, "manifest.json"), "w"), indent=1)
