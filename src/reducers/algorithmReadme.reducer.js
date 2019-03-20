import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
// import actions from '../constants/actions';

// const dataSource = {};
// const tmp = { dataSource };
const tmp = {};
// columns

const inititalState = Immutable.from(tmp);

export default handleActions({
  // eslint-disable-next-line
  ['GET_ALGORITHM_README_SUCCESS'](state, { type, payload, meta, error }) {
    return state.setIn([payload.name],payload);
  }

}, inititalState);
