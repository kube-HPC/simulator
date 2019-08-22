import actions from 'const/application-actions';

export const addAlgorithm = algorithmName => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `debug/add`,
    body: { algorithmName },
    actionType: actions.DEBUG_ADD
  }
});
export const deleteAlgorithm = algorithmName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `debug/delete`,
    body: { algorithmName },
    actionType: actions.DEBUG_DELETE
  }
});
