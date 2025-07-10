import actions from '../const/application-actions';

export const cancelBuild = buildId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'builds/stop',
    body: { buildId },
    actionType: actions.BUILD_STOP,
  },
});

export const rerunBuild = buildId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'builds/rerun',
    body: { buildId },
    actionType: actions.BUILD_RERUN,
  },
});

export const updatePipelineVersionName = (
  version,
  versionAlias,
  onSuccess
) => ({
  type: actions.REST_REQ_PUT,
  payload: {
    url: `versions/pipelines/alias/`,
    body: { version, alias: versionAlias },
    actionType: actions.ALGORITHM_VERSIONNAME_UPDATE,
  },
  meta: { onSuccess },
});

export const updateAlgorithmVersionName = (
  version,
  versionAlias,
  onSuccess
) => ({
  type: actions.REST_REQ_PUT,
  payload: {
    url: `versions/algorithms/alias/`,
    body: { version, alias: versionAlias },
    actionType: actions.PIPELINE_VERSIONNAME_UPDATE,
  },
  meta: { onSuccess },
});
