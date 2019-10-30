const addPipelineSchema = {
  ID: 'add-pipeline',
  INITIAL: {
    label: 'Initial',
    NAME: {
      label: 'Name',
      field: 'name',
      placeholder: 'Unique Identifier',
      required: true,
      message: 'Pipeline name is required'
    },
    DESCRIPTION: {
      label: 'Description',
      field: 'description',
      placeholder: 'Pipeline Description'
    },
    FLOW_INPUT: {
      label: 'Flow Input',
      field: 'flowInput'
    }
  },
  NODES: {
    field: 'nodes',
    label: 'Nodes',
    NAME: {
      label: 'Node Name',
      field: 'name',
      placeholder: 'Node Name',
      message: 'Node name is required',
      required: true
    },
    ALGORITHM: {
      label: 'Algorithm Name',
      field: 'algorithmName',
      placeholder: 'Select Algorithm Name',
      required: true
    },
    INPUT: {
      label: 'Input',
      field: 'input',
      placeholder: 'Enter a VALID JSON type',
      tooltip: 'Warning: You entered not a valid JSON type',
      types: ['String', 'Numeric', 'Object', 'Array', 'Boolean', 'null']
    }
  },
  WEBHOOKS: {
    label: 'Webhooks',
    field: 'webhooks',
    PROGRESS: {
      label: 'Progress',
      field: 'webhooks.progress'
    },
    RESULT: {
      label: 'Result',
      field: 'webhooks.result'
    }
  },
  TRIGGERS: {
    label: 'Triggers',
    field: 'triggers',
    CRON: {
      label: 'Cron',
      field: 'triggers.cron',
      fields: {
        PATTERN: 'triggers.cron.pattern',
        ENABLED: 'triggers.cron.enabled'
      },
      placeholder: 'Pattern',
      errorMessage: 'Invalid Cron Expression'
    },
    PIPELINES: {
      label: 'Pipelines',
      field: 'triggers.pipelines',
      placeholder: 'Pick pipelines to activate upon result'
    }
  },
  OPTIONS: {
    label: 'Options',
    field: 'options',
    TOLERANCE: {
      label: 'Batch Tolerance',
      field: 'options.batchTolerance'
    },
    CONCURRENT: {
      label: 'Concurrent',
      field: 'options.concurrentPipelines'
    },
    VERBOSITY_LEVEL: {
      label: 'Verbosity Level',
      field: 'options.progressVerbosityLevel',
      types: ['info', 'trace', 'debug', 'warn', 'error', 'critical']
    },
    TTL: {
      label: 'TTL',
      field: 'options.ttl'
    },
    // Note that Priority on the top level and not under options.
    PRIORITY: {
      label: 'Priority',
      field: 'priority'
    }
  }
};

export default addPipelineSchema;
