import { LOGS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery, useLazyQuery } from '@apollo/client';

const useLogs = ({
  podName,
  taskId = '',
  source,
  nodeKind,
  logMode,
  searchWord,
}) => {
  const query = useQuery(LOGS_QUERY, {
    variables: {
      podName,
      taskId,
      source,
      nodeKind,
      logMode,
      searchWord,
      limit: 500,
    },
  });

  usePolling(query, 3000);

  const logs = query?.data?.logsByQuery.logs || [];
  const msgPodStatus = query?.data?.logsByQuery.podStatus;

  const [getLogsLazyQuery] = useLazyQuery(LOGS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    variables: {
      podName,
      taskId,
      source,
      nodeKind,
      logMode,
      searchWord: '',
      limit: Number.MAX_VALUE,
    },
  });

  const downloadLogsAsText = async () => {
    const { data } = await getLogsLazyQuery();
    const logsData = data?.logsByQuery?.logs || [];

    const textContent = logsData
      .map(log => JSON.stringify(log, null, 2))
      .join('\n\n');

    // Create a Blob and download the file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'logs.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    query,
    logs,
    msgPodStatus,
    getLogsLazyQuery,
    downloadLogsAsText,
  };
};

export default useLogs;
