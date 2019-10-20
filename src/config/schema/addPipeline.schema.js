const addPipelineSchema = {
  INITIAL: {
    label: 'Initial',
    NAME: {
      label: 'Name',
      field: 'name',
      placeholder: 'Unique Identifier',
      required: true
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
      field: 'nodeName',
      placeholder: 'Node Name'
    },
    ALGORITHM: {
      label: 'Algorithm Name',
      field: 'algorithmName',
      placeholder: 'Select Algorithm Name'
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
    label: 'Webhooks'
  },
  TRIGGERS: {
    label: 'Triggers'
  },
  OPTIONS: {
    label: 'Options'
  }
};

export default addPipelineSchema;
