import React from 'react';
import { SB_SECTIONS } from 'const';
import JsonTable from './JsonTable.react';
import { addPipelineTemplate, pipelineMock } from 'config';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';

export default {
  title: `${SB_SECTIONS.COMMON}|Json Table`,
};

const algo = {
  name: 'yellow-alg',
  algorithmImage: 'hkube/algorithm-example-python',
  cpu: 1,
  mem: '256Mi',
  options: {
    debug: false,
    pending: false,
  },
  minHotWorkers: 0,
  type: 'Image',
};

export const AddPipelineTemplate = () => <JsonTable jsonObject={addPipelineTemplate} />;
export const AddAlgorithmSchema = () => <JsonTable jsonObject={addAlgorithmSchema} />;
export const PipelineExample = () => <JsonTable jsonObject={pipelineMock} />;
export const AlgoExample = () => <JsonTable jsonObject={algo} />;
