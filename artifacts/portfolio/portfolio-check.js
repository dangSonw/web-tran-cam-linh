async (page) => {
  const base = 'http://127.0.0.1:4173/'
  const checks = {}
  const errors = []
  const failures = []
  const captures = []
  let entry = 0
  const routes = ['environment', 'arts', 'others']
  const sizes = [[320,480],[360,640],[375,667],[390,844],[430,932],[600,800],[660,740],[768,1024],[820,1180],[844,390],[1024,600],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440],[3440,1440]]
  const onConsole = (message) => {
    if (['warning', 'error'].includes(message.type())) {
      errors.push(message.type() + ': ' + message.text())
    }
  }
  const onError = (error) => errors.push(String(error))
  const onResponse = (response) => {
    if (response.url().startsWith(base) && response.status() >= 400) {
      errors.push(response.status() + ' ' + response.url())
    }
  }
  page.on('console', onConsole)
  page.on('pageerror', onError)
  page.on('response', onResponse)

  async function enter(route) {
    entry += 1
    await page.goto(base + '?qa=' + Date.now() + '-' + entry + '#' + route)
    await page.locator('[data-portfolio-page="' + route + '"]').waitFor({ state: 'visible' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => document.querySelector('.open-page').dataset.hidden === 'true')
  }

  async function capture(name, target) {
    if (target) {
      await page.locator(target).scrollIntoViewIfNeeded()
    }
    await page.waitForTimeout(550)
    const path = 'artifacts/portfolio/' + name + '.png'
    await page.screenshot({ path })
    captures.push(path)
  }

  async function waitImage(locator) {
    await locator.evaluate((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return
      }
      return new Promise((resolve, reject) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', () => reject(new Error(image.src)), { once: true })
      })
    })
  }

  try {
    await page.setViewportSize({ width:1440, height:900 })
    for (const route of routes) {
      await enter(route)
      await page.waitForFunction((id) => document.activeElement?.id === id, route + '-title')
      checks[route + 'DirectRouteAndFocus'] = await page.locator('#' + route + '-title').evaluate((element) => element === document.activeElement)
      checks[route + 'HomeCovered'] = await page.locator('#home').evaluate((element) => element.hasAttribute('inert') && getComputedStyle(element).visibility === 'hidden')
      await page.evaluate(() => { location.hash = 'home' })
      await page.locator('#' + route).waitFor({ state: 'detached' })
      await page.evaluate((hash) => { location.hash = hash }, route)
      await page.locator('[data-portfolio-sign]').waitFor({ state: 'visible' })
      const motion = await page.locator('[data-portfolio-sign]').evaluate((element) => new Promise((resolve) => {
        const samples = []
        function sample() {
          samples.push(element.style.transform)
          if (samples.length < 25) {
            requestAnimationFrame(sample)
          } else {
            resolve(new Set(samples).size)
          }
        }
        requestAnimationFrame(sample)
      }))
      checks[route + 'EntranceRaf'] = motion > 5
      await capture(route + '-desktop-hero')

      for (const [width,height] of sizes) {
        await page.setViewportSize({ width,height })
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        const geometry = await page.locator('#' + route).evaluate((root) => {
          const intro = root.querySelector('.portfolio-hero__intro').getBoundingClientRect()
          const nav = root.querySelector('.portfolio-nav').getBoundingClientRect()
          const open = document.querySelector('.open-page')
          return {
            overflow: root.scrollWidth - root.clientWidth,
            documentOverflow: document.documentElement.scrollWidth - innerWidth,
            introLeft: intro.left,
            introRight: intro.right,
            navRight: nav.right,
            width: innerWidth,
            openHidden: open.dataset.hidden === 'true' && getComputedStyle(open).visibility === 'hidden'
          }
        })
        if (geometry.overflow > 1 || geometry.documentOverflow > 1 || geometry.introLeft < -1 || geometry.introRight > width + 1 || geometry.navRight > width + 1 || !geometry.openHidden) {
          failures.push({ route,width,height,geometry })
        }
      }
      checks[route + 'SeventeenSizesNoOverflowOrOpenLeak'] = !failures.some((failure) => failure.route === route)
      await page.setViewportSize({ width:390, height:844 })
      await capture(route + '-mobile-hero')
      await page.setViewportSize({ width:768, height:1024 })
      await capture(route + '-tablet-hero')
      await page.setViewportSize({ width:1440, height:900 })
      await page.mouse.move(700,600)
      await page.mouse.wheel(0,850)
      await page.waitForTimeout(450)
      checks[route + 'NativeScroll'] = await page.locator('#' + route).evaluate((root) => root.scrollTop > 100)
    }

    await enter('environment')
    const accordion = page.locator('[data-environment-accordion]')
    const buttons = accordion.locator('button[aria-expanded]')
    let accordionCorrect = await buttons.count() === 3
    for (let index=0; index<3; index+=1) {
      await buttons.nth(index).click()
      accordionCorrect = accordionCorrect && await accordion.locator('button[aria-expanded="true"]').count() === 1
      accordionCorrect = accordionCorrect && await buttons.nth(index).getAttribute('aria-expanded') === 'true'
      const panelId = await buttons.nth(index).getAttribute('aria-controls')
      await page.locator('#' + panelId).waitFor({ state:'visible' })
      for (const image of await page.locator('#' + panelId + ' img').all()) {
        await image.scrollIntoViewIfNeeded()
        await waitImage(image)
      }
      await capture('environment-achievement-' + (index+1), '#' + panelId)
    }
    checks.singleExpandedAchievementAllThreePanels = accordionCorrect
    await buttons.nth(0).focus()
    await page.keyboard.press('ArrowDown')
    checks.accordionArrowKeyboard = await buttons.nth(1).evaluate((element) => element === document.activeElement)
    await page.keyboard.press('Enter')
    checks.accordionEnterKeyboard = await buttons.nth(1).getAttribute('aria-expanded') === 'true'

    await buttons.nth(2).click()
    await page.locator('#environment-achievement').evaluate((section) => {
      const root = section.closest('.portfolio-page')
      root.scrollTop = section.offsetTop + 180
    })
    await page.waitForTimeout(150)
    const sticky = await page.locator('#environment-achievement .portfolio-section__heading h2').boundingBox()
    checks.achievementLabelSticky = sticky.y >= 65 && sticky.y <= 110
    await capture('environment-desktop-achievement')
    await page.locator('#environment-projects').scrollIntoViewIfNeeded()
    const stop = await page.locator('#environment-achievement .portfolio-section__heading h2').boundingBox()
    checks.stickyLabelStopsBeforeNextSection = stop.y < 80

    const fadeGalleries = page.locator('[data-fade-sequence] [data-gallery]')
    checks.fourFadeGroups = await fadeGalleries.count() === 4
    for (const gallery of await fadeGalleries.all()) {
      await gallery.scrollIntoViewIfNeeded()
      await page.mouse.move(5,5)
      const id = await gallery.getAttribute('id')
      const first = await gallery.getAttribute('data-index')
      await page.waitForTimeout(5100)
      checks[id + 'AutoFade'] = await gallery.getAttribute('data-index') !== first
      const imageCount = await gallery.locator('[data-gallery-slide]').count()
      for (let index=0; index<imageCount; index+=1) {
        await gallery.getByRole('button', { name: /^Next image/ }).click()
        const activeImage = gallery.locator('[data-gallery-slide][aria-hidden="false"] img')
        await waitImage(activeImage)
      }
      checks[id + 'AllImagesReachable'] = true
      await gallery.getByRole('button', { name: /^Resume / }).click()
      await page.locator('#environment-title').evaluate((element) => element.focus({ preventScroll:true }))
      await page.mouse.move(5,5)
      await page.waitForTimeout(80)
      checks[id + 'Resume'] = await gallery.getAttribute('data-playing') === 'true'
      await gallery.getByRole('button', { name: /^Pause / }).click()
      checks[id + 'Pause'] = await gallery.getAttribute('data-playing') === 'false'
    }
    await capture('environment-desktop-timeline', '[data-fade-sequence="1"]')
    const polygone = page.locator('#environment-polygone-gallery')
    await polygone.scrollIntoViewIfNeeded()
    checks.polygoneFullFiveSlides = await polygone.locator('[data-gallery-slide]').count() === 5
    for (let index=0; index<5; index+=1) {
      await polygone.getByRole('button', { name: /^Next image/ }).click()
      await waitImage(polygone.locator('[aria-hidden="false"] img'))
    }
    await polygone.focus()
    const beforeKey = await polygone.getAttribute('data-index')
    await page.keyboard.press('ArrowRight')
    checks.galleryKeyboard = await polygone.getAttribute('data-index') !== beforeKey
    await capture('environment-desktop-polygone')
    await capture('environment-desktop-intern', '#environment-intern')
    await capture('environment-desktop-research', '#environment-research')

    await enter('arts')
    await capture('arts-desktop-concert', '#arts-viet-nam-tinh-hoa')
    await capture('arts-desktop-exhibition', '#arts-viet-nam-gam-hoa')
    const marquee = page.locator('#arts-hat-artworks')
    await marquee.scrollIntoViewIfNeeded()
    await page.mouse.move(5,5)
    await page.waitForTimeout(180)
    const track = marquee.locator('.portfolio-gallery__track')
    const firstTransform = await track.evaluate((element) => element.style.transform)
    await page.waitForTimeout(600)
    checks.hatRafMoves = await track.evaluate((element) => element.style.transform) !== firstTransform
    checks.hatFullSequenceRepeated = await marquee.locator('.portfolio-gallery__strip').count() === 2
      && await marquee.locator('.portfolio-gallery__strip').first().locator('img').count() === 5
      && await marquee.locator('.portfolio-gallery__strip').last().getAttribute('aria-hidden') === 'true'
    await marquee.getByRole('button', { name:/^Pause / }).click()
    const pausedTransform = await track.evaluate((element) => element.style.transform)
    await page.waitForTimeout(450)
    checks.hatPauseStopsRaf = await track.evaluate((element) => element.style.transform) === pausedTransform
    for (let index=0; index<5; index+=1) {
      await marquee.getByRole('button', { name:/^Next image/ }).click()
    }
    const loopGeometry = await track.evaluate((element) => ({
      offset: -new DOMMatrixReadOnly(getComputedStyle(element).transform).m41,
      width: element.firstElementChild.getBoundingClientRect().width,
      duplicate: element.lastElementChild.getBoundingClientRect().width
    }))
    checks.hatLoopGeometry = Math.abs(loopGeometry.width - loopGeometry.duplicate) < 1 && loopGeometry.offset >= 0 && loopGeometry.offset < loopGeometry.width
    await capture('arts-desktop-hat-t0')
    await marquee.getByRole('button', { name:/^Resume / }).click()
    await page.locator('#arts-title').evaluate((element) => element.focus({ preventScroll:true }))
    await page.mouse.move(5,5)
    await page.waitForTimeout(600)
    await capture('arts-desktop-hat-t1')

    await enter('others')
    await capture('others-desktop-certificates', '.others-achievements')
    checks.threeOtherAchievements = await page.locator('[data-other-achievement]').count() === 3
    const popupPromise = page.waitForEvent('popup')
    await page.locator('.other-achievement__certificate-link').first().click()
    const popup = await popupPromise
    await popup.waitForLoadState('domcontentloaded')
    checks.certificateOpensNewTab = popup.url().endsWith('/images/others/aimo-certificate.png')
    await popup.close()
    await page.bringToFront()

    for (const route of routes) {
      await enter(route)
      await page.setViewportSize({ width:390,height:844 })
      const root = page.locator('#' + route)
      const height = await root.evaluate((element) => element.scrollHeight)
      for (let top=0; top<height; top+=650) {
        await root.evaluate((element, value) => { element.scrollTop = value }, top)
        await page.waitForTimeout(40)
      }
      await page.waitForTimeout(300)
      const badImages = await root.locator('img').evaluateAll((images) => images.filter((image) => getComputedStyle(image).visibility !== 'hidden' && image.getBoundingClientRect().width > 0 && (!image.complete || image.naturalWidth === 0)).map((image) => image.src))
      checks[route + 'ImagesLoaded'] = badImages.length === 0
      if (badImages.length) {
        failures.push({ route,badImages })
      }
      await root.evaluate((element) => { element.scrollTop = 0 })
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      await page.waitForTimeout(100)
      checks[route + 'Text200NoOverflow'] = await root.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)
      await capture(route + '-text-200')
      await page.evaluate(() => { document.documentElement.style.fontSize = '' })
      const target = route === 'environment' ? '#environment-polygone-gallery' : route === 'arts' ? '#arts-hat-artworks' : '.others-achievements'
      await capture(route + '-mobile-content', target)
    }

    await page.setViewportSize({ width:1440,height:900 })
    await enter('environment')
    await page.getByRole('navigation', { name:'Environment navigation' }).getByRole('link', { name:'Art',exact:true }).click()
    await page.locator('#arts').waitFor({ state:'visible' })
    await page.getByRole('navigation', { name:'Art navigation' }).getByRole('link', { name:'Other',exact:true }).click()
    await page.locator('#others').waitFor({ state:'visible' })
    await page.goBack()
    await page.locator('#arts').waitFor({ state:'visible' })
    checks.historyBack = true
    await page.goForward()
    await page.locator('#others').waitFor({ state:'visible' })
    checks.historyForward = true
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    checks.escapeRestoresHomeAndFocus = await page.locator('[data-home-sign="others"]').evaluate((element) => element === document.activeElement)
    await page.locator('[data-home-sign="environment"]').click()
    await page.locator('#environment').waitFor({ state:'visible' })
    await page.getByRole('navigation', { name:'Environment navigation' }).getByRole('link', { name:'Home',exact:true }).click()
    await page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true')
    checks.homeButtonAndSignRoute = true
    checks.localFontLoaded = await page.evaluate(() => document.fonts.check('16px McLaren'))
    checks.zeroConsoleErrorsWarningsOrHttpFailures = errors.length === 0
    return { passed:Object.values(checks).every(Boolean) && failures.length === 0 && errors.length === 0, checks, failures, errors, captures }
  } finally {
    page.off('console',onConsole)
    page.off('pageerror',onError)
    page.off('response',onResponse)
  }
}
