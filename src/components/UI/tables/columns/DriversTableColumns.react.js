import React from 'react';
import { Tag } from 'antd';
import { STATUS } from 'constants/colors';
import { sorter } from 'utils/string';

const driversTableColumns = props => [
  {
    title: 'Job ID',
    dataIndex: 'data.jobId',
    key: 'jobId',
    width: '20%',
    sorter: (a, b) => sorter(a.data.jobId, b.data.jobId)
  },
  {
    title: 'Pod Name',
    dataIndex: 'data.podName',
    key: 'podName',
    width: '20%',
    onFilter: (value, record) => record.data.podName.includes(value),
    sorter: (a, b) => sorter(a.data.podName, b.data.podName)
  },
  {
    title: 'Pipeline',
    dataIndex: 'data.pipelineName',
    key: 'pipelineName',
    width: '15%'
  },
  {
    title: 'Driver State',
    dataIndex: 'data.driverStatus',
    width: '15%',
    key: 'driverStatus',
    render: (text, record) => (
      <span>
        <Tag color={STATUS[record.data.driverStatus]}>
          {' '}
          {record.data.driverStatus}
        </Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.data.driverStatus, b.data.driverStatus)
  },
  {
    title: 'Job State',
    dataIndex: 'data.jobStatus',
    width: '15%',
    key: 'jobStatus',
    render: (text, record) => (
      <span>
        <Tag color={STATUS[record.data.jobStatus]}>
          {' '}
          {record.data.jobStatus}
        </Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.data.jobStatus, b.data.jobStatus)
  },
  {
    title: 'Paused',
    dataIndex: 'data.paused',
    width: '15%',
    key: 'paused',
    render: (text, record) => (
      <span>
        <Tag color={record.data.paused ? 'red' : 'green'}>
          {' '}
          {record.data.paused ? 'paused' : 'ready'}
        </Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.data.paused, b.data.paused)
  }
];

export default driversTableColumns;
