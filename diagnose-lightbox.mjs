import { chromium } from 'playwright';
const BASE = 'http://localhost:3001';

async function main() {
  const browser = await chromium.launch();

  // === MOBILE TEST ===
  console.log('\n=== MOBILE (390px) ===');
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobErrors = [];
  const mobLogs = [];
  mob.on('pageerror', e => mobErrors.push('PAGE_ERROR: ' + e.message));
  mob.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning')
      mobLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  await mob.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mob.waitForTimeout(3000);

  // Scroll to portfolio
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1500);

  // Check which cards have video
  const cardInfo = await mob.evaluate(() => {
    return [...document.querySelectorAll('[data-portfolio-card]')].map(c => {
      const title = c.querySelector('p')?.textContent;
      const btn = c.querySelector('button[aria-label]');
      return { title, hasButton: !!btn, ariaLabel: btn?.getAttribute('aria-label') };
    });
  });
  console.log('Cards found:', JSON.stringify(cardInfo));

  // Find and click the first video card (Aroma Center — has a video)
  const firstCard = mob.locator('[data-portfolio-card]').first();
  const cardBtn = firstCard.locator('button[aria-label]');
  const hasVideo = await cardBtn.count();
  console.log('First card has video button:', hasVideo > 0);

  if (hasVideo > 0) {
    // Screenshot BEFORE click
    await mob.screenshot({ path: 'D:/ugc/lightbox-mobile-0-before.png' });
    console.log('Screenshot: before-click');

    // Click the card
    const startTime = Date.now();
    await cardBtn.click();
    console.log('Clicked at t=0');

    // Screenshot at ~50ms
    await mob.waitForTimeout(50);
    await mob.screenshot({ path: 'D:/ugc/lightbox-mobile-1-50ms.png' });
    console.log('Screenshot: t=50ms');

    // Screenshot at ~200ms
    await mob.waitForTimeout(150);
    await mob.screenshot({ path: 'D:/ugc/lightbox-mobile-2-200ms.png' });
    console.log('Screenshot: t=200ms');

    // Screenshot at ~500ms
    await mob.waitForTimeout(300);
    await mob.screenshot({ path: 'D:/ugc/lightbox-mobile-3-500ms.png' });
    console.log('Screenshot: t=500ms');

    // Screenshot at ~1.5s (settled)
    await mob.waitForTimeout(1000);
    await mob.screenshot({ path: 'D:/ugc/lightbox-mobile-4-settled.png' });
    console.log('Screenshot: t=1.5s');

    // Inspect DOM state
    const domState = await mob.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { error: 'No dialog found' };

      const video = dialog.querySelector('video');
      const spinner = dialog.querySelector('[class*="animate-spin"]');
      const playBtn = dialog.querySelector('button[aria-label="Play"]');
      const closeBtn = dialog.querySelector('button[aria-label="Close video"]');
      const poster = dialog.querySelector('[class*="portfolio-frame"]');

      return {
        dialogPresent: true,
        dialogZIndex: getComputedStyle(dialog).zIndex,
        dialogBg: getComputedStyle(dialog).backgroundColor,
        videoPresent: !!video,
        videoSrc: video?.src || 'none',
        videoWidth: video?.offsetWidth,
        videoHeight: video?.offsetHeight,
        videoPaused: video?.paused,
        videoMuted: video?.muted,
        videoReadyState: video?.readyState,
        videoError: video?.error?.message || null,
        videoNetworkState: video?.networkState,
        posterPresent: !!poster,
        spinnerPresent: !!spinner,
        playBtnPresent: !!playBtn,
        closeBtnPresent: !!closeBtn,
        bodyOverflow: document.body.style.overflow,
      };
    });
    console.log('DOM state @1.5s:', JSON.stringify(domState, null, 2));

    // Wait more and check again
    await mob.waitForTimeout(3000);
    const domState2 = await mob.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { error: 'No dialog found' };
      const video = dialog.querySelector('video');
      return {
        videoPaused: video?.paused,
        videoMuted: video?.muted,
        videoReadyState: video?.readyState,
        videoCurrentTime: video?.currentTime,
        videoError: video?.error?.message || null,
        videoNetworkState: video?.networkState,
      };
    });
    console.log('DOM state @4.5s:', JSON.stringify(domState2, null, 2));
    await mob.screenshot({ path: 'D:/ugc/lightbox-mobile-5-4.5s.png' });
  }

  console.log('Mobile errors:', mobErrors.length ? mobErrors : 'NONE');
  console.log('Mobile warnings:', mobLogs.length ? mobLogs : 'NONE');

  // === DESKTOP TEST ===
  console.log('\n=== DESKTOP (1280px) ===');
  const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const deskErrors = [];
  desk.on('pageerror', e => deskErrors.push('PAGE_ERROR: ' + e.message));

  await desk.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await desk.waitForTimeout(3000);
  await desk.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await desk.waitForTimeout(1500);

  const deskCard = desk.locator('[data-portfolio-card]').first();
  const deskBtn = deskCard.locator('button[aria-label]');
  if (await deskBtn.count() > 0) {
    await desk.screenshot({ path: 'D:/ugc/lightbox-desktop-0-before.png' });
    await deskBtn.click();
    await desk.waitForTimeout(50);
    await desk.screenshot({ path: 'D:/ugc/lightbox-desktop-1-50ms.png' });
    await desk.waitForTimeout(200);
    await desk.screenshot({ path: 'D:/ugc/lightbox-desktop-2-200ms.png' });
    await desk.waitForTimeout(300);
    await desk.screenshot({ path: 'D:/ugc/lightbox-desktop-3-500ms.png' });
    await desk.waitForTimeout(3000);
    await desk.screenshot({ path: 'D:/ugc/lightbox-desktop-4-settled.png' });

    const deskDom = await desk.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { error: 'No dialog' };
      const video = dialog.querySelector('video');
      return {
        videoPresent: !!video,
        videoPaused: video?.paused,
        videoMuted: video?.muted,
        videoReadyState: video?.readyState,
        videoError: video?.error?.message || null,
      };
    });
    console.log('Desktop DOM @3.5s:', JSON.stringify(deskDom, null, 2));
  }
  console.log('Desktop errors:', deskErrors.length ? deskErrors : 'NONE');

  await browser.close();
  console.log('\nDONE');
}

main().catch(e => { console.error(e); process.exit(1); });
