import React from 'react';
import { Button, Icon, Tag } from 'antd';

import { STATUS } from 'constants/colors';
import StatusTag from 'components/dumb/StatusTag.react';

import { toUpperCaseFirstLetter } from 'utils/string';

const undefinedStateFilter = state => state || 'Creating';

export const workersTableStats = () => [
  {
    title: '',
    dataIndex: 'data.workerStatus',
    width: '2%',
    key: 'workerStatusIcon',
    render: (_, record) => (
      <>
        {record.data.workerPaused && (
          <Icon type="pause-circle" theme="twoTone" twoToneColor="red" />
        )}
        {record.data.hotWorker && (
          <Icon type="fire" theme="filled" style={{ color: 'orange' }} />
        )}
      </>
    )
  },
  {
    title: 'Pod Name',
    dataIndex: 'data.podName',
    key: 'podName',
    onFilter: (value, record) => record.data.podName.includes(value)
  },
  {
    title: 'Worker State',
    dataIndex: 'data.workerStatus',
    width: '30%',
    key: 'workerStatus',
    render: (_, record) => {
      const title = toUpperCaseFirstLetter(
        undefinedStateFilter(record.data.workerStatus)
      );
      return (
        <>
          <Tag color={STATUS[record.data.workerStatus]}>{title}</Tag>
          <Tag color={STATUS[record.data.jobStatus]}>{`Jobs ${title}`}</Tag>
        </>
      );
    }
  },
  {
    title: 'Job ID',
    dataIndex: 'data.jobId',
    width: '30%',
    key: 'jobId'
  },
  {
    title: 'View Logs',
    dataIndex: 'data.logs',
    width: '10%',
    key: 'logs',
    render: () => <Button size="small" icon="read" />
  }
];

const toNum = text => (text && parseInt(text)) || 0;

export const workerTableColumns = () => [
  {
    title: 'Algorithm Name',
    key: 'algorithmName',
    dataIndex: 'algorithmName'
  },
  {
    title: 'Ready Count',
    key: 'readyCount',
    dataIndex: 'ready',
    render: text => <StatusTag status={'Ready'} count={toNum(text)} />
  },
  {
    title: 'Working Count',
    key: 'workingCount',
    dataIndex: 'working',
    render: text => <StatusTag status={'Working'} count={toNum(text)} />
  },
  {
    title: 'Init Count',
    key: 'initCount',
    dataIndex: 'init',
    render: text => <StatusTag status={'Init'} count={toNum(text)} />
  },
  {
    title: 'Exit Count',
    key: 'exitCount',
    dataIndex: 'exit',
    render: text => <StatusTag status={'Exit'} count={toNum(text)} />
  },
  {
    title: 'Hot Count',
    key: 'hotCount',
    dataIndex: 'hot',
    render: text => <StatusTag status={'Hot'} count={toNum(text)} />
  },
  {
    title: 'Count',
    key: 'count',
    dataIndex: 'count',
    render: text => <StatusTag status={'Count'} count={toNum(text)} />
  }
];
