import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { actionType, LOCAL_STORAGE_KEYS } from 'const';
import { getLsObjectItem } from 'utils';

const defaultSettings = getLsObjectItem(LOCAL_STORAGE_KEYS.SETTINGS) || {
  graphDirection: 'LR',
  logSource: 'k8s',
  baseUrl: '',
};

const initial = Immutable.from(defaultSettings);

export const settings = handleActions(
  {
    [actionType.UPDATE_SETTINGS](state, { payload }) {
      return state.merge(payload);
    },
    [`${actionType.SOCKET_GET_CONFIG}_SUCCESS`](state, { payload }) {
      return state.merge({ baseURl: payload.config.board.baseUrl });
    },
  },
  initial
);
