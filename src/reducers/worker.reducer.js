import get from 'lodash/get';
import actions from 'const/application-actions';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/**
 * @typedef {{
 *   stats: any[];
 *   collection: any[];
 * }} WorkersState
 */

export const workersReducer = createSlice({
  name: 'workers',
  initialState: { collection: [], stats: [], sum: null },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const collection = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].actual', []);
      const nextState = { collection, stats };
      const nextSum = sum(nextState);
      return nextSum === state.sum ? state : { nextState, sum: nextSum };
    },
  },
});
export const { reducer } = workersReducer;

export const selectors = {
  all: state => state.workers.collection,
  stats: state => state.workers.stats,
  count: state => state.workers.collection.length,
  ids: createSelector(
    state => state.workers.collection,
    collection => collection.map(item => item.algorithmName)
  ),
};
