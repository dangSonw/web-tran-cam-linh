import { useRef, useState } from 'react'
import { environmentAchievements } from '../../data/environmentContent'

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
                  {!expanded ? <path d="M12 3v18" /> : null}
                </svg>
                <span className="environment-item-number" aria-hidden="true">{index + 1}</span>
                <span className="environment-achievement__year">[{achievement.year}]</span>
                <span className="environment-achievement__title">{achievement.title}</span>
              </button>
            </h3>
            <div
              className="environment-achievement__panel"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
            >
              {achievement.subtitle ? <h4>{achievement.subtitle}</h4> : null}
              <p>{achievement.description}</p>
              <AchievementImages achievement={achievement} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
