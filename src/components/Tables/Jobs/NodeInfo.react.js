import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { Tabs, JsonSwitch } from 'components/common';
import { NodeLogs, NodeInputOutput } from '.';

const DEFAULT_ALGORITHM = {};

const isSameLength = (a, b) => a.length === b.length;

const NodeInfo = ({ payload }) => {
  const dataSource = useSelector(state =>
    state.jobsKubernetesLogs.dataSource.map((value, key) => ({ key, ...value }), isSameLength),
  );

  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);
  const algorithmDetails =
    algorithmTable.find(a => a.name === payload.algorithmName) || DEFAULT_ALGORITHM;

  const taskDetails =
    payload && payload.batch && payload.batch.length > 0
      ? payload.batch
      : [{ taskId: payload.taskId, podName: payload.podName }];

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Logs" key="1">
        <NodeLogs dataSource={dataSource} taskDetails={taskDetails} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Algorithm Details" key="2">
        <JsonSwitch obj={algorithmDetails} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Input Output Details" key="3">
        <NodeInputOutput payload={payload} />
      </Tabs.TabPane>
    </Tabs>
  );
};

NodeInfo.propTypes = {
  payload: PropTypes.object,
};

export default React.memo(NodeInfo);
