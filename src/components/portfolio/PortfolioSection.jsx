export default function PortfolioSection({ id, title, className = '', children }) {
  return (
    <section aria-labelledby={`${id}-title`} className={`portfolio-section ${className}`} id={id}>
      <div className="portfolio-section__heading">
        <h2 id={`${id}-title`}><span>{title}</span></h2>
      </div>
      <div className="portfolio-section__body">{children}</div>
    </section>
  )
}
