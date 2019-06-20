import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

export default handleActions(
  {
    'JAEGER_REST_SUCCESS'(state, { type, payload, meta, error }) {
      return state.setIn([Object.keys(payload)[0]], payload);
    }
  },
  Immutable.from({})
);
