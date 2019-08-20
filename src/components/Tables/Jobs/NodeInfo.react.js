import React from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { JsonView, Tabs } from 'components/common';
import { getKubernetesLogsData } from 'actions/jobs.action';
import NodeLogs from './NodeLogs.react';
import NodeInputOutput from './NodeInputOutput.react';
import { Card } from 'antd';

const NodeInfo = ({ payload }) => {
  const logs = useSelector(state => state.jobsKubernetesLogs);
  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);
  const algorithmDetails = algorithmTable.find(a => a.name === payload.algorithmName) || {};

  const dispatch = useDispatch();

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Logs" key="1">
        <NodeLogs
          log={logs.dataSource.asMutable()}
          taskDetails={
            payload
              ? payload.batch && payload.batch.length
                ? payload.batch
                : [{ taskId: payload.taskId }]
              : null
          }
          rerunLogs={(taskId = payload.taskId) => dispatch(getKubernetesLogsData(taskId))}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Algorithm Details" key="2">
        <Card size="small">
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
  payload: PropTypes.object.isRequired
};

export default NodeInfo;
