import { gql } from '@apollo/client';

const ALGORITHMS_QUERY = gql`
  query Algorithms {
    algorithms {
      list {
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
        errors
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
      algorithmsCount
    }
  }
`;

export default ALGORITHMS_QUERY;
