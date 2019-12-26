import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { Tabs, JsonSwitch, FlexBox } from 'components/common';
import { NodeLogs, NodeInputOutput } from '.';
import { Empty, Button } from 'antd';
import styled from 'styled-components';
import { useActions } from 'hooks';

const DEFAULT_ALGORITHM = {};

const OverflowContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const NodeInfo = ({ node, jobId }) => {
  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);
  const algorithmDetails =
    algorithmTable.find(a => a.name === node.algorithmName) || DEFAULT_ALGORITHM;

  const { getKubernetesLogsData, getCaching } = useActions();

  const taskDetails =
    node && node.batch && node.batch.length > 0
      ? node.batch
      : [{ taskId: node.taskId, podName: node.podName }];

  const onRunNode = () => node && getCaching({ jobId, nodeName: node.nodeName });

  const onRefresh = () => {
    const [{ taskId, podName }] = taskDetails;
    getKubernetesLogsData({ taskId, podName });
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

  return node ? (
    <Tabs defaultActiveKey="1" extra={extra}>
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
  jobId: PropTypes.string.isRequired,
  node: PropTypes.object,
};

export default React.memo(NodeInfo);
