import { Tag, Typography } from 'antd';
import Ellipsis from 'components/common/Ellipsis.react';
import { SERVICES } from 'const/services';
import React from 'react';
import Moment from 'react-moment';
import { COLOR_SERVICE } from 'styles/colors';
import { sorter, stringify } from 'utils/stringHelper';

const errorLogsTableColumns = [
  {
    title: 'Service Name',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: '10%',
    sorter: (a, b) => sorter(a.serviceName, b.serviceName),
    render: serviceName => {
      const serviceColor =
        COLOR_SERVICE[SERVICES[serviceName]] || COLOR_SERVICE.default;

      const { backgroundColor, isLight } = serviceColor;
      return (
        <Tag color={backgroundColor}>
          <Ellipsis
            style={{ color: isLight ? 'white' : 'black' }}
            text={SERVICES[serviceName]}
          />
        </Tag>
      );
    },
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    width: '10%',
    render: podName => <Ellipsis copyable text={podName} />,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
    render: message => (
      <Typography.Paragraph strong>
        {typeof message === 'string' ? message : stringify(message)}
      </Typography.Paragraph>
    ),
  },
  {
    title: 'Time Stamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: '10%',
    sorter: (a, b) => sorter(a.timestamp, b.timestamp),
    render: timestamp => (
      <Tag>
        <Moment format="DD/MM/YY HH:mm:ss">{timestamp}</Moment>
      </Tag>
    ),
  },
];

export default errorLogsTableColumns;
