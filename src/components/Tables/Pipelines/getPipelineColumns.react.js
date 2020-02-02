import { Ellipsis } from 'components/common';
import React from 'react';
import { sorter } from 'utils';
import PipelineCron from './PipelineCron.react';
import PipelineStats from './PipelineStats.react';
import PipelineTensorflow from './PipelineTensorflow.react';

const PipelineName = name => <Ellipsis copyable text={name} />;
const TensorflowMetrics = name => <PipelineTensorflow name={name} />;
const Stats = (_, pipeline) => <PipelineStats pipeline={pipeline} />;
const Cron = (_, pipeline) => <PipelineCron pipeline={pipeline} />;

const getPipelineColumns = () => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
    sorter: (a, b) => sorter(a.name, b.name),
    render: PipelineName,
  },
  {
    title: 'Cron Job',
    dataIndex: 'cron',
    key: 'cron',
    width: '20%',
    render: Cron,
  },
  {
    title: 'Tensorflow',
    dataIndex: 'name',
    key: 'tensorflow',
    render: TensorflowMetrics,
    width: '20%',
  },
  {
    title: 'Pipeline Stats',
    dataIndex: 'status',
    key: 'status',
    width: '30%',
    render: Stats,
  },
];

export default getPipelineColumns;
