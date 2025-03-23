import actions from 'const/application-actions';
import { createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/**
 * @typedef {import('./ErrorLog').ErrorLog} ErrorLog
 * @typedef {{ collection: ErrorLog[]; sum: string }} ErrorLogsState
 * @typedef {{
 *   errorLogs: ErrorLogsState;
 * }} State
 */

const errorLogs = createSlice({
  name: 'error-logs',
  /** @type {ErrorLogsState} */
  initialState: { collection: [], sum: null },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(actions.SOCKET_GET_DATA, (state, { payload }) => {
      if (!payload.logs) return state;
      const nextSum = sum(payload.logs);

      // Instead of mutating state directly, we return a new object if there's a change
      if (state.sum === nextSum) return state;

      return {
        ...state,
        collection: payload.logs,
        sum: nextSum,
      };
    });
  },
});

export const { reducer } = errorLogs;

/** @param {State} state */
export const selectors = state => state.errorLogs.collection;
