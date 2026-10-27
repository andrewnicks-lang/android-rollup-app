window.LIGHTNING_GARAGE_BUNDLE = {
  "generated_from": "Blue Oval Garage Python SQLite + Multi-Platform Catalog (2011-2026+)",
  "recipe_count": 183,
  "f150_recipe_count": 59,
  "recipes_by_platform": {
    "f150": 59,
    "bronco": 18,
    "explorer": 20,
    "mustang": 4,
    "ranger_6g": 32,
    "super_duty": 50
  },
  "default_profile": {
    "id": 1,
    "vin": "1FT6W1EV4PWG11434",
    "vin_verified": 1,
    "model_year": 2023,
    "model": "F-150 Lightning",
    "trim": "Lariat",
    "battery": "Extended Range",
    "options": "Max Trailer Tow, BlueCruise, Pro Power Onboard (unconfirmed)",
    "software_notes": null,
    "adapter": null,
    "forscan_license": null,
    "odometer": null,
    "nickname": null,
    "make": "Ford",
    "platform_slug": "f150_14g",
    "powertrain": "BEV",
    "battery_or_engine": null,
    "vin_decode_json": null,
    "vin_online_json": null,
    "vin_decoded_at": null,
    "forscan_license_expires": null
  },
  "ford_platforms": [
    {
      "slug": "f150_14g",
      "name": "F-150 14G & Lightning (2021\u20132026+)",
      "short_name": "F-150 14G / Lightning",
      "make": "Ford",
      "models": [
        "F-150",
        "F-150 Lightning",
        "Raptor"
      ],
      "year_range": [
        2021,
        2026
      ],
      "architecture": "CGEA 1.3 / FNV2 (HS-CAN1/2/3/4 + CAN-FD)",
      "sync_gen": "SYNC 4",
      "ms_can_required": false,
      "upstream_dir": "f150",
      "adapter_note": "Uses HS-CAN1/2/3/4 via Central Gateway (716 GWM). OBDLink EX auto-switches electronically at 500 kbaud.",
      "top_mods": [
        "Double Horn Honk on Keyless Exit Disable (726-63-02)",
        "Global Windows Remote Open/Close (726 / 740 / 741 / 7D0)",
        "Bambi Mode \u2014 High Beams + Fog Lights Simultaneously (726-39-01)",
        "Glare-Free Matrix LED Headlamps (726 / 706 / 7D0 / 720)",
        "360 Camera Views at Speed & Bed Camera (706 / 7D0)",
        "SYNC 4 Splash Screen Animation & Unreal Theme (7D0-03-01)"
      ],
      "downloads": [
        {
          "title": "Livnitup's 2021\u20132026 F-150 & Lightning Master FORScan Spreadsheet",
          "author": "Livnitup",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.f150gen14.com/forum/threads/forscan-spreadsheet-for-2021-f150.1476/"
        },
        {
          "title": "F-150 Lightning EV Specific FORScan Community Guide",
          "author": "F150LightningForum",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.f150lightningforum.com/forum/threads/f-150-lightning-forscan-thread.11406/"
        }
      ]
    },
    {
      "slug": "f150_13g",
      "name": "F-150 13G & Raptor Gen 2 (2015\u20132020)",
      "short_name": "F-150 13G (2015\u20132020)",
      "make": "Ford",
      "models": [
        "F-150",
        "Raptor"
      ],
      "year_range": [
        2015,
        2020
      ],
      "architecture": "CGEA 1.3 (HS-CAN1/2/3 + MS-CAN)",
      "sync_gen": "SYNC 3 (2016\u20132020) / SYNC 2 (2015)",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "Door modules (740 DDM, 741 PDM), Climate (733 HVAC), and Trailer (791 TRM) sit on 125 kbaud MS-CAN (Pins 3 & 11). Use an auto-switching OBDLink EX (STP53) or HS/MS toggle adapter.",
      "top_mods": [
        "Double Horn Honk Disable (726-41-02)",
        "Autofold Mirrors \u2014 Lincoln Style (740 / 741)",
        "Bambi Mode \u2014 High Beams w/ Fogs (726-27-01)",
        "Digital Engine & Transmission Temps Above Gauges (720-07-01)",
        "Global Window Open/Close via Keyfob (726 / 740 / 741)",
        "Disable Auto Start/Stop via BMS/PSC (726-48-02)"
      ],
      "downloads": [
        {
          "title": "Livnitup's 2015\u20132020 F-150 Master FORScan Spreadsheet",
          "author": "Livnitup",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.f150forum.com/f118/forscan-software-enable-disable-features-your-truck-348987/"
        }
      ]
    },
    {
      "slug": "f150_12g",
      "name": "F-150 12G & SVT Raptor (2011\u20132014)",
      "short_name": "F-150 12G (2011\u20132014)",
      "make": "Ford",
      "models": [
        "F-150",
        "SVT Raptor"
      ],
      "year_range": [
        2011,
        2014
      ],
      "architecture": "CGEA 1.2 (HS-CAN + MS-CAN)",
      "sync_gen": "SYNC 2 (MyFord Touch) / SYNC Gen 1",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "2011\u20132014 CGEA 1.2 uses 500 kbaud HS-CAN and 125 kbaud MS-CAN (STP53). Same 7XX-XX-XX .abt/.ab format and checksum math!",
      "top_mods": [
        "Bambi Mode (High Beams + Fog Lights) in BCM 726",
        "Remote Start Climate & Heated Seat Menu Enable (720 IPC / 7D0 APIM)",
        "Daytime Running Lights (DRL) Selectable Target (Fog / Turn / Low Beam)",
        "One-Touch Lane Change Turn Signal Flash Count (724 SCCM)",
        "Trailer Brake Controller (TBC) Gain Display Enable (720 IPC)",
        "Navigation in Motion / MyFord Touch Climate Quadrant Unlock (7D0-01-01)"
      ],
      "downloads": [
        {
          "title": "2011\u20132014 F-150 (12th Gen CGEA 1.2) FORScan Master Spreadsheet",
          "author": "F150Forum Community / ZooDad",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=pdf",
          "forum_url": "https://www.f150forum.com/f38/forscan-applications-349018/"
        }
      ]
    },
    {
      "slug": "super_duty_23",
      "name": "F-250 / F-350 / F-450 Super Duty (2023\u20132026+)",
      "short_name": "Super Duty (2023+)",
      "make": "Ford",
      "models": [
        "F-250",
        "F-350",
        "F-450",
        "F-550",
        "Super Duty"
      ],
      "year_range": [
        2023,
        2026
      ],
      "architecture": "FNV2 (HS-CAN1/2/3/4)",
      "sync_gen": "SYNC 4",
      "ms_can_required": false,
      "upstream_dir": "super_duty",
      "adapter_note": "Uses FNV2 Gateway (716 GWM) at 500 kbaud across all HS-CAN buses. OBDLink EX recommended.",
      "top_mods": [
        "DPF Filter % Full Screen on IPC Cluster (720)",
        "OCR (Operator Commanded Regeneration) Static Regen Enable",
        "TPMS Pla-Card Threshold Lowering for Unloaded Ride (726 BCM)",
        "Bambi Mode \u2014 High Beams + Fog Lights (726 BCM)",
        "Double Horn Honk on Keyfob Exit Disable (726 BCM)",
        "2kW Pro Power Onboard In-Motion / Bed Outlet Mode"
      ],
      "downloads": [
        {
          "title": "ZooDad's 2023\u20132026 Super Duty FORScan Master Spreadsheet",
          "author": "ZooDad",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.ford-trucks.com/forums/1718054-2023-super-duty-forscan-spreadsheet.html"
        }
      ]
    },
    {
      "slug": "super_duty_17_22",
      "name": "F-250 / F-350 / F-450 Super Duty (2017\u20132022)",
      "short_name": "Super Duty (2017\u20132022)",
      "make": "Ford",
      "models": [
        "F-250",
        "F-350",
        "F-450",
        "F-550",
        "Super Duty"
      ],
      "year_range": [
        2017,
        2022
      ],
      "architecture": "CGEA 1.3 (HS-CAN1/2/3 + MS-CAN)",
      "sync_gen": "SYNC 3 (2017\u20132021) / SYNC 4 (2022)",
      "ms_can_required": true,
      "upstream_dir": "super_duty",
      "adapter_note": "Shares CGEA 1.3 cab architecture with 13th-Gen F-150. Door modules (740/741) and HVAC (733) use 125 kbaud MS-CAN (STP53).",
      "top_mods": [
        "DPF % Full Gauge & Operator Commanded Regen (OCR) in IPC (720)",
        "TPMS Front/Rear PSI Threshold Adjustment (726 BCM)",
        "Powerfold Tow Mirrors Autofold on Lock (740 / 741)",
        "Double Horn Honk on Running Exit Disable (726 BCM)",
        "Bambi Mode \u2014 High Beams + Fog Lights + LED Switchbacks (726)",
        "Digital Coolant & Trans Temps Above Gauges (720-07-01)"
      ],
      "downloads": [
        {
          "title": "ZooDad's 2017\u20132022 Super Duty FORScan Master Spreadsheet",
          "author": "ZooDad & Livnitup",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.ford-trucks.com/forums/1460789-forscan-and-as-built-data.html"
        }
      ]
    },
    {
      "slug": "super_duty_11_16",
      "name": "F-250 / F-350 / F-450 Super Duty 6.7L / 6.2L (2011\u20132016)",
      "short_name": "Super Duty (2011\u20132016)",
      "make": "Ford",
      "models": [
        "F-250",
        "F-350",
        "F-450",
        "F-550",
        "Super Duty"
      ],
      "year_range": [
        2011,
        2016
      ],
      "architecture": "CGEA 1.2 (HS-CAN + MS-CAN)",
      "sync_gen": "SYNC 2 (MyFord Touch) / SYNC Gen 1",
      "ms_can_required": true,
      "upstream_dir": "super_duty",
      "adapter_note": "2011\u20132016 6.7L Power Stroke / 6.2L Boss CGEA 1.2 uses 500 kbaud HS-CAN and 125 kbaud MS-CAN (STP53). Exact same 726/720/7D0 .abt format and checksum math!",
      "top_mods": [
        "DPF Soot % Screen & Manual Exhaust Regen Enable (720 IPC)",
        "TPMS Pressure Threshold Adjustment for Aftermarket Tires (726 BCM)",
        "Factory Remote Start Enable & Climate Menu in Cluster (726 / 720)",
        " OEM Trailer Brake Controller (TBC) Activation (720 IPC)",
        "Bambi Mode & Daytime Running Light (DRL) Configuration (726 BCM)",
        "Navigation in Motion & Heated/Cooled Seat Icons on SYNC 2 Home Screen (7D0-01-01)"
      ],
      "downloads": [
        {
          "title": "ZooDad's 2011\u20132016 Super Duty FORScan Master Spreadsheet",
          "author": "ZooDad",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=pdf",
          "forum_url": "https://www.ford-trucks.com/forums/1463675-forscan-2011-2016-super-duty.html"
        }
      ]
    },
    {
      "slug": "bronco_6g",
      "name": "Bronco 6G & Bronco Raptor (2021\u20132026+)",
      "short_name": "Bronco 6G (2021+)",
      "make": "Ford",
      "models": [
        "Bronco"
      ],
      "year_range": [
        2021,
        2026
      ],
      "architecture": "CGEA 1.3 / FNV2",
      "sync_gen": "SYNC 4",
      "ms_can_required": false,
      "upstream_dir": "bronco",
      "adapter_note": "All-HS-CAN gateway architecture via 716 GWM. OBDLink EX recommended.",
      "top_mods": [
        "Unlock All 8 G.O.A.T. Drive Modes (Sport, Baja, Rock Crawl, Mud/Ruts) in ABS 760",
        "Double Horn Honk on Keyless Exit Disable (726 BCM)",
        "Bambi Mode \u2014 High Beams + Fog Lights (726 BCM)",
        "360 Trail Camera at Any Speed (706 IPMA / 7D0 APIM)",
        "Flat EQ / B&O Sound System Rear Pod High-Pass Filter Removal (727 ACM)",
        "Disable Auto Start/Stop & Chimes (726 / 720)"
      ],
      "downloads": [
        {
          "title": "Bronco6G Community FORScan Master Spreadsheet",
          "author": "Bronco6G Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.bronco6g.com/forum/threads/2021-bronco-forscan-thread.844/"
        }
      ]
    },
    {
      "slug": "bronco_sport",
      "name": "Bronco Sport (2021\u20132026+)",
      "short_name": "Bronco Sport (2021+)",
      "make": "Ford",
      "models": [
        "Bronco Sport"
      ],
      "year_range": [
        2021,
        2026
      ],
      "architecture": "C2 / CGEA 1.3",
      "sync_gen": "SYNC 3 (2021\u20132024) / SYNC 4 (2025+)",
      "ms_can_required": true,
      "upstream_dir": "bronco",
      "adapter_note": "Shares C2 platform architecture with Maverick and Escape. OBDLink EX handles HS/MS switching automatically.",
      "top_mods": [
        "Double Horn Honk Disable on Exit (726 BCM)",
        "Global Windows Open/Close via Keyfob",
        "Bambi Mode (High Beams + Fog Lights) & Cornering Fog Lights",
        "G.O.A.T. Modes Unlock (Rock Crawl / Mud & Ruts / Sand)",
        "Climate Menu & Heated Seat Icons on SYNC Screen (7D0 APIM)"
      ],
      "downloads": [
        {
          "title": "Bronco Sport FORScan Master Spreadsheet & Guide",
          "author": "BroncoSportForum",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.broncosportforum.com/forum/threads/forscan-mods-for-bronco-sport.1665/"
        }
      ]
    },
    {
      "slug": "ranger_6g",
      "name": "Ranger 6G & Ranger Raptor (2024\u20132026+)",
      "short_name": "Ranger 6G (2024+)",
      "make": "Ford",
      "models": [
        "Ranger",
        "Ranger Raptor"
      ],
      "year_range": [
        2024,
        2026
      ],
      "architecture": "FNV2",
      "sync_gen": "SYNC 4A",
      "ms_can_required": false,
      "upstream_dir": "ranger_6g",
      "adapter_note": "FNV2 multi-HS-CAN gateway architecture. 32 native Ranger 6G recipes included directly in the mod library!",
      "top_mods": [
        "Bambi Mode \u2014 High Beams + Fog Lights (726 BCM)",
        "Double Horn Honk on Exit Disable (726 BCM)",
        "Global Windows Remote Open/Close (726 / 740 / 741 / 7D0)",
        "Glare-Free Matrix Headlamps & Off-Road Front Camera at Speed",
        "Chime & Seatbelt Reminder Customizations (720 IPC)"
      ],
      "downloads": [
        {
          "title": "Ranger 6G & Ranger Raptor FORScan Master Spreadsheet",
          "author": "Ranger6G Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.ranger6g.com/forum/threads/forscan-codes-and-mods-for-2024-ranger-6th-gen.8351/"
        }
      ]
    },
    {
      "slug": "ranger_5g",
      "name": "Ranger 5G (2019\u20132023)",
      "short_name": "Ranger 5G (2019\u20132023)",
      "make": "Ford",
      "models": [
        "Ranger"
      ],
      "year_range": [
        2019,
        2023
      ],
      "architecture": "CGEA 1.3 (HS-CAN + MS-CAN)",
      "sync_gen": "SYNC 3",
      "ms_can_required": true,
      "upstream_dir": "ranger_6g",
      "adapter_note": "Uses CGEA 1.3 with 125 kbaud MS-CAN (STP53) for climate and body modules.",
      "top_mods": [
        "Bambi Mode \u2014 High Beams with Fog Lights (726 BCM)",
        "Off-Road Gauges & Pitch/Roll Screen in IPC Cluster (720)",
        "Double Horn Honk Disable (726 BCM)",
        "SYNC 3 Climate Menu & Splash Screen Themes (7D0 APIM)",
        "Auto Start/Stop Disable & Chime Suppression"
      ],
      "downloads": [
        {
          "title": "Ranger 5G (2019\u20132023) FORScan Wiki & Master Sheet",
          "author": "Ranger5G Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.ranger5g.com/forum/threads/forscan-modifications.1844/"
        }
      ]
    },
    {
      "slug": "maverick",
      "name": "Maverick Hybrid & EcoBoost (2022\u20132026+)",
      "short_name": "Maverick (2022+)",
      "make": "Ford",
      "models": [
        "Maverick"
      ],
      "year_range": [
        2022,
        2026
      ],
      "architecture": "C2 / CGEA 1.3",
      "sync_gen": "SYNC 3 / Connected Touch (2022\u20132024) / SYNC 4 (2025+)",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "C2 architecture; OBDLink EX automatically switches HS/MS buses.",
      "top_mods": [
        "Unlock FX4 / Lobo / Eco / Sport / Tow-Haul Drive Modes in ABS (760)",
        "Traffic Sign Recognition (TSR) Speed Limit Sign in Cluster (706 IPMA / 720 IPC)",
        "Factory Cruise Control Retrofit Activation (724 SCCM / 726 BCM)",
        "Double Horn Honk on Exit Disable & Door Chime Disable",
        "Bambi Mode \u2014 High Beams + Fog Lights Simultaneously"
      ],
      "downloads": [
        {
          "title": "MaverickTruckClub FORScan 101 & Master Spreadsheet",
          "author": "MaverickTruckClub",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.mavericktruckclub.com/forum/threads/forscan-101-step-by-step-how-to-start-guide-and-master-list.7406/"
        }
      ]
    },
    {
      "slug": "mach_e",
      "name": "Mustang Mach-E (2021\u20132026+)",
      "short_name": "Mustang Mach-E",
      "make": "Ford",
      "models": [
        "Mustang Mach-E",
        "Mach-E"
      ],
      "year_range": [
        2021,
        2026
      ],
      "architecture": "FNV2 BEV",
      "sync_gen": "SYNC 4A",
      "ms_can_required": false,
      "upstream_dir": "f150",
      "adapter_note": "Shares FNV2 BEV architecture (7E7 BECM, 746 SOBDMC, 7D0 SYNC 4A) with F-150 Lightning.",
      "top_mods": [
        "GT Power Meter / Jailbars Display on Standard/Premium Cluster (720 IPC)",
        "Double Horn Honk on Keyless Exit Disable (726 BCM)",
        "Hands-Free Liftgate Kick Sensor Toggle & Frunk Chime Options",
        "Acoustic Vehicle Alerting (AVAS) & Pedestrian Sound Diagnostics",
        "Euro Glare-Free Adaptive High Beams (706 IPMA / 726 BCM)"
      ],
      "downloads": [
        {
          "title": "Mach-E Forum Proven FORScan Mods Spreadsheet",
          "author": "MachEForum / Livnitup",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.macheforum.com/site/threads/forscan-mach-e-proven-mods-list-and-spreadsheet.26328/"
        }
      ]
    },
    {
      "slug": "mustang_s650",
      "name": "Mustang S650 & Dark Horse (2024\u20132026+)",
      "short_name": "Mustang S650 (2024+)",
      "make": "Ford",
      "models": [
        "Mustang",
        "Dark Horse"
      ],
      "year_range": [
        2024,
        2026
      ],
      "architecture": "FNV2",
      "sync_gen": "SYNC 4",
      "ms_can_required": false,
      "upstream_dir": "mustang",
      "adapter_note": "FNV2 architecture with dual digital screens (720 IPC + 7D0 APIM).",
      "top_mods": [
        "Double Horn Honk on Exit Disable (726 BCM)",
        "Disable Active Noise Control / Fake Engine Sound (ESE in ACM 727)",
        "Dark Horse / Fox Body / SVT Cobra Cluster & SYNC 4 Splash Themes (7D0-03-01)",
        "Auto Start/Stop Disable & Seatbelt Chime Disable",
        "Global Windows Remote Open & Close"
      ],
      "downloads": [
        {
          "title": "Mustang S650 (7th Gen) FORScan Master Spreadsheet",
          "author": "Mustang7G Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.mustang7g.com/forums/threads/s650-forscan-thread.158450/"
        }
      ]
    },
    {
      "slug": "mustang_s550",
      "name": "Mustang S550 / GT350 / GT500 (2015\u20132023)",
      "short_name": "Mustang S550 (2015\u20132023)",
      "make": "Ford",
      "models": [
        "Mustang",
        "Shelby GT350",
        "Shelby GT500",
        "Mach 1",
        "Bullitt"
      ],
      "year_range": [
        2015,
        2023
      ],
      "architecture": "CGEA 1.3 (HS-CAN + MS-CAN)",
      "sync_gen": "SYNC 3 (2016\u20132023) / SYNC 2 (2015)",
      "ms_can_required": true,
      "upstream_dir": "mustang",
      "adapter_note": "Uses CGEA 1.3 with 125 kbaud MS-CAN (STP53). Native Mustang recipes included in library!",
      "top_mods": [
        "Double Horn Honk on Exit Disable (726-41-02)",
        "Engine Sound Enhancement (ESE / Active Noise Control) Disable (727-01-01)",
        "Shelby GT350R / GT500 / Bullitt SYNC 3 Splash Screen (7D0-02-01)",
        "Simultaneous High Beams + Fog Lights (Bambi Mode 726-27-01)",
        "12-Inch Digital Cluster Retrofits & Shift Light Enable (720 IPC)"
      ],
      "downloads": [
        {
          "title": "Mustang S550 (2015\u20132023) FORScan Master Spreadsheet",
          "author": "Mustang6G Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.mustang6g.com/forums/threads/forscan-codes-s550-mustangs.61773/"
        }
      ]
    },
    {
      "slug": "explorer_6g",
      "name": "Explorer 6G / ST & Lincoln Aviator (2020\u20132026+)",
      "short_name": "Explorer 6G / Aviator (2020+)",
      "make": "Ford",
      "models": [
        "Explorer",
        "Police Interceptor Utility",
        "Aviator"
      ],
      "year_range": [
        2020,
        2026
      ],
      "architecture": "CD6 / CGEA 1.3 / FNV2",
      "sync_gen": "SYNC 3 (2020\u20132024) / Digital Experience (2025+)",
      "ms_can_required": false,
      "upstream_dir": "explorer",
      "adapter_note": "20 native Explorer recipes included in library! Uses HS-CAN1/2/3/4 via Gateway 716.",
      "top_mods": [
        "Double Horn Honk on Exit Disable (726 BCM)",
        "FENG (Fake Engine Noise in Explorer ST) Disable in ACM (727-01-01)",
        "Police Dark Car / Silent Mode Enable (726 BCM)",
        "Bambi Mode \u2014 High Beams + Fog Lights Simultaneously (726 BCM)",
        "Lincoln Style Auto-Fold Mirrors on Lock (740 / 741)"
      ],
      "downloads": [
        {
          "title": "Explorer 6G & Explorer ST (2020\u20132026) FORScan Master Spreadsheet",
          "author": "ExplorerST / Livnitup",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.explorerst.org/threads/forscan-2020-2024-explorer-spreadsheet.1157/"
        }
      ]
    },
    {
      "slug": "explorer_5g",
      "name": "Explorer 5G & Police Interceptor Utility (2011\u20132019)",
      "short_name": "Explorer 5G (2011\u20132019)",
      "make": "Ford",
      "models": [
        "Explorer",
        "Police Interceptor Utility"
      ],
      "year_range": [
        2011,
        2019
      ],
      "architecture": "CGEA 1.2 (2011\u20132015) / CGEA 1.3 (2016\u20132019)",
      "sync_gen": "SYNC 2 (2011\u20132015) / SYNC 3 (2016\u20132019)",
      "ms_can_required": true,
      "upstream_dir": "explorer",
      "adapter_note": "Uses 500 kbaud HS-CAN + 125 kbaud MS-CAN (STP53). Very popular for Police Interceptor Utility (PIU) civilian conversions!",
      "top_mods": [
        "Disable Double Horn Honk on Exit (726 BCM)",
        "Police Dark Car / Secure Idle / Rear Door Lock Restore on PIU (726 BCM)",
        "Factory Keyfob Remote Start & Climate Control Enable (726 / 720)",
        "Bambi Mode (High Beams + Fog Lights) & DRL Customization (726)",
        "Heated & Cooled Seat Icons on SYNC 2 / SYNC 3 Home Screen (7D0-01-01)"
      ],
      "downloads": [
        {
          "title": "Explorer 5G (2011\u20132019) FORScan Master Spreadsheet",
          "author": "ExplorerForum Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=pdf",
          "forum_url": "https://www.explorerforum.com/forums/threads/forscan-2011-2019-explorer.456588/"
        }
      ]
    },
    {
      "slug": "expedition",
      "name": "Expedition & Lincoln Navigator (2015\u20132026+)",
      "short_name": "Expedition / Navigator",
      "make": "Ford",
      "models": [
        "Expedition",
        "Expedition Max",
        "Navigator",
        "Navigator L"
      ],
      "year_range": [
        2015,
        2026
      ],
      "architecture": "CGEA 1.3 (2015\u20132021) / FNV2 (2022+)",
      "sync_gen": "SYNC 3 (2016\u20132021) / SYNC 4 (2022+)",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "Shares 95% of its BCM (726), IPC (720), APIM (7D0), and DDM/PDM (740/741) addresses directly with the corresponding generation F-150.",
      "top_mods": [
        "Double Horn Honk on Exit Disable (726 BCM)",
        "Bambi Mode \u2014 High Beams + Fog Lights (726 BCM)",
        "Auto Start/Stop Disable & Digital Temps Above Gauges (720 IPC)",
        "Global Windows Open/Close & Lincoln Autofold Mirrors (740 / 741)",
        "360 Camera at Speed & Lincoln Black Label Splash Screen (7D0)"
      ],
      "downloads": [
        {
          "title": "Expedition & Navigator FORScan Spreadsheet (Shares F-150 Architecture)",
          "author": "ExpeditionForum & Livnitup",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://www.expeditionforum.com/threads/forscan-tweaks-for-4th-gen-expedition.39411/"
        }
      ]
    },
    {
      "slug": "fusion_2g",
      "name": "Fusion 2G & Lincoln MKZ (2013\u20132020)",
      "short_name": "Fusion 2G / MKZ (2013\u20132020)",
      "make": "Ford",
      "models": [
        "Fusion",
        "Fusion Energi",
        "Fusion Hybrid",
        "MKZ",
        "Continental"
      ],
      "year_range": [
        2013,
        2020
      ],
      "architecture": "CD4 CGEA 1.2 (2013\u20132016) / CGEA 1.3 (2017\u20132020)",
      "sync_gen": "SYNC 2 (2013\u20132016) / SYNC 3 (2017\u20132020)",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "Uses HS-CAN + 125 kbaud MS-CAN (STP53). DanMc85's legendary 2GFusions FORScan work pioneered much of modern Ford as-built decoding!",
      "top_mods": [
        "Global Windows Open/Close via Keyfob (726 BCM / 740 DDM / 741 PDM)",
        "Double Horn Honk on Running Exit Disable (726 BCM)",
        "Bambi Mode (High Beams + Fog Lights) & DRL Signature LEDs Only",
        "SYNC 2 to SYNC 3 Upgrade As-Built Programming (7D0 APIM)",
        "Digital Speedometer & Tire Pressure Display in Cluster (720 IPC)"
      ],
      "downloads": [
        {
          "title": "DanMc85's 2013\u20132020 Fusion & MKZ FORScan Master Guide & Sheet",
          "author": "DanMc85",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=pdf",
          "forum_url": "https://www.2gfusions.net/showthread.php?tid=4573"
        }
      ]
    },
    {
      "slug": "focus_st_rs",
      "name": "Focus / Fiesta ST & RS (2013\u20132018)",
      "short_name": "Focus / Fiesta ST & RS",
      "make": "Ford",
      "models": [
        "Focus",
        "Focus ST",
        "Focus RS",
        "Fiesta",
        "Fiesta ST"
      ],
      "year_range": [
        2013,
        2018
      ],
      "architecture": "Global C1 / CGEA 1.2 (HS-CAN + MS-CAN)",
      "sync_gen": "SYNC 2 (2013\u20132015) / SYNC 3 (2016\u20132018)",
      "ms_can_required": true,
      "upstream_dir": "mustang",
      "adapter_note": "Uses 500 kbaud HS-CAN and 125 kbaud MS-CAN (STP53). Supports both 7XX-XX-XX As-Built and Central Configuration.",
      "top_mods": [
        "Global Windows Remote Open/Close via Keyfob",
        "RS / ST Performance Splash Screen in SYNC 2 / SYNC 3 (7D0 APIM)",
        "Bambi Mode (High Beams + Fog Lights) & Auto-Lock on Drive",
        "Disable Shift-Up Arrow Eco Nanny & Chimes in IPC (720)",
        "Flat EQ Output from ACM for Aftermarket Amplifiers (727)"
      ],
      "downloads": [
        {
          "title": "Focus ST / RS & Fiesta ST FORScan Master Guide",
          "author": "FocusST / FocusRS Community",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1yax6zfhZYj2joBczEeruqKh9X5Qhee3C0ngilqwTA7E/export?format=pdf",
          "forum_url": "https://www.focusst.org/threads/forscan-thread.151652/"
        }
      ]
    },
    {
      "slug": "transit",
      "name": "Transit & E-Transit (2015\u20132026+)",
      "short_name": "Transit / E-Transit",
      "make": "Ford",
      "models": [
        "Transit",
        "E-Transit",
        "Transit Connect"
      ],
      "year_range": [
        2015,
        2026
      ],
      "architecture": "CGEA 1.3 / FNV2",
      "sync_gen": "SYNC 3 / SYNC 4",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "2015\u20132019 Transit uses HS-CAN + MS-CAN (STP53); 2020+ Transit & E-Transit use CGEA 1.3+/FNV2 Gateway.",
      "top_mods": [
        "Disable Auto-Lock / Horn Honk for Camper Van Conversions (726 BCM)",
        "High-Idle / Auxiliary Upfitter & Dual-Battery Mode Configuration (726)",
        "Bambi Mode \u2014 High Beams + Fog Lights (726 BCM)",
        "Trailer Brake Controller (TBC) & Tow Haul Activation (720 IPC)",
        "Power Point 12V Outlet Timeout Extension for Aux Loads"
      ],
      "downloads": [
        {
          "title": "Ford Transit & E-Transit FORScan Upfitter & Camper Guide",
          "author": "FordTransitUSAForum",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://www.fordtransitusaforum.com/threads/forscan-changes-and-documentation.79311/"
        }
      ]
    },
    {
      "slug": "ford_generic",
      "name": "Ford & Lincoln Universal (Edge, Escape, Taurus, Corsair, Nautilus 2011\u20132026+)",
      "short_name": "Ford / Lincoln (2011\u20132026+)",
      "make": "Ford / Lincoln",
      "models": [
        "Edge",
        "Escape",
        "Taurus",
        "Flex",
        "EcoSport",
        "Corsair",
        "Nautilus",
        "MKX",
        "MKC",
        "MKT",
        "MKS"
      ],
      "year_range": [
        2011,
        2026
      ],
      "architecture": "CGEA 1.2 / CGEA 1.3 / FNV2",
      "sync_gen": "SYNC 2 / SYNC 3 / SYNC 4",
      "ms_can_required": true,
      "upstream_dir": "f150",
      "adapter_note": "All 2011\u20132026+ Ford & Lincoln vehicles use the same 7XX-XX-XX As-Built notation and Modulo-256 checksum math. Use OBDLink EX for automatic HS-CAN / MS-CAN switching.",
      "top_mods": [
        "Double Horn Honk on Running Exit Disable (726 BCM)",
        "Bambi Mode \u2014 High Beams + Fog Lights (726 BCM)",
        "Global Windows Open/Close via Keyfob (726 / 740 / 741)",
        "Lincoln / ST / Raptor Splash Screen & Climate Bar in SYNC (7D0 APIM)",
        "Seatbelt & Door Ajar Chime Suppression (720 IPC)"
      ],
      "downloads": [
        {
          "title": "CyanLabs Universal Ford & Lincoln As-Built Database",
          "author": "CyanLabs",
          "sheet_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/edit",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1uDSQ1Z5a2Wt8-kjrSiVSlDFGFHnfeuhb3RTMVz95730/export?format=pdf",
          "forum_url": "https://cyanlabs.net/fhub/asbuilt-db/"
        },
        {
          "title": "Ford Motorcraft Official Factory As-Built (.ab) Lookup by VIN",
          "author": "Ford Motor Company",
          "sheet_url": "https://www.motorcraftservice.com/AsBuilt",
          "xlsx_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=xlsx",
          "pdf_url": "https://docs.google.com/spreadsheets/d/1-_e09lLPPeSHoO3SsNwySc59f0n_c96g/export?format=pdf",
          "forum_url": "https://forscan.org/forum/"
        }
      ]
    }
  ],
  "ford_modules": {
    "00F": {
      "long": "Fuel Fired Coolant Heating Module",
      "short": "FFH"
    },
    "013": {
      "long": "Next Generation Speed Control Module",
      "short": "NGSC"
    },
    "016": {
      "long": "Fuel Indication Module",
      "short": "FIM"
    },
    "020": {
      "long": "Air Suspension / Rear Air Suspension Module",
      "short": "4WAS/RASM"
    },
    "02A": {
      "long": "Electric Parking Brake",
      "short": "EPB"
    },
    "030": {
      "long": "Variable Assist Power Steering",
      "short": "VAPS"
    },
    "048": {
      "long": "Remote Anti-Theft / Personality Module",
      "short": "RAP"
    },
    "050": {
      "long": "Rear Electronic Module",
      "short": "REM"
    },
    "052": {
      "long": "Central Timer Module / Front Electronic Module",
      "short": "CTM/FEM"
    },
    "058": {
      "long": "Electronic Crash Sensor",
      "short": "ECS"
    },
    "059": {
      "long": "Fire Suppression System Module",
      "short": "FSSM"
    },
    "060": {
      "long": "Hybrid Electronic Cluster / Virtual Image Cluster",
      "short": "HEC/VIC"
    },
    "061": {
      "long": "Message Center",
      "short": "MC"
    },
    "068": {
      "long": "Navigation Controller",
      "short": "NAV"
    },
    "070": {
      "long": "Lighting Control Module / Steering Column/Instrument Panel/Lighting",
      "short": "LCM/SCIL"
    },
    "071": {
      "long": "Headlamp Leveling Module",
      "short": "HD_LVL"
    },
    "090": {
      "long": "Cellular Phone Module",
      "short": "CPM"
    },
    "091": {
      "long": "Vehicle Emergency Messaging System",
      "short": "VEMS"
    },
    "098": {
      "long": "Electronic Automatic Temperature Control",
      "short": "EATC"
    },
    "099": {
      "long": "Rear Air Temperature Control",
      "short": "RATC"
    },
    "0A6": {
      "long": "Passenger Front Seat Module",
      "short": "PSM"
    },
    "0B0": {
      "long": "Left Power Sliding Door Module",
      "short": "LPSDM"
    },
    "0C0": {
      "long": "Passive Anti-Theft System",
      "short": "PATS"
    },
    "0C1": {
      "long": "Security module",
      "short": "CSM"
    },
    "0C3": {
      "long": "Steering Column Locking Module",
      "short": "SCLM"
    },
    "0CE": {
      "long": "Tracking and Blocking Module",
      "short": "TBM"
    },
    "242": {
      "long": "Power Steering Control Module",
      "short": "PSCM"
    },
    "701": {
      "long": "Global Positioning System Module",
      "short": "GPSM"
    },
    "706": {
      "long": "Image Processing Module A",
      "short": "IPMA"
    },
    "712": {
      "long": "Seat Control Module G",
      "short": "SCMG"
    },
    "713": {
      "long": "Seat Control Module H",
      "short": "SCMH"
    },
    "714": {
      "long": "Heated Steering Wheel Module",
      "short": "HSWM"
    },
    "716": {
      "long": "Gateway Module A",
      "short": "GWM"
    },
    "720": {
      "long": "Instrument Panel Control Module",
      "short": "IPC"
    },
    "721": {
      "long": "Vehicle Dynamics Module",
      "short": "VDM"
    },
    "724": {
      "long": "Steering Column Control Module",
      "short": "SCCM"
    },
    "726": {
      "long": "Body Control Module",
      "short": "BdyCM"
    },
    "727": {
      "long": "Audio Control Module",
      "short": "ACM"
    },
    "730": {
      "long": "Electronic-Controlled Power Steering / Passenger Climate-Control Seat Module",
      "short": "EPS/PCSM"
    },
    "731": {
      "long": "Remote Function Actuator",
      "short": "RFA"
    },
    "733": {
      "long": "Heating Ventilation Air Conditioning",
      "short": "HVAC"
    },
    "734": {
      "long": "Headlamp Control Module",
      "short": "HCM"
    },
    "736": {
      "long": "Parking Aid Module",
      "short": "PAM"
    },
    "737": {
      "long": "Restraint Control Module",
      "short": "RCM"
    },
    "740": {
      "long": "Drivers Door Module",
      "short": "DDM"
    },
    "741": {
      "long": "Passengers Door Control Unit",
      "short": "PDM"
    },
    "744": {
      "long": "Driver's Seat Module",
      "short": "DSM"
    },
    "746": {
      "long": "DC to DC Converter Control Module",
      "short": "DCDC"
    },
    "751": {
      "long": "Battery Energy Control Module",
      "short": "BECM"
    },
    "754": {
      "long": "Telematics Control Unit",
      "short": "TCU"
    },
    "755": {
      "long": "Vehicle Security Module",
      "short": "VSM"
    },
    "757": {
      "long": "Trailer Brake Control Module",
      "short": "TBC"
    },
    "760": {
      "long": "Anti-Lock Brake / Traction Control Module",
      "short": "ABS"
    },
    "761": {
      "long": "4X4 Control Module",
      "short": "4X4M"
    },
    "764": {
      "long": "Cruise Control",
      "short": "CCM"
    },
    "765": {
      "long": "Occupant Classification System Module",
      "short": "OCS"
    },
    "766": {
      "long": "Power Running Board",
      "short": "PRB"
    },
    "771": {
      "long": "Rear Seat Entertainment Module",
      "short": "RETM"
    },
    "774": {
      "long": "Audio Rear Control Unit",
      "short": "RCU"
    },
    "775": {
      "long": "Liftgate / Trunk Module",
      "short": "LTM"
    },
    "776": {
      "long": "Driver/Dual Climate-Control Seat Module",
      "short": "DCSM"
    },
    "777": {
      "long": "Passenger Climate-Control Seat Module 2 (rear)",
      "short": "PCSM2"
    },
    "782": {
      "long": "Satellite Digital Audio Receiver System",
      "short": "SDARS"
    },
    "783": {
      "long": "(Audio) Digital Signal Processing Module",
      "short": "DSP"
    },
    "785": {
      "long": "Rear Heating Ventilation Air Conditioning",
      "short": "RHVAC"
    },
    "791": {
      "long": "Trailer Module",
      "short": "TRM"
    },
    "797": {
      "long": "Steering Angle Sensor Module",
      "short": "SASM"
    },
    "7A5": {
      "long": "Front Control/Display Interface Module",
      "short": "FCDIM"
    },
    "7A6": {
      "long": "Front Display Interface Module",
      "short": "FDIM"
    },
    "7A7": {
      "long": "Front Controls Interface Module",
      "short": "FCIM"
    },
    "7B1": {
      "long": "Image Processing Module B",
      "short": "IPMB"
    },
    "7B2": {
      "long": "Head Up Display",
      "short": "HUD"
    },
    "7B5": {
      "long": "Interior Lighting Control Module",
      "short": "ILCM"
    },
    "7C3": {
      "long": "Headlamp Control Module 2(B)",
      "short": "HCM2"
    },
    "7C4": {
      "long": "Side Obstacle Detection Control Module - Left",
      "short": "SODL"
    },
    "7C5": {
      "long": "Steering Effort Control Module",
      "short": "SECM"
    },
    "7C6": {
      "long": "Side Obstacle Detection Control Module - Right",
      "short": "SODR"
    },
    "7C7": {
      "long": "Air Conditioning Control Module",
      "short": "ACCM"
    },
    "7D0": {
      "long": "Accessory Protocol Interface Module",
      "short": "APIM"
    },
    "7D5": {
      "long": "Digital Audio Control Module C",
      "short": "DACMC"
    },
    "7E0": {
      "long": "Powertrain Control Module",
      "short": "PCM"
    },
    "7E1": {
      "long": "Transmission Control Module",
      "short": "TCM"
    },
    "7E2": {
      "long": "Circuit Deactivation Ignition Module",
      "short": "CDIM"
    },
    "7E3": {
      "long": "Auxiliary Heater Control Module",
      "short": "AHCM"
    },
    "7E5": {
      "long": "Alternative Fuel Control Module",
      "short": "AFCM"
    },
    "7E6": {
      "long": "Fuel Injection Control Module",
      "short": "FICM"
    },
    "7E7": {
      "long": "Air Conditioning Control Module / Battery Energy Control Module",
      "short": "ACCM/BECM"
    }
  },
  "ford_fcodes": {
    "F10A": "ECU Cal-Config Part Number",
    "F110": "On-line Diagnostic Database Reference Number",
    "F111": "ECU Core Assembly Number",
    "F113": "ECU Delivery Assembly Number",
    "F124": "ECU Calibration Data #1 Number",
    "F162": "Software Download Specification Version",
    "F163": "Diagnostic Specification Version",
    "F188": "Vehicle Manufacturer ECU Software Number",
    "F18C": "ECU Serial Number",
    "F0E8": "Private Sub Node #1 Software Number",
    "F0E9": "Private Sub Node #2 Software Number",
    "F108": "ECU Network Signal Calibration Number",
    "F129": "Private Sub Node #1 Core Assembly Number",
    "F12A": "Private Sub Node #2 Part Number",
    "F141": "Private Sub Node #1 Serial Number",
    "F142": "Private Sub Node #2 Serial Number",
    "F16B": "ECU Cal-Config #2 Part Number",
    "F16C": "ECU Cal-Config #3 Part Number",
    "F16D": "ECU Cal-Config #4 Part Number",
    "F16E": "ECU Cal-Config #5 Part Number",
    "F17D": "ECU Cal-Config #6 Part Number",
    "F1D0": "ECU MAC Address 1",
    "F1D1": "ECU MAC Address 2"
  },
  "module_editorial": {
    "716": {
      "does": "Central gateway: routes diagnostic and network traffic between the vehicle's CAN networks. Scan tools need it working to reach modules on other networks.",
      "ev": "Central to the Lightning's mixed CAN / CAN-FD architecture.",
      "ice": "Routes between HS-CAN1/2/3/4 on 2016+ CGEA 1.3 and FNV2 vehicles.",
      "risk": "high",
      "touch": "Do not write as-built here."
    },
    "726": {
      "does": "Body control (BCM): exterior and interior lighting logic, door locks, key fob / passive entry, horn and chime behavior, wipers, TPMS thresholds, power-point timers. The most commonly edited module.",
      "ev": "Same role as on gas F-150s; the Lightning adds charge-port and frunk functions elsewhere.",
      "ice": "Hosts double-honk disable, Bambi mode, TPMS PSI thresholds, global windows, and auto start/stop settings.",
      "risk": "medium",
      "touch": "Most community mods live here; change one nibble at a time."
    },
    "7D0": {
      "does": "SYNC infotainment computer (APIM): touchscreen UI, camera view options, splash screen, climate bar layout, navigation settings.",
      "ev": "SYNC 4 on the Lightning also surfaces EV-specific screens.",
      "ice": "SYNC 2 (2011\u20132015), SYNC 3 (2016\u20132020), or SYNC 4 (2021+): splash animations, climate icons, and camera views.",
      "risk": "medium",
      "touch": "A bad write can leave SYNC in a boot loop: keep a verified backup and the factory file."
    },
    "720": {
      "does": "Instrument cluster (IPC): gauges, warning messages and chimes, unit/format options, cluster configuration.",
      "ev": "The Lightning's cluster shows EV range/power; many gas-engine cluster options do not apply.",
      "ice": "Hosts digital coolant/trans temps above gauges, DPF % screen & OCR regen on Super Duty diesels, and chime toggles.",
      "risk": "medium",
      "touch": "Chime and display options; verify year/powertrain compatibility before writing."
    },
    "706": {
      "does": "Image Processing Module A (IPMA): the windshield camera and ADAS vision (lane keeping, BlueCruise inputs, traffic sign recognition) and several camera-view settings.",
      "ev": "Linked to BlueCruise on equipped trucks.",
      "ice": "Controls lane-keeping, adaptive high-beam / Glare-Free lighting, and 360 camera views on equipped vehicles.",
      "risk": "high",
      "touch": "ADAS-related: treat as locked unless the exact recipe is verified on your platform."
    },
    "740": {
      "does": "Driver door module (DDM): driver window, mirror, door lock and courtesy lighting functions; hosts several global-window and auto-fold-mirror settings.",
      "ev": "Same function as gas trucks.",
      "ice": "On 2011\u20132020 CGEA 1.2/1.3 vehicles, DDM (740) sits on 125 kbaud MS-CAN (STP53).",
      "risk": "low",
      "touch": "Usually changed together with 741 (passenger door)."
    },
    "741": {
      "does": "Passenger door module (PDM): passenger-side counterpart of the driver door module.",
      "ev": "Same function as gas trucks.",
      "ice": "On 2011\u20132020 CGEA 1.2/1.3 vehicles, PDM (741) sits on 125 kbaud MS-CAN (STP53).",
      "risk": "low",
      "touch": "Change together with 740 so both doors match."
    },
    "724": {
      "does": "Steering column control module (SCCM): turn signal and wiper stalks, steering-column switches (for example lane-change flash count).",
      "ev": "Same function as gas trucks.",
      "ice": "Controls turn-signal flash count, heated steering wheel button, and cruise control stalk switches.",
      "risk": "low",
      "touch": ""
    },
    "760": {
      "does": "Anti-lock brake / stability control module (ABS); on EVs it also coordinates regenerative braking blending.",
      "ev": "Brake blending makes this safety-critical.",
      "ice": "Controls stability control and G.O.A.T. / Terrain / FX4 drive mode unlocks on Bronco and Maverick.",
      "risk": "critical",
      "touch": "Do not write as-built here."
    },
    "730": {
      "does": "Power steering control (PSCM, shown as EPS/PCSM in Ford's list because the address is shared with a seat module on other models).",
      "ev": "Steering assist is safety-critical.",
      "ice": "Electronic power-assisted steering (EPAS) calibration and pull-drift compensation.",
      "risk": "critical",
      "touch": "Do not write as-built here."
    },
    "7E7": {
      "does": "In Ford's module list this address is 'Air Conditioning Control Module / Battery Energy Control Module'. On BEVs/PHEVs the BECM supervises the high-voltage battery: state of charge, cell voltages, temperatures, contactors.",
      "ev": "High-voltage battery management.",
      "ice": "Not present as BECM on conventional ICE vehicles (used for ACCM or hybrid battery control on HEV/PHEV).",
      "risk": "critical",
      "touch": "Do not write as-built here. Reading is fine."
    },
    "746": {
      "does": "Secondary OBD Control Module C / DC-to-DC converter: charges the 12V battery from the high-voltage pack and powers the 12V system while the EV is awake.",
      "ev": "Key to the 12V behavior that matters during FORScan sessions.",
      "ice": "EV/Hybrid-specific high-voltage DC-DC controller; conventional ICE vehicles use an alternator and BMS on 726.",
      "risk": "critical",
      "touch": "Do not write as-built here."
    },
    "7E0": {
      "does": "Powertrain control module (PCM) address. Controls engine and transmission calibration on ICE/Hybrid vehicles.",
      "ev": "Role differs from the gas F-150 (split across EV controllers on BEVs).",
      "ice": "Primary engine/transmission controller (EcoBoost, Coyote 5.0L, Power Stroke 6.7L). Locked against raw as-built writes.",
      "risk": "critical",
      "touch": "Powertrain: locked."
    },
    "727": {
      "does": "Audio control module (ACM: radio/amplifier head functions, active noise control / fake engine sound).",
      "ev": "",
      "ice": "Hosts Fake Engine Noise (FENG / ESE) disable on EcoBoost F-150, Explorer ST, Mustang, and Bronco.",
      "risk": "low",
      "touch": "Sound options only."
    },
    "783": {
      "does": "Audio digital signal processor (DSP: equalization and speaker channels).",
      "ev": "",
      "ice": "",
      "risk": "low",
      "touch": ""
    },
    "733": {
      "does": "Climate control (HVAC) module.",
      "ev": "Heat-pump / battery-conditioning interplay on EVs.",
      "ice": "Dual-zone / single-zone climate control; sits on 125 kbaud MS-CAN (STP53) on 2011\u20132020 vehicles.",
      "risk": "medium",
      "touch": ""
    }
  },
  "entries": [
    {
      "id": 15,
      "source_key": "altctrlwrench:f150/door_ajar_warning_chime_disable.acwrecipe",
      "title": "Door Ajar Warning Chime Disable",
      "raw_title": "Disables door ajar chime",
      "category": "Chimes and Horn",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/door_ajar_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "see IPC spreadsheet to disable EIOCM",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: door chime nag",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xx*x xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "see IPC spreadsheet to disable EIOCM | Engine/Ignition On chime disabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 60,
      "source_key": "altctrlwrench:bronco/door_ajar_warning_chime_disable.acwrecipe",
      "title": "Door Ajar Warning Chime Disable",
      "raw_title": "Disables door ajar chime",
      "category": "Chimes and Horn",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/door_ajar_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0 = (still chimes once...but not endlessly)\nConfirmed: LagoCJ/multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: door chime nag",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0 = (still chimes once...but not endlessly)\nConfirmed: LagoCJ/multi"
        }
      ],
      "import_issues": []
    },
    {
      "id": 61,
      "source_key": "altctrlwrench:ranger_6g/door_ajar_warning_chime_disable.acwrecipe",
      "title": "Door Ajar Warning Chime Disable",
      "raw_title": "Disables door ajar chime",
      "category": "Chimes and Horn",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/door_ajar_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Chimes Vehicle Running with Door open (Set to Disabled in Menu driven IPC)\nTrim: All [Confirmed: craigc (7/31/24) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Chimes Vehicle Running with Door open (Set to Disabled in Menu driven IPC)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: door chime nag",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xx*x xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Engine/Ignition On Chime disabled (correct values are 0, 4, 8, or C)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 62,
      "source_key": "altctrlwrench:super_duty/door_ajar_warning_chime_disable.acwrecipe",
      "title": "Door Ajar Warning Chime Disable",
      "raw_title": "Door Ajar - Chime Disable",
      "category": "Chimes and Horn",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/door_ajar_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Subtract 4 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: door chime nag",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Subtract 4 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 16,
      "source_key": "altctrlwrench:f150/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "title": "Double Horn Honk on Keyless Exit Disable",
      "raw_title": "Double Horn Honk disable (2021-2026)",
      "category": "Chimes and Horn",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "disables double honk when exiting running vehicle",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: stops the double-honk on key-fob exit",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-63-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "disables double honk when exiting running vehicle"
        }
      ],
      "import_issues": []
    },
    {
      "id": 63,
      "source_key": "altctrlwrench:bronco/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "title": "Double Horn Honk on Keyless Exit Disable",
      "raw_title": "Double Horn Honk disable",
      "category": "Chimes and Horn",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0 = disables double honk when exiting running vehicle\nConfirmed: D2dhanover/multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM",
      "system_name": "BDYCM",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: stops the double-honk on key-fob exit",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM",
          "address": "726-63-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0 = disables double honk when exiting running vehicle\nLPKENEC DISABLED\nConfirmed: D2dhanover/multi"
        }
      ],
      "import_issues": []
    },
    {
      "id": 64,
      "source_key": "altctrlwrench:explorer/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "title": "Double Horn Honk on Keyless Exit Disable",
      "raw_title": "Disable Double Honk",
      "category": "Chimes and Horn",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "disables double honk when exiting the vehicle.",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: stops the double-honk on key-fob exit",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-63-02",
          "mask": "xxx* xxxx xxxx",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 65,
      "source_key": "altctrlwrench:ranger_6g/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "title": "Double Horn Honk on Keyless Exit Disable",
      "raw_title": "Disable double honk when leaving cabin",
      "category": "Chimes and Horn",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Double Honk On Leaving Cabin (Change Enabled to Disabled)\nTrim: All [Confirmed: Waffel (1/1/25) Lariat]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Double Honk On Leaving Cabin (Change Enabled to Disabled)",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: stops the double-honk on key-fob exit",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-63-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled (target setting), 1=Enabled (Default)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 66,
      "source_key": "altctrlwrench:super_duty/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "title": "Double Horn Honk on Keyless Exit Disable",
      "raw_title": "Double Honk w/o Key in Truck",
      "category": "Chimes and Horn",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/double_horn_honk_on_keyless_exit_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disable  1=Enable",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: stops the double-honk on key-fob exit",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-63-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disable  1=Enable | Set to disable (0)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 67,
      "source_key": "altctrlwrench:super_duty/double_horn_honk_on_keyless_exit_disable_2.acwrecipe",
      "title": "Double Horn Honk on Keyless Exit Disable (variant 2)",
      "raw_title": "Double Horn on Lock key fob in truck",
      "category": "Chimes and Horn",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/double_horn_honk_on_keyless_exit_disable_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disable  1=Enable",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: stops the double-honk on key-fob exit",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-63-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "0=Disable  1=Enable | Set to disable (0)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 68,
      "source_key": "altctrlwrench:super_duty/factory_autofold_mirrors_enable.acwrecipe",
      "title": "Factory Autofold Mirrors Enable",
      "raw_title": "Autofold Mirror Factory",
      "category": "Windows and Mirrors",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/factory_autofold_mirrors_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disabled  1 Enabled Factory Folding Mirror Enabled",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common: auto-fold mirrors",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-03-03",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled  1 Enabled Factory Folding Mirror Enabled"
        },
        {
          "module": "PDM",
          "address": "741-03-03",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled  1 Enabled Factory Folding Mirror Enabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 69,
      "source_key": "altctrlwrench:explorer/global_windows_remote_close_enable.acwrecipe",
      "title": "Global Windows Remote Close Enable",
      "raw_title": "Enable Global Windows Close\n\nhttps://www.explorerst.org/threads/global-windows\n-close-enable-2025-explorer.9064/",
      "category": "Windows and Mirrors",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/global_windows_remote_close_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "[BCM] - - Enable the following from DISABLED to ENABLED in BdyCM (easy way): \n-Global Close (change from Disabled to Remote)**\n-Global Close - Vehicle\n-Global Close - Initial Value\n-Global Close - Personal 1\n-Global Close - Personal 2\n-Global Close - Personal 3\n-Global Close - Personal 4",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "PDM",
      "system_name": "Passenger Door Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: key-fob window open/close",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "PDM",
          "address": "741-06-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "[BCM] - - Enable the following from DISABLED to ENABLED in BdyCM (easy way): \n-Global Close (change from Disabled to Remote)**\n-Global Close - Vehicle\n-Global Close - Initial Value\n-Global Close - Personal 1\n-Global Close - Personal 2\n-Global Close - Personal 3\n-Global Close - Personal 4"
        },
        {
          "module": "DDM",
          "address": "740-06-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 26,
      "source_key": "altctrlwrench:f150/global_windows_remote_open_close_enable.acwrecipe",
      "title": "Global Windows Remote Open/Close Enable",
      "raw_title": "(2021-2023) Global Windows Open/Close \n(driver/pass windows only)",
      "category": "Windows and Mirrors",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2023",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/global_windows_remote_open_close_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Optional: to add Global Open/Close to Sync 4 Settings menu set this in APIM: 7D0-09-01- xxxx xExx xx--'",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: key-fob window open/close",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-06-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Optional: to add Global Open/Close to Sync 4 Settings menu set this in APIM: 7D0-09-01- xxxx xExx xx--"
        },
        {
          "module": "PDM",
          "address": "741-06-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "DDM",
          "address": "740-06-03",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "PDM",
          "address": "741-06-03",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "To roll down windows press unlock button on fob and then press again and hold"
        },
        {
          "module": "BCM",
          "address": "726-11-02",
          "mask": "xx** xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "To roll up windows press lock button on fob and then press again and hold"
        },
        {
          "module": "BCM",
          "address": "726-22-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-22-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 27,
      "source_key": "altctrlwrench:f150/global_windows_remote_open_close_enable_2.acwrecipe",
      "title": "Global Windows Remote Open/Close Enable (variant 2)",
      "raw_title": "(2024-2026)  Global Windows Open/Close \n(driver/pass windows only)",
      "category": "Windows and Mirrors",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2024-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/global_windows_remote_open_close_enable_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Optional: to add Global Open/Close to Sync 4 Settings menu set this in APIM: 7D0-09-01- xxxx xExx xx--'",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: key-fob window open/close",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-06-02",
          "mask": "xxxx xxx* **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "Optional: to add Global Open/Close to Sync 4 Settings menu set this in APIM: 7D0-09-01- xxxx xExx xx--"
        },
        {
          "module": "PDM",
          "address": "741-06-02",
          "mask": "xxxx xxx* **--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "see source"
            }
          ],
          "feature_name": "Global Close",
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-11-02",
          "mask": "x*xx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "To roll down windows press unlock button on fob and then press again and hold"
        },
        {
          "module": "BCM",
          "address": "726-22-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "To roll up windows press lock button on fob and then press again and hold"
        },
        {
          "module": "BCM",
          "address": "726-22-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": [
        "741-06-02: nibble None is not a '*' position in mask 'xxxx xxx* **--'"
      ]
    },
    {
      "id": 70,
      "source_key": "altctrlwrench:bronco/startup_triple_ding_chime_disable.acwrecipe",
      "title": "Startup Triple Ding Chime Disable",
      "raw_title": "Disables Triple Ding at Start up (Doo, doo, doo)",
      "category": "Chimes and Horn",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/startup_triple_ding_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Confirmed: mrjking200",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: silence startup chimes",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xxxx x*-- xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "2"
            }
          ],
          "feature_name": null,
          "notes": "Seatbelt warning market to ECE"
        }
      ],
      "import_issues": []
    },
    {
      "id": 71,
      "source_key": "altctrlwrench:ranger_6g/startup_triple_ding_chime_disable.acwrecipe",
      "title": "Startup Triple Ding Chime Disable",
      "raw_title": "Disables \"do do do\" chime on startup",
      "category": "Chimes and Horn",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/startup_triple_ding_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Seatbelt Warning Market (Change USA to Europe)\nTrim: All [Confirmed: craigc (9/5/24) Lariat FX4]\nCan use Forscan easy mode to change this\nBit 2 (add 2 to make silent, e.g. change 0 to 2)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Seatbelt Warning Market (Change USA to Europe)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: silence startup chimes",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "1": 1
              }
            }
          ],
          "feature_name": "Seatbelt Warning Market (SWM)",
          "notes": "Can use Forscan easy mode to change this\nBit 2 (add 2 to make silent, e.g. change 0 to 2, etc)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 72,
      "source_key": "altctrlwrench:super_duty/startup_triple_ding_chime_disable.acwrecipe",
      "title": "Startup Triple Ding Chime Disable",
      "raw_title": "Triple Ding at Start Up",
      "category": "Chimes and Horn",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/startup_triple_ding_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: silence startup chimes",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "2"
            }
          ],
          "feature_name": "Seatbelt Warning Market (SWM)",
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 3,
      "source_key": "altctrlwrench:f150/360_bed_camera_display_at_speed.acwrecipe",
      "title": "360 & Bed Camera Display at Speed",
      "raw_title": "Enable Cameras at Speed",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/360_bed_camera_display_at_speed.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPMA",
      "system_name": "Camera / Image Processing (IPMA)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common: camera views at speed",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPMA",
          "address": "706-02-02",
          "mask": "xxx* **xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "F"
            },
            {
              "kind": "set",
              "pos": 4,
              "hex": "C"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "E"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "APIM",
          "address": "7D0-01-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "F"
            }
          ],
          "feature_name": "Rear Camera (RC)",
          "notes": "Rear camera present, does NOT change front, split, or 360."
        },
        {
          "module": "APIM",
          "address": "7D0-01-04",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "F"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "D"
            }
          ],
          "feature_name": null,
          "notes": "use FF if you have 1-pedal drive"
        }
      ],
      "import_issues": []
    },
    {
      "id": 7,
      "source_key": "altctrlwrench:f150/auto_relock_on_unopened_door_enable.acwrecipe",
      "title": "Auto Relock on Unopened Door Enable",
      "raw_title": "Auto Relock - if you hit the unlock button on the fob and do not open a door within the timer it will lock the truck",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/auto_relock_on_unopened_door_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-20-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-27-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-58-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Use this on 2021-23   duration: 1=30 seconds, 2=45 secs (target setting) | No data table"
        },
        {
          "module": "BCM",
          "address": "726-58-02",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Use this on 2024-26   duration: 1=30 seconds, 2=45 secs (target setting)"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "3"
            }
          ],
          "feature_name": null,
          "notes": "optional - adds Autorelock to settings, vehicle, locks"
        }
      ],
      "import_issues": []
    },
    {
      "id": 73,
      "source_key": "altctrlwrench:explorer/auto_relock_on_unopened_door_enable.acwrecipe",
      "title": "Auto Relock on Unopened Door Enable",
      "raw_title": "Auto Relock - if you hit the unlock button on the fob and do not open a door within the timer it will lock the Explorer",
      "category": "Locks and Security",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2020-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2020-2024 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/auto_relock_on_unopened_door_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Use this on 2021-23   duration: 1=30 seconds, 2=45 secs\noptional - adds Autorelock to settings, vehicle, locks",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-20-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-27-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-58-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Use this on 2021-23   duration: 1=30 seconds, 2=45 secs | 0=null, 1=3 sec, 2 (set) = 45 seconds"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "3"
            }
          ],
          "feature_name": null,
          "notes": "optional - adds Autorelock to settings, vehicle, locks | Enables autolock control, unlock control, and sets relock on"
        }
      ],
      "import_issues": []
    },
    {
      "id": 74,
      "source_key": "altctrlwrench:mustang/auto_relock_on_unopened_door_enable.acwrecipe",
      "title": "Auto Relock on Unopened Door Enable",
      "raw_title": "Auto Relock - if you hit the unlock button on the fob and do not open a door within the timer it will lock the truck",
      "category": "Locks and Security",
      "platform": "Mustang",
      "platform_slug": "mustang",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2024 Mustang Darkhorse (public).xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/mustang/auto_relock_on_unopened_door_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "*= 1 for 30 seconds, 2 for 45 seconds\noptional - adds Autorelock to settings, vehicle, locks",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-20-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-27-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-58-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "*= 1 for 30 seconds, 2 for 45 seconds"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "2"
            }
          ],
          "feature_name": "Auto Relock (AR)",
          "notes": "optional - adds Autorelock to settings, vehicle, locks"
        }
      ],
      "import_issues": []
    },
    {
      "id": 75,
      "source_key": "altctrlwrench:ranger_6g/auto_relock_on_unopened_door_enable.acwrecipe",
      "title": "Auto Relock on Unopened Door Enable",
      "raw_title": "Auto Relock (Sync Menu)",
      "category": "Locks and Security",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/auto_relock_on_unopened_door_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Set on and control functions enabled\nCan be changed using Forscan easy mode\nFORScan Menu: Auto Relock (Disabled (Default), Enabled)\nTrim: All?",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Auto Relock (Disabled (Default), Enabled)",
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 1,
                "1": 1,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Bit 2 (add 2 to enable, e.g. change 1 to 3)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 76,
      "source_key": "altctrlwrench:explorer/auto_relock_on_unopened_door_enable_2.acwrecipe",
      "title": "Auto Relock on Unopened Door Enable (variant 2)",
      "raw_title": "Auto Relock - if you hit the unlock button on the fob and do not open a door within the timer it will lock the Explorer",
      "category": "Locks and Security",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/auto_relock_on_unopened_door_enable_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Sets for all 4 profiles",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-20-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-27-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-58-02",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": 1,
              "text": "Use this on 2024-25   duration: 1=30 seconds, 2=45 secs"
            }
          ],
          "feature_name": "AutoRelock_Timeduration_Cfg (ARTC)",
          "notes": "Use this on 2024-25   duration: 1=30 seconds, 2=45 secs"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "3"
            }
          ],
          "feature_name": null,
          "notes": "optional - adds Autorelock to settings, vehicle, locks"
        }
      ],
      "import_issues": []
    },
    {
      "id": 9,
      "source_key": "altctrlwrench:f150/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "title": "Bambi Mode (High Beams with Fog Lights)",
      "raw_title": "Fogs on when high beams are on (aka Bambi Mode) (2021-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Sets front fog allowed with high beams",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'fog': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common lighting mod",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-39-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 77,
      "source_key": "altctrlwrench:explorer/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "title": "Bambi Mode (High Beams with Fog Lights)",
      "raw_title": "Bambi Fog Light Mode",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Fog lights remain on with high beams activated, once button is pressed.",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'fog': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common lighting mod",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-39-02",
          "mask": "xxx* xxxx xxxx",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 78,
      "source_key": "altctrlwrench:ranger_6g/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "title": "Bambi Mode (High Beams with Fog Lights)",
      "raw_title": "Leave fogs on when high beams are on (aka Bambi Mode)",
      "category": "Lighting",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Using Front Fog With High Beam (Allowed, Inhibited (Default))\nTrim: All [Confirmed: pablo94sc (9/9/24)]\nOBS: Brazilian RRaptor is enabled by default",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Using Front Fog With High Beam (Allowed, Inhibited (Default))",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'fog': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common lighting mod",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-39-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Allowed (target setting), 1=Inhibited (Default)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 79,
      "source_key": "altctrlwrench:super_duty/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "title": "Bambi Mode (High Beams with Fog Lights)",
      "raw_title": "Bambi Mode (High Beams / Fogs)",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/bambi_mode_high_beams_with_fog_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Enabled  1=Disabled",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'fog': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "very common lighting mod",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-39-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "0=Enabled  1=Disabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 80,
      "source_key": "altctrlwrench:bronco/global_windows_remote_open_close_enable.acwrecipe",
      "title": "Global Windows Remote Open/Close Enable",
      "raw_title": "Global Windows Open/Close",
      "category": "Windows and Mirrors",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/global_windows_remote_open_close_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "To roll down windows press unlock button on fob and then press again and hold\nTo roll up windows press lock button on fob and then press again and hold\nConfirmed: Bigmoose/multi\nOptional: E - Add Global Window Open/Close to Sybc 4 settings menu",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: key-fob window open/close",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-06-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "To roll down windows press unlock button on fob and then press again and hold\nTo roll up windows press lock button on fob and then press again and hold"
        },
        {
          "module": "PDM",
          "address": "741-06-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "DDM",
          "address": "740-06-03",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "PDM",
          "address": "741-06-03",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BDYCM",
          "address": "726-11-02",
          "mask": "xx** xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BDYCM",
          "address": "726-22-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BDYCM",
          "address": "726-22-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 1,
                "2": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Optional: E - Add Global Window Open/Close to Sybc 4 settings menu"
        }
      ],
      "import_issues": []
    },
    {
      "id": 81,
      "source_key": "altctrlwrench:super_duty/global_windows_remote_open_close_enable.acwrecipe",
      "title": "Global Windows Remote Open/Close Enable",
      "raw_title": "Global Open/Close",
      "category": "Windows and Mirrors",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/global_windows_remote_open_close_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "top community request: key-fob window open/close",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "E"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "DDM",
          "address": "740-06-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "PDM",
          "address": "741-06-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "DDM",
          "address": "740-06-03",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "PDM",
          "address": "741-06-03",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-11-02",
          "mask": "xx** xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-22-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-22-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 35,
      "source_key": "altctrlwrench:f150/lincoln_style_autofold_mirrors.acwrecipe",
      "title": "Lincoln Style Autofold Mirrors",
      "raw_title": "(2021-2023) Mirrors - Lincoln Autofold",
      "category": "Windows and Mirrors",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2023",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/lincoln_style_autofold_mirrors.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Link for explanation of regular autofold vs Lincoln autofold https://www.f150forum.com/f129/forscan-14th-gen-f150s-481816/index51/#post6947182\nNote: the tradeoff of using Lincoln Autofold is that puddle lights won't work",
      "warnings": "Puddle lights will not illuminate when Lincoln style autofold is active.",
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common: auto-fold mirrors",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-03-16",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "click here for an explanation of regular autofold vs Lincoln autofold"
        },
        {
          "module": "PDM",
          "address": "741-03-16",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Note: the tradeoff of using Lincoln Autofold is that puddle lights won't work"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xxxx xx*x xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 6,
              "hex": "A"
            }
          ],
          "feature_name": "Mirrors Autofold (MA)",
          "notes": "Add 4 to current value to enable reverse tilt."
        }
      ],
      "import_issues": []
    },
    {
      "id": 82,
      "source_key": "altctrlwrench:super_duty/lincoln_style_autofold_mirrors.acwrecipe",
      "title": "Lincoln Style Autofold Mirrors",
      "raw_title": "Autofold Mirror Lincoln Style",
      "category": "Windows and Mirrors",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/lincoln_style_autofold_mirrors.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disabled  1 Enabled  Folding Mirror at door close.  Does not open at unlock. (Disables Puddle Lights)",
      "warnings": "Puddle lights will not illuminate when Lincoln style autofold is active.",
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 2,
      "tier_reason": "recipe lists warnings/prerequisites",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common: auto-fold mirrors",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-03-16",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled  1 Enabled  Folding Mirror at door close.  Does not open at unlock. (Disables Puddle Lights)"
        },
        {
          "module": "PDM",
          "address": "741-03-16",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled  1 Enabled  Folding Mirror at door close.  Does not open at unlock. (Disables Puddle Lights)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 58,
      "source_key": "altctrlwrench:f150/walk_away_lock_audible_horn_feedback.acwrecipe",
      "title": "Walk Away Lock Audible Horn Feedback",
      "raw_title": "Walk Away Lock Audible Feedback (2024-2026 only) - sounds the horn when doors are locked with the Walk Away Lock enabled",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/walk_away_lock_audible_horn_feedback.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-89-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-90-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "No data table"
        },
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "C"
            }
          ],
          "feature_name": null,
          "notes": "Enables walk away lock with feedback. subtract 4 from target value to disable feedback"
        }
      ],
      "import_issues": []
    },
    {
      "id": 83,
      "source_key": "altctrlwrench:explorer/walk_away_lock_audible_horn_feedback.acwrecipe",
      "title": "Walk Away Lock Audible Horn Feedback",
      "raw_title": "Enable Walk Away Lock (Audible)\n\nhttps://www.explorerst.org/threads/adding-walk-\naway-lock-feature-for-2025-ford-explorers-with-\naudible-feedback.9073/",
      "category": "Locks and Security",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/walk_away_lock_audible_horn_feedback.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-89-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-89-02",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-90-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "C"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 84,
      "source_key": "altctrlwrench:mustang/walk_away_lock_audible_horn_feedback.acwrecipe",
      "title": "Walk Away Lock Audible Horn Feedback",
      "raw_title": "Walk Away Lock Feedback (horn sounds)",
      "category": "Locks and Security",
      "platform": "Mustang",
      "platform_slug": "mustang",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2024 Mustang Darkhorse (public).xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/mustang/walk_away_lock_audible_horn_feedback.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-91-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-97-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "C"
            }
          ],
          "feature_name": "Walk Away Lock Feedback (WALF)",
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 85,
      "source_key": "altctrlwrench:super_duty/walk_away_lock_audible_horn_feedback.acwrecipe",
      "title": "Walk Away Lock Audible Horn Feedback",
      "raw_title": "Walk Away Lock Audible Feedback",
      "category": "Locks and Security",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/walk_away_lock_audible_horn_feedback.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "sounds the horn when doors are locked with the Walk Away Lock enabled",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-89-01",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-90-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "C"
            }
          ],
          "feature_name": "Walk Away Lock Feedback (WALF)",
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 59,
      "source_key": "altctrlwrench:f150/walk_away_lock_enable.acwrecipe",
      "title": "Walk Away Lock Enable",
      "raw_title": "Walk Away Lock (2024-2026 only) - locks the vehicle when you walk away",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/walk_away_lock_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-89-02",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-90-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "No data table"
        },
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "8"
            }
          ],
          "feature_name": null,
          "notes": "Enables walk away lock with feedback. subtract 4 to disable feedback"
        }
      ],
      "import_issues": []
    },
    {
      "id": 86,
      "source_key": "altctrlwrench:mustang/walk_away_lock_enable.acwrecipe",
      "title": "Walk Away Lock Enable",
      "raw_title": "Walk Away Lock (Job2 Mustang or Job1 that had a BCM update)",
      "category": "Locks and Security",
      "platform": "Mustang",
      "platform_slug": "mustang",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2024 Mustang Darkhorse (public).xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/mustang/walk_away_lock_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-91-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-97-02",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 87,
      "source_key": "altctrlwrench:super_duty/walk_away_lock_enable.acwrecipe",
      "title": "Walk Away Lock Enable",
      "raw_title": "Walk Away Lock",
      "category": "Locks and Security",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/walk_away_lock_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 3,
      "popularity_reason": "common convenience lock behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-89-02",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BDYCM-BCM",
          "address": "726-90-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "8"
            }
          ],
          "feature_name": null,
          "notes": "Enables walk away lock plus walk away lock feedback"
        }
      ],
      "import_issues": []
    },
    {
      "id": 1,
      "source_key": "altctrlwrench:f150/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Duration",
      "raw_title": "Power Point Timeout Duration (in seconds converted to hex) (2021-2026)",
      "category": "Convenience and Electrical",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0001=1 second, 600=10 minutes, 1800=30 minutes, 3600=1hr. Ensure Power Point Timeout is not disabled.  Longer times possible (use calculator)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-57-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0,
                1,
                2,
                3
              ],
              "text": "0001=1 second, 600=10 minutes, 1800=30 minutes, 3600=1hr. Ensure Power Point Timeout is not disabled.  Longer times possible (use calculator)",
              "unit": "seconds",
              "continuous": true
            }
          ],
          "feature_name": "Power_Point_Maxtime_Cfg (PPMC)",
          "notes": "0001=1 second"
        }
      ],
      "import_issues": []
    },
    {
      "id": 88,
      "source_key": "altctrlwrench:bronco/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Duration",
      "raw_title": "Power Point Timeout Duration (in seconds converted to hex)",
      "category": "Convenience and Electrical",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Calculator: https://docs.google.com/spreadsheets/d/15RmCgd740T10K0PnG44p42FCod9BSG3f6yrUc0X5qxw/edit?usp=sharing\n0001 for 1 second, 001E for 30 seconds, 003C for 1 minute, 012C for 5 minutes, 0258 for 10 minutes, 0708 for 30 minutes, and 0E10 for 1 hour",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM",
      "system_name": "BDYCM",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM",
          "address": "726-57-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0,
                1,
                2,
                3
              ],
              "text": "Calculator: https://docs.google.com/spreadsheets/d/15RmCgd740T10K0PnG44p42FCod9BSG3f6yrUc0X5qxw/edit?usp=sharing",
              "unit": "seconds",
              "continuous": true
            }
          ],
          "feature_name": "Power_Point_Maxtime_Cfg (PPMC)",
          "notes": "DeltaNu1142's power point timeout calculator"
        }
      ],
      "import_issues": []
    },
    {
      "id": 89,
      "source_key": "altctrlwrench:explorer/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Duration",
      "raw_title": "Powerpoint Timeout Duration (1 second)",
      "category": "Convenience and Electrical",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "turns off power point to 1 second after vehicle shuts off. Range: 1 - 64800. 0001 for 1 second, 001E for 30 seconds, 003C for 1 minute, 012C for 5 minutes, 0258 for 10 minutes, 0708 for 30 minutes, and 0E10 for 1 hour. FD20 for 18 hours",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-57-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 90,
      "source_key": "altctrlwrench:ranger_6g/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Duration",
      "raw_title": "Power Point Timeout Duration",
      "category": "Convenience and Electrical",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0001=1 second.  convert decimal value to hex.   For example 3600 seconds equates to 0E10, and 1800 seconds is 0708\nFORScan Menu: Power Point Timeout, s (Set to # of seconds desired (e.g. 1800 for 30 minutes))\nTrim: All [Confirmed: craigc (9/16/2024) Lariat]\nDeltaNu1142's power point timeout calculator",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Power Point Timeout, s (Set to # of seconds desired (e.g. 1800 for 30 minutes))",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-57-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0,
                1,
                2,
                3
              ],
              "text": "0001=1 second.  convert decimal value to hex.   For example 3600 seconds equates to 0E10, and 1800 seconds is 0708",
              "unit": "seconds",
              "continuous": true
            }
          ],
          "feature_name": "Power_Point_Maxtime_Cfg (PPMC)",
          "notes": "0001=1 second.  convert decimal value to hex.   For example 3600 seconds equates to 0E10, and 1800 seconds is 0708\nFORScan Menu: Power Point Timeout, s (Set to # of seconds desired (e.g. 1800 for 30 minutes))\nTrim: All [Confirmed: craigc (9/16/2024) Lariat]"
        }
      ],
      "import_issues": []
    },
    {
      "id": 91,
      "source_key": "altctrlwrench:super_duty/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Duration",
      "raw_title": "PowerPoint Max Timeout",
      "category": "Convenience and Electrical",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/12v_power_outlet_power_point_timeout_duration.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Seconds converted to Hex (Stock is 1194-75 minutes)\n0001 for 1 second, 001E for 30 seconds, 003C for 1 minute, 012C for 5 minutes, 0258 for 10 minutes, 0708 for 30 minutes, and 0E10 for 1 hour",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-57-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0,
                1,
                2,
                3
              ],
              "text": "Seconds converted to Hex (Stock is 1194-75 minutes)",
              "unit": "seconds",
              "continuous": true
            }
          ],
          "feature_name": "Power_Point_Maxtime_Cfg (PPMC)",
          "notes": "Seconds converted to Hex (Stock is 1194-75 minutes)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 2,
      "source_key": "altctrlwrench:f150/12v_power_outlet_power_point_timeout_enable_d.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Enable/Disable",
      "raw_title": "Power Point Timeout Configuration (2021-2026)",
      "category": "Convenience and Electrical",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/12v_power_outlet_power_point_timeout_enable_d.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "disabled (always on)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-57-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "disabled (always on)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 92,
      "source_key": "altctrlwrench:explorer/12v_power_outlet_power_point_timeout_enable_d.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Enable/Disable",
      "raw_title": "Powerpoint Timeout disable",
      "category": "Convenience and Electrical",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/12v_power_outlet_power_point_timeout_enable_d.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "this will disable the timeout, be aware it will be constant powered and can deplete battery.",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-57-01",
          "mask": "xxxx x*xx",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 93,
      "source_key": "altctrlwrench:ranger_6g/12v_power_outlet_power_point_timeout_enable_d.acwrecipe",
      "title": "12V Power Outlet (Power Point) Timeout Enable/Disable",
      "raw_title": "Power Point Timeout Configuration",
      "category": "Convenience and Electrical",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/12v_power_outlet_power_point_timeout_enable_d.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "12v outlet power off (seconds) after AUX is off.  Affects center console power port as well as the one in the truck bed, but not the USB ports or 120VAC\n0 - disabled (target setting) = always on\n1 - enabled = use timeout duration setting. \nFORScan Menu: Power Point Feature (Disabled (Always on), Enabled (use timeout - Default))\nTrim: All [Confirmed: craigc (9/16/2024) Lariat]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Power Point Feature (Disabled (Always on), Enabled (use timeout - Default))",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: 12V outlet timeout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-57-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0 - disabled/always on, 1-enabled/use timeout duration above.   12v outlet power off (seconds) after AUX is off.  Affects center console power port as well as the one in the truck bed, but not the USB ports or 120VAC\nFORScan Menu: Power Point Feature (Disabled (Always on), Enabled (use timeout - Default))\nTrim: All [Confirmed: craigc (9/16/2024) Lariat]"
        }
      ],
      "import_issues": []
    },
    {
      "id": 13,
      "source_key": "altctrlwrench:f150/digital_gauge_numeric_temperatures_display_en.acwrecipe",
      "title": "Digital Gauge Numeric Temperatures Display (Engine & Trans)",
      "raw_title": "Enable digital temps for engine & transmission on 12\" digital cluster only",
      "category": "Cluster and Displays",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/digital_gauge_numeric_temperatures_display_en.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "E5 (turbo & trailer brake controller), 65 (turbo & no TBC), A5 (non-turbo & TBC), 25 (non-turbo & no TBC)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 2,
      "popularity_reason": "popular cluster tweak",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx x**x xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "2": 1,
                "1": 1
              }
            },
            {
              "kind": "bits",
              "pos": 6,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "E5 (turbo & trailer brake controller), 65 (turbo & no TBC), A5 (non-turbo & TBC), 25 (non-turbo & no TBC)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 94,
      "source_key": "altctrlwrench:ranger_6g/digital_gauge_numeric_temperatures_display_en.acwrecipe",
      "title": "Digital Gauge Numeric Temperatures Display (Engine & Trans)",
      "raw_title": "Digital Engine and Transmission Temperature Gauges in 12\" cluster",
      "category": "Cluster and Displays",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/digital_gauge_numeric_temperatures_display_en.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 2,
      "popularity_reason": "popular cluster tweak",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx xx*x xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 6,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Target value sets Engine and Transmission Temp display to On.  Subtract 1 from target value to disable transmission temp only. Subtract 4 from target value to disable engine temp only."
        },
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx xx*x xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 6,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Target value sets Engine and Transmission Temp display to On.  Subtract 1 from target value to disable transmission temp only. Subtract 4 from target value to disable engine temp only."
        }
      ],
      "import_issues": []
    },
    {
      "id": 95,
      "source_key": "altctrlwrench:super_duty/digital_gauge_numeric_temperatures_display_en.acwrecipe",
      "title": "Digital Gauge Numeric Temperatures Display (Engine & Trans)",
      "raw_title": "Temps on Gauges 12\" Cluster only",
      "category": "Cluster and Displays",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/digital_gauge_numeric_temperatures_display_en.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "E-Turbo/Brake Controller\n5-Turbo/No Brake Controller\nA-Non Turbo/Brake Controller\n2-Non Turbo/No Brake Controller",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 2,
      "popularity_reason": "popular cluster tweak",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "2": 1,
                "1": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "E-Turbo/Brake Controller"
        }
      ],
      "import_issues": []
    },
    {
      "id": 14,
      "source_key": "altctrlwrench:f150/digital_gauge_numeric_temperatures_display_ra.acwrecipe",
      "title": "Digital Gauge Numeric Temperatures Display (Raptor Cluster)",
      "raw_title": "Raptor Cluster - displays engine, oil, transmission digital temps on top gauges",
      "category": "Cluster and Displays",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/digital_gauge_numeric_temperatures_display_ra.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular cluster tweak",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 6,
              "hex": "5"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "4"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 34,
      "source_key": "altctrlwrench:f150/lane_change_turn_signal_flash_count.acwrecipe",
      "title": "Lane Change Turn Signal Flash Count",
      "raw_title": "Turn Signal Flashes (2021-26)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/lane_change_turn_signal_flash_count.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "add 04 (hex) to your default value for each additional flash",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "SCCM",
      "system_name": "Steering Column Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common turn-signal count",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "SCCM",
          "address": "724-01-01",
          "mask": "xxxx **xx --",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "add 04 (hex) to your default value for each additional flash"
            }
          ],
          "feature_name": "Lane Change Blink Number",
          "notes": "add 04 (hex) to your default value for each additional flash"
        }
      ],
      "import_issues": [
        "724-01-01: nibble None is not a '*' position in mask 'xxxx **xx --'"
      ]
    },
    {
      "id": 96,
      "source_key": "altctrlwrench:bronco/lane_change_turn_signal_flash_count.acwrecipe",
      "title": "Lane Change Turn Signal Flash Count",
      "raw_title": "Lane Change Blink Number",
      "category": "Lighting",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/lane_change_turn_signal_flash_count.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "* if your default value is 8C:\n80=null, 84=1, 88=2, 8C=3, 90=4, 94=5, 98=6, 9C=7, A0=8, A4=9, A8=10\n\n* if your default value is 0C:\n00=null, 04=1, 08=2, 0C=3, 10=4, 14=5, 18=6, 1C=7, 20=8, 24=9, 28=10\nConfirmed: D2dhanover",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "SCCM",
      "system_name": "Steering Column Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common turn-signal count",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "SCCM",
          "address": "724-01-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "* if your default value is 8C:\n80=null, 84=1, 88=2, 8C=3, 90=4, 94=5, 98=6, 9C=7, A0=8, A4=9, A8=10\n\n* if your default value is 0C:\n00=null, 04=1, 08=2, 0C=3, 10=4, 14=5, 18=6, 1C=7, 20=8, 24=9, 28=10"
            }
          ],
          "feature_name": "SCMHdlpWashOnTime_Cfg (SCMHWOTC)",
          "notes": "* if your default value is 8C:\n80=null, 84=1, 88=2, 8C=3, 90=4, 94=5, 98=6, 9C=7, A0=8, A4=9, A8=10\n\n* if your default value is 0C:\n00=null, 04=1, 08=2, 0C=3, 10=4, 14=5, 18=6, 1C=7, 20=8, 24=9, 28=10"
        }
      ],
      "import_issues": [
        "724-01-01: nibble None is not a '*' position in mask 'xxxx **xx xx--'"
      ]
    },
    {
      "id": 97,
      "source_key": "altctrlwrench:ranger_6g/lane_change_turn_signal_flash_count.acwrecipe",
      "title": "Lane Change Turn Signal Flash Count",
      "raw_title": "Number of lane change blinks",
      "category": "Lighting",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/lane_change_turn_signal_flash_count.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "84=1, 8C=3, 90=4, 94=5, 98=6, etc.\nFORScan Menu: Lane Change Cancel Blink Number (Set to # of blinks (Default is 3))\nConfirmed: craigc (9/16/2024) Lariat",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Lane Change Cancel Blink Number (Set to # of blinks (Default is 3))",
      "system": "SCCM",
      "system_name": "Steering Column Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common turn-signal count",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "SCCM",
          "address": "724-01-01",
          "mask": "xxxx **xx --",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "suggest use the non asbuilt menu option\n** -> 84=1, 8C=3, 90=4, 94=5, 98=6, etc.\nFORScan Menu: Lane Change Cancel Blink Number (Set to # of blinks (Default is 3))\nConfirmed: craigc (9/16/2024) Lariat"
            }
          ],
          "feature_name": "LaneChange_Cancel_Blink_Num (LCCBN)",
          "notes": "suggest use the non asbuilt menu option\n** -> 84=1, 8C=3, 90=4, 94=5, 98=6, etc.\nFORScan Menu: Lane Change Cancel Blink Number (Set to # of blinks (Default is 3))\nConfirmed: craigc (9/16/2024) Lariat"
        }
      ],
      "import_issues": [
        "724-01-01: nibble None is not a '*' position in mask 'xxxx **xx --'"
      ]
    },
    {
      "id": 17,
      "source_key": "altctrlwrench:f150/drl_allow_fog_lights_as_drl.acwrecipe",
      "title": "DRL - Allow Fog Lights as DRL",
      "raw_title": "DRLs - allow fog lights (2021-26)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/drl_allow_fog_lights_as_drl.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "allows fogs to be turned on with DRLs",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-38-02",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "allows fogs to be turned on with DRLs"
        }
      ],
      "import_issues": []
    },
    {
      "id": 98,
      "source_key": "altctrlwrench:bronco/drl_amber_turn_signal_rings_only.acwrecipe",
      "title": "DRL - Amber Turn Signal Rings Only",
      "raw_title": "Daytime running lights - after writting vehicle must be in drive to see new state (doesn't work in park)",
      "category": "Lighting",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/drl_amber_turn_signal_rings_only.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "** NOTE 04 works during daylight, at night white and blink amber\nConfirmed: D2dhanover|multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM",
      "system_name": "BDYCM",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM",
          "address": "726-43-01",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "LF_DRL_Lamp_Ckt_Usage_Cfg:\n00=Not Used 01=DRL Only 02=DRL Position 03=Fixed DRL Position 04=Turn and DRL 05=Position Only 06=Stop Turn\n** NOTE 04 works during daylight, at night white and blink amber"
        },
        {
          "module": "BDYCM",
          "address": "726-43-01",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "RF_DRL_Lamp_Ckt_Usage_Cfg\n00=Not Used 01=DRL Only 02=DRL Position 03=Fixed DRL Position 04=Turn and DRL 05=Position Only 06=Stop Turn\n** NOTE 04 works during daylight, at night white and blink amber"
        }
      ],
      "import_issues": []
    },
    {
      "id": 99,
      "source_key": "altctrlwrench:explorer/drl_amber_turn_signal_rings_only.acwrecipe",
      "title": "DRL - Amber Turn Signal Rings Only",
      "raw_title": "Sets DRL to amber turrns only (DRL in amber LED bars)",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2020-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2020-2024 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/drl_amber_turn_signal_rings_only.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Sets the White DRL to fixed position (off when the car is in normal drive mode during daytime)\nSets Turn to Turn and DRL",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-42-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "4"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "4"
            }
          ],
          "feature_name": null,
          "notes": "Sets the White DRL to fixed position (off when the car is in normal drive mode during daytime)"
        },
        {
          "module": "BCM",
          "address": "726-43-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Sets Turn to Turn and DRL"
        }
      ],
      "import_issues": []
    },
    {
      "id": 100,
      "source_key": "altctrlwrench:explorer/drl_amber_turn_signal_rings_only_2.acwrecipe",
      "title": "DRL - Amber Turn Signal Rings Only (variant 2)",
      "raw_title": "Sets DRL to amber turrns only (DRL in amber LED bars)",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/drl_amber_turn_signal_rings_only_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Sets the White DRL to fixed position (off when the car is in normal drive mode during daytime)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-42-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "4"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "4"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-43-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Sets Turn to Turn and DRL"
        }
      ],
      "import_issues": []
    },
    {
      "id": 18,
      "source_key": "altctrlwrench:f150/drl_full_brightness_with_headlamps_on.acwrecipe",
      "title": "DRL - Full Brightness with Headlamps On",
      "raw_title": "DRLs - full brightness (2021-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/drl_full_brightness_with_headlamps_on.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "To change brightness for last two nibbles set at about 60% (3C hex) thru 75% (4B hex) use lowest value you can before flickering appears",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-42-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "2"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "2"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-38-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "set at about 60% (3C hex) thru 75% (4B hex) use lowest value you can before flickering appears"
            }
          ],
          "feature_name": "DRL_Ckt_FixedDim_DutyCycle_Cfg (DRLCFDDCC)",
          "notes": "set at about 60% (3C hex) thru 75% (4B hex) use lowest value you can before flickering appears"
        }
      ],
      "import_issues": [
        "726-38-01: nibble None is not a '*' position in mask 'xxxx **xx xx--'"
      ]
    },
    {
      "id": 101,
      "source_key": "altctrlwrench:explorer/drl_full_brightness_with_headlamps_on.acwrecipe",
      "title": "DRL - Full Brightness with Headlamps On",
      "raw_title": "DRLs - full brightness",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/drl_full_brightness_with_headlamps_on.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-42-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "2"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "2"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-38-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "set at about 60% brightness (3C hex) thru 75% brightness (4B hex) use lowest value you can before flickering appears.\n\n64 =100%, 5A = 90%, 4B =75%, 32 = 50%, 19 = 25%, 0A =10%"
            }
          ],
          "feature_name": "DRL_Ckt_FixedDim_DutyCycle_Cfg (DRLCFDDCC)",
          "notes": "set at about 60% brightness (3C hex) thru 75% brightness (4B hex) use lowest value you can before flickering appears.\n\n64 =100%, 5A = 90%, 4B =75%, 32 = 50%, 19 = 25%, 0A =10%"
        }
      ],
      "import_issues": [
        "726-38-01: nibble None is not a '*' position in mask 'xxxx **xx xx--'"
      ]
    },
    {
      "id": 102,
      "source_key": "altctrlwrench:super_duty/drl_full_brightness_with_headlamps_on.acwrecipe",
      "title": "DRL - Full Brightness with Headlamps On",
      "raw_title": "DRL Full Brightness w/Headlights",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/drl_full_brightness_with_headlamps_on.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-42-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "2"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "2"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 19,
      "source_key": "altctrlwrench:f150/drl_grille_marker_lights_on_with_drl.acwrecipe",
      "title": "DRL - Grille Marker Lights On with DRL",
      "raw_title": "(2024-2026) Raptor (marker lights on with DRL)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2024-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/drl_grille_marker_lights_on_with_drl.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Daytime Running Lights (DRL) Include Parklamps Config",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-38-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Daytime Running Lights (DRL) Include Parklamps Config"
        },
        {
          "module": "BCM",
          "address": "726-43-02",
          "mask": "xxxx xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Daytime Running Lights (DRL) On With Park Lamps On Config"
        },
        {
          "module": "BCM",
          "address": "726-87-01",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "Daytime Running Lights (DRL) Suppress License Config"
        }
      ],
      "import_issues": []
    },
    {
      "id": 20,
      "source_key": "altctrlwrench:f150/drl_include_parking_running_lights.acwrecipe",
      "title": "DRL - Include Parking / Running Lights",
      "raw_title": "DRLs - include parking lights (2021-26)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/drl_include_parking_running_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "will turn on rear tails with DRLs",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-38-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "will turn on rear tails with DRLs"
        }
      ],
      "import_issues": []
    },
    {
      "id": 103,
      "source_key": "altctrlwrench:super_duty/drl_include_parking_running_lights.acwrecipe",
      "title": "DRL - Include Parking / Running Lights",
      "raw_title": "Running Lights w/DRL",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/drl_include_parking_running_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disabled  1 Enabled",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-38-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled  1 Enabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 21,
      "source_key": "altctrlwrench:f150/drl_low_beams_and_parking_lights.acwrecipe",
      "title": "DRL - Low Beams and Parking Lights",
      "raw_title": "Low Beams & Parking Lamps as DRL (2024-2026) - see this post for pics",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2024-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/drl_low_beams_and_parking_lights.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "DRL_IncludeParklamps_Cfg https://www.f150forum.com/f129/forscan-14th-gen-f150s-481816/index330/#post7599368",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-38-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "DRL_IncludeParklamps_Cfg"
        },
        {
          "module": "BCM",
          "address": "726-38-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "DRL_WithTurn_Cfg"
        },
        {
          "module": "BCM",
          "address": "726-41-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "LowBeam_Cfg"
        },
        {
          "module": "BCM",
          "address": "726-42-02",
          "mask": "xxx* x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "LF/RF_Low_Beam_Ckt_Usage_Cfg"
        },
        {
          "module": "BCM",
          "address": "726-43-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "DRL_OnWithParkLampsOn_Cfg"
        }
      ],
      "import_issues": []
    },
    {
      "id": 104,
      "source_key": "altctrlwrench:ranger_6g/drl_switchback_operation_with_turn_signal.acwrecipe",
      "title": "DRL - Switchback Operation with Turn Signal",
      "raw_title": "Using DRL with Turn Signal",
      "category": "Lighting",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/drl_switchback_operation_with_turn_signal.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Using DRL with Turn Signal (Inhibited (Default, 2)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Using DRL with Turn Signal (Inhibited (Default, 2)",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-38-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0 for Allow (target), 1 for Dim, 2 for Inhibit (Default)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 105,
      "source_key": "altctrlwrench:super_duty/drl_switchback_operation_with_turn_signal.acwrecipe",
      "title": "DRL - Switchback Operation with Turn Signal",
      "raw_title": "DRL w/Turn Signal (Switchback)",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/drl_switchback_operation_with_turn_signal.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=On  1=Dim  2=Off",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'drl': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular lighting tweaks",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-38-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=On  1=Dim  2=Off | Set to ON"
        }
      ],
      "import_issues": []
    },
    {
      "id": 28,
      "source_key": "altctrlwrench:f150/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "title": "Headlamp Switch Default to Auto Disable (Remember Last Position)",
      "raw_title": "Prevent headlamp switch from defaulting to Auto position (2021-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "headlamp switch will revert to last position used on next startup",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'headlamp': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: stop headlamps defaulting off Auto",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-74-01",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "headlamp switch will revert to last position used on next startup"
        }
      ],
      "import_issues": []
    },
    {
      "id": 106,
      "source_key": "altctrlwrench:bronco/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "title": "Headlamp Switch Default to Auto Disable (Remember Last Position)",
      "raw_title": "Auto Headlight",
      "category": "Lighting",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "HeadlampPosAtIgnOn_Cfg: 00=Auto 01=Last Known\nConfirmed: D2dhanover",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM",
      "system_name": "BDYCM",
      "tier": 2,
      "tier_reason": "'headlamp': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: stop headlamps defaulting off Auto",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM",
          "address": "726-74-01",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "HeadlampPosAtIgnOn_Cfg: 00=Auto 01=Last Known\nConfirmed: D2dhanover"
        }
      ],
      "import_issues": []
    },
    {
      "id": 107,
      "source_key": "altctrlwrench:explorer/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "title": "Headlamp Switch Default to Auto Disable (Remember Last Position)",
      "raw_title": "Prevent headlamp from defaulting to \"Auto\" position",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Headlamp will revert to last position at startup",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'headlamp': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: stop headlamps defaulting off Auto",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-74-01",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 108,
      "source_key": "altctrlwrench:super_duty/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "title": "Headlamp Switch Default to Auto Disable (Remember Last Position)",
      "raw_title": "Headlamp Switch  \"Auto\" to Last Known",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/headlamp_switch_default_to_auto_disable_remem.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Change 0 to 1",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'headlamp': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common: stop headlamps defaulting off Auto",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-74-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Change 0 to 1"
        }
      ],
      "import_issues": []
    },
    {
      "id": 30,
      "source_key": "altctrlwrench:f150/keyfob_car_finder_double_lock_horn_chirp.acwrecipe",
      "title": "Keyfob Car Finder (Double-Lock Horn Chirp)",
      "raw_title": "Keyfob Car Finder - (clicking lock twice honks horn) (2021-2026)",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/keyfob_car_finder_double_lock_horn_chirp.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "1=enabled, 0=disabled (target setting)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-24-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "bits",
              "pos": 8,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "1=enabled, 0=disabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 109,
      "source_key": "altctrlwrench:ranger_6g/keyfob_car_finder_double_lock_horn_chirp.acwrecipe",
      "title": "Keyfob Car Finder (Double-Lock Horn Chirp)",
      "raw_title": "Keyfob Car Finder",
      "category": "Locks and Security",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/keyfob_car_finder_double_lock_horn_chirp.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Audible Lock Feedback - Vehicle (Disabled, Enabled (Default))\nTrim: All? [Confirmed: craigc (9/10/2024) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Audible Lock Feedback - Vehicle (Disabled, Enabled (Default))",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-24-02",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "1=enabled (default), 0=disabled (target setting). Forscan not needed - Sync setting exists by default"
        }
      ],
      "import_issues": []
    },
    {
      "id": 110,
      "source_key": "altctrlwrench:super_duty/keyfob_car_finder_double_lock_horn_chirp.acwrecipe",
      "title": "Keyfob Car Finder (Double-Lock Horn Chirp)",
      "raw_title": "Car Finder (2x Click Horn)",
      "category": "Locks and Security",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/keyfob_car_finder_double_lock_horn_chirp.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disable  1=Enable",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-24-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "bits",
              "pos": 8,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disable  1=Enable"
        }
      ],
      "import_issues": []
    },
    {
      "id": 31,
      "source_key": "altctrlwrench:f150/keyfob_panic_alarm_enable_disable.acwrecipe",
      "title": "Keyfob Panic Alarm Enable/Disable",
      "raw_title": "Keyfob Panic Alarm (2021-2026)",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/keyfob_panic_alarm_enable_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=lights & horn (default) 1=lights only (target setting)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-01-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=lights & horn (default) 1=lights only"
        }
      ],
      "import_issues": []
    },
    {
      "id": 111,
      "source_key": "altctrlwrench:ranger_6g/keyfob_panic_alarm_enable_disable.acwrecipe",
      "title": "Keyfob Panic Alarm Enable/Disable",
      "raw_title": "Keyfob Panic Alarm",
      "category": "Locks and Security",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/keyfob_panic_alarm_enable_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Panic Alarm Mode (Change Honk and Lights to Lights only)\nTrim: All? [Confirmed: craigc (9/10/2024) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Panic Alarm Mode (Change Honk and Lights to Lights only)",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-01-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=lights & horn (default) 1=lights only (target setting)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 112,
      "source_key": "altctrlwrench:super_duty/keyfob_panic_alarm_enable_disable.acwrecipe",
      "title": "Keyfob Panic Alarm Enable/Disable",
      "raw_title": "KeyFOB Panic Alert",
      "category": "Locks and Security",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/keyfob_panic_alarm_enable_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0-Lights/Horn (default)  1-Lights",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-01-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0-Lights/Horn (default)  1-Lights | set to 1 (lights only)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 32,
      "source_key": "altctrlwrench:f150/keyfob_panic_button_activation_mode.acwrecipe",
      "title": "Keyfob Panic Button Activation Mode",
      "raw_title": "Keyfob Panic Button (2021-2026)",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/keyfob_panic_button_activation_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=disabled, 1=2 clicks (target setting), 2=one click (default)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-62-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=disabled, 1=2 clicks, 2=one click (default)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 113,
      "source_key": "altctrlwrench:bronco/keyfob_panic_button_activation_mode.acwrecipe",
      "title": "Keyfob Panic Button Activation Mode",
      "raw_title": "Keyfob Panic Button",
      "category": "Locks and Security",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/keyfob_panic_button_activation_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=disabled, 1=2 clicks, 2=one click (default)\nConfirmed: nottinbe/multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM",
      "system_name": "BDYCM",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM",
          "address": "726-62-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "set to 2 clicks"
        }
      ],
      "import_issues": []
    },
    {
      "id": 114,
      "source_key": "altctrlwrench:explorer/keyfob_panic_button_activation_mode.acwrecipe",
      "title": "Keyfob Panic Button Activation Mode",
      "raw_title": "Keyfob Panic Alarm",
      "category": "Locks and Security",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/keyfob_panic_button_activation_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=Disabled, 1=Enabled (2 press), 2=Enabled (1 press)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-62-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Disabled, 1=Enabled (2 press), 2=Enabled (1 press)"
        },
        {
          "module": "BCM",
          "address": "726-01-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Lights and Horn, 1=Horn only"
        }
      ],
      "import_issues": []
    },
    {
      "id": 115,
      "source_key": "altctrlwrench:ranger_6g/keyfob_panic_button_activation_mode.acwrecipe",
      "title": "Keyfob Panic Button Activation Mode",
      "raw_title": "Keyfob Panic Button",
      "category": "Locks and Security",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/keyfob_panic_button_activation_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Panic Activate (Change Pulse Click to Double Click)\nTrim: All? [Confirmed: craigc (9/10/2024) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Panic Activate (Change Pulse Click to Double Click)",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-62-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0=disabled, 1=2 clicks (target setting), 2=one click (default)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 116,
      "source_key": "altctrlwrench:super_duty/keyfob_panic_button_activation_mode.acwrecipe",
      "title": "Keyfob Panic Button Activation Mode",
      "raw_title": "KeyFOB Panic Button",
      "category": "Locks and Security",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/keyfob_panic_button_activation_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0-Disabled  1-2-Click  2-One Click (default)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-62-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "0-Disabled  1-2-Click  2-One Click (default) | set to 1 (two clicks)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 33,
      "source_key": "altctrlwrench:f150/keyfob_remote_tailgate_release_disable.acwrecipe",
      "title": "Keyfob Remote Tailgate Release Disable",
      "raw_title": "Keyfob Tailgate Release - disable (2021-2026)",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/keyfob_remote_tailgate_release_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "common key-fob behavior",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-61-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 45,
      "source_key": "altctrlwrench:f150/sync_climate_bar_heated_cooled_seat_icons.acwrecipe",
      "title": "Sync Climate Bar - Heated & Cooled Seat Icons",
      "raw_title": "Enable Cooled and/or Heated seats to climate bar above",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_climate_bar_heated_cooled_seat_icons.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "if you have heated & cooled seats  then use A",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC layout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 1,
                "2": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "subtract 4 for cooled only, add 4 for 3 level heated only."
        }
      ],
      "import_issues": []
    },
    {
      "id": 117,
      "source_key": "altctrlwrench:super_duty/sync_climate_bar_heated_cooled_seat_icons.acwrecipe",
      "title": "Sync Climate Bar - Heated & Cooled Seat Icons",
      "raw_title": "Enable Cooled and/or Heated Seats to Climate Bar",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/sync_climate_bar_heated_cooled_seat_icons.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "if you have heated & cooled seats then use A",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC layout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 1,
                "2": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "if you have heated & cooled seats then use A"
        }
      ],
      "import_issues": []
    },
    {
      "id": 46,
      "source_key": "altctrlwrench:f150/sync_climate_bar_heated_steering_wheel_icon.acwrecipe",
      "title": "Sync Climate Bar - Heated Steering Wheel Icon",
      "raw_title": "Enable Heated Steering Wheel on climate bar above",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_climate_bar_heated_steering_wheel_icon.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "see APIM spreadsheet for your value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC layout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "Heated Steering Wheel (HSW)",
          "notes": "see APIM spreadsheet for your value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 118,
      "source_key": "altctrlwrench:super_duty/sync_climate_bar_heated_steering_wheel_icon.acwrecipe",
      "title": "Sync Climate Bar - Heated Steering Wheel Icon",
      "raw_title": "Enable Heated Steering Wheel on Climate Bar",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/sync_climate_bar_heated_steering_wheel_icon.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 4 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC layout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "Heated Steering Wheel (HSW)",
          "notes": "Add 4 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 47,
      "source_key": "altctrlwrench:f150/sync_persistent_lower_climate_bar_enable.acwrecipe",
      "title": "Sync Persistent Lower Climate Bar Enable",
      "raw_title": "Enable Climate Bar at the bottom of Sync screen",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_persistent_lower_climate_bar_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "use 2 for non-hybrid or 6 for hybrid - requires Unreal theme above",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC layout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "1": 1
              }
            }
          ],
          "feature_name": "Climate Bar (CB)",
          "notes": "use 2 for non-hybrid or 6 for hybrid - requires Unreal theme above | No data table"
        }
      ],
      "import_issues": []
    },
    {
      "id": 119,
      "source_key": "altctrlwrench:super_duty/sync_persistent_lower_climate_bar_enable.acwrecipe",
      "title": "Sync Persistent Lower Climate Bar Enable",
      "raw_title": "Enable Cimate Bar at the bottom of Sync screen",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/sync_persistent_lower_climate_bar_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Change current value to 2",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC layout",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "2"
            }
          ],
          "feature_name": "Climate Bar (CB)",
          "notes": "Add 2 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 48,
      "source_key": "altctrlwrench:f150/sync_splash_screen_75th_anniversary_animation.acwrecipe",
      "title": "Sync Splash Screen - 75th Anniversary Animation",
      "raw_title": "Enable 75th Anniversary Splash Screen",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_splash_screen_75th_anniversary_animation.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Requires Sync ver 22012 or higher - reset APIM in FORScan after either/both changes. other screen available\nNo target setting provided in As Built Pro\nOther options available such as 03 for Raptor, 04 for Black Label, 05 for Presidential, 1A for Dark Horse animation, etc.",
      "warnings": null,
      "prerequisites": "Sync ver 22012 or higher - reset APIM in FORScan after either/both changes",
      "post_procedure": "Reset APIM in FORScan or cycle ignition.",
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC cosmetic",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-03-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "Requires Sync ver 22012 or higher - reset APIM in FORScan after either/both changes"
            }
          ],
          "feature_name": "Splash Screen (SS)",
          "notes": "Requires Sync ver 22012 or higher - reset APIM in FORScan after either/both changes"
        }
      ],
      "import_issues": [
        "7D0-03-01: nibble None is not a '*' position in mask 'xxxx **xx xx--'"
      ]
    },
    {
      "id": 120,
      "source_key": "altctrlwrench:super_duty/sync_splash_screen_75th_anniversary_animation.acwrecipe",
      "title": "Sync Splash Screen - 75th Anniversary Animation",
      "raw_title": "Enable 75th Anniversary Splash Screen",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/sync_splash_screen_75th_anniversary_animation.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "No options set for webpage. Set to 24 for 75th.\nMultiple options such as default, presidential (05), black label (04), Europe (0A), etc. (check sheet for values)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular SYNC cosmetic",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-03-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "see source"
            }
          ],
          "feature_name": "Splash Screen (SS)",
          "notes": null
        }
      ],
      "import_issues": [
        "7D0-03-01: nibble None is not a '*' position in mask 'xxxx **xx xx--'"
      ]
    },
    {
      "id": 49,
      "source_key": "altctrlwrench:f150/sync_splash_screen_f_150_lightning_animation.acwrecipe",
      "title": "Sync Splash Screen - F-150 Lightning Animation",
      "raw_title": "Enable Lightning F150 Splash Screen",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_splash_screen_f_150_lightning_animation.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "No target setting in As Built Pro. Use 1F for Lightning",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "EV_MENTIONED",
      "ev_reason": "text mentions 'lightning' (still unverified on your truck)",
      "popularity": 2,
      "popularity_reason": "popular SYNC cosmetic",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-03-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "see source"
            }
          ],
          "feature_name": "Splash Screen (SS)",
          "notes": null
        }
      ],
      "import_issues": [
        "7D0-03-01: nibble None is not a '*' position in mask 'xxxx **xx xx--'"
      ]
    },
    {
      "id": 53,
      "source_key": "altctrlwrench:f150/tow_mirror_clearance_marker_lights_enable.acwrecipe",
      "title": "Tow Mirror Clearance Marker Lights Enable",
      "raw_title": "2021-26 Enabling marker lights on tow mirrors upgrade",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/tow_mirror_clearance_marker_lights_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'marker': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular towing convenience",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-40-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 54,
      "source_key": "altctrlwrench:f150/tow_mirror_turn_signal_indicator_enable.acwrecipe",
      "title": "Tow Mirror Turn Signal Indicator Enable",
      "raw_title": "2021-23 Enabling side turn indicator on tow mirrors upgrade",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/tow_mirror_turn_signal_indicator_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 2,
      "tier_reason": "'tow mirror': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular towing convenience",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-03-04",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "PDM",
          "address": "741-03-04",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 55,
      "source_key": "altctrlwrench:f150/tow_mirror_turn_signal_indicator_enable_2.acwrecipe",
      "title": "Tow Mirror Turn Signal Indicator Enable (variant 2)",
      "raw_title": "2024-26 Enabling side turn indicator on tow mirrors upgrade",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/tow_mirror_turn_signal_indicator_enable_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "DDM",
      "system_name": "Driver Door Module",
      "tier": 2,
      "tier_reason": "'tow mirror': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular towing convenience",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "DDM",
          "address": "740-03-04",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": 1,
              "text": "see source"
            }
          ],
          "feature_name": "SideTurnInd_Cfg (STIC)",
          "notes": null
        },
        {
          "module": "PDM",
          "address": "741-03-04",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": 1,
              "text": "see source"
            }
          ],
          "feature_name": "SideTurnInd_Cfg (STIC)",
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 56,
      "source_key": "altctrlwrench:f150/trailer_side_view_camera_on_turn_signal.acwrecipe",
      "title": "Trailer Side View Camera on Turn Signal",
      "raw_title": "Trailer Side View - shows corresponding camera view alongside of vehicle when turn signal is applied with trailer connected Note: requires newest 12/23 ipma update (2021-2025)",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2025",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/trailer_side_view_camera_on_turn_signal.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPMA",
      "system_name": "Camera / Image Processing (IPMA)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular towing camera",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPMA",
          "address": "706-01-02",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "3"
            }
          ],
          "feature_name": null,
          "notes": "No data table"
        },
        {
          "module": "APIM",
          "address": "7D0-02-03",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "8"
            }
          ],
          "feature_name": "Turn Signal Views (TSV)",
          "notes": "adds Trailer Side View toggle under Driver Assistance | No data table"
        }
      ],
      "import_issues": []
    },
    {
      "id": 121,
      "source_key": "altctrlwrench:ranger_6g/trailer_side_view_camera_on_turn_signal.acwrecipe",
      "title": "Trailer Side View Camera on Turn Signal",
      "raw_title": "Trailer Side View - shows corresponding camera view alongside of vehicle when turn signal is applied with trailer connected",
      "category": "Cameras and ADAS",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/trailer_side_view_camera_on_turn_signal.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Shows left or right blind spot on center screen when turn signal is used. \nCan be configured to only work for one side\nFORScan Menu: unknown, use asbuilt (advanced) (Not available - use asbuilt)\nConfirmed: craigc (10/4/2024) Lariat\n* -> Bit 4 (add 8 to enable.  e.g. change 5 to D)\nFORScan Menu: Turn Signal Views (Disabled (Default), Enabled)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "unknown, use asbuilt (advanced) (Not available - use asbuilt)",
      "system": "IPMA",
      "system_name": "Camera / Image Processing (IPMA)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 2,
      "popularity_reason": "popular towing camera",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPMA",
          "address": "706-01-02",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "1": 1,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "* -> Bits 1 and 2 (add 3 to enable both right and left.  e.g. change 0 to 3)  \nIf only left camera is desired, instead of adding 3, add 1, and if only right camera is desired, add 2\nFORScan Menu: unknown, use asbuilt (advanced) (Not available - use asbuilt)\nConfirmed: craigc (10/4/2024) Lariat"
        },
        {
          "module": "APIM",
          "address": "7D0-02-03",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "Turn Signal Views (TSV)",
          "notes": "* -> Bit 4 (add 8 to enable.  e.g. change 5 to D)\nFORScan Menu: Turn Signal Views (Disabled (Default), Enabled)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 122,
      "source_key": "altctrlwrench:ranger_6g/driver_seatbelt_warning_chime_disable.acwrecipe",
      "title": "Driver Seatbelt Warning Chime Disable",
      "raw_title": "Disables chime for Driver seatbelt",
      "category": "Chimes and Horn",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/driver_seatbelt_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Belt Minder Chime - Row 1 Col 1 (Set to Disabled. Also can be done using procedure in user manual)\nTrim: All [Confirmed: craigc (7/31/24) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Belt Minder Chime - Row 1 Col 1 (Set to Disabled. Also can be done using procedure in user manual)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'seatbelt': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche, safety-visible",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-13-01",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "R1C1 Belt Minder Chime (RCBMC)",
          "notes": "subtract 1 to disable, e.g. change F to E)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 24,
      "source_key": "altctrlwrench:f150/front_turn_signal_bulb_outage_detection.acwrecipe",
      "title": "Front Turn Signal Bulb Outage Detection",
      "raw_title": "Front Turn Bulb Outage Detection (2021-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/front_turn_signal_bulb_outage_detection.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage (target setting) 01=Outage. Set to No Outage if upgrading to LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-40-02",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage - set to no outage when upgrading to LED"
        }
      ],
      "import_issues": []
    },
    {
      "id": 123,
      "source_key": "altctrlwrench:super_duty/front_turn_signal_bulb_outage_detection.acwrecipe",
      "title": "Front Turn Signal Bulb Outage Detection",
      "raw_title": "Bulb-Front Turn Bulb Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/front_turn_signal_bulb_outage_detection.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage - set to 0 for LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-40-02",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Disable Front Turn Bulb Outage Detection\n0=No Outage 1=Outage - set to 0 to disable"
        }
      ],
      "import_issues": []
    },
    {
      "id": 124,
      "source_key": "altctrlwrench:super_duty/front_turn_signal_bulb_outage_detection_2.acwrecipe",
      "title": "Front Turn Signal Bulb Outage Detection (variant 2)",
      "raw_title": "Front Turn Bulb Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/front_turn_signal_bulb_outage_detection_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage - set to 0 for LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-40-02",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=No Outage 1=Outage - set to 0 for LED"
        }
      ],
      "import_issues": []
    },
    {
      "id": 25,
      "source_key": "altctrlwrench:f150/front_turn_signal_led_outage_detection_hyperf.acwrecipe",
      "title": "Front Turn Signal LED Outage Detection (Hyperflash Disable)",
      "raw_title": "Front Turn LED Outage Detection (2021-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/front_turn_signal_led_outage_detection_hyperf.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage 01=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-40-02",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 125,
      "source_key": "altctrlwrench:explorer/front_turn_signal_led_outage_detection_hyperf.acwrecipe",
      "title": "Front Turn Signal LED Outage Detection (Hyperflash Disable)",
      "raw_title": "Front Turn LED Outage Detection (2021-2024)",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2020-2024 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/front_turn_signal_led_outage_detection_hyperf.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage 01=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-40-02",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 126,
      "source_key": "altctrlwrench:super_duty/front_turn_signal_led_outage_detection_hyperf.acwrecipe",
      "title": "Front Turn Signal LED Outage Detection (Hyperflash Disable)",
      "raw_title": "Bulb-Front Turn LED Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/front_turn_signal_led_outage_detection_hyperf.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-40-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Front bulg outage detection\n0=No Outage 1=Outage Set to 0 to disable outage detectionn"
        }
      ],
      "import_issues": []
    },
    {
      "id": 127,
      "source_key": "altctrlwrench:super_duty/front_turn_signal_led_outage_detection_hyperf_2.acwrecipe",
      "title": "Front Turn Signal LED Outage Detection (Hyperflash Disable) (variant 2)",
      "raw_title": "Front Turn LED Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/front_turn_signal_led_outage_detection_hyperf_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-40-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=No Outage 1=Outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 128,
      "source_key": "altctrlwrench:ranger_6g/passenger_seatbelt_warning_chime_disable.acwrecipe",
      "title": "Passenger Seatbelt Warning Chime Disable",
      "raw_title": "Disables chime for Passenger seatbelt",
      "category": "Chimes and Horn",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/passenger_seatbelt_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Belt Minder Chime - Row 1 Col 5 (Set to Disabled. Also can be done using procedure in user manual)\nTrim: All [Confirmed: craigc (7/31/24) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Belt Minder Chime - Row 1 Col 5 (Set to Disabled. Also can be done using procedure in user manual)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'seatbelt': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche, safety-visible",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-13-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "R1C5 Belt Minder Chime (RCBMC)",
          "notes": "Bit 1 (subtract 1 to disable, e.g. change 1 to 0)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 39,
      "source_key": "altctrlwrench:f150/rear_turn_signal_bulb_outage_detection.acwrecipe",
      "title": "Rear Turn Signal Bulb Outage Detection",
      "raw_title": "Rear Turn Bulb Outage Detection (2021-2023)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2023",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/rear_turn_signal_bulb_outage_detection.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage (Target setting) 01=Outage. Set to No Outage if changing to LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-44-02",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage - set to no outage when upgrading to LED"
        }
      ],
      "import_issues": []
    },
    {
      "id": 129,
      "source_key": "altctrlwrench:explorer/rear_turn_signal_bulb_outage_detection.acwrecipe",
      "title": "Rear Turn Signal Bulb Outage Detection",
      "raw_title": "Rear Turn Bulb Outage Detection (2021-2024)",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2020-2024 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/rear_turn_signal_bulb_outage_detection.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage 01=Outage - set to no outage when upgrading to LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-44-02",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage - set to no outage when upgrading to LED"
        }
      ],
      "import_issues": []
    },
    {
      "id": 130,
      "source_key": "altctrlwrench:super_duty/rear_turn_signal_bulb_outage_detection.acwrecipe",
      "title": "Rear Turn Signal Bulb Outage Detection",
      "raw_title": "Bulb-Rear Turn Bulb Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/rear_turn_signal_bulb_outage_detection.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage - set to 0 for LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-44-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Rear turn outage detection\n0=No Outage 1=Outage - set to 0 to disable outage detectiojn"
        }
      ],
      "import_issues": []
    },
    {
      "id": 40,
      "source_key": "altctrlwrench:f150/rear_turn_signal_bulb_outage_detection_2.acwrecipe",
      "title": "Rear Turn Signal Bulb Outage Detection (variant 2)",
      "raw_title": "Rear Turn Bulb Outage Detection (2024-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2024-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/rear_turn_signal_bulb_outage_detection_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage (target setting) 01=Outage. Set to No Outage if changing to LED",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-44-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=No Outage (target setting) 01=Outage. Set to No Outage if changing to LED | Data table indicates different feature configured than bulb outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 41,
      "source_key": "altctrlwrench:f150/rear_turn_signal_led_outage_detection_hyperfl.acwrecipe",
      "title": "Rear Turn Signal LED Outage Detection (Hyperflash Disable)",
      "raw_title": "Rear Turn LED Outage Detection (2021-2026)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/rear_turn_signal_led_outage_detection_hyperfl.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage 01=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-40-02",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 131,
      "source_key": "altctrlwrench:explorer/rear_turn_signal_led_outage_detection_hyperfl.acwrecipe",
      "title": "Rear Turn Signal LED Outage Detection (Hyperflash Disable)",
      "raw_title": "Rear Turn LED Outage Detection (2021-2024)",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2020-2024 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/rear_turn_signal_led_outage_detection_hyperfl.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00=No Outage 01=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-40-02",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "00=No Outage 01=Outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 132,
      "source_key": "altctrlwrench:super_duty/rear_turn_signal_led_outage_detection_hyperfl.acwrecipe",
      "title": "Rear Turn Signal LED Outage Detection (Hyperflash Disable)",
      "raw_title": "Bulb-Rear Turn LED Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/rear_turn_signal_led_outage_detection_hyperfl.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-40-02",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Rear turn bulg outage detection\n0=No Outage 1=Outage\nSet to 0 to disable outage detection"
        }
      ],
      "import_issues": []
    },
    {
      "id": 133,
      "source_key": "altctrlwrench:super_duty/rear_turn_signal_led_outage_detection_hyperfl_2.acwrecipe",
      "title": "Rear Turn Signal LED Outage Detection (Hyperflash Disable) (variant 2)",
      "raw_title": "Rear Turn LED Outage Detection",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/rear_turn_signal_led_outage_detection_hyperfl_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Outage 1=Outage",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'outage detection': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche lighting",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-40-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=No Outage 1=Outage"
        }
      ],
      "import_issues": []
    },
    {
      "id": 42,
      "source_key": "altctrlwrench:f150/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "title": "Seatbelt Warning Chimes Disable (Driver & Passenger)",
      "raw_title": "Disable driver & passenger seatbelt minder",
      "category": "Chimes and Horn",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'seatbelt': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche, safety-visible",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-01",
          "mask": "xxxx xx*x xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "Driver, Pass, and Mid seatbelt minder disabled."
        }
      ],
      "import_issues": []
    },
    {
      "id": 134,
      "source_key": "altctrlwrench:bronco/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "title": "Seatbelt Warning Chimes Disable (Driver & Passenger)",
      "raw_title": "Disable driver & passenger seatbelt minder",
      "category": "Chimes and Horn",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0 = Disable both; 2 = Disable drivers; 4 = disable passenger\nConfirmed: LagoCJ/multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'seatbelt': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche, safety-visible",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-01",
          "mask": "xxxx xx*x xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 6,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0 = Disable both; 2 = Disable drivers; 4 = disable passenger\nConfirmed: LagoCJ/multi"
        }
      ],
      "import_issues": []
    },
    {
      "id": 135,
      "source_key": "altctrlwrench:ranger_6g/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "title": "Seatbelt Warning Chimes Disable (Driver & Passenger)",
      "raw_title": "Remove all seatbelt warnings and chimes (including OK button)",
      "category": "Chimes and Horn",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "See Forum spreadsheet for more info",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'seatbelt': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche, safety-visible",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-13-01",
          "mask": "**** **** ****",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "Change all values to 0, be sure to save all values first (backup asbuilt).  This turns off ALL notifications for seatbelts (front and back).  use at own risk - unclear if this affects airbags\nFORScan Menu: Multiple settings, use asbuilt (advanced)\nTrim: All [Confirmed: ???]"
            }
          ],
          "feature_name": "Belt Minder Chime Operator (BMCO)",
          "notes": "Change all values to 0, be sure to save all values first (backup asbuilt).  This turns off ALL notifications for seatbelts (front and back).  use at own risk - unclear if this affects airbags\nFORScan Menu: Multiple settings, use asbuilt (advanced)\nTrim: All [Confirmed: ???]"
        },
        {
          "module": "IPC",
          "address": "720-13-02",
          "mask": "**** ****",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "see source"
            }
          ],
          "feature_name": "R4 Bench (RB)",
          "notes": null
        },
        {
          "module": "IPC",
          "address": "720-14-01",
          "mask": "**** **** ****",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "see source"
            }
          ],
          "feature_name": "R2C5 Seatbelt (RCS)",
          "notes": null
        },
        {
          "module": "IPC",
          "address": "720-14-02",
          "mask": "**** ****",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "see source"
            }
          ],
          "feature_name": "R4C5 Seatbelt (RCS)",
          "notes": null
        }
      ],
      "import_issues": [
        "720-13-01: nibble None is not a '*' position in mask '**** **** ****'",
        "720-13-02: nibble None is not a '*' position in mask '**** ****'",
        "720-14-01: nibble None is not a '*' position in mask '**** **** ****'",
        "720-14-02: nibble None is not a '*' position in mask '**** ****'"
      ]
    },
    {
      "id": 136,
      "source_key": "altctrlwrench:super_duty/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "title": "Seatbelt Warning Chimes Disable (Driver & Passenger)",
      "raw_title": "Seatbelt Chimes-Disables All",
      "category": "Chimes and Horn",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/seatbelt_warning_chimes_disable_driver_passen.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Tells the truck there are no seatbelts nor belt minders installed",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'seatbelt': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 1,
      "popularity_reason": "niche, safety-visible",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-13-01",
          "mask": "**** **** **--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "Tells the truck there are no seatbelts nor belt minders installed"
        },
        {
          "module": "IPC",
          "address": "720-13-02",
          "mask": "**** **** **--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "Tells the truck there are no seatbelts nor belt minders installed"
        },
        {
          "module": "",
          "address": "720-14-01",
          "mask": "**** **** **--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "",
          "address": "720-14-02",
          "mask": "**** **** **--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 137,
      "source_key": "altctrlwrench:ranger_6g/awd_intelligent_power_distribution_gauge.acwrecipe",
      "title": "AWD Intelligent Power Distribution Gauge",
      "raw_title": "Power delivery gauge (AWD)",
      "category": "Cluster and Displays",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/awd_intelligent_power_distribution_gauge.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: PD Gauge option in MyView (Disabled (Default), Enabled)\nTrim: AWD?? [Confirmed: jezzzza (9/12/2024) Raptor]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "PD Gauge option in MyView (Disabled (Default), Enabled)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "PWR_D Gauge Feature (PWRDGF)",
          "notes": "8=Enabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 138,
      "source_key": "altctrlwrench:bronco/audio_system_eq_flattening_subwoofer_calibrat.acwrecipe",
      "title": "Audio System EQ Flattening & Subwoofer Calibration",
      "raw_title": "Equalizer - assist with rear speakers and subwoofer",
      "category": "Audio and Entertainment",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/audio_system_eq_flattening_subwoofer_calibrat.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00 = EQS Flat EQ\nConfirmed: ryannshit",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ACM",
      "system_name": "Audio Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ACM",
          "address": "727-01-02",
          "mask": "xx** xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "00 = EQS Flat EQ"
        }
      ],
      "import_issues": []
    },
    {
      "id": 139,
      "source_key": "altctrlwrench:bronco/audio_system_speaker_channel_configuration.acwrecipe",
      "title": "Audio System Speaker Channel Configuration",
      "raw_title": "Base speaker configuration (non-LUX)",
      "category": "Audio and Entertainment",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/audio_system_speaker_channel_configuration.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "xx*x-xxxx-xxxx - Driver Front Kick Panel/Dash Speakers\n0 - Speaker\n1 - Tweeter\n2 - Speaker & Tweeter\n3 - No Speaker (ACM disable)\nxxx*-xxxx-xxxx - Passenger Front Kick Panel/Dash Speakers\n3 - Speaker\n7 - Tweeter\nB - Speaker & Tweeter\nF - No Speaker\nxxxx-*xxx-xxxx - Passenger Rear Pod Speaker\n0 - Speaker\n1 - Tweeter\n2 - Speaker & Tweeter\n3 - No Speaker\nxxxx-x*xx-xxxx - Driver Rear Pod Speaker & Subwoofer\n0 - Speaker\n2 - Speaker & Sub\n4 - Tweeter\n6 - Tweeter & Sub\n8 - Speaker & Tweeter\nA - Speaker, Tweeter, & Sub\nC - No speaker\nE - Sub only\nConfirmed: RagnarKon",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ACM",
      "system_name": "Audio Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ACM",
          "address": "727-01-01",
          "mask": "xx** **xx xxxx",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "xx*x-xxxx-xxxx - Driver Front Kick Panel/Dash Speakers\n0 - Speaker\n1 - Tweeter\n2 - Speaker & Tweeter\n3 - No Speaker (ACM disable)\nxxx*-xxxx-xxxx - Passenger Front Kick Panel/Dash Speakers\n3 - Speaker\n7 - Tweeter\nB - Speaker & Tweeter\nF - No Speaker\nxxxx-*xxx-xxxx - Passenger Rear Pod Speaker\n0 - Speaker\n1 - Tweeter\n2 - Speaker & Tweeter\n3 - No Speaker\nxxxx-x*xx-xxxx - Driver Rear Pod Speaker & Subwoofer\n0 - Speaker\n2 - Speaker & Sub\n4 - Tweeter\n6 - Tweeter & Sub\n8 - Speaker & Tweeter\nA - Speaker, Tweeter, & Sub\nC - No speaker\nE - Sub only"
            }
          ],
          "feature_name": "Front Satellite Speakers (FSS)",
          "notes": "xx*x-xxxx-xxxx - Driver Front Kick Panel/Dash Speakers\n0 - Speaker\n1 - Tweeter\n2 - Speaker & Tweeter\n3 - No Speaker (ACM disable)\nxxx*-xxxx-xxxx - Passenger Front Kick Panel/Dash Speakers\n3 - Speaker\n7 - Tweeter\nB - Speaker & Tweeter\nF - No Speaker\nxxxx-*xxx-xxxx - Passenger Rear Pod Speaker\n0 - Speaker\n1 - Tweeter\n2 - Speaker & Tweeter\n3 - No Speaker\nxxxx-x*xx-xxxx - Driver Rear Pod Speaker & Subwoofer\n0 - Speaker\n2 - Speaker & Sub\n4 - Tweeter\n6 - Tweeter & Sub\n8 - Speaker & Tweeter\nA - Speaker, Tweeter, & Sub\nC - No speaker\nE - Sub only"
        }
      ],
      "import_issues": [
        "727-01-01: nibble None is not a '*' position in mask 'xx** **xx xxxx'"
      ]
    },
    {
      "id": 140,
      "source_key": "altctrlwrench:bronco/audio_system_speaker_channel_configuration_2.acwrecipe",
      "title": "Audio System Speaker Channel Configuration (variant 2)",
      "raw_title": "Base EQ configuration (non-LUX)",
      "category": "Audio and Entertainment",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/audio_system_speaker_channel_configuration_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "00 = EQ Off\n01 = EQ On (High-pass filter on the rear pods)\nConfirmed: RagnarKon",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ACM",
      "system_name": "Audio Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ACM",
          "address": "727-01-02",
          "mask": "xx** xxxx xxxx",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "00 = EQ Off\n01 = EQ On (High-pass filter on the rear pods)"
            }
          ],
          "feature_name": "EQ Selection (EQS)",
          "notes": "00 = EQ Off\n01 = EQ On (High-pass filter on the rear pods)"
        }
      ],
      "import_issues": [
        "727-01-02: nibble None is not a '*' position in mask 'xx** xxxx xxxx'"
      ]
    },
    {
      "id": 6,
      "source_key": "altctrlwrench:f150/auto_engine_idle_shutdown_aeis_30_minute_time.acwrecipe",
      "title": "Auto Engine Idle Shutdown (AEIS) 30-Minute Timer Disable",
      "raw_title": "Disable Auto Engine Idle Shutdown of 30 mins",
      "category": "Convenience and Electrical",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/auto_engine_idle_shutdown_aeis_30_minute_time.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "subtract 8 from your default value (if default is F, change to 7)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0
              }
            }
          ],
          "feature_name": "AEIS With Override (AEISWO)",
          "notes": "subtract 8 from your default value (if default is F, change to 7) | AEIS disabled (values should be 0-7)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 141,
      "source_key": "altctrlwrench:ranger_6g/auto_start_stop_cluster_notification_disable.acwrecipe",
      "title": "Auto Start/Stop Cluster Notification Disable",
      "raw_title": "Disable Auto Stop Start Feature (only affects cluster visibility/nag)",
      "category": "Cluster and Displays",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/auto_start_stop_cluster_notification_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Auto Stop Start (Enabled (Default), Disabled)\nConfirmed: craigc (10/13/2024) Lariat\nsloon (10/13/2024) Raptor",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Auto Stop Start (Enabled (Default), Disabled)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'start/stop' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "1": 0
              }
            }
          ],
          "feature_name": "Auto Stop Start (ASS)",
          "notes": "Bit2 (Subtract 2 to disable.  e.g. change 3 to 1)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 142,
      "source_key": "altctrlwrench:ranger_6g/automatic_climate_control_a_c_compressor_auto.acwrecipe",
      "title": "Automatic Climate Control A/C Compressor Auto-On Disable",
      "raw_title": "Don't auto turn on A/C",
      "category": "Convenience and Electrical",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/automatic_climate_control_a_c_compressor_auto.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Humidity Sensor Type (Windshield Mounted (Default) -> \"Not Present)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Humidity Sensor Type (Windshield Mounted (Default) -> \"Not Present)",
      "system": "HVAC",
      "system_name": "Climate Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "HVAC",
          "address": "733-01-02",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": 4,
              "text": "* -> Bit 4 (subtract 8 to disable.  e.g. change\nFORScan Menu: Humidity Sensor Type (Windshield Mounted (Default) -> \"Not Present)"
            }
          ],
          "feature_name": "Wide Open Throttle Purge Type (WOTPT)",
          "notes": "* -> Bit 4 (subtract 8 to disable.  e.g. change\nFORScan Menu: Humidity Sensor Type (Windshield Mounted (Default) -> \"Not Present)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 143,
      "source_key": "altctrlwrench:super_duty/diesel_particulate_filter_dpf_soot_percentage.acwrecipe",
      "title": "Diesel Particulate Filter (DPF) Soot Percentage Screen",
      "raw_title": "DPF% on screen (may already be enabled)",
      "category": "Cluster and Displays",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/diesel_particulate_filter_dpf_soot_percentage.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "(Check Diesel Measurements Screen before changing) Add 8 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'diesel' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-02",
          "mask": "x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "ManRegen (MR)",
          "notes": "(Check Diesel Measurements Screen before changing) Add 8 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 144,
      "source_key": "altctrlwrench:super_duty/digital_compass_heading_display_in_cluster.acwrecipe",
      "title": "Digital Compass Heading Display in Cluster",
      "raw_title": "Compass Enable on IPC",
      "category": "Cluster and Displays",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/digital_compass_heading_display_in_cluster.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 4 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-01",
          "mask": "xxxx xxxx *x--",
          "ops": [
            {
              "kind": "bits",
              "pos": 8,
              "bits": {
                "2": 1
              }
            }
          ],
          "feature_name": "Compass Sync (CS)",
          "notes": "Add 4 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 22,
      "source_key": "altctrlwrench:f150/engine_sound_enhancement_ese_fake_engine_soun.acwrecipe",
      "title": "Engine Sound Enhancement (ESE) / Fake Engine Sound Disable",
      "raw_title": "Disable Fake Engine Noise",
      "category": "Audio and Entertainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/engine_sound_enhancement_ese_fake_engine_soun.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ACM",
      "system_name": "Audio Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ACM",
          "address": "727-01-01",
          "mask": "xxxx xxxx *x--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 145,
      "source_key": "altctrlwrench:explorer/engine_sound_enhancement_ese_fake_engine_soun.acwrecipe",
      "title": "Engine Sound Enhancement (ESE) / Fake Engine Sound Disable",
      "raw_title": "Remove fake engine noise (STILL IN PROGRESS)\n\nNOTE: If you have the Technology package with 14 speaker B&O system, use code 2 in the ACM, and Leave DSP as code D",
      "category": "Audio and Entertainment",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/engine_sound_enhancement_ese_fake_engine_soun.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "If first digit is 1, change to 0, this  will turn off ANC (active noise cancellation). use 2 to keep ANC enabled.",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ACM",
      "system_name": "Audio Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ACM",
          "address": "727-01-01",
          "mask": "xxxx xxxx *xxx",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "DSP",
          "address": "783-01-01",
          "mask": "*xxx xxxx xx",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "C"
            }
          ],
          "feature_name": "ANC/Propulsion Sound (ANCPS)",
          "notes": "Change 1st digit to C. Note:if your AS BUILT Is a D, leave it selected to keep ANC enabled."
        }
      ],
      "import_issues": []
    },
    {
      "id": 146,
      "source_key": "altctrlwrench:ranger_6g/heated_steering_wheel_auto_shut_off_timeout.acwrecipe",
      "title": "Heated Steering Wheel Auto Shut-Off Timeout",
      "raw_title": "Adjust How long Heat stays on for Steering Wheel",
      "category": "Convenience and Electrical",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/heated_steering_wheel_auto_shut_off_timeout.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Heated Steering Wheel Auto Shutoff Time (Infinite (Default), 1-10 min, 2-15 min, 3-20 min, 4-30 min, 5-40 min, 6-50 min, 7-60 min)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Heated Steering Wheel Auto Shutoff Time (Infinite (Default), 1-10 min, 2-15 min, 3-20 min, 4-30 min, 5-40 min, 6-50 min, 7-60 min)",
      "system": "SCCM",
      "system_name": "Steering Column Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "SCCM",
          "address": "724-06-01",
          "mask": "x*xx xxxx --",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0 = No shutoff timer (default, target setting), 1-10 min, 2-15 min, 3-20 min, 4-30 min, 5-40 min, 6-50 min, 7-60 min"
        }
      ],
      "import_issues": []
    },
    {
      "id": 147,
      "source_key": "altctrlwrench:ranger_6g/heated_steering_wheel_target_temperature_setp.acwrecipe",
      "title": "Heated Steering Wheel Target Temperature Setpoint",
      "raw_title": "Adjust Temperature of Heated Steering Wheel",
      "category": "Convenience and Electrical",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/heated_steering_wheel_target_temperature_setp.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Heated Steering Wheel Temp Level (35 Celsius (Default).  24 deg through 39 degrees",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Heated Steering Wheel Temp Level (35 Celsius (Default).  24 deg through 39 degrees",
      "system": "SCCM",
      "system_name": "Steering Column Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "SCCM",
          "address": "724-06-01",
          "mask": "*xxx xxxx --",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0
              ],
              "text": "FORScan Menu: Heated Steering Wheel Temp Level (35 Celsius (Default).  24 deg through 39 degrees",
              "unit": null,
              "continuous": true
            }
          ],
          "feature_name": "HSW_Level_3_TempSetPt (HSWLTSP)",
          "notes": "* -> B (default).   set to 0 through F for 24 degrees through 39 degrees\nFORScan Menu: Heated Steering Wheel Temp Level (35 Celsius (Default).  24 deg through 39 degrees)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 148,
      "source_key": "altctrlwrench:super_duty/heated_steering_wheel_target_temperature_setp.acwrecipe",
      "title": "Heated Steering Wheel Target Temperature Setpoint",
      "raw_title": "Heated Wheel Steering Wheel Temp",
      "category": "Convenience and Electrical",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/heated_steering_wheel_target_temperature_setp.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Range 24\u00b0c-39\u00b0c (1-F) ex:B=35\u00b0c",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "SCCM",
      "system_name": "Steering Column Control",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "SCCM",
          "address": "724-06-01",
          "mask": "*xxx xxxx --",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0
              ],
              "text": "Range 24\u00b0c-39\u00b0c (1-F) ex:B=35\u00b0c",
              "unit": null,
              "continuous": true
            }
          ],
          "feature_name": "HSW_Level_3_TempSetPt (HSWLTSP)",
          "notes": "Range 24\u00b0c-39\u00b0c (1-F) ex:B=35\u00b0c"
        }
      ],
      "import_issues": []
    },
    {
      "id": 29,
      "source_key": "altctrlwrench:f150/key_in_ignition_warning_chime_disable.acwrecipe",
      "title": "Key-in-Ignition Warning Chime Disable",
      "raw_title": "Disable key-in ignition chime",
      "category": "Chimes and Horn",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/key_in_ignition_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "subtract 8 from current value (if E change to 6)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-02-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 0
              }
            }
          ],
          "feature_name": "Key In Ignition Warning Chime (KIIWC)",
          "notes": "subtract 8 from current value (if E change to 6)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 149,
      "source_key": "altctrlwrench:bronco/key_in_ignition_warning_chime_disable.acwrecipe",
      "title": "Key-in-Ignition Warning Chime Disable",
      "raw_title": "Disable key-in ignition chime",
      "category": "Chimes and Horn",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/key_in_ignition_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "changed from 0 to 2\nConfirmed: LagoCJ/multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-01-02",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "1": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "changed from 0 to 2\nConfirmed: LagoCJ/multi | Seatbelt warning switched to European standard."
        }
      ],
      "import_issues": []
    },
    {
      "id": 150,
      "source_key": "altctrlwrench:super_duty/key_in_ignition_warning_chime_disable.acwrecipe",
      "title": "Key-in-Ignition Warning Chime Disable",
      "raw_title": "Key in Ignition - Chime Disable",
      "category": "Chimes and Horn",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/key_in_ignition_warning_chime_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Subtract 8 from current value (Hex)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-02-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 0
              }
            }
          ],
          "feature_name": "REGULATORY FMVSS CHIME  (REGULATORYFMVSSCHIME)",
          "notes": "Subtract 8 from current value (Hex)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 151,
      "source_key": "altctrlwrench:mustang/rear_sequential_turn_signals_enable.acwrecipe",
      "title": "Rear Sequential Turn Signals Enable",
      "raw_title": "Rear Sequential Turn Signals",
      "category": "Lighting",
      "platform": "Mustang",
      "platform_slug": "mustang",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2024 Mustang Darkhorse (public).xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/mustang/rear_sequential_turn_signals_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCMB",
      "system_name": "BCMB",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCMB",
          "address": "7B7-03-01",
          "mask": "x*xx xxxx --",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 152,
      "source_key": "altctrlwrench:ranger_6g/tpms_tire_temperature_display_enable.acwrecipe",
      "title": "TPMS Tire Temperature Display Enable",
      "raw_title": "TPMS - Display tire temperature in addition to tire pressure",
      "category": "Cluster and Displays",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/tpms_tire_temperature_display_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Can use FORScan Easy Mode\nFORScan Menu: Tire Temperature Display (Disabled (Default), Enabled)\nTrim: All [Confirmed: jezzzza (9/12/2024) Raptor]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Tire Temperature Display (Disabled (Default), Enabled)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-11-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "Tire Temperature Display (TTD)",
          "notes": "Bit 4 (Add 8 to enable, e.g. change 2 to A)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 153,
      "source_key": "altctrlwrench:super_duty/tire_pressure_monitoring_system_tpms_enable_d.acwrecipe",
      "title": "Tire Pressure Monitoring System (TPMS) Enable/Disable",
      "raw_title": "TPMS",
      "category": "Cluster and Displays",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/tire_pressure_monitoring_system_tpms_enable_d.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "TPMS 0=Disabled  1=Enabled\nTPMS  Front/Rear Tire pressure converted to hex",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-10-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "TPMS 0=Disabled  1=Enabled"
        }
      ],
      "import_issues": []
    },
    {
      "id": 57,
      "source_key": "altctrlwrench:f150/truck_bed_cargo_lighting_switch_enable.acwrecipe",
      "title": "Truck Bed Cargo Lighting Switch Enable",
      "raw_title": "2021-23 Enabling Bed Lights/Switch",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/truck_bed_cargo_lighting_switch_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-46-01",
          "mask": "xxxx **xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "BCM",
          "address": "726-50-02",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "No Data Table"
        },
        {
          "module": "BCM",
          "address": "726-81-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "2"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 154,
      "source_key": "altctrlwrench:explorer/welcome_approach_detection_lighting.acwrecipe",
      "title": "Welcome & Approach Detection Lighting",
      "raw_title": "Enable Approach Lighting\n\nhttps://www.explorerst.org/threads/enabling-\napproach-welcome-lighting.9062/",
      "category": "Lighting",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/welcome_approach_detection_lighting.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "[BCM] - - Enable the following from DISABLED to ENABLED in BdyCM (easy way): \n-Approach Detection - Personal 1\n-Approach Detection - Personal 2\n-Approach Detection - Personal 3\n-Approach Detection - Personal 4\n-Approach Detection - Vehicle\n-Approach Detection - Initial Value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 1,
      "tier_reason": "cosmetic/convenience",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-45-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "[BCM] - - Enable the following from DISABLED to ENABLED in BdyCM (forscan easy way): \n-Approach Detection - Personal 1\n-Approach Detection - Personal 2\n-Approach Detection - Personal 3\n-Approach Detection - Personal 4\n-Approach Detection - Vehicle\n-Approach Detection - Initial Value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 155,
      "source_key": "altctrlwrench:explorer/auto_engine_idle_shutdown_aeis_30_minute_time.acwrecipe",
      "title": "Auto Engine Idle Shutdown (AEIS) 30-Minute Timer Disable",
      "raw_title": "Disable Auto Idle Shutdown of 30 minutes - \nDisables auto shutoff after 30 minutes of idling.",
      "category": "Convenience and Electrical",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/auto_engine_idle_shutdown_aeis_30_minute_time.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Change 6 to E",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "3": 1,
                "2": 1,
                "1": 1
              }
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 156,
      "source_key": "altctrlwrench:ranger_6g/autolock_autounlock_sync_menu_toggle_enable.acwrecipe",
      "title": "Autolock / Autounlock Sync Menu Toggle Enable",
      "raw_title": "Auto lock menu control",
      "category": "Locks and Security",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/autolock_autounlock_sync_menu_toggle_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Enables the Auto Unlock and Auto-relock control options \nPossible to use FORScan easy mode\nFORScan Menu: Auto Lock Control Function (Disabled (Default), Enabled)\nTrim: Enable/Disable [Confirmed: craigc (9/12/2024) Lariat]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Auto Lock Control Function (Disabled (Default), Enabled)",
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 1,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Bit 4 (Add 8 to enable, e.g. change 3 to B)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 157,
      "source_key": "altctrlwrench:ranger_6g/automatic_door_locking_at_speed_autolock.acwrecipe",
      "title": "Automatic Door Locking at Speed (Autolock)",
      "raw_title": "Auto lock doors at speed",
      "category": "Locks and Security",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/automatic_door_locking_at_speed_autolock.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: Auto Lock - Initial Value, Personal 1-4,  and Vehicle (Enabled (Default NA), Disabled)\nConfirmed: raptortugal (2/17/2025)\n* Bit4 (add 8 to enable)\nFORScan Menu: Auto Lock Control Function (Disabled (Default NA), Enabled)\nConfirmed: raptortugal (2/17/2025)\n* -> Bit 3 (add 4 to enable (if currently disabled)\nFORScan Menu: Locking Feedback Audible (optional) (Enabled (Default NA), Disabled)\nConfirmed: raptortugal (2/17/2025)\n* -> Bit 2 (add 2 to enable) (if currently disabled)\nFORScan Menu: Locking Feedback Visual (optional) (Disabled (Default NA), Enabled)\nConfirmed: raptortugal (2/17/2025)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Auto Lock - Initial Value, Personal 1-4,  and Vehicle (Enabled (Default NA), Disabled)",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "724-19-02",
          "mask": "x*x* x*x* x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            },
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            },
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            },
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "* -> set to 1 (e.g. 0101 0101 01--)\nFORScan Menu: Auto Lock - Initial Value, Personal 1-4,  and Vehicle (Enabled (Default NA), Disabled)\nConfirmed: raptortugal (2/17/2025)"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "Autolock Control Function (ACF)",
          "notes": "Enables Autolock Control Function in APIM (may already be on)\nBit4 (add 8 to enable if currently disabled (values 0-7))\nFORScan Menu: Auto Lock Control Function (Disabled (Default NA), Enabled)\nConfirmed: raptortugal (2/17/2025)"
        },
        {
          "module": "IPC",
          "address": "720-06-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "2": 1
              }
            }
          ],
          "feature_name": "Locking Feedback Audible (LFA)",
          "notes": "Adds Audible locking feedback\nBit 3 (add 4 to enable (if currently disabled)\nFORScan Menu: Locking Feedback Audible (optional) (Enabled (Default NA), Disabled)\nConfirmed: raptortugal (2/17/2025)"
        },
        {
          "module": "IPC",
          "address": "720-06-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "1": 1
              }
            }
          ],
          "feature_name": "Locking Feedback Visual (LFV)",
          "notes": "Adds visual locking feedback\nBit 2 (add 2 to enable) (if currently disabled)\nFORScan Menu: Locking Feedback Visual (optional) (Disabled (Default NA), Enabled)\nConfirmed: raptortugal (2/17/2025)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 158,
      "source_key": "altctrlwrench:ranger_6g/fog_light_memory_remember_last_state.acwrecipe",
      "title": "Fog Light Memory (Remember Last State)",
      "raw_title": "Remember fogs on/off",
      "category": "Lighting",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/fog_light_memory_remember_last_state.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: unknown, use asbuilt (advanced)\nTrim: All [Confirmed: wawy (1/22/25)]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "unknown, use asbuilt (advanced)",
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "'fog': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-39-02",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=Enabled (target setting), 1=Disabled (Default)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 159,
      "source_key": "altctrlwrench:super_duty/fog_light_memory_remember_last_state.acwrecipe",
      "title": "Fog Light Memory (Remember Last State)",
      "raw_title": "Fog Light Remember",
      "category": "Lighting",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/fog_light_memory_remember_last_state.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "0=No Cancel  1=Cancel",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 2,
      "tier_reason": "'fog': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-39-02",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "0=No Cancel  1=Cancel | Set to 0 (off), set to 1 to enable."
        }
      ],
      "import_issues": []
    },
    {
      "id": 160,
      "source_key": "altctrlwrench:ranger_6g/glare_free_matrix_high_beams_adaptive_driving.acwrecipe",
      "title": "Glare-Free Matrix High Beams (Adaptive Driving Beam)",
      "raw_title": "Glare-Free/Matrix High Beams",
      "category": "Lighting",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/glare_free_matrix_high_beams_adaptive_driving.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "GFHB is Fords term for Matrix Headlights.  Disables the high beam in sections to allow it to darken (low beam) where cars are present and high beams where cars are not present.\nFORScan Menu: Multiple settings, use asbuilt (advanced)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Multiple settings, use asbuilt (advanced)",
      "system": "IPMA",
      "system_name": "Camera / Image Processing (IPMA)",
      "tier": 2,
      "tier_reason": "'high beam': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPMA",
          "address": "706-01-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 1,
                "2": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "9=GFHB, 5=OEM (Default)"
        },
        {
          "module": "SCCM",
          "address": "724-04-01",
          "mask": "xxx* xxxx --",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "3=GFHB, 2=OEM (Default)"
        },
        {
          "module": "IPC",
          "address": "720-10-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "2=GFHB (target), 1=Auto High Beam (Default)"
        },
        {
          "module": "HCM",
          "address": "734-01-02",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "2=GFHB, 1=OEM (Default), 3=With Dynamic Bending Combined Hardware (untested) | Option not available"
        },
        {
          "module": "HCM",
          "address": "734-01-04",
          "mask": "xx** **--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 1,
                "2": 0,
                "1": 1,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "3": 1,
                "2": 1,
                "1": 0,
                "0": 1
              }
            },
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "* -> A0-D1=GFHB, 11-1E=OEM (Default)\nFORScan Value: Select according to trim level\nTrim: Raptor Only [Confirmed: moproblems (12/31/24)]"
        },
        {
          "module": "HCM",
          "address": "734-01-04",
          "mask": "xx** **--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 1,
                "2": 0,
                "1": 1,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 1
              }
            },
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "3": 0,
                "2": 1,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 1,
                "2": 1,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "* -> A5-4E=GFHB, 14-81=OEM (Default)\nTrim: Lariat Only [Confirmed: Waffel (01/06/25)]"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "1=GFHB, 3=OEM (Default)\nDisables Auto High Beam Control Function"
        },
        {
          "module": "APIM",
          "address": "7D0-09-03",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "3": 1,
                "2": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "8=GFHB, 4=OEM (Default)\nChanges APIM display from Auto High Beam to Glare Free High Beam"
        }
      ],
      "import_issues": []
    },
    {
      "id": 161,
      "source_key": "altctrlwrench:super_duty/head_up_display_hud_navigation_turn_by_turn_r.acwrecipe",
      "title": "Head-Up Display (HUD) Navigation Turn-by-Turn Repeater",
      "raw_title": "Navigation Display on HUD",
      "category": "Cluster and Displays",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/head_up_display_hud_navigation_turn_by_turn_r.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "If 1 (Gas) change to 2, If 5 (PSD) change to 6",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-05-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "If 1 (Gas) change to 2, If 5 (PSD) change to 6"
        }
      ],
      "import_issues": []
    },
    {
      "id": 162,
      "source_key": "altctrlwrench:bronco/navigation_destination_input_in_motion_enable.acwrecipe",
      "title": "Navigation Destination Input in Motion Enable",
      "raw_title": "Navigation in Motion",
      "category": "Sync and Infotainment",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/navigation_destination_input_in_motion_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "911 Assist will be disabled, potentially Sirius Travel Link too.\nFirst Letter of Country Code (FLCC)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-03-01",
          "mask": "**xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "5"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "7"
            }
          ],
          "feature_name": null,
          "notes": "911 Assist will be disabled, potentially Sirius Travel Link too.\nFirst Letter of Country Code (FLCC)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 163,
      "source_key": "altctrlwrench:super_duty/navigation_destination_input_in_motion_enable.acwrecipe",
      "title": "Navigation Destination Input in Motion Enable",
      "raw_title": "Navigation in Motion",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/navigation_destination_input_in_motion_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Breaks Sync Voice - KIP programing option screen",
      "warnings": "Disables Sync Voice input while vehicle is in motion.",
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-03-01",
          "mask": "**** xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 0,
              "hex": "5"
            },
            {
              "kind": "set",
              "pos": 1,
              "hex": "7"
            },
            {
              "kind": "set",
              "pos": 2,
              "hex": "5"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "3"
            }
          ],
          "feature_name": null,
          "notes": "Breaks Sync Voice - KIP programing option screen"
        }
      ],
      "import_issues": []
    },
    {
      "id": 36,
      "source_key": "altctrlwrench:f150/off_road_front_camera_view_at_speed.acwrecipe",
      "title": "Off-Road Front Camera View at Speed",
      "raw_title": "Enable OffRoad (Rock Crawl, Mud/Ruts, and Deep Snow/Sand) Front Camera at Speed",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/off_road_front_camera_view_at_speed.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPMA",
      "system_name": "Camera / Image Processing (IPMA)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPMA",
          "address": "706-02-02",
          "mask": "xxxx xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "3"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 37,
      "source_key": "altctrlwrench:f150/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "title": "Rear Camera 'Full View Not Available' Warning Overlay Removal",
      "raw_title": "Removes black box on reverse camera that says \"full view not available\"",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "If your current value is 0 then change to 1, 2 change to 3, 4 change to 5, 6 change to 7  Note: reset APIM after the change",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": "Reset APIM in FORScan or cycle ignition.",
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "RCOD HMI w/o Blackbox (RCODHMIB)",
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 164,
      "source_key": "altctrlwrench:explorer/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "title": "Rear Camera 'Full View Not Available' Warning Overlay Removal",
      "raw_title": "Removes \"Full View Not Available\" message in rear camera view.\n\n(Allows cams in motion at any speed without black box in middle)",
      "category": "Cameras and ADAS",
      "platform": "Explorer",
      "platform_slug": "explorer",
      "model_years": "2025-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2025-2026 Explorer.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/explorer/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "negated",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "RCOD HMI w/o Blackbox (RCODHMIB)",
          "notes": "If your current value is 0 then change to 1, 2 change to 3, 4 change to 5, 6 change to 7\n\nNote: reset APIM after the change"
        }
      ],
      "import_issues": []
    },
    {
      "id": 165,
      "source_key": "altctrlwrench:ranger_6g/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "title": "Rear Camera 'Full View Not Available' Warning Overlay Removal",
      "raw_title": "Removes black box on reverse camera that says \"full view not available",
      "category": "Cameras and ADAS",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: unknown, use asbuilt (advanced)\nConfirmed: craigc (9/12/2024) Lariat",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "unknown, use asbuilt (advanced)",
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "Powerflow Type (PT)",
          "notes": "Bit 1 (add 1 to enable, e.g. change 2 to 3) | Specific setting not listed on this sheet, using old value (untested)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 166,
      "source_key": "altctrlwrench:super_duty/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "title": "Rear Camera 'Full View Not Available' Warning Overlay Removal",
      "raw_title": "Remove Black Box when rear camera on while driving",
      "category": "Cameras and ADAS",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/rear_camera_full_view_not_available_warning_o.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 1 to Current Value - Sync version must be 23151 rev 902 or higher",
      "warnings": null,
      "prerequisites": "Sync version must be 23151 rev 902 or higher",
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "RCOD HMI w/o Blackbox (RCODHMIB)",
          "notes": "Add 1 to Current Value - Sync version must be 23151 rev 902 or higher"
        }
      ],
      "import_issues": []
    },
    {
      "id": 38,
      "source_key": "altctrlwrench:f150/rear_camera_full_view_not_available_warning_o_2.acwrecipe",
      "title": "Rear Camera 'Full View Not Available' Warning Overlay Removal (variant 2)",
      "raw_title": "Removes black box on reverse camera that says \"full view not available",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/rear_camera_full_view_not_available_warning_o_2.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "If your current value is 0 then change to 1, 2 change to 3, 4 change to 5, 6 change to 7  Note: reset APIM after the change",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": "Reset APIM in FORScan or cycle ignition.",
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "category Cameras and ADAS",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-02",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "0": 0
              }
            }
          ],
          "feature_name": "RCOD HMI w/o Blackbox (RCODHMIB)",
          "notes": "If your current value is 0 then change to 1, 2 change to 3, 4 change to 5, 6 change to 7  Note: reset APIM after the change"
        }
      ],
      "import_issues": []
    },
    {
      "id": 167,
      "source_key": "altctrlwrench:bronco/remote_engine_start_enable_manual_transmissio.acwrecipe",
      "title": "Remote Engine Start Enable (Manual Transmission)",
      "raw_title": "Remote Start - 7-Speed",
      "category": "Convenience and Electrical",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/remote_engine_start_enable_manual_transmissio.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Remote Start via Keyfob\nConfirmed: Buck Your Bronco\nRemote Start Enable\nConfirmed: Buck Your Bronco\nRemote Start Lightning Enable\nConfirmed: Buck Your Bronco\nTwo-way Remote Keyless Entry Enable\nConfirmed: Buck Your Bronco\nRemote Start feature Enable\nConfirmed: Buck Your Bronco",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'engine' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-02-02",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 4,
              "hex": "F"
            }
          ],
          "feature_name": null,
          "notes": "Remote Start Climate, Drivers Seat, Feature, Passenger Seat"
        },
        {
          "module": "BCM",
          "address": "726-30-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Remote Start Enable"
        },
        {
          "module": "BCM",
          "address": "726-63-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Remote Start Lightning Enable"
        },
        {
          "module": "BCM",
          "address": "726-66-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "Two-way Remote Keyless Entry Enable"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xxxx xxxx *x--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "F"
            }
          ],
          "feature_name": null,
          "notes": "Enables toggles in APIM for Feature, Climate, and Drivers/Passenger seat."
        }
      ],
      "import_issues": []
    },
    {
      "id": 43,
      "source_key": "altctrlwrench:f150/securicode_door_pillar_keypad_enable.acwrecipe",
      "title": "SecuriCode Door Pillar Keypad Enable",
      "raw_title": "Keypad Enable (wired keypad)",
      "category": "Locks and Security",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/securicode_door_pillar_keypad_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "See this post if you don't know the factory code https://www.f150forum.com/f129/forscan-14th-gen-f150s-481816/index67/#post6964982",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "category Locks and Security",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-31-01",
          "mask": "xxxx xx** xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 6,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "See this post if you don't know the factory code"
        },
        {
          "module": "APIM",
          "address": "7D0-01-02",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "1": 1
              }
            }
          ],
          "feature_name": "Door Keypad Code (DKC)",
          "notes": "optional - adds door keypad code to Sync settings use 6 if you have ambient lighting or 2 if you don't"
        }
      ],
      "import_issues": []
    },
    {
      "id": 44,
      "source_key": "altctrlwrench:f150/silent_mode_police_dark_car_mode.acwrecipe",
      "title": "Silent Mode / Police Dark Car Mode",
      "raw_title": "2021-26 Silent Mode - adds toggle in Sync under Settings, Vehicle (prevents any approach lighting, lock/unlock lighting, courtesy lights until truck is turned on)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/silent_mode_police_dark_car_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "add 1 to current value (if C, make D) Note: reset APIM after change if toggle doesn't show (forscan wrench icon)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": "Reset APIM in FORScan or cycle ignition.",
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "'silent mode': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-09-02",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "Silent Mode Control Function (SMCF)",
          "notes": "add 1 to current value (if C, make D) Note: reset APIM after change if toggle doesn't show (forscan wrench icon)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 168,
      "source_key": "altctrlwrench:ranger_6g/silent_mode_police_dark_car_mode.acwrecipe",
      "title": "Silent Mode / Police Dark Car Mode",
      "raw_title": "Silent/Dark mode control",
      "category": "Convenience and Electrical",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/silent_mode_police_dark_car_mode.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Can be changed in FORScan Easy Mode\nFORScan Menu: IMC Silent mode control function (Disabled (Default), Enabled)\nConfirmed: craigc (9/12/2024) Lariat\nFORScan Value: APIM Disabled (Default), Enabled\nAlso req force reset the APIM Module in ForScan\nConfirmed: craigc (9/12/2024) Lariat",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "IMC Silent mode control function (Disabled (Default), Enabled)",
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'silent mode': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-04-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "Suggest to use the non-asbuilt menu to change\n* Bit 3 (Add 4 to value to enable)\nFORScan Menu: Silent mode control function (Disabled (Default), Enabled)\nConfirmed: craigc (9/12/2024) Lariat"
            },
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "2": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Suggest to use the non-asbuilt menu to change\n* Bit 3 (Add 4 to value to enable)\nFORScan Menu: Silent mode control function (Disabled (Default), Enabled)\nConfirmed: craigc (9/12/2024) Lariat"
        },
        {
          "module": "APIM",
          "address": "7D0-09-02",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "Silent Mode Control Function (SMCF)",
          "notes": "* Bit 1 (add 1 to value to enable) (e.g. E to F) and reset APIM\nFORScan Value: Disabled (Default), Enabled\nAlso req force reset the APIM Module in ForScan\nConfirmed: craigc (9/12/2024) Lariat"
        }
      ],
      "import_issues": [
        "720-04-01: nibble 2 is not a '*' position in mask 'xxx* xxxx xx--'"
      ]
    },
    {
      "id": 169,
      "source_key": "altctrlwrench:super_duty/siriusxm_audio_source_removal.acwrecipe",
      "title": "SiriusXM Audio Source Removal",
      "raw_title": "XM/Sirius Radio from Source -Remove",
      "category": "Audio and Entertainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/siriusxm_audio_source_removal.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "If * is A change to 8, if 2 change to 0. (Back 2)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-01-01",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "1": 0
              }
            }
          ],
          "feature_name": "SDARS (SDARS)",
          "notes": "If * is A change to 8, if 2 change to 0. (Back 2)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 170,
      "source_key": "altctrlwrench:super_duty/sync_bluetooth_broadcast_name_customization.acwrecipe",
      "title": "Sync Bluetooth Broadcast Name Customization",
      "raw_title": "Bluetooth Name",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/sync_bluetooth_broadcast_name_customization.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "2D=Raptor  0E=F150  0F=F250  10=F350  11=F450",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-04-01",
          "mask": "xxxx xx** xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": null,
              "text": "2D=Raptor  0E=F150  0F=F250  10=F350  11=F450"
            }
          ],
          "feature_name": "Stop Mode Timer (SMT)",
          "notes": "2D=Raptor  0E=F150  0F=F250  10=F350  11=F450"
        }
      ],
      "import_issues": [
        "7D0-04-01: nibble None is not a '*' position in mask 'xxxx xx** xx--'"
      ]
    },
    {
      "id": 50,
      "source_key": "altctrlwrench:f150/sync_unreal_engine_graphic_ui_theme_enable.acwrecipe",
      "title": "Sync Unreal Engine Graphic UI Theme Enable",
      "raw_title": "Enable Unreal Sync Theme",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_unreal_engine_graphic_ui_theme_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-03",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "No data"
        }
      ],
      "import_issues": []
    },
    {
      "id": 171,
      "source_key": "altctrlwrench:super_duty/sync_unreal_engine_graphic_ui_theme_enable.acwrecipe",
      "title": "Sync Unreal Engine Graphic UI Theme Enable",
      "raw_title": "Enable Unreal Sync Theme",
      "category": "Sync and Infotainment",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/sync_unreal_engine_graphic_ui_theme_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-02-03",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 51,
      "source_key": "altctrlwrench:f150/sync_vehicle_maintenance_oil_life_screen_enab.acwrecipe",
      "title": "Sync Vehicle Maintenance Oil Life Screen Enable",
      "raw_title": "Enable Oil Life in Sync Settings, Vehicle",
      "category": "Sync and Infotainment",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/sync_vehicle_maintenance_oil_life_screen_enab.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'oil life' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-10-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "8"
            }
          ],
          "feature_name": "Oil Life  (OL)",
          "notes": "No data"
        }
      ],
      "import_issues": []
    },
    {
      "id": 172,
      "source_key": "altctrlwrench:bronco/sync_visual_design_variants_hmi_theme.acwrecipe",
      "title": "Sync Visual Design Variants (HMI Theme)",
      "raw_title": "Screen - Visual Design Variants (VDV)",
      "category": "Sync and Infotainment",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/sync_visual_design_variants_hmi_theme.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "05=Lincoln Sync 4 13.2\" (Dashcard)\n06=Ford Sync 4 13.2\" (Dashcard)\n0A=12\" Landscape (Dashcard)\nConfirmed: Unconfirmed",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-03-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "bits",
              "pos": 8,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Leave 0"
        }
      ],
      "import_issues": []
    },
    {
      "id": 173,
      "source_key": "altctrlwrench:super_duty/trailer_tpms_system_enable.acwrecipe",
      "title": "Trailer TPMS System Enable",
      "raw_title": "Trailer TPMS Enable",
      "category": "Cluster and Displays",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/trailer_tpms_system_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 2 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 2,
      "tier_reason": "'trailer': safety-visible or legally regulated behavior",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-09-01",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "Down shift Indicator (DI)",
          "notes": "Add 2 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 174,
      "source_key": "altctrlwrench:ranger_6g/welcome_approach_detection_lighting.acwrecipe",
      "title": "Welcome & Approach Detection Lighting",
      "raw_title": "Welcome lights (approach detection)\n\n** WARNING ** enabling this some have commented that the keyless touch entry is less sensitive to locking/unlocking the door",
      "category": "Lighting",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/welcome_approach_detection_lighting.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Trim: All? [Confirmed: craigc (9/11/2024) Lariat FX4]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 2,
      "tier_reason": "APIM (SYNC) writes can cause boot loops if wrong",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-45-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "* -> 0=Disabled, 1=Enabled\nFORScan Menu: unknown, use asbuilt (advanced)\nTrim: All? [Confirmed: craigc (9/11/2024) Lariat FX4]"
        },
        {
          "module": "BCM",
          "address": "726-18-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "* -> 0=Disabled, 1=Enabled\nFORScan Menu: unknown, use asbuilt (advanced)"
        },
        {
          "module": "APIM",
          "address": "7D0-09-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "2": 1
              }
            }
          ],
          "feature_name": "Approach Detection Control Function (ADCF)",
          "notes": "suggest using non asbuilt to change this\n* Bit 3 (add 4 to value to enable, e.g. change 3 to 7)\nFORScan Menu: Approach Detection Control Function (Disabled to Enabled, plus it's required to also make the BdyCm Changes above)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 4,
      "source_key": "altctrlwrench:f150/acoustic_vehicle_alerting_system_avas_speaker.acwrecipe",
      "title": "Acoustic Vehicle Alerting System (AVAS) Speaker Disable",
      "raw_title": "Disable Pedestrian Alert Speaker",
      "category": "Chimes and Horn",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/acoustic_vehicle_alerting_system_avas_speaker.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "If your default is 4 change to 0, if default is 5 change to 1 AND disconnect PACM under the glove box according to this video: https://youtu.be/0K9M7hZQTec",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 3,
      "tier_reason": "'avas' is powertrain/ADAS/braking/steering/EV-critical or regulated",
      "ev_status": "EV_MENTIONED",
      "ev_reason": "text mentions 'avas' (still unverified on your truck)",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-09-02",
          "mask": "x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 1,
              "bits": {
                "2": 0
              }
            }
          ],
          "feature_name": "Approaching Vehicle Audible System (AVAS)",
          "notes": "If your default is 4 change to 0, if default is 5 change to 1 AND disconnect PACM under the glove box according to this video: https://youtu.be/0K9M7hZQTec"
        }
      ],
      "import_issues": []
    },
    {
      "id": 5,
      "source_key": "altctrlwrench:f150/active_front_air_dam_motor_disable.acwrecipe",
      "title": "Active Front Air Dam Motor Disable",
      "raw_title": "Disable Active Air Dam (2021-2026)",
      "category": "Powertrain and Drivetrain",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/active_front_air_dam_motor_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": null,
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "PCM",
      "system_name": "Powertrain Control",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "EV_MENTIONED",
      "ev_reason": "text mentions 'air dam' (still unverified on your truck)",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "PCM",
          "address": "7E0-162-02",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "No data table"
        }
      ],
      "import_issues": []
    },
    {
      "id": 8,
      "source_key": "altctrlwrench:f150/auto_start_stop_system_disable.acwrecipe",
      "title": "Auto Start/Stop System Disable",
      "raw_title": "Auto Start/Stop Disabled",
      "category": "Powertrain and Drivetrain",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/auto_start_stop_system_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "tricks Auto Start/Stop into thinking a steering event is happening at a stop so ASS never happens",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "PSCM",
      "system_name": "Power Steering",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'start/stop' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "PSCM",
          "address": "730-03-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "0"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "tricks Auto Start/Stop into thinking a steering event is happening at a stop so ASS never happens"
        },
        {
          "module": "HVAC",
          "address": "733-01-05",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            }
          ],
          "feature_name": "Front Left Heated Seat High Setting (FLHSHS)",
          "notes": "optional - disables Auto Stop/Start switch from illuminating | Set that vehicle is NOT equipped with start stop button | No data table available"
        }
      ],
      "import_issues": []
    },
    {
      "id": 175,
      "source_key": "altctrlwrench:bronco/auto_start_stop_system_disable.acwrecipe",
      "title": "Auto Start/Stop System Disable",
      "raw_title": "Disable Auto Start-Stop",
      "category": "Powertrain and Drivetrain",
      "platform": "Bronco",
      "platform_slug": "bronco",
      "model_years": "2021-2024",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2022 Bronco.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/bronco/auto_start_stop_system_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Start / Stop: 00=Disabled 01=Enabled, Angle Inhibit Enabled 02=Enabled, Angle Inhibit Disabled\nConfirmed: D2dhanover/multi",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "PSCM",
      "system_name": "Power Steering",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'start/stop' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "PSCM",
          "address": "730-03-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "bits",
              "pos": 8,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            },
            {
              "kind": "bits",
              "pos": 9,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 0,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Start / Stop: 00=Disabled 01=Enabled, Angle Inhibit Enabled 02=Enabled, Angle Inhibit Disabled\nConfirmed: D2dhanover/multi"
        }
      ],
      "import_issues": []
    },
    {
      "id": 176,
      "source_key": "altctrlwrench:super_duty/auto_start_stop_system_disable.acwrecipe",
      "title": "Auto Start/Stop System Disable",
      "raw_title": "Auto Start/Stop Disable (May not work on 24+)",
      "category": "Powertrain and Drivetrain",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/auto_start_stop_system_disable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Disables Auto Stop/Start switch from illuminating",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "PSCM",
      "system_name": "Power Steering",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'start/stop' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "PSCM",
          "address": "730-03-01",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 9,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "HVAC",
          "address": "733-01-05",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "0"
            }
          ],
          "feature_name": null,
          "notes": "Disables Auto Stop/Start switch from illuminating"
        }
      ],
      "import_issues": []
    },
    {
      "id": 177,
      "source_key": "altctrlwrench:super_duty/autohold_brake_memory_default_state.acwrecipe",
      "title": "AutoHold Brake Memory / Default State",
      "raw_title": "AutoHold",
      "category": "Powertrain and Drivetrain",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/autohold_brake_memory_default_state.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 1 to current value\nAdd 4 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ABS",
      "system_name": "ABS",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ABS",
          "address": "760-03-01",
          "mask": "*xxx xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 0,
              "bits": {
                "3": 0,
                "2": 0,
                "0": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Add 1 to current value"
        },
        {
          "module": "APIM",
          "address": "7D0-01-03",
          "mask": "xx*x xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 2,
              "bits": {
                "2": 1
              }
            }
          ],
          "feature_name": "Auto Hold (AH)",
          "notes": "Add 4 to current value"
        },
        {
          "module": "IPC",
          "address": "720-02-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "AutoHold (AH)",
          "notes": "Add 1 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 11,
      "source_key": "altctrlwrench:f150/bluecruise_traffic_jam_assist_mode_selection.acwrecipe",
      "title": "BlueCruise / Traffic Jam Assist Mode Selection",
      "raw_title": "ADAS - Advanced Driver Assist Systems\nDisable BlueCruise and enable Traffic Jam Assist\n(settings for normal Adaptive Cruise Control) (2021-2026)",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/bluecruise_traffic_jam_assist_mode_selection.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "enables Traffic Jam Assist & disables Highway Assist",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPMA",
      "system_name": "Camera / Image Processing (IPMA)",
      "tier": 3,
      "tier_reason": "'bluecruise' is powertrain/ADAS/braking/steering/EV-critical or regulated",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPMA",
          "address": "706-01-01",
          "mask": "xxx* xxxx *x--",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "8"
            },
            {
              "kind": "set",
              "pos": 8,
              "hex": "8"
            }
          ],
          "feature_name": null,
          "notes": "enables Traffic Jam Assist & disables Highway Assist"
        }
      ],
      "import_issues": []
    },
    {
      "id": 10,
      "source_key": "altctrlwrench:f150/bluecruise_1_4_feature_set_lane_biasing_curve.acwrecipe",
      "title": "BlueCruise 1.4 Feature Set (Lane Biasing & Curve Speed)",
      "raw_title": "Bluecruise 1.4 Settings   (IPMA strategy must be on ACJ or BBC for this to work)",
      "category": "Cameras and ADAS",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/bluecruise_1_4_feature_set_lane_biasing_curve.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Lane Biasing (Under Cruise Control), Predictive Speed Assist (Under Cruise Control)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "APIM",
      "system_name": "SYNC / Infotainment (APIM)",
      "tier": 3,
      "tier_reason": "'bluecruise' is powertrain/ADAS/braking/steering/EV-critical or regulated",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "APIM",
          "address": "7D0-09-05",
          "mask": "xxxx xx*x *x--",
          "ops": [
            {
              "kind": "set",
              "pos": 6,
              "hex": "4"
            },
            {
              "kind": "set",
              "pos": 8,
              "hex": "2"
            }
          ],
          "feature_name": null,
          "notes": "Lane Biasing (Under Cruise Control), Predictive Speed Assist (Under Cruise Control)"
        },
        {
          "module": "APIM",
          "address": "7D0-10-02",
          "mask": "xxxx xxxx *x--",
          "ops": [
            {
              "kind": "set",
              "pos": 8,
              "hex": "1"
            }
          ],
          "feature_name": "Assisted Lane Change  (ALC)",
          "notes": "Lane Change Assist (under Cruise Control)"
        },
        {
          "module": "IPMA",
          "address": "706-01-01",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "E"
            }
          ],
          "feature_name": null,
          "notes": "MFCLKS LKAlert+LKAid+LCWA"
        },
        {
          "module": "IPMA",
          "address": "706-01-02",
          "mask": "x*xx xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "5"
            }
          ],
          "feature_name": null,
          "notes": "ModuleFeatureCfg_ALB (MFCALB)&ModuleFeatureCfg_ALC (MFCALC) | No Data Table"
        },
        {
          "module": "IPMA",
          "address": "706-02-02",
          "mask": "xxxx xxxx x*--",
          "ops": [
            {
              "kind": "manual",
              "pos": 9,
              "text": "FeatureCfg_IACCMode (FCIACCM) FCIACCM Preview+CurveControl"
            }
          ],
          "feature_name": "FeatureCfg_BA_DefaultMode",
          "notes": "FeatureCfg_IACCMode (FCIACCM) FCIACCM Preview+CurveControl"
        },
        {
          "module": "IPMA",
          "address": "706-38-01",
          "mask": "x*x* xxxx xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 1,
              "hex": "8"
            },
            {
              "kind": "set",
              "pos": 3,
              "hex": "8"
            }
          ],
          "feature_name": null,
          "notes": "CustomerSetting_ALBSelected_Vehicle (CSALBSV),  CustomerSetting_ALCSelected_Vehicle (CSALCSV)"
        }
      ],
      "import_issues": []
    },
    {
      "id": 12,
      "source_key": "altctrlwrench:f150/camper_shell_third_brake_light_chmsl_circuit_.acwrecipe",
      "title": "Camper Shell Third Brake Light (CHMSL) Circuit Enable",
      "raw_title": "Enable Extra Brake Light Wire Circuit for Camper Shell (2021-23)",
      "category": "Lighting",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/camper_shell_third_brake_light_chmsl_circuit_.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "see this thread for description https://www.f150gen14.com/forum/threads/bed-cap-install-wiring-issues.7353/page-3",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCMC",
      "system_name": "Body Control Module C",
      "tier": 3,
      "tier_reason": "'brake' is powertrain/ADAS/braking/steering/EV-critical or regulated",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCMC",
          "address": "6F0-01-03",
          "mask": "xxx* --",
          "ops": [
            {
              "kind": "set",
              "pos": 3,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": "see this thread for description | No data table"
        }
      ],
      "import_issues": []
    },
    {
      "id": 178,
      "source_key": "altctrlwrench:super_duty/diesel_exhaust_auto_regen_control_checkbox_en.acwrecipe",
      "title": "Diesel Exhaust Auto Regen Control Checkbox Enable",
      "raw_title": "Auto Regen Checkbox",
      "category": "Powertrain and Drivetrain",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/diesel_exhaust_auto_regen_control_checkbox_en.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "[PCM] Plain English - Select option 3 under manual regen\nAdd 8 to current value\nAdd 2 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "ICE_ONLY",
      "ev_reason": "'diesel' refers to an engine/ICE feature the Lightning does not have",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-02",
          "mask": "xxx* xx",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "Auto Regen Control (ARC)",
          "notes": "[PCM] Plain English - Select option 3 under manual regen\nAdd 8 to current value"
        },
        {
          "module": "APIM",
          "address": "7D0-09-03",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "1": 1
              }
            }
          ],
          "feature_name": "Auto Regen Control (ARC)",
          "notes": "Add 2 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 179,
      "source_key": "altctrlwrench:ranger_6g/drive_mode_rock_crawl_enable.acwrecipe",
      "title": "Drive Mode - Rock Crawl Enable",
      "raw_title": "Enable ROCK/CRAWL mode on XL, XLT, lariat, etc.",
      "category": "Powertrain and Drivetrain",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/drive_mode_rock_crawl_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "FORScan Menu: SDM - Mode 10 (Rock/Crawl?) (Disabled (Default), Enabled)\nTrim: 4x4 [Confirmed: craigc (9/12/2024) Lariat]",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "SDM - Mode 10 (Rock/Crawl?) (Disabled (Default), Enabled)",
      "system": "ABS",
      "system_name": "ABS",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ABS",
          "address": "760-04-03",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": 7,
              "text": "* -> 3=Enabled\nFORScan Menu: SDM - Mode 10 (Rock/Crawl?) (Disabled (Default), Enabled)\nTrim: 4x4 [Confirmed: craigc (9/12/2024) Lariat]"
            }
          ],
          "feature_name": "SDM_GENERIC_MODE12 (SDMGENERICMODE)",
          "notes": "* -> 3=Enabled\nFORScan Menu: SDM - Mode 10 (Rock/Crawl?) (Disabled (Default), Enabled)\nTrim: 4x4 [Confirmed: craigc (9/12/2024) Lariat]"
        }
      ],
      "import_issues": []
    },
    {
      "id": 180,
      "source_key": "altctrlwrench:super_duty/drive_mode_rock_crawl_enable.acwrecipe",
      "title": "Drive Mode - Rock Crawl Enable",
      "raw_title": "Rock Crawl Mode (enable)",
      "category": "Powertrain and Drivetrain",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/drive_mode_rock_crawl_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 2 to current value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ABS",
      "system_name": "ABS",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ABS",
          "address": "760-04-03",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "3": 0,
                "2": 0,
                "1": 1,
                "0": 0
              }
            }
          ],
          "feature_name": null,
          "notes": "Add 2 to current value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 23,
      "source_key": "altctrlwrench:f150/factory_trailer_brake_controller_tbc_module_e.acwrecipe",
      "title": "Factory Trailer Brake Controller (TBC) Module Enable",
      "raw_title": "2021-26 - Adding OEM Trailer Brake Controller",
      "category": "Powertrain and Drivetrain",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/factory_trailer_brake_controller_tbc_module_e.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "use E for a turbo engine, use A for a 5.0L",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "IPC",
      "system_name": "Instrument Cluster",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "IPC",
          "address": "720-07-01",
          "mask": "xxxx x*xx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "Trailer Brake Controller (TBC)",
          "notes": "use E for a turbo engine, use A for a 5.0L"
        },
        {
          "module": "BCM",
          "address": "726-69-02",
          "mask": "xxxx x*xx x*--",
          "ops": [
            {
              "kind": "set",
              "pos": 5,
              "hex": "1"
            },
            {
              "kind": "set",
              "pos": 9,
              "hex": "1"
            }
          ],
          "feature_name": null,
          "notes": null
        },
        {
          "module": "TRM",
          "address": "791-01-02",
          "mask": "xxxx x*--",
          "ops": [
            {
              "kind": "bits",
              "pos": 5,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "TBM_Cfg (TBMC)",
          "notes": "add 1 to current value (if 4 make 5, if 2 make 3)"
        },
        {
          "module": "APIM",
          "address": "7D0-09-03",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "4"
            }
          ],
          "feature_name": "Trailer Brake Controller (TBC)",
          "notes": null
        },
        {
          "module": "IPMA",
          "address": "706-18-01",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "set",
              "pos": 7,
              "hex": "C"
            }
          ],
          "feature_name": null,
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 181,
      "source_key": "altctrlwrench:super_duty/hill_descent_control_switch_enable.acwrecipe",
      "title": "Hill Descent Control Switch Enable",
      "raw_title": "Hill Descent",
      "category": "Powertrain and Drivetrain",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/hill_descent_control_switch_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Add 2 to your value",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "ABS",
      "system_name": "ABS",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ABS",
          "address": "760-03-01",
          "mask": "xxxx *xxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "2": 0,
                "1": 1
              }
            }
          ],
          "feature_name": null,
          "notes": "Add 2 to your value"
        }
      ],
      "import_issues": []
    },
    {
      "id": 52,
      "source_key": "altctrlwrench:f150/tire_size_calibration_pcm_bcm_circumference.acwrecipe",
      "title": "Tire Size Calibration (PCM / BCM Circumference)",
      "raw_title": "Tire Size - requires PCM Relearn procedure after change (2021-26)",
      "category": "Powertrain and Drivetrain",
      "platform": "F-150",
      "platform_slug": "f150",
      "model_years": "2021-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2021-2026 F150.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/f150/tire_size_calibration_pcm_bcm_circumference.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "First two digits of tire circumference in MM encoded in hex.  Check speed vs GPS, then tweak to correct speedometer with GSP speed",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BCM",
      "system_name": "Body Control Module",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BCM",
          "address": "726-15-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                8,
                9
              ],
              "text": "First two digits of tire circumference in MM encoded in hex.  Check speed vs GPS, then tweak to correct speedometer with GSP speed",
              "unit": "mm",
              "continuous": true
            }
          ],
          "feature_name": "Tire Circumference (TC)",
          "notes": "First two digits of tire circumference in MM encoded in hex"
        },
        {
          "module": "BCM",
          "address": "726-15-02",
          "mask": "**xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0,
                1
              ],
              "text": "First two digits of tire circumference in MM encoded in hex.  Check speed vs GPS, then tweak to correct speedometer with GSP speed",
              "unit": "mm",
              "continuous": true
            }
          ],
          "feature_name": "Tire Circumference (TC)",
          "notes": "Last two digits of tire circumference in MM encoded in hex"
        }
      ],
      "import_issues": []
    },
    {
      "id": 182,
      "source_key": "altctrlwrench:super_duty/tire_size_calibration_pcm_bcm_circumference.acwrecipe",
      "title": "Tire Size Calibration (PCM / BCM Circumference)",
      "raw_title": "Tire Size",
      "category": "Powertrain and Drivetrain",
      "platform": "Super Duty",
      "platform_slug": "super_duty",
      "model_years": "2023-2026",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "2023 Super Duty.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/super_duty/tire_size_calibration_pcm_bcm_circumference.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Tire Size Calculator https://docs.google.com/spreadsheets/d/1EaVYjY7QC8iYAdsiYnSeJQ9SbyMEVSTYz0Kmb0at4Ps/edit?usp=sharing",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": null,
      "system": "BDYCM-BCM",
      "system_name": "BDYCM-BCM",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "BDYCM-BCM",
          "address": "726-15-01",
          "mask": "xxxx xxxx **--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                8,
                9
              ],
              "text": "Tire Size Calculator https://docs.google.com/spreadsheets/d/1EaVYjY7QC8iYAdsiYnSeJQ9SbyMEVSTYz0Kmb0at4Ps/edit?usp=sharing",
              "unit": "mm",
              "continuous": true
            }
          ],
          "feature_name": "Tire Circumference (TC)",
          "notes": "Tire Size Calculator"
        },
        {
          "module": "",
          "address": "726-15-02",
          "mask": "**xx xx--",
          "ops": [
            {
              "kind": "manual",
              "pos": [
                0,
                1
              ],
              "text": "Tire Size Calculator https://docs.google.com/spreadsheets/d/1EaVYjY7QC8iYAdsiYnSeJQ9SbyMEVSTYz0Kmb0at4Ps/edit?usp=sharing",
              "unit": "mm",
              "continuous": true
            }
          ],
          "feature_name": "Tire Circumference (TC)",
          "notes": null
        }
      ],
      "import_issues": []
    },
    {
      "id": 183,
      "source_key": "altctrlwrench:ranger_6g/trail_turn_assist_enable.acwrecipe",
      "title": "Trail Turn Assist Enable",
      "raw_title": "Enables Trail Turn Assist",
      "category": "Powertrain and Drivetrain",
      "platform": "Ranger (6G)",
      "platform_slug": "ranger_6g",
      "model_years": "2024+",
      "trim_claimed": "All",
      "upstream_validated": 1,
      "upstream_verified_by": "Kyle / AsBuiltPro",
      "source_sheet": "(2024+) 6G Ranger.xlsx",
      "source_url": "https://github.com/altctrlwrench/forscanconfigviewer/blob/HEAD/recipes/ranger_6g/trail_turn_assist_enable.acwrecipe",
      "source_confidence": "community-recipe",
      "notes": "Confirmed: DIYPSCM (1/28/25) Lariat\nFORScan Menu: Trail Turn assist (Disabled (Default), Enabled)\nConfirmed: BigMeatsBronco (1/28/25) Raptor\nFORScan Menu: Off-road Menu - Trail turn Assist (Disabled (Default), Enabled)",
      "warnings": null,
      "prerequisites": null,
      "post_procedure": null,
      "forscan_menu": "Trail Turn assist (Disabled (Default), Enabled)",
      "system": "ABS",
      "system_name": "ABS",
      "tier": 3,
      "tier_reason": "category Powertrain and Drivetrain",
      "ev_status": "UNVERIFIED",
      "ev_reason": "community entry says 'All' trims; never confirmed on a Lightning",
      "popularity": 0,
      "popularity_reason": "no editorial ranking",
      "date_checked": "2026-10-27",
      "status": "DRAFT",
      "verified_on_my_truck": 0,
      "wanted": 0,
      "user_notes": null,
      "steps": [
        {
          "module": "ABS",
          "address": "760-03-01",
          "mask": "xxxx *x--",
          "ops": [
            {
              "kind": "bits",
              "pos": 4,
              "bits": {
                "3": 1
              }
            }
          ],
          "feature_name": "TTA (TTA)",
          "notes": "Bit 4 (add 8 to enable)\nFORScan Menu: unknown, use asbuilt (advanced) (Not available - use asbuilt)\nConfirmed: DIYPSCM (1/28/25) Lariat"
        },
        {
          "module": "APIM",
          "address": "7D0-02-01",
          "mask": "xxx* xxxx xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 3,
              "bits": {
                "0": 1
              }
            }
          ],
          "feature_name": "Trail Turn Assist (TTA)",
          "notes": "Bit 1 (add 1 to enable)\nFORScan Menu: Trail Turn assist (Disabled (Default), Enabled)\nConfirmed: BigMeatsBronco (1/28/25) Raptor"
        },
        {
          "module": "APIM",
          "address": "7D0-10-02",
          "mask": "xxxx xxx* xx--",
          "ops": [
            {
              "kind": "bits",
              "pos": 7,
              "bits": {
                "2": 1
              }
            }
          ],
          "feature_name": "Offroad Menu Trail Turn Assist (OMTTA)",
          "notes": "Bit 3 (add 4 to enable)\nFORScan Menu: Off-road Menu - Trail turn Assist (Disabled (Default), Enabled)"
        }
      ],
      "import_issues": []
    }
  ]
};
