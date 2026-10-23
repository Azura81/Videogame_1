import { test, expect } from '@playwright/test';

test.describe('KOMA Main Home Screen & Showroom System', () => {
  test('Home screen renders 3D showroom, equipped skin widget, level plaque, and modes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    // Navigate with ?showHome=1 to test Home Screen directly
    await page.goto('/?showHome=1');
    await page.waitForSelector('#homeScreen');

    // 1. Verify Home Screen is active
    const homeScreen = page.locator('#homeScreen');
    await expect(homeScreen).toHaveClass(/active/);

    // 2. Verify Showroom displays currently equipped skin in wardrobe widget
    await expect(page.locator('#homeActiveSkinLabel')).toHaveText('Shiro Usagi');

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

    // 3. Verify Current Level Plaque
    await expect(page.locator('#homeLevelBigNumber')).toHaveText(/LEVEL 1/i);
    await expect(page.locator('#homeCurrentLevelTitle')).toHaveText(/Die erste Lieferung/i);
    await expect(page.locator('#homeCurrentChapter')).toHaveText(/Kapitel 01/i);
    await expect(page.locator('#btnHomePlay')).toBeVisible();

    // 4. Verify Widgets and Dropdown Controls
    await expect(page.locator('#btnHomeDailyWidget')).toBeVisible();
    await expect(page.locator('#btnHomeWardrobeWidget')).toBeVisible();
    await expect(page.locator('#btnHomeModeDropdown')).toBeVisible();

    // Verify Mount Fuji header buttons are removed
    await expect(page.locator('#btnHeaderFuji')).toHaveCount(0);
    await expect(page.locator('#btnHomeModeFuji')).toHaveCount(0);

    // Verify wardrobe opens in front of home screen (z-index check)
    await page.locator('#btnHomeWardrobeWidget').click();
    const modalSkins = page.locator('#modalSkins');
    await expect(modalSkins).toHaveClass(/active/);

    await page.locator('#btnCloseSkins').click();
    await expect(modalSkins).not.toHaveClass(/active/);
    await page.waitForTimeout(400);

    // 5. Test equipping a different skin reflects immediately in Showroom
    await page.evaluate(() => {
      window.gameInstance.equippedSkin = 'sakura';
      window.gameInstance.renderer.setKomaSkin('sakura');
      window.gameInstance.updateHomeScreen();
    });
    await expect(page.locator('#homeActiveSkinLabel')).toHaveText('Sakura Kitsune');

    // 6. Test Start / Resume Button enters current level
    await page.locator('#btnHomePlay').click();
    await expect(homeScreen).not.toHaveClass(/active/);

    const exitedShowroom = await page.evaluate(() => {
      return window.gameInstance?.renderer?.isHomeScreenMode || false;
    });
    expect(exitedShowroom).toBe(false);

    // 7. Test returning to Home Screen anytime from gameplay via header #btnHome
    const btnHome = page.locator('#btnHome');
    await expect(btnHome).toBeVisible();
    await expect(btnHome).toContainText('Home');
    await btnHome.click();
    await expect(homeScreen).toHaveClass(/active/);
  });
});
