import PortfolioPage from '../portfolio/PortfolioPage'
import PortfolioSection from '../portfolio/PortfolioSection'
import Gallery from '../portfolio/Gallery'
import EnvironmentAchievements from './EnvironmentAchievements'
import EnvironmentTimeline from './EnvironmentTimeline'
import {
  banMien,
  depMagazine,
  ecoWander,
  environmentIntro,
  environmentQuote,
  environmentResearch,
  environmentSectionIntros,
  environmentSign,
  greenHanoiAmsterdam,
  greenU,
  polygone,
} from '../../data/environmentContent'
import './environment.css'

function SourceImage({ image, className = '' }) {
  return (
    <img
      className={`environment-source-image ${className}`}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
    />
  )
}

function ImageRow({ images, className = '' }) {
  const totalRatio = images.reduce((sum, image) => sum + image.width / image.height, 0)

  return (
    <div className={`environment-image-row ${className}`}>
      {images.map((image) => (
        <div className="environment-image-row__item" key={image.src} style={{ flexGrow: image.width / image.height, flexBasis: `${100 * (image.width / image.height) / totalRatio}%` }}>
          <SourceImage image={image} />
        </div>
      ))}
    </div>
  )
}

function ProjectHeading({ number, title, id }) {
  return (
    <h3 className="environment-project__heading" id={id}>
      <span className="environment-item-number" aria-hidden="true">{number}</span>
      <span>{title}</span>
    </h3>
  )
}

export default function EnvironmentPage({ active }) {
  return (
    <PortfolioPage
      active={active}
      section="environment"
      title="Environment"
      intro={environmentIntro}
      quote={environmentQuote}
      signSrc={environmentSign.src}
    >
      <div className="environment-content">
        <PortfolioSection id="environment-achievement" title="Achievement">
          <p className="environment-section-intro">{environmentSectionIntros.achievement}</p>
          <EnvironmentAchievements />
        </PortfolioSection>

        <PortfolioSection id="environment-projects" title="Projects">
          <p className="environment-section-intro">{environmentSectionIntros.projects}</p>

          <article className="environment-project" id={banMien.id} aria-labelledby="ban-mien-heading">
            <ProjectHeading number="1" title={banMien.title} id="ban-mien-heading" />
            <p>{banMien.description}</p>
            <div className="environment-project__photographs">
              <ImageRow images={banMien.images.slice(0, 3)} />
              <ImageRow images={banMien.images.slice(3)} />
            </div>
          </article>

          <article className="environment-project" id={ecoWander.id} aria-labelledby="eco-wander-heading">
            <ProjectHeading number="1" title={ecoWander.title} id="eco-wander-heading" />
            <p>{ecoWander.intro}</p>
            <h4 className="environment-paper-label">{ecoWander.workshopTitle}</h4>
            <ImageRow images={ecoWander.workshopImages} />
            <p>{ecoWander.workshopDescription}</p>
            <h4 className="environment-paper-label">{ecoWander.artTitle}</h4>
            <ImageRow images={ecoWander.artImages} />
            <p>{ecoWander.artDescription}</p>
            <h4 className="environment-paper-label">{ecoWander.impactTitle}</h4>
            <p>{ecoWander.impactDescription}</p>
          </article>

          <article className="environment-project" id={greenHanoiAmsterdam.id} aria-labelledby="gha-heading">
            <ProjectHeading number="3" title={greenHanoiAmsterdam.title} id="gha-heading" />
            {greenHanoiAmsterdam.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <EnvironmentTimeline />
          </article>

          <article className="environment-project" id={polygone.id} aria-labelledby="polygone-heading">
            <ProjectHeading number="4" title={polygone.title} id="polygone-heading" />
            <p>{polygone.description}</p>
            <Gallery
              id="environment-polygone-gallery"
              className="environment-polygone-gallery"
              label="Polygone filtration system presentation"
              images={polygone.images}
              mode="continuous"
              autoPlay
            />
          </article>
        </PortfolioSection>

        <PortfolioSection id="environment-intern" title="Intern">
          <p className="environment-section-intro">{environmentSectionIntros.intern}</p>

          <article className="environment-project" id={depMagazine.id} aria-labelledby="dep-magazine-heading">
            <ProjectHeading number="1" title={depMagazine.title} id="dep-magazine-heading" />
            <p>{depMagazine.description}</p>
            <div className="environment-articles">
              {depMagazine.articles.map((article) => (
                <figure className="environment-articles__article" key={article.image.src}>
                  <SourceImage image={article.image} />
                  <figcaption><a href={article.href} target="_blank" rel="noopener noreferrer">{article.caption}</a></figcaption>
                </figure>
              ))}
            </div>
          </article>

          <article className="environment-project" id={greenU.id} aria-labelledby="greenu-heading">
            <ProjectHeading number="2" title={greenU.title} id="greenu-heading" />
            <p>{greenU.description}</p>
            <ImageRow images={greenU.images} className="environment-project__photographs" />
            <p>{greenU.recyclingDescription}</p>
            <SourceImage image={greenU.recyclingImage} className="environment-recycling-image" />
          </article>
        </PortfolioSection>

        <PortfolioSection id="environment-research" title="Research">
          <p className="environment-section-intro">{environmentSectionIntros.research}</p>
          <article className="environment-research" id={environmentResearch.id} aria-labelledby="bioremediation-heading">
            <SourceImage image={environmentResearch.image} />
            <div>
              <h3 id="bioremediation-heading">{environmentResearch.title}</h3>
              <p>{environmentResearch.description}</p>
            </div>
          </article>
        </PortfolioSection>
      </div>
    </PortfolioPage>
  )
}
