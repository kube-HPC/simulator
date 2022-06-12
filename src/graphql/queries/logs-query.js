const { default: gql } = require('graphql-tag');

const LOGS_QUERY = gql`
  query LogsByQuery(
    $podName: String!
    $taskId: String!
    $source: String
    $nodeKind: String
    $logMode: String
  ) {
    logsByQuery(
      podName: $podName
      taskId: $taskId
      source: $source
      nodeKind: $nodeKind
      logMode: $logMode
    ) {
      level
      timestamp
      message
    }
  }
`;

export default LOGS_QUERY;
