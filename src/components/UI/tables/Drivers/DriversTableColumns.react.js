import React from 'react';
import { Tag } from 'antd';
import { COLOR_PIPELINE_STATUS } from 'constants/colors';
import { sorter } from 'utils/string';
import CopyEllipsis from 'components/common/CopyEllipsis.react';

const driversTableColumns = () => [
  {
    title: 'Driver ID',
    dataIndex: 'driverId',
    key: 'driverId',
    sorter: (a, b) => sorter(a.driverId, b.driverId),
    render: (_, record) => <CopyEllipsis text={record.driverId} />
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    onFilter: (value, record) => record.podName.includes(value),
    sorter: (a, b) => sorter(a.podName, b.podName),
    render: (_, record) => <CopyEllipsis disabled text={record.podName} />
  },
  {
    title: 'Pipeline',
    dataIndex: 'pipelineName',
    key: 'pipelineName'
  },
  {
    title: 'Driver State',
    dataIndex: 'driverStatus',
    key: 'driverStatus',
    render: (_, record) => (
      <Tag color={COLOR_PIPELINE_STATUS[record.driverStatus]}> {record.driverStatus}</Tag>
    ),
    sorter: (a, b) => sorter(a.driverStatus, b.driverStatus)
  },
  {
    title: 'Job State',
    dataIndex: 'jobStatus',
    key: 'jobStatus',
    render: (text, record) => (
      <span>
        <Tag color={COLOR_PIPELINE_STATUS[record.jobStatus]}> {record.jobStatus}</Tag>
      </span>
    ),
    sorter: (a, b) => sorter(a.jobStatus, b.jobStatus)
  },
  {
    title: 'Paused',
    dataIndex: 'paused',
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
