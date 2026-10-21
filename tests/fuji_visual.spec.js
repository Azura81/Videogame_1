import { test, expect } from '@playwright/test';

test('Verify Mount Fuji visibility, winter aesthetics, and chapter navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  // Verify that the old header Fuji button is completely removed
  await expect(page.locator('#btnHeaderFuji')).toHaveCount(0);

  // Open Home Screen and verify Mount Fuji mode card exists
  await page.evaluate(() => {
    if (window.gameInstance) window.gameInstance.showHomeScreen();
  });
  const homeFujiBtn = page.locator('#btnHomeModeFuji');
  await expect(homeFujiBtn).toBeVisible();

  // Click Mount Fuji mode card on Home Screen to jump directly to Level 51
  await homeFujiBtn.click();
  await page.waitForTimeout(1000);

  // Verify level title and chapter
  await expect(page.locator('#levelTitle')).toHaveText('Der erste Bergwind');
  await expect(page.locator('#chapterTitle')).toContainText('Berg Fuji');

  // Verify Mount Fuji mesh in 3D scene is visible and positioned
  const fujiVisible = await page.evaluate(() => {
    const fuji = window.gameInstance?.renderer?.fujiGroup;
    const snow = window.gameInstance?.renderer?.snowParticles;
    const water = window.gameInstance?.renderer?.waterMesh;
    return {
      fujiVisible: fuji ? fuji.visible : false,
      fujiX: fuji ? fuji.position.x : null,
      fujiY: fuji ? fuji.position.y : null,
      fujiZ: fuji ? fuji.position.z : null,
      snowVisible: snow ? snow.visible : false,
      waterColor: water ? water.material.color.getHexString() : null
    };
  });

  console.log('Fuji Winter 3D Status:', JSON.stringify(fujiVisible));
  expect(fujiVisible.fujiVisible).toBe(false); // Mountain mesh removed per user request
  expect(fujiVisible.snowVisible).toBe(true);  // Snow particles active
  expect(fujiVisible.waterColor).toBe('1a3854'); // Frozen alpine ice pond

  // Capture screenshot of Mount Fuji scene
  await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/fuji_level51_scene.png' });

  // Open Level Drawer and verify chapter filtering
  await page.locator('#btnLevelSelect').click();
  await expect(page.locator('#levelDrawer')).toHaveClass(/open/);

  // Check chapter tabs in drawer
  const drawerTabs = page.locator('#drawerChapterTabs .drawer-tab');
  await expect(drawerTabs).toHaveCount(7);

  // Click Kap. 6 tab in drawer
  await page.locator('#drawerChapterTabs [data-chapter="6"]').click();
  await page.waitForTimeout(300);

  // Verify that only Level 51-60 are displayed in drawer
  const drawerButtons = page.locator('#levelList .level-pill-btn');
  const count = await drawerButtons.count();
  expect(count).toBe(10);
  await expect(drawerButtons.first()).toContainText('51');
  await expect(drawerButtons.first()).toContainText('Der erste Bergwind');

  // Capture screenshot of drawer with Kap. 6 filtered
  await page.screenshot({ path: '/Users/maxrietsch/.gemini/antigravity-ide/brain/ae562408-a431-4271-84da-8958f4628572/fuji_drawer_filtered.png' });
});
