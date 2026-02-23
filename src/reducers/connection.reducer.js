import { createSlice } from '@reduxjs/toolkit';
import { actionType } from 'const';

/**
 * @typedef {{ connection: ConnectionStats }} ConnectionState
 *
 * @typedef {typeof initialState} ConnectionStats
 */

const initialState = {
  socketUrl: null,
  socketDatasourcesUrl: null,
  boardUrl: null,
  hkubeSystemVersion: null,
  kibanaUrl: null,
  structuredPrefix: null,
  grafanaUrl: null,
  grafanaDashboardUrl: null,
  dataSourceIsEnable: null,
  keycloakEnable: null,
  checkIframe: null,
  hasData: false,
  isSocketConnected: false,
};

const connection = createSlice({
  name: 'connection',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(actionType.CONNECTION_SETUP, (state, action) => ({
        ...state,
        ...action.payload,
      }))
      .addCase(actionType.CONNECTION_STATUS_CHANGE, (state, action) => ({
        ...state,
        isSocketConnected: action.payload.isSocketConnected,
      }))
      .addCase(actionType.SOCKET_GET_DATA, state => ({
        ...state,
        isSocketConnected: true,
        hasData: true,
      }));
  },
});

export const { reducer } = connection;
/** @param {ConnectionState} state */
export const selectors = state => state.connection;
