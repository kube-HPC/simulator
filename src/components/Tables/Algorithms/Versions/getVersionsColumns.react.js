import React from 'react';

import { Button, Modal, Tooltip, Typography, Tag } from 'antd';
import { sorter } from 'utils/string';
import { Ellipsis, FlexBox } from 'components/common';

const { Text } = Typography;

const deleteConfirmAction = (action, { name, algorithmImage }) => {
  Modal.confirm({
    title: 'Deleting Algorithm Version',
    content: (
      <>
        Deleting <Text code>{name}</Text> version.
      </>
    ),
    okText: 'Delete Version',
    okType: 'danger',
    iconType: 'warning',
    cancelText: 'Cancel',
    onOk() {
      action({ name, algorithmImage });
    }
  });
};

const currentConfirmAction = (action, { name, algorithmImage }) => {
  Modal.confirm({
    title: 'Change Algorithm Version',
    content: (
      <>
        Changing <Text code>{name}</Text> version.
      </>
    ),
    okText: 'Change Version',
    okType: 'primary',
    cancelText: 'Cancel',
    onOk() {
      action({ name, image: algorithmImage });
    }
  });
};

const getVersionsColumns = ({ onDelete, onVersionApply, currentVersion }) => [
  {
    title: 'Algorithm Version',
    dataIndex: 'algorithmImage',
    key: 'algorithmImage',
    onFilter: (value, record) => record.algorithmImage.includes(value),
    sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage),
    render: algorithmImage => {
      const isCurrentVersion = currentVersion === algorithmImage;
      return algorithmImage ? (
        <Ellipsis
          copyable
          text={algorithmImage}
          underline={isCurrentVersion}
          strong={isCurrentVersion}
        />
      ) : (
          <Tag>No Image</Tag>
        );
    }
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    render: cpu => <Tag>{cpu || 'No CPU Assigned'}</Tag>
  },
  {
    title: 'Mem',
    dataIndex: 'mem',
    key: 'mem',
    render: mem => <Tag>{mem || 'No Memory Specified'}</Tag>
  },
  {
    title: 'Min Hot Workers',
    dataIndex: 'minHotWorkers',
    key: 'minHotWorkers',
    sorter: (a, b) => sorter(a.workerImage, b.workerImage),
    render: minHotWorkers => <Tag>{minHotWorkers}</Tag>
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => sorter(a.type, b.type),
    render: type => <Tag>{type}</Tag>
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => {
      const { algorithmImage } = record;
      const isCurrentVersion = currentVersion === algorithmImage;

      return (
        <FlexBox justify="start">
          <FlexBox.Item>
            <Tooltip title={`${isCurrentVersion ? 'Already on' : 'Update to'} current version`}>
              <Button
                type={isCurrentVersion ? 'primary' : 'dashed'}
                shape="circle"
                icon="check"
                disabled={isCurrentVersion}
                onClick={() => currentConfirmAction(onVersionApply, record)}
              />
            </Tooltip>
          </FlexBox.Item>
          <FlexBox.Item>
            <Tooltip title={`${isCurrentVersion ? `Can't remove used` : `Remove current`} version`}>
              <Button
                type="dashed"
                shape="circle"
                icon="delete"
                disabled={isCurrentVersion}
                onClick={() => deleteConfirmAction(onDelete, record)}
              />
            </Tooltip>
          </FlexBox.Item>
        </FlexBox>
      );
    }
  }
];

export default getVersionsColumns;
