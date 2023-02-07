const { default: gql } = require('graphql-tag');

const ALGORITHM_AND_PIPELINE_NAMES = gql`
  query List {
    algorithms {
      list {
        name
      }
    }
    pipelines {
      list
    }
  }
`;

export default ALGORITHM_AND_PIPELINE_NAMES;
