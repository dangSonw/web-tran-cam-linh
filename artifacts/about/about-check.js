async (page) => {
  const errors = []
  const checks = {}
  const resizeFailures = []
  const baseUrl = 'http://127.0.0.1:4173/'
  const onError = (error) => errors.push(String(error))
  const onConsole = (message) => {
    if (['warning', 'error'].includes(message.type())) {
      errors.push(message.text())
    }
  }
  const onResponse = (response) => {
    if (response.url().startsWith(baseUrl) && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`)
    }
  }
  page.on('pageerror', onError)
  page.on('console', onConsole)
  page.on('response', onResponse)

  async function settle() {
    await page.evaluate(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    }))
  }

  try {
    await page.setViewportSize({ width: 1440, height: 810 })
    await page.goto(baseUrl)
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('button', { name: 'Scroll to enter' }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    checks.openToHome = await page.locator('#home').isVisible()
    await page.getByRole('link', { name: 'About me', exact: true }).click()
    await page.locator('#about-me').waitFor({ state: 'visible' })

    const samples = await page.evaluate(() => new Promise((resolve) => {
      const values = []
      function sample() {
        values.push(getComputedStyle(document.querySelector('[data-about-hanging]')).transform)
        if (values.length < 32) {
          requestAnimationFrame(sample)
        } else {
          resolve(values)
        }
      }
      requestAnimationFrame(sample)
    }))
    checks.requestAnimationFrameMoves = new Set(samples).size > 8
    checks.aboutHeadingReceivesFocus = await page.locator('#about-title').evaluate((element) => element === document.activeElement)
    checks.homeInertWhileAboutActive = await page.locator('#home').evaluate((element) => element.inert && element.getAttribute('aria-hidden') === 'true')

    await page.goBack()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    checks.historyBackRestoresHome = await page.locator('[data-home-sign="about"]').evaluate((element) => element === document.activeElement)
    await page.goForward()
    await page.locator('#about-me').waitFor({ state: 'visible' })
    checks.historyForwardRestoresAbout = await page.locator('#about-me').isVisible()
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    await page.waitForFunction(() => document.activeElement === document.querySelector('[data-home-sign="about"]'))
    await page.keyboard.press('Enter')
    await page.locator('#about-me').waitFor({ state: 'visible' })
    checks.escapeAndKeyboardReentry = await page.locator('#about-me').isVisible()

    const sizes = [
      [320, 480], [320, 568], [360, 640], [375, 667], [390, 844],
      [412, 915], [568, 320], [844, 390], [759, 900], [760, 900],
      [768, 1024], [1024, 768], [1280, 720], [1440, 900], [1920, 1080],
      [2560, 1440], [3440, 1440], [1920, 300], [390, 844], [1920, 1080],
    ]
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height })
      await page.locator('#about-me').evaluate((element) => { element.scrollTop = 0 })
      await settle()
      const issue = await page.evaluate(() => {
        const about = document.querySelector('#about-me')
        const open = document.querySelector('.open-page')
        const boxes = ['.about-hanging', '.about-greeting', '.about-biography', '.about-resume'].map((selector) => about.querySelector(selector).getBoundingClientRect())
        const portrait = about.querySelector('.about-portrait').getBoundingClientRect()
        return about.scrollWidth > about.clientWidth + 1
          || getComputedStyle(open).visibility !== 'hidden'
          || open.getBoundingClientRect().bottom > 0.5
          || boxes.some((box) => box.left < -0.5 || box.right > innerWidth + 0.5)
          || portrait.bottom > boxes[1].top + 0.5
          || boxes[1].bottom > boxes[2].top + 0.5
          || boxes[2].bottom > boxes[3].top + 0.5
      })
      if (issue) {
        resizeFailures.push({ width, height })
      }
    }
    checks.resize20SizesWithoutOverflowOrOpenLeak = resizeFailures.length === 0

    for (const [width, height, name] of [
      [1920, 1080, 'desktop'], [1440, 810, 'laptop'],
      [768, 1024, 'tablet'], [390, 844, 'mobile'], [844, 390, 'landscape'],
    ]) {
      await page.setViewportSize({ width, height })
      await page.locator('#about-me').evaluate((element) => { element.scrollTop = 0 })
      await settle()
      await page.screenshot({ path: `artifacts/about/${name}.png` })
    }

    await page.setViewportSize({ width: 320, height: 480 })
    await page.mouse.move(160, 300)
    await page.mouse.wheel(0, 800)
    await page.waitForFunction(() => document.querySelector('#about-me').scrollTop > 0)
    checks.nativeWheelScrollsAbout = await page.locator('.open-page').evaluate((element) => getComputedStyle(element).visibility === 'hidden')
    await page.getByRole('link', { name: 'View resumé (opens in a new tab)' }).scrollIntoViewIfNeeded()
    checks.resumeReachableOnShortScreen = await page.locator('.about-resume').evaluate((element) => {
      const box = element.getBoundingClientRect()
      return box.top >= 0 && box.bottom <= innerHeight && box.height >= 44
    })

    await page.context().route('https://drive.google.com/**', async (route) => {
      await route.fulfill({ contentType: 'text/html', body: '<title>Resumé navigation check</title>' })
    })
    const popupPromise = page.waitForEvent('popup')
    await page.locator('.about-resume').click()
    const popup = await popupPromise
    await popup.waitForLoadState('domcontentloaded')
    checks.resumeOpensConfiguredUrlInNewTab = popup.url() === 'https://drive.google.com/file/d/1JWuDqlU5EpR0llFK-OCUFfjW0kKleWaU/view?usp=sharing'
    await popup.close()
    await page.context().unroute('https://drive.google.com/**')

    await page.evaluate(() => { document.documentElement.style.fontSize = '32px' })
    await page.locator('.about-resume').scrollIntoViewIfNeeded()
    checks.textAt200PercentReachable = await page.locator('#about-me').evaluate((element) => element.scrollWidth <= element.clientWidth + 1)
    await page.screenshot({ path: 'artifacts/about/text-200-percent.png' })
    await page.evaluate(() => { document.documentElement.style.fontSize = '' })

    await page.goto(`${baseUrl}#about-me`)
    await page.locator('#about-me').waitFor({ state: 'visible' })
    await page.waitForFunction(() => document.querySelector('.open-page').dataset.hidden === 'true')
    checks.directAboutLink = await page.locator('#about-me').isVisible()
    await page.reload()
    await page.locator('#about-me').waitFor({ state: 'visible' })
    await page.getByRole('link', { name: 'Back to Home' }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    checks.homeButton = await page.locator('#about-me').isHidden()
    await page.reload()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    checks.directHomeLink = await page.locator('#about-me').isHidden()

    const mobileContext = await page.context().browser().newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    })
    try {
      const mobile = await mobileContext.newPage()
      mobile.on('pageerror', onError)
      mobile.on('console', onConsole)
      await mobile.goto(`${baseUrl}#home`)
      await mobile.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
      await mobile.getByRole('link', { name: 'About me', exact: true }).tap()
      await mobile.locator('#about-me').waitFor({ state: 'visible' })
      await mobile.evaluate(() => document.fonts.ready)
      await mobile.screenshot({ path: 'artifacts/about/mobile-dpr2.png' })
      await mobile.getByRole('link', { name: 'Back to Home' }).tap()
      await mobile.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
      checks.mobileDpr2TapNavigation = true
    } finally {
      await mobileContext.close()
    }

    checks.allHtmlImagesLoaded = await page.evaluate(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
    checks.zeroConsoleErrorsOrWarnings = errors.length === 0
    return { passed: Object.values(checks).every(Boolean), checks, resizeFailures, errors }
  } finally {
    page.off('pageerror', onError)
    page.off('console', onConsole)
    page.off('response', onResponse)
  }
}
