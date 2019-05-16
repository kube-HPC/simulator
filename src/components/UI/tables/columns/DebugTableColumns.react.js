import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon, notification, Tag, Button } from 'antd';
import { STATUS } from 'constants/colors';
import { sorter } from 'utils/string';

const jobsTableColumns = props => [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    width: '40%',
    sorter: (a, b) => sorter(a.data.name, b.data.name)
  },
  {
    title: 'Path',
    key: 'path',
    width: '40%',
    render: (_, record) => (
      <CopyToClipboard
        text={`${window.location.origin}/${record.data.path}`}
        onCopy={() =>
          notification.success({
            message: 'Copied to clipboard'
          })
        }
      >
        <Tag color={STATUS.active}>
          <Icon
            type="right"
            style={{
              color: 'rgba(255,255,255,.75)',
              marginRight: '10px'
            }}
          />
          {`${window.location.origin}/${record.data.path}`}
        </Tag>
      </CopyToClipboard>
    )
  },
  {
    title: 'Stop',
    key: 'stop',
    width: '20%',
    render: (_, record) => (
      <Button
        type="danger"
        shape="circle"
        icon="close"
        onClick={() => props.deleteAlgorithm(record.name)}
      />
    )
  }
];

export default jobsTableColumns;
