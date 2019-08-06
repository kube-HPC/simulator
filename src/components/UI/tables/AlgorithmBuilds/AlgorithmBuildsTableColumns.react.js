import React from 'react';
import Moment from 'react-moment';
import humanizeDuration from 'humanize-duration';

import { Tag, Progress, Button } from 'antd';

import StatusTag from 'components/common/StatusTag.react';
import Ellipsis from 'components/common/Ellipsis.react';
import { COLOR_PIPELINE_STATUS } from 'constants/colors';
import PIPELINE_STATES from 'constants/pipeline-states';
import { sorter } from 'utils/string';
import { toUpperCaseFirstLetter } from 'utils/string';

export const buildsTableColumns = ({ dataSource }) => [
  {
    title: 'Algorithm Name',
    dataIndex: 'algorithmName',
    key: 'algorithmName',
    sorter: (a, b) => sorter(a.algorithmName, b.algorithmName)
  },
  {
    title: 'Status',
    key: 'status',
    sorter: (a, b) => sorter(a.timestamp, b.timestamp),
    render: (_, record) =>
      Object.entries(record.statuses).map(([status, arr]) => (
        <StatusTag key={status} status={status} count={arr.length} />
      ))
  },
  {
    title: 'Builds',
    dataIndex: 'builds',
    key: 'builds',
    render: (_, record) => (
      <StatusTag
        status={'Total Builds'}
        count={
          dataSource.filter(
            algorithm => algorithm.algorithmName === record.algorithmName
          ).length
        }
      />
    )
  }
];

export const nestedBuildsTableColumns = ({ onCancel, onRerun }) => [
  {
    title: 'Build Id',
    dataIndex: 'buildId',
    key: 'buildId',
    sorter: (a, b) => sorter(a.buildId, b.buildId),
    render: buildId => <Ellipsis copyable type="secondary" text={buildId} />
  },
  {
    title: 'Env',
    dataIndex: 'env',
    key: 'env',
    sorter: (a, b) => sorter(a.env, b.env)
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
    sorter: (a, b) => sorter(a.version, b.version)
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    sorter: (a, b) => sorter(a.startTime, b.startTime),
    render: (_, record) => (
      <Moment format="DD/MM/YY HH:mm:ss">{record.startTime}</Moment>
    )
  },
  {
    title: 'Running time',
    dataIndex: 'timeTook',
    key: 'timeTook',
    sorter: (a, b) => sorter(a.endTime, b.endTime),
    render: (_, record) => (
      <span>
        {humanizeDuration(
          record.endTime
            ? record.endTime - record.startTime
            : Date.now() - record.startTime,
          {
            maxDecimalPoints: 2
          }
        )}
      </span>
    )
  },
  {
    title: 'Status',
    key: 'status',
    sorter: (a, b) => sorter(a.status, b.status),
    render: (_, record) => (
      <Tag color={COLOR_PIPELINE_STATUS[record.status]}>
        {toUpperCaseFirstLetter(record.status)}
      </Tag>
    )
  },
  {
    title: 'Progress',
    dataIndex: 'Progress',
    key: 'progress',
    width: '20%',
    render: (_, record) => {
      const failed = record.status === PIPELINE_STATES.FAILED;
      const progress = (record.progress && parseInt(record.progress)) || 0;
      return (
        <Progress
          percent={progress}
          status={
            failed
              ? 'exception'
              : progress === 100
              ? PIPELINE_STATES.SUCCESS
              : PIPELINE_STATES.ACTIVE
          }
          strokeColor={failed ? COLOR_PIPELINE_STATUS.failed : undefined}
        />
      );
    }
  },
  {
    title: 'Actions',
    key: 'stop',
    render: (_, record) =>
      record.status !== PIPELINE_STATES.COMPLETED ? (
        <Button
          type="danger"
          shape="circle"
          icon="close"
          onClick={() => onCancel(record.buildId)}
        />
      ) : (
        <Button
          type="default"
          shape="circle"
          icon="redo"
          onClick={() => onRerun(record.buildId)}
        />
      )
  }
];
