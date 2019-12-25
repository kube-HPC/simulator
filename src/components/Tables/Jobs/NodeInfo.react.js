import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { Tabs, JsonSwitch } from 'components/common';
import { NodeLogs, NodeInputOutput } from '.';
import { Empty } from 'antd';
import styled from 'styled-components';

const DEFAULT_ALGORITHM = {};

const OverflowContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const NodeInfo = ({ node }) => {
  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);
  const algorithmDetails =
    algorithmTable.find(a => a.name === node.algorithmName) || DEFAULT_ALGORITHM;

  const taskDetails =
    node && node.batch && node.batch.length > 0
      ? node.batch
      : [{ taskId: node.taskId, podName: node.podName }];

  return node ? (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Logs" key="1">
        <NodeLogs taskDetails={taskDetails} />
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
  node: PropTypes.object,
};

export default React.memo(NodeInfo);
