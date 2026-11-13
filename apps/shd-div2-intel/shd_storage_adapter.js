/**
 * SHD Storage Adapter & Isomorphic Client-Side Solver (v6.0 — Live Scanner & Multi-Category Unified)
 * Bridges the SHD Tactical Platform across:
 *   1. Desktop FastAPI + WebSocket Mode (`http://127.0.0.1:8420/api/...` & `ws://127.0.0.1:8420/ws/live-scan`)
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
    "cherished": "Habsburg Guard",
    "chill out": "Gila Guard"
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
    "legatus",
    "impetus",
    "refactor",
    "measured assembly"
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
    "ninjabike messenger kneepads",
    "the catalyst"
  ]);

  function getSeedData() {
    if (window.SHD_SEED_DATA) return window.SHD_SEED_DATA;
    if (window.SHD_CARTRIDGE_SEED) {
      return {
        canonical_db: window.SHD_CARTRIDGE_SEED.canonical,
        meta_builds: window.SHD_CARTRIDGE_SEED.meta_builds,
        meta_freshness: window.SHD_CARTRIDGE_SEED.meta_freshness,
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

  function formatTargetPieceNameJS(targetBrandRaw, slot, canonicalDb) {
    const cleanRaw = String(targetBrandRaw || 'Unknown').trim();
    const low = cleanRaw.toLowerCase();
    const slotCap = String(slot || 'PIECE').charAt(0).toUpperCase() + String(slot || 'PIECE').slice(1).toLowerCase();
    if (NAMED_ITEM_PARENT_BRAND[low] || isExoticItemJS(cleanRaw, canonicalDb)) {
      return cleanRaw;
    }
    const db = canonicalDb || getSeedData()?.canonical_db || {};
    for (const [nName] of iterCanonicalEntriesJS(db.named_items)) {
      if (nName.toLowerCase() === low) return cleanRaw;
    }
    if (low.includes(slotCap.toLowerCase())) return cleanRaw;
    return `${cleanRaw} ${slotCap}`;
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

  function inferItemCategoryJS(item) {
    if (!item) return 'ARMOR';
    const explicit = String(item.item_category || '').toUpperCase();
    if (['ARMOR', 'WEAPON', 'GEAR_MOD', 'SKILL_MOD'].includes(explicit)) return explicit;
    const s = String(item.slot || 'MASK').toUpperCase();
    if (['WEAPON', 'PRIMARY', 'SECONDARY', 'SIDEARM', 'AR', 'SMG', 'LMG', 'RIFLE', 'MMR', 'SHOTGUN', 'PISTOL'].includes(s)) return 'WEAPON';
    if (s === 'GEAR_MOD' || s === 'MOD') return 'GEAR_MOD';
    if (s === 'SKILL_MOD') return 'SKILL_MOD';
    return 'ARMOR';
  }

  function buildInitialProfileStore(userId) {
    const seed = getSeedData() || {};
    const isAdminOrDemo = userId === 'admin' || userId === 'demo';
    const items = userId === 'demo'
      ? JSON.parse(JSON.stringify(seed.golden_items || []))
      : userId === 'admin'
      ? JSON.parse(JSON.stringify(seed.admin_owned_items || []))
      : [];
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

    const unverifiedPipPenalty = (item.roll_source === 'PIP_DEDUCED' && !item.user_verified) ? 2.5 : 0.0;
    return [bestScore, bestNotes, {
      brand_tier: brandTier,
      is_virgin: isVirgin,
      tinker_type: tinkerType,
      is_prototype: Boolean(item.is_prototype) || powerRatio > 1.01,
      raw_sort_score: Math.round((bestScore - unverifiedPipPenalty) * 10) / 10,
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
      if (pRawLow.includes('backfire')) {
        wSpec = { class: 'SMG', weapon_class: 'SMG', base_dmg: 102400, base_damage: 102400, rpm: 850, mag_size: 55, reload_sec: 1.9, headshot_mult: 1.50, native_dttooc: 10.0, native_dta: 0.0, native_chc: 21.0, native_chd: 15.0, talent: 'Payment in Kind' };
      } else if (pRawLow.includes('regulus')) {
        wSpec = { class: 'PISTOL', weapon_class: 'PISTOL', base_dmg: 368000, base_damage: 368000, rpm: 150, mag_size: 6, reload_sec: 1.9, headshot_mult: 2.00, native_dttooc: 10.0, native_dta: 0.0, native_chc: 0.0, native_chd: 0.0, talent: 'Regicide' };
      } else {
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
    if ((effBrands['The Catalyst'] || 0) >= 1 || [...equippedNamesLower].some(n => n.includes('catalyst'))) wdPct += 24.0;

    let chc = 10.0 + Number(wSpec.native_chc || 0) + gearChc + modChc;
    let chd = 45.0 + Number(wSpec.native_chd || 0) + gearChd + modChd;
    let hsd = ((Number(wSpec.headshot_mult || 1.55) - 1.0) * 100.0) + 20.0 + gearHsd + modHsd;

    if ((effBrands['Česká Výroba s.r.o.'] || 0) >= 1) chc += 8.0;
    if ((effBrands['Grupo Sombra S.A.'] || 0) >= 1) chd += 13.0;
    if ((effBrands['Grupo Sombra S.A.'] || 0) >= 3) hsd += 15.0;
    if ((effBrands['Providence Defense'] || 0) >= 1) hsd += 15.0;
    if ((effBrands['Providence Defense'] || 0) >= 2) chc += 8.0;
    if ((effBrands['Providence Defense'] || 0) >= 3) chd += 13.0;
    if ((effBrands['Sokolov Concern'] || 0) >= 2) chd += 13.0;
    if ((effBrands['Sokolov Concern'] || 0) >= 3) chc += 8.0;
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

    const rawUncappedChc = Math.round(chc * 10) / 10;
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
    else if (bpTalent.includes('wicked')) twdPct += bpTalent.includes('perfect') ? 18.0 : 18.0;
    else if (bpTalent.includes('companion') || bpTalent.includes('composure')) twdPct += 15.0;
    else if (bpTalent.includes('opportunistic')) ampMult *= bpTalent.includes('perfect') ? 1.15 : 1.1;

    if ((effBrands["Striker's Battlegear"] || 0) >= 3) rofMult *= 1.15;
    if ((effBrands["Striker's Battlegear"] || 0) >= 4) {
      const hasStrikerBp = resolveParentBrandJS((slotBreakdown.BACKPACK || {}).brand || '', canonicalDb) === "Striker's Battlegear" || bpTalent.includes('risk management');
      const hasStrikerChest = resolveParentBrandJS((slotBreakdown.CHEST || {}).brand || '', canonicalDb) === "Striker's Battlegear" || chestTalent.includes('press the advantage');
      const perStack = hasStrikerBp ? 0.009 : 0.0065;
      const effStacks = hasStrikerChest ? 180 : 100;
      ampMult *= 1.0 + perStack * effStacks;
    }
    if (wName.toLowerCase().includes('ouroboros')) rofMult *= 1.1;
    if ((effBrands['Heartbreaker'] || 0) >= 4) ampMult *= 1.52;
    if ((effBrands["Hunter's Fury"] || 0) >= 4) ampMult *= 1.45;
    if ((effBrands['Umbra Initiative'] || 0) >= 4) rofMult *= 1.3;
    if ((effBrands['Future Initiative'] || 0) >= 4) twdPct += chestTalent.includes('tactical superiority') ? 25.0 : 15.0;
    if ((effBrands['Ongoing Directive'] || 0) >= 4) {
      const hasOdChest = resolveParentBrandJS((slotBreakdown.CHEST || {}).brand || '', canonicalDb) === 'Ongoing Directive' || chestTalent.includes('parabellum');
      ampMult *= hasOdChest ? 1.5 : 1.2;
    }

    if (wTalentLow.includes('flatline') || wName.toLowerCase().includes('kingbreaker')) ampMult *= (wTalentLow.includes('perfect') || wName.toLowerCase().includes('kingbreaker')) ? 1.2 : 1.15;
    else if (wTalentLow.includes('optimist')) wdPct += 15.0;
    else if (wTalentLow.includes('strained')) chd += 35.0;
    else if (wTalentLow.includes('killer') || wName.toLowerCase().includes('dark winter')) chd += (wTalentLow.includes('perfect') || wName.toLowerCase().includes('dark winter')) ? 50.0 : 40.0;
    else if (wTalentLow.includes('in sync') || wName.toLowerCase().includes('harmony')) wdPct += (wTalentLow.includes('perfect') || wName.toLowerCase().includes('harmony')) ? 40.0 : 30.0;
    else if (wTalentLow.includes('sadist') || wName.toLowerCase().includes('carnage')) ampMult *= (wTalentLow.includes('perfect') || wName.toLowerCase().includes('carnage')) ? 1.35 : 1.3;
    else if (wTalentLow.includes('eyeless') || wTalentLow.includes('ignited')) ampMult *= 1.2;
    else if (wTalentLow.includes('sledgehammer')) dta += 40.0;
    else if (wTalentLow.includes('payment in kind') || wName.toLowerCase().includes('backfire')) chd += 180.0;
    else if (wTalentLow.includes('regicide') || wName.toLowerCase().includes('regulus')) {
      headhunterBonusMult = Math.max(headhunterBonusMult, [...equippedNamesLower].some(n => n.includes('dodge city')) ? 3.15 : 2.4);
    }
    else if (wTalentLow.includes('determined') && wClass === 'MMR') headhunterBonusMult = Math.max(headhunterBonusMult, 2.5);

    if ([...equippedNamesLower].some(n => n.includes('dodge city')) && wClass === 'PISTOL') {
      headhunterBonusMult = Math.max(headhunterBonusMult, 2.65);
    }

    const hsHitRate = (wClass === 'MMR' && (wTalentLow.includes('determined') || headhunterBonusMult > 1.0))
      ? 1.0
      : ((wClass === 'PISTOL' && headhunterBonusMult > 1.0) ? 0.9 : (wClass === 'MMR' ? 0.85 : 0.25));
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
    if ((effBrands['True Patriot'] || 0) >= 2) mag = Math.round(mag * 1.3);
    const whBonus = gearWh
      + ((effBrands["Striker's Battlegear"] || 0) >= 2 ? 15.0 : 0.0)
      + ((effBrands['Hotshot'] || 0) >= 1 ? 30.0 : 0.0)
      + ((effBrands['Ongoing Directive'] || 0) >= 3 ? 30.0 : 0.0)
      + (((effBrands['The Catalyst'] || 0) >= 1 || [...equippedNamesLower].some(n => n.includes('catalyst'))) ? 30.0 : 0.0);
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
      if ((effBrands['Refactor'] || 0) >= 3) baseSkill *= 1.25;
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
    if ((effBrands['Badger Tuff'] || 0) >= 2) armorPctBonus += 5.0;
    if ((effBrands['Golan Gear Ltd'] || 0) >= 3) armorPctBonus += 10.0;
    if ((effBrands['Foundry Bulwark'] || 0) >= 2) armorPctBonus += 10.0;
    if ((effBrands['Heartbreaker'] || 0) >= 4) armorPctBonus += 50.0;
    const totalArmor = baseArmor * (1.0 + armorPctBonus / 100.0);

    let regenPct = 0.0;
    if ((effBrands['Belstone Armory'] || 0) >= 1) regenPct += 1.0;
    if ((effBrands['Gila Guard'] || 0) >= 3) regenPct += 2.0;
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
      raw_uncapped_chc_pct: rawUncappedChc,
      chd_pct: Math.round(chd * 10) / 10,
      hsd_pct: Math.round(hsd * 10) / 10,
      dta_pct: Math.round(dta * 10) / 10,
      dttooc_pct: Math.round(dttooc * 10) / 10,
      twd_pct: Math.round(twdPct * 10) / 10,
      amp_multiplier: Math.round(ampMult * 100) / 100,
      total_armor: Math.round(totalArmor),
      armor_regen_per_sec: totalRegenPerSec,
      effective_yellow_tiers: effYellowTiers,
      effective_brands: effBrands,
      has_ninjabike: hasNinjaBike,
      ttk_heroic_named_sec: ttkNamedSec,
      ttk_matrix: ttkMatrix,
    };
  }

  const CURATED_FARM_CANDIDATES_JS = {
    MASK: [
      { item_name: "Coyote's Mask", brand: "Coyote's Mask", rarity: 'EXOTIC', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Pack Instincts' },
      { item_name: 'Catharsis', brand: 'Catharsis', rarity: 'EXOTIC', core: 'ARMOR', minors: ['ARMOR_REGEN', 'HAZARD_PROTECTION'], talent: 'Vicious Cycle' },
      { item_name: 'Vile', brand: 'Vile', rarity: 'EXOTIC', core: 'SKILL_TIER', minors: ['STATUS_EFFECTS', 'HAZARD_PROTECTION'], talent: 'Toxic Delivery' },
      { item_name: 'The Catalyst', brand: 'The Catalyst', rarity: 'EXOTIC', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Catalytic Reaction' },
      { item_name: 'Punch Drunk', brand: 'Douglas & Harding', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['HEADSHOT_DAMAGE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Chill Out', brand: 'Gila Guard', rarity: 'NAMED_HIGH_END', core: 'ARMOR', minors: ['ARMOR_REGEN', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Česká Mask', brand: 'Česká Výroba s.r.o.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Lengmo Mask', brand: 'Lengmo', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Empress Mask', brand: 'Empress International', rarity: 'HIGH_END', core: 'SKILL_TIER', minors: ['SKILL_DAMAGE', 'SKILL_HASTE'], talent: '' },
    ],
    BACKPACK: [
      { item_name: 'Memento', brand: 'Memento', rarity: 'EXOTIC', core: 'TRIPLE_CORE', minors: ['CRITICAL_HIT_CHANCE'], talent: 'Kill Confirmed' },
      { item_name: 'NinjaBike Messenger Backpack', brand: 'NinjaBike Messenger Backpack', rarity: 'EXOTIC', core: 'TRIPLE_CORE', minors: ['CRITICAL_HIT_CHANCE'], talent: 'Resourceful' },
      { item_name: 'Backbone', brand: 'Lengmo', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Perfect Unstoppable Force' },
      { item_name: 'The Gift', brand: 'Providence Defense', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Perfect Vigilance' },
      { item_name: 'Matador', brand: 'Walker, Harris & Co.', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Perfect Adrenaline Rush' },
      { item_name: 'Force Multiplier', brand: 'Hana-U Corporation', rarity: 'NAMED_HIGH_END', core: 'SKILL_TIER', minors: ['SKILL_DAMAGE', 'SKILL_HASTE'], talent: 'Perfect Combined Arms' },
      { item_name: 'Liquid Engineer', brand: 'Belstone Armory', rarity: 'NAMED_HIGH_END', core: 'ARMOR', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Perfect Bloodsucker' },
      { item_name: 'Grupo Sombra Backpack', brand: 'Grupo Sombra S.A.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Vigilance' },
      { item_name: 'Česká Backpack', brand: 'Česká Výroba s.r.o.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Unstoppable Force' },
    ],
    CHEST: [
      { item_name: 'The Sacrifice', brand: 'Providence Defense', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Perfect Glass Cannon' },
      { item_name: 'Chainkiller', brand: 'Walker, Harris & Co.', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['HEADSHOT_DAMAGE', 'WEAPON_HANDLING'], talent: 'Perfect Headhunter' },
      { item_name: 'Closer', brand: 'Uzina Getica', rarity: 'NAMED_HIGH_END', core: 'ARMOR', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Perfect Spotter' },
      { item_name: "Caesar's Guard", brand: 'Empress International', rarity: 'NAMED_HIGH_END', core: 'SKILL_TIER', minors: ['SKILL_DAMAGE', 'SKILL_HASTE'], talent: 'Perfectly Skilled' },
      { item_name: 'Česká Chest', brand: 'Česká Výroba s.r.o.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Obliterate' },
      { item_name: 'Grupo Sombra Chest', brand: 'Grupo Sombra S.A.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Obliterate' },
      { item_name: 'Lengmo Chest', brand: 'Lengmo', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Glass Cannon' },
      { item_name: 'Petrov Chest', brand: 'Petrov Defense Group', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Obliterate' },
    ],
    GLOVES: [
      { item_name: "Contractor's Gloves", brand: 'Petrov Defense Group', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['DAMAGE_TO_ARMOR', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'BTSU Datagloves', brand: 'BTSU Datagloves', rarity: 'EXOTIC', core: 'SKILL_TIER', minors: ['SKILL_HASTE', 'SKILL_REPAIR'], talent: 'Transference Overclock' },
      { item_name: 'Grupo Sombra Gloves', brand: 'Grupo Sombra S.A.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Česká Gloves', brand: 'Česká Výroba s.r.o.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Lengmo Gloves', brand: 'Lengmo', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Empress Gloves', brand: 'Empress International', rarity: 'HIGH_END', core: 'SKILL_TIER', minors: ['SKILL_DAMAGE', 'SKILL_HASTE'], talent: '' },
    ],
    HOLSTER: [
      { item_name: "Picaro's Holster", brand: 'Brazos de Arcabuz', rarity: 'NAMED_HIGH_END', core: 'ARMOR', minors: ['CRITICAL_HIT_DAMAGE', 'WEAPON_DAMAGE'], talent: '' },
      { item_name: 'Waveform', brand: 'Waveform', rarity: 'EXOTIC', core: 'SKILL_TIER', minors: ['SKILL_DAMAGE', 'SKILL_HASTE'], talent: 'Alternating Current' },
      { item_name: "Dodge City Gunslinger's Holster", brand: "Dodge City Gunslinger's Holster", rarity: 'EXOTIC', core: 'WEAPON_DAMAGE', minors: ['HEADSHOT_DAMAGE', 'WEAPON_HANDLING'], talent: 'Quick Draw' },
      { item_name: "Centurion's Scabbard", brand: "Centurion's Scabbard", rarity: 'EXOTIC', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: 'Standard Issue' },
      { item_name: 'Česká Holster', brand: 'Česká Výroba s.r.o.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Grupo Sombra Holster', brand: 'Grupo Sombra S.A.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Lengmo Holster', brand: 'Lengmo', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
    ],
    KNEEPADS: [
      { item_name: "Fox's Prayer", brand: 'Overlord Armaments', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['DTTOOC', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Turmoil', brand: 'Česká Výroba s.r.o.', rarity: 'NAMED_HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: "Emperor's Guard", brand: 'Murakami Industries', rarity: 'NAMED_HIGH_END', core: 'ARMOR', minors: ['ARMOR_REGEN', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Grupo Sombra Kneepads', brand: 'Grupo Sombra S.A.', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Lengmo Kneepads', brand: 'Lengmo', rarity: 'HIGH_END', core: 'WEAPON_DAMAGE', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
      { item_name: 'Belstone Kneepads', brand: 'Belstone Armory', rarity: 'HIGH_END', core: 'ARMOR', minors: ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'], talent: '' },
    ],
  };

  function normalizeWorkbenchSlotJS(slot, rawEntry, canonicalDb) {
    const s = rawEntry ? { ...rawEntry } : {};
    const rawBrand = String(s.brand || s.brand_or_set || s.item_name || 'Unknown').trim();
    const rawName = String(s.item_name || s.display_name || rawBrand).trim();
    const lookupName = NAMED_ITEM_PARENT_BRAND[rawName.toLowerCase()] ? rawName : rawBrand;
    let parentBrand = resolveParentBrandJS(lookupName, canonicalDb);
    if (parentBrand === lookupName && rawBrand && rawBrand !== lookupName) {
      parentBrand = resolveParentBrandJS(rawBrand, canonicalDb);
    }

    const coreAttr = s.core_attribute || {};
    let cType = String(s.core_type || coreAttr.type || 'WEAPON_DAMAGE').toUpperCase();
    if (coreAttr.triple_core || rawName.toLowerCase().includes('memento') || rawName.toLowerCase().includes('ninjabike')) {
      cType = 'TRIPLE_CORE';
    }
    const cVal = Number(s.core_val != null ? s.core_val : (coreAttr.value || CORE_MAX[cType] || 15.0));

    const rawMinors = s.minor_attributes || s.minors || [];
    const normMinors = [];
    for (const m of rawMinors) {
      if (!m || typeof m !== 'object') continue;
      const mT = String(m.type || m.stat || '').toUpperCase();
      if (!mT || mT === 'NONE') continue;
      const mV = Number(m.value != null ? m.value : (m.val != null ? m.val : (MINOR_MAX[mT] || 10.0)));
      normMinors.push({ type: mT, value: mV });
    }

    const talentStr = typeof s.talent === 'object' && s.talent ? String(s.talent.name || '').trim() : String(s.talent || '').trim();
    let rarity = String(s.rarity || '').toUpperCase();
    if (!rarity) {
      if (isExoticItemJS(rawName, canonicalDb) || isExoticItemJS(parentBrand, canonicalDb)) rarity = 'EXOTIC';
      else if (isGearSetBrandJS(parentBrand, canonicalDb)) rarity = 'GEAR_SET';
      else if (NAMED_ITEM_PARENT_BRAND[rawName.toLowerCase()]) rarity = 'NAMED_HIGH_END';
      else rarity = 'HIGH_END';
    }
    const maxMinors = (rarity === 'GEAR_SET' || rawName.toLowerCase().includes('memento') || rawName.toLowerCase().includes('ninjabike')) ? 1 : 2;
    return {
      status: s.item_id ? 'OWNED' : 'THEORYCRAFT',
      item_id: s.item_id || null,
      display_name: rawName,
      item_name: rawName,
      brand: parentBrand,
      raw_brand: rawBrand,
      rarity,
      core_type: cType,
      core_val: cVal,
      minor_attributes: normMinors.slice(0, maxMinors),
      talent: talentStr,
    };
  }

  function evaluateSlotMapBallisticsJS(slotMap, pseudoBuild, canonicalDb, weaponExpertise = 27, weaponTalentOverride = null, gearMods = null) {
    const allSlots = ['MASK', 'BACKPACK', 'CHEST', 'GLOVES', 'HOLSTER', 'KNEEPADS'];
    const bCores = { RED: 0, BLUE: 0, YELLOW: 0 };
    const bBrands = {};
    for (const slot of allSlots) {
      const entry = slotMap[slot] || {};
      const brand = entry.brand || 'Unknown';
      const rawLow = String(entry.item_name || entry.display_name || brand).toLowerCase();
      const cType = String(entry.core_type || 'WEAPON_DAMAGE').toUpperCase();
      if (cType === 'TRIPLE_CORE' || rawLow.includes('memento') || rawLow.includes('ninjabike')) {
        bCores.RED += 1;
        bCores.BLUE += 1;
        bCores.YELLOW += 1;
      } else if (cType === 'ARMOR') bCores.BLUE += 1;
      else if (cType === 'SKILL_TIER') bCores.YELLOW += 1;
      else bCores.RED += 1;
      bBrands[brand] = (bBrands[brand] || 0) + 1;
    }
    const bal = computeLoadoutBallisticsJS(pseudoBuild, slotMap, bCores, bBrands, canonicalDb, weaponExpertise, weaponTalentOverride, gearMods);
    return { bal, bCores, bBrands };
  }

  function detectLoadoutIntentJS(slotMap, cores, ballistics, primaryWeapon = '', specialization = 'Gunner', canonicalDb = null) {
    const effBrands = ballistics.effective_brands || {};
    const wNameLow = String(primaryWeapon || ballistics.weapon_name || '').toLowerCase();
    const wClass = String(ballistics.weapon_class || 'AR').toUpperCase();
    const chestTal = String((slotMap.CHEST || {}).talent || '').trim();
    const bpTal = String((slotMap.BACKPACK || {}).talent || '').trim();
    const red = Number(cores.RED || 0);
    const blue = Number(cores.BLUE || 0);
    const yellow = Number(ballistics.effective_yellow_tiers != null ? ballistics.effective_yellow_tiers : (cores.YELLOW || 0));

    const minorCounts = {};
    for (const sv of Object.values(slotMap)) {
      for (const m of sv.minor_attributes || []) {
        const mt = String(m.type || '').toUpperCase();
        if (mt) minorCounts[mt] = (minorCounts[mt] || 0) + 1;
      }
    }
    const hsdMinors = minorCounts.HEADSHOT_DAMAGE || 0;
    const skillDmgMinors = minorCounts.SKILL_DAMAGE || 0;
    const statusMinors = minorCounts.STATUS_EFFECTS || 0;
    const repairMinors = minorCounts.SKILL_REPAIR || 0;

    let roleCode = 'RED_CRIT_DPS';
    let roleLabel = '🔴 All-Red Crit Weapon DPS';
    let solverRole = 'RED_DPS';
    let intentSummary = `Pure multiplicative Crit Weapon DPS build (${red}R / ${blue}B / ${yellow}Y) focused on reaching 60% CHC, stacking CHD/DTTOOC/DTA, and minimizing Heroic & Raid Boss TTK.`;

    if (wNameLow.includes('pestilence') || ((effBrands['Lengmo'] || 0) >= 3 && wClass === 'LMG')) {
      roleCode = 'PESTILENCE_LMG_TICK';
      roleLabel = '☣️ Pestilence / LMG Sustained Tick DPS';
      intentSummary = `Sustained LMG & Plague tick scaling (${red}R / ${blue}B / ${yellow}Y). Maximizes Weapon Damage, DTA, DTTOOC, TWD, and Amplified multipliers because Pestilence ticks ignore Crit.`;
    } else if (wClass === 'MMR' || chestTal.toLowerCase().includes('headhunter') || String(ballistics.weapon_talent || '').toLowerCase().includes('determined') || (effBrands['Hotshot'] || 0) >= 2 || hsdMinors >= 4) {
      roleCode = 'HEADSHOT_DETERMINED_MMR';
      roleLabel = '🎯 One-Shot Headshot / Marksman';
      intentSummary = `Chain-headshot sniper architecture (${red}R / ${blue}B / ${yellow}Y) leveraging Headshot Damage + Headhunter / Determined multipliers.`;
    } else if ((effBrands['Eclipse Protocol'] || 0) >= 3 || (statusMinors >= 3 && yellow >= 4) || (effBrands['Vile'] || 0) >= 1) {
      roleCode = 'STATUS_CC';
      roleLabel = '☣️ Status Effect / Crowd Control';
      solverRole = 'CROWD_CONTROL';
      intentSummary = `Skill-tier Status / Crowd Control build (${yellow} Yellow Tiers) designed to lock down rooms and propagate Burn/Bleed/Foam ticks.`;
    } else if ((effBrands['Future Initiative'] || 0) >= 3 || repairMinors >= 3 || (blue >= 4 && (effBrands['Foundry Bulwark'] || 0) >= 3)) {
      roleCode = 'TANK_HEALER_SUPPORT';
      roleLabel = '🛡️ Team Support / Tank / Healer';
      solverRole = 'TECH_TANK';
      intentSummary = `Frontline sustain or team-buff support (${red}R / ${blue}B / ${yellow}Y) prioritizing survivability, Repair Skills, or Foundry shield durability.`;
    } else if (yellow >= 4 || skillDmgMinors >= 3 || (effBrands['Empress International'] || 0) >= 2 || (effBrands['Refactor'] || 0) >= 3) {
      roleCode = 'SKILL_DAMAGE';
      roleLabel = '⚡ Skill Damage / Capacitor Hybrid';
      solverRole = 'SKILL_DPS';
      intentSummary = `Turret/Drone or Skill Damage engine (${yellow} Yellow Tiers) pairing Skill Tier scaling with Capacitor / Combined Arms / In Sync amplification.`;
    } else if (blue >= 2 || (effBrands['Heartbreaker'] || 0) >= 3 || (effBrands["Hunter's Fury"] || 0) >= 3 || Object.values(slotMap).some(sv => String(sv.item_name || '').toLowerCase().includes('memento'))) {
      roleCode = 'BRUISER_TECH_TANK';
      roleLabel = '🔵/🔴 Bruiser / Run & Gun Hybrid';
      solverRole = 'TECH_TANK';
      intentSummary = `Close-to-mid-range Bruiser (${red}R / ${blue}B / ${yellow}Y) balancing Shield/Armor survivability with Crit DPS and momentum stacks.`;
    }

    const synergies = [];
    if ((effBrands["Striker's Battlegear"] || 0) >= 4) synergies.push("Striker's 4pc Gamble stacks (+15% RoF + Amp)");
    if ((effBrands['Heartbreaker'] || 0) >= 4) synergies.push('Heartbreaker 4pc Pulsed Bonus Armor + Amp');
    if ((effBrands["Hunter's Fury"] || 0) >= 4) synergies.push("Hunter's Fury 4pc CQC Amp + AoK");
    if ((effBrands['Lengmo'] || 0) >= 3 && wClass === 'LMG') synergies.push('Lengmo 3pc +30% LMG Damage unlocked');
    if ((effBrands['Petrov Defense Group'] || 0) >= 1 && wClass === 'LMG') synergies.push('Petrov +10% LMG Damage active');
    if ((effBrands['Fenris Group AB'] || 0) >= 1 && wClass === 'AR') synergies.push('Fenris +10% AR Damage active');
    if ((effBrands['Česká Výroba s.r.o.'] || 0) >= 1) synergies.push('Česká +8% Crit Chance active');
    if ((effBrands['Grupo Sombra S.A.'] || 0) >= 1) synergies.push('Grupo +13% Crit Damage active');
    if (ballistics.has_ninjabike) synergies.push('NinjaBike +1 Brand/Set Wildcard active');
    if (Object.values(slotMap).some(sv => String(sv.item_name || '').toLowerCase().includes('coyote'))) synergies.push("Coyote's Mask group Crit aura active");
    if (Object.values(slotMap).some(sv => String(sv.item_name || '').toLowerCase().includes('memento'))) synergies.push('Memento Triple-Core + Kill Confirmed active');
    if (Object.values(slotMap).some(sv => String(sv.item_name || '').toLowerCase().includes('contractor'))) synergies.push("Contractor's Gloves +8% DTA");
    if (Object.values(slotMap).some(sv => String(sv.item_name || '').toLowerCase().includes("fox's prayer"))) synergies.push("Fox's Prayer +8% DTTOOC");
    if (chestTal) synergies.push(`Chest Talent: ${chestTal}`);
    if (bpTal) synergies.push(`Backpack Talent: ${bpTal}`);

    const warnings = [];
    const rawChc = Number(ballistics.raw_uncapped_chc_pct != null ? ballistics.raw_uncapped_chc_pct : ballistics.chc_pct || 0);
    const cappedChc = Number(ballistics.chc_pct || 0);
    if (rawChc > 60.5) {
      warnings.push({
        severity: 'WARN',
        code: 'CHC_OVERCAP',
        title: `CHC Overcap Waste (${rawChc.toFixed(1)}% raw -> capped at 60%)`,
        detail: `You are wasting ${(rawChc - 60.0).toFixed(1)}% Critical Hit Chance above Division 2's 60% hard cap.`,
        fix_hint: 'Swap CHC Gear Mods to +12% CHD or recalibrate a CHC minor roll to CHD/DTTOOC.',
      });
    } else if (['RED_CRIT_DPS', 'BRUISER_TECH_TANK', 'PESTILENCE_LMG_TICK'].includes(roleCode) && cappedChc < 48.0) {
      warnings.push({
        severity: 'WARN',
        code: 'CHC_UNDERCAP',
        title: `Low Crit Chance (${cappedChc.toFixed(1)}% / 60% Cap)`,
        detail: 'Crit multipliers lose significant average DPS below ~50% CHC.',
        fix_hint: 'Equip +6% CHC Gear Mods, add 1pc Česká (+8% CHC), or roll CHC onto minor attributes.',
      });
    }

    for (const [bName, cnt] of Object.entries(effBrands)) {
      if (!bName || bName === 'Unknown' || isExoticItemJS(bName, canonicalDb)) continue;
      if (isGearSetBrandJS(bName, canonicalDb)) {
        if (cnt === 3) {
          warnings.push({
            severity: 'WARN',
            code: 'INCOMPLETE_GEARSET_3PC',
            title: `Incomplete 3pc ${bName} (Missing 4pc Keystone)`,
            detail: `3 pieces of ${bName} miss the 4-piece set talent unless NinjaBike Backpack is equipped.`,
            fix_hint: `Add a 4th ${bName} piece or drop to 2pc + High-End pieces.`,
          });
        }
      } else if (cnt >= 4) {
        warnings.push({
          severity: 'WARN',
          code: 'BRAND_OVERFLOW_4PC',
          title: `Wasted ${cnt}pc ${bName} (Max Brand Bonus is 3pc)`,
          detail: `High-End Brand Sets only grant bonuses at 1/2/3 pieces — piece #${cnt} adds zero set bonus.`,
          fix_hint: `Replace 1 ${bName} piece with Contractor's Gloves, Fox's Prayer, Coyote's Mask, or Grupo/Česká.`,
        });
      }
    }

    if ((effBrands['Fenris Group AB'] || 0) >= 1 && wClass !== 'AR') {
      warnings.push({
        severity: 'WARN',
        code: 'WRONG_WEAPON_BRAND',
        title: `Fenris (+10% AR DMG) Active With ${wClass} Equipped`,
        detail: `Fenris 1pc only buffs Assault Rifles, so your primary ${primaryWeapon || wClass} gets 0% from it.`,
        fix_hint: 'Switch weapon to an AR or swap Fenris for your weapon class brand.',
      });
    }

    for (const [slotKey, tVal] of [['CHEST', chestTal], ['BACKPACK', bpTal]]) {
      const sObj = slotMap[slotKey] || {};
      if (!tVal && !isExoticItemJS(sObj.item_name || '', canonicalDb)) {
        warnings.push({
          severity: 'INFO',
          code: `MISSING_${slotKey}_TALENT`,
          title: `No ${slotKey.charAt(0) + slotKey.slice(1).toLowerCase()} Talent Configured`,
          detail: `Your ${slotKey.toLowerCase()} slot currently shows no talent bonus in ballistics.`,
          fix_hint: `Assign or recalibrate an active damage/utility talent on ${slotKey.toLowerCase()}.`,
        });
      }
    }

    return {
      detected_role_code: roleCode,
      detected_role_label: roleLabel,
      solver_role: solverRole,
      intent_summary: intentSummary,
      specialization,
      primary_weapon: primaryWeapon || ballistics.weapon_name || '',
      active_synergies: synergies.slice(0, 8),
      diagnostic_warnings: warnings.slice(0, 6),
    };
  }

  function computeBallisticsDeltaJS(candBal, baseBal) {
    const baseSust = Math.max(1.0, Number(baseBal.sustained_dps || 1.0));
    const baseBurst = Math.max(1.0, Number(baseBal.burst_dps || 1.0));
    const baseArmor = Math.max(1.0, Number(baseBal.total_armor || 1.0));
    const sustDiff = Number(candBal.sustained_dps || 0) - Number(baseBal.sustained_dps || 0);
    const burstDiff = Number(candBal.burst_dps || 0) - Number(baseBal.burst_dps || 0);
    const armorDiff = Number(candBal.total_armor || 0) - Number(baseBal.total_armor || 0);
    const regenDiff = Number(candBal.armor_regen_per_sec || 0) - Number(baseBal.armor_regen_per_sec || 0);
    const ttkDiff = Math.round((Number(candBal.ttk_heroic_named_sec || 0) - Number(baseBal.ttk_heroic_named_sec || 0)) * 100) / 100;
    return {
      sustained_dps_before: Number(baseBal.sustained_dps || 0),
      sustained_dps_after: Number(candBal.sustained_dps || 0),
      sustained_dps_delta: sustDiff,
      sustained_dps_pct: Math.round((sustDiff / baseSust) * 1000) / 10,
      burst_dps_before: Number(baseBal.burst_dps || 0),
      burst_dps_after: Number(candBal.burst_dps || 0),
      burst_dps_delta: burstDiff,
      burst_dps_pct: Math.round((burstDiff / baseBurst) * 1000) / 10,
      per_bullet_delta: Number(candBal.per_bullet_dmg || 0) - Number(baseBal.per_bullet_dmg || 0),
      ttk_heroic_before_sec: Number(baseBal.ttk_heroic_named_sec || 0),
      ttk_heroic_after_sec: Number(candBal.ttk_heroic_named_sec || 0),
      ttk_heroic_delta_sec: ttkDiff,
      armor_before: Number(baseBal.total_armor || 0),
      armor_after: Number(candBal.total_armor || 0),
      armor_delta: armorDiff,
      armor_pct: Math.round((armorDiff / baseArmor) * 1000) / 10,
      regen_delta: regenDiff,
      chc_before: Number(baseBal.chc_pct || 0),
      chc_after: Number(candBal.chc_pct || 0),
      chd_before: Number(baseBal.chd_pct || 0),
      chd_after: Number(candBal.chd_pct || 0),
      yellow_before: Number(baseBal.effective_yellow_tiers || 0),
      yellow_after: Number(candBal.effective_yellow_tiers || 0),
    };
  }

  function scoreBallisticsForGoalJS(candBal, baseBal, goalMode, detectedRoleCode, candSlots = null) {
    const delta = computeBallisticsDeltaJS(candBal, baseBal);
    let gm = String(goalMode || 'AUTO').toUpperCase();
    if (gm === 'AUTO') {
      if (['BRUISER_TECH_TANK', 'TANK_HEALER_SUPPORT'].includes(detectedRoleCode)) gm = 'BRUISER_SURVIVABILITY';
      else if (['SKILL_DAMAGE', 'STATUS_CC'].includes(detectedRoleCode)) gm = 'SKILL_HYBRID';
      else gm = 'MAX_DPS';
    }
    let skillMinorScore = 0.0;
    if (candSlots && gm === 'SKILL_HYBRID') {
      for (const sv of Object.values(candSlots)) {
        for (const m of sv.minor_attributes || []) {
          if (['SKILL_DAMAGE', 'SKILL_HASTE', 'STATUS_EFFECTS', 'SKILL_REPAIR'].includes(String(m.type || '').toUpperCase())) {
            skillMinorScore += 2.5;
          }
        }
      }
    }
    if (gm === 'MAX_DPS') return Math.round(((0.68 * delta.sustained_dps_pct) + (0.32 * delta.burst_dps_pct) + (0.04 * delta.armor_pct)) * 100) / 100;
    if (gm === 'BRUISER_SURVIVABILITY') {
      const regenBonus = (delta.regen_delta / 15000.0) * 6.0;
      return Math.round(((0.52 * delta.sustained_dps_pct) + (0.18 * delta.burst_dps_pct) + (0.38 * delta.armor_pct) + regenBonus) * 100) / 100;
    }
    if (gm === 'SKILL_HYBRID') {
      const yDiff = delta.yellow_after - delta.yellow_before;
      return Math.round(((0.45 * delta.sustained_dps_pct) + (yDiff * 12.0) + skillMinorScore + (0.08 * delta.armor_pct)) * 100) / 100;
    }
    return delta.sustained_dps_pct;
  }

  function autoSelectModsForLoadoutJS(pseudoBuild, slotMap, canonicalDb, weaponExpertise, weaponTalent, goalMode, detectedRoleCode) {
    const gm = String(goalMode || 'AUTO').toUpperCase();
    if (gm === 'SKILL_HYBRID' || (gm === 'AUTO' && ['SKILL_DAMAGE', 'STATUS_CC'].includes(detectedRoleCode))) {
      return ['MOD_SKILL_HASTE', 'MOD_SKILL_HASTE', 'MOD_SKILL_HASTE'];
    }
    if (gm === 'AUTO' && detectedRoleCode === 'HEADSHOT_DETERMINED_MMR') {
      return ['MOD_HSD', 'MOD_HSD', 'MOD_HSD'];
    }
    const { bal: probeBal } = evaluateSlotMapBallisticsJS(slotMap, pseudoBuild, canonicalDb, weaponExpertise, weaponTalent, ['MOD_CHD', 'MOD_CHD', 'MOD_CHD']);
    const rawChc = Number(probeBal.raw_uncapped_chc_pct != null ? probeBal.raw_uncapped_chc_pct : probeBal.chc_pct || 0);
    const deficit = Math.max(0.0, 58.0 - rawChc);
    const chcMods = deficit <= 0.5 ? 0 : Math.min(3, Math.max(0, Math.ceil(deficit / 6.0)));
    if (gm === 'BRUISER_SURVIVABILITY' || (gm === 'AUTO' && detectedRoleCode === 'TANK_HEALER_SUPPORT')) {
      const rem = 3 - chcMods;
      if (detectedRoleCode === 'TANK_HEALER_SUPPORT') return [...Array(chcMods).fill('MOD_CHC'), ...Array(rem).fill('MOD_PFE')];
      const pfeCnt = rem >= 2 ? 1 : 0;
      const chdCnt = Math.max(0, rem - pfeCnt);
      return [...Array(chcMods).fill('MOD_CHC'), ...Array(chdCnt).fill('MOD_CHD'), ...Array(pfeCnt).fill('MOD_PFE')];
    }
    return [...Array(chcMods).fill('MOD_CHC'), ...Array(3 - chcMods).fill('MOD_CHD')];
  }

  function toWbSlotPayloadJS(normSlot) {
    return {
      item_id: normSlot.item_id || null,
      brand: normSlot.brand || 'Unknown',
      item_name: normSlot.item_name || normSlot.display_name || normSlot.brand || 'Piece',
      rarity: normSlot.rarity || 'HIGH_END',
      core_type: normSlot.core_type || 'WEAPON_DAMAGE',
      core_val: normSlot.core_val != null ? normSlot.core_val : 15.0,
      minors: (normSlot.minor_attributes || []).map(m => ({ type: m.type, val: Number(m.value != null ? m.value : (m.val || 0)) })),
      talent: normSlot.talent || '',
    };
  }

  function describeItemChangesJS(baseSlot, candItem, goalMode, detectedRoleCode, canonicalDb) {
    const norm = normalizeWorkbenchSlotJS(candItem.slot || 'MASK', candItem, canonicalDb);
    if (norm.rarity === 'EXOTIC') return [norm, 'Exotic (Fixed Rolls)'];

    const coreObj = candItem.core_attribute || {};
    const minorsRaw = candItem.minor_attributes || [];
    const talObj = candItem.talent || {};
    const coreRecal = Boolean(coreObj.recal || coreObj.is_recalibrated);
    const minorRecals = minorsRaw.map(m => Boolean(m.recal || m.is_recalibrated));
    const talRecal = Boolean(talObj.recal || talObj.is_recalibrated);
    const isVirgin = !coreRecal && !minorRecals.some(Boolean) && !talRecal;

    let desiredCore = (goalMode === 'SKILL_HYBRID' || (goalMode === 'AUTO' && ['SKILL_DAMAGE', 'STATUS_CC'].includes(detectedRoleCode))) ? 'SKILL_TIER' : 'WEAPON_DAMAGE';
    if (goalMode === 'BRUISER_SURVIVABILITY' && baseSlot.core_type === 'ARMOR') desiredCore = 'ARMOR';

    const slotUp = String(candItem.slot || '').toUpperCase();
    if (['CHEST', 'BACKPACK'].includes(slotUp) && !talObj.is_perfect && norm.rarity !== 'GEAR_SET') {
      const curTal = norm.talent.toLowerCase();
      const goodTals = slotUp === 'CHEST'
        ? ['obliterate', 'glass cannon', 'spotter', 'headhunter', 'focus', 'intimidate', 'kinetic momentum']
        : ['vigilance', 'unstoppable force', 'companion', 'composure', 'combined arms', 'wicked', 'bloodsucker'];
      if (!goodTals.some(gt => curTal.includes(gt)) && (isVirgin || talRecal)) {
        const targetTal = goalMode === 'SKILL_HYBRID'
          ? (slotUp === 'CHEST' ? 'Kinetic Momentum' : 'Combined Arms')
          : (slotUp === 'CHEST' ? 'Obliterate' : 'Vigilance');
        norm.talent = targetTal;
        return [norm, `Wrench Recal Talent -> ${targetTal}`];
      }
    }

    if (norm.core_type !== desiredCore && (isVirgin || coreRecal)) {
      norm.core_type = desiredCore;
      norm.core_val = CORE_MAX[desiredCore] || 15.0;
      return [norm, `Wrench Recal Core -> ${desiredCore.replace(/_/g, ' ')}`];
    }

    const prefMinors = desiredCore === 'SKILL_TIER'
      ? ['SKILL_DAMAGE', 'SKILL_HASTE', 'STATUS_EFFECTS']
      : ['CRITICAL_HIT_DAMAGE', 'CRITICAL_HIT_CHANCE', 'DTTOOC', 'DAMAGE_TO_ARMOR', 'HEADSHOT_DAMAGE'];
    for (let idx = 0; idx < norm.minor_attributes.length; idx++) {
      const mType = norm.minor_attributes[idx].type;
      const canRecal = isVirgin || Boolean(minorRecals[idx]);
      if (canRecal && !prefMinors.includes(mType)) {
        const existingTypes = new Set(norm.minor_attributes.filter((_, j) => j !== idx).map(x => x.type));
        const newM = prefMinors.find(pm => !existingTypes.has(pm)) || prefMinors[0];
        norm.minor_attributes[idx] = { type: newM, value: MINOR_MAX[newM] || 12.0 };
        return [norm, `Wrench Recal Minor #${idx + 1} -> Max ${newM.replace(/_/g, ' ')}`];
      }
    }
    return [norm, 'Equip as-is'];
  }

  function analyzeActiveLoadoutJS(loadout, ownedItems = [], canonicalDb = null, goalMode = 'AUTO') {
    const db = canonicalDb || getSeedData()?.canonical_db || {};
    const allSlots = ['MASK', 'BACKPACK', 'CHEST', 'GLOVES', 'HOLSTER', 'KNEEPADS'];
    const rawSlots = (loadout && (loadout.slots || loadout.slot_items)) || {};
    const baseSlotMap = {};
    for (const slot of allSlots) {
      baseSlotMap[slot] = normalizeWorkbenchSlotJS(slot, rawSlots[slot], db);
    }

    const pWeap = String((loadout && ((loadout.weapons || {}).primary || loadout.primary_weapon)) || "St. Elmo's Engine");
    const spec = String((loadout && loadout.specialization) || 'Gunner');
    const wExp = Number((loadout && loadout.weapon_expertise) != null ? loadout.weapon_expertise : 27);
    const wTal = (loadout && loadout.weapon_talent) || null;
    const curMods = Array.isArray(loadout && loadout.gear_mods) && loadout.gear_mods.length === 3
      ? [...loadout.gear_mods]
      : ['MOD_CHD', 'MOD_CHD', 'MOD_CHD'];

    const probeBuild = {
      name: (loadout && loadout.name) || 'Active Build',
      role: (loadout && (loadout.archetype || loadout.role)) || 'RED_DPS',
      specialization: spec,
      primary_weapons: [pWeap],
    };
    const { bal: probeBal, bCores: probeCores } = evaluateSlotMapBallisticsJS(baseSlotMap, probeBuild, db, wExp, wTal, curMods);
    let intent = detectLoadoutIntentJS(baseSlotMap, probeCores, probeBal, pWeap, spec, db);
    const pseudoBuild = { ...probeBuild, role: intent.solver_role };
    const { bal: baseBal, bCores: baseCores } = evaluateSlotMapBallisticsJS(baseSlotMap, pseudoBuild, db, wExp, wTal, curMods);
    intent = detectLoadoutIntentJS(baseSlotMap, baseCores, baseBal, pWeap, spec, db);
    const detectedRoleCode = intent.detected_role_code;

    const itemsById = {};
    const ownedMods = [];
    for (const it of ownedItems || []) {
      if (it.item_id) itemsById[it.item_id] = it;
      if (inferItemCategoryJS(it) === 'GEAR_MOD') ownedMods.push(it);
    }

    const countExotics = sMap => Object.values(sMap).filter(sv => sv.rarity === 'EXOTIC' || isExoticItemJS(sv.item_name || sv.brand, db)).length;

    // Track 1: Zero-Swap Quick Wins
    const quickWins = [];
    const optMods = autoSelectModsForLoadoutJS(pseudoBuild, baseSlotMap, db, wExp, wTal, goalMode, detectedRoleCode);
    if (JSON.stringify(optMods) !== JSON.stringify(curMods)) {
      const { bal: modBal } = evaluateSlotMapBallisticsJS(baseSlotMap, pseudoBuild, db, wExp, wTal, optMods);
      const modScore = scoreBallisticsForGoalJS(modBal, baseBal, goalMode, detectedRoleCode, baseSlotMap);
      const modDelta = computeBallisticsDeltaJS(modBal, baseBal);
      if (modScore > 0.1 || Number(baseBal.raw_uncapped_chc_pct || 0) > 60.5) {
        const modLabels = { MOD_CHC: '+6% CHC', MOD_CHD: '+12% CHD', MOD_HSD: '+10% HSD', MOD_PFE: '+12% PFE', MOD_SKILL_HASTE: '+12% Skill Haste', MOD_REPAIR_SKILLS: '+20% Repair' };
        quickWins.push({
          rec_id: 'qw_mods_optimal',
          track: 'quick_wins',
          swap_count: 0,
          action_type: 'GEAR_MODS',
          badge: '🔌 3x GEAR MODS',
          slots_changed: ['MODS'],
          headline: 'Rebalance 3x Gear Mods -> ' + optMods.map(m => modLabels[m] || m).join(' / '),
          why_it_helps: `Eliminates CHC overcap waste or fills crit deficit, shifting CHC ${modDelta.chc_before}% -> ${modDelta.chc_after}% and CHD ${modDelta.chd_before}% -> ${modDelta.chd_after}%${ownedMods.length ? ` (You own ${ownedMods.length} Gear Mods)` : ''}.`,
          tinker_notes: 'Zero gear swaps required — swap Mask/Chest/Backpack Gear Mods.',
          score: Math.max(0.5, modScore),
          replacement_slots: {},
          recommended_gear_mods: optMods,
          delta_metrics: modDelta,
        });
      }
    }

    for (const slot of allSlots) {
      const curS = baseSlotMap[slot];
      if (curS.rarity === 'EXOTIC') continue;
      const ownedRef = curS.item_id ? itemsById[curS.item_id] : null;
      let coreRecal = false, minorRecals = curS.minor_attributes.map(() => false), talRecal = false, isVirgin = true, isPerfTal = curS.rarity === 'NAMED_HIGH_END';
      if (ownedRef) {
        const cObj = ownedRef.core_attribute || {};
        const mList = ownedRef.minor_attributes || [];
        const tObj = ownedRef.talent || {};
        coreRecal = Boolean(cObj.recal || cObj.is_recalibrated);
        minorRecals = mList.map(m => Boolean(m.recal || m.is_recalibrated));
        talRecal = Boolean(tObj.recal || tObj.is_recalibrated);
        isVirgin = !coreRecal && !minorRecals.some(Boolean) && !talRecal;
        isPerfTal = Boolean(tObj.is_perfect);
      }
      let bestQw = null;
      const tryRecal = (simEntry, label, reason, recalId) => {
        const simMap = { ...baseSlotMap, [slot]: simEntry };
        const simMods = autoSelectModsForLoadoutJS(pseudoBuild, simMap, db, wExp, wTal, goalMode, detectedRoleCode);
        const { bal: simBal } = evaluateSlotMapBallisticsJS(simMap, pseudoBuild, db, wExp, wTal, simMods);
        const sc = scoreBallisticsForGoalJS(simBal, baseBal, goalMode, detectedRoleCode, simMap);
        if (sc > 0.35 && (!bestQw || sc > bestQw.score)) {
          bestQw = {
            rec_id: recalId,
            track: 'quick_wins',
            swap_count: 0,
            action_type: 'WRENCH_RECAL',
            badge: `🔧 WRENCH RECAL (${slot})`,
            slots_changed: [slot],
            headline: label,
            why_it_helps: reason,
            tinker_notes: `Recalibrate ${slot} at Tinkering Bench + auto-balance Gear Mods.`,
            score: sc,
            replacement_slots: { [slot]: toWbSlotPayloadJS(simEntry) },
            recommended_gear_mods: simMods,
            delta_metrics: computeBallisticsDeltaJS(simBal, baseBal),
          };
        }
      };

      for (const candCore of ['WEAPON_DAMAGE', 'ARMOR', 'SKILL_TIER']) {
        if (candCore !== curS.core_type && (isVirgin || coreRecal)) {
          const simE = JSON.parse(JSON.stringify(curS));
          simE.core_type = candCore;
          simE.core_val = CORE_MAX[candCore] || 15.0;
          tryRecal(simE, `Recalibrate ${slot} Core -> Max ${candCore.replace(/_/g, ' ')}`, `Aligns ${slot} core with your target goal.`, `qw_core_${slot}_${candCore}`);
        }
      }
      const candMinors = ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE', 'HEADSHOT_DAMAGE', 'SKILL_DAMAGE', 'ARMOR_REGEN'];
      for (let mIdx = 0; mIdx < curS.minor_attributes.length; mIdx++) {
        if (!(isVirgin || minorRecals[mIdx])) continue;
        const curMt = curS.minor_attributes[mIdx].type;
        const otherMts = new Set(curS.minor_attributes.filter((_, j) => j !== mIdx).map(x => x.type));
        for (const cm of candMinors) {
          if (cm === curMt || otherMts.has(cm)) continue;
          const simE = JSON.parse(JSON.stringify(curS));
          simE.minor_attributes[mIdx] = { type: cm, value: MINOR_MAX[cm] || 10.0 };
          tryRecal(simE, `Recalibrate ${slot} Minor #${mIdx + 1} -> ${cm.replace(/_/g, ' ')}`, `Replaces ${curMt.replace(/_/g, ' ')} with max-roll ${cm.replace(/_/g, ' ')}.`, `qw_minor_${slot}_${mIdx}_${cm}`);
        }
      }
      if (['CHEST', 'BACKPACK'].includes(slot) && curS.rarity !== 'GEAR_SET' && !isPerfTal && (isVirgin || talRecal)) {
        const talPool = slot === 'CHEST' ? ['Obliterate', 'Glass Cannon', 'Spotter', 'Headhunter', 'Focus'] : ['Vigilance', 'Unstoppable Force', 'Companion', 'Wicked'];
        for (const cTal of talPool) {
          if (curS.talent.toLowerCase().includes(cTal.toLowerCase())) continue;
          const simE = JSON.parse(JSON.stringify(curS));
          simE.talent = cTal;
          tryRecal(simE, `Recalibrate ${slot} Talent -> ${cTal}`, `Unlocks stronger ${cTal} scaling.`, `qw_tal_${slot}_${cTal.toLowerCase().replace(/\s+/g, '_')}`);
        }
      }
      if (bestQw) quickWins.push(bestQw);
    }
    quickWins.sort((a, b) => b.score - a.score);

    // Track 2: Owned Armory 1-Piece & 2-Piece Swaps
    const ownedBySlot = { MASK: [], BACKPACK: [], CHEST: [], GLOVES: [], HOLSTER: [], KNEEPADS: [] };
    const onePieceOwned = [];
    for (const it of ownedItems || []) {
      const cat = inferItemCategoryJS(it);
      const slotUp = String(it.slot || '').toUpperCase();
      if (cat !== 'ARMOR' || !ownedBySlot[slotUp]) continue;
      if (baseSlotMap[slotUp].item_id && it.item_id === baseSlotMap[slotUp].item_id) continue;

      const normRaw = normalizeWorkbenchSlotJS(slotUp, it, db);
      const [normTink, tinkNote] = describeItemChangesJS(baseSlotMap[slotUp], it, goalMode, detectedRoleCode, db);
      const variants = [[normRaw, 'Equip owned piece as-is']];
      if (tinkNote !== 'Equip as-is' && JSON.stringify(normTink) !== JSON.stringify(normRaw)) variants.push([normTink, tinkNote]);

      let bestVar = null;
      for (const [vSlot, vNote] of variants) {
        const simMap = { ...baseSlotMap, [slotUp]: vSlot };
        if (countExotics(simMap) > 1) continue;
        const simMods = autoSelectModsForLoadoutJS(pseudoBuild, simMap, db, wExp, wTal, goalMode, detectedRoleCode);
        const { bal: simBal } = evaluateSlotMapBallisticsJS(simMap, pseudoBuild, db, wExp, wTal, simMods);
        const sc = scoreBallisticsForGoalJS(simBal, baseBal, goalMode, detectedRoleCode, simMap);
        if (!bestVar || sc > bestVar.sc) {
          bestVar = { vSlot, vNote, sc, deltaM: computeBallisticsDeltaJS(simBal, baseBal), simMods };
        }
      }
      if (bestVar) {
        ownedBySlot[slotUp].push(bestVar);
        if (bestVar.sc > 0.3) {
          const dm = bestVar.deltaM;
          onePieceOwned.push({
            rec_id: `owned_1pc_${slotUp}_${bestVar.vSlot.item_id || bestVar.vSlot.item_name}`,
            track: 'owned',
            swap_count: 1,
            action_type: 'OWNED_1PC_SWAP',
            badge: `🎒 1-PIECE OWNED (${slotUp})`,
            slots_changed: [slotUp],
            headline: `Swap ${slotUp}: ${baseSlotMap[slotUp].item_name} -> ${bestVar.vSlot.item_name}`,
            why_it_helps: `Owned Armory piece (${bestVar.vSlot.brand}) yields ${dm.sustained_dps_pct >= 0 ? '+' : ''}${dm.sustained_dps_pct}% Sustained DPS and ${dm.ttk_heroic_delta_sec >= 0 ? '+' : ''}${dm.ttk_heroic_delta_sec}s Heroic TTK.`,
            tinker_notes: bestVar.vNote,
            score: bestVar.sc,
            replacement_slots: { [slotUp]: toWbSlotPayloadJS(bestVar.vSlot) },
            recommended_gear_mods: bestVar.simMods,
            delta_metrics: dm,
          });
        }
      }
    }

    const topOwnedPerSlot = {};
    const bestSingleBySlot = {};
    for (const s of allSlots) {
      const sorted = [...ownedBySlot[s]].sort((a, b) => b.sc - a.sc);
      const picked = [];
      const seenBr = new Set();
      for (const c of sorted) {
        if (!seenBr.has(c.vSlot.brand) || picked.length < 2) {
          picked.push(c);
          seenBr.add(c.vSlot.brand);
        }
        if (picked.length >= 4) break;
      }
      topOwnedPerSlot[s] = picked;
      bestSingleBySlot[s] = Math.max(0, ...onePieceOwned.filter(x => x.slots_changed[0] === s).map(x => x.score));
    }

    const twoPieceOwned = [];
    for (let i = 0; i < allSlots.length; i++) {
      const s1 = allSlots[i];
      for (let j = i + 1; j < allSlots.length; j++) {
        const s2 = allSlots[j];
        for (const c1 of topOwnedPerSlot[s1]) {
          for (const c2 of topOwnedPerSlot[s2]) {
            const simMap = { ...baseSlotMap, [s1]: c1.vSlot, [s2]: c2.vSlot };
            if (countExotics(simMap) > 1) continue;
            const simMods = autoSelectModsForLoadoutJS(pseudoBuild, simMap, db, wExp, wTal, goalMode, detectedRoleCode);
            const { bal: simBal } = evaluateSlotMapBallisticsJS(simMap, pseudoBuild, db, wExp, wTal, simMods);
            const sc = scoreBallisticsForGoalJS(simBal, baseBal, goalMode, detectedRoleCode, simMap);
            if (sc > Math.max(bestSingleBySlot[s1], bestSingleBySlot[s2]) + 0.5) {
              const dm = computeBallisticsDeltaJS(simBal, baseBal);
              twoPieceOwned.push({
                rec_id: `owned_2pc_${s1}_${s2}_${c1.vSlot.item_id}_${c2.vSlot.item_id}`,
                track: 'owned',
                swap_count: 2,
                action_type: 'OWNED_2PC_COMBO',
                badge: `🎒 2-PIECE COMBO (${s1} + ${s2})`,
                slots_changed: [s1, s2],
                headline: `Combo Swap: ${c1.vSlot.item_name} (${s1}) + ${c2.vSlot.item_name} (${s2})`,
                why_it_helps: `Synergistic 2-piece swap delivers ${dm.sustained_dps_pct >= 0 ? '+' : ''}${dm.sustained_dps_pct}% Sustained DPS (${dm.armor_pct >= 0 ? '+' : ''}${dm.armor_pct}% Armor) — stronger than swapping either piece alone.`,
                tinker_notes: `${s1}: ${c1.vNote} | ${s2}: ${c2.vNote}`,
                score: sc,
                replacement_slots: { [s1]: toWbSlotPayloadJS(c1.vSlot), [s2]: toWbSlotPayloadJS(c2.vSlot) },
                recommended_gear_mods: simMods,
                delta_metrics: dm,
              });
            }
          }
        }
      }
    }

    const ownedFinal = [];
    const seenOwnedSigs = new Set();
    for (const rec of [...onePieceOwned, ...twoPieceOwned].sort((a, b) => b.score - a.score)) {
      const sig = Object.entries(rec.replacement_slots).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}:${v.item_id || v.item_name}`).join('|');
      if (seenOwnedSigs.has(sig)) continue;
      seenOwnedSigs.add(sig);
      ownedFinal.push(rec);
      if (ownedFinal.length >= 6) break;
    }

    // Track 3: Canonical Farm Targets
    const activeBrands = Object.keys(baseBal.effective_brands || {}).filter(b => b && b !== 'Unknown' && !isExoticItemJS(b, db));
    const farmBySlot = { MASK: [], BACKPACK: [], CHEST: [], GLOVES: [], HOLSTER: [], KNEEPADS: [] };
    const onePieceFarm = [];

    const lookupDropPool = (itemName, brand) => {
      const targets = [String(itemName || '').toLowerCase(), String(brand || '').toLowerCase()];
      for (const [, entry] of [...iterCanonicalEntriesJS(db.named_items), ...iterCanonicalEntriesJS(db.exotics)]) {
        const en = String(entry.name || '').toLowerCase();
        if (en && targets.some(t => t && (t === en || t.includes(en) || en.includes(t)))) {
          return [String(entry.drop_pool || 'COUNTDOWN_OPEN_WORLD'), String(entry.acquisition_hint || '')];
        }
      }
      return ['COUNTDOWN_OPEN_WORLD', ''];
    };

    for (const slot of allSlots) {
      const pool = [...(CURATED_FARM_CANDIDATES_JS[slot] || [])];
      for (const ab of activeBrands) {
        const isGs = isGearSetBrandJS(ab, db);
        if (!pool.some(p => p.brand.toLowerCase() === ab.toLowerCase())) {
          pool.push({
            item_name: `${ab} ${slot.charAt(0) + slot.slice(1).toLowerCase()}`,
            brand: ab,
            rarity: isGs ? 'GEAR_SET' : 'HIGH_END',
            core: goalMode === 'SKILL_HYBRID' ? 'SKILL_TIER' : 'WEAPON_DAMAGE',
            minors: isGs ? ['CRITICAL_HIT_DAMAGE'] : ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'],
            talent: (!isGs && ['CHEST', 'BACKPACK'].includes(slot)) ? (slot === 'CHEST' ? 'Obliterate' : 'Vigilance') : '',
          });
        }
      }
      const curLow = baseSlotMap[slot].item_name.toLowerCase();
      for (const scSpec of pool) {
        if (scSpec.item_name.toLowerCase() === curLow) continue;
        const candNorm = normalizeWorkbenchSlotJS(slot, {
          item_name: scSpec.item_name,
          brand: scSpec.brand,
          rarity: scSpec.rarity,
          core_type: scSpec.core,
          core_val: CORE_MAX[scSpec.core] || 15.0,
          minors: scSpec.minors.map(m => ({ type: m, val: MINOR_MAX[m] || 10.0 })),
          talent: scSpec.talent || '',
        }, db);
        const simMap = { ...baseSlotMap, [slot]: candNorm };
        if (countExotics(simMap) > 1) continue;
        const simMods = autoSelectModsForLoadoutJS(pseudoBuild, simMap, db, wExp, wTal, goalMode, detectedRoleCode);
        const { bal: simBal } = evaluateSlotMapBallisticsJS(simMap, pseudoBuild, db, wExp, wTal, simMods);
        const sc = scoreBallisticsForGoalJS(simBal, baseBal, goalMode, detectedRoleCode, simMap);
        const [dropPool, acqHint] = lookupDropPool(scSpec.item_name, scSpec.brand);
        farmBySlot[slot].push({ candNorm, dropPool, sc });
        if (sc > 0.6) {
          const dm = computeBallisticsDeltaJS(simBal, baseBal);
          onePieceFarm.push({
            rec_id: `farm_1pc_${slot}_${scSpec.item_name.toLowerCase().replace(/\s+/g, '_')}`,
            track: 'farm_targets',
            swap_count: 1,
            action_type: 'FARM_1PC_BIS',
            badge: `🎯 FARM 1-PIECE (${slot})`,
            slots_changed: [slot],
            headline: `Target ${scSpec.item_name} (${slot}) over ${baseSlotMap[slot].item_name}`,
            why_it_helps: `BiS canonical piece improves Sustained DPS by ${dm.sustained_dps_pct >= 0 ? '+' : ''}${dm.sustained_dps_pct}% (${dm.ttk_heroic_delta_sec >= 0 ? '+' : ''}${dm.ttk_heroic_delta_sec}s TTK).`,
            tinker_notes: acqHint || `Acquisition: ${dropPool.replace(/_/g, ' ')}`,
            drop_pool: dropPool,
            score: sc,
            replacement_slots: { [slot]: toWbSlotPayloadJS(candNorm) },
            recommended_gear_mods: simMods,
            delta_metrics: dm,
          });
        }
      }
    }

    const topFarmPerSlot = {};
    const bestFarmSingle = {};
    for (const s of allSlots) {
      topFarmPerSlot[s] = [...farmBySlot[s]].sort((a, b) => b.sc - a.sc).slice(0, 3);
      bestFarmSingle[s] = Math.max(0, ...onePieceFarm.filter(x => x.slots_changed[0] === s).map(x => x.score));
    }
    const twoPieceFarm = [];
    for (let i = 0; i < allSlots.length; i++) {
      const s1 = allSlots[i];
      for (let j = i + 1; j < allSlots.length; j++) {
        const s2 = allSlots[j];
        for (const f1 of topFarmPerSlot[s1]) {
          for (const f2 of topFarmPerSlot[s2]) {
            const simMap = { ...baseSlotMap, [s1]: f1.candNorm, [s2]: f2.candNorm };
            if (countExotics(simMap) > 1) continue;
            const simMods = autoSelectModsForLoadoutJS(pseudoBuild, simMap, db, wExp, wTal, goalMode, detectedRoleCode);
            const { bal: simBal } = evaluateSlotMapBallisticsJS(simMap, pseudoBuild, db, wExp, wTal, simMods);
            const sc = scoreBallisticsForGoalJS(simBal, baseBal, goalMode, detectedRoleCode, simMap);
            if (sc > Math.max(bestFarmSingle[s1], bestFarmSingle[s2]) + 1.2) {
              const dm = computeBallisticsDeltaJS(simBal, baseBal);
              twoPieceFarm.push({
                rec_id: `farm_2pc_${s1}_${s2}_${f1.candNorm.item_name}_${f2.candNorm.item_name}`.toLowerCase().replace(/\s+/g, '_'),
                track: 'farm_targets',
                swap_count: 2,
                action_type: 'FARM_2PC_COMBO',
                badge: `🎯 FARM 2-PC COMBO (${s1} + ${s2})`,
                slots_changed: [s1, s2],
                headline: `2-Piece Upgrade: ${f1.candNorm.item_name} (${s1}) + ${f2.candNorm.item_name} (${s2})`,
                why_it_helps: `Combined 2-slot upgrade gains ${dm.sustained_dps_pct >= 0 ? '+' : ''}${dm.sustained_dps_pct}% Sustained DPS (${dm.armor_pct >= 0 ? '+' : ''}${dm.armor_pct}% Armor).`,
                tinker_notes: `${s1}: ${f1.dropPool.replace(/_/g, ' ')} • ${s2}: ${f2.dropPool.replace(/_/g, ' ')}`,
                drop_pool: f1.dropPool !== 'COUNTDOWN_OPEN_WORLD' ? f1.dropPool : f2.dropPool,
                score: sc,
                replacement_slots: { [s1]: toWbSlotPayloadJS(f1.candNorm), [s2]: toWbSlotPayloadJS(f2.candNorm) },
                recommended_gear_mods: simMods,
                delta_metrics: dm,
              });
            }
          }
        }
      }
    }

    return {
      goal_mode: String(goalMode || 'AUTO').toUpperCase(),
      intent,
      baseline_ballistics: baseBal,
      recommended_gear_mods: optMods,
      zero_swap_quick_wins: quickWins.slice(0, 6),
      owned_armory_swaps: ownedFinal,
      farm_target_upgrades: [...onePieceFarm, ...twoPieceFarm].sort((a, b) => b.score - a.score).slice(0, 5),
    };
  }

  function evaluateAllBuildsJS(ownedItems, customBuildsList = [], savedLoadouts = []) {
    const seed = getSeedData() || {};
    const canonicalDb = seed.canonical_db || {};
    const baseBuilds = seed.meta_builds || [];
    const builds = [...baseBuilds, ...customBuildsList];

    const allSlots = ['MASK', 'BACKPACK', 'CHEST', 'GLOVES', 'HOLSTER', 'KNEEPADS'];
    const itemsBySlot = { MASK: [], BACKPACK: [], CHEST: [], GLOVES: [], HOLSTER: [], KNEEPADS: [] };
    const armorItems = [];

    for (const it of ownedItems || []) {
      it.item_category = inferItemCategoryJS(it);
      it.archetype_tags = classifyItemArchetypeJS(it, canonicalDb);
      if (it.item_category === 'ARMOR') {
        armorItems.push(it);
        const s = (it.slot || '').toUpperCase();
        if (itemsBySlot[s]) itemsBySlot[s].push(it);
      }
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
            raw_sort_score: details.raw_sort_score != null ? details.raw_sort_score : sc,
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
          const cleanTargetName = formatTargetPieceNameJS(targetBrandRaw, slot, canonicalDb);
          const isNamed = Boolean(NAMED_ITEM_PARENT_BRAND[cleanTargetName.toLowerCase()]) ||
            (targetParentBrand.toLowerCase() !== String(targetBrandRaw).trim().toLowerCase() && !isExoticItemJS(targetBrandRaw, canonicalDb));

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
            target_item_name: cleanTargetName,
            display_name: `Missing: ${cleanTargetName}`,
            brand: targetParentBrand,
            raw_brand: targetBrandRaw,
            rarity: isExoticItemJS(targetBrandRaw, canonicalDb) ? 'EXOTIC' : (isGearSetBrandJS(targetParentBrand, canonicalDb) ? 'GEAR_SET' : (isNamed ? 'NAMED_HIGH_END' : 'HIGH_END')),
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

      const bStatus = String(b.status || 'ACTIVE').toUpperCase();
      const shouldProtectItems = bStatus === 'ACTIVE' || (bStatus === 'LEGACY' && ownedSlotsCount >= 4);
      if (shouldProtectItems) {
        for (const [slot, sObj] of Object.entries(slotBreakdown)) {
          if (sObj.status === 'OWNED' && sObj.item_id) {
            const cid = sObj.item_id;
            if (!itemUsage[cid]) itemUsage[cid] = [];
            itemUsage[cid].push({
              build_id: buildId,
              build_name: b.name,
              tier_badge: bStatus === 'LEGACY' ? 'LEGACY' : (b.tier_badge || 'META'),
              build_status: bStatus,
              slot,
              score: sObj.match_pct,
              tinker: sObj.tinker_advice,
              tinker_type: sObj.tinker_type,
              is_starter: true,
            });
          }
        }
      }

      const completionPct = Math.round((totalScore / 6.0) * 10) / 10;
      evaluatedBuilds.push({
        build_id: buildId,
        name: b.name,
        role: b.role,
        status: bStatus,
        verified_patch: b.verified_patch || 'TU24 / Y8',
        updated_at: b.updated_at || '',
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

    evaluatedBuilds.sort((a, b) => {
      const aLeg = a.status === 'LEGACY' ? 1 : 0;
      const bLeg = b.status === 'LEGACY' ? 1 : 0;
      if (aLeg !== bLeg) return aLeg - bLeg;
      return b.owned_slots_count - a.owned_slots_count || b.completion_pct - a.completion_pct;
    });

    // Multi-Archetype Deconstruct Advisor (Armor only, protecting Saved & In-Game Loadouts)
    const protectedLoadoutIds = new Set();
    for (const ld of savedLoadouts || []) {
      const ldName = ld.name || 'Saved Loadout';
      for (const [sKey, sv] of Object.entries(ld.slots || ld.slot_items || {})) {
        if (sv && sv.item_id) {
          protectedLoadoutIds.add(sv.item_id);
          if (!itemUsage[sv.item_id]) itemUsage[sv.item_id] = [];
          if (!itemUsage[sv.item_id].some(u => u.build_name === ldName)) {
            itemUsage[sv.item_id].push({
              build_id: ld.loadout_id || 'saved_loadout',
              build_name: ldName,
              tier_badge: 'SAVED LOADOUT',
              build_status: 'SAVED',
              slot: sKey,
              score: 100.0,
              tinker: 'Protected in Saved Workbench Loadout',
              tinker_type: 'READY_AS_IS',
              is_starter: true,
            });
          }
        }
      }
    }

    const deconstructCandidates = [];
    const byFiveTuple = {};
    for (const it of armorItems) {
      const s = (it.slot || 'UNKNOWN').toUpperCase();
      const bName = resolveParentBrandJS(it.brand_or_set || it.item_name || 'Unknown', canonicalDb);
      const arch = (it.archetype_tags || classifyItemArchetypeJS(it, canonicalDb)).role_archetype || 'HYBRID';
      const cType = String((it.core_attribute || {}).type || 'WEAPON_DAMAGE').toUpperCase();
      const tName = String((it.talent || {}).name || 'NONE').toLowerCase();
      const key = `${s}|${bName}|${arch}|${cType}|${tName}`;
      if (!byFiveTuple[key]) byFiveTuple[key] = [];
      byFiveTuple[key].push(it);
    }
    for (const it of armorItems) {
      const iid = it.item_id;
      const usages = itemUsage[iid] || [];
      const rarity = String(it.rarity || 'HIGH_END').toUpperCase();
      const igLoadouts = Array.isArray(it.in_game_loadouts) ? it.in_game_loadouts : [];
      if (it.is_favorite || rarity === 'EXOTIC' || rarity === 'NAMED_HIGH_END' || usages.length > 0 || protectedLoadoutIds.has(iid) || igLoadouts.length > 0) continue;
      const s = (it.slot || 'UNKNOWN').toUpperCase();
      const bName = resolveParentBrandJS(it.brand_or_set || it.item_name || 'Unknown', canonicalDb);
      const archObj = it.archetype_tags || classifyItemArchetypeJS(it, canonicalDb);
      const arch = archObj.role_archetype || 'HYBRID';
      const cType = String((it.core_attribute || {}).type || 'WEAPON_DAMAGE').toUpperCase();
      const tName = String((it.talent || {}).name || 'NONE').toLowerCase();
      const sameGroup = byFiveTuple[`${s}|${bName}|${arch}|${cType}|${tName}`] || [];
      const powerRatio = computeItemPowerRatioJS(it);
      const powerPct = Math.round(powerRatio * 1000) / 10;
      const dispName = it.item_name || bName;
      if (sameGroup.length > 1) {
        const bestRatio = Math.max(...sameGroup.map(g => computeItemPowerRatioJS(g)));
        if (powerRatio + 0.08 < bestRatio) {
          deconstructCandidates.push({
            item_id: iid,
            slot: s,
            item_name: dispName,
            display_name: dispName,
            brand_or_set: bName,
            rarity,
            power_pct: powerPct,
            role_archetype: archObj.role_label || arch,
            reason: `Strictly dominated duplicate ${bName} ${s} in ${archObj.role_label || arch} archetype (${Math.round(powerRatio * 100)}% vs ${Math.round(bestRatio * 100)}% roll power) and unused in any Meta Build.`,
          });
        }
      } else if (powerRatio < 0.72) {
        deconstructCandidates.push({
          item_id: iid,
          slot: s,
          item_name: dispName,
          display_name: dispName,
          brand_or_set: bName,
          rarity,
          power_pct: powerPct,
          role_archetype: archObj.role_label || arch,
          reason: `Unused in all Meta Builds and low attribute roll power (${Math.round(powerRatio * 100)}%). Safe to deconstruct for Printer Filament / Receiver Components.`,
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

  function buildLocalMetaFreshness(seed, evaluatedBuilds) {
    const base = seed.meta_freshness || {};
    const verAt = base.last_verified_at || new Date().toISOString();
    const staleThreshold = Number(base.stale_after_days || 30);
    let daysSince = 0;
    try {
      daysSince = Math.max(0, Math.floor((Date.now() - new Date(verAt).getTime()) / 86400000));
    } catch (_) {
      daysSince = 0;
    }
    const activeCount = (evaluatedBuilds || []).filter(b => (b.status || 'ACTIVE') === 'ACTIVE').length;
    const legacyCount = (evaluatedBuilds || []).filter(b => b.status === 'LEGACY').length;
    return {
      meta_version: base.meta_version || 'TU24 / Year 8 Meta',
      patch_label: base.patch_label || 'Year 8 / Battle for Brooklyn & Crossroads Balance',
      last_verified_at: verAt,
      days_since_verified: daysSince,
      stale_after_days: staleThreshold,
      is_stale: daysSince > staleThreshold,
      active_count: activeCount,
      legacy_count: legacyCount,
      pending_proposals_count: 0,
      pending_proposals: [],
      sources: base.sources || [],
      changelog: base.changelog || [],
    };
  }

  function buildLocalPlatformState() {
    detectRuntimeProfile();
    const store = loadLocalStore();
    const seed = getSeedData() || {};
    const solverOut = evaluateAllBuildsJS(store.items, store.custom_builds || [], store.saved_loadouts || []);

    return {
      profile: _activeProfile,
      agent_profile: { profile_id: _activeProfile.userId, callsign: 'Agent Admin', shd_level: Number(store.shd_level || 2793) },
      inventory: store.items,
      inventory_count: store.items.length,
      evaluated_builds: solverOut.evaluated_builds,
      item_usage: solverOut.item_usage,
      deconstruct_candidates: solverOut.deconstruct_candidates,
      saved_loadouts: store.saved_loadouts || [],
      admin_showcase_loadouts: seed.saved_loadouts || [],
      expertise: buildExpertisePayload(store),
      canonical: seed.canonical_db || {},
      meta_freshness: buildLocalMetaFreshness(seed, solverOut.evaluated_builds),
    };
  }

  function enrichServerState(serverData) {
    detectRuntimeProfile();
    _activeProfile.mode = 'PC_FASTAPI';
    const seed = getSeedData() || {};
    const shdLvl = Number((serverData.agent_profile && serverData.agent_profile.shd_level) || 2793);
    if (_activeProfile.userId === 'admin') {
      _activeProfile.displayName = `Agent Admin (SHD ${shdLvl})`;
    }
    return {
      ...serverData,
      profile: _activeProfile,
      admin_showcase_loadouts: serverData.admin_showcase_loadouts || seed.saved_loadouts || [],
      meta_freshness: serverData.meta_freshness || buildLocalMetaFreshness(seed, serverData.evaluated_builds || []),
    };
  }

  // Unified Public Adapter API (with all aliases required by web/app.js)
  const Adapter = {
    getActiveProfile: () => detectRuntimeProfile(),
    setActiveProfile: profileId => setActiveProfile(profileId),

    getMode: () => {
      const isLocalHttp =
        typeof window !== 'undefined' &&
        window.location &&
        /^https?:$/i.test(window.location.protocol) &&
        (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
      if (_pcServerAvailable === true || (isLocalHttp && !window.RollupBridge)) return 'FASTAPI_PC';
      if (window.RollupBridge) return 'ANDROID_HUB_CARTRIDGE';
      return 'PORTABLE_LOCAL';
    },

    async getState() {
      detectRuntimeProfile();
      const isLocalHttp =
        typeof window !== 'undefined' &&
        window.location &&
        /^https?:$/i.test(window.location.protocol) &&
        (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
      if (_activeProfile.userId === 'admin' && (_pcServerAvailable !== false || isLocalHttp)) {
        try {
          const res = await fetch('/api/state', { signal: AbortSignal.timeout(8000) });
          if (res.ok) {
            _pcServerAvailable = true;
            const data = await res.json();
            return enrichServerState(data);
          }
        } catch (_) {
          if (!isLocalHttp) {
            _pcServerAvailable = false;
          }
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

    async updateShdLevel(shdLevel) {
      const cleanLvl = Math.max(1, Math.min(999999, Math.round(Number(shdLevel) || 2793)));
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/profile/shd-level', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shd_level: cleanLvl }),
        });
        const d = await res.json();
        return enrichServerState(d.state || d);
      }
      const store = loadLocalStore();
      store.shd_level = cleanLvl;
      saveLocalStore(store);
      return buildLocalPlatformState();
    },

    async getScannerStatus() {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/status');
        return await res.json();
      }
      return { enabled: false, state: 'OFFLINE_PORTABLE', resync: { active: false, seen_count: 0, stale_candidates: [] } };
    },

    async toggleScanner(payload = null) {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload ? JSON.stringify(payload) : '{}',
        });
        return await res.json();
      }
      return { enabled: false, state: 'OFFLINE_PORTABLE' };
    },

    async snapLiveCard(location = 'BACKPACK') {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/snap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location }),
        });
        const d = await res.json();
        return { captured_item: d.captured_item, state: enrichServerState(d.state || d) };
      }
      return { captured_item: null, state: buildLocalPlatformState() };
    },

    async commitEphemeralItem() {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/commit-ephemeral', { method: 'POST' });
        if (!res.ok) throw new Error('No ephemeral item to commit');
        const d = await res.json();
        return { saved_item: d.saved_item, state: enrichServerState(d.state || d) };
      }
      return { saved_item: null, state: buildLocalPlatformState() };
    },

    async startResyncSweep(slotFilter = null, locationFilter = null) {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/resync/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slot_filter: slotFilter, location_filter: locationFilter }),
        });
        return await res.json();
      }
      return null;
    },

    async finishResyncSweep() {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/resync/finish', { method: 'POST' });
        return await res.json();
      }
      return { stale_items: [], seen_count: 0 };
    },

    async pruneResyncItems(itemIds) {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/resync/prune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_ids: itemIds }),
        });
        const d = await res.json();
        return { prune_result: d.prune_result, state: enrichServerState(d.state || d) };
      }
      return { prune_result: { removed_count: 0 }, state: buildLocalPlatformState() };
    },

    async stageMetaProposal(payload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/meta/stage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || 'Failed staging Meta Proposal');
        return { proposal: d.staged_proposal, state: enrichServerState(d.state || d) };
      }
      if (payload && payload.build) {
        const state = await Adapter.addCustomBuild(payload.build);
        return { proposal: null, state };
      }
      return { proposal: null, state: buildLocalPlatformState() };
    },

    async parseMetaBuildText(payload) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/meta/parse-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || 'Failed parsing Meta Build text');
        return {
          proposal: d.staged_proposal,
          apply_result: d.meta_apply_result || null,
          state: enrichServerState(d.state || d),
        };
      }
      throw new Error('Quick Text Meta Staging requires PC FastAPI mode.');
    },

    async approveMetaProposal(proposalId, payload = {}) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/meta/proposals/${encodeURIComponent(proposalId)}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload || {}),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || 'Failed approving Meta Proposal');
        return { apply_result: d.meta_apply_result, state: enrichServerState(d.state || d) };
      }
      return { apply_result: null, state: buildLocalPlatformState() };
    },

    async rejectMetaProposal(proposalId) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/meta/proposals/${encodeURIComponent(proposalId)}/reject`, {
          method: 'POST',
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || 'Failed rejecting Meta Proposal');
        return { state: enrichServerState(d.state || d) };
      }
      return { state: buildLocalPlatformState() };
    },

    async markMetaVerifiedNow(payload = {}) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/meta/verify-now', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload || {}),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || 'Failed updating verification timestamp');
        return { state: enrichServerState(d.state || d) };
      }
      return { state: buildLocalPlatformState() };
    },

    async setMetaBuildLifecycle(buildId, status) {
      if (_pcServerAvailable && _activeProfile.userId === 'admin') {
        const res = await fetch(`/api/meta/builds/${encodeURIComponent(buildId)}/lifecycle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || 'Failed updating build lifecycle');
        return { state: enrichServerState(d.state || d) };
      }
      return { state: buildLocalPlatformState() };
    },

    async toggleEquippedCapture(active = null, clearExisting = false) {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/equipped/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active, clear_existing: Boolean(clearExisting) }),
        });
        return await res.json();
      }
      return { enabled: false, state: 'OFFLINE_PORTABLE', equipped_capture: { active: false, captured_slots: {}, armor_count: 0, weapons_captured: [] } };
    },

    async clearEquippedCapture() {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        const res = await fetch('/api/scanner/equipped/clear', { method: 'POST' });
        return await res.json();
      }
      return { enabled: false, state: 'OFFLINE_PORTABLE', equipped_capture: { active: false, captured_slots: {}, armor_count: 0, weapons_captured: [] } };
    },

    async optimizeWorkbenchLoadout(loadout, goalMode = 'AUTO') {
      if (Adapter.getMode() === 'FASTAPI_PC' && _activeProfile.userId === 'admin') {
        try {
          const res = await fetch('/api/workbench/optimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loadout, goal_mode: goalMode || 'AUTO' }),
          });
          if (res.ok) return await res.json();
        } catch (err) {
          console.warn('Server workbench optimize fallback to JS:', err);
        }
      }
      const st = await Adapter.fetchState();
      return analyzeActiveLoadoutJS(loadout, st.inventory || [], st.canonical || {}, goalMode);
    },

    evaluateAllBuildsJS,
    snapShorthandToItemJS,
    resolveParentBrandJS,
    formatTargetPieceNameJS,
    classifyItemArchetypeJS,
    computeLoadoutBallisticsJS,
    analyzeActiveLoadoutJS,
    iterCanonicalEntriesJS,
    normalizeWeaponEntryJS,
    inferItemCategoryJS,
  };

  window.SHDStorageAdapter = Adapter;
  window.SHDPortableSolver = Adapter;
})();
