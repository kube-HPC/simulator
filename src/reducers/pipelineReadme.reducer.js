import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/actions';

export default handleActions(
  {
    [actions.README_GET_PIPELINE_SUCCESS](
      state,
      { type, payload, meta, error }
    ) {
      return state.setIn([payload.name], payload);
    }
  },
  Immutable.from({})
);
