const { default: gql } = require('graphql-tag');

const DATASOURCE_PREVIEW_QUERY = gql`
  query DataSourcePreviewQuery(
    $dataSourcePreviewQueryId: String!
    $query: String!
  ) {
    DataSourcePreviewQuery(id: $dataSourcePreviewQueryId, query: $query) {
      path
      id
      name
      size
      type
      meta
      uploadedAt
    }
  }
`;

export default DATASOURCE_PREVIEW_QUERY;
