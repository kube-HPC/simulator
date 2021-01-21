import actions from 'const/application-actions';
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {typeof initialState} StorageState
 * @typedef {{ storage: StorageState }} State
 */
const initialState = {};

const storage = createSlice({
  name: 'storage',
  initialState,
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload }) =>
      payload?.diskSpace ?? state,
  },
});

export const { reducer } = storage;

/** @param {State} state */
export const selectors = state => state.storage;
