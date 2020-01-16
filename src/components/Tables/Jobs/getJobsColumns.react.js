import { Ellipsis, FlexBox, ProgressStatus } from 'components/common';
import { PIPELINE_STATES, USER_GUIDE } from 'const';
import React from 'react';
import styled from 'styled-components';
import { sorter, toUpperCaseFirstLetter } from 'utils/string';
import JobActions from './JobActions.react';
import JobStats from './JobNodeStats.react';
import JobPriority from './JobPriority.react';
import JobProgress from './JobProgress.react';
import JobTime from './JobTime.react';
import JobTypes from './JobTypes.react';

const getStatusFilter = () =>
  Object.values(PIPELINE_STATES).map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status,
  }));

const Id = jobID => <Ellipsis className={USER_GUIDE.TABLE_JOB.ID_SELECT} copyable text={jobID} />;
const Name = pipelineName => <Ellipsis text={pipelineName} />;
const StartTime = (startTime, { results }) => <JobTime startTime={startTime} results={results} />;
const Status = status => <ProgressStatus status={status} />;
const Stats = status => <JobStats status={status} />;
const Priority = priority => <JobPriority priority={priority} />;
const Types = types => <JobTypes types={types} fullName={false} />;

const ItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const Progress = (_, job) => (
  <FlexBox>
    <ItemGrow>
      <JobProgress {...job} />
    </ItemGrow>
    <FlexBox.Item>
      <JobActions job={job} />
    </FlexBox.Item>
  </FlexBox>
);

const getJobsColumns = () => [
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
    sorter: (a, b) => sorter(a.pipeline.name, b.pipeline.name),
    render: Name,
  },
  {
    title: `Start Time`,
    dataIndex: `pipeline.startTime`,
    key: `Start timestamp`,
    width: `10%`,
    sorter: (a, b) => a.pipeline.startTime - b.pipeline.startTime,
    render: StartTime,
  },
  {
    title: `Pipeline Types`,
    dataIndex: `pipeline.types`,
    key: `types`,
    align: `center`,
    width: `10%`,
    render: Types,
  },
  {
    title: `Priority`,
    dataIndex: `pipeline.priority`,
    key: `priority`,
    align: `center`,
    width: `5%`,
    sorter: (a, b) => sorter(a.pipeline.priority, b.pipeline.priority),
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
    dataIndex: `status.status`,
    key: `job-status`,
    filterMultiple: true,
    filters: getStatusFilter(),
    width: `8%`,
    align: `center`,
    sorter: (a, b) => sorter(a.status.status, b.status.status),
    onFilter: (value, record) => record.status.status === value,
    render: Status,
  },
  {
    title: `Progress`,
    key: `progress`,
    render: Progress,
    align: `center`,
  },
];

export default getJobsColumns;
