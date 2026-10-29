/**
 * CSC Site Discovery & Field Survey Companion (v2.0 Android RollupOS Ready)
 * Dual-Mode Storage, IndexedDB Media Blob Store, Binary JPEG EXIF Reader,
 * 8x8 Local Tile CLAHE Nameplate Enhancer, Pure-JS .cscwalk.zip Packager,
 * & RollupOS Native Android File Bridge (`window.RollupNative`).
 *
 * Works seamlessly in BOTH:
 *  - Mode A: Inside RollupOS Android Hub (`window.RollupBridge` + `window.RollupNative` Kotlin Bridge)
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

  function hasRollupNative() {
    return Boolean(global.RollupNative && typeof global.RollupNative.saveBase64File === 'function');
  }

  function getActiveUser() {
    if (hasRollupBridge() && global.RollupBridge.auth && typeof global.RollupBridge.auth.getCurrentUser === 'function') {
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
          container: hasRollupNative() ? 'ROLLUP_ANDROID_APK' : 'ROLLUP_ANDROID_HUB'
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
      container: hasRollupNative() ? 'ROLLUP_ANDROID_APK' : 'STANDALONE_PWA'
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

  // BUG-07 FIX: RollupBridge.vault exposes `getSecret(name)` / `setSecret(name, value)`
  function getSecretKey(keyName) {
    if (hasRollupBridge() && global.RollupBridge.vault) {
      if (typeof global.RollupBridge.vault.getSecret === 'function') {
        const v = global.RollupBridge.vault.getSecret(keyName);
        if (v) return v;
      } else if (typeof global.RollupBridge.vault.get === 'function') {
        const v = global.RollupBridge.vault.get(keyName);
        if (v) return v;
      }
    }
    try {
      return localStorage.getItem(`csc_disc_secret::${keyName}`) || '';
    } catch (e) {
      return '';
    }
  }

  function setSecretKey(keyName, val) {
    if (hasRollupBridge() && global.RollupBridge.vault) {
      if (typeof global.RollupBridge.vault.setSecret === 'function') {
        global.RollupBridge.vault.setSecret(keyName, val || '');
      } else if (typeof global.RollupBridge.vault.set === 'function') {
        global.RollupBridge.vault.set(keyName, val || '');
      }
    }
    try {
      if (val) localStorage.setItem(`csc_disc_secret::${keyName}`, val);
      else localStorage.removeItem(`csc_disc_secret::${keyName}`);
    } catch (e) {}
  }

  // ============================================================================
  // IndexedDB Binary / High-Res Image & Audio Store (bypasses 5MB localStorage)
  // Includes non-blocking timeout + in-memory Map fallback for file:// / restricted WebViews
  // ============================================================================
  const _memoryBlobFallback = new Map();
  let _idbPromise = null;

  function _normalizeMediaKey(mediaKey) {
    return String(mediaKey || '').replace(/^(photo(?:_raw)?::[^:]+::[^:]+)::([123])$/, '$1::slot$2');
  }

  function _openIdb() {
    if (_idbPromise) return _idbPromise;
    _idbPromise = new Promise((resolve) => {
      if (!global.indexedDB) {
        resolve(null);
        return;
      }
      let settled = false;
      const done = (val) => {
        if (!settled) {
          settled = true;
          resolve(val);
        }
      };
      const timer = setTimeout(() => done(null), 350);
      try {
        const req = global.indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = (ev) => {
          const db = ev.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'id' });
          }
        };
        req.onsuccess = (ev) => {
          clearTimeout(timer);
          done(ev.target.result);
        };
        req.onerror = () => {
          clearTimeout(timer);
          done(null);
        };
        req.onblocked = () => {
          clearTimeout(timer);
          done(null);
        };
      } catch (e) {
        clearTimeout(timer);
        done(null);
      }
    });
    return _idbPromise;
  }

  async function saveMediaBlob(mediaKey, payload) {
    const normKey = _normalizeMediaKey(mediaKey);
    const scopedId = `${_userScopePrefix()}::${normKey}`;
    const recObj = {
      id: scopedId,
      mediaKey: normKey,
      updatedAt: new Date().toISOString(),
      payload
    };
    _memoryBlobFallback.set(scopedId, recObj);
    const db = await _openIdb();
    if (!db) return true;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(recObj);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(true);
      } catch (e) {
        resolve(true);
      }
    });
  }

  async function loadMediaBlob(mediaKey) {
    const normKey = _normalizeMediaKey(mediaKey);
    const scopedId = `${_userScopePrefix()}::${normKey}`;
    const db = await _openIdb();
    if (!db) {
      const mem = _memoryBlobFallback.get(scopedId);
      return mem ? mem.payload : null;
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).get(scopedId);
        req.onsuccess = () => {
          if (req.result && req.result.payload !== undefined) {
            resolve(req.result.payload);
          } else {
            const mem = _memoryBlobFallback.get(scopedId);
            resolve(mem ? mem.payload : null);
          }
        };
        req.onerror = () => {
          const mem = _memoryBlobFallback.get(scopedId);
          resolve(mem ? mem.payload : null);
        };
      } catch (e) {
        const mem = _memoryBlobFallback.get(scopedId);
        resolve(mem ? mem.payload : null);
      }
    });
  }

  async function deleteMediaBlob(mediaKey) {
    const normKey = _normalizeMediaKey(mediaKey);
    const scopedId = `${_userScopePrefix()}::${normKey}`;
    _memoryBlobFallback.delete(scopedId);
    const db = await _openIdb();
    if (!db) return true;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(scopedId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(true);
      } catch (e) {
        resolve(true);
      }
    });
  }

  async function listSessionMediaEntries(sessionId) {
    const prefix = `${_userScopePrefix()}::`;
    const db = await _openIdb();
    const merged = new Map();
    for (const [k, rec] of _memoryBlobFallback.entries()) {
      if (k.startsWith(prefix)) {
        const mKey = k.slice(prefix.length);
        if (!sessionId || mKey.includes(`::${sessionId}::`)) {
          merged.set(mKey, { mediaKey: mKey, payload: rec.payload, updatedAt: rec.updatedAt });
        }
      }
    }
    if (!db) return Array.from(merged.values());
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).openCursor();
        req.onsuccess = (ev) => {
          const cursor = ev.target.result;
          if (!cursor) {
            resolve(Array.from(merged.values()));
            return;
          }
          const rec = cursor.value;
          if (rec && typeof rec.id === 'string' && rec.id.startsWith(prefix)) {
            const mKey = rec.id.slice(prefix.length);
            if (!sessionId || mKey.includes(`::${sessionId}::`)) {
              merged.set(mKey, { mediaKey: mKey, payload: rec.payload, updatedAt: rec.updatedAt });
            }
          }
          cursor.continue();
        };
        req.onerror = () => resolve(Array.from(merged.values()));
      } catch (e) {
        resolve(Array.from(merged.values()));
      }
    });
  }

  // ============================================================================
  // BUG-09 PART A: Deterministic Binary JPEG APP1 EXIF GPS & Compass Parser
  // Reads GPSLatitude, GPSLongitude, GPSAltitude, GPSImgDirection & DateTime
  // directly from raw JPEG bytes BEFORE <canvas> downsampling strips APP1 tags!
  // ============================================================================
  function extractJpegExifFromArrayBuffer(arrayBuffer) {
    const meta = {
      gpsLat: null,
      gpsLon: null,
      gpsAltFt: null,
      compassDeg: null,
      dateTimeOriginal: null,
      orientation: 1
    };
    if (!arrayBuffer || arrayBuffer.byteLength < 12) return meta;
    const dv = new DataView(arrayBuffer);
    if (dv.getUint16(0, false) !== 0xFFD8) return meta; // Not JPEG

    let offset = 2;
    const len = dv.byteLength;
    while (offset + 4 <= len) {
      const marker = dv.getUint16(offset, false);
      offset += 2;
      if (marker === 0xFFDA || marker === 0xFFD9) break; // SOS / EOI
      const segLen = dv.getUint16(offset, false);
      if (segLen < 2 || offset + segLen > len) break;

      // APP1 Exif header: "Exif\0\0" = 0x45786966, 0x0000
      if (
        marker === 0xFFE1 &&
        segLen >= 14 &&
        dv.getUint32(offset + 2, false) === 0x45786966 &&
        dv.getUint16(offset + 6, false) === 0x0000
      ) {
        const tiffStart = offset + 8;
        const endianTag = dv.getUint16(tiffStart, false);
        const le = endianTag === 0x4949;
        if (!le && endianTag !== 0x4D4D) return meta;
        if (dv.getUint16(tiffStart + 2, le) !== 0x002A) return meta;

        const readRational = (ratOffset) => {
          if (ratOffset + 8 > len) return 0;
          const num = dv.getUint32(ratOffset, le);
          const den = dv.getUint32(ratOffset + 4, le);
          return den === 0 ? 0 : num / den;
        };

        const readAscii = (strOffset, count) => {
          let s = '';
          const end = Math.min(len, strOffset + count);
          for (let i = strOffset; i < end; i++) {
            const ch = dv.getUint8(i);
            if (ch === 0) break;
            s += String.fromCharCode(ch);
          }
          return s.trim();
        };

        const parseIfd = (ifdRelOffset) => {
          const entries = {};
          const dirStart = tiffStart + ifdRelOffset;
          if (dirStart + 2 > len) return entries;
          const numEntries = dv.getUint16(dirStart, le);
          for (let i = 0; i < numEntries; i++) {
            const ent = dirStart + 2 + i * 12;
            if (ent + 12 > len) break;
            const tag = dv.getUint16(ent, le);
            const type = dv.getUint16(ent + 2, le);
            const count = dv.getUint32(ent + 4, le);
            const valOffset = ent + 8;
            entries[tag] = { type, count, valOffset, raw32: dv.getUint32(valOffset, le) };
          }
          return entries;
        };

        const ifd0Offset = dv.getUint32(tiffStart + 4, le);
        const ifd0 = parseIfd(ifd0Offset);

        if (ifd0[0x0112]) {
          meta.orientation = dv.getUint16(ifd0[0x0112].valOffset, le);
        }
        if (ifd0[0x0132] && ifd0[0x0132].count > 4) {
          meta.dateTimeOriginal = readAscii(tiffStart + ifd0[0x0132].raw32, ifd0[0x0132].count);
        }
        // Exif SubIFD (0x8769)
        if (ifd0[0x8769]) {
          const subIfd = parseIfd(ifd0[0x8769].raw32);
          if (subIfd[0x9003] && subIfd[0x9003].count > 4) {
            meta.dateTimeOriginal = readAscii(tiffStart + subIfd[0x9003].raw32, subIfd[0x9003].count);
          }
        }
        // GPS SubIFD (0x8825)
        if (ifd0[0x8825]) {
          const gpsIfd = parseIfd(ifd0[0x8825].raw32);
          const latRef = gpsIfd[0x0001] ? String.fromCharCode(dv.getUint8(gpsIfd[0x0001].valOffset)) : 'N';
          const lonRef = gpsIfd[0x0003] ? String.fromCharCode(dv.getUint8(gpsIfd[0x0003].valOffset)) : 'W';

          if (gpsIfd[0x0002] && gpsIfd[0x0002].count === 3) {
            const p = tiffStart + gpsIfd[0x0002].raw32;
            const d = readRational(p);
            const m = readRational(p + 8);
            const s = readRational(p + 16);
            let dec = d + m / 60 + s / 3600;
            if (latRef === 'S') dec = -dec;
            if (!isNaN(dec) && dec !== 0) meta.gpsLat = Number(dec.toFixed(6));
          }
          if (gpsIfd[0x0004] && gpsIfd[0x0004].count === 3) {
            const p = tiffStart + gpsIfd[0x0004].raw32;
            const d = readRational(p);
            const m = readRational(p + 8);
            const s = readRational(p + 16);
            let dec = d + m / 60 + s / 3600;
            if (lonRef === 'W') dec = -dec;
            if (!isNaN(dec) && dec !== 0) meta.gpsLon = Number(dec.toFixed(6));
          }
          if (gpsIfd[0x0006]) {
            const altM = readRational(tiffStart + gpsIfd[0x0006].raw32);
            if (altM > 0) meta.gpsAltFt = Number((altM * 3.28084).toFixed(1));
          }
          // GPSImgDirection (0x0011) — Camera Compass Bearing!
          if (gpsIfd[0x0011]) {
            const dir = readRational(tiffStart + gpsIfd[0x0011].raw32);
            if (!isNaN(dir) && dir >= 0 && dir <= 360) {
              meta.compassDeg = Math.round(dir) % 360;
            }
          }
        }
        break;
      }
      offset += segLen;
    }
    return meta;
  }

  // File-input fallback / gallery picker — Extracts raw EXIF BEFORE <canvas> resize!
  function captureImageFromFileInput(options = {}) {
    const maxDim = options.maxDim || 1440;
    const quality = options.quality || 0.85;
    const wantCameraCapture = options.useRearCamera !== false && options.source !== 'file';

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.accept || 'image/*';
      if (wantCameraCapture) {
        input.setAttribute('capture', options.facingMode === 'user' ? 'user' : 'environment');
      }
      input.style.display = 'none';
      if (document.body) document.body.appendChild(input);

      let settled = false;
      const cleanup = () => {
        try {
          input.removeEventListener('cancel', onCancel);
        } catch (e) {}
        try {
          if (input.parentNode) input.parentNode.removeChild(input);
        } catch (e) {}
      };

      const onCancel = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(null);
      };

      input.addEventListener('cancel', onCancel);
      input.oncancel = onCancel;

      input.onchange = async () => {
        if (settled) return;
        settled = true;
        const file = input.files && input.files[0];
        cleanup();
        if (!file) {
          resolve(null);
          return;
        }

        let exif = {
          gpsLat: null,
          gpsLon: null,
          gpsAltFt: null,
          compassDeg: null,
          dateTimeOriginal: null,
          orientation: 1
        };
        try {
          const ab = await file.arrayBuffer();
          exif = extractJpegExifFromArrayBuffer(ab);
        } catch (e) {}

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
            const sharpnessScore = computeCanvasLaplacianSharpness(canvas);
            resolve({
              width: w,
              height: h,
              sizeKB: Math.round((dataUrl.length * 0.75) / 1024),
              capturedAt: new Date().toISOString(),
              originalName: file.name,
              exif,
              canvas,
              sharpnessScore,
              isBlurry: sharpnessScore < 28,
              capturedFromCamera: wantCameraCapture,
              source: options.source || (wantCameraCapture ? 'os_camera' : 'file'),
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

  // Live In-App WebRTC Camera Viewfinder Modal (with Torch, Front/Rear Flip, Gallery Picker & OS Camera Fallback)
  async function captureImageFromLiveCamera(options = {}) {
    const maxDim = options.maxDim || 1440;
    const quality = options.quality || 0.85;
    let currentFacing = options.facingMode || (options.useRearCamera === false ? 'user' : 'environment');

    if (
      !global.navigator ||
      !global.navigator.mediaDevices ||
      typeof global.navigator.mediaDevices.getUserMedia !== 'function' ||
      !global.document ||
      !global.document.body
    ) {
      return captureImageFromFileInput({ ...options, useRearCamera: true, source: 'os_camera' });
    }

    let activeStream = null;
    let torchEnabled = false;

    const requestCameraStream = async (facing) => {
      const constraintsList = [
        {
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1440 }
          },
          audio: false
        },
        {
          video: { facingMode: facing },
          audio: false
        },
        {
          video: true,
          audio: false
        }
      ];
      let lastErr = null;
      for (const c of constraintsList) {
        try {
          const streamPromise = global.navigator.mediaDevices.getUserMedia(c);
          const timeoutPromise = new Promise((_, rej) =>
            setTimeout(() => rej(new Error('Camera stream start timeout')), 6500)
          );
          return await Promise.race([streamPromise, timeoutPromise]);
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr || new Error('Camera unavailable');
    };

    try {
      activeStream = await requestCameraStream(currentFacing);
    } catch (e) {
      return captureImageFromFileInput({ ...options, useRearCamera: true, source: 'os_camera' });
    }

    return new Promise((resolve) => {
      let settled = false;
      const stopStream = () => {
        if (activeStream) {
          try {
            activeStream.getTracks().forEach((t) => t.stop());
          } catch (e) {}
          activeStream = null;
        }
      };

      const existingModal = document.getElementById('cscLiveCameraModal');
      if (existingModal && existingModal.parentNode) {
        existingModal.parentNode.removeChild(existingModal);
      }

      const modal = document.createElement('div');
      modal.id = 'cscLiveCameraModal';
      modal.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:9999',
        'background:rgba(2,6,23,0.96)',
        'display:flex',
        'flex-direction:column',
        'justify-content:space-between',
        'padding:12px',
        'color:#f8fafc',
        'font-family:"Segoe UI",system-ui,sans-serif'
      ].join(';');

      const headerTitle = String(options.title || '📸 Live Field Camera');
      modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 4px 8px 4px;">
          <div style="min-width:0;flex:1;">
            <div id="cscLiveCamTitle" style="font-size:15px;font-weight:900;color:#2dd4bf;"></div>
            <div id="cscLiveCamSub" style="font-size:11px;color:#94a3b8;">Saves captured photo to BOTH App &amp; Device Gallery</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button id="cscLiveCamTorchBtn" type="button" style="background:#1e293b;color:#f8fafc;border:1px solid #334155;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:800;cursor:pointer;">🔦 Torch</button>
            <button id="cscLiveCamFlipBtn" type="button" style="background:#1e293b;color:#f8fafc;border:1px solid #334155;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Flip</button>
            <button id="cscLiveCamCancelBtn" type="button" style="background:#334155;color:#f8fafc;border:1px solid #475569;border-radius:8px;padding:6px 11px;font-size:13px;font-weight:900;cursor:pointer;">✕</button>
          </div>
        </div>
        <div style="position:relative;flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:14px;border:2px solid #0d9488;background:#000000;min-height:240px;">
          <video id="cscLiveCameraVideo" autoplay playsinline muted style="width:100%;height:100%;object-fit:contain;background:#000;"></video>
          <div style="position:absolute;inset:12%;border:1.5px dashed rgba(45,212,191,0.65);border-radius:12px;pointer-events:none;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;">
            <span style="background:rgba(2,6,23,0.78);color:#5eead4;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;">Align Nameplate or Unit Inside Frame</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1.6fr 1fr;gap:8px;align-items:center;padding:12px 2px 4px 2px;">
          <button id="cscLiveCamGalleryBtn" type="button" style="min-height:48px;border-radius:12px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;font-size:12px;font-weight:800;cursor:pointer;">
            🖼️ Pick Existing
          </button>
          <button id="cscLiveCamShutterBtn" type="button" style="min-height:56px;border-radius:14px;border:2px solid #5eead4;background:linear-gradient(135deg,#0d9488,#0284c7);color:#ffffff;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 4px 16px rgba(13,148,136,0.45);">
            📸 SNAP PHOTO
          </button>
          <button id="cscLiveCamOsBtn" type="button" style="min-height:48px;border-radius:12px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;font-size:12px;font-weight:800;cursor:pointer;">
            📷 OS Camera
          </button>
        </div>
      `;

      const titleNode = modal.querySelector('#cscLiveCamTitle');
      if (titleNode) titleNode.textContent = headerTitle;

      document.body.appendChild(modal);

      const videoEl = modal.querySelector('#cscLiveCameraVideo');
      const torchBtn = modal.querySelector('#cscLiveCamTorchBtn');
      const flipBtn = modal.querySelector('#cscLiveCamFlipBtn');
      const cancelBtn = modal.querySelector('#cscLiveCamCancelBtn');
      const galleryBtn = modal.querySelector('#cscLiveCamGalleryBtn');
      const shutterBtn = modal.querySelector('#cscLiveCamShutterBtn');
      const osBtn = modal.querySelector('#cscLiveCamOsBtn');

      const onKeyDown = (ev) => {
        if (ev && ev.key === 'Escape') {
          if (settled) return;
          settled = true;
          closeModalAndCleanup();
          resolve(null);
        }
      };

      const closeModalAndCleanup = () => {
        try {
          document.removeEventListener('keydown', onKeyDown);
        } catch (e) {}
        stopStream();
        try {
          if (modal.parentNode) modal.parentNode.removeChild(modal);
        } catch (e) {}
      };

      try {
        document.addEventListener('keydown', onKeyDown);
      } catch (e) {}

      const attachStreamToVideo = (stream) => {
        if (!videoEl) return;
        videoEl.srcObject = stream;
        const p = videoEl.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      };

      attachStreamToVideo(activeStream);

      if (torchBtn) {
        torchBtn.onclick = async () => {
          if (!activeStream) return;
          const track = activeStream.getVideoTracks()[0];
          if (!track || typeof track.applyConstraints !== 'function') return;
          torchEnabled = !torchEnabled;
          try {
            await track.applyConstraints({ advanced: [{ torch: torchEnabled }] });
            torchBtn.style.background = torchEnabled ? '#d97706' : '#1e293b';
            torchBtn.textContent = torchEnabled ? '🔦 Torch ON' : '🔦 Torch';
          } catch (e) {
            torchEnabled = false;
          }
        };
      }

      if (flipBtn) {
        flipBtn.onclick = async () => {
          currentFacing = currentFacing === 'environment' ? 'user' : 'environment';
          torchEnabled = false;
          if (torchBtn) {
            torchBtn.style.background = '#1e293b';
            torchBtn.textContent = '🔦 Torch';
          }
          stopStream();
          try {
            activeStream = await requestCameraStream(currentFacing);
            attachStreamToVideo(activeStream);
          } catch (e) {}
        };
      }

      if (cancelBtn) {
        cancelBtn.onclick = () => {
          if (settled) return;
          settled = true;
          closeModalAndCleanup();
          resolve(null);
        };
      }

      if (galleryBtn) {
        galleryBtn.onclick = async () => {
          if (settled) return;
          settled = true;
          closeModalAndCleanup();
          const picked = await captureImageFromFileInput({
            ...options,
            useRearCamera: false,
            source: 'file'
          });
          resolve(picked);
        };
      }

      if (osBtn) {
        osBtn.onclick = async () => {
          if (settled) return;
          settled = true;
          closeModalAndCleanup();
          const snappedOs = await captureImageFromFileInput({
            ...options,
            useRearCamera: true,
            facingMode: currentFacing,
            source: 'os_camera'
          });
          resolve(snappedOs);
        };
      }

      if (shutterBtn) {
        shutterBtn.onclick = async () => {
          if (settled) return;
          settled = true;
          if (videoEl && (!videoEl.videoWidth || !videoEl.videoHeight || videoEl.readyState < 2)) {
            await new Promise((r) => {
              let done = false;
              const finish = () => {
                if (done) return;
                done = true;
                r();
              };
              if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0 && videoEl.readyState >= 2) {
                finish();
                return;
              }
              videoEl.addEventListener('loadeddata', finish, { once: true });
              videoEl.addEventListener('playing', finish, { once: true });
              setTimeout(finish, 250);
            });
          }
          const vw = (videoEl && videoEl.videoWidth) || 1280;
          const vh = (videoEl && videoEl.videoHeight) || 960;
          let w = vw;
          let h = vh;
          if (w > maxDim || h > maxDim) {
            const scale = maxDim / Math.max(w, h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (videoEl) {
            try {
              ctx.drawImage(videoEl, 0, 0, w, h);
            } catch (e) {}
          }
          closeModalAndCleanup();

          const nowIso = new Date().toISOString();
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const sharpnessScore = computeCanvasLaplacianSharpness(canvas);
          resolve({
            width: w,
            height: h,
            sizeKB: Math.round((dataUrl.length * 0.75) / 1024),
            capturedAt: nowIso,
            originalName: `CSC_Camera_${nowIso.slice(0, 19).replace(/[:T]/g, '-')}.jpg`,
            exif: {
              gpsLat: null,
              gpsLon: null,
              gpsAltFt: null,
              compassDeg: null,
              dateTimeOriginal: nowIso.slice(0, 19).replace('T', ' '),
              orientation: 1
            },
            canvas,
            sharpnessScore,
            isBlurry: sharpnessScore < 28,
            capturedFromCamera: true,
            source: 'live_camera',
            dataUrl
          });
        };
      }
    });
  }

  // Unified Camera / Image Picker — Opens Live Camera by default (with Gallery & OS Camera options)!
  async function captureImage(options = {}) {
    if (options.source === 'file' || options.useRearCamera === false) {
      return captureImageFromFileInput({ ...options, useRearCamera: false, source: 'file' });
    }
    if (options.source === 'os_camera' || options.preferLiveCamera === false) {
      return captureImageFromFileInput({ ...options, useRearCamera: true, source: 'os_camera' });
    }
    return captureImageFromLiveCamera(options);
  }

  // ============================================================================
  // BUG-09 PART B: True 8x8 Local Tile CLAHE (Contrast-Limited Adaptive Histogram
  // Equalization) + Bilinear Tile Interpolation + Mild Unsharp Edge Boost
  // Prevents half-sunny / half-shaded rooftop aluminum plates from blowing out!
  // ============================================================================
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
        const totalPx = w * h;
        const lum = new Uint8Array(totalPx);

        for (let i = 0, p = 0; i < d.length; i += 4, p++) {
          lum[p] = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        }

        const tilesX = 8;
        const tilesY = 8;
        const tileW = Math.max(1, w / tilesX);
        const tileH = Math.max(1, h / tilesY);
        const luts = new Array(tilesY);

        for (let ty = 0; ty < tilesY; ty++) {
          luts[ty] = new Array(tilesX);
          const y0 = Math.floor(ty * tileH);
          const y1 = ty === tilesY - 1 ? h : Math.floor((ty + 1) * tileH);
          for (let tx = 0; tx < tilesX; tx++) {
            const x0 = Math.floor(tx * tileW);
            const x1 = tx === tilesX - 1 ? w : Math.floor((tx + 1) * tileW);
            const hist = new Uint32Array(256);
            let count = 0;
            for (let y = y0; y < y1; y++) {
              let rowIdx = y * w + x0;
              for (let x = x0; x < x1; x++, rowIdx++) {
                hist[lum[rowIdx]]++;
                count++;
              }
            }
            const clipLimit = Math.max(4, Math.round((count / 256) * 2.6));
            let excess = 0;
            for (let b = 0; b < 256; b++) {
              if (hist[b] > clipLimit) {
                excess += hist[b] - clipLimit;
                hist[b] = clipLimit;
              }
            }
            const addPerBin = Math.floor(excess / 256);
            const rem = excess % 256;
            for (let b = 0; b < 256; b++) {
              hist[b] += addPerBin + (b < rem ? 1 : 0);
            }

            const lut = new Uint8Array(256);
            let cdf = 0;
            const denom = Math.max(1, count);
            for (let b = 0; b < 256; b++) {
              cdf += hist[b];
              lut[b] = Math.max(0, Math.min(255, Math.round((cdf / denom) * 255)));
            }
            luts[ty][tx] = lut;
          }
        }

        // Bilinear interpolation across neighboring tile LUTs
        const claheOut = new Uint8Array(totalPx);
        for (let y = 0; y < h; y++) {
          const gy = (y + 0.5) / tileH - 0.5;
          const ty0 = Math.max(0, Math.min(tilesY - 1, Math.floor(gy)));
          const ty1 = Math.max(0, Math.min(tilesY - 1, ty0 + 1));
          const fy = Math.max(0, Math.min(1, gy - ty0));

          for (let x = 0; x < w; x++) {
            const gx = (x + 0.5) / tileW - 0.5;
            const tx0 = Math.max(0, Math.min(tilesX - 1, Math.floor(gx)));
            const tx1 = Math.max(0, Math.min(tilesX - 1, tx0 + 1));
            const fx = Math.max(0, Math.min(1, gx - tx0));

            const idx = y * w + x;
            const v = lum[idx];
            const top = (1 - fx) * luts[ty0][tx0][v] + fx * luts[ty0][tx1][v];
            const bot = (1 - fx) * luts[ty1][tx0][v] + fx * luts[ty1][tx1][v];
            claheOut[idx] = Math.round((1 - fy) * top + fy * bot);
          }
        }

        // Mild 3x3 Unsharp Stamped-Metal Edge Kernel
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            const val = Math.round(
              3.4 * claheOut[idx] -
              0.6 * (claheOut[idx - 1] + claheOut[idx + 1] + claheOut[idx - w] + claheOut[idx + w])
            );
            const c = Math.max(0, Math.min(255, val));
            const outIdx = idx * 4;
            d[outIdx] = c;
            d[outIdx + 1] = c;
            d[outIdx + 2] = Math.min(255, c + 5);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.89));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  }

  /**
   * Deterministic 3x3 Discrete Laplacian Variance Calculator: Var(∇²I)
   */
  function computeCanvasLaplacianSharpness(canvasOrObj) {
    if (!canvasOrObj) return 0;
    if (typeof canvasOrObj.sharpnessScore === 'number' && !canvasOrObj.getContext && !canvasOrObj.canvas) {
      return canvasOrObj.sharpnessScore;
    }
    const canvas = canvasOrObj.getContext ? canvasOrObj : canvasOrObj.canvas;
    if (!canvas || typeof canvas.getContext !== 'function') return 0;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (!w || !h) return 0;
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
        const lap = gray[idx - w] + gray[idx + w] + gray[idx - 1] + gray[idx + 1] - 4 * gray[idx];
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

  /**
   * Deterministically parses a raw 1D/2D barcode or QR payload into HVAC manufacturer, model & serial fields.
   */
  function parseEquipmentBarcodeText(rawText) {
    const raw = String(rawText || '').trim();
    if (!raw) {
      return { detected: false, rawValue: '', manufacturer: '', modelNumber: '', serialNumber: '' };
    }
    let manufacturer = '';
    let modelNumber = '';
    let serialNumber = '';

    // 1. JSON QR payload check
    if (raw.startsWith('{') && raw.endsWith('}')) {
      try {
        const obj = JSON.parse(raw);
        manufacturer = String(obj.manufacturer || obj.mfg || obj.make || '').trim();
        modelNumber = String(obj.model_number || obj.model || obj.mn || '').trim();
        serialNumber = String(obj.serial_number || obj.serial || obj.sn || '').trim();
      } catch (e) {}
    }

    // 2. Key-Value / Delimited QR or DataMatrix payload (e.g., "M/N: YSC120H4RMA; S/N: 231914582L" or "MFG:TRANE;MDL:YSC090H4RMA;SN:241510884L")
    if (!modelNumber && !serialNumber) {
      const mMfg = raw.match(/(?:MFG|MAKE|BRAND)\s*[:=]\s*([A-Za-z0-9 _-]+?)(?:[;|,\r\n]|$)/i);
      const mMod = raw.match(/(?:M\/N|MDL|MODEL(?:\s*NO)?|MOD|P\/N)\s*[:=#]?\s*([A-Za-z0-9._/-]{4,28})/i);
      const mSer = raw.match(/(?:S\/N|SN|SERIAL(?:\s*NO)?|SER)\s*[:=#]?\s*([A-Za-z0-9._/-]{4,28})/i);
      if (mMfg) manufacturer = mMfg[1].trim();
      if (mMod) modelNumber = mMod[1].trim();
      if (mSer) serialNumber = mSer[1].trim();
    }

    // 3. Pipe or slash separated pair (e.g., "YSC120H4RMA|231914582L")
    if (!modelNumber && !serialNumber && /[|;]/.test(raw)) {
      const parts = raw.split(/[|;]/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        modelNumber = parts[0];
        serialNumber = parts[1];
      }
    }

    // 4. Single 1D barcode token (Code 128 / Code 39)
    if (!modelNumber && !serialNumber) {
      const token = raw.replace(/[^A-Za-z0-9._/-]/g, '');
      if (token.length >= 4) {
        if (/^(?:YSC|YCD|TCD|WSC|CSAA|ACH580|ACH550|DESV|PESV|FB\d|KBN\d|48[A-Z]{2}|50[A-Z]{2})/i.test(token)) {
          modelNumber = token;
        } else {
          serialNumber = token;
        }
      }
    }

    return {
      detected: Boolean(modelNumber || serialNumber || raw),
      rawValue: raw,
      manufacturer,
      modelNumber,
      serialNumber,
      mfg: manufacturer,
      model: modelNumber,
      serial: serialNumber
    };
  }

  /**
   * Offline 1D/2D Barcode & QR Detector using browser native `BarcodeDetector` when available,
   * with graceful fallback so it never blocks or throws in unsupported WebViews.
   */
  async function detectBarcodeFromImage(source) {
    const empty = { detected: false, format: '', rawValue: '', manufacturer: '', modelNumber: '', serialNumber: '' };
    if (!source || typeof global.BarcodeDetector !== 'function') {
      return empty;
    }
    try {
      let detector;
      try {
        detector = new global.BarcodeDetector({
          formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'pdf417', 'ean_13', 'itf', 'upc_a']
        });
      } catch (e) {
        detector = new global.BarcodeDetector();
      }

      let target = source;
      if (typeof source === 'string' && source.startsWith('data:image/')) {
        target = await new Promise((resolve) => {
          const im = new Image();
          im.onload = () => {
            const c = document.createElement('canvas');
            c.width = im.width || 640;
            c.height = im.height || 480;
            c.getContext('2d').drawImage(im, 0, 0);
            resolve(c);
          };
          im.onerror = () => resolve(null);
          im.src = source;
        });
      } else if (source && source.canvas) {
        target = source.canvas;
      }
      if (!target) return empty;

      const results = await detector.detect(target);
      if (!Array.isArray(results) || results.length === 0) return empty;

      let mergedMfg = '';
      let mergedModel = '';
      let mergedSerial = '';
      const rawValues = [];
      let firstFmt = '';

      for (const hit of results) {
        const val = String(hit.rawValue || '').trim();
        if (!val) continue;
        rawValues.push(val);
        if (!firstFmt && hit.format) firstFmt = String(hit.format);
        const parsed = parseEquipmentBarcodeText(val);
        if (parsed.manufacturer && !mergedMfg) mergedMfg = parsed.manufacturer;
        if (parsed.modelNumber && !mergedModel) mergedModel = parsed.modelNumber;
        if (parsed.serialNumber && !mergedSerial) mergedSerial = parsed.serialNumber;
      }

      if (rawValues.length === 0) return empty;
      return {
        detected: true,
        format: firstFmt || 'barcode',
        rawValue: rawValues.join(' | '),
        manufacturer: mergedMfg,
        modelNumber: mergedModel,
        serialNumber: mergedSerial
      };
    } catch (e) {
      return empty;
    }
  }

  // ============================================================================
  // Pure-JS Offline PKZIP (.cscwalk.zip) Packager & Unpacker (IEEE CRC-32)
  // Zero external dependencies — bundles manifest.json + maps/ + photos/ + audio/
  // ============================================================================
  const _CRC32_TABLE = (function () {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      t[n] = c >>> 0;
    }
    return t;
  })();

  function _crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = _CRC32_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function dataUrlToUint8Array(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return new Uint8Array(0);
    const parts = dataUrl.split(',');
    const b64 = parts.length > 1 ? parts[1] : parts[0];
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function uint8ArrayToBase64(bytes) {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  /**
   * Builds a standard PKZIP (Store / Method 0) Blob from `[{ name: string, data: Uint8Array }]`
   */
  function buildCscWalkZipBlob(entries) {
    const enc = new TextEncoder();
    const localChunks = [];
    const centralChunks = [];
    let offset = 0;

    for (const ent of entries) {
      const nameBytes = enc.encode(ent.name);
      const dataBytes = ent.data instanceof Uint8Array ? ent.data : enc.encode(String(ent.data || ''));
      const crc = _crc32(dataBytes);
      const size = dataBytes.length;

      // Local File Header (30 + nameLen)
      const lfh = new Uint8Array(30 + nameBytes.length);
      const ldv = new DataView(lfh.buffer);
      ldv.setUint32(0, 0x04034B50, true);
      ldv.setUint16(4, 20, true);     // Version needed (2.0)
      ldv.setUint16(6, 0x0800, true); // UTF-8 filename flag
      ldv.setUint16(8, 0, true);      // Method 0: Store
      ldv.setUint16(10, 0, true);
      ldv.setUint16(12, 0x5421, true);
      ldv.setUint32(14, crc, true);
      ldv.setUint32(18, size, true);
      ldv.setUint32(22, size, true);
      ldv.setUint16(26, nameBytes.length, true);
      ldv.setUint16(28, 0, true);
      lfh.set(nameBytes, 30);

      // Central Directory Header (46 + nameLen)
      const cdh = new Uint8Array(46 + nameBytes.length);
      const cdv = new DataView(cdh.buffer);
      cdv.setUint32(0, 0x02014B50, true);
      cdv.setUint16(4, 20, true);
      cdv.setUint16(6, 20, true);
      cdv.setUint16(8, 0x0800, true);
      cdv.setUint16(10, 0, true);
      cdv.setUint16(12, 0, true);
      cdv.setUint16(14, 0x5421, true);
      cdv.setUint32(16, crc, true);
      cdv.setUint32(20, size, true);
      cdv.setUint32(24, size, true);
      cdv.setUint16(28, nameBytes.length, true);
      cdv.setUint16(30, 0, true);
      cdv.setUint16(32, 0, true);
      cdv.setUint16(34, 0, true);
      cdv.setUint16(36, 0, true);
      cdv.setUint32(38, 0, true);
      cdv.setUint32(42, offset, true);
      cdh.set(nameBytes, 46);

      localChunks.push(lfh, dataBytes);
      centralChunks.push(cdh);
      offset += lfh.length + size;
    }

    let cdSize = 0;
    for (const c of centralChunks) cdSize += c.length;

    const eocd = new Uint8Array(22);
    const edv = new DataView(eocd.buffer);
    edv.setUint32(0, 0x06054B50, true);
    edv.setUint16(4, 0, true);
    edv.setUint16(6, 0, true);
    edv.setUint16(8, entries.length, true);
    edv.setUint16(10, entries.length, true);
    edv.setUint32(12, cdSize, true);
    edv.setUint32(16, offset, true);
    edv.setUint16(20, 0, true);

    return new Blob([...localChunks, ...centralChunks, eocd], { type: 'application/zip' });
  }

  /**
   * Unpacks a `.cscwalk.zip` ArrayBuffer (supports both ZIP_STORED method 0 and ZIP_DEFLATED method 8)
   * Returns `{ manifest: Object, files: { [path]: Uint8Array } }`
   */
  async function parseCscWalkZipBuffer(arrayBuffer) {
    const dv = new DataView(arrayBuffer);
    const bytes = new Uint8Array(arrayBuffer);
    const dec = new TextDecoder('utf-8');

    // Locate End of Central Directory (0x06054B50)
    let eocdPos = -1;
    const minSearch = Math.max(0, bytes.length - 65557);
    for (let i = bytes.length - 22; i >= minSearch; i--) {
      if (dv.getUint32(i, true) === 0x06054B50) {
        eocdPos = i;
        break;
      }
    }
    if (eocdPos < 0) throw new Error('Invalid .cscwalk.zip archive (missing EOCD signature).');

    const totalEntries = dv.getUint16(eocdPos + 10, true);
    let cdOffset = dv.getUint32(eocdPos + 16, true);
    const files = {};

    for (let idx = 0; idx < totalEntries; idx++) {
      if (cdOffset + 46 > bytes.length || dv.getUint32(cdOffset, true) !== 0x02014B50) break;
      const method = dv.getUint16(cdOffset + 10, true);
      const compSize = dv.getUint32(cdOffset + 20, true);
      const nameLen = dv.getUint16(cdOffset + 28, true);
      const extraLen = dv.getUint16(cdOffset + 30, true);
      const commentLen = dv.getUint16(cdOffset + 32, true);
      const localHdrOffset = dv.getUint32(cdOffset + 42, true);
      const name = dec.decode(bytes.subarray(cdOffset + 46, cdOffset + 46 + nameLen));

      const lfhNameLen = dv.getUint16(localHdrOffset + 26, true);
      const lfhExtraLen = dv.getUint16(localHdrOffset + 28, true);
      const dataStart = localHdrOffset + 30 + lfhNameLen + lfhExtraLen;
      const rawSlice = bytes.subarray(dataStart, dataStart + compSize);

      if (!name.endsWith('/')) {
        if (method === 0) {
          files[name] = rawSlice;
        } else if (method === 8 && typeof DecompressionStream !== 'undefined') {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          writer.write(rawSlice);
          writer.close();
          const ab = await new Response(ds.readable).arrayBuffer();
          files[name] = new Uint8Array(ab);
        }
      }
      cdOffset += 46 + nameLen + extraLen + commentLen;
    }

    const manifestKey = Object.keys(files).find((k) => k.endsWith('manifest.json') || k.endsWith('.json'));
    const manifest = manifestKey ? JSON.parse(dec.decode(files[manifestKey])) : null;
    return { manifest, files };
  }

  // ============================================================================
  // v3.4.0: Burned-In CSC Field Evidence Watermark Renderer (<canvas>)
  // Portrait-9:16-safe layout: zero header overlap, deduplicated Unit/Tag title,
  // wrapped title clear of Condition Pill, wrapped Location & ALC rows,
  // ellipsis-safe Spec/Notes wrapping, and dynamic footer height.
  // ============================================================================
  function _formatStampTimestamp(rawTs) {
    if (!rawTs) {
      return new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
    const s = String(rawTs).trim();
    // EXIF format "YYYY:MM:DD HH:MM:SS"
    const exifMatch = s.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}:\d{2})/);
    if (exifMatch) {
      return `${exifMatch[1]}-${exifMatch[2]}-${exifMatch[3]} ${exifMatch[4]}`;
    }
    // ISO format "YYYY-MM-DDTHH:MM..."
    const isoMatch = s.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
    if (isoMatch) {
      return `${isoMatch[1]} ${isoMatch[2]}`;
    }
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      const pad2 = (n) => String(n).padStart(2, '0');
      return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
    }
    return s.slice(0, 19);
  }

  function _fitTextWithEllipsis(ctx, text, maxWidth) {
    const str = String(text || '').trim();
    if (!str || maxWidth <= 0) return '';
    if (ctx.measureText(str).width <= maxWidth) return str;
    const ell = '…';
    let lo = 0;
    let hi = str.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (ctx.measureText(str.slice(0, mid).trimEnd() + ell).width <= maxWidth) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return lo > 0 ? (str.slice(0, lo).trimEnd() + ell) : ell;
  }

  function _wrapCanvasText(ctx, text, maxWidth, maxLines = 0) {
    const rawTokens = String(text || '').split(/\s+/).filter(Boolean);
    if (!rawTokens.length || maxWidth <= 0) return [];

    // Break any single ultra-long unbroken token so it can never overflow maxWidth
    const words = [];
    for (const tok of rawTokens) {
      if (ctx.measureText(tok).width <= maxWidth) {
        words.push(tok);
      } else {
        let chunk = '';
        for (const ch of tok) {
          if (chunk && ctx.measureText(chunk + ch).width > maxWidth) {
            words.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        if (chunk) words.push(chunk);
      }
    }

    const lines = [];
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = current + ' ' + words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);

    if (maxLines > 0 && lines.length > maxLines) {
      const kept = lines.slice(0, maxLines);
      const overflowRemainder = lines.slice(maxLines - 1).join(' ');
      kept[maxLines - 1] = _fitTextWithEllipsis(ctx, overflowRemainder, maxWidth);
      return kept;
    }
    return lines;
  }

  function renderStampedFieldPhotoDataUrl(sourceDataUrl, stampMeta = {}) {
    return new Promise((resolve) => {
      if (!sourceDataUrl || typeof sourceDataUrl !== 'string') {
        resolve(sourceDataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const w = Math.max(640, img.width || 1200);
        const h = Math.max(480, img.height || 900);
        // Scale smoothly using effective width clamped so 810x1440 portrait stays crisp & readable
        const scale = Math.max(0.68, Math.min(1.35, w / 1200));
        const padX = Math.max(14, Math.round(22 * scale));
        const padY = Math.max(12, Math.round(16 * scale));
        const fontMain = Math.max(15, Math.round(21 * scale));
        const fontSub = Math.max(13, Math.round(17 * scale));
        const fontSmall = Math.max(12, Math.round(15 * scale));
        const titleLineH = Math.round(fontMain * 1.28);
        const subLineH = Math.round(fontSub * 1.34);
        const smallLineH = Math.round(fontSmall * 1.38);

        const jobNum = String(stampMeta.jobNumber || 'CSC-26-WALK').trim();
        const projName = String(stampMeta.projectName || 'CSC Site Discovery').trim();
        const unitLabel = stampMeta.unitNumber ? `Unit #${stampMeta.unitNumber}` : String(stampMeta.stationId || 'UNIT').trim();
        const rawTag = String(stampMeta.tag || stampMeta.stationTag || '').trim();
        const slotName = String(stampMeta.slotLabel || (stampMeta.photoSlot === 1 ? 'WIDE CONTEXT' : 'FIELD PHOTO')).trim();

        // Prevent duplicate "Unit #1: Unit #1" when default tag matches unitLabel
        let unitDisplay = unitLabel;
        if (rawTag && rawTag.toLowerCase() !== unitLabel.toLowerCase()) {
          unitDisplay = rawTag.toLowerCase().startsWith('unit #') ? rawTag : `${unitLabel}: ${rawTag}`;
        }
        const titleStr = `${unitDisplay}  [${slotName}]`;

        const condRaw = String(stampMeta.condition || 'good').toUpperCase();
        const condColors = {
          GOOD: { bg: '#059669', border: '#34d399', text: '🟢 GOOD — OVERLAY READY', shortText: '🟢 GOOD' },
          CAUTION: { bg: '#d97706', border: '#fbbf24', text: '🟡 CAUTION — VERIFY / REPAIR', shortText: '🟡 CAUTION' },
          REPLACE: { bg: '#dc2626', border: '#f87171', text: '🔴 REPLACE — EOL / FAILED', shortText: '🔴 REPLACE' },
          ACTION: { bg: '#dc2626', border: '#f87171', text: '🔴 REPLACE — EOL / FAILED', shortText: '🔴 REPLACE' }
        };
        const condStyle = condColors[condRaw] || condColors.GOOD;

        const locVal = stampMeta.location || stampMeta.room || 'Field Pin';
        const locLine = `📍 ${stampMeta.floorName || stampMeta.floorId || 'Floor 1'} • ${locVal}${stampMeta.gpsText ? ' (' + stampMeta.gpsText + ')' : ''}`;
        const specParts = [];
        if (stampMeta.mfg || stampMeta.model) specParts.push(`Make/Model: ${[stampMeta.mfg, stampMeta.model].filter(Boolean).join(' ')}`);
        if (stampMeta.serial) specParts.push(`S/N: ${stampMeta.serial}`);
        if (stampMeta.decodedYear) specParts.push(`Built: ${stampMeta.decodedYear} (${stampMeta.ageYears} yr${stampMeta.eolRisk ? ' ⚠️ EOL' : ''})`);
        if (stampMeta.capacity) specParts.push(`Cap: ${stampMeta.capacity}`);
        if (stampMeta.elec) specParts.push(`Elec: ${stampMeta.elec}`);
        const specLine = specParts.length ? `⚙️ ${specParts.join('  |  ')}` : '⚙️ Specs: Pending Nameplate Decode / Manual Review';

        const alcLine = stampMeta.alcTarget ? `🎛️ ALC WebCTRL Target: ${stampMeta.alcTarget}` : '';
        const fieldNoteVal = stampMeta.fieldNote || stampMeta.userNote || '';
        const notesRaw = [
          ...(Array.isArray(stampMeta.quickIssues) && stampMeta.quickIssues.length ? [`Issues: ${stampMeta.quickIssues.join(', ')}`] : []),
          fieldNoteVal ? `Notes: ${fieldNoteVal}` : '',
          stampMeta.voiceTranscript ? `🎙️ "${stampMeta.voiceTranscript}"` : ''
        ].filter(Boolean).join('  •  ');

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const maxTextW = w - padX * 2;

        // Measure Condition Pill first so Row 1 Title never collides with it on 9:16 portrait photos
        tempCtx.font = `800 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        let condTxt = condStyle.text;
        let pillW = Math.ceil(tempCtx.measureText(condTxt).width + Math.round(24 * scale));
        if (pillW > w * 0.42) {
          condTxt = condStyle.shortText;
          pillW = Math.ceil(tempCtx.measureText(condTxt).width + Math.round(20 * scale));
        }
        const pillGap = Math.round(14 * scale);
        const availTitleW = Math.max(180, maxTextW - pillW - pillGap);

        tempCtx.font = `900 ${fontMain}px "Segoe UI", Arial, sans-serif`;
        const wrappedTitle = _wrapCanvasText(tempCtx, titleStr, availTitleW, 2);

        tempCtx.font = `700 ${fontSub}px "Segoe UI", Arial, sans-serif`;
        const wrappedLoc = _wrapCanvasText(tempCtx, locLine, maxTextW, 2);

        tempCtx.font = `600 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        const wrappedSpec = _wrapCanvasText(tempCtx, specLine, maxTextW, 2);

        tempCtx.font = `700 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        const wrappedAlc = alcLine ? _wrapCanvasText(tempCtx, alcLine, maxTextW, 2) : [];
        const wrappedNotes = notesRaw ? _wrapCanvasText(tempCtx, notesRaw, maxTextW, 2) : [];

        const pillH = Math.round(fontMain * 1.35);
        const titleBlockH = Math.max(pillH, wrappedTitle.length * titleLineH);
        const sectionGap = Math.max(4, Math.round(6 * scale));
        const bannerH =
          padY * 2 +
          titleBlockH +
          sectionGap +
          wrappedLoc.length * subLineH +
          wrappedSpec.length * smallLineH +
          wrappedAlc.length * smallLineH +
          wrappedNotes.length * smallLineH +
          Math.round(8 * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h + bannerH;
        const ctx = canvas.getContext('2d');

        // 1. Draw full-resolution source photo (raw or CLAHE-enhanced) at top
        ctx.drawImage(img, 0, 0, w, h);

        // 2. Top header bar with guaranteed left/right separation on narrow portrait photos
        const topChipH = Math.max(28, Math.round(36 * scale));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(0, 0, w, topChipH);

        ctx.font = `800 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        const tsStr = _formatStampTimestamp(stampMeta.capturedAt);
        const tsWidth = Math.ceil(ctx.measureText(tsStr).width);
        const tsX = w - padX - tsWidth;
        const topBaselineY = Math.round(topChipH * 0.68);

        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(tsStr, tsX, topBaselineY);

        const maxLeftHeaderW = Math.max(120, tsX - padX - Math.round(16 * scale));
        let leftHeaderCandidate = `🧭 CONTROL SERVICE COMPANY (CSC)  •  ${jobNum}  •  ${projName}`;
        if (ctx.measureText(leftHeaderCandidate).width > maxLeftHeaderW) {
          leftHeaderCandidate = `🧭 CSC  •  ${jobNum}  •  ${projName}`;
        }
        ctx.fillStyle = '#2dd4bf';
        ctx.fillText(_fitTextWithEllipsis(ctx, leftHeaderCandidate, maxLeftHeaderW), padX, topBaselineY);

        // 3. High-contrast footer banner below the photo (never covers equipment details)
        const by = h;
        ctx.fillStyle = '#090e1a';
        ctx.fillRect(0, by, w, bannerH);

        // Accent top border bar in Condition color
        const borderBarH = Math.max(4, Math.round(5 * scale));
        ctx.fillStyle = condStyle.border;
        ctx.fillRect(0, by, w, borderBarH);

        // Condition Pill on top-right of footer
        const pillX = w - padX - pillW;
        const pillY = by + padY;
        ctx.fillStyle = condStyle.bg;
        ctx.fillRect(pillX, pillY, pillW, pillH);
        ctx.strokeStyle = condStyle.border;
        ctx.lineWidth = Math.max(1.5, 2 * scale);
        ctx.strokeRect(pillX, pillY, pillW, pillH);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        ctx.fillText(condTxt, pillX + Math.round((pillW - ctx.measureText(condTxt).width) / 2), pillY + Math.round(pillH * 0.70));

        // Row 1+: Wrapped Unit / Tag / Slot title on left (strictly <= availTitleW)
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${fontMain}px "Segoe UI", Arial, sans-serif`;
        let titleY = by + padY + Math.round(fontMain * 0.92);
        for (let i = 0; i < wrappedTitle.length; i++) {
          if (i > 0) titleY += titleLineH;
          ctx.fillText(wrappedTitle[i], padX, titleY);
        }

        let curY = by + padY + titleBlockH + sectionGap;

        // Row 2+: Wrapped Floor & Location
        ctx.fillStyle = '#5eead4';
        ctx.font = `700 ${fontSub}px "Segoe UI", Arial, sans-serif`;
        for (const ll of wrappedLoc) {
          curY += Math.round(subLineH * 0.88);
          ctx.fillText(ll, padX, curY);
          curY += Math.round(subLineH * 0.12);
        }

        // Row 3+: Wrapped Decoded Nameplate Specs
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `600 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        for (const sl of wrappedSpec) {
          curY += smallLineH;
          ctx.fillText(sl, padX, curY);
        }

        // Row 4+: Wrapped ALC WebCTRL Target
        if (wrappedAlc.length) {
          ctx.fillStyle = '#93c5fd';
          ctx.font = `700 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
          for (const al of wrappedAlc) {
            curY += smallLineH;
            ctx.fillText(al, padX, curY);
          }
        }

        // Row 5+: Wrapped Field Issues & Voice Notes
        if (wrappedNotes.length) {
          ctx.fillStyle = '#fde68a';
          ctx.font = `700 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
          for (const nl of wrappedNotes) {
            curY += smallLineH;
            ctx.fillText(nl, padX, curY);
          }
        }

        resolve(canvas.toDataURL('image/jpeg', 0.90));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  }

  function dataUrlToBlob(dataUrl, fallbackMime = 'image/jpeg') {
    const str = String(dataUrl || '');
    const commaIdx = str.indexOf(',');
    let mime = fallbackMime;
    if (commaIdx > 0) {
      const m = str.slice(0, commaIdx).match(/data:([^;]+)/i);
      if (m && m[1]) mime = m[1];
    }
    const bytes = dataUrlToUint8Array(str);
    return new Blob([bytes], { type: mime });
  }

  // ============================================================================
  // Native Android APK (`window.RollupNative`), Web Share & Browser Download Bridge
  // ============================================================================
  async function saveOrShareBlob(filename, mimeType, blob, shareTitle) {
    // 1. Inside RollupOS Android WebView APK:
    //    - If shareTitle is provided, launch native Android Share Sheet via shareBase64File!
    //    - Otherwise save directly to Gallery (Pictures/CSC_Site_Discovery for images) or Downloads!
    if (hasRollupNative()) {
      try {
        const ab = await blob.arrayBuffer();
        const b64 = uint8ArrayToBase64(new Uint8Array(ab));
        if (shareTitle && typeof global.RollupNative.shareBase64File === 'function') {
          const shared = global.RollupNative.shareBase64File(filename, mimeType, b64, String(shareTitle));
          if (shared !== false) {
            return { ok: true, channel: 'RollupNative.shareBase64File' };
          }
        }
        const savedUri = global.RollupNative.saveBase64File(filename, mimeType, b64);
        return { ok: Boolean(savedUri !== ''), channel: 'RollupNative.saveBase64File', uri: savedUri };
      } catch (e) {
        console.warn('[CSCDiscoveryAdapter] RollupNative save/share error:', e);
      }
    }

    // 2. Mobile Browser Web Share Level 2 (Files) when supported & explicitly requested
    if (shareTitle && navigator.canShare && typeof File !== 'undefined') {
      try {
        const f = blob instanceof File ? blob : new File([blob], filename, { type: mimeType });
        if (navigator.canShare({ files: [f] })) {
          await navigator.share({ title: shareTitle, text: filename, files: [f] });
          return { ok: true, channel: 'navigator.share(files)' };
        }
      } catch (e) {
        if (e && e.name === 'AbortError') {
          return { ok: false, channel: 'cancelled' };
        }
        // Fall through to standard download if share fails due to gesture timeout
      }
    }

    // 3. RollupBridge.files base64 helper if present
    if (hasRollupBridge() && global.RollupBridge.files) {
      const ab = await blob.arrayBuffer();
      const b64 = uint8ArrayToBase64(new Uint8Array(ab));
      if (shareTitle && typeof global.RollupBridge.files.shareBase64 === 'function') {
        const ok = global.RollupBridge.files.shareBase64(filename, b64, mimeType, shareTitle);
        if (ok) return { ok: true, channel: 'RollupBridge.files.shareBase64' };
      }
      if (typeof global.RollupBridge.files.downloadBase64 === 'function') {
        global.RollupBridge.files.downloadBase64(filename, b64, mimeType);
        return { ok: true, channel: 'RollupBridge.files.downloadBase64' };
      }
    }

    // 4. Standard Desktop / Chrome Browser Anchor Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1500);
    return { ok: true, channel: 'anchor-download' };
  }

  async function shareFilesNative(filesArray, title, text) {
    if (!filesArray || !filesArray.length) return { ok: false, reason: 'no_files' };

    // 1. Inside RollupOS Android APK: use native ACTION_SEND_MULTIPLE / ACTION_SEND bridge!
    if (hasRollupNative()) {
      try {
        const encodedItems = [];
        for (const f of filesArray) {
          const ab = await f.arrayBuffer();
          encodedItems.push({
            filename: f.name || 'CSC_Stamped_Photo.jpg',
            mimeType: f.type || 'image/jpeg',
            base64: uint8ArrayToBase64(new Uint8Array(ab))
          });
        }
        if (encodedItems.length === 1 && typeof global.RollupNative.shareBase64File === 'function') {
          // Also save image to Gallery if saveBase64File is present so user keeps a local copy in Gallery
          if (encodedItems[0].mimeType.startsWith('image/')) {
            try { global.RollupNative.saveBase64File(encodedItems[0].filename, encodedItems[0].mimeType, encodedItems[0].base64); } catch (e) {}
          }
          const ok = global.RollupNative.shareBase64File(
            encodedItems[0].filename,
            encodedItems[0].mimeType,
            encodedItems[0].base64,
            String(title || 'CSC Field Discovery')
          );
          if (ok !== false) return { ok: true, channel: 'RollupNative.shareBase64File' };
        }
        if (typeof global.RollupNative.shareMultipleBase64Files === 'function') {
          const ok = global.RollupNative.shareMultipleBase64Files(
            JSON.stringify(encodedItems),
            String(title || 'CSC Field Discovery')
          );
          if (ok !== false) return { ok: true, channel: 'RollupNative.shareMultipleBase64Files' };
        }
        // Fallback for older APK without shareMultipleBase64Files: save all to Gallery/Downloads and share first
        for (const item of encodedItems) {
          global.RollupNative.saveBase64File(item.filename, item.mimeType, item.base64);
        }
        if (typeof global.RollupNative.shareBase64File === 'function') {
          global.RollupNative.shareBase64File(
            encodedItems[0].filename,
            encodedItems[0].mimeType,
            encodedItems[0].base64,
            String(title || 'CSC Field Discovery')
          );
        }
        return { ok: true, channel: 'RollupNative.saveAndShareFallback' };
      } catch (e) {
        console.warn('[CSCDiscoveryAdapter] Native multi-file share error:', e);
      }
    }

    // 2. RollupBridge.files.shareMultipleBase64Files if present
    if (hasRollupBridge() && global.RollupBridge.files && typeof global.RollupBridge.files.shareMultipleBase64Files === 'function') {
      try {
        const encodedItems = [];
        for (const f of filesArray) {
          const ab = await f.arrayBuffer();
          encodedItems.push({
            filename: f.name || 'CSC_Stamped_Photo.jpg',
            mimeType: f.type || 'image/jpeg',
            base64: uint8ArrayToBase64(new Uint8Array(ab))
          });
        }
        const ok = await global.RollupBridge.files.shareMultipleBase64Files(encodedItems, title || 'CSC Field Discovery');
        if (ok) return { ok: true, channel: 'RollupBridge.files.shareMultipleBase64Files' };
      } catch (e) {}
    }

    // 3. Web Share API Level 2 (Mobile Chrome / Edge PWA)
    if (navigator.canShare && typeof File !== 'undefined') {
      try {
        if (navigator.canShare({ files: filesArray })) {
          await navigator.share({ title: title || 'CSC Field Discovery', text: text || '', files: filesArray });
          return { ok: true, channel: 'navigator.share(files)' };
        }
      } catch (e) {
        if (e && e.name === 'AbortError') {
          return { ok: false, channel: 'cancelled' };
        }
        return { ok: false, reason: e.message || 'share_error' };
      }
    }
    return { ok: false, reason: 'web_share_unsupported' };
  }

  async function shareOrExport(title, text, filename, jsonObj) {
    if (jsonObj && filename) {
      const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });
      return saveOrShareBlob(filename, 'application/json', blob, title);
    }
    if (hasRollupBridge() && global.RollupBridge.files && navigator.share) {
      await global.RollupBridge.files.share(title, text);
    }
  }

  const _deviceSavedPhotosHistory = [];

  function getDeviceSavedPhotosHistory() {
    return _deviceSavedPhotosHistory.slice();
  }

  /**
   * Saves a captured photo (dataUrl or Blob) directly to the device storage:
   * - Inside RollupOS Android APK (`window.RollupNative.saveBase64File`): writes directly to
   *   `MediaStore.Images.Media.EXTERNAL_CONTENT_URI` (`Pictures/CSC_Site_Discovery/<filename>`).
   * - Inside RollupOS Hub (`RollupBridge.files.downloadBase64`): saves via bridge downloader.
   * - Standalone Browser / PWA: triggers direct file download (`<a download>`) to device Downloads.
   */
  async function savePhotoToDevice(filename, dataUrlOrBlob, options = {}) {
    const safeName = String(filename || `CSC_Field_Photo_${Date.now()}.jpg`)
      .replace(/[^a-zA-Z0-9._-]/g, '_') || 'CSC_Field_Photo.jpg';
    const mimeType = options.mimeType || 'image/jpeg';

    let blob = null;
    let b64 = '';
    if (typeof dataUrlOrBlob === 'string') {
      b64 = dataUrlOrBlob.includes(',') ? dataUrlOrBlob.split(',')[1] : dataUrlOrBlob;
      blob = dataUrlToBlob(dataUrlOrBlob, mimeType);
    } else if (dataUrlOrBlob instanceof Blob) {
      blob = dataUrlOrBlob;
      const ab = await blob.arrayBuffer();
      b64 = uint8ArrayToBase64(new Uint8Array(ab));
    } else {
      return { ok: false, reason: 'invalid_photo_payload' };
    }

    const recordSave = (channel, destination, extra = {}) => {
      const entry = {
        filename: safeName,
        mimeType,
        sizeBytes: blob ? blob.size : Math.round((b64.length * 3) / 4),
        channel,
        destination,
        stationId: options.stationId || null,
        slot: options.slot || null,
        savedAt: new Date().toISOString(),
        ...extra
      };
      _deviceSavedPhotosHistory.unshift(entry);
      if (_deviceSavedPhotosHistory.length > 50) _deviceSavedPhotosHistory.length = 50;
      return { ok: true, ...entry };
    };

    if (hasRollupNative()) {
      try {
        const res = global.RollupNative.saveBase64File(safeName, mimeType, b64);
        if (res !== false && res !== '') {
          return recordSave('RollupNative.saveBase64File', 'Phone Gallery (Pictures/CSC_Site_Discovery)', { uri: res });
        }
      } catch (e) {
        console.warn('[CSCDiscoveryAdapter] savePhotoToDevice native error:', e);
      }
    }

    if (hasRollupBridge() && global.RollupBridge.files && typeof global.RollupBridge.files.downloadBase64 === 'function') {
      try {
        global.RollupBridge.files.downloadBase64(safeName, b64, mimeType);
        return recordSave('RollupBridge.files.downloadBase64', 'Device Downloads');
      } catch (e) {}
    }

    if (options.suppressAnchorClickInHeadless) {
      return recordSave('headless-device-save', 'Device Storage');
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName;
    a.style.display = 'none';
    if (document.body) document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try { a.remove(); } catch (e) {}
      URL.revokeObjectURL(url);
    }, 1500);
    return recordSave('anchor-download', 'Device Downloads');
  }

  // Mount RollupOS Floating Pill automatically when running inside RollupOS Hub
  global.addEventListener('DOMContentLoaded', () => {
    if (hasRollupBridge() && typeof global.RollupBridge.mountInAppConsolePill === 'function') {
      global.RollupBridge.mountInAppConsolePill({
        appId: APP_ID,
        visibility: 'restricted',
        bottomOffset: '18px',
        settingsLabel: 'Walk / Sync Hub',
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
    hasRollupNative,
    getActiveUser,
    readState,
    writeState,
    getSecretKey,
    setSecretKey,
    saveMediaBlob,
    loadMediaBlob,
    deleteMediaBlob,
    listSessionMediaEntries,
    extractJpegExifFromArrayBuffer,
    captureImage,
    captureImageFromLiveCamera,
    captureImageFromFileInput,
    enhanceStampedPlateDataUrl,
    renderStampedFieldPhotoDataUrl,
    _formatStampTimestamp,
    computeCanvasLaplacianSharpness,
    parseEquipmentBarcodeText,
    detectBarcodeFromImage,
    dataUrlToUint8Array,
    dataUrlToBlob,
    uint8ArrayToBase64,
    buildCscWalkZipBlob,
    parseCscWalkZipBuffer,
    savePhotoToDevice,
    getDeviceSavedPhotosHistory,
    saveOrShareBlob,
    shareFilesNative,
    shareOrExport
  };
})(window);
