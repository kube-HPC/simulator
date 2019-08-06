import { COLOR_PIPELINE_STATUS, COLOR } from 'styles/colors';

export default {
  physics: {
    enabled: false
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR',
      sortMethod: 'directed'
    }
  },
  interaction: {
    hover: true
  },
  nodes: {
    shape: 'box',
    color: {
      border: COLOR.darkGrey,
      highlight: {
        border: 'black'
      }
    },
    font: {
      size: 15,
      color: COLOR.white
    },
    margin: {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15
    },
    borderWidth: 1,
    shadow: true
  },
  edges: {
    width: 2,
    shadow: true,
    length: 200,
    smooth: {
      enabled: true,
      type: 'cubicBezier',
      roundness: 0.7
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
        background: COLOR_PIPELINE_STATUS.Preschedule
      }
    },
    notStarted: {
      color: {
        background: COLOR_PIPELINE_STATUS.pending
      }
    },
    preSchedule: {
      color: {
        background: COLOR_PIPELINE_STATUS.Preschedule
      }
    },
    completed: { color: { background: COLOR_PIPELINE_STATUS.completed } },
    source: {
      color: { border: 'white' }
    }
  }
};
