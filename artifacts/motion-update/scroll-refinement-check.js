async page => {
  const checks = [], errors = [];
  const check = (name, pass, detail) => { checks.push({name,pass,detail}); if (!pass) throw new Error(name + ': ' + JSON.stringify(detail)); };
  page.on('pageerror', e => errors.push(String(e)));
  for (const [width,height] of [[1440,900],[390,844],[844,390]]) {
    await page.setViewportSize({width,height});
    for (const route of ['about-me','environment','arts','others']) {
      await page.goto('http://127.0.0.1:4173/?scroll-check='+route+'-'+width+'#'+route);
      const root = page.locator('#'+route);
      await root.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const sample = () => root.evaluate(el => {
        const scene=el.querySelector('[data-forest-scene]'), track=el.querySelector('[data-forest-track]'), body=el.querySelector('.portfolio-body');
        const xy = element => {const m = new DOMMatrixReadOnly(getComputedStyle(element).transform); return [m.m41,m.m42];};
        const navBottom=el.querySelector('.portfolio-nav')?.getBoundingClientRect().bottom || 0;
        const visibleCopiesReadable=[...scene.querySelectorAll('[data-forest-copy]')].every(e=>e.getBoundingClientRect().bottom<=navBottom || Number(e.style.opacity)>0);
        return {p:Number(scene.dataset.forestProgress),left:xy(scene.querySelector('[data-forest-side=left]')),right:xy(scene.querySelector('[data-forest-side=right]')),sky:xy(scene.querySelector('[data-forest-rise]')),sign:xy(scene.querySelector('[data-forest-sign]')),copies:[...scene.querySelectorAll('[data-forest-copy]')].map(e=>Number(e.style.opacity)),visibleCopiesReadable,trackHeight:track.offsetHeight,sceneHeight:scene.offsetHeight,bodyTop:body?.getBoundingClientRect().top,scroll:el.scrollTop};
      });
      const start=await sample();
      check(`${route}/${width}: original scene on entry`,start.p===0 && start.left[0]===0 && start.sky[1]===0 && start.copies.every(v=>v===1),start);
      await root.evaluate(el=>{
        const scene=el.querySelector('[data-forest-scene]'),nav=el.querySelector('.portfolio-nav');
        const available=el.clientHeight-(nav?.offsetHeight||0);
        el.scrollTop=el.id==='about-me' ? Math.max(0,scene.offsetHeight-available)+Math.max(280,available*.9)*.5 : Math.max(0,scene.offsetHeight-available)+Math.min(140,available*.25);
      });
      await page.waitForTimeout(120);
      const mid=await sample();
      check(`${route}/${width}: all scene layers move together`,mid.left[0]<0 && mid.left[1]<0 && mid.right[0]>0 && mid.sky[1]<0 && mid.sign[1]<0,mid);
      if(route!=='about-me') check(`${route}/${width}: body enters during scene exit without hiding visible copy`,mid.trackHeight===mid.sceneHeight && mid.bodyTop<height && mid.p<1 && mid.visibleCopiesReadable,mid);
      await page.screenshot({path:`D:/Web/web-tran-cam-linh-folio/artifacts/motion-update/scroll-${route}-${width}-mid.png`});
      if(route==='about-me') {
        await root.evaluate(el=>{el.scrollTop=el.scrollHeight});
        await page.waitForTimeout(100);
        const end=await sample();
        check(`about/${width}: blank ending`,end.p===1 && end.copies.every(v=>v===0),end);
        await page.screenshot({path:`D:/Web/web-tran-cam-linh-folio/artifacts/motion-update/scroll-about-${width}-end.png`});
      }
      await root.evaluate(el=>{el.scrollTop=0});
      await page.waitForTimeout(100);
      const back=await sample();
      check(`${route}/${width}: reverse scroll restores composition`,back.p===0 && back.left[0]===0 && back.sky[1]===0 && back.copies.every(v=>v===1),back);
    }
  }
  await page.setViewportSize({width:320,height:568});
  await page.goto('http://127.0.0.1:4173/#environment');
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});
  await page.locator('.environment-achievement__button').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  check('200% text zoom: readable content and heading below wrapped menu',await page.locator('#environment').evaluate(el=>{
    const nav=el.querySelector('.portfolio-nav').getBoundingClientRect(), heading=el.querySelector('.portfolio-section__heading').getBoundingClientRect();
    return el.scrollWidth<=el.clientWidth+1 && heading.top>=nav.bottom-1;
  }));
  await page.evaluate(()=>{document.documentElement.style.fontSize=''});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173/#about-me');
  await page.locator('#about-me').evaluate(el=>{el.scrollTop=el.scrollHeight});
  await page.waitForTimeout(200);
  check('reduced motion: all layers disappear without travel',await page.locator('.about-stage').evaluate(el=>[...el.querySelectorAll('[data-forest-side],[data-forest-rise],[data-forest-sign],[data-forest-copy]')].every(e=>Number(e.style.opacity)===0 && !e.style.transform)));
  await page.emulateMedia({reducedMotion:'no-preference'});
  const context=await page.context().browser().newContext({viewport:{width:390,height:844}});
  await context.addInitScript(()=>{
    delete window.ResizeObserver; delete window.IntersectionObserver;
    const original=window.matchMedia.bind(window);
    window.matchMedia=q=>{const m=original(q); m.addEventListener=undefined; m.removeEventListener=undefined; return m;};
  });
  const fallback=await context.newPage(); fallback.on('pageerror',e=>errors.push(String(e)));
  for(const route of ['about-me','environment','arts','others']) {
    await fallback.goto('http://127.0.0.1:4173/#'+route);
    await fallback.locator('#'+route).waitFor();
    await fallback.locator('#'+route).evaluate(el=>{el.scrollTop=el.scrollHeight});
    await fallback.waitForTimeout(100);
  }
  await context.close();
  check('no JS errors including observer/media-query fallbacks',errors.length===0,errors);
  return {passed:checks.length,checks};
}
