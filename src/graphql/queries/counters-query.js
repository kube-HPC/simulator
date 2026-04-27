import gql from 'graphql-tag';

const COUNTERS_QUERY = gql`
  query instanceCounter(
    $experimentName: String
    $pipelineName: String
    $algorithmName: String
    $pipelineStatus: String
    $user: String
    $tags: [String]
    $datesRange: Range
  ) {
    pipelines {
      pipelinesCount
    }
    algorithms {
      algorithmsCount
      list {
        unscheduledReason
      }
    }
    jobsAggregated(
      experimentName: $experimentName
      pipelineName: $pipelineName
      algorithmName: $algorithmName
      pipelineStatus: $pipelineStatus
      user: $user
      tags: $tags
      datesRange: $datesRange
    ) {
      jobsCount
    }
    queueCount {
      managed
      preferred
    }
    dataSources {
      dataSourcesCount
    }
    discovery {
      pipelineDriver {
        driverId
      }

      worker {
        workerId
      }
    }
  }
`;

export default COUNTERS_QUERY;
