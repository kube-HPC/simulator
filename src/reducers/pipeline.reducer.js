import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

const DEFAULT_EMPTY = [];
const initialValue = Immutable.from({ dataSource: DEFAULT_EMPTY, dataStats: DEFAULT_EMPTY });

export const pipelineTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](state, { payload }) {
      const isValidSource = payload.discovery && payload.pipelines;
      const isValidStats = payload.pipelinesStats;

      return Immutable.merge(state, {
        dataSource: isValidSource ? payload.pipelines : DEFAULT_EMPTY,
        dataStats: isValidStats ? payload.pipelinesStats : DEFAULT_EMPTY
      });
    }
  },
  initialValue
);

export const pipelineReadme = handleActions(
  {
    [actions.README_GET_PIPELINE_SUCCESS](state, { payload }) {
      return state.setIn([payload.name], payload);
    }
  },
  Immutable.from({})
);
