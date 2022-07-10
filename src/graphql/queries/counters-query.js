const { default: gql } = require('graphql-tag');

const COUNTERS_QUERY = gql`
  query instanceCounter($pipelineName: String) {
    pipelines {
      pipelinesCount
    }
    algorithms {
      algorithmsCount
    }
    jobsAggregated(pipelineName: $pipelineName) {
      jobsCount
    }
    queueCount {
      managed
      preferred
    }
  }
`;

export default COUNTERS_QUERY;
