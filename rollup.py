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
import http.server
import json
import socket
import socketserver
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict

ROOT_DIR = Path(__file__).resolve().parent
REGISTRY_PATH = ROOT_DIR / "registry.json"

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
<script src="../../bridge/rollup-bridge.js"></script>
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
    print(f"[RollupOS] Created mini-app '{app_id}' at {html_file} and registered in registry.json")


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

    def do_POST(self) -> None:
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
    """Initialize git repo if needed, commit all changes, and push to GitHub via gh CLI."""
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

    p_pub = sub.add_parser("publish", help="Commit and push Hub + Mini-Apps to GitHub")
    p_pub.add_argument("--repo", default="android-rollup-app")

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
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
