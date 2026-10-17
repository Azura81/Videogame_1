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

      if (nx < 0 || ny < 0 || nx >= lvl.w || ny >= lvl.h) {
        return { success: false, error: `Step ${i+1} (${cmd}): Out of bounds at (${nx}, ${ny})` };
      }
      if (hasCoord(lvl.walls, nx, ny)) {
        return { success: false, error: `Step ${i+1} (${cmd}): Wall collision at (${nx}, ${ny})` };
      }
      const gateOnTile = allGates.find(g => g[0] === nx && g[1] === ny);
      if (gateOnTile) {
        const color = gateOnTile[2] || "magenta";
        const isOpen = state.openGates.has(color) || (allGates.length === 1 && state.openGates.size > 0);
        if (!isOpen) {
          return { success: false, error: `Step ${i+1} (${cmd}): Blocked by closed gate (${color}) at (${nx}, ${ny})` };
        }
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
