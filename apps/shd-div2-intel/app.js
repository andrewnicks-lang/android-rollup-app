/**
 * SHD TACTICAL COMMAND v5.0 — Unified Frontend Controller
 * Implements:
 *   Tab 1: Build Matrix, Interactive Tactical Knowledge Dossier, 1-Click Assembly & Countdown Farm Radar
 *   Tab 2: Interactive 6-Slot Loadout Workbench, Auto-Assemble From Armory, 60% CHC Mod Auto-Balancer & 5-Target TTK Matrix
 *   Tab 3: Armory & Stash Explorer with Multi-Dimensional Role Archetype / Core / Provenance Categorization & Group-By
 *   Tab 4: Expertise 413/500 Mastery Tracker & Printer Filament Calculator
 */

let APP_STATE = {
  inventory: [],
  evaluated_builds: [],
  item_usage: {},
  deconstruct_candidates: [],
  saved_loadouts: [],
  admin_showcase_loadouts: [],
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

const ALL_SLOTS = ["MASK", "BACKPACK", "CHEST", "GLOVES", "HOLSTER", "KNEEPADS"];

const STAT_LABELS = {
  WEAPON_DAMAGE: "Weapon DMG",
  ARMOR: "Armor",
  SKILL_TIER: "Skill Tier",
  TRIPLE_CORE: "Triple Core (+15% WD / +170k Armor / +1 Tier)",
  CRITICAL_HIT_CHANCE: "Crit Hit Chance",
  CRITICAL_HIT_DAMAGE: "Crit Hit Damage",
  HEADSHOT_DAMAGE: "Headshot DMG",
  WEAPON_HANDLING: "Weapon Handling",
  SKILL_DAMAGE: "Skill Damage",
  SKILL_HASTE: "Skill Haste",
  SKILL_REPAIR: "Repair Skills",
  STATUS_EFFECTS: "Status Effects",
  ARMOR_REGEN: "Armor Regen",
  HAZARD_PROTECTION: "Hazard Protection",
  EXPLOSIVE_RESISTANCE: "Explosive Resist",
  INCOMING_REPAIRS: "Incoming Repairs",
  HEALTH: "Health",
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

function findCanonicalWeaponSpec(weaponName) {
  const pRaw = String(weaponName || "St. Elmo's Engine").trim();
  const pLow = pRaw.toLowerCase();
  const weaponsCol = (APP_STATE.canonical || {}).weapons || [];
  for (const [k, rawW] of iterCanonicalEntries(weaponsCol)) {
    const kLow = k.toLowerCase();
    const aliases = Array.isArray(rawW.aliases) ? rawW.aliases.map(a => String(a).toLowerCase()) : [];
    if (
      pLow === kLow ||
      (kLow.length > 2 && pLow.includes(kLow)) ||
      (pLow.length > 2 && kLow.includes(pLow)) ||
      aliases.some(a => a.length > 2 && pLow.includes(a))
    ) {
      if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.normalizeWeaponEntryJS === "function") {
        return window.SHDStorageAdapter.normalizeWeaponEntryJS(rawW);
      }
      const rawBase = Number(rawW.base_damage || rawW.base_dmg || 52000.0);
      const hsPct = Number(rawW.native_hsd !== undefined ? rawW.native_hsd : 55.0);
      return {
        name: rawW.name || k,
        class: rawW.weapon_class || rawW.class || "AR",
        base_dmg: rawBase < 70000 ? rawBase * 2.25 : rawBase,
        rpm: Number(rawW.rpm || 750),
        mag_size: Number(rawW.mag_size || 40),
        reload_sec: Number(rawW.reload_sec || 2.1),
        headshot_mult: Number(rawW.headshot_mult || (1.0 + hsPct / 100.0)),
        native_dttooc: Number(rawW.native_dttooc !== undefined ? rawW.native_dttooc : 10.0),
        native_dta: Number(rawW.native_dta || 0.0),
        native_chc: Number(rawW.native_chc || 0.0) + Number(rawW.mod_chc || 0.0),
        native_chd: Number(rawW.native_chd || 0.0) + Number(rawW.mod_chd || 0.0),
        talent: rawW.talent || "",
      };
    }
  }
  return {
    name: pRaw,
    class: "LMG",
    base_dmg: 117900,
    rpm: 550,
    mag_size: 100,
    reload_sec: 4.9,
    headshot_mult: 1.65,
    native_dttooc: 10.0,
    native_dta: 0.0,
    native_chc: 5.0,
    native_chd: 0.0,
    talent: "",
  };
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
  ].includes(resolved);
}

function formatStatVal(statType, val) {
  if (val === undefined || val === null) return "";
  const num = Number(val);
  if (statType === "ARMOR" || statType === "ARMOR_REGEN" || statType === "HEALTH") {
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

// ============================================================================
// INITIALIZATION & NAVIGATION
// ============================================================================

window.addEventListener("DOMContentLoaded", async () => {
  const prof = SHDStorageAdapter.getActiveProfile();
  const sel = document.getElementById("profile-selector");
  if (sel && prof && prof.userId) {
    sel.value = prof.userId;
  }
  await refreshPlatformState();
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

  // Ensure every inventory item has archetype_tags populated
  if (window.SHDStorageAdapter && typeof window.SHDStorageAdapter.classifyItemArchetypeJS === "function") {
    for (const it of APP_STATE.inventory || []) {
      if (!it.archetype_tags) {
        it.archetype_tags = window.SHDStorageAdapter.classifyItemArchetypeJS(it, APP_STATE.canonical);
      }
    }
  }

  // Update Header & Mobile Nav Badges (Phase 0 Fix)
  const elBuilds = document.getElementById("nav-count-builds");
  if (elBuilds) elBuilds.textContent = (APP_STATE.evaluated_builds || []).length;

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

  renderBuildMatrixView();
  renderWorkbenchView();
  renderArmoryGrid();
  renderExpertiseView();
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
}

function setIngestStatus(msg) {
  const el = document.getElementById("ingest-status");
  if (el) el.textContent = msg;
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

function renderBuildMatrixView() {
  const builds = APP_STATE.evaluated_builds || [];
  const readyCount = builds.filter(b => b.owned_slots_count >= 5).length;
  const readyBadge = document.getElementById("builds-ready-badge");
  if (readyBadge) readyBadge.textContent = `${readyCount} Ready`;

  const filtered = builds.filter(b => {
    if (ACTIVE_MATRIX_ROLE === "ALL") return true;
    if (ACTIVE_MATRIX_ROLE === "RED_DPS") return b.role === "RED_DPS" || b.role === "ONE_SHOT_MMR";
    if (ACTIVE_MATRIX_ROLE === "TECH_TANK") return ["TECH_TANK", "HYBRID_BRUISER", "CLOSE_QUARTERS"].includes(b.role);
    if (ACTIVE_MATRIX_ROLE === "SKILL") return ["SKILL_DPS", "CROWD_CONTROL"].includes(b.role);
    if (ACTIVE_MATRIX_ROLE === "TANK_HEAL") return ["ARMOR_TANK", "SUPPORT_HEALER"].includes(b.role);
    return true;
  });

  if (!filtered.some(b => b.build_id === ACTIVE_BUILD_ID) && filtered.length > 0) {
    ACTIVE_BUILD_ID = filtered[0].build_id;
  }

  const listEl = document.getElementById("builds-list");
  if (listEl) {
    listEl.innerHTML = filtered
      .map(b => {
        const isAct = b.build_id === ACTIVE_BUILD_ID;
        const pct = b.completion_pct || 0;
        const barColor = pct >= 85 ? "var(--success)" : pct >= 55 ? "var(--shd-orange)" : "var(--warn)";
        return `
        <div class="build-list-card ${isAct ? "active" : ""}" onclick="selectMatrixBuild('${b.build_id}')">
          <div class="blc-top">
            <div>
              <div class="blc-name">${b.name}</div>
              <span class="badge badge-gold" style="margin-top:3px; display:inline-block;">${b.tier_badge || b.role}</span>
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

  renderActiveBuildDetail();
  renderFarmRadarAndDeconstruct();
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
  const modPillHtml = optimalMods && optimalMods.summary
    ? `<span class="mod-balancer-pill" title="Solver-computed 3x Gear Mod split for 60% CHC Cap">🔌 Optimal Mods: ${optimalMods.summary}</span>`
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
        ${altsHtml}
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="build-detail-header">
      <div class="bd-title-row">
        <div>
          <span class="badge badge-accent">${b.tier_badge || b.role}</span>
          <h2 class="bd-title" style="margin-top:4px;">${b.name}</h2>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-gold btn-sm" onclick="assembleAndSaveBuildFromMatrix('${b.build_id}')" title="Assemble this build from your owned Armory items + optimal 3x Gear Mods and save directly to your Locker">
            ⚡ Assemble &amp; Save to Locker
          </button>
          <button class="btn btn-primary btn-sm" onclick="loadBuildIntoWorkbench('${b.build_id}')">
            🛠️ Open in Loadout Workbench
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
    for (const [slot, s] of Object.entries(b.slot_breakdown || {})) {
      if (s.status === "MISSING") {
        const bName = s.raw_brand || s.brand || "Unknown";
        if (!brandCounts[bName]) brandCounts[bName] = { brand: bName, slots: new Set(), builds: new Set() };
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
        .map(
          r => `
        <div class="radar-item">
          <div class="ri-title">🎯 ${r.brand} <span class="badge badge-accent" style="float:right;">${r.builds.size} Builds</span></div>
          <div class="ri-sub">Missing Slots: <b>${Array.from(r.slots).join(", ")}</b></div>
          <div class="ri-sub">Unlocks: ${Array.from(r.builds).slice(0, 2).join(", ")}</div>
        </div>
      `
        )
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
          <div class="ri-title">${d.display_name} (${d.slot})</div>
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

  // Deduplicate Admin Showcase against Saved Loadouts by ID or Name
  const showcaseEl = document.getElementById("showcase-loadouts-list");
  if (showcaseEl) {
    const savedIds = new Set(savedList.map(s => s.loadout_id));
    const savedNames = new Set(savedList.map(s => String(s.name || "").trim().toLowerCase()));
    const filteredShowcase = showcaseList.filter(
      l => !savedIds.has(l.loadout_id) && !savedNames.has(String(l.name || "").trim().toLowerCase())
    );
    if (filteredShowcase.length === 0) {
      showcaseEl.innerHTML = `<div class="muted-sub" style="padding:10px;">All Admin Showcase templates are loaded in your Saved Locker above.</div>`;
    } else {
      showcaseEl.innerHTML = filteredShowcase
        .map(l => {
          const pW = (l.weapons || {}).primary || l.primary_weapon || "Pestilence";
          return `
          <div class="loadout-card" onclick="selectSavedLoadout('${l.loadout_id}', true)">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="lc-name">👑 ${l.name}</div>
              <button class="btn btn-gold btn-xs" onclick="event.stopPropagation(); cloneShowcaseLoadout('${l.loadout_id}')">Clone</button>
            </div>
            <div class="lc-meta">${l.specialization || "Gunner"} • ${pW}</div>
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
    const rawName = sb.display_name ? sb.display_name.replace(/\s*\(.*?\)\s*$/, "") : sb.raw_brand || sb.brand || s;
    const parentBrand = resolveParentBrand(sb.brand || sb.raw_brand || rawName);
    const isGs = isGearSetBrand(parentBrand);
    const maxMinors = isGs ? 1 : 2;
    const defaultCoreVal = sb.core_type === "ARMOR" ? 170000 : sb.core_type === "SKILL_TIER" ? 1 : 15.0;

    slotsObj[s] = {
      item_id: sb.item_id || null,
      brand: parentBrand,
      item_name: rawName,
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
    for (const opt of weapSel.options) {
      if (pWeap.toLowerCase().includes(opt.value.toLowerCase().split(" ")[0])) {
        weapSel.value = opt.value;
        break;
      }
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

  // Check if this loadout corresponds to one of the evaluated builds
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

    // Otherwise find best owned item in Armory matching current slot's brand
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

function autoBalanceWorkbenchChcMods() {
  if (!ACTIVE_WORKBENCH_LOADOUT) return;
  const l = ACTIVE_WORKBENCH_LOADOUT;
  const pWeap = document.getElementById("wb-primary-weapon")?.value || "Pestilence";
  const wSpec = findCanonicalWeaponSpec(pWeap);

  let baseChc = 10.0 + Number(wSpec.native_chc || 0);
  const bCounts = {};
  for (const s of Object.values(l.slots || {})) {
    const pBrand = resolveParentBrand(s.brand || s.brand_or_set || s.item_name || "");
    bCounts[pBrand] = (bCounts[pBrand] || 0) + 1;
    const minorsList = Array.isArray(s.minors) && s.minors.length
      ? s.minors
      : Array.isArray(s.minor_attributes) && s.minor_attributes.length
      ? s.minor_attributes
      : [
          ...(s.m1_stat ? [{ type: s.m1_stat, val: s.m1_val }] : []),
          ...(s.m2_stat ? [{ type: s.m2_stat, val: s.m2_val }] : []),
        ];
    for (const m of minorsList) {
      if ((m.type || m.stat) === "CRITICAL_HIT_CHANCE") baseChc += Number(m.val ?? m.value ?? 0);
    }
  }
  if ((bCounts["Česká Výroba s.r.o."] || 0) >= 1) baseChc += 8.0;
  if ((bCounts["Providence Defense"] || 0) >= 2) baseChc += 10.0;
  if ((bCounts["Sokolov Concern"] || 0) >= 3) baseChc += 10.0;
  if ((bCounts["Negotiator's Dilemma"] || 0) >= 2) baseChc += 15.0;
  if ((bCounts["Umbra Initiative"] || 0) >= 2) baseChc += 15.0;
  if ((bCounts["Coyote's Mask"] || 0) >= 1) baseChc += 10.0;

  let chcMods = 0;
  let simChc = baseChc;
  for (let i = 0; i < 3; i++) {
    if (simChc <= 54.5) {
      chcMods += 1;
      simChc += 6.0;
    }
  }
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

  const slotsGrid = document.getElementById("wb-slots-grid");
  const slots = l.slots || {};

  let redCores = 0, blueCores = 0, yellowCores = 0;
  const brandCounts = {};
  let gearChc = 0, gearChd = 0, gearDta = 0, gearDttooc = 0, gearHsd = 0, gearWh = 0, gearRegen = 0;
  let hasNinjaBike = false;
  const equippedNamesLower = new Set();

  const cardsHtml = ALL_SLOTS.map(slot => {
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
    equippedNamesLower.add(rawName);
    const parentBrand = resolveParentBrand(s.brand || s.item_name || "Unknown");

    const isTriple = s.core_type === "TRIPLE_CORE" || rawName.includes("memento") || rawName.includes("ninjabike");
    if (rawName.includes("ninjabike")) hasNinjaBike = true;

    if (isTriple) {
      redCores += 1;
      blueCores += 1;
      yellowCores += 1;
    } else if (s.core_type === "ARMOR") {
      blueCores += 1;
    } else if (s.core_type === "SKILL_TIER") {
      yellowCores += 1;
    } else {
      redCores += 1;
    }

    brandCounts[parentBrand] = (brandCounts[parentBrand] || 0) + 1;

    for (const m of s.minors || []) {
      const mVal = Number(m.val ?? m.value ?? 0);
      if (m.type === "CRITICAL_HIT_CHANCE") gearChc += mVal;
      else if (m.type === "CRITICAL_HIT_DAMAGE") gearChd += mVal;
      else if (m.type === "DAMAGE_TO_ARMOR") gearDta += mVal;
      else if (m.type === "DTTOOC") gearDttooc += mVal;
      else if (m.type === "HEADSHOT_DAMAGE") gearHsd += mVal;
      else if (m.type === "WEAPON_HANDLING") gearWh += mVal;
      else if (m.type === "ARMOR_REGEN") gearRegen += mVal;
    }

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

    return `
      <div class="wb-slot-card" onclick="openSlotPickerModal('${slot}')">
        <div class="wsc-top">
          <span class="wsc-slot">${slot}</span>
          <span class="wsc-edit-hint">⚙️ Change Piece</span>
        </div>
        <div class="wsc-name">${s.item_name || s.brand}</div>
        <div class="wsc-brand">${parentBrand}${s.item_id ? " • <span style='color:var(--success);'>🎒 Owned</span>" : ""}</div>
        <div class="wsc-stats">
          <div style="margin-bottom:3px;"><b>${coreBadge}</b></div>
          ${minorsHtml}
          ${s.talent ? `<div style="color:var(--gold-high); margin-top:3px;">✨ <b>${s.talent}</b></div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  if (slotsGrid) slotsGrid.innerHTML = cardsHtml;
  renderWorkbenchDossier(l);

  const effBrands = { ...brandCounts };
  if (hasNinjaBike) {
    for (const k of Object.keys(effBrands)) {
      if (!k.toLowerCase().includes("ninjabike")) {
        effBrands[k] = Math.min(4, effBrands[k] + 1);
      }
    }
  }

  let modChc = 0, modChd = 0, modHsd = 0, modPfe = 0;
  [mod1, mod2, mod3].forEach(m => {
    if (m === "MOD_CHC") modChc += 6.0;
    else if (m === "MOD_CHD") modChd += 12.0;
    else if (m === "MOD_HSD") modHsd += 10.0;
    else if (m === "MOD_PFE") modPfe += 12.0;
  });

  const wSpec = findCanonicalWeaponSpec(pWeap);
  const wClass = wSpec.class || "AR";
  const effYellowTiers = Math.min(6, yellowCores + (l.specialization.toLowerCase().includes("technician") ? 1 : 0) + ((effBrands["Brazos de Arcabuz"] || 0) >= 2 ? 1 : 0));

  let wdPct = 25.0 + redCores * 15.0 + wExp;
  if ((effBrands["Lengmo"] || 0) >= 3 && wClass === "LMG") wdPct += 30.0;
  if ((effBrands["Petrov Defense Group"] || 0) >= 1 && wClass === "LMG") wdPct += 10.0;
  if ((effBrands["Fenris Group AB"] || 0) >= 1 && wClass === "AR") wdPct += 10.0;
  if ((effBrands["Sokolov Concern"] || 0) >= 1 && wClass === "SMG") wdPct += 10.0;
  if ((effBrands["Badger Tuff"] || 0) >= 1 && wClass === "SHOTGUN") wdPct += 10.0;
  if ((effBrands["Overlord Armaments"] || 0) >= 1 && wClass === "RIFLE") wdPct += 10.0;
  if ((effBrands["Douglas & Harding"] || 0) >= 1 && wClass === "PISTOL") wdPct += 20.0;
  if ((effBrands["Electrique"] || 0) >= 3 && wClass === "SMG") wdPct += 10.0;
  if ((effBrands["Heartbreaker"] || 0) >= 2 && (wClass === "AR" || wClass === "LMG")) wdPct += 15.0;
  if ((effBrands["Hunter's Fury"] || 0) >= 2 && (wClass === "SMG" || wClass === "SHOTGUN")) wdPct += 15.0;
  if ((effBrands["Hotshot"] || 0) >= 2 && wClass === "MMR") wdPct += 30.0;
  if ((effBrands["Airaldi Holdings"] || 0) >= 1 && wClass === "MMR") wdPct += 10.0;
  if ((effBrands["Habsburg Guard"] || 0) >= 2 && wClass === "MMR") wdPct += 20.0;
  if ((effBrands["Walker, Harris & Co."] || 0) >= 1) wdPct += 5.0;
  if ((effBrands["Hana-U Corporation"] || 0) >= 3) wdPct += 15.0;
  if ((effBrands["Yaahl Gear"] || 0) >= 2) wdPct += 5.0;
  if ([...equippedNamesLower].some(n => n.includes("picaro"))) wdPct += 10.0;
  if (pWeap.toLowerCase().includes("capacitor")) wdPct += effYellowTiers * 7.5;
  if ([...equippedNamesLower].some(n => n.includes("memento"))) wdPct += 30.0;

  let chc = 10.0 + Number(wSpec.native_chc || 0) + gearChc + modChc;
  let chd = 45.0 + Number(wSpec.native_chd || 0) + gearChd + modChd;
  let hsd = ((Number(wSpec.headshot_mult || 1.55) - 1.0) * 100.0) + 20.0 + gearHsd + modHsd;

  if ((effBrands["Česká Výroba s.r.o."] || 0) >= 1) chc += 8.0;
  if ((effBrands["Grupo Sombra S.A."] || 0) >= 1) chd += 15.0;
  if ((effBrands["Grupo Sombra S.A."] || 0) >= 3) hsd += 15.0;
  if ((effBrands["Providence Defense"] || 0) >= 1) hsd += 15.0;
  if ((effBrands["Providence Defense"] || 0) >= 2) chc += 10.0;
  if ((effBrands["Providence Defense"] || 0) >= 3) chd += 15.0;
  if ((effBrands["Sokolov Concern"] || 0) >= 2) chd += 15.0;
  if ((effBrands["Sokolov Concern"] || 0) >= 3) chc += 10.0;
  if ((effBrands["Coyote's Mask"] || 0) >= 1 || [...equippedNamesLower].some(n => n.includes("coyote"))) {
    chc += 10.0;
    chd += 10.0;
  }
  if ((effBrands["Negotiator's Dilemma"] || 0) >= 2) chc += 15.0;
  if ((effBrands["Negotiator's Dilemma"] || 0) >= 3) chd += 20.0;
  if ((effBrands["Umbra Initiative"] || 0) >= 2) chc += 15.0;
  if ((effBrands["Umbra Initiative"] || 0) >= 4) chd += 100.0;
  if ((effBrands["Hotshot"] || 0) >= 2) hsd += 30.0;
  if ((effBrands["Airaldi Holdings"] || 0) >= 2) hsd += 15.0;
  if ((effBrands["Habsburg Guard"] || 0) >= 1) hsd += 15.0;
  if ([...equippedNamesLower].some(n => n.includes("punch drunk"))) hsd += 20.0;

  const rawUncappedChc = Math.round(chc * 10) / 10;
  chc = Math.min(60.0, Math.max(0.0, chc));

  let dta = Number(wSpec.native_dta || 0) + gearDta;
  let dttooc = Number(wSpec.native_dttooc || 10.0) + gearDttooc;
  if ((effBrands["Walker, Harris & Co."] || 0) >= 2) dta += 5.0;
  if ((effBrands["Walker, Harris & Co."] || 0) >= 3) dttooc += 5.0;
  if ((effBrands["Airaldi Holdings"] || 0) >= 3) dta += 5.0;

  let twdPct = 0.0;
  let ampMult = 1.0;
  let rofMult = 1.0;
  let headhunterBonusMult = 1.0;

  const chestTalent = ((slots.CHEST || {}).talent || "").toLowerCase();
  const bpTalent = ((slots.BACKPACK || {}).talent || "").toLowerCase();
  const wTalentLow = (wTalent || wSpec.talent || "").toLowerCase();

  if (chestTalent.includes("glass cannon")) ampMult *= chestTalent.includes("perfect") ? 1.3 : 1.25;
  else if (chestTalent.includes("obliterate")) twdPct += 20.0;
  else if (chestTalent.includes("spotter")) ampMult *= chestTalent.includes("perfect") ? 1.2 : 1.15;
  else if (chestTalent.includes("intimidate")) ampMult *= chestTalent.includes("perfect") ? 1.4 : 1.35;
  else if (chestTalent.includes("headhunter")) headhunterBonusMult = hsd >= 150.0 ? 2.85 : 1.85;
  else if (chestTalent.includes("focus")) twdPct += chestTalent.includes("perfect") ? 60.0 : 50.0;

  if (bpTalent.includes("unstoppable")) twdPct += bpTalent.includes("perfect") ? 35.0 : 25.0;
  else if (bpTalent.includes("vigilance")) twdPct += 25.0;
  else if (bpTalent.includes("companion") || bpTalent.includes("composure")) twdPct += 15.0;
  else if (bpTalent.includes("opportunistic")) ampMult *= bpTalent.includes("perfect") ? 1.15 : 1.1;

  if ((effBrands["Striker's Battlegear"] || 0) >= 3) rofMult *= 1.15;
  if ((effBrands["Striker's Battlegear"] || 0) >= 4) {
    const hasStrikerBp = resolveParentBrand((slots.BACKPACK || {}).brand) === "Striker's Battlegear" || bpTalent.includes("risk management");
    ampMult *= hasStrikerBp ? 1.9 : 1.65;
  }
  if ((effBrands["Heartbreaker"] || 0) >= 4) ampMult *= 1.52;
  if ((effBrands["Hunter's Fury"] || 0) >= 4) ampMult *= 1.45;
  if ((effBrands["Umbra Initiative"] || 0) >= 4) rofMult *= 1.3;
  if ((effBrands["Future Initiative"] || 0) >= 4) twdPct += chestTalent.includes("tactical superiority") ? 25.0 : 15.0;

  if (wTalentLow.includes("flatline") || pWeap.toLowerCase().includes("kingbreaker")) ampMult *= (wTalentLow.includes("perfect") || pWeap.toLowerCase().includes("kingbreaker")) ? 1.2 : 1.15;
  else if (wTalentLow.includes("optimist")) wdPct += 15.0;
  else if (wTalentLow.includes("strained")) chd += 35.0;
  else if (wTalentLow.includes("killer") || pWeap.toLowerCase().includes("dark winter")) chd += (wTalentLow.includes("perfect") || pWeap.toLowerCase().includes("dark winter")) ? 50.0 : 40.0;
  else if (wTalentLow.includes("in sync") || pWeap.toLowerCase().includes("harmony")) wdPct += (wTalentLow.includes("perfect") || pWeap.toLowerCase().includes("harmony")) ? 40.0 : 30.0;
  else if (wTalentLow.includes("sadist") || wTalentLow.includes("eyeless") || wTalentLow.includes("ignited")) ampMult *= 1.2;
  else if (wTalentLow.includes("sledgehammer")) dta += 40.0;
  else if (wTalentLow.includes("determined") && wClass === "MMR") headhunterBonusMult = Math.max(headhunterBonusMult, 2.5);

  const hsHitRate = (wClass === "MMR" && (wTalentLow.includes("determined") || headhunterBonusMult > 1.0)) ? 1.0 : (wClass === "MMR" ? 0.85 : 0.25);
  const critAndHsMult = 1.0 + ((chc / 100.0) * (chd / 100.0)) + (hsHitRate * (hsd / 100.0));
  const baseDmg = Number(wSpec.base_dmg || 110000);
  const perBullet =
    baseDmg *
    (1.0 + wdPct / 100.0) *
    critAndHsMult *
    (1.0 + dta / 100.0) *
    (1.0 + dttooc / 100.0) *
    (1.0 + twdPct / 100.0) *
    ampMult *
    headhunterBonusMult;

  const effRpm = Number(wSpec.rpm || 800) * rofMult;
  const rps = effRpm / 60.0;
  const burstDps = perBullet * rps;

  let mag = Number(wSpec.mag_size || 50);
  if ((effBrands["Brazos de Arcabuz"] || 0) >= 3) mag = Math.round(mag * 1.5);
  const whBonus = gearWh + ((effBrands["Striker's Battlegear"] || 0) >= 2 ? 15.0 : 0.0) + ((effBrands["Hotshot"] || 0) >= 1 ? 30.0 : 0.0);
  const reloadSec = Math.max(0.6, Number(wSpec.reload_sec || 2.0) / (1.0 + whBonus / 100.0));
  const fireDuration = rps > 0 ? mag / rps : 1.0;
  let sustainedDps = (perBullet * mag) / (fireDuration + reloadSec);

  let pestiTick = 0;
  if (pWeap.toLowerCase().includes("pestilence")) {
    pestiTick =
      baseDmg *
      (1.0 + wdPct / 100.0) *
      (1.0 + dta / 100.0) *
      (1.0 + dttooc / 100.0) *
      (1.0 + twdPct / 100.0) *
      ampMult;
    sustainedDps += pestiTick;
  }

  let skillCombinedDps = 0;
  const roleUp = String(l.archetype || "").toUpperCase();
  if (roleUp === "SKILL_DPS" || roleUp === "CROWD_CONTROL" || effYellowTiers >= 5) {
    let baseSkill = 420000.0 * (effYellowTiers / 6.0);
    if ((effBrands["Empress International"] || 0) >= 3) baseSkill *= 1.35;
    if ((effBrands["Waveform"] || 0) >= 1 || [...equippedNamesLower].some(n => n.includes("waveform"))) baseSkill *= 1.2;
    if (pWeap.toLowerCase().includes("capacitor")) baseSkill *= 1.45;
    if ((effBrands["Eclipse Protocol"] || 0) >= 4) baseSkill = 680000.0 * (effYellowTiers / 6.0);
    skillCombinedDps = Math.round(baseSkill);
    if (roleUp === "SKILL_DPS" || roleUp === "CROWD_CONTROL") {
      sustainedDps += skillCombinedDps;
    }
  }

  const baseArmor = 726000 + blueCores * 170000;
  let armorPctBonus = 10.0;
  if ((effBrands["Gila Guard"] || 0) >= 1) armorPctBonus += 5.0;
  if ((effBrands["Uzina Getica"] || 0) >= 1) armorPctBonus += 5.0;
  if ((effBrands["Foundry Bulwark"] || 0) >= 2) armorPctBonus += 10.0;
  if ((effBrands["Heartbreaker"] || 0) >= 4) armorPctBonus += 50.0;
  const totalArmor = baseArmor * (1.0 + armorPctBonus / 100.0);

  let regenPct = 0.0;
  if ((effBrands["Belstone Armory"] || 0) >= 1) regenPct += 1.0;
  if ((effBrands["Gila Guard"] || 0) >= 3) regenPct += 1.0;
  if ((effBrands["Foundry Bulwark"] || 0) >= 3) regenPct += 1.0;
  if ((effBrands["Golan Gear Ltd"] || 0) >= 2) regenPct += 1.5;
  if ([...equippedNamesLower].some(n => n.includes("memento"))) regenPct += 3.0;
  if ([...equippedNamesLower].some(n => n.includes("emperor's guard"))) regenPct += 1.0;
  const totalRegenPerSec = Math.round((totalArmor * (regenPct / 100.0)) + gearRegen);

  const activeBonusesHtml = Object.entries(effBrands)
    .map(
      ([bName, cnt]) => `
    <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px dashed var(--border);">
      <span>${bName}</span>
      <span class="badge ${cnt >= 3 ? "badge-accent" : ""}">${cnt} pc</span>
    </div>
  `
    )
    .join("");

  const enemyTargets = [
    { label: "Heroic Solo Elite (9.5M)", hp: 9500000 },
    { label: "Heroic 4P Named (24M)", hp: 24000000 },
    { label: "Legendary 4P Elite (18.5M)", hp: 18500000 },
    { label: "Countdown Hunter (32M)", hp: 32000000 },
    { label: "Raid / Incursion Boss (85M)", hp: 85000000 },
  ];
  const ttkRowsHtml = enemyTargets
    .map(t => {
      const oneMagDmg = perBullet * mag + (pestiTick + skillCombinedDps) * fireDuration;
      const ttkSec = oneMagDmg >= t.hp && (burstDps + pestiTick + skillCombinedDps) > 0
        ? (t.hp / (burstDps + pestiTick + skillCombinedDps)).toFixed(2)
        : (t.hp / Math.max(1, sustainedDps)).toFixed(2);
      const shots = Math.max(1, Math.round(t.hp / Math.max(1, perBullet)));
      return `
        <tr>
          <td>${t.label}</td>
          <td style="font-weight:800; color:var(--shd-orange);">${ttkSec}s</td>
          <td>${shots} rds (${(shots / Math.max(1, mag)).toFixed(1)}m)</td>
        </tr>
      `;
    })
    .join("");

  const chcOvercapWarning = rawUncappedChc > 60.5
    ? `<div style="font-size:0.7rem; color:var(--warn); margin-top:4px;">⚠️ Raw CHC is ${rawUncappedChc}% (${(rawUncappedChc - 60).toFixed(1)}% over 60% cap) — click '🎯 Auto-Cap 60% CHC' to convert excess CHC mods to CHD!</div>`
    : "";

  const telEl = document.getElementById("wb-telemetry-content");
  if (telEl) {
    telEl.innerHTML = `
      <div class="tel-section">
        <h4>⚡ Primary Combat Output (${pWeap})</h4>
        <div class="tel-big-dps">${(burstDps / 1e6).toFixed(2)}M <span style="font-size:0.8rem; color:var(--text-muted);">Burst DPS</span></div>
        <div class="tel-row"><span>Sustained DPS (w/ Reload):</span><b>${(sustainedDps / 1e6).toFixed(2)}M / sec</b></div>
        <div class="tel-row"><span>Avg Per-Bullet Hit:</span><b>${Math.round(perBullet).toLocaleString()}</b></div>
        ${pestiTick > 0 ? `<div class="tel-row" style="color:var(--shd-orange);"><span>☣️ Max Pestilence Tick (50x):</span><b>${(pestiTick / 1e6).toFixed(2)}M / sec</b></div>` : ""}
        ${skillCombinedDps > 0 ? `<div class="tel-row" style="color:var(--yellow-core);"><span>⚡ Combined Skill DPS:</span><b>${(skillCombinedDps / 1e3).toFixed(0)}k / sec</b></div>` : ""}
        <div class="tel-row"><span>Effective RPM / Mag / Reload:</span><b>${Math.round(effRpm)} RPM / ${mag} / ${reloadSec.toFixed(2)}s</b></div>
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
        <div class="tel-row"><span>Cores (🔴 / 🔵 / 🟡):</span><b>${redCores}R / ${blueCores}B / ${effYellowTiers}Y</b></div>
        <div class="tel-row"><span>Weapon Damage (Bucket 2):</span><b>+${wdPct.toFixed(1)}%</b></div>
        <div class="tel-row"><span>Crit Chance (Cap 60%):</span><b style="color:${chc >= 58 ? "var(--success)" : "var(--text-main)"};">${chc.toFixed(1)}%</b></div>
        <div class="tel-row"><span>Crit Hit Damage:</span><b>+${chd.toFixed(1)}%</b></div>
        <div class="tel-row"><span>Headshot Damage:</span><b>+${hsd.toFixed(1)}%</b></div>
        <div class="tel-row"><span>Damage to Armor (Bucket 4):</span><b>+${dta.toFixed(1)}%</b></div>
        <div class="tel-row"><span>DMG Out of Cover (Bucket 5):</span><b>+${dttooc.toFixed(1)}%</b></div>
        <div class="tel-row"><span>Total Weapon DMG (Bucket 6):</span><b>+${twdPct.toFixed(1)}%</b></div>
        <div class="tel-row"><span>Amplified Multiplier (Bucket 7):</span><b>x${ampMult.toFixed(2)}</b></div>
        ${chcOvercapWarning}
      </div>

      <div class="tel-section">
        <h4>🛡️ Survivability &amp; Active Set Bonuses</h4>
        <div class="tel-row"><span>Total Agent Armor:</span><b>${(totalArmor / 1e6).toFixed(2)}M</b></div>
        ${totalRegenPerSec > 0 ? `<div class="tel-row"><span>Armor Regen / Sec:</span><b>+${totalRegenPerSec.toLocaleString()} / s</b></div>` : ""}
        ${modPfe > 0 ? `<div class="tel-row"><span>Protection From Elites:</span><b>+${modPfe}%</b></div>` : ""}
        <div style="margin-top:8px; font-size:0.75rem;">
          ${activeBonusesHtml}
        </div>
      </div>
    `;
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
  const slot = it.slot || ACTIVE_SLOT_PICKER_TARGET;
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
// VIEW 3: ARMORY & STASH INVENTORY EXPLORER (MULTI-DIMENSIONAL CATEGORIZATION)
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
  const c = it.core_attribute || {};
  const coreClass = c.type === "ARMOR" ? "core-blue" : c.type === "SKILL_TIER" ? "core-yellow" : "core-red";
  const rarityClass =
    it.rarity === "EXOTIC" ? "rarity-exotic" : it.rarity === "GEAR_SET" ? "rarity-set" : it.rarity === "NAMED_HIGH_END" ? "rarity-named" : "";

  const tags = it.archetype_tags || {};
  const archMeta = ARCHETYPE_BADGE_MAP[tags.role_archetype || "CRIT_DPS"] || ARCHETYPE_BADGE_MAP.CRIT_DPS;
  const recalState = tags.recal_state || "VIRGIN";
  const recalBadgeText =
    recalState === "PROTOTYPE"
      ? "🟣 PROTOTYPE"
      : recalState === "VIRGIN"
      ? "🌱 VIRGIN"
      : `🔧 ${recalState.replace("RECAL_", "RECAL ")}`;

  const rollSource = it.roll_source || "OCR_DIRECT";
  const provHtml =
    rollSource === "PIP_DEDUCED" && !it.user_verified
      ? `<span class="provenance-badge pip-deduced" title="Minor roll value deduced from attribute pip color — click Edit to verify">⚡ PIP DEDUCED</span>`
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
  const isTrash = trashIds.has(it.item_id);
  const usageBadges = usages
    .slice(0, 2)
    .map(u => `<span class="usage-pill">🏆 ${u.build_name} (${u.score}%)</span>`)
    .join("");

  return `
    <div class="armory-card ${rarityClass}">
      <div class="ac-top">
        <div>
          <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
            <span class="sec-slot-tag">${it.slot}</span>
            <span class="archetype-badge" title="${archMeta.title}">${archMeta.label}</span>
            ${provHtml}
          </div>
          <div class="ac-name" style="margin-top:4px;">${it.item_name || it.brand_or_set}</div>
          <div class="ac-brand">${it.brand_or_set} • <span style="font-size:0.68rem; color:var(--text-muted);">${recalBadgeText} (${tags.power_pct || 100}% Roll)</span></div>
        </div>
        <button class="btn-fav ${it.is_favorite ? "fav" : ""}" onclick="toggleItemFavorite('${it.item_id}')" title="Favorite / Lock Item">★</button>
      </div>

      ${it.crop_image_path ? `<img src="${it.crop_image_path}" class="ac-crop-img" alt="OCR Crop" onerror="this.style.display='none'" />` : ""}

      <div class="ac-stats-box">
        <div class="ac-stat-line ${coreClass}">
          <span>${c.recal || c.is_recalibrated ? "🔧 " : ""}Core: ${STAT_LABELS[c.type] || c.type}</span>
          <b>${formatStatVal(c.type, c.value)}</b>
        </div>
        ${minorsHtml}
        ${it.talent && it.talent.name ? `<div class="ac-stat-line" style="color:var(--gold-high);"><span>${it.talent.recal ? "🔧 " : "✨ "}Talent</span><b>${it.talent.name}</b></div>` : ""}
      </div>

      <div class="ac-usage-tags">
        ${usageBadges}
        ${isTrash ? `<span class="usage-pill trash">🗑️ Safe to Deconstruct</span>` : ""}
      </div>

      <div class="ac-footer">
        <span class="muted-sub">Conf: ${Math.round((it.ocr_confidence || 0.98) * 100)}%</span>
        <div style="display:flex; gap:5px;">
          <button class="btn btn-gold btn-xs" onclick="quickEquipFromArmoryToWorkbench('${it.item_id}')" title="Equip directly into active Loadout Workbench">🛠️ Equip</button>
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
    const tags = it.archetype_tags || {};
    if (ACTIVE_ARMORY_SLOT === "FAV" && !it.is_favorite) return false;
    if (ACTIVE_ARMORY_SLOT === "TRASH" && !trashIds.has(it.item_id)) return false;
    if (!["ALL", "FAV", "TRASH"].includes(ACTIVE_ARMORY_SLOT) && it.slot !== ACTIVE_ARMORY_SLOT) return false;

    if (ACTIVE_ARMORY_ARCHETYPE !== "ALL" && tags.role_archetype !== ACTIVE_ARMORY_ARCHETYPE) return false;
    if (coreFilter !== "ALL" && tags.core_category !== coreFilter) return false;

    if (stateFilter === "VIRGIN" && tags.recal_state !== "VIRGIN") return false;
    if (stateFilter === "RECALIBRATED" && !String(tags.recal_state || "").startsWith("RECAL_")) return false;
    if (stateFilter === "PROTOTYPE" && !it.is_prototype && tags.recal_state !== "PROTOTYPE") return false;
    if (stateFilter === "PIP_DEDUCED" && (it.roll_source !== "PIP_DEDUCED" || it.user_verified)) return false;
    if (stateFilter === "OCR_DIRECT" && it.roll_source === "PIP_DEDUCED" && !it.user_verified) return false;
    if (stateFilter === "IN_LOADOUT" && !(usageMap[it.item_id] && usageMap[it.item_id].length > 0)) return false;

    if (query) {
      const blob = `${it.item_name} ${it.brand_or_set} ${it.slot} ${(it.talent || {}).name || ""} ${tags.role_archetype || ""}`.toLowerCase();
      if (!blob.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">No items match the current Armory filter. Click '⚡ Demo Stash' or scan a screenshot!</div>`;
    return;
  }

  if (groupBy === "NONE") {
    grid.innerHTML = filtered.map(it => _renderSingleArmoryCard(it, usageMap, trashIds)).join("");
    return;
  }

  // Grouped rendering (by ARCHETYPE, BRAND, or SLOT)
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
// CLICK-TO-VERIFY & INLINE ITEM EDITOR MODAL (PHASE 0 & PHASE 2)
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

  const minorTypes = Object.keys(STAT_LABELS).filter(k => !["WEAPON_DAMAGE", "ARMOR", "SKILL_TIER", "TRIPLE_CORE"].includes(k));
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

  // Populate Recalibration Wrench Lock selector
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
    cropContainer.innerHTML = it.crop_image_path
      ? `<img src="${it.crop_image_path}" style="max-width:100%; max-height:110px; border-radius:4px;" />`
      : `<div class="muted-sub">Synthetic / Manual Item (No OCR Screenshot Crop)</div>`;
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
  const payload = {
    slot: document.getElementById("edit-slot").value,
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
  setIngestStatus("⚡ Loading 47-Item Golden Endgame Stash...");
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

async function openAddCustomBuildModal() {
  const name = prompt("Enter Custom Meta Build Name (e.g. 'Ongoing Directive Bleed Support'):");
  if (!name) return;
  const summary = prompt("Enter brief Build Summary / Synergy Notes:", "Custom agent build archetype.") || "Custom agent build archetype.";
  const weapon = prompt("Primary Weapon:", "St. Elmo's Engine") || "St. Elmo's Engine";

  const payload = {
    name,
    role: "RED_DPS",
    tier_badge: "CUSTOM META",
    summary,
    primary_weapons: [weapon],
    specialization: "Gunner",
    target_cores: { RED: 6, BLUE: 0, YELLOW: 0 },
    ideal_minors: ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"],
    slots: {
      MASK: { preferred: ["Coyote's Mask", "Česká Výroba s.r.o."], alt_brands: ["Grupo Sombra S.A."], core: "WEAPON_DAMAGE", minors: ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"] },
      CHEST: { preferred: ["Česká Výroba s.r.o.", "Grupo Sombra S.A."], alt_brands: ["Providence Defense"], core: "WEAPON_DAMAGE", minors: ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], talent: "Obliterate" },
      BACKPACK: { preferred: ["Grupo Sombra S.A.", "The Gift"], alt_brands: ["Memento"], core: "WEAPON_DAMAGE", minors: ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], talent: "Vigilance" },
      GLOVES: { preferred: ["Contractor's Gloves"], alt_brands: ["Grupo Sombra S.A."], core: "WEAPON_DAMAGE", minors: ["DAMAGE_TO_ARMOR", "CRITICAL_HIT_DAMAGE"] },
      HOLSTER: { preferred: ["Picaro's Holster", "Grupo Sombra S.A."], alt_brands: ["Česká Výroba s.r.o."], core: "WEAPON_DAMAGE", minors: ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"] },
      KNEEPADS: { preferred: ["Fox's Prayer", "Turmoil"], alt_brands: ["Česká Výroba s.r.o."], core: "WEAPON_DAMAGE", minors: ["DTTOOC", "CRITICAL_HIT_DAMAGE"] },
    },
  };

  const newState = await SHDStorageAdapter.addCustomBuild(payload);
  applyState(newState);
}
