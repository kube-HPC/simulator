import { gql } from '@apollo/client';

const PIPELINE_QUERY = gql`
  query Pipelines {
    pipelines {
      list {
        description

        modified
        kind
        name
        priority
        experimentName

        streaming {
          flows
          defaultFlow
        }

        webhooks {
          progress
          result
        }

        triggers {
          cron {
            enabled
            pattern
          }
          pipelines
        }

        options {
          debug
          pending
          batchTolerance
          progressVerbosityLevel
          ttl
          activeTtl
          concurrentPipelines {
            amount
            rejectOnFailure
          }
        }
        nodes {
          spec {
            name
            id

            snapshot {
              name
            }
            description
            mem
            cpu
            objectivePipeline
            numberOfTrials

            sampler {
              search_space
            }

            hyperParams {
              name
              suggest
              low
              high
              choices
            }
          }
          kind
          stateType
          input

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
        flowInput
      }
      pipelinesCount
    }
  }
`;

export default PIPELINE_QUERY;
