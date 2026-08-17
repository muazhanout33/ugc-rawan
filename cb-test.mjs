import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.locator('[data-portfolio-card]').nth(1).locator('button[aria-label]').click();
  await page.waitForSelector('[role="dialog"] video', { timeout: 5000 });
  await page.waitForTimeout(1500);

  const info = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const style = d?.getAttribute('style');
    // Find the containing block by checking which ancestor is 3819px tall
    let cb = null;
    let el = d?.parentElement;
    while (el) {
      const r = el.getBoundingClientRect();
      if (Math.abs(r.height - 3819) < 50 || Math.abs(r.height - d.getBoundingClientRect().height) < 50) {
        cb = { tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 60), h: Math.round(r.height), transform: getComputedStyle(el).transform.slice(0, 40) };
        break;
      }
      el = el.parentElement;
    }
    return {
      inlineStyle: style,
      containingBlockCandidate: cb,
      dialogRect: (() => { const r = d.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width) }; })(),
      htmlH: document.documentElement.scrollHeight,
      bodyH: document.body.scrollHeight,
      mainRect: (() => { const r = document.querySelector('main')?.getBoundingClientRect(); return r ? { y: Math.round(r.y), h: Math.round(r.height) } : null; })(),
    };
  });
  console.log(JSON.stringify(info, null, 2));

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });