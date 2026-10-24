async (page) => {
  const checks = {}
  const errors = []
  const base = 'http://127.0.0.1:4173/'
  const reportError = (error) => errors.push(String(error))
  const reportConsole = (message) => {
    if (['warning', 'error'].includes(message.type())) {
      errors.push(message.type() + ': ' + message.text())
    }
  }
  page.on('pageerror', reportError)
  page.on('console', reportConsole)
  try {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(base + '#environment')
    const paths = page.locator('[data-timeline-paths]')
    await page.waitForFunction(() => document.querySelector('[data-timeline-paths]')?.dataset.timelinePaths === '7')
    checks.timelineSevenDesktopConnectors = await paths.locator('path').count() === 7
    const desktopGeometry = await paths.getAttribute('viewBox')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForFunction(() => document.querySelector('[data-timeline-paths]')?.dataset.timelinePaths === '1')
    checks.timelineMobilePathAndResize = await paths.locator('path').count() === 1 && desktopGeometry !== await paths.getAttribute('viewBox')
    checks.timelineFiniteCoordinates = await paths.evaluate((svg) => !/NaN|Infinity/.test(svg.outerHTML))
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    await page.waitForTimeout(150)
    checks.environmentRealText200Fits = await page.locator('#environment').evaluate((root) => root.scrollWidth <= root.clientWidth + 1)
    await page.evaluate(() => { document.documentElement.style.fontSize = '' })

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(base + '#arts')
    const gallery = page.locator('#arts-hat-artworks')
    await gallery.scrollIntoViewIfNeeded()
    await page.mouse.move(5, 5)
    await page.locator('#arts-title').evaluate((heading) => heading.focus({ preventScroll: true }))
    await page.waitForFunction(() => document.querySelector('#arts-hat-artworks')?.dataset.playing === 'true')
    const track = gallery.locator('.portfolio-gallery__track')
    const first = await track.getAttribute('style')
    await page.waitForTimeout(400)
    checks.marqueeRunsInViewport = first !== await track.getAttribute('style')
    await page.locator('#arts').evaluate((root) => { root.scrollTop = 0 })
    await page.waitForTimeout(120)
    const offscreen = await track.getAttribute('style')
    await page.waitForTimeout(350)
    checks.offscreenMarqueeStops = offscreen === await track.getAttribute('style')
    await gallery.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => document.querySelector('#arts-hat-artworks')?.dataset.playing === 'true')
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await page.waitForTimeout(100)
    const hidden = await track.getAttribute('style')
    await page.waitForTimeout(350)
    checks.hiddenDocumentStopsMarquee = hidden === await track.getAttribute('style')
    await page.evaluate(() => {
      delete document.hidden
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await page.waitForTimeout(350)
    checks.visibleDocumentResumesMarquee = hidden !== await track.getAttribute('style')
    await page.locator('.portfolio-nav__home').click()
    checks.routeUnmountsGallery = await page.locator('#arts-hat-artworks').count() === 0

    const browser = page.context().browser()
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
    await context.addInitScript(() => {
      delete window.ResizeObserver
      delete window.IntersectionObserver
    })
    const mobile = await context.newPage()
    mobile.on('pageerror', reportError)
    mobile.on('console', reportConsole)
    try {
      await mobile.goto(base + '#environment')
      await mobile.locator('#environment-title').waitFor({ state: 'attached' })
      checks.observerApisActuallyAbsent = await mobile.evaluate(() => !('ResizeObserver' in window) && !('IntersectionObserver' in window))
      const accordion = mobile.locator('.environment-achievement__button').nth(1)
      await accordion.tap()
      checks.fallbackMobileTouchAccordion = await accordion.getAttribute('aria-expanded') === 'true'
      const slides = mobile.locator('#environment-polygone-gallery')
      await slides.scrollIntoViewIfNeeded()
      const before = await slides.getAttribute('data-index')
      await slides.getByRole('button', { name: /next/i }).tap()
      checks.fallbackMobileGallery = before !== await slides.getAttribute('data-index')
      await mobile.locator('.portfolio-nav a[href="#arts"]').tap()
      const hat = mobile.locator('#arts-hat-artworks')
      await hat.scrollIntoViewIfNeeded()
      await mobile.locator('#arts-title').evaluate((heading) => heading.focus({ preventScroll: true }))
      const fallbackTrack = hat.locator('.portfolio-gallery__track')
      const initial = await fallbackTrack.getAttribute('style')
      await mobile.waitForTimeout(400)
      checks.fallbackAutoplayWithReducedMotion = initial !== await fallbackTrack.getAttribute('style')
      await mobile.locator('.portfolio-nav a[href="#others"]').tap()
      await mobile.locator('#others').waitFor({ state: 'visible' })
      checks.mobileDpr2AllRoutes = await mobile.locator('[data-other-achievement]').count() === 3 && await mobile.evaluate(() => devicePixelRatio) === 2
    } finally {
      await context.close()
    }
    checks.zeroRuntimeErrors = errors.length === 0
    return { passed: Object.values(checks).every(Boolean), checks, errors }
  } catch (error) {
    return { passed: false, checks, errors: [...errors, String(error)] }
  } finally {
    page.off('pageerror', reportError)
    page.off('console', reportConsole)
  }
}
