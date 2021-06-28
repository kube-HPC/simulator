import actions from 'const/application-actions';
import qs from 'querystring';

const filterEmptyValues = object =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => value));

export const getKubernetesLogsData = ({
  podName,
  taskId,
  source = 'k8s',
  nodeKind,
  logMode,
}) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `logs?${qs.stringify(
      filterEmptyValues({ podName, taskId, source, nodeKind, logMode })
    )}`,
    actionType: actions.JOBS_KUBERNETES_LOGS,
  },
});

export const getCaching = ({ jobId, nodeName, debug }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'exec/caching',
    body: { jobId, nodeName, debug },
    actionType: actions.JOBS_EXEC_CACHING,
  },
});
