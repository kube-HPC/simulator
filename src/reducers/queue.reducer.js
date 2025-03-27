import { createSlice } from '@reduxjs/toolkit';
import actions from 'const/application-actions';

/**
 * @typedef {{ mequeueta: QueueState }} State
 *
 * @typedef {typeof initialState} QueueState
 */
const initialState = {
  managed: 0,
  preferred: 0,
};

// holds the experiment name *sent from the server*
// used to validate the right experiment is displayed
const queue = createSlice({
  name: 'queueSize',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(actions.SOCKET_GET_DATA, (state, { payload }) => {
      const { queueSize } = payload;

      // Using immer to mutate state immutably
      // eslint-disable-next-line no-param-reassign
      state.managed = queueSize?.managed || 0;
      // eslint-disable-next-line no-param-reassign
      state.preferred = queueSize?.preferred || 0;
    });
  },
});

export const { reducer } = queue;

export const selectors = {
  /** @param {State} state */
  preferred: state => state.queue.preferred,
  managed: state => state.queue.managed,
  count: state => state.queue.managed + state.queue.preferred,
};
