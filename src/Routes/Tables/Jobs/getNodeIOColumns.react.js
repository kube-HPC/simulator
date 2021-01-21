import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Button, Tag, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import humanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';
import { selectors } from 'reducers';

const getStatusFilter = () =>
  [
    PIPELINE_STATUS.ACTIVE,
    PIPELINE_STATUS.COMPLETED,
    PIPELINE_STATUS.FAILED,
  ].map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status,
  }));

const Index = index => <Tag>{index}</Tag>;

const Status = status => (
  <Tag color={COLOR_TASK_STATUS[status]}>
    {status && toUpperCaseFirstLetter(status)}
  </Tag>
);

const Duration = (_, record) => (
  <Tag>
    {humanizeDuration(
      record.endTime
        ? record.endTime - record.startTime
        : Date.now() - record.startTime,
      {
        maxDecimalPoints: 2,
      }
    )}
  </Tag>
);

const Retries = retries => <Tag>{retries}</Tag>;

const Results = ({ record, url }) => (
  <Tooltip placement="top" title="Download Results">
    <a
      href={`${url}/storage/download/custom/${
        record.output && record.output.path
      }?ext=${record.downloadFileExt || ''}`}
      download>
      <Button
        type="default"
        disabled={!record.output}
        shape="circle"
        icon="download"
      />
    </a>
  </Tooltip>
);

Results.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

const ResultsColumn = (_, record, url) => <Results url={url} record={record} />;

const getNodeIOColumns = url => [
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
    render: (value, record) => ResultsColumn(value, record, url),
  },
];

const useNodeIOColumns = () => {
  const { socketURL } = useSelector(selectors.connection);
  return getNodeIOColumns(socketURL);
};

export default useNodeIOColumns;
