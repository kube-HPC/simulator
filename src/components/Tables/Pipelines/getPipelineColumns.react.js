import React from 'react';
import { Button, Modal, Icon, Tooltip, Typography } from 'antd';

import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { stringify, sorter } from 'utils/string';
import DrawerEditor from 'components/Drawer/DrawerEditor/DrawerEditor.react';
import SwitchCron from 'components/Tables/Pipelines/SwitchCron.react';
import Ellipsis from 'components/common/Ellipsis.react';
import StatusTag from 'components/common/StatusTag.react';
import DrawerEditorMD from 'components/Drawer/DrawerEditorMD.react';
import { FlexBox } from 'components/common';

const { Text, Title, Paragraph } = Typography;

const deleteConfirmAction = (action, record) => {
  Modal.confirm({
    title: 'WARNING Deleting Pipeline',
    content: (
      <>
        Are you sure you want to delete {record.name}? Deleting Pipeline will
        <Typography.Text strong> STOP-ALL</Typography.Text> related Jobs and Executions,
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(record.name);
    },
  });
};

const getPipelineColumns = ({
  dataStats,
  getPipelineReadme,
  onSubmit,
  cronStart,
  cronStop,
  updateStoredPipeline,
  execStoredPipeline,
  updatePipelineReadme,
  deleteStoredPipeline,
}) => {
  const Cron = (_, record) => (
    <SwitchCron
      pipeline={record}
      cronStart={cronStart}
      cronStop={cronStop}
      updateStoredPipeline={updateStoredPipeline}
    />
  );

  const PipelineName = name => <Ellipsis copyable text={name} />;

  const PipelineStats = (_, record) => {
    // array flat one-liner
    const pipelineStats = [].concat(
      ...[
        ...dataStats
          .filter(status => status.name === record.name && status.stats.length !== 0)
          .map(pipeline => pipeline.stats),
      ],
    );

    return pipelineStats.length === 0 ? (
      <StatusTag count={0} />
    ) : (
      pipelineStats.map(([status, count], i) => (
        <StatusTag key={`${status}-${i}`} status={status} count={count} />
      ))
    );
  };

  const Action = (_, record) => {
    // http://hkube.io/spec/#tag/Execution/paths/~1exec~1stored/post
    // eslint-disable-next-line
    const { nodes, description, ...currPipeline } = record;

    return (
      <FlexBox justify="start">
        <FlexBox.Item>
          <DrawerEditor
            title={
              <>
                <Title level={2}>Run Stored Pipeline</Title>
                <Paragraph>
                  Start pipeline <Text code>execution</Text> when the name of the pipeline is known,
                  all parameters in this action will be merged with the stored pipeline.
                </Paragraph>
              </>
            }
            opener={onClick => (
              <Tooltip title={'Run Stored Pipeline'}>
                <Button shape="circle" onClick={onClick}>
                  <Icon component={PlayIconSvg} />
                </Button>
              </Tooltip>
            )}
            valueString={stringify(currPipeline)}
            onSubmit={execStoredPipeline}
            submitText="Run"
          />
        </FlexBox.Item>
        <FlexBox.Item>
          <DrawerEditorMD
            title={
              <>
                <Title level={2}>Update Pipeline</Title>
                <Paragraph>
                  Edit pipeline properties and description,{' '}
                  <Typography.Text strong>submit</Typography.Text> changes with
                  <Typography.Text code>Update</Typography.Text> button.
                </Paragraph>
              </>
            }
            readmeDefault={getPipelineReadme(record)}
            opener={setVisible => (
              <Tooltip title={'Update Pipeline'}>
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
        </FlexBox.Item>
        <FlexBox.Item>
          <Tooltip title={'Delete Pipeline'}>
            <Button
              type="dashed"
              shape="circle"
              icon="delete"
              onClick={() => deleteConfirmAction(deleteStoredPipeline, record)}
            />
          </Tooltip>
        </FlexBox.Item>
      </FlexBox>
    );
  };

  return [
    {
      title: 'Pipeline Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => sorter(a.name, b.name),
      render: PipelineName,
    },
    {
      title: 'Cron Job',
      dataIndex: 'cron',
      key: 'cron',
      render: Cron,
    },
    {
      title: 'Pipeline Stats',
      dataIndex: 'status',
      key: 'status',
      render: PipelineStats,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: Action,
    },
  ];
};

export default getPipelineColumns;
