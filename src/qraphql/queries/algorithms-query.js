import { gql } from '@apollo/client';

const ALGORITHMS_QUERY = gql`
  query Query {
    algorithms {
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
      buildStats {
        total
        pending
        creating
        active
        completed
        failed
        stopped
      }
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
          message
          timestamp
        }
      }
    }
  }
`;

export default ALGORITHMS_QUERY;
