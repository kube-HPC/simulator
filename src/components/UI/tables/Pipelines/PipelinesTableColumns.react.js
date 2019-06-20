import React from 'react';
import { Button, Row, Col, Modal, Icon, Tooltip } from 'antd';

import StatusTag from 'components/common/StatusTag.react';
import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { stringify } from 'utils/string';
import Text from 'antd/lib/typography/Text';
import DrawerEditor from 'components/common/drawer/DrawerEditor.react';
import SwitchCron from 'components/UI/tables/Pipelines/SwitchCron.react';
import CopyEllipsis from 'components/common/CopyEllipsis.react';

const deleteConfirmAction = (action, record) => {
  Modal.confirm({
    title: 'WARNING Deleting Pipeline',
    content: (
      <>
        Are you sure you want to delete {record.name}? Deleting Pipeline will
        <Text strong> STOP-ALL</Text> related Jobs and Executions,
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

const pipelinesTableColumns = props => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
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
        cronStart={props.cronStart}
        cronStop={props.cronStop}
        updateStoredPipeline={props.updateStoredPipeline}
      />
    )
  },
  {
    title: 'Pipeline Stats',
    dataIndex: 'status',
    key: 'status',
    width: '30%',
    render: (_, record) => {
      const { dataStats } = props;

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
      const {
        execStoredPipe,
        deleteStoredPipeline,
        updateStoredPipeline
      } = props;

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
                  Start pipeline <Text code>execution</Text> when the name of
                  the pipeline is known, all parameters in this action will be
                  merged with the stored pipeline.
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
              onSubmit={execStoredPipe}
              submitText={'Execute'}
            />
          </Col>
          <Col>
            <DrawerEditor
              title={'Update Pipeline'}
              description={
                <>
                  Edit pipeline properties and <Text code>Update</Text>
                </>
              }
              opener={onClick => (
                <Tooltip placement="top" title={'Update Pipeline'}>
                  <Button shape="circle" icon="edit" onClick={onClick} />
                </Tooltip>
              )}
              valueString={stringify(record)}
              onSubmit={updateStoredPipeline}
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
