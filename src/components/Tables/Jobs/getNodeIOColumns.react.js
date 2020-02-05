import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Button, Tag, Tooltip } from 'antd';
import { useActions } from 'hooks';
import humanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

const getStatusFilter = () =>
  [PIPELINE_STATUS.ACTIVE, PIPELINE_STATUS.COMPLETED, PIPELINE_STATUS.FAILED].map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status,
  }));

const Index = index => <Tag>{index}</Tag>;

const Status = status => (
  <Tag color={COLOR_TASK_STATUS[status]}>{status && toUpperCaseFirstLetter(status)}</Tag>
);

const Duration = (_, record) => (
  <Tag>
    {humanizeDuration(
      record.endTime ? record.endTime - record.startTime : Date.now() - record.startTime,
      {
        maxDecimalPoints: 2,
      },
    )}
  </Tag>
);

const Retries = retries => <Tag>{retries}</Tag>;

const Results = ({ record }) => {
  const { downloadStorageResults } = useActions();
  return (
    <Tooltip placement="top" title={'Download Results'}>
      <Button
        type="default"
        disabled={!record.output}
        shape="circle"
        icon="download"
        onClick={() => downloadStorageResults(record.output.path)}
      />
    </Tooltip>
  );
};

Results.propTypes = {
  record: PropTypes.object.isRequired,
};

const ResultsColumn = (_, record) => <Results record={record} />;

const getNodeIOColumns = () => [
  {
    title: 'index',
    dataIndex: 'index',
    key: 'index',
    render: Index,
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    filterMultiple: true,
    filters: getStatusFilter(),
    onFilter: (value, record) => record.status === value,
    render: Status,
  },
  {
    title: 'duration',
    dataIndex: 'duration',
    key: 'duration',
    render: Duration,
  },
  {
    title: 'retries',
    dataIndex: 'retries',
    key: 'retries',
    render: Retries,
  },
  {
    title: 'Results',
    dataIndex: 'results',
    key: 'results',
    render: ResultsColumn,
  },
];

export default getNodeIOColumns;
