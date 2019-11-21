import React from 'react';
import { SB_SECTIONS } from 'const';
import JsonTable from './JsonTable.react';
import { addPipelineTemplate } from 'config';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';

export default {
  title: `${SB_SECTIONS.COMMON}|Json Table`,
};

export const AddPipelineTemplate = () => <JsonTable jsonObject={addPipelineTemplate} />;
export const AddAlgorithmSchema = () => <JsonTable jsonObject={addAlgorithmSchema} />;
