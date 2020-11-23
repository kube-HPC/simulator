import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';
import { groupBy } from 'lodash/fp';
import actions from 'const/application-actions';
/** @typedef {import('./Algorithm.d').Algorithm} Algorithm */

/** @type {import('@reduxjs/toolkit').EntityAdapter<Algorithm>} */
const algorithmsEntityAdapter = createEntityAdapter({
  selectId: item => item.name,
});

/**
 * @typedef {{
 *   collection: import('@reduxjs/toolkit').EntityState<Algorithm>;
 *   builds: { [algorithmNames: string]: any };
 *   sum: string;
 * }} AlgorithmsState
 * @typedef {{ algorithms: AlgorithmsState }} State
 */

const algorithmsReducer = createSlice({
  name: 'algorithms',
  initialState: {
    collection: algorithmsEntityAdapter.getInitialState(),
    builds: [],
    sum: null,
  },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload }) => {
      const { algorithms, algorithmBuilds } = payload;
      const isValidPayload = Array.isArray(algorithms);
      if (!isValidPayload) return state;
      const nextSum = sum(algorithms);
      return nextSum === state.sum
        ? state
        : {
            sum: nextSum,
            collection: algorithmsEntityAdapter.setAll({}, algorithms),
            builds: groupBy('algorithmName', algorithmBuilds),
          };
    },
  },
});

export const { reducer } = algorithmsReducer;

const baseSelectors = algorithmsEntityAdapter.getSelectors();

export const selectors = {
  collection: {
    /** @param {State} state */
    all: state => baseSelectors.selectAll(state.algorithms.collection),
    /** @param {State} state */
    ids: state => baseSelectors.selectIds(state.algorithms.collection),
    /**
     * @param {State} state
     * @param {string} id
     */
    byId: (state, id) =>
      baseSelectors.selectById(state.algorithms.collection, id),
    /** @param {State} state */
    count: state => baseSelectors.selectIds(state.algorithms.collection).length,
  },
  builds: {
    /**
     * @param {State} state
     * @param {string} id
     */
    byId: (state, id) => state.algorithms.builds[id],
    /** @param {State} state */
    entities: state => state.algorithms.builds,
  },
};
