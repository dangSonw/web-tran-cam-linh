# Independent finish verdict

## 1. Disposition — SHIP

All four material items in `artifacts/portfolio/finish-review.md` are **resolved** on the source, saved results, refreshed captures and final documentation inspected in this pass. This is a bounded approval of those four corrections within the original source-pinned Figma forest direction. It is not a new defect hunt, a redesign approval or full-surface certification. No rebuild or further recapture is required for these four items.

The implementation preserves the existing cream paper, forest illustrations, purple copy, olive/yellow labels, original individual assets and selectable factual content. No new product identity, interview or invented product facts were needed for this verdict.

## 2. Scope and evidence

I read `CONTRACT.md`, `artifacts/portfolio/REVIEW-PACKET.md` and the original `finish-review.md` before assessing the four findings. I inspected the updated shared `Gallery.jsx`/`Gallery.css`, the affected Environment styles and shared palette token, the focused test source, the actual three result JSON files, the twelve captures listed below, and the final documentation. I did not read shipped agent-definition files, drive a browser, rerun tests, spawn agents or edit implementation, tests, assets or other documentation. This verdict is the only file written by this pass.

The actual saved results record:

| Evidence | Result read in this pass | Relevant support |
| --- | --- | --- |
| `artifacts/portfolio/results.json` | `passed: true`; 57/57 checks; `failures: []`; `errors: []` | Main routes, responsive sizes, accordion/sticky behavior, gallery sequences and controls, images, text 200%, history/focus and console/HTTP checks. It enumerates 28 original PNG captures. |
| `artifacts/portfolio/compatibility-results.json` | `passed: true`; 15/15 checks; `errors: []` | Timeline geometry, root text sizing, visibility/unmount lifecycle, missing-observer fallbacks and synthesized mobile touch/DPR2. |
| `artifacts/portfolio/review-fixes-results.json` | `passed: true`; 13/13 checks; `errors: []` | Keyboard and touch playback while button focus remains, pointer override, later interaction pause, computed contrast, two marquee tile boundaries and truthful count after autoplay/manual movement. |

These are saved execution results, not tests executed by this reviewer. The parent reports that the latest production build and lint passed and that the main suite refreshed all 28 originals. The complete original capture set was accepted in the original review; this correction pass visually re-inspected the targeted and representative subset below rather than claiming a second inspection of all 28.

## 3. Capture validity

I opened every capture named here and read its PNG dimensions:

| Captures | Dimensions | Assessment |
| --- | --- | --- |
| `review-focused-fade-play.png` | 1440 × 900 | Loaded First Meeting artwork and visible focused Pause control. Useful corroboration of the retained-focus test result. |
| `review-focused-marquee-t0.png`, `review-focused-marquee-t1.png` | 1440 × 900 each | Both contain complete loaded artwork in the gallery window. The artwork positions differ substantially, while the playback button retains its visible focus outline and the label remains `5 artworks`. The t0 capture is not blank or an undecoded-image capture. |
| `review-touch-play.png` | 780 × 1688 pixels | Valid 390 × 844 CSS-pixel mobile capture at DPR2, with loaded Tet Am Ap artwork, controls and readable surrounding note content. |
| `environment-desktop-achievement.png`, `environment-desktop-timeline.png`, `environment-desktop-research.png` | 1440 × 900 each | Corrected green/yellow and cream/olive pairings are present in coherent source-derived layouts, with loaded photographs and research artwork. |
| `arts-desktop-hat-t0.png`, `arts-desktop-hat-t1.png` | 1440 × 900 each | Loaded original artwork, changed strip positions and stable artwork count; controls remain within the gallery composition. |
| `environment-text-200.png`, `arts-text-200.png`, `others-text-200.png` | 390 × 844 each | Enlarged DOM text and wrapped navigation are visible within the intended viewport. These are useful representative text-sizing captures, not every section at every zoom setting. |

All twelve are valid browser viewport captures. None is empty, broken, a contact sheet or a substituted full-frame Figma screenshot. I did not use the stale JPEG contact sheets. A still image alone cannot prove playback, focus retention or a two-boundary journey; those conclusions additionally rely on the actual focused test assertions and the inspected implementation. The focused test waits for the HAT image `decode()` promises and two RAF callbacks before t0.

## 4. Original material items

### Item 1 — Recurring normal-text contrast: RESOLVED

`src/components/environment/environment.css:3` now defines Environment green as `#4e6333`, inherited by the recurring note/research copy on `#ebe66c`. The header olive and shared control green are `#50643b`; gallery cream remains `#fff5cd`. This is a narrow correction within the existing source palette.

The focused results measure rendered computed pairs at **5.0904:1** for timeline notes and research, **4.8466:1** for yellow achievement-title copy on its olive header, and **5.9479:1** for cream gallery playback text on its olive background. Each exceeds 4.5:1. `Gallery.css:60–62` uses the darker `#4c6235` hover/active fill; an independent calculation from the source colors gives **6.1803:1** against cream. The Environment header hover `#52663b` computes to **4.7075:1** against its yellow title copy. Representative achievement, timeline, research and gallery captures were visually inspected after the correction. This resolves the original selected text-pair failure; it does not claim a comprehensive accessibility audit of every element.

### Item 2 — Focused Play cannot actually resume: RESOLVED

`src/components/portfolio/Gallery.jsx:34–40` adds an explicit interaction override to the actual `canPlay` gate. `togglePlayback` at line 171 enables it on an explicit Resume action. Current focus or hover therefore no longer prevents that action from starting playback; the later relevant focus/pointer event resets the override. Visibility, hidden-document and explicit user-pause gates remain part of the actual playback calculation.

The focused test activates the fade control with **Enter**, leaves the button focused, immediately asserts `data-playing="true"`, then observes a real index change after 5100ms. It activates the marquee with **Space** and observes travel across at least two tile boundaries while focus remains. The mobile test taps Resume, confirms button focus remains and actual playback starts, then observes a real index change. A pointer case resumes under retained hover, and the next focus interaction is verified to pause again. All corresponding saved assertions pass.

The button has a descriptive Resume/Pause automatic-playback action label and `aria-describedby` pointing to the actual-state `role="status"` text at `Gallery.jsx:252–257`. The status distinguishes running, explicit pause and temporary interaction/visibility pause. The captures corroborate the focused-running states. No claim of an independent screen-reader run is made.

### Item 3 — HAT counter disagrees with autoplay: RESOLVED

`src/components/portfolio/Gallery.jsx:249` now renders `${images.length} artworks` for marquee mode, yielding **5 artworks** for HAT. It does not represent a stale slide index as the currently visible artwork and adds no per-frame React state.

The focused test measures the actual strip transform and tile geometry, waits long enough to traverse two complete tile widths, and verifies the stable count after autoplay and after a manual next action. Both checks pass. The focused t0/t1 and representative HAT captures show the same truthful count despite different artwork positions.

### Item 4 — Durable system documentation and current source maps: RESOLVED

Documentation was inspected at the end of the UI verdict pass, after the concurrent documentation writes became available. `DESIGN.md` now exists and records the incumbent palette, type and unavailable Okina limitation, shared components, Environment/Art/Other composition, responsive rules, motion and lifecycle behavior. `.impeccable/design.json` records `schemaVersion: 2`, the same corrected colors, component previews and motion/breakpoint metadata. The root `README.md` records module responsibilities, APIs, source authority, extension guidance, the exact existing resume destination and release limits. These documents describe the existing illustrated forest system rather than inventing a replacement identity.

The final `design/environment-frame-map.md` table maps **42 WebP plus three PNG** files to their original individual Figma nodes. The final `design/arts-frame-map.md` table maps **15 WebP plus the PNG sign**, retaining the original nodes, source names and PNG export dimensions. `design/others-frame-map.md` correctly records **six retained PNGs**. Actual Art/Other data references and directory contents agree with those delivery formats. The complete HAT sequence remains `114:216` through `114:220`; Environment's source sequences and external node references remain preserved. WebP delivery provenance uses adjacent JSON; retained PNG origin is documented as embedded metadata. I confirmed `public/fonts/OFL-McLaren.txt` is present.

`artifacts/portfolio/README.md` is present at the final read and indexes the actual 57/15/13-check results, representative contrast measurements, capture scope, reproduction commands, provenance and explicit evidence limits. Its pending-follow-up statement accurately predates this verdict; this file supplies that independent follow-up. The parent reports a passing scan of all **67 shipping rasters with zero missing provenance**. That reported binary scan was not independently rerun in this review. The original absence of a system document and the stale shipping-format maps are resolved.

## 5. Limits

SHIP applies only to the four original material items and the evidence inspected for them. It is not a full-surface accessibility, content, browser or performance certification. The original source-pinned direction and factual-copy assessment remain the basis of the work; no new factual-copy or resume-access audit was performed here.

Runtime evidence is from the installed current Chrome on Windows. Vite `target`/`cssTarget: chrome90` and missing-observer emulation do not establish runtime coverage in a historical Chrome binary. Touch/DPR2 evidence is synthesized Chrome mobile behavior, not a physical-device run. No independent screen-reader, Safari/Firefox, throttled-network/CPU, measured portfolio performance score or frame-budget guarantee is claimed. Text 200% evidence sets root font size and is not every browser zoom setting or all sections at enlarged text.

Okina DEMO remains unavailable; McLaren fallback is explicitly disclosed and exact source heading typography remains a known source-fidelity limitation. Provenance scan and build/lint outcomes are attributed to the parent's execution rather than presented as rerun by this reviewer. No deployment, publication or push was performed or authorized by this verdict.
