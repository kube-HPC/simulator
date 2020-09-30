import React from 'react';
import { SB_SECTIONS } from 'const';
import { JsonView } from 'components/common';
import { addPipelineTemplate } from 'config';
import addAlgorithmSchema from 'Routes/Base/SidebarRight/AddAlgorithm/schema';

export default {
  title: `${SB_SECTIONS.JSON}Json View`,
};

export const AddPipelineTemplate = () => (
  <JsonView jsonObject={addPipelineTemplate} />
);
export const AddAlgorithmSchema = () => (
  <JsonView jsonObject={addAlgorithmSchema} />
);
