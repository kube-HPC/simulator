import actions from 'const/application-actions';

export const downloadStorageResults = path => ({
  type: actions.JOBS_DOWNLOAD_REQ,
  payload: {
    url: `/download/results?path=${path}`,
    actionType: actions.JOBS_DOWNLOAD_RESULTS
  }
});

export const getKubernetesLogsData = ({ podName, taskId }) => ({
  type: actions.REST_REQ,
  payload: {
    url: `/logs?podName=${podName}&taskId=${taskId}`,
    actionType: actions.JOBS_KUBERNETES_LOGS
  }
});

export const getCaching = ({ jobId, nodeName }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/caching',
    body: { jobId, nodeName },
    actionType: actions.JOBS_EXEC_CACHING
  }
});
