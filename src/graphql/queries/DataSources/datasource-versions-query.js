import gql from 'graphql-tag';

const DATASOURCE_VERSIONS_QUERY = gql`
  query DataSourceVersions($name: String!) {
    DataSourceVersions(name: $name) {
      versionDescription
      commitHash
      id
    }
  }
`;

export default DATASOURCE_VERSIONS_QUERY;
