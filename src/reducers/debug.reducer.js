import actions from 'const/application-actions';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/**
 * @typedef {import('./Debug.d').Debug} Debug
 * @typedef {{
 *   collection: Debug[];
 *   sum: string;
 * }} DebugState
 * @typedef {{
 *   debug: DebugState;
 * }} State
 */
const debugReducer = createSlice({
  name: 'debug',
  reducers: {},
  initialState: { sum: null, collection: [] },
  extraReducers: {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const collection = (payload?.algorithms ?? []).filter(
        item => item?.options?.debug
      );
      const nextSum = sum(collection);
      if (state.sum === nextSum) return state;
      return {
        sum: nextSum,
        collection,
      };
    },
  },
});

export const { reducer } = debugReducer;

export const selectors = {
  /** @param {State} state */
  all: state => state.debug.collection,
  /** @param {State} state */
  count: state => state.debug.collection.length,
  ids: createSelector(
    /** @param {State} state */
    state => state.debug.collection,
    collection => collection.map(item => item.name)
  ),
};
