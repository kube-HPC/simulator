import React from 'react';
import { Tag, Tooltip, Button } from 'antd';
import humanizeDuration from 'humanize-duration';

import { COLOR_PIPELINE_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';
import { PIPELINE_STATES } from 'const';

const getStatusFilter = () =>
  [PIPELINE_STATES.ACTIVE, PIPELINE_STATES.SUCCEED, PIPELINE_STATES.FAILED].map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status
  }));

const getNodeIOColumns = ({ downloadResult }) => [
  {
    title: 'index',
    dataIndex: 'index',
    key: 'index',
    render: index => <Tag>{index}</Tag>
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag color={COLOR_PIPELINE_STATUS[status]}>{status && toUpperCaseFirstLetter(status)}</Tag>
    ),
    filterMultiple: true,
    filters: getStatusFilter(),
    onFilter: (value, record) => record.status === value
  },
  {
    title: 'duration',
    dataIndex: 'duration',
    key: 'duration',
    render: (_, record) => (
      <Tag>
        {humanizeDuration(
          record.endTime ? record.endTime - record.startTime : Date.now() - record.startTime,
          {
            maxDecimalPoints: 2
          }
        )}
      </Tag>
    )
  },
  {
    title: 'retries',
    dataIndex: 'retries',
    key: 'retries',
    render: retries => <Tag>{retries}</Tag>
  },
  {
    title: 'Results',
    dataIndex: 'results',
    key: 'results',
    render: (_, record) => (
      <Tooltip placement="top" title={'Download Results'}>
        <Button
          type="default"
          disabled={!record.output}
          shape="circle"
          icon="download"
          onClick={() => downloadResult(record.output.path)}
        />
      </Tooltip>
    )
  }
];

export default getNodeIOColumns;
