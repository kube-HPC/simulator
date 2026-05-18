import { useQuery } from '@apollo/client';
import { HEALTH_MONITORING_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';

const useHealthMonitoring = (enabled = true) => {
  const query = useQuery(HEALTH_MONITORING_QUERY, { skip: !enabled });
  usePolling(query, 12000);
  return query;
};

export default useHealthMonitoring;
