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

export const updateVersionName = (version, versionName) => ({
  type: actions.REST_REQ_PUT,
  payload: {
    url: `versions/versionName/`,
    body: { version, versionName },
    actionType: actions.PIPELINE_UPDATE,
  },
});
