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
  function readiness(entry, stateMap, powertrain) {
    const pt = String(powertrain || 'BEV').toUpperCase();
    const steps = Array.isArray(entry.steps) ? entry.steps : [];
    const blockers = [];
    if (entry.tier === 3) {
      blockers.push(`TIER 3 LOCKED: ${entry.tier_reason || 'Safety/Powertrain/ADAS critical'}`);
    }
    if (entry.ev_status === 'ICE_ONLY' && pt === 'BEV') {
      blockers.push(`ICE-only: ${entry.ev_reason || 'Gas/Diesel powertrain feature (blocked on BEV)'}`);
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

  // --- 6. Deterministic VIN Decoder, Powertrain/Platform Resolver & Modulo-11 Optical Repair (vin.py) ---
  const TRANSLIT = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
  };
  const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const YEAR_LETTERS = 'ABCDEFGHJKLMNPRSTVWXY';
  const WMI_MAP = {
    '1FA': 'Ford Motor Company, USA — Passenger Cars (Mustang, Fusion, Focus, Taurus)',
    '1FB': 'Ford Motor Company, USA — Buses / Passenger Vans (Transit Wagon, E-Series)',
    '1FC': 'Ford Motor Company, USA — Stripped Chassis',
    '1FD': 'Ford Motor Company, USA — Incomplete Vehicles (Super Duty Chassis Cab)',
    '1FM': 'Ford Motor Company, USA — SUVs / Multi-Purpose (Explorer, Expedition, Bronco)',
    '1FT': 'Ford Motor Company, USA — Trucks (F-150, F-150 Lightning, Super Duty, Ranger, Transit)',
    '1ZV': 'AutoAlliance International (Ford USA) — Mustang (2005–2014)',
    '1LN': 'Lincoln Motor Company, USA — Passenger Cars (Continental, MKZ)',
    '5LM': 'Lincoln Motor Company, USA — SUVs (Navigator, Aviator, Corsair, MKX)',
    '2FA': 'Ford Motor Company of Canada — Passenger Cars',
    '2FM': 'Ford Motor Company of Canada — SUVs / Crossovers (Edge, Flex)',
    '2FT': 'Ford Motor Company of Canada — Trucks',
    '2LM': 'Lincoln Motor Company of Canada — SUVs (Nautilus, MKX, MKT)',
    '3FA': 'Ford Motor Company, Mexico — Passenger Cars (Fusion, Fiesta)',
    '3FM': 'Ford Motor Company, Mexico — SUVs (Bronco Sport, Mustang Mach-E)',
    '3FT': 'Ford Motor Company, Mexico — Trucks (Maverick, Super Duty)',
    '3LN': 'Lincoln Motor Company, Mexico — Passenger Cars (MKZ)',
    'WF0': 'Ford-Werke GmbH, Germany — European Ford (Focus RS, Transit Connect)',
    'NM0': 'Ford Otosan, Turkey — Transit / Transit Connect',
    'VS6': 'Ford Espana, Spain — Transit Connect',
    '6FP': 'Ford Motor Company of Australia — Ranger / Global Platform'
  };
  const F150_SERIES_MAP = {
    W1E: 'F-150 SuperCrew 4WD (BEV / Lightning / EcoBoost)',
    W1C: 'F-150 SuperCrew 2WD',
    W1P: 'F-150 SuperCrew 4WD Police / SSV',
    W2B: 'F-250 Super Duty 4WD Crew Cab',
    W3B: 'F-350 Super Duty SRW 4WD Crew Cab'
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
    K: 'Kansas City Assembly Plant (Claycomo, Missouri)',
    E: 'Kentucky Truck Plant (Louisville, Kentucky)',
    U: 'Louisville Assembly Plant (Louisville, Kentucky)',
    G: 'Chicago Assembly Plant (Chicago, Illinois)',
    L: 'Michigan Assembly Plant (Wayne, Michigan)',
    R: 'Hermosillo Stamping & Assembly (Hermosillo, Mexico)',
    M: 'Cuautitlan Stamping & Assembly (Cuautitlan, Mexico)',
    B: 'Oakville Assembly Complex (Oakville, Ontario)'
  };

  function normalizeVin(vinRaw) {
    const s = String(vinRaw || '').replace(/[\s\-*]+/g, '').toUpperCase();
    if (s.length === 18 && s.startsWith('I') && /^[A-HJ-NPR-Z0-9]{17}$/.test(s.slice(1))) {
      return s.slice(1);
    }
    return s;
  }

  function computeVinCheckDigit(vin) {
    let total = 0;
    for (let i = 0; i < 17; i++) {
      total += (TRANSLIT[vin[i]] || 0) * WEIGHTS[i];
    }
    const rem = total % 11;
    return rem === 10 ? 'X' : String(rem);
  }

  function inferVehicleFromVin(vin, year) {
    const wmi = vin.slice(0, 3);
    const line = vin.slice(4, 7);
    const eng = vin[7];
    const make = ['1LN', '5LM', '2LM', '3LN'].includes(wmi) ? 'Lincoln' : 'Ford';
    let model = null;
    let powertrain = null;
    let batteryOrEngine = null;

    if (wmi === '1FT' || wmi === '2FT') {
      if (['W1E', 'F1E', 'W1P', 'X1E', 'W1C', 'F1C', 'W1R'].includes(line)) {
        if (['V', 'L', '7', 'M'].includes(eng) && (year || 2023) >= 2022 && line === 'W1E') {
          model = 'F-150 Lightning';
          powertrain = 'BEV';
          batteryOrEngine = ['V', '7'].includes(eng) ? 'Extended Range (131 kWh)' : 'Standard Range (98 kWh)';
        } else {
          model = 'F-150';
        }
      } else if (/^(W2|W3|W4|X2|X3|F2|F3)/.test(line)) {
        model = line.includes('2') ? 'F-250 Super Duty' : line.includes('3') ? 'F-350 Super Duty' : 'F-450 Super Duty';
      } else if (/^(R1|R4)/.test(line)) {
        model = 'Ranger';
      } else if (/^(BW|YR|NE)/.test(line)) {
        model = 'Transit';
      }
    } else if (wmi === '1FD') {
      model = 'Super Duty Chassis Cab';
    } else if (wmi === '3FT') {
      if (/^(W8|F8)/.test(line)) model = 'Maverick';
      else if (/^(W2|W3|W4)/.test(line)) model = 'Super Duty';
    } else if (wmi === '1FM') {
      if (/^E[0-9]/.test(line)) model = 'Bronco';
      else if (/^(K7|K8|5K)/.test(line)) model = 'Explorer';
      else if (/^(JU|JK)/.test(line)) model = 'Expedition';
    } else if (wmi === '3FM') {
      if (line.startsWith('CR') || line.startsWith('R')) model = 'Bronco Sport';
      else if (line.startsWith('TK') || line.startsWith('K')) {
        model = 'Mustang Mach-E';
        powertrain = 'BEV';
      }
    } else if (wmi === '1FA' || wmi === '1ZV') {
      if (/^(P8|T8)/.test(line)) model = 'Mustang';
      else if (/^(P0|6P)/.test(line)) model = 'Fusion';
      else if (/^(DP|P3)/.test(line)) model = 'Focus';
    } else if (wmi === '3FA') {
      model = 'Fusion';
    } else if (wmi === '5LM') {
      model = line.startsWith('JJ') ? 'Navigator' : line.startsWith('5J') ? 'Aviator' : 'Corsair';
    } else if (wmi === '2FM') {
      model = 'Edge';
    } else if (wmi === '2LM') {
      model = 'Nautilus';
    } else if (wmi === 'WF0') {
      model = 'Focus RS';
    } else if (wmi === 'NM0' || wmi === 'VS6') {
      model = 'Transit Connect';
    } else if (wmi === '6FP') {
      model = 'Ranger';
    }
    return { make, model, powertrain, battery_or_engine: batteryOrEngine };
  }

  function classifyPowertrain(offline, online, model, batteryOrEngine) {
    let m = String(model || '').toLowerCase();
    const be = String(batteryOrEngine || '').toLowerCase();
    if (online && online.ok && online.fields) {
      const f = online.fields;
      const elec = String(f.ElectrificationLevel || '').toUpperCase();
      const fuel1 = String(f.FuelTypePrimary || '').toUpperCase();
      const fuel2 = String(f.FuelTypeSecondary || '').toUpperCase();
      if (elec.includes('BEV') || elec.includes('BATTERY ELECTRIC') || (fuel1 === 'ELECTRIC' && !fuel2)) return 'BEV';
      if (elec.includes('PHEV') || elec.includes('PLUG-IN') || (fuel1 === 'ELECTRIC' && fuel2)) return 'PHEV';
      if (elec.includes('HEV') || elec.includes('HYBRID') || fuel2 === 'ELECTRIC') return 'HEV';
      if (fuel1.includes('DIESEL') || String(f.DisplacementL || '').includes('6.7')) return 'ICE_DIESEL';
      if (fuel1.includes('GASOLINE') || fuel1.includes('FLEX')) return 'ICE_GAS';
      m = m || String(f.Model || '').toLowerCase();
    }
    if (m.includes('lightning') || m.includes('mach-e') || m.includes('e-transit') || be.includes('bev') || be.includes('extended range') || be.includes('standard range')) return 'BEV';
    if (m.includes('phev') || m.includes('energi') || be.includes('plug-in')) return 'PHEV';
    if (m.includes('hybrid') || m.includes('powerboost') || be.includes('hev') || be.includes('powerboost')) return 'HEV';
    if (m.includes('diesel') || be.includes('power stroke') || be.includes('6.7l') || be.includes('diesel')) return 'ICE_DIESEL';
    if (offline && offline.inferred && offline.inferred.powertrain) return offline.inferred.powertrain;
    return 'ICE_GAS';
  }

  function resolvePlatformSlug(model, modelYear, vin, make) {
    let m = String(model || '').toLowerCase().trim();
    let mk = String(make || '').toLowerCase().trim();
    const yr = Number(modelYear) || 2023;
    if (!m && vin && String(vin).length >= 8) {
      const inf = inferVehicleFromVin(normalizeVin(vin), yr);
      m = String(inf.model || '').toLowerCase();
      mk = mk || String(inf.make || '').toLowerCase();
    }
    if (m.includes('lightning') || ((m.includes('f-150') || m.includes('f150') || m.includes('raptor')) && yr >= 2021)) return 'f150_14g';
    if ((m.includes('f-150') || m.includes('f150') || m.includes('raptor')) && yr >= 2015 && yr <= 2020) return 'f150_13g';
    if ((m.includes('f-150') || m.includes('f150') || m.includes('raptor')) && yr <= 2014) return 'f150_12g';
    if (['super duty', 'f-250', 'f-350', 'f-450', 'f-550', 'f250', 'f350', 'f450'].some((x) => m.includes(x))) {
      if (yr >= 2023) return 'super_duty_23';
      if (yr >= 2017) return 'super_duty_17_22';
      return 'super_duty_11_16';
    }
    if (m.includes('bronco sport') || m.includes('corsair') || m.includes('escape')) return 'bronco_sport';
    if (m.includes('bronco')) return 'bronco_6g';
    if (m.includes('ranger')) return yr >= 2024 ? 'ranger_6g' : 'ranger_5g';
    if (m.includes('maverick')) return 'maverick';
    if (m.includes('mach-e') || m.includes('mach e')) return 'mach_e';
    if (m.includes('mustang')) return yr >= 2024 ? 'mustang_s650' : 'mustang_s550';
    if (m.includes('explorer') || m.includes('aviator')) return yr >= 2020 ? 'explorer_6g' : 'explorer_5g';
    if (m.includes('expedition') || m.includes('navigator')) return 'expedition';
    if (m.includes('fusion') || m.includes('mkz') || m.includes('continental')) return 'fusion_2g';
    if (m.includes('focus') || m.includes('fiesta')) return 'focus_st_rs';
    if (m.includes('transit') || m.includes('e-series')) return 'transit';
    if (m.includes('edge') || m.includes('nautilus') || m.includes('mkx') || m.includes('mkt') || m.includes('flex') || m.includes('taurus') || mk === 'lincoln') return 'ford_generic';
    return yr >= 2021 ? 'f150_14g' : 'ford_generic';
  }

  function decodeVinOffline(vinRaw) {
    const vin = normalizeVin(vinRaw);
    if (vin.length !== 17) {
      return { ok: false, vin, problems: [`VIN must be 17 characters (got ${vin.length})`] };
    }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return { ok: false, vin, problems: ['VIN contains invalid characters (I, O, Q are prohibited by ISO 3779)'] };
    }
    const expectedCheck = computeVinCheckDigit(vin);
    const actualCheck = vin[8];

    const yChar = vin[9];
    const modern = /[A-Z]/.test(vin[6]);
    let modelYearCandidates = [];
    if (/\d/.test(yChar)) {
      const d = parseInt(yChar, 10);
      if (d !== 0) {
        modelYearCandidates = modern ? [2030 + d] : [1980 + d, 2000 + d];
      }
    } else {
      const idx = YEAR_LETTERS.indexOf(yChar);
      if (idx !== -1) {
        modelYearCandidates = modern ? [2010 + idx] : [1980 + idx, 2010 + idx];
      }
    }
    const modelYear = modelYearCandidates.length === 1 ? modelYearCandidates[0] : null;

    const wmi = vin.slice(0, 3);
    const seriesCode = vin.slice(4, 7);
    const engineCode = vin[7];
    const plantCode = vin[10];
    const inferred = inferVehicleFromVin(vin, modelYear);
    const isLightning = inferred.model === 'F-150 Lightning';
    const engInfo = isLightning ? (LIGHTNING_ENGINE_CODES[engineCode] || null) : null;
    const platformSlug = resolvePlatformSlug(inferred.model, modelYear, vin, inferred.make);

    return {
      ok: true,
      vin,
      problems: [],
      check_digit: { actual: actualCheck, expected: expectedCheck, valid: actualCheck === expectedCheck },
      wmi,
      wmi_meaning: WMI_MAP[wmi] || 'Unrecognized WMI',
      series_code: seriesCode,
      series_meaning: F150_SERIES_MAP[seriesCode] || (inferred.model ? `${inferred.make} ${inferred.model}` : `Series ${seriesCode}`),
      engine_code: engineCode,
      inferred_pack: engInfo ? engInfo.pack : inferred.battery_or_engine,
      inferred_motors: engInfo ? engInfo.motors : null,
      inferred,
      platform_slug: platformSlug,
      model_year_candidates: modelYearCandidates,
      model_year: modelYear,
      plant_code: plantCode,
      plant_meaning: PLANT_CODES[plantCode] || `Plant code ${plantCode}`,
      serial: vin.slice(11),
      is_ford: Boolean(WMI_MAP[wmi])
    };
  }

  async function decodeVinOnline(vinRaw) {
    const vin = normalizeVin(vinRaw);
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`NHTSA HTTP ${resp.status}`);
    const data = await resp.json();
    const row = (data && data.Results && data.Results[0]) || {};
    const keep = [
      'Make', 'Model', 'ModelYear', 'Trim', 'Series', 'BodyClass', 'BodyCabType', 'DriveType',
      'ElectrificationLevel', 'BatteryKWh', 'BatteryInfo', 'BatteryType', 'EVDriveUnit',
      'FuelTypePrimary', 'FuelTypeSecondary', 'DisplacementL', 'EngineCylinders', 'EngineModel',
      'PlantCity', 'PlantCountry', 'VehicleType', 'GVWR'
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
      : fields.BatteryInfo || (fields.DisplacementL ? `${fields.DisplacementL}L ${fields.EngineModel || ''} ${fields.FuelTypePrimary || ''}`.trim() : '');
    const yr = /^\d+$/.test(fields.ModelYear) ? parseInt(fields.ModelYear, 10) : null;
    const powertrain = classifyPowertrain(null, { ok: true, fields }, fields.Model, fields._resolvedPack);
    const platformSlug = resolvePlatformSlug(fields.Model, yr, vin, fields.Make);
    return { ok: true, source: 'NHTSA vPIC', fields, powertrain, platform_slug: platformSlug };
  }

  // Deterministic Optical Confusable Repair against ISO 3779 Position 9 Modulo-11 Check Digit
  const ILLEGAL_MAP = { I: '1', O: '0', Q: '0' };
  const CONFUSABLES = {
    0: ['0', 'D', 'C', 'U'],
    D: ['D', '0'],
    1: ['1', 'L', 'T', 'J'],
    L: ['L', '1'],
    2: ['2', 'Z'],
    Z: ['Z', '2'],
    4: ['4', 'A'],
    A: ['A', '4'],
    5: ['5', 'S'],
    S: ['S', '5'],
    6: ['6', 'G', 'B'],
    G: ['G', '6'],
    8: ['8', 'B'],
    B: ['B', '8'],
    U: ['U', 'V', '0'],
    V: ['V', 'U', 'Y']
  };

  function repairAndValidateVinCandidates(rawText, maxEdits = 2) {
    if (!rawText) return { ok: false, best: null, candidates: [] };
    const cleaned = String(rawText).toUpperCase().replace(/[^A-Z0-9\s\-*]/g, '');
    const tokens = cleaned.replace(/[\s\-*]+/g, ' ').match(/[A-Z0-9]{15,20}/g) || [];
    const compact = String(rawText).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (compact.length >= 17) {
      for (let i = 0; i <= Math.max(0, compact.length - 17); i++) {
        const chunk18 = compact.slice(i, i + 18);
        if (chunk18.length === 18 && chunk18.startsWith('I')) tokens.push(chunk18.slice(1));
        tokens.push(compact.slice(i, i + 17));
      }
    }

    const windows = [];
    const seen = new Set();
    tokens.forEach((t) => {
      let norm = normalizeVin(t);
      if (norm.length === 18 && norm.startsWith('I')) norm = norm.slice(1);
      if (norm.length >= 17) {
        for (let i = 0; i <= norm.length - 17; i++) {
          const w = norm.slice(i, i + 17);
          if (!seen.has(w)) {
            seen.add(w);
            windows.push(w);
          }
        }
      }
    });

    const validMap = {};
    function scoreAndRecord(cand, edits, orig) {
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cand)) return;
      if (computeVinCheckDigit(cand) !== cand[8]) return;
      const isFord = Boolean(WMI_MAP[cand.slice(0, 3)]);
      const dec = decodeVinOffline(cand);
      const yrOk = (dec.model_year_candidates || []).some((y) => y >= 2005 && y <= 2030);
      const score = (isFord ? 100 : 40) + (yrOk ? 20 : 0) - edits * 15;
      if (!validMap[cand] || score > validMap[cand].score) {
        validMap[cand] = {
          vin: cand,
          score,
          edits,
          repaired_from: cand !== orig ? orig : null,
          is_ford: isFord,
          wmi_meaning: dec.wmi_meaning,
          model_year: dec.model_year,
          inferred: dec.inferred,
          platform_slug: dec.platform_slug
        };
      }
    }

    windows.slice(0, 12).forEach((w) => {
      let illegalFixes = 0;
      const baseChars = w.split('').map((c) => {
        if (ILLEGAL_MAP[c]) {
          illegalFixes++;
          return ILLEGAL_MAP[c];
        }
        return c;
      });
      const base = baseChars.join('');
      scoreAndRecord(base, illegalFixes, w);
      if (maxEdits <= 0) return;

      const mutPos = [];
      for (let i = 0; i < 17; i++) {
        if (CONFUSABLES[base[i]] && CONFUSABLES[base[i]].length > 1) mutPos.push(i);
      }
      mutPos.forEach((p1) => {
        CONFUSABLES[base[p1]].slice(1).forEach((a1) => {
          const c1 = base.slice(0, p1) + a1 + base.slice(p1 + 1);
          scoreAndRecord(c1, illegalFixes + 1, w);
        });
      });

      if (maxEdits >= 2 && mutPos.length <= 10) {
        for (let i = 0; i < mutPos.length; i++) {
          for (let j = i + 1; j < mutPos.length; j++) {
            const p1 = mutPos[i];
            const p2 = mutPos[j];
            CONFUSABLES[base[p1]].slice(1).forEach((a1) => {
              CONFUSABLES[base[p2]].slice(1).forEach((a2) => {
                const c2 = base.slice(0, p1) + a1 + base.slice(p1 + 1, p2) + a2 + base.slice(p2 + 1);
                scoreAndRecord(c2, illegalFixes + 2, w);
              });
            });
          }
        }
      }
    });

    const ranked = Object.values(validMap).sort((a, b) => b.score - a.score || a.edits - b.edits || a.vin.localeCompare(b.vin));
    return {
      ok: ranked.length > 0,
      best: ranked[0] || null,
      candidates: ranked.slice(0, 8)
    };
  }

  function buildCustomModEntry(params) {
    const title = String(params.title || '').trim();
    if (!title) throw new Error('Feature title is required');
    const addr = parseAddress(params.address);
    const stars = targetPositions(params.mask);
    const hexClean = String(params.targetHex || '').replace(/\s+/g, '').toUpperCase();
    if (!hexClean || !/^[0-9A-F]+$/.test(hexClean)) {
      throw new Error('Target hex must contain 1+ hexadecimal digits (0-9, A-F)');
    }
    if (hexClean.length !== 1 && hexClean.length !== stars.length) {
      throw new Error(`Mask has ${stars.length} '*' target nibble(s), but Target Hex has ${hexClean.length} digit(s)`);
    }
    const ops = stars.map((pos, idx) => ({
      pos,
      kind: 'set',
      hex: hexClean.length === 1 ? hexClean[0] : hexClean[idx],
      raw: hexClean.length === 1 ? hexClean[0] : hexClean[idx]
    }));
    const modName = String(params.module || addr.module).trim().toUpperCase();
    const id = params.id || Date.now();
    return {
      id,
      source_key: `custom:${id}`,
      title,
      raw_title: title,
      category: params.category || 'Custom Spreadsheet Mod',
      platform: params.platform || 'Custom',
      platform_slug: params.platformSlug || 'f150',
      model_years: `${params.modelYear || 2021}+`,
      trim_claimed: 'All',
      upstream_validated: 0,
      source_sheet: 'Custom Spreadsheet Line',
      source_url: 'https://forscan.org/forum/',
      source_confidence: 'custom-spreadsheet',
      is_custom: true,
      notes: params.notes || '',
      warnings: params.warnings || '',
      forscan_menu: params.forscanMenu || '',
      steps: [
        {
          module: modName,
          address: addr.key,
          mask: String(params.mask).trim(),
          ops,
          feature_name: title,
          notes: params.notes || ''
        }
      ],
      import_issues: [],
      system: modName,
      system_name: `${modName} Custom`,
      tier: ['760', '730', '7E0', '7E7', '746', '716', '706'].includes(addr.module) ? 3 : 1,
      tier_reason: 'User custom spreadsheet entry',
      ev_status: 'ALL_ POWERTRAINS',
      ev_reason: 'User custom entry',
      popularity: 2,
      popularity_reason: 'Custom spreadsheet line',
      status: 'APPROVED',
      wanted: 1,
      verified_on_my_truck: 0,
      user_notes: params.notes || ''
    };
  }

  function adapterGuidance(modelYear, platformSlug) {
    const yr = Number(modelYear) || 2023;
    const slug = String(platformSlug || '').toLowerCase();
    const msCan = yr <= 2020 || ['13g', '12g', '17_22', '11_16', '5g', 's550', 'fusion', 'focus'].some((k) => slug.includes(k));
    const arch = yr <= 2014 || ['12g', '11_16', 'focus', 'fusion', 'explorer_5g'].some((k) => slug.includes(k))
      ? 'CGEA 1.2 (HS-CAN 500k + MS-CAN 125k)'
      : msCan
      ? 'CGEA 1.3 (HS-CAN1/2 500k + MS-CAN 125k)'
      : 'CGEA 1.3 / FNV2 (HS-CAN1/2/3/4 500k + CAN-FD)';
    return {
      architecture: arch,
      ms_can_required: msCan,
      hs_can_command: 'STP31',
      ms_can_command: msCan ? 'STP33' : null,
      note: msCan
        ? '2011–2020 vehicles place DDM (740), PDM (741), HVAC (733), and TRM (791) on 125 kbaud MS-CAN (pins 3 & 11). OBDLink EX switches automatically via STP33.'
        : '2021+ vehicles route all modules via Central Gateway (716 GWM) on 500 kbaud HS-CAN.'
    };
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
    normalizeVin,
    computeVinCheckDigit,
    inferVehicleFromVin,
    classifyPowertrain,
    resolvePlatformSlug,
    decodeVinOffline,
    decodeVinOnline,
    repairAndValidateVinCandidates,
    buildCustomModEntry,
    adapterGuidance,
    yearApplies,
    generateDemoAbtText
  };
})(window);
