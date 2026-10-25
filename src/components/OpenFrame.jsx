import CenterGuideLines from './CenterGuideLines'
import CurtainBackdrop from './CurtainBackdrop'
import PaperLayer from './PaperLayer'
import WordmarkLayer from './WordmarkLayer'
import './OpenFrame.css'

export default function OpenFrame({ onOpen, rootRef }) {
  return (
    <section
      aria-labelledby="page-title"
      className="open-page"
      data-intro-screen
      id="open"
      ref={rootRef}
    >
      <h1 id="page-title" className="visually-hidden">
        Trần Cẩm Linh — Portfolio
      </h1>
      <div className="open-page__viewport">
        <section className="open-stage" aria-label="Portfolio opening artwork">
          <CurtainBackdrop />
          <div className="open-stage__artwork">
            <CenterGuideLines />
            <PaperLayer />
            <WordmarkLayer />
          </div>
        </section>
      </div>
      <button className="open-page__cue" onClick={onOpen} type="button">
        <span>Scroll to enter</span>
        <span aria-hidden="true" className="open-page__cue-arrow">↓</span>
      </button>
    </section>
  )
}

