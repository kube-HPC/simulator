const restHelper = action => {
  actionType[`${action}_PENDING`] = `${action}_PENDING`;
  actionType[`${action}_SUCCESS`] = `${action}_SUCCESS`;
  actionType[`${action}_REJECT`] = `${action}_REJECT`;
};

const actions = [
  'ALGORITHM_ADD',
  'ALGORITHM_APPLY',
  'ALGORITHM_DELETE',
  'ALGORITHM_STORE',
  'BUILD_RERUN',
  'BUILD_STOP',
  'CLOSE_SIDEBAR',
  'CLOSE_TERMINAL_CLIENT',
  'DEBUG_ADD',
  'DEBUG_DELETE',
  'JOBS_DOWNLOAD_REQ',
  'JOBS_DOWNLOAD_RESULTS',
  'JOBS_EXEC_CACHING',
  'JOBS_JAEGER',
  'JOBS_KUBERNETES_LOGS',
  'LAYOUT_GET_CONFIG',
  'LAYOUT_UPDATE_FILTER',
  'LAYOUT_UPDATE_ROW_DATA_TABLE',
  'PIPELINE_ADD',
  'PIPELINE_CRON_START',
  'PIPELINE_CRON_STOP',
  'PIPELINE_DELETE',
  'PIPELINE_START',
  'PIPELINE_STOP',
  'PIPELINE_UPDATE',
  'README_ADD_GET_ALGORITHM',
  'README_GET_PIPELINE',
  'README_POST_ALGORITHM',
  'README_POST_PIPELINE',
  'REST_REQ_CONFIG',
  'REST_REQ_DELETE',
  'REST_REQ_POST_FORM',
  'REST_REQ_POST',
  'REST_REQ_PUT',
  'REST_REQ',
  'SOCKET_INIT'
];

const actionType = actions.reduce(
  (acc, curr) => ({ ...acc, [curr]: curr }),
  {}
);

restHelper(actionType.ALGORITHM_APPLY);
restHelper(actionType.LAYOUT_GET_CONFIG);
restHelper(actionType.ALGORITHM_ADD);
restHelper(actionType.ALGORITHM_DELETE);
restHelper(actionType.README_GET_PIPELINE);
restHelper(actionType.README_ADD_GET_ALGORITHM);
restHelper(actionType.README_POST_PIPELINE);
restHelper(actionType.README_POST_ALGORITHM);
restHelper(actionType.JOBS_DOWNLOAD_RESULTS);

export default actionType;
