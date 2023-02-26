const { default: gql } = require('graphql-tag');

const JOB_BY_ID_QUERY = gql`
  query JobsAggregatedByID($jobId: String!) {
    job(id: $jobId) {
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
          algorithmVersion
          taskId
          podName
          status
          startTime
          endTime
          level
          error
          warnings
          retries
          downloadFileExt
          batch {
            podName
            taskId
            status
            batchIndex
            startTime
            endTime
            output {
              storageInfo {
                path
              }
            }
          }
          batchInfo {
            idle
            completed
            errors
            running
            total
          }
          boards
          output {
            taskId
            discovery {
              host
              port
            }
            metadata {
              values
            }
            storageInfo {
              path
              size
            }
          }
          input {
            path
            value
          }
        }
        edges {
          from
          to
          value {
            types
            metrics
          }
        }
      }
      status {
        timestamp
        status
        level
        pipeline
        data {
          details
          states {
            succeed
          }
          progress
        }
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
        flowInput
        nodes {
          nodeName
          algorithmName
          input
          kind
        }
      }
      userPipeline {
        name
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
        flowInput
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
            podName
            taskId
            status
            batchIndex
            startTime
            endTime
          }
          boards
          output {
            taskId
            discovery {
              host
              port
            }
            metadata {
              values
            }
            storageInfo {
              path
              size
            }
          }
          input {
            path
          }
        }
      }
      cursor
      timeTook
    }
  }
`;

export default JOB_BY_ID_QUERY;
