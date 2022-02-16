const addAlgorithmTemplateForm = {
  main: {
    type: 'Code',
    name: '',
    cpu: 1,
    gpu: 0,
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
};

export default addAlgorithmTemplateForm;
