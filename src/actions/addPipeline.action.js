import actions from 'constants/actions';

export const addPipeline = pipe => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'pipeline/add',
    body: pipe,
    actionType: actions.ADD_PIPE
  }
});
