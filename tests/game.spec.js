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

  test('Campaign contains all 60 levels in level drawer and mission badge', async ({ page }) => {
    await expect(page.locator('#missionBadge')).toHaveText('01 / 60');
    
    // Open level drawer
    await page.locator('#btnLevelSelect').click();
    await expect(page.locator('#levelDrawer')).toHaveClass(/open/);
    
    // Check 60 level buttons are present
    const pills = page.locator('.level-pill-btn');
    await expect(pills).toHaveCount(60);
    
    // Check level 60 title is present
    await expect(page.locator('.level-pill-btn').nth(59)).toContainText('Der Geist des Fuji');
  });

  test('Level 11 (Dual-Tore) can be loaded and solved with Cyan & Magenta gates', async ({ page }) => {
    // Open drawer and select Level 11
    await page.locator('#btnLevelSelect').click();
    const pill = page.locator('.level-pill-btn').nth(10); // Level 11 is index 10
    await pill.scrollIntoViewIfNeeded();
    await pill.click();
    
    await expect(page.locator('#levelTitle')).toHaveText('Zwei Lichter');
    await expect(page.locator('#missionBadge')).toHaveText('11 / 60');
    
    // Solution for Level 11: F, A, R, F, F, A, L, F, L, F, R, F, R, F, F
    const cmds = ["F", "A", "R", "F", "F", "A", "L", "F", "L", "F", "R", "F", "R", "F", "F"];
    for (const cmd of cmds) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }
    
    await page.locator('#btnPlay').click();
    
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 35000 });
    await expect(page.locator('#modalWinStars')).toContainText(/3 Sterne/);
  });

  test('Level 19 (Kitsune Portal) teleports KOMA to the other side', async ({ page }) => {
    // Open drawer and select Level 19
    await page.locator('#btnLevelSelect').click();
    await page.locator('.level-pill-btn').nth(18).click(); // Level 19 is index 18
    
    await expect(page.locator('#levelTitle')).toHaveText('Das Portal des Fuchses');
    await expect(page.locator('#missionBadge')).toHaveText('19 / 60');
    
    // Solution: F, F, F, F (teleports through portal)
    for (let i = 0; i < 4; i++) {
      await page.locator('button[data-cmd="F"]').click();
    }
    
    await page.locator('#btnPlay').click();
    
    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 10000 });
    await expect(page.locator('#modalWinStars')).toContainText(/3 Sterne/);
  });

  test('Level 51 (Mount Fuji Windböe) can be loaded, displays Fuji theme, and solves with wind boost', async ({ page }) => {
    // Open drawer and select Level 51 (index 50)
    await page.locator('#btnLevelSelect').click();
    const pill = page.locator('.level-pill-btn').nth(50);
    await pill.scrollIntoViewIfNeeded();
    await pill.click();
    
    await expect(page.locator('#levelTitle')).toHaveText('Der erste Bergwind');
    await expect(page.locator('#missionBadge')).toHaveText('51 / 60');
    await expect(page.locator('#chapterTitle')).toContainText('Der Heilige Berg Fuji');

    // Solution: F, L, F, F, R, F (Rides wind, activates switch, passes gate to goal)
    const cmds = ["F", "L", "F", "F", "R", "F"];
    for (const cmd of cmds) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }
    await page.locator('#btnPlay').click();

    const winModal = page.locator('#modalWin');
    await expect(winModal).toHaveClass(/active/, { timeout: 12000 });
    await expect(page.locator('#modalWinStars')).toContainText(/3 Sterne/);
  });

  test('Trophies Cabinet and Mobile Hub Achievements tab display 6 sacred seals', async ({ page }) => {
    // Open Trophies Modal on Desktop
    const btnTrophies = page.locator('#btnTrophies');
    await expect(btnTrophies).toBeVisible();
    await btnTrophies.click();
    
    const modalTrophies = page.locator('#modalTrophies');
    await expect(modalTrophies).toHaveClass(/active/);
    
    // Verify 6 trophy cards are displayed
    const trophyCards = page.locator('.trophy-card');
    await expect(trophyCards).toHaveCount(6);
    await expect(trophyCards.nth(0)).toContainText('Kamera-Mönch');
    await expect(trophyCards.nth(2)).toContainText('Herr des Windes');
    await expect(trophyCards.nth(3)).toContainText('Fuji-Besteiger');
    
    // Close modal
    await page.locator('#btnCloseTrophies').click();
    await expect(modalTrophies).not.toHaveClass(/active/);
  });

  test('Audio system: Master mute and BGM toggle independently control sound effects and music', async ({ page }) => {
    const btnSound = page.locator('#btnSoundToggle');
    const btnMusic = page.locator('#btnMusicToggle');

    // 1. Initial State: Sound unmuted
    await expect(btnSound).toHaveText('🔊');

    // 2. Click Music Toggle to start BGM
    await btnMusic.click();
    await expect(btnMusic).toHaveClass(/playing/);
    await expect(btnMusic).toHaveText('🎵');
    const isPlayingAfterClick = await page.evaluate(() => Sound.bgmPlaying && !Sound.masterMuted);
    expect(isPlayingAfterClick).toBe(true);

    // 3. Click Music Toggle to stop BGM (SFX stay enabled)
    await btnMusic.click();
    await expect(btnMusic).toHaveClass(/muted/);
    await expect(btnMusic).toHaveText('🔇');
    const isPlayingAfterStop = await page.evaluate(() => Sound.bgmPlaying);
    expect(isPlayingAfterStop).toBe(false);

    // 4. Footsteps, Turns, Goal Win, and Portal can all be triggered without error
    const sfxWorking = await page.evaluate(() => {
      try {
        Sound.playStep();
        Sound.playTurn();
        Sound.playWin();
        Sound.playOrb();
        Sound.playPortal();
        return true;
      } catch (err) {
        return false;
      }
    });
    expect(sfxWorking).toBe(true);

    // 5. Click Master Sound Toggle to mute everything
    await btnSound.click();
    await expect(btnSound).toHaveText('🔇');
    await expect(btnSound).toHaveClass(/muted/);
    await expect(btnMusic).toHaveClass(/muted/);
    const isMasterMuted = await page.evaluate(() => Sound.masterMuted);
    expect(isMasterMuted).toBe(true);

    // 6. Click Master Sound Toggle to unmute
    await btnSound.click();
    await expect(btnSound).toHaveText('🔊');
    const isMasterUnmuted = await page.evaluate(() => Sound.masterMuted);
    expect(isMasterUnmuted).toBe(false);
  });

  test('Shrine Wardrobe modal opens, displays Japanese Kami skins with star requirements, and equips unlocked skins', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas');

    // 1. Verify Header stars badge is present
    const headerStarsBadge = page.locator('#headerStarsBadge');
    await expect(headerStarsBadge).toBeVisible();
    const headerTotalStars = page.locator('#headerTotalStars');
    await expect(headerTotalStars).toHaveText('0');

    // 2. Click Shrine Wardrobe button to open modal
    const btnSkins = page.locator('#btnSkins');
    await btnSkins.click();
    const modalSkins = page.locator('#modalSkins');
    await expect(modalSkins).toHaveClass(/active/);

    // 3. Verify all 6 Japanese Kami skins are rendered
    const skinCards = modalSkins.locator('.skin-card');
    await expect(skinCards).toHaveCount(6);

    // 4. Verify initial skin is Shiro Usagi (equipped)
    const initialEquipped = await page.evaluate(() => window.gameInstance.equippedSkin);
    expect(initialEquipped).toBe('original');

    // 5. Simulate earning 15 stars across levels (sufficient to unlock Sakura Kitsune)
    await page.evaluate(() => {
      window.gameInstance.levelStars = { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3 };
      window.gameInstance.saveProgress();
      window.gameInstance.updateStarsDisplay();
      window.gameInstance.renderSkinsModal();
    });

    const modalTotalStars = page.locator('#modalTotalStars');
    await expect(modalTotalStars).toHaveText('15');
    await expect(headerTotalStars).toHaveText('15');

    // 6. Verify Sakura Kitsune now has an active 'Ausrüsten' button
    const equipSakuraBtn = modalSkins.locator('button[data-skin-id="sakura"]');
    await expect(equipSakuraBtn).toBeVisible();
    await expect(equipSakuraBtn).toHaveText('Ausrüsten');

    // 7. Click to equip Sakura Kitsune skin
    await equipSakuraBtn.click();

    // Verify game state, localStorage, and 3D renderer state
    const currentSkin = await page.evaluate(() => window.gameInstance.equippedSkin);
    expect(currentSkin).toBe('sakura');

    const storedSkin = await page.evaluate(() => localStorage.getItem('koma_equipped_skin'));
    expect(storedSkin).toBe('sakura');

    const rendererSkin = await page.evaluate(() => window.gameInstance.renderer.currentSkinId);
    expect(rendererSkin).toBe('sakura');

    // 8. Close Wardrobe modal
    const btnCloseSkins = page.locator('#btnCloseSkins');
    await btnCloseSkins.click();
    await expect(modalSkins).not.toHaveClass(/active/);
  });

  test('PWA manifest, offline service worker, and mobile touch setup are configured', async ({ page }) => {
    // 1. Verify manifest link in head
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', 'manifest.json');

    // 2. Verify apple-touch-icon
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toHaveAttribute('href', 'icons/apple-touch-icon.png');

    // 3. Verify theme-color
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#070c14');

    // 4. Verify PWA install button exists
    const installBtn = page.locator('#btnInstallPwa');
    await expect(installBtn).toBeAttached();

    // 5. Verify PWA network toast exists
    const toast = page.locator('#pwaNetworkBanner');
    await expect(toast).toBeAttached();

    // 6. Test online/offline toast event trigger
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await expect(toast).not.toHaveClass(/hidden/);
    await expect(page.locator('#pwaNetworkText')).toContainText('Offline-Modus aktiv');
  });

  test('Mobile Hub: On smartphone viewports, HUD is reduced, Mobile Hub opens with tabs, and execution mode collapses deck', async ({ page }) => {
    // 1. Set mobile viewport (iPhone 14 / Safari portrait 390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // 2. Mission panel is hidden on mobile to give full screen to 3D garden
    const leftPanel = page.locator('.panel-left');
    await expect(leftPanel).toBeHidden();

    // 3. Mobile Hub button & Mobile Level Pill are visible in top bar
    const mobileHubBtn = page.locator('#btnMobileHub');
    const mobileLevelPill = page.locator('#mobileLevelPill');
    await expect(mobileHubBtn).toBeVisible();
    await expect(mobileLevelPill).toBeVisible();
    await expect(page.locator('#mobileLvlTitle')).toHaveText('Lvl 01');

    // 4. Desktop clutter buttons are hidden on mobile
    await expect(page.locator('#btnSkins')).toBeHidden();
    await expect(page.locator('#btnLevelSelect')).toBeHidden();

    // 5. Click Mobile Hub button (⛩️ Menü) to open Mobile Shrine Hub
    await mobileHubBtn.click();
    const mobileHub = page.locator('#modalMobileHub');
    await expect(mobileHub).toHaveClass(/active/);

    // 6. Verify Wardrobe tab is active and shows Kami skins
    const skinsPanel = page.locator('#hubPanelSkins');
    await expect(skinsPanel).toBeVisible();
    const mobileSkins = page.locator('.mobile-skin-card');
    await expect(mobileSkins).toHaveCount(6);

    // 7. Switch to 50 Levels Tab
    const tabLevels = page.locator('#tabBtnLevels');
    await tabLevels.click();
    const levelsPanel = page.locator('#hubPanelLevels');
    await expect(levelsPanel).toBeVisible();
    const levelCards = page.locator('.mobile-level-card');
    await expect(levelCards).toHaveCount(10); // Chapter 1 has 10 levels

    // 8. Select Level 2 from the Mobile Hub
    await levelCards.nth(1).click();
    await expect(mobileHub).not.toHaveClass(/active/);
    await expect(page.locator('#mobileLvlTitle')).toHaveText('Lvl 02');

    // 9. Test execution mode in-game collapse on mobile
    await page.locator('button[data-cmd="F"]').click();
    await page.locator('#btnPlay').click();
    
    // Commands grid collapses and mobile-exec-bar is displayed during execution
    await expect(page.locator('body')).toHaveClass(/is-executing/);
    await expect(page.locator('#mobileExecBar')).toBeVisible();

    // After step finishes, is-executing is removed and controls return
    await expect(page.locator('body')).not.toHaveClass(/is-executing/, { timeout: 6000 });
    await expect(page.locator('#btnPlay')).toBeVisible();

    // Reset restores full state
    await page.locator('#btnReset').click();
    await expect(page.locator('#queueCount')).toHaveText('1 / 8');
  });
});


