export const memoryTypes = [
  'Ki',
  'M',
  'Mi',
  'Gi',
  'm',
  'K',
  'G',
  'T',
  'Ti',
  'P',
  'Pi',
  'E',
  'Ei',
];

const addAlgorithmSchema = {
  ENV_TYPES: {
    nodejs: 'Node.js',
    python: 'Python',
    java: 'Java',
  },
  BUILD_TYPES: {
    CODE: {
      DIVIDERS: {
        BUILD: `Build Configuration`,
      },
      DRAGGER: {
        field: 'code.dragger',
      },
      ENTRY_POINT: {
        field: 'code.entryPoint',
        label: 'Entry Point',
        placeholder: 'Insert Entry Point',
        message: 'Entry Point is required',
      },
      ENVIRONMENT: {
        field: 'code.env',
        placeholder: 'Pick Environment',
        label: 'Environment',
        message: 'Environment is required',
      },
      label: 'Code',
      field: 'code',
      BASE_IMAGE: {
        field: 'code.baseImage',
        label: 'Base Image',
        placeholder: '(Optional) Docker Image Name',
      },
    },
    GIT: {
      DIVIDERS: {
        BUILD: `Build Configuration`,
        GIT: `Git Configuration`,
        ADVANCED: `Git Advance Configuration`,
      },
      BASE_IMAGE: {
        field: 'gitRepository.baseImage',
        label: 'Base Image',
        placeholder: '(Optional) Docker Image Name',
      },
      BRANCH: {
        field: 'gitRepository.branchName',
        label: 'Branch',
        placeholder: '(Optional) Branch',
      },
      COMMIT: {
        field: 'gitRepository.commit',
        ID: {
          field: 'gitRepository.commit.id',
          label: 'Commit ID',
          placeholder: '(Optional) Commit ID',
        },
        label: 'Commit Details',
        MESSAGE: {
          field: 'gitRepository.commit.message',
          label: 'Message',
          placeholder: '(Optional) Enter Commit Message',
        },
        TIMESTAMP: {
          field: 'gitRepository.commit.timestamp',
          label: 'Time Stamp',
          placeholder: '(Optional) Enter Commit Time Stamp',
        },
      },
      field: 'gitRepository',
      GIT_KIND: {
        field: 'gitRepository.gitKind',
        label: 'Git Host',
        placeholder: '(Optional) Git Host',
        types: ['github', 'gitlab'],
      },
      label: 'Git',
      TAG: {
        field: 'gitRepository.tag',
        label: 'Tag',
        placeholder: '(Optional) Tag',
      },
      TOKEN: {
        field: 'gitRepository.token',
        label: 'Token',
        placeholder: '(Optional) Token',
      },
      URL: {
        field: 'gitRepository.url',
        label: 'URL',
        addOns: {
          before: ['https://', 'http://'],
          after: '.git',
        },
        placeholder: 'Enter Git Repository URL',
        message: 'GIT URL required',
      },
      ENTRY_POINT: {
        field: 'gitRepository.entryPoint',
        label: 'Entry Point',
        placeholder: 'Insert Entry Point',
        message: 'Entry Point is required',
      },
      ENVIRONMENT: {
        field: 'gitRepository.env',
        placeholder: 'Pick Environment',
        label: 'Environment',
        message: 'Environment is required',
      },
    },
    IMAGE: {
      ALGORITHM_IMAGE: {
        field: 'image.algorithmImage',
        label: 'Algorithm Image',
        placeholder: 'Insert URL',
        message: 'Image URL required',
      },
      label: 'Image',
      field: 'image',
    },
  },
  MAIN: {
    field: 'main',
    CPU: {
      field: 'main.cpu',
      label: 'CPU Usage',
    },
    DIVIDER: {
      ADVANCED: 'Advanced',
      RESOURCES: 'Resources',
    },
    GPU: {
      field: 'main.gpu',
      label: 'GPU Usage',
    },
    MEMORY: {
      field: 'main.mem',
      label: 'Memory Usage',
      types: memoryTypes,
    },
    NAME: {
      field: 'main.name',
      label: 'Algorithm Name',
      placeholder: 'Insert Algorithm Name',
      message:
        'Lower cased letters and numbers are only allowed in Algorithm Name.',
    },
    DESCRIPTION: {
      field: 'main.description',
      label: 'Description',
      placeholder: 'Algorithm Description',
    },
    SIDECAR: {
      field: 'main.sideCar',
      label: 'Side Car',
    },
    OPTIONS: {
      field: 'main.options',
      label: 'Options',
      placeholder: '(Optional) Enable Options',
      types: ['binary', 'opengl'],
    },
    WORKERS: {
      field: 'main.minHotWorkers',
      label: 'Min Hot Workers',
    },
    RESERVE_MEMORY: {
      field: 'main.reservedMemory',
      label: 'Reserved Memory',
      types: memoryTypes,
      tooltip:
        "Reserved memory for HKube's operations, such as in-memory cache. Higher values speed up data retrieval but leave less memory for the algorithms. Lower values slow down data retrieval but leave more memory for the algorithms.",
    },
    WORKER_ENV: {
      field: 'main.workerEnv',
      label: 'Worker Env',
    },
    ALGORITEM_ENV: {
      field: 'main.algorithmEnv',
      label: 'Algorithm Env',
    },
  },
};
export default addAlgorithmSchema;
