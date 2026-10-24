import PortfolioPage from '../portfolio/PortfolioPage'
import { OTHER_ACHIEVEMENTS, OTHERS_INTRO } from '../../data/othersContent'
import './OthersPage.css'

function OtherAchievement({ achievement }) {
  const headingId = `other-achievement-${achievement.id}-title`

  return (
    <article
      aria-labelledby={headingId}
      className={`other-achievement other-achievement--${achievement.id}`}
      data-other-achievement={achievement.id}
      id={`other-achievement-${achievement.id}`}
    >
      <div className="other-achievement__hanging">
        <img
          alt=""
          aria-hidden="true"
          className="other-achievement__shrub"
          draggable="false"
          height="440"
          loading="lazy"
          src={achievement.shrub}
          width="800"
        />
        <div className="other-achievement__sign">
          <p className="other-achievement__year">[{achievement.year}]</p>
          <h3 id={headingId}>
            {achievement.titleLines.map((line) => <span key={line}>{line}</span>)}
          </h3>
        </div>
      </div>

      <figure className="other-achievement__certificate">
        <a
          aria-label={`Open ${achievement.title} certificate in a new tab`}
          className="other-achievement__certificate-link"
          href={achievement.certificate.src}
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt={achievement.certificate.alt}
            decoding="async"
            height={achievement.certificate.height}
            loading="lazy"
            src={achievement.certificate.src}
            width={achievement.certificate.width}
          />
          <span className="other-achievement__open">Open certificate</span>
        </a>
        <figcaption>
          <strong>{achievement.award}</strong>
          <p>{achievement.description}</p>
          <time dateTime={achievement.date}>{achievement.dateLabel}</time>
        </figcaption>
      </figure>
    </article>
  )
}

export default function OthersPage({ active }) {
  return (
    <PortfolioPage active={active} intro={OTHERS_INTRO} section="others" title="Others">
      <section aria-labelledby="others-achievements-title" className="others-achievements">
        <h2 className="visually-hidden" id="others-achievements-title">Other achievements</h2>
        <div className="others-achievements__display">
          {OTHER_ACHIEVEMENTS.map((achievement) => (
            <OtherAchievement achievement={achievement} key={achievement.id} />
          ))}
        </div>
      </section>
    </PortfolioPage>
  )
}
