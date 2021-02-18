import { Button, Empty } from 'antd';
import { FlexBox, JsonSwitch } from 'components/common';
import { useActions, useLogs, useSettings } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import styled from 'styled-components';
import { getTaskDetails } from 'utils';
import NodeInputOutput from '../NodeInputOutput.react';
import NodeLogs from '../NodeLogs.react';
import { Tabs, Pane } from './../styles';

const OverflowContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const NodeInfo = ({ node, jobId }) => {
  const algorithmDetails = useSelector(state =>
    selectors.algorithms.collection.byId(state, node.algorithmName)
  );

  const [index, setIndex] = useState(0);
  const { getCaching } = useActions();
  const { getLogs } = useLogs();
  const { logSource: source, logMode } = useSettings();

  const onRunNode = () =>
    node && getCaching({ jobId, nodeName: node.nodeName });

  const taskDetails = useMemo(() => getTaskDetails(node), [node]);

  const onRefresh = useCallback(() => {
    const { taskId, podName } = taskDetails[index];
    getLogs({ taskId, podName, source, nodeKind: node.kind, logMode });
  }, [taskDetails, getLogs, index, logMode, node, source]);

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
    <Tabs defaultActiveKey="logs-tab" tabBarExtraContent={extra}>
      <Pane tab="Logs" key="logs-tab">
        <OverflowContainer>
          <NodeLogs node={node} taskDetails={taskDetails} onChange={setIndex} />
        </OverflowContainer>
      </Pane>
      <Tabs.TabPane tab="Algorithm Details" key="algorithms-tab">
        <OverflowContainer>
          <JsonSwitch obj={algorithmDetails} jobId={jobId} />
        </OverflowContainer>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Input Output Details" key="io-details-tab">
        <NodeInputOutput payload={node} algorithm={algorithmDetails} />
      </Tabs.TabPane>
    </Tabs>
  ) : (
    <Empty />
  );
};

NodeInfo.propTypes = {
  jobId: PropTypes.string.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  node: PropTypes.object,
};

export default React.memo(NodeInfo);
