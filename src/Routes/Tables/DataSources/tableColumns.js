import React from 'react';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/string';

const Name = name => <Ellipsis text={name} />;
const FilesCount = count => <Ellipsis text={count} />;
const VersionId = id => <Ellipsis text={id} />;
const AvgFileSize = avgFileSize => <Ellipsis text={avgFileSize} />;
const TotalSize = totalSize => <Ellipsis text={totalSize} />;
const FileTypes = types => <Ellipsis text={types.join(', ')} />;

// id: string;
// name: string;
// versionDescription: string;
// filesCount: number;
// avgFileSize: string;
// totalSize: number;
// fileTypes: string[];
export default [
  {
    title: 'Datasource Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: Name,
  },
  {
    title: '#files',
    dataIndex: 'filesCount',
    key: 'filesCount',
    sorter: (a, b) => sorter(a.name, b.name),
    render: FilesCount,
  },
  {
    title: 'version id',
    dataIndex: 'id',
    key: 'id',
    render: VersionId,
  },
  {
    title: 'avg file size',
    dataIndex: 'avgFileSize',
    key: 'avgFileSize',
    render: AvgFileSize,
  },
  {
    title: 'total size',
    dataIndex: 'totalSize',
    key: 'totalSize',
    render: TotalSize,
  },
  {
    title: 'file types',
    dataIndex: 'fileTypes',
    key: 'fileTypes',
    render: FileTypes,
  },
];
