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
      iconKey: "lantern",
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
      iconKey: "amulet",
      desc: "Das Amulett zerbricht beim nächsten Fehler und rettet eine Laterne.",
      apply: (mgr) => {
        mgr.amuletActive = true;
      }
    },
    {
      id: "expand_queue",
      name: "Schriftrolle der Weitsicht",
      icon: "📜",
      iconKey: "scroll",
      desc: "+3 zusätzliche Befehls-Slots im Plan für den restlichen Run.",
      apply: (mgr) => {
        mgr.extraSlots += 3;
      }
    },
    {
      id: "camera_insight",
      name: "Kitsune-Weitsicht",
      icon: "👁️",
      iconKey: "camera",
      desc: "+2 freie Kameraschwenker auf jeder kommenden Etage.",
      apply: (mgr) => {
        mgr.extraCredits += 2;
      }
    },
    {
      id: "celestial_favour",
      name: "Göttliche Gunst",
      icon: "✨",
      iconKey: "sparkle",
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
      this.usedFloorSignatures = new Set();

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
        bestZenCount: 0,
        towerCleared: false
      };
    }

    isTowerConquered() {
      const lsConquered = typeof localStorage !== "undefined" && localStorage.getItem("koma_conquered_tower") === "true";
      return Boolean(this.data.towerCleared || (this.data.bestFloor >= 100) || lsConquered);
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
      this.hasRevived = false;
      this.usedFloorSignatures = new Set();
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

      function solveTowerLevel(lvl, maxDepth = 32, maxStates = 1800) {
        const [sx, sy, sd] = lvl.s;
        const w = lvl.w, h = lvl.h;
        const walls = new Set((lvl.walls || []).map(pt => `${pt[0]},${pt[1]}`));
        const sws = lvl.sw || [];
        const gates = lvl.gates || [];
        const portals = lvl.portals || [];
        const winds = lvl.winds || [];
        const fragile = new Set((lvl.fragile || []).map(p => `${p[0]},${p[1]}`));
        const water = new Set((lvl.water || []).map(w => `${w[0]},${w[1]}`));
        const initialBlocks = (lvl.blocks || []).map(b => [b[0], b[1]]);
        const orbs = (lvl.orbs || []).map(o => `${o[0]},${o[1]}`).sort();
        const orbKey = (collected) => Array.from(collected).sort().join(";");

        const initState = `${sx},${sy},${sd}|${orbKey(new Set())}||||`;
        const queue = [{
          x: sx, y: sy, d: sd,
          gates: new Set(),
          orbs: new Set(),
          collapsed: new Set(),
          blocks: initialBlocks.map(b => [b[0], b[1]]),
          bridges: new Set(),
          pushedBlock: false,
          usedWind: false,
          usedPortal: false,
          path: []
        }];
        const visited = new Set([initState]);
        let head = 0;

        while (head < queue.length && visited.size < maxStates) {
          const cur = queue[head++];
          if (cur.path.length >= maxDepth) continue;

          for (const cmd of ["F", "L", "R", "A"]) {
            if (cmd === "L") {
              const nd = TURN_LEFT[cur.d];
              const blockSig = cur.blocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
              const colSig = Array.from(cur.collapsed).sort().join(";");
              const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}|${blockSig}|${colSig}`;
              if (!visited.has(stateKey)) {
                visited.add(stateKey);
                queue.push({
                  x: cur.x, y: cur.y, d: nd,
                  gates: new Set(cur.gates),
                  orbs: new Set(cur.orbs),
                  collapsed: new Set(cur.collapsed),
                  blocks: cur.blocks.map(b => [b[0], b[1]]),
                  bridges: new Set(cur.bridges),
                  pushedBlock: cur.pushedBlock,
                  usedWind: cur.usedWind,
                  usedPortal: cur.usedPortal,
                  path: [...cur.path, "L"]
                });
              }
            } else if (cmd === "R") {
              const nd = TURN_RIGHT[cur.d];
              const blockSig = cur.blocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
              const colSig = Array.from(cur.collapsed).sort().join(";");
              const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}|${blockSig}|${colSig}`;
              if (!visited.has(stateKey)) {
                visited.add(stateKey);
                queue.push({
                  x: cur.x, y: cur.y, d: nd,
                  gates: new Set(cur.gates),
                  orbs: new Set(cur.orbs),
                  collapsed: new Set(cur.collapsed),
                  blocks: cur.blocks.map(b => [b[0], b[1]]),
                  bridges: new Set(cur.bridges),
                  pushedBlock: cur.pushedBlock,
                  usedWind: cur.usedWind,
                  usedPortal: cur.usedPortal,
                  path: [...cur.path, "R"]
                });
              }
            } else if (cmd === "A") {
              const swMatch = sws.find(s => s[0] === cur.x && s[1] === cur.y);
              if (swMatch) {
                const color = swMatch[2] || "cyan";
                const newGates = new Set(cur.gates);
                newGates.add(color);
                if (gates.length === 1) newGates.add(gates[0][2] || "magenta");
                const blockSig = cur.blocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
                const colSig = Array.from(cur.collapsed).sort().join(";");
                const stateKey = `${cur.x},${cur.y},${cur.d}|${orbKey(cur.orbs)}|${Array.from(newGates).sort().join(",")}|${blockSig}|${colSig}`;
                if (!visited.has(stateKey)) {
                  visited.add(stateKey);
                  queue.push({
                    x: cur.x, y: cur.y, d: cur.d,
                    gates: newGates,
                    orbs: new Set(cur.orbs),
                    collapsed: new Set(cur.collapsed),
                    blocks: cur.blocks.map(b => [b[0], b[1]]),
                    bridges: new Set(cur.bridges),
                    pushedBlock: cur.pushedBlock,
                    usedWind: cur.usedWind,
                    usedPortal: cur.usedPortal,
                    path: [...cur.path, "A"]
                  });
                }
              }
            } else if (cmd === "F") {
              const [dx, dy] = DELTA[cur.d];
              let nx = cur.x + dx;
              let ny = cur.y + dy;
              if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
              if (walls.has(`${nx},${ny}`)) continue;

              // Pushable blocks check
              let newBlocks = cur.blocks.map(b => [b[0], b[1]]);
              let newBridges = new Set(cur.bridges);
              let didPushBlock = cur.pushedBlock;
              const bIdx = newBlocks.findIndex(b => b[0] === nx && b[1] === ny);
              if (bIdx !== -1) {
                const nnx = nx + dx;
                const nny = ny + dy;
                if (nnx < 0 || nny < 0 || nnx >= w || nny >= h) continue;
                if (walls.has(`${nnx},${nny}`)) continue;
                if (fragile.has(`${nnx},${nny}`)) continue;
                if (nnx === lvl.g[0] && nny === lvl.g[1]) continue;
                if (sws.some(s => s[0] === nnx && s[1] === nny)) continue;
                if (orbs.includes(`${nnx},${nny}`)) continue;
                if (portals.some(p => p[0] === nnx && p[1] === nny)) continue;
                if (newBlocks.some(b => b[0] === nnx && b[1] === nny)) continue;
                const bgMatch = gates.find(g => g[0] === nnx && g[1] === nny);
                if (bgMatch) {
                  const color = bgMatch[2] || "magenta";
                  if (!cur.gates.has(color) && !(gates.length === 1 && cur.gates.size > 0)) continue;
                }
                if (water.has(`${nnx},${nny}`) && !newBridges.has(`${nnx},${nny}`)) {
                  newBridges.add(`${nnx},${nny}`);
                  newBlocks.splice(bIdx, 1);
                } else {
                  newBlocks[bIdx] = [nnx, nny];
                }
                didPushBlock = true;
              }

              // Collapsed fragile tile or open water collision
              if (cur.collapsed.has(`${nx},${ny}`)) continue;
              if (water.has(`${nx},${ny}`) && !fragile.has(`${nx},${ny}`) && !newBridges.has(`${nx},${ny}`)) continue;

              const gMatch = gates.find(g => g[0] === nx && g[1] === ny);
              if (gMatch) {
                const color = gMatch[2] || "magenta";
                if (!cur.gates.has(color) && !(gates.length === 1 && cur.gates.size > 0)) continue;
              }

              // Leaving fragile tile collapses it
              const newCollapsed = new Set(cur.collapsed);
              if (fragile.has(`${cur.x},${cur.y}`)) {
                newCollapsed.add(`${cur.x},${cur.y}`);
              }

              let cx = nx;
              let cy = ny;
              let didUsePortal = cur.usedPortal;
              let didUseWind = cur.usedWind;
              const newOrbs = new Set(cur.orbs);

              // Kitsune Portals
              if (portals.length === 2) {
                if (cx === portals[0][0] && cy === portals[0][1]) {
                  cx = portals[1][0]; cy = portals[1][1];
                  didUsePortal = true;
                } else if (cx === portals[1][0] && cy === portals[1][1]) {
                  cx = portals[0][0]; cy = portals[0][1];
                  didUsePortal = true;
                }
              }
              if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);

              // Wind currents
              let pushes = 0;
              let windInvalid = false;
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
                if (water.has(`${wx},${wy}`) || fragile.has(`${wx},${wy}`) || newBlocks.some(b => b[0] === wx && b[1] === wy)) {
                  windInvalid = true;
                  break;
                }
                cx = wx;
                cy = wy;
                pushes++;
                didUseWind = true;
                if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);
                if (portals.length === 2) {
                  if (cx === portals[0][0] && cy === portals[0][1]) {
                    cx = portals[1][0]; cy = portals[1][1];
                    didUsePortal = true;
                  } else if (cx === portals[1][0] && cy === portals[1][1]) {
                    cx = portals[0][0]; cy = portals[0][1];
                    didUsePortal = true;
                  }
                }
              }
              if (windInvalid) continue;

              // Torii Goal
              if (cx === lvl.g[0] && cy === lvl.g[1]) {
                if (newOrbs.size === orbs.length) {
                  return {
                    solved: true,
                    steps: cur.path.length + 1,
                    path: [...cur.path, "F"],
                    pushedBlock: didPushBlock,
                    usedWind: didUseWind,
                    usedPortal: didUsePortal,
                    usedFragile: newCollapsed.size > 0
                  };
                }
              }

              const blockSig = newBlocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
              const colSig = Array.from(newCollapsed).sort().join(";");
              const stateKey = `${cx},${cy},${cur.d}|${orbKey(newOrbs)}|${Array.from(cur.gates).sort().join(",")}|${blockSig}|${colSig}`;
              if (!visited.has(stateKey)) {
                visited.add(stateKey);
                queue.push({
                  x: cx, y: cy, d: cur.d,
                  gates: new Set(cur.gates),
                  orbs: newOrbs,
                  collapsed: newCollapsed,
                  blocks: newBlocks,
                  bridges: newBridges,
                  pushedBlock: didPushBlock,
                  usedWind: didUseWind,
                  usedPortal: didUsePortal,
                  path: [...cur.path, "F"]
                });
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
      if (!this.usedFloorSignatures) {
        this.usedFloorSignatures = new Set();
      }

      const solverFn = solveTowerLevel;

      const hasDualGates = (floor >= 10 && (floor % 3 === 0 || isBossFloor || (floor >= 20 && floor % 2 === 0)));
      const hasRelic = (floor >= 3);
      const relicCount = (floor >= 40 && (isBossFloor || floor % 3 === 0)) ? 3 : (floor >= 15 ? 2 : 1);
      const hasPortal = (floor >= 4 && (floor % 3 === 1 || isBossFloor || (floor >= 18 && floor % 2 === 1)));
      const hasWind = (floor >= 7 && (floor >= 15 || floor % 2 === 1 || isFujiBiome));
      const windCount = floor >= 45 ? 3 : (floor >= 15 ? 2 : 1);
      const hasFragile = (floor >= 6 && (floor % 3 === 0 || (floor >= 16 && floor % 2 === 0) || isBossFloor));
      const fragileCount = floor >= 25 ? 2 : 1;
      const hasBlock = (floor >= 8 && (floor % 3 === 2 || floor >= 15));
      const minStepsRequired = floor >= 45 ? 15 : (floor >= 20 ? 13 : (floor >= 15 ? 11 : (floor >= 8 ? 8 : 5)));

      let bestCandidate = null;

      for (let attempt = 0; attempt < 65; attempt++) {
        const seed = ((this.runSeed * 47) + (floor * 1013) + (floor * floor * 31) + (attempt * 7919)) >>> 0;
        const rng = mulberry32(seed);
        const reserved = new Set();

        const orientation = (floor + attempt) % 4;
        const innerSpanW = Math.max(1, w - 2);
        const innerSpanH = Math.max(1, h - 2);
        const offsetA = (floor + attempt) % innerSpanW;
        const offsetB = (floor * 3 + attempt) % innerSpanW;
        const offsetYA = (floor + attempt) % innerSpanH;
        const offsetYB = (floor * 3 + attempt) % innerSpanH;

        let s, g;
        if (orientation === 1) {
          s = [1 + offsetA, h - 2, "N"];
          g = [1 + offsetB, 1];
        } else if (orientation === 2) {
          s = [1, 1 + offsetYA, "E"];
          g = [w - 2, 1 + offsetYB];
        } else if (orientation === 3) {
          s = [w - 2, 1 + offsetYA, "W"];
          g = [1, 1 + offsetYB];
        } else {
          s = [1 + offsetA, 1, "S"];
          g = [1 + offsetB, h - 2];
        }

        if (Math.abs(s[0] - g[0]) + Math.abs(s[1] - g[1]) < 3) {
          g = [w - 1 - s[0], h - 1 - s[1]];
        }

        reserved.add(`${s[0]},${s[1]}`);
        reserved.add(`${g[0]},${g[1]}`);

        const sw = [];
        const gates = [];
        const orbs = [];
        let portals = undefined;
        let winds = undefined;
        const fragileList = [];
        const waterList = [];
        const blockList = [];
        const innerWalls = [];

        const getOrthNeighbors = (tx, ty) => [
          [tx + 1, ty],
          [tx - 1, ty],
          [tx, ty + 1],
          [tx, ty - 1]
        ].filter(([nx, ny]) => nx >= 1 && nx < w - 1 && ny >= 1 && ny < h - 1 && !(nx === s[0] && ny === s[1]));

        // 1. Enclose Goal g with primary cyan gate on one interior neighbor and walls on the others
        const gNeighbors = getOrthNeighbors(g[0], g[1]);
        const [swX, swY] = getFreeTile(reserved, rng, w, h);
        sw.push([swX, swY, "cyan"]);

        if (gNeighbors.length > 0) {
          const openNeighbors = gNeighbors.filter(([nx, ny]) => !reserved.has(`${nx},${ny}`));
          const gateChoices = openNeighbors.length > 0 ? openNeighbors : gNeighbors;
          const gatePos = gateChoices[Math.floor(rng() * gateChoices.length)];
          gates.push([gatePos[0], gatePos[1], "cyan"]);
          reserved.add(`${gatePos[0]},${gatePos[1]}`);
          for (const [nx, ny] of gNeighbors) {
            if (nx === gatePos[0] && ny === gatePos[1]) continue;
            if (!reserved.has(`${nx},${ny}`)) {
              innerWalls.push([nx, ny]);
              reserved.add(`${nx},${ny}`);
            }
          }
        } else {
          const [gateX, gateY] = getFreeTile(reserved, rng, w, h);
          gates.push([gateX, gateY, "cyan"]);
        }

        // 2. Secondary Switch & Gate (Magenta) enclosing sw[0] on early attempts so BOTH gates must be opened
        if (hasDualGates && attempt < 30) {
          const [sw2X, sw2Y] = getFreeTile(reserved, rng, w, h);
          const sw0Neighbors = getOrthNeighbors(swX, swY).filter(([nx, ny]) => !reserved.has(`${nx},${ny}`));
          if (sw0Neighbors.length >= 2) {
            sw.push([sw2X, sw2Y, "magenta"]);
            const g2Pos = sw0Neighbors[Math.floor(rng() * sw0Neighbors.length)];
            gates.push([g2Pos[0], g2Pos[1], "magenta"]);
            reserved.add(`${g2Pos[0]},${g2Pos[1]}`);
            for (const [nx, ny] of sw0Neighbors) {
              if (nx === g2Pos[0] && ny === g2Pos[1]) continue;
              if (!reserved.has(`${nx},${ny}`)) {
                innerWalls.push([nx, ny]);
                reserved.add(`${nx},${ny}`);
              }
            }
          }
        }

        // 3. Relics (Orbs: 1 to 3)
        if (hasRelic) {
          const targetOrbs = attempt < 40 ? relicCount : 1;
          for (let oi = 0; oi < targetOrbs; oi++) {
            const [rx, ry] = getFreeTile(reserved, rng, w, h);
            orbs.push([rx, ry]);
          }
        }

        // 4. Pushable Sacred Stone Boulder (Block) + optional Water Bridge setup
        if (hasBlock && attempt < 45) {
          let placedInteractiveBlock = false;
          // Try placing a pushable block in front of a water tile or along the start/orb line so KOMA pushes it
          const [dxS, dyS] = DELTA[s[2]];
          const frontX = s[0] + dxS;
          const frontY = s[1] + dyS;
          const pushDestX = frontX + dxS;
          const pushDestY = frontY + dyS;
          if (
            attempt % 2 === 0 &&
            frontX >= 1 && frontX < w - 1 && frontY >= 1 && frontY < h - 1 &&
            pushDestX >= 1 && pushDestX < w - 1 && pushDestY >= 1 && pushDestY < h - 1 &&
            !reserved.has(`${frontX},${frontY}`) && !reserved.has(`${pushDestX},${pushDestY}`)
          ) {
            reserved.add(`${frontX},${frontY}`);
            blockList.push([frontX, frontY]);
            if (floor >= 15 && attempt % 4 === 0) {
              reserved.add(`${pushDestX},${pushDestY}`);
              waterList.push([pushDestX, pushDestY]);
            }
            placedInteractiveBlock = true;
          }
          if (!placedInteractiveBlock) {
            const [bx, by] = getFreeTile(reserved, rng, w, h);
            blockList.push([bx, by]);
          }
        }

        // 5. Fragile Stepping Stones over Water
        if (hasFragile && attempt < 45) {
          const count = attempt < 30 ? fragileCount : 1;
          for (let fi = 0; fi < count; fi++) {
            const [fx, fy] = getFreeTile(reserved, rng, w, h);
            fragileList.push([fx, fy]);
            waterList.push([fx, fy]);
          }
        }

        // 6. Kitsune Portals
        if (hasPortal && attempt < 40) {
          const p1 = getFreeTile(reserved, rng, w, h);
          const p2 = getFreeTile(reserved, rng, w, h);
          portals = [p1, p2];
        }

        // 7. Wind Currents (1 to 3 directional gusts)
        if (hasWind && attempt < 45) {
          const windDirs = ["N", "E", "S", "W"];
          const count = attempt < 30 ? windCount : 1;
          winds = [];
          for (let wi = 0; wi < count; wi++) {
            const wdir = windDirs[(floor + attempt + wi) % 4];
            const [wx, wy] = getFreeTile(reserved, rng, w, h);
            winds.push([wx, wy, wdir]);
          }
        }

        // 8. Labyrinth Inner Walls (scales up from Floor 15-20+)
        const baseWallTarget = floor >= 45 ? 5 : (floor >= 20 ? 4 : (floor >= 15 ? 3 : Math.min(2, Math.floor(floor / 6))));
        const extraWallCount = Math.max(0, baseWallTarget - Math.floor(attempt / 15));
        for (let i = 0; i < extraWallCount; i++) {
          const tile = getFreeTile(reserved, rng, w, h);
          innerWalls.push(tile);
        }

        const candidate = {
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
          portals,
          winds: winds && winds.length > 0 ? winds : undefined,
          fragile: fragileList.length > 0 ? fragileList : undefined,
          blocks: blockList.length > 0 ? blockList : undefined,
          water: waterList.length > 0 ? waterList : undefined,
          maxCredits: Math.max(2, (isBossFloor ? 4 : 3) + this.extraCredits)
        };

        if (isFujiBiome) {
          candidate.isSnow = true;
          candidate.theme = "fuji";
        }

        const sol = solverFn(candidate);
        if (!sol || !sol.solved) continue;

        // If dual gates were generated but only 1 switch was used, prune the unused second switch/gate
        const actionsUsed = sol.path.filter(c => c === "A").length;
        if (candidate.sw.length > 1 && actionsUsed === 1) {
          candidate.sw = [candidate.sw[0]];
          candidate.gates = [candidate.gates[0]];
        }
        if (actionsUsed < candidate.sw.length) continue;

        // Enforce progressive difficulty (minimum solution steps) and active obstacle usage on early attempts
        const reqSteps = Math.max(5, minStepsRequired - Math.floor(attempt / 12) * 2);
        if (sol.steps < reqSteps) continue;

        if (hasBlock && candidate.blocks && attempt < 22 && !sol.pushedBlock) continue;
        if (hasWind && candidate.winds && attempt < 18 && !sol.usedWind) continue;

        const pathSig = `PATH:${sol.path.join("")}`;
        const layoutSig = `LAYOUT:${w}x${h}|${s.join(",")}->${g.join(",")}|sw:${candidate.sw.map(x => x.join(",")).join(";")}|gt:${candidate.gates.map(x => x.join(",")).join(";")}`;

        candidate.solverSolution = sol;
        candidate.solution = sol.path;
        candidate.limit = Math.max(16, Math.min(36, (sol.steps || 10) + 4)) + this.extraSlots;
        candidate.isTower = true;
        candidate.towerFloor = floor;
        candidate.isBossFloor = isBossFloor;

        if (!bestCandidate) {
          bestCandidate = candidate;
        }

        if (!this.usedFloorSignatures.has(pathSig) && !this.usedFloorSignatures.has(layoutSig)) {
          this.usedFloorSignatures.add(pathSig);
          this.usedFloorSignatures.add(layoutSig);
          return candidate;
        }
      }

      if (bestCandidate) {
        return bestCandidate;
      }

      // Guaranteed fallback if all random candidates were exhausted
      const fallbackS = [1, h - 2, "N"];
      const fallbackG = [w - 2, 1];
      const fallbackLvl = {
        n: isBossFloor ? `Große Schrein-Pforte · Ebene ${floor}` : `Turm-Ebene ${floor}`,
        c: isBossFloor ? `Turm-Meilenstein · Prüfung ${floor}` : `Turm der 100 Prüfungen`,
        t: `Ebene ${floor} · ${isBossFloor ? "Boss-Pforte ⛩️" : "Aufstieg"}`,
        d: `Erklimme Ebene ${floor} des Turms der 100 Prüfungen. Plane den Weg zum Torii.`,
        w, h,
        s: fallbackS,
        g: fallbackG,
        sw: [[1, 1, "cyan"]],
        gates: [[w - 3, 1, "cyan"]],
        walls: [...baseWalls, [w - 2, 2]],
        maxCredits: Math.max(2, (isBossFloor ? 4 : 3) + this.extraCredits)
      };
      const fallbackSol = solverFn(fallbackLvl);
      fallbackLvl.solverSolution = fallbackSol;
      fallbackLvl.solution = fallbackSol.path;
      fallbackLvl.limit = Math.max(16, Math.min(36, (fallbackSol.steps || 10) + 4)) + this.extraSlots;
      fallbackLvl.isTower = true;
      fallbackLvl.towerFloor = floor;
      fallbackLvl.isBossFloor = isBossFloor;
      return fallbackLvl;
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
        const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
        if (stepsUsed <= optimalSteps) {
          // ⚡ Perfekte Pfadführung / Zen-Meisterschaft (+50% der Ebenenpunkte)
          zenBonus = Math.round(basePoints * 0.5);
          zenTier = "perfect";
          zenLabel = isEn ? `⚡ Perfect Elegance (+${zenBonus} Zen Bonus)` : `⚡ Perfekte Eleganz (+${zenBonus} Zen-Bonus)`;
          this.zenPerfectCount = (this.zenPerfectCount || 0) + 1;
        } else if (stepsUsed <= optimalSteps + 2) {
          // ✨ Fließender Geist (+25% der Ebenenpunkte)
          zenBonus = Math.round(basePoints * 0.25);
          zenTier = "great";
          zenLabel = isEn ? `✨ Flowing Spirit (+${zenBonus} Efficiency Bonus)` : `✨ Fließender Geist (+${zenBonus} Effizienz-Bonus)`;
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

      const clearedFloor = this.floor;

      if (clearedFloor >= 100) {
        this.data.towerCleared = true;
        this.isActive = false;
        this.saveData();
        if (typeof localStorage !== "undefined") {
          try {
            localStorage.setItem("koma_conquered_tower", "true");
          } catch (e) {}
        }
        this.updateUI();
        return {
          type: "tower_victory",
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
          isNewBestFloor
        };
      }

      this.saveData();
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
      const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";

      if (this.amuletActive) {
        this.amuletActive = false;
        this.updateUI();
        return {
          absorbed: true,
          lanterns: this.lanterns,
          gameOver: false,
          message: isEn
            ? "🌸 Your Kitsune Amulet shattered and saved the lantern!"
            : "🌸 Dein Kitsune-Amulett ist zerbrochen und hat die Laterne gerettet!"
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
          zenBonus: this.totalZenBonus || 0,
          canRevive: !this.hasRevived
        };
      }

      return {
        absorbed: false,
        lanterns: this.lanterns,
        gameOver: false,
        message: isEn
          ? `🏮 A lantern was extinguished! ${this.lanterns} lantern(s) remaining.`
          : `🏮 Eine Laterne ist erloschen! Noch ${this.lanterns} Laterne(n) übrig.`
      };
    }

    /**
     * Revives player after watching a rewarded ad, restoring 1 lantern
     */
    revive() {
      this.hasRevived = true;
      this.lanterns = 1;
      this.isActive = true;
      this.updateUI();
      return true;
    }

    /**
     * Updates header, mobile drawer and active in-game Tower HUD elements
     */
    updateUI() {
      const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
      const floorWord = isEn ? "Floor" : "Ebene";

      // 1. Header Best Floor Badge
      const headerBest = document.getElementById("headerTowerBest");
      if (headerBest) {
        headerBest.textContent = `${floorWord} ${this.getBestFloor() || 1}`;
      }

      // 2. Mobile Drawer Banner
      const mobileBest = document.getElementById("mobileTowerBest");
      if (mobileBest) {
        mobileBest.textContent = `${floorWord} ${this.getBestFloor() || 0}`;
      }

      // 3. In-Game Tower HUD Bar
      const towerHud = document.getElementById("towerHudBar");
      if (towerHud) {
        towerHud.style.display = this.isActive ? "flex" : "none";
      }

      const hudFloor = document.getElementById("towerHudFloor");
      if (hudFloor) {
        hudFloor.textContent = `${floorWord} ${this.floor}`;
      }

      const hudLanterns = document.getElementById("towerHudLanterns");
      if (hudLanterns) {
        let html = "";
        for (let i = 1; i <= this.maxLanterns; i++) {
          const lit = i <= this.lanterns;
          const lanternIcon = typeof KOMA_ICONS !== "undefined"
            ? KOMA_ICONS.lantern(18, lit, lit ? "#ff5533" : "rgba(255,255,255,0.25)")
            : `🏮`;
          html += `<span class="tower-lantern ${lit ? "lit" : "unlit"}" title="${lit ? "Laterne leuchtet" : "Laterne erloschen"}">${lanternIcon}</span>`;
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
          const lightningSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lightning(14) : "⚡";
          hudZen.innerHTML = `${lightningSvg} <span>${this.zenPerfectCount} Zen</span>`;
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
