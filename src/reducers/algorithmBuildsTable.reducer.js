import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

const dataSource = [];
const tmp = { dataSource, showModal: false };

const initialState = Immutable.from(tmp);

export default handleActions({
  [actions.UPDATE_ROW_DATA_TABLE](state, { type, payload, meta, error }) {
    return state.merge({ dataSource: payload.algorithmBuilds });
  },
  [actions.ALGORITHM_STORE](state, { type, payload, meta, error }) {
    // return state.merge({ showModal: true });
  }

}, initialState);