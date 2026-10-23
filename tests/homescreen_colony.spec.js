import { test, expect } from '@playwright/test';

test.describe('Homescreen Colony Flow Redesign & Sequential Progression', () => {
  test('Homescreen renders centered robot, level plaque, widgets, and dropdown', async ({ page }) => {
    test.setTimeout(30000);
    // Explicitly show home screen
    await page.goto('/?showHome=1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#homeScreen.active', { timeout: 10000 });
    await page.waitForSelector('#showroomCanvas');

    // 1. Level Plaque verification
    const bigLevel = page.locator('#homeLevelBigNumber');
    await expect(bigLevel).toBeVisible();
    await expect(bigLevel).toHaveText(/LEVEL 1/i);

    const chapterKicker = page.locator('#homeCurrentChapter');
    await expect(chapterKicker).toBeVisible();
    await expect(chapterKicker).toContainText(/KAPITEL/i);

    const levelTitle = page.locator('#homeCurrentLevelTitle');
    await expect(levelTitle).toBeVisible();
    await expect(levelTitle).toHaveText(/Die erste Lieferung/i);

    // 2. Top-Left Widgets verification (Daily + Wardrobe)
    const dailyWidget = page.locator('#btnHomeDailyWidget');
    await expect(dailyWidget).toBeVisible();
    await expect(dailyWidget).toContainText(/TÄGLICH/i);

    const wardrobeWidget = page.locator('#btnHomeWardrobeWidget');
    await expect(wardrobeWidget).toBeVisible();
    await expect(wardrobeWidget).toContainText(/GARDEROBE/i);

    // 3. Top-Right Buttons
    const starsPill = page.locator('.home-stars-pill');
    await expect(starsPill).toBeVisible();
    const chaptersBtn = page.locator('#btnHomeChapters');
    await expect(chaptersBtn).toBeVisible();

    // 4. Centered Robot Showroom Canvas
    const canvas = page.locator('#showroomCanvas');
    await expect(canvas).toBeVisible();

    // 5. Bottom Controls (Play Button + Mode Dropdown)
    const playBtn = page.locator('#btnHomePlay');
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toContainText('SPIELEN');

    const modeBtn = page.locator('#btnHomeModeDropdown');
    await expect(modeBtn).toBeVisible();
    await expect(modeBtn).toContainText('Kampagne');

    // Take screenshot of new Colony Flow-style Homescreen
    await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/homescreen_colony_flow_style.png' });

    // 6. Test Mode Dropdown interaction
    await modeBtn.click();
    const modeMenu = page.locator('#homeModeMenu');
    await expect(modeMenu).not.toHaveClass(/hidden/);

    await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/homescreen_mode_dropdown_open.png' });

    // Select Tower Mode
    const towerItem = page.locator('.home-mode-item[data-mode="tower"]');
    await towerItem.click();
    await expect(modeMenu).toHaveClass(/hidden/);
    await expect(modeBtn).toContainText('Turm');
    await expect(playBtn).toContainText('SCHREINPRÜFUNG');

    // Switch back to Campaign Mode
    await modeBtn.click();
    const campaignItem = page.locator('.home-mode-item[data-mode="campaign"]');
    await campaignItem.click();
    await expect(modeBtn).toContainText('Kampagne');
    await expect(playBtn).toContainText('SPIELEN');

    // 7. Test Chapter Drawer & Sequential Level Locking
    await chaptersBtn.click();
    const drawer = page.locator('#levelDrawer');
    await expect(drawer).toHaveClass(/open/);
    await page.waitForTimeout(400);

    // In normal player progression (unlockedLevel = 0), check level locking
    const isLevel2Locked = await page.evaluate(() => {
      const originalWebdriver = navigator.webdriver;
      Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
      window.gameInstance.completedLevels.clear();
      window.gameInstance.renderLevelDrawer();
      const btnLvl2 = document.querySelectorAll('.level-pill-btn')[1];
      const locked = btnLvl2 ? btnLvl2.classList.contains('locked') : false;
      Object.defineProperty(navigator, 'webdriver', { get: () => originalWebdriver, configurable: true });
      return locked;
    });

    expect(isLevel2Locked).toBe(true);

    await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/homescreen_level_drawer_locked.png' });

    // Close drawer
    await page.locator('#levelDrawer .icon-btn').click();
    await expect(drawer).not.toHaveClass(/open/);

    // 8. Clicking SPIELEN launches the level and closes homescreen
    await playBtn.click();
    await expect(page.locator('#homeScreen')).not.toHaveClass(/active/);
    await expect(page.locator('#levelTitle')).toHaveText(/Die erste Lieferung/i);
  });

  test('Mobile iPhone Viewport: Top widgets, full robot model, and centered controls are unclipped', async ({ page }) => {
    test.setTimeout(30000);
    // iPhone 13/14 standard viewport: 390 x 844
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/?showHome=1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#homeScreen.active', { timeout: 10000 });
    await page.waitForSelector('#showroomCanvas');
    await page.waitForTimeout(600);

    // Verify "✦ Ziehen zum Drehen" is completely removed
    const hint = page.locator('.showroom-drag-hint');
    await expect(hint).toHaveCount(0);

    // Top widgets must be visible and within viewport
    const dailyBtn = page.locator('#btnHomeDailyWidget');
    await expect(dailyBtn).toBeVisible();
    const wardrobeBtn = page.locator('#btnHomeWardrobeWidget');
    await expect(wardrobeBtn).toBeVisible();
    const chaptersBtn = page.locator('#btnHomeChapters');
    await expect(chaptersBtn).toBeVisible();

    // Verify bounding box of top widgets is inside viewport (y >= 0)
    const dailyBox = await dailyBtn.boundingBox();
    expect(dailyBox).not.toBeNull();
    expect(dailyBox.y).toBeGreaterThanOrEqual(5);

    // Bottom controls must be visible and within viewport (y + height <= 844)
    const playBtn = page.locator('#btnHomePlay');
    await expect(playBtn).toBeVisible();
    const playBox = await playBtn.boundingBox();
    expect(playBox).not.toBeNull();
    expect(playBox.y + playBox.height).toBeLessThanOrEqual(844);

    const modeBtn = page.locator('#btnHomeModeDropdown');
    await expect(modeBtn).toBeVisible();
    const modeBox = await modeBtn.boundingBox();
    expect(modeBox).not.toBeNull();
    expect(modeBox.y + modeBox.height).toBeLessThanOrEqual(844);

    // Take screenshot of refined mobile view
    await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/homescreen_iphone_view.png' });

    // Click wardrobe from mobile top bar to ensure clickability
    await wardrobeBtn.click();
    await expect(page.locator('#modalSkins')).toHaveClass(/active/);
    await page.locator('#btnCloseSkins').click();
    await expect(page.locator('#modalSkins')).not.toHaveClass(/active/);
  });
});

