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

  test('Complete bilingual UI overhaul: toggling language changes all in-game deck, drawer, feedback, and modal texts without refresh', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    // Go directly to level 1 gameplay
    await page.goto('/?skipHome=1&level=1');
    await page.waitForSelector('canvas');

    // --- 1. German Initial State Verification ---
    await expect(page.locator('[data-i18n="commands_title"]')).toHaveText('Befehle');
    await expect(page.locator('[data-i18n="sequence_title"]')).toHaveText('Befehlsfolge');
    await expect(page.locator('[data-i18n="cmd_forward"]')).toHaveText('Vorwärts');
    await expect(page.locator('[data-i18n="cmd_left"]')).toHaveText('Links');
    await expect(page.locator('[data-i18n="cmd_right"]')).toHaveText('Rechts');
    await expect(page.locator('[data-i18n="cmd_action"]')).toHaveText('Aktion');
    await expect(page.locator('[data-i18n="cmd_reset"]')).toHaveText('Zurücksetzen');
    await expect(page.locator('[data-i18n="cmd_undo"]')).toHaveText('Rückgängig');
    await expect(page.locator('[data-i18n="cmd_clear"]')).toHaveText('Löschen');
    await expect(page.locator('[data-i18n="cmd_play"]')).toHaveText('Plan abspielen');
    await expect(page.locator('#levelTitle')).toHaveText('Die erste Lieferung');
    await expect(page.locator('#feedbackText')).toContainText('Plane deine Befehlsfolge');

    // Check Level Drawer in German
    await page.click('#btnLevelSelect');
    await expect(page.locator('#levelDrawer')).toHaveClass(/open/);
    await expect(page.locator('#levelDrawer .drawer-title')).toHaveText('Levelauswahl');
    await expect(page.locator('.drawer-tab[data-chapter="all"]')).toHaveText('Alle (60)');
    await expect(page.locator('.drawer-tab[data-chapter="1"]')).toHaveText('Kap. 1');
    const firstPillDe = await page.locator('#levelList .level-pill-btn:first-child .pill-title').textContent();
    expect(firstPillDe).toContain('Die erste Lieferung');
    await page.click('#btnCloseDrawer');
    await expect(page.locator('#levelDrawer')).not.toHaveClass(/open/);

    // --- 2. Switch Language to English In-Place ---
    await page.evaluate(() => window.I18N?.setLanguage('en'));

    // --- 3. Verify English UI Immediately Updates In-Place ---
    // Command Deck Titles & Buttons
    await expect(page.locator('[data-i18n="commands_title"]')).toHaveText('Commands');
    await expect(page.locator('[data-i18n="sequence_title"]')).toHaveText('Command Sequence');
    await expect(page.locator('[data-i18n="cmd_forward"]')).toHaveText('Forward');
    await expect(page.locator('[data-i18n="cmd_left"]')).toHaveText('Turn Left');
    await expect(page.locator('[data-i18n="cmd_right"]')).toHaveText('Turn Right');
    await expect(page.locator('[data-i18n="cmd_action"]')).toHaveText('Action');
    await expect(page.locator('[data-i18n="cmd_reset"]')).toHaveText('Reset');
    await expect(page.locator('[data-i18n="cmd_undo"]')).toHaveText('Undo');
    await expect(page.locator('[data-i18n="cmd_clear"]')).toHaveText('Clear');
    await expect(page.locator('[data-i18n="cmd_play"]')).toHaveText('Run Plan');
    await expect(page.locator('#levelTitle')).toHaveText('The First Delivery');

    // Dynamic Feedback in English
    await expect(page.locator('#feedbackText')).toContainText('Plan your command sequence');

    // Add a command and check feedback translation
    await page.click('[data-cmd="F"]');
    await expect(page.locator('#feedbackText')).toContainText('Forward added.');

    // Remove command and check feedback
    await page.click('#btnUndo');
    await expect(page.locator('#feedbackText')).toContainText('Last command removed.');

    // Level Drawer in English
    await page.click('#btnLevelSelect');
    await expect(page.locator('#levelDrawer')).toHaveClass(/open/);
    await expect(page.locator('#levelDrawer .drawer-title')).toHaveText('Select Level');
    await expect(page.locator('.drawer-tab[data-chapter="all"]')).toHaveText('All (60)');
    await expect(page.locator('.drawer-tab[data-chapter="1"]')).toHaveText('Ch. 1');
    const firstPillEn = await page.locator('#levelList .level-pill-btn:first-child .pill-title').textContent();
    expect(firstPillEn).toContain('The First Delivery');
    await page.click('#btnCloseDrawer');

    // Help Modal in English
    await page.click('#btnHelp');
    await expect(page.locator('#modalHelp')).toHaveClass(/active/);
    await expect(page.locator('.help-modal-title')).toHaveText(/Game Concept/i);
    await expect(page.locator('.help-tab-btn[data-tab="helpTabStory"]')).toContainText(/Story/i);
    await expect(page.locator('.help-tab-btn[data-tab="helpTabControls"]')).toContainText(/Controls/i);
    await expect(page.locator('.help-tab-btn[data-tab="helpTabObstacles"]')).toContainText(/Obstacles/i);
    await expect(page.locator('.help-tab-btn[data-tab="helpTabStars"]')).toContainText(/Stars/i);
    await expect(page.locator('#btnDismissHelp')).toHaveText(/Understood/i);
    await page.click('#btnDismissHelp');
    await expect(page.locator('#modalHelp')).not.toHaveClass(/active/);
  });
});
