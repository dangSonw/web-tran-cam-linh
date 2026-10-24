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
  const waitHome = () => page.waitForFunction(() => document.querySelector('#home').dataset.active === 'true', undefined, { timeout: 8000 })
  const waitOpen = () => page.waitForFunction(() => {
    const open = document.querySelector('.open-page')
    return open.dataset.moving === 'false' && open.dataset.hidden === 'false'
  }, undefined, { timeout: 8000 })

  try {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('http://127.0.0.1:5173/')
    await page.waitForTimeout(180)
    const introStart = await page.locator('[data-intro="backdrop"]').evaluate((element) => Number(element.style.opacity))
    await page.waitForTimeout(1700)
    const introEnd = await page.locator('[data-intro="backdrop"]').evaluate((element) => Number(element.style.opacity))
    checks.introAutoplays = introStart > 0.72 && introStart < 1 && introEnd === 1
    await page.screenshot({ path: 'artifacts/responsive/motion-t0-open.png' })

    await page.evaluate(() => {
      window.__curtainFrames = { samples: [], done: false }
      const started = performance.now()
      let moved = false
      const open = document.querySelector('.open-page')
      function sample(time) {
        const progress = -Number.parseFloat(open.style.transform.split(',')[1]) / 100
        moved ||= open.dataset.moving === 'true'
        window.__curtainFrames.samples.push({ time, progress })
        if ((moved && open.dataset.moving === 'false') || time - started > 1800) {
          window.__curtainFrames.done = true
        } else {
          requestAnimationFrame(sample)
        }
      }
      requestAnimationFrame(sample)
    })
    await page.getByRole('button', { name: 'Scroll to enter' }).click()
    await page.waitForTimeout(150)
    await page.screenshot({ path: 'artifacts/responsive/motion-t1-reveal.png' })
    await waitHome()
    await page.waitForFunction(() => window.__curtainFrames.done)
    const timing = await page.evaluate(() => {
      const samples = window.__curtainFrames.samples
      const active = samples.filter((sample) => sample.progress > 0 && sample.progress < 1)
      const intervals = samples.slice(1).map((sample, index) => sample.time - samples[index].time).sort((a, b) => a - b)
      return {
        frames: active.length,
        p95FrameMs: Math.round(intervals[Math.floor(intervals.length * 0.95)] * 100) / 100,
        bounded: samples.every((sample) => sample.progress >= 0 && sample.progress <= 1),
        monotonic: samples.every((sample, index) => index === 0 || sample.progress >= samples[index - 1].progress),
        endpoint: samples.at(-1).progress,
      }
    })
    checks.curtainUsesContinuousFrames = timing.frames > 12 && timing.bounded && timing.monotonic && timing.endpoint === 1
    checks.buttonOpensHome = true

    const about = page.locator('[data-home-sign="about"]')
    const scale = () => about.locator('img').evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)
    const initialBounds = await about.boundingBox()
    await about.hover()
    await page.waitForTimeout(100)
    const midScale = await scale()
    await page.waitForTimeout(450)
    const endScale = await scale()
    checks.hoverAnimatesSmoothly = midScale > 1 && midScale < endScale && Math.abs(endScale - 1.045) < 0.001
    checks.hitAreaDoesNotMove = JSON.stringify(initialBounds) === JSON.stringify(await about.boundingBox())
    await page.mouse.move(1270, 710)
    await page.waitForTimeout(550)
    checks.hoverSettlesExactly = await scale() === 1

    await page.keyboard.press('Tab')
    checks.keyboardFocusVisible = await about.evaluate((element) => element === document.activeElement && getComputedStyle(element).outlineStyle !== 'none')
    await page.setViewportSize({ width: 390, height: 844 })
    checks.focusSurvivesResponsiveReflow = await about.evaluate((element) => element === document.activeElement)
    await page.waitForTimeout(550)
    checks.focusKeepsFeedback = Math.abs(await scale() - 1.045) < 0.001
    await page.keyboard.press('Enter')
    checks.linkActivation = await page.evaluate(() => location.hash === '#about-me')
    await page.keyboard.press('Escape')
    await waitOpen()
    checks.escapeClosesFromFocusedLink = true
    await page.keyboard.press('ArrowDown')
    await waitHome()
    checks.keyboardOpensHome = true
    await page.mouse.move(195, 700)
    await page.mouse.wheel(0, -600)
    await waitOpen()
    checks.reverseWheelCloses = true

    // Reverse before either endpoint is reached, then finish opening.
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(110)
    await page.mouse.wheel(0, -600)
    await page.waitForTimeout(90)
    await page.mouse.wheel(0, 600)
    await waitHome()
    checks.rapidReversalSettles = await page.locator('.open-page').evaluate((element) => getComputedStyle(element).visibility === 'hidden')

    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 })
    const swipe = async (start, end) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: start }] })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: end }] })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    }
    await swipe(400, 650)
    await waitOpen()
    await swipe(650, 400)
    await waitHome()
    checks.chromeTouchSwipesBothDirections = true
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.mouse.wheel(0, -600)
    await waitOpen()
    await page.mouse.wheel(0, 600)
    await waitHome()
    checks.transitionCompletesWith4xCpuThrottle = true
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
    await cdp.detach()

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await page.waitForTimeout(200)
    checks.autoplayRemainsEnabledAsRequested = await page.locator('[data-intro="backdrop"]').evaluate((element) => Number(element.style.opacity) > 0.72 && Number(element.style.opacity) < 1)
    await page.getByRole('button', { name: 'Scroll to enter' }).click()
    await waitHome()
    checks.reducedMotionPreferenceDoesNotBlockNavigation = true
    await page.emulateMedia({ reducedMotion: 'no-preference' })

    return { passed: Object.values(checks).every(Boolean) && errors.length === 0, checks, timing, consoleErrorsOrWarnings: errors, touchEvidence: 'Chrome CDP synthesized touch, not physical hardware' }
  } catch (error) {
    return { passed: false, checks, failure: String(error), consoleErrorsOrWarnings: errors }
  } finally {
    page.off('pageerror', onError)
    page.off('console', onConsole)
  }
}
