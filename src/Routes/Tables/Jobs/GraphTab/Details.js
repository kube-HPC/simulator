import React, { useCallback, useMemo, useState } from 'react';
import { removeNullUndefined } from 'utils';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  BugOutlined,
  PlayCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Button, Empty, Tooltip } from 'antd';
import { FlexBox, JsonSwitch } from 'components/common';
import { useActions, useSettings } from 'hooks';
import { useAlgorithmByName, useLazyLogs } from 'hooks/graphql';
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

const Details = ({ node, jobId, isDisabledBtnRunDebug }) => {
  //  const algorithmDetails = useSelector(state =>
  //    selectors.algorithms.collection.byId(state, node.algorithmName)
  //  );
  let algorithmDetails = null;
  // node && node.algorithmName && useAlgorithmByName(node.algorithmName);
  const query = useAlgorithmByName(node.algorithmName);
  query &&
    query.data &&
    query.data.algorithmsByName &&
    (algorithmDetails = query.data.algorithmsByName);

  const [index, setIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const { getCaching } = useActions();
  const { getLogsLazyQuery } = useLazyLogs();
  const { logSource: source, logMode } = useSettings();

  const onRunNode = () =>
    node && getCaching({ jobId, nodeName: node.nodeName });
  const onDebugNode = () =>
    node && getCaching({ jobId, nodeName: node.nodeName, debug: true });

  // const taskDetails = useMemo(() => getTaskDetails(node), [node]);

  const taskDetails = useMemo(() => {
    const taskData = getTaskDetails(node);

    return taskData.length > 1
      ? [...taskData].sort(a => (a?.status === 'failed' ? 1 : -1)) || {}
      : taskData;
  }, [node]);

  const onRefresh = useCallback(() => {
    const { taskId, podName } = taskDetails[index];

    getLogsLazyQuery({
      variables: {
        taskId: taskId || '',
        podName: podName || '',
        source: source || 'k8s',
        nodeKind: node.kind,
        logMode,
      },
    }).then(resLogs => {
      setLogs(resLogs.data.logsByQuery);
    });
  }, [taskDetails, getLogsLazyQuery, index, logMode, node, source]);

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
    algorithmDetails && (
      <ContainerTabs>
        <TabsLog defaultActiveKey="logs-tab" tabBarExtraContent={extra}>
          <PaneLog tab="Logs" key="logs-tab">
            <NodeLogs
              node={node}
              taskDetails={taskDetails}
              onChange={setIndex}
              logs={logs}
              setLogs={setLogs}
            />
          </PaneLog>
          <Tabs.TabPane tab="Algorithm Details" key="algorithms-tab">
            <OverflowContainer>
              <JsonSwitch
                obj={removeNullUndefined(algorithmDetails)}
                jobId={jobId}
                typeDefaultView="Table"
              />
            </OverflowContainer>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Input Output Details" key="io-details-tab">
            <NodeInputOutput payload={node} algorithm={algorithmDetails} />
          </Tabs.TabPane>
        </TabsLog>
      </ContainerTabs>
    )
  ) : (
    <Empty />
  );
};

Details.propTypes = {
  jobId: PropTypes.string.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  node: PropTypes.object,
  isDisabledBtnRunDebug: PropTypes.bool,
};

Details.defaultProps = {
  isDisabledBtnRunDebug: false,
};
export default React.memo(Details);
