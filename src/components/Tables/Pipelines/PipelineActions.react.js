import { Button, Empty, Icon, Popover } from 'antd';
import { IconTensorFlow } from 'components/Icons';
import { DRAWER_SIZE, USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo, useRef } from 'react';
import { deleteConfirmAction } from 'utils';
import PipelineInfo from './PipelineInfo.react';
import PipelineTensorflowAction from './TensorflowBoards/PipelineTensorflowAction.react';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const title = 'Create Tensor Board for selected Node';

const PipelineActions = ({ pipeline, className }) => {
  const { execute, update, remove } = usePipeline();
  const { drawerOpen } = useActions();

  const container = useRef();

  // http://hkube.io/spec/#tag/Execution/paths/~1exec~1stored/post
  // Don't use nodes & description
  /* eslint-disable no-unused-vars */
  const { nodes, description, triggers, ...noTriggersPipeline } = pipeline;

  const hasNodes = nodes.length !== 0;

  const onMoreInfo = () =>
    drawerOpen({
      title: pipeline.name,
      body: <PipelineInfo record={pipeline} />,
      width: DRAWER_SIZE.JOB_INFO,
    });

  const onDelete = () => deleteConfirmAction(remove, pipeline);
  const onUpdate = () => update(pipeline);
  const onExecute = () => execute(noTriggersPipeline);
  const setPopupContainer = () => container.current;

  const popOverContent = hasNodes ? (
    <PipelineTensorflowAction name={pipeline.name} nodes={nodes} />
  ) : (
    <Empty />
  );

  return (
    <div className={ACTIONS_SELECT} ref={container}>
      <Button.Group className={className}>
        <Popover
          title={title}
          content={popOverContent}
          placement="left"
          getPopupContainer={setPopupContainer}>
          <Button className="ant-btn-icon-only">
            <Icon component={IconTensorFlow} />
          </Button>
        </Popover>
        <Button icon="play-circle" onClick={onExecute} />
        <Button icon="edit" onClick={onUpdate} />
        <Button icon="delete" onClick={onDelete} />
        <Button icon="ellipsis" onClick={onMoreInfo} />
      </Button.Group>
    </div>
  );
};

PipelineActions.propTypes = {
  pipeline: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const areEqual = ({ pipeline: a }, { pipeline: b }) => isEqual(a, b);

export default memo(PipelineActions, areEqual);
