import actions from 'const/application-actions';
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {typeof initialState} FilterState
 * @typedef {{ autoCompleteFilter: FilterState }} State
 */
const initialState = '';

const autoCompleteFilter = createSlice({
  name: 'autoCompleteFilter',
  initialState,
  reducers: {},
  extraReducers: {
    /** @type {(_: any, action: { payload: { filter: string } }) => string} action */
    [actions.AUTO_COMPLETE_UPDATE_FILTER]: (_, { payload: { filter } }) =>
      filter || '',
  },
});

export const { reducer } = autoCompleteFilter;
/** @param {State} state */
export const selectors = state => state.autoCompleteFilter;
