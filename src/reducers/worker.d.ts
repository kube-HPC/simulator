export type workerEntry = {
  algorithmImage: string;
  algorithmName: string;
  algorithmVersion: string;
  error: null;
  hotWorker: boolean;
  isMaster: boolean;
  jobCurrentTime: string;
  jobData: {
    batchIndex: number;
    nodeName: string;
  };
  jobId: string;
  nodeName: string;
  pipelineName: string;
  podName: string;
  streamingDiscovery: {
    host: string;
    port: number;
  };
  taskId: string;
  workerId: string;
  workerImage: string;
  workerPaused: boolean;
  workerStartingTime: string;
  workerStatus: string;
};
