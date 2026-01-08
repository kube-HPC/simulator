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
 * @typedef {import('./datasource').AsyncType} AsyncType
 * @typedef {import('./versions').VersionsState} VersionsState
 * @typedef {import('./snapshots').SnapshotsState} SnapshotsState
 * @typedef {{
 *   dataSources: {
 *     collection: CollectionState;
 *     snapshots: SnapshotsState;
 *     status: FetchStatus;
 *     createStatus: FetchStatus;
 *     error: string | null;
 *     versions: VersionsState;
 *   };
 * }} State
 */

const entityAdapter = createEntityAdapter();
const baseSelectors = entityAdapter.getSelectors();

/** @returns {DataSource} */
const DataSourceConstructor = entry => ({
  ...entry,
  status: 'IDLE',
});

const dataSources = createSlice({
  name: 'dataSources',
  initialState: entityAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(types.fetchAll.success, (state, action) => {
        const dataSourcesMap = action.payload.map(DataSourceConstructor);
        return entityAdapter.setAll(state, dataSourcesMap);
      })
      .addCase(globalActions.SOCKET_GET_DATA, (state, action) => {
        const { dataSources: payload } = action.payload;
        const entitiesToAdd = payload
          .filter(item => !state.entities[item.id])
          .map(DataSourceConstructor);

        if (entitiesToAdd.length > 0) {
          return entityAdapter.addMany(state, entitiesToAdd);
        }
        return state;
      })
      .addCase(types.fetch.pending, (state, { meta }) =>
        entityAdapter.updateOne(state, {
          id: meta.id,
          changes: { status: 'PENDING' },
        })
      )
      .addCase(types.fetch.fail, (state, { meta }) =>
        entityAdapter.upsertOne(state, {
          id: meta.id,
          changes: { status: 'FAIL' },
        })
      )
      .addCase(types.fetch.success, (state, { payload }) =>
        entityAdapter.upsertOne(state, {
          ...payload,
          status: 'SUCCESS',
        })
      )
      .addCase(types.create.success, (state, action) => {
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
      })
      .addCase(types.postVersion.success, (state, action) => {
        if (action.payload === 'OK') return state;
        return entityAdapter.addOne(state, {
          ...action.payload,
          status: 'SUCCESS',
        });
      });
  },
});

// Reducers for managing statuses
const statusReducer =
  asyncType =>
  (state, { type }) => {
    const currentState = state || 'IDLE';

    switch (type) {
      case asyncType.retry:
        return 'IDLE';
      case asyncType.pending:
        return 'PENDING';
      case asyncType.success:
        return 'SUCCESS';
      case asyncType.fail:
        return 'FAIL';
      default:
        return currentState;
    }
  };

const status = statusReducer(types.fetchAll);
const createStatus = statusReducer(types.create);

const error = (state, { type }) => {
  const currentState = state || null;
  if (type !== types.fetchAll.fail) return currentState;
  return 'could not fetch dataSources';
};

export const reducer = combineReducers({
  collection: dataSources.reducer,
  versions: versionsReducer,
  snapshots: snapshotsReducer,
  status,
  createStatus,
  error,
});

// Selectors
export const selectors = {
  all: createSelector(
    state => state.dataSources.collection,
    state => state.dataSources.versions,
    (collectionState, versions) => {
      const entities = baseSelectors.selectEntities(collectionState);
      const activeIds = Object.values(versions)
        .filter(item => item.status !== 'DELETED')
        .map(item => item.active);
      return activeIds.map(id => entities[id]);
    }
  ),
  byId: (state, id) =>
    baseSelectors.selectById(state.dataSources.collection, id),
  status: state => state.dataSources.status,
  error: state =>
    state.dataSources.status === 'FAIL' ? state.dataSources.error : null,
  count: createSelector(
    state => state.dataSources.versions,
    versions =>
      Object.values(versions).filter(item => item.status !== 'DELETED').length
  ),
  names: createSelector(
    state => baseSelectors.selectAll(state.dataSources.collection),
    collection => collection.filter(item => item.name).map(item => item.name)
  ),
  versions: (state, name) => state.dataSources.versions[name],
  snapshots: (state, dataSourceName) =>
    state.dataSources.snapshots[dataSourceName],
  createStatus: state => state.dataSources.createStatus,
};
