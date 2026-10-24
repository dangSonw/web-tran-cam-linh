import { useEffect, useRef } from 'react'
import { ABOUT_FRAME, ABOUT_PATH, ABOUT_MEADOW, ABOUT_SCENE_LAYERS } from '../../data/aboutFrameLayers'
import { HOME_NAVIGATION } from '../../data/homeFrameLayers'
import { PORTFOLIO_SECTIONS } from '../../data/portfolioSections'
import useForestScroll from '../../lib/useForestScroll'
import './PortfolioPage.css'

function ForestLayer({ layer, side }) {
  const split = layer === ABOUT_MEADOW
  const crop = side === 'right' ? layer.width / 2 : 0
  return (
    <svg
      className="portfolio-forest__layer"
      data-forest-side={side || (layer.x + layer.width / 2 < ABOUT_FRAME.width / 2 ? 'left' : 'right')}
      preserveAspectRatio="none"
      style={{
        left: `${(layer.x + crop) / ABOUT_FRAME.width * 100}%`,
        top: `${layer.y / ABOUT_FRAME.height * 100}%`,
        width: `${(split ? layer.width / 2 : layer.width) / ABOUT_FRAME.width * 100}%`,
        height: `${layer.height / ABOUT_FRAME.height * 100}%`,
      }}
      viewBox={`${crop} 0 ${split ? layer.width / 2 : layer.width} ${layer.height}`}
    >
      <use height={layer.height} href={`${layer.sprite}#layer-${layer.nodeId.replace(':', '-')}`} width={layer.width} />
    </svg>
  )
}

function ForestEntrance() {
  return (
    <div aria-hidden="true" className="portfolio-forest">
      <div className="portfolio-forest__sky portfolio-forest__sky--outer" data-forest-rise />
      <div className="portfolio-forest__sky portfolio-forest__sky--middle" data-forest-rise />
      <div className="portfolio-forest__sky portfolio-forest__sky--inner" data-forest-rise />
      <ForestLayer layer={ABOUT_MEADOW} side="left" />
      <ForestLayer layer={ABOUT_MEADOW} side="right" />
      <svg className="portfolio-forest__ground" data-forest-rise preserveAspectRatio="none" viewBox="0 0 1920 1080">
        <path d={ABOUT_PATH} fill="#fff5cd" transform="translate(-1 404)" />
      </svg>
      {ABOUT_SCENE_LAYERS.map((layer) => <ForestLayer key={layer.key} layer={layer} />)}
    </div>
  )
}

function useInitialFocus(pageRef, active) {
  useEffect(() => {
    if (!active || !pageRef.current) {
      return undefined
    }
    const page = pageRef.current
    let focusFrame = 0
    page.scrollTop = 0
    const heading = page.querySelector('h1')
    heading?.focus({ preventScroll: true })

    function restoreInitialFocus() {
      window.cancelAnimationFrame(focusFrame)
      focusFrame = window.requestAnimationFrame(() => {
        if (page.isConnected && (document.activeElement === document.body || document.activeElement === page)) {
          heading?.focus({ preventScroll: true })
        }
      })
    }

    restoreInitialFocus()
    page.addEventListener('focusin', restoreInitialFocus)
    window.addEventListener('load', restoreInitialFocus, { once: true })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      page.removeEventListener('focusin', restoreInitialFocus)
      window.removeEventListener('load', restoreInitialFocus)
    }
  }, [active, pageRef])
}

export default function PortfolioPage({ active, section, title, intro, quote, signSrc, children }) {
  const pageRef = useRef(null)
  const homeSign = HOME_NAVIGATION.find((item) => item.key === section)
  const paragraphs = Array.isArray(intro) ? intro : String(intro || '').split(/\n\s*\n/)
  useInitialFocus(pageRef, active)
  useForestScroll(pageRef, active)

  return (
    <section
      aria-labelledby={`${section}-title`}
      className={`portfolio-page portfolio-page--${section}`}
      data-active={active}
      data-portfolio-page={section}
      hidden={!active}
      id={section}
      ref={pageRef}
    >
      <nav aria-label={`${title} navigation`} className="portfolio-nav">
        <a className="portfolio-nav__home" href="#home">
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
            <path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
          Home
        </a>
        <div className="portfolio-nav__sections">
          {PORTFOLIO_SECTIONS.map((item) => (
            <a aria-current={section === item.key ? 'page' : undefined} href={item.hash} key={item.key}>{item.label}</a>
          ))}
        </div>
      </nav>

      <div className="portfolio-hero-track" data-forest-track>
      <header className="portfolio-hero" data-forest-scene>
        <ForestEntrance />
        <div className="portfolio-hero__content">
          <div className="portfolio-hero__sign" data-portfolio-sign data-forest-sign>
            <img alt="" draggable="false" src={signSrc || homeSign?.src} />
            <h1 className="visually-hidden" id={`${section}-title`} tabIndex={-1}>{title}</h1>
          </div>
          {quote ? (
            <blockquote className="portfolio-hero__quote" data-forest-copy>
              {section === 'environment' || section === 'arts' ? (
                <img alt={quote} draggable="false" src={`/images/portfolio/${section}-quote.svg`} />
              ) : quote}
            </blockquote>
          ) : null}
          <div className="portfolio-hero__intro" data-forest-copy>
            {paragraphs.filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </header>
      </div>

      <div className="portfolio-body">{children}</div>
      <footer className="portfolio-footer">
        <a href="#home">Back to the forest</a>
        <a href="#about-me">About Linh</a>
      </footer>
    </section>
  )
}
