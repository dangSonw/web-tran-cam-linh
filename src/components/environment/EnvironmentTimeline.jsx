import { useRef } from 'react'
import Gallery from '../portfolio/Gallery'
import { greenHanoiAmsterdam } from '../../data/environmentContent'
import EnvironmentTimelinePaths from './EnvironmentTimelinePaths'

export default function EnvironmentTimeline() {
  const rootRef = useRef(null)

  return (
    <div className="environment-timeline-layout" ref={rootRef}>
      <EnvironmentTimelinePaths rootRef={rootRef} />
      <ol className="environment-timeline" aria-label="Green Hanoi Amsterdam journey">
      {greenHanoiAmsterdam.timeline.map((event) => (
        <li
          className={`environment-timeline__event environment-timeline__event--${event.side}`}
          id={event.id}
          key={event.id}
          data-environment-event={event.id}
          data-fade-sequence={event.fade}
        >
          <article aria-labelledby={`${event.id}-heading`}>
            <h4 id={`${event.id}-heading`}>{event.title}</h4>
            {event.fade !== undefined ? (
              <Gallery
                id={`${event.id}-gallery`}
                className="environment-timeline__gallery"
                label={event.title}
                images={event.images}
                mode="continuous"
                autoPlay
              />
            ) : event.images.length ? (
              <img
                className={`environment-timeline__image${event.id === 'gha-vice-president' ? ' environment-timeline__image--portrait' : ''}`}
                src={event.images[0].src}
                alt={event.images[0].alt}
                width={event.images[0].width}
                height={event.images[0].height}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <p className="environment-timeline__note">{event.description}</p>
          </article>
        </li>
      ))}
      </ol>
    </div>
  )
}
