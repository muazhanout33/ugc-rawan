import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mob.waitForTimeout(3000);
  await mob.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await mob.waitForTimeout(1500);

  // Screenshot before
  await mob.screenshot({ path: 'D:/ugc/lb-seq-0-before.png' });

  const btn = mob.locator('[data-portfolio-card]').first().locator('button[aria-label]');
  await btn.click();

  // Rapid sequence screenshots
  for (const delay of [0, 50, 100, 200, 400, 800, 1500, 3000]) {
    if (delay > 0) await mob.waitForTimeout(delay === 50 ? 50 : delay - (delay === 50 ? 0 : [0,50,100,200,400,800,1500][[0,50,100,200,400,800,1500].indexOf(delay)-1] || 0));
    await mob.screenshot({ path: `D:/ugc/lb-seq-${delay}ms.png` });
    
    const state = await mob.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return null;
      const video = dialog.querySelector('video');
      const spinner = dialog.querySelector('[class*="animate-spin"]');
      const playBtn = dialog.querySelector('button[aria-label="Play"]');
      return {
        videoPaused: video?.paused,
        videoReady: video?.readyState,
        spinnerVisible: spinner ? getComputedStyle(spinner.closest('div')).opacity !== '0' : false,
        playBtnVisible: playBtn ? getComputedStyle(playBtn.closest('[class*="pointer-events-none"]')).opacity !== '0' : false,
      };
    });
    console.log(`@${delay}ms:`, JSON.stringify(state));
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
