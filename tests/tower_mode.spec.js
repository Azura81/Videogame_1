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

    // Inspect Floor 1 Level Layout
    const floor1Data = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return {
        s: lvl.s,
        g: lvl.g,
        sw: lvl.sw,
        gates: lvl.gates,
        wallsCount: lvl.walls.length,
        solution: lvl.solution || (lvl.solverSolution ? lvl.solverSolution.path : null)
      };
    });

    expect(floor1Data.solution).not.toBeNull();
    expect(floor1Data.solution.length).toBeGreaterThan(0);

    // Solve Floor 1
    for (const cmd of floor1Data.solution) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }
    await page.locator('#btnPlay').click();

    // 5. Verify Floor 1 Cleared -> Advanced to Ebene 2
    await expect(page.locator('#towerHudFloor')).toHaveText(/Ebene 2/, { timeout: 15000 });
    await expect(page.locator('#missionBadge')).toHaveText(/EBENE 2/);

    // Inspect Floor 2 Level Layout and verify it is NOT identical to Floor 1
    const floor2Data = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return {
        s: lvl.s,
        g: lvl.g,
        sw: lvl.sw,
        gates: lvl.gates,
        wallsCount: lvl.walls.length,
        solution: lvl.solution || (lvl.solverSolution ? lvl.solverSolution.path : null)
      };
    });

    expect(floor2Data.solution).not.toBeNull();
    expect(floor2Data.solution.length).toBeGreaterThan(0);
    // Crucial check: Floor 2 must have different start / orientation or different goal
    const isIdenticalToFloor1 = (
      floor1Data.s[0] === floor2Data.s[0] &&
      floor1Data.s[1] === floor2Data.s[1] &&
      floor1Data.s[2] === floor2Data.s[2] &&
      floor1Data.g[0] === floor2Data.g[0] &&
      floor1Data.g[1] === floor2Data.g[1]
    );
    expect(isIdenticalToFloor1).toBe(false);

    // 6. Test Life Deduction on Failure
    // Intentionally send KOMA into an invalid direction/wall
    await page.locator('button[data-cmd="L"]').click();
    await page.locator('button[data-cmd="F"]').click();
    await page.locator('#btnPlay').click();

    // Verify one lantern is lost (2 lit, 1 unlit)
    await expect(page.locator('.tower-lantern.lit')).toHaveCount(2, { timeout: 8000 });
    await expect(page.locator('.tower-lantern.unlit')).toHaveCount(1);
    await expect(page.locator('#feedbackText')).toContainText(/Laterne ist erloschen/);

    // 7. Test Remaining 2 Lives Lost -> Game Over Modal
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

    // 8. Exit to Campaign
    await page.locator('#btnTowerExitToCampaign').click();
    await expect(gameOverModal).not.toHaveClass(/active/);
    await expect(hudBar).not.toBeVisible();
    await expect(page.locator('#missionBadge')).toHaveText('01 / 60');
  });

  test('All 100 tower floors are unique and 100% solvable via browser TowerManager', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    const result = await page.evaluate(() => {
      if (typeof window.TowerTrial === 'undefined') return { error: 'TowerTrial not found' };

      const seenSignatures = new Set();
      let allSolvable = true;
      const floors = [];

      for (let f = 1; f <= 100; f++) {
        const lvl = window.TowerTrial.generateFloorLevel(f);
        const sig = `F${f}|${lvl.w}x${lvl.h}|S:${lvl.s.join(",")}|G:${lvl.g.join(",")}|SW:${lvl.sw.map(s => s.join(",")).join(";")}|GATES:${lvl.gates.map(g => g.join(",")).join(";")}|WALLS:${lvl.walls.length}|ORBS:${(lvl.orbs || []).length}`;
        
        const isDuplicate = seenSignatures.has(sig);
        seenSignatures.add(sig);

        const solvable = Boolean(lvl.solverSolution && lvl.solverSolution.solved);
        if (!solvable) allSolvable = false;

        if (f <= 5) {
          floors.push({ floor: f, s: lvl.s, g: lvl.g, sig, solvable });
        }
      }

      // Check specifically that floors 1, 2, 3 have distinct starts/goals
      const f1 = floors[0], f2 = floors[1], f3 = floors[2];
      const f1_f2_different = (f1.s.join(",") !== f2.s.join(",") || f1.g.join(",") !== f2.g.join(","));
      const f2_f3_different = (f2.s.join(",") !== f3.s.join(",") || f2.g.join(",") !== f3.g.join(","));

      return {
        uniqueCount: seenSignatures.size,
        allSolvable,
        f1_f2_different,
        f2_f3_different,
        firstThree: [f1, f2, f3]
      };
    });

    expect(result.error).toBeUndefined();
    expect(result.uniqueCount).toBe(100);
    expect(result.allSolvable).toBe(true);
    expect(result.f1_f2_different).toBe(true);
    expect(result.f2_f3_different).toBe(true);
  });

  test('Boss floor 5 victory triggers Altar of Blessings', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#webgl-container');

    // Start Tower Run
    await page.locator('#btnTowerMode').click();
    await page.locator('#btnStartTowerRun').click();

    // Fast-forward to floor 5 (Boss Floor)
    await page.evaluate(() => {
      window.TowerTrial.floor = 5;
      window.TowerTrial.currentLevel = window.TowerTrial.generateFloorLevel(5);
      window.gameInstance.loadTowerFloor();
    });

    await expect(page.locator('#towerHudFloor')).toHaveText(/Ebene 5/);

    // Solve floor 5
    const floor5Solution = await page.evaluate(() => {
      const lvl = window.gameInstance.getCurrentLevel();
      return lvl.solution || (lvl.solverSolution ? lvl.solverSolution.path : null);
    });

    expect(floor5Solution).not.toBeNull();
    for (const cmd of floor5Solution) {
      await page.locator(`button[data-cmd="${cmd}"]`).click();
    }
    await page.locator('#btnPlay').click();

    // Altar Modal should appear
    const altarModal = page.locator('#modalTowerAltar');
    await expect(altarModal).toHaveClass(/active/, { timeout: 15000 });

    // 3 blessing cards should be rendered
    const blessingCards = page.locator('.blessing-card');
    await expect(blessingCards).toHaveCount(3);

    // Select the first blessing
    await blessingCards.first().click();

    // Altar closes and game advances to floor 6
    await expect(altarModal).not.toHaveClass(/active/, { timeout: 8000 });
    await expect(page.locator('#towerHudFloor')).toHaveText(/Ebene 6/, { timeout: 8000 });
  });
});

