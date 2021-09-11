const { default: gql } = require('graphql-tag');

const ALGORITHM_BY_ID_QUERY = gql`
  query Query($algorithmName: String!) {
    algorithmsByName(name: $algorithmName) {
      name
      cpu
      created
      entryPoint
      env
      gpu
      mem
      minHotWorkers
      modified
      reservedMemory
      type
      algorithmImage
      version
      options {
        debug
        pending
        batchTolerance
        progressVerbosityLevel
        ttl
        concurrentPipelines {
          amount
          rejectOnFailure
        }
      }
      gitRepository {
        gitKind
        url
        branchName
        webUrl
        cloneUrl
        commit {
          id
          timestamp
          message
        }
      }
    }
  }
`;

export default ALGORITHM_BY_ID_QUERY;
