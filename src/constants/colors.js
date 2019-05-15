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
  darkGrey: '#838383',
  lightGreen: '#87d068',
  yellow: '#eeda13',
  orange: '#ec8c16',
  darkOrange: '#f50'
};

export const HCOLOR = {
  colorPrimary: COLOR.blue,
  colorAccent: COLOR.whiteHighlight,
  border: COLOR.lightGrey,
  darkBorder: COLOR.grey
};

export const STATUS = {
  pending: COLOR.darkGrey,
  bootstrap: COLOR.lightGreen,
  ready: COLOR.lightGreen,
  init: COLOR.lightGreen,
  creating: COLOR.darkGrey,
  completed: COLOR.lightGreen,
  active: COLOR.blueLight,
  stopped: COLOR.orange,
  failed: COLOR.darkOrange,
  warning: COLOR.red,
  succeed: COLOR.lightGreen,
  skipped: COLOR.yellow,
  recovering: COLOR.darkGrey,
  stalled: COLOR.lightGrey,
  inProgress: COLOR.lightGrey
};

// const STATUS = {
//   bootstrap: '#2db7f5',
//   ready: '#87d068',
//   init: '#eeda13',
//   working: '#838383',
//   shutdown: '#87d068',
//   error: '#f30',
//   exit: '#f50',
//   stop: '#ec8c16',
//   count: '#2db7f5',
//   failed: 'red',
//   succeed: 'green'
// };

export const PRIORITY = {
  1: { color: STATUS.warning, name: 'Highest' },
  2: { color: STATUS.failed, name: 'High' },
  3: { color: STATUS.stopped, name: 'Medium' },
  4: { color: STATUS.completed, name: 'Low' },
  5: { color: STATUS.active, name: 'Lowest' }
};
