async page => {
  const sizes = [[320,568],[360,640],[375,667],[390,844],[412,915],[430,932],[568,320],[667,375],[844,390],[932,430],[600,800],[768,1024],[820,1180],[1024,768],[1180,820],[1024,600],[1280,720],[1366,768],[1440,900],[1536,864],[1920,1080],[1920,1200],[2560,1440],[3440,1440],[3840,2160]];
  const results = [], errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.emulateMedia({reducedMotion:'no-preference'});
  for (const route of ['open','home','about-me','environment','arts','others']) {
    await page.goto('http://127.0.0.1:4173/' + (route === 'open' ? '' : '#' + route));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1900);
    for (const [width,height] of sizes) {
      await page.setViewportSize({width,height});
      await page.evaluate(() => {
        const root = document.querySelector('.portfolio-page, .about-page:not([hidden])');
        if (root) root.scrollTop = 0;
      });
      await page.waitForTimeout(100);
      const result = await page.evaluate(route => {
        const root = document.getElementById(route);
        const rect = root.getBoundingClientRect();
        const active = root.dataset.active !== 'false' && !root.hidden;
        // Open/Home intentionally crop oversized decorative art. Test document
        // overflow and content bounds there, not the hidden artwork's bounds.
        const overflow = (!['open','home'].includes(route) && root.scrollWidth > root.clientWidth + 1) || document.documentElement.scrollWidth > innerWidth + 1;
        const outside = [...root.querySelectorAll('p, h2, h3, a, button')].filter(el => {
          if (el.closest('[hidden]') || el.classList.contains('visually-hidden')) return false;
          const r = el.getBoundingClientRect(), style = getComputedStyle(el);
          return r.width > 0 && style.visibility !== 'hidden' && (r.left < rect.left - 2 || r.right > rect.right + 2);
        }).map(el => el.className || el.tagName);
        const navigation = route === 'home' ? [...root.querySelectorAll('.home-sign')].every(el => {
          const r = el.getBoundingClientRect();
          return r.x >= 0 && r.y >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1;
        }) : true;
        const stage = root.querySelector('.open-stage');
        return {active,overflow,outside,navigation,stage:stage ? stage.getBoundingClientRect().width > 0 : true};
      }, route);
      const selector = route === 'about-me' ? '.about-page' : ['environment','arts','others'].includes(route) ? '.portfolio-page' : null;
      if (selector) {
        await page.locator(selector).evaluate(el => { el.scrollTop = el.scrollHeight; });
        await page.waitForTimeout(90);
        result.end = await page.locator(selector).evaluate(root => {
          const scene = root.querySelector('[data-forest-scene]');
          const foreground = [...scene.querySelectorAll('[data-forest-side], [data-forest-rise], [data-forest-sign]')];
          const bounds = scene.getBoundingClientRect();
          const remaining = foreground.filter(el => {
            const r=el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && r.right > bounds.left+1 && r.left < bounds.right-1 && r.bottom > bounds.top+1 && r.top < bounds.bottom-1;
          }).length;
          const footer = root.querySelector('.portfolio-footer');
          return {p:Number(scene.dataset.forestProgress),remaining,footerVisible:!footer || footer.getBoundingClientRect().bottom <= innerHeight+1,overflow:root.scrollWidth>root.clientWidth+1};
        });
        await page.locator(selector).evaluate(el => { el.scrollTop = 0; });
        await page.waitForTimeout(70);
      }
      result.pass = result.active && !result.overflow && result.outside.length === 0 && result.navigation && result.stage
        && (!result.end || (!result.end.overflow && result.end.footerVisible && (route !== 'about-me' || (result.end.p === 1 && result.end.remaining === 0))));
      results.push({route,width,height,...result});
      if ([390,844,1440,3440].includes(width)) await page.screenshot({path:`D:/Web/web-tran-cam-linh-folio/artifacts/motion-update/refined-${route}-${width}x${height}.png`});
    }
  }
  return {browser:page.context().browser().version(),count:results.length,passed:results.filter(r=>r.pass).length,failures:results.filter(r=>!r.pass),errors};
}
