import React from 'react';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/string';

const Name = name => <Ellipsis text={name} />;

export default [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: Name,
  },
];
