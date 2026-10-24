# Independent finish review

## 1. Disposition — FIX

The implementation is a credible extension of the pinned Figma forest portfolio. It does not need a rebuild or wholesale recapture. The required original PNG evidence is valid, and the latest saved Chrome suites pass. However, source inspection identifies a normal-text contrast failure in two recurring surfaces, a focused playback-control defect, and a misleading marquee counter. Complete the documented finish contract before claiming the work fully finished.

Method: fresh independent source-and-capture review. I read CONTRACT.md and REVIEW-PACKET.md first, applied the Impeccable audit/craft-floor guidance, inspected all 28 original required PNGs individually, read the original four user reference images, inspected the saved Figma text/annotations and the three section maps, and inspected the shared/page implementation and saved test scripts. No browser was driven, no agents were spawned, and no implementation/test/asset/documentation file was edited. The only review output is this file. The existing Figma direction and contract supply the visual direction; no new interview or invented aesthetic was substituted.

## 2. Brief and direction coverage

The cream paper, layered original forest illustration, purple copy, olive/yellow paper labels, hanging signs, and playful type belong to the supplied visual world. The responsive adaptations preserve that identity. The missing Okina DEMO face is honestly documented; McLaren remains the incumbent fallback. I do not treat the supplied palette or paper-sign composition as generic design defects.

Environment includes all four major sections, three individual achievement panels, community/project material, the eight-event GHA timeline, internships, and research. The single-expanded accordion, keyboard navigation, section-bounded sticky headings, four automatic fades, and five-slide Polygone carousel are implemented. The actual data sequences are 107:136/174:2; 107:149/107:138/107:137/114:221; 107:160/107:159; and 107:334/107:335/107:336. Polygone contains 108:365 through 108:369. All red directions in the saved source were read, including both main-frame and external annotation entries.

Art includes the concert's four individual assets, exhibition's six individual assets and full copy, and the external HAT sequence 114:216 through 114:220. The duplicate strip contains the full five-artwork sequence; its second copy is hidden from accessibility APIs. The original HAT reference explicitly asks for that complete external sequence, not merely the clipped frame preview.

Other preserves the three parallel original hanging certificate displays and stacks them on phones. Original supplied title wording remains intact; the additional selectable captions are supported by the visible certificates. Original certificate images can be opened separately. Main copy remains DOM text; the source handwriting quotes and hanging title lettering remain individual original artwork with accessible equivalents.

The source's unusual numbering, duplicated phrases and punctuation are preserved deliberately. I found no material factual-copy invention in the inspected section data. Modules and assets remain independently organized. App.jsx mounts portfolio routes lazily and unmounts inactive galleries. The exact configured resume URL remains https://drive.google.com/file/d/1JWuDqlU5EpR0llFK-OCUFfjW0kKleWaU/view?usp=sharing in src/data/aboutFrameLayers.js:20 and is consumed by AboutPage.

## 3. Evidence validity

artifacts/portfolio/results.json records passed:true, 57 checks, no failures, and no errors. It covers direct routes/focus, 17 viewport dimensions per route, Home/Open coverage, native scrolling, accordion behavior, sticky boundaries, all four fades, complete Polygone slides, gallery keyboard operation, HAT movement/repetition/pause/geometry, certificates, image loading, text enlargement, history, Escape/focus recovery, local font loading, and console/HTTP errors.

artifacts/portfolio/compatibility-results.json was refreshed during this review. The final file records passed:true, 15 passing checks and errors:[]. The earlier file contained a heading timeout; that earlier failed artifact is superseded by the final passing result. The final suite checks desktop/mobile timeline geometry, real 200% root font sizing, viewport/document visibility lifecycle, route unmounting, absent observer APIs, synthesized mobile touch controls, DPR2, and autoplay under the project's required reduced-motion behavior.

All 28 original PNGs were opened and visually inspected, and their PNG dimensions were read. The nine hero captures match 1440x900 desktop, 390x844 mobile and 768x1024 tablet. The remaining desktop body captures are 1440x900; the three text-enlargement and three mobile-content captures are 390x844. None is empty, broken, a contact sheet, or a substituted full-page source image. I did not judge the stale JPEG sheets.

Inspected originals: environment/arts/others desktop, mobile and tablet hero captures; environment-achievement-1/2/3; environment-desktop-achievement/timeline/polygone/intern/research; arts-desktop-concert/exhibition/hat-t0/hat-t1; others-desktop-certificates; environment/arts/others text-200 and mobile-content. Their actual filenames are enumerated in results.json. HAT's t0/t1 images show changed horizontal image positions and coherent play/pause states. The 200% images visibly enlarge DOM text and reflow the navigation rather than merely applying page magnification.

The saved test source explains the scope of the assertions. In particular, text enlargement sets document.documentElement.style.fontSize to 200%; its assertion checks the page scroll-root width. This is useful real text-enlargement evidence, not a full visual capture of every section at enlarged text. The resume checks deliberately move focus to the page heading after pressing Resume, which leaves the focused-button case untested.

The other saved regressions also report success: artifacts/about/latest-results.json has 18 passing checks, latest-motion-results.json has 7, and artifacts/responsive/latest-results.json reports 23 Home sizes plus 4 mid-animation resizes, with no failures or console errors. These are recorded integration evidence, not tests rerun by this reviewer. Detector evidence is the actual empty array in artifacts/portfolio/detector.json; I did not rerun it. The supplied packet reports the final provenance scan as 67 rasters with zero missing provenance; the per-section source-node maps and shipping asset references support the source chain, but I did not independently rerun its binary metadata scanner.

## 4. Material findings and exact fixes

### P1 — Recurring normal-text contrast is below 4.5:1

Locations: src/components/environment/environment.css:3 and :7 define #566d38 ink on #ebe66c yellow notes. The inherited 1rem body copy appears on achievement panels (:108), timeline notes (:304), captions/labels (:223 and :334), and research (:344). This pair computes to 4.4139:1. It fails normal-text AA despite its visually close margin. The larger headings are a different threshold; do not report those as failing the same requirement.

src/components/portfolio/Gallery.css:41 sets the control copy to 0.8rem, while :54 and :55 pair #fff5cd text with #637c42 buttons. That pair computes to 4.2728:1. The small Play/Pause words fail normal-text AA; arrow icons have a different 3:1 non-text threshold.

Fix: retain the source yellow and cream surfaces and darken the relevant olive/green foreground or button background slightly until the normal-text pairs exceed 4.5:1, preferably with margin. Change the shared tokens/selectors so every affected note/control follows the fix. Recalculate the final values and inspect representative achievement, timeline, research and gallery captures. This is a narrow accessibility correction within the pinned palette, not a direction change. The empty detector array does not establish rendered contrast compliance.

### P2 — Pressing Play cannot resume while its button retains focus

Locations: src/components/portfolio/Gallery.jsx:38 unconditionally includes !focused in canPlay; :186 marks any gallery descendant focus as focused; :235 only toggles userPaused. A keyboard user pressing Play on that focused button leaves focused=true, so data-playing remains false. Touch activation may retain the same button focus. The label changes to Pause even though playback has not resumed; leaving the gallery is required. Pointer hover can cause the same mismatch while the pointer remains over the control.

Evidence limit: artifacts/portfolio/portfolio-check.js:166-170 and :218-219 explicitly focus a page heading after Resume before asserting that motion runs. Those passing assertions do not disprove this code path.

Fix: make an explicit Play action override the current automatic focus/hover pause until the next relevant focus/pointer interaction, while preserving automatic pause on initial entry. Keep the button label/ARIA and actual playback state consistent. Add a meaningful focused-button check using keyboard activation and a touch tap, asserting movement without programmatically moving focus away. Manual next/previous remains usable, so this is a control-state defect rather than total gallery inaccessibility.

### P2 — HAT's numeric count does not follow autoplay

Locations: src/components/portfolio/Gallery.jsx:127-128 advance marqueeOffset and transform, but the index at :30 only changes through manual move at :157. The count at :232 displays index+1 / images.length for every mode. Once the strip automatically passes the next artwork, the visible number still claims the previous item; initially it can remain 1 / 5 throughout the loop. The short t0/t1 interval does not travel far enough to expose that longer-term disagreement.

Fix: for marquee mode, show a stable truthful label such as 5 artworks, or derive the visible item index from the measured tile width/offset and update React state only when a tile boundary changes. Do not add per-frame React state. Check the display after the strip passes at least two artwork boundaries and after manual movement.

### P2 / contract completion gate — Durable system document is absent at review time

Location: D:/Web/web-tran-cam-linh-folio/DESIGN.md does not exist. CONTRACT.md:17 explicitly includes DESIGN.md in the completion definition. The detailed design/*-frame-map.md files are useful provenance/module maps, but they do not satisfy the promised project-level system document.

Fix: complete DESIGN.md from the incumbent system: palette and text pairings, local fonts and the Okina limitation, shared components, section-specific composition, motion/lifecycle behavior, responsive rules, exact source references, provenance, final evidence and this review verdict. Update source maps that still describe shipping PNG body assets after conversion to WebP; preserve both the original node origin and the final shipping filename. This is documentation work, not permission to replace the established design.

## 5. Release and evidence limits

Resolve the contrast failure before release. Correct the two gallery state defects and complete the documented finish deliverable before claiming 100% completion. The existing screenshot evidence is valid; target recaptures after these fixes at the changed surfaces rather than discarding all evidence. Recheck focused Play/Resume behavior directly, and refresh saved results if implementation changes.

Current installed Chrome is tested. Vite target/cssTarget chrome90 is a build configuration and does not prove runtime behavior in historical Chrome. The fallback suite removes observer APIs in current Chrome; it is not an old-engine substitute. Touch evidence is synthesized mobile Chrome with DPR2, not a physical-device test. There is no independent screen-reader run, network/CPU-throttled performance measurement, or measured long-task/frame-budget evidence in this packet. Source inspection supports bounded RAF work, observer cleanup, paused offscreen loops, lazy loading, and route splitting; it does not establish performance scores.

Okina DEMO remains unavailable, so exact source heading typography is not achieved and must stay disclosed. The source handwriting assets and illustration exports are intentional source fidelity, not selectable body paragraphs. Text enlargement is evidenced at a 390px root-font test, not every browser zoom setting. No deployment, push or publication was performed or authorized by this review. No broader redesign is recommended.

