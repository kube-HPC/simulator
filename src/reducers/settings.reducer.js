import { createSlice } from '@reduxjs/toolkit';
import { actionType, LOCAL_STORAGE_KEYS } from 'const';
import { logModes } from '@hkube/consts';
import { getLsObjectItem } from 'utils';

/** @typedef {{ settings: typeof defaults }} State */
const defaults = {
  graphDirection: 'LR',
  logSource: 'k8s',
  logMode: logModes.ALGORITHM,
};

/** @type {typeof defaults} */
const initialState = {
  ...defaults,
  ...(getLsObjectItem(LOCAL_STORAGE_KEYS.SETTINGS) || {}),
};

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(actionType.UPDATE_SETTINGS, (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.graphDirection = payload.graphDirection ?? state.graphDirection;
      // eslint-disable-next-line no-param-reassign
      state.logSource = payload.logSource ?? state.logSource;
      // eslint-disable-next-line no-param-reassign
      state.logMode = payload.logMode ?? state.logMode;
    });
  },
});

export const { reducer } = settings;

/** @param {State} state */
export const selectors = state => state.settings;
