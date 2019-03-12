import actions from '../constants/actions';

export const getCaching = (jobId, nodeName) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/caching',
    body: { jobId, nodeName },
    actionType: actions.EXEC_CACHING
  }
});
