const { chromium } = require('playwright');
(async () => {
  const [file, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + file); await p.waitForTimeout(600);
  await p.screenshot({ path: out + '/r0.png' });
  await p.click('button[type=submit]'); await p.waitForTimeout(300);
  await p.evaluate(() => __turbo(16));
  for (let i = 0; i < 200; i++) { if (await p.$('.decide')) break; await p.waitForTimeout(300); }
  await p.screenshot({ path: out + '/r1.png', fullPage: true });
  await p.evaluate(() => { auto = false; });
  const before = await p.evaluate(() => S.month + S.age * 12);
  const c = await p.$$('.decide .choice:not([disabled])'); if (c.length) await c[0].click();
  await p.waitForTimeout(2000);
  const after = await p.evaluate(() => S.month + S.age * 12);
  await p.screenshot({ path: out + '/r2.png', fullPage: true });
  await p.evaluate(() => { document.getElementById('auto').checked = true; document.getElementById('auto').dispatchEvent(new Event('change')); __turbo(800); });
  for (let i = 0; i < 300; i++) { if (await p.$('.end1')) break; await p.waitForTimeout(400); }
  await p.waitForTimeout(1200);
  await p.screenshot({ path: out + '/r3.png', fullPage: true });
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(JSON.stringify({ errs, sw, before, after, ended: !!(await p.$('.end1')) }));
  await b.close();
})();
