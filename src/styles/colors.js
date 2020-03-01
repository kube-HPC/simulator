import {
  boardStatuses as BOARD,
  pipelineStatuses as PIPELINE,
  pipelineTypes as TYPES,
  taskStatuses as TASK,
  verbosityLevels as LEVEL,
} from '@hkube/consts';
import { SERVICES } from '../const/services';

export const COLOR = {
  blue: `#307fe6`,
  blueDark: `#0065E5`,
  blueLight: `#45a9ec`,
  cyan: `#98dbef`,
  darkGrey: `#807c7c`,
  green: `#63C13C`,
  greenLight: `#87d068`,
  grey: `#ccc`,
  lightGrey: `#e8e8e8`,
  orange: `#ec8c16`,
  orangeLight: `#EAB675`,
  orangePale: `#FFC25A`,
  pink: `#e543b4`,
  pinkLight: `#FF5CA2`,
  purple: `#C657D0`,
  red: `#e74c3c`,
  redPale: `#FF8974`,
  transparentBlack: `#00000073`,
  transparentGrey: `#bfbfbf21`,
  turquoise: `#36DFB9`,
  white: `white`,
  yellow: `#eeda13`,
};

export const COLOR_PIPELINE_TYPES = {
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

export const COLOR_BOARDS = {
  [BOARD.CREATING]: COLOR.yellow,
  [BOARD.PENDING]: COLOR.grey,
  [BOARD.RUNNING]: COLOR.greenLight,
  [BOARD.STOPPED]: COLOR.orange,
};

// View all services colors @ https://github.com/kube-HPC/hkube/labels
export const COLOR_SERVICE = {
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

export const COLOR_TASK_STATUS = {
  [TASK.ACTIVE]: COLOR.blueLight,
  [TASK.COMPLETED]: COLOR.greenLight,
  [TASK.CRASHED]: COLOR.pink,
  [TASK.CREATING]: COLOR.yellow,
  [TASK.FAILED]: COLOR.red,
  [TASK.PENDING]: COLOR.darkGrey,
  [TASK.PRESCHEDULE]: COLOR.cyan,
  [TASK.SKIPPED]: COLOR.orangeLight,
  [TASK.STALLED]: COLOR.grey,
  [TASK.SUCCEED]: COLOR.greenLight,
  [TASK.WARNING]: COLOR.orange,
};

export const COLOR_PIPELINE_STATUS = {
  [PIPELINE.ACTIVE]: COLOR.blueLight,
  [PIPELINE.COMPLETED]: COLOR.greenLight,
  [PIPELINE.CRASHED]: COLOR.redPale,
  [PIPELINE.FAILED]: COLOR.red,
  [PIPELINE.PENDING]: COLOR.darkGrey,
  [PIPELINE.RESUMED]: COLOR.blue,
  [PIPELINE.RUNNING]: COLOR.orangeLight,
  [PIPELINE.STALLED]: COLOR.grey,
  [PIPELINE.STOPPED]: COLOR.orange,
  [PIPELINE.PAUSED]: COLOR.yellow,
};

export const COLOR_LOGGER = {
  [LEVEL.CRITICAL]: COLOR.orange,
  [LEVEL.DEBUG]: COLOR.greenLight,
  [LEVEL.ERROR]: COLOR.red,
  [LEVEL.INFO]: COLOR.blueLight,
  [LEVEL.SILLY]: COLOR.grey,
  [LEVEL.TRACE]: COLOR.lightGrey,
  [LEVEL.WARN]: COLOR.yellow,
};

export const COLOR_PRIORITY = {
  1: { color: COLOR.red, name: `Highest` },
  2: { color: COLOR.darkOrange, name: `High` },
  3: { color: COLOR.orange, name: `Medium` },
  4: { color: COLOR.greenLight, name: `Low` },
  5: { color: COLOR.blueLight, name: `Lowest` },
};

export const COLOR_EXPERIMENTS = [
  'blue',
  'geekblue',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'purple',
  'lime',
];
