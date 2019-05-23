import React from 'react';
import { Tag } from 'antd';
import { STATUS } from 'constants/colors';
import { sorter } from 'utils/string';

const driversTableColumns = props => [
  {
    title: 'Job ID',
    dataIndex: 'jobId',
    key: 'jobId',
    width: '20%',
    sorter: (a, b) => sorter(a.jobId, b.jobId)
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    width: '20%',
    onFilter: (value, record) => record.podName.includes(value),
    sorter: (a, b) => sorter(a.podName, b.podName)
  },
  {
    title: 'Pipeline',
    dataIndex: 'pipelineName',
    key: 'pipelineName',
    width: '15%'
  },
  {
    title: 'Driver State',
    dataIndex: 'driverStatus',
    width: '15%',
    key: 'driverStatus',
    render: (text, record) => (
      <span>
        <Tag color={STATUS[record.driverStatus]}>
          {' '}
          {record.driverStatus}
        </Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.driverStatus, b.driverStatus)
  },
  {
    title: 'Job State',
    dataIndex: 'jobStatus',
    width: '15%',
    key: 'jobStatus',
    render: (text, record) => (
      <span>
        <Tag color={STATUS[record.jobStatus]}>
          {' '}
          {record.jobStatus}
        </Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.jobStatus, b.jobStatus)
  },
  {
    title: 'Paused',
    dataIndex: 'paused',
    width: '15%',
    key: 'paused',
    render: (text, record) => (
      <span>
        <Tag color={record.paused ? 'red' : 'green'}>
          {' '}
          {record.paused ? 'paused' : 'ready'}
        </Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.paused, b.paused)
  }
];

export default driversTableColumns;
