import React from 'react';
import Moment from 'react-moment';
import { Button, Progress, Tag } from 'antd';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import Ellipsis from 'components/common/Ellipsis.react';
import humanizeDuration from 'humanize-duration';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { sorter, toUpperCaseFirstLetter } from 'utils/string';

const BuildId = buildId => (
  <Ellipsis copyable type="secondary" text={buildId} />
);
const StartTime = startTime => (
  <Moment format="DD/MM/YY HH:mm:ss">{startTime}</Moment>
);

const RunningTime = (_, { startTime, endTime }) => (
  <span>
    {humanizeDuration(endTime ? endTime - startTime : Date.now() - startTime, {
      maxDecimalPoints: 2,
    })}
  </span>
);

const Status = status => (
  <Tag color={COLOR_TASK_STATUS[status]}>{toUpperCaseFirstLetter(status)}</Tag>
);

const getBuildsTableColumns = ({ cancelBuild, rerunBuild }) => [
  {
    title: 'Build Id',
    dataIndex: 'buildId',
    key: 'buildId',
    sorter: (a, b) => sorter(a.buildId, b.buildId),
    render: BuildId,
  },
  {
    title: 'Env',
    dataIndex: 'env',
    key: 'env',
    sorter: (a, b) => sorter(a.env, b.env),
  },
  {
    title: 'Image Tag',
    dataIndex: 'imageTag',
    key: 'imageTag',
    sorter: (a, b) => sorter(a.imageTag, b.imageTag),
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    sorter: (a, b) => sorter(a.startTime, b.startTime),
    render: StartTime,
  },
  {
    title: 'Running time',
    dataIndex: 'timeTook',
    key: 'timeTook',
    sorter: (a, b) => sorter(a.endTime, b.endTime),
    render: RunningTime,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => sorter(a.status, b.status),
    render: Status,
  },
  {
    title: 'Progress',
    dataIndex: 'Progress',
    key: 'progress',
    width: '20%',
    render: (_, record) => {
      const failed = record.status === PIPELINE_STATUS.FAILED;
      const progress = (record.progress && parseInt(record.progress, 10)) || 0;
      return (
        <Progress
          percent={progress}
          status={
            failed ? 'exception' : progress === 100 ? 'success' : 'active'
          }
          strokeColor={failed ? COLOR_TASK_STATUS.failed : undefined}
        />
      );
    },
  },
  {
    title: 'Actions',
    key: 'stop',
    render: (_, record) => {
      const failed = record.status === PIPELINE_STATUS.FAILED;
      const showCancel = !failed && record.status !== PIPELINE_STATUS.COMPLETED;
      return showCancel ? (
        <Button
          type="danger"
          shape="circle"
          icon="close"
          onClick={() => cancelBuild(record.buildId)}
        />
      ) : (
        <Button
          type="default"
          shape="circle"
          icon="redo"
          onClick={() => rerunBuild(record.buildId)}
        />
      );
    },
  },
];

export default getBuildsTableColumns;
