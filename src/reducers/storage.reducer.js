import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const storage = handleActions(
  {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const storage = payload.diskSpace;
      return storage ? Immutable.set(state, 'dataSource', storage) : state;
    },
  },
  Immutable.from({ dataSource: {} }),
);
