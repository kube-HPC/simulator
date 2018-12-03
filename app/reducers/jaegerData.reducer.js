import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const dataSource = {};
// const tmp = { dataSource };
const tmp = {};
// columns

const inititalState = Immutable.from(tmp);

export default handleActions({
  // ['JAEGER_REST_SUCCESS'](state, { type, payload, meta, error }) {
  //   return state.merge({ dataSource: payload || {} });
  // }
  ['JAEGER_REST_SUCCESS'](state, { type, payload, meta, error }) {
    return state.setIn([Object.keys(payload)[0]],payload);
  }

}, inititalState);
