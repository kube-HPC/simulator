export type Job = {
  key: string;
  status: {
    timestamp: string;
    jobId: string;
    pipeline: string;
    status: 'pending';
    level: 'info';
  };
  pipeline: {
    name: string;
    nodes: {
      nodeName: string;
      algorithmName: string;
      input: string[];
    }[];
    flowInput?: {
      files: {
        link: string;
      };
    };
    webhooks?: {
      progress: string;
      result: string;
    };
    kind: 'batch';
    experimentName: string;
    options: {
      ttl: number;
      batchTolerance: number;
      progressVerbosityLevel: 'info';
    };
    priority?: number;
    jobId: string;
    dataSourceMetadata: null;
    startTime?: number;
    lastRunResult?: {};
    types: string[];
    flowInputMetadata?: {
      metadata: {
        [key: string]: {
          type: string;
        };
      };
      storageInfo: {
        path: string;
      };
    };
    lastRunResult?: {
      timestamp: string;
      status: 'completed';
      timeTook: number;
    };
    priority: number;
  };
  results?: {
    timestamp: string;
    jobId: string;
    data: { [res: string]: number }[];
    status: 'completed';
    timeTook: number;
  };
};
