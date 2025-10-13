/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';
import Moment from 'react-moment';
import { Ellipsis } from 'components/common';
import PropTypes from 'prop-types';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip, Typography } from 'antd';
import humanizeDuration from 'humanize-duration';
import { taskStatuses as TASK_STATUS } from '@hkube/consts';
import { sorter } from 'utils/stringHelper';
import BaseTag from 'components/BaseTag';
import { fetchDownload } from '../../../../../keycloak/fetchDownload';

const styleTagStatus = {
  fontSize: '11px',
  lineHeight: 'normal',
  paddingInline: '2%',
};

const Index = index => <Tag>{index}</Tag>;

export const TitleStatus = (
  record,
  isShowOneRow,
  isRemoveTitle,
  isError = false
) => (
  <>
    {!isRemoveTitle && (
      <Typography.Text style={{ paddingRight: '7px' }}>status</Typography.Text>
    )}
    {!isShowOneRow &&
      Object.keys(record).map(
        keyStatus =>
          // eslint-disable-next-line react/destructuring-assignment
          record[keyStatus] > 0 &&
          keyStatus !== TASK_STATUS.SUCCEED && (
            <BaseTag
              style={styleTagStatus}
              isActiveLoader={false}
              isError={!!isError}
              status={
                keyStatus !== TASK_STATUS.FAILED_SCHEDULING
                  ? TASK_STATUS[keyStatus.toUpperCase()]
                  : TASK_STATUS.FAILED_SCHEDULING
              }
              colorMap={COLOR_TASK_STATUS}
              title={TASK_STATUS[keyStatus.toUpperCase()]}>
              {record[keyStatus]}
            </BaseTag>
          )
      )}
  </>
);
const Status = record => {
  const { status, error } = record;

  return (
    <BaseTag status={status} colorMap={COLOR_TASK_STATUS} isError={!!error}>
      {status}
    </BaseTag>
  );
};

const StartTime = startTime =>
  startTime ? (
    <Moment style={{ fontSize: '12px' }} format="DD/MM/YY HH:mm:ss">
      {+startTime}
    </Moment>
  ) : (
    '--/--/-- --:--:--'
  );
const sortByStartTime = (a, b) => sorter(a.startTime, b.startTime);

const Duration = (_, record) => {
  const { startTime, endTime } = record;
  return startTime ? (
    <Ellipsis ellipsis length={20} style={{ fontSize: '12px' }}>
      {humanizeDuration(
        endTime ? endTime - startTime : Date.now() - startTime,
        { maxDecimalPoints: 2 }
      )}
    </Ellipsis>
  ) : (
    <Tag style={{ width: '4ch', textAlign: 'center' }}>-</Tag>
  );
};

const Retries = retries => <Tag>{retries}</Tag>;

const Results = ({ record, url = null, algorithmName = '' }) => {
  const downloadNameFile = useMemo(
    () =>
      `${algorithmName}_${
        record.startTime ? new Date(+record.startTime).toISOString() : ''
      }`,
    [algorithmName, record.startTime]
  );

  return (
    <Tooltip placement="top" title="Download Results">
      <Button
        type="default"
        disabled={!record.output}
        shape="circle"
        icon={<DownloadOutlined />}
        onClick={() =>
          fetchDownload(
            `${url ?? ''}/storage/download/custom/${
              record.output && record.output.path
            }?ext=${record.downloadFileExt || ''}&namefile=${
              downloadNameFile || ''
            }`
          )
        }
      />
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
    title: 'Status', // TitleStatus(statusCount, isShowOneRow),
    // dataIndex: ['status'],
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
