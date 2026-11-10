/**
 * Deterministic State, Invariant, Swap & Weather Gate Engine (`workout_engine_portable.js`)
 * Isomorphic 1:1 port of `adaptive-workout/scripts/state_engine.py` + `weather_gate.py`.
 * Runs 100% offline inside RollupOS Android APK, PWA browsers, and Node.js parity tests.
 */
(function (root) {
  'use strict';

  const SESSIONS = ['A', 'B', 'C', 'D'];

  const CAP_DURATION_STANDARD = 30;
  const CAP_DURATION_TRAVEL = 20;
  const CAP_DURATION_EXPRESS = 15;

  const CEILING_WORKING_SETS_NORMAL = 11;
  const CEILING_WORKING_SETS_RAMPUP = 8;

  const LAYOFF_RAMP_UP_THRESHOLD_DAYS = 7;

  const LAT_LEES_SUMMIT = 38.9108;
  const LON_LEES_SUMMIT = -94.3822;
  const MIN_TEMPERATURE_F = 45.0;
  const MAX_WIND_SPEED_MPH = 20.0;
  const MAX_PRECIPITATION_INCHES = 0.0;

  const ADVERSE_WMO_CODES = new Set([
    ...Array.from({ length: 17 }, (_, i) => 51 + i), // 51..67
    ...Array.from({ length: 7 }, (_, i) => 71 + i),  // 71..77
    ...Array.from({ length: 7 }, (_, i) => 80 + i),  // 80..86
    ...Array.from({ length: 5 }, (_, i) => 95 + i),  // 95..99
  ]);

  class InvariantViolationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvariantViolationError';
    }
  }

  function deepClone(obj) {
    return obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
  }

  // Location-agnostic YYYY-MM-DD calendar helpers (uses Temporal.PlainDate when natively available,
  // with pure integer UTC day-number fallback so midnight timezone shifts never occur).
  function todayLocalIso() {
    if (typeof Temporal !== 'undefined' && Temporal.Now && typeof Temporal.Now.plainDateISO === 'function') {
      return Temporal.Now.plainDateISO().toString();
    }
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseIsoParts(dateStr) {
    const clean = String(dateStr || '').trim().split('T')[0];
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean);
    if (!m) {
      throw new Error(`Invalid ISO calendar date: "${dateStr}"`);
    }
    return {
      iso: clean,
      year: Number(m[1]),
      month: Number(m[2]),
      day: Number(m[3]),
    };
  }

  function epochDayNumber(isoStr) {
    const { year, month, day } = parseIsoParts(isoStr);
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  }

  function weekdayMonZero(isoStr) {
    if (typeof Temporal !== 'undefined' && Temporal.PlainDate) {
      // Temporal.PlainDate.dayOfWeek: 1=Mon .. 7=Sun -> 0=Mon .. 6=Sun
      return Temporal.PlainDate.from(parseIsoParts(isoStr).iso).dayOfWeek - 1;
    }
    const { year, month, day } = parseIsoParts(isoStr);
    const jsDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0=Sun..6=Sat
    return (jsDay + 6) % 7; // 0=Mon..6=Sun
  }

  function weekdayName(isoStr) {
    const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names[weekdayMonZero(isoStr)] || 'Today';
  }

  function rotateSession(currentSession) {
    const cur = String(currentSession || '').trim().toUpperCase();
    const idx = SESSIONS.indexOf(cur);
    if (idx === -1) return 'A';
    return SESSIONS[(idx + 1) % SESSIONS.length];
  }

  function calculateLayoff(lastCompletedDate, currentDate = null) {
    if (!lastCompletedDate) return 0;
    const curIso = currentDate ? parseIsoParts(currentDate).iso : todayLocalIso();
    const lastIso = parseIsoParts(lastCompletedDate).iso;
    if (typeof Temporal !== 'undefined' && Temporal.PlainDate) {
      const lastPd = Temporal.PlainDate.from(lastIso);
      const curPd = Temporal.PlainDate.from(curIso);
      return curPd.since(lastPd, { largestUnit: 'days' }).days;
    }
    return epochDayNumber(curIso) - epochDayNumber(lastIso);
  }

  function shouldActivateRampUp(daysElapsed) {
    return Number(daysElapsed) > LAYOFF_RAMP_UP_THRESHOLD_DAYS;
  }

  function syncDualStateKeys(state) {
    const pairs = [
      ['next_session', 'NEXT_SESSION'],
      ['run_toggle', 'RUN_TOGGLE'],
      ['weekly_lift_target', 'WEEKLY_LIFT_TARGET'],
      ['last_completed_date', 'LAST_COMPLETED_DATE'],
      ['equipment_mode', 'EQUIPMENT_MODE'],
      ['upcoming_events', 'UPCOMING_EVENTS'],
      ['active_ramp_up', 'ACTIVE_RAMP_UP'],
      ['ramp_up_sessions_remaining', 'RAMP_UP_SESSIONS_REMAINING'],
    ];
    for (const [low, up] of pairs) {
      if (low in state && !(up in state)) {
        state[up] = state[low];
      } else if (up in state && !(low in state)) {
        state[low] = state[up];
      } else if (low in state && up in state) {
        state[up] = state[low];
      }
    }
    return state;
  }

  function validateSessionInvariants(sessionPlan, mode = 'STANDARD') {
    if (!sessionPlan || typeof sessionPlan !== 'object') {
      throw new InvariantViolationError('Invalid session plan payload.');
    }
    const normMode = String(mode || 'STANDARD').trim().toUpperCase();

    if (sessionPlan.barbell_strip === true || sessionPlan.strip_barbell === true) {
      throw new InvariantViolationError('Barbell stripping/reloading mid-superset is strictly prohibited.');
    }
    if (sessionPlan.requires_plate_change === true || sessionPlan.plate_reload === true) {
      throw new InvariantViolationError('Mid-superset barbell plate changes are prohibited.');
    }

    if (Array.isArray(sessionPlan.days)) {
      for (const d of sessionPlan.days) {
        if (d && typeof d === 'object') {
          validateSessionInvariants(d, normMode);
        }
      }
      if (sessionPlan.duration_minutes != null && Number(sessionPlan.duration_minutes) > CAP_DURATION_STANDARD) {
        throw new InvariantViolationError(
          `Session duration (${sessionPlan.duration_minutes}m) exceeds ${CAP_DURATION_STANDARD}-minute hard cap.`
        );
      }
      if (sessionPlan.total_working_sets != null && Number(sessionPlan.total_working_sets) > CEILING_WORKING_SETS_NORMAL) {
        throw new InvariantViolationError(
          `Working sets (${sessionPlan.total_working_sets}) exceeds maximum ceiling of ${CEILING_WORKING_SETS_NORMAL} sets.`
        );
      }
      return true;
    }

    const blocks = sessionPlan.blocks || {};
    const blockList = Array.isArray(blocks) ? blocks : Object.values(blocks);

    for (const b of blockList) {
      if (!b || typeof b !== 'object') continue;
      if (b.barbell_strip === true || b.strip_barbell === true) {
        throw new InvariantViolationError('Block requires prohibited barbell stripping mid-superset.');
      }
      if (b.requires_plate_change === true) {
        throw new InvariantViolationError('Block requires prohibited barbell plate changes.');
      }

      const pairs = b.superset_pairs || b.exercises || [];
      let barbellCount = 0;
      const isBlock3Superset = Number(b.block_number) === 3 && Array.isArray(b.superset_pairs);

      for (const item of pairs) {
        if (!item || typeof item !== 'object') continue;
        if (item.barbell_strip === true || item.strip_barbell === true) {
          throw new InvariantViolationError('Superset exercise requires prohibited barbell stripping.');
        }
        if (item.requires_plate_change === true || item.plate_reload === true) {
          throw new InvariantViolationError('Superset exercise requires prohibited plate reloading.');
        }

        const eq = String(item.equipment || '').toLowerCase();
        const exName = String(item.exercise || item.name || '').toLowerCase();
        const notes = String(item.notes || '').toLowerCase();
        const safety = String(item.safety_notes || '').toLowerCase();

        for (const text of [eq, exName, notes, safety]) {
          if (text.includes('strip') && text.includes('barbell') && !text.includes('zero') && !text.includes('no ')) {
            throw new InvariantViolationError(`Barbell strip instruction detected: ${text}`);
          }
          if (text.includes('reload') && text.includes('plate') && !text.includes('zero') && !text.includes('no ')) {
            throw new InvariantViolationError(`Plate reload instruction detected: ${text}`);
          }
        }

        const usesLoadedBarbell =
          eq.includes('barbell') &&
          !exName.includes('inverted row') &&
          !eq.includes('bodyweight') &&
          !eq.includes('pull-up bar or barbell');

        if (usesLoadedBarbell) {
          barbellCount += 1;
          if (isBlock3Superset) {
            throw new InvariantViolationError(
              `Block 3 superset cannot use loaded barbell movement "${item.exercise || item.name}" (Zero-Strip Rule).`
            );
          }
        }
      }

      if (barbellCount > 1) {
        throw new InvariantViolationError('Multiple barbell exercises in superset require plate adjustments.');
      }
    }

    let duration = sessionPlan.duration_minutes != null ? sessionPlan.duration_minutes : sessionPlan.duration;
    if (duration == null && blockList.length > 0) {
      duration = blockList.reduce((acc, b) => acc + Number((b && b.duration_minutes) || 0), 0);
    }
    if (duration != null) {
      const durInt = Math.trunc(Number(duration));
      if (normMode === 'EXPRESS' || normMode === 'EXPRESS_MODE') {
        if (durInt > CAP_DURATION_EXPRESS) {
          throw new InvariantViolationError(`Express session duration (${durInt}m) exceeds ${CAP_DURATION_EXPRESS}-minute cap.`);
        }
      } else if (normMode === 'TRAVEL' || normMode === 'TRAVEL_MODE') {
        if (durInt > CAP_DURATION_TRAVEL) {
          throw new InvariantViolationError(`Travel session duration (${durInt}m) exceeds ${CAP_DURATION_TRAVEL}-minute cap.`);
        }
      } else if (durInt > CAP_DURATION_STANDARD) {
        throw new InvariantViolationError(`Session duration (${durInt}m) exceeds ${CAP_DURATION_STANDARD}-minute hard cap.`);
      }
    }

    let totalSets = sessionPlan.total_working_sets != null ? sessionPlan.total_working_sets : sessionPlan.working_sets;
    if (totalSets == null && blockList.length > 0) {
      let counted = 0;
      for (const b of blockList) {
        if (!b || typeof b !== 'object') continue;
        if (b.working_sets != null) {
          counted += Math.trunc(Number(b.working_sets));
        } else {
          const pairs = b.superset_pairs || b.exercises || [];
          for (const p of pairs) {
            if (p && p.working_sets != null) counted += Math.trunc(Number(p.working_sets));
          }
        }
      }
      if (counted > 0) totalSets = counted;
    }

    if (totalSets != null) {
      const setsInt = Math.trunc(Number(totalSets));
      if (setsInt > CEILING_WORKING_SETS_NORMAL) {
        throw new InvariantViolationError(
          `Working sets (${setsInt}) exceeds maximum ceiling of ${CEILING_WORKING_SETS_NORMAL} sets.`
        );
      }
      const isRampUp =
        normMode === 'POST_BREAK_RAMP_UP' ||
        normMode === 'RAMP_UP' ||
        sessionPlan.active_ramp_up === true ||
        sessionPlan.is_ramp_up === true;
      if (isRampUp && setsInt > CEILING_WORKING_SETS_RAMPUP) {
        throw new InvariantViolationError(
          `Working sets (${setsInt}) exceeds Post-Break Ramp-Up limit of ${CEILING_WORKING_SETS_RAMPUP} sets.`
        );
      }
    }

    return true;
  }

  function resolveCatalog(explicitCatalog) {
    const cat = explicitCatalog || root.ADAPTIVE_WORKOUT_CATALOG;
    if (!cat) {
      throw new Error('ADAPTIVE_WORKOUT_CATALOG is not loaded.');
    }
    return cat;
  }

  function getSwapsForExercise(exerciseName, options = {}) {
    const cat = resolveCatalog(options.catalog);
    const list = (cat.swaps_catalog && cat.swaps_catalog.swaps) || [];
    const needle = String(exerciseName || '').toLowerCase();
    const isBlock3 = Boolean(options.isBlock3);

    for (const group of list) {
      const orig = String(group.original_exercise || '').toLowerCase();
      const catName = String(group.category || '').toLowerCase();
      const matched =
        needle.includes(orig) ||
        orig.includes(needle) ||
        (catName && needle.includes(catName)) ||
        (orig.includes('deadlift') && (needle.includes('rack pull') || needle.includes('rdl')));
      if (matched) {
        const candidates = (group.swaps || []).filter((sw) => {
          if (!isBlock3) return true;
          const eqStr = (sw.equipment || []).join(' ').toLowerCase();
          const repName = String(sw.replacement || '').toLowerCase();
          if (eqStr.includes('barbell') && !repName.includes('inverted row')) {
            return false;
          }
          return true;
        });
        return {
          original_exercise: group.original_exercise,
          category: group.category,
          risk_factors: group.risk_factors || [],
          swaps: deepClone(candidates),
        };
      }
    }
    return null;
  }

  function applySwapsToPlan(plan, swapsMap, catalog) {
    if (!swapsMap || typeof swapsMap !== 'object' || Object.keys(swapsMap).length === 0) {
      return plan;
    }
    const blocks = plan.blocks || {};
    if (blocks.block_2 && blocks.block_2.exercise) {
      const origName = blocks.block_2.exercise;
      const chosen = swapsMap[origName] || swapsMap['block_2'];
      if (chosen) {
        const group = getSwapsForExercise(origName, { catalog, isBlock3: false });
        const found = group && group.swaps.find((s) => s.replacement === chosen);
        blocks.block_2.swapped_from = origName;
        blocks.block_2.exercise = chosen;
        if (found) {
          blocks.block_2.equipment = (found.equipment || []).join(', ');
          blocks.block_2.tempo = found.tempo || blocks.block_2.tempo;
          blocks.block_2.swap_mechanism = found.mechanism;
        }
      }
    }
    if (blocks.block_3 && Array.isArray(blocks.block_3.superset_pairs)) {
      for (const pair of blocks.block_3.superset_pairs) {
        const origName = pair.exercise;
        const chosen = swapsMap[origName] || swapsMap[pair.tag];
        if (chosen) {
          const group = getSwapsForExercise(origName, { catalog, isBlock3: true });
          const found = group && group.swaps.find((s) => s.replacement === chosen);
          if (found) {
            pair.swapped_from = origName;
            pair.exercise = chosen;
            pair.equipment = (found.equipment || []).join(', ');
            pair.tempo = found.tempo || pair.tempo;
            pair.swap_mechanism = found.mechanism;
          }
        }
      }
    }
    return plan;
  }

  function getNextSessionPlan(options = {}) {
    const cat = resolveCatalog(options.catalog);
    const state = syncDualStateKeys(deepClone(options.state || cat.admin_seed_state));
    const curDate = options.targetDate ? parseIsoParts(options.targetDate).iso : todayLocalIso();

    const lastCompleted = state.last_completed_date || state.LAST_COMPLETED_DATE || null;
    const daysElapsed = lastCompleted ? calculateLayoff(lastCompleted, curDate) : 0;
    const isLayoffRampUp = lastCompleted ? shouldActivateRampUp(daysElapsed) : false;
    const activeRampUp = isLayoffRampUp || Boolean(state.active_ramp_up);

    const normMode = options.mode ? String(options.mode).trim().toUpperCase() : null;
    const eqMode = String(state.equipment_mode || state.EQUIPMENT_MODE || '').trim().toUpperCase();

    let effectiveMode = 'STANDARD';
    if (normMode) {
      effectiveMode = normMode;
    } else if (eqMode === 'BODYWEIGHT_HOTEL') {
      effectiveMode = 'TRAVEL_MODE';
    } else if (activeRampUp) {
      effectiveMode = 'POST_BREAK_RAMP_UP';
    }

    const mergedSwaps = {
      ...(state.active_swaps || {}),
      ...(options.sessionSwaps || {}),
    };

    const specialModes =
      (cat.special_modes_catalog && cat.special_modes_catalog.special_modes) ||
      cat.special_modes_catalog ||
      {};

    if (effectiveMode === 'PRE_EVENT' || effectiveMode === 'PRE_EVENT_COMPRESSION') {
      const plan = deepClone(specialModes.PRE_EVENT_COMPRESSION);
      plan.layoff_days = daysElapsed;
      validateSessionInvariants(plan, 'PRE_EVENT_COMPRESSION');
      return plan;
    }

    if (effectiveMode === 'TRAVEL' || effectiveMode === 'TRAVEL_MODE') {
      const plan = deepClone(specialModes.TRAVEL_MODE);
      plan.layoff_days = daysElapsed;
      validateSessionInvariants(plan, 'TRAVEL_MODE');
      return plan;
    }

    const nextId = String(options.previewSessionId || state.next_session || state.NEXT_SESSION || 'A')
      .trim()
      .toUpperCase();
    const sessionsList = (cat.sessions_catalog && cat.sessions_catalog.sessions) || [];
    const baseSession = sessionsList.find((s) => s.id === nextId);
    if (!baseSession) {
      throw new Error(`Session '${nextId}' not found in sessions catalog.`);
    }

    if (effectiveMode === 'EXPRESS' || effectiveMode === 'EXPRESS_MODE') {
      const plan = deepClone(specialModes.EXPRESS_MODE);
      plan.scheduled_session_id = nextId;
      plan.layoff_days = daysElapsed;
      // Enrich Express Block 2 with the exact primary compound lift for tonight's session!
      if (plan.blocks && plan.blocks.block_2 && baseSession.blocks && baseSession.blocks.block_2) {
        const b2 = baseSession.blocks.block_2;
        plan.blocks.block_2.exercise = b2.exercise;
        plan.blocks.block_2.equipment = b2.equipment;
        plan.blocks.block_2.tempo = b2.tempo || plan.blocks.block_2.tempo;
        plan.blocks.block_2.safety_notes = b2.safety_notes;
        if (activeRampUp) {
          plan.blocks.block_2.working_sets = 2;
          plan.blocks.block_2.target_rpe = 6.5;
          plan.target_rpe = 6.5;
          plan.active_ramp_up = true;
        }
      }
      applySwapsToPlan(plan, mergedSwaps, cat);
      validateSessionInvariants(plan, 'EXPRESS_MODE');
      return plan;
    }

    const sessionObj = deepClone(baseSession);
    sessionObj.layoff_days = daysElapsed;

    if (activeRampUp || effectiveMode === 'POST_BREAK_RAMP_UP' || effectiveMode === 'RAMP_UP') {
      sessionObj.active_ramp_up = true;
      sessionObj.is_ramp_up = true;
      sessionObj.target_rpe = 6.5;
      if (sessionObj.blocks && sessionObj.blocks.block_2) {
        sessionObj.blocks.block_2.working_sets = 2;
        sessionObj.blocks.block_2.target_rpe = 6.5;
      }
      if (sessionObj.blocks && sessionObj.blocks.block_3) {
        sessionObj.blocks.block_3.working_sets = 4;
        const pairs = sessionObj.blocks.block_3.superset_pairs || [];
        for (const p of pairs) {
          p.working_sets = 2;
          p.target_rpe = 6.5;
        }
      }
      sessionObj.total_working_sets = 6;
      sessionObj.duration_minutes = 25;
      applySwapsToPlan(sessionObj, mergedSwaps, cat);
      validateSessionInvariants(sessionObj, 'POST_BREAK_RAMP_UP');
    } else {
      applySwapsToPlan(sessionObj, mergedSwaps, cat);
      validateSessionInvariants(sessionObj, 'STANDARD');
    }

    return sessionObj;
  }

  function completeSession(options = {}) {
    const state = syncDualStateKeys(deepClone(options.state));
    const compDateStr = options.completionDate
      ? parseIsoParts(options.completionDate).iso
      : todayLocalIso();

    const currentNext = state.next_session || state.NEXT_SESSION || 'A';
    const doneId = options.sessionId ? String(options.sessionId).trim().toUpperCase() : currentNext;
    const prevLastCompleted = state.last_completed_date || state.LAST_COMPLETED_DATE || null;

    // Advance circular modulo A -> B -> C -> D -> A when doneId is in SESSIONS (or advanceRotation !== false)
    if (options.advanceRotation !== false && SESSIONS.includes(doneId)) {
      const newNext = rotateSession(doneId);
      state.next_session = newNext;
      state.NEXT_SESSION = newNext;
    }
    state.last_completed_date = compDateStr;
    state.LAST_COMPLETED_DATE = compDateStr;

    // Ramp-up decrement / layoff auto-activation matching state_engine.py
    if (state.active_ramp_up) {
      const rem = Math.trunc(Number(state.ramp_up_sessions_remaining || 1)) - 1;
      if (rem <= 0) {
        state.active_ramp_up = false;
        state.ramp_up_sessions_remaining = 0;
      } else {
        state.active_ramp_up = true;
        state.ramp_up_sessions_remaining = rem;
      }
    } else if (prevLastCompleted) {
      const layoffCompleted = calculateLayoff(prevLastCompleted, compDateStr);
      if (shouldActivateRampUp(layoffCompleted)) {
        const targetCount = Math.trunc(
          Number(state.weekly_lift_target || state.WEEKLY_LIFT_TARGET || 3)
        );
        const rem = targetCount - 1;
        if (rem > 0) {
          state.active_ramp_up = true;
          state.ramp_up_sessions_remaining = rem;
        } else {
          state.active_ramp_up = false;
          state.ramp_up_sessions_remaining = 0;
        }
      }
    }

    const durationMinutes = Number(options.durationMinutes != null ? options.durationMinutes : 30);
    const totalWorkingSets = Number(options.totalWorkingSets != null ? options.totalWorkingSets : 9);
    const rpeAchieved = Number(options.rpeAchieved != null ? options.rpeAchieved : 7.5);
    const loggedSets = Array.isArray(options.loggedSets) ? deepClone(options.loggedSets) : undefined;

    const entry = {
      date: compDateStr,
      session_id: doneId,
      duration_minutes: durationMinutes,
      total_working_sets: totalWorkingSets,
      rpe_achieved: rpeAchieved,
      notes: options.notes || `Completed Session ${doneId}`,
    };
    if (loggedSets && loggedSets.length > 0) {
      entry.logged_sets = loggedSets;
    }

    if (!Array.isArray(state.history)) state.history = [];
    state.history.push(entry);

    // Persist per-exercise top working weight & reps for auto-prefill in future workouts
    if (loggedSets && loggedSets.length > 0) {
      if (!state.exercise_logs || typeof state.exercise_logs !== 'object') {
        state.exercise_logs = {};
      }
      const nowIso = new Date().toISOString();
      for (const row of loggedSets) {
        if (!row || !row.exercise) continue;
        const w = Number(row.weight || 0);
        const r = Number(row.reps || 0);
        if (w <= 0 && r <= 0) continue;
        const prev = state.exercise_logs[row.exercise];
        // Update with latest session's best/last completed working set
        if (!prev || prev.date <= compDateStr || w >= Number(prev.weight || 0)) {
          state.exercise_logs[row.exercise] = {
            weight: w,
            reps: r,
            date: compDateStr,
            session_id: doneId,
            updated_at: nowIso,
          };
        }
      }
    }

    state.updated_at = new Date().toISOString();
    return syncDualStateKeys(state);
  }

  function evaluateWeatherPayload(runToggle, resolvedDateIso, weatherPayload) {
    const toggleVal = String(runToggle || 'OFF').trim().toUpperCase();
    if (toggleVal === 'OFF') {
      return {
        status: 'BLOCKED',
        approved: false,
        temperature: 0.0,
        wind_speed: 0.0,
        precipitation: 0.0,
        weather_code: 0,
        reason: 'Outdoor running is disabled (RUN_TOGGLE is OFF).',
        recommendation: 'Maintain indoor strength routine; no outdoor running scheduled.',
      };
    }

    const wk = weekdayMonZero(resolvedDateIso);
    if (![0, 2, 4].includes(wk)) {
      const dayLabel = weekdayName(resolvedDateIso);
      return {
        status: 'REST_DAY',
        approved: false,
        temperature: 0.0,
        wind_speed: 0.0,
        precipitation: 0.0,
        weather_code: 0,
        reason: `Midday runs are scheduled Mon/Wed/Fri. ${dayLabel} is a non-running day.`,
        recommendation: 'Focus on evening strength session or recovery.',
      };
    }

    if (!weatherPayload) {
      return {
        status: 'UNAVAILABLE',
        approved: false,
        temperature: 0.0,
        wind_speed: 0.0,
        precipitation: 0.0,
        weather_code: 0,
        reason: 'Live weather service unavailable. Defaulting to indoor safety.',
        recommendation: 'Swap outdoor run to 20-30 min indoor mobility or rest.',
      };
    }

    const cur = weatherPayload.current || weatherPayload;
    const tempF = Number(cur.temperature_2m != null ? cur.temperature_2m : cur.temperature || 0.0);
    const windMph = Number(cur.wind_speed_10m != null ? cur.wind_speed_10m : cur.wind_speed || 0.0);
    const precipIn = Number(cur.precipitation != null ? cur.precipitation : 0.0);
    const weatherCode = Math.trunc(
      Number(cur.weather_code != null ? cur.weather_code : cur.weathercode || 0)
    );

    const rejections = [];
    if (tempF < MIN_TEMPERATURE_F) {
      rejections.push(`Temperature ${tempF.toFixed(1)}°F is below ${MIN_TEMPERATURE_F.toFixed(1)}°F threshold`);
    }
    if (windMph > MAX_WIND_SPEED_MPH) {
      rejections.push(`Wind speed ${windMph.toFixed(1)} mph exceeds ${MAX_WIND_SPEED_MPH.toFixed(1)} mph threshold`);
    }
    if (precipIn > MAX_PRECIPITATION_INCHES) {
      rejections.push(`Precipitation detected (${precipIn.toFixed(2)} in)`);
    }
    if (ADVERSE_WMO_CODES.has(weatherCode)) {
      rejections.push(`Adverse weather condition detected (WMO code ${weatherCode})`);
    }

    if (rejections.length > 0) {
      return {
        status: 'REJECTED',
        approved: false,
        temperature: tempF,
        wind_speed: windMph,
        precipitation: precipIn,
        weather_code: weatherCode,
        reason: rejections.join('; ') + '.',
        recommendation: 'Swap outdoor run to 20-30 min indoor mobility or rest.',
      };
    }

    return {
      status: 'APPROVED',
      approved: true,
      temperature: tempF,
      wind_speed: windMph,
      precipitation: precipIn,
      weather_code: weatherCode,
      reason: `Weather conditions are clear and mild (${tempF.toFixed(1)}°F, ${windMph.toFixed(1)} mph wind, ${precipIn.toFixed(2)} in precip).`,
      recommendation: 'Midday run approved: 20-30 minutes easy aerobic pace (Zone 2).',
    };
  }

  async function evaluateWeatherGate(options = {}) {
    const runToggle = String(options.runToggle || 'OFF').trim().toUpperCase();
    let resolvedDate = options.targetDate ? parseIsoParts(options.targetDate).iso : null;
    if (!resolvedDate && options.mockWeather) {
      const cur = options.mockWeather.current || options.mockWeather;
      if (cur && typeof cur.time === 'string' && cur.time.includes('T')) {
        try {
          resolvedDate = parseIsoParts(cur.time.split('T')[0]).iso;
        } catch (e) {
          resolvedDate = todayLocalIso();
        }
      }
    }
    if (!resolvedDate) resolvedDate = todayLocalIso();

    if (runToggle === 'OFF' || ![0, 2, 4].includes(weekdayMonZero(resolvedDate))) {
      return evaluateWeatherPayload(runToggle, resolvedDate, null);
    }

    if (options.mockWeather) {
      return evaluateWeatherPayload(runToggle, resolvedDate, options.mockWeather);
    }

    if (options.allowNetwork === false || typeof fetch !== 'function') {
      return evaluateWeatherPayload(runToggle, resolvedDate, null);
    }

    const lat = Number(options.lat != null ? options.lat : LAT_LEES_SUMMIT);
    const lon = Number(options.lon != null ? options.lon : LON_LEES_SUMMIT);
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,wind_speed_10m,precipitation,weather_code` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;

    try {
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      return evaluateWeatherPayload(runToggle, resolvedDate, data);
    } catch (err) {
      return {
        status: 'UNAVAILABLE',
        approved: false,
        temperature: 0.0,
        wind_speed: 0.0,
        precipitation: 0.0,
        weather_code: 0,
        reason: `Live weather service unavailable (${err.message || err}). Defaulting to indoor safety.`,
        recommendation: 'Swap outdoor run to 20-30 min indoor mobility or rest.',
      };
    }
  }

  function mergeWorkoutStates(localState, remoteState, strategy = 'merge') {
    const strat = String(strategy || 'merge').trim().toLowerCase();
    if (strat === 'pull') return syncDualStateKeys(deepClone(remoteState));

    const loc = deepClone(localState || {});
    const rem = deepClone(remoteState || {});
    const locLast = String(loc.last_completed_date || loc.LAST_COMPLETED_DATE || '').slice(0, 10);
    const remLast = String(rem.last_completed_date || rem.LAST_COMPLETED_DATE || '').slice(0, 10);
    const locUpd = String(loc.updated_at || '');
    const remUpd = String(rem.updated_at || '');

    let localWins = false;
    if (strat === 'push') {
      localWins = true;
    } else if (locLast !== remLast) {
      localWins = locLast > remLast;
    } else if (locUpd && remUpd && locUpd !== remUpd) {
      localWins = locUpd > remUpd;
    } else {
      localWins = Boolean(locUpd) && !Boolean(remUpd);
    }

    const winner = localWins ? loc : rem;
    const merged = deepClone(rem);

    for (const k of [
      'next_session',
      'last_completed_date',
      'run_toggle',
      'equipment_mode',
      'weekly_lift_target',
      'upcoming_events',
      'active_ramp_up',
      'ramp_up_sessions_remaining',
    ]) {
      if (winner[k] !== undefined) merged[k] = deepClone(winner[k]);
    }
    if (winner.athlete_profile) {
      merged.athlete_profile = { ...(merged.athlete_profile || {}), ...winner.athlete_profile };
    }

    // Union history by (date, session_id)
    const map = new Map();
    for (const list of [rem.history || [], loc.history || []]) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (!item || !item.date || !item.session_id) continue;
        const key = `${String(item.date).slice(0, 10)}::${String(item.session_id).toUpperCase()}`;
        if (!map.has(key)) {
          map.set(key, deepClone(item));
        } else {
          const ex = map.get(key);
          if (item.logged_sets && !ex.logged_sets) ex.logged_sets = deepClone(item.logged_sets);
          if (item.notes && (!ex.notes || String(ex.notes).startsWith('Completed Session'))) {
            ex.notes = item.notes;
          }
          if (item.rpe_achieved != null) ex.rpe_achieved = item.rpe_achieved;
        }
      }
    }
    merged.history = Array.from(map.values()).sort((a, b) =>
      `${a.date}::${a.session_id}`.localeCompare(`${b.date}::${b.session_id}`)
    );

    // Union exercise_logs keeping newer timestamp
    const logs = deepClone(rem.exercise_logs || {});
    for (const [exName, entry] of Object.entries(loc.exercise_logs || {})) {
      if (!entry || typeof entry !== 'object') continue;
      const cur = logs[exName];
      const tLoc = String(entry.updated_at || entry.date || '');
      const tCur = cur ? String(cur.updated_at || cur.date || '') : '';
      if (!cur || tLoc >= tCur || strat === 'push') {
        logs[exName] = deepClone(entry);
      }
    }
    merged.exercise_logs = logs;
    merged.active_swaps = { ...(rem.active_swaps || {}), ...(loc.active_swaps || {}) };
    merged.updated_at = new Date().toISOString();

    return syncDualStateKeys(merged);
  }

  const API = {
    SESSIONS,
    CAP_DURATION_STANDARD,
    CAP_DURATION_TRAVEL,
    CAP_DURATION_EXPRESS,
    CEILING_WORKING_SETS_NORMAL,
    CEILING_WORKING_SETS_RAMPUP,
    LAYOFF_RAMP_UP_THRESHOLD_DAYS,
    LAT_LEES_SUMMIT,
    LON_LEES_SUMMIT,
    MIN_TEMPERATURE_F,
    MAX_WIND_SPEED_MPH,
    InvariantViolationError,
    todayLocalIso,
    weekdayMonZero,
    weekdayName,
    rotateSession,
    calculateLayoff,
    shouldActivateRampUp,
    validateSessionInvariants,
    getSwapsForExercise,
    applySwapsToPlan,
    getNextSessionPlan,
    completeSession,
    evaluateWeatherPayload,
    evaluateWeatherGate,
    mergeWorkoutStates,
    syncDualStateKeys,
  };

  root.AdaptiveWorkoutEngine = API;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
