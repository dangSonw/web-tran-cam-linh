import { lazy, Suspense, useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import AboutPage from './components/about/AboutPage'
import HomePage from './components/home/HomePage'
import OpenFrame from './components/OpenFrame'
import { getPortfolioRoute } from './data/portfolioSections'
import { stepSpring } from './lib/motion'

const ArtsPage = lazy(() => import('./components/arts/ArtsPage'))
const EnvironmentPage = lazy(() => import('./components/environment/EnvironmentPage'))
const OthersPage = lazy(() => import('./components/others/OthersPage'))

const INTRO_DURATIONS = Object.freeze({
  backdrop: 700,
  guide: 900,
  paper: 760,
  wordmark: 650,
})

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3
}

function getRotation(element) {
  return Number.parseFloat(element.style.getPropertyValue('--rotation')) || 0
}

function isContentRoute() {
  return getPortfolioRoute() !== 'home'
}

function subscribeToRoute(listener) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

export default function App() {
  const route = useSyncExternalStore(subscribeToRoute, getPortfolioRoute)
  const aboutActive = route === 'about'
  const contentActive = route !== 'home'
  const introRef = useRef(null)
  const animationFrameRef = useRef(0)
  const revealTargetRef = useRef(contentActive || window.location.hash === '#home' ? 1 : 0)
  const requestAnimationRef = useRef(null)

  const revealHome = useCallback(() => {
    revealTargetRef.current = 1
    requestAnimationRef.current?.()
  }, [])

  useEffect(() => {
    const intro = introRef.current
    const home = intro?.parentElement.querySelector('#home')
    const cue = intro?.querySelector('.open-page__cue')
    const homeLinks = home ? [...home.querySelectorAll('a')] : []

    if (!intro || !home || !cue) {
      return undefined
    }

    const startedAt = performance.now()
    const revealState = { value: revealTargetRef.current, velocity: 0 }
    const introElements = [...intro.querySelectorAll('[data-intro]')].map((element) => ({
      element,
      type: element.dataset.intro,
      delay: Number(element.dataset.delay) || 0,
      duration: INTRO_DURATIONS[element.dataset.intro],
      rotation: getRotation(element),
      finished: false,
    }))
    let previousTime = 0

    function animate(time) {
      const elapsed = time - startedAt
      const delta = previousTime === 0 ? 1 / 60 : Math.min((time - previousTime) / 1000, 0.04)
      let introInProgress = false

      previousTime = time

      for (const item of introElements) {
        if (item.finished) {
          continue
        }

        const linearProgress = clamp((elapsed - item.delay) / item.duration, 0, 1)
        const progress = easeOutCubic(linearProgress)
        const remaining = 1 - progress
        const element = item.element

        if (linearProgress < 1) {
          introInProgress = true
        } else {
          item.finished = true
        }

        if (item.type === 'backdrop') {
          element.style.opacity = `${0.72 + progress * 0.28}`
          element.style.filter = `brightness(${0.88 + progress * 0.12})`
        }

        if (item.type === 'guide') {
          element.style.strokeDashoffset = `${remaining}`
        }

        if (item.type === 'paper') {
          element.style.opacity = `${progress}`
          element.style.transform = `translate3d(0, ${-2.2 * remaining}%, 0) rotate(${item.rotation - 2 * remaining}deg)`
        }

        if (item.type === 'wordmark') {
          element.style.opacity = `${progress}`
          element.style.transform = `translate3d(0, ${3 * remaining}%, 0) rotate(${item.rotation}deg)`
        }
      }

      const curtainIsMoving = stepSpring(revealState, revealTargetRef.current, delta, 18, 0.0001)
      const revealProgress = clamp(revealState.value, 0, 1)
      const isCurtainHidden = revealProgress === 1 && !curtainIsMoving
      const isHomeActive = isCurtainHidden && !isContentRoute()
      const isOpenActive = revealProgress === 0 && !curtainIsMoving

      // Percentages follow the curtain's current height, including a resize mid-flight.
      // Hide the settled curtain as well, so fractional pixels cannot leak onto Home.
      intro.style.transform = `translate3d(0, ${-revealProgress * 100}%, 0)`
      intro.dataset.hidden = `${isCurtainHidden}`
      intro.dataset.moving = `${curtainIsMoving}`
      intro.toggleAttribute('inert', !isOpenActive)
      intro.setAttribute('aria-hidden', `${isCurtainHidden}`)
      if (home.dataset.active !== `${isHomeActive}`) {
        home.dataset.active = `${isHomeActive}`
      }
      home.toggleAttribute('inert', !isHomeActive)
      home.style.visibility = isContentRoute() ? 'hidden' : ''
      for (const link of homeLinks) {
        link.tabIndex = isHomeActive ? 0 : -1
      }
      cue.setAttribute('aria-hidden', `${!isOpenActive}`)
      cue.disabled = !isOpenActive

      if (introInProgress || curtainIsMoving) {
        animationFrameRef.current = window.requestAnimationFrame(animate)
      } else {
        animationFrameRef.current = 0
        previousTime = 0
      }
    }

    function requestAnimation() {
      if (animationFrameRef.current === 0) {
        animationFrameRef.current = window.requestAnimationFrame(animate)
      }
    }

    requestAnimationRef.current = requestAnimation

    function handleWheel(event) {
      if (isContentRoute()) {
        return
      }

      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaY) < 6
        || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return
      }

      event.preventDefault()
      revealTargetRef.current = event.deltaY > 0 ? 1 : 0
      requestAnimation()
    }

    let touchStart = null

    function handleTouchStart(event) {
      if (isContentRoute()) {
        touchStart = null
        return
      }

      const touch = event.touches[0]

      if (touch && event.touches.length === 1) {
        touchStart = { x: touch.clientX, y: touch.clientY }
      } else {
        touchStart = null
      }
    }

    function handleTouchEnd(event) {
      if (isContentRoute() || !touchStart) {
        touchStart = null
        return
      }

      const touch = event.changedTouches[0]
      const deltaY = touchStart.y - (touch?.clientY ?? touchStart.y)
      const deltaX = touchStart.x - (touch?.clientX ?? touchStart.x)

      if (Math.abs(deltaY) > 48 && Math.abs(deltaY) > Math.abs(deltaX)) {
        revealTargetRef.current = deltaY > 0 ? 1 : 0
        requestAnimation()
      }

      touchStart = null
    }

    function handleTouchCancel() {
      touchStart = null
    }

    function handleKeyDown(event) {
      if (isContentRoute()) {
        return
      }

      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      const target = event.target
      const isEditable = target instanceof HTMLElement
        && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      const isInteractive = target instanceof Element && target.closest('a, button, input, textarea, select')

      if (isEditable || (isInteractive && event.key !== 'Escape')) {
        return
      }

      const openKeys = ['ArrowDown', 'PageDown', 'End', ' ', 'Spacebar']
      const closeKeys = ['ArrowUp', 'PageUp', 'Home']

      if (openKeys.includes(event.key)) {
        event.preventDefault()
        revealTargetRef.current = 1
        requestAnimation()
      }

      if (closeKeys.includes(event.key)) {
        event.preventDefault()
        revealTargetRef.current = 0
        requestAnimation()
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && isContentRoute()) {
        event.preventDefault()
        window.location.hash = 'home'
        return
      }

      if (event.key === 'Escape' && revealTargetRef.current === 1) {
        revealTargetRef.current = 0
        requestAnimation()
      }
    }

    function handleRouteChange(event) {
      if (isContentRoute() || window.location.hash === '#home') {
        revealTargetRef.current = 1
      }

      requestAnimation()

      const previousHash = event.oldURL.split('#')[1]
      const previousSection = previousHash === 'about-me' ? 'about' : previousHash
      if (['about', 'environment', 'arts', 'others'].includes(previousSection) && !isContentRoute()) {
        window.requestAnimationFrame(() => {
          home.querySelector(`[data-home-sign="${previousSection}"]`)?.focus({ preventScroll: true })
        })
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', handleEscape)
    window.addEventListener('hashchange', handleRouteChange)

    requestAnimation()

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = 0
      requestAnimationRef.current = null
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchCancel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  return (
    <main className="portfolio-shell" data-section={route}>
      <HomePage covered={contentActive} />
      <AboutPage active={aboutActive} />
      <Suspense fallback={<div className="portfolio-route-loading" role="status">Opening this trail…</div>}>
        {route === 'environment' ? <EnvironmentPage active /> : null}
        {route === 'arts' ? <ArtsPage active /> : null}
        {route === 'others' ? <OthersPage active /> : null}
      </Suspense>
      <OpenFrame onOpen={revealHome} rootRef={introRef} />
    </main>
  )
}
