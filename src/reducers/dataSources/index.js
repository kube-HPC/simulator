import {
  createSlice,
  createEntityAdapter,
  combineReducers,
  createSelector,
} from '@reduxjs/toolkit';
import types from './actionTypes';
import { reducer as versionsReducer } from './versions';
import {
  reducer as snapshotsReducer,
  actions as snapshotsActions,
} from './snapshots';
import globalActions from './../../const/application-actions';

export { snapshotsActions };
/**
 * @typedef {import('./datasource.d').DataSource} DataSource
 * @typedef {import('@reduxjs/toolkit').EntityState<DataSource>} CollectionState
 * @typedef {import('./datasource').DataSourceEntry} DataSourceEntry
 * @typedef {import('./datasource').FetchStatus} FetchStatus
 * @typedef {import('./versions').VersionsState} VersionsState
 * @typedef {import('./snapshots').SnapshotsState} SnapshotsState
 * @typedef {{
 *   dataSources: {
 *     collection: CollectionState;
 *     snapshots: SnapshotsState;
 *     status: FetchStatus;
 *     error: string | null;
 *     versions: VersionsState;
 *   };
 * }} State
 */

/** @type {import('@reduxjs/toolkit').EntityAdapter<DataSource>} */
const entityAdapter = createEntityAdapter();

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
    /**
     * @param {{
     *   payload: { dataSources: DataSource[] };
     * }} action
     */
    [globalActions.SOCKET_GET_DATA]: (state, action) => {
      const { dataSources: payload } = action.payload;
      const entitiesToAdd = payload
        .filter(item => !state.entities[item.id])
        .map(item => ({ ...item, status: 'IDLE' }));
      if (entitiesToAdd.length === 0) return state;
      return entityAdapter.addMany(state, entitiesToAdd);
    },

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
  versions: versionsReducer,
  snapshots: snapshotsReducer,
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
    state => state.dataSources.versions,
    (collectionState, versions) => {
      const entities = baseSelectors.selectEntities(collectionState);
      const activeIds = Object.values(versions).map(item => item.active);
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
  /** @param {State} state */
  snapshots: (state, dataSourceName) =>
    state.dataSources.snapshots[dataSourceName],
};
