import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Spirit Delivery — 3-Level Playable Ad & Web Demo', () => {
  test('Plays through all 3 levels, unlocks gates, uses teleporter, and reveals End Card', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const demoPath = 'file://' + path.resolve(__dirname, '..', 'playable_ad.html');
    await page.goto(demoPath);

    // 1. Verify Level 1 HUD
    await expect(page.locator('#levelPillText')).toHaveText(/Level 1/);
    await expect(page.locator('#canvas-container canvas')).toBeVisible();

    // --- LEVEL 1: First Steps (F, F, F, R, F) ---
    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnTurnRight').click();
    await page.locator('#btnForward').click();

    await page.locator('#btnRunPlan').click();

    // Level 1 complete toast appears and transitions to Level 2
    const toast = page.locator('#levelToast');
    await expect(toast).toHaveClass(/active/, { timeout: 8000 });
    await expect(toast).toContainText(/LEVEL 1/i);

    // --- LEVEL 2: Neon Gate & Switch ---
    await expect(page.locator('#levelPillText')).toHaveText(/Level 2/, { timeout: 6000 });

    // Enter solution: Forward onto switch, Right, Forward, Right, Forward through open gate, Forward to shrine
    // F, R, F, R, F, F
    await page.locator('#btnForward').click();
    await page.locator('#btnTurnRight').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnTurnRight').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();

    await page.locator('#btnRunPlan').click();

    // Level 2 complete toast transitions to Level 3
    await expect(toast).toHaveClass(/active/, { timeout: 8000 });
    await expect(toast).toContainText(/LEVEL 2/i);

    // --- LEVEL 3: Kitsune Teleporter Portal ---
    await expect(page.locator('#levelPillText')).toHaveText(/Level 3/, { timeout: 6000 });

    // Solution: Forward x 2 into portal, Forward x 2 to shrine
    // F, F, F, F
    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();
    await page.locator('#btnForward').click();

    await page.locator('#btnRunPlan').click();

    // --- GRAND VICTORY END CARD ---
    const endCard = page.locator('#endCardOverlay');
    await expect(endCard).toHaveClass(/active/, { timeout: 10000 });

    const btnEndCta = page.locator('#btnEndCta');
    await expect(btnEndCta).toBeVisible();
    await expect(btnEndCta).toContainText(/APP STORE/i);

    // Screenshot of final 3-level victory screen
    await page.screenshot({ path: path.resolve(__dirname, '..', 'playable_ad_3levels_victory.png') });
  });
});
