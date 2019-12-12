import { COLOR_PIPELINE_STATUS, COLOR } from 'styles/colors';

export default {
  physics: false,
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR',
      sortMethod: 'directed',
      nodeSpacing: 200
    }
  },
  interaction: {
    hover: false
  },
  nodes: {
    shape: 'box',
    color: {
      border: COLOR.darkGrey,
      highlight: {
        border: COLOR.darkGrey,
        background: COLOR.darkGrey
      },
      hover: {
        border: COLOR.darkGrey,
        background: COLOR.darkGrey
      }
    },
    font: {
      color: COLOR.white
    },
    margin: {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15
    },
    borderWidth: 1.5,
    borderWidthSelected: 1.5,
    shadow: true
  },
  edges: {
    width: 2,
    hoverWidth: 0,
    selectionWidth: 0,
    smooth: {
      enabled: true,
      type: 'cubicBezier'
    }
  },
  groups: {
    batchCompleted: {
      color: {
        background: COLOR_PIPELINE_STATUS.completed
      }
    },
    batchNotStarted: {
      color: {
        background: COLOR_PIPELINE_STATUS.pending
      }
    },
    batchRunning: {
      color: {
        background: COLOR_PIPELINE_STATUS.inProgress
      }
    },
    batchErrors: {
      color: {
        background: COLOR_PIPELINE_STATUS.failed
      }
    },
    batchPreSchedule: {
      color: {
        background: COLOR_PIPELINE_STATUS.preschedule
      }
    },
    notStarted: {
      color: {
        background: COLOR_PIPELINE_STATUS.pending
      }
    },
    preSchedule: {
      color: {
        background: COLOR_PIPELINE_STATUS.preschedule
      }
    },
    completed: { color: { background: COLOR_PIPELINE_STATUS.completed } },
    failed: { color: { background: COLOR_PIPELINE_STATUS.failed } },
    source: {
      color: { border: 'white' }
    }
  }
};
