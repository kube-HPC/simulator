import actions from 'constants/actions';
import topics from 'constants/topics';

export const autoCompleteFilter = filter => ({
  type: actions.UPDATE_FILTER,
  payload: { filter }
});

export const socketInit = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PROGRESS,
    actionType: actions.UPDATE_ROW_DATA_TABLE
  }
});

export const init = () => ({
  type: actions.REST_REQ_CONFIG,
  payload: {
    actionType: actions.GET_CONFIG,
    url: 'config'
  }
});
