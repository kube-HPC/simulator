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
  const { name, flowInputOrig, options, webhooks, priority } = nominalPipeline;
  let pipeline = {
    name,
    flowInput: flowInputOrig,
    options,
    webhooks,
    priority
  };

  let action = {
    type: actions.REST_REQ_POST,
    payload: {
      url: 'exec/stored',
      body: { pipeline },
      actionType: actions.EXEC_STORED_PIPE
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
