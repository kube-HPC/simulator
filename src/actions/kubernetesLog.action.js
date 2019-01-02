import actions from '../constants/actions';

export const getKubernetesLogsData = (podId) => ({
  type: actions.REST_REQ,
  payload: {
    url: `/kubernetes/logs?podName=${podId}`,
    actionType: actions.KUBERNETES_LOGS_REST
  }
});

