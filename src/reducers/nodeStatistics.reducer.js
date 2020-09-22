import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const nodeStatistics = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload }) {
      const { nodeStatistics: nextNodeStatistics } = payload;
      const validPayload = Array.isArray(nextNodeStatistics);
      return validPayload
        ? Immutable.set(currState, 'dataSource', nextNodeStatistics)
        : currState;
    },
  },
  Immutable.from({ dataSource: [] })
);
