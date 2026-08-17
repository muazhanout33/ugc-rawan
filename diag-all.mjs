/* Comprehensive portfolio/video diagnostic — covers black-screen, autoplay,
   scroll-lock, poster, play-button, layout across mobile + desktop. */
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = 'http://localhost:3001';

async function brightness(path) {
  const { data } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
  let sum = 0, max = 0, nonBlack = 0, total = data.length / 3;
  for (let i = 0; i < data.length; i += 3) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += lum;
    if (lum > max) max = lum;
    if (lum > 24) nonBlack++;
  }
  return { avg: +(sum / total).toFixed(1), max: +max.toFixed(1), pct: +((nonBlack / total) * 100).toFixed(1) };
}

async function runCase(browser, label, viewport, cardIdx) {
  const page = await browser.newPage({ viewport });
  const errs = [];
  page.on('pageerror', e => errs.push('PAGE:' + e.message.slice(0, 80)));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE:' + m.text().slice(0, 80)); });

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(1200);

  const btn = page.locator('[data-portfolio-card]').nth(cardIdx).locator('button[aria-label]');
  if (await btn.count() === 0) { console.log(`${label} card${cardIdx}: no video btn`); await page.close(); return; }
  const aria = await btn.getAttribute('aria-label');
  console.log(`\n=== ${label} card${cardIdx} (${aria}) vp=${viewport.width}x${viewport.height} ===`);

  const before = { bodyOverflow: '', htmlClass: '', lenis: '' };
  Object.assign(before, await page.evaluate(() => ({
    bodyOverflow: document.body.style.overflow,
    htmlClass: document.documentElement.className,
    lenis: document.documentElement.classList.contains('lenis') ? 'yes' : 'no',
    scrollY: Math.round(scrollY),
    bodyCanScroll: document.body.scrollHeight > innerHeight,
  })));
  console.log('BEFORE open:', JSON.stringify(before));

  await btn.click();
  await page.waitForSelector('[role="dialog"] video', { timeout: 8000 }).catch(() => {});

  const stages = [0, 100, 300, 800, 2000];
  for (const t of stages) {
    if (t > 0) await page.waitForTimeout(t - (stages[stages.indexOf(t) - 1] || 0));
    const s = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const v = d?.querySelector('video');
      const r = v?.getBoundingClientRect();
      const playBtn = d?.querySelector('button[aria-label="Play"]');
      return {
        dH: d?.clientHeight, dSH: d?.scrollHeight,
        vW: v?.offsetWidth, vH: v?.offsetHeight,
        vInVP: r ? (r.bottom > 0 && r.top < innerHeight) : false,
        vY: r ? Math.round(r.y) : null,
        dInVP: d ? (d.getBoundingClientRect().height <= innerHeight + 50 && d.getBoundingClientRect().height >= innerHeight - 100) : false,
        dlgH: d ? Math.round(d.getBoundingClientRect().height) : null,
        paused: v?.paused, ready: v?.readyState, muted: v?.muted,
        poster: v?.poster?.slice(-30) || null,
        playBtn: !!playBtn, playBtnVisible: playBtn ? getComputedStyle(playBtn).opacity !== '0' && getComputedStyle(playBtn.closest('div')).opacity !== '0' : false,
        bodyOverflow: document.body.style.overflow,
        scrollY: Math.round(scrollY),
      };
    });
    const screenAvg = await (async () => {
      const f = `diag-${label}-c${cardIdx}-${t}ms.png`;
      await page.screenshot({ path: 'D:/ugc/' + f });
      return await brightness('D:/ugc/' + f);
    })();
    console.log(`@${t}ms scr(avg=${screenAvg.avg} max=${screenAvg.max} nonBlack=${screenAvg.pct}%) ` +
      `dlgInVP=${s.dInVP} dlgH=${s.dlgH} vInVP=${s.vInVP} vY=${s.vY} v=${s.vW}x${s.vH} ` +
      `paused=${s.paused} ready=${s.ready} muted=${s.muted} playBtn=${s.playBtn} playBtnVis=${s.playBtnVisible} ` +
      `bodyOvf=${s.bodyOverflow} scrollY=${s.scrollY}`);
  }

  // Scroll-lock test: can we scroll the dialog/page?
  const lockTest = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const before = { dlgScroll: d?.scrollTop, bodyOvf: document.body.style.overflow };
    if (d) d.scrollTop = 100;
    return { beforeDlgScroll: before.dlgScroll, dlgScrollAfter: d?.scrollTop, bodyOvf: before.bodyOvf, dlgScrollable: d ? (d.scrollHeight > d.clientHeight) : false };
  });
  console.log('Scroll-lock:', JSON.stringify(lockTest));

  // Try play button tap
  const playBtn = page.locator('[role="dialog"] button[aria-label="Play"]').first();
  let played = false;
  if (await playBtn.count() > 0) {
    try { await playBtn.click({ timeout: 3000 }); await page.waitForTimeout(800); played = true; } catch (e) {}
  }
  const afterPlay = await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    return { paused: v?.paused, ready: v?.readyState, time: +(v?.currentTime || 0).toFixed(2) };
  });
  console.log(`After Play tap (btn existed=${await playBtn.count() > 0}, clicked=${played}):`, JSON.stringify(afterPlay));

  // Close
  const close = page.locator('button[aria-label="Close video"]').first();
  if (await close.count() > 0) {
    try { await close.click({ force: true, timeout: 3000 }); await page.waitForTimeout(500); } catch (e) {}
  }
  const afterClose = await page.evaluate(() => ({
    bodyOverflow: document.body.style.overflow,
    dialogGone: !document.querySelector('[role="dialog"]'),
    scrollY: Math.round(scrollY),
  }));
  console.log('After close:', JSON.stringify(afterClose));

  // Can scroll after close?
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const scrolled = await page.evaluate(() => Math.round(scrollY));
  console.log(`Post-close scroll to 0 → scrollY=${scrolled} (means scroll works: ${scrolled === 0})`);
  console.log('Errors:', errs.length ? errs.slice(0, 5).join(' | ') : 'NONE');
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  // Mobile 390 — 3 cards
  await runCase(browser, 'mob390', { width: 390, height: 844 }, 0);
  await runCase(browser, 'mob390', { width: 390, height: 844 }, 1);
  await runCase(browser, 'mob390', { width: 390, height: 844 }, 2);
  // 2nd mobile width
  await runCase(browser, 'mob375', { width: 375, height: 667 }, 0);
  // Desktop 1280 — 2 cards
  await runCase(browser, 'desk1280', { width: 1280, height: 900 }, 0);
  await runCase(browser, 'desk1280', { width: 1280, height: 900 }, 1);
  // Larger desktop
  await runCase(browser, 'desk1536', { width: 1536, height: 900 }, 0);
  await browser.close();
  console.log('\n=== DIAG COMPLETE ===');
})();
