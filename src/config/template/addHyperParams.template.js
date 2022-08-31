const addHyperParams = {
  name: '',
  nodes: [
    {
      kind: 'hyperparamsTuner',
      nodeName: 'optimizerNode',
      spec: {
        numberOfTrials: 9,
        objectivePipeline: '',
        hyperParams: [
          {
            suggest: 'uniform',
            name: 'x',
            low: -10,
            high: 10,
          },
        ],
      },
    },
  ],
};

export default addHyperParams;
