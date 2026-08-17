#!/usr/bin/env node
/**
 * A/B test: measure FPS with and without backdrop-filter
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

// ── Baseline: measure FPS WITH backdrop-filter ──
const baseline = await page.evaluate(async () => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let running = true;
    const start = performance.now();
    function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
    requestAnimationFrame(countFrame);
    let pos = 0;
    const interval = setInterval(() => {
      pos += 200;
      window.scrollTo(0, pos);
      if (pos >= 4000) {
        clearInterval(interval);
        setTimeout(() => {
          running = false;
          const elapsed = performance.now() - start;
          resolve({ fps: Math.round((frameCount / elapsed) * 1000), frames: frameCount, elapsed: Math.round(elapsed) });
        }, 500);
      }
    }, 30);
  });
});
console.log(`BASELINE (with backdrop-filter): ${baseline.fps} FPS (${baseline.frames} frames in ${baseline.elapsed}ms)`);

// Count blur elements
const blurCount = await page.evaluate(() => {
  let count = 0, totalArea = 0;
  const all = document.querySelectorAll('*');
  for (const el of all) {
    const style = window.getComputedStyle(el);
    if (style.backdropFilter && style.backdropFilter !== 'none') {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        count++;
        totalArea += rect.width * rect.height;
      }
    }
  }
  return { count, totalArea: Math.round(totalArea) };
});
console.log(`Blur elements in viewport: ${blurCount.count}, total area: ${blurCount.totalArea}px²`);

// ── TEST: disable ALL backdrop-filter and re-measure ──
await page.evaluate(() => {
  // Disable all backdrop-filter
  const style = document.createElement('style');
  style.id = 'no-blur-test';
  style.textContent = '*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }';
  document.head.appendChild(style);
});
await page.waitForTimeout(200);

const noBlur = await page.evaluate(async () => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let running = true;
    const start = performance.now();
    function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
    requestAnimationFrame(countFrame);
    let pos = 0;
    const interval = setInterval(() => {
      pos += 200;
      window.scrollTo(0, pos);
      if (pos >= 4000) {
        clearInterval(interval);
        setTimeout(() => {
          running = false;
          const elapsed = performance.now() - start;
          resolve({ fps: Math.round((frameCount / elapsed) * 1000), frames: frameCount, elapsed: Math.round(elapsed) });
        }, 500);
      }
    }, 30);
  });
});
console.log(`NO BLUR (backdrop-filter disabled): ${noBlur.fps} FPS (${noBlur.frames} frames in ${noBlur.elapsed}ms)`);
console.log(`FPS improvement: ${noBlur.fps - baseline.fps} FPS (+${Math.round(((noBlur.fps - baseline.fps) / baseline.fps) * 100)}%)`);

// ── TEST: disable only navbar blur ──
await page.evaluate(() => {
  document.getElementById('no-blur-test')?.remove();
  const style = document.createElement('style');
  style.id = 'no-navblur-test';
  style.textContent = 'nav, header, [class*="backdrop-blur-2xl"] { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }';
  document.head.appendChild(style);
});
await page.waitForTimeout(200);

const noNavBlur = await page.evaluate(async () => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let running = true;
    const start = performance.now();
    function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
    requestAnimationFrame(countFrame);
    let pos = 0;
    const interval = setInterval(() => {
      pos += 200;
      window.scrollTo(0, pos);
      if (pos >= 4000) {
        clearInterval(interval);
        setTimeout(() => {
          running = false;
          const elapsed = performance.now() - start;
          resolve({ fps: Math.round((frameCount / elapsed) * 1000), frames: frameCount, elapsed: Math.round(elapsed) });
        }, 500);
      }
    }, 30);
  });
});
console.log(`NO NAV BLUR (only navbar blur disabled): ${noNavBlur.fps} FPS (${noNavBlur.frames} frames in ${noNavBlur.elapsed}ms)`);
console.log(`FPS improvement: ${noNavBlur.fps - baseline.fps} FPS (+${Math.round(((noNavBlur.fps - baseline.fps) / baseline.fps) * 100)}%)`);

// ── TEST: disable only skill-card blur ──
await page.evaluate(() => {
  document.getElementById('no-navblur-test')?.remove();
  const style = document.createElement('style');
  style.id = 'no-cardblur-test';
  style.textContent = '.glass-card, [class*="rounded-2xl"][class*="backdrop-blur-md"] { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }';
  document.head.appendChild(style);
});
await page.waitForTimeout(200);

const noCardBlur = await page.evaluate(async () => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let running = true;
    const start = performance.now();
    function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
    requestAnimationFrame(countFrame);
    let pos = 0;
    const interval = setInterval(() => {
      pos += 200;
      window.scrollTo(0, pos);
      if (pos >= 4000) {
        clearInterval(interval);
        setTimeout(() => {
          running = false;
          const elapsed = performance.now() - start;
          resolve({ fps: Math.round((frameCount / elapsed) * 1000), frames: frameCount, elapsed: Math.round(elapsed) });
        }, 500);
      }
    }, 30);
  });
});
console.log(`NO CARD BLUR (skill card blur disabled): ${noCardBlur.fps} FPS (${noCardBlur.frames} frames in ${noCardBlur.elapsed}ms)`);
console.log(`FPS improvement: ${noCardBlur.fps - baseline.fps} FPS (+${Math.round(((noCardBlur.fps - baseline.fps) / baseline.fps) * 100)}%)`);

// Clean up
await page.evaluate(() => { document.getElementById('no-cardblur-test')?.remove(); });

await ctx.close();
await browser.close();
console.log('\n=== A/B BLUR TEST COMPLETE ===');
