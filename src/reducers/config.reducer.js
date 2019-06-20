import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

export default handleActions(
  {
    [actions.GET_CONFIG_SUCCESS](state, { payload }) {
      return state.merge(payload);
    }
  },
  Immutable.from({ config: {} })
);
