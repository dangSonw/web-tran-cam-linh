# Motion settings

The continuous galleries in Environment and Art share `src/components/portfolio/Gallery.jsx`.

- `CONTINUOUS_SPEED_PX_PER_SECOND`: **23 CSS pixels/second**, increased from 18.
- `WHEEL_SCROLL_MULTIPLIER`: **1**. One normalized wheel pixel moves the images by one CSS pixel. Wheel line and page units are converted to pixels.
- Hovering anywhere inside the gallery viewport, including the gaps between images, pauses automatic movement. Wheel input there moves the strip immediately; leaving resumes automatic movement. Ctrl/Meta wheel gestures remain available for browser zoom.
- Horizontal touch dragging and arrow keys move the gallery. Reduced motion disables automatic movement and provides native horizontal scrolling.

The forest terrain in `src/components/portfolio/PortfolioPage.jsx` keeps grass and the beige path in one SVG. They follow normal page scrolling together. `src/lib/useForestScroll.js` fits the path under the introduction after resize and moves the surrounding foliage sideways while scrolling. Hero sizing and sign positions are in `src/components/portfolio/PortfolioPage.css`.

About is static: no scroll animation or artificial exit section. It scrolls only when its content exceeds the viewport.

Achievement panels have independent open/closed state in `src/components/environment/EnvironmentAchievements.jsx`. Event connector geometry is recalculated in `src/components/environment/EnvironmentTimelinePaths.jsx` after layout, font loading, image loading and resize.
