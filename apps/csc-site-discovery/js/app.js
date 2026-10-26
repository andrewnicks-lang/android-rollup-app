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

  const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);
  const qtyDiff = (Number(st.observedQty) || 0) - (Number(st.scheduledQty) || 0);

  if (redCount > 0 || mdl.a2lFlag) return { cls: "status-red", color: "#ef4444", verifiedCount, total: arch.items.length, redCount };
  if (amberCount > 0 || dec.eol || qtyDiff !== 0 || (st.ocrConf && st.ocrConf < 0.85)) {
    return { cls: "status-amber", color: "#f59e0b", verifiedCount, total: arch.items.length, redCount };
  }
  if (verifiedCount > 0) return { cls: "status-green", color: "#10b981", verifiedCount, total: arch.items.length, redCount };
  return { cls: "status-unvisited", color: "#64748b", verifiedCount: 0, total: arch.items.length, redCount: 0 };
}

function showBannerToast(htmlMsg, isWarn = false) {
  const toast = document.getElementById("barometerToast");
  if (!toast) return;
  toast.className = isWarn ? "amber-callout" : "status-callout";
  toast.style.display = "block";
  toast.innerHTML = htmlMsg;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 5500);
}

// ============================================================================
// PHASE 1: QUICK WALK (<15s) MODE SWITCHER & CLONE +1 STATION DUPLICATOR
// ============================================================================
function setUiMode(mode) {
  state.uiMode = mode === "deep" ? "deep" : "quick";
  persistWalkState();
  const qwView = document.getElementById("quickWalkView");
  const deepView = document.getElementById("deepInspectorView");
  document.getElementById("modeQuickBtn").classList.toggle("active", state.uiMode === "quick");
  document.getElementById("modeDeepBtn").classList.toggle("active", state.uiMode === "deep");
  qwView.style.display = state.uiMode === "quick" ? "block" : "none";
  deepView.style.display = state.uiMode === "deep" ? "block" : "none";
  renderActiveTabContent();
}

function _autoIncrementEquipmentTag(tagStr) {
  const raw = (tagStr || "EQ-01").trim();
  // Match prefix + trailing digits before any parenthetical note, e.g. "VAV-204 (Science)" -> "VAV-205 (Science)"
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
  const newNum = state.stations.length + 1;
  const newId = `STN-${String(newNum).padStart(2, "0")}`;
  const nextTag = _autoIncrementEquipmentTag(src.tag);

  // Copy baseline clean checks while clearing station-specific serial/photos
  const arch = ARCHETYPES.find((a) => a.id === src.archetype) || ARCHETYPES[0];
  const clonedChecks = {};
  for (const item of arch.items) {
    const prev = src.checks && src.checks[item.id];
    // Carry over non-defect architectural choices (e.g., HW Reheat, Rnet) while leaving defects clean/ready
    if (prev && !(item.redFlags || []).includes(prev)) {
      clonedChecks[item.id] = prev;
    }
  }

  const cloned = {
    id: newId,
    tag: nextTag,
    archetype: src.archetype,
    floorId: src.floorId,
    room: src.room,
    xPct: Number(Math.min(95, (src.xPct || 50) + 3.5).toFixed(1)),
    yPct: Number(Math.min(92, (src.yPct || 50) + 2.5).toFixed(1)),
    gpsLat: currentGps ? currentGps.lat : null,
    gpsLon: currentGps ? currentGps.lon : null,
    gpsAcc: currentGps ? currentGps.acc : null,
    compassDeg: currentCompassDeg !== null ? currentCompassDeg : null,
    anchorType: liveSensorsActive && currentGps ? "OUTDOOR_GNSS_AND_COMPASS" : "CLONED_MAP_PIN",
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
    checks: clonedChecks
  };

  state.stations.push(cloned);
  state.activeStationId = newId;
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  persistWalkState();
  renderAll(true);
  showBannerToast(`📋 <strong>Cloned &rarr; ${escapeHtml(nextTag)} (${newId}):</strong> Mfg, Model, ALC strategy &amp; sensor curve carried forward — snap plate or drag pin!`);
}

// ============================================================================
// 1. REAL ANDROID GNSS GEOLOCATION & MAGNETOMETER COMPASS SENSORS
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
    const hEl = document.getElementById("pdrHeadingEl");
    if (hEl) hEl.textContent = `${heading}° ${degToCardinal(heading)}`;
  }
}

function toggleLiveSensors() {
  const btn = document.getElementById("sensorLockBtn");
  liveSensorsActive = !liveSensorsActive;

  if (liveSensorsActive) {
    btn.className = "btn btn-amber";
    btn.innerHTML = "📡 Live ON";
    if ("geolocation" in navigator) {
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
        (err) => {
          showBannerToast(`⚠️ Android GPS Notice: ${escapeHtml(err.message)} (Indoor Floor-Pin Fallback Active)`, true);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }
    window.addEventListener("deviceorientationabsolute", _handleOrientation, true);
    window.addEventListener("deviceorientation", _handleOrientation, true);
    updateSensorBadgeUI();
    showBannerToast("📡 <strong>Live Android GNSS + Compass Active:</strong> Rooftop pins &amp; Step-PDR automatically stamp GPS &amp; bearing!");
  } else {
    btn.className = "btn btn-secondary";
    btn.innerHTML = "📡 GPS/Compass";
    if (geoWatchId !== null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(geoWatchId);
      geoWatchId = null;
    }
    if (!livePdrActive) {
      window.removeEventListener("deviceorientationabsolute", _handleOrientation, true);
      window.removeEventListener("deviceorientation", _handleOrientation, true);
    }
    updateSensorBadgeUI();
  }
}

function updateSensorBadgeUI() {
  const el = document.getElementById("liveSensorReadout");
  if (!el) return;
  if (!liveSensorsActive) {
    el.textContent = "Indoor Pin Mode";
    return;
  }
  const gpsPart = currentGps ? `${currentGps.lat}, ${currentGps.lon} (±${currentGps.acc}m)` : "Acquiring GNSS...";
  const compPart = currentCompassDeg !== null ? ` | 🧭 ${currentCompassDeg}° ${degToCardinal(currentCompassDeg)}` : "";
  el.textContent = gpsPart + compPart;
}

// ============================================================================
// 2. PINCH-ZOOM / PAN / DRAG-PIN SPATIAL MAPPER + CUSTOM FLOOR IMAGE LOADER
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
    flr.source = `${useRearCamera ? 'Snapped Evac Map' : 'Imported Floor Plan'} (${img.width}x${img.height})`;
  }
  cachedFloorMapDataUrl = img.dataUrl;
  resetMapZoom();
  persistWalkState();
  renderFloorTabs();
  renderInteractiveMap();
  showBannerToast("🗺️ <strong>Floor Map Loaded (Aspect Ratio Preserved):</strong> Pinch/zoom or tap anywhere to pin stations!");
}

async function clearCustomFloorMap() {
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  await window.CSCDiscoveryAdapter.deleteMediaBlob(key);
  const flr = state.floors.find((f) => f.id === state.activeFloorId);
  if (flr) {
    flr.hasCustomMap = false;
    delete flr.custom_map_data_url;
    flr.source = "Schematic Vector Floor Grid";
  }
  cachedFloorMapDataUrl = null;
  resetMapZoom();
  persistWalkState();
  renderFloorTabs();
  renderInteractiveMap();
}

function addCustomFloor() {
  const name = prompt("New Floor / Roof / Area Name (e.g., Floor 3 Lab Wing or Penthouse):", `Floor ${state.floors.length}`);
  if (!name) return;
  const idx = state.floors.length + 1;
  const id = `FLR-C${idx}`;
  const topElev = state.floors.reduce((mx, f) => Math.max(mx, Number(f.elev) || 0), 0) + 14.0;
  state.floors.push({
    id,
    name: name.trim(),
    elev: topElev,
    hpa: Number((989.35 - (topElev / 14.0) * 0.49).toFixed(2)),
    source: "Custom Added Floor — Tap Snap/Load Map",
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
  const newH = newW * 0.38;
  let newX = cx - ((cx - mapViewBox.x) / mapViewBox.w) * newW;
  let newY = cy - ((cy - mapViewBox.y) / mapViewBox.h) * newH;
  newX = Math.max(0, Math.min(1000 - newW, newX));
  newY = Math.max(0, Math.min(380 - newH, newY));
  mapViewBox = { x: newX, y: newY, w: newW, h: newH };
  _applyMapViewBox();
}

function resetMapZoom() {
  mapViewBox = { x: 0, y: 0, w: 1000, h: 380 };
  _applyMapViewBox();
}

function toggleMapInteractionMode() {
  mapInteractionMode = mapInteractionMode === "pin" ? "pan" : "pin";
  const btn = document.getElementById("mapModeToggleBtn");
  const svg = document.getElementById("floorMapSvg");
  if (btn) {
    btn.classList.toggle("active", mapInteractionMode === "pan");
    btn.innerHTML = mapInteractionMode === "pan" ? "✋ Pan" : "📍 Pin";
  }
  if (svg) svg.classList.toggle("pan-mode", mapInteractionMode === "pan");
}

function _clientToSvgCoords(clientX, clientY) {
  const svg = document.getElementById("floorMapSvg");
  const rect = svg.getBoundingClientRect();
  const svgX = mapViewBox.x + ((clientX - rect.left) / Math.max(1, rect.width)) * mapViewBox.w;
  const svgY = mapViewBox.y + ((clientY - rect.top) / Math.max(1, rect.height)) * mapViewBox.h;
  const xPct = Math.max(1.5, Math.min(97.5, (svgX - 20) / 9.6));
  const yPct = Math.max(2.5, Math.min(96.0, (svgY - 15) / 3.4));
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
    const activeSt = getActiveStation();
    if (activeSt && activeSt.floorId === state.activeFloorId) {
      const sx = activeSt.xPct * 9.6 + 20;
      const sy = activeSt.yPct * 3.4 + 15;
      if (Math.hypot(pt.svgX - sx, pt.svgY - sy) <= 22) {
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
        mapViewBox.y = Math.max(0, Math.min(380 - mapViewBox.h, panStartClient.vbY - dy * scaleY));
        _applyMapViewBox();
      }
    }
  });

  const endPtr = (ev) => {
    activePointers.delete(ev.pointerId);
    if (isDraggingActivePin) {
      isDraggingActivePin = false;
      persistWalkState();
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

function renderHeaderMeta() {
  const u = window.CSCDiscoveryAdapter.getActiveUser();
  document.getElementById("jobHeaderSub").textContent =
    `Job: ${state.jobNumber} — ${state.projectName} | ${u.name} (${u.container.replace(/_/g, " ")})`;

  const govEl = document.getElementById("governanceSubBadge");
  if (govEl) {
    const audioMode = state.cloudSpeechOptIn ? "Cloud Draft Opt-In" : "100% Local Audio (.webm)";
    const consentTag = state.verbalConsentLogged ? "Consent Logged ✅" : "Consent Unchecked";
    govEl.textContent = `🛡️ POL-IT-AI-001: ${audioMode} | ${consentTag}`;
  }

  const rfi11Btn = document.getElementById("rfi11ToggleBtn");
  if (rfi11Btn) {
    rfi11Btn.className = state.rfi23011TempConditioningFlag ? "btn btn-danger" : "btn btn-secondary";
    rfi11Btn.innerHTML = state.rfi23011TempConditioningFlag
      ? "🚨 RFI-23-011 HARD-STOP"
      : "🛡️ Flag Temp HVAC (RFI-23-011)";
  }
}

function toggleRfi23011HardStop() {
  state.rfi23011TempConditioningFlag = !state.rfi23011TempConditioningFlag;
  persistWalkState();
  renderHeaderMeta();
  if (state.rfi23011TempConditioningFlag) {
    showBannerToast(
      "🚨 <strong>CRITICAL RFI-23-011 (1B-6A) HARD-STOP LOGGED:</strong> Do NOT energize AHUs/RTUs during drywall sanding or finishes without signed Pre-Commissioning HVAC Operation RFI-23-011!",
      true
    );
  }
}

function renderFloorTabs() {
  const container = document.getElementById("floorTabs");
  container.innerHTML = state.floors.map((f) => `
    <button class="tab-btn ${f.id === state.activeFloorId ? 'active' : ''}" onclick="selectFloor('${f.id}')">
      ${f.hasCustomMap ? '🖼️ ' : ''}${escapeHtml(f.name)} <small>(${f.elev >= 0 ? '+' : ''}${f.elev}ft)</small>
    </button>
  `).join("");
}

function selectFloor(floorId) {
  state.activeFloorId = floorId;
  const flr = state.floors.find((f) => f.id === floorId);
  if (flr) {
    state.barometricHpa = flr.hpa;
    state.elevationFt = flr.elev;
  }
  const firstOnFloor = state.stations.find((s) => s.floorId === floorId);
  if (firstOnFloor) state.activeStationId = firstOnFloor.id;
  resetMapZoom();
  persistWalkState();
  refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
}

function simulateStairClimb(deltaFloors) {
  const idx = state.floors.findIndex((f) => f.id === state.activeFloorId);
  const nextIdx = Math.max(0, Math.min(state.floors.length - 1, idx + deltaFloors));
  const nextFlr = state.floors[nextIdx];
  selectFloor(nextFlr.id);
  showBannerToast(
    `🧭 <strong>Barometric Altimeter Step:</strong> Pressure <code>${nextFlr.hpa.toFixed(2)} hPa</code> (${nextFlr.elev >= 0 ? '+' : ''}${nextFlr.elev} ft) &rarr; Switched map to <strong>${escapeHtml(nextFlr.name)}</strong>!`,
    true
  );
}

function renderInteractiveMap() {
  _bindSvgGestures();
  const flr = state.floors.find((f) => f.id === state.activeFloorId) || state.floors[0];
  document.getElementById("mapSourceLabel").textContent = `${flr.name} | ${flr.source} | Tap to drop Pin or drag active Pin`;
  document.getElementById("baroReadout").textContent = `${state.barometricHpa.toFixed(2)} hPa (${state.elevationFt >= 0 ? '+' : ''}${state.elevationFt} ft)`;
  document.getElementById("clearMapBtn").style.display = cachedFloorMapDataUrl ? "inline-flex" : "none";

  const flrStations = state.stations.filter((s) => s.floorId === flr.id);
  const flrKeyframes = (state.videoKeyframes || []).filter((k) => (k.floorId || "FLR-02") === flr.id);
  const svg = document.getElementById("floorMapSvg");

  let overlayHtml = `<rect x="10" y="10" width="980" height="360" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2"/>`;

  // BUG-11 FIX: preserveAspectRatio="xMidYMid meet" prevents stretching/cropping perimeter rooms!
  if (cachedFloorMapDataUrl) {
    overlayHtml += `
      <image href="${cachedFloorMapDataUrl}" x="14" y="14" width="972" height="352" preserveAspectRatio="xMidYMid meet" opacity="0.92"/>
      <rect x="10" y="10" width="980" height="360" rx="8" fill="rgba(2,6,23,0.10)" stroke="#0d9488" stroke-width="2"/>
    `;
  } else {
    overlayHtml += `
      <line x1="250" y1="10" x2="250" y2="370" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <line x1="620" y1="10" x2="620" y2="370" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <rect x="100" y="100" width="800" height="55" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="28" y="36" fill="#94a3b8" font-size="13" font-weight="bold">WEST WING / STAIR B</text>
      <text x="340" y="36" fill="#94a3b8" font-size="13" font-weight="bold">CENTRAL CORRIDOR &amp; LABS / ZONES</text>
      <text x="645" y="36" fill="#94a3b8" font-size="13" font-weight="bold">EAST MECHANICAL / PLANT ROOM</text>
      <text x="375" y="132" fill="#64748b" font-size="12" font-weight="bold">MAIN CIRCULATION CORRIDOR / CEILING PLENUM TRUNK</text>
    `;
  }

  // Per-floor Step-PDR / Video Breadcrumb Trail (BUG-11 Fix: Works on ANY floor!)
  if (state.showVideoCrumb && flrKeyframes.length >= 1) {
    if (flrKeyframes.length >= 2) {
      const pts = flrKeyframes.map((k) => `${Math.round(k.xPct * 9.6 + 20)},${Math.round(k.yPct * 3.4 + 15)}`).join(" ");
      overlayHtml += `<polyline points="${pts}" fill="none" stroke="#14b8a6" stroke-width="3.5" stroke-dasharray="9,5"/>`;
    }
    flrKeyframes.forEach((k) => {
      const kx = Math.round(k.xPct * 9.6 + 20);
      const ky = Math.round(k.yPct * 3.4 + 15);
      overlayHtml += `
        <g onclick="event.stopPropagation(); setUiMode('deep'); switchTab('video');" style="cursor:pointer;">
          <circle cx="${kx}" cy="${ky}" r="6.5" fill="#0d9488" stroke="#ffffff" stroke-width="2"/>
          <text x="${kx - 28}" y="${ky - 11}" fill="#2dd4bf" font-size="10.5" font-weight="bold">🎥 ${escapeHtml(k.timeFmt)} ${escapeHtml((k.signOcr || '').slice(0, 14))}</text>
        </g>
      `;
    });
  }

  flrStations.forEach((st) => {
    const sx = Math.round(st.xPct * 9.6 + 20);
    const sy = Math.round(st.yPct * 3.4 + 15);
    const isSel = st.id === state.activeStationId;
    const stStatus = computeStationStatus(st);
    const hasCompass = typeof st.compassDeg === "number" || (st.anchorType || "").includes("COMPASS");

    if (hasCompass) {
      const deg = typeof st.compassDeg === "number" ? st.compassDeg : 270;
      const rad = ((deg - 90) * Math.PI) / 180;
      const len = 76;
      const spread = 0.36;
      const x1 = Math.round(sx + len * Math.cos(rad - spread));
      const y1 = Math.round(sy + len * Math.sin(rad - spread));
      const x2 = Math.round(sx + len * Math.cos(rad + spread));
      const y2 = Math.round(sy + len * Math.sin(rad + spread));
      overlayHtml += `<polygon points="${sx},${sy} ${x1},${y1} ${x2},${y2}" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4"/>`;
    }

    const fillCol = stStatus.color;
    const ringCol = isSel ? "#2dd4bf" : "#ffffff";
    const shortTag = (st.tag || "EQ").split("(")[0].trim();
    overlayHtml += `
      <g onclick="event.stopPropagation(); selectStation('${st.id}');" style="cursor:pointer;">
        ${isSel ? `<circle cx="${sx}" cy="${sy}" r="20" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="4,3"/>` : ''}
        <circle cx="${sx}" cy="${sy}" r="${isSel ? 14 : 11.5}" fill="${fillCol}" stroke="${ringCol}" stroke-width="${isSel ? 3 : 2}"/>
        <text x="${sx}" y="${sy + 3.5}" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="bold">${escapeHtml(st.id.replace("STN-0", "#").replace("STN-", "#"))}</text>
        <rect x="${sx + 16}" y="${sy - 12}" width="${Math.max(98, shortTag.length * 7.2 + 16)}" height="23" rx="5" fill="rgba(2,6,23,0.9)" stroke="${fillCol}" stroke-width="1.5"/>
        <text x="${sx + 22}" y="${sy + 3.5}" fill="#f8fafc" font-size="11" font-weight="bold">${escapeHtml(shortTag)}</text>
      </g>
    `;
  });

  svg.innerHTML = overlayHtml;
  _applyMapViewBox();
}

function handleMapClick(evt) {
  const pt = _clientToSvgCoords(evt.clientX, evt.clientY);
  const newNum = state.stations.length + 1;
  const padNum = String(newNum).padStart(2, "0");
  const newId = `STN-${padNum}`;
  const useGps = liveSensorsActive && (currentGps || currentCompassDeg !== null);
  const defaultArch = state.activeFloorId === "FLR-ROOF" ? "RTU_AHU" : "VAV_TERMINAL";
  const archObj = ARCHETYPES.find((a) => a.id === defaultArch) || ARCHETYPES[0];

  const roomDesc = useGps
    ? `Pinned (${currentGps ? currentGps.lat + ', ' + currentGps.lon : 'Map'}${currentCompassDeg !== null ? ' | ' + currentCompassDeg + '° ' + degToCardinal(currentCompassDeg) : ''})`
    : `${state.activeFloorId} (${pt.xPct.toFixed(1)}%, ${pt.yPct.toFixed(1)}%)`;

  const newStation = {
    id: newId,
    tag: `${defaultArch === 'RTU_AHU' ? 'RTU' : 'VAV'}-${padNum}`,
    archetype: defaultArch,
    floorId: state.activeFloorId,
    room: roomDesc,
    xPct: Number(pt.xPct.toFixed(1)),
    yPct: Number(pt.yPct.toFixed(1)),
    gpsLat: currentGps ? currentGps.lat : null,
    gpsLon: currentGps ? currentGps.lon : null,
    gpsAcc: currentGps ? currentGps.acc : null,
    compassDeg: currentCompassDeg !== null ? currentCompassDeg : null,
    anchorType: useGps ? "OUTDOOR_GNSS_AND_COMPASS" : "MANUAL_MAP_PIN",
    mfg: "",
    model: "",
    serial: "",
    elec: "",
    legacyCtrl: "",
    alcTarget: archObj.default_alc,
    thermistorCurve: "10k_TYPE_II",
    ioTally: { ui: 2, bi: 1, bo: 1, ao: 1 },
    parentPanel: "",
    servedBy: "",
    mstpMac: "",
    ocrConf: 1.0,
    ambiguousNote: "",
    scheduledQty: 1,
    observedQty: 1,
    tierDelta: "",
    burstMeta: {},
    checks: {} // BUG-04 FIX: Unchecked until inspected!
  };
  state.stations.push(newStation);
  state.activeStationId = newId;
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  persistWalkState();
  renderAll(true);
}

function deleteActiveStation() {
  if (state.stations.length <= 1) {
    alert("At least one station must remain in the walk session.");
    return;
  }
  const st = getActiveStation();
  state.stations = state.stations.filter((x) => x.id !== st.id);
  state.activeStationId = state.stations[0].id;
  persistWalkState();
  loadActiveStationBurstPhotos();
  renderAll(true);
}

function renderStationStrip() {
  const countEl = document.getElementById("stationSummaryCount");
  if (countEl) countEl.textContent = String(state.stations.length);
  const strip = document.getElementById("stationStrip");
  strip.innerHTML = state.stations.map((st) => {
    const qtyDiff = (Number(st.observedQty) || 0) - (Number(st.scheduledQty) || 0);
    const deltaDot = qtyDiff !== 0 ? `<span style="color:#f59e0b;font-weight:800;"> (Δ${qtyDiff > 0 ? '+' : ''}${qtyDiff})</span>` : "";
    const stStatus = computeStationStatus(st);
    return `
      <div class="station-pill ${stStatus.cls} ${st.id === state.activeStationId ? 'active' : ''}" onclick="selectStation('${st.id}')">
        <strong>${escapeHtml(st.id)}: ${escapeHtml((st.tag || '').split("(")[0].trim())}${deltaDot}</strong>
        <small>${escapeHtml(st.floorId)} | ${stStatus.verifiedCount}/${stStatus.total} chk</small>
      </div>
    `;
  }).join("");
}

function selectStation(stationId) {
  const st = state.stations.find((s) => s.id === stationId);
  if (!st) return;
  const floorChanged = state.activeFloorId !== st.floorId;
  state.activeStationId = stationId;
  state.activeFloorId = st.floorId;
  persistWalkState();
  if (floorChanged) refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
}

// ============================================================================
// 2B. ⚡ QUICK WALK (<15s) UNIFIED SINGLE-CARD INSPECTOR
// ============================================================================
function renderQuickWalkCard(st) {
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  document.getElementById("qwStationIdBadge").textContent = st.id;
  document.getElementById("qwArchetypeSelect").innerHTML = ARCHETYPES.map((a) => `
    <option value="${a.id}" ${a.id === st.archetype ? 'selected' : ''}>${escapeHtml(a.label)}</option>
  `).join("");

  document.getElementById("qwTagInput").value = st.tag || "";
  document.getElementById("qwRoomInput").value = st.room || "";
  document.getElementById("qwMfgInput").value = st.mfg || "";
  document.getElementById("qwModelInput").value = st.model || "";
  document.getElementById("qwSerialInput").value = st.serial || "";
  document.getElementById("qwLegacyInput").value = st.legacyCtrl || "";
  document.getElementById("qwSchedVal").textContent = String(st.scheduledQty ?? 1);
  document.getElementById("qwObsVal").textContent = String(st.observedQty ?? 1);
  document.getElementById("qwCurveSelect").value = st.thermistorCurve || "10k_TYPE_II";
  document.getElementById("qwDeltaInput").value = st.tierDelta || "";

  // Compact 3-Slot Horizontal Photo Strip
  const slotNames = { 1: "1️⃣ Wide", 2: "2️⃣ Plate", 3: "3️⃣ Board" };
  document.getElementById("qwPhotoStrip").innerHTML = [1, 2, 3].map((slot) => {
    const url = cachedSlotPhotos[slot];
    const meta = (st.burstMeta && st.burstMeta[slot]) || null;
    const isClahe = Boolean(meta && meta.claheEnhanced);
    return `
      <div class="quick-photo-slot" style="${slot === 2 ? 'border-color:var(--accent-teal);' : ''}">
        <strong style="font-size:10.5px;">${slotNames[slot]}</strong>
        ${url
          ? `<img src="${url}" class="quick-photo-thumb" onclick="openPhotoZoomModal(${slot})" />`
          : `<div style="height:56px;display:flex;align-items:center;justify-content:center;background:var(--bg-main);border-radius:4px;font-size:10px;color:var(--text-muted);">Empty</div>`
        }
        <div style="display:flex;gap:3px;justify-content:center;">
          <button class="btn ${slot === 2 ? '' : 'btn-secondary'}" style="padding:3px 6px;min-height:26px;font-size:10.5px;" onclick="captureStationBurstSlot(${slot})">📸</button>
          ${url ? `<button class="btn ${isClahe ? 'btn-secondary' : 'btn-amber'}" style="padding:3px 6px;min-height:26px;font-size:10.5px;" onclick="toggleClaheOnSlot(${slot})" title="Toggle 8x8 CLAHE vs Raw Color">${isClahe ? '🎨' : '🔦'}</button>` : ''}
        </div>
      </div>
    `;
  }).join("");

  // Instant 1-Line Deterministic Vintage / Model / A2L / Delta Summary
  const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);
  const qtyDiff = (Number(st.observedQty) || 0) - (Number(st.scheduledQty) || 0);
  const badgeEl = document.getElementById("qwInstantAuditBadge");
  const alerts = [];
  if (dec.year) alerts.push(`📅 <strong>${dec.year}</strong> (${dec.age}y / ${dec.lifeLimit}y ASHRAE${dec.eol ? ' ⚠️ EOL' : ''})`);
  if (mdl.capacity) alerts.push(`⚙️ ${escapeHtml(mdl.capacity)}`);
  if (mdl.a2lFlag) alerts.push(`🚨 <strong>A2L (R-454B/R-32)</strong>`);
  if (qtyDiff !== 0) alerts.push(`📊 <strong>Qty Δ${qtyDiff > 0 ? '+' : ''}${qtyDiff}</strong>`);
  alerts.push(`🎯 ${escapeHtml(st.alcTarget || arch.default_alc)}`);

  badgeEl.className = (mdl.a2lFlag || dec.eol || qtyDiff !== 0) ? "amber-callout" : "status-callout";
  badgeEl.innerHTML = alerts.join(" &nbsp;|&nbsp; ");

  // 1-Tap Red-Flag Exception Chips
  const flagsEl = document.getElementById("qwFlagsContainer");
  flagsEl.innerHTML = arch.items.map((item, idx) => {
    const curVal = st.checks && st.checks[item.id];
    const rfVal = (item.redFlags && item.redFlags[0]) || item.opts[1];
    const isFlagged = Boolean(curVal && (item.redFlags || []).includes(curVal));
    const isClean = Boolean(curVal && !isFlagged);
    return `
      <button class="quick-flag-chip ${isFlagged ? 'flagged' : (isClean ? 'verified-pass' : '')}"
              onclick="toggleQuickRedFlagChip(${idx})"
              title="${escapeHtml(item.q)}">
        ${isFlagged ? '🚨' : (isClean ? '✅' : '⚪')} ${escapeHtml(item.shortLabel || item.id)}
      </button>
    `;
  }).join("");

  const stStatus = computeStationStatus(st);
  document.getElementById("qwVerificationCounter").textContent =
    `Checklist: ${stStatus.verifiedCount}/${stStatus.total} Verified (${stStatus.redCount} Red-Flags)`;
}

function syncQuickWalkInputs() {
  const st = getActiveStation();
  st.tag = document.getElementById("qwTagInput").value;
  st.room = document.getElementById("qwRoomInput").value;
  st.mfg = document.getElementById("qwMfgInput").value;
  st.model = document.getElementById("qwModelInput").value;
  st.serial = document.getElementById("qwSerialInput").value;
  st.tierDelta = document.getElementById("qwDeltaInput").value;
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  // Refresh just the instant audit badge without losing input focus
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);
  const qtyDiff = (Number(st.observedQty) || 0) - (Number(st.scheduledQty) || 0);
  const badgeEl = document.getElementById("qwInstantAuditBadge");
  const alerts = [];
  if (dec.year) alerts.push(`📅 <strong>${dec.year}</strong> (${dec.age}y / ${dec.lifeLimit}y ASHRAE${dec.eol ? ' ⚠️ EOL' : ''})`);
  if (mdl.capacity) alerts.push(`⚙️ ${escapeHtml(mdl.capacity)}`);
  if (mdl.a2lFlag) alerts.push(`🚨 <strong>A2L (R-454B/R-32)</strong>`);
  if (qtyDiff !== 0) alerts.push(`📊 <strong>Qty Δ${qtyDiff > 0 ? '+' : ''}${qtyDiff}</strong>`);
  alerts.push(`🎯 ${escapeHtml(st.alcTarget || arch.default_alc)}`);
  badgeEl.className = (mdl.a2lFlag || dec.eol || qtyDiff !== 0) ? "amber-callout" : "status-callout";
  badgeEl.innerHTML = alerts.join(" &nbsp;|&nbsp; ");
}

function syncQuickWalkLegacy() {
  const st = getActiveStation();
  st.legacyCtrl = document.getElementById("qwLegacyInput").value;
  const matched = matchLegacyControllerObjJS(st.legacyCtrl);
  if (matched) {
    st.alcTarget = matched.target;
    st.thermistorCurve = matched.curve;
    document.getElementById("qwCurveSelect").value = matched.curve;
  }
  syncQuickWalkInputs();
}

function stepStationQty(field, delta) {
  const st = getActiveStation();
  st[field] = Math.max(0, (Number(st[field]) || 0) + delta);
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  renderActiveTabContent();
}

function updateQuickCurve(curveVal) {
  const st = getActiveStation();
  st.thermistorCurve = curveVal;
  persistWalkState();
}

function toggleQuickRedFlagChip(itemIdx) {
  const st = getActiveStation();
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const item = arch.items[itemIdx];
  if (!item) return;
  if (!st.checks) st.checks = {};
  const cur = st.checks[item.id];
  const rfVal = (item.redFlags && item.redFlags[0]) || item.opts[1];
  if (cur && (item.redFlags || []).includes(cur)) {
    st.checks[item.id] = item.opts[0]; // Toggle back to Clean Pass
  } else {
    st.checks[item.id] = rfVal; // Flag Red-Flag Defect in 1 Tap
  }
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  renderQuickWalkCard(st);
}

function markAllChecksClean() {
  const st = getActiveStation();
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  if (!st.checks) st.checks = {};
  for (const item of arch.items) {
    if (!st.checks[item.id]) {
      st.checks[item.id] = item.opts[0];
    }
  }
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  renderActiveTabContent();
  showBannerToast(`✅ <strong>Verified Remaining Items Clean on ${escapeHtml(st.id)}!</strong> Existing flagged defects preserved.`);
}

// ============================================================================
// 2C. DEEP INSPECTOR ROUTER & STATION IDENTITY BAR
// ============================================================================
function switchTab(tabName) {
  state.activeTab = tabName;
  persistWalkState();
  document.querySelectorAll(".inspector-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.style.display = panel.id === `panel-${tabName}` ? "block" : "none";
  });
  renderActiveTabContent();
}

function updateStationIdentityFields() {
  const st = getActiveStation();
  st.tag = document.getElementById("stTagInput").value;
  st.room = document.getElementById("stRoomInput").value;
  st.scheduledQty = parseInt(document.getElementById("stSchedQty").value, 10) || 0;
  st.observedQty = parseInt(document.getElementById("stObsQty").value, 10) || 0;
  st.tierDelta = document.getElementById("stDeltaNote").value;
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  renderScopeDeltaStatus(st);
}

function renderScopeDeltaStatus(st) {
  const diff = (Number(st.observedQty) || 0) - (Number(st.scheduledQty) || 0);
  const badge = document.getElementById("scopeDeltaBadge");
  if (!badge) return;
  if (diff > 0) {
    badge.className = "amber-callout";
    badge.innerHTML = `⚠️ <strong>TIER-0 vs TIER-2 COUNT DELTA (+${diff} UNSCHEDULED):</strong> Field found <code>${st.observedQty}</code> vs Contract Schedule <code>${st.scheduledQty}</code> &rarr; Flag for <strong>Bid Clarification (Skill 1.1) / Change Order (Skill 3.3)</strong>!`;
  } else if (diff < 0) {
    badge.className = "amber-callout";
    badge.innerHTML = `⚠️ <strong>COUNT DELTA (${diff} FEWER THAN SCHEDULE):</strong> Field found <code>${st.observedQty}</code> vs Scheduled <code>${st.scheduledQty}</code> &rarr; Issue <strong>RFI (Skill 3.1)</strong> to confirm deduct/relocated equipment.`;
  } else {
    badge.className = "status-callout";
    badge.innerHTML = `✅ <strong>Equipment Count Aligned (${st.observedQty} Found = ${st.scheduledQty} Scheduled)</strong> | ${escapeHtml(st.tierDelta || 'No scope discrepancy noted.')}`;
  }
}

function renderActiveTabContent() {
  const st = getActiveStation();
  if (state.uiMode === "quick") {
    renderQuickWalkCard(st);
    return;
  }

  document.getElementById("stTagInput").value = st.tag || "";
  document.getElementById("stRoomInput").value = st.room || "";
  document.getElementById("stSchedQty").value = st.scheduledQty !== undefined ? st.scheduledQty : 1;
  document.getElementById("stObsQty").value = st.observedQty !== undefined ? st.observedQty : 1;
  document.getElementById("stDeltaNote").value = st.tierDelta || "";
  renderScopeDeltaStatus(st);

  if (state.activeTab === "checklist") renderChecklistTab(st);
  if (state.activeTab === "nameplate") renderNameplateTab(st);
  if (state.activeTab === "bas_io") renderBasIoTab(st);
  if (state.activeTab === "video") renderVideoTab();
  if (state.activeTab === "audio") renderAudioTab(st);
  if (state.activeTab === "calculators") renderCalculatorsTab();
}

// ============================================================================
// 3. TAB 1: CONTEXT-AWARE CHECKLISTS (BUG-03 & BUG-04 FIXED!)
// ============================================================================
function renderChecklistTab(st) {
  const archSelect = document.getElementById("archetypeSelect");
  archSelect.innerHTML = ARCHETYPES.map((a) => `
    <option value="${a.id}" ${a.id === st.archetype ? 'selected' : ''}>${escapeHtml(a.label)}</option>
  `).join("");

  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const stStatus = computeStationStatus(st);
  document.getElementById("defaultAlcBadge").innerHTML =
    `<span>${escapeHtml(arch.default_alc)}</span> <strong style="color:var(--accent-teal);">(${stStatus.verifiedCount}/${stStatus.total} Checked)</strong>`;

  // BUG-03 FIX: Integer option index passed to onclick -> safe with ANY quotes (`1/2"`, `3/4"`)!
  // BUG-04 FIX: Uninspected items stay null (`UNCHECKED`) instead of spoofing `opts[0]`.
  const listEl = document.getElementById("checklistContainer");
  listEl.innerHTML = arch.items.map((item) => {
    const chosen = (st.checks && st.checks[item.id]) || null;
    const isRedFlag = Boolean(chosen && (item.redFlags || []).includes(chosen));
    const isAmberFlag = Boolean(chosen && (item.amberFlags || []).includes(chosen));
    return `
      <div class="checklist-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
          <strong style="font-size:12px;color:var(--accent-teal);">${escapeHtml(item.cat)}</strong>
          <span style="font-size:10.5px;color:${chosen ? 'var(--text-muted)' : 'var(--accent-amber)'};font-weight:700;">
            ${escapeHtml(item.id)} ${chosen ? '✓' : '• UNCHECKED'}
          </span>
        </div>
        <div style="margin-top:4px;font-weight:600;font-size:13px;">${escapeHtml(item.q)}</div>
        <div class="chip-group">
          ${item.opts.map((opt, optIdx) => {
            const sel = opt === chosen;
            const rf = (item.redFlags || []).includes(opt);
            const af = (item.amberFlags || []).includes(opt);
            const flagClass = sel ? (rf ? 'red-flag' : (af ? 'amber-flag' : '')) : '';
            return `<button class="option-chip ${sel ? 'selected' : ''} ${flagClass}"
                      onclick="setChecklistOptionIndex('${item.id}', ${optIdx})">
                      ${rf ? '🚨 ' : (af ? '⚠️ ' : '')}${escapeHtml(opt)}
                    </button>`;
          }).join("")}
        </div>
        <div class="reminder-box">
          <strong>${isRedFlag ? '🚨 ACTIVE CSC RED-FLAG TRIGGERED:' : (isAmberFlag ? '⚠️ SCOPE / RETROFIT ADVISORY:' : '💡 CSC Standard Reminder:')}</strong> ${escapeHtml(item.reminder)}
        </div>
      </div>
    `;
  }).join("");
}

function changeStationArchetype(newArchId) {
  const st = getActiveStation();
  st.archetype = newArchId;
  const arch = ARCHETYPES.find((a) => a.id === newArchId);
  if (arch) {
    st.alcTarget = arch.default_alc;
  }
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  renderActiveTabContent();
}

function setChecklistOptionIndex(itemId, optIdx) {
  const st = getActiveStation();
  const arch = ARCHETYPES.find((a) => a.id === st.archetype) || ARCHETYPES[0];
  const item = arch.items.find((i) => i.id === itemId);
  if (!item || item.opts[optIdx] === undefined) return;
  if (!st.checks) st.checks = {};
  st.checks[itemId] = item.opts[optIdx];
  persistWalkState();
  renderInteractiveMap();
  renderStationStrip();
  renderChecklistTab(st);
}

// ============================================================================
// 4. TAB 2: 3-SLOT BURST CAMERA + NON-DESTRUCTIVE 8x8 CLAHE + EXIF + BOARD REF
// ============================================================================
async function loadActiveStationBurstPhotos() {
  const st = getActiveStation();
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  cachedRawSlotPhotos = { 1: null, 2: null, 3: null };
  for (const slot of [1, 2, 3]) {
    const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
    const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;
    cachedSlotPhotos[slot] = await window.CSCDiscoveryAdapter.loadMediaBlob(key);
    cachedRawSlotPhotos[slot] = await window.CSCDiscoveryAdapter.loadMediaBlob(rawKey);
  }
  if (state.uiMode === "quick") renderQuickWalkCard(st);
  else if (state.activeTab === "nameplate") renderBurstSlotsUI(st);
}

function _buildSortedFilename(st, slot) {
  const slotLabels = { 1: "01_Context", 2: "02_Nameplate", 3: "03_SubComponent" };
  const cleanTag = (st.tag || st.id).split("(")[0].trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return `${state.jobNumber}_${st.floorId}_${cleanTag}_${slotLabels[slot]}.jpg`;
}

async function captureStationBurstSlot(slot) {
  const st = getActiveStation();
  const img = await window.CSCDiscoveryAdapter.captureImage({ maxDim: 1500, quality: 0.87 });
  if (!img || !img.dataUrl) return;

  const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
  const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;
  await window.CSCDiscoveryAdapter.saveMediaBlob(key, img.dataUrl);
  await window.CSCDiscoveryAdapter.saveMediaBlob(rawKey, img.dataUrl);
  cachedSlotPhotos[slot] = img.dataUrl;
  cachedRawSlotPhotos[slot] = img.dataUrl;

  // BUG-09 FIX: Stamp real JPEG EXIF GPSLatitude/GPSLongitude & GPSImgDirection onto station!
  if (img.exif) {
    if (img.exif.gpsLat !== null && img.exif.gpsLon !== null && !st.gpsLat) {
      st.gpsLat = img.exif.gpsLat;
      st.gpsLon = img.exif.gpsLon;
    }
    if (img.exif.compassDeg !== null && st.compassDeg === null) {
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
  renderInteractiveMap();
  if (state.uiMode === "quick") renderQuickWalkCard(st);
  else renderBurstSlotsUI(st);
}

// BUG-09 FIX: Non-destructive toggle between 8x8 Local Tile CLAHE and Raw Color!
async function toggleClaheOnSlot(slot) {
  const st = getActiveStation();
  const curUrl = cachedSlotPhotos[slot];
  if (!curUrl) return;
  if (!st.burstMeta) st.burstMeta = {};
  const meta = st.burstMeta[slot] || (st.burstMeta[slot] = { filename: _buildSortedFilename(st, slot) });
  const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
  const rawKey = `photo_raw::${state.sessionId}::${st.id}::slot${slot}`;

  if (meta.claheEnhanced && cachedRawSlotPhotos[slot]) {
    // Restore original color image (preserves wire/jumper colors!)
    cachedSlotPhotos[slot] = cachedRawSlotPhotos[slot];
    meta.claheEnhanced = false;
    await window.CSCDiscoveryAdapter.saveMediaBlob(key, cachedSlotPhotos[slot]);
    showBannerToast("🎨 <strong>Restored Original Raw Color Photo!</strong> (Wire &amp; terminal block colors preserved.)");
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
    showBannerToast("🔦 <strong>8x8 Local Tile CLAHE Applied!</strong> Tap <code>🎨 Raw Color</code> anytime to revert.");
  }

  persistWalkState();
  if (state.uiMode === "quick") renderQuickWalkCard(st);
  else renderBurstSlotsUI(st);
}

function openPhotoZoomModal(slot) {
  const src = cachedSlotPhotos[slot];
  if (!src) return;
  const st = getActiveStation();
  const meta = (st.burstMeta && st.burstMeta[slot]) || {};
  const modal = document.getElementById("photoZoomModal");
  document.getElementById("zoomModalTitle").textContent =
    `${st.id} (${st.tag}) — ${meta.filename || 'Captured Field Photo'}${meta.claheEnhanced ? ' [8x8 CLAHE]' : ' [Raw Color]'}`;
  document.getElementById("zoomModalImg").src = src;
  modal.style.display = "flex";
}

async function runLiveVisionOcrOnSlot2() {
  const st = getActiveStation();
  const imgDataUrl = cachedSlotPhotos[2] || cachedSlotPhotos[3] || cachedSlotPhotos[1];
  if (!imgDataUrl) {
    alert("Snap or select a photo in Slot 2 (Unit Nameplate) or Slot 3 (Board/VFD) first!");
    return;
  }

  const apiKey = window.CSCDiscoveryAdapter.getSecretKey("gemini_api_key");
  if (!apiKey) {
    showBannerToast(
      "📦 <strong>Offline Queue Saved:</strong> Photo is stored locally in IndexedDB &amp; included in <code>.cscwalk.zip</code>! (Optional: Add a Gemini API Key in <code>⚙️ Walk / Export</code> for live rooftop Vision OCR.)",
      true
    );
    return;
  }

  const btn = document.getElementById("liveOcrBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Reading Plate via Gemini Vision...";
  }

  try {
    const base64Data = imgDataUrl.split(",")[1];
    const prompt = `Extract HVAC or BAS equipment nameplate fields from this image as strict JSON with keys:
      {"manufacturer": string, "model_number": string, "serial_number": string, "electrical": string, "legacy_controller": string, "confidence": number, "ambiguous_note": string}.
      If any character is weathered or stamped ambiguously, lower confidence (<0.85) and note it in ambiguous_note.`;

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
    st.ocrConf = typeof parsed.confidence === "number" ? parsed.confidence : 0.9;
    st.ambiguousNote = parsed.ambiguous_note || "";
    persistWalkState();
    renderInteractiveMap();
    renderStationStrip();
    renderActiveTabContent();
    showBannerToast("✅ <strong>Live Vision Nameplate OCR Complete!</strong> Serial vintage, A2L check &amp; ALC cross-ref updated.");
  } catch (err) {
    showBannerToast(`⚠️ Live OCR unreachable (${escapeHtml(err.message)}) — Photo safely queued in local IndexedDB!`, true);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "🤖 Auto-Read Plate (Live Vision / Offline Queue)";
    }
  }
}

function renderBurstSlotsUI(st) {
  const titles = {
    1: { title: "1️⃣ Wide Context", sub: "Access & piping" },
    2: { title: "2️⃣ Unit Nameplate", sub: "Data Plate" },
    3: { title: "3️⃣ Board / VFD", sub: "MAC / Jumpers" }
  };
  const container = document.getElementById("burstSlotsContainer");
  if (!container) return;

  container.innerHTML = [1, 2, 3].map((slot) => {
    const url = cachedSlotPhotos[slot];
    const meta = (st.burstMeta && st.burstMeta[slot]) || null;
    const isClahe = Boolean(meta && meta.claheEnhanced);
    return `
      <div class="burst-card" style="${slot === 2 ? 'border-color:var(--accent-teal);' : ''}">
        <div>
          <strong>${titles[slot].title}</strong><br/>
          <small style="color:var(--text-muted);">${escapeHtml(meta ? meta.filename : titles[slot].sub)}</small>
        </div>
        ${url
          ? `<img src="${url}" class="burst-thumb" onclick="openPhotoZoomModal(${slot})" title="Tap to zoom full nameplate crop" />`
          : `<div style="height:82px;display:flex;align-items:center;justify-content:center;background:var(--bg-main);border-radius:6px;color:var(--text-muted);font-size:11px;">No Photo</div>`
        }
        <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
          <button class="btn ${slot === 2 ? '' : 'btn-secondary'}" style="font-size:11px;padding:4px 8px;min-height:30px;" onclick="captureStationBurstSlot(${slot})">
            📸 ${url ? 'Retake' : 'Snap'}
          </button>
          ${url ? `<button class="btn ${isClahe ? 'btn-secondary' : 'btn-amber'}" style="font-size:11px;padding:4px 8px;min-height:30px;" onclick="toggleClaheOnSlot(${slot})">${isClahe ? '🎨 Raw Color' : '🔦 8x8 CLAHE'}</button>` : ''}
        </div>
      </div>
    `;
  }).join("");
}

function renderNameplateTab(st) {
  renderBurstSlotsUI(st);
  document.getElementById("npMfg").value = st.mfg || "";
  document.getElementById("npModel").value = st.model || "";
  document.getElementById("npSerial").value = st.serial || "";
  document.getElementById("npElec").value = st.elec || "";
  document.getElementById("npLegacy").value = st.legacyCtrl || "";
  document.getElementById("npAlcTarget").value = st.alcTarget || "";
  runLiveSerialDecode(false);
}

function onLegacyControllerInput() {
  const val = document.getElementById("npLegacy").value;
  const matched = matchLegacyControllerObjJS(val);
  if (matched) {
    document.getElementById("npAlcTarget").value = matched.target;
    const st = getActiveStation();
    st.thermistorCurve = matched.curve;
  }
  runLiveSerialDecode(true);
}

function runLiveSerialDecode(saveNow = true) {
  const st = getActiveStation();
  st.mfg = document.getElementById("npMfg").value;
  st.model = document.getElementById("npModel").value;
  st.serial = document.getElementById("npSerial").value;
  st.elec = document.getElementById("npElec").value;
  st.legacyCtrl = document.getElementById("npLegacy").value;
  st.alcTarget = document.getElementById("npAlcTarget").value;
  if (saveNow) {
    persistWalkState();
    renderInteractiveMap();
    renderStationStrip();
  }

  const res = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
  const mdl = decodeModelDeterministic(st.mfg, st.model);
  const out = document.getElementById("serialDecodeOutput");
  out.className = (res.eol || mdl.a2lFlag) ? "amber-callout" : "status-callout";
  out.innerHTML = `
    <div><strong>🔢 Deterministic Serial, Model &amp; ASHRAE Ch. 38 Audit (${escapeHtml(res.rule)}):</strong></div>
    <div style="margin-top:4px;">
      • <strong>Decoded Mfg Date:</strong> <code>${res.year ? res.year + ' (' + escapeHtml(res.period) + ')' : 'Enter Serial Prefix to Decode'}</code>
      | <strong>Age:</strong> <code>${res.age !== null ? res.age + ' Yrs (ASHRAE Benchmark: ' + res.lifeLimit + ' Yrs)' : 'N/A'}</code>
      ${mdl.capacity ? `| <strong>Model Capacity:</strong> <code>${escapeHtml(mdl.capacity)}</code>` : ''}
    </div>
    <div style="margin-top:4px;">
      • <strong>Service Life Status:</strong>
      ${res.eol
        ? `<strong style="color:#f59e0b;">⚠️ END-OF-LIFE RISK (&ge;${res.lifeLimit} YRS): Auto-flags Tier-1 Proposal exclusion for existing heat-exchanger, compressor, or seized valve body failure.</strong>`
        : `<strong style="color:#2dd4bf;">✅ Within ASHRAE Ch. 38 median service life (${res.lifeLimit} yrs).</strong>`}
    </div>
    ${mdl.a2lFlag
      ? `<div style="margin-top:5px;color:#fca5a5;font-weight:700;">🚨 ${escapeHtml(mdl.a2lNote)}</div>`
      : ''}
    ${st.ocrConf < 0.85
      ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(245,158,11,0.4);">
           <strong>🔍 POL-IT-AI-001 Click-to-Verify Alert (${Math.round(st.ocrConf * 100)}% OCR Confidence):</strong> ${escapeHtml(st.ambiguousNote)}
         </div>`
      : `<div style="margin-top:4px;font-size:11px;color:var(--text-muted);">✅ Confidence: ${Math.round((st.ocrConf || 1) * 100)}% | Export Filename: <code>${escapeHtml(_buildSortedFilename(st, 2))}</code></div>`}
  `;

  // BUG-12 FIX: Render Neutral #Golden-Library Board Rotary MAC / EOL / Jumper Reference Card
  const boardRef = lookupNeutralBoardRefJS(st.mfg, st.model, st.legacyCtrl, st.alcTarget);
  const boardEl = document.getElementById("boardRefOutput");
  if (boardEl && boardRef) {
    boardEl.innerHTML = `
      <div><strong>📘 #Golden-Library Hardware Switch, EOL &amp; Jumper Reference:</strong> <code>${escapeHtml(boardRef.citation)}</code></div>
      <div style="font-size:11.5px;margin-top:3px;font-weight:700;color:var(--accent-teal);">${escapeHtml(boardRef.family)}</div>
      <ul style="margin:5px 0 0 18px;padding:0;font-size:11.5px;">
        ${boardRef.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
      </ul>
    `;
  }
}

// ============================================================================
// 4B. TAB 3 (NEW PHASE 2): BAS OVERLAY, THERMISTOR CURVE & HARDWARE I/O TALLY
// ============================================================================
const CURVE_META = {
  "10k_TYPE_II": { reuse: "✅ Direct Reuse on ALC UI", note: "Matches native Automated Logic 10kΩ Type II Precon curve." },
  "10k_TYPE_III": { reuse: "⚠️ Custom Liner Table or Replace", note: "10k Type III differs ~1.8°F away from 77°F — configure custom ALC curve or swap probe." },
  "20k_NTC": { reuse: "⚠️ Honeywell 20kΩ NTC Curve", note: "Configure custom 20kΩ lookup table in WebCTRL® or replace w/ 10k Type II." },
  "1k_NICKEL": { reuse: "🚨 Replace Legacy JCI 1kΩ Ni Sensor", note: "1,000Ω Nickel RTD has steep low-resistance slope — include new ALC 10k Type II / ZS Pro sensors in BOM!" },
  "1k_PLATINUM": { reuse: "⚠️ Check UI RTD Support or Replace", note: "1,000Ω Pt RTD (Siemens) — replace field sensors w/ ALC 10k Type II unless RTD input module used." },
  "RNET_DIGITAL": { reuse: "✅ Native ALC Rnet Digital Bus (RFI-23-008)", note: "Consolidates Space Temp + RH + CO2 on single 4-conductor Rnet bus." },
  "PNEUMATIC": { reuse: "🚨 Full Pneumatic-to-DDC Sensor Pull", note: "Cap 15/20 psi poly air line; furnish adapter plate + pull CMP/CL2P Rnet & 10k Type II cable." }
};

function _recommendAlcFromIoJS(st) {
  const io = st.ioTally || { ui: 0, bi: 0, bo: 0, ao: 0 };
  const totalIn = (io.ui || 0) + (io.bi || 0);
  let model = "ALC ZN551 Unitary Controller";
  let opti = 0, zn = 1, xpio = 0;

  if (st.archetype === "VAV_TERMINAL" && totalIn <= 5 && (io.bo || 0) <= 3 && (io.ao || 0) <= 2) {
    model = "ALC ZN341v Integrated VAV Controller (Internal Actuator + ΔP Pickup)";
    opti = 0; zn = 1; xpio = 0;
  } else if (totalIn <= 5 && (io.bo || 0) <= 5 && (io.ao || 0) <= 3 && st.archetype !== "CHILLER_BOILER_PLANT") {
    model = "ALC ZN551 Equipment Controller";
    opti = 0; zn = 1; xpio = 0;
  } else if (totalIn <= 12 && (io.bo || 0) <= 8 && (io.ao || 0) <= 4) {
    model = "ALC OptiFlex OF1628 Plant/AHU Controller";
    opti = 1; zn = 0; xpio = 0;
  } else {
    const extraIn = Math.max(0, totalIn - 12);
    const extraOut = Math.max(0, (io.bo || 0) - 8) + Math.max(0, (io.ao || 0) - 4);
    xpio = Math.max(1, Math.ceil(Math.max(extraIn / 8, extraOut / 8)));
    model = `ALC OptiFlex OF1628 + (${xpio}) FIO-812 / XPIO Expander(s)`;
    opti = 1; zn = 0;
  }
  return { model, opti, zn, xpio, totalPoints: totalIn + (io.bo || 0) + (io.ao || 0) };
}

function renderBasIoTab(st) {
  if (!st.ioTally) st.ioTally = { ui: 4, bi: 2, bo: 2, ao: 2 };
  document.getElementById("ioThermistorSelect").value = st.thermistorCurve || "10k_TYPE_II";
  document.getElementById("ioParentPanel").value = st.parentPanel || "";
  document.getElementById("ioServedBy").value = st.servedBy || "";
  document.getElementById("ioMstpMac").value = st.mstpMac || "";
  document.getElementById("ioUiVal").textContent = String(st.ioTally.ui || 0);
  document.getElementById("ioBiVal").textContent = String(st.ioTally.bi || 0);
  document.getElementById("ioBoVal").textContent = String(st.ioTally.bo || 0);
  document.getElementById("ioAoVal").textContent = String(st.ioTally.ao || 0);

  const rec = _recommendAlcFromIoJS(st);
  const cMeta = CURVE_META[st.thermistorCurve || "10k_TYPE_II"] || CURVE_META["10k_TYPE_II"];
  const out = document.getElementById("basIoRecommendOutput");
  out.className = cMeta.reuse.startsWith("🚨") ? "amber-callout" : "status-callout";
  out.innerHTML = `
    <div><strong>🎯 Deterministic ALC Hardware Sizing (${rec.totalPoints} Hardwired Points + 15% Spare):</strong> <code>${escapeHtml(rec.model)}</code></div>
    <div style="margin-top:4px;">• <strong>Sensor Curve Compatibility:</strong> <strong>${cMeta.reuse}</strong> — ${escapeHtml(cMeta.note)}</div>
    <div style="margin-top:4px;font-size:11.5px;color:var(--text-muted);">
      • Topology: Panel <code>${escapeHtml(st.parentPanel || 'TBD')}</code> | Upstream <code>${escapeHtml(st.servedBy || 'Standalone')}</code> | Trunk <code>${escapeHtml(st.mstpMac || 'Assign MAC 01-127')}</code>
    </div>
  `;
}

function stepIoCount(key, delta) {
  const st = getActiveStation();
  if (!st.ioTally) st.ioTally = { ui: 0, bi: 0, bo: 0, ao: 0 };
  st.ioTally[key] = Math.max(0, (Number(st.ioTally[key]) || 0) + delta);
  const rec = _recommendAlcFromIoJS(st);
  st.alcTarget = rec.model;
  persistWalkState();
  renderBasIoTab(st);
}

function updateStationBasIo() {
  const st = getActiveStation();
  st.thermistorCurve = document.getElementById("ioThermistorSelect").value;
  st.parentPanel = document.getElementById("ioParentPanel").value;
  st.servedBy = document.getElementById("ioServedBy").value;
  st.mstpMac = document.getElementById("ioMstpMac").value;
  persistWalkState();
  renderBasIoTab(st);
}

function pushStationIoToVaCalculator() {
  const st = getActiveStation();
  const rec = _recommendAlcFromIoJS(st);
  const io = st.ioTally || { ui: 0, bi: 0, bo: 0, ao: 0 };
  document.getElementById("calcOptiCount").value = String(rec.opti);
  document.getElementById("calcZnCount").value = String(rec.zn);
  document.getElementById("calcXpioCount").value = String(rec.xpio);
  document.getElementById("calcSrActCount").value = String(Math.max(1, io.ao || 1));
  document.getElementById("calcNsrActCount").value = String(Math.max(0, (io.bo || 0) > 2 ? 1 : 0));
  document.getElementById("calcZsCount").value = String(st.thermistorCurve === "RNET_DIGITAL" ? 2 : 1);
  switchTab("calculators");
  showBannerToast(`⚡ <strong>Pushed ${escapeHtml(st.id)} I/O Tally &rarr; Unified TCP 24VAC Class 2 Sizer!</strong>`);
}

// ============================================================================
// 5. TAB 4: LIVE CAMERA + TORCH + STEP-PEAK PDR WALK & VIDEO LAPLACIAN SLICER
// ============================================================================
function _handleDeviceMotionStep(ev) {
  if (!livePdrActive) return;
  const acc = ev.accelerationIncludingGravity;
  if (!acc) return;
  const mag = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
  const now = Date.now();
  // Walking step peak threshold (>11.6 m/s² vs 9.81 m/s² gravity, min 340ms cadence -> ZERO stationary drift!)
  if (mag > 11.6 && now - lastStepPeakMs > 340) {
    lastStepPeakMs = now;
    const hdg = currentCompassDeg !== null ? currentCompassDeg : 90;
    pdrSteps.push({ stepIdx: pdrSteps.length + 1, headingDeg: hdg, tMs: now });
    state.pdrSteps = pdrSteps.slice(-400);
    const sEl = document.getElementById("pdrStepCountEl");
    if (sEl) sEl.textContent = String(pdrSteps.length);
  }
}

async function toggleLivePdrWalk() {
  const btn = document.getElementById("livePdrBtn");
  const torchBtn = document.getElementById("torchToggleBtn");
  const video = document.getElementById("walkVideoPlayer");

  if (!livePdrActive) {
    try {
      pdrCameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      pdrVideoTrack = pdrCameraStream.getVideoTracks()[0] || null;
      video.srcObject = pdrCameraStream;
      video.style.display = "block";
      await video.play();

      livePdrActive = true;
      window.addEventListener("devicemotion", _handleDeviceMotionStep, true);
      window.addEventListener("deviceorientationabsolute", _handleOrientation, true);
      window.addEventListener("deviceorientation", _handleOrientation, true);

      if (btn) {
        btn.className = "btn btn-danger";
        btn.innerHTML = "⏹️ Stop Live PDR Cam";
      }
      if (torchBtn) torchBtn.style.display = "inline-flex";

      // Live Laplacian sharpness monitor every 750ms
      pdrSharpTimer = setInterval(() => {
        if (!livePdrActive || !video.videoWidth) return;
        const c = document.createElement("canvas");
        c.width = 320;
        c.height = Math.max(180, Math.round((video.videoHeight / video.videoWidth) * 320));
        c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
        const s = window.CSCDiscoveryAdapter.computeCanvasLaplacianSharpness(c);
        const shEl = document.getElementById("pdrSharpEl");
        if (shEl) shEl.textContent = String(s);
      }, 750);

      showBannerToast("📷 <strong>Live Rear Camera + Step-Peak PDR Active:</strong> Stationary stops produce ZERO drift! Tap <code>🅰️ Anchor A</code> at corridor start, snap crumbs, then tap <code>🅱️ Anchor B</code>.");
    } catch (err) {
      showBannerToast(`⚠️ Camera Notice (${escapeHtml(err.message)}): You can still use <code>+5 Steps</code> or <code>📹 Open Video File</code>!`, true);
    }
  } else {
    livePdrActive = false;
    clearInterval(pdrSharpTimer);
    window.removeEventListener("devicemotion", _handleDeviceMotionStep, true);
    if (pdrCameraStream) {
      pdrCameraStream.getTracks().forEach((t) => t.stop());
      pdrCameraStream = null;
      pdrVideoTrack = null;
    }
    torchEnabled = false;
    video.srcObject = null;
    if (btn) {
      btn.className = "btn";
      btn.innerHTML = "📷 Start Live Cam + Step PDR";
    }
    if (torchBtn) {
      torchBtn.style.display = "none";
      torchBtn.innerHTML = "🔦 Torch OFF";
    }
  }
}

async function toggleCameraTorch() {
  if (!pdrVideoTrack) return;
  torchEnabled = !torchEnabled;
  try {
    await pdrVideoTrack.applyConstraints({ advanced: [{ torch: torchEnabled }] });
    const tBtn = document.getElementById("torchToggleBtn");
    if (tBtn) {
      tBtn.className = torchEnabled ? "btn btn-amber" : "btn btn-secondary";
      tBtn.innerHTML = torchEnabled ? "🔦 Torch ON" : "🔦 Torch OFF";
    }
  } catch (e) {
    torchEnabled = false;
    showBannerToast("⚠️ Hardware LED Torch constraint not exposed on this camera lens.", true);
  }
}

function simulatePdrCorridorSteps(n = 5) {
  const hdg = currentCompassDeg !== null ? currentCompassDeg : 90;
  for (let i = 0; i < n; i++) {
    pdrSteps.push({ stepIdx: pdrSteps.length + 1, headingDeg: hdg, tMs: Date.now() + i * 450 });
  }
  state.pdrSteps = pdrSteps.slice(-400);
  const sEl = document.getElementById("pdrStepCountEl");
  if (sEl) sEl.textContent = String(pdrSteps.length);
  document.getElementById("interpTarget").value = String(pdrSteps.length);
  runLinearInterpolatorDemo();
}

function setPdrAnchor(which) {
  const st = getActiveStation();
  if (which === "A") {
    pdrAnchorA = {
      xPct: st.xPct,
      yPct: st.yPct,
      stepIdx: pdrSteps.length,
      floorId: state.activeFloorId
    };
    document.getElementById("interpTa").value = String(pdrSteps.length);
    showBannerToast(`🅰️ <strong>Anchor A Locked at (${st.xPct}%, ${st.yPct}%) [Step ${pdrSteps.length}]:</strong> Walk corridor &amp; snap crumbs, then tap a destination pin + <code>🅱️ Anchor B</code>!`);
    return;
  }

  // Anchor B -> Similarity-Transform / Step-Proportional Rubber-Banding of intermediate keyframes!
  if (!pdrAnchorA || pdrAnchorA.floorId !== state.activeFloorId) {
    showBannerToast("⚠️ Tap <code>🅰️ Anchor A</code> at your starting doorway/station on this floor first!", true);
    return;
  }
  const endStep = Math.max(pdrAnchorA.stepIdx + 1, pdrSteps.length);
  const span = endStep - pdrAnchorA.stepIdx;
  let adjusted = 0;

  (state.videoKeyframes || []).forEach((kf) => {
    if (kf.floorId === state.activeFloorId && typeof kf.stepIdx === "number" && kf.stepIdx >= pdrAnchorA.stepIdx && kf.stepIdx <= endStep) {
      const ratio = (kf.stepIdx - pdrAnchorA.stepIdx) / span;
      kf.xPct = Number((pdrAnchorA.xPct + ratio * (st.xPct - pdrAnchorA.xPct)).toFixed(1));
      kf.yPct = Number((pdrAnchorA.yPct + ratio * (st.yPct - pdrAnchorA.yPct)).toFixed(1));
      kf.action = `PDR Rubber-Banded (${Math.round(ratio * 100)}% A->B @ Step ${kf.stepIdx})`;
      adjusted++;
    }
  });

  document.getElementById("interpTb").value = String(endStep);
  persistWalkState();
  renderInteractiveMap();
  renderVideoTab();
  showBannerToast(`🅱️ <strong>Anchor B Locked at (${st.xPct}%, ${st.yPct}%) [Step ${endStep}]:</strong> Rubber-banded <strong>${adjusted}</strong> intermediate PDR breadcrumb(s) onto floorplan!`);
}

function loadWalkthroughVideoFile(inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  if (livePdrActive) toggleLivePdrWalk();
  const video = document.getElementById("walkVideoPlayer");
  video.srcObject = null;
  video.src = URL.createObjectURL(file);
  video.style.display = "block";
  showBannerToast(`🎥 <strong>Walkthrough Video Loaded (${escapeHtml(file.name)}):</strong> Play/pause at any doorway sign or nameplate and tap <strong>⚡ Snap Sharp Crumb</strong>!`);
}

async function grabLiveVideoKeyframe() {
  const video = document.getElementById("walkVideoPlayer");
  let sharpness = 180.0;
  let thumbUrl = null;
  let tSec = pdrSteps.length;

  if (video && (video.src || video.srcObject) && video.videoWidth > 0) {
    const maxW = 640;
    const scale = maxW / Math.max(1, video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = maxW;
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    sharpness = window.CSCDiscoveryAdapter.computeCanvasLaplacianSharpness(canvas);
    thumbUrl = canvas.toDataURL("image/jpeg", 0.82);
    if (!livePdrActive) tSec = Math.round(video.currentTime * 10) / 10;
  }

  const mins = String(Math.floor(tSec / 60)).padStart(2, "0");
  const secs = String(Math.floor(tSec % 60)).padStart(2, "0");
  const timeFmt = livePdrActive ? `S-${pdrSteps.length}` : `${mins}:${secs}`;

  const signText = document.getElementById("videoSignInput").value.trim() || `CRUMB @ ${timeFmt}`;
  const narrText = document.getElementById("videoNarrInput").value.trim() || `Captured on ${state.activeFloorId}`;

  const st = getActiveStation();
  let xPct = Number(Math.min(95, st.xPct + 2.5).toFixed(1));
  let yPct = st.yPct;

  if (pdrAnchorA && pdrAnchorA.floorId === state.activeFloorId && pdrSteps.length > pdrAnchorA.stepIdx) {
    // Project step vector along compass heading until Anchor B rubber-bands it!
    const deltaSteps = pdrSteps.length - pdrAnchorA.stepIdx;
    const hdg = currentCompassDeg !== null ? currentCompassDeg : 90;
    const rad = ((hdg - 90) * Math.PI) / 180;
    xPct = Number(Math.max(3, Math.min(96, pdrAnchorA.xPct + deltaSteps * 0.9 * Math.cos(rad))).toFixed(1));
    yPct = Number(Math.max(4, Math.min(94, pdrAnchorA.yPct + deltaSteps * 0.9 * Math.sin(rad))).toFixed(1));
  } else if (!livePdrActive && video && video.duration) {
    const tA = parseFloat(document.getElementById("interpTa").value) || 0;
    const tB = parseFloat(document.getElementById("interpTb").value) || Math.max(60, video.duration || 120);
    const ratio = Math.max(0.05, Math.min(0.95, (tSec - tA) / Math.max(1, tB - tA)));
    xPct = Number((18.0 + ratio * (76.0 - 18.0)).toFixed(1));
    yPct = Number((32.0 + Math.sin(ratio * Math.PI) * 4.0).toFixed(1));
  }

  if (sharpness < 65.0) {
    showBannerToast(`⚠️ <strong>Motion Blur Warning ($\\nabla^2 I = ${sharpness}$ &lt; 65):</strong> Hold steady for 1 second for crisp OCR!`, true);
  }

  const kfId = `KF-${String(state.videoKeyframes.length + 1).padStart(3, "0")}`;
  if (thumbUrl) {
    await window.CSCDiscoveryAdapter.saveMediaBlob(`videokf::${state.sessionId}::${kfId}`, thumbUrl);
  }

  state.videoKeyframes.push({
    id: kfId,
    floorId: state.activeFloorId,
    timeSec: tSec,
    stepIdx: pdrSteps.length,
    timeFmt,
    sharpness,
    signOcr: signText.toUpperCase(),
    narration: narrText,
    xPct,
    yPct,
    action: `Mapped (${sharpness}) -> (${xPct}%, ${yPct}%)`
  });

  document.getElementById("videoSignInput").value = "";
  document.getElementById("videoNarrInput").value = "";
  persistWalkState();
  renderInteractiveMap();
  renderVideoTab();
}

function renderVideoTab() {
  const sEl = document.getElementById("pdrStepCountEl");
  if (sEl) sEl.textContent = String(pdrSteps.length);
  const tbody = document.getElementById("videoKeyframesBody");
  tbody.innerHTML = (state.videoKeyframes || []).map((k) => `
    <tr>
      <td><strong>${escapeHtml(k.id)}</strong> (${escapeHtml(k.timeFmt)})<br/><small>${escapeHtml(k.floorId || 'FLR-02')}</small></td>
      <td><code>${k.sharpness}</code><br/><small style="color:${k.sharpness >= 85 ? '#2dd4bf' : '#f59e0b'};">${k.sharpness >= 85 ? 'Sharp' : 'Soft'}</small></td>
      <td><strong>${escapeHtml(k.signOcr)}</strong></td>
      <td><em>"${escapeHtml(k.narration)}"</em></td>
      <td>(${k.xPct}%, ${k.yPct}%)<br/><strong>${escapeHtml(k.action)}</strong></td>
    </tr>
  `).join("");
  runLinearInterpolatorDemo();
}

function runLinearInterpolatorDemo() {
  const tA = parseFloat(document.getElementById("interpTa").value) || 0;
  const tB = parseFloat(document.getElementById("interpTb").value) || 96;
  const tTarget = parseFloat(document.getElementById("interpTarget").value) || 48;
  const xA = pdrAnchorA ? pdrAnchorA.xPct : 18.0;
  const yA = pdrAnchorA ? pdrAnchorA.yPct : 32.0;
  const st = getActiveStation();
  const xB = st ? st.xPct : 68.0;
  const yB = st ? st.yPct : 28.0;

  const ratio = Math.max(0, Math.min(1, (tTarget - tA) / Math.max(1, tB - tA)));
  const xOut = (xA + ratio * (xB - xA)).toFixed(1);
  const yOut = (yA + ratio * (yB - yA)).toFixed(1);
  const pct = Math.round(ratio * 100);

  const box = document.getElementById("interpResultBox");
  if (box) {
    box.innerHTML = `
      <strong>📍 Deterministic Step/Time Corridor Interpolation:</strong>
      Capture at <code>${tTarget}</code> sits at <strong>${pct}%</strong> between Anchor A <code>(${xA}%, ${yA}%)</code> &amp; Active Station <code>(${xB}%, ${yB}%)</code> &rarr;
      <strong>(${xOut}%, ${yOut}%)</strong>
    `;
  }
}

// ============================================================================
// 6. TAB 5 & GLOBAL FLOATING HOLD-TO-TALK MIC PILL (BUG-10 FIXED!)
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
  // If user pressed-and-held (>420ms), releasing stops & saves immediately; if short tap, acts as toggle!
  if (heldMs > 420 && isRecordingAudio) {
    toggleWalkTalkMic();
  }
}

function _syncMicButtonsUI() {
  const btn = document.getElementById("micToggleBtn");
  const status = document.getElementById("micStatusText");
  const pill = document.getElementById("floatingPttPill");
  const pillLbl = document.getElementById("pttPillLabel");
  const st = getActiveStation();

  if (isRecordingAudio) {
    if (btn) {
      btn.className = "btn btn-danger";
      btn.innerHTML = "⏹️ Stop & Save Clip to Station";
    }
    if (status) {
      status.innerHTML = `🔴 <strong>RECORDING 150Hz FILTERED AUDIO</strong> &rarr; Bound to <code>${escapeHtml(st.id)}</code>`;
    }
    if (pill) pill.classList.add("recording");
    if (pillLbl) pillLbl.textContent = `⏹️ Rec (${st.id})...`;
  } else {
    if (btn) {
      btn.className = "btn";
      btn.innerHTML = "🎙️ Start Walk-Talk Mic (150Hz Filter)";
    }
    if (status) {
      status.innerHTML = `🟢 Ready — ${state.cloudSpeechOptIn ? 'Cloud Speech Draft + ' : '100% Local '}IndexedDB Audio Store`;
    }
    if (pill) pill.classList.remove("recording");
    if (pillLbl) pillLbl.textContent = `🎙️ Note (${st.id})`;
    const mini = document.getElementById("pttMiniMeterFill");
    if (mini) mini.style.width = "0%";
  }
}

async function loadCachedAudioBlobs() {
  for (const seg of state.audioSegments) {
    if (seg.hasAudioBlob && !cachedAudioUrls[seg.id]) {
      const dataUrl = await window.CSCDiscoveryAdapter.loadMediaBlob(`audio::${state.sessionId}::${seg.id}`);
      if (dataUrl) cachedAudioUrls[seg.id] = dataUrl;
    }
  }
}

async function toggleWalkTalkMic() {
  const meterBar = document.getElementById("audioMeterBar");
  const miniMeter = document.getElementById("pttMiniMeterFill");

  if (!isRecordingAudio) {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      const AudioContextCls = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextCls();
      const source = audioCtx.createMediaStreamSource(mediaStream);

      // 150 Hz High-Pass Mechanical Room Fan/Chiller Rumble Filter
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
        if (meterBar) meterBar.style.width = pct;
        if (miniMeter) miniMeter.style.width = pct;
        meterRafId = requestAnimationFrame(updateMeter);
      };

      recordedChunks = [];
      const mime = (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
        ? "audio/webm;codecs=opus"
        : (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "");
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

          const noteEl = document.getElementById("quickVoiceNoteInput");
          const typedNote = noteEl ? noteEl.value.trim() : "";
          const finalTranscript = typedNote || liveSpeechBuffer.trim() || `[150Hz Filtered Audio Clip (${Math.round(blob.size / 1024)} KB) @ ${st.tag} — Bundled in .cscwalk.zip for Local faster-whisper]`;

          // BUG-10 FIX: Run deterministic RFI trigger scanner on recorded voice transcripts too!
          const rfiHits = extractRfiTriggersJS(finalTranscript);
          if (rfiHits.some((h) => h.includes("RFI-23-011"))) {
            state.rfi23011TempConditioningFlag = true;
            renderHeaderMeta();
          }
          const insightText = rfiHits.length > 0
            ? rfiHits.join(" + ")
            : `150Hz filtered audio bound to ${st.id} (${st.tag}).`;

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
          if (noteEl) noteEl.value = "";
          liveSpeechBuffer = "";
          persistWalkState();
          if (state.uiMode === "deep" && state.activeTab === "audio") renderAudioTab(st);
          showBannerToast(`🎙️ <strong>Saved Voice Note ${segId} &rarr; ${escapeHtml(st.id)}:</strong> ${escapeHtml(insightText)}`);
        };
        reader.readAsDataURL(blob);
      };

      // BUG-10 FIX: Only invoke browser cloud SpeechRecognition if user explicitly opted in!
      liveSpeechBuffer = "";
      if (state.cloudSpeechOptIn) {
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
              const inp = document.getElementById("quickVoiceNoteInput");
              if (inp) inp.value = txt.trim();
            };
            speechRec.start();
          } catch (e) {}
        }
      }

      mediaRecorder.start(500);
      isRecordingAudio = true;
      updateMeter();
      _syncMicButtonsUI();
    } catch (err) {
      showBannerToast(`⚠️ Microphone Permission / Hardware Notice: ${escapeHtml(err.message)}`, true);
    }
  } else {
    isRecordingAudio = false;
    cancelAnimationFrame(meterRafId);
    if (meterBar) meterBar.style.width = "0%";
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

function bookmarkAudioMoment() {
  const st = getActiveStation();
  const noteInput = document.getElementById("quickVoiceNoteInput");
  const customText = noteInput.value.trim();
  if (!customText) {
    alert("Type a quick site-pro note or tap the Mic button to record live audio!");
    return;
  }
  const nowStr = new Date().toTimeString().slice(0, 8);
  const hits = extractRfiTriggersJS(customText);
  if (hits.some((h) => h.includes("RFI-23-011"))) {
    state.rfi23011TempConditioningFlag = true;
    renderHeaderMeta();
  }
  const autoInsight = hits.length > 0 ? hits.join(" + ") : `Pinned directly to ${st.id} (${st.tag}).`;

  state.audioSegments.unshift({
    id: `AUD-${String(state.audioSegments.length + 1).padStart(2, "0")}`,
    time: nowStr,
    speaker: state.siteContact || window.CSCDiscoveryAdapter.getActiveUser().name,
    stationId: st.id,
    bookmarked: true,
    hasAudioBlob: false,
    text: customText,
    insight: autoInsight
  });
  noteInput.value = "";
  persistWalkState();
  renderAudioTab(st);
}

async function renderAudioTab(st) {
  document.getElementById("audioConsentCheck").checked = Boolean(state.verbalConsentLogged);
  document.getElementById("cloudSpeechCheck").checked = Boolean(state.cloudSpeechOptIn);
  document.getElementById("siteContactQuickInput").value = state.siteContact || "";
  _syncMicButtonsUI();
  await loadCachedAudioBlobs();
  const tbody = document.getElementById("audioLogBody");
  tbody.innerHTML = state.audioSegments.map((seg) => {
    const audioPlayerHtml = cachedAudioUrls[seg.id]
      ? `<audio controls src="${cachedAudioUrls[seg.id]}" style="height:28px;max-width:210px;margin-top:5px;display:block;"></audio>`
      : "";
    return `
      <tr style="${seg.stationId === st.id ? 'background:rgba(13,148,136,0.14);' : ''}">
        <td><strong>${escapeHtml(seg.id)}</strong> (${escapeHtml(seg.time)})<br/><small>${seg.bookmarked ? '📌 PINNED' : '⏱️ AUTO'}</small></td>
        <td><strong>${escapeHtml(seg.speaker)}</strong><br/>Station: <code>${escapeHtml(seg.stationId)}</code></td>
        <td><em>"${escapeHtml(seg.text)}"</em>${audioPlayerHtml}</td>
        <td><strong style="color:var(--accent-teal);">${escapeHtml(seg.insight)}</strong></td>
      </tr>
    `;
  }).join("");
}

// ============================================================================
// 7. TAB 6: DETERMINISTIC VALVE (FAIL-OPEN) / DAMPER / UNIFIED VA / LABOR SIZERS
// ============================================================================
let lastCalcSnapshot = null;

function renderCalculatorsTab() {
  runFieldCalculators();
}

function runFieldCalculators() {
  // 1. Hydronic Control Valve Sizer (BUG-06 FIX: Fail-Open Heating Spring-Return + Small VAV Cv + PICCV!)
  const appMode = document.getElementById("calcValveApp").value || "heating";
  const gpm = Math.max(0.2, parseFloat(document.getElementById("calcGpm").value) || 42.0);
  const lineSz = parseFloat(document.getElementById("calcPipeSize").value) || 2.0;
  const sg = parseFloat(document.getElementById("calcFluidSg").value) || 1.032;
  const coilDp = Math.max(0.5, parseFloat(document.getElementById("calcCoilDp").value) || 4.0);
  const usePiccv = document.getElementById("calcUsePiccv").checked;
  const designDp = 4.5;
  const theoCv = gpm * Math.sqrt(sg / designDp);

  // Commercial Belimo table from 0.4 Cv VAV reheat up to 65 Cv AHU mains
  const belimoTable = [
    { cv: 0.4, sz: 0.5, body: "B207", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 0.8, sz: 0.5, body: "B208", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 1.2, sz: 0.5, body: "B209", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 1.9, sz: 0.5, body: "B210", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 3.0, sz: 0.5, body: "B211", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 4.7, sz: 0.5, body: "B213", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 7.4, sz: 0.75, body: "B218", sr: "LF24-SR", nsr: "LRB24-SR" },
    { cv: 10.0, sz: 1.0, body: "B223", sr: "NFB24-SR", nsr: "NRB24-SR" },
    { cv: 14.0, sz: 1.0, body: "B224", sr: "NFB24-SR", nsr: "NRB24-SR" },
    { cv: 19.0, sz: 1.25, body: "B230", sr: "NFB24-SR", nsr: "NRB24-SR" },
    { cv: 24.0, sz: 1.5, body: "B239", sr: "NFB24-SR", nsr: "NRB24-SR" },
    { cv: 29.0, sz: 1.5, body: "B240", sr: "NFB24-SR", nsr: "NRB24-SR" },
    { cv: 37.0, sz: 2.0, body: "B249", sr: "AFB24-SR", nsr: "ARB24-SR" },
    { cv: 46.0, sz: 2.0, body: "B250", sr: "AFB24-SR", nsr: "ARB24-SR" },
    { cv: 65.0, sz: 2.5, body: "B261", sr: "AFB24-SR", nsr: "ARB24-SR" }
  ];

  let sel = belimoTable[belimoTable.length - 1];
  for (const v of belimoTable) {
    if (v.cv >= theoCv) { sel = v; break; }
  }
  const actModel = appMode === "heating" ? `${sel.sr} (Fail-Open Spring-Return)` : `${sel.nsr} (Non-Spring Modulating)`;
  const fullValveModel = usePiccv
    ? `Belimo ePIV / PICCV (${sel.sz}", ${gpm} GPM) + ${actModel}`
    : `Belimo ${sel.body} + ${actModel}`;
  const actualDp = usePiccv ? 5.0 : sg * Math.pow(gpm / sel.cv, 2);
  const beta = usePiccv ? 1.0 : actualDp / (actualDp + coilDp);
  const needsReducer = sel.sz < lineSz;

  document.getElementById("valveCalcOutput").innerHTML = `
    <strong>💧 Deterministic Valve Sizing (${appMode === 'heating' ? 'Freeze-Safe Fail-Open per RFI-23-007' : 'Cooling'}):</strong><br/>
    • Theo Cv: <code>${theoCv.toFixed(2)}</code> &rarr; Selection: <strong>${escapeHtml(fullValveModel)} (Cv = ${usePiccv ? 'PICCV' : sel.cv}, Body: ${sel.sz}")</strong><br/>
    • Actual ΔP: <code>${actualDp.toFixed(2)} psi</code> | Authority β: <code>${beta.toFixed(2)}</code> ${beta >= 0.50 ? '✅ (&ge;0.50 Compliant)' : '⚠️ (&lt;0.50 — Check PICCV Box!)'}<br/>
    • <strong>Div 23 21 13 Note:</strong> ${needsReducer ? `Furnish ${sel.sz}" valve; Div 23 21 13 installs <strong>${lineSz}" x ${sel.sz}" concentric reducers</strong> per RFI-23-005.` : `Line-sized ${sel.sz}" body installed inline by Div 23 21 13.`}
  `;

  // 2. Damper Area & Belimo Torque Sizer (Phase 2 — RFI-23-004)
  const dW = Math.max(6, parseFloat(document.getElementById("calcDmpW").value) || 48);
  const dH = Math.max(6, parseFloat(document.getElementById("calcDmpH").value) || 30);
  const dApp = document.getElementById("calcDmpApp").value || "oa_ea_failsafe";
  const tPerSqft = parseFloat(document.getElementById("calcDmpTorqueFactor").value) || 6.0;
  const areaSqft = (dW * dH) / 144.0;
  const reqInLb = areaSqft * tPerSqft * 1.25; // 25% safety margin
  const isSpring = dApp === "oa_ea_failsafe";

  let dmpAct = "";
  let dmpQty = 1;
  if (isSpring) {
    if (reqInLb <= 35) dmpAct = "Belimo LF24-SR (35 in-lb Spring-Return)";
    else if (reqInLb <= 90) dmpAct = "Belimo NFB24-SR (90 in-lb Spring-Return)";
    else if (reqInLb <= 180) dmpAct = "Belimo AFB24-SR (180 in-lb Spring-Return)";
    else {
      dmpQty = Math.ceil(reqInLb / 180);
      dmpAct = `(${dmpQty}) Belimo AFB24-SR (180 in-lb ea on Split Jackshaft)`;
    }
  } else {
    if (reqInLb <= 45) dmpAct = "Belimo LMB24-SR (45 in-lb Non-Spring)";
    else if (reqInLb <= 90) dmpAct = "Belimo NMB24-SR (90 in-lb Non-Spring)";
    else if (reqInLb <= 180) dmpAct = "Belimo AMB24-SR (180 in-lb Non-Spring)";
    else {
      dmpQty = Math.ceil(reqInLb / 180);
      dmpAct = `(${dmpQty}) Belimo AMB24-SR (180 in-lb ea)`;
    }
  }

  document.getElementById("damperCalcOutput").innerHTML = `
    <strong>🌬️ Damper Torque Result (RFI-23-004):</strong> Area: <code>${areaSqft.toFixed(1)} ft²</code> (${dW}"x${dH}") | Design Torque (w/ 1.25x SF): <code>${reqInLb.toFixed(0)} in-lb</code> &rarr; <strong>${escapeHtml(dmpAct)}</strong>
  `;

  // 3. Unified TCP Panel 24VAC Class 2 Transformer Sizer (BUG-13 FIXED: Matches Backend Constants!)
  const optiCnt = parseInt(document.getElementById("calcOptiCount").value, 10) || 0;
  const znCnt = parseInt(document.getElementById("calcZnCount").value, 10) || 0;
  const xpioCnt = parseInt(document.getElementById("calcXpioCount").value, 10) || 0;
  const srCnt = parseInt(document.getElementById("calcSrActCount").value, 10) || 0;
  const nsrCnt = parseInt(document.getElementById("calcNsrActCount").value, 10) || 0;
  const zsCnt = parseInt(document.getElementById("calcZsCount").value, 10) || 0;

  const subVa = (optiCnt * 24) + (znCnt * 12) + (xpioCnt * 14) + (srCnt * 7) + (nsrCnt * 3) + (zsCnt * 1.5);
  const totalVa = subVa * 1.15;
  const xfmrs = Math.max(1, Math.ceil(totalVa / 80.0));

  document.getElementById("vaCalcOutput").innerHTML = `
    <strong>⚡ Unified TCP 24VAC Class 2 Sizer (RFI-23-009):</strong><br/>
    • Connected: <code>${subVa.toFixed(1)} VA</code> | With 15% Spare: <strong><code>${totalVa.toFixed(1)} VA</code></strong> (80.0 VA continuous max per 100VA Class 2 Xfmr)<br/>
    • <strong>Power Supply:</strong> <strong style="color:#f59e0b;">Furnish (${xfmrs}) 100VA 120/24VAC Class 2 Transformer(s)</strong> + Dedicated Div 26 120VAC 15A circuit.
  `;

  // 4. Physical Access & Rough-In Multiplier
  const fCeil = parseFloat(document.getElementById("calcCeilFactor").value) || 1.0;
  const fWall = parseFloat(document.getElementById("calcWallFactor").value) || 1.0;
  const fShift = parseFloat(document.getElementById("calcShiftFactor").value) || 1.0;
  const comp = (1.0 + (fCeil - 1.0) + (fWall - 1.0) + (fShift - 1.0)).toFixed(2);
  document.getElementById("laborCalcOutput").innerHTML = `
    <strong>👷 Composite Field Installation Labor Multiplier: <code>${comp}x</code></strong>
    (${comp >= 1.4 ? '⚠️ HIGH FRICTION — Include Wiremold / Lift / Off-Hours Allowance in Tier-1 Estimate' : '✅ Standard Rough-In Conditions'})
  `;

  lastCalcSnapshot = {
    valveSummary: `${fullValveModel} (${gpm} GPM, β=${beta.toFixed(2)})`,
    damperSummary: `${dmpAct} (${areaSqft.toFixed(1)} sqft)`,
    vaSummary: `${totalVa.toFixed(1)} VA (${xfmrs}x 100VA Xfmr)`,
    laborMultiplier: `${comp}x`
  };
}

function saveCalculatorsToActiveStation() {
  runFieldCalculators();
  if (!lastCalcSnapshot) return;
  const st = getActiveStation();
  st.calcSizing = JSON.parse(JSON.stringify(lastCalcSnapshot));
  const summaryTag = `[SIZED: ${lastCalcSnapshot.valveSummary} | ${lastCalcSnapshot.vaSummary} | Labor ${lastCalcSnapshot.laborMultiplier}]`;
  if (!(st.tierDelta || "").includes("[SIZED:")) {
    st.tierDelta = st.tierDelta ? `${st.tierDelta} ${summaryTag}` : summaryTag;
  }
  persistWalkState();
  renderStationStrip();
  showBannerToast(`💾 <strong>Saved Valve, Damper, VA &amp; ${lastCalcSnapshot.laborMultiplier} Labor Sizing to ${escapeHtml(st.id)}!</strong>`);
}

// ============================================================================
// 8. SESSION MANAGER, .CSCWALK.ZIP PACKAGER/UNPACKER & EXPORT BRIDGE
// ============================================================================
function openSessionManagerModal() {
  document.getElementById("newWalkProjectInput").value = state.projectName || "";
  document.getElementById("newWalkJobInput").value = state.jobNumber || "";
  document.getElementById("newWalkContactInput").value = state.siteContact || "";
  document.getElementById("newWalkAddressInput").value = state.siteAddress || "";
  document.getElementById("geminiApiKeyInput").value = window.CSCDiscoveryAdapter.getSecretKey("gemini_api_key");
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
  showBannerToast("💾 <strong>Project Metadata, Contacts &amp; Vault Settings Saved!</strong>");
}

function startBlankSiteWalk() {
  const proj = document.getElementById("newWalkProjectInput").value.trim() || "New Field Discovery Walk";
  const job = document.getElementById("newWalkJobInput").value.trim() || "CSC-26-NEW";
  const contact = document.getElementById("newWalkContactInput").value.trim() || "";
  const addr = document.getElementById("newWalkAddressInput").value.trim() || "";
  const sid = "CSC-WALK-" + Date.now();
  pdrSteps = [];
  pdrAnchorA = null;
  state = _migrateLoadedState({
    schemaVersion: "CSC-DISCOVERY-v2.0",
    sessionId: sid,
    projectName: proj,
    jobNumber: job,
    siteContact: contact,
    siteAddress: addr,
    verbalConsentLogged: false,
    cloudSpeechOptIn: false,
    uiMode: "quick",
    rfi23011TempConditioningFlag: false,
    activeFloorId: "FLR-01",
    activeStationId: "STN-01",
    activeTab: "checklist",
    showVideoCrumb: true,
    barometricHpa: 989.30,
    elevationFt: 0.0,
    floors: [
      { id: "FLR-BSMT", name: "Basement / Plant", elev: -14.0, hpa: 989.80, source: "Tap 'Snap Evac Map' or 'Load Plan' to anchor", hasCustomMap: false },
      { id: "FLR-01", name: "Floor 1", elev: 0.0, hpa: 989.30, source: "Tap 'Snap Evac Map' or 'Load Plan' to anchor", hasCustomMap: false },
      { id: "FLR-02", name: "Floor 2", elev: 14.0, hpa: 988.80, source: "Tap 'Snap Evac Map' or 'Load Plan' to anchor", hasCustomMap: false },
      { id: "FLR-ROOF", name: "Roof (GNSS+Compass)", elev: 28.0, hpa: 988.30, source: "Outdoor GNSS + Compass Mode", hasCustomMap: false }
    ],
    stations: [
      {
        id: "STN-01",
        tag: "RTU-01",
        archetype: "RTU_AHU",
        floorId: "FLR-01",
        room: "Main Mechanical Room",
        xPct: 50.0,
        yPct: 50.0,
        anchorType: "MANUAL_MAP_PIN",
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
  refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
  showBannerToast(`🆕 <strong>Started Clean Field Walk:</strong> ${escapeHtml(job)} — ${escapeHtml(proj)}`);
}

function resetToGoldenDemoWalk() {
  pdrSteps = [];
  pdrAnchorA = null;
  state = _migrateLoadedState(JSON.parse(JSON.stringify(GOLDEN_DEMO_STATE)));
  persistWalkState();
  closeSessionManagerModal();
  refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
  showBannerToast("🧪 <strong>Restored Lee's Summit West KC Golden Demo Walk (v2.0)!</strong>");
}

/**
 * Exports a complete self-contained `.cscwalk.zip` archive containing:
 *   - `manifest.json` (Full walk state)
 *   - `maps/<FLR>.jpg`
 *   - `photos/<SortedFilename>.jpg`
 *   - `keyframes/<KF>.jpg`
 *   - `audio/<AUD>.webm`
 */
async function exportFullWalkZipBundle() {
  const enc = new TextEncoder();
  const entries = [];
  const manifestCopy = JSON.parse(JSON.stringify(state));
  // Strip any huge inline base64 floor maps from manifestCopy since they go in `maps/`
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
  showBannerToast(`📦 <strong>Exported <code>${escapeHtml(outName)}</code> (${entries.length} bundled files)!</strong> Run <code>python run_discovery.py --input ${escapeHtml(outName)}</code> on PC to generate full Dossier PDF/DOCX/XLSX.`);
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

      // Hydrate maps/, photos/, keyframes/, audio/ into local IndexedDB!
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
    await refreshFloorMapBackground();
    await loadActiveStationBurstPhotos();
    renderAll(true);
    showBannerToast(`📥 <strong>Imported Walk Bundle (${escapeHtml(file.name)}):</strong> ${state.floors.length} floors &amp; ${state.stations.length} stations ready!`);
  } catch (err) {
    showBannerToast(`⚠️ Import Error: ${escapeHtml(err.message)}`, true);
  } finally {
    inputEl.value = "";
  }
}

async function exportScheduleCsv() {
  const rows = state.stations.map((st) => {
    const dec = decodeSerialDeterministic(st.mfg, st.serial, st.archetype, st.model);
    const mdl = decodeModelDeterministic(st.mfg, st.model);
    return {
      JobNumber: state.jobNumber,
      StationID: st.id,
      EquipmentTag: st.tag,
      Archetype: st.archetype,
      Floor: st.floorId,
      RoomZone: st.room,
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
      ThermistorCurve: st.thermistorCurve || "10k_TYPE_II",
      RecommendedALC: st.alcTarget,
      ScheduledQty: st.scheduledQty,
      ObservedQty: st.observedQty,
      ScopeDeltaNote: st.tierDelta
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
  const summaryText = `CSC Field Discovery (${state.jobNumber} — ${state.projectName}): ${state.stations.length} stations, ${state.audioSegments.length} audio notes.`;
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

function renderAll(skipAsyncMedia = false) {
  renderHeaderMeta();
  setUiMode(state.uiMode || "quick");
  renderFloorTabs();
  renderInteractiveMap();
  renderStationStrip();
  _syncMicButtonsUI();
  if (!skipAsyncMedia) {
    refreshFloorMapBackground();
    loadActiveStationBurstPhotos();
  }
}

window.openSessionManagerModal = openSessionManagerModal;

window.addEventListener("DOMContentLoaded", () => {
  loadInitialWalkState();
  renderAll(false);
});
