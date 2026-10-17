const { test, expect } = require('@playwright/test');

test.describe('KOMA: Spirit Delivery - Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Page loads with title, 3D WebGL canvas, and full camera credits', async ({ page }) => {
    await expect(page).toHaveTitle(/KOMA: Spirit Delivery/);
    const canvas = page.locator('#webgl-container canvas');
    await expect(canvas).toBeVisible();
    await expect(page.locator('#levelTitle')).toHaveText('Die erste Lieferung');
    await expect(page.locator('#creditBadge')).toHaveText('6 / 6');
    await expect(page.locator('#creditStars')).toHaveText('⭐⭐⭐');
  });

  test('Adding commands updates queue and limit', async ({ page }) => {
    const forwardBtn = page.locator('button[data-cmd="F"]');
    await forwardBtn.click();
    await forwardBtn.click();
    
    await expect(page.locator('#queueCount')).toHaveText('2 / 8');
    const chips = page.locator('.queue-chip');
    await expect(chips).toHaveCount(2);

    // Undo
    await page.locator('#btnUndo').click();
    await expect(page.locator('#queueCount')).toHaveText('1 / 8');

    // Clear
    await page.locator('#btnClear').click();
    await expect(page.locator('#queueCount')).toHaveText('0 / 8');
  });

  test('Camera swivel deducts credits and affects star ratings', async ({ page }) => {
    await expect(page.locator('#creditBadge')).toHaveText('6 / 6');
    await expect(page.locator('#creditStars')).toHaveText('⭐⭐⭐');

    // Click camera rotate button (swivels 45 deg, consumes 1 credit)
    const btnRotateRight = page.locator('#btnCamRotateRight');
    await btnRotateRight.click();
    await expect(page.locator('#creditBadge')).toHaveText('5 / 6');
    await expect(page.locator('#creditStars')).toHaveText('⭐⭐');

    // Rotate more times
    await btnRotateRight.click(); // 4/6 -> 2 stars
    await btnRotateRight.click(); // 3/6 -> 2 stars (half credits)
    await expect(page.locator('#creditBadge')).toHaveText('3 / 6');
    await expect(page.locator('#creditStars')).toHaveText('⭐⭐');

    await btnRotateRight.click(); // 2/6 -> 1 star
    await expect(page.locator('#creditBadge')).toHaveText('2 / 6');
    await expect(page.locator('#creditStars')).toHaveText('⭐');

    await btnRotateRight.click(); // 1/6
    await btnRotateRight.click(); // 0/6 -> 0 stars
    await expect(page.locator('#creditBadge')).toHaveText('0 / 6');
    await expect(page.locator('#creditStars')).toHaveText('–');

    // Resetting level resets credits to 6 / 6
    await page.locator('#btnReset').click();
    await expect(page.locator('#creditBadge')).toHaveText('6 / 6');
    await expect(page.locator('#creditStars')).toHaveText('⭐⭐⭐');
  });

  test('Solving Level 1 with 0 credits completes successfully with 0 stars', async ({ page }) => {
    // Deplete all 6 credits
    const btnRotate = page.locator('#btnCamRotateLeft');
    for (let i = 0; i < 6; i++) {
      await btnRotate.click();
    }
    await expect(page.locator('#creditBadge')).toHaveText('0 / 6');

    // Solution for Level 1: F, F, F, F, R, F
    const btnF = page.locator('button[data-cmd="F"]');
    const btnR = page.locator('button[data-cmd="R"]');

    await btnF.click();
    await btnF.click();
    await btnF.click();
    await btnF.click();
    await btnR.click();
    await btnF.click();

    // Play plan
    await page.locator('#btnPlay').click();

    // Level completes even with 0 credits!
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 8000 });
    await expect(page.locator('#modalWinStars')).toContainText(/0 Sterne/);
  });

  test('Solving Level 1 with full credits awards 3 Stars', async ({ page }) => {
    // Solution for Level 1: F, F, F, F, R, F without any camera swivel
    const btnF = page.locator('button[data-cmd="F"]');
    const btnR = page.locator('button[data-cmd="R"]');

    await btnF.click();
    await btnF.click();
    await btnF.click();
    await btnF.click();
    await btnR.click();
    await btnF.click();

    // Play plan
    await page.locator('#btnPlay').click();

    // Victory modal shows 3 Stars!
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 8000 });
    await expect(page.locator('#modalWinStars')).toContainText(/3 Sterne/);
  });
});
