import actions from 'const/application-actions';
import LOCAL_STORAGE_KEYS from 'const/local-storage';
import { getBooleanLSItem, getLsItem } from 'utils/localStorage';
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {typeof initialState} UserGuideState
 * @typedef {{ userGuide: UserGuideState }} State
 */

// When LS not available, show tutorial.
const isOn = getLsItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  ? getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  : true;

const initialState = {
  stepIndex: 0,
  isOn,
};

const userGuide = createSlice({
  initialState,
  name: 'user-guide',
  reducers: {},
  extraReducers: {
    [actions.USER_GUIDE_CHANGE_STEP]: (state, { stepIndex }) => ({
      ...state,
      stepIndex,
    }),
    [actions.USER_GUIDE_TRIGGER]: state => ({
      ...initialState,
      isOn: !state.isOn,
    }),
  },
});

export const { reducer } = userGuide;
/** @param {State} state */
export const selectors = state => state.userGuide;
