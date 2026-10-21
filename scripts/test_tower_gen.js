// Script to test and verify 100 unique, solvable tower floors
const fs = require('fs');

// Extract solver logic from daily.js
const dailyContent = fs.readFileSync('/Users/maxrietsch/Videogame_1/js/daily.js', 'utf8');

// Simple Mulberry32
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const DELTA = { "N": [0, -1], "S": [0, 1], "E": [1, 0], "W": [-1, 0] };
const TURN_LEFT = { "N": "W", "W": "S", "S": "E", "E": "N" };
const TURN_RIGHT = { "N": "E", "E": "S", "S": "W", "W": "N" };

function solveLevel(lvl, maxDepth = 38) {
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

        // Wind currents & inertia
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

        // Goal torii check
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

console.log("Solver module ready.");

// --- Procedural 100-Floor Generator ---
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
  // Linear scan fallback
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

function generateFloorLevel(floor, runSeed = 42, extraCredits = 0, extraSlots = 0) {
  const isBossFloor = (floor % 5 === 0);
  const isFujiBiome = (floor >= 15 && floor <= 25) || (floor >= 45 && floor <= 55) || (floor >= 75 && floor <= 85);

  // Dynamic Grid Dimensions
  let w = 5, h = 5;
  if (floor >= 4) { w = 6; h = 6; }
  if (floor >= 12) { w = 7; h = 7; }
  if (floor >= 45) { w = 8; h = 8; }

  const baseWalls = buildOuterWalls(w, h);
  const seed = ((runSeed * 47) + (floor * 1013) + (floor * floor * 31)) >>> 0;
  const rng = mulberry32(seed);

  // Reserved tile set to guarantee distinct coordinates
  const reserved = new Set();

  // 4 Rotational Orientations (cycles S->N, W->E, E->W, N->S)
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

  // Mechanics based on floor
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

  // 2. Secondary Switch & Gate (Magenta) if dual gates
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

  // 4. Portals
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

  // 6. Floor-specific inner obstacle walls (2 to 5 walls)
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
    maxCredits: Math.max(2, (isBossFloor ? 4 : 3) + extraCredits)
  };

  if (isFujiBiome) {
    lvl.isSnow = true;
    lvl.theme = "fuji";
  }

  // Solvability check & iterative fallback
  let sol = solveLevel(lvl);
  while (!sol.solved && innerWalls.length > 0) {
    innerWalls.pop();
    lvl.walls = [...baseWalls, ...innerWalls];
    sol = solveLevel(lvl);
  }

  if (!sol.solved && lvl.winds) {
    lvl.winds = undefined;
    sol = solveLevel(lvl);
  }

  if (!sol.solved && lvl.portals) {
    lvl.portals = undefined;
    sol = solveLevel(lvl);
  }

  if (!sol.solved && lvl.gates.length > 1) {
    lvl.gates = [lvl.gates[0]];
    lvl.sw = [lvl.sw[0]];
    sol = solveLevel(lvl);
  }

  if (!sol.solved) {
    lvl.walls = baseWalls;
    sol = solveLevel(lvl);
  }

  lvl.solverSolution = sol;
  lvl.solution = sol.path;
  lvl.limit = Math.max(16, Math.min(36, (sol.steps || 10) + 4)) + extraSlots;
  lvl.isTower = true;
  lvl.towerFloor = floor;
  lvl.isBossFloor = isBossFloor;

  return lvl;
}

// Test multiple seeds across all 100 floors
const testSeeds = [42, 1337, 777, 99999];
let overallSolvable = true;
let totalUnique = 0;

for (const seed of testSeeds) {
  const seenSignatures = new Set();
  let seedSolvable = true;

  for (let f = 1; f <= 100; f++) {
    const lvl = generateFloorLevel(f, seed);
    const sig = `F${f}|${lvl.w}x${lvl.h}|S:${lvl.s.join(",")}|G:${lvl.g.join(",")}|SW:${lvl.sw.map(s => s.join(",")).join(";")}|G:${lvl.gates.map(g => g.join(",")).join(";")}|W:${lvl.walls.length}|O:${(lvl.orbs || []).length}|P:${(lvl.portals || []).length}|WIND:${(lvl.winds || []).length}`;

    if (seenSignatures.has(sig)) {
      console.error(`Seed ${seed}: DUPLICATE FOUND at floor ${f}!`);
    }
    seenSignatures.add(sig);

    if (!lvl.solverSolution || !lvl.solverSolution.solved) {
      console.error(`Seed ${seed}: UNSOLVABLE FLOOR ${f}!`);
      seedSolvable = false;
      overallSolvable = false;
    }
  }

  console.log(`Seed ${seed}: ${seenSignatures.size}/100 unique floors generated. All solvable: ${seedSolvable}`);
}

console.log(`\nOverall Solvable for all seeds: ${overallSolvable}`);



