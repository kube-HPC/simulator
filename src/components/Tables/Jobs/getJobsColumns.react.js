import { Tag, Tooltip } from 'antd';
import { Ellipsis, ProgressStatus } from 'components/common';
import { PIPELINE_STATES, USER_GUIDE } from 'const';
import React from 'react';
import { COLOR_PRIORITY } from 'styles/colors';
import { sorter, toUpperCaseFirstLetter } from 'utils/string';
import JobStats from './JobNodeStats.react';
import JobProgress from './JobProgress.react';
import JobActions from './JobActions.react';
import JobTime from './JobTime.react';

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
const Priority = priority => (
  <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
    <Tag color={COLOR_PRIORITY[priority].color}>{COLOR_PRIORITY[priority].name}</Tag>
  </Tooltip>
);
const Progress = (_, record) => <JobProgress {...record} />;
const Action = (_, job) => <JobActions job={job} />;

const getJobsColumns = () => [
  {
    title: 'Job ID',
    dataIndex: 'key',
    key: 'key',
    width: '10%',
    render: Id,
  },
  {
    title: 'Pipeline Name',
    dataIndex: 'pipeline.name',
    key: 'pipeline',
    width: '10%',
    sorter: (a, b) => sorter(a.pipeline.name, b.pipeline.name),
    render: Name,
  },
  {
    title: 'Status',
    dataIndex: 'status.status',
    key: 'job-status',
    filterMultiple: true,
    filters: getStatusFilter(),
    width: '8%',
    sorter: (a, b) => sorter(a.status.status, b.status.status),
    onFilter: (value, record) => record.status.status === value,
    render: Status,
  },
  {
    title: 'Start Time',
    dataIndex: 'pipeline.startTime',
    key: 'Start timestamp',
    width: '15%',
    sorter: (a, b) => a.pipeline.startTime - b.pipeline.startTime,
    render: StartTime,
  },
  {
    title: 'Nodes Stats',
    dataIndex: 'status',
    key: 'node-status',
    width: '11%',
    render: Stats,
  },
  {
    title: 'Priority',
    dataIndex: 'pipeline.priority',
    key: 'priority',
    width: '6%',
    sorter: (a, b) => sorter(a.pipeline.priority, b.pipeline.priority),
    render: Priority,
  },
  {
    title: 'Progress',
    key: 'progress',
    width: '25%',
    align: 'center',
    render: Progress,
  },
  {
    title: 'Action',
    key: 'action',
    width: '15%',
    align: 'center',
    render: Action,
  },
];

export default getJobsColumns;
