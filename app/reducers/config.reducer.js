import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const initState = {
    config: {}
};

const inititalState = Immutable.from(initState);

export default handleActions(
    {
        [actions.GET_CONFIG_SUCCESS](state, { payload }) {
            return state.merge(payload);
        }
    },
    inititalState
);
