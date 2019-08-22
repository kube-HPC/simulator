import { handleActions } from 'redux-actions';
import { get } from 'lodash';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const workerTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](state, { type, payload, meta, error }) {
      const data = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].actual', []);
      return state.merge({ dataSource: data, stats });
    }
  },
  Immutable.from({ dataSource: [] })
);
