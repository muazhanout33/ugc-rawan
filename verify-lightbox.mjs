import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';

async function captureSequence(page, cardIndex, label, delays = [0, 50, 100, 200, 400, 800, 1500]) {
  const prefix = `verify-${label}`;
  const cards = page.locator('[data-portfolio-card]');
  const card = cards.nth(cardIndex);
  const btn = card.locator('button[aria-label]');

  if (await btn.count() === 0) {
    console.log(`  Card ${cardIndex} has no video button — skipping`);
    return;
  }

  const ariaLabel = await btn.getAttribute('aria-label');
  console.log(`  Clicking card ${cardIndex}: "${ariaLabel}"`);

  // Screenshot before
  await page.screenshot({ path: `D:/ugc/${prefix}-0-before.png` });

  await btn.click();

  let elapsed = 0;
  for (const delay of delays) {
    const wait = delay - elapsed;
    if (wait > 0) await page.waitForTimeout(wait);
    elapsed = delay;
    await page.screenshot({ path: `D:/ugc/${prefix}-${delay}ms.png` });

    const state = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { error: 'no dialog' };
      const video = dialog.querySelector('video');
      const spinner = dialog.querySelector('[class*="animate-spin"]');
      return {
        videoPaused: video?.paused,
        videoReady: video?.readyState,
        videoWidth: video?.offsetWidth,
        videoHeight: video?.offsetHeight,
        spinnerPresent: !!spinner,
        dialogVisible: getComputedStyle(dialog).display !== 'none',
      };
    });
    console.log(`  @${delay}ms:`, JSON.stringify(state));
  }

  // Wait for settled state
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `D:/ugc/${prefix}-settled.png` });
  const settled = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return { error: 'no dialog' };
    const video = dialog.querySelector('video');
    return {
      videoPaused: video?.paused,
      videoReady: video?.readyState,
      videoCurrentTime: video?.currentTime,
      videoError: video?.error?.message || null,
    };
  });
  console.log(`  Settled (4.5s):`, JSON.stringify(settled));

  // Close
  const closeBtn = page.locator('button[aria-label="Close video"]');
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(500);
  }
}

async function main() {
  const browser = await chromium.launch();

  // ===================== MOBILE TESTS =====================
  console.log('\n=== MOBILE (390x844) — FAST NETWORK ===');
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobErrors = [];
  mob.on('pageerror', e => mobErrors.push('PAGE_ERROR: ' + e.message));

  await mob.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mob.waitForTimeout(3000);
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1500);

  // Card 0: Aroma Center (video)
  console.log('\n--- Card 0 (Aroma Center) — Fast ---');
  await captureSequence(mob, 0, 'mob-fast-card0');

  // Card 1: Royal Palace Center (video)
  console.log('\n--- Card 1 (Royal Palace) — Fast ---');
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1000);
  await captureSequence(mob, 1, 'mob-fast-card1');

  // Card 2: ScalaryX (video)
  console.log('\n--- Card 2 (ScalaryX) — Fast ---');
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1000);
  await captureSequence(mob, 2, 'mob-fast-card2');

  console.log('Mobile errors:', mobErrors.length ? mobErrors : 'NONE');
  await mob.close();

  // ===================== MOBILE THROTTLED =====================
  console.log('\n=== MOBILE (390x844) — SLOW 3G THROTTLED ===');
  const ctx2 = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobSlow = await ctx2.newPage();
  const mobSlowErrors = [];
  mobSlow.on('pageerror', e => mobSlowErrors.push('PAGE_ERROR: ' + e.message));
  await mobSlow.route('**/*', async route => {
    await new Promise(r => setTimeout(r, 300));
    await route.continue();
  });

  await mobSlow.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobSlow.waitForTimeout(3000);
  await mobSlow.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mobSlow.waitForTimeout(1500);

  console.log('\n--- Card 0 (Aroma Center) — Slow ---');
  await captureSequence(mobSlow, 0, 'mob-slow-card0', [0, 100, 300, 600, 1200, 2500, 5000]);

  console.log('Mobile slow errors:', mobSlowErrors.length ? mobSlowErrors : 'NONE');
  await mobSlow.close();

  // ===================== DESKTOP TESTS =====================
  console.log('\n=== DESKTOP (1280x900) — FAST NETWORK ===');
  const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const deskErrors = [];
  desk.on('pageerror', e => deskErrors.push('PAGE_ERROR: ' + e.message));

  await desk.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await desk.waitForTimeout(3000);
  await desk.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await desk.waitForTimeout(1500);

  // Card 0
  console.log('\n--- Card 0 (Aroma Center) — Desktop Fast ---');
  await captureSequence(desk, 0, 'desk-fast-card0');

  // Card 1
  console.log('\n--- Card 1 (Royal Palace) — Desktop Fast ---');
  await desk.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await desk.waitForTimeout(1000);
  await captureSequence(desk, 1, 'desk-fast-card1');

  console.log('Desktop errors:', deskErrors.length ? deskErrors : 'NONE');
  await desk.close();

  await browser.close();
  console.log('\n=== ALL TESTS COMPLETE ===');
}

main().catch(e => { console.error(e); process.exit(1); });
