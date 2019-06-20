import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/actions';

export const storedPipeline = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](
      state,
      { type, payload, meta, error }
    ) {
      return state.merge({
        dataSource: (payload.discovery && payload.pipelines) || [],
        dataStats: payload.pipelinesStats || []
      });
    }
  },
  Immutable.from({ dataSource: [] })
);

export const pipelineReadme = handleActions(
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
