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
  extraReducers: builder => {
    builder.addCase(
      `${actionType.SOCKET_GET_CONFIG}_SUCCESS`,
      (state, { payload }) => {
        const { monitorBackend, baseUrl } = payload.config;
        const backendApiUrl = monitorBackend.useLocation
          ? monitorBackend.path
          : `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}${monitorBackend.path}`;

        return {
          ...state,
          backendApiUrl,
          baseUrl,
          hkubeSiteUrl: monitorBackend.hkubeSiteUrl,
          hasConfig: true,
        };
      }
    );
  },
});

export const { reducer } = config;
/** @param {State} state */
export const selectors = state => state.config;
