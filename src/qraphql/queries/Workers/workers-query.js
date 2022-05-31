const { default: gql } = require('graphql-tag');

const WORKERS_ALL_QUERY = gql`
  query Worker {
    discovery {
      taskExecutor {
        actual {
          total
          stats {
            algorithmName
            count
            results
            status
            ready
          }
        }
      }

      worker {
        workerStatus
        isMaster
        workerStartingTime
        jobCurrentTime
        workerPaused
        hotWorker
        error
        workerId
        algorithmName
        podName
        streamingDiscovery {
          host
          port
        }
      }
    }
  }
`;

export default WORKERS_ALL_QUERY;
