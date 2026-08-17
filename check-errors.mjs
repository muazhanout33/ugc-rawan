import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';

async function checkErrors(page, label, cardIndex) {
  const errors = [];
  page.on('pageerror', e => errors.push('PAGE_ERROR: ' + e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE_ERROR: ' + msg.text());
  });
  page.on('requestfailed', r => {
    if (!r.url().includes('mp4')) errors.push('REQUEST_FAILED: ' + r.url().split('?')[0].slice(-50));
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await page.waitForTimeout(1500);

  const cards = page.locator('[data-portfolio-card]');
  const btn = cards.nth(cardIndex).locator('button[aria-label]');
  if (await btn.count() === 0) { console.log(`${label}: no video button`); return; }
  await btn.click();
  await page.waitForTimeout(4000);

  const state = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const v = d?.querySelector('video');
    return {
      videoPlaying: v ? !v.paused : false,
      videoErr: v?.error?.message || null,
      dialogBg: d ? getComputedStyle(d).backgroundColor : null,
      frameOpacity: d?.querySelector('video')?.offsetWidth ? 'visible' : 'hidden',
    };
  });

  // Close
  const close = page.locator('button[aria-label="Close video"]');
  if (await close.count() > 0) { await close.click(); await page.waitForTimeout(500); }

  console.log(`${label}: playing=${state.videoPlaying} err=${state.videoErr} bg=${state.dialogBg}`);
  console.log(`${label} console/page errors: ${errors.length ? errors.join(' | ') : 'NONE'}`);
}

async function main() {
  const browser = await chromium.launch();
  await checkErrors(await browser.newPage({ viewport: { width: 390, height: 844 } }), 'MOBILE-card0', 0);
  await checkErrors(await browser.newPage({ viewport: { width: 390, height: 844 } }), 'MOBILE-card2', 2);
  await checkErrors(await browser.newPage({ viewport: { width: 1280, height: 900 } }), 'DESKTOP-card1', 1);
  await browser.close();
  console.log('\nDONE');
}

main().catch(e => { console.error(e); process.exit(1); });