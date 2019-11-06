import React from 'react';

import humanizeDuration from 'humanize-duration';
import Moment from 'react-moment';

import { toUpperCaseFirstLetter, sorter } from 'utils/string';
import { Progress, Tag, Tooltip, Button, Row, Col } from 'antd';
import { COLOR_PRIORITY, COLOR_PIPELINE_STATUS } from 'styles/colors';
import { downloadStorageResults } from 'actions/jobs.action';
import { rerunRawPipeline, stopPipeline } from 'actions/pipeline.action';
import { FlexBox, Ellipsis, StatusTag } from 'components/common';
import { USER_GUIDE, PIPELINE_STATES } from 'const';

const ActiveState = [
  PIPELINE_STATES.PENDING,
  PIPELINE_STATES.ACTIVE,
  PIPELINE_STATES.RECOVERING,
  PIPELINE_STATES.RESUMING
];

const canPauseOrStop = state => isActive(state) || state === PIPELINE_STATES.PAUSED;
const isActive = state => ActiveState.includes(state);

const getStatusFilter = () =>
  Object.values(PIPELINE_STATES).map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status
  }));

const getJobsColumns = ({ dispatch, isGuideOn }) => [
  {
    title: 'Job ID',
    dataIndex: 'key',
    key: 'key',
    width: '10%',
    render: jobID => <Ellipsis className={USER_GUIDE.TABLE_JOB.ID_SELECT} copyable text={jobID} />
  },
  {
    title: 'Pipeline Name',
    dataIndex: 'pipeline.name',
    key: 'pipeline',
    width: '10%',
    sorter: (a, b) => sorter(a.pipeline.name, b.pipeline.name),
    render: pipelineName => <Ellipsis text={pipelineName} />
  },
  {
    title: 'Status',
    dataIndex: 'status.status',
    key: 'job-status',
    filterMultiple: true,
    filters: getStatusFilter(),
    width: '5%',
    sorter: (a, b) => sorter(a.status.status, b.status.status),
    onFilter: (value, record) => record.status.status === value,
    render: status => (
      <Tag color={COLOR_PIPELINE_STATUS[status]}>{toUpperCaseFirstLetter(status)}</Tag>
    )
  },
  {
    title: 'Start Time',
    dataIndex: 'pipeline.startTime',
    key: 'Start timestamp',
    width: '10%',
    sorter: (a, b) => a.pipeline.startTime - b.pipeline.startTime,
    render: startTime => (
      <Tag>
        <Moment format="DD/MM/YY HH:mm:ss">{startTime}</Moment>
      </Tag>
    )
  },
  {
    title: 'Running Time',
    key: 'timestamp',
    width: '10%',
    render: (_, record) => (
      <Tag>
        {humanizeDuration(
          record.results
            ? record.results.timeTook * 1000
            : Date.now() - (record.pipeline && record.pipeline.startTime),
          {
            maxDecimalPoints: 2
          }
        )}
      </Tag>
    )
  },
  {
    title: 'Nodes Stats',
    dataIndex: 'status',
    key: 'node-status',
    render: status => (
      <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
        {status.data &&
          status.data.states &&
          Object.entries(status.data.states).map(([status, count]) => (
            <FlexBox.Item key={status}>
              <StatusTag status={status} count={count} />
            </FlexBox.Item>
          ))}
      </FlexBox>
    )
  },
  {
    title: 'Priority',
    dataIndex: 'pipeline.priority',
    key: 'priority',
    width: '6%',
    sorter: (a, b) => sorter(a.pipeline.priority, b.pipeline.priority),
    render: priority => (
      <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
        <Tag color={COLOR_PRIORITY[priority].color}>{COLOR_PRIORITY[priority].name}</Tag>
      </Tooltip>
    )
  },
  {
    title: 'Progress',
    key: 'progress',
    width: '20%',
    align: 'center',
    render: (_, record) => {
      const stopped = record.status && record.status.status === PIPELINE_STATES.STOPPED;
      const failed = record.status && record.status.status === PIPELINE_STATES.FAILED;
      const progress = parseInt(
        (record.status && record.status.data && record.status.data.progress) || 0
      );
      return (
        <Progress
          percent={progress}
          status={stopped || failed ? 'exception' : progress === 100 ? 'success' : 'active'}
          strokeColor={
            failed
              ? COLOR_PIPELINE_STATUS.failed
              : stopped
              ? COLOR_PIPELINE_STATUS.stopped
              : undefined
          }
        />
      );
    }
  },
  {
    title: 'Action',
    key: 'action',
    width: '15%',
    align: 'center',
    render: (_, record) => {
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
            onClick={() => dispatch(downloadStorageResults(record.results.data.storageInfo.path))}
          />
        </Tooltip>
      );

      return (
        <Row
          className={isGuideOn ? USER_GUIDE.TABLE_JOB.ACTIONS_SELECT : ''}
          type="flex"
          justify="center"
          gutter={10}
        >
          <Col>{redoAction}</Col>
          <Col>{stopAction}</Col>
          <Col>{downloadAction}</Col>
        </Row>
      );
    }
  }
];

export default getJobsColumns;
