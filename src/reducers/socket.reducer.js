import { handleActions } from 'redux-actions';
import actions from 'const/application-actions';

export const socketStatus = handleActions(
  {
    [actions.SOCKET_TOGGLE_STATUS](currSocketStatus, { isConnected }) {
      return isConnected;
    }
  },
  false
);
