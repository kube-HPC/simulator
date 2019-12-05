import React from 'react';
import { Button, Modal, Icon, Tooltip, Typography } from 'antd';

import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { sorter } from 'utils/string';
import { FlexBox, Ellipsis, StatusTag } from 'components/common';
import SwitchCron from './SwitchCron.react';

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

const PipelineName = name => <Ellipsis copyable text={name} />;

const getPipelineColumns = ({
  dataStats,
  setExecPipeline,
  cronStart,
  cronStop,
  update,
  remove,
  setPipeline,
  setIsExecution,
  toggle,
}) => {
  const Cron = (_, record) => (
    <SwitchCron
      pipeline={record}
      cronStart={cronStart}
      cronStop={cronStop}
      updateStoredPipeline={update}
    />
  );

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
    // Don't use nodes & description
    // eslint-disable-next-line
    const { nodes, description, ...currPipeline } = record;

    return (
      <FlexBox justify="start">
        <FlexBox.Item>
          <Tooltip title={'Execute Pipeline'}>
            <Button
              shape="circle"
              onClick={() => {
                setIsExecution(true);
                toggle();
                setExecPipeline(currPipeline);
              }}>
              <Icon component={PlayIconSvg} />
            </Button>
          </Tooltip>
        </FlexBox.Item>
        <FlexBox.Item>
          <Tooltip title={'Update Pipeline'}>
            <Button
              shape="circle"
              icon="edit"
              onClick={() => {
                setIsExecution(false);
                toggle();
                setPipeline(record);
              }}
            />
          </Tooltip>
        </FlexBox.Item>
        <FlexBox.Item>
          <Tooltip title={'Delete Pipeline'}>
            <Button
              type="dashed"
              shape="circle"
              icon="delete"
              onClick={() => deleteConfirmAction(remove, record)}
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
      dataIndex: 'name',
      key: 'action',
      render: Action,
    },
  ];
};

export default getPipelineColumns;
