import actions from 'const/application-actions';

export const downloadPipelineResults = path => ({
  type: actions.JOBS_DOWNLOAD_REQ,
  payload: {
    url: `storage/values/${path}`,
    actionType: actions.JOBS_DOWNLOAD_RESULTS,
  },
});

export const getKubernetesLogsData = ({ podName, taskId, source = 'k8s' }) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `logs?podName=${podName}&taskId=${taskId}&source=${source}`,
    actionType: actions.JOBS_KUBERNETES_LOGS,
  },
});

export const getCaching = ({ jobId, nodeName }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/caching',
    body: { jobId, nodeName },
    actionType: actions.JOBS_EXEC_CACHING,
  },
});
