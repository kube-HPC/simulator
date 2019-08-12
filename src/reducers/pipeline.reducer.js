import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

const DEFAULT_EMPTY = [];
const initialValue = Immutable.from({ dataSource: DEFAULT_EMPTY, dataStats: DEFAULT_EMPTY });

export const pipelineTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload }) {
      const { discovery, pipelines, pipelinesStats } = payload;
      const isValidSource = discovery && pipelines;
      const isValidStats = pipelinesStats;

      return Immutable.merge(currState, {
        dataSource: isValidSource ? payload.pipelines : DEFAULT_EMPTY,
        dataStats: isValidStats ? payload.pipelinesStats : DEFAULT_EMPTY
      });
    }
  },
  initialValue
);

export const pipelineReadme = handleActions(
  {
    [actions.README_GET_PIPELINE_SUCCESS](currState, { payload }) {
      const { name } = payload;
      return Immutable.set(currState, [name], payload);
    }
  },
  Immutable.from({})
);
