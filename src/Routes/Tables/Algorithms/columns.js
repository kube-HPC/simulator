import React from 'react';
import { WarningOutlined, SettingOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Typography } from 'antd';
import { sorter } from 'utils/stringHelper';
import { copyToClipboard } from 'utils';
import { errorsCode } from '@hkube/consts';
import AuditTrailAvatar from '../../../components/AuditTrailAvatar';
import AlgorithmActions from './AlgorithmActions.react';
import AlgorithmBuildStats from './AlgorithmBuildStats.react';
import LastModified from './LastModified';

// eslint-disable-next-line react/prop-types, no-unused-vars
const HotWorkers = ({ minHotWorkers }) => <Tag>{minHotWorkers}</Tag>;
const Memory = mem => <Tag>{mem || 'No Memory Specified'}</Tag>;
const Cpu = cpu => <Tag>{cpu || 'No CPU Assigned'}</Tag>;

const Image = algorithmImage =>
  algorithmImage ? (
    <Tooltip title={algorithmImage}>
      <Typography.Text onClick={() => copyToClipboard(algorithmImage)}>
        {algorithmImage}
      </Typography.Text>
    </Tooltip>
  ) : (
    <Tag>No Image</Tag>
  );

const Name = (name, record) =>
  record?.unscheduledReason ? (
    <Tooltip title={record?.unscheduledReason}>
      <Typography style={{ color: 'red' }}>{name}</Typography>
    </Tooltip>
  ) : (
    <div>
      <Tooltip title="Click to Copy">
        <Typography.Text onClick={() => copyToClipboard(name)}>
          {name}
        </Typography.Text>
      </Tooltip>
      <span>
        {record?.errors?.includes(errorsCode.NOT_LAST_VERSION_ALGORITHM) && (
          <Tooltip title="Warning : Set algorithm's current version to the newly built">
            <WarningOutlined
              style={{ color: 'red', fontSize: '12px', marginLeft: '5px' }}
            />
          </Tooltip>
        )}
        {record?.options?.devMode && (
          <Tooltip title={record?.options?.devFolder}>
            <SettingOutlined
              style={{ color: 'orange', fontSize: '12px', marginLeft: '5px' }}
            />{' '}
          </Tooltip>
        )}
      </span>
    </div>
  );

const BuildStats = builds => <AlgorithmBuildStats builds={builds} />;
const renderAction = (_, record) => <AlgorithmActions record={record} />;

const sortByName = (a, b) => sorter(a.name, b.name);
const filterByImage = (value, record) => record.algorithmImage.includes(value);
const sortByImage = (a, b) => sorter(a.algorithmImage, b.algorithmImage);
const sortByMinHotWorkers = (a, b) => sorter(a.minHotWorkers, b.minHotWorkers);
const sortByLastModified = (a, b) => sorter(a.modified, b.modified);

export default [
  {
    title: ``,
    dataIndex: [`auditTrail`],
    key: `auditTrail`,
    width: `2%`,
    render: auditTrail => <AuditTrailAvatar auditTrail={auditTrail} />,
  },
  {
    width: '12%',
    title: 'Algorithm Name',
    dataIndex: ['name'],
    key: 'name',
    sorter: sortByName,
    render: Name,
  },
  {
    width: '40%',
    title: 'Algorithm Image',
    dataIndex: ['algorithmImage'],
    key: 'algorithmImage',
    onFilter: filterByImage,
    sorter: sortByImage,
    render: Image,
  },
  {
    width: '7%',
    title: 'Builds Stats',
    dataIndex: ['buildStats'],
    key: 'builds',
    render: BuildStats,
  },
  {
    width: '5%',
    title: 'CPU',
    dataIndex: ['cpu'],
    key: 'cpu',
    render: Cpu,
  },
  {
    width: '5%',
    title: 'Mem',
    dataIndex: ['mem'],
    key: 'mem',
    render: Memory,
  },
  {
    width: '7%',
    title: 'Min Hot Workers',
    key: 'minHotWorkers',
    sorter: sortByMinHotWorkers,
    render: HotWorkers,
  },
  {
    width: '10%',
    title: 'Last modified',
    //  dataIndex: ['modified'],
    key: 'modified',
    sorter: sortByLastModified,
    render: LastModified,
  },
  {
    width: '14%',
    title: 'Action',
    dataIndex: ['action'],
    key: 'action',
    render: renderAction,
  },
];
