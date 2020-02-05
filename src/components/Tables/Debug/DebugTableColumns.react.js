import { Button, notification, Tag } from 'antd';
import Ellipsis from 'components/common/Ellipsis.react';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { sorter } from 'utils/string';

const debugTableColumns = ({ onDelete }) => [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.data.name, b.data.name),
    render: name => <Ellipsis text={name} />,
  },
  {
    title: 'Path',
    key: 'path',
    render: (_, record) => (
      <CopyToClipboard
        text={`${window.location.origin}/${record.data.path}`}
        onCopy={() =>
          notification.success({
            message: 'Copied to clipboard',
          })
        }>
        <Tag color={COLOR_TASK_STATUS.active}>
          {`${window.location.origin}/${record.data.path}`}
        </Tag>
      </CopyToClipboard>
    ),
  },
  {
    title: 'Stop',
    key: 'stop',
    render: (_, record) => (
      <Button type="danger" shape="circle" icon="delete" onClick={() => onDelete(record.name)} />
    ),
  },
];

export default debugTableColumns;
