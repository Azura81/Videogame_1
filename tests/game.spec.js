const { test, expect } = require('@playwright/test');

test.describe('KOMA: Spirit Delivery - Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
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

  test('Campaign contains all 50 levels in level drawer and mission badge', async ({ page }) => {
    await expect(page.locator('#missionBadge')).toHaveText('01 / 50');
    
    // Open level drawer
    await page.locator('#btnLevelSelect').click();
    await expect(page.locator('#levelDrawer')).toHaveClass(/open/);
    
    // Check 50 level buttons are present
    const pills = page.locator('.level-pill-btn');
    await expect(pills).toHaveCount(50);
    
    // Check level 50 title is present
    await expect(page.locator('.level-pill-btn').nth(49)).toContainText('Die Legende von KOMA');
  });

  test('Level 11 (Dual-Tore) can be loaded and solved with Cyan & Magenta gates', async ({ page }) => {
    // Open drawer and select Level 11
    await page.locator('#btnLevelSelect').click();
    const pill = page.locator('.level-pill-btn').nth(10); // Level 11 is index 10
    await pill.scrollIntoViewIfNeeded();
    await pill.click();
    
    await expect(page.locator('#levelTitle')).toHaveText('Zwei Lichter');
    await expect(page.locator('#missionBadge')).toHaveText('11 / 50');
    
    // Solution for Level 11: F, A, R, F, F, A, L, F, L, F, R, F, R, F, F
    const cmds = ["F", "A", "R", "F", "F", "A", "L", "F", "L", "F", "R", "F", "R", "F", "F"];
    for (const cmd of cmds) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }
    
    await page.locator('#btnPlay').click();
    
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 20000 });
    await expect(page.locator('#modalWinStars')).toContainText(/3 Sterne/);
  });

  test('Level 19 (Kitsune Portal) teleports KOMA to the other side', async ({ page }) => {
    // Open drawer and select Level 19
    await page.locator('#btnLevelSelect').click();
    await page.locator('.level-pill-btn').nth(18).click(); // Level 19 is index 18
    
    await expect(page.locator('#levelTitle')).toHaveText('Das Portal des Fuchses');
    await expect(page.locator('#missionBadge')).toHaveText('19 / 50');
    
    // Solution: F, F, F, F (teleports through portal)
    for (let i = 0; i < 4; i++) {
      await page.locator('button[data-cmd="F"]').click();
    }
    
    await page.locator('#btnPlay').click();
    
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 10000 });
    await expect(page.locator('#modalWinStars')).toContainText(/3 Sterne/);
  });
});

