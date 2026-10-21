import { test, expect } from '@playwright/test';

test.describe('Daily Shrine Trial & Streak System', () => {
  test('Daily button, modal, 0 camera credits, and streak completion', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // 1. Verify Header Daily Button
    const dailyBtn = page.locator('#btnDailyTrial');
    await expect(dailyBtn).toBeVisible();
    await expect(page.locator('#headerDailyStreak')).toHaveText('0');

    // 2. Open Daily Trial Modal
    await dailyBtn.click();
    const modal = page.locator('#modalDailyTrial');
    await expect(modal).toHaveClass(/active/);
    await expect(page.locator('#dailyStreakValue')).toHaveText(/0 Tage/);
    await expect(page.locator('#dailyStatusTag')).toHaveText('Heute noch offen');

    // Check weekly stamp grid has 7 day items
    const stampItems = page.locator('.week-stamp-item');
    await expect(stampItems).toHaveCount(7);

    // 3. Start Daily Trial
    const startBtn = page.locator('#btnStartDailyTrial');
    await startBtn.click();
    await expect(modal).not.toHaveClass(/active/);

    // Check Daily Trial Loaded
    await expect(page.locator('#missionBadge')).toHaveText('🔥 DAILY');
    await expect(page.locator('#creditBadge')).toHaveText(/0 \/ 0/);
    await expect(page.locator('#mobileLvlCredits')).toHaveText('0/0 🚫');

    // 4. Verify Camera Swivels are Blocked (Hardcore Rule: 0 Credits)
    const rotateLeftBtn = page.locator('#btnCamRotateLeft');
    await rotateLeftBtn.click();
    await expect(page.locator('#feedbackText')).toHaveText(/In der täglichen Schreinprüfung sind Kameraschwenker verboten/);

    // 5. Get the mathematical BFS solution from the daily level and play it
    const dailySolution = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return lvl.solverSolution ? lvl.solverSolution.path : null;
    });

    expect(dailySolution).not.toBeNull();
    expect(dailySolution.length).toBeGreaterThan(10); // Guaranteed hardcore difficulty

    // Input the exact solution
    for (const cmd of dailySolution) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }

    // Run the execution
    await page.locator('#btnPlay').click();

    // 6. Verify Win & Streak Update
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 25000 });
    await expect(page.locator('#modalWinTitle')).toHaveText(/Tägliche Schreinprüfung gemeistert/);
    await expect(page.locator('.streak-big-val')).toHaveText(/1 Tag Streak/);

    // Close win modal and verify header streak badge is updated to 1 with checkmark
    await page.locator('#btnNextLevel').click();
    await expect(page.locator('#headerDailyStreak')).toHaveText('1 ✓');

    // Verify localStorage persistence
    const streakInfo = await page.evaluate(() => {
      return {
        completed: window.DailyTrial.isTodayCompleted(),
        streak: window.DailyTrial.getEffectiveStreak()
      };
    });
    expect(streakInfo.completed).toBe(true);
    expect(streakInfo.streak).toBe(1);

    // 7. Reopening modal shows "Heute gemeistert ✓"
    await dailyBtn.click();
    await expect(page.locator('#dailyStatusTag')).toHaveText('Heute gemeistert ✓');
    await expect(page.locator('.week-stamp-item.today')).toHaveClass(/stamped/);
    await page.locator('#btnCloseDailyTrial').click();

    // 8. Verify returning to standard campaign restores 6/6 credits
    await expect(page.locator('#creditBadge')).toHaveText('6 / 6');
  });
});
