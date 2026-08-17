#!/usr/bin/env node
/**
 * Scroll Performance Profiler
 * Measures FPS, long tasks, and re-render triggers during scroll
 */
import { chromium } from 'playwright';

const URL = 'http://localhost:3001';
const VIEWPORTS = [
  { w: 390, h: 844, label: 'Mobile 390' },
  { w: 1280, h: 900, label: 'Desktop 1280' },
];

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();

  // Collect long tasks
  const longTasks = [];
  await page.evaluate(() => {
    window.__longTasks = [];
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 16) {
          window.__longTasks.push({ duration: Math.round(entry.duration), startTime: Math.round(entry.startTime) });
        }
      }
    });
    obs.observe({ type: 'longtask', buffered: true });
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log(`\n=== ${vp.label} (${vp.w}x${vp.h}) ===`);

  // ── Test 1: FPS during scroll ──
  const fpsResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let running = true;
      const startTime = performance.now();

      // Count frames via rAF
      function countFrame() {
        if (!running) return;
        frameCount++;
        requestAnimationFrame(countFrame);
      }
      requestAnimationFrame(countFrame);

      // Scroll down the page in steps
      const scrollStep = 300;
      const totalScroll = 4000;
      let currentScroll = 0;
      const scrollInterval = setInterval(() => {
        currentScroll += scrollStep;
        window.scrollTo(0, currentScroll);
        if (currentScroll >= totalScroll) {
          clearInterval(scrollInterval);
          // Wait a bit then stop counting
          setTimeout(() => {
            running = false;
            const elapsed = performance.now() - startTime;
            resolve({
              elapsed: Math.round(elapsed),
              frames: frameCount,
              fps: Math.round((frameCount / elapsed) * 1000),
              scrollPosition: window.scrollY,
            });
          }, 500);
        }
      }, 50);
    });
  });
  console.log(`Scroll FPS: ${fpsResult.fps} (${fpsResult.frames} frames in ${fpsResult.elapsed}ms, scrolled to ${fpsResult.scrollPosition})`);

  // ── Test 2: Long tasks ──
  const longTaskData = await page.evaluate(() => {
    const tasks = window.__longTasks || [];
    const totalBlocking = tasks.reduce((sum, t) => sum + Math.max(0, t.duration - 16), 0);
    return {
      count: tasks.length,
      totalBlockingMs: Math.round(totalBlocking),
      worst: tasks.sort((a, b) => b.duration - a.duration).slice(0, 5),
    };
  });
  console.log(`Long tasks: ${longTaskData.count} (total blocking: ${longTaskData.totalBlockingMs}ms, worst: ${longTaskData.worst.map(t => t.duration + 'ms').join(', ')})`);

  // ── Test 3: Count animated elements on screen ──
  const animatedInfo = await page.evaluate(() => {
    // Scroll to middle of page
    window.scrollTo(0, 2000);

    const all = document.querySelectorAll('*');
    let withTransition = 0;
    let withAnimation = 0;
    let withBackdropBlur = 0;
    let withWillChange = 0;

    for (const el of all) {
      const style = window.getComputedStyle(el);
      if (style.animationName !== 'none') withAnimation++;
      if (style.backdropFilter && style.backdropFilter !== 'none') withBackdropBlur++;
      if (style.willChange && style.willChange !== 'auto') withWillChange++;
      if (style.transitionProperty && style.transitionProperty !== 'all') withTransition++;
    }

    return { withTransition, withAnimation, withBackdropBlur, withWillChange, total: all.length };
  });
  console.log(`Animated elements:`, JSON.stringify(animatedInfo));

  // ── Test 4: Count DOM nodes with backdrop-filter at current scroll ──
  const backdropElements = await page.evaluate(() => {
    const results = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      // Only count elements currently visible (in or near viewport)
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) continue;
      const style = window.getComputedStyle(el);
      if (style.backdropFilter && style.backdropFilter !== 'none') {
        const area = rect.width * rect.height;
        results.push({
          tag: el.tagName,
          class: (el.className?.toString() || '').substring(0, 60),
          filter: style.backdropFilter,
          area: Math.round(area),
          inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
        });
      }
    }
    return results.sort((a, b) => b.area - a.area);
  });
  console.log(`Backdrop-filter elements in/near viewport: ${backdropElements.length}`);
  backdropElements.slice(0, 8).forEach(e => console.log(`  ${e.inViewport ? 'IN' : 'near'} ${e.filter} area=${e.area}px² ${e.class}`));

  // ── Test 5: Measure re-renders during scroll ──
  const rerenderResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let renderCount = 0;
      // Hook into React DevTools (if available) or use MutationObserver
      const observer = new MutationObserver(() => { renderCount++; });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });

      // Scroll
      let pos = 0;
      const interval = setInterval(() => {
        pos += 200;
        window.scrollTo(0, pos);
        if (pos >= 3000) {
          clearInterval(interval);
          setTimeout(() => {
            observer.disconnect();
            resolve({ mutations: renderCount });
          }, 500);
        }
      }, 30);
    });
  });
  console.log(`DOM mutations during scroll: ${rerenderResult.mutations}`);

  // ── Test 6: Hero stars - count animated stars ──
  const starInfo = await page.evaluate(() => {
    window.scrollTo(0, 0);
    const stars = document.querySelectorAll('.star');
    return {
      count: stars.length,
      firstStarStyle: stars[0] ? {
        animation: window.getComputedStyle(stars[0]).animation,
        willChange: window.getComputedStyle(stars[0]).willChange,
      } : null,
    };
  });
  console.log(`Hero stars: ${starInfo.count}`, starInfo.firstStarStyle ? `first: anim=${starInfo.firstStarStyle.animation?.substring(0,50)}` : '');

  // ── Test 7: Check hero setInterval re-render ──
  const heroReRender = await page.evaluate(async () => {
    return new Promise((resolve) => {
      window.scrollTo(0, 0);
      let mutations = 0;
      const observer = new MutationObserver(() => { mutations++; });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        resolve({ mutationsIn4s: mutations });
      }, 4000);
    });
  });
  console.log(`Hero mutations in 4s (includes setInterval title rotation): ${heroReRender.mutationsIn4s}`);

  await ctx.close();
}

await browser.close();
console.log('\n=== SCROLL PROFILING COMPLETE ===');
