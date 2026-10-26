/**
 * garage_engine.js — 100% Deterministic Client-Side FORScan & As-Built Engine for RollupOS
 * Direct port of verified Python modules:
 *   checksum.py, masks.py, ops.py, abt_parser.py, ab_parser.py, validator.py, vin.py, modules.py
 * Zero LLM involvement for math, masks, checksums, diffs, or readiness gating.
 */
(function (global) {
  'use strict';

  const HEX = '0123456789ABCDEF';

  // --- 1. Deterministic Synchronous SHA-256 (Works on HTTP LAN + HTTPS + Offline APK) ---
  function sha256Hex(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const bytes = new TextEncoder().encode(String(ascii || ''));
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const bitLen = bytes.length * 8;
    const totalLen = (((bytes.length + 8) >> 6) + 1) << 6;
    const msg = new Uint8Array(totalLen);
    msg.set(bytes);
    msg[bytes.length] = 0x80;
    const dv = new DataView(msg.buffer);
    dv.setUint32(totalLen - 4, bitLen >>> 0, false);
    dv.setUint32(totalLen - 8, Math.floor(bitLen / 0x100000000), false);

    const w = new Uint32Array(64);
    for (let chunk = 0; chunk < totalLen; chunk += 64) {
      for (let i = 0; i < 16; i++) {
        w[i] = dv.getUint32(chunk + i * 4, false);
      }
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (hh + S1 + ch + k[i] + w[i]) >>> 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + temp1) >>> 0;
        d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0;
      h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0;
      h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    return h.map((v) => ('00000000' + v.toString(16)).slice(-8)).join('');
  }

  // --- 2. Ford As-Built Line Checksum (checksum.py) ---
  function hexGroupsToBytes(payload) {
    const s = String(payload || '').replace(/\s+/g, '');
    if (s.length % 2 !== 0 || !s.length) {
      throw new Error(`Invalid hex payload length: ${payload}`);
    }
    const out = [];
    for (let i = 0; i < s.length; i += 2) {
      const v = parseInt(s.slice(i, i + 2), 16);
      if (Number.isNaN(v)) throw new Error(`Invalid hex byte in: ${payload}`);
      out.push(v);
    }
    return out;
  }

  function computeChecksum(module, block, line, payload) {
    const blk = Number(block);
    const ln = Number(line);
    if (blk < 0 || blk > 255 || ln < 0 || ln > 255) {
      throw new Error('block and line must be 0-255');
    }
    const mod = String(module || '').trim().toUpperCase();
    if (mod.length !== 3) throw new Error('module id must be 3 hex digits');
    const header = [ln, blk, parseInt(mod.slice(1, 3), 16), parseInt(mod.slice(0, 1), 16)];
    const data = hexGroupsToBytes(payload);
    let sum = header[0] + header[1] + header[2] + header[3];
    for (let i = 0; i < data.length - 1; i++) {
      sum += data[i];
    }
    return ('00' + (sum & 0xff).toString(16).toUpperCase()).slice(-2);
  }

  function checksumOk(module, block, line, payload) {
    try {
      const clean = String(payload || '').replace(/\s+/g, '').toUpperCase();
      return clean.slice(-2) === computeChecksum(module, block, line, payload);
    } catch (e) {
      return false;
    }
  }

  function withChecksum(module, block, line, payload) {
    const cs = computeChecksum(module, block, line, payload);
    const groups = String(payload || '').trim().split(/\s+/);
    const last = groups[groups.length - 1];
    groups[groups.length - 1] = last.slice(0, -2) + cs;
    return groups.join(' ');
  }

  // --- 3. Masks & Address Parsing (masks.py + ops.py) ---
  function parseAddress(addrStr) {
    const parts = String(addrStr || '').trim().split('-');
    if (parts.length !== 3 || parts[0].length !== 3) {
      throw new Error(`bad address ${addrStr}`);
    }
    const module = parts[0].toUpperCase();
    const block = parseInt(parts[1], 10);
    const line = parseInt(parts[2], 10);
    if (Number.isNaN(block) || Number.isNaN(line)) {
      throw new Error(`bad address ${addrStr}`);
    }
    const bStr = block < 10 ? `0${block}` : `${block}`;
    const lStr = line < 10 ? `0${line}` : `${line}`;
    return { module, block, line, key: `${module}-${bStr}-${lStr}` };
  }

  function cleanMask(mask) {
    const m = String(mask || '').replace(/\s+/g, '').toLowerCase();
    if (!m) throw new Error('empty mask');
    for (let i = 0; i < m.length; i++) {
      if (m[i] !== 'x' && m[i] !== '*' && m[i] !== '-') {
        throw new Error(`unsupported mask char '${m[i]}' in ${mask}`);
      }
    }
    return m;
  }

  function targetPositions(mask) {
    const m = cleanMask(mask);
    const pos = [];
    for (let i = 0; i < m.length; i++) {
      if (m[i] === '*') pos.push(i);
    }
    if (!pos.length) throw new Error(`mask ${mask} has no '*' target`);
    return pos;
  }

  function opTargetNibble(op, curHexChar) {
    const k = op.kind;
    let nextChar = null;
    if (k === 'set') {
      nextChar = String(op.hex || '').toUpperCase();
    } else if (k === 'bits') {
      let v = parseInt(curHexChar, 16);
      const bitsObj = op.bits || {};
      Object.keys(bitsObj).forEach((bitKey) => {
        const bit = parseInt(bitKey, 10);
        const act = bitsObj[bitKey];
        v = act ? (v | (1 << bit)) : (v & ~(1 << bit));
      });
      nextChar = HEX[v];
    } else if (k === 'offset') {
      const v = parseInt(curHexChar, 16) + Number(op.delta || 0);
      if (v < 0 || v > 15) return { hex: null, state: 'OUT_OF_RANGE' };
      nextChar = HEX[v];
    } else {
      return { hex: null, state: 'NEEDS_INPUT' };
    }
    return {
      hex: nextChar,
      state: nextChar === String(curHexChar).toUpperCase() ? 'ALREADY_SET' : 'WILL_CHANGE'
    };
  }

  function evaluateStep(step, stateMap) {
    let addr;
    try {
      addr = parseAddress(step.address);
    } catch (e) {
      return { address: step.address || '?', state: 'LAYOUT_MISMATCH', before: null, after: null, detail: e.message };
    }
    const payload = stateMap ? stateMap[addr.key] : null;
    if (!payload) {
      return {
        address: addr.key,
        state: 'ADDRESS_MISSING',
        before: null,
        after: null,
        detail: 'address not in your imported backup (module absent or not backed up yet)'
      };
    }
    let maskLen;
    try {
      maskLen = cleanMask(step.mask).length;
    } catch (e) {
      return { address: addr.key, state: 'LAYOUT_MISMATCH', before: payload, after: null, detail: e.message };
    }
    const rawDigits = payload.replace(/\s+/g, '').toUpperCase();
    if (maskLen !== rawDigits.length) {
      return {
        address: addr.key,
        state: 'LAYOUT_MISMATCH',
        before: payload,
        after: null,
        detail: `mask has ${maskLen} hex digits, your truck line has ${rawDigits.length}`
      };
    }

    const digits = rawDigits.split('');
    const states = [];
    const ops = Array.isArray(step.ops) ? step.ops : [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op.kind === 'manual' || op.pos === null || op.pos === undefined) {
        states.push('NEEDS_INPUT');
        continue;
      }
      const res = opTargetNibble(op, digits[op.pos]);
      states.push(res.state);
      if (res.hex !== null && res.state !== 'OUT_OF_RANGE') {
        digits[op.pos] = res.hex;
      }
    }

    if (states.includes('OUT_OF_RANGE')) {
      return { address: addr.key, state: 'OUT_OF_RANGE', before: payload, after: null, detail: 'offset leaves 0-F range' };
    }
    if (states.includes('NEEDS_INPUT')) {
      return { address: addr.key, state: 'NEEDS_INPUT', before: payload, after: null, detail: 'recipe requires manual value selection' };
    }

    const groups = payload.trim().split(/\s+/);
    const rebuilt = [];
    let idx = 0;
    for (let g = 0; g < groups.length; g++) {
      const len = groups[g].length;
      rebuilt.push(digits.slice(idx, idx + len).join(''));
      idx += len;
    }

    const allAlready = states.length > 0 && states.every((s) => s === 'ALREADY_SET');
    if (allAlready) {
      return { address: addr.key, state: 'ALREADY_SET', before: payload, after: payload, detail: '' };
    }
    const after = withChecksum(addr.module, addr.block, addr.line, rebuilt.join(' '));
    return { address: addr.key, state: 'READY', before: payload, after, detail: '' };
  }

  // --- 4. Readiness Gating & Session Verification (validator.py) ---
  function readiness(entry, stateMap) {
    const steps = Array.isArray(entry.steps) ? entry.steps : [];
    const blockers = [];
    if (entry.tier === 3) {
      blockers.push(`TIER 3 LOCKED: ${entry.tier_reason || 'Safety/Powertrain/ADAS critical'}`);
    }
    if (entry.ev_status === 'ICE_ONLY') {
      blockers.push(`ICE-only: ${entry.ev_reason || 'Gas powertrain feature'}`);
    }
    const issues = Array.isArray(entry.import_issues) ? entry.import_issues : [];
    if (issues.length > 0) {
      blockers.push('recipe has import issues: needs manual review');
    }
    if (entry.status !== 'APPROVED') {
      blockers.push(entry.status === 'APPLIED' ? 'already marked applied' : `status is ${entry.status} (approve it first)`);
    }

    const hasBaseline = stateMap && Object.keys(stateMap).length > 0;
    if (!hasBaseline) {
      return {
        state: 'NO_BASELINE',
        steps: steps.map((s) => ({
          address: s.address,
          mask: s.mask,
          state: 'NO_BASELINE',
          before: null,
          after: null,
          detail: 'Import your module .abt or Ford .ab file to compute exact before/after bytes'
        })),
        blockers: [...blockers, 'no backup imported yet'],
        can_apply: false
      };
    }

    const rolling = { ...stateMap };
    const results = [];
    for (let i = 0; i < steps.length; i++) {
      const r = evaluateStep(steps[i], rolling);
      results.push({ ...r, mask: steps[i].mask, notes: steps[i].notes || steps[i].feature_name || '' });
      if (r.state === 'READY' && r.after) {
        rolling[r.address] = r.after;
      }
    }

    const stateSet = new Set(results.map((r) => r.state));
    results.forEach((r) => {
      if (r.state === 'ADDRESS_MISSING' || r.state === 'LAYOUT_MISMATCH' || r.state === 'OUT_OF_RANGE') {
        blockers.push(`${r.address}: ${r.state} (${r.detail})`);
      }
    });

    let overall = 'READY';
    if (stateSet.has('ADDRESS_MISSING') || stateSet.has('LAYOUT_MISMATCH') || stateSet.has('OUT_OF_RANGE')) {
      overall = 'BLOCKED';
    } else if (stateSet.has('NEEDS_INPUT')) {
      overall = 'NEEDS_INPUT';
    } else if (stateSet.size === 1 && stateSet.has('ALREADY_SET')) {
      overall = 'ALREADY_SET';
    }

    return {
      state: overall,
      steps: results,
      blockers,
      can_apply: overall === 'READY' && blockers.length === 0
    };
  }

  // --- 5. .abt & .ab Parsers + Byte-Level Differ (abt_parser.py + ab_parser.py) ---
  const RE_DASHED = /^([0-9A-Fa-f]{3})-(\d{2,3})-(\d{2,3})\s+(.+)$/;
  const RE_LEGACY = /^([0-9A-Fa-f]{3})(\d{2})(\d{2})\s+(.+)$/;
  const RE_ENCODED = /^[0-9A-Fa-f]{3}[A-Za-z0-9]{4,}\s+[0-9A-Fa-f]{2}/;
  const RE_PAYLOAD = /^(?:[0-9A-Fa-f]{2,4})(?:\s+[0-9A-Fa-f]{2,4})*$/;

  function detectFormat(text) {
    const raw = String(text || '');
    if (raw.indexOf('\x00') !== -1) return 'binary';
    const lines = raw.split(/\r?\n/);
    let first = '';
    for (let i = 0; i < lines.length; i++) {
      const s = lines[i].trim().replace(/^\uFEFF/, '');
      if (s && !s.startsWith(';')) {
        first = s;
        break;
      }
    }
    if (!first) return 'unknown';
    if (first.startsWith('<')) return 'xml_ab';
    if (RE_DASHED.test(first)) return 'text_dashed';
    if (RE_LEGACY.test(first)) return 'text_legacy';
    if (RE_ENCODED.test(first)) return 'encoded';
    return 'unknown';
  }

  function parseAbtText(text) {
    const fmt = detectFormat(text);
    if (fmt === 'xml_ab') {
      throw new Error('This is a Ford Motorcraft .ab XML file — use the Factory .ab importer or unified importer.');
    }
    if (fmt === 'encoded') {
      throw new Error('Encoded FORScan >=2.3.23 layout detected (e.g. 726G1G1): unsupported until validated against a real truck dump.');
    }
    if (fmt === 'binary') {
      throw new Error('Binary content detected: not a plain-text FORScan .abt file.');
    }

    const problems = [];
    const lines = [];
    const seen = new Set();
    const rawLines = String(text || '').split(/\r?\n/);

    for (let i = 0; i < rawLines.length; i++) {
      const n = i + 1;
      const s = rawLines[i].trim().replace(/^\uFEFF/, '');
      if (!s || s.startsWith(';')) continue;
      const m = RE_DASHED.exec(s) || RE_LEGACY.exec(s);
      if (!m) {
        problems.push(`Line ${n}: unrecognized format '${s.slice(0, 50)}'`);
        continue;
      }
      const module = m[1].toUpperCase();
      const block = parseInt(m[2], 10);
      const line = parseInt(m[3], 10);
      const payloadRaw = m[4].trim();
      if (!RE_PAYLOAD.test(payloadRaw)) {
        problems.push(`Line ${n}: invalid hex payload '${payloadRaw.slice(0, 40)}'`);
        continue;
      }
      const payload = payloadRaw.toUpperCase().split(/\s+/).join(' ');
      const bStr = block < 10 ? `0${block}` : `${block}`;
      const lStr = line < 10 ? `0${line}` : `${line}`;
      const key = `${module}-${bStr}-${lStr}`;
      if (seen.has(key)) {
        problems.push(`Line ${n}: duplicate address ${key}`);
        continue;
      }
      seen.add(key);
      lines.push({ key, module, block, line, payload });
    }

    if (!lines.length && !problems.length) {
      problems.push('File contains no as-built data lines.');
    }
    if (problems.length) {
      throw new Error(problems.slice(0, 4).join('; '));
    }

    const warnings = [];
    lines.forEach((l) => {
      if (!checksumOk(l.module, l.block, l.line, l.payload)) {
        warnings.push(`${l.key}: checksum byte does not match computed value`);
      }
    });

    const dict = {};
    const modulesSet = new Set();
    lines.forEach((l) => {
      dict[l.key] = l.payload;
      modulesSet.add(l.module);
    });

    return {
      kind: 'FORSCAN_BACKUP',
      vin: null,
      lines,
      dict,
      modules: Array.from(modulesSet).sort(),
      nodes: {},
      warnings,
      sha256: sha256Hex(text)
    };
  }

  function parseAbXmlText(xmlText) {
    const raw = String(xmlText || '');
    if (/<!doctype/i.test(raw) || /<!entity/i.test(raw)) {
      throw new Error('XML DTD/ENTITY declarations are rejected for security.');
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'application/xml');
    const parseErr = doc.querySelector('parsererror');
    if (parseErr) {
      throw new Error('Malformed XML in .ab file');
    }
    const root = doc.documentElement;
    if (!root || root.tagName !== 'AS_BUILT_DATA') {
      throw new Error(`Expected <AS_BUILT_DATA> root element, got <${root ? root.tagName : 'none'}>`);
    }
    const veh = root.querySelector('VEHICLE');
    if (!veh) throw new Error('Missing <VEHICLE> element in .ab file');

    const vinEl = veh.querySelector('VIN');
    const vin = vinEl && vinEl.textContent ? vinEl.textContent.trim().toUpperCase() : null;

    const nodes = {};
    veh.querySelectorAll('NODEID').forEach((nodeEl) => {
      let addrText = '';
      nodeEl.childNodes.forEach((cn) => {
        if (cn.nodeType === 3) addrText += cn.nodeValue;
      });
      const addr = addrText.trim().toUpperCase();
      if (/^[0-9A-F]{3}$/.test(addr)) {
        const fcodes = {};
        Array.from(nodeEl.children).forEach((ch) => {
          if (/^F[0-9A-Fa-f]{3}$/.test(ch.tagName)) {
            fcodes[ch.tagName.toUpperCase()] = (ch.textContent || '').trim();
          }
        });
        nodes[addr] = fcodes;
      }
    });

    const lines = [];
    const seen = new Set();
    const problems = [];

    veh.querySelectorAll('DATA').forEach((dataEl) => {
      const label = (dataEl.getAttribute('LABEL') || '').trim().toUpperCase();
      let addr;
      try {
        addr = parseAddress(label);
      } catch (e) {
        problems.push(`Bad <DATA LABEL="${label}">`);
        return;
      }
      const codeEls = Array.from(dataEl.querySelectorAll('CODE'));
      const codes = codeEls.map((c) => (c.textContent || '').trim()).filter(Boolean);
      if (!codes.length || codes.some((c) => !/^[0-9A-Fa-f]{1,4}$/.test(c))) {
        problems.push(`${label}: invalid <CODE> elements`);
        return;
      }
      const payload = codes.map((c) => ('0000' + c.toUpperCase()).slice(-4)).join(' ');
      if (seen.has(addr.key)) {
        problems.push(`Duplicate address ${addr.key}`);
        return;
      }
      seen.add(addr.key);
      lines.push({ key: addr.key, module: addr.module, block: addr.block, line: addr.line, payload });
      if (!nodes[addr.module]) nodes[addr.module] = {};
    });

    if (problems.length) throw new Error(problems.slice(0, 4).join('; '));
    if (!lines.length) throw new Error('Ford .ab XML contains no <DATA> lines.');

    const warnings = [];
    const dict = {};
    const modulesSet = new Set(Object.keys(nodes));
    lines.forEach((l) => {
      dict[l.key] = l.payload;
      modulesSet.add(l.module);
      if (!checksumOk(l.module, l.block, l.line, l.payload)) {
        warnings.push(`${l.key}: checksum mismatch`);
      }
    });

    return {
      kind: 'FORD_AB',
      vin,
      lines,
      dict,
      modules: Array.from(modulesSet).sort(),
      nodes,
      warnings,
      sha256: sha256Hex(raw)
    };
  }

  function parseAnyBackupFile(filename, textContent) {
    const fmt = detectFormat(textContent);
    if (fmt === 'xml_ab' || String(filename || '').toLowerCase().endsWith('.ab')) {
      return parseAbXmlText(textContent);
    }
    return parseAbtText(textContent);
  }

  function diffBackups(beforeMap, afterMap) {
    const bKeys = new Set(Object.keys(beforeMap || {}));
    const aKeys = new Set(Object.keys(afterMap || {}));
    const added = {};
    const removed = {};
    const changed = [];

    Array.from(aKeys).sort().forEach((k) => {
      if (!bKeys.has(k)) added[k] = afterMap[k];
    });
    Array.from(bKeys).sort().forEach((k) => {
      if (!aKeys.has(k)) removed[k] = beforeMap[k];
    });
    Array.from(bKeys).sort().forEach((k) => {
      if (aKeys.has(k) && beforeMap[k] !== afterMap[k]) {
        const bBytes = hexGroupsToBytes(beforeMap[k]).map((v) => ('00' + v.toString(16).toUpperCase()).slice(-2));
        const aBytes = hexGroupsToBytes(afterMap[k]).map((v) => ('00' + v.toString(16).toUpperCase()).slice(-2));
        const maxLen = Math.max(bBytes.length, aBytes.length);
        const bytesDiff = [];
        for (let i = 0; i < maxLen; i++) {
          if (bBytes[i] !== aBytes[i]) {
            bytesDiff.push({ index: i, before: bBytes[i] || null, after: aBytes[i] || null });
          }
        }
        changed.push({ address: k, before: beforeMap[k], after: afterMap[k], bytes: bytesDiff });
      }
    });

    return {
      added,
      removed,
      changed,
      identical: Object.keys(added).length === 0 && Object.keys(removed).length === 0 && changed.length === 0
    };
  }

  function verifySession(beforeMap, afterMap, selectedEntries) {
    const cur = { ...(beforeMap || {}) };
    const problems = [];
    const touched = new Set();

    (selectedEntries || []).forEach((e) => {
      (e.steps || []).forEach((s) => {
        const r = evaluateStep(s, cur);
        if (r.address) touched.add(r.address);
        if ((r.state === 'READY' || r.state === 'ALREADY_SET') && r.after) {
          cur[r.address] = r.state === 'READY' ? r.after : cur[r.address];
        } else {
          problems.push(`${e.title} @ ${r.address}: ${r.state}`);
        }
      });
    });

    if (problems.length) {
      return { ok: false, reason: 'Cannot predict expected post-write state', problems, unexpected: [], missing: [] };
    }

    const missingInAfter = Array.from(touched).filter((k) => !(afterMap && afterMap[k]));
    if (missingInAfter.length) {
      return {
        ok: false,
        reason: 'After-backup is missing one or more modified addresses',
        problems: [],
        unexpected: [],
        missing: missingInAfter.map((a) => ({ address: a, note: 'not present in after-backup' }))
      };
    }

    const scopedExpected = {};
    Object.keys(afterMap || {}).forEach((k) => {
      if (cur[k]) scopedExpected[k] = cur[k];
    });
    const d = diffBackups(scopedExpected, afterMap);
    const unexpected = [
      ...d.changed,
      ...Object.keys(d.added).map((k) => ({ address: k, after: d.added[k], note: 'line only in after-backup' }))
    ];
    const missing = Object.keys(d.removed).map((k) => ({ address: k, expected: d.removed[k], note: 'line missing in after-backup' }));
    const ok = unexpected.length === 0 && missing.length === 0;
    return {
      ok,
      reason: ok ? 'After-backup matches predicted bytes & checksums 100%' : 'After-backup differs from predicted target bytes',
      problems: [],
      unexpected,
      missing
    };
  }

  // --- 6. Deterministic VIN Decoder (vin.py) ---
  const TRANSLIT = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
  };
  const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const YEAR_LETTERS = 'ABCDEFGHJKLMNPRSTVWXY';
  const WMI_MAP = {
    '1FT': 'Ford Motor Company, USA — Trucks (F-Series / Lightning)',
    '1FA': 'Ford Motor Company, USA — Passenger Cars',
    '1FM': 'Ford Motor Company, USA — SUVs / Multi-Purpose',
    '1FD': 'Ford Motor Company, USA — Incomplete Vehicles',
    '1FB': 'Ford Motor Company, USA — Buses'
  };
  const F150_SERIES_MAP = {
    W1E: 'F-150 SuperCrew 4WD (BEV / Lightning Series)',
    W1C: 'F-150 SuperCrew 2WD',
    W1P: 'F-150 SuperCrew 4WD Police / SSV'
  };
  const LIGHTNING_ENGINE_CODES = {
    V: { pack: 'Extended Range (131 kWh usable / ~320 mi EPA)', motors: 'Dual Electric Motors (580 hp / 775 lb-ft)' },
    E: { pack: 'Extended Range (131 kWh usable)', motors: 'Dual Electric Motors (580 hp / 775 lb-ft)' },
    L: { pack: 'Standard Range (98 kWh usable / ~240 mi EPA)', motors: 'Dual Electric Motors (452 hp / 775 lb-ft)' },
    M: { pack: 'Extended Range Platinum / High-Output', motors: 'Dual Electric Motors (580 hp / 775 lb-ft)' },
    7: { pack: 'Extended Range BEV', motors: 'Dual Electric Motors' }
  };
  const PLANT_CODES = {
    W: 'Rouge Electric Vehicle Center (Dearborn, Michigan)',
    F: 'Dearborn Truck Plant (Dearborn, Michigan)',
    K: 'Kansas City Assembly Plant (Claycomo, Missouri)'
  };

  function decodeVinOffline(vinRaw) {
    const vin = String(vinRaw || '').replace(/\s+/g, '').toUpperCase();
    if (vin.length !== 17) {
      return { ok: false, vin, problems: [`VIN must be 17 characters (got ${vin.length})`] };
    }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return { ok: false, vin, problems: ['VIN contains invalid characters (I, O, Q are prohibited by ISO 3779)'] };
    }
    let total = 0;
    for (let i = 0; i < 17; i++) {
      total += (TRANSLIT[vin[i]] || 0) * WEIGHTS[i];
    }
    const rem = total % 11;
    const expectedCheck = rem === 10 ? 'X' : String(rem);
    const actualCheck = vin[8];

    const yChar = vin[9];
    const modern = /[A-Z]/.test(vin[6]);
    let modelYear = null;
    if (/\d/.test(yChar)) {
      const d = parseInt(yChar, 10);
      modelYear = modern ? 2030 + d : 2000 + d;
    } else {
      const idx = YEAR_LETTERS.indexOf(yChar);
      if (idx !== -1) modelYear = 2010 + idx;
    }

    const wmi = vin.slice(0, 3);
    const seriesCode = vin.slice(3, 6);
    const engineCode = vin[7];
    const plantCode = vin[10];
    const engInfo = LIGHTNING_ENGINE_CODES[engineCode] || null;

    return {
      ok: true,
      vin,
      problems: [],
      check_digit: { actual: actualCheck, expected: expectedCheck, valid: actualCheck === expectedCheck },
      wmi,
      wmi_meaning: WMI_MAP[wmi] || 'Unrecognized WMI',
      series_code: seriesCode,
      series_meaning: F150_SERIES_MAP[seriesCode] || `Series ${seriesCode}`,
      engine_code: engineCode,
      inferred_pack: engInfo ? engInfo.pack : null,
      inferred_motors: engInfo ? engInfo.motors : null,
      model_year: modelYear,
      plant_code: plantCode,
      plant_meaning: PLANT_CODES[plantCode] || `Plant code ${plantCode}`,
      serial: vin.slice(11),
      is_ford: Boolean(WMI_MAP[wmi])
    };
  }

  async function decodeVinOnline(vinRaw) {
    const vin = String(vinRaw || '').replace(/\s+/g, '').toUpperCase();
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`NHTSA HTTP ${resp.status}`);
    const data = await resp.json();
    const row = (data && data.Results && data.Results[0]) || {};
    const keep = [
      'Make', 'Model', 'ModelYear', 'Trim', 'Series', 'BodyClass', 'DriveType',
      'ElectrificationLevel', 'BatteryKWh', 'BatteryInfo', 'BatteryType',
      'EVDriveUnit', 'PlantCity', 'PlantCountry', 'VehicleType', 'GVWR'
    ];
    const fields = {};
    keep.forEach((k) => {
      fields[k] = String(row[k] || '').trim();
    });
    const infoLower = fields.BatteryInfo.toLowerCase();
    fields._resolvedPack = infoLower.includes('extended range')
      ? 'Extended Range (131 kWh usable / ~320 mi EPA)'
      : infoLower.includes('standard range')
      ? 'Standard Range (98 kWh usable / ~240 mi EPA)'
      : fields.BatteryInfo || '';
    return { ok: true, source: 'NHTSA vPIC', fields };
  }

  function yearApplies(modelYearsStr, targetYear) {
    if (!modelYearsStr || !targetYear) return null;
    const yr = Number(targetYear);
    const s = String(modelYearsStr);
    const rangeMatches = [...s.matchAll(/(\d{4})\s*(?:-|to|–)\s*(\d{4})/g)];
    const plusMatches = [...s.matchAll(/(\d{4})\s*\+/g)];
    const singleMatches = [...s.matchAll(/\b(19|20)\d{2}\b/g)];
    const ranges = rangeMatches.map((m) => [parseInt(m[1], 10), parseInt(m[2], 10)]);
    plusMatches.forEach((m) => ranges.push([parseInt(m[1], 10), 2100]));
    const singles = singleMatches.map((m) => parseInt(m[0], 10));
    if (ranges.length) {
      return ranges.some(([a, b]) => yr >= a && yr <= b) || singles.includes(yr);
    }
    if (singles.length) {
      return singles.includes(yr);
    }
    return null;
  }

  // --- 7. Synthetic Demo Baseline Generator (For Testing Dry-Run Before Real Truck Import) ---
  function generateDemoAbtText(bundle) {
    const entries = (bundle && bundle.entries) || [];
    const linesMap = {};
    entries.forEach((e) => {
      (e.steps || []).forEach((s) => {
        try {
          const a = parseAddress(s.address);
          if (linesMap[a.key]) return;
          const m = String(s.mask || '').trim();
          if (!m) return;
          // Replace x/*/- with safe baseline zero nibbles (or non-target nibbles so READY shows up)
          const groups = m.split(/\s+/).map((g) =>
            g
              .split('')
              .map((ch) => (ch === '*' ? '0' : ch === '-' ? '0' : '1'))
              .join('')
          );
          const payloadWithCs = withChecksum(a.module, a.block, a.line, groups.join(' '));
          linesMap[a.key] = payloadWithCs;
        } catch (err) {}
      });
    });

    const header = [
      '; =====================================================================',
      '; SYNTHETIC DEMO BASELINE — FOR DRY-RUN UI PREVIEW ONLY',
      '; DO NOT WRITE THIS FILE TO A VEHICLE. Replace with real FORScan .abt!',
      '; ====================================================================='
    ];
    const body = Object.keys(linesMap)
      .sort()
      .map((k) => `${k} ${linesMap[k]}`);
    return header.concat(body).join('\n');
  }

  global.GarageEngine = {
    sha256Hex,
    computeChecksum,
    checksumOk,
    withChecksum,
    parseAddress,
    cleanMask,
    targetPositions,
    evaluateStep,
    readiness,
    detectFormat,
    parseAbtText,
    parseAbXmlText,
    parseAnyBackupFile,
    diffBackups,
    verifySession,
    decodeVinOffline,
    decodeVinOnline,
    yearApplies,
    generateDemoAbtText
  };
})(window);
