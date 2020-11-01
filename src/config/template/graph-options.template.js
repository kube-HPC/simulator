import { taskStatuses as TASK } from '@hkube/consts';
import { COLOR, COLOR_TASK_STATUS } from 'styles/colors';

// https://visjs.github.io/vis-network/docs/network/

export const directionTypes = {
  'Left Right': 'LR',
  'Up Down': 'UD',
};


const setOptions = ({ direction }) => ({
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
  nodes: {
    shape: 'box',
    color: {
      border: COLOR.darkGrey,
      highlight: {
        border: COLOR.darkGrey,
        background: COLOR.darkGrey,
      },
      hover: {
        border: COLOR.darkGrey,
        background: COLOR.darkGrey,
      },
    },
    font: {
      color: COLOR.white,
    },
    margin: {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15,
    },
    borderWidth: 1.5,
    borderWidthSelected: 1.5,
    shadow: true,
  },
  edges: {
    width: 2,
    hoverWidth: 0,
    selectionWidth: 0,
    smooth: {
      enabled: true,
      type: 'cubicBezier',
    },
  },
  groups: {
    batchCompleted: {
      color: {
        background: COLOR_TASK_STATUS[TASK.COMPLETED],
      },
    },
    batchNotStarted: {
      color: {
        background: COLOR_TASK_STATUS[TASK.PENDING],
      },
    },
    batchRunning: {
      color: {
        background: COLOR_TASK_STATUS[TASK.CREATING],
      },
    },
    batchErrors: {
      color: {
        background: COLOR_TASK_STATUS[TASK.FAILED],
      },
    },
    batchPreSchedule: {
      color: {
        background: COLOR_TASK_STATUS[TASK.PRESCHEDULE],
      },
    },
    notStarted: {
      color: {
        background: COLOR_TASK_STATUS[TASK.PENDING],
      },
    },
    preSchedule: {
      color: {
        background: COLOR_TASK_STATUS[TASK.PRESCHEDULE],
      },
    },
    completed: { color: { background: COLOR_TASK_STATUS.completed } },
    failed: { color: { background: COLOR_TASK_STATUS.failed } },
    source: {
      color: { border: 'white' },
    },
  },
});

const setCardOptions = ({ direction }) => ({
  ...setOptions({ direction }),
  height: `200px`,
  autoResize: false,
  configure: {
    enabled: false,
  },
  interaction: {
    dragNodes: false,
    dragView: false,
    multiselect: false,
    navigationButtons: false,
    selectable: false,
    hoverConnectedEdges: false,
    hover: false,
  },
  physics: {
    enabled: false,
  },
  clickToUse: true,
});

export { setCardOptions, setOptions };
