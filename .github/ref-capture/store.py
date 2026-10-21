import base64, json, os, urllib.request

api = f"https://api.github.com/repos/{os.environ['REPO']}/git/"
headers = {"Authorization": "Bearer " + os.environ["GH_TOKEN"], "Accept": "application/vnd.github+json"}


def post(path, body):
    req = urllib.request.Request(api + path, json.dumps(body).encode(), headers)
    return json.load(urllib.request.urlopen(req))


tree = []
for name in sorted(os.listdir(".")):
    with open(name, "rb") as f:
        sha = post("blobs", {"content": base64.b64encode(f.read()).decode(), "encoding": "base64"})["sha"]
    tree.append({"path": name, "mode": "100644", "type": "blob", "sha": sha})
print("::notice title=reftree::" + post("trees", {"tree": tree})["sha"])
