import React from 'react';
import Moment from 'react-moment';
import { sorter, stringify } from 'utils/string';

import { Tag, Typography } from 'antd';

import Ellipsis from 'components/common/Ellipsis.react';
import { SERVICE_COLOR } from 'styles/colors';
import { SERVICES } from 'const/services';

const errorLogsTableColumns = () => [
  {
    title: 'Service Name',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: '10%',
    sorter: (a, b) => sorter(a.serviceName, b.serviceName),
    render: serviceName => {
      const serviceColor = SERVICE_COLOR[SERVICES[serviceName]] || SERVICE_COLOR.default;

      const { backgroundColor, isLight } = serviceColor;
      return (
        <Tag color={backgroundColor}>
          <Ellipsis style={{ color: isLight ? 'white' : 'black' }} text={SERVICES[serviceName]} />
        </Tag>
      );
    }
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    width: '10%',
    render: podName => <Ellipsis copyable text={podName} />
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
    render: message => (
      <Typography.Paragraph strong>
        {typeof message === 'string' ? message : stringify(message)}
      </Typography.Paragraph>
    )
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
    )
  }
];

export default errorLogsTableColumns;
