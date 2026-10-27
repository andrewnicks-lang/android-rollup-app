#!/usr/bin/env python3
"""
manual_generator.py — Automated Codebase Introspector & Per-App User Manual PDF Engine for RollupOS
Workspace: d:\\_AI\\android-rollup-app

Examines every hosted mini-app in `apps/<app-id>/`, merges static DOM/JS feature extraction
with rich Quickstart & In-Depth Feature guides, tracks `manual_source_hash` against `build_hash`,
and compiles both:
  • manuals/<app-id>_User_Manual.html (AMOLED mobile reader + @media print stylesheet)
  • manuals/<app-id>_User_Manual.pdf  (Print-ready PDF via Microsoft Edge Headless)
"""

from __future__ import annotations

import datetime
import html
import json
import os
import re
import shutil
import subprocess
import tempfile
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


def _find_edge_binary() -> str:
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for c in candidates:
        if Path(c).exists():
            return c
    found = shutil.which("msedge") or shutil.which("google-chrome") or shutil.which("chromium")
    return found or candidates[0]


class _MiniAppDomExtractor(HTMLParser):
    """Extracts interactive buttons, tabs, sections, modals, and form inputs from mini-app HTML."""

    def __init__(self) -> None:
        super().__init__()
        self.title: str = ""
        self._in_title = False
        self._capture_tag: Optional[str] = None
        self._capture_attrs: Dict[str, str] = {}
        self._capture_buf: List[str] = []
        self.buttons: List[Dict[str, str]] = []
        self.tabs: List[str] = []
        self.modals: List[str] = []
        self.inputs: List[str] = []
        self.headings: List[str] = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        ad = {k: (v or "") for k, v in attrs}
        cls = ad.get("class", "")
        el_id = ad.get("id", "")

        if tag == "title":
            self._in_title = True

        if "modal" in cls.lower() or "drawer" in cls.lower() or "modal" in el_id.lower() or "drawer" in el_id.lower():
            if el_id and el_id not in self.modals:
                self.modals.append(el_id)

        if tag == "section" and el_id:
            if el_id not in self.tabs:
                self.tabs.append(el_id)

        if ad.get("data-tab"):
            dt = ad["data-tab"].strip()
            if dt and dt not in self.tabs:
                self.tabs.append(dt)

        if tag in ("input", "select", "textarea"):
            ph = ad.get("placeholder", "").strip()
            if ph and len(ph) < 90 and ph not in self.inputs:
                self.inputs.append(ph)

        if tag in ("button", "h1", "h2", "h3"):
            self._capture_tag = tag
            self._capture_attrs = ad
            self._capture_buf = []

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data
        if self._capture_tag:
            self._capture_buf.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if self._capture_tag == tag:
            txt = re.sub(r"\s+", " ", "".join(self._capture_buf)).strip()
            if tag == "button" and txt and len(txt) <= 65:
                if txt not in ("✕", "✖", "×", "Close", "✕ Close", "✖ Close") and "${" not in txt:
                    onclick = self._capture_attrs.get("onclick", "").strip()
                    if not any(b["label"] == txt for b in self.buttons):
                        self.buttons.append({"label": txt, "action": onclick[:80]})
            elif tag in ("h1", "h2", "h3") and txt and "${" not in txt and len(txt) <= 85:
                if txt not in self.headings:
                    self.headings.append(txt)
            self._capture_tag = None
            self._capture_buf = []


def inspect_mini_app(app_entry: Dict[str, Any], root_dir: Path) -> Dict[str, Any]:
    """Deterministically inspects an app's HTML/JS source tree and Git commit history."""
    app_id = app_entry["id"]
    app_dir = root_dir / "apps" / app_id
    extractor = _MiniAppDomExtractor()

    combined_code = []
    file_inventory: List[str] = []

    if app_dir.exists():
        for fp in sorted(app_dir.rglob("*")):
            if not fp.is_file() or fp.suffix.lower() in (".pyc", ".png", ".jpg", ".jpeg", ".webp", ".woff2"):
                continue
            rel = fp.relative_to(app_dir).as_posix()
            file_inventory.append(rel)
            if fp.suffix.lower() in (".html", ".htm"):
                txt = fp.read_text(encoding="utf-8", errors="replace")
                extractor.feed(txt)
                combined_code.append(txt)
            elif fp.suffix.lower() in (".js", ".mjs"):
                txt = fp.read_text(encoding="utf-8", errors="replace")
                combined_code.append(txt)

    src_blob = "\n".join(combined_code)

    # Extract RollupBridge storage keys, vault secrets, and hardware/web capabilities
    storage_keys = sorted(
        set(re.findall(r"RollupBridge\.storage\.(?:get|set|remove)\(\s*['\"`]([^'\"`$]+)['\"`]", src_blob))
    )
    vault_secrets = sorted(
        set(re.findall(r"RollupBridge\.vault\.(?:getSecret|setSecret)\(\s*['\"`]([^'\"`$]+)['\"`]", src_blob))
    )
    switch_tabs = sorted(
        set(re.findall(r"switchTab\(\s*['\"]([^'\"]+)['\"]\s*\)", src_blob))
    )
    for st in switch_tabs:
        if st not in extractor.tabs:
            extractor.tabs.append(st)

    capabilities: List[str] = ["Isolated Per-User Storage (RollupBridge)"]
    if "RollupBridge.camera" in src_blob or 'capture="environment"' in src_blob or "getUserMedia" in src_blob:
        capabilities.append("Mobile Camera / Multimodal Capture")
    if "AudioContext" in src_blob or "MediaRecorder" in src_blob:
        capabilities.append("WebAudio / Voice Recording Pipeline")
    if "geolocation" in src_blob:
        capabilities.append("Live GNSS / Compass Telemetry")
    if "wakeLock" in src_blob:
        capabilities.append("Screen WakeLock Keep-Awake")
    if "RollupBridge.files" in src_blob or "navigator.share" in src_blob:
        capabilities.append("Android Share Sheet & CSV/JSON Export")
    if vault_secrets or "RollupBridge.vault" in src_blob:
        capabilities.append("Encrypted On-Device Secret Vault")

    # Extract recent git commits for this specific mini-app
    recent_commits: List[Dict[str, str]] = []
    try:
        git_proc = subprocess.run(
            ["git", "log", "-n", "5", "--date=short", "--pretty=format:%h|%ad|%s", "--", f"apps/{app_id}"],
            cwd=str(root_dir),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=5,
        )
        for line in git_proc.stdout.splitlines():
            parts = line.split("|", 2)
            if len(parts) == 3:
                recent_commits.append({"sha": parts[0], "date": parts[1], "subject": parts[2]})
    except Exception:
        pass

    return {
        "app_id": app_id,
        "file_inventory": file_inventory,
        "tabs": extractor.tabs[:12],
        "headings": extractor.headings[:12],
        "buttons": extractor.buttons[:18],
        "modals": extractor.modals[:10],
        "inputs": extractor.inputs[:12],
        "storage_keys": storage_keys,
        "vault_secrets": vault_secrets,
        "capabilities": capabilities,
        "recent_commits": recent_commits,
    }


# Curated, high-signal baseline content for the 7 hosted RollupOS applications
CURATED_BASELINES: Dict[str, Dict[str, Any]] = {
    "gravity-agent-monitor": {
        "tagline": "Real-Time Multi-Workstation Antigravity Telemetry, Trajectory Reader & Live 2-Way AgentAPI Dispatch",
        "quickstart": [
            {
                "step": "Verify Workstation Connection",
                "detail": "Sign into RollupOS as Admin and launch Gravity Agent Monitor. The app automatically unlocks via your Admin session and connects to your primary LAN sidecar (`192.168.86.47:8765`) or Tailscale mesh node."
            },
            {
                "step": "Monitor Live Conversations (Pulse Tab)",
                "detail": "Check the live status indicators on every active desktop conversation: spinning rings indicate active tool execution, bouncing badges signal unread completions, and amber alerts highlight steps awaiting user approval."
            },
            {
                "step": "Inspect Full Step-by-Step Trajectories",
                "detail": "Tap any conversation card on the Pulse tab to jump into Trajectory view—read full user/agent messages, expand collapsible reasoning/tool blocks, and preview generated Markdown artifacts in the slide-up sheet."
            },
            {
                "step": "Reply or Launch New Tasks Remotely",
                "detail": "Type directly into the bottom composer inside Trajectory view to reply to a live session, or open the Ops & Launcher tab (`⚙️ Nodes`) to start a brand-new conversation in any project workspace with 1-tap Skill injection."
            }
        ],
        "navigation_map": [
            {"screen": "📡 Pulse (Sidebar Replica)", "purpose": "Mirrors your desktop Antigravity conversation list across active PCs with unread/running status badges and Auxiliary Overview rollup."},
            {"screen": "📜 Trajectory", "purpose": "Full chronological transcript viewer with tool-call inspection, artifact preview modal, and live 2-way reply bar."},
            {"screen": "🗄️ Vault / Artifacts", "purpose": "Browse recent Markdown plans, reports, and generated workspace deliverables without remoting into your PC."},
            {"screen": "⚙️ Ops & Launcher (`Nodes`)", "purpose": "CPU/RAM host vitals, Multi-PC 'Follow-Me' fleet configuration, Keep-Awake toggle, and new project/skill task dispatcher."}
        ],
        "deep_dive_features": [
            {
                "title": "Multi-PC 'Follow-Me' Dynamic Fleet",
                "body": "Add both your Home PC and Office PC (via LAN IP or `100.x.y.z` Tailscale IP) under Ops & Launcher. Gravity polls all configured nodes in parallel and automatically highlights whichever workstation is actively executing turns."
            },
            {
                "title": "Direct 2-Way AgentAPI Prompt & Skill Dispatch",
                "body": "Uses your workstation's authenticated `X-Gravity-Token` header to dispatch replies into an existing conversation or spin up a new chat scoped to any registered project (`FF_2026`, `Div2`, `CSC Skills`, etc.) with optional pre-populated skill prompts."
            },
            {
                "title": "Coffee / WakeLock Mode for Unattended Builds",
                "body": "Tap `☕ Toggle Keep-Awake` in Ops & Launcher to hold an Android screen WakeLock while monitoring long `/goal` builds or deployments."
            }
        ],
        "pro_tips": [
            "When away from home Wi-Fi, paste your Tailscale IP (`http://100.x.y.z:8765`) in Ops -> Multi-PC Fleet for seamless 5G remote steering.",
            "Tap any artifact link inside a trajectory step to open the formatted Artifact Preview bottom sheet without leaving the chat."
        ]
    },
    "fantasy-manager": {
        "tagline": "Multi-User 12-Team ESPN Fantasy Football Command Center (`Weekend Warriors #945552`) • Moneyball + War Room",
        "quickstart": [
            {
                "step": "Bind Your Personal Team (`⚙️ Switch Team`)",
                "detail": "Tap `⚙️ Switch Team` in the top system strip to pick any of the 12 Weekend Warriors franchises. Your selection is saved privately to your Google account profile without affecting any other league-mate."
            },
            {
                "step": "Dial In Your Moneyball vs. Consensus Blend",
                "detail": "Use the interactive Blend Slider (default `60% Moneyball / 40% Expert Consensus`) on your Roster tab to rank starters, flex options, and waiver targets using usage-weighted expected fantasy points."
            },
            {
                "step": "Lock Your Protected Core (`⭐`) & Test Sandbox Swaps",
                "detail": "Tap the star/lock toggle on untouchable studs so waiver/drop recommendations never suggest cutting your core players, and test lineup swaps safely in your isolated Sandbox."
            },
            {
                "step": "Track Live Matchups & NFL Game Center",
                "detail": "Open the Matchup tab or tap any game pill in the docked NFL Scoreboard ribbon at the bottom to inspect live play-by-play scoring, win probability swings, and active fantasy starters."
            }
        ],
        "navigation_map": [
            {"screen": "🏈 My Roster & Lineup Optimizer", "purpose": "Optimal 1-QB / 2-RB / 2-WR / 1-TE / 2-FLEX / D-ST lineup solver (No-Kicker format), Blend Slider, and Protected Core locks."},
            {"screen": "⚔️ Live Matchup", "purpose": "Head-to-head real-time ESPN scoring, starter-vs-starter positional comparison, and live win projection."},
            {"screen": "🎯 Opponent War Room", "purpose": "Multi-week opponent vulnerability scanner—identifies upcoming opponents' positional holes to execute defensive waiver blocks."},
            {"screen": "📈 Waivers & Watchlist", "purpose": "Filtered free-agent targets ranked by Blended ROS/Weekly value, injury replacement urgency, and your private starred Watchlist."},
            {"screen": "📰 Intel, Standings & NFL Dock", "purpose": "League power rankings, player injury news feed, private player scouting notes, and live NFL Game Center boxscores."}
        ],
        "deep_dive_features": [
            {
                "title": "60/40 Moneyball Blend Engine (Full-PPR, 2-FLEX, No Kicker)",
                "body": "Combines target share, snap share, red-zone opportunity, and Vegas implied team totals (Moneyball) with consensus projections. Sliding toward 100% Moneyball favors volume breakouts before consensus catches up."
            },
            {
                "title": "Multi-Horizon Opponent Counter-Pick War Room",
                "body": "Scans your current and upcoming opponents' bye weeks and injury designations, flagging high-leverage waiver claims that simultaneously upgrade your bench and block your opponent's weakest starter."
            },
            {
                "title": "100% Isolated Multi-User Profiles",
                "body": "Every signed-in user gets an isolated `RollupBridge.storage` bucket for their chosen Team ID, Protected Core locks, Watchlist stars, Sandbox roster moves, and private player scouting notes."
            }
        ],
        "pro_tips": [
            "Check the War Room every Tuesday night before waivers process to spot opponents missing a QB/TE due to bye weeks.",
            "Tap any player row to open the Player Dossier modal and jot down private scouting notes saved strictly to your device profile."
        ]
    },
    "csc-site-discovery": {
        "tagline": "Offline-First HVAC/BAS Field Survey Companion • Division 23 Checklists, CLAHE Nameplate OCR & Building Mapper",
        "quickstart": [
            {
                "step": "Initialize Your Site Walk (`⚙️ Walk / API Vault`)",
                "detail": "Tap `⚙️ Walk / API Vault` (or `Walk / Export`) to enter the Facility Name, CSC Job/Estimate Number (`CSC-26-xxxx`), and optionally save a personal Gemini API key in your private on-device Vault."
            },
            {
                "step": "Add Equipment Stations & Select System Type",
                "detail": "Create stations for AHUs, RTUs, Chillers, Boilers, Hydronic Pumps, VAVs, or Main BAS TCPs. The app dynamically loads the matchingCSC Division 23 (`RFI-23-001` through `RFI-23-011`) engineering checklist."
            },
            {
                "step": "Capture 3-Slot Burst Photos w/ Stamped-Metal CLAHE",
                "detail": "Snap (1) Wide Equipment Context, (2) Rusted/Stamped Nameplate (auto-enhanced via local CLAHE contrast boosting + serial vintage decoding), and (3) Inside Control Cabinet / Termination Strip."
            },
            {
                "step": "Pin Evacuation Floorplan & Export Survey Package",
                "detail": "Snap the wall-mounted Building Evacuation Map, tap to drop equipment pins with GNSS/Compass bearings, record 150Hz high-pass filtered voice walkthroughs, and export the complete JSON/CSV package via Android Share Sheet."
            }
        ],
        "navigation_map": [
            {"screen": "📋 Equipment Station List (Left/Top)", "purpose": "Add, filter, and switch between rooftop, mechanical room, and terminal unit stations during a walk."},
            {"screen": "🔍 Multimodal Station Inspector", "purpose": "Dynamic RFI-23-001..011 checklists, 3-slot CLAHE camera capture, serial age decoder, and 150Hz filtered voice notes."},
            {"screen": "🗺️ 4-Layer Building & Evac Mapper", "purpose": "Pin equipment stations directly onto photographed floorplans/evacuation maps with compass orientation and Laplacian video sharpness scoring."},
            {"screen": "🧮 Field Valve / VA / Labor Sizers", "purpose": "On-site deterministic Cv valve sizer (4–5 psi ΔP / β ≥ 0.50), NEC Art. 725 80% Class 2 panel VA sizer, and rough-in labor estimator."},
            {"screen": "⚙️ Session Manager, Vault & Export", "purpose": "Manage walk metadata, optional Gemini OCR key, Golden Demo Walk loader, and 1-tap JSON/CSV exports."}
        ],
        "deep_dive_features": [
            {
                "title": "CSC Overlay & Safety Checklist Enforcement (`RFI-23-001`..`011`)",
                "body": "Prompts field engineers to verify factory OEM BACnet cards (`Overlay, Never Gut`), hardwired VFD HOA/speed split (`RFI-23-006`), DPDT manual-reset serpentine freeze stats (`RFI-23-007`), Div 23 21 13 inline valve/well boundaries (`RFI-23-005`), and dedicated Div 26 120VAC 15A TCP circuits (`RFI-23-009`)."
            },
            {
                "title": "CLAHE Stamped-Aluminum Nameplate Enhancer & Offline Queue",
                "body": "Applies local canvas Contrast-Limited Adaptive Histogram Equalization so sun-bleached or rusted outdoor RTU/chiller data plates become legible instantly—working 100% offline in mechanical basements."
            },
            {
                "title": "150Hz Mechanical-Room High-Pass Audio Filter",
                "body": "Uses WebAudio high-pass filtering to strip low-frequency fan/pump rumble (`<150Hz`) from walk-and-talk voice memos for crystal-clear Whisper transcription back at the office."
            }
        ],
        "pro_tips": [
            "Always enforce NFPA 70E Lockout/Tagout (LOTO) and PPE before opening live control cabinets for internal termination photos.",
            "No cell signal in a sub-basement chiller plant? Leave the API key blank—every photo, checklist, and voice clip saves to IndexedDB/RollupBridge offline."
        ]
    },
    "shd-div2-intel": {
        "tagline": "100% EAC-Safe Division 2 Armory, 6-Slot Theorycraft Workbench, Build Solver & Expertise 413/500 Tracker",
        "quickstart": [
            {
                "step": "Load Your Armory Seed or Import Snapshot (`⚙️ PC Sync / Vault`)",
                "detail": "Open SHD Build Intelligence and tap `⚙️ PC Sync / Vault` (or the top Sync button) to pull your PC Armory seed or import a saved `.json` gear dump into your isolated Google user profile."
            },
            {
                "step": "Filter & Inspect Rolled Gear in the Armory",
                "detail": "Search weapons, exotics, named items, brand sets, and gear sets—tap any item row for Click-to-Verify roll percentages, core attributes, talents, and recalibration potential."
            },
            {
                "step": "Theorycraft in the 6-Slot Interactive Workbench",
                "detail": "Equip Mask, Backpack, Chest, Gloves, Holster, and Kneepads (or clone an Admin Showcase Loadout like `Lengmo Pesti Turm`) to see live brand bonuses, CHC/CHD caps, and synergy diagnostics."
            },
            {
                "step": "Track Countdown Loot & Expertise (`413/500`)",
                "detail": "Check the Countdown Target Loot Radar to see which brand/slot to farm next, and log proficiency ranks in the Expertise Mastery Tracker."
            }
        ],
        "navigation_map": [
            {"screen": "🎒 Armory Inventory", "purpose": "Searchable, filterable gear & weapon database with God-roll badges and Click-to-Verify attribute breakdown modals."},
            {"screen": "🛠️ 6-Slot Build Workbench", "purpose": "Interactive loadout assembler with Admin Showcase templates, live brand-set bonus counters, and stat rollups."},
            {"screen": "🧠 Build Solver & Target Radar", "purpose": "100% EAC-safe deterministic solver matching your owned stash items against target DPS/Skill/Tank archetypes and Countdown farm priorities."},
            {"screen": "🎖️ Expertise Tracker", "purpose": "Category-by-category proficiency checklist toward max Expertise (`413/500+`) saved per user."},
            {"screen": "⚙️ Backup Vault & PC <-> Hub Sync", "purpose": "1-tap JSON backup export/import and PC-to-Android cartridge synchronization."}
        ],
        "deep_dive_features": [
            {
                "title": "100% Easy Anti-Cheat (EAC) Safe Architecture",
                "body": "Operates strictly on exported OCR/JSON inventory snapshots—zero game memory hooks, zero packet inspection, and full offline mobile theorycrafting anywhere."
            },
            {
                "title": "Cloneable Admin Showcase Loadouts",
                "body": "Friends/clanmates authorized on RollupOS can inspect read-only Admin Showcase builds (`Lengmo Pesti Turm`, Striker setups, etc.) and clone them into their own private Workbench without overwriting your stash."
            }
        ],
        "pro_tips": [
            "Before deconstructing stash clutter in-game, filter the Build Solver to verify an item isn't a unicorn off-brand roll needed for a hybrid chest/backpack slot.",
            "Export a `.json` backup snapshot after major Countdown farming sessions so your PC and phone stay in lockstep."
        ]
    },
    "sapphire-companion": {
        "tagline": "Private Admin-Only 24/7 Fiduciary Ambient Strategist • Iceberg `[Defend That]` Receipts & Stage-Never-Send Inbox",
        "quickstart": [
            {
                "step": "Configure Your Sapphire Endpoint (`⚙️ Settings`)",
                "detail": "Tap `⚙️ Settings` in the top system strip to set your `sapphire_cloud_url` (Cloud Run URL for 24/7 mobile access or `http://127.0.0.1:8085` when tunneling locally)."
            },
            {
                "step": "Set Your Ambient Operating Posture",
                "detail": "Use the top-right mode selector (`🟢 Active`, `🌙 Silent`, or `⛔ Off`) to control whether Sapphire proactively surfaces briefings or queues items quietly in your Staged Inbox."
            },
            {
                "step": "Chat & Audit Reasoning via `🛡️ Defend That`",
                "detail": "Send concise strategic questions in the mobile stream. Every substantive recommendation carries an Iceberg `🛡️ Defend That` button that reveals full underlying fiduciary receipts on demand."
            },
            {
                "step": "Review Your Stage-Never-Send Inbox",
                "detail": "Inspect pending drafts and action items prepared by Sapphire—nothing is ever transmitted externally without your explicit review and approval."
            }
        ],
        "navigation_map": [
            {"screen": "💎 Ambient Posture Header", "purpose": "Live connection telemetry, pending inbox badge count, and 1-tap `Active / Silent / Off` master mode switch."},
            {"screen": "💬 Fiduciary Strategy Stream", "purpose": "Low-noise conversational feed with expandable `🛡️ Defend That` evidentiary receipts."},
            {"screen": "📥 Staged Inbox (`Stage, Never Send`)", "purpose": "Queue of drafted responses and flagged workspace items awaiting human sign-off, plus deep link to Full Slider Studio."},
            {"screen": "⚙️ Cartridge Settings Sheet", "purpose": "Configure Cloud Run / Local endpoint URL, reset local cache, and open this User Manual PDF."}
        ],
        "deep_dive_features": [
            {
                "title": "Iceberg Output Pattern (`🛡️ Defend That`)",
                "body": "Keeps mobile replies concise and executive-ready on the surface while preserving deterministic citations, calendar/email context, and trade-off math one tap underneath."
            },
            {
                "title": "Strict `Stage, Never Send` Safety Boundary",
                "body": "Enforces human-in-the-loop governance: Sapphire prepares drafts in your Staged Inbox and never auto-sends external emails or mutates production records unapproved."
            }
        ],
        "pro_tips": [
            "Switch to `🌙 Silent` during deep-focus meetings so Sapphire continues triaging into your Staged Inbox without interruptions."
        ]
    },
    "field-snap": {
        "tagline": "Fast Mobile Photo & Field Note Logger • Hardware Camera Compression, Project Tagging & Instant CSV Export",
        "quickstart": [
            {
                "step": "Set Your Default Project Tag (`⚙️ Settings`)",
                "detail": "Tap `⚙️ Settings` in the top system strip to configure your default Project / Job Tag (pre-fills automatically on every new note) or type a custom tag per entry."
            },
            {
                "step": "Snap a Compressed Rear-Camera Photo (`📷`)",
                "detail": "Tap `📷 Snap / Attach Photo` to launch your Android rear camera. RollupBridge automatically resizes (`1280px` max width) and JPEG-compresses (`82%`) images so hundreds of snaps fit comfortably on device."
            },
            {
                "step": "Log Observation & Save Privately (`💾`)",
                "detail": "Enter a quick field observation and tap `💾 Save Entry`. Entries are stored strictly under your signed-in Google email namespace."
            },
            {
                "step": "Export Structured CSV (`📤 Export CSV`)",
                "detail": "Tap `📤 Export CSV` at the top right to download a clean spreadsheet of timestamps, project tags, notes, and photo flags."
            }
        ],
        "navigation_map": [
            {"screen": "📸 Capture & Quick Note Card", "purpose": "Project tag input, multi-line field observation box, live camera thumbnail preview, and 1-tap save."},
            {"screen": "🗂️ Isolated Entries Feed", "purpose": "Chronological timeline of your saved photos and notes with per-item delete (`✕`) controls."},
            {"screen": "📤 CSV Exporter & ⚙️ Settings", "purpose": "1-tap CSV report download, default project configuration, and User Manual PDF access."}
        ],
        "deep_dive_features": [
            {
                "title": "Client-Side Canvas Photo Compression (`RollupBridge.camera`)",
                "body": "Raw 12MP–50MP phone photos (`5–12 MB` each) would quickly exhaust browser storage quotas. Field Snap compresses captures on-device into crisp `~120–220 KB` JPEGs in milliseconds."
            },
            {
                "title": "Zero Cross-User Leakage",
                "body": "Two technicians signing into the same shared tablet or their own phones each see only their own `rollup::v1::u::<email>::app::field-snap::entries` bucket."
            }
        ],
        "pro_tips": [
            "Use consistent project prefixes (e.g., `CSC-26-4182`) so exported CSVs sort and pivot cleanly in Excel."
        ]
    },
    "bridge-lab": {
        "tagline": "Admin Multi-Tenant Diagnostic Console • Session Verification, Live ACL Matrix & Storage Namespace Inspector",
        "quickstart": [
            {
                "step": "Launch as Hub Administrator",
                "detail": "Bridge Lab is gated with `visibility: admin_only`. Non-admin testers attempting to open its URL are automatically blocked by `RollupBridge.enforceAccessGate`."
            },
            {
                "step": "Verify Active Session & Impersonation State",
                "detail": "Check Panel 1 (`Active Session & Role Verification`) to inspect the hydrated user object, Google email, role badge, and admin flags."
            },
            {
                "step": "Audit the Live Access Control Matrix (ACL)",
                "detail": "Inspect Panel 2 (`Live Hub Access Control Matrix`) to confirm exact `authorized_apps` arrays and `default_app_configs` synced from `registry.json` or mobile Admin edits."
            },
            {
                "step": "Inspect Raw `rollup::v1::*` Device Keys",
                "detail": "Review Panel 3 to audit every isolated per-user storage key, secret vault key name, and OTA `installed_ledger` entry stored on the current device."
            }
        ],
        "navigation_map": [
            {"screen": "1. Active Session & Role Card", "purpose": "Displays live JSON output of `RollupBridge.auth.getCurrentUser()`."},
            {"screen": "2. Live Hub ACL Matrix Card", "purpose": "Displays complete multi-user permission dictionary from `RollupBridge.auth.getACL()`."},
            {"screen": "3. Device Storage Key Ledger", "purpose": "Sorted inventory of all `rollup::v1::*` keys in `localStorage` for isolation auditing."},
            {"screen": "⚙️ Universal Settings Sheet", "purpose": "Quick access to storage reset tools and this diagnostic User Manual PDF."}
        ],
        "deep_dive_features": [
            {
                "title": "Zero-Trust Namespace Verification",
                "body": "Confirms visually that every app writes strictly under `rollup::v1::u::<email>::app::<appId>::<key>`, preventing cross-user or cross-cartridge state collisions."
            }
        ],
        "pro_tips": [
            "Use `👁️ Preview as User` in Hub Admin Mode first, then check which apps remain visible—confirming `admin_only` cartridges like Bridge Lab stay hidden from testers."
        ]
    },
    "lightning-garage": {
        "tagline": "Blue Oval Garage v2.1 — 2011–2026+ Ford & Lincoln USB-C Live OBD-II Backup, FORScan Modded .abt Handoff, VIN Scanner & Deterministic As-Built Engine",
        "quickstart": [
            {
                "step": "Select or Add Any 2011–2026+ Ford/Lincoln (`🔵 Garage & VIN`)",
                "detail": "Your 2023 F-150 Lightning ER Lariat (`1FT6W1EV4PWG11434`, ⚡ BEV) is pre-seeded as Vehicle #1. Tap `+ Add Vehicle` to add any 2011–2026+ Ford or Lincoln by typing a 17-char VIN or scanning the door-jamb B-pillar sticker / windshield VIN plate with the Hybrid Camera Barcode + OCR Scanner."
            },
            {
                "step": "Capture a Live USB-C OBD-II As-Built Snapshot or Import `.abt`/`.ab` (`🛡️ Backups`)",
                "detail": "Plug your OBDLink EX or Vgate vLinker FS into your phone via a USB-A-to-USB-C OTG adapter, put the truck in Ready/KOER mode (`ATRV >= 12.5V`), and run a ~20s `Targeted Mod Backup` across Primary `DIAG1` (`STP33` 500k) and Secondary `DIAG2` (`STP53 + STPBR500000`) or 2011–2020 MS-CAN (`STP53 + STPBR125000`)—or import existing FORScan `.abt` (including FORScan >= 2.3.23 `G0`-encoded files) and Motorcraft `.ab` XML."
            },
            {
                "step": "Browse 183 Recipes, 21 Master Spreadsheets & Custom Lines (`🎛️ Mod Menu`)",
                "detail": "Browse 183 verified recipes across 6 upstream platforms (`f150`, `super_duty`, `bronco`, `explorer`, `ranger_6g`, `mustang`), download 1-click `.xlsx`/`.pdf` community master spreadsheets (Livnitup, ZooDad, DanMc85) for all 21 platforms, or use `➕ Quick-Add Custom Spreadsheet Line` to enter any forum/spreadsheet hex mod with deterministic checksum dry-run."
            },
            {
                "step": "Export Modded `.abt`, Offline `Vault .zip` & Sync to Windows FORScan (`📋 Session Plan`)",
                "detail": "Open the `📋 Plan` tab to generate both a line-by-line hex diff checklist and a pre-computed `G0`-encoded modded `.abt` file (guarded against stale pre-OTA `F188` firmware drift). Save or Share a deterministic `Vault .zip` archive offline (`📦 Save Vault .zip` / `📤 Share Vault .zip`), or scan the 15-minute Desktop QR PIN to stage modded `.abt` files directly into `Documents\\FORScan\\LightningGarage_Staging\\` for FORScan's `Load All` button."
            }
        ],
        "navigation_map": [
            {"screen": "🔵 Garage & VIN", "purpose": "Multi-vehicle garage switcher, Hybrid Camera Barcode/OCR VIN scanner with ISO 3779 Modulo-11 auto-repair, offline + NHTSA vPIC decoder, and JSON/ZIP Vault export/import."},
            {"screen": "🎛️ Mod Menu (183 Recipes + Custom)", "purpose": "3-Layer FORScan catalog: 183 platform-filtered recipes, 21 curated community master spreadsheets (.xlsx/.pdf), and Quick-Add Custom Spreadsheet Line builder."},
            {"screen": "🧩 Modules (87 Addresses)", "purpose": "Complete Ford/Lincoln control module directory (`726`, `7D0`, `720`, `740/741`, `7E7`, `746`, etc.) with CGEA 1.2/1.3 MS-CAN (`STP53` @ 125k) vs. Gen14 `DIAG2` (`STP53` @ 500k) notes, write-risk ratings, and per-vehicle backup evidence."},
            {"screen": "🛡️ Backups & Live USB-C", "purpose": "Native USB-C OTG read-only OBD-II scanner (`ATRV >= 12.5V` gate, Quick Health / Targeted / Full Backup), offline `Vault .zip` Save/Share, time-boxed QR Phone-to-PC sync, `.abt`/`.ab` importer (`G0`-codec aware), and Factory drift differ."},
            {"screen": "📋 Session Plan & Load-All Handoff", "purpose": "Generates printable line-by-line FORScan checklists, `F188`-verified pre-computed modded `.abt` files, and multi-module `.zip` handoff bundles ready for Windows `FORScan.exe` (`Load All` -> `Write`)."}
        ],
        "deep_dive_features": [
            {
                "title": "Native USB-C OTG Read-Only UDS Engine & Dual-Bus Switching",
                "body": "Uses `usb-serial-for-android` with a compiled Kotlin byte-level allowlist (`0x22`, `0x19`, `0x3E`, parked-only `0x10 01/03`, and ISO-TP `STP33`/`STP53`—physically blocking `0x2E` writes, `0x27` security unlock, and raw non-ISO-TP `STP31`). Handles multi-baud negotiation, `ATS0`/`ATS1` ISO-TP slicing, ISO 14229-2 P2* (`+5.5s`, `15s` cap) UART deadline extension on `0x78` ResponsePending frames, and `ATRV >= 12.5V` battery gating."
            },
            {
                "title": "FORScan >= 2.3.23 `G0`-Codec Modded `.abt` Handoff, Offline `Vault .zip` & Stale Pre-OTA `F188` Guard",
                "body": "Exports numerically sorted pure `;Block N` `G0`-encoded `.abt` files (`01 -> G1`, `101 -> M5`) and zero-dependency IEEE 802.3 CRC-32 PKZIP `Vault .zip` bundles (`FORScan_Staging/*_MODDED.abt` + `SESSION_CHECKLIST.txt` + raw `.abt` backups) while binding every baseline to its live `F188` software strategy so stale pre-OTA files cannot overwrite newly calibrated factory bytes."
            },
            {
                "title": "Hybrid VIN Barcode + Optical Confusable Auto-Repair & 183-Recipe Engine",
                "body": "Combines native `BarcodeDetector` (Code 39 / DataMatrix with automatic 18th-char `'I'` guard stripping), ISO 3779 Modulo-11 optical confusable repair, 183 structured recipes across 6 platforms + 21 community master spreadsheets, and deterministic Ford Modulo-256 line checksum math."
            }
        ],
        "pro_tips": [
            "Always put your F-150 Lightning in Ready mode (foot on brake + Start in Park so the HV DC-DC converter holds ~14.4V) before running multi-module Extended Session (`10 03`) As-Built backups.",
            "On STN cables like OBDLink EX, Primary HS-CAN (`DIAG1`, Pins 6 & 14 @ 500k) uses ISO-TP protocol `STP33`, Gen14 Secondary HS-CAN (`DIAG2`, Pins 3 & 11 @ 500k) uses `STP53 + STPBR500000`, and 2011–2020 CGEA 1.2/1.3 MS-CAN (Pins 3 & 11 @ 125k) uses `STP53 + STPBR125000`."
        ]
    }
}


def _synthesize_generic_baseline(app_entry: Dict[str, Any], inspected: Dict[str, Any]) -> Dict[str, Any]:
    """Automatically synthesizes a clean Quickstart + Feature guide for brand-new mini-apps created via `rollup.py create`."""
    title = app_entry.get("title", app_entry["id"])
    vis = app_entry.get("visibility", "restricted")
    btn_names = [b["label"] for b in inspected.get("buttons", [])[:5]]
    tabs = inspected.get("tabs", [])

    nav_rows = [{"screen": f"🧭 {t}", "purpose": f"Primary '{t}' view discovered in {title}."} for t in tabs[:6]]
    if not nav_rows:
        nav_rows = [
            {"screen": f"📱 {title} Main Workspace", "purpose": app_entry.get("description") or app_entry.get("subtitle", "Primary interactive mini-app view.")},
            {"screen": "⚙️ Cartridge Settings & Manual", "purpose": "Configure per-user preferences, manage isolated storage, and open this User Manual PDF."}
        ]

    return {
        "tagline": app_entry.get("subtitle") or f"RollupOS Hosted Cartridge • {title}",
        "quickstart": [
            {
                "step": "Sign In & Launch from RollupOS Hub",
                "detail": f"Sign in with an authorized Google account (`visibility: {vis}`) and launch **{title}** from the RollupOS Hub dashboard."
            },
            {
                "step": "Review Per-User Settings (`⚙️`)",
                "detail": "Tap the `⚙️` button in the 29px Top System Strip to configure your personal preferences and review isolated profile storage."
            },
            {
                "step": "Use Core Interactive Controls",
                "detail": (
                    f"Interact with the primary workspace actions ({', '.join(btn_names)})—all state saves automatically to your isolated user bucket."
                    if btn_names
                    else "Interact with the main workspace cards—all saved data stays isolated to your signed-in Google account."
                )
            },
            {
                "step": "Automatic OTA Updates",
                "detail": "Whenever a newer version is published, the Top System Strip automatically displays an `⬆️ Update` pill for 1-tap reload."
            }
        ],
        "navigation_map": nav_rows,
        "deep_dive_features": [
            {
                "title": "Workspace Overview",
                "body": app_entry.get("description") or f"{title} runs inside the RollupOS multi-user container with full offline Service Worker caching."
            },
            {
                "title": "Multi-User Storage & Hardware Bridge",
                "body": "Powered by `RollupBridge` (`" + ", ".join(inspected.get("capabilities", [])) + "`)."
            }
        ],
        "pro_tips": [
            "Tap `← Rollup Hub` in the top-left system strip anytime to switch between authorized mini-apps without signing out."
        ]
    }


def _maybe_enrich_delta_with_gemini(app_title: str, new_buttons: List[str], recent_commits: List[Dict[str, str]]) -> Optional[str]:
    """Optional non-blocking Gemini prose summary when GEMINI_API_KEY is present and new UI controls were added."""
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key or (not new_buttons and not recent_commits):
        return None
    try:
        commits_txt = "; ".join(f"{c['sha']}: {c['subject']}" for c in recent_commits[:3])
        prompt = (
            f"Write 2 concise, helpful user-manual sentences summarizing the latest capabilities/updates in '{app_title}'. "
            f"Newly detected UI buttons: {', '.join(new_buttons[:8]) or 'none'}. Recent commits: {commits_txt or 'initial release'}. "
            "Plain text only, no markdown headers."
        )
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        req = urllib.request.Request(
            url,
            data=json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=7) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
            cand = payload.get("candidates", [{}])[0]
            parts = cand.get("content", {}).get("parts", [{}])
            txt = (parts[0].get("text") or "").strip()
            return txt if txt else None
    except Exception:
        return None


def build_manual_spec(app_entry: Dict[str, Any], root_dir: Path, prev_spec: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Builds the complete structured manual specification by combining curated/synthesized docs with live codebase introspection."""
    app_id = app_entry["id"]
    inspected = inspect_mini_app(app_entry, root_dir)
    baseline = CURATED_BASELINES.get(app_id) or _synthesize_generic_baseline(app_entry, inspected)

    prev_btn_labels = set()
    if prev_spec and isinstance(prev_spec.get("inspected"), dict):
        prev_btn_labels = {b.get("label", "") for b in prev_spec["inspected"].get("buttons", [])}
    curr_btn_labels = [b["label"] for b in inspected["buttons"]]
    newly_added_buttons = [lbl for lbl in curr_btn_labels if lbl and lbl not in prev_btn_labels] if prev_btn_labels else []

    ai_release_note = _maybe_enrich_delta_with_gemini(
        app_entry.get("title", app_id), newly_added_buttons, inspected["recent_commits"]
    )

    return {
        "app_id": app_id,
        "title": app_entry.get("title", app_id),
        "subtitle": app_entry.get("subtitle", ""),
        "description": app_entry.get("description", ""),
        "icon": app_entry.get("icon", "📱"),
        "accent": app_entry.get("accent", "#38bdf8"),
        "category": app_entry.get("category", "General"),
        "version": app_entry.get("version", "1.0.0"),
        "build_hash": app_entry.get("build_hash", ""),
        "visibility": app_entry.get("visibility", "restricted"),
        "updated_at": app_entry.get("updated_at", datetime.datetime.now().isoformat()),
        "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "tagline": baseline["tagline"],
        "quickstart": baseline["quickstart"],
        "navigation_map": baseline["navigation_map"],
        "deep_dive_features": baseline["deep_dive_features"],
        "pro_tips": baseline.get("pro_tips", []),
        "user_config_schema": app_entry.get("userConfigSchema", []),
        "offline_assets": app_entry.get("offline_assets", []),
        "newly_added_buttons": newly_added_buttons,
        "ai_release_note": ai_release_note,
        "inspected": inspected,
    }


def render_manual_html(spec: Dict[str, Any]) -> str:
    """Renders a dual-theme HTML manual: AMOLED Dark Mode on mobile screens + Crisp White Executive Layout in PDF/@media print."""
    esc = html.escape
    accent = spec.get("accent") or "#38bdf8"
    app_id = spec["app_id"]
    vis_label = {
        "admin_only": "👑 Admin-Only Cartridge",
        "restricted": "🔒 Per-User Authorized Cartridge",
        "public": "🌐 Public Hub Cartridge",
    }.get(spec.get("visibility", "restricted"), "🔒 Authorized Cartridge")

    # 1. Quickstart Steps HTML
    qs_html = "\n".join(
        f"""
        <div class="step-card">
          <div class="step-num">{idx}</div>
          <div class="step-body">
            <div class="step-title">{esc(item['step'])}</div>
            <div class="step-desc">{esc(item['detail'])}</div>
          </div>
        </div>"""
        for idx, item in enumerate(spec.get("quickstart", []), start=1)
    )

    # 2. Navigation Map Table
    nav_rows = "\n".join(
        f"""
        <tr>
          <td style="font-weight:700;white-space:nowrap;">{esc(row['screen'])}</td>
          <td>{esc(row['purpose'])}</td>
        </tr>"""
        for row in spec.get("navigation_map", [])
    )

    # 3. In-Depth Features HTML
    feat_html = "\n".join(
        f"""
        <div class="feature-box">
          <h3>{esc(f['title'])}</h3>
          <p>{esc(f['body'])}</p>
        </div>"""
        for f in spec.get("deep_dive_features", [])
    )

    # 4. Settings & User Config Schema Table
    cfg_schema = spec.get("user_config_schema", [])
    if cfg_schema:
        cfg_rows = "\n".join(
            f"""
            <tr>
              <td><code>{esc(str(c.get('key', '')))}</code></td>
              <td style="font-weight:600;">{esc(str(c.get('label', '')))}</td>
              <td><code>{esc(str(c.get('type', 'text')))}</code></td>
              <td><code>{esc(str(c.get('default', '—')))}</code></td>
            </tr>"""
            for c in cfg_schema
        )
        cfg_table_html = f"""
        <table>
          <thead>
            <tr>
              <th>Setting Key</th>
              <th>Field Description</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>{cfg_rows}</tbody>
        </table>"""
    else:
        cfg_table_html = (
            '<div class="subtle-box">Zero manual setup fields required — profile state binds automatically to your Google account session.</div>'
        )

    # 5. Live Introspected Controls, Capabilities & Storage Isolation
    insp = spec.get("inspected", {})
    caps_badges = "".join(f'<span class="chip">{esc(c)}</span>' for c in insp.get("capabilities", []))
    btn_badges = "".join(
        f'<span class="chip chip-muted">{esc(b["label"])}</span>' for b in insp.get("buttons", [])[:14]
    ) or '<span class="chip chip-muted">Dynamic Touch Interface</span>'

    storage_keys = insp.get("storage_keys", [])
    storage_txt = ", ".join(f"<code>{esc(k)}</code>" for k in storage_keys) if storage_keys else "<code>__user_config__</code> (Managed automatically)"
    vault_keys = insp.get("vault_secrets", [])
    vault_txt = ", ".join(f"<code>{esc(v)}</code>" for v in vault_keys) if vault_keys else "None required (uses Hub session)"

    # 6. Pro Tips & Auto-Detected Release Log
    tips_html = "\n".join(f"<li>{esc(t)}</li>" for t in spec.get("pro_tips", []))
    commits = insp.get("recent_commits", [])
    commits_html = "\n".join(
        f'<li><code>{esc(c["sha"])}</code> <span class="muted">({esc(c["date"])})</span> — {esc(c["subject"])}</li>'
        for c in commits
    ) or "<li>Initial stamped cartridge release in RollupOS Hub.</li>"

    new_btns = spec.get("newly_added_buttons") or []
    delta_banner = ""
    if new_btns or spec.get("ai_release_note"):
        note = esc(spec["ai_release_note"]) if spec.get("ai_release_note") else (
            f"Auto-detected new interactive controls in v{esc(spec['version'])}: " + ", ".join(esc(b) for b in new_btns)
        )
        delta_banner = f'<div class="delta-callout"><strong>🆕 What Changed in This Build:</strong> {note}</div>'

    pdf_filename = f"{app_id}_User_Manual.pdf"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(spec['title'])} — RollupOS User Manual (v{esc(spec['version'])})</title>
<style>
  @page {{
    size: letter;
    margin: 0.48in 0.5in;
  }}
  :root {{
    --accent: {accent};
    --bg-page: #070b14;
    --bg-card: #111827;
    --bg-subtle: #0f172a;
    --text-main: #f8fafc;
    --text-sec: #cbd5e1;
    --text-muted: #94a3b8;
    --border: #1e293b;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    padding: 16px;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    background: var(--bg-page);
    color: var(--text-main);
    font-size: 13px;
    line-height: 1.5;
  }}
  .manual-shell {{
    max-width: 780px;
    margin: 0 auto;
  }}
  .screen-toolbar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 8px 12px;
    margin-bottom: 12px;
  }}
  .pdf-dl-btn {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #0284c7;
    color: #ffffff;
    text-decoration: none;
    font-weight: 800;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 8px;
  }}
  .hero {{
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f8fafc;
    padding: 18px 20px;
    border-radius: 12px;
    border-left: 5px solid var(--accent);
    border-top: 1px solid #334155;
    border-right: 1px solid #334155;
    border-bottom: 1px solid #334155;
    margin-bottom: 16px;
  }}
  .hero-top {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }}
  .hero-kicker {{
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #38bdf8;
  }}
  .hero h1 {{
    margin: 4px 0 4px 0;
    font-size: 21px;
    letter-spacing: -0.3px;
  }}
  .hero-sub {{
    font-size: 12.5px;
    color: #cbd5e1;
  }}
  .meta-strip {{
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid rgba(148, 163, 184, 0.25);
    font-size: 10.5px;
  }}
  .meta-pill {{
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid #475569;
    color: #e2e8f0;
    padding: 2px 8px;
    border-radius: 99px;
    font-weight: 700;
  }}
  h2 {{
    font-size: 14.5px;
    margin: 18px 0 9px 0;
    padding-bottom: 5px;
    border-bottom: 2px solid var(--border);
    color: var(--text-main);
    page-break-after: avoid;
  }}
  .step-grid {{
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }}
  .step-card {{
    display: flex;
    gap: 11px;
    align-items: flex-start;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
    page-break-inside: avoid;
  }}
  .step-num {{
    width: 24px;
    height: 24px;
    border-radius: 99px;
    background: var(--accent);
    color: #070b14;
    font-weight: 900;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }}
  .step-title {{
    font-weight: 800;
    font-size: 13px;
    margin-bottom: 2px;
  }}
  .step-desc {{
    font-size: 12px;
    color: var(--text-sec);
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 11.8px;
    margin-top: 6px;
    background: var(--bg-card);
    border-radius: 8px;
    overflow: hidden;
  }}
  th, td {{
    border: 1px solid var(--border);
    padding: 7px 9px;
    text-align: left;
    vertical-align: top;
  }}
  th {{
    background: #0f172a;
    color: #f8fafc;
    font-weight: 800;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }}
  .feature-box {{
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 9px;
    padding: 10px 13px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }}
  .feature-box h3 {{
    margin: 0 0 4px 0;
    font-size: 13px;
  }}
  .feature-box p {{
    margin: 0;
    font-size: 12px;
    color: var(--text-sec);
  }}
  .subtle-box {{
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 9px;
    padding: 10px 12px;
    font-size: 12px;
    color: var(--text-sec);
    page-break-inside: avoid;
  }}
  .delta-callout {{
    background: rgba(245, 158, 11, 0.14);
    border: 1px solid #f59e0b;
    border-radius: 9px;
    padding: 9px 12px;
    font-size: 12px;
    margin-bottom: 12px;
  }}
  .chip-wrap {{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 6px;
  }}
  .chip {{
    font-size: 10.5px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 99px;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.45);
    color: #bae6fd;
  }}
  .chip-muted {{
    background: var(--bg-subtle);
    border-color: var(--border);
    color: var(--text-sec);
  }}
  code {{
    font-family: Consolas, 'SFMono-Regular', monospace;
    font-size: 11px;
    background: rgba(148, 163, 184, 0.16);
    padding: 1px 5px;
    border-radius: 4px;
  }}
  ul {{
    margin: 6px 0;
    padding-left: 19px;
  }}
  li {{
    margin-bottom: 5px;
    font-size: 12px;
    color: var(--text-sec);
  }}
  .muted {{ color: var(--text-muted); }}
  .footer-stamp {{
    margin-top: 18px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    font-size: 10.5px;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
  }}

  /* Clean Executive Print Stylesheet for Edge Headless PDF Generation */
  @media print {{
    :root {{
      --bg-page: #ffffff;
      --bg-card: #f8fafc;
      --bg-subtle: #f1f5f9;
      --text-main: #0f172a;
      --text-sec: #334155;
      --text-muted: #64748b;
      --border: #cbd5e1;
    }}
    body {{
      padding: 0;
      font-size: 9.8pt;
      line-height: 1.42;
      background: #ffffff;
      color: #0f172a;
    }}
    .screen-toolbar {{ display: none !important; }}
    .hero {{
      padding: 14px 18px;
      margin-bottom: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    th, .step-num {{
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .step-num {{ color: #ffffff; background: #0f172a; }}
    .chip {{
      background: #e0f2fe;
      border-color: #0284c7;
      color: #075985;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .chip-muted {{
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #334155;
    }}
    code {{
      background: #f1f5f9;
      color: #0f172a;
    }}
  }}
</style>
</head>
<body>
<div class="manual-shell">
  <div class="screen-toolbar">
    <span style="font-size:11.5px;font-weight:700;color:#93c5fd;">📖 RollupOS Auto-Maintained Application Manual</span>
    <a class="pdf-dl-btn" href="./{esc(pdf_filename)}?h={esc(spec.get('build_hash', ''))}" target="_blank">📄 Open / Download Official PDF</a>
  </div>

  <div class="hero">
    <div class="hero-top">
      <div>
        <div class="hero-kicker">RollupOS Application User Manual • {esc(spec['category'])}</div>
        <h1>{esc(spec['icon'])} {esc(spec['title'])}</h1>
        <div class="hero-sub">{esc(spec['tagline'])}</div>
      </div>
    </div>
    <div class="meta-strip">
      <span class="meta-pill">Version: v{esc(spec['version'])}</span>
      <span class="meta-pill">Build Hash: #{esc(spec.get('build_hash', '')[:8] or 'live')}</span>
      <span class="meta-pill">{esc(vis_label)}</span>
      <span class="meta-pill">Auto-Synced: {esc(spec['generated_at'])}</span>
    </div>
  </div>

  {delta_banner}

  <h2>1. ⚡ 60-Second Quickstart Guide</h2>
  <div class="step-grid">
    {qs_html}
  </div>

  <h2>2. 🧭 Screen-by-Screen &amp; Navigation Map</h2>
  <table>
    <thead>
      <tr>
        <th style="width:34%;">Screen / Tab / Modal</th>
        <th>What It Controls &amp; How to Use It</th>
      </tr>
    </thead>
    <tbody>
      {nav_rows}
    </tbody>
  </table>

  <h2>3. 🔬 In-Depth Feature Guide &amp; Workflows</h2>
  {feat_html}

  <h2>4. ⚙️ Settings, Secret Vault &amp; Multi-User Data Isolation</h2>
  {cfg_table_html}
  <div class="subtle-box" style="margin-top:8px;">
    <div><strong>🔒 Storage Namespace Pattern:</strong> <code>rollup::v1::u::&lt;google-email&gt;::app::{esc(app_id)}::*</code></div>
    <div style="margin-top:4px;"><strong>📦 Active App Storage Keys:</strong> {storage_txt}</div>
    <div style="margin-top:4px;"><strong>🔐 Private On-Device Vault Secrets:</strong> {vault_txt}</div>
    <div class="chip-wrap">{caps_badges}</div>
  </div>

  <h2>5. 🎛️ Live UI Controls Reference &amp; Recent Updates</h2>
  <div class="subtle-box">
    <div style="font-weight:700;margin-bottom:4px;">Interactive Controls Detected in Current Build (<code>v{esc(spec['version'])}</code>):</div>
    <div class="chip-wrap">{btn_badges}</div>
    <div style="font-weight:700;margin:10px 0 4px 0;">Pro Tips &amp; Best Practices:</div>
    <ul>{tips_html}</ul>
    <div style="font-weight:700;margin:10px 0 4px 0;">Recent Cartridge Update Log (Auto-Tracked on Publish):</div>
    <ul>{commits_html}</ul>
  </div>

  <div class="footer-stamp">
    <span>RollupOS Automated Documentation Engine • Cartridge ID: <code>{esc(app_id)}</code></span>
    <span>Canonical PDF: <code>manuals/{esc(pdf_filename)}</code></span>
  </div>
</div>
</body>
</html>
"""


def compile_html_to_pdf(html_path: Path, pdf_path: Path) -> bool:
    """Renders `html_path` to a clean, print-ready `.pdf` using Microsoft Edge Headless with an isolated temp profile."""
    edge_bin = _find_edge_binary()
    ud = tempfile.mkdtemp(prefix="edge_manual_pdf_")
    try:
        subprocess.run(
            [
                edge_bin,
                "--headless=new",
                f"--user-data-dir={ud}",
                "--no-first-run",
                "--disable-gpu",
                "--no-pdf-header-footer",
                f"--print-to-pdf={pdf_path}",
                html_path.resolve().as_uri(),
            ],
            check=True,
            capture_output=True,
            timeout=25,
        )
        return pdf_path.exists() and pdf_path.stat().st_size > 1024
    finally:
        shutil.rmtree(ud, ignore_errors=True)


def sync_app_manuals(
    reg: Dict[str, Any],
    root_dir: Path,
    force: bool = False,
    target_app: Optional[str] = None,
) -> Tuple[bool, List[str]]:
    """
    Delta-gated subroutine: inspects hosted mini-apps and regenerates `.html` + `.pdf` User Manuals
    whenever `app.build_hash != app.manual_source_hash` (or when `force=True`).
    Returns `(registry_mutated, regenerated_app_ids)`.
    """
    manuals_dir = root_dir / "manuals"
    manuals_dir.mkdir(parents=True, exist_ok=True)

    mutated = False
    regenerated: List[str] = []

    for app in reg.get("apps", []):
        app_id = app.get("id", "")
        if not app_id:
            continue
        if target_app and app_id != target_app:
            continue

        rel_pdf = f"manuals/{app_id}_User_Manual.pdf"
        rel_html = f"manuals/{app_id}_User_Manual.html"
        pdf_path = manuals_dir / f"{app_id}_User_Manual.pdf"
        html_path = manuals_dir / f"{app_id}_User_Manual.html"
        spec_path = manuals_dir / f"{app_id}_manual_spec.json"

        cur_hash = str(app.get("build_hash", ""))
        prev_manual_hash = str(app.get("manual_source_hash", ""))

        needs_build = (
            force
            or not pdf_path.exists()
            or not html_path.exists()
            or (cur_hash and cur_hash != prev_manual_hash)
        )

        if app.get("manual_pdf") != rel_pdf:
            app["manual_pdf"] = rel_pdf
            mutated = True
        if app.get("manual_html") != rel_html:
            app["manual_html"] = rel_html
            mutated = True

        if not needs_build:
            continue

        prev_spec = None
        if spec_path.exists():
            try:
                prev_spec = json.loads(spec_path.read_text(encoding="utf-8"))
            except Exception:
                prev_spec = None

        spec = build_manual_spec(app, root_dir, prev_spec=prev_spec)
        spec_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")

        html_doc = render_manual_html(spec)
        html_path.write_text(html_doc, encoding="utf-8")

        ok = compile_html_to_pdf(html_path, pdf_path)
        if ok:
            app["manual_source_hash"] = cur_hash
            app["manual_updated_at"] = datetime.datetime.now().isoformat()
            mutated = True
            regenerated.append(app_id)
            kb = round(pdf_path.stat().st_size / 1024, 1)
            print(f"[ManualEngine] Built {rel_pdf} ({kb} KB) for {app_id} v{app.get('version')} (#{cur_hash[:6]})")
        else:
            print(f"[ManualEngine] WARNING: PDF render failed for {app_id}")

    return mutated, regenerated
