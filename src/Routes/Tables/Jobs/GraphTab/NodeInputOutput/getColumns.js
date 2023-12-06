import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip, Typography } from 'antd';
import humanizeDuration from 'humanize-duration';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { toUpperCaseFirstLetter } from 'utils/stringHelper';
import BaseTag from 'components/BaseTag';

const styleTagStatus = {
  fontSize: '11px',
  lineHeight: 'normal',
  paddingInline: '2%',
};

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

const TitleStatus = (record, isShowOneRow) => (
  <>
    <Typography.Text style={{ paddingRight: '7px' }}>status</Typography.Text>
    {!isShowOneRow && record.active > 0 && (
      <BaseTag
        style={styleTagStatus}
        isActiveLoader={false}
        status={PIPELINE_STATUS.ACTIVE}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.ACTIVE}>
        {record.active}
      </BaseTag>
    )}
    {!isShowOneRow && record.completed > 0 && (
      <BaseTag
        style={styleTagStatus}
        status={PIPELINE_STATUS.COMPLETED}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.COMPLETED}>
        {record.completed}
      </BaseTag>
    )}

    {!isShowOneRow && record.failed > 0 && (
      <BaseTag
        style={styleTagStatus}
        status={PIPELINE_STATUS.FAILED}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.FAILED}>
        {record.failed}
      </BaseTag>
    )}
  </>
);
const Status = status => (
  <BaseTag status={status} colorMap={COLOR_TASK_STATUS}>
    {status}
  </BaseTag>
);

const Duration = (_, record) =>
  record.startTime ? (
    <Tag style={{ fontSize: '10px' }}>
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
    () =>
      `${algorithmName}_${
        record.startTime ? new Date(+record.startTime).toISOString() : ''
      }`,
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

const getNodeIOColumns = (url, algorithmName, statusCount, isShowOneRow) => [
  {
    width: `5%`,
    title: 'index',
    dataIndex: ['index'],
    key: 'index',
    render: Index,
  },
  {
    width: `55%`,
    title: TitleStatus(statusCount, isShowOneRow),
    dataIndex: ['status'],
    key: 'status',
    filterMultiple: !isShowOneRow,
    filters: !isShowOneRow && getStatusFilter(),
    onFilter: (value, record) => record.status === value,
    defaultFilteredValue:
      !isShowOneRow && statusCount.active > 0 ? [PIPELINE_STATUS.ACTIVE] : '',
    render: Status,
  },
  {
    width: `30%`,
    title: 'duration',
    dataIndex: ['duration'],
    key: 'duration',
    render: Duration,
  },
  {
    width: `5%`,
    title: 'retries',
    dataIndex: ['retries'],
    key: 'retries',
    render: Retries,
  },
  {
    width: `5%`,
    title: 'Results',
    dataIndex: ['results'],
    key: 'results',
    render: (_, record) => (
      <Results url={url} record={record} algorithmName={algorithmName} />
    ),
  },
];

export default getNodeIOColumns;
