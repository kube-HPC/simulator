import { handleActions } from 'redux-actions';
import actions from 'constants/application-actions';

export const socketStatus = handleActions(
  {
    [actions.SOCKET_TOGGLE_STATUS](currSocketStatus, { isConnected }) {
      return isConnected;
    }
  },
  false
);
