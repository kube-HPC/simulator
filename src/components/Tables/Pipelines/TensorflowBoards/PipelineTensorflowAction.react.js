import { Alert, Button, Radio, Tag } from 'antd';
import Text from 'antd/lib/typography/Text';
import { FlexBox } from 'components/common';
import { useActions, useBoards } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLOR } from 'styles';

const radioStyle = {
  height: `30px`,
  lineHeight: `30px`,
  display: `block`,
};

const Container = styled(Radio.Group)`
  max-height: 30vh;
  overflow: auto;
`;

const PipelineTensorflowAction = ({ name, nodes }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const { startBoard } = useActions();

  const { hasMetrics } = useBoards({ pipelineName: name });

  useEffect(() => {
    const hasNodes = nodes.length !== 0;

    if (hasNodes) {
      const [{ nodeName }] = nodes;
      setSelectedNode(nodeName);
    }
  }, [nodes]);

  const onSelect = ({ target: { value } }) => setSelectedNode(value);
  const onRun = () => startBoard({ pipelineName: name, nodeName: selectedNode });

  return (
    <FlexBox.Auto direction="column" full gutter={[0, 10]}>
      <Container onChange={onSelect} value={selectedNode}>
        {nodes.map(({ nodeName, algorithmName }) => (
          <Radio key={nodeName} value={nodeName} style={radioStyle}>
            <Tag>{nodeName}</Tag>
            <Tag color={COLOR.darkGrey}>{algorithmName}</Tag>
            {hasMetrics(nodeName) && <Tag color={COLOR.lightGreen}>Has Metrics</Tag>}
          </Radio>
        ))}
      </Container>
      {!hasMetrics(selectedNode) && (
        <Alert
          type="warning"
          message={
            <>
              No tensor metrics for node <Text strong>{selectedNode}</Text>
            </>
          }
          showIcon
        />
      )}
      <Button type="primary" block size="small" onClick={onRun}>
        Run
      </Button>
    </FlexBox.Auto>
  );
};

PipelineTensorflowAction.propTypes = {
  name: PropTypes.string.isRequired,
  nodes: PropTypes.array.isRequired,
};

const areEqual = ({ nodes: a }, { nodes: b }) => isEqual(a, b);

export default memo(PipelineTensorflowAction, areEqual);
