export const COLOR = {
  blue: '#307fe6',
  blueLight: '#45a9ec',
  red: '#e74c3c',
  purple: '#9b59b6',
  purpleHighlight: '#ac6ad7',
  redHighlight: '#f85d4d',
  green: '#1abc9c',
  greenHighlight: '#2bcdad',
  textBlue: '#307fe6',
  whiteHighlight: '#ececec',
  white: 'white',
  lightGrey: '#e8e8e8',
  grey: '#ccc',
  darkGrey: '#bfbfbf',
  lightGreen: '#87d068',
  yellow: '#eeda13',
  orange: '#ec8c16',
  darkOrange: '#f50'
};

export const HCOLOR = {
  colorPrimary: COLOR.blue,
  colorAccent: COLOR.whiteHighlight,
  border: COLOR.lightGrey,
  darkBorder: COLOR.grey,
  background: COLOR.darkGrey
};

export const STATUS = {
  pending: COLOR.darkGrey,
  creating: COLOR.darkGrey,
  bootstrap: COLOR.lightGreen,
  ready: COLOR.lightGreen,
  init: COLOR.lightGreen,
  completed: COLOR.lightGreen,
  active: COLOR.blueLight,
  stopped: COLOR.orange,
  failed: COLOR.darkOrange,
  warning: COLOR.red,
  succeed: COLOR.lightGreen,
  skipped: COLOR.yellow,
  recovering: COLOR.darkGrey,
  stalled: COLOR.redHighlight,
  inProgress: COLOR.lightGrey
};

export const PRIORITY = {
  1: { color: COLOR.red, name: 'Highest' },
  2: { color: COLOR.darkOrange, name: 'High' },
  3: { color: COLOR.orange, name: 'Medium' },
  4: { color: COLOR.lightGreen, name: 'Low' },
  5: { color: COLOR.blueLight, name: 'Lowest' }
};
