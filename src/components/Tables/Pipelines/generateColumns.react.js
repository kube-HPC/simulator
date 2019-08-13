import React from 'react';
import { Button, Col, Modal, Icon, Tooltip, Typography } from 'antd';

import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { stringify, sorter } from 'utils/string';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import SwitchCron from 'components/Tables/Pipelines/SwitchCron.react';
import Ellipsis from 'components/common/Ellipsis.react';
import StatusTag from 'components/common/StatusTag.react';
import DrawerEditorMD from 'components/Drawer/DrawerEditorMD.react';
import { FlexRow } from 'components/common';

const deleteConfirmAction = (action, record) => {
  Modal.confirm({
    title: 'WARNING Deleting Pipeline',
    content: (
      <>
        Are you sure you want to delete {record.name}? Deleting Pipeline will
        <Typography.Text strong> STOP-ALL</Typography.Text> related Jobs and Executions,
      </>
    ),
    okText: 'Cancel',
    okType: 'default',
    cancelButtonProps: {
      type: 'danger'
    },
    cancelText: 'Confirm',
    onCancel() {
      action(record.name);
    }
  });
};

const generateColumns = ({
  dataStats,
  getPipelineReadme,
  onSubmit,
  cronStart,
  cronStop,
  updateStoredPipeline,
  execStoredPipeline,
  updatePipelineReadme,
  deleteStoredPipeline
}) => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: name => <Ellipsis copyable text={name} />
  },
  {
    title: 'Cron Job',
    dataIndex: 'cron',
    key: 'cron',
    render: (_, record) => (
      <SwitchCron
        pipeline={record}
        cronStart={cronStart}
        cronStop={cronStop}
        updateStoredPipeline={updateStoredPipeline}
      />
    )
  },
  {
    title: 'Pipeline Stats',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => {
      // array flat one-liner
      const pipelineStats = [].concat(
        ...[
          ...dataStats
            .filter(status => status.name === record.name && status.stats.length !== 0)
            .map(pipeline => pipeline.stats)
        ]
      );

      return pipelineStats.length === 0 ? (
        <StatusTag count={0} />
      ) : (
        pipelineStats.map(([status, count], i) => (
          <StatusTag key={`${status}-${i}`} status={status} count={count} />
        ))
      );
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => {
      // http://hkube.io/spec/#tag/Execution/paths/~1exec~1stored/post
      const { nodes, description, ...currPipeline } = record;

      return (
        <FlexRow justify="start">
          <Col>
            <DrawerEditor
              title={'Run Stored Pipeline'}
              description={
                <>
                  Start pipeline <Typography.Text code>execution</Typography.Text> when the name of
                  the pipeline is known, all parameters in this action will be merged with the
                  stored pipeline.
                </>
              }
              opener={onClick => (
                <Tooltip placement="top" title={'Run Stored Pipeline'}>
                  <Button shape="circle" onClick={onClick}>
                    <Icon component={PlayIconSvg} />
                  </Button>
                </Tooltip>
              )}
              valueString={stringify(currPipeline)}
              onSubmit={execStoredPipeline}
            />
          </Col>
          <Col>
            <DrawerEditorMD
              title={'Update Pipeline'}
              readmeDefault={getPipelineReadme(record)}
              description={
                <>
                  Edit pipeline properties and description,{' '}
                  <Typography.Text strong>submit</Typography.Text> changes with
                  <Typography.Text code>Update</Typography.Text> button.
                </>
              }
              opener={setVisible => (
                <Tooltip placement="top" title={'Update Pipeline'}>
                  <Button
                    shape="circle"
                    icon="edit"
                    onClick={() => {
                      updatePipelineReadme(record);
                      setVisible(prev => !prev);
                    }}
                  />
                </Tooltip>
              )}
              record={record}
              onSubmit={onSubmit}
            />
          </Col>
          <Col>
            <Button
              type="dashed"
              shape="circle"
              icon="delete"
              onClick={() => deleteConfirmAction(deleteStoredPipeline, record)}
            />
          </Col>
        </FlexRow>
      );
    }
  }
];

export default generateColumns;
