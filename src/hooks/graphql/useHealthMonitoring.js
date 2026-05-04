import { useQuery } from '@apollo/client';
import { HEALTH_MONITORING_QUERY } from 'graphql/queries';

const useHealthMonitoring = () => useQuery(HEALTH_MONITORING_QUERY);

export default useHealthMonitoring;
