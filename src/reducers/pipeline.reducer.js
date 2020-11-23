import actions from 'const/application-actions';
import {
  createEntityAdapter,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import sum from 'hash-sum';

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

const pipelinesReducer = createSlice({
  name: 'pipelines',
  initialState: {
    collection: pipelinesEntityAdapter.getInitialState(),
    stats: statsEntityAdapter.getInitialState(),
    sum: null,
  },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload }) => {
      const { discovery, pipelines, pipelinesStats } = payload;
      const nextSum = sum(payload.pipelines);
      if (nextSum === state.sum) return state;
      const isValidSource = discovery && pipelines;
      const isValidStats = pipelinesStats;

      return {
        sum: nextSum,
        collection: isValidSource
          ? pipelinesEntityAdapter.setAll({}, pipelines)
          : state.collection,
        stats: isValidStats
          ? state.stats
          : statsEntityAdapter.setAll({}, pipelinesStats),
      };
    },
  },
});

export const { reducer } = pipelinesReducer;

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
        .map(name => statsBaseSelectors.selectById(state.pipelines.stats, name))
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
    filtered: createSelector(
      state => pipelinedBaseSelectors.selectAll(state.pipelines.collection),
      state => state.autoCompleteFilter.filter,
      (items, filter) => items.filter(item => item.name.includes(filter))
    ),
  },
};
