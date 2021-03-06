import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tag, Tooltip } from 'antd';
import humanizeDuration from 'humanize-duration';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { toUpperCaseFirstLetter } from 'utils/string';
import StatusTag from 'components/StatusTag';

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
  <StatusTag status={status} taskColorMap>
    {status}
  </StatusTag>
);

const Duration = (_, record) => (
  <Tag>
    {humanizeDuration(
      record.endTime
        ? record.endTime - record.startTime
        : Date.now() - record.startTime,
      { maxDecimalPoints: 2 }
    )}
  </Tag>
);

const Retries = retries => <Tag>{retries}</Tag>;

const Results = ({ record, url }) => (
  <Tooltip placement="top" title="Download Results">
    <a
      href={`${url ? `${url}/` : ''}storage/download/custom/${
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
  url: PropTypes.string,
};

Results.defaultProps = {
  url: null,
};

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
    render: (_, record) => <Results url={url} record={record} />,
  },
];

export default getNodeIOColumns;
