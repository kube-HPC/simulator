import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import humanizeDuration from 'humanize-duration';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { toUpperCaseFirstLetter } from 'utils/stringHelper';
import BaseTag from 'components/BaseTag';

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
  <BaseTag status={status} colorMap={COLOR_TASK_STATUS}>
    {status}
  </BaseTag>
);

const Duration = (_, record) =>
  record.startTime ? (
    <Tag>
      {humanizeDuration(
        record.endTime
          ? record.endTime - record.startTime
          : Date.now() - record.startTime,
        { maxDecimalPoints: 2 }
      )}
    </Tag>
  ) : (
    <Tag style={{ width: '4ch', textAlign: 'center' }}>-</Tag>
  );

const Retries = retries => <Tag>{retries}</Tag>;

const Results = ({ record, url, algorithmName }) => {
  const downloadNameFile = useMemo(
    () => `${algorithmName}_${new Date(record.startTime).toISOString()}`,
    [algorithmName, record.startTime]
  );

  return (
    <Tooltip placement="top" title="Download Results">
      <a
        href={`${url ? `${url}/` : ''}storage/download/custom/${
          record.output && record.output.path
        }?ext=${record.downloadFileExt || ''}&namefile=${
          downloadNameFile || ''
        }`}
        download>
        <Button
          type="default"
          disabled={!record.output}
          shape="circle"
          icon={<DownloadOutlined />}
        />
      </a>
    </Tooltip>
  );
};

Results.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
  algorithmName: PropTypes.string,
  url: PropTypes.string,
};

Results.defaultProps = {
  algorithmName: '',
  url: null,
};

const getNodeIOColumns = (url, algorithmName) => [
  {
    title: 'index',
    dataIndex: ['index'],
    key: 'index',
    render: Index,
  },
  {
    title: 'status',
    dataIndex: ['status'],
    key: 'status',
    filterMultiple: true,
    filters: getStatusFilter(),
    onFilter: (value, record) => record.status === value,
    render: Status,
  },
  {
    title: 'duration',
    dataIndex: ['duration'],
    key: 'duration',
    render: Duration,
  },
  {
    title: 'retries',
    dataIndex: ['retries'],
    key: 'retries',
    render: Retries,
  },
  {
    title: 'Results',
    dataIndex: ['results'],
    key: 'results',
    render: (_, record) => (
      <Results url={url} record={record} algorithmName={algorithmName} />
    ),
  },
];

export default getNodeIOColumns;
