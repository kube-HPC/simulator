import actions from '../constants/actions';
import topics from '../constants/topics';

export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PROGRESS,
    actionType: actions.UPDATE_ROW_DATA_TABLE
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

export const stopPipeline = jobId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/stop',
    body: { jobId },
    actionType: actions.STOP_PIPELINE
  }
});

export const downloadStorageResults = path => ({
  type: actions.DOWNLOAD_REQ,
  payload: {
    url: `/download/results?path=${path}`,
    actionType: actions.DOWNLOAD_RESULTS
  }
});
