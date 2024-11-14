import { LOGS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery, useLazyQuery } from '@apollo/client';

const MIN_NUMBER_LOGS = 500;
const MAX_NUMBER_LOGS = 10000;

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
      limit: MIN_NUMBER_LOGS,
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
      limit: MAX_NUMBER_LOGS, // cannot read logs from es, err: search_phase_execution_exception
    },
  });

  const downloadLogsAsText = async strFile => {
    const { data } = await getLogsLazyQuery();
    const logsData = data?.logsByQuery?.logs || [];

    const textContent = logsData
      .map(log => JSON.stringify(log, null, 2))
      .join('\n\n');

    // Create a Blob and download the file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const currentDate = new Date().toISOString();
    link.download = `logs_${strFile}_Date_${currentDate}.txt`;
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
