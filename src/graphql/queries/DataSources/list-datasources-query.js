const { default: gql } = require('graphql-tag');

const DATASOURCES_LIST_QUERY = gql`
  query DataSources {
    dataSources {
      list {
        versionDescription
        name
        filesCount
        avgFileSize
        totalSize
        id
        fileTypes
      }
      dataSourcesCount
    }
  }
`;

export default DATASOURCES_LIST_QUERY;
