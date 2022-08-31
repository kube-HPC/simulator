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
    width: '15%',
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
    width: '20%',
    title: 'Action',
    dataIndex: ['action'],
    key: 'action',
    render: renderAction,
  },
];
