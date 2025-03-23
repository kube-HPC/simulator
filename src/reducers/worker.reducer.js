/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import actions from 'const/application-actions';
import { createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/**
 * @typedef {import('./worker.d').workerEntry} workerEntry
 *
 * @typedef {{
 *   stats: {
 *     stats: { algorithmName: string; count: number }[];
 *     total: number;
 *   };
 *   collection: {
 *     [algorithmName: string]: workerEntry[];
 *   };
 *   ids: string[];
 * }} WorkersState
 *
 * @typedef {{ workers: WorkersState }} State
 */

export const workersReducer = createSlice({
  name: 'workers',
  initialState: { collection: {}, stats: [], sum: null, ids: [] },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(actions.SOCKET_GET_DATA, (state, { payload }) => {
      /** @type {workerEntry[]} */
      const collection = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].actual', []);
      const nextSum = sum({ collection, stats });

      if (state.sum === nextSum) {
        return state; // If the sum hasn't changed, return the state as is
      }

      const nextCollection = collection.reduce((acc, item) => {
        acc[item.algorithmName] = (acc[item.algorithmName] || []).concat(item);
        return acc;
      }, {});

      // Update the state directly
      state.collection = nextCollection;
      state.stats = stats;
      state.sum = nextSum;
      state.ids = Object.keys(nextCollection);

      return state; // Ensure a return value is provided at the end
    });
  },
});

export const { reducer } = workersReducer;

export const selectors = {
  /** @param {State} state */
  all: state => state.workers.collection,
  /** @param {State} state */
  stats: state => state.workers.stats,
  /** @param {State} state */
  count: state => state.workers.stats.total,
  /** @param {State} state */
  ids: state => state.workers.ids,
  /** @param {State} state */
  entities: state => state.workers.collection,
};
