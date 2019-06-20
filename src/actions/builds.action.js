import actions from '../constants/actions';

export const cancelBuild = buildId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'builds/stop',
    body: { buildId },
    actionType: actions.BUILD_STOP
  }
});

export const rerunBuild = buildId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'builds/rerun',
    body: { buildId },
    actionType: actions.BUILD_RERUN
  }
});
