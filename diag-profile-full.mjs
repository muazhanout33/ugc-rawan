#!/usr/bin/env node
/**
 * Comprehensive Performance Profile — Current State
 * Measures: FPS, frame times, long tasks, re-renders, DOM mutations,
 * video element count, memory, layout thrashing, paint complexity
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

  // ── Inject PerformanceObserver for long tasks + frame timing ──
  await page.evaluate(() => {
    window.__perf = { longTasks: [], frameTimes: [], layoutShifts: [] };
    
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.duration > 16) window.__perf.longTasks.push({ dur: Math.round(e.duration), start: Math.round(e.startTime) });
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch {}

    // frame observer not available in headless; use manual rAF measurement

    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__perf.layoutShifts.push({ value: e.value, start: Math.round(e.startTime) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${vp.label} (${vp.w}x${vp.h})`);
  console.log(`${'='.repeat(60)}`);

  // ── 1. FPS during full-page scroll ──
  const fpsResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let running = true;
      const start = performance.now();
      function countFrame() { if (!running) return; frameCount++; requestAnimationFrame(countFrame); }
      requestAnimationFrame(countFrame);

      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pos = 0;
      const step = 200;
      const interval = setInterval(() => {
        pos += step;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(interval);
          setTimeout(() => {
            running = false;
            const elapsed = performance.now() - start;
            resolve({
              fps: Math.round((frameCount / elapsed) * 1000),
              frames: frameCount,
              elapsed: Math.round(elapsed),
              maxScroll,
            });
          }, 500);
        }
      }, 25);
    });
  });
  console.log(`\n[1] SCROLL FPS: ${fpsResult.fps} (${fpsResult.frames} frames / ${fpsResult.elapsed}ms, scrolled ${fpsResult.maxScroll}px)`);

  // ── 2. Frame time distribution (manual rAF measurement) ──
  const frameTimeData = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frameTimes = [];
      let lastTime = performance.now();
      let count = 0;
      const maxFrames = 300;
      
      function measure() {
        const now = performance.now();
        const delta = now - lastTime;
        if (delta > 0) frameTimes.push(Math.round(delta));
        lastTime = now;
        count++;
        if (count < maxFrames) requestAnimationFrame(measure);
        else {
          const sorted = [...frameTimes].sort((a, b) => a - b);
          const p50 = sorted[Math.floor(sorted.length * 0.5)];
          const p90 = sorted[Math.floor(sorted.length * 0.9)];
          const p99 = sorted[Math.floor(sorted.length * 0.99)];
          const over16 = frameTimes.filter(d => d > 16).length;
          const over32 = frameTimes.filter(d => d > 32).length;
          const over50 = frameTimes.filter(d => d > 50).length;
          resolve({ count: frameTimes.length, p50, p90, p99, over16, over32, over50, min: sorted[0], max: sorted[sorted.length - 1] });
        }
      }
      requestAnimationFrame(measure);
    });
  });
  console.log(`[2] FRAME TIMES: p50=${frameTimeData.p50}ms p90=${frameTimeData.p90}ms p99=${frameTimeData.p99}ms | >16ms:${frameTimeData.over16} >32ms:${frameTimeData.over32} >50ms:${frameTimeData.over50} (of ${frameTimeData.count})`);

  // ── 3. Long tasks ──
  const longTasks = await page.evaluate(() => {
    const tasks = window.__perf?.longTasks || [];
    const totalBlocking = tasks.reduce((s, t) => s + Math.max(0, t.dur - 16), 0);
    return { count: tasks.length, totalBlockingMs: Math.round(totalBlocking), worst5: tasks.sort((a, b) => b.dur - a.dur).slice(0, 5) };
  });
  console.log(`[3] LONG TASKS: ${longTasks.count} (${longTasks.totalBlockingMs}ms blocking) worst: ${longTasks.worst5.map(t => t.dur + 'ms').join(', ') || 'none'}`);

  // ── 4. Layout shifts (CLS) ──
  const cls = await page.evaluate(() => {
    const shifts = window.__perf?.layoutShifts || [];
    const total = shifts.reduce((s, e) => s + e.value, 0);
    return { count: shifts.length, totalCLS: Math.round(total * 1000) / 1000 };
  });
  console.log(`[4] LAYOUT SHIFTS: CLS=${cls.totalCLS} (${cls.count} shifts)`);

  // ── 5. DOM stats ──
  const dom = await page.evaluate(() => {
    window.scrollTo(0, 0);
    const all = document.querySelectorAll('*');
    let withBackdropFilter = 0;
    let withAnimation = 0;
    let withWillChange = 0;
    let totalBackdropArea = 0;
    for (const el of all) {
      const s = getComputedStyle(el);
      if (s.backdropFilter && s.backdropFilter !== 'none') {
        withBackdropFilter++;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 100 && r.bottom > -100) totalBackdropArea += r.width * r.height;
      }
      if (s.animationName !== 'none') withAnimation++;
      if (s.willChange && s.willChange !== 'auto') withWillChange++;
    }
    return { total: all.length, withBackdropFilter, withAnimation, withWillChange, totalBackdropArea: Math.round(totalBackdropArea) };
  });
  console.log(`[5] DOM: ${dom.total} elements | backdrop-filter: ${dom.withBackdropFilter} (${dom.totalBackdropArea}px² in viewport) | animations: ${dom.withAnimation} | will-change: ${dom.withWillChange}`);

  // ── 6. Video elements at different scroll positions ──
  const scrollPositions = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500];
  const videoCounts = [];
  for (const y of scrollPositions) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(100);
    const count = await page.evaluate(() => {
      const vids = document.querySelectorAll('video');
      const active = Array.from(vids).filter(v => !v.paused).length;
      return { total: vids.length, active };
    });
    videoCounts.push({ y, ...count });
  }
  console.log(`[6] VIDEO ELEMENTS by scroll position:`);
  videoCounts.forEach(v => console.log(`    @${v.y}px: ${v.total} total, ${v.active} playing`));

  // ── 7. React re-renders during scroll (MutationObserver) ──
  const rerenders = await page.evaluate(async () => {
    return new Promise((resolve) => {
      window.scrollTo(0, 0);
      let mutations = 0;
      let addedNodes = 0;
      let removedNodes = 0;
      let attributeChanges = 0;
      const observer = new MutationObserver((muts) => {
        for (const m of muts) {
          mutations++;
          if (m.type === 'childList') { addedNodes += m.addedNodes.length; removedNodes += m.removedNodes.length; }
          if (m.type === 'attributes') attributeChanges++;
        }
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pos = 0;
      const interval = setInterval(() => {
        pos += 200;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(interval);
          setTimeout(() => {
            observer.disconnect();
            resolve({ mutations, addedNodes, removedNodes, attributeChanges });
          }, 500);
        }
      }, 25);
    });
  });
  console.log(`[7] MUTATIONS DURING SCROLL: ${rerenders.mutations} total (added: ${rerenders.addedNodes}, removed: ${rerenders.removedNodes}, attrs: ${rerenders.attributeChanges})`);

  // ── 8. Memory ──
  const memory = await page.evaluate(() => {
    const m = performance.memory;
    if (!m) return null;
    return { usedJS: Math.round(m.usedJSHeapSize / 1048576), totalJS: Math.round(m.totalJSHeapSize / 1048576) };
  });
  if (memory) console.log(`[8] MEMORY: ${memory.usedJS}MB used / ${memory.totalJS}MB total`);
  else console.log(`[8] MEMORY: not available in this browser`);

  // ── 9. Image count + sizes ──
  const images = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    const byLoading = { lazy: 0, eager: 0, none: 0 };
    imgs.forEach(i => { byLoading[i.loading] = (byLoading[i.loading] || 0) + 1; });
    return { total: imgs.length, byLoading };
  });
  console.log(`[9] IMAGES: ${images.total} total (lazy: ${images.byLoading.lazy}, eager: ${images.byLoading.eager}, unset: ${images.byLoading.none || 0})`);

  // ── 10. Hero-specific metrics ──
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const hero = await page.evaluate(() => {
    const stars = document.querySelectorAll('.star');
    const heroSection = document.querySelector('#home');
    const heroRect = heroSection?.getBoundingClientRect();
    // Count visible animated elements in hero
    const animInHero = [];
    if (heroSection) {
      const all = heroSection.querySelectorAll('*');
      for (const el of all) {
        const s = getComputedStyle(el);
        if (s.animationName !== 'none') animInHero.push(el.className?.toString()?.substring(0, 40));
      }
    }
    return {
      starCount: stars.length,
      heroH: heroRect ? Math.round(heroRect.height) : null,
      animatedInHero: animInHero.length,
      heroAnimations: animInHero.slice(0, 10),
    };
  });
  console.log(`[10] HERO: ${hero.starCount} stars, ${hero.animatedInHero} animated elements, hero height=${hero.heroH}px`);
  console.log(`    Animations: ${hero.heroAnimations.join(', ')}`);

  // ── 11. CSS animation classes in globals.css that are infinite ──
  const infiniteAnims = await page.evaluate(() => {
    const results = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const s = getComputedStyle(el);
      const dur = s.animationDuration;
      const iter = s.animationIterationCount;
      if (iter === 'infinite' && s.animationName !== 'none') {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 200 && r.bottom > -200) {
          results.push({
            class: el.className?.toString()?.substring(0, 50),
            anim: s.animationName?.substring(0, 30),
            dur,
            area: Math.round(r.width * r.height),
          });
        }
      }
    }
    return results;
  });
  console.log(`[11] INFINITE CSS ANIMATIONS in/near viewport: ${infiniteAnims.length}`);
  infiniteAnims.forEach(a => console.log(`    ${a.anim} (${a.dur}) area=${a.area}px² ${a.class}`));

  await ctx.close();
}

await browser.close();
console.log('\n=== COMPREHENSIVE PROFILE COMPLETE ===');
