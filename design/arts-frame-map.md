# Arts source map

## Scope and visual authority

This module extends the existing illustrated forest portfolio. It uses the shared cream page, original forest hero, hanging sign, McLaren copy, highlighted section labels and sticky two-column section flow specified in `CONTRACT.md`. Source: Figma file `9yn92xRnvfIDmo0eurW1Ow`, Design page, Arts frame `108:376` (1920 × 4087). Read live through the Desktop Bridge on 2026-10-24. Figma was read only; selection, page, nodes and document content were not changed.

The full nested Arts tree was read from `design/sections-figma-source.json` and re-read live together with external Frame 36 `114:215`. All raster exports are individual source figures or the individual hanging sign. No page, paragraph, multi-photo collage or section screenshot is shipped as an asset.

## Implementation ownership

- `src/components/arts/ArtsPage.jsx`: default `ArtsPage({ active })`, page body and individual source figures.
- `src/components/arts/ArtsPage.css`: Arts-only collage and responsive styles.
- `src/data/artsContent.js`: exact source copy, image order, dimensions and node provenance.
- `public/images/arts/`: 16 individual source exports: 15 WebP body images with adjacent provenance JSON and the retained PNG sign listed below.
- This map: source coverage and integration evidence.

The parent owns `PortfolioPage`, `PortfolioSection`, `Gallery`, routes, global styles and production browser QA. This module does not implement a second hero, navigation or animation loop. The shared `PortfolioPage` receives source intro, quote and hanging sign. Each main source label uses `PortfolioSection` so sticky labels stop at the shared separator boundaries.

## Text coverage

| Source node | Shipping location | Coverage |
| --- | --- | --- |
| `108:575` | Original hanging sign export | Original “Arts” lettering preserved; shared accessible page title is “Art”. |
| `174:5` | `artsContent.quote` → shared hero | “The Earth without art is just eh.” |
| `114:91` | `artsContent.intro` → shared hero | All three original paragraphs, including their paragraph breaks. |
| `114:123` | Concert section label | `"Viet Nam Tinh Hoa"` / `Music Concert`. |
| `114:125` | Concert paragraph | Full Art Collaborator / recycled glass exhibition paragraph. |
| `114:159` | Exhibition section label | `"Viet Nam Gam Hoa"` / `Exhibition`. |
| `114:172` | Exhibition H3 | `“Viet Nam Gam Hoa” Art Space`. |
| `114:162` | Exhibition introduction | Full return-to-traditional-mediums / broken-glass paragraph. |
| `114:185` | Exhibition impact paragraph | Full community impact / charity paragraph, preserving source punctuation `sales—-which`. |
| `114:188` | HAT section label | `Hanoi-Amsterdam` / `Art Team`. |
| `114:193` | HAT introduction | Full first-high-school-club / first-home paragraph. |
| `114:214` | Development instruction only | Infinite auto-scroll instruction implemented through shared marquee; red annotation omitted from visitor copy. |

## Asset provenance

All files below originate from the user's Figma file. Original export format: PNG via `node.exportAsync`, with original source colour and cropping. Dimensions below preserve the original PNG IHDR measurements. The shipping body files were subsequently optimized to WebP with dimensions preserved; each has adjacent `.webp.json` provenance. The original hanging sign remains PNG. Photo/source names and exact Figma nodes remain unchanged. No assets were recompressed during documentation.

| Shipping file under `public/images/arts/` | Figma node | Original source name | Original PNG export dimensions |
| --- | --- | --- | --- |
| `arts-sign.png` | `108:571` | Group 9, individual hanging Arts sign | 500 × 441 |
| `tinh-hoa-concert-gathering.webp` | `114:146` | Bản sao của 0Z4A1321 | 1200 × 799 |
| `tinh-hoa-concert-stage.webp` | `114:144` | Bản sao của VHX06706 | 1200 × 799 |
| `tinh-hoa-concert-artwork.webp` | `114:145` | Bản sao của [ARIA PROJECT] DESIGN | 1000 × 1000 |
| `tinh-hoa-concert-team.webp` | `114:150` | Bản sao của Bản sao của VHX05842 1 | 1200 × 801 |
| `gam-hoa-art-display.webp` | `114:180` | Bản sao của 0Z4A1379 | 1000 × 667 |
| `gam-hoa-artists.webp` | `114:176` | Bản sao của DSC06294 | 1000 × 667 |
| `gam-hoa-art-space.webp` | `114:177` | Bản sao của VHX05869 | 1000 × 667 |
| `gam-hoa-exhibition-poster.webp` | `114:178` | Bản sao của VHX05872 | 900 × 1352 |
| `gam-hoa-presentation.webp` | `114:175` | Bản sao của DSC06138 | 1200 × 636 |
| `gam-hoa-visitors.webp` | `114:179` | Bản sao của VHX06058 | 1200 × 633 |
| `hat-interview-results.webp` | `114:216` | 482240295_966199882324286_8660893541916703455_n | 1000 × 1000 |
| `hat-talk-show.webp` | `114:217` | 483101087_966107449000196_3494010922881234648_n | 1000 × 1000 |
| `hat-spring-artwork.webp` | `114:218` | 486825590_978788391065435_6436444136213217829_n | 1000 × 1000 |
| `hat-summer-artwork.webp` | `114:219` | 511089637_1044214157856191_3424298060308231869_n | 1000 × 1000 |
| `hat-autumn-artwork.webp` | `114:220` | 557988685_1120628823548057_5346692626381049164_n | 1000 × 1000 |

## Composition and behavior coverage

Concert follows source Frame 33 `114:153`: two equal landscape photos above, square artwork and wide group photo below, each as a separate `<img>`. Exhibition follows Frame 17 `114:161`: original highlighted art-space heading, introduction, three-photo display row, full impact paragraph, then a portrait poster beside two landscape visitor photos. Width ratios derive from source dimensions (389:583 for the concert lower row; 405:565 for the exhibition collage). No photograph is cropped again by CSS.

The HAT instruction `114:214` explicitly says to auto-scroll infinitely using the full sequence below. The implementation uses external Frame 36 `114:215`, not clipped inner Frame 36 `114:213`. The complete external children, ordered by source x position, are `114:216`, `114:217`, `114:218`, `114:219`, `114:220` at x = 0, 403, 806, 1209, 1612. `Gallery` receives all five images, `mode="marquee"`, `autoPlay={true}`, id `arts-hat-artworks`. Shared Gallery owns the seamless repeat, RAF lifecycle, manual controls and pause behavior.

All body copy remains selectable DOM text. Images include descriptive alt text, natural dimensions, async decoding and lazy loading. No independent CSS keyframes, timers, WebGL, animation hooks, advanced CSS APIs, packages or remote image hosts are added. Mobile body text is 16px; exhibition photos stack below 420px, while the concert collage retains its paired arrangement. Native page scrolling and gallery controls are shared.

The current shared marquee measures the complete strip on resize, uses RAF at 32px/s, and stops work when offscreen, document-hidden, paused or unmounted. Focus/pointer entry pauses automatically; explicit Play overrides the current interaction pause until the next relevant interaction. The descriptive playback status reports actual state. The counter remains truthfully `5 artworks` across automatic and manual movement. Shared cleanup cancels RAF and removes resize/visibility listeners and observers; no per-frame React state is introduced. See root README for the Gallery interface and adding content/modes. Scoped composition uses viewport media queries, not container queries.

## Parent integration checklist

Useful selectors: `#arts`, `#arts-viet-nam-tinh-hoa`, `#arts-viet-nam-gam-hoa`, `#arts-hanoi-amsterdam-art-team`, `#arts-hat-artworks`, `.arts-concert-collage`, `.arts-exhibition-row`, `.arts-exhibition-collage`, `.arts-art-space-title`.

Verify the complete page on the local HTTP server at desktop and phone sizes after all shared components are integrated. Confirm the marquee's transform changes over time, all five HAT images appear, the loop seam is continuous, pause/play and keyboard controls work, inactive pages stop gallery motion, headings/labels remain readable, section labels stop at each separator, every local image loads, console is clear and the document has no horizontal overflow. The original hanging-sign PNG includes its source rope artwork; its visible export bounds are 500 × 441 and should be checked in the shared hero.

Shared integration evidence and reproduction commands are indexed in `artifacts/portfolio/README.md`. The actual finish-review verdict remains authoritative. `DESIGN.md` and `.impeccable/design.json` now capture the implemented incumbent system. This map preserves the original raster origin chain.

## Original module validation

The following module checks are historical. Current Chrome results are in the shared evidence index and are distinct from an independent visual approval.

- Exact-copy comparison against all ten shipping text nodes in `design/sections-figma-source.json`: 10/10 identical, including paragraph breaks, smart quotes and source punctuation.
- Local source references: all 15 body images exist; sign PNG also exists; PNG headers were inspected for their actual natural dimensions.
- HAT sequence: all five external node IDs present in the original order, `114:216` through `114:220`.
- `oxlint src/components/arts/ArtsPage.jsx src/data/artsContent.js`: exit 0, no findings.
- Impeccable detector on `ArtsPage.jsx` and `ArtsPage.css`: exit 0, empty findings array.
- UI/UX stack-search script could not run with the default shell Python command. The verified Figma source, loaded skill priority guidance and detected React package stack governed the implementation.
