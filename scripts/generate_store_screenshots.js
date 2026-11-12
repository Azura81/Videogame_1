const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SHOTS = [
  {
    id: 'shot1_plan',
    raw: 'shot1_plan.jpg',
    de: {
      badge: 'LOGIK & PLANUNG',
      title: 'Plane deine Route',
      sub: 'Denke voraus & programmiere deinen Roboter'
    },
    en: {
      badge: 'LOGIC & PLANNING',
      title: 'Plan Your Route',
      sub: 'Think ahead & code your robot\'s path'
    }
  },
  {
    id: 'shot2_home',
    raw: 'shot2_home.jpg',
    de: {
      badge: 'ZEN-DENKSPORT',
      title: 'Train your Brain',
      sub: 'Entspannende Schrein-Rätsel & Kami-Skins'
    },
    en: {
      badge: 'ZEN BRAIN TRAINING',
      title: 'Train your Brain',
      sub: 'Tranquil shrine puzzles & mythical Kami skins'
    }
  },
  {
    id: 'shot3_autumn',
    raw: 'shot3_autumn.jpg',
    de: {
      badge: 'ARASHIYAMA HERBSTWALD',
      title: 'Weiche den Geistern aus',
      sub: 'Hüte dich vor den ruhelosen Yōkai-Wächtern'
    },
    en: {
      badge: 'AUTUMN FOREST OF ARASHIYAMA',
      title: 'Outsmart the Yōkai',
      sub: 'Dodge roaming spirits in the sacred mist'
    }
  },
  {
    id: 'shot4_gates',
    raw: 'shot4_gates.jpg',
    de: {
      badge: 'SCHALTER & MECHANIKEN',
      title: 'Aktiviere heilige Tore',
      sub: 'Finde Schalter & meistere Dual-Barrieren'
    },
    en: {
      badge: 'SWITCHES & MECHANICS',
      title: 'Unlock Sacred Gates',
      sub: 'Trigger switches & solve dual barriers'
    }
  },
  {
    id: 'shot5_portals',
    raw: 'shot5_portals.jpg',
    de: {
      badge: 'KITSUNE PORTALE',
      title: 'Nutze magische Portale',
      sub: 'Teleportiere dich durch uralte Fuchs-Schreine'
    },
    en: {
      badge: 'KITSUNE PORTALS',
      title: 'Harness Kitsune Portals',
      sub: 'Teleport through ancient spiritual shrines'
    }
  }
];

function getHtml(data, imageBase64, isAutumn = false) {
  const accentColor = isAutumn ? '#ff70a6' : '#00f5ff';
  const glowColor = isAutumn ? 'rgba(255, 112, 166, 0.25)' : 'rgba(0, 245, 255, 0.25)';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      width: 1290px;
      height: 2796px;
      background: radial-gradient(ellipse at 50% 30%, #0f2347 0%, #070e1c 70%, #040812 100%);
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #ffffff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 130px 60px 130px 60px;
      position: relative;
    }

    /* Ambient background glow */
    .ambient-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -45%);
      width: 1100px;
      height: 1100px;
      background: radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%);
      filter: blur(100px);
      z-index: 1;
      pointer-events: none;
    }

    /* Top text header container */
    .header {
      width: 100%;
      padding-left: 60px;
      padding-right: 60px;
      text-align: center;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${accentColor};
      background: rgba(255, 255, 255, 0.06);
      border: 1.5px solid ${accentColor};
      padding: 9px 26px;
      border-radius: 999px;
      margin-bottom: 24px;
      box-shadow: 0 0 20px ${glowColor};
    }

    .title {
      font-size: 78px;
      font-weight: 900;
      line-height: 1.12;
      letter-spacing: -1.5px;
      color: #ffffff;
      margin-bottom: 18px;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.6);
    }

    .subtitle {
      font-size: 38px;
      font-weight: 500;
      color: #cbd5e1;
      line-height: 1.35;
      max-width: 1050px;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
    }

    /* Phone frame / Centered Device Mockup */
    .device-container {
      position: relative;
      width: 980px;
      height: 1980px;
      background: #000000;
      border-radius: 58px;
      padding: 16px;
      border: 3.5px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0 30px 100px rgba(0, 0, 0, 0.9), 0 0 60px ${glowColor};
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .device-screen {
      width: 100%;
      height: 100%;
      border-radius: 44px;
      overflow: hidden;
      background: #000000;
      position: relative;
    }

    .screenshot-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>
  <div class="header">
    <div class="badge">${data.badge}</div>
    <h1 class="title">${data.title}</h1>
    <p class="subtitle">${data.sub}</p>
  </div>
  <div class="device-container">
    <div class="device-screen">
      <img class="screenshot-img" src="${imageBase64}" />
    </div>
  </div>
</body>
</html>`;
}

async function generate() {
  console.log('--- Generating App Store Screenshots (1290 x 2796) ---');
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1290, height: 2796 },
    deviceScaleFactor: 1
  });

  const outDirDe = path.join(__dirname, '..', 'AppStore_Screenshots', 'de');
  const outDirEn = path.join(__dirname, '..', 'AppStore_Screenshots', 'en');
  fs.mkdirSync(outDirDe, { recursive: true });
  fs.mkdirSync(outDirEn, { recursive: true });

  const rawDir = path.join(__dirname, '..', 'AppStore_Screenshots', 'raw');

  for (let i = 0; i < SHOTS.length; i++) {
    const shot = SHOTS[i];
    const rawPath = path.join(rawDir, shot.raw);
    const imgData = fs.readFileSync(rawPath).toString('base64');
    const mime = 'image/jpeg';
    const dataUri = `data:${mime};base64,${imgData}`;
    const isAutumn = shot.id.includes('autumn');

    // German
    const htmlDe = getHtml(shot.de, dataUri, isAutumn);
    await page.setContent(htmlDe, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const outPathDe = path.join(outDirDe, `${i + 1}_${shot.id}_de.png`);
    await page.screenshot({ path: outPathDe, type: 'png' });
    console.log(`Generated: ${outPathDe}`);

    // English
    const htmlEn = getHtml(shot.en, dataUri, isAutumn);
    await page.setContent(htmlEn, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const outPathEn = path.join(outDirEn, `${i + 1}_${shot.id}_en.png`);
    await page.screenshot({ path: outPathEn, type: 'png' });
    console.log(`Generated: ${outPathEn}`);
  }

  await browser.close();
  console.log('✅ All App Store Screenshots successfully generated!');
}

generate().catch(err => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});

