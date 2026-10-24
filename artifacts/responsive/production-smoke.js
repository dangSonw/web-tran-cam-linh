async page => {
  const report = {}

  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-intro-screen]')
  await page.waitForTimeout(1850)

  report.desktop = await page.evaluate(() => {
    const intro = document.querySelector('[data-intro-screen]')
    const images = [...document.querySelectorAll('img')]

    return {
      title: document.title,
      viewport: [window.innerWidth, window.innerHeight],
      introFinished: document.querySelector('[data-intro="backdrop"]').style.opacity === '1'
        && document.querySelector('[data-intro="guide"]').style.strokeDashoffset === '0',
      imagesLoaded: images.length === 36 && images.every((image) => image.complete && image.naturalWidth > 0),
      brokenImages: images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc),
      noDocumentOverflow: document.documentElement.scrollWidth <= window.innerWidth
        && document.documentElement.scrollHeight <= window.innerHeight,
      openTransform: intro.style.transform,
    }
  })

  await page.screenshot({
    path: 'D:/Web/web-tran-cam-linh-folio/artifacts/responsive/production-open-1920x1080.png',
    scale: 'css',
  })

  await page.mouse.wheel(0, 320)
  await page.waitForTimeout(900)
  report.desktop.homeActive = await page.locator('#home').getAttribute('data-active') === 'true'
  await page.screenshot({
    path: 'D:/Web/web-tran-cam-linh-folio/artifacts/responsive/production-home-1920x1080.png',
    scale: 'css',
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(180)
  report.mobile = await page.evaluate(() => {
    const visibleNav = [...document.querySelectorAll('.home-navigation')]
      .find((navigation) => getComputedStyle(navigation).display !== 'none')
    const signs = [...visibleNav.querySelectorAll('[data-home-sign]')]
    const text = document.querySelector('.home-welcome')

    return {
      viewport: [window.innerWidth, window.innerHeight],
      visibleSigns: signs.length,
      signTargetsLargeEnough: signs.every((sign) => {
        const rect = sign.getBoundingClientRect()

        return rect.width >= 44 && rect.height >= 44
      }),
      welcomeFits: text.scrollWidth <= text.clientWidth,
      noDocumentOverflow: document.documentElement.scrollWidth <= window.innerWidth
        && document.documentElement.scrollHeight <= window.innerHeight,
    }
  })
  await page.screenshot({
    path: 'D:/Web/web-tran-cam-linh-folio/artifacts/responsive/production-home-390x844.png',
    scale: 'css',
  })

  return JSON.stringify(report)
}
