import actions from 'const/application-actions';
import {
  combineReducers,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
/**
 * @typedef {import('./pipeline.d').Pipeline} Pipeline
 * @typedef {import('./pipeline.d').Stats} Stats
 * @typedef {{
 *   collection: import('@reduxjs/toolkit').EntityState<Pipeline>;
 *   stats;
 * }} PipelinesState
 */

/** @type {import('@reduxjs/toolkit').EntityAdapter<Pipeline>} */
const pipelinesEntityAdapter = createEntityAdapter({
  selectId: item => item.name,
});
/** @type {import('@reduxjs/toolkit').EntityAdapter<Stats>} */
const statsEntityAdapter = createEntityAdapter({
  selectId: item => item.name,
});

const collection = createSlice({
  name: 'pipelines-collection',
  initialState: pipelinesEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload }) => {
      const { discovery, pipelines } = payload;
      const isValidSource = discovery && pipelines;
      return isValidSource
        ? pipelinesEntityAdapter.setAll(state, pipelines)
        : state;
    },
  },
});

const stats = createSlice({
  name: 'pipeline-stats',
  initialState: statsEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload }) => {
      const { pipelinesStats } = payload;
      const isValidStats = pipelinesStats;
      return isValidStats
        ? state
        : statsEntityAdapter.setAll(state, payload.pipelinesStats);
    },
  },
});

export const reducer = combineReducers({
  stats: stats.reducer,
  collection: collection.reducer,
});

const pipelinedBaseSelectors = pipelinesEntityAdapter.getSelectors();
const statsBaseSelectors = statsEntityAdapter.getSelectors();

const notNull = item => item;

export const selectors = {
  stats: {
    all: state => statsBaseSelectors.selectAll(state.pipelines.stats),
    byId: (state, id) =>
      statsBaseSelectors.selectById(state.pipelines.stats, id),
    /** @param {string[]} names */
    byNames: (state, names) =>
      names
        .map(name =>
          statsBaseSelectors.selectById(state.pipelines.collection, name)
        )
        .filter(notNull),
  },
  collection: {
    all: state => pipelinedBaseSelectors.selectAll(state.pipelines.collection),
    byId: (state, id) =>
      pipelinedBaseSelectors.selectById(state.pipelines.collection, id),
    names: state =>
      pipelinedBaseSelectors.selectIds(state.pipelines.collection),
    /** @param {string[]} names */
    byNames: (state, names) =>
      names
        .map(name =>
          pipelinedBaseSelectors.selectById(state.pipelines.collection, name)
        )
        .filter(notNull),
    count: state =>
      pipelinedBaseSelectors.selectIds(state.pipelines.collection).length,
  },
};
