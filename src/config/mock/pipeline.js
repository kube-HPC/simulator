const pipelineMock = {
  pipeline: {
    jobId: 'simple:cbae0fc5-364f-4863-b786-35f0fd21eb07',
    name: 'simple',
    nodes: [
      {
        nodeName: 'green',
        algorithmName: 'green-alg',
        input: ['@flowInput.files.link'],
      },
      {
        nodeName: 'yellow',
        algorithmName: 'yellow-alg',
        input: ['@green'],
      },
      {
        nodeName: 'black',
        algorithmName: 'black-alg',
        input: ['@yellow'],
      },
    ],
    flowInputMetadata: {
      metadata: {
        'flowInput.files.link': {
          type: 'string',
        },
      },
      storageInfo: {
        path:
          'pub-hkube/simple:cbae0fc5-364f-4863-b786-35f0fd21eb07/simple:cbae0fc5-364f-4863-b786-35f0fd21eb07',
      },
    },
    options: {
      batchTolerance: 100,
      progressVerbosityLevel: 'debug',
      ttl: 3600,
    },
    priority: 3,
    flowInput: {
      files: {
        link: 'links-1',
      },
    },
    startTime: 1574250933653,
    lastRunResult: {
      timestamp: '2019-11-19T09:31:58.919Z',
      status: 'completed',
      timeTook: 0.616,
    },
  },
  status: {
    timestamp: '2019-11-20T11:55:44.848Z',
    jobId: 'simple:cbae0fc5-364f-4863-b786-35f0fd21eb07',
    pipeline: 'simple',
    status: 'completed',
    level: 'info',
    data: {
      progress: 100,
      details: '100% completed, 3 succeed',
      states: {
        succeed: 3,
      },
    },
  },
  results: {
    timestamp: '2019-11-20T11:56:29.567Z',
    jobId: 'simple:cbae0fc5-364f-4863-b786-35f0fd21eb07',
    pipeline: 'simple',
    data: {
      storageInfo: {
        path: 'pub-hkube-results/simple:cbae0fc5-364f-4863-b786-35f0fd21eb07/result.json',
      },
    },
    status: 'completed',
    timeTook: 55.914,
  },
};

export default pipelineMock;
