import gql from 'graphql-tag';

const WORKERS_ALL_QUERY = gql`
  query Worker {
    discovery {
      taskExecutor {
        actual {
          total
          stats {
            algorithmName
            count
            #results
            status
            exit
            init
            ready
            working
            hot
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
        jobId
      }
    }
  }
`;

export default WORKERS_ALL_QUERY;
