import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PortfolioPage from '../portfolio/PortfolioPage'
import { OTHER_ACHIEVEMENTS, OTHERS_INTRO } from '../../data/othersContent'
import './OthersPage.css'

// Figma positions relative to (5759.471, 4610). Outlined SVGs preserve the
// original Okina DEMO lettering without substituting the McLaren body font.
const ART_WIDTH = 1647.08
const ART_HEIGHT = 834
const LAYOUT = {
  aimo: { x: 0, width: 517.415, cloud: [0, 0, 517.415, 286.943], sign: [41.689, 218, 445.836, 319], certificate: [30.528, 494, 468, 339] },
  hssic: { x: 580.529, width: 527.038, cloud: [0, 37, 527.038, 249.766], sign: [32.937, 218, 465.972, 319], certificate: [33, 494, 466, 339] },
  ipsyo: { x: 1149.529, width: 497.551, cloud: [0, 12, 474, 262.867], sign: [4, 218, 493.551, 319], certificate: [11, 494, 480, 340] },
}

function artPosition([x, y, width, height], cardWidth) {
  return { left: `${x / cardWidth * 100}%`, top: `${y / ART_HEIGHT * 100}%`, width: `${width / cardWidth * 100}%`, height: `${height / ART_HEIGHT * 100}%` }
}

function OtherAchievement({ achievement, onOpen }) {
  const headingId = `other-achievement-${achievement.id}-title`
  const layout = LAYOUT[achievement.id]
  return (
    <article
      aria-labelledby={headingId}
      className="other-achievement"
      data-other-achievement={achievement.id}
      id={`other-achievement-${achievement.id}`}
      style={{ left: `${layout.x / ART_WIDTH * 100}%`, width: `${layout.width / ART_WIDTH * 100}%`, '--card-ratio': `${ART_HEIGHT / layout.width * 100}%` }}
    >
      <h3 className="visually-hidden" id={headingId}>[{achievement.year}] {achievement.title}</h3>
      <div className="other-achievement__art">
        <img alt="" aria-hidden="true" className="other-achievement__sign" draggable="false" src={`/images/others/${achievement.id}-sign.svg`} style={artPosition(layout.sign, layout.width)} />
        <img alt="" aria-hidden="true" className="other-achievement__shrub" draggable="false" loading="lazy" src={achievement.shrub} style={artPosition(layout.cloud, layout.width)} />
        <button aria-label={`Enlarge ${achievement.title} certificate`} aria-haspopup="dialog" className="other-achievement__certificate" onClick={() => onOpen(achievement)} style={artPosition(layout.certificate, layout.width)} type="button">
          <img alt={achievement.certificate.alt} decoding="async" height={achievement.certificate.height} loading="lazy" src={achievement.certificate.src} width={achievement.certificate.width} />
        </button>
      </div>
    </article>
  )
}

function CertificateLightbox({ achievement, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      } else if (event.key === 'Tab') {
        event.preventDefault()
        event.stopPropagation()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [onClose])
  return createPortal(
    <div aria-label={`${achievement.title} certificate`} aria-modal="true" className="certificate-lightbox" onClick={(event) => { if (event.target === event.currentTarget) onClose() }} role="dialog">
      <button aria-label="Close enlarged certificate" className="certificate-lightbox__close" onClick={onClose} ref={closeRef} type="button">
        <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>
      </button>
      <img alt={achievement.certificate.alt} className="certificate-lightbox__image" height={achievement.certificate.height} src={achievement.certificate.src} width={achievement.certificate.width} />
    </div>, document.body,
  )
}

export default function OthersPage({ active }) {
  const [selected, setSelected] = useState(null)
  return (
    <>
      <PortfolioPage active={active} intro={OTHERS_INTRO} introSrc="/images/others/intro.svg" section="others" title="Others">
        <section aria-labelledby="others-achievements-title" className="others-achievements">
          <h2 className="visually-hidden" id="others-achievements-title">Other achievements</h2>
          <div className="others-achievements__display">
            {OTHER_ACHIEVEMENTS.map((achievement) => <OtherAchievement achievement={achievement} key={achievement.id} onOpen={setSelected} />)}
          </div>
        </section>
      </PortfolioPage>
      {selected && <CertificateLightbox achievement={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
