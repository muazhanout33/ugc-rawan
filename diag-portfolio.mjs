#!/usr/bin/env node
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

// Mobile portfolio screenshots
for (const vp of [{ w: 390, h: 844, l: 'mob390' }, { w: 1280, h: 900, l: 'desk1280' }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3001/#portfolio', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Full section screenshot
  const section = page.locator('#portfolio');
  if (await section.count() > 0) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await section.screenshot({ path: `portfolio-section-${vp.l}.png` });
  }

  // Also full page screenshot
  await page.screenshot({ path: `portfolio-full-${vp.l}.png`, fullPage: false });

  // Check layout metrics
  const metrics = await page.evaluate(() => {
    const section = document.querySelector('#portfolio');
    if (!section) return { error: 'no section' };
    const sectionRect = section.getBoundingClientRect();

    // Check grid container
    const grid = section.querySelector('.grid');
    const gridRect = grid?.getBoundingClientRect();
    const gridStyle = grid ? window.getComputedStyle(grid) : null;

    // Check all cards
    const cards = section.querySelectorAll('[data-portfolio-card]');
    const cardData = Array.from(cards).map((card, i) => {
      const rect = card.getBoundingClientRect();
      return {
        i,
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        row: Math.round(rect.y / 100),
      };
    });

    // Check filter pills
    const filterBtns = section.querySelectorAll('button');
    const filters = Array.from(filterBtns).map(b => b.textContent?.trim()).filter(Boolean);

    return {
      section: { w: Math.round(sectionRect.width), h: Math.round(sectionRect.height) },
      grid: grid ? {
        display: gridStyle?.display,
        gridTemplateColumns: gridStyle?.gridTemplateColumns,
        gap: gridStyle?.gap,
        h: Math.round(gridRect.height),
      } : null,
      cards: cardData,
      numCards: cards.length,
      filters,
    };
  });
  console.log(`\n=== ${vp.l} (${vp.w}x${vp.h}) ===`);
  console.log(JSON.stringify(metrics, null, 2));

  await ctx.close();
}

await browser.close();
console.log('\n=== DONE ===');
