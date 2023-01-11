import { LOGS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useLogs = ({ podName, taskId = '', source, nodeKind, logMode }) => {
  const query = useQuery(LOGS_QUERY, {
    variables: {
      podName,
      taskId,
      source,
      nodeKind,
      logMode,
    },
  });

  usePolling(query, 3000);

  const logs = query?.data?.logsByQuery.logs || [];
  const msgPodStatus = query?.data?.logsByQuery.podStatus;
  return {
    logs,
    msgPodStatus,
  };
};
export default useLogs;
