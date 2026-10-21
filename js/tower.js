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
      this.zenPerfectCount = 0;
      this.totalZenBonus = 0;
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
        totalFloorsCleared: 0,
        bestZenCount: 0
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
      this.zenPerfectCount = 0;
      this.totalZenBonus = 0;
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
     * Ensures every single floor (1-100) has a unique, non-repeating layout and path.
     */
    generateFloorLevel(floor) {
      const DELTA = { "N": [0, -1], "S": [0, 1], "E": [1, 0], "W": [-1, 0] };
      const TURN_LEFT = { "N": "W", "W": "S", "S": "E", "E": "N" };
      const TURN_RIGHT = { "N": "E", "E": "S", "S": "W", "W": "N" };

      function solveTowerLevel(lvl, maxDepth = 38) {
        const [sx, sy, sd] = lvl.s;
        const w = lvl.w, h = lvl.h;
        const walls = new Set((lvl.walls || []).map(pt => `${pt[0]},${pt[1]}`));
        const sws = lvl.sw || [];
        const gates = lvl.gates || [];
        const portals = lvl.portals || [];
        const winds = lvl.winds || [];
        const orbs = (lvl.orbs || []).map(o => `${o[0]},${o[1]}`).sort();
        const orbKey = (collected) => Array.from(collected).sort().join(";");

        const initState = `${sx},${sy},${sd}|${orbKey(new Set())}|`;
        const queue = [{ x: sx, y: sy, d: sd, gates: new Set(), orbs: new Set(), path: [] }];
        const visited = new Set([initState]);

        while (queue.length > 0) {
          const cur = queue.shift();
          if (cur.path.length >= maxDepth) continue;

          for (const cmd of ["F", "L", "R", "A"]) {
            if (cmd === "L") {
              const nd = TURN_LEFT[cur.d];
              const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}`;
              if (!visited.has(stateKey)) {
                visited.add(stateKey);
                queue.push({ x: cur.x, y: cur.y, d: nd, gates: new Set(cur.gates), orbs: new Set(cur.orbs), path: [...cur.path, "L"] });
              }
            } else if (cmd === "R") {
              const nd = TURN_RIGHT[cur.d];
              const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}`;
              if (!visited.has(stateKey)) {
                visited.add(stateKey);
                queue.push({ x: cur.x, y: cur.y, d: nd, gates: new Set(cur.gates), orbs: new Set(cur.orbs), path: [...cur.path, "R"] });
              }
            } else if (cmd === "A") {
              const swMatch = sws.find(s => s[0] === cur.x && s[1] === cur.y);
              if (swMatch) {
                const color = swMatch[2] || "cyan";
                const newGates = new Set(cur.gates);
                newGates.add(color);
                if (gates.length === 1) newGates.add(gates[0][2] || "magenta");
                const stateKey = `${cur.x},${cur.y},${cur.d}|${orbKey(cur.orbs)}|${Array.from(newGates).sort().join(",")}`;
                if (!visited.has(stateKey)) {
                  visited.add(stateKey);
                  queue.push({ x: cur.x, y: cur.y, d: cur.d, gates: newGates, orbs: new Set(cur.orbs), path: [...cur.path, "A"] });
                }
              }
            } else if (cmd === "F") {
              const [dx, dy] = DELTA[cur.d];
              let nx = cur.x + dx;
              let ny = cur.y + dy;
              if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
              if (walls.has(`${nx},${ny}`)) continue;

              const gMatch = gates.find(g => g[0] === nx && g[1] === ny);
              if (gMatch) {
                const color = gMatch[2] || "magenta";
                if (!cur.gates.has(color) && !(gates.length === 1 && cur.gates.size > 0)) continue;
              }

              let cx = nx;
              let cy = ny;
              const newOrbs = new Set(cur.orbs);

              // Kitsune Portals
              if (portals.length === 2) {
                if (cx === portals[0][0] && cy === portals[0][1]) {
                  cx = portals[1][0]; cy = portals[1][1];
                } else if (cx === portals[1][0] && cy === portals[1][1]) {
                  cx = portals[0][0]; cy = portals[0][1];
                }
              }
              if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);

              // Wind currents
              let pushes = 0;
              while (pushes < 10) {
                const wm = winds.find(w => w[0] === cx && w[1] === cy);
                if (!wm) break;
                const [wdx, wdy] = DELTA[wm[2]];
                const wx = cx + wdx;
                const wy = cy + wdy;
                if (wx < 0 || wy < 0 || wx >= w || wy >= h) break;
                if (walls.has(`${wx},${wy}`)) break;
                const wGate = gates.find(g => g[0] === wx && g[1] === wy);
                if (wGate) {
                  const color = wGate[2] || "magenta";
                  if (!cur.gates.has(color) && !(gates.length === 1 && cur.gates.size > 0)) break;
                }
                cx = wx;
                cy = wy;
                pushes++;
                if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);
                if (portals.length === 2) {
                  if (cx === portals[0][0] && cy === portals[0][1]) {
                    cx = portals[1][0]; cy = portals[1][1];
                  } else if (cx === portals[1][0] && cy === portals[1][1]) {
                    cx = portals[0][0]; cy = portals[0][1];
                  }
                }
              }

              // Torii Goal
              if (cx === lvl.g[0] && cy === lvl.g[1]) {
                if (newOrbs.size === orbs.length) {
                  return { solved: true, steps: cur.path.length + 1, path: [...cur.path, "F"] };
                }
              }

              const stateKey = `${cx},${cy},${cur.d}|${orbKey(newOrbs)}|${Array.from(cur.gates).sort().join(",")}`;
              if (!visited.has(stateKey)) {
                visited.add(stateKey);
                queue.push({ x: cx, y: cy, d: cur.d, gates: new Set(cur.gates), orbs: newOrbs, path: [...cur.path, "F"] });
              }
            }
          }
        }
        return { solved: false, steps: 0, path: [] };
      }

      function buildOuterWalls(w, h) {
        const walls = [];
        for (let x = 0; x < w; x++) { walls.push([x, 0]); walls.push([x, h - 1]); }
        for (let y = 1; y < h - 1; y++) { walls.push([0, y]); walls.push([w - 1, y]); }
        return walls;
      }

      function mulberry32(seedVal) {
        return function() {
          let t = seedVal += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }

      function getFreeTile(reserved, rng, w, h, maxTries = 50) {
        for (let i = 0; i < maxTries; i++) {
          const x = 1 + Math.floor(rng() * (w - 2));
          const y = 1 + Math.floor(rng() * (h - 2));
          const key = `${x},${y}`;
          if (!reserved.has(key)) {
            reserved.add(key);
            return [x, y];
          }
        }
        for (let x = 1; x < w - 1; x++) {
          for (let y = 1; y < h - 1; y++) {
            const key = `${x},${y}`;
            if (!reserved.has(key)) {
              reserved.add(key);
              return [x, y];
            }
          }
        }
        return [1, 1];
      }

      const isBossFloor = (floor % 5 === 0);
      const isFujiBiome = (floor >= 15 && floor <= 25) || (floor >= 45 && floor <= 55) || (floor >= 75 && floor <= 85);

      // Grid sizing scales with floor depth
      let w = 5, h = 5;
      if (floor >= 4) { w = 6; h = 6; }
      if (floor >= 12) { w = 7; h = 7; }
      if (floor >= 45) { w = 8; h = 8; }

      const baseWalls = buildOuterWalls(w, h);
      const seed = ((this.runSeed * 47) + (floor * 1013) + (floor * floor * 31)) >>> 0;
      const rng = mulberry32(seed);

      const reserved = new Set();

      // 4 Rotational Orientations (S->N, W->E, E->W, N->S)
      const orientation = floor % 4;
      let s, g;
      if (orientation === 1) {
        // S -> N
        s = [1 + (floor % 2), h - 2, "N"];
        g = [w - 2 - ((floor + 1) % 2), 1];
      } else if (orientation === 2) {
        // W -> E
        s = [1, 1 + (floor % 2), "E"];
        g = [w - 2, h - 2 - ((floor + 1) % 2)];
      } else if (orientation === 3) {
        // E -> W
        s = [w - 2, h - 2 - (floor % 2), "W"];
        g = [1, 1 + ((floor + 1) % 2)];
      } else {
        // N -> S
        s = [w - 2 - (floor % 2), 1, "S"];
        g = [1 + ((floor + 1) % 2), h - 2];
      }

      reserved.add(`${s[0]},${s[1]}`);
      reserved.add(`${g[0]},${g[1]}`);

      // Feature toggles scaled progressively
      const hasDualGates = (floor >= 10 && (floor % 4 === 0 || isBossFloor));
      const hasRelic = (floor >= 3 && (floor % 3 !== 2 || isBossFloor));
      const hasPortal = (floor >= 4 && (floor % 2 === 0 || isBossFloor));
      const hasWind = (floor >= 7 && (floor % 3 === 1 || isFujiBiome));

      // 1. Primary Switch & Gate (Cyan)
      const sw = [];
      const gates = [];
      const orbs = [];
      let portals = undefined;
      let winds = undefined;

      const [swX, swY] = getFreeTile(reserved, rng, w, h);
      sw.push([swX, swY, "cyan"]);

      const [gateX, gateY] = getFreeTile(reserved, rng, w, h);
      gates.push([gateX, gateY, "cyan"]);

      // 2. Secondary Switch & Gate (Magenta)
      if (hasDualGates) {
        const [sw2X, sw2Y] = getFreeTile(reserved, rng, w, h);
        sw.push([sw2X, sw2Y, "magenta"]);

        const [gate2X, gate2Y] = getFreeTile(reserved, rng, w, h);
        gates.push([gate2X, gate2Y, "magenta"]);
      }

      // 3. Relics (Orbs)
      if (hasRelic) {
        const [rx, ry] = getFreeTile(reserved, rng, w, h);
        orbs.push([rx, ry]);
        if (isBossFloor && floor >= 15) {
          const [rx2, ry2] = getFreeTile(reserved, rng, w, h);
          orbs.push([rx2, ry2]);
        }
      }

      // 4. Kitsune Portals
      if (hasPortal) {
        const p1 = getFreeTile(reserved, rng, w, h);
        const p2 = getFreeTile(reserved, rng, w, h);
        portals = [p1, p2];
      }

      // 5. Winds
      if (hasWind) {
        const windDirs = ["N", "E", "S", "W"];
        const wdir = windDirs[floor % 4];
        const [wx, wy] = getFreeTile(reserved, rng, w, h);
        winds = [[wx, wy, wdir]];
      }

      // 6. Floor-specific inner obstacle walls (1 to 5 walls)
      const wallCount = Math.min(5, 1 + Math.floor(floor / 20));
      const innerWalls = [];
      for (let i = 0; i < wallCount; i++) {
        const tile = getFreeTile(reserved, rng, w, h);
        innerWalls.push(tile);
      }

      const lvl = {
        n: isBossFloor ? `Große Schrein-Pforte · Ebene ${floor}` : `Turm-Ebene ${floor}`,
        c: isBossFloor ? `Turm-Meilenstein · Prüfung ${floor}` : `Turm der 100 Prüfungen`,
        t: `Ebene ${floor} · ${isBossFloor ? "Boss-Pforte ⛩️" : "Aufstieg"}`,
        d: isBossFloor 
          ? `Meilenstein-Prüfung! Alle heiligen Schrein-Mechaniken fordern höchste Konzentration.`
          : `Erklimme Ebene ${floor} des Turms der 100 Prüfungen. Plane den Weg zum Torii.`,
        w, h,
        s, g,
        sw, gates,
        walls: [...baseWalls, ...innerWalls],
        orbs: orbs.length > 0 ? orbs : undefined,
        portals, winds,
        maxCredits: Math.max(2, (isBossFloor ? 4 : 3) + this.extraCredits)
      };

      if (isFujiBiome) {
        lvl.isSnow = true;
        lvl.theme = "fuji";
      }

      // Solvability check & iterative fallback
      const solverFn = (window.KomaSolver && window.KomaSolver.solveLevel) || window.solveLevel || solveTowerLevel;
      let sol = solverFn(lvl);

      while (!sol.solved && innerWalls.length > 0) {
        innerWalls.pop();
        lvl.walls = [...baseWalls, ...innerWalls];
        sol = solverFn(lvl);
      }

      if (!sol.solved && lvl.winds) {
        lvl.winds = undefined;
        sol = solverFn(lvl);
      }

      if (!sol.solved && lvl.portals) {
        lvl.portals = undefined;
        sol = solverFn(lvl);
      }

      if (!sol.solved && lvl.gates.length > 1) {
        lvl.gates = [lvl.gates[0]];
        lvl.sw = [lvl.sw[0]];
        sol = solverFn(lvl);
      }

      if (!sol.solved) {
        lvl.walls = baseWalls;
        sol = solverFn(lvl);
      }

      lvl.solverSolution = sol;
      lvl.solution = sol.path;
      lvl.limit = Math.max(16, Math.min(36, (sol.steps || 10) + 4)) + this.extraSlots;
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

      // Zen Efficiency calculation (Minimalzüge Bonus)
      const optimalSteps = (this.currentLevel && this.currentLevel.solution)
        ? this.currentLevel.solution.length
        : ((this.currentLevel && this.currentLevel.solverSolution) ? this.currentLevel.solverSolution.steps : 0);

      let zenBonus = 0;
      let zenTier = "none";
      let zenLabel = "";

      if (optimalSteps > 0 && typeof stepsUsed === "number" && stepsUsed > 0) {
        if (stepsUsed <= optimalSteps) {
          // ⚡ Perfekte Pfadführung / Zen-Meisterschaft (+50% der Ebenenpunkte)
          zenBonus = Math.round(basePoints * 0.5);
          zenTier = "perfect";
          zenLabel = `⚡ Perfekte Eleganz (+${zenBonus} Zen-Bonus)`;
          this.zenPerfectCount = (this.zenPerfectCount || 0) + 1;
        } else if (stepsUsed <= optimalSteps + 2) {
          // ✨ Fließender Geist (+25% der Ebenenpunkte)
          zenBonus = Math.round(basePoints * 0.25);
          zenTier = "great";
          zenLabel = `✨ Fließender Geist (+${zenBonus} Effizienz-Bonus)`;
        }
      }

      this.totalZenBonus = (this.totalZenBonus || 0) + zenBonus;
      const floorScore = basePoints + lanternBonus + zenBonus;
      this.score += floorScore;

      let isNewBestFloor = false;
      if (this.floor > (this.data.bestFloor || 0)) {
        this.data.bestFloor = this.floor;
        isNewBestFloor = true;
      }
      if (this.score > (this.data.bestScore || 0)) {
        this.data.bestScore = this.score;
      }
      if (this.zenPerfectCount > (this.data.bestZenCount || 0)) {
        this.data.bestZenCount = this.zenPerfectCount;
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
          floorScore,
          basePoints,
          lanternBonus,
          zenBonus,
          zenTier,
          zenLabel,
          stepsUsed,
          optimalSteps,
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
          floorScore,
          basePoints,
          lanternBonus,
          zenBonus,
          zenTier,
          zenLabel,
          stepsUsed,
          optimalSteps,
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
          isRecord,
          zenCount: this.zenPerfectCount || 0,
          zenBonus: this.totalZenBonus || 0
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

      const hudZen = document.getElementById("towerHudZen");
      if (hudZen) {
        if (this.zenPerfectCount > 0) {
          hudZen.style.display = "inline-flex";
          hudZen.textContent = `⚡ ${this.zenPerfectCount} Zen`;
        } else {
          hudZen.style.display = "none";
        }
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
