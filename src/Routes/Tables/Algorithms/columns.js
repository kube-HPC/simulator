import React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import Moment from 'react-moment';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/stringHelper';
import { errorsCode } from '@hkube/consts';
import AlgorithmActions from './AlgorithmActions.react';
import AlgorithmBuildStats from './AlgorithmBuildStats.react';

const LastModified = timestamp => (
  <Tag>
    <Moment format="DD/MM/YY HH:mm:ss">{+timestamp}</Moment>
  </Tag>
);
const HotWorkers = minHotWorkers => <Tag>{minHotWorkers}</Tag>;
const Memory = mem => <Tag>{mem || 'No Memory Specified'}</Tag>;
const Cpu = cpu => <Tag>{cpu || 'No CPU Assigned'}</Tag>;
const Image = algorithmImage =>
  algorithmImage ? (
    <Ellipsis copyable text={algorithmImage} length="50" />
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
const sortByMinHotWorkers = (a, b) => sorter(a.workerImage, b.workerImage);
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
    title: 'Algorithm Image',
    dataIndex: ['algorithmImage'],
    key: 'algorithmImage',
    onFilter: filterByImage,
    sorter: sortByImage,
    render: Image,
  },
  {
    width: '10%',
    title: 'Builds Stats',
    dataIndex: ['buildStats'],
    key: 'builds',
    render: BuildStats,
  },
  {
    width: '10%',
    title: 'CPU',
    dataIndex: ['cpu'],
    key: 'cpu',
    render: Cpu,
  },
  {
    width: '10%',
    title: 'Mem',
    dataIndex: ['mem'],
    key: 'mem',
    render: Memory,
  },
  {
    width: '10%',
    title: 'Min Hot Workers',
    dataIndex: ['minHotWorkers'],
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
    width: '20%',
    title: 'Action',
    dataIndex: ['action'],
    key: 'action',
    render: renderAction,
  },
];
