const addAlgorithmTemplateForm = {
  main: {
    type: 'Code',
    resourceMode: 'gpu',
    name: '',
    cpu: 1,
    gpu: 0,
    kaiObject: {
      queue: '',
      allocationType: 'memory',
      memory: '256Mi',
      fraction: undefined,
    },
    mem: '256Mi',
    minHotWorkers: 0,
    options: [],
    algorithmEnv: '',
    workerEnv: '',
    nodeSelector: '',
    reservedMemory: '512Mi',
  },
  code: {
    env: undefined,
    entryPoint: '',
    version: '',
  },
  image: {
    algorithmImage: '',
  },
  gitRepository: {
    env: undefined,
    entryPoint: '',
    url: '',
    commit: {
      id: '',
      timestamp: '',
      message: '',
    },
    branchName: 'master',
    tag: '',
    token: '',
    gitKind: 'github',
  },
  sideCars: [],
};

export default addAlgorithmTemplateForm;
