/**
 * MarginBrief v1 — Offline-First Weekend Margin Radar & 1-Page Pocket Trip Dossier
 * Built for RollupOS (Pixel 10 Pro PWA) + Project Sapphire SO-03 Spine.
 */

window.ROLLUP_APP_ID = 'margin-brief';

const OVERLAY_KEY = 'margin_brief_device_overlay_v1';
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_TEMPLATES = {
  carry_on: {
    id: 'carry_on',
    label: '✈️ Carry-On Weekend',
    items: [
      "Wallet, ID / Driver's License & backup card",
      'Pixel 10 Pro + USB-C fast brick & braided cable',
      'Battery bank (charged) & earbuds',
      '2-3 days clothes + gym/walking shoes',
      'Doppkitt / meds / contacts / glasses',
      'Download offline boarding pass & MarginBrief sync'
    ]
  },
  road_trip: {
    id: 'road_trip',
    label: '⚡ Lightning Road Trip',
    items: [
      'Pre-condition & charge F-150 Lightning to target %',
      'NACS / Supercharger adapter + mobile power cord in frunk',
      'Verify tire pressures & washer fluid',
      'Sunglasses, water bottles & road snacks',
      'Check route fast-chargers (ABRP / PlugShare backup)',
      'Garage door closed & tonneau/frunk locked'
    ]
  },
  home_lockup: {
    id: 'home_lockup',
    label: '🏠 Pre-Leave Home Lockup',
    items: [
      'Set thermostat to Away / Eco mode',
      'Empty kitchen trash & run/clear dishwasher',
      'Lock all exterior doors, patio sliders & garage entry',
      'Unplug countertop heat appliances; check stove off',
      'Water check / outdoor spigot freeze check (<25°F)',
      'Porch light / interior timer active'
    ]
  }
};

// --- Conditional Temporal Polyfill + Airplane-Mode Safe PlainDate/PlainTime ---
async function ensureTemporal() {
  if (typeof Temporal !== 'undefined') return;
  try {
    const mod = await import('https://esm.sh/temporal-polyfill');
    globalThis.Temporal = mod.Temporal;
    if (mod.toTemporalInstant) {
      Date.prototype.toTemporalInstant = mod.toTemporalInstant;
    }
    return;
  } catch {
    // Airplane Mode fallback: lightweight immutable ISO PlainDate & PlainTime
    const pad2 = (n) => String(n).padStart(2, '0');
    class OfflinePlainTime {
      constructor(hour, minute) {
        this.hour = Number(hour);
        this.minute = Number(minute);
        Object.freeze(this);
      }
      static from(v) {
        if (v instanceof OfflinePlainTime) return v;
        const [h, m] = String(v || '00:00').split(':');
        return new OfflinePlainTime(Number(h || 0), Number(m || 0));
      }
      static compare(a, b) {
        const pa = OfflinePlainTime.from(a);
        const pb = OfflinePlainTime.from(b);
        return (pa.hour * 60 + pa.minute) - (pb.hour * 60 + pb.minute);
      }
      toString() {
        return `${pad2(this.hour)}:${pad2(this.minute)}`;
      }
    }
    class OfflinePlainDate {
      constructor(year, month, day) {
        this.year = Number(year);
        this.month = Number(month);
        this.day = Number(day);
        const utcMs = Date.UTC(this.year, this.month - 1, this.day);
        const dow = new Date(utcMs).getUTCDay();
        this.dayOfWeek = dow === 0 ? 7 : dow; // ISO 1=Mon .. 6=Sat, 7=Sun
        Object.freeze(this);
      }
      static from(v) {
        if (v instanceof OfflinePlainDate) return v;
        if (typeof v === 'string') {
          const [y, m, d] = v.slice(0, 10).split('-').map(Number);
          return new OfflinePlainDate(y, m, d);
        }
        return new OfflinePlainDate(v.year, v.month, v.day);
      }
      static compare(a, b) {
        const sa = OfflinePlainDate.from(a).toString();
        const sb = OfflinePlainDate.from(b).toString();
        return sa < sb ? -1 : sa > sb ? 1 : 0;
      }
      add({ days = 0 }) {
        const dt = new Date(Date.UTC(this.year, this.month - 1, this.day + days));
        return new OfflinePlainDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
      }
      equals(other) {
        return this.toString() === OfflinePlainDate.from(other).toString();
      }
      toString() {
        return `${this.year}-${pad2(this.month)}-${pad2(this.day)}`;
      }
    }
    globalThis.Temporal = {
      PlainDate: OfflinePlainDate,
      PlainTime: OfflinePlainTime,
      Now: {
        plainDateISO() {
          const now = new Date();
          return new OfflinePlainDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
        }
      }
    };
  }
}

// --- Modern Web Guidance: Light-Dismiss Dialog Fallback + returnValue Reset ---
function wireDialogs() {
  const dialogs = document.querySelectorAll('dialog[closedby="any"]');
  for (const dlg of dialogs) {
    dlg.addEventListener('close', () => {
      dlg.returnValue = '';
    });
  }

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    for (const dialog of dialogs) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        dialog.close();
      });
    }
  }
}

// --- Modern Web Guidance: Accessible Copy Button + VoiceOver Dedup ---
const copyTimers = new WeakMap();
let lastCopyAnnouncement = '';

function legacyCopy(text) {
  const field = Object.assign(document.createElement('textarea'), { value: text });
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } finally {
    field.remove();
  }
}

function reportCopy(button, ok) {
  const tip = button.nextElementSibling;
  if (!tip) return;
  clearTimeout(copyTimers.get(button));
  button.removeAttribute('data-copied');
  button.removeAttribute('data-failed');
  let message = ok ? 'Copied' : 'Copy failed';
  if (message === lastCopyAnnouncement) message += '\u00A0';
  lastCopyAnnouncement = message;
  tip.textContent = '';
  void button.offsetWidth;
  button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
  requestAnimationFrame(() => {
    tip.textContent = message;
  });
  copyTimers.set(
    button,
    setTimeout(() => {
      button.removeAttribute('data-copied');
      button.removeAttribute('data-failed');
      tip.textContent = '';
    }, 2000)
  );
}

async function copyFromTarget(button, target) {
  const text = target.matches('input, textarea') ? target.value.trim() : target.innerText.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    reportCopy(button, true);
  } catch {
    if (legacyCopy(text)) {
      reportCopy(button, true);
    } else {
      reportCopy(button, false);
    }
  }
}

function wireCopyCommands() {
  if ('CommandEvent' in window) {
    document.addEventListener(
      'command',
      (event) => {
        if (event.command && event.command.startsWith('--copy')) {
          copyFromTarget(event.source, event.target);
        }
      },
      true
    );
  } else {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button[command^="--copy"]');
      if (!button) return;
      const target = document.getElementById(button.getAttribute('commandfor'));
      if (target) copyFromTarget(button, target);
    });
  }
}

// --- Storage Helpers (Isolated RollupBridge + LocalStorage) ---
function readOverlay() {
  try {
    if (window.RollupBridge && RollupBridge.storage && RollupBridge.storage.getJSON) {
      return RollupBridge.storage.getJSON(OVERLAY_KEY, null) || defaultOverlay();
    }
    const raw = localStorage.getItem(`rollup::v1::margin-brief::${OVERLAY_KEY}`);
    return raw ? JSON.parse(raw) : defaultOverlay();
  } catch {
    return defaultOverlay();
  }
}

function writeOverlay(data) {
  try {
    if (window.RollupBridge && RollupBridge.storage && RollupBridge.storage.setJSON) {
      RollupBridge.storage.setJSON(OVERLAY_KEY, data);
      return;
    }
    localStorage.setItem(`rollup::v1::margin-brief::${OVERLAY_KEY}`, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

function defaultOverlay() {
  return {
    localTrips: [],
    localObligations: [],
    parkingByTrip: {},
    checklistTemplateByTrip: {},
    checkedItemsByTrip: {},
    customItemsByTrip: {},
    queuedHolds: []
  };
}

function getSapphireApiBase() {
  if (window.RollupBridge && RollupBridge.config && RollupBridge.config.getAll) {
    const cfg = RollupBridge.config.getAll('margin-brief') || {};
    if (cfg.sapphire_cloud_url) return String(cfg.sapphire_cloud_url).replace(/\/$/, '');
    const sapCfg = RollupBridge.config.getAll('sapphire-companion') || {};
    if (sapCfg.sapphire_cloud_url) return String(sapCfg.sapphire_cloud_url).replace(/\/$/, '');
  }
  return 'http://127.0.0.1:8085';
}

// --- Deterministic Location-Agnostic Date & 3-Rule Scorer ---
function upcomingSaturday(refPlainDate) {
  const dow = refPlainDate.dayOfWeek; // 1=Mon .. 6=Sat, 7=Sun
  if (dow === 6) return refPlainDate;
  if (dow === 7) return refPlainDate.add({ days: -1 });
  return refPlainDate.add({ days: 6 - dow });
}

function formatWeekendLabel(sat, sun) {
  const m1 = MONTH_SHORT[sat.month - 1];
  const m2 = MONTH_SHORT[sun.month - 1];
  return sat.month === sun.month ? `${m1} ${sat.day}–${sun.day}` : `${m1} ${sat.day} – ${m2} ${sun.day}`;
}

function fmt12h(hhmm) {
  if (!hhmm || !hhmm.includes(':')) return '';
  const t = Temporal.PlainTime.from(hhmm);
  const ap = t.hour >= 12 ? 'PM' : 'AM';
  const h12 = t.hour % 12 || 12;
  return `${h12}:${String(t.minute).padStart(2, '0')} ${ap}`;
}

function isAfter1900(hhmm) {
  if (!hhmm || !hhmm.includes(':')) return false;
  const t = Temporal.PlainTime.from(hhmm);
  const cutoff = Temporal.PlainTime.from('19:00');
  return Temporal.PlainTime.compare(t, cutoff) > 0;
}

function computeClientRadar(baseObligations, allTrips, refIso) {
  const refDate = refIso ? Temporal.PlainDate.from(refIso) : Temporal.Now.plainDateISO();
  const firstSat = upcomingSaturday(refDate);

  const obls = [...baseObligations];
  const seen = new Set(obls.map((o) => `${String(o.title).toLowerCase()}|${o.start_date}|${o.end_date}`));
  for (const tr of allTrips) {
    const k = `${String(tr.title).toLowerCase()}|${tr.start_date}|${tr.end_date}`;
    if (!seen.has(k)) {
      obls.push({
        event_id: `tr-${tr.trip_id}`,
        title: tr.title,
        start_date: tr.start_date,
        start_time: (tr.segments && tr.segments[0] && tr.segments[0].start_time) || '',
        end_date: tr.end_date,
        end_time: tr.return_arrival_time || '',
        all_day: false,
        source: 'trip_dossier',
        is_away_travel: true
      });
      seen.add(k);
    }
  }

  const overlaps = (o, dayStr) => o.start_date <= dayStr && dayStr <= (o.end_date || o.start_date);
  const busyOn = (o, dayStr) => overlaps(o, dayStr) && (Boolean(o.is_away_travel) || (!o.all_day && Boolean(o.start_time || o.end_time)) || o.source === 'manual');

  const slots = [];
  for (let i = 0; i < 6; i++) {
    const sat = firstSat.add({ days: i * 7 });
    const sun = sat.add({ days: 1 });
    const mon = sun.add({ days: 1 });
    const satStr = sat.toString();
    const sunStr = sun.toString();
    const monStr = mon.toString();

    const wkObls = obls.filter((o) => overlaps(o, satStr) || overlaps(o, sunStr));
    const satBusy = wkObls.some((o) => busyOn(o, satStr));
    const sunBusy = wkObls.some((o) => busyOn(o, sunStr));
    const isAway = wkObls.some((o) => o.is_away_travel);

    let latestSun = '';
    for (const o of wkObls) {
      if (o.end_date === sunStr && isAfter1900(o.end_time) && o.end_time > latestSun) latestSun = o.end_time;
    }
    for (const tr of allTrips) {
      if (tr.end_date === sunStr && isAfter1900(tr.return_arrival_time) && tr.return_arrival_time > latestSun) {
        latestSun = tr.return_arrival_time;
      }
    }

    const flags = [];
    const explanations = [];
    let status = 'GREEN';
    let recommended_hold = null;

    if (satBusy && sunBusy) {
      flags.push('NO_CLEAN_DAY');
      explanations.push(
        isAway
          ? 'Full away/travel weekend — zero unscheduled home recovery day.'
          : 'One Clean Day Rule: Both Saturday & Sunday have commitments (no clean recovery day).'
      );
      status = 'YELLOW';
    }

    if (latestSun) {
      flags.push('LATE_SUNDAY_RETURN');
      explanations.push(`Late Sunday Return (${fmt12h(latestSun)} > 7:00 PM) — guard Monday ${MONTH_SHORT[mon.month - 1]} ${mon.day} AM.`);
      status = satBusy || latestSun >= '20:30' ? 'RED' : 'YELLOW';
      recommended_hold = {
        summary: '[Personal Margin] Post-Trip Monday Morning Recovery Buffer',
        start_iso: `${monStr}T08:00:00`,
        end_iso: `${monStr}T10:00:00`,
        reason: `Sunday ${sunStr} arrival at ${fmt12h(latestSun)} (> 7:00 PM).`
      };
    }

    slots.push({
      weekend_index: i + 1,
      saturday_date: satStr,
      sunday_date: sunStr,
      label: formatWeekendLabel(sat, sun),
      status,
      saturday_busy: satBusy,
      sunday_busy: sunBusy,
      is_away_weekend: isAway,
      sunday_return_time: latestSun,
      rule_flags: flags,
      rule_explanations: explanations,
      obligations: wkObls,
      recommended_hold
    });
  }

  const isHeavy = (s) => s.is_away_weekend || (s.saturday_busy && s.sunday_busy);
  for (let i = 0; i < slots.length; i++) {
    const prevH = i > 0 && isHeavy(slots[i - 1]);
    const nextH = i + 1 < slots.length && isHeavy(slots[i + 1]);
    if (isHeavy(slots[i]) && (prevH || nextH)) {
      if (!slots[i].rule_flags.includes('BACK_TO_BACK_STREAK')) {
        const partner = prevH ? slots[i - 1].label : slots[i + 1].label;
        slots[i].rule_flags.unshift('BACK_TO_BACK_STREAK');
        slots[i].rule_explanations.unshift(`Back-to-Back Streak Guard: Consecutive heavy weekend paired with ${partner}.`);
      }
      slots[i].status = 'RED';
      if (!slots[i].recommended_hold) {
        const openAfter = slots.slice(i + 1).find((cand) => !isHeavy(cand));
        if (openAfter) {
          slots[i].recommended_hold = {
            summary: '[Personal Margin] Protected Anchor Recovery Weekend',
            start_iso: `${openAfter.saturday_date}T09:00:00`,
            end_iso: `${openAfter.sunday_date}T18:00:00`,
            reason: `Protects anchor weekend (${openAfter.label}) after back-to-back streak.`
          };
        }
      }
    }
  }

  return slots;
}

// --- Client-Side Quick Paste Parser (Offline Ready) ---
function parsePasteOnDevice(title, startDate, endDate, returnTime, kind, rawText) {
  const confMatch = rawText.match(/(?:confirmation|conf|locator|booking|code)[:#\s]+([A-Z0-9]{5,10})/i);
  const gateMatch = rawText.match(/(?:gate|terminal|door\s+code|access\s+code|room)[:#\s]+([A-Z0-9\-]{1,12})/i);
  const addrMatch = rawText.match(/(?:address|location)[:\s]+([^\n]+)/i);
  const id = 'loc-' + Date.now().toString(36);

  if (kind === 'home_event') {
    return {
      trip: null,
      obligation: {
        event_id: `obl-${id}`,
        title,
        start_date: startDate,
        start_time: returnTime || '10:00',
        end_date: endDate,
        end_time: returnTime || '13:00',
        all_day: false,
        source: 'manual',
        is_away_travel: false
      }
    };
  }

  const trip = {
    trip_id: `trip-${id}`,
    title,
    destination: addrMatch ? addrMatch[1].trim() : title,
    start_date: startDate,
    end_date: endDate,
    return_arrival_time: returnTime || '',
    active_checklist: /lightning|drive|road/i.test(`${title} ${rawText}`) ? 'road_trip' : 'carry_on',
    parking: {
      facility_or_garage: '',
      level_row_spot: '',
      vehicle_or_rental_note: '',
      charger_or_return_note: ''
    },
    segments: [
      {
        segment_id: `seg-${id}`,
        kind: /hotel|airbnb|vrbo|check-in/i.test(rawText) && !/flight|mci/i.test(rawText) ? 'hotel' : 'flight',
        title,
        confirmation_code: confMatch ? confMatch[1].toUpperCase() : '',
        start_date: startDate,
        start_time: '',
        end_date: endDate,
        end_time: returnTime || '',
        location: addrMatch ? addrMatch[1].trim() : '',
        terminal_gate_or_door: gateMatch ? gateMatch[1] : '',
        notes: rawText.trim().slice(0, 220)
      }
    ]
  };
  return { trip, obligation: null };
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCleanFamilyShareText(trip, parking) {
  const lines = [
    `ITINERARY BRIEF: ${trip.title}`,
    `Dates: ${trip.start_date} to ${trip.end_date}${trip.destination ? ` (${trip.destination})` : ''}`,
    '--------------------------------------------'
  ];
  for (const s of trip.segments || []) {
    const tPart = s.start_time ? ` at ${fmt12h(s.start_time)}` : '';
    const endPart = s.end_time && s.end_time !== s.start_time ? ` -> ${fmt12h(s.end_time)}` : '';
    lines.push(`• [${String(s.kind || 'TRIP').toUpperCase()}] ${s.title}`);
    lines.push(`  Schedule: ${s.start_date || trip.start_date}${tPart}${endPart}`);
    if (s.confirmation_code) lines.push(`  Confirmation: ${s.confirmation_code}`);
    if (s.location) lines.push(`  Location: ${s.location}`);
    if (s.terminal_gate_or_door) lines.push(`  Gate / Access: ${s.terminal_gate_or_door}`);
  }
  if (parking && (parking.facility_or_garage || parking.level_row_spot)) {
    const p = [parking.facility_or_garage, parking.level_row_spot, parking.vehicle_or_rental_note].filter(Boolean).join(' • ');
    lines.push('--------------------------------------------');
    lines.push(`Parking / Vehicle: ${p}`);
  }
  return lines.join('\n');
}

// --- Main Application Controller ---
async function boot() {
  if (window.RollupBridge && !RollupBridge.enforceAccessGate('margin-brief', 'admin_only')) {
    return;
  }
  if (window.RollupBridge && RollupBridge.mountInAppConsolePill) {
    RollupBridge.mountInAppConsolePill({ appId: 'margin-brief', visibility: 'admin_only' });
  }

  await ensureTemporal();
  wireDialogs();
  wireCopyCommands();

  const root = document.getElementById('margin-root');
  root.hidden = false;

  let baseSnapshot = {
    reference_date: Temporal.Now.plainDateISO().toString(),
    weekends: [],
    trips: [],
    checklist_templates: DEFAULT_TEMPLATES
  };

  try {
    const resp = await fetch('./data/margin_snapshot.json');
    if (resp.ok) {
      baseSnapshot = await resp.json();
    }
  } catch {
    // Cached or empty fallback
  }

  let overlay = readOverlay();
  let activeTripId = null;

  function getMergedState() {
    const tripMap = new Map();
    for (const t of baseSnapshot.trips || []) tripMap.set(t.trip_id, structuredClone(t));
    for (const t of overlay.localTrips || []) tripMap.set(t.trip_id, structuredClone(t));
    const trips = Array.from(tripMap.values()).sort((a, b) => (a.start_date < b.start_date ? -1 : 1));

    const baseObls = [];
    for (const w of baseSnapshot.weekends || []) {
      for (const o of w.obligations || []) {
        if (!baseObls.some((x) => x.event_id === o.event_id)) baseObls.push(o);
      }
    }
    const allObls = [...baseObls, ...(overlay.localObligations || [])];
    const weekends = computeClientRadar(allObls, trips, baseSnapshot.reference_date);
    return { trips, weekends, templates: baseSnapshot.checklist_templates || DEFAULT_TEMPLATES };
  }

  async function stageHoldAction(hold, feedbackEl) {
    feedbackEl.textContent = 'Staging protective buffer...';
    try {
      const r = await fetch(`${getSapphireApiBase()}/api/margin-brief/stage-hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hold)
      });
      if (!r.ok) throw new Error('offline');
      feedbackEl.textContent = '✓ Staged in Sapphire Inbox (awaiting your 1-tap approval — nothing sent externally).';
    } catch {
      overlay.queuedHolds = overlay.queuedHolds || [];
      overlay.queuedHolds.push({ ...hold, queued_at: new Date().toISOString() });
      writeOverlay(overlay);
      feedbackEl.textContent = '✓ Saved offline hold in MarginBrief queue (will sync to Sapphire Inbox when online).';
    }
  }

  function renderAll() {
    const { trips, weekends, templates } = getMergedState();
    const g = weekends.filter((w) => w.status === 'GREEN').length;
    const y = weekends.filter((w) => w.status === 'YELLOW').length;
    const r = weekends.filter((w) => w.status === 'RED').length;
    const nextAnchor = (weekends.find((w) => w.status === 'GREEN') || {}).label || 'None in 6w';

    document.getElementById('kpi-green').textContent = String(g);
    document.getElementById('kpi-yellow').textContent = String(y);
    document.getElementById('kpi-red').textContent = String(r);
    document.getElementById('kpi-anchor').textContent = nextAnchor;

    const wkContainer = document.getElementById('weekend-cards-container');
    wkContainer.innerHTML = weekends
      .map((w, idx) => {
        const badgeText = w.status === 'GREEN' ? '🟢 PROTECTED' : w.status === 'YELLOW' ? '🟡 WATCH' : '🔴 OVERBOOKED';
        const satClass = w.saturday_busy ? 'busy' : 'open';
        const sunClass = w.sunday_busy ? 'busy' : 'open';
        const sunExtra = w.sunday_return_time ? ` (${fmt12h(w.sunday_return_time)})` : '';
        const rulesHtml = w.rule_explanations.length
          ? `<ul class="rule-list">${w.rule_explanations.map((e) => `<li>⚠️ ${escapeHtml(e)}</li>`).join('')}</ul>`
          : `<div style="font-size:11.5px;color:#86efac;margin-top:7px;">✓ Recovery margin intact.</div>`;
        const oblsHtml = w.obligations.length
          ? `<ul class="obl-list">${w.obligations
              .map(
                (o) =>
                  `<li><strong>${escapeHtml(o.title)}</strong> <span style="color:#94a3b8;">(${escapeHtml(o.start_date)}${
                    o.start_time ? ' ' + escapeHtml(fmt12h(o.start_time)) : ''
                  })</span></li>`
              )
              .join('')}</ul>`
          : '';
        const holdBtn = w.recommended_hold
          ? `<div style="margin-top:9px;">
               <button type="button" class="btn btn-hold" data-hold-idx="${idx}">🛡️ Stage Recovery Buffer Hold</button>
               <div class="toast-msg" id="hold-msg-${idx}"></div>
             </div>`
          : '';

        return `<article class="card wk-card" data-status="${w.status}">
          <div class="wk-top">
            <div class="wk-title">Wk ${w.weekend_index} &bull; ${escapeHtml(w.label)}</div>
            <span class="status-pill status-${w.status}">${badgeText}</span>
          </div>
          <div class="day-split">
            <div class="day-pill ${satClass}"><strong>Sat:</strong> ${w.saturday_busy ? 'Committed' : 'Clean / Open'}</div>
            <div class="day-pill ${sunClass}"><strong>Sun:</strong> ${w.sunday_busy ? 'Committed' + escapeHtml(sunExtra) : 'Clean / Open'}</div>
          </div>
          ${rulesHtml}
          ${oblsHtml}
          ${holdBtn}
        </article>`;
      })
      .join('');

    wkContainer.querySelectorAll('button[data-hold-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.getAttribute('data-hold-idx'));
        const w = weekends[i];
        if (w && w.recommended_hold) {
          stageHoldAction(w.recommended_hold, document.getElementById(`hold-msg-${i}`));
        }
      });
    });

    // Render Tab 2: Pocket Trip Dossier
    if (!activeTripId && trips.length) activeTripId = trips[0].trip_id;
    const switcher = document.getElementById('trip-switcher');
    const tripView = document.getElementById('active-trip-view');

    if (!trips.length) {
      switcher.innerHTML = '';
      tripView.innerHTML = `<div class="card"><p style="margin:0;color:#94a3b8;font-size:13px;">No active trips yet. Tap <strong>+ Add / Paste</strong> above (or drop a confirmation PDF/.ics in your workstation Dropzone) to create your 1-page offline brief.</p></div>`;
      return;
    }

    const activeTrip = trips.find((t) => t.trip_id === activeTripId) || trips[0];
    activeTripId = activeTrip.trip_id;

    switcher.innerHTML = trips
      .map(
        (t) =>
          `<button type="button" class="trip-pill" data-trip-id="${escapeHtml(t.trip_id)}" aria-pressed="${
            t.trip_id === activeTripId ? 'true' : 'false'
          }">${escapeHtml(t.title)}</button>`
      )
      .join('');

    switcher.querySelectorAll('.trip-pill').forEach((b) => {
      b.addEventListener('click', () => {
        activeTripId = b.getAttribute('data-trip-id');
        renderAll();
      });
    });

    const park = overlay.parkingByTrip[activeTrip.trip_id] || activeTrip.parking || {};
    const selTpl = overlay.checklistTemplateByTrip[activeTrip.trip_id] || activeTrip.active_checklist || 'carry_on';
    const tplObj = templates[selTpl] || DEFAULT_TEMPLATES.carry_on;
    const customItems = overlay.customItemsByTrip[activeTrip.trip_id] || activeTrip.custom_checklist_items || [];
    const allChkItems = [...(tplObj.items || []), ...customItems];
    const checkedMap = (overlay.checkedItemsByTrip[activeTrip.trip_id] || {})[selTpl] || {};
    const doneCount = allChkItems.filter((_, idx) => Boolean(checkedMap[idx])).length;

    const segsHtml = (activeTrip.segments || [])
      .map((s, sIdx) => {
        const confId = `conf-val-${sIdx}`;
        const doorId = `door-val-${sIdx}`;
        const mapsUrl = s.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.location)}` : '';
        return `<div class="seg-row">
          <div class="seg-kind">${escapeHtml(s.kind)} &bull; ${escapeHtml(s.start_date || activeTrip.start_date)}${
          s.start_time ? ' ' + escapeHtml(fmt12h(s.start_time)) : ''
        }${s.end_time && s.end_time !== s.start_time ? ' → ' + escapeHtml(fmt12h(s.end_time)) : ''}</div>
          <div style="font-size:14px;font-weight:700;margin-top:2px;">${escapeHtml(s.title)}</div>
          ${s.location ? `<div style="font-size:12px;color:#94a3b8;margin-top:2px;">📍 ${escapeHtml(s.location)}</div>` : ''}
          <div class="code-strip">
            ${
              s.confirmation_code
                ? `<span class="conf-box">Conf: <strong id="${confId}">${escapeHtml(s.confirmation_code)}</strong>
                     <span class="copy">
                       <button type="button" class="copy-button" command="--copy" commandfor="${confId}" aria-label="Copy confirmation code ${escapeHtml(
                    s.confirmation_code
                  )}"><span class="icon" aria-hidden="true"></span></button>
                       <span class="tip" role="status"></span>
                     </span>
                   </span>`
                : ''
            }
            ${
              s.terminal_gate_or_door
                ? `<span class="conf-box">Gate/Access: <strong id="${doorId}">${escapeHtml(s.terminal_gate_or_door)}</strong>
                     <span class="copy">
                       <button type="button" class="copy-button" command="--copy" commandfor="${doorId}" aria-label="Copy gate or door code"><span class="icon" aria-hidden="true"></span></button>
                       <span class="tip" role="status"></span>
                     </span>
                   </span>`
                : ''
            }
            ${
              mapsUrl
                ? `<a href="${mapsUrl}" target="_blank" rel="noopener" class="btn btn-ghost" style="text-decoration:none;padding:4px 9px;font-size:11.5px;min-block-size:26px;">🗺️ Open Maps</a>`
                : ''
            }
          </div>
        </div>`;
      })
      .join('');

    tripView.innerHTML = `
      <!-- BLOCK 1: Tap-to-Copy Confirmation Strip -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div>
            <div style="font-size:16px;font-weight:800;">${escapeHtml(activeTrip.title)}</div>
            <div class="sub">${escapeHtml(activeTrip.start_date)} to ${escapeHtml(activeTrip.end_date)}${
      activeTrip.return_arrival_time ? ` &bull; Return ${escapeHtml(fmt12h(activeTrip.return_arrival_time))}` : ''
    }</div>
          </div>
          <button type="button" class="btn btn-ghost" id="btn-open-share" style="font-size:11.5px;padding:6px 10px;">📤 Clean Share</button>
        </div>
        <div style="margin-top:8px;">${segsHtml}</div>
      </div>

      <!-- BLOCK 2: Offline Parking & Vehicle Pin -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:13.5px;">🅿️ Parking &amp; Vehicle Pin (Saved Offline)</strong>
          <span style="font-size:11px;color:#86efac;" id="park-saved-indicator">Auto-saved locally</span>
        </div>
        <div class="field-grid">
          <div>
            <label class="lbl" for="pk-garage">Garage / Lot</label>
            <input type="text" id="pk-garage" value="${escapeHtml(park.facility_or_garage || '')}" placeholder="e.g., MCI Garage" />
          </div>
          <div>
            <label class="lbl" for="pk-spot">Level / Row / Spot</label>
            <input type="text" id="pk-spot" value="${escapeHtml(park.level_row_spot || '')}" placeholder="e.g., Lvl 3 • Row E • 312" />
          </div>
          <div class="field-full">
            <label class="lbl" for="pk-note">Vehicle / Rental / Lightning Charge Note</label>
            <input type="text" id="pk-note" value="${escapeHtml(park.vehicle_or_rental_note || '')}" placeholder="e.g., Parked @ 78% SoC or Hertz Stall B12" />
          </div>
        </div>
      </div>

      <!-- BLOCK 3: Reusable Packing & House-Lockup Checklists -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <strong style="font-size:13.5px;">✅ Ready Check (${doneCount}/${allChkItems.length})</strong>
          <select id="chk-tpl-select" aria-label="Select checklist template" style="width:auto;padding:5px 8px;font-size:12px;">
            ${Object.values(templates)
              .map((tpl) => `<option value="${escapeHtml(tpl.id)}" ${tpl.id === selTpl ? 'selected' : ''}>${escapeHtml(tpl.label)}</option>`)
              .join('')}
          </select>
        </div>
        <ul class="chk-list">
          ${allChkItems
            .map(
              (item, idx) => `<li class="chk-item ${checkedMap[idx] ? 'done' : ''}">
                <input type="checkbox" id="chk-${idx}" data-chk-idx="${idx}" ${checkedMap[idx] ? 'checked' : ''} />
                <label for="chk-${idx}" style="flex:1;cursor:pointer;"><span>${escapeHtml(item)}</span></label>
              </li>`
            )
            .join('')}
        </ul>
        <form id="add-chk-form" style="display:flex;gap:7px;margin-top:10px;">
          <input type="text" id="new-chk-input" placeholder="Add trip-specific item..." aria-label="New checklist item" />
          <button type="submit" class="btn btn-ghost">Add</button>
          <button type="button" class="btn btn-ghost" id="reset-chk-btn">Reset</button>
        </form>
      </div>
    `;

    // Wire Parking auto-save
    const saveParking = () => {
      overlay.parkingByTrip[activeTrip.trip_id] = {
        facility_or_garage: document.getElementById('pk-garage').value.trim(),
        level_row_spot: document.getElementById('pk-spot').value.trim(),
        vehicle_or_rental_note: document.getElementById('pk-note').value.trim(),
        updated_at: new Date().toISOString()
      };
      writeOverlay(overlay);
      const ind = document.getElementById('park-saved-indicator');
      if (ind) ind.textContent = '✓ Saved on device';
    };
    ['pk-garage', 'pk-spot', 'pk-note'].forEach((id) => {
      document.getElementById(id).addEventListener('input', saveParking);
    });

    // Wire Checklist template switch, checkboxes, custom add, reset
    document.getElementById('chk-tpl-select').addEventListener('change', (e) => {
      overlay.checklistTemplateByTrip[activeTrip.trip_id] = e.target.value;
      writeOverlay(overlay);
      renderAll();
    });

    tripView.querySelectorAll('input[data-chk-idx]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const idx = Number(cb.getAttribute('data-chk-idx'));
        overlay.checkedItemsByTrip[activeTrip.trip_id] = overlay.checkedItemsByTrip[activeTrip.trip_id] || {};
        overlay.checkedItemsByTrip[activeTrip.trip_id][selTpl] = overlay.checkedItemsByTrip[activeTrip.trip_id][selTpl] || {};
        overlay.checkedItemsByTrip[activeTrip.trip_id][selTpl][idx] = cb.checked;
        writeOverlay(overlay);
        renderAll();
      });
    });

    document.getElementById('add-chk-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('new-chk-input').value.trim();
      if (!val) return;
      overlay.customItemsByTrip[activeTrip.trip_id] = [...customItems, val];
      writeOverlay(overlay);
      renderAll();
    });

    document.getElementById('reset-chk-btn').addEventListener('click', () => {
      if (overlay.checkedItemsByTrip[activeTrip.trip_id]) {
        overlay.checkedItemsByTrip[activeTrip.trip_id][selTpl] = {};
        writeOverlay(overlay);
        renderAll();
      }
    });

    // Wire 1-Tap Clean Family Share Modal
    document.getElementById('btn-open-share').addEventListener('click', () => {
      const shareText = buildCleanFamilyShareText(activeTrip, overlay.parkingByTrip[activeTrip.trip_id] || activeTrip.parking);
      document.getElementById('share-plain-preview').value = shareText;
      document.getElementById('share-modal').showModal();
    });
  }

  // Tab switching
  const tabRadar = document.getElementById('tab-btn-radar');
  const tabDossier = document.getElementById('tab-btn-dossier');
  const panelRadar = document.getElementById('panel-radar');
  const panelDossier = document.getElementById('panel-dossier');

  tabRadar.addEventListener('click', () => {
    tabRadar.setAttribute('aria-selected', 'true');
    tabDossier.setAttribute('aria-selected', 'false');
    panelRadar.hidden = false;
    panelDossier.hidden = true;
  });

  tabDossier.addEventListener('click', () => {
    tabDossier.setAttribute('aria-selected', 'true');
    tabRadar.setAttribute('aria-selected', 'false');
    panelDossier.hidden = false;
    panelRadar.hidden = true;
  });

  // Intake Modal
  const intakeModal = document.getElementById('intake-modal');
  document.getElementById('open-intake-btn').addEventListener('click', () => {
    const sat = upcomingSaturday(Temporal.Now.plainDateISO());
    const sun = sat.add({ days: 1 });
    document.getElementById('in-start-date').value = sat.toString();
    document.getElementById('in-end-date').value = sun.toString();
    intakeModal.showModal();
  });
  document.getElementById('close-intake-btn').addEventListener('click', () => intakeModal.close());
  document.getElementById('cancel-intake-btn').addEventListener('click', () => intakeModal.close());

  document.getElementById('intake-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('in-title').value.trim();
    const sDate = document.getElementById('in-start-date').value;
    const eDate = document.getElementById('in-end-date').value || sDate;
    const rTime = document.getElementById('in-return-time').value;
    const kind = document.getElementById('in-kind').value;
    const rawText = document.getElementById('in-raw-text').value;

    const { trip, obligation } = parsePasteOnDevice(title, sDate, eDate, rTime, kind, rawText);
    if (trip) {
      overlay.localTrips.push(trip);
      activeTripId = trip.trip_id;
    }
    if (obligation) {
      overlay.localObligations.push(obligation);
    }
    writeOverlay(overlay);
    intakeModal.close();
    e.target.reset();
    renderAll();

    // Opportunistically push to Sapphire backend if reachable
    if (rawText.trim()) {
      try {
        await fetch(`${getSapphireApiBase()}/api/margin-brief/parse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title_hint: title, raw_text: `${sDate} to ${eDate} ${rTime}\n${rawText}` })
        });
      } catch {
        // Offline-first: local overlay already saved
      }
    }
  });

  // Share Modal Buttons
  const shareModal = document.getElementById('share-modal');
  document.getElementById('close-share-btn').addEventListener('click', () => shareModal.close());
  document.getElementById('btn-native-share').addEventListener('click', async () => {
    const txt = document.getElementById('share-plain-preview').value;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Trip Itinerary', text: txt });
      } catch {
        // User cancelled share sheet
      }
    } else {
      await navigator.clipboard.writeText(txt);
    }
  });
  document.getElementById('btn-print-share').addEventListener('click', () => {
    const txt = document.getElementById('share-plain-preview').value;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<pre style="font-family:Segoe UI,sans-serif;font-size:14px;line-height:1.6;padding:24px;white-space:pre-wrap;">${escapeHtml(txt)}</pre>`);
      w.document.close();
      w.print();
    }
  });

  renderAll();
}

boot();
