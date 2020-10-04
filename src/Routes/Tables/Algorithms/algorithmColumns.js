import React from 'react';
import { Tag } from 'antd';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/string';
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

export default [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: Name,
  },
  {
    title: 'Algorithm Image',
    dataIndex: 'algorithmImage',
    key: 'algorithmImage',
    onFilter: (value, record) => record.algorithmImage.includes(value),
    sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage),
    render: Image,
  },
  {
    title: 'Builds Stats',
    dataIndex: 'builds',
    key: 'builds',
    render: BuildStats,
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    render: Cpu,
  },
  {
    title: 'Mem',
    dataIndex: 'mem',
    key: 'mem',
    width: '10%',
    render: Memory,
  },
  {
    title: 'Min Hot Workers',
    dataIndex: 'minHotWorkers',
    key: 'minHotWorkers',
    sorter: (a, b) => sorter(a.workerImage, b.workerImage),
    render: HotWorkers,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => <AlgorithmActions record={record} />,
  },
];
