import { createSlice } from '@reduxjs/toolkit';
import actions from 'const/application-actions';

/** @typedef {{ nodeStatistics: any[] }} State */

const slice = createSlice({
  name: 'node-statistics',
  initialState: [],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(actions.SOCKET_GET_DATA, (state, { payload }) => {
      const { nodeStatistics: nextNodeStatistics } = payload;
      const validPayload = Array.isArray(nextNodeStatistics);
      return validPayload ? nextNodeStatistics : state;
    });
  },
});

export const { reducer } = slice;
/** @param {State} state */
export const selectors = state => state.nodeStatistics;
