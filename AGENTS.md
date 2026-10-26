<!-- AUTO-SYNCED BY CSC-SKILL-CORE -->
# RollupOS — Multi-App Android WebAPK & PWA Hub — Workspace `AGENTS.md`

## 1. Purpose & Stack
- **Workspace Folder:** `C:\_AI\android-rollup-app` (virtualized across Work `C:\_AI` and Home `D:\_AI` via NTFS Junction)
- **Primary Stack:** Python FastAPI/Starlette + Progressive Web App (PWA / Service Worker) + Cloud Run
- **Global Rules & MCP:** Inherits `~/.gemini/config/GEMINI.md` and `~/.gemini/config/mcp_config.json` (`outlook-local` + `csc-core-mcp`).

## 2. Key Entrypoints & Architecture
- `rollup.py` — CLI publisher & deterministic SHA-256 `build_hash` manifest generator
- `sw.js` & `registry.json` — Service Worker & app manifest registry

## 3. Non-Obvious Gotchas & Operational Guardrails
- Never rely on manual version string edits alone; always compute CRLF-normalized SHA-256 `build_hash` values via `rollup.py`.
- OTA update probes (`?__ota`) must bypass `CacheStorage` in `sw.js` with `cache: 'no-store'` (`GAP-014`).
- On Windows, launch local servers detached via `Start-Process pythonw.exe` and never pass `--reload` inside `run_command` (`GAP-015`).
- **Deterministic Boundary (`Code -> LLM -> Code`):** Never use an LLM prompt for arithmetic, valve/panel sizing math, or raw table diffs; invoke `csc-core-mcp` or deterministic Python helpers.
- **Windows Console Shield (`GAP-015`):** Never run `uvicorn --reload` or hot-reload supervisors inside `run_command`; use detached `Start-Process pythonw.exe` for persistent local servers.
