import { SERVICES } from './services';

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
  yellow: '#eeda13',
  white: 'white'
};

// View all services colors @ https://github.com/kube-HPC/hkube/labels
export const SERVICE_COLOR = {
  [SERVICES.worker]: {
    backgroundColor: '#da96e8'
  },
  [SERVICES['trigger-service']]: {
    backgroundColor: '#c5def5'
  },
  [SERVICES['task-executor']]: {
    backgroundColor: '#f9d0c4'
  },
  [SERVICES['resource-manager']]: {
    backgroundColor: '#1d76db',
    isLight: true
  },
  [SERVICES['resource-executor']]: {
    backgroundColor: '#fbca04'
  },
  [SERVICES['pipeline-driver']]: {
    backgroundColor: '#b712c9',
    isLight: true
  },
  [SERVICES['pipeline-driver-queue']]: {
    backgroundColor: '#0ec994'
  },
  [SERVICES['api-server']]: {
    backgroundColor: '#bfdadc'
  },
  [SERVICES['algorithm-queue']]: {
    backgroundColor: '#5319e7',
    isLight: true
  },
  [SERVICES['algorithm-builder']]: {
    backgroundColor: '#006b75',
    isLight: true
  },
  [SERVICES['algorithm-operator']]: {
    backgroundColor: '#ccdd2c'
  },
  default: {
    backgroundColor: COLOR.orange
  }
};

export const COLOR_LAYOUT = {
  background: COLOR.transparentGrey,
  border: COLOR.lightGrey,
  colorPrimary: COLOR.blue,
  darkBorder: COLOR.grey
};

export const COLOR_PIPELINE_STATUS = {
  active: COLOR.blueLight,
  bootstrap: COLOR.lightGreen,
  completed: COLOR.lightGreen,
  creating: COLOR.yellow,
  failed: COLOR.red,
  init: COLOR.lightGreen,
  inProgress: COLOR.lightGrey,
  pending: COLOR.darkGrey,
  ready: COLOR.lightGreen,
  recovering: COLOR.darkGrey,
  skipped: COLOR.yellow,
  stalled: COLOR.red,
  stopped: COLOR.orange,
  stopping: COLOR.orange,
  succeed: COLOR.lightGreen
};

export const COLOR_PRIORITY = {
  1: { color: COLOR.red, name: 'Highest' },
  2: { color: COLOR.darkOrange, name: 'High' },
  3: { color: COLOR.orange, name: 'Medium' },
  4: { color: COLOR.lightGreen, name: 'Low' },
  5: { color: COLOR.blueLight, name: 'Lowest' }
};
