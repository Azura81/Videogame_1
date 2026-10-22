import { test, expect } from '@playwright/test';

test.describe('KOMA Main Home Screen & Showroom System', () => {
  test('Home screen renders 3D showroom, equipped skin, resume card, and all game modes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    // Navigate with ?showHome=1 to test Home Screen directly
    await page.goto('/?showHome=1');
    await page.waitForSelector('#homeScreen');

    // 1. Verify Home Screen is active
    const homeScreen = page.locator('#homeScreen');
    await expect(homeScreen).toHaveClass(/active/);

    // 2. Verify Showroom displays currently equipped skin
    await expect(page.locator('#homeSkinName')).toHaveText('Shiro Usagi');
    await expect(page.locator('#homeSkinSub')).toContainText('白兎');
    await expect(page.locator('#homeSkinTag')).toHaveText('Standard');
    const skinIcon = page.locator('#homeSkinIcon svg');
    await expect(skinIcon).toBeVisible();

    // Verify 3D turntable mode is active in renderer
    const rendererShowroomState = await page.evaluate(() => {
      const r = window.gameInstance?.renderer;
      return {
        isHomeScreenMode: r?.isHomeScreenMode || false,
        komaGroupVisible: r?.komaGroup?.visible || false,
        currentSkin: r?.currentSkinId || ''
      };
    });
    expect(rendererShowroomState.isHomeScreenMode).toBe(true);
    expect(rendererShowroomState.komaGroupVisible).toBe(true);
    expect(rendererShowroomState.currentSkin).toBe('original');

    // 3. Verify Current Level Resume Card
    await expect(page.locator('#homeCurrentLevelTitle')).toHaveText(/Level 01: Die erste Lieferung/);
    await expect(page.locator('#homeCurrentChapter')).toHaveText(/Kapitel 01/);
    await expect(page.locator('#btnHomeResume')).toBeVisible();

    // 4. Verify All Game Modes and Secondary Modis
    await expect(page.locator('#btnHomeModeCampaign')).toBeVisible();
    await expect(page.locator('#btnHomeModeTower')).toBeVisible();
    await expect(page.locator('#btnHomeModeDaily')).toBeVisible();
    await expect(page.locator('#btnHomeModeWardrobe')).toBeVisible();
    await expect(page.locator('#btnHomeModeTrophies')).toBeVisible();

    // Verify Mount Fuji buttons are removed as requested
    await expect(page.locator('#btnHeaderFuji')).toHaveCount(0);
    await expect(page.locator('#btnHomeModeFuji')).toHaveCount(0);

    // Verify wardrobe opens in front of home screen (z-index check)
    await page.locator('#btnHomeOpenWardrobe').click();
    const modalSkins = page.locator('#modalSkins');
    await expect(modalSkins).toHaveClass(/active/);
    await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/homescreen_wardrobe_in_front.png' });

    await page.locator('#btnCloseSkins').click();
    await expect(modalSkins).not.toHaveClass(/active/);
    await page.waitForTimeout(400);

    // Capture screenshot of the Home Screen Showroom
    await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/homescreen_showroom.png' });

    // 5. Test equipping a different skin reflects immediately in Showroom
    await page.evaluate(() => {
      window.gameInstance.equippedSkin = 'sakura';
      window.gameInstance.renderer.setKomaSkin('sakura');
      window.gameInstance.updateHomeScreen();
    });
    await expect(page.locator('#homeSkinName')).toHaveText('Sakura Kitsune');
    await expect(page.locator('#homeSkinSub')).toContainText('桜狐');

    // 6. Test Start / Resume Button enters current level
    await page.locator('#btnHomeResume').click();
    await expect(homeScreen).not.toHaveClass(/active/);

    const exitedShowroom = await page.evaluate(() => {
      return window.gameInstance?.renderer?.isHomeScreenMode || false;
    });
    expect(exitedShowroom).toBe(false);

    // 7. Test returning to Home Screen anytime from gameplay via header #btnHome
    const btnHome = page.locator('#btnHome');
    await expect(btnHome).toBeVisible();
    await btnHome.click();
    await expect(homeScreen).toHaveClass(/active/);
  });
});
