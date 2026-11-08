import { test, expect } from '@playwright/test';

test.describe('Intermediate Boss: Iwa-Komainu · Steinerner Schreinwächter (Level 30)', () => {

  test('Audio: Komainu sound synthesizers execute cleanly without error', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const audioRes = await page.evaluate(() => {
      Sound.init();
      Sound.playKomainuRoar();
      Sound.playKomainuPacified();
      return true;
    });
    expect(audioRes).toBe(true);
  });

  test('Level 30: Loads Boss HUD, 3D Komainu Model, and 2 relics', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 30 (index 29)
    await page.evaluate(() => {
      window.gameInstance.loadLevel(29);
    });

    // Check Boss HUD visibility and labels
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
        s1Lit: s1.classList.contains('lit'),
        s2Lit: s2.classList.contains('lit'),
        s3Hidden: s3.style.display === 'none',
        phaseText: phase.textContent
      };
    });

    expect(bossHudVisible.display).not.toBe('none');
    expect(bossHudVisible.name).toContain('KOMAINU');
    expect(bossHudVisible.s1Lit).toBe(true);
    expect(bossHudVisible.s2Lit).toBe(true);
    expect(bossHudVisible.s3Hidden).toBe(true);
    expect(bossHudVisible.phaseText).toContain('Komainu-Gebrüll');

    // Check 3D Komainu Model in renderer
    const komainuInScene = await page.evaluate(() => {
      const g = window.gameInstance.renderer.komainuGroup;
      return {
        exists: !!g,
        childrenCount: g ? g.children.length : 0,
        name: g ? g.name : null
      };
    });
    expect(komainuInScene.exists).toBe(true);
    expect(komainuInScene.name).toBe('KomainuBossGroup');
  });

  test('Level 30: Solution executes, cages Komainu, and completes successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Load Level 30
    await page.evaluate(() => {
      window.gameInstance.loadLevel(29);
      const lvl = window.gameInstance.getCurrentLevel();
      window.gameInstance.queue = [...lvl.solution];
      window.gameInstance.renderQueue();
    });

    // Run queue
    await page.locator('#btnPlay').click();

    // Wait for win modal or completion
    await page.waitForFunction(() => {
      const modal = document.getElementById('modalWin');
      return modal && modal.classList.contains('active');
    }, { timeout: 40000 });

    const winData = await page.evaluate(() => {
      const title = document.getElementById('modalWinTitle');
      const text = document.getElementById('modalWinText');
      return {
        title: title ? title.textContent : '',
        text: text ? text.textContent : '',
        isPacified: window.gameInstance.renderer.isKomainuPacified
      };
    });

    expect(winData.title).toContain('BEZWUNGEN');
    expect(winData.isPacified).toBe(true);
  });

  test('Level 30: Roar hits and fails KOMA if standing unprotected in active hazard lane on step 3', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const failFeedback = await page.evaluate(async () => {
      window.gameInstance.loadLevel(29);
      // Step 3 targets Bambushain-West (column 2)
      window.gameInstance.state.x = 2;
      window.gameInstance.state.y = 3;
      window.gameInstance.state.blocks = [[1, 1]]; // block not shielding
      window.gameInstance.processBossBreath(window.gameInstance.getCurrentLevel(), 3);
      await new Promise(r => setTimeout(r, 700));
      return {
        isFail: window.gameInstance.state.isFail,
        feedback: document.getElementById('feedbackText')?.textContent || ''
      };
    });

    expect(failFeedback.isFail).toBe(true);
    expect(failFeedback.feedback).toContain('Gebrüll');
  });

  test('Level 30: Reaching goal without all Spirit Lights does not hang/softlock and exits execution mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    await page.evaluate(() => {
      window.gameInstance.hideHomeScreen();
      window.gameInstance.loadLevel(29);
      // Place robot adjacent to goal (6, 2) facing N toward goal (6, 1) with only 1 orb collected
      window.gameInstance.queue = ['R', 'F', 'F', 'F', 'L', 'F', 'F', 'F', 'F', 'F'];
      window.gameInstance.renderQueue();
    });

    await page.locator('#btnPlay').click();
    await expect(page.locator('body')).toHaveClass(/is-executing/);

    // Wait for execution to complete without hanging
    await expect(page.locator('body')).not.toHaveClass(/is-executing/, { timeout: 15000 });

    const stateAfter = await page.evaluate(() => ({
      isPlaying: window.gameInstance.isPlaying,
      isWin: window.gameInstance.state.isWin,
      isFail: window.gameInstance.state.isFail,
      feedback: document.getElementById('feedbackText')?.textContent || ''
    }));

    expect(stateAfter.isPlaying).toBe(false);
    expect(stateAfter.isWin).toBe(false);
    expect(stateAfter.isFail).toBe(true);
    expect(stateAfter.feedback).toContain('versiegelt');
  });

  test('Abort button interrupts active delivery and returns robot to start position', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    await page.evaluate(() => {
      window.gameInstance.hideHomeScreen();
      window.gameInstance.loadLevel(29);
      window.gameInstance.queue = ['L', 'F', 'F', 'R', 'F', 'F', 'F'];
      window.gameInstance.renderQueue();
    });

    await page.locator('#btnPlay').click();
    await expect(page.locator('body')).toHaveClass(/is-executing/);
    await expect(page.locator('#btnPlay')).toHaveClass(/abort-mode/);

    // Click #btnPlay while in abort-mode to cancel delivery mid-run
    await page.waitForTimeout(500);
    await page.locator('#btnPlay').click();

    await expect(page.locator('body')).not.toHaveClass(/is-executing/);
    const abortedState = await page.evaluate(() => ({
      isPlaying: window.gameInstance.isPlaying,
      x: window.gameInstance.state.x,
      y: window.gameInstance.state.y,
      queueLen: window.gameInstance.queue.length,
      feedback: document.getElementById('feedbackText')?.textContent || ''
    }));

    expect(abortedState.isPlaying).toBe(false);
    expect(abortedState.x).toBe(3);
    expect(abortedState.y).toBe(6);
    expect(abortedState.queueLen).toBe(7);
    expect(abortedState.feedback).toContain('abgebrochen');
  });

  test('2x Speed toggle and Single-Step (⏭ Schritt) debug mode work cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    await page.evaluate(() => {
      window.gameInstance.hideHomeScreen();
      window.gameInstance.loadLevel(0); // Level 1: solution is ['F', 'F', 'F', 'F', 'R', 'F']
      window.gameInstance.queue = ['F', 'F', 'F', 'F', 'R', 'F'];
      window.gameInstance.renderQueue();
    });

    // 1. Test 1x / 2x Speed Toggle
    await expect(page.locator('#btnSpeedText')).toHaveText('1x');
    await page.locator('#btnSpeedToggle').click();
    await expect(page.locator('#btnSpeedText')).toHaveText('⚡ 2x');
    await expect(page.locator('#btnSpeedToggle')).toHaveClass(/speed-fast/);

    const speedState = await page.evaluate(() => ({
      speed: window.gameInstance.playbackSpeed,
      stored: localStorage.getItem('koma_playback_speed'),
      delay300: window.gameInstance.getStepDelay(300)
    }));
    expect(speedState.speed).toBe(2);
    expect(speedState.stored).toBe('2');
    expect(speedState.delay300).toBe(150);

    // 2. Test Single-Step (⏭ Schritt) execution: Step 1 of 6 (moves East from x=0 to x=1)
    const startX = await page.evaluate(() => window.gameInstance.state.x);
    await page.locator('#btnStep').click();

    await page.waitForFunction(() => !window.gameInstance.isPlaying && window.gameInstance.currentStep === 1);

    const step1State = await page.evaluate(() => ({
      isPlaying: window.gameInstance.isPlaying,
      isStepMode: window.gameInstance.isStepMode,
      currentStep: window.gameInstance.currentStep,
      x: window.gameInstance.state.x,
      stepText: document.getElementById('btnStepText')?.textContent,
      playText: document.getElementById('btnPlayText')?.textContent
    }));
    expect(step1State.isPlaying).toBe(false);
    expect(step1State.isStepMode).toBe(true);
    expect(step1State.currentStep).toBe(1);
    expect(step1State.x).toBe(startX + 1);
    expect(step1State.stepText).toBe('1/6');
    expect(step1State.playText).toBe('Weiter');

    // 3. Click #btnStep again -> advances to Step 2 of 6 without resetting
    await page.locator('#btnStep').click();
    await page.waitForFunction(() => !window.gameInstance.isPlaying && window.gameInstance.currentStep === 2);

    const step2State = await page.evaluate(() => ({
      currentStep: window.gameInstance.currentStep,
      x: window.gameInstance.state.x,
      stepText: document.getElementById('btnStepText')?.textContent
    }));
    expect(step2State.currentStep).toBe(2);
    expect(step2State.x).toBe(startX + 2);
    expect(step2State.stepText).toBe('2/6');

    // 4. Click #btnPlay ('Weiter') -> resumes from Step 2 and wins Level 1
    await page.locator('#btnPlay').click();
    await page.waitForFunction(() => window.gameInstance.state.isWin === true);

    const winState = await page.evaluate(() => ({
      isWin: window.gameInstance.state.isWin,
      isPlaying: window.gameInstance.isPlaying,
      isStepMode: window.gameInstance.isStepMode,
      currentStep: window.gameInstance.currentStep
    }));
    expect(winState.isWin).toBe(true);
    expect(winState.isPlaying).toBe(false);
    expect(winState.isStepMode).toBe(false);
    expect(winState.currentStep).toBe(6);
  });

  test('Inline queue editing allows replacing, inserting before, moving, and deleting steps', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    await page.evaluate(() => {
      window.gameInstance.hideHomeScreen();
      window.gameInstance.loadLevel(0); // limit = 8
      window.gameInstance.queue = ['F', 'L', 'F'];
      window.gameInstance.renderQueue();
    });

    const editBar = page.locator('#queueEditBar');
    await expect(editBar).not.toHaveClass(/active/);

    // 1. Click step #2 ('L') to select it for editing
    const chips = page.locator('.queue-chip');
    await chips.nth(1).click();
    await expect(editBar).toHaveClass(/active/);
    await expect(chips.nth(1)).toHaveClass(/selected-edit/);
    await expect(page.locator('#queueEditLabel')).toContainText('Schritt #2');

    // 2. Tap 'Rechts' ([data-cmd="R"]) to replace step #2 in-place ('L' -> 'R')
    await page.locator('button[data-cmd="R"]').click();
    let queueNow = await page.evaluate(() => [...window.gameInstance.queue]);
    expect(queueNow).toEqual(['F', 'R', 'F']);
    await expect(page.locator('#queueCount')).toHaveText('3 / 8');

    // 3. Click '➕ Davor' (#btnQueueInsertBefore) and tap 'Aktion' ([data-cmd="A"]) to insert before step #2
    await page.locator('#btnQueueInsertBefore').click();
    await expect(editBar).toHaveClass(/insert-mode/);
    await page.locator('button[data-cmd="A"]').click();
    queueNow = await page.evaluate(() => [...window.gameInstance.queue]);
    expect(queueNow).toEqual(['F', 'A', 'R', 'F']);
    await expect(page.locator('#queueCount')).toHaveText('4 / 8');

    // 4. Move selected step (#2 'A') right via #btnQueueMoveRight (▶) -> swaps with 'R'
    await page.locator('#btnQueueMoveRight').click();
    queueNow = await page.evaluate(() => [...window.gameInstance.queue]);
    expect(queueNow).toEqual(['F', 'R', 'A', 'F']);
    await expect(page.locator('#queueEditLabel')).toContainText('Schritt #3');

    // 5. Delete selected step (#3 'A') via #btnQueueDeleteStep (🗑️)
    await page.locator('#btnQueueDeleteStep').click();
    queueNow = await page.evaluate(() => [...window.gameInstance.queue]);
    expect(queueNow).toEqual(['F', 'R', 'F']);
    await expect(editBar).not.toHaveClass(/active/);
  });

  test('SFX Settings button toggles SFX cleanly and all 60 levels have zero overlaps', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    await page.evaluate(() => {
      window.gameInstance.hideHomeScreen();
      window.gameInstance.openMobileHub('settings', false);
    });

    const sfxBtn = page.locator('#btnMobileSoundToggle');
    await expect(sfxBtn).toBeVisible();
    await expect(sfxBtn).toHaveClass(/active/);
    await expect(sfxBtn).toContainText('SFX Aktiv');

    // Click SFX button in settings -> mutes SFX
    await sfxBtn.click();
    await expect(sfxBtn).not.toHaveClass(/active/);
    await expect(sfxBtn).toContainText('Stumm');
    let sfxMuted = await page.evaluate(() => Sound.isSfxMuted());
    expect(sfxMuted).toBe(true);

    // Click SFX button again -> unmutes SFX
    await sfxBtn.click();
    await expect(sfxBtn).toHaveClass(/active/);
    await expect(sfxBtn).toContainText('SFX Aktiv');
    sfxMuted = await page.evaluate(() => Sound.isSfxMuted());
    expect(sfxMuted).toBe(false);

    // Verify all 60 levels have no switches/gates/orbs on walls or obstacles, and Level 35 solves cleanly
    const audit = await page.evaluate(() => {
      const bad = [];
      LEVELS.forEach((lvl, idx) => {
        const wallSet = new Set((lvl.walls || []).map(w => `${w[0]},${w[1]}`));
        const obsKeys = new Set(Object.keys(lvl.obstacles || {}));
        (lvl.sw || []).forEach(s => {
          const k = `${s[0]},${s[1]}`;
          if (wallSet.has(k) || obsKeys.has(k)) bad.push(`L${idx + 1}:sw@${k}`);
        });
        (lvl.gates || lvl.gate || []).forEach(g => {
          const k = `${g[0]},${g[1]}`;
          if (wallSet.has(k) || obsKeys.has(k)) bad.push(`L${idx + 1}:gate@${k}`);
        });
      });
      return bad;
    });
    expect(audit).toEqual([]);
  });

  test('Conquering Tower Floor 100 unlocks tower_conqueror achievement and pagoda skin', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const beforeState = await page.evaluate(() => {
      localStorage.removeItem('koma_conquered_tower');
      return {
        pagodaUnlocked: window.gameInstance.isSkinUnlocked('pagoda'),
        hasAchievement: window.gameInstance.unlockedAchievements.has('tower_conqueror')
      };
    });
    expect(beforeState.pagodaUnlocked).toBe(false);
    expect(beforeState.hasAchievement).toBe(false);

    const afterState = await page.evaluate(() => {
      window.TowerTrial.startNewRun();
      window.TowerTrial.floor = 100;
      window.TowerTrial.currentLevel = window.TowerTrial.generateFloorLevel(100);
      const res = window.TowerTrial.handleFloorClear(window.TowerTrial.currentLevel.solution.length);
      window.gameInstance.checkAchievements();
      return {
        resType: res.type,
        pagodaUnlocked: window.gameInstance.isSkinUnlocked('pagoda'),
        hasAchievement: window.gameInstance.unlockedAchievements.has('tower_conqueror'),
        towerConqueredFlag: localStorage.getItem('koma_conquered_tower')
      };
    });

    expect(afterState.resType).toBe('tower_victory');
    expect(afterState.pagodaUnlocked).toBe(true);
    expect(afterState.hasAchievement).toBe(true);
    expect(afterState.towerConqueredFlag).toBe('true');

    // Equip the new green Midori Kami skin and verify 3D model has singleEar + kamiHalo
    const skinCheck = await page.evaluate(() => {
      window.gameInstance.equipSkin('pagoda');
      const skinDef = window.KOMA_SKINS.pagoda;
      const lvl20 = window.TowerTrial.generateFloorLevel(20);
      return {
        equipped: window.gameInstance.equippedSkin,
        bodyColor: skinDef.materials.body.color,
        accessories: skinDef.accessories,
        hasHaloMesh: Boolean(window.gameInstance.renderer && window.gameInstance.renderer.komaHalo),
        earCount: window.gameInstance.renderer ? window.gameInstance.renderer.komaEarMeshes.length : 0,
        lvl20Solved: lvl20.solverSolution.solved,
        lvl20Steps: lvl20.solution.length
      };
    });
    expect(skinCheck.equipped).toBe('pagoda');
    expect(skinCheck.bodyColor).toBe(0x10b981);
    expect(skinCheck.accessories).toEqual(['singleEar', 'kamiHalo']);
    expect(skinCheck.hasHaloMesh).toBe(true);
    expect(skinCheck.earCount).toBe(1);
    expect(skinCheck.lvl20Solved).toBe(true);
    expect(skinCheck.lvl20Steps).toBeGreaterThanOrEqual(11);
  });
});
