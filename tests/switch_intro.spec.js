import { test, expect } from '@playwright/test';

test.describe('Switch Mechanic Intro & Privacy Policy', () => {
  test('Level 2 triggers Schrein-Schalter & Tore explanation modal', async ({ page }) => {
    // Navigate with testMechanic=1 to test explanation dialog
    await page.goto('/?testMechanic=1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Reset switch intro local storage flag and load Level 3 (index 2: "Das Tor des Schreins")
    await page.evaluate(() => {
      localStorage.removeItem('spirit_seen_switch_intro');
      window.gameInstance.loadLevel(2); // Level 3: "Das Tor des Schreins"
    });

    // Verify modal is active and shows switch introduction
    const modalInfo = await page.evaluate(() => {
      const modal = document.getElementById('modalMechanicIntro');
      const sub = document.getElementById('mechanicIntroSubtitle');
      const title = document.getElementById('mechanicIntroTitle');
      const desc = document.getElementById('mechanicIntroDesc');
      return {
        isActive: modal.classList.contains('active'),
        title: title.textContent,
        subtitle: sub.textContent,
        desc: desc.textContent
      };
    });

    expect(modalInfo.isActive).toBe(true);
    expect(modalInfo.title).toContain('Neues Element');
    expect(modalInfo.subtitle).toContain('Schrein-Schalter & Tore');
    expect(modalInfo.desc).toContain('Boden-Schalter');

    // Dismiss modal
    await page.click('#btnDismissMechanicIntro');
    const isClosed = await page.evaluate(() => {
      return !document.getElementById('modalMechanicIntro').classList.contains('active');
    });
    expect(isClosed).toBe(true);
  });

  test('Privacy policy page renders and toggles languages cleanly', async ({ page }) => {
    await page.goto('/privacy.html', { waitUntil: 'domcontentloaded' });
    
    // Heading visible
    await expect(page.locator('h1')).toContainText('Datenschutzerklärung');
    await expect(page.locator('#content-de')).toBeVisible();
    await expect(page.locator('#content-en')).toBeHidden();

    // Switch to English
    await page.click('button:has-text("English")');
    await expect(page.locator('#content-en')).toBeVisible();
    await expect(page.locator('#content-de')).toBeHidden();

    // Back button links to index.html
    const backBtn = page.locator('a.btn-back');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveAttribute('href', 'index.html');
  });

  test('Level 1 displays tutorial hint when plan queue is empty', async ({ page }) => {
    await page.goto('/?level=0', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const hintText = await page.evaluate(() => {
      return document.querySelector('#queueContainer .empty-queue-hint')?.textContent || '';
    });
    expect(hintText).toContain('Vorwärts');
    expect(hintText).toContain('Plan abspielen');
  });
});
