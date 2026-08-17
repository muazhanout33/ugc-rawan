import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mob.waitForTimeout(3000);
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1500);

  const btn = mob.locator('[data-portfolio-card]').first().locator('button[aria-label]');
  await btn.click();
  await mob.waitForTimeout(200);

  const posterCheck = await mob.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return { error: 'no dialog' };
    const video = dialog.querySelector('video');
    if (!video) return { error: 'no video' };
    const frame = dialog.querySelector('[class*="rounded-"]');
    return {
      posterAttr: video.getAttribute('poster'),
      posterProp: video.poster,
      complete: video.complete,
      readyState: video.readyState,
      paused: video.paused,
      muted: video.muted,
      videoStyle: {
        position: getComputedStyle(video).position,
        zIndex: getComputedStyle(video).zIndex,
        objectFit: getComputedStyle(video).objectFit,
        width: video.offsetWidth,
        height: video.offsetHeight,
      },
      frameZIndex: frame ? getComputedStyle(frame).zIndex : 'N/A',
      frameOverflow: frame ? getComputedStyle(frame).overflow : 'N/A',
    };
  });
  console.log('Poster check @200ms:', JSON.stringify(posterCheck, null, 2));

  // Check at 1s
  await mob.waitForTimeout(800);
  const check2 = await mob.evaluate(() => {
    const video = document.querySelector('[role="dialog"] video');
    if (!video) return { error: 'no video' };
    return {
      readyState: video.readyState,
      paused: video.paused,
      muted: video.muted,
      currentTime: video.currentTime,
      error: video.error ? video.error.message : null,
      networkState: video.networkState,
      posterDisplay: getComputedStyle(video).poster,
    };
  });
  console.log('Check @1s:', JSON.stringify(check2, null, 2));

  // Check at 5s
  await mob.waitForTimeout(4000);
  const check3 = await mob.evaluate(() => {
    const video = document.querySelector('[role="dialog"] video');
    if (!video) return { error: 'no video' };
    return {
      readyState: video.readyState,
      paused: video.paused,
      muted: video.muted,
      currentTime: video.currentTime,
      error: video.error ? video.error.message : null,
    };
  });
  console.log('Check @5s:', JSON.stringify(check3, null, 2));

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
