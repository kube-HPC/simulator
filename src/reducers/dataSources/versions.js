/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import types from './actionTypes';
import globalActions from './../../const/application-actions';

/**
 * @typedef {import('./datasource').DataSourceVersion} DataSourceVersion
 * @typedef {import('./datasource').FetchStatus} FetchStatus
 * @typedef {{
 *   status: FetchStatus | 'DELETED';
 *   versions: DataSourceVersion[];
 *   active: string;
 *   submittingStatus?: FetchStatus;
 * }} VersionsStateEntry
 * @typedef {{
 *   [name: string]: VersionsStateEntry;
 * }} VersionsState
 * @typedef {import('./datasource').DataSource} DataSource
 */

/**
 * Initialize an entry, optional arg (current) for merging
 *
 * @type {(
 *   dataSource: DataSource,
 *   current?: VersionsStateEntry
 * ) => VersionsStateEntry}
 */
const Entry = ({ id, versionDescription, versionId }, current = {}) => ({
  ...current,
  versions: (current?.versions ?? []).concat({
    id,
    versionDescription,
    versionId,
  }),
  active: id,
});

const getIdsSet = versions => new Set(versions.map(version => version.id));

/** @type {VersionsState} */
const initialVersions = {};

// Create Async Thunks for asynchronous actions
export const fetchDataSources = createAsyncThunk(
  'datasources/fetchAll',
  async () => {
    // Perform the asynchronous fetch here
    const response = await fetch('/api/dataSources');
    return response.json();
  }
);

export const fetchVersions = createAsyncThunk(
  'datasources/fetchVersions',
  async dataSourceName => {
    // Perform the fetch for versions here
    const response = await fetch(`/api/versions/${dataSourceName}`);
    return response.json();
  }
);

const collection = createSlice({
  initialState: initialVersions,
  name: 'datasources/versions',
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle fetch data sources action
      .addCase(fetchDataSources.fulfilled, (state, action) => {
        action.payload.forEach(item => {
          if (!state[item.name]) {
            state[item.name] = Entry(item, { status: 'IDLE' });
          }
        });
      })
      .addCase(fetchDataSources.pending, state => {
        console.info(state);
        // Optionally handle loading state
      })
      .addCase(fetchDataSources.rejected, (state, action) => {
        console.info(state, action);
        // Handle fetch failure here
      })

      // Handle fetch versions action
      .addCase(fetchVersions.pending, (state, action) => {
        const name = action.meta.arg;
        if (!state[name]) return;
        state[name] = {
          ...state[name],
          status: 'PENDING',
          versions: state[name]?.versions || [],
        };
      })
      .addCase(fetchVersions.fulfilled, (state, action) => {
        const name = action.meta.arg;
        state[name] = {
          ...state[name],
          status: 'SUCCESS',
          versions: action.payload,
        };
      })
      .addCase(fetchVersions.rejected, (state, action) => {
        const name = action.meta.arg;
        state[name] = {
          ...state[name],
          status: 'FAIL',
        };
      })

      // Handle socket data sources
      .addCase(globalActions.SOCKET_GET_DATA, (state, action) => {
        action.payload.dataSources.forEach(item => {
          const { name, id } = item;
          const current = state[name];
          if (!current) {
            state[name] = Entry(item, { status: 'IDLE' });
          } else {
            const ids = getIdsSet(current.versions);
            if (!ids.has(id)) {
              state[name] = Entry(item, current);
            }
          }
        });
      })

      // Handle other types of actions (create, delete, etc.)
      .addCase(types.create.success, (state, action) => {
        const { name, versionDescription, id, versionId } = action.payload;
        state[name] = Entry(
          { id, versionDescription, versionId },
          { status: 'SUCCESS', ...state[name] }
        );
      })
      .addCase(types.delete.success, (state, { meta }) => {
        state[meta.name] = { ...state[meta.name], status: 'DELETED' };
      })
      .addCase(types.postVersion.pending, (state, action) => {
        const name = action.meta.dataSourceName;
        state[name] = { ...state[name], submittingStatus: 'PENDING' };
      })
      .addCase(types.postVersion.fail, (state, action) => {
        const name = action.meta.dataSourceName;
        state[name] = { ...state[name], submittingStatus: 'FAIL' };
      })
      .addCase(types.postVersion.success, (state, action) => {
        if (action.payload === 'OK') {
          const name = action.meta.dataSourceName;
          state[name] = { ...state[name], submittingStatus: 'IDLE' };
        } else {
          const { name, id, versionDescription, versionId } = action.payload;
          const ids = getIdsSet(state[name].versions);
          if (!ids.has(id)) {
            state[name] = Entry(
              { id, versionDescription, versionId },
              { ...state[name], submittingStatus: 'SUCCESS' }
            );
          }
        }
      });
  },
});

export const { reducer } = collection;

export const selectors = {};
