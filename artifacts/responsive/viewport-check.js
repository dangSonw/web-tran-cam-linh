async page => {
  const viewports = [
    { name: 'desktop-1920x1080', width: 1920, height: 1080 },
    { name: 'laptop-1440x900', width: 1440, height: 900 },
    { name: 'tablet-landscape-1024x768', width: 1024, height: 768 },
    { name: 'tablet-portrait-768x1024', width: 768, height: 1024 },
    { name: 'mobile-412x915', width: 412, height: 915 },
    { name: 'mobile-390x844', width: 390, height: 844 },
    { name: 'small-mobile-320x568', width: 320, height: 568 },
    { name: 'mobile-landscape-844x390', width: 844, height: 390 },
  ]
  const reports = []

  await page.emulateMedia({ reducedMotion: 'no-preference' })

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-intro-screen]')

    const t0 = await page.evaluate(() => {
      const backdrop = document.querySelector('[data-intro="backdrop"]')
      const guide = document.querySelector('[data-intro="guide"]')

      return {
        opacity: Number(getComputedStyle(backdrop).opacity),
        dashOffset: Number(guide.style.strokeDashoffset || 1),
      }
    })

    await page.waitForTimeout(180)

    const t1 = await page.evaluate(() => {
      const backdrop = document.querySelector('[data-intro="backdrop"]')
      const guide = document.querySelector('[data-intro="guide"]')

      return {
        opacity: Number(getComputedStyle(backdrop).opacity),
        dashOffset: Number(guide.style.strokeDashoffset || 1),
      }
    })

    await page.waitForTimeout(1750)

    await page.screenshot({
      path: `D:/Web/web-tran-cam-linh-folio/artifacts/responsive/open-${viewport.name}.png`,
      scale: 'css',
    })

    await page.mouse.wheel(0, 320)
    await page.waitForTimeout(900)

    const home = await page.evaluate(() => {
      const width = window.innerWidth
      const height = window.innerHeight
      const root = document.documentElement
      const visibleNavigation = [...document.querySelectorAll('.home-navigation')]
        .filter((navigation) => getComputedStyle(navigation).display !== 'none')
      const signs = visibleNavigation.flatMap((navigation) => [...navigation.querySelectorAll('[data-home-sign]')])
      const signBoxes = signs.map((sign) => {
        const rect = sign.getBoundingClientRect()

        return {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        }
      })
      const welcome = document.querySelector('.home-welcome')
      const welcomeRect = welcome.getBoundingClientRect()
      const layers = [...document.querySelectorAll('.home-scene__layer')]
      const linksInBounds = signBoxes.every((box) => (
        box.x >= -2
        && box.y >= -24
        && box.x + box.width <= width + 2
        && box.y + box.height <= height + 2
      ))
      const noHorizontalOverlap = signBoxes.every((box, index) => signBoxes.slice(index + 1).every((other) => (
        box.x + box.width <= other.x
        || other.x + other.width <= box.x
        || box.y + box.height <= other.y
        || other.y + other.height <= box.y
      )))

      return {
        active: document.querySelector('#home').dataset.active === 'true',
        viewport: [width, height],
        document: [root.scrollWidth, root.scrollHeight],
        noDocumentOverflow: root.scrollWidth <= width && root.scrollHeight <= height,
        visibleSigns: signs.length,
        linksInBounds,
        noSignOverlap: noHorizontalOverlap,
        signBoxes,
        welcome: {
          x: Math.round(welcomeRect.x),
          y: Math.round(welcomeRect.y),
          width: Math.round(welcomeRect.width),
          height: Math.round(welcomeRect.height),
          contentFits: welcome.scrollWidth <= welcome.clientWidth,
          insideViewport: welcomeRect.left >= -1 && welcomeRect.right <= width + 1,
        },
        allLayersLoaded: layers.length === 23 && layers.every((image) => image.complete && image.naturalWidth > 0),
        brokenLayers: layers.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.dataset.layerId),
        mclarenLoaded: document.fonts.check('20px McLaren'),
      }
    })

    await page.screenshot({
      path: `D:/Web/web-tran-cam-linh-folio/artifacts/responsive/home-${viewport.name}.png`,
      scale: 'css',
    })

    reports.push({
      name: viewport.name,
      intro: {
        t0,
        t1,
        animated: t1.opacity !== t0.opacity || t1.dashOffset < t0.dashOffset,
        finished: await page.evaluate(() => document.querySelector('[data-intro="backdrop"]').style.opacity === '1'),
      },
      home,
    })
  }

  return JSON.stringify(reports)
}
