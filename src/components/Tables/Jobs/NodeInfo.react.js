import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { JsonView, Tabs, Card } from 'components/common';
import { NodeLogs, NodeInputOutput } from '.';

const DEFAULT_ALGORITHM = {};
const DEFAULT_TASK_DETAILS = [];

const NodeInfo = ({ payload }) => {
  const dataSource = useSelector(state =>
    state.jobsKubernetesLogs.dataSource.map((value, key) => ({ key, ...value }))
  );

  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);
  const algorithmDetails =
    algorithmTable.find(a => a.name === payload.algorithmName) || DEFAULT_ALGORITHM;

  const taskDetails = payload
    ? payload.batch && payload.batch.length
      ? payload.batch
      : [{ taskId: payload.taskId }]
    : DEFAULT_TASK_DETAILS;

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Logs" key="1">
        <Card>
          <NodeLogs dataSource={dataSource} taskDetails={taskDetails} />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Algorithm Details" key="2">
        <Card>
          <JsonView jsonObject={algorithmDetails} />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Input Output Details" key="3">
        <NodeInputOutput payload={payload} />
      </Tabs.TabPane>
    </Tabs>
  );
};

NodeInfo.propTypes = {
  payload: PropTypes.object
};

export default NodeInfo;
