import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';

async function run(page, label, cvValue) {
  await page.evaluate((val) => {
    document.getElementById('portfolio').style.contentVisibility = val;
  }, cvValue);
  await page.waitForTimeout(200);

  const btn = page.locator('[data-portfolio-card]').nth(0).locator('button[aria-label]');
  await btn.click();
  await page.waitForSelector('[role="dialog"] video', { timeout: 5000 });
  await page.waitForTimeout(1200);

  const m = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const v = d?.querySelector('video');
    const dr = d?.getBoundingClientRect();
    const vr = v?.getBoundingClientRect();
    return {
      dialogH: Math.round(dr?.height || 0),
      videoInViewport: vr ? (vr.bottom > 0 && vr.top < innerHeight) : false,
      videoY: vr ? Math.round(vr.y) : null,
      dlgScrollH: d?.scrollHeight,
      dlgClientH: d?.clientHeight,
      scrollable: d ? d.scrollHeight > d.clientHeight : false,
      paused: v?.paused,
      ready: v?.readyState,
    };
  });
  console.log(`${label}:`, JSON.stringify(m));

  const c = page.locator('button[aria-label="Close video"]');
  if (await c.count()) { await c.click(); await page.waitForTimeout(400); }
}

async function main() {
  const browser = await chromium.launch();

  const p1 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p1.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p1.waitForTimeout(2500);
  await p1.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await p1.waitForTimeout(1200);
  await run(p1, 'content-visibility=auto (current)', 'auto');

  const p2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p2.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p2.waitForTimeout(2500);
  await p2.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await p2.waitForTimeout(1200);
  await run(p2, 'content-visibility=visible (fix)', 'visible');

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });