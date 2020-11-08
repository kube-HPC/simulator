import {
  createSlice,
  createEntityAdapter,
  combineReducers,
} from '@reduxjs/toolkit';
import actionTypes from './../../const/application-actions';

const types = {
  fetchAll: {
    pending: `${actionTypes.DATASOURCE_FETCH_ALL}_PENDING`,
    success: `${actionTypes.DATASOURCE_FETCH_ALL}_SUCCESS`,
    fail: `${actionTypes.DATASOURCE_FETCH_ALL}_REJECT`,
  },
};

/**
 * @typedef {import('./datasource.d').DataSource} DataSource
 * @typedef {import('@reduxjs/toolkit').EntityState<DataSource>} CollectionState
 * @typedef {{
 *   collection: CollectionState;
 *   status: 'SUCCESS' | 'PENDING' | 'FAIL' | 'IDLE';
 *   error: string | null;
 * }} DataSourcesState
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
  },
});

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

const entitySelectors = entityAdapter.getSelectors();

export const selectors = {
  /** @param {DataSourcesState} state */
  all: state => entitySelectors.selectAll(state.collection),
  /**
   * @param {DataSourcesState} state
   * @param {string} id
   */
  byId: (state, id) => entitySelectors.selectById(state.collection, id),
  /** @param {DataSourcesState} state */
  status: state => state.status,
  /** @param {DataSourcesState} state */
  error: state => (state.status === 'FAIL' ? state.error : null),
};
