import { test, expect } from '@playwright/test';

test.describe('KOMA Internationalization & Language Switcher (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear language preference before each test
    await page.addInitScript(() => {
      try {
        localStorage.removeItem('spirit_language');
      } catch (e) {}
    });
  });

  test('Default language under automated test environment defaults to German (preserving existing test assertions)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto('/?showHome=1');
    await page.waitForSelector('#homeScreen.active');

    const currentLang = await page.evaluate(() => window.I18N?.getLanguage());
    expect(currentLang).toBe('de');

    await expect(page.locator('#homeLangFlag')).toBeVisible();
    await expect(page.locator('#homeLangLabel')).toHaveText('DE');
    await expect(page.locator('#homeCurrentLevelTitle')).toHaveText(/Die erste Lieferung/i);
  });

  test('Homescreen language pill button toggles between German and English dynamically', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto('/?showHome=1');
    await page.waitForSelector('#homeScreen.active');

    // 1. Initial State: German
    await expect(page.locator('#homeLangLabel')).toHaveText('DE');
    await expect(page.locator('#homeCurrentLevelTitle')).toHaveText('Die erste Lieferung');

    // 2. Click language pill to switch to English
    await page.click('#btnHomeLang');

    // 3. Verify English UI updates immediately
    await expect(page.locator('#homeLangFlag')).toBeVisible();
    await expect(page.locator('#homeLangLabel')).toHaveText('EN');
    await expect(page.locator('#homeCurrentLevelTitle')).toHaveText('The First Delivery');
    await expect(page.locator('#homeCurrentChapter')).toContainText('CHAPTER 01');

    // Check localStorage persistence
    const savedLang = await page.evaluate(() => localStorage.getItem('spirit_language'));
    expect(savedLang).toBe('en');

    // 4. Click again to return to German
    await page.click('#btnHomeLang');
    await expect(page.locator('#homeLangFlag')).toBeVisible();
    await expect(page.locator('#homeLangLabel')).toHaveText('DE');
    await expect(page.locator('#homeCurrentLevelTitle')).toHaveText('Die erste Lieferung');
    await expect(page.locator('#homeCurrentChapter')).toContainText('KAPITEL 01');

    const returnedLang = await page.evaluate(() => localStorage.getItem('spirit_language'));
    expect(returnedLang).toBe('de');
  });

  test('Mobile Hub settings panel allows choosing language via buttons', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Open Mobile Hub directly to settings tab without Homescreen obstruction
    await page.evaluate(() => {
      window.gameInstance?.hideHomeScreen();
      window.gameInstance?.openMobileHub('settings');
    });
    await expect(page.locator('#hubPanelSettings')).toBeVisible();

    // 2. Check language row buttons exist
    const btnDe = page.locator('#btnSettingLangDe');
    const btnEn = page.locator('#btnSettingLangEn');
    await expect(btnDe).toBeVisible();
    await expect(btnEn).toBeVisible();

    // In German mode, German button is active
    await expect(btnDe).toHaveClass(/active/);
    await expect(btnEn).not.toHaveClass(/active/);

    // 3. Click English button
    await btnEn.click();

    // Verify active class shifted
    await expect(btnEn).toHaveClass(/active/);
    await expect(btnDe).not.toHaveClass(/active/);

    // Verify in-game command button title translated
    const cmdForward = page.locator('[data-cmd="F"]');
    await expect(cmdForward).toHaveAttribute('title', /Move Forward/i);

    // Check persistence
    const saved = await page.evaluate(() => localStorage.getItem('spirit_language'));
    expect(saved).toBe('en');
  });

  test('Auto-detection logic correctly detects English for non-German locales', async ({ page }) => {
    await page.goto('/?showHome=1');
    await page.waitForSelector('#homeScreen.active');

    const detectionResults = await page.evaluate(() => {
      const deTest = window.I18N?.detectLanguage ? window.I18N.detectLanguage('de-DE') : null;
      const enUsTest = window.I18N?.detectLanguage ? window.I18N.detectLanguage('en-US') : null;
      const enGbTest = window.I18N?.detectLanguage ? window.I18N.detectLanguage('en-GB') : null;
      const frTest = window.I18N?.detectLanguage ? window.I18N.detectLanguage('fr-FR') : null;
      const jaTest = window.I18N?.detectLanguage ? window.I18N.detectLanguage('ja-JP') : null;
      return { deTest, enUsTest, enGbTest, frTest, jaTest };
    });

    expect(detectionResults.deTest).toBe('de');
    expect(detectionResults.enUsTest).toBe('en');
    expect(detectionResults.enGbTest).toBe('en');
    // Non-German non-English fall back to international English
    expect(detectionResults.frTest).toBe('en');
    expect(detectionResults.jaTest).toBe('en');
  });

  test('Wardrobe skins and trophies are properly translated when switching to English', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto('/?showHome=1');
    await page.waitForSelector('#homeScreen.active');

    // Switch to English
    await page.evaluate(() => window.I18N?.setLanguage('en'));

    // Open Wardrobe modal
    await page.click('#btnHomeWardrobeWidget');
    await expect(page.locator('#modalSkins')).toHaveClass(/active/);

    // Verify skin title and description in English
    const skinName = await page.locator('#skinsGrid .skin-card:first-child .skin-name').textContent();
    expect(skinName).toBe('Shiro Usagi');
    const skinDesc = await page.locator('#skinsGrid .skin-card:first-child .skin-desc').textContent();
    expect(skinDesc).toContain('The classic white Shinto shrine chassis');

    // Close Wardrobe
    await page.click('#btnCloseSkins');

    // Open Trophies modal via game API after hiding home screen
    await page.evaluate(() => {
      window.gameInstance?.hideHomeScreen();
      window.gameInstance?.openTrophiesModal();
    });
    await expect(page.locator('#modalTrophies')).toHaveClass(/active/);

    // Verify trophy title in English
    const trophyTitle = await page.locator('#modalTrophiesList .trophy-card:first-child .trophy-title').textContent();
    expect(trophyTitle).toBe('Camera Monk');
  });
});
