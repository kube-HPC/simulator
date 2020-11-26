import get from 'lodash/get';
import actions from 'const/application-actions';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/**
 * @typedef {{
 *   stats: any[];
 *   collection: import('@reduxjs/toolkit').EntityState<{ algorithmName: string }>;
 * }} WorkersState
 * @typedef {{ workers: WorkersState }} State
 */

const entityAdapter = createEntityAdapter({
  selectId: item => item.algorithmName,
});

export const workersReducer = createSlice({
  name: 'workers',
  initialState: { collection: [], stats: [], sum: null },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const collection = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].actual', []);
      const nextSum = sum({ collection, stats });
      if (state.sum === nextSum) return state;
      const nextCollection = entityAdapter.setAll({}, collection);
      return { collection: nextCollection, stats, sum: nextSum };
    },
  },
});
export const { reducer } = workersReducer;
const baseSelectors = entityAdapter.getSelectors();
export const selectors = {
  /** @param {State} state */
  all: state => baseSelectors.selectAll(state.workers.collection),
  /** @param {State} state */
  stats: state => state.workers.stats,
  /** @param {State} state */
  count: state => baseSelectors.selectIds(state.workers.collection).length,
  /** @param {State} state */
  ids: state => baseSelectors.selectIds(state.workers.collection),
  /** @param {State} state */
  entities: state => state.workers.collection.entities,
};
