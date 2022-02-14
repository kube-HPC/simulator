export default {
  name: '',
  description: '',
  nodes: [
    {
      kind: 'algorithm',
      nodeName: '',
      algorithmName: '',
      input: [],
      retry: {
        policy: 'OnCrash',
        limit: 3,
      },
      ttl: 0,
      includeInResult: false,
      metrics: {
        tensorboard: true,
      },
    },
  ],
  flowInput: {},
  webhooks: {
    progress: '',
    result: '',
  },
  triggers: {
    cron: {
      pattern: '0 * * * *',
      enabled: false,
    },
    pipelines: [],
  },
  options: {
    batchTolerance: 80,
    concurrentPipelines: {
      amount: 10,
      rejectOnFailure: true,
    },
    progressVerbosityLevel: 'info',
    ttl: 3600,
    activeTtl: '',
  },
  priority: 3,
};
