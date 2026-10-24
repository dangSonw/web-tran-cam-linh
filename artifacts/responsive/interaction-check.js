async page => {
  const report = {}

  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.open-page__cue')
  await page.waitForTimeout(220)
  await page.getByRole('button', { name: 'Scroll to enter' }).click()
  await page.waitForTimeout(850)
  report.buttonOpensHome = await page.locator('#home').getAttribute('data-active') === 'true'

  await page.mouse.wheel(0, -320)
  await page.waitForTimeout(850)
  report.reverseWheelReturnsToOpen = await page.locator('#home').evaluate((home) => home.hasAttribute('inert'))

  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(850)
  report.arrowDownOpensHome = await page.locator('#home').getAttribute('data-active') === 'true'

  await page.keyboard.press('Escape')
  await page.waitForTimeout(850)
  report.escapeReturnsToOpen = await page.locator('#home').evaluate((home) => home.hasAttribute('inert'))

  await page.evaluate(() => {
    const start = new Touch({
      identifier: 1,
      target: document.body,
      clientX: 200,
      clientY: 680,
    })
    const end = new Touch({
      identifier: 1,
      target: document.body,
      clientX: 200,
      clientY: 540,
    })

    window.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      touches: [start],
      changedTouches: [start],
    }))
    window.dispatchEvent(new TouchEvent('touchend', {
      bubbles: true,
      touches: [],
      changedTouches: [end],
    }))
  })
  await page.waitForTimeout(850)
  report.upwardSwipeOpensHome = await page.locator('#home').getAttribute('data-active') === 'true'

  await page.keyboard.press('Tab')
  await page.waitForTimeout(180)
  report.keyboardFocusVisible = await page.evaluate(() => {
    const element = document.activeElement
    const outline = getComputedStyle(element).outlineStyle

    return element.matches('[data-home-sign]') && outline !== 'none' && outline !== '0px'
  })

  const about = page.locator('.home-navigation--artboard [data-home-sign="about"]')
  await about.hover()
  await page.waitForTimeout(150)
  report.hoverGrowsSign = await about.evaluate((element) => Number.parseFloat(element.style.transform.match(/[\d.]+/)[0]) > 1.04)
  await about.evaluate((element) => element.blur())
  await page.mouse.move(1260, 700)
  await page.waitForTimeout(280)
  report.hoverSpringSettles = await about.evaluate((element) => Number.parseFloat(element.style.transform.match(/[\d.]+/)[0]) < 1.005)

  await about.click()
  report.sectionLinkUpdatesHash = await page.evaluate(() => window.location.hash === '#about-me')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-intro="backdrop"]')
  await page.waitForTimeout(200)
  report.reducedMotionPreferenceDoesNotBlockAutoplay = await page.evaluate(() => {
    const backdrop = document.querySelector('[data-intro="backdrop"]')

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && Number(backdrop.style.opacity) > 0.72
      && Number(backdrop.style.opacity) < 1
  })
  await page.waitForTimeout(1750)
  report.introCompletesWithReducedMotionPreference = await page.evaluate(() => (
    document.querySelector('[data-intro="backdrop"]').style.opacity === '1'
    && document.querySelector('[data-intro="guide"]').style.strokeDashoffset === '0'
  ))

  return JSON.stringify(report)
}
