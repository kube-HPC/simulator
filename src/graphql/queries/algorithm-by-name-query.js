const { default: gql } = require('graphql-tag');

const ALGORITHM_BY_NAME_QUERY = gql`
  query AlgorithmsByName($name: String!) {
    algorithmsByName(name: $name) {
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
      debugUrl
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
      buildStats {
        total
        pending
        creating
        active
        completed
        failed
        stopped
      }
    }
  }
`;

export default ALGORITHM_BY_NAME_QUERY;
