const addAlgorithmTemplate = {
  main: {
    name: '',
    cpu: 1,
    gpu: 0,
    mem: '256Mi',
    minHotWorkers: 0,
    options: {
      debug: false
    }
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
