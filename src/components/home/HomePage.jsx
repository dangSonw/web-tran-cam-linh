import { useRef } from 'react'
import {
  HOME_BACKGROUND_CIRCLES,
  HOME_FRAME_SIZE,
  HOME_NAVIGATION,
  HOME_SCENE_LAYERS,
} from '../../data/homeFrameLayers'
import useSignMotion from './useSignMotion'
import './HomePage.css'

function framePosition(layer) {
  return {
    left: `${(layer.x / HOME_FRAME_SIZE.width) * 100}%`,
    top: `${(layer.y / HOME_FRAME_SIZE.height) * 100}%`,
    width: `${(layer.width / HOME_FRAME_SIZE.width) * 100}%`,
    height: `${(layer.height / HOME_FRAME_SIZE.height) * 100}%`,
  }
}

function SignLink({ sign }) {
  return (
    <a
      className="home-sign"
      data-home-sign={sign.key}
      data-layer-id={sign.nodeId}
      href={sign.href}
    >
      <img
        className="home-sign__artwork"
        src={sign.src}
        alt={sign.label}
        draggable="false"
      />
    </a>
  )
}

export default function HomePage({ covered = false }) {
  const homeRef = useRef(null)

  useSignMotion(homeRef)

  return (
    <section
      aria-hidden={covered || undefined}
      aria-labelledby="home-title"
      className="home-page"
      data-active="false"
      id="home"
      inert
      ref={homeRef}
    >
      <h2 className="visually-hidden" id="home-title">
        Welcome to Linh Tran’s forest
      </h2>

      <div className="home-scene__artboard" aria-hidden="true">
        <div className="home-scene__base" />

        {HOME_BACKGROUND_CIRCLES.map((circle) => (
          <div
            className="home-scene__circle"
            data-layer-id={circle.nodeId}
            key={circle.key}
            style={{
              ...framePosition(circle),
              backgroundColor: circle.fill,
              zIndex: 1,
            }}
          />
        ))}

        {HOME_SCENE_LAYERS.map((layer) => (
          <img
            alt=""
            className="home-scene__layer"
            data-layer-id={layer.nodeId}
            draggable="false"
            key={layer.key}
            src={layer.src}
            style={{ ...framePosition(layer), zIndex: layer.zIndex }}
          />
        ))}
      </div>

      <div className="home-content">
        <nav aria-label="Portfolio sections" className="home-navigation">
          {HOME_NAVIGATION.map((sign) => (
            <SignLink key={sign.key} sign={sign} />
          ))}
        </nav>

        <p className="home-welcome">
          Welcome to Linh Tran’s forest, shaped by years of choreographed trails and organic chaos.
        </p>
      </div>
    </section>
  )
}
