import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const nodeStatistics = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload }) {
      const { nodeStatistics } = payload;
      const validPayload = Array.isArray(nodeStatistics);
      return validPayload ? Immutable.set(currState, 'dataSource', nodeStatistics) : currState;
    }
  },
  Immutable.from({ dataSource: [] })
);
