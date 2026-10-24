async page => {
  await page.goto('http://127.0.0.1:5173/#environment');
  await page.setViewportSize({width:390,height:844});
  const gallery = page.locator('#environment-polygone-gallery');
  await gallery.scrollIntoViewIfNeeded();
  await page.mouse.move(10,10);
  const box = await gallery.boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const read = () => gallery.evaluate(n => ({playing:n.dataset.playing,x:new DOMMatrixReadOnly(getComputedStyle(n.querySelector('.portfolio-gallery__track')).transform).m41}));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:box.y+box.height/2}]});
  const start = await read();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:210,y:box.y+box.height/2}]});
  const moved = await read();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(150);
  const end = await read();
  await cdp.detach();
  if(start.playing !== 'false' || Math.abs(moved.x-start.x-60)>2 || end.playing !== 'true') throw new Error(JSON.stringify({start,moved,end}));
  return {touchDrag:true,start,moved,end};
}
