#!/usr/bin/env node
import { chromium } from 'playwright';

const URL = 'http://localhost:3001/#portfolio';
const VIEWPORTS = [
  { w: 390, h: 844, label: 'iPhone 14 Pro' },
  { w: 375, h: 812, label: 'iPhone SE / small' },
  { w: 360, h: 800, label: 'Galaxy S9' },
];

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll to portfolio section
  await page.evaluate(() => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  const cardButtons = await page.locator('button[aria-label^="Open"]').all();
  console.log(`\n=== ${vp.label} (${vp.w}x${vp.h}) — found ${cardButtons.length} card buttons ===`);

  for (let ci = 0; ci < Math.min(cardButtons.length, 3); ci++) {
    const label = await cardButtons[ci].getAttribute('aria-label');
    console.log(`\n--- card${ci} "${label}" ---`);

    await cardButtons[ci].click({ force: true });
    await page.waitForTimeout(600);

    const layout = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { error: 'no dialog' };

      const vpW = window.innerWidth;
      const vpH = window.innerHeight;

      const dialogRect = dialog.getBoundingClientRect();
      const content = dialog.querySelector('.relative.z-10');
      const contentRect = content?.getBoundingClientRect();

      // Video frame
      const frameEl = content?.querySelector('[class*="aspect-"]');
      const frameRect = frameEl?.getBoundingClientRect();
      const frameStyle = frameEl ? window.getComputedStyle(frameEl) : null;

      // Video element
      const video = dialog.querySelector('video');
      const videoRect = video?.getBoundingClientRect();

      // Info panel
      const panels = content?.querySelectorAll(':scope > div:not([class*="aspect-"])');
      const lastPanel = panels?.[panels.length - 1];
      const infoRect = lastPanel?.getBoundingClientRect();

      // Close button
      const closeBtn = dialog.querySelector('button[aria-label="Close video"]');
      const closeRect = closeBtn?.getBoundingClientRect();

      // Play button (center overlay)
      const playBtn = dialog.querySelector('button[aria-label="Play"]');
      const playRect = playBtn?.getBoundingClientRect();

      // Check body overflow
      const bodyOverflow = document.body.style.overflow;

      // Check dialog scrollable
      const scrollable = dialog.scrollHeight > dialog.clientHeight + 5;

      // Check gaps between video bottom and info panel top
      const gap = frameRect && infoRect ? Math.round(infoRect.top - frameRect.bottom) : null;

      // Check if video extends beyond viewport
      const videoOverflows = frameRect ? frameRect.bottom > vpH || frameRect.top < 0 : false;

      // Check if content fits without scroll
      const contentOverflow = content ? content.scrollHeight > vpH : false;

      return {
        viewport: `${vpW}x${vpH}`,
        dialog: {
          size: `${Math.round(dialogRect.width)}x${Math.round(dialogRect.height)}`,
          position: `x=${Math.round(dialogRect.x)} y=${Math.round(dialogRect.y)}`,
          overflow: dialog.style.overflow,
          scrollable,
          scrollH: dialog.scrollHeight,
          clientH: dialog.clientHeight,
        },
        frame: frameRect ? {
          size: `${Math.round(frameRect.width)}x${Math.round(frameRect.height)}`,
          position: `x=${Math.round(frameRect.x)} y=${Math.round(frameRect.y)}`,
          bottom: Math.round(frameRect.bottom),
          overflowsViewport: videoOverflows,
          aspectRatio: frameStyle?.aspectRatio,
        } : null,
        video: videoRect ? {
          size: `${Math.round(videoRect.width)}x${Math.round(videoRect.height)}`,
          position: `x=${Math.round(videoRect.x)} y=${Math.round(videoRect.y)}`,
        } : null,
        gapFrameToInfo: gap,
        infoPanel: infoRect ? {
          size: `${Math.round(infoRect.width)}x${Math.round(infoRect.height)}`,
          position: `x=${Math.round(infoRect.x)} y=${Math.round(infoRect.y)}`,
          bottom: Math.round(infoRect.bottom),
          visible: infoRect.bottom <= vpH && infoRect.top >= 0,
          fitsInViewport: infoRect.bottom <= vpH,
        } : null,
        closeBtn: closeRect ? {
          position: `x=${Math.round(closeRect.x)} y=${Math.round(closeRect.y)}`,
          size: `${Math.round(closeRect.width)}x${Math.round(closeRect.height)}`,
          inViewport: closeRect.top >= 0 && closeRect.top < vpH,
        } : null,
        playBtn: playRect ? {
          position: `x=${Math.round(playRect.x)} y=${Math.round(playRect.y)}`,
          size: `${Math.round(playRect.width)}x${Math.round(playRect.height)}`,
          inViewport: playRect.top >= 0 && playRect.top < vpH,
        } : null,
        bodyOverflow,
        contentFitsWithoutScroll: !contentOverflow,
      };
    });

    console.log(JSON.stringify(layout, null, 2));
    await page.screenshot({ path: `mobile-layout-${vp.w}x${ci}.png`, fullPage: false });

    // Close
    const closeBtn = page.locator('button[aria-label="Close video"]');
    if (await closeBtn.count() > 0) {
      await closeBtn.click({ force: true });
      await page.waitForTimeout(400);
    }
  }

  if (consoleErrors.length) {
    console.log(`\nConsole errors: ${JSON.stringify(consoleErrors.slice(0, 5))}`);
  }
  await ctx.close();
}

await browser.close();
console.log('\n=== MOBILE LAYOUT DIAG COMPLETE ===');
