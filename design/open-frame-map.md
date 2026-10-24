# Figma Open frame layer map

Source: connected Figma file **Trần Cẩm Linh**, page **Design**, frame **Open** (node `50:93`). The frame is 1920 × 1080. It contains 11 visible direct-child layers; the Figma component-library search found no reusable component instances.

The order below follows the frame's direct-child order. Coordinates and rotations are in Figma pixels and degrees.

| # | Figma layer | Type | Figma bounds / placement | React implementation |
| --- | --- | --- | --- | --- |
| 1 | `bg 1` · node `58:348` | Rectangle, image fill | 0, 0 · 1920 × 1084 | `CurtainBackdrop` using `public/images/curtain-texture.png`, exported from this layer alone |
| 2 | `Vector 21` · node `53:172` | Vector stroke | x 792, y −31 · 1 × 715; #4E364C, 12 px | First path in `CenterGuideLines` |
| 3 | `Vector 22` · node `53:173` | Vector stroke | x 1128, y −30 · 0 × 697; #4E364C, 12 px | Second path in `CenterGuideLines` |
| 4 | `Rectangle 24` · node `53:159` | Paper rectangle | 719.12, 256.35 · 312.32 × 134; 2.91° | Paper card, `PaperLayer` |
| 5 | `Rectangle 26` · node `53:162` | Paper rectangle | 710.18, 581.77 · 330.07 × 134; 6.97° | Paper card, `PaperLayer` |
| 6 | `Rectangle 27` · node `53:163` | Paper rectangle | 833.65, 664.47 · 296.91 × 134; 1.30° | Paper card, `PaperLayer` |
| 7 | `Rectangle 25` · node `53:161` | Paper rectangle | 846.35, 356.75 · 314.72 × 134; −1.09° | Paper card, `PaperLayer` |
| 8 | `Linh` · node `53:155` | Text, Okina DEMO, 140 px | frame 741, 258.53 · 269 × 156; 2.24° | Figma outlined SVG, `WordmarkLayer` |
| 9 | `Tran` · node `53:156` | Text, Okina DEMO, 140 px | frame 856, 362 · 293 × 156; 0° | Figma outlined SVG, `WordmarkLayer` |
| 10 | `Port` · node `53:157` | Text, Okina DEMO, 140 px | frame 742.16, 581.87 · 263 × 156; 6.16° | Figma outlined SVG, `WordmarkLayer` |
| 11 | `folio` · node `53:158` | Text, Okina DEMO, 140 px | frame 863.91, 664.90 · 255 × 156; 1.29° | Figma outlined SVG, `WordmarkLayer` |

## Editing and extension

- Adjust layer coordinates, rotations, colors, or arrival delays in `src/data/openFrameLayers.js`.
- Add behaviors or reusable presentation around a particular layer in its component under `src/components`.
- Wordmark SVGs preserve Figma's exact outlined letterforms. They are vector assets rather than live font text.
- The curtain texture is the only raster visual in the running page. The full-frame capture is kept in `design/reference/open-frame.png` for comparison and is not loaded by React.
- Entrance timing is staggered: threads draw first, paper cards settle, then lettering appears. The reduced-motion preference shows the completed composition immediately.

