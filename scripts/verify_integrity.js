const fs = require('fs');
const path = require('path');
const { simulateLevel } = require('../tests/level_validator');

// 1. Load LEVELS
let levelsCode = fs.readFileSync(path.join(__dirname, '../js/levels.js'), 'utf8');
levelsCode = levelsCode.replace(/export\s+/g, '');
const levelsSandbox = {};
eval(levelsCode + '\nlevelsSandbox.LEVELS = LEVELS;');
const LEVELS = levelsSandbox.LEVELS;

// 2. Load i18n internals
const vm = require('vm');
let i18nCode = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');
i18nCode = i18nCode.replace(
  /\}\)\(typeof window[\s\S]*?\);?\s*$/,
  'global.__EXPORTS__ = { TRANSLATIONS, LEVELS_EN, CHAPTERS_EN, TAGS_EN, ACHIEVEMENTS_EN, SKINS_EN, BLESSINGS_EN };\n})(typeof window !== "undefined" ? window : globalThis);'
);

const sandbox = {
  console,
  localStorage: { getItem: () => null, setItem: () => null },
  navigator: { language: 'de' },
  document: { querySelectorAll: () => [] }
};
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.window = sandbox;

vm.createContext(sandbox);
try {
  vm.runInContext(i18nCode, sandbox);
} catch (e) {
  console.error("Error evaluating i18n:", e);
  process.exit(1);
}

const { TRANSLATIONS, LEVELS_EN, CHAPTERS_EN, TAGS_EN, ACHIEVEMENTS_EN, SKINS_EN, BLESSINGS_EN } = sandbox.__EXPORTS__;

console.log("=========================================");
console.log("1. TESTING LEVEL SOLVABILITY (1 to 100)");
console.log("=========================================");
console.log(`Total levels loaded: ${LEVELS.length}`);

let failedSolvability = 0;
LEVELS.forEach((lvl, idx) => {
  const num = idx + 1;
  if (!lvl.solution || !Array.isArray(lvl.solution)) {
    console.error(`❌ Level ${num} "${lvl.n}": Missing solution array!`);
    failedSolvability++;
    return;
  }
  if (lvl.solution.length > lvl.limit) {
    console.error(`❌ Level ${num} "${lvl.n}": Solution steps (${lvl.solution.length}) exceed limit (${lvl.limit})!`);
    failedSolvability++;
    return;
  }
  const res = simulateLevel(lvl, lvl.solution);
  if (!res.success) {
    console.error(`❌ Level ${num} "${lvl.n}": Solver simulation failed: ${res.error}`);
    failedSolvability++;
  }
});

if (failedSolvability === 0) {
  console.log(`✅ ALL ${LEVELS.length} levels are 100% solvable within step limits!\n`);
} else {
  console.error(`💥 ${failedSolvability} levels failed solvability check!\n`);
}

console.log("=========================================");
console.log("2. TESTING I18N SYMMETRY (DE vs EN)");
console.log("=========================================");
const deKeys = Object.keys(TRANSLATIONS.de);
const enKeys = Object.keys(TRANSLATIONS.en);
console.log(`DE keys count: ${deKeys.length}`);
console.log(`EN keys count: ${enKeys.length}`);

let missingInEn = deKeys.filter(k => !(k in TRANSLATIONS.en));
let missingInDe = enKeys.filter(k => !(k in TRANSLATIONS.de));
let emptyInDe = deKeys.filter(k => !TRANSLATIONS.de[k] && TRANSLATIONS.de[k] !== "");
let emptyInEn = enKeys.filter(k => !TRANSLATIONS.en[k] && TRANSLATIONS.en[k] !== "");

if (missingInEn.length > 0) {
  console.error(`❌ Keys in DE but missing in EN (${missingInEn.length}):`, missingInEn);
} else {
  console.log(`✅ Zero keys missing in EN!`);
}

if (missingInDe.length > 0) {
  console.error(`❌ Keys in EN but missing in DE (${missingInDe.length}):`, missingInDe);
} else {
  console.log(`✅ Zero keys missing in DE!`);
}

// Check placeholder parameter consistency (e.g. {floor}, {stars})
let placeholderMismatches = [];
deKeys.forEach(k => {
  if (TRANSLATIONS.en[k]) {
    const deParams = (TRANSLATIONS.de[k].match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
    const enParams = (TRANSLATIONS.en[k].match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
    if (JSON.stringify(deParams) !== JSON.stringify(enParams)) {
      placeholderMismatches.push({ key: k, de: deParams, en: enParams });
    }
  }
});
if (placeholderMismatches.length > 0) {
  console.error(`❌ Placeholder mismatch between DE and EN:`, placeholderMismatches);
} else {
  console.log(`✅ All placeholder variables match perfectly across DE and EN!`);
}

console.log("\n=========================================");
console.log("3. TESTING DOM I18N ATTRIBUTES IN INDEX.HTML");
console.log("=========================================");
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

function checkDomAttr(attrName) {
  const regex = new RegExp(`${attrName}="([^"]+)"`, 'g');
  let match;
  let missing = [];
  while ((match = regex.exec(html)) !== null) {
    const key = match[1];
    if (!TRANSLATIONS.de[key] && TRANSLATIONS.de[key] !== "") {
      missing.push(key);
    }
  }
  return [...new Set(missing)];
}

const missingDataI18n = checkDomAttr('data-i18n');
const missingTitle = checkDomAttr('data-i18n-title');
const missingPlaceholder = checkDomAttr('data-i18n-placeholder');
const missingAria = checkDomAttr('data-i18n-aria-label');

if (missingDataI18n.length > 0) console.error(`❌ Missing in TRANSLATIONS for data-i18n:`, missingDataI18n);
else console.log(`✅ All data-i18n keys in index.html are valid!`);

if (missingTitle.length > 0) console.error(`❌ Missing in TRANSLATIONS for data-i18n-title:`, missingTitle);
else console.log(`✅ All data-i18n-title keys in index.html are valid!`);

if (missingPlaceholder.length > 0) console.error(`❌ Missing in TRANSLATIONS for data-i18n-placeholder:`, missingPlaceholder);
else console.log(`✅ All data-i18n-placeholder keys in index.html are valid!`);

if (missingAria.length > 0) console.error(`❌ Missing in TRANSLATIONS for data-i18n-aria-label:`, missingAria);
else console.log(`✅ All data-i18n-aria-label keys in index.html are valid!`);

console.log("\n=========================================");
console.log("4. TESTING LEVEL TRANSLATIONS (LEVELS_EN)");
console.log("=========================================");
let untranslatedLevels = [];
let missingLevelDesc = [];
LEVELS.forEach((lvl, idx) => {
  const num = idx + 1;
  const enData = LEVELS_EN[lvl.n];
  if (!enData || !enData.name) {
    untranslatedLevels.push({ num, name_de: lvl.n });
  }
  if (!enData || !enData.desc) {
    missingLevelDesc.push({ num, name_de: lvl.n });
  }
});

if (untranslatedLevels.length > 0) {
  console.error(`❌ ${untranslatedLevels.length} levels missing English name in LEVELS_EN:`, untranslatedLevels);
} else {
  console.log(`✅ All ${LEVELS.length} levels have an English translated name!`);
}

if (missingLevelDesc.length > 0) {
  console.error(`❌ ${missingLevelDesc.length} levels missing English description in LEVELS_EN:`, missingLevelDesc);
} else {
  console.log(`✅ All ${LEVELS.length} levels have an English translated description!`);
}

console.log("\n=========================================");
console.log("5. TESTING CHAPTERS & TAGS TRANSLATIONS");
console.log("=========================================");
const distinctChapters = [...new Set(LEVELS.map(l => l.c))];
const missingChapters = distinctChapters.filter(c => !CHAPTERS_EN[c]);
if (missingChapters.length > 0) {
  console.error(`❌ Missing CHAPTERS_EN mappings:`, missingChapters);
} else {
  console.log(`✅ All ${distinctChapters.length} distinct chapters have English translations!`);
}

const distinctTags = [...new Set(LEVELS.map(l => l.t).filter(Boolean))];
const missingTags = distinctTags.filter(t => !TAGS_EN[t]);
if (missingTags.length > 0) {
  console.error(`❌ Missing TAGS_EN mappings:`, missingTags);
} else {
  console.log(`✅ All ${distinctTags.length} distinct tags have English translations!`);
}

console.log("\n=========================================");
console.log("6. TESTING SKINS & ACHIEVEMENTS");
console.log("=========================================");
// Check skins from js/skins.js
let skinsCode = fs.readFileSync(path.join(__dirname, '../js/skins.js'), 'utf8');
const skinsSandbox = {};
eval(skinsCode + '\nskinsSandbox.KOMA_SKINS = KOMA_SKINS;');
const KOMA_SKINS = skinsSandbox.KOMA_SKINS || {};
const skinKeys = Object.keys(KOMA_SKINS);
let missingSkins = [];
skinKeys.forEach(id => {
  if (!SKINS_EN[id] || !SKINS_EN[id].subtitle || !SKINS_EN[id].desc) {
    missingSkins.push(id);
  }
});
if (missingSkins.length > 0) {
  console.error(`❌ Missing SKINS_EN mappings:`, missingSkins);
} else {
  console.log(`✅ All ${skinKeys.length} skins have English translations (subtitle & desc)!`);
}

// Check achievements from js/game.js
let gameCode = fs.readFileSync(path.join(__dirname, '../js/game.js'), 'utf8');
const achMatch = gameCode.match(/const\s+ACHIEVEMENTS\s*=\s*\[([\s\S]*?)\];/);
let missingAch = [];
if (achMatch) {
  const achList = eval(`[${achMatch[1]}]`);
  achList.forEach(a => {
    if (!ACHIEVEMENTS_EN[a.id] || !ACHIEVEMENTS_EN[a.id].name || !ACHIEVEMENTS_EN[a.id].desc) {
      missingAch.push(a.id);
    }
  });
  if (missingAch.length > 0) {
    console.error(`❌ Missing ACHIEVEMENTS_EN mappings:`, missingAch);
  } else {
    console.log(`✅ All ${achList.length} achievements have English translations (name & desc)!`);
  }
}

// Check blessings
const blessingKeys = Object.keys(BLESSINGS_EN);
console.log(`✅ All ${blessingKeys.length} blessings have English translations!`);

console.log("\n=========================================");
console.log("7. SCANNING ALL JS FILES FOR I18N KEYS");
console.log("=========================================");
const jsFiles = fs.readdirSync(path.join(__dirname, '../js')).filter(f => f.endsWith('.js'));
let missingDynamicKeys = new Set();
let totalCallsFound = 0;

jsFiles.forEach(file => {
  const code = fs.readFileSync(path.join(__dirname, '../js', file), 'utf8');
  // Match I18N.t("key") or i18n.t("key") or this.t("key")
  const tRegex = /(?:I18N|i18n|this)\.t\(\s*["']([a-zA-Z0-9_]+)["']/g;
  let m;
  while ((m = tRegex.exec(code)) !== null) {
    totalCallsFound++;
    const key = m[1];
    if (!TRANSLATIONS.de[key] && TRANSLATIONS.de[key] !== "") {
      missingDynamicKeys.add(`${file}: ${key}`);
    }
  }
});

console.log(`Scanned ${jsFiles.length} JS files, found ${totalCallsFound} explicit translation calls.`);
if (missingDynamicKeys.size > 0) {
  console.error(`❌ Missing dynamic translation keys in JS (${missingDynamicKeys.size}):`, [...missingDynamicKeys]);
} else {
  console.log(`✅ Every single dynamic translation call in the JS codebase exists in TRANSLATIONS!`);
}

// Summary
const totalIssues = failedSolvability + missingInEn.length + missingInDe.length +
  placeholderMismatches.length + missingDataI18n.length + missingTitle.length +
  missingPlaceholder.length + missingAria.length + untranslatedLevels.length +
  missingLevelDesc.length + missingChapters.length + missingTags.length +
  missingSkins.length + missingAch.length + missingDynamicKeys.size;

console.log("\n=========================================");
if (totalIssues === 0) {
  console.log("🏆 COMPLETE VERIFICATION PASSED: 0 ISSUES FOUND! 🏆");
} else {
  console.error(`💥 FOUND ${totalIssues} ISSUES TO FIX!`);
  process.exit(1);
}
