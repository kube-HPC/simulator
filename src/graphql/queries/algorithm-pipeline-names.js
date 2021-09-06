const { default: gql } = require('graphql-tag');

const ALGORITHM_AND_PIPELINE_NAMES = gql`
  query Query {
    algorithms {
      name
    }
    pipelines {
      name
    }
  }
`;

export default ALGORITHM_AND_PIPELINE_NAMES;
