#!/usr/bin/env node
/**
 * A/B test: Hero animations impact
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

async function measureFPS(label, styleOverride) {
  await page.evaluate(() => { document.getElementById('ab-test')?.remove(); });
  if (styleOverride) {
    await page.evaluate((css) => {
      const s = document.createElement('style');
      s.id = 'ab-test';
      s.textContent = css;
      document.head.appendChild(s);
    }, styleOverride);
    await page.waitForTimeout(100);
  }
  const result = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let fc = 0, running = true;
      const start = performance.now();
      function cf() { if (!running) return; fc++; requestAnimationFrame(cf); }
      requestAnimationFrame(cf);
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pos = 0;
      const iv = setInterval(() => {
        pos += 200;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(iv);
          setTimeout(() => {
            running = false;
            resolve({ fps: Math.round((fc / (performance.now() - start)) * 1000) });
          }, 500);
        }
      }, 25);
    });
  });
  console.log(`  ${label}: ${result.fps} FPS`);
  return result.fps;
}

console.log('=== Hero Animation Impact (Desktop 1280, full page scroll) ===');
const baseline = await measureFPS('Baseline', null);
await measureFPS('No star twinkle', '.star { animation-play-state: paused !important; }');
await measureFPS('No float animation', '.animate-float { animation-play-state: paused !important; } .star { animation-play-state: paused !important; }');
await measureFPS('No hero animations (all paused)', '.star, .animate-float, .animate-pulse { animation-play-state: paused !important; }');
await measureFPS('All animations paused', '* { animation-play-state: paused !important; transition-duration: 0s !important; }');

await page.evaluate(() => { document.getElementById('ab-test')?.remove(); });
await ctx.close();
await browser.close();
console.log('\n=== COMPLETE ===');
