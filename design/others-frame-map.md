# Others — Figma coverage and implementation

Source: supplied Figma file `9yn92xRnvfIDmo0eurW1Ow`, Others frame `114:234`, 1920 × 2197. Read the complete nested saved tree and inspected the live frame, all text nodes, certificate image fills, label colors/rotations, and original individual image nodes on 2026-10-24. The frame has no red behavioral instructions and no external sequence to resolve.

## Composition and coverage

The shared `PortfolioPage` supplies the source forest entrance, hanging page title, exact introduction, navigation and footer. This module adds the complete source achievement display below it. It deliberately uses the source's three parallel hanging displays instead of a sticky left section label, which this particular frame does not contain. Reading order follows source horizontal placement: AIMO, innovation competition, psychology Olympiad. Every source year is `[2026]`.

- Introduction: `114:287`, reproduced verbatim in `OTHERS_INTRO`.
- Page title: `114:340`, “Others”; the shared shell displays the existing source navigation sign and a semantic H1.
- AIMO group: `114:395`; source title lines `114:348`, `114:365`; year `114:350`; sign geometries `114:347`, `114:346`, `114:366`; certificate `114:344`.
- Innovation group: `114:390`; source title lines `114:360`, `114:362`; year `114:361`; sign geometries `114:357`, `114:359`, `114:363`; certificate `114:364`.
- Psychology group: `114:389`; source title lines `114:383`, `114:384`; year `114:385`; sign geometries `114:377`, `114:381`, `114:382`; certificate `114:387`.
- Shared source forest artwork: all nested nodes in `224:99` and sky `114:235` were read; the shared parent component owns their implementation.

Source titles are selectable text, preserving “Asia International Mathematic Olympiad”, “High School Student Innovation Competition”, and “International Psychology Olympiad” exactly. The source certificate for the middle display names the High School Social Impact Challenge; this original wording is retained in its accessible certificate text and caption, without changing the source display title.

Additional selectable captions transcribe the actual evidence in the supplied certificates: Bronze Medal, National Final Round of AIMO 2025–2026, May 23, 2026; Top 15 Finalist in HSSIC 2026, June 27, 2026; Excellence in IPSYO 2026, July 21, 2026. No award or claim was invented. Certificates link to the original local image in a new browser tab so visitors can inspect every detail.

## Shipping asset provenance

All assets below are original individual Figma node exports via read-only `exportAsync`, in PNG format. All six current shipping files remain PNG; no WebP counterpart exists in this module, so the filenames and original export widths below are retained. Certificates retain their supplied document content; shrubs retain the original illustration contours and alpha. No whole frame, section or paragraph screenshot is shipped. Each PNG embeds the exact Figma origin and export details with Impeccable `embed-prompt`. No assets were recompressed during documentation.

| File under `public/images/others/` | Figma node | Export width | Purpose |
| --- | --- | --- | --- |
| `aimo-certificate.png` | `114:344` | 1400 px | Original AIMO certificate, baked source orientation |
| `hssic-certificate.png` | `114:364` | 1000 px | Original HSSIC certificate, baked source orientation |
| `ipsyo-certificate.png` | `114:387` | 1200 px | Original IPSYO certificate |
| `shrub-dark-green.png` | `114:409` | 800 px | Left display's original masked illustration |
| `shrub-pink.png` | `114:412` | 800 px | Middle display's original masked illustration |
| `shrub-green.png` | `114:417` | 800 px | Right display's original masked illustration |

## Implementation and accessibility

Files: `src/components/others/OthersPage.jsx`, its scoped `OthersPage.css`, and `src/data/othersContent.js`. The default export accepts `OthersPage({ active })` and uses the contract's shared `PortfolioPage`. No dependency, global stylesheet, route file, shared component, Open/Home/About module, or other agent file is changed.

Desktop preserves the three-column composition, shrubs, two suspension cords, overlapping yellow title strips and landscape certificates. Below 760px the displays stack in source order; each uses its available width, with selectable titles that can wrap rather than clip. Text uses the project's self-hosted McLaren face; the Figma-only Okina DEMO face is absent from the current project, so the shared incumbent font is the honest typography limitation.

The source does not request animated achievements. This module adds no animation loop or CSS keyframes; shared entrance motion stays with `PortfolioPage`. Images reserve space, certificates lazy-load, decorative shrubs have empty alt text, each article is named by its heading, certificate links have descriptive accessible labels and visible 44px action labels, keyboard focus is visible, and verified award/date captions are selectable.

## Checks and integration handoff

Original module validation: Impeccable mechanical detector on the new component and stylesheet returned `[]`. Current shared HTTP/Chrome evidence, responsive screenshots and reproduction commands are indexed in `artifacts/portfolio/README.md`. `DESIGN.md` and `.impeccable/design.json` record the actual incumbent system. A passing script is distinct from the actual independent finish-review verdict.

Useful selectors: `#others`, `[data-portfolio-page="others"]`, `.others-achievements__display`, `[data-other-achievement="aimo"]`, `[data-other-achievement="hssic"]`, `[data-other-achievement="ipsyo"]`, `.other-achievement__sign h3`, `.other-achievement__certificate-link`, `.other-achievement__certificate figcaption`.

Final review should cover 1440px, 1024px, 768px, 390px and a narrow 320px viewport; all three source achievements and original certificate images; keyboard focus and opening a certificate; absence of horizontal overflow; image loading; and shared hero/navigation behavior when entering and leaving `#others`.

The shared page sign entrance cleans up RAF work and focus listeners on unmount; this module adds no loop. Certificate geometry follows normal responsive flow and intrinsic image dimensions. Shared section navigation and the three-display grid use viewport media queries rather than container queries. Add a source achievement through `OTHER_ACHIEVEMENTS`, preserve its source group/certificate/shrub IDs and exact source title, and map each additional individual export here. Current Chrome/mobile emulation evidence does not establish physical-device or historical-Chrome coverage.
