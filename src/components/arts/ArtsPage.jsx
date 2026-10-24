import PortfolioPage from '../portfolio/PortfolioPage';
import PortfolioSection from '../portfolio/PortfolioSection';
import Gallery from '../portfolio/Gallery';
import { artsContent } from '../../data/artsContent';
import './ArtsPage.css';

function ArtPhoto({ image, className = '' }) {
  return (
    <figure className={`arts-photo ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 600px) 92vw, (max-width: 900px) 70vw, 40vw"
      />
    </figure>
  );
}

export default function ArtsPage({ active }) {
  const { concert, exhibition, hat } = artsContent;

  return (
    <PortfolioPage
      active={active}
      section="arts"
      title="Art"
      intro={artsContent.intro}
      quote={artsContent.quote}
      signSrc={artsContent.signSrc}
    >
      <PortfolioSection
        id="arts-viet-nam-tinh-hoa"
        title={concert.title}
        className="arts-section arts-concert"
      >
        <p className="arts-copy">{concert.description}</p>
        <div className="arts-concert-collage" aria-label="Viet Nam Tinh Hoa concert photographs and artwork">
          <div className="arts-concert-collage__top">
            <ArtPhoto image={concert.images[0]} />
            <ArtPhoto image={concert.images[1]} />
          </div>
          <div className="arts-concert-collage__bottom">
            <ArtPhoto image={concert.images[2]} />
            <ArtPhoto image={concert.images[3]} />
          </div>
        </div>
      </PortfolioSection>

      <PortfolioSection
        id="arts-viet-nam-gam-hoa"
        title={exhibition.title}
        className="arts-section arts-exhibition"
      >
        <h3 className="arts-art-space-title">{exhibition.artSpaceTitle}</h3>
        <p className="arts-copy">{exhibition.introduction}</p>
        <div className="arts-exhibition-row" aria-label="Viet Nam Gam Hoa art space photographs">
          {exhibition.displayImages.map((image) => (
            <ArtPhoto key={image.src} image={image} />
          ))}
        </div>
        <p className="arts-copy arts-copy--impact">{exhibition.impact}</p>
        <div className="arts-exhibition-collage" aria-label="Viet Nam Gam Hoa exhibition photographs">
          <ArtPhoto image={exhibition.featureImages[0]} className="arts-exhibition-collage__poster" />
          <div className="arts-exhibition-collage__visitors">
            <ArtPhoto image={exhibition.featureImages[1]} />
            <ArtPhoto image={exhibition.featureImages[2]} />
          </div>
        </div>
      </PortfolioSection>

      <PortfolioSection
        id="arts-hanoi-amsterdam-art-team"
        title={hat.title}
        className="arts-section arts-hat"
      >
        <p className="arts-copy">{hat.description}</p>
        <Gallery
          id="arts-hat-artworks"
          className="arts-hat-gallery"
          label="Hanoi-Amsterdam Art Team artworks"
          images={hat.images}
          mode="continuous"
          autoPlay={true}
        />
      </PortfolioSection>
    </PortfolioPage>
  );
}
