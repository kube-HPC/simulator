import React from 'react';
import { sorter } from 'utils';
import Moment from 'react-moment';
import { Tag } from 'antd';
import { Ellipsis } from 'components/common';
import PipelineActions from './PipelineActions.react';
import PipelineCron from './PipelineCron.react';
import PipelineStats from './PipelineStats.react';

const PipelineName = name => <Ellipsis copyable text={name} length={50} />;
const Stats = (name, { nodes }) => <PipelineStats name={name} nodes={nodes} />;
const Cron = (_, pipeline) => <PipelineCron pipeline={pipeline} />;
const LastModified = timestamp => (
  <Tag>
    <Moment format="DD/MM/YY HH:mm:ss">{+timestamp}</Moment>
  </Tag>
);
const Actions = (_, pipeline) => <PipelineActions pipeline={pipeline} />;

const sortByName = (a, b) => sorter(a.name, b.name);
const sortByLastModified = (a, b) => sorter(a.modified, b.modified);

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
    width: '10%',
    title: 'Last modified',
    dataIndex: ['modified'],
    key: 'modified',
    sorter: sortByLastModified,
    render: LastModified,
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: Actions,
  },
];
