import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const initState = {
    location: {},
    currentSelection: ''
};

const inititalState = Immutable.from(initState);

export default handleActions(
    {
        [actions.UPDATE_SERVER_CONNECTION](state, { type, payload, meta, error }) {
            return state.merge(payload);
        }
    },
  inititalState
);
