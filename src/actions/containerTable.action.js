import actions from '../constants/actions';
import topics from '../constants/topics';


export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PROGRESS,
    actionType: actions.UPDATE_ROW_DATA_TABLE
  }
});

export const execRawPipeline = (pipe) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/raw',
    body: { pipe },
    actionType: actions.EXEC_RAW_PIPELINE
  }
});

export const stopPipeline = (jobId) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/stored',
    body: { jobId },
    actionType: actions.STOP_PIPELINE
  }
});
