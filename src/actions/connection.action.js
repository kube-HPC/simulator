import actions from 'const/application-actions';
import TOPICS from 'const/topics';

const DEFAULT_URL = 'config';

export const socketInit = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: TOPICS.PROGRESS,
    actionType: actions.SOCKET_GET_DATA,
  },
});

export const init = () => ({
  type: actions.REST_REQ_CONFIG,
  payload: {
    url: DEFAULT_URL,
    actionType: actions.SOCKET_GET_CONFIG,
  },
});

export const setConnectionStatus = ({ isDataAvailable, isSocketConnected }) => ({
  type: actions.CONNECTION_STATUS_CHANGE,
  connectionStatus: { isDataAvailable, isSocketConnected },
});

export const setSocketURL = ({ socketURL }) => ({ type: actions.SOCKET_SET_URL, socketURL });

export const setBoardURL = ({ boardURL }) => ({ type: actions.BOARD_SET_URL, boardURL });
