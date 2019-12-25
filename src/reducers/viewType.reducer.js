import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { actionType, LOCAL_STORAGE_KEYS } from 'const';
import { getBooleanLSItem } from 'utils';

const initial = Immutable.from({
  isTableView: getBooleanLSItem(LOCAL_STORAGE_KEYS.IS_TABLE_VIEW),
});

export const viewType = handleActions(
  {
    [actionType.VIEW_TYPE_TOGGLE](state) {
      return state.merge({ isTableView: !state.isTableView });
    },
  },
  initial,
);
