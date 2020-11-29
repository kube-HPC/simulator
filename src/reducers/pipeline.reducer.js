import actions from 'const/application-actions';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/**
 * @typedef {import('./Pipeline').Pipeline} Pipeline
 * @typedef {import('./Pipeline').Stats} Stats
 * @typedef {{
 *   collection: import('@reduxjs/toolkit').EntityState<Pipeline>;
 *   sum: string;
 *   stats: import('@reduxjs/toolkit').EntityState<Stats>;
 * }} PipelinesState
 * @typedef {{
 *   pipelines: PipelinesState;
 * }} State
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
      const isValidStats = Array.isArray(pipelinesStats);
      return {
        sum: nextSum,
        collection: isValidSource
          ? pipelinesEntityAdapter.setAll({}, pipelines)
          : state.collection,
        stats: isValidStats
          ? statsEntityAdapter.setAll({}, pipelinesStats)
          : state.stats,
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
    /** @param {State} state */
    all: state => statsBaseSelectors.selectAll(state.pipelines.stats),
    /**
     * @param {State} state
     * @param {string} id
     */
    byId: (state, id) =>
      statsBaseSelectors.selectById(state.pipelines.stats, id),
    /** @param {string[]} names */
    /**
     * @param {State} state
     * @param {string[]} names
     */
    byNames: (state, names) =>
      names
        .map(name => statsBaseSelectors.selectById(state.pipelines.stats, name))
        .filter(notNull),
  },
  collection: {
    /** @param {State} state */
    all: state => pipelinedBaseSelectors.selectAll(state.pipelines.collection),
    /**
     * @param {State} state
     * @param {string} id
     */
    byId: (state, id) =>
      pipelinedBaseSelectors.selectById(state.pipelines.collection, id),
    /** @param {State} state */
    names: state =>
      pipelinedBaseSelectors.selectIds(state.pipelines.collection),
    /**
     * @param {State} state
     * @param {string[]} names
     */
    byNames: (state, names) =>
      names
        .map(name =>
          pipelinedBaseSelectors.selectById(state.pipelines.collection, name)
        )
        .filter(notNull),
    /** @param {State} state */
    count: state =>
      pipelinedBaseSelectors.selectIds(state.pipelines.collection).length,
  },
};
