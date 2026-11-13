/**
 * RollupOS Mobile Cartridge UI Controller — Adaptive Strength Trainer (`app.js`)
 * Age 46 Joint-Longevity 4-Block System • Wall-Clock Timers + WakeLock + Weight Memory + LAN Sync.
 */
(function () {
  'use strict';

  const APP_ID = 'adaptive-workout';
  window.ROLLUP_APP_ID = APP_ID;

  const Engine = window.AdaptiveWorkoutEngine;
  const Catalog = window.ADAPTIVE_WORKOUT_CATALOG;

  const hasBridge = Boolean(window.RollupBridge && window.RollupBridge.storage);

  // Enforce RollupOS multi-user access gate & mount top system strip when inside Hub
  if (hasBridge) {
    if (!window.RollupBridge.enforceAccessGate(APP_ID, 'restricted')) {
      return;
    }
    window.RollupBridge.mountInAppConsolePill({
      appId: APP_ID,
      visibility: 'restricted',
    });
  }

  // Storage helpers (RollupBridge isolated per-Google-user bucket + standalone fallback)
  function storageGet(key, fallbackVal) {
    if (hasBridge) {
      return window.RollupBridge.storage.get(key, fallbackVal, APP_ID);
    }
    try {
      const raw = localStorage.getItem(`adaptive_workout_standalone::${key}`);
      return raw != null ? JSON.parse(raw) : fallbackVal;
    } catch (e) {
      return fallbackVal;
    }
  }

  function storageSet(key, val) {
    if (hasBridge) {
      return window.RollupBridge.storage.set(key, val, APP_ID);
    }
    try {
      localStorage.setItem(`adaptive_workout_standalone::${key}`, JSON.stringify(val));
    } catch (e) {}
    return val;
  }

  function getUserConfig() {
    if (hasBridge && window.RollupBridge.user) {
      return window.RollupBridge.user.getAppConfig(APP_ID) || {};
    }
    return storageGet('__user_config__', {}) || {};
  }

  function saveUserConfig(patch) {
    if (hasBridge && window.RollupBridge.user) {
      return window.RollupBridge.user.setAppConfig(patch, APP_ID);
    }
    const next = { ...getUserConfig(), ...patch };
    storageSet('__user_config__', next);
    return next;
  }

  function isAdminProfile() {
    if (hasBridge && window.RollupBridge.auth) {
      const u = window.RollupBridge.auth.getCurrentUser();
      return Boolean(u && u.is_admin);
    }
    return true;
  }

  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg) {
    const host = document.getElementById('toast-container');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast-banner';
    el.textContent = msg;
    host.innerHTML = '';
    host.appendChild(el);
    setTimeout(() => {
      if (el.parentNode === host) el.remove();
    }, 3400);
  }

  // =========================================================================
  // Modern Web Guidance Progressive Enhancements (`switch`, `dialog`, `tabs`)
  // =========================================================================
  function initModernWebFallbacks() {
    // 1. Native <input type="checkbox" switch> progressive fallback for Chromium/Android WebView
    if (!('switch' in HTMLInputElement.prototype)) {
      document.querySelectorAll('input[type="checkbox"][switch]').forEach((inp) => {
        inp.setAttribute('role', 'switch');
        inp.setAttribute('data-switch-fallback', '');
        inp.setAttribute('aria-checked', String(inp.checked));
        inp.addEventListener('change', () => {
          inp.setAttribute('aria-checked', String(inp.checked));
        });
      });
    }

    // 2. Native <dialog closedby="any"> light-dismiss fallback (pointerdown + pointerup outside rect)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e, dlg) => {
        const r = dlg.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      document.querySelectorAll('dialog[closedby="any"]').forEach((dlg) => {
        let pressedOutside = false;
        dlg.addEventListener('pointerdown', (e) => {
          pressedOutside = outside(e, dlg);
        });
        dlg.addEventListener('pointerup', (e) => {
          if (pressedOutside && outside(e, dlg)) dlg.close();
        });
      });
    }

    // Reset dialog.returnValue on close per modern-web-guidance `dialog` rule
    const swapDlg = document.getElementById('swap-dialog');
    if (swapDlg) {
      swapDlg.addEventListener('close', () => {
        swapDlg.returnValue = '';
      });
    }

    // 3. Accessible Tablist (`focusgroup="tablist nomemory"` + `hidden="until-found"` + `beforematch`)
    const tablist = document.getElementById('main-tablist');
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('data-panel')));

    function selectTab(targetTab, moveFocus = false) {
      tabs.forEach((tab, idx) => {
        const isSel = tab === targetTab;
        tab.setAttribute('aria-selected', String(isSel));
        tab.toggleAttribute('focusgroupstart', isSel);
        if (!Object.hasOwn(HTMLElement.prototype, 'focusGroup')) {
          tab.tabIndex = isSel ? 0 : -1;
        }
        const panel = panels[idx];
        if (panel) {
          if (isSel) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', 'until-found');
          }
        }
      });
      if (moveFocus) targetTab.focus();
      try {
        targetTab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
      } catch (e) {
        targetTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }

      const panelId = targetTab.getAttribute('data-panel');
      if (panelId === 'panel-history') renderHistoryPanel();
      if (panelId === 'panel-weather') renderWeatherPanel(false);
      if (panelId === 'panel-sync') hydrateSyncInputs();
    }

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => selectTab(tab, false));
      const panel = panels[idx];
      if (panel) {
        panel.addEventListener('beforematch', () => selectTab(tab, false));
      }
    });

    // Keyboard roving fallback where native `focusgroup` is not yet active
    if (!Object.hasOwn(HTMLElement.prototype, 'focusGroup')) {
      tabs.forEach((t, i) => {
        t.tabIndex = i === 0 ? 0 : -1;
      });
      tablist.addEventListener('keydown', (ev) => {
        const curIdx = tabs.indexOf(document.activeElement);
        if (curIdx === -1) return;
        let nextIdx = -1;
        if (ev.key === 'ArrowRight') nextIdx = (curIdx + 1) % tabs.length;
        else if (ev.key === 'ArrowLeft') nextIdx = (curIdx - 1 + tabs.length) % tabs.length;
        else if (ev.key === 'Home') nextIdx = 0;
        else if (ev.key === 'End') nextIdx = tabs.length - 1;
        if (nextIdx !== -1) {
          ev.preventDefault();
          selectTab(tabs[nextIdx], true);
        }
      });
    }
  }

  // =========================================================================
  // Athlete State & Active Draft Management
  // =========================================================================
  function loadAthleteState() {
    let state = storageGet('athlete_state', null);
    if (!state) {
      const seed = isAdminProfile() ? Catalog.admin_seed_state : Catalog.tester_seed_state;
      state = JSON.parse(JSON.stringify(seed));
      state.exercise_logs = state.exercise_logs || {};
      state.active_swaps = state.active_swaps || {};
      storageSet('athlete_state', state);
    }
    return Engine.syncDualStateKeys(state);
  }

  function saveAthleteState(state) {
    const synced = Engine.syncDualStateKeys(state);
    storageSet('athlete_state', synced);
    return synced;
  }

  let athleteState = loadAthleteState();
  let currentMode = 'STANDARD';
  let previewSessionId = athleteState.next_session || 'A';
  let preEventDayIndex = 0; // 0 = Day 1, 1 = Day 2
  let ephemeralSwaps = {};  // Tonight-only exercise swaps

  // Draft tracks checked sets, entered weights/reps, and checked warmup items during a live session
  let sessionDraft = storageGet('active_workout_draft', {
    checkedPrep: {},
    sets: {},
    boostOpen: false,
  }) || { checkedPrep: {}, sets: {}, boostOpen: false };

  function saveDraft() {
    storageSet('active_workout_draft', sessionDraft);
  }

  // =========================================================================
  // WakeLock, Web Audio Bell & Wall-Clock Timers (Zero Drift on Screen Dim)
  // =========================================================================
  let wakeLockSentinel = null;
  let audioCtx = null;

  let clockState = {
    running: false,
    startedAtMs: 0,
    accumulatedMs: 0,
    capSeconds: 30 * 60,
  };

  let restState = {
    active: false,
    endAtMs: 0,
    durationSec: 0,
  };

  async function setScreenWakeLock(enable) {
    try {
      if (hasBridge && window.RollupBridge.usbSerial && typeof window.RollupBridge.usbSerial.setKeepScreenOn === 'function') {
        window.RollupBridge.usbSerial.setKeepScreenOn(Boolean(enable));
      }
    } catch (e) {}

    if (!('wakeLock' in navigator)) return;
    try {
      if (enable && !wakeLockSentinel) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
        });
      } else if (!enable && wakeLockSentinel) {
        await wakeLockSentinel.release();
        wakeLockSentinel = null;
      }
    } catch (e) {}
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && (clockState.running || restState.active)) {
      setScreenWakeLock(true);
      tickTimers();
    }
  });

  function playGymChime() {
    try {
      if (navigator.vibrate) {
        navigator.vibrate([180, 80, 240]);
      }
    } catch (e) {}
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      [880, 1174.66].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0.22, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.46);
      });
    } catch (e) {}
  }

  function formatMmSs(totalSeconds) {
    const abs = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function getElapsedClockSeconds() {
    const liveMs = clockState.running ? Date.now() - clockState.startedAtMs : 0;
    return Math.floor((clockState.accumulatedMs + liveMs) / 1000);
  }

  function startRestTimer(seconds, labelPrefix = '') {
    // Prime AudioContext inside user gesture so completion chime can play
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx && !audioCtx) audioCtx = new Ctx();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {}

    restState.active = true;
    restState.durationSec = Number(seconds);
    restState.endAtMs = Date.now() + Number(seconds) * 1000;
    restState.labelPrefix = labelPrefix || '';
    setScreenWakeLock(true);
    tickTimers();
  }

  function clearRestTimer() {
    restState.active = false;
    restState.endAtMs = 0;
    if (!clockState.running) setScreenWakeLock(false);
    tickTimers();
  }

  function tickTimers() {
    // 1. Session 30m Door-to-Door Clock
    const clockEl = document.getElementById('session-clock-display');
    const barEl = document.getElementById('session-clock-bar');
    const paceEl = document.getElementById('block-pacing-label');
    const toggleBtn = document.getElementById('btn-clock-toggle');

    const elapsedSec = getElapsedClockSeconds();
    const remainSec = clockState.capSeconds - elapsedSec;
    const pct = Math.min(100, (elapsedSec / Math.max(1, clockState.capSeconds)) * 100);

    if (clockEl) {
      if (remainSec >= 0) {
        clockEl.textContent = formatMmSs(remainSec);
        clockEl.classList.toggle('active', clockState.running);
        clockEl.classList.remove('overtime');
      } else {
        clockEl.textContent = '+' + formatMmSs(Math.abs(remainSec));
        clockEl.classList.add('overtime');
      }
    }
    if (barEl) barEl.style.width = `${pct.toFixed(1)}%`;
    if (toggleBtn) toggleBtn.textContent = clockState.running ? '⏸ Pause' : (elapsedSec > 0 ? '▶ Resume' : '▶ Start');

    if (paceEl && clockState.running) {
      const elapsedMin = elapsedSec / 60;
      if (currentMode === 'EXPRESS_MODE') {
        if (elapsedMin < 2) paceEl.textContent = 'Live Pace: Block 1 • Dynamic Joint Prep (0–2m)';
        else if (elapsedMin < 12) paceEl.textContent = 'Live Pace: Block 2 • Primary Compound (2–12m)';
        else paceEl.textContent = 'Live Pace: Block 3 • Lumbar Decompression (12–15m)';
      } else if (currentMode === 'TRAVEL_MODE') {
        if (elapsedMin < 3) paceEl.textContent = 'Live Pace: Block 1 • Hotel Room Mobility (0–3m)';
        else if (elapsedMin < 17) paceEl.textContent = 'Live Pace: Block 2 • Bodyweight Density Pairs (3–17m)';
        else paceEl.textContent = 'Live Pace: Block 3 • Decompression Cooldown (17–20m)';
      } else {
        if (elapsedMin < 4) paceEl.textContent = 'Live Pace: Block 1 • Dynamic Joint Prep (0:00–0:04)';
        else if (elapsedMin < 16) paceEl.textContent = 'Live Pace: Block 2 • Barbell Compound (0:04–0:16)';
        else if (elapsedMin < 27) paceEl.textContent = 'Live Pace: Block 3 • DB Superset • Zero Strip (0:16–0:27)';
        else paceEl.textContent = 'Live Pace: Block 4 • Hip & Lumbar Decompression (0:27–0:30)';
      }
    }

    // 2. Wall-Clock Rest Countdown
    const restEl = document.getElementById('rest-timer-display');
    const plusBtn = document.getElementById('btn-rest-plus15');
    const clrBtn = document.getElementById('btn-rest-clear');

    if (restState.active) {
      const remMs = restState.endAtMs - Date.now();
      if (remMs <= 0) {
        restState.active = false;
        playGymChime();
        if (restEl) restEl.textContent = '🔔 GO! Next Set Ready';
        if (plusBtn) plusBtn.hidden = true;
        if (clrBtn) clrBtn.hidden = true;
        if (!clockState.running) setScreenWakeLock(false);
      } else {
        const secLeft = Math.ceil(remMs / 1000);
        const prefix = restState.labelPrefix ? `${restState.labelPrefix} • ` : '';
        if (restEl) restEl.textContent = `${prefix}${formatMmSs(secLeft)}`;
        if (plusBtn) plusBtn.hidden = false;
        if (clrBtn) clrBtn.hidden = false;
      }
    } else if (restEl && !restEl.textContent.startsWith('🔔')) {
      restEl.textContent = 'Idle';
      if (plusBtn) plusBtn.hidden = true;
      if (clrBtn) clrBtn.hidden = true;
    }
  }

  setInterval(tickTimers, 250);

  // =========================================================================
  // Plan Resolution & Set Logger Rendering
  // =========================================================================
  function getActivePlan() {
    return Engine.getNextSessionPlan({
      state: athleteState,
      mode: currentMode === 'STANDARD' ? null : currentMode,
      previewSessionId,
      sessionSwaps: ephemeralSwaps,
      catalog: Catalog,
    });
  }

  function getDefaultLoadForExercise(exerciseName, defaultRepsText) {
    const logs = athleteState.exercise_logs || {};
    if (logs[exerciseName]) {
      return {
        weight: Number(logs[exerciseName].weight || 0),
        reps: Number(logs[exerciseName].reps || parseDefaultReps(defaultRepsText)),
        hint: `Last: ${logs[exerciseName].weight} lb × ${logs[exerciseName].reps} (${logs[exerciseName].date})`,
      };
    }
    return {
      weight: 0,
      reps: parseDefaultReps(defaultRepsText),
      hint: 'Tap +/- or type load — auto-saves for next cycle',
    };
  }

  function parseDefaultReps(repsText) {
    const m = /(\d+)/.exec(String(repsText || '8'));
    return m ? Number(m[1]) : 8;
  }

  function ensureDraftSetRow(setKey, exerciseName, defaultRepsText) {
    if (!sessionDraft.sets[setKey]) {
      const def = getDefaultLoadForExercise(exerciseName, defaultRepsText);
      sessionDraft.sets[setKey] = {
        exercise: exerciseName,
        weight: def.weight,
        reps: def.reps,
        done: false,
      };
    } else {
      sessionDraft.sets[setKey].exercise = exerciseName;
    }
    return sessionDraft.sets[setKey];
  }

  function renderWorkingExerciseWidget(opts) {
    const {
      keyPrefix,
      tag,
      exercise,
      swappedFrom,
      swapMechanism,
      equipment,
      workingSets,
      repsText,
      targetRpe,
      tempo,
      restSeconds,
      safetyNotes,
      isBlock3,
    } = opts;

    const baseNameForSwaps = swappedFrom || exercise;
    const swapGroup = Engine.getSwapsForExercise(baseNameForSwaps, {
      catalog: Catalog,
      isBlock3: Boolean(isBlock3),
    });

    const loadHint = getDefaultLoadForExercise(exercise, repsText).hint;
    const tagBadge = tag ? `<span class="badge badge-emerald">[${escHtml(tag)}]</span> ` : '';
    const swapBtnHtml = swapGroup && swapGroup.swaps.length > 0
      ? `<button type="button" class="btn btn-sm btn-sec js-open-swap" data-orig="${escHtml(baseNameForSwaps)}" data-cur="${escHtml(exercise)}" data-block3="${isBlock3 ? '1' : '0'}">🔄 Swap</button>`
      : '';

    const setRowsHtml = [];
    for (let i = 1; i <= workingSets; i++) {
      const setKey = `${keyPrefix}::set_${i}`;
      const row = ensureDraftSetRow(setKey, exercise, repsText);
      setRowsHtml.push(`
        <div class="set-row ${row.done ? 'done' : ''}" data-set-key="${escHtml(setKey)}">
          <div class="set-label">SET ${i}</div>
          <div class="stepper-box" aria-label="Weight in pounds">
            <button type="button" class="step-btn js-step-weight" data-set-key="${escHtml(setKey)}" data-delta="-5" aria-label="Decrease weight 5 lb">−</button>
            <input type="number" inputmode="decimal" class="step-input js-input-weight" data-set-key="${escHtml(setKey)}" value="${row.weight}" aria-label="Set ${i} weight lb" title="Weight (lb)">
            <button type="button" class="step-btn js-step-weight" data-set-key="${escHtml(setKey)}" data-delta="5" aria-label="Increase weight 5 lb">+</button>
          </div>
          <div class="stepper-box" aria-label="Completed reps">
            <button type="button" class="step-btn js-step-reps" data-set-key="${escHtml(setKey)}" data-delta="-1" aria-label="Decrease reps">−</button>
            <input type="number" inputmode="numeric" class="step-input js-input-reps" data-set-key="${escHtml(setKey)}" value="${row.reps}" aria-label="Set ${i} reps" title="Reps">
            <button type="button" class="step-btn js-step-reps" data-set-key="${escHtml(setKey)}" data-delta="1" aria-label="Increase reps">+</button>
          </div>
          <button type="button" class="set-done-btn js-toggle-set" data-set-key="${escHtml(setKey)}" data-rest="${Number(restSeconds || 0)}" data-label="${escHtml(tag || 'Set ' + i)}">
            ${row.done ? '✓ Done' : 'Log lb/rep'}
          </button>
        </div>
      `);
    }

    return `
      <div style="margin-top:10px;padding-top:8px;border-top:1px solid #1f2937;">
        <div class="exercise-header">
          <div>
            <div class="exercise-name">${tagBadge}${escHtml(exercise)}</div>
            <div class="cue-line">
              <strong>${workingSets} sets × ${escHtml(repsText)}</strong>
              ${targetRpe ? ` • RPE ${escHtml(targetRpe)}` : ''}
              ${tempo ? ` • Tempo <code>${escHtml(tempo)}</code>` : ''}
              • Rest ${Number(restSeconds || 0)}s
            </div>
            ${equipment ? `<div class="cue-line">Equipment: ${escHtml(equipment)}</div>` : ''}
            <div class="cue-line" style="color:#6ee7b7;">💾 ${escHtml(loadHint)}</div>
          </div>
          ${swapBtnHtml}
        </div>
        ${swappedFrom ? `<div class="safety-banner">🔄 Joint Swap Active (replacing <em>${escHtml(swappedFrom)}</em>): ${escHtml(swapMechanism || 'Joint-friendly home-gym alternative')}</div>` : ''}
        ${safetyNotes ? `<div class="safety-banner">🛡️ <strong>Safety:</strong> ${escHtml(safetyNotes)}</div>` : ''}
        <div class="set-grid">${setRowsHtml.join('')}</div>
      </div>
    `;
  }

  function renderBlockCard(block, scopePrefix) {
    if (!block || typeof block !== 'object') return '';
    const num = block.block_number || '';
    const timeRange = block.start_time && block.end_time ? `${block.start_time}–${block.end_time}` : '';
    const durTxt = block.duration_minutes ? `${block.duration_minutes} min` : '';

    let innerHtml = '';

    // Zero-strip rule banner on Block 3
    if (block.barbell_rule) {
      innerHtml += `<div class="zero-strip-banner">🔒 ${escHtml(block.barbell_rule)}</div>`;
    }

    // Primary single compound (Block 2)
    if (block.exercise) {
      innerHtml += renderWorkingExerciseWidget({
        keyPrefix: `${scopePrefix}::b${num}`,
        tag: '',
        exercise: block.exercise,
        swappedFrom: block.swapped_from,
        swapMechanism: block.swap_mechanism,
        equipment: block.equipment,
        workingSets: Number(block.working_sets || 3),
        repsText: block.reps || '6-8',
        targetRpe: block.target_rpe,
        tempo: block.tempo,
        restSeconds: Number(block.rest_seconds != null ? block.rest_seconds : 90),
        safetyNotes: block.safety_notes,
        isBlock3: false,
      });
    }

    // Antagonistic Superset Pairs (Block 3)
    if (Array.isArray(block.superset_pairs)) {
      innerHtml += block.superset_pairs
        .map((pair, idx) =>
          renderWorkingExerciseWidget({
            keyPrefix: `${scopePrefix}::b${num}::${pair.tag || idx}`,
            tag: pair.tag,
            exercise: pair.exercise,
            swappedFrom: pair.swapped_from,
            swapMechanism: pair.swap_mechanism,
            equipment: pair.equipment,
            workingSets: Number(pair.working_sets || 3),
            repsText: pair.reps || '8-10',
            targetRpe: pair.target_rpe || '',
            tempo: pair.tempo,
            restSeconds: Number(pair.rest_seconds != null ? pair.rest_seconds : 60),
            safetyNotes: pair.safety_notes,
            isBlock3: true,
          })
        )
        .join('');
    }

    // Exercises array (either Warmup/Decompression checklist OR Travel Mode working pairs)
    if (Array.isArray(block.exercises)) {
      const hasWorkingSets = block.exercises.some((it) => it && it.working_sets != null);
      if (hasWorkingSets) {
        innerHtml += block.exercises
          .map((item, idx) =>
            renderWorkingExerciseWidget({
              keyPrefix: `${scopePrefix}::b${num}::t${idx}`,
              tag: item.tag || `T${idx + 1}`,
              exercise: item.exercise || item.name,
              equipment: item.equipment || 'Bodyweight / Hotel',
              workingSets: Number(item.working_sets || 2),
              repsText: item.reps || item.duration || '10-12',
              targetRpe: item.target_rpe || 7.0,
              tempo: item.tempo,
              restSeconds: Number(item.rest_seconds != null ? item.rest_seconds : 45),
              safetyNotes: item.notes,
              isBlock3: true,
            })
          )
          .join('');
      } else {
        innerHtml += block.exercises
          .map((item, idx) => {
            const pKey = `${scopePrefix}::prep::b${num}_${idx}`;
            const checked = Boolean(sessionDraft.checkedPrep[pKey]);
            const name = item.name || item.exercise || 'Movement';
            const spec = item.reps || item.duration || '';
            const durMatch = /(\d+)\s*s\b/i.exec(spec);
            const quickSec = durMatch ? Number(durMatch[1]) : 0;
            const timerBtn = quickSec > 0
              ? `<button type="button" class="btn btn-sm btn-sec js-quick-hang" data-sec="${quickSec}" data-name="${escHtml(name)}">⏱️ ${quickSec}s</button>`
              : `<span style="font-size:13px;font-weight:800;color:${checked ? '#10b981' : '#64748b'};">${checked ? '✓' : '○'}</span>`;

            return `
              <div class="prep-item ${checked ? 'checked' : ''} js-toggle-prep" data-prep-key="${escHtml(pKey)}">
                <div>
                  <div style="font-size:13.5px;font-weight:700;">${escHtml(name)} <span style="color:#38bdf8;font-weight:700;">• ${escHtml(spec)}</span></div>
                  ${item.notes || item.load ? `<div style="font-size:11.5px;color:#94a3b8;">${escHtml(item.notes || item.load)}</div>` : ''}
                </div>
                ${timerBtn}
              </div>
            `;
          })
          .join('');
      }
    }

    return `
      <article class="card">
        <div class="block-kicker">
          <span>Block ${escHtml(num)} ${timeRange ? `(${escHtml(timeRange)})` : ''}</span>
          <span>${escHtml(durTxt)}</span>
        </div>
        <h2 class="block-title">${escHtml(block.name || 'Training Block')}</h2>
        ${innerHtml}
      </article>
    `;
  }

  function renderLiftWorkspace() {
    const plan = getActivePlan();
    const scheduledId = athleteState.next_session || 'A';
    const lastDate = athleteState.last_completed_date;
    const daysElapsed = lastDate ? Engine.calculateLayoff(lastDate) : 0;
    const isRampUp = Boolean(plan.active_ramp_up || plan.is_ramp_up || athleteState.active_ramp_up);

    // Sync clock cap when idle
    if (!clockState.running && clockState.accumulatedMs === 0) {
      const capMin = Number(plan.duration_minutes || 30);
      clockState.capSeconds = capMin * 60;
      tickTimers();
    }

    // Header badges
    document.getElementById('next-up-pill').textContent = `Next: ${scheduledId}`;
    document.getElementById('layoff-badge').textContent = lastDate
      ? `${daysElapsed}d since ${lastDate}`
      : 'Fresh Profile • Day 0';

    const jumpBtn = document.getElementById('btn-jump-scheduled');
    if (jumpBtn) {
      jumpBtn.hidden = !(currentMode === 'STANDARD' && previewSessionId !== scheduledId);
    }

    // Ramp-Up Banner (>7d layoff or active multi-session ramp-up)
    const rampBanner = document.getElementById('ramp-up-banner');
    if (isRampUp && currentMode !== 'TRAVEL_MODE' && currentMode !== 'PRE_EVENT_COMPRESSION') {
      const rem = athleteState.ramp_up_sessions_remaining || athleteState.weekly_lift_target || 3;
      rampBanner.hidden = false;
      rampBanner.className = 'card card-amber';
      rampBanner.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <span class="badge badge-amber">🛡️ Post-Break Ramp-Up Active</span>
          <span style="font-size:11.5px;color:#fde68a;font-weight:700;">${daysElapsed}d layoff • ${rem} ramp session(s)</span>
        </div>
        <div style="font-size:12.5px;color:#fef3c7;margin-top:6px;">
          Working volume automatically scaled to <strong>2 sets per exercise (6 sets total) @ RPE 6.5 cap</strong> to protect tendons &amp; lumbar spine.
        </div>
      `;
      document.getElementById('input-session-rpe').value = '6.5';
    } else {
      rampBanner.hidden = true;
      document.getElementById('input-session-rpe').value = '7.5';
    }

    // Update Mode Pills
    document.querySelectorAll('#mode-selector-row .pill-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === currentMode);
    });

    // Update Session / Day Selector Row
    const sessRow = document.getElementById('session-selector-row');
    const rotHeading = document.getElementById('rotation-selector-heading');
    if (currentMode === 'PRE_EVENT_COMPRESSION' && Array.isArray(plan.days)) {
      rotHeading.textContent = '2-Day Merged Compression Split';
      sessRow.innerHTML = plan.days
        .map(
          (d, idx) => `
          <button type="button" class="pill-btn ${idx === preEventDayIndex ? 'active' : ''}" data-preevent-idx="${idx}">
            ${escHtml(d.name)}
          </button>`
        )
        .join('');
    } else if (currentMode === 'TRAVEL_MODE') {
      rotHeading.textContent = 'Equipment: Bodyweight / Hotel Room (20m Cap)';
      sessRow.innerHTML = `<span class="badge badge-emerald">✈️ Zero Barbell / Hotel Circuit Active</span>`;
    } else {
      rotHeading.textContent = `Modulo Rotation (Scheduled: Session ${scheduledId})`;
      const labels = {
        A: 'Session A • Push/Pull',
        B: 'Session B • Squat/Core',
        C: 'Session C • OHP/Posture',
        D: 'Session D • Hinge/Carry',
      };
      sessRow.innerHTML = Engine.SESSIONS.map(
        (id) => `
          <button type="button" class="pill-btn ${id === previewSessionId ? 'active' : ''}" data-session="${id}">
            ${id === scheduledId ? '★ ' : ''}${labels[id]}
          </button>`
      ).join('');
    }

    // Render Blocks
    const host = document.getElementById('workout-blocks-container');
    let activePlanSlice = plan;
    let scopeKey = `${currentMode}::${previewSessionId}`;
    if (currentMode === 'PRE_EVENT_COMPRESSION' && Array.isArray(plan.days)) {
      activePlanSlice = plan.days[preEventDayIndex] || plan.days[0];
      scopeKey = `PRE_EVENT::DAY_${preEventDayIndex + 1}`;
    } else if (currentMode === 'TRAVEL_MODE') {
      scopeKey = 'TRAVEL_MODE';
    }

    const blocksObj = activePlanSlice.blocks || {};
    const blocksArr = Array.isArray(blocksObj) ? blocksObj : Object.values(blocksObj);
    let html = blocksArr.map((b) => renderBlockCard(b, scopeKey)).join('');

    // Optional <boost> 3-Minute Finisher Card
    if (activePlanSlice.boost) {
      const boost = activePlanSlice.boost;
      const items = boost.superset || boost.exercises || [];
      const itemsHtml = items
        .map((it) => {
          const spec = it.sets && it.reps
            ? `${it.sets} × ${it.reps}`
            : `${it.sets ? it.sets + ' × ' : ''}${it.duration || it.reps || ''}`;
          return `<div style="padding:5px 0;font-size:13px;">• <strong>${escHtml(it.exercise)}</strong> — <span style="color:#38bdf8;">${escHtml(spec)}</span></div>`;
        })
        .join('');
      html += `
        <article class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div class="kicker">Optional &lt;boost&gt; Block (${boost.duration_minutes || 3} min)</div>
              <h3 style="margin:2px 0 0 0;font-size:14.5px;">⚡ ${escHtml(boost.title)}</h3>
            </div>
            <button type="button" class="btn btn-sm btn-sec" id="btn-toggle-boost">
              ${sessionDraft.boostOpen ? 'Hide' : 'Show'}
            </button>
          </div>
          ${
            sessionDraft.boostOpen
              ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #1f2937;">
                   <div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">${escHtml(boost.description || '')}</div>
                   ${itemsHtml}
                 </div>`
              : ''
          }
        </article>
      `;
    }

    host.innerHTML = html;

    // Update Complete Session footer label & set counter
    const completeLabel =
      currentMode === 'TRAVEL_MODE'
        ? 'Complete Travel Session'
        : currentMode === 'PRE_EVENT_COMPRESSION'
        ? `Complete ${activePlanSlice.name}`
        : currentMode === 'EXPRESS_MODE'
        ? `Complete Express Session ${previewSessionId} → Advance to ${Engine.rotateSession(previewSessionId)}`
        : `Complete Session ${previewSessionId} → Advance to ${Engine.rotateSession(previewSessionId)}`;
    document.getElementById('complete-card-heading').textContent = completeLabel;
    updateCompletedSetCounter(scopeKey, activePlanSlice);
  }

  function updateCompletedSetCounter(scopeKey, activePlanSlice) {
    const prefix = `${scopeKey}::`;
    const matching = Object.entries(sessionDraft.sets).filter(([k]) => k.startsWith(prefix));
    const doneCount = matching.filter(([, v]) => v && v.done).length;
    const totalCount = matching.length || Number(activePlanSlice.total_working_sets || 9);
    const el = document.getElementById('sets-completed-counter');
    if (el) el.textContent = `${doneCount} / ${totalCount} sets checked`;
  }

  // =========================================================================
  // Event Delegation for Lift Deck & Swap Modal
  // =========================================================================
  let activeSwapContext = null;

  function openSwapModal(origExercise, currentExercise, isBlock3) {
    const group = Engine.getSwapsForExercise(origExercise, { catalog: Catalog, isBlock3 });
    if (!group) return;
    activeSwapContext = { origExercise, currentExercise, isBlock3 };

    const dlg = document.getElementById('swap-dialog');
    document.getElementById('swap-dialog-title').textContent = `Swap: ${group.original_exercise}`;
    document.getElementById('swap-dialog-risks').innerHTML =
      `<strong>Joint Protection Targets:</strong> ${(group.risk_factors || []).map(escHtml).join(' • ')}`;

    const optsHost = document.getElementById('swap-dialog-options');
    optsHost.innerHTML = group.swaps
      .map(
        (sw) => `
        <button type="button" class="swap-option ${sw.replacement === currentExercise ? 'selected' : ''} js-pick-swap" data-replacement="${escHtml(sw.replacement)}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <strong style="font-size:14px;color:#ecfdf5;">${escHtml(sw.replacement)}</strong>
            <span class="badge badge-emerald">Tempo ${escHtml(sw.tempo)}</span>
          </div>
          <div style="font-size:11.5px;color:#38bdf8;margin-top:3px;">Equipment: ${escHtml((sw.equipment || []).join(', '))}</div>
          <div style="font-size:12px;color:#cbd5e1;margin-top:4px;">${escHtml(sw.mechanism)}</div>
        </button>
      `
      )
      .join('');

    const persistBox = document.getElementById('swap-persist-default');
    persistBox.checked = Boolean(athleteState.active_swaps && athleteState.active_swaps[origExercise]);
    dlg.showModal();
  }

  function bindGlobalEvents() {
    // Clock Start/Pause & Reset
    document.getElementById('btn-clock-toggle').addEventListener('click', () => {
      if (clockState.running) {
        clockState.accumulatedMs += Date.now() - clockState.startedAtMs;
        clockState.running = false;
        if (!restState.active) setScreenWakeLock(false);
      } else {
        clockState.startedAtMs = Date.now();
        clockState.running = true;
        setScreenWakeLock(true);
      }
      tickTimers();
    });

    document.getElementById('btn-clock-reset').addEventListener('click', () => {
      clockState.running = false;
      clockState.startedAtMs = 0;
      clockState.accumulatedMs = 0;
      if (!restState.active) setScreenWakeLock(false);
      renderLiftWorkspace();
      tickTimers();
    });

    // Rest Timer Quick Buttons
    document.querySelectorAll('[data-rest-sec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        startRestTimer(Number(btn.getAttribute('data-rest-sec')), 'Rest');
      });
    });

    document.getElementById('btn-rest-plus15').addEventListener('click', () => {
      if (restState.active) {
        restState.endAtMs += 15000;
        tickTimers();
      }
    });

    document.getElementById('btn-rest-clear').addEventListener('click', clearRestTimer);

    // Mode Selector
    document.getElementById('mode-selector-row').addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-mode]');
      if (!btn) return;
      currentMode = btn.getAttribute('data-mode');
      clockState.running = false;
      clockState.accumulatedMs = 0;
      renderLiftWorkspace();
    });

    // Session / Pre-Event Day Selector
    document.getElementById('session-selector-row').addEventListener('click', (ev) => {
      const sBtn = ev.target.closest('[data-session]');
      if (sBtn) {
        previewSessionId = sBtn.getAttribute('data-session');
        renderLiftWorkspace();
        return;
      }
      const pBtn = ev.target.closest('[data-preevent-idx]');
      if (pBtn) {
        preEventDayIndex = Number(pBtn.getAttribute('data-preevent-idx'));
        renderLiftWorkspace();
      }
    });

    document.getElementById('btn-jump-scheduled').addEventListener('click', () => {
      previewSessionId = athleteState.next_session || 'A';
      renderLiftWorkspace();
    });

    // Delegated Workout Block Actions (Steppers, Set Done, Prep Check, Swap, Quick Hang Timer)
    const blocksHost = document.getElementById('workout-blocks-container');
    blocksHost.addEventListener('click', (ev) => {
      const hangBtn = ev.target.closest('.js-quick-hang');
      if (hangBtn) {
        ev.stopPropagation();
        startRestTimer(Number(hangBtn.getAttribute('data-sec')), hangBtn.getAttribute('data-name'));
        return;
      }

      const prepRow = ev.target.closest('.js-toggle-prep');
      if (prepRow) {
        const pk = prepRow.getAttribute('data-prep-key');
        sessionDraft.checkedPrep[pk] = !sessionDraft.checkedPrep[pk];
        saveDraft();
        renderLiftWorkspace();
        return;
      }

      const wBtn = ev.target.closest('.js-step-weight');
      if (wBtn) {
        const sk = wBtn.getAttribute('data-set-key');
        const delta = Number(wBtn.getAttribute('data-delta'));
        const row = sessionDraft.sets[sk];
        if (row) {
          row.weight = Math.max(0, Number(row.weight || 0) + delta);
          saveDraft();
          const inp = blocksHost.querySelector(`.js-input-weight[data-set-key="${CSS.escape(sk)}"]`);
          if (inp) inp.value = row.weight;
        }
        return;
      }

      const rBtn = ev.target.closest('.js-step-reps');
      if (rBtn) {
        const sk = rBtn.getAttribute('data-set-key');
        const delta = Number(rBtn.getAttribute('data-delta'));
        const row = sessionDraft.sets[sk];
        if (row) {
          row.reps = Math.max(0, Number(row.reps || 0) + delta);
          saveDraft();
          const inp = blocksHost.querySelector(`.js-input-reps[data-set-key="${CSS.escape(sk)}"]`);
          if (inp) inp.value = row.reps;
        }
        return;
      }

      const doneBtn = ev.target.closest('.js-toggle-set');
      if (doneBtn) {
        const sk = doneBtn.getAttribute('data-set-key');
        const restSec = Number(doneBtn.getAttribute('data-rest') || 0);
        const lbl = doneBtn.getAttribute('data-label') || 'Rest';
        const row = sessionDraft.sets[sk];
        if (row) {
          row.done = !row.done;
          saveDraft();
          if (row.done && !clockState.running && clockState.accumulatedMs === 0) {
            clockState.startedAtMs = Date.now();
            clockState.running = true;
            setScreenWakeLock(true);
          }
          if (row.done && restSec > 0) {
            startRestTimer(restSec, `${lbl} Rest`);
          }
          renderLiftWorkspace();
        }
        return;
      }

      const swapBtn = ev.target.closest('.js-open-swap');
      if (swapBtn) {
        openSwapModal(
          swapBtn.getAttribute('data-orig'),
          swapBtn.getAttribute('data-cur'),
          swapBtn.getAttribute('data-block3') === '1'
        );
        return;
      }

      if (ev.target.closest('#btn-toggle-boost')) {
        sessionDraft.boostOpen = !sessionDraft.boostOpen;
        saveDraft();
        renderLiftWorkspace();
      }
    });

    blocksHost.addEventListener('change', (ev) => {
      if (ev.target.classList.contains('js-input-weight')) {
        const sk = ev.target.getAttribute('data-set-key');
        if (sessionDraft.sets[sk]) {
          sessionDraft.sets[sk].weight = Math.max(0, Number(ev.target.value || 0));
          saveDraft();
        }
      } else if (ev.target.classList.contains('js-input-reps')) {
        const sk = ev.target.getAttribute('data-set-key');
        if (sessionDraft.sets[sk]) {
          sessionDraft.sets[sk].reps = Math.max(0, Number(ev.target.value || 0));
          saveDraft();
        }
      }
    });

    // Swap Dialog Option Selection & Restore
    document.getElementById('swap-dialog-options').addEventListener('click', (ev) => {
      const opt = ev.target.closest('.js-pick-swap');
      if (!opt || !activeSwapContext) return;
      const chosen = opt.getAttribute('data-replacement');
      const persist = document.getElementById('swap-persist-default').checked;
      const orig = activeSwapContext.origExercise;

      ephemeralSwaps[orig] = chosen;
      if (persist) {
        athleteState.active_swaps = athleteState.active_swaps || {};
        athleteState.active_swaps[orig] = chosen;
        saveAthleteState(athleteState);
      }
      document.getElementById('swap-dialog').close('swapped');
      renderLiftWorkspace();
      showToast(`Swapped to ${chosen}`);
    });

    document.getElementById('btn-swap-restore-original').addEventListener('click', () => {
      if (!activeSwapContext) return;
      const orig = activeSwapContext.origExercise;
      delete ephemeralSwaps[orig];
      if (athleteState.active_swaps) {
        delete athleteState.active_swaps[orig];
        saveAthleteState(athleteState);
      }
      document.getElementById('swap-dialog').close('restored');
      renderLiftWorkspace();
      showToast(`Restored ${orig}`);
    });

    // Complete Session
    document.getElementById('btn-complete-session').addEventListener('click', handleCompleteSession);

    // Weather Radar Controls
    const runSwitch = document.getElementById('run-toggle-switch');
    runSwitch.checked = String(athleteState.run_toggle || 'OFF').toUpperCase() === 'ON';
    if (runSwitch.hasAttribute('data-switch-fallback')) {
      runSwitch.setAttribute('aria-checked', String(runSwitch.checked));
    }
    runSwitch.addEventListener('change', () => {
      const val = runSwitch.checked ? 'ON' : 'OFF';
      athleteState.run_toggle = val;
      athleteState.RUN_TOGGLE = val;
      athleteState.updated_at = new Date().toISOString();
      saveAthleteState(athleteState);
      renderWeatherPanel(true);
    });

    document.getElementById('btn-refresh-weather').addEventListener('click', () => renderWeatherPanel(true));

    // History Export / Import
    document.getElementById('btn-export-json').addEventListener('click', () => {
      const fname = `adaptive_workout_state_${Engine.todayLocalIso()}.json`;
      if (hasBridge && window.RollupBridge.files) {
        window.RollupBridge.files.exportJSON(fname, athleteState);
      } else {
        const blob = new Blob([JSON.stringify(athleteState, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fname;
        a.click();
      }
      showToast('Exported workout_state JSON backup');
    });

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      const rows = (athleteState.history || []).map((h) => ({
        date: h.date,
        session_id: h.session_id,
        duration_minutes: h.duration_minutes,
        total_working_sets: h.total_working_sets,
        rpe_achieved: h.rpe_achieved,
        notes: h.notes || '',
      }));
      if (!rows.length) {
        showToast('No completed sessions to export yet');
        return;
      }
      const fname = `adaptive_workout_history_${Engine.todayLocalIso()}.csv`;
      if (hasBridge && window.RollupBridge.files) {
        window.RollupBridge.files.exportCSV(fname, rows);
      }
      showToast('Exported workout history CSV');
    });

    const fileInp = document.getElementById('file-import-json');
    document.getElementById('btn-import-json').addEventListener('click', () => fileInp.click());
    fileInp.addEventListener('change', () => {
      const f = fileInp.files && fileInp.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          athleteState = Engine.mergeWorkoutStates(athleteState, parsed, 'merge');
          saveAthleteState(athleteState);
          previewSessionId = athleteState.next_session || 'A';
          renderLiftWorkspace();
          renderHistoryPanel();
          showToast(`Imported & merged state (Next: Session ${athleteState.next_session})`);
        } catch (err) {
          showToast('Invalid JSON state file');
        }
      };
      reader.readAsText(f);
      fileInp.value = '';
    });

    // PC Sync Controls
    document.getElementById('btn-save-sync-urls').addEventListener('click', () => {
      const u1 = document.getElementById('input-sync-url').value.trim();
      const u2 = document.getElementById('input-sync-url-alt').value.trim();
      saveUserConfig({ primary_sync_url: u1, secondary_sync_url: u2 });
      showToast('Saved PC Sync endpoints');
    });

    document.getElementById('btn-ping-pc').addEventListener('click', testPcConnection);
    document.getElementById('btn-sync-merge').addEventListener('click', () => runPcSync('merge'));
    document.getElementById('btn-sync-push').addEventListener('click', () => runPcSync('push'));
    document.getElementById('btn-sync-pull').addEventListener('click', () => runPcSync('pull'));
  }

  async function handleCompleteSession() {
    const plan = getActivePlan();
    let scopeKey = `${currentMode}::${previewSessionId}`;
    let doneSessionId = previewSessionId;
    let advanceRotation = true;
    let defaultDuration = Number(plan.duration_minutes || 30);

    if (currentMode === 'TRAVEL_MODE') {
      scopeKey = 'TRAVEL_MODE';
      doneSessionId = 'TRAVEL';
      advanceRotation = false;
    } else if (currentMode === 'PRE_EVENT_COMPRESSION' && Array.isArray(plan.days)) {
      scopeKey = `PRE_EVENT::DAY_${preEventDayIndex + 1}`;
      doneSessionId = preEventDayIndex === 0 ? 'AB' : 'CD';
      advanceRotation = false;
    }

    const matchingSets = Object.entries(sessionDraft.sets)
      .filter(([k]) => k.startsWith(`${scopeKey}::`))
      .map(([, val]) => val);

    const loggedSets = matchingSets.filter((r) => r.done || Number(r.weight) > 0);
    const completedSetsCount = matchingSets.filter((r) => r.done).length || matchingSets.length || 9;
    const elapsedMin = Math.round(getElapsedClockSeconds() / 60);
    const actualDuration = elapsedMin >= 3 && elapsedMin <= 60 ? elapsedMin : defaultDuration;
    const rpeAchieved = Number(document.getElementById('input-session-rpe').value || 7.5);
    const notesInput = document.getElementById('input-session-notes');
    const customNote = notesInput.value.trim();

    athleteState = Engine.completeSession({
      state: athleteState,
      completionDate: Engine.todayLocalIso(),
      sessionId: doneSessionId,
      notes: customNote || undefined,
      durationMinutes: actualDuration,
      totalWorkingSets: Math.min(11, completedSetsCount),
      rpeAchieved,
      loggedSets,
      advanceRotation,
    });
    saveAthleteState(athleteState);

    // Clear tonight's sets for this scope & stop clock
    Object.keys(sessionDraft.sets).forEach((k) => {
      if (k.startsWith(`${scopeKey}::`)) delete sessionDraft.sets[k];
    });
    Object.keys(sessionDraft.checkedPrep).forEach((k) => {
      if (k.startsWith(`${scopeKey}::`)) delete sessionDraft.checkedPrep[k];
    });
    saveDraft();

    notesInput.value = '';
    clockState.running = false;
    clockState.accumulatedMs = 0;
    clearRestTimer();
    setScreenWakeLock(false);

    previewSessionId = athleteState.next_session || 'A';
    ephemeralSwaps = {};
    renderLiftWorkspace();

    showToast(`Logged ${doneSessionId}! Next up: Session ${athleteState.next_session}`);

    // Best-effort silent background sync if PC Sync sidecar is reachable on Wi-Fi
    trySilentBackgroundSync();
  }

  // =========================================================================
  // Weather Radar Rendering
  // =========================================================================
  async function renderWeatherPanel(forceLive) {
    const body = document.getElementById('weather-decision-body');
    const cfg = getUserConfig();
    const lat = Number(cfg.weather_lat || Engine.LAT_LEES_SUMMIT);
    const lon = Number(cfg.weather_lon || Engine.LON_LEES_SUMMIT);
    document.getElementById('weather-loc-label').textContent = `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)} (KC / Lee's Summit)`;

    body.innerHTML = `<div style="font-size:12.5px;color:#94a3b8;">Evaluating Mon/Wed/Fri midday window &amp; Open-Meteo telemetry...</div>`;

    const decision = await Engine.evaluateWeatherGate({
      runToggle: athleteState.run_toggle || 'OFF',
      targetDate: Engine.todayLocalIso(),
      lat,
      lon,
      allowNetwork: true,
    });

    const badgeMap = {
      APPROVED: 'badge-emerald',
      REJECTED: 'badge-amber',
      REST_DAY: 'badge-cyan',
      BLOCKED: '',
      UNAVAILABLE: 'badge-amber',
    };
    const cls = badgeMap[decision.status] || '';
    const metricsHtml =
      decision.status === 'APPROVED' || decision.status === 'REJECTED'
        ? `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;text-align:center;">
          <div style="background:#0b1120;padding:8px;border-radius:9px;border:1px solid #1f2937;">
            <div style="font-size:16px;font-weight:800;">${decision.temperature.toFixed(1)}°F</div>
            <div style="font-size:10.5px;color:#94a3b8;">Temp (≥45°F)</div>
          </div>
          <div style="background:#0b1120;padding:8px;border-radius:9px;border:1px solid #1f2937;">
            <div style="font-size:16px;font-weight:800;">${decision.wind_speed.toFixed(1)} mph</div>
            <div style="font-size:10.5px;color:#94a3b8;">Wind (≤20 mph)</div>
          </div>
          <div style="background:#0b1120;padding:8px;border-radius:9px;border:1px solid #1f2937;">
            <div style="font-size:16px;font-weight:800;">${decision.precipitation.toFixed(2)}"</div>
            <div style="font-size:10.5px;color:#94a3b8;">Precip (0.00")</div>
          </div>
        </div>`
        : '';

    body.innerHTML = `
      <div class="badge-row">
        <span class="badge ${cls}">${escHtml(decision.status)}</span>
        <span style="font-size:12px;color:#94a3b8;">${escHtml(Engine.weekdayName(Engine.todayLocalIso()))} (${Engine.todayLocalIso()})</span>
      </div>
      ${metricsHtml}
      <div style="margin-top:10px;font-size:13px;color:#f8fafc;"><strong>Gate Reason:</strong> ${escHtml(decision.reason)}</div>
      <div class="safety-banner" style="margin-top:8px;">🏃 <strong>Prescription:</strong> ${escHtml(decision.recommendation)}</div>
    `;
  }

  // =========================================================================
  // History & Saved Loads Rendering
  // =========================================================================
  function renderHistoryPanel() {
    const hist = Array.isArray(athleteState.history) ? [...athleteState.history].reverse() : [];
    const logs = athleteState.exercise_logs || {};
    const logEntries = Object.entries(logs);

    document.getElementById('kpi-total-sessions').textContent = String(hist.length);
    document.getElementById('kpi-next-session').textContent = athleteState.next_session || 'A';
    document.getElementById('kpi-tracked-lifts').textContent = String(logEntries.length);

    const loadsHost = document.getElementById('saved-loads-list');
    if (!logEntries.length) {
      loadsHost.innerHTML = `<div>Log weight &amp; reps on any working set during a session to build your automatic load memory.</div>`;
    } else {
      loadsHost.innerHTML = logEntries
        .map(
          ([exName, rec]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #1f2937;gap:8px;">
            <div>
              <div style="font-size:13px;font-weight:700;color:#f8fafc;">${escHtml(exName)}</div>
              <div style="font-size:11px;color:#94a3b8;">Session ${escHtml(rec.session_id || '—')} • ${escHtml(rec.date || '')}</div>
            </div>
            <span class="badge badge-emerald">${Number(rec.weight || 0)} lb × ${Number(rec.reps || 0)}</span>
          </div>`
        )
        .join('');
    }

    const histHost = document.getElementById('history-log-list');
    if (!hist.length) {
      histHost.innerHTML = `<div style="font-size:12.5px;color:#94a3b8;">No completed sessions recorded yet.</div>`;
    } else {
      histHost.innerHTML = hist
        .map((item) => {
          const topSets = Array.isArray(item.logged_sets) && item.logged_sets.length
            ? `<div style="margin-top:5px;font-size:11.5px;color:#6ee7b7;">` +
              item.logged_sets
                .slice(0, 4)
                .map((s) => `${escHtml(s.exercise)}: ${s.weight}lb×${s.reps}`)
                .join(' • ') +
              `</div>`
            : '';
          return `
            <div style="padding:10px 0;border-bottom:1px solid #1f2937;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="badge badge-cyan">Session ${escHtml(item.session_id)}</span>
                <span style="font-size:11.5px;color:#94a3b8;font-variant-numeric:tabular-nums;">${escHtml(item.date)}</span>
              </div>
              <div style="font-size:12.5px;color:#cbd5e1;margin-top:5px;">
                ${Number(item.duration_minutes || 30)} min • ${Number(item.total_working_sets || 9)} working sets • RPE ${Number(item.rpe_achieved || 7.5)}
              </div>
              ${item.notes ? `<div style="font-size:12px;color:#94a3b8;margin-top:3px;">"${escHtml(item.notes)}"</div>` : ''}
              ${topSets}
            </div>
          `;
        })
        .join('');
    }
  }

  // =========================================================================
  // 2-Way Home / Work LAN & Tunnel Sync (`RollupBridge.lanSyncRequest`)
  // =========================================================================
  function getSyncCandidateUrls() {
    const cfg = getUserConfig();
    const u1 = (cfg.primary_sync_url || 'http://192.168.86.47:8772').trim().replace(/\/+$/, '');
    const u2 = (cfg.secondary_sync_url || 'http://10.0.0.91:8772').trim().replace(/\/+$/, '');
    return Array.from(new Set([u1, u2].filter(Boolean)));
  }

  function hydrateSyncInputs() {
    const cfg = getUserConfig();
    document.getElementById('input-sync-url').value = cfg.primary_sync_url || 'http://192.168.86.47:8772';
    document.getElementById('input-sync-url-alt').value = cfg.secondary_sync_url || 'http://10.0.0.91:8772';
  }

  async function syncHttpCall(baseUrl, path, method = 'GET', bodyObj = null) {
    const url = `${baseUrl}${path}`;
    const cfg = getUserConfig();
    const token = cfg.sync_token || '';
    if (hasBridge && typeof window.RollupBridge.lanSyncRequest === 'function') {
      return window.RollupBridge.lanSyncRequest(url, {
        method,
        token,
        body: bodyObj,
      });
    }
    const headers = {};
    if (token) headers['X-Sync-Token'] = token;
    if (method === 'POST') headers['Content-Type'] = 'application/json';
    const resp = await fetch(url, {
      method,
      headers,
      body: method === 'POST' && bodyObj ? JSON.stringify(bodyObj) : undefined,
    });
    const data = await resp.json().catch(() => ({}));
    return { ok: resp.ok, status: resp.status, data };
  }

  async function findReachableSyncEndpoint() {
    const urls = getSyncCandidateUrls();
    let lastErr = 'No sync URLs configured';
    for (const base of urls) {
      try {
        const res = await syncHttpCall(base, '/api/workout/ping', 'GET');
        if (res && res.ok && res.data && res.data.service === 'adaptive-workout-sync') {
          return { ok: true, baseUrl: base, info: res.data };
        }
        lastErr = `HTTP ${res ? res.status : 0} from ${base}`;
      } catch (err) {
        lastErr = `${base}: ${err.message || err}`;
      }
    }
    return { ok: false, error: lastErr };
  }

  function setSyncBoxStatus(html, borderColor = '#1f2937') {
    const box = document.getElementById('sync-status-box');
    if (!box) return;
    box.style.borderColor = borderColor;
    box.innerHTML = html;
  }

  async function testPcConnection() {
    setSyncBoxStatus('📡 Probing configured Home/Work PC endpoints on port 8772...', '#38bdf8');
    const found = await findReachableSyncEndpoint();
    if (!found.ok) {
      setSyncBoxStatus(
        `⚠️ <strong>PC Sidecar Offline / Unreachable</strong><br><span style="color:#94a3b8;">${escHtml(found.error)}. Your workouts stay safely stored offline on your phone until you connect to Wi-Fi.</span>`,
        '#f59e0b'
      );
      return;
    }
    const info = found.info;
    setSyncBoxStatus(
      `✅ <strong>Connected to ${escHtml(info.hostname || 'Workstation')}</strong> (<code>${escHtml(found.baseUrl)}</code>)<br>` +
        `PC Next Split: <strong>Session ${escHtml(info.next_session)}</strong> • Last Lift: <code>${escHtml(info.last_completed_date || '—')}</code> • History: ${Number(info.history_count || 0)} session(s)`,
      '#10b981'
    );
  }

  async function runPcSync(strategy) {
    setSyncBoxStatus(`🔄 Running <strong>${escHtml(strategy.toUpperCase())}</strong> sync with PC...`, '#38bdf8');
    const found = await findReachableSyncEndpoint();
    if (!found.ok) {
      setSyncBoxStatus(
        `⚠️ Could not reach PC Sync Sidecar (${escHtml(found.error)}). Workout data remains safely stored on phone.`,
        '#f59e0b'
      );
      return;
    }
    try {
      const res = await syncHttpCall(found.baseUrl, '/api/workout/sync', 'POST', {
        strategy,
        state: athleteState,
      });
      if (!res.ok || !res.data || !res.data.state) {
        throw new Error((res.data && res.data.error) || `HTTP ${res.status}`);
      }
      athleteState = saveAthleteState(res.data.state);
      previewSessionId = athleteState.next_session || 'A';
      renderLiftWorkspace();
      renderHistoryPanel();
      setSyncBoxStatus(
        `✅ <strong>Sync Complete (${escHtml(strategy)})</strong> via <code>${escHtml(found.baseUrl)}</code><br>` +
          `Active Split: <strong>Session ${escHtml(athleteState.next_session)}</strong> • Total History: <strong>${(athleteState.history || []).length}</strong> • Global Gemini Skill Mirror: <code>${res.data.skill_synced ? 'SYNCED' : 'LOCAL'}</code>`,
        '#10b981'
      );
      showToast(`Synced with PC! Next: Session ${athleteState.next_session}`);
    } catch (err) {
      setSyncBoxStatus(`❌ Sync error: ${escHtml(err.message || err)}`, '#ef4444');
    }
  }

  async function trySilentBackgroundSync() {
    try {
      const found = await findReachableSyncEndpoint();
      if (!found.ok) return;
      const res = await syncHttpCall(found.baseUrl, '/api/workout/sync', 'POST', {
        strategy: 'merge',
        state: athleteState,
      });
      if (res && res.ok && res.data && res.data.state) {
        athleteState = saveAthleteState(res.data.state);
        showToast(`Logged & auto-synced to PC (${found.info.hostname || 'LAN'})!`);
      }
    } catch (e) {}
  }

  // Boot!
  initModernWebFallbacks();
  bindGlobalEvents();
  renderLiftWorkspace();
  tickTimers();
})();
