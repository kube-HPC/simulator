import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

const initialValue = Immutable.from({ dataSource: [] });

export const errorLogsTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload }) {
      const { logs } = payload;
      return logs ? Immutable.set(currState, 'dataSource', logs) : currState;
    },
  },
  initialValue,
);
