import { test, expect } from '@playwright/test';

test.describe('Intermediate Boss: Iwa-Komainu · Steinerner Schreinwächter (Level 30)', () => {

  test('Audio: Komainu sound synthesizers execute cleanly without error', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const audioRes = await page.evaluate(() => {
      Sound.init();
      Sound.playKomainuRoar();
      Sound.playKomainuPacified();
      return true;
    });
    expect(audioRes).toBe(true);
  });

  test('Level 30: Loads Boss HUD, 3D Komainu Model, and 2 relics', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 30 (index 29)
    await page.evaluate(() => {
      window.gameInstance.loadLevel(29);
    });

    // Check Boss HUD visibility and labels
    const bossHudVisible = await page.evaluate(() => {
      const hud = document.getElementById('bossHudBar');
      const name = document.getElementById('bossHudName');
      const s1 = document.getElementById('seal1');
      const s2 = document.getElementById('seal2');
      const s3 = document.getElementById('seal3');
      const phase = document.getElementById('bossPhaseBadge');
      return {
        display: window.getComputedStyle(hud).display,
        name: name.textContent,
        s1Lit: s1.classList.contains('lit'),
        s2Lit: s2.classList.contains('lit'),
        s3Hidden: s3.style.display === 'none',
        phaseText: phase.textContent
      };
    });

    expect(bossHudVisible.display).not.toBe('none');
    expect(bossHudVisible.name).toContain('KOMAINU');
    expect(bossHudVisible.s1Lit).toBe(true);
    expect(bossHudVisible.s2Lit).toBe(true);
    expect(bossHudVisible.s3Hidden).toBe(true);
    expect(bossHudVisible.phaseText).toContain('Komainu-Gebrüll');

    // Check 3D Komainu Model in renderer
    const komainuInScene = await page.evaluate(() => {
      const g = window.gameInstance.renderer.komainuGroup;
      return {
        exists: !!g,
        childrenCount: g ? g.children.length : 0,
        name: g ? g.name : null
      };
    });
    expect(komainuInScene.exists).toBe(true);
    expect(komainuInScene.name).toBe('KomainuBossGroup');
  });

  test('Level 30: Solution executes, cages Komainu, and completes successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 30
    await page.evaluate(() => {
      window.gameInstance.loadLevel(29);
      const lvl = window.gameInstance.getCurrentLevel();
      window.gameInstance.queue = [...lvl.solution];
      window.gameInstance.renderQueue();
    });

    // Run queue
    await page.locator('#btnPlay').click();

    // Wait for win modal or completion
    await page.waitForFunction(() => {
      const modal = document.getElementById('modalWin');
      return modal && modal.classList.contains('active');
    }, { timeout: 15000 });

    const winData = await page.evaluate(() => {
      const title = document.getElementById('modalWinTitle');
      const text = document.getElementById('modalWinText');
      return {
        title: title ? title.textContent : '',
        text: text ? text.textContent : '',
        isPacified: window.gameInstance.renderer.isKomainuPacified
      };
    });

    expect(winData.title).toContain('BEZWUNGEN');
    expect(winData.isPacified).toBe(true);
  });

  test('Level 30: Roar hits and fails KOMA if standing unprotected in canyon on step 3', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const failFeedback = await page.evaluate(async () => {
      window.gameInstance.loadLevel(29);
      window.gameInstance.state.x = 3;
      window.gameInstance.state.y = 3;
      window.gameInstance.state.blocks = [[1, 1]]; // block not shielding
      window.gameInstance.processBossBreath(window.gameInstance.getCurrentLevel(), 3);
      await new Promise(r => setTimeout(r, 700));
      return {
        isFail: window.gameInstance.state.isFail,
        feedback: document.getElementById('feedbackText')?.textContent || ''
      };
    });

    expect(failFeedback.isFail).toBe(true);
    expect(failFeedback.feedback).toContain('Gebrüll');
  });
});
