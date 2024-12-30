import React, { useEffect, useMemo, useState } from 'react';
import { removeNullUndefined, removeNullUndefinedCleanDeep } from 'utils';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { BugOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Tooltip, Alert } from 'antd';
import { FlexBox, JsonSwitch } from 'components/common';
import { useActions } from 'hooks';
import { useAlgorithmByVersion } from 'hooks/graphql';
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

const Details = ({ node, jobId, isDisabledBtnRunDebug = false }) => {
  const [currentTask, setCurrentTask] = useState(undefined);
  //  const algorithmDetails = useSelector(state =>
  //    selectors.algorithms.collection.byId(state, node.algorithmName)
  //  );
  let algorithmDetails = null;
  const isNodeNotBatchsAndNotStateless =
    (node?.batch === null || node?.batch?.length === 0) &&
    node?.stateType !== 'stateless';

  // node && node.algorithmName && useAlgorithmByName(node.algorithmName);
  const query = useAlgorithmByVersion(
    node.algorithmName,
    node.algorithmVersion
  );
  const [selectTabbyKind, setSelectTabByKind] = useState('logs-tab');
  query &&
    query.data &&
    query.data.algorithmsByVersion &&
    (algorithmDetails = removeNullUndefinedCleanDeep(
      query.data.algorithmsByVersion
    ));

  const { getCaching } = useActions();
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
    </FlexBox.Auto>
  ) : null;

  const algorithmDetailsDataView = useMemo(() => {
    if (algorithmDetails?.debugUrl) {
      return {
        name: algorithmDetails.name,
        version: algorithmDetails.version,
        debugUrl: algorithmDetails.debugUrl,
      };
    }

    if (algorithmDetails) return removeNullUndefined(algorithmDetails);

    return {};
  }, [algorithmDetails]);
  const TabsItemsJson = useMemo(
    () => [
      {
        label: 'Logs',
        key: 'logs-tab',
        children: (
          <NodeLogs
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            node={node}
            taskDetails={taskDetails}
            key={`${node.nodeName}-logs-tab-node-logs`}
            sideCarsDetails={algorithmDetails?.algorithm?.sideCars || null}
            NodeInputOutputTable={
              <NodeInputOutput
                isShowOneRow={isNodeNotBatchsAndNotStateless}
                payload={node}
                algorithm={algorithmDetails}
                key={`${node.nodeName}-io-details-tab-node-input-output`}
                setCurrentTask={setCurrentTask}
                modeSelect
              />
            }
          />
        ),
      },
      {
        label: 'Algorithm Details',
        key: 'algorithms-tab',
        children: (
          <OverflowContainer key={`${node.nodeName}-algorithms-tab-json"`}>
            <JsonSwitch
              obj={algorithmDetailsDataView}
              jobId={jobId}
              typeDefaultView="Table"
            />
          </OverflowContainer>
        ),
      },
      {
        label: 'Info & Results',
        key: 'io-details-tab',
        children: (
          <NodeInputOutput
            isShowOneRow={isNodeNotBatchsAndNotStateless}
            payload={node}
            algorithm={algorithmDetails}
            key={`${node.nodeName}-io-details-tab-node-input-output`}
          />
        ),
      },
    ],
    [
      currentTask,
      node,
      taskDetails,
      isNodeNotBatchsAndNotStateless,
      algorithmDetails,
      algorithmDetailsDataView,
      jobId,
    ]
  );

  const handleTabChange = activeKey => {
    setSelectTabByKind(activeKey);
  };

  useEffect(() => {
    setSelectTabByKind(node.kind === 'debug' ? 'algorithms-tab' : 'logs-tab');
  }, [node.kind]);

  return node ? (
    algorithmDetails ? (
      <ContainerTabs>
        <TabsLog
          activeKey={selectTabbyKind}
          onChange={handleTabChange}
          items={TabsItemsJson}
          defaultActiveKey={selectTabbyKind}
          tabBarExtraContent={extra}
        />
      </ContainerTabs>
    ) : node.algorithmVersion ? (
      <Empty />
    ) : (
      <Alert message="Not have algorithm version" type="error" />
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
  //  pipelienKind: PropTypes.string.isRequired,
};

export default React.memo(Details);
