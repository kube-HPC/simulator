import { LOGS_QUERY } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';

const useLazyLogs = () => {
  const [getLogsLazyQuery] = useLazyQuery(LOGS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    variables: {
      podName: null,
      taskId: '',
      source: 'k8s',
      nodeKind: null,
      logMode: null,
    },
  });

  return {
    getLogsLazyQuery,
  };
};
export default useLazyLogs;
