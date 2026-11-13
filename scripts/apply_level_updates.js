const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../js/levels.js');
let content = fs.readFileSync(filePath, 'utf8');

// Parse LEVELS
let code = content.replace(/export\s+/g, '');
const sandbox = {};
eval(code + '\nsandbox.LEVELS = LEVELS;');
const LEVELS = sandbox.LEVELS;

// 1. Level 62
LEVELS[61] = {
  ...LEVELS[61],
  limit: 20,
  ghosts: [
    { path: [[1, 3], [2, 3], [3, 3], [2, 3], [1, 3], [0, 3]] },
    { path: [[5, 2], [6, 2], [5, 2], [4, 2], [3, 2], [4, 2]] }
  ],
  solution: ["F","F","L","F","F","L","F","A","F","F","F","F","R","F","L","F","L","F"]
};

// 2. Level 64
LEVELS[63] = {
  ...LEVELS[63],
  s: [0, 1, "S"],
  g: [6, 2],
  walls: [[1, 1], [1, 3], [4, 0], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [6, 0]],
  gates: [[4, 1, "cyan"]],
  sw: [[0, 4, "cyan"]],
  orbs: [[6, 6]],
  ghosts: [
    { path: [[3, 2], [3, 1], [3, 0], [3, 1]] },
    { path: [[6, 4], [6, 5], [6, 6], [6, 5]] }
  ],
  limit: 34,
  solution: ["F","F","F","L","A","F","F","L","F","F","F","R","A","F","F","F","R","F","F","F","F","F","L","F","F","L","F","F","F","F","L","F"],
  obstacles: {
    "1,1": "wall_v",
    "1,3": "pine",
    "4,0": "wall_h",
    "4,2": "pine",
    "4,3": "tree",
    "4,4": "house",
    "4,5": "wall_v",
    "4,6": "wall_v",
    "4,7": "pine",
    "6,0": "pine"
  }
};

// 3. Level 73
LEVELS[72] = {
  ...LEVELS[72],
  s: [0, 3, "E"],
  g: [6, 7],
  walls: [
    [0, 0], [0, 5], [1, 0], [1, 5],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [4, 0], [4, 4], [5, 4], [6, 4],
    [6, 1], [4, 6]
  ],
  water: [],
  blocks: [],
  fragile: [],
  portals: [[1, 1], [5, 1]],
  orbs: [[6, 2]],
  ghosts: [
    { path: [[6, 2], [6, 3], [5, 3], [5, 2]] },
    { path: [[5, 6], [5, 5], [6, 5], [6, 6]] }
  ],
  limit: 22,
  solution: ["F","L","F","F","L","L","A","F","L","F","F","R","F","F","F","F","F","R","F"],
  obstacles: {
    "0,0": "tree",
    "0,5": "pine",
    "1,0": "wall_h",
    "1,5": "wall_h",
    "3,0": "wall_v",
    "3,1": "wall_v",
    "3,2": "wall_v",
    "3,3": "fence_v",
    "3,4": "house",
    "3,5": "wall_v",
    "3,6": "tree",
    "3,7": "pine",
    "4,0": "pine",
    "4,4": "wall_h",
    "5,4": "fence_h",
    "6,4": "wall_h",
    "6,1": "pine",
    "4,6": "tree"
  }
};

// 4. Level 74
LEVELS[73] = {
  ...LEVELS[73],
  s: [1, 4, "N"],
  g: [7, 7],
  walls: [
    [0, 5], [1, 0], [1, 5],
    [3, 0], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [5, 5], [6, 0], [6, 1], [6, 3]
  ],
  water: [[3, 1], [3, 2]],
  blocks: [[2, 2]],
  fragile: [],
  orbs: [[5, 2]],
  ghosts: [
    { path: [[5, 2], [6, 2], [5, 2], [4, 2]] },
    { path: [[6, 6], [6, 5], [6, 4], [6, 5]] }
  ],
  limit: 26,
  solution: ["F","F","L","L","L","F","F","F","L","F","R","F","R","A","F","F","F","L","F","F","R","F","F","F"],
  obstacles: {
    "0,5": "tree",
    "1,0": "wall_v",
    "1,5": "tree",
    "3,0": "fence_h",
    "3,3": "pine",
    "3,4": "tree",
    "3,5": "house",
    "3,6": "wall_v",
    "3,7": "wall_v",
    "5,5": "pine",
    "6,0": "pine",
    "6,1": "pine",
    "6,3": "fence_v"
  }
};

// 5. Level 75
LEVELS[74] = {
  ...LEVELS[74],
  s: [1, 1, "S"],
  g: [6, 7],
  walls: [
    [0, 0], [0, 1], [0, 4], [0, 5],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7],
    [3, 0], [3, 4], [3, 5], [3, 6], [3, 7],
    [4, 0], [5, 4], [6, 4], [7, 4],
    [6, 1], [4, 6]
  ],
  water: [[0, 2], [0, 3]],
  blocks: [],
  fragile: [[1, 2], [1, 3]],
  portals: [[1, 6], [5, 1]],
  orbs: [[1, 5], [7, 2]],
  ghosts: [
    { path: [[5, 2], [5, 3], [6, 3], [6, 2]] },
    { path: [[6, 6], [5, 6], [5, 5], [6, 5]] }
  ],
  limit: 29,
  solution: ["F","F","F","F","F","F","F","L","F","F","L","F","L","F","F","F","L","F","F","F","L","A","F","F","R","F","F"],
  obstacles: {
    "0,0": "house",
    "0,1": "wall_v",
    "0,4": "pine",
    "0,5": "tree",
    "2,0": "wall_v",
    "2,1": "wall_v",
    "2,2": "wall_v",
    "2,3": "fence_v",
    "2,4": "wall_v",
    "2,5": "wall_v",
    "2,6": "wall_v",
    "2,7": "wall_v",
    "3,0": "wall_h",
    "3,4": "pine",
    "3,5": "tree",
    "3,6": "wall_v",
    "3,7": "wall_v",
    "4,0": "pine",
    "5,4": "wall_h",
    "6,4": "fence_h",
    "7,4": "wall_h",
    "6,1": "tree",
    "4,6": "pine"
  }
};

// Write updated LEVELS array back to js/levels.js
const newFileContent = `const LEVELS = ${JSON.stringify(LEVELS, null, 2)};\n\nif (typeof module !== "undefined" && module.exports) {\n  module.exports = { LEVELS };\n}\n`;
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('✅ Updated Levels 62, 64, 73, 74, 75 in js/levels.js!');

