import { gql } from '@apollo/client';

const PIPELINE_STATS_QUERY = gql`
  query Query {
    pipelineStats {
      name
      stats {
        status
        count
      }
    }
  }
`;

export default PIPELINE_STATS_QUERY;
