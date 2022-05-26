import React from 'react';
import { Tag } from 'antd';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/stringHelper';
import AlgorithmActions from './AlgorithmActions.react';
import AlgorithmBuildStats from './AlgorithmBuildStats.react';

const HotWorkers = minHotWorkers => <Tag>{minHotWorkers}</Tag>;
const Memory = mem => <Tag>{mem || 'No Memory Specified'}</Tag>;
const Cpu = cpu => <Tag>{cpu || 'No CPU Assigned'}</Tag>;
const Image = algorithmImage =>
  algorithmImage ? (
    <Ellipsis copyable text={algorithmImage} />
  ) : (
    <Tag>No Image</Tag>
  );
const Name = name => <Ellipsis text={name} />;
const BuildStats = builds => <AlgorithmBuildStats builds={builds} />;
const renderAction = (_, record) => <AlgorithmActions record={record} />;

const sortByName = (a, b) => sorter(a.name, b.name);
const filterByImage = (value, record) => record.algorithmImage.includes(value);
const sortByImage = (a, b) => sorter(a.algorithmImage, b.algorithmImage);
const sortByMinHotWorkers = (a, b) => sorter(a.workerImage, b.workerImage);

export default [
  {
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
    title: 'Builds Stats',
    dataIndex: ['buildStats'],
    key: 'builds',
    render: BuildStats,
  },
  {
    title: 'CPU',
    dataIndex: ['cpu'],
    key: 'cpu',
    render: Cpu,
  },
  {
    title: 'Mem',
    dataIndex: ['mem'],
    key: 'mem',
    width: '10%',
    render: Memory,
  },
  {
    title: 'Min Hot Workers',
    dataIndex: ['minHotWorkers'],
    key: 'minHotWorkers',
    sorter: sortByMinHotWorkers,
    render: HotWorkers,
  },
  {
    title: 'Action',
    dataIndex: ['action'],
    key: 'action',
    render: renderAction,
  },
];
