/**
 * CSC Site Discovery & Field Survey Companion (v1.0 Android RollupOS Ready)
 * Dual-Mode Storage, IndexedDB Media Blob Store, Hardware Sensor & Vision Helper Adapter
 *
 * Works seamlessly in BOTH:
 *  - Mode A: Inside RollupOS Android Hub (`window.RollupBridge` multi-user Google Auth + Vault + Camera + Share)
 *  - Mode B: Standalone Browser / Desktop Mode (`localStorage` + `IndexedDB`)
 */
(function (global) {
  'use strict';

  const APP_ID = 'csc-site-discovery';
  const IDB_NAME = 'csc_site_discovery_media_v1';
  const IDB_STORE = 'media_blobs';

  function hasRollupBridge() {
    return Boolean(global.RollupBridge && global.RollupBridge.storage);
  }

  function getActiveUser() {
    if (hasRollupBridge()) {
      const u = global.RollupBridge.auth.getCurrentUser();
      if (u) {
        const cfg = (global.RollupBridge.user && global.RollupBridge.user.getAppConfig(APP_ID)) || {};
        return {
          email: u.email,
          name: u.name || u.email,
          role: u.role || (u.is_admin ? 'admin' : 'tester'),
          is_admin: Boolean(u.is_admin),
          badge: u.badge || '🧭 CSC Field Discovery',
          defaultJob: cfg.default_job_number || 'CSC-26-4182',
          engineerName: cfg.engineer_name || u.name || 'CSC Field Engineer',
          container: 'ROLLUP_ANDROID_HUB'
        };
      }
    }
    return {
      email: 'andrewnicks@gmail.com',
      name: 'Andrew Nicks',
      role: 'admin',
      is_admin: true,
      badge: '🧭 Standalone / PC Mode',
      defaultJob: 'CSC-26-4182',
      engineerName: 'Andrew Nicks — Control Service Company (CSC)',
      container: 'STANDALONE_PWA'
    };
  }

  function _userScopePrefix() {
    const u = getActiveUser();
    return String(u.email || 'guest').toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
  }

  function readState(key, fallback) {
    if (hasRollupBridge()) {
      return global.RollupBridge.storage.get(key, fallback, APP_ID);
    }
    try {
      const raw = localStorage.getItem(`csc_disc_v1::${_userScopePrefix()}::${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeState(key, value) {
    if (hasRollupBridge()) {
      return global.RollupBridge.storage.set(key, value, APP_ID);
    }
    try {
      localStorage.setItem(`csc_disc_v1::${_userScopePrefix()}::${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('[CSCDiscoveryAdapter] Storage quota warning:', e);
    }
    return value;
  }

  function getSecretKey(keyName) {
    if (hasRollupBridge() && global.RollupBridge.vault && typeof global.RollupBridge.vault.get === 'function') {
      const v = global.RollupBridge.vault.get(keyName);
      if (v) return v;
    }
    try {
      return localStorage.getItem(`csc_disc_secret::${keyName}`) || '';
    } catch (e) {
      return '';
    }
  }

  function setSecretKey(keyName, val) {
    if (hasRollupBridge() && global.RollupBridge.vault && typeof global.RollupBridge.vault.set === 'function') {
      global.RollupBridge.vault.set(keyName, val);
    }
    try {
      if (val) localStorage.setItem(`csc_disc_secret::${keyName}`, val);
      else localStorage.removeItem(`csc_disc_secret::${keyName}`);
    } catch (e) {}
  }

  // IndexedDB Binary / High-Res Image & Audio Store (bypasses 5MB localStorage ceiling)
  function _openIdb() {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        resolve(null);
        return;
      }
      const req = global.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = (ev) => resolve(ev.target.result);
      req.onerror = () => resolve(null);
    });
  }

  async function saveMediaBlob(mediaKey, payload) {
    const scopedId = `${_userScopePrefix()}::${mediaKey}`;
    const db = await _openIdb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({
        id: scopedId,
        updatedAt: new Date().toISOString(),
        payload
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  async function loadMediaBlob(mediaKey) {
    const scopedId = `${_userScopePrefix()}::${mediaKey}`;
    const db = await _openIdb();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(scopedId);
      req.onsuccess = () => resolve(req.result ? req.result.payload : null);
      req.onerror = () => resolve(null);
    });
  }

  async function deleteMediaBlob(mediaKey) {
    const scopedId = `${_userScopePrefix()}::${mediaKey}`;
    const db = await _openIdb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(scopedId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  // Unified Camera / Image Picker (uses RollupBridge.camera when available or rear-camera HTML5 fallback)
  async function captureImage(options = {}) {
    const maxDim = options.maxDim || 1440;
    const quality = options.quality || 0.84;

    if (hasRollupBridge() && global.RollupBridge.camera && typeof global.RollupBridge.camera.capturePhoto === 'function' && !options.forceFileInput) {
      try {
        const res = await global.RollupBridge.camera.capturePhoto({ maxWidth: maxDim, quality });
        if (res && res.dataUrl) return res;
      } catch (e) {
        // Fall through to standard file input
      }
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      if (options.useRearCamera !== false) {
        input.setAttribute('capture', 'environment');
      }
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              const scale = maxDim / Math.max(w, h);
              w = Math.round(w * scale);
              h = Math.round(h * scale);
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({
              width: w,
              height: h,
              sizeKB: Math.round((dataUrl.length * 0.75) / 1024),
              capturedAt: new Date().toISOString(),
              originalName: file.name,
              dataUrl
            });
          };
          img.onerror = () => resolve(null);
          img.src = ev.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  /**
   * Deterministic Stamped-Metal Nameplate Contrast & Edge Enhancer (Client-Side CLAHE Approximation)
   * Stretches luminance histogram + applies 3x3 unsharp mask kernel so sun-faded/embossed aluminum
   * serial numbers pop out legibly on rooftop RTUs and chillers.
   */
  function enhanceStampedPlateDataUrl(sourceDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        // Pass 1: Grayscale + Min/Max percentile stretch
        const lum = new Uint8ClampedArray(w * h);
        const hist = new Uint32Array(256);
        for (let i = 0, p = 0; i < d.length; i += 4, p++) {
          const y = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
          lum[p] = y;
          hist[y]++;
        }

        const totalPx = w * h;
        let low = 0, high = 255, acc = 0;
        for (let i = 0; i < 256; i++) {
          acc += hist[i];
          if (acc >= totalPx * 0.02) { low = i; break; }
        }
        acc = 0;
        for (let i = 255; i >= 0; i--) {
          acc += hist[i];
          if (acc >= totalPx * 0.02) { high = i; break; }
        }
        const span = Math.max(12, high - low);
        const stretched = new Uint8ClampedArray(w * h);
        for (let p = 0; p < totalPx; p++) {
          stretched[p] = Math.max(0, Math.min(255, Math.round(((lum[p] - low) / span) * 255)));
        }

        // Pass 2: 3x3 Unsharp / Emboss Edge Boost Kernel [0, -1, 0, -1, 5, -1, 0, -1, 0]
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            const val =
              5 * stretched[idx] -
              stretched[idx - 1] -
              stretched[idx + 1] -
              stretched[idx - w] -
              stretched[idx + w];
            const c = Math.max(0, Math.min(255, val));
            const outIdx = idx * 4;
            d[outIdx] = c;
            d[outIdx + 1] = c;
            d[outIdx + 2] = Math.min(255, c + 6); // Slight cool slate tint for readability
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  }

  /**
   * Deterministic 3x3 Discrete Laplacian Variance Calculator: Var(∇²I)
   * Used on Android/Browser <video> frames to reject motion blur and detect sharp nameplate/doorway frames.
   */
  function computeCanvasLaplacianSharpness(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const d = ctx.getImageData(0, 0, w, h).data;
    const gray = new Float32Array(w * h);

    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      gray[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }

    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const lap =
          gray[idx - w] +
          gray[idx + w] +
          gray[idx - 1] +
          gray[idx + 1] -
          4 * gray[idx];
        sum += lap;
        sumSq += lap * lap;
        count++;
      }
    }
    if (count === 0) return 0;
    const mean = sum / count;
    const variance = sumSq / count - mean * mean;
    return Math.round(variance * 10) / 10;
  }

  async function shareOrExport(title, text, filename, jsonObj) {
    if (hasRollupBridge() && global.RollupBridge.files) {
      if (jsonObj && filename) {
        global.RollupBridge.files.exportJSON(filename, jsonObj);
      }
      if (navigator.share) {
        await global.RollupBridge.files.share(title, text);
      }
      return;
    }
    if (jsonObj && filename) {
      const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    }
  }

  // Mount RollupOS Floating Pill automatically when running inside RollupOS Hub
  global.addEventListener('DOMContentLoaded', () => {
    if (hasRollupBridge() && typeof global.RollupBridge.mountInAppConsolePill === 'function') {
      global.RollupBridge.mountInAppConsolePill({
        appId: APP_ID,
        visibility: 'restricted',
        bottomOffset: '18px',
        settingsLabel: 'Walk / API Vault',
        onOpenSettings: () => {
          if (typeof global.openSessionManagerModal === 'function') {
            global.openSessionManagerModal();
          }
        }
      });
    }
  });

  global.CSCDiscoveryAdapter = {
    APP_ID,
    hasRollupBridge,
    getActiveUser,
    readState,
    writeState,
    getSecretKey,
    setSecretKey,
    saveMediaBlob,
    loadMediaBlob,
    deleteMediaBlob,
    captureImage,
    enhanceStampedPlateDataUrl,
    computeCanvasLaplacianSharpness,
    shareOrExport
  };
})(window);
