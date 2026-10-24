async (page) => {
  const checks = {}
  const errors = []
  const captures = []
  const base = 'http://127.0.0.1:4173/'
  const onError = (error) => errors.push(String(error))
  const onConsole = (message) => {
    if (['error', 'warning'].includes(message.type())) {
      errors.push(message.type() + ': ' + message.text())
    }
  }
  page.on('pageerror', onError)
  page.on('console', onConsole)
  async function screenshot(name) {
    const path = 'artifacts/portfolio/' + name + '.png'
    await page.screenshot({ path })
    captures.push(path)
  }
  try {
    await page.bringToFront()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(base + '?review-fixes=' + Date.now() + '#environment')
    const gallery = page.locator('#gha-first-meeting-gallery')
    await gallery.scrollIntoViewIfNeeded()
    await gallery.getByRole('button', { name: /^Next image/ }).click()
    const resume = gallery.getByRole('button', { name: /^Resume / })
    await resume.focus()
    const initialIndex = await gallery.getAttribute('data-index')
    await page.keyboard.press('Enter')
    checks.keyboardPlayRetainsButtonFocus = await gallery.locator('.portfolio-gallery__playback').evaluate((button) => document.activeElement === button)
    checks.keyboardPlayImmediatelyRuns = await gallery.getAttribute('data-playing') === 'true'
    await page.waitForTimeout(5100)
    checks.keyboardPlayActuallyAdvancesWithFocus = initialIndex !== await gallery.getAttribute('data-index')
    await screenshot('review-focused-fade-play')
    await gallery.getByRole('button', { name: /^Pause / }).click()
    await gallery.getByRole('button', { name: /^Resume / }).click()
    checks.pointerPlayRunsWhileHovering = await gallery.getAttribute('data-playing') === 'true'
    await gallery.getByRole('button', { name: /^Next image/ }).focus()
    checks.nextFocusInteractionPauses = await gallery.getAttribute('data-playing') === 'false'
    await page.mouse.move(5, 5)
    const contrast = await page.evaluate(() => {
      function luminance(color) {
        const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
          const channel = value / 255
          return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
        })
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
      }
      return ['.environment-timeline__note', '.environment-research', '.environment-achievement__button', '.portfolio-gallery__playback'].map((selector) => {
        const style = getComputedStyle(document.querySelector(selector))
        const foreground = luminance(style.color)
        const background = luminance(style.backgroundColor)
        return { selector, color: style.color, background: style.backgroundColor, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) }
      })
    })
    checks.allReviewedNormalTextPairsAbove45 = contrast.every((pair) => pair.ratio >= 4.5)

    await page.locator('.portfolio-nav a[href="#arts"]').click()
    const hat = page.locator('#arts-hat-artworks')
    await hat.scrollIntoViewIfNeeded()
    await hat.getByRole('button', { name: /^Next image/ }).click()
    await hat.getByRole('button', { name: /^Resume / }).focus()
    await page.keyboard.press('Space')
    await hat.locator('.portfolio-gallery__strip img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const track = hat.locator('.portfolio-gallery__track')
    const start = await track.evaluate((element) => ({ offset: -new DOMMatrixReadOnly(getComputedStyle(element).transform).m41, width: element.firstElementChild.getBoundingClientRect().width, tile: element.firstElementChild.firstElementChild.getBoundingClientRect().width + 12 }))
    await screenshot('review-focused-marquee-t0')
    await page.waitForTimeout(Math.ceil(start.tile * 2 / 32 * 1000) + 900)
    const endOffset = await track.evaluate((element) => -new DOMMatrixReadOnly(getComputedStyle(element).transform).m41)
    const distance = (endOffset - start.offset + start.width) % start.width
    checks.marqueePassesTwoBoundariesWithFocus = distance >= start.tile * 1.95
    checks.marqueeCountTruthfulAfterAutoplay = await hat.locator('.portfolio-gallery__count').innerText() === '5 artworks'
    await screenshot('review-focused-marquee-t1')
    await hat.getByRole('button', { name: /^Next image/ }).click()
    checks.marqueeCountTruthfulAfterManual = await hat.locator('.portfolio-gallery__count').innerText() === '5 artworks'

    const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
    const mobile = await context.newPage()
    mobile.on('pageerror', onError)
    mobile.on('console', onConsole)
    try {
      await mobile.goto(base + '#environment')
      const fade = mobile.locator('#gha-tet-am-ap-gallery')
      await fade.scrollIntoViewIfNeeded()
      await fade.getByRole('button', { name: /^Next image/ }).tap()
      const before = await fade.getAttribute('data-index')
      await fade.getByRole('button', { name: /^Resume / }).tap()
      checks.touchPlayRetainsButtonFocus = await fade.locator('.portfolio-gallery__playback').evaluate((button) => button === document.activeElement)
      checks.touchPlayImmediatelyRuns = await fade.getAttribute('data-playing') === 'true'
      await mobile.waitForTimeout(5100)
      checks.touchPlayActuallyAdvances = before !== await fade.getAttribute('data-index')
      const path = 'artifacts/portfolio/review-touch-play.png'
      await mobile.screenshot({ path })
      captures.push(path)
    } finally {
      await context.close()
    }
    checks.zeroConsoleErrorsOrWarnings = errors.length === 0
    return { passed: Object.values(checks).every(Boolean), checks, contrast, errors, captures }
  } catch (error) {
    return { passed: false, checks, errors: [...errors, String(error)], captures }
  } finally {
    page.off('pageerror', onError)
    page.off('console', onConsole)
  }
}
