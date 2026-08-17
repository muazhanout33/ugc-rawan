#!/usr/bin/env node
import { chromium } from 'playwright';

const VIEWPORTS = [
  { w: 1280, h: 900, label: 'Desktop 1280' },
  { w: 1536, h: 900, label: 'Desktop 1536' },
];

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log(`\n=== ${vp.label} (${vp.w}x${vp.h}) ===`);

  // 1. Check page loads, no horizontal overflow
  const overflow = await page.evaluate(() => {
    return {
      bodyScrollW: document.body.scrollWidth,
      vpW: window.innerWidth,
      hasHOverflow: document.body.scrollWidth > window.innerWidth + 5,
    };
  });
  console.log(`Page overflow: ${JSON.stringify(overflow)}`);

  // 2. Scroll to portfolio
  await page.evaluate(() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(500);

  // 3. Check portfolio grid layout
  const gridInfo = await page.evaluate(() => {
    const section = document.querySelector('#portfolio');
    const cards = section?.querySelectorAll('[data-portfolio-card]');
    if (!cards?.length) return { error: 'no cards' };
    const rects = Array.from(cards).map(c => {
      const r = c.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
    const rows = {};
    rects.forEach(r => { const row = Math.round(r.y / 100); rows[row] = (rows[row] || 0) + 1; });
    return { numCards: cards.length, rows, firstCard: rects[0], sectionH: Math.round(section.getBoundingClientRect().height) };
  });
  console.log(`Portfolio grid: ${JSON.stringify(gridInfo)}`);

  // 4. Open lightbox for 3 different videos
  const cardBtns = await page.locator('button[aria-label^="Open"]').all();
  console.log(`Found ${cardBtns.length} card buttons`);

  for (let ci = 0; ci < Math.min(cardBtns.length, 3); ci++) {
    const label = await cardBtns[ci].getAttribute('aria-label');
    console.log(`\n--- Lightbox: ${label} ---`);
    await cardBtns[ci].click({ force: true });
    await page.waitForTimeout(600);

    const lbState = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { error: 'no dialog' };
      const dialogRect = dialog.getBoundingClientRect();
      const frame = dialog.querySelector('[class*="aspect-"]');
      const frameRect = frame?.getBoundingClientRect();
      const video = dialog.querySelector('video');
      const paused = video?.paused;
      const playBtn = dialog.querySelector('button[aria-label="Play"]');
      const playVis = playBtn ? (playBtn.getBoundingClientRect().width > 0) : false;
      const closeBtn = dialog.querySelector('button[aria-label="Close video"]');
      const closeRect = closeBtn?.getBoundingClientRect();
      const infoPanel = dialog.querySelector('.shrink-0.text-left');
      const infoRect = infoPanel?.getBoundingClientRect();

      return {
        dialogSize: `${Math.round(dialogRect.width)}x${Math.round(dialogRect.height)}`,
        frameSize: frameRect ? `${Math.round(frameRect.width)}x${Math.round(frameRect.height)}` : null,
        frameInVP: frameRect ? (frameRect.top >= 0 && frameRect.bottom <= window.innerHeight) : false,
        paused,
        playBtnVisible: playVis,
        closeInVP: closeRect ? (closeRect.top >= 0 && closeRect.top < window.innerHeight) : false,
        infoPanelVisible: infoRect ? (infoRect.top < window.innerHeight) : false,
        bodyOverflow: document.body.style.overflow,
      };
    });
    console.log(JSON.stringify(lbState));

    // Close
    const closeBtn = page.locator('button[aria-label="Close video"]');
    await closeBtn.click({ force: true });
    await page.waitForTimeout(400);

    // Verify close worked
    const closed = await page.evaluate(() => ({
      dialogGone: !document.querySelector('[role="dialog"]'),
      bodyOverflow: document.body.style.overflow,
    }));
    console.log(`After close: ${JSON.stringify(closed)}`);
  }

  // 5. Check horizontal overflow after all interactions
  const finalOverflow = await page.evaluate(() => ({
    bodyScrollW: document.body.scrollWidth,
    vpW: window.innerWidth,
    hasHOverflow: document.body.scrollWidth > window.innerWidth + 5,
  }));
  console.log(`\nFinal overflow: ${JSON.stringify(finalOverflow)}`);

  if (errors.length) console.log(`Errors: ${JSON.stringify(errors.slice(0, 5))}`);
  else console.log('Errors: NONE');

  await ctx.close();
}

await browser.close();
console.log('\n=== DESKTOP VERIFICATION COMPLETE ===');
