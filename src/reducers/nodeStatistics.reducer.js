import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const dataSource = [];
const tmp = { dataSource };
// columns

const inititalState = Immutable.from(tmp);

export default handleActions({
  [actions.UPDATE_ROW_DATA_TABLE](state, { type, payload, meta, error }) {
    return state.merge({ dataSource: payload.nodeStatistics });
  }

}, inititalState);
