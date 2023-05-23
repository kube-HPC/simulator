import { createSlice } from '@reduxjs/toolkit';
import { actionType } from 'const';

/**
 * @typedef {{ connection: ConnectionStats }} ConnectionState
 *
 * @typedef {typeof initialState} ConnectionStats
 */

const initialState = {
  socketUrl: null,
  boardUrl: null,
  hkubeSystemVersion: null,
  kibanaUrl: null,
  grafanaUrl: null,
  grafanaDashboardUrl: null,
  dataSourceIsEnable: null,
  hasData: false,
  isSocketConnected: false,
};

const connection = createSlice({
  name: 'connection',
  initialState,
  reducers: {},
  extraReducers: {
    /**
     * @param {{
     *   payload: {
     *     socketUrl?: string;
     *     boardUrl?: string;
     *     hkubeSystemVersion?: string;
     *     kibanaUrl?: string;
     *     grafanaUrl?: string;
     *     grafanaDashboardUrl: string;
     *     dataSourceIsEnable?: boolean;
     *   };
     * }} action
     */
    [actionType.CONNECTION_SETUP]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    /** @param {{ payload: { isSocketConnected: boolean } }} action */
    [actionType.CONNECTION_STATUS_CHANGE]: (state, action) => ({
      ...state,
      isSocketConnected: action.payload.isSocketConnected,
    }),
    [actionType.SOCKET_GET_DATA]: state => ({
      ...state,
      isSocketConnected: true,
      hasData: true,
    }),
  },
});

export const { reducer } = connection;
/** @param {ConnectionState} state */
export const selectors = state => state.connection;
