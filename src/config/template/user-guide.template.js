export const dataCountMock = {
  algorithmsCount: 25,
  buildsCount: 4,
  debugCount: 15,
  driversCount: 2,
  jobsCount: 3,
  pipelinesCount: 42,
  workersCount: 6,
};

export const jobsTableMock = [
  {
    key: 'evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
    status: {
      timestamp: '2019-12-12T13:16:43.230Z',
      jobId: 'evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
      status: 'failed',
      level: 'error',
      pipeline: 'evalerror',
      data: {
        progress: 40,
        details: '40% completed, 1 creating, 1 failed, 2 active, 1 succeed',
        states: {
          creating: 1,
          failed: 1,
          active: 2,
          succeed: 1,
        },
      },
      error:
        '1/5 (20%) failed tasks, batch tolerance is 0%, error: Error: failed to eval code: eval error, dont know what to do',
      nodeName: 'nodeerror',
    },
    results: {
      timestamp: '2019-12-12T13:16:47.509Z',
      jobId: 'evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
      pipeline: 'evalerror',
      data: null,
      status: 'failed',
      error:
        '1/5 (20%) failed tasks, batch tolerance is 0%, error: Error: failed to eval code: eval error, dont know what to do',
      nodeName: 'nodeerror',
      timeTook: 4.418,
    },
    pipeline: {
      jobId: 'evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
      name: 'evalerror',
      nodes: [
        {
          nodeName: 'nodeerror',
          algorithmName: 'eval-alg',
          input: ['#@flowInput.nums'],
          extraData: {
            code: [
              '(input,require) => {',
              'if (input[0]>10){',
              "throw new Error ('eval error, dont know what to do');}",
              'else{',
              'return 100}}',
            ],
          },
        },
      ],
      options: {
        ttl: 3600,
        batchTolerance: 0,
        progressVerbosityLevel: 'debug',
      },
      priority: 3,
      flowInputMetadata: {
        metadata: {
          'flowInput.nums': {
            type: 'array',
            size: 5,
          },
        },
        storageInfo: {
          path:
            'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
        },
      },
      flowInput: {
        nums: [1, 24, 3, 4, 5],
      },
      startTime: 1576156603091,
      lastRunResult: {
        timestamp: '2019-12-12T13:16:25.310Z',
        status: 'completed',
        timeTook: 7.48,
      },
    },
    graph: {
      jobId: 'evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
      timestamp: 1576156609301,
      edges: [],
      nodes: [
        {
          nodeName: 'nodeerror',
          algorithmName: 'eval-alg',
          batch: [
            {
              taskId: 'nodeerror:eval-alg:0cbe1986-0b59-4c34-952a-1fa43566209f',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
                },
              ],
              podName: 'eval-alg-29e989e5-051e-4682-89de-5927e58ad7ad-gfhzk',
              status: 'failed',
              error:
                'Error: failed to eval code: eval error, dont know what to do',
              prevErrors: [],
              batchIndex: 2,
              startTime: 1576156607394,
              endTime: 1576156607451,
            },
            {
              taskId: 'nodeerror:eval-alg:1c7ab376-5c93-4c98-8028-12573414443d',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
                },
              ],
              status: 'creating',
              prevErrors: [],
              batchIndex: 1,
            },
            {
              taskId: 'nodeerror:eval-alg:56e63bf4-f76e-4ad9-a2b9-4fdbea9b570f',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
                },
              ],
              podName: 'eval-alg-6b8bb76c-008b-4cd3-8dfc-c4b0dbe511ac-km4mr',
              status: 'active',
              prevErrors: [],
              batchIndex: 3,
              startTime: 1576156607394,
            },
            {
              taskId: 'nodeerror:eval-alg:c7d1ede2-4c64-4bec-ab67-908d4d0a82e0',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
                },
              ],
              podName: 'eval-alg-5ebaf7ad-761e-4ae6-9f37-67c3dd2fb46e-hgd6p',
              status: 'active',
              prevErrors: [],
              batchIndex: 4,
              startTime: 1576156607395,
            },
            {
              taskId: 'nodeerror:eval-alg:dc2dc25a-b90b-4ca8-95b2-c0f96730fa63',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d',
                },
              ],
              output: {
                metadata: {},
                storageInfo: {
                  path:
                    'pub-hkube/evalerror:d6bca9ba-dc02-4ed7-b8e1-26387b888a3d/nodeerror:eval-alg:dc2dc25a-b90b-4ca8-95b2-c0f96730fa63',
                },
              },
              podName: 'eval-alg-1bdeb10c-8f9c-458e-a697-d2985f024ee8-jnw89',
              status: 'succeed',
              prevErrors: [],
              batchIndex: 5,
              startTime: 1576156606636,
              endTime: 1576156607445,
            },
          ],
          batchInfo: {
            idle: 1,
            completed: 2,
            errors: 1,
            running: 2,
            total: 5,
          },
        },
      ],
    },
  },
  {
    key: 'evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
    status: {
      timestamp: '2019-12-12T13:16:43.109Z',
      jobId: 'evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
      status: 'stopped',
      level: 'info',
      pipeline: 'evalerror',
      data: {
        progress: 80,
        details: '80% completed, 3 succeed, 1 failed, 1 active',
        states: {
          succeed: 3,
          failed: 1,
          active: 1,
        },
      },
      error:
        '1/5 (20%) failed tasks, batch tolerance is 0%, error: Error: failed to eval code: eval error, dont know what to do',
      nodeName: 'nodeerror',
      reason: 'requested by user',
    },
    results: {
      timestamp: '2019-12-12T13:16:48.962Z',
      jobId: 'evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
      pipeline: 'evalerror',
      data: null,
      status: 'completed',
      reason: 'requested by user',
      timeTook: 6.066,
    },
    pipeline: {
      jobId: 'evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
      name: 'evalerror',
      nodes: [
        {
          nodeName: 'nodeerror',
          algorithmName: 'eval-alg',
          input: ['#@flowInput.nums'],
          extraData: {
            code: [
              '(input,require) => {',
              'if (input[0]>10){',
              "throw new Error ('eval error, dont know what to do');}",
              'else{',
              'return 100}}',
            ],
          },
        },
      ],
      options: {
        ttl: 3600,
        batchTolerance: 0,
        progressVerbosityLevel: 'debug',
      },
      priority: 3,
      flowInputMetadata: {
        metadata: {
          'flowInput.nums': {
            type: 'array',
            size: 5,
          },
        },
        storageInfo: {
          path:
            'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
        },
      },
      flowInput: {
        nums: [1, 24, 3, 4, 5],
      },
      startTime: 1576156602896,
      lastRunResult: {
        timestamp: '2019-12-12T13:16:25.310Z',
        status: 'completed',
        timeTook: 7.48,
      },
    },
    graph: {
      jobId: 'evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
      timestamp: 1576156607697,
      edges: [],
      nodes: [
        {
          nodeName: 'nodeerror',
          algorithmName: 'eval-alg',
          batch: [
            {
              taskId: 'nodeerror:eval-alg:95e75754-e3ce-4bf9-8c8c-07b45576632b',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
                },
              ],
              podName: 'eval-alg-6c53d56e-5624-4944-8405-cf778e6daff2-49pbs',
              status: 'failed',
              error:
                'Error: failed to eval code: eval error, dont know what to do',
              prevErrors: [],
              batchIndex: 2,
              startTime: 1576156605654,
              endTime: 1576156605753,
            },
            {
              taskId: 'nodeerror:eval-alg:0a1661d3-8932-4ea2-835b-17c60ab3719d',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
                },
              ],
              output: {
                metadata: {},
                storageInfo: {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/nodeerror:eval-alg:0a1661d3-8932-4ea2-835b-17c60ab3719d',
                },
              },
              podName: 'eval-alg-c7d19c20-bdc4-42f9-931e-e69cc041731d-sckj4',
              status: 'succeed',
              prevErrors: [],
              batchIndex: 1,
              startTime: 1576156605337,
              endTime: 1576156605689,
            },
            {
              taskId: 'nodeerror:eval-alg:3400c858-ddac-4e74-99f4-bfd1096e00bf',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
                },
              ],
              output: {
                metadata: {},
                storageInfo: {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/nodeerror:eval-alg:3400c858-ddac-4e74-99f4-bfd1096e00bf',
                },
              },
              podName: 'eval-alg-80945c88-123a-4d4a-8ebb-a551749d73ee-r57vg',
              status: 'succeed',
              prevErrors: [],
              batchIndex: 3,
              startTime: 1576156605226,
              endTime: 1576156605316,
            },
            {
              taskId: 'nodeerror:eval-alg:402e18c1-596a-4719-a1eb-b786c9a07488',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
                },
              ],
              podName: 'eval-alg-873e98e7-b7df-4931-a1f7-088acf46bf37-66c99',
              status: 'active',
              prevErrors: [],
              batchIndex: 4,
              startTime: 1576156605654,
            },
            {
              taskId: 'nodeerror:eval-alg:85374527-c7c6-4270-82bb-06c8771c301b',
              input: [
                {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/evalerror:4396e0ac-eff6-4657-8980-8977159a1093',
                },
              ],
              output: {
                metadata: {},
                storageInfo: {
                  path:
                    'pub-hkube/evalerror:4396e0ac-eff6-4657-8980-8977159a1093/nodeerror:eval-alg:85374527-c7c6-4270-82bb-06c8771c301b',
                },
              },
              podName: 'eval-alg-e44e515c-de60-4b49-9525-8b8d82563d4f-k5rll',
              status: 'succeed',
              prevErrors: [],
              batchIndex: 5,
              startTime: 1576156605212,
              endTime: 1576156605271,
            },
          ],
          batchInfo: {
            idle: 0,
            completed: 4,
            errors: 1,
            running: 1,
            total: 5,
          },
        },
      ],
    },
  },
];
