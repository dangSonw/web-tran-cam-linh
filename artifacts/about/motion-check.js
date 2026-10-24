async (page) => {
  const checks = {}
  const errors = []
  const onError = (error) => errors.push(String(error))
  const onConsole = (message) => {
    if (['error', 'warning'].includes(message.type())) {
      errors.push(message.text())
    }
  }
  page.on('pageerror', onError)
  page.on('console', onConsole)

  async function waitForRest() {
    await page.waitForFunction(() => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-about-hanging]')).transform)
      return Math.abs(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI) < 0.01
    })
  }

  try {
    await page.setViewportSize({ width: 1440, height: 810 })
    await page.goto('http://127.0.0.1:4173/#home')
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    await page.getByRole('link', { name: 'About me', exact: true }).click()
    await page.locator('#about-me').waitFor({ state: 'visible' })
    await page.screenshot({ path: 'artifacts/about/motion-t0.png' })
    await waitForRest()
    await page.screenshot({ path: 'artifacts/about/motion-t1.png' })
    checks.entranceSettles = true

    const hanging = page.locator('[data-about-hanging]')
    const box = await hanging.boundingBox()
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.4)
    await page.waitForFunction(() => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-about-hanging]')).transform)
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI > 0.15
    })
    checks.pointerMovesHangingArtwork = true
    await page.mouse.move(0, 0)
    await waitForRest()
    checks.pointerLeaveSettles = true

    await page.locator('#about-title').focus()
    await page.keyboard.press('Tab')
    checks.resumeHasVisibleKeyboardFocus = await page.locator('.about-resume').evaluate((element) => {
      const style = getComputedStyle(element)
      return element.matches(':focus-visible') && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2
    })

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByRole('link', { name: 'Back to Home' }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    await page.getByRole('link', { name: 'About me', exact: true }).click()
    await page.locator('#about-me').waitFor({ state: 'visible' })
    const frames = await page.evaluate(() => new Promise((resolve) => {
      const samples = []
      function sample() {
        samples.push(getComputedStyle(document.querySelector('[data-about-hanging]')).transform)
        if (samples.length < 20) {
          requestAnimationFrame(sample)
        } else {
          resolve(samples)
        }
      }
      requestAnimationFrame(sample)
    }))
    checks.autoplaysWithReducedMotionPerProjectRules = new Set(frames).size > 5
    await page.emulateMedia({ reducedMotion: 'no-preference' })

    const context = await page.context().browser().newContext({
      viewport: { width: 320, height: 480 },
      hasTouch: true,
      isMobile: true,
    })
    try {
      const mobile = await context.newPage()
      mobile.on('pageerror', onError)
      mobile.on('console', onConsole)
      await mobile.goto('http://127.0.0.1:4173/#about-me')
      await mobile.locator('#about-me').waitFor({ state: 'visible' })
      const cdp = await context.newCDPSession(mobile)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 160, y: 400 }] })
      for (let y = 370; y >= 120; y -= 25) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 160, y }] })
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await mobile.waitForFunction(() => document.querySelector('#about-me').scrollTop > 0)
      checks.touchSwipeScrollsWithoutRevealingOpen = await mobile.locator('.open-page').evaluate((element) => getComputedStyle(element).visibility === 'hidden')
      await cdp.detach()
    } finally {
      await context.close()
    }

    checks.zeroConsoleErrorsOrWarnings = errors.length === 0
    return { passed: Object.values(checks).every(Boolean), checks, errors }
  } finally {
    page.off('pageerror', onError)
    page.off('console', onConsole)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
  }
}
