import React from 'react';

import humanizeDuration from 'humanize-duration';
import Moment from 'react-moment';
import { toUpperCaseFirstLetter, sorter } from 'utils/string';

import { Progress, Tag, Tooltip, Button, Row, Col, Typography } from 'antd';

import { COLOR_PRIORITY, COLOR_PIPELINE_STATUS } from 'constants/colors';
import PIPELINE_STATES from 'constants/pipeline-states';
import StatusTag from 'components/common/StatusTag.react';
import Ellipsis from 'components/common/Ellipsis.react';
import { SERVICE_COLOR } from 'constants/colors';

const errorLogsTableColumns = () => [
  {
    title: 'Service Name',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: '10%',
    render: serviceName => (
      <Tag color={SERVICE_COLOR[serviceName]}>
        <Ellipsis text={toUpperCaseFirstLetter(serviceName)} />
      </Tag>
    )
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    width: '10%',
    render: podName => <Ellipsis copyable type="secondary" text={podName} />
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
    render: message => (
      <Ellipsis copyable type="secondary" strong text={message} />
    )
  },
  {
    title: 'Time Stamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: '5%',
    sorter: (a, b) => a.timestamp - b.timestamp,
    render: timestamp => (
      <Tag>
        <Moment format="DD/MM/YY HH:mm:ss">{timestamp}</Moment>
      </Tag>
    )
  }
];

export default errorLogsTableColumns;
