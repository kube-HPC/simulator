import React from 'react';
import { sorter } from 'utils';
import { Ellipsis } from 'components/common';
import AuditTrailAvatar from '../../../components/AuditTrailAvatar';
import PipelineActions from './PipelineActions.react';
import PipelineCron from './PipelineCron.react';
import PipelineStats from './PipelineStats.react';
import LastModified from './../Algorithms/LastModified';

const PipelineName = name => <Ellipsis copyable text={name} length={50} />;
const Stats = (name, { nodes }) => <PipelineStats name={name} nodes={nodes} />;
const Cron = (_, pipeline) => <PipelineCron pipeline={pipeline} />;

const Actions = (_, pipeline) => <PipelineActions pipeline={pipeline} />;

const sortByName = (a, b) => sorter(a.name, b.name);
const sortByLastModified = (a, b) => sorter(a.modified, b.modified);

export default [
  {
    title: ``,
    dataIndex: [`auditTrail`],
    key: `auditTrail`,
    width: `2%`,
    render: auditTrail => <AuditTrailAvatar auditTrail={auditTrail} />,
  },
  {
    width: `35%`,
    title: 'Pipeline Name',
    dataIndex: ['name'],
    key: 'name',
    sorter: sortByName,
    render: PipelineName,
  },
  {
    width: `15%`,
    title: 'Cron Job',
    dataIndex: ['cron'],
    key: 'cron',
    render: Cron,
  },
  {
    width: `10%`,
    title: 'Pipeline Stats',
    dataIndex: ['name'],
    key: 'status',
    render: Stats,
  },
  {
    align: 'center',
    width: `10%`,
    title: 'Last modified',
    // dataIndex: ['modified'],
    key: 'modified',
    sorter: sortByLastModified,
    render: record => (
      <LastModified auditTrail={record.auditTrail} modified={record.modified} />
    ),
  },
  {
    width: `10%`,
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: Actions,
  },
];
