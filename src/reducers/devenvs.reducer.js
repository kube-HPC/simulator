import { actionType } from 'const';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import sum from 'hash-sum';

const devenvEntityAdapter = createEntityAdapter({
  selectId: item => item.name,
});

const devenvs = createSlice({
  name: 'devenvs',
  initialState: {
    collection: devenvEntityAdapter.getInitialState(),
    sum: null,
  },
  reducers: {},
  extraReducers: {
    [actionType.SOCKET_GET_DATA]: (
      state,
      { payload: { devenvs: nextDevenvs } }
    ) => {
      const isValidPayload = Array.isArray(nextDevenvs);
      if (!isValidPayload) {
        return state;
      }
      const nextSum = sum(nextDevenvs);
      return nextSum === state.sum
        ? state
        : {
            sum: nextSum,
            collection: devenvEntityAdapter.setAll({}, nextDevenvs),
          };
    },
  },
});

export const { reducer } = devenvs;
const baseSelectors = devenvEntityAdapter.getSelectors();

/** @param {State} state */
export const selectors = {
  collection: {
    /** @param {State} state */
    all: state => baseSelectors.selectAll(state.devenvs.collection),
    /**
     * @param {State} state
     * @param {string} id
     */
    byId: (state, id) => baseSelectors.selectById(state.devenvs.collection, id),
    /** @param {State} state */
    names: state => baseSelectors.selectIds(state.devenvs.collection),
    /** @param {State} state */
    count: state => baseSelectors.selectIds(state.devenvs.collection).length,
  },
};
