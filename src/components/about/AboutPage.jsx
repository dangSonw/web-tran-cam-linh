import { useEffect, useRef } from 'react'
import { ABOUT_CONTENT } from '../../data/aboutFrameLayers'
import AboutForest from './AboutForest'
import useAboutMotion from './useAboutMotion'
import './AboutPage.css'

function AboutPortrait() {
  return (
    <div className="about-hanging" data-about-hanging data-forest-sign>
      <div className="about-hanging__sign" data-layer-id="74:63">
        <img alt="" draggable="false" height="738" src="/images/about/about-sign.svg" width="635" />
        <h1 className="visually-hidden" id="about-title" tabIndex={-1}>About me</h1>
      </div>
      <figure className="about-portrait" data-layer-id="114:333">
        <img
          alt="Linh Tran beside a lake, welcoming you to her forest."
          draggable="false"
          fetchPriority="high"
          height="548"
          src="/images/about/portrait.webp"
          width="870"
        />
      </figure>
    </div>
  )
}

function AboutIntroduction() {
  return (
    <div className="about-introduction" data-about-copy data-forest-copy>
      <h2 className="about-greeting" data-layer-id="64:3">
        <img alt={ABOUT_CONTENT.greeting} draggable="false" height="143" src="/images/about/greeting.svg" width="1130" />
      </h2>
      <div className="about-biography" data-layer-id="64:5">
        {ABOUT_CONTENT.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <a
        aria-label="View resumé (opens in a new tab)"
        className="about-resume"
        data-layer-id="64:6"
        href={ABOUT_CONTENT.resumeUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <img alt="view resumé" draggable="false" height="65" src="/images/about/resume-lettering.svg" width="460" />
      </a>
    </div>
  )
}

export default function AboutPage({ active }) {
  const pageRef = useRef(null)

  useAboutMotion(pageRef, active)

  useEffect(() => {
    if (active) {
      pageRef.current.scrollTop = 0
      pageRef.current.querySelector('#about-title').focus({ preventScroll: true })
    }
  }, [active])

  return (
    <section
      aria-labelledby="about-title"
      className="about-page"
      data-active={active}
      hidden={!active}
      id="about-me"
      ref={pageRef}
    >
      <div className="about-navigation">
        <a aria-label="Back to Home" className="about-back" href="#home">
          <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
            <path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
          <span>Home</span>
        </a>
      </div>
      <div className="about-scroll-track" data-forest-track>
        <div className="about-stage" data-forest-scene>
          <AboutForest />
          <div className="about-content">
            <AboutPortrait />
            <AboutIntroduction />
          </div>
        </div>
      </div>
    </section>
  )
}
