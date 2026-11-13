/**
 * SHD TACTICAL COMMAND v6.0 — Unified Frontend & Live Scanner Companion Controller
 * Implements:
 *   Live HUD: WebSocket `/ws/live-scan` Stream, ★ Favorite Gate, Zero-DB Ephemeral Triage & Stash Re-Sync Pruner
 *   Tab 1: Build Matrix, Interactive Tactical Knowledge Dossier, Drop-Pool Source Radar & Deconstruct Advisor
 *   Tab 2: Interactive 6-Slot Loadout Workbench, Delegated TU22 7-Bucket Ballistics & 5-Target TTK Matrix
 *   Tab 3: Multi-Category Armory (`ARMOR`, `WEAPON`, `GEAR_MOD`, `SKILL_MOD`) + `In Loadouts` Protection
 *   Tab 4: Expertise 413/500 Mastery Tracker & Printer Filament Calculator
 */

let APP_STATE = {
  inventory: [],
  evaluated_builds: [],
  item_usage: {},
  deconstruct_candidates: [],
  saved_loadouts: [],
  admin_showcase_loadouts: [],
  scanner_status: {
    enabled: true,
    state: "WAITING_FOR_GAME",
    audio_enabled: true,
    allow_any_screen: false,
    session_saved_count: 0,
    session_preview_count: 0,
    resync: { active: false, seen_count: 0, stale_candidates: [] },
  },
  expertise: {
    expertise_level: 27,
    total_proficient: 413,
    total_items: 500,
    missing_count: 87,
    estimated_filament_to_max: 26100,
    categories: [],
    items: [],
  },
  canonical: {},
};

let ACTIVE_VIEW = "matrix";
let ACTIVE_MATRIX_ROLE = "ALL";
let ACTIVE_BUILD_ID = "lengmo_pesti_turmoil";
let ACTIVE_DOSSIER_TAB = "why_it_works";
let ACTIVE_ARMORY_SLOT = "ALL";
let ACTIVE_ARMORY_ARCHETYPE = "ALL";
let ACTIVE_WORKBENCH_LOADOUT = null;
let ACTIVE_SLOT_PICKER_TARGET = "MASK";
let ACTIVE_META_STUDIO_TAB = "proposals";
let _LAST_LEADERBOARD_SIG = "";
let _MS_LEADERBOARD_SORT_WIRED = false;

let LIVE_SCAN_WS = null;
let LIVE_SCAN_RECONNECT_TIMER = null;
let LIVE_SCAN_BACKOFF_MS = 1500;
let LAST_RESYNC_STALE_ITEMS = [];

const ALL_SLOTS = ["MASK", "BACKPACK", "CHEST", "GLOVES", "HOLSTER", "KNEEPADS"];

const STAT_LABELS = {
  WEAPON_DAMAGE: "Weapon DMG",
  LMG_DAMAGE: "LMG Damage",
  AR_DAMAGE: "Assault Rifle DMG",
  SMG_DAMAGE: "SMG Damage",
  RIFLE_DAMAGE: "Rifle Damage",
  MMR_DAMAGE: "MMR Damage",
  SHOTGUN_DAMAGE: "Shotgun Damage",
  PISTOL_DAMAGE: "Pistol Damage",
  ARMOR: "Armor",
  SKILL_TIER: "Skill Tier",
  TRIPLE_CORE: "Triple Core (+15% WD / +170k Armor / +1 Tier)",
  MOD_ATTRIBUTE: "System Mod",
  SKILL_MOD_BONUS: "Skill Mod Bonus",
  CRITICAL_HIT_CHANCE: "Crit Hit Chance",
  CRITICAL_HIT_DAMAGE: "Crit Hit Damage",
  HEADSHOT_DAMAGE: "Headshot DMG",
  WEAPON_HANDLING: "Weapon Handling",
  SKILL_DAMAGE: "Skill Damage",
  SKILL_HASTE: "Skill Haste",
  SKILL_REPAIR: "Repair Skills",
  STATUS_EFFECTS: "Status Effects",
  PROTECTION_FROM_ELITES: "Protection From Elites",
  ARMOR_ON_KILL: "Armor on Kill",
  ARMOR_REGEN: "Armor Regen",
  HAZARD_PROTECTION: "Hazard Protection",
  EXPLOSIVE_RESISTANCE: "Explosive Resist",
  INCOMING_REPAIRS: "Incoming Repairs",
  HEALTH: "Health",
  HEALTH_DAMAGE: "Damage to Health",
  MAGAZINE_SIZE: "Magazine Size",
  RATE_OF_FIRE: "Rate of Fire",
  RELOAD_SPEED: "Reload Speed",
  SWAP_SPEED: "Swap Speed",
  DAMAGE_TO_ARMOR: "Damage to Armor",
  DTTOOC: "DMG Out of Cover",
};

const ARCHETYPE_BADGE_MAP = {
  CRIT_DPS: { label: "🔴 CRIT DPS", title: "Critical Hit / Weapon DPS Archetype" },
  HEADSHOT_MMR: { label: "🎯 HEADSHOT MMR", title: "Headshot / Sniper Archetype" },
  SKILL_DPS: { label: "⚡ SKILL DPS", title: "Turret / Drone / Skill Damage Archetype" },
  STATUS_CC: { label: "☣️ STATUS CC", title: "Status Effects / Crowd Control Archetype" },
  TANK_REGEN: { label: "🛡️ TANK / REGEN", title: "Armor / Bulwark / Regen Archetype" },
  HEALER: { label: "💉 HEALER", title: "Repair Skills / Support Healer Archetype" },
  HYBRID: { label: "🟣 HYBRID", title: "Multi-Role Hybrid Piece" },
};

const MINOR_DEFAULT_CAPS = {
  CRITICAL_HIT_CHANCE: 6.0,
  CRITICAL_HIT_DAMAGE: 12.0,
  DAMAGE_TO_ARMOR: 8.0,
  DTTOOC: 8.0,
  HEADSHOT_DAMAGE: 10.0,
  WEAPON_HANDLING: 8.0,
  SKILL_DAMAGE: 10.0,
  SKILL_HASTE: 12.0,
  STATUS_EFFECTS: 10.0,
  SKILL_REPAIR: 20.0,
  ARMOR_REGEN: 4925.0,
  HAZARD_PROTECTION: 10.0,
};

const DROP_POOL_LABELS = {
  DZ_NAMED_CACHE_ONLY: "⚠️ DZ / Named Item Cache / Conflict Exclusive (Not in Countdown Pool)",
  CRAFTED_HUNTER_EXCLUSIVE: "🔨 Hunter Blueprint Crafted Exclusive (Defeat Hunters -> White House Bench)",
  RAID_INCURSION_EXCLUSIVE: "🏆 Raid / Incursion Exclusive Drop",
};

function iterCanonicalEntries(collection) {
  if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.iterCanonicalEntriesJS === "function") {
    return window.SHDStorageAdapter.iterCanonicalEntriesJS(collection);
  }
  if (!collection) return [];
  if (Array.isArray(collection)) {
    return collection.filter(x => x && x.name).map(x => [String(x.name), x]);
  }
  if (typeof collection === "object") {
    return Object.entries(collection).map(([k, v]) => [v && v.name ? String(v.name) : String(k), v || {}]);
  }
  return [];
}

function inferItemCategory(item) {
  if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.inferItemCategoryJS === "function") {
    return window.SHDStorageAdapter.inferItemCategoryJS(item);
  }
  const cat = String((item && item.item_category) || "").toUpperCase();
  if (["ARMOR", "WEAPON", "GEAR_MOD", "SKILL_MOD"].includes(cat)) return cat;
  const s = String((item && item.slot) || "").toUpperCase();
  if (["PRIMARY", "SECONDARY", "SIDEARM", "WEAPON"].includes(s)) return "WEAPON";
  if (s === "GEAR_MOD") return "GEAR_MOD";
  if (s === "SKILL_MOD") return "SKILL_MOD";
  return "ARMOR";
}

function resolveParentBrand(brandOrName) {
  if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.resolveParentBrandJS === "function") {
    return window.SHDStorageAdapter.resolveParentBrandJS(brandOrName, APP_STATE.canonical);
  }
  return brandOrName || "Unknown";
}

function isGearSetBrand(brandOrName) {
  const resolved = resolveParentBrand(brandOrName).toLowerCase();
  const gsCol = (APP_STATE.canonical && APP_STATE.canonical.gear_sets) || [];
  for (const [k] of iterCanonicalEntries(gsCol)) {
    if (k.toLowerCase() === resolved) return true;
  }
  return [
    "striker's battlegear",
    "heartbreaker",
    "hotshot",
    "hunter's fury",
    "eclipse protocol",
    "negotiator's dilemma",
    "foundry bulwark",
    "future initiative",
    "umbra initiative",
    "ongoing directive",
    "rigger",
    "hard wired",
    "true patriot",
    "aces & eights",
    "tip of the spear",
    "impetus",
    "refactor",
  ].includes(resolved);
}

function formatStatVal(statType, val) {
  if (val === undefined || val === null) return "";
  const num = Number(val);
  if (statType === "ARMOR" || statType === "ARMOR_REGEN" || statType === "HEALTH" || statType === "ARMOR_ON_KILL") {
    return `+${num.toLocaleString()}`;
  }
  if (statType === "SKILL_TIER") {
    return `+${num}`;
  }
  if (statType === "TRIPLE_CORE") {
    return `Triple Core`;
  }
  return `+${num.toFixed(1)}%`;
}

function cleanWorkbenchPieceTitle(rawTitle, brandFallback, slot) {
  let clean = String(rawTitle || brandFallback || slot || "Gear Piece").trim();
  const hadMissingPrefix = /^missing:\s*/i.test(clean);
  if (hadMissingPrefix) {
    clean = clean.replace(/^missing:\s*/i, "").trim();
    if (/^walker,\s*harris\s*&\s*co\./i.test(clean)) {
      clean = "Walker, Harris & Co.";
    } else if (clean.includes(",")) {
      clean = clean.split(",")[0].trim();
    }
  }
  clean = clean.replace(/\s*\((?:HIGH_END|NAMED_HIGH_END|GEAR_SET|EXOTIC)\)\s*$/i, "").trim();
  if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.formatTargetPieceNameJS === "function") {
    if (hadMissingPrefix || clean.toLowerCase() === String(brandFallback || "").trim().toLowerCase()) {
      return window.SHDStorageAdapter.formatTargetPieceNameJS(clean, slot, APP_STATE.canonical);
    }
  }
  return clean;
}

function renderActiveSetBonusesHtml(effBrands, slotBreakdown, hasNinjaBike) {
  const canon = APP_STATE.canonical || {};
  const brandMap = {};
  for (const [bName, bSpec] of iterCanonicalEntries(canon.brand_sets)) {
    brandMap[bName.toLowerCase()] = { kind: "BRAND", name: bName, bonuses: (bSpec && bSpec.bonuses) || {} };
  }
  const gearSetMap = {};
  for (const [gsName, gsSpec] of iterCanonicalEntries(canon.gear_sets)) {
    gearSetMap[gsName.toLowerCase()] = {
      kind: "GEAR_SET",
      name: gsName,
      bonuses: (gsSpec && gsSpec.bonuses) || {},
      chest_talent: gsSpec && gsSpec.chest_talent,
      backpack_talent: gsSpec && gsSpec.backpack_talent,
    };
  }
  const exoticMap = {};
  for (const [exName, exSpec] of iterCanonicalEntries(canon.exotics)) {
    exoticMap[exName.toLowerCase()] = { kind: "EXOTIC", name: exName, talent: (exSpec && exSpec.talent) || "" };
  }

  let effective = effBrands && Object.keys(effBrands).length > 0 ? { ...effBrands } : null;
  let nbActive = Boolean(hasNinjaBike);
  if (!effective && slotBreakdown) {
    effective = {};
    for (const sv of Object.values(slotBreakdown)) {
      if (!sv) continue;
      const raw = String(sv.raw_brand || sv.display_name || sv.brand || "");
      if (raw.toLowerCase().includes("ninjabike")) nbActive = true;
      const pBrand = resolveParentBrand(sv.brand || sv.raw_brand || raw);
      effective[pBrand] = (effective[pBrand] || 0) + 1;
    }
    if (nbActive) {
      for (const k of Object.keys(effective)) {
        if (!k.toLowerCase().includes("ninjabike")) {
          effective[k] = Math.min(4, effective[k] + 1);
        }
      }
    }
  }
  if (!effective) return "";

  const entries = Object.entries(effective)
    .filter(([bName, cnt]) => bName && bName !== "Unknown" && Number(cnt) > 0)
    .sort((a, b) => {
      const aLow = a[0].toLowerCase();
      const bLow = b[0].toLowerCase();
      const aEx = Boolean(exoticMap[aLow]);
      const bEx = Boolean(exoticMap[bLow]);
      if (aEx !== bEx) return aEx ? 1 : -1;
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

  return entries
    .map(([bName, cnt]) => {
      const low = bName.toLowerCase();
      const exMeta = exoticMap[low];
      const gsMeta = gearSetMap[low];
      const brMeta = brandMap[low];

      if (exMeta) {
        const tierItem = exMeta.talent
          ? `<li class="set-bonus-tier tier-keystone">★ ${exMeta.talent}</li>`
          : `<li class="set-bonus-tier">Exotic Piece Equipped</li>`;
        return `
          <div class="set-bonus-block tier-exotic">
            <div class="set-bonus-hdr">
              <span>🦅 ${exMeta.name}</span>
              <span class="badge badge-warn">EXOTIC</span>
            </div>
            <ul class="set-bonus-tier-list">${tierItem}</ul>
          </div>
        `;
      }

      if (gsMeta) {
        const capped = Math.min(4, Number(cnt));
        const tiers = [];
        for (const t of [2, 3, 4]) {
          if (capped >= t && gsMeta.bonuses[String(t)]) {
            const isKey = t === capped || t === 4;
            tiers.push(
              `<li class="set-bonus-tier ${isKey ? "tier-keystone" : ""}"><b>${t}pc:</b> ${gsMeta.bonuses[String(t)]}</li>`
            );
          }
        }
        if (tiers.length === 0) {
          tiers.push(`<li class="set-bonus-tier tier-warn">1pc only — equip 2+ pieces to unlock Gear Set bonuses</li>`);
        }
        return `
          <div class="set-bonus-block tier-gearset">
            <div class="set-bonus-hdr">
              <span>${gsMeta.name}</span>
              <span class="badge ${capped >= 4 ? "badge-accent" : ""}">${capped} pc</span>
            </div>
            <ul class="set-bonus-tier-list">${tiers.join("")}</ul>
          </div>
        `;
      }

      const capped = Math.min(3, Number(cnt));
      const tiers = [];
      if (brMeta) {
        for (const t of [1, 2, 3]) {
          if (capped >= t && brMeta.bonuses[String(t)]) {
            const isKey = t === capped && capped >= 2;
            tiers.push(
              `<li class="set-bonus-tier ${isKey || capped === 1 ? "tier-keystone" : ""}"><b>${t}pc:</b> ${brMeta.bonuses[String(t)]}</li>`
            );
          }
        }
      }
      return `
        <div class="set-bonus-block ${capped >= 3 ? "tier-full" : ""}">
          <div class="set-bonus-hdr">
            <span>${bName}</span>
            <span class="badge ${capped >= 3 ? "badge-accent" : ""}">${capped} pc</span>
          </div>
          ${tiers.length > 0 ? `<ul class="set-bonus-tier-list">${tiers.join("")}</ul>` : ""}
        </div>
      `;
    })
    .join("");
}

function attachDialogBackdropFallback(dlg) {
  if (!dlg || "closedBy" in HTMLDialogElement.prototype) return;
  let downOutside = false;
  dlg.addEventListener("pointerdown", e => {
    const r = dlg.getBoundingClientRect();
    downOutside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  });
  dlg.addEventListener("pointerup", e => {
    const r = dlg.getBoundingClientRect();
    const upOutside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (downOutside && upOutside) dlg.close();
    downOutside = false;
  });
}

function bindGlobalKeyboardShortcuts() {
  window.addEventListener("keydown", e => {
    const tag = (e.target && e.target.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if (e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key === "1") { e.preventDefault(); switchMainView("matrix"); }
      else if (e.key === "2") { e.preventDefault(); switchMainView("workbench"); }
      else if (e.key === "3") { e.preventDefault(); switchMainView("armory"); }
      else if (e.key === "4") { e.preventDefault(); switchMainView("expertise"); }
    }
  });
}

// ============================================================================
// INITIALIZATION, NAVIGATION & LIVE SCANNER WEBSOCKET
// ============================================================================

window.addEventListener("DOMContentLoaded", async () => {
  const prof = SHDStorageAdapter.getActiveProfile();
  const sel = document.getElementById("profile-selector");
  if (sel && prof && prof.userId) {
    sel.value = prof.userId;
  }
  attachDialogBackdropFallback(document.getElementById("resync-dialog"));
  attachDialogBackdropFallback(document.getElementById("meta-studio-dialog"));
  attachDialogBackdropFallback(document.getElementById("shd-level-dialog"));
  bindGlobalKeyboardShortcuts();
  await refreshPlatformState();
  connectLiveScanWebSocket();
});

async function refreshPlatformState() {
  try {
    const state = await SHDStorageAdapter.fetchState();
    applyState(state);
  } catch (err) {
    console.error("Failed loading state:", err);
    setIngestStatus("⚠️ Offline Local Storage Active");
  }
}

function applyState(state) {
  if (!state) return;
  APP_STATE = { ...APP_STATE, ...state };

  if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.classifyItemArchetypeJS === "function") {
    for (const it of APP_STATE.inventory || []) {
      it.item_category = inferItemCategory(it);
      if (!it.archetype_tags) {
        it.archetype_tags = window.SHDStorageAdapter.classifyItemArchetypeJS(it, APP_STATE.canonical);
      }
    }
  }

  const elBuilds = document.getElementById("nav-count-builds");
  if (elBuilds) {
    elBuilds.textContent = (APP_STATE.evaluated_builds || []).filter(b => (b.status || "ACTIVE") === "ACTIVE").length;
  }

  const elLoadouts = document.getElementById("nav-count-loadouts");
  if (elLoadouts) elLoadouts.textContent = (APP_STATE.saved_loadouts || []).length;

  const invLen = (APP_STATE.inventory || []).length;
  const elArmory = document.getElementById("nav-count-armory");
  if (elArmory) elArmory.textContent = invLen;
  const elMnavArmory = document.getElementById("mnav-count-armory");
  if (elMnavArmory) elMnavArmory.textContent = invLen;

  const elStash = document.getElementById("stash-count");
  if (elStash) elStash.textContent = invLen;

  const exp = APP_STATE.expertise || {};
  const elExp = document.getElementById("nav-count-expertise");
  if (elExp) elExp.textContent = `${exp.total_proficient || 0}/${exp.total_items || 500}`;

  renderAgentShdBadge(APP_STATE.agent_profile);

  const mode = SHDStorageAdapter.getMode();
  const prof = SHDStorageAdapter.getActiveProfile();
  const elBadge = document.getElementById("active-user-badge");
  if (elBadge) {
    elBadge.textContent = mode === "FASTAPI_PC" ? "🟢" : "📱";
    elBadge.title = `${prof.displayName || prof.userId} • ${mode === "FASTAPI_PC" ? "PC FastAPI SQLite" : "Portable Hub Storage"}`;
  }
  setIngestStatus(
    mode === "FASTAPI_PC"
      ? `🟢 PC FastAPI Server Connected • ${invLen} Armory Items`
      : `📱 Portable / Android Hub Storage (${prof.userId.toUpperCase()}) • ${invLen} Items`
  );

  if (state.scanner_status) {
    renderScannerHud(state.scanner_status);
  } else if (mode !== "FASTAPI_PC" || prof.userId !== "admin") {
    renderScannerHud({ enabled: false, state: "OFFLINE_PORTABLE", resync: { active: false, seen_count: 0 } });
  }

  renderBuildMatrixView();
  renderWorkbenchView();
  renderArmoryGrid();
  renderExpertiseView();
}

function connectLiveScanWebSocket() {
  if (LIVE_SCAN_RECONNECT_TIMER) {
    clearTimeout(LIVE_SCAN_RECONNECT_TIMER);
    LIVE_SCAN_RECONNECT_TIMER = null;
  }
  const prof = SHDStorageAdapter.getActiveProfile();
  if (SHDStorageAdapter.getMode() !== "FASTAPI_PC" || prof.userId !== "admin") {
    if (LIVE_SCAN_WS) {
      try { LIVE_SCAN_WS.close(); } catch (_) {}
      LIVE_SCAN_WS = null;
    }
    renderScannerHud({ enabled: false, state: "OFFLINE_PORTABLE", resync: { active: false, seen_count: 0 } });
    return;
  }
  if (LIVE_SCAN_WS && (LIVE_SCAN_WS.readyState === WebSocket.OPEN || LIVE_SCAN_WS.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${wsProto}//${window.location.host}/ws/live-scan`;
  try {
    const ws = new WebSocket(wsUrl);
    LIVE_SCAN_WS = ws;

    ws.onopen = async () => {
      LIVE_SCAN_BACKOFF_MS = 1500;
      await refreshPlatformState();
    };

    ws.onmessage = async ev => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.status) renderScannerHud(msg.status);

        if (msg.type === "SCROLL_NEEDED") {
          renderScrollNeededInspector(msg.item || {});
        } else if (msg.type === "EPHEMERAL_PREVIEW" && msg.verdict) {
          renderEphemeralPreview(msg.item || {}, msg.verdict);
        } else if (msg.type === "ITEM_SAVED") {
          await refreshPlatformState();
          renderSavedScannerBanner(msg.item || {}, msg.reason || "FAVORITE_STAR");
        } else if (msg.type === "SHD_LEVEL_UPDATED" && msg.agent_profile) {
          APP_STATE.agent_profile = msg.agent_profile;
          renderAgentShdBadge(msg.agent_profile);
          setIngestStatus(`⌚ SHD Watch Level synced to SHD ${msg.agent_profile.shd_level}!`);
        } else if (msg.type === "RESYNC_FINISHED" && msg.resync_result) {
          openResyncDialog(msg.resync_result);
        } else if (msg.type === "RESYNC_PRUNED") {
          await refreshPlatformState();
        }
      } catch (err) {
        console.warn("Live scan WS message parse warning:", err);
      }
    };

    ws.onclose = () => {
      LIVE_SCAN_WS = null;
      const pill = document.getElementById("scanner-state-pill");
      if (pill && SHDStorageAdapter.getMode() === "FASTAPI_PC") {
        pill.className = "scanner-status-pill state-WAITING_FOR_GAME";
        pill.textContent = "🔄 RECONNECTING TO SHD SERVER...";
      }
      if (SHDStorageAdapter.getMode() === "FASTAPI_PC" && SHDStorageAdapter.getActiveProfile().userId === "admin") {
        LIVE_SCAN_RECONNECT_TIMER = setTimeout(connectLiveScanWebSocket, LIVE_SCAN_BACKOFF_MS);
        LIVE_SCAN_BACKOFF_MS = Math.min(10000, Math.round(LIVE_SCAN_BACKOFF_MS * 1.6));
      }
    };
  } catch (_) {
    LIVE_SCAN_WS = null;
  }
}

function renderScannerHud(status) {
  if (!status) return;
  APP_STATE.scanner_status = status;

  const pill = document.getElementById("scanner-state-pill");
  const st = status.state || (status.enabled ? "WAITING_FOR_GAME" : "PAUSED");
  const stateMap = {
    SCANNING_INVENTORY: "🟢 SCANNING INVENTORY HUD",
    SLEEPING_COMBAT: "💤 SLEEPING (IN COMBAT / GAMEPLAY)",
    SLEEPING_BACKGROUND: "💤 SLEEPING (GAME UNFOCUSED)",
    WAITING_FOR_GAME: "📡 WAITING FOR DIVISION 2",
    PAUSED: "⏸️ SCANNER PAUSED (F8)",
    OFFLINE_PORTABLE: "📱 PORTABLE PROFILE MODE",
  };
  if (pill) {
    pill.className = `scanner-status-pill state-${st}`;
    pill.textContent = stateMap[st] || `📡 ${st}`;
  }

  const toggleBtn = document.getElementById("btn-scanner-toggle");
  if (toggleBtn) {
    toggleBtn.textContent = status.enabled ? "⏸️ Pause (F8)" : "▶️ Resume (F8)";
    toggleBtn.setAttribute("aria-pressed", String(Boolean(status.enabled)));
  }

  const saveModeBtn = document.getElementById("btn-scanner-save-mode");
  if (saveModeBtn) {
    const saveAll = Boolean(status.save_all_hovered);
    saveModeBtn.className = saveAll ? "btn btn-primary btn-xs" : "btn btn-outline btn-xs";
    saveModeBtn.textContent = saveAll ? "📥 Record All Hovered (F7)" : "★ Starred Only (F7)";
    saveModeBtn.setAttribute("aria-pressed", String(saveAll));
  }

  const audioBtn = document.getElementById("btn-scanner-audio");
  if (audioBtn) {
    const audioOn = status.audio_enabled !== false;
    audioBtn.textContent = audioOn ? "🔊 Audio: ON" : "🔇 Audio: MUTE";
    audioBtn.setAttribute("aria-pressed", String(audioOn));
  }

  const anyBtn = document.getElementById("btn-scanner-anyscreen");
  if (anyBtn) {
    const anyOn = Boolean(status.allow_any_screen);
    anyBtn.textContent = anyOn ? "🖥️ Any Screen: ON" : "🎮 Game Window Only";
    anyBtn.setAttribute("aria-pressed", String(anyOn));
  }

  const resync = status.resync || {};
  const resyncBtn = document.getElementById("btn-scanner-resync");
  if (resyncBtn) {
    resyncBtn.setAttribute("aria-pressed", String(Boolean(resync.active)));
    if (resync.active) {
      resyncBtn.className = "btn btn-primary btn-xs";
      resyncBtn.textContent = `⏹️ Finish Re-Sync (${resync.seen_count || 0} Seen)`;
    } else {
      resyncBtn.className = "btn btn-outline btn-xs";
      resyncBtn.textContent = "🔄 Stash Re-Sync Sweep";
    }
  }

  const cntBadge = document.getElementById("scanner-session-counts");
  if (cntBadge) {
    cntBadge.textContent = `★ ${status.session_saved_count || 0} Saved • ${status.session_preview_count || 0} Previews`;
  }

  renderSessionIntakeFeed(status.session_intake_items || []);
  const activeCard = status.active_inspected_card;
  if (activeCard && typeof activeCard === "object" && activeCard.item_name) {
    if (activeCard.needs_scroll || activeCard.is_partial_scroll) {
      renderScrollNeededInspector(activeCard);
    } else if (activeCard.ephemeral_eval) {
      renderEphemeralPreview(activeCard, activeCard.ephemeral_eval);
    } else if (activeCard.is_favorite || (status.last_saved_item && status.last_saved_item.item_id === activeCard.item_id)) {
      renderSavedScannerBanner(activeCard, "FAVORITE_STAR");
    }
  }
}

let _ACTIVE_INSPECTOR_ITEM = null;

function _escInspector(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function _formatInspectorStatLabel(statType) {
  const map = typeof STAT_LABELS !== "undefined" ? STAT_LABELS : {};
  return map[statType] || String(statType || "").replace(/_/g, " ");
}

function renderInspectorStatChips(item) {
  const chipsEl = document.getElementById("inspector-stat-chips");
  if (!chipsEl) return;
  const chips = [];

  if (item.location) {
    chips.push(`<span class="inspector-stat-chip">📍 ${_escInspector(item.location)}</span>`);
  }
  if (item.is_prototype) {
    chips.push(`<span class="inspector-stat-chip proto">⚡ PROTOTYPE${item.augment ? `: ${_escInspector(item.augment)}` : ""}</span>`);
  } else if (item.augment) {
    chips.push(`<span class="inspector-stat-chip proto">🧬 ${_escInspector(item.augment)}</span>`);
  }
  if (Number(item.expertise_level || 0) > 0) {
    chips.push(`<span class="inspector-stat-chip">⭐ Exp ${Number(item.expertise_level)}</span>`);
  }
  if (item.core_attribute && item.core_attribute.type) {
    const c = item.core_attribute;
    chips.push(`<span class="inspector-stat-chip core">Core: ${formatStatVal(c.type, c.value)} ${_escInspector(_formatInspectorStatLabel(c.type))}</span>`);
  } else {
    chips.push(`<span class="inspector-stat-chip" style="border-color:#f59e0b; color:#fde68a;">Core: Pending Scroll</span>`);
  }
  const minors = Array.isArray(item.minor_attributes) ? item.minor_attributes : [];
  minors.forEach(m => {
    const st = m.type || m.stat || "";
    chips.push(`<span class="inspector-stat-chip minor">${formatStatVal(st, m.value)} ${_escInspector(_formatInspectorStatLabel(st))}</span>`);
  });
  if (item.talent && item.talent.name) {
    chips.push(`<span class="inspector-stat-chip talent">${item.talent.is_perfect ? "★ " : ""}Talent: ${_escInspector(item.talent.name)}</span>`);
  }
  if (Array.isArray(item.in_game_loadouts) && item.in_game_loadouts.length) {
    chips.push(`<span class="inspector-stat-chip">🎮 ${_escInspector(item.in_game_loadouts.join(", "))}</span>`);
  }

  chipsEl.innerHTML = chips.length
    ? chips.join("")
    : `<span class="inspector-empty-hint">Waiting for readable attribute lines...</span>`;
}

function _setInspectorActionButtons(item, { canCommit = false, canModifySaved = false } = {}) {
  _ACTIVE_INSPECTOR_ITEM = item || null;
  const commitBtn = document.getElementById("btn-commit-ephemeral");
  const editBtn = document.getElementById("btn-inspector-edit");
  const delBtn = document.getElementById("btn-inspector-delete");
  const savedInDb = Boolean(item && item.item_id && (APP_STATE.inventory || []).some(x => x.item_id === item.item_id));
  const showDbActions = Boolean(canModifySaved && savedInDb);

  if (commitBtn) commitBtn.classList.toggle("hidden", !canCommit);
  if (editBtn) editBtn.classList.toggle("hidden", !showDbActions);
  if (delBtn) delBtn.classList.toggle("hidden", !showDbActions);
}

function renderScrollNeededInspector(item) {
  const strip = document.getElementById("ephemeral-triage-strip");
  const badgeEl = document.getElementById("ephemeral-verdict-badge");
  const textEl = document.getElementById("ephemeral-verdict-text");
  const scrollBanner = document.getElementById("inspector-scroll-banner");
  if (!strip || !badgeEl || !textEl) return;

  strip.className = "ephemeral-triage-strip verdict-SCROLL_NEEDED";
  badgeEl.style.background = "";
  badgeEl.style.color = "";
  badgeEl.textContent = item.is_favorite ? "★ SCROLL DOWN" : "⏬ SCROLL CARD DOWN";

  const iName = _escInspector(item.item_name || item.brand_or_set || "Long Item Card");
  const slotLbl = _escInspector(item.slot || item.item_category || "GEAR");
  textEl.innerHTML = `<b>${iName} [${slotLbl}]</b> — Holding capture until bottom attributes are visible`;
  if (scrollBanner) scrollBanner.classList.remove("hidden");

  renderInspectorStatChips(item);
  _setInspectorActionButtons(item, { canCommit: false, canModifySaved: false });
}

function renderEphemeralPreview(item, verdict) {
  const strip = document.getElementById("ephemeral-triage-strip");
  const badgeEl = document.getElementById("ephemeral-verdict-badge");
  const textEl = document.getElementById("ephemeral-verdict-text");
  const scrollBanner = document.getElementById("inspector-scroll-banner");
  if (!strip || !badgeEl || !textEl) return;

  const vCode = verdict.verdict || "SAFE_CRUSH";
  strip.className = `ephemeral-triage-strip verdict-${vCode}`;
  badgeEl.style.background = "";
  badgeEl.style.color = "";
  badgeEl.textContent = verdict.badge || vCode;

  const iName = _escInspector(item.item_name || item.brand_or_set || "Hovered Item");
  const slotLbl = item.slot ? `[${_escInspector(item.slot)}]` : "";
  textEl.innerHTML = `<b>${iName} ${slotLbl}:</b> ${_escInspector(verdict.headline || "")} <span style="color:var(--text-muted);">(${_escInspector(verdict.detail || "")})</span>`;
  if (scrollBanner) scrollBanner.classList.add("hidden");

  renderInspectorStatChips(item);
  _setInspectorActionButtons(item, { canCommit: vCode !== "ALREADY_OWNED", canModifySaved: false });
}

function renderSavedScannerBanner(item, reason) {
  const strip = document.getElementById("ephemeral-triage-strip");
  const badgeEl = document.getElementById("ephemeral-verdict-badge");
  const textEl = document.getElementById("ephemeral-verdict-text");
  const scrollBanner = document.getElementById("inspector-scroll-banner");
  if (!strip || !badgeEl || !textEl) return;

  strip.className = "ephemeral-triage-strip verdict-UPGRADE";
  badgeEl.style.background = "";
  badgeEl.style.color = "";
  badgeEl.textContent =
    reason === "FORCE_SAVE" ? "📸 SAVED (F9)" : (reason === "SAVE_ALL_HOVERED" ? "📥 AUTO-RECORDED" : "★ STAR AUTO-SAVED");

  const iName = _escInspector(item.item_name || item.brand_or_set || "Gear Item");
  textEl.innerHTML = `<b>${iName} [${_escInspector(item.slot || "ARMOR")}]</b> saved with exact ${_escInspector(item.roll_source || "OCR_DIRECT")} values (0 screenshots saved)`;
  if (scrollBanner) scrollBanner.classList.add("hidden");

  renderInspectorStatChips(item);
  _setInspectorActionButtons(item, { canCommit: false, canModifySaved: true });
}

function renderSessionIntakeFeed(items) {
  const listEl = document.getElementById("session-intake-list");
  const countEl = document.getElementById("session-feed-count");
  if (!listEl) return;
  const arr = Array.isArray(items) ? items : [];
  if (countEl) countEl.textContent = String(arr.length);

  if (arr.length === 0) {
    listEl.innerHTML = `<div class="inspector-empty-hint">Starred (★) items captured this session appear here with verified rolls.</div>`;
    return;
  }

  listEl.innerHTML = arr.map(it => {
    const c = it.core_attribute || {};
    const cText = c.type ? `${formatStatVal(c.type, c.value)} ${_formatInspectorStatLabel(c.type)}` : "";
    const mText = (it.minor_attributes || []).map(m => `${formatStatVal(m.type || m.stat, m.value)} ${_formatInspectorStatLabel(m.type || m.stat)}`).join(" • ");
    const protoBadge = it.is_prototype ? `<span class="badge badge-warn">PROTO</span>` : "";
    const itemId = _escInspector(it.item_id);
    return `
      <div class="session-feed-item">
        <div class="session-feed-item-info">
          <b>★ ${_escInspector(it.item_name || it.brand_or_set)}</b>
          <span class="badge">${_escInspector(it.slot || it.item_category || "GEAR")}</span>
          ${protoBadge}
          <span style="color:var(--text-muted);">${_escInspector([cText, mText].filter(Boolean).join(" • "))}</span>
        </div>
        <div class="session-feed-item-actions">
          <button type="button" class="btn btn-outline btn-xs" onclick="openVerifyModal('${itemId}')">✏️</button>
          <button type="button" class="btn btn-danger btn-xs" onclick="deleteArmoryItem('${itemId}')">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
}

function editActiveInspectorItem() {
  if (_ACTIVE_INSPECTOR_ITEM && _ACTIVE_INSPECTOR_ITEM.item_id) {
    openVerifyModal(_ACTIVE_INSPECTOR_ITEM.item_id);
  }
}

async function deleteActiveInspectorItem() {
  if (_ACTIVE_INSPECTOR_ITEM && _ACTIVE_INSPECTOR_ITEM.item_id) {
    await deleteArmoryItem(_ACTIVE_INSPECTOR_ITEM.item_id);
  }
}

async function toggleLiveScanner() {
  const st = await SHDStorageAdapter.toggleScanner();
  renderScannerHud(st);
}

async function toggleScannerSaveMode() {
  const cur = Boolean(APP_STATE.scanner_status && APP_STATE.scanner_status.save_all_hovered);
  const st = await SHDStorageAdapter.toggleScanner({ save_all_hovered: !cur });
  renderScannerHud(st);
}

async function toggleScannerAudio() {
  const cur = APP_STATE.scanner_status ? APP_STATE.scanner_status.audio_enabled !== false : true;
  const st = await SHDStorageAdapter.toggleScanner({ audio_enabled: !cur });
  renderScannerHud(st);
}

async function toggleScannerAnyScreen() {
  const cur = Boolean(APP_STATE.scanner_status && APP_STATE.scanner_status.allow_any_screen);
  const st = await SHDStorageAdapter.toggleScanner({ allow_any_screen: !cur });
  renderScannerHud(st);
}

async function snapLiveScreenCard() {
  setIngestStatus("📸 Capturing & snapping hovered Right-Hand Detail Card...");
  const res = await SHDStorageAdapter.snapLiveCard("BACKPACK");
  if (res && res.state) applyState(res.state);
  if (res && res.captured_item) {
    renderSavedScannerBanner(res.captured_item, "FORCE_SAVE");
    setIngestStatus(`✅ Force-saved '${res.captured_item.item_name}' [${res.captured_item.slot}]!`);
  } else {
    setIngestStatus("⚠️ No readable Division 2 Detail Card detected on active screen.");
  }
}

async function commitHoveredEphemeralItem() {
  try {
    const res = await SHDStorageAdapter.commitEphemeralItem();
    if (res && res.state) applyState(res.state);
    if (res && res.saved_item) {
      renderSavedScannerBanner(res.saved_item, "MANUAL_COMMIT");
      setIngestStatus(`✅ Saved '${res.saved_item.item_name}' to Armory!`);
    }
  } catch (err) {
    setIngestStatus("⚠️ Hover an item in-game first before clicking Save to Armory.");
  }
}

async function toggleResyncSweep() {
  const resync = (APP_STATE.scanner_status && APP_STATE.scanner_status.resync) || {};
  if (!resync.active) {
    const slotScope = ALL_SLOTS.includes(ACTIVE_ARMORY_SLOT) ? ACTIVE_ARMORY_SLOT : null;
    const st = await SHDStorageAdapter.startResyncSweep(slotScope, null);
    if (st) renderScannerHud(st);
    setIngestStatus(
      `🔄 Re-Sync Sweep Active${slotScope ? ` (${slotScope})` : " (All Armory)"} — scroll through your items in-game, then click 'Finish Re-Sync'!`
    );
  } else {
    const res = await SHDStorageAdapter.finishResyncSweep();
    const st = await SHDStorageAdapter.getScannerStatus();
    renderScannerHud(st);
    openResyncDialog(res);
  }
}

function openResyncDialog(resyncResult) {
  const dlg = document.getElementById("resync-dialog");
  if (!dlg) return;
  const stale = (resyncResult && resyncResult.stale_items) || [];
  LAST_RESYNC_STALE_ITEMS = stale;

  const summaryEl = document.getElementById("resync-dialog-summary");
  if (summaryEl) {
    summaryEl.textContent = `Sweep observed ${resyncResult.seen_count || 0} owned items${resyncResult.slot_filter ? ` in ${resyncResult.slot_filter}` : ""}. ${stale.length} previously saved item(s) were not seen during this pass.`;
  }
  const cntBadge = document.getElementById("resync-stale-count-badge");
  if (cntBadge) cntBadge.textContent = `${stale.length} Stale`;

  const selAll = document.getElementById("resync-select-all");
  if (selAll) selAll.checked = stale.length > 0;

  const pruneBtn = document.getElementById("btn-confirm-prune-resync");
  if (pruneBtn) pruneBtn.disabled = stale.length === 0;

  const listEl = document.getElementById("resync-stale-list");
  if (listEl) {
    if (stale.length === 0) {
      listEl.innerHTML = `<div class="empty-state" style="padding:14px;">✨ Zero stale items! Every Armory item in scope was verified in-game.</div>`;
    } else {
      listEl.innerHTML = stale
        .map(
          it => `
        <label class="loadout-card" style="display:flex; align-items:center; gap:10px; margin-bottom:0;">
          <input type="checkbox" class="resync-stale-chk" value="${it.item_id}" checked />
          <div style="flex:1;">
            <div class="lc-name">${it.item_name || it.brand_or_set} <span class="badge">${it.slot}</span></div>
            <div class="lc-meta">${it.brand_or_set} • ${it.rarity || "HIGH_END"}</div>
          </div>
        </label>
      `
        )
        .join("");
    }
  }
  if (!dlg.open) dlg.showModal();
}

function closeResyncDialog() {
  const dlg = document.getElementById("resync-dialog");
  if (dlg && dlg.open) dlg.close();
}

function toggleAllResyncCheckboxes(checked) {
  document.querySelectorAll(".resync-stale-chk").forEach(chk => {
    chk.checked = Boolean(checked);
  });
}

async function confirmPruneResyncItems() {
  const selectedIds = Array.from(document.querySelectorAll(".resync-stale-chk:checked")).map(el => el.value);
  closeResyncDialog();
  if (selectedIds.length === 0) return;
  const res = await SHDStorageAdapter.pruneResyncItems(selectedIds);
  if (res && res.state) applyState(res.state);
  const removed = (res && res.prune_result && res.prune_result.removed_count) || selectedIds.length;
  setIngestStatus(`🗑️ Pruned ${removed} stale deconstructed item(s) from Armory (${LAST_RESYNC_STALE_ITEMS.length} reviewed).`);
}

function switchMainView(viewName) {
  ACTIVE_VIEW = viewName;
  document.querySelectorAll(".workspace-view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById(`view-${viewName}`);
  if (target) target.classList.add("active");

  document.querySelectorAll(".main-nav-btn, .mnav-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-view") === viewName);
  });
}

async function handleProfileSwitch(profileId) {
  SHDStorageAdapter.setActiveProfile(profileId);
  ACTIVE_WORKBENCH_LOADOUT = null;
  await refreshPlatformState();
  connectLiveScanWebSocket();
}

function setIngestStatus(msg) {
  const el = document.getElementById("ingest-status");
  if (el) el.textContent = msg;
}

function renderAgentShdBadge(agentProf) {
  const shdLvl = Number((agentProf && agentProf.shd_level) || 2793);
  const elHdr = document.getElementById("hdr-shd-level");
  if (elHdr) elHdr.textContent = shdLvl.toLocaleString();
  const optAdmin = document.getElementById("opt-profile-admin");
  if (optAdmin) optAdmin.textContent = `👑 Admin (SHD ${shdLvl.toLocaleString()})`;
}

function openShdLevelDialog() {
  const dlg = document.getElementById("shd-level-dialog");
  const inp = document.getElementById("shd-level-input");
  if (!dlg || !inp) return;
  const cur = Number((APP_STATE.agent_profile && APP_STATE.agent_profile.shd_level) || 2793);
  inp.value = String(cur);
  if (!dlg.open) dlg.showModal();
  inp.select();
}

function closeShdLevelDialog() {
  const dlg = document.getElementById("shd-level-dialog");
  if (dlg && dlg.open) dlg.close();
}

async function submitShdLevelDialog(event) {
  event.preventDefault();
  const inp = document.getElementById("shd-level-input");
  if (!inp) return;
  const val = Number(inp.value);
  if (!Number.isFinite(val) || val < 1) return;
  closeShdLevelDialog();
  const state = await SHDStorageAdapter.updateShdLevel(val);
  applyState(state);
  setIngestStatus(`⌚ Updated SHD Watch Level to SHD ${Math.round(val).toLocaleString()}!`);
}

// ============================================================================
// VIEW 1: BUILD MATRIX, TACTICAL KNOWLEDGE DOSSIER & FARM RADAR
// ============================================================================

function filterMatrixRole(roleKey, btnEl) {
  ACTIVE_MATRIX_ROLE = roleKey;
  document.querySelectorAll("#matrix-role-filter .filter-pill").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderBuildMatrixView();
}

function handleMatrixSearchSort() {
  renderBuildMatrixView();
}

function formatRelativeDaysAgo(daysSince) {
  const days = Number(daysSince || 0);
  if (days <= 0) return "Verified Today";
  if (typeof Intl !== "undefined" && typeof Intl.RelativeTimeFormat === "function") {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return `Verified ${rtf.format(-days, "day")}`;
  }
  return `Verified ${days}d ago`;
}

function renderBuildMatrixView() {
  const builds = APP_STATE.evaluated_builds || [];
  const activeBuilds = builds.filter(b => (b.status || "ACTIVE") === "ACTIVE");
  const legacyBuilds = builds.filter(b => b.status === "LEGACY");

  const readyCount = activeBuilds.filter(b => b.owned_slots_count >= 5).length;
  const readyBadge = document.getElementById("builds-ready-badge");
  if (readyBadge) readyBadge.textContent = `${readyCount} Ready`;

  const pillAll = document.getElementById("pill-role-all");
  if (pillAll) pillAll.textContent = `All (${activeBuilds.length})`;
  const pillLegacy = document.getElementById("pill-role-legacy");
  if (pillLegacy) pillLegacy.textContent = `📦 Legacy (${legacyBuilds.length})`;

  const mf = APP_STATE.meta_freshness || {};
  const stripEl = document.getElementById("meta-freshness-strip");
  const dotEl = document.getElementById("mf-status-dot");
  const verEl = document.getElementById("mf-version-label");
  const ageEl = document.getElementById("mf-age-label");
  const pendEl = document.getElementById("mf-pending-badge");
  const isStale = Boolean(mf.is_stale);
  if (stripEl) stripEl.classList.toggle("stale", isStale);
  if (dotEl) dotEl.className = `mf-dot ${isStale ? "stale" : "fresh"}`;
  if (verEl) verEl.textContent = mf.meta_version || "TU24 / Year 8 Meta";
  if (ageEl) {
    const relStr = formatRelativeDaysAgo(mf.days_since_verified);
    ageEl.textContent = isStale ? `⚠️ ${relStr} (Sweep Due)` : relStr;
  }
  if (pendEl) {
    const pCnt = Number(mf.pending_proposals_count || 0);
    pendEl.textContent = `🔔 ${pCnt} Staged`;
    pendEl.classList.toggle("hidden", pCnt === 0);
  }

  const searchQuery = (document.getElementById("matrix-build-search")?.value || "").trim().toLowerCase();
  const sortMode = document.getElementById("matrix-build-sort")?.value || "readiness";

  const filtered = builds.filter(b => {
    const isLeg = b.status === "LEGACY";
    if (ACTIVE_MATRIX_ROLE === "LEGACY") {
      if (!isLeg) return false;
    } else {
      if (isLeg) return false;
      if (ACTIVE_MATRIX_ROLE === "RED_DPS" && !(b.role === "RED_DPS" || b.role === "ONE_SHOT_MMR")) return false;
      if (ACTIVE_MATRIX_ROLE === "TECH_TANK" && !["TECH_TANK", "HYBRID_BRUISER", "CLOSE_QUARTERS"].includes(b.role)) return false;
      if (ACTIVE_MATRIX_ROLE === "SKILL" && !["SKILL_DPS", "CROWD_CONTROL"].includes(b.role)) return false;
      if (ACTIVE_MATRIX_ROLE === "TANK_HEAL" && !["ARMOR_TANK", "SUPPORT_HEALER"].includes(b.role)) return false;
    }
    if (searchQuery) {
      const slotBrands = Object.values(b.slot_breakdown || {}).map(s => `${s.brand || ""} ${s.raw_brand || ""} ${s.talent || ""}`).join(" ");
      const haystack = `${b.name || ""} ${b.role || ""} ${b.tier_badge || ""} ${b.summary || ""} ${(b.primary_weapons || []).join(" ")} ${slotBrands}`.toLowerCase();
      if (!haystack.includes(searchQuery)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    const balA = a.ballistics || {};
    const balB = b.ballistics || {};
    if (sortMode === "sustained_dps") return (balB.sustained_dps || 0) - (balA.sustained_dps || 0);
    if (sortMode === "burst_dps") return (balB.burst_dps || 0) - (balA.burst_dps || 0);
    if (sortMode === "armor") return (balB.total_armor || 0) - (balA.total_armor || 0);
    return (b.owned_slots_count || 0) - (a.owned_slots_count || 0) || (b.completion_pct || 0) - (a.completion_pct || 0) || (balB.sustained_dps || 0) - (balA.sustained_dps || 0);
  });

  if (!filtered.some(b => b.build_id === ACTIVE_BUILD_ID) && filtered.length > 0) {
    ACTIVE_BUILD_ID = filtered[0].build_id;
  }

  const listEl = document.getElementById("builds-list");
  if (listEl) {
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty-state" style="padding:16px;">${
        ACTIVE_MATRIX_ROLE === "LEGACY"
          ? "No retired builds in the Legacy Archive. Nerfed builds moved here protect your owned ≥4/6 gear from Safe Deconstruct."
          : "No builds match this role filter."
      }</div>`;
    } else {
      listEl.innerHTML = filtered
        .map(b => {
          const isAct = b.build_id === ACTIVE_BUILD_ID;
          const pct = b.completion_pct || 0;
          const isLeg = b.status === "LEGACY";
          const barColor = pct >= 85 ? "var(--success)" : pct >= 55 ? "var(--shd-orange)" : "var(--warn)";
          return `
          <div class="build-list-card ${isAct ? "active" : ""} ${isLeg ? "is-legacy" : ""}" onclick="selectMatrixBuild('${b.build_id}')">
            <div class="blc-top">
              <div>
                <div class="blc-name">${isLeg ? "📦 " : ""}${b.name}</div>
                <span class="badge ${isLeg ? "badge-warn" : "badge-gold"}" style="margin-top:3px; display:inline-block;">${isLeg ? "LEGACY ARCHIVE" : (b.tier_badge || b.role)}</span>
              </div>
              <div style="text-align:right;">
                <div class="blc-pct">${pct}%</div>
                <div class="muted-sub">${b.owned_slots_count}/6 Owned</div>
              </div>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${Math.min(100, pct)}%; background:${barColor};"></div>
            </div>
          </div>
        `;
        })
        .join("");
    }
  }

  renderActiveBuildDetail();
  renderFarmRadarAndDeconstruct();
  const msDlg = document.getElementById("meta-studio-dialog");
  if (msDlg && msDlg.open) {
    renderMetaStudioContent();
  }
}

function selectMatrixBuild(buildId) {
  ACTIVE_BUILD_ID = buildId;
  renderBuildMatrixView();
}

function switchDossierTab(tabKey) {
  ACTIVE_DOSSIER_TAB = tabKey;
  renderActiveBuildDetail();
  if (ACTIVE_WORKBENCH_LOADOUT) {
    renderWorkbenchDossier(ACTIVE_WORKBENCH_LOADOUT);
  }
}

function buildDossierHtml(dossier, optimalMods) {
  if (!dossier) return "";
  const activeTab = ACTIVE_DOSSIER_TAB || "why_it_works";
  const modSummary = optimalMods && optimalMods.summary
    ? optimalMods.summary
    : Array.isArray(optimalMods)
    ? optimalMods.join(" + ")
    : "";
  const modPillHtml = modSummary
    ? `<span class="mod-balancer-pill" title="Solver-computed 3x Gear Mod split for 60% CHC Cap">🔌 Optimal Mods: ${modSummary}</span>`
    : "";

  let bodyHtml = "";
  if (activeTab === "why_it_works") {
    bodyHtml = `<div class="dossier-section-body">${dossier.why_it_works || ""}</div>`;
  } else if (activeTab === "how_it_plays") {
    bodyHtml = `<div class="dossier-section-body">${dossier.how_it_plays || ""}</div>`;
  } else if (activeTab === "why_each_choice_matters") {
    bodyHtml = `<div class="dossier-section-body">${dossier.why_each_choice_matters || ""}</div>`;
  } else if (activeTab === "pro_tips") {
    const tips = Array.isArray(dossier.pro_tips) ? dossier.pro_tips : [];
    bodyHtml = `<div class="dossier-section-body"><ul class="dossier-pro-tips-list">${tips.map(t => `<li>${t}</li>`).join("")}</ul></div>`;
  }

  return `
    <div class="dossier-panel">
      <div class="dossier-header">
        <div class="dossier-title">📖 Tactical Build Knowledge Dossier</div>
        ${modPillHtml}
      </div>
      <div class="dossier-tabs">
        <button class="dossier-tab-btn ${activeTab === "why_it_works" ? "active" : ""}" onclick="switchDossierTab('why_it_works')">
          🧬 Why This Build Works (Synergy &amp; 7-Bucket Math)
        </button>
        <button class="dossier-tab-btn ${activeTab === "how_it_plays" ? "active" : ""}" onclick="switchDossierTab('how_it_plays')">
          🎯 How It Plays (Combat Loop &amp; Rotation)
        </button>
        <button class="dossier-tab-btn ${activeTab === "why_each_choice_matters" ? "active" : ""}" onclick="switchDossierTab('why_each_choice_matters')">
          🛡️ Why Each Slot &amp; Stat Matters (Trade-Offs)
        </button>
        <button class="dossier-tab-btn ${activeTab === "pro_tips" ? "active" : ""}" onclick="switchDossierTab('pro_tips')">
          ⚡ Veteran Pro Execution Tips
        </button>
      </div>
      ${bodyHtml}
    </div>
  `;
}

function renderActiveBuildDetail() {
  const container = document.getElementById("matrix-build-detail");
  if (!container) return;

  const b = (APP_STATE.evaluated_builds || []).find(x => x.build_id === ACTIVE_BUILD_ID);
  if (!b) {
    container.innerHTML = `<div class="empty-state">Select a build on the left.</div>`;
    return;
  }

  const bal = b.ballistics || {};
  const slots = b.slot_breakdown || {};
  const dossierHtml = buildDossierHtml(b.knowledge_dossier, b.optimal_gear_mods);

  const slotCardsHtml = ALL_SLOTS.map(slot => {
    const s = slots[slot] || { status: "MISSING", display_name: "Missing", match_pct: 0 };
    const isOwned = s.status === "OWNED";
    const coreDot = s.core_type === "ARMOR" ? "🔵" : s.core_type === "SKILL_TIER" ? "🟡" : "🔴";
    const minorsStr = (s.minor_attributes || [])
      .map(m => `${STAT_LABELS[m.type] || m.type}: <b>${formatStatVal(m.type, m.value)}</b>`)
      .join(" • ");

    const protoBadge = s.is_prototype
      ? `<span class="badge" style="background:rgba(168,85,247,0.22);color:#d8b4fe;border:1px solid #a855f7;">🟣 PROTOTYPE</span>`
      : "";
    const provBadge = isOwned
      ? s.roll_source === "PIP_DEDUCED"
        ? `<span class="provenance-badge pip-deduced" title="Minor roll deduced from attribute pip color — click item in Armory to verify">⚡ PIP DEDUCED</span>`
        : `<span class="provenance-badge ocr-direct">✔ DIRECT</span>`
      : "";

    const dropPoolWarn = !isOwned && s.drop_pool && DROP_POOL_LABELS[s.drop_pool]
      ? `<div class="drop-pool-badge">${DROP_POOL_LABELS[s.drop_pool]}</div>`
      : "";

    const alts = s.alt_owned_candidates || [];
    const altsHtml = alts.length > 0
      ? `<div class="slot-alts-bar">
           <span style="font-size:0.65rem;color:var(--text-muted);">Swap Alt:</span>
           ${alts
             .map(
               alt =>
                 `<span class="alt-swap-pill" onclick="event.stopPropagation(); swapMatrixAltintoWorkbench('${b.build_id}', '${slot}', '${alt.item_id}')" title="${alt.tinker_advice}">🔄 ${alt.display_name.split(" (")[0]} (${alt.match_pct}%)</span>`
             )
             .join("")}
         </div>`
      : "";

    return `
      <div class="slot-eval-card ${isOwned ? "owned" : "missing"}" onclick="${isOwned && s.item_id ? `openVerifyModal('${s.item_id}')` : ""}" style="cursor:${isOwned ? "pointer" : "default"};">
        <div class="sec-header">
          <span class="sec-slot-tag">${slot} ${protoBadge} ${provBadge}</span>
          <span class="sec-score ${isOwned ? "ok" : "miss"}">${isOwned ? `${s.match_pct}% Match` : "MISSING"}</span>
        </div>
        <div class="sec-item-name">${s.display_name}</div>
        <div class="sec-stats">
          <div>${coreDot} Core: <b>${STAT_LABELS[s.core_type] || s.core_type} (${formatStatVal(s.core_type, s.core_val)})</b></div>
          <div>${minorsStr || "No Minors"}</div>
          ${s.talent ? `<div style="color:var(--gold-high);">✨ Talent: <b>${s.talent}</b></div>` : ""}
        </div>
        <div class="sec-tinker ${isOwned ? "ok" : ""}">🔧 ${s.tinker_advice || "Ready"}</div>
        ${dropPoolWarn}
        ${altsHtml}
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="build-detail-header">
      <div class="bd-title-row">
        <div>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <span class="badge ${b.status === "LEGACY" ? "badge-warn" : "badge-accent"}">${b.status === "LEGACY" ? "📦 LEGACY ARCHIVE" : (b.tier_badge || b.role)}</span>
            <span class="badge" title="Last verified Title Update patch">${b.verified_patch || "TU24 / Y8"}</span>
          </div>
          <h2 class="bd-title" style="margin-top:4px;">${b.name}</h2>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-gold btn-sm" onclick="assembleAndSaveBuildFromMatrix('${b.build_id}')" title="Assemble this build from your owned Armory items + optimal 3x Gear Mods and save directly to your Locker">
            ⚡ Assemble &amp; Save to Locker
          </button>
          <button class="btn btn-primary btn-sm" onclick="loadBuildIntoWorkbench('${b.build_id}')">
            🛠️ Open in Loadout Workbench
          </button>
          <button class="btn btn-outline btn-sm" onclick="toggleMetaBuildLifecycle('${b.build_id}', '${b.status === "LEGACY" ? "ACTIVE" : "LEGACY"}')" title="${b.status === "LEGACY" ? "Restore build to Active Meta list" : "Move nerfed/retired build to Legacy Archive while keeping >=4/6 owned gear protected"}">
            ${b.status === "LEGACY" ? "♻️ Restore to Active" : "📦 Archive"}
          </button>
        </div>
      </div>
      <p class="bd-summary">${b.summary}</p>
      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; font-size:0.76rem; color:var(--text-muted);">
        <span>🔫 <b>Weapons:</b> ${(b.primary_weapons || []).join(" / ")}</span>
        <span>🎖️ <b>Specialization:</b> ${b.specialization}</span>
      </div>

      <div class="bd-kpi-strip">
        <div class="kpi-box">
          <div class="kpi-label">Burst DPS (${bal.weapon_name || "Primary"})</div>
          <div class="kpi-val accent">${((bal.burst_dps || 0) / 1e6).toFixed(2)}M</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Sustained DPS ${bal.pesti_tick_dps ? "(+Plague)" : bal.skill_combined_dps ? "(+Skills)" : ""}</div>
          <div class="kpi-val">${((bal.sustained_dps || 0) / 1e6).toFixed(2)}M</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Crit Chance / Crit DMG</div>
          <div class="kpi-val">${bal.chc_pct || 0}% / ${bal.chd_pct || 0}%</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Total Armor / Heroic TTK</div>
          <div class="kpi-val good">${((bal.total_armor || 0) / 1e6).toFixed(2)}M • ${bal.ttk_heroic_named_sec || 0}s</div>
        </div>
      </div>
    </div>

    ${dossierHtml}

    <div class="matrix-set-bonuses-strip">
      <h3 class="matrix-set-bonuses-title">
        <span>🛡️ Active Brand, Gear Set &amp; Exotic Bonuses</span>
        ${bal.has_ninjabike ? `<span class="badge badge-accent">🥷 NinjaBike +1 Wildcard Active</span>` : ""}
      </h3>
      <div class="matrix-set-bonuses-grid">
        ${renderActiveSetBonusesHtml(bal.effective_brands, slots, bal.has_ninjabike)}
      </div>
    </div>

    <h3 style="font-size:0.86rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">
      🧩 6-Slot Combinatorial Assembly (${b.owned_slots_count}/6 Owned • 1-Exotic Cap &amp; Set Coherence Verified)
    </h3>
    <div class="slot-grid-6">${slotCardsHtml}</div>
  `;
}

function renderFarmRadarAndDeconstruct() {
  const builds = APP_STATE.evaluated_builds || [];
  const brandCounts = {};

  for (const b of builds) {
    if (b.status === "LEGACY") continue;
    for (const [slot, s] of Object.entries(b.slot_breakdown || {})) {
      if (s.status === "MISSING") {
        const bName = s.raw_brand || s.brand || "Unknown";
        if (!brandCounts[bName]) {
          brandCounts[bName] = {
            brand: bName,
            slots: new Set(),
            builds: new Set(),
            drop_pool: s.drop_pool || "LZ_TARGETED",
            acquisition_hint: s.acquisition_hint || "",
          };
        }
        brandCounts[bName].slots.add(slot);
        brandCounts[bName].builds.add(b.name);
      }
    }
  }

  const sortedRadar = Object.values(brandCounts).sort((a, b) => b.builds.size - a.builds.size);
  const radarEl = document.getElementById("farm-radar-list");
  if (radarEl) {
    if (sortedRadar.length === 0) {
      radarEl.innerHTML = `<div class="empty-state" style="padding:14px;">🎉 All 13 Meta Builds have 6/6 slots covered!</div>`;
    } else {
      radarEl.innerHTML = sortedRadar
        .slice(0, 8)
        .map(r => {
          const poolLabel = DROP_POOL_LABELS[r.drop_pool]
            ? `<div class="drop-pool-badge">${DROP_POOL_LABELS[r.drop_pool]}</div>`
            : `<div class="ri-sub" style="color:var(--teal-set);">📍 Countdown / Summit Targeted Loot</div>`;
          return `
            <div class="radar-item">
              <div class="ri-title">🎯 ${r.brand} <span class="badge badge-accent" style="float:right;">${r.builds.size} Builds</span></div>
              <div class="ri-sub">Missing Slots: <b>${Array.from(r.slots).join(", ")}</b></div>
              <div class="ri-sub">Unlocks: ${Array.from(r.builds).slice(0, 2).join(", ")}</div>
              ${poolLabel}
            </div>
          `;
        })
        .join("");
    }
  }

  const decons = APP_STATE.deconstruct_candidates || [];
  const deconBadge = document.getElementById("deconstruct-count-badge");
  if (deconBadge) deconBadge.textContent = decons.length;

  const deconEl = document.getElementById("deconstruct-list");
  if (deconEl) {
    if (decons.length === 0) {
      deconEl.innerHTML = `<div class="empty-state" style="padding:14px;">✨ Stash is clean! Zero redundant/low-roll items detected.</div>`;
    } else {
      deconEl.innerHTML = decons
        .map(
          d => `
        <div class="radar-item" style="border-left: 3px solid var(--danger);">
          <div class="ri-title">${d.display_name || d.item_name} (${d.slot})</div>
          <div class="ri-sub">${d.reason}</div>
          <div style="margin-top:5px; display:flex; justify-content:space-between; align-items:center;">
            <span class="badge badge-warn">${d.power_pct}% Roll</span>
            <button class="btn btn-danger btn-xs" onclick="deleteArmoryItem('${d.item_id}')">🗑️ Deconstruct</button>
          </div>
        </div>
      `
        )
        .join("");
    }
  }
}

// ============================================================================
// VIEW 2: INTERACTIVE 6-SLOT LOADOUT WORKBENCH & SAVED LOADOUTS LOCKER
// ============================================================================

function renderWorkbenchView() {
  const savedList = APP_STATE.saved_loadouts || [];
  const showcaseList = APP_STATE.admin_showcase_loadouts || [];

  if (!ACTIVE_WORKBENCH_LOADOUT) {
    if (savedList.length > 0) {
      ACTIVE_WORKBENCH_LOADOUT = JSON.parse(JSON.stringify(savedList[0]));
    } else if (showcaseList.length > 0) {
      ACTIVE_WORKBENCH_LOADOUT = JSON.parse(JSON.stringify(showcaseList[0]));
    } else if ((APP_STATE.evaluated_builds || []).length > 0) {
      ACTIVE_WORKBENCH_LOADOUT = _convertMatrixBuildToWorkbenchObject(APP_STATE.evaluated_builds[0]);
    }
  }

  const savedEl = document.getElementById("saved-loadouts-list");
  if (savedEl) {
    if (savedList.length === 0) {
      savedEl.innerHTML = `<div class="muted-sub" style="padding:10px;">No saved loadouts yet. Assemble or clone a showcase build below!</div>`;
    } else {
      savedEl.innerHTML = savedList
        .map(l => {
          const isAct = ACTIVE_WORKBENCH_LOADOUT && ACTIVE_WORKBENCH_LOADOUT.loadout_id === l.loadout_id;
          const pW = (l.weapons || {}).primary || l.primary_weapon || "Pestilence";
          return `
          <div class="loadout-card ${isAct ? "active" : ""}" onclick="selectSavedLoadout('${l.loadout_id}', false)">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="lc-name">${l.name}</div>
              <button class="btn btn-danger btn-xs" onclick="event.stopPropagation(); deleteSavedLoadout('${l.loadout_id}')">✕</button>
            </div>
            <div class="lc-meta">${l.specialization || "Gunner"} • ${pW}</div>
          </div>
        `;
        })
        .join("");
    }
  }

  const showcaseEl = document.getElementById("showcase-loadouts-list");
  if (showcaseEl) {
    const savedIds = new Set(savedList.map(s => s.loadout_id));
    const savedNames = new Set(savedList.map(s => String(s.name || "").trim().toLowerCase()));
    const filteredShowcase = showcaseList.filter(
      l => !savedIds.has(l.loadout_id) && !savedNames.has(String(l.name || "").trim().toLowerCase())
    );
    const scBadge = document.getElementById("showcase-count-badge");
    if (scBadge) scBadge.textContent = `${filteredShowcase.length} Cloneable`;
    if (filteredShowcase.length === 0) {
      showcaseEl.innerHTML = `<div class="muted-sub" style="padding:10px;">All Meta &amp; Showcase presets are loaded in your Saved Locker above.</div>`;
    } else {
      showcaseEl.innerHTML = filteredShowcase
        .map(l => {
          const pW = (l.weapons || {}).primary || l.primary_weapon || "Pestilence";
          const isAct = ACTIVE_WORKBENCH_LOADOUT && ACTIVE_WORKBENCH_LOADOUT.loadout_id === l.loadout_id;
          return `
          <div class="loadout-card ${isAct ? "active" : ""}" onclick="selectSavedLoadout('${l.loadout_id}', true)">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
              <div class="lc-name">🏆 ${l.name}</div>
              <button class="btn btn-gold btn-xs" onclick="event.stopPropagation(); cloneShowcaseLoadout('${l.loadout_id}')">Clone</button>
            </div>
            <div class="lc-meta">${l.tier_badge ? `${l.tier_badge} • ` : ""}${l.specialization || "Gunner"} • ${pW}</div>
          </div>
        `;
        })
        .join("");
    }
  }

  populateWorkbenchFormFromActive();
}

function selectSavedLoadout(loadoutId, isShowcase) {
  const pool = isShowcase ? APP_STATE.admin_showcase_loadouts : APP_STATE.saved_loadouts;
  const found = (pool || []).find(x => x.loadout_id === loadoutId);
  if (found) {
    ACTIVE_WORKBENCH_LOADOUT = JSON.parse(JSON.stringify(found));
    renderWorkbenchView();
  }
}

async function cloneShowcaseLoadout(loadoutId) {
  const found = (APP_STATE.admin_showcase_loadouts || []).find(x => x.loadout_id === loadoutId);
  if (!found) return;
  const cloned = JSON.parse(JSON.stringify(found));
  cloned.loadout_id = `cloned_${Date.now()}`;
  cloned.name = `${found.name} (Copy)`;
  ACTIVE_WORKBENCH_LOADOUT = cloned;
  const newState = await SHDStorageAdapter.saveLoadout(cloned);
  applyState(newState);
}

function createNewBlankLoadout() {
  ACTIVE_WORKBENCH_LOADOUT = {
    loadout_id: `custom_${Date.now()}`,
    name: "New Custom Theorycraft Build",
    archetype: "RED_DPS",
    specialization: "Gunner",
    weapons: { primary: "St. Elmo's Engine", secondary: "ACS-12", sidearm: "Orbit" },
    weapon_expertise: 27,
    weapon_talent: "",
    gear_mods: ["MOD_CHD", "MOD_CHD", "MOD_CHD"],
    notes: "Custom theorycrafted build.",
    slots: {
      MASK: { brand: "Coyote's Mask", item_name: "Coyote's Mask", rarity: "EXOTIC", core_type: "WEAPON_DAMAGE", core_val: 15.0, minors: [{ type: "CRITICAL_HIT_CHANCE", val: 6.0 }, { type: "CRITICAL_HIT_DAMAGE", val: 12.0 }], talent: "Pack Instincts" },
      CHEST: { brand: "Česká Výroba s.r.o.", item_name: "Česká Chest", rarity: "HIGH_END", core_type: "WEAPON_DAMAGE", core_val: 15.0, minors: [{ type: "CRITICAL_HIT_CHANCE", val: 6.0 }, { type: "CRITICAL_HIT_DAMAGE", val: 12.0 }], talent: "Obliterate" },
      BACKPACK: { brand: "Striker's Battlegear", item_name: "Striker's Backpack", rarity: "GEAR_SET", core_type: "WEAPON_DAMAGE", core_val: 15.0, minors: [{ type: "CRITICAL_HIT_DAMAGE", val: 12.0 }], talent: "Risk Management" },
      GLOVES: { brand: "Striker's Battlegear", item_name: "Striker's Gloves", rarity: "GEAR_SET", core_type: "WEAPON_DAMAGE", core_val: 15.0, minors: [{ type: "CRITICAL_HIT_DAMAGE", val: 12.0 }], talent: "" },
      HOLSTER: { brand: "Striker's Battlegear", item_name: "Striker's Holster", rarity: "GEAR_SET", core_type: "WEAPON_DAMAGE", core_val: 15.0, minors: [{ type: "CRITICAL_HIT_DAMAGE", val: 12.0 }], talent: "" },
      KNEEPADS: { brand: "Striker's Battlegear", item_name: "Striker's Kneepads", rarity: "GEAR_SET", core_type: "WEAPON_DAMAGE", core_val: 15.0, minors: [{ type: "CRITICAL_HIT_DAMAGE", val: 12.0 }], talent: "" },
    },
  };
  renderWorkbenchView();
}

function loadBuildIntoWorkbench(buildId) {
  const b = (APP_STATE.evaluated_builds || []).find(x => x.build_id === buildId);
  if (!b) return;
  ACTIVE_WORKBENCH_LOADOUT = _convertMatrixBuildToWorkbenchObject(b);
  switchMainView("workbench");
  renderWorkbenchView();
}

async function assembleAndSaveBuildFromMatrix(buildId) {
  const b = (APP_STATE.evaluated_builds || []).find(x => x.build_id === buildId);
  if (!b) return;
  const wbObj = _convertMatrixBuildToWorkbenchObject(b);
  wbObj.loadout_id = `assembled_${b.build_id}`;
  wbObj.name = `${b.name} (${b.owned_slots_count}/6 Armory Assembled)`;
  ACTIVE_WORKBENCH_LOADOUT = wbObj;
  const newState = await SHDStorageAdapter.saveLoadout(wbObj);
  applyState(newState);
  switchMainView("workbench");
  setIngestStatus(`⚡ Assembled & Saved '${wbObj.name}' to your Loadout Locker!`);
}

function swapMatrixAltintoWorkbench(buildId, slot, altItemId) {
  const b = (APP_STATE.evaluated_builds || []).find(x => x.build_id === buildId);
  if (!b) return;
  ACTIVE_WORKBENCH_LOADOUT = _convertMatrixBuildToWorkbenchObject(b);
  ACTIVE_SLOT_PICKER_TARGET = slot;
  equipOwnedItemToWorkbench(altItemId);
  switchMainView("workbench");
  renderWorkbenchView();
  setIngestStatus(`🔄 Swapped ${slot} to alternative Armory piece in Workbench`);
}

function _convertMatrixBuildToWorkbenchObject(b) {
  const slotsObj = {};
  for (const s of ALL_SLOTS) {
    const sb = (b.slot_breakdown || {})[s] || {};
    const parentBrand = resolveParentBrand(sb.brand || sb.raw_brand || s);
    const rawCandidate = sb.target_item_name || sb.display_name || sb.raw_brand || sb.brand || s;
    const cleanName = cleanWorkbenchPieceTitle(rawCandidate, parentBrand, s);
    const isGs = isGearSetBrand(parentBrand);
    const maxMinors = isGs ? 1 : 2;
    const defaultCoreVal = sb.core_type === "ARMOR" ? 170000 : sb.core_type === "SKILL_TIER" ? 1 : 15.0;

    slotsObj[s] = {
      item_id: sb.item_id || null,
      brand: parentBrand,
      item_name: cleanName,
      rarity: sb.rarity || (isGs ? "GEAR_SET" : "HIGH_END"),
      core_type: sb.core_type || "WEAPON_DAMAGE",
      core_val: sb.core_val != null ? sb.core_val : defaultCoreVal,
      minors: (sb.minor_attributes || []).slice(0, maxMinors).map(m => ({ type: m.type, val: m.value })),
      talent: sb.talent || "",
    };
  }
  const optMods = Array.isArray(b.optimal_gear_mods)
    ? b.optimal_gear_mods
    : (b.optimal_gear_mods && b.optimal_gear_mods.mods) || ["MOD_CHD", "MOD_CHD", "MOD_CHD"];
  const pWeapDefault = ((b.primary_weapons || [])[0] || "St. Elmo's Engine").split(" (")[0];
  return {
    loadout_id: `wb_${b.build_id}_${Date.now()}`,
    source_build_id: b.build_id,
    name: b.name,
    archetype: b.role || "RED_DPS",
    specialization: (b.specialization || "Gunner").split(" ")[0],
    primary_weapon: pWeapDefault,
    weapons: { primary: pWeapDefault },
    weapon_expertise: 27,
    weapon_talent: "",
    gear_mods: optMods,
    notes: b.summary || "",
    knowledge_dossier: b.knowledge_dossier || null,
    slots: slotsObj,
  };
}

function populateWorkbenchFormFromActive() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  const l = ACTIVE_WORKBENCH_LOADOUT;

  const nameInput = document.getElementById("wb-loadout-name");
  if (nameInput) nameInput.value = l.name || "Custom Loadout";

  const specSel = document.getElementById("wb-specialization");
  if (specSel && l.specialization) {
    for (const opt of specSel.options) {
      if (l.specialization.toLowerCase().includes(opt.value.toLowerCase())) {
        specSel.value = opt.value;
        break;
      }
    }
  }

  const weapSel = document.getElementById("wb-primary-weapon");
  const pWeap = (l.weapons || {}).primary || l.primary_weapon || "Pestilence";
  if (weapSel) {
    let matchedOpt = false;
    const pBase = pWeap.split("(")[0].trim().toLowerCase();
    for (const opt of weapSel.options) {
      const optBase = opt.value.split("(")[0].trim().toLowerCase();
      if (optBase === pBase || (optBase.length >= 4 && pBase.includes(optBase)) || (pBase.length >= 4 && optBase.includes(pBase))) {
        weapSel.value = opt.value;
        matchedOpt = true;
        break;
      }
    }
    if (!matchedOpt && pWeap) {
      const dynOpt = document.createElement("option");
      dynOpt.value = pWeap;
      dynOpt.textContent = `${pWeap} (Configured)`;
      weapSel.appendChild(dynOpt);
      weapSel.value = pWeap;
    }
  }

  const wTalSel = document.getElementById("wb-weapon-talent");
  if (wTalSel) {
    wTalSel.value = l.weapon_talent || "";
  }

  const wExpSel = document.getElementById("wb-weapon-expertise");
  if (wExpSel && l.weapon_expertise !== undefined) {
    wExpSel.value = String(l.weapon_expertise);
  }

  const gMods = Array.isArray(l.gear_mods) && l.gear_mods.length === 3 ? l.gear_mods : ["MOD_CHD", "MOD_CHD", "MOD_CHD"];
  ["wb-mod-1", "wb-mod-2", "wb-mod-3"].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el && gMods[idx]) el.value = gMods[idx];
  });

  const notesEl = document.getElementById("wb-loadout-notes");
  if (notesEl) notesEl.value = l.notes || "";

  recalcWorkbench();
}

function autoAssembleWorkbenchFromArmory() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  const l = ACTIVE_WORKBENCH_LOADOUT;

  const matchedEval = (APP_STATE.evaluated_builds || []).find(
    eb =>
      eb.build_id === l.source_build_id ||
      eb.name.toLowerCase() === (l.name || "").toLowerCase() ||
      (l.name || "").toLowerCase().includes(eb.name.toLowerCase().split(" ")[0])
  );

  let usedExotic = false;
  let equippedCount = 0;

  for (const slot of ALL_SLOTS) {
    if (matchedEval && matchedEval.slot_breakdown && matchedEval.slot_breakdown[slot]?.status === "OWNED") {
      const sb = matchedEval.slot_breakdown[slot];
      const ownedItem = (APP_STATE.inventory || []).find(x => x.item_id === sb.item_id);
      if (ownedItem) {
        ACTIVE_SLOT_PICKER_TARGET = slot;
        equipOwnedItemToWorkbench(ownedItem.item_id, true);
        equippedCount += 1;
        if (ownedItem.rarity === "EXOTIC") usedExotic = true;
        continue;
      }
    }

    const curSlot = (l.slots || {})[slot] || {};
    const targetBrand = resolveParentBrand(curSlot.brand || curSlot.item_name || "");
    const slotItems = (APP_STATE.inventory || []).filter(it => it.slot === slot);
    const matching = slotItems.filter(it => {
      if (it.rarity === "EXOTIC" && usedExotic) return false;
      const itBrand = resolveParentBrand(it.brand_or_set || it.item_name || "");
      return itBrand.toLowerCase() === targetBrand.toLowerCase();
    });

    if (matching.length > 0) {
      matching.sort((a, b) => ((b.archetype_tags?.power_pct || 90) - (a.archetype_tags?.power_pct || 90)));
      const best = matching[0];
      if (best.rarity === "EXOTIC") usedExotic = true;
      ACTIVE_SLOT_PICKER_TARGET = slot;
      equipOwnedItemToWorkbench(best.item_id, true);
      equippedCount += 1;
    }
  }

  autoBalanceWorkbenchChcMods();
  recalcWorkbench();
  setIngestStatus(`⚡ Auto-Assembled ${equippedCount}/6 owned Armory pieces & balanced 60% CHC Gear Mods!`);
}

function _buildWorkbenchBallisticsInputs(loadout) {
  const slots = loadout.slots || loadout.slot_items || {};
  const bCores = { RED: 0, BLUE: 0, YELLOW: 0 };
  const bBrands = {};
  const slotBreakdown = {};

  for (const slot of ALL_SLOTS) {
    const s = slots[slot] || {
      brand: "Lengmo",
      item_name: `Lengmo ${slot}`,
      core_type: "WEAPON_DAMAGE",
      core_val: 15.0,
      minors: [],
      talent: "",
    };
    if (!s.brand && s.brand_or_set) s.brand = s.brand_or_set;
    if ((!Array.isArray(s.minors) || s.minors.length === 0) && Array.isArray(s.minor_attributes) && s.minor_attributes.length > 0) {
      s.minors = s.minor_attributes.map(m => ({ type: m.type || m.stat, val: m.val ?? m.value ?? 0 }));
    }
    if ((!Array.isArray(s.minors) || s.minors.length === 0) && (s.m1_stat || s.m2_stat)) {
      s.minors = [];
      if (s.m1_stat) s.minors.push({ type: s.m1_stat, val: Number(s.m1_val || 0) });
      if (s.m2_stat) s.minors.push({ type: s.m2_stat, val: Number(s.m2_val || 0) });
    }
    slots[slot] = s;

    const rawName = String(s.item_name || s.brand || "").toLowerCase();
    const parentBrand = resolveParentBrand(s.brand || s.item_name || "Unknown");
    const isTriple = s.core_type === "TRIPLE_CORE" || rawName.includes("memento") || rawName.includes("ninjabike");

    if (isTriple) {
      bCores.RED += 1;
      bCores.BLUE += 1;
      bCores.YELLOW += 1;
    } else if (s.core_type === "ARMOR") {
      bCores.BLUE += 1;
    } else if (s.core_type === "SKILL_TIER") {
      bCores.YELLOW += 1;
    } else {
      bCores.RED += 1;
    }

    bBrands[parentBrand] = (bBrands[parentBrand] || 0) + 1;
    slotBreakdown[slot] = {
      status: s.item_id ? "OWNED" : "THEORYCRAFT",
      item_id: s.item_id || null,
      display_name: s.item_name || parentBrand,
      brand: parentBrand,
      raw_brand: s.item_name || s.brand || parentBrand,
      core_type: s.core_type || "WEAPON_DAMAGE",
      core_val: Number(s.core_val || 15.0),
      minor_attributes: (s.minors || []).map(m => ({ type: m.type || m.stat, value: Number(m.val ?? m.value ?? 0) })),
      talent: s.talent || "",
    };
  }
  loadout.slots = slots;
  return { slotBreakdown, bCores, bBrands };
}

function autoBalanceWorkbenchChcMods() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  const l = ACTIVE_WORKBENCH_LOADOUT;
  const pWeap = document.getElementById("wb-primary-weapon")?.value || "Pestilence";
  const specVal = document.getElementById("wb-specialization")?.value || l.specialization || "Gunner";
  const { slotBreakdown, bCores, bBrands } = _buildWorkbenchBallisticsInputs(l);

  const pseudoBuild = {
    name: l.name || "Workbench Loadout",
    role: l.archetype || "RED_DPS",
    specialization: specVal,
    primary_weapons: [pWeap],
  };

  const probe = SHDStorageAdapter.computeLoadoutBallisticsJS(
    pseudoBuild,
    slotBreakdown,
    bCores,
    bBrands,
    APP_STATE.canonical,
    Number(l.weapon_expertise || 27),
    l.weapon_talent || null,
    ["MOD_CHD", "MOD_CHD", "MOD_CHD"]
  );

  const baseChcNoMods = Number(probe.raw_uncapped_chc_pct ?? probe.chc_pct ?? 0);
  const deficit = Math.max(0.0, 58.0 - baseChcNoMods);
  const chcMods = Math.min(3, Math.max(0, Math.ceil(deficit / 6.0)));

  const mods = [
    chcMods >= 1 ? "MOD_CHC" : "MOD_CHD",
    chcMods >= 2 ? "MOD_CHC" : "MOD_CHD",
    chcMods >= 3 ? "MOD_CHC" : "MOD_CHD",
  ];
  l.gear_mods = mods;
  ["wb-mod-1", "wb-mod-2", "wb-mod-3"].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.value = mods[idx];
  });
  recalcWorkbench();
}

function renderWorkbenchDossier(loadout) {
  const container = document.getElementById("wb-dossier-container");
  if (!container) return;

  let dossier = loadout.knowledge_dossier;
  if (!dossier) {
    const matched = (APP_STATE.evaluated_builds || []).find(
      eb =>
        eb.build_id === loadout.source_build_id ||
        eb.name.toLowerCase() === (loadout.name || "").toLowerCase() ||
        (loadout.name || "").toLowerCase().includes(eb.name.toLowerCase().split(" ")[0])
    );
    if (matched) dossier = matched.knowledge_dossier;
  }
  if (!dossier) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = `<div style="margin-top:12px;">${buildDossierHtml(dossier, null)}</div>`;
}

function recalcWorkbench() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  const l = ACTIVE_WORKBENCH_LOADOUT;

  l.name = document.getElementById("wb-loadout-name")?.value || l.name;
  l.specialization = document.getElementById("wb-specialization")?.value || "Gunner";
  const pWeap = document.getElementById("wb-primary-weapon")?.value || "Pestilence";
  l.primary_weapon = pWeap;
  l.weapons = { ...(l.weapons || {}), primary: pWeap };
  const wTalent = document.getElementById("wb-weapon-talent")?.value || "";
  l.weapon_talent = wTalent;
  const wExp = Number(document.getElementById("wb-weapon-expertise")?.value || 27);
  l.weapon_expertise = wExp;
  l.notes = document.getElementById("wb-loadout-notes")?.value || l.notes;

  const mod1 = document.getElementById("wb-mod-1")?.value || "MOD_CHD";
  const mod2 = document.getElementById("wb-mod-2")?.value || "MOD_CHD";
  const mod3 = document.getElementById("wb-mod-3")?.value || "MOD_CHD";
  l.gear_mods = [mod1, mod2, mod3];

  const { slotBreakdown, bCores, bBrands } = _buildWorkbenchBallisticsInputs(l);
  const slots = l.slots || {};

  const cardsHtml = ALL_SLOTS.map(slot => {
    const s = slots[slot] || {};
    const parentBrand = resolveParentBrand(s.brand || s.item_name || "Unknown");
    const cleanTitle = cleanWorkbenchPieceTitle(s.item_name || s.brand, parentBrand, slot);
    s.item_name = cleanTitle;
    const rawName = cleanTitle.toLowerCase();
    const isTriple = s.core_type === "TRIPLE_CORE" || rawName.includes("memento") || rawName.includes("ninjabike");

    const coreBadge = isTriple
      ? "🌈 Triple Core (+15% WD / +170k / +1 Tier)"
      : s.core_type === "ARMOR"
      ? `🔵 +${Number(s.core_val || 170000).toLocaleString()} Armor`
      : s.core_type === "SKILL_TIER"
      ? `🟡 +1 Skill Tier`
      : `🔴 +${Number(s.core_val || 15.0).toFixed(1)}% Weapon DMG`;

    const minorsHtml = (s.minors || [])
      .map(m => `<div>• ${STAT_LABELS[m.type] || m.type}: <b>${formatStatVal(m.type, m.val ?? m.value)}</b></div>`)
      .join("");

    const ownershipTag = s.item_id
      ? ` • <span class="wsc-status-owned">🎒 Owned</span>`
      : ` • <span class="wsc-status-target">🎯 Target Roll</span>`;

    return `
      <div class="wb-slot-card" onclick="openSlotPickerModal('${slot}')">
        <div class="wsc-top">
          <span class="wsc-slot">${slot}</span>
          <span class="wsc-edit-hint">⚙️ Change Piece</span>
        </div>
        <div class="wsc-name">${cleanTitle}</div>
        <div class="wsc-brand">${parentBrand}${ownershipTag}</div>
        <div class="wsc-stats">
          <div style="margin-bottom:3px;"><b>${coreBadge}</b></div>
          ${minorsHtml}
          ${s.talent ? `<div style="color:var(--gold-high); margin-top:3px;">✨ <b>${s.talent}</b></div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  const slotsGrid = document.getElementById("wb-slots-grid");
  if (slotsGrid) slotsGrid.innerHTML = cardsHtml;
  renderWorkbenchDossier(l);

  const pseudoBuild = {
    name: l.name || "Workbench Loadout",
    role: l.archetype || "RED_DPS",
    specialization: l.specialization || "Gunner",
    primary_weapons: [pWeap],
  };

  const bal = SHDStorageAdapter.computeLoadoutBallisticsJS(
    pseudoBuild,
    slotBreakdown,
    bCores,
    bBrands,
    APP_STATE.canonical,
    wExp,
    wTalent || null,
    [mod1, mod2, mod3]
  );

  const modPfe = [mod1, mod2, mod3].reduce((acc, m) => acc + (m === "MOD_PFE" ? 12 : 0), 0);
  const effBrands = bal.effective_brands || bBrands;
  const activeBonusesHtml = renderActiveSetBonusesHtml(effBrands, slotBreakdown, bal.has_ninjabike);

  const ttkRowsHtml = (bal.ttk_matrix || [])
    .map(
      t => `
      <tr>
        <td>${t.label} (${t.hp_millions}M)</td>
        <td style="font-weight:800; color:var(--shd-orange);">${Number(t.ttk_sec).toFixed(2)}s</td>
        <td>${t.shots_needed} rds (${Number(t.mags_needed).toFixed(1)}m)</td>
      </tr>
    `
    )
    .join("");

  const rawChc = Number(bal.raw_uncapped_chc_pct ?? bal.chc_pct ?? 0);
  const chcOvercapWarning = rawChc > 60.5
    ? `<div style="font-size:0.7rem; color:var(--warn); margin-top:4px;">⚠️ Raw CHC is ${rawChc.toFixed(1)}% (${(rawChc - 60).toFixed(1)}% over 60% cap) — click '🎯 Auto-Cap 60% CHC' to convert excess CHC mods to CHD!</div>`
    : "";

  const telEl = document.getElementById("wb-telemetry-content");
  if (telEl) {
    telEl.innerHTML = `
      <div class="tel-section">
        <h4>⚡ Primary Combat Output (${bal.weapon_name || pWeap})</h4>
        <div class="tel-big-dps">${((bal.burst_dps || 0) / 1e6).toFixed(2)}M <span style="font-size:0.8rem; color:var(--text-muted);">Burst DPS</span></div>
        <div class="tel-row"><span>Sustained DPS (w/ Reload):</span><b>${((bal.sustained_dps || 0) / 1e6).toFixed(2)}M / sec</b></div>
        <div class="tel-row"><span>Avg Per-Bullet Hit:</span><b>${Math.round(bal.per_bullet_dmg || 0).toLocaleString()}</b></div>
        ${bal.pesti_tick_dps > 0 ? `<div class="tel-row" style="color:var(--shd-orange);"><span>☣️ Max Pestilence Tick (50x):</span><b>${(bal.pesti_tick_dps / 1e6).toFixed(2)}M / sec</b></div>` : ""}
        ${bal.skill_combined_dps > 0 ? `<div class="tel-row" style="color:var(--yellow-core);"><span>⚡ Combined Skill DPS:</span><b>${(bal.skill_combined_dps / 1e3).toFixed(0)}k / sec</b></div>` : ""}
        <div class="tel-row"><span>Effective RPM / Mag / Reload:</span><b>${bal.effective_rpm} RPM / ${bal.mag_size} / ${Number(bal.reload_sec).toFixed(2)}s</b></div>
      </div>

      <div class="tel-section">
        <h4>🎯 5-Target Enemy TTK Matrix</h4>
        <table class="ttk-matrix-table">
          <thead>
            <tr><th>Target Archetype</th><th>TTK</th><th>Ammo</th></tr>
          </thead>
          <tbody>${ttkRowsHtml}</tbody>
        </table>
      </div>

      <div class="tel-section">
        <h4>🧮 7-Bucket Multiplicative Breakdown</h4>
        <div class="tel-row"><span>Cores (🔴 / 🔵 / 🟡):</span><b>${bCores.RED}R / ${bCores.BLUE}B / ${bal.effective_yellow_tiers}Y</b></div>
        <div class="tel-row"><span>Weapon Damage (Bucket 2):</span><b>+${Number(bal.total_wd_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>Crit Chance (Cap 60%):</span><b style="color:${bal.chc_pct >= 58 ? "var(--success)" : "var(--text-main)"};">${Number(bal.chc_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>Crit Hit Damage:</span><b>+${Number(bal.chd_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>Headshot Damage:</span><b>+${Number(bal.hsd_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>Damage to Armor (Bucket 4):</span><b>+${Number(bal.dta_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>DMG Out of Cover (Bucket 5):</span><b>+${Number(bal.dttooc_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>Total Weapon DMG (Bucket 6):</span><b>+${Number(bal.twd_pct || 0).toFixed(1)}%</b></div>
        <div class="tel-row"><span>Amplified Multiplier (Bucket 7):</span><b>x${Number(bal.amp_multiplier || 1).toFixed(2)}</b></div>
        ${chcOvercapWarning}
      </div>

      <div class="tel-section">
        <h4>🛡️ Survivability &amp; Active Set Bonuses ${bal.has_ninjabike ? `<span class="badge badge-accent" style="float:right;">🥷 +1 NB</span>` : ""}</h4>
        <div class="tel-row"><span>Total Agent Armor:</span><b>${((bal.total_armor || 0) / 1e6).toFixed(2)}M</b></div>
        ${bal.armor_regen_per_sec > 0 ? `<div class="tel-row"><span>Armor Regen / Sec:</span><b>+${bal.armor_regen_per_sec.toLocaleString()} / s</b></div>` : ""}
        ${modPfe > 0 ? `<div class="tel-row"><span>Protection From Elites:</span><b>+${modPfe}%</b></div>` : ""}
        <div class="set-bonuses-stack">
          ${activeBonusesHtml}
        </div>
      </div>
    `;
  }
  renderWorkbenchDossier(l);
}

async function stageCurrentWorkbenchToMetaStudio() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  recalcWorkbench();
  const l = ACTIVE_WORKBENCH_LOADOUT;
  const slotsSpec = {};
  const tCores = { RED: 0, BLUE: 0, YELLOW: 0 };
  const minorFreq = {};

  for (const slot of ALL_SLOTS) {
    const s = (l.slots || {})[slot] || {};
    const prefName = (s.rarity === "EXOTIC" || s.rarity === "NAMED_HIGH_END")
      ? (s.item_name || s.brand || "Česká Výroba s.r.o.")
      : (s.brand || s.item_name || "Česká Výroba s.r.o.");
    const cType = s.core_type || "WEAPON_DAMAGE";
    if (cType === "ARMOR") tCores.BLUE += 1;
    else if (cType === "SKILL_TIER") tCores.YELLOW += 1;
    else tCores.RED += 1;

    const mTypes = (s.minors || []).map(m => m.type || m.stat).filter(Boolean);
    mTypes.forEach(mt => { minorFreq[mt] = (minorFreq[mt] || 0) + 1; });

    const sObj = {
      preferred: [prefName],
      alt_brands: [],
      core: cType,
      minors: mTypes.length ? mTypes : ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"],
    };
    if (s.talent && (slot === "CHEST" || slot === "BACKPACK")) {
      sObj.talent = s.talent;
    }
    slotsSpec[slot] = sObj;
  }

  const idealMinors = Object.entries(minorFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const pWeap = (l.weapons || {}).primary || l.primary_weapon || "St. Elmo's Engine";
  const existingMatch = (APP_STATE.evaluated_builds || []).find(eb => eb.build_id === l.source_build_id && eb.name.toLowerCase() === (l.name || "").toLowerCase());
  const buildCandidate = {
    build_id: existingMatch ? existingMatch.build_id : undefined,
    name: l.name || "Workbench Theorycraft Build",
    role: l.archetype || l.role || "RED_DPS",
    tier_badge: l.tier_badge || "WORKBENCH META",
    summary: l.notes || `Workbench-configured ${l.name || "Loadout"} (${pWeap}).`,
    primary_weapons: [pWeap, (l.weapons || {}).secondary || "ACS-12"],
    specialization: l.specialization || "Gunner",
    target_cores: tCores,
    ideal_minors: idealMinors.length ? idealMinors : ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"],
    slots: slotsSpec,
    knowledge_dossier: l.knowledge_dossier || undefined,
  };

  try {
    const res = await SHDStorageAdapter.stageMetaProposal({
      action: existingMatch ? "MODIFY" : "ADD",
      build: buildCandidate,
      source_citation: "Loadout Workbench 6-Slot Configurator",
      reason: `Staged directly from Loadout Workbench (${pWeap} • ${l.specialization || "Gunner"})`,
    });
    if (res && res.state) applyState(res.state);
    openMetaStudioDialog("proposals");
    setIngestStatus(`🚀 Staged '${buildCandidate.name}' into Meta Studio with live Two-Gate 7-Bucket DPS benchmark!`);
  } catch (err) {
    alert(err.message || "Two-Gate validation blocked this Workbench configuration (check 1-Exotic armor rule).");
  }
}

async function saveCurrentWorkbenchLoadout() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  recalcWorkbench();
  const newState = await SHDStorageAdapter.saveLoadout(ACTIVE_WORKBENCH_LOADOUT);
  applyState(newState);
  setIngestStatus(`✅ Saved Loadout: ${ACTIVE_WORKBENCH_LOADOUT.name}`);
}

async function deleteSavedLoadout(loadoutId) {
  const newState = await SHDStorageAdapter.deleteLoadout(loadoutId);
  if (ACTIVE_WORKBENCH_LOADOUT && ACTIVE_WORKBENCH_LOADOUT.loadout_id === loadoutId) {
    ACTIVE_WORKBENCH_LOADOUT = null;
  }
  applyState(newState);
}

function exportWorkbenchShareCard() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  recalcWorkbench();
  const jsonStr = JSON.stringify(ACTIVE_WORKBENCH_LOADOUT, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    setIngestStatus("📋 Copied Loadout JSON to Clipboard!");
  });
}

// ============================================================================
// WORKBENCH SLOT PICKER MODAL
// ============================================================================

function openSlotPickerModal(slot) {
  ACTIVE_SLOT_PICKER_TARGET = slot;
  const modal = document.getElementById("slot-picker-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  document.getElementById("slot-picker-title").textContent = `Configure Slot: ${slot}`;

  const ownedForSlot = (APP_STATE.inventory || []).filter(x => x.slot === slot);
  document.getElementById("sp-owned-count").textContent = ownedForSlot.length;
  const ownedListEl = document.getElementById("sp-owned-list");
  if (ownedListEl) {
    if (ownedForSlot.length === 0) {
      ownedListEl.innerHTML = `<div class="muted-sub">No owned ${slot} items in Armory. Use the Theorycraft configurator on the right!</div>`;
    } else {
      ownedListEl.innerHTML = ownedForSlot
        .map(it => {
          const c = it.core_attribute || {};
          const mStr = (it.minor_attributes || []).map(m => `${STAT_LABELS[m.type] || m.type} ${formatStatVal(m.type, m.value)}`).join(" • ");
          return `
          <div class="loadout-card" onclick="equipOwnedItemToWorkbench('${it.item_id}')">
            <div class="lc-name">${it.item_name || it.brand_or_set} <span class="badge">${it.rarity}</span></div>
            <div class="lc-meta">${it.brand_or_set} • ${STAT_LABELS[c.type] || c.type} ${formatStatVal(c.type, c.value)}</div>
            <div class="lc-meta">${mStr}</div>
            ${it.talent && it.talent.name ? `<div class="lc-meta" style="color:var(--gold-high);">✨ ${it.talent.name}</div>` : ""}
          </div>
        `;
        })
        .join("");
    }
  }

  const brandSel = document.getElementById("sp-brand-select");
  if (brandSel) {
    const db = APP_STATE.canonical || {};
    const options = [];
    for (const [k] of iterCanonicalEntries(db.brand_sets)) options.push(`<option value="${k}">🟡 Brand: ${k}</option>`);
    for (const [k] of iterCanonicalEntries(db.gear_sets)) options.push(`<option value="${k}">🟢 Gear Set: ${k}</option>`);
    for (const [k, m] of iterCanonicalEntries(db.named_items)) {
      if (!m.slot || m.slot === slot) options.push(`<option value="${k}">⭐ Named: ${k} (${m.brand || ""})</option>`);
    }
    for (const [k, m] of iterCanonicalEntries(db.exotics)) {
      if (!m.slot || m.slot === slot) options.push(`<option value="${k}">🔴 Exotic: ${k}</option>`);
    }
    brandSel.innerHTML = options.join("");
  }

  const cur = ((ACTIVE_WORKBENCH_LOADOUT || {}).slots || {})[slot] || {};
  if (cur.brand && brandSel) brandSel.value = cur.brand;
  document.getElementById("sp-item-name").value = cur.item_name || "";
  document.getElementById("sp-core-select").value = cur.core_type || "WEAPON_DAMAGE";

  const m1 = (cur.minors || [])[0] || { type: "CRITICAL_HIT_CHANCE", val: 6.0 };
  const m2 = (cur.minors || [])[1] || { type: isGearSetBrand(cur.brand) ? "NONE" : "CRITICAL_HIT_DAMAGE", val: 12.0 };
  const m1StatEl = document.getElementById("sp-m1-stat");
  const m2StatEl = document.getElementById("sp-m2-stat");
  if (m1StatEl) m1StatEl.value = m1.type || "CRITICAL_HIT_CHANCE";
  if (m2StatEl) m2StatEl.value = (cur.minors || []).length === 1 ? "NONE" : (m2.type || "CRITICAL_HIT_DAMAGE");
  document.getElementById("sp-m1-val").value = m1.val ?? m1.value ?? 6.0;
  document.getElementById("sp-m2-val").value = m2.val ?? m2.value ?? 12.0;

  document.getElementById("sp-talent-input").value = cur.talent || "";
  document.getElementById("sp-talent-group").style.display = slot === "CHEST" || slot === "BACKPACK" ? "block" : "none";
}

function closeSlotPickerModal() {
  document.getElementById("slot-picker-modal")?.classList.add("hidden");
}

function handleSpBrandChange() {
  const val = document.getElementById("sp-brand-select").value;
  document.getElementById("sp-item-name").value = val;
  const m2StatEl = document.getElementById("sp-m2-stat");
  if (m2StatEl && isGearSetBrand(val)) {
    m2StatEl.value = "NONE";
  }
}

function handleSpMinorStatChange(idx) {
  const statEl = document.getElementById(`sp-m${idx}-stat`);
  const valEl = document.getElementById(`sp-m${idx}-val`);
  if (statEl && valEl && MINOR_DEFAULT_CAPS[statEl.value]) {
    valEl.value = MINOR_DEFAULT_CAPS[statEl.value];
  }
}

function equipOwnedItemToWorkbench(itemId, silent = false) {
  const it = (APP_STATE.inventory || []).find(x => x.item_id === itemId);
  if (!it || !ACTIVE_WORKBENCH_LOADOUT) return;
  const cat = inferItemCategory(it);

  if (cat === "WEAPON") {
    const wName = it.item_name || it.brand_or_set || "Pestilence";
    ACTIVE_WORKBENCH_LOADOUT.primary_weapon = wName;
    ACTIVE_WORKBENCH_LOADOUT.weapons = { ...(ACTIVE_WORKBENCH_LOADOUT.weapons || {}), primary: wName };
    if (it.talent && it.talent.name) ACTIVE_WORKBENCH_LOADOUT.weapon_talent = it.talent.name;
    if (it.expertise_level > 0) ACTIVE_WORKBENCH_LOADOUT.weapon_expertise = it.expertise_level;
    if (!silent) populateWorkbenchFormFromActive();
    return;
  }

  if (cat === "GEAR_MOD") {
    const m0 = ((it.minor_attributes || [])[0] || {}).type || "";
    const modCode = m0 === "CRITICAL_HIT_CHANCE" ? "MOD_CHC"
      : m0 === "HEADSHOT_DAMAGE" ? "MOD_HSD"
      : m0 === "PROTECTION_FROM_ELITES" ? "MOD_PFE"
      : m0 === "SKILL_HASTE" ? "MOD_SKILL_HASTE"
      : m0 === "SKILL_REPAIR" ? "MOD_REPAIR_SKILLS"
      : "MOD_CHD";
    const gm = Array.isArray(ACTIVE_WORKBENCH_LOADOUT.gear_mods) ? [...ACTIVE_WORKBENCH_LOADOUT.gear_mods] : ["MOD_CHD", "MOD_CHD", "MOD_CHD"];
    gm[0] = modCode;
    ACTIVE_WORKBENCH_LOADOUT.gear_mods = gm;
    if (!silent) populateWorkbenchFormFromActive();
    return;
  }

  const slot = ALL_SLOTS.includes(it.slot) ? it.slot : ACTIVE_SLOT_PICKER_TARGET;
  const c = it.core_attribute || {};
  const parentBrand = resolveParentBrand(it.brand_or_set || it.item_name);
  const maxMinors = it.rarity === "GEAR_SET" || isGearSetBrand(parentBrand) ? 1 : 2;

  ACTIVE_WORKBENCH_LOADOUT.slots[slot] = {
    item_id: it.item_id,
    brand: parentBrand,
    item_name: it.item_name || it.brand_or_set,
    rarity: it.rarity,
    core_type: c.triple_core ? "TRIPLE_CORE" : c.type || "WEAPON_DAMAGE",
    core_val: c.value || (c.type === "ARMOR" ? 170000 : c.type === "SKILL_TIER" ? 1 : 15.0),
    minors: (it.minor_attributes || []).slice(0, maxMinors).map(m => ({ type: m.type, val: m.value })),
    talent: (it.talent || {}).name || "",
  };
  if (!silent) {
    closeSlotPickerModal();
    recalcWorkbench();
  }
}

function quickEquipFromArmoryToWorkbench(itemId) {
  const it = (APP_STATE.inventory || []).find(x => x.item_id === itemId);
  if (!it) return;
  if (!ACTIVE_WORKBENCH_LOADOUT) {
    renderWorkbenchView();
  }
  ACTIVE_SLOT_PICKER_TARGET = it.slot;
  equipOwnedItemToWorkbench(itemId, false);
  switchMainView("workbench");
  setIngestStatus(`🛠️ Equipped '${it.item_name || it.brand_or_set}' into Workbench [${it.slot}]!`);
}

function applyTheorycraftSlot() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  const slot = ACTIVE_SLOT_PICKER_TARGET;
  const rawBrand = document.getElementById("sp-brand-select").value || "Lengmo";
  const parentBrand = resolveParentBrand(rawBrand);
  const name = document.getElementById("sp-item-name").value.trim() || `${rawBrand} ${slot}`;
  const coreType = document.getElementById("sp-core-select").value;
  const coreVal = coreType === "ARMOR" ? 170000 : coreType === "SKILL_TIER" ? 1 : 15.0;

  const m1Type = document.getElementById("sp-m1-stat")?.value || "CRITICAL_HIT_CHANCE";
  const m1Val = Number(document.getElementById("sp-m1-val").value || 6.0);
  const m2Type = document.getElementById("sp-m2-stat")?.value || "CRITICAL_HIT_DAMAGE";
  const m2Val = Number(document.getElementById("sp-m2-val").value || 12.0);
  const talent = document.getElementById("sp-talent-input").value.trim();

  const isGs = isGearSetBrand(parentBrand);
  const minors = [{ type: m1Type, val: m1Val }];
  if (!isGs && m2Type !== "NONE") {
    minors.push({ type: m2Type, val: m2Val });
  }

  ACTIVE_WORKBENCH_LOADOUT.slots[slot] = {
    item_id: null,
    brand: parentBrand,
    item_name: name,
    rarity: isGs ? "GEAR_SET" : "HIGH_END",
    core_type: coreType,
    core_val: coreVal,
    minors,
    talent: slot === "CHEST" || slot === "BACKPACK" ? talent : "",
  };
  closeSlotPickerModal();
  recalcWorkbench();
}

// ============================================================================
// VIEW 3: ARMORY & STASH INVENTORY EXPLORER (MULTI-CATEGORY + IN LOADOUTS)
// ============================================================================

function filterArmorySlot(slotKey, btnEl) {
  ACTIVE_ARMORY_SLOT = slotKey;
  document.querySelectorAll("#armory-slot-tabs .slot-tab").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderArmoryGrid();
}

function filterArmoryArchetype(archKey, btnEl) {
  ACTIVE_ARMORY_ARCHETYPE = archKey;
  document.querySelectorAll("#armory-archetype-pills .filter-pill").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderArmoryGrid();
}

function _renderSingleArmoryCard(it, usageMap, trashIds) {
  const cat = inferItemCategory(it);
  const c = it.core_attribute || {};
  const coreClass = c.type === "ARMOR" ? "core-blue" : c.type === "SKILL_TIER" ? "core-yellow" : "core-red";
  const rarityClass =
    it.rarity === "EXOTIC" ? "rarity-exotic" : it.rarity === "GEAR_SET" ? "rarity-set" : it.rarity === "NAMED_HIGH_END" ? "rarity-named" : "";

  const tags = it.archetype_tags || {};
  const archMeta = ARCHETYPE_BADGE_MAP[tags.role_archetype || "CRIT_DPS"] || ARCHETYPE_BADGE_MAP.CRIT_DPS;
  const recalState = tags.recal_state || "VIRGIN";
  const recalBadgeText =
    recalState === "PROTOTYPE"
      ? `🟣 PROTOTYPE${it.augment ? ` (${it.augment})` : ""}`
      : recalState === "VIRGIN"
      ? "🌱 VIRGIN"
      : `🔧 ${recalState.replace("RECAL_", "RECAL ")}`;

  const expBadge = Number(it.expertise_level || 0) > 0
    ? `<span class="badge badge-gold" title="Item Expertise Grade">⭐ Exp ${it.expertise_level}</span>`
    : "";

  const rollSource = it.roll_source || "OCR_DIRECT";
  const provHtml =
    rollSource === "PIP_DEDUCED" && !it.user_verified
      ? `<span class="provenance-badge pip-deduced" title="Minor roll value deduced from attribute pip color — click Verify to confirm">⚡ PIP DEDUCED</span>`
      : `<span class="provenance-badge ocr-direct">${it.user_verified ? "🛡️ VERIFIED" : "✔ OCR DIRECT"}</span>`;

  const minorsHtml = (it.minor_attributes || [])
    .map(
      m => `
      <div class="ac-stat-line">
        <span>${m.recal || m.is_recalibrated ? "🔧 " : ""}${STAT_LABELS[m.type] || m.type}</span>
        <b>${formatStatVal(m.type, m.value)}</b>
      </div>
    `
    )
    .join("");

  const usages = usageMap[it.item_id] || [];
  const igLoadouts = Array.isArray(it.in_game_loadouts) ? it.in_game_loadouts : [];
  const isTrash = trashIds.has(it.item_id) && igLoadouts.length === 0;
  const usageBadges = usages
    .slice(0, 2)
    .map(u => `<span class="usage-pill">🏆 ${u.build_name} (${u.score}%)</span>`)
    .join("");
  const inGameLoadoutBadges = igLoadouts
    .map(ldName => `<span class="usage-pill in-loadout" title="Protected from Deconstruct Advisor">🎮 In Loadout: ${ldName}</span>`)
    .join("");

  const slotLabel = cat === "WEAPON" ? `🔫 ${it.weapon_class || it.slot}` : it.slot;
  const showEquipBtn = cat !== "SKILL_MOD";

  return `
    <div class="armory-card ${rarityClass}">
      <div class="ac-top">
        <div>
          <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
            <span class="sec-slot-tag">${slotLabel}</span>
            <span class="archetype-badge" title="${archMeta.title}">${archMeta.label}</span>
            ${expBadge}
            ${provHtml}
          </div>
          <div class="ac-name" style="margin-top:4px;">${it.item_name || it.brand_or_set}</div>
          <div class="ac-brand">${it.brand_or_set} • <span style="font-size:0.68rem; color:var(--text-muted);">${recalBadgeText} (${tags.power_pct || 100}% Roll)</span></div>
        </div>
        <button class="btn-fav ${it.is_favorite ? "fav" : ""}" onclick="toggleItemFavorite('${it.item_id}')" title="Favorite / Lock Item">★</button>
      </div>

      ${it.crop_image_path ? `<img src="${it.crop_image_path}" class="ac-crop-img" alt="OCR Crop" onerror="this.style.display='none'" />` : ""}

      <div class="ac-stats-box">
        ${cat === "GEAR_MOD" || cat === "SKILL_MOD" ? "" : `
        <div class="ac-stat-line ${coreClass}">
          <span>${c.recal || c.is_recalibrated ? "🔧 " : ""}Core: ${STAT_LABELS[c.type] || c.type}</span>
          <b>${formatStatVal(c.type, c.value)}</b>
        </div>`}
        ${minorsHtml}
        ${it.talent && it.talent.name ? `<div class="ac-stat-line" style="color:var(--gold-high);"><span>${it.talent.recal ? "🔧 " : "✨ "}Talent</span><b>${it.talent.name}</b></div>` : ""}
      </div>

      <div class="ac-usage-tags">
        ${inGameLoadoutBadges}
        ${usageBadges}
        ${isTrash ? `<span class="usage-pill trash">🗑️ Safe to Deconstruct</span>` : ""}
      </div>

      <div class="ac-footer">
        <span class="muted-sub">Conf: ${Math.round((it.ocr_confidence || 0.98) * 100)}%</span>
        <div style="display:flex; gap:5px;">
          ${showEquipBtn ? `<button class="btn btn-gold btn-xs" onclick="quickEquipFromArmoryToWorkbench('${it.item_id}')" title="Equip directly into active Loadout Workbench">🛠️ Equip</button>` : ""}
          <button class="btn btn-outline btn-xs" onclick="openVerifyModal('${it.item_id}')">✏️ Verify</button>
          <button class="btn btn-danger btn-xs" onclick="deleteArmoryItem('${it.item_id}')">🗑️</button>
        </div>
      </div>
    </div>
  `;
}

function renderArmoryGrid() {
  const grid = document.getElementById("armory-grid");
  if (!grid) return;

  const query = (document.getElementById("stash-search")?.value || "").toLowerCase().trim();
  const coreFilter = document.getElementById("armory-core-filter")?.value || "ALL";
  const stateFilter = document.getElementById("armory-state-filter")?.value || "ALL";
  const groupBy = document.getElementById("armory-group-by")?.value || "NONE";

  const trashIds = new Set((APP_STATE.deconstruct_candidates || []).map(d => d.item_id));
  const usageMap = APP_STATE.item_usage || {};

  const filtered = (APP_STATE.inventory || []).filter(it => {
    const cat = inferItemCategory(it);
    const tags = it.archetype_tags || {};
    const igLoadouts = Array.isArray(it.in_game_loadouts) ? it.in_game_loadouts : [];

    if (ACTIVE_ARMORY_SLOT === "FAV" && !it.is_favorite) return false;
    if (ACTIVE_ARMORY_SLOT === "TRASH" && !trashIds.has(it.item_id)) return false;
    if (ACTIVE_ARMORY_SLOT === "WEAPONS" && cat !== "WEAPON") return false;
    if (ACTIVE_ARMORY_SLOT === "GEAR_MOD" && cat !== "GEAR_MOD") return false;
    if (ACTIVE_ARMORY_SLOT === "SKILL_MOD" && cat !== "SKILL_MOD") return false;
    if (!["ALL", "FAV", "TRASH", "WEAPONS", "GEAR_MOD", "SKILL_MOD"].includes(ACTIVE_ARMORY_SLOT) && it.slot !== ACTIVE_ARMORY_SLOT) return false;

    if (ACTIVE_ARMORY_ARCHETYPE !== "ALL" && tags.role_archetype !== ACTIVE_ARMORY_ARCHETYPE) return false;
    if (coreFilter !== "ALL" && tags.core_category !== coreFilter) return false;

    if (stateFilter === "VIRGIN" && tags.recal_state !== "VIRGIN") return false;
    if (stateFilter === "RECALIBRATED" && !String(tags.recal_state || "").startsWith("RECAL_")) return false;
    if (stateFilter === "PROTOTYPE" && !it.is_prototype && tags.recal_state !== "PROTOTYPE") return false;
    if (stateFilter === "PIP_DEDUCED" && (it.roll_source !== "PIP_DEDUCED" || it.user_verified)) return false;
    if (stateFilter === "OCR_DIRECT" && it.roll_source === "PIP_DEDUCED" && !it.user_verified) return false;
    if (stateFilter === "IN_LOADOUT" && !(igLoadouts.length > 0 || (usageMap[it.item_id] && usageMap[it.item_id].length > 0))) return false;

    if (query) {
      const blob = `${it.item_name} ${it.brand_or_set} ${it.slot} ${(it.talent || {}).name || ""} ${tags.role_archetype || ""} ${igLoadouts.join(" ")}`.toLowerCase();
      if (!blob.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">Armory clean &amp; ready! Hover &amp; mark ★ Favorite in-game (or press F9) to populate your real gear, or switch to the 🎮 Demo profile to preview the 50-item showcase.</div>`;
    return;
  }

  if (groupBy === "NONE") {
    grid.innerHTML = filtered.map(it => _renderSingleArmoryCard(it, usageMap, trashIds)).join("");
    return;
  }

  const groups = {};
  for (const it of filtered) {
    const tags = it.archetype_tags || {};
    let gKey = "Other";
    if (groupBy === "ARCHETYPE") {
      gKey = (ARCHETYPE_BADGE_MAP[tags.role_archetype] || {}).label || tags.role_archetype || "Other";
    } else if (groupBy === "BRAND") {
      gKey = tags.parent_brand || resolveParentBrand(it.brand_or_set || it.item_name);
    } else if (groupBy === "SLOT") {
      gKey = it.slot || "MASK";
    }
    if (!groups[gKey]) groups[gKey] = [];
    groups[gKey].push(it);
  }

  const sectionsHtml = Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([gTitle, gItems]) => {
      const cards = gItems.map(it => _renderSingleArmoryCard(it, usageMap, trashIds)).join("");
      return `
        <div class="armory-group-header">
          <span>📂 ${gTitle}</span>
          <span class="badge badge-accent">${gItems.length} Items</span>
        </div>
        ${cards}
      `;
    })
    .join("");

  grid.innerHTML = sectionsHtml;
}

async function toggleItemFavorite(itemId) {
  const newState = await SHDStorageAdapter.toggleFavorite(itemId);
  applyState(newState);
}

async function deleteArmoryItem(itemId) {
  const newState = await SHDStorageAdapter.deleteItem(itemId);
  applyState(newState);
}

async function clearStashConfirm() {
  if (!confirm("Clear all items in the current profile's Armory?")) return;
  const newState = await SHDStorageAdapter.clearAll();
  applyState(newState);
}

// ============================================================================
// CLICK-TO-VERIFY & INLINE ITEM EDITOR MODAL
// ============================================================================

function handleEditCoreTypeChange(newCoreType) {
  const valEl = document.getElementById("edit-core-val");
  if (!valEl) return;
  if (newCoreType === "ARMOR") valEl.value = 170000;
  else if (newCoreType === "SKILL_TIER") valEl.value = 1;
  else valEl.value = 15.0;
}

function openVerifyModal(itemId) {
  const it = (APP_STATE.inventory || []).find(x => x.item_id === itemId);
  if (!it) return;

  const modal = document.getElementById("verify-modal");
  if (modal) modal.classList.remove("hidden");

  document.getElementById("edit-item-id").value = it.item_id;
  document.getElementById("edit-slot").value = it.slot || "MASK";
  document.getElementById("edit-rarity").value = it.rarity || "HIGH_END";
  document.getElementById("edit-brand").value = it.brand_or_set || "";
  document.getElementById("edit-name").value = it.item_name || "";

  const c = it.core_attribute || {};
  document.getElementById("edit-core-type").value = c.type || "WEAPON_DAMAGE";
  document.getElementById("edit-core-val").value = c.value ?? 15.0;

  const minorTypes = Object.keys(STAT_LABELS).filter(k => !["WEAPON_DAMAGE", "ARMOR", "SKILL_TIER", "TRIPLE_CORE", "MOD_ATTRIBUTE", "SKILL_MOD_BONUS"].includes(k));
  const optsHtml = `<option value="">-- None --</option>` + minorTypes.map(k => `<option value="${k}">${STAT_LABELS[k]}</option>`).join("");

  const m1Sel = document.getElementById("edit-m1-type");
  const m2Sel = document.getElementById("edit-m2-type");
  m1Sel.innerHTML = optsHtml;
  m2Sel.innerHTML = optsHtml;

  const m1 = (it.minor_attributes || [])[0] || {};
  const m2 = (it.minor_attributes || [])[1] || {};
  m1Sel.value = m1.type || "";
  document.getElementById("edit-m1-val").value = m1.value ?? "";
  m2Sel.value = m2.type || "";
  document.getElementById("edit-m2-val").value = m2.value ?? "";

  document.getElementById("edit-talent").value = (it.talent || {}).name || "";

  let recalLock = "NONE";
  if (c.recal || c.is_recalibrated) recalLock = "CORE";
  else if (m1.recal || m1.is_recalibrated) recalLock = "MINOR_0";
  else if (m2.recal || m2.is_recalibrated) recalLock = "MINOR_1";
  else if ((it.talent || {}).recal || (it.talent || {}).is_recalibrated) recalLock = "TALENT";

  const recalEl = document.getElementById("edit-recal-lock");
  if (recalEl) recalEl.value = recalLock;

  const protoCheck = document.getElementById("edit-is-prototype");
  if (protoCheck) protoCheck.checked = Boolean(it.is_prototype);

  const cropContainer = document.getElementById("verify-crop-container");
  if (cropContainer) {
    if (it.crop_image_path) {
      cropContainer.innerHTML = `<img src="${it.crop_image_path}" style="max-width:100%; max-height:160px; border-radius:4px;" />`;
    } else if (it.raw_ocr_text) {
      cropContainer.innerHTML = `
        <div style="font-size:11px; color:var(--good); font-weight:700; margin-bottom:4px;">⚡ OCR_DIRECT (Pure In-Memory — 0 Disk Screenshots)</div>
        <pre style="margin:0; padding:6px 8px; max-height:130px; overflow:auto; background:#070a10; border:1px solid var(--border); border-radius:4px; font-size:10.5px; color:var(--text-muted); white-space:pre-wrap; text-align:left;">${_escInspector(it.raw_ocr_text)}</pre>
      `;
    } else {
      cropContainer.innerHTML = `<div class="muted-sub">Synthetic / Manual Item (No OCR Screenshot Crop)</div>`;
    }
  }
}

function closeVerifyModal() {
  document.getElementById("verify-modal")?.classList.add("hidden");
}

async function saveInlineEditedItem() {
  const itemId = document.getElementById("edit-item-id").value;
  const orig = (APP_STATE.inventory || []).find(x => x.item_id === itemId) || {};

  const recalLock = document.getElementById("edit-recal-lock")?.value || "NONE";
  const isPrototype = Boolean(document.getElementById("edit-is-prototype")?.checked);

  const minors = [];
  const m1t = document.getElementById("edit-m1-type").value;
  const m1v = document.getElementById("edit-m1-val").value;
  if (m1t) minors.push({ type: m1t, value: Number(m1v || 0), recal: recalLock === "MINOR_0" });

  const m2t = document.getElementById("edit-m2-type").value;
  const m2v = document.getElementById("edit-m2-val").value;
  if (m2t) minors.push({ type: m2t, value: Number(m2v || 0), recal: recalLock === "MINOR_1" });

  const tName = document.getElementById("edit-talent").value.trim();
  const newSlot = document.getElementById("edit-slot").value;
  const payload = {
    slot: newSlot,
    item_category: inferItemCategory({ slot: newSlot }),
    weapon_class: orig.weapon_class || null,
    rarity: document.getElementById("edit-rarity").value,
    brand_or_set: document.getElementById("edit-brand").value.trim(),
    item_name: document.getElementById("edit-name").value.trim(),
    core_attribute: {
      type: document.getElementById("edit-core-type").value,
      value: Number(document.getElementById("edit-core-val").value || 15.0),
      recal: recalLock === "CORE",
    },
    minor_attributes: minors,
    talent: tName
      ? {
          name: tName,
          is_perfect: tName.toLowerCase().includes("perfect"),
          recal: recalLock === "TALENT",
        }
      : null,
    crop_image_path: orig.crop_image_path || null,
    is_prototype: isPrototype,
    augment: orig.augment || null,
    expertise_level: orig.expertise_level || 0,
    in_game_loadouts: orig.in_game_loadouts || [],
    raw_ocr_text: orig.raw_ocr_text || "",
    roll_source: "OCR_DIRECT",
    is_favorite: Boolean(orig.is_favorite),
  };

  const newState = await SHDStorageAdapter.updateItem(itemId, payload);
  closeVerifyModal();
  applyState(newState);
  setIngestStatus(`✅ Verified & Updated '${payload.item_name || payload.brand_or_set}'`);
}

// ============================================================================
// VIEW 4: EXPERTISE 413/500 MASTERY TRACKER
// ============================================================================

function renderExpertiseView() {
  const exp = APP_STATE.expertise || {};
  const cats = exp.categories || [];
  const items = exp.items || [];

  const kpiStrip = document.getElementById("expertise-kpi-strip");
  if (kpiStrip) {
    const pct = (((exp.total_proficient || 0) / Math.max(1, exp.total_items || 500)) * 100).toFixed(1);
    kpiStrip.innerHTML = `
      <div class="kpi-box">
        <div class="kpi-label">Agent Expertise Level</div>
        <div class="kpi-val accent">Level ${exp.expertise_level || 27} / 30</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">Proficient Categories</div>
        <div class="kpi-val good">${exp.total_proficient || 0} / ${exp.total_items || 500} (${pct}%)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">Remaining Non-Proficient Items</div>
        <div class="kpi-val" style="color:var(--warn);">${exp.missing_count || 0} Items</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">Est. Printer Filament to Max</div>
        <div class="kpi-val">${(exp.estimated_filament_to_max || 0).toLocaleString()} Filament</div>
      </div>
    `;
  }

  const catListEl = document.getElementById("exp-categories-list");
  if (catListEl) {
    catListEl.innerHTML = cats
      .map(
        c => `
      <div class="exp-cat-row">
        <div>
          <div style="font-weight:700; font-size:0.8rem;">${c.name}</div>
          <div class="muted-sub">${c.group}</div>
        </div>
        <div class="progress-bar-bg" style="height:8px;">
          <div class="progress-bar-fill" style="width:${c.pct || 0}%; background:${c.proficient >= c.total ? "var(--success)" : "var(--shd-orange)"};"></div>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <input
            type="number"
            min="0"
            max="${c.total}"
            value="${c.proficient}"
            class="shd-input compact"
            style="width:58px; text-align:center;"
            onchange="updateExpertiseCategory('${c.category_id}', this.value)"
          />
          <span class="muted-sub">/ ${c.total}</span>
        </div>
      </div>
    `
      )
      .join("");
  }

  const statusFilter = document.getElementById("exp-status-filter")?.value || "MISSING";
  const searchQ = (document.getElementById("exp-item-search")?.value || "").toLowerCase().trim();

  const filteredItems = items.filter(it => {
    if (statusFilter === "MISSING" && it.is_proficient) return false;
    if (statusFilter === "PROFICIENT" && !it.is_proficient) return false;
    if (searchQ && !`${it.name} ${it.category} ${it.acquisition_source}`.toLowerCase().includes(searchQ)) return false;
    return true;
  });

  const itemsGridEl = document.getElementById("exp-items-list");
  if (itemsGridEl) {
    itemsGridEl.innerHTML = filteredItems
      .map(
        it => `
      <div class="exp-item-card ${it.is_proficient ? "proficient" : "missing"}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-weight:700; font-size:0.84rem;">${it.name}</div>
            <div class="muted-sub">${it.category} • 📍 ${it.acquisition_source}</div>
          </div>
          <span class="badge ${it.is_proficient ? "badge-accent" : "badge-warn"}">
            ${it.is_proficient ? "✅ PROFICIENT" : `Rank ${it.rank}/10`}
          </span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; font-size:0.75rem;">
          <span class="muted-sub">Needs: <b>${it.filament_needed || 0} Filament</b> (or ${(10 - (it.rank || 0)) * 2} junk donations)</span>
          <div style="display:flex; gap:4px; align-items:center;">
            <label class="muted-sub">Rank:</label>
            <input
              type="number"
              min="0"
              max="10"
              value="${it.rank || 0}"
              class="shd-input compact"
              style="width:52px;"
              onchange="updateExpertiseItem('${it.item_key}', this.value, ${it.upgrade_grade || 0})"
            />
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
}

async function updateExpertiseCategory(categoryId, val) {
  const newState = await SHDStorageAdapter.updateExpertiseCat(categoryId, Number(val));
  applyState(newState);
}

async function updateExpertiseItem(itemKey, rankVal, upgradeGrade) {
  const newState = await SHDStorageAdapter.updateExpertiseItem(itemKey, {
    rank: Number(rankVal),
    upgrade_grade: Number(upgradeGrade || 0),
  });
  applyState(newState);
}

async function setAllExpertise(proficient) {
  const newState = await SHDStorageAdapter.setExpertiseAllMax(proficient);
  applyState(newState);
}

// ============================================================================
// INGESTION ACTIONS (SCREENSHOTS, VIDEO, SHORTHAND, DEMO STASH, BACKUP)
// ============================================================================

async function loadGoldenStash() {
  setIngestStatus("⚡ Loading Benchmark Demo Stash...");
  const newState = await SHDStorageAdapter.resetGolden();
  applyState(newState);
}

async function submitShorthand() {
  const inp = document.getElementById("shorthand-input");
  const slotSel = document.getElementById("shorthand-slot-select");
  const text = (inp?.value || "").trim();
  if (!text) return;

  setIngestStatus(`🔍 Snapping shorthand: "${text}"...`);
  const res = await SHDStorageAdapter.quickAdd(text, slotSel?.value || null);
  if (inp) inp.value = "";
  if (res && res.state) {
    applyState(res.state);
  } else {
    applyState(res);
  }
}

async function handleImageUpload(files) {
  if (!files || files.length === 0) return;
  if (SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    alert("Screenshot WinRT Vision OCR requires the PC FastAPI server. On mobile/portable mode, use Quick Shorthand or Sync from PC!");
    return;
  }
  setIngestStatus(`📸 Running WinRT Vision OCR on ${files.length} screenshot(s)...`);
  const fd = new FormData();
  for (const f of files) fd.append("files", f);

  try {
    const r = await fetch("/api/ingest/images", { method: "POST", body: fd });
    const data = await r.json();
    if (data.state) applyState(data.state);
    setIngestStatus(`✅ Extracted ${(data.extracted || []).length} gear items from screenshots!`);
  } catch (e) {
    console.error(e);
    setIngestStatus("❌ Screenshot OCR error.");
  }
}

async function handleVideoUpload(file) {
  if (!file) return;
  if (SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    alert("Video Keyframe OCR requires the PC FastAPI server.");
    return;
  }
  setIngestStatus(`🎥 Extracting settled keyframes & running batched WinRT OCR on ${file.name}...`);
  const fd = new FormData();
  fd.append("file", file);

  try {
    const r = await fetch("/api/ingest/video", { method: "POST", body: fd });
    const data = await r.json();
    if (data.state) applyState(data.state);
    setIngestStatus(`✅ Video processed: ${data.keyframes_analyzed || 0} keyframes -> ${(data.extracted || []).length} unique items!`);
  } catch (e) {
    console.error(e);
    setIngestStatus("❌ Video OCR error.");
  }
}

function openBackupModal() {
  document.getElementById("backup-modal")?.classList.remove("hidden");
}

function closeBackupModal() {
  document.getElementById("backup-modal")?.classList.add("hidden");
}

function downloadJsonBackup() {
  const payload = {
    exported_at: new Date().toISOString(),
    profile: SHDStorageAdapter.getActiveProfile(),
    items: APP_STATE.inventory || [],
    saved_loadouts: APP_STATE.saved_loadouts || [],
    expertise: APP_STATE.expertise || {},
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `shd_armory_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

async function handleBackupFileImport(file) {
  if (!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    const newState = await SHDStorageAdapter.importSnapshotPayload(data);
    applyState(newState);
    document.getElementById("backup-status-msg").textContent = `✅ Restored ${(data.items || []).length} items & ${(data.saved_loadouts || []).length} loadouts from backup!`;
  } catch (e) {
    document.getElementById("backup-status-msg").textContent = "❌ Invalid backup JSON file.";
  }
}

async function triggerPcToHubSync() {
  const msgEl = document.getElementById("backup-status-msg");
  if (msgEl) msgEl.textContent = "🔄 Syncing PC SQLite state into Android Hub cartridge...";
  const res = await SHDStorageAdapter.triggerPcToHubSync();
  if (msgEl) msgEl.textContent = res.status === "ok" ? "✅ Synced to Android Launcher Hub (`shd-div2-intel`)!" : `⚠️ ${res.message || "Local mode"}`;
}

async function syncFromEmbeddedPcSeed() {
  const newState = await SHDStorageAdapter.syncFromEmbeddedPcSeed();
  applyState(newState);
  const msgEl = document.getElementById("backup-status-msg");
  if (msgEl) msgEl.textContent = "✅ Phone profile reset to latest embedded PC seed!";
}

function openMetaStudioDialog(defaultTab = "proposals") {
  const dlg = document.getElementById("meta-studio-dialog");
  if (!dlg) return;
  ACTIVE_META_STUDIO_TAB = defaultTab || "proposals";
  switchMetaStudioTab(ACTIVE_META_STUDIO_TAB);
  renderMetaStudioContent();
  if (!dlg.open) dlg.showModal();
}

function closeMetaStudioDialog() {
  const dlg = document.getElementById("meta-studio-dialog");
  if (dlg && dlg.open) dlg.close();
}

function switchMetaStudioTab(tabKey) {
  ACTIVE_META_STUDIO_TAB = tabKey;
  document.querySelectorAll("#ms-studio-tabs .dossier-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-ms-tab") === tabKey);
  });
  ["proposals", "leaderboard", "ingest", "automation"].forEach(k => {
    const pane = document.getElementById(`ms-pane-${k}`);
    if (pane) {
      pane.classList.toggle("hidden", k !== tabKey);
      pane.classList.toggle("active", k === tabKey);
    }
  });
}

function openBuildFromLeaderboard(buildId) {
  closeMetaStudioDialog();
  loadBuildIntoWorkbench(buildId);
}

function wireMetaLeaderboardSorting() {
  if (_MS_LEADERBOARD_SORT_WIRED) return;
  const table = document.getElementById("ms-leaderboard-table");
  const status = document.getElementById("ms-leaderboard-sort-status");
  if (!table || !table.tHead) return;

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  table.tHead.addEventListener("click", event => {
    const btn = event.target.closest("button");
    const th = btn && btn.closest("th");
    if (!th || !table.tHead.contains(th) || !th.dataset.type) return;

    const tbody = table.tBodies[0];
    if (!tbody) return;

    const col = th.cellIndex;
    const type = th.dataset.type;
    const nextDir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
    const dir = nextDir === "ascending" ? 1 : -1;

    for (const h of table.tHead.rows[0].cells) {
      if (h !== th) h.removeAttribute("aria-sort");
    }
    th.setAttribute("aria-sort", nextDir);

    const rows = [...tbody.rows];
    rows.sort((a, b) => {
      const av = a.cells[col];
      const bv = b.cells[col];
      if (!av || !bv) return 0;
      if (type === "number") {
        return dir * (Number(av.dataset.value || 0) - Number(bv.dataset.value || 0));
      }
      return dir * collator.compare(av.textContent.trim(), bv.textContent.trim());
    });

    for (const row of rows) {
      if (typeof tbody.moveBefore === "function") {
        tbody.moveBefore(row, null);
      } else {
        tbody.appendChild(row);
      }
    }

    if (status) {
      const colLabel = btn.textContent.replace(/[↕▲▼]/g, "").trim();
      status.textContent = `Sorted by ${colLabel}, ${nextDir}`;
    }
  });

  _MS_LEADERBOARD_SORT_WIRED = true;
}

function renderMetaLeaderboardTable() {
  wireMetaLeaderboardSorting();
  const tbody = document.getElementById("ms-leaderboard-tbody");
  if (!tbody) return;

  const activeBuilds = (APP_STATE.evaluated_builds || []).filter(b => (b.status || "ACTIVE") === "ACTIVE");
  const sig = activeBuilds
    .map(b => `${b.build_id}:${(b.ballistics || {}).sustained_dps || 0}:${(b.ballistics || {}).burst_dps || 0}`)
    .join("|");
  if (sig === _LAST_LEADERBOARD_SIG && tbody.rows.length === activeBuilds.length) {
    return;
  }
  _LAST_LEADERBOARD_SIG = sig;

  const sortedInitial = [...activeBuilds].sort(
    (a, b) => ((b.ballistics || {}).sustained_dps || 0) - ((a.ballistics || {}).sustained_dps || 0)
  );

  tbody.innerHTML = sortedInitial
    .map(b => {
      const bal = b.ballistics || {};
      const sust = Number(bal.sustained_dps || 0);
      const burst = Number(bal.burst_dps || 0);
      const ttk = Number(bal.ttk_heroic_named_sec || 0);
      const armor = Number(bal.total_armor || 0);
      const pWeap = ((b.primary_weapons || [])[0] || bal.weapon_name || "Weapon").split("(")[0].trim();
      return `
        <tr>
          <th scope="row">
            <div>${b.name}</div>
            <div style="font-size:10px; font-weight:600; color:var(--text-muted);">${pWeap} • ${b.tier_badge || "META"}</div>
          </th>
          <td><span class="badge">${b.role || "DPS"}</span></td>
          <td data-value="${sust}" style="font-weight:800; color:var(--success);">${(sust / 1e6).toFixed(2)}M/s</td>
          <td data-value="${burst}">${(burst / 1e6).toFixed(2)}M/s</td>
          <td data-value="${ttk}" style="color:var(--shd-orange); font-weight:700;">${ttk.toFixed(2)}s</td>
          <td data-value="${armor}">${(armor / 1e6).toFixed(2)}M</td>
          <td>
            <button type="button" class="btn btn-outline btn-xs" onclick="openBuildFromLeaderboard('${b.build_id}')">🛠️ Workbench</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderMetaStudioContent() {
  const mf = APP_STATE.meta_freshness || {};
  const bannerEl = document.getElementById("ms-freshness-banner");
  const pending = mf.pending_proposals || [];
  if (bannerEl) {
    const relStr = formatRelativeDaysAgo(mf.days_since_verified);
    bannerEl.innerHTML = `
      <div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="mf-dot ${mf.is_stale ? "stale" : "fresh"}"></span>
          <b style="color:#ffffff; font-size:13px;">${mf.meta_version || "TU24 / Year 8 Meta"}</b>
          <span class="badge">${mf.active_count || 0} Active</span>
          <span class="badge">${mf.legacy_count || 0} Legacy</span>
          <span class="muted-sub">${mf.patch_label || ""} • ${relStr}</span>
        </div>
      </div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${pending.length > 0 ? `<button type="button" class="btn btn-primary btn-xs" onclick="approveStagedMetaProposal('ALL')">✅ Approve All (${pending.length})</button>` : ""}
        <button type="button" class="btn btn-outline btn-xs" onclick="markMetaVerifiedToday()">🟢 Mark Verified Today</button>
      </div>
    `;
  }

  const propEl = document.getElementById("ms-proposals-list");
  if (!propEl) return;

  const pendingHtml = pending.length === 0
    ? `<div class="tel-section" style="border-left:3px solid var(--success);">
         <h4>✅ Zero Pending Meta Proposals</h4>
         <div class="muted-sub">All ${mf.active_count || 0} active Meta Builds are synced across Desktop SQLite, Workbench Presets, and the Android Hub seed. Use <b>⚡ Quick Build / Patch Ingest</b> to stage a new build or ask Antigravity to run <code>refresh-meta</code>.</div>
       </div>`
    : pending
        .map(p => {
          const val = p.validation || {};
          const bench = val.benchmark || {};
          const prev = p.previous_benchmark || null;
          const pass = Boolean(p.gates_passed);
          const burstM = ((bench.burst_dps || 0) / 1e6).toFixed(2);
          const sustM = ((bench.sustained_dps || 0) / 1e6).toFixed(2);
          let deltaStr = "";
          if (prev && prev.sustained_dps) {
            const diffM = ((bench.sustained_dps - prev.sustained_dps) / 1e6).toFixed(2);
            deltaStr = ` (${Number(diffM) >= 0 ? "+" : ""}${diffM}M vs current)`;
          }
          const slotLines = (p.slot_diff_summary || []).map(line => `<li>${line}</li>`).join("");
          const errLines = (val.errors || []).map(e => `<div style="color:var(--danger); font-size:11px;">❌ ${e}</div>`).join("");
          const warnLines = (val.warnings || []).map(w => `<div style="color:var(--warn); font-size:11px;">⚠️ ${w}</div>`).join("");
          return `
            <div class="ms-proposal-card ${pass ? "gate-pass" : "gate-fail"}">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">
                <div>
                  <span class="badge ${pass ? "badge-accent" : "badge-warn"}">${p.action || "ADD"}</span>
                  <span class="badge">${pass ? "✔ TWO-GATE VERIFIED" : "⚠️ LEGALITY BLOCK"}</span>
                  <b style="color:#ffffff; font-size:13px; margin-left:4px;">${p.title || p.build_id}</b>
                  <div class="muted-sub" style="margin-top:3px;">Source: ${p.source_citation || "Manual"} • ${p.reason || ""}</div>
                </div>
                <div style="display:flex; gap:6px;">
                  <button type="button" class="btn btn-primary btn-xs" ${pass ? "" : "disabled"} onclick="approveStagedMetaProposal('${p.proposal_id}')">✅ Approve &amp; Sync</button>
                  <button type="button" class="btn btn-danger btn-xs" onclick="rejectStagedMetaProposal('${p.proposal_id}')">✕ Reject</button>
                </div>
              </div>
              ${bench.burst_dps ? `<div style="margin-top:6px; font-size:11.5px; color:var(--text-main);">📊 <b>Solver Benchmark:</b> Burst <b>${burstM}M</b> • Sustained <b>${sustM}M</b>${deltaStr} • CHC/CHD <b>${bench.chc_pct || 0}%/${bench.chd_pct || 0}%</b> • Heroic Named TTK <b>${bench.ttk_heroic_named_sec || 0}s</b></div>` : ""}
              ${slotLines ? `<ul style="margin:6px 0 0 18px; padding:0; font-size:11px; color:var(--text-muted);">${slotLines}</ul>` : ""}
              ${errLines}${warnLines}
            </div>
          `;
        })
        .join("");

  const changelog = (mf.changelog || [])
    .slice(0, 6)
    .map(
      c => `<div class="tel-row"><span><b>${c.version || "Meta"}</b> — ${c.summary || ""}</span><span class="muted-sub">${c.date || ""}</span></div>`
    )
    .join("");
  const sources = (mf.sources || []).map(s => `<span class="badge" style="margin-right:4px; margin-bottom:4px;">📚 ${s}</span>`).join("");

  propEl.innerHTML = `
    ${pendingHtml}
    <div class="tel-section">
      <h4>📜 Recent Meta Verification Changelog</h4>
      ${changelog || `<div class="muted-sub">No changelog entries recorded yet.</div>`}
      ${sources ? `<div style="margin-top:8px;">${sources}</div>` : ""}
    </div>
  `;

  renderMetaLeaderboardTable();
}

async function submitQuickMetaText(autoApply = false) {
  const rawText = (document.getElementById("ms-ingest-text")?.value || "").trim();
  const fbEl = document.getElementById("ms-ingest-feedback");
  if (!rawText) {
    if (fbEl) fbEl.textContent = "⚠️ Paste 6-slot notes, shorthand lines, or build JSON first.";
    return;
  }
  const payload = {
    raw_text: rawText,
    name: (document.getElementById("ms-ingest-name")?.value || "").trim() || null,
    role: document.getElementById("ms-ingest-role")?.value || "RED_DPS",
    primary_weapon: (document.getElementById("ms-ingest-weapon")?.value || "").trim() || "St. Elmo's Engine",
    specialization: document.getElementById("ms-ingest-spec")?.value || "Gunner",
    tier_badge: (document.getElementById("ms-ingest-badge")?.value || "").trim() || "CUSTOM META",
    source_citation: (document.getElementById("ms-ingest-source")?.value || "").trim() || "Dashboard Meta Studio",
    auto_apply: Boolean(autoApply),
  };
  try {
    if (fbEl) fbEl.textContent = "🔍 Running Two-Gate 6-Slot Legality & 7-Bucket Ballistics Benchmark...";
    const res = await SHDStorageAdapter.parseMetaBuildText(payload);
    if (res && res.state) applyState(res.state);
    const txtEl = document.getElementById("ms-ingest-text");
    if (txtEl) txtEl.value = "";
    if (autoApply) {
      if (fbEl) fbEl.textContent = "✅ Approved, added to Meta Matrix & Workbench Presets, and synced to Android Hub!";
      switchMetaStudioTab("proposals");
    } else {
      if (fbEl) fbEl.textContent = "✅ Candidate staged! Review 7-bucket DPS benchmark in Staged Proposals.";
      switchMetaStudioTab("proposals");
    }
    renderMetaStudioContent();
  } catch (err) {
    if (fbEl) fbEl.textContent = `❌ ${err.message || "Failed parsing build notes."}`;
  }
}

async function approveStagedMetaProposal(proposalId) {
  try {
    const res = await SHDStorageAdapter.approveMetaProposal(proposalId);
    if (res && res.state) applyState(res.state);
    renderMetaStudioContent();
    setIngestStatus("✅ Meta update approved & synced to Workbench Showcase + Android Hub!");
  } catch (err) {
    alert(err.message || "Failed approving proposal");
  }
}

async function rejectStagedMetaProposal(proposalId) {
  try {
    const res = await SHDStorageAdapter.rejectMetaProposal(proposalId);
    if (res && res.state) applyState(res.state);
    renderMetaStudioContent();
  } catch (err) {
    alert(err.message || "Failed rejecting proposal");
  }
}

async function markMetaVerifiedToday() {
  const res = await SHDStorageAdapter.markMetaVerifiedNow({
    summary_note: "Verified active Meta Builds against current live Title Update balance",
  });
  if (res && res.state) applyState(res.state);
  renderMetaStudioContent();
  setIngestStatus("🟢 Meta Build Matrix marked verified today & synced to Hub!");
}

async function toggleMetaBuildLifecycle(buildId, targetStatus) {
  const res = await SHDStorageAdapter.setMetaBuildLifecycle(buildId, targetStatus);
  if (res && res.state) applyState(res.state);
  setIngestStatus(
    targetStatus === "LEGACY"
      ? "📦 Build moved to non-destructive Legacy Archive (owned ≥4/6 pieces remain protected)."
      : "♻️ Build restored to Active Endgame Meta!"
  );
}
