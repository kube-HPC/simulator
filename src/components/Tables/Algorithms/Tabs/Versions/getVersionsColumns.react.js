import React from 'react';
import { Button, Modal, Tooltip, Typography, Tag } from 'antd';
import Moment from 'react-moment';
import { sorter } from 'utils/string';
import { Ellipsis, FlexBox } from 'components/common';
import { COLOR_PIPELINE_STATUS } from 'styles';
const { Text } = Typography;

const deleteConfirmAction = (action, { id, name }) => {
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
      action({ id, name });
    },
  });
};

const currentConfirmAction = (action, { id, name }) => {
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
      action({ id, name });
    },
  });
};

const Cpu = cpu => <Tag>{cpu || 'No CPU Assigned'}</Tag>;
const Mem = mem => <Tag>{mem || 'No Memory Specified'}</Tag>;
const MinHotWorkers = minHotWorkers => <Tag>{minHotWorkers}</Tag>;
const Type = type => <Tag>{type}</Tag>;
const Created = created => <Moment format="DD/MM/YY HH:mm:ss">{created}</Moment>;

const getVersionsColumns = ({ onDelete, onApply, currentVersion }) => {
  const AlgorithmVersion = versionId => {
    const isCurrentVersion = currentVersion === versionId;
    return versionId ? (
      <Ellipsis copyable ellipsis={false} text={versionId} strong={isCurrentVersion} />
    ) : (
        <Tag>No Image</Tag>
      );
  };

  const Action = (_, record) => {
    const { id } = record;
    const isCurrentVersion = currentVersion === id;

    return isCurrentVersion ? (
      <Tag color={COLOR_PIPELINE_STATUS.ready}>Current Version</Tag>
    ) : (
        <FlexBox justify="start">
          <FlexBox.Item>
            <Tooltip title={`${isCurrentVersion ? 'Already on' : 'Update to'} current version`}>
              <Button
                type={isCurrentVersion ? 'primary' : 'dashed'}
                shape="circle"
                icon="check"
                disabled={isCurrentVersion}
                onClick={() => currentConfirmAction(onApply, record)}
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
  };

  return [
    {
      title: 'Version',
      dataIndex: 'id',
      key: 'id',
      onFilter: (value, record) => record.id.includes(value),
      sorter: (a, b) => sorter(a.id, b.id),
      render: AlgorithmVersion,
    },
    {
      title: 'Image',
      dataIndex: 'algorithm.algorithmImage',
      key: 'algorithm.algorithmImage',
      onFilter: (value, record) => record.algorithm.algorithmImage.includes(value),
      sorter: (a, b) => sorter(a.algorithm.algorithmImage, b.algorithm.algorithmImage),
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      sorter: (a, b) => sorter(a.created, b.created),
      render: Created,
    },
    {
      title: 'CPU',
      dataIndex: 'algorithm.cpu',
      key: 'algorithm.cpu',
      sorter: (a, b) => sorter(a.algorithm.cpu, b.algorithm.cpu),
      render: Cpu,
    },
    {
      title: 'Mem',
      dataIndex: 'algorithm.mem',
      key: 'algorithm.mem',
      sorter: (a, b) => sorter(a.algorithm.mem, b.algorithm.mem),
      render: Mem,
    },
    {
      title: 'Min Hot',
      dataIndex: 'algorithm.minHotWorkers',
      key: 'algorithm.minHotWorkers',
      sorter: (a, b) => sorter(a.algorithm.minHotWorkers, b.algorithm.minHotWorkers),
      render: MinHotWorkers,
    },
    {
      title: 'Type',
      dataIndex: 'algorithm.type',
      key: 'algorithm.type',
      sorter: (a, b) => sorter(a.algorithm.type, b.algorithm.type),
      render: Type,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: Action,
    },
  ];
};

export default getVersionsColumns;
