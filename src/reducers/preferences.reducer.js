/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { actionType } from 'const';
import hashSum from 'hash-sum';

export const PREFERENCES_DEFAULTS = {
  theme: 'light',
  scoopIntervalHours: 24,
  tables: {
    jobs: { columns: {} },
    algorithms: { columns: {} },
    pipelines: { columns: {} },
  },
};

const initialState = {
  data: { ...PREFERENCES_DEFAULTS },
  loaded: false,
  syncing: false,
  lastHash: null,
  lastSavedTables: { ...PREFERENCES_DEFAULTS.tables },
};

const preferences = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    updatePreferenceLocal(state, { payload: { section, value } }) {
      if (section === 'theme' || section === 'scoopIntervalHours') {
        state.data[section] = value;
      } else {
        state.data[section] = { ...state.data[section], ...value };
      }
    },
    resetPreferencesLocal(state) {
      state.data = { ...PREFERENCES_DEFAULTS };
      state.lastHash = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        `${actionType.PREFERENCES_FETCH}_SUCCESS`,
        (state, { payload }) => {
          const serverPrefs = payload || {};
          const hash = hashSum(serverPrefs);
          if (hash !== state.lastHash && Object.keys(serverPrefs).length > 0) {
            state.data = {
              theme: serverPrefs.theme ?? PREFERENCES_DEFAULTS.theme,
              scoopIntervalHours:
                serverPrefs.scoopIntervalHours ??
                PREFERENCES_DEFAULTS.scoopIntervalHours,
              tables: {
                jobs:
                  serverPrefs.tables?.jobs ?? PREFERENCES_DEFAULTS.tables.jobs,
                algorithms:
                  serverPrefs.tables?.algorithms ??
                  PREFERENCES_DEFAULTS.tables.algorithms,
                pipelines:
                  serverPrefs.tables?.pipelines ??
                  PREFERENCES_DEFAULTS.tables.pipelines,
              },
            };
            state.lastHash = hash;
            state.lastSavedTables = { ...state.data.tables };
          }
          state.loaded = true;
        }
      )
      .addCase(`${actionType.PREFERENCES_SAVE}_PENDING`, state => {
        state.syncing = true;
      })
      .addCase(
        `${actionType.PREFERENCES_SAVE}_SUCCESS`,
        (state, { payload }) => {
          state.syncing = false;
          state.lastHash = hashSum(payload);
          state.lastSavedTables = { ...state.data.tables };
        }
      )
      .addCase(`${actionType.PREFERENCES_SAVE}_REJECT`, state => {
        state.syncing = false;
      })
      .addCase(`${actionType.PREFERENCES_RESET}_SUCCESS`, state => {
        state.data = { ...PREFERENCES_DEFAULTS };
        state.lastHash = null;
        state.lastSavedTables = { ...PREFERENCES_DEFAULTS.tables };
        state.syncing = false;
      })
      .addCase(`${actionType.PREFERENCES_RESET}_PENDING`, state => {
        state.syncing = true;
      })
      .addCase(`${actionType.PREFERENCES_RESET}_REJECT`, state => {
        state.syncing = false;
      });
  },
});

export const { updatePreferenceLocal, resetPreferencesLocal } =
  preferences.actions;
export const { reducer } = preferences;
export const selectors = state => state.preferences;
