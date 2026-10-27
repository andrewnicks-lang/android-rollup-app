/**
 * app.js — RollupOS Mobile Controller for Blue Oval Garage v2.0 (2011–2026+ Ford & Lincoln FORScan Companion)
 * Uses RollupBridge.storage for isolated per-user multi-vehicle persistence + GarageEngine for deterministic math.
 */
(function (global) {
  'use strict';

  const APP_ID = 'lightning-garage';
  global.ROLLUP_APP_ID = APP_ID;

  const BUNDLE = global.LIGHTNING_GARAGE_BUNDLE || {
    entries: [],
    ford_platforms: [],
    ford_modules: {},
    ford_fcodes: {},
    module_editorial: {},
    default_profile: {}
  };

  // --- State Keys in RollupBridge.storage ---
  const KEY_VEHICLES = 'garage_vehicles_v2';
  const KEY_ACTIVE_VID = 'garage_active_vid_v2';
  const KEY_PROFILE = 'truck_profile';
  const KEY_MOD_OVERRIDES = 'mod_overrides';
  const KEY_BACKUPS = 'backups_list';
  const KEY_CHANGE_LOG = 'change_log';
  const KEY_CUSTOM_MODS = 'custom_mods_v2';
  const KEY_LIVE_SCANS = 'live_scans_v2';
  const KEY_PC_SYNC_URL = 'pc_sync_url_v1';

  let camStream = null;
  let camTimer = null;

  let state = {
    activeTab: 'truck',
    vehicles: [],
    activeVehicleId: 1,
    profile: null,
    modOverrides: {},
    backups: [],
    changeLog: [],
    customMods: [],
    liveScans: {},
    abtExportFmt: 'encoded',
    pcSync: {
      url: '',
      pin: '',
      busy: false,
      lastMessage: '',
      lastError: false
    },
    usb: {
      connected: false,
      deviceInfo: '',
      readOnlyGate: false,
      busy: false,
      mode: 'targeted_backup',
      dualBus: true,
      allowExtended: false,
      confirmParked: false,
      overrideLowV: false,
      lastVoltage: null,
      progressText: '',
      lastResult: null,
      lastError: ''
    },
    scannerOpen: false,
    addVehicleOpen: false,
    customBuilderOpen: false,
    selectedPlatformSlug: null,
    modFilters: {
      search: '',
      chip: 'popular', // 'all' | 'popular' | 'wanted' | 'ready' | 'approved' | 'ev_safe'
      module: 'ALL',
      tier: 'ALL',
      allPlatforms: false
    },
    moduleFilter: 'PRESENT', // 'ALL' | 'MODDABLE' | 'PRESENT' | 'CRITICAL'
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

  function resolveUpstreamPlatform(platformSlug) {
    const slug = String(platformSlug || 'f150_14g').toLowerCase();
    if (['f150', 'super_duty', 'ranger_6g', 'explorer', 'bronco', 'mustang'].includes(slug)) return slug;
    const pl = (BUNDLE.ford_platforms || []).find((p) => p.slug === slug);
    if (pl && pl.upstream_dir) return pl.upstream_dir;
    if (slug.startsWith('super_duty')) return 'super_duty';
    if (slug.startsWith('ranger')) return 'ranger_6g';
    if (slug.startsWith('explorer')) return 'explorer';
    if (slug.startsWith('bronco') || slug.startsWith('maverick')) return 'bronco';
    if (slug.startsWith('mustang')) return 'mustang';
    return 'f150';
  }

  function getScopedKey(baseKey, vid) {
    return vid === 1 ? baseKey : `${baseKey}_v${vid}`;
  }

  // --- Initialization & Multi-Vehicle Storage Hydration ---
  function loadState() {
    const cfg = (global.RollupBridge && RollupBridge.user.getAppConfig(APP_ID)) || {};
    const defProf = BUNDLE.default_profile || {};
    const legacyProfile = (global.RollupBridge && RollupBridge.storage.get(KEY_PROFILE, null, APP_ID)) || null;
    const savedVehicles = (global.RollupBridge && RollupBridge.storage.get(KEY_VEHICLES, null, APP_ID)) || null;

    if (Array.isArray(savedVehicles) && savedVehicles.length > 0) {
      state.vehicles = savedVehicles;
    } else {
      const v1 = {
        id: 1,
        vin: (legacyProfile && legacyProfile.vin) || cfg.default_vin || defProf.vin || '1FT6W1EV4PWG11434',
        nickname: (legacyProfile && legacyProfile.nickname) || '2023 F-150 Lightning Lariat ER',
        make: (legacyProfile && legacyProfile.make) || 'Ford',
        model_year: Number((legacyProfile && legacyProfile.model_year) || defProf.model_year || 2023),
        model: (legacyProfile && legacyProfile.model) || defProf.model || 'F-150 Lightning',
        platform_slug: (legacyProfile && legacyProfile.platform_slug) || 'f150_14g',
        trim: (legacyProfile && legacyProfile.trim) || cfg.default_trim || defProf.trim || 'Lariat',
        powertrain: (legacyProfile && legacyProfile.powertrain) || 'BEV',
        battery: (legacyProfile && legacyProfile.battery) || cfg.default_battery || defProf.battery || 'Extended Range (131 kWh)',
        options: (legacyProfile && legacyProfile.options) || defProf.options || '511A, Max Trailer Tow, Tow Tech, BlueCruise, Pro Power 9.6kW',
        adapter: (legacyProfile && legacyProfile.adapter) || defProf.adapter || 'OBDLink EX',
        forscan_license: (legacyProfile && legacyProfile.forscan_license) || defProf.forscan_license || 'Extended License',
        odometer: (legacyProfile && legacyProfile.odometer) || defProf.odometer || '',
        vin_online: (legacyProfile && legacyProfile.vin_online) || null
      };
      state.vehicles = [v1];
      saveVehicles();
    }

    const savedActiveVid = Number((global.RollupBridge && RollupBridge.storage.get(KEY_ACTIVE_VID, 1, APP_ID)) || 1);
    const activeVeh = state.vehicles.find((v) => v.id === savedActiveVid) || state.vehicles[0];
    state.activeVehicleId = activeVeh.id;
    state.profile = activeVeh;
    state.selectedPlatformSlug = activeVeh.platform_slug || 'f150_14g';
    state.pcSync.url = (global.RollupBridge && RollupBridge.storage.get(KEY_PC_SYNC_URL, '', APP_ID)) || '';

    loadScopedVehicleData(state.activeVehicleId);
  }

  function loadScopedVehicleData(vid) {
    const ovKey = getScopedKey(KEY_MOD_OVERRIDES, vid);
    const bkKey = getScopedKey(KEY_BACKUPS, vid);
    const clKey = getScopedKey(KEY_CHANGE_LOG, vid);
    const cmKey = getScopedKey(KEY_CUSTOM_MODS, vid);
    const lsKey = getScopedKey(KEY_LIVE_SCANS, vid);

    const savedOverrides = (global.RollupBridge && RollupBridge.storage.get(ovKey, null, APP_ID)) || null;
    if (savedOverrides) {
      state.modOverrides = savedOverrides;
    } else {
      state.modOverrides = {};
      const upPlat = resolveUpstreamPlatform(state.profile.platform_slug);
      const vehPt = String((state.profile && state.profile.powertrain) || 'BEV').toUpperCase();
      (BUNDLE.entries || []).forEach((e) => {
        const iceBlocked = vehPt === 'BEV' && e.ev_status === 'ICE_ONLY';
        if ((e.platform_slug || 'f150') === upPlat && e.popularity >= 3 && e.tier <= 2 && !iceBlocked) {
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

    state.backups = (global.RollupBridge && RollupBridge.storage.get(bkKey, [], APP_ID)) || [];
    state.changeLog = (global.RollupBridge && RollupBridge.storage.get(clKey, [], APP_ID)) || [];
    state.customMods = (global.RollupBridge && RollupBridge.storage.get(cmKey, [], APP_ID)) || [];
    state.liveScans = (global.RollupBridge && RollupBridge.storage.get(lsKey, {}, APP_ID)) || {};
  }

  function saveVehicles() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(KEY_VEHICLES, state.vehicles, APP_ID);
      RollupBridge.storage.set(KEY_ACTIVE_VID, state.activeVehicleId, APP_ID);
      if (state.activeVehicleId === 1) {
        RollupBridge.storage.set(KEY_PROFILE, state.profile, APP_ID);
      }
    }
  }

  function saveProfile() {
    const idx = state.vehicles.findIndex((v) => v.id === state.activeVehicleId);
    if (idx !== -1) {
      state.vehicles[idx] = state.profile;
    }
    saveVehicles();
  }

  function saveModOverrides() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(getScopedKey(KEY_MOD_OVERRIDES, state.activeVehicleId), state.modOverrides, APP_ID);
    }
  }

  function saveBackups() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(getScopedKey(KEY_BACKUPS, state.activeVehicleId), state.backups, APP_ID);
    }
  }

  function saveCustomMods() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(getScopedKey(KEY_CUSTOM_MODS, state.activeVehicleId), state.customMods, APP_ID);
    }
  }

  function saveChangeLog() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(getScopedKey(KEY_CHANGE_LOG, state.activeVehicleId), state.changeLog, APP_ID);
    }
  }

  function saveLiveScans() {
    if (global.RollupBridge) {
      RollupBridge.storage.set(getScopedKey(KEY_LIVE_SCANS, state.activeVehicleId), state.liveScans, APP_ID);
    }
  }

  function savePcSyncUrl(urlStr) {
    state.pcSync.url = String(urlStr || '').trim().replace(/\/+$/, '');
    if (global.RollupBridge) {
      RollupBridge.storage.set(KEY_PC_SYNC_URL, state.pcSync.url, APP_ID);
    }
  }

  // --- Merged View of Current As-Built State & Entries ---
  function getMergedTruckState() {
    const merged = {};
    const hasRealBackups = state.backups.some(
      (b) => !b.is_synthetic && String(b.source || '').trim().toUpperCase() !== 'SYNTHETIC'
    );
    state.backups
      .filter(
        (b) =>
          b.kind === 'FORSCAN_BACKUP' &&
          (!hasRealBackups || (!b.is_synthetic && String(b.source || '').trim().toUpperCase() !== 'SYNTHETIC'))
      )
      .forEach((b) => {
        Object.assign(merged, b.dict || {});
      });
    if (Object.keys(merged).length === 0) {
      state.backups
        .filter((b) => b.kind === 'FORD_AB' && !b.is_synthetic)
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

  function getHydratedEntries(includeAllPlatforms = false) {
    const truckState = getMergedTruckState();
    const upPlat = resolveUpstreamPlatform(state.profile.platform_slug);
    const pt = String(state.profile.powertrain || 'BEV').toUpperCase();
    const baseEntries = includeAllPlatforms || state.modFilters.allPlatforms
      ? [...state.customMods, ...(BUNDLE.entries || [])]
      : [...state.customMods, ...(BUNDLE.entries || []).filter((e) => (e.platform_slug || 'f150') === upPlat)];

    return baseEntries.map((raw) => {
      const ov = state.modOverrides[raw.id] || {};
      const entry = {
        ...raw,
        status: ov.status || raw.status || 'DRAFT',
        wanted: ov.wanted !== undefined ? ov.wanted : raw.wanted || 0,
        verified_on_my_truck: ov.verified_on_my_truck !== undefined ? ov.verified_on_my_truck : raw.verified_on_my_truck || 0,
        user_notes: ov.user_notes !== undefined ? ov.user_notes : raw.user_notes || ''
      };
      const r = GarageEngine.readiness(entry, truckState, pt);
      return { ...entry, _readiness: r };
    });
  }

  // --- Navigation ---
  global.switchTab = function (tabName) {
    if (tabName !== 'truck') stopCameraStream();
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
    renderGarageSwitcherStrip();
    updateHeaderKPIs();
    if (state.activeTab === 'truck') renderTruckTab();
    else if (state.activeTab === 'mods') renderModsTab();
    else if (state.activeTab === 'modules') renderModulesTab();
    else if (state.activeTab === 'backups') renderBackupsTab();
    else if (state.activeTab === 'plan') renderPlanTab();
  }

  function renderGarageSwitcherStrip() {
    const el = document.getElementById('garage-switcher-strip');
    if (!el) return;
    const opts = state.vehicles
      .map((v) => {
        const badge = v.powertrain === 'BEV' ? '⚡ ' : '🚘 ';
        const label = v.nickname || `${v.model_year || ''} ${v.make || 'Ford'} ${v.model || ''} ${v.trim || ''}`.trim();
        const vinTail = v.vin ? `..${String(v.vin).slice(-6)}` : 'no VIN';
        return `<option value="${v.id}" ${v.id === state.activeVehicleId ? 'selected' : ''}>${badge}${escapeHtml(label)} (${escapeHtml(vinTail)})</option>`;
      })
      .join('');

    el.innerHTML = `
      <span style="font-size:11px;font-weight:800;color:#93c5fd;">Active Vehicle:</span>
      <select class="field-input" style="width:auto;flex:1;min-width:190px;padding:5px 8px;font-size:12px;" onchange="switchActiveVehicle(this.value)">
        ${opts}
      </select>
      <button class="btn btn-primary" style="padding:5px 9px;font-size:11px;" onclick="openAddVehicleDrawer()">➕ Add Vehicle</button>
      ${
        state.vehicles.length > 1
          ? `<button class="btn btn-danger" style="padding:5px 8px;font-size:11px;" onclick="deleteActiveVehicle()" title="Remove active vehicle">🗑️</button>`
          : ''
      }
    `;
  }

  global.switchActiveVehicle = function (vidStr) {
    const vid = parseInt(vidStr, 10);
    const veh = state.vehicles.find((v) => v.id === vid);
    if (!veh) return;
    state.activeVehicleId = vid;
    state.profile = veh;
    state.selectedPlatformSlug = veh.platform_slug || 'f150_14g';
    saveVehicles();
    loadScopedVehicleData(vid);
    renderActiveTab();
    showToast(`Switched to ${veh.nickname || `${veh.model_year} ${veh.model}`}`);
  };

  global.openAddVehicleDrawer = function () {
    state.addVehicleOpen = !state.addVehicleOpen;
    if (state.activeTab !== 'truck') {
      switchTab('truck');
    } else {
      renderTruckTab();
    }
  };

  global.deleteActiveVehicle = function () {
    if (state.vehicles.length <= 1) return;
    const cur = state.profile;
    state.vehicles = state.vehicles.filter((v) => v.id !== cur.id);
    state.activeVehicleId = state.vehicles[0].id;
    state.profile = state.vehicles[0];
    state.selectedPlatformSlug = state.profile.platform_slug || 'f150_14g';
    saveVehicles();
    loadScopedVehicleData(state.activeVehicleId);
    renderActiveTab();
    showToast('Removed vehicle from garage.');
  };

  function updateHeaderKPIs() {
    const entries = getHydratedEntries(false);
    const wantedCount = entries.filter((e) => e.wanted).length;
    const readyCount = entries.filter((e) => e._readiness.can_apply).length;
    const backupCount = state.backups.length;
    const p = state.profile;
    const g = GarageEngine.adapterGuidance(p.model_year, p.platform_slug);

    const badgeWanted = document.getElementById('nav-badge-wanted');
    if (badgeWanted) badgeWanted.textContent = String(wantedCount);
    const badgePlan = document.getElementById('nav-badge-plan');
    if (badgePlan) badgePlan.textContent = String(wantedCount);

    const stripEl = document.getElementById('top-status-strip');
    if (stripEl) {
      const synthWarn = isSyntheticBaselineActive()
        ? `<span class="pill pill-amber">🧪 Synthetic Demo Baseline</span>`
        : backupCount > 0
        ? `<span class="pill pill-green">🛡️ ${backupCount} Backup(s)</span>`
        : `<span class="pill pill-muted">📂 No .abt/.ab Yet</span>`;
      const msCanBadge = g.ms_can_required
        ? `<span class="pill pill-amber" title="${escapeHtml(g.note)}">⚠️ MS-CAN 125k (STP53)</span>`
        : `<span class="pill pill-dark">HS-CAN / CAN-FD</span>`;

      stripEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span class="pill pill-blue">${p.powertrain === 'BEV' ? '⚡' : '🚘'} ${escapeHtml(p.model_year)} ${escapeHtml(p.model)} ${escapeHtml(p.trim || '')} • ${escapeHtml(p.powertrain || 'BEV')}</span>
          ${msCanBadge}
          <span class="pill pill-purple">⭐ ${wantedCount} Wanted</span>
          <span class="pill pill-green">🟢 ${readyCount} Ready</span>
          ${synthWarn}
        </div>
      `;
    }
  }

  // =========================================================================
  // TAB 1: MULTI-VEHICLE GARAGE, HYBRID VIN SCANNER & PLATFORM SPREADSHEETS
  // =========================================================================
  function renderTruckTab() {
    const container = document.getElementById('truck-tab-content');
    if (!container) return;

    const p = state.profile;
    const offline = GarageEngine.decodeVinOffline(p.vin);
    const online = p.vin_online;
    const entries = getHydratedEntries(false);
    const wanted = entries.filter((e) => e.wanted);
    const ready = entries.filter((e) => e._readiness.can_apply);
    const approved = entries.filter((e) => e.status === 'APPROVED');
    const g = GarageEngine.adapterGuidance(p.model_year, p.platform_slug);

    const platforms = BUNDLE.ford_platforms || [];
    const activePlatSlug = state.selectedPlatformSlug || p.platform_slug || 'f150_14g';
    const activePlat = platforms.find((pl) => pl.slug === activePlatSlug) || platforms[0] || null;

    let vinDecodeHtml = '';
    if (!offline.ok) {
      vinDecodeHtml = `<div class="alert alert-red" style="margin-top:8px;">❌ ${escapeHtml((offline.problems || []).join('; '))}</div>`;
    } else {
      const chkBadge = offline.check_digit.valid
        ? `<span class="pill pill-green">✓ ISO 3779 Modulo-11 Check Digit '${escapeHtml(offline.check_digit.actual)}' Valid</span>`
        : `<span class="pill pill-amber">⚠️ Check Digit '${escapeHtml(offline.check_digit.actual)}' (Expected '${escapeHtml(offline.check_digit.expected)}')</span>`;

      const onlineBlock = online && online.fields
        ? `
          <div style="margin-top:10px;padding:10px;background:#061224;border:1px solid #1e3a8a;border-radius:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <strong style="font-size:11.5px;color:#38bdf8;">🌐 NHTSA vPIC Verified Telemetry</strong>
              <span class="pill pill-green">Powertrain: ${escapeHtml(online.powertrain || p.powertrain || 'BEV')}</span>
            </div>
            <div class="kv-grid">
              <div><span class="kv-label">Make / Model:</span> <strong>${escapeHtml(online.fields.Make)} ${escapeHtml(online.fields.Model)}</strong></div>
              <div><span class="kv-label">Series / Cab:</span> <strong>${escapeHtml(online.fields.Series)} (${escapeHtml(online.fields.BodyCabType || online.fields.BodyClass)})</strong></div>
              <div><span class="kv-label">Pack / Engine:</span> <strong style="color:#34d399;">${escapeHtml(online.fields._resolvedPack || online.fields.BatteryInfo || online.fields.EngineModel || p.battery)}</strong></div>
              <div><span class="kv-label">Drive / GVWR:</span> <strong>${escapeHtml(online.fields.DriveType)} • ${escapeHtml(online.fields.GVWR)}</strong></div>
              <div><span class="kv-label">Assembly Plant:</span> <strong>${escapeHtml(online.fields.PlantCity)}, ${escapeHtml(online.fields.PlantCountry)}</strong></div>
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
            <div><span class="kv-label">Series (Pos 5–7):</span> <strong>${escapeHtml(offline.series_code)} — ${escapeHtml(offline.series_meaning)}</strong></div>
            <div><span class="kv-label">Platform Slug:</span> <strong style="color:#38bdf8;">${escapeHtml(offline.platform_slug || p.platform_slug)}</strong></div>
            <div><span class="kv-label">Pack / Engine (Pos 8='${escapeHtml(offline.engine_code)}'):</span> <strong>${escapeHtml(offline.inferred_pack || p.battery || 'Standard')}</strong></div>
            <div><span class="kv-label">Model Year (Pos 10):</span> <strong>${escapeHtml(offline.model_year || (offline.model_year_candidates || []).join('/') || p.model_year)}</strong></div>
            <div><span class="kv-label">Plant (Pos 11='${escapeHtml(offline.plant_code)}'):</span> <strong>${escapeHtml(offline.plant_meaning)} • Serial #${escapeHtml(offline.serial)}</strong></div>
          </div>
          ${onlineBlock}
        </div>
      `;
    }

    const addVehHtml = state.addVehicleOpen
      ? `
        <div class="card" style="border-color:#38bdf8;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h3 style="margin:0;font-size:14px;color:#38bdf8;">➕ Add Another Ford or Lincoln Vehicle (2011–2026+)</h3>
            <button class="btn btn-secondary" style="padding:3px 8px;" onclick="openAddVehicleDrawer()">✕</button>
          </div>
          <div class="form-grid">
            <div>
              <label class="field-label">17-Character VIN (or 18-char Barcode)</label>
              <input type="text" id="new-veh-vin" class="field-input" maxlength="20" placeholder="e.g. 1FTFW1E50MFA12345">
            </div>
            <div>
              <label class="field-label">Year, Make &amp; Model</label>
              <div style="display:flex;gap:5px;">
                <input type="number" id="new-veh-year" class="field-input" style="width:32%;" value="2021" min="2011" max="2027">
                <select id="new-veh-make" class="field-input" style="width:30%;">
                  <option value="Ford">Ford</option>
                  <option value="Lincoln">Lincoln</option>
                </select>
                <input type="text" id="new-veh-model" class="field-input" style="width:38%;" placeholder="F-150, Bronco, Super Duty">
              </div>
            </div>
            <div>
              <label class="field-label">Trim &amp; Powertrain</label>
              <div style="display:flex;gap:5px;">
                <input type="text" id="new-veh-trim" class="field-input" style="width:45%;" placeholder="Lariat, XLT, Raptor">
                <select id="new-veh-pt" class="field-input" style="width:55%;">
                  <option value="">Auto-Detect Powertrain</option>
                  <option value="ICE_GAS">Gasoline / EcoBoost (ICE_GAS)</option>
                  <option value="ICE_DIESEL">Power Stroke Diesel (ICE_DIESEL)</option>
                  <option value="HEV">PowerBoost / Hybrid (HEV)</option>
                  <option value="PHEV">Plug-In Hybrid (PHEV)</option>
                  <option value="BEV">Battery Electric (⚡ BEV)</option>
                </select>
              </div>
            </div>
            <div style="display:flex;align-items:flex-end;">
              <button class="btn btn-primary" style="width:100%;" onclick="createNewVehicleFromForm()">✓ Save &amp; Switch to Vehicle</button>
            </div>
          </div>
        </div>
      `
      : '';

    const scannerHtml = state.scannerOpen
      ? `
        <div style="margin:10px 0;padding:11px;background:#081224;border:1px solid #0284c7;border-radius:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="font-size:12.5px;color:#38bdf8;">📷 Hybrid VIN Barcode, Photo &amp; Modulo-11 OCR Scanner</strong>
            <button class="btn btn-secondary" style="padding:3px 8px;font-size:11px;" onclick="toggleVinScanner()">Close</button>
          </div>
          <p style="margin:0 0 8px 0;font-size:11px;color:#94a3b8;">
            Scan a door-jamb Code 39 / DataMatrix barcode (auto-strips Ford's 18th-char <code>I</code>/<code>*</code> guard), snap a photo of a windshield VIN plate (with Canvas CLAHE contrast enhancement), or run deterministic ISO 3779 Modulo-11 optical repair.
          </p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
            <button class="btn btn-primary" onclick="startLiveVinCamera()">🎥 Live Barcode Camera</button>
            <button class="btn btn-blue" onclick="captureVinPhotoViaBridge()">📸 Snap / Upload VIN Photo</button>
            <input id="mob-vin-file-input" type="file" accept="image/*" capture="environment" style="display:none" onchange="handleMobileVinPhoto(this.files[0])">
            <button class="btn btn-secondary" onclick="runGeminiVisionVinFallback()">🤖 Gemini Vision Plate OCR</button>
          </div>
          <video id="mob-vin-video" playsinline muted style="display:none;width:100%;max-height:220px;border:2px solid #38bdf8;border-radius:8px;margin-bottom:6px;"></video>
          <canvas id="mob-clahe-canvas" style="display:none;width:100%;max-height:180px;border:1px solid #334155;border-radius:6px;margin-bottom:6px;"></canvas>
          <div style="display:flex;gap:6px;">
            <input type="text" id="mob-ocr-raw" class="field-input" style="font-family:monospace;" placeholder="Paste raw barcode / OCR string (e.g. I1FT6W1EV4PWG11434)">
            <button class="btn btn-amber" onclick="runDeterministicVinRepair()">🔧 Modulo-11 Repair</button>
          </div>
          <div id="mob-scan-status" style="margin-top:6px;font-size:11.5px;"></div>
        </div>
      `
      : '';

    const platOptsHtml = platforms
      .map((pl) => `<option value="${escapeHtml(pl.slug)}" ${pl.slug === activePlatSlug ? 'selected' : ''}>${escapeHtml(pl.name)} [${escapeHtml(pl.architecture)}]</option>`)
      .join('');

    const platDownloadsHtml = activePlat
      ? `
        <div style="font-size:11.5px;color:#93c5fd;margin-bottom:8px;">${escapeHtml(activePlat.adapter_note || '')}</div>
        ${(activePlat.downloads || [])
          .map(
            (dl) => `
          <div style="padding:9px 11px;background:#090e1a;border:1px solid #1e293b;border-radius:9px;margin-bottom:6px;">
            <div style="font-weight:800;font-size:12.5px;color:#f8fafc;margin-bottom:5px;">
              ${escapeHtml(dl.title)} <span style="font-weight:400;color:#94a3b8;font-size:11px;">by ${escapeHtml(dl.author || 'Community')}</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${dl.xlsx_url ? `<a href="${escapeHtml(dl.xlsx_url)}" target="_blank" rel="noopener" class="btn btn-primary" style="padding:5px 9px;font-size:11px;">📥 Download .XLSX</a>` : ''}
              ${dl.pdf_url ? `<a href="${escapeHtml(dl.pdf_url)}" target="_blank" rel="noopener" class="btn btn-blue" style="padding:5px 9px;font-size:11px;">📄 Download .PDF</a>` : ''}
              ${dl.sheet_url ? `<a href="${escapeHtml(dl.sheet_url)}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding:5px 9px;font-size:11px;">📊 Google Sheet &nearr;</a>` : ''}
              ${dl.forum_url ? `<a href="${escapeHtml(dl.forum_url)}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding:5px 9px;font-size:11px;">💬 Forum &nearr;</a>` : ''}
            </div>
          </div>
        `
          )
          .join('')}
        <div style="margin-top:8px;font-size:11.5px;color:#cbd5e1;">
          <strong style="color:#38bdf8;">Popular Mods on ${escapeHtml(activePlat.short_name || activePlat.name)}:</strong>
          <ul style="margin:4px 0 0 18px;padding:0;line-height:1.45;">
            ${(activePlat.top_mods || []).map((m) => `<li>${escapeHtml(m)}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

    container.innerHTML = `
      ${addVehHtml}

      <!-- Hero Vehicle Card -->
      <div class="card card-accent">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
          <div>
            <div style="font-size:10.5px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.6px;">
              ${p.powertrain === 'BEV' ? '⚡ Electric Vehicle Profile' : '🚘 Ford / Lincoln Vehicle Profile'} • Blue Oval Garage v2.0
            </div>
            <h2 style="margin:3px 0 4px 0;font-size:18px;color:#f8fafc;">
              ${escapeHtml(p.model_year)} ${escapeHtml(p.make || 'Ford')} ${escapeHtml(p.model)} ${escapeHtml(p.trim || '')}
            </h2>
            <div style="font-size:12px;color:#cbd5e1;">
              <strong>${escapeHtml(p.battery || p.powertrain || 'Standard')}</strong> • Platform: <code>${escapeHtml(p.platform_slug || 'f150_14g')}</code> • <code>${escapeHtml(p.vin)}</code>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="switchTab('mods')">🎛️ Browse ${entries.length} Platform Mods</button>
            <button class="btn btn-secondary" onclick="switchTab('plan')">📋 Session Plan (${wanted.length})</button>
          </div>
        </div>

        ${
          g.ms_can_required
            ? `<div class="alert alert-amber" style="margin-top:10px;"><strong>⚠️ 125 kbaud MS-CAN Vehicle (${escapeHtml(g.architecture)}):</strong> ${escapeHtml(g.note)}</div>`
            : ''
        }

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

      <!-- VIN Entry + Hybrid Barcode / Photo / OCR Scanner Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <h3 style="margin:0;font-size:14px;color:#f8fafc;">🔢 VIN Decoder &amp; Barcode / Photo Scanner</h3>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-amber" onclick="toggleVinScanner()">📷 Scan Barcode / VIN Plate</button>
            <button class="btn btn-secondary" onclick="copyVinToClipboard()">📋 Copy VIN</button>
            <button class="btn btn-blue" id="btn-nhtsa-lookup" onclick="runOnlineVinDecode()">🌐 Verify w/ NHTSA vPIC</button>
          </div>
        </div>

        ${scannerHtml}

        <div class="form-grid">
          <div>
            <label class="field-label">17-Character VIN</label>
            <input type="text" id="inp-vin" class="field-input" maxlength="20" value="${escapeHtml(p.vin)}" oninput="onProfileInput()">
          </div>
          <div>
            <label class="field-label">Model Year, Model &amp; Trim</label>
            <div style="display:flex;gap:5px;">
              <input type="number" id="inp-year" class="field-input" style="width:28%;" value="${escapeHtml(p.model_year)}" oninput="onProfileInput()">
              <input type="text" id="inp-model" class="field-input" style="width:40%;" value="${escapeHtml(p.model)}" oninput="onProfileInput()">
              <input type="text" id="inp-trim" class="field-input" style="width:32%;" value="${escapeHtml(p.trim)}" oninput="onProfileInput()">
            </div>
          </div>
          <div>
            <label class="field-label">Powertrain &amp; Pack / Engine</label>
            <div style="display:flex;gap:5px;">
              <select id="inp-pt" class="field-input" style="width:42%;" onchange="onProfileInput()">
                <option value="BEV" ${p.powertrain === 'BEV' ? 'selected' : ''}>⚡ BEV</option>
                <option value="ICE_GAS" ${p.powertrain === 'ICE_GAS' ? 'selected' : ''}>⛽ Gas / EcoBoost</option>
                <option value="ICE_DIESEL" ${p.powertrain === 'ICE_DIESEL' ? 'selected' : ''}>🛢️ Power Stroke Diesel</option>
                <option value="HEV" ${p.powertrain === 'HEV' ? 'selected' : ''}>🔋 Hybrid / PowerBoost</option>
                <option value="PHEV" ${p.powertrain === 'PHEV' ? 'selected' : ''}>🔌 Plug-In Hybrid</option>
              </select>
              <input type="text" id="inp-battery" class="field-input" style="width:58%;" value="${escapeHtml(p.battery)}" oninput="onProfileInput()">
            </div>
          </div>
          <div>
            <label class="field-label">OBD Adapter &amp; Installed Options</label>
            <input type="text" id="inp-options" class="field-input" value="${escapeHtml(p.options)}" oninput="onProfileInput()">
          </div>
        </div>

        ${vinDecodeHtml}
      </div>

      <!-- Vehicle-Specific FORScan Spreadsheets & Downloads Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">📥 Vehicle-Specific FORScan Spreadsheets &amp; Downloads (2011–2026+)</h3>
            <p style="margin:2px 0 0 0;font-size:11.5px;color:#94a3b8;">
              1-tap <code>.xlsx</code> &amp; <code>.pdf</code> exports of community master spreadsheets (Livnitup, ZooDad, DanMc85) for offline reference.
            </p>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <select class="field-input" onchange="onSelectPlatformGuide(this.value)">
            ${platOptsHtml}
          </select>
        </div>
        ${platDownloadsHtml}
      </div>

      <!-- Fast Baseline / Demo Loader Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">🚀 Quick Baseline &amp; Dry-Run Setup</h3>
            <p style="margin:3px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Import your vehicle's real FORScan <code>.abt</code> or Ford <code>.ab</code> XML file—or load a synthetic demo baseline to preview exact nibble/checksum math right now.
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

      <!-- Phone <-> PC Vault Sync Card -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">💾 RollupOS Vault &amp; PC Sync</h3>
            <p style="margin:3px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Export your complete Blue Oval Garage state (all vehicles, starred mods, custom lines, and imported <code>.abt</code>/<code>.ab</code> backups) to a portable JSON file.
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

  global.onSelectPlatformGuide = function (slug) {
    state.selectedPlatformSlug = slug;
    renderTruckTab();
  };

  global.createNewVehicleFromForm = function () {
    const rawVin = ((document.getElementById('new-veh-vin') || {}).value || '').trim();
    const vin = GarageEngine.normalizeVin(rawVin);
    let yr = parseInt((document.getElementById('new-veh-year') || {}).value, 10) || 2021;
    let make = (document.getElementById('new-veh-make') || {}).value || 'Ford';
    let model = ((document.getElementById('new-veh-model') || {}).value || '').trim();
    const trim = ((document.getElementById('new-veh-trim') || {}).value || '').trim();
    let pt = (document.getElementById('new-veh-pt') || {}).value || '';

    let offline = null;
    if (vin) {
      offline = GarageEngine.decodeVinOffline(vin);
      if (!offline.ok) {
        showToast((offline.problems || []).join('; '), true);
        return;
      }
      if (offline.model_year) yr = offline.model_year;
      if (offline.inferred && offline.inferred.make) make = offline.inferred.make;
      if (!model && offline.inferred && offline.inferred.model) model = offline.inferred.model;
    }
    model = model || 'F-150';
    pt = pt || GarageEngine.classifyPowertrain(offline, null, model, '');
    const platformSlug = GarageEngine.resolvePlatformSlug(model, yr, vin, make);
    const newId = Date.now();
    const newVeh = {
      id: newId,
      vin: vin || '',
      nickname: `${yr} ${make} ${model} ${trim}`.trim(),
      make,
      model_year: yr,
      model,
      platform_slug: platformSlug,
      trim,
      powertrain: pt,
      battery: (offline && offline.inferred_pack) || pt,
      options: '',
      adapter: 'OBDLink EX',
      forscan_license: 'Extended License',
      odometer: '',
      vin_online: null
    };
    state.vehicles.push(newVeh);
    state.activeVehicleId = newId;
    state.profile = newVeh;
    state.selectedPlatformSlug = platformSlug;
    state.addVehicleOpen = false;
    saveVehicles();
    loadScopedVehicleData(newId);
    renderActiveTab();
    showToast(`Added & activated ${newVeh.nickname}!`);
  };

  global.toggleVinScanner = function () {
    state.scannerOpen = !state.scannerOpen;
    if (!state.scannerOpen) stopCameraStream();
    renderTruckTab();
  };

  function stopCameraStream() {
    if (camTimer) {
      clearInterval(camTimer);
      camTimer = null;
    }
    if (camStream) {
      camStream.getTracks().forEach((t) => t.stop());
      camStream = null;
    }
  }

  global.startLiveVinCamera = async function () {
    const vid = document.getElementById('mob-vin-video');
    const st = document.getElementById('mob-scan-status');
    if (!vid) return;
    try {
      camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      vid.srcObject = camStream;
      vid.style.display = 'block';
      await vid.play();
      if (st) st.innerHTML = `<span style="color:#93c5fd;">Point camera at door-jamb VIN barcode or windshield VIN plate...</span>`;
      if ('BarcodeDetector' in global) {
        const det = new global.BarcodeDetector({ formats: ['code_39', 'code_128', 'data_matrix', 'qr_code', 'pdf417'] });
        camTimer = setInterval(async () => {
          if (!camStream) return;
          try {
            const codes = await det.detect(vid);
            if (codes && codes.length) {
              const raw = codes[0].rawValue || '';
              const rawInp = document.getElementById('mob-ocr-raw');
              if (rawInp) rawInp.value = raw;
              stopCameraStream();
              vid.style.display = 'none';
              runDeterministicVinRepair();
            }
          } catch (_) {}
        }, 350);
      }
    } catch (err) {
      if (st) st.innerHTML = `<span style="color:#f87171;">Camera unavailable (${escapeHtml(err.message)}). Use Photo Upload or paste text below.</span>`;
    }
  };

  global.captureVinPhotoViaBridge = async function () {
    if (global.RollupBridge && RollupBridge.camera && typeof RollupBridge.camera.capturePhoto === 'function') {
      try {
        const photoRes = await RollupBridge.camera.capturePhoto({ quality: 0.9, facingMode: 'environment' });
        if (photoRes && (photoRes.dataUrl || photoRes.base64)) {
          const src = photoRes.dataUrl || `data:image/jpeg;base64,${photoRes.base64}`;
          const resp = await fetch(src);
          const blob = await resp.blob();
          handleMobileVinPhoto(blob);
          return;
        }
      } catch (_) {}
    }
    const inp = document.getElementById('mob-vin-file-input');
    if (inp) inp.click();
  };

  global.handleMobileVinPhoto = function (file) {
    if (!file) return;
    const st = document.getElementById('mob-scan-status');
    if (st) st.innerHTML = `<span style="color:#93c5fd;">Applying CLAHE high-contrast filter &amp; scanning barcode...</span>`;
    const img = new Image();
    img.onload = async () => {
      const c = document.getElementById('mob-clahe-canvas');
      if (c) {
        const ctx = c.getContext('2d');
        const w = Math.min(960, img.naturalWidth || img.width || 640);
        const h = Math.round((img.naturalHeight || img.height || 240) * (w / (img.naturalWidth || img.width || 640)));
        c.width = w;
        c.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const id = ctx.getImageData(0, 0, w, h);
        const d = id.data;
        let min = 255;
        let max = 0;
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          if (lum < min) min = lum;
          if (lum > max) max = lum;
        }
        const span = Math.max(1, max - min);
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          const norm = Math.min(255, Math.max(0, Math.round(((lum - min) / span) * 255)));
          const sharp = norm > 128 ? Math.min(255, norm + 28) : Math.max(0, norm - 28);
          d[i] = d[i + 1] = d[i + 2] = sharp;
        }
        ctx.putImageData(id, 0, 0);
        c.style.display = 'block';
      }
      if ('BarcodeDetector' in global) {
        try {
          const det = new global.BarcodeDetector({ formats: ['code_39', 'code_128', 'data_matrix', 'qr_code', 'pdf417'] });
          let codes = await det.detect(img);
          if ((!codes || !codes.length) && c) codes = await det.detect(c);
          if (codes && codes.length) {
            const rawInp = document.getElementById('mob-ocr-raw');
            if (rawInp) rawInp.value = codes[0].rawValue || '';
            runDeterministicVinRepair();
            return;
          }
        } catch (_) {}
      }
      if (st) {
        st.innerHTML = `<span style="color:#fbbf24;">CLAHE contrast preview ready. Tap <strong>🤖 Gemini Vision Plate OCR</strong> or type/paste characters above and tap <strong>🔧 Modulo-11 Repair</strong>.</span>`;
      }
    };
    img.src = URL.createObjectURL(file);
  };

  global.runDeterministicVinRepair = function () {
    const raw = ((document.getElementById('mob-ocr-raw') || {}).value || '').trim();
    const st = document.getElementById('mob-scan-status');
    if (!raw) {
      if (st) st.innerHTML = `<span style="color:#f87171;">Enter or scan a raw barcode/OCR string first.</span>`;
      return;
    }
    const res = GarageEngine.repairAndValidateVinCandidates(raw, 2);
    if (res.ok && res.best) {
      const b = res.best;
      state.profile.vin = b.vin;
      if (b.model_year) state.profile.model_year = b.model_year;
      if (b.inferred && b.inferred.model) state.profile.model = b.inferred.model;
      if (b.inferred && b.inferred.make) state.profile.make = b.inferred.make;
      if (b.platform_slug) {
        state.profile.platform_slug = b.platform_slug;
        state.selectedPlatformSlug = b.platform_slug;
      }
      state.profile.powertrain = GarageEngine.classifyPowertrain({ inferred: b.inferred }, null, state.profile.model, state.profile.battery);
      saveProfile();
      renderTruckTab();
      updateHeaderKPIs();
      showToast(`✓ Modulo-11 Verified VIN: ${b.vin}`);
    } else if (st) {
      st.innerHTML = `<span style="color:#f87171;">No 17-character candidate with a valid ISO 3779 Modulo-11 check digit found within 2 optical edits.</span>`;
    }
  };

  global.runGeminiVisionVinFallback = async function () {
    const st = document.getElementById('mob-scan-status');
    const c = document.getElementById('mob-clahe-canvas');
    if (!c || c.style.display === 'none') {
      if (st) st.innerHTML = `<span style="color:#fbbf24;">Snap or upload a VIN plate photo first so the CLAHE canvas is populated.</span>`;
      return;
    }
    let apiKey = global.RollupBridge && RollupBridge.vault && RollupBridge.vault.get('gemini_api_key');
    if (!apiKey && typeof global.prompt === 'function') {
      const entered = (global.prompt('Enter your Gemini API Key (optional — saved locally in RollupOS Key Vault):') || '').trim();
      if (entered) {
        apiKey = entered;
        if (global.RollupBridge && RollupBridge.vault && typeof RollupBridge.vault.set === 'function') {
          RollupBridge.vault.set('gemini_api_key', entered);
        }
      }
    }
    if (!apiKey) {
      if (st) st.innerHTML = `<span style="color:#fbbf24;">No Gemini API key configured in RollupOS Key Vault — use the deterministic Modulo-11 Repair box above.</span>`;
      return;
    }
    try {
      if (st) st.innerHTML = `<span style="color:#93c5fd;">⏳ Reading VIN plate via Gemini Vision + deterministic Modulo-11 gate...</span>`;
      const b64 = c.toDataURL('image/jpeg', 0.85).split(',')[1];
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: 'Extract the 17-character automotive VIN from this image. Return ONLY the raw 17-character alphanumeric string.' },
                { inlineData: { mimeType: 'image/jpeg', data: b64 } }
              ]
            }
          ]
        })
      });
      const data = await resp.json();
      const txt = (((data.candidates || [])[0] || {}).content || {}).parts?.[0]?.text || '';
      const rawInp = document.getElementById('mob-ocr-raw');
      if (rawInp) rawInp.value = txt.trim();
      runDeterministicVinRepair();
    } catch (err) {
      if (st) st.innerHTML = `<span style="color:#f87171;">Vision OCR error: ${escapeHtml(err.message)}</span>`;
    }
  };

  global.onProfileInput = function () {
    const vinEl = document.getElementById('inp-vin');
    const yrEl = document.getElementById('inp-year');
    const modEl = document.getElementById('inp-model');
    const trimEl = document.getElementById('inp-trim');
    const ptEl = document.getElementById('inp-pt');
    const batEl = document.getElementById('inp-battery');
    const optEl = document.getElementById('inp-options');
    if (vinEl) state.profile.vin = GarageEngine.normalizeVin(vinEl.value);
    if (yrEl) state.profile.model_year = parseInt(yrEl.value, 10) || 2023;
    if (modEl) state.profile.model = modEl.value.trim();
    if (trimEl) state.profile.trim = trimEl.value.trim();
    if (ptEl) state.profile.powertrain = ptEl.value;
    if (batEl) state.profile.battery = batEl.value;
    if (optEl) state.profile.options = optEl.value.trim();
    state.profile.platform_slug = GarageEngine.resolvePlatformSlug(
      state.profile.model,
      state.profile.model_year,
      state.profile.vin,
      state.profile.make
    );
    state.selectedPlatformSlug = state.profile.platform_slug;
    state.profile.nickname = `${state.profile.model_year} ${state.profile.make || 'Ford'} ${state.profile.model} ${state.profile.trim || ''}`.trim();
    saveProfile();
    renderGarageSwitcherStrip();
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
      if (res.fields) {
        if (res.fields.Make) state.profile.make = res.fields.Make;
        if (res.fields.Model) state.profile.model = res.fields.Model;
        if (res.fields.ModelYear && /^\d+$/.test(res.fields.ModelYear)) {
          state.profile.model_year = parseInt(res.fields.ModelYear, 10);
        }
        if (res.fields._resolvedPack) {
          state.profile.battery = res.fields._resolvedPack;
        }
      }
      if (res.powertrain) state.profile.powertrain = res.powertrain;
      if (res.platform_slug) {
        state.profile.platform_slug = res.platform_slug;
        state.selectedPlatformSlug = res.platform_slug;
      }
      state.profile.nickname = `${state.profile.model_year} ${state.profile.make || 'Ford'} ${state.profile.model} ${state.profile.trim || ''}`.trim();
      saveProfile();
      renderActiveTab();
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
    if (state.backups.some((b) => !b.is_synthetic && String(b.source || '').trim().toUpperCase() !== 'SYNTHETIC')) {
      showToast('Real vehicle backups are already loaded — demo baseline skipped so real bytes are never mixed.', true);
      return;
    }
    const abtText = GarageEngine.generateDemoAbtText(BUNDLE);
    const parsed = GarageEngine.parseAbtText(abtText);
    state.backups = state.backups.filter((b) => !b.is_synthetic);
    state.backups.push({
      id: 'synth-demo-1',
      label: 'SYNTHETIC DEMO BASELINE (Preview Only)',
      filename: 'synthetic_demo_baseline.abt',
      taken_at: new Date().toISOString().slice(0, 10),
      kind: 'FORSCAN_BACKUP',
      source: 'SYNTHETIC',
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
  // TAB 2: FORSCAN MOD MENU (183 RECIPES + CUSTOM SPREADSHEET BUILDER)
  // =========================================================================
  function renderModsTab() {
    const container = document.getElementById('mods-tab-content');
    if (!container) return;

    const allEntries = getHydratedEntries(state.modFilters.allPlatforms);
    const f = state.modFilters;
    const upPlat = resolveUpstreamPlatform(state.profile.platform_slug);
    const pt = String(state.profile.powertrain || 'BEV').toUpperCase();

    const modCounts = {};
    allEntries.forEach((e) => {
      const m = e.system || 'OTHER';
      modCounts[m] = (modCounts[m] || 0) + 1;
    });

    const filtered = allEntries.filter((e) => {
      if (f.chip === 'popular' && e.popularity < 2 && !e.is_custom) return false;
      if (f.chip === 'wanted' && !e.wanted) return false;
      if (f.chip === 'ready' && !e._readiness.can_apply) return false;
      if (f.chip === 'approved' && e.status !== 'APPROVED') return false;
      if (f.chip === 'ev_safe' && ((pt === 'BEV' && e.ev_status === 'ICE_ONLY') || e.tier === 3)) return false;
      if (f.module !== 'ALL' && e.system !== f.module) return false;
      if (f.tier !== 'ALL' && String(e.tier) !== String(f.tier)) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        const hay = `${e.title} ${e.category} ${e.system} ${e.system_name} ${e.platform_slug || ''} ${e.notes || ''}`.toLowerCase();
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
      { id: 'ev_safe', label: pt === 'BEV' ? '⚡ EV Compatible' : '✅ Safe Tier 1–2' }
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

    const customBuilderHtml = state.customBuilderOpen
      ? `
        <div class="card" style="border-color:#38bdf8;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="font-size:13px;color:#38bdf8;">➕ Quick-Add Custom Spreadsheet Line (Deterministic Mask &amp; Checksum)</strong>
            <button class="btn btn-secondary" style="padding:3px 8px;" onclick="toggleCustomModBuilder()">✕</button>
          </div>
          <p style="margin:0 0 8px 0;font-size:11px;color:#94a3b8;">
            Paste any row from your vehicle's downloaded FORScan spreadsheet (<code>.xlsx</code> or <code>.pdf</code>). Blue Oval Garage validates the address and mask, computes the exact target hex &amp; Modulo-256 checksum against your backup, and adds it to your Session Plan.
          </p>
          <div class="form-grid">
            <div>
              <label class="field-label">Feature Title</label>
              <input type="text" id="cust-title" class="field-input" placeholder="e.g. Disable Door Ajar Chime">
            </div>
            <div>
              <label class="field-label">Module &amp; Address (MMM-BB-LL)</label>
              <div style="display:flex;gap:5px;">
                <input type="text" id="cust-mod" class="field-input" style="width:35%;" placeholder="IPC / 720">
                <input type="text" id="cust-addr" class="field-input" style="width:65%;font-family:monospace;" placeholder="720-01-02">
              </div>
            </div>
            <div>
              <label class="field-label">Mask (* = Target Nibble) &amp; Target Hex</label>
              <div style="display:flex;gap:5px;">
                <input type="text" id="cust-mask" class="field-input" style="width:68%;font-family:monospace;" placeholder="xx*x xxxx xx--">
                <input type="text" id="cust-hex" class="field-input" style="width:32%;font-family:monospace;" placeholder="0">
              </div>
            </div>
            <div>
              <label class="field-label">Notes / Plain-English Menu</label>
              <input type="text" id="cust-notes" class="field-input" placeholder="Spreadsheet tab / notes">
            </div>
          </div>
          <div style="margin-top:8px;display:flex;justify-content:flex-end;">
            <button class="btn btn-primary" onclick="addCustomModFromMobileForm()">✓ Add &amp; Dry-Run Custom Line</button>
          </div>
        </div>
      `
      : '';

    const cardsHtml = filtered.length
      ? filtered.map((e) => renderModCardHtml(e)).join('')
      : `<div class="card" style="text-align:center;color:#94a3b8;padding:24px;">No mods match current filter. Tap "All (${allEntries.length})" above to reset.</div>`;

    container.innerHTML = `
      ${customBuilderHtml}

      <div class="card" style="padding:12px;">
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
          <input type="search" id="mod-search-inp" class="field-input" style="flex:1;min-width:180px;" placeholder="Search mods (e.g. double horn, bambi, glare, fold, chime)..." value="${escapeHtml(f.search)}" oninput="onModSearchInput(this.value)">
          <button class="btn btn-blue" onclick="toggleCustomModBuilder()">➕ Custom Line</button>
        </div>
        <div class="chip-row">${chipsHtml}</div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <select class="field-input" style="flex:1;min-width:140px;" onchange="setModModuleFilter(this.value)">${moduleOpts}</select>
          <select class="field-input" style="width:135px;" onchange="setModTierFilter(this.value)">
            <option value="ALL" ${f.tier === 'ALL' ? 'selected' : ''}>All Risk Tiers</option>
            <option value="1" ${f.tier === '1' ? 'selected' : ''}>🟢 Tier 1 (Low)</option>
            <option value="2" ${f.tier === '2' ? 'selected' : ''}>🟡 Tier 2 (Med)</option>
            <option value="3" ${f.tier === '3' ? 'selected' : ''}>🔴 Tier 3 (Locked)</option>
          </select>
          <label style="font-size:11.5px;color:#93c5fd;display:flex;align-items:center;gap:4px;cursor:pointer;">
            <input type="checkbox" ${f.allPlatforms ? 'checked' : ''} onchange="toggleAllPlatformsFilter(this.checked)">
            All 6 Ford Platforms (183)
          </label>
        </div>
      </div>

      <div style="font-size:11px;color:#94a3b8;margin:6px 2px;display:flex;justify-content:space-between;flex-wrap:wrap;">
        <span>Showing <strong>${filtered.length}</strong> of ${allEntries.length} recipes (${f.allPlatforms ? 'All 6 Platforms' : `Platform: ${escapeHtml(upPlat)}`})</span>
        <span>Tap any card for nibble mask &amp; checksum dry-run</span>
      </div>

      <div id="mod-cards-list">${cardsHtml}</div>
    `;
  }

  global.toggleCustomModBuilder = function () {
    state.customBuilderOpen = !state.customBuilderOpen;
    renderModsTab();
  };

  global.toggleAllPlatformsFilter = function (checked) {
    state.modFilters.allPlatforms = Boolean(checked);
    renderModsTab();
  };

  global.addCustomModFromMobileForm = function () {
    try {
      const entry = GarageEngine.buildCustomModEntry({
        title: (document.getElementById('cust-title') || {}).value,
        module: (document.getElementById('cust-mod') || {}).value,
        address: (document.getElementById('cust-addr') || {}).value,
        mask: (document.getElementById('cust-mask') || {}).value,
        targetHex: (document.getElementById('cust-hex') || {}).value,
        notes: (document.getElementById('cust-notes') || {}).value,
        platformSlug: resolveUpstreamPlatform(state.profile.platform_slug),
        modelYear: state.profile.model_year
      });
      state.customMods.unshift(entry);
      state.modOverrides[entry.id] = {
        status: entry.status,
        wanted: entry.wanted,
        verified_on_my_truck: 0,
        user_notes: entry.notes || ''
      };
      saveCustomMods();
      saveModOverrides();
      state.customBuilderOpen = false;
      renderModsTab();
      updateHeaderKPIs();
      openModDetailModal(entry.id);
      showToast(`Added custom mod: ${entry.title}`);
    } catch (err) {
      showToast(err.message, true);
    }
  };

  global.deleteCustomModById = function (id) {
    state.customMods = state.customMods.filter((m) => m.id !== id);
    delete state.modOverrides[id];
    saveCustomMods();
    saveModOverrides();
    closeModDetailModal();
    renderModsTab();
    updateHeaderKPIs();
    showToast('Deleted custom spreadsheet line.');
  };

  function renderModCardHtml(e) {
    const stars = '★'.repeat(e.popularity || 0) + '☆'.repeat(Math.max(0, 3 - (e.popularity || 0)));
    const tierBadge =
      e.tier === 1
        ? `<span class="pill pill-green">T1 Cosmetic</span>`
        : e.tier === 2
        ? `<span class="pill pill-amber">T2 Behavior</span>`
        : `<span class="pill pill-red">🔒 T3 Locked</span>`;

    const pt = String(state.profile.powertrain || 'BEV').toUpperCase();
    const evBadge = e.is_custom
      ? `<span class="pill pill-purple">✨ Custom Line</span>`
      : e.ev_status === 'EV_MENTIONED'
      ? `<span class="pill pill-blue">⚡ EV Verified</span>`
      : e.ev_status === 'ICE_ONLY'
      ? `<span class="pill pill-red">⛽ ICE Only</span>`
      : pt === 'BEV'
      ? `<span class="pill pill-muted">EV Unverified</span>`
      : `<span class="pill pill-dark">${escapeHtml(e.platform_slug || 'f150')}</span>`;

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
    const allRaw = [...state.customMods, ...(BUNDLE.entries || [])];
    const entry = allRaw.find((x) => x.id === id) || {};
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
    const entries = getHydratedEntries(true);
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
            ${escapeHtml(e.system)} (${escapeHtml(e.system_name || '')}) • ${escapeHtml(e.category)} • ${escapeHtml(e.platform_slug || 'f150')}
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
          ${
            e.is_custom
              ? `<button class="btn btn-danger" onclick="deleteCustomModById(${e.id})">🗑️ Delete Custom Line</button>`
              : ''
          }
        </div>
        <div style="margin-top:8px;">
          <label class="field-label">Personal Vehicle Notes</label>
          <input type="text" class="field-input" placeholder="e.g. Verified on my vehicle..." value="${escapeHtml(e.user_notes || '')}" onchange="updateModUserNotes(${e.id}, this.value)">
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
  // TAB 3: MODULES GUIDE (87 FORD MODULES + MS-CAN / HS-CAN ARCHITECTURE)
  // =========================================================================
  function renderModulesTab() {
    const container = document.getElementById('modules-tab-content');
    if (!container) return;

    const editorial = BUNDLE.module_editorial || {};
    const fordNames = BUNDLE.ford_modules || {};
    const fcodeNames = BUNDLE.ford_fcodes || {};
    const entries = getHydratedEntries(false);
    const g = GarageEngine.adapterGuidance(state.profile.model_year, state.profile.platform_slug);

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

        const msCanTag =
          g.ms_can_required && ['740', '741', '733', '791', '744'].includes(r.addr)
            ? `<span class="pill pill-amber">MS-CAN 125k (STP53)</span>`
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
              <div style="display:flex;gap:4px;flex-wrap:wrap;">${msCanTag}${riskBadge}</div>
            </div>
            ${r.does ? `<p style="margin:6px 0 0 0;font-size:12px;color:#cbd5e1;line-height:1.4;">${escapeHtml(r.does)}</p>` : ''}
            ${r.ev ? `<div style="margin-top:4px;font-size:11.5px;color:#38bdf8;"><strong>⚡ Architecture Note:</strong> ${escapeHtml(r.ev)}</div>` : ''}
            ${r.touch ? `<div style="margin-top:4px;font-size:11.5px;color:#fbbf24;"><strong>💡 Advice:</strong> ${escapeHtml(r.touch)}</div>` : ''}
            ${partsHtml}
            ${evidenceBadges.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">${evidenceBadges.join('')}</div>` : ''}
          </div>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="card">
        <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🧩 Ford &amp; Lincoln Control Module Architecture (${escapeHtml(g.architecture)})</h3>
        <p style="margin:0 0 8px 0;font-size:11.5px;color:#94a3b8;">
          ${escapeHtml(g.note)}
        </p>
        <div class="chip-row">
          <button class="chip-btn ${state.moduleFilter === 'PRESENT' ? 'active' : ''}" onclick="setModuleTabFilter('PRESENT')">⭐ Key Modules</button>
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
  // USB-C LIVE OBD-II ADAPTER, AS-BUILT SNAPSHOT & PC FORSCAN STAGING SYNC
  // =========================================================================
  function getTargetModulesForMode(mode) {
    const entries = getHydratedEntries(false);
    const wanted = entries.filter((e) => e.wanted || e.status === 'APPROVED');
    const reqSet = new Set();
    wanted.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const m = String(s.address || '').slice(0, 3).toUpperCase();
        if (/^[0-9A-F]{3}$/.test(m)) reqSet.add(m);
      });
    });
    if (mode === 'full_backup') {
      ['726', '720', '7D0', '740', '741', '724', '706', '733', '754', '716', '727', '736', '791'].forEach((m) => reqSet.add(m));
      return Array.from(reqSet);
    }
    if (mode === 'quick_health') {
      ['726', '720', '7D0', '706'].forEach((m) => reqSet.add(m));
      return Array.from(reqSet);
    }
    if (reqSet.size === 0) {
      return ['726', '720', '7D0'];
    }
    return Array.from(reqSet).sort();
  }

  function computeCurrentHandoff(fmtOverride) {
    const entries = getHydratedEntries(true).filter((e) => e.wanted && e.status === 'APPROVED');
    return GarageEngine.buildModdedAbtHandoff({
      entries,
      currentState: getMergedTruckState(),
      backups: state.backups,
      liveScan: state.liveScans,
      vehicle: state.profile || {},
      fmt: fmtOverride || state.abtExportFmt || 'encoded',
      modStates: state.modOverrides
    });
  }

  function collectKnownBlocksByModule() {
    const out = {};
    const addAddr = (addrStr) => {
      try {
        const a = GarageEngine.parseAddress(addrStr);
        if (!out[a.module]) out[a.module] = new Set();
        out[a.module].add(a.block);
      } catch (e) {}
    };
    [...(state.customMods || []), ...((BUNDLE && BUNDLE.entries) || [])].forEach((e) => {
      (e.steps || []).forEach((s) => addAddr(s.address));
    });
    (state.backups || []).forEach((b) => {
      Object.keys(b.dict || {}).forEach(addAddr);
    });
    const plain = {};
    Object.keys(out).forEach((m) => {
      plain[m] = Array.from(out[m]).sort((a, b) => a - b);
    });
    return plain;
  }

  global.setUsbScanOption = function (field, val) {
    state.usb[field] = val;
    if (field === 'allowExtended' && !val) {
      state.usb.confirmParked = false;
    }
    if (state.activeTab === 'backups') renderBackupsTab();
  };

  global.connectUsbAdapter = async function () {
    if (!global.RollupBridge || !RollupBridge.usbSerial) {
      showToast('RollupBridge USB Serial module unavailable.', true);
      return;
    }
    state.usb.busy = true;
    state.usb.lastError = '';
    renderActiveTab();
    try {
      const res = await RollupBridge.usbSerial.requestAndConnect({ baudRate: 115200, autoBaud: true });
      if (!res || !res.ok) {
        state.usb.connected = false;
        state.usb.lastError = (res && res.error) || 'Could not connect to USB-C OBD adapter.';
        showToast(state.usb.lastError, true);
      } else {
        state.usb.connected = true;
        const baudLabel = res.baudRate ? ` @ ${res.baudRate}` : '';
        state.usb.deviceInfo = `${res.productName || 'USB OBD Adapter'} (${res.driver || 'Serial'}${baudLabel})`;
        state.usb.readOnlyGate = Boolean(res.readOnlyHardwareGate);
        showToast(`Connected to ${state.usb.deviceInfo}`);
        await global.probeUsbVoltage(true);
      }
    } catch (err) {
      state.usb.connected = false;
      state.usb.lastError = err.message || String(err);
      showToast(state.usb.lastError, true);
    } finally {
      state.usb.busy = false;
      renderActiveTab();
    }
  };

  global.disconnectUsbAdapter = async function () {
    if (global.RollupBridge && RollupBridge.usbSerial) {
      await RollupBridge.usbSerial.disconnect();
    }
    state.usb.connected = false;
    state.usb.deviceInfo = '';
    state.usb.progressText = '';
    renderActiveTab();
    showToast('Disconnected USB-C adapter (ECU default session 10 01 restored).');
  };

  global.probeUsbVoltage = async function (silent = false) {
    if (!global.RollupBridge || !RollupBridge.usbSerial || !state.usb.connected) return;
    try {
      const r = await RollupBridge.usbSerial.transact('ATRV', 900, false);
      if (r && r.ok) {
        const v = GarageEngine.parseVoltageText(r.lines || []);
        if (v !== null) {
          state.usb.lastVoltage = v;
          if (!silent) {
            showToast(`12V Battery: ${v.toFixed(2)}V (${v >= 12.5 ? 'Ready >= 12.5V' : 'Low < 12.5V — turn truck to Ready mode'})`, v < 12.5);
          }
        }
      }
    } catch (e) {
      if (!silent) showToast(`ATRV check failed: ${e.message || e}`, true);
    }
    if (!silent) renderActiveTab();
  };

  global.startUsbVehicleScan = async function () {
    if (!global.RollupBridge || !RollupBridge.usbSerial) return;
    if (!state.usb.connected) {
      await global.connectUsbAdapter();
      if (!state.usb.connected) return;
    }
    if (state.usb.allowExtended && !state.usb.confirmParked) {
      showToast('Confirm vehicle is in PARK before enabling Extended Session (10 03) fallback.', true);
      return;
    }

    const mode = state.usb.mode || 'targeted_backup';
    const g = GarageEngine.adapterGuidance(state.profile.model_year, state.profile.platform_slug);
    const addresses = getTargetModulesForMode(mode);
    const knownBlocksByModule = collectKnownBlocksByModule();

    state.usb.busy = true;
    state.usb.lastError = '';
    state.usb.progressText = `Initializing adapter & checking 12V ATRV across ${addresses.length} module(s)...`;
    renderActiveTab();

    try {
      const scanRes = await GarageEngine.runUsbVehicleScan(RollupBridge.usbSerial, {
        mode,
        addresses,
        dualBus: Boolean(state.usb.dualBus),
        msCanFallback: Boolean(g.ms_can_required && state.usb.dualBus),
        allowExtendedSession: Boolean(state.usb.allowExtended && state.usb.confirmParked),
        confirmParked: Boolean(state.usb.confirmParked),
        overrideLowVoltage: Boolean(state.usb.overrideLowV),
        knownBlocksByModule,
        onProgress: (prog) => {
          state.usb.progressText = `Scanning 0x${prog.address} (${prog.step}/${prog.total}) on ${prog.bus}...`;
          const el = document.getElementById('usb-live-progress');
          if (el) el.textContent = state.usb.progressText;
        }
      });

      if (scanRes.voltage && scanRes.voltage.voltage !== null) {
        state.usb.lastVoltage = scanRes.voltage.voltage;
      }

      const nowIso = new Date().toISOString();
      const dateShort = nowIso.slice(0, 10);
      let importedCount = 0;
      let totalLinesSaved = 0;

      Object.entries(scanRes.modules || {}).forEach(([mod, mSnap]) => {
        state.liveScans[mod] = {
          address: mod,
          bus: mSnap.bus,
          f188: mSnap.f188 || null,
          vin: mSnap.vin || scanRes.vin || null,
          ids: mSnap.ids || {},
          dtcs: mSnap.dtcs || [],
          scanned_at: nowIso
        };

        if (mSnap.abt_encoded && mSnap.line_count > 0) {
          const safeVin = String(mSnap.vin || scanRes.vin || state.profile.vin || 'TRUCK').replace(/[^A-Z0-9]/gi, '');
          const fname = `${safeVin}_${mod}_${dateShort}_live.abt`;
          const rawUsb = mSnap.abt_encoded.includes('source=USB_LIVE')
            ? mSnap.abt_encoded
            : `; Blue Oval Garage Live USB Snapshot (source=USB_LIVE)\r\n${mSnap.abt_encoded}`;
          const parsed = GarageEngine.parseAnyBackupFile(fname, rawUsb);
          const rawPlainDigest = GarageEngine.sha256Hex(mSnap.abt_encoded);
          // Remove synthetic demo backups; keep authoritative FORSCAN_ABT if identical lines/sha256 already exist
          const existingAuth = state.backups.find(
            (b) =>
              !b.is_synthetic &&
              (b.sha256 === parsed.sha256 || b.sha256 === rawPlainDigest) &&
              b.kind === 'FORSCAN_BACKUP' &&
              !b.is_usb_live &&
              b.source !== 'USB_LIVE'
          );
          if (existingAuth) {
            existingAuth.software_version = mSnap.f188 || existingAuth.software_version || null;
          } else {
            state.backups = state.backups.filter(
              (b) => !b.is_synthetic && b.sha256 !== parsed.sha256 && b.sha256 !== rawPlainDigest
            );
            state.backups.push({
              id: `usb-${Date.now()}-${mod}`,
              label: `USB-C Live ${mod} (${mSnap.bus})`,
              filename: fname,
              taken_at: dateShort,
              kind: 'FORSCAN_BACKUP',
              source: 'USB_LIVE',
              is_usb_live: true,
              is_synthetic: false,
              vin: mSnap.vin || scanRes.vin || state.profile.vin,
              software_version: mSnap.f188 || null,
              modules: parsed.modules,
              line_count: parsed.lines.length,
              sha256: parsed.sha256,
              dict: parsed.dict,
              nodes: {},
              warnings: parsed.warnings || [],
              raw_text: rawUsb
            });
          }
          importedCount++;
          totalLinesSaved += parsed.lines.length;
        }
      });

      saveLiveScans();
      if (importedCount > 0) saveBackups();
      state.usb.lastResult = {
        mode,
        at: nowIso,
        vin: scanRes.vin,
        voltage: scanRes.voltage,
        respondedModules: Object.keys(scanRes.modules || {}),
        importedCount,
        totalLinesSaved
      };
      state.usb.progressText = '';
      showToast(
        importedCount > 0
          ? `Saved ${importedCount} live .abt backup(s) (${totalLinesSaved} lines) with F188 strategy tags!`
          : `Health scan complete: ${Object.keys(scanRes.modules || {}).length} module(s) responded.`
      );
    } catch (err) {
      if (err && err.lowVoltageBlocked && err.voltage != null) {
        state.usb.lastVoltage = err.voltage;
      }
      state.usb.lastError = (err && err.message) || String(err);
      state.usb.progressText = '';
      showToast(state.usb.lastError, true);
    } finally {
      state.usb.busy = false;
      renderActiveTab();
    }
  };

  function parsePairingText(rawStr) {
    const s = String(rawStr || '').trim();
    const m = /^(https?:\/\/[^#\s?]+?)\/?(?:[#?&]pin=(\d{6}))?$/i.exec(s);
    if (m) {
      return { url: m[1].replace(/\/+$/, ''), pin: m[2] || null };
    }
    return null;
  }

  global.updatePcSyncInputs = function () {
    const uEl = document.getElementById('pc-sync-url');
    const pEl = document.getElementById('pc-sync-pin');
    let pinExtractedFromUrl = false;
    if (uEl) {
      const parsed = parsePairingText(uEl.value);
      if (parsed) {
        savePcSyncUrl(parsed.url);
        uEl.value = parsed.url;
        if (parsed.pin) {
          pinExtractedFromUrl = true;
          state.pcSync.pin = parsed.pin;
          if (pEl) pEl.value = parsed.pin;
        }
      } else {
        savePcSyncUrl(uEl.value);
      }
    }
    if (pEl && !pinExtractedFromUrl) {
      const pinParsed = parsePairingText(pEl.value);
      if (pinParsed && pinParsed.pin) {
        savePcSyncUrl(pinParsed.url);
        state.pcSync.pin = pinParsed.pin;
        if (uEl) uEl.value = pinParsed.url;
        pEl.value = pinParsed.pin;
      } else {
        state.pcSync.pin = String(pEl.value || '').trim();
      }
    }
  };

  global.scanPcSyncQrImage = async function (event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (event && event.target) event.target.value = '';
    if (!file) return;
    if (typeof global.BarcodeDetector !== 'function') {
      showToast('QR BarcodeDetector not supported in this browser; paste Pairing URI or enter 6-digit PIN.', true);
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const detector = new global.BarcodeDetector({ formats: ['qr_code'] });
      const codes = await detector.detect(bitmap);
      if (!codes || !codes.length || !codes[0].rawValue) {
        showToast('No Desktop Sync QR code detected in image — move closer and retry.', true);
        return;
      }
      const parsed = parsePairingText(codes[0].rawValue);
      if (!parsed) {
        showToast(`Unrecognized QR payload: ${codes[0].rawValue.slice(0, 60)}`, true);
        return;
      }
      savePcSyncUrl(parsed.url);
      if (parsed.pin) state.pcSync.pin = parsed.pin;
      renderActiveTab();
      showToast(`Paired with Desktop Sync (${parsed.url})`);
    } catch (err) {
      showToast(`QR scan failed: ${err.message || err}`, true);
    }
  };

  async function executeLanSync(url, method, token, bodyObj) {
    if (global.RollupBridge && typeof RollupBridge.lanSyncRequest === 'function') {
      return RollupBridge.lanSyncRequest(url, { method, token, body: bodyObj });
    }
    const headers = { 'X-Sync-Token': token };
    if (method === 'POST') headers['Content-Type'] = 'application/json';
    const resp = await fetch(url, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(bodyObj) : undefined
    });
    const data = await resp.json().catch(() => ({}));
    return { ok: resp.ok, status: resp.status, data };
  }

  global.pushSyncToPc = async function (fromPlanTab = false) {
    global.updatePcSyncInputs();
    const baseUrl = state.pcSync.url;
    const pin = state.pcSync.pin;
    if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
      if (fromPlanTab) switchTab('backups');
      showToast('Enter PC Sync URL (or scan Desktop QR) & 6-digit PIN from Desktop app.', true);
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      if (fromPlanTab) switchTab('backups');
      showToast('Enter the 6-digit Sync PIN displayed in Desktop LightningGarage.', true);
      return;
    }

    const handoff = computeCurrentHandoff('encoded');
    if (fromPlanTab && (!handoff.ok || handoff.stale_blocked || handoff.parity_blocked)) {
      showToast(handoff.error || 'Blocked by Safety Gate (Baseline Parity or F188 OTA Guard).', true);
      return;
    }

    const realBackups = state.backups
      .filter((b) => b.kind === 'FORSCAN_BACKUP' && !b.is_synthetic && b.raw_text)
      .map((b) => {
        const isUsb = Boolean(b.is_usb_live || b.source === 'USB_LIVE' || String(b.id || '').startsWith('usb-'));
        return {
          label: b.label || b.filename,
          filename: b.filename || 'phone_backup.abt',
          taken_at: b.taken_at,
          software_version: b.software_version || null,
          source: isUsb ? 'USB_LIVE' : 'FORSCAN_ABT',
          is_usb_live: isUsb,
          vin: b.vin || state.profile.vin,
          raw_text: b.raw_text
        };
      });

    const factoryBackups = state.backups
      .filter((b) => b.kind === 'FORD_AB' && !b.is_synthetic && b.raw_text)
      .map((b) => ({
        label: b.label || b.filename,
        filename: b.filename || 'factory.ab',
        vin: b.vin || state.profile.vin,
        raw_text: b.raw_text
      }));

    const stagedAbt = handoff.ok && !handoff.stale_blocked && !handoff.parity_blocked
      ? (handoff.modules || []).map((m) => ({
          filename: m.filename,
          content: m.abt_encoded,
          checklist_text: handoff.checklist_text
        }))
      : [];

    const allEntries = getHydratedEntries(false);
    const wantedKeys = allEntries.filter((e) => e.wanted && e.source_key).map((e) => e.source_key);
    const approvedKeys = allEntries.filter((e) => e.status === 'APPROVED' && e.source_key).map((e) => e.source_key);

    state.pcSync.busy = true;
    state.pcSync.lastError = false;
    renderActiveTab();

    try {
      const { ok, status, data } = await executeLanSync(`${baseUrl}/sync/push`, 'POST', pin, {
        vin: state.profile.vin,
        backups: realBackups,
        factory_backups: factoryBackups,
        staged_abt: stagedAbt,
        wanted_keys: wantedKeys,
        approved_keys: approvedKeys,
        sync_mod_state_full: true,
        live_scans: state.liveScans || {}
      });
      if (!ok || !data.ok) {
        throw new Error(data.error || `PC Sync HTTP ${status}`);
      }
      const stagedNames = (data.staged_files || []).map((f) => f.filename).join(', ');
      const skipNote = handoff.stale_blocked
        ? ' (⚠️ Modded .abt staging skipped due to F188 OTA strategy drift — raw backups & live scan synced)'
        : handoff.parity_blocked
        ? ' (ℹ️ Modded .abt staging held by Baseline Parity Gate — import .ab XML or FORScan Save-All .abt first)'
        : '';
      state.pcSync.lastMessage = `✓ Synced ${data.imported_backups ? data.imported_backups.length : 0} backup(s), ${
        data.synced_mods || 0
      } mod selection(s), & staged ${
        data.staged_files ? data.staged_files.length : 0
      } modded .abt file(s) to ${data.staging_dir || 'FORScan Staging'}${stagedNames ? ` (${stagedNames})` : ''}${skipNote}.`;
      state.pcSync.lastError = false;
      showToast(
        handoff.stale_blocked
          ? 'Synced raw backups & live scan to PC (modded .abt skipped: F188 OTA drift).'
          : handoff.parity_blocked
          ? 'Synced raw backups to PC (modded .abt held until .ab / Save-All .abt is present).'
          : `Staged ${(data.staged_files || []).length} modded .abt file(s) to PC FORScan folder!`
      );
    } catch (err) {
      state.pcSync.lastError = true;
      state.pcSync.lastMessage = `Sync failed: ${err.message || err}`;
      showToast(state.pcSync.lastMessage, true);
    } finally {
      state.pcSync.busy = false;
      renderActiveTab();
    }
  };

  global.pullSyncFromPc = async function () {
    global.updatePcSyncInputs();
    const baseUrl = state.pcSync.url;
    const pin = state.pcSync.pin;
    if (!baseUrl || !/^https?:\/\//i.test(baseUrl) || !/^\d{6}$/.test(pin)) {
      showToast('Enter both PC Sync URL (or scan QR) and 6-digit Sync PIN first.', true);
      return;
    }

    state.pcSync.busy = true;
    state.pcSync.lastError = false;
    renderActiveTab();

    try {
      const qs = state.profile && state.profile.vin ? `?vin=${encodeURIComponent(state.profile.vin)}` : '';
      const { ok, status, data } = await executeLanSync(`${baseUrl}/sync/pull${qs}`, 'GET', pin, null);
      if (!ok || !data.ok) {
        throw new Error(data.error || `PC Sync HTTP ${status}`);
      }
      let added = 0;
      (data.factory_backups || []).forEach((fb) => {
        if (!fb.raw_text) return;
        try {
          const parsedAb = GarageEngine.parseAnyBackupFile(fb.filename || 'pc_factory.ab', fb.raw_text);
          state.backups = state.backups.filter((x) => !x.is_synthetic);
          if (!state.backups.some((x) => x.sha256 === parsedAb.sha256 && x.kind === 'FORD_AB')) {
            state.backups.push({
              id: `pc-ab-${fb.id || Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              label: fb.label || fb.filename || 'PC Factory .ab',
              filename: fb.filename || 'pc_factory.ab',
              taken_at: (fb.imported_at || new Date().toISOString()).slice(0, 10),
              kind: 'FORD_AB',
              source: 'FORD_FACTORY',
              is_usb_live: false,
              is_synthetic: false,
              vin: parsedAb.vin || fb.vin || state.profile.vin,
              modules: parsedAb.modules,
              line_count: parsedAb.lines.length,
              sha256: parsedAb.sha256,
              dict: parsedAb.dict,
              nodes: parsedAb.nodes || {},
              warnings: parsedAb.warnings || [],
              raw_text: fb.raw_text
            });
            added++;
          }
        } catch (e) {}
      });
      (data.backups || []).forEach((b) => {
        if (!b.raw_text) return;
        try {
          const parsed = GarageEngine.parseAnyBackupFile(b.filename || 'pc_backup.abt', b.raw_text);
          const isUsb = String(b.source || '').toUpperCase() === 'USB_LIVE';
          state.backups = state.backups.filter((x) => !x.is_synthetic);
          const existing = state.backups.find((x) => x.sha256 === parsed.sha256 && x.kind === 'FORSCAN_BACKUP');
          if (existing) {
            if (!isUsb && (existing.is_usb_live || existing.source === 'USB_LIVE')) {
              existing.source = 'FORSCAN_ABT';
              existing.is_usb_live = false;
              existing.label = b.label || existing.label;
              added++;
            }
          } else {
            state.backups.push({
              id: `pc-${b.id || Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              label: b.label || b.filename || 'PC Backup',
              filename: b.filename || 'pc_backup.abt',
              taken_at: b.taken_at || new Date().toISOString().slice(0, 10),
              kind: 'FORSCAN_BACKUP',
              source: isUsb ? 'USB_LIVE' : 'FORSCAN_ABT',
              is_usb_live: isUsb,
              is_synthetic: false,
              vin: b.vin || state.profile.vin,
              software_version: b.software_version || null,
              modules: parsed.modules,
              line_count: parsed.lines.length,
              sha256: parsed.sha256,
              dict: parsed.dict,
              nodes: {},
              warnings: parsed.warnings || [],
              raw_text: b.raw_text
            });
            added++;
          }
        } catch (e) {}
      });
      if (added > 0) saveBackups();

      let syncedModCount = 0;
      if (Array.isArray(data.wanted_keys) || Array.isArray(data.approved_keys)) {
        const wantSet = new Set(data.wanted_keys || []);
        const appSet = new Set(data.approved_keys || []);
        const allBase = [...(state.customMods || []), ...((BUNDLE && BUNDLE.entries) || [])];
        allBase.forEach((raw) => {
          if (!raw.source_key || raw.id === undefined) return;
          const prev = state.modOverrides[raw.id] || {};
          const nextWanted = wantSet.has(raw.source_key) ? 1 : 0;
          const nextStatus = appSet.has(raw.source_key)
            ? (prev.status === 'APPLIED' ? 'APPLIED' : 'APPROVED')
            : (prev.status === 'APPLIED' ? 'APPLIED' : (raw.status || 'DRAFT'));
          if ((prev.wanted || 0) !== nextWanted || (prev.status || raw.status || 'DRAFT') !== nextStatus) {
            state.modOverrides[raw.id] = { ...prev, wanted: nextWanted, status: nextStatus };
            syncedModCount++;
          }
        });
        saveModOverrides();
      }

      if (data.live_scans && typeof data.live_scans === 'object') {
        Object.entries(data.live_scans).forEach(([mod, mObj]) => {
          if (mObj && typeof mObj === 'object') {
            const f188Val = (mObj.ids && mObj.ids.F188 && mObj.ids.F188.value) || mObj.f188 || null;
            state.liveScans[mod.toUpperCase()] = { ...mObj, f188: f188Val };
          }
        });
        saveLiveScans();
      }

      state.pcSync.lastMessage = `✓ Pulled ${added} new backup/factory item(s) (${(data.backups || []).length} .abt on PC) & synced ${syncedModCount} mod selection(s).`;
      state.pcSync.lastError = false;
      showToast(state.pcSync.lastMessage);
    } catch (err) {
      state.pcSync.lastError = true;
      state.pcSync.lastMessage = `Pull failed: ${err.message || err}`;
      showToast(state.pcSync.lastMessage, true);
    } finally {
      state.pcSync.busy = false;
      renderActiveTab();
    }
  };

  global.setAbtExportFormat = function (fmt) {
    state.abtExportFmt = fmt === 'dashed' ? 'dashed' : 'encoded';
    renderPlanTab();
  };

  global.downloadModdedAbtModule = function (modAddr) {
    const handoff = computeCurrentHandoff(state.abtExportFmt);
    if (!handoff.ok) {
      showToast(handoff.error || 'Cannot export modded .abt yet.', true);
      return;
    }
    const item = (handoff.modules || []).find((m) => m.module === modAddr);
    if (!item || !global.RollupBridge) return;
    RollupBridge.files.downloadText(item.filename, item.abt_text);
    showToast(`Saved ${item.filename} (${state.abtExportFmt === 'encoded' ? 'FORScan G0 Load All' : 'Dashed'})`);
  };

  global.shareModdedAbtModule = function (modAddr) {
    const handoff = computeCurrentHandoff(state.abtExportFmt);
    if (!handoff.ok) {
      showToast(handoff.error || 'Cannot share modded .abt yet.', true);
      return;
    }
    const item = (handoff.modules || []).find((m) => m.module === modAddr);
    if (!item || !global.RollupBridge) return;
    RollupBridge.files.shareTextFile(item.filename, item.abt_text, 'text/plain;charset=utf-8', `FORScan Modded As-Built (${item.module})`);
  };

  function _buildCurrentVaultZip(includeModdedHandoff = true) {
    const handoff = includeModdedHandoff ? computeCurrentHandoff(state.abtExportFmt) : null;
    const realCount = (state.backups || []).filter((b) => !b.is_synthetic).length;
    return GarageEngine.buildVaultZipArchive({
      backups: state.backups || [],
      includeSynthetic: realCount === 0,
      vehicle: state.profile || {},
      handoff: handoff && handoff.ok && !handoff.stale_blocked && !handoff.parity_blocked ? handoff : null,
      vaultSnapshot: {
        app: APP_ID,
        version: '2.1.2',
        exported_at: new Date().toISOString(),
        profile: state.profile,
        modOverrides: state.modOverrides,
        customMods: state.customMods,
        changeLog: state.changeLog,
        liveScans: state.liveScans
      }
    });
  }

  global.downloadVaultZip = function () {
    if (!global.RollupBridge) return;
    try {
      const zip = _buildCurrentVaultZip(true);
      RollupBridge.files.downloadBase64(zip.filename, zip.base64, 'application/zip');
      showToast(`Saved ${zip.filename} (${zip.backupCount} backup(s) + MANIFEST.json)`);
    } catch (err) {
      showToast(`Vault .zip export failed: ${err.message || err}`, true);
    }
  };

  global.shareVaultZip = function () {
    if (!global.RollupBridge) return;
    try {
      const zip = _buildCurrentVaultZip(true);
      RollupBridge.files.shareBase64File(
        zip.filename,
        zip.base64,
        'application/zip',
        `Blue Oval Garage Vault (${state.profile.vin || 'Backups'})`
      );
    } catch (err) {
      showToast(`Vault .zip share failed: ${err.message || err}`, true);
    }
  };

  global.downloadModdedHandoffZip = function () {
    const handoff = computeCurrentHandoff(state.abtExportFmt);
    if (!handoff.ok || handoff.stale_blocked || handoff.parity_blocked) {
      showToast(handoff.error || 'Cannot export modded .abt bundle yet.', true);
      return;
    }
    if (!global.RollupBridge) return;
    const safeVin = String(state.profile.vin || 'GARAGE').replace(/[^A-Z0-9]/gi, '') || 'GARAGE';
    const dateTag = new Date().toISOString().slice(0, 10);
    const zip = GarageEngine.buildVaultZipArchive({
      backups: [],
      vehicle: state.profile || {},
      handoff,
      filename: `${safeVin}_FORScan_LoadAll_${dateTag}.zip`
    });
    RollupBridge.files.downloadBase64(zip.filename, zip.base64, 'application/zip');
    showToast(`Saved ${zip.filename} (${handoff.modules.length} modded .abt + checklist)`);
  };

  global.shareModdedHandoffZip = function () {
    const handoff = computeCurrentHandoff(state.abtExportFmt);
    if (!handoff.ok || handoff.stale_blocked || handoff.parity_blocked) {
      showToast(handoff.error || 'Cannot share modded .abt bundle yet.', true);
      return;
    }
    if (!global.RollupBridge) return;
    const safeVin = String(state.profile.vin || 'GARAGE').replace(/[^A-Z0-9]/gi, '') || 'GARAGE';
    const dateTag = new Date().toISOString().slice(0, 10);
    const zip = GarageEngine.buildVaultZipArchive({
      backups: [],
      vehicle: state.profile || {},
      handoff,
      filename: `${safeVin}_FORScan_LoadAll_${dateTag}.zip`
    });
    RollupBridge.files.shareBase64File(zip.filename, zip.base64, 'application/zip', `FORScan Load-All Bundle (${safeVin})`);
  };

  // =========================================================================
  // TAB 4: BACKUPS, USB-C LIVE SNAPSHOT, PC SYNC & CHECKSUM TOOLS
  // =========================================================================
  function renderBackupsTab() {
    const container = document.getElementById('backups-tab-content');
    if (!container) return;

    const entries = getHydratedEntries(false);
    const wanted = entries.filter((e) => e.wanted || e.status === 'APPROVED');
    const g = GarageEngine.adapterGuidance(state.profile.model_year, state.profile.platform_slug);
    const requiredMods = new Set();
    wanted.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const m = String(s.address || '').slice(0, 3).toUpperCase();
        if (m.length === 3) requiredMods.add(m);
      });
    });

    const backedUpMods = new Set();
    const authMods = new Set();
    state.backups.forEach((b) => {
      if (b.is_synthetic) return;
      const isUsb = Boolean(b.is_usb_live || String(b.source || '').toUpperCase() === 'USB_LIVE');
      if (b.kind === 'FORSCAN_BACKUP') {
        (b.modules || []).forEach((m) => backedUpMods.add(String(m || '').toUpperCase()));
        if (!isUsb) {
          (b.modules || []).forEach((m) => authMods.add(String(m || '').toUpperCase()));
        }
      } else if (b.kind === 'FORD_AB') {
        (b.modules || []).forEach((m) => authMods.add(String(m || '').toUpperCase()));
      }
    });

    const isNativeUsb = Boolean(global.RollupBridge && RollupBridge.usbSerial && RollupBridge.usbSerial.isNativeApk());
    const isWebSerial = Boolean(!isNativeUsb && global.RollupBridge && RollupBridge.usbSerial && RollupBridge.usbSerial.isSupported());
    const usbGateBadge = isNativeUsb
      ? `<span class="pill pill-green">🔒 Native Kotlin Read-Only UDS Gate</span>`
      : isWebSerial
      ? `<span class="pill pill-blue">💻 Desktop WebSerial Ready</span>`
      : `<span class="pill pill-muted">📱 Requires RollupOS v1.2+ APK for USB-C OTG</span>`;

    const voltVal = state.usb.lastVoltage;
    const voltBadge =
      voltVal === null || voltVal === undefined
        ? `<span class="pill pill-dark">🔋 12V ATRV: --</span>`
        : voltVal >= 12.5
        ? `<span class="pill pill-green">🔋 ${voltVal.toFixed(2)}V (&ge;12.5V Ready)</span>`
        : `<span class="pill pill-amber">⚠️ ${voltVal.toFixed(2)}V (&lt;12.5V KOEO)</span>`;

    const targetListPreview = getTargetModulesForMode(state.usb.mode).join(', ');
    const lastRes = state.usb.lastResult;
    const lastScanHtml = lastRes
      ? `
        <div class="alert alert-green" style="margin-top:8px;">
          <strong>✓ Last Live Scan (${escapeHtml(lastRes.mode)}):</strong>
          Responded: <strong>${escapeHtml(lastRes.respondedModules.join(', ') || 'none')}</strong>
          ${lastRes.vin ? ` • Live VIN: <code>${escapeHtml(lastRes.vin)}</code>` : ''}
          ${lastRes.importedCount ? ` • Auto-saved <strong>${lastRes.importedCount}</strong> <code>.abt</code> file(s) (${lastRes.totalLinesSaved} lines)` : ''}
        </div>
      `
      : '';

    const coverageRows = Array.from(requiredMods)
      .sort()
      .map((m) => {
        const fn = (BUNDLE.ford_modules[m] && BUNDLE.ford_modules[m].short) || m;
        const hasAbt = backedUpMods.has(m);
        const hasAuth = authMods.has(m);
        const ok = hasAbt && hasAuth;
        const ls = state.liveScans[m];
        let statusBadge = `<span class="pill pill-amber">⚠️ Needs .abt + Auth Baseline</span>`;
        if (ok) {
          statusBadge = `<span class="pill pill-green">✓ Parity Baseline Ready</span>`;
        } else if (hasAbt && !hasAuth) {
          statusBadge = `<span class="pill pill-amber">⚠️ USB-C Only (Import .ab or Save-All)</span>`;
        } else if (!hasAbt && hasAuth) {
          statusBadge = `<span class="pill pill-amber">⚠️ .ab Only (Run USB Scan or Import .abt)</span>`;
        }
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:#090e1a;border:1px solid ${ok ? '#166534' : '#7c2d12'};border-radius:8px;gap:6px;flex-wrap:wrap;">
            <div>
              <strong style="color:#f8fafc;">${escapeHtml(m)} (${escapeHtml(fn)})</strong>
              <span style="font-size:11px;color:#94a3b8;margin-left:6px;">${ls && ls.f188 ? `Live F188: ${escapeHtml(ls.f188)}` : 'Required by Wanted/Approved mods'}</span>
            </div>
            ${statusBadge}
          </div>
        `;
      })
      .join('');

    const backupsListHtml = state.backups.length
      ? state.backups
          .map(
            (b, idx) => {
              const isUsb = Boolean(b.is_usb_live || String(b.source || '').toUpperCase() === 'USB_LIVE');
              const provLabel =
                b.kind === 'FORD_AB'
                  ? 'FORD_AB (Auth Blocks)'
                  : b.is_synthetic
                  ? 'SYNTHETIC'
                  : isUsb
                  ? 'USB-C Live (Needs .ab)'
                  : 'FORScan Save-All';
              const provClass =
                b.kind === 'FORD_AB'
                  ? 'pill-blue'
                  : b.is_synthetic || isUsb
                  ? 'pill-amber'
                  : 'pill-green';
              return `
          <div style="padding:10px;background:#090e1a;border:1px solid #1e293b;border-radius:10px;margin-top:8px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <strong style="font-size:13px;color:#f8fafc;">${escapeHtml(b.label || b.filename)}</strong>
                  <span class="pill ${provClass}">${escapeHtml(provLabel)}</span>
                  ${b.software_version ? `<span class="pill pill-dark">F188: ${escapeHtml(b.software_version)}</span>` : ''}
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:3px;">
                  Modules: <strong>${escapeHtml((b.modules || []).join(', '))}</strong> • ${b.line_count || Object.keys(b.dict || {}).length} lines • SHA-256: <code>${escapeHtml(String(b.sha256 || '').slice(0, 10))}</code>
                </div>
              </div>
              <div style="display:flex;gap:5px;flex-wrap:wrap;">
                <button class="btn btn-secondary" style="padding:4px 8px;font-size:11px;" onclick="downloadBackupFile(${idx})">⬇️ Save</button>
                <button class="btn btn-secondary" style="padding:4px 8px;font-size:11px;" onclick="shareBackupFile(${idx})">📤 Share</button>
                <button class="btn btn-danger" style="padding:4px 8px;font-size:11px;" onclick="deleteBackupAt(${idx})">🗑️</button>
              </div>
            </div>
          </div>
        `;
            }
          )
          .join('')
      : `<div style="padding:14px;text-align:center;color:#94a3b8;font-size:12px;">No <code>.abt</code> or <code>.ab</code> files imported for this vehicle yet.</div>`;

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
      <!-- USB-C Live OBD-II Read-Only Snapshot -->
      <div class="card card-accent">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div>
            <h3 style="margin:0;font-size:14.5px;color:#f8fafc;">🔌 USB-C Live OBD-II As-Built Backup (Read-Only UDS)</h3>
            <p style="margin:3px 0 0 0;font-size:11.5px;color:#cbd5e1;">
              Plug <strong>OBDLink EX</strong> or <strong>Vgate vLinker FS</strong> into your phone via USB-C OTG. Reads live <code>DExx</code> As-Built &amp; <code>F188</code> strategy IDs; <code>0x2E</code> writes are hardware-blocked.
            </p>
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;">
            ${usbGateBadge}
            ${voltBadge}
          </div>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          ${
            state.usb.connected
              ? `
                <span class="pill pill-green" style="padding:5px 10px;">✓ ${escapeHtml(state.usb.deviceInfo)}</span>
                <button class="btn btn-secondary" onclick="probeUsbVoltage(false)" ${state.usb.busy ? 'disabled' : ''}>🔋 Check 12V</button>
                <button class="btn btn-danger" onclick="disconnectUsbAdapter()" ${state.usb.busy ? 'disabled' : ''}>⏏️ Disconnect</button>
              `
              : `<button class="btn btn-blue" onclick="connectUsbAdapter()" ${state.usb.busy ? 'disabled' : ''}>🔌 Connect USB-C Adapter</button>`
          }
        </div>

        <div class="form-grid" style="margin-bottom:8px;">
          <div>
            <label class="field-label">USB Scan Mode</label>
            <select class="field-input" onchange="setUsbScanOption('mode', this.value)" ${state.usb.busy ? 'disabled' : ''}>
              <option value="targeted_backup" ${state.usb.mode === 'targeted_backup' ? 'selected' : ''}>⚡ Targeted Mod Backup (~20s • ${escapeHtml(targetListPreview)})</option>
              <option value="quick_health" ${state.usb.mode === 'quick_health' ? 'selected' : ''}>🩺 Quick Health (VIN F190 + F188 + DTCs)</option>
              <option value="full_backup" ${state.usb.mode === 'full_backup' ? 'selected' : ''}>🗄️ Full Truck As-Built Sweep (13 Modules)</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;justify-content:center;gap:5px;font-size:11.5px;color:#cbd5e1;">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
              <input type="checkbox" ${state.usb.dualBus ? 'checked' : ''} onchange="setUsbScanOption('dualBus', this.checked)">
              <span>${g.ms_can_required ? 'Auto-Switch HS-CAN (STP33) + MS-CAN 125k (STP53)' : 'Dual 500k Bus (DIAG1 STP33 + Secondary DIAG2 STP53 for IPMA 706)'}</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
              <input type="checkbox" ${state.usb.allowExtended ? 'checked' : ''} onchange="setUsbScanOption('allowExtended', this.checked)">
              <span>Parked Extended Session Fallback (<code>10 03 &rarr; DExx &rarr; 10 01</code>)</span>
            </label>
            ${
              state.usb.allowExtended
                ? `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;color:#fde68a;padding-left:18px;">
                    <input type="checkbox" ${state.usb.confirmParked ? 'checked' : ''} onchange="setUsbScanOption('confirmParked', this.checked)">
                    <span><strong>Confirm vehicle is stationary in PARK</strong></span>
                  </label>`
                : ''
            }
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
              <input type="checkbox" ${state.usb.overrideLowV ? 'checked' : ''} onchange="setUsbScanOption('overrideLowV', this.checked)">
              <span>Override &lt;12.5V Battery Gate (external 12V maintainer attached)</span>
            </label>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="startUsbVehicleScan()" ${state.usb.busy ? 'disabled' : ''}>
            ${state.usb.busy ? '⏳ Scanning Vehicle...' : '⚡ Run Live USB-C Scan &amp; Save .abt'}
          </button>
          <span id="usb-live-progress" style="font-size:11.5px;color:#38bdf8;font-family:monospace;">${escapeHtml(state.usb.progressText || '')}</span>
        </div>

        ${state.usb.lastError ? `<div class="alert alert-red" style="margin-top:8px;">⚠️ ${escapeHtml(state.usb.lastError)}</div>` : ''}
        ${lastScanHtml}
      </div>

      <!-- Time-Boxed Phone <-> PC FORScan Staging Sync -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:4px;">
          <h3 style="margin:0;font-size:14px;color:#f8fafc;">📡 Phone &harr; PC Wi-Fi Sync &amp; FORScan Staging</h3>
          <label class="btn btn-secondary" style="cursor:pointer;font-size:11.5px;padding:4px 8px;">
            📷 Scan Desktop QR
            <input type="file" accept="image/*" capture="environment" style="display:none" onchange="scanPcSyncQrImage(event)">
          </label>
        </div>
        <p style="margin:0 0 8px 0;font-size:11.5px;color:#94a3b8;">
          On your Windows laptop, click <strong>Enable Phone Sync (15 min)</strong> in <code>LightningGarage.exe</code>, then scan the QR code (or paste the Pairing URI / 6-digit PIN) to sync your Vault and auto-stage modded <code>.abt</code> files into <code>Documents\\FORScan\\LightningGarage_Staging\\</code>.
        </p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
          <input type="text" id="pc-sync-url" class="field-input" style="flex:2;min-width:190px;font-family:monospace;" maxlength="128" value="${escapeHtml(state.pcSync.url)}" placeholder="http://192.168.1.50:54321 (or paste #pin=...)" onchange="updatePcSyncInputs()">
          <input type="text" id="pc-sync-pin" class="field-input" style="width:120px;font-family:monospace;letter-spacing:2px;text-align:center;" maxlength="96" inputmode="numeric" value="${escapeHtml(state.pcSync.pin)}" placeholder="6-Digit PIN" onchange="updatePcSyncInputs()">
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="pushSyncToPc(false)" ${state.pcSync.busy ? 'disabled' : ''}>⬆️ Push Backups &amp; Stage Modded .abt to PC</button>
          <button class="btn btn-secondary" onclick="pullSyncFromPc()" ${state.pcSync.busy ? 'disabled' : ''}>⬇️ Pull Vault &amp; Backups from PC</button>
        </div>
        ${
          state.pcSync.lastMessage
            ? `<div class="alert ${state.pcSync.lastError ? 'alert-red' : 'alert-green'}" style="margin-top:8px;">${escapeHtml(state.pcSync.lastMessage)}</div>`
            : ''
        }
      </div>

      <!-- Pre-Flight Backup Coverage -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">🛡️ Pre-Flight Module Backup Checklist</h3>
            <p style="margin:2px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Before writing any change in FORScan, ensure a real <code>.abt</code> backup is saved for each module below.
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
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
          <div>
            <h3 style="margin:0;font-size:14px;color:#f8fafc;">🗄️ Imported Backups &amp; Factory Files (${state.backups.length})</h3>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Offline-first: save or share individual <code>.abt</code> files or a complete checksummed <code>Vault.zip</code> (+ <code>MANIFEST.json</code>).</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary" style="font-size:11.5px;padding:5px 9px;" onclick="downloadVaultZip()" ${state.backups.length ? '' : 'disabled'}>📦 Save Vault .zip</button>
            <button class="btn btn-secondary" style="font-size:11.5px;padding:5px 9px;" onclick="shareVaultZip()" ${state.backups.length ? '' : 'disabled'}>📤 Share Vault .zip</button>
          </div>
        </div>
        ${backupsListHtml}
      </div>

      ${driftHtml}

      <!-- Ford Motorcraft Official As-Built Retrieval Guide -->
      <div class="card">
        <h3 style="margin:0 0 4px 0;font-size:14px;color:#f8fafc;">🏭 Get Ford's Official Factory As-Built (<code>.ab</code>)</h3>
        <p style="margin:0 0 8px 0;font-size:11.5px;color:#cbd5e1;line-height:1.45;">
          Ford's Motorcraft As-Built site uses a visual security CAPTCHA, so we never scrape it behind your back. Download your official <code>${escapeHtml(state.profile.vin || 'VIN')}.ab</code> XML in 20 seconds:
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

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = String(e.target.result || '');
          const parsed = GarageEngine.parseAnyBackupFile(file.name, text);
          const inferredSrc =
            parsed.kind === 'FORD_AB'
              ? 'FORD_FACTORY'
              : GarageEngine.inferAbtBackupSource(text, file.name, file.name);
          const isUsb = inferredSrc === 'USB_LIVE';
          state.backups = state.backups.filter((b) => !b.is_synthetic && b.sha256 !== parsed.sha256);
          state.backups.push({
            id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            label: file.name,
            filename: file.name,
            taken_at: new Date().toISOString().slice(0, 10),
            kind: parsed.kind,
            source: inferredSrc,
            is_usb_live: isUsb,
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

  global.shareBackupFile = function (idx) {
    const b = state.backups[idx];
    if (!b || !global.RollupBridge) return;
    const text =
      b.raw_text ||
      Object.keys(b.dict || {})
        .sort()
        .map((k) => `${k} ${b.dict[k]}`)
        .join('\n');
    const fname = b.filename || `${b.label || 'backup'}.${b.kind === 'FORD_AB' ? 'ab' : 'abt'}`;
    RollupBridge.files.shareTextFile(fname, text, 'text/plain;charset=utf-8', `As-Built Backup (${fname})`);
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
  // TAB 5: PRINTABLE / IN-CAB FORSCAN SESSION PLAN & MODDED .ABT HANDOFF
  // =========================================================================
  function renderPlanTab() {
    const container = document.getElementById('plan-tab-content');
    if (!container) return;

    const entries = getHydratedEntries(true);
    const planned = entries.filter((e) => e.wanted);
    const g = GarageEngine.adapterGuidance(state.profile.model_year, state.profile.platform_slug);
    const modsToBackup = new Set();
    planned.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const m = String(s.address || '').slice(0, 3).toUpperCase();
        if (m.length === 3) modsToBackup.add(m);
      });
    });

    const handoff = computeCurrentHandoff(state.abtExportFmt);
    let handoffBodyHtml = '';
    if (handoff.stale_blocked) {
      handoffBodyHtml = `
        <div class="alert alert-red" style="margin-top:8px;">
          <strong>⛔ Stale Pre-OTA F188 Guard Blocked "Load All" Export:</strong>
          <ul style="margin:6px 0 6px 18px;padding:0;">
            ${(handoff.blockers || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
          <button class="btn btn-primary" onclick="switchTab('backups')">🔌 Run Fresh USB-C Backup Now</button>
        </div>
      `;
    } else if (handoff.parity_blocked) {
      handoffBodyHtml = `
        <div class="alert alert-red" style="margin-top:8px;">
          <strong>⛔ Baseline Parity Safety Gate Blocked "Load All" Export:</strong>
          <ul style="margin:6px 0 6px 18px;padding:0;">
            ${(handoff.blockers || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
          <button class="btn btn-primary" onclick="switchTab('backups')">📂 Import Motorcraft .ab or FORScan Save-All .abt</button>
        </div>
      `;
    } else if (!handoff.ok) {
      handoffBodyHtml = `
        <div class="alert alert-amber" style="margin-top:8px;">
          <strong>ℹ️ Modded <code>.abt</code> Handoff Pending:</strong> ${escapeHtml(handoff.error || 'Import or capture module backups first.')}
          ${
            (handoff.blockers || []).length
              ? `<div style="margin-top:4px;font-size:11px;color:#fde68a;">${escapeHtml(handoff.blockers.slice(0, 3).join(' • '))}</div>`
              : ''
          }
        </div>
      `;
    } else {
      const warnHtml = (handoff.warnings || []).length
        ? `<div class="alert alert-amber" style="margin-top:8px;">${handoff.warnings.map((w) => escapeHtml(w)).join('<br>')}</div>`
        : '';
      const modCards = (handoff.modules || [])
        .map((m) => {
          const fn = (BUNDLE.ford_modules[m.module] && BUNDLE.ford_modules[m.module].short) || m.module;
          const f188Pill = m.f188_verified_match
            ? `<span class="pill pill-green">✓ F188 Match (${escapeHtml(m.live_f188)})</span>`
            : m.baseline_f188
            ? `<span class="pill pill-dark">F188: ${escapeHtml(m.baseline_f188)}</span>`
            : `<span class="pill pill-muted">F188 Unrecorded</span>`;
          const parityPill = m.parity_verified
            ? `<span class="pill pill-green">✓ Block Parity (${m.actual_block_count || 0} blk)</span>`
            : `<span class="pill pill-amber">⚠️ Unverified USB</span>`;
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding:9px 10px;background:#070c18;border:1px solid #1e293b;border-radius:8px;margin-top:8px;">
              <div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <strong style="color:#38bdf8;font-family:monospace;">${escapeHtml(m.filename)}</strong>
                  <span class="pill pill-blue">${escapeHtml(m.module)} (${escapeHtml(fn)})</span>
                  ${parityPill}
                  ${f188Pill}
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:3px;">
                  <strong>${m.changed_lines.length}</strong> mutated line(s) across ${m.total_lines} module lines • Ready for FORScan <strong>Load All &rarr; Write All</strong>
                </div>
              </div>
              <div style="display:flex;gap:5px;flex-wrap:wrap;">
                <button class="btn btn-primary" style="padding:5px 9px;font-size:11px;" onclick="downloadModdedAbtModule('${escapeHtml(m.module)}')">⬇️ Save .abt</button>
                <button class="btn btn-secondary" style="padding:5px 9px;font-size:11px;" onclick="shareModdedAbtModule('${escapeHtml(m.module)}')">📤 Share .abt</button>
              </div>
            </div>
          `;
        })
        .join('');
      handoffBodyHtml = `
        ${warnHtml}
        ${modCards}
        <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
          <button class="btn btn-primary" onclick="downloadModdedHandoffZip()">📦 Save All .zip</button>
          <button class="btn btn-secondary" onclick="shareModdedHandoffZip()">📤 Share All .zip</button>
          <button class="btn btn-blue" onclick="pushSyncToPc(true)">📡 1-Tap Stage .abt File(s) to PC FORScan Folder</button>
          <span style="font-size:11px;color:#94a3b8;">Offline <code>.zip</code> (+ checklist) or Wi-Fi stage into <code>Documents\\FORScan\\LightningGarage_Staging\\</code></span>
        </div>
      `;
    }

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
              ${escapeHtml(state.profile.model_year)} ${escapeHtml(state.profile.make || 'Ford')} ${escapeHtml(state.profile.model)} ${escapeHtml(state.profile.trim || '')} • <code>${escapeHtml(state.profile.vin)}</code>
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-primary" onclick="shareSessionPlan()">📤 Share / Export Plan</button>
            <button class="btn btn-secondary" onclick="window.print()">🖨️ Print</button>
          </div>
        </div>
      </div>

      <!-- FORScan "Load All" Modded .abt Handoff -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
          <div>
            <h4 style="margin:0;font-size:13.5px;color:#f8fafc;">💾 FORScan "Load All" Modded <code>.abt</code> Handoff</h4>
            <p style="margin:3px 0 0 0;font-size:11.5px;color:#94a3b8;">
              Pre-computes checksum-verified <code>.abt</code> files from your vehicle's real baseline backup, guarded against Ford OTA strategy drift (<code>F188</code>). Write modules strictly in Windows <code>FORScan.exe</code> (directly or via phone RustDesk/RDP).
            </p>
          </div>
          <div class="chip-row" style="padding:0;">
            <button class="chip-btn ${state.abtExportFmt === 'encoded' ? 'active' : ''}" onclick="setAbtExportFormat('encoded')">FORScan &ge;2.3.23 G0 (.abt)</button>
            <button class="chip-btn ${state.abtExportFmt === 'dashed' ? 'active' : ''}" onclick="setAbtExportFormat('dashed')">Dashed Readable (.abt)</button>
          </div>
        </div>
        ${handoffBodyHtml}
      </div>

      ${
        g.ms_can_required
          ? `<div class="alert alert-amber" style="margin-bottom:10px;"><strong>⚠️ MS-CAN (125 kbaud) Vehicle (${escapeHtml(g.architecture)}):</strong> ${escapeHtml(g.note)}</div>`
          : ''
      }

      <div class="card">
        <h4 style="margin:0 0 6px 0;font-size:13px;color:#38bdf8;">Step 1 — Vehicle &amp; 12V Pre-Flight</h4>
        <ul style="margin:0;padding-left:18px;font-size:12px;color:#cbd5e1;line-height:1.55;">
          <li>Connect <strong>${escapeHtml(state.profile.adapter || 'OBDLink EX')}</strong> to the OBD-II port; put vehicle in <strong>Ready / KOER (~14.4V DC-DC active)</strong> or attach a 12V maintainer (&ge;12.5V).</li>
          <li>Capture a fresh USB-C Targeted Backup (or FORScan <strong>Save All</strong>) for: <strong>${escapeHtml(Array.from(modsToBackup).join(', ') || '726, 7D0, 720, 740, 741, 724')}</strong>.</li>
          <li>In Windows <code>FORScan.exe</code> &rarr; <strong>Configuration and Programming</strong> &rarr; open Module Configuration (AS BUILT format) &rarr; click <strong>Load All</strong> &rarr; select staged <code>*_MODDED.abt</code> &rarr; verify diff &rarr; click <strong>Write All</strong>.</li>
        </ul>
      </div>

      <div style="margin:8px 2px;font-size:12px;font-weight:800;color:#f8fafc;">
        Step 2 — Selected Mod Line-by-Line Verification (${planned.length})
      </div>
      ${planStepsHtml}
    `;
  }

  global.shareSessionPlan = function () {
    const entries = getHydratedEntries(true).filter((e) => e.wanted);
    const lines = [
      `BLUE OVAL GARAGE — FORSCAN SESSION PLAN`,
      `Vehicle: ${state.profile.model_year} ${state.profile.make || 'Ford'} ${state.profile.model} ${state.profile.trim || ''} (${state.profile.battery || state.profile.powertrain})`,
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
      RollupBridge.files.share('Blue Oval Garage FORScan Session Plan', text);
    }
  };

  // --- Vault JSON Export / Import ---
  global.exportGarageVaultJson = function () {
    saveModOverrides();
    saveBackups();
    saveCustomMods();
    saveChangeLog();
    saveLiveScans();
    const vehicleStates = {};
    (state.vehicles || []).forEach((v) => {
      const vid = v.id;
      if (vid === state.activeVehicleId) {
        vehicleStates[vid] = {
          modOverrides: state.modOverrides,
          backups: state.backups,
          customMods: state.customMods,
          changeLog: state.changeLog,
          liveScans: state.liveScans
        };
      } else if (global.RollupBridge) {
        vehicleStates[vid] = {
          modOverrides: RollupBridge.storage.get(getScopedKey(KEY_MOD_OVERRIDES, vid), {}, APP_ID) || {},
          backups: RollupBridge.storage.get(getScopedKey(KEY_BACKUPS, vid), [], APP_ID) || [],
          customMods: RollupBridge.storage.get(getScopedKey(KEY_CUSTOM_MODS, vid), [], APP_ID) || [],
          changeLog: RollupBridge.storage.get(getScopedKey(KEY_CHANGE_LOG, vid), [], APP_ID) || [],
          liveScans: RollupBridge.storage.get(getScopedKey(KEY_LIVE_SCANS, vid), {}, APP_ID) || {}
        };
      }
    });
    const payload = {
      app: APP_ID,
      version: '2.1.0',
      exported_at: new Date().toISOString(),
      activeVehicleId: state.activeVehicleId,
      vehicles: state.vehicles,
      vehicleStates,
      profile: state.profile,
      modOverrides: state.modOverrides,
      backups: state.backups,
      customMods: state.customMods,
      changeLog: state.changeLog,
      liveScans: state.liveScans
    };
    if (global.RollupBridge) {
      RollupBridge.files.exportJSON(`blue_oval_garage_vault_${state.profile.vin || 'export'}.json`, payload);
      showToast('Exported Blue Oval Garage JSON Vault (all vehicles)!');
    }
  };

  global.importGarageVaultJson = function (ev) {
    const file = ev.target && ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target.result || '{}'));
        if (Array.isArray(data.vehicles) && data.vehicles.length) {
          state.vehicles = data.vehicles;
          state.activeVehicleId = data.activeVehicleId || data.vehicles[0].id;
          state.profile = state.vehicles.find((v) => v.id === state.activeVehicleId) || state.vehicles[0];
          saveVehicles();
        } else if (data.profile) {
          state.profile = { ...state.profile, ...data.profile };
          saveProfile();
        }
        if (data.vehicleStates && typeof data.vehicleStates === 'object' && global.RollupBridge) {
          Object.entries(data.vehicleStates).forEach(([vidKey, vs]) => {
            if (!vs || typeof vs !== 'object') return;
            const vid = Number(vidKey) || vidKey;
            if (vs.modOverrides) RollupBridge.storage.set(getScopedKey(KEY_MOD_OVERRIDES, vid), vs.modOverrides, APP_ID);
            if (Array.isArray(vs.backups)) RollupBridge.storage.set(getScopedKey(KEY_BACKUPS, vid), vs.backups, APP_ID);
            if (Array.isArray(vs.customMods)) RollupBridge.storage.set(getScopedKey(KEY_CUSTOM_MODS, vid), vs.customMods, APP_ID);
            if (Array.isArray(vs.changeLog)) RollupBridge.storage.set(getScopedKey(KEY_CHANGE_LOG, vid), vs.changeLog, APP_ID);
            if (vs.liveScans) RollupBridge.storage.set(getScopedKey(KEY_LIVE_SCANS, vid), vs.liveScans, APP_ID);
          });
          loadScopedVehicleData(state.activeVehicleId);
        } else {
          if (data.modOverrides) {
            state.modOverrides = data.modOverrides;
            saveModOverrides();
          }
          if (Array.isArray(data.backups)) {
            state.backups = data.backups;
            saveBackups();
          }
          if (Array.isArray(data.customMods)) {
            state.customMods = data.customMods;
            saveCustomMods();
          }
          if (Array.isArray(data.changeLog)) {
            state.changeLog = data.changeLog;
            saveChangeLog();
          }
          if (data.liveScans) {
            state.liveScans = data.liveScans;
            saveLiveScans();
          }
        }
        renderActiveTab();
        showToast('Restored Blue Oval Garage Vault!');
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
