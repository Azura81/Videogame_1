import { test, expect } from '@playwright/test';

test.describe('Tower of 100 Trials (Roguelike Endless Mode)', () => {
  test('Tower button, intro modal, HUD, floor advance, life deduction, and campaign return', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // 1. Verify Header Tower Button
    const towerBtn = page.locator('#btnTowerMode');
    await expect(towerBtn).toBeVisible();
    await expect(page.locator('#headerTowerBest')).toContainText(/Ebene/);

    // 2. Open Tower Intro Modal
    await towerBtn.click();
    const introModal = page.locator('#modalTowerIntro');
    await expect(introModal).toHaveClass(/active/);
    await expect(page.locator('#towerHeroBestFloor')).toContainText(/Ebene/);

    // 3. Start Tower Run
    const startBtn = page.locator('#btnStartTowerRun');
    await startBtn.click();
    await expect(introModal).not.toHaveClass(/active/);

    // 4. Verify Tower HUD Bar & Floor 1 Loaded
    const hudBar = page.locator('#towerHudBar');
    await expect(hudBar).toBeVisible();
    await expect(page.locator('#towerHudFloor')).toHaveText(/Ebene 1/);
    await expect(page.locator('#missionBadge')).toHaveText(/EBENE 1/);

    // Check 3 lit lanterns
    const litLanterns = page.locator('.tower-lantern.lit');
    await expect(litLanterns).toHaveCount(3);

    // 5. Solve Floor 1 using mathematical BFS solution
    const floor1Solution = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return lvl.solution || (lvl.solverSolution ? lvl.solverSolution.path : null);
    });

    expect(floor1Solution).not.toBeNull();
    expect(floor1Solution.length).toBeGreaterThan(0);

    for (const cmd of floor1Solution) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }

    // Play solution
    await page.locator('#btnPlay').click();

    // 6. Verify Floor 1 Cleared -> Advanced to Ebene 2
    await expect(page.locator('#towerHudFloor')).toHaveText(/Ebene 2/, { timeout: 15000 });
    await expect(page.locator('#missionBadge')).toHaveText(/EBENE 2/);

    // 7. Test Life Deduction on Failure
    // Intentionally send KOMA into a wall / obstacle
    await page.locator('button[data-cmd="L"]').click();
    await page.locator('button[data-cmd="F"]').click();
    await page.locator('#btnPlay').click();

    // Verify one lantern is lost (2 lit, 1 unlit)
    await expect(page.locator('.tower-lantern.lit')).toHaveCount(2, { timeout: 8000 });
    await expect(page.locator('.tower-lantern.unlit')).toHaveCount(1);
    await expect(page.locator('#feedbackText')).toContainText(/Laterne ist erloschen/);

    // 8. Test Remaining 2 Lives Lost -> Game Over Modal
    // Lose 2nd life
    await page.locator('button[data-cmd="F"]').click();
    await page.locator('#btnPlay').click();
    await expect(page.locator('.tower-lantern.lit')).toHaveCount(1, { timeout: 8000 });

    // Lose 3rd life -> Game Over!
    await page.locator('button[data-cmd="F"]').click();
    await page.locator('#btnPlay').click();

    const gameOverModal = page.locator('#modalTowerGameOver');
    await expect(gameOverModal).toHaveClass(/active/, { timeout: 8000 });
    await expect(page.locator('#towerResultFloor')).toContainText(/Ebene 2/);

    // 9. Exit to Campaign
    await page.locator('#btnTowerExitToCampaign').click();
    await expect(gameOverModal).not.toHaveClass(/active/);
    await expect(hudBar).not.toBeVisible();
    await expect(page.locator('#missionBadge')).toHaveText('01 / 60');
  });
});
