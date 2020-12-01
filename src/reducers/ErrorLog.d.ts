export type ErrorLog = {
  hostName: string;
  id: string;
  level: 'error';
  message: string;
  podName: string;
  serviceName: string;
  timestamp: number;
  type:
    | 'algorithm-queue'
    | 'worker'
    | 'resource-manager'
    | 'pipeline-driver'
    | 'caching-service'
    | 'trigger-service'
    | 'pipeline-driver-queue'
    | 'task-executor'
    | 'task-executor';
  uptime: number;
};
