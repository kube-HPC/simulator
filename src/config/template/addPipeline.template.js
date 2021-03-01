export default {
  name: '',
  description: '',
  nodes: [
    {
      kind: 'algorithm',
      nodeName: 'node-0',
      algorithmName: '',
      input: [],
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
    batchTolerance: 100,
    concurrentPipelines: {
      amount: 10,
      rejectOnFailure: true,
    },
    progressVerbosityLevel: 'info',
    ttl: 3600,
  },
  priority: 3,
};
