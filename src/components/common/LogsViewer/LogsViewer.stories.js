import React from 'react';
import { SB_SECTIONS } from 'const';
import LogsViewer from './LogsViewer.react';
import { mockData, buildLog } from 'config/mock/buildLogsMock';

export default {
  title: `${SB_SECTIONS.COMMON}|Logs Viewer`,
};

export const NodeLog = () => <LogsViewer dataSource={mockData} />;
export const BuildLog = () => <LogsViewer dataSource={buildLog} isBuild />;
export const Empty = () => <LogsViewer dataSource={[]} />;