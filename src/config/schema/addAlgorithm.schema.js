const addAlgorithmSchema = {
  ENV_TYPES: {
    nodejs: 'Node.js',
    python: 'Python'
  },
  BUILD_TYPES: {
    CODE: {
      DRAGGER: {
        field: 'code.dragger'
      },
      ENTRY_POINT: {
        field: 'code.entryPoint',
        label: 'Entry Point',
        placeholder: 'Insert Entry Point',
        message: 'Entry Point is required'
      },
      ENVIRONMENT: {
        field: 'code.env',
        placeholder: 'Pick Environment',
        label: 'Environment',
        message: 'Environment is required'
      },
      label: 'Code',
      field: 'code',
      VERSION: {
        field: 'code.version',
        label: 'Version',
        placeholder: 'Insert Version'
      }
    },
    GIT: {
      BRANCH: {
        field: 'gitRepository.branchName',
        label: 'Branch',
        placeholder: 'Enter Branch'
      },
      COMMIT: {
        field: 'gitRepository.commit',
        ID: {
          field: 'id',
          label: 'Commit ID',
          placeholder: 'Enter Commit ID'
        },
        label: 'Commit Details',
        MESSAGE: {
          field: 'gitRepository.message',
          label: 'Message',
          placeholder: 'Enter Commit Message'
        },
        TIMESTAMP: {
          field: 'gitRepository.timestamp',
          label: 'Time Stamp',
          placeholder: 'Enter Commit Time Stamp'
        }
      },
      field: 'gitRepository',
      GIT_KIND: {
        field: 'gitRepository.gitKind',
        label: 'Git Host',
        placeholder: 'Pick Git Host',
        types: ['github', 'gitlab']
      },
      label: 'Git',
      TAG: {
        field: 'gitRepository.tag',
        label: 'Tag',
        placeholder: 'Enter Tag'
      },
      TOKEN: {
        field: 'gitRepository.token',
        label: 'Token',
        placeholder: 'Enter Token'
      },
      URL: {
        field: 'gitRepository.url',
        label: 'URL',
        addOns: {
          before: ['https://', 'http://'],
          after: '.git'
        },
        placeholder: 'Enter Git Repository URL',
        message: 'GIT URL required'
      },
      ENTRY_POINT: {
        field: 'gitRepository.entryPoint',
        label: 'Entry Point',
        placeholder: 'Insert Entry Point',
        message: 'Entry Point is required'
      },
      ENVIRONMENT: {
        field: 'gitRepository.env',
        placeholder: 'Pick Environment',
        label: 'Environment',
        message: 'Environment is required'
      }
    },
    IMAGE: {
      ALGORITHM_IMAGE: {
        field: 'image.algorithmImage',
        label: 'Algorithm Image',
        placeholder: 'Insert URL',
        message: 'Image URL required'
      },
      label: 'Image',
      field: 'image'
    }
  },
  MAIN: {
    field: 'main',
    CPU: {
      field: 'main.cpu',
      label: 'CPU Usage'
    },
    DIVIDER: {
      ADVANCED: 'Advanced',
      RESOURCES: 'Resources'
    },
    GPU: {
      field: 'main.gpu',
      label: 'GPU Usage'
    },
    MEMORY: {
      field: 'main.mem',
      label: 'Memory Usage',
      types: ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']
    },
    NAME: {
      field: 'main.name',
      label: 'Algorithm Name',
      placeholder: 'Insert Algorithm Name',
      message: 'Lower cased letters and numbers are only allowed in Algorithm Name.'
    },
    OPTIONS: {
      field: 'main.options',
      label: 'Options',
      placeholder: 'Enable Options',
      types: ['debug']
    },
    WORKERS: {
      field: 'main.minHotWorkers',
      label: 'Min Hot Workers'
    }
  }
};

export default addAlgorithmSchema;
