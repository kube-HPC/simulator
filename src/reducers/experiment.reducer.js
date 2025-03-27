/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import actions from 'const/application-actions';

/**
 * @typedef {{ name: string; description: string }} Experiment
 * @typedef {{ experiments: typeof initialState }} State
 */

const initialState = {
  /** @type {Experiment[]} */
  collection: [],
  isLoading: true,
};

const experiments = createSlice({
  name: 'experiments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      actions.SOCKET_GET_DATA,
      (state, { payload: { experiments: nextExperiments } }) => {
        state.collection = nextExperiments;
        state.isLoading = false;
      }
    );
    builder.addCase(actions.TOGGLE_EXPERIMENT_LOADING, state => {
      state.isLoading = !state.isLoading;
    });
    builder.addCase(actions.SET_EXPERIMENT_LOADING, (state, { payload }) => {
      state.isLoading = payload;
    });
  },
});

export const { reducer } = experiments;

export const selectors = {
  /** @param {State} state */
  loadingState: state => state.experiments.isLoading,
  /** @param {State} state */
  collection: state => state.experiments.collection,
  /** @param {State} state */
  all: state => state.experiments,
};
