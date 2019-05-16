import React from 'react';
import { STATUS } from 'constants/colors';
import { sorter } from 'utils/string';
import { Tag, Icon, Progress, notification, Button } from 'antd';
import { toUpperCaseFirstLetter } from 'utils/string';
import Moment from 'react-moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import humanizeDuration from 'humanize-duration';
import StatusTag from 'components/dumb/StatusTag.react';
import styled from 'styled-components';

const IconWhite = styled(Icon)`
  color: rgba(187, 180, 180, 0.75);
  margin-right: 10px;
`;

export const buildsTableColumns = props => [
  {
    title: 'Algorithm Name',
    dataIndex: 'algorithmName',
    key: 'algorithmName',
    width: '20%',
    sorter: (a, b) => sorter(a.algorithmName, b.algorithmName)
  },
  {
    title: 'Status',
    key: 'status',
    width: '20%',
    sorter: (a, b) => sorter(a.timestamp, b.timestamp),
    render: (_, record) =>
      Object.entries(record.statuses).map(([status, arr]) => (
        <StatusTag status={status} count={arr.length} />
      ))
  },
  {
    title: 'Builds',
    dataIndex: 'builds',
    key: 'builds',
    width: '60%',
    render: (_, record) => (
      <StatusTag
        status={'Total Builds'}
        count={
          props.dataSource.filter(d => d.algorithmName === record.algorithmName)
            .length
        }
      />
    )
  }
];

export const nestedBuildTableColumns = props => [
  {
    title: 'Build Id',
    dataIndex: 'buildId',
    key: 'buildId',
    width: '15%',
    sorter: (a, b) => sorter(a.buildId, b.buildId),
    render: (_, record) => (
      <CopyToClipboard
        text={`${record.buildId}`}
        onCopy={() => notification.success({ message: 'Copied to clipboard' })}
      >
        <>
          <IconWhite type="right" />
          {`${record.buildId.substring(0, 15)}...`}
        </>
      </CopyToClipboard>
    )
  },
  {
    title: 'Env',
    dataIndex: 'env',
    key: 'env',
    width: '10%',
    sorter: (a, b) => sorter(a.env, b.env)
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
    width: '10%',
    sorter: (a, b) => sorter(a.version, b.version)
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    width: '10%',
    sorter: (a, b) => sorter(a.startTime, b.startTime),
    render: (_, record) => (
      <Moment format="DD/MM/YY HH:mm:ss">{record.startTime}</Moment>
    )
  },
  {
    title: 'Running time',
    dataIndex: 'timeTook',
    key: 'timeTook',
    width: '10%',
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
    width: '15%',
    sorter: (a, b) => sorter(a.status, b.status),
    render: (text, record) => (
      <Tag color={STATUS[record.status]}>
        {toUpperCaseFirstLetter(record.status)}
      </Tag>
    )
  },
  {
    title: 'Progress',
    dataIndex: 'Progress',
    width: '20%',
    key: 'y',
    render: (_, record) => {
      const failed = record.status === 'failed';
      const progress = (record.progress && parseInt(record.progress)) || 0;
      return (
        <Progress
          percent={progress}
          status={
            failed ? 'exception' : progress === 100 ? 'success' : 'active'
          }
          strokeColor={failed ? STATUS.failed : undefined}
        />
      );
    }
  },
  {
    title: 'Actions',
    key: 'stop',
    width: '10%',
    render: (_, record) =>
      record.status === 'pending' ? (
        <Button
          type="danger"
          shape="circle"
          icon="close"
          onClick={() => props.cancelBuild(record.buildId)}
        />
      ) : (
        <Button
          type="default"
          shape="circle"
          icon="redo"
          onClick={() => props.rerunBuild(record.buildId)}
        />
      )
  }
];
