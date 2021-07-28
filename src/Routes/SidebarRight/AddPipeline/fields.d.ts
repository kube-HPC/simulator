export type Node = {
  nodeName: string;
  kind: 'dataSource' | 'algorithm' | 'gateway';
};

export type DataSourceNode = Node & {
  dataSource: {
    id: string;
    name: string;
    snapshotName: string;
  };
};

export type AlgorithmNode = Node & {
  algorithmName: string;
  pipelineName: string;
  input: [any];
  ttl: number;
  includeInResult: boolean;
  metrics: {
    tensorboard: true;
  };
  retry: {
    policy: 'Never' | 'Always' | 'OnError' | 'OnCrash';
    limit: number;
  };
  batchOperation: 'indexed' | 'cartesian';
  stateType: 'stateless' | 'stateful';
};

export type PipelineDescriptor = {
  init: {
    name: string;
    flowInput: {};
    description: string;
    kind: 'batch' | 'stream';
    experimentName: string;
  };
  nodes: (DataSourceNode | AlgorithmNode)[];
  options: {
    webhooks: {
      progress: string;
      result: string;
    };
    priority: number;
    triggers: {
      pipelines: [string];
      cron: {
        pattern: string;
        enabled: boolean;
      };
    };
    tags: [string];
    rootJobId: string;
    // only if kind streaming
    streaming: {
      defaultFlow: string;
      flows: {
        main: string;
        second: string;
      };
    };
  };
};
