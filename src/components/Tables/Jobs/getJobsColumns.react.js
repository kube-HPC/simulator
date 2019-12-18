import React from 'react';

import { toUpperCaseFirstLetter, sorter } from 'utils/string';
import { Tag, Tooltip, Button } from 'antd';
import { COLOR_PRIORITY } from 'styles/colors';
import { downloadStorageResults } from 'actions/jobs.action';
import { rerunRawPipeline, stopPipeline } from 'actions/pipeline.action';
import { FlexBox, Ellipsis, StatusTag, ProgressStatus } from 'components/common';
import { USER_GUIDE, PIPELINE_STATES } from 'const';
import JobProgress from './JobProgress.react';
import JobTime from './JobTime.react';

const ActiveState = [
  PIPELINE_STATES.PENDING,
  PIPELINE_STATES.ACTIVE,
  PIPELINE_STATES.RECOVERING,
  PIPELINE_STATES.RESUMING,
];

const isActive = state => ActiveState.includes(state);
const canPauseOrStop = state => isActive(state) || state === PIPELINE_STATES.PAUSED;

const getStatusFilter = () =>
  Object.values(PIPELINE_STATES).map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status,
  }));

const Id = jobID => <Ellipsis className={USER_GUIDE.TABLE_JOB.ID_SELECT} copyable text={jobID} />;
const Name = pipelineName => <Ellipsis text={pipelineName} />;
const StartTime = (startTime, { results }) => <JobTime startTime={startTime} results={results} />;

const Status = status => <ProgressStatus status={status} />;

const NodeStats = status => (
  <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
    {status.data &&
      status.data.states &&
      Object.entries(status.data.states).map(([status, count]) => (
        <FlexBox.Item key={status}>
          <StatusTag status={status} count={count} />
        </FlexBox.Item>
      ))}
  </FlexBox>
);

const Priority = priority => (
  <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
    <Tag color={COLOR_PRIORITY[priority].color}>{COLOR_PRIORITY[priority].name}</Tag>
  </Tooltip>
);

const Progress = (_, record) => <JobProgress {...record} />;

const getJobsColumns = ({ dispatch, isGuideOn }) => {
  const Action = (_, record) => {
    const status = record.status.status;
    const redoAction = (
      <Tooltip placement="top" title="Re-Run">
        <Button
          type="default"
          shape="circle"
          icon="redo"
          onClick={() => dispatch(rerunRawPipeline(record.pipeline))}
        />
      </Tooltip>
    );

    const stopAction = (
      <Tooltip placement="top" title="Stop Pipeline">
        <Button
          type="danger"
          disabled={!canPauseOrStop(status)}
          shape="circle"
          icon="close"
          onClick={() => dispatch(stopPipeline(record.key))}
        />
      </Tooltip>
    );
    const isDisabled = !(record.results && record.results.data && record.results.data.storageInfo);
    const downloadAction = (
      <Tooltip placement="top" title={'Download Results'}>
        <Button
          type="default"
          disabled={isDisabled}
          shape="circle"
          icon="download"
          onClick={() => dispatch(downloadStorageResults(record.results.data.storageInfo.path))}
        />
      </Tooltip>
    );

    return (
      <FlexBox
        className={isGuideOn ? USER_GUIDE.TABLE_JOB.ACTIONS_SELECT : ''}
        justify="center"
        gutter={10}>
        <FlexBox.Item>{redoAction}</FlexBox.Item>
        <FlexBox.Item>{stopAction}</FlexBox.Item>
        <FlexBox.Item>{downloadAction}</FlexBox.Item>
      </FlexBox>
    );
  };

  return [
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
      render: NodeStats,
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
};

export default getJobsColumns;
