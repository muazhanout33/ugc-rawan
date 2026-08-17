#!/usr/bin/env node
/**
 * Scalability Test: Simulate 15 total videos (current 5 + 10 added)
 * by cloning portfolio cards into the DOM, then measure performance.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const VIEWPORTS = [
  { w: 390, h: 844, label: 'Mobile 390' },
  { w: 1280, h: 900, label: 'Desktop 1280' },
];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${vp.label} — SCALABILITY TEST (15 video cards)`);
  console.log(`${'='.repeat(60)}`);

  // ── Baseline: current 5 cards ──
  const baseline = await page.evaluate(async () => {
    const cards = document.querySelectorAll('[data-portfolio-card]');
    const vids = document.querySelectorAll('video');
    const dom = document.querySelectorAll('*').length;
    return { cards: cards.length, videos: vids.length, dom };
  });
  console.log(`\nBaseline: ${baseline.cards} cards, ${baseline.videos} videos, ${baseline.dom} DOM nodes`);

  // ── Clone cards to simulate 15 total ──
  await page.evaluate(() => {
    const grid = document.querySelector('#portfolio .flex.gap-4, #portfolio .grid');
    if (!grid) return;
    const existingCards = grid.querySelectorAll('[data-portfolio-card]');
    // Clone the first 5 cards 2 more times to get 15 total
    for (let round = 0; round < 2; round++) {
      existingCards.forEach(card => {
        const clone = card.cloneNode(true);
        // Give unique keys to avoid React issues — just for DOM measurement
        clone.setAttribute('data-cloned', 'true');
        grid.appendChild(clone);
      });
    }
  });
  await page.waitForTimeout(500);

  const afterClone = await page.evaluate(async () => {
    const cards = document.querySelectorAll('[data-portfolio-card]');
    const vids = document.querySelectorAll('video');
    const dom = document.querySelectorAll('*').length;
    const cloned = document.querySelectorAll('[data-cloned]');
    return { cards: cards.length, videos: vids.length, dom, cloned: cloned.length };
  });
  console.log(`After clone: ${afterClone.cards} cards (${afterClone.cloned} cloned), ${afterClone.videos} videos, ${afterClone.dom} DOM nodes`);

  // ── Measure FPS with 15 cards ──
  const fpsResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let running = true;
      const start = performance.now();
      function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
      requestAnimationFrame(countFrame);
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pos = 0;
      const interval = setInterval(() => {
        pos += 200;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(interval);
          setTimeout(() => {
            running = false;
            const elapsed = performance.now() - start;
            resolve({ fps: Math.round((frameCount / elapsed) * 1000), frames: frameCount, elapsed: Math.round(elapsed), maxScroll });
          }, 500);
        }
      }, 25);
    });
  });
  console.log(`\nScroll FPS (15 cards): ${fpsResult.fps} (${fpsResult.frames} frames / ${fpsResult.elapsed}ms)`);

  // ── Count video elements at different scroll positions ──
  const videoPositions = [];
  const scrollStep = Math.max(500, Math.floor(fpsResult.maxScroll / 8));
  for (let y = 0; y <= fpsResult.maxScroll; y += scrollStep) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(100);
    const count = await page.evaluate(() => {
      const vids = document.querySelectorAll('video');
      const active = Array.from(vids).filter(v => !v.paused).length;
      const mounted = Array.from(vids).filter(v => v.readyState > 0).length;
      return { total: vids.length, active, mounted };
    });
    videoPositions.push({ y, ...count });
  }
  console.log(`\nVideo elements by scroll position (15 cards):`);
  videoPositions.forEach(v => console.log(`  @${v.y}px: ${v.total} total, ${v.mounted} with data, ${v.active} playing`));

  // ── DOM mutations during scroll ──
  const mutations = await page.evaluate(async () => {
    return new Promise((resolve) => {
      window.scrollTo(0, 0);
      let count = 0;
      const observer = new MutationObserver(() => { count++; });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pos = 0;
      const interval = setInterval(() => {
        pos += 200;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(interval);
          setTimeout(() => { observer.disconnect(); resolve({ mutations: count }); }, 500);
        }
      }, 25);
    });
  });
  console.log(`\nMutations during scroll (15 cards): ${mutations.mutations}`);

  // ── Memory ──
  const mem = await page.evaluate(() => {
    const m = performance.memory;
    return m ? { used: Math.round(m.usedJSHeapSize / 1048576), total: Math.round(m.totalJSHeapSize / 1048576) } : null;
  });
  if (mem) console.log(`Memory: ${mem.used}MB used / ${mem.total}MB total`);

  // ── Backdrop-filter area ──
  const blur = await page.evaluate(() => {
    let area = 0, count = 0;
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const s = getComputedStyle(el);
      if (s.backdropFilter && s.backdropFilter !== 'none') {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 100 && r.bottom > -100) {
          count++;
          area += r.width * r.height;
        }
      }
    }
    return { count, area: Math.round(area) };
  });
  console.log(`Backdrop-filter: ${blur.count} elements, ${blur.area}px² in viewport`);

  await ctx.close();
}

await browser.close();
console.log('\n=== SCALABILITY TEST COMPLETE ===');
