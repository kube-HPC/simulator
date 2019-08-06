import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Tabs, Card } from 'antd';

import { getKubernetesLogsData } from 'actions/jobs.action';

import JsonView from 'components/common/json/JsonView.react';
import NodeLogs from './NodeLogs.react';
import NodeInputOutput from './NodeInputOutput.react';

function NodeInfo({ payload }) {
  const logs = useSelector(state => state.jobsKubernetesLogs);
  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);

  const algorithmDetails =
    algorithmTable.find(a => a.name === payload.algorithmName) || {};

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
          rerunLogs={(taskId = payload.taskId) =>
            dispatch(getKubernetesLogsData(taskId))
          }
        />
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
}

export default NodeInfo;
