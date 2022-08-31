const { default: gql } = require('graphql-tag');

const PREFERRED_LIST_PIPELINE = gql`
  query AggregatedPipelinePrefered {
    aggregatedPipelinePrefered {
      name
      count
      lastJob
    }
  }
`;

export default PREFERRED_LIST_PIPELINE;
