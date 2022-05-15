import { gql } from '@apollo/client';

const PIPELINE_QUERY = gql`
  query Query {
    pipelines {
      modified
      kind
      name
      priority
      experimentName
      triggers {
        cron {
          enabled
          pattern
        }
      }
      options {
        debug
        pending
        batchTolerance
        progressVerbosityLevel
        ttl
        concurrentPipelines {
          amount
          rejectOnFailure
        }
      }
      nodes {
        nodeName
        algorithmName
        ttl
        includeInResult
        batchOperation
        metrics {
          tensorboard
        }
        retry {
          policy
          limit
        }
      }
    }
  }
`;

export default PIPELINE_QUERY;
