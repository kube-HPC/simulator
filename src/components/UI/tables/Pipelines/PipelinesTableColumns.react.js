import React from 'react';
import { Button, Row, Col, Modal, Icon, Tooltip, Typography } from 'antd';

import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { stringify, sorter } from 'utils/string';
import DrawerEditor from 'components/common/drawer/DrawerEditor.react';
import SwitchCron from 'components/UI/tables/Pipelines/SwitchCron.react';
import CopyEllipsis from 'components/common/CopyEllipsis.react';
import StatusTag from 'components/common/StatusTag.react';
import DrawerEditorMD from 'components/common/drawer/DrawerEditorMD.react';

const deleteConfirmAction = (action, record) => {
  Modal.confirm({
    title: 'WARNING Deleting Pipeline',
    content: (
      <>
        Are you sure you want to delete {record.name}? Deleting Pipeline will
        <Typography.Text strong> STOP-ALL</Typography.Text> related Jobs and
        Executions,
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(record.name);
    },
    onCancel() {}
  });
};

const pipelinesTableColumns = ({
  dataStats,
  readmeDefault,
  onSubmit,
  cronStart,
  cronStop,
  updateStoredPipeline,
  execStoredPipeline,
  getPipelineReadme,
  deleteStoredPipeline
}) => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: (_, record) => <CopyEllipsis disabled text={record.name} />
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
            .filter(
              status => status.name === record.name && status.stats.length !== 0
            )
            .map(pipeline => pipeline.stats)
        ]
      );

      return pipelineStats.length === 0 ? (
        <StatusTag />
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
      const currPipeline = { ...record };

      // No description and nodes on executing pipeline
      delete currPipeline.nodes;
      delete currPipeline.description;

      return (
        <Row type="flex" justify="start" gutter={10}>
          <Col>
            <DrawerEditor
              title={'Run Stored Pipeline'}
              description={
                <>
                  Start pipeline{' '}
                  <Typography.Text code>execution</Typography.Text> when the
                  name of the pipeline is known, all parameters in this action
                  will be merged with the stored pipeline.
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
              submitText={'Execute'}
            />
          </Col>
          <Col>
            <DrawerEditorMD
              title={'Update Pipeline'}
              readmeDefault={
                readmeDefault &&
                readmeDefault[record.name] &&
                readmeDefault[record.name].readme &&
                readmeDefault[record.name].readme.readme
              }
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
                      getPipelineReadme(record);
                      setVisible(prev => !prev);
                    }}
                  />
                </Tooltip>
              )}
              record={record}
              onSubmit={onSubmit}
              submitText={'Update'}
            />
          </Col>
          <Col>
            <Button
              type="danger"
              shape="circle"
              icon="delete"
              onClick={() => deleteConfirmAction(deleteStoredPipeline, record)}
            />
          </Col>
        </Row>
      );
    }
  }
];

export default pipelinesTableColumns;
