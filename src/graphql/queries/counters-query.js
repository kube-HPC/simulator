const { default: gql } = require('graphql-tag');

const COUNTERS_QUERY = gql`
  query instanceCounter(
    $experimentName: String
    $pipelineName: String
    $algorithmName: String
    $pipelineStatus: String
    $datesRange: Range
  ) {
    pipelines {
      pipelinesCount
    }
    algorithms {
      algorithmsCount
    }
    jobsAggregated(
      experimentName: $experimentName
      pipelineName: $pipelineName
      algorithmName: $algorithmName
      pipelineStatus: $pipelineStatus
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
