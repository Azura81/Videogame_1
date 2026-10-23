import { test, expect } from '@playwright/test';

test.describe('Boss Fight: Ryūjin · Himmelsdrache des Fuji (Level 60)', () => {

  test('Audio: Boss sound synthesizers execute cleanly without error', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const audioRes = await page.evaluate(() => {
      Sound.init();
      Sound.playDragonRoar();
      Sound.playTaikoDrum();
      Sound.playMagatamaShatter();
      Sound.playDragonVictory();
      return true;
    });
    expect(audioRes).toBe(true);
  });

  test('Level 60: Loads Boss HUD, 3D Dragon Model, and resets seals', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 60 (index 59)
    await page.evaluate(() => {
      window.gameInstance.loadLevel(59);
    });

    // Check Boss HUD visibility
    const bossHudVisible = await page.evaluate(() => {
      const hud = document.getElementById('bossHudBar');
      const name = document.getElementById('bossHudName');
      const s1 = document.getElementById('seal1');
      const s2 = document.getElementById('seal2');
      const s3 = document.getElementById('seal3');
      const phase = document.getElementById('bossPhaseBadge');
      return {
        display: window.getComputedStyle(hud).display,
        name: name.textContent,
        allLit: s1.classList.contains('lit') && s2.classList.contains('lit') && s3.classList.contains('lit'),
        phaseText: phase.textContent
      };
    });

    expect(bossHudVisible.display).not.toBe('none');
    expect(bossHudVisible.name).toContain('RYŪJIN');
    expect(bossHudVisible.allLit).toBe(true);
    expect(bossHudVisible.phaseText).toContain('Frost-Odem');

    // Check 3D Dragon Model in renderer
    const dragonInScene = await page.evaluate(() => {
      const g = window.gameInstance.renderer.dragonGroup;
      return {
        exists: !!g,
        childrenCount: g ? g.children.length : 0,
        name: g ? g.name : null
      };
    });
    expect(dragonInScene.exists).toBe(true);
    expect(dragonInScene.name).toBe('RyujinDragonGroup');
    expect(dragonInScene.childrenCount).toBeGreaterThan(10); // head, 14 segments, whiskers, paws, breath

    // Switch to Level 1 and verify Boss HUD is hidden and dragon cleared
    await page.evaluate(() => {
      window.gameInstance.loadLevel(0);
    });
    const level1State = await page.evaluate(() => {
      const hud = document.getElementById('bossHudBar');
      const g = window.gameInstance.renderer.dragonGroup;
      return {
        display: window.getComputedStyle(hud).display,
        hasDragon: !!g
      };
    });
    expect(level1State.display).toBe('none');
    expect(level1State.hasDragon).toBe(false);
  });

  test('Wardrobe: Ryūjin skin locked before defeat, unlocked after defeat', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Ensure not defeated initially
    const initialStatus = await page.evaluate(() => {
      localStorage.removeItem('koma_defeated_ryujin');
      return {
        unlocked: window.gameInstance.isSkinUnlocked('ryujin'),
        skinDef: window.KOMA_SKINS.ryujin
      };
    });
    expect(initialStatus.unlocked).toBe(false);
    expect(initialStatus.skinDef.name).toBe('Ryūjin Drache');

    // Open wardrobe modal and check lock display
    await page.evaluate(() => {
      window.gameInstance.openSkinsModal();
    });
    const cardContent = await page.evaluate(() => {
      const grid = document.getElementById('skinsGrid');
      return grid.innerHTML;
    });
    expect(cardContent).toContain('Ryūjin Drache');
    expect(cardContent).toContain('Besiege Ryūjin in Level 60');

    // Close wardrobe modal
    await page.evaluate(() => {
      window.gameInstance.closeSkinsModal();
    });
  });

  test('Level 60: Ryūjin telegraphs Frost-Odem warning on step 2 with 3D runes and badge', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 60
    await page.evaluate(() => {
      window.gameInstance.loadLevel(59);
      window.gameInstance.queue = ['L', 'R'];
      window.gameInstance.renderQueue();
      window.gameInstance.play();
    });

    // Wait for step 2 to complete and telegraph warning
    await page.waitForFunction(() => {
      const g = window.gameInstance;
      return g.currentStep === 2 && g.renderer && g.renderer.frostHazardGroup !== null;
    }, { timeout: 5000 });

    const telegraphState = await page.evaluate(() => {
      const badge = document.getElementById('bossPhaseBadge');
      const group = window.gameInstance.renderer.frostHazardGroup;
      return {
        badgeText: badge.textContent,
        isWarningClass: badge.classList.contains('warning'),
        hasHazardGroup: !!group,
        hazardChildren: group ? group.children.length : 0
      };
    });

    expect(telegraphState.badgeText).toContain('Spalte 3');
    expect(telegraphState.badgeText).toContain('Feuert nächste Runde');
    expect(telegraphState.isWarningClass).toBe(true);
    expect(telegraphState.hasHazardGroup).toBe(true);
    expect(telegraphState.hazardChildren).toBeGreaterThan(0);
  });

  test('Level 60: Frost-Odem freezes KOMA solid when caught unprotected on step 3', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 60 and execute 3 steps remaining in Column 3 (3,7)
    await page.evaluate(() => {
      window.gameInstance.loadLevel(59);
      window.gameInstance.queue = ['L', 'R', 'A'];
      window.gameInstance.renderQueue();
      window.gameInstance.play();
    });

    // Wait for step 3 to fire Frost-Odem and freeze KOMA
    await page.waitForFunction(() => {
      const g = window.gameInstance;
      return g.state.isFail === true && !g.isPlaying;
    }, { timeout: 8000 });

    const freezeState = await page.evaluate(() => {
      const g = window.gameInstance;
      const badge = document.getElementById('bossPhaseBadge');
      const iceCube = g.renderer.komaGroup ? g.renderer.komaGroup.getObjectByName('komaIceCube') : null;
      return {
        isFail: g.state.isFail,
        isPlaying: g.isPlaying,
        badgeText: badge ? badge.textContent : '',
        hasIceCube: !!iceCube,
        feedback: document.getElementById('feedbackText') ? document.getElementById('feedbackText').textContent : ''
      };
    });

    expect(freezeState.isFail).toBe(true);
    expect(freezeState.isPlaying).toBe(false);
    expect(freezeState.hasIceCube).toBe(true);
    expect(freezeState.badgeText).toContain('KOMA eingefroren');
    expect(freezeState.feedback).toContain('Eingefroren');
  });

  test('Level 60: Basalt block shields and deflects Frost-Odem on step 9', async ({ page }) => {
    test.setTimeout(25000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Run first 9 steps that push block into (4,4) crater to shield Reihe 4
    await page.evaluate(() => {
      window.gameInstance.loadLevel(59);
      window.gameInstance.queue = ['F', 'L', 'F', 'R', 'A', 'F', 'F', 'L', 'F'];
      window.gameInstance.renderQueue();
      window.gameInstance.play();
    });

    // Wait until playback of all 9 steps finishes including breath resolution
    await page.waitForFunction(() => {
      return !window.gameInstance.isPlaying && window.gameInstance.currentStep === 9;
    }, { timeout: 20000 });

    // Give beam and deflection feedback a short moment to settle
    await page.waitForTimeout(500);

    const shieldState = await page.evaluate(() => {
      const g = window.gameInstance;
      const badge = document.getElementById('bossPhaseBadge');
      const iceCube = g.renderer.komaGroup ? g.renderer.komaGroup.getObjectByName('komaIceCube') : null;
      return {
        isFail: g.state.isFail,
        hasIceCube: !!iceCube,
        badgeText: badge ? badge.textContent : '',
        badgeClasses: badge ? badge.className : '',
        feedback: document.getElementById('feedbackText') ? document.getElementById('feedbackText').textContent : ''
      };
    });

    // KOMA must NOT be frozen and shield badge confirms deflection!
    expect(shieldState.isFail).toBe(false);
    expect(shieldState.hasIceCube).toBe(false);
    expect(shieldState.badgeText).toContain('abgewehrt');
  });

  test('Level 60: Full 27-step victory, seal shattering, ascension, and skin unlock', async ({ page }) => {
    test.setTimeout(60000);
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Reset defeat status and load Level 60
    await page.evaluate(() => {
      localStorage.removeItem('koma_defeated_ryujin');
      window.gameInstance.loadLevel(59);
    });

    const levelData = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return {
        name: lvl.n,
        solution: lvl.solution,
        limit: lvl.limit,
        orbsCount: (lvl.orbs || []).length
      };
    });
    expect(levelData.solution.length).toBe(27);
    expect(levelData.orbsCount).toBe(3);

    // Set solution commands into queue and play
    await page.evaluate((sol) => {
      window.gameInstance.queue = [...sol];
      window.gameInstance.renderQueue();
      window.gameInstance.play();
    }, levelData.solution);

    // Wait for victory modal to show
    await page.waitForSelector('#modalWin.active', { timeout: 35000 });

    // Verify victory modal text and banner
    const winDetails = await page.evaluate(() => {
      const title = document.getElementById('modalWinTitle');
      const text = document.getElementById('modalWinText');
      const notice = document.getElementById('modalWinSkinNotice');
      const defeatedFlag = localStorage.getItem('koma_defeated_ryujin');
      const isSkinUnlocked = window.gameInstance.isSkinUnlocked('ryujin');
      return {
        title: title ? title.textContent : '',
        text: text ? text.textContent : '',
        noticeVisible: notice ? window.getComputedStyle(notice).display : 'none',
        noticeHtml: notice ? notice.innerHTML : '',
        defeatedFlag,
        isSkinUnlocked
      };
    });

    expect(winDetails.title).toContain('BEZWUNGEN');
    expect(winDetails.text).toContain('Ryūjin');
    expect(winDetails.defeatedFlag).toBe('true');
    expect(winDetails.isSkinUnlocked).toBe(true);
    expect(winDetails.noticeVisible).not.toBe('none');
    expect(winDetails.noticeHtml).toContain('Ryūjin Drache');

    // Equip the newly unlocked Ryūjin skin
    await page.evaluate(() => {
      window.gameInstance.equipSkin('ryujin');
    });
    const equipped = await page.evaluate(() => {
      return window.gameInstance.equippedSkin;
    });
    expect(equipped).toBe('ryujin');
  });

});
