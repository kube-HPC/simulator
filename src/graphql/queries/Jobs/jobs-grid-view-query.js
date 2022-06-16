const { default: gql } = require('graphql-tag');

const JOB_GRID_VIEW_QUERY = gql`
  query Query(
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
        graph {
          jobId
          timestamp
          nodes {
            nodeName
            algorithmName
            taskId
            podName
            status
            startTime
            endTime
            level
            batch
            boards
            output {
              taskId
            }
            input {
              path
            }
          }
          edges {
            from
            to
            value {
              types
            }
          }
        }
        status {
          timestamp
          status
          level
          pipeline
        }
        pipeline {
          name
          experimentName
          kind
          priority
          startTime
          types
          lastRunResult {
            timestamp
            status
            timeTook
          }
          flowInputMetadata {
            storageInfo {
              path
              size
            }
            metadata {
              values
            }
          }
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
          flowInput {
            files {
              link
            }
            mul
            data
          }
        }
        userPipeline {
          name
          experimentName
        }
        cursor
        timeTook
      }
      cursor
    }
  }
`;

export default JOB_GRID_VIEW_QUERY;
