import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

export default handleActions(
  {
    'GET_PIPELINE_README_SUCCESS'(state, { type, payload, meta, error }) {
      return state.setIn([payload.name], payload);
    }
  },
  Immutable.from({})
);
