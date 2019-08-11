import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

export const algorithmTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](currState, { payload }) {
      const algorithms = payload.algorithms;
      const isValidPayload = Array.isArray(algorithms);
      return isValidPayload
        ? Immutable.set(currState, 'dataSource', algorithms)
        : currState;
    }
  },
  Immutable.from({ dataSource: [] })
);

export const algorithmBuildsTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](state, { payload }) {
      return Immutable.set(state, 'dataSource', payload.algorithmBuilds);
    }
  },
  Immutable.from({ dataSource: [], showModal: false })
);

export const algorithmReadme = handleActions(
  {
    [actions.README_GET_ALGORITHM_SUCCESS](state, { payload }) {
      return state.setIn([payload.name], payload);
    }
  },
  Immutable.from({})
);
