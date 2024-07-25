import React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Typography } from 'antd';
import Moment from 'react-moment';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/stringHelper';
import { copyToClipboard } from 'utils';
import { COLOR_PIPELINE_STATUS } from 'styles/colors';
import { pipelineStatuses as PIPELINE_STATUS, errorsCode } from '@hkube/consts';
import AlgorithmActions from './AlgorithmActions.react';
import AlgorithmBuildStats from './AlgorithmBuildStats.react';

const { FAILED } = PIPELINE_STATUS;
const LastModified = timestamp => (
  <Tag>
    <Moment format="DD/MM/YY HH:mm:ss">{+timestamp}</Moment>
  </Tag>
);
// eslint-disable-next-line react/prop-types, no-unused-vars
const HotWorkers = ({ minHotWorkers, isSatisfied }) => (
  <Tag
    title={!isSatisfied ? 'isSatisfied' : null}
    color={!isSatisfied ? COLOR_PIPELINE_STATUS[FAILED] : ''}>
    {minHotWorkers}
  </Tag>
);
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
const Name = (name, record) => (
  <Ellipsis>
    {name}{' '}
    {record?.errors?.includes(errorsCode.NOT_LAST_VERSION_ALGORITHM) && (
      <WarningOutlined
        title="Warning : Set algorithm's current version to the newly built"
        style={{ color: 'red', fontSize: '15px' }}
      />
    )}
  </Ellipsis>
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
    dataIndex: ['modified'],
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
