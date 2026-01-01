import gql from 'graphql-tag';

const JOB_GRID_VIEW_QUERY = gql`
  query jobsAggregatedGrid(
    $experimentName: String
    $pipelineName: String
    $algorithmName: String
    $pipelineStatus: String
    $user: String
    $tag: String
    $datesRange: Range
    $cursor: String
    $limit: Int
  ) {
    jobsAggregated(
      experimentName: $experimentName
      pipelineName: $pipelineName
      algorithmName: $algorithmName
      pipelineStatus: $pipelineStatus
      user: $user
      tag: $tag
      datesRange: $datesRange
      cursor: $cursor
      limit: $limit
    ) {
      jobs {
        key
        auditTrail {
          action
          user
          timestamp
        }
        externalId
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
            storageInfo {
              path
              size
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
            batch {
              taskId
              podName
              status
              batchIndex
              startTime
              endTime
            }
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
          tags
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
          flowInput
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
