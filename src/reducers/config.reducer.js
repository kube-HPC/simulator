import { actionType } from 'const';
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {typeof initialState} ConfigState
 * @typedef {{ config: ConfigState }} State
 */
const initialState = {
  baseUrl: '',
  hasConfig: false,
};

const config = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: {
    [`${actionType.SOCKET_GET_CONFIG}_SUCCESS`]: (state, { payload }) => ({
      ...state,
      baseUrl: payload.config.baseUrl,
      hasConfig: true,
    }),
  },
});

export const { reducer } = config;
/** @param {State} state */
export const selectors = state => state.config;
