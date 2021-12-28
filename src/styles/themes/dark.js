import { pipelineTypes as TYPES } from '@hkube/consts';

// Mode Dark

const COLOR = {
  blue: `#1557ac`,
  blueDark: `#0054c2`,
  blueLight: `#147cc2`,
  blueExtraLight: `#47a9eb`,
  cyan: `#57c4e5`,
  darkGrey: `#807c7c`,
  green: `#407d26`,
  greenLight: `#448529`,
  greenDark: `#006618`,
  grey: `#999999`,
  lightGrey: `#586a93`,
  orange: `#9c5b0d`,
  orangeLight: `#d1811f`,
  orangePale: `#ffa305`,
  pink: `#991571`,
  pinkLight: `#c20054`,
  purple: `#b436bf`,
  darkPurple: '#691f70',
  red: `#962013`,
  redPale: `#b31b00`,
  transparentBlack: `#ffffffdb`,
  transparentWhite: `#c9c9c9de`,
  transparentGrey: `#bfbfbf52`,
  turquoise: `#0fae8b`,
  white: `white`,
  whiteDark: `#e8e8e8`,
  yellow: `#b0a30c`,
  yellowPale: '#c7b80f',
  darkCharcoal: `#454545`,
};

const GRAPH_PALETTE = [
  '#1ac7c2',
  '#25e892',
  '#1ddfa3',
  '#6849ba',
  '#6054c8',
  '#1dbace',
  '#1ac7c2',
  '#1ad4b3',
  '#1ddfa3',
  '#30ef82',
];

const Styles = {
  reactJsonView: { theme: 'paraiso' },
  darkHoverStyle: { colorHover: '#ffffff' },
  imageStyle: { fill: '#ffffff' },
  nodeSelectRadioButton: { bgButton: '#bed3e5' },
  tabDrawerText: { color: '#ffffff' },
  tabDrawer: {
    background: '#182039',
    border: '#586a93',
  },
  validContainer: { background: '#0e1422' },
  container: { background: '#1c325c 0%,#001b3e 100%' },
  barColor: { color: COLOR.whiteDark, text: COLOR.whiteDark },
  nodeStatistics: { color: COLOR.blueLight, text: COLOR.whiteDark },
  UserGuideTooltip: { TooltipBody: '#182039' },
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

const COLOR_PRIORITY_TEMPLATE = {};
const COLOR_PIPELINE_TYPES_TEMPLATE = {};

export default {
  COLOR,
  Styles,
  GRAPH_PALETTE,
  COLOR_PIPELINE_TYPES,
  COLOR_PIPELINE_TYPES_TEMPLATE,
  COLOR_PRIORITY,
  COLOR_PRIORITY_TEMPLATE,
};
