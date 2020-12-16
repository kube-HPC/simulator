import {
  createSlice,
  createEntityAdapter,
  combineReducers,
  createSelector,
} from '@reduxjs/toolkit';
import actionTypes from './../../const/application-actions';

const types = {
  fetchAll: {
    pending: `${actionTypes.DATASOURCE_FETCH_ALL}_PENDING`,
    success: `${actionTypes.DATASOURCE_FETCH_ALL}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_FETCH_ALL}_REJECT`,
  },
  fetchVersions: {
    pending: `${actionTypes.DATASOURCE_FETCH_VERSIONS}_PENDING`,
    success: `${actionTypes.DATASOURCE_FETCH_VERSIONS}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_FETCH_VERSIONS}_REJECT`,
  },
  create: {
    pending: `${actionTypes.DATASOURCE_CREATE}_PENDING`,
    success: `${actionTypes.DATASOURCE_CREATE}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_CREATE}_REJECT`,
  },
  fetch: {
    pending: `${actionTypes.DATASOURCE_FETCH}_PENDING`,
    success: `${actionTypes.DATASOURCE_FETCH}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_FETCH}_REJECT`,
  },
  postVersion: {
    pending: `${actionTypes.DATASOURCE_POST_VERSION}_PENDING`,
    success: `${actionTypes.DATASOURCE_POST_VERSION}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_POST_VERSION}_REJECT`,
  },
};

/**
 * @typedef {import('./datasource.d').DataSource} DataSource
 * @typedef {import('@reduxjs/toolkit').EntityState<DataSource>} CollectionState
 * @typedef {import('./datasource').DataSourceEntry} DataSourceEntry
 * @typedef {import('./datasource').FetchStatus} FetchStatus
 * @typedef {import('./datasource').DataSourceVersion} DataSourceVersion
 * @typedef {{
 *   [name: string]: { status: FetchStatus; versions: DataSourceVersion[] };
 * }} VersionsCollection
 * @typedef {{
 *   collection: CollectionState;
 *   status: FetchStatus;
 *   error: string | null;
 *   activeVersions: { [name: string]: string };
 *   versions: VersionsCollection;
 * }} DataSourcesState
 * @typedef {{
 *   dataSources: DataSourcesState;
 * }} State
 */

/** @type {import('@reduxjs/toolkit').EntityAdapter<DataSource>} */
const entityAdapter = createEntityAdapter();

// this is temporary!
// in the future there will be a project config object setting which version is active
// for now:
// track the latest version for each dataSource
const activeVersions = createSlice({
  initialState: {},
  name: 'dataSources/active-versions',
  reducers: {},
  extraReducers: {
    /** @param {{ payload: DataSource[] }} action */
    [types.fetchAll.success]: (state, action) =>
      action.payload.reduce(
        (acc, item) => ({ ...acc, [item.name]: item.id }),
        {}
      ),

    /** @param {{ payload: DataSourceEntry }} action */
    [types.create.success]: (state, action) => ({
      ...state,
      [action.payload.name]: action.payload.id,
    }),

    /** @param {{ payload: 'OK' | DataSource; meta: { id: string } }} action */
    [types.postVersion.success]: (state, action) => {
      if (action.payload === 'OK') return state;
      return { ...state, [action.payload.name]: action.payload.id };
    },
  },
});

/** @type {VersionsCollection} */
const initialVersions = {};
const versions = createSlice({
  initialState: initialVersions,
  name: 'datasources/versions',
  reducers: {},
  extraReducers: {
    /**
     * @param {{ payload: DataSource[] }} action
     * @returns {VersionsCollection}
     */
    [types.fetchAll.success]: (state, action) => {
      const nextState = action.payload.reduce((acc, item) => {
        if (state[item.name]) return acc;
        return {
          ...acc,
          [item.name]: {
            status: 'IDLE',
            versions: [],
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
      return {
        ...state,
        [action.meta.dataSource]: {
          status: 'PENDING',
          versions: state[action.meta.dataSource].versions || [],
        },
      };
    },
    [types.fetchVersions.success]: (state, action) => {
      if (!action?.meta?.dataSource) return state;
      return {
        ...state,
        [action.meta.dataSource]: {
          status: 'SUCCESS',
          versions: action.payload,
        },
      };
    },
    [types.fetchVersions.fail]: (state, action) => {
      if (!action?.meta?.dataSource) return state;
      return {
        ...state,
        [action.meta.dataSource]: {
          ...state[action.meta.dataSource],
          status: 'FAIL',
        },
      };
    },
    [types.postVersion.success]: (state, action) => {
      if (action.payload === 'OK') return state;
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
        },
      };
    },
  },
});

const dataSources = createSlice({
  initialState: entityAdapter.getInitialState(),
  name: 'dataSources',
  reducers: {},
  extraReducers: {
    /**
     * @type {(
     *   state: CollectionState,
     *   action: { payload: DataSource[] }
     * ) => CollectionState}
     */
    [types.fetchAll.success]: (state, action) =>
      entityAdapter.setAll(
        state,
        action.payload.map(entry => ({
          ...entry,
          status: 'IDLE',
        }))
      ),

    [types.fetch.pending]: (state, { meta }) =>
      entityAdapter.updateOne(state, {
        id: meta.id,
        changes: {
          status: 'PENDING',
        },
      }),

    [types.fetch.fail]: (state, { meta }) =>
      entityAdapter.upsertOne(state, {
        id: meta.id,
        ...state[meta.id],
        status: 'FAIL',
      }),

    [types.fetch.success]: (state, { payload }) =>
      entityAdapter.upsertOne(state, {
        ...payload,
        status: 'SUCCESS',
      }),

    /** @param {{ payload: DataSourceEntry }} action */
    [types.create.success]: (state, action) => {
      const { payload: dataSource } = action;
      const totalSize = dataSource.files.reduce(
        (acc, item) => acc + item.size,
        0
      );
      const filesCount = dataSource.files.length;

      const dataSourceMeta = {
        ...dataSource,
        fileTypes: [...new Set(dataSource.files.map(file => file.type))],
        filesCount,
        totalSize,
        avgFileSize: totalSize / filesCount,
        status: 'SUCCESS',
      };

      return entityAdapter.addOne(state, dataSourceMeta);
    },

    /** @param {{ payload: 'OK' | DataSource; meta: { id: string } }} action */
    [types.postVersion.success]: (state, action) =>
      action.payload === 'OK'
        ? state
        : entityAdapter.addOne(state, {
            ...action.payload,
            status: 'SUCCESS',
          }),
  },
});

/** @type {(state: FetchStatus, action: { type: string }) => FetchStatus} */
const status = (state = 'IDLE', { type }) => {
  switch (type) {
    case types.fetchAll.pending:
      return 'PENDING';
    case types.fetchAll.success:
      return 'SUCCESS';
    case types.fetchAll.fail:
      return 'FAIL';
    default:
      return state;
  }
};

const error = (state = null, { type }) => {
  if (type !== types.fetchAll.fail) return state;
  // return different types of errors by payload
  return 'could not fetch dataSources';
};

export const reducer = combineReducers({
  collection: dataSources.reducer,
  activeVersions: activeVersions.reducer,
  versions: versions.reducer,
  status,
  error,
});

const baseSelectors = entityAdapter.getSelectors();

export const selectors = {
  all: createSelector(
    // select the active version for each dataSource
    /** @param {State} state */
    state => state.dataSources.collection,
    /** @param {State} state */
    state => state.dataSources.activeVersions,
    (collectionState, activeVersionState) => {
      const entities = baseSelectors.selectEntities(collectionState);
      const activeIds = Object.values(activeVersionState);
      return activeIds.map(id => entities[id]);
    }
  ),
  /**
   * @param {State} state
   * @param {string} id
   */
  byId: (state, id) =>
    baseSelectors.selectById(state.dataSources.collection, id),
  /** @param {State} state */
  status: state => state.dataSources.status,
  /** @param {State} state */
  error: state =>
    state.dataSources.status === 'FAIL' ? state.dataSources.error : null,
  /** @param {State} state */
  count: state => baseSelectors.selectIds(state.dataSources.collection).length,
  names: createSelector(
    /** @param {State} state */
    state => baseSelectors.selectAll(state.dataSources.collection),
    // if an invalid id is used, **it will be saved to the store** with a failed status and without a name
    collection =>
      collection.reduce(
        (acc, item) => (item.name ? acc.concat(item.name) : acc),
        []
      )
  ),
  /** @param {State} state */
  versions: (state, name) => state.dataSources.versions[name],
};
