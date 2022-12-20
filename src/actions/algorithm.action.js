import actions from 'const/application-actions';

export const applyAlgorithm = (formData, onSuccess) => ({
  type: actions.REST_REQ_POST_FORM,
  payload: {
    url: 'store/algorithms/apply',
    formData,
    actionType: actions.ALGORITHM_APPLY,
  },
  meta: { onSuccess },
});

export const deleteAlgorithm = algorithmName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `store/algorithms/${algorithmName}?force=true`,
    actionType: actions.ALGORITHM_DELETE,
  },
});

export const runAlgorithm = ({ name, input = [], debug = false }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/algorithm`,
    actionType: actions.ALGORITHM_RUN,
    body: {
      name,
      input,
      debug,
    },
  },
});
