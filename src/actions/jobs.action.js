import actions from 'constants/actions';

export const getJaegerData = jobId => ({
  type: actions.REST_REQ,
  payload: {
    url: `/jaeger?jobId=${jobId}`,
    actionType: actions.JOBS_JAEGER
  }
});

export const downloadStorageResults = path => ({
  type: actions.JOBS_DOWNLOAD_REQ,
  payload: {
    url: `/download/results?path=${path}`,
    actionType: actions.JOBS_DOWNLOAD_RESULTS
  }
});

export const getKubernetesLogsData = podId => ({
  type: actions.REST_REQ,
  payload: {
    url: `/kubernetes/logs?podName=${podId}`,
    actionType: actions.JOBS_KUBERNETES_LOGS
  }
});

export const getCaching = (jobId, nodeName) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/caching',
    body: { jobId, nodeName },
    actionType: actions.JOBS_EXEC_CACHING
  }
});
