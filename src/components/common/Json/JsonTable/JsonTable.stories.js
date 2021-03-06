import React from 'react';
import { SB_SECTIONS } from 'const';
import { pipelineMock, algorithmMock } from 'config/mock';
import JsonTable from '.';

export default {
  title: `${SB_SECTIONS.JSON}Json Table`,
};

export const Pipeline = () => <JsonTable obj={pipelineMock} />;
export const PipelineVertical = () => <JsonTable obj={pipelineMock} vertical />;
export const Algorithm = () => <JsonTable obj={algorithmMock} />;
export const AlgorithmVertical = () => (
  <JsonTable obj={algorithmMock} vertical />
);
