import { actionType } from 'const';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

const EMPTY_MAP = {};

const initial = Immutable.from({
  nodeMap: EMPTY_MAP,
  taskMap: EMPTY_MAP,
  batchMap: EMPTY_MAP,
});

export const boards = handleActions(
  {
    [actionType.SOCKET_GET_DATA](state, { payload: { boards } }) {
      return state.merge({ ...boards });
    },
  },
  initial,
);
