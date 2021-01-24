import actionTypes from './../../const/application-actions';

export default {
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
  fetchSnapshots: {
    pending: `${actionTypes.SNAPSHOT_FETCH_ALL}_PENDING`,
    success: `${actionTypes.SNAPSHOT_FETCH_ALL}_SUCCESS`,
    fail: `${actionTypes.SNAPSHOT_FETCH_ALL}_REJECT`,
  },
  createSnapshot: {
    pending: `${actionTypes.SNAPSHOT_POST}_PENDING`,
    success: `${actionTypes.SNAPSHOT_POST}_SUCCESS`,
    fail: `${actionTypes.SNAPSHOT_POST}_REJECT`,
  },
};
