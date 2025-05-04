import React from 'react';
import styled from 'styled-components';
import { executeActions as EXECUT_ACTIONS } from '@hkube/consts';
import { Ellipsis } from 'components/common';

import { USER_GUIDE } from 'const';
import { sorter } from 'utils/stringHelper';
import UserAvatar from '../../../components/UserAvatar';
import JobActions from './JobActions';
import PipelineNameActions from './PipelineNameActions';
import NodeStats from './NodeStats';
import JobPriority from './JobPriority';
import JobProgress from './JobProgress';
import JobStatus from './JobStatus';
import JobTime from './JobTime';
import JobTypes from './JobTypes';

const Id = jobID => (
  <Ellipsis
    className={USER_GUIDE.TABLE_JOB.ID_SELECT}
    copyable
    text={jobID || '---'}
  />
);

const Name = (text, record) => <PipelineNameActions pipeline={record} />;

const StartTime = (text, record) => {
  const { pipeline, results } = record;
  const { startTime } = pipeline;

  return <JobTime startTime={startTime} results={results} />;
};

const Status = (_, job) => {
  const { status, auditTrail } = job;

  return <JobStatus status={status} auditTrail={auditTrail} />;
};

const Stats = status => <NodeStats status={status} />;
// const Priority = priority => <JobPriority priority={priority} />;

const Priority = (text, record) => {
  const { pipeline } = record;
  const { priority } = pipeline;

  <JobPriority priority={priority} />;
};

// const Types = types => <JobTypes types={types} fullName={false} />;
const Types = (text, record) => {
  const { pipeline } = record;
  const { types } = pipeline;

  return <JobTypes types={types} fullName={false} />;
};

const ProgressContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const Progress = (_, job) => {
  const { status, type, width } = job;
  return (
    <ProgressContainer>
      <JobProgress status={status} type={type} width={width} />
      <JobActions job={job} />
    </ProgressContainer>
  );
};

// eslint-disable-next-line react/destructuring-assignment
const Avarar = auditTrail => {
  const username = auditTrail?.find(x => x.action === EXECUT_ACTIONS.RUN).user;

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

const sortPipelineName = (a, b) => sorter(a.pipeline.name, b.pipeline.name);
const sortStartTime = (a, b) => a.pipeline.startTime - b.pipeline.startTime;
const sortPriority = (a, b) => sorter(a.pipeline.priority, b.pipeline.priority);
// const onStatusFilter = (value, record) => record.status.status === value;
const sortStatus = (a, b) => sorter(a.status.status, b.status.status);

// const statusFilter = Object.values(PIPELINE_STATUS).map(status => ({
//  text: toUpperCaseFirstLetter(status),
//  value: status,
// }));

const jobColumns = [
  {
    title: ``,
    dataIndex: [`auditTrail`],
    key: `auditTrail`,
    width: `2%`,
    render: Avarar,
  },
  {
    title: `External ID`,
    dataIndex: [`externalId`],
    key: `externalId`,
    width: `10%`,
    render: Id,
  },
  {
    title: `Job ID`,
    dataIndex: [`key`],
    key: `key`,
    width: `10%`,
    render: Id,
  },
  {
    title: `Pipeline Name`,
    dataIndex: ['pipeline', 'name'],
    key: `pipeline`,
    width: `10%`,
    sorter: sortPipelineName,
    render: Name,
  },
  {
    title: `Start Time`,
    dataIndex: ['pipeline', 'startTime'],
    key: `Start timestamp`,
    width: `15%`,
    sorter: sortStartTime,
    render: StartTime,
  },
  {
    title: `Pipeline Type`,
    dataIndex: ['pipeline', 'types'],
    key: `types`,
    width: `10%`,
    render: Types,
  },
  {
    title: `Priority`,
    dataIndex: ['pipeline', 'priority'],
    key: `priority`,
    align: `center`,
    width: `6%`,
    sorter: sortPriority,
    render: Priority,
  },
  {
    title: `Nodes Stats`,
    dataIndex: ['status'],
    key: `node-status`,
    align: `center`,
    width: `10%`,
    render: Stats,
  },
  {
    title: `Status`,
    //  dataIndex: ['status'],
    key: `job-status`,
    //  filterMultiple: true,
    //  filters: statusFilter,
    width: `8%`,
    align: `center`,
    sorter: sortStatus,
    //  onFilter: onStatusFilter,
    render: Status,
  },
  {
    title: `Progress`,
    key: `progress`,
    render: Progress,
    align: `center`,
  },
];

export default jobColumns;
