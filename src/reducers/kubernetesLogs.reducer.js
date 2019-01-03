import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
// import actions from '../constants/actions';

// const dataSource = {};
// const tmp = { dataSource };
const tmp = {dataSource:[]};
// columns

const inititalState = Immutable.from(tmp);

export default handleActions({
  // ['JAEGER_REST_SUCCESS'](state, { type, payload, meta, error }) {
  //   return state.merge({ dataSource: payload || {} });
  // }

  'KUBERNETES_LOGS_REST_SUCCESS'(state, { payload }) {
    return state.merge({ dataSource: payload });
  }

}, inititalState);
