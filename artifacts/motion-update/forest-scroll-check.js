async page => {
  const results = [];
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const route of ['about-me','environment','arts','others']) {
      await page.goto('http://127.0.0.1:5173/#' + route);
      const root = route === 'about-me' ? '.about-page' : '.portfolio-page';
      await page.locator(root + ' [data-forest-scene]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const sample = () => page.locator(root).evaluate(el => {
        const scene = el.querySelector('[data-forest-scene]');
        const sign = el.querySelector('[data-forest-sign]');
        const copy = el.querySelector('[data-forest-copy]');
        const leaf = el.querySelector('[data-forest-side]');
        return {p:Number(scene.dataset.forestProgress),scroll:el.scrollTop,max:el.scrollHeight-el.clientHeight,sign:sign.style.transform,copy:copy.style.opacity,leaf:leaf.style.transform,overflow:el.scrollWidth>el.clientWidth};
      });
      const start = await sample();
      if (route === 'about-me') await page.screenshot({path:'D:/Web/forest-about-'+viewport.width+'-start.png'});
      await page.locator(root).evaluate(el => {
        const scene=el.querySelector('[data-forest-scene]');
        const nav=el.querySelector('.portfolio-nav');
        const available=el.clientHeight-(nav?.offsetHeight||0);
        el.scrollTop=Math.max(0,scene.offsetHeight-available)+Math.max(280,available*.9)*.5;
      });
      await page.waitForTimeout(100);
      const mid=await sample();
      if (route==='about-me') await page.screenshot({path:'D:/Web/forest-about-'+viewport.width+'-mid.png'});
      await page.locator(root).evaluate(el => {
        const scene=el.querySelector('[data-forest-scene]');
        const nav=el.querySelector('.portfolio-nav');
        const available=el.clientHeight-(nav?.offsetHeight||0);
        el.scrollTop=Math.max(0,scene.offsetHeight-available)+Math.max(280,available*.9);
      });
      await page.waitForTimeout(100);
      const end=await sample();
      if (route==='about-me') await page.screenshot({path:'D:/Web/forest-about-'+viewport.width+'-end.png'});
      await page.locator(root).evaluate(el=>el.scrollTop=0);
      await page.waitForTimeout(100);
      const restored=await sample();
      if(start.p!==0||mid.p<.49||mid.p>.51||end.p<.99||restored.p!==0||start.overflow||end.overflow) throw new Error(JSON.stringify({viewport,route,start,mid,end,restored}));
      results.push({viewport:viewport.width,route,start,mid,end,restored});
    }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5173/#about-me');
  await page.locator('.about-stage').waitFor();
  await page.locator('.about-page').evaluate(el=>el.scrollTop=el.scrollHeight);
  await page.waitForTimeout(100);
  const reduced=await page.locator('[data-forest-side]').first().evaluate(el=>({transform:el.style.transform,opacity:el.style.opacity}));
  if(reduced.transform!==''||Number(reduced.opacity)>.01) throw new Error('Reduced motion failed '+JSON.stringify(reduced));
  return {passed:true,checks:results.length,routes:results.map(r=>({viewport:r.viewport,route:r.route,start:r.start.p,mid:r.mid.p,end:r.end.p,restored:r.restored.p})),reduced};
}

