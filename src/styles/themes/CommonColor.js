import {
  pipelineTypes as TYPES,
  boardStatuses as BOARD,
  pipelineStatuses as PIPELINE,
  taskStatuses as TASK,
} from '@hkube/consts';

import { SERVICES } from '../../const/services';

const COMMON_COLOR = () => {
  const COLOR_STORAGE = COLOR => ({
    FREE: COLOR.grey,
    USED: COLOR.blue,
    LABELS: COLOR.darkCharcoal,
  });

  const COLOR_BOARDS = COLOR => ({
    [BOARD.CREATING]: COLOR.yellow,
    [BOARD.PENDING]: COLOR.grey,
    [BOARD.RUNNING]: COLOR.greenLight,
    [BOARD.STOPPED]: COLOR.orange,
  });

  // View all services colors @ https://github.com/kube-HPC/hkube/labels
  const COLOR_SERVICE = COLOR => ({
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
  });

  const COLOR_LAYOUT = COLOR => ({
    background: COLOR.transparentGrey,
    backgroundOnModal: COLOR.transparentBlack,
    border: COLOR.lightGrey,
    colorPrimary: COLOR.blue,
    darkBorder: COLOR.grey,
  });

  const COLOR_TASK_STATUS = COLOR => ({
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
  });

  const COLOR_PIPELINE_STATUS = COLOR => ({
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
  });

  const COLOR_PIPELINE_TYPES = COLOR => ({
    [TYPES.ALGORITHM]: COLOR.orangeLight,
    [TYPES.CRON]: COLOR.purple,
    [TYPES.INTERNAL]: COLOR.pinkLight,
    [TYPES.NODE]: COLOR.blueDark,
    [TYPES.RAW]: COLOR.redPale,
    [TYPES.STORED]: COLOR.blueLight,
    [TYPES.SUB_PIPELINE]: COLOR.orangePale,
    [TYPES.TENSORBOARD]: COLOR.greenLight,
    [TYPES.TRIGGER]: COLOR.turquoise,
  });

  const COLOR_PRIORITY = COLOR => ({
    1: { color: COLOR.red, name: `Highest` },
    2: { color: COLOR.darkOrange, name: `High` },
    3: { color: COLOR.orange, name: `Medium` },
    4: { color: COLOR.greenLight, name: `Low` },
    5: { color: COLOR.blueLight, name: `Lowest` },
  });

  const COLOR_EXPERIMENTS = [
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

  return {
    COLOR_PIPELINE_TYPES,
    COLOR_PRIORITY,
    COLOR_STORAGE,
    COLOR_BOARDS,
    COLOR_SERVICE,
    COLOR_LAYOUT,
    COLOR_TASK_STATUS,
    COLOR_PIPELINE_STATUS,
    COLOR_EXPERIMENTS,
  };
};

export default COMMON_COLOR;
