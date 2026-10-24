/**
 * CSC Site Discovery & Field Survey Companion — v1.0 Android RollupOS Ready
 * Full Hardware, Persistent Storage, CLAHE Vision, 150Hz WebAudio & Video Laplacian Mapper
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
        q: "Factory OEM microprocessor controller installed? (Symbio 700/800, ReliaTel, AAON VCCX2, Daikin MicroTech)",
        opts: ["Yes — BACnet Card Present", "Yes — Missing BACnet Card/License", "No — Electromechanical / Legacy DDC"],
        redFlag: "Yes — Missing BACnet Card/License",
        reminder: "CSC Overlay Standard (RFI-23-001): Never gut factory OEM controllers unless explicitly contracted! Flag Div 23 Mechanical Contractor to furnish/unlock factory BACnet interface prior to CSC startup."
      },
      {
        id: "CHK-AHU-02",
        cat: "Life-Safety & Freeze Protection (RFI-23-007)",
        q: "Hydronic coil serpentine freeze stat configuration?",
        opts: ["DPDT Manual-Reset Present", "SPST (Single-Pole) Only — Needs Upgrade", "Missing / Bypassed", "N/A (DX / Gas Only)"],
        redFlag: "SPST (Single-Pole) Only — Needs Upgrade",
        reminder: "CSC DPDT Freeze Stat Rule (RFI-23-007): Must use a DPDT manual-reset serpentine freeze stat across hydronic coils. Pole 1 breaks the hardwired VFD/starter safety circuit directly; Pole 2 wires to BAS DI for WebCTRL® alarm."
      },
      {
        id: "CHK-AHU-03",
        cat: "Life-Safety & Smoke Detection (RFI-23-007)",
        q: "Supply/Return duct smoke detector & auxiliary relay status?",
        opts: ["Present with Aux Form-C Dry Contact", "Present — No Spare Aux Contact", "Not Installed (By Div 28/26)", "N/A (<2,000 CFM)"],
        redFlag: "Present — No Spare Aux Contact",
        reminder: "Trade Delineation (RFI-23-007): Div 28/26 furnishes, mounts, and wires duct smoke detectors and hardwired fan shutdown relay. CSC monitors auxiliary Form-C dry contact (DI) only."
      },
      {
        id: "CHK-AHU-04",
        cat: "Dampers & Actuators (RFI-23-004)",
        q: "OA / RA / EA damper blades, linkage & jackshaft condition?",
        opts: ["Smooth Operation — 1/2\" or 3/4\" Shaft", "Binding / Rusted Linkage (Div 23 Repair)", "Pneumatic Piston Actuator — Needs Belimo Retrofit", "UL555S Fire/Smoke Damper (120VAC by Div 26)"],
        redFlag: "Binding / Rusted Linkage (Div 23 Repair)",
        reminder: "Damper Boundary (RFI-23-004): Document seized/rusted damper linkages so Proposal excludes mechanical damper repair (by Div 23 33 00 Sheet Metal). Size Belimo spring-return actuators for OA/EA fail-safe close."
      },
      {
        id: "CHK-AHU-05",
        cat: "Duct Static Sensor Location (RFI-23-001)",
        q: "Main supply trunk accessible 2/3 downstream for Duct Static Pressure pickup?",
        opts: ["Accessible (Lay-in Ceiling)", "Hard Lid Drywall (Needs Access Door)", "Exposed Structure (>16 ft Lift Req'd)", "Single-Zone Unit (No Static Loop)"],
        redFlag: "Hard Lid Drywall (Needs Access Door)",
        reminder: "ASHRAE Guideline 36 / RFI-23-001: Mount duct static pressure sensor 2/3 down main supply trunk for Trim & Respond static reset."
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
        q: "VFD control terminal availability (Start/Stop DO, 0-10V Speed AO, Status/Fault DI)?",
        opts: ["Terminals Open & Available", "Currently Controlled via Network Only", "Legacy Drive — Needs Replacement"],
        redFlag: "Currently Controlled via Network Only",
        reminder: "CSC VFD Standard (RFI-23-006): Command Start/Stop (DO), Speed Reference (0-10VDC AO), and Run/Fault (DI) via HARDWIRED I/O so local HOA keypad works predictably. Configure BACnet MS/TP strictly as READ-ONLY for kW/Amps/Faults."
      },
      {
        id: "CHK-VFD-02",
        cat: "Series Hardware Safety Interlock Loop (RFI-23-006 / 007)",
        q: "Hardwired safety interlock terminal loop verified (Freeze, High-Static, Smoke, Damper End-Switch)?",
        opts: ["Series Safety Loop Intact", "Factory Jumper Only — Needs Safety Interlock", "High-Static Switch Missing"],
        redFlag: "Factory Jumper Only — Needs Safety Interlock",
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
        q: "Control valve retrofit strategy (Actuator-Only Linkage vs Full Inline Body Cut-In)?",
        opts: ["Belimo Retrofit Linkage (Reuse Body)", "New Valve Body / PICCV Cut-In by Div 23 21 13", "Existing Pneumatic Valve — Leaking Stem Packing"],
        redFlag: "Existing Pneumatic Valve — Leaking Stem Packing",
        reminder: "Piping Trade Matrix (RFI-23-005): Never mount a new electronic actuator on a leaking valve stem! CSC furnishes tagged control valves; Div 23 21 13 (Hydronic Piping) drains loop and installs inline bodies & concentric reducers."
      },
      {
        id: "CHK-HYD-02",
        cat: "Thermowells & DP Taps (RFI-23-005 / 010)",
        q: "Immersion thermowells & variable-flow remote index DP transmitter location?",
        opts: ["Wells Present + DP 2/3 Down Branch", "Missing Wells (Div 23 21 13 Must Weld Threadolets)", "DP Sensor at Pump Header Only (Needs 2/3 Relocation)"],
        redFlag: "Missing Wells (Div 23 21 13 Must Weld Threadolets)",
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
        q: "Chiller/Boiler factory communication interface & protocol?",
        opts: ["BACnet MS/TP Ready", "BACnet/IP Ready", "Modbus RTU (Map via Skill 2.4)", "Legacy LonWorks / Proprietary (Needs Gateway)"],
        redFlag: "Legacy LonWorks / Proprietary (Needs Gateway)",
        reminder: "Central Plant Overlay (RFI-23-001): Photograph exact gateway board model and map the 15-25 essential WebCTRL® read/write objects (Priority 8 supervisory reset vs Priority 16 relinquish default)."
      },
      {
        id: "CHK-PLT-02",
        cat: "Isolation Valves & Flow Proving",
        q: "Motorized isolation valve auxiliary end-switches & emergency shutoff?",
        opts: ["Aux End-Switches Present & Wired", "Missing Aux End-Switches", "Constant Primary Flow"],
        redFlag: "Missing Aux End-Switches",
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
        q: "Existing VAV actuator, damper shaft & airflow pickup condition?",
        opts: ["Legacy DDC VAV (Good Pickup Cross)", "Pneumatic Actuator (Convert to ALC ZN341v)", "Single-Point Pitot Tube (Fouled/Damaged)"],
        redFlag: "Pneumatic Actuator (Convert to ALC ZN341v)",
        reminder: "Pneumatic-to-DDC Note: Verify damper shaft diameter (3/8\" vs 1/2\"), check Normally Open vs Normally Closed blade action, and cap existing poly air lines."
      },
      {
        id: "CHK-VAV-02",
        cat: "Reheat & Line Power Check (RFI-23-009)",
        q: "Terminal reheat type & fan/control power availability?",
        opts: ["Hot Water Reheat Coil (2-Way Valve)", "Cooling Only", "Electric Reheat / FPB (277V/480V)", "Missing 24VAC Control Power"],
        redFlag: "Missing 24VAC Control Power",
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
        q: "Zone sensing variables & existing wall clutter?",
        opts: ["Temp Only (ZS Standard)", "Consolidate Temp + RH + CO2 into 1 ALC ZS Pro", "Pneumatic Stat (Needs Adapter Plate + Rnet Pull)"],
        redFlag: "Pneumatic Stat (Needs Adapter Plate + Rnet Pull)",
        reminder: "Zone Sensor Consolidation (RFI-23-008): Default to a single factory-integrated ALC ZS Pro multi-variable sensor on the digital Rnet bus rather than side-by-side wall boxes."
      },
      {
        id: "CHK-ZNS-02",
        cat: "Wall Surface & Raceway Multiplier",
        q: "Wall mounting surface & pathway to ceiling plenum?",
        opts: ["Drywall / Hollow Stud (Fishable 1.0x)", "CMU Block w/ Existing EMT Stub (1.0x)", "CMU / Brick — Surface Wiremold Raceway Req'd (1.40x)"],
        redFlag: "CMU / Brick — Surface Wiremold Raceway Req'd (1.40x)",
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
        q: "Dedicated 120VAC 15A circuit & 24VAC Class 2 transformer capacity?",
        opts: ["Dedicated 120VAC Present & Labeled", "Missing 120VAC Power (Div 26 By Others — RFI-23-009)", "Existing Transformer Overloaded (>80 VA on 100 VA)"],
        redFlag: "Existing Transformer Overloaded (>80 VA on 100 VA)",
        reminder: "Power & Derating Rule (RFI-23-009): Div 26 furnishes dedicated 120VAC 15A circuits to main TCPs. Enforce CSC's mandatory 80% NEC Art. 725 Class 2 derating rule (80 VA max continuous load per 100 VA transformer) + 15% spare."
      },
      {
        id: "CHK-TCP-02",
        cat: "Legacy Wiring & MS/TP Trunk Audit",
        q: "Existing panel wire labeling & RS-485 communication trunk topology?",
        opts: ["Labeled w/ Ferrules + Clean Daisy-Chain", "Unlabeled 'Rat's Nest' (High Point Ringout Labor)", "Star / T-Tap RS-485 Violation or Missing 120-Ohm EOL"],
        redFlag: "Unlabeled 'Rat's Nest' (High Point Ringout Labor)",
        reminder: "Panel Migration Warning: Unlabeled field terminations in legacy JCI N2 / Honeywell / Andover panels add ~15-20 mins per point for wire toning and verification."
      }
    ]
  }
];

const LEGACY_TO_ALC_RULES = [
  { match: "DX-9100", target: "ALC OptiFlex OF1628 + XPIO (Replaces JCI N2 Plant/AHU Controller)" },
  { match: "UNT", target: "ALC ZN341v / ZN551 (Replaces JCI N2 Unitary/VAV Box)" },
  { match: "VMA", target: "ALC ZN341v Integrated VAV Controller (Replaces JCI VMA)" },
  { match: "NAE", target: "ALC OptiFlex BACnet/IP Router + WebCTRL® Supervisory" },
  { match: "SPYDER", target: "ALC ZN551 / ZN341v (Replaces Honeywell Spyder LON/BACnet)" },
  { match: "EXCEL", target: "ALC OptiFlex OF1628 + XPIO (Replaces Honeywell XL50/100/500)" },
  { match: "SYMBIO", target: "CSC Hybrid Overlay: Hardwired Enable DO / Fault DI + BACnet MS/TP (RFI-23-001)" },
  { match: "VCCX", target: "CSC Hybrid Overlay: Retain AAON VCCX2 + BACnet MS/TP & Hardwired Safeties" },
  { match: "MICROTECH", target: "CSC Hybrid Overlay: Retain Daikin MicroTech + BACnet MS/TP & Hardwired Safeties" },
  { match: "PNEUMATIC", target: "Cap Poly Air Line -> ALC ZN341v / Belimo 24VAC Actuator + ALC ZS Pro Rnet Sensor" }
];

const GOLDEN_DEMO_STATE = {
  sessionId: "CSC-WALK-2026-LSW",
  projectName: "Lee's Summit West Science & PAC Retrofit",
  jobNumber: "CSC-26-4182",
  siteContact: "Danny Miller (Facilities) & Marcus Vance (Div 23)",
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
    { id: "FLR-02", name: "Floor 2 Science Wing", elev: 14.0, hpa: 988.86, source: "Narrated Video Walk + M-102 Plan", hasCustomMap: false },
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
      ocrConf: 0.94,
      ambiguousNote: "",
      scheduledQty: 1,
      observedQty: 1,
      tierDelta: "Upgrade existing SPST freeze stat to DPDT per RFI-23-007 + retrofit pneumatic damper actuators",
      burstMeta: {},
      checks: {
        "CHK-AHU-01": "No — Electromechanical / Legacy DDC",
        "CHK-AHU-02": "SPST (Single-Pole) Only — Needs Upgrade",
        "CHK-AHU-03": "Present with Aux Form-C Dry Contact",
        "CHK-AHU-04": "Pneumatic Piston Actuator — Needs Belimo Retrofit",
        "CHK-AHU-05": "Accessible (Lay-in Ceiling)"
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
      tag: "VAV-204..220 (Science Wing VAVs)",
      archetype: "VAV_TERMINAL",
      floorId: "FLR-02",
      room: "Corridor 200 outside Science Lab 204",
      xPct: 48.0,
      yPct: 32.0,
      anchorType: "TIME_INTERPOLATED_VIDEO_CRUMB",
      mfg: "Titus",
      model: "DESV-10-HW",
      serial: "T04-8821B",
      elec: "24VAC Class 2 (1,150 CFM / 3.5 GPM HW Coil)",
      legacyCtrl: "Pneumatic Piston Actuator + JCI UNT1108",
      alcTarget: "ALC ZN341v Integrated VAV + ALC ZS Pro Sensor",
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
        "CHK-AHU-05": "Single-Zone Unit (No Static Loop)"
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
      ocrConf: 0.95,
      ambiguousNote: "",
      scheduledQty: 1,
      observedQty: 1,
      tierDelta: "RFI-23-009 VA RULE: 94.3 VA design load exceeds single 100VA transformer 80VA NEC Art. 725 limit -> require Dual 100VA Class 2 Xfmrs",
      burstMeta: {},
      checks: {
        "CHK-TCP-01": "Existing Transformer Overloaded (>80 VA on 100 VA)",
        "CHK-TCP-02": "Unlabeled 'Rat's Nest' (High Point Ringout Labor)"
      }
    }
  ],
  videoKeyframes: [
    { id: "KF-001", timeSec: 8, timeFmt: "00:08", sharpness: 312.4, signOcr: "STAIR B — FLOOR 2 EAST", narration: "Stepping out of Stair B onto the second floor science corridor, heading East.", xPct: 18.0, yPct: 32.0, action: "Anchor [ANC-201: Stair B]" },
    { id: "KF-002", timeSec: 52, timeFmt: "00:52", sharpness: 248.9, signOcr: "SCIENCE LAB 204", narration: "Outside Science Lab 204, ceiling tile popped—that's VAV-204 with an old pneumatic actuator and JCI N2 box. CMU block walls inside.", xPct: 48.0, yPct: 32.0, action: "Interpolated & Pinned [STN-03: VAV-204] at 45% corridor path" },
    { id: "KF-003", timeSec: 96, timeFmt: "01:36", sharpness: 389.1, signOcr: "ROOM 204-M — MECH EQUIP ROOM", narration: "Entering Mechanical Room 204-M at the East end of the hall.", xPct: 68.0, yPct: 28.0, action: "Anchor [ANC-202: Mech Rm 204 Door]" },
    { id: "KF-004", timeSec: 128, timeFmt: "02:08", sharpness: 445.0, signOcr: "AHU-2 / TRANE CSAA035UAA00", narration: "Holding steady on the AHU-2 nameplate for 3 seconds... single-pole freeze stat and ABB ACH580 supply fan drive.", xPct: 74.5, yPct: 32.0, action: "Extracted Sharp Nameplate Frame -> Linked to [STN-01: AHU-2]" }
  ],
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
let cachedAudioUrls = {};

// Live Sensor Handles (Android GNSS + Magnetometer Compass)
let liveSensorsActive = false;
let geoWatchId = null;
let currentGps = null; // { lat, lon, acc, alt }
let currentCompassDeg = null;

// Live WebAudio 150Hz High-Pass Recorder Handles
let audioCtx = null;
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let meterRafId = null;
let speechRec = null;
let liveSpeechBuffer = "";
let isRecordingAudio = false;

function persistWalkState() {
  if (!state) return;
  window.CSCDiscoveryAdapter.writeState("active_walk_v1", state);
}

function loadInitialWalkState() {
  const saved = window.CSCDiscoveryAdapter.readState("active_walk_v1", null);
  if (saved && saved.stations && Array.isArray(saved.stations)) {
    state = saved;
  } else {
    state = JSON.parse(JSON.stringify(GOLDEN_DEMO_STATE));
    persistWalkState();
  }
}

// Deterministic Serial Vintage Decoder
function decodeSerialDeterministic(mfg, serial) {
  const m = (mfg || "").toUpperCase().trim();
  const s = (serial || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  let year = null;
  let period = "Standard Production";
  let rule = "Prefix / Pattern Lookup";

  const mTraneMod = s.match(/^(\d{2})(\d{2})\d{5}[A-Z]$/);
  if (m.includes("TRANE") && mTraneMod) {
    const yy = parseInt(mTraneMod[1], 10);
    const ww = parseInt(mTraneMod[2], 10);
    if (yy >= 10 && yy <= 26) {
      year = 2000 + yy;
      period = `Week ${ww}`;
      rule = "Trane Modern YYWW Serial";
    }
  }

  const traneMonths = { A:"Jan", B:"Feb", C:"Mar", D:"Apr", E:"May", F:"Jun", G:"Jul", H:"Aug", J:"Sep", K:"Oct", L:"Nov", M:"Dec" };
  const mTraneLet = s.match(/^([A-Z])(\d{2})([A-M])\d+/);
  if (!year && m.includes("TRANE") && mTraneLet) {
    const yy = parseInt(mTraneLet[2], 10);
    year = yy <= 26 ? 2000 + yy : 1900 + yy;
    period = traneMonths[mTraneLet[3]] || mTraneLet[3];
    rule = "Trane Commercial Letter-Year-Month";
  }

  const m4Dig = s.match(/^(\d{2})(\d{2})\d{4,}/);
  if (!year && (m.includes("CARRIER") || m.includes("LOCHINVAR") || m.includes("YORK") || m.includes("DAIKIN")) && m4Dig) {
    const d1 = parseInt(m4Dig[1], 10);
    const d2 = parseInt(m4Dig[2], 10);
    if (d1 >= 10 && d1 <= 26 && d2 >= 1 && d2 <= 52) {
      year = 2000 + d1;
      period = `Week ${d2}`;
      rule = "YYWW 4-Digit Prefix";
    } else if (d2 >= 10 && d2 <= 26 && d1 >= 1 && d1 <= 52) {
      year = 2000 + d2;
      period = `Week ${d1}`;
      rule = "WWYY 4-Digit Prefix";
    }
  }

  const mAbb = s.match(/^\d(\d{2})(\d{2})\d{4,}/);
  if (!year && m.includes("ABB") && mAbb) {
    year = 2000 + parseInt(mAbb[1], 10);
    period = `Week ${parseInt(mAbb[2], 10)}`;
    rule = "ABB Country-YY-WW Serial";
  }

  const mHyph = s.match(/[A-Z]+-?(\d{2})-\d+/);
  if (!year && mHyph) {
    const yy = parseInt(mHyph[1], 10);
    year = yy <= 26 ? 2000 + yy : 1900 + yy;
    rule = "Prefix-YY-Sequence";
  }

  const age = year ? (2026 - year) : null;
  const eol = age !== null && age >= 18;
  return { year, period, age, eol, rule };
}

function matchLegacyControllerJS(legacyText) {
  const up = (legacyText || "").toUpperCase();
  for (const r of LEGACY_TO_ALC_RULES) {
    if (up.includes(r.match)) return r.target;
  }
  return null;
}

function getActiveStation() {
  return state.stations.find(s => s.id === state.activeStationId) || state.stations[0];
}

function showBannerToast(htmlMsg, isWarn = false) {
  const toast = document.getElementById("barometerToast");
  toast.className = isWarn ? "amber-callout" : "status-callout";
  toast.style.display = "block";
  toast.innerHTML = htmlMsg;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { toast.style.display = "none"; }, 5500);
}

// ============================================================================
// 1. REAL ANDROID GNSS GEOLOCATION & MAGNETOMETER COMPASS SENSORS
// ============================================================================
function degToCardinal(deg) {
  if (deg === null || deg === undefined || isNaN(deg)) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(((deg % 360) / 45)) % 8];
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

function toggleLiveSensors() {
  const btn = document.getElementById("sensorLockBtn");
  liveSensorsActive = !liveSensorsActive;

  if (liveSensorsActive) {
    btn.className = "btn btn-amber";
    btn.innerHTML = "📡 Sensors Active";
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
          showBannerToast(`⚠️ Android GPS Notice: ${err.message} (Indoor/Floor-Pin Fallback Active)`, true);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }
    window.addEventListener("deviceorientationabsolute", _handleOrientation, true);
    window.addEventListener("deviceorientation", _handleOrientation, true);
    updateSensorBadgeUI();
    showBannerToast("📡 <strong>Live Android GNSS + Magnetometer Compass Engaged:</strong> New rooftop/outdoor pins will automatically stamp real GPS coordinates &amp; camera compass heading!");
  } else {
    btn.className = "btn btn-secondary";
    btn.innerHTML = "📡 Lock GPS/Compass";
    if (geoWatchId !== null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(geoWatchId);
      geoWatchId = null;
    }
    window.removeEventListener("deviceorientationabsolute", _handleOrientation, true);
    window.removeEventListener("deviceorientation", _handleOrientation, true);
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
// 2. SPATIAL FLOOR MAP + REAL EVACUATION MAP IMAGE LOADER
// ============================================================================
async function refreshFloorMapBackground() {
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  cachedFloorMapDataUrl = await window.CSCDiscoveryAdapter.loadMediaBlob(key);
  renderInteractiveMap();
}

async function captureFloorEvacuationMap() {
  const img = await window.CSCDiscoveryAdapter.captureImage({ maxDim: 1600, quality: 0.85 });
  if (!img || !img.dataUrl) return;
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  await window.CSCDiscoveryAdapter.saveMediaBlob(key, img.dataUrl);
  const flr = state.floors.find(f => f.id === state.activeFloorId);
  if (flr) {
    flr.hasCustomMap = true;
    flr.source = `Custom Floor / Evacuation Map (${img.width}x${img.height})`;
  }
  cachedFloorMapDataUrl = img.dataUrl;
  persistWalkState();
  renderInteractiveMap();
  showBannerToast("🗺️ <strong>Custom Floor / Evacuation Map Anchored!</strong> Tap anywhere on your snapped map to pin HVAC &amp; controls stations.");
}

async function clearCustomFloorMap() {
  const key = `floor_map::${state.sessionId}::${state.activeFloorId}`;
  await window.CSCDiscoveryAdapter.deleteMediaBlob(key);
  const flr = state.floors.find(f => f.id === state.activeFloorId);
  if (flr) {
    flr.hasCustomMap = false;
    flr.source = "Schematic Vector Floor Grid";
  }
  cachedFloorMapDataUrl = null;
  persistWalkState();
  renderInteractiveMap();
}

function renderHeaderMeta() {
  const u = window.CSCDiscoveryAdapter.getActiveUser();
  document.getElementById("jobHeaderSub").textContent =
    `Job: ${state.jobNumber} — ${state.projectName} | User: ${u.name} (${u.container === 'ROLLUP_ANDROID_HUB' ? 'RollupOS Hub' : 'Standalone'})`;
  const rfi11Btn = document.getElementById("rfi11ToggleBtn");
  if (rfi11Btn) {
    rfi11Btn.className = state.rfi23011TempConditioningFlag ? "btn btn-danger" : "btn btn-secondary";
    rfi11Btn.innerHTML = state.rfi23011TempConditioningFlag
      ? "🚨 RFI-23-011 HARD-STOP ACTIVE (Temp Conditioning)"
      : "🛡️ Flag Temp Conditioning (RFI-23-011)";
  }
}

function toggleRfi23011HardStop() {
  state.rfi23011TempConditioningFlag = !state.rfi23011TempConditioningFlag;
  persistWalkState();
  renderHeaderMeta();
  if (state.rfi23011TempConditioningFlag) {
    showBannerToast(
      "🚨 <strong>CRITICAL RFI-23-011 (1B-6A) HARD-STOP LOGGED:</strong> Do NOT energize AHUs/RTUs during drywall sanding or finishes without signed Pre-Commissioning HVAC Operation RFI-23-011 confirming filter media, clean ductwork, and warranty start terms!",
      true
    );
  }
}

function renderFloorTabs() {
  const container = document.getElementById("floorTabs");
  container.innerHTML = state.floors.map(f => `
    <button class="tab-btn ${f.id === state.activeFloorId ? 'active' : ''}" onclick="selectFloor('${f.id}')">
      ${f.hasCustomMap ? '🖼️ ' : ''}${f.name} <small>(${f.elev >= 0 ? '+' : ''}${f.elev}ft)</small>
    </button>
  `).join("");
}

function selectFloor(floorId) {
  state.activeFloorId = floorId;
  const flr = state.floors.find(f => f.id === floorId);
  if (flr) {
    state.barometricHpa = flr.hpa;
    state.elevationFt = flr.elev;
  }
  const firstOnFloor = state.stations.find(s => s.floorId === floorId);
  if (firstOnFloor) state.activeStationId = firstOnFloor.id;
  persistWalkState();
  refreshFloorMapBackground();
  renderAll(true);
}

function simulateStairClimb(deltaFloors) {
  const idx = state.floors.findIndex(f => f.id === state.activeFloorId);
  const nextIdx = Math.max(0, Math.min(state.floors.length - 1, idx + deltaFloors));
  const nextFlr = state.floors[nextIdx];
  selectFloor(nextFlr.id);
  showBannerToast(
    `🧭 <strong>Barometric Altimeter Step:</strong> Pressure shifted to <code>${nextFlr.hpa.toFixed(2)} hPa</code> (ΔElevation ${nextFlr.elev >= 0 ? '+' : ''}${nextFlr.elev} ft) &rarr; Switched active map to <strong>${nextFlr.name}</strong>!`,
    true
  );
}

function renderInteractiveMap() {
  const flr = state.floors.find(f => f.id === state.activeFloorId) || state.floors[0];
  document.getElementById("mapSourceLabel").textContent = `${flr.name} | ${flr.source} | Tap map to drop Equipment Station Pin`;
  document.getElementById("baroReadout").textContent = `${state.barometricHpa.toFixed(2)} hPa (${state.elevationFt >= 0 ? '+' : ''}${state.elevationFt} ft)`;
  document.getElementById("clearMapBtn").style.display = cachedFloorMapDataUrl ? "inline-flex" : "none";

  const flrStations = state.stations.filter(s => s.floorId === flr.id);
  const svg = document.getElementById("floorMapSvg");

  let overlayHtml = `<rect x="10" y="10" width="980" height="360" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2"/>`;

  if (cachedFloorMapDataUrl) {
    overlayHtml += `
      <image href="${cachedFloorMapDataUrl}" x="10" y="10" width="980" height="360" preserveAspectRatio="xMidYMid slice" opacity="0.88"/>
      <rect x="10" y="10" width="980" height="360" rx="8" fill="rgba(2,6,23,0.18)" stroke="#0d9488" stroke-width="2"/>
    `;
  } else {
    overlayHtml += `
      <line x1="250" y1="10" x2="250" y2="370" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <line x1="620" y1="10" x2="620" y2="370" stroke="#1e293b" stroke-dasharray="6,6" stroke-width="2"/>
      <rect x="100" y="100" width="800" height="55" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="28" y="36" fill="#94a3b8" font-size="13" font-weight="bold">WEST WING / STAIR B</text>
      <text x="340" y="36" fill="#94a3b8" font-size="13" font-weight="bold">CENTRAL CORRIDOR &amp; LABS / ZONES</text>
      <text x="645" y="36" fill="#94a3b8" font-size="13" font-weight="bold">EAST MECHANICAL / PLANT ROOM</text>
      <text x="395" y="132" fill="#64748b" font-size="12" font-weight="bold">MAIN CIRCULATION CORRIDOR / CEILING PLENUM TRUNK</text>
    `;
  }

  if (flr.id === "FLR-02" && state.showVideoCrumb && state.videoKeyframes.length >= 2) {
    const pts = state.videoKeyframes.map(k => `${Math.round(k.xPct * 9.6 + 20)},${Math.round(k.yPct * 3.4 + 15)}`).join(" ");
    overlayHtml += `<polyline points="${pts}" fill="none" stroke="#14b8a6" stroke-width="4" stroke-dasharray="9,5"/>`;
    state.videoKeyframes.forEach(k => {
      const kx = Math.round(k.xPct * 9.6 + 20);
      const ky = Math.round(k.yPct * 3.4 + 15);
      overlayHtml += `
        <g onclick="event.stopPropagation(); switchTab('video');" style="cursor:pointer;">
          <circle cx="${kx}" cy="${ky}" r="7" fill="#0d9488" stroke="#ffffff" stroke-width="2"/>
          <text x="${kx - 30}" y="${ky - 12}" fill="#2dd4bf" font-size="11" font-weight="bold">🎥 ${k.timeFmt} (${(k.signOcr || '').slice(0,14)})</text>
        </g>
      `;
    });
  }

  flrStations.forEach(st => {
    const sx = Math.round(st.xPct * 9.6 + 20);
    const sy = Math.round(st.yPct * 3.4 + 15);
    const isSel = st.id === state.activeStationId;
    const isInterp = (st.anchorType || "").includes("INTERPOLATED");
    const hasCompass = typeof st.compassDeg === "number" || (st.anchorType || "").includes("COMPASS");

    if (hasCompass) {
      const deg = typeof st.compassDeg === "number" ? st.compassDeg : 270;
      const rad = ((deg - 90) * Math.PI) / 180;
      const len = 78;
      const spread = 0.38;
      const x1 = Math.round(sx + len * Math.cos(rad - spread));
      const y1 = Math.round(sy + len * Math.sin(rad - spread));
      const x2 = Math.round(sx + len * Math.cos(rad + spread));
      const y2 = Math.round(sy + len * Math.sin(rad + spread));
      overlayHtml += `<polygon points="${sx},${sy} ${x1},${y1} ${x2},${y2}" fill="rgba(56,189,248,0.24)" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4"/>`;
    }

    const fillCol = isSel ? "#0d9488" : (isInterp ? "#f59e0b" : "#2563eb");
    const shortTag = (st.tag || "EQ").split("(")[0].trim();
    overlayHtml += `
      <g onclick="event.stopPropagation(); selectStation('${st.id}');" style="cursor:pointer;">
        <circle cx="${sx}" cy="${sy}" r="${isSel ? 15 : 12}" fill="${fillCol}" stroke="#ffffff" stroke-width="${isSel ? 3.5 : 2}"/>
        <text x="${sx}" y="${sy + 4}" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">${st.id.replace("STN-0", "#").replace("STN-", "#")}</text>
        <rect x="${sx + 16}" y="${sy - 13}" width="${Math.max(105, shortTag.length * 7.5 + 16)}" height="24" rx="5" fill="#020617" stroke="${fillCol}" stroke-width="1.5"/>
        <text x="${sx + 23}" y="${sy + 3}" fill="#f8fafc" font-size="11.5" font-weight="bold">${shortTag}</text>
      </g>
    `;
  });

  svg.innerHTML = overlayHtml;
}

function handleMapClick(evt) {
  const svg = document.getElementById("floorMapSvg");
  const rect = svg.getBoundingClientRect();
  const relX = Math.max(2, Math.min(96, ((evt.clientX - rect.left) / rect.width) * 100));
  const relY = Math.max(4, Math.min(94, ((evt.clientY - rect.top) / rect.height) * 100));

  const newNum = state.stations.length + 1;
  const padNum = newNum < 10 ? `0${newNum}` : `${newNum}`;
  const newId = `STN-${padNum}`;
  const useGps = liveSensorsActive && (currentGps || currentCompassDeg !== null);

  const roomDesc = useGps
    ? `Pinned (${currentGps ? currentGps.lat + ', ' + currentGps.lon : 'Map'}${currentCompassDeg !== null ? ' | Heading ' + currentCompassDeg + '° ' + degToCardinal(currentCompassDeg) : ''})`
    : `Pinned on ${state.activeFloorId} (${relX.toFixed(1)}%, ${relY.toFixed(1)}%)`;

  const newStation = {
    id: newId,
    tag: `EQ-${padNum} (Tap to Rename)`,
    archetype: state.activeFloorId === "FLR-ROOF" ? "RTU_AHU" : "VAV_TERMINAL",
    floorId: state.activeFloorId,
    room: roomDesc,
    xPct: parseFloat(relX.toFixed(1)),
    yPct: parseFloat(relY.toFixed(1)),
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
    alcTarget: "ALC ZN341v / OptiFlex (Select Archetype or Type Legacy Ctrl)",
    ocrConf: 1.0,
    ambiguousNote: "",
    scheduledQty: 1,
    observedQty: 1,
    tierDelta: "Field pinned — verify against Tier-2 Mechanical Schedule",
    burstMeta: {},
    checks: {}
  };
  state.stations.push(newStation);
  state.activeStationId = newId;
  persistWalkState();
  loadActiveStationBurstPhotos();
  renderAll(true);
}

function deleteActiveStation() {
  if (state.stations.length <= 1) {
    alert("At least one station must remain in the walk session.");
    return;
  }
  const st = getActiveStation();
  state.stations = state.stations.filter(x => x.id !== st.id);
  state.activeStationId = state.stations[0].id;
  persistWalkState();
  loadActiveStationBurstPhotos();
  renderAll(true);
}

function renderStationStrip() {
  const strip = document.getElementById("stationStrip");
  strip.innerHTML = state.stations.map(st => {
    const qtyDiff = (Number(st.observedQty) || 0) - (Number(st.scheduledQty) || 0);
    const deltaDot = qtyDiff !== 0 ? `<span style="color:#f59e0b;font-weight:800;"> (Δ${qtyDiff > 0 ? '+' : ''}${qtyDiff})</span>` : "";
    return `
      <div class="station-pill ${st.id === state.activeStationId ? 'active' : ''}" onclick="selectStation('${st.id}')">
        <strong>${st.id}: ${(st.tag || '').split("(")[0]}${deltaDot}</strong>
        <small>${st.floorId} | ${(st.anchorType || '').replace(/_/g, " ")}</small>
      </div>
    `;
  }).join("");
}

function selectStation(stationId) {
  const st = state.stations.find(s => s.id === stationId);
  if (!st) return;
  const floorChanged = state.activeFloorId !== st.floorId;
  state.activeStationId = stationId;
  state.activeFloorId = st.floorId;
  persistWalkState();
  if (floorChanged) refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
}

function switchTab(tabName) {
  state.activeTab = tabName;
  persistWalkState();
  document.querySelectorAll(".inspector-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
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
    badge.innerHTML = `✅ <strong>Equipment Count Aligned (${st.observedQty} Found = ${st.scheduledQty} Scheduled)</strong> | ${st.tierDelta || 'No scope discrepancy noted.'}`;
  }
}

function renderActiveTabContent() {
  const st = getActiveStation();
  document.getElementById("stTagInput").value = st.tag || "";
  document.getElementById("stRoomInput").value = st.room || "";
  document.getElementById("stSchedQty").value = st.scheduledQty !== undefined ? st.scheduledQty : 1;
  document.getElementById("stObsQty").value = st.observedQty !== undefined ? st.observedQty : 1;
  document.getElementById("stDeltaNote").value = st.tierDelta || "";
  renderScopeDeltaStatus(st);

  if (state.activeTab === "checklist") renderChecklistTab(st);
  if (state.activeTab === "nameplate") renderNameplateTab(st);
  if (state.activeTab === "video") renderVideoTab();
  if (state.activeTab === "audio") renderAudioTab(st);
  if (state.activeTab === "calculators") renderCalculatorsTab();
}

// ============================================================================
// 3. TAB 1: CONTEXT-AWARE CHECKLISTS & LIVE RFI RED FLAGS
// ============================================================================
function renderChecklistTab(st) {
  const archSelect = document.getElementById("archetypeSelect");
  archSelect.innerHTML = ARCHETYPES.map(a => `
    <option value="${a.id}" ${a.id === st.archetype ? 'selected' : ''}>${a.label}</option>
  `).join("");

  const arch = ARCHETYPES.find(a => a.id === st.archetype) || ARCHETYPES[0];
  document.getElementById("defaultAlcBadge").textContent = arch.default_alc;

  const listEl = document.getElementById("checklistContainer");
  listEl.innerHTML = arch.items.map(item => {
    const chosen = (st.checks && st.checks[item.id]) || item.opts[0];
    const isRedFlag = chosen === item.redFlag;
    return `
      <div class="checklist-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:12px;color:var(--accent-teal);">${item.cat}</strong>
          <span style="font-size:10.5px;color:var(--text-muted);">${item.id}</span>
        </div>
        <div style="margin-top:4px;font-weight:600;font-size:13px;">${item.q}</div>
        <div class="chip-group">
          ${item.opts.map(opt => {
            const sel = opt === chosen;
            const rf = opt === item.redFlag;
            return `<button class="option-chip ${sel ? 'selected' : ''} ${sel && rf ? 'red-flag' : ''}"
                      onclick="setChecklistOption('${item.id}', '${opt.replace(/'/g, "\\'")}')">
                      ${rf ? '⚠️ ' : ''}${opt}
                    </button>`;
          }).join("")}
        </div>
        <div class="reminder-box">
          <strong>${isRedFlag ? '🚨 ACTIVE CSC RED-FLAG TRIGGERED:' : '💡 CSC Standard Reminder:'}</strong> ${item.reminder}
        </div>
      </div>
    `;
  }).join("");
}

function changeStationArchetype(newArchId) {
  const st = getActiveStation();
  st.archetype = newArchId;
  const arch = ARCHETYPES.find(a => a.id === newArchId);
  if (arch && (!st.alcTarget || st.alcTarget.includes("Select Archetype"))) {
    st.alcTarget = arch.default_alc;
  }
  persistWalkState();
  renderChecklistTab(st);
}

function setChecklistOption(itemId, optVal) {
  const st = getActiveStation();
  if (!st.checks) st.checks = {};
  st.checks[itemId] = optVal;
  persistWalkState();
  renderChecklistTab(st);
}

// ============================================================================
// 4. TAB 2: REAL 3-SLOT CAMERA BURST + CLAHE CONTRAST + GEMINI VISION / SERIAL
// ============================================================================
async function loadActiveStationBurstPhotos() {
  const st = getActiveStation();
  cachedSlotPhotos = { 1: null, 2: null, 3: null };
  for (const slot of [1, 2, 3]) {
    const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
    cachedSlotPhotos[slot] = await window.CSCDiscoveryAdapter.loadMediaBlob(key);
  }
  if (state.activeTab === "nameplate") renderBurstSlotsUI(st);
}

function _buildSortedFilename(st, slot) {
  const slotLabels = { 1: "01_Context", 2: "02_Nameplate", 3: "03_SubComponent" };
  const cleanTag = (st.tag || st.id).split("(")[0].trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return `${state.jobNumber}_${st.floorId}_${cleanTag}_${slotLabels[slot]}.jpg`;
}

async function captureStationBurstSlot(slot) {
  const st = getActiveStation();
  const img = await window.CSCDiscoveryAdapter.captureImage({ maxDim: 1440, quality: 0.86 });
  if (!img || !img.dataUrl) return;

  const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
  await window.CSCDiscoveryAdapter.saveMediaBlob(key, img.dataUrl);
  cachedSlotPhotos[slot] = img.dataUrl;

  if (!st.burstMeta) st.burstMeta = {};
  st.burstMeta[slot] = {
    filename: _buildSortedFilename(st, slot),
    capturedAt: img.capturedAt,
    claheEnhanced: false,
    sizeKB: img.sizeKB
  };
  persistWalkState();
  renderBurstSlotsUI(st);
}

async function applyClaheToBurstSlot(slot) {
  const src = cachedSlotPhotos[slot];
  if (!src) return;
  const st = getActiveStation();
  const enhanced = await window.CSCDiscoveryAdapter.enhanceStampedPlateDataUrl(src);
  const key = `photo::${state.sessionId}::${st.id}::slot${slot}`;
  await window.CSCDiscoveryAdapter.saveMediaBlob(key, enhanced);
  cachedSlotPhotos[slot] = enhanced;
  if (st.burstMeta && st.burstMeta[slot]) st.burstMeta[slot].claheEnhanced = true;
  persistWalkState();
  renderBurstSlotsUI(st);
  showBannerToast("🔦 <strong>CLAHE Stamped-Metal Contrast Enhancement Applied!</strong> Tap thumbnail to inspect zoomed crop.");
}

function openPhotoZoomModal(slot) {
  const src = cachedSlotPhotos[slot];
  if (!src) return;
  const st = getActiveStation();
  const meta = (st.burstMeta && st.burstMeta[slot]) || {};
  const modal = document.getElementById("photoZoomModal");
  document.getElementById("zoomModalTitle").textContent =
    `${st.id} (${st.tag}) — ${meta.filename || 'Captured Field Photo'}`;
  document.getElementById("zoomModalImg").src = src;
  modal.style.display = "flex";
}

async function runLiveVisionOcrOnSlot2() {
  const st = getActiveStation();
  const imgDataUrl = cachedSlotPhotos[2] || cachedSlotPhotos[3];
  if (!imgDataUrl) {
    alert("Snap or select a photo in Slot 2 (Unit Nameplate) or Slot 3 (Board/VFD) first!");
    return;
  }

  const apiKey = window.CSCDiscoveryAdapter.getSecretKey("gemini_api_key");
  if (!apiKey) {
    showBannerToast(
      "📦 <strong>Offline Queue Saved:</strong> Photo is stored locally in IndexedDB for PC sync! (Tip: Add a Gemini API Key in <code>⚙️ Walk / Vault</code> if you want live rooftop Vision OCR on your phone.)",
      true
    );
    openSessionManagerModal();
    return;
  }

  const btn = document.getElementById("liveOcrBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Reading Plate via Gemini Vision...";

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
      const autoAlc = matchLegacyControllerJS(st.legacyCtrl);
      if (autoAlc) st.alcTarget = autoAlc;
    }
    st.ocrConf = typeof parsed.confidence === "number" ? parsed.confidence : 0.9;
    st.ambiguousNote = parsed.ambiguous_note || "";
    persistWalkState();
    renderNameplateTab(st);
    showBannerToast("✅ <strong>Live Vision Nameplate OCR Complete!</strong> Deterministic serial vintage &amp; ALC cross-ref updated.");
  } catch (err) {
    showBannerToast(`⚠️ Live OCR unreachable (${err.message}) — Photo safely queued in local IndexedDB for offline sync!`, true);
  } finally {
    btn.disabled = false;
    btn.textContent = "🤖 Auto-Read Plate (Live Vision / Offline Queue)";
  }
}

function renderBurstSlotsUI(st) {
  const titles = {
    1: { title: "1️⃣ Wide Context Shot", sub: "Room/Curb access & piping" },
    2: { title: "2️⃣ Unit Nameplate", sub: "Primary Equipment Data Plate" },
    3: { title: "3️⃣ Sub-Component", sub: "VFD / OEM Board / Valve Tag" }
  };
  const container = document.getElementById("burstSlotsContainer");
  if (!container) return;

  container.innerHTML = [1, 2, 3].map(slot => {
    const url = cachedSlotPhotos[slot];
    const meta = (st.burstMeta && st.burstMeta[slot]) || null;
    return `
      <div class="burst-card" style="${slot === 2 ? 'border-color:var(--accent-teal);' : ''}">
        <div>
          <strong>${titles[slot].title}</strong><br/>
          <small style="color:var(--text-muted);">${meta ? meta.filename : titles[slot].sub}</small>
        </div>
        ${url
          ? `<img src="${url}" class="burst-thumb" onclick="openPhotoZoomModal(${slot})" title="Tap to zoom full nameplate crop" />`
          : `<div style="height:82px;display:flex;align-items:center;justify-content:center;background:var(--bg-main);border-radius:6px;color:var(--text-muted);font-size:11px;">No Photo Captured</div>`
        }
        <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
          <button class="btn ${slot === 2 ? '' : 'btn-secondary'}" style="font-size:11px;padding:5px 8px;min-height:30px;" onclick="captureStationBurstSlot(${slot})">
            📸 ${url ? 'Retake' : 'Snap'}
          </button>
          ${url ? `<button class="btn btn-amber" style="font-size:11px;padding:5px 8px;min-height:30px;" onclick="applyClaheToBurstSlot(${slot})" title="Enhance sun-faded stamped metal contrast">🔦 CLAHE</button>` : ''}
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
  const matched = matchLegacyControllerJS(val);
  if (matched) {
    document.getElementById("npAlcTarget").value = matched;
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
  if (saveNow) persistWalkState();

  const res = decodeSerialDeterministic(st.mfg, st.serial);
  const out = document.getElementById("serialDecodeOutput");
  out.className = res.eol ? "amber-callout" : "status-callout";
  out.innerHTML = `
    <div><strong>🔢 Deterministic Serial Nomenclature &amp; ALC Cross-Ref (${res.rule}):</strong></div>
    <div style="margin-top:4px;">
      • <strong>Decoded Manufacture Date:</strong> <code>${res.year ? res.year + ' (' + res.period + ')' : 'Enter Serial Prefix to Decode'}</code>
      | <strong>Equipment Age:</strong> <code>${res.age !== null ? res.age + ' Years Old' : 'N/A'}</code>
    </div>
    <div style="margin-top:4px;">
      • <strong>Service Life Status:</strong>
      ${res.eol
        ? '<strong style="color:#f59e0b;">⚠️ END-OF-LIFE RISK (&ge;18 YRS): Automatically adds Tier-1 Proposal exclusion for existing heat-exchanger, compressor, or seized valve body failure.</strong>'
        : '<strong style="color:#2dd4bf;">✅ Within normal ASHRAE mechanical service life window.</strong>'}
    </div>
    ${st.ocrConf < 0.85
      ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(245,158,11,0.4);">
           <strong>🔍 POL-IT-AI-001 Click-to-Verify Alert (${Math.round(st.ocrConf*100)}% OCR Confidence):</strong> ${st.ambiguousNote}
         </div>`
      : `<div style="margin-top:4px;font-size:11px;color:var(--text-muted);">✅ Confidence: ${Math.round((st.ocrConf || 1)*100)}% | Sorted Export Filename: <code>${_buildSortedFilename(st, 2)}</code></div>`}
  `;
}

// ============================================================================
// 5. TAB 3: REAL <VIDEO> WALKTHROUGH PLAYER & LAPLACIAN SHARPNESS KEYFRAME SLICER
// ============================================================================
function loadWalkthroughVideoFile(inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  const video = document.getElementById("walkVideoPlayer");
  video.src = URL.createObjectURL(file);
  video.style.display = "block";
  document.getElementById("videoGrabControls").style.display = "flex";
  showBannerToast(`🎥 <strong>Walkthrough Video Loaded (${file.name}):</strong> Play/pause at any doorway sign or equipment nameplate and tap <strong>⚡ Grab Sharp Keyframe</strong>!`);
}

async function grabLiveVideoKeyframe() {
  const video = document.getElementById("walkVideoPlayer");
  if (!video || !video.src || video.videoWidth === 0) {
    alert("Load or record a walkthrough video clip first!");
    return;
  }

  const maxW = 640;
  const scale = maxW / Math.max(1, video.videoWidth);
  const canvas = document.createElement("canvas");
  canvas.width = maxW;
  canvas.height = Math.round(video.videoHeight * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const sharpness = window.CSCDiscoveryAdapter.computeCanvasLaplacianSharpness(canvas);
  const tSec = Math.round(video.currentTime * 10) / 10;
  const mins = String(Math.floor(tSec / 60)).padStart(2, "0");
  const secs = String(Math.floor(tSec % 60)).padStart(2, "0");
  const timeFmt = `${mins}:${secs}`;

  const signText = document.getElementById("videoSignInput").value.trim() || `WAYPOINT @ ${timeFmt}`;
  const narrText = document.getElementById("videoNarrInput").value.trim() || `Captured video keyframe on ${state.activeFloorId}`;

  // Interpolate coordinate using current Tab 3 anchors
  const tA = parseFloat(document.getElementById("interpTa").value) || 0;
  const tB = parseFloat(document.getElementById("interpTb").value) || Math.max(60, video.duration || 120);
  const ratio = Math.max(0.05, Math.min(0.95, (tSec - tA) / Math.max(1, (tB - tA))));
  const xPct = Number((18.0 + ratio * (76.0 - 18.0)).toFixed(1));
  const yPct = Number((32.0 + Math.sin(ratio * Math.PI) * 6.0).toFixed(1));

  if (sharpness < 65.0) {
    showBannerToast(
      `⚠️ <strong>Motion Blur Warning (Laplacian $\\nabla^2 I = ${sharpness}$ &lt; 65):</strong> Frame looks blurry! Pause on a steady frame for 1–2 seconds for crisp nameplate/door OCR.`,
      true
    );
  }

  const kfId = `KF-00${state.videoKeyframes.length + 1}`;
  const thumbUrl = canvas.toDataURL("image/jpeg", 0.8);
  await window.CSCDiscoveryAdapter.saveMediaBlob(`videokf::${state.sessionId}::${kfId}`, thumbUrl);

  state.videoKeyframes.push({
    id: kfId,
    timeSec: tSec,
    timeFmt,
    sharpness,
    signOcr: signText.toUpperCase(),
    narration: narrText,
    xPct,
    yPct,
    action: sharpness >= 65 ? `Mapped Sharp Frame (${sharpness}) -> (${xPct}%, ${yPct}%)` : `Low Sharpness (${sharpness}) — Verify`
  });

  document.getElementById("videoSignInput").value = "";
  document.getElementById("videoNarrInput").value = "";
  persistWalkState();
  renderInteractiveMap();
  renderVideoTab();
}

function renderVideoTab() {
  const tbody = document.getElementById("videoKeyframesBody");
  tbody.innerHTML = state.videoKeyframes.map(k => `
    <tr>
      <td><strong>${k.id}</strong> (${k.timeFmt})</td>
      <td><code>${k.sharpness}</code><br/><small style="color:${k.sharpness >= 100 ? '#2dd4bf' : '#f59e0b'};">${k.sharpness >= 100 ? 'Sharp' : 'Moderate'}</small></td>
      <td><strong>${k.signOcr}</strong></td>
      <td><em>"${k.narration}"</em></td>
      <td>(${k.xPct}%, ${k.yPct}%)<br/><strong>${k.action}</strong></td>
    </tr>
  `).join("");
  runLinearInterpolatorDemo();
}

function runLinearInterpolatorDemo() {
  const tA = parseFloat(document.getElementById("interpTa").value) || 8;
  const tB = parseFloat(document.getElementById("interpTb").value) || 96;
  const tTarget = parseFloat(document.getElementById("interpTarget").value) || 52;
  const xA = 18.0, yA = 32.0;
  const xB = 68.0, yB = 28.0;

  const ratio = Math.max(0, Math.min(1, (tTarget - tA) / Math.max(1, (tB - tA))));
  const xOut = (xA + ratio * (xB - xA)).toFixed(1);
  const yOut = (yA + ratio * (yB - yA)).toFixed(1);
  const pct = Math.round(ratio * 100);

  document.getElementById("interpResultBox").innerHTML = `
    <strong>📍 Deterministic Walk-Path Interpolation Result:</strong><br/>
    Equipment captured at <code>t = ${tTarget}s</code> sits at <strong>${pct}% of the corridor distance</strong> between
    <em>Anchor A (${tA}s)</em> and <em>Anchor B (${tB}s)</em> &rarr;
    <strong>Mapped Floor Plan Coordinate: (${xOut}%, ${yOut}%)</strong>
  `;
}

// ============================================================================
// 6. TAB 4: REAL WEBAUDIO 150HZ HIGH-PASS RECORDER + SPEECH DRAFT + PLAYBACK
// ============================================================================
async function loadCachedAudioBlobs() {
  for (const seg of state.audioSegments) {
    if (seg.hasAudioBlob && !cachedAudioUrls[seg.id]) {
      const dataUrl = await window.CSCDiscoveryAdapter.loadMediaBlob(`audio::${state.sessionId}::${seg.id}`);
      if (dataUrl) cachedAudioUrls[seg.id] = dataUrl;
    }
  }
}

async function toggleWalkTalkMic() {
  const btn = document.getElementById("micToggleBtn");
  const status = document.getElementById("micStatusText");
  const meterBar = document.getElementById("audioMeterBar");

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
        const avg = sum / dataArray.length;
        meterBar.style.width = `${Math.min(100, Math.round(avg * 1.6))}%`;
        meterRafId = requestAnimationFrame(updateMeter);
      };

      recordedChunks = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : (MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "");
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
          const segId = `AUD-0${state.audioSegments.length + 1}`;
          await window.CSCDiscoveryAdapter.saveMediaBlob(`audio::${state.sessionId}::${segId}`, dataUrl);
          cachedAudioUrls[segId] = dataUrl;

          const typedNote = document.getElementById("quickVoiceNoteInput").value.trim();
          const finalTranscript = typedNote || liveSpeechBuffer.trim() || `[150Hz Filtered Audio Clip Recorded at ${st.tag} — Ready for Local Whisper Sync]`;
          state.audioSegments.unshift({
            id: segId,
            time: new Date().toTimeString().slice(0, 8),
            speaker: window.CSCDiscoveryAdapter.getActiveUser().name,
            stationId: st.id,
            bookmarked: true,
            hasAudioBlob: true,
            text: finalTranscript,
            insight: `Live 150Hz filtered audio bound to ${st.id} (${st.tag}).`
          });
          document.getElementById("quickVoiceNoteInput").value = "";
          liveSpeechBuffer = "";
          persistWalkState();
          renderAudioTab(st);
        };
        reader.readAsDataURL(blob);
      };

      // Optional Live Browser SpeechRecognition Draft (Android Chrome / Edge)
      const SpeechRecCls = window.SpeechRecognition || window.webkitSpeechRecognition;
      liveSpeechBuffer = "";
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
            document.getElementById("quickVoiceNoteInput").value = txt.trim();
          };
          speechRec.start();
        } catch (e) {}
      }

      mediaRecorder.start(1000);
      isRecordingAudio = true;
      updateMeter();

      btn.className = "btn btn-danger";
      btn.innerHTML = "⏹️ Stop & Save Clip to Station";
      status.innerHTML = `🔴 <strong>LIVE 150Hz HIGH-PASS RECORDING</strong> — Bound to <code>${getActiveStation().id}</code>`;
    } catch (err) {
      showBannerToast(`⚠️ Microphone Permission / Hardware Notice: ${err.message}`, true);
    }
  } else {
    isRecordingAudio = false;
    cancelAnimationFrame(meterRafId);
    meterBar.style.width = "0%";
    if (speechRec) {
      try { speechRec.stop(); } catch (e) {}
      speechRec = null;
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
    btn.className = "btn";
    btn.innerHTML = "🎙️ Start Walk-Talk Mic (150Hz Filter)";
    status.innerHTML = "🟢 Clip Saved to IndexedDB &amp; Bound to Active Station!";
  }
}

function bookmarkAudioMoment() {
  const st = getActiveStation();
  const noteInput = document.getElementById("quickVoiceNoteInput");
  const customText = noteInput.value.trim();
  if (!customText) {
    alert("Type a quick site-pro note or tap 'Start Walk-Talk Mic' to record live audio!");
    return;
  }
  const nowStr = new Date().toTimeString().slice(0, 8);
  const up = customText.toUpperCase();
  let autoInsight = `Pinned directly to ${st.id} (${st.tag}).`;
  if (up.includes("DRYWALL") || up.includes("TEMP")) {
    autoInsight = "🚨 TRIGGER RFI-23-011 (1B-6A): Require signed Pre-Commissioning HVAC Operation sign-off before startup!";
    state.rfi23011TempConditioningFlag = true;
    renderHeaderMeta();
  } else if (up.includes("FREEZE")) {
    autoInsight = "🚨 TRIGGER RFI-23-007: Enforce DPDT manual-reset serpentine freeze stat + hardwired VFD interlock.";
  } else if (up.includes("WELL") || up.includes("VALVE") || up.includes("REDUCER")) {
    autoInsight = "🚨 TRIGGER RFI-23-005: Div 23 21 13 Hydronic Piping installs inline valve bodies, reducers & welded threadolets.";
  }

  state.audioSegments.unshift({
    id: `AUD-0${state.audioSegments.length + 1}`,
    time: nowStr,
    speaker: window.CSCDiscoveryAdapter.getActiveUser().name,
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
  await loadCachedAudioBlobs();
  const tbody = document.getElementById("audioLogBody");
  tbody.innerHTML = state.audioSegments.map(seg => {
    const audioPlayerHtml = cachedAudioUrls[seg.id]
      ? `<audio controls src="${cachedAudioUrls[seg.id]}" style="height:28px;max-width:210px;margin-top:5px;display:block;"></audio>`
      : "";
    return `
      <tr style="${seg.stationId === st.id ? 'background:rgba(13,148,136,0.14);' : ''}">
        <td><strong>${seg.id}</strong> (${seg.time})<br/><small>${seg.bookmarked ? '📌 PINNED' : '⏱️ AUTO'}</small></td>
        <td><strong>${seg.speaker}</strong><br/>Station: <code>${seg.stationId}</code></td>
        <td><em>"${seg.text}"</em>${audioPlayerHtml}</td>
        <td><strong style="color:var(--accent-teal);">${seg.insight}</strong></td>
      </tr>
    `;
  }).join("");
}

// ============================================================================
// 7. TAB 5: DETERMINISTIC VALVE / VA / LABOR CALCULATORS
// ============================================================================
function renderCalculatorsTab() {
  runFieldCalculators();
}

function runFieldCalculators() {
  const gpm = parseFloat(document.getElementById("calcGpm").value) || 42.0;
  const lineSz = parseFloat(document.getElementById("calcPipeSize").value) || 2.0;
  const sg = parseFloat(document.getElementById("calcFluidSg").value) || 1.032;
  const coilDp = parseFloat(document.getElementById("calcCoilDp").value) || 4.0;
  const designDp = 4.5;

  const theoCv = gpm * Math.sqrt(sg / designDp);
  const belimoTable = [
    { cv: 4.7, sz: 0.5, mod: "Belimo B213 + LRB24-SR" },
    { cv: 7.4, sz: 0.75, mod: "Belimo B218 + LRB24-SR" },
    { cv: 10.0, sz: 1.0, mod: "Belimo B223 + LRB24-SR" },
    { cv: 14.0, sz: 1.0, mod: "Belimo B224 + LRB24-SR" },
    { cv: 19.0, sz: 1.25, mod: "Belimo B230 + LRB24-SR" },
    { cv: 24.0, sz: 1.5, mod: "Belimo B239 + LRB24-SR" },
    { cv: 29.0, sz: 1.5, mod: "Belimo B240 + NRB24-SR" },
    { cv: 37.0, sz: 2.0, mod: "Belimo B249 + NRB24-SR" },
    { cv: 46.0, sz: 2.0, mod: "Belimo B250 + ARB24-SR" },
    { cv: 65.0, sz: 2.5, mod: "Belimo B261 + ARB24-SR" }
  ];
  let selValve = belimoTable[belimoTable.length - 1];
  for (const v of belimoTable) {
    if (v.cv >= theoCv) { selValve = v; break; }
  }
  const actualDp = sg * Math.pow(gpm / selValve.cv, 2);
  const beta = actualDp / (actualDp + coilDp);
  const needsReducer = selValve.sz < lineSz;

  document.getElementById("valveCalcOutput").innerHTML = `
    <strong>💧 Deterministic Valve Sizing Result (RFI-23-002 &amp; RFI-23-005):</strong><br/>
    • Theoretical Cv: <code>${theoCv.toFixed(1)}</code> &rarr; Commercial Selection: <strong>${selValve.mod} (Cv = ${selValve.cv}, Body: ${selValve.sz}")</strong><br/>
    • Actual Valve ΔP: <code>${actualDp.toFixed(2)} psi</code> | Authority β: <code>${beta.toFixed(2)}</code> ${beta >= 0.50 ? '✅ (&ge;0.50 Compliant)' : '⚠️ (&lt;0.50 — Use Belimo PICCV)'}<br/>
    • <strong>Div 23 21 13 Piping Note:</strong> ${needsReducer ? `Furnish ${selValve.sz}" valve; Div 23 21 13 installs <strong>${lineSz}" x ${selValve.sz}" concentric reducers</strong> &amp; inline body per RFI-23-005.` : `Line-sized ${selValve.sz}" valve body installed inline by Div 23 21 13.`}
  `;

  const ctrlCount = parseInt(document.getElementById("calcCtrlCount").value, 10) || 1;
  const srActCount = parseInt(document.getElementById("calcSrActCount").value, 10) || 6;
  const zsCount = parseInt(document.getElementById("calcZsCount").value, 10) || 2;
  const subVa = (ctrlCount * 28) + (srActCount * 7) + (zsCount * 1.5);
  const totalVa = subVa * 1.15;
  const xfmrs = Math.max(1, Math.ceil(totalVa / 80.0));

  document.getElementById("vaCalcOutput").innerHTML = `
    <strong>⚡ Deterministic TCP Panel 24VAC Class 2 Sizer (RFI-23-009):</strong><br/>
    • Connected Load: <code>${subVa.toFixed(1)} VA</code> | With 15% Future Spare: <strong><code>${totalVa.toFixed(1)} VA</code></strong><br/>
    • CSC 80% NEC Art. 725 Continuous Limit: <code>80.0 VA max per 100 VA transformer</code><br/>
    • <strong>Required Power Supply:</strong> <strong style="color:#f59e0b;">Furnish (${xfmrs}) 100VA 120/24VAC Class 2 Fused Transformer(s)</strong> + Dedicated Div 26 120VAC 15A circuit.
  `;

  const fCeil = parseFloat(document.getElementById("calcCeilFactor").value) || 1.0;
  const fWall = parseFloat(document.getElementById("calcWallFactor").value) || 1.0;
  const fShift = parseFloat(document.getElementById("calcShiftFactor").value) || 1.0;
  const comp = (1.0 + (fCeil - 1.0) + (fWall - 1.0) + (fShift - 1.0)).toFixed(2);
  document.getElementById("laborCalcOutput").innerHTML = `
    <strong>👷 Composite Field Installation Labor Multiplier: <code>${comp}x</code></strong>
    (${comp >= 1.4 ? '⚠️ HIGH FRICTION — Include Wiremold / Lift / Off-Hours Allowance in Tier-1 Estimate' : '✅ Standard Rough-In Conditions'})
  `;
}

// ============================================================================
// 8. SESSION MANAGER, BLANK WALK CREATOR, CSV EXPORT & ANDROID SHARE SHEET
// ============================================================================
function openSessionManagerModal() {
  document.getElementById("newWalkProjectInput").value = state.projectName || "";
  document.getElementById("newWalkJobInput").value = state.jobNumber || "";
  document.getElementById("geminiApiKeyInput").value = window.CSCDiscoveryAdapter.getSecretKey("gemini_api_key");
  document.getElementById("sessionModal").style.display = "flex";
}

function closeSessionManagerModal() {
  document.getElementById("sessionModal").style.display = "none";
}

function saveVaultAndProjectMeta() {
  state.projectName = document.getElementById("newWalkProjectInput").value.trim() || state.projectName;
  state.jobNumber = document.getElementById("newWalkJobInput").value.trim() || state.jobNumber;
  const keyVal = document.getElementById("geminiApiKeyInput").value.trim();
  window.CSCDiscoveryAdapter.setSecretKey("gemini_api_key", keyVal);
  persistWalkState();
  renderHeaderMeta();
  closeSessionManagerModal();
  showBannerToast("💾 <strong>Project Metadata &amp; Vault Settings Saved!</strong>");
}

function startBlankSiteWalk() {
  const proj = document.getElementById("newWalkProjectInput").value.trim() || "New Field Discovery Walk";
  const job = document.getElementById("newWalkJobInput").value.trim() || "CSC-26-NEW";
  const sid = "CSC-WALK-" + Date.now();
  state = {
    sessionId: sid,
    projectName: proj,
    jobNumber: job,
    siteContact: "",
    rfi23011TempConditioningFlag: false,
    activeFloorId: "FLR-01",
    activeStationId: "STN-01",
    activeTab: "checklist",
    showVideoCrumb: true,
    barometricHpa: 989.30,
    elevationFt: 0.0,
    floors: [
      { id: "FLR-BSMT", name: "Basement / Plant", elev: -14.0, hpa: 989.80, source: "Tap 'Snap Evacuation Map' to load plan", hasCustomMap: false },
      { id: "FLR-01", name: "Floor 1", elev: 0.0, hpa: 989.30, source: "Tap 'Snap Evacuation Map' to load plan", hasCustomMap: false },
      { id: "FLR-02", name: "Floor 2", elev: 14.0, hpa: 988.80, source: "Tap 'Snap Evacuation Map' to load plan", hasCustomMap: false },
      { id: "FLR-ROOF", name: "Roof (GNSS+Compass)", elev: 28.0, hpa: 988.30, source: "Outdoor GNSS + Compass Mode", hasCustomMap: false }
    ],
    stations: [
      {
        id: "STN-01",
        tag: "EQ-01 (First Field Asset)",
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
    audioSegments: []
  };
  persistWalkState();
  closeSessionManagerModal();
  refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
  showBannerToast(`🆕 <strong>Started Clean Field Walk:</strong> ${job} — ${proj}`);
}

function resetToGoldenDemoWalk() {
  state = JSON.parse(JSON.stringify(GOLDEN_DEMO_STATE));
  persistWalkState();
  closeSessionManagerModal();
  refreshFloorMapBackground();
  loadActiveStationBurstPhotos();
  renderAll(true);
  showBannerToast("🧪 <strong>Restored Lee's Summit West KC Golden Demo Walk!</strong>");
}

function exportScheduleCsv() {
  const rows = state.stations.map(st => {
    const dec = decodeSerialDeterministic(st.mfg, st.serial);
    return {
      JobNumber: state.jobNumber,
      StationID: st.id,
      EquipmentTag: st.tag,
      Floor: st.floorId,
      RoomZone: st.room,
      MapX_Pct: st.xPct,
      MapY_Pct: st.yPct,
      GPS_Lat: st.gpsLat || "",
      GPS_Lon: st.gpsLon || "",
      Compass_Deg: st.compassDeg !== null && st.compassDeg !== undefined ? st.compassDeg : "",
      Manufacturer: st.mfg,
      Model: st.model,
      Serial: st.serial,
      DecodedYear: dec.year || "",
      AgeYears: dec.age !== null ? dec.age : "",
      EOL_Risk: dec.eol ? "YES" : "NO",
      LegacyController: st.legacyCtrl,
      RecommendedALC: st.alcTarget,
      ScheduledQty: st.scheduledQty,
      ObservedQty: st.observedQty,
      ScopeDeltaNote: st.tierDelta
    };
  });

  if (window.RollupBridge && window.RollupBridge.files) {
    window.RollupBridge.files.exportCSV(`${state.jobNumber}_Equipment_Discovery.csv`, rows);
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${state.jobNumber}_Equipment_Discovery.csv`;
  a.click();
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
  renderFloorTabs();
  renderInteractiveMap();
  renderStationStrip();
  renderActiveTabContent();
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
