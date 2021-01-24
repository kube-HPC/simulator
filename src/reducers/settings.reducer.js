import { createSlice } from '@reduxjs/toolkit';
import { actionType, LOCAL_STORAGE_KEYS } from 'const';
import { getLsObjectItem } from 'utils';

/**
 * @typedef {typeof initialState} SettingState
 * @typedef {{ settings: SettingsState }} State
 */
const initialState = getLsObjectItem(LOCAL_STORAGE_KEYS.SETTINGS) || {
  graphDirection: 'LR',
  logSource: 'k8s',
};

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: {
    [actionType.UPDATE_SETTINGS]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
});

export const { reducer } = settings;

/** @param {State} state */
export const selectors = state => state.settings;
