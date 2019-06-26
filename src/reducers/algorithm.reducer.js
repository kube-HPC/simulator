import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

export const algorithmTable = handleActions(
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

export const algorithmBuildsTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](
      state,
      { type, payload, meta, error }
    ) {
      return state.merge({ dataSource: payload.algorithmBuilds });
    }
  },
  Immutable.from({ dataSource: [], showModal: false })
);

export const algorithmReadme = handleActions(
  {
    [actions.README_GET_ALGORITHM_SUCCESS](
      state,
      { type, payload, meta, error }
    ) {
      return state.setIn([payload.name], payload);
    }
  },
  Immutable.from({})
);
