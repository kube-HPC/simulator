import gql from 'graphql-tag';

const DATASOURCE_BY_ID_QUERY = gql`
  query DataSource($dataSourceId: String!, $name: String!) {
    dataSource(id: $dataSourceId, name: $name) {
      name
      versionDescription
      commitHash
      isPartial
      id
      path
      files {
        path
        id
        name
        size
        type
        meta
        uploadedAt
        link
      }
      storage {
        kind
      }
      git {
        kind
        repositoryUrl
      }
    }
  }
`;

export default DATASOURCE_BY_ID_QUERY;
