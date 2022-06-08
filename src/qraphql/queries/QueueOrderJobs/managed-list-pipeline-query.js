const { default: gql } = require('graphql-tag');

const MANAGED_LIST_PIPELINE = gql`
  query AggregatedPipelineManaged {
    aggregatedPipelineManaged {
      name
      count
    }
  }
`;

export default MANAGED_LIST_PIPELINE;
