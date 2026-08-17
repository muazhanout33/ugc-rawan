import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';

async function captureSequence(page, cardIndex, label, delays = [0, 50, 100, 200, 400, 800, 1500]) {
  const prefix = `v2-${label}`;
  const cards = page.locator('[data-portfolio-card]');
  const card = cards.nth(cardIndex);
  const btn = card.locator('button[aria-label]');

  if (await btn.count() === 0) {
    console.log(`  Card ${cardIndex}: no video button — skip`);
    return false;
  }

  const ariaLabel = await btn.getAttribute('aria-label');
  console.log(`  Clicking card ${cardIndex}: "${ariaLabel}"`);

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
        ready: video?.readyState,
        w: video?.offsetWidth,
        h: video?.offsetHeight,
        spinner: !!spinner,
      };
    });
    console.log(`  @${delay}ms:`, JSON.stringify(state));
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: `D:/ugc/${prefix}-settled.png` });
  const settled = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return null;
    const v = d.querySelector('video');
    return { paused: v?.paused, ready: v?.readyState, time: v?.currentTime, err: v?.error?.message || null };
  });
  console.log(`  Settled:`, JSON.stringify(settled));

  const closeBtn = page.locator('button[aria-label="Close video"]');
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(500);
  }
  return true;
}

async function main() {
  const browser = await chromium.launch();

  // ===== MOBILE FAST =====
  console.log('\n=== MOBILE 390px — FAST ===');
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobErr = [];
  mob.on('pageerror', e => mobErr.push(e.message));
  await mob.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mob.waitForTimeout(3000);
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1500);

  for (const i of [0, 1, 2]) {
    console.log(`\n--- Card ${i} ---`);
    await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
    await mob.waitForTimeout(800);
    await captureSequence(mob, i, `mob-c${i}`);
  }
  console.log('Mobile errors:', mobErr.length ? mobErr : 'NONE');
  await mob.close();

  // ===== MOBILE THROTTLED =====
  console.log('\n=== MOBILE 390px — THROTTLED (300ms delay) ===');
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobSlow = await ctx2.newPage();
  const slowErr = [];
  mobSlow.on('pageerror', e => slowErr.push(e.message));
  await mobSlow.route('**/*', async route => {
    await new Promise(r => setTimeout(r, 300));
    await route.continue();
  });
  await mobSlow.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobSlow.waitForTimeout(3000);
  await mobSlow.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mobSlow.waitForTimeout(1500);

  console.log('\n--- Card 0 (throttled) ---');
  await captureSequence(mobSlow, 0, 'mob-slow-c0', [0, 100, 300, 600, 1200, 2500, 5000]);
  console.log('\n--- Card 1 (throttled) ---');
  await mobSlow.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mobSlow.waitForTimeout(800);
  await captureSequence(mobSlow, 1, 'mob-slow-c1', [0, 100, 300, 600, 1200, 2500, 5000]);
  console.log('Mobile slow errors:', slowErr.length ? slowErr : 'NONE');
  await mobSlow.close();

  // ===== DESKTOP FAST =====
  console.log('\n=== DESKTOP 1280px — FAST ===');
  const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const deskErr = [];
  desk.on('pageerror', e => deskErr.push(e.message));
  await desk.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await desk.waitForTimeout(3000);
  await desk.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await desk.waitForTimeout(1500);

  for (const i of [0, 1]) {
    console.log(`\n--- Card ${i} ---`);
    await desk.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
    await desk.waitForTimeout(800);
    await captureSequence(desk, i, `desk-c${i}`);
  }
  console.log('Desktop errors:', deskErr.length ? deskErr : 'NONE');
  await desk.close();

  await browser.close();
  console.log('\n=== ALL DONE ===');
}

main().catch(e => { console.error(e); process.exit(1); });
