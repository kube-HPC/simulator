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
  create: {
    pending: `${actionTypes.DATASOURCE_CREATE}_PENDING`,
    success: `${actionTypes.DATASOURCE_CREATE}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_CREATE}_REJECT`,
  },
};

/**
 * @typedef {import('./datasource.d').DataSource} DataSource
 * @typedef {import('@reduxjs/toolkit').EntityState<DataSource>} CollectionState
 * @typedef {import('./datasource').DataSourceEntry} DataSourceEntry
 * @typedef {'SUCCESS' | 'PENDING' | 'FAIL' | 'IDLE'} FetchStatus
 * @typedef {{
 *   collection: CollectionState;
 *   status: FetchStatus;
 *   error: string | null;
 * }} DataSourcesState
 * @typedef {{
 *   dataSources: DataSourcesState;
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
      entityAdapter.setAll(state, action.payload),
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
      };

      return entityAdapter.addOne(state, dataSourceMeta);
    },
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
  status,
  error,
});

const baseSelectors = entityAdapter.getSelectors();

export const selectors = {
  /** @param {State} state */
  all: state => baseSelectors.selectAll(state.dataSources.collection),
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
    collection => collection.map(item => item.name)
  ),
};
