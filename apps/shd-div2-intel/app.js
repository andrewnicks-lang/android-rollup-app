/**
 * SHD Tactical Inventory & Build Intelligence Platform
 * Local-First Reactive Client (`web/app.js`)
 */

let APP_STATE = {
  inventory: [],
  solver: { builds: [], countdown_farm_radar: [], deconstruct_candidates: [], summary_metrics: {} },
  canonical: {},
  backups: [],
  saved_loadouts: [],
  admin_showcase_loadouts: [],
  expertise: { expertise_level: 30, total_proficient: 413, total_items: 500, missing_count: 87, categories: [], items: [] },
  selectedBuildId: null,
  activeWorkbench: null,
};

const SLOTS_ORDER = ["MASK", "BACKPACK", "CHEST", "GLOVES", "HOLSTER", "KNEEPADS"];

function showToast(msg) {
  const el = document.getElementById("toast-banner");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 3200);
}

async function fetchInitialState() {
  if (window.SHDStorageAdapter) {
    const data = await window.SHDStorageAdapter.fetchState();
    applyState(data);
    return;
  }
  const res = await fetch("/api/state");
  const data = await res.json();
  applyState(data);
}

function applyState(data) {
  APP_STATE.inventory = data.inventory || [];
  APP_STATE.solver = data.solver || {};
  APP_STATE.canonical = data.canonical || {};
  APP_STATE.backups = data.backups || [];
  APP_STATE.saved_loadouts = data.saved_loadouts || [];
  APP_STATE.admin_showcase_loadouts =
    data.admin_showcase_loadouts ||
    (window.SHD_CARTRIDGE_SEED && window.SHD_CARTRIDGE_SEED.admin_showcase_loadouts) ||
    [];
  APP_STATE.expertise = data.expertise || { expertise_level: 30, total_proficient: 413, total_items: 500, missing_count: 87, categories: [], items: [] };

  if (!APP_STATE.selectedBuildId && APP_STATE.solver.builds && APP_STATE.solver.builds.length > 0) {
    APP_STATE.selectedBuildId = APP_STATE.solver.builds[0].build_id;
  }

  if (!APP_STATE.activeWorkbench) {
    if (APP_STATE.saved_loadouts.length > 0) {
      APP_STATE.activeWorkbench = JSON.parse(JSON.stringify(APP_STATE.saved_loadouts[0]));
    } else if (APP_STATE.admin_showcase_loadouts.length > 0) {
      APP_STATE.activeWorkbench = JSON.parse(JSON.stringify(APP_STATE.admin_showcase_loadouts[0]));
      APP_STATE.activeWorkbench.loadout_id = null;
    }
  }

  document.getElementById("nav-count-armory").textContent = APP_STATE.inventory.length;
  document.getElementById("nav-count-decon").textContent =
    (APP_STATE.solver.deconstruct_candidates || []).length;
  if (document.getElementById("nav-count-loadouts")) {
    document.getElementById("nav-count-loadouts").textContent = APP_STATE.saved_loadouts.length;
  }
  if (document.getElementById("nav-count-exp")) {
    document.getElementById("nav-count-exp").textContent =
      `${APP_STATE.expertise.total_proficient}/${APP_STATE.expertise.total_items}`;
  }
  document.getElementById("ready-builds-pill").textContent =
    `${APP_STATE.solver.summary_metrics?.ready_builds_count || 0} READY NOW`;

  renderBuildMatrix();
  renderWorkbench();
  renderArmory();
  renderExpertiseTracker();
  renderCountdownRadar();
  renderDeconstructAdvisor();
}

function switchView(viewName) {
  ["matrix", "workbench", "armory", "expertise", "radar", "decon"].forEach((v) => {
    const viewEl = document.getElementById(`view-${v}`);
    const tabEl = document.getElementById(`tab-${v}`);
    const mtabEl = document.getElementById(`mtab-${v}`);
    if (viewEl) viewEl.classList.toggle("active", v === viewName);
    if (tabEl) tabEl.classList.toggle("active", v === viewName);
    if (mtabEl) mtabEl.classList.toggle("active", v === viewName);
  });
}

function switchMobileSubPanel(group, subKey) {
  ["list", "center", "right"].forEach((k) => {
    const panelEl = document.getElementById(`mpanel-${group}-${k}`);
    const btnEl = document.getElementById(`msub-${group}-${k}`);
    if (panelEl) panelEl.classList.toggle("mpanel-active", k === subKey);
    if (btnEl) btnEl.classList.toggle("active", k === subKey);
  });
}

function selectBuild(buildId) {
  APP_STATE.selectedBuildId = buildId;
  renderBuildMatrix();
  if (window.innerWidth <= 860) {
    switchMobileSubPanel("matrix", "center");
  }
}

function formatCoreStat(core) {
  if (!core) return "";
  if (core.type === "WEAPON_DAMAGE") return `🔴 +${core.value}% Weapon Damage`;
  if (core.type === "ARMOR") return `🔵 +${Number(core.value).toLocaleString()} Armor`;
  return `🟡 +${core.value} Skill Tier`;
}

function formatMinorStat(m) {
  const label = (m.stat || "").replace(/_/g, " ");
  const isFlat = m.stat === "ARMOR_REGEN" || m.stat === "HEALTH";
  const valStr = isFlat ? `+${Number(m.value).toLocaleString()}` : `+${m.value}%`;
  const wrench = m.recal ? " 🔧" : "";
  return `${valStr} ${label}${wrench}`;
}

function renderBuildMatrix() {
  const builds = APP_STATE.solver.builds || [];
  const listEl = document.getElementById("build-list-container");
  listEl.innerHTML = builds
    .map((b) => {
      const isSel = b.build_id === APP_STATE.selectedBuildId;
      const badgeClass =
        b.readiness_status === "READY_NOW"
          ? "st-ready"
          : b.readiness_status === "TINKER_AWAY"
          ? "st-tinker"
          : "st-farm";
      const barColor =
        b.readiness_status === "READY_NOW"
          ? "#10b981"
          : b.readiness_status === "TINKER_AWAY"
          ? "#f59e0b"
          : "#3b82f6";

      return `
      <div class="build-item ${isSel ? "selected" : ""}" onclick="selectBuild('${b.build_id}')">
        <div class="build-item-top">
          <div class="build-name">${b.name}</div>
          <span class="status-badge ${badgeClass}">${b.readiness_label}</span>
        </div>
        <div style="color:var(--text-muted);font-size:11px;margin-top:4px;">${b.tier_badge} // ${b.specialization.split(" (")[0]}</div>
        <div class="progress-row">
          <div class="progress-track">
            <div class="progress-fill" style="width:${b.post_tinker_optimization_pct}%;background:${barColor};"></div>
          </div>
          <span style="font-weight:800;font-size:11.5px;color:${barColor};">${b.post_tinker_optimization_pct}%</span>
        </div>
      </div>
    `;
    })
    .join("");

  const active = builds.find((b) => b.build_id === APP_STATE.selectedBuildId) || builds[0];
  if (!active) return;

  document.getElementById("active-build-header").textContent =
    `OPTIMAL 6-SLOT LOADOUT // ${active.name.toUpperCase()}`;
  document.getElementById("active-build-role").textContent = active.tier_badge;

  const centerEl = document.getElementById("active-build-center");
  const slotsHtml = SLOTS_ORDER.map((slotKey) => {
    const sObj = active.slots[slotKey];
    if (!sObj || sObj.status === "MISSING") {
      return `
        <div class="slot-card slot-missing">
          <div class="slot-head">
            <span>${slotKey}</span>
            <span style="color:#f87171;">MISSING PIECE</span>
          </div>
          <div class="slot-title" style="color:#fca5a5;">Farm: ${sObj?.target_brand || "Target Brand"}</div>
          <div class="slot-brand">Target Core: ${sObj?.target_core || "ANY"}</div>
          <div class="stat-line" style="color:var(--text-muted);">
            <span>Desired Minors: ${(sObj?.target_minors || []).join(", ").replace(/_/g, " ")}</span>
          </div>
          ${sObj?.target_talent ? `<div class="tinker-callout">Required Talent: ${sObj.target_talent}</div>` : ""}
        </div>
      `;
    }

    const it = sObj.item;
    const rawIt = sObj.raw_item;
    const minorsHtml = (it.minor_attributes || [])
      .map((m) => `<div class="stat-line"><span>&bull; ${formatMinorStat(m)}</span></div>`)
      .join("");
    const talentHtml = it.talent?.name
      ? `<div style="margin-top:5px;font-size:11px;color:#fbbf24;font-weight:700;">★ Talent: ${it.talent.name}</div>`
      : "";
    const tinkerBanner = sObj.tinker_action
      ? `<div class="tinker-callout">🔧 TINKER: ${sObj.tinker_action}</div>`
      : `<div style="margin-top:6px;font-size:10.5px;color:#34d399;font-weight:700;">✔ Ready As-Is (${sObj.post_tinker_score}% Optimal)</div>`;

    return `
      <div class="slot-card rarity-${it.rarity}" onclick="openVerifyModal('${rawIt.item_id}')">
        <div class="slot-head">
          <span>${slotKey} // ${it.rarity.replace(/_/g, " ")}</span>
          <span style="color:#38bdf8;">[${rawIt.location}]</span>
        </div>
        <div class="slot-title">${it.item_name}</div>
        <div class="slot-brand">${it.brand_or_set}</div>
        <div class="stat-line" style="font-weight:700;">
          <span>${formatCoreStat(it.core_attribute)}</span>
        </div>
        ${minorsHtml}
        ${talentHtml}
        ${tinkerBanner}
      </div>
    `;
  }).join("");

  centerEl.innerHTML = `
    <div style="background:#121a2b;border:1px solid var(--border);border-radius:6px;padding:10px 13px;display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div>
        <div style="font-size:12.5px;color:#e2e8f0;">${active.summary}</div>
        <div style="margin-top:6px;font-size:11.5px;color:var(--shd-orange);font-weight:700;">
          Recommended Weapons: ${active.primary_weapons.join("  |  ")}
        </div>
      </div>
      <button class="btn-action btn-primary" style="white-space:nowrap;padding:8px 12px;" onclick="cloneMatrixBuildToWorkbench('${active.build_id}')">
        🛠️ Open in Workbench
      </button>
    </div>
    <div class="slots-grid">${slotsHtml}</div>
  `;

  // Right Column: Telemetry & Bench Recipe
  const tel = active.telemetry;
  const tinkerRecipeHtml =
    active.tinker_steps.length > 0
      ? active.tinker_steps
          .map(
            (st, idx) => `
        <div class="recipe-step">
          <div style="font-weight:800;color:#ffffff;">${idx + 1}. Pull ${st.item_name} [${st.location}]</div>
          <div style="color:#34d399;margin-top:2px;">&rarr; ${st.action}</div>
        </div>
      `
          )
          .join("")
      : `<div class="recipe-step" style="border-left-color:#10b981;color:#6ee7b7;">✔ Zero Tinkering Required — All owned pieces are already rolled to optimal stats!</div>`;

  const missingHtml =
    active.missing_slots.length > 0
      ? `<div style="margin-top:14px;">
          <div style="font-weight:800;font-size:11px;color:#f87171;text-transform:uppercase;margin-bottom:6px;">MISSING PIECES TO FARM IN COUNTDOWN</div>
          ${active.missing_slots
            .map(
              (m) => `
            <div class="recipe-step" style="border-left-color:#ef4444;">
              <strong>${m.slot}:</strong> Target Loot &rarr; <span style="color:var(--shd-orange);font-weight:700;">${m.target}</span>
              ${m.talent ? `<div style="font-size:11px;color:var(--text-muted);">Look for Talent: ${m.talent}</div>` : ""}
            </div>
          `
            )
            .join("")}
        </div>`
      : "";

  document.getElementById("active-build-telemetry").innerHTML = `
    <div class="core-pills">
      <div class="core-box core-red">${tel.cores.RED} RED</div>
      <div class="core-box core-blue">${tel.cores.BLUE} BLUE</div>
      <div class="core-box core-yellow">${tel.cores.YELLOW} YLW</div>
    </div>

    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Post-Tinker Optimization</span>
      <strong style="color:#34d399;font-size:14px;">${active.post_tinker_optimization_pct}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">As-Is Raw Score</span>
      <strong>${active.raw_optimization_pct}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Crit Hit Chance (60% Cap)</span>
      <strong style="color:#34d399;">${tel.chc_pct}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Crit Hit Damage (Est.)</span>
      <strong style="color:var(--shd-orange);">${tel.chd_pct}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">All Weapon Damage Bonus</span>
      <strong>+${tel.awd_pct}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Estimated Total Armor</span>
      <strong style="color:#60a5fa;">${tel.armor_total}</strong>
    </div>

    <div style="margin-top:14px;margin-bottom:6px;font-weight:800;font-size:11px;color:var(--shd-orange);text-transform:uppercase;">
      🔧 TINKERING BENCH ACTION RECIPE
    </div>
    ${tinkerRecipeHtml}
    ${missingHtml}

    <div style="margin-top:14px;padding:9px;background:#0b101b;border:1px solid var(--border);border-radius:5px;font-size:11px;color:var(--text-muted);">
      💡 <strong style="color:#38bdf8;">Click-to-Verify Proof:</strong> Click any of the 6 gear slot cards in the center panel to view its original cropped in-game stat card and edit rolls.
    </div>
  `;
}

function renderArmory() {
  const q = (document.getElementById("armory-search")?.value || "").toLowerCase();
  const slotFilter = document.getElementById("armory-slot")?.value || "ALL";
  const locFilter = document.getElementById("armory-loc")?.value || "ALL";
  const coreFilter = document.getElementById("armory-core")?.value || "ALL";

  const filtered = APP_STATE.inventory.filter((it) => {
    if (slotFilter !== "ALL" && it.slot !== slotFilter) return false;
    if (locFilter !== "ALL" && it.location !== locFilter) return false;
    if (coreFilter !== "ALL" && it.core_attribute?.category !== coreFilter) return false;
    if (q) {
      const hay = `${it.item_name} ${it.brand_or_set} ${it.slot} ${it.talent?.name || ""} ${JSON.stringify(it.minor_attributes)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const container = document.getElementById("armory-grid-container");
  container.innerHTML = filtered
    .map((it) => {
      const minorsHtml = (it.minor_attributes || [])
        .map((m) => `<div class="stat-line"><span>&bull; ${formatMinorStat(m)}</span></div>`)
        .join("");
      const confPct = Math.round((it.ocr_confidence || 1) * 100);
      const confColor = confPct >= 90 ? "#34d399" : "#fbbf24";
      const inLoadoutsHtml =
        it.in_loadouts && it.in_loadouts.length > 0
          ? `<div style="margin-top:6px;background:rgba(16,185,129,0.16);border:1px solid #10b981;color:#6ee7b7;padding:3px 6px;border-radius:4px;font-size:10.5px;font-weight:700;">🛡️ In Loadout: ${it.in_loadouts.join(", ")}</div>`
          : "";

      return `
      <div class="slot-card rarity-${it.rarity}" onclick="openVerifyModal('${it.item_id}')">
        <div class="slot-head">
          <span>${it.slot} // ${it.location}</span>
          <span style="color:${confColor};">OCR ${confPct}%</span>
        </div>
        <div class="slot-title">${it.item_name}</div>
        <div class="slot-brand">${it.brand_or_set}</div>
        <div class="stat-line" style="font-weight:700;">${formatCoreStat(it.core_attribute)}</div>
        ${minorsHtml}
        ${it.talent?.name ? `<div style="margin-top:5px;font-size:11px;color:#fbbf24;font-weight:700;">★ ${it.talent.name}</div>` : ""}
        ${inLoadoutsHtml}
      </div>
    `;
    })
    .join("");
}

function renderCountdownRadar() {
  const radar = APP_STATE.solver.countdown_farm_radar || [];
  const el = document.getElementById("radar-grid-container");
  if (radar.length === 0) {
    el.innerHTML = `<div class="panel" style="padding:20px;">You own 6/6 pieces for every single Meta Build!</div>`;
    return;
  }
  el.innerHTML = radar
    .map(
      (r, idx) => `
    <div class="slot-card" style="border-top:3px solid var(--shd-orange);">
      <div class="slot-head">
        <span>PRIORITY #${idx + 1} TARGETED LOOT</span>
        <span class="status-badge st-tinker">UNLOCKS ${r.builds_unlocked.length} BUILD(S)</span>
      </div>
      <div class="slot-title" style="font-size:16px;color:var(--shd-orange);margin-top:6px;">🎯 ${r.target_loot}</div>
      <div style="font-size:12px;color:var(--text-main);margin:8px 0;">
        Set your Countdown / Summit Targeted Loot to <strong>${r.target_loot}</strong> to fill <strong>${r.missing_count} missing slot(s)</strong>:
      </div>
      <ul style="margin:4px 0 0 0;padding-left:18px;color:var(--text-muted);font-size:11.5px;">
        ${r.slots_needed.map((s) => `<li style="margin-bottom:3px;">${s}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");
}

function renderDeconstructAdvisor() {
  const list = APP_STATE.solver.deconstruct_candidates || [];
  const el = document.getElementById("decon-grid-container");
  if (list.length === 0) {
    el.innerHTML = `<div class="panel" style="padding:20px;color:#34d399;">Zero dominated duplicate items found — your Stash is 100% lean!</div>`;
    return;
  }
  el.innerHTML = list
    .map(
      (d) => `
    <div class="slot-card" style="border-top:3px solid #ef4444;">
      <div class="slot-head">
        <span>${d.slot} // [${d.location}]</span>
        <span class="status-badge" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid #ef4444;">SAFE TO DECONSTRUCT</span>
      </div>
      <div class="slot-title">${d.item_name}</div>
      <div class="slot-brand">${d.brand_or_set} (Roll Power: ${d.inferior_roll_pct}%)</div>
      <div style="font-size:12px;color:#cbd5e1;margin:8px 0;">${d.reason}</div>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <button class="btn-action" onclick="openVerifyModal('${d.item_id}')">🔍 Inspect Card</button>
        <button class="btn-action" style="border-color:#ef4444;color:#fca5a5;" onclick="deleteItemById('${d.item_id}')">🗑️ Mark Deconstructed</button>
      </div>
    </div>
  `
    )
    .join("");
}

function openVerifyModal(itemId) {
  const it = APP_STATE.inventory.find((x) => x.item_id === itemId);
  if (!it) return;
  const modal = document.getElementById("verify-modal");
  const content = document.getElementById("verify-modal-content");

  const m0 = (it.minor_attributes && it.minor_attributes[0]) || { stat: "CRITICAL_HIT_CHANCE", value: 6.0 };
  const m1 = (it.minor_attributes && it.minor_attributes[1]) || { stat: "CRITICAL_HIT_DAMAGE", value: 12.0 };
  const minorOptions = [
    "CRITICAL_HIT_CHANCE",
    "CRITICAL_HIT_DAMAGE",
    "HEADSHOT_DAMAGE",
    "WEAPON_HANDLING",
    "DAMAGE_TO_ARMOR",
    "DTTOOC",
    "SKILL_DAMAGE",
    "SKILL_HASTE",
    "SKILL_REPAIR",
    "STATUS_EFFECTS",
    "ARMOR_REGEN",
    "HAZARD_PROTECTION",
    "HEALTH",
  ];

  const renderStatSelect = (id, selectedStat) => `
    <select id="${id}" style="background:#070a10;border:1px solid var(--border);color:#fff;padding:5px;border-radius:4px;font-size:11.5px;">
      ${minorOptions
        .map(
          (opt) =>
            `<option value="${opt}" ${opt === selectedStat ? "selected" : ""}>${opt.replace(/_/g, " ")}</option>`
        )
        .join("")}
    </select>
  `;

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:10px;margin-bottom:14px;">
      <div>
        <div style="font-size:11px;color:var(--shd-orange);font-weight:800;">CLICK-TO-VERIFY &amp; 1-CLICK PROTOTYPE / ROLL EDITOR</div>
        <div style="font-size:17px;font-weight:800;color:#ffffff;">${it.item_name} (${it.slot})</div>
      </div>
      <button class="btn-action" onclick="closeVerifyModal()">✕ Close</button>
    </div>

    <div style="display:grid;grid-template-columns:255px 1fr;gap:16px;align-items:start;">
      <div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">CROPPED / SVG IN-GAME STAT CARD</div>
        <img src="${(it.crop_image_path || "").startsWith("data:") || (it.crop_image_path || "").startsWith("/") ? it.crop_image_path : "/" + (it.crop_image_path || "")}" onerror="if(window.SHDPortableSolver){this.src=window.SHDPortableSolver.generateSvgCardDataUri(${JSON.stringify(it).replace(/"/g, "&quot;")})}" style="width:100%;border-radius:6px;border:1px solid var(--border);" alt="Item Crop">
        <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">Hash ID: <code>${it.item_id}</code></div>
      </div>

      <div style="background:var(--bg-card);padding:12px 14px;border-radius:6px;border:1px solid var(--border);">
        <div style="font-size:11px;color:#38bdf8;font-weight:800;margin-bottom:10px;">INLINE ROLL &amp; PROTOTYPE AUGMENT EDITOR</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
          <div>
            <label style="font-size:11px;color:var(--text-muted);">Item Name</label>
            <input type="text" id="edit-item-name" value="${it.item_name}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
          </div>
          <div>
            <label style="font-size:11px;color:var(--text-muted);">Brand / Gear Set</label>
            <input type="text" id="edit-brand" value="${it.brand_or_set}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">
          <div>
            <label style="font-size:11px;color:var(--text-muted);">Location</label>
            <select id="edit-location" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px;border-radius:4px;">
              <option value="BACKPACK" ${it.location === "BACKPACK" ? "selected" : ""}>BACKPACK</option>
              <option value="STASH" ${it.location === "STASH" ? "selected" : ""}>STASH</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;color:var(--text-muted);">Core Type</label>
            <select id="edit-core-type" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px;border-radius:4px;">
              <option value="WEAPON_DAMAGE" ${it.core_attribute?.type === "WEAPON_DAMAGE" ? "selected" : ""}>🔴 Weapon Damage</option>
              <option value="ARMOR" ${it.core_attribute?.type === "ARMOR" ? "selected" : ""}>🔵 Armor</option>
              <option value="SKILL_TIER" ${it.core_attribute?.type === "SKILL_TIER" ? "selected" : ""}>🟡 Skill Tier</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;color:var(--text-muted);">Core Value (e.g. 15 or 22.5)</label>
            <input type="number" step="0.1" id="edit-core-val" value="${it.core_attribute?.value ?? 15.0}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
          </div>
        </div>

        <div style="margin-bottom:8px;">
          <label style="font-size:11px;color:var(--text-muted);">Minor Attribute 1 (Prototype allows up to 9.0% CHC / 18% CHD)</label>
          <div style="display:flex;gap:8px;margin-top:2px;">
            ${renderStatSelect("edit-m0-stat", m0.stat)}
            <input type="number" step="0.1" id="edit-m0-val" value="${m0.value}" style="width:90px;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
            <button class="btn-action" onclick="document.getElementById('edit-m0-val').value='6.0'" title="Set Standard Max 6.0%">6%</button>
            <button class="btn-action" style="border-color:#a855f7;color:#d8b4fe;" onclick="document.getElementById('edit-m0-val').value='9.0'" title="Set Prototype Max 9.0%">Proto 9%</button>
          </div>
        </div>

        <div style="margin-bottom:10px;">
          <label style="font-size:11px;color:var(--text-muted);">Minor Attribute 2</label>
          <div style="display:flex;gap:8px;margin-top:2px;">
            ${renderStatSelect("edit-m1-stat", m1.stat)}
            <input type="number" step="0.1" id="edit-m1-val" value="${m1.value}" style="width:90px;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
            <button class="btn-action" onclick="document.getElementById('edit-m1-val').value='12.0'" title="Set Max 12.0% CHD">12%</button>
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="font-size:11px;color:var(--text-muted);">Talent or Prototype Augment (e.g. 'Perfect Glass Cannon' or 'Augment: Paradox')</label>
          <input type="text" id="edit-talent" value="${it.talent?.name || ""}" placeholder="None or Talent/Augment name" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;margin-top:2px;">
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--border);">
          <button class="btn-action" style="border-color:#ef4444;color:#fca5a5;" onclick="deleteItemById('${it.item_id}');closeVerifyModal();">🗑️ Delete Item</button>
          <button class="btn-action btn-primary" onclick="saveInlineEditedItem('${it.item_id}')">💾 Save Changes &amp; Re-Solve</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add("open");
}

async function saveInlineEditedItem(oldItemId) {
  const orig = APP_STATE.inventory.find((x) => x.item_id === oldItemId);
  if (!orig) return;

  const cType = document.getElementById("edit-core-type").value;
  const cVal = parseFloat(document.getElementById("edit-core-val").value || "15");
  const cCat = cType === "WEAPON_DAMAGE" ? "RED" : cType === "ARMOR" ? "BLUE" : "YELLOW";
  const cMax = cType === "WEAPON_DAMAGE" ? (cVal > 15 ? 22.5 : 15.0) : cType === "ARMOR" ? 170000 : 1;

  const m0Stat = document.getElementById("edit-m0-stat").value;
  const m0Val = parseFloat(document.getElementById("edit-m0-val").value || "6.0");
  const m1Stat = document.getElementById("edit-m1-stat").value;
  const m1Val = parseFloat(document.getElementById("edit-m1-val").value || "12.0");

  const minors = [{ stat: m0Stat, value: m0Val, max_possible: m0Val, recal: false }];
  if (orig.rarity !== "GEAR_SET") {
    minors.push({ stat: m1Stat, value: m1Val, max_possible: m1Val, recal: false });
  }

  const talStr = document.getElementById("edit-talent").value.trim();
  const payload = {
    item_id: oldItemId,
    location: document.getElementById("edit-location").value,
    slot: orig.slot,
    rarity: orig.rarity,
    item_name: document.getElementById("edit-item-name").value.trim(),
    brand_or_set: document.getElementById("edit-brand").value.trim(),
    core_attribute: {
      type: cType,
      category: cCat,
      value: cVal,
      max_possible: cMax,
      is_recalibrated: false,
    },
    minor_attributes: minors,
    talent: talStr ? { name: talStr, is_perfect_locked: orig.talent?.is_perfect_locked || false } : null,
    ocr_confidence: 1.0,
  };

  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.saveItem(payload)
    : await (
        await fetch("/api/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ).json();
  applyState(data.state);
  closeVerifyModal();
  showToast(`Updated ${payload.item_name} and recalculated all builds!`);
}

function closeVerifyModal() {
  document.getElementById("verify-modal").classList.remove("open");
}

async function loadDemoStash() {
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.resetGolden()
    : await (await fetch("/api/reset-golden", { method: "POST" })).json();
  applyState(data.state);
  showToast("Loaded Golden Benchmark Demo Stash!");
}

async function clearAllStash() {
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.clearAll()
    : await (await fetch("/api/clear-all", { method: "POST" })).json();
  applyState(data.state);
  showToast("Inventory cleared to 0 items — ready for your real gear!");
}

function openBackupModal() {
  const modal = document.getElementById("backup-modal");
  renderBackupModalContent();
  modal.classList.add("open");
}

function closeBackupModal() {
  document.getElementById("backup-modal").classList.remove("open");
}

function renderBackupModalContent() {
  const content = document.getElementById("backup-modal-content");
  const backups = APP_STATE.backups || [];
  const runtimeMode = window.SHDStorageAdapter ? window.SHDStorageAdapter.getMode() : "FASTAPI_PC";
  const activeUser = window.SHDStorageAdapter ? window.SHDStorageAdapter.getActiveUser() : { email: "local@pc", role: "admin" };

  const rowsHtml =
    backups.length > 0
      ? backups
          .map(
            (b) => `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-card);border:1px solid var(--border);padding:8px 12px;border-radius:5px;margin-bottom:6px;">
          <div>
            <div style="font-weight:700;color:#ffffff;">${b.filename}</div>
            <div style="font-size:11px;color:var(--text-muted);">${b.item_count} items // Saved: ${b.created_at.replace("T", " ").slice(0, 19)}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <a class="btn-action" href="/data/backups/${b.filename}" download="${b.filename}" style="text-decoration:none;">⬇️ Download .JSON</a>
            <button class="btn-action btn-primary" onclick="restoreLocalSnapshot('${b.filename}', 'replace')">🔄 Restore (Replace)</button>
            <button class="btn-action" onclick="restoreLocalSnapshot('${b.filename}', 'merge')">➕ Merge</button>
          </div>
        </div>
      `
          )
          .join("")
      : `<div style="padding:12px;color:var(--text-muted);background:var(--bg-card);border-radius:5px;">No local server snapshots listed (${runtimeMode === "FASTAPI_PC" ? "click Save below" : "running in Android Hub / Portable mode — use Export/Import .JSON or Pull PC Seed above"}).</div>`;

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:10px;margin-bottom:14px;">
      <div>
        <div style="font-size:11px;color:#38bdf8;font-weight:800;">SHD ARMORY SNAPSHOT VAULT &amp; ANDROID HUB SYNC // MODE: ${runtimeMode}</div>
        <div style="font-size:17px;font-weight:800;color:#ffffff;">Save, Export, or Sync Your Gear Dump (${APP_STATE.inventory.length} Items // ${activeUser.email})</div>
      </div>
      <button class="btn-action" onclick="closeBackupModal()">✕ Close</button>
    </div>

    ${window.RollupBridge && window.RollupBridge.manuals ? window.RollupBridge.manuals.renderSettingsCardHtml('shd-div2-intel', 'SHD Build Intelligence Manual') : ''}

    <!-- Section 0: Android Rollup Hub Cartridge & PC Sync -->
    <div style="background:linear-gradient(135deg, rgba(255,107,0,0.14), rgba(15,23,42,0.95));border:1px solid var(--shd-orange);border-radius:6px;padding:12px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
        <div>
          <div style="font-weight:800;font-size:12px;color:var(--shd-orange);">📲 ANDROID ROLLUP HUB CARTRIDGE SYNC (shd-div2-intel)</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:2px;">
            Push your PC Armory, Saved Workbench Loadouts &amp; Expertise 413/500 into <code>d:\\_AI\\android-rollup-app\\apps\\shd-div2-intel\\</code>, or pull the latest PC seed into your mobile profile.
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${runtimeMode === "FASTAPI_PC" ? `<button class="btn-action btn-primary" onclick="pushPcToAndroidHub()">🔄 Push PC State to Android Hub</button>` : ""}
          <button class="btn-action" style="border-color:#38bdf8;color:#38bdf8;" onclick="syncFromPcSeed()">📥 Pull PC Seed to My Profile</button>
        </div>
      </div>
    </div>

    <!-- Section 1: Save & Export Current Dump -->
    <div style="background:#121a2b;border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:14px;">
      <div style="font-weight:800;font-size:12px;color:var(--shd-orange);margin-bottom:6px;">1. SAVE CURRENT INVENTORY SNAPSHOT (&amp; DOWNLOAD .JSON)</div>
      <div style="display:flex;gap:8px;">
        <input type="text" id="backup-label-input" placeholder="Snapshot label (e.g. 'Main_Agent_Full_Stash')" value="Main_Agent_Stash" style="flex:1;background:#070a10;border:1px solid var(--border);color:#fff;padding:7px 10px;border-radius:4px;">
        <button class="btn-action btn-primary" onclick="createAndDownloadBackup()">💾 Save &amp; Download .JSON</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
        Downloads a portable <code>.json</code> snapshot of your Armory, Saved Workbench Loadouts, and Expertise 413/500 progress.
      </div>
    </div>

    <!-- Section 2: Import External .JSON File -->
    <div style="background:#121a2b;border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:800;font-size:12px;color:#34d399;">2. RELOAD / IMPORT FROM ANY SAVED .JSON FILE</div>
        <div style="font-size:11px;color:var(--text-muted);">Select any previously downloaded <code>.json</code> backup file from your PC or Android device to restore your items.</div>
      </div>
      <label class="btn-action" style="border-color:#10b981;color:#6ee7b7;cursor:pointer;white-space:nowrap;">
        📂 Import Backup .JSON
        <input type="file" accept=".json" style="display:none" onchange="importBackupJsonFile(event)">
      </label>
    </div>

    <!-- Section 3: Local Vault History -->
    <div>
      <div style="font-weight:800;font-size:12px;color:#38bdf8;margin-bottom:6px;">3. LOCAL VAULT SNAPSHOTS (d:\\_AI\\Div2\\data\\backups\\)</div>
      <div style="max-height:220px;overflow-y:auto;">${rowsHtml}</div>
    </div>
  `;
}

async function pushPcToAndroidHub() {
  if (!window.SHDStorageAdapter) return;
  showToast("Bundling & syncing Cartridge into d:\\_AI\\android-rollup-app...");
  const res = await window.SHDStorageAdapter.triggerPcToHubSync();
  if (res.state) applyState(res.state);
  showToast("Synced shd-div2-intel Cartridge & Admin Showcase Loadouts to Android Rollup Hub!");
}

async function syncFromPcSeed() {
  if (!window.SHDStorageAdapter) return;
  const data = await window.SHDStorageAdapter.syncFromEmbeddedPcSeed();
  applyState(data.state);
  closeBackupModal();
  showToast("Pulled latest PC Seed into your active profile!");
}

async function createAndDownloadBackup() {
  const label = document.getElementById("backup-label-input")?.value || "Stash_Backup";
  if (window.SHDStorageAdapter && window.SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    const payload = {
      snapshot_label: label,
      created_at: new Date().toISOString(),
      item_count: APP_STATE.inventory.length,
      items: APP_STATE.inventory,
      saved_loadouts: APP_STATE.saved_loadouts,
      expertise: APP_STATE.expertise,
    };
    const filename = `shd_mobile_${label.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename} (${APP_STATE.inventory.length} items)!`);
    return;
  }

  const res = await fetch("/api/backup/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label }),
  });
  const data = await res.json();
  applyState(data.state);
  renderBackupModalContent();

  const blob = new Blob([JSON.stringify(data.payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = data.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showToast(`Saved & downloaded ${data.filename} (${data.item_count} items)!`);
}

async function restoreLocalSnapshot(filename, mode) {
  const res = await fetch(`/api/backup/restore-local/${encodeURIComponent(filename)}?mode=${mode}`, {
    method: "POST",
  });
  const data = await res.json();
  applyState(data.state);
  closeBackupModal();
  showToast(`Restored ${data.restored_count} items from ${filename}!`);
}

async function importBackupJsonFile(ev) {
  const file = ev.target.files?.[0];
  if (!file) return;

  if (window.SHDStorageAdapter && window.SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    const txt = await file.text();
    const parsed = JSON.parse(txt);
    const data = await window.SHDStorageAdapter.importSnapshotPayload(parsed, "replace");
    ev.target.value = "";
    applyState(data.state);
    closeBackupModal();
    showToast(`Imported & restored ${data.restored_count} items from ${file.name}!`);
    return;
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("mode", "replace");

  const res = await fetch("/api/backup/import-file", { method: "POST", body: fd });
  const data = await res.json();
  ev.target.value = "";
  applyState(data.state);
  closeBackupModal();
  showToast(`Imported & restored ${data.restored_count} items from ${file.name}!`);
}

async function submitShorthand() {
  const input = document.getElementById("shorthand-input");
  const loc = document.getElementById("shorthand-loc").value;
  const text = input.value.trim();
  if (!text) return;

  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.quickAdd(text, loc)
    : await (
        await fetch("/api/quick-add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shorthand: text, location: loc }),
        })
      ).json();
  input.value = "";
  applyState(data.state);
  showToast(`Added ${data.item.item_name} (${data.item.slot}) to ${data.item.location}!`);
}

async function deleteItemById(itemId) {
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.deleteItem(itemId)
    : await (await fetch(`/api/item/${itemId}`, { method: "DELETE" })).json();
  applyState(data.state);
  showToast("Removed item from inventory.");
}

async function triggerF9Capture() {
  if (window.SHDStorageAdapter && window.SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    showToast("F9 Screen Capture runs on PC (localhost:8420). Use Quick-Add or Vault Sync on mobile!");
    return;
  }
  showToast("Capturing screen Item Card via MSS...");
  const res = await fetch("/api/capture-f9", { method: "POST" });
  const data = await res.json();
  applyState(data.state);
  showToast(`Captured & Snapped: ${data.item.item_name} (${data.item.slot})`);
}

async function scanInboxNow() {
  if (window.SHDStorageAdapter && window.SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    showToast("Inbox folder watcher runs on PC. Use Vault Sync to pull your PC scans!");
    return;
  }
  const res = await fetch("/api/scan-inbox", { method: "POST" });
  const data = await res.json();
  applyState(data.state);
  const cnt = data.inbox_result?.imported_count || 0;
  showToast(cnt > 0 ? `Imported ${cnt} item(s) from inbox/!` : "Inbox scanned (no new files in d:\\_AI\\Div2\\inbox).");
}

async function handleFileUpload(ev) {
  const files = Array.from(ev.target.files || []);
  if (files.length === 0) return;
  let totalImported = 0;
  for (const file of files) {
    totalImported += await uploadMediaFile(file);
  }
  ev.target.value = "";
  showToast(`Batch Vision Pipeline imported ${totalImported} item(s) across ${files.length} file(s)!`);
}

async function uploadMediaFile(file) {
  if (window.SHDStorageAdapter && window.SHDStorageAdapter.getMode() !== "FASTAPI_PC") {
    showToast("Heavy OCR Vision runs on PC (localhost:8420) and syncs to Android Hub via Vault!");
    return 0;
  }
  showToast(`Processing ${file.name} through 6-Row Multi-Scanner...`);
  const fd = new FormData();
  fd.append("file", file);
  fd.append("location", document.getElementById("shorthand-loc").value || "STASH");

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  applyState(data.state);
  return data.imported_count || 0;
}

function openBuilderModal() {
  const modal = document.getElementById("builder-modal");
  const content = document.getElementById("builder-modal-content");
  const slotDefaults = {
    MASK: "Lengmo",
    CHEST: "The Sacrifice",
    BACKPACK: "Backbone",
    GLOVES: "Contractor's Gloves",
    HOLSTER: "Lengmo",
    KNEEPADS: "Turmoil",
  };

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:10px;margin-bottom:14px;">
      <div>
        <div style="font-size:11px;color:#10b981;font-weight:800;">SHD CUSTOM ARCHETYPE BUILDER</div>
        <div style="font-size:17px;font-weight:800;color:#ffffff;">Create &amp; Score a New Target Build Template</div>
      </div>
      <button class="btn-action" onclick="closeBuilderModal()">✕ Close</button>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-bottom:10px;">
      <div>
        <label style="font-size:11px;color:var(--text-muted);">Build Name</label>
        <input type="text" id="cb-name" placeholder="e.g. Lengmo Pestilence Turmoil LMG" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:6px 10px;border-radius:4px;">
      </div>
      <div>
        <label style="font-size:11px;color:var(--text-muted);">Specialization</label>
        <input type="text" id="cb-spec" value="Gunner" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:6px 10px;border-radius:4px;">
      </div>
    </div>

    <div style="margin-bottom:10px;">
      <label style="font-size:11px;color:var(--text-muted);">Build Summary / Synergy Notes</label>
      <input type="text" id="cb-summary" placeholder="Describe the key synergy, weapons, and playstyle..." style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:6px 10px;border-radius:4px;">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
      ${SLOTS_ORDER.map(
        (s) => `
        <div style="background:var(--bg-card);padding:8px 10px;border-radius:5px;border:1px solid var(--border);">
          <div style="font-weight:800;font-size:11px;color:var(--shd-orange);margin-bottom:4px;">${s} TARGET BRAND / NAMED / EXOTIC</div>
          <input type="text" id="cb-slot-${s}" value="${slotDefaults[s]}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;margin-bottom:4px;">
          <select id="cb-core-${s}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:4px;border-radius:4px;font-size:11px;">
            <option value="WEAPON_DAMAGE">🔴 Weapon Damage</option>
            <option value="ARMOR">🔵 Armor</option>
            <option value="SKILL_TIER">🟡 Skill Tier</option>
          </select>
        </div>
      `
      ).join("")}
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button class="btn-action" onclick="closeBuilderModal()">Cancel</button>
      <button class="btn-action btn-primary" onclick="saveCustomBuild()">➕ Save Build &amp; Score Stash</button>
    </div>
  `;
  modal.classList.add("open");
}

function closeBuilderModal() {
  document.getElementById("builder-modal").classList.remove("open");
}

async function saveCustomBuild() {
  const name = document.getElementById("cb-name").value.trim() || "Custom SHD Loadout";
  const spec = document.getElementById("cb-spec").value.trim() || "Gunner";
  const summary = document.getElementById("cb-summary").value.trim() || "Custom user-defined archetype.";
  const slots = {};
  SLOTS_ORDER.forEach((s) => {
    const brand = document.getElementById(`cb-slot-${s}`).value.trim() || "Lengmo";
    const core = document.getElementById(`cb-core-${s}`).value;
    slots[s] = {
      preferred: [brand],
      alt_brands: [],
      core: core,
      minors: ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"],
    };
  });

  const payload = { name, specialization: spec, summary, slots };
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.addCustomBuild(payload)
    : await (
        await fetch("/api/builds/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ).json();
  APP_STATE.selectedBuildId = data.build.build_id;
  applyState(data.state);
  closeBuilderModal();
  showToast(`Added custom build '${name}' and scored against your Armory!`);
}

// =========================================================================
// VIEW 2: INTERACTIVE BUILD WORKBENCH & SAVED LOADOUTS LOCKER
// =========================================================================

function createNewBlankWorkbench() {
  APP_STATE.activeWorkbench = {
    loadout_id: null,
    name: "New Custom SHD Loadout",
    specialization: "Gunner",
    primary_weapon: "Pestilence (Exotic LMG)",
    secondary_weapon: "Lexington (Named AR)",
    sidearm: "Orbit",
    skill_1: "Reviver Hive",
    skill_2: "Crusader Shield",
    notes: "Custom theorycrafted workbench build.",
    slots: {
      MASK: { item_name: "Lengmo Mask", brand_or_set: "Lengmo", core_type: "WEAPON_DAMAGE", core_val: 15.0, m1_stat: "CRITICAL_HIT_CHANCE", m1_val: 6.0, m2_stat: "CRITICAL_HIT_DAMAGE", m2_val: 12.0, talent: null, is_prototype: false },
      CHEST: { item_name: "The Sacrifice", brand_or_set: "Providence Defense", core_type: "WEAPON_DAMAGE", core_val: 15.0, m1_stat: "CRITICAL_HIT_CHANCE", m1_val: 6.0, m2_stat: "CRITICAL_HIT_DAMAGE", m2_val: 12.0, talent: "Perfect Glass Cannon", is_prototype: false },
      BACKPACK: { item_name: "Backbone", brand_or_set: "Lengmo", core_type: "WEAPON_DAMAGE", core_val: 22.5, m1_stat: "CRITICAL_HIT_CHANCE", m1_val: 9.0, m2_stat: "CRITICAL_HIT_DAMAGE", m2_val: 12.0, talent: "Perfect Unstoppable Force", is_prototype: true },
      GLOVES: { item_name: "Contractor's Gloves", brand_or_set: "Petrov Defense Group", core_type: "WEAPON_DAMAGE", core_val: 15.0, m1_stat: "DAMAGE_TO_ARMOR", m1_val: 8.0, m2_stat: "CRITICAL_HIT_DAMAGE", m2_val: 12.0, talent: null, is_prototype: false },
      HOLSTER: { item_name: "Lengmo Holster", brand_or_set: "Lengmo", core_type: "WEAPON_DAMAGE", core_val: 15.0, m1_stat: "CRITICAL_HIT_CHANCE", m1_val: 9.0, m2_stat: "CRITICAL_HIT_DAMAGE", m2_val: 12.0, talent: "Augment: Paradox", is_prototype: true },
      KNEEPADS: { item_name: "Turmoil", brand_or_set: "Česká Výroba s.r.o.", core_type: "WEAPON_DAMAGE", core_val: 22.5, m1_stat: "CRITICAL_HIT_CHANCE", m1_val: 9.0, m2_stat: "CRITICAL_HIT_DAMAGE", m2_val: 12.0, talent: "Turmoil (50% Shared Damage Split)", is_prototype: true },
    },
  };
  renderWorkbench();
}

function selectSavedLoadout(loadoutId) {
  const found = (APP_STATE.saved_loadouts || []).find((l) => l.loadout_id === loadoutId);
  if (found) {
    APP_STATE.activeWorkbench = JSON.parse(JSON.stringify(found));
    renderWorkbench();
    if (window.innerWidth <= 860) {
      switchMobileSubPanel("wb", "center");
    }
  }
}

function cloneAdminShowcaseLoadout(loadoutId) {
  const found = (APP_STATE.admin_showcase_loadouts || []).find((l) => l.loadout_id === loadoutId);
  if (!found) return;
  const copy = JSON.parse(JSON.stringify(found));
  copy.loadout_id = null;
  if (!copy.name.includes("(Clone)")) {
    copy.name = `${copy.name} (Clone)`;
  }
  APP_STATE.activeWorkbench = copy;
  renderWorkbench();
  if (window.innerWidth <= 860) {
    switchMobileSubPanel("wb", "center");
  }
  showToast(`Cloned Admin Showcase '${found.name}' into your Workbench! Click Save to keep it in your Locker.`);
}

function cloneMatrixBuildToWorkbench(buildId) {
  const b = (APP_STATE.solver.builds || []).find((x) => x.build_id === buildId);
  if (!b) return;
  const slots = {};
  SLOTS_ORDER.forEach((s) => {
    const sObj = b.slots[s];
    if (sObj && sObj.status !== "MISSING" && sObj.item) {
      const it = sObj.item;
      const m0 = (it.minor_attributes && it.minor_attributes[0]) || { stat: "CRITICAL_HIT_CHANCE", value: 6.0 };
      const m1 = (it.minor_attributes && it.minor_attributes[1]) || { stat: "CRITICAL_HIT_DAMAGE", value: 12.0 };
      slots[s] = {
        item_id: sObj.raw_item?.item_id,
        item_name: it.item_name,
        brand_or_set: it.brand_or_set,
        core_type: it.core_attribute?.type || "WEAPON_DAMAGE",
        core_val: it.core_attribute?.value ?? 15.0,
        m1_stat: m0.stat,
        m1_val: m0.value,
        m2_stat: m1.stat,
        m2_val: m1.value,
        talent: it.talent?.name || null,
        is_prototype: (it.core_attribute?.value || 0) > 15.0 || m0.value > 6.0,
      };
    } else {
      const targetBrand = sObj?.target_brand || "Lengmo";
      slots[s] = {
        item_name: `${targetBrand} ${s.charAt(0) + s.slice(1).toLowerCase()} (Wishlist)`,
        brand_or_set: targetBrand,
        core_type: sObj?.target_core || "WEAPON_DAMAGE",
        core_val: 15.0,
        m1_stat: "CRITICAL_HIT_CHANCE",
        m1_val: 6.0,
        m2_stat: "CRITICAL_HIT_DAMAGE",
        m2_val: 12.0,
        talent: sObj?.target_talent || null,
        is_prototype: false,
      };
    }
  });

  APP_STATE.activeWorkbench = {
    loadout_id: null,
    name: `${b.name} (Workbench Copy)`,
    specialization: b.specialization.split(" (")[0],
    primary_weapon: b.primary_weapons[0] || "St. Elmo's Engine",
    secondary_weapon: b.primary_weapons[1] || "ACS-12",
    sidearm: "Orbit",
    skill_1: "Reviver Hive",
    skill_2: "Crusader Shield",
    notes: b.summary,
    slots,
  };
  switchView("workbench");
  renderWorkbench();
  showToast(`Loaded '${b.name}' into the Interactive Workbench!`);
}

function renderWorkbench() {
  const listEl = document.getElementById("workbench-loadout-list");
  const centerEl = document.getElementById("workbench-center-canvas");
  const rightEl = document.getElementById("workbench-live-telemetry");
  if (!listEl || !centerEl || !rightEl) return;

  if (!APP_STATE.activeWorkbench) {
    createNewBlankWorkbench();
  }
  const wb = APP_STATE.activeWorkbench;

  // 1. Left Column: Saved Loadouts Locker + Admin Showcase Loadouts
  const personalHtml =
    (APP_STATE.saved_loadouts || []).length > 0
      ? (APP_STATE.saved_loadouts || [])
          .map((ld) => {
            const isSel = wb.loadout_id === ld.loadout_id;
            return `
        <div class="build-item ${isSel ? "selected" : ""}" onclick="selectSavedLoadout('${ld.loadout_id}')">
          <div class="build-item-top">
            <div class="build-name">🛡️ ${ld.name}</div>
            <button class="btn-action" style="padding:1px 6px;font-size:10px;border-color:#ef4444;color:#fca5a5;" onclick="event.stopPropagation();deleteSavedLoadoutById('${ld.loadout_id}')">✕</button>
          </div>
          <div style="color:var(--shd-orange);font-size:11px;font-weight:700;margin-top:3px;">${ld.specialization} // ${ld.primary_weapon}</div>
          <div style="color:var(--text-muted);font-size:11px;margin-top:3px;">${(ld.notes || "").slice(0, 75)}...</div>
        </div>
      `;
          })
          .join("")
      : `<div style="padding:10px;background:var(--bg-card);border:1px dashed var(--border);border-radius:6px;color:var(--text-muted);font-size:11.5px;margin-bottom:10px;">Your personal Locker is empty. Clone an Admin Showcase build below or click <strong>💾 Save to Locker</strong>!</div>`;

  const showcaseHtml =
    (APP_STATE.admin_showcase_loadouts || []).length > 0
      ? `
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);">
          <div style="font-size:10.5px;font-weight:800;color:#fbbf24;letter-spacing:0.6px;margin-bottom:6px;">
            👑 ADMIN SHOWCASE LOCKER (READ-ONLY // 1-TAP CLONE)
          </div>
          ${(APP_STATE.admin_showcase_loadouts || [])
            .map(
              (sh) => `
            <div class="build-item" style="border-left:3px solid #f59e0b;background:rgba(245,158,11,0.06);">
              <div class="build-item-top">
                <div class="build-name" style="color:#fde68a;">👑 ${sh.name}</div>
              </div>
              <div style="color:var(--shd-orange);font-size:11px;font-weight:700;margin-top:3px;">${sh.specialization} // ${sh.primary_weapon}</div>
              <div style="color:var(--text-muted);font-size:11px;margin-top:3px;margin-bottom:6px;">${(sh.notes || "").slice(0, 85)}...</div>
              <button class="btn-action" style="width:100%;border-color:#f59e0b;color:#fde68a;font-size:11px;" onclick="cloneAdminShowcaseLoadout('${sh.loadout_id}')">
                📥 Clone Showcase to Workbench
              </button>
            </div>
          `
            )
            .join("")}
        </div>
      `
      : "";

  listEl.innerHTML = personalHtml + showcaseHtml;

  // 2. Center Column: Interactive 6-Gear + Weapons + Spec Canvas
  const slotsHtml = SLOTS_ORDER.map((s) => {
    const sl = wb.slots[s] || {};
    const cLabel =
      sl.core_type === "WEAPON_DAMAGE"
        ? `🔴 +${sl.core_val}% Weapon Damage`
        : sl.core_type === "ARMOR"
        ? `🔵 +${Number(sl.core_val).toLocaleString()} Armor`
        : `🟡 +1 Skill Tier`;
    const protoBadge = sl.is_prototype
      ? `<span class="status-badge" style="background:rgba(168,85,247,0.22);color:#d8b4fe;border:1px solid #a855f7;">PROTOTYPE</span>`
      : `<span style="color:#38bdf8;font-size:10px;">CLICK TO SWAP</span>`;

    return `
      <div class="slot-card" style="border-top:3px solid ${sl.is_prototype ? "#a855f7" : "var(--shd-orange)"};" onclick="openSlotPickerModal('${s}')">
        <div class="slot-head">
          <span>${s}</span>
          ${protoBadge}
        </div>
        <div class="slot-title">${sl.item_name || s}</div>
        <div class="slot-brand">${sl.brand_or_set || "Select Brand"}</div>
        <div class="stat-line" style="font-weight:700;"><span>${cLabel}</span></div>
        <div class="stat-line"><span>&bull; +${sl.m1_val}% ${(sl.m1_stat || "").replace(/_/g, " ")}</span></div>
        ${sl.m2_stat ? `<div class="stat-line"><span>&bull; +${sl.m2_val}% ${(sl.m2_stat || "").replace(/_/g, " ")}</span></div>` : ""}
        ${sl.talent ? `<div style="margin-top:5px;font-size:11px;color:#fbbf24;font-weight:700;">★ ${sl.talent}</div>` : ""}
      </div>
    `;
  }).join("");

  centerEl.innerHTML = `
    <div style="background:#121a2b;border:1px solid var(--border);border-radius:6px;padding:10px 12px;margin-bottom:10px;">
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:8px;margin-bottom:8px;">
        <div>
          <label style="font-size:10.5px;color:var(--text-muted);font-weight:700;">LOADOUT NAME</label>
          <input type="text" id="wb-input-name" value="${wb.name}" oninput="APP_STATE.activeWorkbench.name=this.value" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;font-weight:700;">
        </div>
        <div>
          <label style="font-size:10.5px;color:var(--text-muted);font-weight:700;">SPECIALIZATION</label>
          <select id="wb-input-spec" onchange="APP_STATE.activeWorkbench.specialization=this.value;renderWorkbench()" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
            ${["Gunner", "Technician", "Firewall", "Sharpshooter", "Survivalist", "Demolitionist"]
              .map((sp) => `<option value="${sp}" ${wb.specialization === sp ? "selected" : ""}>${sp}</option>`)
              .join("")}
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;">
        <div>
          <label style="font-size:10.5px;color:var(--text-muted);">PRIMARY WEAPON</label>
          <input type="text" value="${wb.primary_weapon || ""}" oninput="APP_STATE.activeWorkbench.primary_weapon=this.value" style="width:100%;background:#070a10;border:1px solid var(--border);color:#ff9e44;padding:5px 8px;border-radius:4px;font-size:11.5px;font-weight:700;">
        </div>
        <div>
          <label style="font-size:10.5px;color:var(--text-muted);">SECONDARY WEAPON</label>
          <input type="text" value="${wb.secondary_weapon || ""}" oninput="APP_STATE.activeWorkbench.secondary_weapon=this.value" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;font-size:11.5px;">
        </div>
        <div>
          <label style="font-size:10.5px;color:var(--text-muted);">SKILLS (1 &amp; 2)</label>
          <input type="text" value="${wb.skill_1 || "Reviver Hive"} / ${wb.skill_2 || "Pulse"}" oninput="const p=this.value.split('/');APP_STATE.activeWorkbench.skill_1=(p[0]||'').trim();APP_STATE.activeWorkbench.skill_2=(p[1]||'').trim();" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fde047;padding:5px 8px;border-radius:4px;font-size:11.5px;">
        </div>
      </div>

      <div>
        <label style="font-size:10.5px;color:var(--text-muted);">BUILD NOTES &amp; SYNERGY</label>
        <input type="text" value="${wb.notes || ""}" oninput="APP_STATE.activeWorkbench.notes=this.value" style="width:100%;background:#070a10;border:1px solid var(--border);color:#cbd5e1;padding:5px 8px;border-radius:4px;font-size:11.5px;">
      </div>
    </div>

    <div class="slots-grid">${slotsHtml}</div>
  `;

  // 3. Right Column: Live Set Bonus & Telemetry Calculator
  const brandCounts = {};
  let hasNinjabike = false;
  let cores = { RED: 0, BLUE: 0, YELLOW: 0 };
  let chc = 10.0; // SHD Watch
  let chd = 45.0; // Base + Watch
  let awd = 10.0; // Watch
  let dta = 0.0;
  let dttooc = 10.0; // Weapon native
  let armor = 726000;

  if (wb.specialization === "Technician") cores.YELLOW += 1;

  SLOTS_ORDER.forEach((s) => {
    const sl = wb.slots[s];
    if (!sl) return;
    const bName = sl.brand_or_set || "";
    if (bName.toLowerCase().includes("ninjabike")) {
      hasNinjabike = true;
      cores.RED += 1;
      cores.BLUE += 1;
      cores.YELLOW += 1;
      awd += 15.0;
      armor += 170000;
    } else if (bName.toLowerCase().includes("memento")) {
      cores.RED += 1;
      cores.BLUE += 1;
      cores.YELLOW += 1;
      awd += 15.0;
      armor += 170000;
    } else {
      brandCounts[bName] = (brandCounts[bName] || 0) + 1;
      if (sl.core_type === "WEAPON_DAMAGE") {
        cores.RED += 1;
        awd += parseFloat(sl.core_val || 15.0);
      } else if (sl.core_type === "ARMOR") {
        cores.BLUE += 1;
        armor += parseFloat(sl.core_val || 170000);
      } else {
        cores.YELLOW += 1;
      }
    }

    [
      { stat: sl.m1_stat, val: parseFloat(sl.m1_val || 0) },
      { stat: sl.m2_stat, val: parseFloat(sl.m2_val || 0) },
    ].forEach((m) => {
      if (m.stat === "CRITICAL_HIT_CHANCE") chc += m.val;
      if (m.stat === "CRITICAL_HIT_DAMAGE") chd += m.val;
      if (m.stat === "DAMAGE_TO_ARMOR") dta += m.val;
      if (m.stat === "DTTOOC") dttooc += m.val;
    });
  });

  // Resolve active Brand & Gear Set bonuses
  const activeBonusLines = [];
  Object.entries(brandCounts).forEach(([bName, rawCnt]) => {
    const effCnt = hasNinjabike ? rawCnt + 1 : rawCnt;
    const gs = (APP_STATE.canonical.gear_sets || []).find((g) => g.name.toLowerCase() === bName.toLowerCase());
    const bs = (APP_STATE.canonical.brand_sets || []).find((b) => b.name.toLowerCase() === bName.toLowerCase());

    if (gs) {
      [2, 3, 4].forEach((tier) => {
        if (effCnt >= tier && gs.bonuses?.[String(tier)]) {
          activeBonusLines.push(`<div class="recipe-step" style="border-left-color:#10b981;"><strong>${gs.name} (${tier}/4):</strong> ${gs.bonuses[String(tier)]}</div>`);
        }
      });
    } else if (bs) {
      [1, 2, 3].forEach((tier) => {
        if (effCnt >= tier && bs.bonuses?.[String(tier)]) {
          activeBonusLines.push(`<div class="recipe-step"><strong>${bs.name} (${tier}/3):</strong> ${bs.bonuses[String(tier)]}</div>`);
          if (bs.name.includes("Česká") && tier === 1) chc += 8.0;
          if (bs.name.includes("Grupo") && tier === 1) chd += 13.0;
        }
      });
    }
  });

  // Add 3 Gear Mods (+6% CHC / +24% CHD)
  const finalChc = Math.min(60.0, Math.round((chc + 6.0) * 10) / 10);
  const finalChd = Math.round((chd + 24.0) * 10) / 10;

  rightEl.innerHTML = `
    <div class="core-pills">
      <div class="core-box core-red">${cores.RED} RED</div>
      <div class="core-box core-blue">${cores.BLUE} BLUE</div>
      <div class="core-box core-yellow">${cores.YELLOW} YLW</div>
    </div>

    <div class="telemetry-row">
      <span style="color:var(--text-muted);">All Weapon Damage (w/ Cores)</span>
      <strong style="color:#ffffff;font-size:13.5px;">+${awd.toFixed(1)}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Crit Hit Chance (60% Cap)</span>
      <strong style="color:#34d399;">${finalChc}% ${chc + 6 > 60 ? "(CAPPED)" : ""}</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Crit Hit Damage (w/ Mods)</span>
      <strong style="color:var(--shd-orange);">${finalChd}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Damage to Armor (DTA)</span>
      <strong>+${dta.toFixed(1)}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">DMG to Target Out of Cover</span>
      <strong>+${dttooc.toFixed(1)}%</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Total Armor (Est.)</span>
      <strong style="color:#60a5fa;">${(armor / 1000000).toFixed(2)}M</strong>
    </div>

    <div style="margin-top:14px;margin-bottom:6px;font-weight:800;font-size:11px;color:var(--shd-orange);text-transform:uppercase;">
      ⚡ ACTIVE BRAND &amp; GEAR SET BONUSES ${hasNinjabike ? "(+1 NINJABIKE)" : ""}
    </div>
    ${activeBonusLines.join("") || `<div style="color:var(--text-muted);font-size:11.5px;">Click any slot card in the center panel to equip owned items or theorycraft brands.</div>`}
  `;
}

function openSlotPickerModal(slotKey) {
  const modal = document.getElementById("slot-picker-modal");
  const content = document.getElementById("slot-picker-content");
  const cur = APP_STATE.activeWorkbench?.slots?.[slotKey] || {};
  const ownedForSlot = (APP_STATE.inventory || []).filter((it) => it.slot === slotKey);

  const ownedHtml =
    ownedForSlot.length > 0
      ? ownedForSlot
          .map(
            (it) => `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-card);border:1px solid var(--border);padding:7px 10px;border-radius:5px;margin-bottom:5px;">
          <div>
            <div style="font-weight:700;color:#fff;">${it.item_name} <span style="color:var(--shd-orange);font-size:11px;">(${it.brand_or_set})</span></div>
            <div style="font-size:11px;color:var(--text-muted);">${formatCoreStat(it.core_attribute)} | ${(it.minor_attributes || []).map(formatMinorStat).join(", ")}</div>
          </div>
          <button class="btn-action btn-primary" onclick="equipOwnedItemToWorkbench('${slotKey}', '${it.item_id}')">Equip from Armory</button>
        </div>
      `
          )
          .join("")
      : `<div style="color:var(--text-muted);font-size:11.5px;padding:8px;">No owned ${slotKey} items in Armory yet — configure a Theorycraft piece below or load Demo Stash!</div>`;

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:10px;margin-bottom:12px;">
      <div>
        <div style="font-size:11px;color:var(--shd-orange);font-weight:800;">WORKBENCH SLOT CONFIGURATOR // ${slotKey}</div>
        <div style="font-size:16px;font-weight:800;color:#ffffff;">Pick From Your Armory OR Configure a Theorycraft Piece</div>
      </div>
      <button class="btn-action" onclick="closeSlotPickerModal()">✕ Close</button>
    </div>

    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:800;color:#34d399;margin-bottom:6px;">1. EQUIP OWNED ${slotKey} FROM YOUR ARMORY (${ownedForSlot.length} AVAILABLE)</div>
      <div style="max-height:175px;overflow-y:auto;">${ownedHtml}</div>
    </div>

    <div style="background:#121a2b;border:1px solid var(--border);border-radius:6px;padding:12px;">
      <div style="font-size:11px;font-weight:800;color:#a855f7;margin-bottom:8px;">2. CUSTOMIZE / THEORYCRAFT ${slotKey} STATS &amp; PROTOTYPE ROLLS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Item Name</label>
          <input type="text" id="sp-name" value="${cur.item_name || slotKey}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
        </div>
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Brand / Gear Set</label>
          <input type="text" id="sp-brand" value="${cur.brand_or_set || "Lengmo"}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;">
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Core Type</label>
          <select id="sp-core-type" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px;border-radius:4px;">
            <option value="WEAPON_DAMAGE" ${cur.core_type === "WEAPON_DAMAGE" ? "selected" : ""}>🔴 Weapon Damage</option>
            <option value="ARMOR" ${cur.core_type === "ARMOR" ? "selected" : ""}>🔵 Armor</option>
            <option value="SKILL_TIER" ${cur.core_type === "SKILL_TIER" ? "selected" : ""}>🟡 Skill Tier</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Core Value (15 or 22.5 Proto)</label>
          <input type="number" step="0.5" id="sp-core-val" value="${cur.core_val ?? 15.0}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
        </div>
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Talent / Augment</label>
          <input type="text" id="sp-talent" value="${cur.talent || ""}" placeholder="e.g. Obliterate or Paradox" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Minor 1 Value (% CHC / DTA / DTTOOC)</label>
          <input type="number" step="0.5" id="sp-m1-val" value="${cur.m1_val ?? 6.0}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
        </div>
        <div>
          <label style="font-size:11px;color:var(--text-muted);">Minor 2 Value (% CHD)</label>
          <input type="number" step="0.5" id="sp-m2-val" value="${cur.m2_val ?? 12.0}" style="width:100%;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;">
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button class="btn-action btn-primary" onclick="applyTheorycraftSlot('${slotKey}')">✔ Apply to Workbench</button>
      </div>
    </div>
  `;
  modal.classList.add("open");
}

function closeSlotPickerModal() {
  document.getElementById("slot-picker-modal").classList.remove("open");
}

function equipOwnedItemToWorkbench(slotKey, itemId) {
  const it = (APP_STATE.inventory || []).find((x) => x.item_id === itemId);
  if (!it) return;
  const m0 = (it.minor_attributes && it.minor_attributes[0]) || { stat: "CRITICAL_HIT_CHANCE", value: 6.0 };
  const m1 = (it.minor_attributes && it.minor_attributes[1]) || { stat: "CRITICAL_HIT_DAMAGE", value: 12.0 };
  APP_STATE.activeWorkbench.slots[slotKey] = {
    item_id: it.item_id,
    item_name: it.item_name,
    brand_or_set: it.brand_or_set,
    core_type: it.core_attribute?.type || "WEAPON_DAMAGE",
    core_val: it.core_attribute?.value ?? 15.0,
    m1_stat: m0.stat,
    m1_val: m0.value,
    m2_stat: m1.stat,
    m2_val: m1.value,
    talent: it.talent?.name || null,
    is_prototype: (it.core_attribute?.value || 0) > 15.0 || m0.value > 6.0,
  };
  closeSlotPickerModal();
  renderWorkbench();
}

function applyTheorycraftSlot(slotKey) {
  const cVal = parseFloat(document.getElementById("sp-core-val").value || "15.0");
  const m1Val = parseFloat(document.getElementById("sp-m1-val").value || "6.0");
  const m2Val = parseFloat(document.getElementById("sp-m2-val").value || "12.0");
  APP_STATE.activeWorkbench.slots[slotKey] = {
    item_name: document.getElementById("sp-name").value.trim(),
    brand_or_set: document.getElementById("sp-brand").value.trim(),
    core_type: document.getElementById("sp-core-type").value,
    core_val: cVal,
    m1_stat: "CRITICAL_HIT_CHANCE",
    m1_val: m1Val,
    m2_stat: "CRITICAL_HIT_DAMAGE",
    m2_val: m2Val,
    talent: document.getElementById("sp-talent").value.trim() || null,
    is_prototype: cVal > 15.0 || m1Val > 6.0,
  };
  closeSlotPickerModal();
  renderWorkbench();
}

async function saveActiveWorkbenchLoadout() {
  if (!APP_STATE.activeWorkbench) return;
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.saveLoadout(APP_STATE.activeWorkbench)
    : await (
        await fetch("/api/loadouts/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(APP_STATE.activeWorkbench),
        })
      ).json();
  APP_STATE.activeWorkbench = data.loadout;
  applyState(data.state);
  showToast(`Saved '${data.loadout.name}' to your Loadouts Locker (Equipped items protected from Deconstruct)!`);
}

async function deleteSavedLoadoutById(loadoutId) {
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.deleteLoadout(loadoutId)
    : await (await fetch(`/api/loadouts/${loadoutId}`, { method: "DELETE" })).json();
  APP_STATE.activeWorkbench = null;
  applyState(data.state);
  showToast("Removed loadout from Locker.");
}

// =========================================================================
// VIEW 4: EXPERTISE 413/500 MASTERY & RESEARCH TRACKER
// =========================================================================

function renderExpertiseTracker() {
  const exp = APP_STATE.expertise || { expertise_level: 30, total_proficient: 413, total_items: 500, missing_count: 87, categories: [], items: [] };
  const leftEl = document.getElementById("expertise-left-summary");
  const centerEl = document.getElementById("expertise-category-grid");
  const rightEl = document.getElementById("expertise-item-tracker");
  if (!leftEl || !centerEl || !rightEl) return;

  document.getElementById("exp-cat-header-count").textContent =
    `${exp.total_proficient} / ${exp.total_items} PROFICIENT (${exp.missing_count} TO MAX)`;

  const pctOverall = ((exp.total_proficient / Math.max(1, exp.total_items)) * 100).toFixed(1);

  leftEl.innerHTML = `
    <div style="text-align:center;padding:16px 10px;background:#0b101b;border:1px solid var(--border);border-radius:8px;margin-bottom:12px;">
      <div style="width:118px;height:118px;border-radius:50%;border:4px solid var(--shd-orange);margin:0 auto 10px auto;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(255,107,0,0.25);">
        <div style="font-size:32px;font-weight:900;color:var(--shd-orange);line-height:1;">${exp.expertise_level}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">0 / 90</div>
      </div>
      <div style="color:var(--shd-orange);font-weight:800;font-size:12px;letter-spacing:1px;">COMPLETED</div>
    </div>

    <div style="background:var(--bg-card);border-left:4px solid var(--shd-orange);padding:12px 14px;border-radius:5px;margin-bottom:12px;">
      <div style="font-size:12px;color:var(--text-muted);">Account Proficiency Progress</div>
      <div style="font-size:24px;font-weight:900;color:#ffffff;margin-top:2px;">${exp.total_proficient} / ${exp.total_items}</div>
      <div class="progress-row" style="margin-top:6px;">
        <div class="progress-track"><div class="progress-fill" style="width:${pctOverall}%;background:var(--shd-orange);"></div></div>
        <span style="font-weight:800;color:var(--shd-orange);">${pctOverall}%</span>
      </div>
    </div>

    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Remaining Non-Proficient</span>
      <strong style="color:#fbbf24;">${exp.missing_count} Items</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">100% Gold Categories</span>
      <strong style="color:#34d399;">${(exp.categories || []).filter((c) => c.proficient >= c.total).length} / ${(exp.categories || []).length}</strong>
    </div>
    <div class="telemetry-row">
      <span style="color:var(--text-muted);">Est. Printer Filament to 500</span>
      <strong style="color:#38bdf8;">~${Number(exp.estimated_filament_to_max || 0).toLocaleString()}</strong>
    </div>

    <div style="margin-top:14px;padding:10px;background:#121a2b;border:1px solid var(--border);border-radius:6px;font-size:11.5px;color:#cbd5e1;">
      <strong style="color:var(--shd-orange);">📸 Auto-OCR Expertise Sync:</strong><br>
      Press <code>Ctrl+V</code> or click <strong>📂 Upload Shots</strong> with a screenshot of your in-game <em>Select Category to Research</em> or <em>Select Item To Research</em> screen and the vision parser will update your category &amp; item counts automatically!
    </div>
  `;

  // Center Column: Group categories by group name (Weapons, Named & Exotic Gear, Brands/Sets/Skills)
  const groups = ["Weapons", "Named & Exotic Gear", "Brands, Gear Sets & Skills"];
  centerEl.innerHTML = groups
    .map((gName) => {
      const cats = (exp.categories || []).filter((c) => c.group === gName);
      const cardsHtml = cats
        .map((c) => {
          const isMax = c.proficient >= c.total;
          const borderCol = isMax ? "#10b981" : "var(--shd-orange)";
          return `
          <div class="slot-card" style="border-top:3px solid ${borderCol};padding:9px 11px;">
            <div class="slot-head">
              <span>${c.name}</span>
              <span style="color:${isMax ? "#34d399" : "#fbbf24"};">${isMax ? "✔ MAXED" : `${c.missing} LEFT`}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:4px;">
              <div style="font-size:18px;font-weight:900;color:#ffffff;">${c.proficient}/${c.total}</div>
              <div style="display:flex;gap:4px;">
                <button class="btn-action" style="padding:2px 7px;" onclick="adjustExpertiseCat('${c.category_id}', ${Math.max(0, c.proficient - 1)}, ${c.total})">-</button>
                <button class="btn-action btn-primary" style="padding:2px 7px;" onclick="adjustExpertiseCat('${c.category_id}', ${Math.min(c.total, c.proficient + 1)}, ${c.total})">+</button>
              </div>
            </div>
            <div class="progress-row" style="margin-top:6px;">
              <div class="progress-track"><div class="progress-fill" style="width:${c.pct}%;background:${borderCol};"></div></div>
              <span style="font-size:10.5px;color:var(--text-muted);">${c.pct}%</span>
            </div>
          </div>
        `;
        })
        .join("");

      return `
        <div style="margin-bottom:14px;">
          <div style="font-size:11.5px;font-weight:800;color:var(--shd-orange);text-transform:uppercase;margin-bottom:6px;border-bottom:1px solid var(--border);padding-bottom:3px;">${gName}</div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">${cardsHtml}</div>
        </div>
      `;
    })
    .join("");

  // Right Column: Item Research Checklist & Quick Add
  const itemsHtml = (exp.items || [])
    .map((it) => {
      const badge = it.is_proficient
        ? `<span class="status-badge st-ready">PROFICIENT (10/10)</span>`
        : `<span class="status-badge st-tinker">RANK ${it.rank}/10 (${it.filament_needed} FILAMENT)</span>`;
      return `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-left:3px solid ${it.is_proficient ? "#10b981" : "#f59e0b"};padding:8px 10px;border-radius:5px;margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:#ffffff;">${it.name}</strong>
            ${badge}
          </div>
          <div style="font-size:11px;color:var(--shd-orange);margin-top:2px;">Category: ${it.category} ${it.upgrade_grade ? `// Grade ${it.upgrade_grade}` : ""}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${it.acquisition_source}</div>
        </div>
      `;
    })
    .join("");

  rightEl.innerHTML = `
    <div style="background:#121a2b;border:1px solid var(--border);border-radius:6px;padding:9px;margin-bottom:10px;">
      <div style="font-size:11px;font-weight:800;color:var(--shd-orange);margin-bottom:6px;">+ LOG CHASE ITEM TO RESEARCH</div>
      <div style="display:grid;grid-template-columns:1fr 95px;gap:6px;margin-bottom:6px;">
        <input type="text" id="exp-item-name" placeholder="Item name (e.g. Ouroboros)" style="background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;font-size:11.5px;">
        <input type="number" id="exp-item-rank" min="0" max="10" value="0" placeholder="Rank 0-10" style="background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;font-size:11.5px;">
      </div>
      <div style="display:flex;gap:6px;">
        <input type="text" id="exp-item-cat" placeholder="Category (e.g. SMGs)" value="Rifles" style="flex:1;background:#070a10;border:1px solid var(--border);color:#fff;padding:5px 8px;border-radius:4px;font-size:11.5px;">
        <button class="btn-action btn-primary" onclick="addExpertiseItemManual()">+ Track</button>
      </div>
    </div>
    <div>${itemsHtml}</div>
  `;
}

async function adjustExpertiseCat(categoryId, newProf, total) {
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.updateExpertiseCat(categoryId, newProf, total)
    : await (
        await fetch("/api/expertise/category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_id: categoryId, proficient: newProf, total }),
        })
      ).json();
  applyState(data.state);
}

async function addExpertiseItemManual() {
  const name = document.getElementById("exp-item-name")?.value.trim();
  const rank = parseInt(document.getElementById("exp-item-rank")?.value || "0", 10);
  const category = document.getElementById("exp-item-cat")?.value.trim() || "Rifles";
  if (!name) return;

  const payload = {
    name,
    category,
    rank,
    is_proficient: rank >= 10,
    acquisition_source: rank >= 10 ? "Proficient" : `Donate ${(10 - rank) * 30} Printer Filament or Target Loot`,
  };
  const data = window.SHDStorageAdapter
    ? await window.SHDStorageAdapter.upsertExpertiseItem(payload)
    : await (
        await fetch("/api/expertise/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ).json();
  applyState(data.state);
  showToast(`Logged '${name}' (Rank ${rank}/10) to Expertise Tracker!`);
}

// Global Keyboard Shortcuts (Ctrl+1..6 Views + Ctrl+V Screenshot Paste)
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "1") { e.preventDefault(); switchView("matrix"); }
  if (e.ctrlKey && e.key === "2") { e.preventDefault(); switchView("workbench"); }
  if (e.ctrlKey && e.key === "3") { e.preventDefault(); switchView("armory"); }
  if (e.ctrlKey && e.key === "4") { e.preventDefault(); switchView("expertise"); }
  if (e.ctrlKey && e.key === "5") { e.preventDefault(); switchView("radar"); }
  if (e.ctrlKey && e.key === "6") { e.preventDefault(); switchView("decon"); }
  if (e.ctrlKey && e.key.toLowerCase() === "i") { e.preventDefault(); scanInboxNow(); }
  if (e.key === "Escape") { closeVerifyModal(); closeBackupModal(); closeBuilderModal(); closeSlotPickerModal(); }
});

window.addEventListener("paste", async (e) => {
  const items = e.clipboardData?.items || [];
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const blob = item.getAsFile();
      if (blob) {
        await uploadMediaFile(blob);
      }
    }
  }
});

window.addEventListener("DOMContentLoaded", fetchInitialState);
