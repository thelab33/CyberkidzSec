#!/usr/bin/env bash
set -euo pipefail
echo "🔧  CYBERKIDZSEC  ·  Forge‑Feature Pack 2025‑05‑26"
echo "──────────────────────────────────────────────────"

# ──────────────────────────────────────────────────────────
# 0.  Prereqs  (Python, JS, DB)
# ──────────────────────────────────────────────────────────
pip install --upgrade sentry-sdk==2.* PyJWT==2.* requests==2.* \
                        Flask-JWT-Extended==4.* apscheduler==3.*
npm i -D lunr workbox-window web-push

# ──────────────────────────────────────────────────────────
# 1.  OBSERVABILITY  ·  Sentry SDK (Flask + Browser)
# ──────────────────────────────────────────────────────────
python - <<'PY'
import pathlib, textwrap, re
APP = pathlib.Path("src/app.py")
code = APP.read_text().splitlines(); out=[]; injected=False
for ln in code:
    if not injected and re.match(r"^def create_app\(", ln):
        out.append("import sentry_sdk")
    if re.match(r"\s*app = Flask", ln) and "sentry_sdk.init" not in out[-1]:
        out.append("    # Sentry backend init")
        out.append("    sentry_sdk.init(dsn=os.getenv('SENTRY_DSN', ''),"
                   " traces_sample_rate=0.4, release=os.getenv('RELEASE', 'dev'))")
    out.append(ln)
    injected=True if ln.startswith("import sentry_sdk") else injected
APP.write_text("\n".join(out))
print("  • backend Sentry hook added to src/app.py")
PY

# Inject browser SDK in base template
if ! grep -q "sentryBrowser" templates/base.html; then
  sed -i '/<\/head>/i \
<script defer src="https://browser.sentry-cdn.com/7.101.1/bundle.tracing.replay.min.js" integrity="sha384-X" crossorigin="anonymous"></script>\
<script>window.SENTRY_RELEASE=localStorage.getItem("vaultRelease")||"dev";Sentry.init({dsn:"%SENTRY_DSN%",release:window.SENTRY_RELEASE,tracesSampleRate:.4});</script>' \
 templates/base.html
  echo "  • browser Sentry snippet injected"
fi

# ──────────────────────────────────────────────────────────
# 2.  SEARCH  ·  Lunr.js + JSON feed
# ──────────────────────────────────────────────────────────
mkdir -p static/search
printf '%s\n' \
"import json, pathlib, re, markdown, sys" \
"DATA=pathlib.Path('static/search/index.json')" \
"posts=[]" \
"for md in pathlib.Path('content/blog').rglob('*.md'):   # adjust path" \
"    txt=md.read_text(); title=txt.splitlines()[0].lstrip('# ')" \
"    posts.append({'id': md.stem, 'title': title, 'body': re.sub(r'[#>`*_]', '', txt)[:2000]})" \
"DATA.write_text(json.dumps(posts, ensure_ascii=False))" > build_search.py
python build_search.py && rm build_search.py
cat > static/js/search-init.js <<'JS'
/* global lunr */
fetch('/static/search/index.json').then(r=>r.json()).then(d=>{
  const idx=lunr(function(){this.ref('id');this.field('title');this.field('body');
    d.forEach(doc=>this.add(doc));});
  window.vaultSearch=q=>idx.search(q).map(r=>d.find(doc=>doc.id===r.ref));
});
JS
grep -q "search-init.js" templates/base.html || \
sed -i '/<\/body>/i <script defer src="{{ url_for('\''static'\'', filename='\''js/search-init.js'\'') }}"></script>' templates/base.html
echo "  • Lunr index built & client loader wired"

# ──────────────────────────────────────────────────────────
# 3.  LIVE CVE WIDGET  ·  APScheduler task + tiny API fetch
# ──────────────────────────────────────────────────────────
cat > src/cve_feed.py <<'PY'
from flask import current_app, Blueprint, jsonify
import requests, time, threading, os, atexit
_feed=[]; bp=Blueprint("cve",__name__)
def poll():
    global _feed
    while True:
        try:
            r=requests.get("https://cve.circl.lu/api/last",timeout=20).json()[:15]
            _feed=r
        except Exception as e:
            current_app.logger.warning(f"CVE fetch fail: {e}")
        time.sleep(3600)
@bp.route("/api/cves")
def cves(): return jsonify(_feed)
def start():
    th=threading.Thread(target=poll,daemon=True); th.start()
    atexit.register(lambda: None)
PY
python - <<'PY'
import pathlib, re
app_py=pathlib.Path("src/app.py"); txt=app_py.read_text().splitlines(); out=[]
for ln in txt:
    out.append(ln)
    if "register_blueprints(app)" in ln:
        out.insert(-1,"    from src import cve_feed; app.register_blueprint(cve_feed.bp); cve_feed.start()")
app_py.write_text("\n".join(out))
print("  • CVE feed blueprint & poller wired")
PY
cat > templates/components/latest_cves.html <<'HTML'
<section class="max-w-4xl mx-auto my-10">
  <h2 class="font-bold text-lg mb-3">🛰️ Latest CVEs (24 h)</h2>
  <ul id="cveList" class="space-y-1 text-sm font-mono"></ul>
</section>
<script>
fetch('/api/cves').then(r=>r.json()).then(list=>{
  const ul=document.getElementById('cveList');
  if(!ul||!list.length){ul.innerHTML='<em>offline</em>';return;}
  list.forEach(cve=>{
    const li=document.createElement('li');
    li.innerHTML=`<a href="https://nvd.nist.gov/vuln/detail/${cve.id}"
      class="text-orange-400 underline">${cve.id}</a> – ${cve.summary.slice(0,100)}…`;
    ul.appendChild(li);
  });
});
</script>
HTML
grep -q "latest_cves.html" templates/index.html || \
sed -i '/{% include "components\/vault_overview_section.html" %}/a \ \ {% include "components/latest_cves.html" %}' templates/index.html
echo "  • Latest CVE widget added"

# ──────────────────────────────────────────────────────────
# 4.  WEB‑PUSH  ·  service‑worker + vapid keys placeholder
# ──────────────────────────────────────────────────────────
cat > static/js/push-init.js <<'JS'
import {Workbox} from 'workbox-window';
if ('serviceWorker' in navigator && 'PushManager' in window){
  const wb=new Workbox('/static/sw.js');
  wb.register().then(()=>{
    Notification.requestPermission().then(p=>{
      if(p==='granted') navigator.serviceWorker.ready.then(reg=>{
        reg.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey:'%VAPID_PUB%'
        }).then(sub=>{
          fetch('/api/push/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub)});
        });
      });
    });
  });
}
JS
sed -i '/push-init.js/d' templates/base.html
sed -i '/<\/body>/i <script defer src="{{ url_for('\''static'\'', filename='\''js/push-init.js'\'') }}"></script>' templates/base.html
python - <<'PY'
import pathlib, textwrap
routes=pathlib.Path("src/push_routes.py")
routes.write_text(textwrap.dedent("""
    from flask import Blueprint, request, current_app, jsonify
    import json, os, py_vapid, base64, time, threading, pathlib
    push_bp=Blueprint('push',__name__)
    subs=[]
    @push_bp.route('/api/push/register',methods=['POST'])
    def reg(): subs.append(request.json); return '',204
    def broadcast(title,body):
        for s in list(subs):
            try:
                py_vapid.send(
                    s, title, body,
                    os.getenv('VAPID_PRIV'), os.getenv('VAPID_PUB'),
                    'mailto:admin@vault.local'
                )
            except Exception as e:
                current_app.logger.warning(f'push fail: {e}')
"""))
print("  • Web‑Push scaffold created (needs VAPID keys & py_vapid lib)")
PY
python - <<'PY'
import pathlib
app=pathlib.Path("src/app.py"); t=app.read_text().splitlines(); out=[]
for ln in t:
    out.append(ln)
    if "register_blueprints(app)" in ln and "push_bp" not in "".join(out):
        out.insert(-1,"    from src import push_routes; app.register_blueprint(push_routes.push_bp)")
app.write_text("\n".join(out))
print("  • push blueprint registered")
PY

# ──────────────────────────────────────────────────────────
# 5.  JWT AUTH  ·  simple login + “Ghost Mode”
# ──────────────────────────────────────────────────────────
python - <<'PY'
import pathlib, textwrap, secrets
auth=pathlib.Path("src/auth.py")
auth.write_text(textwrap.dedent(f"""
    from flask import Blueprint, jsonify, request, current_app
    from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
    bp=Blueprint('auth', __name__)
    jwt=JWTManager()
    USERS={{'admin': '{secrets.token_hex(8)}'}}  # replace in prod
    @bp.route('/api/login', methods=['POST'])
    def login():
        u=request.json.get('u'); p=request.json.get('p')
        if USERS.get(u)==p:
            return jsonify(access_token=create_access_token(identity=u)), 200
        return '',401
    @bp.route('/api/ghost')
    @jwt_required()
    def ghost(): return jsonify({'msg':'ghost‑mode granted', 'user': get_jwt_identity()})
"""))
print("  • auth blueprint written with random dev password")
app=pathlib.Path("src/app.py"); t=app.read_text().splitlines(); out=[]
for ln in t:
    out.append(ln)
    if "register_blueprints(app)" in ln and "auth.bp" not in "".join(out):
        out.insert(-1,"    from src import auth; auth.jwt.init_app(app); app.register_blueprint(auth.bp)")
app.write_text("\n".join(out))
print("  • auth blueprint registered & JWT mgr initialised")
PY

cat > static/js/ghost-toggle.js <<'JS'
async function tryGhost(){
  const u=prompt("user"); const p=prompt("pass");
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({u,p})});
  if(r.ok){const {access_token}=await r.json();
    localStorage.setItem('jwt',access_token);
    location.reload();
  }else alert("nope");}
document.getElementById('ghostToggle')?.addEventListener('click',tryGhost);
JS
grep -q "ghost-toggle.js" templates/base.html || \
sed -i '/<\/body>/i <script defer src="{{ url_for('\''static'\'', filename='\''js/ghost-toggle.js'\'') }}"></script>' templates/base.html
echo "  • Ghost‑mode login toggle wired (add a button with id=\"ghostToggle\")"

# ──────────────────────────────────────────────────────────
echo "✅  Forge feature pack applied — rebuild assets & restart Gunicorn."
echo "   (Set env vars: SENTRY_DSN, RELEASE, VAPID_PUB/PRIV)"

