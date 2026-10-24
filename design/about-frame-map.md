# About me — source and extension map

Source: Figma document **Trần Cẩm Linh**, file `9yn92xRnvfIDmo0eurW1Ow`, frame `58:349`, 1920 × 1080.
Read through the connected Desktop Bridge on 2026-10-23. The supplied screenshot and the live frame establish the composition.

## Direction contract

THESIS: Extend the existing illustrated forest portfolio with the original About me composition and readable, interactive content.
OWN-WORLD: Cyan sky rings, textured trees and pink shrubs, cream path, purple paper lettering, green handwriting, and McLaren body copy.
STORY: Follow About me from Home, meet Linh Tran, read her introduction, open her resumé, and return to Home.
FIRST VIEWPORT: Centered hanging sign and portrait above the greeting, biography, and resumé. Desktop retains the forest framing; portrait layouts reserve the center for readable text.
FORM: The user supplied the Figma composition. No new visual concept was selected. Desktop uses the source coordinates; responsive adaptation preserves the subject and interaction order.
FINISH: Rendered Chrome captures, interaction checks, asset provenance, and the component map are the completion evidence.

## Main components

| Component | Responsibility |
| --- | --- |
| AboutPage / AboutPortrait | Semantic page, hanging title, source portrait, Back to Home |
| AboutIntroduction | Greeting, selectable biography, resumé link |
| AboutForest / IllustrationLayer | Independent sky, meadow, path, trees and shrubs |
| useAboutMotion | Shared spring state, RAF entrance and pointer movement, cleanup |
| aboutFrameLayers | Node IDs, source positions, illustration references, copy and URL |
| App | Hash history, Open/Home state, focus and gesture isolation |

## Artwork provenance

Illustration exports use `exportAsync({ format: 'PNG', useAbsoluteBounds: true })` on each original node.
They are embedded as independently addressable symbols in five local SVG resource files. The filenames group transfers; they do not flatten the scene.
Each symbol ID is `layer-<Figma-node-id-with-dash>`. Desktop positions are percentages of 1920 × 1080.
The original path is source vector geometry from `75:141`; sky rings are source ellipses `58:350`, `58:351`, `58:352`.

| Node | Source position x, y | Export size | Resource |
| --- | --- | --- | --- |
| `58:414` | 227.000, 374.000 | 265 × 134 | forest-layers-1.svg |
| `58:353` | 1322.000, -241.000 | 536 × 777 | forest-layers-1.svg |
| `58:356` | -187.147, -592.000 | 943 × 1123 | forest-layers-1.svg |
| `58:377` | 190.000, 451.000 | 265 × 134 | forest-layers-1.svg |
| `58:413` | 1419.000, 432.000 | 265 × 134 | forest-layers-2.svg |
| `58:361` | -456.000, -764.000 | 1250 × 1490 | forest-layers-2.svg |
| `58:360` | 121.000, 535.000 | 353 × 179 | forest-layers-2.svg |
| `58:367` | -368.000, -430.000 | 922 × 1173 | forest-layers-2.svg |
| `58:370` | 1225.000, -382.000 | 862 × 1027 | forest-layers-3.svg |
| `58:364` | -40.000, 595.000 | 474 × 263 | forest-layers-3.svg |
| `58:373` | -132.000, 716.000 | 487 × 271 | forest-layers-3.svg |
| `58:376` | 1445.000, 552.000 | 378 × 191 | forest-layers-3.svg |
| `58:378` | 1302.000, -654.000 | 1074 × 1556 | forest-layers-4.svg |
| `58:381` | 1384.000, 619.000 | 557 × 309 | forest-layers-4.svg |
| `58:384` | 1531.000, -37.000 | 616 × 1117 | forest-layers-4.svg |
| `58:385` | -217.000, -96.000 | 646 × 1266 | forest-layers-4.svg |
| `58:386` | -260.000, 848.000 | 744 × 353 | forest-layers-5.svg |
| `58:389` | 1449.000, 806.000 | 711 × 394 | forest-layers-5.svg |
| `75:140` | -6.000, 404.000 | 1926 × 703 | forest-layers-5.svg |

Additional source nodes:
- `74:63`: hanging About me sign, captured at 2× with transparency.
- `114:333`: original portrait, captured at 2× and encoded as WebP at quality 92; 870 × 548, 127752 bytes.
- `64:3`: original MJ Whitegone greeting, captured as separate transparent lettering.
- `64:6`: original MJ Whitegone resumé lettering, captured separately.
- `64:5`: original biography rendered as selectable HTML using McLaren.

The two display lettering exports retain their accessible text alternatives. Their font outlines could not be exported reliably as SVG through this bridge, so their transparent raster exports are retained inside separate SVG resources.

## Responsive rules

Desktop keeps the source composition. Biography text is enlarged for readability and constrained by viewport width and character count.
Portrait viewports and widths below 760px use a centered crop, source tree edge crops, and an expanded cream path behind the copy.
Short windows allow native vertical scrolling. The resumé remains reachable instead of shrinking the biography below 16px.
A single About me page tree is used across all sizes.

## Navigation and extension

- `#about-me` opens directly and survives reload.
- `#home` opens directly, or returns from About me.
- Browser Back/Forward uses native hash history.
- Escape returns from About me to Home; the next Enter can reopen the focused About me sign.
- While About me is open, Home is inert and wheel/touch input is left to native scrolling.
- Change copy and the resumé destination in `ABOUT_CONTENT`.
- Change an illustration or add per-layer motion by its `data-layer-id` and manifest entry.
- Add future pages at the route boundary in App, preserving the current input isolation.

## Resumé link evidence

The implementation uses the resumé URL explicitly supplied by the user on 2026-10-23:
`https://drive.google.com/file/d/1JWuDqlU5EpR0llFK-OCUFfjW0kKleWaU/view?usp=sharing`.

This explicit user confirmation supersedes the hyperlink previously read from Figma node `64:6`.
The navigation test verifies a new tab opens at the configured URL using an intercepted response; it does not claim to validate Google Drive file permissions.

## Validation

See `artifacts/about/README.md`, `results.json`, and `open-home-regression-results.json`.
All production UI checks passed with no console errors or warnings. Touch uses Chrome emulation, not a physical device.
