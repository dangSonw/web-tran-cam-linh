import { useLayoutEffect, useRef, useState } from 'react'
import { environmentAchievements } from '../../data/environmentContent'
import { stepSpring } from '../../lib/motion'

function AchievementPanel({ expanded, id, labelledBy, children }) {
  const panelRef = useRef(null)
  const initialized = useRef(false)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const content = panel.firstElementChild
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previous = 0
    let targetHeight = expanded ? content.getBoundingClientRect().height : 0
    const height = { value: panel.hidden ? 0 : panel.getBoundingClientRect().height, velocity: 0 }

    function finish() {
      window.cancelAnimationFrame(frame)
      frame = 0
      panel.hidden = !expanded
      panel.style.height = expanded ? 'auto' : '0px'
      content.style.opacity = expanded ? '1' : '0'
      panel.dataset.moving = 'false'
    }

    function animate(time) {
      const delta = previous ? Math.min((time - previous) / 1000, 0.04) : 1 / 60
      previous = time
      const moving = stepSpring(height, targetHeight, delta, 15, 0.3)
      panel.style.height = `${Math.max(0, height.value)}px`
      const fullHeight = Math.max(1, content.getBoundingClientRect().height)
      content.style.opacity = String(Math.min(1, Math.max(0, height.value / fullHeight)))
      if (moving) frame = window.requestAnimationFrame(animate)
      else finish()
    }

    function settleIfNeeded() {
      if (preference.matches || document.hidden) finish()
    }

    if (!initialized.current || preference.matches || document.hidden) {
      initialized.current = true
      finish()
    } else {
      panel.hidden = false
      targetHeight = expanded ? content.getBoundingClientRect().height : 0
      panel.style.height = `${height.value}px`
      panel.dataset.moving = 'true'
      frame = window.requestAnimationFrame(animate)
    }

    // Images have intrinsic dimensions, but font loading and resizing can still
    // change the destination while an accordion transition is in progress.
    const observer = 'ResizeObserver' in window ? new ResizeObserver(() => {
      if (expanded) targetHeight = content.getBoundingClientRect().height
    }) : null
    observer?.observe(content)
    if (preference.addEventListener) preference.addEventListener('change', settleIfNeeded)
    else preference.addListener(settleIfNeeded)
    document.addEventListener('visibilitychange', settleIfNeeded)
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      if (preference.removeEventListener) preference.removeEventListener('change', settleIfNeeded)
      else preference.removeListener(settleIfNeeded)
      document.removeEventListener('visibilitychange', settleIfNeeded)
    }
  }, [expanded])

  return (
    <div aria-hidden={!expanded} aria-labelledby={labelledBy} className="environment-achievement__panel" id={id} ref={panelRef} role="region">
      <div className="environment-achievement__panel-content">{children}</div>
    </div>
  )
}

function AchievementImages({ achievement }) {
  return (
    <div className={`environment-award-images environment-award-images--${achievement.layout}`}>
      {achievement.images.map((image, index) => (
        <img
          key={image.src}
          className={achievement.layout === 'wico' && index === 4 ? 'environment-award-images__poster' : undefined}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  )
}

export default function EnvironmentAchievements() {
  const [expandedId, setExpandedId] = useState(environmentAchievements[0].id)
  const buttonRefs = useRef([])

  function handleKeyDown(event, index) {
    let nextIndex = index

    if (event.key === 'ArrowDown') {
      nextIndex = (index + 1) % environmentAchievements.length
    } else if (event.key === 'ArrowUp') {
      nextIndex = (index - 1 + environmentAchievements.length) % environmentAchievements.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = environmentAchievements.length - 1
    } else {
      return
    }

    event.preventDefault()
    buttonRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="environment-achievements" data-environment-accordion>
      {environmentAchievements.map((achievement, index) => {
        const expanded = expandedId === achievement.id
        const buttonId = `environment-achievement-button-${achievement.id}`
        const panelId = `environment-achievement-panel-${achievement.id}`

        return (
          <div className="environment-achievement" key={achievement.id} data-expanded={expanded}>
            <h3 className="environment-achievement__heading">
              <button
                className="environment-achievement__button"
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                ref={(node) => { buttonRefs.current[index] = node }}
                onClick={() => setExpandedId(achievement.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <svg className="environment-achievement__toggle" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12h18" />
                  <path className="environment-achievement__toggle-stem" d="M12 3v18" />
                </svg>
                <span className="environment-item-number" aria-hidden="true">{index + 1}</span>
                <span className="environment-achievement__year">[{achievement.year}]</span>
                <span className="environment-achievement__title">{achievement.title}</span>
              </button>
            </h3>
            <AchievementPanel
              expanded={expanded}
              id={panelId}
              labelledBy={buttonId}
            >
              {achievement.subtitle ? <h4>{achievement.subtitle}</h4> : null}
              <p>{achievement.description}</p>
              <AchievementImages achievement={achievement} />
            </AchievementPanel>
          </div>
        )
      })}
    </div>
  )
}
