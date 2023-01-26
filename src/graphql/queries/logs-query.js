const { default: gql } = require('graphql-tag');

const LOGS_QUERY = gql`
  query LogsByQuery(
    $podName: String!
    $taskId: String!
    $source: String
    $nodeKind: String
    $logMode: String
    $searchWord: String
  ) {
    logsByQuery(
      podName: $podName
      taskId: $taskId
      source: $source
      nodeKind: $nodeKind
      logMode: $logMode
      searchWord: $searchWord
    ) {
      logs {
        level
        timestamp
        message
      }
      podStatus
    }
  }
`;

export default LOGS_QUERY;
