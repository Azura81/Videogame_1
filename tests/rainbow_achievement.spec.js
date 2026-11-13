// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Rainbow Skin & 100 Levels Achievement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');
    await page.waitForFunction(() => window.gameInstance && window.gameInstance.renderer);
  });

  test('hundred_shrines achievement and rainbow skin are properly defined and unlock when all 100 levels are completed', async ({ page }) => {
    const result = await page.evaluate(() => {
      const g = window.gameInstance;
      const skins = window.KOMA_SKINS;
      
      const rainbowSkin = skins && skins.rainbow;
      const hasSkin = !!rainbowSkin;

      // Initially with 0 completed levels, rainbow skin should be locked
      const unlockedBefore = g.isSkinUnlocked('rainbow');

      // Check achievement definition
      const ach = (typeof ACHIEVEMENTS !== 'undefined') ? ACHIEVEMENTS.find(a => a.id === 'hundred_shrines') : null;
      const hasAch = !!ach;

      // Simulate completing all 100 levels
      g.completedLevels = new Set();
      for (let i = 0; i < 100; i++) {
        g.completedLevels.add(i);
      }

      const prog = ach ? ach.getProgress(g) : 0;
      g.checkAchievements();
      const achUnlocked = g.unlockedAchievements.has('hundred_shrines');
      const unlockedAfter = g.isSkinUnlocked('rainbow');

      // Test equipping rainbow skin
      g.equipSkin('rainbow');
      const equipped = g.equippedSkin === 'rainbow';
      const rendererSkin = g.renderer ? g.renderer.currentSkinId : null;

      return {
        hasSkin,
        rainbowSkinTag: rainbowSkin ? rainbowSkin.tag : null,
        unlockedBefore,
        hasAch,
        prog,
        achUnlocked,
        unlockedAfter,
        equipped,
        rendererSkin
      };
    });

    expect(result.hasSkin).toBe(true);
    expect(result.rainbowSkinTag).toBe('100 Level');
    expect(result.unlockedBefore).toBe(false);
    expect(result.hasAch).toBe(true);
    expect(result.prog).toBe(100);
    expect(result.achUnlocked).toBe(true);
    expect(result.unlockedAfter).toBe(true);
    expect(result.equipped).toBe(true);
    expect(result.rendererSkin).toBe('rainbow');
  });
});
