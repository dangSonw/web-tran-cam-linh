# Motion update — 2026-10-24

Implements the user's scroll and gallery request in the existing Trần Cẩm Linh portfolio. Nguyễn Chi Lan's homepage button is a separate change in `D:/Web/web-nguyen-chi-lan`.

- About, Environment, Art and Other preserve their initial scenes; native scrolling parts foliage, raises signs and fades introductions. About ends at the empty background, and reverse scroll restores the scene.
- Achievement panels animate height and opacity, including interrupted switches.
- First Meeting, Green Life 2026, Tet Am Ap 2026, Camp Blast 2026, Polygone and Hanoi-Amsterdam Art Team are image-only continuous galleries. They travel left to right at 18px/s and pause independently on image hover.
- Other's 2026 clouds float and sway lightly, reacting to pointer position or certificate focus.
- New motion respects reduced motion and stops offscreen or while the document is hidden.

Figma Desktop Bridge was actively probed and the source frames read live from file `9yn92xRnvfIDmo0eurW1Ow`. No Figma document edits or exports were needed. Existing original assets and factual content are preserved.

## Reproduction

Run `npm run build`, `npm run lint`, then `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`.

- `node artifacts/motion-update/verify-integration.cjs` checks production routes, scroll endpoints/reversal, six gallery directions, image-hover pause/resume, reduced motion and runtime/asset errors.
- Set `VERIFY_URL=http://127.0.0.1:4173` and run `node artifacts/motion-update/verify-details.cjs` for accordion interruption/keyboard behavior, cloud interaction/lifecycle, reduced motion and mobile overflow.

Both scripts use the installed Codex Playwright dependency and current Chrome on this Windows machine. Results are saved beside this file as JSON, with representative desktop/mobile PNG captures. These are current Chrome tests and mobile viewport emulation, not physical-device or all-browser certification. Original snapshots of the files edited by the parent are in `originals/`.

Final production results: **38/38 integration checks and 13/13 detail checks passed**, with no runtime or asset errors in the integration routes. Build and lint pass. The gallery subagent additionally verified 26 assertions and synthesized touch dragging; its two scripts and desktop/mobile gallery captures are included here. `forest-scroll-check.js` is the subagent's eight-scenario desktop/mobile check, run through Playwright CLI `run-code --filename` against the development server.

The historical suites under `artifacts/portfolio/` describe the previous controlled gallery interface. Their Play/Pause and count assertions are superseded for the six continuous galleries. The new results are the evidence for this change. An independent read-only review additionally checked About endpoints, gallery direction/hover and widths 320, 844 and 1920 without finding actionable regressions.

No push, publication or deployment was performed.
