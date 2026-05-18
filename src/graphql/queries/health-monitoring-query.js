import { gql } from '@apollo/client';

const HEALTH_MONITORING_QUERY = gql`
  query HealthMonitoring {
    healthMonitoring {
      overallHealthStatus
      services {
        serviceName
        status
      }
    }
  }
`;

export default HEALTH_MONITORING_QUERY;
