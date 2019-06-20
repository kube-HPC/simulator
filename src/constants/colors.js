export const COLOR = {
  blue: '#307fe6',
  blueLight: '#45a9ec',
  darkGrey: '#0000006b',
  grey: '#ccc',
  lightGreen: '#87d068',
  lightGrey: '#e8e8e8',
  orange: '#ec8c16',
  lightOrange: '#EAB675',
  red: '#e74c3c',
  transparentGrey: '#bfbfbf21',
  yellow: '#eeda13'
};

export const LAYOUT_COLOR = {
  background: COLOR.transparentGrey,
  border: COLOR.lightGrey,
  colorPrimary: COLOR.blue,
  darkBorder: COLOR.grey
};

export const STATUS = {
  active: COLOR.blueLight,
  bootstrap: COLOR.lightGreen,
  completed: COLOR.lightGreen,
  creating: COLOR.yellow,
  failed: COLOR.red,
  init: COLOR.lightGreen,
  inProgress: COLOR.darkGrey,
  pending: COLOR.darkGrey,
  ready: COLOR.lightGreen,
  recovering: COLOR.darkGrey,
  skipped: COLOR.yellow,
  stalled: COLOR.darkGrey,
  stopped: COLOR.orange,
  stopping: COLOR.orange,
  succeed: COLOR.lightGreen,
  warning: COLOR.red
};

export const PRIORITY = {
  1: { color: STATUS.warning, name: 'Highest' },
  2: { color: STATUS.failed, name: 'High' },
  3: { color: STATUS.stopped, name: 'Medium' },
  4: { color: STATUS.completed, name: 'Low' },
  5: { color: STATUS.active, name: 'Lowest' }
};
