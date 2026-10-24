import { BACKGROUND_LAYER } from '../data/openFrameLayers'

export default function CurtainBackdrop() {
  return (
    <img
      className="open-stage__backdrop"
      data-intro="backdrop"
      src={BACKGROUND_LAYER.src}
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  )
}

