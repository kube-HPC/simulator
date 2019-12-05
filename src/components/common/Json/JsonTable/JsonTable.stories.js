import React from 'react';
import { SB_SECTIONS } from 'const';
import JsonTable from './JsonTable.react';
import { pipelineMock, algorithmMock } from 'config/mock';

export default {
  title: `${SB_SECTIONS.COMMON}|Json Table`,
};

export const Pipeline = () => <JsonTable obj={pipelineMock} />;
export const PipelineVertical = () => <JsonTable obj={pipelineMock} vertical />;
export const Algorithm = () => <JsonTable obj={algorithmMock} />;
export const AlgorithmVertical = () => <JsonTable obj={algorithmMock} vertical />;
