import actions from 'constants/actions';

export const addPipeline = pipe => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'pipeline/add',
    body: pipe,
    actionType: actions.ADD_PIPE
  }
});

export const stopPipeline = jobId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/stop',
    body: { jobId },
    actionType: actions.STOP_PIPELINE
  }
});

export const execStoredPipe = pipeline => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/stored',
    body: pipeline,
    actionType: actions.EXEC_STORED_PIPE
  }
});

export const deleteStoredPipeline = pipelineName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: 'store/pipelines',
    body: { pipelineName },
    actionType: actions.DELETE_STORED_PIPE
  }
});

export const updateStoredPipeline = pipeline => ({
  type: actions.REST_REQ_PUT,
  payload: {
    url: 'store/pipelines',
    body: pipeline,
    actionType: actions.UPDATE_STORED_PIPELINE
  }
});

export const cronStart = (name, pattern) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'cron/start',
    body: { name, pattern },
    actionType: actions.CRON_START
  }
});

export const cronStop = (name, pattern) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'cron/stop',
    body: { name, pattern },
    actionType: actions.CRON_STOP
  }
});

export const execRawPipeline = nominalPipeline => {
  const {
    jobId,
    name,
    flowInputOrig,
    flowInput,
    startTime,
    lastRunResult,
    ...rest
  } = nominalPipeline;

  const pipeline = {
    name: name.startsWith('raw-') ? name.slice(4) : name,
    flowInput: flowInputOrig,
    ...rest
  };

  const action = {
    type: actions.REST_REQ_POST,
    payload: {
      url: 'exec/raw',
      body: pipeline,
      actionType: actions.EXEC_RAW_PIPELINE
    }
  };
  return action;
};
