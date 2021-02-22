import { taskStatuses as TASK } from '@hkube/consts';
import { COLOR, COLOR_TASK_STATUS } from 'styles/colors';
import GRAPH_TYPES from './types';

const { NODE_GROUPS } = GRAPH_TYPES;
/** @type {{ [key: string]: import('vis').NodeOptions }} */
const groups = {
  [NODE_GROUPS.SUCCEED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.COMPLETED],
    },
  },
  [NODE_GROUPS.IDLE]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.PENDING],
    },
  },
  [NODE_GROUPS.ERRORS]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.FAILED],
    },
  },
  [NODE_GROUPS.ACTIVE]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.ACTIVE],
    },
  },
  [NODE_GROUPS.WARNING]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.WARNING],
    },
  },
  [NODE_GROUPS.SKIPPED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.SKIPPED],
      border: COLOR.transparentBlack,
    },
    borderWidth: 1,
    font: {
      color: COLOR.transparentBlack,
    },
  },
  source: {
    color: { border: 'white' },
  },
};

/** @returns {import('vis').Options} */
export default ({ direction }) => ({
  height: `400px`,
  physics: false,
  layout: {
    hierarchical: {
      enabled: true,
      direction,
      sortMethod: 'directed',
      nodeSpacing: 200,
    },
  },
  interaction: {
    hover: false,
  },
  // autoResize: true,
  nodes: {
    shape: 'box',
    color: {
      background: COLOR.white,
      border: COLOR.transparentBlack,
      highlight: {
        background: COLOR.yellowPale,
        border: COLOR.transparentBlack,
      },
      hover: {
        background: COLOR.darkGrey,
      },
    },
    font: {
      color: COLOR.transparentBlack,
    },
    margin: {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15,
    },
    // borderWidth: 1.5,
    borderWidth: 0,
    borderWidthSelected: 1.5,
    shadow: false,
  },
  edges: {
    width: 2,
    hoverWidth: 3,
    selectionWidth: 2,
    color: {
      highlight: COLOR.yellowPale,
    },
    arrowStrikethrough: false,
    arrows: {
      to: {
        scaleFactor: 0.75,
      },
    },
    interaction: {
      hover: true,
    },
    smooth: {
      enabled: true,
      type: 'discrete',
    },
    font: {
      vadjust: 10,
    },
  },
  groups,
});
