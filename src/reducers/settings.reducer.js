import { actionType, LOCAL_STORAGE_KEYS } from 'const';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { getLsObjectItem } from 'utils';

const defaultSettings = getLsObjectItem(LOCAL_STORAGE_KEYS.SETTINGS) || {
  graphDirection: 'LR',
  logSource: 'k8s',
};

const initial = Immutable.from(defaultSettings);

export const settings = handleActions(
  {
    [actionType.UPDATE_SETTINGS](state, { payload }) {
      return state.merge(payload);
    },
  },
  initial,
);
