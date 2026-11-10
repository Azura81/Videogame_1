/**
 * Spirit Delivery - Internationalization (i18n) Engine
 * Bilingual support (German & English) with automatic system language detection,
 * real-time DOM translation, and dynamic in-game feedback localization.
 */

(function(global) {
  "use strict";

  const TRANSLATIONS = {
    de: {
      // General
      app_title: "Spirit Delivery",
      app_tagline: "Zen-Logikrätsel im Shinto-Schrein",
      lang_de: "DE · Deutsch",
      lang_en: "EN · English",
      pwa_offline: "Offline-Modus aktiv · Bereit zum Spielen",

      // Top Header & Nav
      header_level: "Level",
      header_credits: "Credits",
      header_stars: "Sterne",
      header_stars_title: "Insgesamt gesammelte Sterne für Kami-Skins",
      header_tower_best: "Ebene {floor}",
      btn_wardrobe_title: "Schrein-Garderobe & Kami-Skins",
      btn_trophies_title: "Schrein-Siegel & Trophäen",
      btn_help_title: "Spielanleitung & Zen-Tipps",
      btn_home_title: "Hauptmenü / Startbildschirm",
      btn_tower_title: "Turm der 100 Prüfungen (Roguelike)",
      btn_daily_title: "Tägliche Schreinprüfung (Blind-Modus)",
      btn_music_toggle: "Musik an/aus",
      btn_sound_toggle: "Sound an/aus",
      btn_lang_title: "Sprache wechseln / Switch Language",
      btn_levels_title: "Levelauswahl",
      btn_cam_left_title: "Kamera 45° nach links schwenken (-1 Credit)",
      btn_cam_reset_title: "Kamera zentrieren",
      btn_cam_right_title: "Kamera 45° nach rechts schwenken (-1 Credit)",
      btn_mobile_hub_title: "Schrein-Menü, Garderobe & Levelauswahl öffnen",
      nav_menu: "Menü",
      nav_daily: "Tages-Prüfung",
      nav_tower: "Turm",

      // Homescreen
      home_kicker: "TORII DER 1000 SCHREINE",
      home_campaign_title: "Schrein-Pfad",
      home_campaign_badge: "100 Level",
      home_campaign_desc: "Reise durch 10 heilige Kapitel vom Laternenviertel bis zum Ewigen Heiligtum.",
      home_tower_title: "Turm der 100 Prüfungen",
      home_tower_badge: "Roguelike",
      home_tower_desc: "100 zufällige Schrein-Ebenen, 3 Laternen-Leben & heilige Altäre.",
      home_daily_title: "Tägliche Prüfung",
      home_daily_badge: "Blind-Challenge",
      home_daily_desc: "Jeden Tag ein neues Rätsel ohne Kameraschwenker. Halte deine Streak!",
      home_play_btn: "SPIELEN",
      home_resume_btn: "FORTSETZEN",
      home_wardrobe_btn: "Garderobe & Skins",
      home_trophies_btn: "Schrein-Siegel",
      home_chapters_btn: "Levels",
      home_help_btn: "Spielanleitung",
      home_story_btn: "Spielprinzip",
      home_story_title: "Spielprinzip & Anleitung",
      widget_daily: "TÄGLICH",
      widget_wardrobe: "GARDEROBE",
      stars_pill_title: "Gesammelte Sterne für Kami-Skins",
      mode_dropdown_title: "Spielmodus wählen",
      mode_campaign: "Kampagne",
      mode_campaign_sub: "100 Level Progression",
      mode_tower: "100-Level-Schreinprüfung",
      mode_daily: "Tägliche Prüfung",

      // Commands & Deck
      commands_title: "Befehle",
      sequence_title: "Befehlsfolge",
      cmd_forward: "Vorwärts",
      cmd_left: "Links",
      cmd_right: "Rechts",
      cmd_action: "Aktion",
      cmd_play: "Plan abspielen",
      cmd_step: "Schritt",
      cmd_abort: "Abbrechen",
      cmd_stop: "Stopp",
      cmd_undo: "Rückgängig",
      cmd_clear: "Löschen",
      cmd_reset: "Zurücksetzen",
      cmd_swivel_left: "Kamera links",
      cmd_swivel_right: "Kamera rechts",
      cmd_swivel_reset: "Kamera zentrieren",
      empty_queue_hint: "Dein Plan erscheint hier …",
      btn_reset_title: "Roboter zurück an den Start setzen",
      btn_undo_title: "Letzten Befehl entfernen",
      btn_clear_title: "Ganzen Plan löschen",
      btn_play_title: "Plan abspielen (Leertaste)",
      btn_step_title: "Einzelschritt ausführen (Taste S)",
      btn_speed_title: "Geschwindigkeit umschalten (1x / 2x)",
      queue_edit_hint_replace: "Tippe Befehl zum Ersetzen",
      queue_edit_hint_insert: "Tippe Befehl zum Einfügen davor",
      queue_insert_before: "Davor",
      queue_delete_step: "Löschen",
      btn_queue_insert_title: "Neuen Befehl vor diesem Schritt einfügen",
      btn_queue_left_title: "Schritt nach links verschieben",
      btn_queue_right_title: "Schritt nach rechts verschieben",
      btn_queue_delete_title: "Diesen Schritt löschen",
      mobile_exec_text: "Lieferung läuft …",
      credit_card_title: "Kamera-Credits (Jeder Schwenk kostet 1 Credit)",
      status_ready: "Bereit",

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
      feedback_fail_water: "Platsch! Der Roboter ist ins Wasser gefallen – passe deinen Plan an.",
      feedback_fail_incomplete: "Plan beendet. Das Ziel wurde noch nicht erreicht – passe deinen Plan an.",
      feedback_switch_active: "✦ {color}-Schalter aktiviert! Das zugehörige Tor öffnet sich.",
      feedback_switch_none: "Hier gibt es keinen Schalter zum Aktivieren.",
      feedback_block_pushed: "Rumpel! Der Roboter schiebt den heiligen Steinblock vor sich her.",
      feedback_block_bridge: "Platsch! Der Felsblock versinkt im Wasser und bildet eine neue Trittstein-Brücke!",
      feedback_block_stuck: "Der heilige Felsblock ist blockiert und lässt sich nicht weiterschieben!",
      feedback_fragile_crack: "Knacks! Der morsche Trittstein bekommt Risse und versinkt gleich!",
      feedback_orb_collected: "Geisterlicht eingesammelt! ({current} / {total})",
      feedback_portal_entered: "Kitsune-Portal betreten! Der Roboter beamt sich ans Ziel-Portal.",
      feedback_wind_gust: "Eine kräftige Bergwindböe trägt den Roboter mit sich!",
      feedback_camera_credit: "Kamera geschwenkt (-1 Credit, noch {remaining} übrig).",
      feedback_camera_empty: "Kamera-Credits aufgebraucht (0 Sterne möglich – Level kann trotzdem abgeschlossen werden).",
      tutorial_hint: "Tipp: Drücke auf „Vorwärts ↑“, um Befehle in deinen Plan einzufügen.",

      // Level Drawer
      drawer_title: "Levelauswahl",
      fuji_shortcut_title: "Kapitel 6: Der Heilige Berg Fuji",
      fuji_shortcut_sub: "Level 51–60 · Schneelandschaft & Windböen",
      tab_all: "Alle (100)",
      tab_ch1: "Kap. 1",
      tab_ch2: "Kap. 2",
      tab_ch3: "Kap. 3",
      tab_ch4: "Kap. 4",
      tab_ch5: "Kap. 5",
      tab_ch6: "Kap. 6",
      tab_ch7: "Kap. 7",
      tab_ch8: "Kap. 8",
      tab_ch9: "Kap. 9",
      tab_ch10: "Kap. 10",

      // Win Modal
      win_title_normal: "Lieferung erfolgreich!",
      win_title_boss: "「富士の龍神」 BEZWUNGEN!",
      win_title_komainu: "「岩狛犬」 BEZWUNGEN!",
      win_title_daily: "Tägliche Schreinprüfung gemeistert!",
      win_default_text: "Das Paket wurde sicher abgeliefert!",
      win_desc_normal: "Der kleine Roboter hat das Paket in {steps} Schritten zugestellt.",
      win_desc_boss: "Du hast alle 3 Relikte geborgen, das Torii des Gipfels versöhnt und den Drachen Ryūjin in {steps} Schritten erlöst!",
      win_desc_komainu: "Du hast den steinernen Schreinwächter eingesperrt, beide Relikte geborgen und das Bambus-Tor in {steps} Schritten erreicht!",
      win_desc_daily: "Du hast die heutige Meisterprüfung ohne Kameraschwenker in {steps} Schritten gelöst!",
      win_credits_normal: "Übrige Kamera-Credits: {credits} / {max}",
      win_credits_zero: "0 Kameraschwenker verwendet · Reine Vorab-Planung!",
      btn_next_level: "Nächstes Level →",
      btn_replay_first: "Erstes Level erneut spielen",
      btn_replay: "Noch einmal",
      btn_hub: "Schrein-Hub",

      // Mobile Shrine Hub
      mobile_hub_title: "Spirit Schrein-Hub",
      mobile_hub_sub: "Garderobe · 100 Level · Erfolge",
      hub_tab_wardrobe: "Garderobe",
      hub_tab_levels: "100 Level",
      hub_tab_trophies: "Erfolge",
      hub_tab_settings: "Optionen",
      btn_check: "Prüfen →",
      btn_ascend: "Besteigen →",

      // Boss & Tower HUD
      boss_seals_title: "3 Heilige Relikt-Siegel",
      boss_seal1_title: "Relikt 1: Eisschwert",
      boss_seal2_title: "Relikt 2: Himmelsspiegel",
      boss_seal3_title: "Relikt 3: Magatama-Juwel",
      boss_phase_frost: "Frost-Odem aktiv",
      tower_floor_title: "EBENE {floor}",
      tower_hud_floor: "Ebene {floor}",
      tower_hud_lanterns_title: "3 Spirit-Laternen (Leben)",
      tower_hud_amulet_title: "Kitsune-Schutzamulett aktiv",
      tower_amulet_label: "Amulett",
      tower_hud_zen_title: "Zen-Perfektion (Minimalzüge)",
      tower_feedback_loaded: "Turm-Ebene {floor} geladen! Plane den Weg zum heiligen Schrein-Torii.",

      // Tower Mode Dialogs
      tower_intro_title: "Turm der 100 Prüfungen",
      tower_intro_desc: "Beweise deine Weisheit im heiligen Pagodenturm. 100 prozedurale Schrein-Ebenen mit steigender Komplexität.",
      tower_stat_best_floor: "Persönlicher Rekord",
      tower_stat_best_score: "Bester Score",
      tower_rule_1: "Du startest mit 3 heiligen Laternen (3 Leben).",
      tower_rule_2: "Jede 5. Ebene wartet ein Altar der Kami mit wählbaren Segnungen.",
      tower_rule_3: "Erreiche Ebene 100, um den höchsten Schrein-Rang zu erlangen.",
      tower_rule_lives_title: "3 Spirit-Laternen (Leben):",
      tower_rule_lives_desc: "Jeder Fehler (Kollision, geschlossenes Tor, verpasstes Relikt) löscht 1 Laterne. Bei 0 Laternen bricht die Prüfung ab!",
      tower_rule_scaling_title: "100 Aufsteigende Etagen:",
      tower_rule_scaling_desc: "Jede Ebene steigert sich prozedural in Größe und Komplexität mit Schaltern, Portalen und Windböen.",
      tower_rule_altar_title: "Altar der Segnungen (alle 5 Etagen):",
      tower_rule_altar_desc: "Meistere die Große Schrein-Pforte, um geheiligte Gaben zu erhalten: Heile Laternen, erweitere Befehls-Slots oder erhalte Schutz-Amulette.",
      tower_rule_zen_title: "Zen-Effizienz (Minimalzüge):",
      tower_rule_zen_desc: "Schließe Ebenen mit der perfekten Mindestschrittzahl ab für den <strong>Zen-Bonus (+50% Punkte)</strong> oder nah am Minimum für <strong>+25% Punkte</strong>!",
      tower_btn_start: "Aufstieg beginnen (Ebene 1)",
      tower_btn_start_run: "Aufstieg beginnen",
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
      wardrobe_title: "Kami-Skins Garderobe",
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
      trophies_title: "Heilige Siegel & Erfolge",
      trophies_desc: "Meistere besondere Prüfungen in den 6 Kapiteln, um uralte Schrein-Siegel zu erwecken.",
      trophies_summary_title: "Heilige Schrein-Siegel",
      trophies_summary_sub: "von 7 Errungenschaften gemeistert",

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
      settings_zen_body: "• Halte alle <strong>Kamera-Credits</strong> zurück, um die volle 3-Sterne-Wertung zu erhalten.<br>• Plane vorab den Weg durch Tore und aktiviere Schalter mit <strong>✦ Aktion</strong>.<br>• Auf dem <strong>Berg Fuji</strong> tragen dich Windböen automatisch in Pfeilrichtung weiter!",
      settings_resume_btn: "Zurück zum Spiel",

      // Help Modal
      help_header_kicker: "Spirit Delivery · Spielanleitung",
      help_header_title: "Spielprinzip &amp; Anleitung",
      help_tab_story: "Story &amp; Ziel",
      help_tab_controls: "Steuerung",
      help_tab_obstacles: "Hindernisse",
      help_tab_stars: "Sterne",
      help_story_mission_title: "Der kleine Roboter auf Mission",
      help_story_mission_desc: "Du begleitest einen kleinen Roboter auf seinem Weg durch verwunschene Gärten. Seine Aufgabe ist es, Pakete einzusammeln und sicher zu den Schreintoren zu transportieren.",
      help_story_fuji_title: "Der Pfad hinauf zum Berg Fuji",
      help_story_fuji_desc: "Mit jedem gemeisterten Rätsel reist der kleine Roboter weiter bergauf durch verschiedene Abschnitte bis zur verschneiten Bergspitze des Fuji.",
      help_story_dragon_title: "Der Eisdrache auf dem Gipfel",
      help_story_dragon_desc: "Oben auf dem frostigen Kraterplateau bewacht der Eisdrache den Schrein. Schiebe Felsen in seinen kalten Windatem, weiche geschickt aus und bringe alle drei Relikte sicher ans Ziel, um ihn zu bezwingen.",
      help_ctrl_plan_title: "Vorausplanung",
      help_ctrl_plan_desc: "Der kleine Roboter fährt erst los, wenn du deinen Plan abspielst. Lege die einzelnen Schritte in Ruhe fest und starte dann die Bewegung.",
      help_ctrl_forward: "Vorwärts",
      help_ctrl_forward_desc: "Fährt ein Feld in Blickrichtung geradeaus.",
      help_ctrl_left: "Links drehen",
      help_ctrl_left_desc: "Dreht den Roboter um 90 Grad nach links auf der Stelle.",
      help_ctrl_right: "Rechts drehen",
      help_ctrl_right_desc: "Dreht den Roboter um 90 Grad nach rechts auf der Stelle.",
      help_ctrl_action: "Aktion",
      help_ctrl_action_desc: "Aktiviert Schalter, öffnet Tore, schiebt Felsen oder sammelt Relikte ein.",
      help_ctrl_cam_title: "Planung und Kamera",
      help_ctrl_cam_list: "<li><strong>Plan abspielen</strong> – Startet die programmierte Fahrt.</li><li><strong>Rückgängig</strong> – Entfernt den letzten Befehl aus der Reihe.</li><li><strong>Zurücksetzen</strong> – Leert den Plan und setzt den Roboter an den Anfang.</li><li><strong>Kamera drehen</strong> – Mit dem Finger oder den Drehtasten das Spielfeld aus jedem Winkel ansehen.</li>",
      help_obs_walls: "Zäune und Mauern",
      help_obs_walls_desc: "Feste Hindernisse, an denen der Roboter stoppt. Du musst deinen Pfad außen herum planen.",
      help_obs_switches: "Schalter und Tore",
      help_obs_switches_desc: "Verschlossene Tore versperren den Weg. Fahre auf den Schalter und drücke Aktion, um das Tor zu öffnen.",
      help_obs_blocks: "Felsblöcke",
      help_obs_blocks_desc: "Mit der Aktion-Taste schiebt der Roboter schwere Steine vor sich her, um Wege freizuräumen oder Gefahren abzuschirmen.",
      help_obs_fragile: "Brüchiges Eis & Trittsteine",
      help_obs_fragile_desc: "Diese Felder halten den Roboter nur ein einziges Mal. Sobald du das Feld verlässt, bricht das Eis ein.",
      help_obs_wind: "Windböen",
      help_obs_wind_desc: "Starke alpine Winde tragen den Roboter automatisch in Pfeilrichtung mit und sparen Schritte.",
      help_obs_water: "Wasser und Abgründe",
      help_obs_water_desc: "Der kleine Roboter kann nicht schwimmen. Wenn er ins Wasser fällt oder die Kante herabfährt, startet das Level neu.",
      help_obs_dragon: "Der Eisdrache auf dem Gipfel",
      help_obs_dragon_desc: "Der Drache fegt in regelmäßigen Abständen mit kaltem Atem über das Feld. Nutze Felsblöcke als Deckung und bewege dich im richtigen Moment vorwärts.",
      help_stars_title: "Kamera-Credits und Sterne",
      help_stars_desc: "In jedem Level hast du eine bestimmte Anzahl an Credits zum Drehen der Kamera.",
      help_stars_3: "<strong>3 Sterne</strong> – Alle Kamera-Credits behalten und das Level direkt gelöst",
      help_stars_2: "<strong>2 Sterne</strong> – Höchstens die Hälfte der Kamera-Credits genutzt",
      help_stars_1: "<strong>1 Stern</strong> – Das Level erfolgreich abgeschlossen",
      help_stars_wardrobe_title: "Garderobe und Skins",
      help_stars_wardrobe_desc: "Mit den gesammelten Sternen schaltest du in der Garderobe neue Skins für den kleinen Roboter frei.",
      btn_understood: "Verstanden",
      privacy_imprint: "Datenschutz & Impressum ↗",

      // Daily Modal
      daily_kicker: "Tägliche Schreinprüfung",
      daily_modal_title: "Tages-Herausforderung",
      daily_week_title: "Wochen-Stempelkarte",
      daily_rule_0cam_title: "0 Kameraschwenker:",
      daily_rule_0cam_desc: "Blickwinkel fest fixiert. Du musst die gesamte Route aus der Schrein-Perspektive vorausplanen!",
      daily_rule_hardcore_title: "Hardcore-Prüfung:",
      daily_rule_hardcore_desc: "Täglich wechselnde Schrein-Layouts mit Windböen, Toren, Portalen und Relikten.",
      daily_rule_streak_title: "Tages-Streak:",
      daily_rule_streak_desc: "Ein Sieg heute erhöht deine Flammen-Streak um +1 Tag.",
      btn_start_daily: "Prüfung antreten",

      // Extra Modals
      tower_kicker: "Endlos-Roguelike · 百人鳥居",
      tower_altar_kicker: "Große Schrein-Pforte gemeistert!",
      mechanic_kicker: "Schrein-Geheimnis",
      mechanic_btn_understood: "Verstanden · Schrein betreten",
      ad_pill: "WERBUNG"
    },

    en: {
      // General
      app_title: "Spirit Delivery",
      app_tagline: "Zen Logic Puzzles in a Shinto Shrine",
      lang_de: "DE · Deutsch",
      lang_en: "EN · English",
      pwa_offline: "Offline mode active · Ready to play",

      // Top Header & Nav
      header_level: "Level",
      header_credits: "Credits",
      header_stars: "Stars",
      header_stars_title: "Total collected stars for Kami skins",
      header_tower_best: "Floor {floor}",
      btn_wardrobe_title: "Shrine Wardrobe & Kami Skins",
      btn_trophies_title: "Shrine Seals & Trophies",
      btn_help_title: "How to Play & Zen Tips",
      btn_home_title: "Main Menu / Home Screen",
      btn_tower_title: "Tower of 100 Trials (Roguelike)",
      btn_daily_title: "Daily Shrine Trial (Blind Mode)",
      btn_music_toggle: "Music on/off",
      btn_sound_toggle: "Sound on/off",
      btn_lang_title: "Switch Language / Sprache wechseln",
      btn_levels_title: "Level Selection",
      btn_cam_left_title: "Rotate camera 45° left (-1 Credit)",
      btn_cam_reset_title: "Reset camera",
      btn_cam_right_title: "Rotate camera 45° right (-1 Credit)",
      btn_mobile_hub_title: "Open Shrine Menu, Wardrobe & Level Selection",
      nav_menu: "Menu",
      nav_daily: "Daily Trial",
      nav_tower: "Tower",

      // Homescreen
      home_kicker: "TORII OF 1000 SHRINES",
      home_campaign_title: "Shrine Path",
      home_campaign_badge: "100 Levels",
      home_campaign_desc: "Journey across 10 sacred chapters from the Lantern Quarter to the Eternal Sanctuary.",
      home_tower_title: "Tower of 100 Trials",
      home_tower_badge: "Roguelike",
      home_tower_desc: "100 procedural shrine floors, 3 lantern lives & divine altars.",
      home_daily_title: "Daily Trial",
      home_daily_badge: "Blind Challenge",
      home_daily_desc: "A new puzzle every day with zero camera credits. Keep your streak!",
      home_play_btn: "PLAY",
      home_resume_btn: "RESUME",
      home_wardrobe_btn: "Wardrobe & Skins",
      home_trophies_btn: "Shrine Seals",
      home_chapters_btn: "Levels",
      home_help_btn: "How to Play",
      home_story_btn: "How to Play",
      home_story_title: "How to Play & Concept",
      widget_daily: "DAILY",
      widget_wardrobe: "WARDROBE",
      stars_pill_title: "Collected stars for Kami skins",
      mode_dropdown_title: "Select game mode",
      mode_campaign: "Campaign",
      mode_campaign_sub: "100 Levels Progression",
      mode_tower: "100-Floor Shrine Trial",
      mode_daily: "Daily Trial",

      // Commands & Deck
      commands_title: "Commands",
      sequence_title: "Command Sequence",
      cmd_forward: "Forward",
      cmd_left: "Turn Left",
      cmd_right: "Turn Right",
      cmd_action: "Action",
      cmd_play: "Run Plan",
      cmd_step: "Step",
      cmd_abort: "Abort",
      cmd_stop: "Stop",
      cmd_undo: "Undo",
      cmd_clear: "Clear",
      cmd_reset: "Reset",
      cmd_swivel_left: "Camera Left",
      cmd_swivel_right: "Camera Right",
      cmd_swivel_reset: "Reset Camera",
      empty_queue_hint: "Your plan appears here …",
      btn_reset_title: "Reset robot to start",
      btn_undo_title: "Remove last command",
      btn_clear_title: "Clear entire plan",
      btn_play_title: "Run plan (Space)",
      btn_step_title: "Execute single step (Key S)",
      btn_speed_title: "Toggle playback speed (1x / 2x)",
      queue_edit_hint_replace: "Tap command to replace",
      queue_edit_hint_insert: "Tap command to insert before",
      queue_insert_before: "Insert",
      queue_delete_step: "Delete",
      btn_queue_insert_title: "Insert new command before this step",
      btn_queue_left_title: "Move step left",
      btn_queue_right_title: "Move step right",
      btn_queue_delete_title: "Delete this step",
      mobile_exec_text: "Delivery in progress …",
      credit_card_title: "Camera credits (Each rotation costs 1 credit)",
      status_ready: "Ready",

      // Feedback & Instructions
      feedback_ready: "Plan your command sequence and press “Run Plan”.",
      feedback_running: "Off we go! The Shinto messenger executes your plan …",
      feedback_empty: "Add at least one command first.",
      feedback_full: "Your plan is full! Remove a command for new steps.",
      feedback_cmd_added: "{cmd} added.",
      feedback_cmd_removed: "Command removed.",
      feedback_plan_cleared: "Plan cleared.",
      feedback_level_reset: "Reset to starting position.",
      feedback_fail_blocked: "Clack! The path is blocked – adjust your plan.",
      feedback_fail_water: "Splash! The robot fell into the water – adjust your plan.",
      feedback_fail_incomplete: "Plan completed, but the goal was not reached – adjust your plan.",
      feedback_switch_active: "✦ {color} switch activated! The corresponding gate opens.",
      feedback_switch_none: "There is no switch to activate here.",
      feedback_block_pushed: "Rumble! The robot pushes the sacred stone block.",
      feedback_block_bridge: "Splash! The stone block sinks into the water, creating a new bridge!",
      feedback_block_stuck: "The stone block is blocked and cannot be pushed further!",
      feedback_fragile_crack: "Crack! The weathered stepping stone breaks and will sink soon!",
      feedback_orb_collected: "Spirit light collected! ({current} / {total})",
      feedback_portal_entered: "Kitsune Portal entered! The robot teleports to the exit portal.",
      feedback_wind_gust: "A powerful mountain wind gust carries the robot forward!",
      feedback_camera_credit: "Camera rotated (-1 credit, {remaining} remaining).",
      feedback_camera_empty: "Camera credits depleted (0 stars possible – level can still be completed).",
      tutorial_hint: "Tip: Tap “Forward ↑” below to insert commands into your plan.",

      // Level Drawer
      drawer_title: "Select Level",
      fuji_shortcut_title: "Chapter 6: Sacred Mount Fuji",
      fuji_shortcut_sub: "Levels 51–60 · Snowscapes & Wind Gusts",
      tab_all: "All (100)",
      tab_ch1: "Ch. 1",
      tab_ch2: "Ch. 2",
      tab_ch3: "Ch. 3",
      tab_ch4: "Ch. 4",
      tab_ch5: "Ch. 5",
      tab_ch6: "Ch. 6",
      tab_ch7: "Ch. 7",
      tab_ch8: "Ch. 8",
      tab_ch9: "Ch. 9",
      tab_ch10: "Ch. 10",

      // Win Modal
      win_title_normal: "Delivery Successful!",
      win_title_boss: "「DRAGON OF FUJI」 DEFEATED!",
      win_title_komainu: "「IWA-KOMAINU」 DEFEATED!",
      win_title_daily: "Daily Shrine Trial Cleared!",
      win_default_text: "The package was safely delivered!",
      win_desc_normal: "The little robot delivered the package in {steps} steps.",
      win_desc_boss: "You recovered all 3 relics, reconciled the summit Torii, and redeemed dragon Ryūjin in {steps} steps!",
      win_desc_komainu: "You trapped the stone guardian, recovered both relics, and reached the bamboo gate in {steps} steps!",
      win_desc_daily: "You solved today's master puzzle with zero camera rotations in {steps} steps!",
      win_credits_normal: "Remaining Camera Credits: {credits} / {max}",
      win_credits_zero: "0 camera rotations used · Pure spatial planning!",
      btn_next_level: "Next Level →",
      btn_replay_first: "Replay First Level",
      btn_replay: "Replay ↺",
      btn_hub: "Shrine Hub",

      // Mobile Shrine Hub
      mobile_hub_title: "Spirit Shrine Hub",
      mobile_hub_sub: "Wardrobe · 100 Levels · Achievements",
      hub_tab_wardrobe: "Wardrobe",
      hub_tab_levels: "100 Levels",
      hub_tab_trophies: "Achievements",
      hub_tab_settings: "Options",
      btn_check: "Check →",
      btn_ascend: "Ascend →",

      // Boss & Tower HUD
      boss_seals_title: "3 Sacred Relic Seals",
      boss_seal1_title: "Relic 1: Ice Sword",
      boss_seal2_title: "Relic 2: Celestial Mirror",
      boss_seal3_title: "Relic 3: Magatama Jewel",
      boss_phase_frost: "Frost Breath active",
      tower_floor_title: "FLOOR {floor}",
      tower_hud_floor: "Floor {floor}",
      tower_hud_lanterns_title: "3 Spirit Lanterns (Lives)",
      tower_hud_amulet_title: "Kitsune Protection Amulet active",
      tower_amulet_label: "Amulet",
      tower_hud_zen_title: "Zen Perfection (Minimum Steps)",
      tower_feedback_loaded: "Tower Floor {floor} loaded! Plan the path to the sacred shrine Torii.",

      // Tower Mode Dialogs
      tower_intro_title: "Tower of 100 Trials",
      tower_intro_desc: "Prove your wisdom in the sacred pagoda tower. 100 procedural shrine floors of scaling complexity.",
      tower_stat_best_floor: "Personal Record",
      tower_stat_best_score: "Best Score",
      tower_rule_1: "You start with 3 sacred lanterns (3 lives).",
      tower_rule_2: "Every 5th floor, an Altar of the Kami offers divine blessings.",
      tower_rule_3: "Reach floor 100 to attain the highest shrine rank.",
      tower_rule_lives_title: "3 Spirit Lanterns (Lives):",
      tower_rule_lives_desc: "Each mistake (collision, closed gate, missed relic) extinguishes 1 lantern. At 0 lanterns, the trial ends!",
      tower_rule_scaling_title: "100 Ascending Floors:",
      tower_rule_scaling_desc: "Each floor scales procedurally in size and complexity with switches, portals, and wind gusts.",
      tower_rule_altar_title: "Altar of Blessings (every 5 floors):",
      tower_rule_altar_desc: "Pass the Great Shrine Gate to receive sacred blessings: heal lanterns, expand command slots, or gain ward amulets.",
      tower_rule_zen_title: "Zen Efficiency (Minimum Steps):",
      tower_rule_zen_desc: "Clear floors with the perfect minimum step count for the <strong>Zen Bonus (+50% score)</strong> or near minimum for <strong>+25% score</strong>!",
      tower_btn_start: "Begin Ascent (Floor 1)",
      tower_btn_start_run: "Begin Ascent",
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
      wardrobe_title: "Kami Skins Wardrobe",
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
      trophies_title: "Sacred Seals & Achievements",
      trophies_desc: "Master special trials across the 6 chapters to awaken ancient shrine seals.",
      trophies_summary_title: "Sacred Shrine Seals",
      trophies_summary_sub: "of 7 achievements mastered",

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
      settings_zen_body: "• Conserve all <strong>camera credits</strong> to achieve the full 3-star rating.<br>• Plan your path through gates in advance and activate switches using <strong>✦ Action</strong>.<br>• On <strong>Mount Fuji</strong>, wind gusts carry you automatically in the arrow's direction!",
      settings_resume_btn: "Return to Game",

      // Help Modal
      help_header_kicker: "Spirit Delivery · How to Play",
      help_header_title: "Game Concept &amp; Instructions",
      help_tab_story: "Story &amp; Goal",
      help_tab_controls: "Controls",
      help_tab_obstacles: "Obstacles",
      help_tab_stars: "Stars",
      help_story_mission_title: "The Little Robot on a Mission",
      help_story_mission_desc: "You accompany a little robot on its journey through enchanted gardens. Its mission is to collect sacred packages and deliver them safely to the shrine gates.",
      help_story_fuji_title: "The Path up Mount Fuji",
      help_story_fuji_desc: "With every mastered puzzle, the little robot journeys further uphill through diverse sanctums to the snow-covered peak of Mount Fuji.",
      help_story_dragon_title: "The Frost Dragon on the Summit",
      help_story_dragon_desc: "High atop the frosty crater plateau, the Frost Dragon guards the shrine. Push boulders into his chilling breath, dodge attacks with agility, and deliver all three relics to redeem him.",
      help_ctrl_plan_title: "Advance Planning",
      help_ctrl_plan_desc: "The little robot only moves once you run your plan. Deliberate each step at your own pace, then trigger the movement.",
      help_ctrl_forward: "Forward",
      help_ctrl_forward_desc: "Moves one tile forward in the robot's facing direction.",
      help_ctrl_left: "Turn Left",
      help_ctrl_left_desc: "Rotates the robot 90 degrees to the left on the spot.",
      help_ctrl_right: "Turn Right",
      help_ctrl_right_desc: "Rotates the robot 90 degrees to the right on the spot.",
      help_ctrl_action: "Action",
      help_ctrl_action_desc: "Activates switches, opens gates, pushes boulders, or collects relics.",
      help_ctrl_cam_title: "Planning and Camera",
      help_ctrl_cam_list: "<li><strong>Run Plan</strong> – Starts the programmed delivery run.</li><li><strong>Undo</strong> – Removes the last command in sequence.</li><li><strong>Reset</strong> – Clears the plan and places the robot at the start.</li><li><strong>Rotate Camera</strong> – Rotate the view with touch or camera buttons to inspect from any angle.</li>",
      help_obs_walls: "Fences and Walls",
      help_obs_walls_desc: "Solid obstacles where the robot halts. You must route your path around them.",
      help_obs_switches: "Switches and Gates",
      help_obs_switches_desc: "Locked gates block your passage. Drive onto the switch and press Action to open the gate.",
      help_obs_blocks: "Stone Blocks",
      help_obs_blocks_desc: "Using the Action command, the robot pushes heavy stones forward to clear pathways or shield against danger.",
      help_obs_fragile: "Fragile Ice & Stepping Stones",
      help_obs_fragile_desc: "These tiles hold the robot only once. As soon as you step off the tile, the ice breaks away.",
      help_obs_wind: "Wind Gusts",
      help_obs_wind_desc: "Strong alpine winds carry the robot automatically in the arrow's direction, saving steps.",
      help_obs_water: "Water and Chasms",
      help_obs_water_desc: "The little robot cannot swim. If it falls into the water or over a ledge, the level resets.",
      help_obs_dragon: "The Frost Dragon on the Summit",
      help_obs_dragon_desc: "The dragon periodically sweeps across the arena with freezing breath. Take cover behind stone blocks and advance at the right moment.",
      help_stars_title: "Camera Credits and Stars",
      help_stars_desc: "In each level, you are granted a set budget of credits to rotate the camera.",
      help_stars_3: "<strong>3 Stars</strong> – Kept all camera credits and solved directly from memory",
      help_stars_2: "<strong>2 Stars</strong> – Used no more than half of the camera credits",
      help_stars_1: "<strong>1 Star</strong> – Successfully completed the level",
      help_stars_wardrobe_title: "Wardrobe and Skins",
      help_stars_wardrobe_desc: "Use the stars you accumulate to unlock new skins for the little robot in the wardrobe.",
      btn_understood: "Understood",
      privacy_imprint: "Privacy & Imprint ↗",

      // Daily Modal
      daily_kicker: "Daily Shrine Trial",
      daily_modal_title: "Daily Challenge",
      daily_week_title: "Weekly Stamp Card",
      daily_rule_0cam_title: "0 Camera Rotations:",
      daily_rule_0cam_desc: "Perspective is locked. You must plan the complete route in advance from shrine view!",
      daily_rule_hardcore_title: "Hardcore Trial:",
      daily_rule_hardcore_desc: "Daily procedural shrine layouts with wind gusts, gates, portals, and relics.",
      daily_rule_streak_title: "Daily Streak:",
      daily_rule_streak_desc: "Winning today increases your flame streak by +1 day.",
      btn_start_daily: "Enter Trial",

      // Extra Modals
      tower_kicker: "Endless Roguelike · Hyakunin Torii",
      tower_altar_kicker: "Grand Shrine Gate Cleared!",
      mechanic_kicker: "Shrine Mystery",
      mechanic_btn_understood: "Understood · Enter Shrine",
      ad_pill: "AD"
    }
  };

  const CHAPTERS_EN = {
    "Kapitel 01 · Laternenviertel": "Chapter 01 · Lantern Quarter",
    "Kapitel 02 · Alter Schrein": "Chapter 02 · Ancient Shrine",
    "Kapitel 03 · Geistergarten": "Chapter 03 · Spirit Garden",
    "Kapitel 03 · Neon-Kyoto": "Chapter 03 · Neon Kyoto",
    "Kapitel 04 · Neon-Kyoto": "Chapter 04 · Neon Kyoto",
    "Kapitel 04 · Kitsune-Garten": "Chapter 04 · Kitsune Garden",
    "Kapitel 05 · Bambuswald": "Chapter 05 · Bamboo Grove",
    "Kapitel 05 · Heilige Wasserbecken": "Chapter 05 · Sacred Water Basins",
    "Kapitel 06 · Himmelsbrücke": "Chapter 06 · Celestial Bridge",
    "Kapitel 07 · Palast der Kami": "Chapter 07 · Palace of the Kami",
    "Kapitel 06 · Der Heilige Berg Fuji (富士山)": "Chapter 06 · Sacred Mount Fuji (富士山)",
    "Kapitel 06 · Der Heilige Berg Fuji": "Chapter 06 · Sacred Mount Fuji",
    "Kapitel 6: Der Heilige Berg Fuji geladen!": "Chapter 6: Sacred Mount Fuji loaded!",
    "Laternenviertel": "Lantern Quarter",
    "Alter Schrein": "Ancient Shrine",
    "Geistergarten": "Spirit Garden",
    "Neon-Kyoto": "Neon Kyoto",
    "Bambusgarten": "Bamboo Garden",
    "Kitsune-Garten": "Kitsune Garden",
    "Bambuswald": "Bamboo Grove",
    "Schreinbrücken": "Shrine Bridges",
    "Heilige Wasserbecken": "Sacred Water Basins",
    "Himmelsbrücke": "Celestial Bridge",
    "Palast der Kami": "Palace of the Kami",
    "Der Heilige Berg Fuji": "Sacred Mount Fuji",
    "Der Heilige Berg Fuji (富士山)": "Sacred Mount Fuji (富士山)"
};

  const TAGS_EN = {
    "Tutorial": "Tutorial",
    "Weg finden": "Pathfinding",
    "Schalter": "Switches",
    "Brüchiges Gestein": "Fragile Ground",
    "Opferblock": "Sacrifice Block",
    "Route lesen": "Route Reading",
    "Reihenfolge": "Sequence",
    "Kombination": "Combination",
    "Knifflig": "Tricky",
    "Finale": "Finale",
    "Dual-Tore": "Dual Gates",
    "Parallele Gassen": "Parallel Alleys",
    "Zwei Felsblöcke": "Two Stone Blocks",
    "Symmetrie": "Symmetry",
    "Kreuzung": "Crossroads",
    "S-Kurven": "S-Curves",
    "Schreingarten": "Shrine Garden",
    "Teleport": "Teleport",
    "Fragile Dimension": "Fragile Dimension",
    "Hin & Zurück": "Roundtrip",
    "Wasser-Inseln": "Water Islands",
    "Portal-Netz": "Portal Network",
    "Portal & Dual-Tore": "Portal & Dual Gates",
    "Labyrinth": "Labyrinth",
    "Bambusteich-Brücke": "Bamboo Pond Bridge",
    "Zwei Lichter": "Two Spirit Lights",
    "Tor & Licht": "Gate & Light",
    "Zwischenboss · Iwa-Komainu": "Mid-Boss · Iwa-Komainu",
    "Lotusteich der Ahnen": "Ancestral Lotus Pond",
    "Portal & Licht": "Portal & Light",
    "Drei Lichter": "Three Spirit Lights",
    "Windüberquerung": "Wind Crossing",
    "Drei Himmelslichter": "Three Sky Lights",
    "Doppelsiegel im Wind": "Double Seal in Wind",
    "Dreifach-Prüfung": "Triple Trial",
    "Dreifach-Windkanal": "Triple Wind Channel",
    "Elemente-Prüfung": "Trial of the Elements",
    "Wolkenportal-Brücke": "Cloud Portal Bridge",
    "Kapitel-Finale · Himmelsbrücke": "Chapter Finale · Celestial Bridge",
    "Smaragd-Hof": "Emerald Court",
    "Vier Götter-Siegel": "Four Divine Seals",
    "Palast-Irrgarten": "Palace Maze",
    "Götter-Portale": "Divine Portals",
    "Pfad der Erleuchtung": "Path of Enlightenment",
    "Halle der Ewigkeit": "Hall of Eternity",
    "Orakel der Götter": "Oracle of the Gods",
    "Kapitel-Finale · Palast der Kami": "Chapter Finale · Palace of the Kami",
    "Windböen": "Wind Gusts",
    "Schlucht-Sprung": "Chasm Leap",
    "Portal-Beschleunigung": "Portal Acceleration",
    "Wind-Umleitung": "Wind Redirection",
    "Kreuzwinde": "Crosswinds",
    "Terrassen-Labyrinth": "Terrace Labyrinth",
    "Wind-Strudel": "Wind Vortex",
    "Dual-Tore & Windkanal": "Dual Gates & Wind Channel",
    "Zwei Tore im Eis": "Two Gates in Ice",
    "Bosskampf · Ryūjin": "Boss Fight · Ryūjin",
    "Planen": "Planning",
    "Trittsteine": "Stepping Stones",
    "Blöcke": "Blocks",
    "Berg Fuji": "Mount Fuji",
    "Endgegner": "Boss Fight"
};

  const ACHIEVEMENTS_EN = {
    "camera_monk": {
        "name": "Camera Monk",
        "desc": "Complete 10 levels with full 3 stars (no camera rotations)."
    },
    "spirit_friend": {
        "name": "Spirit Friend",
        "desc": "Collect 50 spirit lights (orbs) across the shrine gardens."
    },
    "wind_master": {
        "name": "Master of the Wind",
        "desc": "Get carried by sacred mountain wind gusts 25 times."
    },
    "fuji_climber": {
        "name": "Fuji Mountaineer",
        "desc": "Ascend all 10 stations of Sacred Mount Fuji (Chapter 6)."
    },
    "zen_master": {
        "name": "Zen Master",
        "desc": "Unlock all 6 sacred Kami skins in the shrine wardrobe."
    },
    "ryujin_slayer": {
        "name": "Dragon Redeemer",
        "desc": "Break all 3 Magatama seals and defeat Ryūjin in Level 60."
    },
    "minimalist": {
        "name": "Minimalist",
        "desc": "Clear 5 levels with the perfect minimum number of commands."
    },
    "tower_conqueror": {
        "name": "Tower Conqueror",
        "desc": "Conquer all 100 floors in the Tower of 100 Trials."
    }
};

  const SKINS_EN = {
    "original": {
        "subtitle": "Original · Shinto Messenger",
        "desc": "The classic white Shinto shrine chassis with glowing cyan visor eyes and natural wooden Furoshiki pack.",
        "tag": "Standard"
    },
    "sakura": {
        "subtitle": "Cherry Blossom Fox · Spirit of Spring",
        "desc": "Blessed by spring shrines. Soft cherry blossom pink, golden eyes, secondary fox ears, and floating sakura petals.",
        "tag": "15 Stars"
    },
    "cyber": {
        "subtitle": "Akihabara Cyber · Neon Courier",
        "desc": "Upgraded in the neon alleys of Shinjuku. Deep black carbon chassis with pulsing magenta & cyan circuits and holo glitches.",
        "tag": "35 Stars"
    },
    "oni": {
        "subtitle": "Fire Guardian · Volcano Shrine",
        "desc": "Forged by ancient mountain spirits. Traditional Shu-iro vermilion lacquer, curved golden Oni horns, and blazing flame trails.",
        "tag": "65 Stars"
    },
    "shinobi": {
        "subtitle": "Moon Shadow · Astral Kitsune",
        "desc": "A silent shadow beneath the full moon. Deep midnight indigo, silver crescent moon crest, and spectral violet mist trails.",
        "tag": "100 Stars"
    },
    "kami": {
        "subtitle": "Divine Shrine Guardian · Zen Master",
        "desc": "The pinnacle of all deliveries. Mirrored 24k gold chassis, celestial emerald eyes, Torii halo, and shimmering fairy dust.",
        "tag": "135 Stars"
    },
    "ryujin": {
        "subtitle": "Dragon Tamer · Ruler of Fuji",
        "desc": "Bestowed by the liberated Sky Dragon of Mount Fuji. Pearlescent white chassis with imperial dragon horns, floating celestial ribbons, and frost glide.",
        "tag": "Boss Trophy"
    },
    "pagoda": {
        "subtitle": "Emerald Messenger · Sovereign of 100 Floors",
        "desc": "Exclusive garment for conquerors of the Tower of 100 Trials. The classic original chassis in sacred emerald green, crowned by the golden divine halo.",
        "tag": "Tower Trophy"
    }
};

  const BLESSINGS_EN = {
    "heal_lantern": {
        "name": "Sacred Shrine Flame",
        "desc": "Relights 1 extinguished lantern (up to max 3 lives)."
    },
    "spirit_amulet": {
        "name": "Kitsune Protection Amulet",
        "desc": "The amulet shatters on the next mistake, saving a lantern."
    },
    "expand_queue": {
        "name": "Scroll of Foresight",
        "desc": "+3 additional command slots for the remainder of the run."
    },
    "camera_insight": {
        "name": "Kitsune Vision",
        "desc": "+2 free camera rotations on every upcoming floor."
    },
    "celestial_favour": {
        "name": "Celestial Favor",
        "desc": "+500 heavenly bonus points toward your tower ranking."
    }
};

  const LEVELS_EN = {
    "Die erste Lieferung": {
        "name": "The First Delivery",
        "desc": "First drive straight through the alley, then turn south toward the package. Reach the goal in six commands."
    },
    "Um die Ecke": {
        "name": "Around the Corner",
        "desc": "The wall blocks the middle path. Drive north to the upper alley and then east to the package. You have exactly eight commands."
    },
    "Das Tor des Schreins": {
        "name": "The Shrine Gate",
        "desc": "Activate the mint switch with ✦. After that, the purple gate opens."
    },
    "Der brüchige Steg": {
        "name": "The Fragile Stepping Stones",
        "desc": "The stepping stones across the lotus pond are weathered and fragile. The robot can only step on each stone once before it sinks."
    },
    "Der heilige Felsblock": {
        "name": "The Sacred Stone Block",
        "desc": "A heavy Shinto stone block blocks the path. Push it forward and use it as a bridge across the water!"
    },
    "Laternenlicht": {
        "name": "Lantern Light",
        "desc": "The path grows longer and winds around several corners. Pay close attention to the robot's heading after each turn."
    },
    "Der richtige Moment": {
        "name": "The Right Moment",
        "desc": "Now you need multiple directional turns. The switch is located on the only walkable path."
    },
    "Der Teich der zwei Pfade": {
        "name": "Pond of Two Paths",
        "desc": "Push the sacred rock into the lotus pond to reach the switch. The open gate leads across fragile stones to the shrine."
    },
    "Fast am Ziel": {
        "name": "Almost There",
        "desc": "The route is longer with multiple turns. A single misplaced turn command can halt your entire plan."
    },
    "Die letzte Lieferung": {
        "name": "The Final Delivery",
        "desc": "The final mission combines a long route, multiple turns, and the exact sequence of switch and gate."
    },
    "Zwei Lichter": {
        "name": "Two Spirit Lights",
        "desc": "Two gates block the shrine path. Activate the cyan switch first, then the purple switch."
    },
    "Gegensätze": {
        "name": "Opposites",
        "desc": "Two separate alleys lead to the shrine pond. Open both gates to complete the circuit."
    },
    "Die zwei Wächterfelsen": {
        "name": "The Two Guardian Rocks",
        "desc": "Two sacred stone blocks obstruct the bamboo corridor. Use the first stone as a bridge to get behind the second!"
    },
    "Spiegelgarten": {
        "name": "Mirror Garden",
        "desc": "A symmetrical garden with eastern and western wings. Collect both clearance switches."
    },
    "Kreuzende Pfade": {
        "name": "Crossing Paths",
        "desc": "The shrine crossroads require clever forward and backward perspective adjustments."
    },
    "Laternenparade": {
        "name": "Lantern Parade",
        "desc": "Follow the serpentine avenue and unlock the gates situated along the curves."
    },
    "Farben der Nacht": {
        "name": "Colors of the Night",
        "desc": "A sprawling 7x7 garden with illuminated stone tiles. Keep your cardinal directions in sight."
    },
    "Das Zwillings-Tor": {
        "name": "The Twin Gates",
        "desc": "The two sacred gates stand in sequence. Take the circuit route through the ancient bamboo trails."
    },
    "Das Portal des Fuchses": {
        "name": "The Fox Portal",
        "desc": "The Kitsune shrines utilize mystical dimensional gateways. Step into the glowing portal to bypass long distances."
    },
    "Über Mauer & Lotusteich": {
        "name": "Over Wall & Lotus Pond",
        "desc": "The lotus pond separates the robot from the Kitsune portal. Balance across fragile stones to the switch and warp through the portal to the gate!"
    },
    "Schritt ins Blaue": {
        "name": "Step into the Blue",
        "desc": "The switch is situated on an isolated island. Leap through the portal, activate it, and return."
    },
    "Dimensions-Sprung": {
        "name": "Dimensional Leap",
        "desc": "The shrine basin is impassable. Teleport onto the northern island and reach the destination Torii."
    },
    "Raumkrümmung": {
        "name": "Spatial Warp",
        "desc": "The portal connects two diagonal chambers of the garden. Exploit the fold in space with skill."
    },
    "Der verschlungene Hof": {
        "name": "The Winding Courtyard",
        "desc": "The portal leads directly into the secluded courtyard housing the second switch."
    },
    "Kitsunes Irrgarten": {
        "name": "Kitsune's Labyrinth",
        "desc": "The corridors are tight. The portal is the only way to bypass the dead-end alley."
    },
    "Sprung ins Torii": {
        "name": "Leap into the Torii",
        "desc": "The masterwork of the Kitsune spirits: Unlock both barriers before stepping into the portal."
    },
    "Das verlorene Licht": {
        "name": "The Lost Spirit Light",
        "desc": "The sacred spirit light rests on an island in the bamboo pond. Build a bridge with the stone block and step across the lotus stones to the shrine."
    },
    "Zwei Opfergaben": {
        "name": "Two Sacred Offerings",
        "desc": "A sudden mountain gust in the bamboo grove sweeps the robot north! Collect both offerings on the left and right."
    },
    "Schrein der Ahnen": {
        "name": "Shrine of the Ancestors",
        "desc": "The goal gate requires both: the switch clearance and the collected spirit light."
    },
    "Der steinerne Schreinwächter": {
        "name": "The Stone Shrine Guardian",
        "desc": "The ancient stone Komainu guards the gate to the Celestial Bridge with deafening roars! Dodge his attacks, unlock the bamboo gate, trap him with the basalt block at altar (3, 2), and recover both sacred relics!"
    },
    "Glühwürmchen-Garten": {
        "name": "Firefly Garden",
        "desc": "Fireflies illuminate the ancestral shrines. Plan your sequence through the courtyard carefully."
    },
    "Das heilige Becken": {
        "name": "The Sacred Basin",
        "desc": "The sacred water basin shelters two offering lights. Sink the sacred rock to recover the first light, and cross the fragile stones to the second."
    },
    "Geisterpfad": {
        "name": "Spirit Trail",
        "desc": "The first spirit light floats before the portal; the second awaits on the far side of the garden. Tread carefully across the fragile stones in the spirit brook."
    },
    "Der stille Bambus": {
        "name": "Silent Bamboo",
        "desc": "Harmonize switch activations and the collection of spirit offerings into a single seamless plan."
    },
    "Laternenfest": {
        "name": "Festival of Lanterns",
        "desc": "To conclude the spirit grove, three magical lights shine. Plan the optimal gathering route."
    },
    "Die Himmelsbrücke": {
        "name": "The Celestial Bridge",
        "desc": "Welcome to the Celestial Bridge! Rushing alpine winds blow across the sea of clouds. Skillfully ride the crosswind, recover the celestial relics, and unseal the shrine portal."
    },
    "Triade der Geister": {
        "name": "Triad of Spirits",
        "desc": "Three ancient spirit lights float above cloud plateaus. Two crossing sky gusts demand calculated turns and foresight."
    },
    "Goldener Sonnenaufgang": {
        "name": "Golden Sunrise",
        "desc": "Morning gold washes over the celestial bridge. Two separate gates require activating both guardian stones. Let the wind carry you to the second terrace."
    },
    "Die drei Siegel": {
        "name": "The Three Seals",
        "desc": "Three shrine terraces extend over the abyss. Unseal the barriers with precise turns and gather both spirit crystals."
    },
    "Die drei Himmelssiegel": {
        "name": "The Three Celestial Seals",
        "desc": "Three shrine terraces extend over the abyss. Unseal the barriers with precise turns and gather both spirit crystals."
    },
    "Brücke der drei Winde": {
        "name": "Bridge of Three Winds",
        "desc": "Three massive wind channels cross the gods' main bridge! Use the gusts as a catapult, navigate around guardian pillars, and breach the celestial barrier."
    },
    "Prüfung der Elemente": {
        "name": "Trial of the Elements",
        "desc": "Crossing wind gusts and sealed bridges test your mind. Activate both Kami switches and utilize the wind swirl to clear the goal."
    },
    "Himmlisches Palais": {
        "name": "Celestial Palace",
        "desc": "The floating palace is only reachable via ancient Kitsune sky portals. Teleport between cloud pavilions and shatter both guardian gates."
    },
    "Der Aufstieg": {
        "name": "The Ascent",
        "desc": "The final stage before the gates of the gods! Master the great ascent, overcome crosswinds, and unlock the golden gate to the Palace of the Kami."
    },
    "Der Große Himmelsaufstieg": {
        "name": "The Grand Celestial Ascent",
        "desc": "The final stage before the gates of the gods! Master the great ascent, overcome crosswinds, and unlock the golden gate to the Palace of the Kami."
    },
    "Das Smaragd-Tor": {
        "name": "The Emerald Gate",
        "desc": "Welcome to the Palace of the Kami! The sacred halls of the Shinto gods open. Cross the emerald court, recover imperial relics, and break the gate seal."
    },
    "Quad-Siegel": {
        "name": "Quad Seals",
        "desc": "Four sacred pavilions frame the central courtyard. Activate both guardian seals in exact order and retrieve relics from treasure towers."
    },
    "Quad-Siegel der Kami": {
        "name": "Quad Seals of the Kami",
        "desc": "Four sacred pavilions frame the central courtyard. Activate both guardian seals in exact order and retrieve relics from treasure towers."
    },
    "Großes Schrein-Labyrinth": {
        "name": "Grand Shrine Labyrinth",
        "desc": "An intricate network of covered walkways and cedar walls. Plan your turns with millimeter precision so you don't get trapped in dead ends."
    },
    "Kitsunes Meisterstück": {
        "name": "Kitsune's Masterpiece",
        "desc": "Kitsune has woven the shrine terraces with sorcery. Enter portals at the correct angle to shift between isolated halls and reach the palace Torii."
    },
    "Weg der Erleuchtung": {
        "name": "Path of Enlightenment",
        "desc": "The Path of Enlightenment demands ultimate mastery. Three crossing currents, two Magatama seals, and narrow passages challenge your full logical cunning."
    },
    "Tempel der Ewigkeit": {
        "name": "Temple of Eternity",
        "desc": "In the eternal hall linger the spirits of the shrine founders. Open both palace gates, ride the celestial stream, and recover the sacred mirrors."
    },
    "Das letzte Orakel": {
        "name": "The Final Oracle",
        "desc": "The oracle of the Kami tests your resolve before ascending Mount Fuji. Collect the three oracle lights and unravel the twisted seals."
    },
    "Die Legende des Schreins": {
        "name": "The Legend of the Shrine",
        "desc": "The grand finale of the Palace of the Kami! All trials unite: wind currents, switches, and ancient Magatama seals. Open the gateway to sacred Mount Fuji!"
    },
    "Der erste Bergwind": {
        "name": "First Mountain Wind",
        "desc": "Welcome to the snow-covered foot of Fuji! A gentle wind gust carries the robot forward. Harness the gust, flip the shrine switch, and reach the goal."
    },
    "Die gefrorene Schlucht": {
        "name": "The Frozen Gorge",
        "desc": "An icy chasm separates the terraces. The updraft catapults the robot over the chasm to the mountain crystal. Unseal the gate to enter the mountain garden."
    },
    "Das eisige Kitsune-Portal": {
        "name": "Icy Kitsune Portal",
        "desc": "The Kitsune portal stands directly within the wind tunnel! Wind inertia hurls the robot forward upon exit. Collect both lights and find the courtyard path."
    },
    "Schneeverwehte Pfade": {
        "name": "Snowdrift Paths",
        "desc": "Heavy snowfall drifts across the stone steps. Ride the downward wind gust to the switch and gingerly cross the fragile ice over the glacier crevasse!"
    },
    "Kreuzende Böen": {
        "name": "Crosswinds",
        "desc": "Treacherous winds cross on the mountain saddle. Collect both spirit crystals by purposefully following the eastern and southern winds."
    },
    "Aufstieg zur 8. Station": {
        "name": "Ascent to the 8th Station",
        "desc": "The eighth station before the summit demands peak mastery: Kitsune portals, double gates, and updrafts must be navigated in flawless harmony."
    },
    "Wirbelsturm der vier Winde": {
        "name": "Whirlwind of Four Winds",
        "desc": "A swirling vortex howls over the high plateau! Harness the current to visit the outer shrines without being trapped in the whirlwind."
    },
    "Gegenstrom im Eiskanal": {
        "name": "Upstream in the Ice Channel",
        "desc": "Two sealed gates and raging wind flumes require precision timing. Activate both guardian switches and overcome the wind currents."
    },
    "Das verborgene Eistor": {
        "name": "The Hidden Ice Gate",
        "desc": "Two ancient gates block the main approach. Use wind gusts in the valley to flip the cyan switch, unseal the magma gate, and unlock the shrine."
    },
    "Der Geist des Fuji (富士の神)": {
        "name": "Spirit of Mount Fuji (富士の神)",
        "desc": "Dragon Ryūjin rages over the crater of Mount Fuji! Push the basalt block into his frost breath, cross fragile ice floes, and deliver all three imperial relics to redeem the dragon!"
    }
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
      if (lvl.c && CHAPTERS_EN[lvl.c]) {
        translated.c = CHAPTERS_EN[lvl.c];
      } else if (typeof lvl.c === "string") {
        translated.c = lvl.c.replace(/Kapitel/g, "Chapter");
      }

      // Translate Tag
      if (lvl.t && TAGS_EN[lvl.t]) {
        translated.t = TAGS_EN[lvl.t];
      }

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

    translateFeedback(text) {
      if (!text || this.currentLang !== "en") return text;

      // Exact matches
      const EXACT_MATCHES = {
        "Plane deine Befehlsfolge und drücke auf „Plan abspielen“.": "Plan your command sequence and press “Run Plan”.",
        "Los geht's! Der Shinto-Bote führt deinen Plan aus …": "Off we go! The Shinto messenger executes your plan …",
        "Los geht's! KOMA führt deinen Plan aus …": "Off we go! The robot executes your plan …",
        "Füge zuerst mindestens einen Befehl hinzu.": "Add at least one command first.",
        "Dein Plan ist voll! Entferne einen Befehl für neue Schritte.": "Your plan is full! Remove a command for new steps.",
        "Letzten Befehl entfernt.": "Last command removed.",
        "Befehl entfernt.": "Command removed.",
        "Plan geleert.": "Plan cleared.",
        "Auf Startposition zurückgesetzt.": "Reset to starting position.",
        "Hier gibt es keinen Schalter zum Aktivieren.": "There is no switch to activate here.",
        "Der heilige Felsblock ist blockiert und lässt sich nicht weiterschieben!": "The sacred stone block is blocked and cannot be pushed further!",
        "Platsch! Der Felsblock versinkt im Wasser und bildet eine neue Trittstein-Brücke!": "Splash! The stone block sinks into the water and creates a new bridge!",
        "Rumpel! KOMA schiebt den heiligen Steinblock vor sich her.": "Rumble! The robot pushes the sacred stone block.",
        "Knacks! Der morsche Trittstein bekommt Risse und versinkt gleich!": "Crack! The weathered stepping stone cracks and will sink soon!",
        "Kitsune-Portal betreten! KOMA beamt sich ans Ziel-Portal.": "Kitsune Portal entered! The robot teleports to the destination portal.",
        "Eine Windböe erfasst KOMA, aber ein Hindernis stoppt den Windstoß!": "A wind gust catches the robot, but an obstacle halts the gust!",
        "Eine kräftige Bergwindböe trägt KOMA mit sich!": "A powerful mountain wind gust carries the robot forward!",
        "1. Heiliges Schrein-Relikt geborgen!": "1st Sacred Shrine Relic recovered!",
        "2. Heiliges Schrein-Relikt geborgen!": "2nd Sacred Shrine Relic recovered!",
        "Alle Schrein-Relikte geborgen! Das Tor ist frei!": "All shrine relics recovered! The gate is open!",
        "1. Magatama-Siegel zerborsten! Der Himmelsdrache tobt!": "1st Magatama Seal shattered! The Sky Dragon rages!",
        "2. Magatama-Siegel zerborsten! Drachen-Aura pulsiert!": "2nd Magatama Seal shattered! Dragon aura pulses!",
        "Alle 3 Siegel gebrochen! Das Gipfel-Torii erstrahlt!": "All 3 seals broken! The summit Torii shines!",
        "Der schwere Basaltblock versiegelt den Schrein! Das Gebrüll prallt wirkungslos ab.": "The heavy basalt block seals the shrine! The roar deflects harmlessly.",
        "Der massive Basaltblock bricht die Druckwelle des Schreinwächters!": "The massive basalt block breaks the guardian's shockwave!",
        "Der Basaltblock fängt den Frost-Odem ab! KOMA bleibt unversehrt!": "The basalt block catches the frost breath! The robot remains unharmed!",
        "Eingefroren! Der Frost-Odem von Ryūjin hat KOMA erfasst. Weiche den markierten Zonen aus!": "Frozen! Ryūjin's frost breath engulfed the robot. Dodge the marked zones!",
        "Ryūjins Frost-Odem schlägt über den Krater ein! KOMA entkommt knapp.": "Ryūjin's frost breath strikes the crater! The robot narrowly escapes.",
        "In der täglichen Schreinprüfung sind Kameraschwenker verboten!": "Camera rotations are disabled in the Daily Shrine Trial!",
        "Tägliche Schreinprüfung geladen! Kameraschwenker sind deaktiviert (0 Credits). Plane deine Befehle vorab.": "Daily Shrine Trial loaded! Camera rotations are disabled (0 credits). Plan your commands in advance.",
        "Kamera-Credits aufgebraucht (0 Sterne möglich – Level kann trotzdem abgeschlossen werden).": "Camera credits depleted (0 stars possible – level can still be completed).",
        "Plan beendet. KOMA hat das Ziel noch nicht erreicht – passe deinen Plan an.": "Plan finished. The robot did not reach the goal – adjust your plan.",
        "Plan beendet. Das Ziel wurde noch nicht erreicht – passe deinen Plan an.": "Plan finished. The goal was not reached yet – adjust your plan.",
        "Platsch! Der Roboter ist ins Wasser gefallen – passe deinen Plan an.": "Splash! The robot fell into the water – adjust your plan.",
        "Plopp! Der Weg ist versperrt – passe deinen Plan an.": "Clack! The path is blocked – adjust your plan.",
        "Tipp: Drücke auf „Vorwärts ↑“, um Befehle in deinen Plan einzufügen.": "Tip: Tap “Forward ↑” to insert commands into your plan.",
        "Alle 60 Lieferungen geschafft!": "All 60 deliveries completed!",
        "Lieferung erfolgreich!": "Delivery successful!",
        "Basaltblock blockiert den Schrein!": "Basalt block blocks the shrine!",
        "Lieferung abgebrochen. KOMA ist wieder am Start – passe deinen Plan an.": "Delivery aborted. The robot is back at the start – adjust your plan.",
        "KOMA ist wieder am Start. Du kannst deinen Plan anpassen.": "The robot is back at the start. You can adjust your plan.",
        "Plan gelöscht. Beginne mit einer neuen Befehlsfolge.": "Plan cleared. Start with a new command sequence.",
        "Das Schrein-Torii bleibt versiegelt! Schiebe den Basaltblock vor seinen Schrein (3, 2), um den Komainu einzusperren!": "The shrine Torii remains sealed! Push the basalt block in front of its shrine (3, 2) to cage the Komainu!"
      };

      if (EXACT_MATCHES[text]) return EXACT_MATCHES[text];

      let out = text;

      // Ziel noch versiegelt! Sammle noch X Geisterlicht(er).
      out = out.replace(/Ziel noch versiegelt! Sammle noch (\d+) Geisterlicht\(er\)\./g, "Goal still sealed! Collect $1 more spirit light(s).");

      // Kapitel X ist noch gesperrt! Schließe zuerst Kapitel Y (Level Z) ab.
      out = out.replace(/Kapitel (\d+) ist noch gesperrt! Schließe zuerst Kapitel (\d+) \(Level (\d+)\) ab\./g, "Chapter $1 is still locked! Complete Chapter $2 (Level $3) first.");

      // Kapitel X: Der Heilige Berg Fuji geladen!
      out = out.replace(/Kapitel (\d+): Der Heilige Berg Fuji geladen!/g, "Chapter $1: Sacred Mount Fuji loaded!");

      // Level X ist noch gesperrt! Schließe zuerst Level Y ab.
      out = out.replace(/Level (\d+) ist noch gesperrt! Schließe zuerst Level (\d+) ab\./g, "Level $1 is still locked! Complete Level $2 first.");

      // Level X geschafft!
      out = out.replace(/Level (\d+) geschafft!/g, "Level $1 cleared!");

      // Skin "..." ausgerüstet!
      out = out.replace(/Skin "([^"]+)" ausgerüstet!/g, 'Skin "$1" equipped!');

      // Heiliges Siegel erlangt: ...
      out = out.replace(/Heiliges Siegel erlangt: ([^!]+)!/g, "Sacred Seal unlocked: $1!");

      // Kamera geschwenkt (-1 Credit, noch X übrig).
      out = out.replace(/Kamera geschwenkt \(-1 Credit, noch (\d+) übrig\)\./g, "Camera rotated (-1 credit, $1 remaining).");

      // Turm-Ebene X geladen! Plane den Weg zum heiligen Schrein-Torii.
      out = out.replace(/Turm-Ebene (\d+) geladen! Plane den Weg zum heiligen Schrein-Torii\./g, "Tower Floor $1 loaded! Plan the path to the sacred shrine Torii.");

      // Vom Gebrüll des Komainu in ... erschüttert! Weiche der Gebrüll-Zone aus oder schirme dich ab!
      out = out.replace(/Vom Gebrüll des Komainu in ([^ ]+) erschüttert! Weiche der Gebrüll-Zone aus oder schirme dich ab!/g, "Stunned by Komainu's roar in $1! Dodge the roar zone or shield yourself!");

      // Das Gebrüll des Komainu erschüttert ...!
      out = out.replace(/Das Gebrüll des Komainu erschüttert ([^!]+)!/g, "The roar of the Komainu shakes $1!");

      // Absturz! Alle Laternen erloschen auf Ebene X.
      out = out.replace(/Absturz! Alle Laternen erloschen auf Ebene (\d+)\./g, "Crash! All lanterns extinguished on Floor $1.");

      // ✦ ...-Schalter aktiviert! Das zugehörige Tor öffnet sich.
      out = out.replace(/✦ ([^ -]+)-Schalter aktiviert! Das zugehörige Tor öffnet sich\./g, (m, col) => {
        const colMap = { "türkis": "cyan", "violett": "purple", "smaragd": "emerald", "gold": "gold", "orange": "orange", "mint": "mint", "magenta": "magenta", "gelb": "yellow", "blau": "blue", "rot": "red" };
        const enCol = colMap[col.toLowerCase()] || col;
        return `✦ ${enCol.charAt(0).toUpperCase() + enCol.slice(1)} switch activated! The corresponding gate opens.`;
      });

      // Plopp! ... KOMA bleibt stehen – passe deinen Plan an.
      out = out.replace(/Plopp! ([^ ]+) KOMA bleibt stehen – passe deinen Plan an\./g, "Clack! The path is blocked. The robot stops – adjust your plan.");
      out = out.replace(/Plopp! (.*) – passe deinen Plan an\./g, "Clack! $1 – adjust your plan.");

      // Geisterlicht eingesammelt! (X / Y)
      out = out.replace(/Geisterlicht eingesammelt! \((\d+) \/ (\d+)\)/g, "Spirit light collected! ($1 / $2)");

      // ... hinzugefügt.
      out = out.replace(/(?:Vorwärts|Forward)\s+hinzugefügt\./g, "Forward added.");
      out = out.replace(/(?:Drehung links|Links|Turn Left)\s+hinzugefügt\./g, "Turn Left added.");
      out = out.replace(/(?:Drehung rechts|Rechts|Turn Right)\s+hinzugefügt\./g, "Turn Right added.");
      out = out.replace(/(?:Aktion|Action)\s+hinzugefügt\./g, "Action added.");
      out = out.replace(/Letzten Befehl entfernt\./g, "Removed last command.");

      return out;
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
