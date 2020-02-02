import { LOCAL_STORAGE_KEYS } from 'const';
import actions from 'const/application-actions';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { getLsObjectItem } from 'utils';

const DEFAULT_TYPES = [];

const initialValue = Immutable(getLsObjectItem(LOCAL_STORAGE_KEYS.FILTER_TYPES) || DEFAULT_TYPES);

export const filterByType = handleActions(
  {
    [actions.FILTER_TYPES](state, { payload }) {
      return Immutable(payload);
    },
  },
  initialValue,
);
