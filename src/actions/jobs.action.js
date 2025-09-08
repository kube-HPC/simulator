import actions from 'const/application-actions';

const filterEmptyValues = object =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );

const buildQuery = params => {
  const filtered = filterEmptyValues(params);
  const searchParams = new URLSearchParams();

  Object.entries(filtered).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v));
    } else if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

export const getKubernetesLogsData = ({
  podName,
  taskId,
  source = 'k8s',
  nodeKind,
  logMode,
}) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `logs?${buildQuery({ podName, taskId, source, nodeKind, logMode })}`,
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
