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
      ENVIRONMENT: {
        label: 'Environment',
        field: 'environment',
        types: {
          python: 'Python',
          nodejs: 'Node.js',
          jvm: 'JVM'
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
      label: 'Algorithm Image',
      field: 'algorithmImage'
    },
    GIT: {
      REPOSITORY: {
        label: 'Repository',
        field: 'repository'
      },
      BRANCH: {
        label: 'Branch',
        field: 'branch'
      },
      TOKEN: {
        label: 'Token',
        field: 'token'
      }
    }
  },
  OPTIONS: {
    label: 'Options',
    field: 'options'
  }
};
