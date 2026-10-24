import { test, expect } from '@playwright/test';

test.describe('New Mechanics: Fragile Tiles and Pushable Blocks', () => {

  test('Audio: Fragile stone and block pushing sound synthesizers execute cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const audioRes = await page.evaluate(() => {
      Sound.init();
      Sound.playCrack();
      Sound.playSplash();
      Sound.playStoneSlide();
      return true;
    });
    expect(audioRes).toBe(true);
  });

  test('Level 4: Fragile Stepping Stones - Explanatory box and puzzle execution', async ({ page }) => {
    // Navigate with ?testMechanic to test explanation dialog
    await page.goto('/?testMechanic=1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Reset local storage flags to trigger intro
    await page.evaluate(() => {
      localStorage.removeItem('koma_seen_fragile_intro');
      localStorage.removeItem('koma_seen_blocks_intro');
      window.gameInstance.loadLevel(3); // Level 4
    });

    // Verify modal is active and shows fragile tile introduction
    const modalActive = await page.evaluate(() => {
      const modal = document.getElementById('modalMechanicIntro');
      const sub = document.getElementById('mechanicIntroSubtitle');
      return modal.classList.contains('active') && sub.textContent.includes('Brüchige Trittsteine');
    });
    expect(modalActive).toBe(true);

    // Click dismiss button
    await page.click('#btnDismissMechanicIntro');
    const modalClosed = await page.evaluate(() => {
      const modal = document.getElementById('modalMechanicIntro');
      return !modal.classList.contains('active');
    });
    expect(modalClosed).toBe(true);

    // Verify Level 4 puzzle state
    const lvlInfo = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return {
        name: lvl.n,
        fragileCount: (lvl.fragile || []).length,
        waterCount: (lvl.water || []).length,
        solution: lvl.solution
      };
    });
    expect(lvlInfo.name).toBe('Der brüchige Steg');
    expect(lvlInfo.fragileCount).toBe(2);
    expect(lvlInfo.waterCount).toBe(2);

    // Execute solution: ["F", "F", "F", "R", "F", "F", "R", "F", "F"]
    await page.evaluate(async () => {
      const g = window.gameInstance;
      g.queue = [...g.getCurrentLevel().solution];
      g.renderQueue();
      g.play();
    });

    // Wait for execution to finish and win condition to trigger
    await page.waitForFunction(() => window.gameInstance?.state?.isWin === true, { timeout: 10000 });

    const winStatus = await page.evaluate(() => {
      return {
        isWin: window.gameInstance.state.isWin,
        isFail: window.gameInstance.state.isFail,
        collapsedCount: window.gameInstance.state.collapsedFragileTiles.size
      };
    });
    expect(winStatus.isFail).toBe(false);
    expect(winStatus.isWin).toBe(true);
    expect(winStatus.collapsedCount).toBeGreaterThanOrEqual(1);
  });

  test('Level 5: Pushable Holy Blocks - Explanatory box and puzzle execution', async ({ page }) => {
    await page.goto('/?testMechanic=1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Trigger blocks intro by resetting flag and loading Level 5
    await page.evaluate(() => {
      localStorage.removeItem('koma_seen_blocks_intro');
      window.gameInstance.loadLevel(4); // Level 5
    });

    // Verify modal is active and shows block introduction
    const modalActive = await page.evaluate(() => {
      const modal = document.getElementById('modalMechanicIntro');
      const sub = document.getElementById('mechanicIntroSubtitle');
      return modal.classList.contains('active') && sub.textContent.includes('Heilige Felsblöcke');
    });
    expect(modalActive).toBe(true);

    // Dismiss modal
    await page.click('#btnDismissMechanicIntro');

    // Verify Level 5 puzzle state
    const lvlInfo = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return {
        name: lvl.n,
        blocksCount: (lvl.blocks || []).length,
        waterCount: (lvl.water || []).length,
        solution: lvl.solution
      };
    });
    expect(lvlInfo.name).toBe('Der heilige Felsblock');
    expect(lvlInfo.blocksCount).toBe(1);
    expect(lvlInfo.waterCount).toBe(3);

    // Execute solution: ["F", "L", "F", "F", "F", "F"]
    await page.evaluate(async () => {
      const g = window.gameInstance;
      g.queue = [...g.getCurrentLevel().solution];
      g.renderQueue();
      g.play();
    });

    // Wait for execution to finish and win condition to trigger
    await page.waitForFunction(() => window.gameInstance?.state?.isWin === true, { timeout: 10000 });

    const winStatus = await page.evaluate(() => {
      return {
        isWin: window.gameInstance.state.isWin,
        isFail: window.gameInstance.state.isFail,
        waterRemaining: window.gameInstance.state.waterTiles.size
      };
    });
    expect(winStatus.isFail).toBe(false);
    expect(winStatus.isWin).toBe(true);
    // One water tile turned into a bridge!
    expect(winStatus.waterRemaining).toBe(2);
  });

});
