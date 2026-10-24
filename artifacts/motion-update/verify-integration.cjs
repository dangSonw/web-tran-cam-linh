const { chromium } = require('C:/Users/son/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const checks = [];
  const check = (name, pass, detail) => { checks.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`, detail ?? ''); };
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4173')) errors.push(`${response.status()} ${response.url()}`); });
  const base = 'http://127.0.0.1:4173';
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const route of ['about-me','environment','arts','others']) {
      await page.goto(`${base}/#${route}`);
      const root = page.locator(route === 'about-me' ? '#about-me' : `#${route}`);
      await root.locator('[data-forest-scene]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(100);
      const start = await root.locator('[data-forest-scene]').getAttribute('data-forest-progress');
      await root.evaluate(el => {
        const scene = el.querySelector('[data-forest-scene]');
        const available = el.clientHeight - (el.querySelector('.portfolio-nav')?.offsetHeight || 0);
        el.scrollTop = Math.max(0, scene.offsetHeight - available) + Math.max(280, available * .9);
      });
      await page.waitForTimeout(100);
      const finish = await root.evaluate(el => ({
        progress: Number(el.querySelector('[data-forest-scene]').dataset.forestProgress),
        opacity: Number(el.querySelector('[data-forest-copy]').style.opacity),
        overflow: el.scrollWidth > el.clientWidth,
        atLimit: el.scrollHeight - el.clientHeight - el.scrollTop < 2
      }));
      check(`${route} forest ${viewport.width}`, Number(start) === 0 && finish.progress >= .99 && finish.opacity === 0 && !finish.overflow && (route !== 'about-me' || finish.atLimit), finish);
      await root.evaluate(el => { el.scrollTop = 0; });
      await page.waitForTimeout(70);
      check(`${route} reversal ${viewport.width}`, Number(await root.locator('[data-forest-scene]').getAttribute('data-forest-progress')) === 0);
      if (route === 'about-me') await page.screenshot({path:path.join(__dirname, `about-start-${viewport.width}.png`)});
    }
  }
  await page.setViewportSize({width:1440,height:900});
  const groups = [{route:'environment', count:5},{route:'arts',count:1}];
  for (const group of groups) {
    await page.goto(`${base}/#${group.route}`);
    await page.locator('.portfolio-gallery--continuous').first().waitFor({state:'attached'});
    const galleries = page.locator('.portfolio-gallery--continuous');
    check(`${group.route} gallery count`, await galleries.count() === group.count);
    for (let i=0;i<group.count;i++) {
      const gallery = galleries.nth(i);
      const id = await gallery.getAttribute('id');
      await gallery.scrollIntoViewIfNeeded();
      await page.mouse.move(3,3);
      await page.waitForTimeout(100);
      await gallery.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      const position = () => gallery.locator('.portfolio-gallery__track').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
      const before = await position();
      await page.waitForTimeout(300);
      const after = await position();
      check(`${id} moves right without controls`, after > before && await gallery.locator('button,.portfolio-gallery__count').count() === 0, {before,after});
      const point = await gallery.evaluate(el => {
        const windowRect = el.querySelector('.portfolio-gallery__window').getBoundingClientRect();
        const imageRects = [...el.querySelectorAll('img')].map(image => image.getBoundingClientRect());
        const rect = imageRects.find(r => Math.min(r.right,windowRect.right)-Math.max(r.left,windowRect.left)>40);
        return {x:(Math.max(rect.left,windowRect.left)+Math.min(rect.right,windowRect.right))/2,y:Math.max(70,Math.min(innerHeight-20,(windowRect.top+windowRect.bottom)/2))};
      });
      await page.mouse.move(point.x,point.y);
      await page.waitForTimeout(100);
      const paused = await position();
      await page.waitForTimeout(250);
      check(`${id} hover pauses`, Math.abs(await position()-paused)<.1 && await gallery.getAttribute('data-playing')==='false');
      await page.mouse.move(3,3);
      await page.waitForTimeout(250);
      check(`${id} leave resumes`, await position()>paused && await gallery.getAttribute('data-playing')==='true');
      if (i===0) await page.screenshot({path:path.join(__dirname,`${group.route}-gallery.png`)});
    }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(() => document.querySelector('.portfolio-gallery--continuous')?.dataset.reducedMotion === 'true');
  const gallery=page.locator('.portfolio-gallery--continuous').first();
  check('Reduced-motion gallery stays scrollable and static', await gallery.getAttribute('data-playing')==='false' && await gallery.locator('.portfolio-gallery__window').evaluate(el=>getComputedStyle(el).overflowX==='auto'));
  check('No runtime or asset errors', errors.length===0,errors);
  const result = {passed:checks.every(c=>c.pass),checks,errors};
  fs.writeFileSync(path.join(__dirname,'integration-results.json'),JSON.stringify(result,null,2));
  await browser.close();
  if(!result.passed) process.exitCode=1;
})().catch(error=>{console.error(error);process.exit(1)});
