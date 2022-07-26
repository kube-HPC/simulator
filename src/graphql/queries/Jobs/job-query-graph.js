import { gql } from '@apollo/client';

const JOB_QUERY_GRAPH = gql`
  query JobsAggregatedGraph(
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
      cursor
      jobsCount
      jobs {
        key
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
