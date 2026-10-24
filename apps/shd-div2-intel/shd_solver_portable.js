/**
 * SHD Tactical Inventory & Build Intelligence Platform
 * Isomorphic Client-Side Solver, Canonical Snapper & Seed Bundle (`web/shd_solver_portable.js`)
 * Enables 100% offline execution inside the RollupOS Android App Hub (`shd-div2-intel`)
 * while preserving 100% parity with the Desktop Python FastAPI engine.
 */
window.SHD_CARTRIDGE_SEED = {"generated_at": "2026-10-24T11:23:18.925058", "canonical": {"version": "TU22_2026_CANONICAL", "stat_caps": {"CRITICAL_HIT_CHANCE_CAP": 60.0, "BASE_CRIT_HIT_DAMAGE": 25.0, "BASE_HEADSHOT_DAMAGE": 55.0, "SHD_WATCH_BONUSES": {"WEAPON_DAMAGE": 10.0, "CRITICAL_HIT_CHANCE": 10.0, "CRITICAL_HIT_DAMAGE": 20.0, "HEADSHOT_DAMAGE": 20.0, "ARMOR": 10.0, "SKILL_DAMAGE": 10.0, "SKILL_HASTE": 10.0, "SKILL_REPAIR": 10.0, "STATUS_EFFECTS": 10.0}}, "core_attributes": {"WEAPON_DAMAGE": {"category": "RED", "label": "Weapon Damage", "unit": "%", "max_val": 15.0}, "ARMOR": {"category": "BLUE", "label": "Armor", "unit": "", "max_val": 170000}, "SKILL_TIER": {"category": "YELLOW", "label": "Skill Tier", "unit": "", "max_val": 1}}, "minor_attributes": {"CRITICAL_HIT_CHANCE": {"category": "RED", "label": "Critical Hit Chance", "short": "CHC", "unit": "%", "max_val": 6.0}, "CRITICAL_HIT_DAMAGE": {"category": "RED", "label": "Critical Hit Damage", "short": "CHD", "unit": "%", "max_val": 12.0}, "HEADSHOT_DAMAGE": {"category": "RED", "label": "Headshot Damage", "short": "HSD", "unit": "%", "max_val": 10.0}, "WEAPON_HANDLING": {"category": "RED", "label": "Weapon Handling", "short": "WH", "unit": "%", "max_val": 8.0}, "DAMAGE_TO_ARMOR": {"category": "RED", "label": "Damage to Armor", "short": "DTA", "unit": "%", "max_val": 8.0, "named_only": true}, "DTTOOC": {"category": "RED", "label": "DMG to Target Out of Cover", "short": "DTTOOC", "unit": "%", "max_val": 8.0, "named_only": true}, "ARMOR_REGEN": {"category": "BLUE", "label": "Armor Regen", "short": "Regen", "unit": "/s", "max_val": 4925}, "HAZARD_PROTECTION": {"category": "BLUE", "label": "Hazard Protection", "short": "HazPro", "unit": "%", "max_val": 10.0}, "HEALTH": {"category": "BLUE", "label": "Health", "short": "Health", "unit": "", "max_val": 18935}, "EXPLOSIVE_RESISTANCE": {"category": "BLUE", "label": "Explosive Resistance", "short": "ExpRes", "unit": "%", "max_val": 10.0}, "INCOMING_REPAIRS": {"category": "BLUE", "label": "Incoming Repairs", "short": "IncRep", "unit": "%", "max_val": 20.0}, "SKILL_DAMAGE": {"category": "YELLOW", "label": "Skill Damage", "short": "SkDmg", "unit": "%", "max_val": 10.0}, "SKILL_HASTE": {"category": "YELLOW", "label": "Skill Haste", "short": "SkHaste", "unit": "%", "max_val": 12.0}, "SKILL_REPAIR": {"category": "YELLOW", "label": "Repair-Skills", "short": "RepSk", "unit": "%", "max_val": 20.0}, "STATUS_EFFECTS": {"category": "YELLOW", "label": "Status Effects", "short": "Status", "unit": "%", "max_val": 10.0}}, "gear_sets": [{"name": "Striker's Battlegear", "default_core": "WEAPON_DAMAGE", "bonuses": {"2": "+15% Weapon Handling", "3": "+15% Rate of Fire", "4": "Striker's Gamble: Hits grant +0.65% Total Weapon Damage per stack (up to 100 stacks)."}, "chest_talent": "Press the Advantage (Increases max Striker stacks from 100 to 200)", "backpack_talent": "Risk Management (Increases Weapon Damage gained per stack from 0.65% to 0.90%)"}, {"name": "Heartbreaker", "default_core": "ARMOR", "bonuses": {"2": "+15% Assault Rifle DMG & +15% LMG DMG", "3": "+15% Weapon Handling", "4": "Heartstopper: Headshots apply Pulse; hits on Pulsed enemies grant +1% Bonus Armor & +1% Weapon DMG (up to 50 stacks)."}, "chest_talent": "Max BPM (Increases max Heartstopper stacks from 50 to 100)", "backpack_talent": "Cold (Doubles Bonus Armor gained per stack from 1% to 2%)"}, {"name": "Hunter's Fury", "default_core": "WEAPON_DAMAGE", "bonuses": {"2": "+15% Shotgun DMG & +15% SMG DMG", "3": "+20% Armor on Kill & +50% Health on Kill", "4": "Apex Predator: Enemies within 15m take +20% Amplified Weapon Damage; kills disorient nearby enemies and grant +5% DMG for 10s (up to 5x)."}, "chest_talent": "Endless Hunger (Increases Apex Predator buff duration from 10s to 30s)", "backpack_talent": "Overwhelming Force (Increases disorient radius on kill from 5m to 10m)"}, {"name": "Hotshot", "default_core": "WEAPON_DAMAGE", "bonuses": {"2": "+30% Marksman Rifle DMG & +30% Weapon Handling", "3": "+30% Headshot Damage", "4": "Headache: Consecutive MMR headshots grant +20% Bonus Armor, +10% Armor Regen, and auto-refill magazine."}, "chest_talent": "Daring (Doubles Bonus Armor from Headache from 20% to 40%)", "backpack_talent": "Blessed (Allows you to miss a headshot and keep your Headache cycle active)"}, {"name": "Eclipse Protocol", "default_core": "SKILL_TIER", "bonuses": {"2": "+15% Status Effects", "3": "+15% Skill Haste & +30% Hazard Protection", "4": "Indirect Transmission: Status Effects spread to all enemies within 10m on kill and refresh 50% duration."}, "chest_talent": "Proliferation (Increases spread range from 10m to 15m and refresh percentage to 75%)", "backpack_talent": "Symptom Aggravator (Amplifies all damage you deal to status-affected targets by +30%)"}, {"name": "Negotiator's Dilemma", "default_core": "WEAPON_DAMAGE", "bonuses": {"2": "+15% Critical Hit Chance", "3": "+20% Critical Hit Damage", "4": "Hostile Negotiations: Critical hits mark up to 3 enemies; critting one deals 60% CHD to all other marked targets."}, "chest_talent": "Target Rich Environment (Increases marked targets from 3 to 5)", "backpack_talent": "Critical Measures (Increases shared crit damage to marked targets from 60% to 112%)"}, {"name": "Foundry Bulwark", "default_core": "ARMOR", "bonuses": {"2": "+10% Total Armor", "3": "+1% Armor Regen & +50% Shield Health", "4": "Makeshift Repairs: 25% of damage taken by you or your shield is repaired over 15s."}, "chest_talent": "Improved Materials (Increases repair rate from 25% over 15s to 35% over 10s)", "backpack_talent": "Process Refinery (Speeds up Makeshift Repairs from 15s to 10s)"}, {"name": "Future Initiative", "default_core": "SKILL_TIER", "bonuses": {"2": "+15% Repair-Skills", "3": "+30% Skill Duration & +15% Skill Haste", "4": "Ground Control: Increases you and your allies' Total Weapon & Skill Damage by +15% when at full armor; healing an ally heals all allies within 5m for 60%."}, "chest_talent": "Tactical Superiority (Increases Ground Control damage bonus from +15% to +25%)", "backpack_talent": "Advanced Combat Tactics (Increases proximity splash heal from 60% to 120%)"}, {"name": "Umbra Initiative", "default_core": "WEAPON_DAMAGE", "bonuses": {"2": "+15% Critical Hit Chance", "3": "+30% Reload Speed", "4": "From the Shadows / Into the Light: In cover builds stacks for Armor Regen; leaving cover grants +30% RPM and up to +100% Crit Damage."}, "chest_talent": "From the Shadows (Doubles max stacks for Crit Damage up to +100% CHD)", "backpack_talent": "Into the Light (Increases max Armor Regen stacks in cover up to 80%)"}, {"name": "Refactor", "default_core": "SKILL_TIER", "bonuses": {"2": "+15% Skill Haste", "3": "+15% Skill Damage", "4": "Overclocked Feedback: Skill damage repairs your armor and grants overcharge synergy."}, "chest_talent": "Feedback Loop", "backpack_talent": "Harmonic Surge"}], "brand_sets": [{"name": "Česká Výroba s.r.o.", "aliases": ["Ceska", "Ceska Vyroba"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+8% Critical Hit Chance", "2": "+20% Hazard Protection", "3": "+90% Health"}, "stat_inject": {"1": {"CRITICAL_HIT_CHANCE": 8.0}}}, {"name": "Grupo Sombra S.A.", "aliases": ["Grupo", "Grupo Sombra"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+13% Critical Hit Damage", "2": "+20% Explosive Damage", "3": "+15% Headshot Damage"}, "stat_inject": {"1": {"CRITICAL_HIT_DAMAGE": 13.0}}}, {"name": "Fenris Group AB", "aliases": ["Fenris"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+10% Assault Rifle Damage", "2": "+30% Reload Speed", "3": "+50% Stability"}, "stat_inject": {}}, {"name": "Providence Defense", "aliases": ["Providence"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+15% Headshot Damage", "2": "+8% Critical Hit Chance", "3": "+13% Critical Hit Damage"}, "stat_inject": {"1": {"HEADSHOT_DAMAGE": 15.0}, "2": {"CRITICAL_HIT_CHANCE": 8.0}, "3": {"CRITICAL_HIT_DAMAGE": 13.0}}}, {"name": "Walker, Harris & Co.", "aliases": ["Walker Harris", "Walker"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+5% Weapon Damage", "2": "+5% Damage to Armor", "3": "+10% Damage to Health"}, "stat_inject": {"1": {"WEAPON_DAMAGE": 5.0}}}, {"name": "Overlord Armaments", "aliases": ["Overlord"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+10% Rifle Damage", "2": "+30% Accuracy", "3": "+30% Weapon Handling"}, "stat_inject": {}}, {"name": "Petrov Defense Group", "aliases": ["Petrov"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+10% LMG Damage", "2": "+15% Weapon Handling", "3": "+20% Ammo Capacity"}, "stat_inject": {}}, {"name": "Sokolov Concern", "aliases": ["Sokolov"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+10% SMG Damage", "2": "+13% Critical Hit Damage", "3": "+8% Critical Hit Chance"}, "stat_inject": {"2": {"CRITICAL_HIT_DAMAGE": 13.0}, "3": {"CRITICAL_HIT_CHANCE": 8.0}}}, {"name": "Badger Tuff", "aliases": ["Badger"], "default_core": "ARMOR", "bonuses": {"1": "+10% Shotgun Damage", "2": "+5% Total Armor", "3": "+10% Armor on Kill"}, "stat_inject": {}}, {"name": "Belstone Armory", "aliases": ["Belstone"], "default_core": "ARMOR", "bonuses": {"1": "+1% Armor Regen", "2": "+10% Armor on Kill", "3": "+45% Incoming Repairs"}, "stat_inject": {}}, {"name": "Golan Gear Ltd", "aliases": ["Golan"], "default_core": "ARMOR", "bonuses": {"1": "+10% Status Effects", "2": "+1.5% Armor Regen", "3": "+10% Total Armor"}, "stat_inject": {"1": {"STATUS_EFFECTS": 10.0}}}, {"name": "Palisade Steelworks", "aliases": ["Palisade"], "default_core": "ARMOR", "bonuses": {"1": "+10% Armor on Kill", "2": "+60% Health", "3": "+1 Skill Tier"}, "stat_inject": {}}, {"name": "Brazos de Arcabuz", "aliases": ["Brazos"], "default_core": "ARMOR", "bonuses": {"1": "+10% Skill Haste", "2": "+1 Skill Tier", "3": "+50% Magazine Size"}, "stat_inject": {"1": {"SKILL_HASTE": 10.0}, "2": {"SKILL_TIER": 1}}}, {"name": "Uzina Getica", "aliases": ["Uzina"], "default_core": "ARMOR", "bonuses": {"1": "+5% Total Armor", "2": "+10% Armor on Kill", "3": "+30% Hazard Protection"}, "stat_inject": {}}, {"name": "Gila Guard", "aliases": ["Gila"], "default_core": "ARMOR", "bonuses": {"1": "+5% Total Armor", "2": "+60% Health", "3": "+2% Armor Regen"}, "stat_inject": {}}, {"name": "Empress International", "aliases": ["Empress"], "default_core": "SKILL_TIER", "bonuses": {"1": "+10% Skill Health", "2": "+10% Skill Damage", "3": "+10% Skill Efficiency"}, "stat_inject": {"2": {"SKILL_DAMAGE": 10.0}, "3": {"SKILL_DAMAGE": 10.0, "SKILL_HASTE": 10.0}}}, {"name": "Hana-U Corporation", "aliases": ["Hana-U", "Hana U"], "default_core": "SKILL_TIER", "bonuses": {"1": "+10% Skill Haste", "2": "+10% Skill Damage", "3": "+15% Weapon Damage"}, "stat_inject": {"1": {"SKILL_HASTE": 10.0}, "2": {"SKILL_DAMAGE": 10.0}}}, {"name": "Wyvern Wear", "aliases": ["Wyvern"], "default_core": "SKILL_TIER", "bonuses": {"1": "+10% Skill Damage", "2": "+18% Status Effects", "3": "+45% Skill Duration"}, "stat_inject": {"1": {"SKILL_DAMAGE": 10.0}, "2": {"STATUS_EFFECTS": 18.0}}}, {"name": "Electrique", "aliases": ["Electrique"], "default_core": "SKILL_TIER", "bonuses": {"1": "+10% Status Effects", "2": "+20% Shock Resistance", "3": "+10% SMG Damage"}, "stat_inject": {"1": {"STATUS_EFFECTS": 10.0}}}, {"name": "Alps Summit Armament", "aliases": ["Alps", "Alps Summit"], "default_core": "SKILL_TIER", "bonuses": {"1": "+18% Repair-Skills", "2": "+30% Skill Duration", "3": "+30% Skill Haste"}, "stat_inject": {"1": {"SKILL_REPAIR": 18.0}}}, {"name": "Habsburg Guard", "aliases": ["Habsburg"], "default_core": "ARMOR", "bonuses": {"1": "+15% Headshot Damage", "2": "+20% Marksman Rifle Damage", "3": "+20% Status Effects"}, "stat_inject": {"1": {"HEADSHOT_DAMAGE": 15.0}}}, {"name": "Airaldi Holdings", "aliases": ["Airaldi"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+10% Marksman Rifle Damage", "2": "+15% Headshot Damage", "3": "+5% Damage to Armor"}, "stat_inject": {"2": {"HEADSHOT_DAMAGE": 15.0}}}, {"name": "Lengmo", "aliases": ["Lengmo"], "default_core": "ARMOR", "bonuses": {"1": "+20% Explosive Resistance", "2": "+20% Skill Health", "3": "+30% LMG Damage"}, "stat_inject": {}}, {"name": "Douglas & Harding", "aliases": ["Douglas", "D&H"], "default_core": "WEAPON_DAMAGE", "bonuses": {"1": "+20% Pistol Damage", "2": "+20% Stability", "3": "+20% Accuracy"}, "stat_inject": {}}, {"name": "Murakami Industries", "aliases": ["Murakami"], "default_core": "SKILL_TIER", "bonuses": {"1": "+20% Skill Duration", "2": "+35% Repair-Skills", "3": "+10% Skill Damage"}, "stat_inject": {}}, {"name": "Richter & Kaiser GmbH", "aliases": ["R&K", "Richter"], "default_core": "SKILL_TIER", "bonuses": {"1": "+15% Incoming Repairs", "2": "+20% Explosive Resistance", "3": "+23% Repair-Skills"}, "stat_inject": {}}, {"name": "Yaahl Gear", "aliases": ["Yaahl"], "default_core": "ARMOR", "bonuses": {"1": "+10% Hazard Protection", "2": "+5% Weapon Damage", "3": "+40% Pulse Resistance"}, "stat_inject": {"1": {"HAZARD_PROTECTION": 10.0}}}], "exotics": [{"name": "Coyote's Mask", "slot": "MASK", "default_core": "WEAPON_DAMAGE", "fixed_minors": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0}], "talent": "Pack Instincts (0-15m: +25% CHD | 15-25m: +10% CHC & +10% CHD | 25m+: +25% CHC)"}, {"name": "NinjaBike Messenger Backpack", "aliases": ["Ninjabike Backpack", "Ninjabike"], "slot": "BACKPACK", "default_core": "TRIPLE_CORE", "fixed_minors": [], "talent": "Resourceful (Slots in with any equipped Gear Set or Brand Set item to unlock +1 tier of set bonuses)", "is_ninjabike_wildcard": true}, {"name": "Memento", "slot": "BACKPACK", "default_core": "TRIPLE_CORE", "fixed_minors": [], "talent": "Kill Confirmed (Kills drop trophies granting +30% Weapon Damage, +3% Armor Regen, and +30% Skill Efficiency at max stacks)"}, {"name": "Catharsis", "slot": "MASK", "default_core": "ARMOR", "fixed_minors": [{"stat": "ARMOR_REGEN", "value": 4925}, {"stat": "INCOMING_REPAIRS", "value": 20.0}], "talent": "Vicious Cycle (Taking damage builds stacks up to +30% Weapon Damage; at max stacks purges status effects and drops a healing cloud)"}, {"name": "Vile", "slot": "MASK", "default_core": "SKILL_TIER", "fixed_minors": [{"stat": "STATUS_EFFECTS", "value": 10.0}, {"stat": "HAZARD_PROTECTION", "value": 10.0}], "talent": "Toxic Delivery (Status effects also apply a damage-over-time debuff scaling with Concussion Grenade & Status Effect damage)"}, {"name": "Waveform", "slot": "HOLSTER", "default_core": "SKILL_TIER", "fixed_minors": [{"stat": "SKILL_DAMAGE", "value": 10.0}, {"stat": "SKILL_HASTE", "value": 12.0}], "talent": "Alternating Current (Cycles up to +30% Skill Damage back and forth between your two skills)"}, {"name": "BTSU Datagloves", "aliases": ["BTSU Gloves"], "slot": "GLOVES", "default_core": "SKILL_TIER", "fixed_minors": [{"stat": "SKILL_HASTE", "value": 12.0}, {"stat": "SKILL_REPAIR", "value": 20.0}], "talent": "Transference Overclock (Detonating a Hive refreshes all allies' skill cooldowns and grants Overcharge for 15s)"}], "named_items": [{"name": "Fox's Prayer", "brand": "Overlord Armaments", "slot": "KNEEPADS", "special_type": "FIXED_MINOR", "fixed_minor": {"stat": "DTTOOC", "value": 8.0}}, {"name": "Contractor's Gloves", "brand": "Petrov Defense Group", "slot": "GLOVES", "special_type": "FIXED_MINOR", "fixed_minor": {"stat": "DAMAGE_TO_ARMOR", "value": 8.0}}, {"name": "Picaro's Holster", "brand": "Brazos de Arcabuz", "slot": "HOLSTER", "special_type": "FIXED_MINOR", "fixed_minor": {"stat": "WEAPON_DAMAGE", "value": 10.0}}, {"name": "Chainkiller", "brand": "Walker, Harris & Co.", "slot": "CHEST", "special_type": "PERFECT_TALENT", "talent": "Perfect Headhunter"}, {"name": "The Gift", "brand": "Providence Defense", "slot": "BACKPACK", "special_type": "PERFECT_TALENT", "talent": "Perfect Vigilance"}, {"name": "The Sacrifice", "brand": "Providence Defense", "slot": "CHEST", "special_type": "PERFECT_TALENT", "talent": "Perfect Glass Cannon"}, {"name": "Closer", "brand": "Uzina Getica", "slot": "CHEST", "special_type": "PERFECT_TALENT", "talent": "Perfect Spotter"}, {"name": "Hunter-Killer", "brand": "Golan Gear Ltd", "slot": "CHEST", "special_type": "PERFECT_TALENT", "talent": "Perfect Intimidate"}, {"name": "Lavoisier", "brand": "Electrique", "slot": "BACKPACK", "special_type": "PERFECT_TALENT", "talent": "Perfect Galvanize"}, {"name": "Zero F's", "brand": "Badger Tuff", "slot": "CHEST", "special_type": "PERFECT_TALENT", "talent": "Perfectly Unbreakable"}, {"name": "Backbone", "brand": "Lengmo", "slot": "BACKPACK", "special_type": "PERFECT_TALENT", "talent": "Perfect Unstoppable Force"}, {"name": "Turmoil", "brand": "Česká Výroba s.r.o.", "slot": "KNEEPADS", "special_type": "PERFECT_TALENT", "talent": "Turmoil (50% Shared Damage Split)"}, {"name": "Henri", "brand": "Electrique", "slot": "CHEST", "special_type": "PERFECT_TALENT", "talent": "Perfect Companion"}, {"name": "Matador", "brand": "Walker, Harris & Co.", "slot": "BACKPACK", "special_type": "PERFECT_TALENT", "talent": "Perfect Adrenaline Rush"}, {"name": "Liquid Engineer", "brand": "Belstone Armory", "slot": "BACKPACK", "special_type": "PERFECT_TALENT", "talent": "Perfect Bloodsucker"}, {"name": "punch drunk", "brand": "Douglas & Harding", "slot": "MASK", "special_type": "FIXED_MINOR", "fixed_minor": {"stat": "HEADSHOT_DAMAGE", "value": 20.0}}], "talents": {"CHEST": ["Obliterate", "Glass Cannon", "Perfect Glass Cannon", "Spotter", "Perfect Spotter", "Unbreakable", "Perfectly Unbreakable", "Headhunter", "Perfect Headhunter", "Intimidate", "Perfect Intimidate", "Vanguard", "Pointman", "Kinetic Momentum", "Empathic Resolve", "Trauma", "Press the Advantage", "Max BPM", "Endless Hunger", "Daring", "Proliferation", "Target Rich Environment", "Improved Materials", "Tactical Superiority"], "BACKPACK": ["Vigilance", "Perfect Vigilance", "Composure", "Companion", "Adrenaline Rush", "Bloodsucker", "Wicked", "Creeping Death", "Tech Support", "Combined Arms", "Perfect Combined Arms", "Safeguard", "Opportunistic", "Galvanize", "Perfect Galvanize", "Unstoppable Force", "Perfect Unstoppable Force", "Risk Management", "Cold", "Overwhelming Force", "Blessed", "Symptom Aggravator", "Critical Measures", "Process Refinery", "Advanced Combat Tactics"]}, "prototype_augments": ["Paradox", "Catalyst", "Momentum", "Overdrive", "Synergy", "Vanguard", "Resonance"]}, "meta_builds": [{"build_id": "lengmo_pesti_turmoil", "name": "Lengmo Pestilence Turmoil LMG", "role": "RED_DPS", "tier_badge": "S+ TIER LMG META", "summary": "3pc Lengmo (+30% LMG DMG & Named Backbone Perfect Unstoppable Force) + Turmoil Named Česká Kneepads + Contractor's Gloves + The Sacrifice (Perfect Glass Cannon). Massive Pestilence plague ticks & shared room-wide damage.", "primary_weapons": ["Pestilence (Exotic LMG)", "Lexington (Named AR)", "Gear Shift / St. Elmo's Engine"], "specialization": "Gunner (10% Armor on Kill + LMG Banchee/Reload)", "target_cores": {"RED": 6, "BLUE": 0, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Lengmo", "Coyote's Mask"], "alt_brands": ["Grupo Sombra S.A.", "Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["The Sacrifice", "Providence Defense"], "alt_brands": ["Lengmo", "Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Perfect Glass Cannon"}, "BACKPACK": {"preferred": ["Backbone", "Lengmo"], "alt_brands": ["The Gift"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Perfect Unstoppable Force"}, "GLOVES": {"preferred": ["Contractor's Gloves", "Petrov Defense Group"], "alt_brands": ["Lengmo"], "core": "WEAPON_DAMAGE", "minors": ["DAMAGE_TO_ARMOR", "CRITICAL_HIT_DAMAGE"]}, "HOLSTER": {"preferred": ["Lengmo"], "alt_brands": ["Grupo Sombra S.A.", "Picaro's Holster"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "KNEEPADS": {"preferred": ["Turmoil", "Česká Výroba s.r.o."], "alt_brands": ["Fox's Prayer"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}}}, {"build_id": "striker_obliterate_meta", "name": "Striker Obliterate Meta DPS", "role": "RED_DPS", "tier_badge": "S-TIER META", "summary": "4pc Striker's Battlegear + Coyote's Exotic Mask + Česká Obliterate Chest. The #1 sustained & burst AR/SMG DPS setup for Heroic, Countdown, and Incursions.", "primary_weapons": ["St. Elmo's Engine (Exotic AR)", "FAMAS 2010 / Lexington", "ACS-12 / Rock n' Roll (Stack Builder)"], "specialization": "Gunner (10% Armor on Kill + Rate of Fire)", "target_cores": {"RED": 5, "BLUE": 1, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Coyote's Mask"], "alt_brands": ["Striker's Battlegear", "Grupo Sombra S.A."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["Česká Výroba s.r.o.", "Grupo Sombra S.A."], "alt_brands": ["Fenris Group AB"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Obliterate"}, "BACKPACK": {"preferred": ["Striker's Battlegear"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"], "talent": "Risk Management"}, "GLOVES": {"preferred": ["Striker's Battlegear"], "alt_brands": ["Contractor's Gloves"], "core": "ARMOR", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "HOLSTER": {"preferred": ["Striker's Battlegear"], "alt_brands": ["Picaro's Holster"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "KNEEPADS": {"preferred": ["Striker's Battlegear"], "alt_brands": ["Fox's Prayer"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}}}, {"build_id": "striker_ninjabike_hybrid", "name": "Striker NinjaBike Picaro's Hybrid", "role": "HYBRID_BRUISER", "tier_badge": "S-TIER SOLO", "summary": "3pc Striker + NinjaBike Messenger Backpack + Picaro's Holster + Česká Obliterate Chest. Unlocks 4pc Striker + 2pc Brazos (+1 Skill Tier) + 3 Skill Tiers on Shield.", "primary_weapons": ["St. Elmo's Engine", "Dark Winter SMG", "Capacitor"], "specialization": "Technician (+1 Skill Tier + Artificer Hive)", "target_cores": {"RED": 4, "BLUE": 2, "YELLOW": 1}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Striker's Battlegear"], "alt_brands": ["Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["Česká Výroba s.r.o."], "alt_brands": ["Grupo Sombra S.A.", "Belstone Armory"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Obliterate"}, "BACKPACK": {"preferred": ["NinjaBike Messenger Backpack"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Resourceful"}, "GLOVES": {"preferred": ["Striker's Battlegear"], "alt_brands": [], "core": "ARMOR", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "HOLSTER": {"preferred": ["Picaro's Holster", "Brazos de Arcabuz"], "alt_brands": [], "core": "ARMOR", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "KNEEPADS": {"preferred": ["Striker's Battlegear"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}}}, {"build_id": "heartbreaker_techtank", "name": "Heartbreaker Spotter Tech-Tank", "role": "TECH_TANK", "tier_badge": "S-TIER TANK/DPS", "summary": "4pc Heartbreaker + Closer Named Chest (Perfect Spotter) + Coyote's or Memento. Laser-pointer pulses every target on aim for massive Bonus Armor + Amplified DMG.", "primary_weapons": ["Kingbreaker (Perfect Flatline)", "ACS-12 / Rock n' Roll", "Police M4 w/ Flatline"], "specialization": "Technician (Linked Laser Pointer Underbarrel)", "target_cores": {"RED": 3, "BLUE": 3, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Heartbreaker", "Coyote's Mask"], "alt_brands": ["Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["Closer", "Uzina Getica"], "alt_brands": ["Heartbreaker", "Česká Výroba s.r.o."], "core": "ARMOR", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Perfect Spotter"}, "BACKPACK": {"preferred": ["Memento", "Heartbreaker"], "alt_brands": ["Česká Výroba s.r.o."], "core": "ARMOR", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Kill Confirmed"}, "GLOVES": {"preferred": ["Heartbreaker"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "HOLSTER": {"preferred": ["Heartbreaker", "Picaro's Holster"], "alt_brands": [], "core": "ARMOR", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "KNEEPADS": {"preferred": ["Heartbreaker"], "alt_brands": ["Fox's Prayer"], "core": "ARMOR", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}}}, {"build_id": "hotshot_determined_sniper", "name": "Hotshot Chainkiller 1-Shot Sniper", "role": "ONE_SHOT_MMR", "tier_badge": "S-TIER FARMING", "summary": "4pc Hotshot + Chainkiller Named Chest (Perfect Headhunter) + Airaldi/Habsburg Vigilance Backpack. After 1 red-bar headshot kill, every body shot is a guaranteed 22M+ one-shot kill.", "primary_weapons": ["SR-1 / Model 700 / White Death w/ Determined", "Nemesis"], "specialization": "Sharpshooter", "target_cores": {"RED": 6, "BLUE": 0, "YELLOW": 0}, "ideal_minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"], "slots": {"MASK": {"preferred": ["Hotshot"], "alt_brands": ["Airaldi Holdings", "Habsburg Guard"], "core": "WEAPON_DAMAGE", "minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"]}, "CHEST": {"preferred": ["Chainkiller", "Walker, Harris & Co."], "alt_brands": ["Providence Defense", "Habsburg Guard"], "core": "WEAPON_DAMAGE", "minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"], "talent": "Perfect Headhunter"}, "BACKPACK": {"preferred": ["Airaldi Holdings", "Habsburg Guard", "The Gift"], "alt_brands": ["Providence Defense", "Hotshot"], "core": "WEAPON_DAMAGE", "minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"], "talent": "Vigilance"}, "GLOVES": {"preferred": ["Hotshot"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"]}, "HOLSTER": {"preferred": ["Hotshot"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"]}, "KNEEPADS": {"preferred": ["Hotshot"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["HEADSHOT_DAMAGE", "WEAPON_HANDLING"]}}}, {"build_id": "hunters_fury_memento", "name": "Hunter's Fury Memento Run & Gun", "role": "CLOSE_QUARTERS", "tier_badge": "A+ TIER SOLO", "summary": "4pc Hunter's Fury + Memento Exotic Backpack + Sokolov/Badger Intimidate or Obliterate Chest. Chain-disorients spawn doors and grants 30% Armor on Kill.", "primary_weapons": ["Scorpio (Exotic Shotgun)", "Dark Winter / Ouroboros SMG"], "specialization": "Gunner or Firewall (Striker Shield)", "target_cores": {"RED": 3, "BLUE": 3, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Hunter's Fury"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["Sokolov Concern", "Hunter-Killer", "Golan Gear Ltd"], "alt_brands": ["Česká Výroba s.r.o.", "Badger Tuff"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Obliterate"}, "BACKPACK": {"preferred": ["Memento"], "alt_brands": ["Hunter's Fury"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Kill Confirmed"}, "GLOVES": {"preferred": ["Hunter's Fury"], "alt_brands": [], "core": "ARMOR", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "HOLSTER": {"preferred": ["Hunter's Fury"], "alt_brands": [], "core": "ARMOR", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "KNEEPADS": {"preferred": ["Hunter's Fury"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}}}, {"build_id": "eclipse_vile_status", "name": "Eclipse Protocol Vile Fire/Foam Controller", "role": "CROWD_CONTROL", "tier_badge": "S-TIER CC", "summary": "4pc Eclipse Protocol (with Chest & Backpack) + Vile Exotic Mask + 1pc Golan/Electrique. A single Firestarter Chem or Riot Foam locks down and melts an entire room on kill.", "primary_weapons": ["Scorpio", "Capacitor", "Everlasting Gaze (Perfect Perpetuation)"], "specialization": "Firewall or Survivalist (+10% Team DMG to Status Targets)", "target_cores": {"RED": 0, "BLUE": 0, "YELLOW": 6}, "ideal_minors": ["STATUS_EFFECTS", "SKILL_HASTE"], "slots": {"MASK": {"preferred": ["Vile"], "alt_brands": ["Eclipse Protocol"], "core": "SKILL_TIER", "minors": ["STATUS_EFFECTS", "SKILL_HASTE"]}, "CHEST": {"preferred": ["Eclipse Protocol"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["STATUS_EFFECTS", "SKILL_HASTE"], "talent": "Proliferation"}, "BACKPACK": {"preferred": ["Eclipse Protocol"], "alt_brands": ["Electrique"], "core": "SKILL_TIER", "minors": ["STATUS_EFFECTS", "SKILL_HASTE"], "talent": "Symptom Aggravator"}, "GLOVES": {"preferred": ["Eclipse Protocol", "Golan Gear Ltd", "Electrique"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["STATUS_EFFECTS", "SKILL_HASTE"]}, "HOLSTER": {"preferred": ["Eclipse Protocol", "Electrique"], "alt_brands": ["Golan Gear Ltd"], "core": "SKILL_TIER", "minors": ["STATUS_EFFECTS", "SKILL_HASTE"]}, "KNEEPADS": {"preferred": ["Eclipse Protocol"], "alt_brands": ["Golan Gear Ltd"], "core": "SKILL_TIER", "minors": ["STATUS_EFFECTS", "SKILL_HASTE"]}}}, {"build_id": "empress_turret_drone_skill", "name": "Empress Waveform AFK Turret/Drone Skill", "role": "SKILL_DPS", "tier_badge": "S-TIER LEGENDARY", "summary": "3pc Empress International + Waveform Exotic Holster + 2pc Hana-U (or 1pc Wyvern). Effortlessly clears Legendary strongholds while you stay safely in cover.", "primary_weapons": ["Capacitor (Exotic AR - +60% Skill DMG)", "Harmony (Perfectly In Sync)"], "specialization": "Technician (+1 Skill Tier + +10% Skill Damage)", "target_cores": {"RED": 0, "BLUE": 1, "YELLOW": 5}, "ideal_minors": ["SKILL_DAMAGE", "SKILL_HASTE"], "slots": {"MASK": {"preferred": ["Empress International"], "alt_brands": ["Wyvern Wear", "Hana-U Corporation"], "core": "SKILL_TIER", "minors": ["SKILL_DAMAGE", "SKILL_HASTE"]}, "CHEST": {"preferred": ["Empress International"], "alt_brands": ["Wyvern Wear"], "core": "SKILL_TIER", "minors": ["SKILL_DAMAGE", "SKILL_HASTE"], "talent": "Kinetic Momentum"}, "BACKPACK": {"preferred": ["Hana-U Corporation", "Empress International"], "alt_brands": ["Wyvern Wear"], "core": "SKILL_TIER", "minors": ["SKILL_DAMAGE", "SKILL_HASTE"], "talent": "Combined Arms"}, "GLOVES": {"preferred": ["Empress International", "Hana-U Corporation"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["SKILL_DAMAGE", "SKILL_HASTE"]}, "HOLSTER": {"preferred": ["Waveform"], "alt_brands": ["Wyvern Wear"], "core": "SKILL_TIER", "minors": ["SKILL_DAMAGE", "SKILL_HASTE"]}, "KNEEPADS": {"preferred": ["Hana-U Corporation", "Wyvern Wear"], "alt_brands": ["Belstone Armory"], "core": "SKILL_TIER", "minors": ["SKILL_DAMAGE", "SKILL_HASTE"]}}}, {"build_id": "high_end_providence_crit", "name": "Classic High-End Providence / Fox's / Contractor's", "role": "RED_DPS", "tier_badge": "A-TIER ZERO STACKS", "summary": "3pc Providence Defense (The Gift + The Sacrifice) + Fox's Prayer + Contractor's Gloves + Grupo/Coyote's. Instant 100% burst damage on the very first bullet with zero stack ramp-up.", "primary_weapons": ["Classic M1A / Baker's Dozen", "Police M4 / Carbine 7", "Pestilence LMG"], "specialization": "Gunner", "target_cores": {"RED": 6, "BLUE": 0, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Coyote's Mask", "Providence Defense"], "alt_brands": ["Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["The Sacrifice", "Providence Defense"], "alt_brands": ["Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Perfect Glass Cannon"}, "BACKPACK": {"preferred": ["The Gift", "Providence Defense"], "alt_brands": ["Grupo Sombra S.A."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Perfect Vigilance"}, "GLOVES": {"preferred": ["Contractor's Gloves"], "alt_brands": ["Grupo Sombra S.A."], "core": "WEAPON_DAMAGE", "minors": ["DAMAGE_TO_ARMOR", "CRITICAL_HIT_DAMAGE"]}, "HOLSTER": {"preferred": ["Grupo Sombra S.A.", "Providence Defense"], "alt_brands": ["Česká Výroba s.r.o."], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "KNEEPADS": {"preferred": ["Fox's Prayer"], "alt_brands": ["Overlord Armaments"], "core": "WEAPON_DAMAGE", "minors": ["DTTOOC", "CRITICAL_HIT_DAMAGE"]}}}, {"build_id": "negotiators_dilemma_crowd_dps", "name": "Negotiator's Dilemma Multi-Target Crit", "role": "RED_DPS", "tier_badge": "A+ TIER HEROIC", "summary": "4pc Negotiator's Dilemma (with Backpack) + Coyote's Mask + Česká Obliterate Chest. Tag 3 elites and shoot the tankiest boss to melt the entire room simultaneously.", "primary_weapons": ["Bullet King / Pestilence LMG", "St. Elmo's Engine"], "specialization": "Gunner", "target_cores": {"RED": 6, "BLUE": 0, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Coyote's Mask", "Negotiator's Dilemma"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["Česká Výroba s.r.o.", "Grupo Sombra S.A."], "alt_brands": ["Fenris Group AB"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Obliterate"}, "BACKPACK": {"preferred": ["Negotiator's Dilemma"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"], "talent": "Critical Measures"}, "GLOVES": {"preferred": ["Negotiator's Dilemma"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "HOLSTER": {"preferred": ["Negotiator's Dilemma"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "KNEEPADS": {"preferred": ["Negotiator's Dilemma", "Fox's Prayer"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}}}, {"build_id": "foundry_catharsis_tank", "name": "Foundry Bulwark Catharsis Immortal Tank", "role": "ARMOR_TANK", "tier_badge": "S-TIER TANK", "summary": "4pc Foundry Bulwark + Catharsis Exotic Mask + Belstone/Gila Pointman (Vanguard) or Adrenaline Rush. Practically unkillable under heavy fire while giving the team 50% Bonus Armor.", "primary_weapons": ["Liberty (Exotic Pistol)", "Scorpio"], "specialization": "Technician (Artificer Hive heals Bulwark Shield every 10s)", "target_cores": {"RED": 0, "BLUE": 6, "YELLOW": 0}, "ideal_minors": ["ARMOR_REGEN", "HAZARD_PROTECTION"], "slots": {"MASK": {"preferred": ["Catharsis"], "alt_brands": ["Foundry Bulwark"], "core": "ARMOR", "minors": ["ARMOR_REGEN", "INCOMING_REPAIRS"]}, "CHEST": {"preferred": ["Gila Guard", "Belstone Armory"], "alt_brands": ["Foundry Bulwark"], "core": "ARMOR", "minors": ["ARMOR_REGEN", "HAZARD_PROTECTION"], "talent": "Vanguard"}, "BACKPACK": {"preferred": ["Belstone Armory", "Uzina Getica"], "alt_brands": ["Foundry Bulwark"], "core": "ARMOR", "minors": ["ARMOR_REGEN", "HAZARD_PROTECTION"], "talent": "Adrenaline Rush"}, "GLOVES": {"preferred": ["Foundry Bulwark"], "alt_brands": [], "core": "ARMOR", "minors": ["ARMOR_REGEN", "HAZARD_PROTECTION"]}, "HOLSTER": {"preferred": ["Foundry Bulwark"], "alt_brands": [], "core": "ARMOR", "minors": ["ARMOR_REGEN", "HAZARD_PROTECTION"]}, "KNEEPADS": {"preferred": ["Foundry Bulwark"], "alt_brands": [], "core": "ARMOR", "minors": ["ARMOR_REGEN", "HAZARD_PROTECTION"]}}}, {"build_id": "future_initiative_raid_healer", "name": "Future Initiative BTSU Raid/Incursion Healer", "role": "SUPPORT_HEALER", "tier_badge": "S-TIER INCURSION", "summary": "4pc Future Initiative (with Chest) + BTSU Datagloves + Alps Summit Opportunistic Backpack. Gives the entire raid/incursion squad +25% Total DMG, +10% Opportunistic amp, and team Overcharge.", "primary_weapons": ["Scorpio (+20% Team Amp at 7 shots)", "Lefty (Perfect Sledgehammer)"], "specialization": "Survivalist (+15% Outgoing Healing + Crossbow for Armor Plates)", "target_cores": {"RED": 0, "BLUE": 0, "YELLOW": 6}, "ideal_minors": ["SKILL_REPAIR", "SKILL_HASTE"], "slots": {"MASK": {"preferred": ["Future Initiative"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["SKILL_REPAIR", "SKILL_HASTE"]}, "CHEST": {"preferred": ["Future Initiative"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["SKILL_REPAIR", "SKILL_HASTE"], "talent": "Tactical Superiority"}, "BACKPACK": {"preferred": ["Alps Summit Armament"], "alt_brands": ["Hana-U Corporation"], "core": "SKILL_TIER", "minors": ["SKILL_REPAIR", "SKILL_HASTE"], "talent": "Opportunistic"}, "GLOVES": {"preferred": ["BTSU Datagloves"], "alt_brands": ["Future Initiative"], "core": "SKILL_TIER", "minors": ["SKILL_REPAIR", "SKILL_HASTE"]}, "HOLSTER": {"preferred": ["Future Initiative"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["SKILL_REPAIR", "SKILL_HASTE"]}, "KNEEPADS": {"preferred": ["Future Initiative"], "alt_brands": [], "core": "SKILL_TIER", "minors": ["SKILL_REPAIR", "SKILL_HASTE"]}}}, {"build_id": "umbra_capacitor_hybrid", "name": "Umbra Initiative Burst Crit RPM", "role": "RED_DPS", "tier_badge": "A-TIER BURST", "summary": "4pc Umbra Initiative (with Chest) + Coyote's Mask + Grupo/Česká Vigilance Backpack. Duck into cover for 4s to heal, pop out with +30% RPM and +100% Crit Hit Damage.", "primary_weapons": ["Chameleon", "St. Elmo's Engine", "Ouroboros"], "specialization": "Gunner", "target_cores": {"RED": 5, "BLUE": 1, "YELLOW": 0}, "ideal_minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "slots": {"MASK": {"preferred": ["Coyote's Mask", "Umbra Initiative"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"]}, "CHEST": {"preferred": ["Umbra Initiative"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"], "talent": "From the Shadows"}, "BACKPACK": {"preferred": ["Grupo Sombra S.A.", "Česká Výroba s.r.o."], "alt_brands": ["Memento"], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_CHANCE", "CRITICAL_HIT_DAMAGE"], "talent": "Vigilance"}, "GLOVES": {"preferred": ["Umbra Initiative"], "alt_brands": [], "core": "ARMOR", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "HOLSTER": {"preferred": ["Umbra Initiative"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}, "KNEEPADS": {"preferred": ["Umbra Initiative", "Fox's Prayer"], "alt_brands": [], "core": "WEAPON_DAMAGE", "minors": ["CRITICAL_HIT_DAMAGE", "CRITICAL_HIT_CHANCE"]}}}], "golden_demo_items": [{"location": "BACKPACK", "slot": "HOLSTER", "rarity": "HIGH_END", "item_name": "Lengmo Holster (Prototype)", "brand_or_set": "Lengmo", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 9.0, "max_possible": 9.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Augment: Paradox (1.5% Mag Refill)", "is_perfect_locked": false}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_f4301b13f6e8", "crop_image_path": "data/crops/shd_f4301b13f6e8.webp"}, {"location": "BACKPACK", "slot": "KNEEPADS", "rarity": "NAMED_HIGH_END", "item_name": "Turmoil", "brand_or_set": "Česká Výroba s.r.o.", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 22.5, "max_possible": 22.5, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 9.0, "max_possible": 9.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Turmoil (50% Shared Damage Split)", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_55a79467543d", "crop_image_path": "data/crops/shd_55a79467543d.webp"}, {"location": "BACKPACK", "slot": "MASK", "rarity": "HIGH_END", "item_name": "Lengmo Mask", "brand_or_set": "Lengmo", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": true}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_99ad8e67706a", "crop_image_path": "data/crops/shd_99ad8e67706a.webp"}, {"location": "BACKPACK", "slot": "BACKPACK", "rarity": "NAMED_HIGH_END", "item_name": "Backbone", "brand_or_set": "Lengmo", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 22.5, "max_possible": 22.5, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 9.0, "max_possible": 9.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Perfect Unstoppable Force", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_edd48768bd74", "crop_image_path": "data/crops/shd_edd48768bd74.webp"}, {"location": "BACKPACK", "slot": "MASK", "rarity": "EXOTIC", "item_name": "Coyote's Mask", "brand_or_set": "Coyote's Mask", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Pack Instincts", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_e62e75c4d160", "crop_image_path": "data/crops/shd_e62e75c4d160.webp"}, {"location": "STASH", "slot": "CHEST", "rarity": "HIGH_END", "item_name": "Vyroba Vest", "brand_or_set": "Česká Výroba s.r.o.", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.4, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "ARMOR_REGEN", "value": 4210, "max_possible": 4925, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 11.8, "max_possible": 12.0, "recal": false}], "talent": {"name": "Obliterate", "is_perfect_locked": false}, "ocr_confidence": 0.97, "notes": "Hidden God-Roll! Swap Armor Regen -> +6.0% CHC at Tinkering Bench.", "provenance_tier": "TIER_1_OWNED", "item_id": "shd_a791b92325d6", "crop_image_path": "data/crops/shd_a791b92325d6.webp"}, {"location": "STASH", "slot": "BACKPACK", "rarity": "GEAR_SET", "item_name": "Striker's Pack", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "WEAPON_HANDLING", "value": 6.5, "max_possible": 8.0, "recal": false}], "talent": {"name": "Risk Management", "is_perfect_locked": true}, "ocr_confidence": 0.98, "notes": "1-Tinker Away: Roll Weapon Handling -> +12.0% CHD.", "provenance_tier": "TIER_1_OWNED", "item_id": "shd_63a111eb04c1", "crop_image_path": "data/crops/shd_63a111eb04c1.webp"}, {"location": "BACKPACK", "slot": "GLOVES", "rarity": "GEAR_SET", "item_name": "Striker's Gloves", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 170000, "max_possible": 170000, "is_recalibrated": true}, "minor_attributes": [{"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_bf104f7e34a9", "crop_image_path": "data/crops/shd_bf104f7e34a9.webp"}, {"location": "BACKPACK", "slot": "HOLSTER", "rarity": "GEAR_SET", "item_name": "Striker's Holster", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": true}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_f79010f9a964", "crop_image_path": "data/crops/shd_f79010f9a964.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "GEAR_SET", "item_name": "Striker's Kneepads", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.8, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_DAMAGE", "value": 11.6, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_d27492d79ee8", "crop_image_path": "data/crops/shd_d27492d79ee8.webp"}, {"location": "STASH", "slot": "MASK", "rarity": "GEAR_SET", "item_name": "Striker's Mask", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.6, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 5.8, "max_possible": 6.0, "recal": false}], "talent": null, "ocr_confidence": 0.96, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_4e49272e3e8e", "crop_image_path": "data/crops/shd_4e49272e3e8e.webp"}, {"location": "BACKPACK", "slot": "BACKPACK", "rarity": "EXOTIC", "item_name": "NinjaBike Messenger Backpack", "brand_or_set": "NinjaBike Messenger Backpack", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Resourceful", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_774a01d4363a", "crop_image_path": "data/crops/shd_774a01d4363a.webp"}, {"location": "BACKPACK", "slot": "HOLSTER", "rarity": "NAMED_HIGH_END", "item_name": "Picaro's Holster", "brand_or_set": "Brazos de Arcabuz", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 170000, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": true}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Perfect Attribute (+10% Weapon Damage)", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_08db2b168c9f", "crop_image_path": "data/crops/shd_08db2b168c9f.webp"}, {"location": "STASH", "slot": "CHEST", "rarity": "NAMED_HIGH_END", "item_name": "Closer", "brand_or_set": "Uzina Getica", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 168500, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 5.9, "max_possible": 6.0, "recal": false}, {"stat": "HEALTH", "value": 14200, "max_possible": 18935, "recal": false}], "talent": {"name": "Perfect Spotter", "is_perfect_locked": true}, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_08385d3b507b", "crop_image_path": "data/crops/shd_08385d3b507b.webp"}, {"location": "BACKPACK", "slot": "BACKPACK", "rarity": "EXOTIC", "item_name": "Memento", "brand_or_set": "Memento", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Kill Confirmed", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_5f9ce13b3d1a", "crop_image_path": "data/crops/shd_5f9ce13b3d1a.webp"}, {"location": "STASH", "slot": "MASK", "rarity": "GEAR_SET", "item_name": "Heartbreaker Mask", "brand_or_set": "Heartbreaker", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 165000, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}], "talent": null, "ocr_confidence": 0.97, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_e209affe82d3", "crop_image_path": "data/crops/shd_e209affe82d3.webp"}, {"location": "STASH", "slot": "GLOVES", "rarity": "GEAR_SET", "item_name": "Heartbreaker Gloves", "brand_or_set": "Heartbreaker", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": true}, "minor_attributes": [{"stat": "CRITICAL_HIT_DAMAGE", "value": 11.5, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_2993046d60ab", "crop_image_path": "data/crops/shd_2993046d60ab.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "GEAR_SET", "item_name": "Heartbreaker Holster", "brand_or_set": "Heartbreaker", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 170000, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "HAZARD_PROTECTION", "value": 8.2, "max_possible": 10.0, "recal": false}], "talent": null, "ocr_confidence": 0.95, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_a4c8d264acdd", "crop_image_path": "data/crops/shd_a4c8d264acdd.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "GEAR_SET", "item_name": "Heartbreaker Kneepads", "brand_or_set": "Heartbreaker", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 169000, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 5.8, "max_possible": 6.0, "recal": false}], "talent": null, "ocr_confidence": 0.97, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_16e3cd17303c", "crop_image_path": "data/crops/shd_16e3cd17303c.webp"}, {"location": "STASH", "slot": "MASK", "rarity": "GEAR_SET", "item_name": "Hotshot Mask", "brand_or_set": "Hotshot", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "HEADSHOT_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": true}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_d0ea8fa265fa", "crop_image_path": "data/crops/shd_d0ea8fa265fa.webp"}, {"location": "STASH", "slot": "BACKPACK", "rarity": "NAMED_HIGH_END", "item_name": "The Gift", "brand_or_set": "Providence Defense", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "HEADSHOT_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": true}, {"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}], "talent": {"name": "Perfect Vigilance", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_c216de1551d4", "crop_image_path": "data/crops/shd_c216de1551d4.webp"}, {"location": "STASH", "slot": "GLOVES", "rarity": "GEAR_SET", "item_name": "Hotshot Gloves", "brand_or_set": "Hotshot", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.5, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "HEADSHOT_DAMAGE", "value": 9.8, "max_possible": 10.0, "recal": false}], "talent": null, "ocr_confidence": 0.97, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_c399160d52e6", "crop_image_path": "data/crops/shd_c399160d52e6.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "GEAR_SET", "item_name": "Hotshot Holster", "brand_or_set": "Hotshot", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "WEAPON_HANDLING", "value": 7.5, "max_possible": 8.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_c83e5add7867", "crop_image_path": "data/crops/shd_c83e5add7867.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "GEAR_SET", "item_name": "Hotshot Kneepads", "brand_or_set": "Hotshot", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.9, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "HEADSHOT_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_2d4771245400", "crop_image_path": "data/crops/shd_2d4771245400.webp"}, {"location": "STASH", "slot": "MASK", "rarity": "HIGH_END", "item_name": "Empress Mask", "brand_or_set": "Empress International", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": true}, {"stat": "SKILL_HASTE", "value": 11.4, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_8ba5705e812b", "crop_image_path": "data/crops/shd_8ba5705e812b.webp"}, {"location": "STASH", "slot": "CHEST", "rarity": "HIGH_END", "item_name": "Empress Chest", "brand_or_set": "Empress International", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 9.8, "max_possible": 10.0, "recal": false}, {"stat": "SKILL_HASTE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Kinetic Momentum", "is_perfect_locked": false}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_ec4a82aedba5", "crop_image_path": "data/crops/shd_ec4a82aedba5.webp"}, {"location": "STASH", "slot": "BACKPACK", "rarity": "HIGH_END", "item_name": "Hana-U Force Multiplier", "brand_or_set": "Hana-U Corporation", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": false}, {"stat": "SKILL_HASTE", "value": 11.8, "max_possible": 12.0, "recal": false}], "talent": {"name": "Combined Arms", "is_perfect_locked": true}, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_9b6ec6155077", "crop_image_path": "data/crops/shd_9b6ec6155077.webp"}, {"location": "STASH", "slot": "GLOVES", "rarity": "HIGH_END", "item_name": "Empress Gloves", "brand_or_set": "Empress International", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": false}, {"stat": "ARMOR_REGEN", "value": 4500, "max_possible": 4925, "recal": false}], "talent": null, "ocr_confidence": 0.96, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_dcf4c59d2cc9", "crop_image_path": "data/crops/shd_dcf4c59d2cc9.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "EXOTIC", "item_name": "Waveform", "brand_or_set": "Waveform", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 10.0, "max_possible": 10.0, "recal": false}, {"stat": "SKILL_HASTE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": {"name": "Alternating Current", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_145e6ee0d2b6", "crop_image_path": "data/crops/shd_145e6ee0d2b6.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "HIGH_END", "item_name": "Hana-U Kneepads", "brand_or_set": "Hana-U Corporation", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 9.9, "max_possible": 10.0, "recal": false}, {"stat": "SKILL_HASTE", "value": 11.5, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_27f43a353330", "crop_image_path": "data/crops/shd_27f43a353330.webp"}, {"location": "STASH", "slot": "MASK", "rarity": "GEAR_SET", "item_name": "Hunter's Fury Mask", "brand_or_set": "Hunter's Fury", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_8fcaa00e8bba", "crop_image_path": "data/crops/shd_8fcaa00e8bba.webp"}, {"location": "STASH", "slot": "GLOVES", "rarity": "GEAR_SET", "item_name": "Hunter's Fury Gloves", "brand_or_set": "Hunter's Fury", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 170000, "max_possible": 170000, "is_recalibrated": true}, "minor_attributes": [{"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_257c8c17858b", "crop_image_path": "data/crops/shd_257c8c17858b.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "GEAR_SET", "item_name": "Hunter's Fury Holster", "brand_or_set": "Hunter's Fury", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 164000, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "STATUS_EFFECTS", "value": 8.0, "max_possible": 10.0, "recal": false}], "talent": null, "ocr_confidence": 0.95, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_584733a10fa3", "crop_image_path": "data/crops/shd_584733a10fa3.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "GEAR_SET", "item_name": "Hunter's Fury Kneepads", "brand_or_set": "Hunter's Fury", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.7, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_DAMAGE", "value": 11.8, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_37a0a42c4ec5", "crop_image_path": "data/crops/shd_37a0a42c4ec5.webp"}, {"location": "STASH", "slot": "CHEST", "rarity": "NAMED_HIGH_END", "item_name": "Hunter-Killer", "brand_or_set": "Golan Gear Ltd", "core_attribute": {"type": "ARMOR", "category": "BLUE", "value": 170000, "max_possible": 170000, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": true}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 11.4, "max_possible": 12.0, "recal": false}], "talent": {"name": "Perfect Intimidate", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_a4f843ba7120", "crop_image_path": "data/crops/shd_a4f843ba7120.webp"}, {"location": "BACKPACK", "slot": "KNEEPADS", "rarity": "NAMED_HIGH_END", "item_name": "Fox's Prayer", "brand_or_set": "Overlord Armaments", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "DTTOOC", "value": 8.0, "max_possible": 8.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 12.0, "max_possible": 12.0, "recal": true}], "talent": {"name": "Perfect Attribute (+8% DTTOOC)", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_2da6e1ee6918", "crop_image_path": "data/crops/shd_2da6e1ee6918.webp"}, {"location": "BACKPACK", "slot": "GLOVES", "rarity": "NAMED_HIGH_END", "item_name": "Contractor's Gloves", "brand_or_set": "Petrov Defense Group", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "DAMAGE_TO_ARMOR", "value": 8.0, "max_possible": 8.0, "recal": false}, {"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": true}], "talent": {"name": "Perfect Attribute (+8% Damage to Armor)", "is_perfect_locked": true}, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_b5073256636d", "crop_image_path": "data/crops/shd_b5073256636d.webp"}, {"location": "STASH", "slot": "CHEST", "rarity": "NAMED_HIGH_END", "item_name": "The Sacrifice", "brand_or_set": "Providence Defense", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 14.9, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}, {"stat": "HEADSHOT_DAMAGE", "value": 9.5, "max_possible": 10.0, "recal": false}], "talent": {"name": "Perfect Glass Cannon", "is_perfect_locked": true}, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_debef47949e3", "crop_image_path": "data/crops/shd_debef47949e3.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "HIGH_END", "item_name": "Grupo Holster", "brand_or_set": "Grupo Sombra S.A.", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 15.0, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 6.0, "max_possible": 6.0, "recal": false}, {"stat": "CRITICAL_HIT_DAMAGE", "value": 11.7, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_dc3a6aaf1b85", "crop_image_path": "data/crops/shd_dc3a6aaf1b85.webp"}, {"location": "STASH", "slot": "CHEST", "rarity": "GEAR_SET", "item_name": "Eclipse Chest", "brand_or_set": "Eclipse Protocol", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "STATUS_EFFECTS", "value": 10.0, "max_possible": 10.0, "recal": true}], "talent": {"name": "Proliferation", "is_perfect_locked": true}, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_c5a0074bc559", "crop_image_path": "data/crops/shd_c5a0074bc559.webp"}, {"location": "STASH", "slot": "BACKPACK", "rarity": "GEAR_SET", "item_name": "Eclipse Backpack", "brand_or_set": "Eclipse Protocol", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "STATUS_EFFECTS", "value": 9.8, "max_possible": 10.0, "recal": false}], "talent": {"name": "Symptom Aggravator", "is_perfect_locked": true}, "ocr_confidence": 0.98, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_9817b167ce52", "crop_image_path": "data/crops/shd_9817b167ce52.webp"}, {"location": "STASH", "slot": "GLOVES", "rarity": "GEAR_SET", "item_name": "Eclipse Gloves", "brand_or_set": "Eclipse Protocol", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "STATUS_EFFECTS", "value": 10.0, "max_possible": 10.0, "recal": false}], "talent": null, "ocr_confidence": 0.99, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_f6ec0cf2618a", "crop_image_path": "data/crops/shd_f6ec0cf2618a.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "GEAR_SET", "item_name": "Eclipse Kneepads", "brand_or_set": "Eclipse Protocol", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_HASTE", "value": 11.2, "max_possible": 12.0, "recal": false}], "talent": null, "ocr_confidence": 0.97, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_c2d4cd0266cb", "crop_image_path": "data/crops/shd_c2d4cd0266cb.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "GEAR_SET", "item_name": "Striker's Holster (Inferior Roll)", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 11.2, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 4.1, "max_possible": 6.0, "recal": false}], "talent": null, "ocr_confidence": 0.96, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_3bf35ed9de4f", "crop_image_path": "data/crops/shd_3bf35ed9de4f.webp"}, {"location": "STASH", "slot": "KNEEPADS", "rarity": "GEAR_SET", "item_name": "Striker's Kneepads (Inferior Roll)", "brand_or_set": "Striker's Battlegear", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 10.8, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "HEALTH", "value": 11200, "max_possible": 18935, "recal": false}], "talent": null, "ocr_confidence": 0.94, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_1a87dd3a9a69", "crop_image_path": "data/crops/shd_1a87dd3a9a69.webp"}, {"location": "STASH", "slot": "MASK", "rarity": "HIGH_END", "item_name": "Empress Mask (Inferior Duplicate)", "brand_or_set": "Empress International", "core_attribute": {"type": "SKILL_TIER", "category": "YELLOW", "value": 1, "max_possible": 1, "is_recalibrated": false}, "minor_attributes": [{"stat": "SKILL_DAMAGE", "value": 7.1, "max_possible": 10.0, "recal": false}, {"stat": "HEALTH", "value": 12400, "max_possible": 18935, "recal": false}], "talent": null, "ocr_confidence": 0.93, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_12d9835be2f6", "crop_image_path": "data/crops/shd_12d9835be2f6.webp"}, {"location": "STASH", "slot": "HOLSTER", "rarity": "HIGH_END", "item_name": "Grupo Holster (Low Roll)", "brand_or_set": "Grupo Sombra S.A.", "core_attribute": {"type": "WEAPON_DAMAGE", "category": "RED", "value": 10.4, "max_possible": 15.0, "is_recalibrated": false}, "minor_attributes": [{"stat": "CRITICAL_HIT_CHANCE", "value": 4.2, "max_possible": 6.0, "recal": false}, {"stat": "WEAPON_HANDLING", "value": 5.0, "max_possible": 8.0, "recal": false}], "talent": null, "ocr_confidence": 0.86, "provenance_tier": "TIER_1_OWNED", "item_id": "shd_c2dad81724d1", "crop_image_path": "data/crops/shd_c2dad81724d1.webp"}], "admin_showcase_loadouts": [{"loadout_id": "loadout_lengmo_pesti_turm", "name": "Lengmo Pesti Turm (SHD 2793 Main)", "specialization": "Gunner", "primary_weapon": "Pestilence (Exotic LMG - Rank 10)", "secondary_weapon": "Lexington (Named AR - Exp 30)", "sidearm": "Orbit / Kard Custom", "skill_1": "Reviver Hive", "skill_2": "Banshee Pulse / Decoy", "notes": "3pc Lengmo (+30% LMG DMG + Backbone Perfect Unstoppable Force) + Turmoil Named Česká Kneepads + Contractor's Gloves + The Sacrifice (Perfect Glass Cannon). Prototype Augment: Paradox (+1.5% Mag Refill).", "slots": {"MASK": {"item_name": "Lengmo Mask", "brand_or_set": "Lengmo", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 6.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": null, "is_prototype": false}, "CHEST": {"item_name": "The Sacrifice", "brand_or_set": "Providence Defense", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 6.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Perfect Glass Cannon", "is_prototype": false}, "BACKPACK": {"item_name": "Backbone", "brand_or_set": "Lengmo", "core_type": "WEAPON_DAMAGE", "core_val": 22.5, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 9.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Perfect Unstoppable Force", "is_prototype": true}, "GLOVES": {"item_name": "Contractor's Gloves", "brand_or_set": "Petrov Defense Group", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "DAMAGE_TO_ARMOR", "m1_val": 8.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": null, "is_prototype": false}, "HOLSTER": {"item_name": "Lengmo Holster (Prototype)", "brand_or_set": "Lengmo", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 9.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Augment: Paradox", "is_prototype": true}, "KNEEPADS": {"item_name": "Turmoil", "brand_or_set": "Česká Výroba s.r.o.", "core_type": "WEAPON_DAMAGE", "core_val": 22.5, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 9.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Turmoil (50% Shared Damage Split)", "is_prototype": true}}, "updated_at": "2026-10-24 05:01:50"}], "admin_default_state": {"inventory": [], "saved_loadouts": [{"loadout_id": "loadout_lengmo_pesti_turm", "name": "Lengmo Pesti Turm (SHD 2793 Main)", "specialization": "Gunner", "primary_weapon": "Pestilence (Exotic LMG - Rank 10)", "secondary_weapon": "Lexington (Named AR - Exp 30)", "sidearm": "Orbit / Kard Custom", "skill_1": "Reviver Hive", "skill_2": "Banshee Pulse / Decoy", "notes": "3pc Lengmo (+30% LMG DMG + Backbone Perfect Unstoppable Force) + Turmoil Named Česká Kneepads + Contractor's Gloves + The Sacrifice (Perfect Glass Cannon). Prototype Augment: Paradox (+1.5% Mag Refill).", "slots": {"MASK": {"item_name": "Lengmo Mask", "brand_or_set": "Lengmo", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 6.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": null, "is_prototype": false}, "CHEST": {"item_name": "The Sacrifice", "brand_or_set": "Providence Defense", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 6.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Perfect Glass Cannon", "is_prototype": false}, "BACKPACK": {"item_name": "Backbone", "brand_or_set": "Lengmo", "core_type": "WEAPON_DAMAGE", "core_val": 22.5, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 9.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Perfect Unstoppable Force", "is_prototype": true}, "GLOVES": {"item_name": "Contractor's Gloves", "brand_or_set": "Petrov Defense Group", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "DAMAGE_TO_ARMOR", "m1_val": 8.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": null, "is_prototype": false}, "HOLSTER": {"item_name": "Lengmo Holster (Prototype)", "brand_or_set": "Lengmo", "core_type": "WEAPON_DAMAGE", "core_val": 15.0, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 9.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Augment: Paradox", "is_prototype": true}, "KNEEPADS": {"item_name": "Turmoil", "brand_or_set": "Česká Výroba s.r.o.", "core_type": "WEAPON_DAMAGE", "core_val": 22.5, "m1_stat": "CRITICAL_HIT_CHANCE", "m1_val": 9.0, "m2_stat": "CRITICAL_HIT_DAMAGE", "m2_val": 12.0, "talent": "Turmoil (50% Shared Damage Split)", "is_prototype": true}}, "updated_at": "2026-10-24 05:01:50"}], "expertise": {"expertise_level": 30, "total_proficient": 413, "total_items": 500, "missing_count": 87, "estimated_filament_to_max": 26100, "categories": [{"category_id": "rifles", "group": "Weapons", "name": "Rifles", "proficient": 35, "total": 38, "missing": 3, "pct": 92.1}, {"category_id": "assault_rifles", "group": "Weapons", "name": "Assault Rifles", "proficient": 43, "total": 56, "missing": 13, "pct": 76.8}, {"category_id": "marksman_rifles", "group": "Weapons", "name": "Marksman Rifles", "proficient": 27, "total": 34, "missing": 7, "pct": 79.4}, {"category_id": "shotguns", "group": "Weapons", "name": "Shotguns", "proficient": 26, "total": 33, "missing": 7, "pct": 78.8}, {"category_id": "smgs", "group": "Weapons", "name": "SMGs", "proficient": 38, "total": 44, "missing": 6, "pct": 86.4}, {"category_id": "lmgs", "group": "Weapons", "name": "LMGs", "proficient": 33, "total": 39, "missing": 6, "pct": 84.6}, {"category_id": "pistols", "group": "Weapons", "name": "Pistols", "proficient": 29, "total": 33, "missing": 4, "pct": 87.9}, {"category_id": "specialization", "group": "Weapons", "name": "Specialization", "proficient": 6, "total": 6, "missing": 0, "pct": 100.0}, {"category_id": "masks", "group": "Named & Exotic Gear", "name": "Masks", "proficient": 10, "total": 12, "missing": 2, "pct": 83.3}, {"category_id": "body_armor", "group": "Named & Exotic Gear", "name": "Body Armor", "proficient": 20, "total": 31, "missing": 11, "pct": 64.5}, {"category_id": "backpacks", "group": "Named & Exotic Gear", "name": "Backpacks", "proficient": 22, "total": 30, "missing": 8, "pct": 73.3}, {"category_id": "gloves", "group": "Named & Exotic Gear", "name": "Gloves", "proficient": 11, "total": 11, "missing": 0, "pct": 100.0}, {"category_id": "holsters", "group": "Named & Exotic Gear", "name": "Holsters", "proficient": 10, "total": 13, "missing": 3, "pct": 76.9}, {"category_id": "kneepads", "group": "Named & Exotic Gear", "name": "Kneepads", "proficient": 7, "total": 12, "missing": 5, "pct": 58.3}, {"category_id": "brand_sets", "group": "Brands, Gear Sets & Skills", "name": "Brand Sets", "proficient": 38, "total": 44, "missing": 6, "pct": 86.4}, {"category_id": "gear_sets", "group": "Brands, Gear Sets & Skills", "name": "Gear Sets", "proficient": 19, "total": 22, "missing": 3, "pct": 86.4}, {"category_id": "skill_variants", "group": "Brands, Gear Sets & Skills", "name": "Skill Variants", "proficient": 39, "total": 42, "missing": 3, "pct": 92.9}], "items": [{"item_key": "eagle_bearer", "name": "Eagle Bearer", "category": "Assault Rifles", "rank": 5, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Dark Hours Raid / DZ — Donate 150 Printer Filament", "filament_needed": 150}, {"item_key": "emperor_guard", "name": "Emperor's Guard (Murakami)", "category": "Kneepads", "rank": 4, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Dark Zone / Named Cache — Donate 180 Printer Filament", "filament_needed": 180}, {"item_key": "yaahl_hollow_man", "name": "The Hollow Man (Yaahl)", "category": "Masks", "rank": 3, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Dark Zone / Named Cache — Donate 210 Printer Filament", "filament_needed": 210}, {"item_key": "regulus", "name": "Regulus", "category": "Pistols", "rank": 6, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Iron Horse Raid Project — Donate 120 Printer Filament", "filament_needed": 120}, {"item_key": "harmony", "name": "Harmony", "category": "Rifles", "rank": 7, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "DZ / Named Item Cache — Donate 6 Copies or 90 Printer Filament", "filament_needed": 90}, {"item_key": "ravenous", "name": "The Ravenous", "category": "Rifles", "rank": 4, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Iron Horse Raid / DZ Exotic — Donate Printer Filament (180 Filament left)", "filament_needed": 180}, {"item_key": "vindicator", "name": "Vindicator", "category": "Rifles", "rank": 2, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Descent NSA Tech Vendor — Donate Printer Filament (240 Filament left)", "filament_needed": 240}, {"item_key": "1886", "name": "1886", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 0, "acquisition_source": "Target Loot: Rifles", "filament_needed": 0}, {"item_key": "acr_ss", "name": "ACR SS", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 0, "acquisition_source": "Target Loot / Donate Printer Filament", "filament_needed": 0}, {"item_key": "achilles", "name": "Achilles", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 0, "acquisition_source": "Target Loot / Donate Printer Filament", "filament_needed": 0}, {"item_key": "artists_tool", "name": "Artist's Tool", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 0, "acquisition_source": "Named Rifle (Perfect Rifleman)", "filament_needed": 0}, {"item_key": "artist_s_tool", "name": "Artist's Tool", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 0, "acquisition_source": "Target Loot / Donate Printer Filament", "filament_needed": 0}, {"item_key": "bakers_dozen", "name": "Baker's Dozen", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 1, "acquisition_source": "Named Rifle (Perfect Lucky Shot)", "filament_needed": 0}, {"item_key": "baker_s_dozen", "name": "Baker's Dozen", "category": "Rifles", "rank": 10, "is_proficient": true, "upgrade_grade": 0, "acquisition_source": "Target Loot / Donate Printer Filament", "filament_needed": 0}]}}, "tester_default_expertise": {"expertise_level": 1, "total_proficient": 0, "total_items": 500, "missing_count": 500, "estimated_filament_to_max": 150000, "categories": [{"category_id": "rifles", "group": "Weapons", "name": "Rifles", "proficient": 0, "total": 38, "missing": 38, "pct": 0.0}, {"category_id": "assault_rifles", "group": "Weapons", "name": "Assault Rifles", "proficient": 0, "total": 56, "missing": 56, "pct": 0.0}, {"category_id": "marksman_rifles", "group": "Weapons", "name": "Marksman Rifles", "proficient": 0, "total": 34, "missing": 34, "pct": 0.0}, {"category_id": "shotguns", "group": "Weapons", "name": "Shotguns", "proficient": 0, "total": 33, "missing": 33, "pct": 0.0}, {"category_id": "smgs", "group": "Weapons", "name": "SMGs", "proficient": 0, "total": 44, "missing": 44, "pct": 0.0}, {"category_id": "lmgs", "group": "Weapons", "name": "LMGs", "proficient": 0, "total": 39, "missing": 39, "pct": 0.0}, {"category_id": "pistols", "group": "Weapons", "name": "Pistols", "proficient": 0, "total": 33, "missing": 33, "pct": 0.0}, {"category_id": "specialization", "group": "Weapons", "name": "Specialization", "proficient": 0, "total": 6, "missing": 6, "pct": 0.0}, {"category_id": "masks", "group": "Named & Exotic Gear", "name": "Masks", "proficient": 0, "total": 12, "missing": 12, "pct": 0.0}, {"category_id": "body_armor", "group": "Named & Exotic Gear", "name": "Body Armor", "proficient": 0, "total": 31, "missing": 31, "pct": 0.0}, {"category_id": "backpacks", "group": "Named & Exotic Gear", "name": "Backpacks", "proficient": 0, "total": 30, "missing": 30, "pct": 0.0}, {"category_id": "gloves", "group": "Named & Exotic Gear", "name": "Gloves", "proficient": 0, "total": 11, "missing": 11, "pct": 0.0}, {"category_id": "holsters", "group": "Named & Exotic Gear", "name": "Holsters", "proficient": 0, "total": 13, "missing": 13, "pct": 0.0}, {"category_id": "kneepads", "group": "Named & Exotic Gear", "name": "Kneepads", "proficient": 0, "total": 12, "missing": 12, "pct": 0.0}, {"category_id": "brand_sets", "group": "Brands, Gear Sets & Skills", "name": "Brand Sets", "proficient": 0, "total": 44, "missing": 44, "pct": 0.0}, {"category_id": "gear_sets", "group": "Brands, Gear Sets & Skills", "name": "Gear Sets", "proficient": 0, "total": 22, "missing": 22, "pct": 0.0}, {"category_id": "skill_variants", "group": "Brands, Gear Sets & Skills", "name": "Skill Variants", "proficient": 0, "total": 42, "missing": 42, "pct": 0.0}], "items": [{"item_key": "1886", "name": "1886", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Target Loot: Rifles", "filament_needed": 300}, {"item_key": "achilles", "name": "Achilles", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Named Item / Target Loot", "filament_needed": 300}, {"item_key": "acr_ss", "name": "ACR SS", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Target Loot: Rifles", "filament_needed": 300}, {"item_key": "artists_tool", "name": "Artist's Tool", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Named Rifle (Perfect Rifleman)", "filament_needed": 300}, {"item_key": "bakers_dozen", "name": "Baker's Dozen", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Named Rifle (Perfect Lucky Shot)", "filament_needed": 300}, {"item_key": "ravenous", "name": "The Ravenous", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Iron Horse Raid / DZ Exotic — Donate Printer Filament (180 Filament left)", "filament_needed": 300}, {"item_key": "vindicator", "name": "Vindicator", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Descent NSA Tech Vendor — Donate Printer Filament (240 Filament left)", "filament_needed": 300}, {"item_key": "harmony", "name": "Harmony", "category": "Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "DZ / Named Item Cache — Donate 6 Copies or 90 Printer Filament", "filament_needed": 300}, {"item_key": "eagle_bearer", "name": "Eagle Bearer", "category": "Assault Rifles", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Dark Hours Raid / DZ — Donate 150 Printer Filament", "filament_needed": 300}, {"item_key": "regulus", "name": "Regulus", "category": "Pistols", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Iron Horse Raid Project — Donate 120 Printer Filament", "filament_needed": 300}, {"item_key": "yaahl_hollow_man", "name": "The Hollow Man (Yaahl)", "category": "Masks", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Dark Zone / Named Cache — Donate 210 Printer Filament", "filament_needed": 300}, {"item_key": "emperor_guard", "name": "Emperor's Guard (Murakami)", "category": "Kneepads", "rank": 0, "is_proficient": false, "upgrade_grade": 0, "acquisition_source": "Dark Zone / Named Cache — Donate 180 Printer Filament", "filament_needed": 300}]}};

(function (global) {
  'use strict';

  const SLOTS = ['MASK', 'CHEST', 'BACKPACK', 'GLOVES', 'HOLSTER', 'KNEEPADS'];
  const CORE_MAX = { WEAPON_DAMAGE: 15.0, ARMOR: 170000.0, SKILL_TIER: 1.0 };
  const MINOR_MAX = {
    CRITICAL_HIT_CHANCE: 6.0,
    CRITICAL_HIT_DAMAGE: 12.0,
    HEADSHOT_DAMAGE: 10.0,
    WEAPON_HANDLING: 8.0,
    ARMOR_REGEN: 4925.0,
    HAZARD_PROTECTION: 10.0,
    HEALTH: 18935.0,
    EXPLOSIVE_RESISTANCE: 10.0,
    SKILL_DAMAGE: 10.0,
    SKILL_HASTE: 12.0,
    SKILL_REPAIR: 20.0,
    STATUS_EFFECTS: 10.0,
    DAMAGE_TO_ARMOR: 8.0,
    DTTOOC: 10.0
  };
  const MINOR_SHORT = {
    CRITICAL_HIT_CHANCE: '6.0% CHC',
    CRITICAL_HIT_DAMAGE: '12.0% CHD',
    HEADSHOT_DAMAGE: '10.0% HSD',
    WEAPON_HANDLING: '8.0% Weapon Handling',
    ARMOR_REGEN: '4,925 Armor Regen',
    HAZARD_PROTECTION: '10.0% Hazard Prot',
    SKILL_DAMAGE: '10.0% Skill Damage',
    SKILL_HASTE: '12.0% Skill Haste',
    SKILL_REPAIR: '20.0% Repair Skills',
    STATUS_EFFECTS: '10.0% Status Effects',
    DAMAGE_TO_ARMOR: '8.0% DTA',
    DTTOOC: '10.0% DTTOOC'
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function generateSvgCardDataUri(item) {
    const rarityColors = {
      EXOTIC: '#e11d48',
      GEAR_SET: '#059669',
      NAMED_HIGH_END: '#d97706',
      HIGH_END: '#ca8a04'
    };
    const hdr = rarityColors[item.rarity] || '#ca8a04';
    const name = String(item.item_name || item.slot || 'Gear Item').replace(/[<>&"']/g, '');
    const brand = String(item.brand_or_set || 'High-End').replace(/[<>&"']/g, '');
    const slot = String(item.slot || 'MASK').replace(/[<>&"']/g, '');
    const cType = item.core_attribute?.type || 'WEAPON_DAMAGE';
    const cVal = item.core_attribute?.value ?? 15.0;
    const cText = cType === 'WEAPON_DAMAGE'
      ? `+${cVal}% Weapon Damage`
      : (cType === 'ARMOR' ? `+${Number(cVal).toLocaleString()} Armor` : `+1 Skill Tier`);
    const mLines = (item.minor_attributes || []).map((m, idx) => {
      const s = String(m.stat || '').replace(/_/g, ' ');
      return `<text x="16" y="${135 + idx * 24}" fill="#e2e8f0" font-family="Segoe UI, sans-serif" font-size="13">+${m.value} ${s}</text>`;
    }).join('');
    const tal = item.talent?.name ? `<text x="16" y="192" fill="#fbbf24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="13">★ ${String(item.talent.name).replace(/[<>&"']/g, '')}</text>` : '';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
      <rect width="360" height="220" fill="#0f172a" rx="8"/>
      <rect width="360" height="58" fill="${hdr}" rx="8"/>
      <text x="16" y="26" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="16">${name}</text>
      <text x="16" y="46" fill="#f8fafc" font-family="Segoe UI, sans-serif" font-size="12">${brand} // ${slot}</text>
      <text x="16" y="96" fill="#ffedd5" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="14">CORE: ${cText}</text>
      ${mLines}
      ${tal}
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function matchesSlotBrand(item, slotSpec) {
    const nameLower = (item.item_name || '').toLowerCase();
    const brandLower = (item.brand_or_set || '').toLowerCase();
    const prefList = slotSpec.preferred || (slotSpec.preferred_brand ? [slotSpec.preferred_brand] : []);
    const altList = slotSpec.alt_brands || [];

    for (const pref of prefList) {
      const pLow = String(pref || '').toLowerCase();
      if (pLow && (pLow === nameLower || pLow === brandLower || brandLower.includes(pLow) || nameLower.includes(pLow))) {
        return [true, false];
      }
    }
    for (const alt of altList) {
      const aLow = String(alt || '').toLowerCase();
      if (aLow && (aLow === nameLower || aLow === brandLower || brandLower.includes(aLow) || nameLower.includes(aLow))) {
        return [false, true];
      }
    }
    return [false, false];
  }

  function scoreRawState(item, slotSpec) {
    const [isPref, isAlt] = matchesSlotBrand(item, slotSpec);
    if (!isPref && !isAlt) return 0.0;
    const brandPts = isPref ? 35.0 : 27.0;

    const targetCore = slotSpec.core || 'WEAPON_DAMAGE';
    const coreObj = item.core_attribute || {};
    const cType = coreObj.type || 'WEAPON_DAMAGE';
    const cVal = Number(coreObj.value || 0);
    const cMax = CORE_MAX[cType] || 15.0;
    const cRatio = cMax > 0 ? Math.min(1.0, Math.max(0.0, cVal / cMax)) : 1.0;

    let corePts = 8.0 * cRatio;
    if (cType === targetCore || ['Memento', 'NinjaBike Messenger Backpack'].includes(item.item_name)) {
      corePts = 25.0 * (0.4 + 0.6 * cRatio);
    }

    const targetMinors = slotSpec.minors || ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'];
    const minors = item.minor_attributes || [];
    let minorPts = 0.0;
    if (minors.length > 0) {
      const slotScores = [];
      for (const m of minors) {
        const mStat = m.stat || '';
        const mVal = Number(m.value || 0);
        const mMax = MINOR_MAX[mStat] || 10.0;
        const mRatio = mMax > 0 ? Math.min(1.0, Math.max(0.0, mVal / mMax)) : 1.0;
        if (targetMinors.includes(mStat) || ['DTTOOC', 'DAMAGE_TO_ARMOR'].includes(mStat)) {
          slotScores.push(1.0 * (0.35 + 0.65 * mRatio));
        } else {
          slotScores.push(0.18 * mRatio);
        }
      }
      minorPts = 25.0 * (slotScores.reduce((a, b) => a + b, 0) / minors.length);
    }

    const targetTalent = slotSpec.talent;
    let talentPts = 0.0;
    if (targetTalent && ['CHEST', 'BACKPACK'].includes(item.slot)) {
      const itemTalent = ((item.talent && item.talent.name) || '').toLowerCase();
      const tLow = targetTalent.toLowerCase();
      if (itemTalent && (tLow.includes(itemTalent) || itemTalent.includes(tLow) || itemTalent.includes(tLow.replace('perfect ', '')))) {
        talentPts = 15.0;
      } else if (['GEAR_SET', 'EXOTIC'].includes(item.rarity)) {
        talentPts = 13.5;
      } else {
        talentPts = 3.0;
      }
    } else {
      const scale = 40.0 / 25.0;
      minorPts = Math.min(40.0, minorPts * scale);
      talentPts = 0.0;
    }
    return Math.round(Math.min(100.0, brandPts + corePts + minorPts + talentPts) * 100) / 100;
  }

  function simulateTinkeringBestState(item, slotSpec) {
    const rawScore = scoreRawState(item, slotSpec);
    if (rawScore <= 0) {
      return { virtual_item: item, raw_score: 0, post_tinker_score: 0, tinker_action: null, needs_tinker: false };
    }
    let bestItem = deepClone(item);
    let bestScore = rawScore;
    let bestAction = null;

    if (item.rarity === 'EXOTIC') {
      return { virtual_item: bestItem, raw_score: rawScore, post_tinker_score: bestScore, tinker_action: null, needs_tinker: false };
    }

    const coreRecal = Boolean(item.core_attribute && item.core_attribute.is_recalibrated);
    const minorRecalIdx = (item.minor_attributes || []).findIndex((m) => m.recal);
    const isVirgin = !coreRecal && minorRecalIdx === -1;

    const targetCore = slotSpec.core || 'WEAPON_DAMAGE';
    const targetMinors = slotSpec.minors || ['CRITICAL_HIT_CHANCE', 'CRITICAL_HIT_DAMAGE'];
    const targetTalent = slotSpec.talent;

    if (isVirgin || coreRecal) {
      const cand = deepClone(item);
      const cMax = CORE_MAX[targetCore] || 15.0;
      const cCat = targetCore === 'WEAPON_DAMAGE' ? 'RED' : (targetCore === 'ARMOR' ? 'BLUE' : 'YELLOW');
      const oldType = (cand.core_attribute && cand.core_attribute.type) || 'WEAPON_DAMAGE';
      cand.core_attribute = { type: targetCore, category: cCat, value: cMax, max_possible: cMax, is_recalibrated: true };
      const sc = scoreRawState(cand, slotSpec);
      if (sc > bestScore + 0.5) {
        bestScore = sc;
        bestItem = cand;
        const coreLabel = targetCore === 'WEAPON_DAMAGE' ? '+15.0% Weapon Damage' : (targetCore === 'ARMOR' ? '+170,000 Armor' : '+1 Skill Tier');
        bestAction = `Roll Core (${oldType.replace(/_/g, ' ')}) → ${coreLabel}`;
      }
    }

    const minors = item.minor_attributes || [];
    const existingStats = new Set(minors.map((m) => m.stat));
    for (let idx = 0; idx < minors.length; idx++) {
      if (!(isVirgin || minorRecalIdx === idx)) continue;
      const m = minors[idx];
      if (item.rarity === 'NAMED_HIGH_END' && ['DTTOOC', 'DAMAGE_TO_ARMOR'].includes(m.stat)) continue;
      for (const desired of targetMinors) {
        if (existingStats.has(desired) && m.stat !== desired) continue;
        const cand = deepClone(item);
        const dMax = MINOR_MAX[desired] || 6.0;
        const oldStat = (m.stat || '').replace(/_/g, ' ');
        cand.minor_attributes[idx] = { stat: desired, value: dMax, max_possible: dMax, recal: true };
        const sc = scoreRawState(cand, slotSpec);
        if (sc > bestScore + 0.5) {
          bestScore = sc;
          bestItem = cand;
          bestAction = `Roll Minor ${idx + 1} (${oldStat}) → ${MINOR_SHORT[desired] || desired}`;
        }
      }
    }

    const talentObj = item.talent || {};
    if (isVirgin && ['CHEST', 'BACKPACK'].includes(item.slot) && ['HIGH_END', 'NAMED_HIGH_END'].includes(item.rarity) && !talentObj.is_perfect_locked && targetTalent) {
      const cand = deepClone(item);
      const oldTal = talentObj.name || 'None';
      cand.talent = { name: targetTalent, is_perfect_locked: false, is_recalibrated: true };
      const sc = scoreRawState(cand, slotSpec);
      if (sc > bestScore + 0.5) {
        bestScore = sc;
        bestItem = cand;
        bestAction = `Roll Talent (${oldTal}) → ${targetTalent}`;
      }
    }

    return {
      virtual_item: bestItem,
      raw_score: rawScore,
      post_tinker_score: bestScore,
      tinker_action: bestAction,
      needs_tinker: bestAction !== null
    };
  }

  function computeItemPowerRatio(item) {
    const core = item.core_attribute || {};
    const cType = core.type || 'WEAPON_DAMAGE';
    const cRatio = Number(core.value || 0) / (CORE_MAX[cType] || 15.0);
    const minors = item.minor_attributes || [];
    const mRatios = minors.map((m) => Number(m.value || 0) / (MINOR_MAX[m.stat] || 10.0));
    const avgM = mRatios.length ? mRatios.reduce((a, b) => a + b, 0) / mRatios.length : 0.5;
    return Math.round((0.45 * cRatio + 0.55 * avgM) * 1000) / 10;
  }

  function evaluateAllBuildsJS(ownedItems, savedLoadouts = [], customBuilds = []) {
    const builds = [...(global.SHD_CARTRIDGE_SEED.meta_builds || []), ...(customBuilds || [])];
    const itemsBySlot = { MASK: [], CHEST: [], BACKPACK: [], GLOVES: [], HOLSTER: [], KNEEPADS: [] };
    ownedItems.forEach((it) => {
      it.in_loadouts = [];
      if (!it.crop_image_path || it.crop_image_path.startsWith('/data/crops/')) {
        it.svg_card_uri = generateSvgCardDataUri(it);
      }
      const s = (it.slot || '').toUpperCase();
      if (itemsBySlot[s]) itemsBySlot[s].push(it);
    });

    const usedItemIds = new Set();
    (savedLoadouts || []).forEach((ld) => {
      const slots = ld.slots || {};
      Object.keys(slots).forEach((sKey) => {
        const sVal = slots[sKey];
        if (!sVal) return;
        if (sVal.item_id) usedItemIds.add(sVal.item_id);
        (itemsBySlot[sKey] || []).forEach((it) => {
          if (
            (sVal.item_id && it.item_id === sVal.item_id) ||
            ((it.item_name || '').toLowerCase() === (sVal.item_name || '').toLowerCase() &&
             (it.brand_or_set || '').toLowerCase() === (sVal.brand_or_set || '').toLowerCase())
          ) {
            usedItemIds.add(it.item_id);
            if (!it.in_loadouts.includes(ld.name)) it.in_loadouts.push(ld.name);
          }
        });
      });
    });

    const missingBrandDemand = {};
    const evaluatedBuilds = [];

    for (const b of builds) {
      const slotResults = {};
      let filledSlots = 0;
      let totalRaw = 0;
      let totalPost = 0;
      const tinkerSteps = [];
      const missingSlots = [];
      let equippedExotic = false;
      const cores = { RED: 0, BLUE: 0, YELLOW: 0 };
      let chcTotal = 10.0;
      let chdTotal = 45.0;
      let awdTotal = 10.0;
      let armorTotal = 726000;

      for (const s of SLOTS) {
        const spec = b.slots[s];
        const candidates = [];
        for (const it of itemsBySlot[s] || []) {
          const [isPref, isAlt] = matchesSlotBrand(it, spec);
          if (!isPref && !isAlt) continue;
          if (it.rarity === 'EXOTIC' && equippedExotic) continue;
          const sim = simulateTinkeringBestState(it, spec);
          candidates.push([sim.post_tinker_score, sim.raw_score, it, sim]);
        }

        if (candidates.length > 0) {
          candidates.sort((a, bCand) => (bCand[0] - a[0]) || (bCand[1] - a[1]));
          const [bestPost, bestRaw, rawIt, bestSim] = candidates[0];
          const vIt = bestSim.virtual_item;
          if (vIt.rarity === 'EXOTIC') equippedExotic = true;
          filledSlots += 1;
          totalRaw += bestRaw;
          totalPost += bestPost;
          usedItemIds.add(rawIt.item_id);

          const cCat = (vIt.core_attribute && vIt.core_attribute.category) || 'RED';
          if (['Memento', 'NinjaBike Messenger Backpack'].includes(vIt.item_name)) {
            cores.RED += 1;
            cores.BLUE += 1;
            cores.YELLOW += 1;
            awdTotal += 15.0;
            armorTotal += 170000;
          } else {
            cores[cCat] = (cores[cCat] || 0) + 1;
            if (cCat === 'RED') awdTotal += Number(vIt.core_attribute.value || 15.0);
            else if (cCat === 'BLUE') armorTotal += Number(vIt.core_attribute.value || 170000);
          }

          for (const m of vIt.minor_attributes || []) {
            if (m.stat === 'CRITICAL_HIT_CHANCE') chcTotal += Number(m.value || 0);
            else if (m.stat === 'CRITICAL_HIT_DAMAGE') chdTotal += Number(m.value || 0);
          }

          if (bestSim.needs_tinker) {
            tinkerSteps.push({
              slot: s,
              item_name: rawIt.item_name,
              location: rawIt.location,
              action: bestSim.tinker_action,
              score_gain: Math.round((bestPost - bestRaw) * 10) / 10
            });
          }

          slotResults[s] = {
            status: bestSim.needs_tinker ? 'TINKER_READY' : 'READY_AS_IS',
            item: vIt,
            raw_item: rawIt,
            raw_score: bestRaw,
            post_tinker_score: bestPost,
            tinker_action: bestSim.tinker_action
          };
        } else {
          const targetBrand = (spec.preferred && spec.preferred[0]) || spec.preferred_brand || 'High-End';
          missingSlots.push({
            slot: s,
            target: targetBrand,
            talent: spec.talent
          });
          slotResults[s] = {
            status: 'MISSING',
            target_brand: targetBrand,
            target_core: spec.core,
            target_minors: spec.minors || [],
            target_talent: spec.talent,
            raw_score: 0.0,
            post_tinker_score: 0.0
          };
          if (!missingBrandDemand[targetBrand]) {
            missingBrandDemand[targetBrand] = {
              target_loot: targetBrand,
              missing_count: 0,
              builds_unlocked: [],
              slots_needed: []
            };
          }
          missingBrandDemand[targetBrand].missing_count += 1;
          if (!missingBrandDemand[targetBrand].builds_unlocked.includes(b.name)) {
            missingBrandDemand[targetBrand].builds_unlocked.push(b.name);
          }
          missingBrandDemand[targetBrand].slots_needed.push(`${s} (${b.name})`);
        }
      }

      if (SLOTS.some((s) => slotResults[s].status !== 'MISSING' && ((slotResults[s].item && slotResults[s].item.brand_or_set) || '').toLowerCase().includes('česká'))) {
        chcTotal += 8.0;
      }
      if (SLOTS.some((s) => slotResults[s].status !== 'MISSING' && ((slotResults[s].item && slotResults[s].item.brand_or_set) || '').toLowerCase().includes('grupo'))) {
        chdTotal += 13.0;
      }
      const chcCapped = Math.min(60.0, Math.round((chcTotal + 6.0) * 10) / 10);
      const chdFinal = Math.round((chdTotal + 24.0) * 10) / 10;

      const rawPct = Math.round((totalRaw / 6.0) * 10) / 10;
      const postPct = Math.round((totalPost / 6.0) * 10) / 10;
      let readiness = 'FARMING';
      let readinessLabel = `${filledSlots}/6 FARMING`;
      if (filledSlots === 6 && tinkerSteps.length === 0) {
        readiness = 'READY_NOW';
        readinessLabel = '6/6 READY NOW';
      } else if (filledSlots === 6 && tinkerSteps.length > 0) {
        readiness = 'TINKER_AWAY';
        readinessLabel = `6/6 (${tinkerSteps.length} TINKER SWAP)`;
      }

      evaluatedBuilds.push({
        build_id: b.build_id,
        name: b.name,
        role: b.role || b.archetype || 'DPS',
        tier_badge: b.tier_badge || b.archetype || 'S-TIER META',
        specialization: b.specialization,
        primary_weapons: b.primary_weapons || [],
        summary: b.summary,
        filled_slots: filledSlots,
        readiness_status: readiness,
        readiness_label: readinessLabel,
        raw_optimization_pct: rawPct,
        post_tinker_optimization_pct: postPct,
        tinker_steps: tinkerSteps,
        missing_slots: missingSlots,
        slots: slotResults,
        telemetry: {
          cores,
          chc_pct: chcCapped,
          chd_pct: chdFinal,
          awd_pct: Math.round(awdTotal * 10) / 10,
          armor_total: `${(armorTotal / 1000000).toFixed(2)}M`
        }
      });
    }

    evaluatedBuilds.sort((a, b) => (b.filled_slots - a.filled_slots) || (b.post_tinker_optimization_pct - a.post_tinker_optimization_pct));
    const farmRadar = Object.values(missingBrandDemand).sort(
      (a, b) => (b.builds_unlocked.length - a.builds_unlocked.length) || (b.missing_count - a.missing_count)
    );

    // Deconstruct candidates
    const groups = {};
    ownedItems.forEach((it) => {
      const k = `${it.slot}::${it.brand_or_set}`;
      if (!groups[k]) groups[k] = [];
      groups[k].push(it);
    });
    const deconCandidates = [];
    Object.values(groups).forEach((grp) => {
      if (grp.length < 2) return;
      const scored = [...grp].sort((a, b) => computeItemPowerRatio(b) - computeItemPowerRatio(a));
      const sup = scored[0];
      const supPower = computeItemPowerRatio(sup);
      scored.slice(1).forEach((inf) => {
        if (usedItemIds.has(inf.item_id)) return;
        const infPower = computeItemPowerRatio(inf);
        deconCandidates.push({
          item_id: inf.item_id,
          item_name: inf.item_name,
          slot: inf.slot,
          brand_or_set: inf.brand_or_set,
          location: inf.location,
          inferior_roll_pct: infPower,
          dominated_by_name: sup.item_name,
          dominated_by_id: sup.item_id,
          superior_roll_pct: supPower,
          reason: `Strictly dominated by your ${supPower}% roll ${sup.item_name} (${inf.slot}) and unused in any Meta Build or Saved Loadout.`
        });
      });
    });

    return {
      builds: evaluatedBuilds,
      countdown_farm_radar: farmRadar,
      deconstruct_candidates: deconCandidates,
      summary_metrics: {
        total_items: ownedItems.length,
        ready_builds_count: evaluatedBuilds.filter((b) => b.filled_slots === 6).length,
        tinker_unlockable_count: evaluatedBuilds.filter((b) => b.readiness_status === 'TINKER_AWAY').length,
        deconstruct_safe_count: deconCandidates.length,
        low_confidence_review_count: ownedItems.filter((i) => Number(i.ocr_confidence || 1.0) < 0.90).length
      }
    };
  }

  function snapShorthandToItemJS(rawText, location = 'STASH') {
    const txt = String(rawText || '').trim();
    const low = txt.toLowerCase();
    let slot = 'MASK';
    for (const [kw, s] of [
      ['mask', 'MASK'], ['chest', 'CHEST'], ['vest', 'CHEST'], ['armor', 'CHEST'],
      ['backpack', 'BACKPACK'], ['bag', 'BACKPACK'], ['gloves', 'GLOVES'],
      ['holster', 'HOLSTER'], ['kneepads', 'KNEEPADS'], ['knees', 'KNEEPADS']
    ]) {
      if (low.includes(kw)) { slot = s; break; }
    }

    let rarity = 'HIGH_END';
    let itemName = `${txt.split(' ')[0] || 'Custom'} ${slot.charAt(0) + slot.slice(1).toLowerCase()}`;
    let brand = 'Providence Defense';
    let talent = null;

    const canon = global.SHD_CARTRIDGE_SEED.canonical || {};
    for (const ex of canon.exotic_armor || []) {
      if (low.includes(ex.name.toLowerCase())) {
        rarity = 'EXOTIC'; itemName = ex.name; brand = ex.name; slot = ex.slot;
        talent = { name: ex.talent, is_perfect_locked: true };
        break;
      }
    }
    if (rarity === 'HIGH_END') {
      for (const nm of canon.named_items || []) {
        if (low.includes(nm.name.toLowerCase())) {
          rarity = 'NAMED_HIGH_END'; itemName = nm.name; brand = nm.brand; slot = nm.slot;
          talent = { name: nm.perfect_talent, is_perfect_locked: true };
          break;
        }
      }
    }
    if (rarity === 'HIGH_END') {
      for (const gsObj of canon.gear_sets || []) {
        const gs = gsObj.name || String(gsObj);
        if (low.includes(gs.toLowerCase().split(' ')[0])) {
          rarity = 'GEAR_SET'; brand = gs; itemName = `${gs} ${slot.charAt(0) + slot.slice(1).toLowerCase()}`;
          break;
        }
      }
    }
    if (rarity === 'HIGH_END') {
      for (const brObj of canon.brand_sets || []) {
        const br = brObj.name || String(brObj);
        if (low.includes(br.toLowerCase().split(' ')[0])) {
          brand = br; itemName = `${br.split(' ')[0]} ${slot.charAt(0) + slot.slice(1).toLowerCase()}`;
          break;
        }
      }
    }

    const isProto = low.includes('proto') || low.includes('22.5') || low.includes('9.0') || low.includes('paradox');
    let coreType = 'WEAPON_DAMAGE';
    let coreCat = 'RED';
    let coreVal = isProto ? 22.5 : 15.0;
    if (low.includes('170k') || low.includes('blue') || low.includes('armor core')) {
      coreType = 'ARMOR'; coreCat = 'BLUE'; coreVal = 170000;
    } else if (low.includes('skill tier') || low.includes('yellow')) {
      coreType = 'SKILL_TIER'; coreCat = 'YELLOW'; coreVal = 1;
    }

    const minors = [
      { stat: 'CRITICAL_HIT_CHANCE', value: isProto ? 9.0 : 6.0, max_possible: isProto ? 9.0 : 6.0, recal: false }
    ];
    if (rarity !== 'GEAR_SET') {
      minors.push({ stat: 'CRITICAL_HIT_DAMAGE', value: 12.0, max_possible: 12.0, recal: false });
    }

    const item = {
      item_id: 'shd_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4),
      provenance_tier: 'TIER_1_OWNED',
      location,
      slot,
      rarity,
      item_name: itemName,
      brand_or_set: brand,
      core_attribute: { type: coreType, category: coreCat, value: coreVal, max_possible: coreVal, is_recalibrated: false },
      minor_attributes: minors,
      talent,
      ocr_confidence: 0.99,
      is_favorite: true
    };
    item.crop_image_path = generateSvgCardDataUri(item);
    return item;
  }

  global.SHDPortableSolver = {
    evaluateAllBuildsJS,
    snapShorthandToItemJS,
    generateSvgCardDataUri
  };
})(window);
