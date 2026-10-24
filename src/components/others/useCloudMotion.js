import { useEffect } from 'react'
import { stepSpring } from '../../lib/motion'

// A slow breeze through the original cloud cutouts, with a small responsive
// sway when the visitor explores a cloud or focuses its certificate.
export default function useCloudMotion(articleRef, phase) {
  useEffect(() => {
    const article = articleRef.current
    const hanging = article.querySelector('.other-achievement__hanging')
    const cloud = article.querySelector('.other-achievement__shrub')
    const sign = article.querySelector('.other-achievement__sign')
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sway = { value: 0, velocity: 0 }
    const lift = { value: 0, velocity: 0 }
    let visible = false
    let hovered = false
    let focused = false
    let target = 0
    let elapsed = 0
    let previous = 0
    let frame = 0

    function animate(time) {
      frame = 0
      const delta = previous ? Math.min((time - previous) / 1000, 0.04) : 0
      previous = time
      elapsed += delta
      const engaged = hovered || focused
      stepSpring(sway, hovered ? target : 0, delta, 9, 0.0001)
      stepSpring(lift, engaged ? 1 : 0, delta, 9, 0.0001)
      // Ramp in from the original composition; no entrance jump.
      const envelope = Math.min(1, elapsed / 1.8)
      const breeze = Math.sin(elapsed * 0.65 + phase) * envelope
      const drift = Math.sin(elapsed * 0.4 + phase) * envelope
      hanging.style.transform = `translate3d(${drift * 3}px, ${breeze * 4 - lift.value * 5}px, 0) rotate(${breeze * 0.55 + sway.value * 1.2}deg)`
      cloud.style.transform = `translate3d(${sway.value * 4}px, ${-lift.value * 3}px, 0) rotate(${sway.value * -0.8}deg)`
      sign.style.transform = `rotate(${breeze * -0.8 - sway.value * 1.5}deg)`
      frame = window.requestAnimationFrame(animate)
    }

    function updatePlayback() {
      const running = visible && !document.hidden && !preference.matches
      article.dataset.cloudMoving = String(running)
      if (running && !frame) {
        previous = 0
        frame = window.requestAnimationFrame(animate)
      } else if (!running) {
        window.cancelAnimationFrame(frame)
        frame = 0
        previous = 0
      }
      if (preference.matches) {
        hanging.style.transform = ''
        cloud.style.transform = ''
        sign.style.transform = ''
      }
    }

    function onPointerMove(event) {
      if (event.pointerType === 'touch') return
      hovered = true
      const bounds = hanging.getBoundingClientRect()
      target = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2))
    }
    function onPointerLeave() {
      hovered = false
      target = 0
    }
    function onFocus() { focused = true }
    function onBlur(event) {
      if (!article.contains(event.relatedTarget)) focused = false
    }
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updatePlayback()
    }, { threshold: 0.05 }) : null
    if (observer) observer.observe(hanging)
    else visible = true
    hanging.addEventListener('pointermove', onPointerMove)
    hanging.addEventListener('pointerleave', onPointerLeave)
    article.addEventListener('focusin', onFocus)
    article.addEventListener('focusout', onBlur)
    document.addEventListener('visibilitychange', updatePlayback)
    if (preference.addEventListener) preference.addEventListener('change', updatePlayback)
    else preference.addListener(updatePlayback)
    updatePlayback()
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      hanging.removeEventListener('pointermove', onPointerMove)
      hanging.removeEventListener('pointerleave', onPointerLeave)
      article.removeEventListener('focusin', onFocus)
      article.removeEventListener('focusout', onBlur)
      document.removeEventListener('visibilitychange', updatePlayback)
      if (preference.removeEventListener) preference.removeEventListener('change', updatePlayback)
      else preference.removeListener(updatePlayback)
      hanging.style.transform = ''
      cloud.style.transform = ''
      sign.style.transform = ''
      delete article.dataset.cloudMoving
    }
  }, [articleRef, phase])
}
