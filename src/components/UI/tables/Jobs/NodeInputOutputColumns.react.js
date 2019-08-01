import React from 'react';
import { Tag, Tooltip, Button, Row, Col } from 'antd';
import humanizeDuration from 'humanize-duration';

import { downloadStorageResults } from 'actions/jobs.action';
import { COLOR_PIPELINE_STATUS } from 'constants/colors';
import PIPELINE_STATES from 'constants/pipeline-states';
import { toUpperCaseFirstLetter } from 'utils/string';

const getStatusFilter = () =>
  [PIPELINE_STATES.ACTIVE, PIPELINE_STATES.SUCCEED, PIPELINE_STATES.FAILED].map(
    status => ({
      text: toUpperCaseFirstLetter(status),
      value: status
    })
  );

export default dispatch => [
  {
    title: 'index',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => (
      <Tag color={COLOR_PIPELINE_STATUS[record.status]}>
        {record.status && toUpperCaseFirstLetter(record.status)}
      </Tag>
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
      <span>
        {humanizeDuration(
          record.endTime
            ? record.endTime - record.startTime
            : Date.now() - record.startTime,
          {
            maxDecimalPoints: 2
          }
        )}
      </span>
    )
  },
  {
    title: 'retries',
    dataIndex: 'retries',
    key: 'retries'
  },
  {
    title: 'Results',
    dataIndex: 'results',
    key: 'results',
    render: (_, record) => (
      <Row type="flex" justify="start" gutter={10}>
        <Col>
          <Tooltip placement="top" title={'Download Results'}>
            <Button
              type="default"
              disabled={!record.output}
              shape="circle"
              icon="download"
              onClick={() =>
                dispatch(downloadStorageResults(record.output.path))
              }
            />
          </Tooltip>
        </Col>
      </Row>
    )
  }
];
