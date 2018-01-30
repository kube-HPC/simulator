import { handleActions } from 'redux-actions';
import dateformat from 'dateformat';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const dataSource = [];
const tmp = { dataSource };
// columns

const inititalState = Immutable.from(tmp);

export default handleActions({
  [actions.UPDATE_ROW_DATA_TABLE](state, { type, payload, meta, error }) {
    const data = payload || [];
    return state.merge({ dataSource: data.workers });
  }

}, inititalState);
