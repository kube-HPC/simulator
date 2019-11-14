import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const workerTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const data = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].actual', []);
      return state.merge({ dataSource: data, stats });
    },
  },
  Immutable.from({ dataSource: [] }),
);
