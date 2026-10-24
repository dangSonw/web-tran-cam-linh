import forestLayers1 from '../assets/about/forest-layers-1.svg?url'
import forestLayers2 from '../assets/about/forest-layers-2.svg?url'
import forestLayers3 from '../assets/about/forest-layers-3.svg?url'
import forestLayers4 from '../assets/about/forest-layers-4.svg?url'
import forestLayers5 from '../assets/about/forest-layers-5.svg?url'

export const ABOUT_FRAME = Object.freeze({
  nodeId: '58:349',
  width: 1920,
  height: 1080,
  background: '#9bcace',
})

export const ABOUT_CONTENT = Object.freeze({
  greeting: 'Hi, fellow traveller!',
  paragraphs: [
    'It is I, Linh Tran, the forest’s whisperer. I am here to navigate you through this magical place which I have spent over a decade building from a single sprout of life.',
    'I very much hope you will find it worthwhile wandering here.',
  ],
  resumeUrl: 'https://drive.google.com/file/d/1JWuDqlU5EpR0llFK-OCUFfjW0kKleWaU/view?usp=sharing',
})

export const ABOUT_SKY_CIRCLES = Object.freeze([
  { nodeId: '58:350', x: 132.5, y: -170, width: 1655, height: 1655, fill: '#b0e6ea' },
  { nodeId: '58:351', x: 331.5, y: 30, width: 1256, height: 1255, fill: '#c5f3f6' },
  { nodeId: '58:352', x: 514.5, y: 213, width: 890, height: 889, fill: '#dcfbfe' },
])

// Every symbol contains one original About me illustration, exported at its
// absolute bounds. Position and stacking remain independently editable here.
const exportedLayers = [
  { nodeId: '58:414', key: '58:414', x: 227, y: 374, width: 265, height: 134, sprite: forestLayers1 },
  { nodeId: '58:353', key: '58:353', x: 1322, y: -241, width: 536, height: 777, sprite: forestLayers1 },
  { nodeId: '58:356', key: '58:356', x: -187.147, y: -592, width: 943, height: 1123, sprite: forestLayers1 },
  { nodeId: '58:377', key: '58:377', x: 190, y: 451, width: 265, height: 134, sprite: forestLayers1 },
  { nodeId: '58:413', key: '58:413', x: 1419, y: 432, width: 265, height: 134, sprite: forestLayers2 },
  { nodeId: '58:361', key: '58:361', x: -456, y: -764, width: 1250, height: 1490, sprite: forestLayers2 },
  { nodeId: '58:360', key: '58:360', x: 121, y: 535, width: 353, height: 179, sprite: forestLayers2 },
  { nodeId: '58:367', key: '58:367', x: -368, y: -430, width: 922, height: 1173, sprite: forestLayers2 },
  { nodeId: '58:370', key: '58:370', x: 1225, y: -382, width: 862, height: 1027, sprite: forestLayers3 },
  { nodeId: '58:364', key: '58:364', x: -40, y: 595, width: 474, height: 263, sprite: forestLayers3 },
  { nodeId: '58:373', key: '58:373', x: -132, y: 716, width: 487, height: 271, sprite: forestLayers3 },
  { nodeId: '58:376', key: '58:376', x: 1445, y: 552, width: 378, height: 191, sprite: forestLayers3 },
  { nodeId: '58:378', key: '58:378', x: 1302, y: -654, width: 1074, height: 1556, sprite: forestLayers4 },
  { nodeId: '58:381', key: '58:381', x: 1384, y: 619, width: 557, height: 309, sprite: forestLayers4 },
  { nodeId: '58:384', key: '58:384', x: 1531, y: -37, width: 616, height: 1117, sprite: forestLayers4 },
  { nodeId: '58:385', key: '58:385', x: -217, y: -96, width: 646, height: 1266, sprite: forestLayers4 },
  { nodeId: '58:386', key: '58:386', x: -260, y: 848, width: 744, height: 353, sprite: forestLayers5 },
  { nodeId: '58:389', key: '58:389', x: 1449, y: 806, width: 711, height: 394, sprite: forestLayers5 },
  { nodeId: '75:140', key: '75:140', x: -6, y: 404, width: 1926, height: 703, sprite: forestLayers5 },
]

export const ABOUT_MEADOW = exportedLayers.find((layer) => layer.nodeId === '75:140')
export const ABOUT_SCENE_LAYERS = exportedLayers.filter((layer) => layer.nodeId !== '75:140')

export const ABOUT_PATH = "M 692.5 18 C 429.611572265625 248.08993530273438 -2.4439827939204406e-10 835 -2.4427038169960724e-10 1280.499755859375 C 717.5089111325682 1280.499755859375 1642.7108459472656 1280.499755859375 1921 1280.499755859375 C 1920.9999999999998 872 1602.5 397 1236.5 18 C 1153.5 5.5 1057.3233795166016 -0.00009055290373261027 959 1.1181483516864432e-9 C 860.6766204833984 0.00009055514002931364 761 7.5 692.5 18 Z"
