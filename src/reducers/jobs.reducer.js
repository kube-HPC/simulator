import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import actions from 'const/application-actions';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import sum from 'hash-sum';

/**
 * @typedef {import('./Job').Job} Job
 * @typedef {{
 *   collection: import('@reduxjs/toolkit').EntityState<Job>;
 *   sum: string;
 * }} JobsState
 * @typedef {{
 *   jobs: JobsState;
 * }} State
 */
/** @type {import('@reduxjs/toolkit').EntityAdapter<Job>} */
const entityAdapter = createEntityAdapter({ selectId: job => job.key });

const jobsReducer = createSlice({
  name: 'jobs',
  initialState: { sum: null, collection: entityAdapter.getInitialState() },
  reducers: {},
  extraReducers: {
    [actions.SOCKET_GET_DATA]: (state, { payload }) => {
      /** @type {{ jobs: Job[] }} */
      const { jobs } = payload;
      const nextSum = sum(jobs);
      if (state.sum === nextSum) return state;
      return {
        sum: nextSum,
        collection: entityAdapter.setAll({}, jobs),
      };
    },
  },
});

export const { reducer } = jobsReducer;

const baseSelectors = entityAdapter.getSelectors();

export const selectors = {
  /** @param {State} state */
  all: state => baseSelectors.selectAll(state.jobs.collection),
  /** @param {State} state */
  ids: state => baseSelectors.selectIds(state.jobs.collection),
  /**
   * @param {State} state
   * @param {string} id
   */
  byId: (state, id) => baseSelectors.selectById(state.jobs.collection, id),
  /** @param {State} state */
  count: state => baseSelectors.selectIds(state.jobs.collection).length,
};

const initialValue = Immutable.from({ dataSource: [] });

export const jobsKubernetesLogs = handleActions(
  {
    [actions.JOBS_KUBERNETES_LOGS_SUCCESS](state, { payload }) {
      return state.merge({ dataSource: payload });
    },
  },
  initialValue
);
