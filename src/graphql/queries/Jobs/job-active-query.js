import { gql } from '@apollo/client';

const JOB_QUERY_ACTIVE = gql`
  query JobsAggregatedActive(
    $experimentName: String
    $pipelineName: String
    $algorithmName: String
    $pipelineStatus: String
    $datesRange: Range
    $cursor: String
    $limit: Int
  ) {
    jobsAggregated(
      experimentName: $experimentName
      pipelineName: $pipelineName
      algorithmName: $algorithmName
      pipelineStatus: $pipelineStatus
      datesRange: $datesRange
      cursor: $cursor
      limit: $limit
    ) {
      jobs {
        key
        status {
          pipeline
          level

          status
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
        }
        cursor
        timeTook
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
            }
          }
          name
        }
        pipeline {
          name
          experimentName
          kind
          priority
          startTime
          types
        }
      }
    }
  }
`;

export default JOB_QUERY_ACTIVE;
