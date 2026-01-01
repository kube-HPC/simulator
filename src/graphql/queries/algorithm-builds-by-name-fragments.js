import gql from 'graphql-tag';

export const ALGORITHM_BUILDS_FRAGMENTS = gql`
  query AlgorithmBuilds($algorithmName: String!) {
    algorithmBuilds(algorithmName: $algorithmName) {
      buildId
      imageTag
      env
      algorithmName
      type
      status
      progress
      error
      trace
      endTime
      startTime
      timestamp
      algorithmImage
      buildMode
      result {
        data
        warnings
        errors
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
      algorithm {
        name
        cpu
        gpu
        mem
        reservedMemory
        minHotWorkers
        env
        entryPoint
        type
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
      }
    }
  }
`;
export default ALGORITHM_BUILDS_FRAGMENTS;
