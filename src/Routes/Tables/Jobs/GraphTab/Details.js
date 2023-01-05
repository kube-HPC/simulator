import React, { useMemo } from 'react';
import { removeNullUndefined } from 'utils';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { BugOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Tooltip } from 'antd';
import { FlexBox, JsonSwitch } from 'components/common';
import { useActions } from 'hooks';
import { useAlgorithmByName } from 'hooks/graphql';
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
        children: <NodeLogs node={node} taskDetails={taskDetails} />,
      },
      {
        label: 'Algorithm Details',
        key: 'algorithms-tab',
        children: (
          <OverflowContainer>
            <JsonSwitch
              obj={algorithmDetailsDataView}
              jobId={jobId}
              typeDefaultView="Table"
            />
          </OverflowContainer>
        ),
      },
      {
        label: 'Input Output Details',
        key: 'io-details-tab',
        children: (
          <NodeInputOutput payload={node} algorithm={algorithmDetails} />
        ),
      },
    ],
    [algorithmDetails, jobId, node, taskDetails]
  );

  return node ? (
    algorithmDetails && (
      <ContainerTabs>
        <TabsLog
          items={TabsItemsJson}
          defaultActiveKey="logs-tab"
          tabBarExtraContent={extra}
        />
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
