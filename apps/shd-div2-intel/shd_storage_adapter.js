/**
 * SHD Tactical Inventory & Build Intelligence Platform
 * Pluggable Dual-Mode Storage & Multi-User RollupBridge Adapter (`web/shd_storage_adapter.js`)
 *
 * Automatically switches between:
 *  - Mode A: Desktop PC FastAPI Server (`localhost:8420` -> Python SQLite + WinRT OCR + Video Slicer)
 *  - Mode B: RollupOS Android Container / Standalone Portable Mode (`window.RollupBridge.storage` + `SHDPortableSolver`)
 *
 * Enforces strict multi-user isolation (via `RollupBridge.auth.getCurrentUser()`) while exposing
 * Admin's Read-Only Showcase Loadouts (`Lengmo Pesti Turm (SHD 2793 Main)`) for authorized friends/clanmates to clone.
 */
(function (global) {
  'use strict';

  const APP_ID = 'shd-div2-intel';
  let _pcServerAvailable = null;

  function hasRollupBridge() {
    return Boolean(global.RollupBridge && global.RollupBridge.storage);
  }

  function getActiveUser() {
    if (hasRollupBridge()) {
      const u = global.RollupBridge.auth.getCurrentUser();
      if (u) {
        const cfg = global.RollupBridge.user.getAppConfig(APP_ID) || {};
        return {
          email: u.email,
          name: u.name || u.email,
          role: u.role || (u.is_admin ? 'admin' : 'tester'),
          is_admin: Boolean(u.is_admin),
          badge: u.badge || (u.is_admin ? '👑 SHD Admin' : '🛡️ Authorized Agent'),
          callsign: cfg.agent_callsign || (u.is_admin ? 'rangerd7 (SHD 2793)' : u.name),
          mode: 'ROLLUP_HUB'
        };
      }
    }
    return {
      email: 'andrewnicks@gmail.com',
      name: 'Andrew Nicks',
      role: 'admin',
      is_admin: true,
      badge: '👑 PC Command Center (SHD 2793)',
      callsign: 'rangerd7 (SHD 2793)',
      mode: _pcServerAvailable ? 'PC_FASTAPI' : 'PORTABLE_LOCAL'
    };
  }

  function _readStore(key, fallback) {
    if (hasRollupBridge()) {
      return global.RollupBridge.storage.get(key, fallback, APP_ID);
    }
    try {
      const raw = localStorage.getItem(`shd_portable::${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function _writeStore(key, val) {
    if (hasRollupBridge()) {
      return global.RollupBridge.storage.set(key, val, APP_ID);
    }
    try {
      localStorage.setItem(`shd_portable::${key}`, JSON.stringify(val));
    } catch (e) {}
    return val;
  }

  function _ensurePortableProfileInitialized() {
    const user = getActiveUser();
    const seed = global.SHD_CARTRIDGE_SEED || {};
    const initialized = _readStore('profile_initialized_v4', false);
    if (!initialized) {
      if (user.is_admin) {
        const admState = seed.admin_default_state || {};
        _writeStore('inventory', JSON.parse(JSON.stringify(admState.inventory || [])));
        _writeStore('saved_loadouts', JSON.parse(JSON.stringify(admState.saved_loadouts || seed.admin_showcase_loadouts || [])));
        _writeStore('expertise', JSON.parse(JSON.stringify(admState.expertise || {})));
      } else {
        // Authorized Friend / Clanmate starts with clean 0-item Armory & 0/500 Expertise
        // (plus access to Admin Showcase Loadouts & 1-tap Load Demo Stash)
        _writeStore('inventory', []);
        _writeStore('saved_loadouts', []);
        _writeStore('expertise', JSON.parse(JSON.stringify(seed.tester_default_expertise || {})));
      }
      _writeStore('custom_builds', []);
      _writeStore('backups', []);
      _writeStore('profile_initialized_v4', true);
    }
  }

  function _recomputeExpertiseTotals(exp) {
    const cats = exp.categories || [];
    let totalProf = 0;
    let totalCap = 0;
    cats.forEach((c) => {
      c.proficient = Math.max(0, Math.min(Number(c.total || 0), Number(c.proficient || 0)));
      c.missing = Math.max(0, Number(c.total || 0) - c.proficient);
      c.pct = Math.round((c.proficient / Math.max(1, Number(c.total || 1))) * 1000) / 10;
      totalProf += c.proficient;
      totalCap += Number(c.total || 0);
    });
    const missingTotal = Math.max(0, totalCap - totalProf);
    exp.total_proficient = totalProf;
    exp.total_items = totalCap || 500;
    exp.missing_count = missingTotal;
    exp.estimated_filament_to_max = missingTotal * 300;
    return exp;
  }

  function buildPortableFullState() {
    _ensurePortableProfileInitialized();
    const seed = global.SHD_CARTRIDGE_SEED || {};
    const inv = _readStore('inventory', []);
    const savedLoadouts = _readStore('saved_loadouts', []);
    const customBuilds = _readStore('custom_builds', []);
    const exp = _recomputeExpertiseTotals(_readStore('expertise', seed.tester_default_expertise || {}));
    const backups = _readStore('backups', []);
    const solverOut = global.SHDPortableSolver.evaluateAllBuildsJS(inv, savedLoadouts, customBuilds);

    return {
      user_profile: getActiveUser(),
      runtime_mode: hasRollupBridge() ? 'ANDROID_HUB_CARTRIDGE' : 'PORTABLE_BROWSER',
      inventory: inv,
      solver: solverOut,
      canonical: seed.canonical || {},
      backups,
      saved_loadouts: savedLoadouts,
      admin_showcase_loadouts: seed.admin_showcase_loadouts || [],
      expertise: exp
    };
  }

  async function checkPcServer() {
    if (_pcServerAvailable !== null) return _pcServerAvailable;
    // If running inside /apps/shd-div2-intel/ on RollupHub or github.io, skip FastAPI probe
    const path = global.location.pathname || '';
    if (path.includes('/apps/shd-div2-intel') || global.location.hostname.endsWith('.github.io')) {
      _pcServerAvailable = false;
      return false;
    }
    try {
      const res = await fetch('/api/state', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          _pcServerAvailable = true;
          return true;
        }
      }
    } catch (e) {}
    _pcServerAvailable = false;
    return false;
  }

  function enrichServerState(st) {
    const seed = global.SHD_CARTRIDGE_SEED || {};
    st.user_profile = getActiveUser();
    st.runtime_mode = 'PC_FASTAPI';
    st.admin_showcase_loadouts = seed.admin_showcase_loadouts || st.saved_loadouts || [];
    return st;
  }

  const SHDStorageAdapter = {
    getActiveUser,

    async getState() {
      if (await checkPcServer()) {
        const res = await fetch('/api/state');
        const st = await res.json();
        return enrichServerState(st);
      }
      return buildPortableFullState();
    },

    async quickAddShorthand(shorthand, location = 'STASH') {
      if (await checkPcServer()) {
        const res = await fetch('/api/quick-add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shorthand, location })
        });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const item = global.SHDPortableSolver.snapShorthandToItemJS(shorthand, location);
      const inv = _readStore('inventory', []);
      inv.unshift(item);
      _writeStore('inventory', inv);
      return { status: 'ok', item, state: buildPortableFullState() };
    },

    async saveItem(payload) {
      if (await checkPcServer()) {
        const res = await fetch('/api/item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const inv = _readStore('inventory', []);
      const item = {
        ...payload,
        item_id: payload.item_id || ('shd_' + Math.random().toString(36).slice(2, 10)),
        provenance_tier: 'TIER_1_OWNED'
      };
      item.crop_image_path = global.SHDPortableSolver.generateSvgCardDataUri(item);
      const idx = inv.findIndex((x) => x.item_id === payload.item_id);
      if (idx >= 0) inv[idx] = item;
      else inv.unshift(item);
      _writeStore('inventory', inv);
      return { status: 'ok', item, state: buildPortableFullState() };
    },

    async deleteItem(itemId) {
      if (await checkPcServer()) {
        const res = await fetch(`/api/item/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const inv = _readStore('inventory', []).filter((x) => x.item_id !== itemId);
      _writeStore('inventory', inv);
      return { status: 'ok', deleted: true, state: buildPortableFullState() };
    },

    async loadDemoStash() {
      if (await checkPcServer()) {
        const res = await fetch('/api/reset-golden', { method: 'POST' });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const demo = JSON.parse(JSON.stringify((global.SHD_CARTRIDGE_SEED || {}).golden_demo_items || []));
      _writeStore('inventory', demo);
      return { status: 'ok', state: buildPortableFullState() };
    },

    async clearAllStash() {
      if (await checkPcServer()) {
        const res = await fetch('/api/clear-all', { method: 'POST' });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      _writeStore('inventory', []);
      return { status: 'ok', state: buildPortableFullState() };
    },

    async saveLoadout(loadoutObj) {
      if (await checkPcServer()) {
        const res = await fetch('/api/loadouts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loadoutObj)
        });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const list = _readStore('saved_loadouts', []);
      const ld = {
        ...loadoutObj,
        loadout_id: loadoutObj.loadout_id || ('loadout_' + Math.random().toString(36).slice(2, 9)),
        updated_at: new Date().toISOString()
      };
      const idx = list.findIndex((x) => x.loadout_id === ld.loadout_id);
      if (idx >= 0) list[idx] = ld;
      else list.unshift(ld);
      _writeStore('saved_loadouts', list);
      return { status: 'ok', loadout: ld, state: buildPortableFullState() };
    },

    async deleteLoadout(loadoutId) {
      if (await checkPcServer()) {
        const res = await fetch(`/api/loadouts/${encodeURIComponent(loadoutId)}`, { method: 'DELETE' });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const list = _readStore('saved_loadouts', []).filter((x) => x.loadout_id !== loadoutId);
      _writeStore('saved_loadouts', list);
      return { status: 'ok', deleted: true, state: buildPortableFullState() };
    },

    async updateExpertiseCategory(categoryId, proficient, total) {
      if (await checkPcServer()) {
        const res = await fetch('/api/expertise/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category_id: categoryId, proficient, total })
        });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const exp = _readStore('expertise', {});
      const cat = (exp.categories || []).find((c) => c.category_id === categoryId);
      if (cat) {
        cat.proficient = proficient;
        if (total !== undefined && total !== null) cat.total = total;
      }
      _writeStore('expertise', _recomputeExpertiseTotals(exp));
      return { status: 'ok', state: buildPortableFullState() };
    },

    async upsertExpertiseItem(itemPayload) {
      if (await checkPcServer()) {
        const res = await fetch('/api/expertise/item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemPayload)
        });
        const data = await res.json();
        data.state = enrichServerState(data.state);
        return data;
      }
      const exp = _readStore('expertise', {});
      const items = exp.items || [];
      const key = itemPayload.item_key || String(itemPayload.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const rank = Number(itemPayload.rank || 0);
      const isProf = Boolean(rank >= 10 || itemPayload.is_proficient);
      const newObj = {
        item_key: key,
        name: itemPayload.name,
        category: itemPayload.category || 'Rifles',
        rank,
        is_proficient: isProf,
        upgrade_grade: Number(itemPayload.upgrade_grade || 0),
        acquisition_source: itemPayload.acquisition_source || 'Target Loot / Donate Printer Filament',
        filament_needed: isProf ? 0 : Math.max(0, (10 - rank) * 30)
      };
      const idx = items.findIndex((x) => x.item_key === key);
      if (idx >= 0) items[idx] = newObj;
      else items.unshift(newObj);
      exp.items = items;
      _writeStore('expertise', exp);
      return { status: 'ok', state: buildPortableFullState() };
    },

    async syncFromPcSeedToPhoneProfile() {
      const seed = global.SHD_CARTRIDGE_SEED || {};
      const admState = seed.admin_default_state || {};
      _writeStore('inventory', JSON.parse(JSON.stringify(admState.inventory || [])));
      _writeStore('saved_loadouts', JSON.parse(JSON.stringify(admState.saved_loadouts || seed.admin_showcase_loadouts || [])));
      _writeStore('expertise', JSON.parse(JSON.stringify(admState.expertise || {})));
      return { status: 'ok', state: buildPortableFullState() };
    },

    async pushPcToAndroidHub() {
      if (await checkPcServer()) {
        const res = await fetch('/api/hub-sync', { method: 'POST' });
        return await res.json();
      }
      return this.syncFromPcSeedToPhoneProfile();
    }
  };

  // Mount RollupBridge Console Pill if running inside the Android Hub Container
  global.addEventListener('DOMContentLoaded', () => {
    if (global.RollupBridge && typeof global.RollupBridge.mountInAppConsolePill === 'function') {
      global.RollupBridge.mountInAppConsolePill({
        appId: APP_ID,
        visibility: 'restricted',
        bottomOffset: '76px',
        settingsLabel: 'PC Sync / Vault',
        onOpenSettings: () => {
          if (typeof global.openBackupModal === 'function') global.openBackupModal();
        }
      });
    }
  });

  global.SHDStorageAdapter = SHDStorageAdapter;
})(window);
