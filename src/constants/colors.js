export const COLOR = {
  blue: '#307fe6',
  blueHighlight: '#45a9ec',
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
  grey: '#ccc'
};

export const HCOLOR = {
  colorPrimary: COLOR.blue,
  colorAccent: COLOR.whiteHighlight,
  border: COLOR.lightGrey,
  darkBorder: COLOR.grey
};

export const STATUS = {
  pending: '#838383',
  bootstrap: '#87d068',
  ready: '#87d068',
  init: '#87d068',
  creating: '#838383',
  completed: '#87d068',
  active: '#2db7f5',
  stopped: '#ec8c16',
  failed: '#f50',
  succeed: '#87d068',
  skipped: '#eeda13'
};

export const PIPELINE_STATUS = {
  pending: '#838383',
  active: '#2db7f5',
  completed: '#87d068',
  failed: '#f50',
  stopped: '#ec8c16',
  stopping: '#838383',
  recovering: '#838383'
};

export const PRIORITY = {
  1: { color: '#e74c3c', name: 'Highest' },
  2: { color: '#f50', name: 'High' },
  3: { color: '#ec8c16', name: 'Medium' },
  4: { color: '#87d068', name: 'Low' },
  5: { color: '#2db7f5', name: 'Lowest' }
};
