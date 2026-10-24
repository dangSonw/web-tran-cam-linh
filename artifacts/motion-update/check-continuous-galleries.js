async (page) => {
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const check = (ok, message, detail) => { results.push({ok, message, detail}); if (!ok) throw new Error(message + ': ' + JSON.stringify(detail)); };
  const read = async selector => page.locator(selector).evaluate(root => ({
    playing: root.dataset.playing,
    x: new DOMMatrixReadOnly(getComputedStyle(root.querySelector('.portfolio-gallery__track')).transform).m41,
    width: root.querySelector('.portfolio-gallery__strip').getBoundingClientRect().width,
    controls: root.querySelectorAll('button, .portfolio-gallery__count').length,
    loaded: [...root.querySelectorAll('img')].every(image => image.complete && image.naturalWidth > 0),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://127.0.0.1:5173/#environment');
  const ids = ['gha-first-meeting-gallery', 'gha-green-life-gallery', 'gha-tet-am-ap-gallery', 'gha-camp-blast-gallery', 'environment-polygone-gallery'];
  for (const id of ids) {
    const selector = '#' + id;
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.mouse.move(10, 10);
    await page.waitForFunction(id => document.getElementById(id)?.dataset.playing === 'true', id);
    await page.waitForFunction(id => [...document.getElementById(id).querySelectorAll('img')].every(image => image.complete && image.naturalWidth), id);
    const before = await read(selector);
    await page.waitForTimeout(650);
    const after = await read(selector);
    const travel = (after.x - before.x + after.width) % after.width;
    check(after.controls === 0 && after.loaded && !after.overflow, id + ': image-only, loaded, no page overflow', after);
    check(travel > 5 && travel < 18, id + ': moves slowly left to right', travel);
    const point = await page.locator(selector).evaluate(root => {
      const boundary = root.getBoundingClientRect();
      for (const image of root.querySelectorAll('img')) {
        const box = image.getBoundingClientRect();
        const left = Math.max(box.left, boundary.left, 0), right = Math.min(box.right, boundary.right, innerWidth);
        const top = Math.max(box.top, boundary.top, 80), bottom = Math.min(box.bottom, boundary.bottom, innerHeight);
        if (right - left > 30 && bottom - top > 30) return {x: (left + right) / 2, y: (top + bottom) / 2};
      }
    });
    await page.mouse.move(point.x, point.y);
    await page.waitForFunction(id => document.getElementById(id).dataset.playing === 'false', id);
    const paused = await read(selector);
    await page.waitForTimeout(300);
    check((await read(selector)).x === paused.x, id + ': hover pauses exact image');
    await page.mouse.move(10, 10);
    await page.waitForFunction(id => document.getElementById(id).dataset.playing === 'true', id);
    await page.waitForTimeout(300);
    const resumed = await read(selector);
    const resumeTravel = (resumed.x - paused.x + resumed.width) % resumed.width;
    check(resumeTravel > 1 && resumeTravel < 12, id + ': resumes smoothly from same offset', resumeTravel);
  }
  await page.screenshot({path: 'C:/Users/son/AppData/Local/Temp/continuous-polygone-desktop.png'});
  await page.goto('http://127.0.0.1:5173/#arts');
  const hat = '#arts-hat-artworks';
  await page.locator(hat).scrollIntoViewIfNeeded();
  await page.mouse.move(10, 10);
  await page.waitForFunction(() => document.querySelector('#arts-hat-artworks')?.dataset.playing === 'true');
  await page.waitForFunction(() => [...document.querySelectorAll('#arts-hat-artworks img')].every(image => image.complete && image.naturalWidth));
  const hatBefore = await read(hat);
  await page.waitForTimeout(500);
  const hatAfter = await read(hat);
  check(hatAfter.controls === 0 && hatAfter.loaded && hatAfter.x > hatBefore.x, 'HAT: image-only rightwards motion', hatAfter);
  await page.screenshot({path: 'C:/Users/son/AppData/Local/Temp/continuous-hat-desktop.png'});
  await page.setViewportSize({width: 390, height: 844});
  await page.locator(hat).scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  check(!(await read(hat)).overflow, 'Mobile: no horizontal document overflow');
  await page.screenshot({path: 'C:/Users/son/AppData/Local/Temp/continuous-hat-mobile.png'});
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.waitForFunction(() => document.querySelector('#arts-hat-artworks')?.dataset.reducedMotion === 'true');
  const reduced = await page.locator(hat).evaluate(root => {
    const viewport = root.querySelector('.portfolio-gallery__window');
    const before = viewport.scrollLeft;
    viewport.scrollLeft += 180;
    return {playing: root.dataset.playing, originalImages: root.querySelector('.portfolio-gallery__strip').querySelectorAll('img').length,
      moved: viewport.scrollLeft > before, duplicateHidden: getComputedStyle(root.querySelector('[aria-hidden=true]')).display === 'none'};
  });
  check(reduced.playing === 'false' && reduced.moved && reduced.duplicateHidden && reduced.originalImages === 5, 'Reduced motion: static native-scrolling complete sequence', reduced);
  await page.locator(hat).focus();
  const reducedX = await page.locator(hat + ' .portfolio-gallery__window').evaluate(node => node.scrollLeft);
  await page.keyboard.press('ArrowRight');
  check(await page.locator(hat + ' .portfolio-gallery__window').evaluate(node => node.scrollLeft) > reducedX, 'Reduced motion: keyboard browsing works');
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.locator(hat).evaluate(node => node.blur());
  await page.mouse.move(10, 10);
  await page.waitForFunction(() => document.querySelector('#arts-hat-artworks')?.dataset.playing === 'true');
  await page.goto('http://127.0.0.1:5173/#environment');
  await page.locator('#environment-polygone-gallery').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const mobilePolygone = await page.locator('#environment-polygone-gallery').evaluate(root => {
    const viewport = root.querySelector('.portfolio-gallery__window').getBoundingClientRect();
    const image = root.querySelector('img').getBoundingClientRect();
    return {image: image.width, viewport: viewport.width, height: image.height};
  });
  check(Math.abs(mobilePolygone.image - mobilePolygone.viewport) < 1, 'Mobile Polygone: complete slide fits viewport', mobilePolygone);
  await page.screenshot({path: 'C:/Users/son/AppData/Local/Temp/continuous-polygone-mobile.png'});
  check(errors.length === 0, 'No page errors', errors);
  return results;
}
