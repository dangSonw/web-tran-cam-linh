import { useEffect } from 'react'

const clamp = (value) => Math.max(0, Math.min(1, value))

// Content pages scroll in normal flow. Only About needs a pinned exit, since
// its destination is an empty background rather than a following section.
export default function useForestScroll(pageRef, active) {
  useEffect(() => {
    const page = pageRef.current
    if (!active || !page) return undefined

    const track = page.querySelector('[data-forest-track]')
    const scene = page.querySelector('[data-forest-scene]')
    if (!track || !scene) return undefined

    const foliage = [...scene.querySelectorAll('[data-forest-side]')]
    const rising = [...scene.querySelectorAll('[data-forest-rise]')]
    const sign = scene.querySelector('[data-forest-sign]')
    const copies = [...scene.querySelectorAll('[data-forest-copy]')]
    const nav = page.querySelector('.portfolio-nav')
    const isAbout = page.id === 'about-me'
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const distances = new Map()
    const copyBounds = new Map()
    let readingDistance = 0
    let travel = 1
    let signTravel = 0
    let frame = 0
    let entryFrame = 0

    function paint() {
      frame = 0
      const atAboutEnd = isAbout && page.scrollTop >= page.scrollHeight - page.clientHeight - 1
      const progress = atAboutEnd ? 1 : clamp((page.scrollTop - readingDistance) / travel)
      const eased = progress * progress * (3 - 2 * progress)
      scene.dataset.forestProgress = progress.toFixed(4)

      for (const element of [...foliage, ...rising]) {
        const { x, y } = distances.get(element)
        element.style.transform = preference.matches ? '' : `translate3d(${x * eased}px, ${y * eased}px, 0)`
        element.style.opacity = preference.matches ? String(1 - eased) : ''
      }
      if (sign) {
        sign.style.transform = preference.matches ? '' : `translate3d(0, ${-signTravel * eased}px, 0)`
        sign.style.opacity = preference.matches ? String(1 - eased) : ''
      }
      for (const copy of copies) {
        const bounds = copyBounds.get(copy)
        // On long pages fade a paragraph only as it leaves through the top.
        // Copy below the fold remains readable as the next section enters.
        const copyOpacity = isAbout
          ? 1 - clamp((progress - 0.08) / 0.92)
          : 1 - clamp((page.scrollTop - bounds.top) / bounds.height)
        copy.style.opacity = String(copyOpacity)
        // Faded links must not remain invisible tab stops. Reading backward
        // restores the original tab order without hiding the source text.
        for (const link of copy.querySelectorAll('a')) {
          if (copyOpacity < 0.02) link.setAttribute('tabindex', '-1')
          else link.removeAttribute('tabindex')
        }
        copy.style.pointerEvents = copyOpacity < 0.02 ? 'none' : ''
      }
    }

    function requestPaint() {
      if (!frame && !document.hidden) frame = window.requestAnimationFrame(paint)
    }

    function measure() {
      for (const element of [...foliage, ...rising]) element.style.transform = ''
      if (sign) sign.style.transform = ''
      const navHeight = nav?.offsetHeight || 0
      if (nav) page.style.setProperty('--portfolio-nav-height', `${navHeight}px`)
      const height = scene.offsetHeight
      const availableHeight = Math.max(1, page.clientHeight - navHeight)
      readingDistance = isAbout ? Math.max(0, height - availableHeight) : 0
      travel = isAbout ? Math.max(280, availableHeight * 0.9) : height
      track.style.height = isAbout ? `${height + travel}px` : ''
      scene.style.top = isAbout ? `${-readingDistance}px` : ''
      const sceneBounds = scene.getBoundingClientRect()
      for (const leaf of foliage) {
        const bounds = leaf.getBoundingClientRect()
        const x = leaf.dataset.forestSide === 'left'
          ? -Math.max(0, bounds.right - sceneBounds.left + 24)
          : Math.max(0, sceneBounds.right - bounds.left + 24)
        distances.set(leaf, { x, y: -height * 0.18 })
      }
      for (const element of rising) {
        const bounds = element.getBoundingClientRect()
        // The source path extends beyond its SVG viewport. Keep that natural
        // continuation during the exit instead of exposing a rectangular edge.
        const pathBottom = element.querySelector('path')?.getBoundingClientRect().bottom || bounds.bottom
        distances.set(element, { x: 0, y: -Math.max(0, Math.max(bounds.bottom, pathBottom) - sceneBounds.top + 32) })
      }
      for (const copy of copies) {
        const bounds = copy.getBoundingClientRect()
        copyBounds.set(copy, { top: bounds.top - sceneBounds.top, height: Math.max(1, bounds.height) })
      }
      if (sign) signTravel = Math.max(0, sign.getBoundingClientRect().bottom - sceneBounds.top) + 32
      paint()
    }

    function onVisibility() {
      window.cancelAnimationFrame(frame)
      frame = 0
      if (!document.hidden) measure()
    }

    function resetEntry() {
      window.cancelAnimationFrame(entryFrame)
      entryFrame = window.requestAnimationFrame(() => {
        page.scrollTop = 0
        measure()
      })
    }

    page.scrollTop = 0
    measure()
    // Browser history can restore a nested scroll root after React mounts.
    // Complete the entry reset once the document finishes loading as well.
    if (document.readyState !== 'complete') window.addEventListener('load', resetEntry, { once: true })
    const observer = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    observer?.observe(scene)
    observer?.observe(page)
    if (nav) observer?.observe(nav)
    page.addEventListener('scroll', requestPaint, { passive: true })
    scene.addEventListener('load', measure, true)
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    if (preference.addEventListener) preference.addEventListener('change', measure)
    else preference.addListener(measure)

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(entryFrame)
      observer?.disconnect()
      page.removeEventListener('scroll', requestPaint)
      scene.removeEventListener('load', measure, true)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', resetEntry)
      document.removeEventListener('visibilitychange', onVisibility)
      if (preference.removeEventListener) preference.removeEventListener('change', measure)
      else preference.removeListener(measure)
      track.style.height = ''
      page.style.removeProperty('--portfolio-nav-height')
      scene.style.top = ''
      delete scene.dataset.forestProgress
      for (const element of [...foliage, ...rising, sign, ...copies].filter(Boolean)) {
        element.style.transform = ''
        element.style.opacity = ''
        element.style.pointerEvents = ''
      }
      for (const copy of copies) {
        for (const link of copy.querySelectorAll('a')) link.removeAttribute('tabindex')
      }
    }
  }, [pageRef, active])
}
