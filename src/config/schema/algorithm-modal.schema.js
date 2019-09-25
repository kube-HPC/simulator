export default {
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
        field: 'branch',
        label: 'Branch',
        placeholder: 'Enter Branch'
      },
      COMMIT: {
        field: 'commit',
        ID: {
          field: 'id',
          label: 'ID',
          placeholder: 'Enter Commit ID'
        },
        label: 'Commit Details',
        MESSAGE: {
          field: 'message',
          label: 'Message',
          placeholder: 'Enter Commit Message'
        },
        TIMESTAMP: {
          field: 'timestamp',
          label: 'Time Stamp',
          placeholder: 'Enter Commit Time Stamp'
        }
      },
      field: 'gitRepository',
      GIT_KIND: {
        field: 'gitKind',
        label: 'Git Kind',
        placeholder: 'Enter Git Kind'
      },
      label: 'Git',
      TAG: {
        field: 'tag',
        label: 'Tag',
        placeholder: 'Enter Tag'
      },
      TOKEN: {
        field: 'token',
        label: 'Token',
        placeholder: 'Enter Token'
      },
      URL: {
        field: 'url',
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
    memoryTypes: ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']
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
