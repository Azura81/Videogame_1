const { test, expect } = require('@playwright/test');

test.describe('Autumn Theme & Patrolling Shrine Ghosts (Levels 61–100)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');
    await page.waitForFunction(() => window.gameInstance && window.gameInstance.renderer);
  });

  test('All 100 levels are loaded in LEVELS array', async ({ page }) => {
    const count = await page.evaluate(() => window.LEVELS.length);
    expect(count).toBe(100);
  });

  test('Chapter 7–10 Autumn levels have correct theme and ghost definitions', async ({ page }) => {
    const lvl61 = await page.evaluate(() => window.LEVELS[60]);
    expect(lvl61.theme).toBe('autumn');
    expect(lvl61.ghosts).toBeDefined();
    expect(lvl61.ghosts.length).toBeGreaterThan(0);
    expect(lvl61.n).toBe('Die Momiji-Allee');

    const lvl100 = await page.evaluate(() => window.LEVELS[99]);
    expect(lvl100.theme).toBe('autumn');
    expect(lvl100.ghosts.length).toBe(3);
    expect(lvl100.n).toBe('Das Ewige Heiligtum der 100 Geister');
  });

  test('Level 61 loads Autumn theme in 3D renderer and spawns ghost meshes', async ({ page }) => {
    await page.evaluate(() => {
      window.gameInstance.loadLevel(60); // 0-indexed Level 61
    });

    const isAutumnActive = await page.evaluate(() => window.gameInstance.renderer.isAutumnThemeActive);
    expect(isAutumnActive).toBe(true);

    const ghostCount = await page.evaluate(() => window.gameInstance.renderer.ghostMeshes.length);
    expect(ghostCount).toBe(2);
  });

  test('Executing Level 61 verified solution completes cleanly', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const lvl = window.LEVELS[60];
      window.gameInstance.loadLevel(60);
      window.gameInstance.queue = [...lvl.solution];
      window.gameInstance.renderQueue();

      // Run plan
      await new Promise(resolve => {
        window.gameInstance.play();
        const check = setInterval(() => {
          if (window.gameInstance.state.isWin || window.gameInstance.state.isFail || !window.gameInstance.isPlaying) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });

      return {
        isWin: window.gameInstance.state.isWin,
        isFail: window.gameInstance.state.isFail,
        x: window.gameInstance.state.x,
        y: window.gameInstance.state.y,
        goal: lvl.g
      };
    });

    expect(result.isWin).toBe(true);
    expect(result.isFail).toBe(false);
    expect(result.x).toBe(result.goal[0]);
    expect(result.y).toBe(result.goal[1]);
  });
});
