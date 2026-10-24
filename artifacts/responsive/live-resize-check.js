async (page) => {
  const errors = []
  const failures = []
  const results = []
  const onError = (error) => errors.push(String(error))
  const onConsole = (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      errors.push(`${message.type()}: ${message.text()}`)
    }
  }
  page.on('pageerror', onError)
  page.on('console', onConsole)

  try {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('http://127.0.0.1:5173/')
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('button', { name: 'Scroll to enter' }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    await page.mouse.move(0, 0)

    // Intentionally NO reload between viewports: exercise the original regression.
    const sizes = [
      [1920, 1080], [1440, 1000], [1440, 900], [1024, 768],
      [768, 1024], [412, 915], [390, 844], [844, 390], [320, 568],
      [759, 800], [760, 760], [800, 800], [1199, 800], [1200, 800],
      [1201, 800], [1536, 864], [2560, 1440], [3440, 1440],
      [1920, 300], [568, 320], [320, 480], [390, 568], [1440, 1000],
    ]
    const captures = new Set(['1920x1080', '1440x1000', '768x1024', '390x844', '320x568', '844x390', '1920x300'])

    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height })
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const metrics = await page.evaluate(() => {
        const rect = (element) => element.getBoundingClientRect().toJSON()
        const open = document.querySelector('.open-page')
        const home = document.querySelector('#home')
        const welcome = document.querySelector('.home-welcome')
        return {
          viewport: `${innerWidth}x${innerHeight}`,
          open: rect(open),
          openVisibility: getComputedStyle(open).visibility,
          openInert: open.inert,
          homeActive: home.dataset.active,
          homeInert: home.inert,
          links: [...document.querySelectorAll('.home-sign')].map((element) => ({ name: element.dataset.homeSign, ...rect(element) })),
          artwork: [...document.querySelectorAll('.home-sign__artwork')].map(rect),
          welcome: rect(welcome),
          fontSize: parseFloat(getComputedStyle(welcome).fontSize),
          columns: getComputedStyle(document.querySelector('.home-navigation')).gridTemplateColumns,
          overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
          brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
        }
      })
      const issues = []
      if (metrics.openVisibility !== 'hidden' || metrics.open.bottom > 0.1 || !metrics.openInert) {
        issues.push('Open leaked into Home after resize')
      }
      if (metrics.homeActive !== 'true' || metrics.homeInert) {
        issues.push('Home lost active state')
      }
      if (metrics.links.length !== 4 || metrics.overflow || metrics.brokenImages) {
        issues.push('Invalid navigation, viewport overflow, or broken asset')
      }
      if (metrics.fontSize < 16 || metrics.fontSize > 36.1) {
        issues.push('Type outside intended 16–36px range')
      }
      for (const box of [...metrics.links, metrics.welcome]) {
        if (box.left < -0.1 || box.top < -0.1 || box.right > width + 0.1 || box.bottom > height + 0.1) {
          issues.push(`Content clipped: ${box.name || 'welcome'}`)
        }
      }
      for (const box of metrics.links) {
        if (box.width < 44 || box.height < 44) {
          issues.push(`Tap target too small: ${box.name}`)
        }
      }
      const intersect = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5
        && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5
      const boxes = [...metrics.artwork, metrics.welcome]
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          if (intersect(boxes[i], boxes[j])) {
            issues.push(`Visual overlap: ${i}/${j}`)
          }
        }
      }
      results.push({ size: metrics.viewport, fontSize: metrics.fontSize, columns: metrics.columns, issues })
      failures.push(...issues.map((issue) => `${metrics.viewport}: ${issue}`))

      if (captures.has(metrics.viewport)) {
        await page.screenshot({ path: `artifacts/responsive/resize-fixed-${metrics.viewport}.png` })
        captures.delete(metrics.viewport)
      }
    }

    // Change height and layout while the curtain is still travelling.
    for (const opening of [false, true, false, true]) {
      await page.mouse.wheel(0, opening ? 800 : -800)
      await page.waitForTimeout(90)
      await page.setViewportSize(opening ? { width: 1920, height: 1080 } : { width: 390, height: 568 })
      await page.waitForFunction((expected) => {
        const open = document.querySelector('.open-page')
        return open.dataset.moving === 'false' && open.dataset.hidden === String(expected)
      }, opening)
      const state = await page.locator('.open-page').evaluate((element) => ({
        bottom: element.getBoundingClientRect().bottom,
        height: innerHeight,
        hidden: getComputedStyle(element).visibility === 'hidden',
      }))
      if (opening ? !state.hidden || Math.abs(state.bottom) > 0.1 : state.hidden || Math.abs(state.bottom - state.height) > 0.1) {
        failures.push('Incorrect curtain endpoint after resizing mid-animation')
      }
    }

    return { passed: failures.length === 0 && errors.length === 0, results, midAnimationResizes: 4, failures, consoleErrorsOrWarnings: errors }
  } finally {
    page.off('pageerror', onError)
    page.off('console', onConsole)
  }
}
