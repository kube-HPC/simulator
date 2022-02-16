import React from 'react';
import styled from 'styled-components';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Ellipsis } from 'components/common';
import { USER_GUIDE } from 'const';
import { sorter, toUpperCaseFirstLetter } from 'utils/stringHelper';
import JobActions from './JobActions';
import NodeStats from './NodeStats';
import JobPriority from './JobPriority';
import JobProgress from './JobProgress';
import JobStatus from './JobStatus';
import JobTime from './JobTime';
import JobTypes from './JobTypes';

const Id = jobID => (
  <Ellipsis className={USER_GUIDE.TABLE_JOB.ID_SELECT} copyable text={jobID} />
);
const Name = pipelineName => <Ellipsis text={pipelineName} />;
const StartTime = (startTime, { results }) => (
  <JobTime startTime={startTime} results={results} />
);
const Status = status => <JobStatus status={status} />;
const Stats = status => <NodeStats status={status} />;
const Priority = priority => <JobPriority priority={priority} />;

const Types = types => <JobTypes types={types} fullName={false} />;

const ProgressContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const Progress = (_, job) => (
  <ProgressContainer>
    <JobProgress
      // eslint-disable-next-line
      {...job}
    />
    <JobActions job={job} />
  </ProgressContainer>
);

const sortPipelineName = (a, b) => sorter(a.pipeline.name, b.pipeline.name);
const sortStartTime = (a, b) => a.pipeline.startTime - b.pipeline.startTime;
const sortPriority = (a, b) => sorter(a.pipeline.priority, b.pipeline.priority);
const onStatusFilter = (value, record) => record.status.status === value;
const sortStatus = (a, b) => sorter(a.status.status, b.status.status);

const statusFilter = Object.values(PIPELINE_STATUS).map(status => ({
  text: toUpperCaseFirstLetter(status),
  value: status,
}));

const jobColumns = [
  {
    title: `Job ID`,
    dataIndex: `key`,
    key: `key`,
    width: `10ch`,
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
    width: `10%`,
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
    width: `15ch`,
    sorter: sortPriority,
    render: Priority,
  },
  {
    title: `Nodes Stats`,
    dataIndex: ['status'],
    key: `node-status`,
    align: `center`,
    width: `20ch`,
    render: Stats,
  },
  {
    title: `Status`,
    dataIndex: ['status'],
    key: `job-status`,
    filterMultiple: true,
    filters: statusFilter,
    width: `8%`,
    align: `center`,
    sorter: sortStatus,
    onFilter: onStatusFilter,
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
