#!/usr/bin/env node
/**
 * Test different blur radii to find the sweet spot
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

async function measureFPS(label, styleOverride) {
  // Remove previous override
  await page.evaluate(() => { document.getElementById('blur-test')?.remove(); });

  if (styleOverride) {
    await page.evaluate((css) => {
      const s = document.createElement('style');
      s.id = 'blur-test';
      s.textContent = css;
      document.head.appendChild(s);
    }, styleOverride);
    await page.waitForTimeout(100);
  }

  const result = await page.evaluate(async () => {
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
            resolve({ fps: Math.round((frameCount / elapsed) * 1000) });
          }, 500);
        }
      }, 30);
    });
  });
  console.log(`  ${label}: ${result.fps} FPS`);
  return result.fps;
}

console.log('=== Blur Radius Comparison (Desktop 1280) ===');
const baseline = await measureFPS('Baseline (blur-2xl = 40px)', null);
await measureFPS('blur-xl  = 24px', '[class*="backdrop-blur-2xl"] { backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; }');
await measureFPS('blur-lg  = 16px', '[class*="backdrop-blur-2xl"] { backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important; }');
await measureFPS('blur-md  = 12px', '[class*="backdrop-blur-2xl"] { backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; }');
await measureFPS('blur-sm  = 8px',  '[class*="backdrop-blur-2xl"] { backdrop-filter: blur(8px) !important; -webkit-backdrop-filter: blur(8px) !important; }');
await measureFPS('No blur at all', '[class*="backdrop-blur-2xl"] { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }');

// Clean up
await page.evaluate(() => { document.getElementById('blur-test')?.remove(); });
await ctx.close();
await browser.close();
console.log('\n=== BLUR RADIUS TEST COMPLETE ===');
