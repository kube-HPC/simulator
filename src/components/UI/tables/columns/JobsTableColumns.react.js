/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

import humanizeDuration from 'humanize-duration';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Moment from 'react-moment';
import { toUpperCaseFirstLetter } from 'utils/string';

import {
  Icon,
  notification,
  Progress,
  Tag,
  Tooltip,
  Button,
  Row,
  Col
} from 'antd';

import { PRIORITY, STATUS } from 'constants/colors';
import StatusTag from 'components/dumb/StatusTag.react';

const IconWhite = styled(Icon)`
  color: rgba(187, 180, 180, 0.75);
  margin-right: 10px;
`;

const getStatusFilter = () =>
  Object.keys(PRIORITY).map(k => ({
    text: toUpperCaseFirstLetter(k),
    value: k
  }));

const sorter = (a, b) =>
  isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b;

const jobsTableColumns = props => [
  {
    title: 'Job ID',
    dataIndex: 'key',
    key: 'key',
    width: '15%',
    render: (_, record) => (
      <CopyToClipboard
        text={`${record.key}`}
        onCopy={() => notification.success({ message: 'Copied to clipboard' })}
      >
        <>
          <IconWhite type="right" />
          <Tooltip placement="top" title={record.key}>{`${record.key.substring(
            0,
            20
          )} ...`}</Tooltip>
        </>
      </CopyToClipboard>
    )
  },
  {
    title: 'Pipeline Name',
    dataIndex: 'status.pipeline',
    key: 'pipeline',
    width: '10%',
    sorter: (a, b) => sorter(a.key, b.key)
  },
  {
    title: 'Pipeline Status',
    dataIndex: 'status.status',
    width: '10%',
    key: 'status',
    render: (_, record) => (
      <Tag color={STATUS[record.status && record.status.status]}>
        {toUpperCaseFirstLetter(record.status && record.status.status)}
      </Tag>
    ),
    sorter: (a, b) => sorter(a.status.status, b.status.status),
    filterMultiple: true,
    filters: getStatusFilter(),
    onFilter: (value, record) => record.status.status === value
  },
  {
    title: 'Start Time',
    dataIndex: 'status.timestamp',
    key: 'Start timestamp',
    width: '10%',
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
    width: '10%',
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
    width: '10%',
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
    width: '5%',
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
      const stopped = record.status && record.status.status === 'stopped';
      const failed = record.status && record.status.status === 'failed';
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
    width: '15%',
    render: (_, record) => {
      const isStopPipeline =
        record.status.status === 'active' || record.status.status === 'pending';
      const stopAction = (
        <Tooltip
          placement="top"
          title={isStopPipeline ? 'Stop Pipeline' : 'Re-Run'}
        >
          <Button
            type={isStopPipeline ? 'danger' : 'default'}
            shape="circle"
            icon={isStopPipeline ? 'close' : 'redo'}
            onClick={() =>
              isStopPipeline
                ? props.stopPipeline(record.key)
                : props.execRawPipeline(record.pipeline)
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
              props.downloadStorageResults(record.results.data.storageInfo.path)
            }
          />
        </Tooltip>
      );

      return (
        <Row type="flex" justify="start" gutter={10}>
          <Col>{stopAction}</Col>
          <Col>{downloadAction}</Col>
        </Row>
      );
    }
  }
];

export default jobsTableColumns;
