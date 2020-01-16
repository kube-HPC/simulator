import { actionType, LOCAL_STORAGE_KEYS } from 'const';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { getBooleanLSItem } from 'utils';

const isTableView = getBooleanLSItem(LOCAL_STORAGE_KEYS.IS_TABLE_VIEW);

const initial = Immutable.from({
  isTableView,
  loadedOnce: !isTableView,
});

export const viewType = handleActions(
  {
    [actionType.VIEW_TYPE_TOGGLE](state) {
      return state.merge({ ...state, isTableView: !state.isTableView });
    },
    [actionType.VIEW_TYPE_LOAD_ONCE](state) {
      return state.merge({ ...state, loadedOnce: true });
    },
  },
  initial,
);
