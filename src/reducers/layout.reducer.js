import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/actions';

export const autoCompleteFilter = handleActions(
  {
    [actions.LAYOUT_UPDATE_FILTER](state, { type, payload, meta, error }) {
      return state.merge(payload);
    }
  },
  Immutable.from({ filter: '' })
);
