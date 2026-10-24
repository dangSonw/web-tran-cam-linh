# Environment source and implementation map

## Source and scope

- Figma file: [Tran Cam Linh](https://www.figma.com/design/9yn92xRnvfIDmo0eurW1Ow/Tran-Cam-Linh?node-id=75-68).
- Main frame: Environment `75:68`, 1920 x 11049, Design page `1:2`.
- Main source: `design/sections-figma-source.json`, all Environment descendants and all red annotations read.
- External achievement panels were re-read live through read-only Figma Desktop Bridge: Frame 8 `194:31` and Frame 42 `194:59`.
- External gallery assets were also read live. No selection, page, node, or document mutations were made.
- Implementation: established portfolio extension. The exact supplied Figma composition and the parent CONTRACT substitute for a new visual direction interview. The parent owns shared integration, first viewport, finish review, DESIGN.md, and final Chrome QA.
- Local skills consulted: Impeccable context/new-work/craft-floor, React best practices, and UI/UX Pro Max. No Sites or bundled Visualize skill was used. The Impeccable asset-provenance reference was used solely for metadata embedding.
- Parent shell supplies the forest entrance, Home/sibling navigation, source quote and introduction, and sticky section labels. Owned modules do not duplicate them.

## Owned files

- `src/components/environment/EnvironmentPage.jsx`: default `EnvironmentPage({ active })`, project, internship and research layouts.
- `src/components/environment/EnvironmentAchievements.jsx`: native button accordion with one expanded panel and Arrow Up/Down/Home/End navigation.
- `src/components/environment/EnvironmentTimeline.jsx`: chronological Green Hanoi Amsterdam events and shared Gallery bindings.
- `src/components/environment/environment.css`: scoped desktop/mobile styling, source palette and responsive image layouts.
- `src/data/environmentContent.js`: selectable source text, original asset references and dimensions.
- `src/components/environment/EnvironmentTimelinePaths.jsx`: measured SVG connectors, resize/image/font updates and cleanup.
- `public/images/environment/`: 45 individual original exports, now delivered as 42 WebP files with adjacent provenance JSON and three retained PNGs with embedded origin.
- This source map.

## Source content coverage

### Introduction and achievement

- Quote `75:75` and full two-paragraph introduction `75:77` supplied to PortfolioPage.
- Achievement introduction `107:16`.
- Introduction to Environmental Law and Policy `83:201`, [2026], complete description `97:5`, certificate `97:6`.
- Gold Award | International Invention Innovation Competition in Canada (iCAN) `83:210`, [2026], full external description `194:3`, certificate `194:5`, presentation `217:159`.
- Gold Award | World Invention Creativity Olympics (WICO) `83:228`, [2026], external title `194:101`, full description `194:102`, four laboratory images and full original poster.

### Projects

- Projects introduction `107:19`.
- Ban Mien - Ba Vi `107:20`: complete description `79:195` and all five photographs `107:41,107:42,107:40,107:43,107:44`.
- ECO WANDER `107:53`: full introduction `107:55`, Recycled Glass Art Workshop `107:93`, full description `107:75`, three photographs; Viet Nam Gam Hoa Art Space `107:87`, both photographs and full text `107:88`; Community Impact `107:90` and full text `107:91`.
- Green Hanoi Amsterdam `107:104`: both paragraphs `107:106,107:113` preserved, including the apparent duplicate Eco Wander paragraph in the supplied source.
- Eight timeline events: Member, Code of Culture 2025, Vice President GEN17, First Meeting, Green Life 2026, Tet Am Ap 2026, Camp Blast 2026, Code of Culture 2026. Every source caption/paragraph and all associated original images are included.
- Polygone `108:361`: full text `108:363` and all five original presentation slides.

### Intern and Research

- Intern introduction `108:581`.
- Dep Magazine: full text `112:8`, original article images `112:17,112:26`, and exact selectable Waterless Beauty and Skinimalism captions `112:22,112:29`. No source URLs were supplied; no article links were invented.
- GreenU: full text `114:36`, all three fieldwork photographs `114:53,114:54,114:55`, source recycling paragraph `114:51`, photograph `114:58`.
- Research introduction `108:585`, Bioremediation of polluted waters using microorganism title `114:89`, full description `114:90`, original research image `114:87`.
- Original source spelling, punctuation, duplication, and unusual wording are preserved; notably GreenU's repeated phrase and the word `poẹt`, the singular `microorganism`, and `Sound and Lightning`.
- Project number badges preserve the source's ECO WANDER number `1`; the Figma source is not silently renumbered.

## Red annotation behavior

| Annotation | Required behavior | Implementation |
| --- | --- | --- |
| 107:24 | Achievement sticky until separator; Projects and other main labels follow same behavior | Each body group uses shared PortfolioSection, whose parent-owned heading sticks only within its section |
| 194:154 | Click an achievement category to display its content; other panels collapse | Exactly one expanded native-button panel, first panel open on mount |
| 174:4 / 174:3 | auto fade 0 | First Meeting: 107:136,174:2 |
| 114:222 / 114:226 | auto fade 1, original order | Green Life: 107:149,107:138,107:137,114:221 |
| 114:223 / 114:225 | auto fade 2 | Tet Am Ap: 107:160,107:159 |
| 114:224 / 114:227 | auto fade 3 | Camp Blast: 107:334,107:335,107:336 |
| 114:228 | complete Polygone photos at right | Carousel: 108:365,108:366,108:367,108:368,108:369 |

All four fades use the shared Gallery in `mode="fade"`, `autoPlay={true}`, interval 4500 ms. Polygone uses a manual carousel matching source previous/next affordances. Parent Gallery supplies RAF timing, pause/play, keyboard, pointer/focus pause and touch support. No CSS keyframes or independent animation loops were introduced.

## Original asset provenance

Every row is one original individual Figma node exported directly with `exportAsync({format:'PNG',constraint:{type:'WIDTH',value:...}})`. Exports preserve original transparency. Base64 was decoded locally without printing the payload. Full-page or whole-section screenshots are not shipped. Every PNG embeds its origin as tEXt using the Impeccable embed-prompt command.

The table names the current shipping file. All nodes were originally exported as PNG; source dimensions and export widths remain original export facts. Delivery conversion preserved dimensions and node provenance. WebP files have adjacent `.webp.json` provenance; retained PNGs keep embedded origin. No assets were recompressed during documentation.

| Shipping file under public/images/environment | Source node | Original width x height | Original PNG export width |
| --- | --- | --- | --- |
| environmental-law-certificate.png | 97:6 | 368 x 283 | 720 |
| environment-sign.png | 75:129 | 448 x 405 | 720 |
| ican-certificate.png | 194:5 | 254 x 338 | 600 |
| ican-presentation.webp | 217:159 | 480 x 338 | 1000 |
| wico-laboratory-1.webp | 194:106 | 342 x 236 | 720 |
| wico-laboratory-2.webp | 194:107 | 342 x 237 | 720 |
| wico-laboratory-3.webp | 194:109 | 342 x 236 | 720 |
| wico-laboratory-4.webp | 194:110 | 342 x 236 | 720 |
| wico-research-poster.webp | 194:111 | 345 x 488 | 800 |
| ban-mien-herbs.webp | 107:41 | 301 x 401 | 600 |
| ban-mien-community.webp | 107:42 | 301 x 401 | 600 |
| ban-mien-clean-energy.webp | 107:40 | 356 x 401 | 720 |
| ban-mien-tree-planting.webp | 107:43 | 483 x 362 | 900 |
| ban-mien-traditional-cakes.webp | 107:44 | 483 x 362 | 900 |
| eco-workshop-1.webp | 107:96 | 319 x 213 | 720 |
| eco-workshop-2.webp | 107:97 | 319 x 213 | 720 |
| eco-workshop-3.webp | 107:98 | 319 x 213 | 720 |
| eco-art-space-1.webp | 107:78 | 486 x 324 | 900 |
| eco-art-space-2.webp | 107:79 | 486 x 324 | 900 |
| gha-member.webp | 107:124 | 420 x 279 | 800 |
| gha-vice-president.webp | 107:128 | 294 x 448 | 600 |
| gha-first-meeting-1.webp | 107:136 | 509 x 339 | 850 |
| gha-first-meeting-2.webp | 174:2 | 509 x 339 | 850 |
| gha-green-life-1.webp | 107:149 | 486 x 305 | 850 |
| gha-green-life-2.webp | 107:138 | 509 x 340 | 850 |
| gha-green-life-3.webp | 107:137 | 509 x 339 | 850 |
| gha-green-life-4.webp | 114:221 | 509 x 340 | 850 |
| gha-tet-1.webp | 107:160 | 509 x 339 | 850 |
| gha-tet-2.webp | 107:159 | 511 x 341 | 850 |
| gha-camp-blast-1.webp | 107:334 | 486 x 324 | 850 |
| gha-camp-blast-2.webp | 107:335 | 457 x 305 | 850 |
| gha-camp-blast-3.webp | 107:336 | 457 x 305 | 850 |
| gha-code-of-culture.webp | 107:349 | 510 x 320 | 850 |
| polygone-slide-1.webp | 108:365 | 797 x 448 | 1200 |
| polygone-slide-2.webp | 108:366 | 797 x 448 | 1200 |
| polygone-slide-3.webp | 108:367 | 797 x 448 | 1200 |
| polygone-slide-4.webp | 108:368 | 797 x 448 | 1200 |
| polygone-slide-5.webp | 108:369 | 797 x 448 | 1200 |
| dep-waterless-beauty.webp | 112:17 | 542 x 293 | 1000 |
| dep-skinimalism.webp | 112:26 | 542 x 293 | 1000 |
| greenu-fieldwork-1.webp | 114:53 | 301 x 401 | 600 |
| greenu-fieldwork-2.webp | 114:54 | 301 x 401 | 600 |
| greenu-fieldwork-3.webp | 114:55 | 356 x 401 | 720 |
| greenu-recycling.webp | 114:58 | 708 x 497 | 1100 |
| bioremediation-research.webp | 114:87 | 278 x 405 | 650 |

## Visual system and responsive behavior

The main frame uses cream paper, olive strips, pale yellow heading text and green body text. Body McLaren remains inherited from the established app. Source heading font is Okina DEMO; CSS requests `Okina` with McLaren fallback. Only McLaren is supplied, so exact source heading typography remains unresolved. The finish correction uses green ink `#4e6333` and olive header/control fill `#50643b`; the existing yellow and cream surfaces are preserved. See `DESIGN.md` for the implemented system.

At <=720 px, achievement rows wrap into a readable multi-line layout, certificate layouts and Dep articles stack, timeline switches to one chronological column, and research stacks its document above the text. Native dimensions reserve image space, images lazy load, and no page-wide fixed widths are introduced. Timeline uses a restrained connecting rule and markers; it preserves chronological/alternating source organization without exporting whole layouts as images.

## Checks and integration selectors

Original module validation (historical):
- `npx oxlint src/components/environment src/data/environmentContent.js`: exit 0.
- Impeccable detector over all five owned source files: `[]`, exit 0.
- Raster provenance scan: `SCAN: 45 rasters, 0 missing`.
- Node source-content coverage: 45 image references, 0 missing files, 0 omitted main-frame content text; fades 2/4/2/3; Polygone slides 5.
- Figma bridge read-only external content and all 45 PNG exports completed.
- Current shared integration results and reproduction commands are recorded in `artifacts/portfolio/README.md`; consult its live JSON files and actual finish-review verdict before a completion claim.

Useful selectors:
- Main page: `[data-portfolio-page="environment"]` or `#environment` (parent shell).
- Sections: `#environment-achievement`, `#environment-projects`, `#environment-intern`, `#environment-research`.
- Accordion: `[data-environment-accordion]`, `.environment-achievement__button[aria-expanded="true"]`, `.environment-achievement__panel:not([hidden])`.
- Award panel IDs: `#environment-achievement-panel-environmental-law`, `#environment-achievement-panel-ican`, `#environment-achievement-panel-wico`.
- Timeline events: `[data-environment-event]` (8).
- Auto fades: `[data-fade-sequence="0"]`, `[data-fade-sequence="1"]`, `[data-fade-sequence="2"]`, `[data-fade-sequence="3"]`.
- Gallery IDs: `#gha-first-meeting-gallery`, `#gha-green-life-gallery`, `#gha-tet-am-ap-gallery`, `#gha-camp-blast-gallery`, `#environment-polygone-gallery`.
- Content endpoints: `#ban-mien`, `#eco-wander`, `#green-hanoi-amsterdam`, `#polygone`, `#dep-magazine`, `#greenu`, `#bioremediation`.

Parent Chrome QA should exercise each achievement panel and arrow/Home/End keys; verify max one expanded panel; compare all four fades at t0/t1; advance through all five Polygone slides; pause/resume Galleries; inspect 390px and 1440px layouts; confirm sticky label stops at section separators; check image loading and console output; and verify shared Okina font binding. No external publishing/deployment/push was performed.

