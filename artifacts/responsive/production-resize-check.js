async (page) => {
  const errors = []
  const checks = {}
  const onError = (error) => errors.push(String(error))
  const onConsole = (message) => {
    if (['error', 'warning'].includes(message.type())) {
      errors.push(message.text())
    }
  }
  page.on('pageerror', onError)
  page.on('console', onConsole)

  try {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('http://127.0.0.1:4173/')
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('button', { name: 'Scroll to enter' }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    await page.mouse.move(0, 0)

    const resizeFailures = []
    for (let step = 0; step <= 48; step += 1) {
      const width = Math.round(320 + step * 1600 / 48)
      const height = Math.round(400 + 680 * (0.5 + Math.sin(step * 0.7) * 0.5))
      await page.setViewportSize({ width, height })
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const issue = await page.evaluate(() => {
        const open = document.querySelector('.open-page')
        const welcome = document.querySelector('.home-welcome').getBoundingClientRect()
        const signs = [...document.querySelectorAll('.home-sign')].map((element) => element.getBoundingClientRect())
        return getComputedStyle(open).visibility !== 'hidden'
          || open.getBoundingClientRect().bottom > 0.1
          || document.querySelector('#home').inert
          || welcome.bottom > innerHeight + 0.1
          || signs.some((box) => box.bottom >= welcome.top || box.left < 0 || box.right > innerWidth)
      })
      if (issue) {
        resizeFailures.push({ width, height })
      }
    }
    checks.continuousResize49Steps = resizeFailures.length === 0

    await page.setViewportSize({ width: 320, height: 568 })
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px' })
    checks.textAt200PercentFits = await page.locator('.home-welcome').evaluate((element) => {
      const box = element.getBoundingClientRect()
      const signs = [...document.querySelectorAll('.home-sign')].map((sign) => sign.getBoundingClientRect())
      return box.left >= 0 && box.right <= innerWidth && box.bottom <= innerHeight
        && signs.every((sign) => sign.bottom < box.top && sign.height >= 44)
    })
    await page.screenshot({ path: 'artifacts/responsive/production-text-200-percent.png' })
    await page.evaluate(() => { document.documentElement.style.fontSize = '' })

    const highDpiContext = await page.context().browser().newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    try {
      const highDpiPage = await highDpiContext.newPage()
      highDpiPage.on('pageerror', onError)
      highDpiPage.on('console', onConsole)
      await highDpiPage.goto('http://127.0.0.1:4173/')
      await highDpiPage.getByRole('button', { name: 'Scroll to enter' }).tap()
      await highDpiPage.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
      await highDpiPage.evaluate(() => document.fonts.ready)
      await highDpiPage.screenshot({ path: 'artifacts/responsive/production-home-mobile-dpr2.png' })
      await highDpiPage.setViewportSize({ width: 1920, height: 1080 })
      checks.highDpiHasNoCurtainLeak = await highDpiPage.locator('.open-page').evaluate((element) => window.devicePixelRatio === 2 && element.getBoundingClientRect().bottom === 0 && getComputedStyle(element).visibility === 'hidden')
      checks.touchCanActivateSection = await highDpiPage.locator('[data-home-sign="arts"]').evaluate((element) => !element.closest('[inert]'))
      await highDpiPage.locator('[data-home-sign="arts"]').tap()
      checks.touchCanActivateSection &&= await highDpiPage.evaluate(() => location.hash === '#arts')
    } finally {
      await highDpiContext.close()
    }

    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.screenshot({ path: 'artifacts/responsive/production-home-desktop-final.png' })
    checks.allAssetsLoaded = await page.evaluate(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
    checks.oneNavigationWithFourLinks = await page.locator('nav').count() === 1 && await page.locator('nav a').count() === 4
    await page.mouse.move(960, 700)
    await page.mouse.wheel(0, -700)
    await page.waitForFunction(() => document.querySelector('.open-page').dataset.moving === 'false' && document.querySelector('.open-page').dataset.hidden === 'false')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('button', { name: 'Scroll to enter' }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    await page.setViewportSize({ width: 1920, height: 1080 })
    checks.smallToLargeAfterReturningToOpen = await page.locator('.open-page').evaluate((element) => element.getBoundingClientRect().bottom === 0 && getComputedStyle(element).visibility === 'hidden')

    return { passed: Object.values(checks).every(Boolean) && errors.length === 0, checks, resizeFailures, consoleErrorsOrWarnings: errors }
  } catch (error) {
    return { passed: false, checks, failure: String(error), consoleErrorsOrWarnings: errors }
  } finally {
    page.off('pageerror', onError)
    page.off('console', onConsole)
  }
}
