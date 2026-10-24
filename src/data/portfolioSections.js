export const PORTFOLIO_SECTIONS = Object.freeze([
  { key: 'environment', hash: '#environment', label: 'Environment' },
  { key: 'arts', hash: '#arts', label: 'Art' },
  { key: 'others', hash: '#others', label: 'Other' },
])

export function getPortfolioRoute() {
  const hash = window.location.hash
  if (hash === '#about-me') {
    return 'about'
  }
  const section = PORTFOLIO_SECTIONS.find((item) => item.hash === hash)
  return section ? section.key : 'home'
}
