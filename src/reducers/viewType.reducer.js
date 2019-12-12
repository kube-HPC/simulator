import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { actionType } from 'const';

const initial = Immutable.from({
  isTableView: true,
});

export const viewType = handleActions(
  {
    [actionType.VIEW_TYPE_TOGGLE](state) {
      return state.merge({ isTableView: !state.isTableView });
    },
  },
  initial,
);
