import { FRAME_SIZE, GUIDE_LAYERS } from '../data/openFrameLayers'

export default function CenterGuideLines() {
  return (
    <svg
      className="open-stage__guides"
      viewBox={`0 0 ${FRAME_SIZE.width} ${FRAME_SIZE.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {GUIDE_LAYERS.map((line) => (
        <path
          key={line.key}
          data-intro="guide"
          data-delay={line.delay}
          className="open-stage__guide"
          d={line.path}
          transform={`translate(${line.x} ${line.y})`}
          pathLength="1"
          fill="none"
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

