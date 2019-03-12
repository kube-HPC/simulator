import actions from '../constants/actions';
import topics from '../constants/topics';

export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PROGRESS,
    actionType: actions.UPDATE_ROW_DATA_TABLE
  }
});

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
