const addAlgorithmSchema = {
  BUILD_TYPES: {
    CODE: {
      DRAGGER: {
        field: 'dragger'
      },
      ENTRY_POINT: {
        field: 'entryPoint',
        label: 'Entry Point'
      },
      ENVIRONMENT: {
        field: 'env',
        placeholder: 'Pick Environment',
        label: 'Environment',
        types: {
          nodejs: 'Node.js',
          python: 'Python'
        }
      },
      label: 'Code',
      VERSION: {
        field: 'version',
        label: 'Version'
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
        types: ['github', 'gitlab', 'none']
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
        placeholder: 'Enter Git Repository URL'
      }
    },
    IMAGE: {
      ALGORITHM_IMAGE: {
        field: 'algorithmImage',
        label: 'Algorithm Image'
      },
      label: 'Image'
    }
  },
  CPU: {
    field: 'cpu',
    label: 'CPU Usage'
  },
  DIVIDER: {
    ADVANCED: 'Advanced',
    RESOURCES: 'Resources'
  },
  GPU: {
    field: 'gpu',
    label: 'GPU Usage'
  },
  MEMORY: {
    field: 'mem',
    label: 'Memory Usage',
    types: ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']
  },
  NAME: {
    field: 'name',
    label: 'Algorithm Name'
  },
  OPTIONS: {
    field: 'options',
    label: 'Options',
    types: ['debug']
  },
  WORKERS: {
    field: 'minHotWorkers',
    label: 'Min Hot Workers'
  }
};

export default addAlgorithmSchema;
