export default {
  DIVIDER: {
    ADVANCED: 'Advanced',
    RESOURCES: 'Resources'
  },
  NAME: {
    label: 'Algorithm Name',
    field: 'name'
  },
  CPU: {
    label: 'CPU Usage',
    field: 'cpu'
  },
  GPU: {
    label: 'GPU Usage',
    field: 'gpu'
  },
  MEMORY: {
    label: 'Memory Usage',
    field: 'mem',
    memoryTypes: ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']
  },
  WORKERS: {
    label: 'Min Hot Workers',
    field: 'minHotWorkers'
  },
  BUILD_TYPES: {
    CODE: {
      label: 'Code',
      ENVIRONMENT: {
        label: 'Environment',
        field: 'env',
        types: {
          python: 'Python',
          nodejs: 'Node.js'
        }
      },
      ENTRY_POINT: {
        label: 'Entry Point',
        field: 'entryPoint'
      },
      DRAGGER: {
        field: 'dragger'
      },
      VERSION: {
        label: 'Version',
        field: 'version'
      }
    },
    IMAGE: {
      label: 'Image',
      ALGORITHM_IMAGE: {
        label: 'Algorithm Image',
        field: 'algorithmImage'
      }
    },
    GIT: {
      label: 'Git',
      field: 'gitRepository',
      REPOSITORY: {
        label: 'Repository',
        field: 'repository',
        placeholder: 'Enter Git Repository URL'
      },
      BRANCH: {
        label: 'Branch',
        field: 'branch',
        placeholder: 'Enter Branch'
      },
      TOKEN: {
        label: 'Token',
        field: 'token',
        placeholder: 'Enter Token'
      },
      TAG: {
        label: 'Tag',
        field: 'tag',
        placeholder: 'Enter Tag'
      },
      GIT_KIND: {
        label: 'Git Kind',
        field: 'gitKind',
        placeholder: 'Enter Git Kind'
      }
    }
  },
  OPTIONS: {
    label: 'Options',
    field: 'options',
    types: ['debug']
  }
};
