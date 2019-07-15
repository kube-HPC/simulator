import React from 'react';
import { Button, Row, Col, Modal, Icon, Tooltip, Typography } from 'antd';

import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { stringify, sorter } from 'utils/string';
import DrawerEditor from 'components/common/drawer/DrawerEditor.react';
import SwitchCron from 'components/UI/tables/Pipelines/SwitchCron.react';
import CopyEllipsis from 'components/common/CopyEllipsis.react';
import StatusTag from 'components/common/StatusTag.react';

import {
  execStoredPipe,
  deleteStoredPipeline,
  updateStoredPipeline,
  cronStart,
  cronStop
} from 'actions/pipeline.action';
import { postPipelineReadme, getPipelineReadme } from 'actions/readme.action';

import DrawerEditorMD from 'components/UI/tables/Pipelines/DrawerEditorMD.react';

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

const pipelinesTableColumns = ({ dispatch, dataStats }) => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
    sorter: (a, b) => sorter(a.name, b.name),
    render: (_, record) => <CopyEllipsis disabled text={record.name} />
  },
  {
    title: 'Cron Job',
    dataIndex: 'cron',
    key: 'cron',
    width: '30%',
    render: (_, record) => (
      <SwitchCron
        pipeline={record}
        cronStart={e => dispatch(cronStart(e))}
        cronStop={e => dispatch(cronStop(e))}
        updateStoredPipeline={e => dispatch(updateStoredPipeline(e))}
      />
    )
  },
  {
    title: 'Pipeline Stats',
    dataIndex: 'status',
    key: 'status',
    width: '30%',
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
    width: '30%',
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
              onSubmit={e => dispatch(execStoredPipe(e))}
              submitText={'Execute'}
            />
          </Col>
          <Col>
            <DrawerEditorMD
              title={'Update Pipeline'}
              description={
                <>
                  Edit pipeline properties and{' '}
                  <Typography.Text code>Update</Typography.Text>
                </>
              }
              opener={setVisible => (
                <Tooltip placement="top" title={'Update Pipeline'}>
                  <Button
                    shape="circle"
                    icon="edit"
                    onClick={() => {
                      dispatch(getPipelineReadme(record.name));
                      setVisible(prev => !prev);
                    }}
                  />
                </Tooltip>
              )}
              record={record}
              onSubmit={({ pipeline, readme }) => {
                dispatch(updateStoredPipeline(pipeline));
                dispatch(postPipelineReadme(pipeline.name, readme));
              }}
              submitText={'Update'}
            />
          </Col>
          <Col>
            <Button
              type="danger"
              shape="circle"
              icon="delete"
              onClick={() =>
                deleteConfirmAction(
                  e => dispatch(deleteStoredPipeline(e)),
                  record
                )
              }
            />
          </Col>
        </Row>
      );
    }
  }
];

export default pipelinesTableColumns;
