import React, { useMemo } from 'react';
import Moment from 'react-moment';
import { Ellipsis } from 'components/common';
import PropTypes from 'prop-types';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip, Typography } from 'antd';
import humanizeDuration from 'humanize-duration';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { sorter } from 'utils/stringHelper';
import BaseTag from 'components/BaseTag';

const styleTagStatus = {
  fontSize: '11px',
  lineHeight: 'normal',
  paddingInline: '2%',
};

/* const getStatusFilter = () =>
  [
    PIPELINE_STATUS.ACTIVE,
    PIPELINE_STATUS.COMPLETED,
    PIPELINE_STATUS.FAILED,
  ].map(status => ({
    text: toUpperCaseFirstLetter(status),
    value: status,
  })); */

const Index = index => <Tag>{index}</Tag>;

export const TitleStatus = (record, isShowOneRow, isRemoveTitle) => (
  <>
    {!isRemoveTitle && (
      <Typography.Text style={{ paddingRight: '7px' }}>status</Typography.Text>
    )}
    {!isShowOneRow && record?.active > 0 && (
      <BaseTag
        style={styleTagStatus}
        isActiveLoader={false}
        status={PIPELINE_STATUS.ACTIVE}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.ACTIVE}>
        {record.active}
      </BaseTag>
    )}
    {!isShowOneRow && record?.completed > 0 && (
      <BaseTag
        style={styleTagStatus}
        status={PIPELINE_STATUS.COMPLETED}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.COMPLETED}>
        {record.completed}
      </BaseTag>
    )}

    {!isShowOneRow && record?.failed > 0 && (
      <BaseTag
        style={styleTagStatus}
        status={PIPELINE_STATUS.FAILED}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.FAILED}>
        {record.failed}
      </BaseTag>
    )}

    {!isShowOneRow && record?.stopped > 0 && (
      <BaseTag
        style={styleTagStatus}
        status={PIPELINE_STATUS.STOPPED}
        colorMap={COLOR_TASK_STATUS}
        title={PIPELINE_STATUS.STOPPED}>
        {record.stopped}
      </BaseTag>
    )}
  </>
);
const Status = status => (
  <BaseTag status={status} colorMap={COLOR_TASK_STATUS}>
    {status}
  </BaseTag>
);
const StartTime = startTime =>
  startTime ? (
    <Moment style={{ fontSize: '12px' }} format="DD/MM/YY HH:mm:ss">
      {+startTime}
    </Moment>
  ) : (
    '--/--/-- --:--:--'
  );
const sortByStartTime = (a, b) => sorter(a.startTime, b.startTime);

const Duration = (_, record) =>
  record.startTime ? (
    <Ellipsis ellipsis length={20} style={{ fontSize: '12px' }}>
      {humanizeDuration(
        record.endTime
          ? record.endTime - record.startTime
          : Date.now() - record.startTime,
        { maxDecimalPoints: 2 }
      )}
    </Ellipsis>
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

const getNodeIOColumns = (
  url,
  algorithmName,
  statusCount,
  isShowOneRow,
  modeSelect
) => [
  {
    title: 'index',
    dataIndex: ['index'],
    key: 'index',
    render: Index,
  },
  modeSelect
    ? {
        title: 'Task ID',
        dataIndex: ['taskId'],
        key: 'taskId',
      }
    : {},
  {
    title: 'Start Time',
    dataIndex: ['startTime'],
    key: 'startTime',
    sorter: sortByStartTime,
    render: StartTime,
  },

  {
    title: TitleStatus(statusCount, isShowOneRow),
    dataIndex: ['status'],
    key: 'status',
    onFilter: (value, record) => record.status === value,
    //   defaultFilteredValue:
    //    !isShowOneRow && statusCount.active > 0 ? [PIPELINE_STATUS.ACTIVE] : '',
    // filters: !isShowOneRow && getStatusFilter(),
    //  filterMultiple: !isShowOneRow,
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
  modeSelect
    ? {}
    : {
        title: 'Results',
        dataIndex: ['results'],
        key: 'results',
        render: (_, record) => (
          <Results url={url} record={record} algorithmName={algorithmName} />
        ),
      },
];

export default getNodeIOColumns;
