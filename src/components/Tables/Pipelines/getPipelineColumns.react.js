import { Ellipsis } from 'components/common';
import React from 'react';
import { sorter } from 'utils';
import PipelineActions from './PipelineActions.react';
import PipelineCron from './PipelineCron.react';
import PipelineStats from './PipelineStats.react';

const PipelineName = name => <Ellipsis copyable text={name} />;
const Stats = (name, { nodes }) => <PipelineStats name={name} nodes={nodes} />;
const Cron = (_, pipeline) => <PipelineCron pipeline={pipeline} />;
const Actions = (_, pipeline) => <PipelineActions pipeline={pipeline} />;

const getPipelineColumns = () => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: PipelineName,
  },
  {
    title: 'Cron Job',
    dataIndex: 'cron',
    key: 'cron',
    render: Cron,
  },
  {
    title: 'Pipeline Stats',
    dataIndex: 'name',
    key: 'status',
    render: Stats,
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: Actions,
  },
];

export default getPipelineColumns;
