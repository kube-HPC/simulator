import actions from 'const/application-actions';

export const applyAlgorithm = formData => ({
  type: actions.REST_REQ_POST_FORM,
  payload: {
    url: 'store/algorithms/apply',
    formData,
    actionType: actions.ALGORITHM_APPLY,
  },
});

export const deleteAlgorithm = algorithmName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `store/algorithms/${algorithmName}`,
    actionType: actions.ALGORITHM_DELETE,
  },
});
