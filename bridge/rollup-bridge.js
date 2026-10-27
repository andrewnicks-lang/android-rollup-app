/**
 * RollupBridge v1.0 — Multi-Tenant Identity, Admin ACL, Isolated Per-User Storage,
 * Phone Secret Vault & Native Hardware Bridge for RollupOS Mini-Apps.
 */
(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'rollup::v1';
  const SESSION_KEY = `${STORAGE_PREFIX}::auth::session`;
  const IMPERSONATE_KEY = `${STORAGE_PREFIX}::auth::impersonate`;
  const ACL_STORAGE_KEY = `${STORAGE_PREFIX}::hub::acl`;
  const REGISTRY_CACHE_KEY = `${STORAGE_PREFIX}::hub::registry_cache`;
  const INSTALLED_LEDGER_KEY = `${STORAGE_PREFIX}::device::installed_ledger`;

  function normEmail(email) {
    return String(email || 'guest@local').trim().toLowerCase();
  }

  function detectAppId() {
    if (global.ROLLUP_APP_ID) return global.ROLLUP_APP_ID;
    const path = global.location.pathname || '';
    const m = path.match(/\/apps\/([^\/]+)/);
    return m ? m[1] : 'hub-root';
  }

  function resolveHubRootUrl() {
    const path = global.location.pathname || '';
    const idx = path.indexOf('/apps/');
    if (idx !== -1) {
      return path.slice(0, idx + 1) + 'index.html';
    }
    return './index.html';
  }

  function resolveRegistryUrl() {
    const path = global.location.pathname || '';
    const idx = path.indexOf('/apps/');
    if (idx !== -1) {
      return path.slice(0, idx + 1) + 'registry.json';
    }
    return './registry.json';
  }

  function resolveManualUrl(appId, ext = 'pdf', hash = '') {
    const cleanId = encodeURIComponent(appId || detectAppId());
    const path = global.location.pathname || '';
    const idx = path.indexOf('/apps/');
    const prefix = idx !== -1 ? path.slice(0, idx + 1) : './';
    const q = hash ? `?h=${encodeURIComponent(hash)}` : '';
    return `${prefix}manuals/${cleanId}_User_Manual.${ext}${q}`;
  }

  // Decode Google Identity Services JWT credential
  function parseGoogleJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // Default fallback ACL if registry hasn't been fetched yet
  const FALLBACK_ACL = {
    admin_emails: ['andrewnicks@gmail.com'],
    google_client_id: '',
    users: {
      'andrewnicks@gmail.com': {
        email: 'andrewnicks@gmail.com',
        name: 'Andrew Nicks',
        role: 'admin',
        avatar: 'AN',
        badge: '👑 Admin • Mahomes Depot (#4)',
        authorized_apps: ['gravity-agent-monitor', 'fantasy-manager', 'csc-site-discovery', 'shd-div2-intel', 'field-snap', 'bridge-lab', 'lightning-garage'],
        default_app_configs: {
          'fantasy-manager': {
            league_id: 945552,
            team_id: 4,
            team_name: 'Mahomes Depot',
            blend_weight: 60
          }
        }
      },
      'americas.team.tester@gmail.com': {
        email: 'americas.team.tester@gmail.com',
        name: "League Mate (America's Team #14)",
        role: 'tester',
        avatar: 'AT',
        badge: '🏈 Tester • Weekend Warriors',
        authorized_apps: ['fantasy-manager'],
        default_app_configs: {
          'fantasy-manager': {
            league_id: 945552,
            team_id: 14,
            team_name: "America's Team",
            blend_weight: 60
          }
        }
      },
      'questionables.tester@gmail.com': {
        email: 'questionables.tester@gmail.com',
        name: 'League Mate (The Questionables #1)',
        role: 'tester',
        avatar: 'TQ',
        badge: '🏈 Tester • Weekend Warriors',
        authorized_apps: ['fantasy-manager'],
        default_app_configs: {
          'fantasy-manager': {
            league_id: 945552,
            team_id: 1,
            team_name: 'The Questionables',
            blend_weight: 60
          }
        }
      },
      'field.tech.tester@gmail.com': {
        email: 'field.tech.tester@gmail.com',
        name: 'Field Tester (No Fantasy Access)',
        role: 'tester',
        avatar: 'FT',
        badge: '🔧 Field Utility Tester',
        authorized_apps: ['field-snap', 'csc-site-discovery'],
        default_app_configs: {}
      }
    }
  };

  const auth = {
    getACL() {
      try {
        const raw = localStorage.getItem(ACL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.users) return parsed;
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(FALLBACK_ACL));
    },

    saveACL(acl) {
      acl.local_admin_updated_at = new Date().toISOString();
      localStorage.setItem(ACL_STORAGE_KEY, JSON.stringify(acl));
      // Best-effort sync to local Python Hub server if running
      fetch('/api/hub/acl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acl)
      }).catch(() => {});
      return acl;
    },

    seedACLFromRegistry(registryObj) {
      if (!registryObj || !registryObj.hub || !registryObj.hub.auth) return this.getACL();
      const current = this.getACL();
      const regAuth = registryObj.hub.auth;
      const remoteUpdated = (registryObj.hub && registryObj.hub.updated_at) || '';
      const localUpdated = current.local_admin_updated_at || '';
      const realUser = this.getRealSessionUser();
      const preferRemote = !realUser || !realUser.is_admin || !localUpdated || remoteUpdated > localUpdated;

      if (regAuth.google_client_id && !current.google_client_id) {
        current.google_client_id = regAuth.google_client_id;
      }
      (regAuth.admin_emails || []).forEach((em) => {
        const ne = normEmail(em);
        if (!current.admin_emails.includes(ne)) current.admin_emails.push(ne);
      });
      (regAuth.default_users || []).forEach((u) => {
        const ne = normEmail(u.email);
        if (!current.users[ne] || preferRemote) {
          current.users[ne] = {
            email: ne,
            name: u.name || ne.split('@')[0],
            role: u.role || 'tester',
            avatar: u.avatar || (u.name || ne).slice(0, 2).toUpperCase(),
            badge: u.badge || 'Tester',
            authorized_apps: u.authorized_apps || [],
            default_app_configs: u.default_app_configs || {}
          };
        }
      });
      localStorage.setItem(ACL_STORAGE_KEY, JSON.stringify(current));
      return current;
    },

    getRealSessionUser() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const u = JSON.parse(raw);
          if (u && u.email) return this._hydrateUser(u.email, u);
        }
      } catch (e) {}
      return null;
    },

    getImpersonatedUser() {
      try {
        const impEmail = localStorage.getItem(IMPERSONATE_KEY);
        if (impEmail) {
          const real = this.getRealSessionUser();
          if (real && real.role === 'admin') {
            return this._hydrateUser(impEmail, { email: impEmail });
          } else {
            localStorage.removeItem(IMPERSONATE_KEY);
          }
        }
      } catch (e) {}
      return null;
    },

    getCurrentUser() {
      return this.getImpersonatedUser() || this.getRealSessionUser();
    },

    isImpersonating() {
      return Boolean(this.getImpersonatedUser());
    },

    _hydrateUser(email, fallbackMeta = {}) {
      const ne = normEmail(email);
      const acl = this.getACL();
      const isAdminEmail = (acl.admin_emails || []).map(normEmail).includes(ne);
      let record = acl.users[ne];
      if (!record) {
        const displayName = fallbackMeta.name || ne.split('@')[0];
        record = {
          email: ne,
          name: displayName,
          role: isAdminEmail ? 'admin' : 'tester',
          avatar: fallbackMeta.avatar || displayName.slice(0, 2).toUpperCase(),
          picture: fallbackMeta.picture || '',
          badge: isAdminEmail ? '👑 Admin' : '🧪 Google User',
          authorized_apps: isAdminEmail ? ['fantasy-manager', 'field-snap', 'bridge-lab'] : [],
          default_app_configs: {}
        };
        acl.users[ne] = record;
        this.saveACL(acl);
      } else if (isAdminEmail && record.role !== 'admin') {
        record.role = 'admin';
      }
      return {
        ...record,
        picture: fallbackMeta.picture || record.picture || '',
        is_admin: record.role === 'admin' || isAdminEmail
      };
    },

    signInWithGoogleEmail(email, name, picture) {
      const ne = normEmail(email);
      const user = this._hydrateUser(ne, { name, picture });
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          email: user.email,
          name: user.name,
          picture: user.picture || '',
          signed_in_at: new Date().toISOString()
        })
      );
      localStorage.removeItem(IMPERSONATE_KEY);
      return user;
    },

    signInWithGoogleCredential(jwtCredential) {
      const payload = parseGoogleJwt(jwtCredential);
      if (!payload || !payload.email) {
        throw new Error('Invalid Google JWT credential');
      }
      return this.signInWithGoogleEmail(payload.email, payload.name || payload.email, payload.picture || '');
    },

    signOut() {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(IMPERSONATE_KEY);
    },

    impersonateUser(targetEmail) {
      const real = this.getRealSessionUser();
      if (!real || !real.is_admin) {
        throw new Error('Only Admin can preview as another user.');
      }
      const ne = normEmail(targetEmail);
      if (ne === real.email) {
        localStorage.removeItem(IMPERSONATE_KEY);
      } else {
        this._hydrateUser(ne);
        localStorage.setItem(IMPERSONATE_KEY, ne);
      }
      return this.getCurrentUser();
    },

    stopImpersonation() {
      localStorage.removeItem(IMPERSONATE_KEY);
      return this.getCurrentUser();
    },

    canAccessApp(appId, appVisibility = 'restricted') {
      const user = this.getCurrentUser();
      if (!user) return false;
      if (user.is_admin) return true;
      if (appVisibility === 'admin_only') return false;
      if (appVisibility === 'public') return true;
      const allowed = Array.isArray(user.authorized_apps) ? user.authorized_apps : [];
      return allowed.includes(appId);
    },

    // Admin Controls: Add/Update user & toggle app permissions
    upsertUserPermission(email, updates = {}) {
      const acl = this.getACL();
      const ne = normEmail(email);
      const existing = acl.users[ne] || {
        email: ne,
        name: updates.name || ne.split('@')[0],
        role: 'tester',
        avatar: (updates.name || ne).slice(0, 2).toUpperCase(),
        badge: updates.badge || '🧪 Authorized Google Tester',
        authorized_apps: [],
        default_app_configs: {}
      };
      acl.users[ne] = {
        ...existing,
        ...updates,
        email: ne
      };
      this.saveACL(acl);
      return acl.users[ne];
    },

    toggleAppForUser(email, appId, enabled) {
      const acl = this.getACL();
      const ne = normEmail(email);
      const u = this._hydrateUser(ne);
      const set = new Set(u.authorized_apps || []);
      if (enabled) set.add(appId);
      else set.delete(appId);
      acl.users[ne] = {
        ...u,
        authorized_apps: Array.from(set)
      };
      this.saveACL(acl);
      return acl.users[ne];
    },

    removeUser(email) {
      const acl = this.getACL();
      const ne = normEmail(email);
      if ((acl.admin_emails || []).includes(ne)) {
        throw new Error('Cannot remove primary Admin account.');
      }
      delete acl.users[ne];
      this.saveACL(acl);
    }
  };

  // Isolated Per-User + Per-App Storage
  const storage = {
    _key(key, customAppId, customEmail) {
      const u = auth.getCurrentUser();
      const email = normEmail(customEmail || (u && u.email) || 'guest@local');
      const appId = customAppId || detectAppId();
      return `${STORAGE_PREFIX}::u::${email}::app::${appId}::${key}`;
    },

    get(key, defaultVal = null, customAppId = null) {
      try {
        const raw = localStorage.getItem(this._key(key, customAppId));
        if (raw === null || raw === undefined) return defaultVal;
        return JSON.parse(raw);
      } catch (e) {
        return defaultVal;
      }
    },

    set(key, value, customAppId = null) {
      const fullKey = this._key(key, customAppId);
      localStorage.setItem(fullKey, JSON.stringify(value));
      return value;
    },

    remove(key, customAppId = null) {
      localStorage.removeItem(this._key(key, customAppId));
    },

    listKeys(customAppId = null, customEmail = null) {
      const u = auth.getCurrentUser();
      const email = normEmail(customEmail || (u && u.email) || 'guest@local');
      const appId = customAppId || detectAppId();
      const prefix = `${STORAGE_PREFIX}::u::${email}::app::${appId}::`;
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keys.push(k.slice(prefix.length));
        }
      }
      return keys;
    },

    getAll(customAppId = null, customEmail = null) {
      const u = auth.getCurrentUser();
      const email = normEmail(customEmail || (u && u.email) || 'guest@local');
      const appId = customAppId || detectAppId();
      const prefix = `${STORAGE_PREFIX}::u::${email}::app::${appId}::`;
      const out = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          const shortKey = k.slice(prefix.length);
          try {
            out[shortKey] = JSON.parse(localStorage.getItem(k));
          } catch (e) {
            out[shortKey] = localStorage.getItem(k);
          }
        }
      }
      return out;
    },

    clearApp(customAppId = null, customEmail = null) {
      const u = auth.getCurrentUser();
      const email = normEmail(customEmail || (u && u.email) || 'guest@local');
      const appId = customAppId || detectAppId();
      const prefix = `${STORAGE_PREFIX}::u::${email}::app::${appId}::`;
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) toRemove.push(k);
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
      return toRemove.length;
    }
  };

  // Per-User App Config (Merges Admin/User defaults with User's saved setup)
  const user = {
    getAppConfig(customAppId = null) {
      const appId = customAppId || detectAppId();
      const current = auth.getCurrentUser();
      const defaults =
        (current &&
          current.default_app_configs &&
          current.default_app_configs[appId]) ||
        {};
      const saved = storage.get('__user_config__', null, appId);
      return {
        ...defaults,
        ...(saved || {}),
        _isConfigured: Boolean(saved || Object.keys(defaults).length > 0)
      };
    },

    setAppConfig(patch, customAppId = null) {
      const appId = customAppId || detectAppId();
      const existing = storage.get('__user_config__', {}, appId) || {};
      const next = {
        ...existing,
        ...patch,
        updated_at: new Date().toISOString()
      };
      storage.set('__user_config__', next, appId);
      return this.getAppConfig(appId);
    },

    resetAppConfig(customAppId = null) {
      const appId = customAppId || detectAppId();
      storage.remove('__user_config__', appId);
    }
  };

  // Per-User On-Device Secret Vault (Never synced to GitHub)
  const vault = {
    _vkey(secretName) {
      const u = auth.getCurrentUser();
      const email = normEmail((u && u.email) || 'guest@local');
      return `${STORAGE_PREFIX}::vault::${email}::${secretName}`;
    },

    getSecret(secretName, defaultVal = '') {
      return localStorage.getItem(this._vkey(secretName)) || defaultVal;
    },

    setSecret(secretName, secretValue) {
      if (!secretValue) {
        localStorage.removeItem(this._vkey(secretName));
      } else {
        localStorage.setItem(this._vkey(secretName), String(secretValue).trim());
      }
    },

    get(secretName, defaultVal = '') {
      return this.getSecret(secretName, defaultVal);
    },

    set(secretName, secretValue) {
      return this.setSecret(secretName, secretValue);
    },

    listConfiguredSecrets() {
      const u = auth.getCurrentUser();
      const email = normEmail((u && u.email) || 'guest@local');
      const prefix = `${STORAGE_PREFIX}::vault::${email}::`;
      const names = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) names.push(k.slice(prefix.length));
      }
      return names;
    }
  };

  // Camera & Photo Compression Bridge
  const camera = {
    capturePhoto(options = { maxWidth: 1280, quality: 0.82 }) {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        if (options.useRearCamera !== false) {
          input.setAttribute('capture', 'environment');
        }
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = () => {
          const file = input.files && input.files[0];
          document.body.removeChild(input);
          if (!file) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
              const maxW = options.maxWidth || 1280;
              let w = img.width;
              let h = img.height;
              if (w > maxW) {
                h = Math.round((h * maxW) / w);
                w = maxW;
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const dataUrl = canvas.toDataURL('image/jpeg', options.quality || 0.82);
              resolve({
                name: file.name,
                width: w,
                height: h,
                sizeKB: Math.round((dataUrl.length * 0.75) / 1024),
                capturedAt: new Date().toISOString(),
                dataUrl
              });
            };
            img.onerror = reject;
            img.src = ev.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        };

        input.click();
      });
    }
  };

  // File Export & Native Share Sheet (RollupNative Android APK Bridge + Browser Fallback)
  const files = {
    downloadBase64(filename, base64Data, mimeType = 'application/octet-stream') {
      if (global.RollupNative && typeof global.RollupNative.saveBase64File === 'function') {
        global.RollupNative.saveBase64File(filename, mimeType, base64Data);
        return true;
      }
      const clean = String(base64Data || '').includes(',') ? String(base64Data).split(',')[1] : String(base64Data || '');
      const bin = atob(clean);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
      return true;
    },

    downloadText(filename, content, mimeType = 'text/plain;charset=utf-8') {
      if (global.RollupNative && typeof global.RollupNative.saveBase64File === 'function') {
        const bytes = new TextEncoder().encode(String(content ?? ''));
        let binary = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
        }
        global.RollupNative.saveBase64File(filename, mimeType, btoa(binary));
        return;
      }
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 250);
    },

    exportJSON(filename, dataObj) {
      this.downloadText(filename, JSON.stringify(dataObj, null, 2), 'application/json');
    },

    exportCSV(filename, rows) {
      if (!Array.isArray(rows) || rows.length === 0) return;
      const headers = Object.keys(rows[0]);
      const csvLines = [
        headers.join(','),
        ...rows.map((r) =>
          headers
            .map((h) => {
              const cell = r[h] === null || r[h] === undefined ? '' : String(r[h]);
              return `"${cell.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
      ];
      this.downloadText(filename, csvLines.join('\n'), 'text/csv;charset=utf-8');
    },

    async share(title, text, url) {
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url: url || global.location.href });
          return true;
        } catch (e) {
          return false;
        }
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url || ''}`.trim());
        return true;
      }
      return false;
    },

    shareBase64File(filename, base64Data, mimeType = 'application/octet-stream', title = '') {
      const clean = String(base64Data || '').includes(',') ? String(base64Data).split(',')[1] : String(base64Data || '');
      if (global.RollupNative && typeof global.RollupNative.shareBase64File === 'function') {
        return global.RollupNative.shareBase64File(filename, mimeType, clean, title || filename);
      }
      if (navigator.share && typeof File === 'function') {
        try {
          const bin = atob(clean);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          const fileObj = new File([bytes], filename, { type: mimeType });
          if (!navigator.canShare || navigator.canShare({ files: [fileObj] })) {
            navigator.share({ title: title || filename, files: [fileObj] }).catch(() => {});
            return true;
          }
        } catch (e) {}
      }
      return this.downloadBase64(filename, clean, mimeType);
    },

    shareTextFile(filename, content, mimeType = 'text/plain;charset=utf-8', title = '') {
      if (global.RollupNative && typeof global.RollupNative.shareBase64File === 'function') {
        const bytes = new TextEncoder().encode(String(content ?? ''));
        let binary = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
        }
        return global.RollupNative.shareBase64File(filename, mimeType, btoa(binary), title || filename);
      }
      this.downloadText(filename, content, mimeType);
      return true;
    }
  };

  // USB-C OTG Serial Bridge (RollupOS Android Native UDS Read-Only Gate + Desktop WebSerial Fallback)
  let _webSerialPort = null;
  let _webSerialReader = null;
  let _webSerialWriter = null;
  let _webSerialPendingRead = null;
  const _BAUD_CANDIDATES = [115200, 500000, 38400, 2000000, 230400];
  const _BAUD_OK_RE = /(ELM|STN|OBD|VLINKER|OK|\?)/i;
  const _PENDING_78_RE = /(?:^|[\r\n])\s*7F\s*[0-9A-F]{2}\s*78\s*(?=[\r\n])/gi;
  const _P2_STAR_EXTEND_MS = 5500;
  const _P2_STAR_MAX_TOTAL_MS = 15000;

  const usbSerial = {
    isNativeApk() {
      return Boolean(global.RollupNative && typeof global.RollupNative.usbIsSupported === 'function');
    },

    isSupported() {
      return this.isNativeApk() || Boolean(global.navigator && global.navigator.serial);
    },

    listDevices() {
      if (this.isNativeApk()) {
        try {
          return JSON.parse(global.RollupNative.usbListDevices() || '{"ok":false,"devices":[]}');
        } catch (e) {
          return { ok: false, devices: [], error: String(e) };
        }
      }
      return { ok: true, devices: [], webSerial: Boolean(global.navigator && global.navigator.serial) };
    },

    requestPermission(deviceId = -1) {
      if (!this.isNativeApk()) {
        return Promise.resolve({ ok: true, granted: true, webSerial: true });
      }
      return new Promise((resolve) => {
        let settled = false;
        const prev = global.__onRollupUsbPermission;
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            global.__onRollupUsbPermission = prev;
            resolve({ ok: false, granted: false, error: 'USB permission dialog timed out' });
          }
        }, 25000);

        global.__onRollupUsbPermission = (granted, devId) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          global.__onRollupUsbPermission = prev;
          resolve({ ok: Boolean(granted), granted: Boolean(granted), deviceId: devId });
        };

        try {
          const res = JSON.parse(global.RollupNative.usbRequestPermission(Number(deviceId)) || '{}');
          if (!res.pending) {
            settled = true;
            clearTimeout(timer);
            global.__onRollupUsbPermission = prev;
            resolve(res);
          }
        } catch (e) {
          settled = true;
          clearTimeout(timer);
          global.__onRollupUsbPermission = prev;
          resolve({ ok: false, granted: false, error: String(e) });
        }
      });
    },

    async requestAndConnect(options = {}) {
      const primaryBaud = Number(options.baudRate || 115200);
      const autoBaud = options.autoBaud !== false;
      const candidates = autoBaud
        ? [primaryBaud, ..._BAUD_CANDIDATES.filter((b) => b !== primaryBaud)]
        : [primaryBaud];

      if (this.isNativeApk()) {
        const listed = this.listDevices();
        const devList = Array.isArray(listed.devices) ? listed.devices : [];
        const firstDev = devList[0] || null;
        if (!firstDev) {
          return { ok: false, error: 'No USB-C OTG OBD adapter found. Plug in OBDLink EX or Vgate vLinker FS.' };
        }
        const targetDev =
          options.deviceId != null
            ? devList.find((d) => Number(d.deviceId) === Number(options.deviceId)) || firstDev
            : firstDev;
        const targetId = targetDev.deviceId;
        if (!targetDev.hasPermission) {
          const perm = await this.requestPermission(targetId);
          if (!perm.granted) {
            return { ok: false, error: perm.error || 'Android USB permission was not granted.' };
          }
        }
        let firstConn = null;
        for (let i = 0; i < candidates.length; i++) {
          const cand = candidates[i];
          try {
            const connRes = JSON.parse(global.RollupNative.usbConnect(targetId, cand) || '{"ok":false}');
            if (!connRes || !connRes.ok) {
              if (i === 0) return connRes || { ok: false, error: 'USB connect failed' };
              continue;
            }
            if (!firstConn) firstConn = connRes;
            if (!autoBaud) return connRes;
            const probe = await this.transact('ATI', 420, false);
            if (probe && probe.ok && Array.isArray(probe.lines) && probe.lines.some((l) => _BAUD_OK_RE.test(l) && !l.includes('\uFFFD'))) {
              return { ...connRes, baudRate: cand };
            }
          } catch (e) {
            if (i === 0) return { ok: false, error: String(e) };
          }
        }
        try {
          return JSON.parse(global.RollupNative.usbConnect(targetId, primaryBaud) || '{"ok":false}');
        } catch (e) {
          return firstConn || { ok: false, error: String(e) };
        }
      }

      if (global.navigator && global.navigator.serial) {
        try {
          await this.disconnect();
          _webSerialPort = await global.navigator.serial.requestPort();
          for (let i = 0; i < candidates.length; i++) {
            const cand = candidates[i];
            try {
              if (_webSerialReader) { try { await _webSerialReader.cancel(); _webSerialReader.releaseLock(); } catch (e) {} _webSerialReader = null; }
              if (_webSerialWriter) { try { _webSerialWriter.releaseLock(); } catch (e) {} _webSerialWriter = null; }
              _webSerialPendingRead = null;
              if (i > 0) { try { await _webSerialPort.close(); } catch (e) {} }
              await _webSerialPort.open({ baudRate: cand });
              _webSerialWriter = _webSerialPort.writable.getWriter();
              _webSerialReader = _webSerialPort.readable.getReader();
              if (!autoBaud) {
                return { ok: true, productName: 'WebSerial OBD Adapter', driver: 'WebSerial', baudRate: cand, readOnlyHardwareGate: false };
              }
              const probe = await this.transact('ATI', 420, false);
              if (probe && probe.ok && Array.isArray(probe.lines) && probe.lines.some((l) => _BAUD_OK_RE.test(l) && !l.includes('\uFFFD'))) {
                return { ok: true, productName: 'WebSerial OBD Adapter', driver: 'WebSerial', baudRate: cand, readOnlyHardwareGate: false };
              }
            } catch (openErr) {
              if (i === 0 && !autoBaud) throw openErr;
            }
          }
          // Re-open at primaryBaud if adapter was silent during probe
          if (_webSerialReader) { try { await _webSerialReader.cancel(); _webSerialReader.releaseLock(); } catch (e) {} _webSerialReader = null; }
          if (_webSerialWriter) { try { _webSerialWriter.releaseLock(); } catch (e) {} _webSerialWriter = null; }
          _webSerialPendingRead = null;
          try { await _webSerialPort.close(); } catch (e) {}
          await _webSerialPort.open({ baudRate: primaryBaud });
          _webSerialWriter = _webSerialPort.writable.getWriter();
          _webSerialReader = _webSerialPort.readable.getReader();
          return { ok: true, productName: 'WebSerial OBD Adapter', driver: 'WebSerial', baudRate: primaryBaud, readOnlyHardwareGate: false };
        } catch (e) {
          await this.disconnect();
          return { ok: false, error: e.message || String(e) };
        }
      }

      return { ok: false, error: 'USB-C OTG requires RollupOS Android v1.2+ APK or Desktop Chrome/Edge WebSerial.' };
    },

    async transact(command, timeoutMs = 1500, parkedConfirmed = false) {
      if (this.isNativeApk()) {
        // Yield a macrotask so WebView progress UI paints smoothly between synchronous JavaBridge frames
        await new Promise((r) => setTimeout(r, 0));
        try {
          return JSON.parse(
            global.RollupNative.usbTransact(String(command || ''), Number(timeoutMs || 1500), Boolean(parkedConfirmed)) ||
              '{"ok":false}'
          );
        } catch (e) {
          return { ok: false, error: String(e) };
        }
      }
      if (_webSerialPort && _webSerialWriter && _webSerialReader) {
        const cmd = String(command || '').trim();
        await _webSerialWriter.write(new TextEncoder().encode(cmd + '\r'));
        let buf = '';
        const startMs = Date.now();
        const baseWaitMs = Math.max(50, Number(timeoutMs || 1500));
        let deadline = startMs + baseWaitMs;
        const maxDeadline = startMs + Math.max(baseWaitMs, _P2_STAR_MAX_TOTAL_MS);
        let seenPending78 = 0;
        while (Date.now() < deadline) {
          if (!_webSerialPendingRead) {
            _webSerialPendingRead = _webSerialReader.read().then(
              (r) => ({ done: Boolean(r && r.done), value: r ? r.value : null }),
              (err) => ({ error: err })
            );
          }
          const sliceMs = Math.max(10, Math.min(120, deadline - Date.now()));
          const res = await Promise.race([
            _webSerialPendingRead,
            new Promise((r) => setTimeout(() => r({ timeout: true }), sliceMs))
          ]);
          if (res && res.timeout) {
            continue;
          }
          _webSerialPendingRead = null;
          if (res && res.error) {
            return { ok: false, error: String(res.error) };
          }
          if (res && res.value) {
            buf += new TextDecoder().decode(res.value);
            if (buf.includes('>')) break;
            const matches = buf.match(_PENDING_78_RE);
            const pendingCnt = matches ? matches.length : 0;
            if (pendingCnt > seenPending78) {
              seenPending78 = pendingCnt;
              deadline = Math.min(maxDeadline, Math.max(deadline, Date.now() + _P2_STAR_EXTEND_MS));
            }
          }
          if (res && res.done) break;
        }
        const lines = buf
          .split('>')[0]
          .split(/\r?\n|\r/)
          .map((s) => s.trim())
          .filter(Boolean);
        return { ok: true, blocked: false, lines };
      }
      return { ok: false, error: 'USB adapter not connected' };
    },

    async disconnect() {
      if (this.isNativeApk()) {
        try {
          return JSON.parse(global.RollupNative.usbDisconnect() || '{"ok":true}');
        } catch (e) {
          return { ok: false, error: String(e) };
        }
      }
      _webSerialPendingRead = null;
      try { if (_webSerialReader) { await _webSerialReader.cancel(); _webSerialReader.releaseLock(); } } catch (e) {}
      try { if (_webSerialWriter) { _webSerialWriter.releaseLock(); } } catch (e) {}
      try { if (_webSerialPort) { await _webSerialPort.close(); } } catch (e) {}
      _webSerialReader = null;
      _webSerialWriter = null;
      _webSerialPort = null;
      return { ok: true };
    },

    setKeepScreenOn(keepOn) {
      if (this.isNativeApk() && typeof global.RollupNative.usbSetKeepScreenOn === 'function') {
        return global.RollupNative.usbSetKeepScreenOn(Boolean(keepOn));
      }
      return false;
    }
  };

  async function lanSyncRequest(url, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const token = String(options.token || '');
    const bodyStr = typeof options.body === 'string' ? options.body : options.body ? JSON.stringify(options.body) : '';
    if (global.RollupNative && typeof global.RollupNative.lanSyncRequest === 'function') {
      await new Promise((r) => setTimeout(r, 0));
      const raw = global.RollupNative.lanSyncRequest(String(url), method, token, bodyStr);
      const parsed = JSON.parse(raw || '{"ok":false}');
      let data = {};
      if (parsed.body) {
        try { data = JSON.parse(parsed.body); } catch (e) {}
      }
      if (parsed.status === 0 && !parsed.ok) {
        throw new Error(parsed.error || 'LAN Sync connection failed');
      }
      return { ok: Boolean(parsed.ok), status: Number(parsed.status || 0), data };
    }
    const headers = { ...(options.headers || {}) };
    if (token) headers['X-Sync-Token'] = token;
    if (method === 'POST' && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    const resp = await fetch(url, {
      method,
      headers,
      body: method === 'POST' ? bodyStr : undefined
    });
    const data = await resp.json().catch(() => ({}));
    return { ok: resp.ok, status: resp.status, data };
  }

  // Over-The-Air (OTA) Build Hash & Version Update Detector
  let _inAppPollTimer = null;
  let _inAppListenersBound = false;

  const updates = {
    getLedger() {
      try {
        const raw = localStorage.getItem(INSTALLED_LEDGER_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            parsed.apps = parsed.apps || {};
            return parsed;
          }
        }
      } catch (e) {}
      return { hub: null, apps: {}, last_checked_at: null };
    },

    saveLedger(ledger) {
      try {
        localStorage.setItem(INSTALLED_LEDGER_KEY, JSON.stringify(ledger));
      } catch (e) {}
      return ledger;
    },

    _hasPriorDeviceFootprint(appId) {
      try {
        const needle = `::app::${appId}::`;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.includes(needle)) return true;
        }
      } catch (e) {}
      return false;
    },

    markAppInstalled(appId, version, buildHash) {
      if (!appId) return;
      const ledger = this.getLedger();
      ledger.apps[appId] = {
        version: String(version || '1.0.0'),
        build_hash: String(buildHash || ''),
        seen_at: new Date().toISOString()
      };
      this.saveLedger(ledger);
    },

    markHubInstalled(version, buildHash) {
      const ledger = this.getLedger();
      ledger.hub = {
        version: String(version || '1.0.0'),
        build_hash: String(buildHash || ''),
        seen_at: new Date().toISOString()
      };
      this.saveLedger(ledger);
    },

    getAppStatus(remoteApp) {
      if (!remoteApp || !remoteApp.id) {
        return { state: 'unknown', hasUpdate: false };
      }
      const ledger = this.getLedger();
      const installed = ledger.apps[remoteApp.id];
      const remoteVer = String(remoteApp.version || '1.0.0');
      const remoteHash = String(remoteApp.build_hash || '');

      if (!installed) {
        if (this._hasPriorDeviceFootprint(remoteApp.id)) {
          return {
            state: 'outdated',
            hasUpdate: true,
            hashOnlyChange: false,
            installedVersion: 'prior',
            installedHash: '',
            remoteVersion: remoteVer,
            remoteHash
          };
        }
        return {
          state: 'new',
          hasUpdate: false,
          hashOnlyChange: false,
          installedVersion: null,
          installedHash: '',
          remoteVersion: remoteVer,
          remoteHash
        };
      }

      const instVer = String(installed.version || '');
      const instHash = String(installed.build_hash || '');
      const hashDiff = Boolean(remoteHash && instHash && remoteHash !== instHash);
      const verDiff = Boolean(remoteVer && instVer && remoteVer !== instVer);
      const missingHashStamp = Boolean(remoteHash && !instHash);
      const hasUpdate = hashDiff || verDiff || missingHashStamp;

      return {
        state: hasUpdate ? 'outdated' : 'up_to_date',
        hasUpdate,
        hashOnlyChange: hashDiff && !verDiff,
        installedVersion: instVer,
        installedHash: instHash,
        remoteVersion: remoteVer,
        remoteHash,
        seenAt: installed.seen_at || null
      };
    },

    async fetchLiveRegistry() {
      const url = `${resolveRegistryUrl()}?__ota=${Date.now()}`;
      const resp = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!resp.ok) throw new Error(`OTA check HTTP ${resp.status}`);
      const reg = await resp.json();
      const ledger = this.getLedger();
      ledger.last_checked_at = new Date().toISOString();
      this.saveLedger(ledger);
      try {
        localStorage.setItem(REGISTRY_CACHE_KEY, JSON.stringify(reg));
        auth.seedACLFromRegistry(reg);
      } catch (e) {}
      return reg;
    },

    async purgeAppCache(appId, offlineAssets = []) {
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.update().catch(() => {})));
        }
        if ('caches' in global) {
          const keys = await caches.keys();
          for (const k of keys) {
            const c = await caches.open(k);
            const reqs = await c.keys();
            for (const req of reqs) {
              if (
                req.url.includes(`/apps/${appId}/`) ||
                req.url.includes('/bridge/rollup-bridge.js') ||
                req.url.endsWith('/registry.json')
              ) {
                await c.delete(req);
              }
            }
          }
          // Warm fresh assets into active cache if online
          if (Array.isArray(offlineAssets) && offlineAssets.length > 0) {
            const rootPrefix = resolveHubRootUrl().replace(/index\.html$/, '');
            await Promise.all(
              offlineAssets.map((rel) =>
                fetch(`${rootPrefix}${rel.replace(/^\.\//, '')}?__ota=${Date.now()}`, { cache: 'no-store' }).catch(() => {})
              )
            );
          }
        }
      } catch (e) {}
    },

    async applyInAppReload(appId, remoteApp) {
      await this.purgeAppCache(appId, (remoteApp && remoteApp.offline_assets) || []);
      if (remoteApp) {
        this.markAppInstalled(appId, remoteApp.version, remoteApp.build_hash);
      }
      const nextVer = encodeURIComponent((remoteApp && remoteApp.version) || '1.0.0');
      const nextHash = encodeURIComponent((remoteApp && remoteApp.build_hash) || Date.now());
      global.location.replace(`${global.location.pathname}?v=${nextVer}&h=${nextHash}`);
    },

    startInAppWatcher(appId, callbacks = {}) {
      if (!appId || appId === 'hub-root') return;
      const params = new URLSearchParams(global.location.search || '');
      const urlHash = params.get('h') || '';
      const urlVer = params.get('v') || '';
      let baseline = urlHash ? { version: urlVer, build_hash: urlHash } : null;

      const checkOnce = async () => {
        try {
          const reg = await this.fetchLiveRegistry();
          const remoteApp = (reg.apps || []).find((a) => a.id === appId);
          if (!remoteApp) return;

          if (!baseline) {
            baseline = {
              version: String(remoteApp.version || '1.0.0'),
              build_hash: String(remoteApp.build_hash || '')
            };
            this.markAppInstalled(appId, baseline.version, baseline.build_hash);
            if (typeof callbacks.onBaseline === 'function') {
              callbacks.onBaseline(baseline, remoteApp);
            }
            return;
          }

          // Ensure initial URL-pinned launch records installed version
          if (
            (!remoteApp.build_hash || remoteApp.build_hash === baseline.build_hash) &&
            String(remoteApp.version || '') === String(baseline.version || remoteApp.version || '')
          ) {
            this.markAppInstalled(appId, remoteApp.version, remoteApp.build_hash);
            if (typeof callbacks.onBaseline === 'function') {
              callbacks.onBaseline(baseline, remoteApp);
            }
            return;
          }

          const hashChanged = Boolean(
            remoteApp.build_hash && baseline.build_hash && remoteApp.build_hash !== baseline.build_hash
          );
          const verChanged = Boolean(
            remoteApp.version && baseline.version && String(remoteApp.version) !== String(baseline.version)
          );
          if (hashChanged || verChanged) {
            if (typeof callbacks.onUpdate === 'function') {
              callbacks.onUpdate(remoteApp, baseline);
            }
          }
        } catch (e) {}
      };

      checkOnce();

      if (_inAppPollTimer) clearInterval(_inAppPollTimer);
      _inAppPollTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          checkOnce();
        }
      }, 45000);

      if (!_inAppListenersBound) {
        _inAppListenersBound = true;
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') checkOnce();
        });
        global.addEventListener('online', () => checkOnce());
      }
    }
  };

  // Dynamic Per-App User Manual Viewer & PDF Accessor
  const manuals = {
    _lookupBuildHash(appId) {
      try {
        const raw = localStorage.getItem(REGISTRY_CACHE_KEY);
        if (raw) {
          const reg = JSON.parse(raw);
          const found = (reg.apps || []).find((a) => a.id === appId);
          if (found && found.build_hash) return found.build_hash;
        }
      } catch (e) {}
      const ledger = updates.getLedger();
      return (ledger.apps && ledger.apps[appId] && ledger.apps[appId].build_hash) || '';
    },

    getPdfUrl(customAppId = null, customHash = '') {
      const appId = customAppId || detectAppId();
      const h = customHash || this._lookupBuildHash(appId);
      return resolveManualUrl(appId, 'pdf', h);
    },

    getHtmlUrl(customAppId = null, customHash = '') {
      const appId = customAppId || detectAppId();
      const h = customHash || this._lookupBuildHash(appId);
      return resolveManualUrl(appId, 'html', h);
    },

    openPdf(customAppId = null) {
      const url = this.getPdfUrl(customAppId);
      global.open(url, '_blank', 'noopener');
    },

    close() {
      const el = document.getElementById('rollup-manual-drawer');
      if (el) el.remove();
    },

    open(customAppId = null, mode = 'hybrid') {
      const appId = customAppId || detectAppId();
      if (mode === 'pdf') {
        this.openPdf(appId);
        return;
      }
      this.close();
      const pdfUrl = this.getPdfUrl(appId);
      const htmlUrl = this.getHtmlUrl(appId);

      const overlay = document.createElement('div');
      overlay.id = 'rollup-manual-drawer';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:10050;background:rgba(3,7,18,0.86);backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;font-family:system-ui,-apple-system,sans-serif;';

      overlay.innerHTML = `
        <div style="width:100%;max-width:680px;height:90vh;background:#070b14;border:1px solid #334155;border-radius:16px 16px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -12px 40px rgba(0,0,0,0.75);">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 14px;background:#0f172a;border-bottom:1px solid #1e293b;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:7px;min-width:0;">
              <span style="font-size:15px;">📖</span>
              <strong style="font-size:13px;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">User Manual &amp; Quickstart</strong>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
              <a href="${pdfUrl}" target="_blank" rel="noopener" style="background:#0284c7;color:#ffffff;text-decoration:none;font-size:11px;font-weight:800;padding:5px 10px;border-radius:7px;display:inline-flex;align-items:center;gap:4px;">
                📄 Official PDF
              </a>
              <button id="rollup-man-share" style="background:#1e293b;border:1px solid #334155;color:#cbd5e1;font-size:11px;font-weight:700;padding:5px 9px;border-radius:7px;cursor:pointer;">
                📤 Share
              </button>
              <button id="rollup-man-close" style="background:#1e293b;border:1px solid #334155;color:#f8fafc;font-size:12px;font-weight:800;padding:4px 9px;border-radius:7px;cursor:pointer;">
                ✕
              </button>
            </div>
          </div>
          <iframe src="${htmlUrl}" title="Application User Manual" style="flex:1;width:100%;border:none;background:#070b14;"></iframe>
        </div>
      `;

      overlay.onclick = (ev) => {
        if (ev.target === overlay) this.close();
      };
      document.body.appendChild(overlay);

      const closeBtn = document.getElementById('rollup-man-close');
      if (closeBtn) closeBtn.onclick = () => this.close();

      const shareBtn = document.getElementById('rollup-man-share');
      if (shareBtn) {
        shareBtn.onclick = () => {
          const absPdf = new URL(pdfUrl, global.location.href).href;
          files.share(`${appId} User Manual (PDF)`, `RollupOS User Manual for ${appId}`, absPdf);
        };
      }
    },

    renderSettingsCardHtml(customAppId = null, customHeading = '') {
      const appId = customAppId || detectAppId();
      const pdfUrl = this.getPdfUrl(appId);
      const heading = customHeading || 'Application User Manual &amp; Quickstart';
      return `
        <div style="margin:10px 0;padding:10px 12px;background:linear-gradient(135deg,#0f172a,#172554);border:1px solid #0284c7;border-radius:10px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;text-align:left;">
          <div style="min-width:170px;flex:1;">
            <div style="font-size:12px;font-weight:800;color:#f8fafc;">📖 ${heading}</div>
            <div style="font-size:10.5px;color:#bae6fd;margin-top:2px;">Quickstart steps, feature deep-dives &amp; printable PDF</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
            <button type="button" onclick="window.RollupBridge && RollupBridge.manuals.open('${appId}')" style="background:#0284c7;color:#ffffff;border:none;border-radius:7px;padding:6px 10px;font-size:11px;font-weight:800;cursor:pointer;">
              📖 Read Guide
            </button>
            <a href="${pdfUrl}" target="_blank" rel="noopener" style="background:#0f172a;color:#7dd3fc;border:1px solid #38bdf8;text-decoration:none;border-radius:7px;padding:5px 9px;font-size:11px;font-weight:800;">
              📄 PDF
            </a>
          </div>
        </div>
      `;
    }
  };

  // Universal Cartridge Settings Sheet (Auto-generated for any app without custom settings)
  const settings = {
    close() {
      const el = document.getElementById('rollup-settings-drawer');
      if (el) el.remove();
    },

    async open(customAppId = null) {
      const appId = customAppId || detectAppId();
      this.close();

      let reg = null;
      try {
        const raw = localStorage.getItem(REGISTRY_CACHE_KEY);
        if (raw) reg = JSON.parse(raw);
      } catch (e) {}
      if (!reg) {
        try {
          reg = await updates.fetchLiveRegistry();
        } catch (e) {
          reg = { apps: [] };
        }
      }

      const appMeta = (reg.apps || []).find((a) => a.id === appId) || {
        id: appId,
        title: appId,
        icon: '📱',
        version: '1.0.0',
        userConfigSchema: []
      };
      const currentUser = auth.getCurrentUser();
      const currentCfg = user.getAppConfig(appId);
      const schema = Array.isArray(appMeta.userConfigSchema) ? appMeta.userConfigSchema : [];
      const keyCount = storage.listKeys(appId).length;

      const fieldsHtml = schema.length
        ? schema
            .map((f) => {
              const val =
                currentCfg[f.key] !== undefined
                  ? currentCfg[f.key]
                  : currentUser && currentUser.is_admin && f.defaultForAdmin !== undefined
                  ? f.defaultForAdmin
                  : f.default || '';
              const safeVal = String(val).replace(/"/g, '&quot;');
              const inputType = f.type === 'number' ? 'number' : 'text';
              return `
                <div style="margin-top:9px;">
                  <label style="display:block;font-size:11px;font-weight:700;color:#cbd5e1;margin-bottom:4px;">${f.label || f.key}</label>
                  <input data-rollup-cfg-key="${f.key}" data-rollup-cfg-type="${inputType}" type="${inputType}" value="${safeVal}" style="width:100%;box-sizing:border-box;background:#090d16;border:1px solid #334155;border-radius:8px;padding:8px 10px;color:#f8fafc;font-size:12.5px;">
                </div>
              `;
            })
            .join('')
        : `<div style="margin-top:8px;padding:9px 11px;background:#090d16;border:1px solid #1e293b;border-radius:8px;font-size:11.5px;color:#94a3b8;">Zero manual configuration fields required — state binds automatically to your Google profile.</div>`;

      const saveBtnHtml = schema.length
        ? `<button id="rollup-cfg-save-btn" type="button" style="flex:1;background:#2563eb;color:#ffffff;border:none;border-radius:8px;padding:9px 12px;font-size:12px;font-weight:800;cursor:pointer;">💾 Save Settings &amp; Reload</button>`
        : '';

      const overlay = document.createElement('div');
      overlay.id = 'rollup-settings-drawer';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:10040;background:rgba(3,7,18,0.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';

      overlay.innerHTML = `
        <div style="width:100%;max-width:440px;max-height:88vh;overflow-y:auto;background:#111827;border:1px solid #334155;border-radius:16px;padding:16px;color:#f8fafc;box-shadow:0 16px 40px rgba(0,0,0,0.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <div>
              <div style="font-size:10px;font-weight:800;color:#38bdf8;text-transform:uppercase;">Cartridge Settings &amp; Documentation</div>
              <div style="font-size:16px;font-weight:800;margin-top:2px;">${appMeta.icon || '📱'} ${appMeta.title} <span style="font-size:11px;color:#94a3b8;font-weight:600;">v${appMeta.version || '1.0.0'}</span></div>
            </div>
            <button id="rollup-cfg-close-btn" type="button" style="background:#1e293b;border:1px solid #334155;color:#cbd5e1;border-radius:8px;padding:5px 10px;font-weight:800;cursor:pointer;">✕</button>
          </div>

          <div style="margin-top:10px;padding:7px 10px;background:#052e16;border:1px solid #166534;border-radius:8px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#dcfce7;">
            <span>👤 <strong>${currentUser ? currentUser.email : 'guest'}</strong></span>
            <span>🔒 ${keyCount} Isolated Key(s)</span>
          </div>

          ${manuals.renderSettingsCardHtml(appId)}

          <div style="margin-top:10px;">
            <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;">App Preferences</div>
            ${fieldsHtml}
          </div>

          <div style="display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #1f2937;">
            ${saveBtnHtml}
            <button id="rollup-cfg-reset-btn" type="button" style="background:#1e293b;border:1px solid #475569;color:#fca5a5;border-radius:8px;padding:9px 11px;font-size:11.5px;font-weight:700;cursor:pointer;">🧹 Reset App Data</button>
          </div>
        </div>
      `;

      overlay.onclick = (ev) => {
        if (ev.target === overlay) this.close();
      };
      document.body.appendChild(overlay);

      document.getElementById('rollup-cfg-close-btn').onclick = () => this.close();
      document.getElementById('rollup-cfg-reset-btn').onclick = () => {
        if (!confirm(`Clear your saved data for "${appMeta.title}" under ${currentUser ? currentUser.email : 'guest'}?`)) return;
        storage.clearApp(appId);
        global.location.reload();
      };

      const saveBtn = document.getElementById('rollup-cfg-save-btn');
      if (saveBtn) {
        saveBtn.onclick = () => {
          const patch = {};
          overlay.querySelectorAll('[data-rollup-cfg-key]').forEach((inp) => {
            const k = inp.getAttribute('data-rollup-cfg-key');
            const t = inp.getAttribute('data-rollup-cfg-type');
            patch[k] = t === 'number' ? Number(inp.value) : inp.value.trim();
          });
          user.setAppConfig(patch, appId);
          global.location.reload();
        };
      }
    }
  };

  // In-App Security Gate & Floating Hub Switcher Pill
  function enforceAccessGate(appId, visibility = 'restricted') {
    const currentUser = auth.getCurrentUser();
    const hubUrl = resolveHubRootUrl();
    if (!currentUser) {
      global.location.href = hubUrl;
      return false;
    }
    if (!auth.canAccessApp(appId, visibility)) {
      document.body.innerHTML = `
        <div style="min-height:100vh;background:#070b14;color:#f8fafc;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;text-align:center;">
          <div style="max-width:380px;background:#111827;border:1px solid #ef4444;border-radius:16px;padding:24px;">
            <div style="font-size:38px;margin-bottom:8px;">🔒</div>
            <h2 style="margin:0 0 8px 0;font-size:18px;">Access Restricted</h2>
            <p style="font-size:13px;color:#94a3b8;line-height:1.45;margin:0 0 18px 0;">
              Signed in as <strong style="color:#e2e8f0;">${currentUser.email}</strong>.<br>
              The Hub Administrator hasn't enabled <code>${appId}</code> for your Google account yet.
            </p>
            <a href="${hubUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:10px 18px;border-radius:10px;">🏠 Return to Rollup Hub</a>
          </div>
        </div>
      `;
      return false;
    }
    return true;
  }

  function mountInAppConsolePill(options = {}) {
    const appId = options.appId || detectAppId();
    if (appId === 'hub-root') return;
    if (!enforceAccessGate(appId, options.visibility || 'restricted')) return;

    const currentUser = auth.getCurrentUser();
    const isImp = auth.isImpersonating();
    const hubUrl = resolveHubRootUrl();

    // If Admin is previewing as another user, mount top impersonation bar
    if (isImp) {
      const impBar = document.createElement('div');
      impBar.style.cssText =
        'position:sticky;top:0;z-index:9999;background:linear-gradient(90deg,#7c2d12,#b45309);color:#fef3c7;font-family:system-ui,sans-serif;font-size:11.5px;font-weight:700;padding:6px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #f59e0b;';
      impBar.innerHTML = `
        <span>👁️ Admin Previewing as: <strong>${currentUser.name}</strong> (${currentUser.email})</span>
        <button id="rollup-exit-imp-btn" style="background:#090d16;color:#fbbf24;border:1px solid #fbbf24;border-radius:6px;padding:3px 8px;font-size:10.5px;font-weight:800;cursor:pointer;">Exit Preview</button>
      `;
      document.body.prepend(impBar);
      document.getElementById('rollup-exit-imp-btn').onclick = () => {
        auth.stopImpersonation();
        global.location.reload();
      };
    }

    // Remove any existing bar if re-mounted
    const existingPill = document.getElementById('rollup-console-pill');
    if (existingPill) existingPill.remove();

    // Docked, zero-obstruction 28px Top System Strip in normal document flow
    // (Never floats over send buttons, chat inputs, bottom navs, or cards!)
    const bodyComp = global.getComputedStyle(document.body);
    const padTop = parseFloat(bodyComp.paddingTop) || 0;
    const padLeft = parseFloat(bodyComp.paddingLeft) || 0;
    const padRight = parseFloat(bodyComp.paddingRight) || 0;

    const pill = document.createElement('div');
    pill.id = 'rollup-console-pill';
    pill.style.cssText = `
      position: relative;
      z-index: 35;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% + ${padLeft + padRight}px);
      margin-top: -${padTop}px;
      margin-left: -${padLeft}px;
      margin-right: -${padRight}px;
      margin-bottom: ${padTop > 0 ? '10px' : '0px'};
      min-height: 29px;
      padding: 3px 12px;
      box-sizing: border-box;
      flex-shrink: 0;
      background: #050811;
      border-bottom: 1px solid #1e293b;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    const cfgLabel = options.settingsLabel || (typeof options.onOpenSettings === 'function' ? 'Setup' : 'Settings');
    const settingsBtnHtml = `<button id="rollup-pill-cfg" title="App Settings &amp; User Manual" style="background:transparent;border:1px solid #334155;color:#93c5fd;border-radius:6px;padding:2px 7px;font-size:10.5px;font-weight:700;cursor:pointer;white-space:nowrap;">⚙️ ${cfgLabel}</button>`;

    pill.innerHTML = `
      <a href="${hubUrl}" title="Back to RollupOS Hub" style="display:inline-flex;align-items:center;gap:5px;color:#38bdf8;text-decoration:none;font-size:11px;font-weight:800;letter-spacing:0.1px;white-space:nowrap;">
        <span>←</span> <span>Rollup Hub</span>
      </a>
      <div style="display:flex;align-items:center;gap:6px;min-width:0;">
        <button id="rollup-ota-pill" title="A newer version of this app was published — tap to reload" style="display:none;align-items:center;gap:4px;background:linear-gradient(90deg,#b45309,#d97706);color:#fffbeb;border:1px solid #fbbf24;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap;box-shadow:0 0 10px rgba(251,191,36,0.35);"></button>
        ${settingsBtnHtml}
        <span id="rollup-pill-ver" style="font-size:9.5px;color:#475569;font-weight:700;white-space:nowrap;"></span>
        <span style="font-size:10px;color:#64748b;font-weight:700;" title="Signed in as ${currentUser.email}">
          ${currentUser.avatar || '👤'}
        </span>
      </div>
    `;

    if (isImp && document.body.firstElementChild) {
      document.body.firstElementChild.insertAdjacentElement('afterend', pill);
    } else {
      document.body.prepend(pill);
    }

    const cfgBtn = document.getElementById('rollup-pill-cfg');
    if (cfgBtn) {
      cfgBtn.onclick = () => {
        if (typeof options.onOpenSettings === 'function') {
          options.onOpenSettings();
        } else {
          settings.open(appId);
        }
      };
    }

    // Activate automatic OTA update watcher for this open mini-app
    updates.startInAppWatcher(appId, {
      onBaseline(base) {
        const verEl = document.getElementById('rollup-pill-ver');
        if (verEl && base && base.version) {
          verEl.textContent = `v${base.version}`;
        }
      },
      onUpdate(remoteApp) {
        const otaBtn = document.getElementById('rollup-ota-pill');
        const verEl = document.getElementById('rollup-pill-ver');
        if (!otaBtn) return;
        if (verEl) verEl.style.display = 'none';
        otaBtn.style.display = 'inline-flex';
        otaBtn.textContent = `⬆️ Out of Date • Update v${remoteApp.version}`;
        otaBtn.onclick = async () => {
          otaBtn.textContent = '⏳ Updating...';
          otaBtn.disabled = true;
          await updates.applyInAppReload(appId, remoteApp);
        };
      }
    });
  }

  global.RollupBridge = {
    version: '1.4.1',
    detectAppId,
    resolveHubRootUrl,
    resolveRegistryUrl,
    resolveManualUrl,
    auth,
    storage,
    user,
    config: { getAll: (id) => user.getAppConfig(id) },
    vault,
    camera,
    files,
    usbSerial,
    lanSyncRequest,
    updates,
    manuals,
    settings,
    enforceAccessGate,
    mountInAppConsolePill
  };
})(window);
