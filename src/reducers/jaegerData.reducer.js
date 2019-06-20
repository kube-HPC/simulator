import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/actions';

export default handleActions(
  {
    [actions.JOBS_JAEGER_SUCCESS](state, { type, payload, meta, error }) {
      return state.setIn([Object.keys(payload)[0]], payload);
    }
  },
  Immutable.from({})
);
