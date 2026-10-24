# Independent finish review packet

Project: D:/Web/web-tran-cam-linh-folio. Existing React/Vite portfolio extension. Read CONTRACT.md before reviewing. This is an Experience surface inside the established Figma visual system, not a replacement design. Source Figma is the quality bar and visual authority; there is no generated or approved AI comp.

## User request

Complete Environment, Art, Other using multiple agents. Read every red Figma annotation. Preserve selectable text and independent components/assets for later expansion. Improve performance, animation and responsive layout without depending on new browser CSS/APIs. Fully test in Chrome. Preserve Open/Home/About and the exact existing resume URL. Do not deploy or push.

## Source and direction evidence

- CONTRACT.md contains the shared direction, ownership, component interfaces and all red annotations.
- design/sections-figma-source.json contains full source trees and red instructions.
- design/environment-frame-map.md, design/arts-frame-map.md, design/others-frame-map.md map every source item and individual asset.
- User reference images: C:/Users/son/AppData/Local/Temp/codex-clipboard-bf1662fa-4969-49b6-ac73-7f6d028ec991.png, codex-clipboard-3db788c7-d1c6-4fb5-a82e-a343ab5841a4.png, codex-clipboard-d82e5021-9f5a-4475-b900-50214756a71f.png, codex-clipboard-fb40760d-9433-4dfc-8fd8-8c2bdc6cb65a.png in the same directory. If unavailable, use saved source metadata/maps; report that limit.
- Craft floor: D:/Web/.agents/skills/impeccable/reference/craft-floor.md.
- Original forest illustration assets and individual source sign exports are used. Copy is DOM text. Handwriting quote assets are original individual lettering exports.

## Required evidence and viewports

All 28 PNG captures are under artifacts/portfolio; results.json lists every path. Review desktop 1440x900, mobile 390x844, tablet 768x1024 for all three routes. The pages own their scroll roots, so body evidence is tiled viewport captures at named sections rather than one document fullPage screenshot.

Required: all *-desktop-hero.png, *-mobile-hero.png, *-tablet-hero.png, *-text-200.png, *-mobile-content.png; environment-achievement-1/2/3.png; environment-desktop-achievement/timeline/polygone/intern/research.png; arts-desktop-concert/exhibition/hat-t0/hat-t1.png; others-desktop-certificates.png. Validate captures before judging. Existing final-sheet JPEGs are contact sheets from before the latest text-zoom/focus correction; prefer original PNG files.

Source instructions: Achievement single expansion and labels sticky until separators; four automatic fades with counts 2/4/2/3 in source order; Polygone five slides; HAT full five-artwork infinite scroll, not clipped source previews. Other has three original certificate displays.

## Implementation and checks

Inspect src/App.jsx, src/components/portfolio/* and each page module/data. Routes are #environment, #arts, #others. Gallery RAF writes transforms/opacity without React state per frame; observer/visibility pause and cleanup. Entrances settle and stop. Timeline paths measure real item geometry and respond to resize/image/font load. Existing Open/Home/About now use viewport media queries instead of container units.

artifacts/portfolio/results.json is the latest complete Chrome suite, 17 dimensions per route, controls, galleries, history, focus, images and text 200 percent. compatibility-results.json adds observer fallback, mobile DPR2/touch and animation lifecycle checks. Read actual outcomes; do not infer a pass from filenames. Previous fresh run found Research grid overflow at text 200 percent; minmax(0,1fr) and min-width:0 fix plus sign width bound have been applied and are being rechecked. Initial focus recovery now handles browser native fragment focus on the section.

About regression artifacts/about/latest-results.json has 18 passing checks; latest-motion-results.json has 7; artifacts/responsive/latest-results.json covers 23 Home resizes and 4 mid-animation resizes. Build and lint pass. Detector artifacts/portfolio/detector.json is empty. Asset provenance scan: 67 rasters, 0 missing.

Compatibility claim is limited: Vite target/cssTarget chrome90, established CSS, optional observer fallbacks, actual installed current Chrome. No historical Chrome binary has been tested. Source Okina DEMO font is unavailable; McLaren fallback is explicitly documented. Preserve factual Figma copy including original unusual punctuation/numbering.

## Reviewer task and write boundary

Fresh independent review, no browser required. Read screenshots and source, audit against user request, source visual system and craft floor. Do not edit implementation. Write artifacts/portfolio/finish-review.md and return five sections: disposition (ship/fix/rebuild/recapture), brief/direction coverage, evidence validity, material findings with concrete paths/severity/fix and release/evidence limits. A failed assertion is a release gate, not permission to claim completion. Focus on material issues. Do not invent facts or reject source-pinned cream/forest/playful typography as a generic aesthetic. If evidence is invalid, disposition recapture with exact list. No delegation, no messages to other agents.
