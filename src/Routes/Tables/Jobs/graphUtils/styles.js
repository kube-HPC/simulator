import { taskStatuses as TASK } from '@hkube/consts';
import { COLOR, COLOR_TASK_STATUS } from 'styles/colors';

/** @type {{ [key: string]: import('vis').NodeOptions }} */
const groups = {
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
    font: {
      color: COLOR.transparentBlack,
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
  completed: {
    color: {
      background: COLOR_TASK_STATUS[TASK.SUCCEED],
    },
  },
  failed: {
    color: {
      background: COLOR_TASK_STATUS[TASK.FAILED],
    },
  },
  running: {
    color: {
      background: COLOR_TASK_STATUS[TASK.ACTIVE],
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
  nodes: {
    shape: 'box',
    color: {
      background: COLOR.white,
      border: COLOR.transparentBlack,
      highlight: {
        background: COLOR.yellowPale,
        border: COLOR.blue,
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
