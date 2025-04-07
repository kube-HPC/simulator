import { gql } from '@apollo/client';

const JOB_QUERY_GRAPH = gql`
  query JobsAggregatedGraph(
    $experimentName: String
    $pipelineName: String
    $algorithmName: String
    $pipelineStatus: String
    $user: String
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
        }
        pipeline {
          startTime
        }
      }
    }
  }
`;

export default JOB_QUERY_GRAPH;
