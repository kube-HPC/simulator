import React, { memo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Empty, Icon, Popover } from 'antd';
import { IconTensorFlow } from 'components/Icons';
import { USER_GUIDE } from 'const';
import { usePipeline } from 'hooks';
import isEqual from 'lodash/isEqual';
import { deleteConfirmAction } from 'utils';
import PipelineCreateBoard from './TensorflowBoards/PipelineCreateBoard.react';
import usePath from './usePath';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const title = 'Create Tensor Board for selected Node';

const PipelineActions = ({ pipeline, className }) => {
  const { goTo } = usePath();

  const { remove } = usePipeline();

  const container = useRef();

  // http://hkube.io/spec/#tag/Execution/paths/~1exec~1stored/post
  // Don't use nodes & description
  const { nodes } = pipeline;

  const hasNodes = nodes.length !== 0;

  const onDelete = useCallback(() => deleteConfirmAction(remove, pipeline), [
    pipeline,
    remove,
  ]);

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
          <Button className="ant-btn-icon-only">
            <Icon component={IconTensorFlow} />
          </Button>
        </Popover>
        <Button icon="play-circle" onClick={onExecute} />
        <Button icon="edit" onClick={onUpdate} />
        <Button icon="delete" onClick={onDelete} />
        <Button icon="ellipsis" onClick={onEdit} />
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
PipelineActions.defaultProps = {
  className: '',
};

const areEqual = ({ pipeline: a }, { pipeline: b }) => isEqual(a, b);

export default memo(PipelineActions, areEqual);
