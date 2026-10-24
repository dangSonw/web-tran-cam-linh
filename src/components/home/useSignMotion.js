import { useEffect } from 'react'
import { stepSpring } from '../../lib/motion'

export default function useSignMotion(homeRef) {
  useEffect(() => {
    const page = homeRef.current
    const hoverInput = window.matchMedia('(hover: hover)')
    const signs = new Map([...page.querySelectorAll('[data-home-sign]')].map((sign) => [
      sign,
      {
        artwork: sign.querySelector('.home-sign__artwork'),
        value: 0,
        velocity: 0,
        hovered: false,
        focused: false,
        pressed: false,
      },
    ]))
    let frame = 0
    let previousTime = 0

    function requestMotion() {
      if (frame === 0) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    function animate(time) {
      const delta = previousTime === 0 ? 1 / 60 : Math.min((time - previousTime) / 1000, 0.04)
      let moving = false

      frame = 0
      previousTime = time

      for (const item of signs.values()) {
        const target = item.pressed ? -0.5 : Number(item.hovered || item.focused)
        const settling = stepSpring(item, target, delta)

        // The link's layout/hit area never moves. Only its illustration responds.
        item.artwork.style.transform = `scale(${1 + item.value * 0.045})`
        item.artwork.style.willChange = settling ? 'transform' : ''
        moving ||= settling
      }

      if (moving) {
        requestMotion()
      } else {
        previousTime = 0
      }
    }

    function findSign(target) {
      return target instanceof Element ? target.closest('[data-home-sign]') : null
    }

    function update(event, property, value) {
      const sign = findSign(event.target)
      const item = signs.get(sign)

      if (!item || sign.contains(event.relatedTarget)) {
        return
      }

      item[property] = value
      requestMotion()
    }

    function pointerOver(event) {
      if (event.pointerType !== 'touch' && hoverInput.matches) {
        update(event, 'hovered', true)
      }
    }

    function pointerOut(event) {
      update(event, 'hovered', false)
    }

    function focusIn(event) {
      update(event, 'focused', true)
    }

    function focusOut(event) {
      update(event, 'focused', false)
    }

    function pointerDown(event) {
      update(event, 'pressed', true)
    }

    function release() {
      for (const item of signs.values()) {
        item.pressed = false
      }

      requestMotion()
    }

    function syncInteraction() {
      const active = page.dataset.active === 'true'

      for (const [sign, item] of signs) {
        item.hovered = active && hoverInput.matches && sign.matches(':hover')
        item.focused = active && sign === document.activeElement
        item.pressed = false
      }

      requestMotion()
    }

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(syncInteraction) : null
    const activeObserver = new MutationObserver(syncInteraction)

    resizeObserver?.observe(page)
    if (!resizeObserver) {
      window.addEventListener('resize', syncInteraction, { passive: true })
    }
    activeObserver.observe(page, { attributes: true, attributeFilter: ['data-active'] })
    page.addEventListener('pointerover', pointerOver)
    page.addEventListener('pointerout', pointerOut)
    page.addEventListener('focusin', focusIn)
    page.addEventListener('focusout', focusOut)
    page.addEventListener('pointerdown', pointerDown)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncInteraction)
      activeObserver.disconnect()
      page.removeEventListener('pointerover', pointerOver)
      page.removeEventListener('pointerout', pointerOut)
      page.removeEventListener('focusin', focusIn)
      page.removeEventListener('focusout', focusOut)
      page.removeEventListener('pointerdown', pointerDown)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
    }
  }, [homeRef])
}
