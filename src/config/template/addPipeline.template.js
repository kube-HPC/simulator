export default {
  name: '',
  description: '',
  nodes: [
    {
      nodeName: '',
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
    concurrentPipelines: 10,
    progressVerbosityLevel: 'info',
    ttl: 3600,
  },
  priority: 3,
};
