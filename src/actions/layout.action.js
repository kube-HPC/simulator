import actions from 'constants/actions';

const SOCKET_TOPIC = 'PROGRESS'

export const autoCompleteFilter = filter => ({
  type: actions.LAYOUT_UPDATE_FILTER,
  payload: { filter }
});

export const socketInit = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: SOCKET_TOPIC,
    actionType: actions.LAYOUT_UPDATE_ROW_DATA_TABLE
  }
});

export const init = () => ({
  type: actions.REST_REQ_CONFIG,
  payload: {
    actionType: actions.LAYOUT_GET_CONFIG,
    url: 'config'
  }
});
