# Portfolio extension — Chrome evidence

Project: `D:/Web/web-tran-cam-linh-folio`. Routes: `#environment`, `#arts`, `#others`. This index records saved evidence; the documentation pass did not rerun browser tests or fabricate a visual verdict. Source authority: `CONTRACT.md`, `design/sections-figma-source.json`, and each section's frame map. The reusable implemented system is in `DESIGN.md` and `.impeccable/design.json`.

## Saved results and review status

The following files were read directly during documentation on 2026-10-24:

| Saved file | Actual recorded result | Scope |
| --- | --- | --- |
| `results.json` | `passed: true`, 57 checks, no failures/errors | Three routes, 17 sizes per route, galleries, navigation, image loading, text enlargement and captures. Saved 01:12:44 +07:00. |
| `compatibility-results.json` | `passed: true`, 15 checks, no errors | Timeline geometry, text 200%, visibility/unmount lifecycle, absent observers, touch/DPR2/reduced-motion emulation. Saved 01:12:50 +07:00. |
| `review-fixes-results.json` | `passed: true`, 13 checks, no errors | Focus-retaining keyboard and touch Play, pointer override/reset, normal-text contrast and long marquee count. Saved 01:16:07 +07:00. |
| `../about/latest-results.json` | `passed: true`, 18 checks, no errors | About behavior and responsive regression. |
| `../about/latest-motion-results.json` | `passed: true`, 7 checks, no errors | About motion and interaction regression. |
| `../responsive/latest-results.json` | `passed: true`, 23 sizes, 4 mid-animation resizes, empty failure/console arrays | Same-loaded-page Open/Home resize regression. |
| `detector.json` | Empty array `[]` | Mechanical detector output; not a rendered accessibility or visual verdict. |

The independent `finish-review.md` preserves the initial **FIX** findings. The subsequent `finish-verdict.md` records **SHIP** for those four material items, each scored **RESOLVED**: selected normal-text contrast pairs, focused Play, marquee count and durable system documentation/source maps. This is approval of the listed corrections, not a full-surface accessibility, browser or performance certification. The parent ran the production build and lint successfully; the reviewers inspected saved execution evidence rather than rerunning those commands.

The focused contrast measurements record 5.0904:1 for Environment green ink on yellow notes/research; 4.8466:1 for yellow title copy on olive achievement headers; and 5.9479:1 for cream Play/Pause copy on olive. The source yellow/cream surfaces remain intact. These measurements concern the selected pairs, not a claim that every rendered element has received an independent accessibility audit.

## What the suites exercise

The main suite loads direct routes, checks focused entry, native scrolling and the shared Home/sibling navigation, then resizes through `320×480`, `360×640`, `375×667`, `390×844`, `430×932`, `600×800`, `660×740`, `768×1024`, `820×1180`, `844×390`, `1024×600`, `1024×768`, `1280×720`, `1440×900`, `1920×1080`, `2560×1440`, `3440×1440` on each route. It checks single expansion and accordion keyboard handling, section sticky boundaries, Environment fade counts 2/4/2/3, five Polygone slides, HAT movement/repetition/manual controls, three certificates, history/Escape/focus return, loaded images/local fonts and console/local HTTP errors.

The compatibility suite checks seven measured desktop timeline connectors and one mobile path after resize, finite geometry, root text enlarged to 200%, offscreen/document visibility behavior, route unmount cleanup, missing ResizeObserver/IntersectionObserver fallback, and synthesized mobile touch at DPR2. Reduced-motion emulation confirms the project's explicit entrance/autoplay requirement; it is not a claim of a conventional reduced-motion alternative.

The focused suite keeps keyboard focus on Play while checking actual slide advancement, resumes under retained pointer hover, confirms a later focus interaction pauses again, repeats the Play case with touch, and lets HAT travel across at least two artwork boundaries before checking its stable “5 artworks” label. Manual movement is checked too. Read `review-fixes-check.js` and its actual JSON rather than inferring success from an image filename.

## Captures

`results.json` enumerates 28 original PNG captures. Hero evidence for every route is desktop `1440×900`, mobile `390×844`, and tablet `768×1024`. Required originals include:

- `<route>-desktop-hero.png`, `<route>-mobile-hero.png`, `<route>-tablet-hero.png`.
- `<route>-text-200.png` and `<route>-mobile-content.png`.
- `environment-achievement-1/2/3.png`.
- `environment-desktop-achievement/timeline/polygone/intern/research.png`.
- `arts-desktop-concert/exhibition/hat-t0/hat-t1.png`.
- `others-desktop-certificates.png`.

Pages own their scroll roots, so these are tiled section viewport captures rather than one document full-page image. The original independent review inspected all 28 PNGs and their dimensions. The main suite refreshed all 28 originals after the finish fixes; original PNGs take precedence over stale JPEG contact sheets. Additional focused captures are `review-focused-fade-play.png`, `review-focused-marquee-t0.png`, `review-focused-marquee-t1.png`, and `review-touch-play.png`. The focused t0 waits for image decoding and two RAF callbacks. The verdict pass inspected twelve targeted/representative captures, including the loaded t0/t1 pair. Do not substitute full-frame Figma screenshots for browser evidence.

## Reproduce from the CLI

Requirements: installed project dependencies, current Chrome, and an available `playwright-cli.cmd` (used by the existing test workflow; it is not an npm dependency in this package). From `D:\Web\web-tran-cam-linh-folio`, run:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Keep preview running and use another terminal:

```powershell
playwright-cli.cmd -s=portfolio open http://127.0.0.1:4173/ --browser=chrome
playwright-cli.cmd -s=portfolio --raw run-code --filename=artifacts/portfolio/portfolio-check.js
playwright-cli.cmd -s=portfolio --raw run-code --filename=artifacts/portfolio/compatibility-check.js
playwright-cli.cmd -s=portfolio --raw run-code --filename=artifacts/portfolio/review-fixes-check.js
playwright-cli.cmd -s=portfolio --raw run-code --filename=artifacts/about/about-check.js
playwright-cli.cmd -s=portfolio --raw run-code --filename=artifacts/about/motion-check.js
```

For the Open/Home live regression, also run a dev server in its own terminal:

```powershell
npm.cmd start -- --host 127.0.0.1 --port 5173 --strictPort
```

Then:

```powershell
playwright-cli.cmd -s=portfolio --raw run-code --filename=artifacts/responsive/live-resize-check.js
playwright-cli.cmd -s=portfolio close
```

The scripts return result objects and write their named captures. Inspect the returned `passed` flag, every check and errors/failures; CLI exit success alone is insufficient. Preserve the actual returned result object in the matching JSON file when refreshing evidence, rather than copying an old pass or saving CLI wrapper text as JSON. `latest-*.json` in older regression directories are the parent's recorded refreshes; historical result filenames and README dates remain historical. Rebuild before retesting implementation changes so port 4173 serves the intended source revision.

## Provenance and release limits

The parent reported a metadata scan of 67 shipping rasters with zero missing provenance: Environment 45, Art 16, Other 6. Original exports were individual Figma nodes in PNG. Current delivery is 42 Environment WebP plus three PNG; 15 Art WebP plus one PNG; and six Other PNG. WebP files retain adjacent provenance JSON; retained PNGs embed origin metadata. Maps retain exact node IDs, original export measurements and current delivery filenames. Documentation did not recompress assets. Body copy remains DOM text; source lettering/quotes are intentional individual artwork with accessible alternatives.

Compatibility scope is the installed current Chrome on Windows, with additional Chrome mobile/touch emulation. Vite `target` and `cssTarget` are `chrome90`; no historical Chrome binary was tested. Missing-observer emulation in current Chrome is useful fallback evidence, not proof of an older browser engine. No real phone, Safari/Firefox, independent screen-reader run, network/CPU-throttled portfolio performance score, or measured portfolio long-task/frame-budget guarantee is claimed. Older Open/Home artifacts describe their own historical measurements and should not be promoted to this portfolio run.

Okina DEMO is missing; McLaren is the documented actual fallback. Text 200% changes the root font size in the saved tests; it is not every browser zoom setting or a capture of every section at enlarged text. Resume checks preserve the exact configured Google Drive destination and verify new-tab behavior, not its access permissions or contents. No deployment, publication or push was performed by this documentation work.
