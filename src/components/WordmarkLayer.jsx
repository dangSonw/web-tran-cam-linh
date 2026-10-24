import { FRAME_SIZE, WORDMARK_LAYERS } from '../data/openFrameLayers'

function percent(value, dimension) {
  return `${(value / dimension) * 100}%`
}

export default function WordmarkLayer() {
  return (
    <div className="open-stage__wordmarks" aria-hidden="true">
      {WORDMARK_LAYERS.map((word) => (
        <img
          className="wordmark"
          data-intro="wordmark"
          data-delay={word.delay}
          key={word.key}
          src={word.src}
          alt=""
          draggable="false"
          style={{
            left: percent(word.glyph.x, FRAME_SIZE.width),
            top: percent(word.glyph.y, FRAME_SIZE.height),
            width: percent(word.glyph.width, FRAME_SIZE.width),
            height: percent(word.glyph.height, FRAME_SIZE.height),
            '--rotation': `${word.rotation}deg`,
          }}
        />
      ))}
    </div>
  )
}

