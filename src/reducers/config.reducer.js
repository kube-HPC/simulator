import { actionType } from 'const';
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {typeof initialState} ConfigState
 *
 * @typedef {{ config: ConfigState }} State
 */
const initialState = {
  backendApiUrl: '',
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
      backendApiUrl: payload.config.monitorBackend.useLocation
        ? payload.config.monitorBackend.path
        : `${
            payload.config.monitorBackend.schema +
            payload.config.monitorBackend.host
          }:${payload.config.monitorBackend.port}${
            payload.config.monitorBackend.path
          }`,

      baseUrl: payload.config.baseUrl,
      hasConfig: true,
    }),
  },
});

export const { reducer } = config;
/** @param {State} state */
export const selectors = state => state.config;
