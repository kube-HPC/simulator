import React, { memo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Empty, Popover, Tooltip } from 'antd';

import { USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';
import { deleteConfirmAction, stopConfirmAction } from 'utils';
import PipelineCreateBoard from './TensorflowBoards/PipelineCreateBoard.react';
import usePath from './usePath';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const title = 'Create Tensor Board for selected Node';

const PipelineActions = ({ pipeline, className = '' }) => {
  const { goTo } = usePath();
  const { deleteStored: remove, stopAllPipeline } = useActions();

  const container = useRef();

  // http://hkube.org/spec/#tag/Execution/paths/~1exec~1stored/post
  // Don't use nodes & description
  const { nodes } = pipeline;

  const hasNodes = nodes.length !== 0;

  const onDelete = useCallback(
    () => deleteConfirmAction(remove, pipeline),
    [pipeline, remove]
  );

  const onStop = useCallback(
    () => stopConfirmAction(stopAllPipeline, pipeline),
    [pipeline, stopAllPipeline]
  );

  const setPopupContainer = useCallback(() => container.current, [container]);

  const onUpdate = useCallback(() => {
    goTo.edit({ nextPipelineId: pipeline.name });
  }, [goTo, pipeline]);

  const onEdit = useCallback(() => {
    goTo.overview({ nextPipelineId: pipeline.name });
  }, [pipeline, goTo]);

  const onExecute = useCallback(() => {
    goTo.execute({ nextPipelineId: pipeline.name });
  }, [pipeline, goTo]);

  const popOverContent = hasNodes ? (
    <PipelineCreateBoard name={pipeline.name} nodes={nodes} />
  ) : (
    <Empty />
  );

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={ACTIONS_SELECT}
      role="none"
      ref={container}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}>
      <Button.Group className={className}>
        <Popover
          title={title}
          content={popOverContent}
          placement="left"
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.5}>
          {/* This feature has been removed due to lack of customer use
             <Button className="ant-btn-icon-only">
              <Icon component={IconTensorFlow} />
             </Button> */}
        </Popover>
        <Tooltip title="run pipeline">
          <Button icon={<PlayCircleOutlined />} onClick={onExecute} />
        </Tooltip>
        <Tooltip title="edit pipeline">
          <Button icon={<EditOutlined />} onClick={onUpdate} />
        </Tooltip>
        <Tooltip title="delete pipeline">
          <Button icon={<DeleteOutlined />} onClick={onDelete} />
        </Tooltip>
        <Tooltip title="stop all jobs of pipeline">
          <Button icon={<StopOutlined />} onClick={onStop} />
        </Tooltip>
        <Tooltip title="show overview">
          <Button icon={<InfoCircleOutlined />} onClick={onEdit} />
        </Tooltip>
      </Button.Group>
    </div>
  );
};

PipelineActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const areEqual = ({ pipeline: a }, { pipeline: b }) => isEqual(a, b);

export default memo(PipelineActions, areEqual);
