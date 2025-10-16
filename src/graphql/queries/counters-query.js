const { default: gql } = require('graphql-tag');

const COUNTERS_QUERY = gql`
  query instanceCounter(
    $experimentName: String
    $pipelineName: String
    $algorithmName: String
    $pipelineStatus: String
    $user: String
    $tag: String
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
      tag: $tag
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
