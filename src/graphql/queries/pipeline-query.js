import { gql } from '@apollo/client';

const PIPELINE_QUERY = gql`
  query Pipelines {
    pipelines {
      list {
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
      pipelinesCount
    }
  }
`;

export default PIPELINE_QUERY;
