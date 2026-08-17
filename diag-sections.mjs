#!/usr/bin/env node
/**
 * Section-by-section FPS profiling
 * Measures FPS while scrolling through specific page sections
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

// Get section boundaries
const sections = await page.evaluate(() => {
  const ids = ['home', 'about', 'portfolio', 'instagram', 'contact'];
  const result = [];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) {
      const r = el.getBoundingClientRect();
      result.push({ id, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) });
    }
  }
  result.push({ id: 'footer', top: document.body.scrollHeight - 200, height: 200 });
  return result;
});

console.log('Section boundaries:');
sections.forEach(s => console.log(`  ${s.id}: y=${s.top} h=${s.height}`));

// Measure FPS per section
async function measureSectionFPS(startY, endY, label) {
  const result = await page.evaluate(async ({ startY, endY }) => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let running = true;
      const start = performance.now();
      function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
      requestAnimationFrame(countFrame);

      let pos = startY;
      const step = 100;
      const interval = setInterval(() => {
        pos += step;
        window.scrollTo(0, pos);
        if (pos >= endY) {
          clearInterval(interval);
          setTimeout(() => {
            running = false;
            const elapsed = performance.now() - start;
            resolve({ fps: Math.round((frameCount / elapsed) * 1000), frames: frameCount, elapsed: Math.round(elapsed) });
          }, 300);
        }
      }, 20);
    });
  }, { startY, endY });
  console.log(`  ${label} (y=${startY}-${endY}): ${result.fps} FPS (${result.frames}f / ${result.elapsed}ms)`);
  return result.fps;
}

console.log('\n=== Section-by-Section FPS (Desktop 1280) ===');
const results = {};
for (let i = 0; i < sections.length; i++) {
  const s = sections[i];
  const endY = i < sections.length - 1 ? sections[i + 1].top : s.top + s.height;
  results[s.id] = await measureSectionFPS(s.top, Math.min(endY, s.top + s.height + 200), s.id);
}

// Also measure full page
console.log('\nFull page scroll:');
const fullPage = await page.evaluate(async () => {
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
          resolve({ fps: Math.round((frameCount / elapsed) * 1000) });
        }, 500);
      }
    }, 25);
  });
});
console.log(`  Full page: ${fullPage.fps} FPS`);

// Check what's in each section — backdrop-filter, animations, images
console.log('\n=== Section Expense Analysis ===');
for (const s of sections) {
  await page.evaluate((y) => window.scrollTo(0, y), s.top);
  await page.waitForTimeout(200);
  const info = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return null;
    const all = el.querySelectorAll('*');
    let backdropCount = 0, backdropArea = 0, animCount = 0, imgCount = 0, videoCount = 0;
    for (const child of all) {
      const style = getComputedStyle(child);
      if (style.backdropFilter && style.backdropFilter !== 'none') {
        backdropCount++;
        const r = child.getBoundingClientRect();
        backdropArea += r.width * r.height;
      }
      if (style.animationName !== 'none') animCount++;
      if (child.tagName === 'IMG') imgCount++;
      if (child.tagName === 'VIDEO') videoCount++;
    }
    return {
      elements: all.length,
      backdropCount,
      backdropArea: Math.round(backdropArea),
      animCount,
      imgCount,
      videoCount,
    };
  }, s.id);
  if (info) {
    console.log(`  ${s.id}: ${info.elements} elements, ${info.backdropCount} blur (${info.backdropArea}px²), ${info.animCount} animations, ${info.imgCount} imgs, ${info.videoCount} videos`);
  }
}

await ctx.close();
await browser.close();
console.log('\n=== SECTION PROFILING COMPLETE ===');
