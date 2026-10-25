import { useEffect } from 'react'

const clamp = (value) => Math.max(0, Math.min(1, value))

// Find the height of the original Figma path at a given horizontal inset.
// Its left cubic runs from (692.5, 18) to (0, 1280.5), translated down 404.
function pathHeightAt(x) {
  let low = 0
  let high = 1
  for (let i = 0; i < 24; i += 1) {
    const t = (low + high) / 2
    const u = 1 - t
    const pointX = u * u * u * 692.5 + 3 * u * u * t * 429.6116
    if (pointX > x) low = t
    else high = t
  }
  const t = (low + high) / 2
  const u = 1 - t
  return 404 + u * u * u * 18 + 3 * u * u * t * 248.0899
    + 3 * u * t * t * 835 + t * t * t * 1280.4998
}

export default function useForestScroll(pageRef, active) {
  useEffect(() => {
    const page = pageRef.current
    if (!active || !page) return undefined
    const scene = page.querySelector('[data-forest-scene]')
    if (!scene) return undefined
    const forest = scene.querySelector('.portfolio-forest')
    const terrain = scene.querySelector('.portfolio-forest__terrain')
    const foliage = [...scene.querySelectorAll('[data-forest-side]')]
    const sign = scene.querySelector('[data-forest-sign]')
    const copies = [...scene.querySelectorAll('[data-forest-copy]')]
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const distances = new Map()
    const copyBounds = new Map()
    let height = 1
    let frame = 0

    function paint() {
      frame = 0
      const progress = clamp(page.scrollTop / height)
      const eased = progress * progress * (3 - 2 * progress)
      scene.dataset.forestProgress = progress.toFixed(4)
      // The sky, grass and path share the page's natural scroll. Keeping their
      // geometry together prevents the meadow separating into rectangular tiles.
      for (const leaf of foliage) {
        leaf.style.transform = preference.matches ? '' : `translate3d(${distances.get(leaf) * eased}px, ${-height * 0.12 * eased}px, 0)`
      }
      if (sign) sign.style.transform = preference.matches ? '' : `translate3d(0, ${-height * 0.2 * eased}px, 0)`
      for (const copy of copies) {
        const bounds = copyBounds.get(copy)
        copy.style.opacity = preference.matches ? '' : String(1 - clamp((page.scrollTop - bounds.top) / bounds.height))
      }
    }

    function requestPaint() {
      if (!frame && !document.hidden) frame = window.requestAnimationFrame(paint)
    }

    function measure() {
      height = scene.offsetHeight
      const sceneBounds = scene.getBoundingClientRect()
      for (const copy of copies) {
        const bounds = copy.getBoundingClientRect()
        copyBounds.set(copy, { top: bounds.top - sceneBounds.top, height: Math.max(1, bounds.height) })
      }
      if (terrain && forest && copies.length) {
        const forestBounds = forest.getBoundingClientRect()
        const firstCopy = copies[0].getBoundingClientRect()
        const terrainWidth = Math.max(forestBounds.width, firstCopy.width / 0.26)
        const terrainLeft = forestBounds.left + (forestBounds.width - terrainWidth) / 2
        // Fit the beige path under the full first line, with breathing room.
        const inset = Math.max(0, (firstCopy.left - terrainLeft - 28) / terrainWidth * 1920)
        const fraction = pathHeightAt(Math.min(692.5, inset)) / 1080
        const copyTop = firstCopy.top - sceneBounds.top - 24
        const terrainHeight = Math.max(height, (height - copyTop + 32) / Math.max(0.1, 1 - fraction))
        terrain.style.height = `${terrainHeight}px`
        terrain.style.top = `${copyTop - fraction * terrainHeight}px`
        terrain.style.width = `${terrainWidth}px`
        terrain.style.left = `${(forestBounds.width - terrainWidth) / 2}px`
      }
      for (const leaf of foliage) {
        leaf.style.transform = ''
        const bounds = leaf.getBoundingClientRect()
        distances.set(leaf, leaf.dataset.forestSide === 'left'
          ? -Math.max(0, bounds.right - sceneBounds.left + 24)
          : Math.max(0, sceneBounds.right - bounds.left + 24))
      }
      paint()
    }

    function onVisibility() {
      window.cancelAnimationFrame(frame)
      frame = 0
      if (!document.hidden) measure()
    }

    page.scrollTop = 0
    measure()
    const observer = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    observer?.observe(scene)
    observer?.observe(page)
    page.addEventListener('scroll', requestPaint, { passive: true })
    scene.addEventListener('load', measure, true)
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    if (preference.addEventListener) preference.addEventListener('change', measure)
    else preference.addListener(measure)

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      page.removeEventListener('scroll', requestPaint)
      scene.removeEventListener('load', measure, true)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', onVisibility)
      if (preference.removeEventListener) preference.removeEventListener('change', measure)
      else preference.removeListener(measure)
      delete scene.dataset.forestProgress
      for (const element of [...foliage, sign, ...copies].filter(Boolean)) {
        element.style.transform = ''
        element.style.opacity = ''
      }
      if (terrain) { terrain.style.height = ''; terrain.style.top = ''; terrain.style.width = ''; terrain.style.left = '' }
    }
  }, [pageRef, active])
}
