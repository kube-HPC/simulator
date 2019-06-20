import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

export default handleActions(
  {
    KUBERNETES_LOGS_REST_SUCCESS(state, { payload }) {
      return state.merge({ dataSource: payload });
    }
  },
  Immutable.from({ dataSource: [] })
);
