import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  BugOutlined,
  PlayCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Button, Empty, Tooltip } from 'antd';
import { FlexBox, JsonSwitch } from 'components/common';
import { useActions, useLogs, useSettings } from 'hooks';
import { selectors } from 'reducers';
import { getTaskDetails } from '../graphUtils';
import NodeInputOutput from './NodeInputOutput';
import NodeLogs from '../NodeLogs';
import { Tabs, Pane } from './../styles';

export const TabsLog = styled(Tabs)`
  flex-direction: column;
`;

export const PaneLog = styled(Pane)`
  flex-direction: column;
`;

const OverflowContainer = styled.div`
  height: 100%;
  overflow: auto;
`;
const ContainerTabs = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  height: 800px;
`;

const NodeInfo = ({ node, jobId, isDisabledBtnRunDebug }) => {
  const algorithmDetails = useSelector(state =>
    selectors.algorithms.collection.byId(state, node.algorithmName)
  );

  const [index, setIndex] = useState(0);
  const { getCaching } = useActions();
  const { getLogs } = useLogs();
  const { logSource: source, logMode } = useSettings();

  const onRunNode = () =>
    node && getCaching({ jobId, nodeName: node.nodeName });
  const onDebugNode = () =>
    node && getCaching({ jobId, nodeName: node.nodeName, debug: true });

  const taskDetails = useMemo(() => getTaskDetails(node), [node]);

  const onRefresh = useCallback(() => {
    const { taskId, podName } = taskDetails[index];
    getLogs({ taskId, podName, source, nodeKind: node.kind, logMode });
  }, [taskDetails, getLogs, index, logMode, node, source]);

  const extra = node ? (
    <FlexBox.Auto>
      <Tooltip title={`Run from node ${node.nodeName}`}>
        <Button
          key="run-node"
          type="ghost"
          onClick={onRunNode}
          icon={<PlayCircleOutlined />}
          disabled={isDisabledBtnRunDebug}
        />
      </Tooltip>
      <Tooltip title={`Debug from node ${node.nodeName}`}>
        <Button
          key="debug-node"
          type="ghost"
          onClick={onDebugNode}
          icon={<BugOutlined />}
          disabled={isDisabledBtnRunDebug}
        />
      </Tooltip>
      <Button key="refresh" icon={<RedoOutlined />} onClick={onRefresh}>
        Refresh Logs
      </Button>
    </FlexBox.Auto>
  ) : null;

  return node ? (
    <ContainerTabs>
      <TabsLog defaultActiveKey="logs-tab" tabBarExtraContent={extra}>
        <PaneLog tab="Logs" key="logs-tab">
          <NodeLogs node={node} taskDetails={taskDetails} onChange={setIndex} />
        </PaneLog>
        <Tabs.TabPane tab="Algorithm Details" key="algorithms-tab">
          <OverflowContainer>
            <JsonSwitch obj={algorithmDetails} jobId={jobId} />
          </OverflowContainer>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Input Output Details" key="io-details-tab">
          <NodeInputOutput payload={node} algorithm={algorithmDetails} />
        </Tabs.TabPane>
      </TabsLog>
    </ContainerTabs>
  ) : (
    <Empty />
  );
};

NodeInfo.propTypes = {
  jobId: PropTypes.string.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  node: PropTypes.object,
  isDisabledBtnRunDebug: PropTypes.bool,
};

NodeInfo.defaultProps = {
  isDisabledBtnRunDebug: false,
};
export default React.memo(NodeInfo);
