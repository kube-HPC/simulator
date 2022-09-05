import { LOGS_QUERY } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';

const useLazyLogs = ({ podName, taskId = '', source, nodeKind, logMode }) => {
  const [getLogs] = useLazyQuery(LOGS_QUERY, {
    variables: {
      podName,
      taskId,
      source,
      nodeKind,
      logMode,
    },
  });

  return {
    getLogs,
  };
};
export default useLazyLogs;
