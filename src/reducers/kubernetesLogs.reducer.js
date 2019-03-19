import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

const tmp = { dataSource: [] };
const inititalState = Immutable.from(tmp);

export default handleActions(
  {
    KUBERNETES_LOGS_REST_SUCCESS(state, { payload }) {
      return state.merge({ dataSource: payload });
    }
  },
  inititalState
);
