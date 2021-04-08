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
  initialState: { collection: [], stats: [], sum: null },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      /** @type {workerEntry[]} */
      const collection = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].actual', []);
      const nextSum = sum({ collection, stats });
      if (state.sum === nextSum) return state;

      const nextCollection = collection.reduce(
        (acc, item) => ({
          ...acc,
          [item.algorithmName]: (acc[item.algorithmName] || []).concat(item),
        }),
        {}
      );
      return {
        collection: nextCollection,
        stats,
        sum: nextSum,
        ids: Object.keys(nextCollection),
      };
    },
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
  entities: state => state.workers.collection.entities,
};
