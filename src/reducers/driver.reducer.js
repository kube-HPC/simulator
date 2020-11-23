import actions from 'const/application-actions';
import { createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

/** @typedef {import('./Driver.d').Driver} Driver */

/**
 * @typedef {{
 *   collection: Driver[];
 *   sum: string;
 * }} DriversState
 * @typedef {{ drivers: DriversState }} State
 */

const driversReducer = createSlice({
  name: 'drivers',
  initialState: { sum: null, collection: [] },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA](state, { payload }) {
      const collection = payload?.discovery[`pipeline-driver`] || [];
      const nextSum = sum(collection);
      return nextSum === state.sum ? state : { sum: nextSum, collection };
    },
  },
});

export const { reducer } = driversReducer;

export const selectors = {
  /** @param {State} state */
  all: state => state.drivers.collection,
  /** @param {State} state */
  count: state => state.drivers.collection.length,
};
