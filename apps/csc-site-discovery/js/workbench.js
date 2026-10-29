/**
 * CSC Site Discovery — PC Companion Engineering Compute Workbench (v3.3.0)
 *
 * Strict Division of Responsibility:
 *   - Phone App (`app/js/app.js`): Fast Snap & Go Field Capture + Instant Nameplate Age / A2L Badges
 *   - PC Companion (`app/js/workbench.js` + `backend/companion_compute_engine.py`):
 *     1. ALC WebCTRL® Controller I/O Tally, FIO-812 Expander & Thermistor Curve Sizer
 *     2. Hydronic Control Valve Cv, Authority (Beta >= 0.50), Fail-Open Spring-Return (RFI-23-007)
 *        & Div 23 21 13 Concentric Pipe Reducer Sizer (RFI-23-002 / RFI-23-005)
 *     3. Automatic Control Damper Area & Belimo 24VAC Actuator Torque Sizer (RFI-23-004)
 *     4. Physical Access, Ceiling, CMU Wiremold & Shift Labor Multiplier
 *     5. Project-Wide TCP 24VAC Class 2 80% NEC Art. 725 Continuous VA Load Sizer (RFI-23-009)
 */

const COMMERCIAL_BELIMO_VALVES = [
  { cv: 0.4, valve_size_in: 0.5, body: "B208", cool_act: "TR24-SR", heat_sr_act: "LF24-SR", piccv: "P2050B005 + LRB24-SR" },
  { cv: 0.8, valve_size_in: 0.5, body: "B209", cool_act: "TR24-SR", heat_sr_act: "LF24-SR", piccv: "P2050B010 + LRB24-SR" },
  { cv: 1.2, valve_size_in: 0.5, body: "B210", cool_act: "TR24-SR", heat_sr_act: "LF24-SR", piccv: "P2050B015 + LRB24-SR" },
  { cv: 1.9, valve_size_in: 0.5, body: "B211", cool_act: "TR24-SR", heat_sr_act: "LF24-SR", piccv: "P2050B025 + LRB24-SR" },
  { cv: 3.0, valve_size_in: 0.5, body: "B212", cool_act: "TR24-SR", heat_sr_act: "LF24-SR", piccv: "P2050B045 + LRB24-SR" },
  { cv: 4.7, valve_size_in: 0.5, body: "B213", cool_act: "LRB24-SR", heat_sr_act: "LF24-SR", piccv: "P2050B065 + LRB24-SR" },
  { cv: 7.4, valve_size_in: 0.75, body: "B218", cool_act: "LRB24-SR", heat_sr_act: "LF24-SR", piccv: "P2075B090 + LRB24-SR" },
  { cv: 10.0, valve_size_in: 1.0, body: "B223", cool_act: "LRB24-SR", heat_sr_act: "LF24-SR", piccv: "P2100B110 + LRB24-SR" },
  { cv: 14.0, valve_size_in: 1.0, body: "B224", cool_act: "LRB24-SR", heat_sr_act: "LF24-SR", piccv: "P2100B170 + LRB24-SR" },
  { cv: 19.0, valve_size_in: 1.25, body: "B230", cool_act: "LRB24-SR", heat_sr_act: "LF24-SR", piccv: "P2125B260 + LRB24-SR" },
  { cv: 24.0, valve_size_in: 1.5, body: "B239", cool_act: "LRB24-SR", heat_sr_act: "NFB24-SR", piccv: "P2150S-450 + NRB24-SR" },
  { cv: 29.0, valve_size_in: 1.5, body: "B240", cool_act: "NRB24-SR", heat_sr_act: "NFB24-SR", piccv: "P2150S-450 + NRB24-SR" },
  { cv: 37.0, valve_size_in: 2.0, body: "B249", cool_act: "NRB24-SR", heat_sr_act: "NFB24-SR", piccv: "P2200S-650 + ARB24-SR" },
  { cv: 46.0, valve_size_in: 2.0, body: "B250", cool_act: "ARB24-SR", heat_sr_act: "AFB24-SR", piccv: "P2200S-850 + ARB24-SR" },
  { cv: 65.0, valve_size_in: 2.5, body: "B261", cool_act: "ARB24-SR", heat_sr_act: "AFB24-SR", piccv: "ePIV065S + EV24A-SR" },
  { cv: 90.0, valve_size_in: 3.0, body: "G680B-N", cool_act: "EVB24-SR", heat_sr_act: "EFB24-SR", piccv: "ePIV080S + EV24A-SR" },
  { cv: 116.0, valve_size_in: 3.0, body: "G680B-N-H", cool_act: "EVB24-SR", heat_sr_act: "EFB24-SR", piccv: "ePIV080S + EV24A-SR" },
  { cv: 190.0, valve_size_in: 4.0, body: "G6100S", cool_act: "EVB24-SR", heat_sr_act: "EFB24-SR", piccv: "ePIV100S + EV24A-SR" },
  { cv: 400.0, valve_size_in: 6.0, body: "F6150HD", cool_act: "GMB24-SR", heat_sr_act: "2*AFB24-SR", piccv: "ePIV150S + GRB24-SR" }
];

const FLUID_SPECIFIC_GRAVITY = {
  "100% Water": 1.000,
  "25% Propylene Glycol": 1.026,
  "30% Propylene Glycol": 1.032,
  "40% Propylene Glycol": 1.041,
  "30% Ethylene Glycol": 1.045
};

const VA_LOAD_CONSTANTS = {
  optiflex_controller_va: 24.0,
  zn_unitary_vav_va: 12.0,
  io_expander_va: 14.0,
  spring_return_actuator_va: 7.0,
  non_spring_actuator_va: 3.0,
  rnet_zone_sensor_va: 1.5
};

const DEFAULT_IO_BY_ARCHETYPE = {
  RTU_AHU: { ui: 6, bi: 4, bo: 4, ao: 4 },
  VFD_STARTER: { ui: 0, bi: 2, bo: 1, ao: 1 },
  HYDRONIC_VALVE_PUMP: { ui: 2, bi: 2, bo: 1, ao: 2 },
  CHILLER_BOILER_PLANT: { ui: 6, bi: 4, bo: 4, ao: 3 },
  VAV_TERMINAL: { ui: 2, bi: 0, bo: 1, ao: 1 },
  ZONE_SENSOR: { ui: 1, bi: 0, bo: 0, ao: 0 },
  BAS_TCP_PANEL: { ui: 1, bi: 1, bo: 0, ao: 0 }
};

const TRANE_YEAR_LETTERS = {
  U: 2002, W: 2003, X: 2004, Y: 2005, Z: 2006, G: 2007, K: 2008, L: 2009,
  M: 2010, N: 2011, P: 2012, R: 2013, S: 2014, T: 2015, C: 2016, D: 2017, E: 2018, F: 2019
};

const TRANE_MONTH_LETTERS = {
  A: "January", B: "February", C: "March", D: "April", E: "May", F: "June",
  G: "July", H: "August", J: "September", K: "October", L: "November", M: "December"
};

const ASHRAE_CH38_SERVICE_LIFE = {
  PACKAGED_RTU: 15,
  RTU_AHU: 18,
  VFD_STARTER: 15,
  HYDRONIC_VALVE_PUMP: 20,
  CHILLER_BOILER_PLANT: 22,
  VAV_TERMINAL: 28,
  ZONE_SENSOR: 15,
  BAS_TCP_PANEL: 15
};

const BOARD_SWITCH_REFERENCE_TABLE = [
  {
    tokens: ["OF1628", "OPTIFLEX", "ZN551", "ZN341", "ZN220", "FIO-812", "ME812", "SE6104"],
    family: "Automated Logic OptiFlex™ / ZN Series Native BACnet Controller",
    citation: "ALC-HW-2026: OptiFlex OF1628 & ZN341v/ZN551 Hardware Installation Guide (Sec. 4)",
    rotary_mac_rule: "Set Rotary Switches: Tens (x10) + Ones (x1) to unique MAC 01–127 (00 reserved for router). Cycle power or press reset after changing MAC.",
    eol_jumper_rule: "BT1 / EOL Termination Jumper: Set to IN (120-Ohm) ONLY on the first and last physical controller on the RS-485 MS/TP daisy-chain trunk.",
    power_24vac_rule: "24VAC Class 2 Hot/Neutral polarity MUST be maintained across all controllers on the same transformer (NEC Art. 725 / RFI-23-009).",
    summary: "Rotary MAC 01–127 (Tens x10 + Ones x1) • BT1 120Ω EOL Jumper IN at trunk ends only • Maintain 24VAC Class 2 polarity."
  },
  {
    tokens: ["SYMBIO", "YSC", "YCD", "TCD", "UC400", "UC600"],
    family: "Trane Symbio™ 700/800 & UC400/600 Factory OEM Microprocessor",
    citation: "BAS-SVX088 / RFI-23-001: Trane Symbio 700 BACnet MS/TP & Safety Overlay Guide",
    rotary_mac_rule: "Set BACnet MS/TP MAC Address (001–127) via Rotary Dials or Symbio Service Mobile App; default baud 76,800 or 38,400 bps (8-N-1).",
    eol_jumper_rule: "Engage onboard 120-Ohm RS-485 bias/termination switch (S1) ONLY if RTU is at the physical end of the MS/TP trunk.",
    power_24vac_rule: "CSC Hybrid Overlay (RFI-23-001): Hardwire Start/Stop Enable DO, Common Fault DI & DPDT Freeze/Smoke loop; write DAT/Static resets at BACnet Priority 8/10.",
    summary: "CSC Hybrid Overlay (RFI-23-001): Hardwired Start/Stop Enable DO, Common Fault DI & DPDT Freeze/Smoke loop + BACnet MS/TP Priority 8/10 resets."
  },
  {
    tokens: ["ACH580", "ACH550", "ABB"],
    family: "ABB ACH580 / ACH550 HVAC Variable Frequency Drive",
    citation: "ABB-3AXD50000044839 / RFI-23-006: ACH580 Hardwired Control vs. Read-Only BACnet",
    rotary_mac_rule: "Parameter Group 58 (Embedded EIA-485): Set Par 58.01 = BACnet MS/TP, Par 58.03 = MAC Address, Par 58.04 = Baud Rate.",
    eol_jumper_rule: "Bus Termination Switch X58: Set ON only at physical end of RS-485 trunk; keep Hand-Off-Auto (HOA) keypad deterministic.",
    power_24vac_rule: "RFI-23-006 Standard: Wire Start/Stop (DI1), Speed 0-10VDC (AI1), Run/Fault (RO1/RO2) & Safety Interlock (DIIL) HARDWIRED; BACnet MS/TP Read-Only.",
    summary: "Hardwired Control (RFI-23-006): DI1 Start/Stop, AI1 0–10VDC Speed, RO1/RO2 Run/Fault + DIIL Series Safety Loop; Par 58.01 BACnet Read-Only."
  },
  {
    tokens: ["DX-9100", "UNT", "VMA", "NAE", "METASYS", "FX-PCA", "FX-PCG"],
    family: "Legacy Johnson Controls Metasys® N2 / FX Series Controller",
    citation: "JCI-LIT-636018: Legacy N2 Bus Decommissioning & Sensor Resistance Audit",
    rotary_mac_rule: "Legacy N2 DIP Switch binary address (1–255) — decommission N2 polling and verify RS-485 daisy-chain continuity (remove star T-taps).",
    eol_jumper_rule: "Remove legacy JCI 220-Ohm EOL resistors; install standard 120-Ohm 1/2W resistors at both ends of the new BACnet MS/TP trunk.",
    power_24vac_rule: "Check existing JCI 1,000-Ohm Nickel RTD sensors — replace with ALC 10k Type II thermistors & ZS Pro Rnet zone sensor (RFI-23-008).",
    summary: "Existing JCI sensors are 1,000Ω Nickel RTD — replace w/ ALC 10k Type II + ZS Pro; replace legacy 220Ω EOL w/ 120Ω at MS/TP trunk ends."
  },
  {
    tokens: ["SPYDER", "EXCEL", "XL50", "WEBS", "LON", "PULP"],
    family: "Legacy Honeywell Spyder® / Excel 5000 LonWorks or MS/TP Controller",
    citation: "HW-62-0311: Honeywell Spyder Migration & 20k-Ohm NTC Sensor Audit",
    rotary_mac_rule: "LonWorks Neuron ID push-button service pin or MS/TP MAC DIP switch bank (binary 1-64); replace controller for native ALC WebCTRL®.",
    eol_jumper_rule: "LonWorks free-topology termination module MUST be removed before repurposing shielded twisted-pair cable for BACnet MS/TP.",
    power_24vac_rule: "Existing Honeywell 20k-Ohm NTC sensors require custom WebCTRL® liner table or field replacement with ALC 10k Type II sensors.",
    summary: "Existing Honeywell sensors use 20kΩ NTC curve — load ALC custom liner table or replace w/ 10k Type II; remove LonWorks free-topology terminators."
  }
];
const NEUTRAL_BOARD_LIBRARY = BOARD_SWITCH_REFERENCE_TABLE;

const LEGACY_CONTROLLER_CROSSREF_JS = [
  {
    tokens: ["DX-9100", "DX9100"],
    legacy_family: "Johnson Controls Metasys DX-9100 (Legacy N2)",
    recommended_alc: "ALC OptiFlex OF1628 + FIO-812 Expanders",
    migration_notes: "Replace 1kΩ Nickel RTDs w/ ALC 10k Type II; verify DPDT manual-reset freeze stat (RFI-23-007) and hardwired VFD control (RFI-23-006)."
  },
  {
    tokens: ["UNT", "VMA14", "VMA16", "FX-PCV"],
    legacy_family: "Johnson Controls N2 UNT / VMA Terminal Controller",
    recommended_alc: "ALC ZN341v (VAV) or ZN551 (Unitary)",
    migration_notes: "Consolidate zone temp/RH/CO2 into single ALC ZS Pro communicating sensor on Rnet bus (RFI-23-008)."
  },
  {
    tokens: ["SPYDER", "PULP", "PVL", "XL50", "EXCEL"],
    legacy_family: "Honeywell Spyder / Excel 5000",
    recommended_alc: "ALC ZN551 or ZN341v Native BACnet Controller",
    migration_notes: "Audit existing 20kΩ NTC thermistor curve (load custom liner table or replace accessible sensors w/ 10k Type II)."
  },
  {
    tokens: ["SYMBIO", "UC400", "UC600", "WATTMASTER", "MICROTECH"],
    legacy_family: "Factory-Mounted OEM Microprocessor (Symbio / MicroTech / WattMaster)",
    recommended_alc: "CSC Hybrid Overlay (RFI-23-001): Keep OEM Controller + BACnet MS/TP & Hardwired Safety I/O",
    migration_notes: "Do NOT gut factory OEM controller. Hardwire Start/Stop DO, Common Fault DI & DPDT Freeze/Smoke cutouts; write DAT/Static resets at BACnet Priority 8/10."
  }
];

const OEM_CONTROLLER_TOKENS_JS = [
  "SYMBIO", "MICROTECH", "WATTMASTER", "VCCX", "UC400", "UC600", "TRACER",
  "COMFORTLINK", "SMART EQUIPMENT", "SE-SPU", "PRODIGY", "CORE", "EVOLUTION", "MODINE"
];

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================================================
// DETERMINISTIC CALCULATORS (1:1 MIRROR OF backend/hvac_calculators.py)
// ============================================================================
function decodeSerialDeterministic(mfg, serial, archetypeId, modelStr) {
  const m = (mfg || "").toUpperCase().trim();
  const s = (serial || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const mdl = (modelStr || "").toUpperCase().trim();
  const curYear = new Date().getFullYear();
  const curYY = curYear % 100;
  let year = null;
  let period = "Standard Production";

  const mTraneMod = s.match(/^(\d{2})(\d{2})\d{4,6}[A-Z]$/);
  if (m.includes("TRANE") && mTraneMod) {
    const yy = parseInt(mTraneMod[1], 10);
    const ww = parseInt(mTraneMod[2], 10);
    if (yy >= 10 && yy <= curYY && ww >= 1 && ww <= 53) {
      year = 2000 + yy;
      period = `Week ${ww}`;
    }
  }
  const mTraneLet = s.match(/^([A-Z])(\d{2})([A-M])\d+/);
  if (!year && m.includes("TRANE") && mTraneLet) {
    const yrLet = mTraneLet[1];
    const midDigits = parseInt(mTraneLet[2], 10);
    const moLet = mTraneLet[3];
    year = TRANE_YEAR_LETTERS[yrLet] || (midDigits <= curYY ? 2000 + midDigits : 1900 + midDigits);
    period = TRANE_MONTH_LETTERS[moLet] || `Code ${moLet}`;
  }
  const m4Dig = s.match(/^(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("CARRIER") || m.includes("BRYANT") || m.includes("LOCHINVAR") || m.includes("YORK") || m.includes("DAIKIN")) && m4Dig) {
    const d1 = parseInt(m4Dig[1], 10);
    const d2 = parseInt(m4Dig[2], 10);
    if (d1 > curYY && d1 <= 52 && d2 >= 0 && d2 <= curYY) {
      year = 2000 + d2;
      period = `Week ${d1}`;
    } else if (d1 >= 0 && d1 <= curYY && d2 >= 1 && d2 <= 52) {
      year = 2000 + d1;
      period = `Week ${d2}`;
    }
  }
  const mAbb = s.match(/^\d(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("ABB") || m.includes("YASKAWA")) && mAbb) {
    const yy = parseInt(mAbb[1], 10);
    const ww = parseInt(mAbb[2], 10);
    if (yy >= 5 && yy <= curYY && ww >= 1 && ww <= 53) {
      year = 2000 + yy;
      period = `Week ${ww}`;
    }
  }
  const mHyph = s.match(/[A-Z]+-?(\d{2})-\d+/);
  if (!year && mHyph) {
    const yy = parseInt(mHyph[1], 10);
    year = yy <= curYY ? 2000 + yy : 1900 + yy;
  }

  let lifeLimit = ASHRAE_CH38_SERVICE_LIFE[archetypeId] || 18;
  if (archetypeId === "RTU_AHU" && /(YSC|YCD|TCD|WSC|48TC|50TC|RN-)/.test(mdl)) {
    lifeLimit = ASHRAE_CH38_SERVICE_LIFE.PACKAGED_RTU;
  } else if (/(TITUS|NAILOR|PRICE|VAV)/.test(m)) {
    lifeLimit = ASHRAE_CH38_SERVICE_LIFE.VAV_TERMINAL;
  }
  const age = year ? Math.max(0, curYear - year) : null;
  const eol = age !== null && age >= lifeLimit;
  return { year, period, age, lifeLimit, eol };
}

function decodeModelDeterministic(mfg, modelStr) {
  const mdl = (modelStr || "").toUpperCase().trim();
  let capacity = "";
  let a2lFlag = false;
  const mTon = mdl.match(/(?:YSC|YCD|TCD|WSC|TSC|48[A-Z]{2}|50[A-Z]{2}|ZR|RN-)0?(\d{2,3})/);
  if (mTon) {
    const num = parseInt(mTon[1], 10);
    if ([24, 30, 36, 42, 48, 60, 72, 90, 102, 120, 150, 180, 210, 240, 300].includes(num)) {
      capacity = `${(num / 12).toFixed(1).replace(/\.0$/, "")} Tons DX (${num} MBH)`;
    }
  }
  const mCsaa = mdl.match(/CSAA0?(\d{2,3})/);
  if (!capacity && mCsaa) {
    const sz = parseInt(mCsaa[1], 10);
    capacity = `Size ${sz} Modular AHU (~${(sz * 500).toLocaleString()} CFM)`;
  }
  const mBlr = mdl.match(/(?:FB|FTXL|KBN|CF)(\d{3,4})/);
  if (!capacity && mBlr) {
    let mbh = parseInt(mBlr[1], 10);
    if (mbh % 10 === 1) mbh -= 1;
    capacity = `${mbh.toLocaleString()} MBH Condensing Boiler`;
  }
  const mAbb = mdl.match(/ACH580-\d+-0?(\d{2,3})A-4/);
  if (!capacity && mAbb) {
    capacity = `${parseInt(mAbb[1], 10)} FLA @ 480V VFD`;
  }
  const mVav = mdl.match(/(?:DESV|PESV|3000)-0?(\d{1,2})/);
  if (!capacity && mVav) {
    capacity = `${parseInt(mVav[1], 10)}" Inlet VAV Terminal`;
  }
  if (/(454B|R454|R-32|R32|A2L|YSC\d{3}K|TCD\d{3}K|50[A-Z]K)/.test(mdl)) {
    a2lFlag = true;
  }
  return { capacity, a2lFlag };
}

function matchLegacyControllerToAlcJS(legacyCtrl) {
  const up = String(legacyCtrl || "").toUpperCase();
  for (const row of LEGACY_CONTROLLER_CROSSREF_JS) {
    if (row.tokens.some((t) => up.includes(t))) return row;
  }
  return null;
}

function lookupBoardRefJS(mfg, model, legacyCtrl) {
  const combined = `${mfg || ""} ${model || ""} ${legacyCtrl || ""}`.toUpperCase();
  let matched = BOARD_SWITCH_REFERENCE_TABLE[0];
  for (const ref of BOARD_SWITCH_REFERENCE_TABLE) {
    if (ref.tokens.some((t) => combined.includes(t))) {
      matched = ref;
      break;
    }
  }
  return Object.assign({}, matched, {
    legacy_crossref: matchLegacyControllerToAlcJS(legacyCtrl)
  });
}

function _inferDefaultStrategyForStation(st, ignoreExistingReplacement = false) {
  const arch = String(st.archetype_id || st.archetype || "RTU_AHU").toUpperCase();
  const np = st.nameplate_data || {};
  const bas = st.bas_overlay_profile || {};
  const checks = st.checklist_selections || st.checks || {};
  const chkAhu01 = String(checks["CHK-AHU-01"] || "").toUpperCase();
  const legacy = String(np.legacy_controller_found || st.legacyCtrl || "").toUpperCase();
  const recRepl = ignoreExistingReplacement
    ? ""
    : String(np.recommended_alc_replacement || st.alcTarget || "").toUpperCase();

  if (!ignoreExistingReplacement) {
    const explicit = String(bas.integration_strategy || st.integrationStrategy || "").trim().toUpperCase();
    if (["HYBRID_OVERLAY", "FULL_ALC_DDC", "VFD_HARDWIRED_SPLIT"].includes(explicit)) {
      return explicit;
    }
  }

  if (
    arch === "VFD_STARTER" ||
    recRepl.includes("RFI-23-006") ||
    recRepl.includes("HARDWIRED CONTROL FROM") ||
    (recRepl.includes("HARDWIRED DO/AO/DI") && recRepl.includes("READ-ONLY"))
  ) {
    return "VFD_HARDWIRED_SPLIT";
  }
  if (
    recRepl.includes("HYBRID OVERLAY") ||
    recRepl.includes("RFI-23-001") ||
    OEM_CONTROLLER_TOKENS_JS.some((tok) => legacy.includes(tok)) ||
    chkAhu01.startsWith("YES")
  ) {
    return "HYBRID_OVERLAY";
  }
  return "FULL_ALC_DDC";
}

function recommendAlcControllerFromIoJS(uiCount, biCount, boCount, aoCount, archetypeId, thermistorCurve, integrationStrategy, legacyController) {
  const ui = Math.max(0, parseInt(uiCount, 10) || 0);
  const bi = Math.max(0, parseInt(biCount, 10) || 0);
  const bo = Math.max(0, parseInt(boCount, 10) || 0);
  const ao = Math.max(0, parseInt(aoCount, 10) || 0);
  const totalIn = ui + bi;
  const totalOut = bo + ao;
  const arch = (archetypeId || "RTU_AHU").toUpperCase();
  const curve = (thermistorCurve || "10k_TYPE_II").toUpperCase();
  const strategy = (integrationStrategy || "FULL_ALC_DDC").toUpperCase().trim();
  const legCtrl = String(legacyController || "").trim();

  let alcHw = "";
  let expanders = 0;
  let ctrlVa = 24.0;
  let strategyNote = "";

  if (strategy === "HYBRID_OVERLAY") {
    const oemLabel = legCtrl || "Factory OEM Microprocessor";
    expanders = 0;
    ctrlVa = 6.0;
    alcHw = `OEM BACnet Hybrid Overlay (RFI-23-001) — Keep ${oemLabel} + Hardwired Start/Stop DO, Fault DI & Safety Interlock`;
    strategyNote = "CSC Hybrid Overlay (RFI-23-001): Do NOT gut factory OEM controller. Hardwire Master Enable DO, Common Fault DI & DPDT Freeze/Smoke safety loop; write DAT/Static resets via BACnet MS/TP or IP (Priority 8/10).";
  } else if (strategy === "VFD_HARDWIRED_SPLIT") {
    expanders = 0;
    ctrlVa = 0.0;
    alcHw = "Hardwired VFD Control from Parent AHU/Plant ALC Controller (DO Start/Stop, 0-10V Speed AO, DI Run/Fault) + Read-Only BACnet MS/TP (RFI-23-006)";
    strategyNote = "CSC VFD Standard (RFI-23-006): Command Start/Stop, Speed Reference & Safety Interlock via hardwired I/O on parent ALC controller so local HOA keypad works deterministically; configure VFD BACnet as Read-Only telemetry.";
  } else if (arch === "VAV_TERMINAL" && totalIn <= 4 && bo <= 3 && ao <= 2) {
    alcHw = "ALC ZN341v Integrated VAV Controller (Integral Actuator + DP Pickup)";
    expanders = 0;
    ctrlVa = 12.0;
    strategyNote = "Full ALC DDC Replacement: Native BACnet MS/TP VAV controller with integral damper actuator and velocity pressure transducer.";
  } else if (totalIn <= 5 && bo <= 5 && ao <= 3) {
    alcHw = "ALC ZN551 Unitary Equipment Controller (5 UI / 5 BO / 3 AO)";
    expanders = 0;
    ctrlVa = 12.0;
    strategyNote = "Full ALC DDC Replacement: Unitary BACnet controller sized to point tally.";
  } else {
    const remIn = Math.max(0, totalIn - 16);
    const remOut = Math.max(0, totalOut - 12);
    expanders = Math.max(Math.ceil(remIn / 8.0), Math.ceil(remOut / 8.0));
    alcHw = expanders > 0
      ? `ALC OptiFlex OF1628 + (${expanders}) FIO-812 I/O Expander(s)`
      : "ALC OptiFlex OF1628 Advanced Equipment Controller";
    ctrlVa = 24.0 + expanders * 14.0;
    strategyNote = "Full ALC DDC Replacement: Plant/AHU BACnet controller sized with 15% spare I/O capacity.";
  }

  let sensorStatus = "FIELD_VERIFY";
  let sensorNote = "Verify existing sensor resistance @ 77°F (10,000 Ohms = 10k Type II).";
  if (curve.includes("10K_TYPE_II") || curve.includes("RNET")) {
    sensorStatus = "COMPATIBLE_REUSE_OR_STANDARD";
    sensorNote = "Native ALC 10k Type II / Rnet curve — direct termination on ALC Universal Inputs.";
  } else if (curve.includes("10K_TYPE_III") || curve.includes("20K")) {
    sensorStatus = "CUSTOM_LINER_TABLE_OR_REPLACE";
    sensorNote = `Legacy ${thermistorCurve} NTC curve: Load custom resistance liner table in WebCTRL® or replace accessible sensors w/ ALC 10k Type II.`;
  } else if (curve.includes("1K_NI") || curve.includes("NICKEL") || curve.includes("PNEUMATIC")) {
    sensorStatus = "REPLACE_SENSORS_REQUIRED";
    sensorNote = `Incompatible ${thermistorCurve} sensor: Price new ALC 10k Type II duct/immersion sensors + verify existing thermowell bore (RFI-23-005).`;
  } else if (curve.includes("1K_PT") || curve.includes("PLATINUM")) {
    sensorStatus = "VERIFY_RTD_INPUT_RANGE";
    sensorNote = "1k Ohm Platinum RTD: Supported on OptiFlex UI (1k RTD mode) — field verify 375 vs 385 alpha calibration.";
  }

  return {
    ui_count: ui,
    bi_count: bi,
    bo_count: bo,
    ao_count: ao,
    total_io_points: totalIn + totalOut,
    integration_strategy: strategy,
    strategy_rfi_note: strategyNote,
    recommended_alc_controller: alcHw,
    required_io_expanders: expanders,
    controller_va_load: ctrlVa,
    thermistor_curve: thermistorCurve || "10k_TYPE_II",
    sensor_reuse_status: sensorStatus,
    sensor_engineering_note: sensorNote
  };
}

function calculateFieldValveSizingJS(flowGpm, pipeLineSizeIn, fluidType, coilDpPsi, designValveDpPsi, application, usePiccv) {
  const gpm = Math.max(parseFloat(flowGpm) || 0.1, 0.1);
  const dpV = Math.max(parseFloat(designValveDpPsi) || 4.5, 1.0);
  const dpC = Math.max(parseFloat(coilDpPsi) || 4.0, 0.5);
  const sg = FLUID_SPECIFIC_GRAVITY[fluidType] || 1.000;
  const appMode = String(application || "heating").toLowerCase();
  const isHeatingFailOpen = /(heat|preheat|fail_open|freeze)/.test(appMode);

  const theoCv = gpm * Math.sqrt(sg / dpV);
  let selected = COMMERCIAL_BELIMO_VALVES[COMMERCIAL_BELIMO_VALVES.length - 1];
  for (const cand of COMMERCIAL_BELIMO_VALVES) {
    if (cand.cv >= theoCv) {
      selected = cand;
      break;
    }
  }

  const actualDpV = sg * Math.pow(gpm / selected.cv, 2);
  const authorityBeta = actualDpV / (actualDpV + dpC);
  const valveSz = selected.valve_size_in;
  const lineSz = parseFloat(pipeLineSizeIn) || valveSz;
  const needsReducer = valveSz < lineSz;
  const actuatorCode = isHeatingFailOpen ? selected.heat_sr_act : selected.cool_act;
  const actuatorVa = isHeatingFailOpen ? 7.0 : 3.0;

  let piccvRec = "";
  if (usePiccv || authorityBeta < 0.50) {
    const piccvSuffix = isHeatingFailOpen ? ` (w/ ${selected.heat_sr_act} Fail-Open SR)` : "";
    piccvRec = `Belimo PICCV ${selected.piccv}${piccvSuffix}`;
  }

  const primaryModel = usePiccv
    ? piccvRec
    : `Belimo ${selected.body} + ${actuatorCode}${isHeatingFailOpen ? " (Fail-Open Spring-Return per RFI-23-007)" : ""}`;

  return {
    flow_gpm: Number(gpm.toFixed(2)),
    pipe_line_size_in: lineSz,
    fluid_type: fluidType,
    coil_dp_psi: dpC,
    design_valve_dp_psi: dpV,
    application: isHeatingFailOpen ? "HEATING_FAIL_OPEN_SR" : "COOLING_MODULATING",
    specific_gravity: sg,
    theoretical_cv: Number(theoCv.toFixed(2)),
    selected_commercial_cv: selected.cv,
    selected_valve_size_in: valveSz,
    actual_valve_dp_psi: Number(actualDpV.toFixed(2)),
    valve_authority_beta: Number(authorityBeta.toFixed(2)),
    authority_compliant: authorityBeta >= 0.50 || Boolean(usePiccv),
    recommended_belimo_model: primaryModel,
    piccv_alternative: piccvRec,
    actuator_va_load: actuatorVa,
    spring_return_required: isHeatingFailOpen,
    concentric_reducer_required: needsReducer,
    use_piccv: Boolean(usePiccv),
    rfi_23_005_piping_note: needsReducer
      ? `Div 23 21 13 (Hydronic Piping) to install ${lineSz}" x ${valveSz}" concentric pipe reducers and inline valve body per RFI-23-005.`
      : `Line-sized ${valveSz}" valve body installed inline by Div 23 21 13 per RFI-23-005.`
  };
}

function calculateDamperActuatorSizingJS(widthIn, heightIn, application, velocityFpm) {
  const w = Math.max(parseFloat(widthIn) || 24.0, 6.0);
  const h = Math.max(parseFloat(heightIn) || 18.0, 6.0);
  const vel = parseFloat(velocityFpm) || 1200.0;
  const areaSqft = Number(((w * h) / 144.0).toFixed(2));
  const torquePerSqft = vel > 1500.0 ? 7.0 : 5.0;
  const reqTorque = Number((areaSqft * torquePerSqft).toFixed(1));
  const isSpring = !String(application || "OA_EA_FAIL_SAFE").toUpperCase().includes("RA");

  let qty = 1;
  let model = "";
  let unitTrq = 90;
  let vaEa = 7.0;

  if (isSpring) {
    if (reqTorque <= 22) {
      qty = 1; model = "Belimo TF24-SR (22 in-lb Spring-Return)"; unitTrq = 22; vaEa = 5.0;
    } else if (reqTorque <= 35) {
      qty = 1; model = "Belimo LF24-SR (35 in-lb Spring-Return)"; unitTrq = 35; vaEa = 7.0;
    } else if (reqTorque <= 90) {
      qty = 1; model = "Belimo NFB24-SR (90 in-lb Spring-Return)"; unitTrq = 90; vaEa = 7.0;
    } else {
      qty = Math.max(1, Math.ceil(reqTorque / 180.0));
      model = "Belimo AFB24-SR (180 in-lb Spring-Return)"; unitTrq = 180; vaEa = 10.0;
    }
  } else {
    if (reqTorque <= 45) {
      qty = 1; model = "Belimo LMB24-SR (45 in-lb Non-Spring)"; unitTrq = 45; vaEa = 3.0;
    } else if (reqTorque <= 90) {
      qty = 1; model = "Belimo NMB24-SR (90 in-lb Non-Spring)"; unitTrq = 90; vaEa = 4.0;
    } else {
      qty = Math.max(1, Math.ceil(reqTorque / 360.0));
      model = "Belimo GMB24-SR (360 in-lb Non-Spring)"; unitTrq = 360; vaEa = 7.0;
    }
  }

  return {
    width_in: w,
    height_in: h,
    area_sqft: areaSqft,
    velocity_fpm: vel,
    application: application || "OA_EA_FAIL_SAFE",
    torque_factor_in_lb_sqft: torquePerSqft,
    required_torque_in_lb: reqTorque,
    actuator_qty: qty,
    recommended_belimo_actuator: `(${qty}) ${model}`,
    total_rated_torque_in_lb: qty * unitTrq,
    spring_return_fail_safe: isSpring,
    total_va_load: Number((qty * vaEa).toFixed(1)),
    rfi_23_004_note: `CSC furnishes automatic control damper (${w}"x${h}", ${areaSqft} sq.ft.) for Div 23 33 00 Sheet Metal duct installation; CSC mounts & wires (${qty}) ${model} per RFI-23-004.`
  };
}

function calculateLaborDifficultyMultiplierJS(ceilingFactor, wallFactor, shiftFactor) {
  const cf = parseFloat(ceilingFactor) || 1.0;
  const wf = parseFloat(wallFactor) || 1.0;
  const sf = parseFloat(shiftFactor) || 1.0;
  const excess = (cf - 1.0) + (wf - 1.0) + (sf - 1.0);
  const composite = Number((1.0 + Math.max(0.0, excess)).toFixed(2));
  let riskTier = "STANDARD (1.00x)";
  if (composite >= 1.50) {
    riskTier = `HIGH FRICTION (${composite.toFixed(2)}x — Add Lift/Raceway/Shift Allowance)`;
  } else if (composite > 1.10) {
    riskTier = `MODERATE FRICTION (${composite.toFixed(2)}x — Adjust Rough-In Hours)`;
  }
  return {
    ceiling_factor: Number(cf.toFixed(2)),
    wall_factor: Number(wf.toFixed(2)),
    shift_factor: Number(sf.toFixed(2)),
    composite_multiplier: composite,
    risk_tier: riskTier
  };
}

function calculateTcpPanelVaLoadJS(optiCount, expCount, srCount, nsrCount, rnetCount, znCount) {
  const ctrlVa =
    (parseInt(optiCount, 10) || 0) * VA_LOAD_CONSTANTS.optiflex_controller_va +
    (parseInt(znCount, 10) || 0) * VA_LOAD_CONSTANTS.zn_unitary_vav_va +
    (parseInt(expCount, 10) || 0) * VA_LOAD_CONSTANTS.io_expander_va;
  const actVa =
    (parseInt(srCount, 10) || 0) * VA_LOAD_CONSTANTS.spring_return_actuator_va +
    (parseInt(nsrCount, 10) || 0) * VA_LOAD_CONSTANTS.non_spring_actuator_va +
    (parseInt(rnetCount, 10) || 0) * VA_LOAD_CONSTANTS.rnet_zone_sensor_va;
  const subtotalVa = ctrlVa + actVa;
  const totalWith15Pct = Number((subtotalVa * 1.15).toFixed(1));
  const maxContPer100Va = 80.0;
  const xfmrCount = Math.max(1, Math.ceil(totalWith15Pct / maxContPer100Va));
  const utilPct = Number(((totalWith15Pct / (xfmrCount * 100.0)) * 100.0).toFixed(1));

  return {
    controllers_va: Number(ctrlVa.toFixed(1)),
    field_devices_va: Number(actVa.toFixed(1)),
    subtotal_va: Number(subtotalVa.toFixed(1)),
    total_with_15pct_spare_va: totalWith15Pct,
    nec_art725_max_per_100va: maxContPer100Va,
    required_100va_transformers: xfmrCount,
    derated_utilization_pct: utilPct,
    rfi_23_009_callout: `Furnish (${xfmrCount}) 100VA 120/24VAC Class 2 fused transformer(s) (${totalWith15Pct} VA design load vs ${xfmrCount * 80} VA max continuous @ 80% NEC Art. 725 derating). Div 26 to provide dedicated 120VAC 15A branch circuit per RFI-23-009.`
  };
}

// ============================================================================
// WORKBENCH STATE & NORMALIZER
// ============================================================================
let wbWalk = null;
let wbActiveStationId = "";
let wbActiveFilter = "ALL";
let wbManualTcpOverride = null;
let wbServerConnected = false;
let wbActiveFolder = "";
let wbLastServerMtime = 0;

function showWbToast(htmlMsg, isWarn = false) {
  const el = document.getElementById("wbToast");
  if (!el) return;
  el.style.display = "block";
  el.style.borderColor = isWarn ? "var(--accent-amber)" : "var(--accent-teal)";
  el.innerHTML = htmlMsg;
  clearTimeout(window._wbToastTimer);
  window._wbToastTimer = setTimeout(() => {
    el.style.display = "none";
  }, 5500);
}

function isStationOverridden(st) {
  const ov = st && st.saved_sizing && st.saved_sizing.manual_overrides;
  if (!ov) return false;
  return Boolean(ov.io || ov.valve || ov.damper || ov.labor || ov.meta);
}

function setWorkbenchUnitFilter(filterKey) {
  wbActiveFilter = filterKey || "ALL";
  renderWorkbenchAll(false);
}

function _inferDefaultSizingForStation(st) {
  const arch = String(st.archetype_id || st.archetype || "RTU_AHU").toUpperCase();
  const np = st.nameplate_data || {};
  const bas = st.bas_overlay_profile || {};
  const checks = st.checklist_selections || st.checks || {};
  const qIssues = (st.quick_issues || st.quickIssues || []).map((x) => String(x).toUpperCase());
  const saved = st.saved_sizing || st.savedSizing || {};

  const defIo = DEFAULT_IO_BY_ARCHETYPE[arch] || { ui: 4, bi: 2, bo: 2, ao: 2 };
  const rawIo = (saved.io_inputs) || (bas.io_tally) || st.ioTally || defIo;
  const curve = (saved.io_inputs && saved.io_inputs.thermistor_curve) || bas.thermistor_curve || st.thermistorCurve || "10k_TYPE_II";
  const strategy = (saved.io_inputs && saved.io_inputs.integration_strategy) || _inferDefaultStrategyForStation(st);

  // Infer Valve defaults
  const elecOrNote = `${np.voltage_phase_hz || ""} ${st.elec || ""} ${st.tier_delta_note || st.tierDelta || ""}`.toUpperCase();
  let hasValve = arch === "HYDRONIC_VALVE_PUMP" || arch === "CHILLER_BOILER_PLANT";
  if (arch === "VAV_TERMINAL" && (String(checks["CHK-VAV-02"] || "").toUpperCase().includes("HOT WATER") || String(np.model_number || st.model || "").toUpperCase().includes("HW") || elecOrNote.includes("GPM"))) {
    hasValve = true;
  } else if (arch === "RTU_AHU" && (st.valve_sizing_calc || np.hw_coil_gpm || (checks["CHK-AHU-02"] && !String(checks["CHK-AHU-02"]).includes("N/A")))) {
    hasValve = true;
  }
  if (qIssues.some((q) => q.includes("VALVE"))) hasValve = true;

  let gpm = parseFloat(np.hw_coil_gpm || np.chw_coil_gpm || 0);
  if (!gpm) {
    const mGpm = elecOrNote.match(/(\d+(?:\.\d+)?)\s*GPM/);
    if (mGpm) gpm = parseFloat(mGpm[1]);
  }
  if (!gpm) {
    gpm = arch === "VAV_TERMINAL" ? 3.5 : (arch === "CHILLER_BOILER_PLANT" ? 85.0 : 42.0);
  }
  const defLine = arch === "VAV_TERMINAL" || gpm <= 5 ? 0.75 : (arch === "CHILLER_BOILER_PLANT" || gpm >= 60 ? 2.5 : 2.0);
  const defFluid = arch === "VAV_TERMINAL" ? "100% Water" : "30% Propylene Glycol";
  const defCoilDp = arch === "VAV_TERMINAL" ? 2.5 : 3.5;

  const vIn = Object.assign({
    enabled: hasValve,
    flow_gpm: gpm,
    pipe_line_size_in: defLine,
    fluid_type: defFluid,
    coil_dp_psi: defCoilDp,
    design_valve_dp_psi: 4.5,
    application: "heating",
    use_piccv: false
  }, saved.valve_inputs || {});

  const dIn = Object.assign({
    enabled: arch === "RTU_AHU" || qIssues.some((q) => q.includes("DAMPER")),
    width_in: arch === "RTU_AHU" ? 48.0 : 24.0,
    height_in: arch === "RTU_AHU" ? 30.0 : 18.0,
    application: "OA_EA_FAIL_SAFE",
    velocity_fpm: 1200.0
  }, saved.damper_inputs || {});

  const acc = st.access_labor_factors || {};
  let defCeil = parseFloat(acc.ceiling_factor || 1.0);
  let defWall = parseFloat(acc.wall_factor || 1.0);
  let defShift = parseFloat(acc.shift_factor || 1.0);
  if (defCeil === 1.0 && defWall === 1.0 && defShift === 1.0) {
    if (String(acc.ceiling_type || "").toUpperCase().includes("TIGHT")) defCeil = 1.15;
    if (String(acc.wall_surface || "").toUpperCase().includes("WIREMOLD") || elecOrNote.includes("WIREMOLD")) defWall = 1.40;
    if (String(acc.shift_access || "").toUpperCase().includes("2ND SHIFT")) defShift = 1.30;
  }

  const lIn = Object.assign({
    ceiling_factor: defCeil,
    wall_factor: defWall,
    shift_factor: defShift
  }, saved.labor_inputs || {});

  const mOv = Object.assign({
    io: false,
    valve: false,
    damper: false,
    labor: false,
    meta: false
  }, saved.manual_overrides || {});

  st.saved_sizing = {
    io_inputs: {
      ui: parseInt(rawIo.ui ?? defIo.ui, 10),
      bi: parseInt(rawIo.bi ?? defIo.bi, 10),
      bo: parseInt(rawIo.bo ?? defIo.bo, 10),
      ao: parseInt(rawIo.ao ?? defIo.ao, 10),
      thermistor_curve: curve,
      integration_strategy: strategy
    },
    valve_inputs: vIn,
    damper_inputs: dIn,
    labor_inputs: lIn,
    manual_overrides: mOv
  };
}

function normalizeWalkForWorkbench(raw) {
  if (!raw) return null;
  const copy = JSON.parse(JSON.stringify(raw));

  // Support both snake_case (`equipment_stations`) and camelCase (`stations`)
  if (!Array.isArray(copy.equipment_stations) && Array.isArray(copy.stations)) {
    copy.walk_meta = {
      session_id: copy.sessionId || "CSC-WALK",
      project_name: copy.projectName || "CSC Site Discovery Walk",
      csc_job_number: copy.jobNumber || "CSC-26-WALK",
      walk_date: copy.walkDate || new Date().toISOString().slice(0, 10),
      lead_engineer: copy.leadEngineer || "Andrew Nicks — Control Service Company (CSC)",
      site_address: copy.siteAddress || ""
    };
    copy.equipment_stations = copy.stations.map((s) => ({
      station_id: s.id || s.station_id || "STN-01",
      equipment_tag: s.tag || s.equipment_tag || "Unit",
      archetype_id: s.archetype || s.archetype_id || "RTU_AHU",
      floor_id: s.floorId || s.floor_id || "FLR-01",
      room_zone: s.room || s.room_zone || "",
      condition: String(s.condition || "GOOD").toUpperCase(),
      quick_issues: s.quickIssues || s.quick_issues || [],
      user_note: s.userNote || s.user_note || "",
      photo_data_urls: s.photo_data_urls || [],
      scheduled_qty: parseInt(s.scheduledQty ?? s.scheduled_qty ?? 1, 10),
      observed_qty: parseInt(s.observedQty ?? s.observed_qty ?? 1, 10),
      nameplate_data: {
        manufacturer: s.mfg || (s.nameplate_data && s.nameplate_data.manufacturer) || "",
        model_number: s.model || (s.nameplate_data && s.nameplate_data.model_number) || "",
        serial_number: s.serial || (s.nameplate_data && s.nameplate_data.serial_number) || "",
        voltage_phase_hz: s.elec || (s.nameplate_data && s.nameplate_data.voltage_phase_hz) || "",
        legacy_controller_found: s.legacyCtrl || (s.nameplate_data && s.nameplate_data.legacy_controller_found) || "",
        recommended_alc_replacement: s.alcTarget || (s.nameplate_data && s.nameplate_data.recommended_alc_replacement) || ""
      },
      bas_overlay_profile: {
        thermistor_curve: s.thermistorCurve || "10k_TYPE_II",
        io_tally: s.ioTally || { ui: 4, bi: 2, bo: 2, ao: 2 },
        parent_panel: s.parentPanel || "",
        served_by: s.servedBy || "",
        mstp_mac_baud: s.mstpMac || ""
      },
      checklist_selections: s.checks || {},
      access_labor_factors: { composite_multiplier: 1.0 },
      saved_sizing: s.savedSizing || s.saved_sizing || {},
      tier_delta_note: s.tierDelta || s.userNote || "",
      sharpness_score: s.sharpnessScore ?? s.sharpness_score ?? null,
      is_blurry: Boolean(s.isBlurry ?? s.is_blurry ?? false),
      barcode_detected: s.barcodeDetected || s.barcode_detected || "",
      burst_meta: s.burstMeta || s.burst_meta || {}
    }));
    copy.site_pro_audio_segments = (copy.audioSegments || []).map((a) => ({
      seg_id: a.id || "AUD-01",
      timestamp_range: a.time || "",
      speaker: a.speaker || "Field Tech",
      linked_station_id: a.stationId || "SITE-GENERAL",
      transcript_text: a.text || "",
      extracted_insight: a.insight || ""
    }));
  }

  (copy.equipment_stations || []).forEach((st) => {
    _inferDefaultSizingForStation(st);
  });

  return copy;
}

function getActiveWbStation() {
  if (!wbWalk || !Array.isArray(wbWalk.equipment_stations)) return null;
  return wbWalk.equipment_stations.find((s) => s.station_id === wbActiveStationId) || wbWalk.equipment_stations[0] || null;
}

function recomputeAllStationsInWorkbench() {
  if (!wbWalk || !Array.isArray(wbWalk.equipment_stations)) return null;

  let optiCount = 0;
  let znCount = 0;
  let expCount = 0;
  let srCount = 0;
  let nsrCount = 0;
  let rnetCount = 0;

  for (const st of wbWalk.equipment_stations) {
    _inferDefaultSizingForStation(st);
    const sz = st.saved_sizing;
    const np = st.nameplate_data || {};
    const arch = st.archetype_id || "RTU_AHU";
    const obsQty = Math.max(1, parseInt(st.observed_qty ?? 1, 10));

    const serialAudit = decodeSerialDeterministic(np.manufacturer, np.serial_number, arch, np.model_number);
    const modelAudit = decodeModelDeterministic(np.manufacturer, np.model_number);
    const boardRef = lookupBoardRefJS(np.manufacturer, np.model_number, np.legacy_controller_found);

    const ioCalc = recommendAlcControllerFromIoJS(
      sz.io_inputs.ui,
      sz.io_inputs.bi,
      sz.io_inputs.bo,
      sz.io_inputs.ao,
      arch,
      sz.io_inputs.thermistor_curve,
      sz.io_inputs.integration_strategy,
      np.legacy_controller_found
    );
    const existingRepl = String(np.recommended_alc_replacement || "").trim();
    if (ioCalc.integration_strategy === "FULL_ALC_DDC" || !existingRepl || Boolean(sz.manual_overrides?.io)) {
      np.recommended_alc_replacement = ioCalc.recommended_alc_controller;
    }
    st.bas_overlay_profile = st.bas_overlay_profile || {};
    st.bas_overlay_profile.io_tally = {
      ui: ioCalc.ui_count,
      bi: ioCalc.bi_count,
      bo: ioCalc.bo_count,
      ao: ioCalc.ao_count
    };
    st.bas_overlay_profile.thermistor_curve = ioCalc.thermistor_curve;

    const valveCalc = calculateFieldValveSizingJS(
      sz.valve_inputs.flow_gpm,
      sz.valve_inputs.pipe_line_size_in,
      sz.valve_inputs.fluid_type,
      sz.valve_inputs.coil_dp_psi,
      sz.valve_inputs.design_valve_dp_psi,
      sz.valve_inputs.application,
      sz.valve_inputs.use_piccv
    );
    valveCalc.enabled = Boolean(sz.valve_inputs.enabled);

    const damperCalc = calculateDamperActuatorSizingJS(
      sz.damper_inputs.width_in,
      sz.damper_inputs.height_in,
      sz.damper_inputs.application,
      sz.damper_inputs.velocity_fpm
    );
    damperCalc.enabled = Boolean(sz.damper_inputs.enabled);

    const laborCalc = calculateLaborDifficultyMultiplierJS(
      sz.labor_inputs.ceiling_factor,
      sz.labor_inputs.wall_factor,
      sz.labor_inputs.shift_factor
    );
    st.access_labor_factors = Object.assign(st.access_labor_factors || {}, laborCalc);

    st.engineering_computations = {
      station_id: st.station_id,
      equipment_tag: st.equipment_tag,
      archetype_id: arch,
      observed_qty: obsQty,
      serial_audit: serialAudit,
      model_audit: modelAudit,
      board_reference: boardRef,
      io_controller_sizing: ioCalc,
      valve_sizing: valveCalc,
      damper_sizing: damperCalc,
      labor_sizing: laborCalc
    };

    const recCtrl = ioCalc.recommended_alc_controller;
    if (arch !== "VFD_STARTER" && arch !== "ZONE_SENSOR" && ioCalc.integration_strategy !== "VFD_HARDWIRED_SPLIT") {
      if (recCtrl.includes("OptiFlex")) {
        optiCount += obsQty;
        expCount += (ioCalc.required_io_expanders || 0) * obsQty;
      } else if (recCtrl.includes("ZN341v") || recCtrl.includes("ZN551")) {
        znCount += obsQty;
      }
    }
    if (arch === "RTU_AHU" || arch === "VAV_TERMINAL" || arch === "ZONE_SENSOR") {
      rnetCount += obsQty;
    }
    if (valveCalc.enabled) {
      if (valveCalc.spring_return_required) srCount += obsQty;
      else nsrCount += obsQty;
    }
    if (damperCalc.enabled) {
      const actQ = (damperCalc.actuator_qty || 1) * obsQty;
      if (damperCalc.spring_return_fail_safe) srCount += actQ;
      else nsrCount += actQ;
    }
  }

  const counts = wbManualTcpOverride || {
    alc_controllers_count: Math.max(1, optiCount),
    zn_vav_controllers_count: znCount,
    io_expanders_count: expCount,
    spring_return_actuators_count: srCount,
    non_spring_actuators_count: nsrCount,
    rnet_zone_sensors_count: rnetCount
  };
  if (wbManualTcpOverride) {
    wbWalk.tcp_va_overrides = counts;
  } else {
    delete wbWalk.tcp_va_overrides;
  }

  const tcpRollup = calculateTcpPanelVaLoadJS(
    counts.alc_controllers_count,
    counts.io_expanders_count,
    counts.spring_return_actuators_count,
    counts.non_spring_actuators_count,
    counts.rnet_zone_sensors_count,
    counts.zn_vav_controllers_count
  );
  tcpRollup.counts = counts;

  wbWalk.companion_engineering_rollup = {
    engine_version: "CSC-COMPANION-COMPUTE-v3.3.0",
    tcp_panel_va_sizing: tcpRollup
  };
  return tcpRollup;
}

// ============================================================================
// UI RENDERING
// ============================================================================
function renderWorkbenchAll(populateFormInputs = true) {
  if (!wbWalk) return;
  const tcpRollup = recomputeAllStationsInWorkbench();
  const meta = wbWalk.walk_meta || {};

  document.getElementById("wbMetaProject").textContent = meta.project_name || "CSC Field Walk";
  document.getElementById("wbMetaJob").textContent = meta.csc_job_number || "CSC-26-WALK";
  document.getElementById("wbMetaDate").textContent = meta.walk_date || "";
  document.getElementById("wbMetaEngineer").textContent = meta.lead_engineer || "";

  const stations = wbWalk.equipment_stations || [];
  document.getElementById("wbUnitCount").textContent = String(stations.length);

  if (!wbActiveStationId && stations.length > 0) {
    wbActiveStationId = stations[0].station_id;
  }

  // Update filter pill counts & active state
  const isAlertUnit = (s) => {
    const c = String(s.condition || "GOOD").toUpperCase();
    return c === "REPLACE" || c === "CAUTION" || Boolean(s.engineering_computations?.serial_audit?.eol);
  };
  const isDeltaUnit = (s) => {
    return parseInt(s.observed_qty ?? 1, 10) !== parseInt(s.scheduled_qty ?? 1, 10);
  };
  const alertStations = stations.filter(isAlertUnit);
  const deltaStations = stations.filter(isDeltaUnit);
  const overriddenStations = stations.filter((s) => isStationOverridden(s));

  const updateFilterPill = (id, key, labelText) => {
    const el = document.getElementById(id) || document.querySelector(`#wbUnitFilterBar [data-filter="${key}"]`);
    if (!el) return;
    el.textContent = labelText;
    el.classList.toggle("active", wbActiveFilter === key);
  };
  updateFilterPill("wbFilterAll", "ALL", `All (${stations.length})`);
  updateFilterPill("wbFilterAlert", "CONDITION_ALERT", `🔴 Replace/Caution (${alertStations.length})`);
  updateFilterPill("wbFilterDelta", "QTY_DELTA", `⚠️ Qty Delta (${deltaStations.length})`);
  updateFilterPill("wbFilterOverridden", "OVERRIDDEN", `✏️ Overridden (${overriddenStations.length})`);

  const filteredStations = stations.filter((s) => {
    if (wbActiveFilter === "CONDITION_ALERT") {
      return isAlertUnit(s);
    }
    if (wbActiveFilter === "QTY_DELTA") {
      return isDeltaUnit(s);
    }
    if (wbActiveFilter === "OVERRIDDEN") {
      return isStationOverridden(s);
    }
    return true;
  });

  // Render Left Unit List
  const listEl = document.getElementById("wbUnitList");
  if (filteredStations.length === 0) {
    listEl.innerHTML = `<div style="padding:12px;font-size:11.5px;color:var(--text-muted);text-align:center;">No units match filter <code>${escapeHtml(wbActiveFilter)}</code>.</div>`;
  } else {
    listEl.innerHTML = filteredStations.map((st) => {
      const idx = stations.indexOf(st);
      const comp = st.engineering_computations || {};
      const sa = comp.serial_audit || {};
      const ma = comp.model_audit || {};
      const cond = String(st.condition || "GOOD").toUpperCase();
      const condCls = cond === "REPLACE" ? "pill-replace" : (cond === "CAUTION" ? "pill-caution" : "pill-good");
      const isAct = st.station_id === wbActiveStationId;
      const obsQ = parseInt(st.observed_qty ?? 1, 10);
      const schedQ = parseInt(st.scheduled_qty ?? 1, 10);
      const hasOver = isStationOverridden(st);
      const strat = comp.io_controller_sizing?.integration_strategy || "FULL_ALC_DDC";
      const shortCtrl = strat === "HYBRID_OVERLAY"
        ? "OEM Hybrid Overlay (RFI-23-001)"
        : (strat === "VFD_HARDWIRED_SPLIT"
          ? "Hardwired VFD Split (RFI-23-006)"
          : (comp.io_controller_sizing?.recommended_alc_controller || "").split("(")[0].replace("ALC ", "").trim());
      return `
        <div class="unit-item ${isAct ? 'active' : ''}" onclick="selectWorkbenchStation('${escapeHtml(st.station_id)}')">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <strong>#${idx + 1}: ${escapeHtml(st.equipment_tag || st.station_id)}</strong>
            <span class="pill ${condCls}">${escapeHtml(cond)}</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">
            📍 ${escapeHtml(st.room_zone || st.floor_id || "")} &nbsp;•&nbsp; Qty: <strong>${obsQ}</strong>${obsQ !== schedQ ? ` <span style="color:var(--accent-amber);">(Sched: ${schedQ})</span>` : ""}
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px;">
            ${hasOver ? `<span class="pill pill-override">✏️ OVERRIDDEN</span>` : ""}
            ${obsQ !== schedQ ? `<span class="pill pill-caution">⚠️ Qty ${obsQ} vs ${schedQ}</span>` : ""}
            ${sa.year ? `<span class="pill ${sa.eol ? 'pill-caution' : 'pill-info'}">📅 ${sa.year} (${sa.age} yr${sa.eol ? ' EOL' : ''})</span>` : ""}
            ${ma.a2lFlag ? `<span class="pill pill-replace">❄️ A2L R-454B/R-32</span>` : ""}
            <span class="pill pill-info">⚡ ${escapeHtml(shortCtrl)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  const activeSt = getActiveWbStation();
  if (activeSt) {
    if (populateFormInputs) {
      populateActiveStationInputs(activeSt);
    }
    renderActiveStationResults(activeSt);
    renderActiveStationMedia(activeSt);
  }

  renderTcpAndBomRollup(tcpRollup, populateFormInputs);
}

function selectWorkbenchStation(stationId) {
  wbActiveStationId = stationId;
  renderWorkbenchAll(true);
}

function populateActiveStationInputs(st) {
  const np = st.nameplate_data || {};
  const bas = st.bas_overlay_profile || {};
  const sz = st.saved_sizing || {};
  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.value = v ?? "";
  };

  setVal("inpUnitTag", st.equipment_tag || st.station_id);
  setVal("inpUnitArch", st.archetype_id || "RTU_AHU");
  setVal("inpUnitCondition", String(st.condition || "GOOD").toUpperCase());
  setVal("inpUnitRoom", st.room_zone || "");
  setVal("inpObsQty", st.observed_qty ?? 1);
  setVal("inpSchedQty", st.scheduled_qty ?? 1);
  setVal("inpUnitElec", np.voltage_phase_hz || "");
  setVal("inpUnitMfg", np.manufacturer || "");
  setVal("inpUnitModel", np.model_number || "");
  setVal("inpUnitSerial", np.serial_number || "");
  setVal("inpUnitLegacy", np.legacy_controller_found || "");
  setVal("inpUnitUserNote", st.user_note || "");
  setVal("inpUnitTierDelta", st.tier_delta_note || "");

  setVal("inpIoStrategy", sz.io_inputs.integration_strategy || _inferDefaultStrategyForStation(st));
  setVal("inpIoUi", sz.io_inputs.ui);
  setVal("inpIoBi", sz.io_inputs.bi);
  setVal("inpIoBo", sz.io_inputs.bo);
  setVal("inpIoAo", sz.io_inputs.ao);
  setVal("inpIoCurve", sz.io_inputs.thermistor_curve || "10k_TYPE_II");
  setVal("inpParentPanel", bas.parent_panel || "");
  setVal("inpMstpMac", bas.mstp_mac_baud || "");

  document.getElementById("chkValveEnable").checked = Boolean(sz.valve_inputs.enabled);
  setVal("inpValveGpm", sz.valve_inputs.flow_gpm);
  setVal("inpValvePipeIn", String(sz.valve_inputs.pipe_line_size_in));
  setVal("inpValveFluid", sz.valve_inputs.fluid_type || "30% Propylene Glycol");
  setVal("inpValveCoilDp", sz.valve_inputs.coil_dp_psi);
  setVal("inpValveDesignDp", sz.valve_inputs.design_valve_dp_psi);
  setVal("inpValveApp", String(sz.valve_inputs.application || "heating").toLowerCase().includes("cool") ? "cooling" : "heating");
  document.getElementById("chkValvePiccv").checked = Boolean(sz.valve_inputs.use_piccv);

  document.getElementById("chkDamperEnable").checked = Boolean(sz.damper_inputs.enabled);
  setVal("inpDmpWidth", sz.damper_inputs.width_in);
  setVal("inpDmpHeight", sz.damper_inputs.height_in);
  setVal("inpDmpApp", sz.damper_inputs.application || "OA_EA_FAIL_SAFE");
  setVal("inpDmpVel", sz.damper_inputs.velocity_fpm);

  setVal("inpLabCeiling", String(sz.labor_inputs.ceiling_factor || 1.0));
  setVal("inpLabWall", String(sz.labor_inputs.wall_factor || 1.0));
  setVal("inpLabShift", String(sz.labor_inputs.shift_factor || 1.0));
}

function onUnitMetaEdit() {
  const st = getActiveWbStation();
  if (!st) return;
  const oldArch = String(st.archetype_id || "RTU_AHU").toUpperCase();
  const newArch = String(document.getElementById("inpUnitArch").value || "RTU_AHU").toUpperCase();
  const archChanged = oldArch !== newArch;
  const oldLegacy = String(st.nameplate_data?.legacy_controller_found || "").trim();
  const newLegacy = String(document.getElementById("inpUnitLegacy").value || "").trim();
  const legacyChanged = oldLegacy !== newLegacy;

  st.equipment_tag = document.getElementById("inpUnitTag").value;
  st.archetype_id = newArch;
  const condEl = document.getElementById("inpUnitCondition");
  if (condEl) {
    st.condition = String(condEl.value || "GOOD").toUpperCase();
  }
  st.room_zone = document.getElementById("inpUnitRoom").value;
  st.scheduled_qty = Math.max(0, parseInt(document.getElementById("inpSchedQty").value, 10) || 0);
  const userNoteEl = document.getElementById("inpUnitUserNote");
  if (userNoteEl) st.user_note = userNoteEl.value;
  const tierDeltaEl = document.getElementById("inpUnitTierDelta");
  if (tierDeltaEl) st.tier_delta_note = tierDeltaEl.value;

  st.nameplate_data = st.nameplate_data || {};
  const elecEl = document.getElementById("inpUnitElec");
  if (elecEl) st.nameplate_data.voltage_phase_hz = elecEl.value;
  st.nameplate_data.manufacturer = document.getElementById("inpUnitMfg").value;
  st.nameplate_data.model_number = document.getElementById("inpUnitModel").value;
  st.nameplate_data.serial_number = document.getElementById("inpUnitSerial").value;
  st.nameplate_data.legacy_controller_found = newLegacy;

  st.bas_overlay_profile = st.bas_overlay_profile || {};
  st.bas_overlay_profile.parent_panel = document.getElementById("inpParentPanel").value;
  st.bas_overlay_profile.mstp_mac_baud = document.getElementById("inpMstpMac").value;

  st.saved_sizing = st.saved_sizing || {};
  st.saved_sizing.manual_overrides = Object.assign(st.saved_sizing.manual_overrides || {}, { meta: true });

  if (archChanged) {
    // Re-infer default I/O, strategy, valve, and damper parameters for the newly selected archetype
    // without being poisoned by a previous archetype's recommended_alc_replacement string
    const prevCurve = st.saved_sizing?.io_inputs?.thermistor_curve || st.bas_overlay_profile?.thermistor_curve || "10k_TYPE_II";
    const prevLabor = st.saved_sizing?.labor_inputs || {};
    const prevOverrides = Object.assign({}, st.saved_sizing?.manual_overrides || { meta: true }, { io: false });
    delete st.bas_overlay_profile.io_tally;
    delete st.bas_overlay_profile.integration_strategy;
    st.nameplate_data.recommended_alc_replacement = "";
    const inferredStrategy = _inferDefaultStrategyForStation(st, true);
    const archIo = inferredStrategy === "VFD_HARDWIRED_SPLIT"
      ? { ui: 0, bi: 2, bo: 1, ao: 1 }
      : (inferredStrategy === "HYBRID_OVERLAY"
        ? { ui: 2, bi: 2, bo: 1, ao: 0 }
        : (DEFAULT_IO_BY_ARCHETYPE[newArch] || { ui: 4, bi: 2, bo: 2, ao: 2 }));
    st.saved_sizing = {
      io_inputs: Object.assign({}, archIo, {
        thermistor_curve: prevCurve,
        integration_strategy: inferredStrategy
      }),
      labor_inputs: prevLabor,
      manual_overrides: prevOverrides
    };
    _inferDefaultSizingForStation(st);
  } else if (legacyChanged && !st.saved_sizing?.manual_overrides?.io) {
    const inferredStrategy = _inferDefaultStrategyForStation(st, true);
    if (st.saved_sizing.io_inputs) {
      st.saved_sizing.io_inputs.integration_strategy = inferredStrategy;
    }
    const stratEl = document.getElementById("inpIoStrategy");
    if (stratEl) stratEl.value = inferredStrategy;
  }

  renderWorkbenchAll(archChanged);
}

function onIntegrationStrategyChange() {
  const st = getActiveWbStation();
  if (!st) return;
  const stratEl = document.getElementById("inpIoStrategy");
  const strat = stratEl ? stratEl.value : "FULL_ALC_DDC";
  if (strat === "VFD_HARDWIRED_SPLIT") {
    document.getElementById("inpIoUi").value = 0;
    document.getElementById("inpIoBi").value = 2;
    document.getElementById("inpIoBo").value = 1;
    document.getElementById("inpIoAo").value = 1;
  } else if (strat === "HYBRID_OVERLAY") {
    const uiVal = parseInt(document.getElementById("inpIoUi").value, 10) || 0;
    if (uiVal > 3 || uiVal === 0) document.getElementById("inpIoUi").value = 2;
  }
  onUnitCalcEdit("io");
}

function onUnitCalcEdit(calcSection) {
  const st = getActiveWbStation();
  if (!st) return;
  const prevOverrides = Object.assign({
    io: false,
    valve: false,
    damper: false,
    labor: false,
    meta: false
  }, st.saved_sizing?.manual_overrides || {});
  if (calcSection && Object.prototype.hasOwnProperty.call(prevOverrides, calcSection)) {
    prevOverrides[calcSection] = true;
  } else {
    prevOverrides.io = true;
  }

  st.observed_qty = Math.max(1, parseInt(document.getElementById("inpObsQty").value, 10) || 1);
  const stratEl = document.getElementById("inpIoStrategy");
  st.saved_sizing = {
    io_inputs: {
      ui: Math.max(0, parseInt(document.getElementById("inpIoUi").value, 10) || 0),
      bi: Math.max(0, parseInt(document.getElementById("inpIoBi").value, 10) || 0),
      bo: Math.max(0, parseInt(document.getElementById("inpIoBo").value, 10) || 0),
      ao: Math.max(0, parseInt(document.getElementById("inpIoAo").value, 10) || 0),
      thermistor_curve: document.getElementById("inpIoCurve").value,
      integration_strategy: stratEl ? stratEl.value : (st.saved_sizing?.io_inputs?.integration_strategy || _inferDefaultStrategyForStation(st))
    },
    valve_inputs: {
      enabled: document.getElementById("chkValveEnable").checked,
      flow_gpm: Math.max(0.1, parseFloat(document.getElementById("inpValveGpm").value) || 0.1),
      pipe_line_size_in: parseFloat(document.getElementById("inpValvePipeIn").value) || 1.5,
      fluid_type: document.getElementById("inpValveFluid").value,
      coil_dp_psi: Math.max(0.5, parseFloat(document.getElementById("inpValveCoilDp").value) || 3.5),
      design_valve_dp_psi: Math.max(1.0, parseFloat(document.getElementById("inpValveDesignDp").value) || 4.5),
      application: document.getElementById("inpValveApp").value,
      use_piccv: document.getElementById("chkValvePiccv").checked
    },
    damper_inputs: {
      enabled: document.getElementById("chkDamperEnable").checked,
      width_in: Math.max(6, parseFloat(document.getElementById("inpDmpWidth").value) || 24),
      height_in: Math.max(6, parseFloat(document.getElementById("inpDmpHeight").value) || 18),
      application: document.getElementById("inpDmpApp").value,
      velocity_fpm: Math.max(200, parseFloat(document.getElementById("inpDmpVel").value) || 1200)
    },
    labor_inputs: {
      ceiling_factor: parseFloat(document.getElementById("inpLabCeiling").value) || 1.0,
      wall_factor: parseFloat(document.getElementById("inpLabWall").value) || 1.0,
      shift_factor: parseFloat(document.getElementById("inpLabShift").value) || 1.0
    },
    manual_overrides: prevOverrides
  };
  renderWorkbenchAll(false);
}

function renderActiveStationResults(st) {
  const comp = st.engineering_computations || {};
  const sa = comp.serial_audit || {};
  const ma = comp.model_audit || {};
  const br = comp.board_reference || {};
  const io = comp.io_controller_sizing || {};
  const vc = comp.valve_sizing || {};
  const dc = comp.damper_sizing || {};
  const lc = comp.labor_sizing || {};
  const mOv = st.saved_sizing?.manual_overrides || {};

  document.getElementById("wbActiveUnitHeading").textContent = `⚙️ ${st.station_id} — ${st.equipment_tag || "Unit"}`;

  const toggleBadge = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? "inline-flex" : "none";
  };
  toggleBadge("badgeOverrideIo", Boolean(mOv.io));
  toggleBadge("badgeOverrideValve", Boolean(mOv.valve));
  toggleBadge("badgeOverrideDamper", Boolean(mOv.damper));
  toggleBadge("badgeOverrideLabor", Boolean(mOv.labor));
  toggleBadge("badgeOverrideTcp", Boolean(wbManualTcpOverride));

  const badges = [];
  if (isStationOverridden(st)) {
    badges.push(`<span class="pill pill-override">✏️ ENGINEER OVERRIDDEN</span>`);
  }
  if (sa.year) {
    badges.push(`<span class="pill ${sa.eol ? 'pill-caution' : 'pill-good'}">📅 Built ${sa.year} (${sa.age} yrs vs ${sa.lifeLimit}-yr ASHRAE Ch.38 Life${sa.eol ? ' • EOL Risk' : ''})</span>`);
  }
  if (ma.capacity) {
    badges.push(`<span class="pill pill-info">⚙️ ${escapeHtml(ma.capacity)}</span>`);
  }
  if (ma.a2lFlag) {
    badges.push(`<span class="pill pill-replace">❄️ EPA AIM Act A2L (R-454B/R-32) Safety Interlock</span>`);
  }
  document.getElementById("wbActiveUnitBadges").innerHTML = badges.join("");

  const legXref = br.legacy_crossref;
  document.getElementById("resNameplateDecode").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
      <div><strong>📖 #Golden-Library Board &amp; Switch Reference (${escapeHtml(br.citation || "")}):</strong> ${escapeHtml(br.family || "")}</div>
      <span class="pill pill-info">🔌 Legacy Board &amp; EOL Reference Card</span>
    </div>
    <div class="board-ref-grid">
      <div class="board-ref-cell">
        <small>🎛️ Rotary MAC / Address Rule</small>
        <div>${escapeHtml(br.rotary_mac_rule || br.summary || "")}</div>
      </div>
      <div class="board-ref-cell">
        <small>🔚 120&Omega; EOL Termination Jumper</small>
        <div>${escapeHtml(br.eol_jumper_rule || "Set 120-Ohm EOL ONLY at physical ends of RS-485 trunk.")}</div>
      </div>
      <div class="board-ref-cell">
        <small>⚡ 24VAC Class 2 Neutral &amp; Safety</small>
        <div>${escapeHtml(br.power_24vac_rule || "Maintain 24VAC Hot/Neutral polarity across all controllers.")}</div>
      </div>
    </div>
    ${legXref ? `<div style="margin-top:6px;font-size:11px;color:#a7f3d0;"><strong>🔄 Legacy Cross-Ref (${escapeHtml(legXref.legacy_family)}):</strong> ${escapeHtml(legXref.migration_notes)}</div>` : ""}
    ${st.user_note ? `<div style="margin-top:4px;color:var(--text-main);">📋 <strong>Field Observation:</strong> ${escapeHtml(st.user_note)}</div>` : ""}
    ${st.tier_delta_note ? `<div style="margin-top:4px;color:var(--accent-amber);font-weight:700;">📝 <strong>Engineer Scope / Tier Delta:</strong> ${escapeHtml(st.tier_delta_note)}</div>` : ""}
  `;

  // 1. I/O & Controller Sizer Result
  const stratLabel = io.integration_strategy === "HYBRID_OVERLAY"
    ? "OEM BACnet Hybrid Overlay (RFI-23-001)"
    : (io.integration_strategy === "VFD_HARDWIRED_SPLIT"
      ? "Hardwired VFD Control + Read-Only BACnet (RFI-23-006)"
      : "Full ALC DDC Controller Replacement");
  document.getElementById("resIoController").innerHTML = `
    <div class="kpi-row">
      <div class="kpi-box"><small>Control Integration Strategy</small><strong>${escapeHtml(stratLabel)}</strong></div>
      <div class="kpi-box"><small>Recommended ALC / Overlay Target</small><strong>${escapeHtml(io.recommended_alc_controller)}</strong></div>
      <div class="kpi-box"><small>Total Hardware Points</small><strong>${io.total_io_points} pts (${io.ui_count}UI/${io.bi_count}BI/${io.bo_count}BO/${io.ao_count}AO) • ${io.required_io_expanders} Exp</strong></div>
      <div class="kpi-box"><small>Controller 24VAC Load</small><strong>${io.controller_va_load} VA (x${st.observed_qty || 1} qty)</strong></div>
    </div>
    ${io.strategy_rfi_note ? `<div style="margin-top:6px;color:#a7f3d0;"><strong>🛡️ CSC Strategy Standard:</strong> ${escapeHtml(io.strategy_rfi_note)}</div>` : ""}
    <div style="margin-top:5px;">
      <strong>🌡️ Sensor Curve Audit (<code>${escapeHtml(io.thermistor_curve)}</code> &rarr; <code>${escapeHtml(io.sensor_reuse_status)}</code>):</strong>
      ${escapeHtml(io.sensor_engineering_note)}
    </div>
  `;

  // 2. Valve Sizing Result
  const vBox = document.getElementById("resValveSizing");
  if (!vc.enabled) {
    vBox.className = "result-banner";
    vBox.innerHTML = `<em style="color:var(--text-muted);">Hydronic control valve sizing disabled for this unit. Check the box above to size a 2-way modulating or PICCV control valve.</em>`;
  } else {
    vBox.className = vc.authority_compliant ? "result-banner" : "result-banner warn";
    vBox.innerHTML = `
      <div class="kpi-row">
        <div class="kpi-box"><small>Theoretical vs Selected Cv</small><strong>Cv ${vc.theoretical_cv} &rarr; Commercial Cv ${vc.selected_commercial_cv} (${vc.selected_valve_size_in}")</strong></div>
        <div class="kpi-box"><small>Valve Authority (&beta; &ge; 0.50)</small><strong>&beta; = ${vc.valve_authority_beta} (${vc.actual_valve_dp_psi} psi &Delta;P) ${vc.authority_compliant ? '✅' : '⚠️ Use PICCV'}</strong></div>
        <div class="kpi-box"><small>Recommended Belimo Assembly</small><strong>${escapeHtml(vc.recommended_belimo_model)}</strong></div>
        <div class="kpi-box"><small>Actuator 24VAC Load</small><strong>${vc.actuator_va_load} VA (${vc.spring_return_required ? 'Spring-Return' : 'Non-Spring'})</strong></div>
      </div>
      <div style="margin-top:7px;">
        <strong>🔧 Piping Trade Delineation (RFI-23-005):</strong> ${escapeHtml(vc.rfi_23_005_piping_note)}
        ${vc.piccv_alternative ? `<br/><strong>💡 PICCV Option (RFI-23-002):</strong> <code>${escapeHtml(vc.piccv_alternative)}</code>` : ""}
      </div>
    `;
  }

  // 3. Damper Sizing Result
  const dBox = document.getElementById("resDamperSizing");
  if (!dc.enabled) {
    dBox.className = "result-banner";
    dBox.innerHTML = `<em style="color:var(--text-muted);">Control damper actuator sizing disabled for this unit. Check the box above to size Belimo 24VAC damper actuators.</em>`;
  } else {
    dBox.className = "result-banner";
    dBox.innerHTML = `
      <div class="kpi-row">
        <div class="kpi-box"><small>Damper Area (${dc.width_in}" x ${dc.height_in}")</small><strong>${dc.area_sqft} sq.ft.</strong></div>
        <div class="kpi-box"><small>Required Torque (@ ${dc.torque_factor_in_lb_sqft} in-lb/sqft)</small><strong>${dc.required_torque_in_lb} in-lb</strong></div>
        <div class="kpi-box"><small>Selected Belimo Actuator</small><strong>${escapeHtml(dc.recommended_belimo_actuator)}</strong></div>
        <div class="kpi-box"><small>Rated Torque &amp; 24VAC Load</small><strong>${dc.total_rated_torque_in_lb} in-lb | ${dc.total_va_load} VA</strong></div>
      </div>
      <div style="margin-top:7px;">
        <strong>🔧 Sheet Metal Coordination (RFI-23-004):</strong> ${escapeHtml(dc.rfi_23_004_note)}
      </div>
    `;
  }

  // 4. Labor Multiplier Result
  const lBox = document.getElementById("resLaborSizing");
  lBox.className = lc.composite_multiplier >= 1.4 ? "result-banner warn" : "result-banner";
  lBox.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <div><strong>🛠️ Composite Rough-In Labor Multiplier: <code>${lc.composite_multiplier.toFixed(2)}x</code></strong> (Ceiling ${lc.ceiling_factor}x • Wall ${lc.wall_factor}x • Shift ${lc.shift_factor}x)</div>
      <span class="pill ${lc.composite_multiplier >= 1.4 ? 'pill-caution' : 'pill-good'}">${escapeHtml(lc.risk_tier)}</span>
    </div>
  `;
}

function renderActiveStationMedia(st) {
  document.getElementById("wbMediaUnitLabel").textContent = st.station_id;
  const photoBox = document.getElementById("wbUnitPhotoBox");
  const photos = st.photo_data_urls || [];
  if (photos.length === 0) {
    photoBox.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);padding:8px 0;">No embedded photos on this unit (or load a <code>.cscwalk.zip</code> with stamped photos).</div>`;
  } else {
    photoBox.innerHTML = `
      <div class="photo-strip">
        ${photos.map((url, idx) => `<img src="${url}" alt="Photo ${idx + 1}" onclick="openWbPhotoZoom('${escapeHtml(st.equipment_tag)} — Photo #${idx + 1}', this.src)" />`).join("")}
      </div>
    `;
  }

  const voiceBox = document.getElementById("wbUnitVoiceBox");
  const segs = (wbWalk.site_pro_audio_segments || []).filter((a) => a.linked_station_id === st.station_id || a.linked_station_id === "SITE-GENERAL");
  if (segs.length === 0) {
    voiceBox.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);">No voice notes linked to ${escapeHtml(st.station_id)}.</div>`;
  } else {
    voiceBox.innerHTML = segs.map((s) => `
      <div style="background:var(--bg-panel);border:1px solid var(--border-col);border-radius:6px;padding:7px 9px;margin-top:5px;font-size:11.5px;">
        <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:10.5px;">
          <strong>🎙️ ${escapeHtml(s.seg_id)} (${escapeHtml(s.linked_station_id)})</strong>
          <span>${escapeHtml(s.timestamp_range || "")}</span>
        </div>
        <div style="margin-top:3px;">"${escapeHtml(s.transcript_text)}"</div>
        ${s.extracted_insight ? `<div style="margin-top:3px;color:var(--accent-teal);font-weight:700;">↳ ${escapeHtml(s.extracted_insight)}</div>` : ""}
      </div>
    `).join("");
  }
}

function openWbPhotoZoom(title, src) {
  document.getElementById("wbPhotoModalTitle").textContent = title;
  document.getElementById("wbPhotoModalImg").src = src;
  document.getElementById("wbPhotoModal").style.display = "flex";
}

function renderTcpAndBomRollup(tcpRollup, populateTcpInputs = true) {
  if (!tcpRollup) return;
  const c = tcpRollup.counts || {};
  if (populateTcpInputs) {
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = v ?? 0;
    };
    setVal("inpTcpOpti", c.alc_controllers_count);
    setVal("inpTcpZn", c.zn_vav_controllers_count);
    setVal("inpTcpExp", c.io_expanders_count);
    setVal("inpTcpSr", c.spring_return_actuators_count);
    setVal("inpTcpNsr", c.non_spring_actuators_count);
    setVal("inpTcpRnet", c.rnet_zone_sensors_count);
  }

  const fillEl = document.getElementById("wbVaMeterFill");
  if (fillEl) {
    fillEl.style.width = `${Math.min(100, tcpRollup.derated_utilization_pct)}%`;
    fillEl.style.background = tcpRollup.derated_utilization_pct > 80 ? "#ef4444" : "linear-gradient(90deg, #10b981, #14b8a6)";
  }

  document.getElementById("resTcpVaRollup").innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
      <div><small style="color:var(--text-muted);">Subtotal 24VAC Load:</small><br/><strong>${tcpRollup.subtotal_va} VA</strong></div>
      <div><small style="color:var(--text-muted);">Design Load (+15% Spare):</small><br/><strong style="color:var(--accent-teal);">${tcpRollup.total_with_15pct_spare_va} VA</strong></div>
      <div><small style="color:var(--text-muted);">Required 100VA Transformers:</small><br/><strong>(${tcpRollup.required_100va_transformers}) x 100VA Class 2</strong></div>
      <div><small style="color:var(--text-muted);">NEC Art. 725 Utilization:</small><br/><strong>${tcpRollup.derated_utilization_pct}% (of ${tcpRollup.required_100va_transformers * 100} VA)</strong></div>
    </div>
    <div style="margin-top:7px;font-size:11.5px;border-top:1px solid var(--border-col);padding-top:6px;">
      <strong>⚡ RFI-23-009 Callout:</strong> ${escapeHtml(tcpRollup.rfi_23_009_callout)}
    </div>
  `;

  // Render BOM Table
  const stations = wbWalk.equipment_stations || [];
  const totalObs = stations.reduce((acc, s) => acc + Math.max(1, parseInt(s.observed_qty ?? 1, 10)), 0);
  document.getElementById("wbBomTotalUnitsBadge").textContent = `${stations.length} Stns (${totalObs} Units)`;

  const tbody = document.getElementById("wbBomTableBody");
  tbody.innerHTML = stations.map((st) => {
    const comp = st.engineering_computations || {};
    const io = comp.io_controller_sizing || {};
    const vc = comp.valve_sizing || {};
    const dc = comp.damper_sizing || {};
    const lc = comp.labor_sizing || {};
    return `
      <tr style="cursor:pointer;" onclick="selectWorkbenchStation('${escapeHtml(st.station_id)}')">
        <td>
          <strong>${escapeHtml(st.station_id)}</strong> (x${st.observed_qty || 1})<br/>
          <small style="color:var(--text-muted);">${escapeHtml(st.equipment_tag)}</small>
        </td>
        <td>
          <strong>${escapeHtml(io.recommended_alc_controller || "")}</strong><br/>
          <small>${io.ui_count}UI/${io.bi_count}BI/${io.bo_count}BO/${io.ao_count}AO • <code>${escapeHtml(io.thermistor_curve)}</code></small>
        </td>
        <td>
          ${vc.enabled ? `<div>💧 <strong>Cv ${vc.selected_commercial_cv}</strong> (${vc.selected_valve_size_in}", &beta;=${vc.valve_authority_beta})<br/><small>${escapeHtml(vc.recommended_belimo_model)}</small></div>` : ""}
          ${dc.enabled ? `<div style="margin-top:3px;">🌬️ <strong>${dc.area_sqft} sqft</strong> (${dc.required_torque_in_lb} in-lb)<br/><small>${escapeHtml(dc.recommended_belimo_actuator)}</small></div>` : ""}
          <div style="margin-top:3px;"><small>🛠️ Labor: <strong>${(lc.composite_multiplier || 1.0).toFixed(2)}x</strong></small></div>
        </td>
      </tr>
    `;
  }).join("");
}

function onTcpOverrideEdit() {
  wbManualTcpOverride = {
    alc_controllers_count: Math.max(0, parseInt(document.getElementById("inpTcpOpti").value, 10) || 0),
    zn_vav_controllers_count: Math.max(0, parseInt(document.getElementById("inpTcpZn").value, 10) || 0),
    io_expanders_count: Math.max(0, parseInt(document.getElementById("inpTcpExp").value, 10) || 0),
    spring_return_actuators_count: Math.max(0, parseInt(document.getElementById("inpTcpSr").value, 10) || 0),
    non_spring_actuators_count: Math.max(0, parseInt(document.getElementById("inpTcpNsr").value, 10) || 0),
    rnet_zone_sensors_count: Math.max(0, parseInt(document.getElementById("inpTcpRnet").value, 10) || 0)
  };
  renderWorkbenchAll(false);
}

function resetTcpToAutoTally() {
  wbManualTcpOverride = null;
  renderWorkbenchAll(true);
  showWbToast("🔄 Reset TCP 24VAC VA counts to auto-tally from equipment units.");
}

// ============================================================================
// FILE IMPORT, DOWNLOADS UNPACK, CSV EXPORT & 1-CLICK DOSSIER RE-COMPILE
// ============================================================================
async function importWalkFileIntoWorkbench(inputEl) {
  const file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  try {
    const fname = String(file.name || "").toLowerCase();
    if (fname.endsWith(".zip")) {
      const ab = await file.arrayBuffer();
      const parsed = await window.CSCDiscoveryAdapter.parseCscWalkZipBuffer(ab);
      if (!parsed.manifest) throw new Error("No manifest.json found inside .cscwalk.zip");
      const rawManifest = parsed.manifest;
      // Hydrate stamped photos from zip into stations for visual preview without duplicating legacy photos/ alongside 01_Stamped_Photos/
      const photoLookup = {};
      const mapLookup = {};
      const stampedByStation = {};
      const rawByStation = {};
      const legacyByStation = {};
      for (const [relPath, bytes] of Object.entries(parsed.files)) {
        const normPath = String(relPath || "").replace(/\\/g, "/");
        const low = normPath.toLowerCase();
        if ((low.startsWith("maps/") || low.startsWith("05_floor_maps/")) && (low.endsWith(".jpg") || low.endsWith(".jpeg") || low.endsWith(".png"))) {
          const flrId = normPath.split("/").pop().replace(/\.(jpg|jpeg|png)$/i, "");
          const mime = low.endsWith(".png") ? "image/png" : "image/jpeg";
          mapLookup[flrId] = `data:${mime};base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
        } else if ((low.startsWith("01_stamped_photos/") || low.startsWith("02_raw_photos/") || low.startsWith("photos/")) && (low.endsWith(".jpg") || low.endsWith(".jpeg") || low.endsWith(".png"))) {
          const mime = low.endsWith(".png") ? "image/png" : "image/jpeg";
          const dataUrl = `data:${mime};base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
          photoLookup[normPath] = dataUrl;
          photoLookup[low] = dataUrl;
          const baseName = normPath.split("/").pop();
          if (baseName && (low.startsWith("01_stamped_photos/") || !photoLookup[baseName])) {
            photoLookup[baseName] = dataUrl;
          }
          const mStn = normPath.match(/(STN-\d+)/i);
          if (mStn) {
            const sid = mStn[1].toUpperCase();
            if (low.startsWith("01_stamped_photos/")) {
              if (!stampedByStation[sid]) stampedByStation[sid] = [];
              if (!stampedByStation[sid].includes(dataUrl) && stampedByStation[sid].length < 3) stampedByStation[sid].push(dataUrl);
            } else if (low.startsWith("02_raw_photos/")) {
              if (!rawByStation[sid]) rawByStation[sid] = [];
              if (!rawByStation[sid].includes(dataUrl) && rawByStation[sid].length < 3) rawByStation[sid].push(dataUrl);
            } else if (low.startsWith("photos/")) {
              if (!legacyByStation[sid]) legacyByStation[sid] = [];
              if (!legacyByStation[sid].includes(dataUrl) && legacyByStation[sid].length < 3) legacyByStation[sid].push(dataUrl);
            }
          }
        }
      }

      for (const flrArr of [rawManifest.floors, rawManifest.floor_plans]) {
        if (Array.isArray(flrArr)) {
          flrArr.forEach((f) => {
            const fid = f && (f.id || f.floor_id);
            if (fid && mapLookup[fid] && !f.custom_map_data_url) {
              f.custom_map_data_url = mapLookup[fid];
              f.hasCustomMap = true;
            }
          });
        }
      }

      const resolvePhotoRelPath = (rp) => {
        if (!rp || typeof rp !== "string") return null;
        const clean = rp.replace(/\\/g, "/");
        const base = clean.split("/").pop();
        return photoLookup[clean] || photoLookup[clean.toLowerCase()] || (base ? photoLookup[base] : null) || null;
      };

      wbWalk = normalizeWalkForWorkbench(rawManifest);
      const manifestPhotoMap = rawManifest.stationPhotoFiles || {};
      for (const st of wbWalk.equipment_stations || []) {
        const sid = String(st.station_id || "").toUpperCase();
        const mappedEntry = manifestPhotoMap[st.station_id] || manifestPhotoMap[sid];
        let chosen = [];
        if (Array.isArray(mappedEntry)) {
          chosen = mappedEntry.map(resolvePhotoRelPath).filter(Boolean);
        } else if (mappedEntry && typeof mappedEntry === "object") {
          const stampedList = [];
          const rawList = [];
          const legacyList = [];
          if (Array.isArray(mappedEntry.stamped) || typeof mappedEntry.stamped === "string") {
            const arr = Array.isArray(mappedEntry.stamped) ? mappedEntry.stamped : [mappedEntry.stamped];
            arr.forEach((p) => { const d = resolvePhotoRelPath(p); if (d && !stampedList.includes(d)) stampedList.push(d); });
          }
          if (Array.isArray(mappedEntry.raw) || typeof mappedEntry.raw === "string") {
            const arr = Array.isArray(mappedEntry.raw) ? mappedEntry.raw : [mappedEntry.raw];
            arr.forEach((p) => { const d = resolvePhotoRelPath(p); if (d && !rawList.includes(d)) rawList.push(d); });
          }
          if (Array.isArray(mappedEntry.legacy) || typeof mappedEntry.legacy === "string") {
            const arr = Array.isArray(mappedEntry.legacy) ? mappedEntry.legacy : [mappedEntry.legacy];
            arr.forEach((p) => { const d = resolvePhotoRelPath(p); if (d && !legacyList.includes(d)) legacyList.push(d); });
          }
          // Also support slot-keyed objects: { "1": { stamped: "...", raw: "...", legacy: "..." }, "2": { ... } }
          for (const [k, slotVal] of Object.entries(mappedEntry)) {
            if (k === "stamped" || k === "raw" || k === "legacy") continue;
            if (slotVal && typeof slotVal === "object") {
              const dSt = resolvePhotoRelPath(slotVal.stamped);
              const dRw = resolvePhotoRelPath(slotVal.raw);
              const dLg = resolvePhotoRelPath(slotVal.legacy);
              if (dSt && !stampedList.includes(dSt)) stampedList.push(dSt);
              if (dRw && !rawList.includes(dRw)) rawList.push(dRw);
              if (dLg && !legacyList.includes(dLg)) legacyList.push(dLg);
            } else if (typeof slotVal === "string") {
              const d = resolvePhotoRelPath(slotVal);
              if (d && !stampedList.includes(d)) stampedList.push(d);
            }
          }
          chosen = stampedList.length > 0 ? stampedList : (rawList.length > 0 ? rawList : legacyList);
        }
        if (chosen.length === 0) {
          if (stampedByStation[sid] && stampedByStation[sid].length > 0) {
            chosen = stampedByStation[sid];
          } else if (rawByStation[sid] && rawByStation[sid].length > 0) {
            chosen = rawByStation[sid];
          } else if (legacyByStation[sid] && legacyByStation[sid].length > 0) {
            chosen = legacyByStation[sid];
          }
        }
        if (chosen.length > 0) {
          st.photo_data_urls = chosen.slice(0, 3);
        }
      }
    } else {
      const txt = await file.text();
      wbWalk = normalizeWalkForWorkbench(JSON.parse(txt));
    }
    wbActiveStationId = (wbWalk.equipment_stations && wbWalk.equipment_stations[0]?.station_id) || "";
    wbManualTcpOverride = wbWalk.tcp_va_overrides || null;
    renderWorkbenchAll(true);
    showWbToast(`📂 <strong>Loaded ${escapeHtml(file.name)}</strong> (${(wbWalk.equipment_stations || []).length} units ready for sizing)!`);
  } catch (err) {
    showWbToast(`⚠️ Could not load walk file: ${escapeHtml(err.message)}`, true);
  } finally {
    inputEl.value = "";
  }
}

async function pullLatestWalkFromDownloads() {
  if (!wbServerConnected) {
    showWbToast("⚠️ Run <code>Launch_PC_Engineering_Workbench.bat</code> (or use <strong>📂 Load Walk (.zip)</strong> to pick the file from your Downloads folder directly).", true);
    return;
  }
  try {
    showWbToast("⏳ Searching PC Downloads folder for latest <code>.cscwalk.zip</code>...");
    const resp = await fetch("/api/companion/unpack-downloads", { method: "POST" });
    const data = await resp.json();
    if (!resp.ok || data.status !== "SUCCESS") {
      throw new Error(data.error || "No .cscwalk.zip found in Downloads");
    }
    await loadStateFromServer(data.folderName || "");
    showWbToast(`✅ <strong>Unpacked <code>${escapeHtml(data.sourceZip || "")}</code>!</strong> Loaded into Workbench &amp; compiled initial dossier.`);
  } catch (err) {
    showWbToast(`⚠️ Downloads Unpack Notice: ${escapeHtml(err.message)}`, true);
  }
}

function renderDeliverableLinks(outputs) {
  const box = document.getElementById("wbDeliverableLinks");
  if (!box) return;
  if (!outputs) {
    box.innerHTML = "";
    return;
  }
  const items = [
    { key: "pdfUrl", label: "📄 Open PDF Dossier" },
    { key: "xlsxUrl", label: "📊 Open Excel Schedule" },
    { key: "docxUrl", label: "📝 Open Word Report" },
    { key: "htmlUrl", label: "🌐 Open HTML Report" }
  ];
  box.innerHTML = items
    .filter((i) => outputs[i.key])
    .map((i) => `<a class="btn btn-secondary" style="padding:4px 8px;font-size:11px;" href="${escapeHtml(outputs[i.key])}" target="_blank">${i.label}</a>`)
    .join("");
}

async function saveAndRecompileFullDossier() {
  if (!wbWalk) return;
  recomputeAllStationsInWorkbench();

  if (wbServerConnected) {
    try {
      showWbToast("⏳ <strong>Saving engineering calculations &amp; re-compiling PDF, Excel, Word &amp; HTML Dossier...</strong>");
      const resp = await fetch("/api/companion/save-and-compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderName: wbActiveFolder,
          walkData: wbWalk
        })
      });
      const res = await resp.json();
      if (!resp.ok || res.status !== "SUCCESS") {
        throw new Error(res.error || "Server compile failed");
      }
      renderDeliverableLinks(res.urls);
      showWbToast(`✅ <strong>Re-Compiled Full Dossier!</strong> Updated PDF, Excel, Word, HTML &amp; Handoff JSON in <code>${escapeHtml(res.savedDir || "output")}</code>.`);
      return;
    } catch (err) {
      showWbToast(`⚠️ Server compile error (${escapeHtml(err.message)}) — downloading updated JSON &amp; CSV locally.`, true);
    }
  }

  // Standalone file:// fallback: save updated JSON + CSV BOM directly
  const job = (wbWalk.walk_meta && wbWalk.walk_meta.csc_job_number) || "CSC-WALK";
  const jsonBlob = new Blob([JSON.stringify(wbWalk, null, 2)], { type: "application/json;charset=utf-8" });
  await window.CSCDiscoveryAdapter.saveOrShareBlob(`${job}_Companion_Sized_Export.json`, "application/json", jsonBlob, null);
  await exportWorkbenchBomCsv();
  showWbToast(`💾 <strong>Exported <code>${escapeHtml(job)}_Companion_Sized_Export.json</code> &amp; Sizing CSV!</strong>`);
}

async function exportWorkbenchBomCsv() {
  if (!wbWalk) return;
  recomputeAllStationsInWorkbench();
  const job = (wbWalk.walk_meta && wbWalk.walk_meta.csc_job_number) || "CSC-WALK";
  const rows = (wbWalk.equipment_stations || []).map((st) => {
    const c = st.engineering_computations || {};
    const io = c.io_controller_sizing || {};
    const vc = c.valve_sizing || {};
    const dc = c.damper_sizing || {};
    const lc = c.labor_sizing || {};
    const sa = c.serial_audit || {};
    const ma = c.model_audit || {};
    return {
      JobNumber: job,
      StationID: st.station_id,
      EquipmentTag: st.equipment_tag,
      Archetype: st.archetype_id,
      Condition: st.condition || "GOOD",
      ObservedQty: st.observed_qty || 1,
      ScheduledQty: st.scheduled_qty || 1,
      Location: st.room_zone || st.floor_id,
      Manufacturer: st.nameplate_data?.manufacturer || "",
      Model: st.nameplate_data?.model_number || "",
      Serial: st.nameplate_data?.serial_number || "",
      DecodedYear: sa.year || "",
      AgeYears: sa.age ?? "",
      A2L_Flag: ma.a2lFlag ? "YES" : "NO",
      RecommendedALC: io.recommended_alc_controller || "",
      IO_Points: `${io.ui_count}UI/${io.bi_count}BI/${io.bo_count}BO/${io.ao_count}AO`,
      IO_Expanders: io.required_io_expanders || 0,
      SensorCurve: io.thermistor_curve || "",
      SensorStatus: io.sensor_reuse_status || "",
      ValveModel: vc.enabled ? vc.recommended_belimo_model : "N/A",
      ValveGPM: vc.enabled ? vc.flow_gpm : "",
      ValveCv: vc.enabled ? vc.selected_commercial_cv : "",
      ValveSizeIn: vc.enabled ? vc.selected_valve_size_in : "",
      ValveAuthorityBeta: vc.enabled ? vc.valve_authority_beta : "",
      PipingReducerNote: vc.enabled ? vc.rfi_23_005_piping_note : "",
      DamperActuator: dc.enabled ? dc.recommended_belimo_actuator : "N/A",
      DamperAreaSqFt: dc.enabled ? dc.area_sqft : "",
      DamperTorqueInLb: dc.enabled ? dc.required_torque_in_lb : "",
      LaborMultiplier: lc.composite_multiplier || 1.0,
      LaborRiskTier: lc.risk_tier || ""
    };
  });

  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  await window.CSCDiscoveryAdapter.saveOrShareBlob(`${job}_Engineering_Sizing_BOM.csv`, "text/csv", blob, null);
}

// ============================================================================
// SERVER SYNC & INITIALIZATION
// ============================================================================
async function loadStateFromServer(folderName = "") {
  try {
    const q = folderName ? `?folder=${encodeURIComponent(folderName)}` : "";
    const resp = await fetch(`/api/companion/state${q}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    wbServerConnected = true;
    wbActiveFolder = data.activeFolder || "";
    wbLastServerMtime = data.lastModified || 0;

    const badge = document.getElementById("wbServerConnBadge");
    if (badge) {
      badge.textContent = `🟢 PC Companion Server Connected (${data.lanIp || "localhost"}:${data.port || 8766})`;
      badge.style.color = "#6ee7b7";
    }

    const sel = document.getElementById("wbWalkFolderSelect");
    if (sel && Array.isArray(data.availableFolders) && data.availableFolders.length > 0) {
      sel.style.display = "inline-block";
      sel.innerHTML = data.availableFolders.map((f) => `
        <option value="${escapeHtml(f.name)}" ${f.name === wbActiveFolder ? 'selected' : ''}>📁 ${escapeHtml(f.label || f.name)}</option>
      `).join("");
    }

    if (data.walkData) {
      wbWalk = normalizeWalkForWorkbench(data.walkData);
      wbActiveStationId = (wbWalk.equipment_stations && wbWalk.equipment_stations[0]?.station_id) || "";
      wbManualTcpOverride = wbWalk.tcp_va_overrides || null;
      renderWorkbenchAll(true);
      renderDeliverableLinks(data.urls || null);
      return true;
    }
  } catch (e) {
    wbServerConnected = false;
    const badge = document.getElementById("wbServerConnBadge");
    if (badge) {
      badge.textContent = "📂 Standalone File Mode (Load any .cscwalk.zip or .json)";
      badge.style.color = "#fde68a";
    }
  }
  return false;
}

async function onSelectServerWalkFolder(folderName) {
  await loadStateFromServer(folderName);
  showWbToast(`📁 Switched active walk to <code>${escapeHtml(folderName)}</code>.`);
}

async function pollServerForNewWifiDrops() {
  if (!wbServerConnected) return;
  try {
    const resp = await fetch("/api/companion/state?summary_only=1");
    if (!resp.ok) return;
    const info = await resp.json();
    if (info.lastModified && info.lastModified > wbLastServerMtime + 0.5) {
      wbLastServerMtime = info.lastModified;
      await loadStateFromServer(info.activeFolder || "");
      showWbToast(`📶 <strong>New Field Walk Received!</strong> Loaded <code>${escapeHtml(info.activeFolder || "latest walk")}</code> automatically.`);
    }
  } catch (e) {}
}

window.addEventListener("DOMContentLoaded", async () => {
  // 1. If opened from a generated standalone file with embedded walk data, load it immediately
  if (window.__EMBEDDED_WALK_DATA__) {
    wbWalk = normalizeWalkForWorkbench(window.__EMBEDDED_WALK_DATA__);
    wbActiveStationId = (wbWalk.equipment_stations && wbWalk.equipment_stations[0]?.station_id) || "";
    renderWorkbenchAll(true);
  }

  // 2. Try connecting to the local PC Companion Server (/api/companion/state)
  if (window.location.protocol.startsWith("http")) {
    const loadedServer = await loadStateFromServer();
    if (loadedServer) {
      setInterval(pollServerForNewWifiDrops, 4500);
      return;
    }
  } else {
    const badge = document.getElementById("wbServerConnBadge");
    if (badge) {
      badge.textContent = "📂 Standalone Job Folder Workbench (100% Offline Ready)";
      badge.style.color = "#6ee7b7";
    }
  }

  // 3. Fallback to browser localStorage state if present
  if (!wbWalk && window.CSCDiscoveryAdapter) {
    const localSaved = window.CSCDiscoveryAdapter.readState("active_walk_v1", null);
    if (localSaved) {
      wbWalk = normalizeWalkForWorkbench(localSaved);
      wbActiveStationId = (wbWalk.equipment_stations && wbWalk.equipment_stations[0]?.station_id) || "";
      renderWorkbenchAll(true);
    }
  }
});
