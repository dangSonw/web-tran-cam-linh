# About me — Chrome verification

Originally verified on 2026-10-23 against the Vite production build served at http://127.0.0.1:4173/. Integration checks were rerun on 2026-10-24 during the Environment/Art/Other extension; current results are `latest-results.json` (18 passing checks), `latest-motion-results.json` (7), and `../responsive/latest-results.json` (23 sizes plus four mid-animation resizes). Older result filenames and captures below remain historical evidence.

## Results

| Check set | Result |
| --- | --- |
| npm.cmd run lint | PASS, no warnings |
| npm.cmd run build | PASS |
| about-check.js | PASS, 18 checks |
| motion-check.js | PASS, 7 checks |
| Open/Home live resize regression | PASS, 23 viewport changes plus 4 mid-animation resizes |
| Production console | 0 errors, 0 warnings |

The About me suite resizes the same live page through 20 sizes: 320×480, 320×568, 360×640, 375×667, 390×844, 412×915, 568×320, 844×390, 759×900, 760×900, 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080, 2560×1440, 3440×1440, 1920×300, then small-to-large again.

## Behavior covered

- Open → Home → About me, Back/Forward history, Escape, Enter, and Home button.
- Direct links and reload at #about-me and #home.
- Focus enters the About me heading and returns to the correct Home sign.
- Home is inert while About me is active.
- Same-page resize without horizontal overflow, content collisions, or an exposed Open curtain.
- Native wheel scrolling and CDP touch swipes on short screens.
- Resumé remains reachable and opens the configured URL in a new tab.
- Text enlarged to 200% using root font size.
- A mobile context with isMobile, hasTouch, and DPR 2 performs tap navigation.
- Actual RAF motion is sampled over successive frames; hover responds and settles.
- Tab produces a visible keyboard focus ring on the resumé link.
- Per the project's explicit motion instructions, entrance motion also autoplays when reduced motion is enabled.
- Local responses and HTML image loading are checked.

An initial keyboard test raced focus restoration. It now waits for the About me sign to receive focus before sending Enter; this matches the user interaction it asserts.

## Evidence

- results.json: final About me behavior checks.
- motion-results.json: final motion and touch checks.
- open-home-regression-results.json: existing Open/Home regression rerun.
- desktop.png, laptop.png, tablet.png, mobile.png, landscape.png.
- mobile-dpr2.png: Chrome device context, not a physical phone.
- text-200-percent.png: enlarged root text, not browser page zoom.
- motion-t0.png and motion-t1.png: different moments of the actual entrance.

The visual pass found and corrected a tablet/landscape issue that bounding-box checks alone did not detect: decorative trees crossed the text region. Portrait layouts now crop the forest independently and move the cream path behind the text.
Display lettering retains the source form with brightness reduced to 75% for contrast. Body text uses #4e364c on #fff5cd, measured at 9.81:1 before antialiasing.

## Reproduce

From D:\Web\web-tran-cam-linh-folio:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

In a separate terminal:

```powershell
playwright-cli.cmd -s=about open http://127.0.0.1:4173 --browser=chrome
playwright-cli.cmd -s=about --raw run-code --filename=artifacts/about/about-check.js
playwright-cli.cmd -s=about --raw run-code --filename=artifacts/about/motion-check.js
```

For the original Open/Home live regression, also run the dev server at port 5173, then:

```powershell
playwright-cli.cmd -s=about --raw run-code --filename=artifacts/responsive/live-resize-check.js
```

Read the returned passed flag; a successful CLI exit alone is not a test result.

## Practical limits

Chrome on Windows and Chrome emulation were tested. Physical touch hardware, Firefox, and Safari were not.
The resumé test intercepts Google Drive to verify the configured destination and new-tab behavior. It does not verify access permissions or contents of the Drive file.
The resumé URL was subsequently updated to the exact Google Drive link explicitly supplied by the user, including the usp=sharing query parameter. The configured destination is recorded in ABOUT_CONTENT and the navigation check.
Figma custom text outlines timed out through the bridge; separate transparent lettering exports are used with accessible alternatives.
The original About visual review was performed inline from Chrome captures and skill rules. The later portfolio extension produced the empty detector report `../portfolio/detector.json` and independent `finish-review.md` / `finish-verdict.md` reports in that directory. The SHIP verdict resolves the four listed portfolio-extension findings; it does not turn the original About pass into a full independent accessibility or visual certification.

## Final review

- Composition: original Figma sign, portrait, greeting, biography, resumé and forest present.
- Desktop material: individual original illustration exports, exact path geometry, original sky ring palette.
- Responsive adaptation: portrait forest edges and cream text field; native vertical scrolling on short windows.
- Interaction: native links, keyboard, history, touch and focus covered.
- Extension: data-layer-id, the source manifest, and focused React modules retained.
- Source-system documentation: About retains its original source map. The implemented incumbent forest system is now documented in the project-root `DESIGN.md` and `.impeccable/design.json`, completed with the Environment/Art/Other extension. No replacement visual identity or unverified product claims were introduced.
