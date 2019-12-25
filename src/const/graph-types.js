const GRAPH_TYPES = {
  STATUS: {
    NOT_STARTED: 'notStarted',
    RUNNING: 'running',
    COMPLETED: 'completed',
    SUCCEED: 'succeed',
    FAILED: 'failed',
    CREATING: 'creating',
    PENDING: 'pending',
    SKIPPED: 'skipped',
  },
  BATCH: {
    NOT_STARTED: 'batchNotStarted',
    RUNNING: 'batchRunning',
    COMPLETED: 'batchCompleted',
    ERRORS: 'batchErrors',
  },
  SINGLE: {
    NOT_STARTED: 'notStarted',
    RUNNING: 'running',
    COMPLETED: 'completed',
  },
  EDGE: {
    WAIT_ANY: 'waitAny',
    ALGORITHM_EXECUTION: 'algorithmExecution',
    NONE: 'none',
  },
};

export default GRAPH_TYPES;
