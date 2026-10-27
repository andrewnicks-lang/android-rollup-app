/**
 * SHD Storage Adapter & Isomorphic Client-Side Solver (v5.0 — Phase 0-3 Unified)
 * Bridges the SHD Tactical Platform across:
 *   1. Desktop FastAPI Mode (`http://127.0.0.1:8765/api/...`)
 *   2. RollupOS Android App Hub Cartridge Mode (`window.RollupBridge` + isolated per-user localStorage)
 *   3. Standalone Offline File / Static Mode (`localStorage` fallback)
 *
 * Exposes all unified method aliases so `web/app.js` and external scripts operate with zero contract drift.
 */

(function () {
  const STORAGE_PREFIX = 'shd_v42_profile_';

  let _activeProfile = {
    userId: 'admin',
    displayName: 'Agent Admin (SHD 2793)',
    role: 'admin',
    mode: 'PC_FASTAPI', // 'PC_FASTAPI' | 'ANDROID_HUB' | 'PORTABLE_LOCAL'
  };

  let _pcServerAvailable = null; // null = unknown, true = FastAPI online, false = offline/mobile
  let _customBuilds = [];

  const NAMED_ITEM_PARENT_BRAND = {
    "backbone": "Lengmo",
    "the sacrifice": "Providence Defense",
    "the gift": "Providence Defense",
    "contractor's gloves": "Petrov Defense Group",
    "fox's prayer": "Overlord Armaments",
    "turmoil": "Česká Výroba s.r.o.",
    "devil's due": "Česká Výroba s.r.o.",
    "picaro's holster": "Brazos de Arcabuz",
    "hermano": "Brazos de Arcabuz",
    "closer": "Uzina Getica",
    "the setup": "Uzina Getica",
    "chainkiller": "Walker, Harris & Co.",
    "matador": "Walker, Harris & Co.",
    "hunter-killer": "Golan Gear Ltd",
    "anarchist's cookbook": "Golan Gear Ltd",
    "pointman": "Gila Guard",
    "nightwatcher": "Gila Guard",
    "force multiplier": "Hana-U Corporation",
    "liquid engineer": "Belstone Armory",
    "everyday carrier": "Belstone Armory",
    "emperor's guard": "Murakami Industries",
    "claws out": "Wyvern Wear",
    "punch drunk": "Douglas & Harding",
    "motherly love": "Alps Summit Armament",
    "firm handshake": "Sokolov Concern",
    "deathgrips": "5.11 Tactical",
    "door-kicker's knock": "Grupo Sombra S.A.",
    "festive delivery": "Grupo Sombra S.A.",
    "pristine example": "Airaldi Holdings",
    "caesar's guard": "Empress International",
    "battery pack": "Empress International",
    "zero fs": "Badger Tuff",
    "ammo dump": "Badger Tuff",
    "hollow man": "Yaahl Gear",
    "lavoisier": "Electrique",
    "snowmachine": "Electrique",
    "the courier": "Habsburg Guard",
    "cherished": "Habsburg Guard"
  };

  const GEAR_SET_NAMES_LOWER = new Set([
    "striker's battlegear",
    "heartbreaker",
    "hotshot",
    "hunter's fury",
    "eclipse protocol",
    "negotiator's dilemma",
    "foundry bulwark",
    "future initiative",
    "umbra initiative",
    "ongoing directive",
    "rigger",
    "hard wired",
    "true patriot",
    "aces & eights",
    "tip of the spear",
    "system corruption",
    "cavalier",
    "ortiz: exuro",
    "aegis",
    "breaking point",
    "virtuoso",
    "legatus"
  ]);

  const EXOTIC_ARMOR_NAMES_LOWER = new Set([
    "coyote's mask",
    "memento",
    "ninjabike messenger backpack",
    "vile",
    "waveform",
    "catharsis",
    "btsu datagloves",
    "tardigrade armor system",
    "ridgeway's pride",
    "collector",
    "imperial dynasty",
    "centurion's scabbard",
    "dodge city gunslinger's holster",
    "shocker punch",
    "bloody knuckles",
    "acosta's go-bag",
    "sawyer's kneepads",
    "ninjabike messenger kneepads"
  ]);

  function getSeedData() {
    if (window.SHD_SEED_DATA) return window.SHD_SEED_DATA;
    if (window.SHD_CARTRIDGE_SEED) {
      return {
        canonical_db: window.SHD_CARTRIDGE_SEED.canonical,
        meta_builds: window.SHD_CARTRIDGE_SEED.meta_builds,
        golden_items: window.SHD_CARTRIDGE_SEED.golden_demo_items,
        saved_loadouts: window.SHD_CARTRIDGE_SEED.admin_showcase_loadouts,
        expertise_categories: (window.SHD_CARTRIDGE_SEED.admin_default_state?.expertise?.categories) || [],
        expertise_items: (window.SHD_CARTRIDGE_SEED.admin_default_state?.expertise?.items) || [],
      };
    }
    return null;
  }

  function iterCanonicalEntriesJS(collection) {
    if (!collection) return [];
    if (Array.isArray(collection)) {
      return collection
        .filter(item => item && typeof item === 'object' && item.name)
        .map(item => [String(item.name), item]);
    }
    if (typeof collection === 'object') {
      return Object.entries(collection).map(([k, v]) => {
        if (v && typeof v === 'object' && v.name) return [String(v.name), v];
        return [String(k), v || {}];
      });
    }
    return [];
  }

  function normalizeWeaponEntryJS(w) {
    if (!w || typeof w !== 'object') return null;
    const rawBase = Number(w.base_damage || w.base_dmg || 52000.0);
    const lvl40BaseDmg = rawBase < 70000 ? rawBase * 2.25 : rawBase;
    const hsPct = Number(w.native_hsd !== undefined ? w.native_hsd : 55.0);
    return {
      name: w.name || 'Custom Weapon',
      aliases: Array.isArray(w.aliases) ? w.aliases : [],
      class: w.weapon_class || w.class || 'AR',
      weapon_class: w.weapon_class || w.class || 'AR',
      base_dmg: lvl40BaseDmg,
      base_damage: lvl40BaseDmg,
      rpm: Number(w.rpm || 750),
      mag_size: Number(w.mag_size || 40),
      reload_sec: Number(w.reload_sec || 2.1),
      headshot_mult: Number(w.headshot_mult || (1.0 + hsPct / 100.0)),
      native_dttooc: Number(w.native_dttooc !== undefined ? w.native_dttooc : 10.0),
      native_dta: Number(w.native_dta || 0.0),
      native_chc: Number(w.native_chc || 0.0) + Number(w.mod_chc || 0.0),
      native_chd: Number(w.native_chd || 0.0) + Number(w.mod_chd || 0.0),
      native_hsd: hsPct,
      mod_chc: Number(w.mod_chc || 0.0),
      mod_chd: Number(w.mod_chd || 0.0),
      talent: w.talent || '',
    };
  }

  function resolveParentBrandJS(brandOrName, canonicalDb) {
    if (!brandOrName) return 'Unknown';
    const clean = String(brandOrName).trim();
    const low = clean.toLowerCase();
    if (NAMED_ITEM_PARENT_BRAND[low]) return NAMED_ITEM_PARENT_BRAND[low];
    const db = canonicalDb || getSeedData()?.canonical_db || {};
    for (const [nName, nSpec] of iterCanonicalEntriesJS(db.named_items)) {
      if (nName.toLowerCase() === low && nSpec.brand) return nSpec.brand;
      if (Array.isArray(nSpec.aliases) && nSpec.aliases.some(a => String(a).toLowerCase() === low) && nSpec.brand) {
        return nSpec.brand;
      }
    }
    return clean;
  }

  function isGearSetBrandJS(brandOrName, canonicalDb) {
    if (!brandOrName) return false;
    const resolved = resolveParentBrandJS(brandOrName, canonicalDb).toLowerCase();
    if (GEAR_SET_NAMES_LOWER.has(resolved)) return true;
    const db = canonicalDb || getSeedData()?.canonical_db || {};
    return iterCanonicalEntriesJS(db.gear_sets).some(([gs]) => gs.toLowerCase() === resolved);
  }

  function isExoticItemJS(itemOrBrand, canonicalDb) {
    if (!itemOrBrand) return false;
    if (typeof itemOrBrand === 'object') {
      if (String(itemOrBrand.rarity || '').toUpperCase() === 'EXOTIC') return true;
      const bLow = String(itemOrBrand.brand_or_set || itemOrBrand.item_name || '').trim().toLowerCase();
      if (EXOTIC_ARMOR_NAMES_LOWER.has(bLow)) return true;
    } else {
      const bLow = String(itemOrBrand).trim().toLowerCase();
      if (EXOTIC_ARMOR_NAMES_LOWER.has(bLow)) return true;
    }
    return false;
  }

  function detectRuntimeProfile() {
    try {
      if (window.RollupBridge && typeof window.RollupBridge.getActiveUser === 'function') {
        const u = window.RollupBridge.getActiveUser();
        if (u && u.id) {
          _activeProfile = {
            userId: u.id,
            displayName: u.displayName || u.id,
            role: u.role || (u.id === 'admin' ? 'admin' : 'user'),
            mode: 'ANDROID_HUB',
          };
          return _activeProfile;
        }
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('profile')) {
        const pid = params.get('profile').toLowerCase();
        _activeProfile = {
          userId: pid,
          displayName: pid === 'admin' ? 'Agent Admin (SHD 2793)' : `Agent ${pid.toUpperCase()}`,
          role: pid === 'admin' ? 'admin' : 'user',
          mode: _pcServerAvailable ? 'PC_FASTAPI' : 'PORTABLE_LOCAL',
        };
        return _activeProfile;
      }
      const savedProfileId = localStorage.getItem('shd_v42_active_profile_id');
      if (savedProfileId) {
        _activeProfile = {
          userId: savedProfileId,
          displayName:
            savedProfileId === 'admin'
              ? 'Agent Admin (SHD 2793)'
              : savedProfileId === 'demo'
              ? 'Demo Guest (47 Golden Stash)'
              : `Tester (${savedProfileId})`,
          role: savedProfileId === 'admin' ? 'admin' : 'user',
          mode: _pcServerAvailable ? 'PC_FASTAPI' : 'PORTABLE_LOCAL',
        };
      }
    } catch (e) {
      console.warn('Profile detection warning:', e);
    }
    return _activeProfile;
  }

  function setActiveProfile(profileId) {
    localStorage.setItem('shd_v42_active_profile_id', profileId);
    _activeProfile.userId = profileId;
    _activeProfile.role = profileId === 'admin' ? 'admin' : 'user';
    _activeProfile.displayName =
      profileId === 'admin'
        ? 'Agent Admin (SHD 2793)'
        : profileId === 'demo'
        ? 'Demo Guest (47 Golden Stash)'
        : `Field Tester (${profileId.toUpperCase()})`;
    return _activeProfile;
  }

  function getStorageKey() {
    return `${STORAGE_PREFIX}${_activeProfile.userId}`;
  }

  function buildInitialProfileStore(userId) {
    const seed = getSeedData() || {};
    const isAdminOrDemo = userId === 'admin' || userId === 'demo';
    const items = isAdminOrDemo ? JSON.parse(JSON.stringify(seed.golden_items || [])) : [];
    const savedLoadouts = isAdminOrDemo ? JSON.parse(JSON.stringify(seed.saved_loadouts || [])) : [];

    let expCats = JSON.parse(JSON.stringify(seed.expertise_categories || []));
    let expItems = JSON.parse(JSON.stringify(seed.expertise_items || []));

    if (!isAdminOrDemo) {
      expCats = expCats.map(c => ({
        ...c,
        proficient: 0,
        missing: c.total,
        pct: 0.0,
      }));
      expItems = expItems.map(it => ({
        ...it,
        rank: 0,
        is_proficient: false,
        upgrade_grade: 0,
        filament_needed: 300,
      }));
    }

    return {
      userId,
      updatedAt: new Date().toISOString(),
      items,
      saved_loadouts: savedLoadouts,
      custom_builds: [],
      expertise_categories: expCats,
      expertise_items: expItems,
    };
  }

  function loadLocalStore() {
    const key = getStorageKey();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items)) {
          _customBuilds = parsed.custom_builds || [];
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading local store, initializing clean store:', e);
    }
    const fresh = buildInitialProfileStore(_activeProfile.userId);
    saveLocalStore(fresh);
    return fresh;
  }

  function saveLocalStore(store) {
    store.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(store));
    } catch (e) {
      console.error('LocalStorage quota warning:', e);
    }
  }

  const CORE_MAX = {
    WEAPON_DAMAGE: 15.0,
    ARMOR: 170000.0,
    SKILL_TIER: 1.0,
  };

  const MINOR_MAX = {
    CRITICAL_HIT_CHANCE: 6.0,
    CRITICAL_HIT_DAMAGE: 12.0,
    HEADSHOT_DAMAGE: 10.0,
    WEAPON_HANDLING: 8.0,
    SKILL_DAMAGE: 10.0,
    SKILL_HASTE: 12.0,
    SKILL_REPAIR: 20.0,
    STATUS_EFFECTS: 10.0,
    ARMOR_REGEN: 4925.0,
    HAZARD_PROTECTION: 10.0,
    EXPLOSIVE_RESISTANCE: 10.0,
    INCOMING_REPAIRS: 20.0,
    HEALTH: 18935.0,
    DAMAGE_TO_ARMOR: 8.0,
    DTTOOC: 8.0,
  };

  function computeItemPowerRatioJS(item) {
    const ratios = [];
    const core = item.core_attribute || {};
    const cType = core.type || 'WEAPON_DAMAGE';
    const cMax = CORE_MAX[cType] || 15.0;
    if (cMax > 0 && core.value != null) {
      ratios.push(Math.min(1.15, Number(core.value) / cMax));
    }
    for (const m of item.minor_attributes || []) {
      const mMax = MINOR_MAX[m.type] || 10.0;
      if (mMax > 0 && m.value != null) {
        ratios.push(Math.min(1.15, Number(m.value) / mMax));
      }
    }
    return ratios.length ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 0.5;
  }

  function classifyItemArchetypeJS(item, canonicalDb) {
    const core = item.core_attribute || {};
    const cType = String(core.type || 'WEAPON_DAMAGE').toUpperCase();
    const brand = String(item.brand_or_set || '');
    const name = String(item.item_name || '');
    const parentBrand = resolveParentBrandJS(NAMED_ITEM_PARENT_BRAND[name.toLowerCase()] ? name : brand, canonicalDb);
    const bLow = `${brand} ${name}`.toLowerCase();

    let coreCat = 'RED';
    if (bLow.includes('memento') || bLow.includes('ninjabike')) coreCat = 'TRIPLE';
    else if (cType === 'ARMOR') coreCat = 'BLUE';
    else if (cType === 'SKILL_TIER') coreCat = 'YELLOW';

    const minors = item.minor_attributes || [];
    const mTypes = minors.map(m => String(m.type || '').toUpperCase()).filter(Boolean);
    const critCount = mTypes.filter(t => ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE', 'DAMAGE_TO_ARMOR', 'DTTOOC'].includes(t)).length;
    const tankCount = mTypes.filter(t => ['ARMOR_REGEN', 'HAZARD_PROTECTION', 'EXPLOSIVE_RESISTANCE', 'INCOMING_REPAIRS'].includes(t)).length;

    let roleArchetype = 'HYBRID';
    if (bLow.includes('hotshot') || bLow.includes('chainkiller') || bLow.includes('airaldi') || bLow.includes('habsburg') || (mTypes.includes('HEADSHOT_DAMAGE') && critCount === 0)) {
      roleArchetype = 'HEADSHOT_MMR';
    } else if (bLow.includes('eclipse') || bLow.includes('vile') || mTypes.includes('STATUS_EFFECTS')) {
      roleArchetype = 'STATUS_CC';
    } else if (bLow.includes('future initiative') || bLow.includes('btsu') || bLow.includes('alps') || mTypes.includes('SKILL_REPAIR')) {
      roleArchetype = 'HEALER';
    } else if (bLow.includes('empress') || bLow.includes('waveform') || bLow.includes('wyvern') || mTypes.includes('SKILL_DAMAGE')) {
      roleArchetype = 'SKILL_DPS';
    } else if (bLow.includes('foundry') || bLow.includes('catharsis') || bLow.includes('gila') || (tankCount >= 1 && critCount === 0)) {
      roleArchetype = 'TANK_REGEN';
    } else if (critCount >= 1 || bLow.includes('striker') || bLow.includes('lengmo') || bLow.includes('providence') || bLow.includes('coyote') || bLow.includes("hunter's fury") || bLow.includes('negotiator') || bLow.includes('umbra') || bLow.includes('heartbreaker')) {
      roleArchetype = 'CRIT_DPS';
    }

    const coreRecal = Boolean(core.recal || core.is_recalibrated);
    const minorRecal = minors.some(m => Boolean(m.recal || m.is_recalibrated));
    const talentObj = item.talent || {};
    const talentRecal = Boolean(talentObj.recal || talentObj.is_recalibrated);

    let recalState = 'VIRGIN';
    if (item.is_prototype) recalState = 'PROTOTYPE';
    else if (coreRecal) recalState = 'RECAL_CORE';
    else if (minorRecal) recalState = 'RECAL_MINOR';
    else if (talentRecal) recalState = 'RECAL_TALENT';

    const powerRatio = computeItemPowerRatioJS(item);
    return {
      core_category: coreCat,
      role_archetype: roleArchetype,
      recal_state: recalState,
      parent_brand: parentBrand,
      power_pct: Math.round(powerRatio * 1000) / 10,
    };
  }

  function matchBrandOrItemJS(item, targetNames, canonicalDb) {
    const itemBrand = (item.brand_or_set || '').trim();
    const itemName = (item.item_name || '').trim();
    const itemParent = resolveParentBrandJS(itemBrand, canonicalDb).toLowerCase();
    const nameParent = resolveParentBrandJS(itemName, canonicalDb).toLowerCase();
    const bLow = itemBrand.toLowerCase();
    const nLow = itemName.toLowerCase();

    for (const t of targetNames || []) {
      const tLow = (t || '').toLowerCase().trim();
      if (!tLow) continue;
      if (tLow === bLow || tLow === nLow || bLow.includes(tLow) || nLow.includes(tLow)) return true;
      if (tLow === itemParent || tLow === nameParent) return true;
    }
    return false;
  }

  function scoreItemForSlotJS(item, slotSpec, idealMinors, canonicalDb) {
    const preferred = slotSpec.preferred || [];
    const altBrands = slotSpec.alt_brands || [];
    const targetCore = slotSpec.core || 'WEAPON_DAMAGE';
    const targetMinors = slotSpec.minors || idealMinors || [];
    const targetTalent = slotSpec.talent || null;

    let brandPts = 0;
    let brandTier = 'MISMATCH';
    if (matchBrandOrItemJS(item, preferred, canonicalDb)) {
      brandPts = 40.0;
      brandTier = 'PREFERRED_BIS';
    } else if (matchBrandOrItemJS(item, altBrands, canonicalDb)) {
      brandPts = 30.0;
      brandTier = 'ALT_VIABLE';
    } else {
      return [0.0, 'Wrong Brand/Set', { brand_tier: 'MISMATCH' }];
    }

    const core = item.core_attribute || {};
    const minors = (item.minor_attributes || []).map(m => ({ ...m }));
    const talentObj = item.talent || {};
    const itemTalent = (talentObj.name || '').trim().toLowerCase();
    const isPerfectLocked = Boolean(talentObj.is_perfect) || item.rarity === 'EXOTIC' || item.rarity === 'GEAR_SET';

    const coreRecal = Boolean(core.recal || core.is_recalibrated);
    const minorRecals = minors.map(m => Boolean(m.recal || m.is_recalibrated));
    const talentRecal = Boolean(talentObj.recal || talentObj.is_recalibrated);
    const isVirgin = !coreRecal && !minorRecals.some(Boolean) && !talentRecal;

    function scoreRawState(cType, cVal, mList, tName) {
      let cPts = 4.0;
      if (cType === targetCore) {
        const cMax = CORE_MAX[cType] || 15.0;
        const cRatio = cMax > 0 ? Math.min(1.15, cVal / cMax) : 1.0;
        cPts = 15.0 + 10.0 * cRatio;
      }

      const maxMSlots = item.rarity === 'GEAR_SET' || mList.length === 1 ? 1 : 2;
      const perMWeight = 20.0 / maxMSlots;
      let mPts = 0.0;

      for (const m of mList.slice(0, maxMSlots)) {
        const mT = m.type || '';
        const mV = Number(m.value || 0);
        const mMax = MINOR_MAX[mT] || 10.0;
        const ratio = mMax > 0 ? Math.min(1.15, mV / mMax) : 0.8;
        if (targetMinors.includes(mT)) {
          mPts += perMWeight * (0.6 + 0.4 * ratio);
        } else if ((idealMinors || []).includes(mT)) {
          mPts += perMWeight * 0.75 * (0.6 + 0.4 * ratio);
        } else {
          mPts += 2.0 * Math.min(1.0, ratio);
        }
      }

      let tPts = 15.0;
      if (targetTalent) {
        const tLow = targetTalent.toLowerCase().trim();
        const tClean = (tName || '').trim().toLowerCase();
        const baseTarget = tLow.replace('perfect ', '');
        // P0 Fix: Guard against empty tClean matching tLow.includes('')
        if (tClean && (tClean.includes(tLow) || tLow.includes(tClean) || tClean.includes(baseTarget))) {
          tPts = 15.0;
        } else {
          tPts = 3.0;
        }
      }
      return Math.min(105.0, Math.round((brandPts + cPts + mPts + tPts) * 10) / 10);
    }

    const baseCType = core.type || 'WEAPON_DAMAGE';
    const baseCVal = Number(core.value || CORE_MAX[baseCType] || 15.0);
    let bestScore = scoreRawState(baseCType, baseCVal, minors, itemTalent);
    let bestNotes = 'None (God-Rolled as-is)';
    let tinkerType = 'READY_AS_IS';

    if (item.rarity !== 'EXOTIC' && (isVirgin || coreRecal)) {
      const scCore = scoreRawState(targetCore, CORE_MAX[targetCore] || 15.0, minors, itemTalent);
      if (scCore > bestScore + 0.2) {
        bestScore = scCore;
        if (baseCType !== targetCore) {
          bestNotes = `Recalibrate Core -> Max ${targetCore}`;
          tinkerType = 'RECALIBRATE';
        } else {
          bestNotes = `Optimize Core -> Max ${targetCore}`;
          tinkerType = 'OPTIMIZE';
        }
      }
    }

    if (item.rarity !== 'EXOTIC') {
      for (let idx = 0; idx < minors.length; idx++) {
        if (isVirgin || minorRecals[idx]) {
          const oldMType = minors[idx].type || '';
          for (const candM of targetMinors) {
            const simMinors = minors.map(x => ({ ...x }));
            simMinors[idx] = { type: candM, value: MINOR_MAX[candM] || 10.0, recal: true };
            const scM = scoreRawState(baseCType, baseCVal, simMinors, itemTalent);
            if (scM > bestScore + 0.2) {
              bestScore = scM;
              tinkerType = oldMType === candM ? 'OPTIMIZE' : 'RECALIBRATE';
              bestNotes = `${oldMType === candM ? 'Optimize' : 'Recalibrate'} Minor #${idx + 1} -> Max ${candM}`;
            }
          }
        }
      }
    }

    if (targetTalent && (isVirgin || talentRecal) && !isPerfectLocked && (item.slot === 'CHEST' || item.slot === 'BACKPACK')) {
      const scT = scoreRawState(baseCType, baseCVal, minors, targetTalent.toLowerCase());
      if (scT > bestScore + 0.2) {
        bestScore = scT;
        bestNotes = `Recalibrate Talent -> ${targetTalent}`;
        tinkerType = 'RECALIBRATE';
      }
    }

    const powerRatio = computeItemPowerRatioJS(item);
    if (bestNotes === 'None (God-Rolled as-is)' && powerRatio < 0.995) {
      bestNotes = `Optimize rolls at Tinkering Station (${Math.round(powerRatio * 1000) / 10}% -> 100%)`;
      tinkerType = 'OPTIMIZE';
    }

    return [bestScore, bestNotes, {
      brand_tier: brandTier,
      is_virgin: isVirgin,
      tinker_type: tinkerType,
      is_prototype: Boolean(item.is_prototype) || powerRatio > 1.01,
    }];
  }

  function computeLoadoutBallisticsJS(build, slotBreakdown, bCores, bBrands, canonicalDb, weaponExpertise = 0, weaponTalentOverride = null, gearMods = null) {
    const resolvedBrands = {};
    let hasNinjaBike = false;
    for (const [rawB, cnt] of Object.entries(bBrands || {})) {
      if (String(rawB).toLowerCase().includes('ninjabike')) hasNinjaBike = true;
      const pBrand = resolveParentBrandJS(rawB, canonicalDb);
      resolvedBrands[pBrand] = (resolvedBrands[pBrand] || 0) + cnt;
    }

    const equippedNamesLower = new Set();
    for (const sVal of Object.values(slotBreakdown || {})) {
      const dName = String(sVal.display_name || sVal.raw_brand || sVal.brand || '').toLowerCase();
      equippedNamesLower.add(dName);
      if (dName.includes('ninjabike')) hasNinjaBike = true;
    }

    const effBrands = { ...resolvedBrands };
    if (hasNinjaBike) {
      for (const k of Object.keys(effBrands)) {
        if (!k.toLowerCase().includes('ninjabike')) {
          effBrands[k] = Math.min(4, effBrands[k] + 1);
        }
      }
    }

    const primaries = build.primary_weapons || ["St. Elmo's Engine"];
    const pRaw = primaries[0] || "St. Elmo's Engine";
    const pRawLow = String(pRaw).toLowerCase();
    const weaponsDb = (canonicalDb && canonicalDb.weapons) || [];
    let wSpec = null;
    let wName = pRaw;

    for (const [k, rawW] of iterCanonicalEntriesJS(weaponsDb)) {
      const kLow = k.toLowerCase();
      const aliases = Array.isArray(rawW.aliases) ? rawW.aliases.map(a => String(a).toLowerCase()) : [];
      if (
        pRawLow === kLow ||
        (kLow.length > 2 && pRawLow.includes(kLow)) ||
        (pRawLow.length > 2 && kLow.includes(pRawLow)) ||
        aliases.some(a => a.length > 2 && pRawLow.includes(a))
      ) {
        wSpec = normalizeWeaponEntryJS(rawW);
        wName = rawW.name || k;
        break;
      }
    }
    if (!wSpec) {
      wSpec = {
        class: 'AR',
        weapon_class: 'AR',
        base_dmg: 112400,
        base_damage: 112400,
        rpm: 850,
        mag_size: 50,
        reload_sec: 2.0,
        headshot_mult: 1.55,
        native_dttooc: 10.0,
        native_dta: 0.0,
        native_chc: 10.0,
        native_chd: 10.0,
      };
    }

    let gearChc = 0.0, gearChd = 0.0, gearDta = 0.0, gearDttooc = 0.0, gearHsd = 0.0, gearWh = 0.0, gearRegenFlat = 0.0;
    for (const sVal of Object.values(slotBreakdown || {})) {
      for (const m of sVal.minor_attributes || []) {
        const mT = String(m.type || '').toUpperCase();
        const mV = Number(m.value || 0);
        if (mT === 'CRITICAL_HIT_CHANCE') gearChc += mV;
        else if (mT === 'CRITICAL_HIT_DAMAGE') gearChd += mV;
        else if (mT === 'DAMAGE_TO_ARMOR') gearDta += mV;
        else if (mT === 'DTTOOC') gearDttooc += mV;
        else if (mT === 'HEADSHOT_DAMAGE') gearHsd += mV;
        else if (mT === 'WEAPON_HANDLING') gearWh += mV;
        else if (mT === 'ARMOR_REGEN') gearRegenFlat += mV;
      }
    }

    let modChc = 0.0, modChd = 0.0, modHsd = 0.0;
    if (Array.isArray(gearMods) && gearMods.length) {
      for (const gm of gearMods) {
        const gmUp = String(gm).toUpperCase();
        if (gmUp.includes('CHC')) modChc += 6.0;
        else if (gmUp.includes('CHD')) modChd += 12.0;
        else if (gmUp.includes('HSD')) modHsd += 10.0;
      }
    } else {
      const ideals = (build.ideal_minors || []).map(x => String(x).toUpperCase());
      if (ideals.includes('HEADSHOT_DAMAGE') && !ideals.includes('CRITICAL_HIT_CHANCE')) modHsd = 30.0;
      else modChd = 36.0;
    }

    const redCores = bCores.RED || 0;
    const blueCores = bCores.BLUE || 0;
    const yellowCores = bCores.YELLOW || 0;
    const specStr = String(build.specialization || '').toLowerCase();
    const effYellowTiers = Math.min(6, yellowCores + (specStr.includes('technician') ? 1 : 0) + ((effBrands['Brazos de Arcabuz'] || 0) >= 2 ? 1 : 0));

    let wdPct = 25.0 + redCores * 15.0 + Number(weaponExpertise || 0);
    const wClass = wSpec.class || 'AR';

    if ((effBrands['Lengmo'] || 0) >= 3 && wClass === 'LMG') wdPct += 30.0;
    if ((effBrands['Petrov Defense Group'] || 0) >= 1 && wClass === 'LMG') wdPct += 10.0;
    if ((effBrands['Fenris Group AB'] || 0) >= 1 && wClass === 'AR') wdPct += 10.0;
    if ((effBrands['Sokolov Concern'] || 0) >= 1 && wClass === 'SMG') wdPct += 10.0;
    if ((effBrands['Badger Tuff'] || 0) >= 1 && wClass === 'SHOTGUN') wdPct += 10.0;
    if ((effBrands['Overlord Armaments'] || 0) >= 1 && wClass === 'RIFLE') wdPct += 10.0;
    if ((effBrands['Douglas & Harding'] || 0) >= 1 && wClass === 'PISTOL') wdPct += 20.0;
    if ((effBrands['Electrique'] || 0) >= 3 && wClass === 'SMG') wdPct += 10.0;
    if ((effBrands['Heartbreaker'] || 0) >= 2 && (wClass === 'AR' || wClass === 'LMG')) wdPct += 15.0;
    if ((effBrands["Hunter's Fury"] || 0) >= 2 && (wClass === 'SMG' || wClass === 'SHOTGUN')) wdPct += 15.0;
    if ((effBrands['Hotshot'] || 0) >= 2 && wClass === 'MMR') wdPct += 30.0;
    if ((effBrands['Airaldi Holdings'] || 0) >= 1 && wClass === 'MMR') wdPct += 10.0;
    if ((effBrands['Habsburg Guard'] || 0) >= 2 && wClass === 'MMR') wdPct += 20.0;
    if ((effBrands['Walker, Harris & Co.'] || 0) >= 1) wdPct += 5.0;
    if ((effBrands['Hana-U Corporation'] || 0) >= 3) wdPct += 15.0;
    if ((effBrands['Yaahl Gear'] || 0) >= 2) wdPct += 5.0;
    if ([...equippedNamesLower].some(n => n.includes('picaro'))) wdPct += 10.0;
    if (wName.toLowerCase().includes('capacitor')) wdPct += effYellowTiers * 7.5;
    if ([...equippedNamesLower].some(n => n.includes('memento'))) wdPct += 30.0;

    let chc = 10.0 + Number(wSpec.native_chc || 0) + gearChc + modChc;
    let chd = 45.0 + Number(wSpec.native_chd || 0) + gearChd + modChd;
    let hsd = ((Number(wSpec.headshot_mult || 1.55) - 1.0) * 100.0) + 20.0 + gearHsd + modHsd;

    if ((effBrands['Česká Výroba s.r.o.'] || 0) >= 1) chc += 8.0;
    if ((effBrands['Grupo Sombra S.A.'] || 0) >= 1) chd += 15.0;
    if ((effBrands['Grupo Sombra S.A.'] || 0) >= 3) hsd += 15.0;
    if ((effBrands['Providence Defense'] || 0) >= 1) hsd += 15.0;
    if ((effBrands['Providence Defense'] || 0) >= 2) chc += 10.0;
    if ((effBrands['Providence Defense'] || 0) >= 3) chd += 15.0;
    if ((effBrands['Sokolov Concern'] || 0) >= 2) chd += 15.0;
    if ((effBrands['Sokolov Concern'] || 0) >= 3) chc += 10.0;
    if ((effBrands["Coyote's Mask"] || 0) >= 1 || [...equippedNamesLower].some(n => n.includes('coyote'))) {
      chc += 10.0;
      chd += 10.0;
    }
    if ((effBrands["Negotiator's Dilemma"] || 0) >= 2) chc += 15.0;
    if ((effBrands["Negotiator's Dilemma"] || 0) >= 3) chd += 20.0;
    if ((effBrands['Umbra Initiative'] || 0) >= 2) chc += 15.0;
    if ((effBrands['Umbra Initiative'] || 0) >= 4) chd += 100.0;
    if ((effBrands['Hotshot'] || 0) >= 2) hsd += 30.0;
    if ((effBrands['Airaldi Holdings'] || 0) >= 2) hsd += 15.0;
    if ((effBrands['Habsburg Guard'] || 0) >= 1) hsd += 15.0;
    if ([...equippedNamesLower].some(n => n.includes('punch drunk'))) hsd += 20.0;

    chc = Math.min(60.0, Math.max(0.0, chc));

    let dta = Number(wSpec.native_dta || 0) + gearDta;
    let dttooc = Number(wSpec.native_dttooc || 10.0) + gearDttooc;
    if ((effBrands['Walker, Harris & Co.'] || 0) >= 2) dta += 5.0;
    if ((effBrands['Walker, Harris & Co.'] || 0) >= 3) dttooc += 5.0;
    if ((effBrands['Airaldi Holdings'] || 0) >= 3) dta += 5.0;

    let twdPct = 0.0;
    let ampMult = 1.0;
    let rofMult = 1.0;
    let headhunterBonusMult = 1.0;

    const chestTalent = ((slotBreakdown.CHEST || {}).talent || '').toLowerCase();
    const bpTalent = ((slotBreakdown.BACKPACK || {}).talent || '').toLowerCase();
    const wTalentLow = String(weaponTalentOverride || wSpec.talent || '').toLowerCase();

    if (chestTalent.includes('glass cannon')) ampMult *= chestTalent.includes('perfect') ? 1.3 : 1.25;
    else if (chestTalent.includes('obliterate')) twdPct += 20.0;
    else if (chestTalent.includes('spotter')) ampMult *= chestTalent.includes('perfect') ? 1.2 : 1.15;
    else if (chestTalent.includes('intimidate')) ampMult *= chestTalent.includes('perfect') ? 1.4 : 1.35;
    else if (chestTalent.includes('headhunter')) headhunterBonusMult = hsd >= 150.0 ? 2.85 : 1.85;
    else if (chestTalent.includes('focus')) twdPct += chestTalent.includes('perfect') ? 60.0 : 50.0;

    if (bpTalent.includes('unstoppable force')) twdPct += bpTalent.includes('perfect') ? 35.0 : 25.0;
    else if (bpTalent.includes('vigilance')) twdPct += 25.0;
    else if (bpTalent.includes('companion') || bpTalent.includes('composure')) twdPct += 15.0;
    else if (bpTalent.includes('opportunistic')) ampMult *= bpTalent.includes('perfect') ? 1.15 : 1.1;

    if ((effBrands["Striker's Battlegear"] || 0) >= 3) rofMult *= 1.15;
    if ((effBrands["Striker's Battlegear"] || 0) >= 4) {
      const hasStrikerBp = resolveParentBrandJS((slotBreakdown.BACKPACK || {}).brand || '', canonicalDb) === "Striker's Battlegear" || bpTalent.includes('risk management');
      ampMult *= hasStrikerBp ? 1.9 : 1.65;
    }
    if ((effBrands['Heartbreaker'] || 0) >= 4) ampMult *= 1.52;
    if ((effBrands["Hunter's Fury"] || 0) >= 4) ampMult *= 1.45;
    if ((effBrands['Umbra Initiative'] || 0) >= 4) rofMult *= 1.3;
    if ((effBrands['Future Initiative'] || 0) >= 4) twdPct += chestTalent.includes('tactical superiority') ? 25.0 : 15.0;

    if (wTalentLow.includes('flatline') || wName.toLowerCase().includes('kingbreaker')) ampMult *= (wTalentLow.includes('perfect') || wName.toLowerCase().includes('kingbreaker')) ? 1.2 : 1.15;
    else if (wTalentLow.includes('optimist')) wdPct += 15.0;
    else if (wTalentLow.includes('strained')) chd += 35.0;
    else if (wTalentLow.includes('killer') || wName.toLowerCase().includes('dark winter')) chd += (wTalentLow.includes('perfect') || wName.toLowerCase().includes('dark winter')) ? 50.0 : 40.0;
    else if (wTalentLow.includes('in sync') || wName.toLowerCase().includes('harmony')) wdPct += (wTalentLow.includes('perfect') || wName.toLowerCase().includes('harmony')) ? 40.0 : 30.0;
    else if (wTalentLow.includes('sadist') || wTalentLow.includes('eyeless') || wTalentLow.includes('ignited')) ampMult *= 1.2;
    else if (wTalentLow.includes('sledgehammer')) dta += 40.0;
    else if (wTalentLow.includes('determined') && wClass === 'MMR') headhunterBonusMult = Math.max(headhunterBonusMult, 2.5);

    const hsHitRate = (wClass === 'MMR' && (wTalentLow.includes('determined') || headhunterBonusMult > 1.0)) ? 1.0 : (wClass === 'MMR' ? 0.85 : 0.25);
    const critAndHsMult = 1.0 + ((chc / 100.0) * (chd / 100.0)) + (hsHitRate * (hsd / 100.0));
    const baseDmg = Number(wSpec.base_dmg || 110000);
    const perBullet =
      baseDmg *
      (1.0 + wdPct / 100.0) *
      critAndHsMult *
      (1.0 + dta / 100.0) *
      (1.0 + dttooc / 100.0) *
      (1.0 + twdPct / 100.0) *
      ampMult *
      headhunterBonusMult;

    const effRpm = Number(wSpec.rpm || 800) * rofMult;
    const rps = effRpm / 60.0;
    const burstDps = perBullet * rps;

    let mag = Number(wSpec.mag_size || 50);
    if ((effBrands['Brazos de Arcabuz'] || 0) >= 3) mag = Math.round(mag * 1.5);
    const whBonus = gearWh + ((effBrands["Striker's Battlegear"] || 0) >= 2 ? 15.0 : 0.0) + ((effBrands['Hotshot'] || 0) >= 1 ? 30.0 : 0.0);
    const reloadSec = Math.max(0.6, Number(wSpec.reload_sec || 2.0) / (1.0 + whBonus / 100.0));
    const fireDuration = rps > 0 ? mag / rps : 1.0;
    let sustainedDps = (perBullet * mag) / (fireDuration + reloadSec);

    let pestiTickDps = 0.0;
    if (wName.toLowerCase().includes('pestilence')) {
      pestiTickDps =
        baseDmg *
        (1.0 + wdPct / 100.0) *
        (1.0 + dta / 100.0) *
        (1.0 + dttooc / 100.0) *
        (1.0 + twdPct / 100.0) *
        ampMult;
      sustainedDps += pestiTickDps;
    }

    let skillCombinedDps = 0;
    const roleUp = String(build.role || '').toUpperCase();
    if (roleUp === 'SKILL_DPS' || roleUp === 'CROWD_CONTROL') {
      let baseSkill = 420000.0 * (effYellowTiers / 6.0);
      if ((effBrands['Empress International'] || 0) >= 3) baseSkill *= 1.35;
      if ((effBrands['Waveform'] || 0) >= 1 || [...equippedNamesLower].some(n => n.includes('waveform'))) baseSkill *= 1.2;
      if (wName.toLowerCase().includes('capacitor')) baseSkill *= 1.45;
      if ((effBrands['Eclipse Protocol'] || 0) >= 4) baseSkill = 680000.0 * (effYellowTiers / 6.0);
      skillCombinedDps = Math.round(baseSkill);
      sustainedDps += skillCombinedDps;
    }

    const baseArmor = 726000.0 + blueCores * 170000.0;
    let armorPctBonus = 10.0;
    if ((effBrands['Gila Guard'] || 0) >= 1) armorPctBonus += 5.0;
    if ((effBrands['Uzina Getica'] || 0) >= 1) armorPctBonus += 5.0;
    if ((effBrands['Foundry Bulwark'] || 0) >= 2) armorPctBonus += 10.0;
    if ((effBrands['Heartbreaker'] || 0) >= 4) armorPctBonus += 50.0;
    const totalArmor = baseArmor * (1.0 + armorPctBonus / 100.0);

    let regenPct = 0.0;
    if ((effBrands['Belstone Armory'] || 0) >= 1) regenPct += 1.0;
    if ((effBrands['Gila Guard'] || 0) >= 3) regenPct += 1.0;
    if ((effBrands['Foundry Bulwark'] || 0) >= 3) regenPct += 1.0;
    if ((effBrands['Golan Gear Ltd'] || 0) >= 2) regenPct += 1.5;
    if ([...equippedNamesLower].some(n => n.includes('memento'))) regenPct += 3.0;
    if ([...equippedNamesLower].some(n => n.includes("emperor's guard"))) regenPct += 1.0;
    const totalRegenPerSec = Math.round((totalArmor * (regenPct / 100.0)) + gearRegenFlat);

    const enemyArchetypes = [
      { id: 'heroic_solo_elite', label: 'Heroic Solo Elite', hp: 9500000.0 },
      { id: 'heroic_4p_named', label: 'Heroic 4P Named Boss', hp: 24000000.0 },
      { id: 'legendary_4p_elite', label: 'Legendary 4P White Tusk', hp: 18500000.0 },
      { id: 'countdown_hunter', label: 'Countdown Hunter', hp: 32000000.0 },
      { id: 'raid_incursion_boss', label: 'Raid / Incursion Boss', hp: 85000000.0 },
    ];
    const ttkMatrix = enemyArchetypes.map(enemy => {
      const ehp = enemy.hp;
      const oneMagDmg = (perBullet * mag) + (pestiTickDps + skillCombinedDps) * fireDuration;
      const ttkSec = (oneMagDmg >= ehp && (burstDps + pestiTickDps + skillCombinedDps) > 0)
        ? Math.round((ehp / (burstDps + pestiTickDps + skillCombinedDps)) * 100) / 100
        : Math.round((ehp / Math.max(1.0, sustainedDps)) * 100) / 100;
      const shotsNeeded = Math.max(1, Math.round(ehp / Math.max(1.0, perBullet)));
      return {
        id: enemy.id,
        label: enemy.label,
        hp_millions: Math.round((ehp / 1000000.0) * 10) / 10,
        ttk_sec: ttkSec,
        shots_needed: shotsNeeded,
        mags_needed: Math.round((shotsNeeded / Math.max(1.0, mag)) * 10) / 10,
      };
    });
    const ttkNamedSec = (ttkMatrix.find(x => x.id === 'heroic_4p_named') || {}).ttk_sec || 2.5;

    return {
      weapon_name: wName,
      weapon_class: wClass,
      weapon_talent: weaponTalentOverride || wSpec.talent || 'Standard',
      weapon_expertise: weaponExpertise,
      burst_dps: Math.round(burstDps),
      sustained_dps: Math.round(sustainedDps),
      per_bullet_dmg: Math.round(perBullet),
      pesti_tick_dps: Math.round(pestiTickDps),
      skill_combined_dps: skillCombinedDps,
      effective_rpm: Math.round(effRpm),
      mag_size: Math.round(mag),
      reload_sec: Math.round(reloadSec * 100) / 100,
      total_wd_pct: Math.round(wdPct * 10) / 10,
      chc_pct: Math.round(chc * 10) / 10,
      chd_pct: Math.round(chd * 10) / 10,
      hsd_pct: Math.round(hsd * 10) / 10,
      dta_pct: Math.round(dta * 10) / 10,
      dttooc_pct: Math.round(dttooc * 10) / 10,
      twd_pct: Math.round(twdPct * 10) / 10,
      amp_multiplier: Math.round(ampMult * 100) / 100,
      total_armor: Math.round(totalArmor),
      armor_regen_per_sec: totalRegenPerSec,
      effective_yellow_tiers: effYellowTiers,
      ttk_heroic_named_sec: ttkNamedSec,
      ttk_matrix: ttkMatrix,
    };
  }

  function evaluateAllBuildsJS(ownedItems, customBuildsList = []) {
    const seed = getSeedData() || {};
    const canonicalDb = seed.canonical_db || {};
    const baseBuilds = seed.meta_builds || [];
    const builds = [...baseBuilds, ...customBuildsList];

    const allSlots = ['MASK', 'BACKPACK', 'CHEST', 'GLOVES', 'HOLSTER', 'KNEEPADS'];
    const itemsBySlot = { MASK: [], BACKPACK: [], CHEST: [], GLOVES: [], HOLSTER: [], KNEEPADS: [] };

    for (const it of ownedItems || []) {
      it.archetype_tags = classifyItemArchetypeJS(it, canonicalDb);
      const s = (it.slot || '').toUpperCase();
      if (itemsBySlot[s]) itemsBySlot[s].push(it);
    }

    const evaluatedBuilds = [];
    const itemUsage = {};

    for (const b of builds) {
      const buildId = b.build_id;
      const slotsSpec = b.slots || {};
      const idealMinors = b.ideal_minors || [];
      const slotBreakdown = {};

      let totalScore = 0.0;
      let ownedSlotsCount = 0;
      let bisSlotsCount = 0;
      const bCores = { RED: 0, BLUE: 0, YELLOW: 0 };
      const bBrands = {};
      let hasExoticEquipped = false;

      for (const slot of allSlots) {
        const sSpec = slotsSpec[slot] || {};
        const candidates = itemsBySlot[slot] || [];
        const scoredList = [];

        for (const cand of candidates) {
          const [sc, notes, details] = scoreItemForSlotJS(cand, sSpec, idealMinors, canonicalDb);
          if (sc <= 0) continue;
          const rawBrand = cand.brand_or_set || cand.item_name || 'Unknown';
          const rawName = cand.item_name || rawBrand;
          const parentBrand = resolveParentBrandJS(NAMED_ITEM_PARENT_BRAND[rawName.toLowerCase()] ? rawName : rawBrand, canonicalDb);
          scoredList.push({
            status: 'OWNED',
            match_pct: Math.min(100.0, sc),
            raw_sort_score: sc,
            overcap_bonus_pct: Math.max(0.0, Math.round((sc - 100.0) * 10) / 10),
            item_id: cand.item_id,
            display_name: `${cand.item_name || cand.brand_or_set} (${cand.rarity || 'HIGH_END'})`,
            brand: parentBrand,
            raw_brand: rawBrand,
            rarity: cand.rarity || 'HIGH_END',
            is_prototype: details.is_prototype || false,
            roll_source: cand.roll_source || 'OCR_DIRECT',
            core_type: (cand.core_attribute || {}).type || 'WEAPON_DAMAGE',
            core_val: (cand.core_attribute || {}).value || 15.0,
            minor_attributes: cand.minor_attributes || [],
            talent: (cand.talent || {}).name || '',
            tinker_advice: notes,
            tinker_type: details.tinker_type || 'READY_AS_IS',
            brand_tier: details.brand_tier,
          });
        }

        scoredList.sort((x, y) => (y.raw_sort_score - x.raw_sort_score) || ((y.is_prototype ? 1 : 0) - (x.is_prototype ? 1 : 0)));

        // Enforce 1-Exotic Armor Cap across the 6 slots
        const validTop = scoredList.find(cand => {
          const isEx = cand.rarity === 'EXOTIC' || isExoticItemJS(cand.raw_brand || cand.brand, canonicalDb);
          return !(isEx && hasExoticEquipped);
        });

        if (validTop) {
          const isEx = validTop.rarity === 'EXOTIC' || isExoticItemJS(validTop.raw_brand || validTop.brand, canonicalDb);
          if (isEx) hasExoticEquipped = true;
          validTop.alt_owned_candidates = scoredList
            .filter(alt => alt.item_id !== validTop.item_id)
            .slice(0, 3)
            .map(alt => ({
              item_id: alt.item_id,
              display_name: alt.display_name,
              brand: alt.brand,
              match_pct: alt.match_pct,
              tinker_advice: alt.tinker_advice,
            }));

          slotBreakdown[slot] = validTop;
          totalScore += validTop.match_pct;
          ownedSlotsCount += 1;
          if (validTop.brand_tier === 'PREFERRED_BIS') bisSlotsCount += 1;

          const cType = validTop.core_type || 'WEAPON_DAMAGE';
          const rawLow = String(validTop.raw_brand || validTop.display_name || '').toLowerCase();
          if (rawLow.includes('memento') || rawLow.includes('ninjabike')) {
            bCores.RED += 1;
            bCores.BLUE += 1;
            bCores.YELLOW += 1;
          } else if (cType === 'ARMOR') bCores.BLUE += 1;
          else if (cType === 'SKILL_TIER') bCores.YELLOW += 1;
          else bCores.RED += 1;

          const pBrand = resolveParentBrandJS(validTop.brand, canonicalDb);
          bBrands[pBrand] = (bBrands[pBrand] || 0) + 1;

          const cid = validTop.item_id;
          if (!itemUsage[cid]) itemUsage[cid] = [];
          itemUsage[cid].push({
            build_id: buildId,
            build_name: b.name,
            tier_badge: b.tier_badge || 'META',
            slot,
            score: validTop.match_pct,
            tinker: validTop.tinker_advice,
            tinker_type: validTop.tinker_type,
            is_starter: true,
          });
        } else {
          const prefList = [...(sSpec.preferred || []), ...(sSpec.alt_brands || [])];
          let targetBrandRaw = prefList[0] || 'Unknown';
          if (hasExoticEquipped && isExoticItemJS(targetBrandRaw, canonicalDb)) {
            const nonEx = prefList.find(p => !isExoticItemJS(p, canonicalDb));
            if (nonEx) targetBrandRaw = nonEx;
          }
          if (isExoticItemJS(targetBrandRaw, canonicalDb)) {
            hasExoticEquipped = true;
          }
          const targetParentBrand = resolveParentBrandJS(targetBrandRaw, canonicalDb);
          const targetCore = sSpec.core || 'WEAPON_DAMAGE';
          const targetMinors = sSpec.minors || idealMinors || [];
          const maxMinorsForMissing = isGearSetBrandJS(targetParentBrand, canonicalDb) ? 1 : 2;

          if (targetBrandRaw.includes('Memento') || targetBrandRaw.includes('NinjaBike')) {
            bCores.RED += 1;
            bCores.BLUE += 1;
            bCores.YELLOW += 1;
          } else if (targetCore === 'ARMOR') bCores.BLUE += 1;
          else if (targetCore === 'SKILL_TIER') bCores.YELLOW += 1;
          else bCores.RED += 1;

          bBrands[targetParentBrand] = (bBrands[targetParentBrand] || 0) + 1;
          slotBreakdown[slot] = {
            status: 'MISSING',
            match_pct: 0.0,
            item_id: null,
            display_name: `Missing: ${(sSpec.preferred || []).join(', ')}`,
            brand: targetParentBrand,
            raw_brand: targetBrandRaw,
            rarity: isExoticItemJS(targetBrandRaw, canonicalDb) ? 'EXOTIC' : (isGearSetBrandJS(targetParentBrand, canonicalDb) ? 'GEAR_SET' : 'HIGH_END'),
            core_type: targetCore,
            core_val: CORE_MAX[targetCore] || 15.0,
            minor_attributes: targetMinors.slice(0, maxMinorsForMissing).map(m => ({ type: m, value: MINOR_MAX[m] || 10.0 })),
            talent: sSpec.talent || '',
            tinker_advice: `Farm Targeted Loot: ${(sSpec.preferred || []).join(' / ')}`,
            tinker_type: 'FARM_NEEDED',
            alt_owned_candidates: [],
          };
        }
      }

      // Auto-balance 3x Gear Mods against 60.0% CHC cap
      const idealsUp = idealMinors.map(x => String(x).toUpperCase());
      let optimalMods = ['MOD_CHD', 'MOD_CHD', 'MOD_CHD'];
      if (idealsUp.includes('HEADSHOT_DAMAGE') && !idealsUp.includes('CRITICAL_HIT_CHANCE')) {
        optimalMods = ['MOD_HSD', 'MOD_HSD', 'MOD_HSD'];
      } else if (idealsUp.includes('SKILL_HASTE') && !idealsUp.includes('CRITICAL_HIT_CHANCE')) {
        optimalMods = ['MOD_SH', 'MOD_SH', 'MOD_SH'];
      } else if (idealsUp.includes('HAZARD_PROTECTION') && !idealsUp.includes('CRITICAL_HIT_CHANCE')) {
        optimalMods = ['MOD_PFE', 'MOD_PFE', 'MOD_PFE'];
      } else {
        const probeBal = computeLoadoutBallisticsJS(b, slotBreakdown, bCores, bBrands, canonicalDb, 0, null, ['MOD_CHD', 'MOD_CHD', 'MOD_CHD']);
        const baseChcNoMods = Number(probeBal.chc_pct || 0);
        const deficit = Math.max(0.0, 58.0 - baseChcNoMods);
        const chcModsNeeded = Math.min(3, Math.max(0, Math.ceil(deficit / 6.0)));
        optimalMods = [
          ...Array(chcModsNeeded).fill('MOD_CHC'),
          ...Array(3 - chcModsNeeded).fill('MOD_CHD'),
        ];
      }

      const completionPct = Math.round((totalScore / 6.0) * 10) / 10;
      evaluatedBuilds.push({
        build_id: buildId,
        name: b.name,
        role: b.role,
        tier_badge: b.tier_badge || 'META',
        summary: b.summary,
        primary_weapons: b.primary_weapons || [],
        specialization: b.specialization || 'Gunner',
        target_cores: b.target_cores || {},
        ideal_minors: idealMinors,
        completion_pct: completionPct,
        owned_slots_count: ownedSlotsCount,
        bis_slots_count: bisSlotsCount,
        missing_slots_count: 6 - ownedSlotsCount,
        slot_breakdown: slotBreakdown,
        optimal_gear_mods: optimalMods,
        knowledge_dossier: b.knowledge_dossier || {
          why_it_works: `${b.name} combines multiplicative 7-bucket damage scaling with targeted brand/set bonuses.`,
          how_it_plays: '1. Engage from advantageous cover/shield angles.\n2. Maintain talent stacks and target priority elites.',
          why_each_choice_matters: 'Each slot completes key Brand Set and Gear Set thresholds while respecting the 60% CHC cap.',
          pro_tips: ['Use Auto-Assemble From Armory in the Workbench to slot your best owned gear and auto-balance 3x Gear Mods.'],
        },
        ballistics: computeLoadoutBallisticsJS(b, slotBreakdown, bCores, bBrands, canonicalDb, 0, null, optimalMods),
      });
    }

    evaluatedBuilds.sort((a, b) => b.owned_slots_count - a.owned_slots_count || b.completion_pct - a.completion_pct);

    // Multi-Archetype Deconstruct Advisor
    const deconstructCandidates = [];
    const bySlotBrandArch = {};
    for (const it of ownedItems || []) {
      const s = (it.slot || 'UNKNOWN').toUpperCase();
      const bName = resolveParentBrandJS(it.brand_or_set || it.item_name || 'Unknown', canonicalDb);
      const arch = (it.archetype_tags || classifyItemArchetypeJS(it, canonicalDb)).role_archetype || 'HYBRID_TACTICAL';
      const key = `${s}|${bName}|${arch}`;
      if (!bySlotBrandArch[key]) bySlotBrandArch[key] = [];
      bySlotBrandArch[key].push(it);
    }
    for (const it of ownedItems || []) {
      const iid = it.item_id;
      const usages = itemUsage[iid] || [];
      const rarity = String(it.rarity || 'HIGH_END').toUpperCase();
      if (it.is_favorite || rarity === 'EXOTIC' || rarity === 'NAMED_HIGH_END' || usages.length > 0) continue;
      const s = (it.slot || 'UNKNOWN').toUpperCase();
      const bName = resolveParentBrandJS(it.brand_or_set || it.item_name || 'Unknown', canonicalDb);
      const archObj = it.archetype_tags || classifyItemArchetypeJS(it, canonicalDb);
      const arch = archObj.role_archetype || 'HYBRID_TACTICAL';
      const sameGroup = bySlotBrandArch[`${s}|${bName}|${arch}`] || [];
      const powerRatio = computeItemPowerRatioJS(it);
      if (sameGroup.length > 1) {
        const bestRatio = Math.max(...sameGroup.map(g => computeItemPowerRatioJS(g)));
        if (powerRatio + 0.08 < bestRatio) {
          deconstructCandidates.push({
            item_id: iid,
            slot: s,
            item_name: it.item_name || bName,
            brand_or_set: bName,
            rarity,
            role_archetype: archObj.role_label || arch,
            reason: `Strictly dominated duplicate ${bName} ${s} in ${archObj.role_label || arch} archetype (${Math.round(powerRatio * 100)}% vs ${Math.round(bestRatio * 100)}% roll power) and unused in any of the 13 Meta Builds.`,
          });
        }
      } else if (powerRatio < 0.72) {
        deconstructCandidates.push({
          item_id: iid,
          slot: s,
          item_name: it.item_name || bName,
          brand_or_set: bName,
          rarity,
          role_archetype: archObj.role_label || arch,
          reason: `Unused in all 13 Meta Builds and low attribute roll power (${Math.round(powerRatio * 100)}%). Safe to deconstruct for Printer Filament / Receiver Components.`,
        });
      }
    }

    return {
      evaluated_builds: evaluatedBuilds,
      item_usage: itemUsage,
      deconstruct_candidates: deconstructCandidates,
    };
  }

  function hasWordBoundaryMatchJS(term, textLow) {
    const clean = String(term || '').trim().toLowerCase();
    if (!clean) return false;
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i').test(textLow);
  }

  function snapShorthandToItemJS(shorthand, slotOverride = null) {
    const seed = getSeedData() || {};
    const db = seed.canonical_db || {};
    const sLow = (shorthand || '').toLowerCase();

    // P0 Fix: Check specific slots BEFORE 'vest' and remove 'armor' from CHEST keywords so 'armor core' never hijacks slot!
    let slot = slotOverride && slotOverride !== 'AUTO' ? slotOverride : null;
    if (!slot) {
      const slotKeywords = [
        ['MASK', ['mask', 'coyote', 'vile', 'catharsis', 'nightwatcher', 'punch drunk', 'hollow man']],
        ['BACKPACK', ['backpack', 'bag', 'pack', 'backbone', 'memento', 'the gift', 'ninjabike', 'the setup', 'force multiplier', 'matador']],
        ['GLOVES', ['glove', 'gloves', 'contractor', 'btsu', 'deathgrips', 'motherly love', 'firm handshake']],
        ['HOLSTER', ['holster', 'waveform', 'picaro', 'claws out', 'forge', 'ammo dump']],
        ['KNEEPADS', ['kneepad', 'kneepads', 'knees', 'turmoil', "fox's prayer", 'fox prayer', 'sawyer', "emperor's guard"]],
        ['CHEST', ['chest', 'vest', 'sacrifice', 'chainkiller', 'closer', 'pointman', 'hunter-killer', 'everyday carrier', 'zero fs', "caesar's guard"]],
      ];
      for (const [sCode, kwList] of slotKeywords) {
        if (kwList.some(kw => hasWordBoundaryMatchJS(kw, sLow))) {
          slot = sCode;
          break;
        }
      }
    }
    if (!slot) slot = 'MASK';

    let canonName = shorthand.trim();
    let rarity = 'HIGH_END';
    let meta = {};

    for (const [name, m] of iterCanonicalEntriesJS(db.named_items)) {
      const aliases = [name.toLowerCase(), ...(m.aliases || []).map(a => String(a).toLowerCase())];
      if (aliases.some(a => a.length >= 3 && hasWordBoundaryMatchJS(a, sLow))) {
        canonName = name;
        rarity = 'NAMED_HIGH_END';
        meta = m;
        break;
      }
    }
    if (rarity === 'HIGH_END') {
      for (const [name, m] of iterCanonicalEntriesJS(db.exotics)) {
        const aliases = [name.toLowerCase(), ...(m.aliases || []).map(a => String(a).toLowerCase())];
        if (aliases.some(a => a.length >= 3 && hasWordBoundaryMatchJS(a, sLow))) {
          canonName = name;
          rarity = 'EXOTIC';
          meta = m;
          break;
        }
      }
    }
    if (rarity === 'HIGH_END') {
      for (const [name, m] of iterCanonicalEntriesJS(db.gear_sets)) {
        const aliases = [name.toLowerCase(), ...(m.aliases || []).map(a => String(a).toLowerCase())];
        if (aliases.some(a => a.length >= 3 && hasWordBoundaryMatchJS(a, sLow))) {
          canonName = name;
          rarity = 'GEAR_SET';
          meta = m;
          break;
        }
      }
    }
    if (rarity === 'HIGH_END') {
      for (const [name, m] of iterCanonicalEntriesJS(db.brand_sets)) {
        const aliases = [name.toLowerCase(), ...(m.aliases || []).map(a => String(a).toLowerCase())];
        if (aliases.some(a => a.length >= 3 && hasWordBoundaryMatchJS(a, sLow))) {
          canonName = name;
          rarity = 'HIGH_END';
          meta = m;
          break;
        }
      }
    }

    const brandOrSet = rarity === 'NAMED_HIGH_END' ? meta.brand || canonName : canonName;
    if (meta.slot && !slotOverride) slot = meta.slot;

    let coreType = meta.core === 'ARMOR' || meta.default_core === 'ARMOR'
      ? 'ARMOR'
      : (meta.core === 'SKILL_TIER' || meta.default_core === 'SKILL_TIER' ? 'SKILL_TIER' : 'WEAPON_DAMAGE');
    if (sLow.includes('red core') || hasWordBoundaryMatchJS('wd', sLow) || sLow.includes('weapon damage')) coreType = 'WEAPON_DAMAGE';
    else if (sLow.includes('blue core') || sLow.includes('170k') || sLow.includes('armor core')) coreType = 'ARMOR';
    else if (sLow.includes('yellow core') || sLow.includes('skill tier')) coreType = 'SKILL_TIER';

    const coreVal = coreType === 'ARMOR' ? 170000 : coreType === 'SKILL_TIER' ? 1 : 15.0;
    const isPrototype = sLow.includes('prototype') || sLow.includes('22.5') || sLow.includes('9%') || sLow.includes('9.0%');

    const minors = [];
    if (meta.fixed_minor) {
      minors.push({ type: meta.fixed_minor.type, value: meta.fixed_minor.max, recal: false });
    }
    if (minors.length < (rarity === 'GEAR_SET' ? 1 : 2)) {
      if (coreType === 'SKILL_TIER') {
        minors.push({ type: 'SKILL_DAMAGE', value: 10.0, recal: false });
        if (rarity !== 'GEAR_SET' && minors.length < 2) minors.push({ type: 'SKILL_HASTE', value: 12.0, recal: false });
      } else {
        if (!minors.some(m => m.type === 'CRITICAL_HIT_CHANCE')) {
          minors.push({ type: 'CRITICAL_HIT_CHANCE', value: isPrototype ? 9.0 : 6.0, recal: false });
        }
        if (rarity !== 'GEAR_SET' && minors.length < 2) {
          minors.push({ type: 'CRITICAL_HIT_DAMAGE', value: 12.0, recal: false });
        }
      }
    }

    let talentObj = null;
    if (meta.talent) {
      talentObj = { name: meta.talent, is_perfect: rarity === 'NAMED_HIGH_END' || rarity === 'EXOTIC', recal: false };
    } else if (slot === 'CHEST' || slot === 'BACKPACK') {
      if (sLow.includes('obliterate')) talentObj = { name: 'Obliterate', is_perfect: false, recal: false };
      else if (sLow.includes('glass cannon')) talentObj = { name: 'Glass Cannon', is_perfect: false, recal: false };
      else if (sLow.includes('vigilance')) talentObj = { name: 'Vigilance', is_perfect: false, recal: false };
      else if (sLow.includes('unstoppable')) talentObj = { name: 'Unstoppable Force', is_perfect: false, recal: false };
    }

    const itemId = `shd_${slot.toLowerCase()}_${Math.random().toString(36).substring(2, 10)}`;
    return {
      item_id: itemId,
      slot,
      rarity,
      brand_or_set: brandOrSet,
      item_name: canonName,
      score_or_level: 40,
      is_prototype: isPrototype,
      augment: null,
      expertise_level: 0,
      core_attribute: { type: coreType, value: isPrototype && coreType === 'WEAPON_DAMAGE' ? 22.5 : coreVal, recal: false },
      minor_attributes: minors,
      mod_slots: [],
      talent: talentObj,
      source_type: 'MANUAL_SHORTHAND',
      roll_source: 'OCR_DIRECT',
      ocr_confidence: 0.98,
      user_verified: true,
      is_favorite: false,
      raw_ocr_text: shorthand,
    };
  }

  function buildExpertisePayload(store) {
    const cats = store.expertise_categories || [];
    const items = store.expertise_items || [];
    const totalProf = cats.reduce((acc, c) => acc + Number(c.proficient || 0), 0);
    const totalItems = cats.reduce((acc, c) => acc + Number(c.total || 0), 0) || 500;
    const missing = Math.max(0, totalItems - totalProf);
    const expLevel = Math.min(30, Math.max(1, Math.floor(totalProf / 14)));
    return {
      expertise_level: expLevel,
      total_proficient: totalProf,
      total_items: totalItems,
      missing_count: missing,
      estimated_filament_to_max: missing * 300,
      categories: cats,
      items: items,
    };
  }

  function buildLocalPlatformState() {
    detectRuntimeProfile();
    const store = loadLocalStore();
    const seed = getSeedData() || {};
    const solverOut = evaluateAllBuildsJS(store.items, store.custom_builds || []);

    return {
      profile: _activeProfile,
      inventory: store.items,
      inventory_count: store.items.length,
      evaluated_builds: solverOut.evaluated_builds,
      item_usage: solverOut.item_usage,
      deconstruct_candidates: solverOut.deconstruct_candidates,
      saved_loadouts: store.saved_loadouts || [],
      admin_showcase_loadouts: seed.saved_loadouts || [],
      expertise: buildExpertisePayload(store),
      canonical: seed.canonical_db || {},
    };
  }

  function enrichServerState(serverData) {
    detectRuntimeProfile();
    _activeProfile.mode = 'PC_FASTAPI';
    const seed = getSeedData() || {};
    return {
      ...serverData,
      profile: _activeProfile,
      admin_showcase_loadouts: serverData.admin_showcase_loadouts || seed.saved_loadouts || [],
    };
  }

  // Unified Public Adapter API (with all aliases required by web/app.js)
  const Adapter = {
    getActiveProfile: () => detectRuntimeProfile(),
    setActiveProfile: profileId => setActiveProfile(profileId),

    getMode: () => {
      if (_pcServerAvailable === true) return 'FASTAPI_PC';
      if (window.RollupBridge) return 'ANDROID_HUB_CARTRIDGE';
      return 'PORTABLE_LOCAL';
    },

    async getState() {
      detectRuntimeProfile();
      if (_activeProfile.userId === 'admin' && _pcServerAvailable !== false) {
        try {
          const res = await fetch('/api/state', { signal: AbortSignal.timeout(1800) });
          if (res.ok) {
            _pcServerAvailable = true;
            const data = await res.json();
            return enrichServerState(data);
          }
        } catch (_) {
          _pcServerAvailable = false;
        }
      }
      return buildLocalPlatformState();
    },

    async fetchState() {
      return Adapter.getState();
    },

    async loadDemoStash() {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/demo/load-golden', { method: 'POST' });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const seed = getSeedData() || {};
      const store = loadLocalStore();
      store.items = JSON.parse(JSON.stringify(seed.golden_items || []));
      if ((store.saved_loadouts || []).length === 0) {
        store.saved_loadouts = JSON.parse(JSON.stringify(seed.saved_loadouts || []));
      }
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async resetGolden() {
      return Adapter.loadDemoStash();
    },

    async clearAllStash() {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/items', { method: 'DELETE' });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      store.items = [];
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async clearAll() {
      return Adapter.clearAllStash();
    },

    async quickAddShorthand(shorthand, slotOverride = null) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/ingest/shorthand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shorthand, slot_override: slotOverride }),
        });
        const d = await res.json();
        return { item: d.item, state: enrichServerState(d.state) };
      }
      const item = snapShorthandToItemJS(shorthand, slotOverride);
      const store = loadLocalStore();
      const idx = store.items.findIndex(x => x.item_id === item.item_id);
      if (idx >= 0) store.items[idx] = item;
      else store.items.unshift(item);
      saveLocalStore(store);
      return { item, state: buildLocalPlatformState() };
    },

    async quickAdd(shorthand, slotOverride = null) {
      return Adapter.quickAddShorthand(shorthand, slotOverride);
    },

    async toggleFavorite(itemId) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/items/${encodeURIComponent(itemId)}/favorite`, { method: 'POST' });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      const it = store.items.find(x => x.item_id === itemId);
      if (it) it.is_favorite = !it.is_favorite;
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async deleteItem(itemId) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      store.items = store.items.filter(x => x.item_id !== itemId);
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async updateItem(itemId, payload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/items/${encodeURIComponent(itemId)}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      const idx = store.items.findIndex(x => x.item_id === itemId);
      if (idx >= 0) {
        store.items[idx] = {
          ...store.items[idx],
          ...payload,
          user_verified: true,
        };
      }
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async saveLoadout(loadoutPayload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/loadouts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loadoutPayload),
        });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      const lid = loadoutPayload.loadout_id || `loadout_${Date.now()}`;
      const record = {
        ...loadoutPayload,
        loadout_id: lid,
        updated_at: new Date().toISOString(),
      };
      const idx = (store.saved_loadouts || []).findIndex(x => x.loadout_id === lid);
      if (idx >= 0) store.saved_loadouts[idx] = record;
      else store.saved_loadouts.unshift(record);
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async deleteLoadout(loadoutId) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/loadouts/${encodeURIComponent(loadoutId)}`, { method: 'DELETE' });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      store.saved_loadouts = (store.saved_loadouts || []).filter(x => x.loadout_id !== loadoutId);
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async addCustomBuild(buildPayload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/builds/add-custom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload),
        });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      const newBuild = {
        build_id: `custom_${Date.now()}`,
        name: buildPayload.name || 'Custom Build',
        role: buildPayload.role || 'RED_DPS',
        tier_badge: buildPayload.tier_badge || 'CUSTOM',
        summary: buildPayload.summary || 'Custom agent build.',
        primary_weapons: buildPayload.primary_weapons || ["St. Elmo's Engine"],
        specialization: buildPayload.specialization || 'Gunner',
        target_cores: buildPayload.target_cores || { RED: 6, BLUE: 0, YELLOW: 0 },
        ideal_minors: buildPayload.ideal_minors || ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'],
        slots: buildPayload.slots || {},
        knowledge_dossier: buildPayload.knowledge_dossier || null,
      };
      store.custom_builds = store.custom_builds || [];
      store.custom_builds.push(newBuild);
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async updateExpertiseCategory(category, payload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/expertise/${encodeURIComponent(category)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      const cat = (store.expertise_categories || []).find(
        c => c.category_id === category || c.name === category
      );
      if (cat) {
        const prof = Math.max(0, Math.min(cat.total, Number(payload.proficient || 0)));
        cat.proficient = prof;
        cat.missing = cat.total - prof;
        cat.pct = Math.round((prof / Math.max(1, cat.total)) * 1000) / 10;
      }
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async updateExpertiseCat(category, proficientVal) {
      const payload = typeof proficientVal === 'object' ? proficientVal : { proficient: Number(proficientVal) };
      return Adapter.updateExpertiseCategory(category, payload);
    },

    async updateExpertiseItem(itemKey, payload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/expertise/item/${encodeURIComponent(itemKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      const it = (store.expertise_items || []).find(x => x.item_key === itemKey);
      if (it) {
        const rk = Math.max(0, Math.min(10, Number(payload.rank || 0)));
        it.rank = rk;
        it.is_proficient = rk >= 10;
        it.upgrade_grade = Math.max(0, Math.min(30, Number(payload.upgrade_grade || 0)));
        it.filament_needed = (10 - rk) * 30;
      }
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async setExpertiseAllMax(proficientBool) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/expertise/bulk-all-max', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proficient: proficientBool }),
        });
        const d = await res.json();
        return enrichServerState(d.state);
      }
      const store = loadLocalStore();
      for (const c of store.expertise_categories || []) {
        c.proficient = proficientBool ? c.total : 0;
        c.missing = proficientBool ? 0 : c.total;
        c.pct = proficientBool ? 100.0 : 0.0;
      }
      for (const it of store.expertise_items || []) {
        it.rank = proficientBool ? 10 : 0;
        it.is_proficient = Boolean(proficientBool);
        it.filament_needed = proficientBool ? 0 : 300;
      }
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async pushPcToAndroidHub() {
      if (_pcServerAvailable) {
        const res = await fetch('/api/hub/sync', { method: 'POST' });
        return await res.json();
      }
      return { status: 'local_only', message: 'PC FastAPI server not reachable; state saved locally.' };
    },

    async triggerPcToHubSync() {
      return Adapter.pushPcToAndroidHub();
    },

    syncFromPcSeedToPhoneProfile() {
      const seed = getSeedData() || {};
      const store = loadLocalStore();
      store.items = JSON.parse(JSON.stringify(seed.golden_items || []));
      store.saved_loadouts = JSON.parse(JSON.stringify(seed.saved_loadouts || []));
      store.expertise_categories = JSON.parse(JSON.stringify(seed.expertise_categories || []));
      store.expertise_items = JSON.parse(JSON.stringify(seed.expertise_items || []));
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async syncFromEmbeddedPcSeed() {
      return Adapter.syncFromPcSeedToPhoneProfile();
    },

    async importSnapshotPayload(payload, mode = 'replace') {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/backup/restore-payload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload, mode }),
        });
        if (res.ok) {
          const d = await res.json();
          return enrichServerState(d.state);
        }
      }
      const store = loadLocalStore();
      const itemsList = payload.items || payload.inventory || [];
      if (mode === 'replace') {
        store.items = itemsList;
      } else {
        for (const it of itemsList) {
          const idx = store.items.findIndex(x => x.item_id === it.item_id);
          if (idx >= 0) store.items[idx] = it;
          else store.items.push(it);
        }
      }
      if (Array.isArray(payload.saved_loadouts)) {
        store.saved_loadouts = payload.saved_loadouts;
      }
      if (payload.expertise && Array.isArray(payload.expertise.categories)) {
        store.expertise_categories = payload.expertise.categories;
      }
      if (payload.expertise && Array.isArray(payload.expertise.items)) {
        store.expertise_items = payload.expertise.items;
      }
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    exportFullSnapshot() {
      const store = loadLocalStore();
      return {
        exported_at: new Date().toISOString(),
        profile: _activeProfile,
        item_count: store.items.length,
        items: store.items,
        saved_loadouts: store.saved_loadouts,
        expertise: {
          categories: store.expertise_categories,
          items: store.expertise_items,
        },
      };
    },

    evaluateAllBuildsJS,
    snapShorthandToItemJS,
    resolveParentBrandJS,
    classifyItemArchetypeJS,
    computeLoadoutBallisticsJS,
    iterCanonicalEntriesJS,
    normalizeWeaponEntryJS,
  };

  window.SHDStorageAdapter = Adapter;
  window.SHDPortableSolver = Adapter;
})();
