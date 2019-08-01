export const dataCountMock = {
  algorithmsCount: 25,
  buildsCount: 4,
  debugCount: 15,
  driversCount: 2,
  jobsCount: 3,
  pipelinesCount: 42,
  workersCount: 6
};

export const jobsTableMock = [
  {
    key: 'bool:66998f79-545e-4e1f-985c-7453001a7be3.bool',
    status: {
      timestamp: '31/07/19, 17:21:31',
      jobId: 'bool:66998f79-545e-4e1f-985c-7453001a7be3.bool',
      pipeline: 'bool',
      data: {
        progress: 100,
        details: '100% completed, 1 succeed',
        states: {
          succeed: 1
        }
      },
      status: 'completed',
      level: 'info'
    },
    results: {
      timestamp: '2019-07-31T14:21:30.935Z',
      jobId: 'bool:66998f79-545e-4e1f-985c-7453001a7be3.bool',
      pipeline: 'bool',
      data: {
        storageInfo: {
          path:
            'pub-hkube-results/bool:66998f79-545e-4e1f-985c-7453001a7be3.bool/result.json'
        }
      },
      status: 'completed',
      timeTook: 1.371
    },
    pipeline: {
      jobId: 'bool:66998f79-545e-4e1f-985c-7453001a7be3.bool',
      name: 'bool',
      nodes: [
        {
          nodeName: 'trueFalse',
          algorithmName: 'eval-alg',
          input: ['@flowInput.inputs'],
          extraData: {
            code: [
              '(input,require)=> {',
              'const txt = input[0];',
              'return txt;}'
            ]
          }
        }
      ],
      options: {
        ttl: 3600,
        batchTolerance: 60,
        progressVerbosityLevel: 'debug'
      },
      priority: 3,
      flowInput: {
        metadata: {
          'flowInput.inputs': {
            type: 'object'
          }
        },
        storageInfo: {
          path:
            'pub-hkube/bool:66998f79-545e-4e1f-985c-7453001a7be3.bool/bool:66998f79-545e-4e1f-985c-7453001a7be3.bool'
        }
      },
      flowInputOrig: {
        inputs: {
          name: 'hkube',
          type: 'type1',
          prop: ['prop1', 'prop2', 'prop3', 4, 7, 89.022, -987]
        }
      },
      startTime: 1564582889550,
      lastRunResult: {
        timestamp: '2019-07-31T14:21:20.914Z',
        status: 'completed',
        timeTook: 0.718
      }
    },
    graph: {
      edges: [],
      nodes: [
        {
          taskId: 'trueFalse:eval-alg:ec31b1f9-317f-47ae-95d9-0928eec7cc13',
          input: [
            {
              path:
                'pub-hkube/bool:66998f79-545e-4e1f-985c-7453001a7be3.bool/bool:66998f79-545e-4e1f-985c-7453001a7be3.bool'
            }
          ],
          output: {
            metadata: {},
            storageInfo: {
              path:
                'pub-hkube/bool:66998f79-545e-4e1f-985c-7453001a7be3.bool/trueFalse:eval-alg:ec31b1f9-317f-47ae-95d9-0928eec7cc13'
            }
          },
          status: 'succeed',
          prevErrors: [],
          nodeName: 'trueFalse',
          algorithmName: 'eval-alg',
          startTime: 1564582890794,
          endTime: 1564582890864,
          group: 'completed',
          batchTasks: null
        }
      ]
    }
  },
  {
    key: 'evalerror:3f0b61c2-a06f-422e-a8c2-02dc359fb201.evalerror',
    status: {
      timestamp: '31/07/19, 17:17:57',
      jobId: 'evalerror:3f0b61c2-a06f-422e-a8c2-02dc359fb201.evalerror',
      pipeline: 'evalerror',
      data: {
        progress: 40,
        details: '40% completed, 1 succeed, 1 failed, 3 creating',
        states: {
          succeed: 1,
          failed: 1,
          creating: 3
        }
      },
      status: 'failed',
      error:
        '1/5 (20%) failed tasks, batch tolerance is 0%, error: Error: failed to eval code: eval error, dont know what to do',
      level: 'error'
    },
    results: {
      timestamp: '2019-07-31T14:17:56.724Z',
      jobId: 'evalerror:3f0b61c2-a06f-422e-a8c2-02dc359fb201.evalerror',
      pipeline: 'evalerror',
      data: null,
      status: 'failed',
      error:
        '1/5 (20%) failed tasks, batch tolerance is 0%, error: Error: failed to eval code: eval error, dont know what to do',
      timeTook: 2.431
    },
    pipeline: {
      jobId: 'evalerror:3f0b61c2-a06f-422e-a8c2-02dc359fb201.evalerror',
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
              'return 100}}'
            ]
          }
        }
      ],
      options: {
        ttl: 3600,
        batchTolerance: 0,
        progressVerbosityLevel: 'debug'
      },
      priority: 3,
      flowInput: {
        metadata: {
          'flowInput.nums': {
            type: 'array',
            size: 5
          }
        },
        storageInfo: {
          path:
            'pub-hkube/evalerror:3f0b61c2-a06f-422e-a8c2-02dc359fb201.evalerror/evalerror:3f0b61c2-a06f-422e-a8c2-02dc359fb201.evalerror'
        }
      },
      flowInputOrig: {
        nums: [1, 24, 3, 4, 5]
      },
      startTime: 1564582674211,
      lastRunResult: {
        timestamp: '2019-07-31T14:17:38.256Z',
        status: 'completed',
        timeTook: 2.161
      }
    },
    graph: {
      edges: [],
      nodes: [
        {
          nodeName: 'nodeerror',
          algorithmName: 'eval-alg',
          extra: {
            batch: '2/5'
          },
          group: 'batchErrors',
          batchTasks: null
        }
      ]
    }
  },
  {
    key: 'simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple',
    status: {
      timestamp: '31/07/19, 17:12:47',
      jobId: 'simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple',
      pipeline: 'simple',
      data: {
        progress: 100,
        details: '100% completed, 3 succeed',
        states: {
          succeed: 3
        }
      },
      status: 'completed',
      level: 'info'
    },
    results: {
      timestamp: '2019-07-31T14:12:47.061Z',
      jobId: 'simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple',
      pipeline: 'simple',
      data: {
        storageInfo: {
          path:
            'pub-hkube-results/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/result.json'
        }
      },
      status: 'completed',
      timeTook: 100.985
    },
    pipeline: {
      jobId: 'simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple',
      name: 'simple',
      nodes: [
        {
          nodeName: 'green',
          algorithmName: 'green-alg',
          input: ['@flowInput.files.link']
        },
        {
          nodeName: 'yellow',
          algorithmName: 'yellow-alg',
          input: ['@green']
        },
        {
          nodeName: 'black',
          algorithmName: 'black-alg',
          input: ['@yellow']
        }
      ],
      flowInput: {
        metadata: {
          'flowInput.files.link': {
            type: 'string'
          }
        },
        storageInfo: {
          path:
            'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple'
        }
      },
      options: {
        batchTolerance: 100,
        progressVerbosityLevel: 'debug',
        ttl: 3600
      },
      webhooks: {
        progress: 'http://localhost:3003/webhook/progress',
        result: 'http://localhost:3003/webhook/result'
      },
      priority: 3,
      flowInputOrig: {
        files: {
          link: 'links-1'
        }
      },
      startTime: 1564582266069,
      lastRunResult: {
        timestamp: '2019-07-31T14:02:43.725Z',
        status: 'stopped',
        timeTook: 0.002
      }
    },
    graph: {
      edges: [
        {
          from: 'green',
          to: 'yellow',
          group: 'none'
        },
        {
          from: 'yellow',
          to: 'black',
          group: 'none'
        }
      ],
      nodes: [
        {
          taskId: 'green:green-alg:3490712a-6d0b-4cd0-9101-efb6ff052a7f',
          input: [
            {
              path:
                'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple'
            }
          ],
          output: {
            metadata: {
              green: {
                type: 'number'
              }
            },
            storageInfo: {
              path:
                'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/green:green-alg:3490712a-6d0b-4cd0-9101-efb6ff052a7f'
            }
          },
          status: 'succeed',
          prevErrors: [],
          nodeName: 'green',
          algorithmName: 'green-alg',
          startTime: 1564582288499,
          endTime: 1564582288707,
          group: 'completed',
          batchTasks: null
        },
        {
          taskId: 'yellow:yellow-alg:f9d4d30b-51ce-4589-9a4a-bbc30130c582',
          input: [
            {
              path:
                'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/green:green-alg:3490712a-6d0b-4cd0-9101-efb6ff052a7f'
            }
          ],
          output: {
            metadata: {
              yellow: {
                type: 'number'
              }
            },
            storageInfo: {
              path:
                'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/yellow:yellow-alg:f9d4d30b-51ce-4589-9a4a-bbc30130c582'
            }
          },
          status: 'succeed',
          prevErrors: [],
          nodeName: 'yellow',
          algorithmName: 'yellow-alg',
          startTime: 1564582327802,
          endTime: 1564582328007,
          group: 'completed',
          batchTasks: null
        },
        {
          taskId: 'black:black-alg:1e83fb5f-4542-48bd-97d0-b860186710fb',
          input: [
            {
              path:
                'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/yellow:yellow-alg:f9d4d30b-51ce-4589-9a4a-bbc30130c582'
            }
          ],
          output: {
            metadata: {},
            storageInfo: {
              path:
                'pub-hkube/simple:c503934b-96cd-4c97-a076-36132f3fc7ba.simple/black:black-alg:1e83fb5f-4542-48bd-97d0-b860186710fb'
            }
          },
          status: 'succeed',
          prevErrors: [],
          nodeName: 'black',
          algorithmName: 'black-alg',
          startTime: 1564582366891,
          endTime: 1564582366979,
          group: 'completed',
          batchTasks: null
        }
      ]
    }
  }
];
