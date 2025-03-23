import { actionType } from 'const';
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {typeof initialState} BoardsState
 * @typedef {{ boards: BoardsState }} State
 */
const initialState = {
  nodeMap: {},
  taskMap: {},
  batchMap: {},
};

const boards = createSlice({
  name: 'tensor-boards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      actionType.SOCKET_GET_DATA,
      (state, { payload: { boards: nextBoards } }) => ({
        ...state,
        ...nextBoards,
      })
    );
  },
});

export const { reducer } = boards;

/** @param {State} state */
export const selectors = state => state.boards;
