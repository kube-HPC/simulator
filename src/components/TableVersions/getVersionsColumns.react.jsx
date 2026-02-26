import React from 'react';
import {
  CheckOutlined,
  DeleteOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Typography, Tag, Input } from 'antd';
import dayjs from 'dayjs';
import { sorter } from 'utils/stringHelper';
import UserAvatar from 'components/UserAvatar';
import VersionNameEdit from './VersionNameEdit';
import FlexBox from '../common/FlexBox.react';
import Ellipsis from '../common/Ellipsis.react';

const { Text } = Typography;

const deleteConfirmAction = (modal, action, { name, version }, source) => {
  modal.confirm({
    title: `Deleting ${source} version`,
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
      action({ name, version });
    },
  });
};

const currentConfirmAction = (modal, action, { name, version }, source) => {
  modal.confirm({
    title: `Change ${source} version`,
    content: (
      <>
        Changing <Text code>{name}</Text> version.
      </>
    ),
    okText: 'Change Version',
    okType: 'primary',
    cancelText: 'Cancel',
    onOk() {
      action({ name, version });
    },
  });
};
//
const addConfirmAction = (modal, action, { name, version }, source) => {
  let newName = `${name}-copy`;
  const isAlgorithm = source === 'algorithms';
  const itemType = isAlgorithm ? 'algorithm' : 'pipeline';
  const itemTypeCapitalized = isAlgorithm ? 'Algorithm' : 'Pipeline';

  modal.confirm({
    title: `Save as new ${itemType}`,
    content: (
      <div style={{ marginTop: 16 }}>
        <Text>Enter new {itemType} name:</Text>
        <Input
          placeholder={`Enter ${itemType} name`}
          defaultValue={`${name}-copy`}
          onChange={e => {
            newName = e.target.value;
          }}
          style={{ marginTop: 8 }}
        />
      </div>
    ),
    okText: `Save ${itemTypeCapitalized}`,
    okType: 'primary',
    cancelText: 'Cancel',
    onOk: () => {
      if (!newName.trim()) {
        modal.error({
          title: 'Error',
          content: `Please enter a ${itemType} name.`,
        });
        return false; // stops modal from closing, no rejection error
      }

      const params = { name, version };
      if (isAlgorithm) {
        params.newAlgorithmName = newName.trim();
      } else {
        params.newPipelineName = newName.trim();
      }

      action(params);
      return true; // close modal normally
    },
  });
};
const Cpu = cpu => <Tag>{cpu || 'No CPU Assigned'}</Tag>;
const Mem = mem => <Tag>{mem || 'No Memory Specified'}</Tag>;
const MinHotWorkers = minHotWorkers => <Tag>{minHotWorkers}</Tag>;
const Type = type => <Tag>{type}</Tag>;
const Created = created =>
  created ? dayjs(+created).format('DD/MM/YY HH:mm:ss') : '--/--/-- --:--:--';

const getVersionsColumns = ({
  modal,
  onDelete,
  onApply,
  onSaveAs,
  currentVersion,
  source,
}) => {
  const AlgorithmVersion = version => {
    const isCurrentVersion = currentVersion === version;
    return version ? (
      <span>
        <Ellipsis
          copyable
          ellipsis={false}
          text={version}
          strong={isCurrentVersion}
        />
        {isCurrentVersion && (
          <CheckCircleOutlined
            style={{
              color: '#333', // Dark grey for the outline and check
              fontSize: 12, // Optional: adjust size if needed
            }}
          />
        )}
      </span>
    ) : (
      <Tag>No Image</Tag>
    );
  };

  const Action = (_, record) => {
    const { version } = record;
    const isCurrentVersion = currentVersion === version;

    const isAlgorithm = source === 'algorithms';
    const saveTooltip = isAlgorithm
      ? 'Save as new algorithm'
      : 'Save as new pipeline';

    return (
      <FlexBox justify="start">
        <FlexBox.Item>
          <Tooltip
            title={
              isCurrentVersion
                ? 'Cannot update current version'
                : 'Update to current version'
            }>
            <Button
              type="dashed"
              shape="circle"
              icon={<CheckOutlined />}
              disabled={isCurrentVersion}
              onClick={() =>
                currentConfirmAction(modal, onApply, record, source)
              }
            />
          </Tooltip>
        </FlexBox.Item>
        <FlexBox.Item>
          <Tooltip
            title={
              isCurrentVersion
                ? 'Cannot delete current version'
                : 'Remove version'
            }>
            <Button
              type="dashed"
              shape="circle"
              icon={<DeleteOutlined />}
              disabled={isCurrentVersion}
              onClick={() =>
                deleteConfirmAction(modal, onDelete, record, source)
              }
            />
          </Tooltip>
        </FlexBox.Item>
        <FlexBox.Item>
          <Tooltip title={saveTooltip}>
            <Button
              type={isCurrentVersion ? 'default' : 'dashed'}
              shape="circle"
              icon={<SaveOutlined />}
              style={isCurrentVersion ? { borderColor: '#ada4a4ff' } : {}}
              onClick={() => addConfirmAction(modal, onSaveAs, record, source)}
            />
          </Tooltip>
        </FlexBox.Item>
      </FlexBox>
    );
  };

  // Helper function to create onCell with tooltip for current version
  const createOnCell = record => {
    const isCurrentVersion = record.version === currentVersion;
    return {
      ...(isCurrentVersion && {
        title: 'Current version',
      }),
    };
  };

  if (source === 'algorithms') {
    return [
      {
        title: '',
        key: 'createdBy',
        render: record => (
          <UserAvatar
            username={record.createdBy}
            titleToolTip={`created by ${record.createdBy}`}
            size={20}
          />
        ),
        onCell: createOnCell,
      },
      {
        title: 'Version Name',
        dataIndex: ['versionAlias'],
        key: 'versionAlias',
        onFilter: (value, record) => record.version.includes(value),
        sorter: (a, b) => sorter(a.versionAlias, b.versionAlias),
        render: (_, record) => {
          if (!record) return <span />;
          return <VersionNameEdit record={record} source={source} />;
        },
        onCell: createOnCell,
      },
      {
        title: 'Version',
        dataIndex: ['version'],
        key: 'version',
        onFilter: (value, record) => record.version.includes(value),
        sorter: (a, b) => sorter(a.version, b.version),
        render: AlgorithmVersion,
        onCell: createOnCell,
      },
      {
        title: 'Image',
        dataIndex: ['algorithm', 'algorithmImage'],
        key: 'algorithm.algorithmImage',
        onFilter: (value, record) =>
          record.algorithm.algorithmImage.includes(value),
        sorter: (a, b) =>
          sorter(a.algorithm.algorithmImage, b.algorithm.algorithmImage),
        onCell: createOnCell,
      },
      {
        title: 'Created',
        dataIndex: ['created'],
        key: 'created',
        sorter: (a, b) => sorter(a.created, b.created),
        render: Created,
        onCell: createOnCell,
      },
      {
        title: 'CPU',
        dataIndex: ['algorithm', 'cpu'],
        key: 'algorithm.cpu',
        sorter: (a, b) => sorter(a.algorithm.cpu, b.algorithm.cpu),
        render: Cpu,
        onCell: createOnCell,
      },
      {
        title: 'Mem',
        dataIndex: ['algorithm', 'mem'],
        key: 'algorithm.mem',
        sorter: (a, b) => sorter(a.algorithm.mem, b.algorithm.mem),
        render: Mem,
        onCell: createOnCell,
      },
      {
        title: 'Min Hot',
        dataIndex: ['algorithm', 'minHotWorkers'],
        key: 'algorithm.minHotWorkers',
        sorter: (a, b) =>
          sorter(a.algorithm.minHotWorkers, b.algorithm.minHotWorkers),
        render: MinHotWorkers,
        onCell: createOnCell,
      },
      {
        title: 'Type',
        dataIndex: ['algorithm', 'type'],
        key: 'algorithm.type',
        sorter: (a, b) => sorter(a.algorithm.type, b.algorithm.type),
        render: Type,
        onCell: createOnCell,
      },
      {
        title: 'Action',
        dataIndex: ['action'],
        key: 'action',
        width: 'fit-content',
        render: Action,
        onCell: createOnCell,
      },
    ];
  }

  // if this not algorithms return pipelines cols
  return [
    {
      title: '',
      key: 'createdBy',
      render: record => (
        <UserAvatar
          username={record.createdBy}
          titleToolTip={`created by ${record.createdBy}`}
          size={20}
        />
      ),
      onCell: createOnCell,
    },

    {
      title: 'Version Name',
      dataIndex: ['versionAlias'],
      key: 'versionAlias',
      onFilter: (value, record) => record.version.includes(value),
      sorter: (a, b) => sorter(a.versionAlias, b.versionAlias),
      render: (_, record) => {
        if (!record) return <span />;
        return <VersionNameEdit record={record} source={source} />;
      },
      onCell: createOnCell,
    },
    {
      title: 'Version',
      dataIndex: ['version'],
      key: 'version',
      onFilter: (value, record) => record.version.includes(value),
      sorter: (a, b) => sorter(a.version, b.version),
      render: AlgorithmVersion,
      onCell: createOnCell,
    },

    {
      title: 'Created',
      dataIndex: ['created'],
      key: 'created',
      sorter: (a, b) => sorter(a.created, b.created),
      render: Created,
      onCell: createOnCell,
    },

    {
      title: 'Action',
      dataIndex: ['action'],
      key: 'action',
      width: 'fit-content',
      render: Action,
      onCell: createOnCell,
    },
  ];
};

export default getVersionsColumns;
