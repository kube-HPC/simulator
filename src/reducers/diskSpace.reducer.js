import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const diskSpace = handleActions(
  {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const { diskSpace } = payload;
      return diskSpace ? Immutable.set(diskSpace, 'dataSource', diskSpace) : state;
    },
  },
  Immutable.from({ dataSource: {} }),
);
