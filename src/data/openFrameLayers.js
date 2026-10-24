import linhSvg from '../assets/figma-text/Linh.svg?url'
import tranSvg from '../assets/figma-text/Tran.svg?url'
import portSvg from '../assets/figma-text/Port.svg?url'
import folioSvg from '../assets/figma-text/folio.svg?url'

export const FRAME_SIZE = Object.freeze({ name: 'Open', nodeId: '50:93', width: 1920, height: 1080 })

// Entries follow the direct-child order in the Figma Open frame.
export const OPEN_FRAME_LAYERS = Object.freeze([
  {
    key: 'curtain-background',
    name: 'bg 1',
    nodeId: '58:348',
    type: 'background',
    bounds: { x: 0, y: 0, width: 1920, height: 1084 },
    src: '/images/curtain-texture.png',
  },
  {
    key: 'left-guide',
    name: 'Vector 21',
    nodeId: '53:172',
    type: 'guide',
    x: 792,
    y: -31,
    stroke: '#4E364C',
    strokeWidth: 12,
    path: 'M 0.9999999999999999 715 C 0.9999999999999999 714.4101250341222 0.9999999999999999 713.8202436703408 0.9999999999999999 598.7856842541303 C 0.9999999999999999 483.75112483791975 0.9999999999999999 254.2897471166782 0.9175000035419628 135.1975605763637 C 0.8350000070839257 16.105374036049227 0.6699999862049866 14.335749671574291 0.5849999884420157 12.244374744083864 C 0.49999999067904494 10.152999816593436 0.49999999999999994 7.79350021966135 0.41750000354196287 5.693187687671833 C 0.3350000070839258 3.592875155682316 0.16999999552594158 1.823249991469462 0 0',
    delay: 120,
  },
  {
    key: 'right-guide',
    name: 'Vector 22',
    nodeId: '53:173',
    type: 'guide',
    x: 1128,
    y: -30,
    stroke: '#4E364C',
    strokeWidth: 12,
    path: 'M 0 0 L 0 697',
    delay: 260,
  },
  {
    key: 'paper-linh',
    name: 'Rectangle 24',
    nodeId: '53:159',
    type: 'paper',
    bounds: { x: 719.116, y: 256.348, width: 312.319, height: 134 },
    rotation: 2.9120252731957663,
    delay: 260,
  },
  {
    key: 'paper-port',
    name: 'Rectangle 26',
    nodeId: '53:162',
    type: 'paper',
    bounds: { x: 710.18, y: 581.77, width: 330.069, height: 134 },
    rotation: 6.9671338566530245,
    delay: 470,
  },
  {
    key: 'paper-folio',
    name: 'Rectangle 27',
    nodeId: '53:163',
    type: 'paper',
    bounds: { x: 833.651, y: 664.472, width: 296.912, height: 134 },
    rotation: 1.296,
    delay: 680,
  },
  {
    key: 'paper-tran',
    name: 'Rectangle 25',
    nodeId: '53:161',
    type: 'paper',
    bounds: { x: 846.349, y: 356.749, width: 314.721, height: 134 },
    rotation: -1.0900008753129595,
    delay: 890,
  },
  {
    key: 'word-linh',
    name: 'Linh',
    nodeId: '53:155',
    type: 'wordmark',
    frame: { x: 741, y: 258.53363037109375, width: 269, height: 156 },
    glyph: { x: 742, y: 283.53363037109375, width: 267, height: 106 },
    rotation: 2.244191045517974,
    color: '#7F975F',
    src: linhSvg,
    delay: 500,
  },
  {
    key: 'word-tran',
    name: 'Tran',
    nodeId: '53:156',
    type: 'wordmark',
    frame: { x: 856, y: 362, width: 293, height: 156 },
    glyph: { x: 858.5, y: 391.5, width: 288, height: 97 },
    rotation: 0,
    color: '#C9C066',
    src: tranSvg,
    delay: 710,
  },
  {
    key: 'word-port',
    name: 'Port',
    nodeId: '53:157',
    type: 'wordmark',
    frame: { x: 742.1615600585938, y: 581.871826171875, width: 263, height: 156 },
    glyph: { x: 741.1615600585938, y: 598.371826171875, width: 265, height: 123 },
    rotation: 6.1574510056404685,
    color: '#8075BC',
    src: portSvg,
    delay: 920,
  },
  {
    key: 'word-folio',
    name: 'folio',
    nodeId: '53:158',
    type: 'wordmark',
    frame: { x: 863.9111328125, y: 664.9002685546875, width: 255, height: 156 },
    glyph: { x: 865.9111328125, y: 691.4002685546875, width: 251, height: 103 },
    rotation: 1.2914903504408708,
    color: '#8075BC',
    src: folioSvg,
    delay: 1130,
  },
])

export const BACKGROUND_LAYER = OPEN_FRAME_LAYERS.find((layer) => layer.type === 'background')
export const GUIDE_LAYERS = OPEN_FRAME_LAYERS.filter((layer) => layer.type === 'guide')
export const PAPER_LAYERS = OPEN_FRAME_LAYERS.filter((layer) => layer.type === 'paper')
export const WORDMARK_LAYERS = OPEN_FRAME_LAYERS.filter((layer) => layer.type === 'wordmark')

