import { Button, Empty } from 'antd';
import { FlexBox, JsonSwitch, Tabs } from 'components/common';
import { STATE_SOURCES } from 'const';
import { useActions, useLogs } from 'hooks';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getTaskDetails } from 'utils';
import { NodeInputOutput, NodeLogs } from '.';

const DEFAULT_ALGORITHM = {};

const OverflowContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const algorithmDetailsSelector = node => state =>
  state[STATE_SOURCES.ALGORITHM_TABLE].dataSource.find(a => a.name === node.algorithmName) ||
  DEFAULT_ALGORITHM;

const NodeInfo = ({ node, jobId }) => {
  const algorithmDetails = useSelector(algorithmDetailsSelector(node));
  const [index, setIndex] = useState(0);
  const { getCaching } = useActions();
  const { getLogs } = useLogs();

  const onRunNode = () => node && getCaching({ jobId, nodeName: node.nodeName });

  const onRefresh = () => {
    const taskDetails = getTaskDetails(node);
    const { taskId, podName } = taskDetails[index];
    getLogs({ taskId, podName });
  };

  const extra = (
    <FlexBox.Auto>
      <Button key="run-node" type="primary" onClick={onRunNode}>
        Run Node
      </Button>
      <Button key="refresh" icon="redo" onClick={onRefresh}>
        Refresh Logs
      </Button>
    </FlexBox.Auto>
  );

  const taskDetails = getTaskDetails(node);

  return node ? (
    <Tabs defaultActiveKey="1" extra={extra}>
      <Tabs.TabPane tab="Logs" key="1">
        <NodeLogs taskDetails={taskDetails} onChange={setIndex} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Algorithm Details" key="2">
        <OverflowContainer>
          <JsonSwitch obj={algorithmDetails} />
        </OverflowContainer>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Input Output Details" key="3">
        <NodeInputOutput payload={node} />
      </Tabs.TabPane>
    </Tabs>
  ) : (
    <Empty />
  );
};

NodeInfo.propTypes = {
  jobId: PropTypes.string.isRequired,
  node: PropTypes.object,
};

export default React.memo(NodeInfo);
