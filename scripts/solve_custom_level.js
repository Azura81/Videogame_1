const { simulateLevel } = require('../tests/level_validator');

function solveLevel(lvl, maxDepth = 45) {
  const DELTA = { "N": [0, -1], "S": [0, 1], "E": [1, 0], "W": [-1, 0] };
  const TURN_LEFT = { "N": "W", "W": "S", "S": "E", "E": "N" };
  const TURN_RIGHT = { "N": "E", "E": "S", "S": "W", "W": "N" };

  const [sx, sy, sd] = lvl.s;
  const w = lvl.w, h = lvl.h;
  const walls = new Set((lvl.walls || []).map(pt => `${pt[0]},${pt[1]}`));
  const sws = lvl.sw || [];
  const gates = lvl.gates || lvl.gate || [];
  const portals = lvl.portals || [];
  const winds = lvl.winds || [];
  const fragile = new Set((lvl.fragile || []).map(p => `${p[0]},${p[1]}`));
  const water = new Set((lvl.water || []).map(w => `${w[0]},${w[1]}`));
  const initialBlocks = (lvl.blocks || []).map(b => [b[0], b[1]]);
  const orbs = (lvl.orbs || []).map(o => `${o[0]},${o[1]}`).sort();
  const orbKey = (collected) => Array.from(collected).sort().join(";");

  const queue = [{
    x: sx, y: sy, d: sd,
    gates: new Set(),
    orbs: new Set(),
    collapsed: new Set(),
    blocks: initialBlocks,
    bridges: new Set(),
    path: []
  }];

  const visited = new Set();
  const blockSig = initialBlocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
  visited.add(`${sx},${sy},${sd}|||${blockSig}|`);

  while (queue.length > 0) {
    const cur = queue.shift();

    // Check win condition
    if (cur.x === lvl.g[0] && cur.y === lvl.g[1]) {
      if (cur.orbs.size === orbs.length) {
        return { solved: true, solution: cur.path, steps: cur.path.length };
      }
    }

    if (cur.path.length >= maxDepth) continue;

    for (const cmd of ["F", "L", "R", "A"]) {
      if (cmd === "L") {
        const nd = TURN_LEFT[cur.d];
        const bSig = cur.blocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
        const cSig = Array.from(cur.collapsed).sort().join(";");
        const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}|${bSig}|${cSig}`;
        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push({
            x: cur.x, y: cur.y, d: nd,
            gates: new Set(cur.gates),
            orbs: new Set(cur.orbs),
            collapsed: new Set(cur.collapsed),
            blocks: cur.blocks.map(b => [b[0], b[1]]),
            bridges: new Set(cur.bridges),
            path: [...cur.path, "L"]
          });
        }
      } else if (cmd === "R") {
        const nd = TURN_RIGHT[cur.d];
        const bSig = cur.blocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
        const cSig = Array.from(cur.collapsed).sort().join(";");
        const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}|${bSig}|${cSig}`;
        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push({
            x: cur.x, y: cur.y, d: nd,
            gates: new Set(cur.gates),
            orbs: new Set(cur.orbs),
            collapsed: new Set(cur.collapsed),
            blocks: cur.blocks.map(b => [b[0], b[1]]),
            bridges: new Set(cur.bridges),
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
          const bSig = cur.blocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
          const cSig = Array.from(cur.collapsed).sort().join(";");
          const stateKey = `${cur.x},${cur.y},${cur.d}|${orbKey(cur.orbs)}|${Array.from(newGates).sort().join(",")}|${bSig}|${cSig}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({
              x: cur.x, y: cur.y, d: cur.d,
              gates: newGates,
              orbs: new Set(cur.orbs),
              collapsed: new Set(cur.collapsed),
              blocks: cur.blocks.map(b => [b[0], b[1]]),
              bridges: new Set(cur.bridges),
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
        const bIdx = newBlocks.findIndex(b => b[0] === nx && b[1] === ny);
        if (bIdx !== -1) {
          const nnx = nx + dx;
          const nny = ny + dy;
          if (nnx < 0 || nny < 0 || nnx >= w || nny >= h) continue;
          if (walls.has(`${nnx},${nny}`)) continue;
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
        while (pushes < 5) {
          const wm = winds.find(w => w[0] === cx && w[1] === cy);
          if (!wm) break;
          const [wdx, wdy] = DELTA[wm[2]];
          const wx = cx + wdx;
          const wy = cy + wdy;
          if (wx < 0 || wy < 0 || wx >= w || wy >= h) break;
          if (walls.has(`${wx},${wy}`)) break;
          if (newBlocks.some(b => b[0] === wx && b[1] === wy)) break;
          const wg = gates.find(g => g[0] === wx && g[1] === wy);
          if (wg && !cur.gates.has(wg[2] || "magenta") && !(gates.length === 1 && cur.gates.size > 0)) break;

          if (fragile.has(`${cx},${cy}`)) {
            newCollapsed.add(`${cx},${cy}`);
          }
          cx = wx;
          cy = wy;
          pushes++;
          if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);

          // Portal on wind landing
          if (portals.length === 2) {
            if (cx === portals[0][0] && cy === portals[0][1]) {
              cx = portals[1][0]; cy = portals[1][1];
            } else if (cx === portals[1][0] && cy === portals[1][1]) {
              cx = portals[0][0]; cy = portals[0][1];
            }
          }
        }

        const bSig = newBlocks.map(b => `${b[0]},${b[1]}`).sort().join(";");
        const cSig = Array.from(newCollapsed).sort().join(";");
        const stateKey = `${cx},${cy},${cur.d}|${orbKey(newOrbs)}|${Array.from(cur.gates).sort().join(",")}|${bSig}|${cSig}`;
        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push({
            x: cx, y: cy, d: cur.d,
            gates: new Set(cur.gates),
            orbs: newOrbs,
            collapsed: newCollapsed,
            blocks: newBlocks,
            bridges: newBridges,
            path: [...cur.path, "F"]
          });
        }
      }
    }
  }

  return { solved: false };
}

module.exports = { solveLevel };
