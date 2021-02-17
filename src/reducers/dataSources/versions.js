import { createSlice } from '@reduxjs/toolkit';
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
            [name]: Entry(item, { status: 'IDLE' }),
          };
        const ids = getIdsSet(current.versions);
        if (ids.has(id)) return acc;
        return {
          ...acc,
          [name]: Entry(item, current),
        };
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
          [item.name]: Entry(item, { status: 'IDLE' }),
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
        [name]: Entry(
          { id, versionDescription, versionId },
          { status: 'SUCCESS', ...state[name] }
        ),
      };
    },
    [types.postVersion.pending]: (state, action) => {
      const name = action.meta.dataSourceName;
      return {
        ...state,
        [name]: { ...state[name], submittingStatus: 'PENDING' },
      };
    },
    [types.delete.success]: (state, { meta }) => ({
      ...state,
      [meta.name]: { ...state[meta.name], status: 'DELETED' },
    }),
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
      const ids = getIdsSet(state[name].versions);
      if (ids.has(id)) return state;
      return {
        ...state,
        [name]: Entry(
          { id, versionDescription, versionId },
          { ...state[name], submittingStatus: 'SUCCESS' }
        ),
      };
    },
  },
});

export const { reducer } = collection;

export const selectors = {};
