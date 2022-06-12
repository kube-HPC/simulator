import { gql } from '@apollo/client';

const DISCOVERY_QUERY = gql`
  query Query {
    discovery {
      pipelineDriver {
        driverId
        paused
        driverStatus
        jobStatus
        podName
      }
      taskExecutor {
        nodes {
          workers {
            total
            stats
          }
          name
          workers2
          labels {
            failuredomainbetakubernetesiozone
            betakubernetesioos
            betakubernetesioinstancetype
            betaubernetesioarch
            kopsk8sioinstancegroup
            kubernetesiohostname
            kubernetesiorole
            noderolekubernetesionode
            nodekubernetesioinstancetype
          }
          other {
            cpu
            gpu
            mem
          }
          requests {
            gpu
            cpu
            mem
          }
        }
        resourcePressure {
          cpu
          gpu
          mem
        }
        actual {
          total
          stats {
            algorithmName
            count
            results
            status
          }
        }
      }
      worker {
        workerStatus
        workerStartingTime
        isMaster
        jobCurrentTime
        workerPaused
        hotWorker
        workerId
        algorithmName
        podName
        streamingDiscovery {
          host
          port
        }
        error
      }
      host
      port
    }
  }
`;

export default DISCOVERY_QUERY;
