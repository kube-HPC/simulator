import { handleActions } from 'redux-actions';
import actions from '../constants/actions';
import Immutable from 'seamless-immutable';

const inititalState = Immutable({
  hidden: false,
  selectedLayer:""
});

export default handleActions({
  [actions.TOGGLE_HIDDEN](state, {type, payload, meta, error}){
    return Immutable.set(state, 'hidden', !state.hidden);
  },
  [actions.SELECT_LAYER](state, {type, payload, meta, error}){
    return Immutable.set(state, 'selectedLayer', payload);
  },
  [actions.REMOVE_LAYER](state, {type, payload, meta, error}){
    // add correction in case of removing the current collection
    return Immutable.set(state, 'selectedLayer', payload.nextSelected);
  },
}, inititalState);
