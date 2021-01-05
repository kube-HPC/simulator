import { createSlice } from '@reduxjs/toolkit';
import types from './actionTypes';
import globalActions from './../../const/application-actions';

/**
 * @typedef {import('./datasource').DataSourceVersion} DataSourceVersion
 * @typedef {import('./datasource').FetchStatus} FetchStatus
 * @typedef {{
 *   [name: string]: {
 *     status: FetchStatus;
 *     versions: DataSourceVersion[];
 *     active: string;
 *     submittingStatus?: FetchStatus;
 *   };
 * }} VersionsState
 * @typedef {import('./datasource').DataSource} DataSource
 */

// in the future there will be a project config object setting which version is active
// for now:
// track the latest version for each dataSource

/** @type {VersionsState} */
const initialVersions = {};
const collection = createSlice({
  initialState: initialVersions,
  name: 'datasources/versions',
  reducers: {},
  extraReducers: {
    /**
     * @param {{
     *   payload: { dataSources: DataSource[] };
     * }} action
     */
    [globalActions.SOCKET_GET_DATA]: (state, action) =>
      action.payload.dataSources.reduce((acc, item) => {
        const { name, id } = item;
        const current = acc[name];
        if (!current)
          return {
            ...acc,
            [name]: {
              status: 'IDLE',
              versions: [id],
              active: id,
            },
          };

        if (current.versions[0] !== id)
          return {
            ...acc,
            [name]: {
              ...current,
              versions: [id, ...current.versions],
              active: id,
            },
          };

        return acc;
      }, state),

    /**
     * @param {{ payload: DataSource[] }} action
     * @returns {VersionsState}
     */
    [types.fetchAll.success]: (state, action) => {
      const nextState = action.payload.reduce((acc, item) => {
        if (state[item.name]) return acc;
        return {
          ...acc,
          [item.name]: {
            status: 'IDLE',
            versions: [item.id],
            active: item.id,
          },
        };
      }, {});
      return {
        ...state,
        ...nextState,
      };
    },
    [types.fetchVersions.pending]: (state, action) => {
      if (!action?.meta?.dataSource) return state;
      const name = action.meta.dataSource;
      return {
        ...state,
        [name]: {
          ...state[name],
          status: 'PENDING',
          versions: state[name].versions || [],
        },
      };
    },
    [types.fetchVersions.success]: (state, action) => {
      if (!action?.meta?.dataSource) return state;
      const name = action.meta.dataSource;
      return {
        ...state,
        [name]: {
          ...state[name],
          status: 'SUCCESS',
          versions: action.payload,
        },
      };
    },
    [types.fetchVersions.fail]: (state, action) => {
      if (!action?.meta?.dataSource) return state;
      const name = action.meta.dataSource;
      return {
        ...state,
        [name]: {
          ...state[name],
          status: 'FAIL',
        },
      };
    },
    /** @param {{ payload: DataSource }} action */
    [types.create.success]: (state, action) => {
      const {
        payload: { name, versionDescription, id, versionId },
      } = action;
      return {
        ...state,
        [name]: {
          status: 'SUCCESS',
          versions: [{ id, versionDescription, versionId }],
          active: id,
        },
      };
    },
    [types.postVersion.pending]: (state, action) => {
      const name = action.meta.dataSourceName;
      return {
        ...state,
        [name]: { ...state[name], submittingStatus: 'PENDING' },
      };
    },
    [types.postVersion.fail]: (state, action) => {
      const name = action.meta.dataSourceName;
      return { ...state, [name]: { ...state[name], submittingStatus: 'FAIL' } };
    },
    /** @param {{ payload: 'OK' | DataSource; meta: { id: string } }} action */
    [types.postVersion.success]: (state, action) => {
      if (action.payload === 'OK') {
        const name = action.meta.dataSourceName;
        return {
          ...state,
          [name]: { ...state[name], submittingStatus: 'IDLE' },
        };
      }
      const {
        payload: { name, id, versionDescription, versionId },
      } = action;
      return {
        ...state,
        [name]: {
          ...state[name],
          versions: state[name].versions.concat({
            id,
            versionDescription,
            versionId,
          }),
          submittingStatus: 'SUCCESS',
          active: id,
        },
      };
    },
  },
});

export const { reducer } = collection;

export const selectors = {};
