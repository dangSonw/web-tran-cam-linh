import {
  ABOUT_FRAME,
  ABOUT_MEADOW,
  ABOUT_PATH,
  ABOUT_SCENE_LAYERS,
  ABOUT_SKY_CIRCLES,
} from '../../data/aboutFrameLayers'

function position(layer) {
  return {
    left: `${layer.x / ABOUT_FRAME.width * 100}%`,
    top: `${layer.y / ABOUT_FRAME.height * 100}%`,
    width: `${layer.width / ABOUT_FRAME.width * 100}%`,
    height: `${layer.height / ABOUT_FRAME.height * 100}%`,
  }
}

function IllustrationLayer({ layer, side }) {
  const split = layer === ABOUT_MEADOW
  const crop = side === 'right' ? layer.width / 2 : 0
  return (
    <svg
      className="about-forest__layer"
      data-layer-id={layer.nodeId}
      data-forest-side={side || (layer.x + layer.width / 2 < ABOUT_FRAME.width / 2 ? 'left' : 'right')}
      preserveAspectRatio="none"
      style={position(split ? { ...layer, x: layer.x + crop, width: layer.width / 2 } : layer)}
      viewBox={`${crop} 0 ${split ? layer.width / 2 : layer.width} ${layer.height}`}
    >
      <use height={layer.height} href={`${layer.sprite}#layer-${layer.nodeId.replace(':', '-')}`} width={layer.width} />
    </svg>
  )
}

export default function AboutForest() {
  const leftEdge = ABOUT_SCENE_LAYERS.find((layer) => layer.nodeId === '58:385')
  const rightEdge = ABOUT_SCENE_LAYERS.find((layer) => layer.nodeId === '58:384')

  return (
    <div aria-hidden="true" className="about-forest">
      <div className="about-forest__artboard">
        {ABOUT_SKY_CIRCLES.map((circle) => (
          <div
            className="about-forest__sky"
            data-forest-rise
            data-layer-id={circle.nodeId}
            key={circle.nodeId}
            style={{ ...position(circle), backgroundColor: circle.fill }}
          />
        ))}

        <IllustrationLayer layer={ABOUT_MEADOW} side="left" />
        <IllustrationLayer layer={ABOUT_MEADOW} side="right" />
        <svg className="about-forest__ground" data-forest-rise preserveAspectRatio="none" viewBox="0 0 1920 1080">
          <path
            d={ABOUT_PATH}
            data-layer-id="75:141"
            fill="#fff5cd"
            transform="translate(-1 404)"
          />
        </svg>

        {ABOUT_SCENE_LAYERS.map((layer) => (
          <IllustrationLayer key={layer.key} layer={layer} />
        ))}
      </div>
      {[['left', leftEdge], ['right', rightEdge]].map(([side, layer]) => (
        <svg
          className={`about-forest__edge about-forest__edge--${side}`}
          data-forest-side={side}
          key={side}
          preserveAspectRatio="xMidYMid slice"
          viewBox={side === 'left' ? `160 0 180 ${layer.height}` : `290 0 140 ${layer.height}`}
        >
          <use height={layer.height} href={`${layer.sprite}#layer-${layer.nodeId.replace(':', '-')}`} width={layer.width} />
        </svg>
      ))}
    </div>
  )
}
