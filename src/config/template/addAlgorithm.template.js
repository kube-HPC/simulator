const addAlgorithmTemplate = {
  name: '',
  cpu: 1,
  gpu: 0,
  mem: '256Mi',
  minHotWorkers: 0,
  options: {
    debug: false
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
