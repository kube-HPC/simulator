import actions from 'const/application-actions';

export const addAlgorithm = name => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `store/algorithms/debug`,
    body: { name },
    actionType: actions.DEBUG_ADD,
  },
});
export const deleteAlgorithm = algorithmName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `store/algorithms/debug/${algorithmName}`,
    actionType: actions.DEBUG_DELETE,
  },
});
