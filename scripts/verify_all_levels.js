const fs = require('fs');
const { simulateLevel } = require('../tests/level_validator');

let code = fs.readFileSync('js/levels.js', 'utf8');
code = code.replace(/export\s+/g, '');
const sandbox = {};
eval(code + '\nsandbox.LEVELS = LEVELS;');
const lvls = sandbox.LEVELS;

console.log(`Verifying all ${lvls.length} levels...`);
let failed = 0;
lvls.forEach((lvl, idx) => {
  const num = idx + 1;
  const res = simulateLevel(lvl, lvl.solution);
  if (!res.success) {
    console.error(`❌ Level ${num} "${lvl.n}" failed: ${res.error}`);
    failed++;
  }
});

if (failed === 0) {
  console.log(`✅ ALL ${lvls.length} levels verified and 100% solvable within limits!`);
} else {
  console.error(`💥 ${failed} levels failed verification.`);
  process.exit(1);
}
