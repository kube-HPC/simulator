import React from 'react';
import styled from 'styled-components';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Ellipsis, FlexBox } from 'components/common';
import { USER_GUIDE } from 'const';
import { sorter, toUpperCaseFirstLetter } from 'utils/string';
import JobActions from './JobActions.react';
import JobStats from './JobNodeStats.react';
import JobPriority from './JobPriority.react';
import JobProgress from './JobProgress.react';
import JobStatus from './JobStatus.react';
import JobTime from './JobTime.react';
import JobTypes from './JobTypes.react';

const ItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const Id = jobID => (
  <Ellipsis className={USER_GUIDE.TABLE_JOB.ID_SELECT} copyable text={jobID} />
);
const Name = pipelineName => <Ellipsis text={pipelineName} />;
const StartTime = (startTime, { results }) => (
  <JobTime startTime={startTime} results={results} />
);
const Status = status => <JobStatus status={status} />;
const Stats = status => <JobStats status={status} />;
const Priority = priority => <JobPriority priority={priority} />;
const Types = types => <JobTypes types={types} fullName={false} />;

const Progress = (_, job) => (
  <FlexBox>
    <ItemGrow>
      <JobProgress
        // eslint-disable-next-line
        {...job}
      />
    </ItemGrow>
    <FlexBox.Item>
      <JobActions job={job} />
    </FlexBox.Item>
  </FlexBox>
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
    width: `10%`,
    render: Id,
  },
  {
    title: `Pipeline Name`,
    dataIndex: `pipeline.name`,
    key: `pipeline`,
    width: `10%`,
    sorter: sortPipelineName,
    render: Name,
  },
  {
    title: `Start Time`,
    dataIndex: `pipeline.startTime`,
    key: `Start timestamp`,
    width: `10%`,
    sorter: sortStartTime,
    render: StartTime,
  },
  {
    title: `Pipeline Type`,
    dataIndex: `pipeline.types`,
    key: `types`,
    width: `10%`,
    render: Types,
  },
  {
    title: `Priority`,
    dataIndex: `pipeline.priority`,
    key: `priority`,
    align: `center`,
    width: `5%`,
    sorter: sortPriority,
    render: Priority,
  },

  {
    title: `Nodes Stats`,
    dataIndex: `status`,
    key: `node-status`,
    align: `center`,
    width: `10%`,
    render: Stats,
  },
  {
    title: `Status`,
    dataIndex: `status`,
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
