/**
 * app.js — RollupOS Mobile Controller for Lightning Garage (2023 F-150 Lightning ER Lariat)
 * Uses RollupBridge.storage for isolated per-user persistence + GarageEngine for deterministic math.
 */
(function (global) {
  'use strict';

  const APP_ID = 'lightning-garage';
  global.ROLLUP_APP_ID = APP_ID;

  const BUNDLE = global.LIGHTNING_GARAGE_BUNDLE || {
    entries: [],
    ford_modules: {},
    ford_fcodes: {},
    module_editorial: {},
    default_profile: {}
  };

  // --- State Keys in RollupBridge.storage ---
  const KEY_PROFILE = 'truck_profile';
  const KEY_MOD_OVERRIDES = 'mod_overrides'; // { [id]: { status, wanted, verified_on_my_truck, user_notes } }
  const KEY_BACKUPS = 'backups_list';        // Array of parsed backup objects
  const KEY_CHANGE_LOG = 'change_log';

  let state = {
    activeTab: 'truck',
    profile: null,
    modOverrides: {},
    backups: [],
    changeLog: [],
    modFilters: {
      search: '',
      chip: 'popular', // 'all' | 'popular' | 'wanted' | 'ready' | 'approved' | 'ev_safe'
      module: 'ALL',
      tier: 'ALL'
    },
    moduleFilter: 'ALL', // 'ALL' | 'MODDABLE' | 'PRESENT' | 'CRITICAL'
    selectedModId: null
  };

  function showToast(msg, isError = false) {
    const el = document.getElementById('toast-banner');
    if (!el) return;
    el.textContent = msg;
    el.style.background = isError ? '#7f1d1d' : '#0f172a';
    el.style.borderColor = isError ? '#ef4444' : '#38bdf8';
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- Initialization & Storage Hydration ---
  function loadState() {
    const cfg = (global.RollupBridge && RollupBridge.user.getAppConfig(APP_ID)) || {};
    const savedProfile = (global.RollupBridge && RollupBridge.storage.get(KEY_PROFILE, null, APP_ID)) || null;
    const defProf = BUNDLE.default_profile || {};

    state.profile = {
      vin: (savedProfile && savedProfile.vin) || cfg.default_vin || defProf.vin || '1FT6W1EV4PWG11434',
      model_year: Number((savedProfile && savedProfile.model_year) || defProf.model_year || 2023),
      model: (savedProfile && savedProfile.model) || defProf.model || 'F-150 Lightning',
      trim: (savedProfile && savedProfile.trim) || cfg.default_trim || defProf.trim || 'Lariat',
      battery: (savedProfile && savedProfile.battery) || cfg.default_battery || defProf.battery || 'Extended Range (131 kWh)',
      options: (savedProfile && savedProfile.options) || defProf.options || '511A, Max Trailer Tow, Tow Tech, BlueCruise, Pro Power 9.6kW',
      adapter: (savedProfile && savedProfile.adapter) || defProf.adapter || 'OBDLink EX',
      forscan_license: (savedProfile && savedProfile.forscan_license) || defProf.forscan_license || 'Extended License',
      odometer: (savedProfile && savedProfile.odometer) || defProf.odometer || '',
      vin_online: (savedProfile && savedProfile.vin_online) || null
    };

    // Seed default popular wanted/approved overrides on first launch if empty
    const savedOverrides = (global.RollupBridge && RollupBridge.storage.get(KEY_MOD_OVERRIDES, null, APP_ID)) || null;
    if (savedOverrides) {
      state.modOverrides = savedOverrides;
    } else {
      state.modOverrides = {};
      // Pre-star the top 3-star community favorites as Wanted for convenience
      (BUNDLE.entries || []).forEach((e) => {
        if (e.popularity >= 3 && e.tier <= 2 && e.ev_status !== 'ICE_ONLY') {
          state.modOverrides[e.id] = {
            status: 'APPROVED',
            wanted: 1,
            verified_on_my_truck: 0,
            user_notes: ''
          };
        }
      });
      saveModOverrides();
    }

    state.backups = (global.RollupBridge && RollupBridge.storage.get(KEY_BACKUPS, [], APP_ID)) || [];
    state.changeLog = (global.RollupBridge && RollupBridge.storage.get(KEY_CHANGE_LOG, [], APP_ID)) || [];
  }

  function saveProfile() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(KEY_PROFILE, state.profile, APP_ID);
    }
  }

  function saveModOverrides() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(KEY_MOD_OVERRIDES, state.modOverrides, APP_ID);
    }
  }

  function saveBackups() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(KEY_BACKUPS, state.backups, APP_ID);
    }
  }

  // --- Merged View of Current As-Built State & Entries ---
  function getMergedTruckState() {
    const merged = {};
    // Apply FORSCAN_BACKUP files in chronological order
    state.backups
      .filter((b) => b.kind === 'FORSCAN_BACKUP')
      .forEach((b) => {
        Object.assign(merged, b.dict || {});
      });
    // If no FORSCAN_BACKUP yet, fall back to FORD_AB factory baseline if imported
    if (Object.keys(merged).length === 0) {
      state.backups
        .filter((b) => b.kind === 'FORD_AB')
        .forEach((b) => {
          Object.assign(merged, b.dict || {});
        });
    }
    return merged;
  }

  function getFactoryState() {
    const merged = {};
    const nodes = {};
    state.backups
      .filter((b) => b.kind === 'FORD_AB')
      .forEach((b) => {
        Object.assign(merged, b.dict || {});
        Object.assign(nodes, b.nodes || {});
      });
    return { dict: merged, nodes };
  }

  function isSyntheticBaselineActive() {
    return state.backups.some((b) => b.is_synthetic);
  }

  function getHydratedEntries() {
    const truckState = getMergedTruckState();
    return (BUNDLE.entries || []).map((raw) => {
      const ov = state.modOverrides[raw.id] || {};
      const entry = {
        ...raw,
        status: ov.status || raw.status || 'DRAFT',
        wanted: ov.wanted !== undefined ? ov.wanted : raw.wanted || 0,
        verified_on_my_truck: ov.verified_on_my_truck !== undefined ? ov.verified_on_my_truck : raw.verified_on_my_truck || 0,
        user_notes: ov.user_notes !== undefined ? ov.user_notes : raw.user_notes || ''
      };
      const r = GarageEngine.readiness(entry, truckState);
      return { ...entry, _readiness: r };
    });
  }

  // --- Navigation ---
  global.switchTab = function (tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.tab-section').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `sec-${tabName}`);
    });
    document.querySelectorAll('[data-tab-btn]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab-btn') === tabName);
    });
    renderActiveTab();
  };

  function renderActiveTab() {
    updateHeaderKPIs();
    if (state.activeTab === 'truck') renderTruckTab();
    else if (state.activeTab === 'mods') renderModsTab();
    else if (state.activeTab === 'modules') renderModulesTab();
    else if (state.activeTab === 'backups') renderBackupsTab();
    else if (state.activeTab === 'plan') renderPlanTab();
  }

  function updateHeaderKPIs() {
    const entries = getHydratedEntries();
    const wantedCount = entries.filter((e) => e.wanted).length;
    const readyCount = entries.filter((e) => e._readiness.can_apply).length;
    const backupCount = state.backups.length;

    const badgeWanted = document.getElementById('nav-badge-wanted');
    if (badgeWanted) badgeWanted.textContent = String(wantedCount);
    const badgePlan = document.getElementById('nav-badge-plan');
    if (badgePlan) badgePlan.textContent = String(wantedCount);

    const stripEl = document.getElementById('top-status-strip');
    if (stripEl) {
      const synthWarn = isSyntheticBaselineActive()
        ? `<span class="pill pill-amber">🧪 Synthetic Demo Baseline Active</span>`
        : backupCount > 0
        ? `<span class="pill pill-green">🛡️ ${backupCount} Backup File(s) Loaded</span>`
        : `<span class="pill pill-muted">📂 No .abt/.ab Loaded Yet</span>`;

      stripEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span class="pill pill-blue">⚡ ${escapeHtml(state.profile.model_year)} ${escapeHtml(state.profile.trim)} • ${escapeHtml(state.profile.battery)}</span>
          <span class="pill pill-purple">⭐ ${wantedCount} Wanted</span>
          <span class="pill pill-green">🟢 ${readyCount} Ready</span>
          ${synthWarn}
        </div>
      `;
    }
  }

  // =========================================================================
  // TAB 1: TRUCK & VIN DECODER
  // =========================================================================
  function renderTruckTab() {
    const container = document.getElementById('truck-tab-content');
    if (!container) return;

    const p = state.profile;
    const offline = GarageEngine.decodeVinOffline(p.vin);
    const online = p.vin_online;
    const entries = getHydratedEntries();
    const wanted = entries.filter((e) => e.wanted);
    const ready = entries.filter((e) => e._readiness.can_apply);
    const approved = entries.filter((e) => e.status === 'APPROVED');

    let vinDecodeHtml = '';
    if (!offline.ok) {
      vinDecodeHtml = `<div class="alert alert-red">❌ ${escapeHtml((offline.problems || []).join('; '))}</div>`;
    } else {
      const chkBadge = offline.check_digit.valid
        ? `<span class="pill pill-green">✓ ISO 3779 Check Digit '${escapeHtml(offline.check_digit.actual)}' Valid</span>`
        : `<span class="pill pill-amber">⚠️ Check Digit '${escapeHtml(offline.check_digit.actual)}' (Expected '${escapeHtml(offline.check_digit.expected)}')</span>`;

      const onlineBlock = online && online.fields
        ? `
          <div style="margin-top:10px;padding:10px;background:#061224;border:1px solid #1e3a8a;border-radius:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <strong style="font-size:11.5px;color:#38bdf8;">🌐 NHTSA vPIC Verified Telemetry</strong>
              <span class="pill pill-green">Confirmed BEV</span>
            </div>
            <div class="kv-grid">
              <div><span class="kv-label">Make / Model:</span> <strong>${escapeHtml(online.fields.Make)} ${escapeHtml(online.fields.Model)}</strong></div>
              <div><span class="kv-label">Series / Cab:</span> <strong>${escapeHtml(online.fields.Series)} (${escapeHtml(online.fields.BodyClass)})</strong></div>
              <div><span class="kv-label">HV Battery Pack:</span> <strong style="color:#34d399;">${escapeHtml(online.fields._resolvedPack || online.fields.BatteryInfo)}</strong></div>
              <div><span class="kv-label">Drive / GVWR:</span> <strong>${escapeHtml(online.fields.DriveType)} • ${escapeHtml(online.fields.GVWR)}</strong></div>
              <div><span class="kv-label">Assembly Plant:</span> <strong>${escapeHtml(online.fields.PlantCity)}, ${escapeHtml(online.fields.PlantCountry)}</strong></div>
            </div>
            <div style="font-size:10.5px;color:#94a3b8;margin-top:6px;">
              <em>Note: NHTSA's <code>BatteryKWh=${escapeHtml(online.fields.BatteryKWh || '98.00')}</code> field is a model-line floor value; <code>BatteryInfo</code> ("${escapeHtml(online.fields.BatteryInfo)}") + Position 8='V' confirms Extended Range (131 kWh / 320 mi EPA).</em>
            </div>
          </div>
        `
        : '';

      vinDecodeHtml = `
        <div style="margin-top:10px;padding:11px;background:#090e1a;border:1px solid #1e293b;border-radius:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
            <strong style="font-size:12px;color:#f8fafc;">🔍 Structural VIN Decode (${escapeHtml(offline.vin)})</strong>
            ${chkBadge}
          </div>
          <div class="kv-grid">
            <div><span class="kv-label">WMI (Pos 1–3):</span> <strong>${escapeHtml(offline.wmi)} — ${escapeHtml(offline.wmi_meaning)}</strong></div>
            <div><span class="kv-label">Series (Pos 4–6):</span> <strong>${escapeHtml(offline.series_code)} — ${escapeHtml(offline.series_meaning)}</strong></div>
            <div><span class="kv-label">Motor/Pack (Pos 8='${escapeHtml(offline.engine_code)}'):</span> <strong style="color:#38bdf8;">${escapeHtml(offline.inferred_pack || 'EV Powertrain')}</strong></div>
            <div><span class="kv-label">Drive Output:</span> <strong>${escapeHtml(offline.inferred_motors || 'Dual Electric Motors')}</strong></div>
            <div><span class="kv-label">Model Year (Pos 10):</span> <strong>${escapeHtml(offline.model_year || '2023')}</strong></div>
            <div><span class="kv-label">Plant (Pos 11='${escapeHtml(offline.plant_code)}'):</span> <strong>${escapeHtml(offline.plant_meaning)} • Serial #${escapeHtml(offline.serial)}</strong></div>
          </div>
          ${onlineBlock}
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Hero Truck Card -->
      <div class="card card-accent">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
          <div>
            <div style="font-size:10.5px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.6px;">
              ⚡ Active Vehicle Profile • RollupOS Mobile Companion
            </div>
            <h2 style="margin:3px 0 4px 0;font-size:18px;color:#f8fafc;">
              ${escapeHtml(p.model_year)} Ford ${escapeHtml(p.model)} ${escapeHtml(p.trim)}
            </h2>
            <div style="font-size:12px;color:#cbd5e1;">
              <strong>${escapeHtml(p.battery)}</strong> • 320 mi EPA @ 100% • <code>${escapeHtml(p.vin)}</code>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="switchTab('mods')">🎛️ Browse ${entries.length} Mods</button>
            <button class="btn btn-secondary" onclick="switchTab('plan')">📋 Session Plan (${wanted.length})</button>
          </div>
        </div>

        <!-- Quick Readiness Strip -->
        <div class="stat-row" style="margin-top:12px;">
          <div class="stat-box" onclick="setModChipAndOpen('wanted')">
            <div class="stat-num" style="color:#c084fc;">${wanted.length}</div>
            <div class="stat-lbl">⭐ Wanted Mods</div>
          </div>
          <div class="stat-box" onclick="setModChipAndOpen('approved')">
            <div class="stat-num" style="color:#38bdf8;">${approved.length}</div>
            <div class="stat-lbl">✅ Approved</div>
          </div>
          <div class="stat-box" onclick="setModChipAndOpen('ready')">
            <div class="stat-num" style="color:#34d399;">${ready.length}</div>
            <div class="stat-lbl">🟢 Ready to Write</div>
          </div>
          <div class="stat-box" onclick="switchTab('backups')">
            <div class="stat-num" style="color:#fbbf24;">${state.backups.length}</div>
            <div class="stat-lbl">🛡️ Backups Loaded</div>
          </div>
        </div>
      </div>

      <!-- Fast Baseline / Demo Loader Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">🚀 Quick Baseline &amp; Dry-Run Setup</h3>
            <p style="margin:3px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Import your truck's real FORScan <code>.abt</code> or Ford <code>.ab</code> XML file—or load a synthetic demo baseline to preview exact nibble/checksum math right now on your phone.
            </p>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <label class="btn btn-primary" style="cursor:pointer;">
              📂 Import .abt / .ab File
              <input type="file" accept=".abt,.ab,.xml,.txt" multiple style="display:none" onchange="handleBackupFileInput(event)">
            </label>
            ${
              isSyntheticBaselineActive()
                ? `<button class="btn btn-danger" onclick="removeSyntheticBaseline()">🧹 Clear Synthetic Demo</button>`
                : `<button class="btn btn-amber" onclick="loadSyntheticBaseline()">🧪 Load Demo Baseline</button>`
            }
          </div>
        </div>
      </div>

      <!-- VIN & Equipment Editor Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <h3 style="margin:0;font-size:14px;color:#f8fafc;">🔢 VIN Decoder &amp; Truck Specs</h3>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-secondary" onclick="copyVinToClipboard()">📋 Copy VIN</button>
            <button class="btn btn-blue" id="btn-nhtsa-lookup" onclick="runOnlineVinDecode()">🌐 Verify w/ NHTSA vPIC</button>
          </div>
        </div>

        <div class="form-grid">
          <div>
            <label class="field-label">17-Character VIN</label>
            <input type="text" id="inp-vin" class="field-input" maxlength="17" value="${escapeHtml(p.vin)}" oninput="onProfileInput()">
          </div>
          <div>
            <label class="field-label">Model Year &amp; Trim</label>
            <div style="display:flex;gap:6px;">
              <input type="number" id="inp-year" class="field-input" style="width:38%;" value="${escapeHtml(p.model_year)}" oninput="onProfileInput()">
              <input type="text" id="inp-trim" class="field-input" style="width:62%;" value="${escapeHtml(p.trim)}" oninput="onProfileInput()">
            </div>
          </div>
          <div>
            <label class="field-label">Battery Pack</label>
            <select id="inp-battery" class="field-input" onchange="onProfileInput()">
              <option value="Extended Range (131 kWh)" ${String(p.battery).includes('Extended') ? 'selected' : ''}>Extended Range (131 kWh / ~320 mi)</option>
              <option value="Standard Range (98 kWh)" ${String(p.battery).includes('Standard') ? 'selected' : ''}>Standard Range (98 kWh / ~240 mi)</option>
            </select>
          </div>
          <div>
            <label class="field-label">OBD Adapter &amp; Installed Options</label>
            <input type="text" id="inp-options" class="field-input" value="${escapeHtml(p.options)}" oninput="onProfileInput()">
          </div>
        </div>

        ${vinDecodeHtml}
      </div>

      <!-- Phone <-> PC Vault Sync Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">💾 RollupOS Vault &amp; PC Sync</h3>
            <p style="margin:3px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Export your complete Lightning Garage state (profile, starred mods, notes, and imported <code>.abt</code>/<code>.ab</code> backups) to a portable JSON file or share via Android Share Sheet.
            </p>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="exportGarageVaultJson()">📤 Export Vault (.json)</button>
            <label class="btn btn-secondary" style="cursor:pointer;">
              📥 Import Vault (.json)
              <input type="file" accept=".json" style="display:none" onchange="importGarageVaultJson(event)">
            </label>
          </div>
        </div>
      </div>
    `;
  }

  global.onProfileInput = function () {
    const vinEl = document.getElementById('inp-vin');
    const yrEl = document.getElementById('inp-year');
    const trimEl = document.getElementById('inp-trim');
    const batEl = document.getElementById('inp-battery');
    const optEl = document.getElementById('inp-options');
    if (vinEl) state.profile.vin = vinEl.value.trim().toUpperCase();
    if (yrEl) state.profile.model_year = parseInt(yrEl.value, 10) || 2023;
    if (trimEl) state.profile.trim = trimEl.value.trim();
    if (batEl) state.profile.battery = batEl.value;
    if (optEl) state.profile.options = optEl.value.trim();
    saveProfile();
    updateHeaderKPIs();
  };

  global.copyVinToClipboard = function () {
    const vin = state.profile.vin || '1FT6W1EV4PWG11434';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(vin).then(() => showToast(`Copied VIN: ${vin}`));
    } else {
      showToast(`VIN: ${vin}`);
    }
  };

  global.runOnlineVinDecode = async function () {
    const btn = document.getElementById('btn-nhtsa-lookup');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Querying NHTSA...';
    }
    try {
      const res = await GarageEngine.decodeVinOnline(state.profile.vin);
      state.profile.vin_online = res;
      if (res.fields && res.fields._resolvedPack && res.fields._resolvedPack.includes('Extended Range')) {
        state.profile.battery = 'Extended Range (131 kWh)';
      }
      saveProfile();
      renderTruckTab();
      updateHeaderKPIs();
      showToast('Verified VIN with NHTSA vPIC!');
    } catch (err) {
      showToast(`NHTSA lookup failed (offline?): ${err.message}`, true);
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🌐 Verify w/ NHTSA vPIC';
      }
    }
  };

  global.loadSyntheticBaseline = function () {
    const abtText = GarageEngine.generateDemoAbtText(BUNDLE);
    const parsed = GarageEngine.parseAbtText(abtText);
    state.backups = state.backups.filter((b) => !b.is_synthetic);
    state.backups.push({
      id: 'synth-demo-1',
      label: 'SYNTHETIC DEMO BASELINE (Preview Only)',
      filename: 'synthetic_demo_baseline.abt',
      taken_at: new Date().toISOString().slice(0, 10),
      kind: 'FORSCAN_BACKUP',
      is_synthetic: true,
      modules: parsed.modules,
      line_count: parsed.lines.length,
      sha256: parsed.sha256,
      dict: parsed.dict,
      nodes: {},
      warnings: []
    });
    saveBackups();
    renderActiveTab();
    showToast('Loaded Synthetic Demo Baseline — open Mod Menu to inspect live byte/checksum diffs!');
  };

  global.removeSyntheticBaseline = function () {
    state.backups = state.backups.filter((b) => !b.is_synthetic);
    saveBackups();
    renderActiveTab();
    showToast('Removed synthetic demo baseline.');
  };

  global.setModChipAndOpen = function (chip) {
    state.modFilters.chip = chip;
    switchTab('mods');
  };

  // =========================================================================
  // TAB 2: FORSCAN MOD MENU (59 RECIPES)
  // =========================================================================
  function renderModsTab() {
    const container = document.getElementById('mods-tab-content');
    if (!container) return;

    const allEntries = getHydratedEntries();
    const f = state.modFilters;

    // Collect distinct system modules for dropdown
    const modCounts = {};
    allEntries.forEach((e) => {
      const m = e.system || 'OTHER';
      modCounts[m] = (modCounts[m] || 0) + 1;
    });

    const filtered = allEntries.filter((e) => {
      if (f.chip === 'popular' && e.popularity < 2) return false;
      if (f.chip === 'wanted' && !e.wanted) return false;
      if (f.chip === 'ready' && !e._readiness.can_apply) return false;
      if (f.chip === 'approved' && e.status !== 'APPROVED') return false;
      if (f.chip === 'ev_safe' && (e.ev_status === 'ICE_ONLY' || e.tier === 3)) return false;
      if (f.module !== 'ALL' && e.system !== f.module) return false;
      if (f.tier !== 'ALL' && String(e.tier) !== String(f.tier)) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        const hay = `${e.title} ${e.category} ${e.system} ${e.system_name} ${e.notes || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const chips = [
      { id: 'popular', label: '🔥 Most Common (★★+)' },
      { id: 'all', label: `📚 All (${allEntries.length})` },
      { id: 'wanted', label: `⭐ Wanted (${allEntries.filter((e) => e.wanted).length})` },
      { id: 'approved', label: `✅ Approved (${allEntries.filter((e) => e.status === 'APPROVED').length})` },
      { id: 'ready', label: `🟢 Ready (${allEntries.filter((e) => e._readiness.can_apply).length})` },
      { id: 'ev_safe', label: '⚡ EV Compatible' }
    ];

    const chipsHtml = chips
      .map(
        (c) =>
          `<button class="chip-btn ${f.chip === c.id ? 'active' : ''}" onclick="setModChip('${c.id}')">${c.label}</button>`
      )
      .join('');

    const moduleOpts = ['ALL', ...Object.keys(modCounts).sort()]
      .map((m) => {
        if (m === 'ALL') return `<option value="ALL" ${f.module === 'ALL' ? 'selected' : ''}>All Modules</option>`;
        const name = (BUNDLE.ford_modules[m] && BUNDLE.ford_modules[m].short) || m;
        return `<option value="${m}" ${f.module === m ? 'selected' : ''}>${m} (${name}) — ${modCounts[m]}</option>`;
      })
      .join('');

    const cardsHtml = filtered.length
      ? filtered.map((e) => renderModCardHtml(e)).join('')
      : `<div class="card" style="text-align:center;color:#94a3b8;padding:24px;">No mods match current filter. Tap "All (${allEntries.length})" above to reset.</div>`;

    container.innerHTML = `
      <div class="card" style="padding:12px;">
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <input type="search" id="mod-search-inp" class="field-input" placeholder="Search 59 mods (e.g. double horn, bambi, glare,fold, chime)..." value="${escapeHtml(f.search)}" oninput="onModSearchInput(this.value)">
        </div>
        <div class="chip-row">${chipsHtml}</div>
        <div style="display:flex;gap:6px;margin-top:8px;">
          <select class="field-input" style="flex:1;" onchange="setModModuleFilter(this.value)">${moduleOpts}</select>
          <select class="field-input" style="width:135px;" onchange="setModTierFilter(this.value)">
            <option value="ALL" ${f.tier === 'ALL' ? 'selected' : ''}>All Risk Tiers</option>
            <option value="1" ${f.tier === '1' ? 'selected' : ''}>🟢 Tier 1 (Low)</option>
            <option value="2" ${f.tier === '2' ? 'selected' : ''}>🟡 Tier 2 (Med)</option>
            <option value="3" ${f.tier === '3' ? 'selected' : ''}>🔴 Tier 3 (Locked)</option>
          </select>
        </div>
      </div>

      <div style="font-size:11px;color:#94a3b8;margin:6px 2px;display:flex;justify-content:space-between;">
        <span>Showing <strong>${filtered.length}</strong> of ${allEntries.length} recipes</span>
        <span>Tap any card for nibble mask &amp; checksum dry-run</span>
      </div>

      <div id="mod-cards-list">${cardsHtml}</div>
    `;
  }

  function renderModCardHtml(e) {
    const stars = '★'.repeat(e.popularity || 0) + '☆'.repeat(Math.max(0, 3 - (e.popularity || 0)));
    const tierBadge =
      e.tier === 1
        ? `<span class="pill pill-green">T1 Cosmetic</span>`
        : e.tier === 2
        ? `<span class="pill pill-amber">T2 Behavior</span>`
        : `<span class="pill pill-red">🔒 T3 Locked</span>`;

    const evBadge =
      e.ev_status === 'EV_MENTIONED'
        ? `<span class="pill pill-blue">⚡ EV Verified</span>`
        : e.ev_status === 'ICE_ONLY'
        ? `<span class="pill pill-red">⛽ ICE Only</span>`
        : `<span class="pill pill-muted">EV Unverified</span>`;

    const r = e._readiness;
    const stateBadge =
      r.can_apply
        ? `<span class="pill pill-green">🟢 READY TO WRITE</span>`
        : r.state === 'ALREADY_SET'
        ? `<span class="pill pill-blue">✓ ALREADY SET</span>`
        : r.state === 'NEEDS_INPUT'
        ? `<span class="pill pill-amber">✍️ NEEDS INPUT</span>`
        : r.state === 'BLOCKED'
        ? `<span class="pill pill-red">⛔ BLOCKED</span>`
        : `<span class="pill pill-muted">${escapeHtml(r.state)}</span>`;

    const firstStep = (e.steps && e.steps[0]) || {};
    const stepPreview =
      r.steps && r.steps[0] && r.steps[0].before && r.steps[0].after
        ? `<div class="hex-diff-mini"><code>${escapeHtml(r.steps[0].address)}</code>: <span style="color:#94a3b8;">${escapeHtml(r.steps[0].before)}</span> &rarr; <strong style="color:#34d399;">${escapeHtml(r.steps[0].after)}</strong></div>`
        : firstStep.address
        ? `<div class="hex-diff-mini"><code>${escapeHtml(firstStep.address)}</code> • Mask: <code>${escapeHtml(firstStep.mask || '')}</code> (${(e.steps || []).length} step${(e.steps || []).length === 1 ? '' : 's'})</div>`
        : '';

    return `
      <div class="card mod-card ${e.wanted ? 'mod-wanted' : ''}" onclick="openModDetailModal(${e.id})">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:4px;">
              <span style="color:#fbbf24;font-size:11px;letter-spacing:1px;">${stars}</span>
              <span class="pill pill-dark">${escapeHtml(e.system || '?')} • ${escapeHtml(e.category || 'General')}</span>
              ${tierBadge}
              ${evBadge}
              ${stateBadge}
            </div>
            <div style="font-size:14px;font-weight:800;color:#f8fafc;line-height:1.3;">${escapeHtml(e.title)}</div>
          </div>
          <button class="star-btn ${e.wanted ? 'active' : ''}" onclick="event.stopPropagation(); toggleModWanted(${e.id})" title="Add/Remove from Session Plan">
            ${e.wanted ? '⭐' : '☆'}
          </button>
        </div>
        ${stepPreview}
      </div>
    `;
  }

  global.setModChip = function (chip) {
    state.modFilters.chip = chip;
    renderModsTab();
  };

  global.setModModuleFilter = function (mod) {
    state.modFilters.module = mod;
    renderModsTab();
  };

  global.setModTierFilter = function (tier) {
    state.modFilters.tier = tier;
    renderModsTab();
  };

  global.onModSearchInput = function (val) {
    state.modFilters.search = val;
    renderModsTab();
    const inp = document.getElementById('mod-search-inp');
    if (inp) {
      inp.focus();
      inp.setSelectionRange(val.length, val.length);
    }
  };

  global.toggleModWanted = function (id) {
    const cur = state.modOverrides[id] || {};
    const entry = (BUNDLE.entries || []).find((x) => x.id === id) || {};
    const nextWanted = (cur.wanted !== undefined ? cur.wanted : entry.wanted) ? 0 : 1;
    const nextStatus = nextWanted && (!cur.status || cur.status === 'DRAFT') && entry.tier !== 3 ? 'APPROVED' : cur.status || entry.status || 'DRAFT';
    state.modOverrides[id] = {
      ...cur,
      wanted: nextWanted,
      status: nextStatus
    };
    saveModOverrides();
    renderActiveTab();
    showToast(nextWanted ? '⭐ Added to Session Plan & Approved' : 'Removed from Session Plan');
  };

  global.openModDetailModal = function (id) {
    state.selectedModId = id;
    const entries = getHydratedEntries();
    const e = entries.find((x) => x.id === id);
    if (!e) return;

    const modal = document.getElementById('mod-detail-modal');
    const content = document.getElementById('mod-detail-content');
    if (!modal || !content) return;

    const r = e._readiness;
    const stepsHtml = (r.steps || [])
      .map((st, idx) => {
        const rawStep = (e.steps && e.steps[idx]) || {};
        const diffRow =
          st.before && st.after
            ? `
              <div style="margin-top:6px;padding:8px;background:#050811;border:1px solid #1e293b;border-radius:8px;font-family:monospace;font-size:12px;">
                <div><span style="color:#94a3b8;">BEFORE:</span> ${escapeHtml(st.before)}</div>
                <div style="margin-top:3px;"><span style="color:#34d399;">AFTER :</span> <strong style="color:#34d399;">${escapeHtml(st.after)}</strong></div>
                <button class="btn btn-secondary" style="margin-top:6px;padding:3px 8px;font-size:10.5px;" onclick="copyText('${escapeHtml(st.after)}')">📋 Copy Target Bytes</button>
              </div>
            `
            : `<div style="margin-top:4px;font-size:11px;color:#fbbf24;">${escapeHtml(st.detail || 'Load module .abt backup to see live before/after bytes')}</div>`;

        return `
          <div style="padding:10px;background:#0b1120;border:1px solid #1e293b;border-radius:10px;margin-top:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
              <strong style="font-family:monospace;font-size:13px;color:#38bdf8;">${escapeHtml(st.address || rawStep.address)}</strong>
              <span class="pill pill-dark">Mask: <code>${escapeHtml(rawStep.mask || '')}</code></span>
              <span class="pill ${st.state === 'READY' ? 'pill-green' : st.state === 'ALREADY_SET' ? 'pill-blue' : 'pill-amber'}">${escapeHtml(st.state)}</span>
            </div>
            <div style="font-size:11.5px;color:#cbd5e1;margin-top:4px;">
              ${escapeHtml(rawStep.feature_name || '')} — ${escapeHtml(rawStep.notes || '')}
            </div>
            ${diffRow}
          </div>
        `;
      })
      .join('');

    const blockersHtml =
      r.blockers && r.blockers.length
        ? `<div class="alert alert-amber" style="margin-top:10px;"><strong>Gating Notes:</strong><br>${r.blockers.map((b) => `• ${escapeHtml(b)}`).join('<br>')}</div>`
        : `<div class="alert alert-green" style="margin-top:10px;">🟢 <strong>Deterministic Gate Passed:</strong> All target addresses verified and checksums computed.</div>`;

    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div>
          <div style="font-size:10.5px;color:#38bdf8;font-weight:800;text-transform:uppercase;">
            ${escapeHtml(e.system)} (${escapeHtml(e.system_name || '')}) • ${escapeHtml(e.category)}
          </div>
          <h3 style="margin:3px 0 0 0;font-size:16px;color:#f8fafc;">${escapeHtml(e.title)}</h3>
        </div>
        <button class="btn btn-secondary" style="padding:4px 9px;" onclick="closeModDetailModal()">✕</button>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
        <span class="pill ${e.tier === 1 ? 'pill-green' : e.tier === 2 ? 'pill-amber' : 'pill-red'}">Tier ${e.tier}: ${escapeHtml(e.tier_reason)}</span>
        <span class="pill pill-blue">${escapeHtml(e.ev_status)}: ${escapeHtml(e.ev_reason)}</span>
        <span class="pill pill-dark">Years: ${escapeHtml(e.model_years || '2021+')}</span>
      </div>

      ${e.notes ? `<p style="font-size:12px;color:#cbd5e1;margin:10px 0 0 0;line-height:1.45;">${escapeHtml(e.notes)}</p>` : ''}
      ${e.warnings ? `<div class="alert alert-red" style="margin-top:8px;">⚠️ ${escapeHtml(e.warnings)}</div>` : ''}
      ${e.forscan_menu ? `<div style="font-size:11.5px;color:#93c5fd;margin-top:6px;"><strong>FORScan Plain-English Menu:</strong> ${escapeHtml(e.forscan_menu)}</div>` : ''}

      ${blockersHtml}

      <div style="margin-top:10px;">
        <strong style="font-size:12px;color:#f8fafc;">As-Built Nibble Steps (${(e.steps || []).length}):</strong>
        ${stepsHtml}
      </div>

      <!-- User Controls -->
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid #1e293b;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <button class="btn ${e.wanted ? 'btn-primary' : 'btn-secondary'}" onclick="toggleModWanted(${e.id}); openModDetailModal(${e.id});">
            ${e.wanted ? '⭐ In Session Plan' : '☆ Add to Session Plan'}
          </button>
          <select class="field-input" style="width:auto;min-width:140px;" onchange="updateModStatus(${e.id}, this.value)">
            <option value="DRAFT" ${e.status === 'DRAFT' ? 'selected' : ''}>Status: DRAFT</option>
            <option value="APPROVED" ${e.status === 'APPROVED' ? 'selected' : ''} ${e.tier === 3 ? 'disabled' : ''}>Status: APPROVED</option>
            <option value="APPLIED" ${e.status === 'APPLIED' ? 'selected' : ''}>Status: APPLIED</option>
            <option value="REJECTED" ${e.status === 'REJECTED' ? 'selected' : ''}>Status: REJECTED</option>
          </select>
        </div>
        <div style="margin-top:8px;">
          <label class="field-label">Personal Truck Notes</label>
          <input type="text" class="field-input" placeholder="e.g. Verified on my 2023 Lariat ER..." value="${escapeHtml(e.user_notes || '')}" onchange="updateModUserNotes(${e.id}, this.value)">
        </div>
        <div style="font-size:10px;color:#64748b;margin-top:8px;">
          Source: ${escapeHtml(e.source_key)} ${e.source_sheet ? `• Sheet: ${escapeHtml(e.source_sheet)}` : ''}
        </div>
      </div>
    `;
    modal.classList.add('open');
  };

  global.closeModDetailModal = function () {
    const modal = document.getElementById('mod-detail-modal');
    if (modal) modal.classList.remove('open');
  };

  global.updateModStatus = function (id, newStatus) {
    const cur = state.modOverrides[id] || {};
    state.modOverrides[id] = { ...cur, status: newStatus };
    saveModOverrides();
    openModDetailModal(id);
    renderActiveTab();
    showToast(`Status updated to ${newStatus}`);
  };

  global.updateModUserNotes = function (id, notes) {
    const cur = state.modOverrides[id] || {};
    state.modOverrides[id] = { ...cur, user_notes: notes };
    saveModOverrides();
    showToast('Saved mod note.');
  };

  global.copyText = function (txt) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(() => showToast(`Copied: ${txt}`));
    }
  };

  // =========================================================================
  // TAB 3: MODULES GUIDE (87 FORD MODULES + EDITORIAL LIGHTNING GUIDE)
  // =========================================================================
  function renderModulesTab() {
    const container = document.getElementById('modules-tab-content');
    if (!container) return;

    const editorial = BUNDLE.module_editorial || {};
    const fordNames = BUNDLE.ford_modules || {};
    const fcodeNames = BUNDLE.ford_fcodes || {};
    const entries = getHydratedEntries();

    // Count recipes touching each module
    const recipeUsage = {};
    entries.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const m = String(s.address || '').slice(0, 3).toUpperCase();
        if (m.length === 3) {
          if (!recipeUsage[m]) recipeUsage[m] = new Set();
          recipeUsage[m].add(e.id);
        }
      });
    });

    // Evidence from backups
    const backupLinesByMod = {};
    const factoryLinesByMod = {};
    const factoryPartsByMod = {};
    state.backups.forEach((b) => {
      Object.keys(b.dict || {}).forEach((k) => {
        const m = k.slice(0, 3);
        if (b.kind === 'FORD_AB') {
          factoryLinesByMod[m] = (factoryLinesByMod[m] || 0) + 1;
        } else {
          backupLinesByMod[m] = (backupLinesByMod[m] || 0) + 1;
        }
      });
      Object.keys(b.nodes || {}).forEach((m) => {
        factoryPartsByMod[m] = b.nodes[m];
      });
    });

    const allAddrs = Array.from(
      new Set([
        ...Object.keys(editorial),
        ...Object.keys(recipeUsage),
        ...Object.keys(backupLinesByMod),
        ...Object.keys(factoryLinesByMod),
        ...Object.keys(fordNames)
      ])
    ).sort();

    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3, undefined: 4 };
    const rows = allAddrs.map((addr) => {
      const fn = fordNames[addr] || {};
      const ed = editorial[addr] || {};
      const rCount = recipeUsage[addr] ? recipeUsage[addr].size : 0;
      const bLines = backupLinesByMod[addr] || 0;
      const fLines = factoryLinesByMod[addr] || 0;
      const parts = factoryPartsByMod[addr] || null;
      const present = bLines > 0 || fLines > 0 || Boolean(parts);
      return {
        addr,
        short: fn.short || addr,
        long: fn.long || 'Control Module',
        does: ed.does || '',
        ev: ed.ev || '',
        risk: ed.risk || null,
        touch: ed.touch || '',
        rCount,
        bLines,
        fLines,
        parts,
        present
      };
    });

    rows.sort((a, b) => {
      const aImp = (a.does ? 1 : 0) + (a.rCount > 0 ? 1 : 0) + (a.present ? 1 : 0);
      const bImp = (b.does ? 1 : 0) + (b.rCount > 0 ? 1 : 0) + (b.present ? 1 : 0);
      if (aImp !== bImp) return bImp - aImp;
      return (riskOrder[a.risk] ?? 4) - (riskOrder[b.risk] ?? 4) || b.rCount - a.rCount;
    });

    const filteredRows = rows.filter((r) => {
      if (state.moduleFilter === 'MODDABLE') return r.rCount > 0 && r.risk !== 'critical';
      if (state.moduleFilter === 'CRITICAL') return r.risk === 'critical' || r.risk === 'high';
      if (state.moduleFilter === 'PRESENT') return r.present || r.does !== '';
      return true;
    });

    const cardsHtml = filteredRows
      .map((r) => {
        const riskBadge =
          r.risk === 'critical'
            ? `<span class="pill pill-red">🔒 CRITICAL — DO NOT WRITE</span>`
            : r.risk === 'high'
            ? `<span class="pill pill-amber">⚠️ HIGH RISK</span>`
            : r.risk === 'medium'
            ? `<span class="pill pill-blue">MEDIUM RISK</span>`
            : r.risk === 'low'
            ? `<span class="pill pill-green">LOW RISK</span>`
            : '';

        const evidenceBadges = [];
        if (r.bLines > 0) evidenceBadges.push(`<span class="pill pill-green">✓ ${r.bLines} Backup Lines</span>`);
        if (r.fLines > 0) evidenceBadges.push(`<span class="pill pill-blue">🏭 ${r.fLines} Factory .ab Lines</span>`);
        if (r.rCount > 0) {
          evidenceBadges.push(
            `<button class="pill pill-purple" style="border:none;cursor:pointer;" onclick="filterModsByModule('${r.addr}')">🎛️ ${r.rCount} Mod Recipe(s) &rarr;</button>`
          );
        }

        let partsHtml = '';
        if (r.parts && Object.keys(r.parts).length) {
          const items = Object.keys(r.parts)
            .map((fk) => `<span style="margin-right:8px;"><code>${escapeHtml(fk)}</code> (${escapeHtml(fcodeNames[fk] || 'Part')}): <strong>${escapeHtml(r.parts[fk])}</strong></span>`)
            .join(' ');
          partsHtml = `<div style="margin-top:6px;font-size:10.5px;color:#93c5fd;background:#061224;padding:6px 8px;border-radius:6px;">${items}</div>`;
        }

        return `
          <div class="card" style="padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
              <div>
                <span style="font-family:monospace;font-size:13px;font-weight:800;color:#38bdf8;">0x${escapeHtml(r.addr)}</span>
                <strong style="font-size:14px;color:#f8fafc;margin-left:6px;">${escapeHtml(r.short)} — ${escapeHtml(r.long)}</strong>
              </div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;">${riskBadge}</div>
            </div>
            ${r.does ? `<p style="margin:6px 0 0 0;font-size:12px;color:#cbd5e1;line-height:1.4;">${escapeHtml(r.does)}</p>` : ''}
            ${r.ev ? `<div style="margin-top:4px;font-size:11.5px;color:#38bdf8;"><strong>⚡ Lightning EV Note:</strong> ${escapeHtml(r.ev)}</div>` : ''}
            ${r.touch ? `<div style="margin-top:4px;font-size:11.5px;color:#fbbf24;"><strong>💡 Advice:</strong> ${escapeHtml(r.touch)}</div>` : ''}
            ${partsHtml}
            ${evidenceBadges.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">${evidenceBadges.join('')}</div>` : ''}
          </div>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="card">
        <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🧩 F-150 Lightning Control Module Architecture</h3>
        <p style="margin:0 0 8px 0;font-size:11.5px;color:#94a3b8;">
          Module names from Ford's official list (87 addresses); functional &amp; EV notes curated for the 2023 F-150 Lightning ER.
        </p>
        <div class="chip-row">
          <button class="chip-btn ${state.moduleFilter === 'PRESENT' ? 'active' : ''}" onclick="setModuleTabFilter('PRESENT')">⭐ Key Lightning Modules</button>
          <button class="chip-btn ${state.moduleFilter === 'MODDABLE' ? 'active' : ''}" onclick="setModuleTabFilter('MODDABLE')">🎛️ Has Mod Recipes</button>
          <button class="chip-btn ${state.moduleFilter === 'CRITICAL' ? 'active' : ''}" onclick="setModuleTabFilter('CRITICAL')">🔒 Safety / HV Locked</button>
          <button class="chip-btn ${state.moduleFilter === 'ALL' ? 'active' : ''}" onclick="setModuleTabFilter('ALL')">📚 All 87 Ford Addresses</button>
        </div>
      </div>
      <div>${cardsHtml}</div>
    `;
  }

  global.setModuleTabFilter = function (flt) {
    state.moduleFilter = flt;
    renderModulesTab();
  };

  global.filterModsByModule = function (addr) {
    state.modFilters.module = addr;
    state.modFilters.chip = 'all';
    switchTab('mods');
  };

  // =========================================================================
  // TAB 4: BACKUPS, FORD FACTORY .AB & CHECKSUM TOOLS
  // =========================================================================
  function renderBackupsTab() {
    const container = document.getElementById('backups-tab-content');
    if (!container) return;

    const entries = getHydratedEntries();
    const wanted = entries.filter((e) => e.wanted || e.status === 'APPROVED');
    const requiredMods = new Set();
    wanted.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const m = String(s.address || '').slice(0, 3).toUpperCase();
        if (m.length === 3) requiredMods.add(m);
      });
    });

    const backedUpMods = new Set();
    state.backups
      .filter((b) => b.kind === 'FORSCAN_BACKUP' && !b.is_synthetic)
      .forEach((b) => (b.modules || []).forEach((m) => backedUpMods.add(m)));

    const coverageRows = Array.from(requiredMods)
      .sort()
      .map((m) => {
        const fn = (BUNDLE.ford_modules[m] && BUNDLE.ford_modules[m].short) || m;
        const ok = backedUpMods.has(m);
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:#090e1a;border:1px solid ${ok ? '#166534' : '#7c2d12'};border-radius:8px;">
            <div>
              <strong style="color:#f8fafc;">${escapeHtml(m)} (${escapeHtml(fn)})</strong>
              <span style="font-size:11px;color:#94a3b8;margin-left:6px;">Required by your Wanted/Approved mods</span>
            </div>
            ${ok ? `<span class="pill pill-green">✓ Real .abt Saved</span>` : `<span class="pill pill-amber">⚠️ Needs FORScan .abt Backup</span>`}
          </div>
        `;
      })
      .join('');

    const backupsListHtml = state.backups.length
      ? state.backups
          .map(
            (b, idx) => `
          <div style="padding:10px;background:#090e1a;border:1px solid #1e293b;border-radius:10px;margin-top:8px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <strong style="font-size:13px;color:#f8fafc;">${escapeHtml(b.label || b.filename)}</strong>
                  <span class="pill ${b.kind === 'FORD_AB' ? 'pill-blue' : b.is_synthetic ? 'pill-amber' : 'pill-green'}">${escapeHtml(b.kind)}</span>
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:3px;">
                  Modules: <strong>${escapeHtml((b.modules || []).join(', '))}</strong> • ${b.line_count || Object.keys(b.dict || {}).length} lines • SHA-256: <code>${escapeHtml(String(b.sha256 || '').slice(0, 10))}</code>
                </div>
              </div>
              <div style="display:flex;gap:5px;">
                <button class="btn btn-secondary" style="padding:4px 8px;font-size:11px;" onclick="downloadBackupFile(${idx})">⬇️ Save</button>
                <button class="btn btn-danger" style="padding:4px 8px;font-size:11px;" onclick="deleteBackupAt(${idx})">🗑️</button>
              </div>
            </div>
          </div>
        `
          )
          .join('')
      : `<div style="padding:14px;text-align:center;color:#94a3b8;font-size:12px;">No <code>.abt</code> or <code>.ab</code> files imported yet.</div>`;

    // Factory vs Current Drift
    const fac = getFactoryState();
    const cur = getMergedTruckState();
    let driftHtml = '';
    if (Object.keys(fac.dict).length > 0 && Object.keys(cur).length > 0) {
      const scopedFac = {};
      const scopedCur = {};
      Object.keys(cur).forEach((k) => {
        if (fac.dict[k]) {
          scopedFac[k] = fac.dict[k];
          scopedCur[k] = cur[k];
        }
      });
      const d = GarageEngine.diffBackups(scopedFac, scopedCur);
      driftHtml = `
        <div class="card">
          <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🏭 Factory .ab vs. Current Backup Drift</h3>
          <p style="margin:0 0 8px 0;font-size:11.5px;color:#94a3b8;">
            Comparing ${Object.keys(scopedCur).length} overlapping addresses between Ford Factory <code>.ab</code> and your current backup:
            <strong>${d.changed.length} line(s) differ</strong>.
          </p>
          ${
            d.changed.length
              ? d.changed
                  .slice(0, 15)
                  .map(
                    (c) => `
                  <div style="font-family:monospace;font-size:11.5px;padding:6px 8px;background:#050811;border:1px solid #1e293b;border-radius:6px;margin-top:4px;">
                    <strong style="color:#38bdf8;">${escapeHtml(c.address)}</strong>:
                    <span style="color:#94a3b8;">Factory ${escapeHtml(c.before)}</span> &rarr;
                    <strong style="color:#34d399;">Current ${escapeHtml(c.after)}</strong>
                  </div>
                `
                  )
                  .join('')
              : `<div class="alert alert-green">✓ 100% identical to Ford Factory As-Built across all overlapping lines.</div>`
          }
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Pre-Flight Backup Coverage -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">🛡️ Pre-Flight Module Backup Checklist</h3>
            <p style="margin:2px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Before writing any change in FORScan, save an untouched <code>.abt</code> backup for each module below.
            </p>
          </div>
          <label class="btn btn-primary" style="cursor:pointer;">
            📂 Import .abt / .ab File
            <input type="file" accept=".abt,.ab,.xml,.txt" multiple style="display:none" onchange="handleBackupFileInput(event)">
          </label>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${coverageRows || '<div style="font-size:12px;color:#94a3b8;">Star (⭐) mods in the Mod Menu to build your required module backup list.</div>'}
        </div>
      </div>

      <!-- Imported Backups Vault -->
      <div class="card">
        <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🗄️ Imported Backups &amp; Factory Files (${state.backups.length})</h3>
        ${backupsListHtml}
      </div>

      ${driftHtml}

      <!-- Ford Motorcraft Official As-Built Retrieval Guide -->
      <div class="card">
        <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🏭 Get Ford's Official Factory As-Built (<code>.ab</code>)</h3>
        <p style="margin:0 0 8px 0;font-size:11.5px;color:#cbd5e1;line-height:1.45;">
          Ford's Motorcraft As-Built site uses a visual security CAPTCHA, so we never scrape it behind your back. Download your official <code>1FT6W1EV4PWG11434.ab</code> XML in 20 seconds:
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <button class="btn btn-secondary" onclick="copyVinToClipboard()">1️⃣ Copy VIN (${escapeHtml(state.profile.vin)})</button>
          <a href="https://www.motorcraftservice.com/AsBuilt" target="_blank" rel="noopener" class="btn btn-blue" style="text-decoration:none;">2️⃣ Open Motorcraft AsBuilt &nearr;</a>
        </div>
        <div style="font-size:11px;color:#94a3b8;">
          3️⃣ Paste your VIN, enter the 4-digit security code, tap <strong>Download File</strong>, and import the downloaded <code>.ab</code> file above!
        </div>
      </div>

      <!-- Deterministic As-Built Checksum Calculator -->
      <div class="card">
        <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🧮 Deterministic As-Built Line Checksum Calculator</h3>
        <p style="margin:0 0 8px 0;font-size:11.5px;color:#94a3b8;">
          Computes exact Ford line checksums (<code>sum(header + data[:-1]) &amp; 0xFF</code>).
        </p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <input type="text" id="cs-addr" class="field-input" style="width:120px;font-family:monospace;" value="726-63-02" placeholder="726-01-01">
          <input type="text" id="cs-payload" class="field-input" style="flex:1;font-family:monospace;" value="0101 0001 0194" placeholder="0101 0001 0194">
          <button class="btn btn-primary" onclick="runChecksumCalc()">Compute</button>
        </div>
        <div id="cs-result" style="margin-top:8px;font-family:monospace;font-size:12px;color:#38bdf8;"></div>
      </div>
    `;
  }

  global.handleBackupFileInput = function (ev) {
    const files = Array.from((ev.target && ev.target.files) || []);
    if (!files.length) return;

    let importedCount = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = String(e.target.result || '');
          const parsed = GarageEngine.parseAnyBackupFile(file.name, text);
          // Remove synthetic baseline once a real file is imported
          state.backups = state.backups.filter((b) => !b.is_synthetic && b.sha256 !== parsed.sha256);
          state.backups.push({
            id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            label: file.name,
            filename: file.name,
            taken_at: new Date().toISOString().slice(0, 10),
            kind: parsed.kind,
            is_synthetic: false,
            vin: parsed.vin,
            modules: parsed.modules,
            line_count: parsed.lines.length,
            sha256: parsed.sha256,
            dict: parsed.dict,
            nodes: parsed.nodes || {},
            warnings: parsed.warnings || [],
            raw_text: text
          });
          saveBackups();
          importedCount++;
          renderActiveTab();
          showToast(`Imported ${file.name} (${parsed.lines.length} lines across ${parsed.modules.join(', ')})`);
        } catch (err) {
          showToast(`Failed to parse ${file.name}: ${err.message}`, true);
        }
      };
      reader.readAsText(file);
    });
  };

  global.deleteBackupAt = function (idx) {
    const b = state.backups[idx];
    if (!b) return;
    state.backups.splice(idx, 1);
    saveBackups();
    renderActiveTab();
    showToast(`Removed ${b.label || b.filename}`);
  };

  global.downloadBackupFile = function (idx) {
    const b = state.backups[idx];
    if (!b) return;
    const text =
      b.raw_text ||
      Object.keys(b.dict || {})
        .sort()
        .map((k) => `${k} ${b.dict[k]}`)
        .join('\n');
    if (global.RollupBridge) {
      RollupBridge.files.downloadText(b.filename || `${b.label || 'backup'}.abt`, text);
    }
  };

  global.runChecksumCalc = function () {
    const addrStr = (document.getElementById('cs-addr') || {}).value || '';
    const payloadStr = (document.getElementById('cs-payload') || {}).value || '';
    const resEl = document.getElementById('cs-result');
    if (!resEl) return;
    try {
      const a = GarageEngine.parseAddress(addrStr);
      const cs = GarageEngine.computeChecksum(a.module, a.block, a.line, payloadStr);
      const full = GarageEngine.withChecksum(a.module, a.block, a.line, payloadStr);
      const ok = GarageEngine.checksumOk(a.module, a.block, a.line, payloadStr);
      resEl.innerHTML = `Checksum Byte: <strong style="color:#34d399;">${cs}</strong> • Full Line: <strong>${escapeHtml(a.key)} ${escapeHtml(full)}</strong> (${ok ? '✓ Input matched' : 'Updated last byte'})`;
    } catch (err) {
      resEl.innerHTML = `<span style="color:#f87171;">Error: ${escapeHtml(err.message)}</span>`;
    }
  };

  // =========================================================================
  // TAB 5: PRINTABLE / IN-CAB FORSCAN SESSION PLAN
  // =========================================================================
  function renderPlanTab() {
    const container = document.getElementById('plan-tab-content');
    if (!container) return;

    const entries = getHydratedEntries();
    const planned = entries.filter((e) => e.wanted);
    const modsToBackup = new Set();
    planned.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const m = String(s.address || '').slice(0, 3).toUpperCase();
        if (m.length === 3) modsToBackup.add(m);
      });
    });

    const planStepsHtml = planned.length
      ? planned
          .map((e, idx) => {
            const r = e._readiness;
            const stepRows = (r.steps || [])
              .map((st, sIdx) => {
                const rawStep = (e.steps && e.steps[sIdx]) || {};
                return `
                  <div style="padding:8px;background:#050811;border:1px solid #1e293b;border-radius:8px;margin-top:6px;font-family:monospace;font-size:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <strong style="color:#38bdf8;">${escapeHtml(st.address || rawStep.address)}</strong>
                      <span style="color:#94a3b8;">Mask: ${escapeHtml(rawStep.mask || '')}</span>
                    </div>
                    ${
                      st.before && st.after
                        ? `
                        <div style="margin-top:4px;color:#94a3b8;">Current: ${escapeHtml(st.before)}</div>
                        <div style="margin-top:2px;color:#34d399;"><strong>Write  : ${escapeHtml(st.after)}</strong></div>
                      `
                        : `<div style="margin-top:4px;color:#fbbf24;">${escapeHtml(rawStep.notes || st.detail || 'Import .abt backup to compute exact bytes')}</div>`
                    }
                  </div>
                `;
              })
              .join('');

            return `
              <div class="card" style="padding:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <span class="pill pill-dark">#${idx + 1} • ${escapeHtml(e.system)}</span>
                    <strong style="font-size:14px;color:#f8fafc;margin-left:6px;">${escapeHtml(e.title)}</strong>
                  </div>
                  <span class="pill ${r.can_apply ? 'pill-green' : 'pill-amber'}">${escapeHtml(r.state)}</span>
                </div>
                ${stepRows}
              </div>
            `;
          })
          .join('')
      : `<div class="card" style="text-align:center;color:#94a3b8;padding:20px;">No mods starred yet. Tap ⭐ on any mod in the Mod Menu to add it to your session plan.</div>`;

    container.innerHTML = `
      <div class="card card-accent">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <h3 style="margin:0;font-size:15px;color:#f8fafc;">📋 In-Cab FORScan Session Checklist</h3>
            <div style="font-size:11.5px;color:#cbd5e1;margin-top:2px;">
              ${escapeHtml(state.profile.model_year)} ${escapeHtml(state.profile.model)} ${escapeHtml(state.profile.trim)} • <code>${escapeHtml(state.profile.vin)}</code>
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-primary" onclick="shareSessionPlan()">📤 Share / Export Plan</button>
            <button class="btn btn-secondary" onclick="window.print()">🖨️ Print</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h4 style="margin:0 0 6px 0;font-size:13px;color:#38bdf8;">Step 1 — Truck &amp; 12V Pre-Flight</h4>
        <ul style="margin:0;padding-left:18px;font-size:12px;color:#cbd5e1;line-height:1.55;">
          <li>Connect <strong>${escapeHtml(state.profile.adapter || 'OBDLink EX')}</strong> to the OBD-II port; turn truck to <strong>Accessory / Run (KOEO)</strong> (not actively driving).</li>
          <li>Ensure 12V battery is healthy (on the Lightning, the <code>746 SOBDMC</code> DC-DC converter supports 12V when HV contactors are closed or plugged into EVSE).</li>
          <li>Before modifying any line, open FORScan &rarr; <strong>Configuration and Programming</strong> &rarr; <strong>Save All</strong> into a dated <code>.abt</code> backup for: <strong>${escapeHtml(Array.from(modsToBackup).join(', ') || '726, 7D0, 720, 740, 741, 724')}</strong>.</li>
        </ul>
      </div>

      <div style="margin:8px 2px;font-size:12px;font-weight:800;color:#f8fafc;">
        Step 2 — Selected Mod Changes (${planned.length})
      </div>
      ${planStepsHtml}
    `;
  }

  global.shareSessionPlan = function () {
    const entries = getHydratedEntries().filter((e) => e.wanted);
    const lines = [
      `LIGHTNING GARAGE — FORSCAN SESSION PLAN`,
      `Vehicle: ${state.profile.model_year} ${state.profile.model} ${state.profile.trim} (${state.profile.battery})`,
      `VIN: ${state.profile.vin}`,
      `Adapter: ${state.profile.adapter}`,
      `----------------------------------------`
    ];
    entries.forEach((e, idx) => {
      lines.push(`${idx + 1}. [${e.system}] ${e.title} (${e._readiness.state})`);
      (e._readiness.steps || []).forEach((st) => {
        if (st.before && st.after) {
          lines.push(`   • ${st.address}: ${st.before}  -->  ${st.after}`);
        } else {
          lines.push(`   • ${st.address}: Mask ${st.mask || ''}`);
        }
      });
    });
    const text = lines.join('\n');
    if (global.RollupBridge) {
      RollupBridge.files.share('Lightning Garage FORScan Session Plan', text);
    }
  };

  // --- Vault JSON Export / Import ---
  global.exportGarageVaultJson = function () {
    const payload = {
      app: APP_ID,
      exported_at: new Date().toISOString(),
      profile: state.profile,
      modOverrides: state.modOverrides,
      backups: state.backups,
      changeLog: state.changeLog
    };
    if (global.RollupBridge) {
      RollupBridge.files.exportJSON(`lightning_garage_vault_${state.profile.vin || 'export'}.json`, payload);
      showToast('Exported Lightning Garage JSON Vault!');
    }
  };

  global.importGarageVaultJson = function (ev) {
    const file = ev.target && ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target.result || '{}'));
        if (data.profile) {
          state.profile = { ...state.profile, ...data.profile };
          saveProfile();
        }
        if (data.modOverrides) {
          state.modOverrides = data.modOverrides;
          saveModOverrides();
        }
        if (Array.isArray(data.backups)) {
          state.backups = data.backups;
          saveBackups();
        }
        renderActiveTab();
        showToast('Restored Lightning Garage Vault!');
      } catch (err) {
        showToast(`Invalid Vault JSON: ${err.message}`, true);
      }
    };
    reader.readAsText(file);
  };

  // --- Boot Sequence ---
  document.addEventListener('DOMContentLoaded', () => {
    if (global.RollupBridge) {
      if (!RollupBridge.enforceAccessGate(APP_ID, 'restricted')) return;
      RollupBridge.mountInAppConsolePill({
        appId: APP_ID,
        visibility: 'restricted'
      });
    }
    loadState();
    renderActiveTab();
  });
})(window);
