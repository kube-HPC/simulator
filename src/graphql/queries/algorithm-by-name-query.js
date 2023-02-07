const { default: gql } = require('graphql-tag');

const ALGORITHM_BY_NAME_QUERY = gql`
  query AlgorithmsByName($name: String!) {
    algorithmsByName(name: $name)
  }
`;

export default ALGORITHM_BY_NAME_QUERY;
