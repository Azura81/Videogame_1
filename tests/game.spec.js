const { test, expect } = require('@playwright/test');

test.describe('KOMA: Spirit Delivery - Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Page loads with title and 3D WebGL canvas', async ({ page }) => {
    await expect(page).toHaveTitle(/KOMA: Spirit Delivery/);
    const canvas = page.locator('#webgl-container canvas');
    await expect(canvas).toBeVisible();
    await expect(page.locator('#levelTitle')).toHaveText('Die erste Lieferung');
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

  test('Solving Level 1 triggers victory modal', async ({ page }) => {
    // Solution for Level 1: F, F, F, F, R, F
    const btnF = page.locator('button[data-cmd="F"]');
    const btnR = page.locator('button[data-cmd="R"]');

    await btnF.click();
    await btnF.click();
    await btnF.click();
    await btnF.click();
    await btnR.click();
    await btnF.click();

    await expect(page.locator('#queueCount')).toHaveText('6 / 8');

    // Play plan
    await page.locator('#btnPlay').click();

    // Wait for victory modal to show up after movement steps
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 8000 });
    await expect(page.locator('#modalWinTitle')).toContainText(/Lieferung erfolgreich|erfolgreich/);
  });
});
