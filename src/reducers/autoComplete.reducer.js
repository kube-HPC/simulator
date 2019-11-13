import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const autoCompleteFilter = handleActions(
  {
    [actions.AUTO_COMPLETE_UPDATE_FILTER](state, { payload }) {
      return state.merge(payload);
    },
  },
  Immutable.from({ filter: '' }),
);
