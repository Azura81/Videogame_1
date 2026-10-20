import { test, expect } from '@playwright/test';

test('SoundEngine: Ice World soundtrack and dynamic track switching', async ({ page }) => {
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#webgl-container');

  // Verify initial state
  const initialTrack = await page.evaluate(() => {
    return Sound.currentTrack;
  });
  expect(initialTrack).toBe('default');

  // Load Level 51 (Mount Fuji Chapter)
  await page.evaluate(() => {
    window.gameInstance.loadLevel(50); // Level 51
  });

  const fujiTrack = await page.evaluate(() => {
    return Sound.currentTrack;
  });
  expect(fujiTrack).toBe('ice');

  // Switch back to Level 1
  await page.evaluate(() => {
    window.gameInstance.loadLevel(0); // Level 1
  });

  const shrineTrack = await page.evaluate(() => {
    return Sound.currentTrack;
  });
  expect(shrineTrack).toBe('default');

  // Switch to Ice track and verify synthesizer voices run without exceptions
  const synthResults = await page.evaluate(() => {
    Sound.init();
    Sound.setTrack('ice');
    Sound.startBgm();

    // Trigger one full sequence step through scheduleBgm
    Sound.scheduleBgm();

    // Explicitly test each Ice voice
    const t = Sound.ctx ? Sound.ctx.currentTime : 0;
    Sound.playIceFlute("F#5", t, 0.4);
    Sound.playIceBell("D6", t);
    Sound.playIcePad(["B2", "F#3", "B3", "D4"], t, 0.6);
    Sound.playFrostBass("B1", t, 0.5);
    Sound.playSnowPluck("F#4", t);
    Sound.playIceDrum("snow_thud", t);
    Sound.playIceDrum("ice_click", t);
    Sound.playIceDrum("frost_wind", t);

    Sound.stopBgm();
    return {
      track: Sound.currentTrack,
      activeNodesCount: Sound.activeBgmNodes.size,
      hasBgmGain: !!Sound.bgmGain
    };
  });

  expect(synthResults.track).toBe('ice');
  expect(synthResults.hasBgmGain).toBe(true);
});
