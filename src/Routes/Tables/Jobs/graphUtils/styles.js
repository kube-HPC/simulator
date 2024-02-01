import { taskStatuses as TASK } from '@hkube/consts';
import { COLOR, COLOR_TASK_STATUS } from 'styles/colors';
import GRAPH_TYPES from './types';

const { NODE_GROUPS } = GRAPH_TYPES;
/** @type {{ [key: string]: import('vis').NodeOptions }} */

const groupsPreview = {
  [NODE_GROUPS.SUCCEED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.COMPLETED],
    },
  },
  [NODE_GROUPS.IDLE]: {
    // padding
    color: {
      background: COLOR.white,
      border: COLOR.transparentBlack,
    },
    borderWidth: 1,
    borderStyle: 'dashed',
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
  [NODE_GROUPS.STOPPED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.STOPPED],
    },
  },
  [NODE_GROUPS.SKIPPED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.SKIPPED],
      border: COLOR.transparentBlack,
    },
    borderWidth: 1,
  },
  source: {
    color: { border: 'white' },
  },
};

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
  [NODE_GROUPS.STOPPED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.STOPPED],
    },
  },
  [NODE_GROUPS.SKIPPED]: {
    color: {
      background: COLOR_TASK_STATUS[TASK.SKIPPED],
      border: COLOR.transparentBlack,
    },
    borderWidth: 1,
  },
  source: {
    color: { border: 'white' },
  },
};

/** @returns {import('vis').Options} */
export default ({
  direction,
  isHierarchical = false,
  nodeSpacing = 350,
  isMinified = false,
  isPreview = false,
}) => ({
  // ,nodeSpacingY=350
  height: isMinified ? '200px' : `400px`,

  physics: {
    enabled: !isHierarchical,
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.3,

      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0,
    },

    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true,
    },
    timestep: 0.5,
    adaptiveTimestep: true,
    wind: { x: 0, y: 0 },
  },
  layout: {
    hierarchical: {
      enabled: isHierarchical,
      direction,
      sortMethod: 'directed',
      nodeSpacing, // nodeSpacingY,// nodeSpacingY,
      levelSeparation: nodeSpacing,
      //  treeSpacing:nodeSpacing,
      //   blockShifting:false,
      //   edgeMinimization:false,
      //  levelSeparation:150,
      shakeTowards: 'leaves',
    },
  },
  nodes: {
    shape: 'box',
    chosen: {
      node: values => {
        // eslint-disable-next-line no-param-reassign
        values.borderWidth = 2.5;
        // values.shadow = true;
      },
    },
    color: {
      background: COLOR.white,
      border: COLOR.transparentBlack,
      highlight: {
        // background: "none",
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
  },
  edges: {
    selectionWidth: 1,
    color: {
      highlight: COLOR.purple,
    },
    arrowStrikethrough: false,
    /* arrows: {
      to: {
        scaleFactor: 0.75,
      },
    }, */
    smooth: {
      enabled: true,
      type: 'discrete',
    },
    font: {
      vadjust: 10,
    },
  },

  groups: isPreview ? groupsPreview : groups,
});
