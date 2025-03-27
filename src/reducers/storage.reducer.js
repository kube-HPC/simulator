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
  extraReducers: builder => {
    builder.addCase(actions.SOCKET_GET_DATA, (state, { payload }) => {
      if (payload?.diskSpace) {
        return { ...state, diskSpace: payload.diskSpace };
      }
      return state;
    });
  },
});

export const { reducer } = storage;

/** @param {State} state */
export const selectors = state => state.storage;
