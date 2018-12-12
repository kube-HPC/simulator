import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const initState = {
  filter: ''
};

const inititalState = Immutable.from(initState);

export default handleActions(
  {
    [actions.UPDATE_FILTER](state, { type, payload, meta, error }) {
      return state.merge(payload);
    }
  },
  inititalState
);
