// Mode Light
import { pipelineTypes as TYPES } from '@hkube/consts';

const COLOR = {
  blue: `#307fe6`,
  blueDark: `#0065E5`,
  blueLight: `#45a9ec`,
  blueExtraLight: `#a3d4f5`,
  cyan: `#98dbef`,
  darkGrey: `#807c7c`,
  green: `#63C13C`,
  greenLight: `#87d068`,
  greenDark: `#006618`,
  grey: `#ccc`,
  lightGrey: `#e8e8e8`,
  orange: `#ec8c16`,
  orangeLight: `#EAB675`,
  orangePale: `#FFC25A`,
  pink: `#e543b4`,
  pinkLight: `#FF5CA2`,
  purple: `#C657D0`,
  darkPurple: '#4b1650',
  red: `#e74c3c`,
  redPale: `#FF8974`,
  transparentBlack: `#00000073`,
  transparentWhite: `#ffffffdd`,
  transparentGrey: `#bfbfbf21`,
  turquoise: `#36DFB9`,
  white: `white`,
  whiteDark: `#e8e8e8`,
  yellow: `#eeda13`,
  yellowPale: '#f6ed88',
  darkCharcoal: `#333333`,
};

const GRAPH_PALETTE = { scheme: 'blues' };

const Styles = {
  reactJsonView: { theme: 'rjv-default' },
  darkHoverStyle: { colorHover: 'black' },
  imageStyle: { fill: '#0F2744' },
  nodeSelectRadioButton: { bgButton: '#f4faff' },
  tabDrawerText: { color: '#333333' },
  tabDrawer: {
    background: '#ffffff',
    border: '#ffffff',
  },
  validContainer: { background: '#000000' },
  container: { background: '#e6e9f0 0%, #eef1f5 100%' },
  barColor: { color: COLOR.white, text: COLOR.darkGrey },
  nodeStatistics: { color: COLOR.white, text: COLOR.darkGrey },
  UserGuideTooltip: { TooltipBody: '#ffffff' },
  isTagFill: true,
};

const COLOR_PIPELINE_TYPES = {
  [TYPES.ALGORITHM]: COLOR.orangeLight,
  [TYPES.CRON]: COLOR.purple,
  [TYPES.INTERNAL]: COLOR.pinkLight,
  [TYPES.NODE]: COLOR.blueDark,
  [TYPES.RAW]: COLOR.redPale,
  [TYPES.STORED]: COLOR.blueLight,
  [TYPES.SUB_PIPELINE]: COLOR.orangePale,
  [TYPES.TENSORBOARD]: COLOR.greenLight,
  [TYPES.TRIGGER]: COLOR.turquoise,
};

const COLOR_PRIORITY = {
  1: { color: COLOR.red, name: `Highest` },
  2: { color: COLOR.darkOrange, name: `High` },
  3: { color: COLOR.orange, name: `Medium` },
  4: { color: COLOR.greenLight, name: `Low` },
  5: { color: COLOR.blueLight, name: `Lowest` },
};

const COLOR_PRIORITY_TEMPLATE = COLOR_PRIORITY;
const COLOR_PIPELINE_TYPES_TEMPLATE = COLOR_PIPELINE_TYPES;

export default {
  COLOR,
  Styles,
  GRAPH_PALETTE,
  COLOR_PIPELINE_TYPES,
  COLOR_PIPELINE_TYPES_TEMPLATE,
  COLOR_PRIORITY,
  COLOR_PRIORITY_TEMPLATE,
};
