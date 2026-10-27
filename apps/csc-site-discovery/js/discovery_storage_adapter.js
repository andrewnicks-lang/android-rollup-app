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

  // Unified Camera / Image Picker — Extracts raw EXIF BEFORE <canvas> resize!
  async function captureImage(options = {}) {
    const maxDim = options.maxDim || 1440;
    const quality = options.quality || 0.85;

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.accept || 'image/*';
      if (options.useRearCamera !== false) {
        input.setAttribute('capture', 'environment');
      }
      input.onchange = async () => {
        const file = input.files && input.files[0];
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
            resolve({
              width: w,
              height: h,
              sizeKB: Math.round((dataUrl.length * 0.75) / 1024),
              capturedAt: new Date().toISOString(),
              originalName: file.name,
              exif,
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
  // v3.2.0: Burned-In CSC Field Evidence Watermark Renderer (<canvas>)
  // Stamps Job #, Unit #/Tag, Condition Pill, Location, Decoded Nameplate Specs,
  // ALC Target, Quick Issues & Voice Notes onto the bottom of full-color photos.
  // ============================================================================
  function _wrapCanvasText(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    if (!words.length) return [];
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
        const scale = w / 1200;
        const padX = Math.round(22 * scale);
        const padY = Math.round(16 * scale);
        const fontMain = Math.max(15, Math.round(21 * scale));
        const fontSub = Math.max(13, Math.round(17 * scale));
        const fontSmall = Math.max(12, Math.round(15 * scale));
        const lineHeight = Math.round(fontSub * 1.38);

        const jobNum = stampMeta.jobNumber || 'CSC-26-WALK';
        const projName = stampMeta.projectName || 'CSC Site Discovery';
        const unitLabel = stampMeta.unitNumber ? `Unit #${stampMeta.unitNumber}` : (stampMeta.stationId || 'UNIT');
        const eqTag = stampMeta.tag || unitLabel;
        const slotName = stampMeta.slotLabel || 'FIELD PHOTO';
        const condRaw = String(stampMeta.condition || 'good').toUpperCase();
        const condColors = {
          GOOD: { bg: '#059669', border: '#34d399', text: '🟢 GOOD — OVERLAY READY' },
          CAUTION: { bg: '#d97706', border: '#fbbf24', text: '🟡 CAUTION — VERIFY / REPAIR' },
          REPLACE: { bg: '#dc2626', border: '#f87171', text: '🔴 REPLACE — EOL / FAILED' }
        };
        const condStyle = condColors[condRaw] || condColors.GOOD;

        const locLine = `📍 ${stampMeta.floorName || stampMeta.floorId || 'Floor 1'} • ${stampMeta.location || 'Field Pin'}${stampMeta.gpsText ? ' (' + stampMeta.gpsText + ')' : ''}`;
        const specParts = [];
        if (stampMeta.mfg || stampMeta.model) specParts.push(`Make/Model: ${[stampMeta.mfg, stampMeta.model].filter(Boolean).join(' ')}`);
        if (stampMeta.serial) specParts.push(`S/N: ${stampMeta.serial}`);
        if (stampMeta.decodedYear) specParts.push(`Built: ${stampMeta.decodedYear} (${stampMeta.ageYears} yr${stampMeta.eolRisk ? ' ⚠️ EOL' : ''})`);
        if (stampMeta.capacity) specParts.push(`Cap: ${stampMeta.capacity}`);
        if (stampMeta.elec) specParts.push(`Elec: ${stampMeta.elec}`);
        const specLine = specParts.length ? `⚙️ ${specParts.join('  |  ')}` : '⚙️ Specs: Pending Nameplate Decode / Manual Review';

        const alcLine = stampMeta.alcTarget ? `🎛️ ALC WebCTRL Target: ${stampMeta.alcTarget}` : '';
        const notesRaw = [
          ...(Array.isArray(stampMeta.quickIssues) && stampMeta.quickIssues.length ? [`Issues: ${stampMeta.quickIssues.join(', ')}`] : []),
          stampMeta.fieldNote ? `Notes: ${stampMeta.fieldNote}` : '',
          stampMeta.voiceTranscript ? `🎙️ "${stampMeta.voiceTranscript}"` : ''
        ].filter(Boolean).join('  •  ');

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.font = `600 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        const maxTextW = w - padX * 2;
        const wrappedSpec = _wrapCanvasText(tempCtx, specLine, maxTextW).slice(0, 2);
        const wrappedNotes = notesRaw ? _wrapCanvasText(tempCtx, notesRaw, maxTextW).slice(0, 2) : [];

        const totalLines = 2 + wrappedSpec.length + (alcLine ? 1 : 0) + wrappedNotes.length;
        const bannerH = padY * 2 + Math.round(fontMain * 1.55) + totalLines * lineHeight + Math.round(10 * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h + bannerH;
        const ctx = canvas.getContext('2d');

        // 1. Draw original full-color photo at top
        ctx.drawImage(img, 0, 0, w, h);

        // 2. Top-left subtle unit badge overlay on the photo corner
        const topChipH = Math.round(36 * scale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
        ctx.fillRect(0, 0, w, topChipH);
        ctx.fillStyle = '#2dd4bf';
        ctx.font = `800 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        ctx.fillText(`🧭 CONTROL SERVICE COMPANY (CSC)  •  ${jobNum}  •  ${projName}`, padX, Math.round(topChipH * 0.68));
        const tsStr = stampMeta.capturedAt || new Date().toISOString().slice(0, 16).replace('T', ' ');
        const tsWidth = ctx.measureText(tsStr).width;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(tsStr, w - padX - tsWidth, Math.round(topChipH * 0.68));

        // 3. Draw high-contrast footer banner below the photo (never covers up equipment details!)
        const by = h;
        ctx.fillStyle = '#090e1a';
        ctx.fillRect(0, by, w, bannerH);

        // Accent top border bar in Condition color
        ctx.fillStyle = condStyle.border;
        ctx.fillRect(0, by, w, Math.max(4, Math.round(5 * scale)));

        let curY = by + padY + fontMain;

        // Row 1: Unit # + Tag + Slot Label on left, Condition Pill on right
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${fontMain}px "Segoe UI", Arial, sans-serif`;
        const titleStr = `${unitLabel}: ${eqTag}  [${slotName}]`;
        ctx.fillText(titleStr, padX, curY);

        ctx.font = `800 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        const condTxt = condStyle.text;
        const pillW = ctx.measureText(condTxt).width + Math.round(24 * scale);
        const pillH = Math.round(fontMain * 1.35);
        const pillX = w - padX - pillW;
        const pillY = curY - Math.round(fontMain * 0.92);
        ctx.fillStyle = condStyle.bg;
        ctx.fillRect(pillX, pillY, pillW, pillH);
        ctx.strokeStyle = condStyle.border;
        ctx.lineWidth = Math.max(1.5, 2 * scale);
        ctx.strokeRect(pillX, pillY, pillW, pillH);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(condTxt, pillX + Math.round(12 * scale), curY - Math.round(fontMain * 0.08));

        // Row 2: Floor & Location
        curY += Math.round(lineHeight * 1.1);
        ctx.fillStyle = '#5eead4';
        ctx.font = `700 ${fontSub}px "Segoe UI", Arial, sans-serif`;
        ctx.fillText(locLine, padX, curY);

        // Row 3+: Decoded Nameplate Specs
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `600 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
        for (const sl of wrappedSpec) {
          curY += lineHeight;
          ctx.fillText(sl, padX, curY);
        }

        // Row 4: ALC Target
        if (alcLine) {
          curY += lineHeight;
          ctx.fillStyle = '#93c5fd';
          ctx.font = `700 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
          ctx.fillText(alcLine, padX, curY);
        }

        // Row 5+: Field Issues & Voice Notes
        if (wrappedNotes.length) {
          ctx.fillStyle = '#fde68a';
          ctx.font = `700 ${fontSmall}px "Segoe UI", Arial, sans-serif`;
          for (const nl of wrappedNotes) {
            curY += lineHeight;
            ctx.fillText(nl, padX, curY);
          }
        }

        resolve(canvas.toDataURL('image/jpeg', 0.90));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  }

  // ============================================================================
  // Native Android APK (`window.RollupNative`), Web Share & Browser Download Bridge
  // ============================================================================
  async function saveOrShareBlob(filename, mimeType, blob, shareTitle) {
    // 1. Inside RollupOS Android WebView APK -> Direct Kotlin MediaStore/Downloads + Share!
    if (hasRollupNative()) {
      try {
        const ab = await blob.arrayBuffer();
        const b64 = uint8ArrayToBase64(new Uint8Array(ab));
        global.RollupNative.saveBase64File(filename, mimeType, b64);
        return { ok: true, channel: 'RollupNative.saveBase64File' };
      } catch (e) {
        console.warn('[CSCDiscoveryAdapter] RollupNative save error:', e);
      }
    }

    // 2. Mobile Browser Web Share Level 2 (Files) when supported & explicitly requested
    if (shareTitle && navigator.canShare && typeof File !== 'undefined') {
      try {
        const f = new File([blob], filename, { type: mimeType });
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
    if (hasRollupBridge() && global.RollupBridge.files && typeof global.RollupBridge.files.downloadBase64 === 'function') {
      const ab = await blob.arrayBuffer();
      const b64 = uint8ArrayToBase64(new Uint8Array(ab));
      global.RollupBridge.files.downloadBase64(filename, b64, mimeType);
      return { ok: true, channel: 'RollupBridge.files.downloadBase64' };
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
    enhanceStampedPlateDataUrl,
    renderStampedFieldPhotoDataUrl,
    computeCanvasLaplacianSharpness,
    dataUrlToUint8Array,
    uint8ArrayToBase64,
    buildCscWalkZipBlob,
    parseCscWalkZipBuffer,
    saveOrShareBlob,
    shareFilesNative,
    shareOrExport
  };
})(window);
