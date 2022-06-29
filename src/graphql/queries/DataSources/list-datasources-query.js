const { default: gql } = require('graphql-tag');

const DATASOURCES_LIST_QUERY = gql`
  query DataSources {
    dataSources {
      versionDescription
      name
      filesCount
      avgFileSize
      totalSize
      id
      fileTypes
    }
  }
`;

export default DATASOURCES_LIST_QUERY;
