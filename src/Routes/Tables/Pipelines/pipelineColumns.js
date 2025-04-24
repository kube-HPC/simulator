import React from 'react';
import { sorter } from 'utils';
import { Ellipsis } from 'components/common';
import UserAvatar from '../../../components/UserAvatar';
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

const Avarar = auditTrail => {
  const len = Array.isArray(auditTrail) ? auditTrail?.length : 0;
  const username = Array.isArray(auditTrail)
    ? auditTrail?.[len > 0 ? len - 1 : 0].user
    : 'D';

  return (
    auditTrail && (
      <UserAvatar
        username={username}
        size={20}
        titleToolTip={`Started by ${username}`}
      />
    )
  );
};

export default [
  {
    title: ``,
    dataIndex: [`auditTrail`],
    key: `auditTrail`,
    width: `2%`,
    render: Avarar,
  },
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
    // dataIndex: ['modified'],
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
