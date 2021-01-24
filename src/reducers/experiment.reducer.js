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
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (
      _,
      { payload: { experiments: nextExperiments } }
    ) => ({ collection: nextExperiments, isLoading: false }),
    [actions.TOGGLE_EXPERIMENT_LOADING]: state => ({
      ...state,
      isLoading: !state.isLoading,
    }),
    /** @param {{ payload: boolean }} action */
    [actions.SET_EXPERIMENT_LOADING]: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
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
