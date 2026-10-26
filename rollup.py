#!/usr/bin/env python3
r"""
rollup.py — CLI & Local/Cloud Server for `RollupOS — Multi-User Android Mini-App Hub`
Workspace: d:\_AI\android-rollup-app

Commands:
  python rollup.py serve [--port 8090]
  python rollup.py sync-fantasy
  python rollup.py create <app-id> --title "My Mini App" [--category "Utilities"]
  python rollup.py authorize <google-email> <app-id> [--name "Friend Name"] [--team-id 14]
  python rollup.py publish [--repo android-rollup-hub]
"""

import argparse
import datetime
import hashlib
import http.server
import re
import json
import socket
import socketserver
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict

ROOT_DIR = Path(__file__).resolve().parent
REGISTRY_PATH = ROOT_DIR / "registry.json"

if sys.stdout is None or sys.stderr is None:
    _rlog = open(ROOT_DIR / "rollup_server.log", "a", encoding="utf-8", buffering=1)
    sys.stdout = _rlog
    sys.stderr = _rlog

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def load_registry() -> Dict[str, Any]:
    if not REGISTRY_PATH.exists():
        raise FileNotFoundError(f"Missing {REGISTRY_PATH}")
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def save_registry(reg: Dict[str, Any]) -> None:
    reg.setdefault("hub", {})["updated_at"] = datetime.datetime.now().isoformat()
    REGISTRY_PATH.write_text(json.dumps(reg, indent=2), encoding="utf-8")


_TEXT_EXTS = {".html", ".htm", ".js", ".mjs", ".css", ".json", ".svg", ".md", ".txt"}
_SKIP_NAMES = {".DS_Store", "Thumbs.db", "__pycache__"}
_FILE_DIGEST_CACHE: Dict[str, Any] = {}


def _hash_single_file(fpath: Path) -> bytes:
    st = fpath.stat()
    cache_key = str(fpath)
    cached = _FILE_DIGEST_CACHE.get(cache_key)
    sig = (st.st_mtime_ns, st.st_size)
    if cached and cached[0] == sig:
        return cached[1]
    raw = fpath.read_bytes()
    if fpath.suffix.lower() in _TEXT_EXTS:
        raw = raw.replace(b"\r\n", b"\n")
    digest = hashlib.sha256(raw).digest()
    _FILE_DIGEST_CACHE[cache_key] = (sig, digest)
    return digest


def compute_app_build_hash(app_id: str) -> str:
    app_dir = ROOT_DIR / "apps" / app_id
    if not app_dir.exists():
        return "0000000000"
    h = hashlib.sha256()
    files = sorted(
        (p for p in app_dir.rglob("*") if p.is_file() and p.name not in _SKIP_NAMES and not p.name.endswith((".pyc", ".log")) and "__pycache__" not in p.parts),
        key=lambda x: x.relative_to(app_dir).as_posix(),
    )
    for fpath in files:
        rel = fpath.relative_to(app_dir).as_posix().encode("utf-8")
        h.update(rel + b"\0")
        h.update(_hash_single_file(fpath))
    return h.hexdigest()[:10]


def compute_hub_build_hash() -> str:
    h = hashlib.sha256()
    for rel_str in ("index.html", "manifest.json", "bridge/rollup-bridge.js"):
        fp = ROOT_DIR / rel_str
        if fp.exists():
            h.update(rel_str.encode("utf-8") + b"\0")
            h.update(_hash_single_file(fp))
    return h.hexdigest()[:10]


def _bump_patch_version(ver_str: str) -> str:
    parts = str(ver_str or "1.0.0").strip().split(".")
    if len(parts) >= 3 and parts[-1].isdigit():
        parts[-1] = str(int(parts[-1]) + 1)
        return ".".join(parts)
    if len(parts) == 2 and parts[-1].isdigit():
        return f"{parts[0]}.{parts[1]}.1"
    return f"{ver_str}.1"


def sync_service_worker(reg: Dict[str, Any], ota_etag: str) -> bool:
    sw_path = ROOT_DIR / "sw.js"
    core_assets = [
        "./",
        "./index.html",
        "./manifest.json",
        "./registry.json",
        "./assets/icon.svg",
        "./assets/icon-192.png",
        "./assets/icon-512.png",
        "./bridge/rollup-bridge.js",
    ]
    seen = set(core_assets)
    for app in reg.get("apps", []):
        for asset in app.get("offline_assets", []):
            norm = asset if asset.startswith("./") else f"./{asset.lstrip('/')}"
            if norm not in seen:
                seen.add(norm)
                core_assets.append(norm)
        m_html = app.get("manual_html", "")
        if m_html:
            m_norm = m_html if m_html.startswith("./") else f"./{m_html.lstrip('/')}"
            if m_norm not in seen:
                seen.add(m_norm)
                core_assets.append(m_norm)

    assets_js = ",\n".join(f"  '{a}'" for a in core_assets)
    cache_name = f"rollup-hub-{ota_etag[:8]}"
    sw_content = f"""const CACHE_NAME = '{cache_name}';
const CORE_ASSETS = [
{assets_js}
];

self.addEventListener('install', (event) => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {{}})
  );
  self.skipWaiting();
}});

self.addEventListener('activate', (event) => {{
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
}});

self.addEventListener('fetch', (event) => {{
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  const u = new URL(event.request.url);
  if (u.pathname.startsWith('/api/')) return;

  // Live OTA version/hash checks bypass Service Worker & HTTP caches completely
  if (u.searchParams.has('__ota')) {{
    event.respondWith(fetch(event.request, {{ cache: 'no-store' }}));
    return;
  }}

  event.respondWith(
    fetch(event.request, {{ cache: 'no-cache' }})
      .then((networkResp) => {{
        if (networkResp && networkResp.status === 200) {{
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {{}});
        }}
        return networkResp;
      }})
      .catch(() => caches.match(event.request, {{ ignoreSearch: true }}))
  );
}});
"""
    existing = sw_path.read_text(encoding="utf-8").replace("\r\n", "\n") if sw_path.exists() else ""
    if existing != sw_content:
        sw_path.write_text(sw_content, encoding="utf-8")
        return True
    return False


def stamp_build_hashes(persist: bool = True) -> Dict[str, Any]:
    """Deterministically compute SHA-256 build_hash for Hub & all Mini-Apps and auto-bump forgotten patch versions."""
    reg = load_registry()
    now_iso = datetime.datetime.now().isoformat()
    changed = False

    hub = reg.setdefault("hub", {})
    if "apk_version" not in hub:
        hub["apk_version"] = "1.0.0"
        changed = True

    new_hub_hash = compute_hub_build_hash()
    old_hub_hash = hub.get("build_hash", "")
    cur_hub_ver = str(hub.get("version", "1.0.0"))
    if old_hub_hash and new_hub_hash != old_hub_hash and cur_hub_ver == hub.get("stamped_version", ""):
        cur_hub_ver = _bump_patch_version(cur_hub_ver)
        hub["version"] = cur_hub_ver
        changed = True
    if new_hub_hash != old_hub_hash or hub.get("stamped_version") != cur_hub_ver:
        hub["build_hash"] = new_hub_hash
        hub["stamped_version"] = cur_hub_ver
        hub["updated_at"] = now_iso
        changed = True

    overall = hashlib.sha256(f"hub:{new_hub_hash}|".encode("utf-8"))
    for app in reg.get("apps", []):
        app_id = app.get("id", "")
        if not app_id:
            continue
        new_hash = compute_app_build_hash(app_id)
        old_hash = app.get("build_hash", "")
        cur_ver = str(app.get("version", "1.0.0"))
        if old_hash and new_hash != old_hash and cur_ver == app.get("stamped_version", ""):
            cur_ver = _bump_patch_version(cur_ver)
            app["version"] = cur_ver
            changed = True
        if new_hash != old_hash or app.get("stamped_version") != cur_ver or "updated_at" not in app:
            app["build_hash"] = new_hash
            app["stamped_version"] = cur_ver
            app["updated_at"] = now_iso
            changed = True
        overall.update(f"{app_id}:{new_hash}|".encode("utf-8"))

    ota_etag = overall.hexdigest()[:10]
    if hub.get("ota_etag") != ota_etag:
        hub["ota_etag"] = ota_etag
        changed = True

    if persist:
        manuals_mutated, regen_ids = _run_manual_sync(reg, force=False)
        if manuals_mutated:
            changed = True
        if changed:
            REGISTRY_PATH.write_text(json.dumps(reg, indent=2), encoding="utf-8")
        sw_changed = sync_service_worker(reg, ota_etag)
        if changed or sw_changed or regen_ids:
            print(f"[RollupOS] Stamped deterministic OTA hashes (etag={ota_etag}, hub=v{hub['version']}#{new_hub_hash[:6]}, manuals_updated={len(regen_ids)})")
    return reg


def _run_manual_sync(reg: Dict[str, Any], force: bool = False, target_app: str = "") -> Any:
    scripts_dir = ROOT_DIR / "scripts"
    if str(scripts_dir) not in sys.path:
        sys.path.insert(0, str(scripts_dir))
    from manual_generator import sync_app_manuals  # type: ignore

    return sync_app_manuals(reg, ROOT_DIR, force=force, target_app=target_app or None)


def cmd_manuals(app_id: str = "", force: bool = False) -> None:
    reg = stamp_build_hashes(persist=False)
    mutated, regen_ids = _run_manual_sync(reg, force=force, target_app=app_id)
    if mutated or regen_ids:
        REGISTRY_PATH.write_text(json.dumps(reg, indent=2), encoding="utf-8")
        sync_service_worker(reg, reg.get("hub", {}).get("ota_etag", "manual00"))
    print(f"[RollupOS] Manual check complete — {len(regen_ids)} manual(s) built/updated.")


def get_lan_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def cmd_sync_fantasy() -> None:
    script = ROOT_DIR / "scripts" / "build_multi_team_fantasy_data.py"
    sys.path.insert(0, str(script.parent))
    from build_multi_team_fantasy_data import build_all_teams_bundle  # type: ignore

    target = ROOT_DIR / "apps" / "fantasy-manager" / "data" / "league_945552.json"
    build_all_teams_bundle(target)


def cmd_create_app(app_id: str, title: str, subtitle: str, icon: str, category: str) -> None:
    app_dir = ROOT_DIR / "apps" / app_id
    app_dir.mkdir(parents=True, exist_ok=True)
    html_file = app_dir / "index.html"

    template = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#090d16">
<title>{title} — RollupOS Mini-App</title>
<script src="../../bridge/rollup-bridge.js?v=1.3"></script>
<style>
  body {{
    margin: 0; padding: 16px 16px 90px 16px;
    background: #090d16; color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Google Sans', sans-serif;
  }}
  .shell {{ max-width: 480px; margin: 0 auto; }}
  .card {{ background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 14px; margin-top: 12px; }}
</style>
</head>
<body>
<div class="shell">
  <h1 style="margin:0;font-size:20px;">{icon} {title}</h1>
  <div style="font-size:12px;color:#94a3b8;margin-top:4px;">{subtitle}</div>
  <div class="card">
    <div id="user-info" style="font-size:12px;color:#38bdf8;"></div>
  </div>
</div>
<script>
window.ROLLUP_APP_ID = '{app_id}';
if (RollupBridge.enforceAccessGate('{app_id}', 'restricted')) {{
  RollupBridge.mountInAppConsolePill({{ appId: '{app_id}', visibility: 'restricted' }});
  const u = RollupBridge.auth.getCurrentUser();
  document.getElementById('user-info').textContent = 'Isolated Profile Active for: ' + (u ? u.email : 'guest');
}}
</script>
</body>
</html>
"""
    html_file.write_text(template, encoding="utf-8")

    reg = load_registry()
    apps = reg.setdefault("apps", [])
    if not any(a.get("id") == app_id for a in apps):
        apps.append({
            "id": app_id,
            "title": title,
            "subtitle": subtitle,
            "description": f"Custom RollupOS mini-app ({title}) with isolated per-user storage.",
            "icon": icon,
            "accent": "#38bdf8",
            "category": category,
            "version": "1.0.0",
            "entry": f"apps/{app_id}/index.html",
            "visibility": "restricted",
            "offline_assets": [f"apps/{app_id}/index.html"],
            "userConfigSchema": [],
        })
        # Also auto-authorize Admin
        for u in reg.get("hub", {}).get("auth", {}).get("default_users", []):
            if u.get("role") == "admin" and app_id not in u.get("authorized_apps", []):
                u.setdefault("authorized_apps", []).append(app_id)
        save_registry(reg)
        stamp_build_hashes(persist=True)
    print(f"[RollupOS] Created mini-app '{app_id}' at {html_file}, registered in registry.json, and built initial PDF manual")


def cmd_authorize_user(email: str, app_id: str, name: str = "", team_id: int = 14) -> None:
    email_norm = email.strip().lower()
    reg = load_registry()
    users_list = reg.setdefault("hub", {}).setdefault("auth", {}).setdefault("default_users", [])
    target = next((u for u in users_list if str(u.get("email", "")).lower() == email_norm), None)

    if not target:
        disp = name or email_norm.split("@")[0]
        target = {
            "email": email_norm,
            "name": disp,
            "role": "tester",
            "avatar": disp[:2].upper(),
            "badge": f"🏈 Authorized Tester (Team #{team_id})",
            "authorized_apps": [app_id],
            "default_app_configs": {
                "fantasy-manager": {
                    "league_id": 945552,
                    "team_id": team_id,
                    "team_name": f"Team #{team_id}",
                    "blend_weight": 60,
                }
            },
        }
        users_list.append(target)
    else:
        if app_id not in target.setdefault("authorized_apps", []):
            target["authorized_apps"].append(app_id)

    save_registry(reg)
    print(f"[RollupOS] Authorized {email_norm} for '{app_id}' in registry.json")


class RollupRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def _proxy_gravity(self, method: str) -> bool:
        if not self.path.startswith("/api/gravity-proxy/"):
            return False
        subpath = self.path[len("/api/gravity-proxy"):]
        target_url = f"http://127.0.0.1:8765{subpath}"
        body = None
        if method == "POST":
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length) if length > 0 else b""
        req = urllib.request.Request(target_url, data=body, method=method)
        for hdr in ("Content-Type", "X-Gravity-Token", "Authorization"):
            val = self.headers.get(hdr)
            if val:
                req.add_header(hdr, val)
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                resp_bytes = resp.read()
                self.send_response(resp.status)
                self.send_header("Content-Type", resp.headers.get("Content-Type", "application/json"))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(resp_bytes)
        except urllib.error.HTTPError as he:
            err_bytes = he.read()
            self.send_response(he.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(err_bytes)
        except Exception as exc:
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ERROR", "error": str(exc)}).encode("utf-8"))
        return True

    def end_headers(self) -> None:
        clean_path = self.path.split("?")[0].lower()
        if clean_path.endswith((".html", ".js", ".json")) or "/api/" in self.path or clean_path.endswith("/"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Gravity-Token, Authorization")
        self.end_headers()

    def do_GET(self) -> None:
        if self._proxy_gravity("GET"):
            return
        if self.path.startswith("/registry.json") and "__ota=" in self.path:
            try:
                live_reg = stamp_build_hashes(persist=False)
                payload = json.dumps(live_reg, indent=2).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(payload)
                return
            except Exception:
                pass
        super().do_GET()

    def do_POST(self) -> None:
        if self._proxy_gravity("POST"):
            return
        if self.path == "/api/hub/acl":
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8")
            try:
                acl_payload = json.loads(raw)
                reg = load_registry()
                users_dict = acl_payload.get("users") or {}
                reg.setdefault("hub", {}).setdefault("auth", {})["default_users"] = list(users_dict.values())
                if acl_payload.get("google_client_id") is not None:
                    reg["hub"]["auth"]["google_client_id"] = acl_payload["google_client_id"]
                save_registry(reg)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "OK", "saved": True}).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ERROR", "error": str(e)}).encode("utf-8"))
            return

        if self.path == "/api/sync-fantasy":
            try:
                cmd_sync_fantasy()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "OK"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ERROR", "error": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()


def cmd_serve(port: int = 8090) -> None:
    lan_ip = get_lan_ip()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", port), RollupRequestHandler) as httpd:
        print("=" * 68)
        print("🚀 RollupOS Multi-User Android App Hub Server Running!")
        print(f"   • Local PC Browser : http://localhost:{port}")
        print(f"   • Phone on Wi-Fi   : http://{lan_ip}:{port}")
        print(f"   • Fantasy Manager  : http://localhost:{port}/apps/fantasy-manager/index.html")
        print("=" * 68)
        httpd.serve_forever()


def cmd_publish(repo_name: str = "android-rollup-app") -> None:
    """Stamp deterministic OTA build hashes, sync sw.js, commit all changes, and push to GitHub."""
    stamp_build_hashes(persist=True)
    git_dir = ROOT_DIR / ".git"
    if not git_dir.exists():
        subprocess.run(["git", "init"], cwd=str(ROOT_DIR), check=True)
        subprocess.run(["git", "branch", "-M", "main"], cwd=str(ROOT_DIR), check=True)

    subprocess.run(["git", "add", "."], cwd=str(ROOT_DIR), check=True)
    status = subprocess.run(
        ["git", "status", "--porcelain"], cwd=str(ROOT_DIR), capture_output=True, text=True
    )
    if status.stdout.strip():
        msg = f"RollupOS Hub & Mini-App sync ({datetime.datetime.now().strftime('%Y-%m-%d %H:%M')})"
        subprocess.run(["git", "commit", "-m", msg], cwd=str(ROOT_DIR), check=True)

    remotes = subprocess.run(
        ["git", "remote"], cwd=str(ROOT_DIR), capture_output=True, text=True
    ).stdout.split()
    if "origin" not in remotes:
        print(f"[RollupOS] Creating GitHub repo '{repo_name}' and pushing...")
        subprocess.run(
            ["gh", "repo", "create", repo_name, "--public", "--source=.", "--remote=origin", "--push"],
            cwd=str(ROOT_DIR),
            check=True,
        )
    else:
        subprocess.run(["git", "push", "-u", "origin", "main"], cwd=str(ROOT_DIR), check=True)

    print("[RollupOS] Published to GitHub!")


def main() -> None:
    parser = argparse.ArgumentParser(description="RollupOS Multi-User Android Mini-App Hub CLI")
    sub = parser.add_subparsers(dest="cmd")

    p_serve = sub.add_parser("serve", help="Run local RollupOS Hub & ACL API server")
    p_serve.add_argument("--port", type=int, default=8090)

    sub.add_parser("sync-fantasy", help="Sync all 12 teams from ESPN League #945552 into fantasy-manager")

    p_create = sub.add_parser("create", help="Scaffold a new multi-user mini-app")
    p_create.add_argument("app_id")
    p_create.add_argument("--title", required=True)
    p_create.add_argument("--subtitle", default="Custom RollupOS Mini-App")
    p_create.add_argument("--icon", default="⚡")
    p_create.add_argument("--category", default="Field & Productivity")

    p_auth = sub.add_parser("authorize", help="Authorize a Google email for a mini-app")
    p_auth.add_argument("email")
    p_auth.add_argument("app_id")
    p_auth.add_argument("--name", default="")
    p_auth.add_argument("--team-id", type=int, default=14)

    p_pub = sub.add_parser("publish", help="Stamp OTA hashes, commit, and push Hub + Mini-Apps to GitHub")
    p_pub.add_argument("--repo", default="android-rollup-app")

    sub.add_parser("stamp", help="Deterministically compute SHA-256 build_hash for Hub & Mini-Apps and sync sw.js")

    p_man = sub.add_parser("manuals", help="Inspect hosted apps and build/update per-app PDF & HTML User Manuals")
    p_man.add_argument("--app", default="", help="Optional single app-id to build")
    p_man.add_argument("--force", action="store_true", help="Force rebuild all manuals even if build_hash is unchanged")

    args = parser.parse_args()
    if args.cmd == "serve":
        cmd_serve(args.port)
    elif args.cmd == "sync-fantasy":
        cmd_sync_fantasy()
    elif args.cmd == "create":
        cmd_create_app(args.app_id, args.title, args.subtitle, args.icon, args.category)
    elif args.cmd == "authorize":
        cmd_authorize_user(args.email, args.app_id, args.name, args.team_id)
    elif args.cmd == "publish":
        cmd_publish(args.repo)
    elif args.cmd == "stamp":
        stamp_build_hashes(persist=True)
    elif args.cmd == "manuals":
        cmd_manuals(args.app, args.force)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
