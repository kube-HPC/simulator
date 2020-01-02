import { SERVICES } from '../const/services';
import { PIPELINE_STATES, LOGGER_LEVEL } from 'const';
import { pipelineTypes as TYPES } from '@hkube/consts';

export const COLOR = {
  blue: `#307fe6`,
  blueLight: `#45a9ec`,
  cyan: `#98dbef`,
  darkGrey: `#807c7c`,
  grey: `#ccc`,
  lightGreen: `#87d068`,
  lightGrey: `#e8e8e8`,
  orange: `#ec8c16`,
  lightOrange: `#EAB675`,
  red: `#e74c3c`,
  transparentGrey: `#bfbfbf21`,
  yellow: `#eeda13`,
  white: `white`,
  pink: `#e543b4`,
  transparentBlack: `#00000073`,
};

export const COLOR_PIPELINE_TYPES = {
  [TYPES.CACHING]: `#307FE6`,
  [TYPES.CRON]: `#00C6E5`,
  [TYPES.INTERNAL]: `#00DFB7`,
  [TYPES.RAW]: `#FFE3A3`,
  [TYPES.STORED]: `#00A7F9`,
  [TYPES.SUB_PIPELINE]: `#F9F871`,
  [TYPES.TENSORBOARD]: `#8CF188`,
};

// View all services colors @ https://github.com/kube-HPC/hkube/labels
export const SERVICE_COLOR = {
  [SERVICES.worker]: {
    backgroundColor: `#da96e8`,
  },
  [SERVICES[`trigger-service`]]: {
    backgroundColor: `#c5def5`,
  },
  [SERVICES[`task-executor`]]: {
    backgroundColor: `#f9d0c4`,
  },
  [SERVICES[`resource-manager`]]: {
    backgroundColor: `#1d76db`,
    isLight: true,
  },
  [SERVICES[`resource-executor`]]: {
    backgroundColor: `#fbca04`,
  },
  [SERVICES[`pipeline-driver`]]: {
    backgroundColor: `#b712c9`,
    isLight: true,
  },
  [SERVICES[`pipeline-driver-queue`]]: {
    backgroundColor: `#0ec994`,
  },
  [SERVICES[`api-server`]]: {
    backgroundColor: `#bfdadc`,
  },
  [SERVICES[`algorithm-queue`]]: {
    backgroundColor: `#5319e7`,
    isLight: true,
  },
  [SERVICES[`algorithm-builder`]]: {
    backgroundColor: `#006b75`,
    isLight: true,
  },
  [SERVICES[`algorithm-operator`]]: {
    backgroundColor: `#ccdd2c`,
  },
  [SERVICES[`caching-service`]]: {
    backgroundColor: `#b70949`,
    isLight: true,
  },
  default: {
    backgroundColor: COLOR.orange,
  },
};

export const COLOR_LAYOUT = {
  background: COLOR.transparentGrey,
  backgroundOnModal: COLOR.transparentBlack,
  border: COLOR.lightGrey,
  colorPrimary: COLOR.blue,
  darkBorder: COLOR.grey,
};

export const COLOR_PIPELINE_STATUS = {
  [PIPELINE_STATES.ACTIVE]: COLOR.blueLight,
  bootstrap: COLOR.lightGreen,
  [PIPELINE_STATES.COMPLETED]: COLOR.lightGreen,
  creating: COLOR.yellow,
  [PIPELINE_STATES.FAILED]: COLOR.red,
  [PIPELINE_STATES.INIT]: COLOR.lightGreen,
  inProgress: COLOR.yellow,
  [PIPELINE_STATES.PENDING]: COLOR.darkGrey,
  ready: COLOR.lightGreen,
  recovering: COLOR.darkGrey,
  skipped: COLOR.yellow,
  [PIPELINE_STATES.STALLED]: COLOR.red,
  stopped: COLOR.orange,
  [PIPELINE_STATES.STOPPING]: COLOR.orange,
  [PIPELINE_STATES.SUCCEED]: COLOR.lightGreen,
  [PIPELINE_STATES.PRESCHEDULE]: COLOR.cyan,
};

export const COLOR_LOGGER = {
  [LOGGER_LEVEL.INFO]: COLOR.blueLight,
  [LOGGER_LEVEL.WARN]: COLOR.yellow,
  [LOGGER_LEVEL.ERROR]: COLOR.red,
  [LOGGER_LEVEL.CRITICAL]: COLOR.orange,
  [LOGGER_LEVEL.DEBUG]: COLOR.lightGreen,
  [LOGGER_LEVEL.TRACE]: COLOR.lightGrey,
  [LOGGER_LEVEL.SILLY]: COLOR.grey,
};

export const COLOR_PRIORITY = {
  1: { color: COLOR.red, name: `Highest` },
  2: { color: COLOR.darkOrange, name: `High` },
  3: { color: COLOR.orange, name: `Medium` },
  4: { color: COLOR.lightGreen, name: `Low` },
  5: { color: COLOR.blueLight, name: `Lowest` },
};
