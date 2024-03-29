import React from 'react';
import { SB_SECTIONS } from 'const';
import { mockData, buildLog } from 'config/mock/buildLogsMock';
import LogsViewer from '.';

export default {
  title: `${SB_SECTIONS.COMMON}|Logs Viewer`,
};

export const NodeLog = () => <LogsViewer dataSource={mockData} id="NodeLog" />;
export const BuildLog = () => (
  <LogsViewer dataSource={buildLog} isBuild id="BuildLog" />
);
export const Empty = () => <LogsViewer dataSource={[]} id="Empty" />;
