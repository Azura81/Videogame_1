import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Spirit Delivery — Playable Ad & Web Demo', () => {
  test('Playable Ad loads, accepts commands, runs plan and triggers End Card with App Store CTA', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14/15 size

    const demoPath = 'file://' + path.resolve(__dirname, '..', 'playable_ad.html');
    await page.goto(demoPath);

    // 1. Verify Top Bar & Brand
    await expect(page.locator('.ad-brand-title')).toHaveText('Spirit Delivery');
    await expect(page.locator('#btnAdCtaMini')).toBeVisible();

    // 2. Verify 3D Canvas
    await expect(page.locator('#canvas-container canvas')).toBeVisible();

    // 3. Verify Hand Pointer Hint
    const handHint = page.locator('#handHint');
    await expect(handHint).toBeVisible();

    // 4. Enter solution: Forward x 3, Turn Right, Forward (F, F, F, R, F)
    await page.locator('#btnForward').click();
    // Hint should disappear after first tap
    await expect(handHint).toHaveClass(/hidden/);

    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnTurnRight').click();
    await page.locator('#btnForward').click();

    // Verify 5 chips in queue
    const chips = page.locator('.cmd-chip');
    await expect(chips).toHaveCount(5);

    // 5. Test Undo
    await page.locator('#btnUndo').click();
    await expect(page.locator('.cmd-chip')).toHaveCount(4);

    // Re-add Forward
    await page.locator('#btnForward').click();
    await expect(page.locator('.cmd-chip')).toHaveCount(5);

    // 6. Click Run Plan
    await page.locator('#btnRunPlan').click();

    // 7. Verify Victory End Card appears after execution
    const endCard = page.locator('#endCardOverlay');
    await expect(endCard).toHaveClass(/active/, { timeout: 10000 });

    // 8. Verify App Store CTA Button is visible and ready
    const btnEndCta = page.locator('#btnEndCta');
    await expect(btnEndCta).toBeVisible();
    await expect(btnEndCta).toContainText(/LADEN|STORE/i);

    // Take screenshot of Victory End Card
    await page.screenshot({ path: path.resolve(__dirname, '..', 'playable_ad_victory.png') });
  });
});
