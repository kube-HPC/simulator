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
      <IconNoMem />
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

const numericComparator = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return Number(a) - Number(b);
};

/**
 * Comparator for memory values with unit parsing (Mi, Gi, Ki, Ti)
 * Converts all values to bytes for accurate comparison
 * Null/undefined values are sorted to the end
 */
const memoryComparator = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const parseMemory = mem => {
    if (!mem) return 0;
    const str = String(mem).trim();
    const num = parseFloat(str);

    if (str.includes('Gi') || str.includes('G')) {
      return num * 1024 * 1024 * 1024;
    } else if (str.includes('Mi') || str.includes('M')) {
      return num * 1024 * 1024;
    } else if (str.includes('Ki') || str.includes('K')) {
      return num * 1024;
    } else if (str.includes('Ti') || str.includes('T')) {
      return num * 1024 * 1024 * 1024 * 1024;
    }
    return num;
  };

  return parseMemory(a) - parseMemory(b);
};
/**
 * Comparator for build stats sorting
 * DESC: Prioritizes failed builds (highest count first)
 * ASC: Prioritizes completed builds (highest count first)
 */
const buildStatsComparator = (a, b, isDescending) => {
  // Handle null/undefined cases
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const aTotal = a.total || 0;
  const bTotal = b.total || 0;

  // Handle no builds cases
  if (aTotal === 0 && bTotal === 0) return 0;
  if (aTotal === 0) return 1;
  if (bTotal === 0) return -1;

  const aCount = isDescending ? a.failed || 0 : a.completed || 0;
  const bCount = isDescending ? b.failed || 0 : b.completed || 0;

  return bCount - aCount;
};

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
    comparator: sorter,
    cellRenderer: Name,
    isPinning: true,
  },
  {
    headerName: 'Algorithm Image',
    field: 'algorithmImage',
    flex: 3,
    sortable: true,
    comparator: sorter,
    cellRenderer: Image,
  },
  {
    headerName: 'Builds Stats',
    flex: 0.7,
    sortable: true,
    unSortIcon: true,
    field: 'buildStats',
    comparator: buildStatsComparator,
    cellRenderer: ({ value }) => <AlgorithmBuildStats builds={value} />,
  },
  {
    headerName: 'CPU',
    flex: 0.6,
    field: 'cpu',
    sortable: true,
    unSortIcon: true,
    comparator: numericComparator,
    cellRenderer: Cpu,
  },
  {
    headerName: 'GPU',
    flex: 0.6,
    field: 'gpu',
    sortable: true,
    unSortIcon: true,
    comparator: numericComparator,
    cellRenderer: Gpu,
  },
  {
    headerName: 'Mem',
    flex: 0.7,
    field: 'mem',
    sortable: true,
    unSortIcon: true,
    comparator: memoryComparator,
    cellRenderer: Memory,
  },
  {
    headerName: 'Min Hot Workers',
    flex: 0.8,
    field: 'minHotWorkers',
    sortable: true,
    unSortIcon: true,
    comparator: sorter,
    cellRenderer: HotWorkers,
  },
  {
    headerName: 'Last Modified',
    flex: 1.2,
    field: 'modified',
    sortable: true,
    unSortIcon: true,
    comparator: sorter,
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
