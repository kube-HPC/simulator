import React from 'react';
import { sorter } from 'utils';
import { Ellipsis } from 'components/common';
import PipelineActions from './PipelineActions.react';
import PipelineCron from './PipelineCron.react';
import PipelineStats from './PipelineStats.react';

const PipelineName = name => <Ellipsis copyable text={name} />;
const Stats = (name, { nodes }) => <PipelineStats name={name} nodes={nodes} />;
const Cron = (_, pipeline) => <PipelineCron pipeline={pipeline} />;
const Actions = (_, pipeline) => <PipelineActions pipeline={pipeline} />;

const sortByName = (a, b) => sorter(a.name, b.name);

export default [
  {
    title: 'Pipeline Name',
    dataIndex: ['name'],
    key: 'name',
    sorter: sortByName,
    render: PipelineName,
  },
  {
    title: 'Cron Job',
    dataIndex: ['cron'],
    key: 'cron',
    render: Cron,
  },
  {
    title: 'Pipeline Stats',
    dataIndex: ['name'],
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
