import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { actionType } from 'const';

const initialValue = Immutable.from({ isDataAvailable: false, isSocketConnected: false });

export const connectionStatus = handleActions(
  {
    [actionType.CONNECTION_STATUS_CHANGE](currStatus, { connectionStatus }) {
      const { isSocketConnected, isDataAvailable } = connectionStatus;
      const { isSocketConnected: prevSocketStatus, isDataAvailable: prevDataStatus } = currStatus;

      return Immutable.from({
        isSocketConnected: isSocketConnected || prevSocketStatus,
        isDataAvailable: isDataAvailable || prevDataStatus
      });
    }
  },
  initialValue
);
