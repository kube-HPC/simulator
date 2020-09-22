import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const driverTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      return state.merge({
        dataSource:
          (payload.discovery && payload.discovery[`pipeline-driver`]) || [],
      });
    },
  },
  Immutable.from({ dataSource: [] })
);
