const { default: gql } = require('graphql-tag');

const DATASOURCE_SNAPANSHOTS_QUERY = gql`
  query DataSourceSnapanshots($name: String!) {
    DataSourceSnapanshots(name: $name) {
      query
      name
      id
      droppedFiles {
        path
        id
        name
        size
        type
        meta
        uploadedAt
      }
      filteredFilesList {
        path
        id
        name
        size
        type
        meta
        uploadedAt
      }
      dataSource {
        id
        name
      }
    }
  }
`;

export default DATASOURCE_SNAPANSHOTS_QUERY;
