import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Button, Progress, Tag } from 'antd';
import Ellipsis from 'components/common/Ellipsis.react';
import humanizeDuration from 'humanize-duration';
import React from 'react';
import Moment from 'react-moment';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { sorter, toUpperCaseFirstLetter } from 'utils/string';

const getBuildsTableColumns = ({ onCancel, onRerun }) => [
  {
    title: 'Build Id',
    dataIndex: 'buildId',
    key: 'buildId',
    sorter: (a, b) => sorter(a.buildId, b.buildId),
    render: buildId => <Ellipsis copyable type="secondary" text={buildId} />,
  },
  {
    title: 'Env',
    dataIndex: 'env',
    key: 'env',
    sorter: (a, b) => sorter(a.env, b.env),
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
    sorter: (a, b) => sorter(a.version, b.version),
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    sorter: (a, b) => sorter(a.startTime, b.startTime),
    render: (_, record) => <Moment format="DD/MM/YY HH:mm:ss">{record.startTime}</Moment>,
  },
  {
    title: 'Running time',
    dataIndex: 'timeTook',
    key: 'timeTook',
    sorter: (a, b) => sorter(a.endTime, b.endTime),
    render: (_, record) => (
      <span>
        {humanizeDuration(
          record.endTime ? record.endTime - record.startTime : Date.now() - record.startTime,
          {
            maxDecimalPoints: 2,
          },
        )}
      </span>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    sorter: (a, b) => sorter(a.status, b.status),
    render: (_, record) => (
      <Tag color={COLOR_TASK_STATUS[record.status]}>{toUpperCaseFirstLetter(record.status)}</Tag>
    ),
  },
  {
    title: 'Progress',
    dataIndex: 'Progress',
    key: 'progress',
    width: '20%',
    render: (_, record) => {
      const failed = record.status === PIPELINE_STATUS.FAILED;
      const progress = (record.progress && parseInt(record.progress)) || 0;
      return (
        <Progress
          percent={progress}
          status={
            failed
              ? 'exception'
              : progress === 100
                ? PIPELINE_STATUS.SUCCESS
                : PIPELINE_STATUS.ACTIVE
          }
          strokeColor={failed ? COLOR_TASK_STATUS.failed : undefined}
        />
      );
    },
  },
  {
    title: 'Actions',
    key: 'stop',
    render: (_, record) =>
      record.status !== PIPELINE_STATUS.COMPLETED ? (
        <Button
          type="danger"
          shape="circle"
          icon="close"
          onClick={() => onCancel(record.buildId)}
        />
      ) : (
        <Button type="default" shape="circle" icon="redo" onClick={() => onRerun(record.buildId)} />
      ),
  },
];

export default getBuildsTableColumns;
