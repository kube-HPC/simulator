import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { actionType } from 'const';

const initialValue = Immutable.from({ isDataAvailable: false, isSocketConnected: false });

export const socketURL = handleActions(
  {
    [actionType.SOCKET_SET_URL](prevUrl, { url }) {
      return Immutable.from(url);
    },
  },
  Immutable.from(''),
);

export const connectionStatus = handleActions(
  {
    [actionType.CONNECTION_STATUS_CHANGE](prevStatus, { connectionStatus }) {
      const { isSocketConnected: currSocket, isDataAvailable: currData } = connectionStatus;
      const { isSocketConnected: prevSocket, isDataAvailable: prevData } = prevStatus;

      const isSocketConnected = currSocket === undefined ? prevSocket : currSocket;
      const isDataAvailable = currData === undefined ? prevData : currData;

      return Immutable.from({ isSocketConnected, isDataAvailable });
    },
  },
  initialValue,
);
