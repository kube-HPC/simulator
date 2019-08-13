import actions from 'const/application-actions';
import TOPICS from 'const/topics';

export const socketInit = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: TOPICS.PROGRESS,
    actionType: actions.SOCKET_GET_DATA
  }
});

export const init = () => ({
  type: actions.REST_REQ_CONFIG,
  payload: {
    url: 'config',
    actionType: actions.SOCKET_GET_CONFIG
  }
});

// export const socketIsConnected = isConnected => ({
//   type: actions.SOCKET_TOGGLE_STATUS,
//   isConnected
// });
