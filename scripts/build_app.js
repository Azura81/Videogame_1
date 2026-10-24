const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Building Spirit Delivery for Production / Capacitor ---');

// 1. Run Vite build to compile HTML & CSS
execSync('npx vite build', { stdio: 'inherit' });

const distDir = path.join(__dirname, '..', 'dist');

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copy static JS runtime, icons, textures, and manifests to dist/
copyDirSync(path.join(__dirname, '..', 'js'), path.join(distDir, 'js'));
copyDirSync(path.join(__dirname, '..', 'icons'), path.join(distDir, 'icons'));

const rootFiles = ['manifest.json', 'sw.js', 'shrine_texture.jpg', 'qr.html', 'qrcode.png', 'privacy.html'];
for (const file of rootFiles) {
  const src = path.join(__dirname, '..', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

console.log('✅ Dist build complete! All runtime scripts and assets are packaged in dist/.');
