import { Button, Empty, Icon, Popover, Radio, Tag } from 'antd';
import Text from 'antd/lib/typography/Text';
import { FlexBox } from 'components/common';
import { IconTensorFlow } from 'components/Icons';
import { DRAWER_SIZE, USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import { deleteConfirmAction } from 'utils';
import PipelineInfo from './PipelineInfo.react';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const radioStyle = {
  display: 'block',
  height: `30px`,
  lineHeight: `30px`,
};

const Container = styled(Radio.Group)`
  max-height: 30vh;
  overflow: auto;
`;

const PipelineActions = ({ pipeline, className }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const { execute, update, remove } = usePipeline();
  const { drawerOpen, startBoard } = useActions();

  const container = useRef();

  // http://hkube.io/spec/#tag/Execution/paths/~1exec~1stored/post
  // Don't use nodes & description
  /* eslint-disable no-unused-vars */
  const { nodes, description, triggers, ...noTriggersPipeline } = pipeline;

  const hasNodes = nodes.length !== 0;

  useEffect(() => {
    if (hasNodes) {
      const [{ nodeName }] = nodes;
      setSelectedNode(nodeName);
    }
  }, [hasNodes, nodes]);

  const onMoreInfo = () =>
    drawerOpen({
      title: pipeline.name,
      body: <PipelineInfo record={pipeline} />,
      width: DRAWER_SIZE.JOB_INFO,
    });
  const onDelete = () => deleteConfirmAction(remove, pipeline);
  const onUpdate = () => update(pipeline);
  const onExecute = () => execute(noTriggersPipeline);

  const onSelect = ({ target: { value } }) => setSelectedNode(value);
  const onRun = () => startBoard({ pipelineName: pipeline.name, nodeName: selectedNode });

  const content = (
    <FlexBox.Auto direction="column" full gutter={[0, 10]}>
      <Container onChange={onSelect} value={selectedNode}>
        {nodes.map(({ nodeName, algorithmName }) => (
          <Radio key={nodeName} value={nodeName} style={radioStyle}>
            Node: <Tag>{nodeName}</Tag>
            <Text strong>Algorithm: </Text>
            <Tag color={COLOR_LAYOUT.colorPrimary}>{algorithmName}</Tag>
          </Radio>
        ))}
      </Container>
      <Button type="primary" block size="small" onClick={onRun}>
        Run
      </Button>
    </FlexBox.Auto>
  );

  return (
    <div className={ACTIONS_SELECT} ref={container}>
      <Button.Group className={className}>
        <Popover
          title="Run Node with Tensorflow Board"
          content={hasNodes ? content : <Empty />}
          placement="left"
          getPopupContainer={() => container.current}>
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

const areEqual = ({ pipeline: { nodes: a } }, { pipeline: { nodes: b } }) => isEqual(a, b);

export default memo(PipelineActions, areEqual);
