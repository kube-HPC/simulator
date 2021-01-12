import { createSlice } from '@reduxjs/toolkit';
import actionTypes from './actionTypes';
/**
 * @typedef {import('./datasource').Snapshot} Snapshot
 * @typedef {import('./datasource').FetchStatus} FetchStatus
 * @typedef {import('./datasource').DataSource} DataSource
 * @typedef {{
 *   [dataSourceName: string]: { status: FetchStatus; collection: Snapshot[] };
 * }} SnapshotsState
 */

/** @type {SnapshotsState} */
const initialState = {};

const snapshots = createSlice({
  name: 'snapshots',
  initialState,
  reducers: {},
  extraReducers: {
    /** @param {{ payload: DataSource[] }} action */
    [actionTypes.fetchAll.success]: (state, action) => {
      const nextState = action.payload.reduce(
        /** @returns {SnapshotsState} */
        (acc, dataSource) =>
          state[dataSource.name]
            ? acc
            : {
                ...acc,
                [dataSource.name]: { status: 'IDLE', collection: [] },
              },
        {}
      );
      return {
        ...state,
        ...nextState,
      };
    },

    [actionTypes.fetchSnapshots.success]: (state, action) => ({
      ...state,
      [action.meta.name]: { status: 'SUCCESS', collection: action.payload },
    }),
    [actionTypes.fetchSnapshots.pending]: (state, action) => ({
      ...state,
      [action.meta.name]: {
        status: 'PENDING',
        collection: state[action.meta.name]?.collection ?? [],
      },
    }),
    [actionTypes.fetchSnapshots.fail]: (state, action) => ({
      ...state,
      [action.meta.name]: {
        status: 'FAIL',
        collection: state[action.meta.name]?.collection ?? [],
      },
    }),
    [actionTypes.createSnapshot.success]: (state, action) => {
      console.log(action);
      // save the snapshots by datasource name
      return state;
    },
  },
});

export const { reducer } = snapshots;
