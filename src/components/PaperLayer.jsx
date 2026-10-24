import { FRAME_SIZE, PAPER_LAYERS } from '../data/openFrameLayers'

function percent(value, dimension) {
  return `${(value / dimension) * 100}%`
}

export default function PaperLayer() {
  return (
    <div className="open-stage__papers" aria-hidden="true">
      {PAPER_LAYERS.map((paper, index) => (
        <div
          className="paper-card"
          data-intro="paper"
          data-delay={paper.delay}
          key={paper.key}
          style={{
            left: percent(paper.bounds.x, FRAME_SIZE.width),
            top: percent(paper.bounds.y, FRAME_SIZE.height),
            width: percent(paper.bounds.width, FRAME_SIZE.width),
            height: percent(paper.bounds.height, FRAME_SIZE.height),
            '--rotation': `${paper.rotation}deg`,
            zIndex: index + 1,
          }}
        />
      ))}
    </div>
  )
}

