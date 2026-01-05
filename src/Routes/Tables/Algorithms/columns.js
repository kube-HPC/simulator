/* eslint-disable react/prop-types */
import React from 'react';
import { WarningOutlined, SettingOutlined } from '@ant-design/icons';
import { ReactComponent as IconNoGpu } from 'images/nogpu.svg';
import { ReactComponent as IconNoCpu } from 'images/nocpu.svg';
import { ReactComponent as IconNoMem } from 'images/nomem.svg';
import { Tag, Tooltip, Typography } from 'antd';
import { sorter } from 'utils/stringHelper';
import { copyToClipboard } from 'utils';
import { errorsCode } from '@hkube/consts';
import AuditTrailAvatar from '../../../components/AuditTrailAvatar';
import AlgorithmActions from './AlgorithmActions.react';
import AlgorithmBuildStats from './AlgorithmBuildStats.react';
import LastModified from './LastModified';

const HotWorkers = ({ value }) => <Tag>{value}</Tag>;
const Cpu = ({ value }) =>
  value ? (
    <Tag>{value}</Tag>
  ) : (
    <Tooltip title="No CPU Assigned">
      <IconNoCpu width={34} />
    </Tooltip>
  );

const Memory = ({ value }) =>
  value ? (
    <Tag>{value}</Tag>
  ) : (
    <Tooltip title="No Memory Specified">
      <IconNoMem width={34} />
    </Tooltip>
  );

const Gpu = ({ value }) =>
  value ? (
    <Tag>{value}</Tag>
  ) : (
    <Tooltip title="No GPU Assigned">
      <IconNoGpu width={34} />
    </Tooltip>
  );

const Image = ({ value }) =>
  value ? (
    <Tooltip title={value}>
      <Typography.Text onClick={() => copyToClipboard(value)}>
        {value}
      </Typography.Text>
    </Tooltip>
  ) : (
    <Tag>No Image</Tag>
  );

const Name = ({ value, data }) =>
  data?.unscheduledReason ? (
    <Tooltip title={data.unscheduledReason}>
      <Typography style={{ color: 'red' }}>{value}</Typography>
    </Tooltip>
  ) : (
    <div>
      <Tooltip title="Click to copy">
        <Typography.Text onClick={() => copyToClipboard(value)}>
          {value}
        </Typography.Text>
      </Tooltip>
      {data?.errors?.includes(errorsCode.NOT_LAST_VERSION_ALGORITHM) && (
        <Tooltip title="Warning: Set algorithm's current version to the newly built">
          <WarningOutlined
            style={{ color: 'red', fontSize: 12, marginLeft: 5 }}
          />
        </Tooltip>
      )}
      {data?.options?.devMode && (
        <Tooltip title={data?.options?.devFolder}>
          <SettingOutlined
            style={{ color: 'orange', fontSize: 12, marginLeft: 5 }}
          />
        </Tooltip>
      )}
    </div>
  );

export default [
  {
    headerName: '',
    field: 'auditTrail',
    flex: 0.4,
    width: 60,
    sortable: false,
    filter: false,
    cellRenderer: ({ value }) => <AuditTrailAvatar auditTrail={value} />,
    suppressMenu: true,
  },
  {
    headerName: 'Algorithm Name',
    field: 'name',
    flex: 2,
    sortable: true,
    unSortIcon: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: Name,
    isPinning: true,
  },
  {
    headerName: 'Algorithm Image',
    field: 'algorithmImage',
    flex: 3,
    sortable: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: Image,
  },
  {
    headerName: 'Builds Stats',
    flex: 0.7,
    field: 'buildStats',
    cellRenderer: ({ value }) => <AlgorithmBuildStats builds={value} />,
  },
  {
    headerName: 'CPU',
    flex: 0.5,
    field: 'cpu',
    cellRenderer: Cpu,
  },
  {
    headerName: 'GPU',
    flex: 0.5,
    field: 'gpu',
    cellRenderer: Gpu,
  },
  {
    headerName: 'Mem',
    flex: 0.7,
    field: 'mem',
    cellRenderer: Memory,
  },
  {
    headerName: 'Min Hot Workers',
    flex: 0.8,
    field: 'minHotWorkers',
    sortable: true,
    unSortIcon: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: HotWorkers,
  },
  {
    headerName: 'Last Modified',
    flex: 1.2,
    field: 'modified',
    sortable: true,
    unSortIcon: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: ({ data }) => (
      <LastModified auditTrail={data.auditTrail} modified={data.modified} />
    ),
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    flex: 1.5,
    sortable: false,
    cellRenderer: ({ data }) => <AlgorithmActions record={data} />,
    cellStyle: { textAlign: 'center' },
    suppressMenu: true,
    isPinning: true,
  },
];
