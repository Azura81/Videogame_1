/**
 * Spirit Delivery - Internationalization (i18n) Engine
 * Bilingual support (German & English) with automatic system language detection
 * and real-time DOM translation.
 */

(function(global) {
  "use strict";

  const TRANSLATIONS = {
    de: {
      // General
      app_title: "Spirit Delivery",
      app_tagline: "Zen-Logikrätsel im Shinto-Schrein",
      lang_de: "🇩🇪 Deutsch",
      lang_en: "🇬🇧 English",

      // Top Header & Nav
      header_level: "Level",
      header_credits: "Credits",
      header_stars: "Sterne",
      header_tower_best: "Ebene {floor}",
      btn_wardrobe_title: "Schrein-Garderobe & Kami-Skins",
      btn_trophies_title: "Schrein-Siegel & Trophäen",
      btn_help_title: "Spielanleitung & Zen-Tipps",
      btn_home_title: "Hauptmenü / Startbildschirm",
      btn_tower_title: "Turm der 100 Prüfungen (Roguelike)",
      btn_daily_title: "Tägliche Schreinprüfung (Blind-Modus)",
      btn_music_toggle: "Musik an/aus",
      btn_sound_toggle: "Sound an/aus",

      // Homescreen
      home_kicker: "TORII DER 1000 SCHREINE",
      home_campaign_title: "Schrein-Pfad",
      home_campaign_badge: "60 Level",
      home_campaign_desc: "Reise durch 6 heilige Kapitel bis zum Gipfel des Fuji.",
      home_tower_title: "Turm der 100 Prüfungen",
      home_tower_badge: "Roguelike",
      home_tower_desc: "100 zufällige Schrein-Ebenen, 3 Laternen-Leben & heilige Altäre.",
      home_daily_title: "Tägliche Prüfung",
      home_daily_badge: "Blind-Challenge",
      home_daily_desc: "Jeden Tag ein neues Rätsel ohne Kameraschwenker. Halte deine Streak!",
      home_play_btn: "SPIELEN ▶",
      home_resume_btn: "FORTSETZEN ▶",
      home_wardrobe_btn: "Garderobe & Skins",
      home_trophies_btn: "Schrein-Siegel",
      home_chapters_btn: "Levels",
      home_help_btn: "Spielanleitung",

      // Commands
      cmd_forward: "Vorwärts",
      cmd_left: "Links",
      cmd_right: "Rechts",
      cmd_action: "Aktion",
      cmd_play: "Plan abspielen",
      cmd_stop: "Stopp",
      cmd_undo: "Schritt zurück",
      cmd_clear: "Plan leeren",
      cmd_reset: "Zurücksetzen",
      cmd_swivel_left: "Kamera links",
      cmd_swivel_right: "Kamera rechts",
      cmd_swivel_reset: "Kamera zentrieren",

      // Feedback & Instructions
      feedback_ready: "Plane deine Befehlsfolge und drücke auf „Plan abspielen“.",
      feedback_running: "Los geht's! Der Shinto-Bote führt deinen Plan aus …",
      feedback_empty: "Füge zuerst mindestens einen Befehl hinzu.",
      feedback_full: "Dein Plan ist voll! Entferne einen Befehl für neue Schritte.",
      feedback_cmd_added: "{cmd} hinzugefügt.",
      feedback_cmd_removed: "Befehl entfernt.",
      feedback_plan_cleared: "Plan geleert.",
      feedback_level_reset: "Auf Startposition zurückgesetzt.",
      feedback_fail_blocked: "Plopp! Der Weg ist versperrt – passe deinen Plan an.",
      feedback_fail_water: "Platsch! KOMA ist ins Wasser gefallen – passe deinen Plan an.",
      feedback_fail_incomplete: "Plan beendet. Das Ziel wurde noch nicht erreicht – passe deinen Plan an.",
      feedback_switch_active: "✦ {color}-Schalter aktiviert! Das zugehörige Tor öffnet sich.",
      feedback_switch_none: "Hier gibt es keinen Schalter zum Aktivieren.",
      feedback_block_pushed: "Rumpel! KOMA schiebt den heiligen Steinblock vor sich her.",
      feedback_block_bridge: "Platsch! Der Felsblock versinkt im Wasser und bildet eine neue Trittstein-Brücke!",
      feedback_block_stuck: "Der heilige Felsblock ist blockiert und lässt sich nicht weiterschieben!",
      feedback_fragile_crack: "Knacks! Der morsche Trittstein bekommt Risse und versinkt gleich!",
      feedback_orb_collected: "Geisterlicht eingesammelt! ({current} / {total})",
      feedback_portal_entered: "Kitsune-Portal betreten! KOMA beamt sich ans Ziel-Portal.",
      feedback_wind_gust: "Eine kräftige Bergwindböe trägt KOMA mit sich!",
      feedback_camera_credit: "Kamera geschwenkt (-1 Credit, noch {remaining} übrig).",
      feedback_camera_empty: "Kamera-Credits aufgebraucht (0 Sterne möglich – Level kann trotzdem abgeschlossen werden).",
      tutorial_hint: "Tipp: Drücke auf „Vorwärts ↑“, um Befehle in deinen Plan einzufügen.",

      // Win Modal
      win_title_normal: "Lieferung erfolgreich!",
      win_title_boss: "「富士の龍神」 BEZWUNGEN!",
      win_title_daily: "Tägliche Schreinprüfung gemeistert!",
      win_desc_normal: "KOMA hat das Paket in {steps} Schritten zugestellt.",
      win_desc_boss: "Du hast alle 3 Relikte geborgen, das Torii des Gipfels versöhnt und den Drachen Ryūjin in {steps} Schritten erlöst!",
      win_desc_daily: "Du hast die heutige Meisterprüfung ohne Kameraschwenker in {steps} Schritten gelöst!",
      win_credits_normal: "Übrige Kamera-Credits: {credits} / {max}",
      win_credits_zero: "0 Kameraschwenker verwendet · Reine Vorab-Planung!",
      btn_next_level: "Nächstes Level →",
      btn_replay_first: "Erstes Level erneut spielen",
      btn_replay: "Nochmal ↺",

      // Tower Mode
      tower_floor_title: "EBENE {floor}",
      tower_hud_floor: "Ebene {floor}",
      tower_feedback_loaded: "Turm-Ebene {floor} geladen! Plane den Weg zum heiligen Schrein-Torii.",
      tower_intro_title: "Turm der 100 Prüfungen",
      tower_intro_desc: "Beweise deine Weisheit im heiligen Pagodenturm. 100 prozedurale Schrein-Ebenen mit steigender Komplexität.",
      tower_rule_1: "Du startest mit 3 heiligen Laternen (3 Leben).",
      tower_rule_2: "Jede 5. Ebene wartet ein Altar der Kami mit wählbaren Segnungen.",
      tower_rule_3: "Erreiche Ebene 100, um den höchsten Schrein-Rang zu erlangen.",
      tower_btn_start: "Aufstieg beginnen (Ebene 1)",
      tower_gameover_title: "Alle Laternen erloschen!",
      tower_gameover_desc: "Die Energie im Turm der 100 Prüfungen ist erloschen.",
      tower_summary_floor: "Erreichte Ebene:",
      tower_summary_score: "Erzielte Punkte:",
      tower_summary_zen: "Zen-Meisterzüge:",
      tower_record_badge: "NEUER PERSÖNLICHER REKORD!",
      tower_btn_revive_strong: "Zweite Chance: 1 Laterne retten",
      tower_btn_revive_sub: "Kurzes Video ansehen & Ebene fortsetzen",
      tower_btn_retry: "Erneut versuchen",
      tower_btn_exit: "Zur Kampagne",
      tower_altar_title: "Altar der Kami",
      tower_altar_desc: "Wähle eine heilige Gabe für deinen weiteren Aufstieg im Turm:",

      // Wardrobe / Skins
      wardrobe_kicker: "SCHREIN-GARDEROBE",
      wardrobe_title: "Kami-Skins",
      wardrobe_desc: "Schließe die 60 Level mit möglichst vielen Kamera-Credits ab, um Sterne zu sammeln und mystische japanische Kami-Designs freizuschalten.",
      wardrobe_ad_strong: "+3 Kami-Sterne geschenkt",
      wardrobe_ad_sub: "Kurzes Video ansehen & Skins schneller freischalten",
      wardrobe_equipped: "Ausgerüstet ✓",
      wardrobe_equip_btn: "Ausrüsten",
      wardrobe_locked: "Gesperrt",
      wardrobe_ad_badge: "WERBUNG",
      wardrobe_bonus_toast: "+{count} Kami-Sterne geschenkt erhalten!",

      // Trophies / Achievements
      trophies_kicker: "SCHREIN-SIEGEL",
      trophies_title: "Errungenschaften",
      trophies_desc: "Meistere besondere Prüfungen in den 6 Kapiteln, um uralte Schrein-Siegel zu erwecken.",

      // Settings
      settings_kicker: "EINSTELLUNGEN",
      settings_title: "Optionen & Zen-Tipps",
      settings_bgm: "Hintergrundmusik (BGM)",
      settings_bgm_sub: "Koto- & Shamisen-Melodien",
      settings_bgm_start: "Musik starten",
      settings_bgm_stop: "Musik pausieren",
      settings_sfx: "Sound-Effekte (SFX)",
      settings_sfx_sub: "Schritte, Windböen, Torii-Glocken",
      settings_sfx_on: "SFX An",
      settings_sfx_off: "SFX Aus",
      settings_haptic: "Mobile Haptik (Vibration)",
      settings_haptic_sub: "Taktiles Feedback bei Schritten & Wind",
      settings_haptic_on: "Haptik An",
      settings_haptic_off: "Haptik Aus",
      settings_lang: "Sprache / Language",
      settings_lang_sub: "Wähle Deutsch oder Englisch",
      settings_zen_title: "Tipps für 3-Sterne-Meister:",
      settings_zen_tip1: "Halte alle <strong>Kamera-Credits</strong> zurück, um die volle 3-Sterne-Wertung zu erhalten.",
      settings_zen_tip2: "Plane vorab den Weg durch Tore und aktiviere Schalter mit <strong>✦ Aktion</strong>.",
      settings_zen_tip3: "Auf dem <strong>Berg Fuji</strong> tragen dich Windböen automatisch in Pfeilrichtung weiter!",
      settings_resume_btn: "Zurück zum Spiel",

      // Mechanic Intros
      mechanic_fragile_title: "Neues Hindernis",
      mechanic_fragile_sub: "Brüchige Trittsteine (Moroi Ishi)",
      mechanic_fragile_desc: "Uralte Steine im Wasserbecken, die den Roboter nur ein einziges Mal tragen.",
      mechanic_fragile_rule1: "<strong>Einmalige Überquerung:</strong> Sobald der Roboter den Trittstein verlässt, versinkt er im Wasser.",
      mechanic_fragile_rule2: "<strong>Kein Rückweg:</strong> Plane deine Route so, dass du brüchige Steine niemals doppelt betrittst.",
      mechanic_block_title: "Neue Mechanik",
      mechanic_block_sub: "Heilige Steinblöcke (Ishi-Koma)",
      mechanic_block_desc: "Schiebe schwere Basaltblöcke, um neue Pfade zu öffnen oder Wassergräben zu überbrücken.",
      mechanic_block_rule1: "<strong>Vorwärts schieben:</strong> Wenn du direkt vor einem Block stehst und dich vorwärts bewegst, schiebst du ihn ein Feld weiter.",
      mechanic_block_rule2: "<strong>Brücken ins Wasser:</strong> Schiebst du einen Block ins Wasser, versinkt er und bildet eine feste neue Trittsteinbrücke!",
      mechanic_switch_title: "Neue Schrein-Mechanik",
      mechanic_switch_sub: "Boden-Schalter & Schrein-Tore",
      mechanic_switch_desc: "Geheime Pfade werden durch farbcodierte Bodenschalter und magische Tore versiegelt.",
      mechanic_switch_rule1: "<strong>✦ Aktion auf Schalter:</strong> Stelle dich genau auf den Schalter und nutze den violetten ✦-Befehl.",
      mechanic_switch_rule2: "<strong>Dauerhaft geöffnet:</strong> Sobald der Schalter ausgelöst wurde, öffnet sich das Torii-Gitter für immer.",
      mechanic_dismiss_btn: "Verstanden, Schrein betreten",

      // Help Modal
      help_title: "Wie man spielt",
      help_goal_title: "Das Ziel",
      help_goal_desc: "Programmiere deinen Shinto-Boten KOMA so, dass er das Opferpaket heil zum heiligen Schrein-Torii bringt.",
      help_rules_title: "Die Regeln",
      help_rule_step: "Jeder Schritt zählt: Plane deine Befehlsfolge im Voraus.",
      help_rule_credits: "Kamera-Credits: Jeder Kameraschwenker kostet 1 Credit. Behalte alle für 3 Sterne!",
      help_rule_fail: "Kein Absturz: Stoße nicht gegen Felswände und falle nicht ins Wasser."
    },

    en: {
      // General
      app_title: "Spirit Delivery",
      app_tagline: "Zen Logic Puzzles in a Shinto Shrine",
      lang_de: "🇩🇪 Deutsch",
      lang_en: "🇬🇧 English",

      // Top Header & Nav
      header_level: "Level",
      header_credits: "Credits",
      header_stars: "Stars",
      header_tower_best: "Floor {floor}",
      btn_wardrobe_title: "Shrine Wardrobe & Kami Skins",
      btn_trophies_title: "Shrine Seals & Trophies",
      btn_help_title: "How to Play & Zen Tips",
      btn_home_title: "Main Menu / Home Screen",
      btn_tower_title: "Tower of 100 Trials (Roguelike)",
      btn_daily_title: "Daily Shrine Trial (Blind Mode)",
      btn_music_toggle: "Music on/off",
      btn_sound_toggle: "Sound on/off",

      // Homescreen
      home_kicker: "TORII OF 1000 SHRINES",
      home_campaign_title: "Shrine Path",
      home_campaign_badge: "60 Levels",
      home_campaign_desc: "Journey through 6 sacred chapters to the summit of Mount Fuji.",
      home_tower_title: "Tower of 100 Trials",
      home_tower_badge: "Roguelike",
      home_tower_desc: "100 procedural shrine floors, 3 lantern lives & divine altars.",
      home_daily_title: "Daily Trial",
      home_daily_badge: "Blind Challenge",
      home_daily_desc: "A new puzzle every day with zero camera credits. Keep your streak!",
      home_play_btn: "PLAY ▶",
      home_resume_btn: "RESUME ▶",
      home_wardrobe_btn: "Wardrobe & Skins",
      home_trophies_btn: "Shrine Seals",
      home_chapters_btn: "Levels",
      home_help_btn: "How to Play",

      // Commands
      cmd_forward: "Forward",
      cmd_left: "Turn Left",
      cmd_right: "Turn Right",
      cmd_action: "Action",
      cmd_play: "Run Plan",
      cmd_stop: "Stop",
      cmd_undo: "Undo Step",
      cmd_clear: "Clear Plan",
      cmd_reset: "Reset Level",
      cmd_swivel_left: "Camera Left",
      cmd_swivel_right: "Camera Right",
      cmd_swivel_reset: "Reset Camera",

      // Feedback & Instructions
      feedback_ready: "Plan your sequence of commands and press “Run Plan”.",
      feedback_running: "Off we go! The Shinto messenger executes your plan …",
      feedback_empty: "Add at least one command first.",
      feedback_full: "Your plan is full! Remove a command for new steps.",
      feedback_cmd_added: "{cmd} added.",
      feedback_cmd_removed: "Command removed.",
      feedback_plan_cleared: "Plan cleared.",
      feedback_level_reset: "Reset to starting position.",
      feedback_fail_blocked: "Clack! The path is blocked – adjust your plan.",
      feedback_fail_water: "Splash! KOMA fell into the water – adjust your plan.",
      feedback_fail_incomplete: "Plan completed, but the goal was not reached – adjust your plan.",
      feedback_switch_active: "✦ {color} switch activated! The corresponding gate opens.",
      feedback_switch_none: "There is no switch to activate here.",
      feedback_block_pushed: "Rumble! KOMA pushes the sacred stone block.",
      feedback_block_bridge: "Splash! The stone block sinks into the water, creating a new bridge!",
      feedback_block_stuck: "The stone block is blocked and cannot be pushed further!",
      feedback_fragile_crack: "Crack! The weathered stepping stone breaks and will sink soon!",
      feedback_orb_collected: "Spirit light collected! ({current} / {total})",
      feedback_portal_entered: "Kitsune Portal entered! KOMA teleports to the exit portal.",
      feedback_wind_gust: "A powerful mountain wind gust carries KOMA forward!",
      feedback_camera_credit: "Camera rotated (-1 credit, {remaining} remaining).",
      feedback_camera_empty: "Camera credits depleted (0 stars possible – level can still be completed).",
      tutorial_hint: "Tip: Tap “Forward ↑” below to insert commands into your plan.",

      // Win Modal
      win_title_normal: "Delivery Successful!",
      win_title_boss: "「DRAGON OF FUJI」 DEFEATED!",
      win_title_daily: "Daily Shrine Trial Cleared!",
      win_desc_normal: "KOMA delivered the package in {steps} steps.",
      win_desc_boss: "You recovered all 3 relics, reconciled the summit Torii, and redeemed dragon Ryūjin in {steps} steps!",
      win_desc_daily: "You solved today's master puzzle with zero camera rotations in {steps} steps!",
      win_credits_normal: "Remaining Camera Credits: {credits} / {max}",
      win_credits_zero: "0 camera rotations used · Pure spatial planning!",
      btn_next_level: "Next Level →",
      btn_replay_first: "Replay First Level",
      btn_replay: "Replay ↺",

      // Tower Mode
      tower_floor_title: "FLOOR {floor}",
      tower_hud_floor: "Floor {floor}",
      tower_feedback_loaded: "Tower Floor {floor} loaded! Plan the path to the sacred shrine Torii.",
      tower_intro_title: "Tower of 100 Trials",
      tower_intro_desc: "Prove your wisdom in the sacred pagoda tower. 100 procedural shrine floors of scaling complexity.",
      tower_rule_1: "You start with 3 sacred lanterns (3 lives).",
      tower_rule_2: "Every 5th floor, an Altar of the Kami offers divine blessings.",
      tower_rule_3: "Reach floor 100 to attain the highest shrine rank.",
      tower_btn_start: "Begin Ascent (Floor 1)",
      tower_gameover_title: "All Lanterns Extinguished!",
      tower_gameover_desc: "The sacred energy in the Tower of 100 Trials has faded.",
      tower_summary_floor: "Floor Reached:",
      tower_summary_score: "Score Achieved:",
      tower_summary_zen: "Zen Master Moves:",
      tower_record_badge: "NEW PERSONAL RECORD!",
      tower_btn_revive_strong: "Second Chance: Save 1 Lantern",
      tower_btn_revive_sub: "Watch brief video & resume floor",
      tower_btn_retry: "Try Again",
      tower_btn_exit: "To Campaign",
      tower_altar_title: "Altar of the Kami",
      tower_altar_desc: "Choose a sacred blessing for your continued ascent:",

      // Wardrobe / Skins
      wardrobe_kicker: "SHRINE WARDROBE",
      wardrobe_title: "Kami Skins",
      wardrobe_desc: "Complete the 60 levels with as many camera credits as possible to earn stars and unlock mythical Japanese Kami designs.",
      wardrobe_ad_strong: "+3 Free Kami Stars",
      wardrobe_ad_sub: "Watch brief video & unlock skins faster",
      wardrobe_equipped: "Equipped ✓",
      wardrobe_equip_btn: "Equip",
      wardrobe_locked: "Locked",
      wardrobe_ad_badge: "AD",
      wardrobe_bonus_toast: "+{count} Kami Stars claimed!",

      // Trophies / Achievements
      trophies_kicker: "SHRINE SEALS",
      trophies_title: "Achievements",
      trophies_desc: "Master special trials across the 6 chapters to awaken ancient shrine seals.",

      // Settings
      settings_kicker: "SETTINGS",
      settings_title: "Options & Zen Tips",
      settings_bgm: "Background Music (BGM)",
      settings_bgm_sub: "Koto & Shamisen Melodies",
      settings_bgm_start: "Play Music",
      settings_bgm_stop: "Pause Music",
      settings_sfx: "Sound Effects (SFX)",
      settings_sfx_sub: "Footsteps, Wind Gusts, Torii Chimes",
      settings_sfx_on: "SFX On",
      settings_sfx_off: "SFX Off",
      settings_haptic: "Mobile Haptics (Vibration)",
      settings_haptic_sub: "Tactile feedback for movement & wind",
      settings_haptic_on: "Haptics On",
      settings_haptic_off: "Haptics Off",
      settings_lang: "Language / Sprache",
      settings_lang_sub: "Choose German or English",
      settings_zen_title: "Tips for 3-Star Masters:",
      settings_zen_tip1: "Conserve all <strong>camera credits</strong> to achieve the full 3-star rating.",
      settings_zen_tip2: "Plan your path through gates in advance and activate switches using <strong>✦ Action</strong>.",
      settings_zen_tip3: "On <strong>Mount Fuji</strong>, wind gusts carry you automatically in the arrow's direction!",
      settings_resume_btn: "Return to Game",

      // Mechanic Intros
      mechanic_fragile_title: "New Obstacle",
      mechanic_fragile_sub: "Fragile Stepping Stones (Moroi Ishi)",
      mechanic_fragile_desc: "Ancient stones in the water basin that carry the robot only once.",
      mechanic_fragile_rule1: "<strong>Single Crossing:</strong> As soon as the robot leaves the stepping stone, it sinks into the water.",
      mechanic_fragile_rule2: "<strong>No Turning Back:</strong> Plan your route so you never step on a fragile stone twice.",
      mechanic_block_title: "New Mechanic",
      mechanic_block_sub: "Holy Stone Blocks (Ishi-Koma)",
      mechanic_block_desc: "Push heavy basalt blocks to open new paths or bridge water trenches.",
      mechanic_block_rule1: "<strong>Push Forward:</strong> Standing directly in front of a block and moving forward pushes it one tile ahead.",
      mechanic_block_rule2: "<strong>Bridges in Water:</strong> Pushing a block into water causes it to sink and create a sturdy new bridge!",
      mechanic_switch_title: "New Shrine Mechanic",
      mechanic_switch_sub: "Floor Switches & Shrine Gates",
      mechanic_switch_desc: "Secret paths are sealed by color-coded floor switches and magical gates.",
      mechanic_switch_rule1: "<strong>✦ Action on Switch:</strong> Stand directly on the switch and use the purple ✦ command.",
      mechanic_switch_rule2: "<strong>Permanently Open:</strong> Once triggered, the Torii gate barrier opens forever.",
      mechanic_dismiss_btn: "Understood, Enter Shrine",

      // Help Modal
      help_title: "How to Play",
      help_goal_title: "The Objective",
      help_goal_desc: "Program your Shinto messenger KOMA to safely deliver the sacred offering to the shrine Torii.",
      help_rules_title: "The Rules",
      help_rule_step: "Every step counts: Plan your command sequence in advance.",
      help_rule_credits: "Camera credits: Each camera rotation costs 1 credit. Keep them all for 3 stars!",
      help_rule_fail: "No crashes: Avoid hitting stone walls and do not fall into the water."
    }
  };

  // Chapter and Level Translations
  const CHAPTERS_EN = {
    "Kapitel 01 · Laternenviertel": "Chapter 01 · Lantern Quarter",
    "Kapitel 02 · Alter Schrein": "Chapter 02 · Ancient Shrine",
    "Kapitel 03 · Bambusgarten": "Chapter 03 · Bamboo Garden",
    "Kapitel 04 · Schreinbrücken": "Chapter 04 · Shrine Bridges",
    "Kapitel 05 · Heilige Wasserbecken": "Chapter 05 · Sacred Water Basins",
    "Kapitel 06 · Der Heilige Berg Fuji": "Chapter 06 · Sacred Mount Fuji",
    "Kapitel 6: Der Heilige Berg Fuji geladen!": "Chapter 6: Sacred Mount Fuji loaded!",
    "Laternenviertel": "Lantern Quarter",
    "Alter Schrein": "Ancient Shrine",
    "Bambusgarten": "Bamboo Garden",
    "Schreinbrücken": "Shrine Bridges",
    "Heilige Wasserbecken": "Sacred Water Basins",
    "Der Heilige Berg Fuji": "Sacred Mount Fuji"
  };

  const ACHIEVEMENTS_EN = {
    camera_monk: {
      name: "Camera Monk",
      desc: "Complete 10 levels with full 3 stars (no camera rotations)."
    },
    spirit_friend: {
      name: "Spirit Friend",
      desc: "Collect 50 spirit lights (orbs) across the shrine gardens."
    },
    wind_master: {
      name: "Master of the Wind",
      desc: "Get carried by sacred mountain wind gusts 25 times."
    },
    fuji_climber: {
      name: "Fuji Mountaineer",
      desc: "Ascend all 10 stations of Sacred Mount Fuji (Chapter 6)."
    },
    ryujin_slayer: {
      name: "Dragon Redeemer",
      desc: "Break all 3 Magatama seals and defeat Ryūjin in Level 60."
    },
    minimalist: {
      name: "Minimalist",
      desc: "Clear 5 levels with the perfect minimum number of commands."
    }
  };

  const SKINS_EN = {
    original: {
      subtitle: "Original · Shinto Messenger",
      desc: "The classic white Shinto shrine chassis with glowing cyan visor eyes and natural wooden Furoshiki pack.",
      tag: "Standard"
    },
    sakura: {
      subtitle: "Cherry Blossom Fox · Spirit of Spring",
      desc: "Blessed by spring shrines. Soft cherry blossom pink, golden eyes, secondary fox ears, and floating sakura petals.",
      tag: "15 Stars"
    },
    cyber: {
      subtitle: "Akihabara Cyber · Neon Courier",
      desc: "Upgraded in the neon alleys of Shinjuku. Deep black carbon chassis with pulsing magenta & cyan circuits and holo glitches.",
      tag: "35 Stars"
    },
    kitsune_gold: {
      subtitle: "Golden Shrine Guardian · Divine Kitsune",
      desc: "Consecrated by priests. Shimmering 24k gold leaf, sacred crimson tassels, and radiant solar aura.",
      tag: "60 Stars"
    },
    zen_stone: {
      subtitle: "Kyoto Rock Garden · Moss & Granite",
      desc: "Carved from sacred granite and overgrown with ancient moss. Emits subtle zen waterdrop ripples.",
      tag: "90 Stars"
    },
    celestial_dragon: {
      subtitle: "Avatar of Mount Fuji · Dragon of the Summit",
      desc: "Forged from the tears of dragon Ryūjin. Frost-blue crystalline armor with eternal snow glow. Unlocked by conquering Level 60.",
      tag: "Boss Slayer"
    }
  };

  const BLESSINGS_EN = {
    heal_lantern: {
      name: "Sacred Shrine Flame",
      desc: "Relights 1 extinguished lantern (up to max 3 lives)."
    },
    spirit_amulet: {
      name: "Kitsune Protection Amulet",
      desc: "The amulet shatters on the next mistake, saving a lantern."
    },
    expand_queue: {
      name: "Scroll of Foresight",
      desc: "+3 additional command slots for the remainder of the run."
    },
    camera_insight: {
      name: "Kitsune Vision",
      desc: "+2 free camera rotations on every upcoming floor."
    },
    celestial_favour: {
      name: "Celestial Favor",
      desc: "+500 heavenly bonus points toward your tower ranking."
    }
  };

  const LEVELS_EN = {
    "Die erste Lieferung": { name: "The First Delivery", desc: "First drive straight through the alley, then turn south toward the package. Reach the goal in six commands." },
    "Um die Ecke": { name: "Around the Corner" },
    "Das Tor des Schreins": { name: "The Shrine Gate" },
    "Der brüchige Steg": { name: "The Fragile Stepping Stones" },
    "Der heilige Felsblock": { name: "The Sacred Stone Block" },
    "Laternenlicht": { name: "Lantern Light" },
    "Der richtige Moment": { name: "The Right Moment" },
    "Der Teich der zwei Pfade": { name: "Pond of Two Paths" },
    "Fast am Ziel": { name: "Almost There" },
    "Die letzte Lieferung": { name: "The Final Delivery" },
    "Zwei Lichter": { name: "Two Spirit Lights" },
    "Gegensätze": { name: "Opposites" },
    "Die zwei Wächterfelsen": { name: "The Two Guardian Rocks" },
    "Spiegelgarten": { name: "Mirror Garden" },
    "Kreuzende Pfade": { name: "Crossing Paths" },
    "Laternenparade": { name: "Lantern Parade" },
    "Farben der Nacht": { name: "Colors of the Night" },
    "Das Zwillings-Tor": { name: "The Twin Gates" },
    "Das Portal des Fuchses": { name: "The Fox Portal" },
    "Über Mauer & Lotusteich": { name: "Over Wall & Lotus Pond" },
    "Schritt ins Blaue": { name: "Step into the Blue" },
    "Dimensions-Sprung": { name: "Dimensional Leap" },
    "Raumkrümmung": { name: "Spatial Warp" },
    "Der verschlungene Hof": { name: "The Winding Courtyard" },
    "Kitsunes Irrgarten": { name: "Kitsune's Labyrinth" },
    "Sprung ins Torii": { name: "Leap into the Torii" },
    "Das verlorene Licht": { name: "The Lost Spirit Light" },
    "Zwei Opfergaben": { name: "Two Sacred Offerings" },
    "Schrein der Ahnen": { name: "Shrine of the Ancestors" },
    "Glühwürmchen-Garten": { name: "Firefly Garden" },
    "Das heilige Becken": { name: "The Sacred Basin" },
    "Geisterpfad": { name: "Spirit Trail" },
    "Der stille Bambus": { name: "Silent Bamboo" },
    "Laternenfest": { name: "Festival of Lanterns" },
    "Die Himmelsbrücke": { name: "The Celestial Bridge" },
    "Triade der Geister": { name: "Triad of Spirits" },
    "Goldener Sonnenaufgang": { name: "Golden Sunrise" },
    "Die drei Siegel": { name: "The Three Seals" },
    "Brücke der drei Winde": { name: "Bridge of Three Winds" },
    "Prüfung der Elemente": { name: "Trial of the Elements" },
    "Himmlisches Palais": { name: "Celestial Palace" },
    "Der Aufstieg": { name: "The Ascent" },
    "Das Smaragd-Tor": { name: "The Emerald Gate" },
    "Quad-Siegel": { name: "Quad Seals" },
    "Großes Schrein-Labyrinth": { name: "Grand Shrine Labyrinth" },
    "Kitsunes Meisterstück": { name: "Kitsune's Masterpiece" },
    "Weg der Erleuchtung": { name: "Path of Enlightenment" },
    "Tempel der Ewigkeit": { name: "Temple of Eternity" },
    "Das letzte Orakel": { name: "The Final Oracle" },
    "Die Legende von KOMA": { name: "The Legend of KOMA" },
    "Der erste Bergwind": { name: "First Mountain Wind" },
    "Die gefrorene Schlucht": { name: "The Frozen Gorge" },
    "Das eisige Kitsune-Portal": { name: "Icy Kitsune Portal" },
    "Schneeverwehte Pfade": { name: "Snowdrift Paths" },
    "Kreuzende Böen": { name: "Crosswinds" },
    "Aufstieg zur 8. Station": { name: "Ascent to the 8th Station" },
    "Wirbelsturm der vier Winde": { name: "Whirlwind of Four Winds" },
    "Gegenstrom im Eiskanal": { name: "Upstream in the Ice Channel" },
    "Das verborgene Eistor": { name: "The Hidden Ice Gate" },
    "Der Geist des Fuji (富士の神)": { name: "Spirit of Mount Fuji (富士の神)" }
  };

  class I18nManager {
    constructor() {
      this.currentLang = "de";
      this.listeners = [];
      this.detectLanguage();
    }

    detectLanguage(forcedLocale) {
      if (forcedLocale) {
        return forcedLocale.toLowerCase().startsWith("de") ? "de" : "en";
      }
      if (typeof window === "undefined") return "de";

      // 1. Saved preference in localStorage
      try {
        const saved = localStorage.getItem("spirit_language");
        if (saved === "de" || saved === "en") {
          this.currentLang = saved;
          return saved;
        }
      } catch (e) {}

      // 2. Playwright test default preservation
      if (typeof navigator !== "undefined" && navigator.webdriver) {
        this.currentLang = "de";
        return "de";
      }

      // 3. System browser / device language
      const sysLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
      this.currentLang = sysLang.startsWith("de") ? "de" : "en";
      return this.currentLang;
    }

    getLanguage() {
      return this.currentLang;
    }

    setLanguage(lang) {
      if (lang !== "de" && lang !== "en") return;
      this.currentLang = lang;
      try {
        localStorage.setItem("spirit_language", lang);
      } catch (e) {}

      // Update HTML lang attribute
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.lang = lang;
      }

      this.updateDOM();
      this.notifyListeners();
    }

    t(key, params = {}) {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.de;
      let text = dict[key] || TRANSLATIONS.de[key] || key;

      if (params && typeof params === "object") {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        }
      }
      return text;
    }

    onChange(callback) {
      if (typeof callback === "function") {
        this.listeners.push(callback);
      }
    }

    notifyListeners() {
      this.listeners.forEach(cb => {
        try { cb(this.currentLang); } catch (e) { console.error(e); }
      });
    }

    translateLevel(lvl, idx) {
      if (!lvl) return lvl;
      if (this.currentLang === "de") return lvl;

      const translated = Object.assign({}, lvl);
      // Translate Name & Description
      if (LEVELS_EN[lvl.n]) {
        translated.n = LEVELS_EN[lvl.n].name || lvl.n;
        if (LEVELS_EN[lvl.n].desc) translated.d = LEVELS_EN[lvl.n].desc;
      }

      // Translate Chapter
      if (CHAPTERS_EN[lvl.c]) {
        translated.c = CHAPTERS_EN[lvl.c];
      } else if (typeof lvl.c === "string") {
        translated.c = lvl.c.replace("Kapitel", "Chapter");
      }

      // Translate Tag
      if (lvl.t === "Tutorial") translated.t = "Tutorial";
      else if (lvl.t === "Schalter") translated.t = "Switches";
      else if (lvl.t === "Weg finden") translated.t = "Pathfinding";
      else if (lvl.t === "Planen") translated.t = "Planning";
      else if (lvl.t === "Kombination") translated.t = "Combination";
      else if (lvl.t === "Trittsteine") translated.t = "Stepping Stones";
      else if (lvl.t === "Blöcke") translated.t = "Blocks";
      else if (lvl.t === "Berg Fuji") translated.t = "Mount Fuji";
      else if (lvl.t === "Endgegner") translated.t = "Boss Fight";

      return translated;
    }

    getAchievement(id, orig) {
      if (this.currentLang === "en" && ACHIEVEMENTS_EN[id]) {
        return Object.assign({}, orig, ACHIEVEMENTS_EN[id]);
      }
      return orig;
    }

    getSkin(id, orig) {
      if (this.currentLang === "en" && SKINS_EN[id]) {
        return Object.assign({}, orig, SKINS_EN[id]);
      }
      return orig;
    }

    getBlessing(id, orig) {
      if (this.currentLang === "en" && BLESSINGS_EN[id]) {
        return Object.assign({}, orig, BLESSINGS_EN[id]);
      }
      return orig;
    }

    updateDOM() {
      if (typeof document === "undefined") return;

      // Update all elements with data-i18n
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (key) {
          el.innerHTML = this.t(key);
        }
      });

      // Update elements with data-i18n-title
      document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.getAttribute("data-i18n-title");
        if (key) {
          el.setAttribute("title", this.t(key));
        }
      });

      // Update elements with data-i18n-placeholder
      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key) {
          el.setAttribute("placeholder", this.t(key));
        }
      });

      // Update command button titles
      const cmdTitles = {
        F: this.currentLang === "en" ? "Move Forward (W / Up Arrow)" : "Vorwärts bewegen (W / Pfeiltaste Hoch)",
        L: this.currentLang === "en" ? "Turn Left 90° (A / Left Arrow)" : "90° nach links drehen (A / Pfeiltaste Links)",
        R: this.currentLang === "en" ? "Turn Right 90° (D / Right Arrow)" : "90° nach rechts drehen (D / Pfeiltaste Rechts)",
        A: this.currentLang === "en" ? "Action / Activate Switch (Space / Enter)" : "Aktion / Schalter auslösen (Leertaste / Enter)"
      };
      document.querySelectorAll("[data-cmd]").forEach(btn => {
        const cmd = btn.getAttribute("data-cmd");
        if (cmdTitles[cmd]) {
          btn.setAttribute("title", cmdTitles[cmd]);
        }
      });

      // Synchronize language buttons state
      document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
        const lang = btn.getAttribute("data-lang");
        btn.classList.toggle("active", lang === this.currentLang);
      });
    }
  }

  global.I18N = new I18nManager();

})(typeof window !== "undefined" ? window : globalThis);
