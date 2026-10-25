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
        authorized_apps: ['gravity-agent-monitor', 'fantasy-manager', 'csc-site-discovery', 'shd-div2-intel', 'field-snap', 'bridge-lab'],
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

  // File Export & Native Share Sheet
  const files = {
    downloadText(filename, content, mimeType = 'text/plain;charset=utf-8') {
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

    const settingsBtnHtml =
      typeof options.onOpenSettings === 'function'
        ? `<button id="rollup-pill-cfg" title="Switch Team / App Settings" style="background:transparent;border:1px solid #334155;color:#93c5fd;border-radius:6px;padding:2px 7px;font-size:10.5px;font-weight:700;cursor:pointer;">⚙️ ${options.settingsLabel || 'Setup'}</button>`
        : '';

    pill.innerHTML = `
      <a href="${hubUrl}" title="Back to RollupOS Hub" style="display:inline-flex;align-items:center;gap:5px;color:#38bdf8;text-decoration:none;font-size:11px;font-weight:800;letter-spacing:0.1px;">
        <span>←</span> <span>Rollup Hub</span>
      </a>
      <div style="display:flex;align-items:center;gap:8px;">
        ${settingsBtnHtml}
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

    if (typeof options.onOpenSettings === 'function') {
      const cfgBtn = document.getElementById('rollup-pill-cfg');
      if (cfgBtn) cfgBtn.onclick = () => options.onOpenSettings();
    }
  }

  global.RollupBridge = {
    version: '1.1.0',
    detectAppId,
    resolveHubRootUrl,
    resolveRegistryUrl,
    auth,
    storage,
    user,
    vault,
    camera,
    files,
    enforceAccessGate,
    mountInAppConsolePill
  };
})(window);
