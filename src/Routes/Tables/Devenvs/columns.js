import React from 'react';
import Text from 'antd/lib/typography/Text';
import { Ellipsis } from 'components/common';
import { sorter } from 'utils/string';
import DevenvsActions from './DevenvsActions.react';

const link = url => (
  <div>
    <Text underline>
      <a href={`${url}`} target="_blank" rel="nofollow noopener noreferrer">
        {url}
      </a>
    </Text>
  </div>
);

const Name = name => <Ellipsis text={name} />;
const Type = type => <Ellipsis text={type} />;
const Url = url => link(url);
const Status = status => <Ellipsis text={status} />;
const renderAction = (_, record) => <DevenvsActions record={record} />;

const sortByName = (a, b) => sorter(a.name, b.name);

export default [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: sortByName,
    render: Name,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: Type,
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    render: Url,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: Status,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: renderAction,
  },
];
