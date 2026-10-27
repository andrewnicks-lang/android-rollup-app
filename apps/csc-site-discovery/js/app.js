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

function persistWalkState() {
  if (!state) return;
  window.CSCDiscoveryAdapter.writeState("active_walk_v1", state);
}

function _migrateLoadedState(s) {
  if (!s.uiMode) {
    s.uiMode = window.innerWidth <= 1024 ? "quick" : "quick";
  }
  if (s.verbalConsentLogged === undefined) s.verbalConsentLogged = false;
  if (s.cloudSpeechOptIn === undefined) s.cloudSpeechOptIn = false;
  if (!Array.isArray(s.pdrSteps)) s.pdrSteps = [];
  if (!Array.isArray(s.videoKeyframes)) s.videoKeyframes = [];
  s.videoKeyframes.forEach((k) => {
    if (!k.floorId) k.floorId = "FLR-02";
  });
  (s.stations || []).forEach((st) => {
    if (!st.thermistorCurve) st.thermistorCurve = "10k_TYPE_II";
    if (!st.ioTally) st.ioTally = { ui: 4, bi: 2, bo: 2, ao: 2 };
    if (st.parentPanel === undefined) st.parentPanel = "";
    if (st.servedBy === undefined) st.servedBy = "";
    if (st.mstpMac === undefined) st.mstpMac = "";
    if (!st.checks) st.checks = {};
    if (!st.burstMeta) st.burstMeta = {};
  });
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
    if (yy >= 10 && yy <= 26 && ww >= 1 && ww <= 53) {
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
      year = midDigits <= 26 ? 2000 + midDigits : 1900 + midDigits;
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
    year = yy <= 26 ? 2000 + yy : 1900 + yy;
    period = `Month ${mMcquay[2]}`;
    rule = "Daikin/McQuay FBOU-YYMM";
  }

  const m4Dig = s.match(/^(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("CARRIER") || m.includes("BRYANT") || m.includes("LOCHINVAR") || m.includes("YORK") || m.includes("DAIKIN")) && m4Dig) {
    const d1 = parseInt(m4Dig[1], 10);
    const d2 = parseInt(m4Dig[2], 10);
    if (d1 > 26 && d1 <= 52 && d2 >= 0 && d2 <= 26) {
      year = 2000 + d2;
      period = `Week ${d1}`;
      rule = "WWYY 4-Digit Prefix";
    } else if (d1 >= 0 && d1 <= 26 && d2 >= 1 && d2 <= 52) {
      year = 2000 + d1;
      period = `Week ${d2}`;
      rule = "YYWW 4-Digit Prefix";
    }
  }

  const mAbb = s.match(/^\d(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("ABB") || m.includes("YASKAWA")) && mAbb) {
    const yy = parseInt(mAbb[1], 10);
    const ww = parseInt(mAbb[2], 10);
    if (yy >= 5 && yy <= 26 && ww >= 1 && ww <= 53) {
      year = 2000 + yy;
      period = `Week ${ww}`;
      rule = "ABB Country-YY-WW Serial";
    }
  }

  const mHyph = s.match(/[A-Z]+-?(\d{2})-\d+/);
  if (!year && mHyph) {
    const yy = parseInt(mHyph[1], 10);
    year = yy <= 26 ? 2000 + yy : 1900 + yy;
    rule = "Prefix-YY-Sequence";
  }

  // ASHRAE Ch. 38 Median Service Life by Archetype
  let lifeLimit = ASHRAE_CH38_SERVICE_LIFE[archetypeId] || 18;
  if (archetypeId === "RTU_AHU" && /(YSC|YCD|TCD|WSC|48TC|50TC|RN-)/.test(mdl)) {
    lifeLimit = ASHRAE_CH38_SERVICE_LIFE.PACKAGED_RTU; // 15 yrs for rooftop DX
  } else if (/(TITUS|NAILOR|PRICE|VAV)/.test(m)) {
    lifeLimit = ASHRAE_CH38_SERVICE_LIFE.VAV_TERMINAL; // 28 yrs for VAV box
  }

  const age = year ? (2026 - year) : null;
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
// PHOTO-ONLY FIRST -> "TAG & GO" 1-SCREEN CAPTURE FLOW
// ============================================================================
async function startSnapNewUnitWizard() {
  const prevSt = state.stations[state.stations.length - 1] || getActiveStation();
  const newNum = state.stations.length + 1;
  const padNum = String(newNum).padStart(2, "0");
  const newId = `STN-${padNum}`;
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
}

async function saveAndSnapNextUnit() {
  closeTagAndGoSheet();
  await startSnapNewUnitWizard();
}

function setUnitCondition(condVal) {
  const st = getActiveStation();
  st.condition = condVal;
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
  renderInteractiveMap();
}

function toggleQuickIssueTile(issueId) {
  const st = getActiveStation();
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
// CLEAN VISUAL UNIT FEED RENDERER (VIEW 1)
// ============================================================================
async function preloadAllStationThumbnails() {
  allStationThumbs = {};
  for (const st of state.stations) {
    const p2 = await window.CSCDiscoveryAdapter.loadMediaBlob(`photo::${state.sessionId}::${st.id}::slot2`);
    const p1 = p2 ? null : await window.CSCDiscoveryAdapter.loadMediaBlob(`photo::${state.sessionId}::${st.id}::slot1`);
    if (p2 || p1) allStationThumbs[st.id] = p2 || p1;
  }
}

function renderUnitFeed() {
  const countEl = document.getElementById("stationSummaryCount");
  if (countEl) countEl.textContent = String(state.stations.length);

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
        <div style="font-size:12px;">Tap <strong>📸 + SNAP NEW UNIT</strong> below to snap your first nameplate photo!</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;">
          <button class="btn" onclick="startSnapNewUnitWizard()">📸 + Snap First Unit</button>
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
    const thumb = allStationThumbs[st.id] || (st.id === state.activeStationId ? (cachedSlotPhotos[2] || cachedSlotPhotos[1]) : null);

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

function renderRecentAudioFeed() {
  const countEl = document.getElementById("audioCountBadge");
  if (countEl) countEl.textContent = String((state.audioSegments || []).length);
  const consentEl = document.getElementById("audioConsentCheck");
  if (consentEl) consentEl.checked = Boolean(state.verbalConsentLogged);

  const listEl = document.getElementById("recentAudioFeedList");
  if (!listEl) return;
  const segs = (state.audioSegments || []).slice(0, 4);
  if (segs.length === 0) {
    listEl.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);">Hold <strong>🎙️ Hold to Talk</strong> anytime to record a voice note &amp; auto-tag location.</div>`;
    return;
  }
  listEl.innerHTML = segs.map((seg) => `
    <div class="audio-item-row">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
        <strong>${escapeHtml(seg.stationId)} • ${escapeHtml(seg.speaker || 'Field Tech')}</strong>
        <span>${escapeHtml(seg.time)}</span>
      </div>
      <div style="margin-top:2px;">"${escapeHtml(seg.text)}"</div>
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
  const newNum = state.stations.length + 1;
  const newId = `STN-${String(newNum).padStart(2, "0")}`;
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

function deleteUnitById(stationId, fromSheet = false) {
  const target = state.stations.find((s) => s.id === stationId) || getActiveStation();
  if (!target) return;
  const label = target.tag || target.id;
  state.stations = state.stations.filter((x) => x.id !== target.id);
  delete allStationThumbs[target.id];
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
  st.archetype = newArchId;
  const arch = ARCHETYPES.find((a) => a.id === newArchId);
  if (arch) st.alcTarget = arch.default_alc;
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
}

function setChecklistOptionIndex(itemId, optIdx) {
  const st = getActiveStation();
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const item = arch.items.find((i) => i.id === itemId);
  if (!item || item.opts[optIdx] === undefined) return;
  if (!st.checks) st.checks = {};
  st.checks[itemId] = item.opts[optIdx];
  persistWalkState();
  renderUnitFeed();
  renderInteractiveMap();
}

function _recommendAlcFromIoJS(st) {
  const io = (st && st.ioTally) || { ui: 0, bi: 0, bo: 0, ao: 0 };
  const totalIn = (io.ui || 0) + (io.bi || 0);
  if (st && st.archetype === "VAV_TERMINAL" && totalIn <= 5 && (io.bo || 0) <= 3 && (io.ao || 0) <= 2) {
    return { model: "ALC ZN341v Integrated VAV Controller", opti: 0, zn: 1, xpio: 0, totalPoints: totalIn + (io.bo || 0) + (io.ao || 0) };
  }
  if (totalIn <= 5 && (io.bo || 0) <= 5 && (io.ao || 0) <= 3) {
    return { model: "ALC ZN551 Equipment Controller", opti: 0, zn: 1, xpio: 0, totalPoints: totalIn + (io.bo || 0) + (io.ao || 0) };
  }
  if (totalIn <= 12 && (io.bo || 0) <= 8 && (io.ao || 0) <= 4) {
    return { model: "ALC OptiFlex OF1628 Plant/AHU Controller", opti: 1, zn: 0, xpio: 0, totalPoints: totalIn + (io.bo || 0) + (io.ao || 0) };
  }
  const extraIn = Math.max(0, totalIn - 12);
  const extraOut = Math.max(0, (io.bo || 0) - 8) + Math.max(0, (io.ao || 0) - 4);
  const xpio = Math.max(1, Math.ceil(Math.max(extraIn / 8, extraOut / 8)));
  return { model: `ALC OptiFlex OF1628 + (${xpio}) FIO-812 / XPIO Expander(s)`, opti: 1, zn: 0, xpio, totalPoints: totalIn + (io.bo || 0) + (io.ao || 0) };
}

// ============================================================================
// CAMERA CAPTURE, 8x8 CLAHE, BINARY EXIF & AUTO-OCR
// ============================================================================
async function loadActiveStationBurstPhotos() {
  const st = getActiveStation();
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  if (!st) return;
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  for (const slot of [1, 2, 3]) {
    const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
    const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;
    cachedSlotPhotos[slot] = await window.CSCDiscoveryAdapter.loadMediaBlob(key);
    cachedRawSlotPhotos[slot] = await window.CSCDiscoveryAdapter.loadMediaBlob(rawKey);
  }
  if (cachedSlotPhotos[2] || cachedSlotPhotos[1]) {
    allStationThumbs[st.id] = cachedSlotPhotos[2] || cachedSlotPhotos[1];
  }
}

function _buildSortedFilename(st, slot) {
  const slotLabels = { 1: "01_Context", 2: "02_Nameplate", 3: "03_SubComponent" };
  const cleanTag = (st.tag || st.id).split("(")[0].trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return `${state.jobNumber}_${st.floorId}_${cleanTag}_${slotLabels[slot]}.jpg`;
}

async function captureStationBurstSlot(slot, autoRunOcr = true) {
  const st = getActiveStation();
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
  allStationThumbs[st.id] = cachedSlotPhotos[2] || cachedSlotPhotos[1];

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

  if (!st.burstMeta) st.burstMeta = {};
  st.burstMeta[slot] = {
    filename: _buildSortedFilename(st, slot),
    capturedAt: (img.exif && img.exif.dateTimeOriginal) || img.capturedAt,
    claheEnhanced: false,
    sizeKB: img.sizeKB,
    exifGps: img.exif && img.exif.gpsLat ? `${img.exif.gpsLat}, ${img.exif.gpsLon}` : null
  };

  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
  renderInteractiveMap();

  if (slot === 2 && autoRunOcr) {
    runLiveVisionOcrOnSlot2(true);
  }
}

async function toggleClaheOnSlot(slot) {
  const st = getActiveStation();
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
  allStationThumbs[st.id] = cachedSlotPhotos[2] || cachedSlotPhotos[1];
  persistWalkState();
  renderTagAndGoSheet(st);
  renderUnitFeed();
}

function openPhotoZoomModal(slot) {
  const src = cachedSlotPhotos[slot];
  if (!src) return;
  const st = getActiveStation();
  const modal = document.getElementById("photoZoomModal");
  document.getElementById("zoomModalTitle").textContent = `${st.tag || st.id} — Field Photo`;
  document.getElementById("zoomModalImg").src = src;
  modal.style.display = "flex";
}

async function runLiveVisionOcrOnSlot2(silentIfNoKey = false) {
  const st = getActiveStation();
  const imgDataUrl = cachedSlotPhotos[2] || cachedSlotPhotos[1];
  if (!imgDataUrl) return;

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
    const base64Data = imgDataUrl.split(",")[1];
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
// HOLD-TO-TALK 150HZ FILTERED VOICE RECORDER + AUTO LOCATION PARSER
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
          const st = getActiveStation();
          const segId = `AUD-${String(state.audioSegments.length + 1).padStart(2, "0")}`;
          await window.CSCDiscoveryAdapter.saveMediaBlob(`audio::${state.sessionId}::${segId}`, dataUrl);
          cachedAudioUrls[segId] = dataUrl;

          const tgNoteEl = document.getElementById("tgQuickNoteInput");
          const spoken = liveSpeechBuffer.trim() || (tgNoteEl ? tgNoteEl.value.trim() : "");
          const finalTranscript = spoken || `Voice clip (${Math.round(blob.size / 1024)} KB) saved for ${st.tag}`;

          if (spoken) {
            onTagGoNoteInput(spoken);
          }

          const rfiHits = extractRfiTriggersJS(finalTranscript);
          const locParsed = parseLocationFromVoiceJS(finalTranscript);
          const locMsg = locParsed && locParsed.locationLabel ? `📍 Auto-Located: ${locParsed.locationLabel}` : "";
          const insightText = [locMsg, ...rfiHits].filter(Boolean).join(" | ") || `Saved to ${st.tag}`;

          state.audioSegments.unshift({
            id: segId,
            time: new Date().toTimeString().slice(0, 8),
            speaker: window.CSCDiscoveryAdapter.getActiveUser().name,
            stationId: st.id,
            bookmarked: true,
            hasAudioBlob: true,
            text: finalTranscript,
            insight: insightText
          });
          liveSpeechBuffer = "";
          persistWalkState();
          renderTagAndGoSheet(st);
          renderUnitFeed();
          renderRecentAudioFeed();
          renderInteractiveMap();
          showBannerToast(`🎙️ <strong>Voice Note Saved:</strong> ${escapeHtml(insightText)}`);
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
// SESSION MANAGER, .CSCWALK.ZIP PACKAGER/UNPACKER & EXPORT BRIDGE
// ============================================================================
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
  persistWalkState();
  renderHeaderMeta();
  closeSessionManagerModal();
  showBannerToast("💾 <strong>Job Info &amp; Settings Saved!</strong>");
}

function startBlankSiteWalk(zeroUnits = true) {
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
    schemaVersion: "CSC-DISCOVERY-v3.1",
    sessionId: sid,
    projectName: proj,
    jobNumber: job,
    siteContact: contact,
    siteAddress: addr,
    verbalConsentLogged: true,
    cloudSpeechOptIn: true,
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
  renderAll(true);
  showBannerToast(`🆕 <strong>Started Fresh Walk (0 Units):</strong> Tap <strong>📸 + SNAP NEW UNIT</strong> to capture Unit #1!`);
}

function resetToGoldenDemoWalk() {
  pdrSteps = [];
  walkStepCounter = 0;
  stepCounterAtLastSnap = 0;
  allStationThumbs = {};
  state = _migrateLoadedState(JSON.parse(JSON.stringify(GOLDEN_DEMO_STATE)));
  persistWalkState();
  closeSessionManagerModal();
  renderAll(false);
  showBannerToast("🧪 <strong>Loaded Lee's Summit West Demo Walk!</strong>");
}

async function exportFullWalkZipBundle() {
  const enc = new TextEncoder();
  const entries = [];
  const manifestCopy = JSON.parse(JSON.stringify(state));
  (manifestCopy.floors || []).forEach((f) => { delete f.custom_map_data_url; });

  entries.push({
    name: "manifest.json",
    data: enc.encode(JSON.stringify(manifestCopy, null, 2))
  });

  const mediaRecords = await window.CSCDiscoveryAdapter.listSessionMediaEntries(state.sessionId);
  for (const rec of mediaRecords) {
    if (!rec.payload || typeof rec.payload !== "string") continue;
    const mk = rec.mediaKey;
    if (mk.startsWith(`floor_map::${state.sessionId}::`)) {
      const flrId = mk.split("::")[2];
      const ext = rec.payload.includes("image/png") ? "png" : "jpg";
      entries.push({ name: `maps/${flrId}.${ext}`, data: window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload) });
    } else if (mk.startsWith(`photo::${state.sessionId}::`)) {
      const parts = mk.split("::");
      const stId = parts[2];
      const slotNum = parseInt((parts[3] || "slot2").replace("slot", ""), 10) || 2;
      const stObj = state.stations.find((s) => s.id === stId);
      const fname = stObj ? _buildSortedFilename(stObj, slotNum) : `${stId}_slot${slotNum}.jpg`;
      entries.push({ name: `photos/${fname}`, data: window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload) });
    } else if (mk.startsWith(`videokf::${state.sessionId}::`)) {
      const kfId = mk.split("::")[2];
      entries.push({ name: `keyframes/${kfId}.jpg`, data: window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload) });
    } else if (mk.startsWith(`audio::${state.sessionId}::`)) {
      const audId = mk.split("::")[2];
      const ext = rec.payload.includes("audio/mp4") ? "m4a" : "webm";
      entries.push({ name: `audio/${audId}.${ext}`, data: window.CSCDiscoveryAdapter.dataUrlToUint8Array(rec.payload) });
    }
  }

  const zipBlob = window.CSCDiscoveryAdapter.buildCscWalkZipBlob(entries);
  const outName = `${state.jobNumber}_Site_Discovery.cscwalk.zip`;
  await window.CSCDiscoveryAdapter.saveOrShareBlob(
    outName,
    "application/zip",
    zipBlob,
    `CSC Site Discovery Bundle — ${state.jobNumber}`
  );
  showBannerToast(`📦 <strong>Exported <code>${escapeHtml(outName)}</code> (${entries.length} files)!</strong>`);
}

async function importWalkBundleFile(inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  try {
    if (file.name.toLowerCase().endsWith(".zip")) {
      const ab = await file.arrayBuffer();
      const parsed = await window.CSCDiscoveryAdapter.parseCscWalkZipBuffer(ab);
      if (!parsed.manifest) throw new Error("No manifest.json inside .zip");
      state = _migrateLoadedState(parsed.manifest);

      for (const [relPath, bytes] of Object.entries(parsed.files)) {
        const low = relPath.toLowerCase();
        if (low.startsWith("maps/") && (low.endsWith(".jpg") || low.endsWith(".png"))) {
          const flrId = relPath.split("/").pop().replace(/\.(jpg|png)$/i, "");
          const mime = low.endsWith(".png") ? "image/png" : "image/jpeg";
          const durl = `data:${mime};base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
          await window.CSCDiscoveryAdapter.saveMediaBlob(`floor_map::${state.sessionId}::${flrId}`, durl);
          const flrObj = state.floors.find((f) => f.id === flrId);
          if (flrObj) flrObj.hasCustomMap = true;
        } else if (low.startsWith("audio/")) {
          const audId = relPath.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
          const durl = `data:audio/webm;base64,${window.CSCDiscoveryAdapter.uint8ArrayToBase64(bytes)}`;
          await window.CSCDiscoveryAdapter.saveMediaBlob(`audio::${state.sessionId}::${audId}`, durl);
        }
      }
    } else {
      const txt = await file.text();
      const rawObj = JSON.parse(txt);
      state = _migrateLoadedState(rawObj);
      for (const flr of state.floors || []) {
        if (flr.custom_map_data_url) {
          await window.CSCDiscoveryAdapter.saveMediaBlob(`floor_map::${state.sessionId}::${flr.id}`, flr.custom_map_data_url);
          flr.hasCustomMap = true;
        }
      }
    }

    persistWalkState();
    closeSessionManagerModal();
    await renderAll(false);
    showBannerToast(`📥 <strong>Imported Walk (${escapeHtml(file.name)}):</strong> ${state.stations.length} units loaded!`);
  } catch (err) {
    showBannerToast(`⚠️ Import Error: ${escapeHtml(err.message)}`, true);
  } finally {
    inputEl.value = "";
  }
}

async function exportScheduleCsv() {
  if (!state.stations || state.stations.length === 0) {
    showBannerToast("⚠️ No equipment units to export yet — snap Unit #1 first!", true);
    return;
  }
  const rows = state.stations.map((st, idx) => {
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
      FieldNotes: st.tierDelta
    };
  });

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\n");
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

window.addEventListener("DOMContentLoaded", () => {
  loadInitialWalkState();
  startAutoBackgroundSensors();
  renderAll(false);
  openQuickStartModal();
});
