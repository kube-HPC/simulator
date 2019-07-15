import React from 'react';

import humanizeDuration from 'humanize-duration';
import Moment from 'react-moment';
import { toUpperCaseFirstLetter } from 'utils/string';

import { Progress, Tag, Tooltip, Button, Row, Col } from 'antd';

import { PRIORITY, STATUS } from 'constants/colors';
import { STATES } from 'constants/states';
import StatusTag from 'components/common/StatusTag.react';
import CopyEllipsis from 'components/common/CopyEllipsis.react';

import { downloadStorageResults } from 'actions/jobs.action';
import { execRawPipeline, stopPipeline, pausePipeline, resumePipeline } from 'actions/pipeline.action';

const ActiveState = [STATES.PENDING, STATES.ACTIVE, STATES.RECOVERING];

const canPauseOrResume = (state) => {
  return canPause(state) || canResume(state);
};

const canPause = (state) => {
  return ActiveState.includes(state);
};

const canResume = (state) => {
  return state === STATES.PAUSED;
};

const getStatusFilter = () =>
  Object.values(STATES).map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status
  }));

const sorter = (a, b) =>
  isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b;

const jobsTableColumns = dispatch => [
  {
    title: 'Job ID',
    dataIndex: 'key',
    key: 'key',
    render: (_, record) => <CopyEllipsis text={record.key} />
  },
  {
    title: 'Pipeline Name',
    dataIndex: 'status.pipeline',
    key: 'pipeline',
    sorter: (a, b) => sorter(a.key, b.key),
    render: (_, record) => <CopyEllipsis disabled text={record.pipeline.name} />
  },
  {
    title: 'Status',
    dataIndex: 'status.status',
    key: 'status',
    sorter: (a, b) => sorter(a.status.status, b.status.status),
    filterMultiple: true,
    filters: getStatusFilter(),
    onFilter: (value, record) => record.status.status === value,
    render: (_, record) => (
      <Tag color={STATUS[record.status && record.status.status]}>
        {toUpperCaseFirstLetter(record.status && record.status.status)}
      </Tag>
    )
  },
  {
    title: 'Start Time',
    dataIndex: 'status.timestamp',
    key: 'Start timestamp',
    sorter: (a, b) => a.pipeline.startTime - b.pipeline.startTime,
    render: (_, record) => (
      <Moment format="DD/MM/YY HH:mm:ss">
        {record.pipeline && record.pipeline.startTime}
      </Moment>
    )
  },
  {
    title: 'Running time',
    dataIndex: 'status.timestamp',
    key: 'timestamp',
    render: (_, record) => (
      <span>
        {humanizeDuration(
          record.results
            ? record.results.timeTook * 1000
            : Date.now() - (record.pipeline && record.pipeline.startTime),
          {
            maxDecimalPoints: 2
          }
        )}
      </span>
    )
  },
  {
    title: 'Nodes Stats',
    dataIndex: 'status.data.details',
    key: 'details',
    render: (_, record) =>
      record.status.data &&
      record.status.data.states &&
      Object.entries(record.status.data.states.asMutable()).map(
        ([status, count]) => (
          <StatusTag key={status} status={status} count={count} />
        )
      )
  },
  {
    title: 'Priority',
    dataIndex: 'pipeline.priority',
    key: 'priority',
    sorter: (a, b) => sorter(a.pipeline.priority, b.pipeline.priority),
    render: (_, record) => (
      <Tooltip placement="top" title={PRIORITY[record.pipeline.priority].name}>
        <Tag color={PRIORITY[record.pipeline.priority].color}>
          {PRIORITY[record.pipeline.priority].name}
        </Tag>
      </Tooltip>
    )
  },
  {
    title: 'Progress',
    dataIndex: 'Progress',
    width: '20%',
    render: (_, record) => {
      const stopped = record.status && record.status.status === STATES.STOPPED;
      const failed = record.status && record.status.status === STATES.FAILED;
      const progress = parseInt(
        (record.status && record.status.data && record.status.data.progress) ||
        0
      );
      return (
        <Progress
          percent={progress}
          status={
            stopped || failed
              ? 'exception'
              : progress === 100
                ? 'success'
                : 'active'
          }
          strokeColor={
            failed ? STATUS.failed : stopped ? STATUS.stopped : undefined
          }
        />
      );
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'stop',
    render: (_, record) => {
      const status = record.status.status;
      const isStopPipeline = status === STATES.ACTIVE || status === STATES.PENDING;
      const isResumePipeline = canResume(status);

      const stopAction = (
        <Tooltip
          placement="top"
          title={isStopPipeline ? 'Stop Pipeline' : 'Re-Run'}>
          <Button
            type={isStopPipeline ? 'danger' : 'default'}
            shape="circle"
            icon={isStopPipeline ? 'close' : 'redo'}
            onClick={() =>
              isStopPipeline
                ? dispatch(stopPipeline(record.key))
                : dispatch(execRawPipeline(record.pipeline))
            }
          />
        </Tooltip>
      );

      const pauseAction = (
        <Tooltip
          placement="top"
          title={isResumePipeline ? 'Resume' : 'Pause'}>
          <Button
            type='default'
            disabled={!(canPauseOrResume(status))}
            shape="circle"
            icon={isResumePipeline ? 'caret-right' : 'pause'}
            onClick={() =>
              isResumePipeline
                ? dispatch(resumePipeline(record.key))
                : dispatch(pausePipeline(record.key))
            }
          />
        </Tooltip>
      );
      const isDisabled = !(
        record.results &&
        record.results.data &&
        record.results.data.storageInfo
      );
      const downloadAction = (
        <Tooltip placement="top" title={'Download Results'}>
          <Button
            type="default"
            disabled={isDisabled}
            shape="circle"
            icon="download"
            onClick={() =>
              dispatch(
                downloadStorageResults(record.results.data.storageInfo.path)
              )
            }
          />
        </Tooltip>
      );

      return (
        <Row type="flex" justify="start" gutter={10}>
          <Col>{stopAction}</Col>
          <Col>{pauseAction}</Col>
          <Col>{downloadAction}</Col>
        </Row>
      );
    }
  }
];

export default jobsTableColumns;
