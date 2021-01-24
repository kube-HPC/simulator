import { createSlice } from '@reduxjs/toolkit';
import { schema } from 'hooks/useExperiments';
import actions from 'const/application-actions';
/**
 * @typedef {{ meta: MetaState }} State
 * @typedef {typeof initialState} MetaState
 */
const initialState = {
  experimentName: schema.DEFAULT,
};
// holds the experiment name *sent from the server*
// used to validate the right experiment is displayed
const meta = createSlice({
  name: 'meta',
  initialState,
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload: { meta: nextMeta } }) => ({
      ...state,
      ...nextMeta,
    }),
  },
});

export const { reducer } = meta;

export const selectors = {
  /** @param {State} state */
  experimentName: state => state.meta.experimentName,
};
