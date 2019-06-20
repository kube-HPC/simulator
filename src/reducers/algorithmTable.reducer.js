import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

export default handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](
      state,
      { type, payload, meta, error }
    ) {
      return state.merge({ dataSource: payload.algorithms });
    }
  },
  Immutable.from({ dataSource: [] })
);
