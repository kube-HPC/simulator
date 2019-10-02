const addAlgorithmTemplate = {
  main: {
    type: 'Code',
    name: '',
    cpu: 1,
    gpu: 0,
    mem: '256Mi',
    minHotWorkers: 0,
    options: {
      debug: false
    },
    algorithmEnv: '',
    workerEnv: '',
    nodeSelector: ''
  },
  code: {
    env: undefined,
    entryPoint: '',
    version: ''
  },
  image: {
    algorithmImage: ''
  },
  gitRepository: {
    env: undefined,
    entryPoint: '',
    url: '',
    commit: {
      id: '',
      timestamp: '',
      message: ''
    },
    branchName: 'master',
    tag: '',
    token: '',
    gitKind: 'github'
  }
};

export default addAlgorithmTemplate;
