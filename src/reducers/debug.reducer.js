import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

export const debugTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](state, { type, payload, meta, error }) {
      return state.merge({ dataSource: payload.algorithmsForDebug });
    }
  },
  Immutable.from({ dataSource: [] })
);
