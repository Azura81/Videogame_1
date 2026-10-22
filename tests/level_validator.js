/**
 * Simulator & Validator for Levels 1 to 50
 * Validates that every single level from 1 to 50 is 100% solvable within limit!
 */

function simulateLevel(lvl, solution) {
  const state = {
    x: lvl.s[0],
    y: lvl.s[1],
    dir: lvl.s[2],
    openGates: new Set(),
    collectedOrbs: new Set()
  };

  const deltaMap = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const turnLeft = { N: "W", W: "S", S: "E", E: "N" };
  const turnRight = { N: "E", E: "S", S: "W", W: "N" };
  const hasCoord = (arr, x, y) => (arr || []).some(p => p[0] === x && p[1] === y);
  const allGates = lvl.gates || lvl.gate || [];
  const allSws = lvl.sw || [];

  const fragileTiles = new Set((lvl.fragile || []).map(p => `${p[0]},${p[1]}`));
  const collapsedTiles = new Set();
  const blocks = (lvl.blocks || []).map(b => [b[0], b[1]]);
  const waterTiles = new Set((lvl.water || []).map(w => `${w[0]},${w[1]}`));

  for (let i = 0; i < solution.length; i++) {
    const cmd = solution[i];
    if (cmd === "L") {
      state.dir = turnLeft[state.dir];
    } else if (cmd === "R") {
      state.dir = turnRight[state.dir];
    } else if (cmd === "F") {
      const [dx, dy] = deltaMap[state.dir];
      const nx = state.x + dx;
      const ny = state.y + dy;

      // Pushable block check
      const blockIdx = blocks.findIndex(b => b[0] === nx && b[1] === ny);
      if (blockIdx !== -1) {
        const nnx = nx + dx;
        const nny = ny + dy;
        if (nnx < 0 || nny < 0 || nnx >= lvl.w || nny >= lvl.h || hasCoord(lvl.walls, nnx, nny) || blocks.some(b => b[0] === nnx && b[1] === nny)) {
          return { success: false, error: `Step ${i+1} (${cmd}): Blocked push at (${nnx}, ${nny})` };
        }
        if (waterTiles.has(`${nnx},${nny}`)) {
          waterTiles.delete(`${nnx},${nny}`);
          blocks.splice(blockIdx, 1);
        } else {
          blocks[blockIdx] = [nnx, nny];
        }
      }

      if (nx < 0 || ny < 0 || nx >= lvl.w || ny >= lvl.h) {
        return { success: false, error: `Step ${i+1} (${cmd}): Out of bounds at (${nx}, ${ny})` };
      }
      if (hasCoord(lvl.walls, nx, ny)) {
        return { success: false, error: `Step ${i+1} (${cmd}): Wall collision at (${nx}, ${ny})` };
      }
      if (collapsedTiles.has(`${nx},${ny}`)) {
        return { success: false, error: `Step ${i+1} (${cmd}): Collapsed fragile tile at (${nx}, ${ny})` };
      }
      if (waterTiles.has(`${nx},${ny}`) && !fragileTiles.has(`${nx},${ny}`)) {
        return { success: false, error: `Step ${i+1} (${cmd}): Fell into water at (${nx}, ${ny})` };
      }
      const gateOnTile = allGates.find(g => g[0] === nx && g[1] === ny);
      if (gateOnTile) {
        const color = gateOnTile[2] || "magenta";
        const isOpen = state.openGates.has(color) || (allGates.length === 1 && state.openGates.size > 0);
        if (!isOpen) {
          return { success: false, error: `Step ${i+1} (${cmd}): Blocked by closed gate (${color}) at (${nx}, ${ny})` };
        }
      }

      // If leaving fragile tile, collapse it
      if (fragileTiles.has(`${state.x},${state.y}`)) {
        collapsedTiles.add(`${state.x},${state.y}`);
      }

      state.x = nx;
      state.y = ny;

      // Portal check
      if (lvl.portals && lvl.portals.length === 2) {
        const [p1, p2] = lvl.portals;
        if (nx === p1[0] && ny === p1[1]) {
          state.x = p2[0];
          state.y = p2[1];
        } else if (nx === p2[0] && ny === p2[1]) {
          state.x = p1[0];
          state.y = p1[1];
        }
      }

      // Orb check
      if (lvl.orbs && lvl.orbs.length > 0) {
        const hasOrb = lvl.orbs.some(o => o[0] === state.x && o[1] === state.y);
        if (hasOrb) {
          state.collectedOrbs.add(`${state.x},${state.y}`);
        }
      }
      // Wind check
      if (lvl.winds && lvl.winds.length > 0) {
        let windPushes = 0;
        while (windPushes < 5) {
          const windMatch = lvl.winds.find(w => w[0] === state.x && w[1] === state.y);
          if (!windMatch) break;
          const [wdx, wdy] = deltaMap[windMatch[2]] || [0, 0];
          const wx = state.x + wdx;
          const wy = state.y + wdy;
          const isBlocked = wx < 0 || wy < 0 || wx >= lvl.w || wy >= lvl.h ||
            hasCoord(lvl.walls, wx, wy) ||
            blocks.some(b => b[0] === wx && b[1] === wy) ||
            allGates.some(g => g[0] === wx && g[1] === wy && !state.openGates.has(g[2] || "magenta") && !(allGates.length === 1 && state.openGates.size > 0));
          if (isBlocked) break;

          // If leaving fragile tile, collapse it
          if (fragileTiles.has(`${state.x},${state.y}`)) {
            collapsedTiles.add(`${state.x},${state.y}`);
          }

          state.x = wx;
          state.y = wy;
          windPushes++;

          if (lvl.orbs && lvl.orbs.length > 0) {
            if (lvl.orbs.some(o => o[0] === state.x && o[1] === state.y)) {
              state.collectedOrbs.add(`${state.x},${state.y}`);
            }
          }

          // Check portal on wind landing tile
          if (lvl.portals && lvl.portals.length === 2) {
            const [p1, p2] = lvl.portals;
            if (state.x === p1[0] && state.y === p1[1]) {
              state.x = p2[0];
              state.y = p2[1];
            } else if (state.x === p2[0] && state.y === p2[1]) {
              state.x = p1[0];
              state.y = p1[1];
            }
          }
        }
      }
    } else if (cmd === "A") {
      const swOnTile = allSws.find(s => s[0] === state.x && s[1] === state.y);
      if (swOnTile) {
        const swColor = swOnTile[2] || "cyan";
        state.openGates.add(swColor);
        if (allGates.length === 1) {
          state.openGates.add(allGates[0][2] || "magenta");
        }
      } else {
        return { success: false, error: `Step ${i+1} (${cmd}): Pressed action with no switch at (${state.x}, ${state.y})` };
      }
    }
  }

  // Check goal reached
  if (state.x !== lvl.g[0] || state.y !== lvl.g[1]) {
    return { success: false, error: `Did not reach goal: Ended at (${state.x}, ${state.y}), Goal is (${lvl.g[0]}, ${lvl.g[1]})` };
  }

  // Check all orbs collected
  if (lvl.orbs && state.collectedOrbs.size < lvl.orbs.length) {
    return { success: false, error: `Only collected ${state.collectedOrbs.size} of ${lvl.orbs.length} orbs` };
  }

  if (solution.length > lvl.limit) {
    return { success: false, error: `Solution length ${solution.length} exceeds limit ${lvl.limit}` };
  }

  return { success: true, steps: solution.length, limit: lvl.limit };
}

module.exports = { simulateLevel };
