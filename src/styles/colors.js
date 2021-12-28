import {
  boardStatuses as BOARD,
  pipelineStatuses as PIPELINE,
  taskStatuses as TASK,
} from '@hkube/consts';
import { THEMES_NAMES } from 'const';
import { SERVICES } from '../const/services';
import { Dark, Light } from './themes/themes';

export const Theme =
  localStorage.getItem('theme') === THEMES_NAMES.Dark ? Dark : Light;
export const {
  COLOR,
  COLOR_PIPELINE_TYPES,
  COLOR_PIPELINE_TYPES_TEMPLATE,
  COLOR_PRIORITY,
  COLOR_PRIORITY_TEMPLATE,
} = Theme;

export const COLOR_STORAGE = {
  FREE: COLOR.grey,
  USED: COLOR.blue,
  LABELS: COLOR.darkCharcoal,
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
  [SERVICES[`datasources-service`]]: {
    backgroundColor: `#a480d1`,
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
  // ACTIVE
  [TASK.ACTIVE]: COLOR.blueLight,
  [TASK.STORING]: COLOR.blueLight,
  // IDLE
  [TASK.PRESCHEDULE]: COLOR.lightGrey,
  [TASK.CREATING]: COLOR.lightGrey,
  [TASK.PENDING]: COLOR.lightGrey,
  // SUCCEED
  [TASK.COMPLETED]: COLOR.greenLight,
  [TASK.SUCCEED]: COLOR.greenLight,
  // ERRORS
  [TASK.CRASHED]: COLOR.redPale,
  [TASK.FAILED]: COLOR.red,
  // WARNING
  [TASK.STALLED]: COLOR.orangeLight,
  [TASK.WARNING]: COLOR.orange,
  // SKIPPED
  [TASK.SKIPPED]: COLOR.white,
};

export const COLOR_PIPELINE_STATUS = {
  [PIPELINE.ACTIVE]: COLOR.blueLight,
  [PIPELINE.COMPLETED]: COLOR.greenLight,
  [PIPELINE.CRASHED]: COLOR.redPale,
  [PIPELINE.FAILED]: COLOR.red,
  [PIPELINE.PENDING]: COLOR.white,
  [PIPELINE.RESUMED]: COLOR.blueLight,
  [PIPELINE.RUNNING]: COLOR.blue,
  [PIPELINE.STALLED]: COLOR.darkGrey,
  [PIPELINE.STOPPED]: COLOR.orange,
  [PIPELINE.PAUSED]: COLOR.yellow,
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
