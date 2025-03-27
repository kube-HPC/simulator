import { createSlice } from '@reduxjs/toolkit';
import actionTypes from './actionTypes';

/**
 * @typedef {import('./datasource').Snapshot} Snapshot
 * @typedef {import('./datasource').FetchStatus} FetchStatus
 * @typedef {import('./datasource').DataSource} DataSource
 *
 * @typedef {{
 *   [dataSourceName: string]: { status: FetchStatus; collection: Snapshot[] };
 * }} SnapshotsState
 */

/** @type {SnapshotsState} */
const initialState = {};

const snapshots = createSlice({
  name: 'snapshots',
  initialState,
  reducers: {
    /**
     * @param {{ payload: Snapshot; meta: { dataSourceId: string } }} action
     * @returns {SnapshotsState}
     */
    appendSnapshot: (state, { payload }) => {
      const { name } = payload.dataSource;
      const dataSource = state[name];
      return {
        ...state,
        [name]: {
          ...dataSource,
          status: 'SUCCESS',
          collection: dataSource
            ? dataSource.collection.concat(payload)
            : [payload],
        },
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(actionTypes.fetchAll.success, (state, action) => {
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
      })
      .addCase(actionTypes.fetchSnapshots.success, (state, action) => ({
        ...state,
        [action.meta.name]: { status: 'SUCCESS', collection: action.payload },
      }))
      .addCase(actionTypes.fetchSnapshots.pending, (state, action) => ({
        ...state,
        [action.meta.name]: {
          status: 'PENDING',
          collection: state[action.meta.name]?.collection ?? [],
        },
      }))
      .addCase(actionTypes.fetchSnapshots.fail, (state, action) => ({
        ...state,
        [action.meta.name]: {
          status: 'FAIL',
          collection: state[action.meta.name]?.collection ?? [],
        },
      }))
      .addCase(actionTypes.createSnapshot.success, (state, { payload }) => {
        const { name } = payload.dataSource;
        let dataSource = state[name];
        if (!dataSource) {
          dataSource = { status: 'SUCCESS', collection: [] };
        }
        return {
          ...state,
          [name]: {
            ...dataSource,
            collection: dataSource.collection.concat(payload),
          },
        };
      });
  },
});

export const { reducer, actions } = snapshots;
