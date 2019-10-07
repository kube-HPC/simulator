import React from 'react';

import { Button, Modal, Tooltip, Typography, Tag } from 'antd';
import { sorter } from 'utils/string';
import { DrawerEditorMD } from 'components';
import { Ellipsis, FlexBox, StatusTag } from 'components/common';

const { Paragraph, Title, Text } = Typography;

const deleteConfirmAction = (action, { name }) => {
  Modal.confirm({
    title: 'WARNING Deleting Algorithm',
    content: (
      <>
        Deleting algorithm will <Typography.Text strong>DELETE-ALL</Typography.Text> related
        pipelines and <Typography.Text strong>STOP-ALL</Typography.Text> executions.
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(name);
    }
  });
};

const getAlgorithmColumns = ({ onSubmit, onDelete, fetchReadme, getReadme }) => [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: name => <Ellipsis text={name} />
  },
  {
    title: 'Algorithm Image',
    dataIndex: 'algorithmImage',
    key: 'algorithmImage',
    onFilter: (value, record) => record.algorithmImage.includes(value),
    sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage),
    render: algorithmImage =>
      algorithmImage ? <Ellipsis copyable text={algorithmImage} /> : <Tag>No Image</Tag>
  },
  {
    title: 'Builds Stats',
    dataIndex: 'builds',
    key: 'builds',
    render: builds => {
      const statusCounter = builds
        .map(build => build.status)
        .reduce((acc, curr) => ({ ...acc, [curr]: 1 + (acc[curr] || 0) }), {});

      const entries = Object.entries(statusCounter);
      const hasStats = entries.length !== 0;

      return hasStats ? (
        <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
          {Object.entries(statusCounter).map(([status, count]) => (
            <FlexBox.Item key={status}>
              <StatusTag status={status} count={count} />
            </FlexBox.Item>
          ))}
        </FlexBox>
      ) : (
        <Tag>No Builds</Tag>
      );
    }
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    render: cpu => <Tag>{cpu}</Tag>
  },
  {
    title: 'Mem',
    dataIndex: 'mem',
    key: 'mem',
    width: '10%',
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
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => {
      const { builds, ...algorithm } = record;
      return (
        <FlexBox justify="start">
          <FlexBox.Item>
            <DrawerEditorMD
              title={
                <>
                  <Title level={2}>Update Algorithm</Title>
                  <Paragraph>
                    Edit algorithm properties and description, <Text strong>submit</Text> changes
                    with
                    <Text code>Update</Text> button.
                  </Paragraph>
                </>
              }
              opener={setVisible => (
                <Tooltip placement="top" title={'Update Algorithm'}>
                  <Button
                    shape="circle"
                    icon="edit"
                    onClick={() => {
                      fetchReadme(algorithm.name);
                      setVisible(prev => !prev);
                    }}
                  />
                </Tooltip>
              )}
              readmeDefault={getReadme(algorithm.name)}
              record={algorithm}
              onSubmit={onSubmit}
              submitText={'Update'}
            />
          </FlexBox.Item>
          <FlexBox.Item>
            <Tooltip title="Delete Algorithm">
              <Button
                type="dashed"
                shape="circle"
                icon="delete"
                onClick={() => deleteConfirmAction(onDelete, record)}
              />
            </Tooltip>
          </FlexBox.Item>
        </FlexBox>
      );
    }
  }
];

export default getAlgorithmColumns;
