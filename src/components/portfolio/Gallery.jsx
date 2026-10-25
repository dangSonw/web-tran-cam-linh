import { useEffect, useRef, useState } from 'react'
import './Gallery.css'

const EMPTY_IMAGES = []
// CSS pixels per second; previously 18. Positive values move the strip right.
const CONTINUOUS_SPEED_PX_PER_SECOND = 23
// One normalized wheel pixel moves the images by one CSS pixel.
const WHEEL_SCROLL_MULTIPLIER = 1

function wrap(value, length) {
  return ((value % length) + length) % length
}

function Arrow({ direction }) {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d={direction === 'previous' ? 'm14 5-7 7 7 7M7 12h13' : 'm10 5 7 7-7 7M4 12h13'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function PlaybackIcon({ paused }) {
  return (
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
      <path d={paused ? 'M8 4v16l12-8L8 4Z' : 'M6 4h4v16H6V4Zm8 0h4v16h-4V4Z'} />
    </svg>
  )
}

function ContinuousGallery({ id, label, images = EMPTY_IMAGES, className = '' }) {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const firstImage = images[0]
  const ratio = firstImage?.width && firstImage?.height ? firstImage.height / firstImage.width : 2 / 3

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return undefined

    const viewport = root.querySelector('.portfolio-gallery__window')
    const group = track.firstElementChild
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const state = { offset: 0, width: 0, visible: false, hovered: false, focused: false, touch: null, reduced: preference.matches }
    let frame = 0
    let previous = 0

    function paint() {
      // Start at the identical second strip; increasing x moves every image right.
      track.style.transform = state.reduced ? '' : `translate3d(${state.offset - state.width}px, 0, 0)`
    }

    function animate(time) {
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0
      previous = time
      if (state.width > 0) {
        state.offset = wrap(state.offset + delta * CONTINUOUS_SPEED_PX_PER_SECOND, state.width)
        paint()
      }
      frame = window.requestAnimationFrame(animate)
    }

    function updatePlayback() {
      const playing = images.length > 1 && state.visible && !document.hidden
        && !state.reduced && !state.hovered && !state.focused && !state.touch
      root.dataset.playing = String(playing)
      if (playing && !frame) frame = window.requestAnimationFrame(animate)
      if (!playing) {
        window.cancelAnimationFrame(frame)
        frame = 0
        previous = 0
      }
    }

    function measure() {
      const width = viewport.clientWidth
      root.style.setProperty('--gallery-width', `${width}px`)
      root.style.setProperty('--gallery-height', `${width * Math.min(1.3, Math.max(0.42, ratio))}px`)
      const groupWidth = group.getBoundingClientRect().width
      state.offset = state.width > 0 ? state.offset / state.width * groupWidth : 0
      state.width = groupWidth
      paint()
    }

    function updatePreference(event) {
      state.reduced = event?.matches ?? preference.matches
      root.dataset.reducedMotion = String(state.reduced)
      viewport.scrollLeft = 0
      measure()
      updatePlayback()
    }

    function isInViewport(target) {
      // Gaps and the seam between repeated strips belong to the gallery too.
      return target instanceof Node && viewport.contains(target)
    }

    function onPointerOver(event) {
      if (event.pointerType === 'touch') return
      state.hovered = isInViewport(event.target)
      updatePlayback()
    }

    function onPointerOut(event) {
      if (event.pointerType === 'touch') return
      state.hovered = isInViewport(event.relatedTarget)
      updatePlayback()
    }

    function onWheel(event) {
      // Keep browser zoom and page scrolling outside the gallery viewport native.
      if (event.ctrlKey || event.metaKey || !event.cancelable
        || !isInViewport(event.target) || images.length < 2) return

      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const rawDelta = horizontal ? event.deltaX : event.deltaY
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1
      const distance = rawDelta * unit * WHEEL_SCROLL_MULTIPLIER
      if (!distance) return

      if (state.reduced) {
        const maximum = viewport.scrollWidth - viewport.clientWidth
        const next = Math.max(0, Math.min(maximum, viewport.scrollLeft + distance))
        // At either end, let the visitor continue scrolling the page.
        if (Math.abs(next - viewport.scrollLeft) < 0.5) return
        event.preventDefault()
        viewport.scrollLeft = next
      } else if (state.width > 0) {
        event.preventDefault()
        state.hovered = true
        updatePlayback()
        // Vertical wheel follows autoplay; horizontal trackpads follow native panning.
        state.offset = wrap(state.offset + (horizontal ? -distance : distance), state.width)
        paint()
      }
    }

    function onFocus() {
      state.focused = root.matches(':focus-visible')
      updatePlayback()
    }

    function onBlur(event) {
      if (!root.contains(event.relatedTarget)) {
        state.focused = false
        updatePlayback()
      }
    }

    function onKeyDown(event) {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
      event.preventDefault()
      event.stopPropagation()
      state.focused = true
      updatePlayback()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      if (state.reduced) {
        viewport.scrollLeft += direction * viewport.clientWidth * 0.8
      } else if (state.width > 0) {
        state.offset = wrap(state.offset - direction * viewport.clientWidth * 0.8, state.width)
        paint()
      }
    }

    function onPointerDown(event) {
      if (event.pointerType !== 'touch' || state.reduced) return
      state.touch = { id: event.pointerId, x: event.clientX, offset: state.offset }
      viewport.setPointerCapture(event.pointerId)
      updatePlayback()
    }

    function onPointerMove(event) {
      if (!state.touch || state.touch.id !== event.pointerId || !state.width) return
      state.offset = wrap(state.touch.offset + event.clientX - state.touch.x, state.width)
      paint()
    }

    function onPointerEnd(event) {
      if (state.touch?.id !== event.pointerId) return
      state.touch = null
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
      updatePlayback()
    }

    const intersection = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
        state.visible = entry.isIntersecting
        if (state.visible) root.querySelectorAll('img').forEach((image) => { image.loading = 'eager' })
        updatePlayback()
      }, { threshold: 0.02 }) : null
    const resize = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    intersection?.observe(root)
    if (!intersection) state.visible = true
    resize?.observe(viewport)
    resize?.observe(group)
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', updatePlayback)
    if (preference.addEventListener) preference.addEventListener('change', updatePreference)
    else preference.addListener(updatePreference)
    root.addEventListener('pointerover', onPointerOver)
    root.addEventListener('pointerout', onPointerOut)
    viewport.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('focusin', onFocus)
    root.addEventListener('focusout', onBlur)
    root.addEventListener('keydown', onKeyDown)
    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', onPointerEnd)
    viewport.addEventListener('pointercancel', onPointerEnd)
    updatePreference()

    return () => {
      window.cancelAnimationFrame(frame)
      intersection?.disconnect()
      resize?.disconnect()
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', updatePlayback)
      if (preference.removeEventListener) preference.removeEventListener('change', updatePreference)
      else preference.removeListener(updatePreference)
      root.removeEventListener('pointerover', onPointerOver)
      root.removeEventListener('pointerout', onPointerOut)
      viewport.removeEventListener('wheel', onWheel)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('focusout', onBlur)
      root.removeEventListener('keydown', onKeyDown)
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', onPointerEnd)
      viewport.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [images, ratio])

  if (!firstImage) return null

  return (
    <div aria-label={label} aria-roledescription="gallery" className={`portfolio-gallery portfolio-gallery--continuous ${className}`} data-gallery={id} data-playing="false" id={id} ref={rootRef} role="region" tabIndex={0}>
      <div className="portfolio-gallery__window">
        <div className="portfolio-gallery__track" ref={trackRef}>
          {[0, 1].map((copy) => (
            <div aria-hidden={copy === 1 ? true : undefined} className="portfolio-gallery__strip" key={copy}>
              {images.map((image, index) => (
                <img alt={copy === 0 ? image.alt : ''} decoding="async" draggable="false" height={image.height} key={`${image.src}-${index}`} loading="lazy" src={image.src} width={image.width} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Gallery(props) {
  return props.mode === 'continuous' ? <ContinuousGallery {...props} /> : <ControlledGallery {...props} />
}

function ControlledGallery({ id, label, images = EMPTY_IMAGES, mode = 'carousel', autoPlay = false, interval = 4500, className = '' }) {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const marqueeOffset = useRef(0)
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [interactionOverride, setInteractionOverride] = useState(false)
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(true)
  const isMarquee = mode === 'marquee'
  const multiple = images.length > 1
  const interactionAllowsPlayback = interactionOverride || (!hovered && !focused)
  const canPlay = autoPlay && multiple && !userPaused && interactionAllowsPlayback && visible && documentVisible
  const firstImage = images[0]
  const ratio = firstImage?.width && firstImage?.height ? firstImage.height / firstImage.width : 2 / 3

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return undefined
    }
    function onVisibility() {
      setDocumentVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)
    onVisibility()
    let observer = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.02 })
      observer.observe(root)
    } else {
      setVisible(true)
    }
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!canPlay || isMarquee) {
      return undefined
    }
    const timer = window.setTimeout(() => setIndex((current) => wrap(current + 1, images.length)), Math.max(2000, interval))
    return () => window.clearTimeout(timer)
  }, [canPlay, images.length, index, interval, isMarquee])

  useEffect(() => {
    if (isMarquee || !rootRef.current) {
      return undefined
    }
    const root = rootRef.current
    const slides = [...root.querySelectorAll('[data-gallery-slide]')]
    const starts = slides.map((slide) => Number(slide.style.opacity) || 0)
    const started = performance.now()
    let frame = 0
    root.dataset.moving = 'true'

    function animate(time) {
      const progress = Math.min(1, Math.max(0, (time - started) / 420))
      const eased = 1 - Math.pow(1 - progress, 3)
      slides.forEach((slide, slideIndex) => {
        const target = slideIndex === index ? 1 : 0
        const opacity = starts[slideIndex] + (target - starts[slideIndex]) * eased
        slide.style.opacity = String(opacity)
        slide.style.visibility = opacity > 0.001 || target === 1 ? 'visible' : 'hidden'
        if (mode === 'carousel') {
          slide.style.transform = `translate3d(${(slideIndex === index ? 1 - eased : -eased) * 8}%, 0, 0)`
        }
      })
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate)
      } else {
        root.dataset.moving = 'false'
      }
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [index, isMarquee, mode])

  useEffect(() => {
    if (!isMarquee || !canPlay || !trackRef.current) {
      return undefined
    }
    const track = trackRef.current
    const group = track.firstElementChild
    let groupWidth = group.getBoundingClientRect().width
    let frame = 0
    let previous = 0
    function measure() {
      groupWidth = group.getBoundingClientRect().width
    }
    const observer = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    observer?.observe(group)
    window.addEventListener('resize', measure, { passive: true })

    function animate(time) {
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0
      previous = time
      if (groupWidth > 0) {
        marqueeOffset.current = wrap(marqueeOffset.current + delta * 32, groupWidth)
        track.style.transform = `translate3d(${-marqueeOffset.current}px, 0, 0)`
      }
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [canPlay, isMarquee])

  function move(direction) {
    if (!multiple) {
      return
    }
    if (autoPlay) {
      setUserPaused(true)
      setInteractionOverride(false)
    }
    if (isMarquee && trackRef.current) {
      const group = trackRef.current.firstElementChild
      const width = group.getBoundingClientRect().width
      const tileWidth = group.firstElementChild?.getBoundingClientRect().width || 240
      if (width > 0) {
        marqueeOffset.current = wrap(marqueeOffset.current + direction * (tileWidth + 12), width)
        trackRef.current.style.transform = `translate3d(${-marqueeOffset.current}px, 0, 0)`
      }
    }
    setIndex((current) => wrap(current + direction, images.length))
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  function togglePlayback() {
    const resume = userPaused
    setUserPaused(!resume)
    setInteractionOverride(resume)
  }

  if (!firstImage) {
    return null
  }

  return (
    <div
      aria-label={label}
      aria-roledescription={isMarquee ? 'gallery' : 'carousel'}
      className={`portfolio-gallery portfolio-gallery--${mode} ${className}`}
      data-gallery={id}
      data-playing={canPlay}
      data-index={index}
      id={id}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false)
          setInteractionOverride(false)
        }
      }}
      onFocus={() => {
        setFocused(true)
        setInteractionOverride(false)
      }}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') {
          setHovered(true)
          setInteractionOverride(false)
        }
      }}
      onPointerLeave={() => {
        setHovered(false)
        setInteractionOverride(false)
      }}
      ref={rootRef}
      role="region"
      tabIndex={0}
    >
      {isMarquee ? (
        <div className="portfolio-gallery__window">
          <div className="portfolio-gallery__track" ref={trackRef}>
            {[0, 1].map((copy) => (
              <div aria-hidden={copy === 1 ? true : undefined} className="portfolio-gallery__strip" key={copy}>
                {images.map((image, imageIndex) => (
                  <img alt={copy === 0 ? image.alt : ''} decoding="async" draggable="false" height={image.height} key={`${copy}-${image.src}-${imageIndex}`} loading={visible ? 'eager' : 'lazy'} src={image.src} width={image.width} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="portfolio-gallery__viewport" style={{ paddingBottom: `${Math.min(1.3, Math.max(0.42, ratio)) * 100}%` }}>
          {images.map((image, imageIndex) => (
            <figure
              aria-hidden={imageIndex !== index}
              aria-label={`${imageIndex + 1} of ${images.length}`}
              aria-roledescription="slide"
              className="portfolio-gallery__slide"
              data-gallery-slide={imageIndex}
              key={`${image.src}-${imageIndex}`}
              role="group"
              style={{ opacity: imageIndex === 0 ? 1 : 0, visibility: imageIndex === 0 ? 'visible' : 'hidden' }}
            >
              <img alt={image.alt} decoding="async" draggable="false" height={image.height} loading={imageIndex === index ? 'eager' : 'lazy'} src={image.src} width={image.width} />
            </figure>
          ))}
        </div>
      )}

      {multiple ? (
        <div className="portfolio-gallery__controls">
          <button aria-label={`Previous image in ${label}`} onClick={() => move(-1)} type="button"><Arrow direction="previous" /></button>
          <span aria-atomic="true" aria-live={canPlay ? 'off' : 'polite'} className="portfolio-gallery__count">{isMarquee ? `${images.length} artworks` : `${index + 1} / ${images.length}`}</span>
          <button aria-label={`Next image in ${label}`} onClick={() => move(1)} type="button"><Arrow direction="next" /></button>
          {autoPlay ? (
            <button aria-describedby={`${id}-playback-status`} aria-label={`${userPaused ? 'Resume' : 'Pause'} automatic playback in ${label}`} className="portfolio-gallery__playback" onClick={togglePlayback} type="button">
              <PlaybackIcon paused={userPaused} />
              <span>{userPaused ? 'Play' : 'Pause'}</span>
            </button>
          ) : null}
          {autoPlay ? <span className="visually-hidden" id={`${id}-playback-status`} role="status">{canPlay ? 'Automatic playback is running' : userPaused ? 'Automatic playback is paused' : 'Automatic playback is temporarily paused during interaction or while outside the visible page'}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
