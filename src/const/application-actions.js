const actionType = {
  ALGORITHM_APPLY_VERSIONS: `ALGORITHM_APPLY_VERSIONS`,
  ALGORITHM_APPLY: `ALGORITHM_APPLY`,
  ALGORITHM_DELETE_VERSIONS: `ALGORITHM_DELETE_VERSIONS`,
  ALGORITHM_DELETE: `ALGORITHM_DELETE`,
  ALGORITHM_GET_VERSIONS: `ALGORITHM_GET_VERSIONS`,
  ALGORITHM_STORE: `ALGORITHM_STORE`,
  AUTO_COMPLETE_UPDATE_FILTER: `AUTO_COMPLETE_UPDATE_FILTER`,
  BOARD_SET_URL: `BOARD_SET_URL`,
  BUILD_RERUN: `BUILD_RERUN`,
  BUILD_STOP: `BUILD_STOP`,
  EXPERIMENT_CHANGE: `EXPERIMENT_CHANGE`,
  CLOSE_SIDEBAR: `CLOSE_SIDEBAR`,
  CLOSE_TERMINAL_CLIENT: `CLOSE_TERMINAL_CLIENT`,
  CONNECTION_STATUS_CHANGE: `CONNECTION_STATUS_CHANGE`,
  DEBUG_ADD: `DEBUG_ADD`,
  DEBUG_DELETE: `DEBUG_DELETE`,
  DRAWER_OPEN: `DRAWER_OPEN`,
  DRAWER_TOGGLE: `DRAWER_TOGGLE`,
  FILTER_TYPES: `FILTER_TYPES`,
  JOBS_DOWNLOAD_REQ: `JOBS_DOWNLOAD_REQ`,
  JOBS_DOWNLOAD_RESULTS: `JOBS_DOWNLOAD_RESULTS`,
  JOBS_EXEC_CACHING: `JOBS_EXEC_CACHING`,
  JOBS_KUBERNETES_LOGS: `JOBS_KUBERNETES_LOGS`,
  PIPELINE_ADD: `PIPELINE_ADD`,
  PIPELINE_CRON_START: `PIPELINE_CRON_START`,
  PIPELINE_CRON_STOP: `PIPELINE_CRON_STOP`,
  PIPELINE_DELETE: `PIPELINE_DELETE`,
  PIPELINE_PAUSE: `PIPELINE_PAUSE`,
  PIPELINE_RESUME: `PIPELINE_RESUME`,
  PIPELINE_START: `PIPELINE_START`,
  PIPELINE_STOP: `PIPELINE_STOP`,
  PIPELINE_UPDATE: `PIPELINE_UPDATE`,
  README_GET_ALGORITHM: `README_GET_ALGORITHM`,
  README_GET_PIPELINE: `README_GET_PIPELINE`,
  README_POST_ALGORITHM: `README_POST_ALGORITHM`,
  README_POST_PIPELINE: `README_POST_PIPELINE`,
  REST_REQ_CONFIG: `REST_REQ_CONFIG`,
  REST_REQ_DELETE: `REST_REQ_DELETE`,
  REST_REQ_GET: `REST_REQ_GET`,
  REST_REQ_POST_FORM: `REST_REQ_POST_FORM`,
  REST_REQ_POST: `REST_REQ_POST`,
  REST_REQ_PUT: `REST_REQ_PUT`,
  REST_REQ: `REST_REQ`,
  SOCKET_GET_CONFIG: `SOCKET_GET_CONFIG`,
  SOCKET_GET_DATA: `SOCKET_GET_DATA`,
  SOCKET_INIT: `SOCKET_INIT`,
  SOCKET_SET_URL: `SOCKET_SET_URL`,
  TENSORFLOW_START: `TENSORFLOW_START`,
  UPDATE_SETTINGS: `UPDATE_SETTINGS`,
  USER_GUIDE_CHANGE_STEP: `USER_GUIDE_CHANGE_STEP`,
  USER_GUIDE_TRIGGER: `USER_GUIDE_TRIGGER`,
  VIEW_TYPE_LOAD_ONCE: `VIEW_TYPE_LOAD_ONCE`,
  VIEW_TYPE_TOGGLE: `VIEW_TYPE_TOGGLE`,
};

const actionHelper = action => {
  actionType[`${action}_PENDING`] = `${action}_PENDING`;
  actionType[`${action}_SUCCESS`] = `${action}_SUCCESS`;
  actionType[`${action}_REJECT`] = `${action}_REJECT`;
};

actionHelper(actionType.SOCKET_GET_CONFIG);
actionHelper(actionType.JOBS_DOWNLOAD_RESULTS);
actionHelper(actionType.JOBS_KUBERNETES_LOGS);
actionHelper(actionType.ALGORITHM_APPLY);
actionHelper(actionType.ALGORITHM_DELETE);
actionHelper(actionType.README_GET_PIPELINE);
actionHelper(actionType.README_GET_ALGORITHM);
actionHelper(actionType.README_POST_PIPELINE);
actionHelper(actionType.README_POST_ALGORITHM);
actionHelper(actionType.ALGORITHM_GET_VERSIONS);
actionHelper(actionType.EXPERIMENT_CHANGE);

export default actionType;
