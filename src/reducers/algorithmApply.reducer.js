import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const initialState = Immutable.from({ message: undefined });

export default handleActions(
  {
    [actions.ALGORITHM_APPLY_SUCCESS](state, { type, payload, meta, error }) {
      return state.merge({ payload });
    }
  },
  initialState
);
