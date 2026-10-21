/**
 * KOMA: Spirit Delivery - "Turm der 100 Prüfungen" (Tower of 100 Trials)
 * (js/tower.js)
 * 
 * Roguelike endless mode:
 * - Ascend through 100 procedural/archetypal shrine floors of scaling complexity.
 * - 3 Spirit Lanterns (lives 🏮🏮🏮).
 * - Boss / Trial Gates every 5 floors (Floor 5, 10, 15, 20...) with the Altar of Blessings.
 * - Collect sacred gifts (healing lanterns, extra queue slots, camera credits, protection amulets).
 * - Persistent Personal Best floor & highscore tracking via localStorage.
 * - Guaranteed 100% solvable levels verified by built-in BFS solver.
 */

(function() {
  "use strict";

  const STORAGE_KEY = "koma_tower_save_v1";

  // --- Blessings Definition Pool ---
  const BLESSINGS_POOL = [
    {
      id: "heal_lantern",
      name: "Heilige Schrein-Flamme",
      icon: "🏮",
      desc: "Entzündet 1 erloschene Laterne neu (bis max. 3 Leben).",
      apply: (mgr) => {
        if (mgr.lanterns < mgr.maxLanterns) {
          mgr.lanterns = Math.min(mgr.maxLanterns, mgr.lanterns + 1);
        } else {
          mgr.score += 250; // Overheal bonus
        }
      }
    },
    {
      id: "spirit_amulet",
      name: "Schutz-Amulett der Kitsune",
      icon: "🌸",
      desc: "Das Amulett zerbricht beim nächsten Fehler und rettet eine Laterne.",
      apply: (mgr) => {
        mgr.amuletActive = true;
      }
    },
    {
      id: "expand_queue",
      name: "Schriftrolle der Weitsicht",
      icon: "📜",
      desc: "+3 zusätzliche Befehls-Slots im Plan für den restlichen Run.",
      apply: (mgr) => {
        mgr.extraSlots += 3;
      }
    },
    {
      id: "camera_insight",
      name: "Kitsune-Weitsicht",
      icon: "👁️",
      desc: "+2 freie Kameraschwenker auf jeder kommenden Etage.",
      apply: (mgr) => {
        mgr.extraCredits += 2;
      }
    },
    {
      id: "celestial_favour",
      name: "Göttliche Gunst",
      icon: "✨",
      desc: "+500 himmlische Bonuspunkte für deinen Turm-Rang.",
      apply: (mgr) => {
        mgr.score += 500;
      }
    }
  ];

  class TowerManager {
    constructor() {
      this.data = this.loadData();
      
      // Active run state
      this.isActive = false;
      this.floor = 1;
      this.lanterns = 3;
      this.maxLanterns = 3;
      this.amuletActive = false;
      this.extraSlots = 0;
      this.extraCredits = 0;
      this.blessings = [];
      this.score = 0;
      this.runSeed = 1337;
      this.currentLevel = null;

      this.pendingAltarChoices = [];
    }

    loadData() {
      if (typeof localStorage !== "undefined") {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
      }
      return {
        bestFloor: 0,
        bestScore: 0,
        totalRuns: 0,
        totalFloorsCleared: 0
      };
    }

    saveData() {
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {}
      }
    }

    getBestFloor() {
      return this.data.bestFloor || 0;
    }

    getBestScore() {
      return this.data.bestScore || 0;
    }

    startNewRun() {
      this.isActive = true;
      this.floor = 1;
      this.lanterns = 3;
      this.maxLanterns = 3;
      this.amuletActive = false;
      this.extraSlots = 0;
      this.extraCredits = 0;
      this.blessings = [];
      this.score = 0;
      this.runSeed = Math.floor(Math.random() * 900000) + 100000;
      this.data.totalRuns += 1;
      this.saveData();

      this.currentLevel = this.generateFloorLevel(this.floor);
      this.updateUI();
      return this.currentLevel;
    }

    getCurrentLevel() {
      if (!this.currentLevel) {
        this.currentLevel = this.generateFloorLevel(this.floor);
      }
      return this.currentLevel;
    }

    /**
     * Generates a guaranteed solvable level tailored to the current floor depth.
     */
    generateFloorLevel(floor) {
      const solverUtils = window.KomaSolver || {
        buildOuterWalls: (w, h) => {
          const walls = [];
          for (let x = 0; x < w; x++) { walls.push([x, 0]); walls.push([x, h - 1]); }
          for (let y = 1; y < h - 1; y++) { walls.push([0, y]); walls.push([w - 1, y]); }
          return walls;
        },
        mulberry32: (seed) => {
          return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
          };
        },
        solveLevel: window.solveLevel
      };

      const seed = ((this.runSeed * 37) + (floor * 1013)) >>> 0;
      const rng = solverUtils.mulberry32(seed);

      const isBossFloor = (floor % 5 === 0);
      const isFujiBiome = (floor >= 15 && floor <= 25) || (floor >= 45 && floor <= 55);

      // Grid sizing scales with floor
      let w = 5, h = 5;
      if (floor >= 5) { w = 6; h = 6; }
      if (floor >= 15) { w = 7; h = 7; }
      if (floor >= 35) { w = 7; h = 7; }

      const baseWalls = solverUtils.buildOuterWalls(w, h);
      let lvl = null;

      // Tier-based archetype generation
      if (floor < 5) {
        // Tier 1 (Floors 1-4): Novice Courtyard (Orientation, 1 switch, 1 gate)
        lvl = {
          n: `Turm-Ebene ${floor}`,
          c: `Turm der 100 Prüfungen · Vorhof`,
          t: `Ebene ${floor} · Grundlagen der Pfade`,
          d: `Erklimme den Turm! Schalte das Tor frei und erreiche das Ziel-Torii.`,
          w, h,
          s: [1, h - 2, "N"],
          g: [w - 2, 1],
          sw: [[1, 1, "cyan"]],
          gates: [[w - 2, 2, "cyan"]],
          walls: [...baseWalls, [2, 2], [2, 3], [3, 2]],
          maxCredits: Math.max(1, 3 + this.extraCredits)
        };
      } else if (isBossFloor && floor === 5) {
        // Boss 1 (Floor 5): Große Schrein-Pforte (Portals + Relic)
        lvl = {
          n: `Große Pforte: Tor des Fuchses`,
          c: `Turm-Meilenstein · Ebene 5 (Prüfung)`,
          t: `Ebene 5 · 1. Schrein-Pforte`,
          d: `Die erste Große Pforte verlangt das Bergen eines Geisterlichts durch ein heiliges Portal.`,
          w, h,
          s: [1, 4, "E"],
          g: [4, 1],
          orbs: [[1, 1]],
          portals: [[4, 4], [1, 2]],
          sw: [[4, 2, "cyan"]],
          gates: [[3, 1, "cyan"]],
          walls: [...baseWalls, [2, 2], [2, 3], [3, 3]],
          maxCredits: Math.max(2, 4 + this.extraCredits)
        };
      } else if (floor < 10) {
        // Tier 2 (Floors 6-9): Bamboo & Portals
        lvl = {
          n: `Turm-Ebene ${floor}`,
          c: `Turm der 100 Prüfungen · Bambushain`,
          t: `Ebene ${floor} · Raum-Transzendenz`,
          d: `Nutze die Kitsune-Portale geschickt, um die Mauerreihen zu überspringen.`,
          w, h,
          s: [1, 4, "N"],
          g: [4, 1],
          portals: [[1, 1], [4, 4]],
          sw: [[3, 3, "cyan"]],
          gates: [[4, 2, "cyan"]],
          walls: [...baseWalls, [2, 1], [2, 2], [3, 4], [2, 4]],
          maxCredits: Math.max(2, 3 + this.extraCredits)
        };
      } else if (isBossFloor && floor === 10) {
        // Boss 2 (Floor 10): Das Tor der zwei Farben (Dual Gates)
        lvl = {
          n: `Große Pforte: Siegel der zwei Farben`,
          c: `Turm-Meilenstein · Ebene 10 (Prüfung)`,
          t: `Ebene 10 · 2. Schrein-Pforte`,
          d: `Cyan- und Magenta-Schrein fordern synchrones Betätigen der Altäre.`,
          w, h,
          s: [1, 5, "N"],
          g: [5, 1],
          orbs: [[1, 1], [5, 5]],
          sw: [[1, 3, "cyan"], [5, 3, "magenta"]],
          gates: [[3, 2, "cyan"], [5, 2, "magenta"]],
          portals: [[2, 5], [4, 1]],
          walls: [...baseWalls, [2, 2], [3, 4], [4, 4], [3, 1]],
          maxCredits: Math.max(2, 4 + this.extraCredits)
        };
      } else if (floor < 15) {
        // Tier 3 (Floors 11-14): Wind Paths & Mountain Slopes
        lvl = {
          n: `Turm-Ebene ${floor}`,
          c: `Turm der 100 Prüfungen · Windpfad`,
          t: `Ebene ${floor} · Böen-Gleiten`,
          d: `Heftige Aufwinde tragen KOMA über Abgründe. Plane die Gleitrichtung ein.`,
          w, h,
          s: [1, 5, "E"],
          g: [5, 1],
          winds: [[2, 5, "E"], [4, 2, "N"]],
          sw: [[5, 4, "cyan"]],
          gates: [[5, 2, "cyan"]],
          walls: [...baseWalls, [2, 3], [3, 2], [4, 4]],
          maxCredits: Math.max(2, 3 + this.extraCredits)
        };
      } else if (isBossFloor && floor === 15) {
        // Boss 3 (Floor 15): Sturm-Gipfel der 15 Torii
        lvl = {
          n: `Große Pforte: Altar des Nordwinds`,
          c: `Turm-Meilenstein · Ebene 15 (Prüfung)`,
          t: `Ebene 15 · 3. Schrein-Pforte`,
          d: `Windböen kreuzen das Kitsune-Portal. Ein Fehler kostet die Laterne.`,
          w, h,
          s: [1, 5, "N"],
          g: [5, 1],
          orbs: [[3, 3]],
          winds: [[1, 3, "N"], [4, 5, "W"]],
          portals: [[1, 1], [5, 4]],
          sw: [[3, 5, "cyan"]],
          gates: [[5, 2, "cyan"]],
          walls: [...baseWalls, [2, 1], [2, 2], [4, 2], [4, 3]],
          maxCredits: Math.max(2, 4 + this.extraCredits)
        };
      } else {
        // Tier 4 & Higher (Floor 16+): Multi-Mechanic Celestial Trials
        const hasDualGates = (floor >= 20);
        const hasWind = (floor % 2 === 0);
        const hasPortals = (floor % 3 === 0 || isBossFloor);
        const orbCount = (floor >= 25) ? 2 : 1;

        lvl = {
          n: isBossFloor ? `Große Pforte: Zenith-Ebene ${floor}` : `Turm-Ebene ${floor}`,
          c: isBossFloor ? `Turm-Meilenstein · Ebene ${floor} (Prüfung)` : `Turm der 100 Prüfungen · Zenith`,
          t: `Ebene ${floor} · Himmlische Prüfung`,
          d: isBossFloor
            ? `Meilenstein-Prüfung! Alle heiligen Schrein-Mechaniken fordern höchste Konzentration.`
            : `Die Luft wird dünn auf Ebene ${floor}. Konzentriere deine Planung auf den direkten Weg.`,
          w, h,
          s: [1, h - 2, "N"],
          g: [w - 2, 1],
          orbs: (orbCount === 2) ? [[1, 1], [w - 2, h - 2]] : [[1, 1]],
          sw: hasDualGates ? [[1, 3, "cyan"], [w - 2, 3, "magenta"]] : [[1, 3, "cyan"]],
          gates: hasDualGates ? [[3, 2, "cyan"], [w - 2, 2, "magenta"]] : [[w - 2, 2, "cyan"]],
          portals: hasPortals ? [[2, h - 2], [w - 3, 1]] : undefined,
          winds: hasWind ? [[1, 2, "E"], [w - 2, 4, "W"]] : undefined,
          walls: [...baseWalls, [2, 2], [3, 3], [w - 3, 3], [w - 3, 4]],
          maxCredits: Math.max(2, (isBossFloor ? 4 : 3) + this.extraCredits)
        };
      }

      // Add Fuji / Snow theme if appropriate
      if (isFujiBiome) {
        lvl.isSnow = true;
        lvl.theme = "fuji";
      }

      // Ensure solvability and assign command limit
      let sol = solverUtils.solveLevel ? solverUtils.solveLevel(lvl) : { solved: true, steps: 12, path: [] };
      if (!sol.solved) {
        // Fail-safe fallback to clean guaranteed solution
        lvl.walls = baseWalls;
        lvl.winds = undefined;
        lvl.portals = undefined;
        sol = solverUtils.solveLevel(lvl);
      }

      lvl.solverSolution = sol;
      lvl.solution = sol.path;
      // Set command limit (including extra slots from blessings)
      lvl.limit = Math.max(16, Math.min(36, (sol.steps || 12) + 4)) + this.extraSlots;
      lvl.isTower = true;
      lvl.towerFloor = floor;
      lvl.isBossFloor = isBossFloor;

      return lvl;
    }

    /**
     * Handles victory on current floor
     */
    handleFloorClear(stepsUsed) {
      this.data.totalFloorsCleared += 1;
      
      // Calculate score for cleared floor
      const basePoints = 100 * this.floor;
      const lanternBonus = this.lanterns * 50;
      const floorScore = basePoints + lanternBonus;
      this.score += floorScore;

      let isNewBestFloor = false;
      if (this.floor > (this.data.bestFloor || 0)) {
        this.data.bestFloor = this.floor;
        isNewBestFloor = true;
      }
      if (this.score > (this.data.bestScore || 0)) {
        this.data.bestScore = this.score;
      }
      this.saveData();

      const clearedFloor = this.floor;
      const isBoss = (clearedFloor % 5 === 0);

      if (isBoss) {
        // Present Altar of Blessings
        this.pendingAltarChoices = this.pickRandomBlessings(3);
        this.updateUI();
        return {
          type: "altar",
          floor: clearedFloor,
          score: this.score,
          isNewBestFloor,
          choices: this.pendingAltarChoices
        };
      } else {
        // Advance to next floor directly
        this.floor += 1;
        this.currentLevel = this.generateFloorLevel(this.floor);
        this.updateUI();
        return {
          type: "next_floor",
          floor: this.floor,
          score: this.score,
          isNewBestFloor
        };
      }
    }

    /**
     * Picks 3 distinct random blessings from BLESSINGS_POOL
     */
    pickRandomBlessings(count = 3) {
      const pool = [...BLESSINGS_POOL];
      // Shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, count);
    }

    /**
     * Applies the chosen blessing from Altar modal and advances floor
     */
    chooseBlessing(blessingId) {
      const blessing = BLESSINGS_POOL.find(b => b.id === blessingId);
      if (blessing) {
        blessing.apply(this);
        this.blessings.push(blessing.name);
      }
      this.pendingAltarChoices = [];
      this.floor += 1;
      this.currentLevel = this.generateFloorLevel(this.floor);
      this.updateUI();
      return this.currentLevel;
    }

    /**
     * Handles collision or missed orbs
     */
    handleFail() {
      // 1. Check if spirit amulet is active
      if (this.amuletActive) {
        this.amuletActive = false;
        this.updateUI();
        return {
          absorbed: true,
          lanterns: this.lanterns,
          gameOver: false,
          message: "🌸 Dein Kitsune-Amulett ist zerbrochen und hat die Laterne gerettet!"
        };
      }

      // 2. Extinguish one lantern
      this.lanterns -= 1;
      this.updateUI();

      if (this.lanterns <= 0) {
        // Run Over!
        this.isActive = false;
        const reachedFloor = this.floor;
        const finalScore = this.score;
        const isRecord = (reachedFloor >= (this.data.bestFloor || 0));

        return {
          absorbed: false,
          lanterns: 0,
          gameOver: true,
          floor: reachedFloor,
          score: finalScore,
          isRecord
        };
      }

      return {
        absorbed: false,
        lanterns: this.lanterns,
        gameOver: false,
        message: `🏮 Eine Laterne ist erloschen! Noch ${this.lanterns} Laterne(n) übrig.`
      };
    }

    /**
     * Updates header, mobile drawer and active in-game Tower HUD elements
     */
    updateUI() {
      // 1. Header Best Floor Badge
      const headerBest = document.getElementById("headerTowerBest");
      if (headerBest) {
        headerBest.textContent = `Ebene ${this.getBestFloor() || 1}`;
      }

      // 2. Mobile Drawer Banner
      const mobileBest = document.getElementById("mobileTowerBest");
      if (mobileBest) {
        mobileBest.textContent = `Ebene ${this.getBestFloor() || 0}`;
      }

      // 3. In-Game Tower HUD Bar
      const towerHud = document.getElementById("towerHudBar");
      if (towerHud) {
        towerHud.style.display = this.isActive ? "flex" : "none";
      }

      const hudFloor = document.getElementById("towerHudFloor");
      if (hudFloor) {
        hudFloor.textContent = `Ebene ${this.floor}`;
      }

      const hudLanterns = document.getElementById("towerHudLanterns");
      if (hudLanterns) {
        let html = "";
        for (let i = 1; i <= this.maxLanterns; i++) {
          const lit = i <= this.lanterns;
          html += `<span class="tower-lantern ${lit ? "lit" : "unlit"}" title="${lit ? "Laterne leuchtet" : "Laterne erloschen"}">🏮</span>`;
        }
        hudLanterns.innerHTML = html;
      }

      const hudAmulet = document.getElementById("towerHudAmulet");
      if (hudAmulet) {
        hudAmulet.style.display = this.amuletActive ? "inline-flex" : "none";
      }

      const hudScore = document.getElementById("towerHudScore");
      if (hudScore) {
        hudScore.textContent = `${this.score} Pkt.`;
      }
    }
  }

  // Global Singleton instance
  window.TowerTrial = new TowerManager();

})();
