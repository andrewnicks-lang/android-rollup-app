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

  function addrSortCmp(a, b) {
    const pa = String(a || '').toUpperCase().split('-');
    const pb = String(b || '').toUpperCase().split('-');
    if (pa.length === 3 && pb.length === 3 && /^\d+$/.test(pa[1]) && /^\d+$/.test(pa[2]) && /^\d+$/.test(pb[1]) && /^\d+$/.test(pb[2])) {
      if (pa[0] !== pb[0]) return pa[0] < pb[0] ? -1 : 1;
      const ba = parseInt(pa[1], 10), bb = parseInt(pb[1], 10);
      if (ba !== bb) return ba - bb;
      return parseInt(pa[2], 10) - parseInt(pb[2], 10);
    }
    return String(a || '').localeCompare(String(b || ''));
  }

  function normalizeStep(step) {
    if (!step || typeof step !== 'object') return { ops: [] };
    if (Array.isArray(step.ops) && step.ops.length > 0) return step;
    const mask = String(step.mask || '');
    const addrS = String(step.address || '');
    let stars;
    try {
      parseAddress(addrS);
      stars = targetPositions(mask);
    } catch (e) {
      return {
        ...step,
        ops: [{ kind: 'manual', pos: null, text: step.community_instruction || step.notes || 'see source' }]
      };
    }
    if (step.type === 'continuous') {
      return {
        ...step,
        ops: [{ kind: 'manual', pos: stars, text: step.instruction || step.notes || 'enter value', unit: step.unit, continuous: true }]
      };
    }
    const entries = Array.isArray(step.nibbles) && step.nibbles.length > 0 ? step.nibbles : [step];
    const ops = [];
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i] || {};
      let pos = e.nibble !== undefined && e.nibble !== null ? Number(e.nibble) : (stars.length === 1 ? stars[0] : null);
      const text = e.community_instruction || e.instruction || e.notes || step.notes || 'see source';
      if (pos === null || Number.isNaN(pos) || !stars.includes(pos)) {
        ops.push({ kind: 'manual', pos: null, text });
        continue;
      }
      const hexv = typeof e.recommended_hex === 'string' ? e.recommended_hex.trim().toUpperCase() : '';
      let bitsMap = null;
      let rawBits = e.bits;
      if (!rawBits && e.bit !== undefined && e.action !== undefined) {
        rawBits = [{ bit: e.bit, action: e.action }];
      }
      if (Array.isArray(rawBits) && rawBits.length > 0) {
        bitsMap = {};
        let okBits = true;
        for (let b = 0; b < rawBits.length; b++) {
          const bit = Number(rawBits[b].bit), act = Number(rawBits[b].action);
          if (![0, 1, 2, 3].includes(bit) || ![0, 1].includes(act) || (bitsMap[bit] !== undefined && bitsMap[bit] !== act)) {
            okBits = false;
            break;
          }
          bitsMap[bit] = act;
        }
        if (!okBits) bitsMap = null;
      }
      let delta = null;
      if (e.hex_offset !== undefined && e.hex_offset !== null) {
        const ds = String(e.hex_offset).trim();
        if (/^[+-]?\d+$/.test(ds)) delta = parseInt(ds, 10);
      }
      if (hexv.length === 1 && HEX.includes(hexv)) {
        ops.push({ kind: 'set', pos, hex: hexv });
      } else if (bitsMap) {
        ops.push({ kind: 'bits', pos, bits: bitsMap });
      } else if (delta !== null) {
        ops.push({ kind: 'offset', pos, delta });
      } else {
        ops.push({ kind: 'manual', pos, text });
      }
    }
    return { ...step, ops };
  }

  function evaluateStep(step, stateMap) {
    let addr;
    try {
      addr = parseAddress(step.address);
    } catch (e) {
      return { address: (step && step.address) || '?', state: 'LAYOUT_MISMATCH', before: null, after: null, detail: e.message };
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

    const normStep = Array.isArray(step.ops) && step.ops.length > 0 ? step : normalizeStep(step);
    const ops = Array.isArray(normStep.ops) ? normStep.ops : [];
    if (!ops.length) {
      return { address: addr.key, state: 'NEEDS_INPUT', before: payload, after: null, detail: 'step specifies no target operations' };
    }

    const digits = rawDigits.split('');
    const states = [];
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

  // --- 5. .abt & .ab Parsers, FORScan >= 2.3.23 G0 Codec + Differ (abt_parser.py + ab_parser.py) ---
  const RE_DASHED = /^([0-9A-Fa-f]{3})-(\d{2,3})-(\d{2,3})\s+(.+)$/;
  const RE_LEGACY = /^([0-9A-Fa-f]{3})(\d{2})(\d{2})\s+(.+)$/;
  const RE_LEGACY_COMPACT = /^([0-9A-Fa-f]{3})(\d{2})(\d{2})([0-9A-Fa-f]{4,})$/;
  const RE_ENCODED_COMPACT = /^([0-9A-Fa-f]{3})([G-Vg-v][0-9A-Fa-f])([G-Vg-v][0-9A-Fa-f])([0-9A-Fa-f]{4,})$/;
  const RE_ENCODED_SPACED = /^([0-9A-Fa-f]{3})([G-Vg-v][0-9A-Fa-f])([G-Vg-v][0-9A-Fa-f])\s+(.+)$/;
  const RE_ENCODED_HINT = /^[0-9A-Fa-f]{3}[A-Za-z0-9]{4,}(?:\s+[0-9A-Fa-f]{2}|[0-9A-Fa-f]{2,}$)/;
  const RE_BLOCK_COMMENT = /^;\s*block\s+(\d+)\s*$/i;
  const RE_PAYLOAD = /^(?:[0-9A-Fa-f]{2,4})(?:\s+[0-9A-Fa-f]{2,4})*$/;

  function encodeG0Byte(val) {
    const v = Number(val);
    if (!Number.isInteger(v) || v < 0 || v > 255) {
      throw new Error(`G0-encoded index out of range 0..255: ${val}`);
    }
    return String.fromCharCode('G'.charCodeAt(0) + (v >> 4)) + HEX[v & 0x0f];
  }

  function decodeG0Pair(pair) {
    const s = String(pair || '').toUpperCase();
    if (s.length !== 2) throw new Error(`G0 token must be 2 chars: ${pair}`);
    const hi = s.charCodeAt(0) - 'G'.charCodeAt(0);
    const lo = HEX.indexOf(s[1]);
    if (hi < 0 || hi > 15 || lo < 0) throw new Error(`Invalid FORScan G0 token: ${pair}`);
    return (hi << 4) | lo;
  }

  function groupHexPayload(hexDigits) {
    const h = String(hexDigits || '').replace(/\s+/g, '').toUpperCase();
    if (h.length < 4 || h.length % 2 !== 0 || !/^[0-9A-F]+$/.test(h)) {
      throw new Error(`Invalid contiguous hex payload: ${String(hexDigits).slice(0, 40)}`);
    }
    const out = [];
    for (let i = 0; i < h.length; i += 4) {
      out.push(h.slice(i, i + 4));
    }
    return out.join(' ');
  }

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
    if (RE_LEGACY.test(first) || RE_LEGACY_COMPACT.test(first)) return 'text_legacy';
    if (RE_ENCODED_COMPACT.test(first) || RE_ENCODED_SPACED.test(first) || RE_ENCODED_HINT.test(first)) return 'encoded';
    return 'unknown';
  }

  function parseAbtText(text) {
    const fmt = detectFormat(text);
    if (fmt === 'xml_ab') {
      throw new Error('This is a Ford Motorcraft .ab XML file — use the Factory .ab importer or unified importer.');
    }
    if (fmt === 'binary') {
      throw new Error('Binary content detected: not a plain-text FORScan .abt file.');
    }

    const problems = [];
    const commentWarnings = [];
    const lines = [];
    const seen = new Set();
    const rawLines = String(text || '').split(/\r?\n/);
    let commentBlock = null;

    for (let i = 0; i < rawLines.length; i++) {
      const n = i + 1;
      const s = rawLines[i].trim().replace(/^\uFEFF/, '');
      if (!s) continue;
      if (s.startsWith(';')) {
        const bm = RE_BLOCK_COMMENT.exec(s);
        if (bm) commentBlock = parseInt(bm[1], 10);
        continue;
      }

      let module = '';
      let block = 0;
      let line = 0;
      let payload = '';

      const mStd = RE_DASHED.exec(s) || RE_LEGACY.exec(s);
      if (mStd) {
        module = mStd[1].toUpperCase();
        block = parseInt(mStd[2], 10);
        line = parseInt(mStd[3], 10);
        const payloadRaw = mStd[4].trim();
        if (!RE_PAYLOAD.test(payloadRaw)) {
          problems.push(`Line ${n}: invalid hex payload '${payloadRaw.slice(0, 40)}'`);
          continue;
        }
        payload = payloadRaw.toUpperCase().split(/\s+/).join(' ');
      } else {
        const mEnc = RE_ENCODED_COMPACT.exec(s);
        const mLegC = mEnc ? null : RE_LEGACY_COMPACT.exec(s);
        const mEncSp = !mEnc && !mLegC ? RE_ENCODED_SPACED.exec(s) : null;

        if (mEnc && mEnc[4].length % 2 === 0) {
          module = mEnc[1].toUpperCase();
          block = decodeG0Pair(mEnc[2]);
          line = decodeG0Pair(mEnc[3]);
          payload = groupHexPayload(mEnc[4]);
        } else if (mLegC && mLegC[4].length % 2 === 0) {
          module = mLegC[1].toUpperCase();
          block = parseInt(mLegC[2], 10);
          line = parseInt(mLegC[3], 10);
          payload = groupHexPayload(mLegC[4]);
        } else if (mEncSp) {
          module = mEncSp[1].toUpperCase();
          block = decodeG0Pair(mEncSp[2]);
          line = decodeG0Pair(mEncSp[3]);
          const rawPay = mEncSp[4].trim();
          if (!RE_PAYLOAD.test(rawPay)) {
            problems.push(`Line ${n}: invalid hex payload '${rawPay.slice(0, 40)}'`);
            continue;
          }
          payload = rawPay.toUpperCase().split(/\s+/).join(' ');
        } else {
          problems.push(`Line ${n}: unrecognized format '${s.slice(0, 50)}'`);
          continue;
        }
      }

      if (block < 1 || line < 1) {
        problems.push(`Line ${n}: block/line indices must be >= 1`);
        continue;
      }
      const bStr = block < 10 ? `0${block}` : `${block}`;
      const lStr = line < 10 ? `0${line}` : `${line}`;
      const key = `${module}-${bStr}-${lStr}`;
      if (commentBlock !== null && commentBlock !== block) {
        commentWarnings.push(`Line ${n} (${key}): ;Block ${commentBlock} disagrees with decoded block ${block}`);
      }
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

    const warnings = commentWarnings.slice();
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

    Array.from(aKeys).sort(addrSortCmp).forEach((k) => {
      if (!bKeys.has(k)) added[k] = afterMap[k];
    });
    Array.from(bKeys).sort(addrSortCmp).forEach((k) => {
      if (!aKeys.has(k)) removed[k] = beforeMap[k];
    });
    Array.from(bKeys).sort(addrSortCmp).forEach((k) => {
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
    1: ['1', '7', 'L', 'T', 'J'],
    7: ['7', '1'],
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

  function looksLikeWmiPrefix(w) {
    if (!w || w.length < 3) return false;
    const p = w
      .slice(0, 3)
      .split('')
      .map((c) => ILLEGAL_MAP[c] || c)
      .join('');
    if (WMI_MAP[p]) return true;
    const a0s = CONFUSABLES[p[0]] || [p[0]];
    const a1s = CONFUSABLES[p[1]] || [p[1]];
    const a2s = CONFUSABLES[p[2]] || [p[2]];
    for (let i = 0; i < a0s.length; i++) {
      for (let j = 0; j < a1s.length; j++) {
        for (let k = 0; k < a2s.length; k++) {
          if (WMI_MAP[a0s[i] + a1s[j] + a2s[k]]) return true;
        }
      }
    }
    return false;
  }

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

    windows.sort((a, b) => (looksLikeWmiPrefix(a) ? 0 : 1) - (looksLikeWmiPrefix(b) ? 0 : 1));

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

    windows.slice(0, 48).forEach((w) => {
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

      if (maxEdits >= 2 && mutPos.length <= 12) {
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
      : 'FNV2 / CGEA 1.3+ (Primary DIAG1 500k pins 6&14 + Secondary DIAG2 500k pins 3&11 via GWM 716)';
    return {
      architecture: arch,
      ms_can_required: msCan,
      dual_500k_can: !msCan,
      hs_can_command: 'STP33',
      hs_diag2_command: !msCan ? 'STP53' : null,
      hs_diag2_baud_command: !msCan ? 'STPBR500000' : null,
      ms_can_command: msCan ? 'STP53 + STPBR125000' : null,
      ms_can_baud_command: msCan ? 'STPBR125000' : null,
      min_safe_voltage: 12.5,
      note: msCan
        ? '2011–2020 vehicles place DDM (740), PDM (741), HVAC (733), and TRM (791) on 125 kbaud MS-CAN (pins 3 & 11). OBDLink EX switches automatically via STP53 + STPBR125000.'
        : '2021+ Gen14 F-150 Lightning & FNV2 vehicles expose Primary Diagnostic CAN (500k, pins 6 & 14, STP33) and Secondary Diagnostic CAN DIAG2 (500k, pins 3 & 11, STP53 + STPBR500000) for IPMA (706), CMR (7C4), DDM (740), PDM (741), and PSCM (730).'
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
      .sort(addrSortCmp)
      .map((k) => `${k} ${linesMap[k]}`);
    return header.concat(body).join('\n');
  }

  // --- 8. FORScan 'Load All' .abt Exporter + F188 Stale Guard + USB-C OTG UDS Engine ---
  function exportAbtText(linesMap, options = {}, headerCommentsArg = null) {
    const opts =
      typeof options === 'string'
        ? { fmt: options, headerComments: Array.isArray(headerCommentsArg) ? headerCommentsArg : [] }
        : options || {};
    const fmt = opts.fmt || 'encoded';
    if (!['encoded', 'dashed', 'legacy'].includes(fmt)) {
      throw new Error(`Unsupported .abt export format: ${fmt}`);
    }
    const modWant = opts.moduleFilter ? String(opts.moduleFilter).trim().toUpperCase() : null;
    const items = [];
    Object.keys(linesMap || {}).forEach((k) => {
      const parts = String(k).trim().toUpperCase().split('-');
      if (parts.length !== 3) throw new Error(`Invalid normalized address key: ${k}`);
      const mod = parts[0];
      const blk = parseInt(parts[1], 10);
      const ln = parseInt(parts[2], 10);
      if (modWant && mod !== modWant) return;
      items.push({ mod, blk, ln, grouped: groupHexPayload(linesMap[k]) });
    });
    if (!items.length) throw new Error('No As-Built lines matched for .abt export');

    items.sort((a, b) => (a.mod !== b.mod ? a.mod.localeCompare(b.mod) : a.blk !== b.blk ? a.blk - b.blk : a.ln - b.ln));
    const out = [];
    const hdrs = opts.headerComments || (Array.isArray(headerCommentsArg) ? headerCommentsArg : []);
    hdrs.forEach((c) => {
      const clean = String(c).replace(/[\r\n]+/g, ' ').trim();
      out.push(clean.startsWith(';') ? clean : `; ${clean}`);
    });
    let lastKey = '';
    items.forEach((it) => {
      const mk = `${it.mod}:${it.blk}`;
      if (mk !== lastKey) {
        out.push(`;Block ${it.blk}`);
        lastKey = mk;
      }
      const compactPay = it.grouped.replace(/\s+/g, '');
      const b2 = it.blk < 10 ? `0${it.blk}` : `${it.blk}`;
      const l2 = it.ln < 10 ? `0${it.ln}` : `${it.ln}`;
      if (fmt === 'encoded') {
        out.push(`${it.mod}${encodeG0Byte(it.blk)}${encodeG0Byte(it.ln)}${compactPay}`);
      } else if (fmt === 'dashed') {
        out.push(`${it.mod}-${b2}-${l2} ${it.grouped}`);
      } else {
        if (it.blk > 99 || it.ln > 99) {
          throw new Error(`Legacy .abt cannot encode block/line > 99 (${it.mod}-${b2}-${l2}); use fmt='encoded'`);
        }
        out.push(`${it.mod}${b2}${l2}${compactPay}`);
      }
    });
    const sep = opts.crlf !== false ? '\r\n' : '\n';
    return out.join(sep) + sep;
  }

  function isSyntheticBackupRecord(b) {
    return Boolean(b && (b.is_synthetic || String(b.source || '').trim().toUpperCase() === 'SYNTHETIC'));
  }

  function inferAbtBackupSource(rawText, filename, label, explicitSource, isUsbLive) {
    const src = String(explicitSource || '').trim().toUpperCase();
    if (src === 'USB_LIVE' || src === 'SYNTHETIC' || src === 'FORSCAN_ABT' || src === 'FORD_FACTORY') {
      return src;
    }
    if (isUsbLive) return 'USB_LIVE';
    if (/^\s*;.*\bsource\s*=\s*USB_LIVE\b/im.test(String(rawText || ''))) return 'USB_LIVE';
    const fnLow = String(filename || '').trim().toLowerCase();
    if (fnLow.endsWith('_live.abt') || fnLow.includes('_usb_live')) return 'USB_LIVE';
    const lblLow = String(label || '').trim().toLowerCase();
    if (lblLow.startsWith('live usb') || lblLow.startsWith('usb-c live')) return 'USB_LIVE';
    return 'FORSCAN_ABT';
  }

  function isUsbLiveBackupRecord(b) {
    if (!b || b.kind === 'FORD_AB' || b.kind === 'FORD_FACTORY') return false;
    if (b.is_usb_live || String(b.id || '').startsWith('usb-')) return true;
    return (
      inferAbtBackupSource(b.raw_text, b.filename, b.label, b.source, Boolean(b.is_usb_live)) === 'USB_LIVE'
    );
  }

  function extractBackupBlocksForModule(b, mod) {
    let dict = b && b.dict && typeof b.dict === 'object' ? b.dict : null;
    if (!dict && b && typeof b.raw_text === 'string' && b.raw_text.trim()) {
      try {
        const parsed = parseAnyBackupFile(b.filename || 'backup.abt', b.raw_text);
        dict = parsed && parsed.dict ? parsed.dict : null;
      } catch (e) {
        dict = null;
      }
    }
    if (!dict) return null;
    const out = new Set();
    const prefix = `${mod}-`;
    Object.keys(dict).forEach((k) => {
      if (k.startsWith(prefix)) {
        const blk = parseInt(k.split('-')[1], 10);
        if (!Number.isNaN(blk)) out.add(blk);
      }
    });
    return out;
  }

  function backupCoversModule(b, mod) {
    if (!b) return false;
    if (Array.isArray(b.modules) && b.modules.includes(mod)) return true;
    if (b.dict && typeof b.dict === 'object') {
      const prefix = `${mod}-`;
      return Object.keys(b.dict).some((k) => k.startsWith(prefix));
    }
    return false;
  }

  function buildModdedAbtHandoff(params = {}) {
    const entries = params.entries || [];
    const currentState = params.currentState || {};
    const backups = params.backups || [];
    const liveScan = params.liveScan || {};
    const vehicle = params.vehicle || {};
    const fmt = params.fmt || 'encoded';
    const allowStaleOverride = Boolean(params.allowStaleOverride);
    const allowUnverifiedUsbBaseline = Boolean(params.allowUnverifiedUsbBaseline);
    const modStates = params.modStates || {};
    const powertrain = String(vehicle.powertrain || 'BEV').toUpperCase();

    if (!entries.length) {
      return {
        ok: false,
        stale_blocked: false,
        parity_blocked: false,
        error: 'No mods selected for export.',
        blockers: ['Select 1+ Approved mods first.']
      };
    }
    if (!Object.keys(currentState).length) {
      return {
        ok: false,
        stale_blocked: false,
        parity_blocked: false,
        error: 'No baseline backup loaded for this vehicle.',
        blockers: ['Import your Motorcraft .ab XML + run a USB-C Live Backup (~20s), or import a FORScan "Save All" .abt file first.']
      };
    }

    const blockers = [];
    const cur = { ...currentState };
    const touchedSet = new Set();

    entries.forEach((e) => {
      const us = (e.id !== undefined && modStates[e.id]) || modStates[e.source_key] || {};
      const mergedEntry = { ...e, ...us };
      const r = readiness(mergedEntry, currentState, powertrain);
      const st = mergedEntry.status || 'DRAFT';
      const alreadyOk =
        r.state === 'ALREADY_SET' &&
        (st === 'APPROVED' || st === 'APPLIED') &&
        mergedEntry.tier !== 3 &&
        !(mergedEntry.ev_status === 'ICE_ONLY' && powertrain === 'BEV');
      if (!r.can_apply && !alreadyOk) {
        (r.blockers.length ? r.blockers : [r.state]).forEach((b) => blockers.push(`${e.title}: ${b}`));
      }
    });
    if (blockers.length) {
      return {
        ok: false,
        stale_blocked: false,
        parity_blocked: false,
        error: 'Selected mods have unresolved readiness blockers.',
        blockers
      };
    }

    entries.forEach((e) => {
      (e.steps || []).forEach((s) => {
        const sr = evaluateStep(s, cur);
        if (sr.address) touchedSet.add(sr.address.slice(0, 3));
        if ((sr.state === 'READY' || sr.state === 'ALREADY_SET') && sr.after) {
          cur[sr.address] = sr.state === 'READY' ? sr.after : cur[sr.address];
        } else {
          blockers.push(`${e.title} @ ${sr.address}: ${sr.state}`);
        }
      });
    });
    if (blockers.length) {
      return {
        ok: false,
        stale_blocked: false,
        parity_blocked: false,
        error: 'Cannot compute deterministic target state.',
        blockers
      };
    }

    const touched = Array.from(touchedSet).sort();
    const staleReasons = [];
    const parityReasons = [];
    const warnings = [];
    const vinTag = String(vehicle.vin || 'VEHICLE').trim().toUpperCase();
    const safeVin = vinTag.replace(/[^A-Z0-9]/g, '') || 'VEHICLE';
    const liveMods = (liveScan && liveScan.modules) || liveScan || {};
    const checklistLines = [
      'BLUE OVAL GARAGE — FORSCAN WRITE HANDOFF CHECKLIST',
      `Vehicle: ${vehicle.model_year || ''} ${vehicle.make || 'Ford'} ${vehicle.model || ''} (${vinTag})`.trim(),
      `Mods (${entries.length}): ` + entries.map((e) => e.title).join('; '),
      'Write Policy: Read & verify on USB-C Mobile; execute module writes ONLY in Windows FORScan.exe (Load All -> Write All).',
      '='.repeat(78)
    ];

    const modulesOut = [];
    touched.forEach((mod) => {
      const allModBackups = backups.filter((b) => backupCoversModule(b, mod));
      const hasSynth = allModBackups.some(isSyntheticBackupRecord) || backups.some(isSyntheticBackupRecord);
      const realForscanBackups = allModBackups.filter((b) => b.kind === 'FORSCAN_BACKUP' && !isSyntheticBackupRecord(b));
      const factoryBackups = allModBackups.filter(
        (b) => (b.kind === 'FORD_AB' || b.kind === 'FORD_FACTORY') && !isSyntheticBackupRecord(b)
      );
      const authForscanBackups = realForscanBackups.filter((b) => !isUsbLiveBackupRecord(b));
      const authBackups = [...factoryBackups, ...authForscanBackups];
      const latestBackup = realForscanBackups.length ? realForscanBackups[realForscanBackups.length - 1] : null;
      const backupF188 = latestBackup && latestBackup.software_version ? String(latestBackup.software_version).trim() : '';
      const liveEntry = liveMods[mod] || null;
      const liveF188 =
        liveEntry && liveEntry.ids && liveEntry.ids.F188 && liveEntry.ids.F188.value
          ? String(liveEntry.ids.F188.value).trim()
          : liveEntry && liveEntry.f188
          ? String(liveEntry.f188).trim()
          : '';

      if (backupF188 && liveF188 && backupF188.toUpperCase() !== liveF188.toUpperCase()) {
        staleReasons.push(
          `Module ${mod}: baseline backup has F188=${backupF188}, but latest live USB scan reports F188=${liveF188} (Ford OTA detected). Capture a fresh ${mod} backup before using FORScan 'Load All'.`
        );
      }

      const modBefore = {};
      const modAfter = {};
      Object.keys(cur).forEach((k) => {
        if (k.startsWith(`${mod}-`)) {
          modBefore[k] = currentState[k];
          modAfter[k] = cur[k];
        }
      });

      const actualBlocks = new Set(
        Object.keys(modAfter)
          .map((k) => parseInt(k.split('-')[1], 10))
          .filter((n) => !Number.isNaN(n))
      );
      const refBlocks = new Set();
      authBackups.forEach((ab) => {
        const bSet = extractBackupBlocksForModule(ab, mod);
        if (bSet) bSet.forEach((n) => refBlocks.add(n));
      });
      const latestBlocks = latestBackup ? extractBackupBlocksForModule(latestBackup, mod) : null;

      let parityVerified = false;
      if (hasSynth) {
        parityReasons.push(
          `Module ${mod}: synthetic demo baseline is present and cannot be used for FORScan 'Load All'. Remove the synthetic demo baseline first.`
        );
      } else if (realForscanBackups.length === 0) {
        if (factoryBackups.length > 0) {
          parityReasons.push(
            `Module ${mod}: Motorcraft .ab factory reference is loaded, but no current truck backup (.abt or USB-C Live scan) is saved yet — run a 20s USB-C Live Scan so post-OTA module bytes & F188 strategy are current before generating 'Load All' files.`
          );
        } else {
          parityReasons.push(
            `Module ${mod}: no verified baseline backup record found. Import your Motorcraft .ab XML + run a USB-C Live Scan, or import a FORScan 'Save All' .abt backup first.`
          );
        }
      } else if (authBackups.length === 0) {
        parityReasons.push(
          `Module ${mod}: unanchored USB-C Live snapshot has no authoritative full-block reference. Import your VIN's Motorcraft .ab XML (motorcraftservice.com/AsBuilt) or a one-time FORScan 'Save All' .abt baseline for ${mod} so FORScan 'Load All' never misses sparse/high blocks.`
        );
      } else {
        const missingSet = new Set();
        refBlocks.forEach((blk) => {
          if (!actualBlocks.has(blk)) missingSet.add(blk);
          if (latestBackup && latestBlocks && !latestBlocks.has(blk)) {
            missingSet.add(blk);
          }
        });
        if (missingSet.size > 0) {
          const missingArr = Array.from(missingSet).sort((a, b) => a - b);
          const latestDesc = isUsbLiveBackupRecord(latestBackup) ? 'USB-C Live snapshot' : 'Latest backup';
          parityReasons.push(
            `Module ${mod}: ${latestDesc} is missing ${missingArr.length} block(s) [${missingArr.join(', ')}] present in authoritative baseline. Re-run USB-C Backup (enable Parked Extended Session 10 03 if ${mod} gates sparse blocks) or import a full FORScan 'Save All' .abt.`
          );
        } else {
          parityVerified = true;
        }
      }

      const baselineSources = Array.from(
        new Set(
          allModBackups
            .filter((b) => !isSyntheticBackupRecord(b))
            .map((b) =>
              b.kind === 'FORD_AB' || b.kind === 'FORD_FACTORY'
                ? 'FORD_FACTORY'
                : isUsbLiveBackupRecord(b)
                ? 'USB_LIVE'
                : 'FORSCAN_ABT'
            )
        )
      ).sort();

      if (Object.keys(modAfter).length < 3) {
        warnings.push(`Module ${mod} baseline has only ${Object.keys(modAfter).length} line(s); prefer a full live ${mod} USB backup before clicking 'Load All'.`);
      }

      const changed = Object.keys(modAfter)
        .sort(addrSortCmp)
        .filter((k) => modBefore[k] !== modAfter[k])
        .map((k) => ({ address: k, before: modBefore[k], after: modAfter[k] }));

      const hdr = [
        `Blue Oval Garage Modded As-Built (${mod})`,
        `VIN: ${vinTag} | F188: ${liveF188 || backupF188 || 'unrecorded'} | Parity: ${parityVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
        'Mods: ' + entries.map((e) => e.title).join('; ')
      ];
      const abtEncoded = exportAbtText(modAfter, { fmt: 'encoded', headerComments: null });
      const abtDashed = exportAbtText(modAfter, { fmt: 'dashed', headerComments: hdr });
      const abtText = fmt === 'dashed' ? abtDashed : abtEncoded;
      const filename = `${safeVin}_${mod}_MODDED.abt`;

      checklistLines.push(
        `\n[${mod}] File: ${filename} | F188: ${liveF188 || backupF188 || 'n/a'} | Block Parity: ${parityVerified ? 'VERIFIED' : 'OVERRIDE'}`
      );
      if (changed.length) {
        changed.forEach((ch) => checklistLines.push(`  ${ch.address}:  ${ch.before}   -->   ${ch.after}`));
      } else {
        checklistLines.push('  (Already set to target values in current baseline)');
      }

      modulesOut.push({
        module: mod,
        filename,
        baseline_sources: baselineSources,
        parity_verified: parityVerified,
        authoritative_block_count: refBlocks.size || actualBlocks.size,
        actual_block_count: actualBlocks.size,
        baseline_f188: backupF188 || null,
        live_f188: liveF188 || null,
        f188_verified_match: Boolean(backupF188 && liveF188 && backupF188.toUpperCase() === liveF188.toUpperCase()),
        total_lines: Object.keys(modAfter).length,
        changed_lines: changed,
        abt_text: abtText,
        abt_encoded: abtEncoded,
        abt_dashed: abtDashed
      });
    });

    const staleBlocked = Boolean(staleReasons.length && !allowStaleOverride);
    const parityBlocked = Boolean(parityReasons.length && !allowUnverifiedUsbBaseline);
    if (staleReasons.length && allowStaleOverride) {
      staleReasons.forEach((r) => warnings.push(r));
    }
    if (parityReasons.length && allowUnverifiedUsbBaseline) {
      parityReasons.forEach((r) => warnings.push(r));
    }
    if (staleBlocked || parityBlocked) {
      const combinedBlockers = [
        ...(staleBlocked ? staleReasons : []),
        ...(parityBlocked ? parityReasons : [])
      ];
      const errMsg =
        staleBlocked && parityBlocked
          ? 'Blocked by Baseline Parity & Stale Pre-OTA Safety Gates.'
          : staleBlocked
          ? 'Blocked by Stale Pre-OTA Guard: ECU software strategy (F188) changed since baseline backup.'
          : "Blocked by Baseline Parity Safety Gate: authoritative full-block reference (.ab XML or FORScan 'Save All' .abt) required before staging 'Load All' files.";
      return {
        ok: false,
        stale_blocked: staleBlocked,
        parity_blocked: parityBlocked,
        error: errMsg,
        blockers: combinedBlockers
      };
    }

    return {
      ok: true,
      stale_blocked: false,
      parity_blocked: false,
      vin: vinTag,
      format: fmt,
      warnings,
      modules: modulesOut,
      checklist_text: checklistLines.join('\n') + '\n'
    };
  }

  const RE_EVEN_HEX = /^(?:[0-9A-F]{2})+$/;

  function parseElmResponse(lines) {
    const data = [];
    let expectedLen = null;
    let lastPending78 = null;
    const arr = Array.isArray(lines) ? lines : [];
    for (let i = 0; i < arr.length; i++) {
      const u = String(arr[i] || '').toUpperCase().trim();
      if (!u || u === 'OK' || /^(SEARCHING|ELM|STN|OBDLINK)/.test(u)) continue;
      if (u.includes('NO DATA') && lastPending78 !== null && data.length === 0 && expectedLen === null) continue;
      if (/(NO DATA|CAN ERROR|UNABLE|BUS|STOPPED|ERROR|\?|BUFFER FULL)/.test(u)) return null;
      const m = /^([0-9A-F]):\s*(.*)$/.exec(u);
      const body = m ? m[2].trim() : u;
      const toks = body.split(/\s+/).filter(Boolean);
      if (!toks.length) return null;
      if (!m && toks.length === 1 && /^[0-9A-F]{3}$/.test(toks[0])) {
        expectedLen = parseInt(toks[0], 16);
        if (expectedLen === 0) return null;
        continue;
      }
      for (let t = 0; t < toks.length; t++) {
        if (!RE_EVEN_HEX.test(toks[t])) return null;
      }
      const compact = toks.join('');
      const frameBytes = [];
      for (let j = 0; j < compact.length; j += 2) {
        frameBytes.push(parseInt(compact.slice(j, j + 2), 16));
      }
      if (
        !m &&
        expectedLen === null &&
        data.length === 0 &&
        frameBytes.length === 3 &&
        frameBytes[0] === 0x7f &&
        frameBytes[2] === 0x78
      ) {
        lastPending78 = frameBytes;
        continue;
      }
      for (let k = 0; k < frameBytes.length; k++) {
        data.push(frameBytes[k]);
      }
    }
    if (expectedLen !== null) {
      if (data.length < expectedLen) return null;
      return data.slice(0, expectedLen);
    }
    if (!data.length) {
      return lastPending78 ? lastPending78.slice() : null;
    }
    return data;
  }

  function parseVoltageText(lines) {
    const arr = Array.isArray(lines) ? lines : [];
    for (let i = 0; i < arr.length; i++) {
      const s = String(arr[i] || '').trim();
      if (!s || s.includes('?') || /ERROR/i.test(s)) continue;
      const m = /(\d{1,2}(?:\.\d{1,2})?)\s*V?\b/i.exec(s);
      if (m) {
        const val = parseFloat(m[1]);
        if (val > 0 && val < 30) return Math.round(val * 100) / 100;
      }
    }
    return null;
  }

  function checkVoltageGate(voltage, options = {}) {
    const minVolts = Number(options.minVolts || 12.5);
    const override = Boolean(options.override);
    const requireForExtended = Boolean(options.requireForExtended);
    if (voltage === null || voltage === undefined) {
      return {
        voltage: null,
        min_volts: minVolts,
        ok: true,
        blocked: false,
        warning: 'Adapter did not report 12V battery voltage (ATRV unsupported); confirm vehicle is in Ready/KOER mode manually.'
      };
    }
    const low = voltage < minVolts;
    return {
      voltage,
      min_volts: minVolts,
      ok: !low,
      blocked: Boolean(low && requireForExtended && !override),
      override_used: Boolean(low && override),
      warning: low
        ? `12V battery is ${voltage.toFixed(2)}V (< ${minVolts.toFixed(1)}V). Put the Lightning/vehicle in Ready/KOER mode so the DC-DC holds ~14.4V.`
        : null
    };
  }

  function didsToAbtLines(address, didBytesMap) {
    const mod = String(address || '').trim().toUpperCase();
    if (!/^[0-9A-F]{3}$/.test(mod)) throw new Error(`Invalid module address: ${address}`);
    const out = [];
    const didKeys = Object.keys(didBytesMap || {}).sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
    didKeys.forEach((didHex) => {
      const didInt = parseInt(didHex, 16);
      if (didInt < 0xde00 || didInt > 0xdefe) return;
      const raw = didBytesMap[didHex];
      if (!Array.isArray(raw) || !raw.length) return;
      const block = didInt - 0xde00 + 1;
      const bStr = block < 10 ? `0${block}` : `${block}`;
      let lineIdx = 1;
      for (let off = 0; off < raw.length; off += 5) {
        const chunk = raw.slice(off, off + 5);
        const hexWithZeroCs =
          chunk.map((b) => ('00' + (b & 0xff).toString(16).toUpperCase()).slice(-2)).join('') + '00';
        const grouped = groupHexPayload(hexWithZeroCs);
        const payload = withChecksum(mod, block, lineIdx, grouped);
        const lStr = lineIdx < 10 ? `0${lineIdx}` : `${lineIdx}`;
        out.push({ key: `${mod}-${bStr}-${lStr}`, module: mod, block, line: lineIdx, payload });
        lineIdx++;
      }
    });
    return out;
  }

  function decodeAsciiOrHex(byteArr) {
    if (!Array.isArray(byteArr) || !byteArr.length) return null;
    let s = '';
    for (let i = 0; i < byteArr.length; i++) {
      if (byteArr[i] === 0) continue;
      s += String.fromCharCode(byteArr[i]);
    }
    s = s.trim();
    if (s && /^[\x20-\x7E]+$/.test(s)) return s;
    return byteArr.map((b) => ('00' + (b & 0xff).toString(16).toUpperCase()).slice(-2)).join('');
  }

  const UDS_ID_DIDS = {
    F190: 'VIN',
    F188: 'ECU software number',
    F111: 'ECU core assembly number',
    F113: 'ECU delivery assembly number',
    F124: 'ECU calibration number'
  };

  async function runUsbVehicleScan(usbBridge, options = {}) {
    const mode = options.mode || 'targeted_backup';
    const addresses = Array.from(new Set((options.addresses || ['726', '720', '7D0']).map((a) => String(a).trim().toUpperCase())));
    const dualBus = options.dualBus !== false;
    const msCanFallback = Boolean(options.msCanFallback);
    const allowExtended = Boolean(options.allowExtendedSession);
    const confirmParked = Boolean(options.confirmParked);
    const overrideLowV = Boolean(options.overrideLowVoltage);
    const maxBlocks = Number(options.maxBlocks || 128);
    const maxEmptyRun = Number(options.maxEmptyRun || 24);
    const maxTimeoutRun = Number(options.maxTimeoutRun || 3);
    const knownBlocksByModule = options.knownBlocksByModule || {};
    const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
    const log = [];
    let currentBus = 'HS_DIAG1';

    async function cmd(c, timeoutMs = 1200, parked = false) {
      const r = await usbBridge.transact(c, timeoutMs, parked);
      log.push(`> ${c}`);
      if (r && Array.isArray(r.lines)) r.lines.forEach((l) => log.push(`< ${l}`));
      if (!r || !r.ok) {
        throw new Error((r && r.error) || `Adapter command failed: ${c}`);
      }
      return r.lines || [];
    }

    async function switchBus(bus) {
      if (bus === 'HS_DIAG1') {
        const r = await cmd('STP33', 800);
        if (r.some((x) => x.includes('?') || /ERROR/i.test(x))) await cmd('ATSP6', 800);
        currentBus = 'HS_DIAG1';
        return { bus, switched: true };
      }
      if (bus === 'HS_DIAG2') {
        const r1 = await cmd('STP53', 800);
        if (r1.some((x) => x.includes('?') || /ERROR/i.test(x))) {
          return { bus, switched: false, reason: 'Adapter rejected STP53' };
        }
        const r2 = await cmd('STPBR500000', 800);
        if (r2.some((x) => x.includes('?') || /ERROR/i.test(x))) {
          const rev = await cmd('STP33', 800);
          if (rev.some((x) => x.includes('?') || /ERROR/i.test(x))) await cmd('ATSP6', 800);
          currentBus = 'HS_DIAG1';
          return { bus, switched: false, reason: 'Adapter rejected STPBR500000' };
        }
        currentBus = 'HS_DIAG2';
        return { bus, switched: true };
      }
      if (bus === 'MS_CAN') {
        const r1 = await cmd('STP53', 800);
        if (r1.some((x) => x.includes('?') || /ERROR/i.test(x))) {
          return { bus, switched: false, reason: 'Adapter rejected STP53' };
        }
        const r2 = await cmd('STPBR125000', 800);
        if (r2.some((x) => x.includes('?') || /ERROR/i.test(x))) {
          const rev = await cmd('STP33', 800);
          if (rev.some((x) => x.includes('?') || /ERROR/i.test(x))) await cmd('ATSP6', 800);
          currentBus = 'HS_DIAG1';
          return { bus, switched: false, reason: 'Adapter rejected STPBR125000' };
        }
        currentBus = 'MS_CAN';
        return { bus, switched: true };
      }
      return { bus, switched: false };
    }

    async function udsRequest(addr, hexPayload, timeoutMs = 1200, parked = false) {
      const respId = ('000' + (parseInt(addr, 16) + 8).toString(16).toUpperCase()).slice(-3);
      await cmd(`ATSH${addr}`, 600);
      await cmd(`ATCRA${respId}`, 600);
      await cmd(`ATFCSH${addr}`, 600);
      await cmd('ATFCSD300000', 600);
      await cmd('ATFCSM1', 600);
      const rawLines = await cmd(hexPayload, timeoutMs, parked);
      const data = parseElmResponse(rawLines);
      if (!data) return { responded: false, positive: false, data: [], nrc: null };
      if (data[0] === 0x7f && data.length >= 3) {
        return { responded: true, positive: false, data, nrc: data[2] };
      }
      const reqSid = parseInt(hexPayload.slice(0, 2), 16);
      if (data[0] === reqSid + 0x40) {
        return { responded: true, positive: true, data: data.slice(1), nrc: null };
      }
      return { responded: true, positive: false, data, nrc: null };
    }

    async function readDtcs(addr) {
      const r = await udsRequest(addr, '1902FF', 1500);
      if (!r.positive || r.data.length < 2) return [];
      const body = r.data.slice(2);
      const out = [];
      for (let i = 0; i <= body.length - 4; i += 4) {
        const b1 = body[i], b2 = body[i + 1], b3 = body[i + 2], st = body[i + 3];
        const letter = 'PCBU'[b1 >> 6];
        const code = `${letter}${(b1 >> 4) & 3}${(b1 & 0x0f).toString(16).toUpperCase()}${('00' + b2.toString(16).toUpperCase()).slice(-2)}-${('00' + b3.toString(16).toUpperCase()).slice(-2)}`;
        out.push({ code, status: ('00' + st.toString(16).toUpperCase()).slice(-2) });
      }
      return out;
    }

    async function probeModule(addr, wantAsbuilt) {
      const tp = await udsRequest(addr, '3E00', 900);
      if (!tp.responded) return null;
      const ids = {};
      for (const did of Object.keys(UDS_ID_DIDS)) {
        const r = await udsRequest(addr, `22${did}`, 1100);
        if (r.positive && r.data.length > 2) {
          const val = decodeAsciiOrHex(r.data.slice(2));
          if (val) ids[did] = { name: UDS_ID_DIDS[did], value: val };
        }
      }
      const dtcs = await readDtcs(addr);
      if (!wantAsbuilt) {
        return { address: addr, bus: currentBus, responded: true, tester_present_ok: tp.positive, ids, dtcs };
      }

      async function sweepDexx(keepAlive) {
        const didMap = {};
        const nrcs = new Set();
        const probed = new Set();
        let emptyRun = 0;
        let timeoutRun = 0;
        let reqCount = 0;
        let anyResp = false;
        let sessionDenied = false;

        async function queryBlock(blk) {
          if (keepAlive && reqCount > 0 && reqCount % 8 === 0) {
            await udsRequest(addr, '3E00', 700);
          }
          reqCount++;
          probed.add(blk);
          const didInt = 0xde00 + (blk - 1);
          const didHex = didInt.toString(16).toUpperCase();
          const res = await udsRequest(addr, `22${didHex}`, 1200);
          if (res.responded) {
            anyResp = true;
            if (res.positive && res.data.length > 2 && res.data[0] === ((didInt >> 8) & 0xff) && res.data[1] === (didInt & 0xff)) {
              didMap[didHex] = res.data.slice(2);
            } else if (res.nrc !== null) {
              nrcs.add(res.nrc);
            }
          }
          return { res, didHex };
        }

        const limit = Math.min(Math.max(1, maxBlocks), 255);
        for (let blk = 1; blk <= limit; blk++) {
          const { res, didHex } = await queryBlock(blk);
          if (!res.responded) {
            timeoutRun++;
            if (timeoutRun >= maxTimeoutRun) break;
            continue;
          }
          timeoutRun = 0;
          if (didMap[didHex]) {
            emptyRun = 0;
          } else {
            if (Object.keys(didMap).length === 0 && !keepAlive && [0x22, 0x33, 0x7e, 0x7f].includes(res.nrc)) {
              sessionDenied = true;
              break;
            }
            emptyRun++;
            if (emptyRun >= maxEmptyRun) break;
          }
        }

        const rawKnown = knownBlocksByModule[addr];
        const knownArr = Array.isArray(rawKnown)
          ? rawKnown
          : rawKnown instanceof Set
          ? Array.from(rawKnown)
          : [];
        if (knownArr.length && anyResp && timeoutRun < maxTimeoutRun && !sessionDenied) {
          const sortedKnown = Array.from(new Set(knownArr.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n >= 1 && n <= 255))).sort((a, b) => a - b);
          for (let k = 0; k < sortedKnown.length; k++) {
            const kb = sortedKnown[k];
            if (probed.has(kb)) continue;
            const { res, didHex } = await queryBlock(kb);
            if (!res.responded) break;
            let curBlk = kb + 1;
            let prevHex = didHex;
            while (didMap[prevHex] && curBlk <= 255 && !probed.has(curBlk)) {
              const nxt = await queryBlock(curBlk);
              if (!nxt.res.responded) break;
              prevHex = nxt.didHex;
              curBlk++;
            }
          }
        }
        return { didMap, nrcs };
      }

      let sessionUsed = 'default';
      let { didMap, nrcs } = await sweepDexx(false);
      if (Object.keys(didMap).length === 0 && allowExtended && confirmParked) {
        const enter = await udsRequest(addr, '1003', 1000, true);
        try {
          if (enter.positive) {
            sessionUsed = 'extended';
            const retry = await sweepDexx(true);
            didMap = retry.didMap;
          }
        } finally {
          try { await udsRequest(addr, '1001', 900, true); } catch (e) {}
        }
      }

      const abtLines = didsToAbtLines(addr, didMap);
      const linesDict = {};
      abtLines.forEach((l) => { linesDict[l.key] = l.payload; });
      const f188 = (ids.F188 && ids.F188.value) || null;
      const vin = (ids.F190 && ids.F190.value) || null;
      const hdr = [
        `Blue Oval Garage Mobile USB-C Snapshot - Module ${addr}`,
        `VIN: ${vin || 'unknown'} | F188: ${f188 || 'unknown'} | Bus: ${currentBus} | Session: ${sessionUsed}`
      ];
      return {
        address: addr,
        bus: currentBus,
        responded: true,
        tester_present_ok: tp.positive,
        session_used: sessionUsed,
        ids,
        f188,
        vin,
        dtcs,
        blocks_read: Object.keys(didMap).length,
        line_count: abtLines.length,
        lines: abtLines,
        abt_encoded: abtLines.length ? exportAbtText(linesDict, { fmt: 'encoded', headerComments: null }) : null,
        abt_dashed: abtLines.length ? exportAbtText(linesDict, { fmt: 'dashed', headerComments: hdr }) : null
      };
    }

    if (usbBridge.setKeepScreenOn) usbBridge.setKeepScreenOn(true);
    try {
      const ident = await cmd('ATZ', 1800);
      for (const c of ['ATE0', 'ATL0', 'ATS0', 'ATH0', 'ATCAF1', 'ATSP6']) {
        await cmd(c, 800);
      }
      let stn = '';
      try {
        const stnOut = await cmd('STDI', 800);
        if (!stnOut.some((x) => x.includes('?'))) stn = stnOut.join(' ');
      } catch (e) {}

      const vRaw = await cmd('ATRV', 800);
      const voltage = parseVoltageText(vRaw);
      const wantAsbuilt = mode === 'targeted_backup' || mode === 'full_backup';
      const vgate = checkVoltageGate(voltage, { minVolts: 12.5, override: overrideLowV, requireForExtended: wantAsbuilt });
      if (vgate.blocked) {
        const err = new Error(vgate.warning || '12V battery voltage below 12.5V');
        err.lowVoltageBlocked = true;
        err.voltage = voltage;
        throw err;
      }

      if (dualBus || msCanFallback) await switchBus('HS_DIAG1');

      const modulesOut = {};
      for (let i = 0; i < addresses.length; i++) {
        const a = addresses[i];
        if (onProgress) onProgress({ step: i + 1, total: addresses.length, address: a, bus: currentBus });
        const snap = await probeModule(a, wantAsbuilt);
        if (snap) modulesOut[a] = snap;
      }

      const missing = addresses.filter((a) => !modulesOut[a]);
      if (missing.length && (dualBus || msCanFallback)) {
        const secBus = msCanFallback ? 'MS_CAN' : 'HS_DIAG2';
        const sw = await switchBus(secBus);
        if (sw.switched) {
          try {
            for (let i = 0; i < missing.length; i++) {
              const a = missing[i];
              if (onProgress) onProgress({ step: i + 1, total: missing.length, address: a, bus: secBus });
              const snap = await probeModule(a, wantAsbuilt);
              if (snap) modulesOut[a] = snap;
            }
          } finally {
            await switchBus('HS_DIAG1');
          }
        }
      }

      let detectedVin = null;
      Object.values(modulesOut).forEach((m) => {
        if (!detectedVin && m.ids && m.ids.F190 && m.ids.F190.value) detectedVin = m.ids.F190.value;
      });

      return {
        mode,
        adapter: { elm: ident.join(' '), stn },
        voltage: vgate,
        vin: detectedVin,
        modules: modulesOut,
        log: log.slice(-100)
      };
    } finally {
      if (usbBridge.setKeepScreenOn) usbBridge.setKeepScreenOn(false);
    }
  }

  // --- 9. Deterministic Zero-Dependency PKZIP Archive Builder (Offline Vault .zip Export) ---
  const _CRC32_TABLE = (() => {
    const tbl = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? (0xedb88320 ^ (c >>> 1)) >>> 0 : c >>> 1;
      }
      tbl[i] = c >>> 0;
    }
    return tbl;
  })();

  function crc32Bytes(u8) {
    let c = 0xffffffff;
    for (let i = 0; i < u8.length; i++) {
      c = (_CRC32_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8)) >>> 0;
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function _utf8Encode(str) {
    const s = String(str ?? '');
    if (typeof TextEncoder === 'function') return new TextEncoder().encode(s);
    const out = [];
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code < 0x80) {
        out.push(code);
      } else if (code < 0x800) {
        out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      } else {
        out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      }
    }
    return new Uint8Array(out);
  }

  const _B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function bytesToBase64(u8) {
    let out = '';
    const len = u8.length;
    for (let i = 0; i < len; i += 3) {
      const b0 = u8[i];
      const b1 = i + 1 < len ? u8[i + 1] : 0;
      const b2 = i + 2 < len ? u8[i + 2] : 0;
      out += _B64_CHARS[b0 >> 2];
      out += _B64_CHARS[((b0 & 3) << 4) | (b1 >> 4)];
      out += i + 1 < len ? _B64_CHARS[((b1 & 15) << 2) | (b2 >> 6)] : '=';
      out += i + 2 < len ? _B64_CHARS[b2 & 63] : '=';
    }
    return out;
  }

  function buildZipBytes(fileEntries) {
    const entries = Array.isArray(fileEntries) ? fileEntries : [];
    const now = new Date();
    const dosTime = ((now.getHours() & 0x1f) << 11) | ((now.getMinutes() & 0x3f) << 5) | ((now.getSeconds() >> 1) & 0x1f);
    const yr = Math.max(1980, now.getFullYear()) - 1980;
    const dosDate = ((yr & 0x7f) << 9) | (((now.getMonth() + 1) & 0x0f) << 5) | (now.getDate() & 0x1f);

    const prepared = entries.map((e) => {
      const safePath = String(e.name || 'file.txt').replace(/^\/+/, '').replace(/\.\.+/g, '_');
      const nameBytes = _utf8Encode(safePath);
      const dataBytes = e.bytes instanceof Uint8Array ? e.bytes : _utf8Encode(e.content ?? '');
      const crc = crc32Bytes(dataBytes);
      return { nameBytes, dataBytes, crc };
    });

    let localSize = 0;
    let cdSize = 0;
    prepared.forEach((p) => {
      localSize += 30 + p.nameBytes.length + p.dataBytes.length;
      cdSize += 46 + p.nameBytes.length;
    });

    const total = localSize + cdSize + 22;
    const out = new Uint8Array(total);
    const dv = new DataView(out.buffer);

    let pos = 0;
    const offsets = [];
    prepared.forEach((p) => {
      offsets.push(pos);
      dv.setUint32(pos, 0x04034b50, true);
      dv.setUint16(pos + 4, 20, true);
      dv.setUint16(pos + 6, 0x0800, true); // UTF-8 flag
      dv.setUint16(pos + 8, 0, true); // STORE (0)
      dv.setUint16(pos + 10, dosTime, true);
      dv.setUint16(pos + 12, dosDate, true);
      dv.setUint32(pos + 14, p.crc, true);
      dv.setUint32(pos + 18, p.dataBytes.length, true);
      dv.setUint32(pos + 22, p.dataBytes.length, true);
      dv.setUint16(pos + 26, p.nameBytes.length, true);
      dv.setUint16(pos + 28, 0, true);
      out.set(p.nameBytes, pos + 30);
      out.set(p.dataBytes, pos + 30 + p.nameBytes.length);
      pos += 30 + p.nameBytes.length + p.dataBytes.length;
    });

    const cdOffset = pos;
    prepared.forEach((p, idx) => {
      dv.setUint32(pos, 0x02014b50, true);
      dv.setUint16(pos + 4, 20, true);
      dv.setUint16(pos + 6, 20, true);
      dv.setUint16(pos + 8, 0x0800, true);
      dv.setUint16(pos + 10, 0, true);
      dv.setUint16(pos + 12, dosTime, true);
      dv.setUint16(pos + 14, dosDate, true);
      dv.setUint32(pos + 16, p.crc, true);
      dv.setUint32(pos + 20, p.dataBytes.length, true);
      dv.setUint32(pos + 24, p.dataBytes.length, true);
      dv.setUint16(pos + 28, p.nameBytes.length, true);
      dv.setUint16(pos + 30, 0, true);
      dv.setUint16(pos + 32, 0, true);
      dv.setUint16(pos + 34, 0, true);
      dv.setUint16(pos + 36, 0, true);
      dv.setUint32(pos + 38, 0, true);
      dv.setUint32(pos + 42, offsets[idx], true);
      out.set(p.nameBytes, pos + 46);
      pos += 46 + p.nameBytes.length;
    });

    dv.setUint32(pos, 0x06054b50, true);
    dv.setUint16(pos + 4, 0, true);
    dv.setUint16(pos + 6, 0, true);
    dv.setUint16(pos + 8, prepared.length, true);
    dv.setUint16(pos + 10, prepared.length, true);
    dv.setUint32(pos + 12, cdSize, true);
    dv.setUint32(pos + 16, cdOffset, true);
    dv.setUint16(pos + 20, 0, true);

    return out;
  }

  function buildVaultZipArchive(options = {}) {
    const backups = Array.isArray(options.backups) ? options.backups : [];
    const vehicle = options.vehicle || {};
    const handoff = options.handoff || null;
    const includeSynthetic = Boolean(options.includeSynthetic);
    const realList = backups.filter((b) => includeSynthetic || !b.is_synthetic);

    const zipEntries = [];
    const manifest = [];

    realList.forEach((b, idx) => {
      const isFactory = b.kind === 'FORD_AB' || b.kind === 'FORD_FACTORY';
      const ext = isFactory ? '.ab' : '.abt';
      const rawBase = String(b.filename || b.label || `backup_${idx + 1}`).replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 60);
      const num = String(idx + 1).padStart(3, '0');
      let entryName = `${num}_${b.kind || 'FORSCAN_BACKUP'}_${rawBase}`;
      if (!entryName.toLowerCase().endsWith(ext)) entryName += ext;
      const text =
        b.raw_text ||
        exportAbtText(b.dict || {}, {
          fmt: 'encoded',
          headerComments: [`Exported from Blue Oval Garage (${b.label || entryName})`]
        });
      const digest = b.sha256 || sha256Hex(text);
      zipEntries.push({ name: entryName, content: text });
      manifest.push({
        file: entryName,
        label: b.label || b.filename || entryName,
        kind: b.kind || 'FORSCAN_BACKUP',
        source: isFactory ? 'FORD_FACTORY' : isUsbLiveBackupRecord(b) ? 'USB_LIVE' : 'FORSCAN_ABT',
        vin: b.vin || vehicle.vin || null,
        software_version: b.software_version || null,
        modules: b.modules || [],
        sha256: digest,
        taken_at: b.taken_at || null
      });
    });

    if (handoff && handoff.ok && Array.isArray(handoff.modules) && handoff.modules.length > 0) {
      handoff.modules.forEach((m) => {
        const stagePath = `FORScan_Staging/${m.filename}`;
        zipEntries.push({ name: stagePath, content: m.abt_text || m.abt_encoded });
        manifest.push({
          file: stagePath,
          label: `Modded FORScan Load-All (${m.module})`,
          kind: 'MODDED_FORSCAN_STAGE',
          vin: vehicle.vin || null,
          software_version: m.live_f188 || m.baseline_f188 || null,
          modules: [m.module],
          sha256: sha256Hex(m.abt_text || m.abt_encoded || ''),
          changed_lines: (m.changed_lines || []).length
        });
      });
      if (handoff.checklist_text) {
        zipEntries.push({ name: 'FORScan_Staging/SESSION_CHECKLIST.txt', content: handoff.checklist_text });
      }
    }

    if (options.vaultSnapshot && typeof options.vaultSnapshot === 'object') {
      zipEntries.push({
        name: 'vault_snapshot.json',
        content: JSON.stringify(options.vaultSnapshot, null, 2)
      });
    }

    zipEntries.push({
      name: 'MANIFEST.json',
      content: JSON.stringify(manifest, null, 2)
    });

    const safeVin = String(vehicle.vin || 'GARAGE').replace(/[^A-Z0-9]/gi, '') || 'GARAGE';
    const dateTag = new Date().toISOString().slice(0, 10);
    const filename = options.filename || `${safeVin}_BlueOvalGarage_Vault_${dateTag}.zip`;
    const bytes = buildZipBytes(zipEntries);
    return {
      filename,
      fileCount: zipEntries.length,
      backupCount: realList.length,
      manifest,
      bytes,
      base64: bytesToBase64(bytes)
    };
  }

  global.GarageEngine = {
    sha256Hex,
    crc32Bytes,
    bytesToBase64,
    buildZipBytes,
    buildVaultZipArchive,
    computeChecksum,
    checksumOk,
    withChecksum,
    encodeG0Byte,
    decodeG0Pair,
    groupHexPayload,
    parseAddress,
    addrSortCmp,
    cleanMask,
    targetPositions,
    normalizeStep,
    evaluateStep,
    readiness,
    detectFormat,
    parseAbtText,
    exportAbtText,
    inferAbtBackupSource,
    isUsbLiveBackupRecord,
    buildModdedAbtHandoff,
    parseAbXmlText,
    parseAnyBackupFile,
    diffBackups,
    verifySession,
    parseElmResponse,
    parseVoltageText,
    checkVoltageGate,
    didsToAbtLines,
    runUsbVehicleScan,
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
})(typeof globalThis !== 'undefined' ? globalThis : window);
