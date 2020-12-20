import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, notification, Tag, Tooltip } from 'antd';
import Ellipsis from 'components/common/Ellipsis.react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { sorter } from 'utils/string';

// drop the first slash if exists
const firstSlash = new RegExp('^/');

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
    render: (_, record) =>
      record.data ? (
        <CopyToClipboard
          text={`ws://${window.location.host}/${record.data.path.replace(
            firstSlash,
            ''
          )}`}
          onCopy={() =>
            notification.success({
              message: 'Copied to clipboard',
            })
          }>
          <Tag color={COLOR_TASK_STATUS.active}>
            {`ws://${window.location.host}/${record.data.path.replace(
              firstSlash,
              ''
            )}`}
          </Tag>
        </CopyToClipboard>
      ) : null,
  },
  {
    title: 'Stop',
    key: 'stop',
    render: (_, record) => (
      <Tooltip title="delete debug">
        <Button
          type="danger"
          icon="delete"
          onClick={() => onDelete(record.name)}
        />
      </Tooltip>
    ),
  },
];

export default debugTableColumns;
