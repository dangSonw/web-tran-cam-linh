import { FRAME_SIZE, PAPER_LAYERS, WORDMARK_LAYERS } from '../data/openFrameLayers'

function percent(value, dimension) {
  return `${(value / dimension) * 100}%`
}

export default function WordmarkLayer() {
  return (
    <div className="open-stage__wordmarks" aria-hidden="true">
      {WORDMARK_LAYERS.map((word) => {
        const paper = PAPER_LAYERS.find((layer) => layer.key === word.key.replace('word-', 'paper-'))
        return (
        <div
          className="wordmark-frame"
          key={word.key}
          style={{
            left: percent(paper.bounds.x, FRAME_SIZE.width),
            top: percent(paper.bounds.y, FRAME_SIZE.height),
            width: percent(paper.bounds.width, FRAME_SIZE.width),
            height: percent(paper.bounds.height, FRAME_SIZE.height),
            transform: `rotate(${-paper.rotation}deg)`,
          }}
        >
        <img
          className="paper-card__lettering"
          data-intro="wordmark"
          data-delay={word.delay}
          src={word.src}
          alt=""
          draggable="false"
          style={{
            '--rotation': `${word.rotation}deg`,
          }}
        />
        </div>
        )
      })}
    </div>
  )
}

