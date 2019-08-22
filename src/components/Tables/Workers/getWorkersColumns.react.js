import React from 'react';
import { Icon, Tag } from 'antd';

import { COLOR_PIPELINE_STATUS } from 'styles/colors';
import StatusTag from 'components/common/StatusTag.react';

import { toUpperCaseFirstLetter, sorter } from 'utils/string';
import Ellipsis from 'components/common/Ellipsis.react';
import { PIPELINE_STATES } from 'const';

const undefinedStateFilter = state => state || 'Creating';

export const workersTableStats = () => [
  {
    title: '',
    dataIndex: 'workerStatus',
    key: 'workerStatusIcon',
    render: (_, record) => (
      <>
        {record.workerPaused && <Icon type="pause-circle" theme="twoTone" twoToneColor="red" />}
        {record.hotWorker && <Icon type="fire" theme="filled" style={{ color: 'orange' }} />}
      </>
    )
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    onFilter: (value, record) => record.podName.includes(value),
    render: podName => <Ellipsis copyable text={podName} />
  },
  {
    title: 'Worker State',
    dataIndex: 'workerStatus',
    key: 'workerStatus',
    render: (_, record) => {
      const title = toUpperCaseFirstLetter(undefinedStateFilter(record.workerStatus));
      return (
        <>
          <Tag color={COLOR_PIPELINE_STATUS[record.workerStatus]}>{title}</Tag>
          <Tag color={COLOR_PIPELINE_STATUS[record.jobStatus]}>{`Job ${title}`}</Tag>
        </>
      );
    }
  },
  {
    title: 'Job ID',
    dataIndex: 'jobId',
    key: 'jobId',
    render: jobId => {
      const isValidJobId = jobId !== undefined;
      const type = !isValidJobId && 'warning';
      const text = jobId || 'Not Assigned';

      return <Ellipsis type={type} copyable={isValidJobId} text={text} />;
    }
  }
];

const toNum = text => (text && parseInt(text)) || 0;

export const getWorkersColumns = () => [
  {
    title: 'Algorithm Name',
    key: 'algorithmName',
    dataIndex: 'algorithmName',
    sorter: (a, b) => sorter(a.algorithmName, b.algorithmName),
    render: name => <Ellipsis text={name} />
  },
  {
    title: 'Ready Count',
    key: 'readyCount',
    dataIndex: 'ready',
    render: text => <StatusTag status={PIPELINE_STATES.PENDING} count={toNum(text)} />
  },
  {
    title: 'Working Count',
    key: 'workingCount',
    dataIndex: 'working',
    render: text => <StatusTag status={PIPELINE_STATES.ACTIVE} count={toNum(text)} />
  },
  {
    title: 'Init Count',
    key: 'initCount',
    dataIndex: 'init',
    render: text => <StatusTag status={PIPELINE_STATES.INIT} count={toNum(text)} />
  },
  {
    title: 'Exit Count',
    key: 'exitCount',
    dataIndex: 'exit',
    render: text => <StatusTag status={PIPELINE_STATES.STOPPED} count={toNum(text)} />
  },
  {
    title: 'Hot Count',
    key: 'hotCount',
    dataIndex: 'hot',
    render: text => <StatusTag status={PIPELINE_STATES.COMPLETED} count={toNum(text)} />
  },
  {
    title: 'Count',
    key: 'count',
    dataIndex: 'count',
    render: text => <StatusTag status={PIPELINE_STATES.SUCCEED} count={toNum(text)} />
  }
];
