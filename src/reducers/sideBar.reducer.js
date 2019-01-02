import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const initState = { visible: false, data: null };


const inititalState = Immutable.from(initState);

export default handleActions({
  [actions.OPEN_SIDEBAR](state, { type, payload, meta, error }) {
    return state.merge(payload);
  },
  [actions.CLOSE_SIDEBAR](state, { type, payload, meta, error }) {
    return state.merge(payload);
  }
}, inititalState);

// export default (state = inititalState, action) => {
//   console.log(action.type);
//   return state;
// }

