import actions from 'const/application-actions';

export const getAlgorithmVersions = algorithmName => ({
  type: actions.REST_REQ,
  payload: {
    url: `versions/algorithms/${algorithmName}`,
    actionType: actions.ALGORITHM_GET_VERSIONS,
  },
});

export const deleteAlgorithmVersion = ({ name, algorithmImage }) => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `versions/algorithms/${name}/${encodeURIComponent(algorithmImage)}`,
    actionType: actions.ALGORITHM_DELETE_VERSIONS,
  },
});

export const applyAlgorithmVersion = ({ name, image }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `versions/algorithms/apply`,
    body: { name, image },
    actionType: actions.ALGORITHM_APPLY_VERSIONS,
  },
});
