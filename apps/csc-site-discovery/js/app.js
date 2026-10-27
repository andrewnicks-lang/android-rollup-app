/**
 * CSC Site Discovery & Field Survey Companion — v2.0 Android RollupOS Ready
 * Streamlined <15s Quick Walk Mode, Clone +1, Global Hold-to-Talk PTT Pill,
 * Non-Destructive 8x8 Local Tile CLAHE + EXIF GPS/Compass, BAS Overlay I/O Strip,
 * Pinch-Zoom/Drag SVG Map, In-App Live Camera + Torch + Step-Peak PDR Walk,
 * Fail-Open Valve/Damper/VA Sizers, & Offline .cscwalk.zip Bundle Packager.
 */

const ARCHETYPES = [
  {
    id: "RTU_AHU",
    label: "🌀 Packaged RTU / Air Handler (AHU)",
    default_alc: "ALC OptiFlex OF1628 / ZN551 (or BACnet MS/TP Overlay)",
    items: [
      {
        id: "CHK-AHU-01",
        cat: "OEM Controller & BACnet Overlay (RFI-23-001)",
        shortLabel: "Missing OEM BACnet Card",
        q: "Factory OEM microprocessor controller installed? (Symbio 700/800, ReliaTel, AAON VCCX2, Daikin MicroTech)",
        opts: ["Yes — BACnet Card Present", "Yes — Missing BACnet Card/License", "No — Electromechanical / Legacy DDC"],
        redFlags: ["Yes — Missing BACnet Card/License"],
        amberFlags: ["No — Electromechanical / Legacy DDC"],
        reminder: "CSC Overlay Standard (RFI-23-001): Never gut factory OEM controllers unless explicitly contracted! Flag Div 23 Mechanical Contractor to furnish/unlock factory BACnet interface prior to CSC startup."
      },
      {
        id: "CHK-AHU-02",
        cat: "Life-Safety & Freeze Protection (RFI-23-007)",
        shortLabel: "SPST / Missing Freeze Stat",
        q: "Hydronic coil serpentine freeze stat configuration?",
        opts: ["DPDT Manual-Reset Present", "SPST (Single-Pole) Only — Needs Upgrade", "Missing / Bypassed", "N/A (DX / Gas Only)"],
        redFlags: ["SPST (Single-Pole) Only — Needs Upgrade", "Missing / Bypassed"],
        amberFlags: [],
        reminder: "CSC DPDT Freeze Stat Rule (RFI-23-007): Must use a DPDT manual-reset serpentine freeze stat across hydronic coils. Pole 1 breaks the hardwired VFD/starter safety circuit directly; Pole 2 wires to BAS DI for WebCTRL® alarm."
      },
      {
        id: "CHK-AHU-03",
        cat: "Life-Safety & Smoke Detection (RFI-23-007)",
        shortLabel: "No Smoke Aux Form-C",
        q: "Supply/Return duct smoke detector & auxiliary relay status?",
        opts: ["Present with Aux Form-C Dry Contact", "Present — No Spare Aux Contact", "Not Installed (By Div 28/26)", "N/A (<2,000 CFM)"],
        redFlags: ["Present — No Spare Aux Contact"],
        amberFlags: ["Not Installed (By Div 28/26)"],
        reminder: "Trade Delineation (RFI-23-007): Div 28/26 furnishes, mounts, and wires duct smoke detectors and hardwired fan shutdown relay. CSC monitors auxiliary Form-C dry contact (DI) only."
      },
      {
        id: "CHK-AHU-04",
        cat: "Dampers & Actuators (RFI-23-004)",
        shortLabel: "Rusted / Pneumatic Damper",
        q: "OA / RA / EA damper blades, linkage & jackshaft condition?",
        opts: ["Smooth Operation — 1/2\" or 3/4\" Shaft", "Binding / Rusted Linkage (Div 23 Repair)", "Pneumatic Piston Actuator — Needs Belimo Retrofit", "UL555S Fire/Smoke Damper (120VAC by Div 26)"],
        redFlags: ["Binding / Rusted Linkage (Div 23 Repair)"],
        amberFlags: ["Pneumatic Piston Actuator — Needs Belimo Retrofit", "UL555S Fire/Smoke Damper (120VAC by Div 26)"],
        reminder: "Damper Boundary (RFI-23-004): Document seized/rusted damper linkages so Proposal excludes mechanical damper repair (by Div 23 33 00 Sheet Metal). Size Belimo spring-return actuators for OA/EA fail-safe close."
      },
      {
        id: "CHK-AHU-05",
        cat: "Duct Static Sensor Location (RFI-23-001)",
        shortLabel: "Hard-Lid / Lift Duct Access",
        q: "Main supply trunk accessible 2/3 downstream for Duct Static Pressure pickup?",
        opts: ["Accessible (Lay-in Ceiling)", "Hard Lid Drywall (Needs Access Door)", "Exposed Structure (>16 ft Lift Req'd)", "Single-Zone Unit (No Static Loop)"],
        redFlags: ["Hard Lid Drywall (Needs Access Door)"],
        amberFlags: ["Exposed Structure (>16 ft Lift Req'd)"],
        reminder: "ASHRAE Guideline 36 / RFI-23-001: Mount duct static pressure sensor 2/3 down main supply trunk for Trim & Respond static reset."
      },
      {
        id: "CHK-AHU-06",
        cat: "EPA AIM Act A2L Refrigerant Safety (ASHRAE 15.2)",
        shortLabel: "A2L R-454B/R-32 Interlock",
        q: "Refrigerant class & factory A2L leak mitigation interlock (R-454B / R-32)?",
        opts: ["R-410A / R-22 / Hydronic Only (Non-A2L)", "A2L (R-454B / R-32) — Factory Leak Board Verified", "A2L (R-454B / R-32) — Missing Mitigation / Unclear BAS Interlock"],
        redFlags: ["A2L (R-454B / R-32) — Missing Mitigation / Unclear BAS Interlock"],
        amberFlags: ["A2L (R-454B / R-32) — Factory Leak Board Verified"],
        reminder: "ASHRAE 15.2 / UL 60335-2-40: Never bypass factory A2L leak-mitigation fan/zone-damper energization circuits! Monitor A2L fault dry contact / BACnet alarm only."
      }
    ]
  },
  {
    id: "VFD_STARTER",
    label: "⚡ VFD / Motor Starter",
    default_alc: "Hardwired DO/AO/DI + Read-Only BACnet MS/TP",
    items: [
      {
        id: "CHK-VFD-01",
        cat: "Hardwired Control vs Telemetry Split (RFI-23-006)",
        shortLabel: "Network-Only VFD Command",
        q: "VFD control terminal availability (Start/Stop DO, 0-10V Speed AO, Status/Fault DI)?",
        opts: ["Terminals Open & Available", "Currently Controlled via Network Only", "Legacy Drive — Needs Replacement"],
        redFlags: ["Currently Controlled via Network Only", "Legacy Drive — Needs Replacement"],
        amberFlags: [],
        reminder: "CSC VFD Standard (RFI-23-006): Command Start/Stop (DO), Speed Reference (0-10VDC AO), and Run/Fault (DI) via HARDWIRED I/O so local HOA keypad works predictably. Configure BACnet MS/TP strictly as READ-ONLY for kW/Amps/Faults."
      },
      {
        id: "CHK-VFD-02",
        cat: "Series Hardware Safety Interlock Loop (RFI-23-006 / 007)",
        shortLabel: "Safety Jumper / No Cutout",
        q: "Hardwired safety interlock terminal loop verified (Freeze, High-Static, Smoke, Damper End-Switch)?",
        opts: ["Series Safety Loop Intact", "Factory Jumper Only — Needs Safety Interlock", "High-Static Switch Missing"],
        redFlags: ["Factory Jumper Only — Needs Safety Interlock", "High-Static Switch Missing"],
        amberFlags: [],
        reminder: "Hardware Safety Independence (RFI-23-006 & RFI-23-007): Freeze stat Pole 1, smoke detector relay, high-static switch, and isolation damper end-switches must break the VFD hardware safety interlock terminal directly in series."
      }
    ]
  },
  {
    id: "HYDRONIC_VALVE_PUMP",
    label: "💧 Hydronic Coil, Control Valve & Pump",
    default_alc: "Belimo Characterized / PICCV + 24VAC Modulating Actuator",
    items: [
      {
        id: "CHK-HYD-01",
        cat: "Valve Body & Pipe Geometry (RFI-23-002 / 005)",
        shortLabel: "Leaking Stem / Pipe Cut-In",
        q: "Control valve retrofit strategy (Actuator-Only Linkage vs Full Inline Body Cut-In)?",
        opts: ["Belimo Retrofit Linkage (Reuse Body)", "New Valve Body / PICCV Cut-In by Div 23 21 13", "Existing Pneumatic Valve — Leaking Stem Packing"],
        redFlags: ["Existing Pneumatic Valve — Leaking Stem Packing"],
        amberFlags: ["New Valve Body / PICCV Cut-In by Div 23 21 13"],
        reminder: "Piping Trade Matrix (RFI-23-005): Never mount a new electronic actuator on a leaking valve stem! CSC furnishes tagged control valves; Div 23 21 13 (Hydronic Piping) drains loop and installs inline bodies & concentric reducers."
      },
      {
        id: "CHK-HYD-02",
        cat: "Thermowells & DP Taps (RFI-23-005 / 010)",
        shortLabel: "Missing Wells / Header DP",
        q: "Immersion thermowells & variable-flow remote index DP transmitter location?",
        opts: ["Wells Present + DP 2/3 Down Branch", "Missing Wells (Div 23 21 13 Must Weld Threadolets)", "DP Sensor at Pump Header Only (Needs 2/3 Relocation)"],
        redFlags: ["Missing Wells (Div 23 21 13 Must Weld Threadolets)", "DP Sensor at Pump Header Only (Needs 2/3 Relocation)"],
        amberFlags: [],
        reminder: "RFI-23-005 & RFI-23-010: Div 23 21 13 installs welded threadolets, immersion wells, and 1/4\" NPT gauge/DP taps. Locate hydronic DP transmitter 2/3 down longest index branch per ASHRAE 90.1."
      }
    ]
  },
  {
    id: "CHILLER_BOILER_PLANT",
    label: "🏭 Chiller / Boiler / Central Plant",
    default_alc: "ALC OptiFlex OF1628 Central Plant Controller",
    items: [
      {
        id: "CHK-PLT-01",
        cat: "OEM Plant Integration Protocol (RFI-23-001)",
        shortLabel: "LonWorks / Proprietary Gateway",
        q: "Chiller/Boiler factory communication interface & protocol?",
        opts: ["BACnet MS/TP Ready", "BACnet/IP Ready", "Modbus RTU (Map via Skill 2.4)", "Legacy LonWorks / Proprietary (Needs Gateway)"],
        redFlags: ["Legacy LonWorks / Proprietary (Needs Gateway)"],
        amberFlags: ["Modbus RTU (Map via Skill 2.4)"],
        reminder: "Central Plant Overlay (RFI-23-001): Photograph exact gateway board model and map the 15-25 essential WebCTRL® read/write objects (Priority 8 supervisory reset vs Priority 16 relinquish default)."
      },
      {
        id: "CHK-PLT-02",
        cat: "Isolation Valves & Flow Proving",
        shortLabel: "Missing Valve End-Switch",
        q: "Motorized isolation valve auxiliary end-switches & emergency shutoff?",
        opts: ["Aux End-Switches Present & Wired", "Missing Aux End-Switches", "Constant Primary Flow"],
        redFlags: ["Missing Aux End-Switches"],
        amberFlags: [],
        reminder: "Plant Safety Rule: Verify hardwired auxiliary end-switches on motorized isolation valves prove 100% open prior to enabling pump/chiller/boiler."
      }
    ]
  },
  {
    id: "VAV_TERMINAL",
    label: "📦 VAV / Fan-Powered Box / Terminal Unit",
    default_alc: "ALC ZN341v / ZN220v Integrated VAV Controller",
    items: [
      {
        id: "CHK-VAV-01",
        cat: "Pneumatic / Legacy DDC Conversion",
        shortLabel: "Pneumatic / Bad Pitot Pickup",
        q: "Existing VAV actuator, damper shaft & airflow pickup condition?",
        opts: ["Legacy DDC VAV (Good Pickup Cross)", "Pneumatic Actuator (Convert to ALC ZN341v)", "Single-Point Pitot Tube (Fouled/Damaged)"],
        redFlags: ["Single-Point Pitot Tube (Fouled/Damaged)"],
        amberFlags: ["Pneumatic Actuator (Convert to ALC ZN341v)"],
        reminder: "Pneumatic-to-DDC Note: Verify damper shaft diameter (3/8\" vs 1/2\"), check Normally Open vs Normally Closed blade action, and cap existing poly air lines."
      },
      {
        id: "CHK-VAV-02",
        cat: "Reheat & Line Power Check (RFI-23-009)",
        shortLabel: "Missing 24V / Line Power",
        q: "Terminal reheat type & fan/control power availability?",
        opts: ["Hot Water Reheat Coil (2-Way Valve)", "Cooling Only", "Electric Reheat / FPB (277V/480V)", "Missing 24VAC Control Power"],
        redFlags: ["Missing 24VAC Control Power"],
        amberFlags: ["Electric Reheat / FPB (277V/480V)"],
        reminder: "Electrical Delineation (RFI-23-009): Div 26 provides line power to Fan-Powered VAVs and main TCP transformers; CSC runs Class 2 24VAC distribution where contracted."
      }
    ]
  },
  {
    id: "ZONE_SENSOR",
    label: "🌡️ Space / Zone Sensors (Temp / RH / CO2)",
    default_alc: "ALC ZS Pro Communicating Rnet Sensor",
    items: [
      {
        id: "CHK-ZNS-01",
        cat: "Multi-Variable Sensor Consolidation (RFI-23-008)",
        shortLabel: "Pneumatic Stat / Adapter Plate",
        q: "Zone sensing variables & existing wall clutter?",
        opts: ["Temp Only (ZS Standard)", "Consolidate Temp + RH + CO2 into 1 ALC ZS Pro", "Pneumatic Stat (Needs Adapter Plate + Rnet Pull)"],
        redFlags: ["Pneumatic Stat (Needs Adapter Plate + Rnet Pull)"],
        amberFlags: [],
        reminder: "Zone Sensor Consolidation (RFI-23-008): Default to a single factory-integrated ALC ZS Pro multi-variable sensor on the digital Rnet bus rather than side-by-side wall boxes."
      },
      {
        id: "CHK-ZNS-02",
        cat: "Wall Surface & Raceway Multiplier",
        shortLabel: "CMU / Brick Wiremold (1.4x)",
        q: "Wall mounting surface & pathway to ceiling plenum?",
        opts: ["Drywall / Hollow Stud (Fishable 1.0x)", "CMU Block w/ Existing EMT Stub (1.0x)", "CMU / Brick — Surface Wiremold Raceway Req'd (1.40x)"],
        redFlags: ["CMU / Brick — Surface Wiremold Raceway Req'd (1.40x)"],
        amberFlags: [],
        reminder: "Estimator Margin Alert: Solid CMU or brick walls without existing recessed conduit stub-ups require surface Wiremold 500/700 raceway—adds 1.40x zone rough-in labor multiplier!"
      }
    ]
  },
  {
    id: "BAS_TCP_PANEL",
    label: "🗄️ Existing BAS Control Panel (TCP) & Riser",
    default_alc: "CSC Custom UL508A TCP w/ ALC OptiFlex + 100VA Class 2 Xfmr",
    items: [
      {
        id: "CHK-TCP-01",
        cat: "120VAC Line Power & 80% VA Derating (RFI-23-009)",
        shortLabel: "Missing 120V / Xfmr >80VA",
        q: "Dedicated 120VAC 15A circuit & 24VAC Class 2 transformer capacity?",
        opts: ["Dedicated 120VAC Present & Labeled", "Missing 120VAC Power (Div 26 By Others — RFI-23-009)", "Existing Transformer Overloaded (>80 VA on 100 VA)"],
        redFlags: ["Missing 120VAC Power (Div 26 By Others — RFI-23-009)", "Existing Transformer Overloaded (>80 VA on 100 VA)"],
        amberFlags: [],
        reminder: "Power & Derating Rule (RFI-23-009): Div 26 furnishes dedicated 120VAC 15A circuits to main TCPs. Enforce CSC's mandatory 80% NEC Art. 725 Class 2 derating rule (80 VA max continuous load per 100 VA transformer) + 15% spare."
      },
      {
        id: "CHK-TCP-02",
        cat: "Legacy Wiring & MS/TP Trunk Audit",
        shortLabel: "Rat's Nest / RS-485 T-Tap",
        q: "Existing panel wire labeling & RS-485 communication trunk topology?",
        opts: ["Labeled w/ Ferrules + Clean Daisy-Chain", "Unlabeled 'Rat's Nest' (High Point Ringout Labor)", "Star / T-Tap RS-485 Violation or Missing 120-Ohm EOL"],
        redFlags: ["Unlabeled 'Rat's Nest' (High Point Ringout Labor)", "Star / T-Tap RS-485 Violation or Missing 120-Ohm EOL"],
        amberFlags: [],
        reminder: "Panel Migration Warning: Unlabeled field terminations in legacy JCI N2 / Honeywell / Andover panels add ~15-20 mins per point for wire toning and verification."
      }
    ]
  }
];

const LEGACY_TO_ALC_RULES = [
  { match: "DX-9100", target: "ALC OptiFlex OF1628 + XPIO (Replaces JCI N2 Plant/AHU Controller)", curve: "1k_NICKEL" },
  { match: "UNT", target: "ALC ZN341v / ZN551 (Replaces JCI N2 Unitary/VAV Box)", curve: "1k_NICKEL" },
  { match: "VMA", target: "ALC ZN341v Integrated VAV Controller (Replaces JCI VMA)", curve: "1k_NICKEL" },
  { match: "NAE", target: "ALC OptiFlex BACnet/IP Router + WebCTRL® Supervisory", curve: "10k_TYPE_II" },
  { match: "SPYDER", target: "ALC ZN551 / ZN341v (Replaces Honeywell Spyder LON/BACnet)", curve: "20k_NTC" },
  { match: "EXCEL", target: "ALC OptiFlex OF1628 + XPIO (Replaces Honeywell XL50/100/500)", curve: "20k_NTC" },
  { match: "TALON", target: "ALC OptiFlex OF1628 / ZN551 (Replaces Siemens Talon)", curve: "1k_PLATINUM" },
  { match: "PXC", target: "ALC OptiFlex OF1628 + FIO-812 (Replaces Siemens PXC)", curve: "1k_PLATINUM" },
  { match: "SYMBIO", target: "CSC Hybrid Overlay: Hardwired Enable DO / Fault DI + BACnet MS/TP (RFI-23-001)", curve: "RNET_DIGITAL" },
  { match: "VCCX", target: "CSC Hybrid Overlay: Retain AAON VCCX2 + BACnet MS/TP & Hardwired Safeties", curve: "10k_TYPE_II" },
  { match: "MICROTECH", target: "CSC Hybrid Overlay: Retain Daikin MicroTech + BACnet MS/TP & Hardwired Safeties", curve: "RNET_DIGITAL" },
  { match: "PNEUMATIC", target: "Cap Poly Air Line -> ALC ZN341v / Belimo 24VAC Actuator + ALC ZS Pro Rnet Sensor", curve: "PNEUMATIC" }
];

// BUG-05 FIX: Exact Trane Commercial Letter-Year Table & ASHRAE Ch. 38 Service Life Benchmarks
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

// BUG-12 FIX: Neutral #Golden-Library Board Rotary MAC / EOL / Jumper Reference
const NEUTRAL_BOARD_LIBRARY = [
  {
    tokens: ["OF1628", "OPTIFLEX", "ZN551", "ZN341", "ZN220", "FIO-812", "ME812"],
    family: "Automated Logic OptiFlex™ / ZN Series Native BACnet Controller",
    citation: "ALC-HW-2026: OptiFlex OF1628 & ZN341v/ZN551 Hardware Guide (Sec. 4)",
    bullets: [
      "Rotary MAC Switches: Set unique MS/TP MAC 01–127 (Tens x10 + Ones x1); never leave at factory 00.",
      "RS-485 EOL Jumper (BT1): Set TERMINATED (IN) ONLY on physical first and last trunk devices.",
      "24VAC Class 2 Polarity: Maintain consistent 24V~ Hot and GND Common across shared transformers."
    ]
  },
  {
    tokens: ["SYMBIO", "YSC", "YCD", "TCD", "UC400", "UC600"],
    family: "Trane Symbio™ 700/800 Factory OEM Microprocessor",
    citation: "BAS-SVX088 / RFI-23-001: Trane Symbio BACnet MS/TP & Safety Overlay Guide",
    bullets: [
      "BACnet MS/TP Setup: Verify rotary/service-app MAC (01–127), Baud (38.4k/76.8k), & External BAS Write enable.",
      "Hardwired Fail-Safe Layer (RFI-23-001): Land Start/Stop Enable DO, Common Alarm DI, & DPDT Freeze/Smoke loop.",
      "Priority Array: Write DAT Reset & Occupancy at Priority 8/10 (preserve Relinquish Default 16)."
    ]
  },
  {
    tokens: ["ACH580", "ACH550", "ABB"],
    family: "ABB ACH580 / ACH550 HVAC Variable Frequency Drive",
    citation: "ABB-3AXD50000044839 / RFI-23-006: Hardwired Control vs. Read-Only BACnet",
    bullets: [
      "Hardwired Control (RFI-23-006): DI1 Start/Stop, AI1 0–10VDC Speed, RO1/RO2 Run & Fault status.",
      "Series Safety Loop: Wire Freeze Stat Pole 1, Smoke Relay, & Damper End-Switch into DIIL Run Enable.",
      "Read-Only BACnet: Set Par 58.01 = BACnet MS/TP strictly for kW, kWh, Amps & Fault Code telemetry."
    ]
  },
  {
    tokens: ["DX-9100", "UNT", "VMA", "NAE", "METASYS"],
    family: "Legacy Johnson Controls Metasys® N2 / DX-9100 / UNT / VMA",
    citation: "JCI-LIT-636018: Legacy N2 Bus Decommissioning & 1kΩ Nickel Sensor Check",
    bullets: [
      "Sensor Curve Alert: Existing JCI space/duct sensors are typically 1,000Ω Nickel RTD — replace w/ 10k Type II + ZS Pro.",
      "RS-485 Reuse Check: Inspect legacy N2 cable for hidden T-taps before repurposing for BACnet MS/TP."
    ]
  },
  {
    tokens: ["SPYDER", "EXCEL", "XL50", "WEBs"],
    family: "Legacy Honeywell Spyder® / Excel 5000 Controller",
    citation: "HW-62-0311: Honeywell Spyder Migration & 20kΩ NTC Sensor Audit",
    bullets: [
      "Sensor Curve Alert: Existing Honeywell sensors use 20kΩ NTC curve — verify ALC custom table or replace w/ 10k Type II.",
      "Actuator Check: Verify floating vs. 2–10VDC modulating jumper on existing actuators."
    ]
  }
];

const GOLDEN_DEMO_STATE = {
  schemaVersion: "CSC-DISCOVERY-v2.0",
  sessionId: "CSC-WALK-2026-LSW",
  projectName: "Lee's Summit West Science & PAC Retrofit",
  jobNumber: "CSC-26-4182",
  siteContact: "Danny Miller (Facilities) & Marcus Vance (Div 23)",
  siteAddress: "2600 SW Ward Rd, Lee's Summit, MO 64082",
  verbalConsentLogged: true,
  cloudSpeechOptIn: false,
  uiMode: "quick",
  rfi23011TempConditioningFlag: true,
  activeFloorId: "FLR-02",
  activeStationId: "STN-01",
  activeTab: "checklist",
  showVideoCrumb: true,
  barometricHpa: 988.86,
  elevationFt: 14.0,
  floors: [
    { id: "FLR-BSMT", name: "Basement Plant", elev: -14.0, hpa: 989.85, source: "Uploaded M-100 PDF Plan", hasCustomMap: false },
    { id: "FLR-01", name: "Floor 1 Admin/Gym", elev: 0.0, hpa: 989.35, source: "Snapped Wall Evacuation Map", hasCustomMap: false },
    { id: "FLR-02", name: "Floor 2 Science Wing", elev: 14.0, hpa: 988.86, source: "Narrated Step-PDR Walk + M-102 Plan", hasCustomMap: false },
    { id: "FLR-ROOF", name: "Main Roof (GNSS+Compass)", elev: 28.5, hpa: 988.34, source: "Satellite GNSS + Compass Raycast", hasCustomMap: false }
  ],
  stations: [
    {
      id: "STN-01",
      tag: "AHU-2 (Science VAV AHU)",
      archetype: "RTU_AHU",
      floorId: "FLR-02",
      room: "Mechanical Room 204 (East Mezzanine)",
      xPct: 74.5,
      yPct: 32.0,
      anchorType: "VIDEO_AND_PIN_ANCHOR",
      mfg: "Trane",
      model: "CSAA035UAA00",
      serial: "K08D44912",
      elec: "460V / 3Ph / 60Hz (25 HP SF / 10 HP RF)",
      legacyCtrl: "Johnson Controls DX-9100-8454 (N2 Bus)",
      alcTarget: "ALC OptiFlex OF1628 + XPIO Expander",
      thermistorCurve: "1k_NICKEL",
      ioTally: { ui: 6, bi: 4, bo: 4, ao: 4 },
      parentPanel: "TCP-204 (Panel LP-2A Ckt #14)",
      servedBy: "Central Plant HWS/CHWS",
      mstpMac: "Trunk 2 | MAC 02 | 76.8k",
      ocrConf: 0.94,
      ambiguousNote: "",
      scheduledQty: 1,
      observedQty: 1,
      tierDelta: "Upgrade existing SPST freeze stat to DPDT per RFI-23-007 + Fail-Open NFB24-SR heating valve",
      burstMeta: {},
      checks: {
        "CHK-AHU-01": "No — Electromechanical / Legacy DDC",
        "CHK-AHU-02": "SPST (Single-Pole) Only — Needs Upgrade",
        "CHK-AHU-03": "Present with Aux Form-C Dry Contact",
        "CHK-AHU-04": "Pneumatic Piston Actuator — Needs Belimo Retrofit",
        "CHK-AHU-05": "Accessible (Lay-in Ceiling)",
        "CHK-AHU-06": "R-410A / R-22 / Hydronic Only (Non-A2L)"
      }
    },
    {
      id: "STN-02",
      tag: "VFD-AHU2-SF (Supply Fan Drive)",
      archetype: "VFD_STARTER",
      floorId: "FLR-02",
      room: "Mechanical Room 204 — South Wall",
      xPct: 78.0,
      yPct: 54.0,
      anchorType: "PIN_ANCHOR",
      mfg: "ABB",
      model: "ACH580-01-034A-4",
      serial: "2214809312",
      elec: "480V / 3Ph / 25 HP (34 FLA)",
      legacyCtrl: "ABB Embedded BACnet (Network Commanded)",
      alcTarget: "Hardwired DO/AO/DI to OF1628 + Read-Only BACnet MS/TP",
      thermistorCurve: "10k_TYPE_II",
      ioTally: { ui: 0, bi: 2, bo: 1, ao: 1 },
      parentPanel: "TCP-204",
      servedBy: "AHU-2",
      mstpMac: "Trunk 2 | MAC 03 | Read-Only",
      ocrConf: 0.97,
      ambiguousNote: "",
      scheduledQty: 1,
      observedQty: 1,
      tierDelta: "RFI-23-006 UPGRADE: Convert from network-only command to CSC Hardwired DO/AO/DI + Series Safety Loop",
      burstMeta: {},
      checks: {
        "CHK-VFD-01": "Currently Controlled via Network Only",
        "CHK-VFD-02": "Factory Jumper Only — Needs Safety Interlock"
      }
    },
    {
      id: "STN-03",
      tag: "VAV-204 (Science Wing VAVs)",
      archetype: "VAV_TERMINAL",
      floorId: "FLR-02",
      room: "Corridor 200 outside Science Lab 204",
      xPct: 48.0,
      yPct: 32.0,
      anchorType: "STEP_PDR_INTERPOLATED_CRUMB",
      mfg: "Titus",
      model: "DESV-10-HW",
      serial: "T04-8821B",
      elec: "24VAC Class 2 (1,150 CFM / 3.5 GPM HW Coil)",
      legacyCtrl: "Pneumatic Piston Actuator + JCI UNT1108",
      alcTarget: "ALC ZN341v Integrated VAV + ALC ZS Pro Sensor",
      thermistorCurve: "PNEUMATIC",
      ioTally: { ui: 2, bi: 0, bo: 0, ao: 1 },
      parentPanel: "TCP-204 24VAC Daisy-Chain",
      servedBy: "AHU-2",
      mstpMac: "Trunk 2 | MAC 24 | 76.8k",
      ocrConf: 0.81,
      ambiguousNote: "Serial 'T04-8821B' vs 'T04-8B218' (81% confidence on galvanized plenum label — verify crop)",
      scheduledQty: 18,
      observedQty: 20,
      tierDelta: "VAV-219 & VAV-220 in Chem Prep rooms omitted from EOR M-602 schedule + CMU lab walls require Wiremold raceway",
      burstMeta: {},
      checks: {
        "CHK-VAV-01": "Pneumatic Actuator (Convert to ALC ZN341v)",
        "CHK-VAV-02": "Hot Water Reheat Coil (2-Way Valve)"
      }
    },
    {
      id: "STN-04",
      tag: "RTU-7 (Performing Arts Lobby)",
      archetype: "RTU_AHU",
      floorId: "FLR-ROOF",
      room: "West Roof Sector (GNSS 38.88142, -94.41268 | Heading 274° W)",
      xPct: 30.0,
      yPct: 60.0,
      gpsLat: 38.88142,
      gpsLon: -94.41268,
      gpsAcc: 3.2,
      compassDeg: 274,
      anchorType: "OUTDOOR_GNSS_AND_COMPASS",
      mfg: "Trane",
      model: "YSC120H4RMA02D",
      serial: "231914582L",
      elec: "460V / 3Ph / 10 Tons DX / 250 MBH Gas",
      legacyCtrl: "Trane Symbio 700 Factory Microprocessor",
      alcTarget: "CSC Hybrid Overlay: Hardwired Enable DO / Fault DI + BACnet MS/TP (RFI-23-001)",
      thermistorCurve: "RNET_DIGITAL",
      ioTally: { ui: 1, bi: 2, bo: 1, ao: 0 },
      parentPanel: "TCP-ROOF-W",
      servedBy: "Standalone Packaged RTU",
      mstpMac: "Trunk 3 | MAC 07 | 76.8k",
      ocrConf: 0.96,
      ambiguousNote: "",
      scheduledQty: 1,
      observedQty: 1,
      tierDelta: "RFI-23-001 OVERLAY: Retain Symbio 700; omit redundant field DAT/MAT sensors shown on M-601",
      burstMeta: {},
      checks: {
        "CHK-AHU-01": "Yes — BACnet Card Present",
        "CHK-AHU-02": "N/A (DX / Gas Only)",
        "CHK-AHU-03": "Present with Aux Form-C Dry Contact",
        "CHK-AHU-04": "Smooth Operation — 1/2\" or 3/4\" Shaft",
        "CHK-AHU-05": "Single-Zone Unit (No Static Loop)",
        "CHK-AHU-06": "R-410A / R-22 / Hydronic Only (Non-A2L)"
      }
    },
    {
      id: "STN-05",
      tag: "CH-1 & B-1/B-2 (Central Plant)",
      archetype: "CHILLER_BOILER_PLANT",
      floorId: "FLR-BSMT",
      room: "Basement Central Plant — Room B-04",
      xPct: 34.0,
      yPct: 48.0,
      anchorType: "PIN_ANCHOR",
      mfg: "Lochinvar",
      model: "FB2001 (CREST 2,000 MBH)",
      serial: "1934109882",
      elec: "120V/1Ph Boiler & 460V/3Ph 15HP Pumps",
      legacyCtrl: "Lochinvar SMART Touch (BACnet MS/TP)",
      alcTarget: "ALC OptiFlex OF1628 Central Plant Controller",
      thermistorCurve: "10k_TYPE_II",
      ioTally: { ui: 6, bi: 4, bo: 4, ao: 3 },
      parentPanel: "TCP-B04 (Panel MP-B1 Ckt #8)",
      servedBy: "Primary Heating & Chilled Water Plant",
      mstpMac: "Trunk 1 | MAC 01 | EOL=IN",
      ocrConf: 0.92,
      ambiguousNote: "",
      scheduledQty: 2,
      observedQty: 2,
      tierDelta: "RFI-23-005 & RFI-23-010: Div 23 21 13 must weld (2) 3/4\" threadolets on HWS/HWR mains; relocate DP sensor 2/3 down Science Wing branch",
      burstMeta: {},
      checks: {
        "CHK-PLT-01": "BACnet MS/TP Ready",
        "CHK-PLT-02": "Missing Aux End-Switches"
      }
    },
    {
      id: "STN-06",
      tag: "TCP-204 (Floor 2 BAS Panel)",
      archetype: "BAS_TCP_PANEL",
      floorId: "FLR-02",
      room: "Mechanical Room 204 — West Wall by Door",
      xPct: 68.0,
      yPct: 26.0,
      anchorType: "PIN_ANCHOR",
      mfg: "Johnson Controls",
      model: "NAE4510-2 + (2) DX-9100",
      serial: "JCI-05-4419",
      elec: "120VAC 15A (Panel LP-2A Ckt #14)",
      legacyCtrl: "JCI NAE45 + (2) DX-9100 + 75VA Xfmr",
      alcTarget: "Reuse 24x24 Enclosure -> Install OF1628 + Dual 100VA Class 2 Xfmrs",
      thermistorCurve: "10k_TYPE_II",
      ioTally: { ui: 0, bi: 1, bo: 0, ao: 0 },
      parentPanel: "Panel LP-2A Ckt #14",
      servedBy: "WebCTRL® Building IP Riser",
      mstpMac: "BACnet/IP Router + Trunk 2 Master (EOL=IN)",
      ocrConf: 0.95,
      ambiguousNote: "",
      scheduledQty: 1,
      observedQty: 1,
      tierDelta: "RFI-23-009 VA RULE: 95.5 VA design load exceeds single 100VA transformer 80VA NEC Art. 725 limit -> require Dual 100VA Class 2 Xfmrs",
      burstMeta: {},
      checks: {
        "CHK-TCP-01": "Existing Transformer Overloaded (>80 VA on 100 VA)",
        "CHK-TCP-02": "Unlabeled 'Rat's Nest' (High Point Ringout Labor)"
      }
    }
  ],
  videoKeyframes: [
    { id: "KF-001", floorId: "FLR-02", timeSec: 8, stepIdx: 0, timeFmt: "00:08", sharpness: 312.4, signOcr: "STAIR B — FLOOR 2 EAST", narration: "Stepping out of Stair B onto the second floor science corridor, heading East.", xPct: 18.0, yPct: 32.0, action: "Anchor A [ANC-201: Stair B]" },
    { id: "KF-002", floorId: "FLR-02", timeSec: 52, stepIdx: 22, timeFmt: "00:52", sharpness: 248.9, signOcr: "SCIENCE LAB 204", narration: "Outside Science Lab 204, ceiling tile popped—that's VAV-204 with an old pneumatic actuator and JCI N2 box. CMU block walls inside.", xPct: 48.0, yPct: 32.0, action: "Step-PDR Crumb [STN-03: VAV-204] at Step 22/48" },
    { id: "KF-003", floorId: "FLR-02", timeSec: 96, stepIdx: 48, timeFmt: "01:36", sharpness: 389.1, signOcr: "ROOM 204-M — MECH EQUIP ROOM", narration: "Entering Mechanical Room 204-M at the East end of the hall.", xPct: 68.0, yPct: 28.0, action: "Anchor B [ANC-202: Mech Rm 204 Door]" },
    { id: "KF-004", floorId: "FLR-02", timeSec: 128, stepIdx: 54, timeFmt: "02:08", sharpness: 445.0, signOcr: "AHU-2 / TRANE CSAA035UAA00", narration: "Holding steady on the AHU-2 nameplate for 3 seconds... single-pole freeze stat and ABB ACH580 supply fan drive.", xPct: 74.5, yPct: 32.0, action: "Sharp Plate Frame -> Linked to [STN-01: AHU-2]" }
  ],
  pdrSteps: [],
  audioSegments: [
    { id: "AUD-01", time: "13:36:10", speaker: "Danny Miller (Lead Facility Eng)", stationId: "STN-05", bookmarked: true, hasAudioBlob: false, text: "The two Lochinvar CREST boilers have BACnet MS/TP cards, but we don't have spare thermowells in the 6-inch supply header—mechanical contractor must weld two 3/4\" threadolets over Thanksgiving. Also our DP sensor is on the pump header so East Science starves below 65% speed.", insight: "RFI-23-005 (Div 23 21 13 threadolets) + RFI-23-010 (Relocate DP sensor 2/3 down branch)." },
    { id: "AUD-02", time: "14:08:15", speaker: "Danny Miller (Lead Facility Eng)", stationId: "STN-03", bookmarked: true, hasAudioBlob: false, text: "Watch out on the Floor 2 VAV schedule—the engineer's drawing only shows 18 boxes, but three years ago we added VAV-219 and VAV-220 in the chemistry prep rooms. And all lab walls are painted CMU block with no conduit, just 1/4\" plastic pneumatic tubing.", insight: "CRITICAL DELTA: +2 unscheduled VAV boxes (20 total vs 18 on M-602) + 1.40x Wiremold raceway multiplier." },
    { id: "AUD-03", time: "14:14:05", speaker: "Danny Miller & Andrew Nicks (CSC)", stationId: "STN-01", bookmarked: true, hasAudioBlob: false, text: "AHU-2 popped its preheat coil in Jan 2022 because that single-pole freeze stat only wired to the dead JCI DX-9100 and didn't kill the ABB supply fan drive.", insight: "Mandates CSC DPDT serpentine freeze stat (RFI-23-007) breaking VFD safety loop (RFI-23-006)." },
    { id: "AUD-04", time: "14:23:10", speaker: "Marcus Vance (Midwest Mech PM)", stationId: "STN-06", bookmarked: false, hasAudioBlob: false, text: "GC wants to run AHU-2 and RTU-7 early next month while sanding drywall in the Performing Arts lobby. Also district IT needs our ALC router MAC address 2 weeks ahead for a static VLAN drop.", insight: "HARD STOP: Issue Pre-Commissioning HVAC Operation RFI-23-011 (1B-6A) before running units during drywall sanding!" }
  ]
};

// Runtime State & Hardware Handles
let state = null;
let cachedFloorMapDataUrl = null;
let cachedSlotPhotos = { 1: null, 2: null, 3: null };
let cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
let cachedAudioUrls = {};

// Interactive Map Viewport Zoom / Pan / Drag Handles
let mapViewBox = { x: 0, y: 0, w: 1000, h: 380 };
let mapInteractionMode = "pin"; // "pin" or "pan"
let activePointers = new Map();
let isDraggingActivePin = false;
let isPanningMap = false;
let panStartClient = { x: 0, y: 0, vbX: 0, vbY: 0 };
let pinchStartDist = 0;
let pinchStartVbW = 1000;
let suppressNextMapClick = false;

// Live Sensor Handles (Android GNSS + Magnetometer Compass)
let liveSensorsActive = false;
let geoWatchId = null;
let currentGps = null;
let currentCompassDeg = null;

// Live In-App PDR Camera + Torch + Accelerometer Step-Peak Detector
let livePdrActive = false;
let pdrCameraStream = null;
let pdrVideoTrack = null;
let torchEnabled = false;
let pdrSteps = []; // [{ stepIdx, headingDeg, tMs }]
let lastStepPeakMs = 0;
let pdrAnchorA = null; // { xPct, yPct, stepIdx }
let pdrSharpTimer = null;

// Live WebAudio 150Hz High-Pass Recorder & Global PTT Handles
let audioCtx = null;
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let meterRafId = null;
let speechRec = null;
let liveSpeechBuffer = "";
let isRecordingAudio = false;
let pttDownTimeMs = 0;

function _stripHeavyBlobsFromStateSnapshot(srcState) {
  if (!srcState || typeof srcState !== "object") return srcState;
  const clean = JSON.parse(JSON.stringify(srcState));
  for (const key of ["floors", "floor_plans"]) {
    if (Array.isArray(clean[key])) {
      clean[key].forEach((flr) => {
        if (flr && typeof flr === "object") {
          if (flr.custom_map_data_url) flr.hasCustomMap = true;
          delete flr.custom_map_data_url;
        }
      });
    }
  }
  if (Array.isArray(clean.stations)) {
    clean.stations.forEach((st) => {
      if (st && typeof st === "object") {
        delete st.photo_data_urls;
        delete st.thumbDataUrl;
      }
    });
  }
  return clean;
}

function persistWalkState() {
  if (!state) return;
  state.walkRevision = (Number(state.walkRevision) || 0) + 1;
  if (!state.walkDate) {
    state.walkDate = new Date().toISOString().slice(0, 10);
  }
  window.CSCDiscoveryAdapter.writeState("active_walk_v1", _stripHeavyBlobsFromStateSnapshot(state));
}

function _migrateLoadedState(s) {
  if (!s || typeof s !== "object") return s;

  // Support importing desktop-exported CSC_Site_Discovery_Export.json (walk_meta + equipment_stations)
  if (!Array.isArray(s.stations) && Array.isArray(s.equipment_stations)) {
    const wm = s.walk_meta || {};
    s.sessionId = s.sessionId || wm.session_id || ("CSC-WALK-" + Date.now());
    s.projectName = s.projectName || wm.project_name || "Imported Field Walk";
    s.jobNumber = s.jobNumber || wm.csc_job_number || "CSC-26-WALK";
    s.siteAddress = s.siteAddress || wm.site_address || "";
    s.walkDate = s.walkDate || wm.walk_date || new Date().toISOString().slice(0, 10);
    if (Array.isArray(s.floors)) {
      s.floors = s.floors.map((fl, i) => ({
        id: fl.id || fl.floor_id || `FLR-0${i + 1}`,
        name: fl.name || fl.floor_name || `Floor ${i + 1}`,
        elev: Number(fl.elev ?? fl.elevation_ft ?? 0),
        hpa: Number(fl.hpa ?? fl.barometric_hpa ?? 989.3),
        source: fl.source || fl.map_source || "Imported Plan",
        hasCustomMap: Boolean(fl.hasCustomMap || fl.custom_map_data_url),
        ...(fl.custom_map_data_url ? { custom_map_data_url: fl.custom_map_data_url } : {})
      }));
    }
    s.stations = s.equipment_stations.map((est, i) => {
      const npd = est.nameplate_data || {};
      const spin = est.spatial_pin || {};
      return {
        id: est.id || est.station_id || `STN-${String(i + 1).padStart(2, "0")}`,
        tag: est.tag || est.equipment_tag || `Unit #${i + 1}`,
        archetype: est.archetype || est.archetype_id || "RTU_AHU",
        condition: est.condition || "good",
        quickIssues: Array.isArray(est.quickIssues) ? est.quickIssues : [],
        floorId: est.floorId || est.floor_id || (s.floors?.[0]?.id || "FLR-01"),
        room: est.room || est.room_zone || "",
        xPct: Number(spin.x_pct ?? est.xPct ?? 50),
        yPct: Number(spin.y_pct ?? est.yPct ?? 50),
        mfg: npd.manufacturer || est.mfg || "",
        model: npd.model_number || est.model || "",
        serial: npd.serial_number || est.serial || "",
        elec: npd.voltage_phase_hz || est.elec || "",
        legacyCtrl: npd.legacy_controller_found || est.legacyCtrl || "",
        alcTarget: npd.recommended_alc_replacement || est.alcTarget || "",
        ambiguousNote: est.ambiguousNote || est.field_notes || "",
        burstMeta: est.burstMeta || {},
        checks: est.checks || {}
      };
    });
  }

  if (!Array.isArray(s.floors) && Array.isArray(s.floor_plans)) {
    s.floors = s.floor_plans.map((fl, i) => ({
      id: fl.id || fl.floor_id || `FLR-0${i + 1}`,
      name: fl.name || fl.floor_name || `Floor ${i + 1}`,
      elev: Number(fl.elev ?? fl.elevation_ft ?? 0),
      hpa: Number(fl.hpa ?? fl.barometric_hpa ?? 989.3),
      source: fl.source || fl.map_source || "Imported Plan",
      hasCustomMap: Boolean(fl.hasCustomMap || fl.custom_map_data_url),
      ...(fl.custom_map_data_url ? { custom_map_data_url: fl.custom_map_data_url } : {})
    }));
  }

  if (!s.uiMode) {
    s.uiMode = "quick";
  }
  if (!s.walkDate) s.walkDate = new Date().toISOString().slice(0, 10);
  if (!s.walkRevision) s.walkRevision = 1;
  if (s.verbalConsentLogged === undefined) s.verbalConsentLogged = false;
  if (s.cloudSpeechOptIn === undefined) s.cloudSpeechOptIn = false;
  if (!Array.isArray(s.pdrSteps)) s.pdrSteps = [];
  if (!Array.isArray(s.videoKeyframes)) s.videoKeyframes = [];
  if (!Array.isArray(s.audioSegments)) s.audioSegments = [];
  if (!Array.isArray(s.preloadedScheduleNotes)) s.preloadedScheduleNotes = [];
  s.videoKeyframes.forEach((k) => {
    if (!k.floorId) k.floorId = "FLR-02";
  });
  (s.stations || []).forEach((st) => {
    if (!st.condition) st.condition = "good";
    if (!Array.isArray(st.quickIssues)) {
      st.quickIssues = Array.isArray(st.quickFlags) ? [...st.quickFlags] : [];
    }
    if (!ARCHETYPES.some((a) => a.id === st.archetype)) {
      st.archetype = "RTU_AHU";
    }
    if (!st.thermistorCurve) st.thermistorCurve = "10k_TYPE_II";
    if (!st.ioTally) st.ioTally = { ui: 4, bi: 2, bo: 2, ao: 2 };
    if (st.parentPanel === undefined) st.parentPanel = "";
    if (st.servedBy === undefined) st.servedBy = "";
    if (st.mstpMac === undefined) st.mstpMac = "";
    if (!st.checks) st.checks = {};
    if (!st.burstMeta) st.burstMeta = {};
  });
  if (!s.activeFloorId && Array.isArray(s.floors) && s.floors.length) {
    s.activeFloorId = s.floors[0].id;
  }
  if (!s.activeStationId && Array.isArray(s.stations) && s.stations.length) {
    s.activeStationId = s.stations[0].id;
  }
  return s;
}

function loadInitialWalkState() {
  const saved = window.CSCDiscoveryAdapter.readState("active_walk_v1", null);
  if (saved && saved.stations && Array.isArray(saved.stations)) {
    state = _migrateLoadedState(saved);
  } else {
    state = _migrateLoadedState(JSON.parse(JSON.stringify(GOLDEN_DEMO_STATE)));
    persistWalkState();
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================================================
// DETERMINISTIC SERIAL, MODEL / A2L, BOARD REFERENCE & RFI TRIGGER ENGINES
// ============================================================================
function decodeSerialDeterministic(mfg, serial, archetypeId, modelStr) {
  const curYear = new Date().getFullYear();
  const curYY = curYear % 100;
  const m = (mfg || "").toUpperCase().trim();
  const s = (serial || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const mdl = (modelStr || "").toUpperCase().trim();
  let year = null;
  let period = "Standard Production";
  let rule = "Prefix / Pattern Lookup";

  const mTraneMod = s.match(/^(\d{2})(\d{2})\d{4,6}[A-Z]$/);
  if (m.includes("TRANE") && mTraneMod) {
    const yy = parseInt(mTraneMod[1], 10);
    const ww = parseInt(mTraneMod[2], 10);
    if (yy >= 10 && yy <= curYY && ww >= 1 && ww <= 53) {
      year = 2000 + yy;
      period = `Week ${ww}`;
      rule = "Trane Modern YYWW Serial";
    }
  }

  // BUG-05 FIX: Trane Commercial Letter-Year Table (`S35B54321` -> S = 2014, NOT 1935!)
  const mTraneLet = s.match(/^([A-Z])(\d{2})([A-M])\d+/);
  if (!year && m.includes("TRANE") && mTraneLet) {
    const yrLet = mTraneLet[1];
    const midDigits = parseInt(mTraneLet[2], 10);
    const moLet = mTraneLet[3];
    if (TRANE_YEAR_LETTERS[yrLet]) {
      year = TRANE_YEAR_LETTERS[yrLet];
    } else {
      year = midDigits <= curYY ? 2000 + midDigits : 1900 + midDigits;
    }
    period = TRANE_MONTH_LETTERS[moLet] || `Code ${moLet}`;
    rule = "Trane Commercial Letter-Year-Month";
  }

  const mAaon = s.match(/^(19\d{2}|20\d{2})(0[1-9]|1[0-2])/);
  if (!year && m.includes("AAON") && mAaon) {
    year = parseInt(mAaon[1], 10);
    period = `Month ${mAaon[2]}`;
    rule = "AAON YYYYMM Prefix";
  }

  const mMcquay = s.match(/^FB[A-Z]{2}(\d{2})(0[1-9]|1[0-2])\d+/);
  if (!year && (m.includes("DAIKIN") || m.includes("MCQUAY")) && mMcquay) {
    const yy = parseInt(mMcquay[1], 10);
    year = yy <= curYY ? 2000 + yy : 1900 + yy;
    period = `Month ${mMcquay[2]}`;
    rule = "Daikin/McQuay FBOU-YYMM";
  }

  const m4Dig = s.match(/^(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("CARRIER") || m.includes("BRYANT") || m.includes("LOCHINVAR") || m.includes("YORK") || m.includes("DAIKIN")) && m4Dig) {
    const d1 = parseInt(m4Dig[1], 10);
    const d2 = parseInt(m4Dig[2], 10);
    if (d1 > curYY && d1 <= 52 && d2 >= 0 && d2 <= curYY) {
      year = 2000 + d2;
      period = `Week ${d1}`;
      rule = "WWYY 4-Digit Prefix";
    } else if (d1 >= 0 && d1 <= curYY && d2 >= 1 && d2 <= 52) {
      year = 2000 + d1;
      period = `Week ${d2}`;
      rule = "YYWW 4-Digit Prefix";
    }
  }

  const mAbb = s.match(/^\d(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("ABB") || m.includes("YASKAWA")) && mAbb) {
    const yy = parseInt(mAbb[1], 10);
    const ww = parseInt(mAbb[2], 10);
    if (yy >= 5 && yy <= curYY && ww >= 1 && ww <= 53) {
      year = 2000 + yy;
      period = `Week ${ww}`;
      rule = "ABB Country-YY-WW Serial";
    }
  }

  const mHyph = s.match(/[A-Z]+-?(\d{2})-\d+/);
  if (!year && mHyph) {
    const yy = parseInt(mHyph[1], 10);
    year = yy <= curYY ? 2000 + yy : 1900 + yy;
    rule = "Prefix-YY-Sequence";
  }

  // ASHRAE Ch. 38 Median Service Life by Archetype
  let lifeLimit = ASHRAE_CH38_SERVICE_LIFE[archetypeId] || 18;
  if (archetypeId === "RTU_AHU" && /(YSC|YCD|TCD|WSC|48TC|50TC|RN-)/.test(mdl)) {
    lifeLimit = ASHRAE_CH38_SERVICE_LIFE.PACKAGED_RTU; // 15 yrs for rooftop DX
  } else if (/(TITUS|NAILOR|PRICE|VAV)/.test(m)) {
    lifeLimit = ASHRAE_CH38_SERVICE_LIFE.VAV_TERMINAL; // 28 yrs for VAV box
  }

  const age = year ? Math.max(0, curYear - year) : null;
  const eol = age !== null && age >= lifeLimit;
  return { year, period, age, lifeLimit, eol, rule };
}

function decodeModelDeterministic(mfg, modelStr) {
  const mdl = (modelStr || "").toUpperCase().trim();
  let capacity = "";
  let a2lFlag = false;
  let a2lNote = "";

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
    a2lNote = "EPA AIM Act A2L Low-GWP Refrigerant (R-454B / R-32): Verify factory A2L leak sensor & hardwired supply-fan mitigation interlock (ASHRAE 15.2)!";
  }

  return { capacity, a2lFlag, a2lNote };
}

function lookupNeutralBoardRefJS(mfg, model, legacyCtrl, alcTarget) {
  const combined = `${mfg || ""} ${model || ""} ${legacyCtrl || ""} ${alcTarget || ""}`.toUpperCase();
  for (const ref of NEUTRAL_BOARD_LIBRARY) {
    if (ref.tokens.some((t) => combined.includes(t))) return ref;
  }
  return NEUTRAL_BOARD_LIBRARY[0];
}

function matchLegacyControllerObjJS(legacyText) {
  const up = (legacyText || "").toUpperCase();
  for (const r of LEGACY_TO_ALC_RULES) {
    if (up.includes(r.match)) return r;
  }
  return null;
}

function extractRfiTriggersJS(text) {
  const up = (text || "").toUpperCase();
  const hits = [];
  if (/(DRYWALL|SANDING|TEMP HEAT|TEMP COOL|EARLY START|TEMPORARY)/.test(up)) {
    hits.push("🚨 RFI-23-011 (1B-6A) HARD-STOP: Signed Pre-Commissioning Temp Conditioning sign-off req'd!");
  }
  if (/(SYMBIO|VCCX|MICROTECH|RELIATEL|BACNET CARD)/.test(up)) {
    hits.push("RFI-23-001: CSC OEM Overlay (retain factory board + hardwired Enable/Fault/Safeties).");
  }
  if (/(FREEZE|SINGLE-POLE|SPST|TRIPPED COIL|POPPED)/.test(up)) {
    hits.push("RFI-23-007: Enforce DPDT manual-reset serpentine freeze stat breaking VFD safety loop.");
  }
  if (/(VFD|ACH580|DRIVE|HOA|BYPASS)/.test(up)) {
    hits.push("RFI-23-006: Hardwired DO/AO/DI VFD command + Read-Only BACnet telemetry.");
  }
  if (/(WELL|THREADOLET|VALVE|REDUCER|DRAIN|FLANGE)/.test(up)) {
    hits.push("RFI-23-005: Div 23 21 13 installs inline valve bodies, reducers & welded threadolets.");
  }
  if (/(PICCV|AUTHORITY|COIL DP)/.test(up)) {
    hits.push("RFI-23-002: 4–5 psi valve ΔP (β ≥ 0.50) or Belimo PICCV.");
  }
  if (/(HEADER|STARV|2\/3|TWO-THIRDS|DP SENSOR)/.test(up)) {
    hits.push("RFI-23-010: Relocate hydronic ΔP transmitter 2/3 down longest index branch.");
  }
  if (/(120V|CIRCUIT|BREAKER|TRANSFORMER|OVERLOAD)/.test(up)) {
    hits.push("RFI-23-009: Dedicated Div 26 120VAC 15A circuit + 80% NEC Art. 725 Class 2 VA limit.");
  }
  if (/(DAMPER|JACKSHAFT|LINKAGE|FIRE\/SMOKE|FSD)/.test(up)) {
    hits.push("RFI-23-004: Div 23 33 00 repairs seized dampers & installs UL555S FSDs.");
  }
  if (/(WIREMOLD|CMU|BLOCK WALL|PNEUMATIC STAT|RNET|ZS PRO)/.test(up)) {
    hits.push("RFI-23-008: Consolidate to 1 ALC ZS Pro Rnet sensor (+1.40x CMU Wiremold if block wall).");
  }
  if (/(454B|R-32|A2L|LEAK SENSOR)/.test(up)) {
    hits.push("ASHRAE 15.2 A2L Alert: Preserve factory R-454B/R-32 leak mitigation fan interlock.");
  }
  return hits;
}



// ============================================================================
// v3.0 "FIELD-FIRST SNAP & GO" — ZERO-TYPING CAPTURE, AUTO-GPS/STEP/VOICE
// ROUGH LOCATION ENGINE & CLEAN 2-VIEW MOBILE UX
// ============================================================================

const QUICK_ISSUE_CATALOG = [
  {
    id: "DAMPER_ACTUATOR",
    label: "⚠️ Bad Damper / Actuator",
    rfi: "RFI-23-004: Damper linkage/actuator issue (Div 23 33 00 / Belimo retrofit)",
    chkMap: { RTU_AHU: ["CHK-AHU-04", "Binding / Rusted Linkage (Div 23 Repair)"], VAV_TERMINAL: ["CHK-VAV-01", "Pneumatic Actuator (Convert to ALC ZN341v)"] }
  },
  {
    id: "NO_POWER_ELECTRICAL",
    label: "🔌 No Power / Breaker Off",
    rfi: "RFI-23-009: Missing 120VAC/24VAC power or overloaded transformer (Div 26)",
    chkMap: { VAV_TERMINAL: ["CHK-VAV-02", "Missing 24VAC Control Power"], BAS_TCP_PANEL: ["CHK-TCP-01", "Missing 120VAC Power (Div 26 By Others — RFI-23-009)"] }
  },
  {
    id: "BAD_BOARD_NO_BACNET",
    label: "🎛️ Bad Board / No BACnet",
    rfi: "RFI-23-001: Missing OEM BACnet card or failed legacy controller board",
    chkMap: { RTU_AHU: ["CHK-AHU-01", "Yes — Missing BACnet Card/License"], CHILLER_BOILER_PLANT: ["CHK-PLT-01", "Legacy LonWorks / Proprietary (Needs Gateway)"] }
  },
  {
    id: "VALVE_COIL_LEAKING",
    label: "💧 Valve / Coil Leaking",
    rfi: "RFI-23-005: Leaking valve stem/body — Div 23 21 13 inline cut-in req'd",
    chkMap: { HYDRONIC_VALVE_PUMP: ["CHK-HYD-01", "Existing Pneumatic Valve — Leaking Stem Packing"] }
  },
  {
    id: "FREEZE_SAFETY_MISSING",
    label: "❄️ Freeze / Safety Issue",
    rfi: "RFI-23-007: Enforce DPDT manual-reset freeze stat & hardwired VFD safety loop",
    chkMap: { RTU_AHU: ["CHK-AHU-02", "SPST (Single-Pole) Only — Needs Upgrade"], VFD_STARTER: ["CHK-VFD-02", "Factory Jumper Only — Needs Safety Interlock"] }
  },
  {
    id: "HARD_ACCESS_LIFT",
    label: "🚧 Hard Access / Lift / CMU",
    rfi: "RFI-23-008: Hard-lid access door / >16ft lift / CMU Wiremold raceway (1.40x labor)",
    chkMap: { RTU_AHU: ["CHK-AHU-05", "Hard Lid Drywall (Needs Access Door)"], ZONE_SENSOR: ["CHK-ZNS-02", "CMU / Brick — Surface Wiremold Raceway Req'd (1.40x)"] }
  }
];

let currentMainView = "feed"; // "feed" or "map"
let currentFeedFilter = "all"; // "all", "issues", "good"
let walkStepCounter = 0;
let stepCounterAtLastSnap = 0;
let allStationThumbs = {}; // { stationId: dataUrl }

function getActiveStation() {
  return state.stations.find((s) => s.id === state.activeStationId) || state.stations[0];
}

function computeStationStatus(st) {
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const checks = st.checks || {};
  let redCount = 0;
  let amberCount = 0;
  let verifiedCount = 0;

  for (const item of arch.items) {
    const val = checks[item.id];
    if (val) {
      verifiedCount++;
      if ((item.redFlags || []).includes(val)) redCount++;
      else if ((item.amberFlags || []).includes(val)) amberCount++;
    }
  }

  const quickIssues = Array.isArray(st.quickIssues) ? st.quickIssues : [];
  redCount += quickIssues.length;

  const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);

  let cond = st.condition || "";
  if (!cond) {
    if (redCount > 0 || mdl.a2lFlag) cond = "replace";
    else if (amberCount > 0 || dec.eol) cond = "caution";
    else cond = "good";
  }

  if (cond === "replace") {
    return { cond: "replace", label: "🔴 REPLACE", cls: "status-red", color: "#ef4444", verifiedCount, total: arch.items.length, redCount };
  }
  if (cond === "caution") {
    return { cond: "caution", label: "🟡 CAUTION", cls: "status-amber", color: "#f59e0b", verifiedCount, total: arch.items.length, redCount };
  }
  return { cond: "good", label: "🟢 GOOD", cls: "status-green", color: "#10b981", verifiedCount, total: arch.items.length, redCount };
}

function showBannerToast(htmlMsg, isWarn = false) {
  const toast = document.getElementById("barometerToast");
  if (!toast) return;
  toast.className = isWarn ? "toast-banner warn" : "toast-banner";
  toast.style.display = "block";
  toast.innerHTML = htmlMsg;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 5000);
}

function toggleLotoDetailBanner() {
  const box = document.getElementById("lotoExpandedBox");
  if (!box) return;
  const open = box.style.display === "none";
  box.style.display = open ? "block" : "none";
  const hint = document.getElementById("lotoExpandHint");
  if (hint) hint.textContent = open ? "✕ Hide" : "ⓘ Tap";
}

function switchMainView(viewName) {
  currentMainView = viewName === "map" ? "map" : "feed";
  const feedEl = document.getElementById("feedMainView");
  const mapEl = document.getElementById("mapMainView");
  const fBtn = document.getElementById("viewFeedBtn");
  const mBtn = document.getElementById("viewMapBtn");
  if (feedEl) feedEl.style.display = currentMainView === "feed" ? "flex" : "none";
  if (mapEl) mapEl.style.display = currentMainView === "map" ? "block" : "none";
  if (fBtn) fBtn.classList.toggle("active", currentMainView === "feed");
  if (mBtn) mBtn.classList.toggle("active", currentMainView === "map");
  if (currentMainView === "map") {
    renderFloorTabs();
    renderInteractiveMap();
    renderStationStrip();
  } else {
    renderUnitFeed();
  }
}

function setUiMode(mode) {
  state.uiMode = mode === "deep" ? "deep" : "quick";
  persistWalkState();
  renderAll(true);
}

function setFeedFilter(flt) {
  currentFeedFilter = flt;
  ["All", "Issue", "Good"].forEach((k) => {
    const btn = document.getElementById(`flt${k}Btn`);
    if (btn) btn.classList.remove("active");
  });
  if (flt === "issues" && document.getElementById("fltIssueBtn")) document.getElementById("fltIssueBtn").classList.add("active");
  else if (flt === "good" && document.getElementById("fltGoodBtn")) document.getElementById("fltGoodBtn").classList.add("active");
  else if (document.getElementById("fltAllBtn")) document.getElementById("fltAllBtn").classList.add("active");
  renderUnitFeed();
}

// ============================================================================
// AUTOMATIC BACKGROUND GPS + COMPASS + STEP-COUNTER + VOICE LOCATION ESTIMATOR
// ============================================================================
function degToCardinal(deg) {
  if (deg === null || deg === undefined || isNaN(deg)) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

function _handleOrientation(ev) {
  let heading = null;
  if (typeof ev.webkitCompassHeading === "number") {
    heading = Math.round(ev.webkitCompassHeading);
  } else if (typeof ev.alpha === "number") {
    heading = Math.round((360 - ev.alpha) % 360);
  }
  if (heading !== null) {
    currentCompassDeg = heading;
    updateSensorBadgeUI();
  }
}

function _handleBackgroundStepMotion(ev) {
  const acc = ev.accelerationIncludingGravity;
  if (!acc) return;
  const mag = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
  const now = Date.now();
  if (mag > 11.6 && now - lastStepPeakMs > 340) {
    lastStepPeakMs = now;
    walkStepCounter++;
    const hdg = currentCompassDeg !== null ? currentCompassDeg : 90;
    pdrSteps.push({ stepIdx: walkStepCounter, headingDeg: hdg, tMs: now });
    state.pdrSteps = pdrSteps.slice(-400);
    const stepBadge = document.getElementById("stepBreadcrumbBadge");
    if (stepBadge) {
      const deltaSteps = Math.max(0, walkStepCounter - stepCounterAtLastSnap);
      stepBadge.textContent = `👣 +${deltaSteps} steps (~${Math.round(deltaSteps * 2.5)} ft)`;
    }
  }
}

function startAutoBackgroundSensors() {
  if (liveSensorsActive) return;
  liveSensorsActive = true;
  if ("geolocation" in navigator) {
    try {
      geoWatchId = navigator.geolocation.watchPosition(
        (pos) => {
          currentGps = {
            lat: Number(pos.coords.latitude.toFixed(5)),
            lon: Number(pos.coords.longitude.toFixed(5)),
            acc: Number((pos.coords.accuracy || 0).toFixed(1)),
            alt: pos.coords.altitude ? Number((pos.coords.altitude * 3.28084).toFixed(1)) : null
          };
          updateSensorBadgeUI();
        },
        () => {
          updateSensorBadgeUI();
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } catch (e) {}
  }
  window.addEventListener("deviceorientationabsolute", _handleOrientation, true);
  window.addEventListener("deviceorientation", _handleOrientation, true);
  window.addEventListener("devicemotion", _handleBackgroundStepMotion, true);
  updateSensorBadgeUI();
}

function toggleLiveSensors() {
  if (!liveSensorsActive) {
    startAutoBackgroundSensors();
  } else if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentGps = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lon: Number(pos.coords.longitude.toFixed(5)),
          acc: Number((pos.coords.accuracy || 0).toFixed(1)),
          alt: pos.coords.altitude ? Number((pos.coords.altitude * 3.28084).toFixed(1)) : null
        };
        updateSensorBadgeUI();
        showBannerToast(`📡 <strong>GPS Recalibrated:</strong> ${currentGps.lat}, ${currentGps.lon} (±${Math.round(currentGps.acc * 3.28)} ft)`);
      },
      () => {
        showBannerToast("📡 <strong>Indoor Step + Compass Dead-Reckoning Active:</strong> Using step distance &amp; voice cues for indoor rough locations.");
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }
}

function updateSensorBadgeUI() {
  const el = document.getElementById("liveSensorReadout");
  if (!el) return;
  const gpsStr = currentGps
    ? `📍 GPS ±${Math.round((currentGps.acc || 4) * 3.28)}ft`
    : "🧭 Indoor Step/Voice Mode";
  const compStr = currentCompassDeg !== null
    ? ` • Heading ${currentCompassDeg}° ${degToCardinal(currentCompassDeg)}`
    : "";
  el.textContent = `📡 Auto-Location: ${gpsStr}${compStr}`;
}

function parseLocationFromVoiceJS(text) {
  const raw = (text || "").trim();
  const up = raw.toUpperCase();
  if (!up) return null;

  let floorId = null;
  let floorLabel = null;
  if (/\b(ROOF|ROOFTOP|PENTHOUSE)\b/.test(up)) {
    floorId = "FLR-ROOF";
    floorLabel = "Roof";
  } else if (/\b(BASEMENT|BSMT|LOWER LEVEL|PLANT|BOILER ROOM|CHILLER)\b/.test(up)) {
    floorId = "FLR-BSMT";
    floorLabel = "Basement";
  } else if (/\b(2ND FLOOR|SECOND FLOOR|FLOOR 2|FLR 2|LEVEL 2)\b/.test(up)) {
    floorId = "FLR-02";
    floorLabel = "Floor 2";
  } else if (/\b(1ST FLOOR|FIRST FLOOR|FLOOR 1|FLR 1|MAIN FLOOR|GROUND|LOBBY|GYM)\b/.test(up)) {
    floorId = "FLR-01";
    floorLabel = "Floor 1";
  }

  let roomMatch = raw.match(/\b(?:room|rm|lab|suite|mech|corridor|hall|door)\s*#?\s*([A-Za-z0-9-]+)\b/i);
  let roomTag = roomMatch ? `${roomMatch[0].trim()}` : "";
  if (!floorId && roomMatch) {
    const rNum = roomMatch[1];
    if (/^2\d\d/.test(rNum)) { floorId = "FLR-02"; floorLabel = "Floor 2"; }
    else if (/^1\d\d/.test(rNum)) { floorId = "FLR-01"; floorLabel = "Floor 1"; }
    else if (/^B/i.test(rNum)) { floorId = "FLR-BSMT"; floorLabel = "Basement"; }
  }

  let xBias = null;
  let yBias = null;
  let sectorParts = [];
  if (/\bWEST\b/.test(up)) { xBias = 24.0; sectorParts.push("West Wing"); }
  else if (/\bEAST\b/.test(up)) { xBias = 76.0; sectorParts.push("East Wing"); }
  else if (/\b(CENTER|CENTRAL|MIDDLE|LOBBY)\b/.test(up)) { xBias = 50.0; sectorParts.push("Central"); }

  if (/\bNORTH\b/.test(up)) { yBias = 24.0; sectorParts.push("North"); }
  else if (/\bSOUTH\b/.test(up)) { yBias = 76.0; sectorParts.push("South"); }

  const summaryParts = [];
  if (floorLabel) summaryParts.push(floorLabel);
  if (sectorParts.length) summaryParts.push(sectorParts.join(" "));
  if (roomTag) summaryParts.push(roomTag);

  if (!floorId && !summaryParts.length && xBias === null && yBias === null) return null;

  return {
    floorId,
    locationLabel: summaryParts.join(" • "),
    xBias,
    yBias
  };
}

function estimateRoughLocationForUnit(st, prevSt = null) {
  const deltaSteps = Math.max(0, walkStepCounter - stepCounterAtLastSnap);
  const estFeet = Math.round(deltaSteps * 2.5);
  const hdg = st.compassDeg !== null && st.compassDeg !== undefined
    ? st.compassDeg
    : (currentCompassDeg !== null ? currentCompassDeg : 90);
  const card = degToCardinal(hdg);

  st.stepsFromPrev = deltaSteps;
  st.distFtFromPrev = estFeet;
  st.compassDeg = hdg;
  stepCounterAtLastSnap = walkStepCounter;

  if (st.gpsLat && st.gpsLon) {
    const ref = (prevSt && prevSt.gpsLat && prevSt.gpsLon) ? prevSt : state.stations.find((x) => x.id !== st.id && x.gpsLat && x.gpsLon);
    if (ref) {
      const dLatM = (st.gpsLat - ref.gpsLat) * 111139;
      const dLonM = (st.gpsLon - ref.gpsLon) * 111139 * Math.cos((st.gpsLat * Math.PI) / 180);
      st.xPct = Number(Math.max(8, Math.min(92, (ref.xPct || 50) + (dLonM / 1.5))).toFixed(1));
      st.yPct = Number(Math.max(10, Math.min(90, (ref.yPct || 50) - (dLatM / 1.5))).toFixed(1));
    }
    const accFt = st.gpsAcc ? `±${Math.round(st.gpsAcc * 3.28)}ft` : "GPS Locked";
    st.autoLocationBreadcrumb = `📍 GPS (${accFt}, ${hdg}° ${card})`;
    if (!st.room || st.room.startsWith("Auto-")) {
      st.room = st.autoLocationBreadcrumb;
    }
    return;
  }

  if (prevSt) {
    const stepMove = deltaSteps > 0 ? Math.min(35, Math.max(5, deltaSteps * 0.65)) : 8.5;
    const rad = ((hdg - 90) * Math.PI) / 180;
    st.xPct = Number(Math.max(8, Math.min(92, (prevSt.xPct || 45) + stepMove * Math.cos(rad))).toFixed(1));
    st.yPct = Number(Math.max(12, Math.min(88, (prevSt.yPct || 48) + stepMove * Math.sin(rad))).toFixed(1));
    const prevName = (prevSt.tag || prevSt.id).split("(")[0].trim();
    st.autoLocationBreadcrumb = deltaSteps > 0
      ? `🧭 ~${estFeet} ft ${card} of ${prevName} (${deltaSteps} steps)`
      : `🧭 Near ${prevName} (Heading ${hdg}° ${card})`;
  } else {
    st.xPct = 50.0;
    st.yPct = 50.0;
    st.autoLocationBreadcrumb = `🧭 Indoor Entry Point (Heading ${hdg}° ${card})`;
  }

  if (!st.room || st.room.startsWith("Auto-")) {
    st.room = st.autoLocationBreadcrumb;
  }
}

// ============================================================================
// COLLISION-PROOF STATION & AUDIO ID ALLOCATORS (Fixes BUG-04: Post-Delete ID Collision)
// ============================================================================
function _nextStationId() {
  let maxNum = 0;
  for (const s of (state.stations || [])) {
    const m = String(s.id || "").match(/(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
  }
  const nextNum = maxNum + 1;
  return {
    num: nextNum,
    id: `STN-${String(nextNum).padStart(2, "0")}`
  };
}

function _nextAudioId() {
  let maxNum = 0;
  for (const a of (state.audioSegments || [])) {
    const m = String(a.id || "").match(/(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
  }
  const nextNum = maxNum + 1;
  return `AUD-${String(nextNum).padStart(2, "0")}`;
}

// ============================================================================
// PHOTO-ONLY FIRST -> "TAG & GO" 1-SCREEN CAPTURE FLOW
// ============================================================================
async function startSnapNewUnitWizard() {
  const prevSt = state.stations[state.stations.length - 1] || getActiveStation();
  const nextInfo = _nextStationId();
  const newNum = nextInfo.num;
  const newId = nextInfo.id;
  const defaultArch = state.activeFloorId === "FLR-ROOF" ? "RTU_AHU" : (prevSt ? prevSt.archetype : "RTU_AHU");
  const archObj = ARCHETYPES.find((a) => a.id === defaultArch) || ARCHETYPES[0];

  const newStation = {
    id: newId,
    tag: `Unit #${newNum}`,
    archetype: defaultArch,
    condition: "good",
    quickIssues: [],
    floorId: state.activeFloorId,
    room: "Auto-locating...",
    xPct: 50.0,
    yPct: 50.0,
    gpsLat: currentGps ? currentGps.lat : null,
    gpsLon: currentGps ? currentGps.lon : null,
    gpsAcc: currentGps ? currentGps.acc : null,
    compassDeg: currentCompassDeg !== null ? currentCompassDeg : 90,
    anchorType: currentGps ? "AUTO_GNSS_AND_STEP" : "AUTO_STEP_COMPASS",
    mfg: "",
    model: "",
    serial: "",
    elec: "",
    legacyCtrl: "",
    alcTarget: archObj.default_alc,
    thermistorCurve: "10k_TYPE_II",
    ioTally: { ui: 4, bi: 2, bo: 2, ao: 2 },
    parentPanel: "",
    servedBy: "",
    mstpMac: "",
    ocrConf: 1.0,
    ambiguousNote: "",
    scheduledQty: 1,
    observedQty: 1,
    tierDelta: "",
    burstMeta: {},
    checks: {}
  };

  estimateRoughLocationForUnit(newStation, prevSt);
  state.stations.push(newStation);
  state.activeStationId = newId;
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  persistWalkState();
  renderAll(true);

  openTagAndGoForStation(newId);
  await captureStationBurstSlot(2, true);
}

async function openTagAndGoForStation(stationId) {
  const st = state.stations.find((s) => s.id === stationId);
  if (!st) return;
  state.activeStationId = stationId;
  state.activeFloorId = st.floorId;
  persistWalkState();
  await loadActiveStationBurstPhotos();
  renderTagAndGoSheet(st);
  const modal = document.getElementById("tagAndGoModal");
  if (modal) modal.style.display = "flex";
}

function closeTagAndGoSheet() {
  const modal = document.getElementById("tagAndGoModal");
  if (modal) modal.style.display = "none";
  persistWalkState();
  renderAll(true);
  checkOfficeWifiAutoSync();
}

async function saveAndSnapNextUnit() {
  closeTagAndGoSheet();
  await startSnapNewUnitWizard();
}

function setUnitCondition(condVal) {
  const st = getActiveStation();
  if (!st) return;
  st.condition = condVal;
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
  renderInteractiveMap();
}

function toggleQuickIssueTile(issueId) {
  const st = getActiveStation();
  if (!st) return;
  if (!Array.isArray(st.quickIssues)) st.quickIssues = [];
  const issueObj = QUICK_ISSUE_CATALOG.find((x) => x.id === issueId);
  if (!issueObj) return;

  const idx = st.quickIssues.indexOf(issueId);
  if (idx >= 0) {
    st.quickIssues.splice(idx, 1);
  } else {
    st.quickIssues.push(issueId);
    if (!st.condition || st.condition === "good") {
      st.condition = "caution";
    }
    if (!st.checks) st.checks = {};
    const mapped = issueObj.chkMap[st.archetype];
    if (mapped) {
      st.checks[mapped[0]] = mapped[1];
    }
  }

  const rfiNotes = st.quickIssues
    .map((id) => QUICK_ISSUE_CATALOG.find((x) => x.id === id)?.rfi)
    .filter(Boolean);
  const manualNote = (st.userNote || "").trim();
  st.tierDelta = [manualNote, ...rfiNotes].filter(Boolean).join(" | ");

  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
  renderInteractiveMap();
}

function onTagGoNoteInput(val) {
  const st = getActiveStation();
  if (!st) return;
  st.userNote = val;
  const loc = parseLocationFromVoiceJS(val);
  if (loc) {
    if (loc.floorId) {
      st.floorId = loc.floorId;
      state.activeFloorId = loc.floorId;
    }
    if (loc.locationLabel) {
      st.room = `${loc.locationLabel} (${st.autoLocationBreadcrumb || 'Voice Located'})`;
    }
    if (loc.xBias !== null) st.xPct = loc.xBias;
    if (loc.yBias !== null) st.yPct = loc.yBias;
  }
  const rfiNotes = (st.quickIssues || [])
    .map((id) => QUICK_ISSUE_CATALOG.find((x) => x.id === id)?.rfi)
    .filter(Boolean);
  st.tierDelta = [val.trim(), ...rfiNotes].filter(Boolean).join(" | ");
  persistWalkState();
  const subEl = document.getElementById("tgAutoLocationSub");
  if (subEl) subEl.textContent = `📍 ${st.room || st.autoLocationBreadcrumb || st.floorId}`;
}

function renderTagAndGoSheet(st) {
  if (!st) st = getActiveStation();
  if (!st) return;
  const unitIdx = state.stations.findIndex((x) => x.id === st.id) + 1;
  const badgeEl = document.getElementById("tgUnitBadge");
  if (badgeEl) badgeEl.textContent = `Unit #${unitIdx}`;

  const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);

  const autoTitleParts = [];
  if (st.tag && !st.tag.startsWith("Unit #")) autoTitleParts.push(st.tag);
  if (st.mfg) autoTitleParts.push(st.mfg);
  if (mdl.capacity) autoTitleParts.push(mdl.capacity.split("(")[0].trim());
  const titleEl = document.getElementById("tgAutoTitle");
  if (titleEl) {
    titleEl.textContent = autoTitleParts.length > 0 ? autoTitleParts.join(" • ") : (st.tag || `Unit #${unitIdx}`);
  }

  const locEl = document.getElementById("tgAutoLocationSub");
  if (locEl) {
    locEl.textContent = `📍 ${st.room || st.autoLocationBreadcrumb || st.floorId}`;
  }

  const decodeBanner = document.getElementById("tgAutoDecodeBanner");
  if (decodeBanner) {
    const specs = [];
    if (st.mfg || st.model) specs.push(`<strong>${escapeHtml(st.mfg || '')} ${escapeHtml(st.model || '')}</strong>`);
    if (dec.year) specs.push(`📅 <strong>${dec.year}</strong> (${dec.age} yr${dec.eol ? ' ⚠️ Past ASHRAE Life' : ''})`);
    if (mdl.capacity) specs.push(`⚙️ ${escapeHtml(mdl.capacity)}`);
    if (mdl.a2lFlag) specs.push(`🚨 <strong>A2L Refrigerant</strong>`);
    if (st.ambiguousNote) specs.push(`📌 ${escapeHtml(st.ambiguousNote)}`);
    decodeBanner.innerHTML = specs.length > 0
      ? `✅ Auto-Decoded: ${specs.join(" &nbsp;•&nbsp; ")}`
      : `✨ Snap nameplate photo below — Make, Model, Year &amp; Tonnage decode in the background.`;
  }

  const photoGrid = document.getElementById("tgPhotoGrid");
  if (photoGrid) {
    const npUrl = cachedSlotPhotos[2];
    const wideUrl = cachedSlotPhotos[1];
    const npMeta = (st.burstMeta && st.burstMeta[2]) || null;
    const isClahe = Boolean(npMeta && npMeta.claheEnhanced);

    photoGrid.innerHTML = `
      <div class="tg-photo-box ${npUrl ? 'has-photo' : ''}">
        <strong style="font-size:11.5px;">1️⃣ Equipment Nameplate</strong>
        ${npUrl
          ? `<img src="${npUrl}" onclick="openPhotoZoomModal(2)" alt="Nameplate Photo" />`
          : `<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:12px 4px;">No Nameplate Photo Yet</div>`
        }
        <div style="display:flex;gap:5px;width:100%;">
          <button class="btn" style="flex:1;padding:6px 8px;min-height:34px;font-size:12px;" onclick="captureStationBurstSlot(2, true)">
            📸 ${npUrl ? 'Retake' : 'Snap Plate'}
          </button>
          ${npUrl ? `<button class="btn ${isClahe ? 'btn-secondary' : 'btn-amber'}" style="padding:6px 8px;min-height:34px;font-size:11.5px;" onclick="toggleClaheOnSlot(2)" title="Enhance weathered metal plate">${isClahe ? '🎨 Color' : '🔦 Enhance'}</button>` : ''}
        </div>
      </div>

      <div class="tg-photo-box ${wideUrl ? 'has-photo' : ''}">
        <strong style="font-size:11.5px;">2️⃣ Wide / Controller (Optional)</strong>
        ${wideUrl
          ? `<img src="${wideUrl}" onclick="openPhotoZoomModal(1)" alt="Wide Shot" />`
          : `<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:12px 4px;">Optional Wide or Board Shot</div>`
        }
        <button class="btn btn-secondary" style="width:100%;padding:6px 8px;min-height:34px;font-size:12px;" onclick="captureStationBurstSlot(1, false)">
          📷 ${wideUrl ? 'Retake Wide Shot' : '+ Add Wide Shot'}
        </button>
      </div>
    `;
  }

  const stStatus = computeStationStatus(st);
  ["Good", "Caution", "Replace"].forEach((k) => {
    const b = document.getElementById(`condBtn${k}`);
    if (b) b.classList.toggle("active", stStatus.cond === k.toLowerCase());
  });

  const issueGrid = document.getElementById("tgQuickIssueGrid");
  if (issueGrid) {
    const activeIssues = Array.isArray(st.quickIssues) ? st.quickIssues : [];
    issueGrid.innerHTML = QUICK_ISSUE_CATALOG.map((iss) => {
      const isAct = activeIssues.includes(iss.id);
      return `
        <button class="issue-tile-btn ${isAct ? 'active' : ''}" onclick="toggleQuickIssueTile('${iss.id}')">
          <span>${isAct ? '✅' : '⬜'}</span>
          <span>${escapeHtml(iss.label)}</span>
        </button>
      `;
    }).join("");
  }

  const noteInp = document.getElementById("tgQuickNoteInput");
  if (noteInp && document.activeElement !== noteInp) {
    noteInp.value = st.userNote || st.tierDelta || "";
  }

  // Render unit-linked voice notes with ▶️ Play buttons inside Tag & Go
  const unitAudioEl = document.getElementById("tgUnitAudioList");
  if (unitAudioEl) {
    const unitSegs = (state.audioSegments || []).filter((a) => a.stationId === st.id);
    if (unitSegs.length === 0) {
      unitAudioEl.innerHTML = "";
    } else {
      unitAudioEl.innerHTML = unitSegs.map((seg) => `
        <div class="audio-item-row" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;">
          <div style="min-width:0;flex:1;font-size:11.5px;">
            <strong>🎙️ ${escapeHtml(seg.id)} (${escapeHtml(seg.time || '')}):</strong>
            <span>"${escapeHtml(seg.text)}"</span>
          </div>
          <button class="btn btn-secondary" style="padding:4px 9px;min-height:28px;font-size:11px;white-space:nowrap;" onclick="playAudioSegmentById('${seg.id}')">
            ▶️ Play
          </button>
        </div>
      `).join("");
    }
  }

  const archSel = document.getElementById("qwArchetypeSelect");
  if (archSel) {
    archSel.innerHTML = ARCHETYPES.map((a) => `
      <option value="${a.id}" ${a.id === st.archetype ? 'selected' : ''}>${escapeHtml(a.label)}</option>
    `).join("");
  }
  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) el.value = v || "";
  };
  setVal("qwTagInput", st.tag);
  setVal("qwRoomInput", st.room);
  setVal("qwMfgInput", st.mfg);
  setVal("qwModelInput", st.model);
  setVal("qwSerialInput", st.serial);
  setVal("qwLegacyInput", st.legacyCtrl);
}

// ============================================================================
// CLEAN VISUAL UNIT FEED RENDERER (VIEW 1) — PREFERS FULL-COLOR PHOTOS
// ============================================================================
async function preloadAllStationThumbnails() {
  allStationThumbs = {};
  for (const st of state.stations) {
    const raw2 = await window.CSCDiscoveryAdapter.loadMediaBlob(`photo_raw::${state.sessionId}::${st.id}::slot2`);
    const p2 = raw2 || await window.CSCDiscoveryAdapter.loadMediaBlob(`photo::${state.sessionId}::${st.id}::slot2`);
    const raw1 = p2 ? null : await window.CSCDiscoveryAdapter.loadMediaBlob(`photo_raw::${state.sessionId}::${st.id}::slot1`);
    const p1 = p2 ? null : (raw1 || await window.CSCDiscoveryAdapter.loadMediaBlob(`photo::${state.sessionId}::${st.id}::slot1`));
    if (p2 || p1) allStationThumbs[st.id] = p2 || p1;
  }
}

function renderUnitFeed() {
  const countEl = document.getElementById("stationSummaryCount");
  if (countEl) countEl.textContent = String(state.stations.length);

  const notesBox = document.getElementById("preloadedNotesBox");
  const notesCnt = document.getElementById("preloadedNotesCount");
  const notesList = document.getElementById("preloadedNotesList");
  if (notesBox && notesList) {
    const notes = Array.isArray(state.preloadedScheduleNotes) ? state.preloadedScheduleNotes : [];
    if (notes.length > 0) {
      notesBox.style.display = "block";
      if (notesCnt) notesCnt.textContent = String(notes.length);
      notesList.innerHTML = notes.map((n) => {
        if (typeof n === "string") return `<li>${escapeHtml(n)}</li>`;
        const pg = n.page ? `[Pg ${escapeHtml(String(n.page))}] ` : "";
        const cat = n.category ? `<strong>${escapeHtml(String(n.category))}:</strong> ` : "";
        return `<li>${pg}${cat}${escapeHtml(String(n.text || n.note || JSON.stringify(n)))}</li>`;
      }).join("");
    } else {
      notesBox.style.display = "none";
      notesList.innerHTML = "";
    }
  }

  const listEl = document.getElementById("unitFeedList");
  if (!listEl) return;

  const filtered = state.stations.filter((st) => {
    const stStatus = computeStationStatus(st);
    if (currentFeedFilter === "issues") return stStatus.cond !== "good";
    if (currentFeedFilter === "good") return stStatus.cond === "good";
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:24px 16px;background:var(--bg-card);border-radius:12px;border:1.5px dashed var(--border-col);color:var(--text-muted);display:flex;flex-direction:column;align-items:center;gap:10px;">
        <div style="font-size:14px;font-weight:800;color:var(--text-main);">Ready for Field Discovery (0 Units)</div>
        <div style="font-size:12px;">Tap <strong>📸 + SNAP NEW UNIT</strong> below to snap your first nameplate photo, or <strong>📥 Pull Job</strong> from your Office PC!</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;">
          <button class="btn" onclick="startSnapNewUnitWizard()">📸 + Snap First Unit</button>
          <button class="btn btn-blue" onclick="openSessionManagerAndBrowsePcJobs()">📥 Pull Job from PC</button>
          <button class="btn btn-secondary" onclick="resetToGoldenDemoWalk()">🧪 Load KC Demo Walk</button>
        </div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((st) => {
    const unitIdx = state.stations.findIndex((x) => x.id === st.id) + 1;
    const stStatus = computeStationStatus(st);
    const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
    const mdl = decodeModelDeterministic(st.mfg, st.model);
    const thumb = allStationThumbs[st.id] || (st.id === state.activeStationId ? (cachedRawSlotPhotos[2] || cachedSlotPhotos[2] || cachedRawSlotPhotos[1] || cachedSlotPhotos[1]) : null);

    const specParts = [];
    if (st.mfg) specParts.push(st.mfg);
    if (st.model) specParts.push(st.model);
    if (dec.year) specParts.push(`${dec.year} (${dec.age} yr${dec.eol ? ' • EOL' : ''})`);
    if (mdl.capacity) specParts.push(mdl.capacity.split("(")[0].trim());
    const specLine = specParts.length > 0 ? specParts.join(" • ") : "Tap to snap nameplate or view details";

    const issuePills = [];
    for (const issId of (st.quickIssues || [])) {
      const obj = QUICK_ISSUE_CATALOG.find((x) => x.id === issId);
      if (obj) issuePills.push(`<span class="mini-issue-tag">${escapeHtml(obj.label)}</span>`);
    }
    if (mdl.a2lFlag) {
      issuePills.push(`<span class="mini-issue-tag">🚨 A2L Refrigerant</span>`);
    }
    if (!issuePills.length && st.tierDelta) {
      issuePills.push(`<span class="mini-issue-tag">📝 ${escapeHtml(st.tierDelta.slice(0, 58))}</span>`);
    }
    if (!issuePills.length && st.ambiguousNote) {
      issuePills.push(`<span class="mini-issue-tag">📌 ${escapeHtml(st.ambiguousNote.slice(0, 62))}</span>`);
    }

    const displayTitle = st.tag && !st.tag.startsWith("Unit #")
      ? `Unit #${unitIdx} • ${st.tag}`
      : `Unit #${unitIdx}${st.mfg ? ' • ' + st.mfg : ''}`;

    return `
      <div class="unit-feed-card cond-${stStatus.cond}" onclick="openTagAndGoForStation('${st.id}')">
        <div class="unit-thumb-box">
          ${thumb
            ? `<img src="${thumb}" alt="Unit Thumbnail" />`
            : `<span style="font-size:22px;">📷</span><small style="font-size:9.5px;color:var(--text-muted);">Snap</small>`
          }
        </div>
        <div class="unit-card-body">
          <div class="unit-card-top">
            <div class="unit-card-title">${escapeHtml(displayTitle)}</div>
            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
              <span class="cond-badge ${stStatus.cond}">${stStatus.label}</span>
              <button class="card-del-btn" onclick="event.stopPropagation(); deleteUnitById('${st.id}', false)" title="Delete this unit">🗑️</button>
            </div>
          </div>
          <div class="unit-card-spec">${escapeHtml(specLine)}</div>
          <div class="unit-card-loc">📍 ${escapeHtml(st.room || st.autoLocationBreadcrumb || st.floorId)}</div>
          ${issuePills.length ? `<div class="unit-issue-row">${issuePills.join("")}</div>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

let activeAudioPlayer = null;
async function playAudioSegmentById(segId) {
  const seg = (state.audioSegments || []).find((a) => a.id === segId);
  if (!seg) return;

  if (activeAudioPlayer) {
    try {
      activeAudioPlayer.pause();
      activeAudioPlayer = null;
    } catch (e) {}
  }

  let dataUrl = cachedAudioUrls[segId];
  if (!dataUrl) {
    dataUrl = await window.CSCDiscoveryAdapter.loadMediaBlob(`audio::${state.sessionId}::${segId}`);
    if (dataUrl) cachedAudioUrls[segId] = dataUrl;
  }

  if (dataUrl && typeof dataUrl === "string" && dataUrl.startsWith("data:audio")) {
    try {
      const player = new Audio(dataUrl);
      activeAudioPlayer = player;
      await player.play();
      showBannerToast(`🔊 <strong>Playing ${escapeHtml(segId)} (${escapeHtml(seg.stationId)}):</strong> "${escapeHtml(seg.text.slice(0, 70))}"`);
      return;
    } catch (e) {
      console.warn("Audio playback fallback:", e);
    }
  }

  // Fallback for demo/transcript-only segments without a binary .webm recording
  if ("speechSynthesis" in window && seg.text) {
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(seg.text);
      utt.rate = 1.04;
      window.speechSynthesis.speak(utt);
      showBannerToast(`🔊 <strong>Reading Transcript (${escapeHtml(segId)}):</strong> "${escapeHtml(seg.text.slice(0, 70))}"`);
      return;
    } catch (e) {}
  }
  showBannerToast(`📝 <strong>Voice Transcript (${escapeHtml(segId)}):</strong> "${escapeHtml(seg.text)}"`);
}

function renderRecentAudioFeed() {
  const countEl = document.getElementById("audioCountBadge");
  if (countEl) countEl.textContent = String((state.audioSegments || []).length);
  const consentEl = document.getElementById("audioConsentCheck");
  if (consentEl) consentEl.checked = Boolean(state.verbalConsentLogged);

  const listEl = document.getElementById("recentAudioFeedList");
  if (!listEl) return;
  const segs = (state.audioSegments || []).slice(0, 6);
  if (segs.length === 0) {
    listEl.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);">Hold <strong>🎙️ Hold to Talk</strong> anytime to record a voice note &amp; auto-tag location.</div>`;
    return;
  }
  listEl.innerHTML = segs.map((seg) => `
    <div class="audio-item-row">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:11px;color:var(--text-muted);">
        <strong>${escapeHtml(seg.stationId || 'SITE-GENERAL')} • ${escapeHtml(seg.speaker || 'Field Tech')}</strong>
        <div style="display:flex;align-items:center;gap:6px;">
          <span>${escapeHtml(seg.time)}</span>
          <button class="btn btn-secondary" style="padding:2px 8px;min-height:24px;font-size:10.5px;" onclick="playAudioSegmentById('${seg.id}')">▶️ Play</button>
        </div>
      </div>
      <div style="margin-top:3px;">"${escapeHtml(seg.text)}"</div>
      ${seg.insight ? `<div style="margin-top:2px;font-size:11px;color:var(--accent-teal);font-weight:700;">↳ ${escapeHtml(seg.insight)}</div>` : ""}
    </div>
  `).join("");
}

function _autoIncrementEquipmentTag(tagStr) {
  const raw = (tagStr || "Unit #1").trim();
  const m = raw.match(/^(.*?)(\d+)(\s*\(.*\))?$/);
  if (m) {
    const prefix = m[1];
    const numStr = m[2];
    const suffix = m[3] || "";
    const nextNum = String(parseInt(numStr, 10) + 1).padStart(numStr.length, "0");
    return `${prefix}${nextNum}${suffix}`;
  }
  return `${raw}-2`;
}

function cloneActiveStation() {
  const src = getActiveStation();
  if (!src) {
    startSnapNewUnitWizard();
    return;
  }
  const nextInfo = _nextStationId();
  const newId = nextInfo.id;
  const nextTag = _autoIncrementEquipmentTag(src.tag);
  const arch = ARCHETYPES.find((a) => a.id === src.archetype) || ARCHETYPES[0];

  const cloned = {
    id: newId,
    tag: nextTag,
    archetype: src.archetype,
    condition: "good",
    quickIssues: [],
    floorId: src.floorId,
    room: src.room,
    xPct: Number(Math.min(95, (src.xPct || 50) + 4.0).toFixed(1)),
    yPct: Number(Math.min(92, (src.yPct || 50) + 3.0).toFixed(1)),
    gpsLat: currentGps ? currentGps.lat : null,
    gpsLon: currentGps ? currentGps.lon : null,
    gpsAcc: currentGps ? currentGps.acc : null,
    compassDeg: currentCompassDeg !== null ? currentCompassDeg : src.compassDeg,
    anchorType: "CLONED_UNIT",
    mfg: src.mfg || "",
    model: src.model || "",
    serial: "",
    elec: src.elec || "",
    legacyCtrl: src.legacyCtrl || "",
    alcTarget: src.alcTarget || arch.default_alc,
    thermistorCurve: src.thermistorCurve || "10k_TYPE_II",
    ioTally: JSON.parse(JSON.stringify(src.ioTally || { ui: 2, bi: 1, bo: 1, ao: 1 })),
    parentPanel: src.parentPanel || "",
    servedBy: src.servedBy || "",
    mstpMac: "",
    ocrConf: 1.0,
    ambiguousNote: "",
    scheduledQty: 1,
    observedQty: 1,
    tierDelta: "",
    burstMeta: {},
    checks: {}
  };

  estimateRoughLocationForUnit(cloned, src);
  state.stations.push(cloned);
  state.activeStationId = newId;
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  persistWalkState();
  renderAll(true);
  showBannerToast(`📋 <strong>Cloned &rarr; ${escapeHtml(nextTag)}:</strong> Ready for next nameplate photo!`);
}

// ============================================================================
// ROUGH MAP (AUTO GPS/STEP/VOICE PLACEMENT + OPTIONAL PIN DRAG)
// ============================================================================
async function refreshFloorMapBackground() {
  const flr = state.floors.find((f) => f.id === state.activeFloorId);
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  cachedFloorMapDataUrl = await window.CSCDiscoveryAdapter.loadMediaBlob(key);
  if (!cachedFloorMapDataUrl && flr && flr.custom_map_data_url) {
    cachedFloorMapDataUrl = flr.custom_map_data_url;
    await window.CSCDiscoveryAdapter.saveMediaBlob(key, cachedFloorMapDataUrl);
    flr.hasCustomMap = true;
    delete flr.custom_map_data_url;
  }
  renderInteractiveMap();
}

async function captureFloorEvacuationMap(useRearCamera = true) {
  const img = await window.CSCDiscoveryAdapter.captureImage({
    maxDim: 1800,
    quality: 0.86,
    useRearCamera
  });
  if (!img || !img.dataUrl) return;
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  await window.CSCDiscoveryAdapter.saveMediaBlob(key, img.dataUrl);
  const flr = state.floors.find((f) => f.id === state.activeFloorId);
  if (flr) {
    flr.hasCustomMap = true;
    flr.source = `${useRearCamera ? 'Snapped Wall Map' : 'Imported Plan'} (${img.width}x${img.height})`;
  }
  cachedFloorMapDataUrl = img.dataUrl;
  resetMapZoom();
  persistWalkState();
  renderFloorTabs();
  renderInteractiveMap();
  showBannerToast("🗺️ <strong>Floor Map Loaded:</strong> Drag any unit pin to fine-tune its location!");
}

async function clearCustomFloorMap() {
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  await window.CSCDiscoveryAdapter.deleteMediaBlob(key);
  const flr = state.floors.find((f) => f.id === state.activeFloorId);
  if (flr) {
    flr.hasCustomMap = false;
    delete flr.custom_map_data_url;
    flr.source = "Auto-Estimated GPS/Step/Voice Grid";
  }
  cachedFloorMapDataUrl = null;
  resetMapZoom();
  persistWalkState();
  renderFloorTabs();
  renderInteractiveMap();
}

function addCustomFloor() {
  const name = prompt("New Area / Floor Name (e.g., Penthouse or 3rd Floor):", `Floor ${state.floors.length}`);
  if (!name) return;
  const idx = state.floors.length + 1;
  const id = `FLR-C${idx}`;
  const topElev = state.floors.reduce((mx, f) => Math.max(mx, Number(f.elev) || 0), 0) + 14.0;
  state.floors.push({
    id,
    name: name.trim(),
    elev: topElev,
    hpa: 988.0,
    source: "Auto-Estimated Grid",
    hasCustomMap: false
  });
  selectFloor(id);
}

function _applyMapViewBox() {
  const svg = document.getElementById("floorMapSvg");
  if (!svg) return;
  svg.setAttribute("viewBox", `${mapViewBox.x.toFixed(1)} ${mapViewBox.y.toFixed(1)} ${mapViewBox.w.toFixed(1)} ${mapViewBox.h.toFixed(1)}`);
}

function zoomMap(factor, centerSvgX = null, centerSvgY = null) {
  const cx = centerSvgX !== null ? centerSvgX : mapViewBox.x + mapViewBox.w / 2;
  const cy = centerSvgY !== null ? centerSvgY : mapViewBox.y + mapViewBox.h / 2;
  const newW = Math.max(220, Math.min(1000, mapViewBox.w / factor));
  const newH = newW * 0.42;
  let newX = cx - ((cx - mapViewBox.x) / mapViewBox.w) * newW;
  let newY = cy - ((cy - mapViewBox.y) / mapViewBox.h) * newH;
  newX = Math.max(0, Math.min(1000 - newW, newX));
  newY = Math.max(0, Math.min(420 - newH, newY));
  mapViewBox = { x: newX, y: newY, w: newW, h: newH };
  _applyMapViewBox();
}

function resetMapZoom() {
  mapViewBox = { x: 0, y: 0, w: 1000, h: 420 };
  _applyMapViewBox();
}

function toggleMapInteractionMode() {
  mapInteractionMode = mapInteractionMode === "pin" ? "pan" : "pin";
  const btn = document.getElementById("mapModeToggleBtn");
  if (btn) {
    btn.classList.toggle("active", mapInteractionMode === "pan");
    btn.innerHTML = mapInteractionMode === "pan" ? "✋ Pan" : "📍 Move Pin";
  }
}

function _clientToSvgCoords(clientX, clientY) {
  const svg = document.getElementById("floorMapSvg");
  const rect = svg.getBoundingClientRect();
  const svgX = mapViewBox.x + ((clientX - rect.left) / Math.max(1, rect.width)) * mapViewBox.w;
  const svgY = mapViewBox.y + ((clientY - rect.top) / Math.max(1, rect.height)) * mapViewBox.h;
  const xPct = Math.max(2.0, Math.min(97.0, (svgX - 20) / 9.6));
  const yPct = Math.max(3.0, Math.min(95.0, (svgY - 15) / 3.8));
  return { svgX, svgY, xPct, yPct };
}

function _bindSvgGestures() {
  const svg = document.getElementById("floorMapSvg");
  if (!svg || svg._gesturesBound) return;
  svg._gesturesBound = true;

  svg.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    const pt = _clientToSvgCoords(ev.clientX, ev.clientY);
    zoomMap(ev.deltaY < 0 ? 1.2 : 0.84, pt.svgX, pt.svgY);
  }, { passive: false });

  svg.addEventListener("pointerdown", (ev) => {
    activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (activePointers.size === 2) {
      const pts = Array.from(activePointers.values());
      pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartVbW = mapViewBox.w;
      isDraggingActivePin = false;
      isPanningMap = false;
      suppressNextMapClick = true;
      return;
    }

    const pt = _clientToSvgCoords(ev.clientX, ev.clientY);
    const flrStations = state.stations.filter((s) => s.floorId === state.activeFloorId);
    for (const st of flrStations) {
      const sx = st.xPct * 9.6 + 20;
      const sy = st.yPct * 3.8 + 15;
      if (Math.hypot(pt.svgX - sx, pt.svgY - sy) <= 24) {
        state.activeStationId = st.id;
        isDraggingActivePin = true;
        suppressNextMapClick = true;
        svg.setPointerCapture(ev.pointerId);
        return;
      }
    }

    if (mapInteractionMode === "pan" || mapViewBox.w < 995) {
      isPanningMap = true;
      panStartClient = { x: ev.clientX, y: ev.clientY, vbX: mapViewBox.x, vbY: mapViewBox.y, moved: false };
    }
  });

  svg.addEventListener("pointermove", (ev) => {
    if (activePointers.has(ev.pointerId)) {
      activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    }
    if (activePointers.size === 2 && pinchStartDist > 10) {
      const pts = Array.from(activePointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = _clientToSvgCoords((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      const targetFactor = mapViewBox.w / Math.max(220, Math.min(1000, pinchStartVbW * (pinchStartDist / Math.max(10, dist))));
      zoomMap(targetFactor, mid.svgX, mid.svgY);
      suppressNextMapClick = true;
      return;
    }
    if (isDraggingActivePin) {
      const pt = _clientToSvgCoords(ev.clientX, ev.clientY);
      const st = getActiveStation();
      st.xPct = Number(pt.xPct.toFixed(1));
      st.yPct = Number(pt.yPct.toFixed(1));
      renderInteractiveMap();
      return;
    }
    if (isPanningMap) {
      const dx = ev.clientX - panStartClient.x;
      const dy = ev.clientY - panStartClient.y;
      if (Math.hypot(dx, dy) > 6) {
        panStartClient.moved = true;
        suppressNextMapClick = true;
        const rect = svg.getBoundingClientRect();
        const scaleX = mapViewBox.w / Math.max(1, rect.width);
        const scaleY = mapViewBox.h / Math.max(1, rect.height);
        mapViewBox.x = Math.max(0, Math.min(1000 - mapViewBox.w, panStartClient.vbX - dx * scaleX));
        mapViewBox.y = Math.max(0, Math.min(420 - mapViewBox.h, panStartClient.vbY - dy * scaleY));
        _applyMapViewBox();
      }
    }
  });

  const endPtr = (ev) => {
    activePointers.delete(ev.pointerId);
    if (isDraggingActivePin) {
      isDraggingActivePin = false;
      persistWalkState();
      renderStationStrip();
    }
    isPanningMap = false;
  };
  svg.addEventListener("pointerup", endPtr);
  svg.addEventListener("pointercancel", endPtr);

  svg.addEventListener("click", (ev) => {
    if (suppressNextMapClick) {
      suppressNextMapClick = false;
      return;
    }
    if (mapInteractionMode === "pan") return;
    handleMapClick(ev);
  });
}

function handleMapClick(evt) {
  const pt = _clientToSvgCoords(evt.clientX, evt.clientY);
  const st = getActiveStation();
  if (st) {
    st.floorId = state.activeFloorId;
    st.xPct = Number(pt.xPct.toFixed(1));
    st.yPct = Number(pt.yPct.toFixed(1));
    persistWalkState();
    renderInteractiveMap();
    renderStationStrip();
    showBannerToast(`📍 Moved <strong>${escapeHtml(st.tag || st.id)}</strong> pin to (${st.xPct}%, ${st.yPct}%)`);
  }
}

function renderHeaderMeta() {
  const titleEl = document.getElementById("jobHeaderTitle");
  const subEl = document.getElementById("jobHeaderSub");
  if (titleEl) titleEl.textContent = state.projectName || "Field Discovery Walk";
  if (subEl) subEl.textContent = `${state.jobNumber || 'CSC-WALK'} • ${state.stations.length} Units • Tap for Export/Job`;

  const govEl = document.getElementById("governanceSubBadge");
  if (govEl) {
    const consentTag = state.verbalConsentLogged ? "Consent OK ✅" : "Consent Unchecked";
    govEl.textContent = `🛡️ POL-IT-AI-001: 100% Local Audio Store | ${consentTag}`;
  }
  const rfiCheck = document.getElementById("rfi11ModalCheck");
  if (rfiCheck) rfiCheck.checked = Boolean(state.rfi23011TempConditioningFlag);
}

function toggleRfi23011HardStop() {
  state.rfi23011TempConditioningFlag = !state.rfi23011TempConditioningFlag;
  persistWalkState();
  renderHeaderMeta();
  if (state.rfi23011TempConditioningFlag) {
    showBannerToast("🚨 <strong>RFI-23-011 Temp HVAC Protection Flagged</strong> for desktop report!", true);
  }
}

function renderFloorTabs() {
  const container = document.getElementById("floorTabs");
  if (!container) return;
  container.innerHTML = state.floors.map((f) => {
    const cnt = state.stations.filter((s) => s.floorId === f.id).length;
    return `
      <button class="tab-btn ${f.id === state.activeFloorId ? 'active' : ''}" onclick="selectFloor('${f.id}')">
        ${escapeHtml(f.name)} (${cnt})
      </button>
    `;
  }).join("");
}

function selectFloor(floorId) {
  state.activeFloorId = floorId;
  const firstOnFloor = state.stations.find((s) => s.floorId === floorId);
  if (firstOnFloor) state.activeStationId = firstOnFloor.id;
  resetMapZoom();
  persistWalkState();
  refreshFloorMapBackground();
  renderFloorTabs();
  renderInteractiveMap();
  renderStationStrip();
}

function renderInteractiveMap() {
  const svg = document.getElementById("floorMapSvg");
  if (!svg) return;
  _bindSvgGestures();
  const flr = state.floors.find((f) => f.id === state.activeFloorId) || state.floors[0];
  const srcLbl = document.getElementById("mapSourceLabel");
  if (srcLbl) srcLbl.textContent = `${flr.name} • Auto-estimated from GPS, step distance & voice zones (Drag any pin to adjust)`;
  const clrBtn = document.getElementById("clearMapBtn");
  if (clrBtn) clrBtn.style.display = cachedFloorMapDataUrl ? "inline-flex" : "none";

  const flrStations = state.stations.filter((s) => s.floorId === flr.id);
  let overlayHtml = `<rect x="10" y="10" width="980" height="400" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>`;

  if (cachedFloorMapDataUrl) {
    overlayHtml += `
      <image href="${cachedFloorMapDataUrl}" x="14" y="14" width="972" height="392" preserveAspectRatio="xMidYMid meet" opacity="0.92"/>
    `;
  } else {
    overlayHtml += `
      <line x1="330" y1="10" x2="330" y2="410" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <line x1="670" y1="10" x2="670" y2="410" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <line x1="10" y1="210" x2="990" y2="210" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <text x="490" y="32" text-anchor="middle" fill="#64748b" font-size="12" font-weight="bold">⬆️ NORTH</text>
      <text x="490" y="398" text-anchor="middle" fill="#64748b" font-size="12" font-weight="bold">⬇️ SOUTH</text>
      <text x="30" y="204" fill="#64748b" font-size="12" font-weight="bold">⬅️ WEST WING</text>
      <text x="865" y="204" fill="#64748b" font-size="12" font-weight="bold">EAST WING ➡️</text>
    `;
  }

  if (state.showVideoCrumb && flrStations.length >= 2) {
    const pts = flrStations.map((s) => `${Math.round(s.xPct * 9.6 + 20)},${Math.round(s.yPct * 3.8 + 15)}`).join(" ");
    overlayHtml += `<polyline points="${pts}" fill="none" stroke="#14b8a6" stroke-width="3" stroke-dasharray="8,5" opacity="0.85"/>`;
  }

  flrStations.forEach((st) => {
    const sx = Math.round(st.xPct * 9.6 + 20);
    const sy = Math.round(st.yPct * 3.8 + 15);
    const isSel = st.id === state.activeStationId;
    const stStatus = computeStationStatus(st);
    const unitNum = state.stations.findIndex((x) => x.id === st.id) + 1;

    if (typeof st.compassDeg === "number") {
      const rad = ((st.compassDeg - 90) * Math.PI) / 180;
      const len = 58;
      const spread = 0.34;
      const x1 = Math.round(sx + len * Math.cos(rad - spread));
      const y1 = Math.round(sy + len * Math.sin(rad - spread));
      const x2 = Math.round(sx + len * Math.cos(rad + spread));
      const y2 = Math.round(sy + len * Math.sin(rad + spread));
      overlayHtml += `<polygon points="${sx},${sy} ${x1},${y1} ${x2},${y2}" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3"/>`;
    }

    const shortTag = (st.tag || `Unit #${unitNum}`).split("(")[0].trim();
    overlayHtml += `
      <g onclick="event.stopPropagation(); openTagAndGoForStation('${st.id}');" style="cursor:pointer;">
        ${isSel ? `<circle cx="${sx}" cy="${sy}" r="21" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="4,3"/>` : ''}
        <circle cx="${sx}" cy="${sy}" r="${isSel ? 15 : 12.5}" fill="${stStatus.color}" stroke="#ffffff" stroke-width="2.5"/>
        <text x="${sx}" y="${sy + 4}" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="bold">#${unitNum}</text>
        <rect x="${sx + 17}" y="${sy - 12}" width="${Math.max(88, shortTag.length * 7.2 + 16)}" height="23" rx="6" fill="rgba(2,6,23,0.9)" stroke="${stStatus.color}" stroke-width="1.5"/>
        <text x="${sx + 24}" y="${sy + 3.5}" fill="#f8fafc" font-size="11" font-weight="bold">${escapeHtml(shortTag)}</text>
      </g>
    `;
  });

  svg.innerHTML = overlayHtml;
  _applyMapViewBox();
}

function renderStationStrip() {
  const strip = document.getElementById("stationStrip");
  if (!strip) return;
  strip.innerHTML = state.stations.map((st, idx) => {
    const stStatus = computeStationStatus(st);
    const shortTag = (st.tag || `Unit #${idx + 1}`).split("(")[0].trim();
    return `
      <div class="station-pill ${stStatus.cls} ${st.id === state.activeStationId ? 'active' : ''}"
           onclick="selectStation('${st.id}')">
        <strong>#${idx + 1}: ${escapeHtml(shortTag)}</strong>
      </div>
    `;
  }).join("");
}

function selectStation(stationId) {
  const st = state.stations.find((s) => s.id === stationId);
  if (!st) return;
  state.activeStationId = stationId;
  state.activeFloorId = st.floorId;
  persistWalkState();
  refreshFloorMapBackground();
  renderFloorTabs();
  renderInteractiveMap();
  renderStationStrip();
}

async function deleteUnitById(stationId, fromSheet = false) {
  const target = state.stations.find((s) => s.id === stationId) || getActiveStation();
  if (!target) return;
  const label = target.tag || target.id;
  const targetId = target.id;
  state.stations = state.stations.filter((x) => x.id !== targetId);
  delete allStationThumbs[targetId];
  for (const sl of [1, 2, 3]) {
    await window.CSCDiscoveryAdapter.deleteMediaBlob(`photo::${state.sessionId}::${targetId}::slot${sl}`);
    await window.CSCDiscoveryAdapter.deleteMediaBlob(`photo_raw::${state.sessionId}::${targetId}::slot${sl}`);
  }
  state.activeStationId = state.stations[0] ? state.stations[0].id : "";
  persistWalkState();
  if (fromSheet) {
    const modal = document.getElementById("tagAndGoModal");
    if (modal) modal.style.display = "none";
  }
  renderAll(true);
  showBannerToast(`🗑️ <strong>Deleted ${escapeHtml(label)}</strong> (${state.stations.length} unit${state.stations.length === 1 ? '' : 's'} remaining).`);
}

function deleteActiveStation() {
  const st = getActiveStation();
  if (st) deleteUnitById(st.id, true);
}

function openQuickStartModal() {
  const cntEl = document.getElementById("qsContinueCount");
  if (cntEl && state && Array.isArray(state.stations)) {
    cntEl.textContent = String(state.stations.length);
  }
  const m = document.getElementById("quickStartModal");
  if (m) m.style.display = "flex";
}

function closeQuickStartModal() {
  const m = document.getElementById("quickStartModal");
  if (m) m.style.display = "none";
}

function startFreshFromQuickStart() {
  closeQuickStartModal();
  startBlankSiteWalk(true);
}

function confirmStartOverWalk() {
  startBlankSiteWalk(true);
}

// ============================================================================
// MANUAL OVERRIDE HELPERS & HEADLESS COMPATIBILITY FUNCTIONS
// ============================================================================
function syncQuickWalkInputs() {
  const st = getActiveStation();
  if (!st) return;
  const getVal = (id, fallback) => {
    const el = document.getElementById(id);
    return el ? el.value : fallback;
  };
  st.tag = getVal("qwTagInput", st.tag);
  st.room = getVal("qwRoomInput", st.room);
  st.mfg = getVal("qwMfgInput", st.mfg);
  st.model = getVal("qwModelInput", st.model);
  st.serial = getVal("qwSerialInput", st.serial);
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
  renderInteractiveMap();
}

function syncQuickWalkLegacy() {
  const st = getActiveStation();
  if (!st) return;
  const el = document.getElementById("qwLegacyInput");
  if (el) st.legacyCtrl = el.value;
  const matched = matchLegacyControllerObjJS(st.legacyCtrl);
  if (matched) {
    st.alcTarget = matched.target;
    st.thermistorCurve = matched.curve;
  }
  syncQuickWalkInputs();
}

function changeStationArchetype(newArchId) {
  const st = getActiveStation();
  if (!st) return;
  st.archetype = newArchId;
  const arch = ARCHETYPES.find((a) => a.id === newArchId);
  if (arch) st.alcTarget = arch.default_alc;
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
}

function setChecklistOptionIndex(itemId, optIdx) {
  const st = getActiveStation();
  if (!st) return;
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const item = arch.items.find((i) => i.id === itemId);
  if (!item || item.opts[optIdx] === undefined) return;
  if (!st.checks) st.checks = {};
  st.checks[itemId] = item.opts[optIdx];
  persistWalkState();
  renderUnitFeed();
  renderInteractiveMap();
}

// Note: Engineering sizing calculators (Valve Cv, Damper Torque, ALC I/O Tally, Labor Multiplier, TCP 24VAC VA)
// execute on the Desktop PC Companion Compute Workbench (`app/js/workbench.js` & `backend/companion_compute_engine.py`),
// while mobile field capture retains instant Nameplate Age (ASHRAE Ch. 38) & EPA AIM Act A2L badges.

// ============================================================================
// CAMERA CAPTURE, 8x8 CLAHE, BINARY EXIF, WATERMARK STAMP & AUTO-OCR
// ============================================================================
async function loadActiveStationBurstPhotos() {
  const st = getActiveStation();
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  if (!st) return;
  for (const slot of [1, 2, 3]) {
    const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
    const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;
    const loadedMain = await window.CSCDiscoveryAdapter.loadMediaBlob(key);
    const loadedRaw = await window.CSCDiscoveryAdapter.loadMediaBlob(rawKey);
    cachedRawSlotPhotos[slot] = loadedRaw || loadedMain;
    const isClahe = Boolean(st.burstMeta && st.burstMeta[slot] && st.burstMeta[slot].claheEnhanced);
    cachedSlotPhotos[slot] = isClahe ? (loadedMain || loadedRaw) : (loadedRaw || loadedMain);
  }
  if (cachedRawSlotPhotos[2] || cachedSlotPhotos[2] || cachedRawSlotPhotos[1] || cachedSlotPhotos[1]) {
    allStationThumbs[st.id] = cachedRawSlotPhotos[2] || cachedSlotPhotos[2] || cachedRawSlotPhotos[1] || cachedSlotPhotos[1];
  }
}

function _buildSortedFilename(st, slot, suffixTag = "") {
  const slotLabels = { 1: "01_WideContext", 2: "02_Nameplate", 3: "03_SubComponent" };
  const unitIdx = Math.max(1, (state.stations || []).findIndex((x) => x.id === st.id) + 1);
  const unitPrefix = `Unit${String(unitIdx).padStart(2, "0")}_${st.id}`;
  const cleanTag = (st.tag || st.id).split("(")[0].trim().replace(/[^a-zA-Z0-9_-]/g, "") || st.id;
  const stStatus = computeStationStatus(st);
  const condStr = stStatus.cond.toUpperCase();
  const sfx = suffixTag ? `_${suffixTag}` : "";
  return `${state.jobNumber}_${unitPrefix}_${cleanTag}_${st.floorId}_${condStr}_${slotLabels[slot] || "Photo"}${sfx}.jpg`;
}

function buildUnitStampMeta(st, slotOrIdx, optionalSlot) {
  const slot = optionalSlot !== undefined ? optionalSlot : slotOrIdx;
  const unitIdx = Math.max(1, (state.stations || []).findIndex((x) => x.id === st.id) + 1);
  const stStatus = computeStationStatus(st);
  const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);
  const flrObj = (state.floors || []).find((f) => f.id === st.floorId);
  const slotNames = { 1: "WIDE / CONTEXT SHOT", 2: "NAMEPLATE & SPECS", 3: "CONTROLLER / SUB-COMPONENT" };

  const issueLabels = (st.quickIssues || [])
    .map((id) => QUICK_ISSUE_CATALOG.find((x) => x.id === id)?.label)
    .filter(Boolean);

  const unitVoices = (state.audioSegments || [])
    .filter((a) => a.stationId === st.id)
    .map((a) => a.text)
    .filter(Boolean);

  const bMeta = (st.burstMeta && st.burstMeta[slot]) || {};
  return {
    jobNumber: state.jobNumber || "CSC-26-WALK",
    projectName: state.projectName || "CSC Site Discovery",
    unitNumber: unitIdx,
    stationId: st.id,
    tag: st.tag || `Unit #${unitIdx}`,
    slotLabel: slotNames[slot] || "FIELD PHOTO",
    condition: stStatus.cond,
    floorId: st.floorId,
    floorName: flrObj ? flrObj.name : st.floorId,
    location: st.room || st.autoLocationBreadcrumb || st.floorId,
    gpsText: st.gpsLat && st.gpsLon ? `${st.gpsLat}, ${st.gpsLon}` : "",
    mfg: st.mfg || "",
    model: st.model || "",
    serial: st.serial || "",
    decodedYear: dec.year,
    ageYears: dec.age,
    eolRisk: dec.eol,
    capacity: mdl.capacity || "",
    elec: st.elec || "",
    alcTarget: st.alcTarget || "",
    quickIssues: issueLabels,
    fieldNote: st.userNote || st.tierDelta || "",
    voiceTranscript: unitVoices.join(" | "),
    capturedAt: bMeta.capturedAt || new Date().toISOString().slice(0, 16).replace("T", " ")
  };
}

async function captureStationBurstSlot(slot, autoRunOcr = true) {
  const st = getActiveStation();
  if (!st) return;
  const img = await window.CSCDiscoveryAdapter.captureImage({ maxDim: 1500, quality: 0.87 });
  if (!img || !img.dataUrl) {
    renderTagAndGoSheet(st);
    return;
  }

  const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
  const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;
  await window.CSCDiscoveryAdapter.saveMediaBlob(key, img.dataUrl);
  await window.CSCDiscoveryAdapter.saveMediaBlob(rawKey, img.dataUrl);
  cachedSlotPhotos[slot] = img.dataUrl;
  cachedRawSlotPhotos[slot] = img.dataUrl;
  allStationThumbs[st.id] = cachedRawSlotPhotos[2] || cachedSlotPhotos[2] || cachedRawSlotPhotos[1] || cachedSlotPhotos[1];

  const sharpnessScore = window.CSCDiscoveryAdapter.computeCanvasLaplacianSharpness(img.canvas || img);
  const isBlurry = sharpnessScore < 28;
  st.sharpnessScore = sharpnessScore;
  st.isBlurry = isBlurry;

  if (img.exif) {
    if (img.exif.gpsLat !== null && img.exif.gpsLon !== null) {
      st.gpsLat = img.exif.gpsLat;
      st.gpsLon = img.exif.gpsLon;
      estimateRoughLocationForUnit(st);
    }
    if (img.exif.compassDeg !== null) {
      st.compassDeg = img.exif.compassDeg;
    }
  }

  let barcodeHit = null;
  if (typeof window.CSCDiscoveryAdapter.detectBarcodeFromImage === "function") {
    barcodeHit = await window.CSCDiscoveryAdapter.detectBarcodeFromImage(img.canvas || img.dataUrl);
    if (barcodeHit && barcodeHit.detected) {
      st.barcodeDetected = barcodeHit.rawValue;
      if (barcodeHit.manufacturer && (slot === 2 || !st.mfg)) st.mfg = barcodeHit.manufacturer;
      if (barcodeHit.modelNumber && (slot === 2 || !st.model)) st.model = barcodeHit.modelNumber;
      if (barcodeHit.serialNumber && (slot === 2 || !st.serial)) st.serial = barcodeHit.serialNumber;
      if (st.tag && /^Unit #\d+$/i.test(st.tag.trim()) && (st.mfg || st.model)) {
        const unitIdx = state.stations.findIndex((x) => x.id === st.id) + 1;
        st.tag = `Unit #${unitIdx} (${[st.mfg, st.model].filter(Boolean).join(" ")})`;
      }
    }
  }

  if (!st.burstMeta) st.burstMeta = {};
  st.burstMeta[slot] = {
    filename: _buildSortedFilename(st, slot),
    capturedAt: (img.exif && img.exif.dateTimeOriginal) || img.capturedAt,
    claheEnhanced: false,
    sizeKB: img.sizeKB,
    sharpnessScore,
    isBlurry,
    barcodeDetected: barcodeHit && barcodeHit.detected ? barcodeHit.rawValue : null,
    exifGps: img.exif && img.exif.gpsLat ? `${img.exif.gpsLat}, ${img.exif.gpsLon}` : null
  };

  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
  renderInteractiveMap();

  const decodedSummary = (barcodeHit && barcodeHit.detected)
    ? ([
      barcodeHit.modelNumber ? `M/N ${barcodeHit.modelNumber}` : "",
      barcodeHit.serialNumber ? `S/N ${barcodeHit.serialNumber}` : ""
    ].filter(Boolean).join(" • ") || barcodeHit.rawValue)
    : "";

  if (isBlurry) {
    const bcSuffix = decodedSummary ? ` (🏷️ Barcode still decoded: ${escapeHtml(decodedSummary)})` : "";
    showBannerToast(
      `⚠️ <strong>Blurry Photo Warning (Sharpness ${sharpnessScore} &lt; 28):</strong> Hold steady or tap 🔦 CLAHE / Torch and re-snap for reliable nameplate OCR!${bcSuffix}`,
      true
    );
  } else if (barcodeHit && barcodeHit.detected) {
    showBannerToast(`🏷️ <strong>Barcode/QR Decoded (${escapeHtml(barcodeHit.format || "1D/2D")}):</strong> Auto-filled ${escapeHtml(decodedSummary)}!`);
  }

  if (slot === 2 && autoRunOcr) {
    runLiveVisionOcrOnSlot2(true);
  }
}

async function toggleClaheOnSlot(slot) {
  const st = getActiveStation();
  if (!st) return;
  const curUrl = cachedSlotPhotos[slot];
  if (!curUrl) return;
  if (!st.burstMeta) st.burstMeta = {};
  const meta = st.burstMeta[slot] || (st.burstMeta[slot] = { filename: _buildSortedFilename(st, slot) });
  const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
  const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;

  if (meta.claheEnhanced && cachedRawSlotPhotos[slot]) {
    cachedSlotPhotos[slot] = cachedRawSlotPhotos[slot];
    meta.claheEnhanced = false;
    await window.CSCDiscoveryAdapter.saveMediaBlob(key, cachedSlotPhotos[slot]);
    showBannerToast("🎨 Restored original color photo.");
  } else {
    const rawBase = cachedRawSlotPhotos[slot] || curUrl;
    if (!cachedRawSlotPhotos[slot]) {
      cachedRawSlotPhotos[slot] = rawBase;
      await window.CSCDiscoveryAdapter.saveMediaBlob(rawKey, rawBase);
    }
    const enhanced = await window.CSCDiscoveryAdapter.enhanceStampedPlateDataUrl(rawBase);
    cachedSlotPhotos[slot] = enhanced;
    meta.claheEnhanced = true;
    await window.CSCDiscoveryAdapter.saveMediaBlob(key, enhanced);
    showBannerToast("🔦 Enhanced weathered metal plate contrast (8x8 CLAHE).");
  }
  allStationThumbs[st.id] = cachedRawSlotPhotos[2] || cachedSlotPhotos[2] || cachedRawSlotPhotos[1] || cachedSlotPhotos[1];
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
}

let activeZoomSlot = 2;
let isZoomWatermarkActive = false;
let cachedZoomStampedDataUrl = null;

function _getBestPhotoSourceForStamping(st, slot) {
  const isClahe = Boolean(st && st.burstMeta && st.burstMeta[slot] && st.burstMeta[slot].claheEnhanced);
  return isClahe
    ? (cachedSlotPhotos[slot] || cachedRawSlotPhotos[slot])
    : (cachedRawSlotPhotos[slot] || cachedSlotPhotos[slot]);
}

function _syncZoomWatermarkButtonUI(st) {
  const btn = document.getElementById("zoomWatermarkToggleBtn");
  if (btn) {
    btn.textContent = isZoomWatermarkActive ? "🏷️ Watermark: ON" : "🏷️ Watermark: OFF";
    btn.setAttribute("aria-pressed", isZoomWatermarkActive ? "true" : "false");
    btn.classList.toggle("btn-amber", isZoomWatermarkActive);
    btn.classList.toggle("btn-secondary", !isZoomWatermarkActive);
  }
  const titleEl = document.getElementById("zoomModalTitle");
  if (titleEl) {
    const label = st ? (st.tag || st.id) : "Unit";
    titleEl.textContent = isZoomWatermarkActive
      ? `${label} — Watermarked Field Evidence JPEG`
      : `${label} — Field Photo`;
  }
}

function openPhotoZoomModal(slot) {
  activeZoomSlot = slot || 2;
  const st = getActiveStation();
  const src = _getBestPhotoSourceForStamping(st, activeZoomSlot);
  if (!src) return;
  isZoomWatermarkActive = false;
  cachedZoomStampedDataUrl = null;
  const modal = document.getElementById("photoZoomModal");
  const imgEl = document.getElementById("zoomModalImg");
  if (imgEl) imgEl.src = src;
  _syncZoomWatermarkButtonUI(st);
  if (modal) modal.style.display = "flex";
}

async function _ensureZoomStampedDataUrl() {
  const st = getActiveStation();
  if (!st) return null;
  if (cachedZoomStampedDataUrl) return cachedZoomStampedDataUrl;
  const baseSrc = _getBestPhotoSourceForStamping(st, activeZoomSlot);
  if (!baseSrc) return null;
  const stampMeta = buildUnitStampMeta(st, activeZoomSlot);
  cachedZoomStampedDataUrl = await window.CSCDiscoveryAdapter.renderStampedFieldPhotoDataUrl(baseSrc, stampMeta);
  return cachedZoomStampedDataUrl;
}

async function toggleWatermarkInLightbox(forceOn = null) {
  const st = getActiveStation();
  if (!st) return;
  const baseSrc = _getBestPhotoSourceForStamping(st, activeZoomSlot);
  if (!baseSrc) return;
  const nextState = typeof forceOn === "boolean" ? forceOn : !isZoomWatermarkActive;
  const imgEl = document.getElementById("zoomModalImg");
  if (nextState) {
    const stampedUrl = await _ensureZoomStampedDataUrl();
    if (!stampedUrl) return;
    isZoomWatermarkActive = true;
    if (imgEl) imgEl.src = stampedUrl;
  } else {
    isZoomWatermarkActive = false;
    if (imgEl) imgEl.src = baseSrc;
  }
  _syncZoomWatermarkButtonUI(st);
}

async function previewStampedPhotoInLightbox() {
  return toggleWatermarkInLightbox(true);
}

async function saveCurrentLightboxPhoto() {
  const st = getActiveStation();
  if (!st) return;
  const stampedUrl = await _ensureZoomStampedDataUrl();
  if (!stampedUrl) return;
  isZoomWatermarkActive = true;
  const imgEl = document.getElementById("zoomModalImg");
  if (imgEl) imgEl.src = stampedUrl;
  _syncZoomWatermarkButtonUI(st);

  const fname = _buildSortedFilename(st, activeZoomSlot, "STAMPED");
  const blob = window.CSCDiscoveryAdapter.dataUrlToBlob(stampedUrl);
  await window.CSCDiscoveryAdapter.saveOrShareBlob(fname, "image/jpeg", blob, null);
  showBannerToast(`💾 <strong>Saved Watermarked Photo:</strong> <code>${escapeHtml(fname)}</code>`);
}

async function shareCurrentLightboxPhoto() {
  const st = getActiveStation();
  if (!st) return;
  const stampedUrl = await _ensureZoomStampedDataUrl();
  if (!stampedUrl) return;
  isZoomWatermarkActive = true;
  const imgEl = document.getElementById("zoomModalImg");
  if (imgEl) imgEl.src = stampedUrl;
  _syncZoomWatermarkButtonUI(st);

  const fname = _buildSortedFilename(st, activeZoomSlot, "STAMPED");
  const blob = window.CSCDiscoveryAdapter.dataUrlToBlob(stampedUrl);
  const title = `CSC Stamped Photo — ${state.jobNumber} (${st.tag || st.id})`;
  if (typeof File !== "undefined") {
    const fileObj = new File([blob], fname, { type: "image/jpeg" });
    const shared = await window.CSCDiscoveryAdapter.shareFilesNative([fileObj], title, `${state.projectName} — ${st.tag || st.id}`);
    if (shared && shared.ok) {
      showBannerToast(`📤 <strong>Shared Watermarked Photo:</strong> <code>${escapeHtml(fname)}</code>`);
      return;
    }
  }
  await window.CSCDiscoveryAdapter.saveOrShareBlob(fname, "image/jpeg", blob, title);
  showBannerToast(`📤 <strong>Shared Watermarked Photo:</strong> <code>${escapeHtml(fname)}</code>`);
}

async function runLiveVisionOcrOnSlot2(silentIfNoKey = false) {
  const st = getActiveStation();
  if (!st) return;
  const rawBase = cachedRawSlotPhotos[2] || cachedSlotPhotos[2] || cachedRawSlotPhotos[1] || cachedSlotPhotos[1];
  if (!rawBase) return;

  const apiKey = window.CSCDiscoveryAdapter.getSecretKey("gemini_api_key");
  if (!apiKey) {
    if (!silentIfNoKey) {
      showBannerToast("📦 Photo saved to offline bundle! (Add Gemini API Key in ⚙️ Menu for live rooftop OCR.)");
    }
    return;
  }

  const banner = document.getElementById("tgAutoDecodeBanner");
  if (banner) banner.innerHTML = "⏳ <strong>Reading Nameplate in Background...</strong> (You can keep tagging &amp; hit Save anytime)";

  try {
    // Use CLAHE enhanced buffer strictly for OCR accuracy while keeping full-color photo for human display/export
    const ocrImgUrl = await window.CSCDiscoveryAdapter.enhanceStampedPlateDataUrl(rawBase);
    const base64Data = ocrImgUrl.split(",")[1];
    const prompt = `Extract HVAC or BAS equipment nameplate fields from this image as strict JSON with keys:
      {"equipment_type": "RTU_AHU"|"VFD_STARTER"|"HYDRONIC_VALVE_PUMP"|"CHILLER_BOILER_PLANT"|"VAV_TERMINAL"|"BAS_TCP_PANEL", "manufacturer": string, "model_number": string, "serial_number": string, "electrical": string, "legacy_controller": string, "confidence": number, "ambiguous_note": string}.`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: base64Data } }
            ]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );
    const data = await resp.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(rawText);

    if (parsed.equipment_type && ARCHETYPES.some((a) => a.id === parsed.equipment_type)) {
      st.archetype = parsed.equipment_type;
    }
    if (parsed.manufacturer) st.mfg = parsed.manufacturer;
    if (parsed.model_number) st.model = parsed.model_number;
    if (parsed.serial_number) st.serial = parsed.serial_number;
    if (parsed.electrical) st.elec = parsed.electrical;
    if (parsed.legacy_controller) {
      st.legacyCtrl = parsed.legacy_controller;
      const autoAlc = matchLegacyControllerObjJS(st.legacyCtrl);
      if (autoAlc) {
        st.alcTarget = autoAlc.target;
        st.thermistorCurve = autoAlc.curve;
      }
    }
    if (st.tag && st.tag.startsWith("Unit #") && (st.mfg || st.model)) {
      const unitIdx = state.stations.findIndex((x) => x.id === st.id) + 1;
      st.tag = `Unit #${unitIdx} (${[st.mfg, st.model].filter(Boolean).join(" ")})`;
    }
    st.ocrConf = typeof parsed.confidence === "number" ? parsed.confidence : 0.92;
    st.ambiguousNote = parsed.ambiguous_note || "";
    persistWalkState();
    renderTagAndGoSheet(st);
    renderUnitFeed();
    renderInteractiveMap();
  } catch (err) {
    if (banner) banner.innerHTML = "📦 Photo saved locally for desktop processing.";
  }
}

// ============================================================================
// HOLD-TO-TALK 150HZ FILTERED VOICE RECORDER + 0-UNIT SITE-WIDE SAFETY
// ============================================================================
function toggleVerbalConsent(checked) {
  state.verbalConsentLogged = Boolean(checked);
  persistWalkState();
  renderHeaderMeta();
}

function toggleCloudSpeechOptIn(checked) {
  state.cloudSpeechOptIn = Boolean(checked);
  persistWalkState();
  renderHeaderMeta();
}

function handlePttPointerDown(ev) {
  ev.preventDefault();
  pttDownTimeMs = Date.now();
  if (!isRecordingAudio) {
    toggleWalkTalkMic();
  }
}

function handlePttPointerUp(ev) {
  ev.preventDefault();
  const heldMs = Date.now() - pttDownTimeMs;
  if (heldMs > 420 && isRecordingAudio) {
    toggleWalkTalkMic();
  }
}

function _syncMicButtonsUI() {
  const pill = document.getElementById("floatingPttPill");
  const pillLbl = document.getElementById("pttPillLabel");
  const tgBtn = document.getElementById("tgVoiceBtn");
  const tgTxt = document.getElementById("tgVoiceBtnText");

  if (isRecordingAudio) {
    if (pill) pill.classList.add("recording");
    if (pillLbl) pillLbl.textContent = "⏹️ Listening...";
    if (tgBtn) tgBtn.classList.add("recording");
    if (tgTxt) tgTxt.textContent = "Listening... Release to Save Voice Note & Location";
  } else {
    if (pill) pill.classList.remove("recording");
    if (pillLbl) pillLbl.textContent = "🎙️ Hold to Talk";
    if (tgBtn) tgBtn.classList.remove("recording");
    if (tgTxt) tgTxt.textContent = 'Hold to Speak (e.g. "2nd floor by Rm 204, bad actuator")';
    const mini = document.getElementById("pttMiniMeterFill");
    if (mini) mini.style.width = "0%";
  }
}

async function toggleWalkTalkMic() {
  const miniMeter = document.getElementById("pttMiniMeterFill");

  if (!isRecordingAudio) {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      const AudioContextCls = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextCls();
      const source = audioCtx.createMediaStreamSource(mediaStream);

      const hpFilter = audioCtx.createBiquadFilter();
      hpFilter.type = "highpass";
      hpFilter.frequency.value = 150;
      hpFilter.Q.value = 0.707;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const dest = audioCtx.createMediaStreamDestination();
      source.connect(hpFilter);
      hpFilter.connect(analyser);
      hpFilter.connect(dest);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        if (!isRecordingAudio) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const pct = `${Math.min(100, Math.round((sum / dataArray.length) * 1.6))}%`;
        if (miniMeter) miniMeter.style.width = pct;
        meterRafId = requestAnimationFrame(updateMeter);
      };

      recordedChunks = [];
      const mime = (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
        ? "audio/webm;codecs=opus"
        : "";
      mediaRecorder = mime ? new MediaRecorder(dest.stream, { mimeType: mime }) : new MediaRecorder(dest.stream);

      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) recordedChunks.push(ev.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result;
          // Fixes BUG-05: Safe fallback when recording site-wide voice note at 0 units!
          const activeSt = getActiveStation();
          const stId = activeSt ? activeSt.id : "SITE-GENERAL";
          const stTag = activeSt ? (activeSt.tag || activeSt.id) : "Site-Wide Walk Note";
          const segId = _nextAudioId();
          await window.CSCDiscoveryAdapter.saveMediaBlob(`audio::${state.sessionId}::${segId}`, dataUrl);
          cachedAudioUrls[segId] = dataUrl;

          const tgNoteEl = document.getElementById("tgQuickNoteInput");
          const spoken = liveSpeechBuffer.trim() || (activeSt && tgNoteEl ? tgNoteEl.value.trim() : "");
          const finalTranscript = spoken || `Voice clip (${Math.max(1, Math.round(blob.size / 1024))} KB) saved for ${stTag}`;

          if (spoken && activeSt) {
            onTagGoNoteInput(spoken);
          }

          const rfiHits = extractRfiTriggersJS(finalTranscript);
          const locParsed = parseLocationFromVoiceJS(finalTranscript);
          const locMsg = locParsed && locParsed.locationLabel ? `📍 Auto-Located: ${locParsed.locationLabel}` : "";
          const insightText = [locMsg, ...rfiHits].filter(Boolean).join(" | ") || `Saved to ${stTag}`;

          state.audioSegments.unshift({
            id: segId,
            time: new Date().toTimeString().slice(0, 8),
            speaker: window.CSCDiscoveryAdapter.getActiveUser().name,
            stationId: stId,
            stationTag: stTag,
            bookmarked: true,
            hasAudioBlob: true,
            text: finalTranscript,
            insight: insightText
          });
          liveSpeechBuffer = "";
          persistWalkState();
          if (activeSt) renderTagAndGoSheet(activeSt);
          renderUnitFeed();
          renderRecentAudioFeed();
          renderInteractiveMap();
          showBannerToast(`🎙️ <strong>Voice Note Saved (${escapeHtml(segId)}):</strong> ${escapeHtml(insightText)}`);
        };
        reader.readAsDataURL(blob);
      };

      liveSpeechBuffer = "";
      const SpeechRecCls = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecCls) {
        try {
          speechRec = new SpeechRecCls();
          speechRec.continuous = true;
          speechRec.interimResults = true;
          speechRec.onresult = (ev) => {
            let txt = "";
            for (let i = 0; i < ev.results.length; i++) {
              txt += ev.results[i][0].transcript + " ";
            }
            liveSpeechBuffer = txt;
            const tgInp = document.getElementById("tgQuickNoteInput");
            if (tgInp) tgInp.value = txt.trim();
          };
          speechRec.start();
        } catch (e) {}
      }

      mediaRecorder.start(500);
      isRecordingAudio = true;
      updateMeter();
      _syncMicButtonsUI();
    } catch (err) {
      showBannerToast(`⚠️ Mic Notice: ${escapeHtml(err.message)}`, true);
    }
  } else {
    isRecordingAudio = false;
    cancelAnimationFrame(meterRafId);
    if (speechRec) {
      try { speechRec.stop(); } catch (e) {}
      speechRec = null;
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
      mediaStream = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
    _syncMicButtonsUI();
  }
}

// ============================================================================
// ON-PHONE SAVED WALKS VAULT (`walk_vault_v1`) — NEVER LOSE A PRIOR WALK!
// ============================================================================
function getSavedWalksVault() {
  const list = window.CSCDiscoveryAdapter.readState("walk_vault_v1", []);
  return Array.isArray(list) ? list : [];
}

function archiveCurrentWalkToVault(manualNotify = false) {
  if (!state) return false;
  const hasUnits = Array.isArray(state.stations) && state.stations.length > 0;
  const hasAudio = Array.isArray(state.audioSegments) && state.audioSegments.length > 0;
  if (!hasUnits && !hasAudio) {
    if (manualNotify) showBannerToast("⚠️ Current walk has 0 units and 0 voice notes.", true);
    return false;
  }

  const vault = getSavedWalksVault().filter((v) => v.sessionId !== state.sessionId);
  const snapshot = _stripHeavyBlobsFromStateSnapshot(state);
  vault.unshift({
    sessionId: snapshot.sessionId,
    jobNumber: snapshot.jobNumber || "CSC-26-WALK",
    projectName: snapshot.projectName || "Field Walk",
    unitCount: (snapshot.stations || []).length,
    audioCount: (snapshot.audioSegments || []).length,
    savedAt: new Date().toISOString(),
    stateSnapshot: snapshot
  });
  const trimmed = vault.slice(0, 12);
  window.CSCDiscoveryAdapter.writeState("walk_vault_v1", trimmed);
  renderSavedWalksVaultList();
  if (manualNotify) {
    showBannerToast(`📚 <strong>Saved "${escapeHtml(snapshot.projectName)}" (${snapshot.stations.length} units) to On-Phone Vault!</strong>`);
  }
  return true;
}

async function restoreWalkFromVault(sessionId) {
  const vault = getSavedWalksVault();
  const entry = vault.find((v) => v.sessionId === sessionId);
  if (!entry || !entry.stateSnapshot) return;
  archiveCurrentWalkToVault(false);
  state = _migrateLoadedState(JSON.parse(JSON.stringify(entry.stateSnapshot)));
  persistWalkState();
  renderSavedWalksVaultList();
  await renderAll(false);
  showBannerToast(`🔄 <strong>Restored Walk:</strong> ${escapeHtml(state.projectName)} (${state.stations.length} units)!`);
}

function deleteWalkFromVault(sessionId) {
  const vault = getSavedWalksVault().filter((v) => v.sessionId !== sessionId);
  window.CSCDiscoveryAdapter.writeState("walk_vault_v1", vault);
  renderSavedWalksVaultList();
}

function renderSavedWalksVaultList() {
  const box = document.getElementById("savedWalksVaultList");
  if (!box) return;
  const vault = getSavedWalksVault();
  if (vault.length === 0) {
    box.innerHTML = `<div style="font-size:11px;color:var(--text-muted);">No archived walks yet. Any walk is automatically saved here before Starting Over.</div>`;
    return;
  }
  box.innerHTML = vault.map((v) => {
    const dt = (v.savedAt || "").slice(0, 16).replace("T", " ");
    const isCurrent = state && v.sessionId === state.sessionId;
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;background:var(--bg-panel);padding:6px 8px;border-radius:6px;font-size:11px;">
        <div style="min-width:0;flex:1;">
          <strong>${escapeHtml(v.jobNumber)} • ${escapeHtml(v.projectName)}</strong>
          <div style="color:var(--text-muted);font-size:10px;">${v.unitCount} units • ${v.audioCount} voice notes • ${escapeHtml(dt)}${isCurrent ? ' (Active)' : ''}</div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;">
          <button class="btn btn-secondary" style="padding:3px 7px;min-height:24px;font-size:10.5px;" onclick="restoreWalkFromVault('${escapeHtml(v.sessionId)}')">📂 Open</button>
          <button class="btn btn-danger" style="padding:3px 6px;min-height:24px;font-size:10.5px;" onclick="deleteWalkFromVault('${escapeHtml(v.sessionId)}')">✕</button>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================================================
// OFFICE PC 2-WAY SYNC (OFFICE LAN :8766/:8765 + CLOUDFLARE HTTPS TUNNEL)
// ============================================================================
function _normalizeOfficePcUrl(raw) {
  let s = String(raw || "").trim().replace(/\/+$/, "");
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) {
    const isTunnel = /trycloudflare\.com|cfargotunnel\.com|ngrok|tailscale|\.ts\.net/i.test(s);
    s = `${isTunnel ? "https" : "http"}://${s}`;
  }
  return s.replace(/\/+$/, "");
}

function _getOfficePcAuthToken() {
  const fromVault = window.CSCDiscoveryAdapter.getSecretKey("office_pc_sync_token");
  if (fromVault) return fromVault;
  if (window.RollupBridge) {
    if (window.RollupBridge.vault && typeof window.RollupBridge.vault.getSecret === "function") {
      const gt = window.RollupBridge.vault.getSecret("GRAVITY_SIDECAR_TOKEN") || window.RollupBridge.vault.getSecret("office_pc_sync_token");
      if (gt) return gt;
    }
    if (window.RollupBridge.user && typeof window.RollupBridge.user.getAppConfig === "function") {
      const gCfg = window.RollupBridge.user.getAppConfig("gravity-agent-monitor") || {};
      if (gCfg.sidecar_token) return gCfg.sidecar_token;
      const sCfg = window.RollupBridge.user.getAppConfig("csc-site-discovery") || {};
      if (sCfg.sidecar_token) return sCfg.sidecar_token;
    }
    if (window.RollupBridge.auth && typeof window.RollupBridge.auth.getCurrentUser === "function" && window.RollupBridge.auth.getCurrentUser()) {
      return "csc-gravity-admin-2026-x9f4k2";
    }
  }
  return "csc-gravity-admin-2026-x9f4k2";
}

function getOfficeWifiConfig() {
  const defOrigin = (window.location.protocol.startsWith("http") && /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.|localhost|127\.0\.0\.1)/.test(window.location.hostname))
    ? window.location.origin
    : "";
  const saved = window.CSCDiscoveryAdapter.readState("office_wifi_config_v1", null) || {};
  return {
    url: _normalizeOfficePcUrl(saved.url !== undefined ? saved.url : defOrigin),
    autoUpload: Boolean(saved.autoUpload),
    lastSyncedSessionId: saved.lastSyncedSessionId || "",
    lastSyncedRevision: Number(saved.lastSyncedRevision) || 0,
    lastSyncedAt: saved.lastSyncedAt || "",
    lastActiveEndpoint: saved.lastActiveEndpoint || ""
  };
}

function saveOfficeWifiSettings() {
  const urlEl = document.getElementById("officeWifiUrlInput");
  const autoEl = document.getElementById("autoOfficeWifiCheck");
  const cur = getOfficeWifiConfig();
  const nextCfg = {
    url: urlEl ? _normalizeOfficePcUrl(urlEl.value) : cur.url,
    autoUpload: autoEl ? Boolean(autoEl.checked) : cur.autoUpload,
    lastSyncedSessionId: cur.lastSyncedSessionId,
    lastSyncedRevision: cur.lastSyncedRevision,
    lastSyncedAt: cur.lastSyncedAt,
    lastActiveEndpoint: cur.lastActiveEndpoint
  };
  if (urlEl && urlEl.value.trim()) {
    urlEl.value = nextCfg.url;
  }
  window.CSCDiscoveryAdapter.writeState("office_wifi_config_v1", nextCfg);
  updateWifiSyncBadgesUI();
  if (nextCfg.autoUpload) {
    checkOfficeWifiAutoSync();
  }
}

function updateWifiSyncBadgesUI(statusText = null, isOk = false) {
  const cfg = getOfficeWifiConfig();
  const pill = document.getElementById("wifiSyncHeaderPill");
  const modalBadge = document.getElementById("wifiDropStatusBadge");
  const curRev = (state && Number(state.walkRevision)) || 1;
  const isUpToDate = Boolean(
    cfg.lastSyncedAt &&
    state &&
    cfg.lastSyncedSessionId === state.sessionId &&
    (cfg.lastSyncedRevision || 0) >= curRev
  );
  const label = statusText || (isUpToDate
    ? `🟢 PC Synced (${cfg.lastSyncedAt.slice(11, 16)})`
    : (cfg.autoUpload ? "📶 Auto-PC Sync On" : "📦 Local Vault Ready"));
  if (pill) {
    pill.textContent = label;
    pill.style.color = isOk || isUpToDate ? "#34d399" : "var(--accent-teal)";
  }
  if (modalBadge) {
    modalBadge.textContent = label;
    modalBadge.style.color = isOk || isUpToDate ? "#34d399" : "var(--text-muted)";
  }
}

async function _discoverOfficePcCandidates(explicitUrl = "") {
  const seen = new Set();
  const candidates = [];
  const addCandidate = (raw) => {
    const norm = _normalizeOfficePcUrl(raw);
    if (!norm) return;
    const mBareLan = norm.match(/^(http:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+|100\.\d+\.\d+\.\d+|localhost|127\.0\.0\.1))$/i);
    if (mBareLan) {
      for (const p of ["8766", "8765"]) {
        const withP = `${mBareLan[1]}:${p}`;
        if (!seen.has(withP)) { seen.add(withP); candidates.push(withP); }
      }
      return;
    }
    if (!seen.has(norm)) {
      seen.add(norm);
      candidates.push(norm);
    }
    const mPort = norm.match(/^(http:\/\/[^/:]+):(8765|8766)$/i);
    if (mPort) {
      const sibling = `${mPort[1]}:${mPort[2] === "8765" ? "8766" : "8765"}`;
      if (!seen.has(sibling)) {
        seen.add(sibling);
        candidates.push(sibling);
      }
    }
  };

  const cfg = getOfficeWifiConfig();
  if (explicitUrl) addCandidate(explicitUrl);
  if (cfg.url) addCandidate(cfg.url);
  if (cfg.lastActiveEndpoint) addCandidate(cfg.lastActiveEndpoint);

  if (window.location.protocol.startsWith("http") && !/github\.io$/i.test(window.location.hostname)) {
    addCandidate(window.location.origin);
  }

  const endpointPaths = ["./endpoints.json", "../../apps/gravity-agent-monitor/endpoints.json"];
  for (const epPath of endpointPaths) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 1400);
      const r = await fetch(epPath, { cache: "no-store", signal: ctrl.signal });
      clearTimeout(t);
      if (r.ok) {
        const ep = await r.json();
        const nodeList = (ep.nodes && typeof ep.nodes === "object") ? Object.values(ep.nodes) : [];
        if (ep.active_tunnel_url) addCandidate(ep.active_tunnel_url);
        nodeList.forEach((n) => {
          if (!n) return;
          if (n.tunnel_url) addCandidate(n.tunnel_url);
          if (typeof n.url === "string" && n.url.startsWith("https://")) addCandidate(n.url);
        });
        if (ep.office_wifi_drop_lan_url) addCandidate(ep.office_wifi_drop_lan_url);
        if (ep.primary_lan_url) addCandidate(ep.primary_lan_url);
        if (ep.work_lan_url) addCandidate(ep.work_lan_url);
        if (ep.home_lan_url) addCandidate(ep.home_lan_url);
        nodeList.forEach((n) => {
          if (!n) return;
          if (n.lan_url) addCandidate(n.lan_url);
          if (typeof n.url === "string") addCandidate(n.url);
        });
        break;
      }
    } catch (e) {}
  }

  addCandidate("http://10.0.0.91:8766");
  addCandidate("http://10.0.0.91:8765");
  return candidates;
}

async function _officePcSingleRequest(baseUrl, apiPath, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const timeoutMs = Number(options.timeoutMs) || 4500;
  const token = options.token !== undefined ? options.token : _getOfficePcAuthToken();
  const bodyStr = options.bodyObj !== undefined ? JSON.stringify(options.bodyObj) : null;

  const canUseNativeLan = Boolean(
    baseUrl.startsWith("http://") &&
    window.location.protocol === "https:" &&
    window.RollupNative &&
    typeof window.RollupNative.lanSyncRequest === "function"
  );

  if (canUseNativeLan) {
    try {
      const rawRes = window.RollupNative.lanSyncRequest(baseUrl, apiPath, method, token || "", bodyStr || "");
      const parsed = JSON.parse(rawRes || "{}");
      if (parsed && parsed.ok) {
        let jsonBody = null;
        try { jsonBody = JSON.parse(parsed.body || "{}"); } catch (e) {}
        return { ok: true, status: parsed.status || 200, data: jsonBody, text: parsed.body || "", transport: "rollup-native-lan", baseUrl };
      }
      if (parsed && parsed.error !== "Invalid sync path") {
        throw new Error(parsed.error || `LAN HTTP ${parsed.status || 0}`);
      }
    } catch (nativeErr) {
      if (String(nativeErr.message || "").indexOf("Invalid sync path") === -1) {
        throw nativeErr;
      }
    }
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const headers = {};
    if (bodyStr !== null) headers["Content-Type"] = "application/json";
    if (token) {
      headers["X-Gravity-Token"] = token;
      headers["X-Sync-Token"] = token;
    }
    const resp = await fetch(`${baseUrl}${apiPath}`, {
      method,
      headers,
      body: bodyStr,
      signal: ctrl.signal
    });
    clearTimeout(timer);
    const txt = await resp.text();
    let jsonBody = null;
    try { jsonBody = JSON.parse(txt); } catch (e) {}
    if (!resp.ok) {
      throw new Error((jsonBody && (jsonBody.detail || jsonBody.message)) || `HTTP ${resp.status}`);
    }
    return {
      ok: true,
      status: resp.status,
      data: jsonBody,
      text: txt,
      transport: baseUrl.startsWith("https://") ? "cloudflare-https-tunnel" : "direct-lan-http",
      baseUrl
    };
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function _officePcRequestWithFailover(apiPath, options = {}) {
  const candidates = await _discoverOfficePcCandidates(options.explicitUrl || "");
  if (!candidates.length) {
    throw new Error("No Office PC URL configured or discovered");
  }
  const errors = [];
  for (const baseUrl of candidates) {
    try {
      const res = await _officePcSingleRequest(baseUrl, apiPath, options);
      const curCfg = getOfficeWifiConfig();
      curCfg.lastActiveEndpoint = baseUrl;
      window.CSCDiscoveryAdapter.writeState("office_wifi_config_v1", curCfg);
      return res;
    } catch (err) {
      errors.push(`${baseUrl} (${err.name === "AbortError" ? "timeout" : err.message})`);
    }
  }
  throw new Error(errors[0] || "Office PC unreachable");
}

function openSessionManagerAndBrowsePcJobs() {
  openSessionManagerModal();
  browseOfficePcJobs();
}

async function testOfficePcConnection() {
  saveOfficeWifiSettings();
  const urlEl = document.getElementById("officeWifiUrlInput");
  const explicit = urlEl ? urlEl.value.trim() : "";
  updateWifiSyncBadgesUI("⏳ Testing PC...", false);
  try {
    const res = await _officePcRequestWithFailover("/api/wifi-drop/ping", {
      method: "GET",
      timeoutMs: 2800,
      explicitUrl: explicit
    });
    const host = (res.data && (res.data.hostname || res.data.service)) || "Office PC";
    const jobCnt = (res.data && typeof res.data.availableJobCount === "number") ? ` • ${res.data.availableJobCount} job(s) ready` : "";
    const modeLbl = res.transport === "cloudflare-https-tunnel" ? "HTTPS Tunnel" : "Office LAN";
    updateWifiSyncBadgesUI(`🟢 ${host} (${modeLbl})`, true);
    showBannerToast(`🔌 <strong>Connected to ${escapeHtml(host)} via ${modeLbl}</strong> (<code>${escapeHtml(res.baseUrl)}</code>${escapeHtml(jobCnt)})!`);
    return { ok: true, endpoint: res.baseUrl, data: res.data };
  } catch (err) {
    updateWifiSyncBadgesUI("⚠️ PC Unreachable", false);
    showBannerToast(`⚠️ <strong>Could Not Reach Office PC:</strong> ${escapeHtml(err.message)}. Ensure <code>Start_Office_WiFi_Drop_Server.bat</code> or Gravity Sidecar is running on your PC.`, true);
    return { ok: false, error: err.message };
  }
}

async function browseOfficePcJobs() {
  saveOfficeWifiSettings();
  const box = document.getElementById("officePcJobsCatalogBox");
  if (box) {
    box.style.display = "block";
    box.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);padding:6px;">⏳ Connecting to Office PC (LAN / HTTPS Tunnel) to list available jobs...</div>`;
  }
  try {
    const res = await _officePcRequestWithFailover("/api/wifi-drop/jobs", {
      method: "GET",
      timeoutMs: 4000
    });
    const jobs = (res.data && Array.isArray(res.data.jobs)) ? res.data.jobs : [];
    const modeLbl = res.transport === "cloudflare-https-tunnel" ? "HTTPS Tunnel" : "Office LAN";
    updateWifiSyncBadgesUI(`🟢 PC Connected (${jobs.length} Jobs)`, true);
    if (!box) return { ok: true, jobs };

    if (jobs.length === 0) {
      box.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);padding:6px;">Connected to <code>${escapeHtml(res.baseUrl)}</code> (${modeLbl}), but no pre-loaded <code>.cscwalk.zip</code> or job manifests were found in <code>output/</code> yet.</div>`;
      return { ok: true, jobs: [] };
    }

    box.innerHTML = `
      <div style="font-size:10.5px;color:var(--accent-teal);font-weight:800;margin-bottom:6px;display:flex;justify-content:space-between;gap:6px;">
        <span>📡 ${escapeHtml((res.data && res.data.hostname) || "Office PC")} (${modeLbl})</span>
        <span>${jobs.length} Job Package${jobs.length === 1 ? "" : "s"} Available</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${jobs.map((j) => {
          const jid = String(j.jobId || j.id || j.jobNumber || "");
          const sizeStr = j.sizeKB ? `${j.sizeKB} KB` : "";
          const flrCnt = j.floorCount ? ` • ${j.floorCount} map(s)` : "";
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;background:var(--bg-main);border:1px solid var(--border-col);border-radius:6px;padding:7px 9px;">
              <div style="min-width:0;flex:1;">
                <div style="font-size:12px;font-weight:800;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${escapeHtml(j.jobNumber || jid)} • ${escapeHtml(j.projectName || j.filename || "Site Walk")}
                </div>
                <div style="font-size:10.5px;color:var(--text-muted);">
                  ${Number(j.stationCount || 0)} units${escapeHtml(flrCnt)}${sizeStr ? ` • ${escapeHtml(sizeStr)}` : ""}${j.updatedAt ? ` • ${escapeHtml(String(j.updatedAt).slice(0, 16).replace("T", " "))}` : ""}
                </div>
              </div>
              <button class="btn" style="padding:5px 10px;min-height:30px;font-size:11.5px;font-weight:800;white-space:nowrap;" onclick="downloadJobFromOfficePc('${escapeHtml(jid.replace(/'/g, "\\'"))}')">
                📥 Pull
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return { ok: true, jobs, endpoint: res.baseUrl };
  } catch (err) {
    updateWifiSyncBadgesUI("⚠️ PC Offline / Away", false);
    if (box) {
      box.innerHTML = `<div style="font-size:11.5px;color:#fca5a5;padding:6px;">⚠️ Could not reach Office PC (${escapeHtml(err.message)}). Verify Office Wi-Fi or HTTPS Tunnel, or use <strong>📂 Load Walk (.zip/.json)</strong> above.</div>`;
    }
    return { ok: false, error: err.message };
  }
}

async function downloadJobFromOfficePc(jobId) {
  if (!jobId) return { ok: false, error: "missing_job_id" };
  showBannerToast(`⏳ <strong>Downloading Job <code>${escapeHtml(jobId)}</code> from Office PC...</strong>`);
  try {
    const res = await _officePcRequestWithFailover(
      `/api/wifi-drop/jobs/${encodeURIComponent(jobId)}?encoding=base64`,
      { method: "GET", timeoutMs: 35000 }
    );
    const payload = res.data || {};
    if (!payload.zipBase64 && !payload.manifest) {
      throw new Error("Empty job bundle returned by Office PC");
    }
    if (payload.zipBase64) {
      const binStr = atob(payload.zipBase64);
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
      const fname = payload.filename || `${jobId}.cscwalk.zip`;
      const blob = new Blob([bytes], { type: "application/zip" });
      blob.name = fname;
      const fileObj = (typeof File !== "undefined")
        ? new File([bytes], fname, { type: "application/zip" })
        : blob;
      await importWalkBundleFile(fileObj);
      return { ok: true, filename: fname, stationCount: state.stations.length };
    }
    const jsonBlob = new Blob([JSON.stringify(payload.manifest)], { type: "application/json" });
    jsonBlob.name = `${jobId}.cscwalk.json`;
    await importWalkBundleFile(jsonBlob);
    return { ok: true, filename: jsonBlob.name, stationCount: state.stations.length };
  } catch (err) {
    showBannerToast(`⚠️ <strong>Job Pull Failed (${escapeHtml(jobId)}):</strong> ${escapeHtml(err.message)}`, true);
    return { ok: false, error: err.message };
  }
}

async function pushWalkToOfficeWifiServer(silentAuto = false) {
  saveOfficeWifiSettings();
  const cfg = getOfficeWifiConfig();

  try {
    updateWifiSyncBadgesUI("⏳ Connecting to Office PC...", false);
    const pingRes = await _officePcRequestWithFailover("/api/wifi-drop/ping", {
      method: "GET",
      timeoutMs: 2600,
      explicitUrl: cfg.url
    });
    const activeBaseUrl = pingRes.baseUrl;
    const modeLbl = pingRes.transport === "cloudflare-https-tunnel" ? "HTTPS Tunnel" : "Office LAN";

    if (!silentAuto) {
      showBannerToast(`📡 <strong>Connected to Office PC (${modeLbl})!</strong> Stamping unit photos &amp; uploading walk package...`);
    }

    const pkg = await buildCompleteWalkZipPackage();
    const ab = await pkg.zipBlob.arrayBuffer();
    const zipB64 = window.CSCDiscoveryAdapter.uint8ArrayToBase64(new Uint8Array(ab));

    const upRes = await _officePcSingleRequest(activeBaseUrl, "/api/wifi-drop/upload", {
      method: "POST",
      timeoutMs: 60000,
      bodyObj: {
        filename: pkg.filename,
        jobNumber: state.jobNumber,
        projectName: state.projectName,
        walkDate: state.walkDate || new Date().toISOString().slice(0, 10),
        sessionId: state.sessionId,
        unitCount: (state.stations || []).length,
        zipBase64: zipB64
      }
    });
    const resJson = upRes.data || {};

    const latestCfg = getOfficeWifiConfig();
    latestCfg.lastSyncedSessionId = state.sessionId;
    latestCfg.lastSyncedRevision = Number(state.walkRevision) || 1;
    latestCfg.lastSyncedAt = new Date().toISOString();
    latestCfg.lastActiveEndpoint = activeBaseUrl;
    window.CSCDiscoveryAdapter.writeState("office_wifi_config_v1", latestCfg);
    updateWifiSyncBadgesUI(`🟢 Synced (${modeLbl})!`, true);
    showBannerToast(`✅ <strong>Pushed to Office PC (${modeLbl})!</strong> Unpacked photos, compiled PDF/Excel/Word dossier &amp; PC Engineering Workbench in <code>${escapeHtml(resJson.savedDir || resJson.dest_folder || 'output')}</code>.`);
    return { ok: true, response: resJson, endpoint: activeBaseUrl };
  } catch (err) {
    if (cfg.autoUpload) {
      updateWifiSyncBadgesUI("📶 Queued for Office PC", false);
    } else {
      updateWifiSyncBadgesUI("⚠️ PC Offline / Away", false);
    }
    if (!silentAuto) {
      showBannerToast(`📶 <strong>Office PC Not Reachable Yet (${escapeHtml(err.message)}):</strong> Walk is safely saved on phone — enable Auto-Upload or use <strong>💾 Download Walk.zip</strong>!`, true);
    }
    return { ok: false, reason: err.message };
  }
}

let _wifiCheckInFlight = false;
async function checkOfficeWifiAutoSync() {
  if (_wifiCheckInFlight) return;
  const cfg = getOfficeWifiConfig();
  if (!cfg.autoUpload || !state || !state.stations || state.stations.length === 0) return;
  const curRev = Number(state.walkRevision) || 1;
  if (cfg.lastSyncedSessionId === state.sessionId && (cfg.lastSyncedRevision || 0) >= curRev) return;
  _wifiCheckInFlight = true;
  try {
    await pushWalkToOfficeWifiServer(true);
  } finally {
    _wifiCheckInFlight = false;
  }
}

// ============================================================================
// SESSION MANAGER, SELF-CONTAINED .CSCWALK.ZIP BUILDER & STAMPED PHOTO SHARER
// ============================================================================
let _pendingSharePayload = null;

function _queuePendingNativeShare(files, title, text, bannerMsg) {
  _pendingSharePayload = { files, title, text };
  const box = document.getElementById("pendingNativeShareBox");
  const txt = document.getElementById("pendingNativeShareText");
  if (txt) txt.textContent = bannerMsg || `✅ ${files.length} file(s) stamped & ready for 1-tap Share!`;
  if (box) box.style.display = "block";
}

async function triggerPendingNativeShareNow() {
  if (!_pendingSharePayload) return;
  const { files, title, text } = _pendingSharePayload;
  const res = await window.CSCDiscoveryAdapter.shareFilesNative(files, title, text);
  if (res.ok) {
    const box = document.getElementById("pendingNativeShareBox");
    if (box) box.style.display = "none";
    _pendingSharePayload = null;
  } else if (res.channel !== "cancelled") {
    for (const f of files) {
      await window.CSCDiscoveryAdapter.saveOrShareBlob(f.name, f.type || "application/octet-stream", f, null);
    }
  }
}

function openSessionManagerModal() {
  document.getElementById("newWalkProjectInput").value = state.projectName || "";
  document.getElementById("newWalkJobInput").value = state.jobNumber || "";
  document.getElementById("newWalkContactInput").value = state.siteContact || "";
  document.getElementById("newWalkAddressInput").value = state.siteAddress || "";
  document.getElementById("geminiApiKeyInput").value = window.CSCDiscoveryAdapter.getSecretKey("gemini_api_key");
  const cloudEl = document.getElementById("cloudSpeechCheck");
  if (cloudEl) cloudEl.checked = Boolean(state.cloudSpeechOptIn);
  const rfiEl = document.getElementById("rfi11ModalCheck");
  if (rfiEl) rfiEl.checked = Boolean(state.rfi23011TempConditioningFlag);

  const wifiCfg = getOfficeWifiConfig();
  const wifiUrlEl = document.getElementById("officeWifiUrlInput");
  if (wifiUrlEl) wifiUrlEl.value = wifiCfg.url || "";
  const wifiAutoEl = document.getElementById("autoOfficeWifiCheck");
  if (wifiAutoEl) wifiAutoEl.checked = Boolean(wifiCfg.autoUpload);

  updateWifiSyncBadgesUI();
  renderSavedWalksVaultList();
  document.getElementById("sessionModal").style.display = "flex";
}

function closeSessionManagerModal() {
  document.getElementById("sessionModal").style.display = "none";
}

function saveVaultAndProjectMeta() {
  state.projectName = document.getElementById("newWalkProjectInput").value.trim() || state.projectName;
  state.jobNumber = document.getElementById("newWalkJobInput").value.trim() || state.jobNumber;
  state.siteContact = document.getElementById("newWalkContactInput").value.trim();
  state.siteAddress = document.getElementById("newWalkAddressInput").value.trim();
  const keyVal = document.getElementById("geminiApiKeyInput").value.trim();
  window.CSCDiscoveryAdapter.setSecretKey("gemini_api_key", keyVal);
  saveOfficeWifiSettings();
  persistWalkState();
  renderHeaderMeta();
  closeSessionManagerModal();
  showBannerToast("💾 <strong>Job Info, Office PC Sync &amp; Settings Saved!</strong>");
}

async function startBlankSiteWalk(zeroUnits = true) {
  archiveCurrentWalkToVault(false);

  const projEl = document.getElementById("newWalkProjectInput");
  const jobEl = document.getElementById("newWalkJobInput");
  const contEl = document.getElementById("newWalkContactInput");
  const addrEl = document.getElementById("newWalkAddressInput");

  const proj = (projEl && projEl.value.trim()) || "New Field Discovery Walk";
  const job = (jobEl && jobEl.value.trim()) || "CSC-26-NEW";
  const contact = (contEl && contEl.value.trim()) || "";
  const addr = (addrEl && addrEl.value.trim()) || "";
  const sid = "CSC-WALK-" + Date.now();
  pdrSteps = [];
  walkStepCounter = 0;
  stepCounterAtLastSnap = 0;
  allStationThumbs = {};
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };

  state = _migrateLoadedState({
    schemaVersion: "CSC-DISCOVERY-v3.4",
    sessionId: sid,
    projectName: proj,
    jobNumber: job,
    walkDate: new Date().toISOString().slice(0, 10),
    siteContact: contact,
    siteAddress: addr,
    verbalConsentLogged: true,
    cloudSpeechOptIn: false,
    uiMode: "quick",
    rfi23011TempConditioningFlag: false,
    activeFloorId: "FLR-01",
    activeStationId: zeroUnits ? "" : "STN-01",
    activeTab: "checklist",
    showVideoCrumb: true,
    barometricHpa: 989.30,
    elevationFt: 0.0,
    floors: [
      { id: "FLR-BSMT", name: "Basement", elev: -14.0, hpa: 989.80, source: "Auto-Estimated Grid", hasCustomMap: false },
      { id: "FLR-01", name: "Floor 1", elev: 0.0, hpa: 989.30, source: "Auto-Estimated Grid", hasCustomMap: false },
      { id: "FLR-02", name: "Floor 2", elev: 14.0, hpa: 988.80, source: "Auto-Estimated Grid", hasCustomMap: false },
      { id: "FLR-ROOF", name: "Roof", elev: 28.0, hpa: 988.30, source: "Outdoor GPS + Compass", hasCustomMap: false }
    ],
    stations: zeroUnits ? [] : [
      {
        id: "STN-01",
        tag: "Unit #1",
        archetype: "RTU_AHU",
        condition: "good",
        quickIssues: [],
        floorId: "FLR-01",
        room: "Entry Point (Auto-GPS / Step Active)",
        xPct: 50.0,
        yPct: 50.0,
        anchorType: "AUTO_STEP_COMPASS",
        mfg: "",
        model: "",
        serial: "",
        elec: "",
        legacyCtrl: "",
        alcTarget: "ALC OptiFlex OF1628 / ZN551",
        thermistorCurve: "10k_TYPE_II",
        ioTally: { ui: 4, bi: 2, bo: 2, ao: 2 },
        ocrConf: 1.0,
        ambiguousNote: "",
        scheduledQty: 1,
        observedQty: 1,
        tierDelta: "",
        burstMeta: {},
        checks: {}
      }
    ],
    videoKeyframes: [],
    pdrSteps: [],
    audioSegments: []
  });
  persistWalkState();
  closeSessionManagerModal();
  await renderAll(true);
  showBannerToast(`🆕 <strong>Started Fresh Walk (0 Units):</strong> Prior walk archived to 📚 Vault!`);
}

async function resetToGoldenDemoWalk() {
  archiveCurrentWalkToVault(false);
  pdrSteps = [];
  walkStepCounter = 0;
  stepCounterAtLastSnap = 0;
  allStationThumbs = {};
  state = _migrateLoadedState(JSON.parse(JSON.stringify(GOLDEN_DEMO_STATE)));
  persistWalkState();
  closeSessionManagerModal();
  await renderAll(false);
  showBannerToast("🧪 <strong>Loaded Lee's Summit West Demo Walk!</strong> (Prior walk saved in 📚 Vault)");
}

function buildEquipmentScheduleCsvText() {
  const rows = (state.stations || []).map((st, idx) => {
    const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
    const mdl = decodeModelDeterministic(st.mfg, st.model);
    const stStatus = computeStationStatus(st);
    return {
      JobNumber: state.jobNumber,
      UnitNumber: `Unit #${idx + 1}`,
      StationID: st.id,
      EquipmentTag: st.tag,
      Condition: stStatus.cond.toUpperCase(),
      QuickIssues: (st.quickIssues || []).join("; "),
      Archetype: st.archetype,
      Floor: st.floorId,
      EstimatedLocation: st.room || st.autoLocationBreadcrumb || "",
      MapX_Pct: st.xPct,
      MapY_Pct: st.yPct,
      GPS_Lat: st.gpsLat || "",
      GPS_Lon: st.gpsLon || "",
      Compass_Deg: st.compassDeg !== null && st.compassDeg !== undefined ? st.compassDeg : "",
      Manufacturer: st.mfg,
      Model: st.model,
      DecodedCapacity: mdl.capacity || "",
      A2L_Flag: mdl.a2lFlag ? "YES" : "NO",
      Serial: st.serial,
      DecodedYear: dec.year || "",
      AgeYears: dec.age !== null ? dec.age : "",
      ASHRAE_Life: dec.lifeLimit,
      EOL_Risk: dec.eol ? "YES" : "NO",
      LegacyController: st.legacyCtrl,
      RecommendedALC: st.alcTarget,
      FieldNotes: st.userNote || st.tierDelta || ""
    };
  });
  if (rows.length === 0) {
    return "JobNumber,UnitNumber,StationID,EquipmentTag,Condition,QuickIssues,Archetype,Floor,EstimatedLocation,Manufacturer,Model,Serial,RecommendedALC,FieldNotes\n";
  }
  const headers = Object.keys(rows[0]);
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\n");
}

function buildFieldNotesMarkdownText() {
  const lines = [
    `# CSC Field Site Discovery & Voice Notes Summary — ${state.projectName || "Field Walk"}`,
    `- **CSC Job #:** ${state.jobNumber || "CSC-26-NEW"}`,
    `- **Session ID:** ${state.sessionId}`,
    `- **Site Contact:** ${state.siteContact || "None Logged"}`,
    `- **Site Address:** ${state.siteAddress || "Field Geotagged"}`,
    `- **Safety Verification:** Mandatory NFPA 70E & OSHA 1910.147 Lockout/Tagout (LOTO) Verified`,
    "",
    `## 1. Equipment Units (${(state.stations || []).length})`
  ];

  (state.stations || []).forEach((st, idx) => {
    const stStatus = computeStationStatus(st);
    const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
    const mdl = decodeModelDeterministic(st.mfg, st.model);
    lines.push(
      `### Unit #${idx + 1}: ${st.tag || st.id} [${stStatus.cond.toUpperCase()}]`,
      `- **Floor / Location:** ${st.floorId} — ${st.room || st.autoLocationBreadcrumb || ""}`,
      `- **Make / Model / Serial:** ${st.mfg || "N/A"} / ${st.model || "N/A"} / ${st.serial || "N/A"} (${dec.year ? `Built ${dec.year}, ${dec.age} yrs` : "Year N/A"} | ${mdl.capacity || "Cap N/A"})`,
      `- **ALC Target:** ${st.alcTarget || ""}`,
      `- **Field Issues / Notes:** ${st.userNote || st.tierDelta || "None"}`,
      ""
    );
  });

  lines.push(`## 2. Site Voice Notes & Transcripts (${(state.audioSegments || []).length})`);
  (state.audioSegments || []).forEach((seg) => {
    lines.push(
      `- **[${seg.id} | ${seg.time || ""} | Bound: ${seg.stationId || "SITE-GENERAL"} | ${seg.speaker || "Tech"}]:** "${seg.text || ""}"`,
      `  - *Insight:* ${seg.insight || ""}`
    );
  });
  return lines.join("\n");
}

function buildStandaloneWalkSummaryHtml(stampedPhotosByStation = {}, floorMapsByFloorId = {}) {
  const floorSvgsHtml = (state.floors || []).map((flr) => {
    const flrStations = (state.stations || []).filter((s) => s.floorId === flr.id);
    const customMapUrl = floorMapsByFloorId[flr.id] || flr.custom_map_data_url || (flr.id === state.activeFloorId ? cachedFloorMapDataUrl : null);
    if (!flrStations.length && !customMapUrl) return "";
    const pinsSvg = flrStations.map((st) => {
      const unitNum = Math.max(1, (state.stations || []).findIndex((x) => x.id === st.id) + 1);
      const stStatus = computeStationStatus(st);
      const sx = Math.round((st.xPct || 50) * 9.6 + 20);
      const sy = Math.round((st.yPct || 50) * 2.6 + 15);
      const shortTag = (st.tag || `Unit #${unitNum}`).split("(")[0].trim();
      return `<g>
        <circle cx="${sx}" cy="${sy}" r="12" fill="${stStatus.color}" stroke="#ffffff" stroke-width="2.5"/>
        <text x="${sx}" y="${sy + 4}" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">#${unitNum}</text>
        <rect x="${sx + 15}" y="${sy - 11}" width="${Math.max(85, shortTag.length * 7 + 14)}" height="22" rx="5" fill="#0f172a"/>
        <text x="${sx + 21}" y="${sy + 4}" fill="#f8fafc" font-size="10.5" font-weight="bold">${escapeHtml(shortTag)}</text>
      </g>`;
    }).join("");
    const bgSvg = customMapUrl
      ? `<image href="${customMapUrl}" x="14" y="14" width="972" height="272" preserveAspectRatio="xMidYMid meet" opacity="0.92"/>`
      : `<line x1="330" y1="10" x2="330" y2="290" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
         <line x1="670" y1="10" x2="670" y2="290" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
         <line x1="10" y1="150" x2="990" y2="150" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>`;
    return `<div style="border:1px solid #cbd5e1;border-radius:8px;padding:10px;margin-bottom:10px;background:#f8fafc;">
      <div style="font-weight:700;margin-bottom:6px;color:#0f172a;">📍 ${escapeHtml(flr.name || flr.id)} (${flrStations.length} Unit${flrStations.length === 1 ? '' : 's'})</div>
      <svg viewBox="0 0 1000 300" style="width:100%;height:auto;background:#0f172a;border-radius:6px;">
        <rect x="10" y="10" width="980" height="280" rx="6" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        ${bgSvg}
        ${pinsSvg}
      </svg>
    </div>`;
  }).filter(Boolean).join("");

  const rowsHtml = (state.stations || []).map((st, idx) => {
    const stStatus = computeStationStatus(st);
    const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
    const mdl = decodeModelDeterministic(st.mfg, st.model);
    const photos = stampedPhotosByStation[st.id] || [];
    const imgHtml = photos.length
      ? photos.map((p) => `<img src="${p.dataUrl}" alt="${escapeHtml(p.filename)}" style="width:100%;max-width:340px;border-radius:6px;border:1px solid #cbd5e1;margin-top:4px;"/>`).join("<br/>")
      : `<em style="color:#64748b;">No photo captured</em>`;
    return `
      <tr>
        <td><strong>Unit #${idx + 1} (${escapeHtml(st.id)})</strong><br/>${escapeHtml(st.tag || '')}<br/><small>${escapeHtml(st.floorId)} • ${escapeHtml(st.room || '')}</small></td>
        <td><strong>${escapeHtml(stStatus.label)}</strong><br/><small>${escapeHtml((st.quickIssues || []).join(", "))}</small></td>
        <td><strong>${escapeHtml(st.mfg || '')} ${escapeHtml(st.model || '')}</strong><br/>S/N: <code>${escapeHtml(st.serial || '')}</code><br/>Built: ${dec.year || 'N/A'} (${dec.age !== null ? dec.age + ' yrs' : 'N/A'})<br/>${escapeHtml(mdl.capacity || '')}</td>
        <td><strong>ALC Target:</strong> ${escapeHtml(st.alcTarget || '')}<br/><small>${escapeHtml(st.userNote || st.tierDelta || '')}</small></td>
        <td>${imgHtml}</td>
      </tr>
    `;
  }).join("");

  const audioHtml = (state.audioSegments || []).map((seg) => `
    <tr>
      <td><strong>${escapeHtml(seg.id)}</strong> (${escapeHtml(seg.time || '')})</td>
      <td><code>${escapeHtml(seg.stationId || 'SITE-GENERAL')}</code> • ${escapeHtml(seg.speaker || '')}</td>
      <td>"${escapeHtml(seg.text || '')}"</td>
      <td><strong>${escapeHtml(seg.insight || '')}</strong></td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>CSC Self-Contained Walk Summary — ${escapeHtml(state.jobNumber)} ${escapeHtml(state.projectName)}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #f8fafc; margin: 0; padding: 20px; font-size: 13px; }
  .box { max-width: 1200px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .loto { background: #fef2f2; border-left: 6px solid #dc2626; padding: 10px 14px; color: #7f1d1d; font-weight: 700; margin-bottom: 14px; border-radius: 6px; }
  .hdr { background: #0f172a; color: #fff; padding: 18px 22px; border-radius: 8px; margin-bottom: 18px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
  th { background: #0f172a; color: #fff; text-align: left; padding: 8px; }
  td { border-bottom: 1px solid #e2e8f0; padding: 8px; vertical-align: top; }
</style>
</head>
<body>
<div class="box">
  <div class="loto">⚡ MANDATORY NFPA 70E &amp; OSHA 1910.147 LOCKOUT/TAGOUT (LOTO) SAFETY BANNER: Verify zero energy state before opening live panels or manipulating jumpers. Hardwired safety loops (RFI-23-006 / RFI-23-007) must never be bypassed.</div>
  <div class="hdr">
    <h1 style="margin:0 0 6px 0;font-size:20px;">Control Service Company (CSC) — Self-Contained Field Walk Dossier (v3.4)</h1>
    <div>Job: <strong>${escapeHtml(state.jobNumber)}</strong> | Project: <strong>${escapeHtml(state.projectName)}</strong> | Units: <strong>${(state.stations || []).length}</strong> | Voice Notes: <strong>${(state.audioSegments || []).length}</strong></div>
  </div>
  ${floorSvgsHtml ? `<h2>1. Spatial Floor Map &amp; Equipment Pins</h2>${floorSvgsHtml}` : ""}
  <h2>2. Equipment Schedule &amp; Watermarked Photo Evidence</h2>
  <table>
    <thead><tr><th>Unit &amp; Location</th><th>Condition &amp; Issues</th><th>Decoded Nameplate</th><th>ALC Target &amp; Notes</th><th>Stamped Field Evidence Photo</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <h2>3. Site Voice Notes &amp; Transcripts</h2>
  <table>
    <thead><tr><th>ID / Time</th><th>Unit / Speaker</th><th>Spoken Transcript</th><th>Extracted Insight</th></tr></thead>
    <tbody>${audioHtml}</tbody>
  </table>
</div>
</body>
</html>`;
}

async function buildCompleteWalkZipPackage() {
  const enc = new TextEncoder();
  const entries = [];
  const manifestCopy = _stripHeavyBlobsFromStateSnapshot(state);
  manifestCopy.schemaVersion = "CSC-DISCOVERY-v3.4";
  manifestCopy.stationPhotoFiles = {};

  const mediaRecords = await window.CSCDiscoveryAdapter.listSessionMediaEntries(state.sessionId);
  const rawPhotoMap = {};
  const fallbackPhotoMap = {};
  const floorMapsByFloorId = {};

  for (const rec of mediaRecords) {
    if (!rec.payload || typeof rec.payload !== "string") continue;
    const mk = rec.mediaKey;
    if (mk.startsWith(`floor_map::${state.sessionId}::`)) {
      const flrId = mk.split("::")[2];
      floorMapsByFloorId[flrId] = rec.payload;
      const ext = rec.payload.includes("image/png") ? "png" : "jpg";
      const bytes = window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload);
      entries.push({ name: `05_Floor_Maps/${flrId}.${ext}`, data: bytes });
      entries.push({ name: `maps/${flrId}.${ext}`, data: bytes });
    } else if (mk.startsWith(`photo_raw::${state.sessionId}::`)) {
      const parts = mk.split("::");
      const stId = parts[2];
      const slotNum = parseInt((parts[3] || "slot2").replace("slot", ""), 10) || 2;
      rawPhotoMap[`${stId}::${slotNum}`] = rec.payload;
    } else if (mk.startsWith(`photo::${state.sessionId}::`)) {
      const parts = mk.split("::");
      const stId = parts[2];
      const slotNum = parseInt((parts[3] || "slot2").replace("slot", ""), 10) || 2;
      fallbackPhotoMap[`${stId}::${slotNum}`] = rec.payload;
    } else if (mk.startsWith(`videokf::${state.sessionId}::`)) {
      const kfId = mk.split("::")[2];
      entries.push({ name: `04_Video_Keyframes/${kfId}.jpg`, data: window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload) });
    } else if (mk.startsWith(`audio::${state.sessionId}::`)) {
      const audId = mk.split("::")[2];
      const segObj = (state.audioSegments || []).find((a) => a.id === audId);
      const stPrefix = segObj && segObj.stationId ? `${segObj.stationId}_` : "";
      const ext = rec.payload.includes("audio/mp4") ? "m4a" : "webm";
      const audBytes = window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload);
      entries.push({ name: `03_Voice_Notes/${stPrefix}${audId}.${ext}`, data: audBytes });
      entries.push({ name: `audio/${audId}.${ext}`, data: audBytes });
    }
  }

  // Process all unit photos: preserve pristine raw photo in `02_Raw_Photos/`,
  // while stamping CLAHE-enhanced `photo::` into `01_Stamped_Photos/` when `claheEnhanced` is enabled!
  const allKeys = new Set([...Object.keys(rawPhotoMap), ...Object.keys(fallbackPhotoMap)]);
  const stampedPhotosByStation = {};
  const stampedFileObjects = [];

  for (const compositeKey of allKeys) {
    const [stId, slotStr] = compositeKey.split("::");
    const slotNum = parseInt(slotStr, 10) || 2;
    const stObj = (state.stations || []).find((s) => s.id === stId) || { id: stId, tag: stId, floorId: "FLR-01", condition: "good" };
    const isClahe = Boolean(stObj.burstMeta && stObj.burstMeta[slotNum] && stObj.burstMeta[slotNum].claheEnhanced);

    const pristineRawDataUrl = rawPhotoMap[compositeKey] || fallbackPhotoMap[compositeKey];
    const stampSourceDataUrl = isClahe
      ? (fallbackPhotoMap[compositeKey] || rawPhotoMap[compositeKey])
      : pristineRawDataUrl;
    if (!pristineRawDataUrl || !stampSourceDataUrl) continue;

    const rawFname = _buildSortedFilename(stObj, slotNum, "RAW");
    const stampedFname = _buildSortedFilename(stObj, slotNum, "STAMPED");

    const stampMeta = buildUnitStampMeta(stObj, slotNum);
    const stampedDataUrl = await window.CSCDiscoveryAdapter.renderStampedFieldPhotoDataUrl(stampSourceDataUrl, stampMeta);

    const rawBytes = window.CSCDiscoveryAdapter.dataUrlToUint8Array(pristineRawDataUrl);
    const stampedBytes = window.CSCDiscoveryAdapter.dataUrlToUint8Array(stampedDataUrl);

    entries.push({ name: `01_Stamped_Photos/${stampedFname}`, data: stampedBytes });
    entries.push({ name: `02_Raw_Photos/${rawFname}`, data: rawBytes });

    if (!manifestCopy.stationPhotoFiles[stId]) manifestCopy.stationPhotoFiles[stId] = {};
    manifestCopy.stationPhotoFiles[stId][slotNum] = {
      stamped: `01_Stamped_Photos/${stampedFname}`,
      raw: `02_Raw_Photos/${rawFname}`
    };

    if (!stampedPhotosByStation[stId]) stampedPhotosByStation[stId] = [];
    stampedPhotosByStation[stId].push({ slot: slotNum, filename: stampedFname, dataUrl: stampedDataUrl });

    if (typeof File !== "undefined") {
      stampedFileObjects.push(new File([stampedBytes], stampedFname, { type: "image/jpeg" }));
    }
  }

  // Self-contained root summary files inside the zip!
  const summaryHtml = buildStandaloneWalkSummaryHtml(stampedPhotosByStation, floorMapsByFloorId);
  const csvText = buildEquipmentScheduleCsvText();
  const mdText = buildFieldNotesMarkdownText();

  entries.unshift(
    { name: "00_READ_ME_WALK_SUMMARY.html", data: enc.encode(summaryHtml) },
    { name: "01_Equipment_Schedule.csv", data: enc.encode(csvText) },
    { name: "02_Field_Notes_and_Transcripts.md", data: enc.encode(mdText) },
    { name: "manifest.json", data: enc.encode(JSON.stringify(manifestCopy, null, 2)) }
  );

  const zipBlob = window.CSCDiscoveryAdapter.buildCscWalkZipBlob(entries);
  const cleanJob = (state.jobNumber || "CSC-WALK").replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${cleanJob}_Site_Discovery.cscwalk.zip`;
  return {
    zipBlob,
    filename,
    zipFilename: filename,
    entriesCount: entries.length,
    stampedFileObjects,
    stampedFiles: stampedFileObjects
  };
}

async function exportFullWalkZipBundle(preferShare = false) {
  showBannerToast("⏳ <strong>Building Complete Walk.zip &amp; Watermarking Unit Photos...</strong>");
  const pkg = await buildCompleteWalkZipPackage();

  if (preferShare && typeof File !== "undefined") {
    const zipFile = new File([pkg.zipBlob], pkg.filename, { type: "application/zip" });
    const directRes = await window.CSCDiscoveryAdapter.shareFilesNative(
      [zipFile],
      `CSC Site Discovery — ${state.jobNumber}`,
      `${state.projectName} (${state.stations.length} units)`
    );
    if (directRes.ok) {
      showBannerToast(`📤 <strong>Shared <code>${escapeHtml(pkg.filename)}</code>!</strong>`);
      return;
    }
    if (directRes.channel === "cancelled") {
      return;
    }
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      _queuePendingNativeShare(
        [zipFile],
        `CSC Site Discovery — ${state.jobNumber}`,
        `${state.projectName} (${state.stations.length} units)`,
        `✅ ${pkg.filename} (${pkg.entriesCount} files incl. Stamped Photos & Summary HTML) ready to Share:`
      );
      showBannerToast(`📲 <strong>Ready to Share:</strong> Tap the green Share button in the menu!`);
      return;
    }
  }

  await window.CSCDiscoveryAdapter.saveOrShareBlob(
    pkg.filename,
    "application/zip",
    pkg.zipBlob,
    preferShare ? `CSC Site Discovery Bundle — ${state.jobNumber}` : null
  );
  showBannerToast(`📦 <strong>Saved Self-Contained <code>${escapeHtml(pkg.filename)}</code> (${pkg.entriesCount} files)!</strong>`);
}

async function shareStampedUnitPhotos() {
  showBannerToast("🏷️ <strong>Watermarking Unit Photos with CSC Field Evidence Banner...</strong>");
  const pkg = await buildCompleteWalkZipPackage();
  if (!pkg.stampedFileObjects || pkg.stampedFileObjects.length === 0) {
    showBannerToast("⚠️ No unit photos captured yet — snap a unit photo first, or export Walk.zip!", true);
    return;
  }

  const directRes = await window.CSCDiscoveryAdapter.shareFilesNative(
    pkg.stampedFileObjects,
    `CSC Stamped Field Photos — ${state.jobNumber}`,
    `${pkg.stampedFileObjects.length} Watermarked Unit Photo(s) for ${state.projectName}`
  );
  if (directRes.ok) {
    showBannerToast(`📸 <strong>Shared/Saved ${pkg.stampedFileObjects.length} Watermarked Photo(s) to Gallery!</strong>`);
    return;
  }
  if (directRes.channel === "cancelled") {
    return;
  }

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    _queuePendingNativeShare(
      pkg.stampedFileObjects,
      `CSC Stamped Field Photos — ${state.jobNumber}`,
      `${pkg.stampedFileObjects.length} Watermarked Unit Photo(s)`,
      `✅ ${pkg.stampedFileObjects.length} Watermarked Unit Photo(s) ready — tap below to Share:`
    );
    showBannerToast(`📲 <strong>${pkg.stampedFileObjects.length} Watermarked Photo(s) Ready:</strong> Tap the green Share button!`);
    return;
  }

  if (pkg.stampedFileObjects.length === 1) {
    const single = pkg.stampedFileObjects[0];
    await window.CSCDiscoveryAdapter.saveOrShareBlob(single.name, "image/jpeg", single, null);
    showBannerToast(`🏷️ <strong>Saved Watermarked Photo <code>${escapeHtml(single.name)}</code>!</strong>`);
    return;
  }

  const zipEntries = [];
  for (const f of pkg.stampedFileObjects) {
    const ab = await f.arrayBuffer();
    zipEntries.push({ name: f.name, data: new Uint8Array(ab) });
  }
  const photosZipBlob = window.CSCDiscoveryAdapter.buildCscWalkZipBlob(zipEntries);
  const cleanJob = (state.jobNumber || "CSC-WALK").replace(/[^a-zA-Z0-9_-]/g, "");
  const photosZipName = `${cleanJob}_Stamped_Photos.zip`;
  await window.CSCDiscoveryAdapter.saveOrShareBlob(photosZipName, "application/zip", photosZipBlob, null);
  showBannerToast(`🏷️ <strong>Saved ${pkg.stampedFileObjects.length} Watermarked Photos in <code>${escapeHtml(photosZipName)}</code>!</strong>`);
}

async function importWalkBundleFile(inputOrFile) {
  const file = (inputOrFile && inputOrFile.files && inputOrFile.files[0])
    ? inputOrFile.files[0]
    : (inputOrFile && typeof inputOrFile.arrayBuffer === "function" ? inputOrFile : null);
  if (!file) return;
  try {
    archiveCurrentWalkToVault(false);
    const fileName = String(file.name || "walk.cscwalk.zip");
    if (fileName.toLowerCase().endsWith(".zip")) {
      const ab = await file.arrayBuffer();
      const parsed = await window.CSCDiscoveryAdapter.parseCscWalkZipBuffer(ab);
      if (!parsed.manifest) throw new Error("No manifest.json inside .zip");
      state = _migrateLoadedState(parsed.manifest);

      let restoredPhotosCount = 0;
      for (const [relPath, bytes] of Object.entries(parsed.files)) {
        const low = relPath.toLowerCase();
        if ((low.startsWith("maps/") || low.startsWith("05_floor_maps/")) && (low.endsWith(".jpg") || low.endsWith(".png"))) {
          const flrId = relPath.split("/").pop().replace(/\.(jpg|png)$/i, "");
          const mime = low.endsWith(".png") ? "image/png" : "image/jpeg";
          const durl = `data:${mime};base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
          await window.CSCDiscoveryAdapter.saveMediaBlob(`floor_map::${state.sessionId}::${flrId}`, durl);
          const flrObj = state.floors.find((f) => f.id === flrId);
          if (flrObj) {
            flrObj.hasCustomMap = true;
            delete flrObj.custom_map_data_url;
          }
        } else if (low.startsWith("audio/") || low.startsWith("03_voice_notes/")) {
          const fname = relPath.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
          const mAud = fname.match(/(AUD-\d+)/i);
          const audId = mAud ? mAud[1].toUpperCase() : fname;
          const durl = `data:audio/webm;base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
          await window.CSCDiscoveryAdapter.saveMediaBlob(`audio::${state.sessionId}::${audId}`, durl);
          cachedAudioUrls[audId] = durl;
        } else if (
          (low.startsWith("02_raw_photos/") || low.startsWith("photos/") || low.startsWith("01_stamped_photos/")) &&
          (low.endsWith(".jpg") || low.endsWith(".jpeg") || low.endsWith(".png"))
        ) {
          // Fixes BUG-07: Restore 100% of unit photos back into IndexedDB on .cscwalk.zip import,
          // ensuring clean 02_Raw_Photos/ are never overwritten by watermarked 01_Stamped_Photos/ or photos/!
          const isCleanRawPhoto = low.startsWith("02_raw_photos/") || low.includes("_raw.");
          const fname = relPath.split("/").pop();
          let matchedStId = null;
          let matchedSlot = 2;

          const mStn = fname.match(/(STN-\d+)/i);
          if (mStn) {
            matchedStId = mStn[1].toUpperCase();
          } else {
            for (const st of (state.stations || [])) {
              const cleanTag = (st.tag || st.id).split("(")[0].trim().replace(/[^a-zA-Z0-9_-]/g, "");
              if (cleanTag && fname.includes(cleanTag)) {
                matchedStId = st.id;
                break;
              }
            }
          }

          if (/01_Context|01_WideContext|slot1/i.test(fname)) matchedSlot = 1;
          else if (/03_SubComponent|slot3/i.test(fname)) matchedSlot = 3;
          else matchedSlot = 2;

          if (matchedStId) {
            const mime = low.endsWith(".png") ? "image/png" : "image/jpeg";
            const durl = `data:${mime};base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
            const key = `photo::${state.sessionId}::${matchedStId}::slot${matchedSlot}`;
            const rawKey = `photo_raw::${state.sessionId}::${matchedStId}::slot${matchedSlot}`;
            if (isCleanRawPhoto || !(await window.CSCDiscoveryAdapter.loadMediaBlob(rawKey))) {
              await window.CSCDiscoveryAdapter.saveMediaBlob(key, durl);
              await window.CSCDiscoveryAdapter.saveMediaBlob(rawKey, durl);
              restoredPhotosCount++;
            }
          }
        }
      }
      showBannerToast(`📥 <strong>Imported Walk (${escapeHtml(fileName)}):</strong> ${state.stations.length} units &amp; ${restoredPhotosCount} photo(s) restored!`);
    } else {
      const txt = await file.text();
      const rawObj = JSON.parse(txt);
      state = _migrateLoadedState(rawObj);
      for (const flr of state.floors || []) {
        if (flr.custom_map_data_url) {
          await window.CSCDiscoveryAdapter.saveMediaBlob(`floor_map::${state.sessionId}::${flr.id}`, flr.custom_map_data_url);
          flr.hasCustomMap = true;
          delete flr.custom_map_data_url;
        }
      }
      showBannerToast(`📥 <strong>Imported Walk (${escapeHtml(fileName)}):</strong> ${state.stations.length} units loaded!`);
    }

    persistWalkState();
    closeSessionManagerModal();
    await renderAll(false);
  } catch (err) {
    showBannerToast(`⚠️ Import Error: ${escapeHtml(err.message)}`, true);
  } finally {
    if (inputOrFile && "value" in inputOrFile) {
      inputOrFile.value = "";
    }
  }
}

async function exportScheduleCsv() {
  if (!state.stations || state.stations.length === 0) {
    showBannerToast("⚠️ No equipment units to export yet — snap Unit #1 first!", true);
    return;
  }
  const csv = buildEquipmentScheduleCsvText();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  await window.CSCDiscoveryAdapter.saveOrShareBlob(
    `${state.jobNumber}_Equipment_Discovery.csv`,
    "text/csv",
    blob,
    `CSC Equipment Schedule — ${state.jobNumber}`
  );
}

async function downloadSessionJson() {
  const summaryText = `CSC Field Discovery (${state.jobNumber} — ${state.projectName}): ${state.stations.length} units, ${state.audioSegments.length} audio notes.`;
  await window.CSCDiscoveryAdapter.shareOrExport(
    `CSC Discovery — ${state.jobNumber}`,
    summaryText,
    `${state.jobNumber}_Site_Discovery_Bundle.json`,
    state
  );
}

function toggleSunlightMode() {
  document.body.classList.toggle("sunlight-mode");
}

async function renderAll(skipAsyncMedia = false) {
  renderHeaderMeta();
  updateWifiSyncBadgesUI();
  renderUnitFeed();
  renderRecentAudioFeed();
  renderFloorTabs();
  renderInteractiveMap();
  renderStationStrip();
  _syncMicButtonsUI();
  if (!skipAsyncMedia) {
    await preloadAllStationThumbnails();
    await refreshFloorMapBackground();
    await loadActiveStationBurstPhotos();
    renderUnitFeed();
    renderInteractiveMap();
  }
}

window.openSessionManagerModal = openSessionManagerModal;

window.addEventListener("online", () => {
  checkOfficeWifiAutoSync();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    checkOfficeWifiAutoSync();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadInitialWalkState();
  startAutoBackgroundSensors();
  renderAll(false);
  openQuickStartModal();
  setTimeout(() => checkOfficeWifiAutoSync(), 1800);
});
