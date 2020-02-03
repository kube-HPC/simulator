import { Button, Empty, Icon, Popover } from 'antd';
import { IconTensorFlow } from 'components/Icons';
import { DRAWER_SIZE, USER_GUIDE } from 'const';
import { useActions, useBoards, usePipeline } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo, useRef } from 'react';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { COLOR } from 'styles';
import { deleteConfirmAction } from 'utils';
import PipelineInfo from './PipelineInfo.react';
import PipelineTensorflowAction from './TensorflowBoards/PipelineTensorflowAction.react';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const title = 'Run Node with Tensorflow Board';

const ColorButton = styled(Button)`
  background: ${ifProp({ metrics: true }, COLOR.lightGreen, 'white')};
`;

export const hasMetrics = ({ info, node }) => info && info[node] && info[node].hasMetrics;

const PipelineActions = ({ pipeline, className }) => {
  const { execute, update, remove } = usePipeline();
  const { drawerOpen } = useActions();
  const { nodeMap } = useBoards();

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

  const hasNodeWithMetrics = nodes.some(({ nodeName }) =>
    hasMetrics({ info: nodeMap[pipeline.name], node: nodeName }),
  );

  return (
    <div className={ACTIONS_SELECT} ref={container}>
      <Button.Group className={className}>
        <Popover
          title={title}
          content={popOverContent}
          placement="left"
          getPopupContainer={setPopupContainer}>
          <ColorButton metrics={hasNodeWithMetrics} className="ant-btn-icon-only">
            <Icon component={IconTensorFlow} />
          </ColorButton>
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
