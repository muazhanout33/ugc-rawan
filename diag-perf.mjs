#!/usr/bin/env node
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

// Test at 390px mobile
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

console.log('=== Performance Check (390px mobile) ===');

// 1. Count video elements at various scroll positions
const positions = [0, 500, 1000, 1500, 2000, 2500, 3000];
for (const y of positions) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(300);
  const count = await page.evaluate(() => {
    const videos = document.querySelectorAll('video');
    const sources = Array.from(videos).map(v => ({
      src: v.src?.substring(0, 50),
      paused: v.paused,
      readyState: v.readyState,
      preload: v.preload,
    }));
    return { total: videos.length, details: sources };
  });
  console.log(`  @scroll=${y}: ${count.total} videos`, count.total > 0 ? JSON.stringify(count.details) : '');
}

// 2. Check backdrop-filter usage
const backdrop = await page.evaluate(() => {
  const all = document.querySelectorAll('*');
  const results = [];
  for (const el of all) {
    const style = window.getComputedStyle(el);
    if (style.backdropFilter && style.backdropFilter !== 'none') {
      results.push({
        tag: el.tagName,
        class: el.className?.substring?.(0, 80),
        backdropFilter: style.backdropFilter,
      });
    }
  }
  return results;
});
console.log(`\nBackdrop-filter elements: ${backdrop.length}`);
backdrop.forEach(b => console.log(`  ${b.tag} ${b.class} → ${b.backdropFilter}`));

// 3. Check CSS animations / transitions count
const anims = await page.evaluate(() => {
  const all = document.querySelectorAll('*');
  let transitionCount = 0;
  let animationCount = 0;
  for (const el of all) {
    const style = window.getComputedStyle(el);
    if (style.transition && style.transition !== 'all 0s ease 0s') transitionCount++;
    if (style.animationName && style.animationName !== 'none') animationCount++;
  }
  return { transitionCount, animationCount };
});
console.log(`\nAnimations: ${JSON.stringify(anims)}`);

// 4. Check total DOM size
const domSize = await page.evaluate(() => ({
  totalElements: document.querySelectorAll('*').length,
  maxDepth: (() => {
    let max = 0;
    const walk = (el, depth) => {
      if (depth > max) max = depth;
      for (const child of el.children) walk(child, depth + 1);
    };
    walk(document.body, 0);
    return max;
  })(),
}));
console.log(`\nDOM size: ${JSON.stringify(domSize)}`);

// 5. Check image lazy loading
const images = await page.evaluate(() => {
  const imgs = document.querySelectorAll('img');
  return Array.from(imgs).map(img => ({
    src: img.src?.substring(0, 60),
    loading: img.loading,
    decoded: img.decoded ? 'decoded' : 'not-decoded',
  }));
});
console.log(`\nImages: ${images.length}`);
images.forEach(i => console.log(`  ${i.loading} ${i.src}`));

await ctx.close();
await browser.close();
console.log('\n=== PERFORMANCE CHECK COMPLETE ===');
