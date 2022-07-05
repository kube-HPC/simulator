import { gql } from '@apollo/client';

const NODE_STATISTICS_QUERY = gql`
  query NodeStatistics {
    nodeStatistics {
      metric
      legend
      results {
        startTime
        pipeline
        status
        timestamp
        timeTook
        data {
          progress
          details
          states {
            succeed
            failed
            stopped
            active
            creating
            preschedule
            pending
            skipped
            stalled
            warning
          }
        }
        name
        algorithmsData {
          name
          amount
          size
        }
      }
    }
  }
`;

export default NODE_STATISTICS_QUERY;
