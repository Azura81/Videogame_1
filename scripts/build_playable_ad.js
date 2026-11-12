/**
 * Build Playable Ad Bundle for Spirit Delivery
 * Reads demo.html and inlines js/three.min.js to generate a single-file
 * standalone HTML playable ad compliant with MRAID and major ad networks
 * (Google App Campaigns, AppLovin, Unity Ads, ironSource, Mintegral, TikTok).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEMO_HTML_PATH = path.join(ROOT_DIR, 'demo.html');
const THREE_JS_PATH = path.join(ROOT_DIR, 'js', 'three.min.js');
const OUTPUT_PATH = path.join(ROOT_DIR, 'playable_ad.html');

console.log('--- Building Standalone Playable Ad Bundle ---');

if (!fs.existsSync(DEMO_HTML_PATH)) {
  console.error('Error: demo.html not found!');
  process.exit(1);
}

if (!fs.existsSync(THREE_JS_PATH)) {
  console.error('Error: js/three.min.js not found!');
  process.exit(1);
}

let htmlContent = fs.readFileSync(DEMO_HTML_PATH, 'utf-8');
const threeJsContent = fs.readFileSync(THREE_JS_PATH, 'utf-8');

// Replace external <script src="js/three.min.js"></script> with inline script
const scriptTag = '<script src="js/three.min.js"></script>';
if (!htmlContent.includes(scriptTag)) {
  console.error('Error: <script src="js/three.min.js"></script> tag not found in demo.html');
  process.exit(1);
}

const inlinedHtml = htmlContent.replace(
  scriptTag,
  `<script>\n/* Inlined Three.js r128 */\n${threeJsContent}\n</script>`
);

fs.writeFileSync(OUTPUT_PATH, inlinedHtml, 'utf-8');

const stats = fs.statSync(OUTPUT_PATH);
const sizeKb = (stats.size / 1024).toFixed(1);
const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`✅ Success: Generated ${OUTPUT_PATH}`);
console.log(`📦 File size: ${sizeKb} KB (${sizeMb} MB)`);
console.log('🚀 Ready to upload to Google Ads, AppLovin, Unity Ads, Meta or test in any browser!');

