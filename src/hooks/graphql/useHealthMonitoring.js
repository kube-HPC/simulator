import { useQuery } from '@apollo/client';
import { HEALTH_MONITORING_QUERY } from 'graphql/queries';

const useHealthMonitoring = (enabled = true) =>
  useQuery(HEALTH_MONITORING_QUERY, { skip: !enabled });

export default useHealthMonitoring;
