import { gql } from '@apollo/client';

const JOB_QUERY = gql`
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
        status {
          pipeline
          level
          timestamp
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
      cursor
    }
  }
`;

// const JOB_QUERY = gql`
//   query ExampleQuery {
//     jobsAggregated {
//       jobs {
//         key
//         status {
//           pipeline
//           level
//           timestamp
//           status
//           data {
//             progress
//             details
//             states {
//               succeed
//             }
//           }
//         }
//         cursor
//         timeTook
//         userPipeline {
//           name
//           experimentName
//         }
//         results {
//           startTime
//           pipeline
//           status
//           timestamp
//           timeTook
//           data {
//             progress
//             details
//             states {
//               succeed
//             }
//           }
//           name
//           algorithmsData {
//             name
//             amount
//             size
//           }
//         }
//         graph {
//           jobId
//           timestamp
//           nodes {
//             nodeName
//             algorithmName
//             taskId
//             podName
//             status
//             startTime
//             endTime
//             level
//             batch
//             boards
//             output {
//               discovery {
//                 host
//                 port
//               }
//               taskId
//               metadata {
//                 values
//               }
//               storageInfo {
//                 path
//                 size
//               }
//             }
//             input {
//               path
//             }
//           }
//           edges {
//             from
//             to
//             value {
//               types
//             }
//           }
//         }
//         pipeline {
//           name
//           experimentName
//           kind
//           priority
//           startTime
//           types
//           lastRunResult {
//             timestamp
//             status
//             timeTook
//           }
//           flowInputMetadata {
//             storageInfo {
//               size
//               path
//             }
//             metadata {
//               values
//             }
//           }
//           triggers {
//             cron {
//               enabled
//               pattern
//             }
//           }
//           options {
//             debug
//             pending
//             batchTolerance
//             progressVerbosityLevel
//             ttl
//             concurrentPipelines {
//               amount
//               rejectOnFailure
//             }
//           }
//           flowInput {
//             files {
//               link
//             }
//             data
//             mul
//           }
//           nodes {
//             nodeName
//             algorithmName
//             taskId
//             podName
//             status
//             startTime
//             endTime
//             batch
//             level
//             boards
//             output {
//               taskId
//               discovery {
//                 host
//                 port
//               }
//               metadata {
//                 values
//               }
//               storageInfo {
//                 path
//                 size
//               }
//             }
//             input {
//               path
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export default JOB_QUERY;
