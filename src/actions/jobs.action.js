import actions from 'constants/actions';

export const getJaegerData = jobId => ({
  type: actions.REST_REQ,
  payload: {
    url: `/jaeger?jobId=${jobId}`,
    actionType: actions.JAEGER_REST
  }
});

export const downloadStorageResults = path => ({
  type: actions.DOWNLOAD_REQ,
  payload: {
    url: `/download/results?path=${path}`,
    actionType: actions.DOWNLOAD_RESULTS
  }
});

export const getKubernetesLogsData = podId => ({
  type: actions.REST_REQ,
  payload: {
    url: `/kubernetes/logs?podName=${podId}`,
    actionType: actions.KUBERNETES_LOGS_REST
  }
});

export const getCaching = (jobId, nodeName) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/caching',
    body: { jobId, nodeName },
    actionType: actions.EXEC_CACHING
  }
});
