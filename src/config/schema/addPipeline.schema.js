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
    label: 'Nodes'
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
