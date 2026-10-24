import { test, expect } from '@playwright/test';

test.describe('AdMob & Monetization System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.__FAST_TEST_ADS__ = true;
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');
  });

  test('Wardrobe Rewarded Ad grants +3 Kami stars and persists', async ({ page }) => {
    // 1. Initial stars should be 0
    const initialStars = await page.evaluate(() => window.gameInstance.getTotalStars());
    expect(initialStars).toBe(0);

    // 2. Open Skins / Wardrobe modal
    const skinsBtn = page.locator('#btnSkins');
    await skinsBtn.click();
    const modalSkins = page.locator('#modalSkins');
    await expect(modalSkins).toHaveClass(/active/);

    // 3. Click Desktop Wardrobe Ad button
    const adBtn = page.locator('#btnDesktopWardrobeAd');
    await expect(adBtn).toBeVisible();
    await adBtn.click();

    // 4. Simulated Ad Overlay appears
    const adOverlay = page.locator('#adSimulatedOverlay');
    await expect(adOverlay).toHaveClass(/active/);
    await expect(page.locator('.ad-modal-card')).toBeVisible();

    // 5. Wait for the countdown to complete and close button to become enabled
    const closeBtn = page.locator('#adCloseBtn');
    await expect(closeBtn).toBeEnabled({ timeout: 5000 });
    await expect(closeBtn).toContainText('Belohnung einlösen');

    // 6. Claim reward
    await closeBtn.click();
    await expect(adOverlay).not.toHaveClass(/active/);

    // 7. Total stars should now be 3
    const newStars = await page.evaluate(() => window.gameInstance.getTotalStars());
    expect(newStars).toBe(3);

    // Header total stars and modal stars updated
    await expect(page.locator('#headerTotalStars')).toHaveText('3');
    await expect(page.locator('#modalTotalStars')).toHaveText('3');

    // Bonus stars saved in localStorage
    const savedBonus = await page.evaluate(() => window.localStorage.getItem('spirit_bonus_stars'));
    expect(savedBonus).toBe('3');
  });

  test('Tower of 100 Trials: Second Chance (Revive) restores 1 lantern and resumes floor', async ({ page }) => {
    // 1. Start a Tower Run
    await page.locator('#btnTowerMode').click();
    await page.locator('#btnStartTowerRun').click();
    await expect(page.locator('#towerHudBar')).toBeVisible();

    // Verify 3 lanterns at start
    await expect(page.locator('.tower-lantern.lit')).toHaveCount(3);

    // 2. Simulate game over in Tower mode
    await page.evaluate(() => {
      // Deduct all 3 lanterns
      window.TowerTrial.handleFail();
      window.TowerTrial.handleFail();
      const failRes = window.TowerTrial.handleFail();
      window.gameInstance.showTowerGameOver(failRes);
    });

    // 3. Verify Game Over Modal and Revive Box
    const gameOverModal = page.locator('#modalTowerGameOver');
    await expect(gameOverModal).toHaveClass(/active/);
    const reviveBox = page.locator('#towerReviveBox');
    await expect(reviveBox).toBeVisible();

    const reviveBtn = page.locator('#btnTowerRevive');
    await expect(reviveBtn).toBeVisible();

    // 4. Click Revive Button
    await reviveBtn.click();

    // 5. Watch Simulated Ad
    const adOverlay = page.locator('#adSimulatedOverlay');
    await expect(adOverlay).toHaveClass(/active/);

    const closeBtn = page.locator('#adCloseBtn');
    await expect(closeBtn).toBeEnabled({ timeout: 5000 });
    await closeBtn.click();

    // 6. Game Over Modal should be closed, and 1 lantern restored
    await expect(gameOverModal).not.toHaveClass(/active/);
    const activeLanterns = await page.evaluate(() => window.TowerTrial.lanterns);
    expect(activeLanterns).toBe(1);
    await expect(page.locator('.tower-lantern.lit')).toHaveCount(1);

    // 7. If the player fails again after revive, Revive Box should be hidden (one revive per run)
    await page.evaluate(() => {
      const failRes = window.TowerTrial.handleFail();
      window.gameInstance.showTowerGameOver(failRes);
    });

    await expect(gameOverModal).toHaveClass(/active/);
    await expect(reviveBox).toBeHidden();
  });

  test('Privacy policy page reflects Google AdMob terms', async ({ page }) => {
    await page.goto('/privacy.html', { waitUntil: 'domcontentloaded' });
    
    // Check German section
    await expect(page.locator('h1')).toContainText('Datenschutzerklärung');
    await expect(page.locator('#content-de')).toContainText('Google AdMob');
    await expect(page.locator('#content-de')).toContainText('Belohnungs-Videos');

    // Switch to English
    await page.locator('.lang-btn:has-text("English")').click();
    await expect(page.locator('#content-en')).toBeVisible();
    await expect(page.locator('#content-en')).toContainText('Google AdMob');
    await expect(page.locator('#content-en')).toContainText('Rewarded Ads');
  });
});
