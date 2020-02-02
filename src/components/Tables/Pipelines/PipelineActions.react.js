import { Button, Modal, Tooltip, Typography } from 'antd';
import { FlexBox } from 'components/common';
import { DRAWER_SIZE, USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import PipelineInfo from './PipelineInfo.react';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const { Text } = Typography;

const deleteConfirmAction = (action, { name }) => {
  Modal.confirm({
    title: 'WARNING Deleting Pipeline',
    content: (
      <>
        Are you sure you want to delete {name}? Deleting Pipeline will
        <Text strong> STOP-ALL</Text> related Jobs and Executions,
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(name);
    },
  });
};

const PipelineActions = ({ pipeline, className }) => {
  const { execute, update, remove } = usePipeline();
  const { drawerOpen } = useActions();

  // http://hkube.io/spec/#tag/Execution/paths/~1exec~1stored/post
  // Don't use nodes & description
  /* eslint-disable no-unused-vars */
  const { nodes, description, ...currPipeline } = pipeline;

  /* eslint-disable no-unused-vars */
  const { triggers, ...noTriggersPipeline } = currPipeline;

  const body = <PipelineInfo record={pipeline} />;
  const onMoreInfo = () => drawerOpen({ title: pipeline.name, body, width: DRAWER_SIZE.JOB_INFO });
  const onDelete = () => deleteConfirmAction(remove, pipeline);
  const onUpdate = () => update(pipeline);
  const onExecute = () => execute(noTriggersPipeline);

  return (
    <div className={ACTIONS_SELECT}>
      <FlexBox.Auto justify="start" className={className}>
        <Tooltip title="Execute Pipeline">
          <Button shape="circle" icon="caret-right" onClick={onExecute} />
        </Tooltip>
        <Tooltip title="Update Pipeline">
          <Button shape="circle" icon="edit" onClick={onUpdate} />
        </Tooltip>
        <Tooltip title="Delete Pipeline">
          <Button type="dashed" shape="circle" icon="delete" onClick={onDelete} />
        </Tooltip>
        <Tooltip placement="top" title="More Info">
          <Button type="default" shape="circle" icon="ellipsis" onClick={onMoreInfo} />
        </Tooltip>
      </FlexBox.Auto>
    </div>
  );
};

PipelineActions.propTypes = {
  pipeline: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default PipelineActions;
