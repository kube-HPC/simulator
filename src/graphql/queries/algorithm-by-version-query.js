const { default: gql } = require('graphql-tag');

const ALGORITHM_BY_VERSION_QUERY = gql`
  query AlgorithmsByVersion($name: String!, $version: String!) {
    algorithmsByVersion(name: $name, version: $version)
  }
`;

export default ALGORITHM_BY_VERSION_QUERY;
