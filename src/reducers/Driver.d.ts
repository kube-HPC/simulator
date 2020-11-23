export type Driver = {
  driverId: string;
  driverStatus: 'ready';
  jobId: string;
  jobStatus: 'completed' | 'ready';
  paused: boolean;
  pipelineName: string;
  podName: string;
};
