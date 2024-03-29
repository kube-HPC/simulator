import { taskStatuses } from '@hkube/consts';

const GRAPH_TYPES = {
  STATUS: taskStatuses,
  NODE_GROUPS: {
    ACTIVE: 'batchActive',
    WARNING: 'batchWarning',
    ERRORS: 'batchErrors',
    SKIPPED: 'batchSkipped',
    IDLE: 'batchIdle',
    SUCCEED: 'batchSucceed',
    STOPPED: 'batchStopped',
  },
};

export default GRAPH_TYPES;
